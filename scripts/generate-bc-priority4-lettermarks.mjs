#!/usr/bin/env node
/**
 * Generate SoftwareGlimpse lettermark brand marks (512×512 PNG) for BC Priority-4.
 * Not official vendor trademarks — SG-styled initials with "SG" badge.
 *
 * Usage: node scripts/generate-bc-priority4-lettermarks.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/brands");

/** Distinct navy/teal/earth palette per product — no purple neon. */
const MARKS = [
  { slug: "twilio", letter: "Tw", bg: "#0D1220", accent: "#F22F46" },
  { slug: "manychat", letter: "M", bg: "#1A1528", accent: "#0084FF" },
  { slug: "intercom", letter: "In", bg: "#12202A", accent: "#1F8DED" },
];

function svgFor({ letter, bg, accent }) {
  const fontSize = letter.length > 1 ? 180 : 260;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" ry="96" fill="${bg}"/>
  <text x="256" y="290" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
    font-size="${fontSize}" font-weight="700" fill="#FFFFFF">${letter}</text>
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
