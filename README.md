# Voice AI Space Certification

A secure, publicly verifiable Voice AI knowledge credential platform issued by
[Voice AI Space](https://www.voiceaispace.com/).

## Release status

The platform is in controlled release. Credential issuance is intentionally
disabled until:

1. the private certification question bank has sufficient coverage;
2. every production item has an independent reviewer and source record;
3. `credentials.voiceaispace.com` is validated over HTTPS;
4. Open Badges 2.0 and 3.0 outputs pass schema and proof checks;
5. candidate, expiry, revocation, recovery, privacy, and accessibility checks
   are signed off.

Do not set `ISSUANCE_ENABLED=true` before the release checklist is complete.

## Trust model

- Candidate identity comes from platform-managed sign-in headers.
- Certification questions and answer keys live only in private D1 storage.
- The public repository contains no production answer bank.
- Attempts are timed, rate-limited, and scored on the server.
- Passing credentials use a stable identifier, public verification page,
  two-year validity period, revocation state, Open Badges 2.0 hosted assertion,
  and an RS256-signed Open Badges 3.0 Verifiable Credential.
- Recipient email is never published in plaintext.
- Administrator and import actions are authenticated and audit-logged.

## Local development

Use Node.js 22.13 or later.

```bash
npm install
npm run assets:badges
npm run dev
```

Local issuance requires a local D1 database plus the values documented in
`.env.example`. Never place production secrets or a production question bank in
the repository.

## Verification endpoints

- `/credentials/{credential-id}` — public human-readable verification
- `/api/open-badges/v2/issuer` — Open Badges 2.0 issuer profile
- `/api/open-badges/v2/badge-classes/{level}` — Open Badges 2.0 BadgeClass
- `/api/open-badges/v2/assertions/{credential-id}` — hosted assertion
- `/api/open-badges/v3/issuer` — Open Badges 3.0 issuer profile
- `/api/open-badges/v3/achievements/{level}` — Open Badges 3.0 Achievement
- `/api/open-badges/v3/credentials/{credential-id}` — signed VC JWT
- `/.well-known/jwks.json` — public signing keys

## Governance

The public methodology is available at `/methodology`. Internal operational
controls are documented under `docs/`.

Open Badges compatibility is a data-format claim. It does not imply that Voice
AI Space is accredited, endorsed, or conformance-certified by 1EdTech.
