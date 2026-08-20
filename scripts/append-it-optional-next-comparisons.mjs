#!/usr/bin/env node
/**
 * Append IT optional-next comparison pairs into comparisons.ts
 * before comparisonsSeedAuthored.
 *
 * Same-cluster first; render vs wp-engine and fly-io vs cloudways are landscape.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS as OPTIONAL } from "./lib/it-optional-next-products.mjs";
import { PRODUCTS as TIERB } from "./lib/it-tierb-itsm-products.mjs";
import { PRODUCTS as TIERA } from "./lib/it-industry-tiera-products.mjs";
import { PRODUCTS as IT_W1 } from "./lib/it-wave1-products.mjs";
import { PRODUCTS as IT_P2 } from "./lib/it-priority2-products.mjs";
import { PRODUCTS as IT_P3 } from "./lib/it-priority3-products.mjs";
import { PRODUCTS as HOSTING } from "./lib/it-hosting-providers-products.mjs";
import { PRODUCTS as WEB } from "./lib/it-webdata-peers-products.mjs";
import { weightedScore as itScore } from "./lib/it-onboard-runtime.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "src/data/seed/comparisons.ts");

function bySlug(list) {
  return new Map(list.map((p) => [p.slug, p]));
}

function spec(a, b, products) {
  const pa = products.get(a);
  const pb = products.get(b);
  if (!pa || !pb) throw new Error(`Missing product ${a} or ${b}`);
  return {
    slug: `${a}-vs-${b}`,
    a,
    b,
    labels: { a: pa.name, b: pb.name },
    scoresA: pa.scores,
    scoresB: pb.scores,
    overallA: itScore(pa.scores),
    overallB: itScore(pb.scores),
    startingPricing: {
      a: pa.startingPriceMonthly,
      b: pb.startingPriceMonthly,
    },
  };
}

function mapItEditorial(scores) {
  return {
    "itsm-depth": scores["it-job-fit"] ?? 5,
    "observability-depth": scores["workflow-depth"] ?? 5,
    "source-control-depth": scores["it-job-fit"] ?? 5,
    "hosting-panel-depth": scores["it-job-fit"] ?? 5,
    "web-data-depth": scores["it-job-fit"] ?? 5,
    "security-admin": scores["admin-security"] ?? 5,
    integrations: scores.integrations ?? 5,
  };
}

function formatFloor(value) {
  if (value === undefined || value === null) return "contact";
  return `~$${value}`;
}

function buildPair(s, landscape) {
  const edA = mapItEditorial(s.scoresA);
  const edB = mapItEditorial(s.scoresB);
  const spA = formatFloor(s.startingPricing?.a);
  const spB = formatFloor(s.startingPricing?.b);
  const titleA = s.labels.a.replace(/"/g, '\\"');
  const titleB = s.labels.b.replace(/"/g, '\\"');
  return `  approvedItPair({
    a: "${s.a}",
    b: "${s.b}",
    title: "${titleA} vs ${titleB}",
    labels: { a: "${titleA}", b: "${titleB}" },
    editorial: {
      a: ${JSON.stringify(edA)},
      b: ${JSON.stringify(edB)},
    },
    factual: {
      startingPricing: "Starting floors: ${titleA} ${spA} vs ${titleB} ${spB} — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "${landscape ? "Landscape comparison — different job clusters; not undifferentiated peers." : "Same-cluster peer comparison."} Overall: ${titleA} ${s.overallA} vs ${titleB} ${s.overallB}.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "${s.a}", scenarios: ["${titleA} primary-job workflows"] },
      { productSlug: "${s.b}", scenarios: ["${titleB} primary-job workflows"] },
    ],
  }),`;
}

const itAll = bySlug([
  ...IT_W1,
  ...IT_P2,
  ...IT_P3,
  ...HOSTING,
  ...WEB,
  ...TIERA,
  ...TIERB,
  ...OPTIONAL,
]);

const pairs = [
  ["topdesk", "freshservice", false],
  ["topdesk", "haloitsm", false],
  ["ivanti", "servicenow", false],
  ["bmc-helix", "servicenow", false],
  ["ivanti", "bmc-helix", false],
  ["chronosphere", "datadog", false],
  ["coralogix", "datadog", false],
  ["chronosphere", "honeycomb", false],
  ["render", "fly-io", false],
  ["render", "wp-engine", true],
  ["fly-io", "cloudways", true],
];

const specs = pairs.map(([a, b]) => spec(a, b, itAll));
const landscape = pairs.map((p) => p[2]);

fs.writeFileSync(
  path.join(ROOT, "scripts/_it-optional-next-comparisons.json"),
  `${JSON.stringify(specs, null, 2)}\n`,
);

let src = fs.readFileSync(TARGET, "utf8");
if (src.includes('a: "topdesk"') || src.includes("topdesk-vs-freshservice")) {
  console.log("IT optional-next comparisons already present — skip append");
  process.exit(0);
}

const blocks = [
  "\n  // IT optional-next comparisons (2026-08-18)",
  ...specs.map((s, i) => buildPair(s, landscape[i])),
].join("\n");

const authoredMarker = "\nconst comparisonsSeedAuthored";
const authoredIdx = src.indexOf(authoredMarker);
if (authoredIdx < 0) {
  throw new Error("Could not find comparisonsSeedAuthored in comparisons.ts");
}
const closeIdx = src.lastIndexOf("\n];", authoredIdx);
if (closeIdx < 0) {
  throw new Error("Could not find comparisonsSeedRaw close before authored export");
}
src = `${src.slice(0, closeIdx)}\n${blocks}\n];${src.slice(closeIdx + 3)}`;
fs.writeFileSync(TARGET, src);
console.log(`Wrote specs + appended ${specs.length} comparison pairs`);
