"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DOMAINS } from "@/lib/policy";
import type { PublicQuestion } from "@/lib/exam.server";

type Session = {
  id: string;
  candidateName: string;
  level: number;
  examVersion: string;
  expiresAt: string;
  status: string;
  questions: PublicQuestion[];
  answers: Record<string, number>;
};

export function ExamRunner({ session }: { session: Session }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(
    Object.fromEntries(
      Object.entries(session.answers).map(([key, value]) => [Number(key), value]),
    ),
  );
  const [remaining, setRemaining] = useState(
    Math.max(0, Math.floor((Date.parse(session.expiresAt) - Date.now()) / 1000)),
  );
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = session.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / session.questions.length) * 100;
  const domain = useMemo(
    () => DOMAINS.find((item) => item.id === question?.domain),
    [question],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(
        Math.max(
          0,
          Math.floor((Date.parse(session.expiresAt) - Date.now()) / 1000),
        ),
      );
    }, 1000);
    return () => window.clearInterval(interval);
  }, [session.expiresAt]);

  useEffect(() => {
    if (remaining === 0 && !submitting) {
      void submit();
    }
    // Submit once when the timer reaches zero.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  async function choose(option: number) {
    if (!question || remaining <= 0 || submitting) return;
    const previous = answers[question.id];
    setAnswers((current) => ({ ...current, [question.id]: option }));
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/exam/sessions/${session.id}/answers`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            questionId: question.id,
            selectedOption: option,
          }),
        },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Answer was not saved.");
    } catch (caught) {
      setAnswers((current) => {
        const next = { ...current };
        if (previous === undefined) delete next[question.id];
        else next[question.id] = previous;
        return next;
      });
      setError(caught instanceof Error ? caught.message : "Answer was not saved.");
    } finally {
      setSaving(false);
    }
  }

  async function submit() {
    if (submitting) return;
    if (
      remaining > 0 &&
      answeredCount < session.questions.length &&
      !window.confirm(
        `${session.questions.length - answeredCount} questions are unanswered. Submit anyway?`,
      )
    ) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/exam/sessions/${session.id}/submit`,
        { method: "POST" },
      );
      const result = (await response.json()) as {
        error?: string;
        credentialId?: string | null;
      };
      if (!response.ok) {
        throw new Error(result.error ?? "Assessment could not be submitted.");
      }
      router.replace(`/results/${session.id}`);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Assessment could not be submitted.",
      );
      setSubmitting(false);
    }
  }

  if (!question) return null;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="exam-shell">
      <div className="exam-top">
        <span>
          {answeredCount}/{session.questions.length} answered
          {saving ? " · saving…" : ""}
        </span>
        <div className="progress-track" aria-label={`${Math.round(progress)}% complete`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <span className="timer" aria-live="polite">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>

      <section className="question-panel">
        <div className="question-meta">
          <span>
            QUESTION {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {session.questions.length}
          </span>
          <span>{domain?.name.toUpperCase()}</span>
        </div>
        <div className="question-copy">{question.question}</div>
        <div className="answers" role="radiogroup" aria-label="Answer options">
          {question.options.map((option, index) => (
            <button
              className={`answer ${answers[question.id] === index ? "selected" : ""}`}
              key={option}
              type="button"
              role="radio"
              aria-checked={answers[question.id] === index}
              onClick={() => choose(index)}
              disabled={saving || submitting}
            >
              <span className="answer-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}

      <div className="exam-actions">
        <button
          className="button secondary"
          type="button"
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          disabled={currentIndex === 0 || submitting}
        >
          ← Previous
        </button>
        {currentIndex < session.questions.length - 1 ? (
          <button
            className="button"
            type="button"
            onClick={() =>
              setCurrentIndex((index) =>
                Math.min(session.questions.length - 1, index + 1),
              )
            }
            disabled={submitting}
          >
            Next →
          </button>
        ) : (
          <button
            className="button signal"
            type="button"
            onClick={submit}
            disabled={submitting || saving}
          >
            {submitting ? "Scoring…" : "Submit assessment"}
          </button>
        )}
      </div>
    </div>
  );
}
