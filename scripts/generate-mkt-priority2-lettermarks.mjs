#!/usr/bin/env node
/**
 * Generate SoftwareGlimpse lettermark brand marks (512×512 PNG) for Marketing Priority-2.
 * Not official vendor trademarks — SG-styled initials with "SG" badge.
 *
 * Usage: node scripts/generate-mkt-priority2-lettermarks.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/brands");

/** Distinct navy/teal/earth palette — no purple neon. */
const MARKS = [
  { slug: "later", letter: "L", bg: "#1A1F2E", accent: "#E8A598" },
  { slug: "agorapulse", letter: "A", bg: "#0F2438", accent: "#3D8BDB" },
  { slug: "hootsuite", letter: "H", bg: "#143028", accent: "#2FA36B" },
  { slug: "sprout-social", letter: "S", bg: "#1C2834", accent: "#59A14F" },
  { slug: "meltwater", letter: "M", bg: "#102033", accent: "#4A90A4" },
  { slug: "brandwatch", letter: "B", bg: "#1A1520", accent: "#C45C26" },
  { slug: "iterable", letter: "I", bg: "#0E1E2A", accent: "#2BB3A3" },
  { slug: "whatconverts", letter: "W", bg: "#1B2430", accent: "#D4A017" },
  { slug: "uniqode", letter: "U", bg: "#142018", accent: "#6B9E3A" },
  { slug: "switcher-studio", letter: "S", bg: "#201820", accent: "#E4572E" },
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
    if (fs.existsSync(outPath)) {
      console.log(`= ${mark.slug}.png already present`);
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
