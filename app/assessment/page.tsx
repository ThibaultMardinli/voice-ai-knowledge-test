import type { Metadata } from "next";
import { getCandidate, requireCandidate } from "../chatgpt-auth";
import { StartAssessmentForm } from "@/components/StartAssessmentForm";
import {
  ATTEMPT_WINDOW_DAYS,
  EXAM_DURATION_MINUTES,
  EXAM_QUESTION_COUNT,
  MAX_ATTEMPTS_PER_WINDOW,
  PASS_PERCENTAGE,
} from "@/lib/policy";
import { assessmentEnabled, practiceMode } from "@/lib/runtime";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Start assessment" };

export default async function AssessmentStartPage() {
  const isPractice = practiceMode();
  const candidate = isPractice
    ? await getCandidate()
    : await requireCandidate("/assessment");

  if (!assessmentEnabled()) {
    return (
      <div className="page-wrap">
        <section className="page-panel page-heading">
          <span className="eyebrow">ASSESSMENT CLOSED</span>
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
        <span className="eyebrow">
          {isPractice ? "PUBLIC BETA" : "CANDIDATE CHECK-IN"}
        </span>
        <h1 className="page-title">
          {isPractice ? "Choose your quiz level." : "Choose your level."}
        </h1>
        <p>
          Your session contains {EXAM_QUESTION_COUNT} questions and closes after{" "}
          {EXAM_DURATION_MINUTES} minutes. You need {PASS_PERCENTAGE}% to pass.
          {isPractice
            ? " You will receive an immediate result. Pass, then sign in to claim your signed Voice AI Space credential."
            : " A passing result earns a credential."}
        </p>
      </section>
      <section className="page-panel form-block">
        <StartAssessmentForm
          defaultName={candidate?.fullName ?? ""}
          candidateEmail={candidate?.email ?? null}
          practiceMode={isPractice}
        />
      </section>
      <section className="page-panel form-block legal-copy">
        <strong>Attempt policy.</strong> Each{" "}
        {isPractice ? "browser" : "authenticated candidate"} may begin{" "}
        {MAX_ATTEMPTS_PER_WINDOW} attempts per level in a rolling{" "}
        {ATTEMPT_WINDOW_DAYS}-day period. Starting an attempt consumes one slot.
        Answers are saved to the server as you progress. Correct answers are not
        disclosed.
        {isPractice ? (
          <>
            {" "}
            <Link href="/results/latest">View your latest result →</Link>
          </>
        ) : null}
      </section>
    </div>
  );
}
