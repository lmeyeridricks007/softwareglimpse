import type { z } from "zod";
import {
  AudiencePageSchema,
  BusinessSizeSchema,
  BusinessTypeSchema,
  CapabilitySchema,
  TeamTypeSchema,
  UseCaseSchema,
  UserPrioritySchema,
} from "@/domain";

type BusinessSizeInput = z.input<typeof BusinessSizeSchema>;
type TeamTypeInput = z.input<typeof TeamTypeSchema>;
type BusinessTypeInput = z.input<typeof BusinessTypeSchema>;
type UseCaseInput = z.input<typeof UseCaseSchema>;
type CapabilityInput = z.input<typeof CapabilitySchema>;
type UserPriorityInput = z.input<typeof UserPrioritySchema>;
type AudienceInput = z.input<typeof AudiencePageSchema>;

export const businessSizesSeed: BusinessSizeInput[] = [
  {
    id: "bs-solo",
    slug: "solo",
    name: "Solo",
    shortDescription: "Independent operators and freelancers.",
    employeeMin: 1,
    employeeMax: 1,
    sortOrder: 1,
  },
  {
    id: "bs-micro",
    slug: "micro",
    name: "Micro",
    shortDescription: "Very small teams.",
    employeeMin: 2,
    employeeMax: 10,
    sortOrder: 2,
  },
  {
    id: "bs-small-business",
    slug: "small-business",
    name: "Small business",
    shortDescription: "Small businesses with growing sales needs.",
    employeeMin: 11,
    employeeMax: 50,
    sortOrder: 3,
  },
  {
    id: "bs-mid-market",
    slug: "mid-market",
    name: "Mid-market",
    shortDescription: "Mid-sized organizations.",
    employeeMin: 51,
    employeeMax: 500,
    sortOrder: 4,
  },
  {
    id: "bs-enterprise",
    slug: "enterprise",
    name: "Enterprise",
    shortDescription: "Large organizations with complex requirements.",
    employeeMin: 501,
    employeeMax: null,
    sortOrder: 5,
  },
];

export const teamTypesSeed: TeamTypeInput[] = [
  {
    id: "team-sales",
    slug: "sales",
    name: "Sales",
    categorySlugs: ["crm", "sales-intelligence"],
    sortOrder: 1,
  },
  {
    id: "team-marketing",
    slug: "marketing",
    name: "Marketing",
    categorySlugs: ["crm", "marketing"],
    sortOrder: 2,
  },
  {
    id: "team-customer-success",
    slug: "customer-success",
    name: "Customer success",
    categorySlugs: ["crm", "customer-service"],
    sortOrder: 3,
  },
  {
    id: "team-founders",
    slug: "founders",
    name: "Founders",
    categorySlugs: ["crm"],
    sortOrder: 4,
  },
  {
    id: "team-recruiting",
    slug: "recruiting",
    name: "Recruiting",
    categorySlugs: ["hr"],
    sortOrder: 5,
  },
  {
    id: "team-engineering",
    slug: "engineering",
    name: "Engineering",
    categorySlugs: ["it-development", "project-management"],
    sortOrder: 6,
  },
  {
    id: "team-it-ops",
    slug: "it-ops",
    name: "IT operations",
    categorySlugs: ["it-development"],
    sortOrder: 7,
  },
  {
    id: "team-operations",
    slug: "operations",
    name: "Operations",
    categorySlugs: ["crm", "ai"],
    sortOrder: 8,
  },
];

export const businessTypesSeed: BusinessTypeInput[] = [
  { id: "bt-startup", slug: "startup", name: "Startup", sortOrder: 1 },
  { id: "bt-agency", slug: "agency", name: "Agency", sortOrder: 2 },
  {
    id: "bt-consultancy",
    slug: "consultancy",
    name: "Consultancy",
    sortOrder: 3,
  },
  {
    id: "bt-professional-services",
    slug: "professional-services",
    name: "Professional services",
    sortOrder: 4,
  },
  { id: "bt-saas", slug: "saas", name: "SaaS", sortOrder: 5 },
  {
    id: "bt-local-business",
    slug: "local-business",
    name: "Local business",
    sortOrder: 6,
  },
];

function useCase(
  input: Omit<UseCaseInput, "metadata" | "seo"> &
    Partial<Pick<UseCaseInput, "metadata" | "seo">>,
): UseCaseInput {
  const description =
    input.description ?? input.shortDescription ?? `${input.name} software use case.`;
  return {
    ...input,
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T12:00:00.000Z",
      reviewedAt: "2026-08-14T12:00:00.000Z",
      ...input.metadata,
    },
    seo: {
      indexable: true,
      canonicalPath: `/use-cases/${input.slug}/`,
      title: `${input.name} CRM use case | SoftwareGlimpse`,
      description,
      ...input.seo,
    },
  };
}

