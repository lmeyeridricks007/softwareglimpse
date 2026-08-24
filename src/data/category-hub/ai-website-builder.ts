import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildAiWebsiteBuilderCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "ai-website-builder",
    shortName: "AI Website Builder",
    displayName: "AI Website Builder Software",
    tagline:
      "Generate marketing sites or lightweight apps from prompts — distinct from general AI assistants.",
    definition:
      "AI website builder software helps founders and marketers generate sites, landing pages, or lightweight apps from prompts — including prompt-to-site tools, no-code AI app builders, and AI app development platforms. The right tool matches the build surface — not a single list that ranks Wegic against MindStudio as undifferentiated peers. Shortlist via the parent AI Finder using the build-surface constraint.",
    iconSlug: "ai-website-builder",
    decisionCriteria: [
      "Primary build job fit",
      "Site vs agent vs app-dev depth",
      "Generation quality & customization",
      "Deploy / publish workflow",
      "Domain & integration needs",
      "Trial vs paid generation limits",
    ],
    popularNeeds: [
      "Prompt-to-website",
      "Landing page generation",
      "No-code AI apps",
      "AI agent builders",
      "Lightweight app prototypes",
      "Publish to live URL",
    ],
    chooseGuideHref: "/guides/how-to-choose-ai-website-builder-software/",
    glance: {
      whatItDoes: [
        "Generates sites from natural-language prompts",
        "Builds no-code AI apps and agents",
        "Ships lightweight app prototypes",
        "Publishes to live URLs or exports",
        "Supports branding and post-gen edits",
        "Connects domains and CMS workflows",
      ],
      bestFor: [
        "Founders launching a marketing site fast",
        "Marketers testing landing page variants",
        "Operators building internal AI apps",
        "Agencies prototyping client sites",
      ],
      typicalFeatures: [
        "AI site generation",
        "Agent / app builder",
        "App generation",
        "Prompt to deploy",
        "Customization & editing",
        "Integrations",
      ],
    },
    types: [
      {
        id: "prompt-site",
        name: "Prompt-to-site",
        description: "Generate marketing sites and landing pages from prompts.",
        icon: "globe",
        href: "/use-cases/ai-website-builder/",
        ctaLabel: "Explore site generators →",
      },
      {
        id: "agent-app",
        name: "AI app / agent builder",
        description: "No-code builders for custom AI apps and agents.",
        icon: "cpu",
        href: "/use-cases/ai-agents/",
        ctaLabel: "Explore agent builders →",
      },
      {
        id: "app-dev",
        name: "AI app development",
        description: "Generate and iterate lightweight apps from prompts.",
        icon: "code",
        href: "/use-cases/ai-app-development/",
        ctaLabel: "Explore app dev tools →",
      },
    ],
    tools: [
      {
        label: "AI Finder — build surface",
        description: "Shortlist by site vs app build job via the parent AI category finder.",
        href: "/tools/ai-finder/",
        ctaLabel: "Run AI Finder →",
      },
    ],
    finderHref: "/tools/ai-finder/",
    bestPageHref: "/best/ai-website-builder-software/",
    guides: [
      {
        slug: "what-is-ai-website-builder-software",
        title: "What is AI website builder software?",
        href: "/guides/what-is-ai-website-builder-software/",
      },
      {
        slug: "how-to-choose-ai-website-builder-software",
        title: "How to choose AI website builder software",
        href: "/guides/how-to-choose-ai-website-builder-software/",
      },
      {
        slug: "ai-website-builder-pricing-guide",
        title: "AI website builder pricing guide",
        href: "/guides/ai-website-builder-pricing-guide/",
      },
      {
        slug: "ai-website-builder-vs-ai-software",
        title: "AI website builders vs general AI software",
        href: "/guides/ai-website-builder-vs-ai-software/",
      },
    ],
  });
}
