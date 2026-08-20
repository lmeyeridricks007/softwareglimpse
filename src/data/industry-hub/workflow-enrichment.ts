import type { IndustryHubProfile } from "@/domain";

type WorkflowStepEnrichment = NonNullable<
  IndustryHubProfile["workflowSteps"]
>[number];

/**
 * Per-industry workflow depth: goals, activities, and link slugs.
 * Merged onto depth-pack steps by step id in industry-hub/index.ts.
 */
export const industryWorkflowEnrichmentBySlug: Record<
  string,
  Record<string, Partial<WorkflowStepEnrichment>>
> = {
  "financial-services": {
    prospect: {
      goal: "Capture every inbound or outbound inquiry into a shared system of record.",
      activities: [
        "Log inquiries with source and named owner",
        "Create or match the household/account",
        "Avoid leaving first touches only in email",
      ],
      useCaseSlugs: ["high-volume-lead-management", "pipeline-led-sales"],
      capabilitySlugs: ["contact-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Decide whether the inquiry belongs in relationship management or opportunity work.",
      activities: [
        "Route advisory vs sales path with a clear reason",
        "Assign the right coverage owner",
        "Record fit notes without over-collecting sensitive detail",
      ],
      useCaseSlugs: [
        "complex-sales-processes",
        "advisory-relationship-management",
      ],
      capabilitySlugs: ["pipeline-management", "contact-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    account: {
      goal: "Establish durable client/account context before advancing opportunities.",
      activities: [
        "Enrich household/account relationships",
        "Confirm key contact roles",
        "Inherit context into later opportunities",
      ],
      useCaseSlugs: ["advisory-relationship-management", "pipeline-led-sales"],
      capabilitySlugs: ["contact-management", "pipeline-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    opportunity: {
      goal: "Make the next commercial or advisory need visible with clear ownership.",
      activities: [
        "Open an opportunity on an honest stage",
        "Name owner and next date",
        "Link related household context",
      ],
      useCaseSlugs: ["pipeline-led-sales", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "contact-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    "follow-up": {
      goal: "Keep relationship and opportunity activity current between meetings.",
      activities: [
        "Log touches and outcomes",
        "Set next actions with due dates",
        "Make coverage visible across the team",
      ],
      useCaseSlugs: [
        "advisory-relationship-management",
        "complex-sales-processes",
      ],
      capabilitySlugs: ["workflow-automation", "contact-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    ongoing: {
      goal: "Sustain relationship context beyond a single opportunity cycle.",
      activities: [
        "Maintain household notes over time",
        "Schedule reviews and check-ins",
        "Keep ownership current when coverage changes",
      ],
      useCaseSlugs: ["advisory-relationship-management", "pipeline-led-sales"],
      capabilitySlugs: ["contact-management", "pipeline-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    reporting: {
      goal: "Give leaders visibility into stuck work and missing next touches.",
      activities: [
        "Review pipeline and activity gaps weekly",
        "Reassign orphaned work",
        "Avoid rebuilding oversight in spreadsheets",
      ],
      useCaseSlugs: ["complex-sales-processes", "growing-teams"],
      capabilitySlugs: ["reporting", "pipeline-management"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["reporting", "forecasting"],
    },
  },
  saas: {
    capture: {
      goal: "Log every demo, trial, and outbound reply as a shared lead with source and owner.",
      activities: [
        "Capture inbound demo/trial requests with UTM or form source",
        "Add outbound replies as contacts before the thread dies",
        "Assign an SDR/AE owner on create",
      ],
      useCaseSlugs: ["inbound-sales", "outbound-sales"],
      capabilitySlugs: ["lead-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Confirm ICP fit fast and book the next live conversation with a clear owner.",
      activities: [
        "Score fit against ICP notes on the record",
        "Book discovery or demo with a calendar task",
        "Disqualify politely and keep the reason visible",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    advance: {
      goal: "Move stages only when real buying proof exists \u2014 not when someone \u2018feels good\u2019.",
      activities: [
        "Update stage after demo completed or champion identified",
        "Attach commercial review notes and next stakeholder",
        "Keep next step date mandatory before stage change",
      ],
      useCaseSlugs: ["pipeline-management", "sales-automation"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    close: {
      goal: "Record won/lost honestly so forecasting and coaching stay trustworthy.",
      activities: [
        "Capture close date and amount the team will stand behind",
        "Require a loss/win reason code from a short list",
        "Notify CS or onboarding on won deals",
      ],
      useCaseSlugs: ["pipeline-management", "account-management"],
      capabilitySlugs: ["pipeline-management", "reporting"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["deal-management", "reporting"],
    },
    "hand-off": {
      goal: "Pass stakeholders and success goals without dropping context into Slack.",
      activities: [
        "Hand off champion, economic buyer, and goals fields",
        "Link onboarding checklist or CS owner",
        "Archive open sales tasks that no longer apply",
      ],
      useCaseSlugs: ["account-management", "pipeline-management"],
      capabilitySlugs: ["integrations", "lead-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
  },
  "small-business": {
    capture: {
      goal: "Get every inquiry into one shared place \u2014 not personal inboxes.",
      activities: [
        "Add web, phone, and walk-in leads the same day",
        "Tag source so you know what is working",
        "Name an owner even if it is the owner-operator",
      ],
      useCaseSlugs: ["pipeline-management", "customer-follow-up"],
      capabilitySlugs: ["contact-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    own: {
      goal: "Make follow-up somebody\u2019s job so leads stop dying over weekends.",
      activities: [
        "Assign one owner per open opportunity",
        "Set a next contact date before leaving the record",
        "Reassign when someone is on vacation",
      ],
      useCaseSlugs: ["customer-follow-up", "pipeline-management"],
      capabilitySlugs: ["sales-engagement", "pipeline-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    advance: {
      goal: "Move the board only when real progress happened.",
      activities: [
        "Advance after quote sent, meeting held, or deposit collected",
        "Add a short note explaining the stage change",
        "Keep stages few enough the team will update them",
      ],
      useCaseSlugs: ["pipeline-management", "customer-follow-up"],
      capabilitySlugs: ["pipeline-management", "sales-engagement"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    review: {
      goal: "Use a weekly board check instead of guessing what is open.",
      activities: [
        "Scan stuck deals older than your SLA",
        "Fix missing next steps before the meeting ends",
        "Close or recycle cold opportunities",
      ],
      useCaseSlugs: ["reporting", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "sales-engagement"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["reporting", "forecasting"],
    },
    deliver: {
      goal: "Carry won-work notes into delivery so the customer is not re-interviewed.",
      activities: [
        "Copy scope notes into delivery/billing handoff fields",
        "Confirm who owns post-sale follow-up",
        "Schedule a check-in task after delivery",
      ],
      useCaseSlugs: ["customer-follow-up", "pipeline-management"],
      capabilitySlugs: ["contact-management", "pipeline-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
  },
  "real-estate": {
    capture: {
      goal: "Every inquiry lands in a shared system with source and owner.",
      activities: [
        "Capture portal, referral, and open-house leads",
        "Record source for ROI learning",
        "Create the contact before the thread dies",
      ],
      useCaseSlugs: ["high-volume-lead-management", "pipeline-management"],
      capabilitySlugs: ["lead-management", "contact-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    assign: {
      goal: "Speed-to-lead with clear ownership before the trail goes cold.",
      activities: [
        "Route to agent or ISA with a first-touch deadline",
        "Confirm acceptance of ownership",
        "Escalate unanswered leads on SLA",
      ],
      useCaseSlugs: ["high-volume-lead-management", "pipeline-management"],
      capabilitySlugs: ["lead-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    nurture: {
      goal: "Keep long-cycle buyers and sellers visible with next touches.",
      activities: [
        "Log conversations and showing outcomes",
        "Advance stages on real progress",
        "Keep next touch dates mandatory",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["sales-engagement", "pipeline-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
    "under-contract": {
      goal: "Transaction continuity that does not live in one coordinator\u2019s calendar.",
      activities: [
        "Track milestones on the transaction record",
        "Store partner contacts (TC, lender, title)",
        "Share status across the team",
      ],
      useCaseSlugs: ["pipeline-management", "field-sales"],
      capabilitySlugs: ["pipeline-management", "contact-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    "close-follow": {
      goal: "Preserve relationship value after the transaction closes.",
      activities: [
        "Log closing outcome",
        "Schedule post-close nurture or referral asks",
        "Keep the household/contact warm for sphere marketing",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["contact-management", "reporting"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  healthcare: {
    capture: {
      goal: "Capture referrals and inquiries with source and owner \u2014 without stuffing clinical detail into CRM.",
      activities: [
        "Log referral source and referring contact",
        "Assign an outreach or intake owner immediately",
        "Keep PHI/clinical notes in the clinical system of record",
      ],
      useCaseSlugs: ["relationship-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Confirm the inquiry is appropriate for outreach or intake before investing time.",
      activities: [
        "Check fit against program/service criteria",
        "Route decline vs pursue with a visible reason",
        "Schedule intake only when prerequisites are clear",
      ],
      useCaseSlugs: ["complex-sales-processes", "relationship-management"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    coordinate: {
      goal: "Hand off with notes the next teammate can trust.",
      activities: [
        "Document next action and responsible role",
        "Share scheduling constraints on the record",
        "Confirm the patient/referrer knows who will call next",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["sales-engagement", "relationship-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    follow: {
      goal: "Close the loop on outreach outcomes so coverage is not inbox-dependent.",
      activities: [
        "Log call/email outcomes on the shared record",
        "Set the next relationship or intake touch",
        "Escalate unanswered referrals on a defined SLA",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["sales-engagement", "relationship-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
    review: {
      goal: "Review unanswered inquiries and stale plans every week.",
      activities: [
        "List open referrals past first-touch SLA",
        "Reassign orphaned records",
        "Report volume and aging without rebuilding spreadsheets",
      ],
      useCaseSlugs: ["reporting", "relationship-management"],
      capabilitySlugs: ["reporting", "pipeline-management"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["reporting", "forecasting"],
    },
  },
  "retail-ecommerce": {
    identify: {
      goal: "Resolve the customer or retailer account before logging high-touch work.",
      activities: [
        "Match the contact to the right account/store",
        "Capture key buyer and ops contacts",
        "Note channel (support, store, wholesale)",
      ],
      useCaseSlugs: ["account-management", "inbound-sales"],
      capabilitySlugs: ["contact-management", "sales-engagement"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    capture: {
      goal: "Put every meaningful interaction on the shared account record.",
      activities: [
        "Log VIP or wholesale conversations with outcomes",
        "Attach order or case references when relevant",
        "Avoid parallel notes in personal tools",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["contact-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    own: {
      goal: "Assign ownership when high-touch retail or wholesale work begins.",
      activities: [
        "Name a VIP or account owner",
        "Set a follow-up date for open asks",
        "Clarify who owns escalations",
      ],
      useCaseSlugs: ["pipeline-management", "inbound-sales"],
      capabilitySlugs: ["sales-engagement", "pipeline-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    advance: {
      goal: "Move wholesale or retention pipeline stages on real proof.",
      activities: [
        "Advance after sample, pricing, or assortment decisions",
        "Track blockers (credit, inventory, legal) on the deal",
        "Keep forecast categories honest",
      ],
      useCaseSlugs: ["pipeline-management", "sales-automation"],
      capabilitySlugs: ["pipeline-management", "sales-engagement"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    review: {
      goal: "Review open VIP tasks and stuck wholesale deals weekly.",
      activities: [
        "Clear aging tasks on VIP accounts",
        "Reassign coverage for leave",
        "Spot expansion opportunities from recent interactions",
      ],
      useCaseSlugs: ["reporting", "pipeline-management"],
      capabilitySlugs: ["reporting", "pipeline-management"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["reporting", "forecasting"],
    },
  },
  "legal-services": {
    capture: {
      goal: "Land leads, referrals, and RFPs with source \u2014 and a conflicts process note.",
      activities: [
        "Record source and referring party",
        "Flag conflicts-check status without storing privileged detail",
        "Assign a BD or intake owner",
      ],
      useCaseSlugs: ["pipeline-management", "relationship-management"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Decide pursue vs decline with a named owner before pursuit effort piles up.",
      activities: [
        "Run intake/BD screening against matter fit",
        "Decline with a reason the firm can learn from",
        "Open pursuit only when conflicts and capacity allow",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    pursue: {
      goal: "Advance pursuit stages through meetings, proposals, and decisions.",
      activities: [
        "Log meetings and proposal versions on the opportunity",
        "Track decision makers and next dates",
        "Keep status honest for partner reviews",
      ],
      useCaseSlugs: ["complex-sales-processes", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    handoff: {
      goal: "Move won-work context into matter opening without retyping from email.",
      activities: [
        "Hand off stakeholders and scope summary",
        "Confirm matter-opening owner in practice systems",
        "Close sales tasks that no longer apply",
      ],
      useCaseSlugs: ["pipeline-management", "customer-follow-up"],
      capabilitySlugs: ["integrations", "relationship-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
    steward: {
      goal: "Keep relationship touches alive for expansion and referrals.",
      activities: [
        "Schedule post-matter check-ins",
        "Log referral asks and outcomes",
        "Maintain key contact roles on the account",
      ],
      useCaseSlugs: ["relationship-management", "customer-follow-up"],
      capabilitySlugs: ["relationship-management", "reporting"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  manufacturing: {
    account: {
      goal: "Keep the customer account and buying contacts accurate before quoting.",
      activities: [
        "Maintain plant/HQ account hierarchy where needed",
        "Capture procurement, engineering, and ops contacts",
        "Note preferred communication channels",
      ],
      useCaseSlugs: ["account-management", "pipeline-management"],
      capabilitySlugs: ["relationship-management", "pipeline-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    qualify: {
      goal: "Open an opportunity only when a real quote or project appears.",
      activities: [
        "Confirm budget, timing, and technical fit",
        "Name an opportunity owner and due date",
        "Park tire-kickers without deleting history",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    quote: {
      goal: "Advance estimate \u2192 submit \u2192 revise \u2192 decision with visible ownership.",
      activities: [
        "Attach quote versions and revision notes",
        "Track engineering or applications input needed",
        "Set decision dates the forecast can trust",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "deal-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    win: {
      goal: "Capture win/loss reasons the team will actually reuse.",
      activities: [
        "Require a short reason code on close",
        "Note competitor or price pressure when known",
        "Update account health after major wins/losses",
      ],
      useCaseSlugs: ["pipeline-management", "sales-forecasting"],
      capabilitySlugs: ["deal-management", "forecasting"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["deal-management", "reporting"],
    },
    "hand-off": {
      goal: "Pass context to order entry, service, or applications engineering.",
      activities: [
        "Hand off specs, contacts, and special terms",
        "Confirm who owns first post-sale touch",
        "Avoid duplicating ERP/order systems inside CRM",
      ],
      useCaseSlugs: ["account-management", "pipeline-management"],
      capabilitySlugs: ["deal-management", "integrations"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
  },
  education: {
    capture: {
      goal: "Capture student, parent, or partner inquiries with source and owner.",
      activities: [
        "Log inquiry source (web, event, partner)",
        "Assign counselor/recruiter or partnership owner",
        "Capture program of interest without over-collecting",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["lead-management", "relationship-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    nurture: {
      goal: "Advance through counseling, visits, or employer conversations with next dates.",
      activities: [
        "Schedule visits or counseling sessions from the record",
        "Log outcomes after each touch",
        "Keep nurture stages few and meaningful",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["sales-engagement", "relationship-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
    decide: {
      goal: "Track application, deposit, contract, or partnership decision points.",
      activities: [
        "Update stage at real milestones only",
        "Record blockers (documents, funding, approvals)",
        "Notify stakeholders when decisions land",
      ],
      useCaseSlugs: ["pipeline-management", "reporting"],
      capabilitySlugs: ["reporting", "lead-management"],
      requirementSlugs: ["separate-sales-processes", "forecast-revenue"],
      featureSlugs: ["deal-management", "reporting"],
    },
    "hand-off": {
      goal: "Pass context into SIS, advising, or program delivery systems.",
      activities: [
        "Hand off key contacts and goals",
        "Confirm the receiving system owns ongoing academic records",
        "Close CRM tasks that no longer belong in CRM",
      ],
      useCaseSlugs: ["pipeline-management", "customer-follow-up"],
      capabilitySlugs: ["integrations", "lead-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
    review: {
      goal: "Review aging inquiries and missing next steps weekly.",
      activities: [
        "List inquiries past SLA",
        "Rebalance counselor caseloads",
        "Report funnel health without spreadsheet rebuilds",
      ],
      useCaseSlugs: ["reporting", "pipeline-management"],
      capabilitySlugs: ["reporting", "lead-management"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["reporting", "forecasting"],
    },
  },
  nonprofit: {
    identify: {
      goal: "Bring constituents and prospects into CRM with source and relationship context.",
      activities: [
        "Capture source and household/organization links",
        "Note relationship type (donor, volunteer, partner)",
        "Assign an owner for major prospects",
      ],
      useCaseSlugs: ["relationship-management", "contact-management"],
      capabilitySlugs: ["contact-management", "relationship-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    engage: {
      goal: "Log cultivation touches so major relationships are not inbox-only.",
      activities: [
        "Record meetings, events, and notes once",
        "Set next cultivation tasks with due dates",
        "Share ownership visibility across gift officers",
      ],
      useCaseSlugs: ["relationship-management", "customer-follow-up"],
      capabilitySlugs: ["relationship-management", "contact-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
    ask: {
      goal: "Track pledge or gift asks on a stage with a next date.",
      activities: [
        "Open an ask opportunity with amount range",
        "Advance only after real ask conversations",
        "Capture yes/no/defer reasons",
      ],
      useCaseSlugs: ["pipeline-management", "relationship-management"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["deal-management", "reporting"],
    },
    steward: {
      goal: "Thank, report impact, and schedule the next meaningful touch.",
      activities: [
        "Log stewardship actions after gifts",
        "Schedule impact updates",
        "Keep recognition preferences on the record",
      ],
      useCaseSlugs: ["relationship-management", "customer-follow-up"],
      capabilitySlugs: ["relationship-management", "reporting"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
    renew: {
      goal: "Review lapsed and renewal candidates from the board \u2014 not from memory.",
      activities: [
        "Pull renewals due in the next period",
        "Assign outreach owners",
        "Track outcomes for next year\u2019s planning",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["reporting", "relationship-management"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  hospitality: {
    capture: {
      goal: "Turn RFPs and group inquiries into opportunities with planner contacts.",
      activities: [
        "Capture dates, room block, and planner contacts",
        "Assign a salesperson owner immediately",
        "Tag source (CVB, brand site, repeat account)",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["lead-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Confirm dates, budget fit, and decision process before heavy proposal work.",
      activities: [
        "Check availability constraints at a high level",
        "Confirm decision timeline and competitors",
        "Decline or pursue with a visible reason",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    propose: {
      goal: "Advance proposal \u2192 negotiation \u2192 verbal/definite with owned follow-ups.",
      activities: [
        "Track proposal versions and concessions",
        "Set next follow-up dates",
        "Update probability based on real signals",
      ],
      useCaseSlugs: ["pipeline-management", "inbound-sales"],
      capabilitySlugs: ["pipeline-management", "deal-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    "hand-off": {
      goal: "Pass group details to operations/PMS processes cleanly.",
      activities: [
        "Hand off BEO-relevant contacts and notes",
        "Confirm ops owner for the group",
        "Keep CRM as sales history, not the ops system of record",
      ],
      useCaseSlugs: ["account-management", "pipeline-management"],
      capabilitySlugs: ["deal-management", "account-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
    steward: {
      goal: "Log post-event notes and schedule the next account touch.",
      activities: [
        "Capture satisfaction and issues after the event",
        "Schedule rebook outreach",
        "Update account preferences for next year",
      ],
      useCaseSlugs: ["customer-follow-up", "reporting"],
      capabilitySlugs: ["reporting", "pipeline-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  construction: {
    capture: {
      goal: "Turn invites and leads into bid opportunities with due date and owner.",
      activities: [
        "Log bid due date and invite source",
        "Assign estimator/BD owner",
        "Attach plans/link references without duplicating bid software",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Decide pursue vs no-bid and record the reason.",
      activities: [
        "Score fit on capacity, geography, and risk",
        "Record no-bid reasons for learning",
        "Open pursuit only with a named owner",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    estimate: {
      goal: "Advance takeoff \u2192 pricing \u2192 submission with honest stage truth.",
      activities: [
        "Track estimate progress checkpoints",
        "Log questions/RFIs relevant to pursuit",
        "Submit and confirm submission date on the record",
      ],
      useCaseSlugs: ["pipeline-management", "field-sales"],
      capabilitySlugs: ["pipeline-management", "mobile"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    negotiate: {
      goal: "Track revisions and decision dates until won or lost.",
      activities: [
        "Log revision rounds and value changes",
        "Capture decision makers and timelines",
        "Update forecast category carefully",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "deal-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    "hand-off": {
      goal: "Pass scope notes and contacts into project kickoff.",
      activities: [
        "Hand off awarded scope summary and contacts",
        "Confirm project kickoff owner",
        "Close pursuit tasks that no longer apply",
      ],
      useCaseSlugs: ["account-management", "pipeline-management"],
      capabilitySlugs: ["deal-management", "integrations"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
  },
  "transportation-logistics": {
    account: {
      goal: "Maintain shipper accounts and key procurement/ops contacts.",
      activities: [
        "Keep HQ and location contacts current",
        "Note procurement vs ops decision roles",
        "Capture service lanes of interest",
      ],
      useCaseSlugs: ["account-management", "pipeline-management"],
      capabilitySlugs: ["account-management", "pipeline-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    capture: {
      goal: "Open tender or expansion opportunities with owner and due date.",
      activities: [
        "Log tender deadlines",
        "Assign pricing/BD owner",
        "Attach tender package references",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["lead-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    quote: {
      goal: "Advance pricing \u2192 negotiation \u2192 decision with visible ownership.",
      activities: [
        "Track quote versions and assumptions",
        "Log negotiation notes",
        "Update stage on real customer signals",
      ],
      useCaseSlugs: ["pipeline-management", "inbound-sales"],
      capabilitySlugs: ["pipeline-management", "deal-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    "hand-off": {
      goal: "Connect won work to ops/TMS without turning CRM into dispatch.",
      activities: [
        "Hand off contacts and special handling notes",
        "Confirm ops ownership outside CRM",
        "Keep CRM for account history and expansion",
      ],
      useCaseSlugs: ["account-management", "pipeline-management"],
      capabilitySlugs: ["deal-management", "account-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
    retain: {
      goal: "Review account health, stakeholders, and next expansion touches.",
      activities: [
        "Schedule QBRs or check-ins",
        "Track expansion opportunities separately",
        "Reassign coverage when reps change",
      ],
      useCaseSlugs: ["account-management", "inbound-sales"],
      capabilitySlugs: ["account-management", "reporting"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  plumbing: {
    capture: {
      goal: "Turn every inbound call or web lead into a shared job opportunity with an owner.",
      activities: [
        "Log call/web leads the same day with source",
        "Assign a CSR or sales owner immediately",
        "Capture address, issue type, and urgency notes",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["lead-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Confirm scope and urgency so the right jobs get estimates \u2014 and emergencies get booked.",
      activities: [
        "Confirm emergency vs estimate path",
        "Capture access constraints and decision maker",
        "Decide book-now vs estimate with a visible reason",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    estimate: {
      goal: "Keep quotes moving with owned follow-ups through send and decision.",
      activities: [
        "Create/attach the estimate on the opportunity",
        "Set a follow-up task after quote send",
        "Advance stage only when the customer responds or a new date is set",
      ],
      useCaseSlugs: ["pipeline-management", "field-sales"],
      capabilitySlugs: ["pipeline-management", "mobile"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    book: {
      goal: "Carry won-work contacts and notes into scheduling without re-asking the customer.",
      activities: [
        "Hand off scope notes and site access details",
        "Confirm scheduling owner or system handoff",
        "Close sales tasks that no longer apply",
      ],
      useCaseSlugs: ["field-sales", "pipeline-management"],
      capabilitySlugs: ["mobile", "pipeline-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
    follow: {
      goal: "Own after-service and maintenance reminders so repeat work does not rely on memory.",
      activities: [
        "Schedule maintenance or check-back tasks",
        "Log warranty/callback notes on the account",
        "Ask for review/referral with a tracked task",
      ],
      useCaseSlugs: ["customer-follow-up", "field-sales"],
      capabilitySlugs: ["mobile", "lead-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  solar: {
    capture: {
      goal: "Capture solar leads with source and owner before speed-to-lead slips.",
      activities: [
        "Log lead source (door, digital, referral)",
        "Assign setter/closer ownership rules",
        "Capture basic site and utility notes",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["lead-management", "contact-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Confirm site fit and appointment readiness before burning survey capacity.",
      activities: [
        "Check roof/ownership/bill fit at a high level",
        "Confirm decision makers for the appointment",
        "Disqualify politely with a reason code",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    survey: {
      goal: "Put site-visit findings on the opportunity the whole team can see.",
      activities: [
        "Log survey notes and photos references",
        "Capture design constraints and homeowner questions",
        "Set proposal due date with an owner",
      ],
      useCaseSlugs: ["field-sales", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "contact-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    propose: {
      goal: "Keep proposal follow-ups staged until a real decision.",
      activities: [
        "Send proposal and log version",
        "Schedule follow-ups after send",
        "Track financing/permitting blockers on the deal",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "deal-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    "hand-off": {
      goal: "Carry won-deal fields into install ops without spreadsheet re-entry.",
      activities: [
        "Hand off design, contacts, and special terms",
        "Confirm install ops owner outside pure sales CRM tasks",
        "Close setter/closer tasks that no longer apply",
      ],
      useCaseSlugs: ["pipeline-management", "inbound-sales"],
      capabilitySlugs: ["deal-management", "integrations"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
  },
  "event-management": {
    capture: {
      goal: "Turn inquiries and RFPs into opportunities with planner contacts.",
      activities: [
        "Capture event date, headcount, and budget band",
        "Assign a salesperson owner",
        "Tag source and repeat-account status",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["contact-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Confirm fit, date, budget, and decision process before heavy proposal work.",
      activities: [
        "Check venue/date feasibility at a high level",
        "Confirm decision timeline",
        "Pursue or decline with a recorded reason",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    propose: {
      goal: "Own proposal stages and follow-ups until verbal/definite.",
      activities: [
        "Track proposal versions and concessions",
        "Set next follow-up dates",
        "Update probability from real signals",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "deal-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    contract: {
      goal: "Carry won stakeholders into planning without losing context.",
      activities: [
        "Hand off planner contacts and BEO-relevant notes",
        "Confirm planning owner",
        "Close sales-only tasks",
      ],
      useCaseSlugs: ["account-management", "pipeline-management"],
      capabilitySlugs: ["deal-management", "pipeline-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    nurture: {
      goal: "Run post-event tasks and next-year outreach from the account.",
      activities: [
        "Log post-event notes and issues",
        "Schedule rebook outreach",
        "Update account preferences",
      ],
      useCaseSlugs: ["customer-follow-up", "pipeline-management"],
      capabilitySlugs: ["relationship-management", "pipeline-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  "private-equity": {
    source: {
      goal: "Land opportunities with introducer context the firm can reuse.",
      activities: [
        "Capture introducer and source channel",
        "Assign coverage owner",
        "Link related portfolio/company context when known",
      ],
      useCaseSlugs: ["relationship-management", "pipeline-management"],
      capabilitySlugs: ["relationship-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    cover: {
      goal: "Confirm relationship path and owners before diligence effort scales.",
      activities: [
        "Map relationship path to management/board",
        "Confirm internal coverage owner",
        "Log first-meeting goals",
      ],
      useCaseSlugs: ["relationship-management", "account-management"],
      capabilitySlugs: ["relationship-management", "account-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    diligence: {
      goal: "Encode real internal checkpoints as stages \u2014 not vanity progress.",
      activities: [
        "Advance only after agreed diligence gates",
        "Log workstream owners and open questions",
        "Keep IC materials status visible",
      ],
      useCaseSlugs: ["complex-sales-processes", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "account-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    decide: {
      goal: "Record IC or pass outcomes with reasons the firm will learn from.",
      activities: [
        "Capture invest/pass and rationale codes",
        "Notify coverage for relationship follow-up",
        "Archive diligence tasks cleanly",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: ["separate-sales-processes", "forecast-revenue"],
      featureSlugs: ["deal-management", "reporting"],
    },
    maintain: {
      goal: "Keep firm relationships warm after the deal \u2014 win or pass.",
      activities: [
        "Schedule post-decision touches",
        "Maintain key contact roles",
        "Track future process opportunities",
      ],
      useCaseSlugs: ["relationship-management", "account-management"],
      capabilitySlugs: ["relationship-management", "account-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  "venture-capital": {
    source: {
      goal: "Capture deals with source and introducer before partner memory fades.",
      activities: [
        "Log source and warm intro path",
        "Assign partner/associate coverage",
        "Link related founders or prior meetings",
      ],
      useCaseSlugs: ["inbound-sales", "relationship-management"],
      capabilitySlugs: ["relationship-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    meet: {
      goal: "Put notes and next steps on the founder record after every meeting.",
      activities: [
        "Log meeting notes once in CRM",
        "Set next step owner and date",
        "Share visibility across the partnership",
      ],
      useCaseSlugs: ["relationship-management", "pipeline-management"],
      capabilitySlugs: ["relationship-management", "email"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    diligence: {
      goal: "Track partner and IC checkpoints with honest stage truth.",
      activities: [
        "Advance on real diligence gates",
        "Capture open questions by workstream",
        "Keep IC timing visible",
      ],
      useCaseSlugs: ["complex-sales-processes", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "account-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    decide: {
      goal: "Record invest/pass reasons for later pattern review.",
      activities: [
        "Capture decision and reason codes",
        "Notify coverage for founder follow-up",
        "Close diligence tasks",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: ["separate-sales-processes", "forecast-revenue"],
      featureSlugs: ["deal-management", "reporting"],
    },
    nurture: {
      goal: "Keep passed founders warm for later rounds without spreadsheet archaeology.",
      activities: [
        "Schedule check-ins on high-signal passes",
        "Track round timing notes",
        "Maintain founder contact roles",
      ],
      useCaseSlugs: ["relationship-management", "pipeline-management"],
      capabilitySlugs: ["relationship-management", "pipeline-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  photography: {
    capture: {
      goal: "Turn inquiries into leads with source before they vanish in DMs.",
      activities: [
        "Log inquiry source (web, Instagram, referral)",
        "Capture event date and package interest",
        "Assign an owner for reply",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["lead-management", "contact-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Confirm date, package, and fit before writing a custom proposal.",
      activities: [
        "Confirm date availability at a high level",
        "Capture budget band and decision maker",
        "Decline or pursue with a clear note",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    quote: {
      goal: "Send proposals with an owned follow-up task.",
      activities: [
        "Send quote/proposal and log version",
        "Set follow-up reminder",
        "Track questions on the opportunity",
      ],
      useCaseSlugs: ["pipeline-management", "inbound-sales"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    book: {
      goal: "Carry won booking notes into studio/scheduling tools.",
      activities: [
        "Hand off shoot details and contacts",
        "Confirm retainer/deposit status fields",
        "Close sales tasks after booking",
      ],
      useCaseSlugs: ["pipeline-management", "inbound-sales"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
    nurture: {
      goal: "Own post-delivery and referral follow-ups.",
      activities: [
        "Schedule gallery/delivery follow-ups",
        "Ask for referrals with a tracked task",
        "Log repeat-client opportunities",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  coaching: {
    capture: {
      goal: "Capture leads from forms, referrals, and content with an owner.",
      activities: [
        "Log lead source",
        "Assign nurture owner",
        "Capture goal/topic of interest",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["lead-management", "contact-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    nurture: {
      goal: "Run owned follow-ups until discovery is booked.",
      activities: [
        "Sequence touches without losing personalization notes",
        "Book discovery with a calendar task",
        "Pause/disqualify with a reason",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
    discover: {
      goal: "Record call notes and fit decisions on the shared record.",
      activities: [
        "Log discovery notes and fit",
        "Propose next step or decline",
        "Attach offer/package discussed",
      ],
      useCaseSlugs: ["inbound-sales", "relationship-management"],
      capabilitySlugs: ["contact-management", "pipeline-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    enroll: {
      goal: "Carry won-client goals into delivery tools without re-interviewing.",
      activities: [
        "Hand off goals and constraints",
        "Confirm delivery owner/system",
        "Close sales nurture tasks",
      ],
      useCaseSlugs: ["relationship-management", "customer-follow-up"],
      capabilitySlugs: ["contact-management", "workflow-automation"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
    retain: {
      goal: "Own renewal and referral tasks after the engagement.",
      activities: [
        "Schedule renewal conversations",
        "Track referral asks",
        "Log expansion opportunities",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["lead-management", "pipeline-management"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  "investor-relations": {
    map: {
      goal: "Map investor firms and contacts with clear coverage owners.",
      activities: [
        "Enter firm and contact roles",
        "Assign coverage owner per account",
        "Note last touch and relationship strength",
      ],
      useCaseSlugs: ["relationship-management", "account-management"],
      capabilitySlugs: ["contact-management", "account-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    plan: {
      goal: "Set outreach targets and meeting goals before roadshows.",
      activities: [
        "Build target lists for the period",
        "Define meeting goals on the record",
        "Coordinate overlapping coverage",
      ],
      useCaseSlugs: ["account-management", "relationship-management"],
      capabilitySlugs: ["account-management", "contact-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    meet: {
      goal: "Log notes and commitments once after each meeting.",
      activities: [
        "Capture notes and follow-ups",
        "Record commitments made either way",
        "Share visibility with IR leadership",
      ],
      useCaseSlugs: ["relationship-management", "customer-follow-up"],
      capabilitySlugs: ["relationship-management", "contact-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: ["contact-management", "pipeline-management"],
    },
    follow: {
      goal: "Close the loop on post-meeting tasks.",
      activities: [
        "Complete promised materials/tasks",
        "Update interest level fields",
        "Schedule the next touch",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["relationship-management", "contact-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
    maintain: {
      goal: "Keep coverage warm between events with a defined cadence.",
      activities: [
        "Run cadence tasks by segment",
        "Update ownership on coverage changes",
        "Review stale accounts weekly",
      ],
      useCaseSlugs: ["relationship-management", "account-management"],
      capabilitySlugs: ["relationship-management", "contact-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  engineering: {
    capture: {
      goal: "Turn leads and RFPs into opportunities with due dates.",
      activities: [
        "Log RFP/lead source and due date",
        "Assign pursuit owner",
        "Capture scope summary at a high level",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "account-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Decide go/no-go and name a pursuit owner before burning bid hours.",
      activities: [
        "Score fit on capability, capacity, and risk",
        "Record no-go reasons",
        "Confirm pursuit team roles",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    propose: {
      goal: "Advance through submit and interview with owned follow-ups.",
      activities: [
        "Track proposal milestones",
        "Log interview dates and attendees",
        "Update stage on real client signals",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "deal-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    award: {
      goal: "Record won/lost reasons for later pursuit learning.",
      activities: [
        "Capture award/loss and reason codes",
        "Update account relationship notes",
        "Notify delivery leadership on wins",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["deal-management", "pipeline-management"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["deal-management", "reporting"],
    },
    "hand-off": {
      goal: "Move notes and contacts into project kickoff cleanly.",
      activities: [
        "Hand off scope notes and client contacts",
        "Confirm project kickoff owner",
        "Close pursuit-only tasks",
      ],
      useCaseSlugs: ["account-management", "pipeline-management"],
      capabilitySlugs: ["deal-management", "account-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
  },
  music: {
    capture: {
      goal: "Capture venue and booker contacts with enough context to pitch intelligently.",
      activities: [
        "Enter venue/booker contacts",
        "Note genre fit and past plays",
        "Assign outreach owner",
      ],
      useCaseSlugs: ["outbound-sales", "pipeline-management"],
      capabilitySlugs: ["contact-management", "pipeline-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    pitch: {
      goal: "Log outreach with date and materials so follow-ups are shared.",
      activities: [
        "Log pitch date and materials sent",
        "Set follow-up tasks",
        "Track holds of interest",
      ],
      useCaseSlugs: ["outbound-sales", "pipeline-management"],
      capabilitySlugs: ["contact-management", "pipeline-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    negotiate: {
      goal: "Track holds and offers as real pipeline stages.",
      activities: [
        "Advance on hold/offer signals",
        "Capture terms under discussion",
        "Keep decision dates visible",
      ],
      useCaseSlugs: ["pipeline-management", "relationship-management"],
      capabilitySlugs: ["pipeline-management", "contact-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    confirm: {
      goal: "Carry won-date notes into touring/production tools.",
      activities: [
        "Hand off date, contacts, and technical notes",
        "Confirm deposit/contract status fields",
        "Close sales tasks after confirm",
      ],
      useCaseSlugs: ["pipeline-management", "relationship-management"],
      capabilitySlugs: ["pipeline-management", "contact-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
    nurture: {
      goal: "Own post-show thanks and rebook tasks.",
      activities: [
        "Send thanks with a tracked task",
        "Log show outcomes",
        "Schedule rebook outreach",
      ],
      useCaseSlugs: ["customer-follow-up", "relationship-management"],
      capabilitySlugs: ["relationship-management", "pipeline-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  "web-design": {
    capture: {
      goal: "Turn inquiries into prospects with source before replies scatter.",
      activities: [
        "Log inquiry source",
        "Capture project type and timeline",
        "Assign a sales owner",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["lead-management", "contact-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Confirm fit, budget band, and timeline before custom proposals.",
      activities: [
        "Qualify budget and decision process",
        "Confirm timeline realism",
        "Decline or pursue with notes",
      ],
      useCaseSlugs: ["inbound-sales", "pipeline-management"],
      capabilitySlugs: ["pipeline-management", "lead-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    propose: {
      goal: "Send proposals with owned follow-up tasks.",
      activities: [
        "Send proposal and log version",
        "Set follow-up reminders",
        "Track questions on the opportunity",
      ],
      useCaseSlugs: ["pipeline-management", "inbound-sales"],
      capabilitySlugs: ["pipeline-management", "deal-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    sign: {
      goal: "Carry won-project notes into delivery tools.",
      activities: [
        "Hand off scope, contacts, and success criteria",
        "Confirm project kickoff owner",
        "Close sales tasks after signature",
      ],
      useCaseSlugs: ["pipeline-management", "account-management"],
      capabilitySlugs: ["deal-management", "pipeline-management"],
      requirementSlugs: ["track-client-interactions"],
      featureSlugs: ["contact-management", "custom-fields"],
    },
    retain: {
      goal: "Own maintenance and expansion outreach after launch.",
      activities: [
        "Schedule post-launch check-ins",
        "Track retainer/maintenance offers",
        "Log expansion opportunities",
      ],
      useCaseSlugs: ["customer-follow-up", "account-management"],
      capabilitySlugs: ["account-management", "pipeline-management"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
  "security-companies": {
    capture: {
      goal: "Turn leads and RFPs into opportunities with site and scope context.",
      activities: [
        "Log lead/RFP source and due date",
        "Capture sites and high-level scope",
        "Assign BD/sales owner",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "account-management"],
      requirementSlugs: [
        "automate-lead-follow-up",
        "track-client-interactions",
      ],
      featureSlugs: ["lead-management", "contact-management"],
    },
    qualify: {
      goal: "Map sites, scope, and decision process before heavy proposal work.",
      activities: [
        "Confirm decision makers and timeline",
        "Check fit on geography and service mix",
        "Pursue or decline with a reason",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: [
        "track-client-interactions",
        "automate-lead-follow-up",
      ],
      featureSlugs: [
        "lead-management",
        "pipeline-management",
        "workflow-automation",
      ],
    },
    propose: {
      goal: "Track proposal stages and stakeholders until award.",
      activities: [
        "Log proposal versions and presentations",
        "Track stakeholder coverage",
        "Set follow-up dates",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "relationship-management"],
      requirementSlugs: ["separate-sales-processes"],
      featureSlugs: ["pipeline-management", "deal-management"],
    },
    award: {
      goal: "Carry won-contract contacts into onboarding.",
      activities: [
        "Hand off sites, contacts, and special terms",
        "Confirm onboarding/ops owner",
        "Close pursuit tasks",
      ],
      useCaseSlugs: ["pipeline-management", "complex-sales-processes"],
      capabilitySlugs: ["pipeline-management", "account-management"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["deal-management", "reporting"],
    },
    expand: {
      goal: "Own renewal and expansion tasks across the account.",
      activities: [
        "Schedule renewal reviews",
        "Track expansion sites/opportunities",
        "Update account health notes",
      ],
      useCaseSlugs: ["account-management", "sales-forecasting"],
      capabilitySlugs: ["account-management", "forecasting"],
      requirementSlugs: ["forecast-revenue", "separate-sales-processes"],
      featureSlugs: ["workflow-automation", "email-sync", "contact-management"],
    },
  },
};

export function applyIndustryWorkflowEnrichment(
  industrySlug: string,
  steps: IndustryHubProfile["workflowSteps"],
): IndustryHubProfile["workflowSteps"] {
  const pack = industryWorkflowEnrichmentBySlug[industrySlug];
  if (!pack || steps.length === 0) return steps;
  return steps.map((step) => {
    const extra = pack[step.id];
    if (!extra) return step;
    return {
      ...step,
      goal: extra.goal ?? step.goal,
      activities: extra.activities?.length ? extra.activities : step.activities,
      useCaseSlugs: extra.useCaseSlugs?.length
        ? extra.useCaseSlugs
        : step.useCaseSlugs,
      capabilitySlugs: extra.capabilitySlugs?.length
        ? extra.capabilitySlugs
        : step.capabilitySlugs,
      requirementSlugs: extra.requirementSlugs?.length
        ? extra.requirementSlugs
        : step.requirementSlugs,
      featureSlugs: extra.featureSlugs?.length
        ? extra.featureSlugs
        : step.featureSlugs,
    };
  });
}
