import type { CapabilityHubProfile } from "@/domain";

type Depth = Pick<
  CapabilityHubProfile,
  | "displayTitle"
  | "badgeLabel"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "buyingGuideHref"
  | "faq"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "relatedCapabilitySlugs"
  | "relatedUseCaseSlugs"
  | "relatedRequirementSlugs"
  | "relatedFeatureSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
>;

const NO_UNIVERSAL =
  "No. Fit depends on your primary HR job (ATS vs frontline WFM vs time & attendance vs SOP training vs LMS), headcount, and which requirements are must-haves. Use the Best HR software shortlist and requirements guide rather than starting from a single ranking.";

const HR_META = {
  categorySlug: "hr" as const,
  buyingGuideHref: "/guides/how-to-choose-hr-software/",
};

function hrCap(args: {
  slug: string;
  title: string;
  badge: string;
  tagline: string;
  overview: string;
  who: string;
  matters: string;
  example: string;
  example2: string;
  goal: string;
  priorities: string[];
  relatedCaps: string[];
  relatedUse: string[];
  featureSlug: string;
}): Depth {
  return {
    ...HR_META,
    displayTitle: `HR ${args.title} capability`,
    badgeLabel: args.badge,
    tagline: args.tagline,
    overview: args.overview,
    whoThisIsFor: args.who,
    whatMattersIntro: args.matters,
    workedExample: args.example,
    workedExampleSecondary: args.example2,
    glance: {
      primaryGoal: args.goal,
      typicalTeam: "HR, ops, recruiting, and frontline managers",
      commonPriorities: args.priorities,
    },
    challenges: [
      {
        id: "missing",
        title: "Capability missing or gated",
        pain: "Teams discover the feature only after buying the wrong plan.",
        crmHelps: "Map must-haves to the qualifying plan before purchase.",
      },
      {
        id: "unused",
        title: "Capability unused after launch",
        pain: "Adoption fails and status drifts.",
        crmHelps: "Trial with a real workflow and a sceptic user.",
      },
      {
        id: "noise",
        title: "Too much noise",
        pain: "Notifications and views overwhelm contributors.",
        crmHelps: "Configure for the weekly ritual you will keep.",
      },
      {
        id: "wrong-job",
        title: "Wrong job cluster",
        pain: "A specialist tool is forced to act like a different HR job.",
        crmHelps: "Keep clusters on separate decision paths.",
      },
    ],
    outcomes: [
      {
        id: "clarity",
        title: "Clearer operating loop",
        description: "The capability supports a weekly ritual people keep.",
      },
      {
        id: "less-rework",
        title: "Less rework",
        description: "Status and handoffs need fewer manual chases.",
      },
      {
        id: "evidence",
        title: "Better evidence",
        description: "Managers can review attendance, hiring, or training records.",
      },
    ],
    capabilityNeeds: [
      {
        id: args.slug,
        title: args.title,
        description: `Evaluate ${args.title.toLowerCase()} on the plan you will buy.`,
        priority: "must" as const,
        href: `/capabilities/${args.slug}/`,
      },
    ],
    workflowSteps: [
      {
        id: "confirm",
        label: "Confirm must-have",
        detail: "Write the weekly outcome this capability must deliver.",
      },
      {
        id: "map",
        label: "Map plan gates",
        detail: "Check which tier unlocks the workflow.",
      },
      {
        id: "trial",
        label: "Trial with real data",
        detail: "Run one hiring pool, schedule week, or training path.",
      },
      {
        id: "decide",
        label: "Decide inside the cluster",
        detail: "Compare peers for the same job — not across clusters.",
      },
    ],
    priorities: args.priorities.slice(0, 3).map((title, i) => ({
      id: `p-${i}`,
      title,
      description: `${title} as a buying lens for this capability.`,
      icon: "check" as const,
    })),
    scenarios: [
      {
        id: "primary",
        title: "Primary job buyer",
        bestWhen: "This capability is central to the weekly HR/ops ritual.",
      },
      {
        id: "adjacent",
        title: "Adjacent buyer",
        bestWhen: "Another HR cluster is primary — keep this on a secondary shortlist.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm this capability is a must-have",
        href: "/guides/hr-requirements-guide/",
      },
      {
        step: 2,
        title: "Map it to seats and plan gates",
        href: "/guides/hr-pricing-guide/",
      },
      {
        step: 3,
        title: "Test it in a shared trial",
        href: "/guides/hr-evaluation-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/hr-software/",
        ctaLabel: "Best HR software →",
      },
    ],
    faq: [
      {
        question: `Is there one best platform for ${args.title.toLowerCase()}?`,
        answer: NO_UNIVERSAL,
      },
      {
        question: "How does this relate to CRM capabilities?",
        answer:
          "CRM capabilities store relationships and pipeline on customer records. HR capabilities hire, schedule, clock, document, or train people — often integrating with payroll/HRIS. Buy for the workforce job that is blocking first.",
      },
    ],
    relatedCapabilitySlugs: args.relatedCaps,
    relatedUseCaseSlugs: args.relatedUse,
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: [args.featureSlug],
    featuredGuideHrefs: [
      "/guides/how-to-choose-hr-software/",
      "/guides/what-is-hr-software/",
      "/best/hr-software/",
      "/categories/hr/",
    ],
    heroVisual: {
      src: `/capabilities/${args.slug}-hero.png`,
      alt: `Educational diagram of HR ${args.title.toLowerCase()} capability.`,
      caption: `${args.title} as buyers should evaluate it in an HR stack — not a product endorsement.`,
    },
    needsVisual: {
      src: `/capabilities/${args.slug}-needs-v2.png`,
      alt: `Diagram mapping ${args.title.toLowerCase()} pains to HR capability fixes.`,
      caption: `What usually breaks around ${args.title.toLowerCase()} — and how this capability helps.`,
    },
    workflowVisual: {
      src: `/capabilities/${args.slug}-workflow-v2.png`,
      alt: `Workflow diagram for using ${args.title.toLowerCase()} in HR.`,
      caption: `A practical operating loop for ${args.title.toLowerCase()}.`,
    },
  };
}

