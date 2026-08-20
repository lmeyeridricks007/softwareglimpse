#!/usr/bin/env node
/**
 * Audit image URLs on the Vercel deployment.
 * Usage: node scripts/audit-vercel-images.mjs [baseUrl]
 */
import { writeFileSync } from "node:fs";

const BASE = (process.argv[2] || "https://softwareglimpse.vercel.app").replace(
  /\/$/,
  "",
);
const CONCURRENCY = 12;
const PAGE_LIMIT = Number(process.env.AUDIT_PAGE_LIMIT || 120);

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "SoftwareGlimpse-ImageAudit/1.0" },
  });
  return { ok: res.ok, status: res.status, text: await res.text(), url: res.url };
}

function rewriteToBase(loc) {
  try {
    const u = new URL(loc);
    return `${BASE}${u.pathname}${u.search}`;
  } catch {
    return null;
  }
}

function pickSample(urls) {
  const buckets = {
    guides: [],
    software: [],
    compare: [],
    categories: [],
    "use-cases": [],
    capabilities: [],
    best: [],
    other: [],
  };
  for (const u of urls) {
    const p = new URL(u).pathname;
    if (p.startsWith("/guides/") && p !== "/guides/") buckets.guides.push(u);
    else if (p.startsWith("/software/") && p.split("/").filter(Boolean).length >= 2)
      buckets.software.push(u);
    else if (p.startsWith("/compare/")) buckets.compare.push(u);
    else if (p.startsWith("/categories/")) buckets.categories.push(u);
    else if (p.startsWith("/use-cases/")) buckets["use-cases"].push(u);
    else if (p.startsWith("/capabilities/")) buckets.capabilities.push(u);
    else if (p.startsWith("/best/")) buckets.best.push(u);
    else buckets.other.push(u);
  }
  const quotas = {
    guides: 40,
    software: 25,
    compare: 15,
    categories: 8,
    "use-cases": 10,
    capabilities: 8,
    best: 8,
    other: 6,
  };
  const out = [];
  for (const [key, n] of Object.entries(quotas)) {
    const list = buckets[key];
    const step = Math.max(1, Math.floor(list.length / n));
    for (let i = 0; i < list.length && out.length < PAGE_LIMIT; i += step) {
      out.push(list[i]);
      if (out.filter((x) => buckets[key].includes(x)).length >= n) break;
    }
  }
  return [...new Set(out)].slice(0, PAGE_LIMIT);
}

function extractImages(html, pageUrl) {
  const found = new Set();
  const decode = (s) =>
    s
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#x2F;/gi, "/");
  const abs = (src) => {
    if (!src || src.startsWith("data:") || src.startsWith("blob:")) return null;
    src = decode(src.trim());
    if (src.startsWith("//")) return `https:${src}`;
    try {
      return new URL(src, pageUrl).href;
    } catch {
      return null;
    }
  };

  for (const m of html.matchAll(/\bsrc=["']([^"']+)["']/gi)) {
    const u = abs(m[1]);
    if (u) found.add(u);
  }
  for (const m of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const part of m[1].split(",")) {
      const u = abs(part.trim().split(/\s+/)[0]);
      if (u) found.add(u);
    }
  }
  for (const m of html.matchAll(
    /<(?:meta|link)[^>]+(?:property|name|rel)=["'](?:og:image|twitter:image|image_src)["'][^>]*>/gi,
  )) {
    const content = m[0].match(/\b(?:content|href)=["']([^"']+)["']/i);
    if (content) {
      const u = abs(content[1]);
      if (u) found.add(u);
    }
  }
  // CSS url() in inline styles
  for (const m of html.matchAll(/url\((['"]?)([^'")]+)\1\)/gi)) {
    const u = abs(m[2]);
    if (u) found.add(u);
  }
  return [...found];
}

function isSiteAsset(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("vercel.app") || u.hostname.includes("softwareglimpse"))
      return true;
    if (u.hostname.includes("blob.vercel-storage.com")) return true;
    // same-origin relative resolved already
    return false;
  } catch {
    return false;
  }
}

async function mapPool(items, limit, worker) {
  let i = 0;
  const results = new Array(items.length);
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await worker(items[idx], idx);
      }
    }),
  );
  return results;
}

