import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildAiWritingCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "ai-writing",
    shortName: "AI Writing",
    displayName: "AI Writing Software",
    tagline:
      "Draft, rewrite, and optimize copy with AI — paraphrasing, grammar, and marketing content tools.",
    definition:
      "AI writing software helps writers and marketers paraphrase text, fix grammar, generate marketing copy, and optimize content for AI search — distinct from general-purpose LLM chat products. The right tool matches the writing job — not a single list that ranks QuillBot against Writesonic as if they were undifferentiated peers. Shortlist via the parent AI Finder using the ai-writing use-case tag.",
    iconSlug: "ai-writing",
    decisionCriteria: [
      "Primary writing job fit",
      "Paraphrasing vs GEO/copy depth",
      "Free tier vs Premium gates",
      "Browser & doc integrations",
      "Word / credit limits",
      "Team vs solo workflows",
    ],
    popularNeeds: [
      "Paraphrasing & rewriting",
      "Grammar checking",
      "Marketing copy drafts",
      "GEO / AEO content",
      "Summarisation",
      "Tone controls",
    ],
    chooseGuideHref: "/guides/how-to-choose-ai-writing-software/",
    glance: {
      whatItDoes: [
        "Rephrases sentences with tone controls",
        "Checks grammar and readability",
        "Generates marketing and blog copy",
        "Optimizes content for AI search visibility",
        "Summarises long documents",
        "Integrates with browsers and docs",
      ],
      bestFor: [
        "Students and professionals polishing drafts",
        "Marketers scaling blog and ad copy",
        "SEO teams pursuing GEO/AEO visibility",
        "Agencies rewriting client content at volume",
      ],
      typicalFeatures: [
        "Paraphrasing & rewriting",
        "Grammar & clarity",
        "Copy generation",
        "GEO / AEO content",
        "Summarisation",
        "Tone & style controls",
      ],
    },
    types: [
      {
        id: "paraphrasing",
        name: "Paraphrasing & grammar",
        description: "Rewrite, proofread, and polish existing text.",
        icon: "edit",
        href: "/use-cases/ai-writing/",
        ctaLabel: "Explore paraphrasing tools →",
      },
      {
        id: "copy",
        name: "AI copywriting",
        description: "Generate blogs, ads, and landing copy from prompts.",
        icon: "file-text",
        href: "/use-cases/ai-copywriting/",
        ctaLabel: "Explore copywriting tools →",
      },
      {
        id: "geo",
        name: "GEO / AEO content",
        description: "Optimize content for AI search and answer engines.",
        icon: "search",
        href: "/use-cases/ai-writing/",
        ctaLabel: "Explore GEO tools →",
      },
    ],
    tools: [
      {
        label: "AI Finder — writing use case",
        description: "Shortlist by ai-writing job fit via the parent AI category finder.",
        href: "/tools/ai-finder/",
        ctaLabel: "Run AI Finder →",
      },
    ],
    finderHref: "/tools/ai-finder/",
    bestPageHref: "/best/ai-writing-software/",
    guides: [
      {
        slug: "what-is-ai-writing-software",
        title: "What is AI writing software?",
        href: "/guides/what-is-ai-writing-software/",
      },
      {
        slug: "how-to-choose-ai-writing-software",
        title: "How to choose AI writing software",
        href: "/guides/how-to-choose-ai-writing-software/",
      },
      {
        slug: "ai-writing-pricing-guide",
        title: "AI writing software pricing guide",
        href: "/guides/ai-writing-pricing-guide/",
      },
      {
        slug: "ai-writing-vs-ai-software",
        title: "AI writing vs general AI software",
        href: "/guides/ai-writing-vs-ai-software/",
      },
    ],
  });
}
