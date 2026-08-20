#!/usr/bin/env npx tsx
/**
 * Fetches official brand marks into public/brands/{slug}.png.
 *
 * Resolution order per target:
 *   1. explicit `url` override
 *   2. <link rel="apple-touch-icon"> / <link rel="icon"> from the page HTML,
 *      preferring the largest declared PNG
 *   3. /apple-touch-icon.png then /favicon.ico at the domain root
 *   4. Simple Icons CDN (when configured for slug)
 *
 * Rejects tiny favicons (<2.5 KB) and SG lettermarks when --refresh-weak is used.
 * .ico and other raster inputs are converted to PNG with `sips` (macOS).
 * SVG marks (vendor favicons or Simple Icons) are rasterized with `sharp`.
 *
 * Usage:
 *   npx tsx scripts/fetch-brand-logos.mjs                       # all targets below
 *   npx tsx scripts/fetch-brand-logos.mjs aircall wati          # subset
 *   npx tsx scripts/fetch-brand-logos.mjs --force aircall
 *   npx tsx scripts/fetch-brand-logos.mjs --refresh-weak        # lettermarks + tiny PNGs
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllSoftwareUnfiltered } from "../src/data/repositories/catalog.ts";
import { LETTERMARK_SLUGS } from "./lib/lettermark-slugs.mjs";

const require = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), "../package.json"));
const sharp = require("sharp");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BRANDS_DIR = path.join(ROOT, "public/brands");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

/** Reject favicon-sized PNGs — prefer next candidate or Simple Icons. */
const MIN_PNG_BYTES = 2500;

/** Simple Icons fallback — official monochrome marks, tinted by brand hex. */
const SIMPLE_ICONS = {
  "when-i-work": { icon: "wheniwork", color: "51C838" },
  gusto: { icon: "gusto", color: "F45D48" },
  personio: { icon: "personio", color: "000000" },
  "adp-workforce-now": { icon: "adp", color: "D0271D" },
  asana: { icon: "asana", color: "F06A6A" },
  jira: { icon: "jira", color: "0052CC" },
  airtable: { icon: "airtable", color: "18BFFF" },
  slack: { icon: "slack", color: "4A154B" },
  zapier: { icon: "zapier", color: "FF4A00" },
  twilio: { icon: "twilio", color: "F22F46" },
  datadog: { icon: "datadog", color: "632CA6" },
  github: { icon: "github", color: "181717" },
  gitlab: { icon: "gitlab", color: "FC6D26" },
  servicenow: { icon: "servicenow", color: "81B5A1" },
  pagerduty: { icon: "pagerduty", color: "06AC38" },
  hibob: { icon: "hibob", color: "E42C51" },
};

