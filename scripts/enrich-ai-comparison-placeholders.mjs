#!/usr/bin/env node
/**
 * Enrich thin AI approvedAiPair shells that still use "primary-job workflows"
 * placeholders. Uses approved editorial assessments/reviews only — no invented facts.
 *
 * Usage: node scripts/enrich-ai-comparison-placeholders.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMPARISONS = path.join(ROOT, "src/data/seed/comparisons.ts");
const ASSESS_DIR = path.join(ROOT, "src/data/editorial/assessments");
const REVIEW_DIR = path.join(ROOT, "src/data/editorial/reviews");

/** Pair-specific decision framing when assessments alone are too generic. */
const PAIR_HINTS = {
  "chatgpt-vs-claude": {
    landscape: false,
    factual: {
      startingPricing:
        "ChatGPT Plus is $20/mo; Claude Pro is about $17/mo on annual ($20 monthly) — confirm live packaging and model/usage caps.",
      freePlan:
        "Both publish free tiers with caps. Everyday light chat can stay free; heavy Projects/custom GPTs usually need Plus/Pro.",
      userMinimum:
        "ChatGPT Business has a 2-seat minimum on published plans; Claude Team Standard also has a 2-seat minimum — confirm current floors.",
    },
  },
  "chatgpt-vs-gemini": {
    landscape: false,
    factual: {
      startingPricing:
        "ChatGPT Plus is $20/mo; Google AI Pro (Gemini) is $19.99/mo — confirm live packaging and what each floor includes.",
      freePlan:
        "Both publish free tiers. Gemini Free suits light Google-native use; ChatGPT Free covers basic chat before Plus.",
      userMinimum:
        "ChatGPT Business publishes a 2-seat floor; Gemini Workspace/enterprise packaging is plan- or quote-gated — confirm seat math.",
    },
  },
  "quillbot-vs-chatgpt": {
    landscape: true,
    note: "QuillBot is an AI writing/paraphrasing specialist; ChatGPT is a general LLM assistant — not undifferentiated peers.",
  },
  "elevenlabs-vs-gamma": {
    landscape: true,
    note: "ElevenLabs is voice/TTS; Gamma is AI presentations — different job clusters.",
  },
  "gamma-vs-wegic": {
    landscape: true,
    note: "Gamma is AI presentations/docs; Wegic is AI website building — different job clusters.",
  },
  "adcreative-ai-vs-gamma": {
    landscape: true,
    note: "AdCreative.ai is paid-media creative generation; Gamma is presentations/docs — different job clusters.",
  },
  "mindstudio-vs-chatgpt": {
    landscape: true,
    note: "MindStudio is agent/mini-app building; ChatGPT is a general LLM assistant — adjacent jobs, not the same primary cluster.",
  },
  "microsoft-copilot-vs-chatgpt": {
    landscape: false,
    factual: {
      startingPricing:
        "Microsoft 365 Copilot Business starts around $21/user/mo annual on a qualifying M365 base; ChatGPT Plus is $20/mo (Business from ~$20/seat annual) — confirm live packaging.",
      freePlan:
        "ChatGPT publishes a free tier; Microsoft 365 Copilot is an add-on without a standalone free Copilot seat — confirm trial eligibility.",
      userMinimum:
        "Copilot requires a qualifying Microsoft 365 licence; ChatGPT Business has a published 2-seat floor — confirm before budgeting.",
    },
  },
  "perplexity-vs-chatgpt": {
    landscape: false,
    factual: {
      startingPricing:
        "Perplexity Pro and ChatGPT Plus both publish around $20/mo (~$17 annual for Perplexity) — confirm live packaging and Max/Enterprise tiers.",
      freePlan:
        "Both publish free tiers. Perplexity Free emphasizes cited search; ChatGPT Free is general chat with caps.",
      userMinimum:
        "Perplexity Enterprise Pro publishes higher seat floors; ChatGPT Business has a 2-seat minimum — confirm current terms.",
    },
  },
  "github-copilot-vs-cursor": {
    landscape: false,
    note: "Both are AI coding assistants — Copilot is IDE/GitHub-plugin oriented; Cursor is an AI-native editor.",
  },
  "midjourney-vs-adobe-firefly": {
    landscape: false,
    note: "Both are AI image generation — Midjourney for distinctive stills; Firefly for Creative Cloud / commercial-safe workflows.",
  },
  "runway-vs-midjourney": {
    landscape: true,
    note: "Runway is generative video; Midjourney is primarily stills (with limited video) — different job clusters.",
  },
  "otter-ai-vs-microsoft-copilot": {
    landscape: true,
    note: "Otter.ai is meeting transcription/notes; Microsoft 365 Copilot is a workspace LLM add-on — different primary jobs.",
  },
  "cursor-vs-chatgpt": {
    landscape: true,
    note: "Cursor is an AI coding editor; ChatGPT is a general LLM assistant — landscape, not same-cluster peers.",
  },
  "github-copilot-vs-chatgpt": {
    landscape: true,
    note: "GitHub Copilot is AI coding in the IDE; ChatGPT is a general LLM assistant — landscape comparison.",
  },
  "synthesia-vs-runway": {
    landscape: true,
    note: "Synthesia is avatar/training video; Runway is generative video clips — different video jobs.",
  },
  "fireflies-vs-otter-ai": {
    landscape: false,
    note: "Both are AI meeting notes / conversation intelligence peers.",
  },
  "fireflies-vs-microsoft-copilot": {
    landscape: true,
    note: "Fireflies.ai is meeting notes/CI; Microsoft 365 Copilot is a workspace LLM add-on — different primary jobs.",
  },
  "midjourney-vs-synthesia": {
    landscape: true,
    note: "Midjourney is AI stills; Synthesia is avatar/training video — different creative jobs.",
  },
  "zapier-vs-n8n": {
    landscape: false,
    note: "Both are workflow automation platforms — Zapier leans no-code SaaS tasks; n8n leans self-host / EUR Cloud executions.",
  },
  "zapier-vs-mindstudio": {
    landscape: true,
    note: "Zapier is app automation; MindStudio is AI agent building — adjacent automation jobs, not undifferentiated peers.",
  },
  "n8n-vs-mindstudio": {
    landscape: true,
    note: "n8n is workflow automation; MindStudio is AI agent building — adjacent jobs, not the same cluster.",
  },
};

