#!/usr/bin/env node
/**
 * Generate remaining PM hub/guide teaching PNGs via SVG → sharp (16:9).
 * Prefer GenerateImage refresh for priority heroes later.
 *
 * Usage: node scripts/generate-pm-teaching-visuals.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const W = 1536;
const H = 1024;

function svgShell(title, subtitle, panels) {
  const cards = panels
    .map((p, i) => {
      const x = 64 + (i % 3) * 480;
      const y = 220 + Math.floor(i / 3) * 340;
      return `
      <rect x="${x}" y="${y}" width="440" height="280" rx="16" fill="#ffffff" stroke="#dbe7f3" stroke-width="2"/>
      <circle cx="${x + 48}" cy="${y + 48}" r="22" fill="#e8f1fb"/>
      <text x="${x + 48}" y="${y + 54}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#1e3a5f">${i + 1}</text>
      <text x="${x + 88}" y="${y + 56}" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#12324f">${escapeXml(p.t)}</text>
      <text x="${x + 32}" y="${y + 110}" font-family="Arial, sans-serif" font-size="16" fill="#3d5a73">${escapeXml(p.d)}</text>
      `;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f5f9fc"/>
      <stop offset="100%" stop-color="#e7eef6"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="64" y="92" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="#12324f">${escapeXml(title)}</text>
  <text x="64" y="140" font-family="Arial, sans-serif" font-size="20" fill="#4a6780">${escapeXml(subtitle)}</text>
  ${cards}
</svg>`;
}

function flowSvg(title, steps) {
  const nodes = steps
    .map((s, i) => {
      const x = 80 + i * 280;
      return `
      <rect x="${x}" y="360" width="240" height="160" rx="14" fill="#ffffff" stroke="#c9d9ea" stroke-width="2"/>
      <circle cx="${x + 36}" cy="${yCenter(400)}" r="20" fill="#1e4d7b"/>
      <text x="${x + 36}" y="406" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${i + 1}</text>
      <text x="${x + 70}" y="400" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#12324f">${escapeXml(s.t)}</text>
      <text x="${x + 24}" y="450" font-family="Arial, sans-serif" font-size="15" fill="#4a6780">${escapeXml(s.d)}</text>
      ${i < steps.length - 1 ? `<path d="M${x + 250} 440 H${x + 280}" stroke="#7ea0c0" stroke-width="3" marker-end="url(#arrow)"/>` : ""}
      `;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7fafc"/>
      <stop offset="100%" stop-color="#e8f0f7"/>
    </linearGradient>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#7ea0c0"/>
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="64" y="100" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#12324f">${escapeXml(title)}</text>
  ${nodes}
</svg>`;
}

function yCenter(y) {
  return y;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function writePng(relPath, svg) {
  const out = path.join(ROOT, "public", relPath);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (fs.existsSync(out) && fs.statSync(out).size > 900_000) {
    console.log("skip existing premium", relPath);
    return;
  }
  // denser PNG: higher compression level off + palette off keeps teaching detail
  await sharp(Buffer.from(svg)).png({ compressionLevel: 6, adaptiveFiltering: true }).toFile(out);
  const size = fs.statSync(out).size;
  console.log("wrote", relPath, size);
}

const guideHeroes = [
  ["guides/project-management-pricing-guide-hero.png", "Project management pricing", "Seats, plan gates, AI credits"],
  ["guides/project-management-requirements-guide-hero.png", "Requirements sheet", "Jobs, must-haves, evidence"],
  ["guides/project-management-evaluation-guide-hero.png", "Evaluation script", "Same trial on every finalist"],
  ["guides/project-management-pricing-guide-stack.png", "Cost stack", "Seats → gates → AI → total"],
  ["guides/project-management-pricing-worked-example.png", "Worked pricing example", "Same seats, different gates"],
  ["guides/project-management-requirements-guide-sheet.png", "Requirements score sheet", "Must / nice / evidence / plan"],
  ["guides/project-management-evaluation-guide-script.png", "Four-day evaluation", "Sample → automate → dashboard → check"],
  ["guides/what-is-monday-hero.png", "monday.com Work Management", "Work OS overview"],
  ["guides/is-monday-worth-it-hero.png", "Is monday.com worth it?", "Work OS fit check"],
  ["guides/what-is-hive-hero.png", "What is Hive?", "Collaborative work hub"],
  ["guides/is-hive-worth-it-hero.png", "Is Hive worth it?", "Peer shortlist fit"],
];

const useCases = [
  "work-management",
  "project-tracking",
  "timeline-reporting",
  "team-collaboration-work",
  "resource-planning",
  "document-productivity",
  "remote-support-access",
  "desktop-productivity",
];

const capabilities = [
  "task-boards",
  "timeline-gantt",
  "workload-resources",
  "automations-workflows",
  "time-tracking",
  "docs-collaboration",
  "integrations-ecosystem",
  "reporting-dashboards",
  "document-pdf",
  "remote-access",
  "desktop-workspace",
];

async function main() {
  for (const [rel, title, sub] of guideHeroes) {
    await writePng(
      rel,
      svgShell(title, sub, [
        { t: "Define job", d: "Work OS vs specialist" },
        { t: "Map seats", d: "Real licence count" },
        { t: "Check gates", d: "Views & automations" },
        { t: "Trial", d: "One shared script" },
        { t: "Decide", d: "Inside one cluster" },
        { t: "Adopt", d: "Weekly ritual" },
      ]),
    );
  }

  for (const slug of useCases) {
    for (const kind of ["hero", "needs", "workflow"]) {
      const rel = `use-cases/${slug}-${kind}.png`;
      if (kind === "workflow") {
        await writePng(
          rel,
          flowSvg(`${slug} workflow`, [
            { t: "Capture", d: "Owners & dates" },
            { t: "Plan", d: "Board / timeline" },
            { t: "Automate", d: "Handoffs" },
            { t: "Review", d: "Weekly stuck items" },
          ]),
        );
      } else {
        await writePng(
          rel,
          svgShell(
            slug.replace(/-/g, " "),
            kind === "needs" ? "Problems → fixes" : "Educational hub visual",
            [
              { t: "Ownership", d: "Named owners" },
              { t: "Visibility", d: "Trusted status" },
              { t: "Handoffs", d: "Less chasing" },
              { t: "Reporting", d: "Manager view" },
              { t: "Integrations", d: "Daily tools" },
              { t: "Plan fit", d: "Gates checked" },
            ],
          ),
        );
      }
    }
  }

  for (const slug of capabilities) {
    for (const kind of ["hero", "needs", "workflow"]) {
      const rel = `capabilities/${slug}-${kind}.png`;
      if (kind === "workflow") {
        await writePng(
          rel,
          flowSvg(`${slug} loop`, [
            { t: "Confirm", d: "Must-have?" },
            { t: "Gate", d: "Plan tier" },
            { t: "Trial", d: "Real workflow" },
            { t: "Keep", d: "Adoption check" },
          ]),
        );
      } else {
        await writePng(
          rel,
          svgShell(
            slug.replace(/-/g, " "),
            kind === "needs" ? "Capability needs map" : "Capability hub visual",
            [
              { t: "Plan gate", d: "On quoted tier" },
              { t: "Evidence", d: "Trial proof" },
              { t: "Stack fit", d: "Native connectors" },
              { t: "Adoption", d: "Weekly use" },
              { t: "Noise", d: "Configure alerts" },
              { t: "Cluster", d: "Right job" },
            ],
          ),
        );
      }
    }
  }

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
