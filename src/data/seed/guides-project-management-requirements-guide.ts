import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const projectManagementRequirementsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write project management requirements as jobs and evidence, not feature wishlists: primary job (work OS vs specialist), must-have views, automation rules, integrations, reporting cadence, and who updates work weekly. Decision rule: every must-have must map to a weekly outcome and a plan tier you are willing to buy.",
    bullets: [
      "Primary job statement",
      "Must-have views",
      "Automation scenarios",
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
        body: "If the project still runs without it for 90 days, it is nice-to-have.",
      },
      {
        label: "Requirements own plan gates",
        body: "Timeline and automation must-haves imply a qualifying plan — write that explicitly.",
      },
      {
        label: "Specialists need their own sheet",
        body: "PDF, remote desktop, and desktop workspace requirements should not pollute a work OS RFP.",
      },
    ],
  },
  {
    type: "step",
    id: "write-jobs",
    stepNumber: 1,
    heading: "Write three job statements",
    body: "Capture: (1) who updates work, (2) who needs visibility, (3) which external tools must sync.\n\nWorked example: Harbor Studio wrote “Designers update cards daily; account leads need status without chasing Slack; Figma and Google Drive must attach to the work item.”",
    tip: "Reject any requirement that cannot be tested in a two-week trial.",
  },
  {
    type: "step",
    id: "score-sheet",
    stepNumber: 2,
    heading: "Build a one-page score sheet",
    body: "Columns: requirement, must/nice, evidence to collect in trial, qualifying plan. Rows for boards, timeline, automation, integrations, reporting, security basics.\n\nThis guide is the requirements surface for project-management buyers on SoftwareGlimpse — full CRM-style requirement-detail hubs remain CRM-primary.",
    tip: "Score only inside one job cluster per sheet.",
    figure: {
      src: "/guides/project-management-requirements-guide-sheet.png",
      alt: "One-page project management requirements score sheet with must/nice columns.",
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
          "No invented product scores. Capture evidence against your jobs; use Best page methodology for peer awards.",
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
    href: "/guides/project-management-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    variant: "finder",
  },
];

export const projectManagementRequirementsGuide: GuidePage = {
  id: "guide-project-management-requirements-guide",
  slug: "project-management-requirements-guide",
  title: "Project Management Requirements Guide",
  summary: "A practical requirements sheet for work OS and adjacent productivity purchases.",
  categorySlugs: ["project-management"],
    topicType: "checklist",
    heroVisual: {
    src: "/guides/project-management-requirements-guide-hero.png",
    alt: "Educational illustration for Project Management Requirements Guide.",
  },
    supports: [
    {
      contentId: "content:category:project-management",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:project-management-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-project-management-software",
    "how-to-choose-project-management-software",
    "project-management-pricing-guide",
    "project-management-requirements-guide",
    "project-management-evaluation-guide",
  ].filter((s) => s !== "project-management-requirements-guide"),
  blocks: projectManagementRequirementsGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T18:00:00.000Z",
    publishedAt: "2026-08-17T18:00:00.000Z",
    reviewedAt: "2026-08-17T18:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Project Management Requirements Guide | SoftwareGlimpse",
    description: "Write project management requirements as jobs, views, automations, and integrations — not feature wishlists.",
    canonicalPath: "/guides/project-management-requirements-guide/",
    indexable: true,
  },
};
