import Link from "next/link";
import { getCandidate, chatGPTSignInPath } from "./chatgpt-auth";
import {
  CREDENTIAL_VALIDITY_DAYS,
  DOMAINS,
  EXAM_DURATION_MINUTES,
  EXAM_QUESTION_COUNT,
  EXAM_VERSION,
  LEVELS,
  PASS_PERCENTAGE,
} from "@/lib/policy";
import { questionBankStatus } from "@/lib/question-bank.server";
import { assessmentEnabled, isAdmin, practiceMode } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const candidate = await getCandidate();
  const isOpen = assessmentEnabled();
  const isPractice = practiceMode();
  const isAdminUser = candidate ? isAdmin(candidate.email) : false;
  const bankStatus = isAdminUser ? await questionBankStatus() : null;
  const bankQuestionCount =
    bankStatus?.counts.reduce((total, row) => total + Number(row.count), 0) ?? 0;
  const assessmentHref = isPractice
    ? "/assessment"
    : isOpen
      ? candidate
        ? "/assessment"
        : chatGPTSignInPath("/assessment")
      : "/methodology";
  const assessmentLabel = isPractice
    ? "Take the quiz"
    : isOpen
      ? candidate
        ? "Start assessment"
        : "Sign in to certify"
      : "Review the standard";

  return (
    <div className="home-page">
      {isAdminUser ? (
        <section className="preview-access" aria-label="Development question bank">
          <div className="preview-access-count">{bankQuestionCount}</div>
          <div>
            <strong>Private question bank</strong>
            <p>Review, search, and manage the current assessment questions.</p>
          </div>
          <Link className="button" href="/admin/questions">
            Open Question Bank →
          </Link>
        </section>
      ) : null}

      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-kicker">Voice AI Space Certification</span>
          <h1>
            Voice AI
            <span>
              <em>Knowledge</em> test
            </span>
          </h1>
          <p>
            A practical knowledge assessment for the people building, designing,
            and operating real Voice AI systems.
          </p>
          <div className="home-actions">
            <Link className="home-button home-button-primary" href="/learn">
              Learn first
            </Link>
            <Link className="home-button home-button-secondary" href={assessmentHref}>
              {assessmentLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <aside className="home-hero-note">
          <span className="home-note-index">01</span>
          <div>
            <strong>Independent. Verifiable. Built for the ecosystem.</strong>
            <p>
              Earn a credential you can share on LinkedIn and verify from a
              permanent public record.
            </p>
          </div>
        </aside>
      </section>

      <section className="home-proof" aria-label="Assessment summary">
        <div>
          <strong>{EXAM_QUESTION_COUNT}</strong>
          <span>questions</span>
        </div>
        <div>
          <strong>{EXAM_DURATION_MINUTES}</strong>
          <span>minutes</span>
        </div>
        <div>
          <strong>{PASS_PERCENTAGE}%</strong>
          <span>pass score</span>
        </div>
        <div>
          <strong>{Math.round(CREDENTIAL_VALIDITY_DAYS / 365)} years</strong>
          <span>credential validity</span>
        </div>
      </section>

      <section className="home-section" id="credentials">
        <div className="home-section-intro">
          <span className="home-kicker">Credential path</span>
          <h2>Start where you are. Keep going.</h2>
          <p>
            Four clear levels follow your growth from core vocabulary to
            production-grade system design.
          </p>
        </div>

        <div className="home-credential-grid">
          {Object.entries(LEVELS).map(([id, level], index) => {
            const levelName = level.title.replace(/^Voice AI\s+/, "");
            return (
              <article className="home-credential-card" key={id}>
                <div className="home-card-topline">
                  <span>0{index + 1}</span>
                  <span>{level.label}</span>
                </div>
                <div className="home-card-body">
                  <img
                    src={`/badges/${level.slug}.png`}
                    alt=""
                    width="88"
                    height="88"
                  />
                  <div>
                    <h3>
                      <span>Voice AI</span>
                      <span>{levelName}</span>
                    </h3>
                    <p>{level.description}</p>
                  </div>
                </div>
                <div className="home-card-footer">
                  <span>{level.credentialType}</span>
                  <Link href={`/criteria/${level.slug}`}>View criteria →</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-standard" id="standard">
        <div className="home-standard-copy">
          <span className="home-kicker">Assessment standard · {EXAM_VERSION}</span>
          <h2>Evidence, not decoration.</h2>
          <p>
            No vanity badges: questions are server-scored across the full Voice
            AI stack. Every issued credential is identity-bound, signed, public,
            and revocable.
            The record supports Open Badges 3.0 + 2.0.
          </p>
          <Link className="home-text-link" href="/methodology">
            Read the methodology →
          </Link>
        </div>
        <div className="home-domains" aria-label="Assessment domains">
          {DOMAINS.map((domain, index) => (
            <div key={domain.id}>
              <span>0{index + 1}</span>
              <strong>{domain.name}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="home-closing">
        <div>
          <span className="home-kicker">Ready when you are</span>
          <h2>Turn what you know into proof you can share.</h2>
        </div>
        <div className="home-closing-actions">
          <Link className="home-button home-button-light" href={assessmentHref}>
            {assessmentLabel} →
          </Link>
          <Link className="home-text-link home-text-link-light" href="/verify">
            Verify a credential
          </Link>
        </div>
      </section>
    </div>
  );
}
