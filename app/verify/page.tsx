import type { Metadata } from "next";
import { VerifyForm } from "@/components/VerifyForm";

export const metadata: Metadata = { title: "Verify a credential" };

export default function VerifyPage() {
  return (
    <div className="editorial-page verify-page">
      <section className="verify-hero">
        <span className="editorial-index">Public credential verifier</span>
        <h1>Verify the <em>claim.</em></h1>
        <p>
          Enter a Voice AI Space credential ID or paste its verification URL.
          The result checks issuance, expiry, revocation, and cryptographic proof.
        </p>
        <VerifyForm />
      </section>

      <section className="verify-checks" aria-label="Verification checks">
        <article>
          <span>01</span><strong>Issuance</strong>
          <p>Confirms the credential exists in the issuer record.</p>
        </article>
        <article>
          <span>02</span><strong>Status</strong>
          <p>Checks expiry and whether the credential was revoked.</p>
        </article>
        <article>
          <span>03</span><strong>Integrity</strong>
          <p>Validates the published cryptographic proof.</p>
        </article>
      </section>
    </div>
  );
}
