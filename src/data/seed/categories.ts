import type { z } from "zod";
import { CategorySchema } from "@/domain";

type CategoryInput = z.input<typeof CategorySchema>;

const published = {
  status: "published" as const,
  publishedAt: "2026-08-13T00:00:00.000Z",
  researchStatus: "none" as const,
};

/**
 * Primary categories + CRM/Sales Intelligence deep taxonomy.
 * CRM / SI subcategories are published indexable hubs (products via subcategorySlugs).
 */
export const categoriesSeed: CategoryInput[] = [
  {
    id: "cat-crm",
    slug: "crm",
    name: "CRM",
    shortDescription:
      "Find CRM software that fits your business, team, and sales process.",
    path: ["crm"],
    parentSlug: null,
    sortOrder: 1,
    pageIntent: "indexable",
    metadata: published,
    seo: {
      title: "CRM Software",
      description:
        "Explore CRM software and choose tools that fit your sales process.",
      indexable: true,
      canonicalPath: "/categories/crm/",
    },
  },
  {
    id: "cat-sales-intelligence",
    slug: "sales-intelligence",
    name: "Sales Intelligence",
    shortDescription:
      "Prospecting, enrichment, and sales intelligence software.",
    path: ["sales-intelligence"],
    parentSlug: null,
    sortOrder: 2,
    pageIntent: "indexable",
    metadata: {
      status: "published",
      publishedAt: "2026-08-13T00:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Sales Intelligence Software",
      description: "Explore sales intelligence and lead generation software.",
      indexable: true,
      canonicalPath: "/categories/sales-intelligence/",
    },
  },
  {
    id: "cat-business-communications",
    slug: "business-communications",
    name: "Business Communications",
    shortDescription: "Team and customer communication platforms.",
    path: ["business-communications"],
    parentSlug: null,
    sortOrder: 3,
    pageIntent: "hub",
    metadata: published,
    seo: {
      title: "Business Communications Software",
      description: "Explore business communications software.",
      indexable: true,
      canonicalPath: "/categories/business-communications/",
    },
  },
  {
    id: "cat-customer-service",
    slug: "customer-service",
    name: "Customer Service",
    shortDescription:
      "Helpdesk, live chat, knowledge base, and omnichannel customer support platforms.",
    path: ["customer-service"],
    parentSlug: null,
    sortOrder: 4,
    pageIntent: "hub",
    metadata: published,
    seo: {
      title: "Customer Service Software",
      description:
        "Compare helpdesk, live chat, ecommerce support, and omnichannel customer service software.",
      indexable: true,
      canonicalPath: "/categories/customer-service/",
    },
  },
  {
    id: "cat-marketing",
    slug: "marketing",
    name: "Marketing & Growth",
    shortDescription: "Marketing automation and growth software.",
    path: ["marketing"],
    parentSlug: null,
    sortOrder: 5,
    pageIntent: "hub",
    metadata: published,
    seo: {
      title: "Marketing & Growth Software",
      description: "Explore marketing and growth software.",
      indexable: true,
      canonicalPath: "/categories/marketing/",
    },
  },
  {
    id: "cat-email-marketing",
    slug: "email-marketing",
    name: "Email Marketing",
    shortDescription:
      "Email campaign, newsletter, and marketing automation platforms.",
    path: ["marketing", "email-marketing"],
    parentSlug: "marketing",
    sortOrder: 1,
    pageIntent: "indexable",
    aliases: [
      "email marketing software",
      "newsletter software",
      "email campaign tools",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "published",
      publishedAt: "2026-08-17T00:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Email Marketing Software",
      description:
        "Choose email marketing software that fits your list size, automation needs, and budget.",
      indexable: true,
      canonicalPath: "/categories/email-marketing/",
    },
  },
  {
    id: "cat-project-management",
    slug: "project-management",
    name: "Project Management & Productivity",
    shortDescription:
      "Work OS, project management, timelines, and adjacent productivity tools for planning and executing work.",
    path: ["project-management"],
    parentSlug: null,
    sortOrder: 6,
    pageIntent: "hub",
    metadata: published,
    seo: {
      title: "Project Management & Productivity Software",
      description:
        "Compare work OS, project management, timeline, and productivity software by job-to-be-done — not undifferentiated feature lists.",
      indexable: true,
      canonicalPath: "/categories/project-management/",
    },
  },
  {
    id: "cat-hr",
    slug: "hr",
    name: "HR, Workforce & Training",
    shortDescription:
      "Hiring, frontline workforce, time & attendance, SOP training, and employee learning platforms.",
    path: ["hr"],
    parentSlug: null,
    sortOrder: 7,
    pageIntent: "hub",
    metadata: published,
    seo: {
      title: "HR, Workforce & Training Software",
      description:
        "Compare ATS, workforce scheduling, time & attendance, SOP training, and LMS software by job-to-be-done.",
      indexable: true,
      canonicalPath: "/categories/hr/",
    },
  },
  {
    id: "cat-ai",
    slug: "ai",
    name: "AI Software",
    shortDescription: "AI tools and platforms for business use.",
    path: ["ai"],
    parentSlug: null,
    sortOrder: 8,
    pageIntent: "hub",
    metadata: published,
    seo: {
      title: "AI Software",
      description: "Explore AI software for business.",
      indexable: true,
      canonicalPath: "/categories/ai/",
    },
  },
  {
    id: "cat-it-development",
    slug: "it-development",
    name: "IT & Development",
    shortDescription: "IT operations and software development tools.",
    path: ["it-development"],
    parentSlug: null,
    sortOrder: 9,
    pageIntent: "hub",
    metadata: published,
    seo: {
      title: "IT & Development Software",
      description: "Explore IT and development software.",
      indexable: true,
      canonicalPath: "/categories/it-development/",
    },
  },
  {
    id: "cat-ecommerce",
    slug: "ecommerce",
    name: "Ecommerce",
    shortDescription: "Ecommerce platforms and related software.",
    path: ["ecommerce"],
    parentSlug: null,
    sortOrder: 10,
    pageIntent: "hub",
    metadata: published,
    seo: {
      title: "Ecommerce Software",
      description: "Explore ecommerce software.",
      indexable: true,
      canonicalPath: "/categories/ecommerce/",
    },
  },

  // CRM subcategories — published indexable hubs
  ...crmSubcategories(),
  ...salesIntelligenceSubcategories(),
];

