import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const emailMarketingRequirementsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write email marketing requirements from the primary job, must vs nice features, list/consent posture, and stack integrations — not from a feature wishlist copied from vendor sites. Decision rule: if a capability would disqualify the tool when missing, it is a must-have with a pass/fail test; everything else is nice-to-have until the shortlist is frozen.",
    bullets: [
      "Primary job + outcomes",
      "Must vs nice with tests",
      "List & consent rules",
      "Integrations & data sync",
      "Deliverability owners",
      "Demo-ready sheet",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Outcomes before features",
        body: "“Ship weekly newsletter + one nurture path” beats a 40-row feature matrix nobody will score.",
      },
      {
        label: "Must-haves need tests",
        body: "Each must-have gets a pass/fail check you can run in a trial — not a marketing checkbox.",
      },
      {
        label: "Consent and suppression are day-one",
        body: "Unsubscribe handling, suppression lists, and lawful basis are requirements — not afterthoughts.",
      },
      {
        label: "Freeze the sheet before demos",
        body: "Vendors will expand scope; your written sheet keeps demos comparable.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "req-path",
    title: "Requirements path",
    steps: [
      { id: "job", label: "Job", short: "Primary outcome" },
      { id: "must", label: "Must", short: "Pass/fail tests" },
      { id: "list", label: "List", short: "Consent & hygiene" },
      { id: "stack", label: "Stack", short: "Integrations" },
      { id: "sheet", label: "Sheet", short: "Demo-ready" },
    ],
    ctaHref: "/guides/email-marketing-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    figure: {
      src: "/guides/email-marketing-requirements-guide-hero.png",
      alt: "Email marketing requirements path: primary job, must-haves, consent, integrations, demo-ready sheet.",
      caption: "A frozen sheet makes demos fair — wishlist shopping does not.",
    },
  },
  {
    type: "step",
    id: "job-outcomes",
    stepNumber: 1,
    heading: "Name primary job and three observable outcomes",
    body: "Write the job in one sentence, then three outcomes you can see in weekly reviews (for example: newsletter ships every Tuesday; cart-abandon journey live; unsubscribe and bounce rates stay within agreed bands).\n\nExample: Harbor Studio’s job is “multi-brand newsletter production without template chaos.” Outcomes: two client brands live on shared templates, one approval workflow, and send logs a coordinator can audit without logging into each mailbox tool.",
    tip: "If an outcome cannot be observed in 30 days, it is a strategy hope — not a requirements line.",
    scenarios: [
      {
        title: "Newsletter job",
        body: "Template reuse, scheduling, and list hygiene tests.",
      },
      {
        title: "Automation job",
        body: "Trigger types, branching, and workflow limits on the target plan.",
      },
      {
        title: "Ecommerce job",
        body: "Store events, product blocks, and revenue reporting hooks.",
      },
    ],
  },
  {
    type: "step",
    id: "must-nice",
    stepNumber: 2,
    heading: "Split must vs nice and freeze stack rules",
    body: "List must-haves with pass/fail tests (import list, authenticate domain, build one journey, connect CRM or shop). Add nice-to-haves separately so demos cannot redefine scope. Freeze integration owners: which system is source of truth for email, which fields sync, and who owns suppression.\n\nExample: Northline Goods marks Shopify sync and cart triggers as must; AI subject-line assist as nice. CRM may receive campaign tags; ESP never overwrites order history.",
    tip: "Keep must-haves under ~10. A 30-must list means you have not prioritized.",
    figure: {
      src: "/guides/email-marketing-requirements-matrix.png",
      alt: "Must-have versus nice-to-have email marketing feature matrix by primary job.",
      caption: "Reuse this split in every vendor demo and trial scorecard.",
    },
  },
  {
    type: "feature-matrix",
    id: "must-nice-matrix",
    title: "Must-have vs nice-to-have (starter by job)",
    rows: [
      {
        feature: "Campaign / newsletter send",
        mustHave: true,
        niceToHave: false,
        notes: "Core ESP job",
      },
      {
        feature: "Subscriber management + unsubscribe",
        mustHave: true,
        niceToHave: false,
        notes: "Day-one compliance",
      },
      {
        feature: "Domain authentication guidance",
        mustHave: true,
        niceToHave: false,
        notes: "SPF/DKIM/DMARC path",
      },
      {
        feature: "Segmentation by attributes/behavior",
        mustHave: true,
        niceToHave: false,
        notes: "Avoid full-list blasts",
      },
      {
        feature: "Multi-step automation workflows",
        mustHave: false,
        niceToHave: true,
        notes: "Must only if automation is the job",
      },
      {
        feature: "Ecommerce / cart triggers",
        mustHave: false,
        niceToHave: true,
        notes: "Must only if ecommerce is the job",
      },
      {
        feature: "Landing pages / forms",
        mustHave: false,
        niceToHave: true,
        notes: "Must if growth depends on native LPs",
      },
      {
        feature: "AI content assistance",
        mustHave: false,
        niceToHave: true,
        notes: "Do not drive the buy",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How many must-haves should we have?",
        answer:
          "Prefer a short list you can actually test. If everything is must-have, you are collecting features — not writing requirements.",
      },
      {
        question: "Should compliance live on the requirements sheet?",
        answer:
          "Yes. Consent basis, unsubscribe handling, and regional constraints belong on the sheet before first send — not in a separate legal thread after go-live.",
      },
      {
        question: "What should I do next?",
        answer:
          "Run the evaluation guide’s shared trial script against the frozen sheet, then shortlist on Best Email Marketing Software.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related email marketing resources",
    links: [
      {
        href: "/guides/email-marketing-evaluation-guide/",
        label: "Evaluation guide",
        description: "Two-week trial scorecard.",
      },
      {
        href: "/guides/how-to-choose-email-marketing/",
        label: "How to choose",
        description: "Job-first framework.",
      },
      {
        href: "/best/email-marketing-software/",
        label: "Best email marketing software",
        description: "Methodology shortlist.",
      },
      {
        href: "/categories/email-marketing/",
        label: "Email marketing category",
        description: "Browse the catalogue.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Turn the sheet into a shortlist",
    body: "Once outcomes, must-haves, consent, and integrations are on the sheet, use How to Choose Email Marketing and the Best Email Marketing page — methodology-first, not affiliate-ordered.",
    href: "/best/email-marketing-software/",
    ctaLabel: "See Best Email Marketing Software →",
    variant: "finder",
  },
];

export const emailMarketingRequirementsGuide: GuidePage = {
  id: "guide-email-marketing-requirements-guide",
  slug: "email-marketing-requirements-guide",
  title:
    "Email Marketing Requirements Guide: Must-Haves, Consent & Stack Rules",
  summary:
    "Write demo-ready email marketing requirements from the primary job, must vs nice features, consent posture, and integrations — without feature-wishlist shopping.",
  categorySlugs: ["email-marketing"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/email-marketing-requirements-guide-hero.png",
    alt: "Email marketing requirements guide hero: primary job, must-haves, consent, and integrations feeding a demo-ready sheet.",
  },
  supports: [
    {
      contentId: "content:category:email-marketing",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:email-marketing-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:email-marketing-software",
    label: "See Best Email Marketing Software",
  },
  relatedGuideSlugs: [
    "how-to-choose-email-marketing",
    "email-marketing-evaluation-guide",
    "email-marketing-pricing-guide",
    "what-is-email-marketing",
  ],
  blocks: emailMarketingRequirementsGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name primary job + three outcomes",
      description: "Observable in weekly reviews.",
      order: 0,
    },
    {
      id: "must-nice",
      label: "Split must vs nice with tests",
      description: "Pass/fail checks for each must-have.",
      order: 1,
    },
    {
      id: "consent-stack",
      label: "Freeze consent & integration rules",
      description: "Suppression, sync ownership, source of truth.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T12:00:00.000Z",
    publishedAt: "2026-08-17T12:00:00.000Z",
    reviewedAt: "2026-08-17T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Email Marketing Requirements Guide | SoftwareGlimpse",
    description:
      "How to write email marketing requirements: primary job, must vs nice, consent, and stack rules — ready for fair demos and trials.",
    canonicalPath: "/guides/email-marketing-requirements-guide/",
    indexable: true,
  },
};
