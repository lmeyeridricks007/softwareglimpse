import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const itDevelopmentRequirementsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write IT requirements as jobs and evidence, not feature wishlists: primary job (ITSM vs observability vs on-call vs source control vs hosting vs web data), must-have workflows, usage unit, integrations, admin/security, and who operates it weekly. Decision rule: every must-have must map to a weekly ritual and a plan, host pack, ingest GB, git seat, panel licence, or proxy GB you are willing to buy.",
    bullets: [
      "Primary job statement",
      "Must-have workflows",
      "Usage unit (agent / host / GB)",
      "Integrations list",
      "Admin / security gates",
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
        body: "CMDB, APM, paging policies, and Web Host licences imply a qualifying configuration — write that explicitly.",
      },
      {
        label: "Clusters need their own sheet",
        body: "ITSM, observability, and on-call requirements should not pollute a single undifferentiated RFP.",
      },
    ],
  },
  {
    type: "step",
    id: "write-jobs",
    stepNumber: 1,
    heading: "Write three job statements",
    body: "Capture: (1) who updates tickets, dashboards, or repos, (2) who needs visibility or on-call, (3) which stack tools must sync — identity, cloud, or git.\n\nWorked example: Harbor Ops wrote “Agents resolve employee incidents with CMDB context; SRE needs a service map without chasing Slack; the on-call needs a page that is not a metrics tile.”",
    tip: "Reject any requirement that cannot be tested in a two-week trial.",
  },
  {
    type: "step",
    id: "score-sheet",
    stepNumber: 2,
    heading: "Build a one-page score sheet",
    body: "Columns: requirement, must/nice, evidence to collect in trial, qualifying plan/usage unit. Rows for ITSM, observability, incident/on-call, source control, hosting operations, web-data collection, integrations, admin/security.\n\nThis guide is the requirements surface for IT & development buyers on SoftwareGlimpse.",
    tip: "Score only inside one job cluster per sheet.",
    figure: {
      src: "/guides/it-development-requirements-guide-sheet.png",
      alt: "One-page IT requirements score sheet with must/nice columns and usage-unit gates.",
      caption:
        "One page beats a 40-row feature dump — every must-have needs evidence and an agent, host, GB, seat, or licence tier.",
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
    href: "/guides/it-development-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    variant: "finder",
  },
];

export const itDevelopmentRequirementsGuide: GuidePage = {
  id: "guide-it-development-requirements-guide",
  slug: "it-development-requirements-guide",
  title: "IT & Development Software Requirements Guide",
  summary:
    "A practical requirements sheet for ITSM, observability, incident/on-call, source control, hosting panels, and web-data purchases.",
  categorySlugs: ["it-development"],
  topicType: "checklist",
  heroVisual: {
    src: "/guides/it-development-requirements-guide-hero.png",
    alt: "Educational illustration for IT & Development Software Requirements Guide.",
  },
  supports: [
    {
      contentId: "content:category:it-development",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:it-development-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-it-development-software",
    "how-to-choose-it-development-software",
    "it-development-pricing-guide",
    "it-development-evaluation-guide",
  ],
  blocks: itDevelopmentRequirementsGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T00:00:00.000Z",
    publishedAt: "2026-08-18T00:00:00.000Z",
    reviewedAt: "2026-08-18T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "IT & Development Software Requirements Guide | SoftwareGlimpse",
    description:
      "Write IT and development software requirements by job cluster — ITSM, observability, on-call, source control, hosting, and web data — with must/nice evidence.",
    canonicalPath: "/guides/it-development-requirements-guide/",
    indexable: true,
  },
};
