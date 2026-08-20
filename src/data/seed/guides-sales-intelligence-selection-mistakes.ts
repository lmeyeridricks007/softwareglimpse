import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Selection Mistakes — avoid the buys teams regret.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceSelectionMistakesGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Most regretted sales intelligence buys skip a primary-job statement, ignore credit definitions, skip ICP coverage trials, enable CRM sync without mapping, or never prove export/exit. Decision rule: if any of those gaps is still open, pause signature — fix the gate artifact first (job sheet, credit diligence, scripted scores, sync rules, written exit).",
    bullets: [
      "No primary job",
      "Credit opacity",
      "No ICP trial",
      "Blind sync",
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
        body: "Job statement, credit checklist, ICP script, mapping sheet, export sample.",
      },
      {
        label: "Late demos amplify bias",
        body: "Without scores, the last polished tour wins.",
      },
      {
        label: "Regret shows up at renewal",
        body: "Credit burn and exit pain surface when switching is hardest.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "mistake-catch",
    title: "Catch mistakes before signature",
    steps: [
      { id: "job", label: "Job", short: "Primary job" },
      { id: "credits", label: "Credits", short: "Unit defined" },
      { id: "trial", label: "Fair trial", short: "Same ICP" },
      { id: "sync", label: "Sync", short: "Mapping signed" },
      { id: "exit", label: "Exit", short: "Export proved" },
    ],
    ctaHref: "/guides/sales-intelligence-selection-process/",
    ctaLabel: "Selection process →",
    figure: {
      src: "/guides/sales-intelligence-selection-mistakes-map.png",
      alt: "Catch SI selection mistakes before signature: primary job, credit unit, fair ICP trial, sync mapping, export proved.",
      caption:
        "Each common mistake maps to a concrete artifact — signature is not a substitute.",
    },
  },
  {
    type: "figure",
    id: "mistakes-map",
    title: "Five regret patterns",
    src: "/guides/sales-intelligence-selection-mistakes-map.png",
    alt: "Five SI selection mistake cards paired with fix artifacts: primary job, credit checklist, ICP trial script, CRM mapping sheet, export sample.",
    caption:
      "Each common mistake maps to a concrete artifact — not a vague “be careful.”",
  },
  {
    type: "step",
    id: "process-mistakes",
    stepNumber: 1,
    heading: "Process mistakes: job, theater, and bias",
    body: "Buying from a feature tour without a primary job, letting the vendor own the demo agenda, or changing scorecard weights midstream all produce preference dressed up as evaluation.\n\nExample: a 12-person outbound team almost signed after a charismatic all-in-one demo. They stopped, wrote “enrichment of 18k CRM records” as the primary job, ran the same ICP script on two finalists, and dropped the demo favorite when non-admin CRM sync failed.",
    tip: "If someone says “we’ll figure credits during onboarding,” you are still in discovery — not ready to buy.",
    figure: {
      src: "/guides/sales-intelligence-selection-mistakes-hero.png",
      alt: "Sales intelligence selection mistakes hero: warning pins and gate checkpoints on the path to signature.",
      caption:
        "Pause at open gates — signature is not a substitute for artifacts.",
    },
    scenarios: [
      {
        title: "No primary job",
        body: "Fix: freeze data vs enrichment vs engagement vs dialer.",
      },
      {
        title: "Demo theater",
        body: "Fix: buyer agenda; must-haves first.",
      },
      {
        title: "Last-demo bias",
        body: "Fix: same-day scores on one card.",
      },
    ],
  },
  {
    type: "step",
    id: "commercial-ops-mistakes",
    stepNumber: 2,
    heading: "Commercial and operating mistakes",
    body: "Comparing homepage “from” prices, ignoring credit unit definitions, assigning no RevOps owner for sync, and skipping export tests create renewal-time regret even when the UI looked fine.\n\nExample: the same team required written credit definitions, named RevOps for ~3 hours/week sync hygiene, and required a trial export sample before the decision memo.",
    tip: "A low seat band with opaque credits is not a savings — it is a deferred surprise.",
    scenarios: [
      {
        title: "Credit-opaque pick",
        body: "Fix: unit definition + 90-day volume quote.",
      },
      {
        title: "Sync vacuum",
        body: "Fix: mapping + overwrite sheet before production enable.",
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
    body: "Do not silently “hope onboarding fixes it.” Re-open the missing artifact: write the job, re-run a compressed ICP script, or send the vendor question bank before renewal auto-charges.\n\nExample: six weeks post-purchase, SDRs still rebuilt Mondays in Sheets. They paused new credits, rewrote the primary job, simplified filters, and scheduled a 30-day adoption review — treating process debt as the bug, not “more data.”",
    tip: "Buying a second database rarely cures missing sync ownership or empty verify steps.",
    scenarios: [
      {
        title: "Pre-signature gap",
        body: "Hard pause; complete job/scores/diligence.",
      },
      {
        title: "Early post-buy gap",
        body: "Stabilize unlock loop; defer nice-to-haves.",
      },
      {
        title: "Renewal looming",
        body: "Export test + credit-unit audit before you extend term.",
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
        body: "No job sheet, no ICP trial, no written credit unit.",
      },
      {
        title: "Buying on record-count marketing",
        body: "Global counts say nothing about your niche coverage.",
      },
      {
        title: "Nobody owns credits or sync",
        body: "Without RevOps ownership, data quality collapses regardless of product.",
      },
      {
        title: "Ignoring compliance until scale",
        body: "Collect sourcing docs for counsel early — educational, not legal advice.",
      },
      {
        title: "Skipping export until unhappy",
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
        question: "What is the #1 SI selection mistake?",
        answer:
          "Skipping a primary-job statement and ICP coverage trial, then buying from vendor theater. Decision rule: no demos until job, must-haves, and credit constraints are written.",
      },
      {
        question: "We already bought — now what?",
        answer:
          "Re-open missing artifacts, freeze credit expansion if hygiene is broken, and run Adoption + Data Quality gates. Do not add tools to paper over process debt.",
      },
      {
        question: "What should I do next?",
        answer:
          "Walk Selection Process gates, use Vendor Questions and Trial Evaluation, and catch open gaps with this checklist before signature.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-selection-process/",
        label: "Selection process",
        description: "Gates and owners.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Job-first frame.",
      },
      {
        href: "/guides/sales-intelligence-trial-evaluation/",
        label: "Trial evaluation",
        description: "Fair ICP evidence.",
      },
      {
        href: "/guides/sales-intelligence-vendor-questions/",
        label: "Vendor questions",
        description: "Diligence bank.",
      },
      {
        href: "/guides/sales-intelligence-credits-explained/",
        label: "Credits explained",
        description: "Fix credit opacity.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Shortlist context.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Fix the open gate before you sign",
    body: "Use the job-first frame and selection process — pause signature until artifacts exist.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceSelectionMistakesGuide: GuidePage = {
  id: "guide-sales-intelligence-selection-mistakes",
  slug: "sales-intelligence-selection-mistakes",
  title: "Sales Intelligence Selection Mistakes",
  summary:
    "Avoid regretted SI buys: missing primary job, opaque credits, skipped ICP trials, blind CRM sync, and unproven export — each with a fix artifact.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-selection-mistakes-hero.png",
    alt: "Sales intelligence selection mistakes hero: warning pins and gate checkpoints on the path to signature.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best Sales Intelligence",
  },
  relatedGuideSlugs: [
    "sales-intelligence-selection-process",
    "how-to-choose-sales-intelligence",
    "sales-intelligence-trial-evaluation",
    "sales-intelligence-vendor-questions",
    "sales-intelligence-credits-explained",
  ],
  blocks: salesIntelligenceSelectionMistakesGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Confirm primary job is written",
      description: "Before any demo.",
      order: 0,
    },
    {
      id: "artifacts",
      label: "Close credit, ICP, sync, and exit gaps",
      description: "Artifacts or pause.",
      order: 1,
    },
    {
      id: "memo",
      label: "Attach evidence to decision memo",
      description: "Before signature.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-17T08:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence Selection Mistakes | SoftwareGlimpse",
    description:
      "Avoid SI selection regret: primary job, credit clarity, ICP trials, CRM sync mapping, and export proof — with fix artifacts.",
    canonicalPath: "/guides/sales-intelligence-selection-mistakes/",
    indexable: true,
  },
};
