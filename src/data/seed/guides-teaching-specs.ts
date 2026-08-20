export type TeachingShape = {
  id: string;
  title: string;
  bestFor: string;
  avoidWhen: string;
};

export type TeachingLoopStep = { id: string; label: string; short: string };

export type TeachingSpec = {
  categorySlug: string;
  name: string;
  bestSlug: string;
  whatIsSlug: string;
  howToChooseSlug: string;
  pricingSlug: string;
  requirementsSlug?: string;
  evaluationSlug?: string;
  loop: TeachingLoopStep[];
  loopBody: string;
  loopExample: string;
  loopTip: string;
  shapes: TeachingShape[];
  vs: {
    slug: string;
    otherName: string;
    otherCategory: string;
    otherGuideSlug: string;
    difference: string;
    whenThis: string;
    whenOther: string;
  };
  includeReqEval?: boolean;
  omitVs?: boolean;
};

export const TEACHING_SPECS: TeachingSpec[] = [
  {
    categorySlug: "email-marketing",
    name: "email marketing software",
    bestSlug: "email-marketing-software",
    whatIsSlug: "what-is-email-marketing",
    howToChooseSlug: "how-to-choose-email-marketing",
    pricingSlug: "email-marketing-pricing-guide",
    requirementsSlug: "email-marketing-requirements-guide",
    evaluationSlug: "email-marketing-evaluation-guide",
    loop: [
      { id: "list", label: "List", short: "Consent & subscribers" },
      { id: "create", label: "Create", short: "Templates & copy" },
      { id: "segment", label: "Segment", short: "Who gets what" },
      { id: "send", label: "Send", short: "Campaigns & journeys" },
      { id: "measure", label: "Measure", short: "Clicks & revenue" },
      { id: "deliver", label: "Deliver", short: "Auth & reputation" },
    ],
    loopBody:
      "An ESP repeats a permission-based loop: grow and clean a subscriber list, compose, segment, send campaigns or automations, measure, then protect deliverability.",
    loopExample:
      "Example: Northline Goods (DTC accessories, three marketers) runs a Friday newsletter plus cart-abandon journeys. They capture signups on the store, segment by last purchase, and treat unsubscribes as a first-class list — not a CRM pipeline stage.",
    loopTip:
      "If you cannot name the consent source for a list, pause sending before you buy more contacts.",
    shapes: [
      {
        id: "newsletter",
        title: "Newsletter / campaign ESP",
        bestFor: "Recurring newsletters and scheduled campaigns with templates.",
        avoidWhen: "The core job is multi-step behavioral journeys or cold outbound.",
      },
      {
        id: "automation",
        title: "Automation-led ESP",
        bestFor: "Event-triggered journeys (welcome, abandon, winback) as the weekly product.",
        avoidWhen: "You only need a monthly newsletter and will not maintain workflows.",
      },
      {
        id: "ecommerce",
        title: "Ecommerce ESP",
        bestFor: "Store-synced catalogs, revenue events, and checkout-triggered email.",
        avoidWhen: "You have no storefront events and the job is B2B newslettering.",
      },
      {
        id: "deliverability",
        title: "Deliverability / list hygiene (adjacent)",
        bestFor: "Verification and inbox placement as a supporting tool next to an ESP.",
        avoidWhen: "You treat a verifier as a substitute for campaigns and consent.",
      },
    ],
    vs: {
      slug: "email-marketing-vs-crm",
      otherName: "CRM",
      otherCategory: "crm",
      otherGuideSlug: "what-is-crm",
      difference:
        "Email marketing software sends permission-based campaigns to subscribers. A CRM is the sales system of record for people, companies, deals, and activity history.",
      whenThis:
        "The blocking job is newsletters, campaigns, or automations to opted-in lists.",
      whenOther:
        "The blocking job is pipeline ownership, follow-ups, and shared deal history.",
    },
  },
  {
    categorySlug: "business-communications",
    name: "business communications software",
    bestSlug: "business-communications-software",
    whatIsSlug: "what-is-business-communications-software",
    howToChooseSlug: "how-to-choose-business-communications-software",
    pricingSlug: "business-communications-pricing-guide",
    requirementsSlug: "business-communications-requirements-guide",
    evaluationSlug: "business-communications-evaluation-guide",
    loop: [
      { id: "number", label: "Number", short: "DID / sender ID" },
      { id: "route", label: "Route", short: "IVR & queues" },
      { id: "converse", label: "Converse", short: "Voice or messaging" },
      { id: "own", label: "Own", short: "Who answers" },
      { id: "log", label: "Log", short: "CRM / notes" },
      { id: "review", label: "Review", short: "QA & reporting" },
    ],
    loopBody:
      "Business communications products own the conversation path: provision a number or channel, route, have a human (or bot) reply, assign ownership, log into CRM, then review quality.",
    loopExample:
      "Example: Harbor Clinics (eight front-desk staff) needs missed-call callbacks on a published business number. A cloud phone with voicemail-to-task beats a WhatsApp inbox they do not staff.",
    loopTip:
      "Write whether customers call, message, or both — phone, WhatsApp, and Slack are different purchases.",
    shapes: [
      {
        id: "phone",
        title: "Cloud phone / VoIP",
        bestFor: "Published business numbers, call routing, voicemail, and click-to-dial.",
        avoidWhen: "The job is ticket SLAs or WhatsApp-first support without a phone core.",
      },
      {
        id: "messaging",
        title: "Customer messaging",
        bestFor: "WhatsApp / SMS / chat where replies need a shared owner.",
        avoidWhen: "You need PSTN calling, IVR, and number porting as the core product.",
      },
      {
        id: "ccaas",
        title: "Contact centre / CCaaS",
        bestFor: "Queues, WFM, and omnichannel agent work at contact-centre depth.",
        avoidWhen: "A five-person team that only needs a business number and voicemail.",
      },
      {
        id: "team-chat",
        title: "Internal team chat",
        bestFor: "Employee collaboration — not customer ticket queues.",
        avoidWhen: "Customers need owned conversations with SLAs (that is helpdesk or messaging).",
      },
    ],
    vs: {
      slug: "business-communications-vs-customer-service",
      otherName: "customer service software",
      otherCategory: "customer-service",
      otherGuideSlug: "what-is-customer-service-software",
      difference:
        "Business communications owns numbers, routing, and live conversations. Customer service software owns tickets, SLAs, knowledge bases, and helpdesk queues.",
      whenThis:
        "The blocking job is a business phone number, IVR, WhatsApp ownership, or team chat.",
      whenOther:
        "The blocking job is owned tickets, SLAs, macros, or a customer-facing knowledge base.",
    },
  },
  {
    categorySlug: "hr",
    name: "HR software",
    bestSlug: "hr-software",
    whatIsSlug: "what-is-hr-software",
    howToChooseSlug: "how-to-choose-hr-software",
    pricingSlug: "hr-pricing-guide",
    requirementsSlug: "hr-requirements-guide",
    evaluationSlug: "hr-evaluation-guide",
    loop: [
      { id: "hire", label: "Hire", short: "ATS stages" },
      { id: "record", label: "Record", short: "HRIS of record" },
      { id: "pay", label: "Pay", short: "Payroll / benefits" },
      { id: "schedule", label: "Schedule", short: "Shifts & publish" },
      { id: "clock", label: "Clock", short: "Time & attendance" },
      { id: "train", label: "Train", short: "SOPs & LMS" },
    ],
    loopBody:
      "HR platforms specialise inside a people loop: attract and stage candidates, keep an employee record, run payroll/benefits, publish shifts, capture attendance, and deliver training.",
    loopExample:
      "Example: Harbor Retail (40 people, three sites) starts with GPS clock-in because managers still rebuild weeks in spreadsheets — then adds scheduling. They do not buy an ATS until hiring volume actually blocks them.",
    loopTip:
      "Name the weekly people ritual first. ATS, WFM, payroll, and LMS fail for different reasons.",
    shapes: [
      {
        id: "ats",
        title: "Applicant tracking (ATS)",
        bestFor: "Hiring pipelines, job boards, and interview stages with named owners.",
        avoidWhen: "The blocking job is shifts, clock-in, or payroll — not recruiting.",
      },
      {
        id: "hris",
        title: "Core HRIS / people record",
        bestFor: "Employee system of record, documents, and org data.",
        avoidWhen: "You only need a time clock or a course academy.",
      },
      {
        id: "payroll",
        title: "Payroll / benefits",
        bestFor: "Pay runs, tax filings, and benefits admin as the HR buyer job.",
        avoidWhen: "You need ATS or WFM and payroll is already handled elsewhere.",
      },
      {
        id: "wfm",
        title: "Frontline WFM / time",
        bestFor: "Shift publish, mobile tasks, GPS/geofence clock-in.",
        avoidWhen: "A desk-based team whose pain is candidate pipelines, not rotas.",
      },
      {
        id: "lms",
        title: "SOP training / LMS",
        bestFor: "Playbooks, completion tracking, or an internal academy.",
        avoidWhen: "You need hiring or clock-in and will not run a learning programme.",
      },
    ],
    vs: {
      slug: "hr-software-vs-crm",
      otherName: "CRM",
      otherCategory: "crm",
      otherGuideSlug: "what-is-crm",
      difference:
        "HR software owns hiring, employee records, payroll, shifts, attendance, or training. A CRM owns customer pipeline and sales activity — not people operations.",
      whenThis: "The blocking job is candidates, employees, shifts, pay, or learning.",
      whenOther: "The blocking job is deals, follow-ups, and customer history.",
    },
  },
  {
    categorySlug: "project-management",
    name: "project management software",
    bestSlug: "project-management-software",
    whatIsSlug: "what-is-project-management-software",
    howToChooseSlug: "how-to-choose-project-management-software",
    pricingSlug: "project-management-pricing-guide",
    requirementsSlug: "project-management-requirements-guide",
    evaluationSlug: "project-management-evaluation-guide",
    loop: [
      { id: "capture", label: "Capture", short: "Work into a board" },
      { id: "own", label: "Own", short: "Named assignee" },
      { id: "plan", label: "Plan", short: "Dates / Gantt" },
      { id: "update", label: "Update", short: "Status in the tool" },
      { id: "review", label: "Review", short: "Weekly from the board" },
      { id: "automate", label: "Automate", short: "Handoffs" },
    ],
    loopBody:
      "Work OS tools run a shared ownership loop: capture work, assign an owner, plan dates, update status in the tool, review from the board, then automate only after the loop holds.",
    loopExample:
      "Example: Harbor Studio (12-person agency) moved client work off a founder spreadsheet. Friday reviews now open the board, not Slack search. A PDF editor or remote-desktop tool would not have fixed ownership.",
    loopTip:
      "If managers accept verbal status, the work OS will never become the system of record.",
    shapes: [
      {
        id: "work-os",
        title: "Work OS / boards",
        bestFor: "Shared tasks, owners, and status across a team.",
        avoidWhen: "The job is PDF markup, remote support, or slide Gantts only.",
      },
      {
        id: "timeline",
        title: "Timeline / Gantt / PMO",
        bestFor: "Dependencies, milestones, and portfolio dates.",
        avoidWhen: "A lightweight personal task list is enough.",
      },
      {
        id: "docs",
        title: "Docs-first / wiki hybrid",
        bestFor: "Specs and tasks living together.",
        avoidWhen: "You need workload and Gantt as the core product.",
      },
      {
        id: "adjacent",
        title: "Adjacent specialists",
        bestFor: "PDF, remote desktop, or PowerPoint Gantt as a side job.",
        avoidWhen: "You rank them as if they were Work OS peers.",
      },
    ],
    vs: {
      slug: "project-management-vs-crm",
      otherName: "CRM",
      otherCategory: "crm",
      otherGuideSlug: "what-is-crm",
      difference:
        "Project management software owns internal work, owners, and dates. A CRM owns customers, deals, and sales activity.",
      whenThis: "The blocking job is shared work status and delivery.",
      whenOther: "The blocking job is pipeline, follow-ups, and customer records.",
    },
  },
  {
    categorySlug: "marketing",
    name: "marketing software",
    bestSlug: "marketing-software",
    whatIsSlug: "what-is-marketing-software",
    howToChooseSlug: "how-to-choose-marketing-software",
    pricingSlug: "marketing-software-pricing-guide",
    requirementsSlug: "marketing-software-requirements-guide",
    evaluationSlug: "marketing-software-evaluation-guide",
    loop: [
      { id: "plan", label: "Plan", short: "Calendar / brief" },
      { id: "create", label: "Create", short: "Asset or page" },
      { id: "approve", label: "Approve", short: "Brand / legal" },
      { id: "publish", label: "Publish", short: "Channel or funnel" },
      { id: "listen", label: "Listen", short: "Mentions / replies" },
      { id: "measure", label: "Measure", short: "UTM & reports" },
    ],
    loopBody:
      "Marketing tools implement a campaign loop: plan, create, approve, publish (or launch a funnel), listen or triage replies, then measure. Schedulers, funnel builders, MAP, and listening suites each own different steps.",
    loopExample:
      "Example: Harbor Creative wrote “three social channels publish from one calendar this month.” That sentence ruled out listening-only suites before demos started.",
    loopTip:
      "If two jobs are blocking, buy for the one that creates the most rework this quarter.",
    shapes: [
      {
        id: "scheduler",
        title: "Social scheduling",
        bestFor: "Queued posts, approvals, and a shared calendar.",
        avoidWhen: "The job is mention intelligence or lifecycle MAP journeys.",
      },
      {
        id: "funnel",
        title: "Funnels / landing pages",
        bestFor: "Campaign pages with checkout or lead capture.",
        avoidWhen: "You only need a social calendar or a permission-based ESP.",
      },
      {
        id: "map",
        title: "MAP / lifecycle automation",
        bestFor: "Multi-step journeys on a person record across channels.",
        avoidWhen: "A newsletter ESP or a page builder is the actual weekly job.",
      },
      {
        id: "listening",
        title: "Social listening / PR intel",
        bestFor: "Mention triage, media monitoring, and coverage alerts.",
        avoidWhen: "You need to publish posts — listening is not a scheduler.",
      },
      {
        id: "webinar",
        title: "Webinars / live video",
        bestFor: "Hosted rooms, registration, and replay as the product job.",
        avoidWhen: "You try to rank them as incomplete MAP suites.",
      },
    ],
    vs: {
      slug: "marketing-vs-email-marketing",
      otherName: "email marketing software",
      otherCategory: "email-marketing",
      otherGuideSlug: "what-is-email-marketing",
      difference:
        "Marketing software here is social, funnels, MAP, listening, and webinars. Email marketing (ESP) is the permission-based campaign layer — a sibling category, not a Hootsuite or ClickFunnels peer.",
      whenThis:
        "The blocking job is scheduling, funnels, MAP, listening, or webinars.",
      whenOther:
        "The blocking job is opted-in campaigns, newsletters, and ESP automations.",
    },
  },
  {
    categorySlug: "customer-service",
    name: "customer service software",
    bestSlug: "customer-service-software",
    whatIsSlug: "what-is-customer-service-software",
    howToChooseSlug: "how-to-choose-customer-service-software",
    pricingSlug: "customer-service-pricing-guide",
    requirementsSlug: "customer-service-requirements-guide",
    evaluationSlug: "customer-service-evaluation-guide",
    loop: [
      { id: "intake", label: "Intake", short: "Email, chat, form" },
      { id: "ticket", label: "Ticket", short: "Owner & SLA" },
      { id: "reply", label: "Reply", short: "Macros / chat" },
      { id: "deflect", label: "Deflect", short: "Help articles" },
      { id: "escalate", label: "Escalate", short: "Routing" },
      { id: "close", label: "Close", short: "CSAT & report" },
    ],
    loopBody:
      "Support platforms turn conversations into owned work: intake, ticket or chat session, reply, deflect repeats with docs, escalate, then close with reporting. Helpdesk, live chat, ecommerce inboxes, and ITSM each emphasise different steps.",
    loopExample:
      "Example: Harbor Shop starts with live chat for pre-purchase questions, then adds an ecommerce helpdesk when refund tickets outgrow the messenger — without buying an ITSM suite.",
    loopTip:
      "Write the weekly outcome (“every email has an owner and an SLA”) before you compare brands.",
    shapes: [
      {
        id: "helpdesk",
        title: "Helpdesk / ticketing",
        bestFor: "Owned email tickets, SLAs, and macros.",
        avoidWhen: "You only need a website messenger or an ITIL change calendar.",
      },
      {
        id: "chat",
        title: "Live chat",
        bestFor: "Website visitors who need a reply in the moment.",
        avoidWhen: "The volume is email tickets with SLAs, not live presence.",
      },
      {
        id: "ecommerce",
        title: "Ecommerce helpdesk",
        bestFor: "Shopify/Magento order and refund context in the agent workspace.",
        avoidWhen: "B2B ticketing with no storefront orders.",
      },
      {
        id: "itsm",
        title: "ITSM / service desk",
        bestFor: "Employee incidents, changes, and a service catalog.",
        avoidWhen: "External customer refunds on a storefront.",
      },
    ],
    omitVs: true,
    vs: {
      slug: "crm-vs-customer-service-software",
      otherName: "CRM",
      otherCategory: "crm",
      otherGuideSlug: "what-is-crm",
      difference:
        "Customer service software owns tickets, chat, docs, and SLAs. A CRM owns revenue pipeline. They integrate; they are not substitutes.",
      whenThis: "The blocking job is conversations, tickets, or deflection.",
      whenOther: "The blocking job is deals, stages, and sales activity.",
    },
  },
  {
    categorySlug: "ai",
    name: "AI software",
    bestSlug: "ai-software",
    whatIsSlug: "what-is-ai-software",
    howToChooseSlug: "how-to-choose-ai-software",
    pricingSlug: "ai-pricing-guide",
    requirementsSlug: "ai-requirements-guide",
    evaluationSlug: "ai-evaluation-guide",
    loop: [
      { id: "job", label: "Job", short: "Weekly output" },
      { id: "prompt", label: "Prompt", short: "Context in" },
      { id: "generate", label: "Generate", short: "Draft / media" },
      { id: "review", label: "Review", short: "Human gate" },
      { id: "govern", label: "Govern", short: "Privacy / logs" },
      { id: "ship", label: "Ship", short: "Into the stack" },
    ],
    loopBody:
      "AI products are usable when the loop is explicit: name the weekly output, provide context, generate, review with a human, apply governance, then ship into the real stack (docs, IDE, ads, or workflow).",
    loopExample:
      "Example: Harbor Legal needs meeting notes with a retention policy — not an image generator and not an ungoverned consumer chatbot pasted into client files.",
    loopTip:
      "Microsoft 365 Copilot, GitHub Copilot, ChatGPT, and Zapier are different jobs. Do not rank them as one #1.",
    shapes: [
      {
        id: "llm",
        title: "LLM assistant",
        bestFor: "Multi-turn reasoning, writing, and Q&A with a model.",
        avoidWhen: "The job is IDE completions or GPU-hour video renders.",
      },
      {
        id: "coding",
        title: "AI coding",
        bestFor: "Inline completions and AI-native editors.",
        avoidWhen: "You need a general LLM for non-code work as the core purchase.",
      },
      {
        id: "media",
        title: "Image / video / voice / meeting",
        bestFor: "Stills, video, TTS, or transcripts as the weekly output.",
        avoidWhen: "You buy them as if they were ChatGPT peers on coding quality.",
      },
      {
        id: "automation",
        title: "Agents / workflow automation",
        bestFor: "Multi-app triggers with AI steps, or an agent builder.",
        avoidWhen: "A single chat window is the actual job.",
      },
    ],
    vs: {
      slug: "ai-software-vs-customer-service",
      otherName: "customer service software",
      otherCategory: "customer-service",
      otherGuideSlug: "what-is-customer-service-software",
      difference:
        "AI software here is LLM, coding, media, meeting, and agent/automation jobs. A helpdesk may include AI assist, but ticketing and SLAs are still a customer-service purchase.",
      whenThis:
        "The blocking job is generation, coding assist, media, notes, or AI workflows.",
      whenOther:
        "The blocking job is owned tickets, SLAs, and support inboxes — AI is an add-on, not the core.",
    },
  },
  {
    categorySlug: "it-development",
    name: "IT and development software",
    bestSlug: "it-development-software",
    whatIsSlug: "what-is-it-development-software",
    howToChooseSlug: "how-to-choose-it-development-software",
    pricingSlug: "it-development-pricing-guide",
    requirementsSlug: "it-development-requirements-guide",
    evaluationSlug: "it-development-evaluation-guide",
    loop: [
      { id: "detect", label: "Detect", short: "Signal or ticket" },
      { id: "triage", label: "Triage", short: "Severity / owner" },
      { id: "fix", label: "Fix", short: "Change / deploy" },
      { id: "observe", label: "Observe", short: "Metrics / traces / logs" },
      { id: "page", label: "Page", short: "On-call" },
      { id: "review", label: "Review", short: "Post-incident" },
    ],
    loopBody:
      "IT and development tools sit on different parts of the same reliability loop: detect, triage, change, observe, page a human, then review. ITSM, observability, on-call, git/CI, and hosting are not one peer ranking.",
    loopExample:
      "Example: Harbor Platform pages on-call for checkout 5xx. Datadog-class observability is not a substitute for PagerDuty-class paging, and Jira Service Management is not Jira Software.",
    loopTip:
      "Name the weekly ritual: employee tickets, ingest/metrics, paging, git, or hosting.",
    shapes: [
      {
        id: "itsm",
        title: "ITSM / service desk",
        bestFor: "Employee incidents, changes, and a catalog.",
        avoidWhen: "You need traces and logs, or a git host.",
      },
      {
        id: "obs",
        title: "Observability / monitoring",
        bestFor: "Metrics, traces, logs, or error monitoring.",
        avoidWhen: "The job is paging a human or an ITIL desk.",
      },
      {
        id: "oncall",
        title: "Incident / on-call",
        bestFor: "Routing alerts to a human with escalation.",
        avoidWhen: "You only needed a dashboard and bought an on-call suite.",
      },
      {
        id: "devops",
        title: "Source control / CI",
        bestFor: "Git hosting, reviews, and pipelines.",
        avoidWhen: "You treat GitHub Copilot or a host panel as the git product.",
      },
      {
        id: "hosting",
        title: "Hosting panel / provider",
        bestFor: "cPanel-class panels or managed WordPress / PaaS.",
        avoidWhen: "You rank WP Engine as if it were Plesk, or vice versa.",
      },
    ],
    vs: {
      slug: "it-development-vs-project-management",
      otherName: "project management software",
      otherCategory: "project-management",
      otherGuideSlug: "what-is-project-management-software",
      difference:
        "IT and development software owns service desks, observability, on-call, git/CI, and hosting. Project management software owns work boards, dates, and delivery — including Jira Software, which is not Jira Service Management.",
      whenThis:
        "The blocking job is incidents, telemetry, paging, source control, or hosting.",
      whenOther: "The blocking job is shared work ownership and project dates.",
    },
  },
  {
    categorySlug: "ecommerce",
    name: "ecommerce software",
    bestSlug: "ecommerce-software",
    whatIsSlug: "what-is-ecommerce-software",
    howToChooseSlug: "how-to-choose-ecommerce-software",
    pricingSlug: "ecommerce-pricing-guide",
    requirementsSlug: "ecommerce-requirements-guide",
    evaluationSlug: "ecommerce-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "catalog", label: "Catalog", short: "Products & inventory" },
      { id: "storefront", label: "Storefront", short: "Theme & merchandising" },
      { id: "checkout", label: "Checkout", short: "Pay & tax" },
      { id: "order", label: "Order", short: "Fulfill / refund" },
      { id: "channel", label: "Channel", short: "POS / marketplaces" },
      { id: "measure", label: "Measure", short: "Conversion & GMV" },
    ],
    loopBody:
      "Ecommerce platforms run a commerce loop: catalog, storefront, checkout, order ops, extra channels, then conversion reporting. Dropshipping importers only own supplier catalog sync — not checkout.",
    loopExample:
      "Example: Harbor Home (Shopify store, two people) needs checkout and refunds in one admin. A Spocket-class importer does not replace the platform; Square Online is a different job if POS is already the core.",
    loopTip:
      "Model subscription + processing + apps at real order volume — not the starter tile.",
    shapes: [
      {
        id: "saas",
        title: "Hosted SaaS platform",
        bestFor: "Storefront, checkout, and apps without running your own host.",
        avoidWhen: "You only need supplier imports onto a store that already exists.",
      },
      {
        id: "oss",
        title: "Open-source cart",
        bestFor: "WordPress/Woo-class control with your own hosting.",
        avoidWhen: "You wanted a fully hosted admin and have no host/dev budget.",
      },
      {
        id: "pos",
        title: "Omnichannel POS + online",
        bestFor: "Retail POS that also needs an online catalog.",
        avoidWhen: "You have no stores and needed a pure DTC platform.",
      },
      {
        id: "dropship",
        title: "Dropshipping sourcing",
        bestFor: "Importing supplier inventory into an existing store.",
        avoidWhen: "You rank them as full storefront platforms.",
      },
    ],
    vs: {
      slug: "ecommerce-vs-email-marketing",
      otherName: "email marketing software",
      otherCategory: "email-marketing",
      otherGuideSlug: "what-is-email-marketing",
      difference:
        "Ecommerce software owns catalog, checkout, and orders. Email marketing owns permission-based campaigns that may sync store events — it is not a storefront.",
      whenThis: "The blocking job is selling and fulfilling products online.",
      whenOther: "The blocking job is newsletters and automations to subscribers.",
    },
  },
];
