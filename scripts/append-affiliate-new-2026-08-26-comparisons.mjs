#!/usr/bin/env node
/**
 * Append CometChat + Turbotic comparison pairs into comparisons.ts (idempotent).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "src/data/seed/comparisons.ts");
const MARKER = "// Affiliate new 2026-08-26 (CometChat + Turbotic)";

function buildCsPair(input) {
  const edA = JSON.stringify(input.editorial.a);
  const edB = JSON.stringify(input.editorial.b);
  return `  approvedCsPair({
    a: "${input.a}",
    b: "${input.b}",
    title: "${input.title}",
    labels: { a: "${input.labels.a}", b: "${input.labels.b}" },
    editorial: { a: ${edA}, b: ${edB} },
    factual: {
      startingPricing: "${input.factual.startingPricing}",
      freePlan: "${input.factual.freePlan}",
      agentMinimum: "${input.factual.agentMinimum}",
    },
    verdict: "${input.verdict}",
    pricingNotes: "${input.pricingNotes}",
    bestFor: ${JSON.stringify(input.bestFor, null, 6).replace(/\n/g, "\n    ")},
  }),`;
}

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
  buildCsPair({
    a: "cometchat",
    b: "tidio",
    title: "CometChat vs Tidio",
    labels: { a: "CometChat", b: "Tidio" },
    editorial: {
      a: {
        "ticketing-depth": 3,
        "live-chat": 9,
        "knowledge-base": 3,
        omnichannel: 6,
        "sla-routing": 3,
        "ecommerce-helpdesk": 4,
        "ai-features": 8,
        integrations: 9,
      },
      b: {
        "ticketing-depth": 4,
        "live-chat": 9,
        "knowledge-base": 7,
        omnichannel: 6,
        "sla-routing": 5,
        "ecommerce-helpdesk": 6,
        "ai-features": 8,
        integrations: 7,
      },
    },
    factual: {
      startingPricing:
        "CometChat paid chat from ~$239/mo annual at 1k MAU (SDK). Tidio Starter $24.17/mo annual (100 billable conversations) — different pricing units.",
      freePlan:
        "CometChat Build free for 100 MAU dev/testing. Tidio publishes visitor-chat tiers — confirm live free/trial on tidio.com.",
      agentMinimum:
        "CometChat bills MAU/concurrency for embedded apps; Tidio bills conversation caps for website chat — not interchangeable units.",
    },
    verdict:
      "Different primary jobs. Choose CometChat when you embed chat/voice/video inside your own app via SDK/UI kits. Choose Tidio for website live chat and Lyro AI deflection without building custom messaging infrastructure.",
    pricingNotes:
      "Research 2026-08-26 from first-party pages. Landscape comparison — in-app SDK vs website widget. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "cometchat",
        scenarios: [
          "Mobile/web apps that need embedded messaging infrastructure",
          "Teams shipping SDK/UI kits instead of a site chat bubble",
        ],
      },
      {
        productSlug: "tidio",
        scenarios: [
          "SMB website live chat with conversation-cap pricing",
          "Storefront teams wanting plug-in chat without developers",
        ],
      },
    ],
  }),
  buildCsPair({
    a: "cometchat",
    b: "intercom",
    title: "CometChat vs Intercom",
    labels: { a: "CometChat", b: "Intercom" },
    editorial: {
      a: {
        "ticketing-depth": 3,
        "live-chat": 9,
        "knowledge-base": 3,
        omnichannel: 6,
        "sla-routing": 3,
        "ecommerce-helpdesk": 4,
        "ai-features": 8,
        integrations: 9,
      },
      b: {
        "ticketing-depth": 7,
        "live-chat": 9,
        "knowledge-base": 8,
        omnichannel: 9,
        "sla-routing": 7,
        "ecommerce-helpdesk": 6,
        "ai-features": 9,
        integrations: 9,
      },
    },
    factual: {
      startingPricing:
        "CometChat ~$239/mo annual at 1k MAU (SDK). Intercom Essential from ~$29/seat/mo plus Fin usage — confirm live intercom.com/pricing.",
      freePlan:
        "CometChat Build free (100 MAU). Intercom packaging is seat/outcome based — confirm trials on intercom.com.",
      agentMinimum:
        "CometChat MAU tiers for embedded apps vs Intercom per-seat + Fin outcomes for customer messaging platform.",
    },
    verdict:
      "Choose CometChat to embed messaging inside your product. Choose Intercom for a customer messaging platform with inbox, Fin AI, and GTM workflows — not as a drop-in SDK replacement.",
    pricingNotes: "Research 2026-08-26. Landscape — SDK vs messaging platform. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "cometchat",
        scenarios: ["Product-led apps embedding chat/calls natively"],
      },
      {
        productSlug: "intercom",
        scenarios: ["GTM/support teams standardizing on Intercom inbox + Fin"],
      },
    ],
  }),
  buildCsPair({
    a: "cometchat",
    b: "freshchat",
    title: "CometChat vs Freshchat",
    labels: { a: "CometChat", b: "Freshchat" },
    editorial: {
      a: {
        "ticketing-depth": 3,
        "live-chat": 9,
        "knowledge-base": 3,
        omnichannel: 6,
        "sla-routing": 3,
        "ecommerce-helpdesk": 4,
        "ai-features": 8,
        integrations: 9,
      },
      b: {
        "ticketing-depth": 6,
        "live-chat": 8,
        "knowledge-base": 7,
        omnichannel: 7,
        "sla-routing": 6,
        "ecommerce-helpdesk": 5,
        "ai-features": 7,
        integrations: 8,
      },
    },
    factual: {
      startingPricing:
        "CometChat ~$239/mo annual at 1k MAU. Freshchat Growth from ~$19/agent/mo annual — agent seats vs MAU.",
      freePlan:
        "CometChat Build free (100 MAU). Freshchat free up to 10 agents on published tiers — confirm live.",
      agentMinimum:
        "Compare MAU/concurrency (CometChat SDK) vs Freshchat agent seats in Freshworks bundle.",
    },
    verdict:
      "CometChat embeds chat in your app; Freshchat is Freshworks live messaging for support teams. Pick CometChat for developers; Freshchat for Freshworks-aligned agent inboxes.",
    pricingNotes: "Research 2026-08-26. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "cometchat", scenarios: ["In-app messaging for product teams"] },
      { productSlug: "freshchat", scenarios: ["Freshworks-aligned live chat for agents"] },
    ],
  }),
  buildCsPair({
    a: "cometchat",
    b: "livechat",
    title: "CometChat vs LiveChat",
    labels: { a: "CometChat", b: "LiveChat" },
    editorial: {
      a: {
        "ticketing-depth": 3,
        "live-chat": 9,
        "knowledge-base": 3,
        omnichannel: 6,
        "sla-routing": 3,
        "ecommerce-helpdesk": 4,
        "ai-features": 8,
        integrations: 9,
      },
      b: {
        "ticketing-depth": 5,
        "live-chat": 9,
        "knowledge-base": 6,
        omnichannel: 6,
        "sla-routing": 5,
        "ecommerce-helpdesk": 6,
        "ai-features": 7,
        integrations: 8,
      },
    },
    factual: {
      startingPricing:
        "CometChat ~$239/mo annual at 1k MAU. LiveChat Starter $19/agent/mo annual — per agent vs MAU.",
      freePlan:
        "CometChat Build free (100 MAU). LiveChat trial terms on livechat.com — confirm live.",
      agentMinimum:
        "CometChat SDK MAU pricing vs LiveChat per-agent website chat seats.",
    },
    verdict:
      "CometChat is for builders embedding chat in apps; LiveChat is established website live chat from Text. Different buyer — developers vs support ops on a site widget.",
    pricingNotes: "Research 2026-08-26. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "cometchat", scenarios: ["Embedded in-app chat/voice/video"] },
      { productSlug: "livechat", scenarios: ["Website agent chat with per-seat pricing"] },
    ],
  }),
  buildAiPair({
    a: "turbotic",
    b: "zapier",
    title: "Turbotic vs Zapier",
    labels: { a: "Turbotic", b: "Zapier" },
    editorial: {
      a: {
        "llm-chat-depth": 8,
        "writing-depth": 6,
        "voice-depth": 5,
        "agent-depth": 8,
        governance: 6,
        integrations: 8,
        "usage-model": 8,
      },
      b: {
        "llm-chat-depth": 9,
        "writing-depth": 7,
        "voice-depth": 7,
        "agent-depth": 8,
        governance: 7,
        integrations: 10,
        "usage-model": 7,
      },
    },
    factual: {
      startingPricing:
        "Turbotic Basic from $14.99/mo annual; Zapier Pro from $19.99/mo annual (750 tasks) — confirm execution vs task units.",
      freePlan:
        "Turbotic Free: 100 executions/mo. Zapier Free: 100 tasks/mo — compare caps on each vendor site.",
      userMinimum:
        "Confirm automation counts, execution/chat quotas, and AI add-ons before purchase.",
    },
    verdict:
      "Same ai-automation cluster. Choose Turbotic for AI-native natural-language automation with self-healing positioning. Choose Zapier for the broadest SaaS connector catalog and mature Zap editor.",
    pricingNotes: "Research 2026-08-26. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "turbotic",
        scenarios: ["AI-generated workflows with ROI reporting"],
      },
      {
        productSlug: "zapier",
        scenarios: ["Maximum connector breadth and no-code Zaps"],
      },
    ],
  }),
  buildAiPair({
    a: "turbotic",
    b: "n8n",
    title: "Turbotic vs n8n",
    labels: { a: "Turbotic", b: "n8n" },
    editorial: {
      a: {
        "llm-chat-depth": 8,
        "writing-depth": 6,
        "voice-depth": 5,
        "agent-depth": 8,
        governance: 6,
        integrations: 8,
        "usage-model": 8,
      },
      b: {
        "llm-chat-depth": 9,
        "writing-depth": 7,
        "voice-depth": 7,
        "agent-depth": 9,
        governance: 8,
        integrations: 8,
        "usage-model": 9,
      },
    },
    factual: {
      startingPricing:
        "Turbotic Basic $14.99/mo annual vs n8n Cloud Starter ~€20/mo annual — confirm live currency and execution caps.",
      freePlan:
        "Turbotic Free (100 executions/mo). n8n Community self-host free — different deployment model.",
      userMinimum:
        "Compare hosted execution quotas vs self-host ops burden.",
    },
    verdict:
      "Choose Turbotic for conversational AI automation on a hosted platform. Choose n8n when self-host or EUR Cloud node-based automation is the job.",
    pricingNotes: "Research 2026-08-26. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "turbotic", scenarios: ["Hosted AI automation with NL build"] },
      { productSlug: "n8n", scenarios: ["Self-host or technical node workflows"] },
    ],
  }),
];

function main() {
  let src = fs.readFileSync(TARGET, "utf8");
  if (src.includes(MARKER) || src.includes('a: "cometchat"')) {
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
