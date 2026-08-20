import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * HR Category Hub presentation profile.
 * Sourced from CategoryDefinition scope, methodology criteria, published guides,
 * and catalogue taxonomy — no fabricated rankings, prices, or scores.
 *
 * Teaching visuals: `/public/categories/hr-hero.png`, `hr-needs.png`, `hr-workflow.png`.
 */
export function buildHrCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "hr",
    shortName: "HR",
    displayName: "HR Software",
    tagline:
      "Find HR software that fits the job — core HRIS, payroll, people platforms, enterprise HCM, ATS, frontline WFM, time & attendance, SOP training, or employee LMS.",
    definition:
      "HR software helps teams run a people system of record, payroll/benefits, hiring, enterprise HCM, frontline scheduling, time & attendance, SOPs, or employee learning. The right tool matches the primary job — not a generic “all HR” checklist that forces HRIS, ATS, time clocks, LMS, and enterprise HCM products into one undifferentiated ranking.",
    iconSlug: "hr",
    decisionCriteria: [
      "Primary job fit",
      "Workflow depth",
      "Mobile / frontline readiness",
      "Integrations (HRIS / payroll)",
      "Ease of adoption",
      "Total cost (hubs & gates)",
    ],
    popularNeeds: [
      "Core HRIS",
      "Payroll & benefits",
      "Enterprise HCM",
      "Applicant tracking",
      "Frontline scheduling",
      "Time & attendance",
      "SOP / training paths",
    ],
    chooseGuideHref: "/guides/how-to-choose-hr-software/",
    glance: {
      whatItDoes: [
        "Holds employee records, org charts, and PTO (core HRIS)",
        "Runs payroll and benefits admin",
        "Unifies HR + payroll + IT on a people platform",
        "Runs enterprise HCM for 1,000+ employee programmes",
        "Runs hiring pipelines and career sites (ATS)",
        "Publishes shifts and mobile tasks for deskless teams",
        "Captures clock-in, timesheets, and attendance policies",
        "Documents SOPs and role training paths",
      ],
      bestFor: [
        "Recruiting teams",
        "Frontline / deskless ops",
        "Hourly and field attendance",
        "Ops leaders documenting SOPs",
        "HR and training owners",
        "Enterprise HRIS / HCM programmes",
      ],
      typicalFeatures: [
        "Applicant tracking",
        "Workforce scheduling",
        "Time & attendance",
        "GPS / geofence clock-in",
        "SOP knowledge base",
        "Employee training paths",
        "HRIS integrations",
        "Analytics & reporting",
      ],
    },
    types: [
      {
        id: "hris",
        name: "Core HRIS",
        description:
          "Employee system of record — profiles, org chart, PTO, and people admin.",
        icon: "users",
        href: "/use-cases/core-hris/",
        ctaLabel: "Explore core HRIS →",
      },
      {
        id: "payroll",
        name: "Payroll & benefits",
        description:
          "Pay runs, tax filings, and benefits administration for HR buyers.",
        icon: "calculator",
        href: "/use-cases/payroll-benefits/",
        ctaLabel: "Explore payroll & benefits →",
      },
      {
        id: "people-platform",
        name: "People platform",
        description:
          "HR + payroll + IT/spend on one employee record.",
        icon: "layers",
        href: "/use-cases/people-platform/",
        ctaLabel: "Explore people platforms →",
      },
      {
        id: "enterprise-hcm",
        name: "Enterprise HCM",
        description:
          "Workday-class HR + payroll + talent suites for 1,000+ organisations — custom quote, not SMB HRIS.",
        icon: "layers",
        href: "/use-cases/enterprise-hcm/",
        ctaLabel: "Explore enterprise HCM →",
      },
      {
        id: "ats",
        name: "ATS / recruiting",
        description:
          "Candidate pipelines, career sites, and interview workflows for hiring teams.",
        icon: "users",
        href: "/use-cases/recruiting-ats/",
        ctaLabel: "Explore recruiting / ATS →",
      },
      {
        id: "frontline-wfm",
        name: "Frontline WFM",
        description:
          "Mobile scheduling, communications, and deskless ops hubs.",
        icon: "layers",
        href: "/use-cases/frontline-ops/",
        ctaLabel: "Explore frontline ops →",
      },
      {
        id: "time-attendance",
        name: "Time & attendance",
        description:
          "Clock-in, timesheets, and GPS/face policies for hourly staff.",
        icon: "clock",
        href: "/use-cases/time-attendance/",
        ctaLabel: "Explore time & attendance →",
      },
      {
        id: "sop-training",
        name: "SOP / training",
        description:
          "Playbooks and role-based training paths with completion tracking.",
        icon: "book",
        href: "/use-cases/sop-documentation/",
        ctaLabel: "Explore SOP documentation →",
      },
      {
        id: "lms",
        name: "Employee LMS",
        description:
          "Course/academy delivery for internal learning — often marketing-primary when commerce-led.",
        icon: "graduation",
        href: "/use-cases/employee-training/",
        ctaLabel: "Explore employee training →",
      },
    ],
    explorePaths: [
      {
        id: "best",
        title: "Best HR Software",
        description: "See editor’s picks by job cluster and how we evaluate HR tools.",
        href: "/best/hr-software/",
        ctaLabel: "View Best HR",
        tone: "gold",
        icon: "star",
      },
      {
        id: "catalogue",
        title: "All HR Software",
        description: "Browse catalogue HR, workforce, and training products.",
        href: "/software/#hr",
        ctaLabel: "Browse HR catalogue",
        tone: "blue",
        icon: "products",
      },
      {
        id: "what-is",
        title: "What Is HR Software?",
        description:
          "Definition of ATS, frontline WFM, time clocks, SOP training, and LMS shapes.",
        href: "/guides/what-is-hr-software/",
        ctaLabel: "Read What Is HR Software",
        tone: "pink",
        icon: "book",
      },
      {
        id: "guides",
        title: "How to Choose HR Software",
        description: "Decision framework before you compare vendors.",
        href: "/guides/how-to-choose-hr-software/",
        ctaLabel: "Choose HR software",
        tone: "violet",
        icon: "book",
      },
      {
        id: "pricing",
        title: "HR Pricing Guide",
        description: "Budget hubs, pools, seats, and implementation — not starter tiles.",
        href: "/guides/hr-pricing-guide/",
        ctaLabel: "Read pricing guide",
        tone: "amber",
        icon: "calculator",
      },
      {
        id: "capabilities",
        title: "HR Capabilities",
        description:
          "Explore by capability — ATS, scheduling, attendance, SOPs, and training paths.",
        href: "/capabilities/",
        ctaLabel: "Browse capabilities",
        tone: "teal",
        icon: "layers",
      },
      {
        id: "use-cases",
        title: "HR Use Cases",
        description: "Recruiting, scheduling, attendance, training, SOPs, and frontline ops.",
        href: "/use-cases/",
        ctaLabel: "Browse use cases",
        tone: "green",
        icon: "target",
      },
      {
        id: "finder",
        title: "HR Finder",
        description: "Answer a few questions for fit-based HR software shortlists.",
        href: "/tools/hr-finder/",
        ctaLabel: "Start Finder",
        tone: "green",
        icon: "target",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Name the primary job",
        description: "ATS, frontline WFM, time clock, SOP training, enterprise HCM, or LMS — one sentence.",
      },
      {
        step: 2,
        title: "Write must-have workflows",
        description: "Pipelines, shift publish, GPS clock-in, training completion.",
      },
      {
        step: 3,
        title: "Map plan and hub gates",
        description: "Price the configuration that unlocks must-haves.",
      },
      {
        step: 4,
        title: "Check HRIS / payroll integrations",
        description: "Prefer native depth for must-have syncs.",
      },
      {
        step: 5,
        title: "Model total cost",
        description: "Seats, hubs, add-ons, and implementation fees.",
      },
      {
        step: 6,
        title: "Test with a real ritual",
        description: "One hiring pool, schedule week, or training path on the qualifying plan.",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-hr-software/",
    faq: [
      {
        question: "What is HR software?",
        answer:
          "HR software covers hiring (ATS), core HRIS, payroll, people platforms, enterprise HCM, frontline workforce management, time & attendance, SOP documentation, and employee learning — different jobs that should not share one undifferentiated ranking.",
      },
      {
        question: "Who needs HR software?",
        answer:
          "Recruiting teams, ops managers of deskless workforces, payroll-adjacent attendance owners, and leaders documenting SOPs or training paths.",
      },
      {
        question: "How much does HR software cost?",
        answer:
          "Models vary: free ATS pools, per-user time clocks, multi-hub WFM floors, and demo/quote SOP platforms. Confirm live vendor pricing — we do not invent market averages.",
      },
      {
        question: "Is there one best HR tool?",
        answer:
          "No. Shortlist inside the job cluster that matches your blocking weekly ritual. See Best HR software for editor’s picks by cluster — WFM, ATS, HRIS, payroll, and enterprise HCM each have peers rather than one undifferentiated list.",
      },
      {
        question: "How is HR software different from CRM?",
        answer:
          "CRM is the system of record for customers and deals. HR tools hire people, schedule and clock workers, or train them — stacks often integrate but the purchase jobs differ.",
      },
    ],
    finderHref: "/tools/hr-finder/",
    finderExample: {
      requirements: [
        "Frontline scheduling",
        "Mobile app",
        "Time & attendance",
        "Under 50 users",
      ],
      matchSlugs: ["connecteam", "homebase", "jibble"],
      disclaimer: "Example illustration — not a live Finder match.",
    },
    pricingModel: {
      summary:
        "HR pricing is typically per user/employee, per hiring pool, per hub, or demo/quote — plus add-ons and implementation. Total cost depends on the configuration that unlocks your must-haves.",
      seatExamples: [
        {
          label: "Small team",
          seats: 10,
          note: "User/employee count × qualifying plan (plus hubs if any)",
        },
        {
          label: "Growing ops",
          seats: 35,
          note: "Model multi-hub or paid attendance tiers honestly",
        },
        {
          label: "Multi-site",
          seats: 100,
          note: "Check location minimums and overage rates",
        },
      ],
      guideHref: "/guides/hr-pricing-guide/",
    },
    methodologyHref: COMPANY_ROUTES.methodology,
    featuredFeatureSlugs: [
      "applicant-tracking",
      "workforce-scheduling",
      "time-attendance",
      "gps-geofence-clockin",
      "sop-knowledge-base",
      "employee-training-paths",
      "frontline-comms",
      "hris-integrations",
    ],
    matrixFeatureSlugs: [
      "applicant-tracking",
      "workforce-scheduling",
      "time-attendance",
      "sop-knowledge-base",
      "employee-training-paths",
      "gps-geofence-clockin",
    ],
    relatedCategorySlugs: [
      "project-management",
      "marketing",
      "business-communications",
      "crm",
    ],
    lastReviewedAt: "2026-08-18T00:00:00.000Z",
  });
}
