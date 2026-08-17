import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("defines the public credential standard", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /Open Badges 3\.0 \+ 2\.0/i);
  assert.match(page, /Evidence, not decoration/i);
  assert.match(page, /No vanity badges/i);
});

test("restores the public learning library without assessment answers", async () => {
  const [page, library, glossary, home] = await Promise.all([
    readFile(new URL("../app/learn/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../components/KnowledgeLibrary.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../lib/glossary.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Voice AI/);
  assert.match(page, /<em>Glossary<\/em>/);
  assert.match(library, /Search the library/);
  assert.match(glossary, /Automatic Speech Recognition/);
  assert.doesNotMatch(glossary, /correct_option|correct:\s*\d|options:/);
  assert.ok(home.indexOf('href="/learn"') < home.indexOf("href={assessmentHref}"));
});

test("supports anonymous beta attempts with private browser identity", async () => {
  const [route, identity, exam] = await Promise.all([
    readFile(new URL("../app/api/exam/start/route.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../lib/assessment-identity.server.ts", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../lib/exam.server.ts", import.meta.url), "utf8"),
  ]);
  assert.match(route, /getAssessmentIdentity/);
  assert.match(route, /createPracticeIdentity/);
  assert.match(route, /set-cookie/i);
  assert.match(route, /authentication_required/);
  assert.match(route, /status: 401/);
  assert.ok(
    route.indexOf("getAssessmentIdentity") < route.indexOf("await request.json()"),
    "assessment identity must be established before request data is processed",
  );
  assert.match(identity, /"HttpOnly"/);
  assert.match(identity, /"Secure"/);
  assert.match(identity, /"SameSite=Lax"/);
  assert.match(exam, /legacy-public-%/);
  assert.match(exam, /claimCredential/);
  assert.match(exam, /INSERT OR IGNORE INTO credentials/);
});

test("keeps the question bank behind the administrator allowlist", async () => {
  const [page, route, home, layout] = await Promise.all([
    readFile(
      new URL("../app/admin/questions/page.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/api/admin/question-bank/import/route.ts",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /requireCandidate\(\"\/admin\/questions\"\)/);
  assert.match(page, /isAdmin\(candidate\.email\)/);
  assert.match(route, /adminAuthorized/);
  assert.match(route, /Not found/);
  assert.match(home, /Open Question Bank/);
  assert.match(layout, /Question Bank/);
});

test("uses the Voice AI Space monochrome brand palette", async () => {
  const [styles, badgeGenerator] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(
      new URL("../scripts/generate-badges.mjs", import.meta.url),
      "utf8",
    ),
  ]);
  assert.match(styles, /--ink: #020817/);
  assert.match(styles, /--paper: #ffffff/);
  assert.doesNotMatch(styles, /#c7ff35|#f6f5ef|#7da600/i);
  assert.doesNotMatch(badgeGenerator, /#c7ff35|#f6f5ef/i);
});

test("publishes the non-accreditation disclosure with criteria", async () => {
  const criteria = await readFile(
    new URL("../app/criteria/[slug]/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(criteria, /does not imply/);
  assert.match(criteria, /endorsement or accreditation by 1EdTech/);
});

test("does not keep certification answers in source or browser bundles", async () => {
  const assetDirectory = new URL("../dist/client/assets/", import.meta.url);
  const files = await readdir(assetDirectory);
  const javascript = (
    await Promise.all(
      files
        .filter((file) => file.endsWith(".js"))
        .map((file) => readFile(new URL(file, assetDirectory), "utf8")),
    )
  ).join("\n");

  assert.doesNotMatch(javascript, /ASR stands for Automatic Speech Recognition/);
  assert.doesNotMatch(javascript, /The standard cascaded voice pipeline is/);
  assert.doesNotMatch(javascript, /correct:\s*\d/);

  const serverBundle = await readFile(
    new URL("../dist/server/index.js", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    serverBundle,
    /ASR stands for Automatic Speech Recognition/,
  );
  assert.match(serverBundle, /FROM question_bank/);

  await assert.rejects(
    readFile(new URL("../VoiceAISpaceExam.jsx", import.meta.url), "utf8"),
  );
  await assert.rejects(
    readFile(new URL("../lib\/questions.server.ts", import.meta.url), "utf8"),
  );
});

test("packages hosting metadata, migration, and all badge images", async () => {
  const [hosting, migration] = await Promise.all([
    readFile(new URL("../dist/.openai/hosting.json", import.meta.url), "utf8"),
    readFile(
      new URL("../dist/.openai/drizzle/0000_initial.sql", import.meta.url),
      "utf8",
    ),
  ]);
  assert.match(hosting, /"d1": "DB"/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS credentials/);

  for (const slug of [
    "fundamentals",
    "foundations",
    "practitioner",
    "architect",
  ]) {
    const file = await readFile(
      new URL(`../dist/client/badges/${slug}.png`, import.meta.url),
    );
    assert.ok(file.length > 1000);
  }
});

test("applies security headers to every hosted response", async () => {
  const worker = await readFile(
    new URL("../worker/index.ts", import.meta.url),
    "utf8",
  );
  assert.match(worker, /strict-transport-security/);
  assert.match(worker, /frame-ancestors 'none'/);
  assert.match(worker, /x-frame-options/);
  assert.match(worker, /permissions-policy/);
  assert.match(worker, /x-content-type-options/);
  assert.match(worker, /credentials\.voiceaispace\.com/);
  assert.match(worker, /Response\.redirect\(url, 308\)/);
});

test("serves credential proofs from the current canonical issuer domain", async () => {
  const [credentials, proofRoute, jwksRoute, openBadges] = await Promise.all([
    readFile(new URL("../lib/credentials.server.ts", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../app/api/open-badges/v3/credentials/[credentialId]/route.ts",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL("../app/api/open-badges/v3/jwks/route.ts", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../lib/open-badges.server.ts", import.meta.url), "utf8"),
  ]);
  assert.match(credentials, /currentCredentialProof/);
  assert.match(credentials, /credentialV3\(record\)/);
  assert.match(proofRoute, /await currentCredentialProof\(credential\)/);
  assert.match(jwksRoute, /application\/jwk-set\+json/);
  assert.match(openBadges, /api\/open-badges\/v3\/jwks/);
});
