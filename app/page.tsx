import Link from "next/link";
import { getCandidate, chatGPTSignInPath } from "./chatgpt-auth";
import { VerifyForm } from "@/components/VerifyForm";
import {
  ATTEMPT_WINDOW_DAYS,
  CREDENTIAL_VALIDITY_DAYS,
  DOMAINS,
  EXAM_DURATION_MINUTES,
  EXAM_QUESTION_COUNT,
  EXAM_VERSION,
  LEVELS,
  MAX_ATTEMPTS_PER_WINDOW,
  PASS_PERCENTAGE,
} from "@/lib/policy";
import { questionBankStatus } from "@/lib/question-bank.server";
import { deploymentStage, issuanceEnabled } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const candidate = await getCandidate();
  const isOpen = issuanceEnabled();
  const isDevelopment = deploymentStage() === "development";
  const bankStatus = isDevelopment ? await questionBankStatus() : null;
  const bankQuestionCount =
    bankStatus?.counts.reduce((total, row) => total + Number(row.count), 0) ?? 0;
  const assessmentHref = isOpen
    ? candidate
      ? "/assessment"
      : chatGPTSignInPath("/assessment")
    : "/methodology";

  return (
    <>
      {isDevelopment ? (
        <section className="preview-access" aria-label="Development question bank">
          <div className="preview-access-count">{bankQuestionCount}</div>
          <div>
            <strong>Questions are in the private Question Bank</strong>
            <p>
              Open the administrator dashboard to search questions, reveal
              answers and rationales, or import reviewed replacements.
            </p>
          </div>
          <Link className="button" href="/admin/questions">
            Open Question Bank →
          </Link>
        </section>
      ) : null}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">VOICE AI KNOWLEDGE STANDARD · {EXAM_VERSION}</span>
          <h1>
            Prove what you know.
            <span>Show how you think.</span>
          </h1>
          <p>
            A rigorous, independent assessment for the people designing,
            building, and operating the Voice AI ecosystem.
          </p>
          <div className="hero-actions">
            <Link className="button signal" href={assessmentHref}>
              {isOpen
                ? candidate
                  ? "Start assessment"
                  : "Sign in to certify"
                : "Review the release standard"}{" "}
              →
            </Link>
            <Link className="button secondary" href="/verify">
              Verify a credential
            </Link>
          </div>
        </div>
        <aside className="hero-rail" aria-label="Credential trust properties">
          {[
            ["FORMAT", "Open Badges 3.0 + 2.0"],
            ["ASSESSMENT", `${EXAM_QUESTION_COUNT} server-scored questions`],
            ["VALIDITY", `${Math.round(CREDENTIAL_VALIDITY_DAYS / 365)} years`],
            ["VERIFICATION", "Public, signed, revocable"],
          ].map(([label, value]) => (
            <div className="trust-item" key={label}>
              <span className="eyebrow">{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </aside>
      </section>

      <section className="section" id="credentials">
        <div className="section-head">
          <div>
            <span className="eyebrow">THE CREDENTIAL PATH</span>
            <h2>Four levels. One standard.</h2>
          </div>
          <p>
            Each credential is independently earned. Choose the level that
            reflects the decisions you make in real work.
          </p>
        </div>
        <div className="credential-grid">
          {Object.entries(LEVELS).map(([id, level], index) => (
            <article className="credential-card" key={level.slug}>
              <div className="credential-index">
                <span>0{index + 1}</span>
                <span>{level.label.toUpperCase()}</span>
              </div>
              <img
                src={`/badges/${level.slug}.png`}
                alt={`${level.title} credential badge`}
                width="132"
                height="132"
              />
              <h3>{level.title}</h3>
              <p>{level.description}</p>
              <div className="card-footer">
                <span>{level.credentialType}</span>
                <Link href={`/criteria/${level.slug}`}>Criteria →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="standard">
        <div className="section-head">
          <div>
            <span className="eyebrow">ASSESSMENT STANDARD</span>
            <h2>Evidence, not decoration.</h2>
          </div>
          <p>
            The rules are published before the attempt and recorded with every
            credential.
          </p>
        </div>
        <div className="standard-grid">
          <div className="standard-statement">
            <span className="eyebrow">OUR COMMITMENT</span>
            <h3>No vanity badges.</h3>
            <p>
              Correct answers never reach the browser. Results are scored on
              the server, signed by the issuer, and independently verifiable.
            </p>
          </div>
          <div className="standard-list">
            {[
              [
                "01",
                `${EXAM_QUESTION_COUNT} questions · ${EXAM_DURATION_MINUTES} minutes`,
                "A stratified blueprint covers all five published Voice AI domains.",
              ],
              [
                "02",
                `${PASS_PERCENTAGE}% pass threshold`,
                "No partial certificate is issued below the published standard.",
              ],
              [
                "03",
                `${MAX_ATTEMPTS_PER_WINDOW} attempts per ${ATTEMPT_WINDOW_DAYS} days`,
                "Attempt limits protect the integrity of the question bank.",
              ],
              [
                "04",
                "Identity-bound issuance",
                "Candidate identity is authenticated; email is stored as a non-reversible identifier and never displayed.",
              ],
              [
                "05",
                "Signed and revocable",
                "Every credential has a stable ID, cryptographic proof, expiry date, and revocation status.",
              ],
              [
                "06",
                "Versioned knowledge",
                `Every result records the assessment version (${EXAM_VERSION}) used at issuance.`,
              ],
            ].map(([index, title, copy]) => (
              <div className="standard-row" key={index}>
                <span>{index}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">EXAM BLUEPRINT</span>
            <h2>Full-stack Voice AI judgment.</h2>
          </div>
          <p>
            Not just models. Not just prompts. The assessment spans the complete
            system and its consequences.
          </p>
        </div>
        <div className="standard-list" style={{ border: "2px solid var(--ink)", borderTop: 0 }}>
          {DOMAINS.map((domain, index) => (
            <div className="standard-row" key={domain.id}>
              <span>0{index + 1}</span>
              <div>
                <strong>{domain.name}</strong>
                <p>{domain.questionCount} scored questions in every attempt.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <span className="eyebrow">READY WHEN YOU ARE</span>
          <h2>Your knowledge should travel with you.</h2>
        </div>
        <Link className="button" href={assessmentHref}>
          {isOpen
            ? candidate
              ? "Choose your level"
              : "Sign in to begin"
            : "See launch controls"}{" "}
          →
        </Link>
      </section>

      <section className="section page-panel form-block">
        <div className="section-head" style={{ paddingTop: 0 }}>
          <div>
            <span className="eyebrow">PUBLIC VERIFIER</span>
            <h2 style={{ fontSize: "38px" }}>Check any credential.</h2>
          </div>
        </div>
        <div style={{ paddingTop: 24 }}>
          <VerifyForm />
        </div>
      </section>
    </>
  );
}
