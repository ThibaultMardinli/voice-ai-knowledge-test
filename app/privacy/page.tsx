import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credential privacy notice",
};

export default function PrivacyPage() {
  return (
    <div className="page-wrap">
      <section className="page-panel page-heading">
        <span className="eyebrow">CREDENTIAL PRIVACY NOTICE</span>
        <h1 className="page-title">Minimal data. Clear purpose.</h1>
        <p>
          This notice covers the Voice AI Space certification service. It should
          be read alongside the main Voice AI Space privacy policy.
        </p>
      </section>

      {[
        [
          "Data controller",
          "Voice AI Space operates the credential service. Privacy and credential questions can be sent to tbot@voiceaispace.com.",
        ],
        [
          "Data collected",
          "For the public beta: a random browser identifier, candidate-entered result name, assessment level, question identifiers, submitted options, timing, score, and domain results. For certification: authenticated account email and name, candidate-selected credential name, credential status, and security audit events are also processed.",
        ],
        [
          "Public beta cookie",
          "The beta sets a secure, HttpOnly practice identifier cookie for 30 days. It contains a random identifier—not your email—and is used to keep your session private to your browser and enforce attempt limits. A passing result is published as a credential only after you choose to claim it and sign in.",
        ],
        [
          "Public credential data",
          "If you pass and consent to issuance, your credential name, score, level, issue date, expiry date, credential ID, assessment version, and status are public at a stable verification URL. Your email address is not displayed.",
        ],
        [
          "Identity protection",
          "The service stores a keyed, non-reversible identifier derived from the authenticated email for attempt controls. Open Badges 2.0 delivery uses a credential-specific salted email hash as required for recipient matching.",
        ],
        [
          "Purpose and legal basis",
          "Data is processed to administer the requested assessment, prevent abuse, issue and verify credentials, maintain auditability, handle appeals, and meet security obligations. Public publication occurs only after the candidate declaration and a passing result.",
        ],
        [
          "Retention",
          "Credential and audit records are retained while a credential remains verifiable and for a reasonable period afterward to preserve revocation and dispute history. Unfinished and failed attempts should be periodically deleted or anonymized under the operational retention schedule.",
        ],
        [
          "Your choices and rights",
          "You may request access, correction, or deletion where applicable. A public credential can be revoked and de-indexed, but a minimal revocation record may be retained to prevent a previously issued credential from appearing valid.",
        ],
        [
          "Processors and transfers",
          "The service uses infrastructure providers to authenticate users, run the application, and store credential records. Production launch requires processor and transfer terms appropriate to the regions served.",
        ],
        [
          "Security",
          "Correct answers are excluded from public source and browser bundles. Issuance is server-side, credentials are signed, administrator actions are restricted, and security events are logged. No system can promise absolute security.",
        ],
      ].map(([title, copy]) => (
        <section className="page-panel form-block" key={title}>
          <span className="eyebrow">{title}</span>
          <p className="legal-copy">{copy}</p>
        </section>
      ))}

      <section className="page-panel form-block legal-copy">
        <strong>Legal review required before general release.</strong> This
        operational notice documents the implemented data flow; it is not a
        substitute for review by qualified privacy counsel, particularly for
        international candidates and data-subject request procedures.
      </section>
    </div>
  );
}
