import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier20GuideScheduledAt } from "@/data/config/publishing/tier-20-ai-writing-launch-2027-05-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-ai-writing-software";
const SCHEDULED_AT = tier20GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "AI writing software helps you draft, rewrite, and optimize copy — paraphrasing, grammar, marketing content, and GEO/AEO workflows — not general-purpose LLM chat or coding assistants. Decision rule: if the blocking job is paraphrasing and grammar-first rewriting, shortlist QuillBot-class tools; if it is AI search content and marketing copy at scale, shortlist Writesonic-class platforms — never rank those jobs as one undifferentiated list.",
    bullets: [
      "Paraphrasing & rewriting",
      "Grammar & clarity",
      "Marketing copy generation",
      "GEO / AEO content",
      "Not general LLM chat",
      "Not AI coding tools",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Writing is a specialist AI job",
        body: "ChatGPT can draft text — but paraphrasing modes, grammar depth, and GEO tooling are different purchases.",
      },
      {
        label: "Subcategory under AI",
        body: "Use the parent AI Finder with the ai-writing use-case tag to shortlist by job fit.",
      },
      {
        label: "Free tiers differ",
        body: "QuillBot-class free tiers vs Writesonic trial gates change TCO more than headline Premium prices.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by writing job cluster, then run the AI Finder with the ai-writing tag.",
    href: "/best/ai-writing-software/",
    ctaLabel: "Best AI writing software →",
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

export const whatIsAiWritingSoftwareGuide: GuidePage = {
  id: "guide-what-is-ai-writing-software",
  slug: SLUG,
  title: "What is AI Writing Software?",
  summary:
    "AI writing software paraphrases, polishes, and generates copy — distinct from general LLM assistants and coding tools.",
  categorySlugs: ["ai-writing", "ai"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:ai-writing",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-ai-writing-software",
    "ai-writing-pricing-guide",
    "ai-writing-vs-ai-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What is AI Writing Software?",
    description:
      "Learn how AI writing software paraphrases, generates copy, and optimizes content for AI search.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/what-is-ai-writing-software/",
  },
};
