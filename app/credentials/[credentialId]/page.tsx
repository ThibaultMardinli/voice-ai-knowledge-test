import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CredentialActions } from "@/components/CredentialActions";
import {
  credentialState,
  getCredential,
} from "@/lib/credentials.server";
import { verifyCredential } from "@/lib/crypto.server";
import { LEVELS, type LevelId } from "@/lib/policy";
import { publicBaseUrl } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ credentialId: string }>;
}): Promise<Metadata> {
  const { credentialId } = await params;
  const credential = await getCredential(credentialId);
  if (!credential) return { title: "Credential not found" };
  return {
    title: `${credential.recipientName} · ${credential.title}`,
    description: `Verify ${credential.recipientName}'s ${credential.title} credential issued by Voice AI Space.`,
    robots:
      credential.status === "valid"
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}

export default async function CredentialPage({
  params,
}: {
  params: Promise<{ credentialId: string }>;
}) {
  const { credentialId } = await params;
  const credential = await getCredential(credentialId);
  if (!credential) notFound();

  const state = credentialState(credential);
  let signatureVerified = false;
  if (credential.ob3Jwt) {
    try {
      await verifyCredential(credential.ob3Jwt);
      signatureVerified = true;
    } catch {
      signatureVerified = false;
    }
  }
  const level = LEVELS[credential.level as LevelId];
  const base = publicBaseUrl();
  const credentialUrl = `${base}/credentials/${credential.id}`;

  return (
    <div className="credential-page">
      <div className={`credential-status ${state}`}>
        <span>
          {state === "valid"
            ? "✓ Valid credential"
            : state === "expired"
              ? "Expired credential"
              : "Revoked credential"}
        </span>
        <span>Checked {new Date().toLocaleDateString("en-GB")}</span>
      </div>

      <article className="credential-document">
        <span className="eyebrow">VOICE AI / SPACE · VERIFIED ACHIEVEMENT</span>
        <img
          src={`/badges/${level.slug}.png`}
          alt={`${credential.title} badge`}
          width="210"
          height="210"
        />
        <h1>{credential.title}</h1>
        <p className="legal-copy">{level.credentialType}</p>
        <p className="recipient-name">{credential.recipientName}</p>
        <p className="legal-copy">
          Met the published Voice AI Space assessment standard across Voice AI
          fundamentals, real-time systems, orchestration, experience design, and
          responsible enterprise deployment.
        </p>

        <div className="credential-facts">
          <div>
            <strong>{credential.percentage}%</strong>
            <span>Assessment</span>
          </div>
          <div>
            <strong>{credential.score}</strong>
            <span>Score / 1000</span>
          </div>
          <div>
            <strong>
              {new Date(credential.issuedAt).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              })}
            </strong>
            <span>Issued</span>
          </div>
          <div>
            <strong>
              {new Date(credential.expiresAt).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              })}
            </strong>
            <span>Expires</span>
          </div>
        </div>

        {state === "revoked" && credential.revocationReason && (
          <div className="error-box" style={{ marginTop: 28 }}>
            Revocation reason: {credential.revocationReason}
          </div>
        )}

        {state === "valid" && (
          <CredentialActions
            credentialId={credential.id}
            credentialUrl={credentialUrl}
          />
        )}
      </article>

      <section className="verification-grid">
        <div>
          <span className="eyebrow">VERIFICATION CHECKS</span>
          <h2>Credential integrity</h2>
          <ul className="check-list">
            <li>
              <span>Issuer record</span>
              <strong>Voice AI Space</strong>
            </li>
            <li>
              <span>Database status</span>
              <strong>{state.toUpperCase()}</strong>
            </li>
            <li>
              <span>Open Badges 3.0 signature</span>
              <strong>{signatureVerified ? "VERIFIED" : "UNAVAILABLE"}</strong>
            </li>
            <li>
              <span>Assessment version</span>
              <strong>{credential.examVersion}</strong>
            </li>
          </ul>
        </div>
        <div>
          <span className="eyebrow">LINKEDIN DETAILS</span>
          <h2>Add accurately</h2>
          <div className="copy-grid">
            <div className="copy-row">
              <span>Name</span>
              {credential.title}
            </div>
            <div className="copy-row">
              <span>Issuing organization</span>
              Voice AI Space
            </div>
            <div className="copy-row">
              <span>Credential ID</span>
              {credential.id}
            </div>
            <div className="copy-row">
              <span>Credential URL</span>
              {credentialUrl}
            </div>
          </div>
        </div>
      </section>

      <section className="page-panel form-block legal-copy">
        <strong>Public verification, not transferable access.</strong> This URL
        is intentionally public so employers and platforms can verify the
        credential. It is not a login, password, or bearer token. Copying it
        does not change the named recipient, signed issuer record, status, or
        underlying identity binding. The recipient email and signing key are
        never published.
      </section>

      <section className="page-panel form-block legal-copy">
        This is an independent Voice AI Space knowledge credential. It is not a
        government license, academic degree, regulated professional
        qualification, or claim of 1EdTech conformance certification. Open
        Badges compatibility describes the credential format, not accreditation
        of the issuer or assessment.
      </section>
    </div>
  );
}