/** Brand logo fetch targets (extend per category wave). */
const TARGETS = [
  { slug: "aircall", page: "https://aircall.io" },
  { slug: "callhippo", page: "https://callhippo.com" },
  { slug: "krispcall", page: "https://krispcall.com" },
  {
    slug: "freshcaller",
    page: "https://www.freshworks.com/freshcaller-cloud-pbx/",
  },
  { slug: "wati", page: "https://www.wati.io" },
  { slug: "zenzap", page: "https://www.zenzap.co" },
  { slug: "fastmail", page: "https://www.fastmail.com" },
  { slug: "sanebox", page: "https://www.sanebox.com" },
  // HR Wave-1
  { slug: "breezy-hr", page: "https://breezy.hr" },
  {
    slug: "connecteam",
    page: "https://connecteam.com",
    // Prefer brand mark over 48×48 favicon.ico (wave1 follow-up)
    url: "https://connecteam.com/wp-content/uploads/2024/03/connecteam-logo.png",
  },
  { slug: "jibble", page: "https://www.jibble.io" },
  { slug: "trainual", page: "https://trainual.com" },
  // HR Priority-1
  { slug: "bamboohr", page: "https://www.bamboohr.com", url: "https://www.bamboohr.com/favicon.ico" },
  { slug: "rippling", page: "https://www.rippling.com", url: "https://www.rippling.com/favicons/apple-touch-icon.png" },
  { slug: "gusto", page: "https://gusto.com", url: "https://cdn.simpleicons.org/gusto/F45D48" },
  { slug: "greenhouse", page: "https://www.greenhouse.com", url: "https://cdn.prod.website-files.com/6668a687e71e2722fccb8357/679a83f9b21b5caab0c682c9_GH-logo-web.png" },
  { slug: "workable", page: "https://www.workable.com", url: "https://www.workable.com/static/android-chrome-512x512.png" },
  // HR Priority-2
  { slug: "homebase", page: "https://www.joinhomebase.com", url: "https://cdn.prod.website-files.com/6696c5e151dc94997874635d/6696c65165adb97ec213dbb9_webclip.png" },
  { slug: "when-i-work", page: "https://wheniwork.com", url: "https://cdn.simpleicons.org/wheniwork/51C838" },
  { slug: "deputy", page: "https://www.deputy.com", url: "https://www.deputy.com/apple-touch-icon.png" },
  {
    slug: "7shifts",
    page: "https://www.7shifts.com",
    url: "https://framerusercontent.com/images/GTwNANjmDcbIsFhKyhhH32pNv4.png?width=512&height=512",
  },
  { slug: "lever", page: "https://www.lever.co", url: "https://www.lever.co/images/favicon-lever.png" },
  { slug: "ashby", page: "https://www.ashbyhq.com", url: "https://www.ashbyhq.com/favicon.png" },
  { slug: "hibob", page: "https://www.hibob.com", url: "https://new.hibob.com/app/uploads/2026/05/cropped-HiBob-Logo-Icon-192x192.png" },
  { slug: "personio", page: "https://www.personio.com", url: "https://cdn.simpleicons.org/personio/000000" },
  // HR Priority-3
  { slug: "workday", page: "https://www.workday.com", url: "https://www.workday.com/favicon.ico" },
  { slug: "oracle-hcm", page: "https://www.oracle.com/human-capital-management/", url: "https://www.oracle.com/asset/web/favicons/favicon.ico" },
  { slug: "ukg-pro", page: "https://www.ukg.com/products/ukg-pro", url: "https://www.ukg.com/etc.clientlibs/settings/wcm/designs/ukg/clientlibs/favicon/resources/apple-touch-icon-180x180.png" },
  { slug: "dayforce", page: "https://www.dayforce.com" },
  { slug: "adp-workforce-now", page: "https://www.adp.com", url: "https://cdn.simpleicons.org/adp/D0271D" },
  { slug: "paylocity", page: "https://www.paylocity.com", url: "https://www.paylocity.com/apple-touch-icon.png" },
  { slug: "paycor", page: "https://www.paycor.com", url: "https://www.paycor.com/wp-content/uploads/2021/03/cropped-Paycor_Logo_512x512_Favicon-256x256.png" },
  // Project Management — official vendor marks (replace SG lettermarks)
  {
    slug: "monday",
    page: "https://monday.com",
    url: "https://cdn.prod.website-files.com/656da6fea306219773d04208/65af6bd6e742d497b5f23f69_645898132bbaac20f1963919_256x256.png",
  },
  {
    slug: "asana",
    page: "https://asana.com",
    url: "https://cdn.simpleicons.org/asana",
  },
  {
    slug: "clickup",
    page: "https://clickup.com",
    url: "https://clickup.com/favicons/apple-touch-icon.png",
  },
  {
    slug: "wrike",
    page: "https://www.wrike.com",
    url: "https://www.wrike.com/tp/static/favicon.ico?v8",
  },
  {
    slug: "linear",
    page: "https://linear.app",
    url: "https://linear.app/static/apple-touch-icon.png",
  },
  {
    slug: "smartsheet",
    page: "https://www.smartsheet.com",
    url: "https://www.smartsheet.com/sites/default/files/favicons/apple-touch-icon.png",
  },
  {
    slug: "jira",
    page: "https://www.atlassian.com/software/jira",
    url: "https://cdn.simpleicons.org/jira",
  },
  {
    slug: "hive",
    page: "https://hive.com",
    url: "https://framerusercontent.com/images/gwU43bHfqpMwCjyiL0AaWhcbYs.png",
  },
  {
    slug: "microsoft-project",
    page: "https://www.microsoft.com/microsoft-365/project/project-management-software",
    url: "https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/project_96x1.png",
  },
  {
    slug: "airtable",
    page: "https://airtable.com",
    url: "https://cdn.simpleicons.org/airtable",
  },
  {
    slug: "notion",
    page: "https://www.notion.so",
    url: "https://www.notion.so/front-static/logo-ios.png",
  },
  {
    slug: "motion",
    page: "https://www.usemotion.com",
    url: "https://www.usemotion.com/favicon.svg",
  },
  {
    slug: "trello",
    page: "https://trello.com",
    url: "https://trello.com/favicon.ico",
  },
  {
    slug: "office-timeline",
    page: "https://www.officetimeline.com",
    url: "https://cdn.prod.website-files.com/693a79f1c52acc530a243186/69fe1e5363bfbec4c48d5396_lucensoftware-favicon.png",
  },
  {
    slug: "todoist",
    page: "https://todoist.com",
    url: "https://cdn.simpleicons.org/todoist",
  },
  {
    slug: "basecamp",
    page: "https://basecamp.com",
    url: "https://basecamp.com/assets/images/general/apple-touch-icon.png",
  },
  {
    slug: "foxit",
    page: "https://www.foxit.com",
    url: "https://www.foxit.com/assets/favicons/favicon180.png",
  },
  {
    slug: "getscreen-me",
    page: "https://getscreen.me",
    url: "https://getscreen.me/apple-touch-icon.png",
  },
  {
    slug: "webcatalog",
    page: "https://webcatalog.io",
    url: "https://webcatalog.io/images/favicons/apple-touch-icon.png",
  },
  // CS Wave-1
  { slug: "freshdesk", page: "https://www.freshdesk.com" },
  { slug: "zendesk-suite", page: "https://www.zendesk.com" },
  { slug: "help-scout", page: "https://www.helpscout.com" },
  { slug: "gorgias", page: "https://www.gorgias.com" },
  { slug: "freshchat", page: "https://www.freshworks.com/live-chat-software/" },
  { slug: "livechat", page: "https://www.livechat.com" },
  { slug: "zoho-desk", page: "https://www.zoho.com/desk/" },
  { slug: "freshservice", page: "https://www.freshworks.com/freshservice/" },
  // Ecommerce Wave-1
  { slug: "shopify", page: "https://www.shopify.com" },
  { slug: "bigcommerce", page: "https://www.bigcommerce.com" },
  { slug: "woocommerce", page: "https://woocommerce.com" },
  {
    slug: "square-online",
    page: "https://squareup.com/us/en/online-store",
    // Favicon.ico is 613B; apple-touch-icon is the usable mark
    url: "https://squareup.com/apple-touch-icon.png",
  },
  { slug: "spocket", page: "https://www.spocket.co" },
  { slug: "alidrop", page: "https://alidrop.co" },
  // Ecommerce Priority-1
  { slug: "magento", page: "https://business.adobe.com/products/magento/magento-commerce.html",
    url: "https://www.adobe.com/content/dam/shared/images/product-icons/svg/commerce.svg" },
  { slug: "wix", page: "https://www.wix.com",
    url: "https://static.wixstatic.com/media/9ab0ec_3f1c0c4c0f0a4e0b8c0d0e0f0a0b0c0d~mv2.png" },
  { slug: "squarespace", page: "https://www.squarespace.com" },
  // Ecommerce Priority-2
  { slug: "ecwid", page: "https://www.ecwid.com" },
  {
    slug: "salesforce-commerce-cloud",
    page: "https://www.salesforce.com/commerce/",
    url: "https://www.salesforce.com/favicon.ico",
  },
  { slug: "prestashop", page: "https://www.prestashop.com" },
  { slug: "shopware", page: "https://www.shopware.com" },
  { slug: "printful", page: "https://www.printful.com" },
  { slug: "printify", page: "https://printify.com" },
  // Ecommerce Priority-2b
  { slug: "webflow", page: "https://webflow.com" },
  {
    slug: "lightspeed-retail",
    page: "https://www.lightspeedhq.com/pos/retail/",
  },
  // Ecommerce Priority-3
  { slug: "opencart", page: "https://www.opencart.com" },
  { slug: "commercetools", page: "https://commercetools.com" },
  { slug: "vtex", page: "https://vtex.com" },
  { slug: "saleor", page: "https://saleor.io" },
  { slug: "medusa", page: "https://medusajs.com" },
  { slug: "tiendanube", page: "https://www.tiendanube.com" },
  // AI Wave-1 LLM assistants (best/ai-software cards)
  {
    slug: "chatgpt",
    page: "https://chatgpt.com",
    // simpleicons.org/openai 404s; brand-green OpenAI mark via jsDelivr
    url: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg",
  },
  {
    slug: "claude",
    page: "https://claude.ai",
    url: "https://claude.ai/images/claude_app_icon.png",
  },
  {
    slug: "gemini",
    page: "https://gemini.google.com",
    url: "https://www.gstatic.com/lamda/images/gemini_sparkle_4g_512_lt_f94943af3be039176192d.png",
  },
  // AI + IT Priority-2
  { slug: "microsoft-copilot", page: "https://www.microsoft.com/microsoft-365-copilot" },
  { slug: "perplexity", page: "https://www.perplexity.ai" },
  { slug: "github-copilot", page: "https://github.com/features/copilot" },
  { slug: "cursor", page: "https://cursor.com" },
  { slug: "midjourney", page: "https://www.midjourney.com" },
  { slug: "adobe-firefly", page: "https://www.adobe.com/products/firefly.html" },
  { slug: "runway", page: "https://runwayml.com" },
  { slug: "otter-ai", page: "https://otter.ai" },
  { slug: "servicenow", page: "https://www.servicenow.com" },
  { slug: "jira-service-management", page: "https://www.atlassian.com/software/jira/service-management" },
  { slug: "new-relic", page: "https://newrelic.com" },
  { slug: "grafana-cloud", page: "https://grafana.com/products/cloud/" },
  { slug: "pagerduty", page: "https://www.pagerduty.com" },
  { slug: "gitlab", page: "https://gitlab.com" },
  { slug: "bitbucket", page: "https://bitbucket.org" },
  { slug: "cpanel", page: "https://cpanel.net" },
  // Affiliate gap reconcile (2026-08-19)
  { slug: "accelerated-growth-studio", page: "https://accelerated.digital/" },
  { slug: "ai-intelekt", page: "https://aiintelekt.com" },
  { slug: "aira", page: "https://aira.io" },
  { slug: "birch", page: "https://birch.co" },
  { slug: "bolt-for-business", page: "https://bolt.eu/en/business/" },
  { slug: "carepatron", page: "https://www.carepatron.com" },
  { slug: "contractor-foreman", page: "https://contractorforeman.com" },
  { slug: "databox", page: "https://databox.com" },
  { slug: "dext", page: "https://dext.com" },
  { slug: "diginius", page: "https://www.diginius.com" },
  { slug: "emergent", page: "https://emergent.sh" },
  { slug: "evolve", page: "https://evolveplatform.ai" },
  { slug: "flexiquiz", page: "https://www.flexiquiz.com" },
  { slug: "flippa", page: "https://flippa.com", url: "https://static.flippa.com/assets/icons/library/logo/flippa-10b8ccbfb55c04a0a83f196375f2609b3be15966f71da2f74a2ae72a961325e2.svg" },
  { slug: "freshteam", page: "https://www.freshworks.com/hrms/freshteam/" },
  { slug: "lucrovox", page: "https://lucrovox.com" },
  { slug: "mrpeasy", page: "https://www.mrpeasy.com" },
  { slug: "navan", page: "https://navan.com", url: "https://navan.com/favicon.ico" },
  { slug: "nicejob", page: "https://get.nicejob.com" },
  { slug: "rank-prompt", page: "https://rankprompt.com" },
  { slug: "servicem8", page: "https://www.servicem8.com" },
  { slug: "shipbob", page: "https://www.shipbob.com" },
  { slug: "shore", page: "https://www.shore.com" },
  { slug: "ueni", page: "https://ueni.com" },
  { slug: "vektoros", page: "https://vektoros.ai" },
  {
    slug: "webinarjam-everwebinar",
    page: "https://home.kartra.com",
  },
  { slug: "zypper", page: "https://zypper.com" },
  // Other seed entries missing brand files
  { slug: "adcreative-ai", page: "https://www.adcreative.ai" },
  { slug: "bright-data", page: "https://brightdata.com" },
  { slug: "datadog", page: "https://www.datadoghq.com" },
  { slug: "elevenlabs", page: "https://elevenlabs.io" },
  { slug: "gamma", page: "https://gamma.app", url: "https://static.gamma.app/favicons/favicon_dark.svg" },
  { slug: "github", page: "https://github.com", url: "https://github.com/fluidicon.png" },
  { slug: "mindstudio", page: "https://www.mindstudio.ai" },
  { slug: "plesk", page: "https://www.plesk.com" },
  { slug: "quillbot", page: "https://quillbot.com" },
  { slug: "wegic", page: "https://wegic.ai" },
];

