import type { UseCaseHubProfile } from "@/domain";

type Depth = Pick<
  UseCaseHubProfile,
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "tagline"
  | "displayTitle"
  | "badgeLabel"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "needsVisual"
  | "workflowVisual"
  | "heroVisual"
  | "faq"
  | "relatedUseCaseSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
  | "finderHref"
  | "catalogueHref"
  | "primaryCta"
  | "secondaryCta"
  | "buyingGuideHref"
>;

const HR_CTAS = {
  categorySlug: "hr" as const,
  finderHref: "/best/hr-software/",
  catalogueHref: "/categories/hr/",
  buyingGuideHref: "/guides/how-to-choose-hr-software/",
  primaryCta: {
    href: "/best/hr-software/",
    label: "Best HR software",
  },
  secondaryCta: {
    href: "/categories/hr/",
    label: "Browse HR software",
  },
};

const HR_GUIDES = [
  "/guides/what-is-hr-software/",
  "/guides/how-to-choose-hr-software/",
  "/guides/hr-pricing-guide/",
  "/best/hr-software/",
];

function hrUseCase(args: {
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
  productsNote: string;
  related: string[];
  needs: Array<{
    id: string;
    title: string;
    description: string;
    priority: "must" | "nice";
  }>;
  steps: Array<{ id: string; label: string; detail: string; goal: string }>;
}): Depth {
  return {
    ...HR_CTAS,
    displayTitle: `HR software for ${args.title}`,
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
        id: "scatter",
        title: "Work lives in spreadsheets and chat",
        pain: "Managers reconstruct status every week.",
        crmHelps: "A shared system keeps owners and status visible.",
      },
      {
        id: "adoption",
        title: "Frontline adoption fails",
        pain: "People ignore the tool after launch.",
        crmHelps: "Mobile-ready workflows and a short weekly ritual.",
      },
      {
        id: "gates",
        title: "Must-haves are plan-gated",
        pain: "Teams discover limits after buying.",
        crmHelps: "Map must-haves to the qualifying plan before purchase.",
      },
      {
        id: "wrong-job",
        title: "Wrong job cluster",
        pain: "An ATS is forced to act like a time clock (or the reverse).",
        crmHelps: "Shortlist only tools whose primary job matches.",
      },
    ],
    outcomes: [
      {
        id: "owned",
        title: "Owned workflows",
        description: "Every active item has a person and a next step.",
      },
      {
        id: "visible",
        title: "Visible status",
        description: "Reviews start from the system, not from SMS.",
      },
      {
        id: "fewer-chasers",
        title: "Fewer manual chasers",
        description: "Publishing and notifications reduce pinging.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner handoffs",
        description: "Context stays attached to the hiring, shift, or training record.",
      },
    ],
    capabilityNeeds: args.needs.map((n) => ({
      ...n,
      href: `/capabilities/${n.id}/`,
    })),
    workflowSteps: args.steps,
    priorities: args.priorities.slice(0, 3).map((title, i) => ({
      id: `p-${i}`,
      title,
      description: `${title} as a buying lens for this use case.`,
      icon: "check" as const,
    })),
    scenarios: [
      {
        id: "primary",
        title: "Primary job buyer",
        bestWhen: "This use case is the blocking weekly ritual.",
      },
      {
        id: "adjacent",
        title: "Adjacent job",
        bestWhen: "Another HR cluster is primary — keep this tool on a separate shortlist.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm this use case is the primary job",
        href: "/guides/how-to-choose-hr-software/",
      },
      {
        step: 2,
        title: "Write must-have workflows",
        href: "/guides/hr-requirements-guide/",
      },
      {
        step: 3,
        title: "Price the qualifying configuration",
        href: "/guides/hr-pricing-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/hr-software/",
        ctaLabel: "Best HR software →",
      },
    ],
    heroVisual: {
      src: `/use-cases/${args.slug}-hero.png`,
      alt: `Educational diagram for ${args.title} in HR software.`,
      caption: `${args.title} as buyers should evaluate it — not a product endorsement.`,
    },
    needsVisual: {
      src: `/use-cases/${args.slug}-needs-v2.png`,
      alt: `Needs diagram for ${args.title}.`,
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: `/use-cases/${args.slug}-workflow-v2.png`,
      alt: `Workflow diagram for ${args.title}.`,
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: `In the current HR catalogue wave, explore: ${args.productsNote}. Related products appear when those soft entries are seeded and tagged.`,
      },
      {
        question: "Is there one best tool for this use case?",
        answer:
          "No. Fit depends on job cluster, headcount, and plan gates. Use the Best HR software page for methodology-based editor’s picks inside clusters — not one undifferentiated ranking.",
      },
    ],
    relatedUseCaseSlugs: args.related,
    featuredGuideHrefs: HR_GUIDES,
  };
}

