import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildWebHostingCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "web-hosting",
    shortName: "Web Hosting",
    displayName: "Web Hosting Software",
    tagline:
      "Hosting control panels, server administration, and web operations — distinct from managed hosting providers and cloud PaaS.",
    definition:
      "Web hosting software administers servers, domains, websites, and email through control panels — for hosting providers, agencies, and ops teams managing their own infrastructure. The right tool matches the hosting job — control panel, managed host, or cloud PaaS — not a single list that ranks Plesk against WP Engine as undifferentiated peers. Shortlist via the parent IT & Development Finder with the hosting constraint.",
    iconSlug: "web-hosting",
    decisionCriteria: [
      "Primary hosting job fit",
      "Panel vs managed host vs cloud PaaS",
      "Per-server licence TCO",
      "Server and domain administration depth",
      "SSL and security hardening",
      "Multi-server scalability",
    ],
    popularNeeds: [
      "Hosting control panel",
      "Server administration",
      "Domain and SSL management",
      "Email hosting on servers",
      "Backup and restore",
      "Multi-server management",
    ],
    chooseGuideHref: "/guides/how-to-choose-web-hosting-software/",
    glance: {
      whatItDoes: [
        "Administers servers through a control panel",
        "Manages domains, DNS, and SSL certificates",
        "Provisions websites and email mailboxes",
        "Handles backups and disaster recovery",
        "Hardens security and access controls",
        "Reports on server usage and uptime",
      ],
      bestFor: [
        "Hosting providers managing client servers",
        "Agencies running multi-site infrastructure",
        "Ops teams self-hosting web applications",
        "Resellers needing panel-based administration",
      ],
      typicalFeatures: [
        "Hosting control panel",
        "Server administration",
        "Domain & SSL management",
        "Email hosting",
        "Backup & restore",
        "Enterprise security & SSO",
      ],
    },
    types: [
      {
        id: "hosting-panel",
        name: "Hosting control panel",
        description: "Per-server panel for domain, site, and email administration.",
        icon: "server",
        href: "/use-cases/hosting-operations/",
        ctaLabel: "Explore hosting panels →",
      },
      {
        id: "server-admin",
        name: "Server administration",
        description: "OS-level management, updates, and resource allocation.",
        icon: "terminal",
        href: "/use-cases/server-administration/",
        ctaLabel: "Explore server admin →",
      },
      {
        id: "managed-hosting",
        name: "Managed hosting",
        description: "Fully managed cloud or WordPress hosting — not a panel licence.",
        icon: "cloud",
        href: "/use-cases/hosting-providers/",
        ctaLabel: "Explore managed hosting →",
      },
      {
        id: "cloud-paas",
        name: "Cloud PaaS",
        description: "Git-push app platforms — not panel or managed WordPress peers.",
        icon: "git-branch",
        href: "/use-cases/cloud-paas/",
        ctaLabel: "Explore cloud PaaS →",
      },
    ],
    tools: [
      {
        label: "IT Finder — hosting constraint",
        description:
          "Shortlist by hosting job fit via the parent IT & development finder with hosting constraint.",
        href: "/tools/it-development-finder/",
        ctaLabel: "Run IT Finder →",
      },
    ],
    finderHref: "/tools/it-development-finder/",
    bestPageHref: "/best/web-hosting-software/",
    guides: [
      {
        slug: "what-is-web-hosting-software",
        title: "What is web hosting software?",
        href: "/guides/what-is-web-hosting-software/",
      },
      {
        slug: "how-to-choose-web-hosting-software",
        title: "How to choose web hosting software",
        href: "/guides/how-to-choose-web-hosting-software/",
      },
      {
        slug: "web-hosting-pricing-guide",
        title: "Web hosting pricing guide",
        href: "/guides/web-hosting-pricing-guide/",
      },
      {
        slug: "web-hosting-vs-it-development-software",
        title: "Web hosting vs broader IT & development software",
        href: "/guides/web-hosting-vs-it-development-software/",
      },
    ],
  });
}
