"use client";

import { useState } from "react";

export function CredentialActions({
  credentialId,
  credentialUrl,
}: {
  credentialId: string;
  credentialUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyDetails() {
    await navigator.clipboard.writeText(
      `Credential ID: ${credentialId}\nCredential URL: ${credentialUrl}`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="button-row no-print" style={{ justifyContent: "center" }}>
      <a
        className="button signal"
        href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME"
        target="_blank"
        rel="noreferrer"
      >
        Add to LinkedIn ↗
      </a>
      <button className="button secondary" type="button" onClick={copyDetails}>
        {copied ? "Details copied" : "Copy credential details"}
      </button>
      <button className="button secondary" type="button" onClick={() => window.print()}>
        Print / save PDF
      </button>
    </div>
  );
}
