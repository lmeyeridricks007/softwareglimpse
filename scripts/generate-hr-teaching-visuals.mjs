#!/usr/bin/env node
/**
 * Generate remaining HR hub teaching PNGs via SVG → sharp (16:9).
 * Priority heroes are GenerateImage (see docs/reports/hr-visuals-assets-2026-08-17.md).
 * This script only fills needs/workflow remainders (and skips existing premium files).
 *
 * Usage: node scripts/generate-hr-teaching-visuals.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const W = 1536;
const H = 1024;

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function needsSvg(title, subtitle, pairs) {
  const rows = pairs
    .map((p, i) => {
      const y = 200 + i * 120;
      return `
      <rect x="64" y="${y}" width="680" height="100" rx="14" fill="#fff8ef" stroke="#f0d4a8" stroke-width="2"/>
      <text x="96" y="${y + 42}" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#8a5a12">${escapeXml(p.problem)}</text>
      <text x="96" y="${y + 72}" font-family="Arial, sans-serif" font-size="16" fill="#6b5428">${escapeXml(p.problemDetail)}</text>
      <path d="M780 ${y + 50} H820" stroke="#7ea0c0" stroke-width="3" marker-end="url(#arrow)"/>
      <rect x="840" y="${y}" width="632" height="100" rx="14" fill="#eefaf4" stroke="#b7e0c8" stroke-width="2"/>
      <text x="872" y="${y + 42}" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#1a6b45">${escapeXml(p.fix)}</text>
      <text x="872" y="${y + 72}" font-family="Arial, sans-serif" font-size="16" fill="#2f5c48">${escapeXml(p.fixDetail)}</text>
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
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#7ea0c0"/>
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="64" y="88" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#12324f">${escapeXml(title)}</text>
  <text x="64" y="132" font-family="Arial, sans-serif" font-size="20" fill="#4a6780">${escapeXml(subtitle)}</text>
  <text x="96" y="175" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#8a5a12">Problems</text>
  <text x="872" y="175" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1a6b45">HR software fixes</text>
  ${rows}
</svg>`;
}

function flowSvg(title, steps) {
  const nodes = steps
    .map((s, i) => {
      const x = 64 + i * 290;
      return `
      <rect x="${x}" y="340" width="250" height="200" rx="14" fill="#ffffff" stroke="#c9d9ea" stroke-width="2"/>
      <circle cx="${x + 36}" cy="390" r="22" fill="#1e4d7b"/>
      <text x="${x + 36}" y="396" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${i + 1}</text>
      <text x="${x + 70}" y="396" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#12324f">${escapeXml(s.t)}</text>
      <text x="${x + 24}" y="450" font-family="Arial, sans-serif" font-size="15" fill="#4a6780">${escapeXml(s.d)}</text>
      <text x="${x + 24}" y="480" font-family="Arial, sans-serif" font-size="14" fill="#5a738a">${escapeXml(s.d2 ?? "")}</text>
      ${i < steps.length - 1 ? `<path d="M${x + 260} 440 H${x + 290}" stroke="#7ea0c0" stroke-width="3" marker-end="url(#arrow)"/>` : ""}
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
  <text x="64" y="148" font-family="Arial, sans-serif" font-size="20" fill="#4a6780">Practical buyer workflow — HR / workforce / training</text>
  ${nodes}
</svg>`;
}

async function writePng(relPath, svg) {
  const out = path.join(ROOT, "public", relPath);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (fs.existsSync(out) && fs.statSync(out).size > 900_000) {
    console.log("skip existing premium", relPath);
    return;
  }
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 6, adaptiveFiltering: true })
    .toFile(out);
  console.log("wrote", relPath, fs.statSync(out).size);
}

const useCasePacks = {
  "recruiting-ats": {
    title: "Recruiting / ATS needs",
    pairs: [
      {
        problem: "Resumes in inboxes",
        problemDetail: "No shared pipeline stages",
        fix: "Applicant tracking board",
        fixDetail: "Applied → Screen → Interview → Offer",
      },
      {
        problem: "Interview chaos",
        problemDetail: "Calendar ping-pong",
        fix: "Interview scheduling",
        fixDetail: "Slots, panels, scorecards",
      },
      {
        problem: "Job board sprawl",
        problemDetail: "Manual multi-posting",
        fix: "Career site + boards",
        fixDetail: "One position, many channels",
      },
      {
        problem: "Weak handoff to HRIS",
        problemDetail: "Re-key new hires",
        fix: "Offer → HRIS path",
        fixDetail: "Native integrations preferred",
      },
    ],
    workflow: [
      { t: "Post", d: "Career site", d2: "+ job boards" },
      { t: "Screen", d: "Pipeline stages", d2: "+ scorecards" },
      { t: "Interview", d: "Schedules", d2: "+ feedback" },
      { t: "Offer", d: "eSign / HRIS", d2: "handoff" },
      { t: "Measure", d: "Time-to-hire", d2: "analytics" },
    ],
  },
  "workforce-scheduling": {
    title: "Workforce scheduling needs",
    pairs: [
      {
        problem: "Shift WhatsApp threads",
        problemDetail: "No source of truth",
        fix: "Published schedules",
        fixDetail: "Mobile-ready shift grid",
      },
      {
        problem: "Open-shift scramble",
        problemDetail: "Coverage gaps",
        fix: "Open-shift pool",
        fixDetail: "Claim / approve flow",
      },
      {
        problem: "Labor cost surprises",
        problemDetail: "After the week",
        fix: "Coverage + cost view",
        fixDetail: "Before publish",
      },
      {
        problem: "Deskless blind spots",
        problemDetail: "Managers only on desktop",
        fix: "Frontline mobile",
        fixDetail: "See my shifts today",
      },
    ],
    workflow: [
      { t: "Plan", d: "Templates", d2: "+ demand" },
      { t: "Fill", d: "Open shifts", d2: "+ swaps" },
      { t: "Publish", d: "Notify team", d2: "mobile" },
      { t: "Adjust", d: "Live coverage", d2: "exceptions" },
      { t: "Review", d: "Labor vs plan", d2: "weekly" },
    ],
  },
  "time-attendance": {
    title: "Time & attendance needs",
    pairs: [
      {
        problem: "Paper timesheets",
        problemDetail: "Errors + late payroll",
        fix: "Digital clock-in",
        fixDetail: "Web / mobile / kiosk",
      },
      {
        problem: "Buddy punching",
        problemDetail: "Untrusted punches",
        fix: "GPS / face / geofence",
        fixDetail: "Policy-backed punches",
      },
      {
        problem: "OT surprises",
        problemDetail: "No break rules",
        fix: "Attendance policies",
        fixDetail: "Breaks, OT, approvals",
      },
      {
        problem: "Payroll re-key",
        problemDetail: "Manual exports",
        fix: "Payroll-ready exports",
        fixDetail: "HRIS / accounting sync",
      },
    ],
    workflow: [
      { t: "Clock", d: "In / out", d2: "+ location" },
      { t: "Capture", d: "Timesheets", d2: "auto-calc" },
      { t: "Approve", d: "Manager queue", d2: "exceptions" },
      { t: "Export", d: "Payroll", d2: "integrations" },
      { t: "Audit", d: "Policy hits", d2: "reports" },
    ],
  },
  "employee-training": {
    title: "Employee training needs",
    pairs: [
      {
        problem: "Uneven onboarding",
        problemDetail: "Depends on who trains",
        fix: "Role training paths",
        fixDetail: "Assigned modules + due dates",
      },
      {
        problem: "Completion unknown",
        problemDetail: "No tracking",
        fix: "Progress dashboard",
        fixDetail: "Quizzes + acknowledgments",
      },
      {
        problem: "Content scattered",
        problemDetail: "Drive + Slack links",
        fix: "Structured paths",
        fixDetail: "Ordered learning steps",
      },
      {
        problem: "Manager blind spots",
        problemDetail: "Who is ready?",
        fix: "Cohort reports",
        fixDetail: "Completion by role",
      },
    ],
    workflow: [
      { t: "Define", d: "Role paths", d2: "must-learn" },
      { t: "Assign", d: "New hires", d2: "+ cohorts" },
      { t: "Learn", d: "Modules", d2: "+ checks" },
      { t: "Prove", d: "Quiz / sign", d2: "off" },
      { t: "Report", d: "Completion", d2: "gaps" },
    ],
  },
  "sop-documentation": {
    title: "SOP documentation needs",
    pairs: [
      {
        problem: "Tribal knowledge",
        problemDetail: "Only veterans know how",
        fix: "SOP knowledge base",
        fixDetail: "Searchable playbooks",
      },
      {
        problem: "Version drift",
        problemDetail: "Outdated PDFs",
        fix: "Versioned procedures",
        fixDetail: "Ack on update",
      },
      {
        problem: "Hard to find steps",
        problemDetail: "Long docs",
        fix: "Step-by-step SOPs",
        fixDetail: "Role-tagged folders",
      },
      {
        problem: "No accountability",
        problemDetail: "Unread policies",
        fix: "Acknowledgments",
        fixDetail: "Track who signed",
      },
    ],
    workflow: [
      { t: "Capture", d: "How we work", d2: "steps" },
      { t: "Organize", d: "Subjects", d2: "+ roles" },
      { t: "Publish", d: "Searchable KB", d2: "mobile" },
      { t: "Assign", d: "Read / ack", d2: "deadlines" },
      { t: "Refresh", d: "Version", d2: "+ re-ack" },
    ],
  },
  "frontline-ops": {
    title: "Frontline ops needs",
    pairs: [
      {
        problem: "Deskless radio silence",
        problemDetail: "Email never read",
        fix: "Frontline mobile hub",
        fixDetail: "Chat + announcements",
      },
      {
        problem: "Task ambiguity",
        problemDetail: "Verbal handoffs",
        fix: "Mobile checklists",
        fixDetail: "Assigned daily tasks",
      },
      {
        problem: "Schedule + clock split",
        problemDetail: "Two apps",
        fix: "Ops in one place",
        fixDetail: "Schedule + time + tasks",
      },
      {
        problem: "Manager fire drills",
        problemDetail: "No live status",
        fix: "Ops dashboard",
        fixDetail: "Who is on, what’s done",
      },
    ],
    workflow: [
      { t: "Brief", d: "Announce", d2: "+ tasks" },
      { t: "Schedule", d: "Shifts live", d2: "mobile" },
      { t: "Execute", d: "Checklists", d2: "+ chat" },
      { t: "Clock", d: "Attendance", d2: "GPS ok" },
      { t: "Close", d: "Day review", d2: "exceptions" },
    ],
  },
};

async function main() {
  for (const [slug, pack] of Object.entries(useCasePacks)) {
    await writePng(
      `use-cases/${slug}-needs.png`,
      needsSvg(pack.title, "Problems → HR software fixes", pack.pairs),
    );
    await writePng(
      `use-cases/${slug}-workflow.png`,
      flowSvg(`${slug.replace(/-/g, " ")} workflow`, pack.workflow),
    );
  }

  // Capability needs/workflow placeholders (heroes are GenerateImage)
  const capabilityPacks = {
    "applicant-tracking": useCasePacks["recruiting-ats"],
    "workforce-scheduling": useCasePacks["workforce-scheduling"],
    "time-attendance": useCasePacks["time-attendance"],
    "sop-knowledge-base": useCasePacks["sop-documentation"],
    "employee-training-paths": useCasePacks["employee-training"],
  };

  for (const [slug, pack] of Object.entries(capabilityPacks)) {
    await writePng(
      `capabilities/${slug}-needs.png`,
      needsSvg(
        `${slug.replace(/-/g, " ")} needs`,
        "Capability problems → fixes",
        pack.pairs,
      ),
    );
    await writePng(
      `capabilities/${slug}-workflow.png`,
      flowSvg(`${slug.replace(/-/g, " ")} loop`, pack.workflow),
    );
  }

  console.log("done — SVG needs/workflow only; heroes remain GenerateImage");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
