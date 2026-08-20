#!/usr/bin/env node
/**
 * Append AI automation-overlay comparison pairs into comparisons.ts.
 * zapier vs n8n is same-cluster; pairs involving mindstudio are landscape (ai-agents).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS as AUTO } from "./lib/ai-automation-overlay-products.mjs";
import { PRODUCTS as AI_W1 } from "./lib/ai-wave1-products.mjs";
import { PRODUCTS as AI_P2 } from "./lib/ai-priority2-products.mjs";
import { PRODUCTS as AI_P3 } from "./lib/ai-priority3-products.mjs";
import { weightedScore as aiScore } from "./lib/ai-onboard-runtime.mjs";

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
    overallA: aiScore(pa.scores),
    overallB: aiScore(pb.scores),
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

function buildPair(s, landscape) {
  const edA = mapAiEditorial(s.scoresA);
  const edB = mapAiEditorial(s.scoresB);
  const spA = s.startingPricing?.a ?? "contact";
  const spB = s.startingPricing?.b ?? "contact";
  const titleA = s.labels.a.replace(/"/g, '\\"');
  const titleB = s.labels.b.replace(/"/g, '\\"');
  return `  approvedAiPair({
    a: "${s.a}",
    b: "${s.b}",
    title: "${titleA} vs ${titleB}",
    labels: { a: "${titleA}", b: "${titleB}" },
    editorial: {
      a: ${JSON.stringify(edA)},
      b: ${JSON.stringify(edB)},
    },
    factual: {
      startingPricing: "Starting floors: ${titleA} ~$${spA} vs ${titleB} ~$${spB} — confirm live packaging (task/execution units and currency differ).",
      freePlan: "Compare published free tiers, Community self-host, and trial terms on each vendor pricing page.",
      userMinimum: "Check task quotas, execution caps, AI credits, and add-on agents before purchase.",
    },
    verdict: "${landscape ? "Landscape comparison — different job clusters; not undifferentiated peers." : "Same-cluster peer comparison."} Overall: ${titleA} ${s.overallA} vs ${titleB} ${s.overallB}.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "${s.a}", scenarios: ["${titleA} primary-job workflows"] },
      { productSlug: "${s.b}", scenarios: ["${titleB} primary-job workflows"] },
    ],
  }),`;
}

const aiAll = bySlug([...AI_W1, ...AI_P2, ...AI_P3, ...AUTO]);

const pairs = [
  ["zapier", "n8n", false],
  ["zapier", "mindstudio", true],
  ["n8n", "mindstudio", true],
];

const specs = pairs.map(([a, b]) => spec(a, b, aiAll));
const landscape = pairs.map((p) => p[2]);

fs.writeFileSync(
  path.join(ROOT, "scripts/_ai-automation-overlay-comparisons.json"),
  `${JSON.stringify(specs, null, 2)}\n`,
);

let src = fs.readFileSync(TARGET, "utf8");
if (src.includes('a: "zapier"') || src.includes("zapier-vs-n8n")) {
  console.log("AI automation-overlay comparisons already present — skip append");
  process.exit(0);
}

const blocks = [
  "\n  // AI automation overlay comparisons (2026-08-18)",
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