/** CRM (+ related) use-case hubs — editorial gate approved. */
export const useCasesSeed: UseCaseInput[] = [
  useCase({
    id: "uc-pipeline-management",
    slug: "pipeline-management",
    name: "Pipeline management",
    shortDescription:
      "Track deals through stages, keep ownership clear, and see where opportunities stall.",
    description:
      "Pipeline management use cases cover deal stages, activity follow-ups, and visibility for sales teams that need a shared view of opportunities — not a private spreadsheet.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-lead-management",
    slug: "lead-management",
    name: "Lead management",
    shortDescription:
      "Capture, qualify, and route leads before they become pipeline deals.",
    categorySlugs: ["crm", "sales-intelligence"],
  }),
  useCase({
    id: "uc-contact-management",
    slug: "contact-management",
    name: "Contact management",
    shortDescription:
      "Keep people, companies, and interaction history in one searchable system.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-sales-automation",
    slug: "sales-automation",
    name: "Sales automation",
    shortDescription:
      "Reduce repetitive follow-ups with workflows that still need human judgment.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-email-outreach",
    slug: "email-outreach",
    name: "Email outreach",
    shortDescription:
      "Connect sales email sequences and tracking to CRM records.",
    categorySlugs: ["crm", "sales-intelligence"],
  }),
  useCase({
    id: "uc-prospecting",
    slug: "prospecting",
    name: "Prospecting",
    shortDescription:
      "Find and prioritize accounts and contacts before the first conversation.",
    categorySlugs: ["sales-intelligence"],
  }),
  useCase({
    id: "uc-relationship-management",
    slug: "relationship-management",
    name: "Relationship management",
    shortDescription:
      "Maintain ongoing customer context beyond the first closed deal.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-sales-engagement",
    slug: "sales-engagement",
    name: "Sales engagement",
    shortDescription:
      "Coordinate calling, messaging, and cadence tools around CRM records.",
    categorySlugs: ["crm", "sales-intelligence"],
  }),
  useCase({
    id: "uc-reporting",
    slug: "reporting",
    name: "Reporting",
    shortDescription:
      "Forecast and pipeline reporting managers can trust without spreadsheet rebuilds.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-account-management",
    slug: "account-management",
    name: "Account management",
    shortDescription:
      "Own post-sale accounts with stakeholders, renewals, and expansion opportunities in one place.",
    description:
      "Account management use cases cover ongoing customer ownership after the first close — stakeholder maps, renewal tracking, expansion pipeline, and handoffs between sales and success.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-outbound-sales",
    slug: "outbound-sales",
    name: "Outbound sales",
    shortDescription:
      "Run targeted outbound sequences with ownership, logging, and clear next steps in CRM.",
    description:
      "Outbound sales use cases focus on researching accounts, sequencing outreach, logging replies, and converting interested prospects into owned pipeline — without losing activity in personal inboxes.",
    categorySlugs: ["crm", "sales-intelligence"],
  }),
  useCase({
    id: "uc-inbound-sales",
    slug: "inbound-sales",
    name: "Inbound sales",
    shortDescription:
      "Capture inbound demand, assign owners fast, and qualify into pipeline without inbox chaos.",
    description:
      "Inbound sales use cases cover form and demo request capture, SLA-based assignment, qualification stages, and converting interested leads into owned opportunities.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-field-sales",
    slug: "field-sales",
    name: "Field sales",
    shortDescription:
      "Keep territory visits, notes, and follow-ups visible when sellers work away from the desk.",
    description:
      "Field sales use cases cover territory accounts, on-site visits, offline-friendly logging, and next-step discipline so managers see progress without hallway updates.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-high-volume-lead-management",
    slug: "high-volume-lead-management",
    name: "High-volume lead management",
    shortDescription:
      "Route and work large inbound or outbound lead volumes without losing ownership or SLAs.",
    description:
      "High-volume lead management use cases emphasize fast capture, routing rules, queue visibility, duplicate control, and conversion hygiene when volume exceeds a handful of leads per day.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-complex-sales-processes",
    slug: "complex-sales-processes",
    name: "Complex sales processes",
    shortDescription:
      "Coordinate multi-stakeholder deals with stages, approvals, and shared buying-group context.",
    description:
      "Complex sales process use cases cover longer cycles with multiple stakeholders, approval gates, multi-thread relationships, and handoffs that preserve context across the buying group.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-customer-follow-up",
    slug: "customer-follow-up",
    name: "Customer follow-up",
    shortDescription:
      "Never drop promised next steps — tasks, reminders, and history attached to the right record.",
    description:
      "Customer follow-up use cases focus on due dates, owned tasks, and activity history so promises after meetings, demos, and support moments actually happen.",
    categorySlugs: ["crm"],
  }),
  useCase({
    id: "uc-sales-forecasting",
    slug: "sales-forecasting",
    name: "Sales forecasting",
    shortDescription:
      "Build forecasts from pipeline truth — stages, categories, and hygiene — not optimistic storytelling.",
    description:
      "Sales forecasting use cases cover commit categories, stage-based projections, and weekly forecast reviews that managers can defend because the underlying pipeline is clean.",
    categorySlugs: ["crm"],
  }),
  // Email marketing content-candidate use cases (hub depth in use-case-hub/email-marketing-deep.ts)
  useCase({
    id: "uc-newsletters",
    slug: "newsletters",
    name: "Newsletters",
    shortDescription:
      "Compose, schedule, and measure recurring permission-based newsletters on a clean subscriber list.",
    description:
      "Newsletter use cases cover reusable templates, scheduling, list hygiene, and campaign analytics for creators and teams whose primary cadence is editorial or promo newsletters.",
    categorySlugs: ["email-marketing"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/newsletters/",
      title: "Email marketing for Newsletters | SoftwareGlimpse",
      description:
        "How email marketing software supports newsletters — templates, cadence, list hygiene, and analytics for permission-based sends.",
    },
  }),
  useCase({
    id: "uc-marketing-automation",
    slug: "marketing-automation",
    name: "Marketing automation",
    shortDescription:
      "Run multi-step permission-based email journeys triggered by subscriber behavior.",
    description:
      "Email-centered marketing automation covers welcome series, nurture paths, and behavioral workflows in an ESP — not cold outbound sequencing or a full multi-channel MAP.",
    categorySlugs: ["email-marketing", "marketing"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/marketing-automation/",
      title: "Email marketing automation | SoftwareGlimpse",
      description:
        "How ESPs support marketing automation — triggers, branching, plan limits, and journey analytics for opted-in subscribers.",
    },
  }),
  useCase({
    id: "uc-ecommerce-email",
    slug: "ecommerce-email",
    name: "Ecommerce email",
    shortDescription:
      "Connect store events to cart recovery, post-purchase, and segmented promo campaigns.",
    description:
      "Ecommerce email use cases cover store integrations, cart and lifecycle journeys, and promo campaigns while the commerce platform remains the order system of record.",
    categorySlugs: ["email-marketing"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ecommerce-email/",
      title: "Email marketing for Ecommerce | SoftwareGlimpse",
      description:
        "How email marketing supports ecommerce — store sync, cart journeys, segmented promos, and deliverability at volume.",
    },
  }),
  useCase({
    id: "uc-lead-nurturing",
    slug: "lead-nurturing",
    name: "Lead nurturing",
    shortDescription:
      "Educate and qualify opted-in leads with drips and journeys before sales or purchase handoff.",
    description:
      "Lead nurturing via email marketing uses permission-based drips, engagement segments, and CRM handoff rules — distinct from cold outreach sequencers.",
    categorySlugs: ["email-marketing"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/lead-nurturing/",
      title: "Email marketing for Lead nurturing | SoftwareGlimpse",
      description:
        "How ESPs support lead nurturing — opt-in capture, drips, branching, and clean sales handoffs.",
    },
  }),
  useCase({
    id: "uc-small-business-campaigns",
    slug: "small-business-campaigns",
    name: "Small-business campaigns",
    shortDescription:
      "Ship straightforward promo and update campaigns a small team can run without enterprise complexity.",
    description:
      "Small-business campaign use cases prioritize ease of use, templates, transparent contact-tier pricing, and light automation for owner-led teams.",
    categorySlugs: ["email-marketing"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/small-business-campaigns/",
      title: "Email marketing for Small-business campaigns | SoftwareGlimpse",
      description:
        "How small businesses choose email marketing for campaigns — simplicity, templates, contact tiers, and cadence.",
    },
  }),
  // Business communications content-candidate use cases
  // (hub depth in use-case-hub/business-communications-deep.ts)
  useCase({
    id: "uc-business-phone",
    slug: "business-phone",
    name: "Business phone",
    shortDescription:
      "Give the business real phone numbers, shared answering, and call logging instead of personal mobiles.",
    description:
      "Business phone use cases cover number provisioning and porting, softphone apps, shared answering, and call logging so customer calls reach the right person and leave a record.",
    categorySlugs: ["business-communications", "voip-business-phone"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/business-phone/",
      title: "Business phone systems | SoftwareGlimpse",
      description:
        "How cloud phone software supports business calling — numbers, softphones, shared answering, and call logging.",
    },
  }),
  useCase({
    id: "uc-sales-calling",
    slug: "sales-calling",
    name: "Sales calling & dialing",
    shortDescription:
      "Run outbound call volume with dialing tools and automatic CRM logging instead of hand-typed numbers.",
    description:
      "Sales calling use cases cover power dialing, local presence, call dispositions, and CRM write-back for teams whose day is measured in conversations attempted.",
    categorySlugs: ["business-communications", "voip-business-phone"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/sales-calling/",
      title: "Sales calling & dialing software | SoftwareGlimpse",
      description:
        "How business communications software supports outbound sales calling — dialers, dispositions, and CRM logging.",
    },
  }),
  useCase({
    id: "uc-customer-messaging",
    slug: "customer-messaging",
    name: "Customer messaging",
    shortDescription:
      "Answer customer SMS and chat as a team, with assignment and history instead of one person's phone.",
    description:
      "Customer messaging use cases cover shared inboxes, assignment and ownership, templates, and conversation history across SMS and chat channels.",
    categorySlugs: ["business-communications"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/customer-messaging/",
      title: "Customer messaging software | SoftwareGlimpse",
      description:
        "How customer messaging platforms support shared inboxes, assignment, templates, and conversation history.",
    },
  }),
  useCase({
    id: "uc-whatsapp-support",
    slug: "whatsapp-support",
    name: "WhatsApp support & sales",
    shortDescription:
      "Run WhatsApp as a business channel with a shared inbox, approved templates, and broadcast rules.",
    description:
      "WhatsApp use cases cover the official Business API, shared team inboxes, template approval, broadcasts, and the Meta conversation fees that sit alongside a platform subscription.",
    categorySlugs: ["business-communications"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/whatsapp-support/",
      title: "WhatsApp Business support & sales | SoftwareGlimpse",
      description:
        "How WhatsApp Business platforms support customer support and sales — shared inbox, templates, broadcasts, and message fees.",
    },
  }),
  useCase({
    id: "uc-team-communication",
    slug: "team-communication",
    name: "Team communication",
    shortDescription:
      "Move internal coordination out of personal messaging apps into channels the business controls.",
    description:
      "Team communication use cases cover internal channels, shift and multi-site coordination, and administrative control for teams currently running on personal chat groups.",
    categorySlugs: ["business-communications"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/team-communication/",
      title: "Team communication software | SoftwareGlimpse",
      description:
        "How team messaging software supports internal coordination — channels, multi-site teams, and admin control.",
    },
  }),
  useCase({
    id: "uc-contact-center",
    slug: "contact-center",
    name: "Contact center & queues",
    shortDescription:
      "Route inbound volume through IVR menus and queues with reporting managers can act on.",
    description:
      "Contact center use cases cover IVR menus, queues and overflow, business-hours rules, agent availability, and the queue reporting a support manager reviews weekly.",
    categorySlugs: ["business-communications", "voip-business-phone"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/contact-center/",
      title: "Contact center & call queue software | SoftwareGlimpse",
      description:
        "How contact center software supports IVR, queues, business-hours routing, and agent performance reporting.",
    },
  }),
  // Project management content-candidate use cases
  // (hub depth in use-case-hub/project-management-deep.ts)
  useCase({
    id: "uc-work-management",
    slug: "work-management",
    name: "Work management / Work OS",
    shortDescription:
      "Run cross-team work on shared boards, timelines, and automations instead of Slack and sheets.",
    description:
      "Work management use cases cover work OS boards, ownership, automations, and portfolio visibility for teams coordinating delivery.",
    categorySlugs: ["project-management"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/work-management/",
      title: "Work management / Work OS software | SoftwareGlimpse",
      description:
        "How work OS software supports shared boards, timelines, automations, and delivery visibility.",
    },
  }),
  useCase({
    id: "uc-project-tracking",
    slug: "project-tracking",
    name: "Project & task tracking",
    shortDescription:
      "Keep tasks owned, dated, and reviewable so delivery status is not tribal knowledge.",
    description:
      "Project tracking use cases cover tasks, owners, due dates, and status discipline for delivery teams.",
    categorySlugs: ["project-management"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/project-tracking/",
      title: "Project & task tracking software | SoftwareGlimpse",
      description:
        "How project tracking software supports owned tasks, due dates, and reviewable status.",
    },
  }),
  useCase({
    id: "uc-timeline-reporting",
    slug: "timeline-reporting",
    name: "Timeline & executive reporting",
    shortDescription:
      "Show sequence, dependencies, and milestones to executives and clients.",
    description:
      "Timeline reporting use cases cover Gantt, roadmap, and executive-ready views — live in a work OS or as presentation slides.",
    categorySlugs: ["project-management"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/timeline-reporting/",
      title: "Timeline & executive reporting software | SoftwareGlimpse",
      description:
        "How timeline and Gantt tools support milestone visibility for executives and clients.",
    },
  }),
  useCase({
    id: "uc-team-collaboration-work",
    slug: "team-collaboration-work",
    name: "Team collaboration on work",
    shortDescription:
      "Keep comments, files, and decisions on the work item instead of private chat.",
    description:
      "Team collaboration use cases cover docs, comments, proofing, and guest access attached to delivery work.",
    categorySlugs: ["project-management"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/team-collaboration-work/",
      title: "Team collaboration on work | SoftwareGlimpse",
      description:
        "How collaboration features keep delivery context on work items instead of private chat.",
    },
  }),
  useCase({
    id: "uc-resource-planning",
    slug: "resource-planning",
    name: "Resource & capacity planning",
    shortDescription:
      "See who is overloaded before deadlines slip — not after.",
    description:
      "Resource planning use cases cover capacity and portfolio load views across people and projects.",
    categorySlugs: ["project-management"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/resource-planning/",
      title: "Resource & capacity planning software | SoftwareGlimpse",
      description:
        "How workload and resource views help managers rebalance capacity before deadlines slip.",
    },
  }),
  useCase({
    id: "uc-document-productivity",
    slug: "document-productivity",
    name: "Document / PDF productivity",
    shortDescription:
      "Edit, convert, sign, or redact PDFs without turning document friction into delay.",
    description:
      "Document productivity use cases cover PDF edit, convert, sign, and redact workflows beside a project stack.",
    categorySlugs: ["project-management"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/document-productivity/",
      title: "Document / PDF productivity software | SoftwareGlimpse",
      description:
        "How PDF and document tools support edit, sign, and redact workflows in productivity stacks.",
    },
  }),
  useCase({
    id: "uc-remote-support-access",
    slug: "remote-support-access",
    name: "Remote support & access",
    shortDescription:
      "Reach machines and sessions securely for support and remote work.",
    description:
      "Remote support use cases cover browser remote desktop, unattended access, and session sharing.",
    categorySlugs: ["project-management"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/remote-support-access/",
      title: "Remote support & access software | SoftwareGlimpse",
      description:
        "How remote desktop and access tools support secure support sessions and unattended access.",
    },
  }),
  useCase({
    id: "uc-desktop-productivity",
    slug: "desktop-productivity",
    name: "Desktop productivity workspace",
    shortDescription:
      "Organise web apps into desktop workspaces without confusing that for project tracking.",
    description:
      "Desktop productivity use cases cover app wrappers and multi-app workspace shells for focus contexts.",
    categorySlugs: ["project-management"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/desktop-productivity/",
      title: "Desktop productivity workspace software | SoftwareGlimpse",
      description:
        "How desktop workspace organizers group web apps into focus contexts beside a work OS.",
    },
  }),
  useCase({
    id: "uc-recruiting-ats",
    slug: "recruiting-ats",
    name: "Recruiting / ATS",
    shortDescription:
      "Run hiring pipelines, career sites, and interview workflows in an applicant tracking system.",
    description:
      "Recruiting / ATS use cases cover candidate pipelines, job posting, and collaborative hiring for HR and talent teams.",
    categorySlugs: ["hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/recruiting-ats/",
      title: "Recruiting / ATS software | SoftwareGlimpse",
      description:
        "How ATS platforms support hiring pipelines, career sites, and interview workflows.",
    },
  }),
  useCase({
    id: "uc-core-hris",
    slug: "core-hris",
    name: "Core HRIS",
    shortDescription:
      "Keep employee records, org charts, PTO, and onboarding as the people system of record.",
    description:
      "Core HRIS use cases cover employee data, org structure, time off, and people admin — often with payroll as an add-on rather than the primary job.",
    categorySlugs: ["hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/core-hris/",
      title: "Core HRIS software | SoftwareGlimpse",
      description:
        "How HRIS platforms hold employee records, org charts, PTO, and onboarding as the system of record.",
    },
  }),
  useCase({
    id: "uc-payroll-benefits",
    slug: "payroll-benefits",
    name: "Payroll & benefits",
    shortDescription:
      "Run payroll, tax filings, and benefits administration for employees.",
    description:
      "Payroll & benefits use cases cover pay runs, compliance filings, deductions, and benefits admin — distinct from a dedicated ATS or frontline scheduler.",
    categorySlugs: ["hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/payroll-benefits/",
      title: "Payroll and benefits software | SoftwareGlimpse",
      description:
        "How payroll platforms run pay, tax filings, and benefits administration for HR buyers.",
    },
  }),
  useCase({
    id: "uc-people-platform",
    slug: "people-platform",
    name: "People platform",
    shortDescription:
      "Unify HR, payroll, and IT/spend workflows on one employee system of record.",
    description:
      "People-platform use cases cover modular HR + payroll + device/identity stacks where hire, pay, and access provisioning share one employee record.",
    categorySlugs: ["hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/people-platform/",
      title: "People platform software | SoftwareGlimpse",
      description:
        "How unified people platforms combine HR, payroll, and IT workflows on one employee record.",
    },
  }),
  useCase({
    id: "uc-enterprise-hcm",
    slug: "enterprise-hcm",
    name: "Enterprise HCM",
    shortDescription:
      "Run a full human capital suite — HR, payroll, talent, and often WFM — for 1,000+ employee organisations.",
    description:
      "Enterprise HCM use cases cover Workday-class people systems: global HR, payroll, talent, and workforce operations for large organisations. Implementation and custom quotes dominate TCO — these are not SMB HRIS or published-PEPM payroll peers.",
    categorySlugs: ["hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/enterprise-hcm/",
      title: "Enterprise HCM software | SoftwareGlimpse",
      description:
        "How enterprise HCM suites cover HR, payroll, talent, and workforce operations for large organisations.",
    },
  }),
  useCase({
    id: "uc-workforce-scheduling",
    slug: "workforce-scheduling",
    name: "Workforce scheduling",
    shortDescription:
      "Plan shifts, open shifts, and schedule publishing for frontline and deskless teams.",
    description:
      "Workforce scheduling use cases cover shift planning and schedule publishing for frontline operations.",
    categorySlugs: ["hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/workforce-scheduling/",
      title: "Workforce scheduling software | SoftwareGlimpse",
      description:
        "How workforce apps schedule shifts and publish calendars for deskless teams.",
    },
  }),
  useCase({
    id: "uc-time-attendance",
    slug: "time-attendance",
    name: "Time & attendance",
    shortDescription:
      "Clock in/out, timesheets, and attendance policies for hourly and field staff.",
    description:
      "Time & attendance use cases cover GPS/geofence clock-in, timesheets, and attendance policies — distinct from project task time tracking.",
    categorySlugs: ["hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/time-attendance/",
      title: "Time & attendance software | SoftwareGlimpse",
      description:
        "How time & attendance platforms handle clock-in, timesheets, and attendance policies.",
    },
  }),
  useCase({
    id: "uc-employee-training",
    slug: "employee-training",
    name: "Employee training",
    shortDescription:
      "Role-based training paths, onboarding content, and completion tracking for employees.",
    description:
      "Employee training use cases cover structured learning paths and completion tracking for internal workforce development.",
    categorySlugs: ["hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/employee-training/",
      title: "Employee training software | SoftwareGlimpse",
      description:
        "How employee training platforms deliver role-based paths and completion tracking.",
    },
  }),
  useCase({
    id: "uc-sop-documentation",
    slug: "sop-documentation",
    name: "SOP documentation",
    shortDescription:
      "Document playbooks and standard operating procedures as a searchable knowledge base.",
    description:
      "SOP documentation use cases cover process playbooks, knowledge bases, and accountability for how work gets done.",
    categorySlugs: ["hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/sop-documentation/",
      title: "SOP documentation software | SoftwareGlimpse",
      description:
        "How SOP platforms capture playbooks and process knowledge for growing teams.",
    },
  }),
  useCase({
    id: "uc-frontline-ops",
    slug: "frontline-ops",
    name: "Frontline operations",
    shortDescription:
      "Coordinate deskless workers with mobile scheduling, communications, and tasks.",
    description:
      "Frontline operations use cases cover mobile-first workforce coordination for deskless teams.",
    categorySlugs: ["hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/frontline-ops/",
      title: "Frontline operations software | SoftwareGlimpse",
      description:
        "How frontline workforce apps coordinate scheduling, communications, and tasks.",
    },
  }),
  useCase({
    id: "uc-online-storefront",
    slug: "online-storefront",
    name: "Online storefront",
    shortDescription:
      "Launch a branded online store with catalog, checkout, and payments.",
    description:
      "Online storefront use cases cover themes, product pages, domains, and buyer checkout for DTC and SMB merchants.",
    categorySlugs: ["ecommerce"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/online-storefront/",
      title: "Online storefront software | SoftwareGlimpse",
      description:
        "How ecommerce platforms help merchants launch branded online stores with catalog and checkout.",
    },
  }),
  useCase({
    id: "uc-omnichannel-retail",
    slug: "omnichannel-retail",
    name: "Omnichannel retail",
    shortDescription:
      "Sell online and in person with unified catalog, payments, and inventory.",
    description:
      "Omnichannel retail use cases cover POS + online store bundles for brick-and-click retailers.",
    categorySlugs: ["ecommerce"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/omnichannel-retail/",
      title: "Omnichannel retail software | SoftwareGlimpse",
      description:
        "How omnichannel commerce tools unify in-person POS with online storefronts.",
    },
  }),
  useCase({
    id: "uc-catalog-management",
    slug: "catalog-management",
    name: "Catalog management",
    shortDescription:
      "Manage products, variants, collections, and merchandising at scale.",
    description:
      "Catalog management use cases cover SKU complexity, variants, and merchandising workflows.",
    categorySlugs: ["ecommerce"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/catalog-management/",
      title: "Ecommerce catalog management | SoftwareGlimpse",
      description:
        "How ecommerce platforms manage product catalogs, variants, and collections.",
    },
  }),
  useCase({
    id: "uc-checkout-conversion",
    slug: "checkout-conversion",
    name: "Checkout & conversion",
    shortDescription:
      "Optimize cart, checkout, and payments to convert more orders.",
    description:
      "Checkout & conversion use cases cover payment methods, express checkout, and abandonment recovery.",
    categorySlugs: ["ecommerce"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/checkout-conversion/",
      title: "Ecommerce checkout software | SoftwareGlimpse",
      description:
        "How checkout and payment tooling improves conversion on ecommerce stores.",
    },
  }),
  useCase({
    id: "uc-order-fulfillment",
    slug: "order-fulfillment",
    name: "Order fulfillment",
    shortDescription:
      "Pick, pack, ship, and track orders across channels.",
    description:
      "Order fulfillment use cases cover shipping labels, 3PL handoffs, and post-purchase tracking.",
    categorySlugs: ["ecommerce", "fulfillment-shipping"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/order-fulfillment/",
      title: "Ecommerce order fulfillment | SoftwareGlimpse",
      description:
        "How ecommerce operations tools manage fulfillment, shipping, and returns.",
    },
  }),
  useCase({
    id: "uc-dropshipping-sourcing",
    slug: "dropshipping-sourcing",
    name: "Dropshipping sourcing",
    shortDescription:
      "Import supplier catalogs and automate order routing without holding inventory.",
    description:
      "Dropshipping sourcing use cases cover product import apps and supplier marketplaces — not full storefront platforms.",
    categorySlugs: ["ecommerce", "dropshipping-pod"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/dropshipping-sourcing/",
      title: "Dropshipping sourcing software | SoftwareGlimpse",
      description:
        "How dropshipping apps connect storefronts to supplier catalogs and automate fulfillment routing.",
    },
  }),
  useCase({
    id: "uc-wholesale-b2b",
    slug: "wholesale-b2b",
    name: "Wholesale / B2B",
    shortDescription:
      "Run company accounts, price lists, and wholesale checkout flows.",
    description:
      "Wholesale / B2B use cases cover negotiated pricing, buyer portals, and bulk ordering on ecommerce platforms.",
    categorySlugs: ["ecommerce"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/wholesale-b2b/",
      title: "B2B wholesale ecommerce | SoftwareGlimpse",
      description:
        "How ecommerce platforms support wholesale buyers, price lists, and B2B checkout.",
    },
  }),
  useCase({
    id: "uc-website-builder-commerce",
    slug: "website-builder-commerce",
    name: "Website-builder commerce",
    shortDescription:
      "Launch a brand website and sell products from the same website builder.",
    description:
      "Website-builder commerce use cases cover Wix/Squarespace-class site + store purchases — design-led SMB stores, not Shopify-class commerce OS or Magento-class B2B cores.",
    categorySlugs: ["ecommerce"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/website-builder-commerce/",
      title: "Website builder ecommerce | SoftwareGlimpse",
      description:
        "How website builders with integrated stores help SMBs sell without a separate commerce OS.",
    },
  }),
  useCase({
    id: "uc-helpdesk-ticketing",
    slug: "helpdesk-ticketing",
    name: "Helpdesk / ticketing",
    shortDescription:
      "Queue, assign, and resolve customer tickets with SLAs and macros.",
    description:
      "Helpdesk / ticketing use cases cover email-to-ticket workflows, assignment, SLAs, and resolution tracking for support teams.",
    categorySlugs: ["customer-service", "helpdesk-ticketing"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/helpdesk-ticketing/",
      title: "Helpdesk / ticketing software | SoftwareGlimpse",
      description:
        "How helpdesk platforms queue, assign, and resolve customer tickets with SLAs and macros.",
    },
  }),
  useCase({
    id: "uc-live-chat-support",
    slug: "live-chat-support",
    name: "Live chat support",
    shortDescription:
      "Talk to website visitors in real time and route chats to the right agent.",
    description:
      "Live chat support use cases cover website messengers, routing, canned replies, and visitor context for support and pre-sales teams.",
    categorySlugs: ["customer-service", "live-chat"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/live-chat-support/",
      title: "Live chat support software | SoftwareGlimpse",
      description:
        "How live chat platforms route website visitors to agents with visitor context.",
    },
  }),
  useCase({
    id: "uc-ecommerce-support",
    slug: "ecommerce-support",
    name: "Ecommerce support",
    shortDescription:
      "Handle order, refund, and shipping questions with storefront context in the inbox.",
    description:
      "Ecommerce support use cases cover Shopify/Magento-aware helpdesks that surface orders, refunds, and subscriptions beside the conversation.",
    categorySlugs: ["customer-service", "ecommerce"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ecommerce-support/",
      title: "Ecommerce support software | SoftwareGlimpse",
      description:
        "How ecommerce helpdesks put order, refund, and shipping context in the agent inbox.",
    },
  }),
  useCase({
    id: "uc-knowledge-base-self-service",
    slug: "knowledge-base-self-service",
    name: "Knowledge base / self-service",
    shortDescription:
      "Publish help articles and portals so customers can solve issues without a ticket.",
    description:
      "Knowledge base / self-service use cases cover help centers, article search, and customer portals that deflect repetitive tickets.",
    categorySlugs: ["customer-service"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/knowledge-base-self-service/",
      title: "Knowledge base / self-service software | SoftwareGlimpse",
      description:
        "How help centers and customer portals deflect tickets with searchable articles.",
    },
  }),
  useCase({
    id: "uc-omnichannel-support",
    slug: "omnichannel-support",
    name: "Omnichannel support",
    shortDescription:
      "Handle email, chat, social, and messaging in one agent workspace.",
    description:
      "Omnichannel support use cases cover unified agent inboxes across email, live chat, social, and messaging apps.",
    categorySlugs: ["customer-service"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/omnichannel-support/",
      title: "Omnichannel support software | SoftwareGlimpse",
      description:
        "How omnichannel helpdesks unify email, chat, social, and messaging for agents.",
    },
  }),
  useCase({
    id: "uc-itsm-service-desk",
    slug: "itsm-service-desk",
    name: "ITSM / service desk",
    shortDescription:
      "Run IT incidents, changes, and assets as an internal or customer service desk.",
    description:
      "ITSM / service desk use cases cover ITIL-style incidents, problems, changes, and CMDB workflows — distinct from SMB live chat or ecommerce helpdesks.",
    categorySlugs: ["customer-service", "it-development"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/itsm-service-desk/",
      title: "ITSM / service desk software | SoftwareGlimpse",
      description:
        "How ITSM platforms run incidents, changes, and assets as a service desk.",
    },
  }),
  useCase({
    id: "uc-ai-customer-service",
    slug: "ai-customer-service",
    name: "AI customer service",
    shortDescription:
      "Deflect or resolve support conversations with an AI agent, plus copilot for humans.",
    description:
      "AI customer service use cases cover resolution bots, outcome-priced AI agents, and agent copilots — scored as assistance, not a substitute for a helpdesk core.",
    categorySlugs: ["customer-service", "live-chat"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-customer-service/",
      title: "AI customer service software | SoftwareGlimpse",
      description:
        "How AI agents and copilots deflect tickets and assist human support teams.",
    },
  }),
  useCase({
    id: "uc-expense-management",
    slug: "expense-management",
    name: "Expense management",
    shortDescription:
      "Capture, approve, and reimburse employee expenses with policy controls.",
    description:
      "Expense management software handles receipt capture, approval workflows, corporate card feeds, and reimbursement — distinct from payroll system-of-record or general ledger bookkeeping.",
    categorySlugs: ["accounting-finance"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/expense-management/",
      title: "Expense management software | SoftwareGlimpse",
      description:
        "How expense tools capture receipts, enforce policy, and route reimbursements.",
    },
  }),
  useCase({
    id: "uc-travel-expense",
    slug: "travel-expense",
    name: "Travel & expense (T&E)",
    shortDescription:
      "Corporate travel booking, policy, and expense reporting in one stack.",
    description:
      "Travel and expense platforms combine booking, itinerary management, policy enforcement, and reimbursement — often adjacent to HR people platforms but a distinct finance-ops purchase.",
    categorySlugs: ["accounting-finance", "hr"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/travel-expense/",
      title: "Travel & expense software | SoftwareGlimpse",
      description:
        "How T&E platforms manage corporate travel booking and expense policy.",
    },
  }),
  useCase({
    id: "uc-bookkeeping-automation",
    slug: "bookkeeping-automation",
    name: "Bookkeeping automation",
    shortDescription:
      "Receipt capture, categorisation, and accountant handoff for small businesses.",
    description:
      "Bookkeeping automation tools digitise receipts, suggest categories, and sync with accounting ledgers — built for owners, bookkeepers, and accounting firms rather than enterprise ERP buyers.",
    categorySlugs: ["accounting-finance"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/bookkeeping-automation/",
      title: "Bookkeeping automation software | SoftwareGlimpse",
      description:
        "How bookkeeping tools automate receipt capture and categorisation.",
    },
  }),
  useCase({
    id: "uc-inventory-erp",
    slug: "inventory-erp",
    name: "Inventory & manufacturing ERP",
    shortDescription:
      "Stock, BOM, production planning, and shop-floor workflows for makers.",
    description:
      "Inventory and manufacturing ERP/MRP software tracks materials, bills of materials, work orders, and production — distinct from Kanban work OS tools or expense-only purchases.",
    categorySlugs: ["accounting-finance", "project-management"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/inventory-erp/",
      title: "Inventory & manufacturing ERP software | SoftwareGlimpse",
      description:
        "How MRP/ERP tools plan production, inventory, and shop-floor work.",
    },
  }),
  useCase({
    id: "uc-llm-assistant",
    slug: "llm-assistant",
    name: "LLM assistant",
    shortDescription:
      "General-purpose chat assistants for research, drafting, coding help, and reasoning.",
    description:
      "LLM assistant use cases cover conversational AI for everyday knowledge work — distinct from writing-only tools, voice platforms, or agent builders.",
    categorySlugs: ["ai"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/llm-assistant/",
      title: "LLM assistant software | SoftwareGlimpse",
      description:
        "How general-purpose LLM assistants support research, drafting, and coding help.",
    },
  }),
  useCase({
    id: "uc-ai-writing",
    slug: "ai-writing",
    name: "AI writing",
    shortDescription:
      "Paraphrase, grammar, summarisation, and rewrite tools for writers and teams.",
    categorySlugs: ["ai", "ai-writing"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-writing/",
      title: "AI writing software | SoftwareGlimpse",
      description:
        "How AI writing assistants help paraphrase, polish, and summarise text.",
    },
  }),
  useCase({
    id: "uc-paraphrasing",
    slug: "paraphrasing",
    name: "Paraphrasing & rewriting",
    shortDescription:
      "Rephrase sentences and passages with tone controls — grammar-first writing workflows.",
    categorySlugs: ["ai-writing", "ai"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/paraphrasing/",
      title: "Paraphrasing software | SoftwareGlimpse",
      description:
        "How paraphrasing tools help rewrite and polish text with AI.",
    },
  }),
  useCase({
    id: "uc-ai-copywriting",
    slug: "ai-copywriting",
    name: "AI copywriting",
    shortDescription:
      "Generate marketing copy, blogs, and landing pages from prompts — including GEO/AEO content.",
    categorySlugs: ["ai-writing", "ai", "marketing"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-copywriting/",
      title: "AI copywriting software | SoftwareGlimpse",
      description:
        "How AI copywriting platforms draft marketing content and optimize for AI search.",
    },
  }),
  useCase({
    id: "uc-ai-voice",
    slug: "ai-voice",
    name: "AI voice / TTS",
    shortDescription:
      "Text-to-speech, voice cloning, dubbing, and audio generation for creators and teams.",
    categorySlugs: ["ai"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-voice/",
      title: "AI voice / TTS software | SoftwareGlimpse",
      description:
        "How AI voice platforms generate speech, clones, and dubbed audio.",
    },
  }),
  useCase({
    id: "uc-ai-presentations",
    slug: "ai-presentations",
    name: "AI presentations",
    shortDescription:
      "Generate slides, docs, and one-pagers from prompts for GTM and internal teams.",
    categorySlugs: ["ai"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-presentations/",
      title: "AI presentation software | SoftwareGlimpse",
      description:
        "How AI presentation tools turn prompts into slides and documents.",
    },
  }),
  useCase({
    id: "uc-ai-website-builder",
    slug: "ai-website-builder",
    name: "AI website builder",
    shortDescription:
      "Prompt-to-website builders for marketing sites and landing pages.",
    categorySlugs: ["ai", "ai-website-builder"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-website-builder/",
      title: "AI website builder software | SoftwareGlimpse",
      description:
        "How AI website builders generate marketing sites from prompts.",
    },
  }),
  useCase({
    id: "uc-ai-app-development",
    slug: "ai-app-development",
    name: "AI app development",
    shortDescription:
      "Generate and iterate lightweight apps from prompts — distinct from site builders and agent UX shells.",
    categorySlugs: ["ai-website-builder", "ai", "it-development"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-app-development/",
      title: "AI app development software | SoftwareGlimpse",
      description:
        "How AI app development platforms generate lightweight apps from prompts.",
    },
  }),
  useCase({
    id: "uc-ai-ad-creative",
    slug: "ai-ad-creative",
    name: "AI ad creative",
    shortDescription:
      "Generate ad images, copy, and variants for paid media teams.",
    categorySlugs: ["ai", "marketing"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-ad-creative/",
      title: "AI ad creative software | SoftwareGlimpse",
      description:
        "How AI ad creative tools generate images and copy for paid campaigns.",
    },
  }),
  useCase({
    id: "uc-ai-agents",
    slug: "ai-agents",
    name: "AI agents / builders",
    shortDescription:
      "No-code or low-code builders for custom AI agents and internal apps.",
    categorySlugs: ["ai", "ai-website-builder"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-agents/",
      title: "AI agent builder software | SoftwareGlimpse",
      description:
        "How no-code AI agent builders let teams ship custom assistants and apps.",
    },
  }),
  useCase({
    id: "uc-ai-image",
    slug: "ai-image",
    name: "AI image generation",
    shortDescription:
      "Text-to-image and commercial generative image models for creative and marketing teams.",
    categorySlugs: ["ai"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-image/",
      title: "AI image generation software | SoftwareGlimpse",
      description:
        "How AI image generators produce stills for creative, brand, and marketing work.",
    },
  }),
  useCase({
    id: "uc-ai-video",
    slug: "ai-video",
    name: "AI video generation",
    shortDescription:
      "Text-to-video and generative video studios for clips, ads, and production drafts.",
    categorySlugs: ["ai"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-video/",
      title: "AI video generation software | SoftwareGlimpse",
      description:
        "How generative video studios turn prompts into clips and production drafts.",
    },
  }),
  useCase({
    id: "uc-ai-code",
    slug: "ai-code",
    name: "AI coding assistants",
    shortDescription:
      "Inline completions, coding agents, and AI-native editors for software teams.",
    categorySlugs: ["ai", "it-development"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-code/",
      title: "AI coding assistant software | SoftwareGlimpse",
      description:
        "How AI coding assistants and AI-native IDEs help developers write and review code.",
    },
  }),
  useCase({
    id: "uc-ai-meeting",
    slug: "ai-meeting",
    name: "AI meeting notes",
    shortDescription:
      "AI transcription, summaries, and action items for meetings and calls.",
    categorySlugs: ["ai"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-meeting/",
      title: "AI meeting notes software | SoftwareGlimpse",
      description:
        "How AI meeting tools capture transcripts, summaries, and action items.",
    },
  }),
  useCase({
    id: "uc-observability-monitoring",
    slug: "observability-monitoring",
    name: "Observability & monitoring",
    shortDescription:
      "Infrastructure metrics, APM, logs, and alerting for SRE and platform teams.",
    categorySlugs: ["it-development"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/observability-monitoring/",
      title: "Observability & monitoring software | SoftwareGlimpse",
      description:
        "How observability platforms monitor infrastructure, apps, and logs.",
    },
  }),
  useCase({
    id: "uc-source-control-devops",
    slug: "source-control-devops",
    name: "Source control & DevOps",
    shortDescription:
      "Git repositories, code review, CI/CD, and developer collaboration.",
    categorySlugs: ["it-development"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/source-control-devops/",
      title: "Source control & DevOps software | SoftwareGlimpse",
      description:
        "How source-control platforms host repos, reviews, and CI/CD automation.",
    },
  }),
  useCase({
    id: "uc-hosting-operations",
    slug: "hosting-operations",
    name: "Hosting operations",
    shortDescription:
      "Server and domain administration for web hosts and agencies.",
    categorySlugs: ["it-development"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/hosting-operations/",
      title: "Hosting operations software | SoftwareGlimpse",
      description:
        "How hosting control panels manage servers, domains, and sites.",
    },
  }),
  useCase({
    id: "uc-web-data-collection",
    slug: "web-data-collection",
    name: "Web data collection",
    shortDescription:
      "Proxy networks and web data APIs for engineering and data teams.",
    categorySlugs: ["it-development"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/web-data-collection/",
      title: "Web data collection software | SoftwareGlimpse",
      description:
        "How proxy and web-data platforms collect public web data at scale.",
    },
  }),
  useCase({
    id: "uc-incident-oncall",
    slug: "incident-oncall",
    name: "Incident response / on-call",
    shortDescription:
      "On-call schedules, paging, and incident-response operations for SRE and IT teams.",
    categorySlugs: ["it-development"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/incident-oncall/",
      title: "Incident response / on-call software | SoftwareGlimpse",
      description:
        "How on-call platforms page responders and run incident-response workflows.",
    },
  }),
  useCase({
    id: "uc-hosting-providers",
    slug: "hosting-providers",
    name: "Managed hosting providers",
    shortDescription:
      "Managed cloud and WordPress hosting platforms — not control-panel licences like Plesk or cPanel.",
    categorySlugs: ["it-development"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/hosting-providers/",
      title: "Managed hosting providers | SoftwareGlimpse",
      description:
        "How managed hosting platforms run WordPress and cloud apps without panel-licence math.",
    },
  }),
  useCase({
    id: "uc-cloud-paas",
    slug: "cloud-paas",
    name: "Cloud PaaS / app platforms",
    shortDescription:
      "Git-push and microVM app platforms for running containers and services — not WordPress managed hosts or control-panel licences.",
    categorySlugs: ["it-development"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/cloud-paas/",
      title: "Cloud PaaS / app platforms | SoftwareGlimpse",
      description:
        "How Render-class and Fly.io-class platforms deploy apps without panel-licence or managed-WordPress math.",
    },
  }),
  useCase({
    id: "uc-ai-automation",
    slug: "ai-automation",
    name: "AI workflow automation",
    shortDescription:
      "No-code / low-code automation platforms that orchestrate apps and AI steps — not LLM chat assistants.",
    categorySlugs: ["ai"],
    seo: {
      indexable: true,
      canonicalPath: "/use-cases/ai-automation/",
      title: "AI workflow automation software | SoftwareGlimpse",
      description:
        "How Zapier-class and n8n-class platforms automate workflows with AI steps.",
    },
  }),
  ...taxonomyUseCases(),
];

