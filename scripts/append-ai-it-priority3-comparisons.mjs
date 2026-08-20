#!/usr/bin/env node
/**
 * Append Priority-3 comparison pairs into comparisons.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS as AI_P3 } from "./lib/ai-priority3-products.mjs";
import { PRODUCTS as IT_P3 } from "./lib/it-priority3-products.mjs";
import { PRODUCTS as AI_P2 } from "./lib/ai-priority2-products.mjs";
import { PRODUCTS as IT_P2 } from "./lib/it-priority2-products.mjs";
import { PRODUCTS as AI_W1 } from "./lib/ai-wave1-products.mjs";
import { PRODUCTS as IT_W1 } from "./lib/it-wave1-products.mjs";
import { weightedScore as aiScore } from "./lib/ai-onboard-runtime.mjs";
import { weightedScore as itScore } from "./lib/it-onboard-runtime.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "src/data/seed/comparisons.ts");

function bySlug(list) {
  return new Map(list.map((p) => [p.slug, p]));
}

function spec(a, b, products, scoreFn) {
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
    overallA: scoreFn(pa.scores),
    overallB: scoreFn(pb.scores),
    startingPricing: {
      a: pa.startingPriceMonthly,
      b: pb.startingPriceMonthly,
    },
  };
}

function mapAiEditorial(scores) {
  return {
    "llm-chat-depth": scores["ai-job-fit"] ?? 5,
    "writing-depth": scores["output-quality"] ?? 5,
    "voice-depth": scores["output-quality"] ?? 5,
    "agent-depth": scores["workflow-depth"] ?? 5,
    governance: scores["governance-privacy"] ?? 5,
    integrations: scores.integrations ?? 5,
    "usage-model": scores["value-for-money"] ?? 5,
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

function buildPair(fn, s, landscape) {
  const mapFn = fn === "approvedAiPair" ? mapAiEditorial : mapItEditorial;
  const edA = mapFn(s.scoresA);
  const edB = mapFn(s.scoresB);
  const spA = s.startingPricing?.a ?? "contact";
  const spB = s.startingPricing?.b ?? "contact";
  const titleA = s.labels.a.replace(/"/g, '\\"');
  const titleB = s.labels.b.replace(/"/g, '\\"');
  return `  ${fn}({
    a: "${s.a}",
    b: "${s.b}",
    title: "${titleA} vs ${titleB}",
    labels: { a: "${titleA}", b: "${titleB}" },
    editorial: {
      a: ${JSON.stringify(edA)},
      b: ${JSON.stringify(edB)},
    },
    factual: {
      startingPricing: "Starting floors: ${titleA} ~$${spA} vs ${titleB} ~$${spB} — confirm live packaging.",
      freePlan: "Compare published free tiers and trial terms on each vendor pricing page.",
      userMinimum: "Check seat minimums, agent minimums, and usage/credit bundles before purchase.",
    },
    verdict: "${landscape ? "Landscape comparison — different job clusters; not undifferentiated peers." : "Same-cluster peer comparison."} Overall: ${titleA} ${s.overallA} vs ${titleB} ${s.overallB}.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "${s.a}", scenarios: ["${titleA} primary-job workflows"] },
      { productSlug: "${s.b}", scenarios: ["${titleB} primary-job workflows"] },
    ],
  }),`;
}

const aiAll = bySlug([...AI_W1, ...AI_P2, ...AI_P3]);
const itAll = bySlug([...IT_W1, ...IT_P2, ...IT_P3]);

const aiPairs = [
  ["synthesia", "runway", false],
  ["fireflies", "otter-ai", false],
  ["fireflies", "microsoft-copilot", true],
  ["midjourney", "synthesia", true],
];
const itPairs = [
  ["dynatrace", "datadog", false],
  ["dynatrace", "new-relic", false],
  ["azure-devops", "github", false],
  ["azure-devops", "gitlab", false],
];

const aiSpecs = aiPairs.map(([a, b]) => spec(a, b, aiAll, aiScore));
const itSpecs = itPairs.map(([a, b]) => spec(a, b, itAll, itScore));
const aiLandscape = aiPairs.map((p) => p[2]);
const itLandscape = itPairs.map((p) => p[2]);

fs.writeFileSync(
  path.join(ROOT, "scripts/_ai-priority3-comparisons.json"),
  `${JSON.stringify(aiSpecs, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(ROOT, "scripts/_it-priority3-comparisons.json"),
  `${JSON.stringify(itSpecs, null, 2)}\n`,
);

let src = fs.readFileSync(TARGET, "utf8");
if (src.includes('a: "synthesia"') || src.includes("runway-vs-synthesia")) {
  console.log("Priority-3 comparisons already present — skip append");
  process.exit(0);
}

const blocks = [
  "\n  // AI Priority-3 comparisons (2026-08-18)",
  ...aiSpecs.map((s, i) => buildPair("approvedAiPair", s, aiLandscape[i])),
  "\n  // IT Priority-3 comparisons (2026-08-18)",
  ...itSpecs.map((s, i) => buildPair("approvedItPair", s, itLandscape[i])),
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
console.log(`Wrote specs + appended ${aiSpecs.length + itSpecs.length} comparison pairs`);