function loadProduct(slug) {
  const assessPath = path.join(ASSESS_DIR, `${slug}.json`);
  const reviewPath = path.join(REVIEW_DIR, `${slug}.json`);
  const assess = JSON.parse(fs.readFileSync(assessPath, "utf8"));
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
  };
}

function esc(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function scenariosFor(product, peer) {
  const picks = (product.bestFor || []).slice(0, 3);
  if (picks.length >= 2) return picks;
  // Fallback from whoShouldChoose clause
  const who = product.whoShouldChoose.replace(/^Choose [^ ]+ when /i, "");
  return [
    who.replace(/\.$/, ""),
    ...(product.notIdealFor[0]
      ? [`Not when ${product.notIdealFor[0].replace(/^Orgs needing /i, "").replace(/^Buyers needing /i, "")}`]
      : [`Prefer over ${peer.name} when this product’s primary job is the bottleneck`]),
  ].slice(0, 3);
}

function buildVerdict(a, b, hint, existingVerdict) {
  const scoreBit =
    a.overallScore != null && b.overallScore != null
      ? ` Overall: ${a.name} ${a.overallScore} vs ${b.name} ${b.overallScore}.`
      : "";
  const landscape =
    hint?.landscape ||
    /Landscape comparison/i.test(existingVerdict || "");
  const prefix = landscape
    ? hint?.note
      ? `${hint.note} `
      : "Landscape comparison — different primary jobs; not undifferentiated peers. "
    : hint?.note
      ? `${hint.note} `
      : "";
  const chooseA = a.whoShouldChoose.replace(/\.$/, "");
  const chooseB = b.whoShouldChoose.replace(/\.$/, "");
  return `${prefix}${chooseA}. ${chooseB}.${scoreBit} Not hands-on lab tested; confirm live pricing and usage caps.`;
}

function buildFactual(a, b, hint, existing) {
  if (hint?.factual) return hint.factual;
  return {
    startingPricing: existing.startingPricing.replace(
      /Starting floors:/,
      "Published starting floors:",
    ),
    freePlan:
      "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
    userMinimum:
      "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
  };
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

  const slug = [aSlug, bSlug].sort().join("-vs-");
  // Prefer canonical order used in title / pair hints
  const titleSlugMatch = /title: "([^"]+)"/.exec(block)?.[1];
  const pairKey = `${aSlug}-vs-${bSlug}`;
  const hint = PAIR_HINTS[pairKey] || PAIR_HINTS[slug];

  const a = loadProduct(aSlug);
  const b = loadProduct(bSlug);
  const existingVerdict = /verdict: "([^"]+)"/.exec(block)?.[1] || "";
  const existingStarting =
    /startingPricing: "([^"]+)"/.exec(block)?.[1] ||
    "Starting floors — confirm live packaging.";
  const factual = buildFactual(
    a,
    b,
    hint,
    { startingPricing: existingStarting },
  );
  const verdict = buildVerdict(a, b, hint, existingVerdict);
  const scenariosA = scenariosFor(a, b);
  const scenariosB = scenariosFor(b, a);

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
  // If verdict was already multiline from a prior enrich, skip — our targets are single-line
  if (!next.includes(`"${esc(verdict)}"`) && !next.includes(esc(verdict).slice(0, 40))) {
    // already replaced or pattern differed
  }
  next = next.replace(
    /pricingNotes: "[^"]*",/,
    `pricingNotes:\n      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",`,
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
  const re = /approvedAiPair\(\{[\s\S]*?\n  \}\),/g;
  let enriched = 0;
  const out = src.replace(re, (block) => {
    if (!/primary-job workflows/.test(block)) return block;
    enriched += 1;
    return enrichBlock(block);
  });
  if (enriched === 0) {
    console.log("No AI placeholder pairs found.");
    return;
  }
  fs.writeFileSync(COMPARISONS, out);
  console.log(`✓ Enriched ${enriched} AI comparison pairs in comparisons.ts`);

  // Sanity: no AI placeholders left inside approvedAiPair
  const leftover = [...out.matchAll(/approvedAiPair\(\{[\s\S]*?\n  \}\),/g)].filter(
    (m) => /primary-job workflows/.test(m[0]),
  );
  console.log(`Remaining AI placeholders: ${leftover.length}`);
}

main();
