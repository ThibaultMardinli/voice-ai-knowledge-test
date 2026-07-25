import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireCandidate } from "@/app/chatgpt-auth";
import { ExamError, loadSession } from "@/lib/exam.server";
import {
  hasDistinction,
  LEVELS,
  PASS_PERCENTAGE,
  type LevelId,
} from "@/lib/policy";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Assessment result" };

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const candidate = await requireCandidate(`/results/${sessionId}`);
  try {
    const session = await loadSession(sessionId, candidate.email);
    if (session.status !== "completed") redirect(`/assessment/${sessionId}`);
    const percentage = session.percentage ?? 0;
    const passed = percentage >= PASS_PERCENTAGE;
    const level = LEVELS[session.level as LevelId];

    return (
      <div className="page-wrap">
        <section className="page-panel result-score">
          <div className="score-number">
            <div>
              <strong>{percentage}%</strong>
              <span>{session.score}/1000</span>
            </div>
          </div>
          <div className="result-copy">
            <span className="eyebrow">
              {passed
                ? hasDistinction(percentage)
                  ? "PASSED WITH DISTINCTION"
                  : "STANDARD MET"
                : "STANDARD NOT YET MET"}
            </span>
            <h1>{passed ? "Credential earned." : "Keep building."}</h1>
            <p className="legal-copy">
              {passed
                ? `You met the published standard for ${level.title}.`
                : `A minimum of ${PASS_PERCENTAGE}% is required. No credential was issued for this attempt.`}
            </p>
          </div>
        </section>

        {session.domainResults && (
          <section className="page-panel domain-results">
            {session.domainResults.map((domain) => (
              <div className="domain-result" key={domain.id}>
                <strong>{domain.name}</strong>
                <div className="progress-track">
                  <span style={{ width: `${domain.percentage}%` }} />
                </div>
                <span>
                  {domain.percentage}% · {domain.correct}/{domain.asked}
                </span>
              </div>
            ))}
          </section>
        )}

        <section className="page-panel form-block">
          {session.credentialId ? (
            <Link className="button signal" href={`/credentials/${session.credentialId}`}>
              View verified credential →
            </Link>
          ) : session.percentage && session.percentage >= PASS_PERCENTAGE ? (
            <div className="notice-box">
              You met the standard. Formal issuance is temporarily held while the
              production issuer domain completes its launch checks; this result
              remains recorded.
            </div>
          ) : (
            <Link className="button" href="/assessment">
              Return to assessment levels
            </Link>
          )}
        </section>
      </div>
    );
  } catch (error) {
    if (error instanceof ExamError && error.status === 404) notFound();
    throw error;
  }
}