/** Job tags used by products / category definitions that are not yet hub-ready. */
function taxonomyUseCases(): UseCaseInput[] {
  const items: Array<[string, string, string, string[]]> = [
    [
      "deal-management",
      "Deal management",
      "Advance and close opportunities with clear ownership, next steps, and stage hygiene.",
      ["crm"],
    ],
    [
      "data-enrichment",
      "Data enrichment",
      "Append and refresh contact and company records from sales-intelligence sources.",
      ["sales-intelligence"],
    ],
    [
      "social-media-management",
      "Social media management",
      "Plan, publish, and manage social posts across networks from one calendar.",
      ["marketing", "social-media-marketing"],
    ],
    [
      "social-media-marketing",
      "Social media marketing",
      "Run social campaigns, scheduling, and engagement as a marketing motion.",
      ["marketing", "social-media-marketing"],
    ],
    [
      "social-listening",
      "Social listening",
      "Monitor brand, competitor, and keyword mentions across social and the web.",
      ["marketing", "social-media-marketing"],
    ],
    [
      "content-marketing",
      "Content marketing",
      "Plan and distribute content for acquisition, education, and brand demand.",
      ["marketing"],
    ],
    [
      "brand-monitoring",
      "Brand monitoring",
      "Track brand mentions, reputation signals, and share of voice.",
      ["marketing", "social-media-marketing"],
    ],
    [
      "influencer-marketing",
      "Influencer marketing",
      "Discover creators, run outreach, and measure influencer campaign ROI.",
      ["marketing", "social-media-marketing"],
    ],
    [
      "funnel-building",
      "Funnel building",
      "Design multi-step acquisition funnels from landing page to conversion.",
      ["marketing", "website-digital-presence"],
    ],
    [
      "landing-pages",
      "Landing pages",
      "Build campaign landing pages and lead-capture destinations.",
      ["marketing", "website-digital-presence"],
    ],
    [
      "lead-generation",
      "Lead generation",
      "Capture and qualify inbound leads from campaigns, forms, and content.",
      ["marketing", "sales-intelligence"],
    ],
    [
      "multichannel-campaigns",
      "Multichannel campaigns",
      "Coordinate campaigns across email, social, ads, and landing destinations.",
      ["marketing"],
    ],
    [
      "creator-marketing",
      "Creator marketing",
      "Sell courses, memberships, and creator-led offers with campaign tooling.",
      ["marketing", "lms-course-creation"],
    ],
    [
      "analytics",
      "Analytics",
      "Measure campaign, funnel, and channel performance to decide what to keep.",
      ["marketing", "analytics-bi"],
    ],
    [
      "marketing-attribution",
      "Marketing attribution",
      "Attribute leads, calls, and forms to campaigns and prove channel ROI.",
      ["analytics-bi", "marketing"],
    ],
    [
      "kpi-dashboards",
      "KPI dashboards",
      "Build executive and team dashboards with goals across marketing data sources.",
      ["analytics-bi"],
    ],
    [
      "marketing-metrics",
      "Marketing metrics unification",
      "Connect ads, CRM, and analytics tools into one reporting view.",
      ["analytics-bi", "marketing"],
    ],
    [
      "construction-management",
      "Construction management",
      "Job costing, schedules, and contractor workflows for field crews.",
      ["field-service-operations", "project-management"],
    ],
    [
      "trades-field-service",
      "Trades field service",
      "Dispatch, quotes, invoicing, and mobile jobs for trades businesses.",
      ["field-service-operations"],
    ],
    [
      "appointment-scheduling",
      "Appointment scheduling",
      "Client booking, reminders, and local business management.",
      ["field-service-operations", "customer-service"],
    ],
    [
      "creator-newsletters",
      "Creator newsletters",
      "Grow and monetize an owned newsletter audience as a creator or publisher.",
      ["email-marketing"],
    ],
    [
      "webinar-marketing",
      "Webinar marketing",
      "Use webinars and live events as a demand-generation channel.",
      ["email-marketing", "marketing", "webinar-virtual-events"],
    ],
    [
      "webinars-events",
      "Webinars & events",
      "Host webinars, meetings, and live events as a communications workflow.",
      ["business-communications", "webinar-virtual-events"],
    ],
    [
      "virtual-events",
      "Virtual events",
      "Run multi-session virtual events with stages, networking, and attendee journeys.",
      ["webinar-virtual-events"],
    ],
    [
      "live-streaming",
      "Live streaming",
      "Produce and multistream live video with multi-camera production workflows.",
      ["webinar-virtual-events", "marketing"],
    ],
    [
      "online-courses",
      "Online courses",
      "Build and deliver structured online courses and academies.",
      ["lms-course-creation", "marketing"],
    ],
    [
      "course-commerce",
      "Course commerce",
      "Sell courses, memberships, and training products with checkout.",
      ["lms-course-creation", "marketing"],
    ],
    [
      "cohort-learning",
      "Cohort learning",
      "Run scheduled cohort programs with drip content and milestones.",
      ["lms-course-creation"],
    ],
    [
      "learner-assessments",
      "Learner assessments",
      "Quizzes, tests, and knowledge checks for learners.",
      ["lms-course-creation", "hr"],
    ],
    [
      "digital-business-marketplace",
      "Digital business marketplace",
      "Buy and sell websites, online stores, and digital businesses.",
      ["website-digital-presence", "ecommerce"],
    ],
    [
      "reputation-reviews",
      "Reputation & reviews",
      "Collect, monitor, and respond to customer reviews and reputation signals.",
      ["reputation-reviews", "customer-service", "marketing"],
    ],
    [
      "review-generation",
      "Review generation",
      "Automate post-job review requests and grow Google ratings.",
      ["reputation-reviews"],
    ],
    [
      "local-reputation",
      "Local reputation management",
      "Manage Google and social reputation for local service businesses.",
      ["reputation-reviews"],
    ],
  ];

  return items.map(([slug, name, shortDescription, categorySlugs]) =>
    useCase({
      id: `uc-${slug}`,
      slug,
      name,
      shortDescription,
      description: shortDescription,
      categorySlugs,
      seo: {
        indexable: false,
        canonicalPath: `/use-cases/${slug}/`,
        title: `${name} software | SoftwareGlimpse`,
        description: shortDescription,
      },
    }),
  );
}

