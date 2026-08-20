import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM vs CDP — complementary systems, not substitutes.
 * Template: softwareglimpse-guide-template-v1
 */
const crmVsCdpBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "A CRM is the operational system for selling and serving relationships — contacts, deals, owners, tasks, and history. A CDP unifies identity, events, and audiences across channels for marketing and product activation. Decision rule: buy CRM when humans need to own follow-ups and pipeline; buy CDP when you need a durable identity/event layer — often both, with activation flowing CDP → CRM.",
    bullets: [
      "CRM = relationships & deals",
      "CDP = identity & events",
      "Not substitutes",
      "Activation: CDP → CRM",
      "Different primary users",
      "Buy for the job, not the acronym",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Different jobs",
        body: "CRM runs day-to-day selling and service. CDP builds a unified customer profile from behavioral and channel data.",
      },
      {
        label: "Not a replacement pair",
        body: "Replacing a CRM with a CDP (or vice versa) usually leaves a critical workflow uncovered.",
      },
      {
        label: "Data flows one way more often",
        body: "Audience segments and enriched profiles commonly push into CRM for sales and service action.",
      },
      {
        label: "Buyers confuse labels",
        body: "Some suites blur marketing, CRM, and CDP features — ask which system of record owns deals vs which owns identity graphs.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "which-system",
    title: "Which system do you actually need?",
    steps: [
      { id: "job", label: "Primary job", short: "Sell/serve vs unify data" },
      { id: "users", label: "Primary users", short: "Reps vs marketers/data" },
      { id: "records", label: "Core records", short: "Deals vs events/identity" },
      { id: "activation", label: "Activation path", short: "Who acts on the profile?" },
      { id: "stack", label: "Existing stack", short: "CRM already? Analytics?" },
      { id: "decide", label: "Decide", short: "CRM, CDP, or both" },
    ],
    ctaHref: "/guides/do-i-need-a-crm/",
    ctaLabel: "Do I need a CRM? →",
  },
  {
    type: "figure",
    id: "roles-visual",
    title: "CRM and CDP play different roles",
    src: "/guides/crm-vs-cdp-roles.png",
    alt: "Side-by-side diagram: CRM owns contacts, deals, and owners; CDP owns identity, events, and audiences, with activation flowing CDP to CRM.",
    caption: "Complementary systems — activation often pushes from CDP into CRM.",
  },
  {
    type: "step",
    id: "crm-role",
    stepNumber: 1,
    heading: "What CRM is for",
    body: "CRM is the operational system of record for relationships: who the customer is in a sales or service context, who owns follow-up, what stage a deal is in, and what happened last. Its value is execution — tasks, pipelines, handoffs — not building a cross-channel identity graph.\n\nExample: a DTC brand’s growth team uses a CDP to stitch web + email + app events into audiences. Sales still needs CRM so AEs can own wholesale opportunities, log calls, and run a Friday pipeline review. The CDP pushes a “high-intent wholesale” audience into CRM; it does not replace deal stages or owners.",
    tip: "If your pain is missed follow-ups, dual ownership, or opaque pipeline, start with CRM — not a CDP RFP.",
    scenarios: [
      {
        title: "Sales execution",
        body: "Pipeline stages, next steps, and activity history for reps and managers.",
      },
      {
        title: "Service continuity",
        body: "Shared account context so handoffs do not reset the relationship.",
      },
      {
        title: "Operational ownership",
        body: "Clear owners and workflows for human action on accounts and deals.",
      },
    ],
  },
  {
    type: "step",
    id: "cdp-role",
    stepNumber: 2,
    heading: "What CDP is for",
    body: "A CDP unifies customer identity and event streams (web, product, ads, email) into profiles and audiences. Marketing, product, and data teams use it to segment, personalize, and activate — often by syncing audiences or attributes into tools that execute outreach, including CRM.",
    tip: "If you lack a trustworthy identity layer across channels, a CDP may help — it still will not replace deal ownership in CRM.",
    figure: {
      src: "/guides/crm-vs-cdp-hero.png",
      alt: "Educational diagram contrasting CRM operational records with CDP identity, events, and audience activation.",
      caption: "Same customer — different systems of record for different jobs.",
    },
    scenarios: [
      {
        title: "Identity resolution",
        body: "Stitch known and anonymous identifiers into durable profiles.",
      },
      {
        title: "Event & behavioral data",
        body: "Capture product and channel events that CRM rarely models well.",
      },
      {
        title: "Audience activation",
        body: "Push segments into ads, email, and CRM for coordinated action.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "job-signals",
    title: "Signal matrix: CRM vs CDP",
    rows: [
      {
        feature: "Shared deal ownership & pipeline stages",
        mustHave: true,
        niceToHave: false,
        notes: "CRM job",
      },
      {
        feature: "Cross-channel identity graph",
        mustHave: true,
        niceToHave: false,
        notes: "CDP job",
      },
      {
        feature: "Rep tasks, sequences, forecasts",
        mustHave: true,
        niceToHave: false,
        notes: "CRM job",
      },
      {
        feature: "Behavioral event streams & audiences",
        mustHave: true,
        niceToHave: false,
        notes: "CDP job",
      },
      {
        feature: "Push segments into sales follow-up",
        mustHave: false,
        niceToHave: true,
        notes: "Often CDP → CRM",
      },
      {
        feature: "Buying CDP “instead of” CRM for sales teams",
        mustHave: false,
        niceToHave: true,
        notes: "Common misfit",
      },
    ],
  },
  {
    type: "size-match",
    id: "who-needs-what",
    title: "Who typically needs which",
    tiers: [
      {
        id: "small-sales",
        label: "Small sales team",
        description:
          "CRM first. CDP is rarely the first buy unless marketing already runs multi-channel identity work.",
        fitHints: ["Pipeline", "Owners", "Follow-ups"],
      },
      {
        id: "marketing-led",
        label: "Marketing + growth org",
        description:
          "CDP (or strong marketing data layer) for audiences; CRM still needed if sales closes and owns accounts.",
        fitHints: ["Segments", "Activation", "Handoff"],
      },
      {
        id: "product-led",
        label: "Product-led / high event volume",
        description:
          "CDP or warehouse-centric stack for product events; CRM for human-owned expansion and support.",
        fitHints: ["Events", "Identity", "Sales assist"],
      },
      {
        id: "enterprise",
        label: "Multi-team enterprise",
        description:
          "Often both — with clear ownership: who governs deals vs who governs the identity graph.",
        fitHints: ["Governance", "Integrations", "Admin owners"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common CRM vs CDP mistakes",
    items: [
      {
        title: "Treating them as substitutes",
        body: "A CDP does not give reps a working pipeline; a CRM does not unify anonymous cross-channel identity.",
      },
      {
        title: "Buying CDP to “fix” sales hygiene",
        body: "Missed follow-ups and unclean owners are CRM process problems — more profile data will not fix them.",
      },
      {
        title: "Ignoring activation design",
        body: "Without a clear path from audience → owner → next step, CDP segments never become sales action.",
      },
      {
        title: "Duplicate systems of record",
        body: "Letting both tools “own” the same customer fields without rules creates conflicting truths.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Is a CDP a type of CRM?",
        answer:
          "No. CRM centers on operational relationship management; CDP centers on unified customer data and activation. Some vendors bundle features, but the jobs remain distinct. Decision rule: buy CRM for owners and pipeline; buy CDP for identity and events — often both, with CDP activating into CRM.",
      },
      {
        question: "Do I need a CDP if I already have a CRM?",
        answer:
          "Only if you need cross-channel identity, event unification, or audience activation beyond what your CRM and marketing tools already provide reliably.",
      },
      {
        question: "Can CRM and CDP work together?",
        answer:
          "Yes — a common pattern is CDP enriching profiles and syncing audiences into CRM so sales and service act on the right accounts.",
      },
      {
        question: "What should I read next?",
        answer:
          "If you are deciding whether sales needs a system of record, start with Do I Need a CRM? Then use CRM Finder when you are ready to shortlist.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "Foundational definition.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Signals that you need a sales system of record.",
      },
      {
        href: "/guides/types-of-crm/",
        label: "Types of CRM",
        description: "Product shapes and classic typologies.",
      },
      {
        href: "/guides/crm-vs-marketing-automation/",
        label: "CRM vs marketing automation",
        description: "Sibling boundary comparison.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Buying framework after the boundary is clear.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Write data musts before you shop.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Shortlist a CRM for the sales job",
    body: "If your primary need is operational selling and service — not identity unification — CRM Finder maps your answers to researched products.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmVsCdpGuide: GuidePage = {
  id: "guide-crm-vs-cdp",
  slug: "crm-vs-cdp",
  title: "CRM vs CDP: Different Jobs, Complementary Systems",
  summary:
    "Learn how CRM and customer data platforms differ — relationships and deals versus identity, events, and audiences — and why activation often flows CDP → CRM instead of replacing either system.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "comparison-education",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/crm-vs-cdp-hero.png",
    alt: "Educational diagram contrasting CRM operational records with CDP identity, events, and audience activation.",
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
    "what-is-crm",
    "do-i-need-a-crm",
    "types-of-crm",
    "crm-vs-marketing-automation",
    "crm-vs-customer-service-software",
    "how-crm-works",
    "how-to-choose-crm",
  ],
  blocks: crmVsCdpBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Sell/serve relationships vs unify identity & events.",
      order: 0,
    },
    {
      id: "users",
      label: "Name primary users",
      description: "Reps/service vs marketing/data/product.",
      order: 1,
    },
    {
      id: "activation",
      label: "Sketch activation path",
      description: "Where do audiences become owned follow-ups?",
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
    title: "CRM vs CDP Explained | SoftwareGlimpse",
    description:
      "CRM vs CDP: operational relationships and deals versus identity, events, and audiences — complementary systems, not substitutes.",
    canonicalPath: "/guides/crm-vs-cdp/",
    indexable: true,
  },
};
