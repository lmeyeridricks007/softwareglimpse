#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/brands");

const MARKS = [
  { slug: "hynote", letter: "H", bg: "#0B1F3A", accent: "#3B82F6" },
];

function svgFor({ letter, bg, accent }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" ry="96" fill="${bg}"/>
  <text x="256" y="290" text-anchor="middle" font-family="Georgia, serif"
    font-size="260" font-weight="700" fill="#FFFFFF">${letter}</text>
  <circle cx="392" cy="118" r="28" fill="${accent}"/>
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
    await sharp(Buffer.from(svgFor(mark))).png().toFile(outPath);
    console.log(`✓ ${path.relative(ROOT, outPath)}`);
  }
}

main();
