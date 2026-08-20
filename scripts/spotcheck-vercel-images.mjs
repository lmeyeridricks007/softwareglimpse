#!/usr/bin/env node
/** Spot-check image URLs on critical Vercel pages. */
import { writeFileSync } from "node:fs";

const BASE = "https://softwareglimpse.vercel.app";
const PAGES = [
  "/guides/pipedrive-implementation/",
  "/guides/clickup-migration/",
  "/guides/trello-plans/",
  "/guides/ai-requirements-guide/",
  "/software/navan/",
  "/software/navan/alternatives/",
  "/software/pipedrive/",
  "/compare/hubspot-vs-pipedrive/",
  "/categories/crm/",
  "/best/crm-software/",
  "/capabilities/email-deliverability/",
  "/",
];

function decode(s) {
  return s.replace(/&amp;/gi, "&").replace(/&quot;/gi, '"');
}

function extract(html, pageUrl) {
  const out = new Set();
  const abs = (src) => {
    src = decode(src.trim());
    if (!src || src.startsWith("data:")) return null;
    try {
      return new URL(src, pageUrl).href;
    } catch {
      return null;
    }
  };
  for (const m of html.matchAll(/\b(?:src|content)=["']([^"']+)["']/gi)) {
    const u = abs(m[1]);
    if (!u) continue;
    if (
      /\/(guides|brands|vendor-ui|og|capabilities|software|categories|_next\/image)\//.test(
        u,
      ) ||
      u.includes("/og/default.png")
    ) {
      out.add(u);
    }
  }
  return [...out];
}

const failures = [];
for (const path of PAGES) {
  const pageUrl = `${BASE}${path}`;
  const res = await fetch(pageUrl);
  const html = await res.text();
  const imgs = extract(html, pageUrl);
  let pageFails = 0;
  for (const img of imgs) {
    const r = await fetch(img, { method: "HEAD", redirect: "follow" });
    const ok = r.ok;
    if (!ok) {
      pageFails += 1;
      failures.push({ page: path, img, status: r.status });
    }
  }
  console.log(
    `${pageFails ? "FAIL" : "OK "} ${path} (${imgs.length} media checks)`,
  );
}

writeFileSync(
  "docs/reports/vercel-image-spotcheck.json",
  JSON.stringify({ checkedAt: new Date().toISOString(), failures }, null, 2),
);
console.log(`\nFailures: ${failures.length}`);
for (const f of failures) console.log(`  ${f.status} ${f.page} -> ${f.img}`);
process.exit(failures.length ? 1 : 0);
