import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier32GuideScheduledAt } from "@/data/config/publishing/tier-32-landing-pages-cro-launch-2027-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-landing-pages-cro-software";
const SCHEDULED_AT = tier32GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose landing pages and CRO software by the conversion job blocking work — standalone page builders with testing, funnel stacks with checkout, or on-site experimentation suites — then confirm traffic limits, A/B test depth, form integrations, and whether email or MAP is bundled or separate. Shortlist only tools whose core product is landing pages, funnels, or on-page CRO — not ESP sends or MAP nurture alone.",
    bullets: [
      "Primary landing or CRO cluster",
      "Traffic and page limits",
      "A/B and multivariate depth",
      "Form and CRM integrations",
      "Funnel checkout requirements",
      "Trial with one live campaign",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by landing and CRO cluster, then confirm live commercial terms.",
    href: "/tools/marketing-finder/",
    ctaLabel: "Marketing Finder (landing & CRO) →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T21:00:00.000Z",
        reviewedAt: "2026-08-23T21:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T21:00:00.000Z",
        publishedAt: "2026-08-23T21:00:00.000Z",
        reviewedAt: "2026-08-23T21:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const howToChooseLandingPagesCroSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-landing-pages-cro-software",
  slug: SLUG,
  title: "How to Choose Landing Pages & CRO Software",
  summary:
    "Pick landing and CRO tools by page-builder, funnel-stack, or experimentation cluster — not as one generic marketing list.",
  categorySlugs: ["landing-pages-cro"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:landing-pages-cro",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-landing-pages-cro-software",
    "landing-pages-cro-pricing-guide",
    "landing-pages-cro-evaluation-guide",
    "landing-pages-cro-vs-marketing-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Landing Pages & CRO Software | SoftwareGlimpse",
    description:
      "Choose landing and CRO software by cluster, traffic limits, testing depth, and integrations.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
