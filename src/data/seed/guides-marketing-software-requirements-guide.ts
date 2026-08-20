import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const marketingRequirementsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write marketing requirements as jobs and evidence, not feature wishlists: primary job (schedule vs funnel vs MAP vs listen vs webinar), must-have workflows, volume unit, integrations, reporting cadence, and who publishes or triages weekly. Decision rule: every must-have must map to a weekly outcome and a plan tier you are willing to buy.",
    bullets: [
      "Primary job statement",
      "Must-have workflows",
      "Volume unit (channel / contact / mention)",
      "Integrations list",
      "Reporting cadence",
      "Roles & approvals",
    ],
  },
  {
    type: "key-takeaways",
    id: "kt",
    title: "Key takeaways",
    items: [
      {
        label: "Separate must from nice",
        body: "If the team still operates without it for 90 days, it is nice-to-have.",
      },
      {
        label: "Requirements own plan gates",
        body: "Approvals, branching journeys, and mention history must-haves imply a qualifying configuration — write that explicitly.",
      },
      {
        label: "Clusters need their own sheet",
        body: "Scheduler, MAP, and listening requirements should not pollute a single undifferentiated RFP.",
      },
    ],
  },
  {
    type: "step",
    id: "write-jobs",
    stepNumber: 1,
    heading: "Write three job statements",
    body: "Capture: (1) who publishes or builds, (2) who needs visibility or legal review, (3) which CRM/ESP tools must sync.\n\nWorked example: Harbor Creative wrote “Social lead queues posts by Wednesday; brand reviews in-app; HubSpot needs UTM-consistent landing pages.”",
    tip: "Reject any requirement that cannot be tested in a two-week trial.",
  },
  {
    type: "step",
    id: "score-sheet",
    stepNumber: 2,
    heading: "Build a one-page score sheet",
    body: "Columns: requirement, must/nice, evidence to collect in trial, qualifying plan. Rows for publishing, funnels, journeys, listening, events, integrations, reporting, security basics.\n\nThis guide is the requirements surface for marketing buyers on SoftwareGlimpse — do not start from a vendor feature grid.",
    tip: "Score only inside one job cluster per sheet.",
    figure: {
      src: "/guides/marketing-software-requirements-guide-sheet.png",
      alt: "One-page marketing requirements score sheet with must/nice columns.",
      caption:
        "One page beats a 40-row feature dump — every must-have needs evidence and a plan tier.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should requirements include scores?",
        answer:
          "No invented product scores. Capture evidence against your jobs; use Best page methodology for cluster editor’s picks.",
      },
      {
        question: "How many must-haves is too many?",
        answer:
          "If more than roughly eight items are must-haves, you are still in wishlist mode — force a ranking.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Turn the score sheet into an evaluation script.",
    href: "/guides/marketing-software-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    variant: "finder",
  },
];

export const marketingSoftwareRequirementsGuide: GuidePage = {
  id: "guide-marketing-software-requirements-guide",
  slug: "marketing-software-requirements-guide",
  title: "Marketing Software Requirements Guide",
  summary:
    "A practical requirements sheet for social scheduling, funnels, MAP, listening, and webinar purchases.",
  categorySlugs: ["marketing"],
  topicType: "checklist",
  heroVisual: {
    src: "/guides/marketing-software-requirements-guide-hero.png",
    alt: "Educational illustration for Marketing Software Requirements Guide.",
  },
  supports: [
    {
      contentId: "content:category:marketing",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:marketing-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-marketing-software",
    "how-to-choose-marketing-software",
    "marketing-software-pricing-guide",
    "marketing-software-evaluation-guide",
  ],
  blocks: marketingRequirementsGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T12:00:00.000Z",
    publishedAt: "2026-08-18T12:00:00.000Z",
    reviewedAt: "2026-08-18T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Marketing Software Requirements Guide | SoftwareGlimpse",
    description:
      "Write marketing software requirements by job cluster — scheduling, funnels, MAP, listening, and webinars — with must/nice evidence.",
    canonicalPath: "/guides/marketing-software-requirements-guide/",
    indexable: true,
  },
};
