#!/usr/bin/env node
/**
 * Generate SoftwareGlimpse lettermark brand marks (512×512 PNG).
 * Not official vendor trademarks — SG-styled initials with "SG" badge.
 *
 * Usage: node scripts/generate-pm-wave1-lettermarks.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/brands");

/** Distinct navy/teal/coral palette per product — no purple neon. */
const MARKS = [
  { slug: "monday", letter: "M", bg: "#0B1F33", accent: "#F7B500" },
  { slug: "hive", letter: "H", bg: "#102A1F", accent: "#F5A623" },
  { slug: "office-timeline", letter: "O", bg: "#0C2340", accent: "#2D8CFF" },
  { slug: "foxit", letter: "F", bg: "#1A1520", accent: "#E85D4C" },
  { slug: "getscreen-me", letter: "G", bg: "#132033", accent: "#2BB673" },
  { slug: "webcatalog", letter: "W", bg: "#1C1424", accent: "#36C5F0" },
];

function svgFor({ letter, bg, accent }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" ry="96" fill="${bg}"/>
  <text x="256" y="290" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
    font-size="260" font-weight="700" fill="#FFFFFF">${letter}</text>
  <circle cx="392" cy="118" r="28" fill="${accent}"/>
  <text x="256" y="455" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
    font-size="42" font-weight="700" fill="${accent}" letter-spacing="4">SG</text>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const mark of MARKS) {
    const outPath = path.join(OUT, `${mark.slug}.png`);
    await sharp(Buffer.from(svgFor(mark)))
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    console.log(`✓ ${path.relative(ROOT, outPath)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