/**
 * HR use-case hub depth (`/use-cases/[slug]/`).
 * Educational — no invented prices, scores, or product endorsements.
 */
export const hrUseCaseDepth: Record<string, Depth> = {
  "recruiting-ats": hrUseCase({
    slug: "recruiting-ats",
    title: "Recruiting / ATS",
    badge: "Recruiting / ATS",
    tagline:
      "Run hiring pipelines, career sites, and interview workflows in one ATS — instead of inbox archaeology.",
    overview:
      "Recruiting / ATS is the job of giving every open role a pipeline, every candidate an owner, and every interview a next step the hiring team trusts.",
    who: "Talent leads, hiring managers, and SMB recruiters who need collaborative hiring without a full HRIS suite.",
    matters:
      "Prioritise pipeline stages, career-site posting, and interview coordination on the plan you will actually buy.",
    example:
      "Worked example: Harbor Retail moves store manager hiring off shared sheets into an ATS. Every candidate has a stage owner; interviews stop getting double-booked.",
    example2:
      "Worked example: a five-person startup standardises one active role pipeline so founders stop losing candidates in email.",
    goal: "Owned hiring pipelines with trusted next steps",
    priorities: [
      "Pipeline stages",
      "Career site",
      "Interview workflow",
      "Collaborative hiring",
      "Plan gates",
    ],
    productsNote: "greenhouse, breezy-hr, workable, lever, ashby",
    related: ["employee-training", "frontline-ops"],
    needs: [
      {
        id: "applicant-tracking",
        title: "Applicant tracking",
        description: "Evaluate ATS pipelines on the plan you will buy.",
        priority: "must",
      },
      {
        id: "hris-integrations",
        title: "HRIS integrations",
        description: "Confirm hire-to-HRIS handoff paths.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "open",
        label: "Open the role",
        detail: "Create the pool/position with an owner.",
        goal: "No orphan openings.",
      },
      {
        id: "source",
        label: "Source candidates",
        detail: "Post and capture applicants into stages.",
        goal: "One pipeline of record.",
      },
      {
        id: "interview",
        label: "Interview",
        detail: "Schedule and capture feedback on the record.",
        goal: "Decisions without Slack archaeology.",
      },
      {
        id: "offer",
        label: "Decide & hand off",
        detail: "Advance or reject with a clear next step.",
        goal: "Clean hire-to-onboard handoff.",
      },
    ],
  }),

  "core-hris": hrUseCase({
    slug: "core-hris",
    title: "Core HRIS",
    badge: "Core HRIS",
    tagline:
      "Keep employee records, org charts, PTO, and onboarding in one people system of record.",
    overview:
      "Core HRIS is the job of holding trusted employee data — who works here, their manager, time off, and onboarding status — without rebuilding people admin in spreadsheets.",
    who: "HR and people-ops teams in small and mid-size companies that need a system of record before (or beside) payroll.",
    matters:
      "Prioritise employee records, PTO, and org structure on the plan you will buy. Confirm whether payroll is included or an add-on.",
    example:
      "Worked example: Harbor Retail moves headcount, PTO, and new-hire files out of shared drives into an HRIS so the CEO can see org structure without a three-day spreadsheet hunt.",
    example2:
      "Worked example: a 40-person firm standardises onboarding checklists on the employee record instead of email threads.",
    goal: "Trusted employee system of record",
    priorities: [
      "Employee records",
      "PTO / time off",
      "Org chart",
      "Onboarding files",
      "Add-on TCO (payroll/benefits)",
    ],
    productsNote: "bamboohr, hibob, personio, rippling",
    related: ["payroll-benefits", "people-platform", "enterprise-hcm", "recruiting-ats"],
    needs: [
      {
        id: "core-hris",
        title: "Core HRIS",
        description: "Evaluate employee records and people admin on the qualifying plan.",
        priority: "must",
      },
      {
        id: "payroll-processing",
        title: "Payroll processing",
        description: "Confirm whether payroll is native, add-on, or a separate product.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "record",
        label: "Create the record",
        detail: "Hire into the HRIS with an owner.",
        goal: "No shadow spreadsheets.",
      },
      {
        id: "admin",
        label: "Run people admin",
        detail: "PTO, org, and documents live on the profile.",
        goal: "Self-serve employee updates.",
      },
      {
        id: "handoff",
        label: "Hand off to payroll",
        detail: "Sync or export approved changes.",
        goal: "One source of truth.",
      },
      {
        id: "report",
        label: "Report",
        detail: "Pull headcount without a weekend of cleanup.",
        goal: "Trusted people reports.",
      },
    ],
  }),

  "payroll-benefits": hrUseCase({
    slug: "payroll-benefits",
    title: "Payroll & benefits",
    badge: "Payroll & benefits",
    tagline:
      "Run pay, tax filings, and benefits admin without a hidden-fee payroll surprise.",
    overview:
      "Payroll & benefits is the job of paying people correctly, filing taxes, and administering benefits — distinct from a dedicated ATS or frontline scheduler.",
    who: "Office managers, founders, and HR generalists running US SMB payroll — plus mid-market buyers evaluating quote-only HCM payroll (ADP, Paylocity, Paycor).",
    matters:
      "Prioritise published pricing when it exists (Gusto). For mid-market HCM, model custom PEPM and implementation — do not invent unpublished dollars.",
    example:
      "Worked example: a 12-person studio runs first payroll on a published Simple plan and adds benefits when the first full-time hire enrolls.",
    example2:
      "Worked example: a multi-state team upgrades off a single-state plan before the second entity’s first pay run.",
    goal: "Correct pay runs with clear TCO",
    priorities: [
      "Published payroll pricing",
      "State / filing coverage",
      "Benefits admin",
      "Add-on fees",
      "Month-to-month vs contract",
    ],
    productsNote: "gusto, adp-workforce-now, paylocity, paycor, rippling",
    related: ["core-hris", "people-platform", "enterprise-hcm"],
    needs: [
      {
        id: "payroll-processing",
        title: "Payroll processing",
        description: "Evaluate pay runs and filings on the plan you will buy.",
        priority: "must",
      },
      {
        id: "benefits-admin",
        title: "Benefits administration",
        description: "Confirm carrier admin and deductions packaging.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "setup",
        label: "Set up the company",
        detail: "Register tax info and pay schedule.",
        goal: "Ready for first payroll.",
      },
      {
        id: "run",
        label: "Run payroll",
        detail: "Approve hours and submit the run.",
        goal: "On-time pay.",
      },
      {
        id: "benefits",
        label: "Admin benefits",
        detail: "Deductions and enrollments stay in sync.",
        goal: "Fewer payroll corrections.",
      },
      {
        id: "file",
        label: "File",
        detail: "Confirm tax filings and year-end documents.",
        goal: "Compliance without panic.",
      },
    ],
  }),

  "people-platform": hrUseCase({
    slug: "people-platform",
    title: "People platform",
    badge: "People platform",
    tagline:
      "Unify hire, pay, and IT access on one employee record instead of stitching five tools.",
    overview:
      "A people platform is the job of sharing one employee system of record across HR, payroll, and often devices/SSO/spend — so a hire event provisions more than an HR file.",
    who: "Ops, IT, and HR leaders at growing companies tired of reconciling HRIS, identity, and payroll.",
    matters:
      "Prioritise the modules you will actually turn on. Published PEPM floors are rarely all-in TCO.",
    example:
      "Worked example: a 80-person SaaS company provisions laptop, Slack, and payroll from the same hire event instead of three onboarding tickets.",
    example2:
      "Worked example: finance and IT share one termination workflow so access and pay stop on the same day.",
    goal: "One hire-to-access-to-pay record",
    priorities: [
      "Unified employee record",
      "Payroll module TCO",
      "IT / identity provisioning",
      "Implementation effort",
      "Module stacking",
    ],
    productsNote: "rippling",
    related: ["core-hris", "payroll-benefits", "enterprise-hcm"],
    needs: [
      {
        id: "core-hris",
        title: "Core HRIS",
        description: "The employee graph must be the system of record.",
        priority: "must",
      },
      {
        id: "payroll-processing",
        title: "Payroll processing",
        description: "Confirm payroll is native versus a bolted-on export.",
        priority: "must",
      },
    ],
    steps: [
      {
        id: "hire",
        label: "Hire into the graph",
        detail: "Create the employee once.",
        goal: "No duplicate records.",
      },
      {
        id: "provision",
        label: "Provision access",
        detail: "Apps and devices follow the record.",
        goal: "Day-one access.",
      },
      {
        id: "pay",
        label: "Pay",
        detail: "Payroll reads the same record.",
        goal: "Hire-to-pay without retyping.",
      },
      {
        id: "change",
        label: "Change / exit",
        detail: "Role or termination updates HR, pay, and access together.",
        goal: "One offboarding path.",
      },
    ],
  }),

  "enterprise-hcm": hrUseCase({
    slug: "enterprise-hcm",
    title: "Enterprise HCM",
    badge: "Enterprise HCM",
    tagline:
      "Run a Workday-class people system — HR, payroll, talent, and often WFM — for 1,000+ employee organisations.",
    overview:
      "Enterprise HCM is the job of running a full human capital suite for large organisations: global HR, payroll, talent, and often workforce management. Implementation and custom quotes dominate TCO — these are not SMB HRIS or published-PEPM payroll peers.",
    who: "CHRO, HRIS, payroll, and transformation leaders at mid-market-to-enterprise organisations (typically 1,000+ employees) replacing or consolidating people systems.",
    matters:
      "Prioritise system-of-record depth, global payroll/localisation, WFM if hourly complexity is the job, and implementation TCO. Do not shortlist these as Gusto or BambooHR substitutes.",
    example:
      "Worked example: a 4,000-person manufacturer consolidates HR, payroll, and talent onto one HCM so country payroll and manager self-service share one employee record.",
    example2:
      "Worked example: a hospital system evaluates UKG Pro when complex 24/7 scheduling must live in the same HCM as payroll — not a Connecteam-class frontline app.",
    goal: "One enterprise people system of record",
    priorities: [
      "Global HR / localisation",
      "Payroll + time on one record",
      "Implementation TCO",
      "WFM depth (if hourly)",
      "Quote vs published PEPM",
    ],
    productsNote: "workday, oracle-hcm, ukg-pro, dayforce",
    related: ["core-hris", "payroll-benefits", "people-platform", "workforce-scheduling"],
    needs: [
      {
        id: "core-hris",
        title: "Core HRIS",
        description: "The employee graph must be the enterprise system of record.",
        priority: "must",
      },
      {
        id: "payroll-processing",
        title: "Payroll processing",
        description: "Confirm native vs module payroll and country coverage.",
        priority: "must",
      },
      {
        id: "workforce-scheduling",
        title: "Workforce scheduling",
        description: "Required when complex hourly WFM is in-scope (UKG / Dayforce paths).",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "scope",
        label: "Scope the programme",
        detail: "Name HR, payroll, talent, and WFM modules in year one.",
        goal: "No surprise module stack.",
      },
      {
        id: "quote",
        label: "Quote TCO",
        detail: "PEPM plus implementation, integrations, and country packs.",
        goal: "Honest multi-year cost.",
      },
      {
        id: "pilot",
        label: "Pilot a country or BU",
        detail: "Prove hire-to-pay on one population before rollout.",
        goal: "Go-live without a big-bang surprise.",
      },
      {
        id: "operate",
        label: "Operate",
        detail: "Managers self-serve; payroll and HR share one record.",
        goal: "Trusted enterprise people ops.",
      },
    ],
  }),

  "workforce-scheduling": hrUseCase({
    slug: "workforce-scheduling",
    title: "Workforce scheduling",
    badge: "Workforce scheduling",
    tagline:
      "Plan shifts, cover open shifts, and publish schedules frontline teams can trust.",
    overview:
      "Workforce scheduling is the job of publishing who works when — with coverage that managers can defend without rebuilding the week in spreadsheets.",
    who: "Ops and site managers for retail, hospitality, and deskless teams.",
    matters:
      "Prioritise shift publish, open-shift fill, and mobile visibility on the hubs you will buy.",
    example:
      "Worked example: Northline Ops publishes next week by Thursday noon from a frontline app instead of group SMS.",
    example2:
      "Worked example: a café chain fills open shifts from the app so managers stop calling through a paper list.",
    goal: "Published schedules with clear coverage",
    priorities: [
      "Shift publish",
      "Open shifts",
      "Mobile access",
      "Multi-site",
      "Hub pricing",
    ],
    productsNote: "connecteam, homebase, when-i-work, deputy, 7shifts",
    related: ["frontline-ops", "time-attendance"],
    needs: [
      {
        id: "workforce-scheduling",
        title: "Workforce scheduling",
        description: "Evaluate shift planning on the qualifying hub.",
        priority: "must",
      },
      {
        id: "frontline-comms",
        title: "Frontline communications",
        description: "Confirm mobile announcements and tasking.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "draft",
        label: "Draft the week",
        detail: "Build shifts with roles and sites.",
        goal: "Coverage before publish.",
      },
      {
        id: "publish",
        label: "Publish",
        detail: "Push the schedule to mobile workers.",
        goal: "One agreed calendar.",
      },
      {
        id: "fill",
        label: "Fill gaps",
        detail: "Use open shifts for call-outs.",
        goal: "Fewer panic texts.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Check overtime and coverage patterns.",
        goal: "One improvement per week.",
      },
    ],
  }),

  "time-attendance": hrUseCase({
    slug: "time-attendance",
    title: "Time & attendance",
    badge: "Time & attendance",
    tagline:
      "Capture trusted clock-ins, timesheets, and attendance policies for hourly and field staff.",
    overview:
      "Time & attendance is the job of knowing who worked when — with GPS/face policies payroll can trust — distinct from project task time tracking.",
    who: "Ops and payroll-adjacent managers responsible for hourly and field attendance.",
    matters:
      "Prioritise clock-in accuracy, policy enforcement, and export paths on the plan you will buy.",
    example:
      "Worked example: Harbor Retail replaces paper timesheets with GPS clock-in so payroll disputes drop.",
    example2:
      "Worked example: a field crew clocks in from site geofences instead of honour-system spreadsheets.",
    goal: "Accurate attendance payroll can trust",
    priorities: [
      "Clock-in accuracy",
      "GPS / face policy",
      "Timesheets",
      "Exports",
      "Free vs paid gates",
    ],
    productsNote: "jibble, connecteam",
    related: ["workforce-scheduling", "frontline-ops"],
    needs: [
      {
        id: "time-attendance",
        title: "Time & attendance",
        description: "Evaluate clock-in and timesheets on the target plan.",
        priority: "must",
      },
      {
        id: "gps-geofence-clockin",
        title: "GPS / geofence clock-in",
        description: "Confirm location policy on the qualifying tier.",
        priority: "must",
      },
    ],
    steps: [
      {
        id: "policy",
        label: "Set policy",
        detail: "Define clock rules and locations.",
        goal: "Clear attendance rules.",
      },
      {
        id: "clock",
        label: "Clock in/out",
        detail: "Workers use mobile or kiosk.",
        goal: "Captured attendance.",
      },
      {
        id: "review",
        label: "Review exceptions",
        detail: "Managers fix missed punches.",
        goal: "Clean timesheets.",
      },
      {
        id: "export",
        label: "Export / sync",
        detail: "Send hours to payroll or HRIS.",
        goal: "Fewer payroll disputes.",
      },
    ],
  }),

  "employee-training": hrUseCase({
    slug: "employee-training",
    title: "Employee training",
    badge: "Employee training",
    tagline:
      "Deliver role-based training paths with completion tracking managers can review.",
    overview:
      "Employee training is the job of getting people productive in role — with assigned paths and evidence of completion, not tribal shadowing alone.",
    who: "Ops and HR leaders rolling out onboarding and role training for growing teams.",
    matters:
      "Prioritise path assignment, completion evidence, and mobile access on the plan you will buy.",
    example:
      "Worked example: Northline Ops assigns a store-opener path so new hires complete SOPs before solo shifts.",
    example2:
      "Worked example: a services firm tracks role training completion instead of hoping managers remember.",
    goal: "Role training with completion evidence",
    priorities: [
      "Training paths",
      "Completion tracking",
      "Role assignment",
      "Mobile access",
      "Content ownership",
    ],
    productsNote: "trainual, learnworlds (LMS landscape)",
    related: ["sop-documentation", "recruiting-ats"],
    needs: [
      {
        id: "employee-training-paths",
        title: "Employee training paths",
        description: "Evaluate path and completion features on the target plan.",
        priority: "must",
      },
      {
        id: "sop-knowledge-base",
        title: "SOP / knowledge base",
        description: "Confirm playbooks feed the training paths.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "define",
        label: "Define the path",
        detail: "Map role steps and owners.",
        goal: "Clear training sequence.",
      },
      {
        id: "assign",
        label: "Assign",
        detail: "Give paths to new or changing roles.",
        goal: "No orphan learners.",
      },
      {
        id: "complete",
        label: "Complete & evidence",
        detail: "Track tests or acknowledgements.",
        goal: "Visible progress.",
      },
      {
        id: "coach",
        label: "Coach gaps",
        detail: "Managers review incomplete steps.",
        goal: "One improvement per cohort.",
      },
    ],
  }),

  "sop-documentation": hrUseCase({
    slug: "sop-documentation",
    title: "SOP documentation",
    badge: "SOP documentation",
    tagline:
      "Document playbooks and standard operating procedures as a searchable knowledge base.",
    overview:
      "SOP documentation is the job of capturing how work gets done so it survives turnover and scales beyond tribal knowledge.",
    who: "Ops leaders and process owners in growing companies (roughly tens to hundreds of employees).",
    matters:
      "Prioritise searchable playbooks, ownership, and acknowledgement on the plan you will buy.",
    example:
      "Worked example: Harbor Retail replaces a messy drive folder with owned SOPs assigned by role.",
    example2:
      "Worked example: a founder documents closing procedures so the second location opens without them present.",
    goal: "Searchable owned playbooks",
    priorities: [
      "Searchable SOPs",
      "Role ownership",
      "Acknowledgements",
      "Version clarity",
      "Pricing transparency",
    ],
    productsNote: "trainual",
    related: ["employee-training", "frontline-ops"],
    needs: [
      {
        id: "sop-knowledge-base",
        title: "SOP / knowledge base",
        description: "Evaluate playbook depth on the qualifying plan.",
        priority: "must",
      },
      {
        id: "employee-training-paths",
        title: "Employee training paths",
        description: "Link SOPs into assigned paths when needed.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "capture",
        label: "Capture the process",
        detail: "Write the playbook with an owner.",
        goal: "No tribal-only steps.",
      },
      {
        id: "organize",
        label: "Organize",
        detail: "Structure subjects by role or site.",
        goal: "Findable knowledge.",
      },
      {
        id: "assign",
        label: "Assign",
        detail: "Require acknowledgement or tests.",
        goal: "Accountable readers.",
      },
      {
        id: "refresh",
        label: "Refresh",
        detail: "Update when the process changes.",
        goal: "Living documentation.",
      },
    ],
  }),

  "frontline-ops": hrUseCase({
    slug: "frontline-ops",
    title: "Frontline operations",
    badge: "Frontline operations",
    tagline:
      "Coordinate deskless workers with mobile scheduling, communications, and tasks.",
    overview:
      "Frontline operations is the job of keeping deskless teams aligned — schedules, announcements, and tasks on a phone they will actually open.",
    who: "Ops leaders for retail, hospitality, field, and multi-site deskless workforces.",
    matters:
      "Prioritise mobile adoption, scheduling plus comms, and hub TCO on the configuration you will buy.",
    example:
      "Worked example: Northline Ops replaces group SMS with mobile announcements tied to the published schedule.",
    example2:
      "Worked example: a multi-site retailer gives managers one app for shifts and daily tasks.",
    goal: "Mobile-first deskless coordination",
    priorities: [
      "Mobile adoption",
      "Scheduling + comms",
      "Tasking",
      "Multi-site",
      "Hub TCO",
    ],
    productsNote: "connecteam, homebase, deputy, when-i-work",
    related: ["workforce-scheduling", "time-attendance", "employee-training"],
    needs: [
      {
        id: "frontline-comms",
        title: "Frontline communications",
        description: "Evaluate mobile chat and announcements.",
        priority: "must",
      },
      {
        id: "workforce-scheduling",
        title: "Workforce scheduling",
        description: "Confirm shift publish on the same app.",
        priority: "must",
      },
      {
        id: "time-attendance",
        title: "Time & attendance",
        description: "Optional if clock-in is part of the same rollout.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "publish",
        label: "Publish the plan",
        detail: "Share schedules and priorities.",
        goal: "One source of truth.",
      },
      {
        id: "communicate",
        label: "Communicate",
        detail: "Send announcements and tasks to mobile.",
        goal: "Less SMS chaos.",
      },
      {
        id: "execute",
        label: "Execute",
        detail: "Workers complete shifts and tasks.",
        goal: "Visible completion.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Managers check coverage and follow-ups.",
        goal: "One ops improvement weekly.",
      },
    ],
  }),
};
