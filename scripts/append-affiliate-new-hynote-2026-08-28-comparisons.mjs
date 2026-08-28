#!/usr/bin/env node
/**
 * Append HyNote comparison pairs into comparisons.ts (idempotent).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "src/data/seed/comparisons.ts");
const MARKER = "// Affiliate new 2026-08-28 (HyNote)";

function buildAiPair(input) {
  const edA = JSON.stringify(input.editorial.a);
  const edB = JSON.stringify(input.editorial.b);
  return `  approvedAiPair({
    a: "${input.a}",
    b: "${input.b}",
    title: "${input.title}",
    labels: { a: "${input.labels.a}", b: "${input.labels.b}" },
    editorial: { a: ${edA}, b: ${edB} },
    factual: {
      startingPricing: "${input.factual.startingPricing}",
      freePlan: "${input.factual.freePlan}",
      userMinimum: "${input.factual.userMinimum}",
    },
    verdict: "${input.verdict}",
    pricingNotes: "${input.pricingNotes}",
    bestFor: ${JSON.stringify(input.bestFor, null, 6).replace(/\n/g, "\n    ")},
  }),`;
}

const PAIRS = [
  buildAiPair({
    a: "hynote",
    b: "fireflies",
    title: "HyNote vs Fireflies.ai",
    labels: { a: "HyNote", b: "Fireflies.ai" },
    editorial: {
      a: {
        "llm-chat-depth": 6,
        "writing-depth": 7,
        "voice-depth": 5,
        "agent-depth": 5,
        governance: 8,
        integrations: 7,
        "usage-model": 9,
      },
      b: {
        "llm-chat-depth": 7,
        "writing-depth": 7,
        "voice-depth": 5,
        "agent-depth": 7,
        governance: 8,
        integrations: 9,
        "usage-model": 8,
      },
    },
    factual: {
      startingPricing:
        "HyNote Pro from $6.66/mo annual; Fireflies Pro from $10/seat/mo annual — confirm live minutes vs storage gates.",
      freePlan:
        "HyNote Free: recording/transcription with 120 min/session. Fireflies Free: unlimited transcription with 400 min team storage.",
      userMinimum:
        "Compare bot auto-join (Fireflies) vs device/upload capture (HyNote) and conversation intelligence needs.",
    },
    verdict:
      "Same ai-meeting cluster. Choose HyNote for multimodal notes (PDF/YouTube/OCR) without a meeting bot and a lower Pro floor. Choose Fireflies.ai for calendar auto-join bots, unlimited transcription retention model, and Business conversation intelligence.",
    pricingNotes: "Research 2026-08-28. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "hynote",
        scenarios: ["Multimodal notes without a meeting bot"],
      },
      {
        productSlug: "fireflies",
        scenarios: ["Auto-join bots + conversation intelligence"],
      },
    ],
  }),
  buildAiPair({
    a: "hynote",
    b: "otter-ai",
    title: "HyNote vs Otter.ai",
    labels: { a: "HyNote", b: "Otter.ai" },
    editorial: {
      a: {
        "llm-chat-depth": 6,
        "writing-depth": 7,
        "voice-depth": 5,
        "agent-depth": 5,
        governance: 8,
        integrations: 7,
        "usage-model": 9,
      },
      b: {
        "llm-chat-depth": 7,
        "writing-depth": 7,
        "voice-depth": 6,
        "agent-depth": 6,
        governance: 7,
        integrations: 8,
        "usage-model": 7,
      },
    },
    factual: {
      startingPricing:
        "HyNote Pro from $6.66/mo annual; Otter Pro/Business seat floors — confirm live Otter packaging.",
      freePlan:
        "Both publish free floors — compare HyNote session caps vs Otter free minutes.",
      userMinimum:
        "Decide by multimodal file/YouTube capture (HyNote) vs Otter meeting auto-join maturity.",
    },
    verdict:
      "Same ai-meeting cluster. Choose HyNote when PDF/YouTube/OCR multimodal capture and a sub-$7 Pro floor matter. Choose Otter.ai when a mature meeting auto-join notetaker with established workplace references is the job.",
    pricingNotes: "Research 2026-08-28. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "hynote",
        scenarios: ["Multimodal study and meeting notes on a low Pro floor"],
      },
      {
        productSlug: "otter-ai",
        scenarios: ["Established meeting auto-join transcription"],
      },
    ],
  }),
];

function main() {
  let src = fs.readFileSync(TARGET, "utf8");
  if (src.includes(MARKER) || src.includes('a: "hynote"')) {
    console.log("Comparisons already present — skip");
    return;
  }
  const authoredMarker = "\nconst comparisonsSeedAuthored";
  const authoredIdx = src.indexOf(authoredMarker);
  if (authoredIdx < 0) throw new Error("comparisonsSeedAuthored not found");
  const closeIdx = src.lastIndexOf("\n];", authoredIdx);
  if (closeIdx < 0) throw new Error("comparisonsSeedRaw close not found");
  const insertion = `\n  ${MARKER}\n${PAIRS.join("\n")}\n`;
  src = `${src.slice(0, closeIdx)}${insertion}${src.slice(closeIdx)}`;
  fs.writeFileSync(TARGET, src, "utf8");
  console.log(`✓ appended ${PAIRS.length} comparison pairs`);
}

main();
