"use client";

import { useState } from "react";

export function VerifyForm() {
  const [value, setValue] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const raw = value.trim();
    if (!raw) return;
    const id = raw.includes("/")
      ? raw.split("/").filter(Boolean).at(-1) ?? raw
      : raw;
    window.location.assign(`/credentials/${encodeURIComponent(id)}`);
  }

  return (
    <form className="verify-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="credential-id">
        Credential ID or URL
      </label>
      <input
        className="verify-input"
        id="credential-id"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Credential ID or verification URL"
        autoComplete="off"
      />
      <button className="button" type="submit">
        Verify credential
      </button>
    </form>
  );
}
