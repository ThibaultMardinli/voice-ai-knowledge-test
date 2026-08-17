"use client";

import { useMemo, useState } from "react";
import type { GlossaryEntry } from "@/lib/glossary";
import { DOMAINS } from "@/lib/policy";

const FILTERS = [
  { id: "all", label: "All concepts" },
  ...DOMAINS.map((domain) => ({
    id: String(domain.id),
    label: domain.short,
  })),
  { id: "ecosystem", label: "Broader ecosystem" },
];

export function KnowledgeLibrary({
  entries,
}: {
  entries: readonly GlossaryEntry[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesQuery =
        !normalizedQuery ||
        entry.term.toLowerCase().includes(normalizedQuery) ||
        entry.full?.toLowerCase().includes(normalizedQuery) ||
        entry.definition.toLowerCase().includes(normalizedQuery);
      const matchesFilter =
        filter === "all" ||
        (filter === "ecosystem"
          ? !entry.domain
          : entry.domain === Number(filter));
      return matchesQuery && matchesFilter;
    });
  }, [entries, filter, query]);

  const gridClassName = [
    "knowledge-grid",
    `knowledge-grid--desktop-remainder-${filtered.length % 3}`,
    `knowledge-grid--tablet-remainder-${filtered.length % 2}`,
    filtered.length > 3 ? "knowledge-grid--desktop-multiple-rows" : "",
    filtered.length > 2 ? "knowledge-grid--tablet-multiple-rows" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <section className="knowledge-controls" aria-label="Knowledge filters">
        <div className="knowledge-control-row">
          <form
            className="knowledge-search"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="vocabulary-search">
              Search vocabulary
            </label>
            <span className="knowledge-search-icon" aria-hidden="true" />
            <input
              id="vocabulary-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search vocabulary"
            />
            <button type="submit">Search</button>
          </form>
          <div className="knowledge-status" aria-live="polite">
            <strong>{entries.length}</strong>
            <span>concepts</span>
            {filtered.length !== entries.length ? (
              <span className="knowledge-status-result">{filtered.length} shown</span>
            ) : null}
          </div>
        </div>
        <div className="knowledge-filters" aria-label="Filter by domain" role="tablist">
          {FILTERS.map((item) => (
            <button
              className={filter === item.id ? "active" : ""}
              key={item.id}
              type="button"
              onClick={() => {
                setQuery("");
                setFilter(item.id);
              }}
              aria-selected={filter === item.id}
              role="tab"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {filtered.length ? (
        <section className={gridClassName}>
          {filtered.map((entry) => {
            const domain = DOMAINS.find((item) => item.id === entry.domain);
            return (
              <article
                className="knowledge-card"
                key={`${entry.domain ?? "ecosystem"}-${entry.term}`}
              >
                <div className="knowledge-card-meta">
                  <span>{domain?.short ?? "Ecosystem"}</span>
                  {entry.exam ? <span>Core standard</span> : null}
                </div>
                <h2>{entry.term}</h2>
                {entry.full ? <h3>{entry.full}</h3> : null}
                <p>{entry.definition}</p>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="knowledge-empty">
          <span className="eyebrow">NO MATCHES</span>
          <h2>Try another term or domain.</h2>
          <button
            className="button"
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            Reset library
          </button>
        </section>
      )}
    </>
  );
}
