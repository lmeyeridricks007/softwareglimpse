#!/usr/bin/env node
/**
 * Generate SoftwareGlimpse lettermark brand marks (512×512 PNG) for HR Priority-3
 * products that do not yet have a file in public/brands/.
 *
 * Usage: node scripts/generate-hr-priority3-lettermarks.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/brands");

const MARKS = [
  { slug: "workday", letter: "W", bg: "#0B1F33", accent: "#F7B500" },
  { slug: "oracle-hcm", letter: "O", bg: "#1A1520", accent: "#E85D4C" },
  { slug: "ukg-pro", letter: "U", bg: "#102A1F", accent: "#2BB673" },
  { slug: "dayforce", letter: "D", bg: "#0C2340", accent: "#2D8CFF" },
  { slug: "adp-workforce-now", letter: "A", bg: "#132033", accent: "#E85D4C" },
  { slug: "paylocity", letter: "P", bg: "#1C1424", accent: "#36C5F0" },
  { slug: "paycor", letter: "C", bg: "#1A2E1A", accent: "#F5A623" },
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
