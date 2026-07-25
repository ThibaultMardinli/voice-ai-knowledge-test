# Production launch checklist

Issuance must remain disabled until every required item is complete.

## Governance and claims

- [ ] Credential titles and descriptions approved by Voice AI Space.
- [ ] Public methodology, credential policy, privacy notice, and candidate
      declaration reviewed.
- [ ] Qualified counsel reviews privacy, consumer, trademark, and certification
      claims for launch jurisdictions.
- [ ] Public copy does not claim accreditation, academic credit, regulated
      status, 1EdTech certification, or LinkedIn partnership.
- [ ] Appeal, correction, accommodation, and support ownership assigned.

## Assessment content

- [ ] A new private bank is created; no item was previously published as
      practice content.
- [ ] Every level/domain exceeds the minimum blueprint count by a meaningful
      margin.
- [ ] Every approved item has an independent reviewer.
- [ ] Sources, rationales, ambiguity, localization, bias, and accessibility are
      reviewed.
- [ ] Distractor quality and answer-position balance are checked.
- [ ] Pilot results are reviewed for item difficulty and discrimination.
- [ ] Weak or exposed items are retired before general release.

## Infrastructure

- [ ] `credentials.voiceaispace.com` resolves and serves valid HTTPS.
- [ ] Production D1 migration applied and backed up.
- [ ] Runtime secrets are present and absent from source/history.
- [ ] Signing public key is available at `/.well-known/jwks.json`.
- [ ] Old public keys have a retention plan before any rotation.
- [ ] Administrator allowlist contains current operational owners.
- [ ] One-time question-import secret is removed after import.
- [ ] Edge rate limiting, logging, alerting, and abuse response are configured.

## Verification

- [ ] Open Badges 2.0 issuer, BadgeClass, and hosted Assertion validate.
- [ ] Revoked v2 Assertions return HTTP 410 and revoked metadata.
- [ ] Open Badges 3.0 credential validates against the current 1EdTech schema.
- [ ] RS256 proof validates using the published JWK and expected issuer.
- [ ] Expired, revoked, malformed, and unknown credentials render correctly.
- [ ] LinkedIn instructions use the Voice AI Space organization and exact
      credential verification URL.
- [ ] No copy promises LinkedIn autofill or a LinkedIn-issued badge.

## Candidate flow

- [ ] Sign-in, candidate declaration, start, save, resume, expiry, submit, pass,
      fail, result, credential, print, and sign-out tested.
- [ ] Concurrent and repeated submission tested.
- [ ] Attempt-limit behavior and operational override procedure tested.
- [ ] Mobile, keyboard, screen-reader, contrast, and reduced-motion checks pass.
- [ ] Browser bundles and source archive contain no production answers.
- [ ] Data-subject correction, deletion, revocation, and audit procedures tested.

## Release decision

- [ ] Named product owner signs off.
- [ ] Named assessment owner signs off.
- [ ] Named security owner signs off.
- [ ] Named privacy owner signs off.
- [ ] `ISSUANCE_ENABLED=true` is applied only after the above evidence is
      recorded.
