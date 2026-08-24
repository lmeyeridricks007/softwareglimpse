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
    id: "cat-social-media-management",
    slug: "social-media-management",
    name: "Social Media Management",
    shortDescription:
      "Schedule, publish, and analyze social posts across networks — distinct from listening and influencer tools.",
    path: ["marketing", "social-media-management"],
    parentSlug: "marketing",
    sortOrder: 2,
    pageIntent: "indexable",
    aliases: [
      "social media management software",
      "social media scheduler",
      "social publishing software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-09-01T06:00:00.000Z",
      updatedAt: "2026-08-23T23:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Social Media Management Software",
      description:
        "Compare social scheduling, publishing, and analytics tools for SMB and agency teams.",
      indexable: false,
      canonicalPath: "/categories/marketing/social-media-management/",
    },
  },
  {
    id: "cat-landing-pages-cro",
    slug: "landing-pages-cro",
    name: "Landing Pages & CRO",
    shortDescription:
      "High-converting landing pages and sales funnels — distinct from email automation MAP.",
    path: ["marketing", "landing-pages-cro"],
    parentSlug: "marketing",
    sortOrder: 3,
    pageIntent: "indexable",
    aliases: [
      "landing page software",
      "landing page builder",
      "funnel builder software",
      "CRO software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-09-02T06:00:00.000Z",
      updatedAt: "2026-08-23T23:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Landing Pages & CRO Software",
      description:
        "Compare landing page builders and funnel platforms for conversion-focused marketing.",
      indexable: false,
      canonicalPath: "/categories/marketing/landing-pages-cro/",
    },
  },
  {
    id: "cat-ppc-advertising",
    slug: "ppc-advertising",
    name: "PPC & Paid Advertising",
    shortDescription:
      "Paid search and social campaign management — defer indexable hub until 4+ peers.",
    path: ["marketing", "ppc-advertising"],
    parentSlug: "marketing",
    sortOrder: 4,
    pageIntent: "hub",
    aliases: [
      "PPC software",
      "PPC management software",
      "paid ads software",
      "advertising automation software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-09-19T06:00:00.000Z",
      updatedAt: "2026-08-23T23:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "PPC & Paid Advertising Software",
      description:
        "Compare PPC and paid social campaign tools — deferred indexable hub until peer inventory expands.",
      indexable: false,
      canonicalPath: "/categories/marketing/ppc-advertising/",
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
  {
    id: "cat-accounting-finance",
    slug: "accounting-finance",
    name: "Accounting & Finance",
    shortDescription:
      "Expense management, bookkeeping automation, travel & expense, and inventory/manufacturing ERP.",
    path: ["accounting-finance"],
    parentSlug: null,
    sortOrder: 11,
    pageIntent: "hub",
    aliases: [
      "accounting software",
      "bookkeeping software",
      "expense management software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2026-09-01T06:00:00.000Z",
      updatedAt: "2026-08-23T12:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Accounting & Finance Software",
      description:
        "Compare expense management, bookkeeping automation, travel & expense, and manufacturing ERP software by job cluster.",
      indexable: false,
      canonicalPath: "/categories/accounting-finance/",
    },
  },

  {
    id: "cat-social-media-marketing",
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    shortDescription:
      "Social scheduling, listening, influencer campaigns, and social ROI — distinct from generic marketing automation.",
    path: ["social-media-marketing"],
    parentSlug: null,
    sortOrder: 12,
    pageIntent: "hub",
    aliases: [
      "social media marketing software",
      "social media management software",
      "social media scheduler",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2026-10-01T06:00:00.000Z",
      updatedAt: "2026-08-23T14:30:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Social Media Marketing Software",
      description:
        "Compare social scheduling, listening, influencer tools, and social suites by job cluster.",
      indexable: false,
      canonicalPath: "/categories/social-media-marketing/",
    },
  },

  {
    id: "cat-webinar-virtual-events",
    slug: "webinar-virtual-events",
    name: "Webinar & Virtual Events",
    shortDescription:
      "Live webinars, virtual events, evergreen replays, and live-stream production for demand gen and customer education.",
    path: ["webinar-virtual-events"],
    parentSlug: null,
    sortOrder: 13,
    pageIntent: "hub",
    aliases: [
      "webinar software",
      "virtual event platform",
      "webinar hosting software",
      "live streaming software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2026-11-01T06:00:00.000Z",
      updatedAt: "2026-08-23T15:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Webinar & Virtual Events Software",
      description:
        "Compare live webinar hosts, virtual event platforms, evergreen automation, and live production tools by job cluster.",
      indexable: false,
      canonicalPath: "/categories/webinar-virtual-events/",
    },
  },

  {
    id: "cat-lms-course-creation",
    slug: "lms-course-creation",
    name: "LMS & Course Creation",
    shortDescription:
      "Create, sell, and deliver online courses, cohort programs, certificates, and learner assessments — distinct from HR onboarding checklists.",
    path: ["lms-course-creation"],
    parentSlug: null,
    sortOrder: 14,
    pageIntent: "hub",
    aliases: [
      "LMS software",
      "online course platform",
      "course creation software",
      "learning management system",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2026-12-01T06:00:00.000Z",
      updatedAt: "2026-08-23T16:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "LMS & Course Creation Software",
      description:
        "Compare course LMS platforms, team playbook tools, and assessment software by job cluster.",
      indexable: false,
      canonicalPath: "/categories/lms-course-creation/",
    },
  },

  {
    id: "cat-website-digital-presence",
    slug: "website-digital-presence",
    name: "Website & Digital Presence",
    shortDescription:
      "Launch sites, landing pages, hosted storefronts, hosting panels, and digital business marketplaces — a coherent hub for scattered web jobs.",
    path: ["website-digital-presence"],
    parentSlug: null,
    sortOrder: 15,
    pageIntent: "hub",
    aliases: [
      "website builder software",
      "landing page builder",
      "website software",
      "digital presence platform",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-01-01T06:00:00.000Z",
      updatedAt: "2026-08-23T16:30:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Website & Digital Presence Software",
      description:
        "Compare storefronts, site builders, landing pages, hosting panels, and digital business marketplaces by job cluster.",
      indexable: false,
      canonicalPath: "/categories/website-digital-presence/",
    },
  },

  {
    id: "cat-analytics-bi",
    slug: "analytics-bi",
    name: "Analytics & Business Intelligence",
    shortDescription:
      "Attribute leads, unify marketing metrics, and build executive KPI dashboards — distinct from MAP, funnels, and social scheduling.",
    path: ["analytics-bi"],
    parentSlug: null,
    sortOrder: 16,
    pageIntent: "hub",
    aliases: [
      "marketing analytics software",
      "business intelligence software",
      "KPI dashboard software",
      "lead attribution software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-02-01T06:00:00.000Z",
      updatedAt: "2026-08-23T17:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Analytics & Business Intelligence Software",
      description:
        "Compare lead attribution tools and KPI dashboard platforms by job cluster.",
      indexable: false,
      canonicalPath: "/categories/analytics-bi/",
    },
  },

  {
    id: "cat-field-service-operations",
    slug: "field-service-operations",
    name: "Field Service & Operations",
    shortDescription:
      "Schedule field crews, manage construction jobs, and run appointment-based local services — distinct from generic Work OS boards and helpdesk ticketing.",
    path: ["field-service-operations"],
    parentSlug: null,
    sortOrder: 17,
    pageIntent: "hub",
    aliases: [
      "field service management software",
      "construction management software",
      "appointment scheduling software",
      "trades business software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-03-01T06:00:00.000Z",
      updatedAt: "2026-08-23T17:30:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Field Service & Operations Software",
      description:
        "Compare construction management, trades field service, and appointment scheduling tools by job cluster.",
      indexable: false,
      canonicalPath: "/categories/field-service-operations/",
    },
  },

  {
    id: "cat-reputation-reviews",
    slug: "reputation-reviews",
    name: "Reputation & Review Management",
    shortDescription:
      "Collect reviews, respond on Google and social, and automate reputation workflows — distinct from helpdesk ticketing and live chat.",
    path: ["reputation-reviews"],
    parentSlug: null,
    sortOrder: 18,
    pageIntent: "hub",
    aliases: [
      "reputation management software",
      "review management software",
      "online review software",
      "review generation software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-04-01T06:00:00.000Z",
      updatedAt: "2026-08-23T18:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Reputation & Review Management Software",
      description:
        "Compare review collection, monitoring, and local reputation tools for service businesses.",
      indexable: false,
      canonicalPath: "/categories/reputation-reviews/",
    },
  },

  {
    id: "cat-ai-writing",
    slug: "ai-writing",
    name: "AI Writing",
    shortDescription:
      "Draft, rewrite, and optimize copy with AI — paraphrasing, grammar, and marketing content tools.",
    path: ["ai", "ai-writing"],
    parentSlug: "ai",
    sortOrder: 1,
    pageIntent: "hub",
    aliases: [
      "AI writing software",
      "AI writing assistant",
      "AI paraphrasing tool",
      "AI copywriting software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-05-01T06:00:00.000Z",
      updatedAt: "2026-08-23T18:30:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "AI Writing Software",
      description:
        "Compare AI writing assistants for paraphrasing, grammar, and marketing copy.",
      indexable: false,
      canonicalPath: "/categories/ai/ai-writing/",
    },
  },

  {
    id: "cat-ai-website-builder",
    slug: "ai-website-builder",
    name: "AI Website Builder",
    shortDescription:
      "Generate marketing sites or lightweight apps from prompts — distinct from general AI assistants.",
    path: ["ai", "ai-website-builder"],
    parentSlug: "ai",
    sortOrder: 2,
    pageIntent: "hub",
    aliases: [
      "AI website builder",
      "AI site generator",
      "AI app builder",
      "prompt-to-website software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-05-02T06:00:00.000Z",
      updatedAt: "2026-08-23T19:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "AI Website Builder Software",
      description:
        "Compare AI website builders for prompt-to-site, agent apps, and lightweight app development.",
      indexable: false,
      canonicalPath: "/categories/ai/ai-website-builder/",
    },
  },

  {
    id: "cat-live-chat",
    slug: "live-chat",
    name: "Live Chat",
    shortDescription:
      "Website messenger, proactive chat, and chatbot deflection — distinct from full helpdesk ticketing.",
    path: ["customer-service", "live-chat"],
    parentSlug: "customer-service",
    sortOrder: 1,
    pageIntent: "indexable",
    aliases: [
      "live chat software",
      "website chat",
      "website messenger",
      "chatbot deflection",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-07-01T06:00:00.000Z",
      updatedAt: "2026-08-23T20:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Live Chat Software",
      description:
        "Compare website messenger, proactive chat, and chatbot deflection tools for SMB and mid-market teams.",
      indexable: false,
      canonicalPath: "/categories/customer-service/live-chat/",
    },
  },

  {
    id: "cat-helpdesk-ticketing",
    slug: "helpdesk-ticketing",
    name: "Helpdesk & Ticketing",
    shortDescription:
      "Shared inbox, ticketing, SLA workflows, and knowledge base — distinct from live chat widgets.",
    path: ["customer-service", "helpdesk-ticketing"],
    parentSlug: "customer-service",
    sortOrder: 2,
    pageIntent: "indexable",
    aliases: [
      "helpdesk software",
      "ticketing software",
      "shared inbox software",
      "customer support platform",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-07-02T06:00:00.000Z",
      updatedAt: "2026-08-23T21:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Helpdesk & Ticketing Software",
      description:
        "Compare helpdesk, shared inbox, and ticketing platforms for SMB and enterprise support teams.",
      indexable: false,
      canonicalPath: "/categories/customer-service/helpdesk-ticketing/",
    },
  },

  {
    id: "cat-dropshipping-pod",
    slug: "dropshipping-pod",
    name: "Dropshipping & Print on Demand",
    shortDescription:
      "Source products, print-on-demand merch, and fulfill without holding inventory.",
    path: ["ecommerce", "dropshipping-pod"],
    parentSlug: "ecommerce",
    sortOrder: 1,
    pageIntent: "indexable",
    aliases: [
      "dropshipping software",
      "print on demand software",
      "POD software",
      "dropshipping apps",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-07-19T06:00:00.000Z",
      updatedAt: "2026-08-23T21:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Dropshipping & Print on Demand Software",
      description:
        "Compare dropshipping sourcing and print-on-demand tools for storefront merchants.",
      indexable: false,
      canonicalPath: "/categories/ecommerce/dropshipping-pod/",
    },
  },

  {
    id: "cat-fulfillment-shipping",
    slug: "fulfillment-shipping",
    name: "Fulfillment & Shipping",
    shortDescription:
      "Ship orders, manage returns, and outsource fulfillment — post-checkout ops.",
    path: ["ecommerce", "fulfillment-shipping"],
    parentSlug: "ecommerce",
    sortOrder: 2,
    pageIntent: "indexable",
    aliases: [
      "fulfillment software",
      "shipping software",
      "3PL software",
      "ecommerce shipping",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-07-03T06:00:00.000Z",
      updatedAt: "2026-08-23T21:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Fulfillment & Shipping Software",
      description:
        "Compare 3PL fulfillment, shipping labels, and returns management for ecommerce ops.",
      indexable: false,
      canonicalPath: "/categories/ecommerce/fulfillment-shipping/",
    },
  },

  {
    id: "cat-ats-recruiting",
    slug: "ats-recruiting",
    name: "ATS & Recruiting",
    shortDescription:
      "Applicant tracking, career sites, and hiring workflows — distinct from core HRIS and frontline WFM.",
    path: ["hr", "ats-recruiting"],
    parentSlug: "hr",
    sortOrder: 1,
    pageIntent: "indexable",
    aliases: [
      "ATS software",
      "applicant tracking software",
      "recruiting software",
      "hiring software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-08-01T06:00:00.000Z",
      updatedAt: "2026-08-23T22:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "ATS & Recruiting Software",
      description:
        "Compare applicant tracking, career sites, and hiring workflow tools for SMB and mid-market teams.",
      indexable: false,
      canonicalPath: "/categories/hr/ats-recruiting/",
    },
  },

  {
    id: "cat-time-attendance",
    slug: "time-attendance",
    name: "Time & Attendance",
    shortDescription:
      "Clock in/out, schedule shifts, and track hourly teams — distinct from core HRIS.",
    path: ["hr", "time-attendance"],
    parentSlug: "hr",
    sortOrder: 2,
    pageIntent: "indexable",
    aliases: [
      "time and attendance software",
      "time tracking software",
      "employee time clock",
      "shift scheduling software",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-08-02T06:00:00.000Z",
      updatedAt: "2026-08-23T22:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Time & Attendance Software",
      description:
        "Compare time clocks, shift scheduling, and frontline workforce tools for hourly teams.",
      indexable: false,
      canonicalPath: "/categories/hr/time-attendance/",
    },
  },

  {
    id: "cat-web-hosting",
    slug: "web-hosting",
    name: "Web Hosting & Server Management",
    shortDescription:
      "Hosting control panels and server administration — defer indexable hub until inventory expands.",
    path: ["it-development", "web-hosting"],
    parentSlug: "it-development",
    sortOrder: 1,
    pageIntent: "hub",
    aliases: [
      "web hosting software",
      "hosting control panel",
      "server management panel",
      "Plesk hosting",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-08-19T06:00:00.000Z",
      updatedAt: "2026-08-23T22:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Web Hosting & Server Management Software",
      description:
        "Hosting control panels for server and website administration — single-SKU inventory; expand peers before indexable hub.",
      indexable: false,
      canonicalPath: "/categories/it-development/web-hosting/",
    },
  },

  {
    id: "cat-itsm",
    slug: "itsm",
    name: "IT Service Management",
    shortDescription:
      "Internal IT service desk and ITIL workflows — defer indexable hub until 3+ ITSM-native peers.",
    path: ["it-development", "itsm"],
    parentSlug: "it-development",
    sortOrder: 2,
    pageIntent: "hub",
    aliases: [
      "ITSM software",
      "IT service management",
      "IT service desk software",
      "ITIL service desk",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-08-03T06:00:00.000Z",
      updatedAt: "2026-08-23T22:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "IT Service Management (ITSM) Software",
      description:
        "Internal IT service desk, incident management, and ITIL workflows — expand ITSM-native peer depth before indexable hub.",
      indexable: false,
      canonicalPath: "/categories/it-development/itsm/",
    },
  },

  {
    id: "cat-voip-business-phone",
    slug: "voip-business-phone",
    name: "VoIP & Business Phone",
    shortDescription:
      "Cloud phone, sales dialers, and contact-center voice — distinct from team chat and messaging.",
    path: ["business-communications", "voip-business-phone"],
    parentSlug: "business-communications",
    sortOrder: 1,
    pageIntent: "indexable",
    aliases: [
      "VoIP software",
      "business phone system",
      "cloud phone",
      "sales dialer",
      "business VoIP",
    ],
    categoryLifecycle: "active",
    metadata: {
      status: "scheduled",
      scheduledAt: "2027-06-01T06:00:00.000Z",
      updatedAt: "2026-08-23T19:30:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "VoIP & Business Phone Software",
      description:
        "Compare cloud VoIP, sales dialers, and contact-center voice for SMB and mid-market teams.",
      indexable: false,
      canonicalPath: "/categories/business-communications/voip-business-phone/",
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
