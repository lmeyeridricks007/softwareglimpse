#!/usr/bin/env node
/**
 * Generate SoftwareGlimpse lettermark brand marks (512×512 PNG) for AI + IT Priority-2
 * products that do not yet have a file in public/brands/.
 *
 * Not official vendor trademarks — SG-styled initials with "SG" badge.
 * Usage: node scripts/generate-ai-it-priority2-lettermarks.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/brands");

const MARKS = [
  { slug: "microsoft-copilot", letter: "C", bg: "#0B1F33", accent: "#5EA9FF" },
  { slug: "perplexity", letter: "P", bg: "#101820", accent: "#22D3EE" },
  { slug: "github-copilot", letter: "G", bg: "#161B22", accent: "#58A6FF" },
  { slug: "cursor", letter: "C", bg: "#1A1A1A", accent: "#F5A623" },
  { slug: "midjourney", letter: "M", bg: "#1A1520", accent: "#C4B5FD" },
  { slug: "adobe-firefly", letter: "F", bg: "#2C0B0E", accent: "#FF6A3D" },
  { slug: "runway", letter: "R", bg: "#0C2340", accent: "#7CFFB2" },
  { slug: "otter-ai", letter: "O", bg: "#102A1F", accent: "#2BB673" },
  { slug: "servicenow", letter: "S", bg: "#0C2340", accent: "#81B5A1" },
  { slug: "jira-service-management", letter: "J", bg: "#0B1F33", accent: "#2684FF" },
  { slug: "new-relic", letter: "N", bg: "#1C1424", accent: "#1CE783" },
  { slug: "grafana-cloud", letter: "G", bg: "#0B1F33", accent: "#F46800" },
  { slug: "pagerduty", letter: "P", bg: "#1A1520", accent: "#06AC38" },
  { slug: "gitlab", letter: "G", bg: "#2C0B0E", accent: "#FC6D26" },
  { slug: "bitbucket", letter: "B", bg: "#0C2340", accent: "#2684FF" },
  { slug: "cpanel", letter: "c", bg: "#FF6C2C", accent: "#FFFFFF" },
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
