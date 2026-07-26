import type { Metadata } from "next";
import { VerifyForm } from "@/components/VerifyForm";

export const metadata: Metadata = { title: "Verify a credential" };

export default function VerifyPage() {
  return (
    <div className="page-wrap">
      <section className="page-panel page-heading">
        <span className="eyebrow">PUBLIC CREDENTIAL VERIFIER</span>
        <h1 className="page-title">Verify the claim.</h1>
        <p>
          Enter a Voice AI Space credential ID or paste its verification URL.
          The result checks issuance, expiry, revocation, and cryptographic proof.
        </p>
      </section>
      <section className="page-panel form-block">
        <VerifyForm />
      </section>
    </div>
  );
}
