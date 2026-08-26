#!/usr/bin/env node
/** Media for CometChat + Turbotic affiliate onboard. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHECKED_AT = "2026-08-26T12:30:00.000Z";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const PRODUCTS = {
  cometchat: {
    name: "CometChat",
    homepage: "https://www.cometchat.com",
    shots: [
      {
        file: "product-tour-thumb.png",
        url: "https://i.ytimg.com/vi/h3AF-nrD7-k/hqdefault.jpg",
        alt: "CometChat product integration UI frame",
        caption: "Official CometChat YouTube thumbnail.",
        source: "https://www.youtube.com/watch?v=h3AF-nrD7-k",
        annotation: "Official CometChat YouTube thumbnail",
      },
    ],
    videos: [
      {
        videoId: "h3AF-nrD7-k",
        title: "How to Integrate ChatGPT with CometChat",
        channelName: "CometChat",
        sourceOrganization: "CometChat",
        description: "Official CometChat integration demo from YouTube.",
      },
    ],
  },
  turbotic: {
    name: "Turbotic",
    homepage: "https://turbotic.com",
    shots: [],
    videos: [],
  },
};

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1500) {
    return { skipped: true };
  }
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 800) throw new Error(`Too small ${buf.length} ${url}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return { skipped: false, bytes: buf.length };
}

function patchEnrichment(slug, screenshots) {
  const enrichPath = path.join(ROOT, "src/data/research", slug, "enrichment.json");
  if (!fs.existsSync(enrichPath)) {
    console.warn(`skip enrichment patch — missing ${slug}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(enrichPath, "utf8"));
  if (screenshots.length) data.screenshots = screenshots;
  fs.writeFileSync(enrichPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`✓ enrichment screenshots ${slug}`);
}

async function main() {
  const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const slugs = slugArg ? [slugArg] : Object.keys(PRODUCTS);

  for (const slug of slugs) {
    const p = PRODUCTS[slug];
    if (!p) continue;
    const screenshots = [];
    for (const shot of p.shots) {
      const dest = path.join(ROOT, "public/vendor-ui", slug, shot.file);
      try {
        const r = await download(shot.url, dest);
        console.log(`${r.skipped ? "skip" : "ok"} ${slug}/${shot.file}`);
      } catch (e) {
        console.warn(`warn ${slug}/${shot.file}: ${e.message}`);
      }
      screenshots.push({
        id: `${slug}-shot-${shot.file.replace(/\.[^.]+$/, "")}`,
        src: `/vendor-ui/${slug}/${shot.file}`,
        alt: shot.alt,
        caption: shot.caption,
        source: shot.source,
        checkedAt: CHECKED_AT,
        annotation: shot.annotation || `Official ${p.name} marketing UI`,
        kind: "vendor-ui",
        featureIds: [],
      });
    }
    patchEnrichment(slug, screenshots);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
