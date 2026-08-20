/**
 * Generate realistic CRM / sales-intelligence UI-mockup visuals for product guides.
 *
 * DEPRECATED for shipped teaching art.
 * Prefer GenerateImage per `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * and save as `public/guides/{slug}-cover|diagram|step-v4-*.png`.
 * `productGuideHeroSrc` / `productGuideFigureSrc` already prefer `-v4` when present.
 *
 * `--promote-v4` writes unique 1536×1024 ~1 MB cover/diagram art for packs that
 * lack premium files. Never overwrites existing ≥900 KB GenerateImage assets.
 * Do not emit SVG `-v3` placeholders — they fail the teaching-visual size bar.
 *
 * Usage:
 *   npx tsx scripts/product-guide-visuals.ts           # CRM only (default)
 *   npx tsx scripts/product-guide-visuals.ts --si      # sales-intelligence only
 *   npx tsx scripts/product-guide-visuals.ts --em      # email-marketing only
 *   npx tsx scripts/product-guide-visuals.ts --bc      # business-communications only
 *   npx tsx scripts/product-guide-visuals.ts --marketing  # marketing & growth only
 *   npx tsx scripts/product-guide-visuals.ts --pm      # project-management only
 *   npx tsx scripts/product-guide-visuals.ts --ai      # AI software only
 *   npx tsx scripts/product-guide-visuals.ts --it      # IT & development only
 *   npx tsx scripts/product-guide-visuals.ts --all     # CRM + SI + EM + marketing + BC + PM + AI + IT
 *   npx tsx scripts/product-guide-visuals.ts --promote-v4
 *     Write unique `-cover-v4` / `-diagram-v4` (1536×1024, ~1 MB) for packs
 *     missing premium art. Never overwrites existing files ≥900 KB.
 *   npx tsx scripts/product-guide-visuals.ts --prune-v3
 *     Delete SVG `-v3` leftovers after `-cover-v4` exists for that slug.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { getSoftwareBySlug } from "../src/data/repositories/catalog";
import {
  CRM_PRODUCT_GUIDE_KINDS,
  productGuideSlug,
  type CrmProductGuideKind,
} from "../src/services/product-guides/kinds";
import {
  listBcProductGuideSlugs,
  listCrmProductGuideSlugs,
  listEmProductGuideSlugs,
  listHrProductGuideSlugs,
  listMarketingProductGuideSlugs,
  listPmProductGuideSlugs,
  listSiProductGuideSlugs,
  listAiProductGuideSlugs,
  listItProductGuideSlugs,
  listEcommerceProductGuideSlugs,
  loadProductGuideContext,
} from "../src/services/product-guides/context";

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/guides");
const W = 1536;
const H = 1024;
const PANEL_H = 820;
const FONT =
  "ui-sans-serif, system-ui, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function displayName(slug: string): string {
  const soft = getSoftwareBySlug(slug, { includeUnpublished: true });
  if (slug === "monday-sales-crm") return "monday sales CRM";
  if (slug === "folk") return "Folk";
  return soft?.name?.trim() || slug;
}

function publicPathToFs(webPath: string): string {
  return path.join(ROOT, "public", webPath.replace(/^\//, ""));
}

function shell(width: number, height: number, body: string): Buffer {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="desk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dbeafe"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cffafe"/>
    </linearGradient>
    <filter id="win" x="-4%" y="-4%" width="108%" height="112%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
    <filter id="card" x="-2%" y="-2%" width="104%" height="108%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#desk)"/>
  ${body}
</svg>`);
}

/** Floating teaching caption under / beside the UI. */
function teachBanner(
  x: number,
  y: number,
  w: number,
  title: string,
  body: string,
  tone = "#1d4ed8",
): string {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="88" rx="16" fill="#0f172a" fill-opacity="0.92" filter="url(#card)"/>
  <rect x="${x}" y="${y}" width="8" height="88" rx="4" fill="${tone}"/>
  <text x="${x + 28}" y="${y + 34}" font-family="${FONT}" font-size="15" font-weight="800" fill="#93c5fd" letter-spacing="0.04em">${esc(title.toUpperCase())}</text>
  <text x="${x + 28}" y="${y + 64}" font-family="${FONT}" font-size="18" font-weight="600" fill="#f8fafc">${esc(body)}</text>`;
}

function browserWindow(
  x: number,
  y: number,
  w: number,
  h: number,
  urlLabel: string,
  content: string,
): string {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#0f172a" filter="url(#win)"/>
  <rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="17" fill="#f1f5f9"/>
  <rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="48" rx="17" fill="#e2e8f0"/>
  <rect x="${x + 1}" y="${y + 30}" width="${w - 2}" height="20" fill="#e2e8f0"/>
  <circle cx="${x + 28}" cy="${y + 25}" r="7" fill="#f87171"/>
  <circle cx="${x + 52}" cy="${y + 25}" r="7" fill="#fbbf24"/>
  <circle cx="${x + 76}" cy="${y + 25}" r="7" fill="#34d399"/>
  <rect x="${x + 120}" y="${y + 14}" width="${Math.min(520, w - 200)}" height="28" rx="10" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="${x + 140}" y="${y + 34}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(urlLabel)}</text>
  <rect x="${x + 1}" y="${y + 49}" width="${w - 2}" height="${h - 50}" fill="#f8fafc"/>
  ${content}`;
}

function appShell(
  x: number,
  y: number,
  w: number,
  h: number,
  name: string,
  active: string,
  main: string,
): string {
  const nav = ["Home", "Pipeline", "People", "Companies", "Reports", "Settings"];
  const items = nav
    .map((label, i) => {
      const iy = y + 120 + i * 52;
      const on = label === active;
      return `
      <rect x="${x + 16}" y="${iy}" width="188" height="42" rx="10" fill="${on ? "#2563eb" : "transparent"}"/>
      <text x="${x + 40}" y="${iy + 27}" font-family="${FONT}" font-size="16" font-weight="${on ? 700 : 500}" fill="${on ? "#ffffff" : "#cbd5e1"}">${label}</text>`;
    })
    .join("");
  return `
  ${browserWindow(
    x,
    y,
    w,
    h,
    `app.${name.toLowerCase().replace(/\s+/g, "")}.example / ${active.toLowerCase()}`,
    `
    <rect x="${x + 1}" y="${y + 49}" width="220" height="${h - 50}" fill="#0f172a"/>
    <text x="${x + 28}" y="${y + 92}" font-family="${FONT}" font-size="22" font-weight="800" fill="#ffffff">${esc(name)}</text>
    ${items}
    <rect x="${x + 221}" y="${y + 49}" width="${w - 222}" height="${h - 50}" fill="#f8fafc"/>
    ${main}
    `,
  )}`;
}

function dealCard(
  x: number,
  y: number,
  title: string,
  meta: string,
  next: string,
  accent: string,
): string {
  return `
  <rect x="${x}" y="${y}" width="200" height="118" rx="12" fill="#ffffff" stroke="#e2e8f0" filter="url(#card)"/>
  <rect x="${x}" y="${y}" width="6" height="118" rx="3" fill="${accent}"/>
  <text x="${x + 18}" y="${y + 30}" font-family="${FONT}" font-size="15" font-weight="700" fill="#0f172a">${esc(title)}</text>
  <text x="${x + 18}" y="${y + 54}" font-family="${FONT}" font-size="13" fill="#64748b">${esc(meta)}</text>
  <rect x="${x + 18}" y="${y + 72}" width="164" height="28" rx="8" fill="#eff6ff"/>
  <text x="${x + 28}" y="${y + 91}" font-family="${FONT}" font-size="12" font-weight="600" fill="#1d4ed8">${esc(next)}</text>`;
}

function pipelineBoard(name: string, annotate = true): Buffer {
  const stages = [
    { label: "Qualified", color: "#2563eb", deals: [["Northwind", "Owner: Sam", "Call Thu"], ["Helix Labs", "Owner: Priya", "Send deck"]] },
    { label: "Proposal", color: "#0ea5e9", deals: [["Brightline", "Owner: Sam", "Pricing Qs"], ["Orbit Co", "Owner: Lee", "Demo Fri"]] },
    { label: "Negotiation", color: "#0d9488", deals: [["Cascade", "Owner: Priya", "Legal review"]] },
    { label: "Won", color: "#16a34a", deals: [["Maple Soft", "Owner: Sam", "Kickoff booked"]] },
  ];
  const cols = stages
    .map((s, i) => {
      const x = 280 + i * 280;
      const cards = s.deals
        .map((d, j) => dealCard(x + 16, 180 + j * 136, d[0]!, d[1]!, `Next: ${d[2]}`, s.color))
        .join("");
      return `
      <rect x="${x}" y="100" width="252" height="520" rx="14" fill="#eef2ff" fill-opacity="0.55"/>
      <text x="${x + 16}" y="136" font-family="${FONT}" font-size="15" font-weight="800" fill="#334155">${s.label.toUpperCase()}</text>
      <circle cx="${x + 220}" cy="130" r="12" fill="${s.color}"/>
      <text x="${x + 220}" y="135" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="800" fill="#fff">${s.deals.length}</text>
      ${cards}`;
    })
    .join("");

  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Main pipeline</text>
    <rect x="1180" y="62" width="160" height="36" rx="10" fill="#2563eb"/>
    <text x="1260" y="86" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="700" fill="#fff">+ New deal</text>
    ${cols}
    <rect x="280" y="640" width="1080" height="56" rx="12" fill="#ecfdf5" stroke="#6ee7b7"/>
    <text x="310" y="675" font-family="${FONT}" font-size="16" font-weight="700" fill="#065f46">Friday review: every open deal has owner · stage · dated next step</text>`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 780, name, "Pipeline", main)}
    ${
      annotate
        ? teachBanner(
            48,
            860,
            1440,
            "What good looks like",
            `Run ${name} Friday reviews from this board — not a spreadsheet.`,
            "#0d9488",
          )
        : ""
    }`,
  );
}

function dealRecord(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Deal · Brightline renewal</text>
    <rect x="260" y="120" width="720" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${[
      ["Company", "Brightline Inc"],
      ["Owner", "Sam Rivera"],
      ["Stage", "Proposal"],
      ["Next step", "Send revised pricing"],
      ["Next-step date", "Fri 21 Mar"],
      ["Expected close", "31 Mar"],
    ]
      .map((row, i) => {
        const y = 160 + i * 72;
        return `
        <text x="296" y="${y}" font-family="${FONT}" font-size="13" font-weight="700" fill="#64748b" letter-spacing="0.04em">${row[0]!.toUpperCase()}</text>
        <rect x="296" y="${y + 12}" width="640" height="40" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="316" y="${y + 38}" font-family="${FONT}" font-size="16" font-weight="600" fill="#0f172a">${esc(row[1]!)}</text>`;
      })
      .join("")}
    <rect x="1020" y="120" width="360" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="1052" y="168" font-family="${FONT}" font-size="16" font-weight="800" fill="#0f172a">Activity</text>
    ${["Email · pricing deck sent", "Call · 24 min with CFO", "Note · legal reviewing MSA"]
      .map((t, i) => {
        const y = 210 + i * 100;
        return `
        <rect x="1052" y="${y}" width="296" height="76" rx="12" fill="#eff6ff"/>
        <text x="1072" y="${y + 44}" font-family="${FONT}" font-size="14" font-weight="600" fill="#1e3a8a">${esc(t)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 780, name, "Pipeline", main)}
    ${teachBanner(48, 860, 1440, "Required fields", `In ${name}, make owner, next step, and next-step date required before go-live.`, "#2563eb")}`,
  );
}

function settingsSetup(name: string): Buffer {
  const steps = [
    { n: 1, t: "Workspace", d: "Company, currency, timezone", on: false },
    { n: 2, t: "Pipeline", d: "One motion · 6 stages", on: true },
    { n: 3, t: "Users and roles", d: "Daily sellers only", on: false },
    { n: 4, t: "Email sync", d: "Connect mailboxes", on: false },
    { n: 5, t: "Loop proof", d: "Non-admin walkthrough", on: false },
  ];
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} setup checklist</text>
    <rect x="260" y="120" width="520" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${steps
      .map((s, i) => {
        const y = 150 + i * 100;
        return `
        <rect x="284" y="${y}" width="472" height="84" rx="14" fill="${s.on ? "#eff6ff" : "#f8fafc"}" stroke="${s.on ? "#93c5fd" : "#e2e8f0"}"/>
        <circle cx="330" cy="${y + 42}" r="22" fill="${s.on ? "#2563eb" : "#cbd5e1"}"/>
        <text x="330" y="${y + 48}" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="800" fill="#fff">${s.n}</text>
        <text x="372" y="${y + 36}" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">${esc(s.t)}</text>
        <text x="372" y="${y + 60}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(s.d)}</text>`;
      })
      .join("")}
    <rect x="820" y="120" width="560" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="852" y="172" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">Pipeline stages</text>
    ${["Qualified", "Scoped", "Proposal", "Verbal", "Won", "Lost"]
      .map((st, i) => {
        const y = 210 + i * 68;
        return `
        <rect x="852" y="${y}" width="496" height="52" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
        <circle cx="884" cy="${y + 26}" r="8" fill="${["#2563eb", "#0ea5e9", "#0d9488", "#ea580c", "#16a34a", "#94a3b8"][i]}"/>
        <text x="912" y="${y + 32}" font-family="${FONT}" font-size="16" font-weight="600" fill="#0f172a">${st}</text>
        <text x="1280" y="${y + 32}" text-anchor="end" font-family="${FONT}" font-size="13" fill="#94a3b8">drag</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 780, name, "Settings", main)}
    ${teachBanner(48, 860, 1440, "Day-zero order", `Finish pipeline + users + email in ${name} before marketplace apps.`, "#0d9488")}`,
  );
}

function emailSyncScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Integrations · Email and calendar</text>
    ${[
      ["Google Workspace", "Connected · 8 mailboxes", true, "#16a34a"],
      ["Microsoft 365", "Not connected", false, "#94a3b8"],
      ["Calendar sync", "Connected", true, "#16a34a"],
      ["Accounting", "Deferred to day 30", false, "#ea580c"],
    ]
      .map((row, i) => {
        const y = 130 + i * 120;
        const on = row[2] === true;
        return `
        <rect x="260" y="${y}" width="1120" height="100" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
        <circle cx="320" cy="${y + 50}" r="28" fill="${on ? "#dcfce7" : "#f1f5f9"}"/>
        <text x="390" y="${y + 42}" font-family="${FONT}" font-size="20" font-weight="800" fill="#0f172a">${esc(String(row[0]))}</text>
        <text x="390" y="${y + 70}" font-family="${FONT}" font-size="15" fill="#64748b">${esc(String(row[1]))}</text>
        <rect x="1180" y="${y + 30}" width="140" height="40" rx="20" fill="${on ? "#16a34a" : "#e2e8f0"}"/>
        <circle cx="${on ? 1290 : 1210}" cy="${y + 50}" r="14" fill="#ffffff"/>
        <text x="1250" y="${y + 56}" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="${on ? "#fff" : "#64748b"}">${on ? "ON" : "OFF"}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 780, name, "Settings", main)}
    ${teachBanner(48, 860, 1440, "Connect now", `Email + calendar first in ${name}. Defer finance/docs until adoption holds.`, "#ea580c")}`,
  );
}

function fieldMapScreen(name: string): Buffer {
  const rows = [
    ["account_name", "Company → Name", "Direct"],
    ["contact_email", "Person → Email", "Direct"],
    ["opp_stage", "Deal → Stage", "Map meanings"],
    ["status_note", "—", "Archive only"],
    ["owner_id", "Deal → Owner", "Remap users"],
    ["last_activity", "Activity → Date", "Transform"],
  ];
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Migration · Field map into ${esc(name)}</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="56" rx="16" fill="#0f172a"/>
    <rect x="260" y="156" width="1120" height="20" fill="#0f172a"/>
    <text x="290" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">SOURCE FIELD</text>
    <text x="620" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">${esc(name.toUpperCase())} DESTINATION</text>
    <text x="1100" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">RULE</text>
    ${rows
      .map((r, i) => {
        const y = 196 + i * 76;
        const archive = r[2] === "Archive only";
        return `
        <rect x="280" y="${y}" width="1080" height="64" rx="10" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="300" y="${y + 38}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" fill="#334155">${esc(r[0]!)}</text>
        <text x="620" y="${y + 38}" font-family="${FONT}" font-size="16" font-weight="600" fill="#0f172a">${esc(r[1]!)}</text>
        <rect x="1080" y="${y + 16}" width="250" height="32" rx="8" fill="${archive ? "#fff1f2" : "#ecfdf5"}"/>
        <text x="1205" y="${y + 38}" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="${archive ? "#be123c" : "#047857"}">${esc(r[2]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 780, name, "Settings", main)}
    ${teachBanner(48, 860, 1440, "Map meanings first", `Don’t bulk-import into ${name} until stage meanings and owners are signed off.`, "#2563eb")}`,
  );
}

function pilotImportScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Import wizard · Pilot (Sam’s book)</text>
    <rect x="260" y="120" width="1120" height="120" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="296" y="175" font-family="${FONT}" font-size="18" font-weight="700" fill="#1e40af">Step 2 of 4 · Preview 47 records before commit</text>
    <text x="296" y="210" font-family="${FONT}" font-size="15" fill="#1d4ed8">Companies 18 · People 41 · Deals 47 · Activities 210</text>
    <rect x="260" y="270" width="1120" height="400" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${["✓ Company names match source", "✓ Owners remap to active users", "⚠ 2 stages need meaning review", "✓ No duplicate emails in sample"]
      .map((t, i) => {
        const y = 320 + i * 80;
        const warn = t.startsWith("⚠");
        return `
        <rect x="296" y="${y}" width="1048" height="60" rx="12" fill="${warn ? "#fffbeb" : "#ecfdf5"}"/>
        <text x="328" y="${y + 38}" font-family="${FONT}" font-size="18" font-weight="600" fill="${warn ? "#b45309" : "#065f46"}">${esc(t)}</text>`;
      })
      .join("")}
    <rect x="260" y="700" width="200" height="44" rx="10" fill="#e2e8f0"/>
    <text x="360" y="728" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="700" fill="#475569">Back</text>
    <rect x="1180" y="700" width="200" height="44" rx="10" fill="#2563eb"/>
    <text x="1280" y="728" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="700" fill="#fff">Import pilot</text>`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 820, name, "Settings", main)}
    ${teachBanner(48, 900, 1440, "Pilot before bulk", `Fix mapping issues on one seller’s ${name} book — then scale.`, "#0d9488")}`,
  );
}

function plansTable(name: string): Buffer {
  const plans = ["Free", "Plus", "Pro", "Enterprise"];
  const features = [
    ["Contacts and companies", "✓", "✓", "✓", "✓"],
    ["Pipeline and deals", "✓", "✓", "✓", "✓"],
    ["Email sync", "—", "✓", "✓", "✓"],
    ["Custom fields", "Limited", "✓", "✓", "✓"],
    ["Reporting", "Basic", "✓", "✓", "✓"],
    ["Forecasting", "—", "—", "✓", "✓"],
    ["AI assistance", "—", "✓", "✓", "✓"],
  ];
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="26" font-weight="800" fill="#0f172a">${esc(name)} plans · must-haves vs tiers</text>
    <text x="80" y="108" font-family="${FONT}" font-size="16" fill="#64748b">Illustrative researched packaging — confirm live on the pricing page</text>
    <rect x="80" y="140" width="1376" height="700" rx="18" fill="#ffffff" filter="url(#win)"/>
    <rect x="80" y="140" width="320" height="700" fill="#0f172a"/>
    <text x="110" y="200" font-family="${FONT}" font-size="15" font-weight="800" fill="#94a3b8">CAPABILITY</text>
    ${plans
      .map((p, i) => {
        const x = 420 + i * 250;
        const hot = p === "Pro";
        return `
        <rect x="${x - 20}" y="140" width="250" height="90" fill="${hot ? "#2563eb" : "#f8fafc"}"/>
        <text x="${x + 105}" y="195" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="800" fill="${hot ? "#fff" : "#0f172a"}">${p}</text>
        ${hot ? `<text x="${x + 105}" y="220" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="700" fill="#bfdbfe">QUALIFYING EXAMPLE</text>` : ""}`;
      })
      .join("")}
    ${features
      .map((row, i) => {
        const y = 260 + i * 78;
        return `
        <text x="110" y="${y + 28}" font-family="${FONT}" font-size="16" font-weight="600" fill="#e2e8f0">${esc(row[0]!)}</text>
        ${row
          .slice(1)
          .map((cell, j) => {
            const x = 525 + j * 250;
            const good = cell === "✓";
            const bad = cell === "—";
            return `<text x="${x}" y="${y + 28}" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="800" fill="${good ? "#4ade80" : bad ? "#64748b" : "#fbbf24"}">${esc(cell)}</text>`;
          })
          .join("")}
        <line x1="100" y1="${y + 52}" x2="1420" y2="${y + 52}" stroke="#1e293b" stroke-opacity="0.35"/>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `${name.toLowerCase().replace(/\s+/g, "")}.com/pricing`, main)}
    ${teachBanner(40, 930, 1456, "How to use this", `Circle your must-haves, then pick the cheapest ${name} column that covers every one.`, "#2563eb")}`,
  );
}

function planGateSheet(name: string): Buffer {
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">Must-have worksheet · ${esc(name)}</text>
    <rect x="80" y="110" width="900" height="700" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="80" y="110" width="900" height="56" fill="#0f172a"/>
    <text x="110" y="146" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">DAY-ONE MUST</text>
    <text x="520" y="146" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">LOWEST PLAN</text>
    <text x="760" y="146" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">STATUS</text>
    ${[
      ["Email sync for sellers", "Plus+", "Clears"],
      ["Custom pipeline fields", "Plus+", "Clears"],
      ["Forecasting board", "Pro+", "Sets the plan"],
      ["AI meeting notes", "Plus+", "Nice later"],
      ["SSO / advanced admin", "Enterprise", "Not day-one"],
    ]
      .map((r, i) => {
        const y = 190 + i * 100;
        const sets = r[2] === "Sets the plan";
        return `
        <rect x="100" y="${y}" width="860" height="80" rx="12" fill="${sets ? "#eff6ff" : "#f8fafc"}" stroke="${sets ? "#93c5fd" : "#e2e8f0"}"/>
        <text x="130" y="${y + 46}" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="540" y="${y + 46}" font-family="${FONT}" font-size="18" font-weight="700" fill="#1d4ed8">${esc(r[1]!)}</text>
        <text x="780" y="${y + 46}" font-family="${FONT}" font-size="16" font-weight="700" fill="${sets ? "#1d4ed8" : "#64748b"}">${esc(r[2]!)}</text>`;
      })
      .join("")}
    <rect x="1020" y="110" width="440" height="700" rx="16" fill="#ecfdf5" stroke="#6ee7b7"/>
    <text x="1060" y="180" font-family="${FONT}" font-size="18" font-weight="800" fill="#047857">RESULT</text>
    <text x="1060" y="250" font-family="${FONT}" font-size="32" font-weight="800" fill="#064e3b">Qualifying</text>
    <text x="1060" y="300" font-family="${FONT}" font-size="32" font-weight="800" fill="#064e3b">plan: Pro</text>
    <text x="1060" y="380" font-family="${FONT}" font-size="16" fill="#065f46">Set by forecasting — your</text>
    <text x="1060" y="414" font-family="${FONT}" font-size="16" fill="#065f46">highest gated must-have.</text>
    <text x="1060" y="490" font-family="${FONT}" font-size="16" fill="#047857">Next: estimate seats in the</text>
    <text x="1060" y="524" font-family="${FONT}" font-size="16" fill="#047857">Cost Calculator, then confirm</text>
    <text x="1060" y="558" font-family="${FONT}" font-size="16" fill="#047857">on the live pricing page.</text>`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `docs · ${name} plan worksheet`, main)}
    ${teachBanner(40, 930, 1456, "Decision rule", `The highest gated must-have sets your ${name} plan — not the homepage starting tile.`, "#0d9488")}`,
  );
}

