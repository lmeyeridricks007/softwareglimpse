import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier21GuideScheduledAt } from "@/data/config/publishing/tier-21-ai-website-builder-launch-2027-05-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-ai-website-builder-software";
const SCHEDULED_AT = tier21GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "AI website builder software generates marketing sites, landing pages, or lightweight apps from prompts — prompt-to-site tools, no-code AI app builders, and AI app development platforms. Decision rule: if the blocking job is a prompt-to-marketing-site, shortlist Wegic-class tools; if it is no-code AI apps or agents, shortlist MindStudio-class builders; if it is AI-assisted app development, shortlist Emergent-class platforms — never rank those build surfaces as one undifferentiated list.",
    bullets: [
      "Prompt-to-website generation",
      "No-code AI app / agent builders",
      "AI-assisted app development",
      "Publish / deploy workflows",
      "Not general LLM chat",
      "Not traditional drag-and-drop builders",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Build surface matters",
        body: "Site generation, agent builders, and app dev platforms solve different jobs — compare inside clusters.",
      },
      {
        label: "Subcategory under AI",
        body: "Use the parent AI Finder with the build-surface constraint to shortlist by job fit.",
      },
      {
        label: "Trial gates differ",
        body: "Generation credits and publish limits on free tiers change TCO more than headline starter prices.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by build job cluster, then run the AI Finder with the build-surface filter.",
    href: "/best/ai-website-builder-software/",
    ctaLabel: "Best AI website builder software →",
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

export const whatIsAiWebsiteBuilderSoftwareGuide: GuidePage = {
  id: "guide-what-is-ai-website-builder-software",
  slug: SLUG,
  title: "What is AI Website Builder Software?",
  summary:
    "AI website builder software generates sites or lightweight apps from prompts — distinct from general LLM assistants and traditional builders.",
  categorySlugs: ["ai-website-builder", "ai"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:ai-website-builder",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-ai-website-builder-software",
    "ai-website-builder-pricing-guide",
    "ai-website-builder-vs-ai-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What is AI Website Builder Software?",
    description:
      "Learn how AI website builders generate sites, apps, and agents from prompts.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/what-is-ai-website-builder-software/",
  },
};
