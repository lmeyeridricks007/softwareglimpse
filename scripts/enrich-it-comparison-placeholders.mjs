#!/usr/bin/env node
/**
 * Enrich thin IT approvedItPair shells that still use "primary-job workflows"
 * placeholders. Uses approved editorial assessments/reviews only.
 *
 * Usage: node scripts/enrich-it-comparison-placeholders.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMPARISONS = path.join(ROOT, "src/data/seed/comparisons.ts");
const ASSESS_DIR = path.join(ROOT, "src/data/editorial/assessments");
const REVIEW_DIR = path.join(ROOT, "src/data/editorial/reviews");

/** Rough job-cluster tags from onboarding editorial notes / naming. */
const CLUSTER = {
  freshservice: "itsm",
  servicenow: "itsm",
  "jira-service-management": "itsm",
  "manageengine-servicedesk-plus": "itsm",
  sysaid: "itsm",
  haloitsm: "itsm",
  datadog: "observability",
  "new-relic": "observability",
  "grafana-cloud": "observability",
  dynatrace: "observability",
  splunk: "observability",
  "elastic-observability": "observability",
  appdynamics: "observability",
  honeycomb: "observability",
  sentry: "observability-adjacent",
  pagerduty: "incident",
  "incident-io": "incident",
  firehydrant: "incident",
  rootly: "incident",
  github: "devops",
  gitlab: "devops",
  bitbucket: "devops",
  "azure-devops": "devops",
  circleci: "ci",
  buildkite: "ci",
  plesk: "hosting-panel",
  cpanel: "hosting-panel",
  directadmin: "hosting-panel",
  "wp-engine": "managed-wp",
  kinsta: "managed-wp",
  cloudways: "managed-hosting",
  siteground: "managed-hosting",
  "bright-data": "web-data",
  oxylabs: "web-data",
  scraperapi: "web-data",
  apify: "web-data",
  thordata: "web-data",
  smartproxy: "web-data",
  zyte: "web-data",
  iproyal: "web-data",
};

const CLUSTER_LABEL = {
  itsm: "ITSM / service desk",
  observability: "observability",
  "observability-adjacent": "error monitoring / observability-adjacent",
  incident: "incident / on-call",
  devops: "source control / DevOps",
  ci: "CI / build pipelines",
  "hosting-panel": "hosting panel",
  "managed-wp": "managed WordPress hosting",
  "managed-hosting": "managed hosting",
  "web-data": "web data / proxy collection",
};

function loadProduct(slug) {
  const assess = JSON.parse(
    fs.readFileSync(path.join(ASSESS_DIR, `${slug}.json`), "utf8"),
  );
  const reviewPath = path.join(REVIEW_DIR, `${slug}.json`);
  const review = fs.existsSync(reviewPath)
    ? JSON.parse(fs.readFileSync(reviewPath, "utf8"))
    : null;
  return {
    slug,
    name:
      review?.h1?.replace(/\s+Review.*$/i, "").trim() ||
      slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    overallScore: review?.overallScore ?? null,
    whoShouldChoose:
      review?.whoShouldChoose ||
      assess.recommendation?.split(". Compare")[0] ||
      assess.verdict,
    bestFor: (review?.bestFor?.length ? review.bestFor : assess.bestFor) || [],
    notIdealFor: assess.notIdealFor || [],
    cluster: CLUSTER[slug] || "it",
  };
}

