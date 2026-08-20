#!/usr/bin/env node
/**
 * Generate SoftwareGlimpse lettermark brand marks (512×512 PNG) for HR Priority-2
 * products that do not yet have a file in public/brands/.
 *
 * Not official vendor trademarks — SG-styled initials with "SG" badge.
 * Usage: node scripts/generate-hr-priority2-lettermarks.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/brands");

const MARKS = [
  { slug: "homebase", letter: "H", bg: "#1A2E1A", accent: "#F5A623" },
  { slug: "when-i-work", letter: "W", bg: "#0C2340", accent: "#2D8CFF" },
  { slug: "deputy", letter: "D", bg: "#102A1F", accent: "#2BB673" },
  { slug: "7shifts", letter: "7", bg: "#1A1520", accent: "#E85D4C" },
  { slug: "lever", letter: "L", bg: "#0B1F33", accent: "#36C5F0" },
  { slug: "ashby", letter: "A", bg: "#132033", accent: "#F7B500" },
  { slug: "hibob", letter: "B", bg: "#1C1424", accent: "#E85D4C" },
  { slug: "personio", letter: "P", bg: "#0C2340", accent: "#2BB673" },
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
  const force = process.argv.includes("--force");
  for (const mark of MARKS) {
    const outPath = path.join(OUT, `${mark.slug}.png`);
    if (!force && fs.existsSync(outPath)) {
      console.log(`skip ${mark.slug} (exists)`);
      continue;
    }
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
