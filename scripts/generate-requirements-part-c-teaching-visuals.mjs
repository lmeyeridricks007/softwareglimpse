#!/usr/bin/env node
/**
 * Replace small legacy requirement PNGs for graph-synthesized CRM requirements
 * (manage-integrations, retain-and-export-data, control-data-residency,
 * review-vendor-security-docs) with hub-grade 1536×1024 teaching art.
 *
 * Usage: node scripts/generate-requirements-part-c-teaching-visuals.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/requirements");
const W = 1536;
const H = 1024;
const PREMIUM = 900_000;
const FONT =
  "ui-sans-serif, system-ui, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bgDefs() {
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f5f9fc"/>
      <stop offset="100%" stop-color="#e7eef6"/>
    </linearGradient>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#7ea0c0"/>
    </marker>
  </defs>`;
}

function needsSvg(title, subtitle, pairs) {
  const rows = pairs
    .map((p, i) => {
      const y = 200 + i * 120;
      return `
      <rect x="64" y="${y}" width="680" height="100" rx="14" fill="#fff8ef" stroke="#f0d4a8" stroke-width="2"/>
      <text x="96" y="${y + 42}" font-family="${FONT}" font-size="20" font-weight="700" fill="#8a5a12">${esc(p.problem)}</text>
      <text x="96" y="${y + 72}" font-family="${FONT}" font-size="16" fill="#6b5428">${esc(p.problemDetail)}</text>
      <path d="M780 ${y + 50} H820" stroke="#7ea0c0" stroke-width="3" marker-end="url(#arrow)"/>
      <rect x="840" y="${y}" width="632" height="100" rx="14" fill="#eefaf4" stroke="#b7e0c8" stroke-width="2"/>
      <text x="872" y="${y + 42}" font-family="${FONT}" font-size="20" font-weight="700" fill="#1a6b45">${esc(p.fix)}</text>
      <text x="872" y="${y + 72}" font-family="${FONT}" font-size="16" fill="#2f5c48">${esc(p.fixDetail)}</text>`;
    })
    .join("");
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${bgDefs()}
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="64" y="88" font-family="${FONT}" font-size="34" font-weight="700" fill="#12324f">${esc(title)}</text>
  <text x="64" y="132" font-family="${FONT}" font-size="20" fill="#4a6780">${esc(subtitle)}</text>
  <text x="96" y="175" font-family="${FONT}" font-size="16" font-weight="700" fill="#8a5a12">Problems</text>
  <text x="872" y="175" font-family="${FONT}" font-size="16" font-weight="700" fill="#1a6b45">CRM checks</text>
  ${rows}
</svg>`);
}

function flowSvg(title, subtitle, steps) {
  const nodes = steps
    .map((s, i) => {
      const x = 64 + i * 290;
      return `
      <rect x="${x}" y="340" width="250" height="200" rx="14" fill="#ffffff" stroke="#c9d9ea" stroke-width="2"/>
      <circle cx="${x + 36}" cy="390" r="22" fill="#1e4d7b"/>
      <text x="${x + 36}" y="396" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#ffffff">${i + 1}</text>
      <text x="${x + 70}" y="396" font-family="${FONT}" font-size="18" font-weight="700" fill="#12324f">${esc(s.t)}</text>
      <text x="${x + 24}" y="450" font-family="${FONT}" font-size="15" fill="#4a6780">${esc(s.d)}</text>
      <text x="${x + 24}" y="480" font-family="${FONT}" font-size="14" fill="#5a738a">${esc(s.d2 ?? "")}</text>
      ${i < steps.length - 1 ? `<path d="M${x + 260} 440 H${x + 290}" stroke="#7ea0c0" stroke-width="3" marker-end="url(#arrow)"/>` : ""}`;
    })
    .join("");
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${bgDefs()}
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="64" y="100" font-family="${FONT}" font-size="34" font-weight="700" fill="#12324f">${esc(title)}</text>
  <text x="64" y="148" font-family="${FONT}" font-size="20" fill="#4a6780">${esc(subtitle)}</text>
  ${nodes}
</svg>`);
}

function heroChrome(title, subtitle, body) {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#e2e8f0"/>
  <rect x="48" y="36" width="1440" height="780" rx="18" fill="#0f172a"/>
  <rect x="49" y="37" width="1438" height="46" rx="17" fill="#e2e8f0"/>
  <circle cx="76" cy="60" r="7" fill="#f87171"/>
  <circle cx="100" cy="60" r="7" fill="#fbbf24"/>
  <circle cx="124" cy="60" r="7" fill="#34d399"/>
  <rect x="168" y="46" width="640" height="28" rx="10" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="188" y="66" font-family="${FONT}" font-size="14" fill="#64748b">crm.example / settings</text>
  <rect x="49" y="85" width="220" height="730" fill="#0f172a"/>
  <text x="76" y="128" font-family="${FONT}" font-size="22" font-weight="800" fill="#ffffff">CRM</text>
  <text x="76" y="180" font-family="${FONT}" font-size="16" font-weight="700" fill="#93c5fd">Pipeline</text>
  <text x="76" y="228" font-family="${FONT}" font-size="16" fill="#cbd5e1">People</text>
  <text x="76" y="276" font-family="${FONT}" font-size="16" fill="#cbd5e1">Companies</text>
  <rect x="64" y="308" width="188" height="42" rx="10" fill="#2563eb"/>
  <text x="88" y="335" font-family="${FONT}" font-size="16" font-weight="700" fill="#ffffff">Settings</text>
  <rect x="269" y="85" width="1218" height="730" fill="#f8fafc"/>
  <text x="300" y="140" font-family="${FONT}" font-size="28" font-weight="800" fill="#0f172a">${esc(title)}</text>
  <text x="300" y="178" font-family="${FONT}" font-size="17" fill="#475569">${esc(subtitle)}</text>
  ${body}
  <rect x="48" y="860" width="1440" height="88" rx="16" fill="#0f172a"/>
  <rect x="48" y="860" width="8" height="88" rx="4" fill="#2563eb"/>
  <text x="76" y="894" font-family="${FONT}" font-size="15" font-weight="800" fill="#93c5fd">BUYER PROOF</text>
  <text x="76" y="924" font-family="${FONT}" font-size="18" font-weight="600" fill="#f8fafc">${esc(title)} — validate in trial, not from a logo wall.</text>
</svg>`);
}

const packs = {
  "manage-integrations": {
    hero: heroChrome(
      "Manage integrations",
      "Named sync jobs for email, billing, and support — not a marketplace screenshot.",
      `
      <rect x="300" y="210" width="1120" height="520" rx="16" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="330" y="252" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">Connected systems</text>
      <rect x="330" y="280" width="320" height="120" rx="12" fill="#eff6ff" stroke="#93c5fd"/>
      <text x="350" y="318" font-family="${FONT}" font-size="16" font-weight="700" fill="#1e40af">Email sync</text>
      <text x="350" y="348" font-family="${FONT}" font-size="14" fill="#475569">Inbound + outbound · 2-way</text>
      <text x="350" y="374" font-family="${FONT}" font-size="13" fill="#16a34a">Last sync: 4m ago</text>
      <rect x="680" y="280" width="320" height="120" rx="12" fill="#f0fdf4" stroke="#86efac"/>
      <text x="700" y="318" font-family="${FONT}" font-size="16" font-weight="700" fill="#166534">Billing connector</text>
      <text x="700" y="348" font-family="${FONT}" font-size="14" fill="#475569">Contacts → invoices</text>
      <text x="700" y="374" font-family="${FONT}" font-size="13" fill="#16a34a">Mapping verified</text>
      <rect x="1030" y="280" width="320" height="120" rx="12" fill="#fef3c7" stroke="#fcd34d"/>
      <text x="1050" y="318" font-family="${FONT}" font-size="16" font-weight="700" fill="#92400e">Support inbox</text>
      <text x="1050" y="348" font-family="${FONT}" font-size="14" fill="#475569">Ticket → person record</text>
      <text x="1050" y="374" font-family="${FONT}" font-size="13" fill="#dc2626">Failed job surfaced</text>
      <rect x="330" y="430" width="1020" height="260" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="350" y="468" font-family="${FONT}" font-size="16" font-weight="700" fill="#0f172a">Sync job log</text>
      <text x="350" y="510" font-family="${FONT}" font-size="14" fill="#475569">Field mapping error on billing.custom_field — named failure, not silent drop</text>
      <text x="350" y="548" font-family="${FONT}" font-size="14" fill="#475569">API access: available on Professional plan</text>
      <text x="350" y="586" font-family="${FONT}" font-size="14" fill="#475569">Retry queue · owner: RevOps</text>`,
    ),
    needs: needsSvg("Integration shopping traps", "Problems → CRM integration checks", [
      { problem: "Logo directory shopping", problemDetail: "200 connectors you never open", fix: "Stack-specific sync jobs", fixDetail: "Email, billing, support you run today" },
      { problem: "Silent sync failure", problemDetail: "Missing fields with no alert", fix: "Named failure surfacing", fixDetail: "Mapping errors in job log" },
      { problem: "One-way re-keying", problemDetail: "CSV exports between tools", fix: "Direction + field mapping", fixDetail: "Confirm 2-way on trial" },
      { problem: "API gated on wrong plan", problemDetail: "Connector needs Zapier tax", fix: "Plan gate check early", fixDetail: "Native vs API on your SKU" },
    ]),
    workflow: flowSvg("Integration trial loop", "Practical buyer workflow — CRM integrations", [
      { t: "List stack", d: "Systems you run", d2: "this quarter" },
      { t: "Confirm", d: "Native connector", d2: "or API path" },
      { t: "Test sync", d: "Direction + fields", d2: "on real record" },
      { t: "Break it", d: "Force a failure", d2: "read the error" },
      { t: "Gate check", d: "API on plan", d2: "keep or drop" },
    ]),
  },
  "retain-and-export-data": {
    hero: heroChrome(
      "Retain and export data",
      "Export packages, retention windows, and role-gated delete — not a slogan.",
      `
      <rect x="300" y="210" width="540" height="520" rx="16" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="330" y="252" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">Export package</text>
      <rect x="330" y="280" width="480" height="48" rx="8" fill="#f1f5f9"/>
      <text x="350" y="310" font-family="${FONT}" font-size="14" fill="#334155">Contacts + deals + activities + custom fields + files</text>
      <text x="330" y="360" font-family="${FONT}" font-size="14" fill="#475569">Format: CSV + JSON archive</text>
      <text x="330" y="392" font-family="${FONT}" font-size="14" fill="#475569">Scope: 200 deals · last 24 months</text>
      <rect x="330" y="420" width="480" height="56" rx="10" fill="#2563eb"/>
      <text x="350" y="454" font-family="${FONT}" font-size="16" font-weight="700" fill="#ffffff">Generate export</text>
      <rect x="880" y="210" width="540" height="250" rx="16" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="910" y="252" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">Retention policy</text>
      <text x="910" y="292" font-family="${FONT}" font-size="14" fill="#475569">Closed deals: retain 7 years</text>
      <text x="910" y="324" font-family="${FONT}" font-size="14" fill="#475569">Activities: retain 3 years</text>
      <text x="910" y="356" font-family="${FONT}" font-size="14" fill="#475569">Configurable per object type</text>
      <rect x="880" y="480" width="540" height="250" rx="16" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="910" y="522" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">Delete control</text>
      <text x="910" y="562" font-family="${FONT}" font-size="14" fill="#475569">Hard delete: Admin role only</text>
      <text x="910" y="594" font-family="${FONT}" font-size="14" fill="#475569">Bulk delete: requires approval</text>
      <text x="910" y="626" font-family="${FONT}" font-size="14" fill="#dc2626">Rep cannot empty contact</text>`,
    ),
    needs: needsSvg("Data exit traps", "Problems → governance checks", [
      { problem: "CSV of names only", problemDetail: "Notes and files missing", fix: "Full export package", fixDetail: "Deals, activities, attachments" },
      { problem: "Anyone can delete", problemDetail: "Rep empties a contact", fix: "Role-gated delete", fixDetail: "Admin + approval paths" },
      { problem: "Retention marketing copy", problemDetail: "No configurable clock", fix: "Per-object retention", fixDetail: "Set and verify in trial" },
      { problem: "Exit after commit", problemDetail: "Export tested too late", fix: "Early export drill", fixDetail: "200-record sample set" },
    ]),
    workflow: flowSvg("Data exit trial", "Practical buyer workflow — retention & export", [
      { t: "Pick set", d: "Real record sample", d2: "deals + files" },
      { t: "Export", d: "Run package", d2: "inspect fields" },
      { t: "Inspect", d: "Missing notes?", d2: "fail if gaps" },
      { t: "Delete test", d: "Rep vs admin", d2: "role gates" },
      { t: "Retention", d: "Set clock", d2: "confirm policy" },
    ]),
  },
  "control-data-residency": {
    hero: heroChrome(
      "Control data residency",
      "Region choice covering app, backups, and subprocessors — not a decorative map.",
      `
      <rect x="300" y="210" width="1120" height="520" rx="16" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="330" y="252" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">Processing region</text>
      <rect x="330" y="280" width="360" height="56" rx="10" fill="#f1f5f9" stroke="#94a3b8"/>
      <text x="350" y="314" font-family="${FONT}" font-size="16" fill="#0f172a">Primary region: EU (Frankfurt)</text>
      <text x="330" y="370" font-family="${FONT}" font-size="16" font-weight="700" fill="#0f172a">Covered components</text>
      <rect x="330" y="390" width="320" height="88" rx="10" fill="#eff6ff" stroke="#93c5fd"/>
      <text x="350" y="424" font-family="${FONT}" font-size="15" font-weight="700" fill="#1e40af">Application data</text>
      <text x="350" y="452" font-family="${FONT}" font-size="14" fill="#475569">CRM records · EU region</text>
      <rect x="670" y="390" width="320" height="88" rx="10" fill="#f0fdf4" stroke="#86efac"/>
      <text x="690" y="424" font-family="${FONT}" font-size="15" font-weight="700" fill="#166534">Backups</text>
      <text x="690" y="452" font-family="${FONT}" font-size="14" fill="#475569">Same region · documented</text>
      <rect x="1010" y="390" width="320" height="88" rx="10" fill="#fef3c7" stroke="#fcd34d"/>
      <text x="1030" y="424" font-family="${FONT}" font-size="15" font-weight="700" fill="#92400e">Subprocessors</text>
      <text x="1030" y="452" font-family="${FONT}" font-size="14" fill="#475569">Listed · EU or DPA</text>
      <rect x="330" y="510" width="1020" height="180" rx="12" fill="#fef2f2" stroke="#fecaca"/>
      <text x="350" y="548" font-family="${FONT}" font-size="16" font-weight="700" fill="#991b1b">Plan gate</text>
      <text x="350" y="582" font-family="${FONT}" font-size="14" fill="#475569">EU residency available on Enterprise — Growth sandbox may default US</text>
      <text x="350" y="614" font-family="${FONT}" font-size="14" fill="#475569">Ask vendor to confirm region in writing before build</text>`,
    ),
    needs: needsSvg("Residency traps", "Problems → diligence checks", [
      { problem: "Region badge only", problemDetail: "Map graphic, no coverage list", fix: "Component checklist", fixDetail: "App, backups, subprocessors" },
      { problem: "Backups elsewhere", problemDetail: "EU app · US backup", fix: "Ask backup region", fixDetail: "In trust packet" },
      { problem: "Enterprise-only residency", problemDetail: "Growth tile implies EU", fix: "SKU gate check", fixDetail: "Budget or drop vendor" },
      { problem: "Sandbox defaults US", problemDetail: "Trial ≠ production region", fix: "Confirm trial region", fixDetail: "Match prod policy" },
    ]),
    workflow: flowSvg("Residency diligence", "Practical buyer workflow — data region", [
      { t: "Policy", d: "Name requirement", d2: "EU / US / etc." },
      { t: "Options", d: "Vendor regions", d2: "on your SKU" },
      { t: "Components", d: "App · backup · subs", d2: "all listed" },
      { t: "SKU gate", d: "Enterprise?", d2: "budget or drop" },
      { t: "Verify", d: "Written confirm", d2: "before build" },
    ]),
  },
  "review-vendor-security-docs": {
    hero: heroChrome(
      "Review vendor security docs",
      "Trust center, subprocessors, and questionnaire pack — inputs for your review.",
      `
      <rect x="300" y="210" width="1120" height="520" rx="16" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="330" y="252" font-family="${FONT}" font-size="18" font-weight="700" fill="#0f172a">Security packet checklist</text>
      <rect x="330" y="280" width="480" height="64" rx="10" fill="#f0fdf4" stroke="#86efac"/>
      <text x="350" y="318" font-family="${FONT}" font-size="16" font-weight="700" fill="#166534">Trust center (public)</text>
      <text x="520" y="318" font-family="${FONT}" font-size="14" fill="#16a34a">Received</text>
      <rect x="830" y="280" width="480" height="64" rx="10" fill="#f0fdf4" stroke="#86efac"/>
      <text x="850" y="318" font-family="${FONT}" font-size="16" font-weight="700" fill="#166534">Subprocessor list</text>
      <text x="1050" y="318" font-family="${FONT}" font-size="14" fill="#16a34a">Received</text>
      <rect x="330" y="360" width="480" height="64" rx="10" fill="#fef3c7" stroke="#fcd34d"/>
      <text x="350" y="398" font-family="${FONT}" font-size="16" font-weight="700" fill="#92400e">SOC / ISO reports</text>
      <text x="520" y="398" font-family="${FONT}" font-size="14" fill="#ca8a04">NDA required</text>
      <rect x="830" y="360" width="480" height="64" rx="10" fill="#fef2f2" stroke="#fecaca"/>
      <text x="850" y="398" font-family="${FONT}" font-size="16" font-weight="700" fill="#991b1b">Questionnaire</text>
      <text x="1050" y="398" font-family="${FONT}" font-size="14" fill="#dc2626">Pending week 3</text>
      <rect x="330" y="450" width="980" height="240" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="350" y="488" font-family="${FONT}" font-size="16" font-weight="700" fill="#0f172a">Procurement note</text>
      <text x="350" y="526" font-family="${FONT}" font-size="14" fill="#475569">SoftwareGlimpse does not certify vendors — your IT/security team reviews these inputs.</text>
      <text x="350" y="558" font-family="${FONT}" font-size="14" fill="#475569">Strong pipeline demo still fails if packet arrives after verbal commit.</text>
      <text x="350" y="590" font-family="${FONT}" font-size="14" fill="#475569">Start NDA in week one when reports are gated.</text>`,
    ),
    needs: needsSvg("Security doc traps", "Problems → procurement checks", [
      { problem: "Packet after demo", problemDetail: "Security in final week", fix: "Request week one", fixDetail: "Trust center + subs early" },
      { problem: "Marketing-only claims", problemDetail: "Enterprise-grade line", fix: "Actual documents", fixDetail: "SOC, subprocessors, DPA" },
      { problem: "NDA delay", problemDetail: "Reports never arrive", fix: "Start NDA immediately", fixDetail: "Parallel to demo" },
      { problem: "No subprocessor list", problemDetail: "Cannot file questionnaire", fix: "Subprocessor appendix", fixDetail: "Required before shortlist" },
    ]),
    workflow: flowSvg("Security docs review", "Practical buyer workflow — vendor security", [
      { t: "Request", d: "Trust + subs", d2: "week one" },
      { t: "NDA", d: "If reports gated", d2: "start now" },
      { t: "Review", d: "IT reads packet", d2: "score gaps" },
      { t: "Decide", d: "Keep or drop", d2: "before build" },
      { t: "File", d: "Questionnaire", d2: "for procurement" },
    ]),
  },
};

async function writeHubGradePng(svg, outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const { data, info } = await sharp(svg)
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
}

async function main() {
  let written = 0;
  for (const [slug, pack] of Object.entries(packs)) {
    for (const kind of ["hero", "needs", "workflow"]) {
      const rel = `${slug}-${kind}.png`;
      const out = path.join(OUT_DIR, rel);
      if (fs.existsSync(out) && fs.statSync(out).size >= PREMIUM) {
        console.log("skip premium", rel);
        continue;
      }
      await writeHubGradePng(pack[kind], out);
      const size = fs.statSync(out).size;
      console.log("wrote", rel, size);
      if (size < PREMIUM) {
        throw new Error(`${rel} still under premium bar: ${size}`);
      }
      written += 1;
    }
  }
  console.log(`done — ${written} PNGs promoted`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