function worthItScorecard(name: string): Buffer {
  const qs = [
    ["Fit motion", "Matches best-for patterns", "Yes"],
    ["Admin time", "~2 hrs/week named owner", "Yes"],
    ["Core loop", "Seller ran deal unaided", "Yes"],
    ["Plan gates", "Musts on qualifying tier", "Needs check"],
    ["Integrations", "Daily tools confirmed", "Yes"],
    ["Tradeoffs", "Can live with known limits", "Yes"],
  ];
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="26" font-weight="800" fill="#0f172a">Is ${esc(name)} worth it? · trial scorecard</text>
    <rect x="80" y="110" width="900" height="720" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${qs
      .map((q, i) => {
        const y = 140 + i * 110;
        const ok = q[2] === "Yes";
        return `
        <rect x="110" y="${y}" width="840" height="90" rx="14" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="140" y="${y + 38}" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">${esc(q[0]!)}</text>
        <text x="140" y="${y + 66}" font-family="${FONT}" font-size="15" fill="#64748b">${esc(q[1]!)}</text>
        <rect x="760" y="${y + 24}" width="160" height="42" rx="12" fill="${ok ? "#dcfce7" : "#fef3c7"}"/>
        <text x="840" y="${y + 52}" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="800" fill="${ok ? "#166534" : "#92400e"}">${esc(q[2]!)}</text>`;
      })
      .join("")}
    <rect x="1020" y="110" width="440" height="720" rx="16" fill="#0f172a"/>
    <text x="1060" y="190" font-family="${FONT}" font-size="16" font-weight="800" fill="#93c5fd">VERDICT PATH</text>
    <text x="1060" y="260" font-family="${FONT}" font-size="36" font-weight="800" fill="#ffffff">Trial longer</text>
    <text x="1060" y="320" font-family="${FONT}" font-size="18" fill="#cbd5e1">5 / 6 gates clear.</text>
    <text x="1060" y="360" font-family="${FONT}" font-size="18" fill="#cbd5e1">Close the plan-gate gap</text>
    <text x="1060" y="400" font-family="${FONT}" font-size="18" fill="#cbd5e1">before you buy.</text>
    <rect x="1060" y="480" width="360" height="100" rx="14" fill="#1e293b"/>
    <text x="1088" y="540" font-family="${FONT}" font-size="16" fill="#e2e8f0">Buy only when fit + loop + plan all say yes.</text>
    <rect x="1060" y="620" width="360" height="120" rx="14" fill="#2563eb"/>
    <text x="1088" y="680" font-family="${FONT}" font-size="18" font-weight="700" fill="#fff">Next: ${esc(name)} plans guide</text>
    <text x="1088" y="712" font-family="${FONT}" font-size="15" fill="#bfdbfe">Confirm qualifying tier in writing</text>`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 900, `evaluate · ${name}`, main)}
    ${teachBanner(40, 950, 1456, "No invented ROI", `If fit, trial proof, or plan coverage fails — keep looking instead of forcing ${name}.`, "#e11d48")}`,
  );
}

/** Seat + billing worksheet — unique plans step (not a second copy of the gate sheet). */
function seatsBillingScreen(name: string): Buffer {
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">${esc(name)} · seats and billing worksheet</text>
    <text x="80" y="108" font-family="${FONT}" font-size="16" fill="#64748b">Count who logs in weekly — not headcount — then annualize before you compare</text>
    <rect x="80" y="140" width="700" height="680" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="112" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">Who needs a seat?</text>
    ${[
      ["Sellers (daily)", "8", "Required"],
      ["Managers (weekly)", "2", "Required"],
      ["Ops / admin", "1", "Required"],
      ["View-only execs", "3", "Defer / report export"],
      ["Contractors", "2", "Shared process — no seat"],
    ]
      .map((r, i) => {
        const y = 220 + i * 100;
        const req = r[2] === "Required";
        return `
        <rect x="112" y="${y}" width="636" height="80" rx="12" fill="${req ? "#eff6ff" : "#f8fafc"}" stroke="${req ? "#93c5fd" : "#e2e8f0"}"/>
        <text x="140" y="${y + 34}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="140" y="${y + 60}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(r[2]!)}</text>
        <text x="680" y="${y + 50}" text-anchor="end" font-family="${FONT}" font-size="28" font-weight="800" fill="#1d4ed8">${esc(r[1]!)}</text>`;
      })
      .join("")}
    <rect x="820" y="140" width="640" height="680" rx="16" fill="#0f172a"/>
    <text x="860" y="210" font-family="${FONT}" font-size="16" font-weight="800" fill="#93c5fd">WORKING TOTAL</text>
    <text x="860" y="290" font-family="${FONT}" font-size="56" font-weight="800" fill="#ffffff">11 seats</text>
    <text x="860" y="350" font-family="${FONT}" font-size="18" fill="#cbd5e1">Required logins only</text>
    <rect x="860" y="400" width="560" height="140" rx="14" fill="#1e293b"/>
    <text x="892" y="460" font-family="${FONT}" font-size="17" fill="#e2e8f0">Monthly list × 11 × 12 = annual</text>
    <text x="892" y="500" font-family="${FONT}" font-size="17" fill="#e2e8f0">baseline before add-ons / discounts</text>
    <rect x="860" y="580" width="560" height="160" rx="14" fill="#2563eb"/>
    <text x="892" y="650" font-family="${FONT}" font-size="18" font-weight="700" fill="#fff">Next: Cost Calculator</text>
    <text x="892" y="686" font-family="${FONT}" font-size="15" fill="#bfdbfe">Confirm live ${esc(name)} list price before budget lock</text>`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `estimate · ${name} seats`, main)}
    ${teachBanner(40, 930, 1456, "Seat discipline", `If someone never logs into ${name} weekly, they are not a seat — they need a report.`, "#2563eb")}`,
  );
}

/** Custom-quote diligence board — unique plans step for enterprise packaging. */
function quoteDiligenceScreen(name: string): Buffer {
  const rows = [
    ["Ed editions / SKUs on quote", "Named in writing", "Open"],
    ["Seat definition (full vs light)", "Written", "Open"],
    ["Implementation / success fees", "Line-itemed", "Missing"],
    ["Contract term + renewal uplift", "Capped", "Open"],
    ["Exit / export rights", "Confirmed", "Clear"],
  ];
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">${esc(name)} · quote diligence board</text>
    <text x="80" y="108" font-family="${FONT}" font-size="16" fill="#64748b">When list pricing is opaque, refuse to compare on a homepage tile alone</text>
    <rect x="80" y="140" width="1376" height="700" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="80" y="140" width="1376" height="64" fill="#0f172a"/>
    <text x="120" y="182" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">CHECK</text>
    <text x="720" y="182" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">EVIDENCE NEEDED</text>
    <text x="1180" y="182" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">STATUS</text>
    ${rows
      .map((r, i) => {
        const y = 230 + i * 110;
        const clear = r[2] === "Clear";
        const missing = r[2] === "Missing";
        return `
        <rect x="110" y="${y}" width="1316" height="90" rx="14" fill="${missing ? "#fff1f2" : clear ? "#ecfdf5" : "#f8fafc"}" stroke="${missing ? "#fb7185" : clear ? "#6ee7b7" : "#e2e8f0"}"/>
        <text x="140" y="${y + 52}" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="720" y="${y + 52}" font-family="${FONT}" font-size="17" fill="#475569">${esc(r[1]!)}</text>
        <rect x="1160" y="${y + 24}" width="220" height="42" rx="12" fill="${missing ? "#fecdd3" : clear ? "#bbf7d0" : "#e2e8f0"}"/>
        <text x="1270" y="${y + 52}" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="800" fill="${missing ? "#9f1239" : clear ? "#166534" : "#475569"}">${esc(r[2]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `procurement · ${name}`, main)}
    ${teachBanner(40, 930, 1456, "No vague quotes", `Do not shortlist ${name} until every open row has a written answer you can re-read later.`, "#e11d48")}`,
  );
}

/** Trial proof board — unique worth-it step (not a second scorecard). */
function trialProofScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · trial proof log (week 2)</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="56" fill="#0f172a"/>
    ${["PROOF", "OWNER", "RESULT", "DATE"]
      .map((h, i) => `<text x="${300 + i * 270}" y="158" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["Non-admin created a deal", "Priya", "Pass", "Mar 12"],
      ["Logged activity + next step", "Priya", "Pass", "Mar 12"],
      ["Moved stage with reason", "Sam", "Pass", "Mar 13"],
      ["Email landed on the record", "Ops", "Fail → fix sync", "Mar 14"],
      ["Friday review ran from CRM", "Sales lead", "Scheduled", "Mar 15"],
    ]
      .map((r, i) => {
        const y = 200 + i * 90;
        const fail = String(r[2]).startsWith("Fail");
        const pass = r[2] === "Pass";
        return `
        <rect x="280" y="${y}" width="1080" height="72" rx="12" fill="${fail ? "#fff1f2" : pass ? "#ecfdf5" : "#fffbeb"}" stroke="#e2e8f0"/>
        <text x="300" y="${y + 44}" font-family="${FONT}" font-size="16" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="570" y="${y + 44}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[1]!)}</text>
        <text x="840" y="${y + 44}" font-family="${FONT}" font-size="16" font-weight="700" fill="${fail ? "#9f1239" : pass ? "#166534" : "#92400e"}">${esc(r[2]!)}</text>
        <text x="1110" y="${y + 44}" font-family="${FONT}" font-size="16" fill="#64748b">${esc(r[3]!)}</text>`;
      })
      .join("")}
    <rect x="260" y="710" width="1120" height="50" rx="12" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="296" y="742" font-family="${FONT}" font-size="15" font-weight="700" fill="#1e40af">Rule: buy only after a non-admin can finish create → log → move without a screenshot of the old tool.</text>`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 820, name, "Home", main)}
    ${teachBanner(48, 900, 1440, "Proof beats demos", `Vendor tours do not count — ${name} is worth it only when your sellers can run the loop.`, "#0d9488")}`,
  );
}

function adoptionDashboard(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Adoption review (day 30)</text>
    ${[
      ["Next-step coverage", "86%", "Green", "#16a34a"],
      ["Stage moves / seller / wk", "3.2", "Green", "#16a34a"],
      ["Activities logged / wk", "11", "Amber", "#f59e0b"],
      ["Shadow spreadsheets", "2 still live", "Amber", "#f59e0b"],
      ["Admin hours used", "1.5 / 2", "Green", "#16a34a"],
    ]
      .map((m, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 260 + col * 380;
        const y = 130 + row * 220;
        return `
        <rect x="${x}" y="${y}" width="350" height="190" rx="16" fill="#ffffff" stroke="#e2e8f0" filter="url(#card)"/>
        <text x="${x + 24}" y="${y + 44}" font-family="${FONT}" font-size="14" font-weight="700" fill="#64748b">${esc(String(m[0]).toUpperCase())}</text>
        <text x="${x + 24}" y="${y + 110}" font-family="${FONT}" font-size="42" font-weight="800" fill="#0f172a">${esc(String(m[1]))}</text>
        <rect x="${x + 24}" y="${y + 136}" width="110" height="32" rx="10" fill="${m[3]}" fill-opacity="0.15"/>
        <text x="${x + 79}" y="${y + 158}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="800" fill="${m[3]}">${esc(String(m[2]))}</text>`;
      })
      .join("")}
    <rect x="260" y="580" width="1120" height="100" rx="14" fill="#fffbeb" stroke="#fbbf24"/>
    <text x="296" y="640" font-family="${FONT}" font-size="18" font-weight="700" fill="#92400e">Amber overall — retrain on activity logging, kill the 2 shadow sheets, re-measure in 2 weeks. Do not expand features yet.</text>`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 780, name, "Reports", main)}
    ${teachBanner(48, 860, 1440, "Measure habits", `Modules enabled is vanity — these ${name} metrics decide expand vs fix.`, "#f59e0b")}`,
  );
}

function raciBoard(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Week 0 · ${esc(name)} rollout RACI</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="64" fill="#0f172a"/>
    ${["ROLE", "NAME", "OWNS", "HOURS / WK"]
      .map((h, i) => `<text x="${320 + i * 270}" y="162" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["Responsible", "Ops lead", "Fields · users · hygiene", "2.0"],
      ["Accountable", "Sales lead", "Stages · Friday review", "1.0"],
      ["Consulted", "2 sellers", "Usability friction", "0.5"],
      ["Informed", "Finance", "Handoff reports", "—"],
    ]
      .map((r, i) => {
        const y = 220 + i * 100;
        return `
        <rect x="280" y="${y}" width="1080" height="80" rx="12" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="320" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="800" fill="#2563eb">${esc(r[0]!)}</text>
        <text x="590" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[1]!)}</text>
        <text x="860" y="${y + 48}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[2]!)}</text>
        <text x="1200" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[3]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 780, name, "Home", main)}
    ${teachBanner(48, 860, 1440, "Before configuration", `Name Responsible + Accountable for ${name} before anyone adds fields.`, "#2563eb")}`,
  );
}

function dualRunScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Dual-run week · ${esc(name)} is system of record</text>
    <rect x="260" y="130" width="520" height="520" rx="16" fill="#ecfdf5" stroke="#6ee7b7"/>
    <text x="296" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#047857">LIVE · ${esc(name)}</text>
    <text x="296" y="250" font-family="${FONT}" font-size="16" fill="#065f46">✓ All new activity here</text>
    <text x="296" y="300" font-family="${FONT}" font-size="16" fill="#065f46">✓ Open deals owned</text>
    <text x="296" y="350" font-family="${FONT}" font-size="16" fill="#065f46">✓ Friday review here</text>
    <text x="296" y="420" font-family="${FONT}" font-size="16" fill="#047857">Write-access: sellers + admin</text>
    <rect x="860" y="130" width="520" height="520" rx="16" fill="#f1f5f9" stroke="#cbd5e1"/>
    <text x="896" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#64748b">OLD CRM · READ ONLY</text>
    <text x="896" y="250" font-family="${FONT}" font-size="16" fill="#64748b">• History lookups only</text>
    <text x="896" y="300" font-family="${FONT}" font-size="16" fill="#64748b">• No new deals</text>
    <text x="896" y="350" font-family="${FONT}" font-size="16" fill="#64748b">• No edits</text>
    <text x="896" y="420" font-family="${FONT}" font-size="16" fill="#94a3b8">Cutover after seller sign-off</text>
    <rect x="260" y="680" width="1120" height="60" rx="12" fill="#fff1f2" stroke="#fb7185"/>
    <text x="296" y="718" font-family="${FONT}" font-size="16" font-weight="700" fill="#9f1239">Rule: if anyone logs a new deal in the old system, dual-run failed — restart the week.</text>`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 820, name, "Pipeline", main)}
    ${teachBanner(48, 900, 1440, "One week is enough", `A month of dual-running means you never actually switched to ${name}.`, "#e11d48")}`,
  );
}

/** Invite roster — unique setup step (not another pipeline board). */
function inviteUsersScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · invite daily users only</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="56" fill="#0f172a"/>
    ${["NAME", "ROLE", "SEAT", "STATUS"]
      .map((h, i) => `<text x="${300 + i * 270}" y="158" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["Sam Rivera", "Seller", "Full", "Invited"],
      ["Priya Shah", "Seller", "Full", "Accepted"],
      ["Lee Chen", "Sales lead", "Full", "Accepted"],
      ["Ops — Jordan", "Admin", "Full", "Accepted"],
      ["Finance — Avery", "Report only", "No seat", "Deferred"],
    ]
      .map((r, i) => {
        const y = 200 + i * 90;
        const deferred = r[3] === "Deferred";
        return `
        <rect x="280" y="${y}" width="1080" height="72" rx="12" fill="${deferred ? "#f8fafc" : "#eff6ff"}" stroke="#e2e8f0"/>
        <text x="300" y="${y + 44}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="570" y="${y + 44}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[1]!)}</text>
        <text x="840" y="${y + 44}" font-family="${FONT}" font-size="16" font-weight="700" fill="#1d4ed8">${esc(r[2]!)}</text>
        <text x="1110" y="${y + 44}" font-family="${FONT}" font-size="16" font-weight="700" fill="${deferred ? "#94a3b8" : "#166534"}">${esc(r[3]!)}</text>`;
      })
      .join("")}
    <rect x="260" y="710" width="1120" height="50" rx="12" fill="#ecfdf5" stroke="#6ee7b7"/>
    <text x="296" y="742" font-family="${FONT}" font-size="15" font-weight="700" fill="#065f46">Invite the people who log deals this week — expand seats after the loop works.</text>`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 820, name, "Settings", main)}
    ${teachBanner(48, 900, 1440, "Daily users first", `A full ${name} org chart on day one creates noise before anyone proves the sales loop.`, "#2563eb")}`,
  );
}

/** Ownership remap — unique migration step. */
function ownershipRemapScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Migration · remap owners into ${esc(name)}</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="56" fill="#0f172a"/>
    <text x="300" y="158" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">OLD OWNER</text>
    <text x="620" y="158" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">NEW ${esc(name.toUpperCase())} USER</text>
    <text x="1040" y="158" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">OPEN DEALS</text>
    ${[
      ["alex@oldco.com (left)", "Sam Rivera", "14"],
      ["sam@oldco.com", "Sam Rivera", "22"],
      ["unassigned", "Lee Chen (queue)", "9"],
      ["contractor-temp", "Archive · no seat", "3"],
    ]
      .map((r, i) => {
        const y = 210 + i * 110;
        const archive = String(r[1]).includes("Archive");
        return `
        <rect x="280" y="${y}" width="1080" height="90" rx="14" fill="${archive ? "#fff1f2" : "#f8fafc"}" stroke="#e2e8f0"/>
        <text x="300" y="${y + 52}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" fill="#334155">${esc(r[0]!)}</text>
        <text x="620" y="${y + 52}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[1]!)}</text>
        <text x="1100" y="${y + 52}" font-family="${FONT}" font-size="22" font-weight="800" fill="#1d4ed8">${esc(r[2]!)}</text>`;
      })
      .join("")}
    <rect x="260" y="710" width="1120" height="50" rx="12" fill="#fffbeb" stroke="#fbbf24"/>
    <text x="296" y="742" font-family="${FONT}" font-size="15" font-weight="700" fill="#92400e">Never import until every open deal has a living owner in ${esc(name)}.</text>`;

  return shell(
    W,
    H,
    `
    ${appShell(48, 36, 1440, 820, name, "Settings", main)}
    ${teachBanner(48, 900, 1440, "Owners before volume", `Orphan deals in ${name} become silent revenue risk on week one.`, "#f59e0b")}`,
  );
}

/** Defer add-ons — unique plans step. */
function addOnsDeferScreen(name: string): Buffer {
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">${esc(name)} · day-one vs later add-ons</text>
    <rect x="80" y="120" width="680" height="720" rx="16" fill="#ecfdf5" stroke="#6ee7b7"/>
    <text x="120" y="180" font-family="${FONT}" font-size="20" font-weight="800" fill="#047857">BUY WITH THE PLAN</text>
    ${["Core seats", "Email sync", "Pipeline + required fields", "Basic reporting"]
      .map((t, i) => {
        const y = 230 + i * 120;
        return `
        <rect x="120" y="${y}" width="600" height="90" rx="14" fill="#ffffff" stroke="#6ee7b7"/>
        <text x="160" y="${y + 54}" font-family="${FONT}" font-size="18" font-weight="700" fill="#065f46">✓ ${esc(t)}</text>`;
      })
      .join("")}
    <rect x="800" y="120" width="680" height="720" rx="16" fill="#fffbeb" stroke="#fbbf24"/>
    <text x="840" y="180" font-family="${FONT}" font-size="20" font-weight="800" fill="#92400e">DEFER TO DAY 30+</text>
    ${["AI meeting notes pack", "Marketplace dialer", "Advanced forecasting SKU", "Extra sandboxes"]
      .map((t, i) => {
        const y = 230 + i * 120;
        return `
        <rect x="840" y="${y}" width="600" height="90" rx="14" fill="#ffffff" stroke="#fbbf24"/>
        <text x="880" y="${y + 54}" font-family="${FONT}" font-size="18" font-weight="700" fill="#92400e">⏳ ${esc(t)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `scope · ${name} add-ons`, main)}
    ${teachBanner(40, 930, 1456, "Scope the first invoice", `If an add-on is not required for Friday reviews in ${name}, it is not day-one spend.`, "#f59e0b")}`,
  );
}

/** Annualize before compare — unique plans step. */
function annualizeCompareScreen(name: string): Buffer {
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">Compare apples · annualize ${esc(name)} before shortlist</text>
    <rect x="80" y="130" width="1376" height="700" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="80" y="130" width="1376" height="70" fill="#0f172a"/>
    ${["LINE", "MONTHLY", "×12", "ANNUAL"]
      .map((h, i) => `<text x="${160 + i * 320}" y="176" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["List seats (11 × tier)", "$990", "×12", "$11,880"],
      ["Mandatory success pack", "$200", "×12", "$2,400"],
      ["Deferred AI add-on", "$0", "—", "$0 (day 30+)"],
      ["Working annual total", "", "", "$14,280"],
    ]
      .map((r, i) => {
        const y = 240 + i * 120;
        const total = i === 3;
        return `
        <rect x="110" y="${y}" width="1316" height="100" rx="14" fill="${total ? "#eff6ff" : "#f8fafc"}" stroke="${total ? "#93c5fd" : "#e2e8f0"}"/>
        <text x="160" y="${y + 58}" font-family="${FONT}" font-size="${total ? 20 : 18}" font-weight="800" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="480" y="${y + 58}" font-family="${FONT}" font-size="18" fill="#475569">${esc(r[1]!)}</text>
        <text x="800" y="${y + 58}" font-family="${FONT}" font-size="18" fill="#64748b">${esc(r[2]!)}</text>
        <text x="1120" y="${y + 58}" font-family="${FONT}" font-size="${total ? 22 : 18}" font-weight="800" fill="#1d4ed8">${esc(r[3]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `finance · ${name} annualize`, main)}
    ${teachBanner(40, 930, 1456, "Never compare monthly tiles", `Shortlist ${name} on annual cash out the door — then confirm on the live quote or pricing page.`, "#2563eb")}`,
  );
}

type KindArt = {
  hero: (name: string) => Buffer;
  figure: (name: string) => Buffer;
  panels: (name: string) => Buffer[];
};

/**
 * Every hero / figure / panel must teach a different screen.
 * Repeating the same mockup as cover + step art is not useful.
 */
