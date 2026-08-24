import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier21GuideScheduledAt } from "@/data/config/publishing/tier-21-ai-website-builder-launch-2027-05-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-ai-website-builder-software";
const SCHEDULED_AT = tier21GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose AI website builder software by the build surface blocking work — prompt-to-site, no-code AI app/agent, or AI app development — then confirm generation limits, deploy workflow, domain integrations, and trial gates. Shortlist only tools whose core product is build-from-prompt, not general LLM chat.",
    bullets: [
      "Primary build job",
      "Site vs agent vs app dev",
      "Generation & publish limits",
      "Customization depth",
      "Domain & CMS integrations",
      "Trial with one real site or app",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by build cluster, then confirm live commercial terms.",
    href: "/tools/ai-finder/",
    ctaLabel: "AI Finder (build surface) →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T19:00:00.000Z",
        reviewedAt: "2026-08-23T19:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T19:00:00.000Z",
        publishedAt: "2026-08-23T19:00:00.000Z",
        reviewedAt: "2026-08-23T19:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const howToChooseAiWebsiteBuilderSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-ai-website-builder-software",
  slug: SLUG,
  title: "How to Choose AI Website Builder Software",
  summary:
    "Pick AI website builders by build surface — site generation, agent apps, or app development — not as one generic AI list.",
  categorySlugs: ["ai-website-builder", "ai"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:ai-website-builder",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-ai-website-builder-software",
    "ai-website-builder-pricing-guide",
    "ai-website-builder-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose AI Website Builder Software",
    description:
      "Choose AI website builders by prompt-to-site, agent builder, or app development job fit.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/how-to-choose-ai-website-builder-software/",
  },
};
