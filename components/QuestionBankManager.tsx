"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminQuestion, QuestionImport } from "@/lib/question-bank.server";
import { DOMAINS, LEVELS } from "@/lib/policy";

const templateQuestion: QuestionImport = {
  key: "vas-draft-001",
  level: 0,
  domain: 1,
  prompt: "Replace this text with the complete assessment question.",
  options: [
    "Replace with option A",
    "Replace with option B",
    "Replace with option C",
    "Replace with option D",
  ],
  correctOption: 0,
  rationale:
    "Explain why the selected answer is correct and why the distractors fail.",
  status: "draft",
  authoredBy: "Author name",
  sourceNotes: "Cite the authoritative source and the date it was reviewed.",
};

export function QuestionBankManager({
  initialQuestions,
  version,
}: {
  initialQuestions: AdminQuestion[];
  version: string;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const filteredQuestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return initialQuestions.filter((question) => {
      if (statusFilter !== "all" && question.status !== statusFilter) {
        return false;
      }
      if (levelFilter !== "all" && question.level !== Number(levelFilter)) {
        return false;
      }
      if (!normalizedQuery) return true;
      return [question.key, question.prompt, question.authoredBy]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [initialQuestions, levelFilter, query, statusFilter]);

  const approvedCount = initialQuestions.filter(
    (question) => question.status === "approved",
  ).length;

  function loadTemplate() {
    setImportText(
      JSON.stringify({ version, questions: [templateQuestion] }, null, 2),
    );
    setMessage(null);
  }

  async function readFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 2_000_000) {
      setMessage({ kind: "error", text: "The JSON file must be under 2 MB." });
      return;
    }
    setImportText(await file.text());
    setMessage(null);
  }

  async function importQuestions() {
    setMessage(null);
    let payload: unknown;
    try {
      payload = JSON.parse(importText);
    } catch {
      setMessage({ kind: "error", text: "The import is not valid JSON." });
      return;
    }

    if (
      !payload ||
      typeof payload !== "object" ||
      !Array.isArray((payload as { questions?: unknown }).questions)
    ) {
      setMessage({
        kind: "error",
        text: 'Expected an object containing "version" and a "questions" array.',
      });
      return;
    }

    setIsImporting(true);
    try {
      const response = await fetch("/api/admin/question-bank/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        error?: string;
        imported?: number;
        approved?: number;
      };
      if (!response.ok) throw new Error(result.error ?? "Import failed.");

      setMessage({
        kind: "success",
        text: `${result.imported ?? 0} questions imported; ${
          result.approved ?? 0
        } approved.`,
      });
      setImportText("");
      if (fileInput.current) fileInput.current.value = "";
      router.refresh();
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "Import failed.",
      });
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <>
      <div className="bank-summary" aria-label="Question bank summary">
        <div>
          <span>Total</span>
          <strong>{initialQuestions.length}</strong>
        </div>
        <div>
          <span>Approved</span>
          <strong>{approvedCount}</strong>
        </div>
        <div>
          <span>Draft</span>
          <strong>{initialQuestions.length - approvedCount}</strong>
        </div>
        <div>
          <span>Release</span>
          <strong className="locked-label">Locked</strong>
        </div>
      </div>

      <section className="admin-block">
        <div className="admin-block-head">
          <div>
            <span className="eyebrow">PRIVATE IMPORT</span>
            <h2>Add or update questions</h2>
          </div>
          <p>
            Import draft questions first. Approval requires a different
            reviewer and a review timestamp.
          </p>
        </div>
        <div className="import-controls">
          <div className="button-row">
            <button className="button secondary" type="button" onClick={loadTemplate}>
              Load JSON template
            </button>
            <label className="button secondary file-button">
              Choose JSON file
              <input
                ref={fileInput}
                type="file"
                accept="application/json,.json"
                onChange={(event) => void readFile(event.target.files?.[0])}
              />
            </label>
          </div>
          <textarea
            aria-label="Question bank JSON"
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            placeholder='{"version":"VAS-2026.1","questions":[...]}'
            spellCheck={false}
          />
          <div className="import-footer">
            <p>
              Existing keys are updated. Keep production question files out of
              public GitHub repositories.
            </p>
            <button
              className="button signal"
              type="button"
              disabled={!importText.trim() || isImporting}
              onClick={() => void importQuestions()}
            >
              {isImporting ? "Importing…" : "Validate and import"}
            </button>
          </div>
          {message ? (
            <p className={`admin-message ${message.kind}`} role="status">
              {message.text}
            </p>
          ) : null}
        </div>
      </section>

      <section className="admin-block">
        <div className="admin-block-head">
          <div>
            <span className="eyebrow">BANK CONTENTS</span>
            <h2>Review questions</h2>
          </div>
          <p>
            The legacy public questions are excluded because their answer key
            was already exposed.
          </p>
        </div>
        <div className="bank-filters">
          <input
            type="search"
            placeholder="Search key, prompt, or author"
            aria-label="Search questions"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter by level"
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value)}
          >
            <option value="all">All levels</option>
            {Object.entries(LEVELS).map(([id, level]) => (
              <option key={id} value={id}>
                {level.title}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="approved">Approved</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {filteredQuestions.length ? (
          <div className="question-list">
            {filteredQuestions.map((question) => (
              <details className="admin-question" key={question.key}>
                <summary>
                  <span className={`status-dot ${question.status}`} />
                  <span>
                    <small>
                      {question.key} · Level {question.level} ·{" "}
                      {DOMAINS.find((domain) => domain.id === question.domain)?.short}
                    </small>
                    <strong>{question.prompt}</strong>
                  </span>
                  <em>{question.status}</em>
                </summary>
                <div className="question-detail">
                  <ol type="A">
                    {question.options.map((option, index) => (
                      <li
                        className={
                          index === question.correctOption ? "correct-option" : ""
                        }
                        key={`${question.key}-${index}`}
                      >
                        {option}
                        {index === question.correctOption ? (
                          <strong> Correct answer</strong>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                  <div className="question-notes">
                    <div>
                      <span>Rationale</span>
                      <p>{question.rationale}</p>
                    </div>
                    <div>
                      <span>Source</span>
                      <p>{question.sourceNotes}</p>
                    </div>
                    <div>
                      <span>Governance</span>
                      <p>
                        Authored by {question.authoredBy}
                        {question.reviewedBy
                          ? ` · Reviewed by ${question.reviewedBy}`
                          : " · Independent review pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="bank-empty">
            <span>00</span>
            <div>
              <h3>
                {initialQuestions.length
                  ? "No questions match these filters."
                  : "The private bank is empty."}
              </h3>
              <p>
                {initialQuestions.length
                  ? "Change the filters to see other records."
                  : "Load the JSON template above to see the required format, then import the first reviewed draft set."}
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
