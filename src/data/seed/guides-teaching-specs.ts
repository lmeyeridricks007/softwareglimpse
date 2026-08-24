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
    categorySlug: "voip-business-phone",
    name: "VoIP & business phone software",
    bestSlug: "voip-business-phone-software",
    whatIsSlug: "what-is-voip-business-phone-software",
    howToChooseSlug: "how-to-choose-voip-business-phone-software",
    pricingSlug: "voip-business-phone-pricing-guide",
    requirementsSlug: "voip-business-phone-requirements-guide",
    evaluationSlug: "voip-business-phone-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "number", label: "Number", short: "DID / port" },
      { id: "route", label: "Route", short: "IVR / queue" },
      { id: "dial", label: "Dial", short: "Outbound" },
      { id: "log", label: "Log", short: "CRM CTI" },
      { id: "record", label: "Record", short: "QA" },
      { id: "review", label: "Review", short: "Reporting" },
    ],
    loopBody:
      "VoIP and business phone tools run a voice loop: provision or port a number, route inbound with IVR and queues, dial outbound with power-dialer workflows, log calls into CRM, record for QA, then review queue and rep metrics. SMB VoIP, CRM CTI, sales dialers, and inbound CC platforms each emphasise different steps.",
    loopExample:
      "Example: Harbor Sales starts with CallHippo-class SMB VoIP because a published business number is the bottleneck — then adds Kixie when outbound dial volume becomes the blocking job.",
    loopTip:
      "Write whether the blocking job is inbound support voice, outbound sales dialing, or mid-market CRM CTI — those purchases fail for different reasons.",
    shapes: [
      {
        id: "smb-voip",
        title: "SMB cloud VoIP",
        bestFor: "Budget business phone with dialing and basic routing.",
        avoidWhen: "You need enterprise CTI depth or inbound CC WFM only.",
      },
      {
        id: "crm-cti",
        title: "CRM-connected phone",
        bestFor: "Mid-market click-to-dial and call logging in CRM.",
        avoidWhen: "You only need the cheapest two-seat phone line.",
      },
      {
        id: "sales-dialer",
        title: "Sales power dialer",
        bestFor: "High-volume outbound calling with CRM dispositions.",
        avoidWhen: "Inbound support queues are the blocking job.",
      },
      {
        id: "inbound-cc",
        title: "Inbound contact-center voice",
        bestFor: "Cloud PBX, queues, and inbound routing automation.",
        avoidWhen: "Outbound power dialing is the primary job.",
      },
    ],
    vs: {
      slug: "voip-business-phone-vs-business-communications",
      otherName: "business communications software",
      otherCategory: "business-communications",
      otherGuideSlug: "what-is-business-communications-software",
      difference:
        "VoIP and business phone software owns PSTN voice, IVR, dialers, and CRM call logging. Broader business communications adds team chat, WhatsApp inboxes, and full UCaaS suites — voice is one cluster inside the parent category.",
      whenThis:
        "The blocking job is a business phone number, outbound dialer, CRM CTI, or inbound voice queues.",
      whenOther:
        "The blocking job is team messaging, WhatsApp customer chat, or an all-in-one UCaaS suite beyond affiliate VoIP depth.",
    },
  },
  {
    categorySlug: "live-chat",
    name: "live chat software",
    bestSlug: "live-chat-software",
    whatIsSlug: "what-is-live-chat-software",
    howToChooseSlug: "how-to-choose-live-chat-software",
    pricingSlug: "live-chat-pricing-guide",
    requirementsSlug: "live-chat-requirements-guide",
    evaluationSlug: "live-chat-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "embed", label: "Embed", short: "Widget / app" },
      { id: "trigger", label: "Trigger", short: "Proactive" },
      { id: "route", label: "Route", short: "Agent queue" },
      { id: "deflect", label: "Deflect", short: "Bot / AI" },
      { id: "handoff", label: "Handoff", short: "Ticket / CRM" },
      { id: "review", label: "Review", short: "CSAT / metrics" },
    ],
    loopBody:
      "Live chat tools run a visitor messaging loop: embed a messenger, trigger proactive outreach, route chats to agents, deflect repeat questions with bots or AI, hand off to helpdesk tickets when needed, then review CSAT and deflection metrics. Per-agent website chat, conversation-cap deflection, and AI inbox platforms each emphasise different steps.",
    loopExample:
      "Example: Harbor Commerce starts with Freshchat-class per-agent chat because a free 10-agent tier unblocks website support — then adds Tidio-style Lyro deflection when conversation volume outpaces headcount.",
    loopTip:
      "Write whether the blocking job is website messenger, proactive campaigns, AI deflection, or an AI-first inbox — those purchases fail for different reasons.",
    shapes: [
      {
        id: "website-messenger",
        title: "Website messenger",
        bestFor: "Per-agent live chat with routing and canned replies.",
        avoidWhen: "You need full helpdesk ticketing as the primary purchase.",
      },
      {
        id: "proactive-chat",
        title: "Proactive chat",
        bestFor: "Triggers, targeting rules, and visitor campaigns.",
        avoidWhen: "You only need a passive widget with no outreach.",
      },
      {
        id: "chatbot-deflection",
        title: "Chatbot deflection",
        bestFor: "Conversation-cap pricing with flows and AI agents.",
        avoidWhen: "You need enterprise ticketing SLAs as the core job.",
      },
      {
        id: "ai-inbox",
        title: "AI-first inbox",
        bestFor: "Shared inbox with outcome-priced AI resolutions.",
        avoidWhen: "You only need a simple SMB website widget.",
      },
    ],
    vs: {
      slug: "live-chat-vs-customer-service-software",
      otherName: "customer service software",
      otherCategory: "customer-service",
      otherGuideSlug: "what-is-customer-service-software",
      difference:
        "Live chat software owns website messengers, proactive triggers, and chatbot deflection. Broader customer service adds full helpdesk ticketing, ecommerce order desks, and ITSM — live chat is one cluster inside the parent category.",
      whenThis:
        "The blocking job is a website messenger, proactive chat campaigns, or AI/chatbot deflection on the site.",
      whenOther:
        "The blocking job is helpdesk ticketing, ecommerce order-aware support, or ITSM — not chat-only.",
    },
  },
  {
    categorySlug: "helpdesk-ticketing",
    name: "helpdesk & ticketing software",
    bestSlug: "helpdesk-ticketing-software",
    whatIsSlug: "what-is-helpdesk-ticketing-software",
    howToChooseSlug: "how-to-choose-helpdesk-ticketing-software",
    pricingSlug: "helpdesk-ticketing-pricing-guide",
    requirementsSlug: "helpdesk-ticketing-requirements-guide",
    evaluationSlug: "helpdesk-ticketing-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "capture", label: "Capture", short: "Inbox / channel" },
      { id: "ticket", label: "Ticket", short: "Queue / assign" },
      { id: "sla", label: "SLA", short: "Routing" },
      { id: "resolve", label: "Resolve", short: "Macros / KB" },
      { id: "deflect", label: "Deflect", short: "Self-service" },
      { id: "review", label: "Review", short: "CSAT / QA" },
    ],
    loopBody:
      "Helpdesk tools run a support loop: capture conversations from email and channels, convert to tickets, route with SLAs, resolve with macros and knowledge base, deflect repeat questions with self-service, then review CSAT and agent metrics.",
    loopExample:
      "Example: Harbor SaaS starts with Help Scout-class shared inbox because a free 5-user tier unblocks email support — then graduates to Zendesk Suite when omnichannel SLAs become the blocking job.",
    loopTip:
      "Write whether the blocking job is SMB shared inbox, mid-market omnichannel helpdesk, ecommerce order desk, or ITSM — those purchases fail for different reasons.",
    shapes: [
      { id: "omnichannel-helpdesk", title: "Omnichannel helpdesk", bestFor: "Enterprise ticketing with SLAs and routing.", avoidWhen: "You only need a simple shared inbox." },
      { id: "smb-inbox", title: "SMB shared inbox", bestFor: "Email-first support with Docs self-service.", avoidWhen: "You need enterprise omnichannel at scale." },
      { id: "ecommerce-helpdesk", title: "Ecommerce helpdesk", bestFor: "Shopify order context in the agent workspace.", avoidWhen: "You need generic B2B ticketing only." },
      { id: "itsm-landscape", title: "ITSM (landscape)", bestFor: "Internal employee service desk and ITIL workflows.", avoidWhen: "Customer-facing helpdesk is the job." },
    ],
    vs: {
      slug: "helpdesk-ticketing-vs-customer-service-software",
      otherName: "customer service software",
      otherCategory: "customer-service",
      otherGuideSlug: "what-is-customer-service-software",
      difference: "Helpdesk and ticketing software owns shared inboxes, ticket workflows, SLAs, and knowledge bases. Broader customer service adds live chat widgets, phone, and adjacent clusters — helpdesk is one subcategory inside the parent.",
      whenThis: "The blocking job is email-to-ticket queues, SLAs, macros, or a knowledge base for agents.",
      whenOther: "The blocking job is website live chat, phone-only support, or you need the parent CS hub overview.",
    },
  },
  {
    categorySlug: "dropshipping-pod",
    name: "dropshipping & POD software",
    bestSlug: "dropshipping-pod-software",
    whatIsSlug: "what-is-dropshipping-pod-software",
    howToChooseSlug: "how-to-choose-dropshipping-pod-software",
    pricingSlug: "dropshipping-pod-pricing-guide",
    requirementsSlug: "dropshipping-pod-requirements-guide",
    evaluationSlug: "dropshipping-pod-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "source", label: "Source", short: "Supplier catalog" },
      { id: "import", label: "Import", short: "Store listing" },
      { id: "price", label: "Price", short: "Margin rules" },
      { id: "route", label: "Route", short: "Order to supplier" },
      { id: "track", label: "Track", short: "Fulfillment status" },
      { id: "review", label: "Review", short: "Returns / QA" },
    ],
    loopBody: "Dropshipping and POD tools run a catalog loop: source products from suppliers, import listings to your storefront, set margin rules, route orders to suppliers or print networks, track fulfillment, then review returns and supplier quality.",
    loopExample: "Example: Harbor Merch imports Spocket-class US/EU suppliers into Shopify first — then adds Printify when custom POD merch becomes the margin driver.",
    loopTip: "Name whether the blocking job is supplier import, Shopify-native marketplace import, or print-on-demand fulfillment — not a full storefront platform.",
    shapes: [
      { id: "supplier-import", title: "Supplier import", bestFor: "US/EU catalog import with plan caps.", avoidWhen: "You need a hosted storefront platform." },
      { id: "marketplace-import", title: "Marketplace import", bestFor: "AliExpress/Temu import automation.", avoidWhen: "You need US/EU vetted suppliers only." },
      { id: "print-on-demand", title: "Print on demand", bestFor: "POD catalog and print network.", avoidWhen: "You only need generic supplier dropshipping." },
    ],
    vs: {
      slug: "dropshipping-pod-vs-ecommerce-software",
      otherName: "ecommerce software",
      otherCategory: "ecommerce",
      otherGuideSlug: "what-is-ecommerce-software",
      difference: "Dropshipping and POD apps source products and route fulfillment into an existing store — they are not hosted storefront platforms like Shopify or WooCommerce.",
      whenThis: "You already have a storefront and need supplier import or POD fulfillment.",
      whenOther: "You need a hosted platform, open-source cart, or website-builder commerce as the primary purchase.",
    },
  },
  {
    categorySlug: "fulfillment-shipping",
    name: "fulfillment & shipping software",
    bestSlug: "fulfillment-shipping-software",
    whatIsSlug: "what-is-fulfillment-shipping-software",
    howToChooseSlug: "how-to-choose-fulfillment-shipping-software",
    pricingSlug: "fulfillment-shipping-pricing-guide",
    requirementsSlug: "fulfillment-shipping-requirements-guide",
    evaluationSlug: "fulfillment-shipping-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "order", label: "Order", short: "Pick / pack" },
      { id: "label", label: "Label", short: "Rate shop" },
      { id: "ship", label: "Ship", short: "Carrier handoff" },
      { id: "track", label: "Track", short: "Delivery updates" },
      { id: "return", label: "Return", short: "RMA portal" },
      { id: "review", label: "Review", short: "Ops metrics" },
    ],
    loopBody: "Fulfillment and shipping tools run post-checkout ops: pick and pack orders, buy shipping labels with rate shopping, hand off to carriers, track delivery, manage returns, then review fulfillment SLAs and shipping spend.",
    loopExample: "Example: Harbor DTC outsources pick-pack to ShipBob-class 3PL when in-house shipping breaks SLAs — then adds Sendcloud for multi-carrier label rate shopping on remaining SKUs.",
    loopTip: "Write whether the blocking job is outsourced 3PL, multi-carrier labels, or returns management — not storefront catalog import.",
    shapes: [
      { id: "3pl", title: "3PL fulfillment", bestFor: "Outsourced warehouse and pick-pack-ship.", avoidWhen: "You only need label printing on self-fulfill." },
      { id: "shipping-labels", title: "Shipping labels", bestFor: "Multi-carrier rate shopping and labels.", avoidWhen: "You need full 3PL warehouse outsourcing." },
      { id: "returns", title: "Returns management", bestFor: "Return portals and reverse logistics.", avoidWhen: "Outbound shipping labels are the only job." },
    ],
    vs: {
      slug: "fulfillment-shipping-vs-ecommerce-software",
      otherName: "ecommerce software",
      otherCategory: "ecommerce",
      otherGuideSlug: "what-is-ecommerce-software",
      difference: "Fulfillment and shipping software handles post-checkout ops — labels, 3PL, and returns — not storefront catalog, checkout, or product sourcing into a new store.",
      whenThis: "You have orders to ship and need 3PL, labels, or returns tooling.",
      whenOther: "You need a storefront platform or dropshipping product import as the primary job.",
    },
  },
  {
    categorySlug: "ats-recruiting",
    name: "ATS & recruiting software",
    bestSlug: "ats-recruiting-software",
    whatIsSlug: "what-is-ats-recruiting-software",
    howToChooseSlug: "how-to-choose-ats-recruiting-software",
    pricingSlug: "ats-recruiting-pricing-guide",
    requirementsSlug: "ats-recruiting-requirements-guide",
    evaluationSlug: "ats-recruiting-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "post", label: "Post", short: "Job boards" },
      { id: "source", label: "Source", short: "Applicants" },
      { id: "stage", label: "Stage", short: "Pipeline" },
      { id: "schedule", label: "Schedule", short: "Interviews" },
      { id: "hire", label: "Hire", short: "Offer / close" },
      { id: "review", label: "Review", short: "Time-to-hire" },
    ],
    loopBody:
      "ATS software runs a hiring loop: post roles to career sites and job boards, source applicants, stage candidates in pipelines, schedule interviews, close offers, then review time-to-hire and funnel metrics.",
    loopExample:
      "Example: Harbor Agency posts two roles on a branded career site, routes referrals into one pipeline, and only adds interview scheduling once hiring managers agree on scorecards.",
    loopTip:
      "Name whether the blocking job is SMB ATS with a free tier, structured enterprise hiring, or HRIS-with-ATS — not frontline scheduling or payroll.",
    shapes: [
      { id: "smb-ats", title: "SMB ATS", bestFor: "Career sites, pipelines, and interview workflows with published pricing.", avoidWhen: "You need enterprise governance kits and structured hiring at scale." },
      { id: "structured-ats", title: "Structured enterprise ATS", bestFor: "Scorecards, kits, and hiring-team governance.", avoidWhen: "You only hire occasionally and need a free Bootstrap path." },
      { id: "hris-ats", title: "HRIS with ATS module", bestFor: "Employee record plus light recruiting in one suite.", avoidWhen: "Recruiting volume and career-site depth are the primary purchase." },
    ],
    vs: {
      slug: "ats-recruiting-vs-hr-software",
      otherName: "HR software",
      otherCategory: "hr",
      otherGuideSlug: "what-is-hr-software",
      difference:
        "ATS and recruiting software owns applicant pipelines, career sites, and interview workflows. Broader HR adds core HRIS, payroll, shifts, and time clocks — ATS is one subcategory inside the parent.",
      whenThis: "The blocking job is job posts, candidate pipelines, or interview coordination.",
      whenOther: "The blocking job is employee records, payroll, shift scheduling, or time clocks.",
    },
  },
  {
    categorySlug: "time-attendance",
    name: "time & attendance software",
    bestSlug: "time-attendance-software",
    whatIsSlug: "what-is-time-attendance-software",
    howToChooseSlug: "how-to-choose-time-attendance-software",
    pricingSlug: "time-attendance-pricing-guide",
    requirementsSlug: "time-attendance-requirements-guide",
    evaluationSlug: "time-attendance-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "schedule", label: "Schedule", short: "Shifts" },
      { id: "publish", label: "Publish", short: "Rota live" },
      { id: "clock", label: "Clock", short: "In / out" },
      { id: "approve", label: "Approve", short: "Timesheets" },
      { id: "pay", label: "Pay", short: "Export to payroll" },
      { id: "review", label: "Review", short: "Overtime / policy" },
    ],
    loopBody:
      "Time and attendance tools run frontline ops: publish shifts, clock workers in with GPS or kiosk rules, approve timesheets, export hours to payroll, then review overtime and attendance policy exceptions.",
    loopExample:
      "Example: Harbor Retail fixes missed clock-ins with GPS geofence rules first — then adds open-shift publishing when managers stop rebuilding rotas in spreadsheets.",
    loopTip:
      "Separate time-clock-only purchases from full WFM suites with comms and task hubs — pricing units differ (per user vs per location).",
    shapes: [
      { id: "time-clock", title: "Time clock", bestFor: "GPS, kiosk, or face-recognition clock-in with timesheets.", avoidWhen: "You only need shift publishing without attendance policies." },
      { id: "wfm-suite", title: "WFM suite", bestFor: "Scheduling, comms, and deskless task hubs in one mobile app.", avoidWhen: "You only need a lightweight clock-in tool." },
      { id: "hourly-scheduling", title: "Hourly scheduling", bestFor: "Per-user or per-location shift tools with optional clocks.", avoidWhen: "Project task time tracking is the real job." },
    ],
    vs: {
      slug: "time-attendance-vs-hr-software",
      otherName: "HR software",
      otherCategory: "hr",
      otherGuideSlug: "what-is-hr-software",
      difference:
        "Time and attendance software owns clock-in, timesheets, shift scheduling, and hourly-team policies. Broader HR adds core HRIS, payroll, and ATS — time & attendance is one subcategory inside the parent.",
      whenThis: "The blocking job is shifts, clock-in, GPS attendance, or timesheet approval.",
      whenOther: "The blocking job is hiring pipelines, employee records, or payroll as the primary purchase.",
    },
  },
  {
    categorySlug: "web-hosting",
    name: "web hosting & server management software",
    bestSlug: "web-hosting-software",
    whatIsSlug: "what-is-web-hosting-software",
    howToChooseSlug: "how-to-choose-web-hosting-software",
    pricingSlug: "web-hosting-pricing-guide",
    requirementsSlug: "web-hosting-requirements-guide",
    evaluationSlug: "web-hosting-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "provision", label: "Provision", short: "Server / site" },
      { id: "admin", label: "Admin", short: "Panel ops" },
      { id: "secure", label: "Secure", short: "SSL / hardening" },
      { id: "monitor", label: "Monitor", short: "Uptime / usage" },
      { id: "backup", label: "Backup", short: "Snapshots" },
      { id: "review", label: "Review", short: "Licence TCO" },
    ],
    loopBody:
      "Hosting control panels provision servers and sites, administer domains and mailboxes, apply SSL and hardening, monitor usage, run backups, then review per-server licence TCO.",
    loopExample:
      "Example: Harbor Host provisions customer VPS instances on Plesk-class panels — separate from managed WordPress hosts and cloud PaaS deploy paths.",
    loopTip:
      "Do not rank hosting panels, managed WordPress hosts, and git-push PaaS as one undifferentiated hosting purchase.",
    shapes: [
      { id: "hosting-panel", title: "Hosting control panel", bestFor: "Multi-site server administration licences.", avoidWhen: "You want managed WordPress without panel ops." },
      { id: "managed-host", title: "Managed hosting", bestFor: "Provider-operated WordPress or shared hosting.", avoidWhen: "You resell VPS panel licences to customers." },
      { id: "cloud-paas", title: "Cloud PaaS", bestFor: "Git-push app deploy platforms.", avoidWhen: "You need cPanel-style multi-tenant hosting administration." },
    ],
    vs: {
      slug: "web-hosting-vs-it-development-software",
      otherName: "IT & development software",
      otherCategory: "it-development",
      otherGuideSlug: "what-is-it-development-software",
      difference:
        "Web hosting software here means hosting control panels and server administration. Broader IT & development adds ITSM, observability, source control, managed hosts, and cloud PaaS — web hosting is one deferred sub-hub inside the parent.",
      whenThis: "The blocking job is server panel licences, domain SSL, or multi-site hosting administration.",
      whenOther: "The blocking job is ITSM, observability, git/CI, managed WordPress, or cloud app platforms.",
    },
  },
  {
    categorySlug: "itsm",
    name: "ITSM software",
    bestSlug: "itsm-software",
    whatIsSlug: "what-is-itsm-software",
    howToChooseSlug: "how-to-choose-itsm-software",
    pricingSlug: "itsm-pricing-guide",
    requirementsSlug: "itsm-requirements-guide",
    evaluationSlug: "itsm-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "intake", label: "Intake", short: "Employee request" },
      { id: "triage", label: "Triage", short: "Incident queue" },
      { id: "resolve", label: "Resolve", short: "SLA / assign" },
      { id: "change", label: "Change", short: "ITIL workflow" },
      { id: "asset", label: "Asset", short: "CMDB" },
      { id: "review", label: "Review", short: "Ops metrics" },
    ],
    loopBody:
      "ITSM platforms run internal service desks: intake employee requests, triage incidents, resolve within SLAs, manage changes and problems, track assets in a CMDB, then review operational metrics.",
    loopExample:
      "Example: Harbor IT routes laptop requests through a service catalog while incidents stay in a separate queue — not the customer ecommerce helpdesk.",
    loopTip:
      "Scope internal employee ITSM versus customer-facing helpdesk ticketing — Freshservice straddles both buyer jobs but ITSM is the primary cluster here.",
    shapes: [
      { id: "smb-itsm", title: "SMB / mid-market ITSM", bestFor: "Published-price service desk with ITIL modules.", avoidWhen: "You need enterprise CMDB depth and global ITIL governance." },
      { id: "enterprise-itsm", title: "Enterprise ITSM", bestFor: "CMDB, change, and asset governance at scale.", avoidWhen: "You only need a shared customer support inbox." },
      { id: "customer-helpdesk", title: "Customer helpdesk", bestFor: "External customer tickets and ecommerce support.", avoidWhen: "The blocking job is internal employee IT requests." },
    ],
    vs: {
      slug: "itsm-vs-it-development-software",
      otherName: "IT & development software",
      otherCategory: "it-development",
      otherGuideSlug: "what-is-it-development-software",
      difference:
        "ITSM software owns internal employee service desks and ITIL workflows. Broader IT & development adds observability, on-call, source control, hosting panels, and web data — ITSM is one deferred sub-hub inside the parent.",
      whenThis: "The blocking job is internal incidents, changes, assets, or employee service catalog.",
      whenOther: "The blocking job is observability, paging, git/CI, hosting panels, or proxy data collection.",
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
  {
    categorySlug: "accounting-finance",
    name: "accounting & finance software",
    bestSlug: "accounting-finance-software",
    whatIsSlug: "what-is-accounting-finance-software",
    howToChooseSlug: "how-to-choose-accounting-finance-software",
    pricingSlug: "accounting-finance-pricing-guide",
    requirementsSlug: "accounting-finance-requirements-guide",
    evaluationSlug: "accounting-finance-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "capture", label: "Capture", short: "Receipts & feeds" },
      { id: "categorise", label: "Categorise", short: "GL codes" },
      { id: "approve", label: "Approve", short: "Policy" },
      { id: "reconcile", label: "Reconcile", short: "Bank match" },
      { id: "report", label: "Report", short: "Close & P&L" },
      { id: "produce", label: "Produce", short: "BOM / MRP" },
    ],
    loopBody:
      "Finance platforms run a close loop: capture spend and receipts, categorise to the ledger, approve against policy, reconcile banks, report, and — for manufacturers — plan production and inventory.",
    loopExample:
      "Example: Harbor Studio (18 people) starts with expense approvals because reimbursements still live in email — then adds bookkeeping automation when their accountant asks for cleaner feeds. They do not buy manufacturing ERP until SKUs and BOM complexity block spreadsheets.",
    loopTip:
      "Name the weekly finance ritual first. Expense, bookkeeping, and MRP fail for different reasons.",
    shapes: [
      {
        id: "expense",
        title: "Expense management",
        bestFor: "Employee receipts, approvals, and reimbursements.",
        avoidWhen: "You need BOM, work orders, or shop-floor MRP.",
      },
      {
        id: "te",
        title: "Travel & expense (T&E)",
        bestFor: "Corporate travel booking plus expense policy.",
        avoidWhen: "You only need accountant-facing receipt capture.",
      },
      {
        id: "bookkeeping",
        title: "Bookkeeping automation",
        bestFor: "Receipt OCR and categorisation for owners and bookkeepers.",
        avoidWhen: "Enterprise T&E policy is the blocking job.",
      },
      {
        id: "erp",
        title: "Inventory & manufacturing ERP",
        bestFor: "Stock, BOM, and production for small manufacturers.",
        avoidWhen: "You only need expense reports.",
      },
    ],
    vs: {
      slug: "accounting-finance-vs-hr-software",
      otherName: "HR software",
      otherCategory: "hr",
      otherGuideSlug: "what-is-hr-software",
      difference:
        "Accounting and finance software owns receipts, expenses, ledgers, or production. HR software owns hiring, employee records, payroll runs, and workforce scheduling.",
      whenThis:
        "The blocking job is closing books, expenses, receipts, or inventory/production.",
      whenOther:
        "The blocking job is candidates, employees, shifts, pay runs, or training.",
    },
  },
  {
    categorySlug: "social-media-marketing",
    name: "social media marketing software",
    bestSlug: "social-media-marketing-software",
    whatIsSlug: "what-is-social-media-marketing-software",
    howToChooseSlug: "how-to-choose-social-media-marketing-software",
    pricingSlug: "social-media-marketing-pricing-guide",
    requirementsSlug: "social-media-marketing-requirements-guide",
    evaluationSlug: "social-media-marketing-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "plan", label: "Plan", short: "Calendar / brief" },
      { id: "create", label: "Create", short: "Copy & creative" },
      { id: "approve", label: "Approve", short: "Brand sign-off" },
      { id: "publish", label: "Publish", short: "Network post" },
      { id: "listen", label: "Listen", short: "Mentions / inbox" },
      { id: "measure", label: "Measure", short: "Engagement & ROI" },
    ],
    loopBody:
      "Social media marketing tools run a channel loop: plan content, create posts, approve, publish, listen for mentions and replies, then measure engagement. Schedulers, listening suites, and influencer platforms each emphasise different steps.",
    loopExample:
      "Example: Harbor Studio starts with a three-channel scheduling calendar because posts still go out manually — then adds listening when brand mentions outgrow manual Twitter searches.",
    loopTip:
      "Write the weekly social outcome first. Scheduling, listening, and influencer jobs fail for different reasons.",
    shapes: [
      {
        id: "scheduler",
        title: "Social scheduling",
        bestFor: "Queued posts, approvals, and multi-network calendars.",
        avoidWhen: "Mention intelligence or influencer outreach is the blocking job.",
      },
      {
        id: "suite",
        title: "Social suite",
        bestFor: "Publish + inbox + analytics for growing teams.",
        avoidWhen: "You only need lightweight scheduling on one channel.",
      },
      {
        id: "listening",
        title: "Social listening",
        bestFor: "Brand mentions, sentiment, and competitor alerts.",
        avoidWhen: "You need to publish posts — listening is not a scheduler.",
      },
      {
        id: "influencer",
        title: "Influencer marketing",
        bestFor: "Creator discovery, outreach, and campaign tracking.",
        avoidWhen: "Daily post scheduling is the real purchase.",
      },
    ],
    vs: {
      slug: "social-media-marketing-vs-marketing-software",
      otherName: "marketing software",
      otherCategory: "marketing",
      otherGuideSlug: "what-is-marketing-software",
      difference:
        "Social media marketing software owns scheduling, listening, and influencer workflows. Generic marketing software owns funnels, MAP journeys, and multichannel campaigns beyond social execution.",
      whenThis:
        "The blocking job is social calendars, mentions, or creator campaigns.",
      whenOther:
        "The blocking job is funnels, lifecycle MAP, or cross-channel campaign orchestration.",
    },
  },
  {
    categorySlug: "webinar-virtual-events",
    name: "webinar & virtual events software",
    bestSlug: "webinar-virtual-events-software",
    whatIsSlug: "what-is-webinar-virtual-events-software",
    howToChooseSlug: "how-to-choose-webinar-virtual-events-software",
    pricingSlug: "webinar-virtual-events-pricing-guide",
    requirementsSlug: "webinar-virtual-events-requirements-guide",
    evaluationSlug: "webinar-virtual-events-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "plan", label: "Plan", short: "Topic & offer" },
      { id: "register", label: "Register", short: "Signup & reminders" },
      { id: "host", label: "Host", short: "Live or simulive" },
      { id: "engage", label: "Engage", short: "Polls & Q&A" },
      { id: "follow-up", label: "Follow up", short: "CRM / replay" },
      { id: "measure", label: "Measure", short: "Attendance & ROI" },
    ],
    loopBody:
      "Webinar and virtual events tools run an event loop: plan the session, register attendees, host live or simulive, engage during the room, follow up with CRM sync and replays, then measure attendance and conversions. Hosts, event platforms, and production tools each emphasise different steps.",
    loopExample:
      "Example: Harbor Studio starts with a weekly live webinar because registration and follow-up are manual — then adds evergreen automation when the same replay runs on a schedule.",
    loopTip:
      "Write the primary event outcome first. Live hosting, virtual events, and production purchases fail for different reasons.",
    shapes: [
      {
        id: "live-host",
        title: "Live webinar hosting",
        bestFor: "Registration pages, live rooms, polls, and follow-up.",
        avoidWhen: "Multi-session virtual events or multi-camera production is the blocking job.",
      },
      {
        id: "evergreen",
        title: "Evergreen / simulive",
        bestFor: "Automated replays that mimic live sessions on a schedule.",
        avoidWhen: "You only run one-off live events with no replay automation.",
      },
      {
        id: "virtual-events",
        title: "Virtual events",
        bestFor: "Multi-session events, stages, and attendee networking.",
        avoidWhen: "You need a lightweight single-room webinar only.",
      },
      {
        id: "production",
        title: "Live stream production",
        bestFor: "Multi-camera switching, overlays, and multistream outputs.",
        avoidWhen: "Registration and attendee management is the blocking job.",
      },
    ],
    vs: {
      slug: "webinar-virtual-events-vs-marketing-software",
      otherName: "marketing software",
      otherCategory: "marketing",
      otherGuideSlug: "what-is-marketing-software",
      difference:
        "Webinar and virtual events software owns registration, live rooms, evergreen automation, and event production. Generic marketing software owns funnels, MAP journeys, and multichannel campaigns beyond webinar execution.",
      whenThis:
        "The blocking job is live webinars, virtual events, or live-stream production.",
      whenOther:
        "The blocking job is funnels, lifecycle MAP, or cross-channel campaign orchestration.",
    },
  },
  {
    categorySlug: "lms-course-creation",
    name: "LMS & course creation software",
    bestSlug: "lms-course-creation-software",
    whatIsSlug: "what-is-lms-course-creation-software",
    howToChooseSlug: "how-to-choose-lms-course-creation-software",
    pricingSlug: "lms-course-creation-pricing-guide",
    requirementsSlug: "lms-course-creation-requirements-guide",
    evaluationSlug: "lms-course-creation-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "author", label: "Author", short: "Lessons & modules" },
      { id: "publish", label: "Publish", short: "Catalog / checkout" },
      { id: "enroll", label: "Enroll", short: "Cohort / access" },
      { id: "learn", label: "Learn", short: "Progress & content" },
      { id: "assess", label: "Assess", short: "Quizzes / certs" },
      { id: "measure", label: "Measure", short: "Completion & ROI" },
    ],
    loopBody:
      "LMS and course creation tools run a learning loop: author content, publish the catalog, enroll learners, deliver lessons, assess with quizzes or certificates, then measure completion and revenue. Course LMS, team playbook, and assessment tools each emphasise different steps.",
    loopExample:
      "Example: Harbor Academy starts with a self-paced course catalog because cohort admin is manual — then adds scheduled cohorts when live kickoffs outgrow email reminders.",
    loopTip:
      "Write the primary learning outcome first. Course commerce, internal playbooks, and quiz-only purchases fail for different reasons.",
    shapes: [
      {
        id: "course-lms",
        title: "Course LMS / academy",
        bestFor: "Sell courses, memberships, and structured online programs.",
        avoidWhen: "You only need internal SOP docs without learner commerce.",
      },
      {
        id: "cohort",
        title: "Cohort programs",
        bestFor: "Scheduled cohorts with drip content and group milestones.",
        avoidWhen: "Self-paced evergreen courses without cohort admin are enough.",
      },
      {
        id: "playbooks",
        title: "Team playbooks & training paths",
        bestFor: "Internal role paths, SOPs, and employee onboarding content.",
        avoidWhen: "External course sales and checkout are the blocking job.",
      },
      {
        id: "assessments",
        title: "Quizzes & assessments",
        bestFor: "Tests, certifications, and knowledge checks.",
        avoidWhen: "You need full course authoring and commerce — not quizzes alone.",
      },
    ],
    vs: {
      slug: "lms-course-creation-vs-hr-software",
      otherName: "HR software",
      otherCategory: "hr",
      otherGuideSlug: "what-is-hr-software",
      difference:
        "LMS and course creation software owns curricula, course commerce, cohort delivery, and learner assessments. HR software owns HRIS, payroll, ATS, WFM, and frontline ops — training modules there serve employee records, not external academy commerce.",
      whenThis:
        "The blocking job is selling courses, running academies, or structured learner assessments.",
      whenOther:
        "The blocking job is core HRIS, payroll, hiring, or frontline scheduling — not course sales.",
    },
  },
  {
    categorySlug: "website-digital-presence",
    name: "website & digital presence software",
    bestSlug: "website-digital-presence-software",
    whatIsSlug: "what-is-website-digital-presence-software",
    howToChooseSlug: "how-to-choose-website-digital-presence-software",
    pricingSlug: "website-digital-presence-pricing-guide",
    requirementsSlug: "website-digital-presence-requirements-guide",
    evaluationSlug: "website-digital-presence-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "plan", label: "Plan", short: "Site / offer map" },
      { id: "build", label: "Build", short: "Pages / catalog" },
      { id: "publish", label: "Publish", short: "Domain / go-live" },
      { id: "convert", label: "Convert", short: "Forms / checkout" },
      { id: "optimize", label: "Optimize", short: "CRO / tests" },
      { id: "measure", label: "Measure", short: "Analytics & ROI" },
    ],
    loopBody:
      "Website and digital presence tools run a publish loop: plan the site or store, build pages and catalog, publish on a domain, convert visitors with forms or checkout, optimize with CRO tests, then measure analytics. Storefronts, builders, landing tools, and panels each emphasise different steps.",
    loopExample:
      "Example: Harbor Studio starts with Leadpages for campaign landings because the main site is static — then adds Shopify when checkout volume outgrows brochure pages.",
    loopTip:
      "Write the primary web outcome first. Storefront, builder, landing, panel, and marketplace purchases fail for different reasons.",
    shapes: [
      {
        id: "storefront",
        title: "Hosted storefront",
        bestFor: "Catalog, checkout, channels, and apps.",
        avoidWhen: "You only need a single campaign landing page.",
      },
      {
        id: "builder",
        title: "Website builder",
        bestFor: "SMB brochure or commerce sites with templates.",
        avoidWhen: "You need enterprise catalog depth or server panel control.",
      },
      {
        id: "landing",
        title: "Landing pages & CRO",
        bestFor: "Campaign pages, forms, and split tests.",
        avoidWhen: "You need full catalog and order management.",
      },
      {
        id: "marketplace",
        title: "Digital business marketplace",
        bestFor: "Buying or selling existing sites and stores.",
        avoidWhen: "You are building a new site from scratch.",
      },
    ],
    vs: {
      slug: "website-digital-presence-vs-ecommerce-software",
      otherName: "ecommerce software",
      otherCategory: "ecommerce",
      otherGuideSlug: "what-is-ecommerce-software",
      difference:
        "Website & digital presence spans storefronts, builders, landing pages, panels, and marketplaces. Ecommerce software focuses on catalog, checkout, fulfillment, and channel ops — a subset when the job is selling products online.",
      whenThis:
        "The blocking job spans site launch, landing pages, hosting panels, or buying/selling digital businesses.",
      whenOther:
        "The blocking job is catalog management, checkout, fulfillment, or omnichannel retail ops only.",
    },
  },
  {
    categorySlug: "analytics-bi",
    name: "analytics & business intelligence software",
    bestSlug: "analytics-bi-software",
    whatIsSlug: "what-is-analytics-bi-software",
    howToChooseSlug: "how-to-choose-analytics-bi-software",
    pricingSlug: "analytics-bi-pricing-guide",
    requirementsSlug: "analytics-bi-requirements-guide",
    evaluationSlug: "analytics-bi-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "collect", label: "Collect", short: "Sources & tags" },
      { id: "attribute", label: "Attribute", short: "Leads / calls" },
      { id: "unify", label: "Unify", short: "Connectors" },
      { id: "visualize", label: "Visualize", short: "Dashboards" },
      { id: "alert", label: "Alert", short: "Goals / reports" },
      { id: "prove", label: "Prove", short: "ROI narrative" },
    ],
    loopBody:
      "Analytics and BI tools run a proof loop: collect tagged data from campaigns, attribute leads and calls to sources, unify metrics through connectors, visualize KPIs on dashboards, alert stakeholders on goals, then prove ROI to executives and clients. Attribution tools and KPI dashboard platforms each emphasise different steps.",
    loopExample:
      "Example: Harbor Agency starts with WhatConverts-class call tracking because offline leads are invisible — then adds Databox when executives want one KPI view across ads and CRM.",
    loopTip:
      "Write the primary proof outcome first. Attribution, dashboards, and connector-only purchases fail for different reasons.",
    shapes: [
      {
        id: "attribution",
        title: "Lead & call attribution",
        bestFor: "Track leads, calls, and forms to campaigns and sources.",
        avoidWhen: "You only need a static monthly spreadsheet export.",
      },
      {
        id: "dashboards",
        title: "KPI dashboards",
        bestFor: "Executive and team dashboards with goal tracking.",
        avoidWhen: "Call-level source data is the blocking requirement.",
      },
      {
        id: "connectors",
        title: "Marketing metrics unification",
        bestFor: "Pull ads, CRM, and analytics metrics into one view.",
        avoidWhen: "You need dynamic call tracking on every landing page.",
      },
    ],
    vs: {
      slug: "analytics-bi-vs-marketing-software",
      otherName: "marketing software",
      otherCategory: "marketing",
      otherGuideSlug: "what-is-marketing-software",
      difference:
        "Analytics and BI software owns attribution, KPI dashboards, and marketing data connectors. Marketing software owns MAP, funnels, social execution, and campaign authoring — reporting modules there serve campaign ops, not executive BI or call-level attribution.",
      whenThis:
        "The blocking job is proving ROI with attribution, executive dashboards, or unified marketing metrics.",
      whenOther:
        "The blocking job is MAP, funnels, social scheduling, or campaign content — not analytics-first reporting.",
    },
  },
  {
    categorySlug: "field-service-operations",
    name: "field service & operations software",
    bestSlug: "field-service-operations-software",
    whatIsSlug: "what-is-field-service-operations-software",
    howToChooseSlug: "how-to-choose-field-service-operations-software",
    pricingSlug: "field-service-operations-pricing-guide",
    requirementsSlug: "field-service-operations-requirements-guide",
    evaluationSlug: "field-service-operations-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "schedule", label: "Schedule", short: "Jobs / visits" },
      { id: "dispatch", label: "Dispatch", short: "Crews / routes" },
      { id: "execute", label: "Execute", short: "Field / mobile" },
      { id: "cost", label: "Cost", short: "Estimates / jobs" },
      { id: "invoice", label: "Invoice", short: "Quote-to-cash" },
      { id: "review", label: "Review", short: "Job P&L / KPIs" },
    ],
    loopBody:
      "Field service and operations tools run a field loop: schedule jobs or appointments, dispatch crews, execute work on mobile, track job costing, invoice from the field, then review profitability. Construction, trades FSM, and appointment schedulers each emphasise different steps.",
    loopExample:
      "Example: Harbor Trades starts with ServiceM8-class dispatch because crews are mobile — then evaluates Contractor Foreman when multi-phase job costing outgrows simple work orders.",
    loopTip:
      "Write the primary field outcome first. Construction, trades dispatch, and appointment booking purchases fail for different reasons.",
    shapes: [
      {
        id: "construction",
        title: "Construction management",
        bestFor: "Job costing, schedules, and contractor financial workflows.",
        avoidWhen: "You only need salon-style appointment booking.",
      },
      {
        id: "trades-fsm",
        title: "Trades field service",
        bestFor: "Dispatch, quotes, invoicing, and mobile jobs for trades crews.",
        avoidWhen: "You need multi-phase commercial construction estimating depth only.",
      },
      {
        id: "appointments",
        title: "Appointment scheduling",
        bestFor: "Client booking, reminders, and local business management.",
        avoidWhen: "You need crew dispatch and job costing for construction sites.",
      },
    ],
    vs: {
      slug: "field-service-operations-vs-project-management-software",
      otherName: "project management software",
      otherCategory: "project-management",
      otherGuideSlug: "what-is-project-management-software",
      difference:
        "Field service and operations software owns crew dispatch, construction job costing, trades mobile workflows, and appointment booking. Project management software owns cross-functional boards, timelines, and Work OS planning — field ops depth is a different buyer job.",
      whenThis:
        "The blocking job is scheduling field crews, construction jobs, trades dispatch, or appointment-led local services.",
      whenOther:
        "The blocking job is generic work management boards, eng sprints, or docs-first planning — not field dispatch or job costing.",
    },
  },
  {
    categorySlug: "reputation-reviews",
    name: "reputation & review management software",
    bestSlug: "reputation-reviews-software",
    whatIsSlug: "what-is-reputation-reviews-software",
    howToChooseSlug: "how-to-choose-reputation-reviews-software",
    pricingSlug: "reputation-reviews-pricing-guide",
    requirementsSlug: "reputation-reviews-requirements-guide",
    evaluationSlug: "reputation-reviews-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "deliver", label: "Deliver", short: "Job / visit" },
      { id: "request", label: "Request", short: "Review ask" },
      { id: "collect", label: "Collect", short: "Google / social" },
      { id: "monitor", label: "Monitor", short: "Alerts" },
      { id: "respond", label: "Respond", short: "Reply workflow" },
      { id: "amplify", label: "Amplify", short: "Widgets / referrals" },
    ],
    loopBody:
      "Reputation tools run a proof loop: deliver the service, request a review, collect ratings on Google and social, monitor new feedback, respond from a unified workflow, then amplify social proof on-site and via referrals. Collection, monitoring, and response workflows each emphasise different steps.",
    loopExample:
      "Example: Harbor Plumbing automates SMS review asks after each job because Google rating is the bottleneck — not ticket SLAs in a helpdesk.",
    loopTip:
      "Write the primary reputation outcome first. Review collection and helpdesk ticketing purchases fail for different reasons.",
    shapes: [
      {
        id: "collection",
        title: "Review collection",
        bestFor: "Automated post-job review requests via SMS and email.",
        avoidWhen: "You only need enterprise social listening dashboards.",
      },
      {
        id: "monitoring",
        title: "Review monitoring",
        bestFor: "Alerts and dashboards for new reviews across platforms.",
        avoidWhen: "You need live chat widgets on your website.",
      },
      {
        id: "local-reputation",
        title: "Local reputation management",
        bestFor: "Multi-location Google and social reputation ops.",
        avoidWhen: "B2B helpdesk ticketing is the blocking job.",
      },
    ],
    vs: {
      slug: "reputation-reviews-vs-customer-service-software",
      otherName: "customer service software",
      otherCategory: "customer-service",
      otherGuideSlug: "what-is-customer-service-software",
      difference:
        "Reputation and review management software owns review collection, monitoring, and response workflows for public ratings. Customer service software owns helpdesk ticketing, live chat, and support queues — reputation modules there are adjacent, not peer replacements.",
      whenThis:
        "The blocking job is collecting reviews, managing Google reputation, or automating review requests.",
      whenOther:
        "The blocking job is ticket resolution, live chat support, or ITSM — not public review generation.",
    },
  },
  {
    categorySlug: "ai-writing",
    name: "AI writing software",
    bestSlug: "ai-writing-software",
    whatIsSlug: "what-is-ai-writing-software",
    howToChooseSlug: "how-to-choose-ai-writing-software",
    pricingSlug: "ai-writing-pricing-guide",
    requirementsSlug: "ai-writing-requirements-guide",
    evaluationSlug: "ai-writing-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "draft", label: "Draft", short: "Prompt / source" },
      { id: "rewrite", label: "Rewrite", short: "Paraphrase" },
      { id: "polish", label: "Polish", short: "Grammar" },
      { id: "optimize", label: "Optimize", short: "GEO / SEO" },
      { id: "publish", label: "Publish", short: "Export / CMS" },
      { id: "measure", label: "Measure", short: "Visibility" },
    ],
    loopBody:
      "AI writing tools run a copy loop: draft from a prompt or source text, rewrite with paraphrasing modes, polish grammar and tone, optimize for GEO/AEO or channel constraints, publish to docs or CMS, then measure visibility or engagement. Paraphrasing-first and GEO copy platforms each emphasise different steps.",
    loopExample:
      "Example: Harbor Marketing starts with QuillBot-class paraphrasing because polish volume is the bottleneck — then adds Writesonic when AI search content becomes the blocking job.",
    loopTip:
      "Write the primary writing outcome first. Paraphrasing and GEO copy purchases fail for different reasons.",
    shapes: [
      {
        id: "paraphrasing",
        title: "Paraphrasing & grammar",
        bestFor: "Rewrite, proofread, and polish existing text.",
        avoidWhen: "You need enterprise GEO dashboards and team content ops only.",
      },
      {
        id: "copy",
        title: "AI copywriting",
        bestFor: "Generate blogs, ads, and landing copy from prompts.",
        avoidWhen: "You only need sentence-level paraphrasing without long-form drafts.",
      },
      {
        id: "geo",
        title: "GEO / AEO content",
        bestFor: "Optimize content for AI search and answer engines.",
        avoidWhen: "Grammar-first student rewriting is the blocking job.",
      },
    ],
    vs: {
      slug: "ai-writing-vs-ai-software",
      otherName: "AI software",
      otherCategory: "ai",
      otherGuideSlug: "what-is-ai-software",
      difference:
        "AI writing software owns paraphrasing, grammar, marketing copy, and GEO/AEO workflows. General AI software spans LLM assistants, coding, image, video, and automation — writing modules there serve chat jobs, not specialist rewrite or GEO depth.",
      whenThis:
        "The blocking job is paraphrasing, grammar polishing, marketing copy, or GEO/AEO content.",
      whenOther:
        "The blocking job is general LLM chat, coding, image, video, or workflow automation — not writing-first tooling.",
    },
  },
  {
    categorySlug: "ai-website-builder",
    name: "AI website builder software",
    bestSlug: "ai-website-builder-software",
    whatIsSlug: "what-is-ai-website-builder-software",
    howToChooseSlug: "how-to-choose-ai-website-builder-software",
    pricingSlug: "ai-website-builder-pricing-guide",
    requirementsSlug: "ai-website-builder-requirements-guide",
    evaluationSlug: "ai-website-builder-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "prompt", label: "Prompt", short: "Describe surface" },
      { id: "generate", label: "Generate", short: "AI build" },
      { id: "edit", label: "Edit", short: "Brand / layout" },
      { id: "integrate", label: "Integrate", short: "Domain / API" },
      { id: "publish", label: "Publish", short: "Live URL" },
      { id: "iterate", label: "Iterate", short: "Ship updates" },
    ],
    loopBody:
      "AI website builders run a build loop: describe the site or app in a prompt, generate pages or logic, edit branding and layout, connect domains or APIs, publish to a live URL, then iterate on prompts. Prompt-to-site, agent-builder, and app-dev platforms each emphasise different steps.",
    loopExample:
      "Example: Harbor Startup starts with Wegic-class prompt-to-site because a marketing URL is the bottleneck — then adds MindStudio when an internal AI app becomes the blocking job.",
    loopTip:
      "Write the primary build surface first. Site generation and agent-builder purchases fail for different reasons.",
    shapes: [
      {
        id: "prompt-site",
        title: "Prompt-to-site",
        bestFor: "Marketing sites and landing pages from natural language.",
        avoidWhen: "You need custom agent logic or multi-step app workflows only.",
      },
      {
        id: "agent-app",
        title: "AI app / agent builder",
        bestFor: "No-code AI apps and internal agents with workflow depth.",
        avoidWhen: "You only need a simple marketing site without agent tooling.",
      },
      {
        id: "app-dev",
        title: "AI app development",
        bestFor: "Generate and ship lightweight app prototypes from prompts.",
        avoidWhen: "A drag-and-drop site builder without AI generation is enough.",
      },
    ],
    vs: {
      slug: "ai-website-builder-vs-ai-software",
      otherName: "AI software",
      otherCategory: "ai",
      otherGuideSlug: "what-is-ai-software",
      difference:
        "AI website builder software owns prompt-to-site, agent/app build, and lightweight app development workflows. General AI software spans LLM assistants, coding, image, video, and automation — build modules there serve chat jobs, not specialist site or app generation depth.",
      whenThis:
        "The blocking job is generating a site, landing page, AI app, or lightweight prototype from prompts.",
      whenOther:
        "The blocking job is general LLM chat, coding, image, video, or workflow automation — not build-from-prompt tooling.",
    },
  },
  {
    categorySlug: "social-media-management",
    name: "social media management software",
    bestSlug: "social-media-management-software",
    whatIsSlug: "what-is-social-media-management-software",
    howToChooseSlug: "how-to-choose-social-media-management-software",
    pricingSlug: "social-media-management-pricing-guide",
    requirementsSlug: "social-media-management-requirements-guide",
    evaluationSlug: "social-media-management-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "plan", label: "Plan", short: "Calendar / brief" },
      { id: "create", label: "Create", short: "Copy & creative" },
      { id: "approve", label: "Approve", short: "Brand sign-off" },
      { id: "publish", label: "Publish", short: "Network post" },
      { id: "reply", label: "Reply", short: "Inbox / comment" },
      { id: "measure", label: "Measure", short: "Engagement report" },
    ],
    loopBody:
      "Social media management tools run a publishing loop: plan a content calendar, create posts, approve with brand stakeholders, publish to connected profiles, reply in the social inbox, then measure engagement. Lightweight schedulers, team suites, and content-recycling workspaces each emphasise different steps.",
    loopExample:
      "Example: Harbor Studio starts with Buffer-class per-channel scheduling because posts still go out manually — then adds Hootsuite-class approvals when three brands share one calendar.",
    loopTip:
      "Write the weekly social outcome first. Per-channel schedulers, suite governance, and agency recycling workspaces fail for different reasons.",
    shapes: [
      {
        id: "scheduler",
        title: "Lightweight scheduler",
        bestFor: "Per-channel queues, free tiers, and simple multi-brand calendars.",
        avoidWhen: "You need enterprise approvals, routing, or deep inbox SLAs.",
      },
      {
        id: "suite",
        title: "Social suite",
        bestFor: "Multi-account governance, approvals, and team reporting.",
        avoidWhen: "You only need one channel and a lightweight queue.",
      },
      {
        id: "recycling",
        title: "Content recycling workspace",
        bestFor: "Category queues, evergreen recycling, and agency client workspaces.",
        avoidWhen: "Mention listening or influencer outreach is the blocking job.",
      },
    ],
    vs: {
      slug: "social-media-management-vs-marketing-software",
      otherName: "marketing software",
      otherCategory: "marketing",
      otherGuideSlug: "what-is-marketing-software",
      difference:
        "Social media management software owns calendars, publishing, approvals, and social inbox workflows. Generic marketing software owns funnels, MAP journeys, ESP campaigns, and cross-channel orchestration beyond social execution.",
      whenThis:
        "The blocking job is social calendars, publishing, approvals, or inbox replies.",
      whenOther:
        "The blocking job is funnels, lifecycle MAP, landing pages, PPC, or cross-channel campaign orchestration.",
    },
  },
  {
    categorySlug: "landing-pages-cro",
    name: "landing pages & CRO software",
    bestSlug: "landing-pages-cro-software",
    whatIsSlug: "what-is-landing-pages-cro-software",
    howToChooseSlug: "how-to-choose-landing-pages-cro-software",
    pricingSlug: "landing-pages-cro-pricing-guide",
    requirementsSlug: "landing-pages-cro-requirements-guide",
    evaluationSlug: "landing-pages-cro-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "brief", label: "Brief", short: "Offer & audience" },
      { id: "build", label: "Build", short: "Page / funnel" },
      { id: "capture", label: "Capture", short: "Forms & leads" },
      { id: "test", label: "Test", short: "A/B / CRO" },
      { id: "route", label: "Route", short: "CRM / ESP" },
      { id: "review", label: "Review", short: "Conversion KPI" },
    ],
    loopBody:
      "Landing pages and CRO software runs a conversion loop: brief the offer and audience, build landing or funnel pages, capture leads with forms, test variants for conversion lift, route leads to CRM or ESP, then review conversion KPIs.",
    loopExample:
      "Example: Northline Goods launches a Leadpages-class page with A/B headlines before wiring cart-abandon journeys in their ESP — the page job blocks revenue, not the nurture sequence.",
    loopTip:
      "Name whether the blocking job is standalone pages, funnel checkout, or on-site experimentation — page builders, funnel stacks, and CRO suites fail for different reasons.",
    shapes: [
      {
        id: "page-builder",
        title: "Landing page builder",
        bestFor: "Standalone conversion pages with templates, A/B tests, and forms.",
        avoidWhen: "You need full funnel checkout and membership inside one stack.",
      },
      {
        id: "funnel-stack",
        title: "Funnel stack",
        bestFor: "Multi-step funnels, checkout, and bundled marketing pages.",
        avoidWhen: "You only need one campaign landing page with testing.",
      },
      {
        id: "cro-suite",
        title: "On-site CRO suite",
        bestFor: "Experimentation, heatmaps, and behavioral tests on live sites.",
        avoidWhen: "You need a drag-and-drop landing builder as the weekly product.",
      },
    ],
    vs: {
      slug: "landing-pages-cro-vs-marketing-software",
      otherName: "marketing software",
      otherCategory: "marketing",
      otherGuideSlug: "what-is-marketing-software",
      difference:
        "Landing pages and CRO software owns on-page conversion, funnel structure, and experimentation. Generic marketing software spans MAP, ESP, social, and PPC — landing and CRO is one deferred sub-hub focused on pages and conversion lifts, not permission-based email alone.",
      whenThis:
        "The blocking job is landing pages, funnel sequences, forms, or on-site A/B and CRO.",
      whenOther:
        "The blocking job is ESP campaigns, MAP nurture, social calendars, or paid media automation.",
    },
  },
  {
    categorySlug: "ppc-advertising",
    name: "PPC advertising software",
    bestSlug: "ppc-advertising-software",
    whatIsSlug: "what-is-ppc-advertising-software",
    howToChooseSlug: "how-to-choose-ppc-advertising-software",
    pricingSlug: "ppc-advertising-pricing-guide",
    requirementsSlug: "ppc-advertising-requirements-guide",
    evaluationSlug: "ppc-advertising-evaluation-guide",
    includeReqEval: true,
    loop: [
      { id: "plan", label: "Plan", short: "Budget & goals" },
      { id: "build", label: "Build", short: "Campaigns / ads" },
      { id: "automate", label: "Automate", short: "Rules & pacing" },
      { id: "test", label: "Test", short: "Creative / bids" },
      { id: "report", label: "Report", short: "ROAS / CPA" },
      { id: "review", label: "Review", short: "Optimize spend" },
    ],
    loopBody:
      "PPC advertising software runs a paid-media loop: plan budgets and goals, build search or paid social campaigns, automate rules and budget pacing, test creatives and bids, report ROAS and CPA, then review spend allocation.",
    loopExample:
      "Example: Harbor Agency starts with Diginius-class search reporting because Google Ads outgrew spreadsheets — then adds Birch-class paid social rules when Meta spend needs automated pacing.",
    loopTip:
      "Scope search and display management versus paid social automation — those purchases fail for different reasons.",
    shapes: [
      {
        id: "ppc-management",
        title: "PPC management platform",
        bestFor: "Search and display campaign tooling, reporting, and agency workspaces.",
        avoidWhen: "You only need paid social rules on Meta without search depth.",
      },
      {
        id: "paid-social-auto",
        title: "Paid social automation",
        bestFor: "Rules, budget pacing, and creative testing across paid social channels.",
        avoidWhen: "The blocking job is Google Ads management and cross-channel agency reporting.",
      },
      {
        id: "native-ads-ui",
        title: "Native ad platform UI",
        bestFor: "Teams that manage campaigns only inside Google or Meta native consoles.",
        avoidWhen: "You need cross-account rules, pacing, or client reporting outside native UIs.",
      },
    ],
    vs: {
      slug: "ppc-advertising-vs-marketing-software",
      otherName: "marketing software",
      otherCategory: "marketing",
      otherGuideSlug: "what-is-marketing-software",
      difference:
        "PPC advertising software owns paid search and paid social campaign automation, pacing, and reporting. Generic marketing software spans organic social, ESP, MAP, and landing pages — PPC is a deferred sub-hub inside the parent.",
      whenThis:
        "The blocking job is paid search, paid social automation, budget pacing, or ROAS reporting.",
      whenOther:
        "The blocking job is organic social calendars, ESP sends, landing pages, or MAP nurture.",
    },
  },
];
