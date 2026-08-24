import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildAtsRecruitingCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "ats-recruiting",
    shortName: "ATS & Recruiting",
    displayName: "ATS & Recruiting Software",
    tagline:
      "Applicant tracking, career sites, and hiring workflows — distinct from core HRIS, payroll, and frontline WFM.",
    definition:
      "ATS and recruiting software manages candidate pipelines, career sites, job-board posting, interview scheduling, and hiring-team collaboration. The right tool matches the recruiting job — SMB ATS, structured enterprise hiring, or HRIS-with-ATS modules — not a single list that ranks Breezy HR against Greenhouse as undifferentiated peers. Shortlist via the parent HR Finder with hiring-team-size constraints.",
    iconSlug: "ats-recruiting",
    decisionCriteria: [
      "Primary ATS job fit",
      "Hiring team size and seat minimums",
      "Pipeline and collaboration depth",
      "Career site and job-board syndication",
      "Interview scheduling workflows",
      "HRIS integrations for hire-to-retain handoff",
    ],
    popularNeeds: [
      "Candidate pipelines",
      "Career site & job posting",
      "Interview scheduling",
      "Hiring-team scorecards",
      "Job-board syndication",
      "Recruiting analytics",
    ],
    chooseGuideHref: "/guides/how-to-choose-ats-recruiting-software/",
    glance: {
      whatItDoes: [
        "Tracks candidates through hiring pipelines",
        "Publishes branded career sites and job posts",
        "Schedules interviews and coordinates hiring teams",
        "Collects scorecards and hiring feedback",
        "Syndicates jobs to external boards",
        "Reports on time-to-hire and funnel metrics",
      ],
      bestFor: [
        "SMB teams replacing spreadsheets for hiring",
        "Growing companies with dedicated recruiters",
        "HR teams needing career-site and pipeline depth",
        "Structured hiring programmes with scorecards",
      ],
      typicalFeatures: [
        "Applicant tracking",
        "Career site & job boards",
        "Interview scheduling",
        "Hiring collaboration",
        "HRIS integrations",
        "Analytics & reporting",
      ],
    },
    types: [
      {
        id: "smb-ats",
        name: "SMB ATS",
        description: "Lightweight pipelines and career sites for small hiring teams.",
        icon: "users",
        href: "/use-cases/recruiting-ats/",
        ctaLabel: "Explore SMB ATS →",
      },
      {
        id: "structured-hiring",
        name: "Structured hiring",
        description: "Scorecards, interview plans, and enterprise recruiting workflows.",
        icon: "clipboard-check",
        href: "/use-cases/recruiting-ats/",
        ctaLabel: "Explore structured hiring →",
      },
      {
        id: "career-site",
        name: "Career site & job boards",
        description: "Branded pages and syndication for inbound candidate flow.",
        icon: "globe",
        href: "/use-cases/career-site-hiring/",
        ctaLabel: "Explore career sites →",
      },
      {
        id: "hris-ats",
        name: "HRIS with ATS",
        description: "Hiring modules bundled inside core HRIS platforms.",
        icon: "layers",
        href: "/use-cases/recruiting-ats/",
        ctaLabel: "Explore HRIS ATS →",
      },
    ],
    tools: [
      {
        label: "HR Finder — hiring team size",
        description:
          "Shortlist by ATS job fit via the parent HR finder with hiring-team-size constraints.",
        href: "/tools/hr-finder/",
        ctaLabel: "Run HR Finder →",
      },
    ],
    finderHref: "/tools/hr-finder/",
    bestPageHref: "/best/ats-recruiting-software/",
    guides: [
      {
        slug: "what-is-ats-recruiting-software",
        title: "What is ATS & recruiting software?",
        href: "/guides/what-is-ats-recruiting-software/",
      },
      {
        slug: "how-to-choose-ats-recruiting-software",
        title: "How to choose ATS & recruiting software",
        href: "/guides/how-to-choose-ats-recruiting-software/",
      },
      {
        slug: "ats-recruiting-pricing-guide",
        title: "ATS & recruiting pricing guide",
        href: "/guides/ats-recruiting-pricing-guide/",
      },
      {
        slug: "ats-recruiting-vs-hr-software",
        title: "ATS vs broader HR software",
        href: "/guides/ats-recruiting-vs-hr-software/",
      },
    ],
  });
}
