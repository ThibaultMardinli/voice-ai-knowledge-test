import type { Metadata } from "next";
import Link from "next/link";
import { KnowledgeLibrary } from "@/components/KnowledgeLibrary";
import { GLOSSARY } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Learn Voice AI",
  description:
    "Explore the Voice AI Space knowledge library across fundamentals, real-time architecture, orchestration, conversation design, and compliance.",
};

export default function LearnPage() {
  return (
    <div className="page-wrap learn-page">
      <section className="learn-hero">
        <div>
          <h1>
            Voice AI
            <span>
              <em>Glossary</em>
            </span>
          </h1>
        </div>
        <div className="learn-intro">
          <p>
            Build fluency across the five domains behind production Voice AI.
            Search {GLOSSARY.length} concepts, study the core standard, then put
            your understanding to the test.
          </p>
          <Link className="button" href="/assessment">
            Take the quiz →
          </Link>
        </div>
      </section>
      <KnowledgeLibrary entries={GLOSSARY} />
    </div>
  );
}
