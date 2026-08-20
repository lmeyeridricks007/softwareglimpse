#!/usr/bin/env node
/**
 * Append AI + IT Wave-1 comparison entries into comparisons.ts from JSON specs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "src/data/seed/comparisons.ts");

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", name), "utf8"));
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

function buildPair(fn, spec, landscape) {
  const mapFn = fn === "approvedAiPair" ? mapAiEditorial : mapItEditorial;
  const edA = mapFn(spec.scoresA);
  const edB = mapFn(spec.scoresB);
  const spA = spec.startingPricing?.a ?? "contact";
  const spB = spec.startingPricing?.b ?? "contact";
  return `  ${fn}({
    a: "${spec.a}",
    b: "${spec.b}",
    title: "${spec.labels.a} vs ${spec.labels.b}",
    labels: { a: "${spec.labels.a}", b: "${spec.labels.b}" },
    editorial: {
      a: ${JSON.stringify(edA)},
      b: ${JSON.stringify(edB)},
    },
    factual: {
      startingPricing: "Starting floors: ${spec.labels.a} ~$${spA} vs ${spec.labels.b} ~$${spB} — confirm live packaging.",
      freePlan: "Compare published free tiers and trial terms on each vendor pricing page.",
      userMinimum: "Check seat minimums, agent minimums, and usage/credit bundles before purchase.",
    },
    verdict: "${landscape ? "Landscape comparison — different job clusters; not undifferentiated peers." : "Same-cluster peer comparison."} Overall: ${spec.labels.a} ${spec.overallA} vs ${spec.labels.b} ${spec.overallB}.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "${spec.a}", scenarios: ["${spec.labels.a} primary-job workflows"] },
      { productSlug: "${spec.b}", scenarios: ["${spec.labels.b} primary-job workflows"] },
    ],
  }),`;
}

const aiSpecs = loadJson("_ai-wave1-comparisons.json");
const itSpecs = loadJson("_it-wave1-comparisons.json");
const landscapeAi = new Set([
  "quillbot-vs-chatgpt",
  "elevenlabs-vs-gamma",
  "gamma-vs-wegic",
  "adcreative-ai-vs-gamma",
  "mindstudio-vs-chatgpt",
]);

let src = fs.readFileSync(TARGET, "utf8");
if (src.includes("chatgpt-vs-claude")) {
  console.log("Comparisons already present — skip");
  process.exit(0);
}

const blocks = [
  "\n  // AI Wave-1 comparisons (2026-08-18)",
  ...aiSpecs.map((s) => buildPair("approvedAiPair", s, landscapeAi.has(s.slug))),
  "\n  // IT Wave-1 comparisons (2026-08-18) — landscape",
  ...itSpecs.map((s) => buildPair("approvedItPair", s, true)),
].join("\n");

src = src.replace(/\n];\s*$/, `\n${blocks}\n];\n`);
fs.writeFileSync(TARGET, src);
console.log(`Appended ${aiSpecs.length + itSpecs.length} comparison pairs`);
