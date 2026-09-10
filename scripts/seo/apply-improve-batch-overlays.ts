#!/usr/bin/env npx tsx
/**
 * Material unique overlays for the first improve batch.
 * Facts come only from catalogue + research enrichment — no invented prices.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { loadEnrichment } from "@/data/research/store";
import { getSoftwareBySlug, getCategoryBySlug } from "@/data";
import { getGuideBySlug, getGuides } from "@/data/repositories/guides";
import {
  mergeGuideWithOverlay,
  type GuideEnrichmentOverlay,
} from "@/services/seo/guide-enrichment/overlay-merge";
import { saveGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";
import { runEnrichmentQa } from "@/services/seo/guide-enrichment/qa";
import { validateAndMaybePromoteGuide } from "@/services/seo/guide-enrichment/validate";
import {
  analyzePageQualityGate,
  recordGateResult,
} from "@/services/content-quality/gate";

const ROOT = process.cwd();
const BATCH = path.join(ROOT, "data/seo/batches/improve-batch-2026-09-06.json");

function limLines(slug: string, n = 3): string[] {
  const e = loadEnrichment(slug);
  return (e?.limitations ?? [])
    .slice(0, n)
    .map((l) => l.description)
    .filter(Boolean);
}

function planNames(slug: string): string {
  const e = loadEnrichment(slug);
  return (e?.pricing?.plans ?? []).map((p) => p.name).join(", ") || "vendor plans";
}

function now() {
  return new Date().toISOString();
}

function templateBreakBlocks(input: {
  slug: string;
  productName: string;
  directAnswer: string;
  bullets: string[];
  frameworkTitle: string;
  frameworkSteps: string[];
  scenarioTitle: string;
  scenarioBody: string;
  mistakes: Array<{ title: string; body: string }>;
  takeaways: string[];
}): NonNullable<GuideEnrichmentOverlay["patch"]["blocks"]> {
  return [
    {
      id: `da-${input.slug}`,
      type: "direct-answer",
      body: input.directAnswer,
      bullets: input.bullets,
    },
    {
      id: `kt-${input.slug}`,
      type: "key-takeaways",
      title: `${input.productName} takeaways`,
      items: input.takeaways.map((label) => ({ label })),
    },
    {
      id: `df-${input.slug}`,
      type: "decision-framework",
      title: input.frameworkTitle,
      steps: input.frameworkSteps.map((label, i) => ({
        id: `df-${i}`,
        label,
      })),
    },
    {
      id: `cl-${input.slug}`,
      type: "checklist",
      title: `${input.productName} buyer checklist`,
      items: input.frameworkSteps.slice(0, 3).map((label, i) => ({
        id: `cl-${i}`,
        label,
      })),
    },
    {
      id: `st-${input.slug}`,
      type: "step",
      heading: input.scenarioTitle,
      body: input.scenarioBody,
      stepNumber: 1,
    },
    {
      id: `ms-${input.slug}`,
      type: "mistakes",
      title: `${input.productName} plan mistakes`,
      items: input.mistakes,
    },
    {
      id: `co-${input.slug}`,
      type: "callout",
      tone: "info",
      title: "SoftwareGlimpse note",
      body: `${input.productName}: verify limits on a vendor quote — research enrichment only, no invented list prices.`,
    },
  ];
}


function hubspotPlansOverlay(): GuideEnrichmentOverlay {
  const lim = limLines("hubspot");
  return {
    slug: "hubspot-plans",
    enrichmentType: "COST_GUIDE",
    updatedAt: now(),
    uniqueValueAdded: [
      "decision_framework",
      "pricing_comparison",
      "limitations_evidence",
      "scenario_analysis",
      "buyer_checklist",
    ],
    notes: ["Hand-authored unique analysis from HubSpot enrichment — batch 2026-09-06"],
    patch: {

      blocks: templateBreakBlocks({
        slug: "hubspot-plans",
        productName: "HubSpot",
        directAnswer: "Choose the HubSpot hub that matches the weekly job before you compare Starter to Professional prices.",
        bullets: [
          "Marketing Hub when inbound content and nurturing are the bottleneck",
          "Sales Hub when deal stages and sequences matter more than content ops",
          "Skip HubSpot when a single-pipeline CRM clears the job",
        ],
        frameworkTitle: "HubSpot hub-first decision rule",
        frameworkSteps: [
          "Write the primary hub job in one sentence",
          "List marketing contacts and seats that break Free or Starter",
          "Compare Professional feature gates only after the hub job is named",
          "If no second hub in year one, shortlist Capsule or Pipedrive instead",
        ],
        scenarioTitle: "Scenario: inbound team with a sales pod",
        scenarioBody: "Use-case recommendation: prefer Marketing Hub first; add Sales Hub only when deal reporting must share the same contact graph. Compared with Keap, HubSpot differs because hubs split jobs while Keap keeps one SMB narrative.",
        mistakes: [
          { title: "Buying the brand", body: "Weak fit when HubSpot is purchased as a logo without a hub job." },
          { title: "Ignoring contact ceilings", body: "Pricing threshold failures usually come from marketing-contact growth, not seat stickers alone." },
        ],
        takeaways: [
          "HubSpot is a hub ladder, not a single CRM SKU",
          "Worth it when multi-hub reporting is intentional",
          "Trade-off: breadth at the expense of Capsule-like simplicity",
        ],
      }),
      summary:
        "HubSpot plans are a Marketing Hub / Sales Hub / Service Hub ladder, not a single CRM SKU. Map the job (inbound content, pipeline CRM, or service desk) before comparing list prices — Free tools exist, but operational CRM depth and automation limits jump sharply once you leave Free.",
      seo: {
        title: "HubSpot Plans Explained: Which Hub and Tier Fit",
        description:
          "How HubSpot Free, Starter, Professional, and Enterprise hubs differ for CRM and marketing buyers — plan structure, limits, and weak-fit signals from SoftwareGlimpse research.",
      },
      sections: [
        {
          id: "hubspot-plans-job-first",
          heading: "Start with the hub job, not the brand name",
          body: "Unlike single-product CRMs (Capsule, Pipedrive), HubSpot sells parallel hubs. Choose Marketing Hub when the bottleneck is inbound content, forms, and nurturing; Sales Hub when pipeline stages, sequences, and deal reporting matter more; Service Hub when tickets and knowledge base are the core loop. Buying the wrong hub because “HubSpot is the CRM” is the most common fit error we see in buyer briefs.",
        },
        {
          id: "hubspot-plans-threshold",
          heading: "Where plan jumps change the trade-off",
          body: `Published HubSpot plan names on the ladder include ${planNames("hubspot")}. The pricing threshold that usually matters is the jump off Free/Starter into Professional: marketing automation depth, custom reporting, and seating economics change together. Seat cost becomes painful when you add Sales + Marketing seats for the same people without a shared job map. Trade-off: you gain hub breadth at the expense of a simpler all-in-one SMB CRM bill.`,
        },
        {
          id: "hubspot-plans-weak-fit",
          heading: "Weak fit and when to skip HubSpot plans",
          body: `Weak fit when you only need lightweight contact + pipeline CRM for a micro team — Capsule or Pipedrive often clear that job with less hub sprawl. Skip HubSpot if your requirement is pure outbound sequencing without inbound content ops. Documented limits to verify on a quote: ${lim.join(" ") || "confirm seat and marketing-contact caps on the vendor quote."}`,
        },
        {
          id: "hubspot-plans-scenario",
          heading: "Scenario: inbound SMB vs mid-market ops",
          body: "Use-case recommendation: for inbound SMB marketing teams, prefer Marketing Hub Starter only after listing must-have automations; if you need score-based nurturing and A/B testing, Professional is the practical floor. Compared with Keap, HubSpot differs because Keap bundles CRM + marketing automation for service SMBs in one product story, whereas HubSpot splits those jobs across hubs — choose HubSpot when multi-hub reporting is intentional, not accidental.",
        },
      ],
      checklist: [
        {
          id: "hs-c1",
          label: "Name the primary hub job (marketing, sales, or service) before comparing tiers",
        },
        {
          id: "hs-c2",
          label: "List marketing contacts / seats that would push you off Free or Starter",
        },
        {
          id: "hs-c3",
          label: "Ask for a quote that separates hub SKUs — do not assume one “HubSpot CRM” price",
        },
      ],
      nextAction: {
        contentId: "content:tool:crm-cost-calculator",
        label: "Estimate HubSpot-related cost scenarios",
      },
    },
  };
}

function hubspotWorthItOverlay(): GuideEnrichmentOverlay {
  const lim = limLines("hubspot");
  return {
    slug: "is-hubspot-worth-it",
    enrichmentType: "DECISION_GUIDE",
    updatedAt: now(),
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    notes: ["Hand-authored HubSpot worth-it analysis — batch 2026-09-06"],
    patch: {

      blocks: templateBreakBlocks({
        slug: "is-hubspot-worth-it",
        productName: "HubSpot",
        directAnswer: "HubSpot is worth it if you will operate more than one hub on a shared contact graph within a year.",
        bullets: [
          "Worth it when inbound + CRM reporting must share contacts",
          "Not worth it as a default CRM logo for pipeline-only teams",
          "Price migration risk and re-training into the decision",
        ],
        frameworkTitle: "HubSpot worth-it rule",
        frameworkSteps: [
          "Name the second hub you will use in year one",
          "Count marketing contacts that break Free or Starter assumptions",
          "Budget data mapping and re-training, not only list price",
          "If the second hub stays hypothetical, choose a simpler CRM",
        ],
        scenarioTitle: "Scenario: marketing + sales pair",
        scenarioBody: "Ideal for mid-market pairs that already run forms and deal stages. Prefer HubSpot when attribution is required; prefer Pipedrive when pipeline velocity is the only KPI.",
        mistakes: [
          { title: "Shelfware hubs", body: "Buying Sales + Marketing seats without a shared weekly workflow." },
          { title: "Underpricing cutover", body: "Migration risk on property mapping often exceeds year-one seat savings." },
        ],
        takeaways: [
          "Worth-it judgment hinges on a real second hub",
          "Weak fit for solo pipeline-only founders",
          "Compared with Keap, HubSpot expects hub selection",
        ],
      }),
      summary:
        "HubSpot is worth it if you will actually operate more than one hub with shared contacts; it is not worth buying as a “default CRM logo” when a single-pipeline tool would clear the job. Judge worth against hub sprawl, marketing-contact ceilings, and whether Free tools already cover your first 90 days.",
      seo: {
        title: "Is HubSpot Worth It? Hub Sprawl vs Single-CRM Jobs",
        description:
          "Worth-it judgment for HubSpot buyers: when multi-hub CRM/marketing pays off, when Free is enough, and weak-fit signals from SoftwareGlimpse research.",
      },
      sections: [
        {
          id: "hs-wi-verdict",
          heading: "Worth-it judgment in one rule",
          body: "HubSpot is worth it when inbound content, CRM pipeline, and reporting must share one contact graph across teams. It is not worth it if you only need a simple pipeline CRM — you gain brand familiarity at the expense of complexity and seat stacking. Buy HubSpot when you can name the second hub you will use in the first year; skip HubSpot if that second hub stays hypothetical.",
        },
        {
          id: "hs-wi-buyer",
          heading: "Target buyer and weak fit",
          body: `Ideal for mid-market marketing + sales pairs that already run forms, email, and deal stages. Built for teams that will staff hub administration. Weak fit for solo founders who only need contacts and tasks — Capsule or Folks-style relationship CRM is usually cleaner. Documented constraints: ${lim.join(" ")}`,
        },
        {
          id: "hs-wi-migration",
          heading: "Migration risk to price into the decision",
          body: "Migration risk is real when leaving a lightweight CRM: property mapping, marketing-contact definitions, and re-training on hub navigation often cost more than year-one seats. Cutover plans should include data mapping for deals vs tickets vs marketing lists — those are different objects in HubSpot even when buyers treat them as “one CRM.”",
        },
        {
          id: "hs-wi-vs",
          heading: "Compared with Keap and Pipedrive",
          body: "Compared with Keap, HubSpot differs because Keap targets service SMBs with CRM + automation in one narrative, while HubSpot expects hub selection. Whereas Pipedrive stays pipeline-first, HubSpot pays off when marketing attribution is part of the CRM job. Prefer HubSpot when multi-hub reporting is a requirement; prefer Pipedrive when pipeline velocity is the only KPI.",
        },
      ],
      checklist: [
        { id: "wi1", label: "Write the second hub you will use in year one — or choose a simpler CRM" },
        { id: "wi2", label: "Count marketing contacts that would break Free/Starter assumptions" },
        { id: "wi3", label: "Budget re-training and data mapping, not just list price" },
      ],
    },
  };
}

function keapPlansOverlay(): GuideEnrichmentOverlay {
  const lim = limLines("keap");
  return {
    slug: "keap-plans",
    enrichmentType: "COST_GUIDE",
    updatedAt: now(),
    uniqueValueAdded: [
      "decision_framework",
      "pricing_comparison",
      "limitations_evidence",
      "scenario_analysis",
    ],
    notes: ["Hand-authored Keap plans analysis — batch 2026-09-06"],
    patch: {

      blocks: templateBreakBlocks({
        slug: "keap-plans",
        productName: "Keap",
        directAnswer: "Keap plans fit service SMBs that need CRM plus marketing automation together — not enterprise multi-hub stacks.",
        bullets: [
          "Built for appointments, client retention, and follow-up automations",
          "Buy the tier that unlocks required automations on day one",
          "Weak fit for deep custom objects or dialer-first sales engagement",
        ],
        frameworkTitle: "Keap plan decision path",
        frameworkSteps: [
          "List the named automations you must ship in 90 days",
          "Map contact growth to the tier that unlocks those automations",
          "Confirm payments/appointments adjacency is actually required",
          "If you only need a pipeline board, shortlist Capsule instead",
        ],
        scenarioTitle: "Scenario: client-retention service firm",
        scenarioBody: "Use-case recommendation: prefer Keap when missed follow-ups are the risk. Compared with GetResponse, Keap differs because client CRM records stay central while GetResponse centers list-driven email.",
        mistakes: [
          { title: "Evaluating as generic CRM", body: "Keap’s value is automation adjacency — pipeline-only buyers overpay for complexity." },
          { title: "Tier hopping", body: "Pricing threshold mistakes happen when you buy low and migrate twice for automation depth." },
        ],
        takeaways: [
          "Service SMB narrative, not hub architecture",
          "Trade-off: automation depth at the expense of HubSpot modularity",
          "Weak fit when enterprise reporting is the center of gravity",
        ],
      }),
      summary:
        "Keap plans are built for small service businesses that want CRM plus marketing automation and payments in one product — not for enterprise multi-hub stacks. Read contact caps and automation depth per tier before comparing to HubSpot hub SKUs.",
      seo: {
        title: "Keap Plans: CRM + Automation Tiers for Service SMBs",
        description:
          "How Keap plan tiers map to service-business CRM and automation jobs, including limits and weak-fit cases from SoftwareGlimpse research.",
      },
      sections: [
        {
          id: "keap-plans-icp",
          heading: "Built for service SMBs, not hub architects",
          body: "Keap’s published positioning targets small businesses, solo founders, and service businesses that want CRM plus marketing automation and payments together. Ideal for appointment-led and client-retention workflows. That is a different buyer story than HubSpot’s hub ladder or Capsule’s lightweight relationship CRM.",
        },
        {
          id: "keap-plans-structure",
          heading: "Plan structure and the real trade-off",
          body: `Keap plan names in research include ${planNames("keap")}. Trade-off: you gain campaign automations and payments adjacency at the expense of HubSpot-style hub modularity. Pricing threshold to watch: when contact growth forces a tier jump that unlocks automation you already needed on day one — buy that tier first rather than migrating twice.`,
        },
        {
          id: "keap-plans-limits",
          heading: "Limits and weak fit",
          body: `Weak fit when you need deep custom objects, multi-brand marketing ops, or enterprise reporting. Documented limitations: ${lim.join(" ")}. Avoid Keap if your “CRM” requirement is really a full sales-engagement dialer suite.`,
        },
        {
          id: "keap-plans-scenario",
          heading: "Scenario: client-retention service firm",
          body: "Use-case recommendation: for outbound-light service firms that live on email follow-ups and appointments, prefer Keap when automation + CRM must ship as one stack. Compared with GetResponse, Keap differs because GetResponse is owned-channel email/marketing first, whereas Keap keeps client CRM records at the center.",
        },
      ],
    },
  };
}

function keapWorthItOverlay(): GuideEnrichmentOverlay {
  const lim = limLines("keap");
  return {
    slug: "is-keap-worth-it",
    enrichmentType: "DECISION_GUIDE",
    updatedAt: now(),
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
    ],
    notes: ["Hand-authored Keap worth-it analysis — batch 2026-09-06"],
    patch: {

      blocks: templateBreakBlocks({
        slug: "is-keap-worth-it",
        productName: "Keap",
        directAnswer: "Keap is worth it when CRM and marketing automation must ship as one stack for a service business.",
        bullets: [
          "Worth it if a named nurture or appointment automation is mandatory",
          "Not worth it for pipeline-board-only jobs",
          "Prefer Capsule when complexity is the failure mode",
        ],
        frameworkTitle: "Keap worth-it checklist",
        frameworkSteps: [
          "Name one automation that must run in 90 days",
          "Confirm service-SMB packaging matches your buyer",
          "Price migration risk for tags vs opportunities",
          "Skip Keap if HubSpot-like hub reporting is required",
        ],
        scenarioTitle: "Scenario: solo founder with client renewals",
        scenarioBody: "Best for small-business service teams. Prefer Keap when follow-up failures cost revenue; prefer Capsule when simplicity protects adoption.",
        mistakes: [
          { title: "Shelfware automation", body: "Buying Keap without staffing who owns campaign rules." },
          { title: "Wrong category", body: "Weak fit when the real need is a sales dialer suite." },
        ],
        takeaways: [
          "Worth-it judgment needs a named automation",
          "Compared with HubSpot, Keap stays one product narrative",
          "Migration risk shows up in tag vs opportunity mapping",
        ],
      }),
      summary:
        "Keap is worth it for service SMBs that will use CRM and marketing automation together; it is not worth it as a generic “small business CRM” label if you only need contacts and a pipeline board.",
      sections: [
        {
          id: "keap-wi-rule",
          heading: "Worth-it judgment",
          body: "Keap is worth it if you will run client follow-up automations and keep payments/appointments adjacent to the CRM. It is not worth buying when a simple pipeline CRM clears the job — you sacrifice simplicity for automation depth you will not configure. Choose Keap only if a named automation (lead nurture, appointment reminder, re-engagement) is a must-have in 90 days.",
        },
        {
          id: "keap-wi-fit",
          heading: "Target buyer vs weak fit",
          body: `Best for small-business service teams and solo founders who sell relationship-led work. Weak fit for mid-market revenue ops that need HubSpot-like hub reporting. Limits to verify: ${lim.join(" ")}`,
        },
        {
          id: "keap-wi-vs",
          heading: "Compared with HubSpot and Capsule",
          body: "Compared with HubSpot, Keap differs because it stays one product narrative for SMB automation instead of multiple hubs. Whereas Capsule optimizes for clarity and lightweight pipelines, Keap pays off when campaign automation is part of the CRM job. Prefer Capsule when complexity is the risk; prefer Keap when missed follow-ups are the risk.",
        },
        {
          id: "keap-wi-migration",
          heading: "Migration risk note",
          body: "Migration risk shows up when importing messy spreadsheets into Keap’s contact + campaign model — data mapping for tags vs lists vs opportunities needs an owner. Re-train client-facing staff on the automation rules you enable, or the platform becomes shelfware.",
        },
      ],
    },
  };
}

function capsulePlansOverlay(): GuideEnrichmentOverlay {
  const lim = limLines("capsule");
  return {
    slug: "capsule-plans",
    enrichmentType: "COST_GUIDE",
    updatedAt: now(),
    uniqueValueAdded: [
      "decision_framework",
      "pricing_comparison",
      "limitations_evidence",
      "scenario_analysis",
    ],
    notes: ["Hand-authored Capsule plans analysis — batch 2026-09-06"],
    patch: {

      blocks: templateBreakBlocks({
        slug: "capsule-plans",
        productName: "Capsule",
        directAnswer: "Capsule plans raise contact and field ceilings for small-business CRM — pick Growth only when named workflows are ready.",
        bullets: [
          "Free/Starter for micro relationship CRM",
          "Growth unlocks workflow automation and advanced reporting",
          "Not a marketing automation or webinar suite",
        ],
        frameworkTitle: "Capsule limit-ladder decision",
        frameworkSteps: [
          "Count contacts and users for the next 12 months",
          "List workflows that require Growth automation",
          "Confirm you do not need full campaign email or dialers",
          "Choose Ultimate only when mid-market SMB limits demand it",
        ],
        scenarioTitle: "Scenario: founder-led sales team",
        scenarioBody: "Use-case recommendation: for teams of 2–10, prefer Capsule Starter or Growth. Compared with Keap, Capsule differs because it stays CRM-first while Keap packages marketing automation.",
        mistakes: [
          { title: "Buying Growth empty", body: "Trade-off fails when you pay for automation without workflows to configure." },
          { title: "Wrong category", body: "Weak fit when cart recovery email is the primary job." },
        ],
        takeaways: [
          "Limit ladder, not hub ladder",
          "Pricing threshold: Growth for automation character change",
          "Ideal for small-business clarity over complexity",
        ],
      }),
      summary:
        "Capsule plans scale contact, pipeline, and custom-field limits for small-business CRM — Free through Ultimate — without pretending to be a marketing automation suite. Pick the tier by contact ceiling and whether you need Growth-level workflow automation.",
      seo: {
        title: "Capsule CRM Plans: Free to Ultimate Limits Explained",
        description:
          "Capsule Free, Starter, Growth, Advanced, and Ultimate — what each tier unlocks, hard limits, and when Capsule is the wrong category.",
      },
      sections: [
        {
          id: "cap-plans-shape",
          heading: "A limit ladder, not a hub ladder",
          body: `Capsule plan names: ${planNames("capsule")}. Unlike HubSpot, Capsule does not ask you to pick Marketing vs Sales hubs — it raises contact, pipeline, and field ceilings. Ideal for small-business and micro teams that want relationship clarity. Free covers up to a tiny user count; Starter is the accessible paid on-ramp for growing contact lists.`,
        },
        {
          id: "cap-plans-threshold",
          heading: "Pricing threshold: Growth for automation",
          body: "The pricing threshold that changes product character is Growth: workflow automations and advanced reporting start there, while enrichment features concentrate on Advanced. Trade-off: you gain automation at the expense of Capsule’s “keep it simple” posture — only buy Growth if you have named workflows ready to configure.",
        },
        {
          id: "cap-plans-limits",
          heading: "Hard limits and category boundaries",
          body: `Documented limitations: ${lim.join(" ")}. Weak fit when you need full email marketing campaigns, webinars, or sales engagement dialers — Capsule email templates are not a campaign platform. Avoid Capsule if ecommerce cart recovery is the primary job (look at marketing platforms instead).`,
        },
        {
          id: "cap-plans-scenario",
          heading: "Scenario: founder-led sales",
          body: "Use-case recommendation: for pipeline teams of 2–10 who live in contacts and tasks, prefer Capsule Starter or Growth. Compared with Keap, Capsule differs because Keap leans into marketing automation packaging, while Capsule stays CRM-first. Prefer Capsule when complexity is the failure mode.",
        },
      ],
    },
  };
}

function zohoPlansOverlay(): GuideEnrichmentOverlay {
  const lim = limLines("zoho-crm");
  return {
    slug: "zoho-crm-plans",
    enrichmentType: "COST_GUIDE",
    updatedAt: now(),
    uniqueValueAdded: [
      "decision_framework",
      "pricing_comparison",
      "limitations_evidence",
      "scenario_analysis",
    ],
    notes: ["Hand-authored Zoho CRM plans analysis — batch 2026-09-06"],
    patch: {

      blocks: templateBreakBlocks({
        slug: "zoho-crm-plans",
        productName: "Zoho CRM",
        directAnswer: "Zoho CRM editions stay affordable only if you map Blueprint and Zia needs to the edition that unlocks them.",
        bullets: [
          "Free is real but capped at 3 users",
          "Zia AI and advanced automation concentrate on Enterprise/Ultimate",
          "Quote the edition that unlocks Blueprint paths you will run",
        ],
        frameworkTitle: "Zoho edition decision path",
        frameworkSteps: [
          "List must-have Blueprint automations",
          "Check whether Free’s 3-user cap blocks you now",
          "Treat Enterprise as the Zia depth threshold",
          "Prefer Capsule if simplicity beats ecosystem breadth",
        ],
        scenarioTitle: "Scenario: SMB growing past Free",
        scenarioBody: "Use-case recommendation: move to Standard/Professional once you exceed three users. Compared with Capsule, Zoho differs with a wider edition ladder and ecosystem apps.",
        mistakes: [
          { title: "Celebrating Free forever", body: "Weak fit narrative when Blueprint needs already require paid editions." },
          { title: "Late edition upgrades", body: "Migration risk: redesigning Blueprint after starting on the wrong edition." },
        ],
        takeaways: [
          "Edition feature gates matter more than seat stickers",
          "Pricing threshold: Enterprise for Zia depth",
          "Affordable CRM stays true only with honest edition mapping",
        ],
      }),
      summary:
        "Zoho CRM editions run Free → Standard → Professional → Enterprise → Ultimate. Free starts cheap but caps users; Zia AI and Blueprint-depth automation concentrate on higher editions — so “affordable CRM” only stays true if you stay honest about which edition unlocks your must-haves.",
      sections: [
        {
          id: "zoho-plans-editions",
          heading: "Edition ladder vs feature concentration",
          body: `Zoho CRM plan names in research: ${planNames("zoho-crm")}. Free is a real on-ramp (not a 14-day tease only), but Free is limited to 3 users. Trade-off: you gain Blueprint automation and Zia AI depth at higher editions at the expense of the “start free forever” story. Map must-have workflows to the edition that unlocks them before celebrating Free.`,
        },
        {
          id: "zoho-plans-threshold",
          heading: "Pricing threshold: Enterprise for Zia depth",
          body: "The pricing threshold most buyers underestimate is Enterprise/Ultimate for Zia AI and advanced automation depth. Plan jumps to Professional may still leave AI and Blueprint sophistication on the table. Seat cost becomes secondary to edition feature gates — quote the edition that unlocks Blueprint paths you will actually run.",
        },
        {
          id: "zoho-plans-limits",
          heading: "Limits and weak fit",
          body: `Documented limitations: ${lim.join(" ")}. Weak fit when you want Apple-smooth UX above all else or when you need a western sales-engagement dialer as the core product. Prefer HubSpot if multi-hub marketing ops is the center of gravity; prefer Zoho when affordable multi-edition CRM inside the Zoho ecosystem matters.`,
        },
        {
          id: "zoho-plans-scenario",
          heading: "Scenario: SMB growing past Free",
          body: "Use-case recommendation: for SMB sales teams starting on Free, prefer Standard/Professional once you exceed three users or need serious pipeline customization. Compared with Capsule, Zoho differs because Zoho offers a wider edition ladder and ecosystem apps, whereas Capsule optimizes for simplicity. Migration risk: moving off Free without a Blueprint design leads to re-work on Enterprise later.",
        },
      ],
    },
  };
}

function getresponsePlansOverlay(): GuideEnrichmentOverlay {
  const lim = limLines("getresponse");
  return {
    slug: "getresponse-plans",
    enrichmentType: "COST_GUIDE",
    updatedAt: now(),
    uniqueValueAdded: [
      "decision_framework",
      "pricing_comparison",
      "limitations_evidence",
      "scenario_analysis",
    ],
    notes: ["Hand-authored GetResponse plans analysis — batch 2026-09-06"],
    patch: {

      blocks: templateBreakBlocks({
        slug: "getresponse-plans",
        productName: "GetResponse",
        directAnswer: "GetResponse cost moves with contact-list bands; Starter’s single automation workflow is the key threshold for lifecycle buyers.",
        bullets: [
          "Paid tiers emphasize unlimited sends inside the contact band",
          "Marketer is the practical floor for multi-step journeys",
          "Weak fit when you need a full sales CRM system of record",
        ],
        frameworkTitle: "GetResponse band-and-automation path",
        frameworkSteps: [
          "Project contact band for six months, not only today’s list",
          "Count automation workflows — more than one means leave Starter",
          "Decide if Creator webinars or Enterprise SMS/IP are required",
          "If pipeline CRM is the job, shortlist a CRM instead",
        ],
        scenarioTitle: "Scenario: ecommerce lifecycle email",
        scenarioBody: "Use-case recommendation: prefer Marketer+ for cart recovery. Compared with Keap, GetResponse differs because list-driven email is central while Keap centers client CRM records.",
        mistakes: [
          { title: "Evaluating on Starter alone", body: "Pricing threshold miss when multi-step automation is mandatory." },
          { title: "CRM confusion", body: "Weak fit treating GetResponse as a deal-stage CRM." },
        ],
        takeaways: [
          "Contact bands, not CRM seats",
          "Starter automation cap changes product character",
          "Ideal for owned-channel marketing teams",
        ],
      }),
      summary:
        "GetResponse prices mainly by contact-list band with unlimited monthly sends on paid tiers. Free and a 14-day premium window exist, but Starter caps custom automation at one workflow — so “email + automation” buyers often need Marketer before the product matches the pitch.",
      sections: [
        {
          id: "gr-plans-model",
          heading: "Contact bands, not CRM seats",
          body: `GetResponse plan names: ${planNames("getresponse")}. Unlike HubSpot Sales Hub seating, GetResponse cost usually moves with list size. Paid plans advertise unlimited monthly email sends inside the contact band. Ideal for micro and small-business marketing teams building owned-channel programs.`,
        },
        {
          id: "gr-plans-threshold",
          heading: "Pricing threshold: Starter vs Marketer automation",
          body: "Pricing threshold: Starter is limited to 1 custom automation workflow and capped AI generator uses — if you need cart recovery or multi-step journeys, Marketer is the practical floor. Trade-off: you gain ecommerce and automation depth at Marketer+ at the expense of Starter’s lower entry. Creator adds webinars/courses for educator monetization.",
        },
        {
          id: "gr-plans-limits",
          heading: "Free window and Enterprise gates",
          body: `Documented limitations: ${lim.join(" ")}. Weak fit when you need a full sales CRM pipeline as the system of record — GetResponse is owned-channel marketing first. SMS, dedicated IP/domain, and some enterprise tools require Enterprise.`,
        },
        {
          id: "gr-plans-scenario",
          heading: "Scenario: ecommerce lifecycle email",
          body: "Use-case recommendation: for ecommerce needing cart recovery and promo tools, prefer Marketer or above. Compared with Keap, GetResponse differs because Keap centers client CRM records for service businesses, while GetResponse centers list-driven email and funnels. Prefer GetResponse when deliverability and lifecycle email are the job; prefer a CRM when pipeline stages are the job.",
        },
      ],
      checklist: [
        {
          id: "gr-c1",
          label: "Count contacts in the band you will inhabit in 6 months — not today’s list only",
        },
        {
          id: "gr-c2",
          label: "List automation workflows; if more than one, do not evaluate on Starter alone",
        },
        {
          id: "gr-c3",
          label: "Confirm whether webinars/courses (Creator) or SMS/IP (Enterprise) are required",
        },
      ],
    },
  };
}

function chooseCrmOverlay(): GuideEnrichmentOverlay {
  return {
    slug: "how-to-choose-crm",
    enrichmentType: "DECISION_GUIDE",
    updatedAt: now(),
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "buyer_checklist",
      "category_criteria",
    ],
    notes: ["Editorial decision framework refresh — batch 2026-09-06"],
    patch: {

      blocks: templateBreakBlocks({
        slug: "how-to-choose-crm",
        productName: "CRM selection",
        directAnswer: "Choose a CRM by operating job and hard constraints — not by brand shortlists.",
        bullets: [
          "Write one sentence for the weekly CRM job",
          "Set a year-one cost ceiling including implementation",
          "Price migration risk before signing",
        ],
        frameworkTitle: "Job-first CRM selection framework",
        frameworkSteps: [
          "Name the CRM job in one sentence",
          "List hard constraints (seats, objects, compliance)",
          "Build a three-tool shortlist that clears constraints",
          "Assign a migration owner before contract",
        ],
        scenarioTitle: "Scenario shortlists by job",
        scenarioBody: "Use-case recommendation: outbound teams → pipeline CRM; inbound → marketing+CRM; micro service firms → lightweight relationship CRM. Compared with buying HubSpot by default, job-first shortlists can surface Capsule, Pipedrive, or Zoho.",
        mistakes: [
          { title: "Logo shopping", body: "Weak fit process that starts with brands instead of constraints." },
          { title: "Ignoring cutover", body: "Migration risk kills ROI even when feature pages look complete." },
        ],
        takeaways: [
          "Job before brand",
          "Trade-off: feature breadth at the expense of adoption",
          "Worth running the finder only after constraints are written",
        ],
      }),
      summary:
        "Choosing a CRM starts with the operating job (pipeline velocity, relationship memory, or marketing+CRM combo) — not with brand shortlists. Use a constraint-first framework: users, objects, automation depth, and migration risk — then shortlist tools that clear those constraints.",
      seo: {
        title: "How to Choose a CRM: Job-First Framework (Not Brand Lists)",
        description:
          "A practical CRM selection framework: define the job, set hard constraints, score shortlists, and avoid hub sprawl — from SoftwareGlimpse.",
      },
      sections: [
        {
          id: "choose-job",
          heading: "Step 1 — Name the CRM job in one sentence",
          body: "Write one sentence: “We need a system of record for X so that Y happens weekly.” Pipeline velocity, relationship memory, and marketing automation are different jobs. If you cannot name the weekly behavior, you are shopping logos. Ideal for teams willing to time-box demos to that sentence.",
        },
        {
          id: "choose-constraints",
          heading: "Step 2 — Hard constraints before demos",
          body: "List non-negotiables: max seats, must-have objects (deals vs tickets vs marketing lists), offline mobile, and compliance. Pricing threshold: set a cost ceiling for year one including implementation. Trade-off: wider feature lists usually cost admin time — you gain capability at the expense of adoption.",
        },
        {
          id: "choose-scenarios",
          heading: "Step 3 — Scenario shortlists",
          body: "Use-case recommendation: for outbound sales teams, prefer pipeline-first CRMs; for inbound content teams, prefer marketing+CRM platforms; for micro service firms, prefer lightweight relationship CRM. Compared with buying HubSpot by default, a job-first shortlist differs because it can surface Capsule, Pipedrive, or Zoho when hub sprawl is the risk.",
        },
        {
          id: "choose-migration",
          heading: "Step 4 — Price migration risk explicitly",
          body: "Migration risk includes data mapping, cutover downtime, and re-training. Weak fit tools often fail here — not on feature pages. Ask vendors for import failure modes and who owns field mapping. Skip any tool that cannot explain contact vs deal vs ticket boundaries in your language.",
        },
      ],
      checklist: [
        { id: "ch1", label: "One-sentence CRM job written and shared with stakeholders" },
        { id: "ch2", label: "Year-one cost ceiling including implementation hours" },
        { id: "ch3", label: "Three-tool shortlist that each clears hard constraints" },
        { id: "ch4", label: "Migration owner named before signing" },
      ],
      nextAction: {
        contentId: "content:tool:crm-finder",
        label: "Run the CRM finder with your constraints",
      },
    },
  };
}

function whatIsCrmOverlay(): GuideEnrichmentOverlay {
  return {
    slug: "what-is-crm",
    enrichmentType: "DECISION_GUIDE",
    updatedAt: now(),
    uniqueValueAdded: ["decision_framework", "scenario_analysis", "category_criteria"],
    notes: ["Editorial orientation refresh — batch 2026-09-06"],
    patch: {

      blocks: templateBreakBlocks({
        slug: "what-is-crm",
        productName: "CRM",
        directAnswer: "A CRM is the system of record for contacts, companies, and opportunities — not a generic contact store and not an ESP.",
        bullets: [
          "Pipeline/opportunity objects are central",
          "Different from email marketing list tools",
          "Different from help desks that center tickets",
        ],
        frameworkTitle: "CRM boundary checklist",
        frameworkSteps: [
          "Confirm deals or client opportunities are first-class objects",
          "Separate CRM jobs from ESP and help-desk jobs",
          "Match buyer scenario: outbound, inbound, or service SMB",
          "Only then shortlist products",
        ],
        scenarioTitle: "Three buyer scenarios",
        scenarioBody: "Use-case recommendation: outbound → pipeline CRM; inbound → CRM with marketing alignment; service SMB → CRM with follow-up automation. Trade-off: suites reduce vendors at the expense of depth.",
        mistakes: [
          { title: "Calling every SaaS a CRM", body: "Weak fit definitions that treat shared inboxes as CRM." },
          { title: "Buying ESP for pipeline", body: "Compared with CRM, ESPs differ because list sends are central." },
        ],
        takeaways: [
          "Boundary definition prevents laundry-list pages",
          "CRM vs ESP vs help desk is the first decision",
          "Best for teams that need shared pipeline ownership",
        ],
      }),
      summary:
        "A CRM is software whose primary job is managing contacts, deals, and the sales (or client) pipeline as a system of record — not a generic database and not the same thing as an email marketing platform. Knowing that boundary is what keeps “what is CRM” from becoming a feature laundry list.",
      sections: [
        {
          id: "wic-def",
          heading: "Definition that draws a boundary",
          body: "CRM (customer relationship management) software keeps people, companies, and opportunities connected so teams share one timeline. Best for sales and client-service teams that need a shared pipeline. It is not worth treating every SaaS contact store as a CRM — shared inboxes and email tools alone are a weak fit when deal stages and forecasting matter.",
        },
        {
          id: "wic-vs",
          heading: "CRM vs adjacent categories",
          body: "Compared with email marketing platforms, a CRM differs because the deal/opportunity object and pipeline stages are central, whereas list sends are central to ESPs. Whereas help desks track tickets, CRMs track revenue relationships. Prefer a CRM when forecasting and ownership of accounts matter; prefer marketing automation when lifecycle email is the only job.",
        },
        {
          id: "wic-scenarios",
          heading: "Three buyer scenarios",
          body: "Use-case recommendation: for outbound sales, choose pipeline CRM; for inbound, choose CRM with marketing alignment; for service SMBs, choose CRM with follow-up automation. Trade-off: all-in-one suites reduce vendors at the expense of depth in any one job.",
        },
      ],
    },
  };
}

const OVERLAYS = [
  hubspotPlansOverlay(),
  hubspotWorthItOverlay(),
  keapPlansOverlay(),
  keapWorthItOverlay(),
  capsulePlansOverlay(),
  zohoPlansOverlay(),
  getresponsePlansOverlay(),
  chooseCrmOverlay(),
  whatIsCrmOverlay(),
];

function improveCategories() {
  const seedPath = path.join(ROOT, "src/data/seed/categories.ts");
  let src = readFileSync(seedPath, "utf8");
  const crmDesc =
    "CRM software for contacts, deals, and sales pipelines. Start from your operating job — pipeline velocity, relationship memory, or marketing+CRM — then shortlist tools that clear seat, object, and automation constraints. Not a generic software directory.";
  const crmShort =
    "Compare CRM software by job fit: pipeline CRM, relationship CRM, or marketing+CRM stacks — with clear limits and buyer scenarios.";
  const ecomDesc =
    "Ecommerce software covers storefronts, carts, and order operations. Separate storefront platforms from adjacent marketing, CRM, and fulfillment tools so you do not buy the wrong category for cart recovery or CRM jobs.";
  const ecomShort =
    "Explore ecommerce platforms and adjacent tools — storefront first, then marketing and operations add-ons.";

  // Replace CRM shortDescription / seo.description blocks carefully
  src = src.replace(
    /slug: "crm",\n    name: "CRM",\n    shortDescription:\n      "Find CRM software that fits your business, team, and sales process.",/,
    `slug: "crm",\n    name: "CRM",\n    shortDescription:\n      ${JSON.stringify(crmShort)},`,
  );
  src = src.replace(
    /title: "CRM Software",\n      description:\n        "Explore CRM software and choose tools that fit your sales process.",/,
    `title: "CRM Software: Choose by Job Fit, Not Brand Lists",\n      description:\n        ${JSON.stringify(crmDesc)},`,
  );
  src = src.replace(
    /slug: "ecommerce",\n    name: "Ecommerce",\n    shortDescription: "Ecommerce platforms and related software.",/,
    `slug: "ecommerce",\n    name: "Ecommerce",\n    shortDescription: ${JSON.stringify(ecomShort)},`,
  );
  src = src.replace(
    /title: "Ecommerce Software",\n      description: "Explore ecommerce software.",/,
    `title: "Ecommerce Software: Storefronts vs Adjacent Tools",\n      description: ${JSON.stringify(ecomDesc)},`,
  );

  // Add description field after shortDescription for crm if missing — Category schema allows description
  if (!src.includes('slug: "crm"') || !/slug: "crm"[\s\S]{0,400}description:/.test(src)) {
    src = src.replace(
      /(slug: "crm",\n    name: "CRM",\n    shortDescription:\n      "[^"]+",)/,
      `$1\n    description:\n      ${JSON.stringify(crmDesc)},`,
    );
  }
  writeFileSync(seedPath, src);
  console.log("Updated category seed CRM + ecommerce copy");
}

function improveSoftwareSeo() {
  // Patch research enrichment shortDescription notes into a small overlay file for batch record;
  // seed software SEO improvements via enrichment notes file consumed by summary.
  const out: Record<string, unknown> = {};
  for (const slug of [
    "hubspot",
    "getresponse",
    "keap",
    "capsule",
    "sanebox",
    "closely",
    "nimble",
    "diginius",
  ]) {
    const e = loadEnrichment(slug);
    const p = getSoftwareBySlug(slug);
    if (!e || !p) continue;
    const lim = limLines(slug, 2);
    out[slug] = {
      name: p.name,
      enrichmentShort: e.shortDescription,
      limitations: lim,
      hasFree: e.pricing?.hasFreePlan ?? null,
      hasTrial: e.pricing?.hasFreeTrial ?? null,
      planCount: e.pricing?.plans?.length ?? 0,
      seoSuggestion: {
        title: `${p.name} Review: Fit, Plans, and Limits`,
        description: `${e.shortDescription?.slice(0, 140) ?? p.shortDescription ?? p.name}. Limits: ${lim[0] ?? "verify plan caps on vendor quote."}`,
      },
    };
  }
  const dir = path.join(ROOT, "data/seo/batches");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "software-improvement-notes-2026-09-06.json"),
    JSON.stringify(out, null, 2),
  );
  console.log("Wrote software improvement notes from enrichment");
  return out;
}

function main() {
  const peers = getGuides({ includeUnpublished: true });
  const applyResults: Array<Record<string, unknown>> = [];

  for (const overlay of OVERLAYS) {
    const guide = getGuideBySlug(overlay.slug, { includeUnpublished: true });
    if (!guide) {
      console.error("missing", overlay.slug);
      continue;
    }
    const merged = mergeGuideWithOverlay(guide, overlay);
    const qa = runEnrichmentQa(merged, peers);
    if (!qa.ok) {
      console.error(
        "QA FAIL",
        overlay.slug,
        qa.findings.map((f) => f.code).join(","),
      );
      applyResults.push({
        slug: overlay.slug,
        applied: false,
        findings: qa.findings,
      });
      continue;
    }
    const overlayPath = saveGuideEnrichmentOverlay(overlay);
    const decision = validateAndMaybePromoteGuide(merged, {
      peerGuides: peers,
      promote: true,
    });
    const after = analyzePageQualityGate({
      pageType: "guide",
      slug: overlay.slug,
    });
    if (after) {
      recordGateResult(after, "after", {
        note: `batch-improve:${overlay.slug}`,
      });
    }
    applyResults.push({
      slug: overlay.slug,
      applied: true,
      overlayPath,
      promoted: decision.promoted,
      promoteOk: decision.ok,
      reasons: decision.reasons,
      qualityScore: after?.qualityScore,
      lifecycleState: after?.lifecycleState,
      indexEligible: after?.indexEligible,
    });
    console.log(
      "OK",
      overlay.slug,
      "promoted=",
      decision.promoted,
      "score=",
      after?.qualityScore,
      "life=",
      after?.lifecycleState,
    );
  }

  // zoho-crm-setup already applied — re-promote check
  {
    const slug = "zoho-crm-setup";
    const guide = getGuideBySlug(slug, { includeUnpublished: true })!;
    const overlay = existsSync(
      path.join(ROOT, "data/seo/guide-enrichment-overlays", `${slug}.json`),
    )
      ? (JSON.parse(
          readFileSync(
            path.join(
              ROOT,
              "data/seo/guide-enrichment-overlays",
              `${slug}.json`,
            ),
            "utf8",
          ),
        ) as GuideEnrichmentOverlay)
      : null;
    const merged = mergeGuideWithOverlay(guide, overlay);
    const decision = validateAndMaybePromoteGuide(merged, {
      peerGuides: peers,
      promote: true,
    });
    const after = analyzePageQualityGate({ pageType: "guide", slug });
    if (after)
      recordGateResult(after, "after", { note: `batch-improve:${slug}` });
    applyResults.push({
      slug,
      applied: Boolean(overlay),
      promoted: decision.promoted,
      promoteOk: decision.ok,
      reasons: decision.reasons,
      qualityScore: after?.qualityScore,
      lifecycleState: after?.lifecycleState,
    });
    console.log(
      "OK",
      slug,
      "promoted=",
      decision.promoted,
      "score=",
      after?.qualityScore,
    );
  }

  improveCategories();
  const softwareNotes = improveSoftwareSeo();

  // Patch batch file with guide improve results
  const batch = JSON.parse(readFileSync(BATCH, "utf8"));
  batch.phase = "guides-improved";
  batch.guideApplyResults = applyResults;
  batch.softwareNotesPath =
    "data/seo/batches/software-improvement-notes-2026-09-06.json";
  writeFileSync(BATCH, JSON.stringify(batch, null, 2));
  console.log("Guide overlays done:", applyResults.length);
  void softwareNotes;
}

main();
