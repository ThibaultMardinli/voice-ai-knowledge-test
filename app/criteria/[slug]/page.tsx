import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ATTEMPT_WINDOW_DAYS,
  CREDENTIAL_VALIDITY_DAYS,
  DOMAINS,
  EXAM_DURATION_MINUTES,
  EXAM_QUESTION_COUNT,
  EXAM_VERSION,
  LEVELS,
  MAX_ATTEMPTS_PER_WINDOW,
  PASS_PERCENTAGE,
} from "@/lib/policy";

function findLevel(slug: string) {
  return Object.values(LEVELS).find((level) => level.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const level = findLevel(slug);
  return { title: level ? `${level.title} criteria` : "Criteria not found" };
}

export default async function CriteriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const level = findLevel(slug);
  if (!level) notFound();

  return (
    <div className="page-wrap">
      <section className="page-panel page-heading">
        <span className="eyebrow">PUBLISHED CRITERIA · {EXAM_VERSION}</span>
        <h1 className="page-title">{level.title}</h1>
        <p>{level.description}</p>
      </section>

      <section className="page-panel form-block">
        <div className="standard-list">
          {[
            ["Credential type", level.credentialType],
            ["Assessment", `${EXAM_QUESTION_COUNT} multiple-choice questions`],
            ["Time limit", `${EXAM_DURATION_MINUTES} minutes`],
            ["Passing standard", `${PASS_PERCENTAGE}% or higher`],
            ["Validity", `${CREDENTIAL_VALIDITY_DAYS} days from issuance`],
            [
              "Attempt policy",
              `${MAX_ATTEMPTS_PER_WINDOW} attempts per rolling ${ATTEMPT_WINDOW_DAYS} days`,
            ],
            ["Scoring", "Server-side; unanswered questions are incorrect"],
            ["Identity", "Authenticated candidate identity required"],
          ].map(([name, value], index) => (
            <div className="standard-row" key={name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{name}</strong>
                <p>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-panel form-block">
        <span className="eyebrow">KNOWLEDGE DOMAINS</span>
        <div className="standard-list" style={{ marginTop: 18 }}>
          {DOMAINS.map((domain, index) => (
            <div className="standard-row" key={domain.id}>
              <span>0{index + 1}</span>
              <div>
                <strong>{domain.name}</strong>
                <p>{domain.questionCount} scored questions.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-panel form-block legal-copy">
        <strong>Interpretation.</strong> This credential attests that the named
        recipient met the published Voice AI Space knowledge standard on the
        recorded assessment version and date. It does not certify employment
        experience, authorize regulated practice, guarantee job performance, or
        represent academic credit. Open Badges compatibility does not imply
        endorsement or accreditation by 1EdTech.
      </section>

      <section className="page-panel form-block">
        <Link className="button signal" href="/assessment">
          Take this assessment →
        </Link>
      </section>
    </div>
  );
}
