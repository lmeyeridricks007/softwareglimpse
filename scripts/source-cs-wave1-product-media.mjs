#!/usr/bin/env node
/**
 * Source official marketing UI (og:image from first-party product pages) for
 * Customer Service Wave-1 products that still have empty screenshot galleries.
 *
 * Idempotent. Does not invent URLs. Does not auto-publish WordPress.
 *
 * Usage:
 *   node scripts/source-cs-wave1-product-media.mjs
 *   node scripts/source-cs-wave1-product-media.mjs --slug=freshdesk
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHECKED_AT = "2026-08-18T11:30:00.000Z";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SoftwareGlimpseMediaBot/1.0";

const PRODUCTS = {
  freshdesk: {
    name: "Freshdesk",
    homepage: "https://www.freshdesk.com/",
    featureIds: ["ticketing", "omnichannel-inbox"],
    useCaseIds: ["helpdesk-ticketing"],
  },
  "zendesk-suite": {
    name: "Zendesk Suite",
    homepage: "https://www.zendesk.com/",
    featureIds: ["ticketing", "omnichannel-inbox"],
    useCaseIds: ["helpdesk-ticketing", "omnichannel-support"],
  },
  "help-scout": {
    name: "Help Scout",
    homepage: "https://www.helpscout.com/",
    featureIds: ["shared-inbox", "knowledge-base"],
    useCaseIds: ["helpdesk-ticketing", "knowledge-base-self-service"],
  },
  gorgias: {
    name: "Gorgias",
    homepage: "https://www.gorgias.com/",
    featureIds: ["ecommerce-helpdesk", "ticketing"],
    useCaseIds: ["ecommerce-support"],
  },
  tidio: {
    name: "Tidio",
    homepage: "https://www.tidio.com/",
    featureIds: ["live-chat", "chatbot-ai-agent"],
    useCaseIds: ["live-chat-support", "ai-customer-service"],
  },
  freshchat: {
    name: "Freshchat",
    homepage: "https://www.freshworks.com/live-chat-software/",
    featureIds: ["live-chat", "chatbot-ai-agent"],
    useCaseIds: ["live-chat-support"],
  },
  livechat: {
    name: "LiveChat",
    homepage: "https://www.livechat.com/",
    featureIds: ["live-chat"],
    useCaseIds: ["live-chat-support"],
  },
  "zoho-desk": {
    name: "Zoho Desk",
    homepage: "https://www.zoho.com/desk/",
    featureIds: ["ticketing", "knowledge-base"],
    useCaseIds: ["helpdesk-ticketing"],
  },
};

const CDN_ALLOW = [
  "cloudfront.net",
  "cloudinary.com",
  "imgix.net",
  "ctfassets.net",
  "storyblok.com",
  "sanity.io",
  "webflow.com",
  "website-files.com",
  "freshworks.com",
  "freshdesk.com",
  "zendesk.com",
  "zdassets.com",
  "helpscout.com",
  "helpscout.net",
  "gorgias.com",
  "tidio.com",
  "tidio.co",
  "livechat.com",
  "livechatinc.com",
  "text.com",
  "zoho.com",
  "zohocdn.com",
  "zohostatic.com",
  "zohowebstatic.com",
];

function firstPartyHost(homepage, imageUrl) {
  try {
    const pageHost = new URL(homepage).hostname.replace(/^www\./, "");
    const imgHost = new URL(imageUrl).hostname.replace(/^www\./, "");
    const root = pageHost.split(".").slice(-2).join(".");
    if (imgHost.endsWith(root)) return true;
    return CDN_ALLOW.some((d) => imgHost === d || imgHost.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

function resolveUrl(maybe, base) {
  try {
    return new URL(maybe, base).href;
  } catch {
    return null;
  }
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractOgImage(html) {
  const m =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    );
  return m?.[1] ? decodeHtml(m[1]) : null;
}

function extFromUrl(url) {
  try {
    const p = new URL(url).pathname.toLowerCase();
    if (p.endsWith(".webp")) return "webp";
    if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "jpg";
    if (p.endsWith(".png")) return "png";
    if (p.endsWith(".gif")) return "gif";
  } catch {
    /* ignore */
  }
  return "png";
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
    return { skipped: true, bytes: fs.statSync(dest).size };
  }
  const candidates = [url];
  const encoded = url.match(/https?%3A%2F%2Fimages\.ctfassets\.net[^&?]+/i);
  if (encoded) {
    try {
      candidates.push(decodeURIComponent(encoded[0]));
    } catch {
      /* ignore */
    }
  }
  let lastErr = null;
  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, {
        headers: { "User-Agent": UA, Accept: "image/*,*/*" },
        redirect: "follow",
      });
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status} for ${candidate}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1500) {
        lastErr = new Error(`Too small (${buf.length}b): ${candidate}`);
        continue;
      }
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, buf);
      return { skipped: false, bytes: buf.length, usedUrl: candidate };
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastErr ?? new Error(`Download failed for ${url}`);
}

