#!/usr/bin/env node
/**
 * Generate SVG teaching PNGs for AI + IT Wave-1 hubs and CORE 5-guide packs (16:9 via sharp).
 * Usage: node scripts/generate-ai-it-teaching-visuals.mjs
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

function eyebrow(kind) {
  return kind === "it" ? "SOFTWAREGLIMPSE · IT & DEVELOPMENT" : "SOFTWAREGLIMPSE · AI";
}

function frame(kind, title, subtitle, inner) {
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
  <text x="64" y="56" font-family="Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="2" fill="#1e4d7b">${escapeXml(eyebrow(kind))}</text>
  <text x="64" y="104" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#12324f">${escapeXml(title)}</text>
  <text x="64" y="146" font-family="Arial, sans-serif" font-size="18" fill="#4a6780">${escapeXml(subtitle)}</text>
  ${inner}
</svg>`;
}

function heroSvg(kind, title, subtitle, panels) {
  const n = panels.length;
  const cols = n <= 3 ? n : n === 4 ? 2 : 3;
  const cardW = cols === 2 ? 680 : cols === 3 ? 440 : 1408;
  const gapX = cols === 2 ? 720 : 480;
  const cards = panels
    .map((p, i) => {
      const x = 64 + (i % cols) * gapX;
      const y = 188 + Math.floor(i / cols) * 268;
      return `
      <rect x="${x}" y="${y}" width="${cardW}" height="244" rx="16" fill="#ffffff" stroke="#c9d9ea" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="8" height="244" rx="4" fill="${p.accent ?? "#1e4d7b"}"/>
      <text x="${x + 28}" y="${y + 48}" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#12324f">${escapeXml(p.t)}</text>
      <text x="${x + 28}" y="${y + 88}" font-family="Arial, sans-serif" font-size="16" fill="#4a6780">${escapeXml(p.d)}</text>
      <text x="${x + 28}" y="${y + 120}" font-family="Arial, sans-serif" font-size="14" fill="#5a738a">${escapeXml(p.d2 ?? "")}</text>
      <text x="${x + 28}" y="${y + 156}" font-family="Arial, sans-serif" font-size="14" fill="#5a738a">${escapeXml(p.d3 ?? "")}</text>
      <text x="${x + 28}" y="${y + 208}" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#1e4d7b">${escapeXml(p.rule ?? "")}</text>`;
    })
    .join("");
  return frame(kind, title, subtitle, cards);
}

function needsSvg(kind, title, subtitle, pairs) {
  const rowH = pairs.length >= 6 ? 108 : 120;
  const startY = 188;
  const rows = pairs
    .map((p, i) => {
      const y = startY + i * rowH;
      return `
      <rect x="64" y="${y}" width="680" height="${rowH - 16}" rx="14" fill="#fff8ef" stroke="#f0d4a8" stroke-width="2"/>
      <text x="96" y="${y + 36}" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#8a5a12">${escapeXml(p.problem)}</text>
      <text x="96" y="${y + 64}" font-family="Arial, sans-serif" font-size="15" fill="#6b5428">${escapeXml(p.problemDetail)}</text>
      <path d="M780 ${y + 44} H820" stroke="#7ea0c0" stroke-width="3" marker-end="url(#arrow)"/>
      <rect x="840" y="${y}" width="632" height="${rowH - 16}" rx="14" fill="#eefaf4" stroke="#b7e0c8" stroke-width="2"/>
      <text x="872" y="${y + 36}" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#1a6b45">${escapeXml(p.fix)}</text>
      <text x="872" y="${y + 64}" font-family="Arial, sans-serif" font-size="15" fill="#2f5c48">${escapeXml(p.fixDetail)}</text>`;
    })
    .join("");
  const headers = `
    <text x="96" y="176" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#8a5a12">Blocking job</text>
    <text x="872" y="176" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#1a6b45">Buy inside this cluster</text>`;
  return frame(kind, title, subtitle, headers + rows);
}

function flowSvg(kind, title, subtitle, steps) {
  const n = steps.length;
  const cardW = Math.min(250, Math.floor((W - 128 - (n - 1) * 24) / n));
  const total = n * cardW + (n - 1) * 24;
  const startX = Math.round((W - total) / 2);
  const nodes = steps
    .map((s, i) => {
      const x = startX + i * (cardW + 24);
      return `
      <rect x="${x}" y="360" width="${cardW}" height="280" rx="14" fill="#ffffff" stroke="#c9d9ea" stroke-width="2"/>
      <circle cx="${x + 36}" cy="410" r="22" fill="#1e4d7b"/>
      <text x="${x + 36}" y="416" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${i + 1}</text>
      <text x="${x + 68}" y="416" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#12324f">${escapeXml(s.t)}</text>
      <text x="${x + 20}" y="470" font-family="Arial, sans-serif" font-size="14" fill="#4a6780">${escapeXml(s.d)}</text>
      <text x="${x + 20}" y="498" font-family="Arial, sans-serif" font-size="13" fill="#5a738a">${escapeXml(s.d2 ?? "")}</text>
      <text x="${x + 20}" y="540" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#1e4d7b">${escapeXml(s.rule ?? "")}</text>
      ${i < n - 1 ? `<path d="M${x + cardW} 500 H${x + cardW + 24}" stroke="#7ea0c0" stroke-width="3" marker-end="url(#arrow)"/>` : ""}`;
    })
    .join("");
  return frame(kind, title, subtitle, nodes);
}

function stackSvg(kind, title, subtitle, layers) {
  const cards = layers
    .map((p, i) => {
      const y = 188 + i * 120;
      const fills = ["#ffffff", "#f3f8fd", "#eef6f2", "#fff8ef", "#f7f0fa", "#eaf3fb"];
      return `
      <rect x="96" y="${y}" width="1344" height="104" rx="14" fill="${fills[i % fills.length]}" stroke="#c9d9ea" stroke-width="2"/>
      <circle cx="148" cy="${y + 52}" r="22" fill="#1e4d7b"/>
      <text x="148" y="${y + 58}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${i + 1}</text>
      <text x="196" y="${y + 42}" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#12324f">${escapeXml(p.t)}</text>
      <text x="196" y="${y + 74}" font-family="Arial, sans-serif" font-size="16" fill="#4a6780">${escapeXml(p.d)}</text>
      <text x="1180" y="${y + 58}" text-anchor="end" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#1e4d7b">${escapeXml(p.rule ?? "")}</text>`;
    })
    .join("");
  return frame(kind, title, subtitle, cards);
}

function sheetSvg(kind, title, subtitle, columns, rows) {
  const colW = Math.floor(1344 / columns.length);
  const head = columns
    .map((c, i) => {
      const x = 96 + i * colW;
      return `<text x="${x + 16}" y="216" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#1e4d7b">${escapeXml(c)}</text>`;
    })
    .join("");
  const body = rows
    .map((r, ri) => {
      const y = 244 + ri * 88;
      const cells = r
        .map((cell, i) => {
          const x = 96 + i * colW;
          return `<text x="${x + 16}" y="${y + 36}" font-family="Arial, sans-serif" font-size="15" fill="#12324f">${escapeXml(cell)}</text>`;
        })
        .join("");
      return `<rect x="96" y="${y}" width="1344" height="76" rx="10" fill="${ri % 2 ? "#f3f8fd" : "#ffffff"}" stroke="#c9d9ea"/>${cells}`;
    })
    .join("");
  return frame(kind, title, subtitle, head + body);
}

function compareSvg(kind, title, subtitle, left, right, note) {
  const inner = `
    <rect x="64" y="188" width="680" height="680" rx="16" fill="#ffffff" stroke="#c9d9ea" stroke-width="2"/>
    <text x="96" y="236" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#8a5a12">${escapeXml(left.title)}</text>
    ${left.lines
      .map(
        (l, i) =>
          `<text x="96" y="${284 + i * 44}" font-family="Arial, sans-serif" font-size="16" fill="#4a6780">${escapeXml(l)}</text>`,
      )
      .join("")}
    <rect x="792" y="188" width="680" height="680" rx="16" fill="#eefaf4" stroke="#b7e0c8" stroke-width="2"/>
    <text x="824" y="236" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#1a6b45">${escapeXml(right.title)}</text>
    ${right.lines
      .map(
        (l, i) =>
          `<text x="824" y="${284 + i * 44}" font-family="Arial, sans-serif" font-size="16" fill="#2f5c48">${escapeXml(l)}</text>`,
      )
      .join("")}
    <text x="64" y="980" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1e4d7b">${escapeXml(note)}</text>`;
  return frame(kind, title, subtitle, inner);
}

async function writePng(dir, name, svg) {
  const out = path.join(ROOT, dir, name);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`✓ ${path.relative(ROOT, out)}`);
}

const useCaseJobs = [
  {
    dir: "public/use-cases",
    base: "llm-assistant",
    svg: heroSvg("ai", "LLM assistant workflows", "Research → draft → iterate with connectors and projects", [
      { t: "Chat & reasoning", d: "Multi-turn Q&A and coding help", d2: "Model tiers gate depth", rule: "Not an image generator" },
      { t: "Projects / memory", d: "Saved context across sessions", d2: "Team workspaces on Business", rule: "Confirm plan gate" },
      { t: "Connectors", d: "Drive, Slack, browser tools", d2: "Governance on Enterprise", rule: "Score the SKU you buy" },
    ]),
  },
  {
    dir: "public/use-cases",
    base: "observability-monitoring",
    svg: heroSvg("it", "Observability stack", "Metrics, traces, and logs on one platform", [
      { t: "Infrastructure", d: "Host & container metrics", d2: "Per-host pricing floor", rule: "Not a paging tool" },
      { t: "APM / traces", d: "Service maps & latency", d2: "Module add-on TCO", rule: "Budget the qualifying pack" },
      { t: "Logs", d: "Search & retention", d2: "Ingestion drives cost", rule: "Price ingest GB" },
    ]),
  },
  {
    dir: "public/use-cases",
    base: "ai-code",
    svg: heroSvg("ai", "AI coding assistants", "Completions, agents, and AI-native editors", [
      { t: "Inline complete", d: "Tab / Copilot in the IDE", d2: "Credit overage risk", rule: "≠ Microsoft 365 Copilot" },
      { t: "Agents", d: "Multi-file refactors", d2: "MCP and tools", rule: "Trial one real PR" },
      { t: "Org policy", d: "SSO, privacy, seat admin", d2: "Business/Enterprise", rule: "≠ GitHub source control" },
    ]),
  },
  {
    dir: "public/use-cases",
    base: "ai-image",
    svg: heroSvg("ai", "AI image generation", "Stills for creative and commercial work", [
      { t: "Prompt to still", d: "Midjourney GPU hours", d2: "Stealth on Pro+", rule: "Not a video peer" },
      { t: "Adobe workflow", d: "Firefly in Photoshop", d2: "Credit pools", rule: "Commercial IP posture" },
      { t: "Commercial IP", d: "Indemnity vs community", d2: "Terms differ", rule: "Write the IP must-have" },
    ]),
  },
  {
    dir: "public/use-cases",
    base: "incident-oncall",
    svg: heroSvg("it", "On-call & incident response", "Page the right human — not a metrics suite", [
      { t: "Schedules", d: "Rotations and overrides", d2: "Responder seats", rule: "Not Datadog" },
      { t: "Escalation", d: "Policies and urgency", d2: "Mobile / SMS / voice", rule: "Test a real page" },
      { t: "Incident", d: "War-room workflow", d2: "Add-ons for AIOps", rule: "Budget the SKU" },
    ]),
  },
];

const guideJobs = [
  {
    name: "what-is-ai-software-hero.png",
    svg: heroSvg("ai", "AI software job clusters", "Pick the job before the brand — never one ranked list", [
      { t: "LLM assistant", d: "ChatGPT / Claude / Gemini", d2: "Microsoft 365 Copilot · Perplexity", rule: "Chat & reasoning" },
      { t: "AI coding", d: "Cursor / GitHub Copilot", d2: "Not GitHub · not M365 Copilot", rule: "IDE & agents" },
      { t: "Create & capture", d: "Midjourney · Firefly · Runway", d2: "Otter · QuillBot · ElevenLabs", rule: "Specialist outputs" },
      { t: "Build & agents", d: "Gamma · Wegic · AdCreative.ai", d2: "MindStudio agents", rule: "Decks, sites, ads, apps" },
    ]),
  },
  {
    name: "what-is-ai-software-building-blocks.png",
    svg: heroSvg("ai", "AI building blocks", "Buy the block that is blocking — specialists sit beside each other", [
      { t: "Chat", d: "LLM assistants", d2: "Projects, connectors, models", rule: "Weekly reasoning" },
      { t: "Code", d: "IDE / agents", d2: "Completions and refactors", rule: "Weekly PRs" },
      { t: "Still", d: "Image generation", d2: "GPU hours and IP terms", rule: "Campaign stills" },
      { t: "Motion", d: "Video generation", d2: "Credit-priced editors", rule: "Short clips" },
      { t: "Capture", d: "Notes / write / voice", d2: "Minutes, paraphrase, TTS", rule: "Transcripts & copy" },
      { t: "Build", d: "Decks, sites, ads, agents", d2: "Prompt-to-artefact", rule: "Ship an artefact" },
    ]),
  },
  {
    name: "what-is-ai-software-loop.png",
    svg: flowSvg("ai", "Harbor Labs AI loop", "Each loop is a different purchase — identity mix-ups fail", [
      { t: "Chat", d: "Research drafts", d2: "LLM assistant", rule: "ChatGPT cluster" },
      { t: "Code", d: "Editor agents", d2: "AI coding", rule: "Cursor / Copilot" },
      { t: "Still", d: "Campaign art", d2: "Image gen", rule: "Not chat" },
      { t: "Capture", d: "Meeting notes", d2: "Otter.ai", rule: "Not M365 recap" },
      { t: "Build", d: "Deck or agent", d2: "Gamma / MindStudio", rule: "Specialist" },
    ]),
  },
  {
    name: "how-to-choose-ai-software-hero.png",
    svg: heroSvg("ai", "How to choose AI software", "Job first, then units, then SKU identity", [
      { t: "Name the job", d: "One weekly output sentence", d2: "Chat vs code vs still vs notes", rule: "One cluster per sheet" },
      { t: "Map units", d: "Seats · credits · GPU hours", d2: "Minute / conversation caps", rule: "Price the config" },
      { t: "Check identity", d: "M365 Copilot ≠ GitHub Copilot", d2: "GitHub Copilot ≠ GitHub", rule: "Confirm the SKU" },
    ]),
  },
  {
    name: "how-to-choose-ai-software-needs.png",
    svg: needsSvg("ai", "Five worked examples", "Five teams, one category, five shortlists", [
      { problem: "Harbor Labs research", problemDetail: "Cited drafts every week", fix: "LLM assistant", fixDetail: "ChatGPT / Claude / Gemini / Perplexity" },
      { problem: "Harbor Labs PRs", problemDetail: "Multi-file refactors in the IDE", fix: "AI coding", fixDetail: "Cursor or GitHub Copilot — not M365 Copilot" },
      { problem: "Northline Studio stills", problemDetail: "Commercial IP they can defend", fix: "AI image", fixDetail: "Midjourney vs Adobe Firefly" },
      { problem: "Northline meeting notes", problemDetail: "Transcripts without chasing Slack", fix: "AI meeting", fixDetail: "Otter.ai — not a chat peer" },
      { problem: "Harbor no-code agents", problemDetail: "Internal apps without an LLM RFP", fix: "AI agents", fixDetail: "MindStudio — specialist cluster" },
    ]),
  },
  {
    name: "how-to-choose-ai-software-framework.png",
    svg: flowSvg("ai", "AI selection framework", "Job → gates → units → SKU identity → trial", [
      { t: "Job", d: "One sentence", d2: "Weekly output", rule: "Cluster first" },
      { t: "Gates", d: "SSO, models", d2: "Agents, stealth", rule: "Plan unlock" },
      { t: "Units", d: "Seats / credits", d2: "GPU / minutes", rule: "Volume model" },
      { t: "SKU", d: "Copilot check", d2: "M365 ≠ GitHub", rule: "Identity" },
      { t: "Trial", d: "One workflow", d2: "Three-day test", rule: "Keep or cut" },
    ]),
  },
  {
    name: "ai-pricing-guide-hero.png",
    svg: heroSvg("ai", "AI pricing units", "Never compare starter tiles across jobs", [
      { t: "Seats", d: "People who need access", d2: "Plus vs Business vs Enterprise", rule: "Headcount floor" },
      { t: "Credits / tokens", d: "Chat, video, TTS packs", d2: "Overage often decides TCO", rule: "Model volume" },
      { t: "GPU & Copilot SKUs", d: "Image GPU hours", d2: "M365 Copilot add-on vs GitHub Copilot", rule: "Different purchases" },
    ]),
  },
  {
    name: "ai-pricing-guide-stack.png",
    svg: stackSvg("ai", "AI cost stack", "The starter tile is the bottom layer", [
      { t: "Seat floor", d: "People who must log in weekly", rule: "Published or add-on SKU" },
      { t: "Credits / tokens", d: "Chat, rewrite, TTS, video packs", rule: "Overage line item" },
      { t: "GPU hours", d: "Image generation on Fast/Stealth tiers", rule: "Campaign spikes" },
      { t: "Minute / conversation caps", d: "Meeting notes and voice minutes", rule: "Cap math" },
      { t: "Copilot add-on SKUs", d: "Microsoft 365 Copilot vs GitHub Copilot", rule: "Do not mix tiles" },
      { t: "Qualifying total", d: "Same team, same jobs, same units", rule: "Compare like for like" },
    ]),
  },
  {
    name: "ai-pricing-guide-worked-example.png",
    svg: compareSvg(
      "ai",
      "Harbor Labs qualifying quote",
      "12 knowledge seats + 8 engineering seats — tile vs config",
      {
        title: "Cheaper tile (fails)",
        lines: [
          "Personal Plus for everyone",
          "No Business connectors",
          "No AI-native editor agents",
          "Microsoft 365 Copilot quoted as “coding”",
          "GPU stills not in scope (and not needed)",
          "Looks cheap on the homepage",
          "Fails Harbor’s weekly PR ritual",
        ],
      },
      {
        title: "Qualifying config (honest)",
        lines: [
          "LLM Business seats for research",
          "Connectors + SSO on that tier",
          "Cursor or GitHub Copilot for engineers",
          "Credit overage modelled for agents",
          "M365 Copilot left off the coding sheet",
          "Higher tile — correct job fit",
          "Compare this total, not Plus",
        ],
      },
      "Same team, same requirements — credits and SKU identity decide TCO.",
    ),
  },
  {
    name: "ai-requirements-guide-hero.png",
    svg: heroSvg("ai", "AI requirements sheet", "Jobs and evidence — not a 40-row wishlist", [
      { t: "Must vs nice", d: "90-day rule", d2: "If you operate without it, it is nice", rule: "Force a ranking" },
      { t: "Usage unit", d: "Seats / credits / GPU / minutes", d2: "Write the qualifying pack", rule: "Gates on the sheet" },
      { t: "One cluster", d: "LLM ≠ coding ≠ image", d2: "Separate RFPs when jobs differ", rule: "No undifferentiated list" },
    ]),
  },
  {
    name: "ai-requirements-guide-sheet.png",
    svg: sheetSvg(
      "ai",
      "One-page AI score sheet",
      "Every must-have needs evidence and a plan, credit, GPU, or Copilot SKU",
      ["Requirement", "Must / nice", "Evidence in trial", "Qualifying unit"],
      [
        ["Multi-turn research draft", "Must", "One real brief + connector", "Business seats"],
        ["IDE multi-file agent", "Must", "One refactor PR", "Coding seat / credits"],
        ["SSO / privacy mode", "Must", "Admin login on trial", "Enterprise / Business"],
        ["Campaign stills + IP", "Nice", "Three stills, terms check", "GPU hours"],
        ["Meeting transcripts", "Nice", "Three days of notes", "Minute caps"],
        ["No-code agent app", "Nice", "One internal workflow", "Agent plan"],
      ],
    ),
  },
  {
    name: "ai-evaluation-guide-hero.png",
    svg: heroSvg("ai", "AI evaluation script", "Same script, same plan, then compare notes", [
      { t: "Day 1 — setup", d: "Qualifying SKU only", d2: "No demo-tier features", rule: "Buy what you trial" },
      { t: "Day 2–3 — ritual", d: "One real weekly workflow", d2: "Sceptical user included", rule: "Accuracy over beauty" },
      { t: "Day 4 — decide", d: "Keep or cut", d2: "Affiliate economics out", rule: "Cluster peers only" },
    ]),
  },
  {
    name: "ai-evaluation-guide-script.png",
    svg: flowSvg("ai", "Four-day AI trial", "Northline Studio stills script — same gates on every finalist", [
      { t: "Day 1", d: "Qualifying GPU tier", d2: "IP terms on the quote", rule: "No demo SKU" },
      { t: "Day 2", d: "Three campaign stills", d2: "Stealth if required", rule: "Real brief" },
      { t: "Day 3", d: "Overage check", d2: "Sceptical designer", rule: "Caps show up" },
      { t: "Day 4", d: "Keep or cut", d2: "Midjourney vs Firefly", rule: "Image cluster only" },
    ]),
  },
  {
    name: "what-is-it-development-software-hero.png",
    svg: heroSvg("it", "IT & dev job clusters", "ITSM ≠ observability ≠ Git — never one ranked list", [
      { t: "ITSM", d: "ServiceNow / Freshservice / JSM", d2: "Per-agent or quote", rule: "JSM ≠ Jira Software" },
      { t: "Observability", d: "Datadog / New Relic / Grafana", d2: "Host, GB, or series", rule: "Not PagerDuty" },
      { t: "Dev + on-call", d: "GitHub / GitLab / PagerDuty", d2: "Seats, not one list", rule: "GitHub ≠ Copilot" },
      { t: "Host + collect", d: "Plesk / cPanel / Bright Data", d2: "Panel licences · proxy GB", rule: "Specialist jobs" },
    ]),
  },
  {
    name: "what-is-it-development-software-building-blocks.png",
    svg: heroSvg("it", "IT building blocks", "Buy the block that is blocking — specialists sit beside each other", [
      { t: "ITSM", d: "Incidents & change", d2: "CMDB, problems, assets", rule: "Employee desk" },
      { t: "Observe", d: "Metrics / traces / logs", d2: "Per-host + ingest GB", rule: "Service maps" },
      { t: "Page", d: "On-call & incident", d2: "Schedules and escalation", rule: "Not a metrics suite" },
      { t: "Git", d: "Source & CI/CD", d2: "Per-user git seats", rule: "Repos + pipelines" },
      { t: "Host", d: "Panel licences", d2: "Per-server Web Admin/Pro/Host", rule: "Ops SKU" },
      { t: "Collect", d: "Web data / proxy", d2: "PAYG or committed GB", rule: "Compliance first" },
    ]),
  },
  {
    name: "what-is-it-development-software-loop.png",
    svg: flowSvg("it", "Harbor Ops IT loop", "Each loop is a different purchase — identity mix-ups fail", [
      { t: "ITSM", d: "Employee tickets", d2: "ServiceNow / JSM / Freshservice", rule: "Not git" },
      { t: "Observe", d: "Service maps", d2: "Datadog cluster", rule: "Not paging" },
      { t: "Page", d: "On-call human", d2: "PagerDuty", rule: "≠ Datadog" },
      { t: "Git", d: "PRs & CI", d2: "GitHub / GitLab", rule: "≠ Copilot" },
      { t: "Host", d: "Panel SKU", d2: "Plesk / cPanel", rule: "Per server" },
    ]),
  },
  {
    name: "how-to-choose-it-development-software-hero.png",
    svg: heroSvg("it", "How to choose IT software", "Job first, then units, then product identity", [
      { t: "Name the job", d: "One weekly ritual sentence", d2: "ITSM vs observe vs page vs git", rule: "One cluster per sheet" },
      { t: "Map units", d: "Agents · hosts · ingest GB", d2: "Git seats · panel · proxy GB", rule: "Price the config" },
      { t: "Check identity", d: "JSM ≠ Jira Software", d2: "PagerDuty ≠ Datadog", rule: "Confirm the product" },
    ]),
  },
  {
    name: "how-to-choose-it-development-software-needs.png",
    svg: needsSvg("it", "Six worked examples", "Six teams, one category, six shortlists", [
      { problem: "Harbor Ops tickets", problemDetail: "Employee incidents need owners", fix: "ITSM / service desk", fixDetail: "ServiceNow · JSM · Freshservice" },
      { problem: "Northline latency", problemDetail: "Pages lack a service map", fix: "Observability", fixDetail: "Datadog · New Relic · Grafana Cloud" },
      { problem: "Harbor on-call", problemDetail: "Slack pings miss the human", fix: "Incident / on-call", fixDetail: "PagerDuty — not Datadog" },
      { problem: "Harbor repos", problemDetail: "PRs and CI without a forge", fix: "Source control", fixDetail: "GitHub · GitLab · Bitbucket" },
      { problem: "Northline hosting", problemDetail: "Per-server panel needed", fix: "Hosting operations", fixDetail: "Plesk vs cPanel licences" },
      { problem: "Harbor collection", problemDetail: "Compliant proxy GB sample", fix: "Web-data collection", fixDetail: "Bright Data — specialist cluster" },
    ]),
  },
  {
    name: "how-to-choose-it-development-software-framework.png",
    svg: flowSvg("it", "IT selection framework", "Job → gates → units → identity → trial", [
      { t: "Job", d: "One sentence", d2: "Weekly ritual", rule: "Cluster first" },
      { t: "Gates", d: "CMDB, APM", d2: "Paging, CI", rule: "Plan unlock" },
      { t: "Units", d: "Agent / host", d2: "GB / seats", rule: "Volume model" },
      { t: "ID", d: "JSM ≠ Jira", d2: "PD ≠ Datadog", rule: "Identity" },
      { t: "Trial", d: "One workflow", d2: "Three-day test", rule: "Keep or cut" },
    ]),
  },
  {
    name: "it-development-pricing-guide-hero.png",
    svg: heroSvg("it", "IT pricing units", "Never compare starter tiles across jobs", [
      { t: "Per-agent / git seats", d: "ITSM agents and git users", d2: "Published SKU or quote-led", rule: "Headcount floor" },
      { t: "Per-host / ingest GB", d: "Observability infrastructure + logs", d2: "Modules stack on the floor", rule: "Model volume" },
      { t: "Panel / proxy GB", d: "Per-server licences", d2: "PAYG or committed proxy", rule: "Different purchases" },
    ]),
  },
  {
    name: "it-development-pricing-guide-stack.png",
    svg: stackSvg("it", "IT cost stack", "The starter tile is the bottom layer", [
      { t: "Per-agent floor", d: "ITSM seats on the qualifying ITIL tier", rule: "Not observability" },
      { t: "Per-host floor", d: "Infrastructure metrics for the fleet", rule: "Datadog cluster" },
      { t: "Ingest GB", d: "Logs and traces retention", rule: "Overage line item" },
      { t: "DPS / git seats", d: "Commit or per-user source-control packaging", rule: "GitHub cluster" },
      { t: "Panel licences", d: "Per-server Web Admin / Pro / Host", rule: "Plesk / cPanel" },
      { t: "Proxy GB + total", d: "Committed collection plus like-for-like total", rule: "Compare configs" },
    ]),
  },
  {
    name: "it-development-pricing-guide-worked-example.png",
    svg: compareSvg(
      "it",
      "Northline Platform qualifying quote",
      "15 ITSM agents + ~80 hosts with 30-day log retention",
      {
        title: "Cheaper tile (fails)",
        lines: [
          "Host-only observability Starter",
          "APM gated on a higher pack",
          "ITSM ignored (“we have Slack”)",
          "PagerDuty compared as a Datadog peer",
          "Looks cheap on the homepage",
          "No ingest-GB model",
          "Fails the weekly service-map ritual",
        ],
      },
      {
        title: "Qualifying config (honest)",
        lines: [
          "ITSM on Freshservice or JSM SKU",
          "ServiceNow only if quote is acceptable",
          "Datadog hosts + APM + log GB",
          "PagerDuty on a separate on-call sheet",
          "GitHub seats already in the stack",
          "Higher total — correct jobs",
          "Compare this total, not Starter",
        ],
      },
      "Same team, same requirements — hosts, GB, and modules decide TCO.",
    ),
  },
  {
    name: "it-development-requirements-guide-hero.png",
    svg: heroSvg("it", "IT requirements sheet", "Jobs and evidence — not a 40-row wishlist", [
      { t: "Must vs nice", d: "90-day rule", d2: "If you operate without it, it is nice", rule: "Force a ranking" },
      { t: "Usage unit", d: "Agent / host / GB / seat / licence", d2: "Write the qualifying pack", rule: "Gates on the sheet" },
      { t: "One cluster", d: "ITSM ≠ observe ≠ on-call", d2: "Separate RFPs when jobs differ", rule: "No undifferentiated list" },
    ]),
  },
  {
    name: "it-development-requirements-guide-sheet.png",
    svg: sheetSvg(
      "it",
      "One-page IT score sheet",
      "Every must-have needs evidence and an agent, host, GB, seat, or licence tier",
      ["Requirement", "Must / nice", "Evidence in trial", "Qualifying unit"],
      [
        ["Employee incident + change", "Must", "One ITIL loop on the SKU", "Per-agent ITSM"],
        ["Service map + log search", "Must", "One instrumented service", "Host + ingest GB"],
        ["Page the on-call", "Must", "Test page on a rotation", "Responder seats"],
        ["PR + CI on git host", "Nice", "One merge with Actions", "Git seats"],
        ["Panel provision", "Nice", "One site on Web Host", "Per-server licence"],
        ["Proxy sample", "Nice", "Compliant GB pull", "Proxy GB commit"],
      ],
    ),
  },
  {
    name: "it-development-evaluation-guide-hero.png",
    svg: heroSvg("it", "IT evaluation script", "Same script, same plan, then compare notes", [
      { t: "Day 1 — setup", d: "Qualifying SKU only", d2: "No demo-tier modules", rule: "Buy what you trial" },
      { t: "Day 2–3 — ritual", d: "One real weekly workflow", d2: "Sceptical operator included", rule: "Accuracy over beauty" },
      { t: "Day 4 — decide", d: "Keep or cut", d2: "Affiliate economics out", rule: "Cluster peers only" },
    ]),
  },
  {
    name: "it-development-evaluation-guide-script.png",
    svg: flowSvg("it", "Four-day IT trial", "Northline Platform observability script — PagerDuty stays off this sheet", [
      { t: "Day 1", d: "Qualifying host pack", d2: "APM + log GB on quote", rule: "No demo SKU" },
      { t: "Day 2", d: "Instrument one service", d2: "Map, trace, log search", rule: "Real traffic" },
      { t: "Day 3", d: "Retention / overage", d2: "Sceptical SRE", rule: "GB shows up" },
      { t: "Day 4", d: "Keep or cut", d2: "Datadog vs New Relic vs Grafana", rule: "Observe cluster only" },
    ]),
  },
];

for (const j of useCaseJobs) {
  await writePng(j.dir, `${j.base}-hero.png`, j.svg);
}

for (const j of guideJobs) {
  await writePng("public/guides", j.name, j.svg);
}
