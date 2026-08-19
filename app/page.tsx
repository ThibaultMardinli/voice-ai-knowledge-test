import Link from "next/link";
import { getCandidate, chatGPTSignInPath } from "./chatgpt-auth";
import {
  CREDENTIAL_VALIDITY_DAYS,
  DOMAINS,
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
          <span>total questions</span>
        </div>
        <div>
          <strong>{Object.keys(LEVELS).length}</strong>
          <span>credential levels</span>
        </div>
        <div>
          <strong>{PASS_PERCENTAGE}%</strong>
          <span>required to pass</span>
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

      <section className="home-resources" aria-labelledby="home-resources-title">
        <div className="home-resources-intro">
          <span className="home-kicker">Trust and transparency</span>
          <h2 id="home-resources-title">Understand the standard. Check the proof.</h2>
          <p>
            The rules behind every assessment and the public record behind every
            credential have their own dedicated space.
          </p>
        </div>
        <div className="home-resource-grid">
          <Link className="home-resource-card" href="/methodology">
            <span className="home-resource-index">01</span>
            <div>
              <span className="home-resource-label">Methodology</span>
              <h3>See how trust is built.</h3>
              <p>Review scoring, governance, question controls, and release gates.</p>
            </div>
            <span className="home-resource-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="home-resource-card" href="/verify">
            <span className="home-resource-index">02</span>
            <div>
              <span className="home-resource-label">Verification</span>
              <h3>Check a credential.</h3>
              <p>Confirm issuance, expiry, revocation status, and cryptographic proof.</p>
            </div>
            <span className="home-resource-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
        <Link className="home-button home-button-primary home-resources-cta" href={assessmentHref}>
          {assessmentLabel} →
        </Link>
      </section>
    </div>
  );
}
