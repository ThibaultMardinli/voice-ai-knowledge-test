# Security model

## Assets to protect

1. Production questions, answers, and rationales.
2. Credential signing private key.
3. Recipient identity linkage.
4. Exam sessions and submitted answers.
5. Administrator and question-import authority.
6. Credential status and revocation history.

## Trust boundaries

- **Browser:** untrusted. It receives only prompts, options, public policy, and
  the candidate's own saved selections.
- **Public repository:** untrusted for secrets. It contains code and schemas,
  never production question content or signing material.
- **Application server:** scoring and authorization boundary.
- **D1:** authoritative source for questions, attempts, results, credentials,
  and audit events.
- **Runtime secret store:** private signing key, identity HMAC key, and one-time
  import secret.
- **Public verifier:** read-only view of the minimum published credential data.

## Implemented controls

- Platform-managed sign-in identifies candidates.
- Server checks ownership on every session read or write.
- Start requests are rate-limited by identity, level, and rolling window.
- Secure random sampling and credential identifiers use the platform
  cryptographic RNG.
- Answer writes are restricted to the session's selected question IDs and valid
  option indices.
- Session expiry and status are enforced server-side.
- Scoring loads correct answers from private D1 storage.
- D1 batch operations bind result completion, issuance, and audit events.
- Recipient email matching uses a keyed HMAC internally.
- Open Badges 2.0 recipient identity uses a per-credential salted hash.
- Open Badges 3.0 output is signed with RS256 and publishes its public JWK.
- Revocation is restricted to configured administrators and audit-logged.
- Question imports require administrator identity or a temporary bearer secret.
- Approved items require a reviewer distinct from the author.
- Security headers prevent MIME sniffing; credential JSON is CORS-readable.

## Required operational controls

- Store secrets only in the production runtime secret manager.
- Rotate the question-import secret immediately after each controlled import.
- Maintain offline recovery copies of the signing key and D1 records.
- Rotate signing keys under a documented key ID; never replace a public key in
  place while valid credentials depend on it.
- Keep old public keys available until all credentials signed by them have
  expired or been reissued.
- Review audit events for unusual attempt creation, submission, import, and
  revocation patterns.
- Define database backup and tested restore procedures.
- Add edge rate limiting and abuse monitoring before general release.
- Obtain a penetration test before representing the service as production
  hardened.

## Known residual risks

- Platform sign-in establishes account identity, not government identity.
- A candidate can receive unauthorized off-screen assistance.
- Multiple accounts can circumvent per-account attempt limits.
- Multiple-choice performance is not proof of production work experience.
- A salted email hash can be subject to guessing if the underlying address is
  known; plaintext email is therefore never exposed.
- Legal and privacy obligations vary by candidate jurisdiction.
