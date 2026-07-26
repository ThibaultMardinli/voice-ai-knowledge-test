import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const grid = [
  ...Array.from(
    { length: 37 },
    (_, index) =>
      `<path d="M${index * 32} 0V630" stroke="#e2e8f0" stroke-width="1"/>`,
  ),
  ...Array.from(
    { length: 20 },
    (_, index) =>
      `<path d="M0 ${index * 32}H1200" stroke="#e2e8f0" stroke-width="1"/>`,
  ),
].join("");

const waveform = [44, 82, 128, 178, 128, 82, 44]
  .map(
    (height, index) =>
      `<rect x="${906 + index * 34}" y="${315 - height / 2}" width="16" height="${height}" rx="8" fill="#e7e7e9"/>`,
  )
  .join("");

const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#ffffff"/>
    ${grid}
    <rect x="0" y="0" width="1200" height="630" fill="none" stroke="#020817" stroke-width="4"/>
    <rect x="820" y="0" width="380" height="630" fill="#020817"/>

    <text x="64" y="82" fill="#020817" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="800">
      Voice AI / <tspan font-style="italic" font-weight="500">Space</tspan>
    </text>
    <text x="64" y="119" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="800" letter-spacing="4">CERTIFICATION</text>

    <text x="64" y="286" fill="#020817" font-family="Arial, Helvetica, sans-serif" font-size="77" font-weight="800" letter-spacing="-3">Prove what</text>
    <text x="64" y="369" fill="#020817" font-family="Arial, Helvetica, sans-serif" font-size="77" font-weight="800" letter-spacing="-3">you know.</text>
    <text x="64" y="437" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="23">Independent Voice AI knowledge credentials.</text>

    <rect x="64" y="500" width="468" height="62" fill="#020817"/>
    <text x="94" y="539" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700">OPEN BADGES · PUBLIC VERIFICATION</text>

    ${waveform}
    <path d="M891 438H1135" stroke="#ffffff" stroke-width="2"/>
    <text x="891" y="486" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="2">VOICE AI / SPACE</text>
    <text x="891" y="526" fill="#cbd5e1" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="3">VAS · 2026.1</text>
  </svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, palette: true })
  .toFile(resolve("public", "og.png"));