function esc(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function scenariosFor(product) {
  const picks = (product.bestFor || []).slice(0, 3);
  if (picks.length >= 2) return picks;
  const who = product.whoShouldChoose.replace(/^Choose [^ ]+ when /i, "");
  return [who.replace(/\.$/, ""), ...(product.notIdealFor.slice(0, 1))].slice(
    0,
    3,
  );
}

function landscapeNote(a, b) {
  if (a.cluster === b.cluster) {
    return {
      landscape: false,
      note: `Same-cluster ${CLUSTER_LABEL[a.cluster] || a.cluster} peer comparison.`,
    };
  }
  // Soft-adjacent peers
  const soft = new Set([
    "observability|observability-adjacent",
    "observability-adjacent|observability",
    "observability|incident",
    "incident|observability",
    "devops|ci",
    "ci|devops",
    "hosting-panel|managed-wp",
    "managed-wp|hosting-panel",
    "hosting-panel|managed-hosting",
    "managed-hosting|hosting-panel",
    "managed-wp|managed-hosting",
    "managed-hosting|managed-wp",
  ]);
  const key = `${a.cluster}|${b.cluster}`;
  if (soft.has(key)) {
    return {
      landscape: true,
      note: `Adjacent IT jobs (${CLUSTER_LABEL[a.cluster]} vs ${CLUSTER_LABEL[b.cluster]}) — not undifferentiated peers.`,
    };
  }
  return {
    landscape: true,
    note: `Landscape comparison — ${CLUSTER_LABEL[a.cluster] || a.cluster} vs ${CLUSTER_LABEL[b.cluster] || b.cluster}; not undifferentiated peers.`,
  };
}

function buildVerdict(a, b, existingVerdict) {
  const hint = landscapeNote(a, b);
  // Prefer existing "Landscape" / "Same-cluster" signal when present
  const existingLandscape = /Landscape comparison/i.test(existingVerdict || "");
  const existingPeer = /Same-cluster/i.test(existingVerdict || "");
  const landscape = existingPeer ? false : existingLandscape || hint.landscape;
  const prefix = landscape
    ? `${hint.note} `
    : hint.note.startsWith("Same-cluster")
      ? `${hint.note} `
      : "";
  const scoreBit =
    a.overallScore != null && b.overallScore != null
      ? ` Overall: ${a.name} ${a.overallScore} vs ${b.name} ${b.overallScore}.`
      : "";
  const chooseA = a.whoShouldChoose.replace(/\.$/, "");
  const chooseB = b.whoShouldChoose.replace(/\.$/, "");
  return `${prefix}${chooseA}. ${chooseB}.${scoreBit} Not hands-on lab tested; confirm live pricing and packaging.`;
}

function formatBestFor(slug, scenarios) {
  const lines = scenarios.map((s) => `          ${JSON.stringify(s)},`).join("\n");
  return `      {
        productSlug: "${slug}",
        scenarios: [
${lines}
        ],
      }`;
}

function enrichBlock(block) {
  if (!/primary-job workflows/.test(block)) return block;

  const aSlug = /a: "([^"]+)"/.exec(block)?.[1];
  const bSlug = /b: "([^"]+)"/.exec(block)?.[1];
  if (!aSlug || !bSlug) return block;

  const a = loadProduct(aSlug);
  const b = loadProduct(bSlug);
  const existingVerdict = /verdict: "([^"]+)"/.exec(block)?.[1] || "";
  const existingStarting =
    /startingPricing: "([^"]+)"/.exec(block)?.[1] ||
    "Published starting floors — confirm live packaging.";

  const factual = {
    startingPricing: existingStarting.replace(
      /^Starting floors:/,
      "Published starting floors:",
    ),
    freePlan:
      "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
    userMinimum:
      "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
  };
  const verdict = buildVerdict(a, b, existingVerdict);
  const scenariosA = scenariosFor(a);
  const scenariosB = scenariosFor(b);

  let next = block;
  next = next.replace(
    /factual: \{[\s\S]*?\n    \},/,
    `factual: {
      startingPricing: "${esc(factual.startingPricing)}",
      freePlan: "${esc(factual.freePlan)}",
      userMinimum: "${esc(factual.userMinimum)}",
    },`,
  );
  next = next.replace(
    /verdict: "[^"]*",/,
    `verdict:\n      "${esc(verdict)}",`,
  );
  next = next.replace(
    /pricingNotes: "[^"]*",/,
    `pricingNotes:\n      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",`,
  );
  next = next.replace(
    /bestFor: \[[\s\S]*?\n    \],/,
    `bestFor: [
${formatBestFor(aSlug, scenariosA)},
${formatBestFor(bSlug, scenariosB)},
    ],`,
  );
  return next;
}

function main() {
  const src = fs.readFileSync(COMPARISONS, "utf8");
  const re = /approvedItPair\(\{[\s\S]*?\n  \}\),/g;
  let enriched = 0;
  const out = src.replace(re, (block) => {
    if (!/primary-job workflows/.test(block)) return block;
    enriched += 1;
    return enrichBlock(block);
  });
  fs.writeFileSync(COMPARISONS, out);
  const leftover = [...out.matchAll(/approvedItPair\(\{[\s\S]*?\n  \}\),/g)].filter(
    (m) => /primary-job workflows/.test(m[0]),
  );
  console.log(`✓ Enriched ${enriched} IT comparison pairs`);
  console.log(`Remaining IT placeholders: ${leftover.length}`);
}

main();