function mergeShot(slug, shot) {
  const enrichmentPath = path.join(
    ROOT,
    "src/data/research",
    slug,
    "enrichment.json",
  );
  const data = JSON.parse(fs.readFileSync(enrichmentPath, "utf8"));
  data.screenshots = Array.isArray(data.screenshots) ? data.screenshots : [];
  const id = `${slug}-shot-${shot.file.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]/gi, "-")}`;
  const src = `/vendor-ui/${slug}/${shot.file}`;
  if (data.screenshots.some((s) => s.id === id || s.src === src)) {
    return { added: false, enrichmentPath, vendorUi: data.screenshots.filter((s) => s.kind === "vendor-ui").length };
  }
  const plan = PRODUCTS[slug];
  data.screenshots.push({
    id,
    src,
    alt: shot.alt,
    caption: shot.caption,
    source: shot.source,
    checkedAt: CHECKED_AT,
    annotation: `Official ${plan.name} marketing UI asset`,
    kind: "vendor-ui",
    featureIds: plan.featureIds,
    useCaseIds: plan.useCaseIds,
  });
  data.updatedAt = CHECKED_AT;
  fs.writeFileSync(enrichmentPath, `${JSON.stringify(data, null, 2)}\n`);
  return {
    added: true,
    enrichmentPath,
    vendorUi: data.screenshots.filter((s) => s.kind === "vendor-ui").length,
  };
}

async function processProduct(slug) {
  const plan = PRODUCTS[slug];
  const html = await fetchText(plan.homepage);
  const raw = extractOgImage(html);
  if (!raw) throw new Error(`No og:image on ${plan.homepage}`);
  const imageUrl = resolveUrl(raw, plan.homepage);
  if (!imageUrl) throw new Error(`Unresolvable og:image ${raw}`);
  if (!firstPartyHost(plan.homepage, imageUrl)) {
    throw new Error(`og:image host not first-party/CDN-allowlisted: ${imageUrl}`);
  }
  const ext = extFromUrl(imageUrl);
  const file = `overview.${ext}`;
  const dest = path.join(ROOT, "public/vendor-ui", slug, file);
  const dl = await download(imageUrl, dest);
  const merge = mergeShot(slug, {
    file,
    alt: `${plan.name} official Open Graph visual`,
    caption: `Official ${plan.name} Open Graph marketing visual from ${plan.homepage} — not a SoftwareGlimpse lab screenshot.`,
    source: plan.homepage,
  });
  return { slug, imageUrl, file, ...dl, ...merge };
}

async function main() {
  const argSlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const slugs = argSlug ? [argSlug] : Object.keys(PRODUCTS);
  for (const slug of slugs) {
    process.stdout.write(`\n→ ${slug}...\n`);
    try {
      const r = await processProduct(slug);
      const status = r.skipped ? `skip ${r.bytes}b` : `ok ${r.bytes}b`;
      console.log(`  ${r.file}: ${status}`);
      console.log(`  ${r.imageUrl}`);
      console.log(`  enrichment: ${r.added ? "+1 shot" : "already present"} vendor-ui=${r.vendorUi}`);
    } catch (err) {
      console.warn(`  FAIL ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
