import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * CRM Category Hub presentation profile.
 * Sourced from CategoryDefinition scope, methodology criteria, published guides,
 * and catalogue taxonomy — no fabricated rankings, prices, or scores.
 */
export function buildCrmCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "crm",
    shortName: "CRM",
    displayName: "CRM Software",
    tagline:
      "Find CRM software that fits your business, team, and sales process.",
    definition:
      "CRM (customer relationship management) software helps teams manage contacts, deals, and customer interactions in one place. The right CRM matches your sales process — pipeline stages, follow-ups, and reporting — not a generic feature checklist.",
    iconSlug: "crm",
    decisionCriteria: [
      "Pipeline & contact management",
      "Sales automation",
      "Integrations",
      "Reporting",
      "Ease of adoption",
      "Total cost",
    ],
    popularNeeds: [
      "Small sales teams",
      "Pipeline management",
      "Sales automation",
      "Customer relationships",
    ],
    chooseGuideHref: "/guides/how-to-choose-crm/",
    glance: {
      whatItDoes: [
        "Centralizes customer and contact data",
        "Tracks leads and deals through a pipeline",
        "Automates repetitive sales follow-ups",
        "Records emails, calls, and notes on records",
        "Supports reporting and forecasting views",
      ],
      bestFor: [
        "Sales teams",
        "Small and growing businesses",
        "Account managers",
        "Founders running their own pipeline",
        "Customer-facing teams that need shared history",
      ],
      typicalFeatures: [
        "Contact management",
        "Pipeline management",
        "Lead management",
        "Sales automation",
        "Email sync",
        "Reporting",
        "Custom fields",
        "Integrations",
      ],
    },
    types: [
      {
        id: "startup-crm",
        name: "Startup CRM",
        description:
          "Early-stage teams that need speed, adoption, and room to grow without enterprise overhead.",
        icon: "star",
        href: "/categories/crm/startup/",
        ctaLabel: "Explore startup CRM →",
      },
      {
        id: "sales-crm",
        name: "Sales CRM",
        description:
          "Pipeline, deals, contacts, and sales activity for revenue teams.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
        ctaLabel: "Explore pipeline CRM →",
      },
      {
        id: "suite",
        name: "All-in-one CRM",
        description:
          "Sales plus marketing (and sometimes service) in one vendor suite.",
        icon: "layers",
        href: "/guides/types-of-crm/#product-shapes",
        ctaLabel: "Compare CRM shapes →",
      },
      {
        id: "small-business",
        name: "Small business CRM",
        description:
          "Straightforward setup with lower administration overhead.",
        icon: "users",
        href: "/for/small-business/",
        ctaLabel: "CRM for small business →",
      },
      {
        id: "relationship",
        name: "Relationship CRM",
        description:
          "Contact- and relationship-focused workflows beyond the first deal.",
        icon: "handshake",
        href: "/use-cases/relationship-management/",
        ctaLabel: "Explore relationship CRM →",
      },
      {
        id: "engagement",
        name: "Engagement-heavy CRM",
        description:
          "Calling, sequences, and high-activity outbound workflows.",
        icon: "phone",
        href: "/use-cases/sales-engagement/",
        ctaLabel: "Explore engagement CRM →",
      },
    ],
    explorePaths: [
      {
        id: "best",
        title: "Best CRM Software",
        description: "See shortlists and how we evaluate CRM.",
        href: "/best/crm-software/",
        ctaLabel: "View Best CRM",
        tone: "gold",
        icon: "star",
      },
      {
        id: "catalogue",
        title: "All CRM Software",
        description:
          "Browse every catalogue CRM in the catalogue, including niche and enterprise platforms.",
        href: "/software/#crm",
        ctaLabel: "Browse CRM catalogue",
        tone: "blue",
        icon: "products",
      },
      {
        id: "readiness",
        title: "CRM Readiness Assessment",
        description:
          "Diagnose selection vs implementation readiness before vendor conversations.",
        href: "/tools/crm-readiness-assessment/",
        ctaLabel: "Start assessment",
        tone: "green",
        icon: "checklist",
      },
      {
        id: "finder",
        title: "Find My CRM",
        description:
          "Answer a few questions for fit-based recommendations.",
        href: "/tools/crm-finder/",
        ctaLabel: "Start Finder",
        tone: "green",
        icon: "target",
      },
      {
        id: "compare",
        title: "Compare CRM",
        description: "Compare CRM products side by side on shared criteria.",
        href: "/compare/",
        ctaLabel: "Compare CRM",
        tone: "violet",
        icon: "compare",
      },
      {
        id: "calculator",
        title: "CRM Cost Calculator",
        description: "Estimate subscription cost from verified list prices.",
        href: "/tools/crm-cost-calculator/",
        ctaLabel: "Calculate",
        tone: "blue",
        icon: "calculator",
      },
      {
        id: "what-is",
        title: "What Is CRM?",
        description:
          "Beginner definition of CRM as a system of record — contacts, pipeline, and activity.",
        href: "/guides/what-is-crm/",
        ctaLabel: "Read What Is CRM",
        tone: "pink",
        icon: "book",
      },
      {
        id: "guides",
        title: "How to Choose CRM",
        description: "Decision framework before you compare vendors.",
        href: "/guides/how-to-choose-crm/",
        ctaLabel: "Choose a CRM",
        tone: "violet",
        icon: "book",
      },
      {
        id: "capabilities",
        title: "CRM Capabilities",
        description:
          "Explore CRM by capability — contacts, pipeline, automation, reporting, and more.",
        href: "/capabilities/",
        ctaLabel: "Browse capabilities",
        tone: "teal",
        icon: "layers",
      },
      {
        id: "requirements",
        title: "CRM Requirements",
        description:
          "Buyer needs mapped to acceptance criteria, features, and product fit.",
        href: "/requirements/",
        ctaLabel: "Browse requirements",
        tone: "amber",
        icon: "clipboard",
      },
      {
        id: "demo-checklist",
        title: "CRM Demo Checklist Builder",
        description:
          "Script the same demo agenda for every shortlisted vendor.",
        href: "/tools/crm-demo-checklist-builder/",
        ctaLabel: "Build demo checklist",
        tone: "teal",
        icon: "checklist",
      },
      {
        id: "resources",
        title: "CRM Resources",
        description:
          "Downloadable checklists, templates, and worksheets for evaluation through go-live.",
        href: "/resources/",
        ctaLabel: "Browse resources",
        tone: "teal",
        icon: "checklist",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Assess CRM readiness",
        description:
          "Confirm ownership, requirements, data and capacity before vendor outreach.",
      },
      {
        step: 2,
        title: "Define your sales process",
        description: "Stages, owners, and what must improve in 90 days.",
      },
      {
        step: 3,
        title: "Identify must-have features",
        description: "Pipeline, email sync, automation, reporting — only what you will use.",
      },
      {
        step: 4,
        title: "Check integrations",
        description: "Email, calendar, and tools your team already depends on.",
      },
      {
        step: 5,
        title: "Calculate total cost",
        description: "Seats × plan, plus add-ons you actually need.",
      },
      {
        step: 6,
        title: "Evaluate usability",
        description: "Can non-admins complete daily work without friction?",
      },
      {
        step: 7,
        title: "Test with real workflows",
        description:
          "Run the same scripted demo checklist with every shortlisted vendor — not a vendor-led feature tour.",
      },
      {
        step: 8,
        title: "Plan for growth",
        description: "Permissions, reporting, and data model headroom.",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is CRM software?",
        answer:
          "CRM software stores contacts, deals, and interaction history so sales and customer teams share one source of truth instead of spreadsheets and inboxes.",
      },
      {
        question: "Who needs CRM software?",
        answer:
          "Teams that manage recurring customer conversations — sales, founders, account managers, and customer-facing roles — benefit most when follow-ups and pipeline visibility matter.",
      },
      {
        question: "How much does CRM software cost?",
        answer:
          "Most CRM tools charge per seat or plan tier. Use the CRM Cost Calculator with verified list prices for your team size — we do not invent market averages.",
      },
      {
        question: "What features should CRM software have?",
        answer:
          "Start with contact and pipeline management, then add email sync, automation, and reporting based on your process. Must-haves should map to jobs you will actually run.",
      },
      {
        question: "What's the difference between CRM and sales software?",
        answer:
          "CRM is the system of record for relationships and deals. Sales tools (engagement, dialers, intelligence) may connect to CRM or include CRM-like features — primary category membership still matters.",
      },
      {
        question: "How do I choose CRM software?",
        answer:
          "Match tools to your sales process, must-have features, integrations, total cost, and adoption risk. Use our CRM buying guide and Finder for a structured shortlist.",
      },
      {
        question: "Can small businesses use CRM?",
        answer:
          "Yes. Many CRMs target small sales teams with simpler admin. Start lean — contacts, pipeline, and activity — before buying unused suite modules.",
      },
    ],
    finderHref: "/tools/crm-finder/",
    finderExample: {
      requirements: [
        "Small sales team",
        "Visual pipeline",
        "Microsoft 365",
        "Automation",
      ],
      matchSlugs: ["pipedrive", "freshsales", "close"],
      disclaimer: "Example illustration — not a live Finder match.",
    },
    pricingModel: {
      summary:
        "CRM pricing is typically per seat (or plan tier × users). Total cost depends on plan, seats, and optional add-ons — not a single sticker price.",
      seatExamples: [
        {
          label: "Small team",
          seats: 5,
          note: "Seat price × 5 (plus plan minimums if any)",
        },
        {
          label: "Growing team",
          seats: 20,
          note: "Seat price × 20",
        },
        {
          label: "Larger team",
          seats: 50,
          note: "Seat price × 50 — check volume / enterprise terms",
        },
      ],
      calculatorHref: "/tools/crm-cost-calculator/",
      guideHref: "/guides/how-to-choose-crm/",
    },
    methodologyHref: COMPANY_ROUTES.methodology,
    featuredFeatureSlugs: [
      "custom-pipelines",
      "email-sync",
      "workflow-automation",
      "custom-fields",
      "reporting",
      "forecasting",
      "lead-scoring",
      "call-functionality",
    ],
    matrixFeatureSlugs: [
      "pipeline-management",
      "lead-scoring",
      "call-functionality",
      "sales-automation",
      "email-sync",
      "reporting",
    ],
    relatedCategorySlugs: ["sales-intelligence", "marketing"],
    lastReviewedAt: "2026-08-13T00:00:00.000Z",
  });
}
