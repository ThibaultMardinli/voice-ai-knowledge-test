import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const badges = [
  {
    slug: "fundamentals",
    label: "FUNDAMENTALS",
    title: ["VOICE AI", "FUNDAMENTALS"],
    index: "01",
  },
  {
    slug: "foundations",
    label: "FOUNDATIONS",
    title: ["VOICE AI", "FOUNDATIONS"],
    index: "02",
  },
  {
    slug: "practitioner",
    label: "INTERMEDIATE",
    title: ["VOICE AI", "PRACTITIONER"],
    index: "03",
  },
  {
    slug: "architect",
    label: "EXPERT",
    title: ["VOICE AI", "ARCHITECT"],
    index: "04",
  },
];

const outputDirectory = resolve("public", "badges");
await mkdir(outputDirectory, { recursive: true });

for (const badge of badges) {
  const bars = [42, 78, 118, 164, 118, 78, 42]
    .map(
      (height, index) =>
        `<rect x="${139 + index * 39}" y="${184 - height / 2}" width="20" height="${height}" rx="10" fill="#c7ff35"/>`,
    )
    .join("");
  const svg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#080808"/>
      <rect x="18" y="18" width="476" height="476" fill="none" stroke="#f6f5ef" stroke-width="3"/>
      <path d="M18 92H494" stroke="#f6f5ef" stroke-width="2"/>
      <text x="42" y="57" fill="#f6f5ef" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="18" letter-spacing="2">VOICE AI / SPACE</text>
      <text x="462" y="57" text-anchor="end" fill="#c7ff35" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="18">${badge.index}</text>
      ${bars}
      <path d="M42 276H470" stroke="#f6f5ef" stroke-width="2"/>
      <text x="42" y="327" fill="#f6f5ef" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="38" letter-spacing="-1">${badge.title[0]}</text>
      <text x="42" y="370" fill="#f6f5ef" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="34" letter-spacing="-1">${badge.title[1]}</text>
      <rect x="42" y="405" width="428" height="48" fill="#c7ff35"/>
      <text x="58" y="436" fill="#080808" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="16" letter-spacing="1.5">${badge.label} · VERIFIED</text>
      <text x="470" y="478" text-anchor="end" fill="#f6f5ef" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="11" letter-spacing="1.5">VAS · 2026</text>
    </svg>`;
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true })
    .toFile(resolve(outputDirectory, `${badge.slug}.png`));
}