function capability(
  input: Omit<CapabilityInput, "metadata" | "seo"> &
    Partial<Pick<CapabilityInput, "metadata" | "seo">>,
): CapabilityInput {
  const description =
    input.description ??
    input.shortDescription ??
    `${input.name} CRM capability.`;
  return {
    ...input,
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T12:00:00.000Z",
      reviewedAt: "2026-08-14T12:00:00.000Z",
      ...input.metadata,
    },
    seo: {
      indexable: true,
      canonicalPath: `/capabilities/${input.slug}/`,
      title: `${input.name} CRM capability | SoftwareGlimpse`,
      description,
      ...input.seo,
    },
  };
}

/** CRM capability hubs — editorial gate passed (indexable). */
export const capabilitiesSeed: CapabilityInput[] = [
  capability({
    id: "cap-contact-management",
    slug: "contact-management",
    name: "Contact management",
    shortDescription:
      "Keep one reliable record of people, accounts, and interaction history.",
    description:
      "Contact management is the CRM capability of storing contacts and accounts with ownership, history, and sync so relationship context is a team asset — not trapped in inboxes.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-relationship-management",
    slug: "relationship-management",
    name: "Relationship management",
    shortDescription:
      "Map accounts, stakeholders, and relationship context beyond a contact list.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-lead-management",
    slug: "lead-management",
    name: "Lead management",
    shortDescription:
      "Capture, score, route, and work leads before they become pipeline deals.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-pipeline-management",
    slug: "pipeline-management",
    name: "Pipeline management",
    shortDescription:
      "Track opportunities through defined stages with owners and next steps.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-deal-management",
    slug: "deal-management",
    name: "Deal management",
    shortDescription:
      "Manage opportunity records, amounts, close dates, and deal hygiene.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-workflow-automation",
    slug: "workflow-automation",
    name: "Workflow automation",
    shortDescription:
      "Automate follow-ups, assignments, and stage moves that should not depend on memory.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-email",
    slug: "email",
    name: "Email capabilities",
    shortDescription:
      "Sync, log, track, and sequence email from the CRM without losing the thread.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-sales-engagement",
    slug: "sales-engagement",
    name: "Sales engagement",
    shortDescription:
      "Coordinate calling, sequences, and multi-channel outreach cadences.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-reporting",
    slug: "reporting",
    name: "Reporting",
    shortDescription:
      "Dashboards and activity reports that reflect trusted CRM records.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-forecasting",
    slug: "forecasting",
    name: "Forecasting",
    shortDescription:
      "Build pipeline-based forecasts teams can defend in weekly reviews.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-customization",
    slug: "customization",
    name: "Customization",
    shortDescription:
      "Fields, layouts, and objects that match how your team actually sells.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-integrations",
    slug: "integrations",
    name: "Integrations",
    shortDescription:
      "Connect CRM to email, calendar, marketing, support, and finance stacks.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-administration",
    slug: "administration",
    name: "Administration",
    shortDescription:
      "Roles, ownership rules, hygiene, and day-to-day CRM operations.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-security",
    slug: "security",
    name: "Security",
    shortDescription:
      "Access control, SSO, audit logs, and permission boundaries in CRM.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-mobile",
    slug: "mobile",
    name: "Mobile",
    shortDescription:
      "Field-ready CRM access for updates on the go — without breaking hygiene.",
    categorySlugs: ["crm"],
  }),
  capability({
    id: "cap-ai-assistance",
    slug: "ai-assistance",
    name: "AI assistance",
    shortDescription:
      "Assistive CRM features that draft, summarize, or suggest — verified before trust.",
    categorySlugs: ["crm"],
  }),
  // Email marketing capabilities (hub depth in capability-hub/email-marketing-deep.ts)
  capability({
    id: "cap-email-campaigns",
    slug: "email-campaigns",
    name: "Email campaigns",
    shortDescription:
      "Create, schedule, and measure permission-based marketing email campaigns.",
    description:
      "Email campaigns are the ESP capability for composing and sending marketing emails to subscriber segments with reporting — not personal sales email logging in a CRM.",
    categorySlugs: ["email-marketing"],
    seo: {
      title: "Email campaigns capability | SoftwareGlimpse",
      description:
        "What email campaign capability means in an ESP — composition, scheduling, segments, and reporting for permission-based sends.",
    },
  }),
  capability({
    id: "cap-newsletter-builder",
    slug: "newsletter-builder",
    name: "Newsletter builder",
    shortDescription:
      "Compose and schedule recurring newsletters with reusable structure.",
    categorySlugs: ["email-marketing"],
    seo: {
      title: "Newsletter builder capability | SoftwareGlimpse",
      description:
        "How newsletter builder capability supports recurring permission-based email production in an ESP.",
    },
  }),
  capability({
    id: "cap-email-templates",
    slug: "email-templates",
    name: "Email templates",
    shortDescription:
      "Reusable layouts and modules for on-brand marketing emails.",
    categorySlugs: ["email-marketing"],
    seo: {
      title: "Email templates capability | SoftwareGlimpse",
      description:
        "How email templates speed production and protect brand and compliance elements in ESP campaigns.",
    },
  }),
  capability({
    id: "cap-automation-workflows",
    slug: "automation-workflows",
    name: "Automation workflows",
    shortDescription:
      "Multi-step permission-based email journeys triggered by subscriber events.",
    categorySlugs: ["email-marketing"],
    seo: {
      title: "Automation workflows capability | SoftwareGlimpse",
      description:
        "How ESP automation workflows support triggers, branching, and journey analytics on opted-in contacts.",
    },
  }),
  capability({
    id: "cap-segmentation",
    slug: "segmentation",
    name: "Segmentation",
    shortDescription:
      "Build audiences from attributes, behavior, and lists for targeted email.",
    categorySlugs: ["email-marketing"],
    seo: {
      title: "Segmentation capability | SoftwareGlimpse",
      description:
        "How email marketing segmentation supports relevant campaigns and journey entry conditions.",
    },
  }),
  capability({
    id: "cap-landing-pages",
    slug: "landing-pages",
    name: "Landing pages",
    shortDescription:
      "List-growth and campaign landing pages with forms synced to ESP lists.",
    categorySlugs: ["email-marketing"],
    seo: {
      title: "Landing pages capability | SoftwareGlimpse",
      description:
        "How ESP landing pages support list growth and campaign destinations tied to subscriber lists.",
    },
  }),
  capability({
    id: "cap-analytics-em",
    slug: "analytics",
    name: "Analytics",
    shortDescription:
      "Campaign and journey reporting for delivery, engagement, and improvement decisions.",
    categorySlugs: ["email-marketing"],
    seo: {
      title: "Email analytics capability | SoftwareGlimpse",
      description:
        "How email marketing analytics support weekly review rituals, hygiene, and journey improvement.",
    },
  }),
  capability({
    id: "cap-deliverability-tools",
    slug: "deliverability-tools",
    name: "Deliverability tools",
    shortDescription:
      "Domain authentication guidance and sending-health aids for marketing email.",
    categorySlugs: ["email-marketing"],
    seo: {
      title: "Deliverability tools capability | SoftwareGlimpse",
      description:
        "How deliverability tooling supports SPF/DKIM/DMARC, hygiene, and inbox placement discipline for ESPs.",
    },
  }),
  capability({
    id: "cap-ai-content-generation",
    slug: "ai-content-generation",
    name: "AI content generation",
    shortDescription:
      "Assistive subject lines and copy with mandatory human review.",
    categorySlugs: ["email-marketing"],
    seo: {
      title: "AI content generation capability | SoftwareGlimpse",
      description:
        "How AI content assistance in email marketing speeds drafting when humans stay in the review loop.",
    },
  }),
  // Business communications capabilities
  // (hub depth in capability-hub/business-communications-deep.ts).
  // `ai-assistance` is intentionally omitted — CRM already owns that hub.
  capability({
    id: "cap-cloud-phone",
    slug: "cloud-phone",
    name: "Cloud phone",
    shortDescription:
      "Business numbers, inbound and outbound calling, and softphone apps delivered over the internet.",
    description:
      "Cloud phone capability covers number provisioning and porting, softphone and mobile apps, and call handling for business voice — the foundation a communications stack is built on.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "Cloud phone capability | SoftwareGlimpse",
      description:
        "What cloud phone capability means — number provisioning, porting, softphones, and business calling without on-premise hardware.",
    },
  }),
  capability({
    id: "cap-call-routing",
    slug: "call-routing",
    name: "Call routing & IVR",
    shortDescription:
      "Menus, queues, and business-hours rules that decide who answers each call.",
    description:
      "Call routing capability covers IVR menus, queues and overflow, skills-based assignment, and after-hours behaviour so inbound calls reach the right person instead of a voicemail box.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "Call routing & IVR capability | SoftwareGlimpse",
      description:
        "How call routing capability works — IVR menus, queues, business-hours rules, and overflow handling.",
    },
  }),
  capability({
    id: "cap-call-recording",
    slug: "call-recording",
    name: "Call recording",
    shortDescription:
      "Recording, storage, and playback controls for coaching and compliance.",
    description:
      "Call recording capability covers automatic or on-demand recording, retention and access controls, and the consent obligations that come with storing customer conversations.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "Call recording capability | SoftwareGlimpse",
      description:
        "What call recording capability involves — capture, retention, access controls, playback, and consent obligations.",
    },
  }),
  capability({
    id: "cap-power-dialer",
    slug: "power-dialer",
    name: "Power dialer",
    shortDescription:
      "Automated dialing that removes manual number entry from outbound calling days.",
    description:
      "Power dialer capability covers list-based automatic dialing, call dispositions, and pacing for outbound sales teams — commonly gated to higher plan tiers.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "Power dialer capability | SoftwareGlimpse",
      description:
        "How power dialer capability supports outbound calling — list dialing, dispositions, pacing, and CRM write-back.",
    },
  }),
  capability({
    id: "cap-sms-messaging",
    slug: "sms-messaging",
    name: "SMS messaging",
    shortDescription:
      "Send and receive business SMS from the same numbers your team calls from.",
    description:
      "SMS messaging capability covers two-way business texting tied to virtual numbers, delivery handling, and the regional registration rules that govern business SMS.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "SMS messaging capability | SoftwareGlimpse",
      description:
        "What business SMS capability includes — two-way texting on business numbers, delivery handling, and registration rules.",
    },
  }),
  capability({
    id: "cap-whatsapp-business",
    slug: "whatsapp-business",
    name: "WhatsApp Business",
    shortDescription:
      "Official WhatsApp Business API messaging with a shared inbox, templates, and broadcasts.",
    description:
      "WhatsApp Business capability covers Business Solution Provider access to the official API, template approval, broadcast rules, and the Meta conversation fees charged alongside a platform subscription.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "WhatsApp Business capability | SoftwareGlimpse",
      description:
        "How WhatsApp Business capability works — official API access, template approval, broadcasts, and Meta conversation fees.",
    },
  }),
  capability({
    id: "cap-shared-inbox",
    slug: "shared-inbox",
    name: "Shared inbox",
    shortDescription:
      "One queue several agents can work with assignment, tags, and internal notes.",
    description:
      "Shared inbox capability covers multi-agent conversation ownership, assignment and tagging, internal notes, and the audit trail that stops replies from disappearing into personal accounts.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "Shared inbox capability | SoftwareGlimpse",
      description:
        "What shared inbox capability provides — assignment, tags, internal notes, and conversation ownership for teams.",
    },
  }),
  capability({
    id: "cap-team-messaging",
    slug: "team-messaging",
    name: "Team messaging",
    shortDescription:
      "Internal channels and chat the business controls, instead of personal messaging groups.",
    description:
      "Team messaging capability covers internal channels, direct messages, file sharing, and the administrative controls that make internal chat auditable and offboardable.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "Team messaging capability | SoftwareGlimpse",
      description:
        "How team messaging capability supports internal coordination — channels, admin control, and offboarding.",
    },
  }),
  capability({
    id: "cap-video-meetings",
    slug: "video-meetings",
    name: "Video meetings",
    shortDescription:
      "Scheduled and ad-hoc video meetings with screen share, recording, and calendar join — often paired with cloud phone in UCaaS stacks.",
    description:
      "Video meetings capability covers host controls, screen sharing, meeting recording, calendar integration, and participant management. In business communications it often sits beside cloud phone (for example Zoom Phone + Workplace meetings, or Teams meetings with optional Teams Phone) rather than replacing a phone shortlist.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "Video meetings capability | SoftwareGlimpse",
      description:
        "What video meetings capability means for business communications — hosting, screen share, recording, and how it relates to cloud phone / UCaaS.",
    },
  }),
  capability({
    id: "cap-crm-cti",
    slug: "crm-cti",
    name: "CRM / CTI integration",
    shortDescription:
      "Click-to-dial, screen pops, and automatic call logging in the system your team already uses.",
    description:
      "CRM/CTI capability covers click-to-dial, inbound screen pops, and bidirectional call logging — the difference between a phone system that saves admin time and one that creates a second system to update.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "CRM / CTI integration capability | SoftwareGlimpse",
      description:
        "What CRM/CTI capability means — click-to-dial, screen pops, and automatic call logging into CRM or helpdesk records.",
    },
  }),
  capability({
    id: "cap-analytics-reporting",
    slug: "analytics-reporting",
    name: "Analytics & reporting",
    shortDescription:
      "Call and message volume, wait times, and agent activity in reports managers act on.",
    description:
      "Analytics and reporting capability for communications covers call and message volume, missed-call and wait-time reporting, and agent or queue performance views used in weekly reviews.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "Communications analytics & reporting capability | SoftwareGlimpse",
      description:
        "How communications analytics works — call volume, wait times, missed calls, and agent or queue performance reporting.",
    },
  }),
  capability({
    id: "cap-unified-inbox",
    slug: "unified-inbox",
    name: "Unified multichannel inbox",
    shortDescription:
      "Calls, SMS, and chat in one agent workspace instead of three separate tools.",
    description:
      "Unified inbox capability covers bringing voice, SMS, and messaging channels into a single agent workspace with shared history — valuable when customers switch channels mid-conversation.",
    categorySlugs: ["business-communications"],
    seo: {
      title: "Unified multichannel inbox capability | SoftwareGlimpse",
      description:
        "What a unified multichannel inbox provides — calls, SMS, and chat in one workspace with shared conversation history.",
    },
  }),
  // Project management capabilities
  // (hub depth in capability-hub/project-management-deep.ts).
  // `ai-assistance` is intentionally omitted — CRM already owns that hub.
  capability({
    id: "cap-task-boards",
    slug: "task-boards",
    name: "Task boards & work views",
    shortDescription:
      "Boards, tables, lists, and kanban-style views for tracking work items.",
    description:
      "Task boards capability covers the primary work views where items are owned, staged, and reviewed in a work OS.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Task boards & work views capability | SoftwareGlimpse",
      description:
        "What task boards capability means — boards, lists, and kanban-style views for owned work items.",
    },
  }),
  capability({
    id: "cap-timeline-gantt",
    slug: "timeline-gantt",
    name: "Timeline / Gantt",
    shortDescription:
      "Timeline, Gantt, or roadmap views for scheduling and dependencies.",
    description:
      "Timeline / Gantt capability covers sequence, dependencies, and milestones — live in a work OS or as presentation slides.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Timeline / Gantt capability | SoftwareGlimpse",
      description:
        "How timeline and Gantt capability supports scheduling, dependencies, and milestone visibility.",
    },
  }),
  capability({
    id: "cap-workload-resources",
    slug: "workload-resources",
    name: "Workload & resource management",
    shortDescription:
      "Capacity, resourcing, or portfolio load views across people and projects.",
    description:
      "Workload capability covers capacity views so managers can rebalance load before deadlines slip.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Workload & resource management capability | SoftwareGlimpse",
      description:
        "How workload and resource capability shows capacity across people and projects.",
    },
  }),
  capability({
    id: "cap-automations-workflows",
    slug: "automations-workflows",
    name: "Automations & workflows",
    shortDescription:
      "Rules, recipes, and multi-step workflows that move work without manual updates.",
    description:
      "Automations capability covers rules that change status, assignees, and notifications when conditions are met.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Automations & workflows capability | SoftwareGlimpse",
      description:
        "How project management automations support handoffs, notifications, and multi-step workflows.",
    },
  }),
  capability({
    id: "cap-time-tracking",
    slug: "time-tracking",
    name: "Time tracking",
    shortDescription:
      "Timers, timesheets, or billable time capture against tasks and projects.",
    description:
      "Time tracking capability attaches effort to work items for billing, capacity, or retrospectives.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Time tracking capability | SoftwareGlimpse",
      description:
        "How time tracking capability captures timers and timesheets against project work.",
    },
  }),
  capability({
    id: "cap-docs-collaboration",
    slug: "docs-collaboration",
    name: "Docs & collaboration",
    shortDescription:
      "Shared docs, comments, chat, or proofing tied to work items.",
    description:
      "Docs and collaboration capability keeps decisions and files on the work item so context survives handoffs.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Docs & collaboration capability | SoftwareGlimpse",
      description:
        "How docs and collaboration capability attaches comments, files, and proofing to work items.",
    },
  }),
  capability({
    id: "cap-integrations-ecosystem",
    slug: "integrations-ecosystem",
    name: "Integrations ecosystem",
    shortDescription:
      "Native and Zapier-style connections to chat, storage, CRM, and design tools.",
    description:
      "Integrations ecosystem capability covers native and connector depth for the tools teams open daily.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Integrations ecosystem capability | SoftwareGlimpse",
      description:
        "How project management integrations connect work tracking to chat, files, CRM, and design tools.",
    },
  }),
  capability({
    id: "cap-reporting-dashboards",
    slug: "reporting-dashboards",
    name: "Reporting & dashboards",
    shortDescription:
      "Dashboards, portfolio reports, and progress analytics for managers.",
    description:
      "Reporting capability turns live work data into dashboards managers can review weekly.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Reporting & dashboards capability | SoftwareGlimpse",
      description:
        "How project management reporting supports portfolio dashboards and weekly delivery reviews.",
    },
  }),
  capability({
    id: "cap-document-pdf",
    slug: "document-pdf",
    name: "Document / PDF productivity",
    shortDescription:
      "PDF edit, convert, sign, or redact capabilities for document workflows.",
    description:
      "Document/PDF capability covers edit, convert, sign, and redact jobs beside a work tracker.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Document / PDF productivity capability | SoftwareGlimpse",
      description:
        "What PDF productivity capability involves — edit, convert, sign, and redact workflows.",
    },
  }),
  capability({
    id: "cap-remote-access",
    slug: "remote-access",
    name: "Remote access / screen share",
    shortDescription:
      "Remote desktop, unattended access, or session sharing for support and remote work.",
    description:
      "Remote access capability covers browser remote desktop and unattended access for support and distributed work.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Remote access capability | SoftwareGlimpse",
      description:
        "How remote access capability supports secure remote desktop sessions and unattended access.",
    },
  }),
  capability({
    id: "cap-desktop-workspace",
    slug: "desktop-workspace",
    name: "Desktop workspace organizer",
    shortDescription:
      "Desktop app wrappers, workspaces, and multi-app productivity shells.",
    description:
      "Desktop workspace capability organises web apps into focus contexts beside — not instead of — a work OS.",
    categorySlugs: ["project-management"],
    seo: {
      title: "Desktop workspace organizer capability | SoftwareGlimpse",
      description:
        "How desktop workspace organizers group web apps into focus contexts for productivity.",
    },
  }),
  // HR capabilities (hub depth in capability-hub/hr-deep.ts).
  // `ai-assistance` is intentionally omitted — CRM already owns that hub.
  // `analytics-reporting` hub skipped — business-communications owns that slug.
  capability({
    id: "cap-applicant-tracking",
    slug: "applicant-tracking",
    name: "Applicant tracking",
    shortDescription:
      "Pipelines, candidate profiles, and hiring workflows for recruiting teams.",
    description:
      "Applicant tracking capability covers candidate pipelines, stages, and collaborative hiring workflows in an ATS.",
    categorySlugs: ["hr"],
    seo: {
      title: "Applicant tracking capability | SoftwareGlimpse",
      description:
        "What applicant tracking capability means — pipelines, candidates, and hiring workflows.",
    },
  }),
  capability({
    id: "cap-workforce-scheduling",
    slug: "workforce-scheduling",
    name: "Workforce scheduling",
    shortDescription:
      "Shift planning, open shifts, and schedule publishing for frontline teams.",
    description:
      "Workforce scheduling capability covers building and publishing shifts for deskless and multi-site teams.",
    categorySlugs: ["hr"],
    seo: {
      title: "Workforce scheduling capability | SoftwareGlimpse",
      description:
        "How workforce scheduling capability supports shift planning and publish workflows.",
    },
  }),
  capability({
    id: "cap-time-attendance",
    slug: "time-attendance",
    name: "Time & attendance",
    shortDescription:
      "Clock-in/out, timesheets, and attendance policies for hourly and frontline staff.",
    description:
      "Time & attendance capability covers clock-in, timesheets, and attendance policies — distinct from project task time tracking.",
    categorySlugs: ["hr"],
    seo: {
      title: "Time & attendance capability | SoftwareGlimpse",
      description:
        "What time & attendance capability means for clock-in, timesheets, and attendance policies.",
    },
  }),
  capability({
    id: "cap-gps-geofence-clockin",
    slug: "gps-geofence-clockin",
    name: "GPS / geofence clock-in",
    shortDescription:
      "Location-aware or geofenced clock-in for field and multi-site teams.",
    description:
      "GPS / geofence clock-in capability verifies where employees clock in for field and multi-site attendance.",
    categorySlugs: ["hr"],
    seo: {
      title: "GPS / geofence clock-in capability | SoftwareGlimpse",
      description:
        "How GPS and geofence clock-in capability supports location-aware attendance.",
    },
  }),
  capability({
    id: "cap-core-hris",
    slug: "core-hris",
    name: "Core HRIS",
    shortDescription:
      "Employee system of record for profiles, org chart, PTO, and people admin.",
    description:
      "Core HRIS capability is the employee system of record — profiles, org structure, time off, and onboarding records — not a dedicated ATS or time clock.",
    categorySlugs: ["hr"],
    seo: {
      title: "Core HRIS capability | SoftwareGlimpse",
      description:
        "What core HRIS capability means for employee records, org charts, and people admin.",
    },
  }),
  capability({
    id: "cap-payroll-processing",
    slug: "payroll-processing",
    name: "Payroll processing",
    shortDescription:
      "Run employee payroll, tax filings, and pay stubs.",
    description:
      "Payroll processing capability covers pay runs, tax filings, and pay stubs for HR and finance buyers.",
    categorySlugs: ["hr"],
    seo: {
      title: "Payroll processing capability | SoftwareGlimpse",
      description:
        "What payroll processing capability means for pay runs, filings, and pay stubs.",
    },
  }),
  capability({
    id: "cap-benefits-admin",
    slug: "benefits-admin",
    name: "Benefits administration",
    shortDescription:
      "Benefits eligibility, carrier admin, and open-enrollment workflows.",
    description:
      "Benefits administration capability covers eligibility, deductions, carriers, and enrollment — often bundled with payroll or sold as an HRIS add-on.",
    categorySlugs: ["hr"],
    seo: {
      title: "Benefits administration capability | SoftwareGlimpse",
      description:
        "What benefits administration capability means for eligibility, carriers, and enrollment.",
    },
  }),
  capability({
    id: "cap-sop-knowledge-base",
    slug: "sop-knowledge-base",
    name: "SOP / knowledge base",
    shortDescription:
      "Documented SOPs, playbooks, and searchable employee knowledge bases.",
    description:
      "SOP / knowledge base capability captures playbooks and process knowledge teams can find and follow.",
    categorySlugs: ["hr"],
    seo: {
      title: "SOP / knowledge base capability | SoftwareGlimpse",
      description:
        "What SOP knowledge-base capability means for playbooks and process documentation.",
    },
  }),
  capability({
    id: "cap-employee-training-paths",
    slug: "employee-training-paths",
    name: "Employee training paths",
    shortDescription:
      "Structured onboarding and role-based training paths with completion tracking.",
    description:
      "Employee training paths capability delivers role-based learning with completion evidence managers can review.",
    categorySlugs: ["hr"],
    seo: {
      title: "Employee training paths capability | SoftwareGlimpse",
      description:
        "How employee training paths support onboarding and role-based completion tracking.",
    },
  }),
  capability({
    id: "cap-frontline-comms",
    slug: "frontline-comms",
    name: "Frontline communications",
    shortDescription:
      "Mobile chat, announcements, and tasking for deskless / frontline workers.",
    description:
      "Frontline communications capability keeps deskless workers informed with mobile chat, announcements, and tasks.",
    categorySlugs: ["hr"],
    seo: {
      title: "Frontline communications capability | SoftwareGlimpse",
      description:
        "What frontline communications capability means for deskless team chat and announcements.",
    },
  }),
  capability({
    id: "cap-hris-integrations",
    slug: "hris-integrations",
    name: "HRIS integrations",
    shortDescription:
      "Native sync with HRIS, payroll, or people platforms for hire-to-retain workflows.",
    description:
      "HRIS integrations capability connects hiring, attendance, and training tools to payroll and people systems.",
    categorySlugs: ["hr"],
    seo: {
      title: "HRIS integrations capability | SoftwareGlimpse",
      description:
        "How HRIS integration capability supports hire-to-retain stack sync.",
    },
  }),
  capability({
    id: "cap-online-storefront",
    slug: "online-storefront",
    name: "Online storefront",
    shortDescription:
      "Branded product pages, themes, and a shoppable domain.",
    description:
      "Online storefront capability publishes a catalog customers can browse and buy from on a hosted or self-hosted shop.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "Online storefront capability | SoftwareGlimpse",
      description:
        "What online storefront capability means — themes, catalog pages, and a shoppable domain.",
    },
  }),
  capability({
    id: "cap-product-catalog",
    slug: "product-catalog",
    name: "Product catalog",
    shortDescription:
      "SKUs, variants, collections, and merchandising at scale.",
    description:
      "Product catalog capability covers variants, collections, and merchandising so shoppers find the right SKU.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "Product catalog capability | SoftwareGlimpse",
      description:
        "How product catalog capability supports variants, collections, and merchandising.",
    },
  }),
  capability({
    id: "cap-checkout-payments",
    slug: "checkout-payments",
    name: "Checkout & payments",
    shortDescription:
      "Cart, payment methods, and conversion at the last step.",
    description:
      "Checkout & payments capability converts a cart into a paid order, including wallets and processing.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "Checkout & payments capability | SoftwareGlimpse",
      description:
        "What checkout and payments capability means for ecommerce conversion.",
    },
  }),
  capability({
    id: "cap-order-management",
    slug: "order-management",
    name: "Order management",
    shortDescription:
      "Capture, route, and update orders across channels.",
    description:
      "Order management capability keeps paid orders in a queue operators can fulfill without a shared inbox.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "Order management capability | SoftwareGlimpse",
      description:
        "How order management capability supports fulfillment queues across channels.",
    },
  }),
  capability({
    id: "cap-inventory-management",
    slug: "inventory-management",
    name: "Inventory management",
    shortDescription:
      "On-hand counts, locations, and oversell protection.",
    description:
      "Inventory management capability keeps stock accurate across website, POS, and warehouses.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "Inventory management capability | SoftwareGlimpse",
      description:
        "What inventory management capability means for multi-channel stock accuracy.",
    },
  }),
  capability({
    id: "cap-shipping-fulfillment",
    slug: "shipping-fulfillment",
    name: "Shipping & fulfillment",
    shortDescription:
      "Labels, rates, tracking, and 3PL handoffs.",
    description:
      "Shipping & fulfillment capability turns paid orders into labeled shipments and tracking.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "Shipping & fulfillment capability | SoftwareGlimpse",
      description:
        "How shipping and fulfillment capability supports labels, tracking, and 3PL handoffs.",
    },
  }),
  capability({
    id: "cap-pos-omnichannel",
    slug: "pos-omnichannel",
    name: "POS & omnichannel",
    shortDescription:
      "In-person selling with the same catalog and inventory as online.",
    description:
      "POS & omnichannel capability unifies brick-and-click so stores and the website share items and stock.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "POS & omnichannel capability | SoftwareGlimpse",
      description:
        "What POS and omnichannel capability means for shared retail and online catalogs.",
    },
  }),
  capability({
    id: "cap-marketplace-channels",
    slug: "marketplace-channels",
    name: "Marketplace & sales channels",
    shortDescription:
      "Amazon, social shops, and other storefronts from one catalog.",
    description:
      "Marketplace & sales channels capability reuses product data across Amazon, social shops, and other storefronts.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "Marketplace channels capability | SoftwareGlimpse",
      description:
        "How marketplace and sales-channel capability syncs one catalog to multiple storefronts.",
    },
  }),
  capability({
    id: "cap-b2b-wholesale",
    slug: "b2b-wholesale",
    name: "B2B / wholesale",
    shortDescription:
      "Price lists, quantity breaks, and buyer-specific catalogs.",
    description:
      "B2B / wholesale capability lets trade buyers purchase at negotiated prices without a separate spreadsheet.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "B2B wholesale capability | SoftwareGlimpse",
      description:
        "What B2B and wholesale capability means for price lists and company accounts.",
    },
  }),
  capability({
    id: "cap-dropshipping-sourcing",
    slug: "dropshipping-sourcing",
    name: "Dropshipping sourcing",
    shortDescription:
      "Import supplier catalogs and route orders without holding inventory.",
    description:
      "Dropshipping sourcing capability imports supplier SKUs and routes orders — it requires an existing storefront.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "Dropshipping sourcing capability | SoftwareGlimpse",
      description:
        "How dropshipping sourcing capability imports supplier catalogs into an existing store.",
    },
  }),
  capability({
    id: "cap-app-extensions",
    slug: "app-extensions",
    name: "App / extension ecosystem",
    shortDescription:
      "Third-party apps and plugins that extend the core commerce loop.",
    description:
      "App / extension ecosystem capability fills gaps with third-party apps — part of TCO, not free features.",
    categorySlugs: ["ecommerce"],
    seo: {
      title: "Ecommerce app ecosystem capability | SoftwareGlimpse",
      description:
        "What app and extension ecosystem capability means for ecommerce TCO.",
    },
  }),
];

