import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier20GuideScheduledAt } from "@/data/config/publishing/tier-20-ai-writing-launch-2027-05-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-ai-writing-software";
const SCHEDULED_AT = tier20GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose AI writing software by the job blocking work — paraphrasing and grammar, marketing copy generation, or GEO/AEO content — then confirm word limits, browser integrations, and free-tier gates. Shortlist only tools whose core product is writing assistance, not general LLM chat.",
    bullets: [
      "Primary writing job",
      "Paraphrasing vs GEO/copy",
      "Word / credit limits",
      "Browser & doc integrations",
      "Free vs Premium gates",
      "Trial with one real rewrite or draft",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/tools/ai-finder/",
    ctaLabel: "AI Finder (writing use case) →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T18:30:00.000Z",
        reviewedAt: "2026-08-23T18:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T18:30:00.000Z",
        publishedAt: "2026-08-23T18:30:00.000Z",
        reviewedAt: "2026-08-23T18:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const howToChooseAiWritingSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-ai-writing-software",
  slug: SLUG,
  title: "How to Choose AI Writing Software",
  summary:
    "Pick paraphrasing tools or GEO copy platforms by primary writing job, limits, and integrations.",
  categorySlugs: ["ai-writing", "ai"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:ai-writing",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-ai-writing-software",
    "ai-writing-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose AI Writing Software",
    description:
      "Choose AI writing software by paraphrasing vs GEO copy jobs, limits, and integrations.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/how-to-choose-ai-writing-software/",
  },
};
