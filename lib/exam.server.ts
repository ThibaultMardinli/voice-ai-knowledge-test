import "server-only";
import { getRawDb } from "@/db";
import {
  candidateId,
  newCredentialId,
  newId,
  openBadgesV2Identity,
  randomSalt,
  signCredential,
} from "./crypto.server";
import { credentialV3, type CredentialRecord } from "./open-badges.server";
import {
  ATTEMPT_WINDOW_DAYS,
  DOMAINS,
  EXAM_DURATION_MINUTES,
  EXAM_VERSION,
  LEVELS,
  MAX_ATTEMPTS_PER_WINDOW,
  PASS_PERCENTAGE,
  CREDENTIAL_VALIDITY_DAYS,
  isLevelId,
  scaledScore,
  type LevelId,
} from "./policy";
import {
  assessmentEnabled,
  issuanceEnabled,
  practiceMode,
} from "./runtime";

type ExamQuestion = {
  id: number;
  domain: number;
  difficulty: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type PublicQuestion = {
  id: number;
  domain: number;
  question: string;
  options: string[];
};

export type DomainResult = {
  id: number;
  name: string;
  correct: number;
  asked: number;
  percentage: number;
};

type SessionRow = {
  id: string;
  candidate_id: string;
  candidate_name: string;
  level: number;
  exam_version: string;
  question_ids: string;
  started_at: string;
  expires_at: string;
  completed_at: string | null;
  status: string;
  score: number | null;
  percentage: number | null;
  domain_results: string | null;
  credential_id: string | null;
};

export class ExamError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code = "exam_error",
  ) {
    super(message);
  }
}

