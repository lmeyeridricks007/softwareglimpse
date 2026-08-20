import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Selection Process — gates, owners, timeline.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceSelectionProcessGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Run sales intelligence selection as a gated process — Define job → Requirements → Shortlist → Demo/trial → Decide → Rollout — with a named owner for each gate. Decision rule: do not advance stages until the gate artifact exists (primary job, requirements sheet, scored shortlist, decision memo); skipping gates is how teams buy from the last demo.",
    bullets: [
      "Define job",
      "Requirements sheet",
      "Shortlist",
      "Demo & trial",
      "Decide",
      "Rollout plan",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Process beats preference",
        body: "A short RACI and timeline prevent endless demos and silent vetoes.",
      },
      {
        label: "Every gate needs an artifact",
        body: "Job statement, sheet, scores, and a written decision keep the team aligned.",
      },
      {
        label: "Owners unblock speed",
        body: "Ambiguous “the team will decide” stalls more buys than missing features.",
      },
      {
        label: "Rollout is part of selection",
        body: "Who owns credits, sync, training, and hygiene should be named before signature.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "process-stages",
    title: "Selection process stages",
    steps: [
      { id: "define", label: "Define", short: "Primary job" },
      { id: "requirements", label: "Requirements", short: "Sheet ready" },
      { id: "shortlist", label: "Shortlist", short: "2–3 tools" },
      { id: "trial", label: "Demo/trial", short: "Same script" },
      { id: "decide", label: "Decide", short: "Scored pick" },
      { id: "rollout", label: "Rollout", short: "Owners set" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose →",
    figure: {
      src: "/guides/sales-intelligence-selection-process-map.png",
      alt: "SI selection roadmap stages from primary job through decision and rollout with gate artifacts.",
      caption: "Walk stages in order; gate artifacts prevent demo-driven jumps.",
    },
  },
  {
    type: "figure",
    id: "raci-visual",
    title: "RACI / gate owners",
    src: "/guides/sales-intelligence-selection-process-map.png",
    alt: "RACI-style diagram showing who is responsible and accountable across SI selection gates: define job, requirements, shortlist, trial, decide, rollout.",
    caption:
      "Name R/A for each gate before demos start — consulted voices advise; they do not silently veto later.",
  },
  {
    type: "step",
    id: "gates-and-owners",
    stepNumber: 1,
    heading: "Assign owners to each gate",
    body: "Map Responsible and Accountable people for Define, Requirements, Shortlist, Demo/trial, Decide, and Rollout. Consult SDRs early; keep one accountable decider.\n\nExample: a 6-person outbound team sets RACI — founder Accountable for Decide; RevOps Responsible for requirements sheet and credit model; SDRs Responsible for trial scores; privacy Consulted on sourcing docs; finance Informed on budget posture. Gate rule: no vendor demo until primary job and must-haves are marked complete.",
    tip: "Write the RACI on one page. If two people think they are Accountable for Decide, fix that before shortlisting.",
    figure: {
      src: "/guides/sales-intelligence-selection-process-hero.png",
      alt: "Sales intelligence selection process hero: Define through Rollout with owners and timeline.",
      caption:
        "Selection is a staged process with owners — not a series of unrelated demos.",
    },
    scenarios: [
      {
        title: "Define",
        body: "Confirm primary job (data / enrichment / engagement / dialer).",
      },
      {
        title: "Requirements",
        body: "RevOps owns must vs nice + credit/sync constraints.",
      },
      {
        title: "Decide",
        body: "One accountable person signs the memo from scores.",
      },
    ],
  },
  {
    type: "step",
    id: "timeline",
    stepNumber: 2,
    heading: "Set a realistic timeline",
    body: "Small teams often finish Define through Decide in a few weeks if artifacts stay thin. Block calendar for scripted ICP trials; do not stack five demos in two days without scoring time.\n\nExample: three-week calendar — week 1 Define + requirements, week 2 shortlist + two scripted trials, week 3 diligence questions + decision memo + rollout owner checklist. They refuse “just one more tool” after scores lock unless a hard constraint failed.",
    tip: "Schedule scorecard fill-in the same day as each trial. Delay is how preference replaces evidence.",
    scenarios: [
      {
        title: "Too fast",
        body: "Contract after one demo — no ICP sample or credit diligence.",
      },
      {
        title: "Too slow",
        body: "Months of demos with rotating stakeholders and no Accountable decider.",
      },
      {
        title: "Healthy pace",
        body: "Gates clear with artifacts; timeline has scoring and diligence days.",
      },
    ],
  },
  {
    type: "selection-checklist",
    id: "gate-checklist",
    title: "Gate checklist",
    dimensions: [
      {
        id: "define",
        label: "Define gate",
        options: ["Primary job named", "90-day outcomes", "Budget posture"],
      },
      {
        id: "requirements",
        label: "Requirements gate",
        options: ["Must vs nice", "Credit constraints", "CRM sync needs"],
      },
      {
        id: "shortlist",
        label: "Shortlist gate",
        options: ["2–3 tools", "Hard filters applied", "Trial accounts ready"],
      },
      {
        id: "trial",
        label: "Demo/trial gate",
        options: ["Shared ICP sample", "Scores filled", "Non-admin ran tasks"],
      },
      {
        id: "decide",
        label: "Decide gate",
        options: ["Decision memo", "Diligence open items", "Rollout owners named"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Process mistakes",
    items: [
      {
        title: "Skipping the primary job",
        body: "All-in-one shopping without a blocking job statement.",
      },
      {
        title: "Demos before the sheet",
        body: "Vendor theater defines success.",
      },
      {
        title: "No rollout owners at signature",
        body: "Credits and sync orphaned on day two.",
      },
      {
        title: "Re-opening shortlist after scores",
        body: "Preference dressed as “one more look.”",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How long should SI selection take?",
        answer:
          "Often a few weeks for small teams when artifacts stay thin and trials are scripted. Stretch for real security/privacy review — not for endless demos.",
      },
      {
        question: "Who should be Accountable for Decide?",
        answer:
          "One person — usually the budget owner or sales leader — who signs the memo from scored evidence. Committees can Consult; they should not silently veto later.",
      },
      {
        question: "What should I do next?",
        answer:
          "Write the primary job, complete the requirements sheet, then follow How to Choose and Trial Evaluation for fair evidence.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Job-first decision frame.",
      },
      {
        href: "/guides/sales-intelligence-trial-evaluation/",
        label: "Trial evaluation",
        description: "Hands-on gate evidence.",
      },
      {
        href: "/guides/sales-intelligence-vendor-questions/",
        label: "Vendor questions",
        description: "Diligence bank.",
      },
      {
        href: "/guides/sales-intelligence-selection-mistakes/",
        label: "Selection mistakes",
        description: "What to catch before signature.",
      },
      {
        href: "/guides/sales-intelligence-total-cost-guide/",
        label: "Total cost guide",
        description: "Cost categories for the memo.",
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
    title: "Start with the primary job",
    body: "Lock Define and Requirements before demos — then shortlist inside the job-first frame.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceSelectionProcessGuide: GuidePage = {
  id: "guide-sales-intelligence-selection-process",
  slug: "sales-intelligence-selection-process",
  title: "Sales Intelligence Selection Process",
  summary:
    "Run SI selection as gated stages with owners — Define job → Requirements → Shortlist → Trial → Decide → Rollout — so artifacts beat last-demo bias.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-selection-process-hero.png",
    alt: "Sales intelligence selection process hero: Define through Rollout stages with owners and timeline.",
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
    "how-to-choose-sales-intelligence",
    "sales-intelligence-trial-evaluation",
    "sales-intelligence-vendor-questions",
    "sales-intelligence-selection-mistakes",
    "sales-intelligence-total-cost-guide",
  ],
  blocks: salesIntelligenceSelectionProcessGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "raci",
      label: "Write RACI for each gate",
      description: "One Accountable for Decide.",
      order: 0,
    },
    {
      id: "artifacts",
      label: "Require artifacts before advancing",
      description: "Job, sheet, scores, memo.",
      order: 1,
    },
    {
      id: "rollout-owners",
      label: "Name rollout owners before signature",
      description: "Credits, sync, training, hygiene.",
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
    title: "Sales Intelligence Selection Process | SoftwareGlimpse",
    description:
      "Gated SI selection process with owners: primary job, requirements, shortlist, trial, decide, rollout.",
    canonicalPath: "/guides/sales-intelligence-selection-process/",
    indexable: true,
  },
};
