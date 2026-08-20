import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Selection Mistakes — avoid the buys teams regret.
 * Template: softwareglimpse-guide-template-v1
 */
const crmSelectionMistakesBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Most regretted CRM buys skip a requirements sheet, let vendor demos set the agenda, compare starting prices instead of qualifying plans, forget who will admin, or never prove data exit. Decision rule: if any of those five gaps is still open, pause signature — fix the gate artifact first (sheet, scripted scores, written diligence).",
    bullets: [
      "No sheet",
      "Demo theater",
      "Price-only",
      "Admin vacuum",
      "No exit",
      "Pause to fix",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Mistakes are process failures",
        body: "Features rarely “betray” you; missing gates do.",
      },
      {
        label: "Each mistake has a fix artifact",
        body: "Sheet, agenda, Calculator band, RACI, export test.",
      },
      {
        label: "Late demos amplify bias",
        body: "Without scores, the last polished tour wins.",
      },
      {
        label: "Regret shows up at renewal",
        body: "Plan gates and exit pain surface when switching is hardest.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "mistake-catch",
    title: "Catch mistakes before signature",
    steps: [
      { id: "sheet", label: "Sheet", short: "Requirements" },
      { id: "fair", label: "Fair eval", short: "Same script" },
      { id: "cost", label: "Cost truth", short: "Qualifying plan" },
      { id: "owners", label: "Owners", short: "Admin named" },
      { id: "exit", label: "Exit", short: "Export proved" },
    ],
    ctaHref: "/guides/crm-selection-process/",
    ctaLabel: "Selection process →",
    figure: {
      src: "/guides/crm-selection-mistakes-catch.png",
      alt: "Catch CRM selection mistakes before signature: requirements sheet, fair eval, cost truth, admin owners, export proved.",
      caption:
        "Each common mistake maps to a concrete artifact — signature is not a substitute.",
    },
  },
  {
    type: "figure",
    id: "mistakes-map",
    title: "Five regret patterns",
    src: "/guides/crm-selection-mistakes-map.png",
    alt: "Five CRM selection mistake cards paired with fix artifacts: requirements sheet, buyer agenda, cost calculator, RACI admin owner, export sample.",
    caption:
      "Each common mistake maps to a concrete artifact — not a vague “be careful.”",
  },
  {
    type: "step",
    id: "process-mistakes",
    stepNumber: 1,
    heading: "Process mistakes: sheet, theater, and bias",
    body: "Buying from a feature tour without a must/nice sheet, letting the vendor own the demo agenda, or changing scorecard weights midstream all produce the same outcome: preference dressed up as evaluation.\n\nExample: a 12-person B2B advisory team almost signed after a charismatic demo. They stopped, wrote three 90-day outcomes in the Requirements Builder, ran the same non-admin script on two finalists, and dropped the demo favorite when sellers could not update next steps without an admin.",
    tip: "If someone says “we’ll figure requirements during onboarding,” you are still in discovery — not ready to buy.",
    figure: {
      src: "/guides/crm-selection-mistakes-hero.png",
      alt: "CRM selection mistakes hero: warning pins and gate checkpoints on the path to signature.",
      caption:
        "Pause at open gates — signature is not a substitute for artifacts.",
    },
    scenarios: [
      {
        title: "No requirements sheet",
        body: "Fix: freeze must vs nice + constraints before demos.",
      },
      {
        title: "Demo theater",
        body: "Fix: buyer agenda; must-haves first (Demo Guide).",
      },
      {
        title: "Last-demo bias",
        body: "Fix: same-day scores on one card (Evaluation Guide).",
      },
    ],
  },
  {
    type: "step",
    id: "commercial-ops-mistakes",
    stepNumber: 2,
    heading: "Commercial and operating mistakes",
    body: "Comparing homepage “from” prices, ignoring add-on/plan gates, assigning no admin owner, and skipping export tests create renewal-time regret even when the UI looked fine.\n\nExample: the same advisory team used the Cost Calculator only on plans that included email sync and board reporting, named ops for ~2 hours/week admin, and required a trial export sample before the decision memo.",
    tip: "A low seat band on the wrong tier is not a savings — it is a deferred upgrade.",
    figure: {
      src: "/guides/crm-selection-mistakes-commercial.png",
      alt: "Commercial and operating CRM selection mistakes: map must-haves to plan, Calculator band, name admin R/A, prove export, memo before sign.",
      caption:
        "A low seat band on the wrong tier is not a savings — it is a deferred upgrade.",
    },
    scenarios: [
      {
        title: "Price-only pick",
        body: "Fix: map must-haves → qualifying plan → Calculator band.",
      },
      {
        title: "Admin vacuum",
        body: "Fix: name R/A for fields, users, hygiene before signature.",
      },
      {
        title: "No exit plan",
        body: "Fix: written export path + sample in trial.",
      },
    ],
  },
  {
    type: "step",
    id: "recovery",
    stepNumber: 3,
    heading: "If you already skipped a gate",
    body: "Do not silently “hope onboarding fixes it.” Re-open the missing artifact: write the sheet, re-run a compressed trial script, or send the vendor question bank before renewal auto-charges.\n\nExample: six weeks post-purchase, the team still rebuilt Fridays in Sheets. They paused new automation, rewrote outcomes, simplified fields, and scheduled a 30-day adoption review — treating process debt as the bug, not “more features.”",
    tip: "Adding marketplace apps rarely cures a missing ownership SLA or empty next-step field.",
    figure: {
      src: "/guides/crm-selection-mistakes-recover.png",
      alt: "If you already skipped a CRM selection gate: hard pause, reopen artifact, compress trial, stabilize core loop, defer nice-to-haves.",
      caption:
        "Do not hope onboarding fixes a missing gate — reopen the artifact and stabilize the core loop.",
    },
    scenarios: [
      {
        title: "Pre-signature gap",
        body: "Hard pause; complete sheet/scores/diligence.",
      },
      {
        title: "Early post-buy gap",
        body: "Stabilize core loop; defer nice-to-haves.",
      },
      {
        title: "Renewal looming",
        body: "Export test + plan-gate audit before you extend term.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "High-cost selection mistakes",
    items: [
      {
        title: "Signing after one demo",
        body: "No sheet, no non-admin trial, no written plan gates.",
      },
      {
        title: "Buying the cheapest tile",
        body: "Must-haves live on another tier — confirm before comparing.",
      },
      {
        title: "Nobody owns the CRM",
        body: "Without an admin, data quality collapses regardless of product.",
      },
      {
        title: "Ignoring integrations you already live in",
        body: "Marketplace logos are not your workflow proof.",
      },
      {
        title: "Skipping export until you are unhappy",
        body: "Exit is cheapest to learn on day one.",
      },
      {
        title: "Re-weighting the scorecard to crown a favorite",
        body: "Freeze weights before trials; document tradeoffs instead.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is the #1 CRM selection mistake?",
        answer:
          "Skipping a demo-ready requirements sheet and letting vendor theater define success. Decision rule: no demos until outcomes, must-haves, and constraints are written.",
      },
      {
        question: "We already bought — is this guide still useful?",
        answer:
          "Yes. Use the same gates to diagnose adoption failure: sheet clarity, admin owner, core-loop usability, and exit readiness before you add complexity.",
      },
      {
        question: "How do I avoid price-only decisions?",
        answer:
          "Map must-haves to qualifying plans, estimate with the Cost Calculator, and list TCO categories from the Total Cost Guide — never invent dollar totals.",
      },
      {
        question: "How many tools should we evaluate?",
        answer:
          "Usually two or three finalists after a constrained shortlist. More demos without scores increase bias, not insight.",
      },
      {
        question: "What should I do next?",
        answer:
          "Walk Selection Process gates, build the sheet in Requirements Builder or the Requirements Guide, shortlist with CRM Finder, then evaluate fairly.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Full selection framework.",
      },
      {
        href: "/guides/crm-selection-process/",
        label: "CRM selection process",
        description: "Gates and owners.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Fix the missing sheet.",
      },
      {
        href: "/guides/crm-evaluation-guide/",
        label: "CRM evaluation guide",
        description: "Fair scores and scripts.",
      },
      {
        href: "/guides/crm-vendor-evaluation/",
        label: "CRM vendor evaluation",
        description: "Diligence before signature.",
      },
      {
        href: "/guides/crm-demo-guide/",
        label: "CRM demo guide",
        description: "Avoid theater.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Constrained shortlist.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Must vs nice sheet.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Keep weights fixed across finalists.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Qualifying plan bands.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Restart from a constrained shortlist",
    body: "If selection went off-rails, rebuild a small finalist set with CRM Finder — then re-run sheet, script, and diligence gates.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmSelectionMistakesGuide: GuidePage = {
  id: "guide-crm-selection-mistakes",
  slug: "crm-selection-mistakes",
  title: "CRM Selection Mistakes: Avoid the Buys Teams Regret",
  summary:
    "The most common CRM selection mistakes — demo theater, no requirements sheet, seat-price-only math, admin vacuum, and skipping exit — and how to catch each before signature.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-selection-mistakes-hero.png",
    alt: "CRM selection mistakes hero: warning signs on a path from Demo to Signature with detour gates labeled Sheet, Trial, Diligence.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:crm-software",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "how-to-choose-crm",
    "crm-selection-process",
    "crm-requirements-guide",
    "crm-evaluation-guide",
    "crm-vendor-evaluation",
    "crm-demo-guide",
    "common-crm-mistakes",
    "crm-business-case",
  ],
  blocks: crmSelectionMistakesBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "sheet-exists",
      label: "Confirm requirements sheet exists",
      description: "Must vs nice + constraints before demos.",
      order: 0,
    },
    {
      id: "fair-scores",
      label: "Confirm same script scored for each finalist",
      description: "Non-admin evidence, not last-demo bias.",
      order: 1,
    },
    {
      id: "diligence-done",
      label: "Confirm exit + plan gates in writing",
      description: "No signature on theater alone.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T08:00:00.000Z",
    publishedAt: "2026-08-14T08:00:00.000Z",
    reviewedAt: "2026-08-14T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "CRM Selection Mistakes: Avoid the Buys Teams Regret | SoftwareGlimpse",
    description:
      "Common CRM selection mistakes and fixes: demo theater, missing requirements, price-only decisions, admin vacuum, and skipped exit planning.",
    canonicalPath: "/guides/crm-selection-mistakes/",
    indexable: true,
  },
};
