import type { Metadata } from "next";
import { requireCandidate } from "../chatgpt-auth";
import { StartAssessmentForm } from "@/components/StartAssessmentForm";
import {
  ATTEMPT_WINDOW_DAYS,
  EXAM_DURATION_MINUTES,
  EXAM_QUESTION_COUNT,
  MAX_ATTEMPTS_PER_WINDOW,
  PASS_PERCENTAGE,
} from "@/lib/policy";
import { issuanceEnabled } from "@/lib/runtime";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Start assessment" };

export default async function AssessmentStartPage() {
  const candidate = await requireCandidate("/assessment");
  if (!issuanceEnabled()) {
    return (
      <div className="page-wrap">
        <section className="page-panel page-heading">
          <span className="eyebrow">ISSUANCE LOCKED</span>
          <h1 className="page-title">Review before release.</h1>
          <p>
            The platform is ready, but certification attempts remain closed
            until the private question bank has completed independent review and
            the issuer domain has passed its final verification checks.
          </p>
          <div className="button-row">
            <Link className="button" href="/methodology">
              Read the launch standard
            </Link>
            <Link className="button secondary" href="/">
              Return home
            </Link>
          </div>
        </section>
      </div>
    );
  }
  return (
    <div className="page-wrap">
      <section className="page-panel page-heading">
        <span className="eyebrow">CANDIDATE CHECK-IN</span>
        <h1 className="page-title">Choose your level.</h1>
        <p>
          Your secure session contains {EXAM_QUESTION_COUNT} questions and closes
          after {EXAM_DURATION_MINUTES} minutes. You need {PASS_PERCENTAGE}% to
          earn a credential.
        </p>
      </section>
      <section className="page-panel form-block">
        <StartAssessmentForm
          defaultName={candidate.fullName ?? ""}
          candidateEmail={candidate.email}
        />
      </section>
      <section className="page-panel form-block legal-copy">
        <strong>Attempt policy.</strong> Each authenticated candidate may begin{" "}
        {MAX_ATTEMPTS_PER_WINDOW} attempts per level in a rolling{" "}
        {ATTEMPT_WINDOW_DAYS}-day period. Starting an attempt consumes one slot.
        Answers are saved to the server as you progress. Correct answers are not
        disclosed.
      </section>
    </div>
  );
}