export async function startExam(input: {
  identityKey: string;
  candidateName: string;
  level: number;
  consent: boolean;
}) {
  if (!assessmentEnabled()) {
    throw new ExamError(
      "The assessment is not open yet.",
      503,
      "assessment_not_open",
    );
  }
  if (!input.consent) {
    throw new ExamError(
      "You must confirm the candidate declaration.",
      400,
      "consent_required",
    );
  }
  if (!isLevelId(input.level)) {
    throw new ExamError("Invalid certification level.", 400, "invalid_level");
  }

  const name = normalizeName(input.candidateName);
  const identity = candidateId(input.identityKey);
  const db = getRawDb();
  const windowStart = new Date(
    Date.now() - ATTEMPT_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  const attempt = await db
    .prepare(
      `SELECT COUNT(*) AS count
       FROM exam_sessions
       WHERE candidate_id = ? AND level = ? AND started_at >= ?`,
    )
    .bind(identity, input.level, windowStart)
    .first<{ count: number }>();

  if ((attempt?.count ?? 0) >= MAX_ATTEMPTS_PER_WINDOW) {
    throw new ExamError(
      `The limit is ${MAX_ATTEMPTS_PER_WINDOW} attempts per ${ATTEMPT_WINDOW_DAYS} days for each level.`,
      429,
      "attempt_limit",
    );
  }

  const selected = await selectQuestions(input.level);
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + EXAM_DURATION_MINUTES * 60 * 1000,
  );
  const sessionId = newId();

  await db.batch([
    db
      .prepare(
        `INSERT INTO exam_sessions
          (id, candidate_id, candidate_name, level, exam_version, question_ids,
           started_at, expires_at, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      )
      .bind(
        sessionId,
        identity,
        name,
        input.level,
        EXAM_VERSION,
        JSON.stringify(selected.map((question) => question.id)),
        now.toISOString(),
        expiresAt.toISOString(),
      ),
    db
      .prepare(
        `INSERT INTO audit_events
          (id, event_type, subject_id, actor_id, metadata, created_at)
         VALUES (?, 'exam.started', ?, ?, ?, ?)`,
      )
      .bind(
        newId(),
        sessionId,
        identity,
        JSON.stringify({ level: input.level, examVersion: EXAM_VERSION }),
        now.toISOString(),
      ),
  ]);

  return {
    sessionId,
    level: input.level,
    candidateName: name,
    expiresAt: expiresAt.toISOString(),
    questions: selected.map(toPublicQuestion),
  };
}

export async function loadSession(sessionId: string, identityKey: string) {
  const session = await getSession(sessionId);
  assertOwner(session, identityKey);
  const ids = parseQuestionIds(session.question_ids);
  const questionRows = await loadQuestions(ids);
  const questionMap = new Map(
    questionRows.map((question) => [question.id, question]),
  );
  const questions = ids.map((id) => questionMap.get(id)).filter(
    (question): question is ExamQuestion => Boolean(question),
  );
  if (questions.length !== ids.length) {
    throw new ExamError(
      "The assessment version is unavailable.",
      503,
      "question_bank_mismatch",
    );
  }

  const answerRows = await getRawDb()
    .prepare(
      "SELECT question_id, selected_option FROM exam_answers WHERE session_id = ?",
    )
    .bind(sessionId)
    .all<{ question_id: number; selected_option: number }>();

  return {
    id: session.id,
    candidateName: session.candidate_name,
    level: session.level,
    examVersion: session.exam_version,
    startedAt: session.started_at,
    expiresAt: session.expires_at,
    status: session.status,
    score: session.score,
    percentage: session.percentage,
    domainResults: session.domain_results
      ? (JSON.parse(session.domain_results) as DomainResult[])
      : null,
    credentialId: session.credential_id,
    questions: questions.map(toPublicQuestion),
    answers: Object.fromEntries(
      answerRows.results.map((answer: {
        question_id: number;
        selected_option: number;
      }) => [
        answer.question_id,
        answer.selected_option,
      ]),
    ),
  };
}

export async function recordAnswer(input: {
  sessionId: string;
  identityKey: string;
  questionId: number;
  selectedOption: number;
}) {
  const session = await getSession(input.sessionId);
  assertOwner(session, input.identityKey);
  assertActive(session);
  const questionIds = parseQuestionIds(session.question_ids);
  if (!questionIds.includes(input.questionId)) {
    throw new ExamError("Question is not part of this exam.", 400, "invalid_question");
  }
  if (
    !Number.isInteger(input.selectedOption) ||
    input.selectedOption < 0 ||
    input.selectedOption > 3
  ) {
    throw new ExamError("Invalid answer option.", 400, "invalid_option");
  }

  const now = new Date().toISOString();
  await getRawDb()
    .prepare(
      `INSERT INTO exam_answers
        (session_id, question_id, selected_option, answered_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(session_id, question_id)
       DO UPDATE SET selected_option = excluded.selected_option,
                     answered_at = excluded.answered_at`,
    )
    .bind(input.sessionId, input.questionId, input.selectedOption, now)
    .run();

  return { saved: true, answeredAt: now };
}

export async function submitExam(
  sessionId: string,
  identityKey: string,
  credentialEmail: string | null,
) {
  const session = await getSession(sessionId);
  assertOwner(session, identityKey);
  if (session.status === "completed") {
    return sessionResult(session);
  }
  assertActive(session);

  const ids = parseQuestionIds(session.question_ids);
  const questionRows = await loadQuestions(ids);
  const questionMap = new Map(
    questionRows.map((question) => [question.id, question]),
  );
  const selectedQuestions = ids
    .map((id) => questionMap.get(id))
    .filter((question): question is ExamQuestion => Boolean(question));
  if (selectedQuestions.length !== ids.length) {
    throw new ExamError(
      "The exam version is unavailable. No result was issued.",
      500,
      "question_bank_mismatch",
    );
  }

  const answerRows = await getRawDb()
    .prepare(
      "SELECT question_id, selected_option FROM exam_answers WHERE session_id = ?",
    )
    .bind(sessionId)
    .all<{ question_id: number; selected_option: number }>();
  const answers = new Map(
    answerRows.results.map(
      (row: { question_id: number; selected_option: number }) => [
        row.question_id,
        row.selected_option,
      ],
    ),
  );
  const correct = selectedQuestions.filter(
    (question) => answers.get(question.id) === question.correct,
  ).length;
  const percentage = Math.round((correct / selectedQuestions.length) * 100);
  const score = scaledScore(percentage);
  const passed = percentage >= PASS_PERCENTAGE;
  const domainResults = DOMAINS.map((domain) => {
    const questions = selectedQuestions.filter(
      (question) => question.domain === domain.id,
    );
    const domainCorrect = questions.filter(
      (question) => answers.get(question.id) === question.correct,
    ).length;
    return {
      id: domain.id,
      name: domain.name,
      asked: questions.length,
      correct: domainCorrect,
      percentage: Math.round((domainCorrect / questions.length) * 100),
    };
  });

  const now = new Date();
  let credential: CredentialRecord | null = null;
  const canIssueCredential =
    passed &&
    issuanceEnabled() &&
    !practiceMode() &&
    Boolean(credentialEmail);
  if (canIssueCredential && credentialEmail) {
    credential = await createCredential({
      session,
      email: credentialEmail,
      score,
      percentage,
      issuedAt: now,
    });
  }

  const db = getRawDb();
  const statements = [
    db
      .prepare(
        `UPDATE exam_sessions
         SET status = 'completed', completed_at = ?, score = ?, percentage = ?,
             domain_results = ?, credential_id = ?
         WHERE id = ? AND status = 'active'`,
      )
      .bind(
        now.toISOString(),
        score,
        percentage,
        JSON.stringify(domainResults),
        credential?.id ?? null,
        session.id,
      ),
    db
      .prepare(
        `INSERT INTO audit_events
          (id, event_type, subject_id, actor_id, metadata, created_at)
         VALUES (?, 'exam.completed', ?, ?, ?, ?)`,
      )
      .bind(
        newId(),
        session.id,
        session.candidate_id,
        JSON.stringify({
          score,
          percentage,
          passed,
          credentialId: credential?.id ?? null,
        }),
        now.toISOString(),
      ),
  ];

  if (credential) {
    statements.push(
      db
        .prepare(
          `INSERT INTO credentials
            (id, session_id, recipient_name, recipient_id,
             recipient_ob2_identity, recipient_ob2_salt, level, title,
             exam_version, score, percentage, issued_at, expires_at,
             status, ob3_jwt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'valid', ?)`,
        )
        .bind(
          credential.id,
          session.id,
          credential.recipientName,
          credential.recipientId,
          credential.recipientOb2Identity,
          credential.recipientOb2Salt,
          credential.level,
          credential.title,
          credential.examVersion,
          credential.score,
          credential.percentage,
          credential.issuedAt,
          credential.expiresAt,
          credential.ob3Jwt,
        ),
    );
  }
  await db.batch(statements);

  return {
    sessionId: session.id,
    score,
    percentage,
    correct,
    total: selectedQuestions.length,
    passed,
    domainResults,
    credentialId: credential?.id ?? null,
    issuancePending: passed && !credential,
  };
}

async function createCredential(input: {
  session: SessionRow;
  email: string;
  score: number;
  percentage: number;
  issuedAt: Date;
}) {
  const level = input.session.level as LevelId;
  const salt = randomSalt();
  const recipientUuid = newId();
  const record: CredentialRecord = {
    id: newCredentialId(LEVELS[level].slug),
    recipientName: input.session.candidate_name,
    recipientId: `urn:uuid:${recipientUuid}`,
    recipientOb2Identity: openBadgesV2Identity(input.email, salt),
    recipientOb2Salt: salt,
    level,
    title: LEVELS[level].title,
    examVersion: input.session.exam_version,
    score: input.score,
    percentage: input.percentage,
    issuedAt: input.issuedAt.toISOString(),
    expiresAt: new Date(
      input.issuedAt.getTime() +
        CREDENTIAL_VALIDITY_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString(),
    status: "valid",
    revokedAt: null,
    revocationReason: null,
    ob3Jwt: null,
  };
  record.ob3Jwt = await signCredential(
    credentialV3(record) as Record<string, unknown>,
    record.recipientId,
  );
  return record;
}

async function getSession(id: string) {
  const session = await getRawDb()
    .prepare("SELECT * FROM exam_sessions WHERE id = ?")
    .bind(id)
    .first<SessionRow>();
  if (!session) throw new ExamError("Exam session not found.", 404, "not_found");
  return session;
}

function assertOwner(session: SessionRow, identityKey: string) {
  if (session.candidate_id !== candidateId(identityKey)) {
    throw new ExamError("Exam session not found.", 404, "not_found");
  }
}

function assertActive(session: SessionRow) {
  if (session.status !== "active") {
    throw new ExamError("This exam session is closed.", 409, "session_closed");
  }
  if (Date.parse(session.expires_at) <= Date.now()) {
    throw new ExamError("This exam session has expired.", 410, "session_expired");
  }
}

async function selectQuestions(level: number) {
  const selected: ExamQuestion[] = [];
  const useLegacyPracticeBank = practiceMode();
  for (const domain of DOMAINS) {
    const rows = await getRawDb()
      .prepare(
        `SELECT id, domain, level, prompt, options_json, correct_option, rationale
         FROM question_bank
         WHERE exam_version = ? AND level = ? AND domain = ?
           AND ${
             useLegacyPracticeBank
               ? "status = 'draft' AND question_key LIKE 'legacy-public-%'"
               : "status = 'approved'"
           }`,
      )
      .bind(EXAM_VERSION, level, domain.id)
      .all<{
        id: number;
        domain: number;
        level: number;
        prompt: string;
        options_json: string;
        correct_option: number;
        rationale: string;
      }>();
    const pool = rows.results.map(questionFromRow);
    if (pool.length < domain.questionCount) {
      throw new ExamError(
        `Question bank is incomplete for ${domain.name}.`,
        503,
        "question_bank_incomplete",
      );
    }
    selected.push(...shuffle(pool).slice(0, domain.questionCount));
  }
  return shuffle(selected);
}

async function loadQuestions(ids: number[]) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => "?").join(", ");
  const rows = await getRawDb()
    .prepare(
      `SELECT id, domain, level, prompt, options_json, correct_option, rationale
       FROM question_bank
       WHERE id IN (${placeholders})`,
    )
    .bind(...ids)
    .all<{
      id: number;
      domain: number;
      level: number;
      prompt: string;
      options_json: string;
      correct_option: number;
      rationale: string;
    }>();
  return rows.results.map(questionFromRow);
}

function questionFromRow(row: {
  id: number;
  domain: number;
  level: number;
  prompt: string;
  options_json: string;
  correct_option: number;
  rationale: string;
}): ExamQuestion {
  const options = JSON.parse(row.options_json) as unknown;
  if (
    !Array.isArray(options) ||
    options.length !== 4 ||
    options.some((option) => typeof option !== "string")
  ) {
    throw new ExamError(
      `Question ${row.id} has invalid options.`,
      500,
      "invalid_question",
    );
  }
  return {
    id: row.id,
    domain: row.domain,
    difficulty: row.level,
    question: row.prompt,
    options,
    correct: row.correct_option,
    explanation: row.rationale,
  };
}

function shuffle<T>(items: T[]) {
  const output = [...items];
  for (let i = output.length - 1; i > 0; i -= 1) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    const j = Math.floor((values[0] / 2 ** 32) * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

function toPublicQuestion(question: ExamQuestion): PublicQuestion {
  return {
    id: question.id,
    domain: question.domain,
    question: question.question,
    options: [...question.options],
  };
}

function parseQuestionIds(value: string) {
  const parsed = JSON.parse(value) as unknown;
  if (
    !Array.isArray(parsed) ||
    parsed.some((id) => !Number.isInteger(id))
  ) {
    throw new ExamError("Invalid exam session.", 500, "invalid_session");
  }
  return parsed as number[];
}

function normalizeName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 100) {
    throw new ExamError(
      "Enter the name that should appear on the credential.",
      400,
      "invalid_name",
    );
  }
  if (/[\u0000-\u001f\u007f]/.test(name)) {
    throw new ExamError("Name contains unsupported characters.", 400, "invalid_name");
  }
  return name;
}

function sessionResult(session: SessionRow) {
  const percentage = session.percentage ?? 0;
  return {
    sessionId: session.id,
    score: session.score ?? scaledScore(percentage),
    percentage,
    correct: null,
    total: null,
    passed: percentage >= PASS_PERCENTAGE,
    domainResults: session.domain_results
      ? (JSON.parse(session.domain_results) as DomainResult[])
      : [],
    credentialId: session.credential_id,
    issuancePending:
      percentage >= PASS_PERCENTAGE && !session.credential_id && !issuanceEnabled(),
  };
}
