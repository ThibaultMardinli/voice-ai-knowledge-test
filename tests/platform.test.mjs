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

test("keeps assessment creation behind authentication", async () => {
  const route = await readFile(
    new URL("../app/api/exam/start/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(route, /const candidate = await getCandidate\(\)/);
  assert.match(route, /authentication_required/);
  assert.match(route, /status: 401/);
  assert.ok(
    route.indexOf("if (!candidate)") < route.indexOf("await request.json()"),
    "authentication must be checked before request data is processed",
  );
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