function crmSubcategories(): CategoryInput[] {
  const items: Array<[string, string, string, string, number]> = [
    [
      "small-business-crm",
      "small-business",
      "Small Business CRM",
      "CRM for small businesses.",
      1,
    ],
    ["startup-crm", "startup", "Startup CRM", "CRM for startups.", 2],
    [
      "sales-crm",
      "sales",
      "Sales CRM",
      "CRM focused on sales teams and pipelines.",
      3,
    ],
    [
      "simple-crm",
      "simple",
      "Simple CRM",
      "Straightforward CRM with low admin overhead.",
      4,
    ],
    ["gmail-crm", "gmail", "Gmail CRM", "CRM that works closely with Gmail.", 5],
    ["ai-crm", "ai", "AI CRM", "CRM with AI-assisted sales workflows.", 6],
  ];

  return items.map(([slug, pathSegment, name, shortDescription, sortOrder]) => ({
    id: `cat-${slug}`,
    slug,
    name,
    shortDescription,
    path: ["crm", pathSegment],
    parentSlug: "crm",
    sortOrder,
    pageIntent: "indexable" as const,
    metadata: {
      status: "published" as const,
      publishedAt: "2026-08-17T00:00:00.000Z",
      researchStatus: "complete" as const,
    },
    seo: {
      title: `${name} Software`,
      description: shortDescription,
      indexable: true,
      canonicalPath: `/categories/crm/${pathSegment}/`,
    },
  }));
}

function salesIntelligenceSubcategories(): CategoryInput[] {
  const items: Array<[string, string, string, number, boolean?]> = [
    ["lead-generation", "Lead Generation", "Tools for generating sales leads.", 1],
    ["prospecting", "Prospecting", "Outbound prospecting software.", 2],
    ["contact-data", "Contact Data", "Contact and company data providers.", 3],
    [
      "data-enrichment",
      "Data Enrichment",
      "Contact and account enrichment tools.",
      4,
      false,
    ],
    ["sales-engagement", "Sales Engagement", "Sales engagement platforms.", 5],
    ["email-outreach", "Email Outreach", "Email outreach and sequencing tools.", 6],
  ];

  return items.map(([slug, name, shortDescription, sortOrder, indexable]) => ({
    id: `cat-si-${slug}`,
    slug,
    name,
    shortDescription,
    path: ["sales-intelligence", slug],
    parentSlug: "sales-intelligence",
    sortOrder,
    pageIntent: indexable === false ? ("supported" as const) : ("indexable" as const),
    metadata: {
      status: "published" as const,
      publishedAt: "2026-08-17T00:00:00.000Z",
      researchStatus: "complete" as const,
    },
    seo: {
      title: `${name} Software`,
      description: shortDescription,
      indexable: indexable !== false,
      canonicalPath: `/categories/sales-intelligence/${slug}/`,
    },
  }));
}