function fetchBuffer(url, referer) {
  const tmp = path.join(
    os.tmpdir(),
    `brand-fetch-${Math.random().toString(36).slice(2)}`,
  );
  try {
    const args = ["-sSL", "--compressed", "-m", "20", "-A", UA, "-o", tmp, "-w", "%{http_code}"];
    if (referer) args.push("-e", referer);
    args.push(url);
    const code = execFileSync("curl", args, { encoding: "utf8" }).trim();
    if (code !== "200") return null;
    const buf = fs.readFileSync(tmp);
    return buf.length > 0 ? buf : null;
  } catch {
    return null;
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

function fetchText(url) {
  const buf = fetchBuffer(url);
  return buf ? buf.toString("utf8") : null;
}

function iconCandidatesFromHtml(html, pageUrl) {
  const candidates = [];
  const linkRe = /<link\b[^>]*>/gi;
  let match;
  while ((match = linkRe.exec(html))) {
    const tag = match[0];
    const rel = /rel=["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase() ?? "";
    if (!rel.includes("icon")) continue;
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
    if (!href) continue;
    let absolute;
    try {
      absolute = new URL(href, pageUrl).toString();
    } catch {
      continue;
    }
    const sizes = /sizes=["'](\d+)x\d+["']/i.exec(tag)?.[1];
    const declared = sizes ? Number(sizes) : rel.includes("apple") ? 180 : 0;
    candidates.push({ url: absolute, size: declared });
  }
  candidates.sort((a, b) => b.size - a.size);
  return candidates;
}

function isPng(buf) {
  return (
    buf.length > 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  );
}

function isSvg(buf) {
  const head = buf.subarray(0, 256).toString("utf8").trimStart();
  return head.startsWith("<svg") || head.startsWith("<?xml");
}

/** Optional brand fills when vendor SVGs ship as monochrome (Simple Icons). */
const SVG_FILL_BY_SLUG = {
  chatgpt: "#10A37F",
};

async function toPng(buf, slug) {
  if (isSvg(buf)) {
    try {
      let svgBuf = buf;
      const fill = SVG_FILL_BY_SLUG[slug];
      if (fill) {
        let svg = buf.toString("utf8");
        svg = /fill="/.test(svg)
          ? svg.replace(/fill="[^"]*"/, `fill="${fill}"`)
          : svg.replace("<svg ", `<svg fill="${fill}" `);
        svgBuf = Buffer.from(svg);
      }
      return await sharp(svgBuf, { density: 512 })
        .resize(512, 512, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
    } catch {
      return null;
    }
  }
  if (isPng(buf)) return buf;
  const tmpIn = path.join(os.tmpdir(), `brand-${slug}-in`);
  const tmpOut = path.join(os.tmpdir(), `brand-${slug}-out.png`);
  fs.writeFileSync(tmpIn, buf);
  try {
    execFileSync("sips", ["-s", "format", "png", tmpIn, "--out", tmpOut], {
      stdio: "ignore",
    });
    return fs.readFileSync(tmpOut);
  } catch {
    return null;
  } finally {
    fs.rmSync(tmpIn, { force: true });
    fs.rmSync(tmpOut, { force: true });
  }
}

async function normalizePng(png, slug) {
  if (png.length >= MIN_PNG_BYTES) return png;
  try {
    const upscaled = await sharp(png)
      .resize(512, 512, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
    return upscaled.length >= 800 ? upscaled : png;
  } catch {
    return png;
  }
}

async function tryUrl(url, target, { pinned = false } = {}) {
  const buf = fetchBuffer(url, target.page);
  if (!buf || buf.length < 100) return null;
  let png = await toPng(buf, target.slug);
  if (!png || png.length < 100) return null;
  const minBytes = pinned ? 200 : MIN_PNG_BYTES;
  if (png.length < minBytes) return null;
  if (png.length < MIN_PNG_BYTES) {
    png = await normalizePng(png, target.slug);
  }
  return { png, url };
}

async function trySimpleIcons(slug) {
  const spec = SIMPLE_ICONS[slug];
  if (!spec) return null;
  const url = `https://cdn.simpleicons.org/${spec.icon}/${spec.color}`;
  const buf = fetchBuffer(url);
  if (!buf) return null;
  const png = await toPng(buf, slug);
  if (!png || png.length < MIN_PNG_BYTES) return null;
  return { png, url };
}

async function resolveTarget(target) {
  if (target.url) {
    const pinned = await tryUrl(target.url, target, { pinned: true });
    if (pinned) return pinned;
  }

  const urls = [];
  const html = fetchText(target.page);
  if (html) {
    for (const candidate of iconCandidatesFromHtml(html, target.page)) {
      urls.push(candidate.url);
    }
  }

  const origin = new URL(target.page).origin;
  urls.push(`${origin}/apple-touch-icon.png`, `${origin}/favicon.ico`);

  for (const url of urls) {
    const hit = await tryUrl(url, target);
    if (hit) return hit;
  }

  return trySimpleIcons(target.slug);
}

function isWeakBrandFile(slug) {
  const dest = path.join(BRANDS_DIR, `${slug}.png`);
  if (!fs.existsSync(dest)) return true;
  if (LETTERMARK_SLUGS.has(slug)) return true;
  return fs.statSync(dest).size < MIN_PNG_BYTES;
}

function mergeCatalogTargets() {
  const bySlug = new Map(TARGETS.map((t) => [t.slug, { ...t }]));
  for (const software of getAllSoftwareUnfiltered()) {
    const src = software.logo?.src;
    if (!src?.startsWith("/brands/")) continue;
    const slug = src.replace("/brands/", "").replace(/\.png$/, "");
    if (bySlug.has(slug)) continue;
    if (!software.website) continue;
    bySlug.set(slug, { slug, page: software.website });
  }
  return [...bySlug.values()];
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const refreshWeak = args.includes("--refresh-weak");
  const wanted = new Set(args.filter((arg) => !arg.startsWith("--")));
  const pool = mergeCatalogTargets();
  let targets = wanted.size
    ? pool.filter((target) => wanted.has(target.slug))
    : pool;

  if (refreshWeak && !force && wanted.size === 0) {
    targets = targets.filter((target) => isWeakBrandFile(target.slug));
    console.log(`Refresh-weak: ${targets.length} slugs (lettermarks + tiny PNGs)`);
  }

  if (!targets.length) {
    console.error(
      wanted.size
        ? `No matching targets.`
        : `Nothing to refresh.`,
    );
    process.exit(wanted.size ? 1 : 0);
  }

  fs.mkdirSync(BRANDS_DIR, { recursive: true });
  const missing = [];

  for (const target of targets) {
    const dest = path.join(BRANDS_DIR, `${target.slug}.png`);
    if (fs.existsSync(dest) && !force && !refreshWeak) {
      console.log(`= ${target.slug}.png already present`);
      continue;
    }
    if (fs.existsSync(dest) && !force && refreshWeak && !isWeakBrandFile(target.slug)) {
      console.log(`= ${target.slug}.png ok`);
      continue;
    }
    const resolved = await resolveTarget(target);
    if (!resolved) {
      console.warn(`! ${target.slug} — no usable mark found`);
      missing.push(target.slug);
      continue;
    }
    fs.writeFileSync(dest, resolved.png);
    console.log(
      `✓ ${target.slug}.png (${resolved.png.length} bytes) ← ${resolved.url}`,
    );
  }

  if (missing.length) {
    console.log(`\nStill missing: ${missing.join(", ")}`);
  }
}

main();