export const userPrioritiesSeed: UserPriorityInput[] = [
  {
    id: "up-ease-of-use",
    slug: "ease-of-use",
    name: "Ease of use",
    defaultWeight: 0.15,
    sortOrder: 1,
  },
  {
    id: "up-low-cost",
    slug: "low-cost",
    name: "Low cost",
    defaultWeight: 0.15,
    sortOrder: 2,
  },
  {
    id: "up-automation",
    slug: "automation",
    name: "Automation",
    defaultWeight: 0.15,
    sortOrder: 3,
  },
  {
    id: "up-customization",
    slug: "customization",
    name: "Customization",
    defaultWeight: 0.1,
    sortOrder: 4,
  },
  {
    id: "up-reporting",
    slug: "reporting",
    name: "Reporting",
    defaultWeight: 0.1,
    sortOrder: 5,
  },
  {
    id: "up-fast-setup",
    slug: "fast-setup",
    name: "Fast setup",
    defaultWeight: 0.1,
    sortOrder: 6,
  },
  {
    id: "up-minimal-admin",
    slug: "minimal-admin",
    name: "Minimal admin",
    defaultWeight: 0.1,
    sortOrder: 7,
  },
  {
    id: "up-scalability",
    slug: "scalability",
    name: "Scalability",
    defaultWeight: 0.15,
    sortOrder: 8,
  },
];