/**
 * HR capability hub depth.
 * Does **not** include `ai-assistance` (CRM owns) or `analytics-reporting` (BC owns).
 */
export const hrCapabilityDepth: Record<string, Depth> = {
  "applicant-tracking": hrCap({
    slug: "applicant-tracking",
    title: "Applicant tracking",
    badge: "Applicant tracking",
    tagline: "Pipelines, candidate profiles, and hiring workflows for recruiting teams.",
    overview:
      "Applicant tracking is the ATS capability that moves candidates through owned stages with collaborative hiring feedback.",
    who: "Recruiters, hiring managers, and talent ops running open roles.",
    matters: "Evaluate stages, capacity limits, and career-site posting on the plan you will buy.",
    example:
      "Worked example: Harbor Retail runs store-manager hiring in an ATS instead of a shared sheet.",
    example2:
      "Worked example: a startup keeps one active pool so founders stop losing candidates in email.",
    goal: "Owned hiring pipelines",
    priorities: ["Stages", "Collaboration", "Career site", "Plan gates", "Integrations"],
    relatedCaps: ["hris-integrations", "employee-training-paths"],
    relatedUse: ["recruiting-ats"],
    featureSlug: "applicant-tracking",
  }),
  "workforce-scheduling": hrCap({
    slug: "workforce-scheduling",
    title: "Workforce scheduling",
    badge: "Workforce scheduling",
    tagline: "Shift planning, open shifts, and schedule publishing for frontline teams.",
    overview:
      "Workforce scheduling is the capability that builds and publishes who works when for deskless and multi-site teams.",
    who: "Site and ops managers responsible for weekly coverage.",
    matters: "Evaluate publish workflows and open-shift fill on the hubs you will buy.",
    example:
      "Worked example: Northline Ops publishes next week by Thursday from a frontline app.",
    example2:
      "Worked example: a café fills call-outs with open shifts instead of phone trees.",
    goal: "Published schedules teams trust",
    priorities: ["Publish", "Open shifts", "Mobile", "Multi-site", "Hub TCO"],
    relatedCaps: ["frontline-comms", "time-attendance"],
    relatedUse: ["workforce-scheduling", "frontline-ops"],
    featureSlug: "workforce-scheduling",
  }),
  "time-attendance": hrCap({
    slug: "time-attendance",
    title: "Time & attendance",
    badge: "Time & attendance",
    tagline: "Clock-in/out, timesheets, and attendance policies for hourly and frontline staff.",
    overview:
      "Time & attendance captures who worked when with policies payroll can trust — distinct from project task timers.",
    who: "Ops and payroll-adjacent managers for hourly and field teams.",
    matters: "Evaluate clock methods, exception handling, and exports on the target plan.",
    example:
      "Worked example: Harbor Retail replaces paper timesheets with mobile clock-in.",
    example2:
      "Worked example: a field crew reviews exceptions before payroll export.",
    goal: "Trusted attendance records",
    priorities: ["Clock accuracy", "Policies", "Exceptions", "Exports", "Plan gates"],
    relatedCaps: ["gps-geofence-clockin", "workforce-scheduling", "hris-integrations"],
    relatedUse: ["time-attendance", "frontline-ops"],
    featureSlug: "time-attendance",
  }),
  "gps-geofence-clockin": hrCap({
    slug: "gps-geofence-clockin",
    title: "GPS / geofence clock-in",
    badge: "GPS / geofence",
    tagline: "Location-aware or geofenced clock-in for field and multi-site teams.",
    overview:
      "GPS / geofence clock-in verifies where employees punch in — useful for field and multi-site attendance integrity.",
    who: "Managers of field, multi-site, or location-sensitive hourly work.",
    matters: "Confirm geofence rules unlock on the plan you will buy — not only on a demo.",
    example:
      "Worked example: a field team can only clock in inside site geofences.",
    example2:
      "Worked example: a retailer reduces buddy-punching with location-aware punches.",
    goal: "Location-verified attendance",
    priorities: ["Geofence rules", "Mobile UX", "Exception handling", "Privacy", "Plan gates"],
    relatedCaps: ["time-attendance", "workforce-scheduling"],
    relatedUse: ["time-attendance", "frontline-ops"],
    featureSlug: "gps-geofence-clockin",
  }),
  "sop-knowledge-base": hrCap({
    slug: "sop-knowledge-base",
    title: "SOP / knowledge base",
    badge: "SOP knowledge base",
    tagline: "Documented SOPs, playbooks, and searchable employee knowledge bases.",
    overview:
      "SOP / knowledge base capability captures how work gets done so processes survive turnover.",
    who: "Ops and process owners documenting playbooks for growing teams.",
    matters: "Evaluate search, ownership, and acknowledgement on the qualifying plan.",
    example:
      "Worked example: Harbor Retail replaces a messy drive with owned SOPs by role.",
    example2:
      "Worked example: a founder documents closing procedures before opening a second site.",
    goal: "Searchable owned playbooks",
    priorities: ["Search", "Ownership", "Acknowledgements", "Versions", "Pricing clarity"],
    relatedCaps: ["employee-training-paths"],
    relatedUse: ["sop-documentation", "employee-training"],
    featureSlug: "sop-knowledge-base",
  }),
  "employee-training-paths": hrCap({
    slug: "employee-training-paths",
    title: "Employee training paths",
    badge: "Training paths",
    tagline: "Structured onboarding and role-based training paths with completion tracking.",
    overview:
      "Employee training paths assign role learning with completion evidence managers can review.",
    who: "HR and ops leaders onboarding and upskilling employees.",
    matters: "Evaluate assignment, tests/acknowledgements, and reporting on the plan you will buy.",
    example:
      "Worked example: Northline Ops assigns a store-opener path before solo shifts.",
    example2:
      "Worked example: a services firm tracks role completion instead of tribal shadowing.",
    goal: "Role training with evidence",
    priorities: ["Paths", "Assignment", "Completion", "Mobile", "Reporting"],
    relatedCaps: ["sop-knowledge-base", "hris-integrations"],
    relatedUse: ["employee-training", "sop-documentation"],
    featureSlug: "employee-training-paths",
  }),
  "frontline-comms": hrCap({
    slug: "frontline-comms",
    title: "Frontline communications",
    badge: "Frontline comms",
    tagline: "Mobile chat, announcements, and tasking for deskless / frontline workers.",
    overview:
      "Frontline communications keeps deskless teams informed without relying on fragile group SMS threads.",
    who: "Ops managers coordinating deskless and multi-site workers.",
    matters: "Evaluate mobile adoption and whether announcements reach people who will open the app.",
    example:
      "Worked example: Northline Ops replaces group SMS with in-app announcements tied to schedules.",
    example2:
      "Worked example: a retailer pushes daily tasks to store phones before open.",
    goal: "Reliable deskless communications",
    priorities: ["Mobile reach", "Announcements", "Tasking", "Adoption", "Hub packaging"],
    relatedCaps: ["workforce-scheduling", "time-attendance"],
    relatedUse: ["frontline-ops", "workforce-scheduling"],
    featureSlug: "frontline-comms",
  }),
  "hris-integrations": hrCap({
    slug: "hris-integrations",
    title: "HRIS integrations",
    badge: "HRIS integrations",
    tagline: "Native sync with HRIS, payroll, or people platforms for hire-to-retain workflows.",
    overview:
      "HRIS integrations connect hiring, attendance, and training tools to payroll and people systems so data does not live in exports alone.",
    who: "Ops and HR teams connecting ATS, time, or training tools to payroll/HRIS.",
    matters: "Prefer native depth over Zapier-only claims for must-have syncs.",
    example:
      "Worked example: Harbor Retail exports approved timesheets into payroll weekly without retyping.",
    example2:
      "Worked example: a hiring team hands new hires to HRIS without rebuilding records.",
    goal: "Reliable hire-to-retain sync",
    priorities: ["Native connectors", "Payroll sync", "Data mapping", "Error handling", "Security"],
    relatedCaps: ["applicant-tracking", "time-attendance"],
    relatedUse: ["recruiting-ats", "time-attendance"],
    featureSlug: "hris-integrations",
  }),
  "core-hris": hrCap({
    slug: "core-hris",
    title: "Core HRIS",
    badge: "Core HRIS",
    tagline: "Employee system of record for profiles, org chart, PTO, and people admin.",
    overview:
      "Core HRIS is the employee system of record — not a dedicated ATS or time clock.",
    who: "HR and people-ops teams that need trusted employee data.",
    matters: "Evaluate records, PTO, and whether payroll is included or add-on.",
    example:
      "Worked example: Harbor Retail sees org structure and PTO balances without a weekend spreadsheet.",
    example2:
      "Worked example: onboarding files live on the employee record, not in email.",
    goal: "Trusted people records",
    priorities: ["Records", "PTO", "Org chart", "Onboarding", "Add-on TCO"],
    relatedCaps: ["payroll-processing", "benefits-admin", "hris-integrations"],
    relatedUse: ["core-hris", "people-platform"],
    featureSlug: "core-hris",
  }),
  "payroll-processing": hrCap({
    slug: "payroll-processing",
    title: "Payroll processing",
    badge: "Payroll",
    tagline: "Run employee payroll, tax filings, and pay stubs.",
    overview:
      "Payroll processing is paying people correctly and filing on time — often the trigger to buy HR software.",
    who: "Office managers, founders, and HR generalists running pay.",
    matters: "Published pricing, state coverage, and add-on fees matter as much as features.",
    example:
      "Worked example: a studio runs first payroll on a published Simple plan.",
    example2:
      "Worked example: a multi-state team upgrades before the second entity’s first pay run.",
    goal: "Correct on-time pay",
    priorities: ["Pay runs", "Filings", "State coverage", "Benefits deductions", "TCO"],
    relatedCaps: ["benefits-admin", "core-hris", "time-attendance"],
    relatedUse: ["payroll-benefits", "people-platform"],
    featureSlug: "payroll-processing",
  }),
  "benefits-admin": hrCap({
    slug: "benefits-admin",
    title: "Benefits administration",
    badge: "Benefits admin",
    tagline: "Benefits eligibility, carrier admin, and open-enrollment workflows.",
    overview:
      "Benefits administration covers eligibility, deductions, carriers, and enrollment — often bundled with payroll or sold as an HRIS add-on.",
    who: "HR generalists administering medical and related benefits.",
    matters: "Confirm whether benefits are included, add-on, or a broker-led extra.",
    example:
      "Worked example: open enrollment deductions sync to the next payroll without retyping.",
    example2:
      "Worked example: a new hire’s benefits eligibility starts from the HRIS record.",
    goal: "Clean eligibility and deductions",
    priorities: ["Eligibility", "Carriers", "Deductions", "Enrollment", "Packaging"],
    relatedCaps: ["payroll-processing", "core-hris"],
    relatedUse: ["payroll-benefits", "core-hris"],
    featureSlug: "benefits-admin",
  }),
};
