/**
 * Split public/software/ teaching art from vendor captures, then size-promote
 * leftover original-diagram overviews that fail the ~1 MB bar.
 *
 * - Vendor-ui / unset screenshots → public/vendor-ui/{slug}/…
 * - original-diagram stays under public/software/{slug}/
 * - Unused leftovers in public/software/ are deleted
 *
 * Usage: npx tsx scripts/fix-software-folder-visuals.ts
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { getSoftwareBySlug } from "../src/data/repositories/catalog";
import { isOriginalProductDiagram } from "../src/services/product-media/screenshot-kind";
import type { ProductScreenshot } from "../src/domain";

const ROOT = path.resolve(__dirname, "..");
const SOFTWARE_DIR = path.join(ROOT, "public/software");
const VENDOR_DIR = path.join(ROOT, "public/vendor-ui");
const RESEARCH = path.join(ROOT, "src/data/research");
const W = 1536;
const H = 1024;
const PREMIUM = 900_000;
const FONT =
  "ui-sans-serif, system-ui, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif";

function publicFs(webPath: string): string {
  return path.join(ROOT, "public", webPath.replace(/^\//, ""));
}

function walkFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkFiles(p));
    else if (ent.name !== ".gitkeep") out.push(p);
  }
  return out;
}

function loadShots(): Array<{
  slug: string;
  file: string;
  shot: ProductScreenshot;
}> {
  const rows: Array<{ slug: string; file: string; shot: ProductScreenshot }> =
    [];
  for (const slug of fs.readdirSync(RESEARCH)) {
    const file = path.join(RESEARCH, slug, "enrichment.json");
    if (!fs.existsSync(file)) continue;
    const json = JSON.parse(fs.readFileSync(file, "utf8")) as {
      screenshots?: ProductScreenshot[];
    };
    for (const shot of json.screenshots ?? []) {
      if (typeof shot.src === "string" && shot.src.startsWith("/software/")) {
        rows.push({ slug, file, shot });
      }
    }
  }
  return rows;
}

function relocateVendorUi(): { moved: number; updated: number } {
  const rows = loadShots();
  const keep = new Set<string>();
  const move: Array<{ from: string; toWeb: string; files: string[] }> = [];

  for (const row of rows) {
    if (isOriginalProductDiagram(row.shot)) {
      keep.add(row.shot.src);
      continue;
    }
    const rest = row.shot.src.replace(/^\/software\//, "");
    const toWeb = `/vendor-ui/${rest}`;
    move.push({ from: row.shot.src, toWeb, files: [row.file] });
  }

  const byFrom = new Map<string, { toWeb: string; files: Set<string> }>();
  for (const m of move) {
    const cur = byFrom.get(m.from) ?? { toWeb: m.toWeb, files: new Set() };
    for (const f of m.files) cur.files.add(f);
    byFrom.set(m.from, cur);
  }

  let moved = 0;
  for (const [from, spec] of byFrom) {
    const srcFs = publicFs(from);
    const destFs = publicFs(spec.toWeb);
    if (keep.has(from)) {
      throw new Error(`Refusing to move original-diagram also used as vendor-ui: ${from}`);
    }
    if (fs.existsSync(srcFs)) {
      fs.mkdirSync(path.dirname(destFs), { recursive: true });
      if (fs.existsSync(destFs) && destFs !== srcFs) {
        throw new Error(`Destination exists: ${spec.toWeb}`);
      }
      fs.renameSync(srcFs, destFs);
      moved += 1;
    } else if (!fs.existsSync(destFs)) {
      console.warn(`skip missing ${from}`);
      continue;
    }
    for (const file of spec.files) {
      const raw = fs.readFileSync(file, "utf8");
      if (!raw.includes(`"${from}"`)) continue;
      fs.writeFileSync(file, raw.replaceAll(`"${from}"`, `"${spec.toWeb}"`));
    }
  }

  return { moved, updated: byFrom.size };
}

function pruneUnusedSoftware(): number {
  const keep = new Set(
    loadShots()
      .filter((r) => r.shot.src.startsWith("/software/"))
      .map((r) => publicFs(r.shot.src)),
  );
  let deleted = 0;
  for (const file of walkFiles(SOFTWARE_DIR)) {
    if (keep.has(file)) continue;
    fs.unlinkSync(file);
    deleted += 1;
  }
  return deleted;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function navForCategory(categorySlug: string | undefined): string[] {
  switch (categorySlug) {
    case "ai":
    case "ai-software":
      return ["Home", "Chat", "Projects", "Credits", "Admin", "Settings"];
    case "ecommerce":
      return ["Home", "Catalog", "Orders", "Inventory", "Channels", "Apps"];
    case "email-marketing":
    case "marketing":
    case "marketing-and-growth":
      return ["Home", "Campaigns", "Audience", "Automations", "Reports", "Settings"];
    case "hr":
    case "hr-and-workforce":
      return ["Home", "People", "Time", "Training", "Reviews", "Admin"];
    case "project-management":
      return ["Home", "Board", "Timeline", "Docs", "Workload", "Admin"];
    case "customer-service":
      return ["Home", "Tickets", "Inbox", "Macros", "Reports", "Admin"];
    case "business-communications":
      return ["Home", "Numbers", "Softphone", "Queues", "Call log", "Admin"];
    case "sales-intelligence":
      return ["Home", "Search", "Lists", "Credits", "Sequences", "Admin"];
    case "crm":
      return ["Home", "Pipeline", "People", "Companies", "Reports", "Settings"];
    default:
      return ["Home", "Incidents", "Repos", "Monitors", "On-call", "Admin"];
  }
}

function overviewSvg(name: string, categorySlug: string | undefined): Buffer {
  const nav = navForCategory(categorySlug);
  const active = nav[1] ?? "Home";
  const items = nav
    .map((label, i) => {
      const iy = 156 + i * 52;
      const on = label === active;
      return `
      <rect x="64" y="${iy}" width="188" height="42" rx="10" fill="${on ? "#2563eb" : "transparent"}"/>
      <text x="88" y="${iy + 27}" font-family="${FONT}" font-size="16" font-weight="${on ? 700 : 500}" fill="${on ? "#ffffff" : "#cbd5e1"}">${esc(label)}</text>`;
    })
    .join("");
  const rows = [
    ["Loop 1", "Named owner", "In proof", "Maya"],
    ["Loop 2", "Core path", "Pilot", "Chris"],
    ["Loop 3", "Handoff", "Waiting", "Ops"],
    ["Extras", "Defer", "Off", "—"],
  ];
  const body = rows
    .map((r, i) => {
      const y = 300 + i * 70;
      const cells = r
        .map(
          (c, j) =>
            `<text x="${290 + j * 250}" y="${y + 36}" font-family="${FONT}" font-size="${j === 0 ? 15 : 14}" font-weight="${j === 0 ? 700 : 500}" fill="${j === 0 ? "#0f172a" : "#475569"}">${esc(c)}</text>`,
        )
        .join("");
      return `<rect x="280" y="${y}" width="1080" height="58" rx="10" fill="${i % 2 ? "#f8fafc" : "#ffffff"}" stroke="#e2e8f0"/>${cells}`;
    })
    .join("");
  const host = name.toLowerCase().replace(/\s+/g, "");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#e2e8f0"/>
  <rect x="48" y="36" width="1440" height="780" rx="18" fill="#0f172a"/>
  <rect x="49" y="37" width="1438" height="46" rx="17" fill="#e2e8f0"/>
  <circle cx="76" cy="60" r="7" fill="#f87171"/>
  <circle cx="100" cy="60" r="7" fill="#fbbf24"/>
  <circle cx="124" cy="60" r="7" fill="#34d399"/>
  <rect x="168" y="46" width="520" height="28" rx="10" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="188" y="66" font-family="${FONT}" font-size="14" fill="#64748b">app.${esc(host)}.example / ${esc(active.toLowerCase())}</text>
  <rect x="49" y="85" width="220" height="730" fill="#0f172a"/>
  <text x="76" y="128" font-family="${FONT}" font-size="22" font-weight="800" fill="#ffffff">${esc(name)}</text>
  ${items}
  <rect x="269" y="85" width="1218" height="730" fill="#f8fafc"/>
  <text x="300" y="140" font-family="${FONT}" font-size="22" font-weight="800" fill="#0f172a">${esc(name)} · core loop</text>
  <rect x="300" y="168" width="1120" height="80" rx="14" fill="#eff6ff" stroke="#93c5fd"/>
  <text x="330" y="216" font-family="${FONT}" font-size="16" font-weight="700" fill="#1e40af">${esc(name)} · prove one operator path before extras</text>
  <rect x="300" y="268" width="1120" height="40" rx="10" fill="#ffffff"/>
  <text x="320" y="295" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">JOB</text>
  <text x="570" y="295" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">OWNER RULE</text>
  <text x="820" y="295" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">STATE</text>
  <text x="1070" y="295" font-family="${FONT}" font-size="13" font-weight="700" fill="#94a3b8">WHO</text>
  ${body}
  <rect x="48" y="860" width="1440" height="88" rx="16" fill="#0f172a"/>
  <rect x="48" y="860" width="8" height="88" rx="4" fill="#2563eb"/>
  <text x="76" y="894" font-family="${FONT}" font-size="15" font-weight="800" fill="#93c5fd">DAY-ZERO PROOF</text>
  <text x="76" y="924" font-family="${FONT}" font-size="18" font-weight="600" fill="#f8fafc">A named owner finishes one ${esc(name)} loop a manager can reopen.</text>
</svg>`;
  return Buffer.from(svg);
}

async function writeHubGradePng(svg: Buffer, outPath: string): Promise<boolean> {
  if (fs.existsSync(outPath) && fs.statSync(outPath).size >= PREMIUM) {
    return false;
  }
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
  return true;
}

async function promoteSmallOriginals(): Promise<number> {
  let written = 0;
  for (const row of loadShots()) {
    if (!isOriginalProductDiagram(row.shot)) continue;
    if (!row.shot.src.endsWith(".png")) continue;
    const out = publicFs(row.shot.src);
    if (fs.existsSync(out) && fs.statSync(out).size >= PREMIUM) continue;
    const product = getSoftwareBySlug(row.slug, { includeUnpublished: true });
    const name = product?.name?.trim() || row.slug;
    const svg = overviewSvg(name, product?.primaryCategorySlug);
    if (await writeHubGradePng(svg, out)) written += 1;
  }
  return written;
}

async function main() {
  fs.mkdirSync(VENDOR_DIR, { recursive: true });
  const relocated = relocateVendorUi();
  console.log(`Relocated ${relocated.moved} vendor files (${relocated.updated} srcs).`);
  const promoted = await promoteSmallOriginals();
  console.log(`Promoted ${promoted} original-diagram PNGs to hub-grade size.`);
  const deleted = pruneUnusedSoftware();
  console.log(`Deleted ${deleted} unused files under public/software/.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
