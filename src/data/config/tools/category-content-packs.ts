/**
 * Buyer-authored RFP + demo catalogs for published category tools.
 * Uses real catalogue use-case / capability slugs — not invented vendor facts.
 * Client-safe: does not import category-onboarding seeds.
 */

import type { NewToolCategorySlug } from "./category-tool-meta";
import type { DemoItemPriority } from "@/domain";

export type CategoryRfpScopeItem = {
  id: string;
  label: string;
  capabilitySlug?: string;
};

export type CategoryDemoScenario = {
  id: string;
  name: string;
  businessContext: string;
  persona: string;
  categoryId: string;
  startingState: string;
  vendorTasks: string[];
  expectedOutcome: string;
  successCriteria: string[];
  evidenceRequired: string[];
  priority: DemoItemPriority;
  estimatedMinutes: number;
  moderatorScript: string;
  capabilityHints: string[];
};

export type CategoryAuthoredRfpPack = {
  changeTriggers: readonly string[];
  scopeCatalog: CategoryRfpScopeItem[];
  userGroups: readonly string[];
  integrationCategories: readonly string[];
  migrationObjects: readonly string[];
};

export type CategoryAuthoredDemoPack = {
  evaluationAreas: Array<{ id: string; label: string }>;
  guidelines: string;
  functionalQuestions: Array<{ id: string; question: string }>;
  adminQuestions: Array<{ id: string; question: string }>;
  dataQuestions: Array<{ id: string; question: string }>;
  scenarios: CategoryDemoScenario[];
  integrationChecks: Array<{
    id: string;
    integration: string;
    testTask: string;
    required?: boolean;
  }>;
  adminTasks: Array<{
    id: string;
    category: "reporting" | "administration" | "ai" | "custom";
    label: string;
    vendorTask: string;
    successCriteria: string;
    evidenceRequired: string;
    estimatedMinutes: number;
    priority: DemoItemPriority;
  }>;
  commercialQuestions: Array<{
    id: string;
    topic: string;
    question: string;
  }>;
};

export type CategoryToolContentPack = {
  rfp: CategoryAuthoredRfpPack;
  demo: CategoryAuthoredDemoPack;
};

function guidelines(label: string, extras: string[]): string {
  return `DEMO GUIDELINES — ${label.toUpperCase()}

Please use the scenarios provided.

Prefer a standard product environment — not a cherry-picked demo tenant.

Clearly identify functionality that requires:
- a higher plan, seat pack, or usage tier
- add-ons or modules
- professional services / custom development
- third-party integrations
${extras.map((item) => `- ${item}`).join("\n")}

If a requested capability cannot be demonstrated, state that rather than substituting a different workflow.

Do not replace the buyer's sample data with a pre-built demo universe.
The buyer owns the demo agenda.`;
}

function scenario(input: {
  id: string;
  name: string;
  context: string;
  persona: string;
  categoryId: string;
  start: string;
  tasks: string[];
  outcome: string;
  criteria: string[];
  evidence?: string[];
  priority?: DemoItemPriority;
  minutes?: number;
  script: string;
  hints: string[];
}): CategoryDemoScenario {
  return {
    id: input.id,
    name: input.name,
    businessContext: input.context,
    persona: input.persona,
    categoryId: input.categoryId,
    startingState: input.start,
    vendorTasks: input.tasks,
    expectedOutcome: input.outcome,
    successCriteria: input.criteria,
    evidenceRequired: input.evidence ?? [
      "Live demonstration or explicit limitation statement",
      "Plan packaging note if gated",
    ],
    priority: input.priority ?? "must-have",
    estimatedMinutes: input.minutes ?? 10,
    moderatorScript: input.script,
    capabilityHints: input.hints,
  };
}

const SHARED_ADMIN_QUESTIONS = [
  { id: "Q-A-001", question: "Who can configure this in the proposed edition?" },
  {
    id: "Q-A-002",
    question: "Does configuration require vendor professional services?",
  },
  { id: "Q-A-003", question: "Can admins create or hide fields / templates?" },
  { id: "Q-A-004", question: "Can admins modify workflows without code?" },
  { id: "Q-A-005", question: "Can admins create reports and share them?" },
  {
    id: "Q-A-006",
    question: "Is SSO available on the quoted edition, or an add-on?",
  },
];

const SHARED_DATA_QUESTIONS = [
  { id: "Q-D-001", question: "Can buyer data be imported in the proposed plan?" },
  { id: "Q-D-002", question: "Can buyer data be exported without vendor help?" },
  {
    id: "Q-D-003",
    question: "Which objects / files are included in a full export?",
  },
  {
    id: "Q-D-004",
    question: "Are audit / history records included in export?",
  },
  {
    id: "Q-D-005",
    question: "What happens to data if the contract ends?",
  },
];

const SHARED_FUNCTIONAL_QUESTIONS = [
  {
    id: "Q-F-001",
    question: "Can this workflow be completed natively in the proposed edition?",
  },
  {
    id: "Q-F-002",
    question: "Does it require configuration vs custom development?",
  },
  {
    id: "Q-F-003",
    question: "Does it require another product, module, or add-on?",
  },
  {
    id: "Q-F-004",
    question: "Is it available to the buyer's user roles without extra seats?",
  },
  {
    id: "Q-F-005",
    question: "What cannot be demonstrated today (roadmap / quote-only)?",
  },
];

const SHARED_COMMERCIAL = [
  {
    id: "COM-001",
    topic: "Implementation",
    question: "What is included in onboarding vs paid professional services?",
  },
  {
    id: "COM-002",
    topic: "Training",
    question: "What admin and end-user training is included in the quoted edition?",
  },
  {
    id: "COM-003",
    topic: "Support",
    question: "What support hours, channels, and SLAs apply to the quoted plan?",
  },
  {
    id: "COM-004",
    topic: "Sandbox",
    question: "Is a sandbox / trial environment available for the quoted edition?",
  },
  {
    id: "COM-005",
    topic: "Exit",
    question: "What data export and deletion rights apply at contract end?",
  },
];

function sharedAdminTasks(
  prefix: string,
  reportTask: string,
): CategoryAuthoredDemoPack["adminTasks"] {
  return [
    {
      id: `${prefix}-ADM-001`,
      category: "reporting",
      label: "Standard report",
      vendorTask: reportTask,
      successCriteria:
        "Report uses live or imported sample data and a filter can be applied without vendor support.",
      evidenceRequired: "Screenshot of report + filter used",
      estimatedMinutes: 8,
      priority: "must-have",
    },
    {
      id: `${prefix}-ADM-002`,
      category: "administration",
      label: "Permission restriction",
      vendorTask:
        "Restrict a user so they cannot see another team's records or workspace.",
      successCriteria: "Restricted user cannot open out-of-scope records.",
      evidenceRequired: "Observed access attempt result",
      estimatedMinutes: 8,
      priority: "must-have",
    },
    {
      id: `${prefix}-ADM-003`,
      category: "administration",
      label: "Admin configuration",
      vendorTask:
        "Show who can configure fields, workflows, or templates in the proposed plan.",
      successCriteria: "Packaging and admin roles are stated explicitly.",
      evidenceRequired: "Plan packaging note",
      estimatedMinutes: 6,
      priority: "should-have",
    },
  ];
}