/**
 * /for/ business-type audience hubs — CRM-first; editorial gate approved.
 */
export const audiencesSeed: AudienceInput[] = [
  {
    id: "aud-small-business",
    slug: "small-business",
    name: "Small business",
    shortDescription:
      "Straightforward CRM for owners and small teams who need shared contacts and a simple pipeline.",
    description:
      "Small-business CRM buyers need low admin overhead, clear ownership, and a pipeline the whole team will actually use — not an enterprise suite they will abandon.",
    businessSizeSlugs: ["small-business", "micro"],
    useCaseSlugs: ["pipeline-management", "contact-management", "lead-management"],
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T00:00:00.000Z",
    },
    seo: {
      indexable: true,
      canonicalPath: "/for/small-business/",
      title: "CRM for Small Business",
      description:
        "How to choose CRM for small businesses — fit signals, must-haves, and catalogue products tagged for SMB teams.",
    },
  },
  {
    id: "aud-startups",
    slug: "startups",
    name: "Startups",
    shortDescription:
      "CRM for early-stage teams that need speed, light process, and room to grow.",
    description:
      "Startup CRM fit prioritizes fast setup, founder-friendly pipelines, and tooling that will not collapse when the team scales from a few reps to a real sales org.",
    businessTypeSlugs: ["startup"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    useCaseSlugs: ["pipeline-management", "lead-management", "sales-engagement"],
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T00:00:00.000Z",
    },
    seo: {
      indexable: true,
      canonicalPath: "/for/startups/",
      title: "CRM for Startups",
      description:
        "CRM guidance for startups — speed, adoption, and growth headroom without enterprise complexity.",
    },
  },
  {
    id: "aud-enterprise",
    slug: "enterprise",
    name: "Enterprise",
    shortDescription:
      "CRM for complex organizations that need governance, integrations, and multi-team process.",
    description:
      "Enterprise CRM decisions weigh security, permissions, integration depth, and change management more heavily than day-one simplicity.",
    businessSizeSlugs: ["enterprise"],
    useCaseSlugs: [
      "pipeline-management",
      "relationship-management",
      "reporting",
    ],
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T00:00:00.000Z",
    },
    seo: {
      indexable: true,
      canonicalPath: "/for/enterprise/",
      title: "CRM for Enterprise",
      description:
        "Enterprise CRM evaluation — governance, integrations, security, and buying process guidance.",
    },
  },
  {
    id: "aud-freelancers",
    slug: "freelancers",
    name: "Freelancers",
    shortDescription:
      "Lightweight CRM for solo operators who need client history without heavy sales process.",
    description:
      "Freelancer CRM is usually contact + follow-up discipline — not multi-stage forecasting or admin-heavy configuration.",
    businessSizeSlugs: ["solo"],
    useCaseSlugs: ["contact-management", "relationship-management"],
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T00:00:00.000Z",
    },
    seo: {
      indexable: true,
      canonicalPath: "/for/freelancers/",
      title: "CRM for Freelancers",
      description:
        "When freelancers need a CRM, what to keep simple, and when a spreadsheet is still enough.",
    },
  },
  {
    id: "aud-agencies",
    slug: "agencies",
    name: "Agencies",
    shortDescription:
      "CRM for agencies juggling clients, pitches, retainers, and handoffs across delivery teams.",
    description:
      "Agency CRM fit centers on multi-client context, pipeline for new business, and clean handoffs between sales and account/delivery.",
    businessTypeSlugs: ["agency"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    useCaseSlugs: [
      "pipeline-management",
      "relationship-management",
      "contact-management",
    ],
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T00:00:00.000Z",
    },
    seo: {
      indexable: true,
      canonicalPath: "/for/agencies/",
      title: "CRM for Agencies",
      description:
        "CRM for agencies — new-business pipeline, client context, and sales-to-delivery handoffs.",
    },
  },
  {
    id: "aud-nonprofits",
    slug: "nonprofits",
    name: "Nonprofits",
    shortDescription:
      "CRM patterns for nonprofits managing donors, volunteers, and stakeholder relationships.",
    description:
      "Nonprofit CRM buyers often need relationship history and outreach discipline more than classic B2B deal stages — evaluate the real workflow before buying a sales-only tool.",
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    useCaseSlugs: ["contact-management", "relationship-management"],
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T00:00:00.000Z",
    },
    seo: {
      indexable: true,
      canonicalPath: "/for/nonprofits/",
      title: "CRM for Nonprofits",
      description:
        "CRM guidance for nonprofits — relationship history, outreach ownership, and fit vs donor-only platforms.",
    },
  },
  {
    id: "aud-growing-teams",
    slug: "growing-teams",
    name: "Growing teams",
    shortDescription:
      "CRM for teams outgrowing spreadsheets and informal ownership of follow-ups.",
    description:
      "Growing teams need CRM that sticks with light process first, then adds stages, reporting, and permissions as volume increases.",
    businessSizeSlugs: ["small-business", "mid-market"],
    useCaseSlugs: ["pipeline-management", "lead-management", "sales-automation"],
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T00:00:00.000Z",
    },
    seo: {
      indexable: true,
      canonicalPath: "/for/growing-teams/",
      title: "CRM for Growing Teams",
      description:
        "CRM for growing teams — when spreadsheets break, what to adopt first, and how to scale process without stalling adoption.",
    },
  },
  {
    id: "aud-sales-teams",
    slug: "sales-teams",
    name: "Remote sales teams",
    shortDescription:
      "CRM for distributed sales teams that need shared pipeline visibility and activity discipline.",
    description:
      "Remote sales CRM fit emphasizes shared pipeline truth, activity visibility, and async coaching — not desk-side tribal knowledge.",
    teamTypeSlugs: ["sales"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    useCaseSlugs: [
      "pipeline-management",
      "sales-engagement",
      "reporting",
    ],
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T00:00:00.000Z",
    },
    seo: {
      indexable: true,
      canonicalPath: "/for/sales-teams/",
      title: "CRM for Remote Sales Teams",
      description:
        "CRM for remote sales teams — shared pipeline, activity visibility, and coaching without hallway updates.",
    },
  },
];
