import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const hrRequirementsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write HR requirements as jobs and evidence, not feature wishlists: primary job (ATS vs WFM vs time vs SOP vs LMS), must-have workflows, mobile/frontline needs, integrations, reporting cadence, and who updates the system weekly. Decision rule: every must-have must map to a weekly outcome and a plan or hub tier you are willing to buy.",
    bullets: [
      "Primary job statement",
      "Must-have workflows",
      "Mobile / frontline needs",
      "Integrations list",
      "Reporting cadence",
      "Roles & permissions",
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
        body: "GPS clock-in, multi-pool hiring, and SSO must-haves imply a qualifying configuration — write that explicitly.",
      },
      {
        label: "Clusters need their own sheet",
        body: "ATS, time-clock, and LMS requirements should not pollute a single undifferentiated RFP.",
      },
    ],
  },
  {
    type: "step",
    id: "write-jobs",
    stepNumber: 1,
    heading: "Write three job statements",
    body: "Capture: (1) who updates the system, (2) who needs visibility, (3) which payroll/HRIS tools must sync.\n\nWorked example: Harbor Retail wrote “Site managers publish shifts by Thursday; district leads need coverage without chasing SMS; payroll needs exported timesheets weekly.”",
    tip: "Reject any requirement that cannot be tested in a two-week trial.",
  },
  {
    type: "step",
    id: "score-sheet",
    stepNumber: 2,
    heading: "Build a one-page score sheet",
    body: "Columns: requirement, must/nice, evidence to collect in trial, qualifying plan/hub. Rows for hiring workflow, scheduling, time & attendance, SOP/training, integrations, mobile readiness, security basics.\n\nThis guide is the requirements surface for HR buyers on SoftwareGlimpse — full CRM-style requirement-detail hubs remain CRM-primary.",
    tip: "Score only inside one job cluster per sheet.",
    figure: {
      src: "/guides/hr-requirements-guide-sheet.png",
      alt: "One-page HR requirements score sheet with must/nice columns.",
      caption: "One page beats a 40-row feature dump — every must-have needs evidence and a plan tier.",
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
    href: "/guides/hr-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    variant: "finder",
  },
];

export const hrRequirementsGuide: GuidePage = {
  id: "guide-hr-requirements-guide",
  slug: "hr-requirements-guide",
  title: "HR Software Requirements Guide",
  summary:
    "A practical requirements sheet for ATS, frontline WFM, time & attendance, SOP training, and LMS purchases.",
  categorySlugs: ["hr"],
  topicType: "checklist",
  heroVisual: {
    src: "/guides/hr-requirements-guide-hero.png",
    alt: "Educational illustration for HR Software Requirements Guide.",
  },
  supports: [
    {
      contentId: "content:category:hr",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:hr-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-hr-software",
    "how-to-choose-hr-software",
    "hr-pricing-guide",
    "hr-evaluation-guide",
  ],
  blocks: hrRequirementsGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T00:00:00.000Z",
    publishedAt: "2026-08-17T00:00:00.000Z",
    reviewedAt: "2026-08-17T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "HR Software Requirements Guide | SoftwareGlimpse",
    description:
      "Write HR software requirements by job cluster — ATS, WFM, time & attendance, SOP training, and LMS — with must/nice evidence.",
    canonicalPath: "/guides/hr-requirements-guide/",
    indexable: true,
  },
};