const PACKS: Record<NewToolCategorySlug, CategoryToolContentPack> = {
  marketing: {
    rfp: {
      changeTriggers: [
        "Campaigns live in too many disconnected tools",
        "No shared content calendar",
        "Weak attribution / reporting",
        "Landing pages and forms are slow to launch",
        "Social publishing is manual",
        "Need marketing automation without a full CRM rebuild",
        "Compliance / brand-approval gaps",
        "Team is growing",
      ],
      scopeCatalog: [
        { id: "social-scheduling", label: "Social scheduling", capabilitySlug: "social-scheduling" },
        { id: "content-calendar", label: "Content calendar", capabilitySlug: "content-calendar" },
        { id: "social-listening", label: "Social listening", capabilitySlug: "social-listening" },
        { id: "funnel-builder", label: "Funnel builder", capabilitySlug: "funnel-builder" },
        { id: "landing-pages", label: "Landing pages", capabilitySlug: "landing-pages" },
        { id: "marketing-automation", label: "Marketing automation", capabilitySlug: "marketing-automation" },
        { id: "forms-lead-capture", label: "Forms & lead capture", capabilitySlug: "forms-lead-capture" },
        { id: "analytics", label: "Analytics & attribution", capabilitySlug: "analytics" },
        { id: "email-sms-channels", label: "Email / SMS channels", capabilitySlug: "email-sms-channels" },
        { id: "ai-content-generation", label: "AI content generation (if claimed)", capabilitySlug: "ai-content-generation" },
        { id: "security-dpa", label: "Security / DPA" },
        { id: "trial-success-criteria", label: "Trial success criteria" },
      ],
      userGroups: [
        "Social / content marketers",
        "Demand gen",
        "Marketing ops",
        "Creative / brand",
        "IT / security",
        "Finance / procurement",
      ],
      integrationCategories: [
        "CRM",
        "Email / marketing automation",
        "Ad platforms",
        "Analytics",
        "CMS / website",
        "Identity / SSO",
        "Other",
      ],
      migrationObjects: [
        "Content calendar / scheduled posts",
        "Creative assets",
        "Landing pages / forms",
        "Audience segments",
        "Automation workflows",
        "Historical campaign reports",
      ],
    },
    demo: {
      evaluationAreas: [
        { id: "social-scheduling", label: "Social scheduling" },
        { id: "content-calendar", label: "Content calendar" },
        { id: "funnel-builder", label: "Funnel / landing pages" },
        { id: "marketing-automation", label: "Marketing automation" },
        { id: "analytics", label: "Analytics & attribution" },
        { id: "integrations", label: "Integrations" },
        { id: "administration", label: "Administration / approvals" },
        { id: "security", label: "Security / DPA" },
      ],
      guidelines: guidelines("Marketing", [
        "paid social connectors or ad-account permissions",
        "AI content features billed separately",
      ]),
      functionalQuestions: [
        ...SHARED_FUNCTIONAL_QUESTIONS,
        {
          id: "MKT-Q-F-006",
          question: "Can approval workflows gate publishing to live channels?",
        },
      ],
      adminQuestions: SHARED_ADMIN_QUESTIONS,
      dataQuestions: SHARED_DATA_QUESTIONS,
      scenarios: [
        scenario({
          id: "tmpl-mkt-calendar-publish",
          name: "Content calendar → scheduled publish",
          context: "Marketing needs one calendar across networks without spreadsheet handoffs.",
          persona: "Social manager",
          categoryId: "social-scheduling",
          start: "Buyer provides 3 sample posts and target networks.",
          tasks: [
            "Place posts on a shared calendar",
            "Schedule to at least two networks",
            "Show approval if claimed",
            "State which networks need a higher plan",
          ],
          outcome: "Posts are scheduled from one calendar in the proposed edition.",
          criteria: ["Multi-network schedule completes", "Plan gates are stated"],
          script:
            "Using our sample posts, put them on a shared calendar and schedule to two networks. Show any approval step. Do not skip to a pre-built campaign.",
          hints: ["social-scheduling", "content-calendar"],
        }),
        scenario({
          id: "tmpl-mkt-landing-form",
          name: "Landing page + lead capture",
          context: "Demand gen needs a page and form without waiting on engineering.",
          persona: "Demand gen manager",
          categoryId: "landing-pages",
          start: "Buyer provides headline, offer, and three form fields.",
          tasks: [
            "Build or duplicate a landing page",
            "Add a form with the requested fields",
            "Show where submissions land",
            "State CRM / email sync packaging",
          ],
          outcome: "A publishable page and form exist in the proposed edition.",
          criteria: ["Form fields match the brief", "Destination of leads is shown"],
          script:
            "Build a simple landing page and form from our brief. Show where the lead goes and which plan includes CRM or email sync.",
          hints: ["landing-pages", "forms-lead-capture"],
        }),
        scenario({
          id: "tmpl-mkt-automation",
          name: "Simple nurture automation",
          context: "A new lead should enter a time-based or behaviour-based nurture.",
          persona: "Marketing ops",
          categoryId: "marketing-automation",
          start: "A sample lead exists or can be created in-session.",
          tasks: [
            "Create a two-step automation",
            "Show entry criteria",
            "Show what happens if the lead is already a customer",
            "State email/SMS channel packaging",
          ],
          outcome: "Automation runs without custom development in the proposed edition.",
          criteria: ["Entry rules visible", "Channel packaging disclosed"],
          script:
            "Build a two-step nurture for a new lead. Show entry rules and whether email/SMS is native or an add-on.",
          hints: ["marketing-automation", "email-sms-channels"],
        }),
        scenario({
          id: "tmpl-mkt-attribution",
          name: "Campaign reporting / attribution",
          context: "Leadership wants campaign performance without a spreadsheet export.",
          persona: "Marketing manager",
          categoryId: "analytics",
          start: "Sample campaign data in a standard environment.",
          tasks: [
            "Open a campaign or channel report",
            "Apply a date and channel filter",
            "Show what is modelled vs last-click if claimed",
            "State any analytics add-on",
          ],
          outcome: "Buyer sees how attribution is calculated in the quoted edition.",
          criteria: ["Filter works", "Methodology is stated, not invented"],
          priority: "should-have",
          script:
            "Open campaign reporting, filter by date/channel, and explain what the numbers actually measure. Do not invent multi-touch models.",
          hints: ["analytics"],
        }),
        scenario({
          id: "tmpl-mkt-listening",
          name: "Social listening (if in scope)",
          context: "Brand wants mention alerts without a separate listening suite if claimed.",
          persona: "Brand marketer",
          categoryId: "social-listening",
          start: "A brand or keyword the buyer specifies.",
          tasks: [
            "Create a listening query or stream",
            "Show alert or inbox handling",
            "State coverage limits and plan gates",
          ],
          outcome: "Listening is demonstrated or explicitly out of the quoted edition.",
          criteria: ["Limitation stated if not included"],
          priority: "should-have",
          minutes: 8,
          script:
            "If listening is in the quoted edition, set up a query on our brand term and show alerts. If not, say so.",
          hints: ["social-listening"],
        }),
      ],
      integrationChecks: [
        { id: "MKT-INT-001", integration: "CRM", testTask: "Show how captured leads sync, including direction and duplicate handling." },
        { id: "MKT-INT-002", integration: "Email / SMS channel", testTask: "Show whether email/SMS sending is native or a connected tool, and which plan includes it." },
        { id: "MKT-INT-003", integration: "Ad platforms", testTask: "Show any claimed ad-account or audience sync and which plan includes it." },
        { id: "MKT-INT-004", integration: "SSO / identity", testTask: "Show SSO availability on the quoted edition." },
      ],
      adminTasks: sharedAdminTasks(
        "MKT",
        "Open a campaign or channel report and apply a date filter.",
      ),
      commercialQuestions: SHARED_COMMERCIAL,
    },
  },
  "email-marketing": {
    rfp: {
      changeTriggers: [
        "Current sender has deliverability or list-hygiene gaps",
        "Automation is too limited",
        "Ecommerce / product data is not in campaigns",
        "Templates are hard for non-marketers",
        "Need segmentation without a full CRM",
        "Migrating off a spreadsheet or basic newsletter tool",
        "Compliance / consent gaps",
        "Cost of contacts vs value is unclear",
      ],
      scopeCatalog: [
        { id: "email-campaigns", label: "Email campaigns", capabilitySlug: "email-campaigns" },
        { id: "newsletter-builder", label: "Newsletter builder", capabilitySlug: "newsletter-builder" },
        { id: "email-templates", label: "Email templates", capabilitySlug: "email-templates" },
        { id: "automation-workflows", label: "Automation workflows", capabilitySlug: "automation-workflows" },
        { id: "segmentation", label: "Segmentation", capabilitySlug: "segmentation" },
        { id: "personalization", label: "Personalization", capabilitySlug: "personalization" },
        { id: "ab-testing", label: "A/B testing", capabilitySlug: "ab-testing" },
        { id: "contact-management", label: "Contact / subscriber management", capabilitySlug: "contact-management" },
        { id: "deliverability-tools", label: "Deliverability tools", capabilitySlug: "deliverability-tools" },
        { id: "landing-pages", label: "Landing pages / forms", capabilitySlug: "landing-pages" },
        { id: "security-dpa", label: "Security / DPA" },
        { id: "trial-success-criteria", label: "Trial success criteria" },
      ],
      userGroups: [
        "Email marketers",
        "Ecommerce merchandising",
        "Marketing ops",
        "Creators / founders",
        "IT / security",
        "Legal / compliance",
      ],
      integrationCategories: [
        "Ecommerce storefront",
        "CRM",
        "CMS / website",
        "Analytics",
        "Identity / SSO",
        "Other",
      ],
      migrationObjects: [
        "Subscriber lists and consent flags",
        "Suppression / unsubscribe lists",
        "Templates",
        "Automations",
        "Historical campaign stats (if transferable)",
        "Landing pages / forms",
      ],
    },
    demo: {
      evaluationAreas: [
        { id: "email-campaigns", label: "Campaign builder" },
        { id: "automation-workflows", label: "Automation" },
        { id: "segmentation", label: "Segmentation" },
        { id: "deliverability-tools", label: "Deliverability" },
        { id: "contact-management", label: "List / consent" },
        { id: "integrations", label: "Integrations" },
        { id: "administration", label: "Administration" },
        { id: "security", label: "Security / DPA" },
      ],
      guidelines: guidelines("Email marketing", [
        "contact-tier overages",
        "dedicated IP or deliverability add-ons",
      ]),
      functionalQuestions: [
        ...SHARED_FUNCTIONAL_QUESTIONS,
        {
          id: "EM-Q-F-006",
          question: "How are unsubscribes and suppression lists enforced on send?",
        },
      ],
      adminQuestions: SHARED_ADMIN_QUESTIONS,
      dataQuestions: SHARED_DATA_QUESTIONS,
      scenarios: [
        scenario({
          id: "tmpl-em-newsletter",
          name: "Newsletter from template",
          context: "A marketer needs to send a branded newsletter without a designer.",
          persona: "Email marketer",
          categoryId: "newsletters",
          start: "Buyer provides logo, two content blocks, and a from-name.",
          tasks: [
            "Create a campaign from a template",
            "Edit two blocks",
            "Show preview and test send options",
            "State contact-tier or send limits",
          ],
          outcome: "A send-ready campaign exists in the proposed edition.",
          criteria: ["Template edited without code", "Limits disclosed"],
          script:
            "Build a newsletter from a template using our two content blocks. Show preview/test send and any contact or send limits.",
          hints: ["email-campaigns", "newsletter-builder", "email-templates"],
        }),
        scenario({
          id: "tmpl-em-automation",
          name: "Welcome or nurture automation",
          context: "New subscribers should receive a two-step welcome without engineering.",
          persona: "Marketing ops",
          categoryId: "marketing-automation",
          start: "A list or segment the buyer can use.",
          tasks: [
            "Create a two-email automation",
            "Show trigger (signup / tag / purchase)",
            "Show how someone exits if they unsubscribe",
            "State automation plan gates",
          ],
          outcome: "Automation is native in the proposed edition or explicitly add-on.",
          criteria: ["Trigger visible", "Unsubscribe path stated"],
          script:
            "Create a two-step welcome automation. Show the trigger and what happens on unsubscribe. State if automation is gated.",
          hints: ["automation-workflows"],
        }),
        scenario({
          id: "tmpl-em-segment",
          name: "Segment from behaviour or ecommerce data",
          context: "Buyer wants a segment of engaged or high-intent subscribers.",
          persona: "Ecommerce marketer",
          categoryId: "segmentation",
          start: "Sample list in a standard environment.",
          tasks: [
            "Build a segment from opens, tags, or purchase fields",
            "Show count and whether it is live",
            "State which data requires a store connector",
          ],
          outcome: "Segment rules are transparent for the quoted edition.",
          criteria: ["Rules visible", "Connector packaging disclosed"],
          script:
            "Build a segment from engagement or store data you claim to support. Show whether it updates live and which plan includes the connector.",
          hints: ["segmentation", "ecommerce-email"],
        }),
        scenario({
          id: "tmpl-em-deliverability",
          name: "Deliverability / list hygiene view",
          context: "Buyer will not buy a tool that hides bounce and complaint handling.",
          persona: "Marketing ops",
          categoryId: "deliverability-tools",
          start: "Standard account with any deliverability dashboard claimed.",
          tasks: [
            "Open bounce / complaint / domain authentication views",
            "Show SPF/DKIM/DMARC guidance if claimed",
            "State dedicated IP packaging",
          ],
          outcome: "Deliverability tooling is demonstrated or marked quote-only.",
          criteria: ["Limitations stated"],
          priority: "should-have",
          script:
            "Show bounce, complaint, and domain authentication views you claim. Do not invent inbox-placement percentages.",
          hints: ["deliverability-tools"],
        }),
        scenario({
          id: "tmpl-em-consent",
          name: "Consent and preference centre",
          context: "Legal needs proof that unsubscribe and preferences are honoured.",
          persona: "Compliance owner",
          categoryId: "contact-management",
          start: "A sample subscriber record.",
          tasks: [
            "Show consent / source fields",
            "Show preference or unsubscribe handling",
            "Show export of consent records",
          ],
          outcome: "Consent handling is visible in the proposed edition.",
          criteria: ["Unsubscribe is honoured in-product"],
          script:
            "Open a subscriber, show consent source, and demonstrate unsubscribe / preference updates.",
          hints: ["contact-management"],
        }),
      ],
      integrationChecks: [
        { id: "EM-INT-001", integration: "Ecommerce storefront", testTask: "Show product or purchase data available for campaigns and which plan includes the connector." },
        { id: "EM-INT-002", integration: "CRM", testTask: "Show contact sync direction and what overwrites CRM fields." },
        { id: "EM-INT-003", integration: "Website / forms", testTask: "Show form or landing-page capture into the list." },
        { id: "EM-INT-004", integration: "SSO / identity", testTask: "Show SSO availability on the quoted edition." },
      ],
      adminTasks: sharedAdminTasks(
        "EM",
        "Open a campaign performance report and filter by date or list.",
      ),
      commercialQuestions: [
        ...SHARED_COMMERCIAL,
        {
          id: "EM-COM-006",
          topic: "Contacts",
          question: "What counts as a billable contact, and what happens at overage?",
        },
      ],
    },
  },
  "business-communications": {
    rfp: {
      changeTriggers: [
        "Outgrown consumer calling / messaging tools",
        "No shared number or queue",
        "Need call recording / compliance",
        "Sales dialing is manual",
        "WhatsApp or SMS is disconnected from the team inbox",
        "Need CRM click-to-call",
        "Contact-center routing is missing",
        "Team chat and calling are split across vendors",
      ],
      scopeCatalog: [
        { id: "cloud-phone", label: "Cloud phone / VoIP", capabilitySlug: "cloud-phone" },
        { id: "call-routing", label: "Call routing & IVR", capabilitySlug: "call-routing" },
        { id: "call-recording", label: "Call recording", capabilitySlug: "call-recording" },
        { id: "power-dialer", label: "Power dialer", capabilitySlug: "power-dialer" },
        { id: "sms-messaging", label: "SMS messaging", capabilitySlug: "sms-messaging" },
        { id: "whatsapp-business", label: "WhatsApp Business", capabilitySlug: "whatsapp-business" },
        { id: "shared-inbox", label: "Shared inbox", capabilitySlug: "shared-inbox" },
        { id: "team-messaging", label: "Team messaging", capabilitySlug: "team-messaging" },
        { id: "crm-cti", label: "CRM / CTI integrations", capabilitySlug: "crm-cti" },
        { id: "analytics-reporting", label: "Analytics & reporting", capabilitySlug: "analytics-reporting" },
        { id: "security-dpa", label: "Security / DPA" },
        { id: "trial-success-criteria", label: "Trial success criteria" },
      ],
      userGroups: [
        "Reception / front desk",
        "Sales callers",
        "Support agents",
        "Team leads",
        "IT / telephony admin",
        "Compliance",
      ],
      integrationCategories: [
        "CRM",
        "Helpdesk",
        "Calendar",
        "Identity / SSO",
        "Contact center / WFM",
        "Other",
      ],
      migrationObjects: [
        "Phone numbers / porting",
        "IVR / call flows",
        "Call recordings (if transferable)",
        "SMS / WhatsApp templates",
        "User extensions",
        "Call queues",
      ],
    },
    demo: {
      evaluationAreas: [
        { id: "cloud-phone", label: "Cloud phone / VoIP" },
        { id: "call-routing", label: "Routing / IVR" },
        { id: "shared-inbox", label: "Shared inbox / messaging" },
        { id: "whatsapp-business", label: "WhatsApp / SMS" },
        { id: "crm-cti", label: "CRM / CTI" },
        { id: "call-recording", label: "Recording / compliance" },
        { id: "administration", label: "Administration" },
        { id: "security", label: "Security / DPA" },
      ],
      guidelines: guidelines("Business communications", [
        "number porting or local DIDs",
        "WhatsApp / SMS usage fees",
        "call recording storage add-ons",
      ]),
      functionalQuestions: [
        ...SHARED_FUNCTIONAL_QUESTIONS,
        {
          id: "BC-Q-F-006",
          question: "Which geographies and number types are included vs surcharge?",
        },
      ],
      adminQuestions: SHARED_ADMIN_QUESTIONS,
      dataQuestions: SHARED_DATA_QUESTIONS,
      scenarios: [
        scenario({
          id: "tmpl-bc-inbound-ivr",
          name: "Inbound call → IVR → queue",
          context: "Callers must reach the right queue without a receptionist.",
          persona: "Office manager",
          categoryId: "business-phone",
          start: "A demo number or sandbox call flow.",
          tasks: [
            "Show IVR options",
            "Route to a queue",
            "Show missed-call handling",
            "State recording packaging",
          ],
          outcome: "Inbound routing works in the proposed edition.",
          criteria: ["Queue routing demonstrated", "Recording plan gate stated"],
          script:
            "Walk an inbound call through IVR into a queue. Show missed-call behaviour and whether recording is included.",
          hints: ["cloud-phone", "call-routing"],
        }),
        scenario({
          id: "tmpl-bc-shared-inbox",
          name: "Shared SMS / messaging inbox",
          context: "The team must not lose customer messages in personal phones.",
          persona: "Support lead",
          categoryId: "customer-messaging",
          start: "A shared number or inbox in a standard environment.",
          tasks: [
            "Receive or simulate a customer message",
            "Assign / reply from a shared inbox",
            "Show internal notes",
            "State SMS/WhatsApp usage pricing",
          ],
          outcome: "Shared inbox is usable in the proposed edition.",
          criteria: ["Assignment works", "Usage pricing disclosed"],
          script:
            "Handle a customer SMS or chat in a shared inbox. Show assignment and whether WhatsApp/SMS is usage-priced.",
          hints: ["shared-inbox", "sms-messaging"],
        }),
        scenario({
          id: "tmpl-bc-dialer",
          name: "Sales click-to-call / dialer",
          context: "Sales wants to call a list without personal mobiles.",
          persona: "Sales caller",
          categoryId: "sales-calling",
          start: "A short sample contact list.",
          tasks: [
            "Place an outbound call from the product",
            "Log the outcome",
            "Show CRM writeback if claimed",
            "State dialer vs basic calling packaging",
          ],
          outcome: "Outbound calling is demonstrated in the quoted edition.",
          criteria: ["Call can be placed", "CRM connector packaging disclosed"],
          script:
            "Call from a sample contact. Log the result and show CRM logging if you claim it. State if power dialer is a higher plan.",
          hints: ["power-dialer", "crm-cti"],
        }),
        scenario({
          id: "tmpl-bc-whatsapp",
          name: "WhatsApp Business conversation (if in scope)",
          context: "Customer prefers WhatsApp; buyer needs a team inbox, not a personal phone.",
          persona: "Support agent",
          categoryId: "whatsapp-support",
          start: "WhatsApp channel if included in the quote.",
          tasks: [
            "Show template or session message handling",
            "Show assignment",
            "State Meta / usage fees vs seat fees",
          ],
          outcome: "WhatsApp is in the quoted edition or explicitly excluded.",
          criteria: ["Fees disclosed"],
          priority: "should-have",
          script:
            "If WhatsApp is in the quote, handle a customer conversation in the team inbox and explain session vs template fees.",
          hints: ["whatsapp-business"],
        }),
        scenario({
          id: "tmpl-bc-recording",
          name: "Recording access and retention",
          context: "Compliance needs to know who can hear recordings and for how long.",
          persona: "Compliance owner",
          categoryId: "call-recording",
          start: "A recorded sample call if recording is claimed.",
          tasks: [
            "Play or open a recording",
            "Show who can access it",
            "State retention and storage packaging",
          ],
          outcome: "Recording access model is explicit.",
          criteria: ["Access control shown", "Retention stated"],
          priority: "should-have",
          minutes: 8,
          script:
            "Open a recording, show access control, and state retention. If recording is add-on, say so.",
          hints: ["call-recording"],
        }),
      ],
      integrationChecks: [
        { id: "BC-INT-001", integration: "CRM / CTI", testTask: "Show click-to-call and what activity writes back, including edition gates." },
        { id: "BC-INT-002", integration: "Helpdesk", testTask: "Show whether tickets or conversations sync, and which plan includes it." },
        { id: "BC-INT-003", integration: "Calendar", testTask: "Show presence or meeting-dial packaging if claimed." },
        { id: "BC-INT-004", integration: "SSO / identity", testTask: "Show SSO availability on the quoted edition." },
      ],
      adminTasks: sharedAdminTasks(
        "BC",
        "Open a call or message volume report and filter by queue or agent.",
      ),
      commercialQuestions: [
        ...SHARED_COMMERCIAL,
        {
          id: "BC-COM-006",
          topic: "Usage",
          question: "What calling, SMS, or WhatsApp usage is included vs overage?",
        },
      ],
    },
  },
  "customer-service": {
    rfp: {
      changeTriggers: [
        "Shared inbox / email does not scale",
        "No SLAs or routing",
        "Knowledge base is outdated or missing",
        "Chat and email are disconnected",
        "Need ecommerce order context in tickets",
        "ITSM / internal service desk required",
        "AI deflection claimed but unproven",
        "CSAT is not measured",
      ],
      scopeCatalog: [
        { id: "ticketing", label: "Ticketing", capabilitySlug: "ticketing" },
        { id: "shared-inbox", label: "Shared inbox", capabilitySlug: "shared-inbox" },
        { id: "live-chat", label: "Live chat", capabilitySlug: "live-chat" },
        { id: "knowledge-base", label: "Knowledge base", capabilitySlug: "knowledge-base" },
        { id: "omnichannel-inbox", label: "Omnichannel inbox", capabilitySlug: "omnichannel-inbox" },
        { id: "sla-routing", label: "SLA & routing", capabilitySlug: "sla-routing" },
        { id: "macros-automation", label: "Macros & automation", capabilitySlug: "macros-automation" },
        { id: "self-service-portal", label: "Self-service portal", capabilitySlug: "self-service-portal" },
        { id: "csat-surveys", label: "CSAT / satisfaction surveys", capabilitySlug: "csat-surveys" },
        { id: "chatbot-ai-agent", label: "Chatbot / AI agent (if claimed)", capabilitySlug: "chatbot-ai-agent" },
        { id: "security-dpa", label: "Security / DPA" },
        { id: "trial-success-criteria", label: "Trial success criteria" },
      ],
      userGroups: [
        "Support agents",
        "Team leads",
        "Knowledge authors",
        "Ecommerce ops",
        "IT / service desk",
        "IT / security",
      ],
      integrationCategories: [
        "Ecommerce storefront",
        "CRM",
        "Telephony",
        "Identity / SSO",
        "Billing",
        "Other",
      ],
      migrationObjects: [
        "Open and closed tickets",
        "Macros / automations",
        "Knowledge articles",
        "Customer profiles",
        "SLAs",
        "Help Center content",
      ],
    },
    demo: {
      evaluationAreas: [
        { id: "ticketing", label: "Ticketing / shared inbox" },
        { id: "sla-routing", label: "SLA & routing" },
        { id: "knowledge-base", label: "Knowledge base" },
        { id: "live-chat", label: "Live chat" },
        { id: "omnichannel-inbox", label: "Omnichannel" },
        { id: "chatbot-ai-agent", label: "AI agent (optional)" },
        { id: "administration", label: "Administration" },
        { id: "security", label: "Security / DPA" },
      ],
      guidelines: guidelines("Customer service", [
        "AI agent or copilot add-ons",
        "advanced omnichannel packs",
      ]),
      functionalQuestions: [
        ...SHARED_FUNCTIONAL_QUESTIONS,
        {
          id: "CS-Q-F-006",
          question: "How is collision avoidance handled when two agents open the same ticket?",
        },
      ],
      adminQuestions: SHARED_ADMIN_QUESTIONS,
      dataQuestions: SHARED_DATA_QUESTIONS,
      scenarios: [
        scenario({
          id: "tmpl-cs-ticket-sla",
          name: "New ticket → route → SLA",
          context: "Inbound email must become a ticket with owner and SLA.",
          persona: "Support agent",
          categoryId: "helpdesk-ticketing",
          start: "A sample inbound email or form submission.",
          tasks: [
            "Create or capture the ticket",
            "Show routing / assignment",
            "Show SLA clock",
            "Apply a macro",
          ],
          outcome: "Ticket is owned with SLA in the proposed edition.",
          criteria: ["Owner assigned", "SLA visible", "Macro applied"],
          script:
            "Turn our inbound request into a ticket, assign it, show the SLA, and apply a macro. State if SLAs are gated.",
          hints: ["ticketing", "sla-routing", "macros-automation"],
        }),
        scenario({
          id: "tmpl-cs-kb",
          name: "Knowledge article + self-service",
          context: "Deflection requires a public article customers can find.",
          persona: "Knowledge author",
          categoryId: "knowledge-base-self-service",
          start: "Buyer provides a short how-to topic.",
          tasks: [
            "Create or edit an article",
            "Publish to the help center if claimed",
            "Show search from the customer view",
            "State help-center packaging",
          ],
          outcome: "Article is findable in the quoted edition or marked add-on.",
          criteria: ["Publish path shown", "Packaging disclosed"],
          script:
            "Publish a short article and search for it as a customer. If the help center is add-on, say so.",
          hints: ["knowledge-base", "self-service-portal"],
        }),
        scenario({
          id: "tmpl-cs-chat",
          name: "Live chat handoff",
          context: "Website visitors need chat that becomes a ticket if missed.",
          persona: "Support agent",
          categoryId: "live-chat-support",
          start: "A widget in a standard environment.",
          tasks: [
            "Start a chat as the visitor",
            "Handoff to an agent",
            "Show missed-chat ticket creation",
            "State chat plan gates",
          ],
          outcome: "Chat is in the quoted edition or explicitly excluded.",
          criteria: ["Handoff works or limitation stated"],
          script:
            "Start a visitor chat, hand it to an agent, and show what happens if no one answers.",
          hints: ["live-chat"],
        }),
        scenario({
          id: "tmpl-cs-ecommerce",
          name: "Order context on the ticket (if in scope)",
          context: "Agents should see recent orders without leaving the helpdesk.",
          persona: "Ecommerce support agent",
          categoryId: "ecommerce-support",
          start: "A sample customer with an order if the connector is claimed.",
          tasks: [
            "Open a ticket for a store customer",
            "Show order / shipment fields",
            "State which store platforms and plans include this",
          ],
          outcome: "Order context is real or explicitly not in the quote.",
          criteria: ["Connector packaging disclosed"],
          priority: "should-have",
          script:
            "Open a ticket and show live order context if you claim it. Name the store platform and plan required.",
          hints: ["ecommerce-helpdesk"],
        }),
        scenario({
          id: "tmpl-cs-ai",
          name: "AI agent / copilot (if claimed)",
          context: "Buyer will not accept a canned AI demo on unrelated FAQs.",
          persona: "Support lead",
          categoryId: "ai-customer-service",
          start: "Buyer's sample question against their articles if possible.",
          tasks: [
            "Answer a buyer-supplied question",
            "Show confidence / escalation to human",
            "State AI add-on pricing",
          ],
          outcome: "AI claims are demonstrated on buyer content or withdrawn.",
          criteria: ["Escalation path shown", "Add-on disclosed"],
          priority: "should-have",
          script:
            "Use our question against your knowledge. Show when it escalates. Do not substitute an unrelated demo bot.",
          hints: ["chatbot-ai-agent", "agent-copilot"],
        }),
      ],
      integrationChecks: [
        { id: "CS-INT-001", integration: "Ecommerce storefront", testTask: "Show order/customer context on a ticket and which plan includes the connector." },
        { id: "CS-INT-002", integration: "CRM", testTask: "Show contact sync and what overwrites customer records." },
        { id: "CS-INT-003", integration: "Telephony", testTask: "Show call logging or voice channel packaging if claimed." },
        { id: "CS-INT-004", integration: "SSO / identity", testTask: "Show SSO availability on the quoted edition." },
      ],
      adminTasks: sharedAdminTasks(
        "CS",
        "Open a helpdesk report (volume, SLA, or CSAT) and apply a filter.",
      ),
      commercialQuestions: SHARED_COMMERCIAL,
    },
  },
  "project-management": {
    rfp: {
      changeTriggers: [
        "Work lives in spreadsheets and chat",
        "No shared timeline for leadership",
        "Resource / capacity planning is missing",
        "Too many disconnected work tools",
        "Need automations without engineering",
        "Reporting is manual",
        "Cross-team collaboration is unstructured",
        "Need time tracking",
      ],
      scopeCatalog: [
        { id: "task-boards", label: "Task boards & work views", capabilitySlug: "task-boards" },
        { id: "timeline-gantt", label: "Timeline / Gantt", capabilitySlug: "timeline-gantt" },
        { id: "workload-resources", label: "Workload & resource management", capabilitySlug: "workload-resources" },
        { id: "automations-workflows", label: "Automations & workflows", capabilitySlug: "automations-workflows" },
        { id: "time-tracking", label: "Time tracking", capabilitySlug: "time-tracking" },
        { id: "docs-collaboration", label: "Docs & collaboration", capabilitySlug: "docs-collaboration" },
        { id: "integrations-ecosystem", label: "Integrations ecosystem", capabilitySlug: "integrations-ecosystem" },
        { id: "reporting-dashboards", label: "Reporting & dashboards", capabilitySlug: "reporting-dashboards" },
        { id: "security-dpa", label: "Security / DPA" },
        { id: "trial-success-criteria", label: "Trial success criteria" },
      ],
      userGroups: [
        "Project managers",
        "Team members",
        "Resource / PMO",
        "Exec sponsors",
        "IT / security",
        "Finance",
      ],
      integrationCategories: [
        "Docs / file storage",
        "Chat",
        "Calendar",
        "Dev tools",
        "Identity / SSO",
        "Other",
      ],
      migrationObjects: [
        "Projects / boards",
        "Tasks and assignees",
        "Comments / files",
        "Automations",
        "Dashboards",
        "Time entries",
      ],
    },
    demo: {
      evaluationAreas: [
        { id: "task-boards", label: "Boards / work views" },
        { id: "timeline-gantt", label: "Timeline / Gantt" },
        { id: "workload-resources", label: "Workload" },
        { id: "automations-workflows", label: "Automations" },
        { id: "reporting-dashboards", label: "Reporting" },
        { id: "integrations", label: "Integrations" },
        { id: "administration", label: "Administration" },
        { id: "security", label: "Security / DPA" },
      ],
      guidelines: guidelines("Project management", [
        "guest / client access packs",
        "advanced Gantt or workload add-ons",
      ]),
      functionalQuestions: [
        ...SHARED_FUNCTIONAL_QUESTIONS,
        {
          id: "PM-Q-F-006",
          question: "Can guests or clients see only the items they should?",
        },
      ],
      adminQuestions: SHARED_ADMIN_QUESTIONS,
      dataQuestions: SHARED_DATA_QUESTIONS,
      scenarios: [
        scenario({
          id: "tmpl-pm-board",
          name: "New work item on a board",
          context: "A PM needs to capture work, owner, and due date without a spreadsheet.",
          persona: "Project manager",
          categoryId: "work-management",
          start: "A sample workspace with one board or list.",
          tasks: [
            "Create a work item",
            "Assign owner and due date",
            "Move it across statuses",
            "Show a second view (calendar or timeline) if claimed",
          ],
          outcome: "Item is tracked in the proposed edition.",
          criteria: ["Owner and due date persist", "View packaging disclosed"],
          script:
            "Create a work item, assign it, set a due date, and show another view if you claim it. State if timeline is gated.",
          hints: ["task-boards", "timeline-gantt"],
        }),
        scenario({
          id: "tmpl-pm-timeline",
          name: "Timeline / Gantt for leadership",
          context: "Executives want dates and dependencies, not only a Kanban board.",
          persona: "PMO",
          categoryId: "timeline-reporting",
          start: "A small set of dated tasks.",
          tasks: [
            "Open timeline / Gantt",
            "Show a dependency if claimed",
            "Export or share a view",
            "State plan gates",
          ],
          outcome: "Timeline is in the quoted edition or marked add-on.",
          criteria: ["Dates visible", "Packaging disclosed"],
          script:
            "Show the same work on a timeline. If dependencies or Gantt are add-on, say so.",
          hints: ["timeline-gantt"],
        }),
        scenario({
          id: "tmpl-pm-workload",
          name: "Workload / capacity view",
          context: "Managers need to see who is overloaded before committing dates.",
          persona: "Team lead",
          categoryId: "resource-planning",
          start: "Several assignees with overlapping dates.",
          tasks: [
            "Open workload / capacity",
            "Show an overloaded person",
            "State whether this is native or higher plan",
          ],
          outcome: "Capacity view is demonstrated or excluded.",
          criteria: ["Limitation stated if gated"],
          priority: "should-have",
          script:
            "Show workload for the sample assignees. If this view is not in the quoted edition, say so.",
          hints: ["workload-resources"],
        }),
        scenario({
          id: "tmpl-pm-automation",
          name: "Status-change automation",
          context: "Notify or assign without a person watching the board.",
          persona: "Project manager",
          categoryId: "work-management",
          start: "A board with statuses.",
          tasks: [
            "Create an automation on status change",
            "Trigger it live",
            "State automation limits",
          ],
          outcome: "Automation runs in the proposed edition.",
          criteria: ["Live trigger works", "Limits disclosed"],
          script:
            "Create a simple status-change automation and fire it. State monthly automation limits if any.",
          hints: ["automations-workflows"],
        }),
        scenario({
          id: "tmpl-pm-report",
          name: "Status report / dashboard",
          context: "Leadership wants a dashboard, not a screenshot of a board.",
          persona: "PMO",
          categoryId: "timeline-reporting",
          start: "Sample work already in the workspace.",
          tasks: [
            "Open or create a dashboard widget",
            "Filter by owner or status",
            "State dashboard packaging",
          ],
          outcome: "Reporting is usable in the quoted edition.",
          criteria: ["Filter works"],
          priority: "should-have",
          script:
            "Show a dashboard or report filtered by owner or status. State if dashboards are gated.",
          hints: ["reporting-dashboards"],
        }),
      ],
      integrationChecks: [
        { id: "PM-INT-001", integration: "Docs / file storage", testTask: "Show file attach or embed from Drive/SharePoint and which plan includes it." },
        { id: "PM-INT-002", integration: "Chat", testTask: "Show notifications or unfurls in Slack/Teams if claimed." },
        { id: "PM-INT-003", integration: "Calendar", testTask: "Show due-date sync if claimed." },
        { id: "PM-INT-004", integration: "SSO / identity", testTask: "Show SSO availability on the quoted edition." },
      ],
      adminTasks: sharedAdminTasks(
        "PM",
        "Open a portfolio or status report and filter by owner or project.",
      ),
      commercialQuestions: SHARED_COMMERCIAL,
    },
  },
  hr: {
    rfp: {
      changeTriggers: [
        "Hiring lives in email and spreadsheets",
        "Core employee records are fragmented",
        "Payroll / benefits admin is manual",
        "Need ATS without a full HCM buy",
        "Workforce scheduling is disconnected from HRIS",
        "Time & attendance is paper or clock hardware only",
        "Training / SOP knowledge is not in one place",
        "Compliance / audit gaps",
      ],
      scopeCatalog: [
        { id: "applicant-tracking", label: "Applicant tracking", capabilitySlug: "applicant-tracking" },
        { id: "career-site-job-boards", label: "Career site & job boards", capabilitySlug: "career-site-job-boards" },
        { id: "interview-scheduling", label: "Interview scheduling", capabilitySlug: "interview-scheduling" },
        { id: "core-hris", label: "Core HRIS", capabilitySlug: "core-hris" },
        { id: "payroll-processing", label: "Payroll processing", capabilitySlug: "payroll-processing" },
        { id: "benefits-admin", label: "Benefits administration", capabilitySlug: "benefits-admin" },
        { id: "workforce-scheduling", label: "Workforce scheduling", capabilitySlug: "workforce-scheduling" },
        { id: "time-attendance", label: "Time & attendance", capabilitySlug: "time-attendance" },
        { id: "employee-training-paths", label: "Employee training paths", capabilitySlug: "employee-training-paths" },
        { id: "analytics-reporting", label: "Analytics & reporting", capabilitySlug: "analytics-reporting" },
        { id: "security-dpa", label: "Security / DPA" },
        { id: "trial-success-criteria", label: "Trial success criteria" },
      ],
      userGroups: [
        "Recruiters",
        "HRBPs / people ops",
        "Hiring managers",
        "Payroll / finance",
        "Frontline managers",
        "Employees",
        "IT / security",
      ],
      integrationCategories: [
        "Payroll",
        "Benefits",
        "Calendar / video interview",
        "SSO / identity",
        "Accounting",
        "Other",
      ],
      migrationObjects: [
        "Employee records",
        "Candidates / applications",
        "Time-off balances",
        "Schedules",
        "Training records",
        "Org structure",
      ],
    },
    demo: {
      evaluationAreas: [
        { id: "applicant-tracking", label: "ATS / recruiting" },
        { id: "core-hris", label: "Core HRIS" },
        { id: "payroll-benefits", label: "Payroll & benefits" },
        { id: "workforce-scheduling", label: "Scheduling" },
        { id: "time-attendance", label: "Time & attendance" },
        { id: "employee-training-paths", label: "Training" },
        { id: "administration", label: "Administration" },
        { id: "security", label: "Security / DPA" },
      ],
      guidelines: guidelines("HR", [
        "payroll or benefits modules sold separately",
        "ATS vs HRIS edition splits",
      ]),
      functionalQuestions: [
        ...SHARED_FUNCTIONAL_QUESTIONS,
        {
          id: "HR-Q-F-006",
          question: "Which employee fields are native vs custom, and who can see sensitive fields?",
        },
      ],
      adminQuestions: SHARED_ADMIN_QUESTIONS,
      dataQuestions: SHARED_DATA_QUESTIONS,
      scenarios: [
        scenario({
          id: "tmpl-hr-ats",
          name: "Requisition → candidate → interview",
          context: "Recruiting must not live in email threads.",
          persona: "Recruiter",
          categoryId: "recruiting-ats",
          start: "A sample role description from the buyer.",
          tasks: [
            "Create a job / requisition",
            "Add a candidate",
            "Move stages",
            "Show interview scheduling if claimed",
          ],
          outcome: "ATS workflow completes in the proposed edition.",
          criteria: ["Stage movement works", "Scheduling packaging disclosed"],
          script:
            "Create a job from our description, add a candidate, move stages, and show interview scheduling if included.",
          hints: ["applicant-tracking", "interview-scheduling", "career-site-job-boards"],
        }),
        scenario({
          id: "tmpl-hr-hris",
          name: "Employee record and org change",
          context: "People ops needs a system of record for the employee lifecycle.",
          persona: "HRBP",
          categoryId: "core-hris",
          start: "A sample employee profile.",
          tasks: [
            "Open the employee record",
            "Change manager or department",
            "Show who can see compensation fields",
            "State HRIS vs ATS packaging",
          ],
          outcome: "Core HRIS is in the quote or explicitly a different product.",
          criteria: ["Sensitive-field access shown"],
          script:
            "Open an employee record, make an org change, and show compensation-field permissions. State if this is a separate HRIS SKU.",
          hints: ["core-hris"],
        }),
        scenario({
          id: "tmpl-hr-payroll",
          name: "Payroll / benefits handoff (if in scope)",
          context: "Buyer will not assume payroll is included in an ATS demo.",
          persona: "Payroll admin",
          categoryId: "payroll-benefits",
          start: "Quoted edition that claims payroll or benefits.",
          tasks: [
            "Show a payroll or benefits workflow",
            "State countries / entities supported",
            "State what is native vs partner",
          ],
          outcome: "Payroll/benefits are demonstrated or excluded from the quote.",
          criteria: ["Partner vs native is explicit"],
          priority: "should-have",
          script:
            "If payroll or benefits is in the quote, show one live workflow and name countries/partners. If not, say so.",
          hints: ["payroll-processing", "benefits-admin"],
        }),
        scenario({
          id: "tmpl-hr-schedule",
          name: "Shift schedule + clock-in",
          context: "Frontline teams need schedules that match time capture.",
          persona: "Frontline manager",
          categoryId: "workforce-scheduling",
          start: "A small team and a week of shifts.",
          tasks: [
            "Publish a schedule",
            "Show employee view",
            "Show clock-in if claimed",
            "State GPS/geofence packaging",
          ],
          outcome: "Scheduling is in the quoted edition or marked separate.",
          criteria: ["Publish works", "Time capture packaging disclosed"],
          script:
            "Build a week of shifts, publish, and show clock-in if included. State if GPS/geofence is add-on.",
          hints: ["workforce-scheduling", "time-attendance", "gps-geofence-clockin"],
        }),
        scenario({
          id: "tmpl-hr-training",
          name: "Assign a training path",
          context: "Onboarding or compliance training should be assigned, not emailed as PDFs.",
          persona: "L&D / people ops",
          categoryId: "employee-training",
          start: "A sample course or SOP if LMS is claimed.",
          tasks: [
            "Assign training to an employee",
            "Show completion tracking",
            "State LMS vs HRIS packaging",
          ],
          outcome: "Training assignment is real or out of scope.",
          criteria: ["Completion visible or limitation stated"],
          priority: "should-have",
          script:
            "Assign training and show completion. If LMS is a different product, say so.",
          hints: ["employee-training-paths", "sop-knowledge-base"],
        }),
      ],
      integrationChecks: [
        { id: "HR-INT-001", integration: "Payroll", testTask: "Show employee/pay-element sync and whether payroll is native or a partner." },
        { id: "HR-INT-002", integration: "Calendar / video interview", testTask: "Show interview scheduling against calendars if claimed." },
        { id: "HR-INT-003", integration: "Accounting", testTask: "Show any claimed journal or cost-centre export." },
        { id: "HR-INT-004", integration: "SSO / identity", testTask: "Show SSO availability on the quoted edition." },
      ],
      adminTasks: sharedAdminTasks(
        "HR",
        "Open a headcount, recruiting, or time report and apply a department filter.",
      ),
      commercialQuestions: [
        ...SHARED_COMMERCIAL,
        {
          id: "HR-COM-006",
          topic: "Modules",
          question: "Which of ATS, HRIS, payroll, scheduling, and LMS are in this quote vs separate SKUs?",
        },
      ],
    },
  },
  ecommerce: {
    rfp: {
      changeTriggers: [
        "Outgrown current storefront or website-builder commerce",
        "Checkout conversion is weak",
        "Inventory / order ops are manual",
        "Need omnichannel / POS",
        "Wholesale / B2B pricing is missing",
        "Marketplace channels are disconnected",
        "Dropshipping sourcing is ad hoc",
        "Reporting cannot answer merchandising questions",
      ],
      scopeCatalog: [
        { id: "online-storefront", label: "Online storefront", capabilitySlug: "online-storefront" },
        { id: "product-catalog", label: "Product catalog", capabilitySlug: "product-catalog" },
        { id: "checkout-payments", label: "Checkout & payments", capabilitySlug: "checkout-payments" },
        { id: "order-management", label: "Order management", capabilitySlug: "order-management" },
        { id: "inventory-management", label: "Inventory management", capabilitySlug: "inventory-management" },
        { id: "shipping-fulfillment", label: "Shipping & fulfillment", capabilitySlug: "shipping-fulfillment" },
        { id: "pos-omnichannel", label: "POS & omnichannel", capabilitySlug: "pos-omnichannel" },
        { id: "marketplace-channels", label: "Marketplace & sales channels", capabilitySlug: "marketplace-channels" },
        { id: "marketing-automation", label: "Store marketing automation", capabilitySlug: "marketing-automation" },
        { id: "app-extensions", label: "App / extension ecosystem", capabilitySlug: "app-extensions" },
        { id: "security-dpa", label: "Security / DPA / PCI scope" },
        { id: "trial-success-criteria", label: "Trial success criteria" },
      ],
      userGroups: [
        "Store operators",
        "Merchandisers",
        "Fulfillment",
        "Customer support",
        "Finance",
        "IT / security",
      ],
      integrationCategories: [
        "Payments",
        "Shipping carriers",
        "3PL / fulfillment",
        "Email / SMS",
        "Accounting",
        "Identity / SSO",
        "Other",
      ],
      migrationObjects: [
        "Products / variants",
        "Customers",
        "Order history",
        "Discounts / gift cards",
        "Theme / content",
        "Inventory locations",
      ],
    },
    demo: {
      evaluationAreas: [
        { id: "online-storefront", label: "Storefront" },
        { id: "checkout-payments", label: "Checkout & payments" },
        { id: "order-management", label: "Orders" },
        { id: "inventory-management", label: "Inventory" },
        { id: "pos-omnichannel", label: "POS / omnichannel" },
        { id: "marketplace-channels", label: "Channels" },
        { id: "administration", label: "Administration" },
        { id: "security", label: "Security / PCI" },
      ],
      guidelines: guidelines("Ecommerce", [
        "transaction fees vs plan fees",
        "POS or marketplace channel add-ons",
      ]),
      functionalQuestions: [
        ...SHARED_FUNCTIONAL_QUESTIONS,
        {
          id: "EC-Q-F-006",
          question: "Which payment methods and regions are native vs app / quote?",
        },
      ],
      adminQuestions: SHARED_ADMIN_QUESTIONS,
      dataQuestions: SHARED_DATA_QUESTIONS,
      scenarios: [
        scenario({
          id: "tmpl-ec-product",
          name: "Product with variants → storefront",
          context: "Merchandising needs variants and a live product page without a developer.",
          persona: "Store operator",
          categoryId: "catalog-management",
          start: "Buyer provides a product name, two variants, and a price.",
          tasks: [
            "Create the product and variants",
            "Publish to the storefront",
            "Show inventory per variant",
            "State theme / app dependencies",
          ],
          outcome: "Product is live in the proposed edition.",
          criteria: ["Variants visible", "Inventory shown"],
          script:
            "Create our product with two variants, publish it, and show inventory. State any theme or app required.",
          hints: ["online-storefront", "product-catalog", "inventory-management"],
        }),
        scenario({
          id: "tmpl-ec-checkout",
          name: "Checkout and payment methods",
          context: "Buyer needs to know what checkout they actually get on the quoted plan.",
          persona: "Store operator",
          categoryId: "checkout-conversion",
          start: "A published product in a standard store.",
          tasks: [
            "Walk checkout as a customer",
            "Show available payment methods",
            "State transaction fees vs plan fees",
            "Show guest vs account checkout if claimed",
          ],
          outcome: "Checkout packaging is explicit.",
          criteria: ["Fees disclosed", "Methods listed without invention"],
          script:
            "Complete checkout on the quoted plan. List payment methods and fees. Do not demo an enterprise checkout that is not in the quote.",
          hints: ["checkout-payments"],
        }),
        scenario({
          id: "tmpl-ec-order",
          name: "Order → fulfill → notify",
          context: "Ops needs to fulfill without a spreadsheet.",
          persona: "Fulfillment",
          categoryId: "order-fulfillment",
          start: "A paid sample order.",
          tasks: [
            "Open the order",
            "Mark fulfilled or create a shipment",
            "Show customer notification",
            "State carrier / 3PL packaging",
          ],
          outcome: "Fulfillment completes in the proposed edition.",
          criteria: ["Status updates", "Carrier packaging disclosed"],
          script:
            "Fulfill a paid order and show the customer notification. State if labels or 3PL are apps.",
          hints: ["order-management", "shipping-fulfillment"],
        }),
        scenario({
          id: "tmpl-ec-pos",
          name: "POS / omnichannel (if in scope)",
          context: "Retail locations should share inventory with the online store.",
          persona: "Retail manager",
          categoryId: "omnichannel-retail",
          start: "Quoted edition that claims POS.",
          tasks: [
            "Show a POS sale or simulated in-store checkout",
            "Show inventory impact on the online catalog",
            "State POS hardware / plan gates",
          ],
          outcome: "POS is in the quote or excluded.",
          criteria: ["Inventory impact shown or limitation stated"],
          priority: "should-have",
          script:
            "If POS is in the quote, complete an in-store sale and show online inventory. If not, say so.",
          hints: ["pos-omnichannel"],
        }),
        scenario({
          id: "tmpl-ec-b2b",
          name: "Wholesale / B2B price list (if claimed)",
          context: "Wholesale customers need different prices and checkout rules.",
          persona: "B2B merchandiser",
          categoryId: "wholesale-b2b",
          start: "A sample wholesale customer if B2B is claimed.",
          tasks: [
            "Show a price list or company account",
            "Show checkout rules (net terms / min order) if claimed",
            "State B2B packaging",
          ],
          outcome: "B2B is demonstrated or marked out of the quote.",
          criteria: ["Packaging disclosed"],
          priority: "should-have",
          script:
            "Show wholesale pricing for a company account if that is in the quote. Do not demo a different SKU.",
          hints: ["online-storefront"],
        }),
      ],
      integrationChecks: [
        { id: "EC-INT-001", integration: "Payments", testTask: "Show which processors are native vs app, and transaction fees on the quoted plan." },
        { id: "EC-INT-002", integration: "Shipping carriers", testTask: "Show label purchase or rate shopping and whether it is an app." },
        { id: "EC-INT-003", integration: "Email / SMS", testTask: "Show order and cart messaging packaging." },
        { id: "EC-INT-004", integration: "Accounting", testTask: "Show payout or order export if claimed." },
      ],
      adminTasks: sharedAdminTasks(
        "EC",
        "Open a sales or inventory report and filter by SKU or channel.",
      ),
      commercialQuestions: [
        ...SHARED_COMMERCIAL,
        {
          id: "EC-COM-006",
          topic: "Fees",
          question: "What are plan fees vs transaction, POS, and marketplace fees on this quote?",
        },
      ],
    },
  },
  ai: {
    rfp: {
      changeTriggers: [
        "Consumer AI accounts are unmanaged",
        "Need admin, SSO, and data controls",
        "Usage / credit spend is opaque",
        "Need image, voice, or video in addition to chat",
        "Want agents / workflow automation, not only chat",
        "Need project memory without leaking client data",
        "Procurement requires a DPA",
        "Coding or meeting-notes use cases expanding",
      ],
      scopeCatalog: [
        { id: "llm-chat", label: "LLM chat & assistants", capabilitySlug: "llm-chat" },
        { id: "writing-assist", label: "Writing & paraphrasing", capabilitySlug: "writing-assist" },
        { id: "image-generation", label: "Image generation", capabilitySlug: "image-generation" },
        { id: "voice-tts", label: "Voice / text-to-speech", capabilitySlug: "voice-tts" },
        { id: "agent-builder", label: "Agent / app builder", capabilitySlug: "agent-builder" },
        { id: "custom-projects", label: "Projects, GPTs, and memory", capabilitySlug: "custom-projects" },
        { id: "enterprise-admin", label: "Enterprise admin & SSO", capabilitySlug: "enterprise-admin" },
        { id: "usage-credits", label: "Usage credits & rate limits", capabilitySlug: "usage-credits" },
        { id: "data-privacy", label: "Data privacy controls", capabilitySlug: "data-privacy" },
        { id: "connectors", label: "Connectors & tools", capabilitySlug: "connectors" },
        { id: "security-dpa", label: "Security / DPA" },
        { id: "trial-success-criteria", label: "Trial success criteria" },
      ],
      userGroups: [
        "Knowledge workers",
        "Marketing / creative",
        "Developers",
        "Ops / automation",
        "IT / security",
        "Procurement / legal",
      ],
      integrationCategories: [
        "Identity / SSO",
        "Knowledge sources / drive",
        "CRM / helpdesk",
        "Dev tools",
        "Data warehouse",
        "Other",
      ],
      migrationObjects: [
        "Custom GPTs / projects / prompts",
        "Shared workspaces",
        "Connected data sources",
        "Usage history (if transferable)",
        "Brand voice / style guides",
      ],
    },
    demo: {
      evaluationAreas: [
        { id: "llm-chat", label: "Chat / assistants" },
        { id: "custom-projects", label: "Projects / memory" },
        { id: "usage-credits", label: "Credits / usage" },
        { id: "data-privacy", label: "Privacy / training controls" },
        { id: "enterprise-admin", label: "Admin / SSO" },
        { id: "agent-builder", label: "Agents (optional)" },
        { id: "connectors", label: "Connectors" },
        { id: "security", label: "Security / DPA" },
      ],
      guidelines: guidelines("AI", [
        "credit or token overages",
        "image/video/voice modules billed separately",
        "training-on-customer-data claims — prove or retract",
      ]),
      functionalQuestions: [
        ...SHARED_FUNCTIONAL_QUESTIONS,
        {
          id: "AI-Q-F-006",
          question: "Is customer content used to train foundation models on the quoted plan? Show the control.",
        },
      ],
      adminQuestions: SHARED_ADMIN_QUESTIONS,
      dataQuestions: SHARED_DATA_QUESTIONS,
      scenarios: [
        scenario({
          id: "tmpl-ai-chat",
          name: "Buyer prompt on buyer context",
          context: "Generic model demos are not evidence. Use the buyer's task.",
          persona: "Knowledge worker",
          categoryId: "llm-assistant",
          start: "Buyer provides a short real prompt and any reference text.",
          tasks: [
            "Run the buyer's prompt",
            "Show citations or uploaded-file grounding if claimed",
            "State model / credit consumption",
          ],
          outcome: "Quality and grounding are visible on buyer material.",
          criteria: ["Buyer prompt used", "Credit burn stated if usage-priced"],
          script:
            "Run our prompt against our reference text. Do not swap in a canned demo. Show credits used if the plan is usage-based.",
          hints: ["llm-chat", "usage-credits"],
        }),
        scenario({
          id: "tmpl-ai-privacy",
          name: "Admin privacy and SSO controls",
          context: "Security will block consumer accounts without admin controls.",
          persona: "IT / security",
          categoryId: "llm-assistant",
          start: "Admin console for the quoted edition.",
          tasks: [
            "Show SSO / domain capture if claimed",
            "Show training / retention toggles",
            "Show workspace permission model",
          ],
          outcome: "Admin controls are in the quoted edition or marked higher-tier.",
          criteria: ["Controls shown live", "Edition gates disclosed"],
          script:
            "Open admin settings. Show SSO, retention, and whether content trains models. If a control is not on this plan, say so.",
          hints: ["enterprise-admin", "data-privacy"],
        }),
        scenario({
          id: "tmpl-ai-credits",
          name: "Usage / credit transparency",
          context: "Finance will not accept an opaque credit burn.",
          persona: "Ops / finance",
          categoryId: "llm-assistant",
          start: "Quoted usage model.",
          tasks: [
            "Show remaining credits or usage dashboard",
            "Explain what consumes a credit",
            "State overage behaviour",
          ],
          outcome: "Usage economics are explicit or quote-required.",
          criteria: ["No invented dollar totals"],
          script:
            "Show the usage dashboard and what consumes credits. Do not convert credits into a dollar total unless the vendor publishes that rate.",
          hints: ["usage-credits"],
        }),
        scenario({
          id: "tmpl-ai-image",
          name: "Image or other modality (if in scope)",
          context: "Creative teams need to know if image/video/voice is the same SKU.",
          persona: "Designer / marketer",
          categoryId: "ai-image",
          start: "Quoted edition claiming that modality.",
          tasks: [
            "Generate from a buyer brief",
            "Show commercial-use / licensing statement the vendor actually publishes",
            "State modality packaging",
          ],
          outcome: "Modality is in the quote or excluded.",
          criteria: ["Packaging disclosed", "No invented licenses"],
          priority: "should-have",
          script:
            "If image/video/voice is in the quote, generate from our brief and state licensing as published. If not, say so.",
          hints: ["image-generation", "voice-tts", "video-generation"],
        }),
        scenario({
          id: "tmpl-ai-agent",
          name: "Agent / connector action (if claimed)",
          context: "An agent that cannot take a constrained action is only chat.",
          persona: "Ops",
          categoryId: "ai-agents",
          start: "Quoted agent builder.",
          tasks: [
            "Show an agent with one tool/connector",
            "Run a constrained task",
            "Show failure / permission behaviour",
          ],
          outcome: "Agent capability is real on the quoted edition or withdrawn.",
          criteria: ["Tool packaging disclosed"],
          priority: "should-have",
          script:
            "If you sell agents, run one tool-using task with permissions visible. Do not demo a lab feature not in the quote.",
          hints: ["agent-builder", "connectors", "workflow-automation"],
        }),
      ],
      integrationChecks: [
        { id: "AI-INT-001", integration: "Identity / SSO", testTask: "Show SSO and domain capture on the quoted edition." },
        { id: "AI-INT-002", integration: "Knowledge sources / drive", testTask: "Show a connector to Drive/SharePoint if claimed, including data-retention notes." },
        { id: "AI-INT-003", integration: "Dev tools", testTask: "Show IDE/code assist packaging if that use case is in scope." },
        { id: "AI-INT-004", integration: "CRM / helpdesk", testTask: "Show any claimed writeback and which plan includes it." },
      ],
      adminTasks: sharedAdminTasks(
        "AI",
        "Open a usage or seat report and filter by user or workspace.",
      ),
      commercialQuestions: [
        ...SHARED_COMMERCIAL,
        {
          id: "AI-COM-006",
          topic: "Credits",
          question: "What consumes a credit/token, and what happens at overage on this quote?",
        },
      ],
    },
  },
  "it-development": {
    rfp: {
      changeTriggers: [
        "Incidents live in chat with no timeline",
        "On-call paging is informal",
        "Observability is fragmented",
        "Need ITSM / service catalog",
        "Hosting / PaaS decision is due",
        "Source control and CI are disconnected from ops",
        "Need enterprise SSO and audit",
        "Web data collection / proxy needs are growing",
      ],
      scopeCatalog: [
        { id: "incident-management", label: "Incident management", capabilitySlug: "incident-management" },
        { id: "oncall-paging", label: "On-call & paging", capabilitySlug: "oncall-paging" },
        { id: "change-problem", label: "Change & problem management", capabilitySlug: "change-problem" },
        { id: "service-catalog", label: "Service catalog", capabilitySlug: "service-catalog" },
        { id: "infrastructure-monitoring", label: "Infrastructure monitoring", capabilitySlug: "infrastructure-monitoring" },
        { id: "apm-tracing", label: "APM & distributed tracing", capabilitySlug: "apm-tracing" },
        { id: "log-management", label: "Log management", capabilitySlug: "log-management" },
        { id: "source-control", label: "Source control & repos", capabilitySlug: "source-control" },
        { id: "cicd-actions", label: "CI/CD & automation", capabilitySlug: "cicd-actions" },
        { id: "enterprise-security", label: "Enterprise security & SSO", capabilitySlug: "enterprise-security" },
        { id: "security-dpa", label: "Security / DPA" },
        { id: "trial-success-criteria", label: "Trial success criteria" },
      ],
      userGroups: [
        "SRE / on-call",
        "Service desk agents",
        "Developers",
        "Platform / hosting admins",
        "Security",
        "IT leadership",
      ],
      integrationCategories: [
        "Identity / SSO",
        "Chat / status",
        "Cloud providers",
        "Ticketing / ITSM",
        "CI / source control",
        "Other",
      ],
      migrationObjects: [
        "Services / catalog items",
        "On-call schedules",
        "Alert rules",
        "Incident history (if transferable)",
        "Runbooks",
        "Repos / pipelines (if in scope)",
      ],
    },
    demo: {
      evaluationAreas: [
        { id: "incident-management", label: "Incidents" },
        { id: "oncall-paging", label: "On-call / paging" },
        { id: "infrastructure-monitoring", label: "Monitoring / APM" },
        { id: "service-catalog", label: "ITSM / catalog" },
        { id: "source-control", label: "Source control / CI" },
        { id: "hosting-operations", label: "Hosting / PaaS" },
        { id: "administration", label: "Administration" },
        { id: "security", label: "Security / DPA" },
      ],
      guidelines: guidelines("IT & development", [
        "ingest or host-hour overages",
        "ITSM vs observability vs hosting SKU splits",
      ]),
      functionalQuestions: [
        ...SHARED_FUNCTIONAL_QUESTIONS,
        {
          id: "IT-Q-F-006",
          question: "What is included ingest / host / action volume vs overage on this quote?",
        },
      ],
      adminQuestions: SHARED_ADMIN_QUESTIONS,
      dataQuestions: SHARED_DATA_QUESTIONS,
      scenarios: [
        scenario({
          id: "tmpl-it-incident",
          name: "Alert → incident → timeline",
          context: "On-call needs a single incident timeline, not a chat scramble.",
          persona: "SRE",
          categoryId: "incident-oncall",
          start: "A sample alert or manual incident.",
          tasks: [
            "Open or create an incident",
            "Page a rotation if claimed",
            "Show timeline / stakeholder updates",
            "State paging vs ITSM packaging",
          ],
          outcome: "Incident workflow completes in the proposed edition.",
          criteria: ["Timeline exists", "Paging packaging disclosed"],
          script:
            "Open an incident from an alert or manually. Show paging and the timeline. State if on-call is a separate SKU.",
          hints: ["incident-management", "oncall-paging"],
        }),
        scenario({
          id: "tmpl-it-itsm",
          name: "Service catalog request",
          context: "Employees need a request item, not a generic ticket dump.",
          persona: "Service desk agent",
          categoryId: "itsm-service-desk",
          start: "Quoted ITSM edition.",
          tasks: [
            "Open a catalog item",
            "Submit as requester",
            "Show approval / fulfillment",
            "State ITSM vs helpdesk SKU",
          ],
          outcome: "Catalog item works or is out of the quote.",
          criteria: ["Approval path shown or limitation stated"],
          script:
            "Submit a catalog request and show approval. If this is a different product than incident tooling, say so.",
          hints: ["service-catalog", "change-problem"],
        }),
        scenario({
          id: "tmpl-it-observability",
          name: "Service health / trace or log (if in scope)",
          context: "Monitoring claims must be shown on a real dashboard, not a slide.",
          persona: "SRE",
          categoryId: "observability-monitoring",
          start: "Quoted observability edition with sample telemetry.",
          tasks: [
            "Open a service dashboard",
            "Show a trace or log search if claimed",
            "State ingest retention and overage",
          ],
          outcome: "Observability is in the quote or excluded.",
          criteria: ["Retention/overage disclosed", "No invented SLOs"],
          priority: "should-have",
          script:
            "Open live telemetry you claim to include. Show retention and overage. Do not invent SLO numbers.",
          hints: ["infrastructure-monitoring", "apm-tracing", "log-management"],
        }),
        scenario({
          id: "tmpl-it-cicd",
          name: "Repo + pipeline (if in scope)",
          context: "DevOps buyers need source and CI packaging, not a hosting brochure.",
          persona: "Developer",
          categoryId: "source-control-devops",
          start: "Quoted source-control or CI edition.",
          tasks: [
            "Open a repo",
            "Show a pipeline or action",
            "State minutes / runner packaging",
          ],
          outcome: "Dev tooling is in the quote or excluded.",
          criteria: ["Packaging disclosed"],
          priority: "should-have",
          script:
            "If source control or CI is in the quote, open a repo and a pipeline. State runner/minute limits.",
          hints: ["source-control", "cicd-actions"],
        }),
        scenario({
          id: "tmpl-it-hosting",
          name: "Hosting / PaaS deploy path (if in scope)",
          context: "Hosting quotes must show the actual control panel, not a CDN slide.",
          persona: "Platform admin",
          categoryId: "hosting-operations",
          start: "Quoted hosting or PaaS edition.",
          tasks: [
            "Show deploy or site create flow",
            "Show SSL / env vars if claimed",
            "State resource limits",
          ],
          outcome: "Hosting is demonstrated or marked a different vendor in the stack.",
          criteria: ["Limits disclosed"],
          priority: "should-have",
          script:
            "If hosting/PaaS is in this quote, show creating or deploying a site and the resource limits. If this RFP is ITSM-only, say hosting is out of scope.",
          hints: ["hosting-panel", "managed-hosting", "cloud-paas"],
        }),
      ],
      integrationChecks: [
        { id: "IT-INT-001", integration: "Chat / status", testTask: "Show incident announcements to Slack/Teams if claimed." },
        { id: "IT-INT-002", integration: "Cloud providers", testTask: "Show cloud integration packaging for alerts or hosting." },
        { id: "IT-INT-003", integration: "CI / source control", testTask: "Show repo or pipeline connectors if in scope." },
        { id: "IT-INT-004", integration: "SSO / identity", testTask: "Show SSO and SCIM availability on the quoted edition." },
      ],
      adminTasks: sharedAdminTasks(
        "IT",
        "Open an incident, SLO, or ticket volume report and apply a service filter.",
      ),
      commercialQuestions: [
        ...SHARED_COMMERCIAL,
        {
          id: "IT-COM-006",
          topic: "Usage",
          question: "What ingest, hosts, tickets, or CI minutes are included vs overage on this quote?",
        },
      ],
    },
  },
};

export function getCategoryContentPack(
  slug: string,
): CategoryToolContentPack | null {
  if (slug in PACKS) {
    return PACKS[slug as NewToolCategorySlug];
  }
  return null;
}
