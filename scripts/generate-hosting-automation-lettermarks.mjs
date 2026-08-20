#!/usr/bin/env node
/**
 * Lettermark brand marks for hosting providers + AI automation overlay
 * slugs missing public/brands/{slug}.png (zapier.png may already exist).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/brands");

const MARKS = [
  { slug: "cloudways", letter: "C", bg: "#0B2A3D", accent: "#2EC4B6" },
  { slug: "wp-engine", letter: "W", bg: "#0F2740", accent: "#40BAC8" },
  { slug: "n8n", letter: "n", bg: "#1A1028", accent: "#EA4B71" },
  { slug: "zapier", letter: "Z", bg: "#1A1208", accent: "#FF4A00" },
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
