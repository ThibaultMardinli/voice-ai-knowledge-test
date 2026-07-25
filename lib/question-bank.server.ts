import "server-only";
import { getRawDb } from "@/db";
import { newId } from "./crypto.server";
import { ExamError } from "./exam.server";
import { DOMAINS, EXAM_VERSION, isLevelId } from "./policy";

export type QuestionImport = {
  key: string;
  level: number;
  domain: number;
  prompt: string;
  options: string[];
  correctOption: number;
  rationale: string;
  status: "draft" | "approved";
  authoredBy: string;
  reviewedBy?: string;
  reviewedAt?: string;
  sourceNotes: string;
};

export async function importQuestionBank(input: {
  version: string;
  questions: QuestionImport[];
  actorId: string;
}) {
  if (input.version !== EXAM_VERSION) {
    throw new ExamError(
      `Question bank version must be ${EXAM_VERSION}.`,
      400,
      "invalid_version",
    );
  }
  if (
    !Array.isArray(input.questions) ||
    input.questions.length === 0 ||
    input.questions.length > 500
  ) {
    throw new ExamError(
      "Import must contain between 1 and 500 questions.",
      400,
      "invalid_import",
    );
  }

  const validated = input.questions.map(validateQuestion);
  const now = new Date().toISOString();
  const db = getRawDb();
  for (let offset = 0; offset < validated.length; offset += 50) {
    const chunk = validated.slice(offset, offset + 50);
    await db.batch(
      chunk.map((question) =>
        db
          .prepare(
            `INSERT INTO question_bank
              (question_key, exam_version, level, domain, prompt, options_json,
               correct_option, rationale, status, authored_by, reviewed_by,
               reviewed_at, source_notes, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(question_key) DO UPDATE SET
               exam_version = excluded.exam_version,
               level = excluded.level,
               domain = excluded.domain,
               prompt = excluded.prompt,
               options_json = excluded.options_json,
               correct_option = excluded.correct_option,
               rationale = excluded.rationale,
               status = excluded.status,
               authored_by = excluded.authored_by,
               reviewed_by = excluded.reviewed_by,
               reviewed_at = excluded.reviewed_at,
               source_notes = excluded.source_notes,
               updated_at = excluded.updated_at`,
          )
          .bind(
            question.key,
            input.version,
            question.level,
            question.domain,
            question.prompt,
            JSON.stringify(question.options),
            question.correctOption,
            question.rationale,
            question.status,
            question.authoredBy,
            question.reviewedBy ?? null,
            question.reviewedAt ?? null,
            question.sourceNotes,
            now,
            now,
          ),
      ),
    );
  }

  await db
    .prepare(
      `INSERT INTO audit_events
        (id, event_type, subject_id, actor_id, metadata, created_at)
       VALUES (?, 'question_bank.imported', ?, ?, ?, ?)`,
    )
    .bind(
      newId(),
      input.version,
      input.actorId,
      JSON.stringify({
        count: validated.length,
        approved: validated.filter((question) => question.status === "approved")
          .length,
      }),
      now,
    )
    .run();

  return {
    imported: validated.length,
    approved: validated.filter((question) => question.status === "approved")
      .length,
    version: input.version,
  };
}

export async function questionBankStatus() {
  const rows = await getRawDb()
    .prepare(
      `SELECT level, domain, status, COUNT(*) AS count
       FROM question_bank
       WHERE exam_version = ?
       GROUP BY level, domain, status
       ORDER BY level, domain, status`,
    )
    .bind(EXAM_VERSION)
    .all<{
      level: number;
      domain: number;
      status: string;
      count: number;
    }>();
  return { version: EXAM_VERSION, counts: rows.results };
}

function validateQuestion(question: QuestionImport) {
  if (!question || typeof question !== "object") invalid("Invalid question.");
  if (!/^[a-z0-9][a-z0-9._-]{5,79}$/i.test(question.key)) {
    invalid("Question key must be 6–80 safe characters.");
  }
  if (!isLevelId(Number(question.level))) invalid("Invalid question level.");
  if (!DOMAINS.some((domain) => domain.id === Number(question.domain))) {
    invalid("Invalid question domain.");
  }
  const prompt = cleanText(question.prompt, 20, 1200, "prompt");
  if (
    !Array.isArray(question.options) ||
    question.options.length !== 4
  ) {
    invalid("Every question must have exactly four options.");
  }
  const options = question.options.map((option) =>
    cleanText(option, 1, 600, "option"),
  );
  if (new Set(options.map((option) => option.toLowerCase())).size !== 4) {
    invalid("Question options must be distinct.");
  }
  if (
    !Number.isInteger(question.correctOption) ||
    question.correctOption < 0 ||
    question.correctOption > 3
  ) {
    invalid("Correct option must be 0, 1, 2, or 3.");
  }
  const rationale = cleanText(question.rationale, 20, 2000, "rationale");
  const authoredBy = cleanText(question.authoredBy, 2, 160, "author");
  const sourceNotes = cleanText(question.sourceNotes, 10, 2000, "source notes");
  if (!["draft", "approved"].includes(question.status)) {
    invalid("Question status must be draft or approved.");
  }

  let reviewedBy: string | undefined;
  let reviewedAt: string | undefined;
  if (question.status === "approved") {
    reviewedBy = cleanText(question.reviewedBy ?? "", 2, 160, "reviewer");
    if (reviewedBy.toLowerCase() === authoredBy.toLowerCase()) {
      invalid("Approved questions require an independent reviewer.");
    }
    const timestamp = Date.parse(question.reviewedAt ?? "");
    if (!Number.isFinite(timestamp) || timestamp > Date.now()) {
      invalid("Approved questions require a valid review timestamp.");
    }
    reviewedAt = new Date(timestamp).toISOString();
  }

  return {
    key: question.key,
    level: Number(question.level),
    domain: Number(question.domain),
    prompt,
    options,
    correctOption: question.correctOption,
    rationale,
    status: question.status,
    authoredBy,
    reviewedBy,
    reviewedAt,
    sourceNotes,
  } satisfies QuestionImport;
}

function cleanText(
  value: string,
  minimum: number,
  maximum: number,
  label: string,
) {
  const text = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (
    text.length < minimum ||
    text.length > maximum ||
    /[\u0000-\u001f\u007f]/.test(text)
  ) {
    invalid(`Invalid ${label}.`);
  }
  return text;
}

function invalid(message: string): never {
  throw new ExamError(message, 400, "invalid_question_import");
}
