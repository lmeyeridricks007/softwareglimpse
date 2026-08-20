import type { IndustryHubProfile } from "@/domain";

type Depth = Pick<
  IndustryHubProfile,
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "tagline"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "needsVisual"
  | "workflowVisual"
  | "heroVisual"
  | "faq"
>;

function visuals(
  slug: string,
  label: string,
  heroFocus: string,
  needsFocus: string,
  workflowFocus: string,
): Pick<Depth, "heroVisual" | "needsVisual" | "workflowVisual"> {
  return {
    heroVisual: {
      src: `/industries/${slug}-hero.png`,
      alt: `Educational CRM UI mockup for ${label}: ${heroFocus}`,
      caption: `${label} CRM focuses on ${heroFocus}.`,
    },
    needsVisual: {
      src: `/industries/${slug}-needs.png`,
      alt: `Problems-to-CRM-fixes diagram for ${label}: ${needsFocus}`,
      caption: needsFocus,
    },
    workflowVisual: {
      src: `/industries/${slug}-workflow.png`,
      alt: `Numbered CRM workflow for ${label}: ${workflowFocus}`,
      caption: workflowFocus,
    },
  };
}

/**
 * Depth packs for niche vertical industry hubs onboarded from legacy best-CRM URLs.
 */
export const verticalDepthBySlug: Record<string, Depth> = {
  plumbing: {
    tagline:
      "Capture job leads, send estimates on time, and keep customer history when the truck leaves the driveway.",
    overview:
      "Plumbing CRM is about booked jobs and follow-through — not enterprise forecasting theater. Fit depends on how you capture inbound calls, own estimates, and keep repeat-customer context without turning CRM into a full field-service suite.",
    whoThisIsFor:
      "Residential and light-commercial plumbing contractors, dispatch-aware owners, and small office teams who need shared lead and estimate ownership. Buyers usually want fewer missed callbacks more than deep customization.",
    whatMattersIntro:
      "Prioritize inbound lead capture, estimate/job stages, mobile-friendly updates, and a clear boundary with scheduling or field-service tools. Specialized dispatch software may sit beside CRM — do not assume one tool replaces both.",
    workedExample:
      "Worked example: a three-truck residential shop. Before CRM, quote follow-ups lived in the owner’s phone. After CRM, every inbound lead has an owner, stage, and next call date — Friday reviews start from aging quotes.",
    workedExampleSecondary:
      "Worked example: a commercial plumber covering property managers. Before CRM, building contacts reset every bid. After CRM, account notes travel with the property so the next emergency call is not a cold start.",
    glance: {
      primaryGoal: "Booked jobs and owned estimate follow-up",
      commonPriorities: [
        "Inbound lead capture",
        "Estimate stages",
        "Customer history",
        "Mobile updates",
        "Clear CRM vs field tools",
      ],
      teamTypes: ["Owner-operators", "Office / dispatch", "Technicians (light)", "Estimators"],
    },
    challenges: [
      {
        id: "missed-callbacks",
        title: "Quote follow-ups get lost",
        pain: "Leads die in voicemail and personal texts.",
        crmHelps:
          "Shared stages and next-action dates make aging estimates reviewable.",
      },
      {
        id: "customer-amnesia",
        title: "Customer history resets per job",
        pain: "Technicians rebuild preferences from memory.",
        crmHelps:
          "Account notes and past jobs sit with the customer record.",
      },
      {
        id: "tool-overlap",
        title: "CRM vs field software confusion",
        pain: "Teams duplicate schedules or invoices in the wrong system.",
        crmHelps:
          "Keep CRM for leads and relationships; keep dispatch/job execution in field tools unless deliberately integrated.",
      },
      {
        id: "owner-bottleneck",
        title: "Only the owner knows the pipeline",
        pain: "Coverage collapses when the owner is on a job.",
        crmHelps:
          "Named owners and stages let office staff cover without archaeology.",
      },
    ],
    outcomes: [
      {
        id: "owned-leads",
        title: "Owned inbound leads",
        description: "Every call or form has a next step and a person responsible.",
      },
      {
        id: "faster-quotes",
        title: "Faster quote follow-up",
        description: "Aging estimates are visible before they go cold.",
      },
      {
        id: "repeat-memory",
        title: "Stronger repeat-customer memory",
        description: "Property and preference notes survive truck handoffs.",
      },
      {
        id: "clear-boundary",
        title: "Clearer tool boundaries",
        description: "CRM and field systems stop fighting for the same data.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts",
        title: "Contacts & accounts",
        description: "Homeowners, property managers, and site contacts.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipeline",
        title: "Lead / estimate pipeline",
        description: "Stages from inquiry to booked job.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "tasks",
        title: "Tasks & reminders",
        description: "Callback and quote-due dates on every open item.",
        priority: "must",
      },
      {
        id: "mobile",
        title: "Mobile-friendly updates",
        description: "Office or techs can log next steps off-desk.",
        priority: "nice",
        href: "/capabilities/mobile/",
      },
      {
        id: "integrations",
        title: "Field / accounting connections (later)",
        description: "Verify; do not assume CRM replaces dispatch.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      { id: "capture", label: "Capture", detail: "Inbound call or web lead becomes a record with owner." },
      { id: "qualify", label: "Qualify", detail: "Confirm scope, urgency, and whether to estimate." },
      { id: "estimate", label: "Estimate", detail: "Advance stages through quote sent and follow-up." },
      { id: "book", label: "Book", detail: "Won work carries contacts and notes into scheduling." },
      { id: "follow", label: "Follow up", detail: "After-service and maintenance reminders stay owned." },
    ],
    ...visuals(
      "plumbing",
      "plumbing",
      "lead capture through estimate stages to booked jobs",
      "Where plumbing follow-up breaks — and how shared ownership helps",
      "A practical lead-to-booked-job loop for plumbing contractors",
    ),
    faq: [
      {
        question: "Do plumbers need a specialized field-service CRM?",
        answer:
          "Often you need both lenses: a CRM for leads and customer history, and a field/dispatch tool for schedules and job execution. Many plumbing shops succeed with a general CRM for sales follow-up and a separate field system — verify integrations rather than assuming one suite covers both.",
      },
      {
        question: "What stages should a plumbing estimate pipeline have?",
        answer:
          "Keep them honest and few: new lead, site visit scheduled, quote sent, follow-up, won/lost. Long taxonomies get skipped on busy days.",
      },
      {
        question: "Should technicians live in the CRM daily?",
        answer:
          "Usually lightly — office owns pipeline hygiene; technicians update notes or outcomes when practical. Force-fitting full desk CRM habits onto the truck often kills adoption.",
      },
    ],
  },

  solar: {
    tagline:
      "Move solar leads from inquiry to survey, proposal, and install handoff without losing ownership.",
    overview:
      "Solar CRM supports long lead cycles, multi-step proposals, and customer communication through install. Project design and permitting tools usually remain separate — CRM keeps the sales and relationship layer reviewable.",
    whoThisIsFor:
      "Residential and light-commercial solar sellers, appointment setters, and operations coordinators who need shared pipeline visibility from lead to install kickoff.",
    whatMattersIntro:
      "Prioritize lead source discipline, survey/proposal stages, stakeholder contacts, and a clean handoff into ops. Verify design/permitting integrations; do not treat CRM as the engineering system of record.",
    workedExample:
      "Worked example: a solar sales pod. Before CRM, setter appointments and closer notes lived in separate spreadsheets. After CRM, every lead shows stage, owner, and last survey date — managers coach from stuck proposals.",
    workedExampleSecondary:
      "Worked example: an install coordinator. Before CRM, won deals arrived with missing utility contacts. After CRM, required handoff fields block ‘won’ until contacts and site notes are present.",
    glance: {
      primaryGoal: "Lead-to-install pipeline clarity",
      commonPriorities: [
        "Lead capture & source",
        "Survey / proposal stages",
        "Customer communication",
        "Install handoff fields",
        "CRM vs design tools",
      ],
      teamTypes: ["Setters", "Closers", "Sales managers", "Install coordinators"],
    },
    challenges: [
      {
        id: "long-cycle",
        title: "Long cycles lose owners",
        pain: "Leads stall between survey and proposal with no next step.",
        crmHelps:
          "Stages and tasks keep each deal reviewable across weeks.",
      },
      {
        id: "setter-closer",
        title: "Setter-to-closer drops",
        pain: "Appointment context never reaches the closer.",
        crmHelps:
          "Shared records carry notes, objections, and site details.",
      },
      {
        id: "handoff",
        title: "Install handoffs are incomplete",
        pain: "Ops rebuilds customer and site context from email.",
        crmHelps:
          "Required fields and notes travel with the won opportunity.",
      },
      {
        id: "tool-boundary",
        title: "CRM vs design software blur",
        pain: "Teams duplicate array designs or permit status in CRM.",
        crmHelps:
          "Keep CRM for sales/relationships; keep design/permitting in specialist tools.",
      },
    ],
    outcomes: [
      {
        id: "pipeline-truth",
        title: "Honest solar pipeline",
        description: "Survey and proposal stages match how you actually sell.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner install kickoffs",
        description: "Won deals carry the contacts ops needs.",
      },
      {
        id: "source-learning",
        title: "Better lead-source learning",
        description: "Source and outcome data become reviewable, not anecdotal.",
      },
      {
        id: "owned-followups",
        title: "Owned customer follow-ups",
        description: "Post-proposal and post-install touches have owners.",
      },
    ],
    capabilityNeeds: [
      {
        id: "leads",
        title: "Lead capture & routing",
        description: "Inbound and partner leads get owners fast.",
        priority: "must",
        href: "/capabilities/lead-management/",
      },
      {
        id: "pipeline",
        title: "Multi-stage pipeline",
        description: "Survey, proposal, contract, handoff stages.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "activities",
        title: "Activity & notes",
        description: "Site visits and objections logged once.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Pipeline reporting",
        description: "Aging proposals and source performance.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "integrations",
        title: "Design / ops integrations",
        description: "Verify carefully; keep engineering systems separate.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      { id: "capture", label: "Capture", detail: "Lead enters with source and owner." },
      { id: "qualify", label: "Qualify", detail: "Confirm site fit and appointment readiness." },
      { id: "survey", label: "Survey", detail: "Site visit notes land on the opportunity." },
      { id: "propose", label: "Propose", detail: "Proposal and follow-ups stay staged." },
      { id: "hand-off", label: "Hand off", detail: "Won deal carries fields into install ops." },
    ],
    ...visuals(
      "solar",
      "solar businesses",
      "lead through survey, proposal, and install handoff",
      "Where solar sales follow-up breaks — and how CRM ownership helps",
      "A practical lead-to-install loop for solar teams",
    ),
    faq: [
      {
        question: "Should permitting status live in the CRM?",
        answer:
          "Track high-level blockers that sales must know about, but keep detailed permitting and design work in specialist tools unless you have a deliberate integration design.",
      },
      {
        question: "How do setters and closers share one pipeline?",
        answer:
          "Agree stage definitions, require notes on appointment outcomes, and review aging surveys from the same board.",
      },
      {
        question: "Is a general CRM enough for solar?",
        answer:
          "Many teams run a general CRM for sales ownership and separate design/ops systems. Choose purpose-built solar suites only when your workflow depends on features a general CRM cannot model — verify with shortlisted vendors.",
      },
    ],
  },

  "event-management": {
    tagline:
      "Keep event client pipelines, stakeholder lists, and follow-ups in one place — without turning CRM into a production schedule.",
    overview:
      "Event-management CRM supports inquiry-to-contract pipelines, multi-stakeholder client context, and post-event follow-up. Run-of-show and venue operations tools usually stay separate.",
    whoThisIsFor:
      "Planners, producers, venue sales teams, and boutique agencies juggling multiple active events and client stakeholders.",
    whatMattersIntro:
      "Prioritize inquiry pipelines, account contacts (client, venue, vendors), task ownership, and a clean handoff into production tools. Do not force full event logistics into CRM.",
    workedExample:
      "Worked example: a corporate events studio. Before CRM, RFPs lived in email threads. After CRM, every inquiry has a stage, owner, and decision date — Friday reviews start from aging proposals.",
    workedExampleSecondary:
      "Worked example: a venue sales lead. Before CRM, planner preferences reset every booking. After CRM, account notes travel with the client for the next event cycle.",
    glance: {
      primaryGoal: "Inquiry-to-contract clarity with stakeholder memory",
      commonPriorities: [
        "Inquiry pipeline",
        "Stakeholder contacts",
        "Proposal follow-up",
        "Post-event nurture",
        "CRM vs production tools",
      ],
      teamTypes: ["Sales / BD", "Planners", "Account leads", "Venue sales"],
    },
    challenges: [
      {
        id: "rfp-chaos",
        title: "RFPs scatter across inboxes",
        pain: "No shared view of what is open, waiting, or dead.",
        crmHelps: "Shared inquiry stages and owners make the pipeline reviewable.",
      },
      {
        id: "stakeholder-fog",
        title: "Stakeholder maps are tribal",
        pain: "Who decides and who influences lives in one planner’s head.",
        crmHelps: "Related contacts and roles sit on the account.",
      },
      {
        id: "post-event",
        title: "Post-event follow-up disappears",
        pain: "Testimonials and renewals are forgotten after load-out.",
        crmHelps: "Tasks and next events stay owned on the account.",
      },
      {
        id: "tool-mix",
        title: "CRM vs production confusion",
        pain: "Teams try to run timelines and budgets inside CRM.",
        crmHelps:
          "Keep CRM for sales and relationships; keep run-of-show in production tools.",
      },
    ],
    outcomes: [
      {
        id: "visible-pipeline",
        title: "Visible inquiry pipeline",
        description: "Open RFPs and proposals stop living only in email.",
      },
      {
        id: "stakeholder-memory",
        title: "Stronger stakeholder memory",
        description: "Client and vendor contacts survive staff changes.",
      },
      {
        id: "renewal-discipline",
        title: "Better post-event discipline",
        description: "Follow-ups and referrals have owners.",
      },
      {
        id: "handoff-clarity",
        title: "Cleaner sales-to-production handoffs",
        description: "Won events carry the notes production needs.",
      },
    ],
    capabilityNeeds: [
      {
        id: "pipeline",
        title: "Inquiry / proposal pipeline",
        description: "Stages from RFP to contracted event.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "contacts",
        title: "Contacts & accounts",
        description: "Clients, venues, and key vendors.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "tasks",
        title: "Tasks & deadlines",
        description: "Proposal and decision dates on every opportunity.",
        priority: "must",
      },
      {
        id: "custom",
        title: "Flexible fields / boards",
        description: "Event type, date, and budget fields your team will use.",
        priority: "nice",
      },
      {
        id: "integrations",
        title: "Production tool connections",
        description: "Verify; keep detailed timelines outside CRM.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      { id: "capture", label: "Capture", detail: "Inquiry or RFP becomes an opportunity." },
      { id: "qualify", label: "Qualify", detail: "Fit, date, budget, and decision process." },
      { id: "propose", label: "Propose", detail: "Proposal stages and follow-ups owned." },
      { id: "contract", label: "Contract", detail: "Won deal carries stakeholders into planning." },
      { id: "nurture", label: "Nurture", detail: "Post-event tasks and next-year outreach." },
    ],
    ...visuals(
      "event-management",
      "event management",
      "inquiry pipeline through proposal and post-event nurture",
      "Where event sales follow-up breaks — and how shared CRM ownership helps",
      "A practical inquiry-to-contract loop for event teams",
    ),
    faq: [
      {
        question: "Should the run-of-show live in the CRM?",
        answer:
          "Generally no. Use CRM for inquiries, clients, and follow-ups; keep production timelines and day-of logistics in event tools unless you have a deliberate integration.",
      },
      {
        question: "What fields are worth requiring on an event opportunity?",
        answer:
          "Event date, expected guest count or scope band, decision date, and primary client contact. Keep the list short enough the team will complete it.",
      },
      {
        question: "Can a general CRM work for event businesses?",
        answer:
          "Yes for sales and relationship ownership. Choose highly configurable boards when your inquiry types vary widely — still verify against your real workflow.",
      },
    ],
  },

  "private-equity": {
    tagline:
      "Track deal networks, firm relationships, and diligence follow-ups without losing who introduced whom.",
    overview:
      "Private-equity CRM centers on relationship graphs, deal pipelines, and coverage across partners and associates. Portfolio ops and fund admin systems remain separate — CRM owns who you know and what is in motion.",
    whoThisIsFor:
      "PE deal teams, business-development partners, and investor-facing associates who need shared relationship context and deal-stage discipline.",
    whatMattersIntro:
      "Prioritize relationship intelligence, multi-party deal stages, activity discipline, and permissions appropriate to sensitive firm data. Confirm security and access model with vendors.",
    workedExample:
      "Worked example: a mid-market PE firm. Before CRM, intro paths lived in partner email. After CRM, deals show relationship paths and next diligence owners — Monday meetings start from stuck stages.",
    workedExampleSecondary:
      "Worked example: a BD associate covering intermediaries. Before CRM, banker coverage was tribal. After CRM, firm accounts show last touch and open opportunities across the team.",
    glance: {
      primaryGoal: "Deal network + relationship coverage",
      commonPriorities: [
        "Relationship graph",
        "Deal pipeline stages",
        "Intro / coverage history",
        "Permissions",
        "Activity ownership",
      ],
      teamTypes: ["Partners", "Associates", "BD", "IR-adjacent coverage"],
    },
    challenges: [
      {
        id: "intro-loss",
        title: "Introduction paths are invisible",
        pain: "Teams cannot see who knows whom when a deal heats up.",
        crmHelps:
          "Relationship context sits with people and firms, not only in inboxes.",
      },
      {
        id: "deal-fog",
        title: "Deal status is tribal",
        pain: "Diligence blockers are discovered in hallway conversations.",
        crmHelps:
          "Shared stages and tasks make blockers reviewable.",
      },
      {
        id: "coverage",
        title: "Banker and advisor coverage overlaps",
        pain: "Multiple partners touch the same intermediary without coordination.",
        crmHelps:
          "Account ownership and last-touch history reduce collisions.",
      },
      {
        id: "security",
        title: "Sensitive access is unclear",
        pain: "Teams overshare or undershare deal detail.",
        crmHelps:
          "Role-aware permissions and team boundaries — verify with your vendor and internal policy.",
      },
    ],
    outcomes: [
      {
        id: "network-visibility",
        title: "Visible relationship networks",
        description: "Intro paths are queryable when deals need coverage.",
      },
      {
        id: "deal-clarity",
        title: "Clearer deal pipelines",
        description: "Stages reflect real diligence checkpoints.",
      },
      {
        id: "coverage-discipline",
        title: "Better intermediary coverage",
        description: "Last touch and owners reduce duplicate outreach.",
      },
      {
        id: "admin-readiness",
        title: "Clearer admin ownership",
        description: "Permissions and hygiene have a named owner.",
      },
    ],
    capabilityNeeds: [
      {
        id: "relationships",
        title: "Relationship intelligence",
        description: "People, firms, and intro context.",
        priority: "must",
        href: "/capabilities/relationship-management/",
      },
      {
        id: "pipeline",
        title: "Deal pipeline",
        description: "Stages from sourcing through diligence.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "activities",
        title: "Activity capture",
        description: "Meetings and emails tied to deals and people.",
        priority: "must",
      },
      {
        id: "permissions",
        title: "Permissions & admin",
        description: "Team and deal visibility controls.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Pipeline reporting",
        description: "Aging deals and coverage views.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      { id: "source", label: "Source", detail: "Opportunity enters with introducer context." },
      { id: "cover", label: "Cover", detail: "Relationship path and owners confirmed." },
      { id: "diligence", label: "Diligence", detail: "Stages encode real internal checkpoints." },
      { id: "decide", label: "Decide", detail: "IC or pass outcomes recorded with reasons." },
      { id: "maintain", label: "Maintain", detail: "Firm relationships stay warm after the deal." },
    ],
    ...visuals(
      "private-equity",
      "private equity",
      "relationship network and deal pipeline for PE teams",
      "Where PE relationship and deal follow-up breaks — and how CRM helps",
      "A practical source-to-decision loop for private equity",
    ),
    faq: [
      {
        question: "Is Affinity-style relationship CRM required for PE?",
        answer:
          "Many PE teams prioritize relationship intelligence and deal networks. Generalist CRMs can work when configured carefully; purpose-built private-capital tools may fit better when intro graphs are central — compare against your workflow and budget.",
      },
      {
        question: "Should portfolio company ops live in the PE CRM?",
        answer:
          "Usually keep fund/deal relationships in CRM and portfolio operating systems separate unless you have a clear shared model.",
      },
      {
        question: "What deal stages are worth encoding?",
        answer:
          "Stages that match how your firm actually reviews opportunities — sourcing, early diligence, advanced diligence, IC, won/passed — with owners on blockers.",
      },
    ],
  },

  "venture-capital": {
    tagline:
      "Keep founder and intermediary relationships, deal flow, and partner coverage in one shared system.",
    overview:
      "Venture-capital CRM supports deal flow, relationship graphs, and partner coverage across sourcing and diligence. Portfolio support and fund admin tools remain adjacent systems.",
    whoThisIsFor:
      "VC partners, principals, scouts, and platform/BD roles who need shared visibility into founders, intermediaries, and active deals.",
    whatMattersIntro:
      "Prioritize relationship context, deal-flow stages, activity discipline, and access controls appropriate to sensitive conversations. Verify vendor security documentation.",
    workedExample:
      "Worked example: an early-stage fund. Before CRM, warm intros lived in partner Slack. After CRM, each founder record shows intro path, last meeting, and open deal stage.",
    workedExampleSecondary:
      "Worked example: a sourcing associate. Before CRM, angel and accelerator coverage collided. After CRM, firm accounts show owners and last touch across the team.",
    glance: {
      primaryGoal: "Deal flow + relationship coverage",
      commonPriorities: [
        "Founder / firm relationships",
        "Deal-flow stages",
        "Intro tracking",
        "Partner coverage",
        "Permissions",
      ],
      teamTypes: ["Partners", "Principals / associates", "Scouts", "Platform / BD"],
    },
    challenges: [
      {
        id: "flow-fog",
        title: "Deal flow is opaque",
        pain: "Partners cannot see what is stalled without a sync.",
        crmHelps: "Shared stages and owners make the funnel reviewable.",
      },
      {
        id: "intro-memory",
        title: "Intro memory is personal",
        pain: "Warm paths disappear when one partner is out.",
        crmHelps: "Relationship context sits on people and firms.",
      },
      {
        id: "double-touch",
        title: "Founders get double-touched",
        pain: "Multiple partners reach out without coordination.",
        crmHelps: "Coverage and last-touch history reduce collisions.",
      },
      {
        id: "tool-spill",
        title: "Notes spill across docs and email",
        pain: "Diligence context never consolidates.",
        crmHelps: "Activities and notes attach to the deal record.",
      },
    ],
    outcomes: [
      {
        id: "shared-flow",
        title: "Shared deal-flow visibility",
        description: "Active opportunities have stages and owners.",
      },
      {
        id: "warmer-intros",
        title: "Stronger intro memory",
        description: "Relationship paths are available when needed.",
      },
      {
        id: "coverage",
        title: "Cleaner partner coverage",
        description: "Last touch reduces duplicate founder outreach.",
      },
      {
        id: "faster-reviews",
        title: "Faster pipeline reviews",
        description: "Meetings start from stuck deals, not archaeology.",
      },
    ],
    capabilityNeeds: [
      {
        id: "relationships",
        title: "Relationship intelligence",
        description: "Founders, angels, and intermediaries.",
        priority: "must",
        href: "/capabilities/relationship-management/",
      },
      {
        id: "pipeline",
        title: "Deal-flow pipeline",
        description: "Stages from source to decision.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "activities",
        title: "Activity capture",
        description: "Meetings and emails on people and deals.",
        priority: "must",
      },
      {
        id: "permissions",
        title: "Permissions",
        description: "Partner and deal visibility controls.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Flow reporting",
        description: "Volume, aging, and source views.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      { id: "source", label: "Source", detail: "Deal enters with source and introducer." },
      { id: "meet", label: "Meet", detail: "Notes and next steps land on the founder record." },
      { id: "diligence", label: "Diligence", detail: "Stages track partner and IC checkpoints." },
      { id: "decide", label: "Decide", detail: "Invest / pass reasons recorded." },
      { id: "nurture", label: "Nurture", detail: "Passed founders stay warm for later rounds." },
    ],
    ...visuals(
      "venture-capital",
      "venture capital",
      "deal flow and founder relationship coverage for VC teams",
      "Where VC deal-flow follow-up breaks — and how CRM ownership helps",
      "A practical source-to-decision loop for venture capital",
    ),
    faq: [
      {
        question: "What is different about VC CRM vs general sales CRM?",
        answer:
          "VC workflows emphasize relationship graphs, long nurture of passed founders, and partner coverage more than classic SMB sales stages. Purpose-built private-capital CRMs often optimize for that — general CRMs can work with disciplined configuration.",
      },
      {
        question: "Should portfolio support live in the same CRM?",
        answer:
          "Many funds keep deal/relationship CRM separate from portfolio ops tools. Share only what helps coverage without flooding the deal system.",
      },
      {
        question: "How light can stages be?",
        answer:
          "As light as your partnership will actually update — e.g. new, active diligence, partner meeting, IC, invested/passed.",
      },
    ],
  },

  photography: {
    tagline:
      "Turn inquiries into booked shoots and keep client history without running your whole studio in CRM.",
    overview:
      "Photography CRM supports inquiry follow-up, booking pipelines, and client relationship history. Studio scheduling, galleries, and contracts often live in adjacent tools — CRM keeps sales follow-through owned.",
    whoThisIsFor:
      "Portrait, wedding, commercial, and studio photographers (solo or small teams) who lose leads between inquiry and booking.",
    whatMattersIntro:
      "Prioritize inquiry capture, simple booking stages, client notes, and light automation for follow-ups. Specialized studio suites may cover booking/galleries better — use CRM when relationship and pipeline ownership is the gap.",
    workedExample:
      "Worked example: a wedding photographer. Before CRM, inquiry replies lived in Instagram DMs. After CRM, every lead has a stage and next email date — peak season reviews start from aging quotes.",
    workedExampleSecondary:
      "Worked example: a commercial shooter. Before CRM, brand contacts reset every campaign. After CRM, account notes and past briefs inform the next outreach.",
    glance: {
      primaryGoal: "Inquiry-to-booking follow-through",
      commonPriorities: [
        "Inquiry capture",
        "Booking stages",
        "Client history",
        "Follow-up reminders",
        "CRM vs studio tools",
      ],
      teamTypes: ["Solo photographers", "Studio leads", "Studio assistants"],
    },
    challenges: [
      {
        id: "dm-leads",
        title: "Leads hide in DMs and email",
        pain: "No shared view of open inquiries.",
        crmHelps: "Inquiries become records with owners and stages.",
      },
      {
        id: "season-rush",
        title: "Peak season follow-up collapses",
        pain: "Quotes expire while you are shooting.",
        crmHelps: "Reminders and stages keep aging inquiries visible.",
      },
      {
        id: "client-memory",
        title: "Client preferences reset",
        pain: "Repeat clients feel like first-time buyers.",
        crmHelps: "Notes and past jobs sit on the contact.",
      },
      {
        id: "tool-overlap",
        title: "Studio tools vs CRM overlap",
        pain: "Contracts and galleries get forced into CRM.",
        crmHelps:
          "Keep CRM for pipeline and relationships; keep galleries/contracts in studio tools unless integrated.",
      },
    ],
    outcomes: [
      {
        id: "owned-inquiries",
        title: "Owned inquiries",
        description: "Every lead has a next step.",
      },
      {
        id: "more-bookings",
        title: "Fewer lost bookings",
        description: "Follow-ups happen before quotes go cold.",
      },
      {
        id: "warmer-repeats",
        title: "Warmer repeat clients",
        description: "Preferences and history inform outreach.",
      },
      {
        id: "clearer-tools",
        title: "Clearer tool roles",
        description: "CRM and studio software stop duplicating jobs.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts",
        title: "Contacts",
        description: "Clients and brand contacts in one place.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipeline",
        title: "Inquiry / booking pipeline",
        description: "Simple stages to booked shoot.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "tasks",
        title: "Reminders",
        description: "Follow-up dates on open quotes.",
        priority: "must",
      },
      {
        id: "email",
        title: "Email / light automation",
        description: "Sequences that still need a human send judgment.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      { id: "capture", label: "Capture", detail: "Inquiry becomes a lead with source." },
      { id: "qualify", label: "Qualify", detail: "Date, package, and fit confirmed." },
      { id: "quote", label: "Quote", detail: "Proposal sent with follow-up task." },
      { id: "book", label: "Book", detail: "Won booking carries notes into studio tools." },
      { id: "nurture", label: "Nurture", detail: "Post-delivery and referral follow-ups." },
    ],
    ...visuals(
      "photography",
      "photographers",
      "inquiry through quote to booked shoot",
      "Where photography inquiry follow-up breaks — and how CRM helps",
      "A practical inquiry-to-booking loop for photographers",
    ),
    faq: [
      {
        question: "Is a photography studio platform enough without CRM?",
        answer:
          "If inquiries, contracts, and galleries already live in one studio suite you use daily, you may not need a separate CRM. Add CRM when leads and follow-ups are still scattered across DMs and email.",
      },
      {
        question: "What stages should photographers use?",
        answer:
          "Keep them few: new inquiry, consult scheduled, quote sent, booked, delivered/nurture.",
      },
      {
        question: "Should galleries live in the CRM?",
        answer:
          "Usually no — keep delivery galleries in studio tools and store relationship notes in CRM.",
      },
    ],
  },

  coaching: {
    tagline:
      "Nurture coaching leads, track program pipelines, and keep client context without heavy sales admin.",
    overview:
      "Coaching CRM supports lead nurture, discovery-to-enroll pipelines, and ongoing client relationship notes. Course platforms and calendar tools often sit beside CRM.",
    whoThisIsFor:
      "Business, career, and wellness coaches (solo or small teams) who need disciplined follow-up from inquiry to enrolled client.",
    whatMattersIntro:
      "Prioritize contact history, simple enrollment stages, email follow-up, and light automation. Avoid enterprise CRM complexity that coaches will abandon.",
    workedExample:
      "Worked example: a leadership coach. Before CRM, discovery-call follow-ups lived in a notebook. After CRM, every lead has a stage and next touch — weekly reviews start from aging intros.",
    workedExampleSecondary:
      "Worked example: a group-program coach. Before CRM, waitlist interest reset each cohort. After CRM, nurture status and past buyers inform the next launch.",
    glance: {
      primaryGoal: "Lead nurture to enrolled clients",
      commonPriorities: [
        "Contact history",
        "Enrollment pipeline",
        "Follow-up discipline",
        "Light automation",
        "Simple admin",
      ],
      teamTypes: ["Solo coaches", "Small coaching teams", "Assistants / VAs"],
    },
    challenges: [
      {
        id: "nurture-gaps",
        title: "Nurture gaps after discovery calls",
        pain: "Warm leads cool while you deliver for current clients.",
        crmHelps: "Tasks and stages keep follow-ups visible.",
      },
      {
        id: "context-loss",
        title: "Client context is scattered",
        pain: "Goals and notes live across docs and chat.",
        crmHelps: "Relationship notes sit with the contact.",
      },
      {
        id: "launch-chaos",
        title: "Launch lists are rebuilt each time",
        pain: "Cohort outreach starts from cold spreadsheets.",
        crmHelps: "Tags and stages preserve interest across launches.",
      },
      {
        id: "overbuilt",
        title: "Tools feel overbuilt",
        pain: "Enterprise CRM features create admin guilt.",
        crmHelps:
          "Choose lightweight CRM habits first — few stages, one owner, weekly review.",
      },
    ],
    outcomes: [
      {
        id: "owned-leads",
        title: "Owned coaching leads",
        description: "Every inquiry has a next step.",
      },
      {
        id: "smoother-enrolls",
        title: "Smoother enrollments",
        description: "Discovery-to-start stages stay honest.",
      },
      {
        id: "warmer-launches",
        title: "Warmer launches",
        description: "Past interest informs the next cohort outreach.",
      },
      {
        id: "less-admin",
        title: "Less admin guilt",
        description: "A simple system beats an abandoned complex one.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts",
        title: "Contacts",
        description: "Prospects and clients with notes.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipeline",
        title: "Enrollment pipeline",
        description: "Inquiry → discovery → enrolled.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "email",
        title: "Email follow-up",
        description: "Reminders or light sequences.",
        priority: "must",
      },
      {
        id: "automation",
        title: "Light automation",
        description: "Only what you will maintain.",
        priority: "nice",
        href: "/capabilities/workflow-automation/",
      },
    ],
    workflowSteps: [
      { id: "capture", label: "Capture", detail: "Lead enters from form, referral, or content." },
      { id: "nurture", label: "Nurture", detail: "Owned follow-ups until discovery is booked." },
      { id: "discover", label: "Discover", detail: "Call notes and fit decision recorded." },
      { id: "enroll", label: "Enroll", detail: "Won client carries goals into delivery tools." },
      { id: "retain", label: "Retain", detail: "Renewal and referral tasks stay owned." },
    ],
    ...visuals(
      "coaching",
      "coaches",
      "lead nurture through discovery to enrollment",
      "Where coaching follow-up breaks — and how lightweight CRM helps",
      "A practical inquiry-to-enroll loop for coaches",
    ),
    faq: [
      {
        question: "Do coaches need a full sales CRM?",
        answer:
          "Often a lightweight CRM or CRM-plus-email tool is enough. Prioritize adoption: contacts, a few stages, and weekly follow-up discipline.",
      },
      {
        question: "Should session notes live in the CRM?",
        answer:
          "Store relationship and commercial notes in CRM; keep detailed coaching journals in your delivery system if that is where you work daily.",
      },
      {
        question: "What about course platforms?",
        answer:
          "Use course tools for content delivery and CRM for pipeline and relationship ownership — connect them only when the handoff is clear.",
      },
    ],
  },

  "investor-relations": {
    tagline:
      "Own investor and stakeholder outreach with shared contact history — without confusing IR CRM for a fund admin system.",
    overview:
      "Investor-relations CRM supports stakeholder lists, outreach ownership, and relationship history for IR-oriented teams. Cap tables, reporting portals, and fund admin platforms usually remain separate.",
    whoThisIsFor:
      "IR teams at funds or growth companies, capital-formation associates, and relationship managers who coordinate investor outreach and meetings.",
    whatMattersIntro:
      "Prioritize account/contact hierarchy, activity discipline, meeting follow-ups, and permissions. Clarify whether you need private-capital relationship CRM vs advisor CRM vs general enterprise CRM.",
    workedExample:
      "Worked example: a growth-stage IR lead. Before CRM, investor meeting notes lived in personal docs. After CRM, each firm shows last touch, open questions, and next meeting owner.",
    workedExampleSecondary:
      "Worked example: a fund IR associate. Before CRM, LP coverage collided across partners. After CRM, account ownership and activity history reduce duplicate outreach.",
    glance: {
      primaryGoal: "Stakeholder coverage and outreach discipline",
      commonPriorities: [
        "Investor / firm contacts",
        "Outreach ownership",
        "Meeting follow-ups",
        "Permissions",
        "CRM vs IR portals",
      ],
      teamTypes: ["IR leads", "Capital formation", "Partners (light)", "IR associates"],
    },
    challenges: [
      {
        id: "coverage",
        title: "Coverage is tribal",
        pain: "Who owns which investor relationship is unclear.",
        crmHelps: "Account ownership and last-touch history create shared truth.",
      },
      {
        id: "followups",
        title: "Meeting follow-ups slip",
        pain: "Commitments after LP meetings disappear into email.",
        crmHelps: "Tasks and notes attach to the firm record.",
      },
      {
        id: "tool-mix",
        title: "IR portal vs CRM confusion",
        pain: "Teams duplicate reporting and contact data.",
        crmHelps:
          "Keep CRM for relationship outreach; keep portals/admin for reporting distribution.",
      },
      {
        id: "sensitivity",
        title: "Access sensitivity",
        pain: "Notes are either overshared or siloed.",
        crmHelps:
          "Permissions and team boundaries — verify with vendor and policy.",
      },
    ],
    outcomes: [
      {
        id: "shared-coverage",
        title: "Shared investor coverage",
        description: "Owners and last touches are visible.",
      },
      {
        id: "owned-followups",
        title: "Owned meeting follow-ups",
        description: "Next steps survive the calendar invite.",
      },
      {
        id: "clearer-systems",
        title: "Clearer system roles",
        description: "CRM and IR portals stop fighting for contacts.",
      },
      {
        id: "warmer-relationships",
        title: "Warmer stakeholder memory",
        description: "History informs the next outreach.",
      },
    ],
    capabilityNeeds: [
      {
        id: "accounts",
        title: "Accounts & contacts",
        description: "Firms, contacts, and roles.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "relationships",
        title: "Relationship history",
        description: "Meetings, notes, and intro context.",
        priority: "must",
        href: "/capabilities/relationship-management/",
      },
      {
        id: "tasks",
        title: "Tasks",
        description: "Follow-ups after every material meeting.",
        priority: "must",
      },
      {
        id: "permissions",
        title: "Permissions",
        description: "Sensitive note and account visibility.",
        priority: "must",
      },
      {
        id: "pipeline",
        title: "Light pipeline (optional)",
        description: "For capital raises or targeting lists.",
        priority: "nice",
        href: "/capabilities/pipeline-management/",
      },
    ],
    workflowSteps: [
      { id: "map", label: "Map", detail: "Investor firms and contacts enter with owners." },
      { id: "plan", label: "Plan", detail: "Outreach targets and meeting goals set." },
      { id: "meet", label: "Meet", detail: "Notes and commitments logged once." },
      { id: "follow", label: "Follow", detail: "Tasks close the loop after meetings." },
      { id: "maintain", label: "Maintain", detail: "Cadence keeps coverage warm between events." },
    ],
    ...visuals(
      "investor-relations",
      "investor relations",
      "stakeholder coverage, meetings, and follow-ups",
      "Where IR outreach breaks — and how shared CRM ownership helps",
      "A practical map-to-maintain loop for IR teams",
    ),
    faq: [
      {
        question: "Is this the same as a private equity CRM?",
        answer:
          "Related but not identical. PE/VC tools often optimize deal networks; IR work emphasizes ongoing stakeholder coverage and meeting follow-up. Some private-capital CRMs cover both — confirm against your workflow.",
      },
      {
        question: "Should the CRM replace our investor portal?",
        answer:
          "Usually no. Portals distribute reporting; CRM owns relationship outreach and notes. Keep boundaries explicit.",
      },
      {
        question: "What about wealth-advisor CRMs?",
        answer:
          "Advisor CRMs can be a fit when the workflow looks like ongoing client relationship management. Compare against private-capital and general CRM options using your real contact model.",
      },
    ],
  },

  engineering: {
    tagline:
      "Track engineering firm opportunities, client accounts, and proposal handoffs without turning CRM into project delivery.",
    overview:
      "Engineering CRM supports opportunity pipelines, multi-stakeholder client accounts, and proposal follow-up for professional services firms. Project delivery and design tools remain separate.",
    whoThisIsFor:
      "Engineering consultancies, design firms, and professional services sellers who need bid/opportunity visibility and client continuity.",
    whatMattersIntro:
      "Prioritize opportunity stages, account contacts, proposal follow-ups, and a clean handoff into project systems. Verify PM integrations; do not run detailed delivery in CRM.",
    workedExample:
      "Worked example: a civil engineering BD team. Before CRM, RFP deadlines lived in personal calendars. After CRM, every pursuit has a stage, owner, and due date.",
    workedExampleSecondary:
      "Worked example: a project principal. Before CRM, past client preferences were buried in email. After CRM, account notes inform the next proposal team.",
    glance: {
      primaryGoal: "Opportunity clarity and client continuity",
      commonPriorities: [
        "Opportunity stages",
        "Client contacts",
        "Proposal deadlines",
        "Win/loss learning",
        "Handoff to projects",
      ],
      teamTypes: ["BD / marketing", "Principals", "Proposal teams", "Project leads (handoff)"],
    },
    challenges: [
      {
        id: "rfp-deadlines",
        title: "RFP deadlines are tribal",
        pain: "Teams discover due dates too late.",
        crmHelps: "Shared opportunities with due dates and owners.",
      },
      {
        id: "stakeholder-map",
        title: "Client stakeholder maps reset",
        pain: "Proposal teams rebuild who decides each time.",
        crmHelps: "Contacts and roles stay on the account.",
      },
      {
        id: "handoff",
        title: "Won work loses context",
        pain: "Project kickoff rebuilds scope nuances from email.",
        crmHelps: "Won opportunities carry notes into kickoff.",
      },
      {
        id: "pm-blur",
        title: "CRM vs PM software blur",
        pain: "Schedules and deliverables get forced into CRM.",
        crmHelps:
          "Keep CRM for pursuits and relationships; keep delivery in PM tools.",
      },
    ],
    outcomes: [
      {
        id: "visible-pursuits",
        title: "Visible pursuits",
        description: "Open RFPs and proposals are reviewable.",
      },
      {
        id: "client-memory",
        title: "Stronger client memory",
        description: "Stakeholders and preferences inform the next bid.",
      },
      {
        id: "cleaner-kickoffs",
        title: "Cleaner project kickoffs",
        description: "Won-bid context reaches delivery teams.",
      },
      {
        id: "win-loss",
        title: "Better win/loss learning",
        description: "Reason codes become usable over time.",
      },
    ],
    capabilityNeeds: [
      {
        id: "pipeline",
        title: "Opportunity pipeline",
        description: "Stages from chase to submit to award.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "accounts",
        title: "Accounts & contacts",
        description: "Owners, consultants, and agency contacts.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "tasks",
        title: "Tasks & due dates",
        description: "Proposal deadlines on every pursuit.",
        priority: "must",
      },
      {
        id: "custom",
        title: "Flexible processes",
        description: "Configurable stages for different pursuit types.",
        priority: "nice",
      },
      {
        id: "integrations",
        title: "PM integrations",
        description: "Verify; keep delivery systems separate.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      { id: "capture", label: "Capture", detail: "Lead or RFP becomes an opportunity." },
      { id: "qualify", label: "Qualify", detail: "Go/no-go and pursuit owner decided." },
      { id: "propose", label: "Propose", detail: "Stages through submit and interview." },
      { id: "award", label: "Award", detail: "Won/lost reasons recorded." },
      { id: "hand-off", label: "Hand off", detail: "Notes and contacts enter project kickoff." },
    ],
    ...visuals(
      "engineering",
      "engineering firms",
      "opportunity pipeline through proposal and project handoff",
      "Where engineering pursuit follow-up breaks — and how CRM helps",
      "A practical chase-to-kickoff loop for engineering firms",
    ),
    faq: [
      {
        question: "Should project schedules live in the CRM?",
        answer:
          "Generally no. Use CRM for pursuits and client relationships; keep schedules and deliverables in project tools.",
      },
      {
        question: "What win/loss fields help engineering firms?",
        answer:
          "A short list the team will complete — price, relationship, capacity, scope fit, team credentials.",
      },
      {
        question: "Do we need heavy customization?",
        answer:
          "Only if pursuit types truly differ. Start with shared stages and add fields when Friday reviews prove a gap.",
      },
    ],
  },

  music: {
    tagline:
      "Track venues, bookers, fans, and collaboration contacts without forcing touring logistics into CRM.",
    overview:
      "Music CRM supports relationship follow-up with venues, bookers, collaborators, and high-value fans or patrons. Tour routing and ticketing usually live elsewhere.",
    whoThisIsFor:
      "Independent musicians, managers, and small label/ops helpers who need owned follow-up across bookings and partnerships.",
    whatMattersIntro:
      "Prioritize contacts, simple opportunity stages for bookings, and activity reminders. Keep ticketing and routing in specialist tools.",
    workedExample:
      "Worked example: an indie act’s manager. Before CRM, booker follow-ups lived in texts. After CRM, every venue outreach has a stage and next date.",
    workedExampleSecondary:
      "Worked example: a session musician. Before CRM, collaborator contacts reset each project. After CRM, relationship notes inform the next booking ask.",
    glance: {
      primaryGoal: "Booking and relationship follow-through",
      commonPriorities: [
        "Venue / booker contacts",
        "Booking stages",
        "Follow-up reminders",
        "Collaborator history",
        "CRM vs touring tools",
      ],
      teamTypes: ["Artists", "Managers", "Booking helpers"],
    },
    challenges: [
      {
        id: "booker-fog",
        title: "Booker outreach is ad hoc",
        pain: "No view of who was pitched and when.",
        crmHelps: "Shared stages and last-touch history.",
      },
      {
        id: "venue-memory",
        title: "Venue preferences reset",
        pain: "Past show notes never reach the next ask.",
        crmHelps: "Account notes sit with the venue contact.",
      },
      {
        id: "tool-blur",
        title: "Touring tools vs CRM blur",
        pain: "Routing and tickets get forced into CRM.",
        crmHelps:
          "Keep CRM for relationships; keep routing/ticketing in tour tools.",
      },
      {
        id: "solo-admin",
        title: "Solo admin collapses on the road",
        pain: "Follow-ups die during tour weeks.",
        crmHelps: "Simple stages and reminders survive busy stretches.",
      },
    ],
    outcomes: [
      {
        id: "owned-outreach",
        title: "Owned booking outreach",
        description: "Every pitch has a next step.",
      },
      {
        id: "venue-memory",
        title: "Stronger venue memory",
        description: "Past shows inform the next ask.",
      },
      {
        id: "warmer-collabs",
        title: "Warmer collaborator network",
        description: "People history is searchable.",
      },
      {
        id: "clear-tools",
        title: "Clearer tool roles",
        description: "CRM and touring software stop overlapping.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts",
        title: "Contacts",
        description: "Venues, bookers, collaborators, patrons.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipeline",
        title: "Booking pipeline",
        description: "Pitched → negotiating → confirmed.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "tasks",
        title: "Reminders",
        description: "Follow-ups that survive tour weeks.",
        priority: "must",
      },
      {
        id: "mobile",
        title: "Mobile access",
        description: "Update notes on the road.",
        priority: "nice",
        href: "/capabilities/mobile/",
      },
    ],
    workflowSteps: [
      { id: "capture", label: "Capture", detail: "Venue or booker contact enters with context." },
      { id: "pitch", label: "Pitch", detail: "Outreach logged with date and materials." },
      { id: "negotiate", label: "Negotiate", detail: "Stages track holds and offers." },
      { id: "confirm", label: "Confirm", detail: "Won date carries notes into touring tools." },
      { id: "nurture", label: "Nurture", detail: "Post-show thanks and rebook tasks." },
    ],
    ...visuals(
      "music",
      "musicians",
      "venue outreach through booking confirmation",
      "Where music booking follow-up breaks — and how CRM helps",
      "A practical pitch-to-confirm loop for musicians and managers",
    ),
    faq: [
      {
        question: "Do musicians need CRM or a touring platform?",
        answer:
          "Touring platforms excel at routing and holds; CRM helps when relationship follow-up and contact history are the gap. Many acts use both with clear boundaries.",
      },
      {
        question: "Should fan mailing lists live in CRM?",
        answer:
          "Large fan email lists often belong in an email tool. Use CRM for high-value relationships (venues, bookers, collaborators, patrons).",
      },
      {
        question: "What is a minimal booking pipeline?",
        answer:
          "Pitched, waiting, negotiating, confirmed, passed — with a next date on every open row.",
      },
    ],
  },

  "web-design": {
    tagline:
      "Run web-design prospect pipelines and client handoffs without turning CRM into a project board.",
    overview:
      "Web-design CRM supports prospecting, proposal pipelines, and client relationship context for freelancers and studios. Design project delivery usually lives in PM or design tools.",
    whoThisIsFor:
      "Freelance designers, boutique studios, and small agency sellers who need owned follow-up from inquiry to signed project.",
    whatMattersIntro:
      "Prioritize inquiry stages, proposal follow-up, client contacts, and a clean handoff into delivery tools. Avoid stuffing sprint tasks into CRM.",
    workedExample:
      "Worked example: a two-person studio. Before CRM, proposal follow-ups lived in Gmail. After CRM, every prospect has a stage and next touch — Monday reviews start from aging quotes.",
    workedExampleSecondary:
      "Worked example: a freelance designer. Before CRM, past client preferences were scattered. After CRM, account notes inform upsell and maintenance outreach.",
    glance: {
      primaryGoal: "Prospect-to-signed-project follow-through",
      commonPriorities: [
        "Inquiry pipeline",
        "Proposal follow-up",
        "Client history",
        "Sales-to-delivery handoff",
        "CRM vs PM tools",
      ],
      teamTypes: ["Freelancers", "Studio leads", "Account / PM (handoff)"],
    },
    challenges: [
      {
        id: "quote-lag",
        title: "Proposal follow-ups lag",
        pain: "Quotes expire while you deliver for other clients.",
        crmHelps: "Stages and reminders keep aging proposals visible.",
      },
      {
        id: "scope-amnesia",
        title: "Client context resets",
        pain: "Past decisions never reach the next project conversation.",
        crmHelps: "Notes and stakeholders sit on the account.",
      },
      {
        id: "handoff",
        title: "Sales-to-delivery drops",
        pain: "Kickoffs rebuild requirements from email threads.",
        crmHelps: "Won deals carry scope notes into PM tools.",
      },
      {
        id: "pm-blur",
        title: "CRM vs project tools blur",
        pain: "Tasks and timelines duplicate across systems.",
        crmHelps:
          "Keep CRM for pipeline and relationships; keep delivery in PM/design tools.",
      },
    ],
    outcomes: [
      {
        id: "owned-pipeline",
        title: "Owned prospect pipeline",
        description: "Every inquiry has a next step.",
      },
      {
        id: "faster-closes",
        title: "Fewer cold proposals",
        description: "Follow-ups happen before quotes expire.",
      },
      {
        id: "cleaner-kickoffs",
        title: "Cleaner kickoffs",
        description: "Won work carries context into delivery.",
      },
      {
        id: "warmer-retainers",
        title: "Warmer retainer outreach",
        description: "Past clients are easy to re-engage.",
      },
    ],
    capabilityNeeds: [
      {
        id: "pipeline",
        title: "Prospect pipeline",
        description: "Inquiry → proposal → signed.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "contacts",
        title: "Contacts & accounts",
        description: "Clients and stakeholders.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "tasks",
        title: "Follow-up tasks",
        description: "Next touches on open proposals.",
        priority: "must",
      },
      {
        id: "email",
        title: "Email sync",
        description: "Especially for Google Workspace teams.",
        priority: "nice",
      },
      {
        id: "projects",
        title: "Light project link (optional)",
        description: "Only if you need CRM+light PM — else keep PM separate.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      { id: "capture", label: "Capture", detail: "Inquiry becomes a prospect with source." },
      { id: "qualify", label: "Qualify", detail: "Fit, budget band, and timeline confirmed." },
      { id: "propose", label: "Propose", detail: "Proposal sent with follow-up task." },
      { id: "sign", label: "Sign", detail: "Won project carries notes into delivery tools." },
      { id: "retain", label: "Retain", detail: "Maintenance and expansion outreach owned." },
    ],
    ...visuals(
      "web-design",
      "web designers",
      "prospect pipeline through proposal and project handoff",
      "Where web-design sales follow-up breaks — and how CRM helps",
      "A practical inquiry-to-signed-project loop for web designers",
    ),
    faq: [
      {
        question: "Should design tasks live in the CRM?",
        answer:
          "Usually no. Use CRM for prospects and client relationships; keep tasks and timelines in project or design tools.",
      },
      {
        question: "Is an all-in-one CRM+PM tool better?",
        answer:
          "It can help tiny studios that refuse two systems — only if the team will actually update it. Many freelancers prefer a simple CRM plus a separate PM board.",
      },
      {
        question: "What stages work for web design sales?",
        answer:
          "New inquiry, discovery booked, proposal sent, negotiating, signed, retained/nurture.",
      },
    ],
  },

  "security-companies": {
    tagline:
      "Run B2B security sales pipelines and account coverage with clear ownership — without confusing CRM for guard management systems.",
    overview:
      "Security-company CRM supports B2B opportunity pipelines, multi-site account contacts, and renewal/expansion follow-up. Guard scheduling and incident systems remain operations tools.",
    whoThisIsFor:
      "Security service companies selling guarding, systems, or monitoring to commercial accounts — sales managers and account executives who need pipeline and account discipline.",
    whatMattersIntro:
      "Prioritize opportunity stages, account hierarchies (sites/contacts), activity ownership, and permissions. Keep workforce scheduling and incident management outside CRM unless integrated on purpose.",
    workedExample:
      "Worked example: a regional guarding sales team. Before CRM, RFP responses lived in email. After CRM, every pursuit has a stage, owner, and decision date.",
    workedExampleSecondary:
      "Worked example: an account manager covering multi-site clients. Before CRM, site contacts reset every renewal. After CRM, account maps show stakeholders and open expansions.",
    glance: {
      primaryGoal: "B2B pipeline and account coverage",
      commonPriorities: [
        "Opportunity stages",
        "Multi-site accounts",
        "Activity ownership",
        "Renewals / expansion",
        "CRM vs ops systems",
      ],
      teamTypes: ["Sales", "Account management", "Sales ops", "Leadership"],
    },
    challenges: [
      {
        id: "rfp-fog",
        title: "RFP status is unclear",
        pain: "Teams cannot see what is due without a meeting.",
        crmHelps: "Shared stages and due dates make pursuits reviewable.",
      },
      {
        id: "site-map",
        title: "Multi-site contacts fragment",
        pain: "Renewals miss the right stakeholder.",
        crmHelps: "Account hierarchies hold sites and roles.",
      },
      {
        id: "ops-blur",
        title: "CRM vs guard ops confusion",
        pain: "Schedules and incidents get forced into CRM.",
        crmHelps:
          "Keep CRM for sales and accounts; keep workforce/incident tools for ops.",
      },
      {
        id: "renewal-drift",
        title: "Renewals drift",
        pain: "Expansion conversations start too late.",
        crmHelps: "Renewal dates and tasks sit on the account.",
      },
    ],
    outcomes: [
      {
        id: "pipeline-visibility",
        title: "Visible sales pipeline",
        description: "Open pursuits have owners and stages.",
      },
      {
        id: "account-memory",
        title: "Stronger account memory",
        description: "Sites and stakeholders survive staff changes.",
      },
      {
        id: "renewal-discipline",
        title: "Better renewal discipline",
        description: "Dates and next steps are reviewable.",
      },
      {
        id: "clear-systems",
        title: "Clearer system boundaries",
        description: "Sales CRM and ops platforms stop overlapping.",
      },
    ],
    capabilityNeeds: [
      {
        id: "pipeline",
        title: "Sales pipeline",
        description: "Stages from lead to awarded contract.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "accounts",
        title: "Accounts & contacts",
        description: "Companies, sites, and stakeholders.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "activities",
        title: "Activity discipline",
        description: "Calls, meetings, and next steps logged.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Forecast / pipeline reporting",
        description: "Leadership views without spreadsheet rebuilds.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "permissions",
        title: "Permissions",
        description: "Team and account visibility controls.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      { id: "capture", label: "Capture", detail: "Lead or RFP becomes an opportunity." },
      { id: "qualify", label: "Qualify", detail: "Sites, scope, and decision process mapped." },
      { id: "propose", label: "Propose", detail: "Proposal stages and stakeholders tracked." },
      { id: "award", label: "Award", detail: "Won contract carries contacts into onboarding." },
      { id: "expand", label: "Expand", detail: "Renewal and expansion tasks stay owned." },
    ],
    ...visuals(
      "security-companies",
      "security companies",
      "B2B opportunity pipeline and multi-site account coverage",
      "Where security-company sales follow-up breaks — and how CRM helps",
      "A practical pursue-to-expand loop for security sales teams",
    ),
    faq: [
      {
        question: "Should guard scheduling live in the CRM?",
        answer:
          "Generally no. Use CRM for sales and account relationships; keep scheduling and incident management in operations systems.",
      },
      {
        question: "Is there a security-industry CRM we must buy?",
        answer:
          "Many security companies succeed with mid-market or enterprise general CRMs configured for multi-site accounts. Choose vertical ops suites when workforce management is the primary need — that is a different buying decision than CRM.",
      },
      {
        question: "What account fields matter most?",
        answer:
          "Sites, primary stakeholders, contract end dates, and open expansion opportunities — kept short enough the team will maintain them.",
      },
    ],
  },
};