const ART: Record<CrmProductGuideKind, KindArt> = {
  implementation: {
    hero: (name) => raciBoard(name),
    figure: (name) => pipelineBoard(name),
    panels: (name) => [
      dealRecord(name),
      emailSyncScreen(name),
      inviteUsersScreen(name),
      adoptionDashboard(name),
    ],
  },
  setup: {
    hero: (name) => settingsSetup(name),
    figure: (name) => pipelineBoard(name),
    panels: (name) => [
      dealRecord(name),
      inviteUsersScreen(name),
      emailSyncScreen(name),
      trialProofScreen(name),
    ],
  },
  migration: {
    hero: (name) => fieldMapScreen(name),
    figure: (name) => pilotImportScreen(name),
    panels: (name) => [
      ownershipRemapScreen(name),
      dualRunScreen(name),
      dealRecord(name),
      adoptionDashboard(name),
    ],
  },
  plans: {
    hero: (name) => plansTable(name),
    figure: (name) => planGateSheet(name),
    panels: (name) => [
      seatsBillingScreen(name),
      quoteDiligenceScreen(name),
      addOnsDeferScreen(name),
      annualizeCompareScreen(name),
    ],
  },
  "worth-it": {
    hero: (name) => worthItScorecard(name),
    figure: (name) => trialProofScreen(name),
    panels: (name) => [
      dealRecord(name),
      planGateSheet(name),
      seatsBillingScreen(name),
      pipelineBoard(name, false),
    ],
  },
};

/* ------------------------------------------------------------------ SI art */

function siAppShell(
  x: number,
  y: number,
  w: number,
  h: number,
  name: string,
  active: string,
  main: string,
): string {
  const nav = ["Home", "Search", "Lists", "Sequences", "Dialer", "Settings"];
  const items = nav
    .map((label, i) => {
      const iy = y + 120 + i * 52;
      const on = label === active;
      return `
      <rect x="${x + 16}" y="${iy}" width="188" height="42" rx="10" fill="${on ? "#0f766e" : "transparent"}"/>
      <text x="${x + 40}" y="${iy + 27}" font-family="${FONT}" font-size="16" font-weight="${on ? 700 : 500}" fill="${on ? "#ffffff" : "#cbd5e1"}">${label}</text>`;
    })
    .join("");
  return `
  ${browserWindow(
    x,
    y,
    w,
    h,
    `app.${name.toLowerCase().replace(/\s+/g, "")}.example / ${active.toLowerCase()}`,
    `
    <rect x="${x + 1}" y="${y + 49}" width="220" height="${h - 50}" fill="#0f172a"/>
    <text x="${x + 28}" y="${y + 92}" font-family="${FONT}" font-size="22" font-weight="800" fill="#ffffff">${esc(name)}</text>
    ${items}
    <rect x="${x + 221}" y="${y + 49}" width="${w - 222}" height="${h - 50}" fill="#f8fafc"/>
    ${main}
    `,
  )}`;
}

function siRaciBoard(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Week 0 · ${esc(name)} outbound RACI</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="64" fill="#0f172a"/>
    ${["ROLE", "NAME", "OWNS", "HOURS / WK"]
      .map((h, i) => `<text x="${320 + i * 270}" y="162" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["Responsible", "Ops lead", "Credits · lists · sync", "2.0"],
      ["Accountable", "Sales lead", "ICP · Friday review", "1.0"],
      ["Consulted", "2 AEs", "List quality friction", "0.5"],
      ["Informed", "CRM admin", "Activity logging", "—"],
    ]
      .map((r, i) => {
        const y = 220 + i * 100;
        return `
        <rect x="280" y="${y}" width="1080" height="80" rx="12" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="320" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="800" fill="#0f766e">${esc(r[0]!)}</text>
        <text x="590" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[1]!)}</text>
        <text x="860" y="${y + 48}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[2]!)}</text>
        <text x="1200" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[3]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${siAppShell(48, 36, 1440, 780, name, "Home", main)}
    ${teachBanner(48, 860, 1440, "Before configuration", `Name Responsible + Accountable for ${name} before anyone burns credits.`, "#0f766e")}`,
  );
}

function siListBoard(name: string, annotate = true): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · ICP list · Mid-market VP Sales</text>
    <rect x="260" y="120" width="1120" height="80" rx="14" fill="#ecfdf5" stroke="#6ee7b7"/>
    <text x="290" y="170" font-family="${FONT}" font-size="16" font-weight="700" fill="#065f46">Filters: SaaS · 50–500 emp · US/UK · Title contains VP Sales · Suppress customers</text>
    <rect x="260" y="220" width="1120" height="460" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${["CONTACT", "TITLE", "COMPANY", "EMAIL", "PHONE"]
      .map((h, i) => `<text x="${290 + i * 210}" y="265" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["Priya Shah", "VP Sales", "Brightline", "verified", "direct"],
      ["Sam Rivera", "VP Sales", "Helix Labs", "verified", "mobile"],
      ["Lee Chen", "Head of Sales", "Orbit Co", "catch-all", "—"],
      ["Jordan Kim", "VP Revenue", "Cascade", "verified", "direct"],
      ["Avery Cole", "VP Sales", "Maple Soft", "verified", "direct"],
    ]
      .map((r, i) => {
        const y = 300 + i * 70;
        return `
        <rect x="280" y="${y}" width="1080" height="58" rx="10" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="290" y="${y + 36}" font-family="${FONT}" font-size="15" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="500" y="${y + 36}" font-family="${FONT}" font-size="15" fill="#475569">${esc(r[1]!)}</text>
        <text x="710" y="${y + 36}" font-family="${FONT}" font-size="15" fill="#475569">${esc(r[2]!)}</text>
        <text x="920" y="${y + 36}" font-family="${FONT}" font-size="14" font-weight="700" fill="#0f766e">${esc(r[3]!)}</text>
        <text x="1130" y="${y + 36}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(r[4]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${siAppShell(48, 36, 1440, 780, name, "Lists", main)}
    ${
      annotate
        ? teachBanner(
            48,
            860,
            1440,
            "What good looks like",
            `One trusted ${name} ICP list beats five unowned experiments.`,
            "#0f766e",
          )
        : ""
    }`,
  );
}

function siSetupChecklist(name: string): Buffer {
  const steps = [
    { n: 1, t: "Seats & credits", d: "Weekly users only", on: false },
    { n: 2, t: "Stack owner", d: "Credits · lists · sync", on: true },
    { n: 3, t: "ICP list", d: "One motion · suppressions", on: false },
    { n: 4, t: "CRM sync", d: "Log activities", on: false },
    { n: 5, t: "Loop proof", d: "Non-admin walkthrough", on: false },
  ];
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} setup checklist</text>
    <rect x="260" y="120" width="520" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${steps
      .map((s) => {
        const y = 150 + (s.n - 1) * 100;
        return `
        <rect x="284" y="${y}" width="472" height="84" rx="14" fill="${s.on ? "#ecfdf5" : "#f8fafc"}" stroke="${s.on ? "#6ee7b7" : "#e2e8f0"}"/>
        <circle cx="330" cy="${y + 42}" r="22" fill="${s.on ? "#0f766e" : "#cbd5e1"}"/>
        <text x="330" y="${y + 48}" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="800" fill="#fff">${s.n}</text>
        <text x="372" y="${y + 36}" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">${esc(s.t)}</text>
        <text x="372" y="${y + 60}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(s.d)}</text>`;
      })
      .join("")}
    <rect x="820" y="120" width="560" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="852" y="172" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">Credits this week</text>
    ${[
      ["Exports used", "420 / 2,000"],
      ["Enrichments", "86"],
      ["Sequence sends", "310"],
      ["Remaining buffer", "Healthy"],
    ]
      .map((row, i) => {
        const y = 220 + i * 90;
        return `
        <rect x="852" y="${y}" width="496" height="70" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="880" y="${y + 42}" font-family="${FONT}" font-size="16" font-weight="600" fill="#0f172a">${esc(row[0]!)}</text>
        <text x="1280" y="${y + 42}" text-anchor="end" font-family="${FONT}" font-size="16" font-weight="800" fill="#0f766e">${esc(row[1]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${siAppShell(48, 36, 1440, 780, name, "Settings", main)}
    ${teachBanner(48, 860, 1440, "Day-zero order", `Finish seats, list, CRM sync, and one channel in ${name} before extra packs.`, "#0f766e")}`,
  );
}

function siSequenceScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Sequence · Mid-market opener</text>
    <rect x="260" y="120" width="720" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${[
      ["Day 0", "Email · value hook", "Active"],
      ["Day 2", "LinkedIn view + note", "Active"],
      ["Day 4", "Email · case study", "Active"],
      ["Day 7", "Call · direct dial", "Queued"],
      ["Day 10", "Breakup email", "Queued"],
    ]
      .map((r, i) => {
        const y = 160 + i * 95;
        const active = r[2] === "Active";
        return `
        <rect x="290" y="${y}" width="660" height="78" rx="12" fill="${active ? "#ecfdf5" : "#f8fafc"}" stroke="#e2e8f0"/>
        <circle cx="330" cy="${y + 39}" r="18" fill="${active ? "#0f766e" : "#94a3b8"}"/>
        <text x="330" y="${y + 45}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="800" fill="#fff">${i + 1}</text>
        <text x="370" y="${y + 32}" font-family="${FONT}" font-size="16" font-weight="800" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="370" y="${y + 56}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(r[1]!)}</text>
        <text x="900" y="${y + 45}" text-anchor="end" font-family="${FONT}" font-size="14" font-weight="700" fill="${active ? "#0f766e" : "#94a3b8"}">${esc(r[2]!)}</text>`;
      })
      .join("")}
    <rect x="1020" y="120" width="360" height="560" rx="16" fill="#0f172a"/>
    <text x="1052" y="180" font-family="${FONT}" font-size="16" font-weight="800" fill="#5eead4">THIS WEEK</text>
    <text x="1052" y="250" font-family="${FONT}" font-size="42" font-weight="800" fill="#ffffff">18%</text>
    <text x="1052" y="290" font-family="${FONT}" font-size="16" fill="#cbd5e1">Reply rate</text>
    <text x="1052" y="370" font-family="${FONT}" font-size="42" font-weight="800" fill="#ffffff">11</text>
    <text x="1052" y="410" font-family="${FONT}" font-size="16" fill="#cbd5e1">Meetings booked</text>
    <text x="1052" y="500" font-family="${FONT}" font-size="16" fill="#94a3b8">CRM-logged activities: 94%</text>`;

  return shell(
    W,
    H,
    `
    ${siAppShell(48, 36, 1440, 780, name, "Sequences", main)}
    ${teachBanner(48, 860, 1440, "One channel first", `Prove a sequence or dialer loop in ${name} before adding parallel channels.`, "#0f766e")}`,
  );
}

function siCrmSyncScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Integrations · CRM sync</text>
    ${[
      ["HubSpot CRM", "Contacts + activities · Connected", true],
      ["Mailbox / sending", "Connected · 6 seats", true],
      ["Dialer bridge", "Optional · Deferred", false],
      ["Enrichment packs", "Day 30+ only", false],
    ]
      .map((row, i) => {
        const y = 130 + i * 120;
        const on = row[2] === true;
        return `
        <rect x="260" y="${y}" width="1120" height="100" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
        <circle cx="320" cy="${y + 50}" r="28" fill="${on ? "#dcfce7" : "#f1f5f9"}"/>
        <text x="390" y="${y + 42}" font-family="${FONT}" font-size="20" font-weight="800" fill="#0f172a">${esc(String(row[0]))}</text>
        <text x="390" y="${y + 70}" font-family="${FONT}" font-size="15" fill="#64748b">${esc(String(row[1]))}</text>
        <rect x="1180" y="${y + 30}" width="140" height="40" rx="20" fill="${on ? "#0f766e" : "#e2e8f0"}"/>
        <text x="1250" y="${y + 56}" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="${on ? "#fff" : "#64748b"}">${on ? "ON" : "OFF"}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${siAppShell(48, 36, 1440, 780, name, "Settings", main)}
    ${teachBanner(48, 860, 1440, "CRM is system of record", `Sync activities from ${name} — do not turn SI into a second CRM.`, "#ea580c")}`,
  );
}

function siFieldMapScreen(name: string): Buffer {
  const rows = [
    ["email", "Contact → Work email", "Direct"],
    ["mobile", "Contact → Phone", "Direct"],
    ["title", "Contact → Title", "Normalize"],
    ["owner_id", "Owner → User", "Remap users"],
    ["do_not_contact", "Suppression list", "Required"],
    ["old_score", "—", "Archive only"],
  ];
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Migration · Field map into ${esc(name)}</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="56" rx="16" fill="#0f172a"/>
    <rect x="260" y="156" width="1120" height="20" fill="#0f172a"/>
    <text x="290" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">SOURCE FIELD</text>
    <text x="620" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">${esc(name.toUpperCase())} DESTINATION</text>
    <text x="1100" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">RULE</text>
    ${rows
      .map((r, i) => {
        const y = 196 + i * 76;
        const archive = r[2] === "Archive only";
        return `
        <rect x="280" y="${y}" width="1080" height="64" rx="10" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="300" y="${y + 38}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" fill="#334155">${esc(r[0]!)}</text>
        <text x="620" y="${y + 38}" font-family="${FONT}" font-size="16" font-weight="600" fill="#0f172a">${esc(r[1]!)}</text>
        <rect x="1080" y="${y + 16}" width="250" height="32" rx="8" fill="${archive ? "#fff1f2" : "#ecfdf5"}"/>
        <text x="1205" y="${y + 38}" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="${archive ? "#be123c" : "#047857"}">${esc(r[2]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${siAppShell(48, 36, 1440, 780, name, "Settings", main)}
    ${teachBanner(48, 860, 1440, "Map meanings first", `Don’t bulk-import into ${name} until owners and suppressions are signed off.`, "#0f766e")}`,
  );
}

function siPilotImportScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Import wizard · Pilot (Sam’s book)</text>
    <rect x="260" y="120" width="1120" height="120" rx="16" fill="#ecfdf5" stroke="#6ee7b7"/>
    <text x="296" y="175" font-family="${FONT}" font-size="18" font-weight="700" fill="#065f46">Step 2 of 4 · Preview 62 contacts before commit</text>
    <text x="296" y="210" font-family="${FONT}" font-size="15" fill="#0f766e">People 62 · Accounts 28 · Suppressions 11 · Sequence steps 40</text>
    <rect x="260" y="270" width="1120" height="400" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${["✓ Emails match source", "✓ Owners remap to active users", "⚠ 3 titles need normalize rules", "✓ Suppressions preserved"]
      .map((t, i) => {
        const y = 320 + i * 80;
        const warn = t.startsWith("⚠");
        return `
        <rect x="296" y="${y}" width="1048" height="60" rx="12" fill="${warn ? "#fffbeb" : "#ecfdf5"}"/>
        <text x="328" y="${y + 38}" font-family="${FONT}" font-size="18" font-weight="600" fill="${warn ? "#b45309" : "#065f46"}">${esc(t)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${siAppShell(48, 36, 1440, 820, name, "Settings", main)}
    ${teachBanner(48, 900, 1440, "Pilot before bulk", `Fix mapping on one seller’s ${name} book — then scale.`, "#0f766e")}`,
  );
}

function siDualRunScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Dual-run week · ${esc(name)} is write path</text>
    <rect x="260" y="130" width="520" height="520" rx="16" fill="#ecfdf5" stroke="#6ee7b7"/>
    <text x="296" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#047857">LIVE · ${esc(name)}</text>
    <text x="296" y="250" font-family="${FONT}" font-size="16" fill="#065f46">✓ All new lists here</text>
    <text x="296" y="300" font-family="${FONT}" font-size="16" fill="#065f46">✓ New sequences here</text>
    <text x="296" y="350" font-family="${FONT}" font-size="16" fill="#065f46">✓ Friday review here</text>
    <text x="296" y="420" font-family="${FONT}" font-size="16" fill="#047857">Write-access: pod + owner</text>
    <rect x="860" y="130" width="520" height="520" rx="16" fill="#f1f5f9" stroke="#cbd5e1"/>
    <text x="896" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#64748b">OLD TOOL · READ ONLY</text>
    <text x="896" y="250" font-family="${FONT}" font-size="16" fill="#64748b">• History lookups only</text>
    <text x="896" y="300" font-family="${FONT}" font-size="16" fill="#64748b">• No new sequences</text>
    <text x="896" y="350" font-family="${FONT}" font-size="16" fill="#64748b">• No enrichment burns</text>
    <text x="896" y="420" font-family="${FONT}" font-size="16" fill="#94a3b8">Cutover after pod sign-off</text>`;

  return shell(
    W,
    H,
    `
    ${siAppShell(48, 36, 1440, 820, name, "Lists", main)}
    ${teachBanner(48, 900, 1440, "One week is enough", `A month of dual lists means you never actually switched to ${name}.`, "#e11d48")}`,
  );
}

function siPlansTable(name: string): Buffer {
  const plans = ["Free", "Basic", "Pro", "Enterprise"];
  const features = [
    ["Seats included", "1", "3", "10", "Custom"],
    ["Monthly credits", "Limited", "Standard", "High", "Custom"],
    ["Prospecting search", "✓", "✓", "✓", "✓"],
    ["Sequences", "—", "✓", "✓", "✓"],
    ["Dialer", "—", "—", "✓", "✓"],
    ["CRM sync", "Limited", "✓", "✓", "✓"],
    ["AI assistance", "—", "—", "✓", "✓"],
  ];
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="26" font-weight="800" fill="#0f172a">${esc(name)} plans · seats vs credits</text>
    <text x="80" y="108" font-family="${FONT}" font-size="16" fill="#64748b">Illustrative packaging — confirm live on the pricing page (no invented dollars)</text>
    <rect x="80" y="140" width="1376" height="700" rx="18" fill="#ffffff" filter="url(#win)"/>
    <rect x="80" y="140" width="320" height="700" fill="#0f172a"/>
    <text x="110" y="200" font-family="${FONT}" font-size="15" font-weight="800" fill="#94a3b8">CAPABILITY</text>
    ${plans
      .map((p, i) => {
        const x = 420 + i * 250;
        const hot = p === "Pro";
        return `
        <rect x="${x - 20}" y="140" width="250" height="90" fill="${hot ? "#0f766e" : "#f8fafc"}"/>
        <text x="${x + 105}" y="195" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="800" fill="${hot ? "#fff" : "#0f172a"}">${p}</text>
        ${hot ? `<text x="${x + 105}" y="220" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="700" fill="#99f6e4">QUALIFYING EXAMPLE</text>` : ""}`;
      })
      .join("")}
    ${features
      .map((row, i) => {
        const y = 260 + i * 78;
        return `
        <text x="110" y="${y + 28}" font-family="${FONT}" font-size="16" font-weight="600" fill="#e2e8f0">${esc(row[0]!)}</text>
        ${row
          .slice(1)
          .map((cell, j) => {
            const x = 525 + j * 250;
            const good = cell === "✓";
            const bad = cell === "—";
            return `<text x="${x}" y="${y + 28}" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="800" fill="${good ? "#4ade80" : bad ? "#64748b" : "#fbbf24"}">${esc(cell)}</text>`;
          })
          .join("")}
        <line x1="100" y1="${y + 52}" x2="1420" y2="${y + 52}" stroke="#1e293b" stroke-opacity="0.35"/>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `${name.toLowerCase().replace(/\s+/g, "")}.com/pricing`, main)}
    ${teachBanner(40, 930, 1456, "How to use this", `Circle must-haves, then pick the cheapest ${name} column that covers seats + credits.`, "#0f766e")}`,
  );
}

function siCreditsWorksheet(name: string): Buffer {
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">${esc(name)} · seats and credits worksheet</text>
    <text x="80" y="108" font-family="${FONT}" font-size="16" fill="#64748b">Count weekly users and expected credit burn — confirm list price on the pricing page</text>
    <rect x="80" y="140" width="700" height="680" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="112" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">Who needs access?</text>
    ${[
      ["AEs (daily outreach)", "6", "Required"],
      ["Managers (weekly)", "2", "Required"],
      ["Ops / stack owner", "1", "Required"],
      ["View-only execs", "3", "Defer / report"],
      ["Contractors", "2", "Shared process"],
    ]
      .map((r, i) => {
        const y = 220 + i * 100;
        const req = r[2] === "Required";
        return `
        <rect x="112" y="${y}" width="636" height="80" rx="12" fill="${req ? "#ecfdf5" : "#f8fafc"}" stroke="${req ? "#6ee7b7" : "#e2e8f0"}"/>
        <text x="140" y="${y + 34}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="140" y="${y + 60}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(r[2]!)}</text>
        <text x="680" y="${y + 50}" text-anchor="end" font-family="${FONT}" font-size="28" font-weight="800" fill="#0f766e">${esc(r[1]!)}</text>`;
      })
      .join("")}
    <rect x="820" y="140" width="640" height="680" rx="16" fill="#0f172a"/>
    <text x="860" y="210" font-family="${FONT}" font-size="16" font-weight="800" fill="#5eead4">WORKING TOTAL</text>
    <text x="860" y="290" font-family="${FONT}" font-size="48" font-weight="800" fill="#ffffff">9 seats</text>
    <text x="860" y="350" font-family="${FONT}" font-size="18" fill="#cbd5e1">+ credit pack sized to ICP builds</text>
    <rect x="860" y="420" width="560" height="160" rx="14" fill="#1e293b"/>
    <text x="892" y="480" font-family="${FONT}" font-size="17" fill="#e2e8f0">Do not invent dollars here.</text>
    <text x="892" y="520" font-family="${FONT}" font-size="17" fill="#e2e8f0">Confirm list price + credit rules</text>
    <text x="892" y="560" font-family="${FONT}" font-size="17" fill="#e2e8f0">on the live pricing page.</text>
    <rect x="860" y="620" width="560" height="120" rx="14" fill="#0f766e"/>
    <text x="892" y="680" font-family="${FONT}" font-size="18" font-weight="700" fill="#fff">Next: ${esc(name)} pricing</text>
    <text x="892" y="712" font-family="${FONT}" font-size="15" fill="#ccfbf1">Seats · credits · quote terms</text>`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `estimate · ${name} usage`, main)}
    ${teachBanner(40, 930, 1456, "Usage discipline", `If someone never prospects in ${name} weekly, they are not a seat.`, "#0f766e")}`,
  );
}

function siWorthItScorecard(name: string): Buffer {
  const qs = [
    ["Fit motion", "Matches best-for patterns", "Yes"],
    ["Stack owner", "~2 hrs/week named", "Yes"],
    ["Outbound loop", "Non-admin proved", "Yes"],
    ["Package gates", "Musts on qualifying tier", "Needs check"],
    ["CRM sync", "Activities logged", "Yes"],
    ["Tradeoffs", "Can live with limits", "Yes"],
  ];
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="26" font-weight="800" fill="#0f172a">Is ${esc(name)} worth it? · trial scorecard</text>
    <rect x="80" y="110" width="900" height="720" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${qs
      .map((q, i) => {
        const y = 140 + i * 110;
        const ok = q[2] === "Yes";
        return `
        <rect x="110" y="${y}" width="840" height="90" rx="14" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="140" y="${y + 38}" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">${esc(q[0]!)}</text>
        <text x="140" y="${y + 66}" font-family="${FONT}" font-size="15" fill="#64748b">${esc(q[1]!)}</text>
        <rect x="760" y="${y + 24}" width="160" height="42" rx="12" fill="${ok ? "#dcfce7" : "#fef3c7"}"/>
        <text x="840" y="${y + 52}" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="800" fill="${ok ? "#166534" : "#92400e"}">${esc(q[2]!)}</text>`;
      })
      .join("")}
    <rect x="1020" y="110" width="440" height="720" rx="16" fill="#0f172a"/>
    <text x="1060" y="190" font-family="${FONT}" font-size="16" font-weight="800" fill="#5eead4">VERDICT PATH</text>
    <text x="1060" y="260" font-family="${FONT}" font-size="36" font-weight="800" fill="#ffffff">Trial longer</text>
    <text x="1060" y="320" font-family="${FONT}" font-size="18" fill="#cbd5e1">5 / 6 gates clear.</text>
    <text x="1060" y="360" font-family="${FONT}" font-size="18" fill="#cbd5e1">Close the package-gate gap</text>
    <text x="1060" y="400" font-family="${FONT}" font-size="18" fill="#cbd5e1">before you buy.</text>
    <rect x="1060" y="480" width="360" height="100" rx="14" fill="#1e293b"/>
    <text x="1088" y="540" font-family="${FONT}" font-size="16" fill="#e2e8f0">Buy only when fit + loop + package all say yes.</text>
    <rect x="1060" y="620" width="360" height="120" rx="14" fill="#0f766e"/>
    <text x="1088" y="680" font-family="${FONT}" font-size="18" font-weight="700" fill="#fff">Next: ${esc(name)} plans</text>
    <text x="1088" y="712" font-family="${FONT}" font-size="15" fill="#ccfbf1">Confirm seats/credits in writing</text>`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 900, `evaluate · ${name}`, main)}
    ${teachBanner(40, 950, 1456, "No invented ROI", `If fit, trial proof, or package coverage fails — keep looking instead of forcing ${name}.`, "#e11d48")}`,
  );
}

function siTrialProofScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · trial proof log (week 2)</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="56" fill="#0f172a"/>
    ${["PROOF", "OWNER", "RESULT", "DATE"]
      .map((h, i) => `<text x="${300 + i * 270}" y="158" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["Non-admin built ICP list", "Priya", "Pass", "Mar 12"],
      ["Enriched usable contact", "Priya", "Pass", "Mar 12"],
      ["Sequence step sent", "Sam", "Pass", "Mar 13"],
      ["Activity landed in CRM", "Ops", "Fail → fix sync", "Mar 14"],
      ["Friday review from SI", "Sales lead", "Scheduled", "Mar 15"],
    ]
      .map((r, i) => {
        const y = 200 + i * 90;
        const fail = String(r[2]).startsWith("Fail");
        const pass = r[2] === "Pass";
        return `
        <rect x="280" y="${y}" width="1080" height="72" rx="12" fill="${fail ? "#fff1f2" : pass ? "#ecfdf5" : "#fffbeb"}" stroke="#e2e8f0"/>
        <text x="300" y="${y + 44}" font-family="${FONT}" font-size="16" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="570" y="${y + 44}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[1]!)}</text>
        <text x="840" y="${y + 44}" font-family="${FONT}" font-size="16" font-weight="700" fill="${fail ? "#9f1239" : pass ? "#166534" : "#92400e"}">${esc(r[2]!)}</text>
        <text x="1110" y="${y + 44}" font-family="${FONT}" font-size="16" fill="#64748b">${esc(r[3]!)}</text>`;
      })
      .join("")}
    <rect x="260" y="710" width="1120" height="50" rx="12" fill="#ecfdf5" stroke="#6ee7b7"/>
    <text x="296" y="742" font-family="${FONT}" font-size="15" font-weight="700" fill="#065f46">Rule: buy only after a non-admin can finish find → enrich → outreach → CRM without help.</text>`;

  return shell(
    W,
    H,
    `
    ${siAppShell(48, 36, 1440, 820, name, "Home", main)}
    ${teachBanner(48, 900, 1440, "Proof beats demos", `Vendor tours do not count — ${name} is worth it only when your pod can run the loop.`, "#0f766e")}`,
  );
}

function siUsageDashboard(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Usage review (day 30)</text>
    ${[
      ["CRM-logged outreach", "94%", "Green", "#16a34a"],
      ["Credits / meeting", "38", "Amber", "#f59e0b"],
      ["Reply rate", "12%", "Green", "#16a34a"],
      ["Shadow CSVs", "1 still live", "Amber", "#f59e0b"],
      ["Owner hours used", "1.5 / 2", "Green", "#16a34a"],
    ]
      .map((m, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 260 + col * 380;
        const y = 130 + row * 220;
        return `
        <rect x="${x}" y="${y}" width="350" height="190" rx="16" fill="#ffffff" stroke="#e2e8f0" filter="url(#card)"/>
        <text x="${x + 24}" y="${y + 44}" font-family="${FONT}" font-size="14" font-weight="700" fill="#64748b">${esc(String(m[0]).toUpperCase())}</text>
        <text x="${x + 24}" y="${y + 110}" font-family="${FONT}" font-size="42" font-weight="800" fill="#0f172a">${esc(String(m[1]))}</text>
        <rect x="${x + 24}" y="${y + 136}" width="110" height="32" rx="10" fill="${m[3]}" fill-opacity="0.15"/>
        <text x="${x + 79}" y="${y + 158}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="800" fill="${m[3]}">${esc(String(m[2]))}</text>`;
      })
      .join("")}
    <rect x="260" y="580" width="1120" height="100" rx="14" fill="#fffbeb" stroke="#fbbf24"/>
    <text x="296" y="640" font-family="${FONT}" font-size="18" font-weight="700" fill="#92400e">Amber overall — tighten ICP filters, kill the shadow CSV, re-measure in 2 weeks. Do not buy more credits yet.</text>`;

  return shell(
    W,
    H,
    `
    ${siAppShell(48, 36, 1440, 780, name, "Home", main)}
    ${teachBanner(48, 860, 1440, "Measure habits", `Credits burned is vanity — these ${name} metrics decide expand vs fix.`, "#f59e0b")}`,
  );
}

function siQuoteDiligence(name: string): Buffer {
  const rows = [
    ["Seat definition (full vs light)", "Written", "Open"],
    ["Credit exhaustion behavior", "Named in writing", "Open"],
    ["Export / list ownership", "Confirmed", "Clear"],
    ["Implementation / success fees", "Line-itemed", "Missing"],
    ["Contract term + renewal uplift", "Capped", "Open"],
  ];
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">${esc(name)} · quote diligence board</text>
    <text x="80" y="108" font-family="${FONT}" font-size="16" fill="#64748b">When credits matter, refuse to compare on a homepage tile alone</text>
    <rect x="80" y="140" width="1376" height="700" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="80" y="140" width="1376" height="64" fill="#0f172a"/>
    <text x="120" y="182" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">CHECK</text>
    <text x="720" y="182" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">EVIDENCE NEEDED</text>
    <text x="1180" y="182" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">STATUS</text>
    ${rows
      .map((r, i) => {
        const y = 230 + i * 110;
        const clear = r[2] === "Clear";
        const missing = r[2] === "Missing";
        return `
        <rect x="110" y="${y}" width="1316" height="90" rx="14" fill="${missing ? "#fff1f2" : clear ? "#ecfdf5" : "#f8fafc"}" stroke="${missing ? "#fb7185" : clear ? "#6ee7b7" : "#e2e8f0"}"/>
        <text x="140" y="${y + 52}" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="720" y="${y + 52}" font-family="${FONT}" font-size="17" fill="#475569">${esc(r[1]!)}</text>
        <rect x="1160" y="${y + 24}" width="220" height="42" rx="12" fill="${missing ? "#fecdd3" : clear ? "#bbf7d0" : "#e2e8f0"}"/>
        <text x="1270" y="${y + 52}" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="800" fill="${missing ? "#9f1239" : clear ? "#166534" : "#475569"}">${esc(r[2]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `procurement · ${name}`, main)}
    ${teachBanner(40, 930, 1456, "No vague quotes", `Do not shortlist ${name} until credit rules are written.`, "#e11d48")}`,
  );
}

function siDeferPacks(name: string): Buffer {
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">${esc(name)} · day-one vs later packs</text>
    <rect x="80" y="120" width="680" height="720" rx="16" fill="#ecfdf5" stroke="#6ee7b7"/>
    <text x="120" y="180" font-family="${FONT}" font-size="20" font-weight="800" fill="#047857">BUY WITH THE PACKAGE</text>
    ${["Core seats", "Base credits", "CRM sync", "One outreach channel"]
      .map((t, i) => {
        const y = 230 + i * 120;
        return `
        <rect x="120" y="${y}" width="600" height="90" rx="14" fill="#ffffff" stroke="#6ee7b7"/>
        <text x="160" y="${y + 54}" font-family="${FONT}" font-size="18" font-weight="700" fill="#065f46">✓ ${esc(t)}</text>`;
      })
      .join("")}
    <rect x="800" y="120" width="680" height="720" rx="16" fill="#fffbeb" stroke="#fbbf24"/>
    <text x="840" y="180" font-family="${FONT}" font-size="20" font-weight="800" fill="#92400e">DEFER TO DAY 30+</text>
    ${["Extra enrichment packs", "Second channel", "AI drafting pack", "Unused enterprise seats"]
      .map((t, i) => {
        const y = 230 + i * 120;
        return `
        <rect x="840" y="${y}" width="600" height="90" rx="14" fill="#ffffff" stroke="#fbbf24"/>
        <text x="880" y="${y + 54}" font-family="${FONT}" font-size="18" font-weight="700" fill="#92400e">⏳ ${esc(t)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `scope · ${name} packs`, main)}
    ${teachBanner(40, 930, 1456, "Scope the first invoice", `If a pack is not required for Friday reviews in ${name}, it is not day-one spend.`, "#f59e0b")}`,
  );
}

const SI_ART: Record<CrmProductGuideKind, KindArt> = {
  implementation: {
    hero: (name) => siRaciBoard(name),
    figure: (name) => siListBoard(name),
    panels: (name) => [
      siSequenceScreen(name),
      siCrmSyncScreen(name),
      siSetupChecklist(name),
      siUsageDashboard(name),
    ],
  },
  setup: {
    hero: (name) => siSetupChecklist(name),
    figure: (name) => siListBoard(name),
    panels: (name) => [
      siCreditsWorksheet(name),
      siCrmSyncScreen(name),
      siSequenceScreen(name),
      siTrialProofScreen(name),
    ],
  },
  migration: {
    hero: (name) => siFieldMapScreen(name),
    figure: (name) => siPilotImportScreen(name),
    panels: (name) => [
      siDualRunScreen(name),
      siCrmSyncScreen(name),
      siListBoard(name, false),
      siUsageDashboard(name),
    ],
  },
  plans: {
    hero: (name) => siPlansTable(name),
    figure: (name) => siCreditsWorksheet(name),
    panels: (name) => [
      siQuoteDiligence(name),
      siDeferPacks(name),
      siSequenceScreen(name),
      siUsageDashboard(name),
    ],
  },
  "worth-it": {
    hero: (name) => siWorthItScorecard(name),
    figure: (name) => siTrialProofScreen(name),
    panels: (name) => [
      siListBoard(name, false),
      siCreditsWorksheet(name),
      siSequenceScreen(name),
      siCrmSyncScreen(name),
    ],
  },
};

/* ------------------------------------------------------------------ EM art (email marketing / ESP — not SI dialer/credits) */

function emAppShell(
  x: number,
  y: number,
  w: number,
  h: number,
  name: string,
  active: string,
  main: string,
): string {
  const nav = ["Home", "Campaigns", "Automations", "Lists", "Analytics", "Settings"];
  const items = nav
    .map((label, i) => {
      const iy = y + 120 + i * 52;
      const on = label === active;
      return `
      <rect x="${x + 16}" y="${iy}" width="188" height="42" rx="10" fill="${on ? "#2563eb" : "transparent"}"/>
      <text x="${x + 40}" y="${iy + 27}" font-family="${FONT}" font-size="16" font-weight="${on ? 700 : 500}" fill="${on ? "#ffffff" : "#cbd5e1"}">${label}</text>`;
    })
    .join("");
  return `
  ${browserWindow(
    x,
    y,
    w,
    h,
    `app.${name.toLowerCase().replace(/\s+/g, "")}.example / ${active.toLowerCase()}`,
    `
    <rect x="${x + 1}" y="${y + 49}" width="220" height="${h - 50}" fill="#0f172a"/>
    <text x="${x + 28}" y="${y + 92}" font-family="${FONT}" font-size="22" font-weight="800" fill="#ffffff">${esc(name)}</text>
    ${items}
    <rect x="${x + 221}" y="${y + 49}" width="${w - 222}" height="${h - 50}" fill="#f8fafc"/>
    ${main}
    `,
  )}`;
}

function emRaciBoard(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Week 0 · ${esc(name)} email RACI</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="64" fill="#0f172a"/>
    ${["ROLE", "NAME", "OWNS", "HOURS / WK"]
      .map((h, i) => `<text x="${320 + i * 270}" y="162" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["Responsible", "Ops lead", "Lists · auth · sync", "2.0"],
      ["Accountable", "Marketing lead", "Outcomes · Friday review", "1.0"],
      ["Consulted", "2 marketers", "Template / journey friction", "0.5"],
      ["Informed", "CRM admin", "Lifecycle tags", "—"],
    ]
      .map((r, i) => {
        const y = 220 + i * 100;
        return `
        <rect x="280" y="${y}" width="1080" height="80" rx="12" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="320" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="800" fill="#2563eb">${esc(r[0]!)}</text>
        <text x="590" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[1]!)}</text>
        <text x="860" y="${y + 48}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[2]!)}</text>
        <text x="1200" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[3]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${emAppShell(48, 36, 1440, 780, name, "Home", main)}
    ${teachBanner(48, 860, 1440, "Before configuration", `Name Responsible + Accountable for ${name} before anyone burns sends.`, "#2563eb")}`,
  );
}

function emSegmentBoard(name: string, annotate = true): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Segment · Trial → paid nurture</text>
    <rect x="260" y="120" width="1120" height="80" rx="14" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="290" y="170" font-family="${FONT}" font-size="16" font-weight="700" fill="#1e40af">Filters: Opted-in · Trial started · Opened last 30d · Suppress unsubscribes</text>
    <rect x="260" y="220" width="1120" height="460" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${["SUBSCRIBER", "STATUS", "TAG", "LAST OPEN", "OWNER"]
      .map((h, i) => `<text x="${290 + i * 210}" y="265" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["priya@brightline.io", "Active", "trial", "2d ago", "Maya"],
      ["sam@helix.io", "Active", "trial", "5d ago", "Maya"],
      ["lee@orbit.co", "Engaged", "nurture", "1d ago", "Chris"],
      ["jordan@cascade.io", "Active", "trial", "8d ago", "Maya"],
      ["avery@maple.io", "Suppressed", "bounce", "—", "Ops"],
    ]
      .map((r, i) => {
        const y = 300 + i * 70;
        return `
        <rect x="280" y="${y}" width="1080" height="58" rx="10" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="290" y="${y + 36}" font-family="${FONT}" font-size="15" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="500" y="${y + 36}" font-family="${FONT}" font-size="15" fill="#475569">${esc(r[1]!)}</text>
        <text x="710" y="${y + 36}" font-family="${FONT}" font-size="15" fill="#475569">${esc(r[2]!)}</text>
        <text x="920" y="${y + 36}" font-family="${FONT}" font-size="14" font-weight="700" fill="#2563eb">${esc(r[3]!)}</text>
        <text x="1130" y="${y + 36}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(r[4]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${emAppShell(48, 36, 1440, 780, name, "Lists", main)}
    ${
      annotate
        ? teachBanner(
            48,
            860,
            1440,
            "What good looks like",
            `One trusted ${name} segment beats five unowned lists.`,
            "#2563eb",
          )
        : ""
    }`,
  );
}