const sitemap = await fetchText(`${BASE}/sitemap.xml`);
if (!sitemap.ok) {
  console.error("Failed to fetch sitemap", sitemap.status);
  process.exit(1);
}
const locs = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  rewriteToBase(m[1]),
).filter(Boolean);
const pages = pickSample(locs);
console.log(`Auditing ${pages.length} pages on ${BASE}`);

const pageResults = [];
const imagePages = new Map(); // url -> pages[]

await mapPool(pages, 6, async (page) => {
  try {
    const res = await fetchText(page);
    if (!res.ok) {
      pageResults.push({ page, status: res.status, images: 0, error: "page" });
      return;
    }
    const images = extractImages(res.text, res.url).filter(isSiteAsset);
    pageResults.push({ page, status: res.status, images: images.length });
    for (const img of images) {
      if (!imagePages.has(img)) imagePages.set(img, []);
      imagePages.get(img).push(page);
    }
  } catch (e) {
    pageResults.push({ page, status: 0, images: 0, error: String(e) });
  }
});

const imageUrls = [...imagePages.keys()];
console.log(`Checking ${imageUrls.length} unique site images…`);

const failures = [];
let okCount = 0;
await mapPool(imageUrls, CONCURRENCY, async (img) => {
  try {
    let res = await fetch(img, { method: "HEAD", redirect: "follow" });
    if (res.status === 405 || res.status === 403) {
      res = await fetch(img, { method: "GET", redirect: "follow", headers: { Range: "bytes=0-0" } });
    }
    if (!res.ok) {
      failures.push({
        url: img,
        status: res.status,
        pages: imagePages.get(img)?.slice(0, 3) ?? [],
      });
    } else okCount += 1;
  } catch (e) {
    failures.push({
      url: img,
      status: 0,
      error: String(e),
      pages: imagePages.get(img)?.slice(0, 3) ?? [],
    });
  }
});

// Pattern summary
const patterns = {};
for (const f of failures) {
  let key = "other";
  try {
    const p = new URL(f.url).pathname;
    if (p.includes("-step-v4-")) key = "missing-step-v4";
    else if (p.startsWith("/guides/")) key = "guides";
    else if (p.startsWith("/brands/")) key = "brands";
    else if (p.startsWith("/vendor-ui/")) key = "vendor-ui";
    else if (p.startsWith("/software/")) key = "software-path";
    else if (p.startsWith("/_next/")) key = "next-static";
    else if (p.startsWith("/og/")) key = "og";
    else if (p.startsWith("/categories/")) key = "categories";
    else key = p.split("/")[1] || "other";
  } catch {
    key = "parse-error";
  }
  patterns[key] = (patterns[key] || 0) + 1;
}

const report = {
  base: BASE,
  checkedAt: new Date().toISOString(),
  pagesChecked: pages.length,
  pagesFailed: pageResults.filter((p) => p.error || p.status >= 400).length,
  imagesOk: okCount,
  imagesFailed: failures.length,
  patterns,
  failures: failures.slice(0, 200),
};

writeFileSync(
  "docs/reports/vercel-image-audit.json",
  JSON.stringify(report, null, 2),
);

console.log("\n=== SUMMARY ===");
console.log(`pages: ${pages.length} (failed ${report.pagesFailed})`);
console.log(`images ok: ${okCount}`);
console.log(`images failed: ${failures.length}`);
console.log("patterns:", patterns);
console.log("\nFirst failures:");
for (const f of failures.slice(0, 40)) {
  console.log(`  ${f.status} ${f.url}`);
}
console.log("\nWrote docs/reports/vercel-image-audit.json");
process.exit(failures.length ? 1 : 0);
