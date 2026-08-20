#!/usr/bin/env node
/**
 * Merge Priority-2 comparison specs with Wave-1 peers (chatgpt, freshservice, …)
 * then append approvedAiPair / approvedItPair blocks into comparisons.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

const aiAll = bySlug([...AI_W1, ...AI_P2]);
const itAll = bySlug([...IT_W1, ...IT_P2]);

const aiPairs = [
  ["microsoft-copilot", "chatgpt"],
  ["perplexity", "chatgpt"],
  ["github-copilot", "cursor"],
  ["midjourney", "adobe-firefly"],
  ["runway", "midjourney"],
  ["otter-ai", "microsoft-copilot"],
  ["cursor", "chatgpt"],
  ["github-copilot", "chatgpt"],
];
const itPairs = [
  ["servicenow", "freshservice"],
  ["jira-service-management", "freshservice"],
  ["servicenow", "jira-service-management"],
  ["new-relic", "datadog"],
  ["grafana-cloud", "datadog"],
  ["pagerduty", "datadog"],
  ["gitlab", "github"],
  ["bitbucket", "github"],
  ["cpanel", "plesk"],
];

const landscapeAi = new Set([
  "runway-vs-midjourney",
  "otter-ai-vs-microsoft-copilot",
  "cursor-vs-chatgpt",
  "github-copilot-vs-chatgpt",
]);
const landscapeIt = new Set(["pagerduty-vs-datadog"]);

const aiSpecs = aiPairs.map(([a, b]) => spec(a, b, aiAll, aiScore));
const itSpecs = itPairs.map(([a, b]) => spec(a, b, itAll, itScore));

fs.writeFileSync(
  path.join(ROOT, "scripts/_ai-priority2-comparisons.json"),
  `${JSON.stringify(aiSpecs, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(ROOT, "scripts/_it-priority2-comparisons.json"),
  `${JSON.stringify(itSpecs, null, 2)}\n`,
);

let src = fs.readFileSync(TARGET, "utf8");
if (src.includes("microsoft-copilot-vs-chatgpt") || src.includes('a: "microsoft-copilot"')) {
  console.log("Priority-2 comparisons already present — skip append");
  process.exit(0);
}

const blocks = [
  "\n  // AI Priority-2 comparisons (2026-08-18)",
  ...aiSpecs.map((s) => buildPair("approvedAiPair", s, landscapeAi.has(`${s.a}-vs-${s.b}`))),
  "\n  // IT Priority-2 comparisons (2026-08-18)",
  ...itSpecs.map((s) =>
    buildPair("approvedItPair", s, landscapeIt.has(`${s.a}-vs-${s.b}`)),
  ),
].join("\n");

src = src.replace(/\n];\s*$/, `\n${blocks}\n];\n`);
fs.writeFileSync(TARGET, src);
console.log(`Wrote specs + appended ${aiSpecs.length + itSpecs.length} comparison pairs`);
