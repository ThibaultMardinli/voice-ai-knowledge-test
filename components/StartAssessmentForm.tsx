"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LEVELS } from "@/lib/policy";

export function StartAssessmentForm({
  defaultName,
  candidateEmail,
  practiceMode,
}: {
  defaultName: string;
  candidateEmail: string | null;
  practiceMode: boolean;
}) {
  const router = useRouter();
  const [candidateName, setCandidateName] = useState(defaultName);
  const [level, setLevel] = useState(1);
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/exam/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ candidateName, level, consent }),
      });
      const result = (await response.json()) as {
        sessionId?: string;
        error?: string;
      };
      if (!response.ok || !result.sessionId) {
        throw new Error(result.error ?? "Unable to start the assessment.");
      }
      router.push(`/assessment/${result.sessionId}`);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to start the assessment.",
      );
      setPending(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <div className="field">
        <label htmlFor="candidate-name">
          {practiceMode ? "Name for your result" : "Name on credential"}
        </label>
        <input
          id="candidate-name"
          value={candidateName}
          onChange={(event) => setCandidateName(event.target.value)}
          minLength={2}
          maxLength={100}
          required
        />
        {candidateEmail ? (
          <span className="legal-copy">
            Signed in as {candidateEmail}. Your email will not be shown publicly.
          </span>
        ) : (
          <span className="legal-copy">
            No account required. Your result is private to this browser.
          </span>
        )}
      </div>

      <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend>{practiceMode ? "Quiz level" : "Certification level"}</legend>
        <div className="choice-grid">
          {Object.entries(LEVELS).map(([id, definition]) => (
            <label className="choice" key={definition.slug}>
              <input
                type="radio"
                name="level"
                value={id}
                checked={level === Number(id)}
                onChange={() => setLevel(Number(id))}
              />
              <strong>{definition.title}</strong>
              <span>{definition.credentialType}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="declaration">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
        />
        <span>
          {practiceMode
            ? "I confirm this is my own attempt and consent to publication of my name, score, credential status, and issuance dates if I pass and claim the credential."
            : "I confirm that I am the named candidate, will complete this assessment without unauthorized assistance, and consent to publication of my name, score, credential status, and issuance dates if I pass."}
        </span>
      </label>

      {error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}

      <button className="button signal" type="submit" disabled={pending || !consent}>
        {pending
          ? "Creating session…"
          : practiceMode
            ? "Begin knowledge test →"
            : "Begin timed assessment →"}
      </button>
    </form>
  );
}
