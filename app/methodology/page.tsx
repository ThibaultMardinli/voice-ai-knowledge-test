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
  return (
    <div className="page-wrap">
      <section className="page-panel page-heading">
        <span className="eyebrow">PUBLIC METHODOLOGY · {EXAM_VERSION}</span>
        <h1 className="page-title">Trust is a process.</h1>
        <p>
          A badge is only as credible as the decisions behind it. These are the
          controls Voice AI Space applies before and after issuance.
        </p>
      </section>

      <section className="page-panel form-block">
        <div className="standard-list">
          {[
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
          ].map(([index, title, copy]) => (
            <div className="standard-row" key={index}>
              <span>{index}</span>
              <div>
                <strong>{title}</strong>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-panel form-block">
        <span className="eyebrow">RELEASE GATE</span>
        <h2 style={{ fontFamily: "Arial, sans-serif", fontSize: 36 }}>
          Issuance stays locked until every gate passes.
        </h2>
        <ul className="check-list">
          <li>
            <span>Private question bank coverage</span>
            <strong>Required</strong>
          </li>
          <li>
            <span>Independent item review</span>
            <strong>Required</strong>
          </li>
          <li>
            <span>Issuer domain and HTTPS</span>
            <strong>Required</strong>
          </li>
          <li>
            <span>Signing-key verification</span>
            <strong>Required</strong>
          </li>
          <li>
            <span>Open Badges schema validation</span>
            <strong>Required</strong>
          </li>
          <li>
            <span>Candidate, revocation, and recovery tests</span>
            <strong>Required</strong>
          </li>
        </ul>
      </section>

      <section className="page-panel form-block legal-copy">
        <strong>Current status.</strong> The platform is in controlled release.
        This page does not claim 1EdTech conformance certification,
        accreditation, regulatory approval, academic credit, or independent
        endorsement of Voice AI Space. Those claims will not be made without
        the corresponding formal process and evidence.
      </section>
    </div>
  );
}