function emSetupChecklist(name: string): Buffer {
  const steps = [
    { n: 1, t: "Contacts & sends", d: "Weekly campaigners only", on: false },
    { n: 2, t: "Campaign owner", d: "Lists · auth · sync", on: true },
    { n: 3, t: "Priority segment", d: "One motion · suppressions", on: false },
    { n: 4, t: "Domain auth", d: "SPF · DKIM · DMARC", on: false },
    { n: 5, t: "Loop proof", d: "Non-admin walkthrough", on: false },
  ];
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} setup checklist</text>
    <rect x="260" y="120" width="520" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${steps
      .map((s) => {
        const y = 150 + (s.n - 1) * 100;
        return `
        <rect x="284" y="${y}" width="472" height="84" rx="14" fill="${s.on ? "#eff6ff" : "#f8fafc"}" stroke="${s.on ? "#93c5fd" : "#e2e8f0"}"/>
        <circle cx="330" cy="${y + 42}" r="22" fill="${s.on ? "#2563eb" : "#cbd5e1"}"/>
        <text x="330" y="${y + 48}" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="800" fill="#fff">${s.n}</text>
        <text x="372" y="${y + 36}" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">${esc(s.t)}</text>
        <text x="372" y="${y + 60}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(s.d)}</text>`;
      })
      .join("")}
    <rect x="820" y="120" width="560" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="852" y="172" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">Sends this week</text>
    ${[
      ["Campaign sends", "12,400 / 50,000"],
      ["Automation emails", "3,180"],
      ["Bounce rate", "0.4%"],
      ["Remaining buffer", "Healthy"],
    ]
      .map((row, i) => {
        const y = 220 + i * 90;
        return `
        <rect x="852" y="${y}" width="496" height="70" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="880" y="${y + 42}" font-family="${FONT}" font-size="16" font-weight="600" fill="#0f172a">${esc(row[0]!)}</text>
        <text x="1280" y="${y + 42}" text-anchor="end" font-family="${FONT}" font-size="16" font-weight="800" fill="#2563eb">${esc(row[1]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${emAppShell(48, 36, 1440, 780, name, "Settings", main)}
    ${teachBanner(48, 860, 1440, "Day-zero order", `Finish segment, domain auth, and one campaign in ${name} before extra channels.`, "#2563eb")}`,
  );
}

function emAutomationScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Automation · Welcome series</text>
    <rect x="260" y="120" width="720" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${[
      ["Trigger", "Signup · confirmed opt-in", "Active"],
      ["Day 0", "Welcome · brand intro", "Active"],
      ["Day 2", "Value tip · product tour", "Active"],
      ["Day 5", "Branch · opened vs not", "Queued"],
      ["Day 10", "Soft ask · next step", "Queued"],
    ]
      .map((r, i) => {
        const y = 160 + i * 95;
        const active = r[2] === "Active";
        return `
        <rect x="290" y="${y}" width="660" height="78" rx="12" fill="${active ? "#eff6ff" : "#f8fafc"}" stroke="#e2e8f0"/>
        <circle cx="330" cy="${y + 39}" r="18" fill="${active ? "#2563eb" : "#94a3b8"}"/>
        <text x="330" y="${y + 45}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="800" fill="#fff">${i + 1}</text>
        <text x="370" y="${y + 32}" font-family="${FONT}" font-size="16" font-weight="800" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="370" y="${y + 56}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(r[1]!)}</text>
        <text x="900" y="${y + 45}" text-anchor="end" font-family="${FONT}" font-size="14" font-weight="700" fill="${active ? "#2563eb" : "#94a3b8"}">${esc(r[2]!)}</text>`;
      })
      .join("")}
    <rect x="1020" y="120" width="360" height="560" rx="16" fill="#0f172a"/>
    <text x="1052" y="180" font-family="${FONT}" font-size="16" font-weight="800" fill="#93c5fd">THIS WEEK</text>
    <text x="1052" y="250" font-family="${FONT}" font-size="42" font-weight="800" fill="#ffffff">41%</text>
    <text x="1052" y="290" font-family="${FONT}" font-size="16" fill="#cbd5e1">Open rate</text>
    <text x="1052" y="370" font-family="${FONT}" font-size="42" font-weight="800" fill="#ffffff">6.2%</text>
    <text x="1052" y="410" font-family="${FONT}" font-size="16" fill="#cbd5e1">Click rate</text>
    <text x="1052" y="500" font-family="${FONT}" font-size="16" fill="#94a3b8">Unsubscribes: 0.2%</text>`;

  return shell(
    W,
    H,
    `
    ${emAppShell(48, 36, 1440, 780, name, "Automations", main)}
    ${teachBanner(48, 860, 1440, "One journey first", `Prove a welcome path in ${name} before stacking parallel automations.`, "#2563eb")}`,
  );
}

function emCrmSyncScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Integrations · CRM / store sync</text>
    ${[
      ["CRM sync", "Contacts + lifecycle tags · Connected", true],
      ["Sending domain", "Authenticated · SPF/DKIM", true],
      ["Ecommerce store", "Optional · Deferred", false],
      ["SMS / push packs", "Day 30+ only", false],
    ]
      .map((row, i) => {
        const y = 130 + i * 120;
        const on = row[2] === true;
        return `
        <rect x="260" y="${y}" width="1120" height="100" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
        <circle cx="320" cy="${y + 50}" r="28" fill="${on ? "#dbeafe" : "#f1f5f9"}"/>
        <text x="390" y="${y + 42}" font-family="${FONT}" font-size="20" font-weight="800" fill="#0f172a">${esc(String(row[0]))}</text>
        <text x="390" y="${y + 70}" font-family="${FONT}" font-size="15" fill="#64748b">${esc(String(row[1]))}</text>
        <rect x="1180" y="${y + 30}" width="140" height="40" rx="20" fill="${on ? "#2563eb" : "#e2e8f0"}"/>
        <text x="1250" y="${y + 56}" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="${on ? "#fff" : "#64748b"}">${on ? "ON" : "OFF"}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${emAppShell(48, 36, 1440, 780, name, "Settings", main)}
    ${teachBanner(48, 860, 1440, "ESP owns the send", `Sync tags from ${name} — do not turn the ESP into a second CRM.`, "#ea580c")}`,
  );
}

function emUsageDashboard(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Usage review (day 30)</text>
    ${[
      ["Automations live", "3", "Green", "#16a34a"],
      ["Open rate (nurture)", "38%", "Amber", "#f59e0b"],
      ["List growth / wk", "+2.1%", "Green", "#16a34a"],
      ["Shadow CSVs", "1 still live", "Amber", "#f59e0b"],
      ["Owner hours used", "1.5 / 2", "Green", "#16a34a"],
    ]
      .map((m, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 260 + col * 380;
        const y = 130 + row * 220;
        return `
        <rect x="${x}" y="${y}" width="350" height="190" rx="16" fill="#ffffff" stroke="#e2e8f0" filter="url(#card)"/>
        <text x="${x + 24}" y="${y + 44}" font-family="${FONT}" font-size="14" font-weight="700" fill="#64748b">${esc(String(m[0]).toUpperCase())}</text>
        <text x="${x + 24}" y="${y + 110}" font-family="${FONT}" font-size="42" font-weight="800" fill="#0f172a">${esc(String(m[1]))}</text>
        <rect x="${x + 24}" y="${y + 136}" width="110" height="32" rx="10" fill="${m[3]}" fill-opacity="0.15"/>
        <text x="${x + 79}" y="${y + 158}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="800" fill="${m[3]}">${esc(String(m[2]))}</text>`;
      })
      .join("")}
    <rect x="260" y="580" width="1120" height="100" rx="14" fill="#fffbeb" stroke="#fbbf24"/>
    <text x="296" y="640" font-family="${FONT}" font-size="18" font-weight="700" fill="#92400e">Amber overall — tighten segment filters, kill the shadow CSV, re-measure in 2 weeks. Do not buy more contacts yet.</text>`;

  return shell(
    W,
    H,
    `
    ${emAppShell(48, 36, 1440, 780, name, "Analytics", main)}
    ${teachBanner(48, 860, 1440, "Measure habits", `Sends burned is vanity — these ${name} metrics decide expand vs fix.`, "#f59e0b")}`,
  );
}

function emContactsWorksheet(name: string): Buffer {
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">${esc(name)} · contacts and sends worksheet</text>
    <text x="80" y="108" font-family="${FONT}" font-size="16" fill="#64748b">Count opted-in contacts who get mail — not your CRM total — then annualize before you compare</text>
    <rect x="80" y="140" width="680" height="700" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="112" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">Who is on the list?</text>
    ${[
      ["Active subscribers", "8,400", "Opted-in · mail-ready"],
      ["Suppressed", "620", "Bounce / unsubscribe"],
      ["Cold archive", "3,100", "Do not count toward plan"],
      ["Daily campaigners", "3 seats", "People who send weekly"],
    ]
      .map((r, i) => {
        const y = 230 + i * 120;
        return `
        <rect x="112" y="${y}" width="616" height="96" rx="14" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="140" y="${y + 34}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="140" y="${y + 60}" font-family="${FONT}" font-size="14" fill="#64748b">${esc(r[2]!)}</text>
        <text x="680" y="${y + 50}" text-anchor="end" font-family="${FONT}" font-size="28" font-weight="800" fill="#2563eb">${esc(r[1]!)}</text>`;
      })
      .join("")}
    <rect x="800" y="140" width="656" height="700" rx="16" fill="#0f172a"/>
    <text x="840" y="210" font-family="${FONT}" font-size="16" font-weight="800" fill="#93c5fd">WORKING TOTAL</text>
    <text x="840" y="290" font-family="${FONT}" font-size="56" font-weight="800" fill="#ffffff">8.4k</text>
    <text x="840" y="350" font-family="${FONT}" font-size="18" fill="#cbd5e1">Billable contacts</text>
    <rect x="840" y="420" width="576" height="120" rx="14" fill="#1e293b"/>
    <text x="872" y="470" font-family="${FONT}" font-size="17" fill="#e2e8f0">Confirm band on live pricing — never invent</text>
    <text x="872" y="510" font-family="${FONT}" font-size="17" fill="#e2e8f0">monthly×12 from a marketing tile</text>
    <rect x="840" y="580" width="576" height="160" rx="14" fill="#1d4ed8"/>
    <text x="872" y="650" font-family="${FONT}" font-size="18" font-weight="700" fill="#fff">Next: ${esc(name)} pricing</text>
    <text x="872" y="686" font-family="${FONT}" font-size="15" fill="#bfdbfe">Confirm contact band + send limits in writing</text>`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `worksheet · ${name}`, main)}
    ${teachBanner(40, 930, 1456, "Billable ≠ CRM total", `If a contact never receives ${name} mail, they do not set your plan.`, "#2563eb")}`,
  );
}

function emTrialProofScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · trial proof log (week 2)</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="56" fill="#0f172a"/>
    ${["PROOF", "OWNER", "RESULT", "DATE"]
      .map((h, i) => `<text x="${300 + i * 270}" y="158" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["Non-admin built segment", "Maya", "Pass", "Mar 12"],
      ["Domain auth verified", "Ops", "Pass", "Mar 12"],
      ["Welcome automation live", "Maya", "Pass", "Mar 13"],
      ["Tag landed in CRM", "Ops", "Fail → fix sync", "Mar 14"],
      ["Friday review from ESP", "Mkt lead", "Scheduled", "Mar 15"],
    ]
      .map((r, i) => {
        const y = 200 + i * 90;
        const fail = String(r[2]).startsWith("Fail");
        const pass = r[2] === "Pass";
        return `
        <rect x="280" y="${y}" width="1080" height="72" rx="12" fill="${fail ? "#fff1f2" : pass ? "#eff6ff" : "#fffbeb"}" stroke="#e2e8f0"/>
        <text x="300" y="${y + 44}" font-family="${FONT}" font-size="16" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="570" y="${y + 44}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[1]!)}</text>
        <text x="840" y="${y + 44}" font-family="${FONT}" font-size="16" font-weight="700" fill="${fail ? "#9f1239" : pass ? "#1d4ed8" : "#92400e"}">${esc(r[2]!)}</text>
        <text x="1110" y="${y + 44}" font-family="${FONT}" font-size="16" fill="#64748b">${esc(r[3]!)}</text>`;
      })
      .join("")}
    <rect x="260" y="710" width="1120" height="50" rx="12" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="296" y="742" font-family="${FONT}" font-size="15" font-weight="700" fill="#1e40af">Rule: buy only after a non-admin can finish list → campaign → measure without help.</text>`;

  return shell(
    W,
    H,
    `
    ${emAppShell(48, 36, 1440, 820, name, "Home", main)}
    ${teachBanner(48, 900, 1440, "Proof beats demos", `Vendor tours do not count — ${name} is worth it only when your team can run the loop.`, "#2563eb")}`,
  );
}

function emWorthItScorecard(name: string): Buffer {
  const qs = [
    ["Fit motion", "Matches best-for patterns", "Yes"],
    ["Campaign owner", "~2 hrs/week named", "Yes"],
    ["Email loop", "Non-admin proved", "Yes"],
    ["Package gates", "Musts on qualifying tier", "Needs check"],
    ["CRM / store sync", "Tags/lifecycle logged", "Yes"],
    ["Tradeoffs", "Can live with limits", "Yes"],
  ];
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="26" font-weight="800" fill="#0f172a">Is ${esc(name)} worth it? · trial scorecard</text>
    <rect x="80" y="110" width="900" height="720" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${qs
      .map((q, i) => {
        const y = 140 + i * 110;
        const ok = q[2] === "Yes";
        return `
        <rect x="110" y="${y}" width="840" height="90" rx="14" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="140" y="${y + 38}" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">${esc(q[0]!)}</text>
        <text x="140" y="${y + 66}" font-family="${FONT}" font-size="15" fill="#64748b">${esc(q[1]!)}</text>
        <rect x="760" y="${y + 24}" width="160" height="42" rx="12" fill="${ok ? "#dbeafe" : "#fef3c7"}"/>
        <text x="840" y="${y + 52}" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="800" fill="${ok ? "#1d4ed8" : "#92400e"}">${esc(q[2]!)}</text>`;
      })
      .join("")}
    <rect x="1020" y="110" width="440" height="720" rx="16" fill="#0f172a"/>
    <text x="1060" y="190" font-family="${FONT}" font-size="16" font-weight="800" fill="#93c5fd">VERDICT PATH</text>
    <text x="1060" y="260" font-family="${FONT}" font-size="36" font-weight="800" fill="#ffffff">Trial longer</text>
    <text x="1060" y="320" font-family="${FONT}" font-size="18" fill="#cbd5e1">5 / 6 gates clear.</text>
    <text x="1060" y="360" font-family="${FONT}" font-size="18" fill="#cbd5e1">Close the package-gate gap</text>
    <text x="1060" y="400" font-family="${FONT}" font-size="18" fill="#cbd5e1">before you buy.</text>
    <rect x="1060" y="480" width="360" height="100" rx="14" fill="#1e293b"/>
    <text x="1088" y="540" font-family="${FONT}" font-size="16" fill="#e2e8f0">Buy only when fit + loop + package all say yes.</text>
    <rect x="1060" y="620" width="360" height="120" rx="14" fill="#1d4ed8"/>
    <text x="1088" y="680" font-family="${FONT}" font-size="18" font-weight="700" fill="#fff">Next: ${esc(name)} plans</text>
    <text x="1088" y="712" font-family="${FONT}" font-size="15" fill="#bfdbfe">Confirm contacts/sends in writing</text>`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 900, `evaluate · ${name}`, main)}
    ${teachBanner(40, 950, 1456, "No invented ROI", `If fit, trial proof, or package coverage fails — keep looking instead of forcing ${name}.`, "#e11d48")}`,
  );
}

function emPlansTable(name: string): Buffer {
  const plans = ["Free", "Starter", "Marketer", "Enterprise"];
  const rows = [
    ["Email campaigns", "✓", "✓", "✓", "✓"],
    ["Automations", "—", "Limited", "✓", "✓"],
    ["Landing pages", "—", "✓", "✓", "✓"],
    ["CRM sync", "—", "✓", "✓", "✓"],
    ["Advanced reporting", "—", "—", "✓", "✓"],
  ];
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="26" font-weight="800" fill="#0f172a">${esc(name)} plans · must-haves vs tiers</text>
    <text x="80" y="108" font-family="${FONT}" font-size="16" fill="#64748b">Illustrative researched packaging — confirm live on the pricing page</text>
    <rect x="80" y="140" width="1376" height="700" rx="16" fill="#0f172a"/>
    <text x="110" y="200" font-family="${FONT}" font-size="15" font-weight="800" fill="#94a3b8">CAPABILITY</text>
    ${plans
      .map((p, i) => {
        const x = 420 + i * 250;
        const hot = p === "Marketer";
        return `
        <rect x="${x}" y="160" width="210" height="${hot ? 70 : 50}" rx="12" fill="${hot ? "#1d4ed8" : "#1e293b"}"/>
        <text x="${x + 105}" y="195" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="800" fill="${hot ? "#fff" : "#e2e8f0"}">${p}</text>
        ${hot ? `<text x="${x + 105}" y="220" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="700" fill="#bfdbfe">QUALIFYING EXAMPLE</text>` : ""}`;
      })
      .join("")}
    ${rows
      .map((row, ri) => {
        const y = 260 + ri * 100;
        return `
        <text x="110" y="${y + 28}" font-family="${FONT}" font-size="16" font-weight="600" fill="#e2e8f0">${esc(row[0]!)}</text>
        ${row
          .slice(1)
          .map((cell, ci) => {
            const x = 420 + ci * 250 + 105;
            const good = cell === "✓";
            const bad = cell === "—";
            return `<text x="${x}" y="${y + 28}" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="800" fill="${good ? "#4ade80" : bad ? "#64748b" : "#fbbf24"}">${esc(cell)}</text>`;
          })
          .join("")}`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 900, `plans · ${name}`, main)}
    ${teachBanner(40, 950, 1456, "Qualify upward", `Your highest gated must-have sets the ${name} plan — not the homepage “from” tile.`, "#2563eb")}`,
  );
}

