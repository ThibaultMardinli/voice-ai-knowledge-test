import type { Metadata } from "next";
import {
  ATTEMPT_WINDOW_DAYS,
  DOMAINS,
  EXAM_VERSION,
  MAX_ATTEMPTS_PER_WINDOW,
  PASS_PERCENTAGE,
} from "@/lib/policy";

export const metadata: Metadata = {
  title: "Assessment methodology",
  description:
    "How Voice AI Space governs, scores, issues, and verifies its knowledge credentials.",
};

export default function MethodologyPage() {
  const controls = [
    [
      "01",
      "Private certification bank",
      "Certification questions and answer keys are stored outside the public source repository. Previously published practice questions are never used for formal issuance.",
    ],
    [
      "02",
      "Independent content review",
      "A question cannot become eligible for selection when its author and reviewer are the same person. Every approved item records its reviewer, review date, rationale, and source notes.",
    ],
    [
      "03",
      "Published blueprint",
      `Every attempt samples the same weighted blueprint: ${DOMAINS.map((domain) => `${domain.questionCount} ${domain.short}`).join(", ")}.`,
    ],
    [
      "04",
      "Controlled attempts",
      `Candidates receive ${MAX_ATTEMPTS_PER_WINDOW} attempts per level in a rolling ${ATTEMPT_WINDOW_DAYS}-day window. Sessions are timed and answers are saved server-side.`,
    ],
    [
      "05",
      "Criterion-referenced scoring",
      `${PASS_PERCENTAGE}% is the published minimum standard. The platform does not curve results against other candidates.`,
    ],
    [
      "06",
      "Versioned maintenance",
      "Every credential names its assessment version. Material changes to the blueprint, bank, or passing standard create a new version.",
    ],
    [
      "07",
      "Appeals and corrections",
      "Candidates may report a potentially ambiguous or incorrect item. Voice AI Space can investigate, correct affected results, reissue credentials, or revoke an issuance with a published reason.",
    ],
    [
      "08",
      "Open verification",
      "Anyone can check credential status. Validity, expiry, revocation, issuer metadata, Open Badges metadata, and the cryptographic public key are publicly accessible.",
    ],
  ];

  const gates = [
    "Private question bank coverage",
    "Independent item review",
    "Issuer domain and HTTPS",
    "Signing-key verification",
    "Open Badges schema validation",
    "Candidate, revocation, and recovery tests",
  ];

  return (
    <div className="editorial-page methodology-page">
      <section className="editorial-hero">
        <span className="editorial-index">Methodology · {EXAM_VERSION}</span>
        <h1>Trust is a <em>process.</em></h1>
        <p>
          A badge is only as credible as the decisions behind it. These are the
          controls Voice AI Space applies before and after issuance.
        </p>
      </section>

      <section className="methodology-body" aria-label="Assessment controls">
        <div className="methodology-body-intro">
          <span className="home-kicker">Eight controls</span>
          <h2>Evidence at every step.</h2>
          <p>Clear rules are published before an attempt and recorded with every credential.</p>
        </div>
        <div className="methodology-controls">
          {controls.map(([index, title, copy]) => (
            <article className="methodology-control" key={index}>
              <span>{index}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="methodology-gates">
        <div>
          <span className="home-kicker">Release gate</span>
          <h2>Issuance stays locked until every gate passes.</h2>
        </div>
        <ul>
          {gates.map((gate) => (
            <li key={gate}><span>{gate}</span><strong>Required</strong></li>
          ))}
        </ul>
      </section>

      <section className="methodology-note">
        <strong>Current status.</strong> The platform is in controlled release.
        This page does not claim 1EdTech conformance certification,
        accreditation, regulatory approval, academic credit, or independent
        endorsement of Voice AI Space. Those claims will not be made without
        the corresponding formal process and evidence.
      </section>
    </div>
  );
}
