#!/usr/bin/env node
/**
 * Lettermarks for IT industry Tier-A slugs missing public/brands/{slug}.png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/brands");

const MARKS = [
  { slug: "splunk", letter: "S", bg: "#0A1628", accent: "#65A637" },
  { slug: "elastic-observability", letter: "E", bg: "#0B1F33", accent: "#FEC514" },
  { slug: "sentry", letter: "S", bg: "#1A1020", accent: "#362D59" },
  { slug: "incident-io", letter: "i", bg: "#0F172A", accent: "#6366F1" },
  { slug: "circleci", letter: "C", bg: "#161616", accent: "#343434" },
  { slug: "directadmin", letter: "D", bg: "#0C2340", accent: "#2E90FA" },
  { slug: "kinsta", letter: "K", bg: "#0B1F33", accent: "#5333ED" },
  { slug: "smartproxy", letter: "D", bg: "#111827", accent: "#22C55E" },
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
    if (fs.existsSync(outPath) && !process.argv.includes("--force")) {
      console.log(`skip ${mark.slug}`);
      continue;
    }
    await sharp(Buffer.from(svgFor(mark))).png({ compressionLevel: 9 }).toFile(outPath);
    console.log(`✓ ${path.relative(ROOT, outPath)}`);
  }
}

main();