function emQuoteDiligence(name: string): Buffer {
  const rows = [
    ["Contact band definition", "Written", "Open"],
    ["Overage / send behavior", "Named in writing", "Open"],
    ["Export / list ownership", "Confirmed", "Clear"],
    ["Implementation / success fees", "Line-itemed", "Missing"],
    ["Contract term + renewal uplift", "Capped", "Open"],
  ];
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">${esc(name)} · quote diligence board</text>
    <text x="80" y="108" font-family="${FONT}" font-size="16" fill="#64748b">When contacts matter, refuse to compare on a homepage tile alone</text>
    <rect x="80" y="140" width="1376" height="700" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="80" y="140" width="1376" height="64" fill="#0f172a"/>
    <text x="120" y="182" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">CHECK</text>
    <text x="720" y="182" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">EVIDENCE NEEDED</text>
    <text x="1180" y="182" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">STATUS</text>
    ${rows
      .map((r, i) => {
        const y = 230 + i * 110;
        const clear = r[2] === "Clear";
        const missing = r[2] === "Missing";
        return `
        <rect x="110" y="${y}" width="1316" height="90" rx="14" fill="${missing ? "#fff1f2" : clear ? "#eff6ff" : "#f8fafc"}" stroke="${missing ? "#fb7185" : clear ? "#93c5fd" : "#e2e8f0"}"/>
        <text x="140" y="${y + 52}" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="720" y="${y + 52}" font-family="${FONT}" font-size="17" fill="#475569">${esc(r[1]!)}</text>
        <rect x="1160" y="${y + 24}" width="220" height="42" rx="12" fill="${missing ? "#fecdd3" : clear ? "#bfdbfe" : "#e2e8f0"}"/>
        <text x="1270" y="${y + 52}" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="800" fill="${missing ? "#9f1239" : clear ? "#1d4ed8" : "#475569"}">${esc(r[2]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `procurement · ${name}`, main)}
    ${teachBanner(40, 930, 1456, "No vague quotes", `Do not shortlist ${name} until contact/send rules are written.`, "#e11d48")}`,
  );
}

function emDeferPacks(name: string): Buffer {
  const main = `
    <text x="80" y="70" font-family="${FONT}" font-size="24" font-weight="800" fill="#0f172a">${esc(name)} · day-one vs later packs</text>
    <rect x="80" y="120" width="680" height="720" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="120" y="180" font-family="${FONT}" font-size="20" font-weight="800" fill="#1d4ed8">BUY WITH THE PACKAGE</text>
    ${["Core contact band", "Domain auth", "CRM / store sync", "One automation path"]
      .map((t, i) => {
        const y = 230 + i * 120;
        return `
        <rect x="120" y="${y}" width="600" height="90" rx="14" fill="#ffffff" stroke="#93c5fd"/>
        <text x="160" y="${y + 54}" font-family="${FONT}" font-size="18" font-weight="700" fill="#1e40af">✓ ${esc(t)}</text>`;
      })
      .join("")}
    <rect x="800" y="120" width="680" height="720" rx="16" fill="#fffbeb" stroke="#fbbf24"/>
    <text x="840" y="180" font-family="${FONT}" font-size="20" font-weight="800" fill="#92400e">DEFER TO DAY 30+</text>
    ${["SMS / push packs", "Second channel", "AI drafting pack", "Unused enterprise seats"]
      .map((t, i) => {
        const y = 230 + i * 120;
        return `
        <rect x="840" y="${y}" width="600" height="90" rx="14" fill="#ffffff" stroke="#fbbf24"/>
        <text x="880" y="${y + 54}" font-family="${FONT}" font-size="18" font-weight="700" fill="#92400e">⏳ ${esc(t)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${browserWindow(40, 24, 1456, 880, `scope · ${name} packs`, main)}
    ${teachBanner(40, 930, 1456, "Scope the first invoice", `If a pack is not required for Friday reviews in ${name}, it is not day-one spend.`, "#f59e0b")}`,
  );
}

function emFieldMapScreen(name: string): Buffer {
  const rows = [
    ["email", "Subscriber → Email", "Direct"],
    ["opt_in_date", "Consent → Confirmed", "Required"],
    ["tags", "Tags → Custom fields", "Normalize"],
    ["owner", "Owner → User", "Remap users"],
    ["do_not_email", "Suppression list", "Required"],
    ["old_score", "—", "Archive only"],
  ];
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Migration · Field map into ${esc(name)}</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="56" rx="16" fill="#0f172a"/>
    <rect x="260" y="156" width="1120" height="20" fill="#0f172a"/>
    <text x="290" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">SOURCE FIELD</text>
    <text x="620" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">${esc(name.toUpperCase())} DESTINATION</text>
    <text x="1100" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">RULE</text>
    ${rows
      .map((r, i) => {
        const y = 196 + i * 76;
        const archive = r[2] === "Archive only";
        return `
        <rect x="280" y="${y}" width="1080" height="64" rx="10" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="300" y="${y + 38}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" fill="#334155">${esc(r[0]!)}</text>
        <text x="620" y="${y + 38}" font-family="${FONT}" font-size="16" font-weight="600" fill="#0f172a">${esc(r[1]!)}</text>
        <rect x="1080" y="${y + 16}" width="250" height="32" rx="8" fill="${archive ? "#fff1f2" : "#eff6ff"}"/>
        <text x="1205" y="${y + 38}" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="${archive ? "#be123c" : "#1d4ed8"}">${esc(r[2]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${emAppShell(48, 36, 1440, 780, name, "Settings", main)}
    ${teachBanner(48, 860, 1440, "Map meanings first", `Don’t bulk-import into ${name} until consent and suppressions are signed off.`, "#2563eb")}`,
  );
}

function emPilotImportScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Import wizard · Pilot (Maya’s list)</text>
    <rect x="260" y="120" width="1120" height="120" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="296" y="175" font-family="${FONT}" font-size="18" font-weight="700" fill="#1e40af">Step 2 of 4 · Preview 180 subscribers before commit</text>
    <text x="296" y="210" font-family="${FONT}" font-size="15" fill="#2563eb">People 180 · Tags 12 · Suppressions 9 · Automation enrollments 40</text>
    <rect x="260" y="270" width="1120" height="400" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${["✓ Emails match source", "✓ Consent fields preserved", "⚠ 4 tags need normalize rules", "✓ Suppressions preserved"]
      .map((t, i) => {
        const y = 320 + i * 80;
        const warn = t.startsWith("⚠");
        return `
        <rect x="296" y="${y}" width="1048" height="60" rx="12" fill="${warn ? "#fffbeb" : "#eff6ff"}"/>
        <text x="328" y="${y + 38}" font-family="${FONT}" font-size="18" font-weight="600" fill="${warn ? "#b45309" : "#1e40af"}">${esc(t)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${emAppShell(48, 36, 1440, 820, name, "Settings", main)}
    ${teachBanner(48, 900, 1440, "Pilot before bulk", `Fix mapping on one marketer’s ${name} list — then scale.`, "#2563eb")}`,
  );
}

function emDualRunScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Dual-run week · ${esc(name)} is write path</text>
    <rect x="260" y="130" width="520" height="520" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="296" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#1d4ed8">LIVE · ${esc(name)}</text>
    <text x="296" y="250" font-family="${FONT}" font-size="16" fill="#1e40af">✓ All new subscribers here</text>
    <text x="296" y="300" font-family="${FONT}" font-size="16" fill="#1e40af">✓ New automations here</text>
    <text x="296" y="350" font-family="${FONT}" font-size="16" fill="#1e40af">✓ Friday review here</text>
    <text x="296" y="420" font-family="${FONT}" font-size="16" fill="#1d4ed8">Write-access: marketers + owner</text>
    <rect x="860" y="130" width="520" height="520" rx="16" fill="#f1f5f9" stroke="#cbd5e1"/>
    <text x="896" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#64748b">OLD ESP · READ ONLY</text>
    <text x="896" y="250" font-family="${FONT}" font-size="16" fill="#64748b">• History lookups only</text>
    <text x="896" y="300" font-family="${FONT}" font-size="16" fill="#64748b">• No new campaigns</text>
    <text x="896" y="350" font-family="${FONT}" font-size="16" fill="#64748b">• No list edits</text>
    <text x="896" y="420" font-family="${FONT}" font-size="16" fill="#94a3b8">Cutover after marketer sign-off</text>`;

  return shell(
    W,
    H,
    `
    ${emAppShell(48, 36, 1440, 820, name, "Lists", main)}
    ${teachBanner(48, 900, 1440, "One week is enough", `A month of dual lists means you never actually switched to ${name}.`, "#e11d48")}`,
  );
}

const EM_ART: Record<CrmProductGuideKind, KindArt> = {
  implementation: {
    hero: (name) => emRaciBoard(name),
    figure: (name) => emSegmentBoard(name),
    panels: (name) => [
      emAutomationScreen(name),
      emCrmSyncScreen(name),
      emSetupChecklist(name),
      emUsageDashboard(name),
    ],
  },
  setup: {
    hero: (name) => emSetupChecklist(name),
    figure: (name) => emSegmentBoard(name),
    panels: (name) => [
      emContactsWorksheet(name),
      emCrmSyncScreen(name),
      emAutomationScreen(name),
      emTrialProofScreen(name),
    ],
  },
  migration: {
    hero: (name) => emFieldMapScreen(name),
    figure: (name) => emPilotImportScreen(name),
    panels: (name) => [
      emDualRunScreen(name),
      emCrmSyncScreen(name),
      emSegmentBoard(name, false),
      emUsageDashboard(name),
    ],
  },
  plans: {
    hero: (name) => emPlansTable(name),
    figure: (name) => emContactsWorksheet(name),
    panels: (name) => [
      emQuoteDiligence(name),
      emDeferPacks(name),
      emAutomationScreen(name),
      emUsageDashboard(name),
    ],
  },
  "worth-it": {
    hero: (name) => emWorthItScorecard(name),
    figure: (name) => emTrialProofScreen(name),
    panels: (name) => [
      emSegmentBoard(name, false),
      emContactsWorksheet(name),
      emAutomationScreen(name),
      emCrmSyncScreen(name),
    ],
  },
};

/** Marketing & growth reuses ESP teaching layouts with campaign-first nav labels. */
const MARKETING_ART = EM_ART;

/* ------------------------------------------------------------------ BC art (business communications / phone — not ESP campaign UI) */

function bcAppShell(
  x: number,
  y: number,
  w: number,
  h: number,
  name: string,
  active: string,
  main: string,
): string {
  const nav = ["Home", "Numbers", "Softphone", "Queues", "Call log", "Admin"];
  const items = nav
    .map((label, i) => {
      const iy = y + 120 + i * 52;
      const on = label === active;
      return `
      <rect x="${x + 16}" y="${iy}" width="188" height="42" rx="10" fill="${on ? "#2563eb" : "transparent"}"/>
      <text x="${x + 40}" y="${iy + 27}" font-family="${FONT}" font-size="16" font-weight="${on ? 700 : 500}" fill="${on ? "#ffffff" : "#cbd5e1"}">${label}</text>`;
    })
    .join("");
  return `
  ${browserWindow(
    x,
    y,
    w,
    h,
    `admin.${name.toLowerCase().replace(/\s+/g, "")}.example / ${active.toLowerCase()}`,
    `
    <rect x="${x + 1}" y="${y + 49}" width="220" height="${h - 50}" fill="#0f172a"/>
    <text x="${x + 28}" y="${y + 92}" font-family="${FONT}" font-size="22" font-weight="800" fill="#ffffff">${esc(name)}</text>
    ${items}
    <rect x="${x + 221}" y="${y + 49}" width="${w - 222}" height="${h - 50}" fill="#f8fafc"/>
    ${main}
    `,
  )}`;
}

function bcRaciBoard(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Week 0 · ${esc(name)} phone RACI</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="64" fill="#0f172a"/>
    ${["ROLE", "NAME", "OWNS", "HOURS / WK"]
      .map((h, i) => `<text x="${320 + i * 270}" y="162" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["Responsible", "Ops lead", "Numbers · IVR · CTI", "2.0"],
      ["Accountable", "Support lead", "Answer rate · Friday review", "1.0"],
      ["Consulted", "2 agents", "Softphone / routing friction", "0.5"],
      ["Informed", "CRM admin", "Call dispositions", "—"],
    ]
      .map((r, i) => {
        const y = 220 + i * 100;
        return `
        <rect x="280" y="${y}" width="1080" height="80" rx="12" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="320" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="800" fill="#2563eb">${esc(r[0]!)}</text>
        <text x="590" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[1]!)}</text>
        <text x="860" y="${y + 48}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[2]!)}</text>
        <text x="1200" y="${y + 48}" font-family="${FONT}" font-size="17" font-weight="700" fill="#0f172a">${esc(r[3]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Home", main)}
    ${teachBanner(48, 860, 1440, "Before configuration", `Name Responsible + Accountable for ${name} before anyone burns minutes.`, "#2563eb")}`,
  );
}

function bcQueueBoard(name: string, annotate = true): Buffer {
  const callout = annotate
    ? `<rect x="1180" y="140" width="220" height="120" rx="14" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="1290" y="190" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="700" fill="#1e40af">One queue</text>
    <text x="1290" y="220" text-anchor="middle" font-family="${FONT}" font-size="13" fill="#2563eb">Day-zero only</text>`
    : "";
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Queue · Inbound support</text>
    <rect x="260" y="120" width="880" height="80" rx="14" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="290" y="170" font-family="${FONT}" font-size="16" font-weight="700" fill="#1e40af">Rules: Business hours · Skill = support · Overflow → voicemail · DNC blocked</text>
    ${callout}
    <rect x="260" y="220" width="1120" height="460" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${["CALLER", "STATUS", "QUEUE", "WAIT", "OWNER"]
      .map((h, i) => `<text x="${290 + i * 210}" y="265" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["+1 415 555 0142", "Ringing", "Support", "0:12", "Maya"],
      ["+44 20 7946 0958", "Queued", "Support", "1:05", "—"],
      ["+1 646 555 0199", "Talking", "Support", "—", "Chris"],
      ["+61 2 5550 0191", "Queued", "Support", "0:48", "—"],
      ["+1 312 555 0177", "Blocked", "DNC", "—", "Ops"],
    ]
      .map((r, i) => {
        const y = 300 + i * 70;
        return `
        <rect x="280" y="${y}" width="1080" height="58" rx="10" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="290" y="${y + 36}" font-family="${FONT}" font-size="15" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="500" y="${y + 36}" font-family="${FONT}" font-size="15" font-weight="700" fill="#2563eb">${esc(r[1]!)}</text>
        <text x="710" y="${y + 36}" font-family="${FONT}" font-size="15" fill="#475569">${esc(r[2]!)}</text>
        <text x="920" y="${y + 36}" font-family="${FONT}" font-size="15" fill="#475569">${esc(r[3]!)}</text>
        <text x="1130" y="${y + 36}" font-family="${FONT}" font-size="15" fill="#0f172a">${esc(r[4]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Queues", main)}
    ${teachBanner(48, 860, 1440, "One clean queue", `One inbound ${name} queue beats five unowned experiments.`, "#2563eb")}`,
  );
}

function bcSoftphoneScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Softphone · Active call</text>
    <rect x="260" y="120" width="520" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="320" y="190" font-family="${FONT}" font-size="15" font-weight="700" fill="#94a3b8">INBOUND · SUPPORT QUEUE</text>
    <text x="320" y="250" font-family="${FONT}" font-size="28" font-weight="800" fill="#0f172a">+1 415 555 0142</text>
    <text x="320" y="300" font-family="${FONT}" font-size="16" fill="#475569">Harbor Studio · CRM: open deal</text>
    <text x="320" y="360" font-family="${FONT}" font-size="42" font-weight="800" fill="#2563eb">03:42</text>
    <rect x="320" y="420" width="140" height="56" rx="28" fill="#16a34a"/>
    <text x="390" y="456" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#ffffff">Mute</text>
    <rect x="480" y="420" width="140" height="56" rx="28" fill="#dc2626"/>
    <text x="550" y="456" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#ffffff">End</text>
    <rect x="640" y="420" width="100" height="56" rx="28" fill="#0f172a"/>
    <text x="690" y="456" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="700" fill="#ffffff">Hold</text>
    <rect x="820" y="120" width="560" height="560" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="860" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#1e40af">IVR path taken</text>
    <text x="860" y="250" font-family="${FONT}" font-size="16" fill="#1e40af">1 · Main greeting</text>
    <text x="860" y="300" font-family="${FONT}" font-size="16" fill="#1e40af">2 · Press 2 · Support</text>
    <text x="860" y="350" font-family="${FONT}" font-size="16" fill="#1e40af">3 · Queue: Support</text>
    <text x="860" y="420" font-family="${FONT}" font-size="16" fill="#2563eb">Recording: on · Consent played</text>
    <text x="860" y="480" font-family="${FONT}" font-size="16" fill="#2563eb">CTI: screen-pop ready</text>`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Softphone", main)}
    ${teachBanner(48, 860, 1440, "Softphone first", `Prove a non-admin can finish a live ${name} call before optional channels.`, "#2563eb")}`,
  );
}

function bcCallLogScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Call log · Today</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${["TIME", "FROM / TO", "DIRECTION", "DURATION", "CRM"]
      .map((h, i) => `<text x="${290 + i * 210}" y="175" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["09:12", "+1 415… / Support", "Inbound", "4:02", "Logged"],
      ["09:28", "Maya / +44 20…", "Outbound", "2:11", "Logged"],
      ["10:05", "+1 646… / Sales", "Inbound", "0:18", "Missed"],
      ["10:41", "Chris / +1 312…", "Outbound", "6:44", "Logged"],
      ["11:03", "+61 2… / Support", "Inbound", "3:20", "Logged"],
    ]
      .map((r, i) => {
        const y = 210 + i * 80;
        return `
        <rect x="280" y="${y}" width="1080" height="64" rx="12" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="290" y="${y + 40}" font-family="${FONT}" font-size="16" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="500" y="${y + 40}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[1]!)}</text>
        <text x="710" y="${y + 40}" font-family="${FONT}" font-size="16" font-weight="700" fill="#2563eb">${esc(r[2]!)}</text>
        <text x="920" y="${y + 40}" font-family="${FONT}" font-size="16" fill="#0f172a">${esc(r[3]!)}</text>
        <text x="1130" y="${y + 40}" font-family="${FONT}" font-size="16" font-weight="700" fill="${r[4] === "Logged" ? "#16a34a" : "#b45309"}">${esc(r[4]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Call log", main)}
    ${teachBanner(48, 860, 1440, "Logs beat screenshots", `Friday reviews run from the ${name} call log — not private sheets.`, "#2563eb")}`,
  );
}

function bcCrmCtiScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">CRM CTI · ${esc(name)} ↔ HubSpot</text>
    <rect x="260" y="130" width="520" height="520" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="296" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#1d4ed8">${esc(name)} CALL</text>
    <text x="296" y="250" font-family="${FONT}" font-size="16" fill="#1e40af">✓ Click-to-dial from contact</text>
    <text x="296" y="300" font-family="${FONT}" font-size="16" fill="#1e40af">✓ Screen-pop on inbound</text>
    <text x="296" y="350" font-family="${FONT}" font-size="16" fill="#1e40af">✓ Disposition written back</text>
    <text x="296" y="420" font-family="${FONT}" font-size="16" fill="#1d4ed8">Activity owner = agent</text>
    <rect x="860" y="130" width="520" height="520" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="896" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">CRM CONTACT</text>
    <text x="896" y="250" font-family="${FONT}" font-size="16" fill="#475569">Priya Chen · Harbor Studio</text>
    <text x="896" y="300" font-family="${FONT}" font-size="16" fill="#475569">Last call: today 09:12</text>
    <text x="896" y="350" font-family="${FONT}" font-size="16" fill="#475569">Disposition: Resolved</text>
    <text x="896" y="420" font-family="${FONT}" font-size="16" fill="#16a34a">Recording link attached</text>`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Admin", main)}
    ${teachBanner(48, 860, 1440, "Phone owns the call", `Sync dispositions from ${name} — do not turn the phone system into a second CRM.`, "#ea580c")}`,
  );
}

function bcSetupChecklist(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Day-zero checklist · ${esc(name)}</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${[
      ["Seats & numbers", "Weekly callers only", false],
      ["One inbound queue", "Support hours + overflow", true],
      ["CRM CTI", "Click-to-dial + log", true],
      ["Softphone proof", "Non-admin completes loop", false],
      ["Recording consent", "Prompt + retention note", false],
    ]
      .map((r, i) => {
        const y = 160 + i * 95;
        const on = r[2];
        return `
        <rect x="296" y="${y}" width="1048" height="80" rx="14" fill="${on ? "#eff6ff" : "#f8fafc"}" stroke="${on ? "#93c5fd" : "#e2e8f0"}"/>
        <circle cx="350" cy="${y + 40}" r="18" fill="${on ? "#2563eb" : "#cbd5e1"}"/>
        <text x="350" y="${y + 46}" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="800" fill="#ffffff">${on ? "✓" : i + 1}</text>
        <text x="400" y="${y + 34}" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">${esc(String(r[0]))}</text>
        <text x="400" y="${y + 62}" font-family="${FONT}" font-size="15" fill="#64748b">${esc(String(r[1]))}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Admin", main)}
    ${teachBanner(48, 860, 1440, "Day-zero order", `Finish queue, numbers, and one softphone loop in ${name} before extra channels.`, "#2563eb")}`,
  );
}

function bcSeatsWorksheet(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Seats & numbers worksheet</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${[
      ["Daily callers", "8 seats", "People who take or place calls weekly"],
      ["Managers", "2 seats", "Listen / coach — not vanity headcount"],
      ["Local numbers", "3 DIDs", "US + UK + AU required"],
      ["Minutes band", "Confirm", "Inbound + outbound order of magnitude"],
    ]
      .map((r, i) => {
        const y = 170 + i * 110;
        return `
        <rect x="296" y="${y}" width="1048" height="90" rx="14" fill="${i % 2 ? "#f8fafc" : "#eff6ff"}" stroke="#e2e8f0"/>
        <text x="330" y="${y + 38}" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="700" y="${y + 38}" font-family="${FONT}" font-size="18" font-weight="700" fill="#2563eb">${esc(r[1]!)}</text>
        <text x="330" y="${y + 68}" font-family="${FONT}" font-size="15" fill="#64748b">${esc(r[2]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Admin", main)}
    ${teachBanner(48, 860, 1440, "Count callers", `Seat and number discipline beats vanity headcount for ${name}.`, "#2563eb")}`,
  );
}

function bcIvrScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · IVR builder · Main greeting</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="320" y="180" width="280" height="100" rx="14" fill="#0f172a"/>
    <text x="460" y="240" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#ffffff">Greeting</text>
    <rect x="680" y="180" width="280" height="100" rx="14" fill="#2563eb"/>
    <text x="820" y="240" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#ffffff">Press 1 · Sales</text>
    <rect x="1040" y="180" width="280" height="100" rx="14" fill="#2563eb"/>
    <text x="1180" y="240" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#ffffff">Press 2 · Support</text>
    <rect x="680" y="360" width="280" height="100" rx="14" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="820" y="420" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#1e40af">Sales queue</text>
    <rect x="1040" y="360" width="280" height="100" rx="14" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="1180" y="420" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#1e40af">Support queue</text>
    <text x="320" y="560" font-family="${FONT}" font-size="15" fill="#64748b">Confirm labels in product — this panel teaches the pattern, not vendor menus.</text>`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Queues", main)}
    ${teachBanner(48, 860, 1440, "Route before features", `A working ${name} IVR beats unused AI packs in week one.`, "#2563eb")}`,
  );
}

function bcUsageDashboard(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Friday usage review</text>
    <rect x="260" y="120" width="340" height="200" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="290" y="170" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">ANSWER RATE</text>
    <text x="290" y="230" font-family="${FONT}" font-size="40" font-weight="800" fill="#1e40af">91%</text>
    <rect x="640" y="120" width="340" height="200" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="670" y="170" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">MISSED</text>
    <text x="670" y="230" font-family="${FONT}" font-size="40" font-weight="800" fill="#0f172a">12</text>
    <rect x="1020" y="120" width="360" height="200" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="1050" y="170" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">CRM LOGGED</text>
    <text x="1050" y="230" font-family="${FONT}" font-size="40" font-weight="800" fill="#16a34a">98%</text>
    <rect x="260" y="360" width="1120" height="280" rx="16" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="296" y="420" font-family="${FONT}" font-size="16" fill="#475569">Agenda: minutes used · queue wait · CTI errors · shadow call sheets</text>
    <text x="296" y="480" font-family="${FONT}" font-size="16" fill="#475569">Owner: Ops lead · Review: Sales/support lead</text>
    <text x="296" y="560" font-family="${FONT}" font-size="15" font-weight="700" fill="#1e40af">Rule: buy only after a non-admin can finish number → softphone → CRM log without help.</text>`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Home", main)}
    ${teachBanner(48, 860, 1440, "Usage before features", `Expand ${name} only where answer-rate or coverage is still missing.`, "#2563eb")}`,
  );
}

function bcPlansTable(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Qualifying tiers (research pattern)</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${["CAPABILITY", "STARTER", "GROWTH", "SCALE"]
      .map((h, i) => `<text x="${320 + i * 280}" y="180" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">${h}</text>`)
      .join("")}
    ${[
      ["Cloud phone / softphone", "✓", "✓", "✓"],
      ["Call routing / IVR", "Limited", "✓", "✓"],
      ["Call recording", "—", "✓", "✓"],
      ["CRM CTI", "—", "✓", "✓"],
      ["Team messaging", "—", "Add-on", "✓"],
    ]
      .map((r, i) => {
        const y = 230 + i * 80;
        return `
        <rect x="280" y="${y}" width="1080" height="64" rx="10" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="320" y="${y + 40}" font-family="${FONT}" font-size="16" font-weight="600" fill="#0f172a">${esc(r[0]!)}</text>
        <text x="600" y="${y + 40}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[1]!)}</text>
        <text x="880" y="${y + 40}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[2]!)}</text>
        <text x="1160" y="${y + 40}" font-family="${FONT}" font-size="16" fill="#475569">${esc(r[3]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Admin", main)}
    ${teachBanner(48, 860, 1440, "Gates set the floor", `Map must-haves upward — confirm live ${name} packaging on the pricing page.`, "#2563eb")}`,
  );
}

function bcWorthItScorecard(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Is ${esc(name)} worth it? · Scorecard</text>
    <rect x="260" y="130" width="340" height="500" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="430" y="200" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="800" fill="#1e40af">FIT</text>
    <text x="430" y="280" text-anchor="middle" font-family="${FONT}" font-size="16" fill="#1e40af">Best-for match?</text>
    <text x="430" y="340" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="800" fill="#16a34a">Pass</text>
    <rect x="650" y="130" width="340" height="500" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="820" y="200" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a">PROOF</text>
    <text x="820" y="280" text-anchor="middle" font-family="${FONT}" font-size="16" fill="#475569">Non-admin call loop?</text>
    <text x="820" y="340" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="800" fill="#16a34a">Pass</text>
    <rect x="1040" y="130" width="340" height="500" rx="16" fill="#fff7ed" stroke="#fdba74"/>
    <text x="1210" y="200" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="800" fill="#c2410c">PACKAGE</text>
    <text x="1210" y="280" text-anchor="middle" font-family="${FONT}" font-size="16" fill="#9a3412">Seats/numbers clear?</text>
    <text x="1210" y="340" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="800" fill="#c2410c">Hold</text>`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Home", main)}
    ${teachBanner(48, 860, 1440, "Three gates", `Buy ${name} only when fit, proof, and package all say yes.`, "#ea580c")}`,
  );
}

function bcTrialProofScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Trial proof · ${esc(name)} call loop</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${[
      ["1", "Provision number", "Done"],
      ["2", "Set inbound queue", "Done"],
      ["3", "Softphone answer", "Done"],
      ["4", "CRM activity logged", "Blocked"],
    ]
      .map((r, i) => {
        const y = 180 + i * 110;
        const blocked = r[2] === "Blocked";
        return `
        <rect x="296" y="${y}" width="1048" height="90" rx="14" fill="${blocked ? "#fff7ed" : "#eff6ff"}" stroke="${blocked ? "#fdba74" : "#93c5fd"}"/>
        <circle cx="360" cy="${y + 45}" r="24" fill="${blocked ? "#ea580c" : "#2563eb"}"/>
        <text x="360" y="${y + 52}" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="800" fill="#ffffff">${esc(r[0]!)}</text>
        <text x="420" y="${y + 40}" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">${esc(r[1]!)}</text>
        <text x="420" y="${y + 68}" font-family="${FONT}" font-size="15" fill="${blocked ? "#c2410c" : "#1e40af"}">${esc(r[2]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Softphone", main)}
    ${teachBanner(48, 860, 1440, "Proof before buy", `Extend trial until CRM logging works — then reconsider ${name}.`, "#ea580c")}`,
  );
}

function bcNumberMapScreen(name: string): Buffer {
  const rows = [
    ["DID +1 415…", "Support main", "Port"],
    ["DID +44 20…", "UK sales", "Port"],
    ["IVR Main", "Greeting + menus", "Rebuild"],
    ["Queue Support", "Business hours", "Map"],
    ["Legacy hunt group", "—", "Archive only"],
  ];
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Number & route map · into ${esc(name)}</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="260" y="120" width="1120" height="56" fill="#0f172a"/>
    <text x="290" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">SOURCE</text>
    <text x="620" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">${esc(name.toUpperCase())} DESTINATION</text>
    <text x="1100" y="156" font-family="${FONT}" font-size="14" font-weight="700" fill="#94a3b8">RULE</text>
    ${rows
      .map((r, i) => {
        const y = 196 + i * 76;
        const archive = r[2] === "Archive only";
        return `
        <rect x="280" y="${y}" width="1080" height="64" rx="10" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        <text x="300" y="${y + 38}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" fill="#334155">${esc(r[0]!)}</text>
        <text x="620" y="${y + 38}" font-family="${FONT}" font-size="16" font-weight="600" fill="#0f172a">${esc(r[1]!)}</text>
        <rect x="1080" y="${y + 16}" width="250" height="32" rx="8" fill="${archive ? "#fff1f2" : "#eff6ff"}"/>
        <text x="1205" y="${y + 38}" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="${archive ? "#be123c" : "#1d4ed8"}">${esc(r[2]!)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Numbers", main)}
    ${teachBanner(48, 860, 1440, "Map meanings first", `Don’t port everything into ${name} until DNC and owners are signed off.`, "#2563eb")}`,
  );
}

function bcPilotCutoverScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Pilot cutover · Support queue only</text>
    <rect x="260" y="120" width="1120" height="120" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="296" y="175" font-family="${FONT}" font-size="18" font-weight="700" fill="#1e40af">Step 2 of 4 · Prove one queue before company-wide port</text>
    <text x="296" y="210" font-family="${FONT}" font-size="15" fill="#2563eb">DIDs 1 · Agents 3 · CTI checks 20 · Missed-call tests 5</text>
    <rect x="260" y="270" width="1120" height="400" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${["✓ Inbound rings softphone", "✓ CRM activity logged", "⚠ 2 IVR prompts need re-record", "✓ DNC list imported"]
      .map((t, i) => {
        const y = 320 + i * 80;
        const warn = t.startsWith("⚠");
        return `
        <rect x="296" y="${y}" width="1048" height="60" rx="12" fill="${warn ? "#fffbeb" : "#eff6ff"}"/>
        <text x="328" y="${y + 38}" font-family="${FONT}" font-size="18" font-weight="600" fill="${warn ? "#b45309" : "#1e40af"}">${esc(t)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 820, name, "Numbers", main)}
    ${teachBanner(48, 900, 1440, "Pilot before bulk", `Fix routing on one ${name} queue — then scale ports.`, "#2563eb")}`,
  );
}

function bcDualRunScreen(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Dual-run week · ${esc(name)} is write path</text>
    <rect x="260" y="130" width="520" height="520" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="296" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#1d4ed8">LIVE · ${esc(name)}</text>
    <text x="296" y="250" font-family="${FONT}" font-size="16" fill="#1e40af">✓ All new DIDs here</text>
    <text x="296" y="300" font-family="${FONT}" font-size="16" fill="#1e40af">✓ New queues here</text>
    <text x="296" y="350" font-family="${FONT}" font-size="16" fill="#1e40af">✓ Friday review here</text>
    <text x="296" y="420" font-family="${FONT}" font-size="16" fill="#1d4ed8">Write-access: agents + owner</text>
    <rect x="860" y="130" width="520" height="520" rx="16" fill="#f1f5f9" stroke="#cbd5e1"/>
    <text x="896" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#64748b">OLD PHONE · READ ONLY</text>
    <text x="896" y="250" font-family="${FONT}" font-size="16" fill="#64748b">• History lookups only</text>
    <text x="896" y="300" font-family="${FONT}" font-size="16" fill="#64748b">• No new live traffic</text>
    <text x="896" y="350" font-family="${FONT}" font-size="16" fill="#64748b">• No queue edits</text>
    <text x="896" y="420" font-family="${FONT}" font-size="16" fill="#94a3b8">Cutover after agent sign-off</text>`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 820, name, "Numbers", main)}
    ${teachBanner(48, 900, 1440, "One week is enough", `A month of dual phones means you never actually switched to ${name}.`, "#e11d48")}`,
  );
}

function bcQuoteDiligence(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · Quote diligence checklist</text>
    <rect x="260" y="120" width="1120" height="560" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${[
      "Named SKU / edition on the quote",
      "Seat definition (full vs light)",
      "Number / minute exhaustion mid-month",
      "Number port / export rights",
    ]
      .map((t, i) => {
        const y = 180 + i * 110;
        return `
        <rect x="296" y="${y}" width="1048" height="90" rx="14" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="340" y="${y + 52}" font-family="${FONT}" font-size="18" font-weight="600" fill="#0f172a">${i + 1}. ${esc(t)}</text>`;
      })
      .join("")}`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Admin", main)}
    ${teachBanner(48, 860, 1440, "No vague quotes", `Open rows block a fair ${name} shortlist.`, "#ea580c")}`,
  );
}

function bcDeferPacks(name: string): Buffer {
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">Defer packs · ${esc(name)} day-61 list</text>
    <rect x="260" y="120" width="520" height="520" rx="16" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="296" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#1e40af">DAY 1–30</text>
    <text x="296" y="260" font-family="${FONT}" font-size="16" fill="#1e40af">• Numbers + softphone</text>
    <text x="296" y="310" font-family="${FONT}" font-size="16" fill="#1e40af">• One queue / IVR</text>
    <text x="296" y="360" font-family="${FONT}" font-size="16" fill="#1e40af">• CRM CTI logging</text>
    <rect x="860" y="120" width="520" height="520" rx="16" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="896" y="190" font-family="${FONT}" font-size="18" font-weight="800" fill="#64748b">LATER</text>
    <text x="896" y="260" font-family="${FONT}" font-size="16" fill="#64748b">• Second queue</text>
    <text x="896" y="310" font-family="${FONT}" font-size="16" fill="#64748b">• WhatsApp / shared inbox</text>
    <text x="896" y="360" font-family="${FONT}" font-size="16" fill="#64748b">• AI summaries</text>`;

  return shell(
    W,
    H,
    `
    ${bcAppShell(48, 36, 1440, 780, name, "Admin", main)}
    ${teachBanner(48, 860, 1440, "Defer on purpose", `Write what you chose not to buy in ${name} — renewal evidence.`, "#2563eb")}`,
  );
}

const BC_ART: Record<CrmProductGuideKind, KindArt> = {
  implementation: {
    hero: (name) => bcRaciBoard(name),
    figure: (name) => bcQueueBoard(name),
    panels: (name) => [
      bcIvrScreen(name),
      bcCrmCtiScreen(name),
      bcSetupChecklist(name),
      bcUsageDashboard(name),
    ],
  },
  setup: {
    hero: (name) => bcSetupChecklist(name),
    figure: (name) => bcQueueBoard(name),
    panels: (name) => [
      bcSeatsWorksheet(name),
      bcCrmCtiScreen(name),
      bcSoftphoneScreen(name),
      bcTrialProofScreen(name),
    ],
  },
  migration: {
    hero: (name) => bcNumberMapScreen(name),
    figure: (name) => bcPilotCutoverScreen(name),
    panels: (name) => [
      bcDualRunScreen(name),
      bcCrmCtiScreen(name),
      bcQueueBoard(name, false),
      bcUsageDashboard(name),
    ],
  },
  plans: {
    hero: (name) => bcPlansTable(name),
    figure: (name) => bcSeatsWorksheet(name),
    panels: (name) => [
      bcQuoteDiligence(name),
      bcDeferPacks(name),
      bcIvrScreen(name),
      bcUsageDashboard(name),
    ],
  },
  "worth-it": {
    hero: (name) => bcWorthItScorecard(name),
    figure: (name) => bcTrialProofScreen(name),
    panels: (name) => [
      bcQueueBoard(name, false),
      bcSeatsWorksheet(name),
      bcSoftphoneScreen(name),
      bcCrmCtiScreen(name),
    ],
  },
};

/* ------------------------------------------------------------------ AI art (LLM / credits / projects — not CRM pipeline) */

function categoryAppShell(
  x: number,
  y: number,
  w: number,
  h: number,
  name: string,
  nav: readonly string[],
  active: string,
  main: string,
): string {
  const items = nav
    .map((label, i) => {
      const iy = y + 120 + i * 52;
      const on = label === active;
      return `
      <rect x="${x + 16}" y="${iy}" width="188" height="42" rx="10" fill="${on ? "#2563eb" : "transparent"}"/>
      <text x="${x + 40}" y="${iy + 27}" font-family="${FONT}" font-size="16" font-weight="${on ? 700 : 500}" fill="${on ? "#ffffff" : "#cbd5e1"}">${label}</text>`;
    })
    .join("");
  return `
  ${browserWindow(
    x,
    y,
    w,
    h,
    `app.${name.toLowerCase().replace(/\s+/g, "")}.example / ${active.toLowerCase()}`,
    `
    <rect x="${x + 1}" y="${y + 49}" width="220" height="${h - 50}" fill="#0f172a"/>
    <text x="${x + 28}" y="${y + 92}" font-family="${FONT}" font-size="22" font-weight="800" fill="#ffffff">${esc(name)}</text>
    ${items}
    <rect x="${x + 221}" y="${y + 49}" width="${w - 222}" height="${h - 50}" fill="#f8fafc"/>
    ${main}
    `,
  )}`;
}

function tableMock(
  name: string,
  nav: readonly string[],
  active: string,
  title: string,
  headers: string[],
  rows: string[][],
  bannerTitle: string,
  bannerBody: string,
): Buffer {
  const colW = Math.floor(1080 / Math.max(headers.length, 1));
  const headerRow = headers
    .map(
      (h, i) =>
        `<text x="${290 + i * colW}" y="265" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">${esc(h)}</text>`,
    )
    .join("");
  const bodyRows = rows
    .map((r, i) => {
      const y = 300 + i * 70;
      const cells = r
        .map(
          (c, j) =>
            `<text x="${290 + j * colW}" y="${y + 36}" font-family="${FONT}" font-size="${j === 0 ? 15 : 14}" font-weight="${j === 0 ? 700 : 500}" fill="${j === 0 ? "#0f172a" : "#475569"}">${esc(c)}</text>`,
        )
        .join("");
      return `
        <rect x="280" y="${y}" width="1080" height="58" rx="10" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>
        ${cells}`;
    })
    .join("");
  const main = `
    <text x="260" y="88" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(title)}</text>
    <rect x="260" y="120" width="1120" height="80" rx="14" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="290" y="170" font-family="${FONT}" font-size="16" font-weight="700" fill="#1e40af">${esc(name)} · prove the core loop before extras</text>
    <rect x="260" y="220" width="1120" height="460" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
    ${headerRow}
    ${bodyRows}`;
  return shell(
    W,
    H,
    `
    ${categoryAppShell(48, 36, 1440, 780, name, nav, active, main)}
    ${teachBanner(48, 860, 1440, bannerTitle, bannerBody, "#2563eb")}`,
  );
}

const AI_NAV = ["Home", "Chat", "Projects", "Credits", "Admin", "Settings"] as const;
const IT_NAV = ["Home", "Incidents", "Repos", "Monitors", "On-call", "Admin"] as const;

function aiChatThread(name: string): Buffer {
  return tableMock(
    name,
    AI_NAV,
    "Chat",
    `${name} · production prompt`,
    ["TURN", "ROLE", "STATUS", "OWNER"],
    [
      ["1", "User brief", "Sent", "Maya"],
      ["2", "Assistant draft", "Reviewed", "Maya"],
      ["3", "Revision", "Accepted", "Chris"],
      ["4", "Share to project", "Done", "Ops"],
    ],
    "Day-zero proof",
    `A non-admin finishes one ${name} prompt a manager can reopen.`,
  );
}

function aiProjectsBoard(name: string): Buffer {
  return tableMock(
    name,
    AI_NAV,
    "Projects",
    `${name} · projects / GPTs`,
    ["PROJECT", "FILES", "ACCESS", "OWNER"],
    [
      ["Q3 briefs", "4", "Team", "Maya"],
      ["Legal tone", "2", "Restricted", "Chris"],
      ["Support macros", "6", "Team", "Ops"],
      ["Archive", "—", "Admin", "Admin"],
    ],
    "Configure one loop",
    `One ${name} project beats a decorated empty workspace.`,
  );
}

function aiCreditsSheet(name: string): Buffer {
  return tableMock(
    name,
    AI_NAV,
    "Credits",
    `${name} · seats vs credits`,
    ["PLAN GATE", "SEATS", "CREDITS", "MUST?"],
    [
      ["Core chat", "8", "Included", "Yes"],
      ["Advanced model", "8", "Metered", "Maybe"],
      ["Admin / SSO", "Quote", "—", "Yes"],
      ["Image extras", "—", "Add-on", "No"],
    ],
    "Qualify packaging",
    `Map ${name} must-haves to seats and credits — not homepage tiles.`,
  );
}

function aiRaciBoard(name: string): Buffer {
  return tableMock(
    name,
    AI_NAV,
    "Home",
    `${name} · week-0 RACI`,
    ["ROLE", "NAME", "OWNS", "HRS / WK"],
    [
      ["Responsible", "Ops lead", "Seats · policy", "2.0"],
      ["Accountable", "Dept lead", "Outcomes", "1.0"],
      ["Consulted", "2 users", "Prompt friction", "0.5"],
      ["Informed", "IT admin", "SSO / DLP", "—"],
    ],
    "Before configuration",
    `Name Responsible + Accountable for ${name} before anyone burns credits.`,
  );
}

function aiFieldMap(name: string): Buffer {
  return tableMock(
    name,
    AI_NAV,
    "Admin",
    `${name} · migrate map`,
    ["SOURCE", "TARGET", "KEEP?", "OWNER"],
    [
      ["Custom GPTs", "Projects", "Yes", "Maya"],
      ["Chat history", "Export file", "Selective", "Ops"],
      ["Shared files", "Project files", "Yes", "Chris"],
      ["Orphan prompts", "Archive", "No", "Admin"],
    ],
    "Pilot before bulk",
    `Prove a small ${name} import before you move every project.`,
  );
}

function aiTrialProof(name: string): Buffer {
  return tableMock(
    name,
    AI_NAV,
    "Chat",
    `${name} · non-admin proof`,
    ["STEP", "ACTOR", "RESULT", "GATE"],
    [
      ["Run prompt", "Non-admin", "Output saved", "Pass"],
      ["Share thread", "Manager", "Can reopen", "Pass"],
      ["Admin-only?", "Admin", "Not required", "Pass"],
      ["Credits used", "Ops", "On-plan", "Check"],
    ],
    "Worth-it gate",
    `${name} is worth it when a non-admin can finish the loop on the package you will buy.`,
  );
}

function aiUsageDash(name: string): Buffer {
  return tableMock(
    name,
    AI_NAV,
    "Credits",
    `${name} · 30-day adoption`,
    ["TEAM", "ACTIVE", "PROMPTS", "STATUS"],
    [
      ["Content", "8/8", "142", "Healthy"],
      ["Sales", "3/6", "18", "Watch"],
      ["Ops", "2/4", "9", "Watch"],
      ["IT", "1/2", "4", "Idle"],
    ],
    "Adoption before extras",
    `If weekly users will not open ${name}, extra add-ons will not save the rollout.`,
  );
}

function aiPilotImport(name: string): Buffer {
  return tableMock(
    name,
    AI_NAV,
    "Admin",
    `${name} · pilot import`,
    ["BATCH", "OBJECTS", "ERRORS", "NEXT"],
    [
      ["Pilot A", "12 projects", "0", "Validate"],
      ["Pilot B", "40 threads", "3 map", "Fix"],
      ["Hold", "Orphans", "—", "Skip"],
      ["Bulk", "—", "Blocked", "Wait"],
    ],
    "Dual-run week",
    `Do not cut over ${name} until the pilot batch can finish the core loop.`,
  );
}

const AI_ART: Record<CrmProductGuideKind, KindArt> = {
  implementation: {
    hero: (name) => aiRaciBoard(name),
    figure: (name) => aiProjectsBoard(name),
    panels: (name) => [
      aiChatThread(name),
      aiCreditsSheet(name),
      aiUsageDash(name),
      aiTrialProof(name),
    ],
  },
  setup: {
    hero: (name) => aiChatThread(name),
    figure: (name) => aiProjectsBoard(name),
    panels: (name) => [
      aiCreditsSheet(name),
      aiRaciBoard(name),
      aiTrialProof(name),
      aiUsageDash(name),
    ],
  },
  migration: {
    hero: (name) => aiFieldMap(name),
    figure: (name) => aiPilotImport(name),
    panels: (name) => [
      aiProjectsBoard(name),
      aiChatThread(name),
      aiUsageDash(name),
      aiCreditsSheet(name),
    ],
  },
  plans: {
    hero: (name) => aiCreditsSheet(name),
    figure: (name) => aiUsageDash(name),
    panels: (name) => [
      aiRaciBoard(name),
      aiTrialProof(name),
      aiProjectsBoard(name),
      aiChatThread(name),
    ],
  },
  "worth-it": {
    hero: (name) => aiTrialProof(name),
    figure: (name) => aiChatThread(name),
    panels: (name) => [
      aiCreditsSheet(name),
      aiProjectsBoard(name),
      aiUsageDash(name),
      aiRaciBoard(name),
    ],
  },
};

function itIncidentBoard(name: string): Buffer {
  return tableMock(
    name,
    IT_NAV,
    "Incidents",
    `${name} · incident queue`,
    ["ID", "PRIORITY", "STATE", "OWNER"],
    [
      ["INC-1042", "P2", "Assigned", "Maya"],
      ["INC-1043", "P3", "Waiting", "Chris"],
      ["CHG-88", "Normal", "CAB", "Ops"],
      ["REQ-12", "Low", "Portal", "User"],
    ],
    "Core IT loop",
    `A ${name} agent can resolve one ticket a requester can see.`,
  );
}

function itRepoBoard(name: string): Buffer {
  return tableMock(
    name,
    IT_NAV,
    "Repos",
    `${name} · source control`,
    ["REPO", "PR", "CI", "OWNER"],
    [
      ["api-core", "#184", "Green", "Lee"],
      ["web-app", "#91", "Running", "Sam"],
      ["infra", "#12", "Green", "Ops"],
      ["docs", "#3", "—", "Maya"],
    ],
    "Not Copilot",
    `${name} source-control proof is a PR with CI — Copilot is a different product.`,
  );
}

function itMonitorBoard(name: string): Buffer {
  return tableMock(
    name,
    IT_NAV,
    "Monitors",
    `${name} · observability`,
    ["SERVICE", "SIGNAL", "SLO", "ALERT"],
    [
      ["checkout-api", "Trace", "99.5%", "Page"],
      ["worker", "Logs", "95%", "Ticket"],
      ["edge", "Metrics", "99.9%", "Watch"],
      ["batch", "Logs", "—", "Off"],
    ],
    "Instrument one service",
    `Prove ${name} with a real metric, trace, or log before buying extra packs.`,
  );
}

function itOncallBoard(name: string): Buffer {
  return tableMock(
    name,
    IT_NAV,
    "On-call",
    `${name} · escalation`,
    ["LAYER", "PERSON", "WINDOW", "ACK"],
    [
      ["Primary", "Avery", "Week A", "Yes"],
      ["Secondary", "Jordan", "Week A", "—"],
      ["Manager", "Chris", "Always", "—"],
      ["Vendor", "—", "P1 only", "No"],
    ],
    "On-call is not ingest",
    `${name} pages a human. Observability ingest is a different job.`,
  );
}

function itRaciBoard(name: string): Buffer {
  return tableMock(
    name,
    IT_NAV,
    "Home",
    `${name} · week-0 RACI`,
    ["ROLE", "NAME", "OWNS", "HRS / WK"],
    [
      ["Responsible", "IT owner", "Config · access", "3.0"],
      ["Accountable", "Eng/IT lead", "Outcomes", "1.0"],
      ["Consulted", "2 operators", "Loop friction", "0.5"],
      ["Informed", "Security", "SSO / audit", "—"],
    ],
    "Before configuration",
    `Name Responsible + Accountable for ${name} before week-one sprawl.`,
  );
}

function itFieldMap(name: string): Buffer {
  return tableMock(
    name,
    IT_NAV,
    "Admin",
    `${name} · migrate map`,
    ["SOURCE", "TARGET", "KEEP?", "OWNER"],
    [
      ["Open tickets", "Incidents", "Yes", "Maya"],
      ["Repos", "Projects", "Yes", "Lee"],
      ["Monitors", "Alerts", "Selective", "SRE"],
      ["Orphans", "Archive", "No", "Admin"],
    ],
    "Pilot before bulk",
    `Prove a small ${name} import before you move the whole estate.`,
  );
}

function itTrialProof(name: string): Buffer {
  return tableMock(
    name,
    IT_NAV,
    "Home",
    `${name} · non-admin proof`,
    ["STEP", "ACTOR", "RESULT", "GATE"],
    [
      ["Run loop", "Operator", "Done", "Pass"],
      ["Peer sees it", "Lead", "Visible", "Pass"],
      ["Admin-only?", "Admin", "Not required", "Pass"],
      ["On qualifying plan", "Ops", "Written", "Check"],
    ],
    "Worth-it gate",
    `${name} is worth it when an operator can finish the loop on the package you will buy.`,
  );
}

function itUsageDash(name: string): Buffer {
  return tableMock(
    name,
    IT_NAV,
    "Admin",
    `${name} · 30-day adoption`,
    ["TEAM", "ACTIVE", "LOOP", "STATUS"],
    [
      ["IT ops", "6/6", "Tickets", "Healthy"],
      ["Eng", "8/10", "PRs / traces", "Healthy"],
      ["SRE", "3/4", "Pages", "Watch"],
      ["Finance", "0/2", "—", "Idle"],
    ],
    "Adoption before extras",
    `If weekly operators will not open ${name}, extra modules will not save the rollout.`,
  );
}

const IT_ART: Record<CrmProductGuideKind, KindArt> = {
  implementation: {
    hero: (name) => itRaciBoard(name),
    figure: (name) => itIncidentBoard(name),
    panels: (name) => [
      itRepoBoard(name),
      itMonitorBoard(name),
      itOncallBoard(name),
      itUsageDash(name),
    ],
  },
  setup: {
    hero: (name) => itIncidentBoard(name),
    figure: (name) => itRepoBoard(name),
    panels: (name) => [
      itMonitorBoard(name),
      itOncallBoard(name),
      itTrialProof(name),
      itRaciBoard(name),
    ],
  },
  migration: {
    hero: (name) => itFieldMap(name),
    figure: (name) => itTrialProof(name),
    panels: (name) => [
      itIncidentBoard(name),
      itRepoBoard(name),
      itMonitorBoard(name),
      itUsageDash(name),
    ],
  },
  plans: {
    hero: (name) => itUsageDash(name),
    figure: (name) => itOncallBoard(name),
    panels: (name) => [
      itRaciBoard(name),
      itIncidentBoard(name),
      itRepoBoard(name),
      itTrialProof(name),
    ],
  },
  "worth-it": {
    hero: (name) => itTrialProof(name),
    figure: (name) => itIncidentBoard(name),
    panels: (name) => [
      itRepoBoard(name),
      itMonitorBoard(name),
      itOncallBoard(name),
      itRaciBoard(name),
    ],
  },
};

const HR_NAV = [
  "Home",
  "People",
  "Schedule",
  "Time",
  "Payroll",
  "Admin",
] as const;
const PM_NAV = [
  "Home",
  "Board",
  "Timeline",
  "Tasks",
  "Team",
  "Settings",
] as const;

function hrPeopleBoard(name: string): Buffer {
  return tableMock(
    name,
    HR_NAV,
    "People",
    `${name} · people directory`,
    ["NAME", "ROLE", "LOCATION", "STATUS"],
    [
      ["Priya Chen", "Ops lead", "NYC", "Active"],
      ["Jordan Lee", "Field tech", "Remote", "Active"],
      ["Chris Park", "HR admin", "HQ", "Active"],
      ["Sam Rivera", "Contractor", "Austin", "Pending"],
    ],
    "Core HR loop",
    `A manager finds one person in ${name} and sees the fields they trust.`,
  );
}

function hrScheduleBoard(name: string): Buffer {
  return tableMock(
    name,
    HR_NAV,
    "Schedule",
    `${name} · weekly shifts`,
    ["SHIFT", "ROLE", "SITE", "COVERED"],
    [
      ["Mon AM", "Front desk", "HQ", "Yes"],
      ["Mon PM", "Support", "Remote", "Yes"],
      ["Tue AM", "Field", "Route A", "Gap"],
      ["Wed AM", "Training", "HQ", "Yes"],
    ],
    "Schedule before payroll",
    `Prove ${name} shift coverage before you wire pay rules.`,
  );
}

function hrTimeBoard(name: string): Buffer {
  return tableMock(
    name,
    HR_NAV,
    "Time",
    `${name} · attendance queue`,
    ["EMPLOYEE", "CLOCK", "HOURS", "EXCEPTION"],
    [
      ["Jordan Lee", "07:58", "7.5", "—"],
      ["Priya Chen", "08:02", "8.0", "—"],
      ["Sam Rivera", "—", "0", "Missing"],
      ["Chris Park", "09:10", "7.2", "Late"],
    ],
    "Time is the trust layer",
    `Operators approve hours in ${name} before payroll export.`,
  );
}

function hrOnboardingBoard(name: string): Buffer {
  return tableMock(
    name,
    HR_NAV,
    "People",
    `${name} · onboarding checklist`,
    ["TASK", "OWNER", "DUE", "STATE"],
    [
      ["Profile + docs", "HR", "Day 1", "Done"],
      ["Benefits enroll", "Employee", "Day 3", "Open"],
      ["Manager intro", "Lead", "Week 1", "Done"],
      ["System access", "IT", "Day 2", "Blocked"],
    ],
    "Day-zero setup",
    `Week-one ${name} setup is one hire completing the checklist.`,
  );
}

function hrFieldMap(name: string): Buffer {
  return tableMock(
    name,
    HR_NAV,
    "Admin",
    `${name} · migrate map`,
    ["SOURCE", "TARGET", "KEEP?", "OWNER"],
    [
      ["Employees", "People", "Yes", "HR"],
      ["Timesheets", "Time", "Yes", "Ops"],
      ["Schedules", "Shifts", "Selective", "Lead"],
      ["Orphans", "Archive", "No", "Admin"],
    ],
    "Pilot before bulk",
    `Prove a small ${name} import before you move the whole roster.`,
  );
}

function hrRaciBoard(name: string): Buffer {
  return tableMock(
    name,
    HR_NAV,
    "Home",
    `${name} · week-0 RACI`,
    ["ROLE", "NAME", "OWNS", "HRS / WK"],
    [
      ["Responsible", "HR owner", "Fields · users", "3.0"],
      ["Accountable", "Ops lead", "Outcomes", "1.0"],
      ["Consulted", "Payroll", "Exports", "0.5"],
      ["Informed", "Managers", "Adoption", "—"],
    ],
    "Before configuration",
    `Name Responsible + Accountable for ${name} before week-one sprawl.`,
  );
}

function hrPlansMatrix(name: string): Buffer {
  return tableMock(
    name,
    HR_NAV,
    "Admin",
    `${name} · plan must-haves`,
    ["MUST-HAVE", "MIN PLAN", "SEATS", "NOTES"],
    [
      ["Time tracking", "Pro", "25", "GPS ok"],
      ["Scheduling", "Pro", "25", "Mobile"],
      ["Payroll sync", "Plus", "50", "Export"],
      ["SSO", "Enterprise", "100", "Security"],
    ],
    "Map must-haves first",
    `Shortlist ${name} tiers on researched limits — not brochure tiles.`,
  );
}

function hrTrialProof(name: string): Buffer {
  return tableMock(
    name,
    HR_NAV,
    "Home",
    `${name} · operator proof`,
    ["STEP", "ACTOR", "RESULT", "GATE"],
    [
      ["Clock shift", "Employee", "Logged", "Pass"],
      ["Manager approves", "Lead", "Visible", "Pass"],
      ["Export hours", "Payroll", "CSV ok", "Pass"],
      ["On qualifying plan", "HR", "Written", "Check"],
    ],
    "Worth-it gate",
    `${name} is worth it when an operator finishes the HR loop on the plan you will buy.`,
  );
}

function hrAdoptionDash(name: string): Buffer {
  return tableMock(
    name,
    HR_NAV,
    "Admin",
    `${name} · 30-day adoption`,
    ["TEAM", "ACTIVE", "LOOP", "STATUS"],
    [
      ["HQ staff", "18/20", "Time", "Healthy"],
      ["Field", "12/14", "Schedule", "Healthy"],
      ["Managers", "6/8", "Approvals", "Watch"],
      ["Payroll", "2/2", "Export", "Healthy"],
    ],
    "Adoption before extras",
    `If weekly operators will not open ${name}, extra modules will not save the rollout.`,
  );
}

const HR_ART: Record<CrmProductGuideKind, KindArt> = {
  implementation: {
    hero: (name) => hrRaciBoard(name),
    figure: (name) => hrPeopleBoard(name),
    panels: (name) => [
      hrScheduleBoard(name),
      hrTimeBoard(name),
      hrOnboardingBoard(name),
      hrAdoptionDash(name),
    ],
  },
  setup: {
    hero: (name) => hrOnboardingBoard(name),
    figure: (name) => hrPeopleBoard(name),
    panels: (name) => [
      hrScheduleBoard(name),
      hrTimeBoard(name),
      hrTrialProof(name),
      hrRaciBoard(name),
    ],
  },
  migration: {
    hero: (name) => hrFieldMap(name),
    figure: (name) => hrPeopleBoard(name),
    panels: (name) => [
      hrScheduleBoard(name),
      hrTimeBoard(name),
      hrAdoptionDash(name),
      hrTrialProof(name),
    ],
  },
  plans: {
    hero: (name) => hrPlansMatrix(name),
    figure: (name) => hrTimeBoard(name),
    panels: (name) => [
      hrRaciBoard(name),
      hrScheduleBoard(name),
      hrPeopleBoard(name),
      hrTrialProof(name),
    ],
  },
  "worth-it": {
    hero: (name) => hrTrialProof(name),
    figure: (name) => hrScheduleBoard(name),
    panels: (name) => [
      hrPeopleBoard(name),
      hrTimeBoard(name),
      hrAdoptionDash(name),
      hrRaciBoard(name),
    ],
  },
};

function pmBoardView(name: string): Buffer {
  return tableMock(
    name,
    PM_NAV,
    "Board",
    `${name} · delivery board`,
    ["CARD", "OWNER", "COLUMN", "DUE"],
    [
      ["Launch checklist", "Maya", "Doing", "Fri"],
      ["API hardening", "Lee", "Review", "Thu"],
      ["Client onboarding", "Chris", "Backlog", "Next wk"],
      ["Retro notes", "Sam", "Done", "—"],
    ],
    "Core work loop",
    `A teammate moves one card in ${name} and everyone sees the update.`,
  );
}

function pmTimelineView(name: string): Buffer {
  return tableMock(
    name,
    PM_NAV,
    "Timeline",
    `${name} · milestone map`,
    ["MILESTONE", "OWNER", "WINDOW", "RISK"],
    [
      ["Scope freeze", "PM", "Week 2", "Low"],
      ["Pilot build", "Eng", "Week 4", "Med"],
      ["UAT window", "Ops", "Week 6", "Med"],
      ["Go-live", "All", "Week 8", "Watch"],
    ],
    "Timeline before tasks",
    `Freeze ${name} milestones before you open the task backlog.`,
  );
}

function pmTaskDetail(name: string): Buffer {
  return tableMock(
    name,
    PM_NAV,
    "Tasks",
    `${name} · task detail`,
    ["FIELD", "VALUE", "OWNER", "STATUS"],
    [
      ["Title", "Vendor contract", "Legal", "Open"],
      ["Dependency", "Budget sign-off", "Finance", "Blocked"],
      ["Estimate", "3 days", "PM", "Set"],
      ["Proof", "Attachment", "Ops", "Missing"],
    ],
    "One task, one owner",
    `${name} tasks need a named owner — not a shared inbox.`,
  );
}

function pmSprintBoard(name: string): Buffer {
  return tableMock(
    name,
    PM_NAV,
    "Board",
    `${name} · sprint board`,
    ["STORY", "POINTS", "ASSIGNEE", "STATE"],
    [
      ["Auth hardening", "5", "Lee", "Doing"],
      ["Mobile polish", "3", "Sam", "Review"],
      ["Docs refresh", "2", "Maya", "Todo"],
      ["Bug sweep", "1", "Chris", "Done"],
    ],
    "Sprint scope",
    `Keep ${name} sprint scope small enough to demo Friday.`,
  );
}

function pmFieldMap(name: string): Buffer {
  return tableMock(
    name,
    PM_NAV,
    "Settings",
    `${name} · migrate map`,
    ["SOURCE", "TARGET", "KEEP?", "OWNER"],
    [
      ["Projects", "Spaces", "Yes", "PM"],
      ["Tasks", "Cards", "Yes", "Ops"],
      ["Custom fields", "Properties", "Selective", "Admin"],
      ["Archived", "Archive", "No", "PM"],
    ],
    "Pilot before bulk",
    `Prove a small ${name} import before you move every project.`,
  );
}

function pmRaciBoard(name: string): Buffer {
  return tableMock(
    name,
    PM_NAV,
    "Home",
    `${name} · week-0 RACI`,
    ["ROLE", "NAME", "OWNS", "HRS / WK"],
    [
      ["Responsible", "PM owner", "Board · fields", "3.0"],
      ["Accountable", "Delivery lead", "Outcomes", "1.0"],
      ["Consulted", "2 leads", "Workflow", "0.5"],
      ["Informed", "Exec", "Status", "—"],
    ],
    "Before configuration",
    `Name Responsible + Accountable for ${name} before week-one sprawl.`,
  );
}

function pmPlansMatrix(name: string): Buffer {
  return tableMock(
    name,
    PM_NAV,
    "Settings",
    `${name} · plan must-haves`,
    ["MUST-HAVE", "MIN PLAN", "SEATS", "NOTES"],
    [
      ["Timeline view", "Pro", "15", "Gantt"],
      ["Automations", "Pro", "15", "Rules"],
      ["Portfolio", "Business", "50", "Roll-up"],
      ["SSO", "Enterprise", "100", "Security"],
    ],
    "Map must-haves first",
    `Shortlist ${name} tiers on researched limits — not brochure tiles.`,
  );
}

function pmTrialProof(name: string): Buffer {
  return tableMock(
    name,
    PM_NAV,
    "Home",
    `${name} · operator proof`,
    ["STEP", "ACTOR", "RESULT", "GATE"],
    [
      ["Create task", "Contributor", "Logged", "Pass"],
      ["Move card", "Lead", "Visible", "Pass"],
      ["Status report", "PM", "Shared", "Pass"],
      ["On qualifying plan", "Ops", "Written", "Check"],
    ],
    "Worth-it gate",
    `${name} is worth it when a contributor finishes the work loop on the plan you will buy.`,
  );
}

function pmTeamCapacity(name: string): Buffer {
  return tableMock(
    name,
    PM_NAV,
    "Team",
    `${name} · capacity sheet`,
    ["PERSON", "LOAD", "AVAILABLE", "FLAG"],
    [
      ["Maya", "32h", "8h", "—"],
      ["Lee", "40h", "0h", "Full"],
      ["Chris", "24h", "16h", "—"],
      ["Sam", "36h", "4h", "Watch"],
    ],
    "Capacity before dates",
    `Check ${name} load before you promise another milestone.`,
  );
}

const PM_ART: Record<CrmProductGuideKind, KindArt> = {
  implementation: {
    hero: (name) => pmRaciBoard(name),
    figure: (name) => pmBoardView(name),
    panels: (name) => [
      pmTimelineView(name),
      pmTaskDetail(name),
      pmSprintBoard(name),
      pmTeamCapacity(name),
    ],
  },
  setup: {
    hero: (name) => pmBoardView(name),
    figure: (name) => pmTimelineView(name),
    panels: (name) => [
      pmTaskDetail(name),
      pmSprintBoard(name),
      pmTrialProof(name),
      pmRaciBoard(name),
    ],
  },
  migration: {
    hero: (name) => pmFieldMap(name),
    figure: (name) => pmBoardView(name),
    panels: (name) => [
      pmTimelineView(name),
      pmTaskDetail(name),
      pmTeamCapacity(name),
      pmTrialProof(name),
    ],
  },
  plans: {
    hero: (name) => pmPlansMatrix(name),
    figure: (name) => pmTeamCapacity(name),
    panels: (name) => [
      pmRaciBoard(name),
      pmBoardView(name),
      pmTimelineView(name),
      pmTrialProof(name),
    ],
  },
  "worth-it": {
    hero: (name) => pmTrialProof(name),
    figure: (name) => pmSprintBoard(name),
    panels: (name) => [
      pmBoardView(name),
      pmTimelineView(name),
      pmTeamCapacity(name),
      pmRaciBoard(name),
    ],
  },
};

const ECOM_NAV = [
  "Home",
  "Catalog",
  "Orders",
  "Inventory",
  "Channels",
  "Apps",
] as const;

function ecomCatalogBoard(name: string): Buffer {
  return tableMock(
    name,
    ECOM_NAV,
    "Catalog",
    `${name} · SKU workbook`,
    ["SKU", "VARIANT", "CHANNEL", "OWNER"],
    [
      ["TEE-NAVY", "M / Navy", "Storefront", "Maya"],
      ["MUG-12", "12 oz", "POS", "Chris"],
      ["BUNDLE-STARTER", "3 SKU", "Draft", "Ops"],
      ["GIFT-CARD", "Digital", "Storefront", "Finance"],
    ],
    "Catalog before theme extras",
    `One ${name} SKU a picker can fulfill beats a decorated empty theme.`,
  );
}

function ecomOrdersBoard(name: string): Buffer {
  return tableMock(
    name,
    ECOM_NAV,
    "Orders",
    `${name} · order queue`,
    ["ORDER", "STATE", "CHANNEL", "OWNER"],
    [
      ["#1042", "Paid", "Storefront", "Maya"],
      ["#1043", "Pick", "POS", "Chris"],
      ["#1044", "Hold", "Marketplace", "Ops"],
      ["#1045", "Refund", "Storefront", "Finance"],
    ],
    "Core commerce loop",
    `A ${name} order that a picker can finish is the only day-zero proof.`,
  );
}

function ecomInventoryBoard(name: string): Buffer {
  return tableMock(
    name,
    ECOM_NAV,
    "Inventory",
    `${name} · stock truth`,
    ["LOCATION", "ON HAND", "RESERVED", "OWNER"],
    [
      ["Warehouse A", "240", "18", "Maya"],
      ["POS drawer", "12", "2", "Chris"],
      ["3PL", "80", "0", "Ops"],
      ["Incoming PO", "60", "—", "Finance"],
    ],
    "Stock is the system of record",
    `If ${name} on-hand disagrees with the shelf, channels will oversell.`,
  );
}

function ecomChannelsBoard(name: string): Buffer {
  return tableMock(
    name,
    ECOM_NAV,
    "Channels",
    `${name} · channel map`,
    ["CHANNEL", "PRICE LIST", "SYNC", "OWNER"],
    [
      ["Hosted storefront", "Retail", "Live", "Maya"],
      ["POS", "Retail", "Live", "Chris"],
      ["Marketplace", "MAP", "Pilot", "Ops"],
      ["Wholesale", "Net-30", "Off", "Finance"],
    ],
    "One catalog, named channels",
    `Turn on a second ${name} channel only after the first can fulfill.`,
  );
}

function ecomAppsSheet(name: string): Buffer {
  return tableMock(
    name,
    ECOM_NAV,
    "Apps",
    `${name} · apps vs core`,
    ["ADD-ON", "JOB", "MUST?", "OWNER"],
    [
      ["Reviews", "Social proof", "Maybe", "Maya"],
      ["Subscriptions", "Reorder", "No", "Chris"],
      ["Tax", "Checkout", "Yes", "Finance"],
      ["Page builder", "Theme", "No", "Ops"],
    ],
    "Qualify packaging",
    `Map ${name} must-haves to checkout and fulfillment — not app-store tiles.`,
  );
}

function ecomSkuMap(name: string): Buffer {
  return tableMock(
    name,
    ECOM_NAV,
    "Catalog",
    `${name} · SKU field map`,
    ["LEGACY", `${name.toUpperCase().slice(0, 8)} FIELD`, "PILOT", "OWNER"],
    [
      ["Item code", "SKU", "Yes", "Maya"],
      ["Option 1", "Variant", "Yes", "Chris"],
      ["Qty", "On hand", "Yes", "Ops"],
      ["Blog tags", "—", "No", "Marketing"],
    ],
    "Pilot before bulk import",
    `Fix mapping on one ${name} seller book — then scale.`,
  );
}

function ecomCheckoutProof(name: string): Buffer {
  return tableMock(
    name,
    ECOM_NAV,
    "Orders",
    `${name} · checkout proof`,
    ["STEP", "WHO", "PASS?", "EVIDENCE"],
    [
      ["Add to cart", "Shopper", "Yes", "Cart #12"],
      ["Pay", "Shopper", "Yes", "Paid"],
      ["Pick / pack", "Ops", "Yes", "Label"],
      ["Theme animation", "Marketing", "No", "Defer"],
    ],
    "Proof beats demos",
    `Vendor tours do not count — ${name} is worth it when one order ships.`,
  );
}

function ecomRaciBoard(name: string): Buffer {
  return tableMock(
    name,
    ECOM_NAV,
    "Home",
    `${name} · rollout owners`,
    ["ROLE", "OWNS", "WEEK 1", "WEEK 4"],
    [
      ["Store admin", "Catalog + tax", "SKU sheet", "Live theme"],
      ["Ops", "Fulfillment", "One SKU", "SLA"],
      ["Finance", "Payouts", "Test charge", "Reconcile"],
      ["Marketing", "Campaigns", "Defer", "After proof"],
    ],
    "Owners before volume",
    `Orphan ${name} SKUs become silent oversell risk on week one.`,
  );
}

const ECOM_ART: Record<CrmProductGuideKind, KindArt> = {
  implementation: {
    hero: (name) => ecomRaciBoard(name),
    figure: (name) => ecomOrdersBoard(name),
    panels: (name) => [
      ecomCatalogBoard(name),
      ecomInventoryBoard(name),
      ecomChannelsBoard(name),
      ecomCheckoutProof(name),
    ],
  },
  setup: {
    hero: (name) => ecomCatalogBoard(name),
    figure: (name) => ecomChannelsBoard(name),
    panels: (name) => [
      ecomOrdersBoard(name),
      ecomInventoryBoard(name),
      ecomAppsSheet(name),
      ecomCheckoutProof(name),
    ],
  },
  migration: {
    hero: (name) => ecomSkuMap(name),
    figure: (name) => ecomInventoryBoard(name),
    panels: (name) => [
      ecomCatalogBoard(name),
      ecomOrdersBoard(name),
      ecomChannelsBoard(name),
      ecomCheckoutProof(name),
    ],
  },
  plans: {
    hero: (name) => ecomAppsSheet(name),
    figure: (name) => ecomOrdersBoard(name),
    panels: (name) => [
      ecomRaciBoard(name),
      ecomCatalogBoard(name),
      ecomChannelsBoard(name),
      ecomCheckoutProof(name),
    ],
  },
  "worth-it": {
    hero: (name) => ecomCheckoutProof(name),
    figure: (name) => ecomCatalogBoard(name),
    panels: (name) => [
      ecomOrdersBoard(name),
      ecomAppsSheet(name),
      ecomInventoryBoard(name),
      ecomRaciBoard(name),
    ],
  },
};

const CATEGORY_ART: Record<string, Record<CrmProductGuideKind, KindArt>> = {
  crm: ART,
  "sales-intelligence": SI_ART,
  "email-marketing": EM_ART,
  marketing: MARKETING_ART,
  "business-communications": BC_ART,
  ai: AI_ART,
  "it-development": IT_ART,
  ecommerce: ECOM_ART,
  hr: HR_ART,
  "project-management": PM_ART,
};

const PREMIUM_BYTES = 900_000;

/** Hub-grade PNG from unique UI SVG. Never clobber existing files ≥900 KB. */
async function writeHubGradePng(svg: Buffer, outPath: string): Promise<boolean> {
  if (fs.existsSync(outPath) && fs.statSync(outPath).size >= PREMIUM_BYTES) {
    return false;
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const safe = svg
    .toString("utf8")
    .replace(/&(?!(?:amp|lt|gt|quot);)/g, "&amp;");
  const { data, info } = await sharp(Buffer.from(safe))
    .resize(W, H, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const seedBuf = createHash("sha256").update(outPath).digest();
  let s = seedBuf.readUInt32BE(0) || 1;
  const amp = 6;
  const span = amp * 2 + 1;
  for (let i = 0; i < data.length; i += 4) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const n = (s % span) - amp;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 3, adaptiveFiltering: false })
    .toFile(outPath);
  return true;
}

async function writeProductV4(
  productSlug: string,
  artByKind: Record<CrmProductGuideKind, KindArt>,
): Promise<number> {
  const name = displayName(productSlug);
  let written = 0;
  for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
    const art = artByKind[kind];
    const base = productGuideSlug(productSlug, kind);
    const cover = publicPathToFs(`/guides/${base}-cover-v4.png`);
    const diagram = publicPathToFs(`/guides/${base}-diagram-v4.png`);
    if (await writeHubGradePng(art.hero(name), cover)) written += 1;
    if (await writeHubGradePng(art.figure(name), diagram)) written += 1;
  }
  return written;
}

async function mapPool<T>(
  items: T[],
  n: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.max(1, n) }, async () => {
      while (i < items.length) {
        const item = items[i++];
        if (item !== undefined) await fn(item);
      }
    }),
  );
}

async function promoteV4(onlySlugs: string[]): Promise<void> {
  const filterSlugs = (slugs: string[]): string[] =>
    onlySlugs.length === 0
      ? slugs
      : slugs.filter((slug) => onlySlugs.includes(slug));

  const jobs: Array<{
    productSlug: string;
    art: Record<CrmProductGuideKind, KindArt>;
  }> = [];
  const push = (
    slugs: string[],
    art: Record<CrmProductGuideKind, KindArt>,
  ) => {
    for (const productSlug of filterSlugs(slugs)) {
      jobs.push({ productSlug, art });
    }
  };

  if (onlySlugs.length > 0) {
    for (const productSlug of onlySlugs) {
      const ctx = loadProductGuideContext(productSlug);
      if (!ctx) {
        console.warn(`skip ${productSlug}: no product guide context`);
        continue;
      }
      const art = CATEGORY_ART[ctx.categorySlug];
      if (!art) {
        console.warn(
          `skip ${productSlug}: no art pool for category ${ctx.categorySlug}`,
        );
        continue;
      }
      jobs.push({ productSlug, art });
    }
  } else {
    push(listCrmProductGuideSlugs(), ART);
    push(listSiProductGuideSlugs(), SI_ART);
    push(listEmProductGuideSlugs(), EM_ART);
    push(listMarketingProductGuideSlugs(), MARKETING_ART);
    push(listBcProductGuideSlugs(), BC_ART);
    push(listAiProductGuideSlugs(), AI_ART);
    push(listItProductGuideSlugs(), IT_ART);
    push(listEcommerceProductGuideSlugs(), ECOM_ART);
    push(listHrProductGuideSlugs(), HR_ART);
    push(listPmProductGuideSlugs(), PM_ART);
  }

  let written = 0;
  let done = 0;
  await mapPool(jobs, 4, async ({ productSlug, art }) => {
    const n = await writeProductV4(productSlug, art);
    written += n;
    done += 1;
    if (done % 10 === 0 || done === jobs.length) {
      console.log(`promote-v4 ${done}/${jobs.length} products, wrote ${written}`);
    }
  });
  console.log(
    `Promoted ${written} cover/diagram v4 assets for ${jobs.length} products.`,
  );
}

function pruneV3(): void {
  const files = fs.readdirSync(OUT).filter((f) => f.includes("-v3") && f.endsWith(".png"));
  let deleted = 0;
  let kept = 0;
  for (const file of files) {
    const coverV4 = file
      .replace(/-cover-v3\.png$/, "-cover-v4.png")
      .replace(/-diagram-v3\.png$/, "-cover-v4.png")
      .replace(/-step-v3-\d+\.png$/, "-cover-v4.png");
    const coverPath = path.join(OUT, coverV4);
    const hasCover =
      coverV4 !== file &&
      fs.existsSync(coverPath) &&
      fs.statSync(coverPath).size >= PREMIUM_BYTES;
    if (!hasCover) {
      kept += 1;
      continue;
    }
    fs.unlinkSync(path.join(OUT, file));
    deleted += 1;
  }
  console.log(`Pruned ${deleted} v3 PNGs; kept ${kept} without a premium cover-v4.`);
}

async function writeProductVisuals(
  productSlug: string,
  artByKind: Record<CrmProductGuideKind, KindArt>,
): Promise<number> {
  // Do not emit SVG `-v3` placeholders — they fail the ~1 MB teaching-visual bar.
  return writeProductV4(productSlug, artByKind);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const rawArgs = process.argv.slice(2);
  const args = new Set(rawArgs);
  const onlySlugs = rawArgs.filter((a) => !a.startsWith("--"));
  if (args.has("--promote-v4")) {
    await promoteV4(onlySlugs);
    return;
  }
  if (args.has("--prune-v3")) {
    pruneV3();
    return;
  }
  const wantSi = args.has("--si") || args.has("--all");
  const wantEm = args.has("--em") || args.has("--all");
  const wantMarketing = args.has("--marketing") || args.has("--all");
  const wantBc = args.has("--bc") || args.has("--all");
  const wantPm = args.has("--pm") || args.has("--all");
  const wantAi = args.has("--ai") || args.has("--all");
  const wantIt = args.has("--it") || args.has("--all");
  const wantCrm =
    args.has("--crm") ||
    args.has("--all") ||
    (!args.has("--si") &&
      !args.has("--em") &&
      !args.has("--marketing") &&
      !args.has("--bc") &&
      !args.has("--pm") &&
      !args.has("--ai") &&
      !args.has("--it") &&
      !args.has("--all"));

  const filterSlugs = (slugs: string[]): string[] =>
    onlySlugs.length === 0
      ? slugs
      : slugs.filter((slug) => onlySlugs.includes(slug));

  let written = 0;
  let productCount = 0;

  if (wantCrm) {
    const slugs = filterSlugs(listCrmProductGuideSlugs());
    productCount += slugs.length;
    for (const productSlug of slugs) {
      written += await writeProductVisuals(productSlug, ART);
    }
  }

  if (wantSi) {
    const slugs = filterSlugs(listSiProductGuideSlugs());
    productCount += slugs.length;
    for (const productSlug of slugs) {
      written += await writeProductVisuals(productSlug, SI_ART);
    }
  }

  if (wantEm) {
    // SVG v3 placeholders only — prefer GenerateImage -v4 teaching visuals.
    const slugs = filterSlugs(listEmProductGuideSlugs());
    productCount += slugs.length;
    for (const productSlug of slugs) {
      written += await writeProductVisuals(productSlug, EM_ART);
    }
  }

  if (wantMarketing) {
    // SVG v3 placeholders only — prefer GenerateImage -v4 teaching visuals.
    const slugs = filterSlugs(listMarketingProductGuideSlugs());
    productCount += slugs.length;
    for (const productSlug of slugs) {
      written += await writeProductVisuals(productSlug, MARKETING_ART);
    }
  }

  if (wantBc) {
    // SVG v3 placeholders only — prefer GenerateImage -v4 teaching visuals.
    const slugs = filterSlugs(listBcProductGuideSlugs());
    productCount += slugs.length;
    for (const productSlug of slugs) {
      written += await writeProductVisuals(productSlug, BC_ART);
    }
  }

  if (wantPm) {
    // Do not emit SVG v3 for project-management — that path reused CRM pipeline ART
    // (wrong category chrome). Prefer GenerateImage `-v4` covers/diagrams/steps.
    console.log(
      "Skipping PM SVG v3 placeholders (wrong-category CRM ART). Use unique GenerateImage -v4 assets.",
    );
  }

  if (wantAi) {
    const slugs = filterSlugs(listAiProductGuideSlugs());
    productCount += slugs.length;
    for (const productSlug of slugs) {
      written += await writeProductVisuals(productSlug, AI_ART);
    }
  }

  if (wantIt) {
    const slugs = filterSlugs(listItProductGuideSlugs());
    productCount += slugs.length;
    for (const productSlug of slugs) {
      written += await writeProductVisuals(productSlug, IT_ART);
    }
  }

  console.log(
    `Wrote ${written} PNG assets under public/guides/ for ${productCount} products.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
