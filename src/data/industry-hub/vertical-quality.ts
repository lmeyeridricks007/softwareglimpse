import {
  buildIndustryQualityPack as pack,
  buildIndustryBuyingSteps as buyingSteps,
  type QualityPack,
} from "./quality-fields";

/**
 * Quality packs for vertical industry hubs that live outside the core
 * industryQualityBySlug map (construction, SaaS, etc.).
 *
 * Educational only — no rankings, invented prices, or product endorsements.
 * productFitGuidance why/bestWhen is operational fit language only.
 */

export const verticalQualityBySlug: Record<string, QualityPack> = {
  plumbing: pack("plumbing", "plumbing contractors", {
    relatedIndustrySlugs: [
      "construction",
      "small-business",
      "real-estate",
      "manufacturing",
    ],
    priorities: [
      {
        id: "inbound",
        title: "Inbound lead capture",
        description:
          "Calls and web forms become owned records the same day — not voicemail archaeology.",
        icon: "zap",
        capabilitySlug: "lead-management",
      },
      {
        id: "estimates",
        title: "Estimate / job stages",
        description:
          "Short stages from inquiry → quote sent → follow-up → booked stay reviewable.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "history",
        title: "Customer & site history",
        description:
          "Property notes and preferences survive truck handoffs.",
        icon: "building",
        capabilitySlug: "account-management",
      },
      {
        id: "mobile",
        title: "Mobile-friendly updates",
        description:
          "Office or techs can log next steps without desk time.",
        icon: "smartphone",
        capabilitySlug: "mobile",
      },
      {
        id: "boundary",
        title: "CRM vs field / dispatch tools",
        description:
          "CRM owns leads and relationships; scheduling and job execution stay in field tools unless deliberately integrated.",
        icon: "layers",
        capabilitySlug: "integrations",
      },
      {
        id: "reminders",
        title: "Callback & maintenance reminders",
        description:
          "Aging quotes and after-service follow-ups have dates and owners.",
        icon: "clipboard",
      },
    ],
    useCases: [
      {
        id: "inbound",
        title: "Inbound job lead capture",
        bestWhen: "Calls and forms pile up without shared ownership.",
        icon: "zap",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "pipeline",
        title: "Estimate pipeline management",
        bestWhen: "Multiple quotes compete for limited follow-up time.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "field",
        title: "Field-friendly relationship updates",
        bestWhen: "Owners and techs meet off-desk.",
        icon: "map",
        useCaseSlug: "field-sales",
        href: "/use-cases/field-sales/",
      },
      {
        id: "accounts",
        title: "Repeat customer & property accounts",
        bestWhen: "Property managers and homeowners drive recurring work.",
        icon: "building",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "follow-up",
        title: "Quote and maintenance follow-up",
        bestWhen: "Aging estimates and service reminders get lost.",
        icon: "mail",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Few honest estimate stages",
        description:
          "Keep stages short enough to use on busy days — new, visit, quote, follow-up, won/lost.",
        icon: "git-branch",
      },
      {
        id: "boundary",
        title: "CRM vs dispatch boundary",
        description:
          "Decide what lives in CRM vs field software before training the shop.",
        icon: "layers",
      },
      {
        id: "mobile",
        title: "One mobile logging habit",
        description:
          "Train a single next-step update habit before demanding perfect desktop hygiene.",
        icon: "smartphone",
      },
      {
        id: "owners",
        title: "Named owners on every open lead",
        description:
          "Coverage collapses when only the owner knows the pipeline — assign explicitly.",
        icon: "users",
      },
    ],
    evaluationQuestions: [
      { question: "How do inbound calls and forms get an owner within a day?" },
      { question: "Can stages stay short and still match how you quote jobs?" },
      { question: "How do field or office staff update next steps on mobile?" },
      { question: "What stays in CRM vs your dispatch / field-service tool?" },
      { question: "Which fields must travel when a quote becomes a booked job?" },
      { question: "How will property or preference notes survive truck handoffs?" },
    ],
    buyingFramework: buyingSteps("plumbing", [
      {
        title: "Map lead-to-booked-job",
        description: "From inbound call to scheduled work.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Draw the field-tool line",
        description: "What CRM owns vs dispatch and invoicing.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Check mobile fit",
        description: "Trial with office and one tech or estimator.",
        href: "/capabilities/mobile/",
        cta: "Mobile capability",
      },
      {
        title: "Estimate seats",
        description: "Owner, office, and light field users.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for pipeline and small-team needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "insightly",
        why: "Service-oriented SMB CRM that pairs pipeline with light project context — useful when won jobs need a handoff, not a full field-service suite.",
        bestWhen:
          "You want shared estimate ownership and later project notes without buying a dedicated dispatch platform as your CRM.",
      },
      {
        productSlug: "keap",
        why: "Small-business CRM with marketing automation strengths for follow-up sequences after quotes and completed jobs.",
        bestWhen:
          "Inbound and after-service nurture matter as much as the pipeline board — and you accept that scheduling still lives elsewhere.",
      },
      {
        productSlug: "apptivo",
        why: "All-in-one SMB suite shape for teams that want CRM beside other business apps without enterprise complexity.",
        bestWhen:
          "A small shop wants one vendor for several workflows and will still verify field-service gaps separately.",
      },
      {
        productSlug: "bitrix24",
        why: "Collaboration-plus-CRM suite for shops that want shared tasks and pipeline in one place at SMB scale.",
        bestWhen:
          "Office coordination and lead ownership are the gap — not specialized plumbing dispatch.",
      },
      {
        productSlug: "capsule",
        why: "Straightforward contact and pipeline CRM that keeps follow-up simple for small contractor teams.",
        bestWhen:
          "You need owned quotes and customer history without configuring a heavyweight sales stack.",
      },
    ],
  }),

  solar: pack("solar", "solar businesses", {
    relatedIndustrySlugs: [
      "construction",
      "small-business",
      "real-estate",
      "manufacturing",
    ],
    priorities: [
      {
        id: "source",
        title: "Lead source discipline",
        description:
          "Every inquiry shows source, owner, and next step — setter and closer see the same record.",
        icon: "zap",
        capabilitySlug: "lead-management",
      },
      {
        id: "pipeline",
        title: "Survey / proposal stages",
        description:
          "Long cycles stay reviewable from appointment through proposal and install kickoff.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "stakeholders",
        title: "Site & utility contacts",
        description:
          "Homeowner, utility, and decision-maker contacts travel with the opportunity.",
        icon: "users",
        capabilitySlug: "contact-management",
      },
      {
        id: "handoff",
        title: "Install handoff fields",
        description:
          "Won deals carry site notes and required contacts into ops — not empty email forwards.",
        icon: "clipboard",
        capabilitySlug: "deal-management",
      },
      {
        id: "boundary",
        title: "CRM vs design / permitting tools",
        description:
          "Keep array design and permits in specialist systems; CRM owns sales and relationships.",
        icon: "layers",
        capabilitySlug: "integrations",
      },
      {
        id: "coaching",
        title: "Stuck-proposal visibility",
        description:
          "Managers see aging surveys and proposals without reconstructing Slack threads.",
        icon: "chart",
        capabilitySlug: "reporting",
      },
    ],
    useCases: [
      {
        id: "inbound",
        title: "Inbound solar lead ownership",
        bestWhen: "Setter appointments and closer notes live in separate tools.",
        icon: "zap",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "pipeline",
        title: "Survey-to-proposal pipeline",
        bestWhen: "Long cycles stall between appointment and proposal.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "complex",
        title: "Multi-party pursuit handoffs",
        bestWhen: "Setters, closers, and install coordinators share one deal.",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "field",
        title: "Site visit relationship coverage",
        bestWhen: "Surveys and homeowner meetings happen off-desk.",
        icon: "map",
        useCaseSlug: "field-sales",
        href: "/use-cases/field-sales/",
      },
      {
        id: "forecast",
        title: "Install-capacity foresight",
        bestWhen: "Ops needs earlier signal on likely awards.",
        icon: "chart",
        useCaseSlug: "sales-forecasting",
        href: "/use-cases/sales-forecasting/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Stages that match survey and proposal gates",
        description:
          "Encode the checkpoints you already run — not a generic demo funnel.",
        icon: "git-branch",
      },
      {
        id: "handoff",
        title: "Required install handoff fields",
        description:
          "Block ‘won’ until site contacts and notes exist if ops keeps rebuilding context.",
        icon: "form",
      },
      {
        id: "boundary",
        title: "Design tools stay outside CRM",
        description:
          "Do not duplicate array designs or permit status as CRM’s system of record.",
        icon: "layers",
      },
      {
        id: "ownership",
        title: "Setter-to-closer ownership rules",
        description:
          "Define who owns the record after appointment set so context does not drop.",
        icon: "users",
      },
    ],
    evaluationQuestions: [
      { question: "How do setter notes reach the closer on the same opportunity?" },
      { question: "Can stages reflect survey, proposal, and install kickoff honestly?" },
      { question: "What fields are required before a deal can be marked won?" },
      { question: "Which design or permitting tools must stay separate from CRM?" },
      { question: "How do managers see aging proposals without false forecast precision?" },
      { question: "How are multi-stakeholder contacts stored on residential deals?" },
    ],
    buyingFramework: buyingSteps("solar", [
      {
        title: "Map lead-to-install",
        description: "From inquiry through survey, proposal, and ops handoff.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Define handoff rules",
        description: "What must be true before install kickoff.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Check collaboration fit",
        description: "Trial with a setter, closer, and coordinator.",
        href: "/capabilities/pipeline-management/",
        cta: "Pipeline capability",
      },
      {
        title: "Estimate seats",
        description: "Sales pod plus light ops access.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for pipeline and handoff needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "insightly",
        why: "Service SMB CRM with pipeline plus project-style context for post-sale install coordination — without replacing design software.",
        bestWhen:
          "Sales-to-ops handoff matters and you will keep engineering/design tools separate.",
      },
      {
        productSlug: "keap",
        why: "Automation-friendly SMB CRM for long nurture cycles between survey, proposal, and financing conversations.",
        bestWhen:
          "Lead follow-up and drip sequences are the failure mode more than enterprise forecasting.",
      },
      {
        productSlug: "apptivo",
        why: "Suite-style SMB CRM for smaller solar shops consolidating sales admin without a large platform footprint.",
        bestWhen:
          "You want broad SMB app coverage and will verify specialty solar suite needs separately.",
      },
      {
        productSlug: "bitrix24",
        why: "All-in-one collaboration CRM for teams coordinating setters, closers, and office tasks in one workspace.",
        bestWhen:
          "Shared tasks and pipeline visibility are the gap — not purpose-built solar design.",
      },
      {
        productSlug: "capsule",
        why: "Simple pipeline and contact CRM for lean solar sales pods that need ownership without heavy configuration.",
        bestWhen:
          "A small team needs clean stages and customer history more than deep industry modules.",
      },
    ],
  }),

  "event-management": pack("event-management", "event management teams", {
    relatedIndustrySlugs: [
      "hospitality",
      "small-business",
      "nonprofit",
      "saas",
    ],
    priorities: [
      {
        id: "pipeline",
        title: "Inquiry / booking pipeline",
        description:
          "Leads move through quote, hold, and confirmed with clear owners.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "accounts",
        title: "Client & venue relationships",
        description:
          "Repeat clients, venues, and vendors stay mapped across events.",
        icon: "building",
        capabilitySlug: "relationship-management",
      },
      {
        id: "handoff",
        title: "Sales-to-delivery handoff",
        description:
          "Won bookings carry contacts, dates, and scope notes into ops.",
        icon: "clipboard",
        capabilitySlug: "deal-management",
      },
      {
        id: "tasks",
        title: "Deposit & decision deadlines",
        description:
          "Holds and decision dates are visible before calendars fill.",
        icon: "zap",
      },
      {
        id: "collaboration",
        title: "Cross-role visibility",
        description:
          "Sales, coordinators, and vendors see status without inbox archaeology.",
        icon: "users",
        capabilitySlug: "contact-management",
      },
      {
        id: "boundary",
        title: "CRM vs event ops tools",
        description:
          "Run-of-show and production checklists stay in event tools; CRM owns inquiry and relationships.",
        icon: "layers",
        capabilitySlug: "integrations",
      },
    ],
    useCases: [
      {
        id: "inbound",
        title: "Event inquiry capture",
        bestWhen: "Website and referral leads lack shared ownership.",
        icon: "zap",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "pipeline",
        title: "Booking pipeline management",
        bestWhen: "Multiple holds compete for limited calendar inventory.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "accounts",
        title: "Repeat client & venue accounts",
        bestWhen: "Corporate and venue relationships drive recurring work.",
        icon: "building",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "complex",
        title: "Multi-stakeholder bookings",
        bestWhen: "Client, venue, and vendor contacts share one opportunity.",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "follow-up",
        title: "Quote and deposit follow-up",
        bestWhen: "Holds expire while proposals sit unanswered.",
        icon: "mail",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Stages that match holds and deposits",
        description:
          "Include hold, deposit-due, and confirmed checkpoints you already run.",
        icon: "git-branch",
      },
      {
        id: "boundary",
        title: "CRM vs run-of-show tools",
        description:
          "Keep detailed production plans out of CRM unless there is a clear shared model.",
        icon: "layers",
      },
      {
        id: "contacts",
        title: "Role labels on event contacts",
        description:
          "Distinguish decision-makers, day-of contacts, and vendors on each booking.",
        icon: "form",
      },
      {
        id: "season",
        title: "Peak-season review habit",
        description:
          "Schedule aging-inquiry reviews before calendar capacity disappears.",
        icon: "chart",
      },
    ],
    evaluationQuestions: [
      { question: "Can stages reflect inquiry, hold, deposit, and confirmed?" },
      { question: "How do sales and coordinators share one booking record?" },
      { question: "What handoff fields are required when a booking is confirmed?" },
      { question: "Where do run-of-show and production checklists live relative to CRM?" },
      { question: "How are venue and vendor relationships tracked across events?" },
      { question: "What view shows aging quotes before holds expire?" },
    ],
    buyingFramework: buyingSteps("event-management", [
      {
        title: "Map inquiry-to-confirm",
        description: "From lead through hold and deposit.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Separate sales from production",
        description: "Decide CRM vs event ops responsibilities.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Trial with both roles",
        description: "Sales plus a coordinator on a live booking.",
        href: "/capabilities/pipeline-management/",
        cta: "Pipeline capability",
      },
      {
        title: "Estimate seats",
        description: "Sales, coordinators, and managers.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for pipeline and collaboration needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "podio",
        why: "Highly customizable work platform often used as CRM when event workflows need flexible apps beyond a fixed sales board.",
        bestWhen:
          "Your booking process is unique and you will invest time shaping workspaces rather than adopting a rigid sales CRM.",
      },
      {
        productSlug: "monday-sales-crm",
        why: "Visual Work OS–style sales CRM for pipelines, automations, and team collaboration around booking stages.",
        bestWhen:
          "Coordinators and sellers already think in boards and need shared visibility more than industry-specific event software.",
      },
      {
        productSlug: "bitrix24",
        why: "Collaboration suite with CRM for teams coordinating tasks, chats, and booking pipelines together.",
        bestWhen:
          "Office collaboration and lead ownership are the gap — not a full event production suite.",
      },
      {
        productSlug: "hubspot",
        why: "Broad CRM platform with marketing and sales hubs useful when inquiry capture and nurture span web and email.",
        bestWhen:
          "Inbound marketing and CRM need one vendor — verify which hubs you actually need in year one.",
      },
      {
        productSlug: "keap",
        why: "SMB CRM with automation suited to quote follow-up and post-event rebooking sequences.",
        bestWhen:
          "Smaller event businesses need nurture as much as a pipeline board.",
      },
    ],
  }),

  "private-equity": pack("private-equity", "private equity firms", {
    relatedIndustrySlugs: [
      "financial-services",
      "venture-capital",
      "investor-relations",
      "legal-services",
    ],
    priorities: [
      {
        id: "network",
        title: "Relationship network visibility",
        description:
          "Intro paths and firm coverage are queryable when a deal heats up.",
        icon: "users",
        capabilitySlug: "relationship-management",
      },
      {
        id: "pipeline",
        title: "Deal pipeline stages",
        description:
          "Sourcing through diligence and IC has owners and next steps.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "coverage",
        title: "Intermediary coverage discipline",
        description:
          "Banker and advisor last-touch history reduces duplicate outreach.",
        icon: "building",
        capabilitySlug: "account-management",
      },
      {
        id: "activity",
        title: "Activity on people and deals",
        description:
          "Meetings and emails attach to the right firm and opportunity.",
        icon: "mail",
        capabilitySlug: "email",
      },
      {
        id: "permissions",
        title: "Sensitive access controls",
        description:
          "Deal and note visibility matches firm policy — verify with the vendor.",
        icon: "shield",
        capabilitySlug: "security-administration",
      },
      {
        id: "boundary",
        title: "CRM vs portfolio / fund admin",
        description:
          "Fund relationships stay in CRM; portfolio ops and admin stay adjacent unless clearly shared.",
        icon: "layers",
      },
    ],
    useCases: [
      {
        id: "relationships",
        title: "Deal network relationship management",
        bestWhen: "Intro paths live only in partner inboxes.",
        icon: "users",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "pipeline",
        title: "Deal pipeline management",
        bestWhen: "Diligence blockers surface only in hallway conversations.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "complex",
        title: "Multi-party diligence pursuits",
        bestWhen: "Associates, partners, and advisors share one opportunity.",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "accounts",
        title: "Intermediary account coverage",
        bestWhen: "Multiple partners touch the same banker without coordination.",
        icon: "building",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "reporting",
        title: "Aging deal and coverage views",
        bestWhen: "Monday meetings need stuck-stage signal.",
        icon: "chart",
        useCaseSlug: "reporting",
        href: "/use-cases/reporting/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Stages that match IC checkpoints",
        description:
          "Encode sourcing, early/advanced diligence, IC, and pass outcomes your firm already runs.",
        icon: "git-branch",
      },
      {
        id: "permissions",
        title: "Permission model before migration",
        description:
          "Define team and deal visibility with counsel/ops before importing sensitive notes.",
        icon: "shield",
      },
      {
        id: "boundary",
        title: "Portfolio systems stay separate",
        description:
          "Do not force portfolio operating data into deal CRM without a shared model.",
        icon: "layers",
      },
      {
        id: "hygiene",
        title: "Named admin for relationship hygiene",
        description:
          "Coverage quality needs an owner — not only partner enthusiasm.",
        icon: "clipboard",
      },
    ],
    evaluationQuestions: [
      { question: "How visible are introduction paths between people and firms?" },
      { question: "Can deal stages match how your firm actually reviews opportunities?" },
      { question: "What permission model fits sensitive deal notes?" },
      { question: "How is banker/advisor coverage ownership enforced?" },
      { question: "What stays in CRM vs portfolio or fund admin systems?" },
      { question: "How does activity capture attach to both people and deals?" },
    ],
    buyingFramework: buyingSteps("private-equity", [
      {
        title: "Map sourcing-to-IC",
        description: "Document real diligence checkpoints and owners.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Define relationship must-haves",
        description: "Intro graph, coverage, and activity capture.",
        href: "/capabilities/relationship-management/",
        cta: "Relationship capability",
      },
      {
        title: "Review security needs",
        description: "Permissions and vendor trust documentation.",
        href: "/guides/crm-evaluation-guide/",
        cta: "Evaluation guide",
      },
      {
        title: "Estimate seats",
        description: "Partners, associates, and BD coverage.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for relationship and pipeline needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "affinity",
        why: "Private-capital relationship CRM designed around deal networks, firm coverage, and relationship intelligence for PE workflows.",
        bestWhen:
          "Intro graphs and intermediary coverage are central — not a generic sales board alone.",
      },
      {
        productSlug: "attio",
        why: "Flexible, data-model-first CRM that teams configure for relationship objects and deal flow without legacy sales assumptions.",
        bestWhen:
          "You want a modern workspace you can shape to PE entities and are willing to design the model carefully.",
      },
      {
        productSlug: "salesforce",
        why: "Enterprise CRM platform with deep customization, permissions, and ecosystem fit for larger firms with admin capacity.",
        bestWhen:
          "Governance, integrations, and scale outweigh wanting a purpose-built private-capital product out of the box.",
      },
      {
        productSlug: "hubspot",
        why: "Broad CRM platform some BD teams use when outreach and pipeline need shared ownership without private-capital specificity.",
        bestWhen:
          "A smaller PE BD motion needs CRM discipline first — verify relationship-graph depth against Affinity-class tools.",
      },
      {
        productSlug: "folk",
        why: "Lightweight relationship CRM for organizing contacts and collaborative outreach when full enterprise CRM is overkill.",
        bestWhen:
          "A lean deal or BD pod needs shared contact memory more than heavy diligence workflow engines.",
      },
    ],
  }),

  "venture-capital": pack("venture-capital", "venture capital firms", {
    relatedIndustrySlugs: [
      "financial-services",
      "private-equity",
      "investor-relations",
      "saas",
    ],
    priorities: [
      {
        id: "dealflow",
        title: "Deal-flow pipeline",
        description:
          "Inbound and sourced opportunities have stages, owners, and next steps.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "network",
        title: "Founder & intermediary networks",
        description:
          "Relationship context sits with people and firms, not only partner email.",
        icon: "users",
        capabilitySlug: "relationship-management",
      },
      {
        id: "coverage",
        title: "Partner coverage discipline",
        description:
          "Last touch and owners reduce duplicate founder outreach.",
        icon: "building",
        capabilitySlug: "account-management",
      },
      {
        id: "activity",
        title: "Meeting & email capture",
        description:
          "Partner activity lands on the right company and opportunity.",
        icon: "mail",
        capabilitySlug: "email",
      },
      {
        id: "permissions",
        title: "Team visibility controls",
        description:
          "Associates and partners see appropriate deal detail — verify access model.",
        icon: "shield",
        capabilitySlug: "security-administration",
      },
      {
        id: "boundary",
        title: "CRM vs portfolio support tools",
        description:
          "Deal and relationship CRM stays separate from portfolio operating systems unless deliberately shared.",
        icon: "layers",
      },
    ],
    useCases: [
      {
        id: "inbound",
        title: "Inbound deal-flow capture",
        bestWhen: "Warm intros and forms lack shared ownership.",
        icon: "zap",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "relationships",
        title: "Founder relationship management",
        bestWhen: "Partner networks reset every fundraising cycle.",
        icon: "users",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "pipeline",
        title: "Diligence pipeline management",
        bestWhen: "Deal status is tribal across partners.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "complex",
        title: "Multi-partner pursuits",
        bestWhen: "Several partners and associates share one company.",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "reporting",
        title: "Deal-flow reporting",
        bestWhen: "Partners need aging and source views without rebuilds.",
        icon: "chart",
        useCaseSlug: "reporting",
        href: "/use-cases/reporting/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Stages that match partner review habits",
        description:
          "Keep stage names honest to how you actually pass or advance deals.",
        icon: "git-branch",
      },
      {
        id: "inbound",
        title: "Shared inbox / form ownership rules",
        description:
          "Decide who owns inbound the same day it arrives.",
        icon: "zap",
      },
      {
        id: "boundary",
        title: "Portfolio tools stay adjacent",
        description:
          "Founder CRM is not a substitute for portfolio support systems.",
        icon: "layers",
      },
      {
        id: "hygiene",
        title: "Lightweight hygiene cadence",
        description:
          "Weekly coverage cleanup beats perfect data models that nobody updates.",
        icon: "clipboard",
      },
    ],
    evaluationQuestions: [
      { question: "How do inbound intros get an owner within a day?" },
      { question: "Can relationship history answer who knows a founder or intermediary?" },
      { question: "Do stages match how partners actually review deals?" },
      { question: "What permission model fits associate vs partner visibility?" },
      { question: "What stays in CRM vs portfolio or fund tools?" },
      { question: "How does email/calendar activity attach to companies and deals?" },
    ],
    buyingFramework: buyingSteps("venture-capital", [
      {
        title: "Map deal-flow reality",
        description: "Inbound, sourced, and partner-led paths.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Prioritize relationship needs",
        description: "Networks and coverage before advanced features.",
        href: "/capabilities/relationship-management/",
        cta: "Relationship capability",
      },
      {
        title: "Check activity capture",
        description: "Trial email/calendar sync with a partner.",
        href: "/capabilities/email/",
        cta: "Email capability",
      },
      {
        title: "Estimate seats",
        description: "Partners, associates, and ops helpers.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for relationship and pipeline needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "affinity",
        why: "Private-capital relationship CRM aligned to deal networks, firm coverage, and VC-style relationship intelligence.",
        bestWhen:
          "Relationship graphs and intermediary coverage are the core workflow, not optional extras.",
      },
      {
        productSlug: "attio",
        why: "Modern flexible CRM that startups and GTM-minded funds configure for custom objects and deal flow.",
        bestWhen:
          "You want a data-model-first workspace and will invest in shaping it to fund entities.",
      },
      {
        productSlug: "salesforce",
        why: "Enterprise platform option when larger funds need heavy customization, security controls, and integrations.",
        bestWhen:
          "Admin capacity and governance needs exceed lighter relationship CRMs.",
      },
      {
        productSlug: "hubspot",
        why: "Familiar CRM platform some funds use for pipeline and outreach discipline without private-capital specialization.",
        bestWhen:
          "A smaller team needs CRM hygiene quickly — compare relationship depth against purpose-built tools.",
      },
      {
        productSlug: "folk",
        why: "Simple collaborative relationship CRM for contact memory and outreach when enterprise CRM is excessive.",
        bestWhen:
          "A lean partner or scout pod needs shared networks more than complex diligence stages.",
      },
    ],
  }),

  photography: pack("photography", "photography studios", {
    relatedIndustrySlugs: [
      "small-business",
      "hospitality",
      "nonprofit",
      "retail-ecommerce",
    ],
    priorities: [
      {
        id: "inquiries",
        title: "Inquiry capture",
        description:
          "DMs, forms, and referrals become owned records with next steps.",
        icon: "zap",
        capabilitySlug: "lead-management",
      },
      {
        id: "pipeline",
        title: "Booking stages",
        description:
          "Short stages from inquiry to quote to booked shoot stay reviewable in peak season.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "clients",
        title: "Client history",
        description:
          "Preferences and past jobs sit on the contact for warmer repeats.",
        icon: "users",
        capabilitySlug: "contact-management",
      },
      {
        id: "reminders",
        title: "Follow-up reminders",
        description:
          "Aging quotes get dates before peak season swallows attention.",
        icon: "clipboard",
      },
      {
        id: "boundary",
        title: "CRM vs studio tools",
        description:
          "Galleries, contracts, and scheduling often stay in studio suites; CRM owns pipeline and relationships.",
        icon: "layers",
        capabilitySlug: "integrations",
      },
      {
        id: "automation",
        title: "Light follow-up automation",
        description:
          "Sequences help — still leave room for human send judgment on creative work.",
        icon: "mail",
        capabilitySlug: "workflow-automation",
      },
    ],
    useCases: [
      {
        id: "inbound",
        title: "Inquiry capture from web and social",
        bestWhen: "Leads hide in DMs and personal email.",
        icon: "zap",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "pipeline",
        title: "Booking pipeline management",
        bestWhen: "Peak season quotes expire while you shoot.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "follow-up",
        title: "Quote follow-up",
        bestWhen: "Open inquiries lack next-email dates.",
        icon: "mail",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "relationships",
        title: "Repeat client relationships",
        bestWhen: "Commercial and portrait clients return over years.",
        icon: "users",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "contacts",
        title: "Client and brand contacts",
        bestWhen: "Assistants and leads need shared client memory.",
        icon: "building",
        useCaseSlug: "contact-management",
        href: "/use-cases/contact-management/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Few booking stages",
        description:
          "Inquiry, quote sent, follow-up, booked/lost — long taxonomies get skipped mid-shoot.",
        icon: "git-branch",
      },
      {
        id: "boundary",
        title: "Studio suite boundary",
        description:
          "Keep galleries and contracts in studio tools unless integration is deliberate.",
        icon: "layers",
      },
      {
        id: "capture",
        title: "One capture habit for DMs",
        description:
          "Decide how Instagram or email inquiries enter CRM the same day.",
        icon: "zap",
      },
    ],
    evaluationQuestions: [
      { question: "How do DM and form inquiries become owned CRM records?" },
      { question: "Can booking stages stay short enough for peak season?" },
      { question: "What lives in CRM vs your studio booking or gallery tool?" },
      { question: "How are client preferences preserved for repeat work?" },
      { question: "What reminder view shows aging quotes before they go cold?" },
      { question: "Do assistants need shared access without full admin rights?" },
    ],
    buyingFramework: buyingSteps("photography", [
      {
        title: "Map inquiry-to-booked",
        description: "From first message to confirmed shoot.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Draw the studio-tool line",
        description: "CRM vs galleries, contracts, and scheduling.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Check email / follow-up fit",
        description: "Trial with real inquiry templates.",
        href: "/capabilities/email/",
        cta: "Email capability",
      },
      {
        title: "Estimate seats",
        description: "Solo, lead, and any assistant seats.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for simple pipeline and contacts.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "keap",
        why: "SMB CRM with automation suited to inquiry nurture and post-shoot rebooking — not a replacement for studio gallery suites.",
        bestWhen:
          "Follow-up sequences matter and you will keep contracts/galleries in photography-specific tools.",
      },
      {
        productSlug: "capsule",
        why: "Simple contact and pipeline CRM for small studios that need owned bookings without heavy setup.",
        bestWhen:
          "Solo or small teams want straightforward inquiry stages and client history.",
      },
      {
        productSlug: "streak",
        why: "Gmail-native pipeline CRM for photographers whose sales work already lives in email threads.",
        bestWhen:
          "You live in Gmail and want pipelines beside the inbox — accept studio-tool gaps for galleries and contracts.",
      },
      {
        productSlug: "copper",
        why: "Google Workspace-native CRM for pipeline and relationships inside Gmail and Google apps.",
        bestWhen:
          "The studio runs on Google Workspace and wants CRM without leaving that stack.",
      },
      {
        productSlug: "folk",
        why: "Lightweight relationship CRM for organizing client and brand contacts with collaborative outreach.",
        bestWhen:
          "Relationship memory is the gap more than complex booking automation.",
      },
    ],
  }),

  coaching: pack("coaching", "coaching businesses", {
    relatedIndustrySlugs: [
      "small-business",
      "education",
      "nonprofit",
      "saas",
    ],
    priorities: [
      {
        id: "leads",
        title: "Lead nurture ownership",
        description:
          "Discovery calls and applications have owners and next steps.",
        icon: "zap",
        capabilitySlug: "lead-management",
      },
      {
        id: "pipeline",
        title: "Program / enrollment pipeline",
        description:
          "Stages from inquiry to enrolled stay visible without heavy sales theater.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "context",
        title: "Client context",
        description:
          "Goals and commercial notes sit with the contact for continuity.",
        icon: "users",
        capabilitySlug: "contact-management",
      },
      {
        id: "automation",
        title: "Nurture automation",
        description:
          "Sequences support follow-up without replacing human coaching judgment.",
        icon: "mail",
        capabilitySlug: "workflow-automation",
      },
      {
        id: "boundary",
        title: "CRM vs delivery journals",
        description:
          "Keep detailed session journals in delivery tools; CRM owns commercial relationship context.",
        icon: "layers",
      },
      {
        id: "assistants",
        title: "VA / assistant coverage",
        description:
          "Assistants can advance tasks without becoming the coach of record.",
        icon: "clipboard",
      },
    ],
    useCases: [
      {
        id: "inbound",
        title: "Inbound coaching lead capture",
        bestWhen: "Applications and DMs lack shared ownership.",
        icon: "zap",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "pipeline",
        title: "Enrollment pipeline",
        bestWhen: "Multiple programs compete for limited discovery slots.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "automation",
        title: "Nurture and re-enrollment sequences",
        bestWhen: "Follow-up depends on memory during delivery weeks.",
        icon: "mail",
        useCaseSlug: "sales-automation",
        href: "/use-cases/sales-automation/",
      },
      {
        id: "relationships",
        title: "Ongoing client relationships",
        bestWhen: "Alumni and renewals need warm context.",
        icon: "users",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "follow-up",
        title: "Discovery-call follow-up",
        bestWhen: "Post-call proposals go cold.",
        icon: "clipboard",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Enrollment stages that match reality",
        description:
          "Inquiry, discovery booked, proposal, enrolled/declined — avoid fake enterprise funnels.",
        icon: "git-branch",
      },
      {
        id: "boundary",
        title: "Commercial vs coaching notes",
        description:
          "Store relationship and payment context in CRM; keep session journals where you coach daily.",
        icon: "layers",
      },
      {
        id: "automation",
        title: "Human-in-the-loop sequences",
        description:
          "Automate reminders; keep high-trust messages reviewable before send.",
        icon: "mail",
      },
      {
        id: "access",
        title: "Assistant permissions",
        description:
          "Give VAs task access without oversharing sensitive client notes.",
        icon: "shield",
      },
    ],
    evaluationQuestions: [
      { question: "How do inquiries get an owner before the next discovery slot fills?" },
      { question: "Can stages stay light while still tracking enrollment?" },
      { question: "Where do session journals live relative to CRM?" },
      { question: "What automation still requires a human send review?" },
      { question: "How do assistants update pipeline without full admin rights?" },
      { question: "How is alumni re-enrollment context preserved?" },
    ],
    buyingFramework: buyingSteps("coaching", [
      {
        title: "Map inquiry-to-enrolled",
        description: "From lead through discovery and offer.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Separate CRM from journals",
        description: "Commercial context vs delivery notes.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Check nurture fit",
        description: "Trial sequences with real discovery follow-ups.",
        href: "/capabilities/workflow-automation/",
        cta: "Automation capability",
      },
      {
        title: "Estimate seats",
        description: "Coach plus any VA or assistant.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for nurture and simple pipeline.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "keap",
        why: "SMB CRM with marketing automation strengths for coaches who nurture leads between discovery calls and programs.",
        bestWhen:
          "Enrollment follow-up and drip sequences are the bottleneck — not enterprise sales ops.",
      },
      {
        productSlug: "activecampaign",
        why: "Marketing automation platform with CRM/sales pipelines strongest when nurture and contact-based messaging matter.",
        bestWhen:
          "Email automation is central and you will confirm which plan unlocks the CRM depth you need.",
      },
      {
        productSlug: "hubspot",
        why: "CRM platform with free core plus hubs for growing coaching brands that combine content, inbound, and pipeline.",
        bestWhen:
          "You want one platform for marketing and CRM — verify hub costs before assuming the free tier is enough.",
      },
      {
        productSlug: "capsule",
        why: "Straightforward contact and pipeline CRM for coaches who need ownership without marketing-suite complexity.",
        bestWhen:
          "A solo or small practice wants simple stages and client history first.",
      },
      {
        productSlug: "nimble",
        why: "Social/relationship CRM with mailbox sync for coaches whose outreach spans email and social networks.",
        bestWhen:
          "Relationship context across channels matters more than heavy program automation.",
      },
    ],
  }),

  "investor-relations": pack("investor-relations", "investor relations teams", {
    relatedIndustrySlugs: [
      "financial-services",
      "private-equity",
      "venture-capital",
      "saas",
    ],
    priorities: [
      {
        id: "accounts",
        title: "Investor & firm contacts",
        description:
          "Firms, contacts, and roles stay hierarchical and searchable.",
        icon: "building",
        capabilitySlug: "contact-management",
      },
      {
        id: "coverage",
        title: "Outreach ownership",
        description:
          "Who owns which investor relationship is visible to the team.",
        icon: "users",
        capabilitySlug: "account-management",
      },
      {
        id: "followups",
        title: "Meeting follow-ups",
        description:
          "Commitments after LP or investor meetings attach to the firm record.",
        icon: "clipboard",
      },
      {
        id: "history",
        title: "Relationship history",
        description:
          "Last touch, open questions, and intro context inform the next outreach.",
        icon: "mail",
        capabilitySlug: "relationship-management",
      },
      {
        id: "permissions",
        title: "Sensitive note permissions",
        description:
          "Access matches IR policy — verify with vendor and internal guidelines.",
        icon: "shield",
        capabilitySlug: "security-administration",
      },
      {
        id: "boundary",
        title: "CRM vs IR portals / fund admin",
        description:
          "CRM owns outreach relationships; reporting portals and admin stay separate.",
        icon: "layers",
      },
    ],
    useCases: [
      {
        id: "relationships",
        title: "Investor relationship management",
        bestWhen: "Meeting notes live in personal docs.",
        icon: "users",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "accounts",
        title: "Firm account coverage",
        bestWhen: "LP coverage collides across partners.",
        icon: "building",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "follow-up",
        title: "Post-meeting follow-up",
        bestWhen: "Commitments disappear into email after meetings.",
        icon: "clipboard",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "pipeline",
        title: "Capital-formation pipeline",
        bestWhen: "Fundraising or IR outreach needs stage discipline.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "contacts",
        title: "Stakeholder contact hygiene",
        bestWhen: "Roles and firms churn across coverage cycles.",
        icon: "zap",
        useCaseSlug: "contact-management",
        href: "/use-cases/contact-management/",
      },
    ],
    implementationConsiderations: [
      {
        id: "ownership",
        title: "Account ownership rules",
        description:
          "Define primary owners and backup coverage before importing lists.",
        icon: "users",
      },
      {
        id: "boundary",
        title: "Portal vs CRM data boundary",
        description:
          "Do not duplicate reporting distribution contacts as CRM’s only job.",
        icon: "layers",
      },
      {
        id: "permissions",
        title: "Note sensitivity tiers",
        description:
          "Decide which notes are team-visible vs restricted before migration.",
        icon: "shield",
      },
      {
        id: "cadence",
        title: "Post-meeting task habit",
        description:
          "Require a next step on every material investor meeting.",
        icon: "clipboard",
      },
    ],
    evaluationQuestions: [
      { question: "How visible is ownership and last touch on each investor firm?" },
      { question: "Can meeting follow-ups attach to the firm, not only a calendar invite?" },
      { question: "What permission model fits sensitive IR notes?" },
      { question: "What stays in CRM vs IR portals or fund admin systems?" },
      { question: "How are contact roles (LP, consultant, advisor) modeled?" },
      { question: "What view helps prevent duplicate outreach across partners?" },
    ],
    buyingFramework: buyingSteps("investor-relations", [
      {
        title: "Map stakeholder coverage",
        description: "Firms, roles, and owners today.",
        href: "/use-cases/relationship-management/",
        cta: "Relationship use case",
      },
      {
        title: "Separate CRM from portals",
        description: "Outreach vs reporting distribution.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Review access needs",
        description: "Permissions and vendor security docs.",
        href: "/guides/crm-evaluation-guide/",
        cta: "Evaluation guide",
      },
      {
        title: "Estimate seats",
        description: "IR leads, associates, and light partner access.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for relationship and account needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "affinity",
        why: "Private-capital relationship CRM strong for firm networks, coverage history, and relationship intelligence adjacent to IR motions.",
        bestWhen:
          "Investor networks and intro context are central — especially at funds already thinking in relationship graphs.",
      },
      {
        productSlug: "wealthbox",
        why: "Advisor-oriented CRM for relationship and activity discipline when IR-like coverage resembles wealth/advisory workflows.",
        bestWhen:
          "You need advisor-style contact and task CRM more than a general enterprise sales platform.",
      },
      {
        productSlug: "cloze",
        why: "Relationship-centric CRM with automatic prioritization habits useful for high-touch stakeholder follow-up.",
        bestWhen:
          "Individual IR owners need relationship ranking and follow-up nudges — verify team/governance fit.",
      },
      {
        productSlug: "salesforce",
        why: "Enterprise CRM for IR teams that need permissions, reporting, and stack integrations at scale.",
        bestWhen:
          "Governance and admin capacity justify a configurable enterprise platform.",
      },
      {
        productSlug: "attio",
        why: "Flexible modern CRM for custom investor objects and relationship workflows without legacy sales defaults.",
        bestWhen:
          "You will design a clean data model for firms, contacts, and outreach stages.",
      },
    ],
  }),

  engineering: pack("engineering", "engineering firms", {
    relatedIndustrySlugs: [
      "construction",
      "manufacturing",
      "saas",
      "legal-services",
    ],
    priorities: [
      {
        id: "pipeline",
        title: "Pursuit / RFP pipeline",
        description:
          "Opportunities move through chase, proposal, and award with owners and due dates.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "accounts",
        title: "Client & agency relationships",
        description:
          "Repeat owners, municipalities, and GCs stay mapped across pursuits.",
        icon: "building",
        capabilitySlug: "account-management",
      },
      {
        id: "handoff",
        title: "Award-to-kickoff handoff",
        description:
          "Won work carries contacts, scope notes, and risks into delivery.",
        icon: "clipboard",
        capabilitySlug: "deal-management",
      },
      {
        id: "complex",
        title: "Multi-discipline pursuits",
        description:
          "BD, technical leads, and principals share one opportunity record.",
        icon: "layers",
        capabilitySlug: "relationship-management",
      },
      {
        id: "forecast",
        title: "Workload foresight",
        description:
          "Leaders see likely awards without trusting verbal updates alone.",
        icon: "chart",
        capabilitySlug: "forecasting",
      },
      {
        id: "boundary",
        title: "CRM vs project delivery tools",
        description:
          "Detailed schedules and drawings stay in PM/engineering systems; CRM owns pursuit and relationships.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
    ],
    useCases: [
      {
        id: "pipeline",
        title: "RFP / pursuit pipeline",
        bestWhen: "Deadlines live in personal calendars.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "complex",
        title: "Complex multi-discipline pursuits",
        bestWhen: "Technical and BD staff share one chase.",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "accounts",
        title: "Repeat client account management",
        bestWhen: "Agencies and owners drive recurring pursuits.",
        icon: "building",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "field",
        title: "Client meeting coverage",
        bestWhen: "Principals meet off-desk with owners and GCs.",
        icon: "map",
        useCaseSlug: "field-sales",
        href: "/use-cases/field-sales/",
      },
      {
        id: "forecast",
        title: "Award forecasting",
        bestWhen: "Staffing needs earlier signal than verbal updates.",
        icon: "chart",
        useCaseSlug: "sales-forecasting",
        href: "/use-cases/sales-forecasting/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Pursuit stages that match go/no-go",
        description:
          "Include chase, proposal, shortlist, and award checkpoints you already run.",
        icon: "git-branch",
      },
      {
        id: "winloss",
        title: "Win/loss reason fields",
        description:
          "Capture why pursuits are won or passed so reporting improves over time.",
        icon: "form",
      },
      {
        id: "boundary",
        title: "CRM vs project delivery",
        description:
          "Keep drawings and schedules in engineering/PM tools; CRM owns BD.",
        icon: "layers",
      },
      {
        id: "owners",
        title: "Named pursuit owners",
        description:
          "Every open RFP needs a commercial owner even when technical leads contribute.",
        icon: "users",
      },
    ],
    evaluationQuestions: [
      { question: "Can stages reflect chase, proposal, shortlist, and award?" },
      { question: "How do BD and technical leads share one pursuit record?" },
      { question: "What handoff fields are required when work is awarded?" },
      { question: "Which project or design tools must stay outside CRM?" },
      { question: "What win/loss fields help improve future pursuits?" },
      { question: "What forecast view helps staffing without false precision?" },
    ],
    buyingFramework: buyingSteps("engineering", [
      {
        title: "Map pursuit lifecycle",
        description: "From chase through award and kickoff.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Define go/no-go rules",
        description: "What must be true before you propose.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Check multi-role fit",
        description: "Trial with BD and a technical lead.",
        href: "/use-cases/complex-sales-processes/",
        cta: "Complex sales use case",
      },
      {
        title: "Estimate seats",
        description: "BD, principals, and pursuit helpers.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for pipeline and account needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "insightly",
        why: "Service SMB CRM that pairs opportunities with light project context for award-to-kickoff handoffs — without replacing engineering delivery tools.",
        bestWhen:
          "You need pursuit ownership plus post-win project notes and will keep design/PM systems separate.",
      },
      {
        productSlug: "podio",
        why: "Customizable work platform used as CRM when pursuit workflows need flexible apps beyond a fixed sales board.",
        bestWhen:
          "Your RFP process is idiosyncratic and you will invest in shaping workspaces.",
      },
      {
        productSlug: "monday-sales-crm",
        why: "Visual sales CRM for collaborative pursuit boards, automations, and cross-role visibility.",
        bestWhen:
          "BD and technical contributors already work in board-style tools.",
      },
      {
        productSlug: "salesforce",
        why: "Enterprise CRM platform for larger firms needing deep customization, permissions, and integrations.",
        bestWhen:
          "Multi-office governance and admin capacity justify a configurable platform.",
      },
      {
        productSlug: "creatio",
        why: "No-code CRM and workflow platform for firms that want to encode pursuit approvals and handoffs without heavy custom code.",
        bestWhen:
          "Process automation around pursuits matters and you have capacity to design workflows carefully.",
      },
    ],
  }),

  music: pack("music", "musicians", {
    relatedIndustrySlugs: [
      "small-business",
      "hospitality",
      "nonprofit",
      "education",
    ],
    priorities: [
      {
        id: "contacts",
        title: "Collaborator & buyer contacts",
        description:
          "Venues, labels, supervisors, and collaborators stay in one owned list.",
        icon: "users",
        capabilitySlug: "contact-management",
      },
      {
        id: "pipeline",
        title: "Booking / pitch pipeline",
        description:
          "Pitches and booking asks have stages and next steps.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "follow-up",
        title: "Follow-up discipline",
        description:
          "Aging pitches remain visible between sessions and tours.",
        icon: "clipboard",
      },
      {
        id: "relationships",
        title: "Relationship memory",
        description:
          "Notes from past projects inform the next booking ask.",
        icon: "mail",
        capabilitySlug: "relationship-management",
      },
      {
        id: "boundary",
        title: "CRM vs touring / release tools",
        description:
          "Routing, settlements, and release ops often stay adjacent; CRM owns relationships and pitches.",
        icon: "layers",
      },
      {
        id: "collab",
        title: "Manager / artist shared view",
        description:
          "Managers and artists see the same open asks without inbox archaeology.",
        icon: "building",
      },
    ],
    useCases: [
      {
        id: "relationships",
        title: "Industry relationship management",
        bestWhen: "Collaborator contacts reset each project.",
        icon: "users",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "pipeline",
        title: "Booking and pitch pipeline",
        bestWhen: "Multiple asks compete for limited follow-up energy.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "outbound",
        title: "Outbound booking outreach",
        bestWhen: "Venue and supervisor outreach is ad hoc.",
        icon: "zap",
        useCaseSlug: "outbound-sales",
        href: "/use-cases/outbound-sales/",
      },
      {
        id: "follow-up",
        title: "Pitch follow-up",
        bestWhen: "Promising threads die between sessions.",
        icon: "mail",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "contacts",
        title: "Contact hygiene across projects",
        bestWhen: "Managers and artists need shared memory.",
        icon: "building",
        useCaseSlug: "contact-management",
        href: "/use-cases/contact-management/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Simple pitch stages",
        description:
          "Idea, pitched, negotiating, confirmed/passed — keep them honest and few.",
        icon: "git-branch",
      },
      {
        id: "boundary",
        title: "Touring tools stay separate",
        description:
          "Do not force routing and settlements into CRM unless that is deliberate.",
        icon: "layers",
      },
      {
        id: "capture",
        title: "Capture habit after every meeting",
        description:
          "One note and next step after each industry conversation beats perfect taxonomy.",
        icon: "clipboard",
      },
    ],
    evaluationQuestions: [
      { question: "How do venue and collaborator contacts stay shared with a manager?" },
      { question: "Can pitch stages stay simple enough to update between sessions?" },
      { question: "What lives in CRM vs touring or release tools?" },
      { question: "How are follow-ups tracked when travel disrupts routines?" },
      { question: "What relationship notes inform the next booking ask?" },
      { question: "Do you need collaborative access or is solo CRM enough?" },
    ],
    buyingFramework: buyingSteps("music", [
      {
        title: "Map pitch-to-confirm",
        description: "From idea through confirmed booking.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "List relationship must-haves",
        description: "Contacts, notes, and shared access.",
        href: "/capabilities/relationship-management/",
        cta: "Relationship capability",
      },
      {
        title: "Draw tool boundaries",
        description: "CRM vs touring and release ops.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Estimate seats",
        description: "Artist, manager, and any assistant.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for simple CRM and relationships.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "capsule",
        why: "Small-business CRM for contact management and straightforward pipelines — practical for booking asks without enterprise overhead.",
        bestWhen:
          "You need owned pitches and contact history more than a touring operations suite.",
      },
      {
        productSlug: "streak",
        why: "Gmail-native CRM for musicians and managers whose outreach already lives in email threads.",
        bestWhen:
          "Pipeline beside the inbox is enough — accept that touring logistics stay elsewhere.",
      },
      {
        productSlug: "folk",
        why: "Simple relationship CRM for organizing industry contacts and collaborative outreach.",
        bestWhen:
          "Network memory is the primary gap for a lean artist or manager pod.",
      },
      {
        productSlug: "keap",
        why: "SMB CRM with automation for fan, venue, or client nurture when follow-up sequences matter.",
        bestWhen:
          "You run repeatable outreach programs and still keep delivery/tour tools separate.",
      },
      {
        productSlug: "nimble",
        why: "Social/relationship CRM with mailbox sync for industry contacts across email and social channels.",
        bestWhen:
          "Relationship context spans social and email more than a formal sales org needs.",
      },
    ],
  }),

  "web-design": pack("web-design", "web design studios", {
    relatedIndustrySlugs: [
      "small-business",
      "saas",
      "retail-ecommerce",
      "nonprofit",
    ],
    priorities: [
      {
        id: "pipeline",
        title: "Prospect pipeline",
        description:
          "Inquiry → proposal → signed stays owned while you deliver other work.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "follow-up",
        title: "Proposal follow-up",
        description:
          "Aging quotes have next touches before they expire.",
        icon: "mail",
        capabilitySlug: "lead-management",
      },
      {
        id: "clients",
        title: "Client & stakeholder history",
        description:
          "Past decisions and contacts inform the next conversation.",
        icon: "users",
        capabilitySlug: "contact-management",
      },
      {
        id: "handoff",
        title: "Sales-to-delivery handoff",
        description:
          "Won deals carry scope notes into PM or design tools.",
        icon: "clipboard",
        capabilitySlug: "deal-management",
      },
      {
        id: "boundary",
        title: "CRM vs project boards",
        description:
          "Keep sprint tasks in PM tools; CRM owns pipeline and relationships.",
        icon: "layers",
        capabilitySlug: "integrations",
      },
      {
        id: "retainers",
        title: "Retainer / maintenance re-engagement",
        description:
          "Past clients are easy to find when maintenance outreach is timely.",
        icon: "building",
        capabilitySlug: "account-management",
      },
    ],
    useCases: [
      {
        id: "inbound",
        title: "Inbound project inquiry capture",
        bestWhen: "Website leads lack shared ownership.",
        icon: "zap",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "pipeline",
        title: "Proposal pipeline management",
        bestWhen: "Quotes expire while you deliver for other clients.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "follow-up",
        title: "Proposal follow-up",
        bestWhen: "Open quotes lack next-touch dates.",
        icon: "mail",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "accounts",
        title: "Client account management",
        bestWhen: "Retainers and upsells need past-project context.",
        icon: "building",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "relationships",
        title: "Stakeholder relationship memory",
        bestWhen: "Multiple contacts churn across redesign cycles.",
        icon: "users",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Short prospect stages",
        description:
          "Inquiry, discovery, proposal, signed/lost — avoid stuffing delivery tasks into CRM.",
        icon: "git-branch",
      },
      {
        id: "boundary",
        title: "CRM vs PM/design tools",
        description:
          "Kickoff notes can hand off; sprint boards should not live in CRM.",
        icon: "layers",
      },
      {
        id: "handoff",
        title: "Required win fields",
        description:
          "Capture scope notes and stakeholders before marking signed.",
        icon: "form",
      },
      {
        id: "review",
        title: "Monday aging-proposal review",
        description:
          "A weekly look at open quotes beats perfect forecasting.",
        icon: "chart",
      },
    ],
    evaluationQuestions: [
      { question: "How do inquiries get an owner within a day?" },
      { question: "Can stages stay short while still tracking proposals?" },
      { question: "What fields must travel into your PM tool at kickoff?" },
      { question: "Where do sprint tasks live relative to CRM?" },
      { question: "How are past client preferences found for retainer outreach?" },
      { question: "Does email sync matter for your Google Workspace workflow?" },
    ],
    buyingFramework: buyingSteps("web-design", [
      {
        title: "Map inquiry-to-signed",
        description: "From lead through proposal and kickoff.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Separate sales from delivery",
        description: "CRM vs PM and design tools.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Check email / Workspace fit",
        description: "Especially if the studio lives in Gmail.",
        href: "/capabilities/email/",
        cta: "Email capability",
      },
      {
        title: "Estimate seats",
        description: "Sellers, studio leads, and light PM access.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for pipeline and small-team CRM.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
    productFitGuidance: [
      {
        productSlug: "insightly",
        why: "Service SMB CRM with pipeline plus light project context for sales-to-delivery handoffs — without becoming the sprint board.",
        bestWhen:
          "Won projects need structured handoff notes and you keep delivery in PM tools.",
      },
      {
        productSlug: "copper",
        why: "Google Workspace-native CRM for studios whose sales work already happens in Gmail and Google apps.",
        bestWhen:
          "Workspace fit matters more than a marketing suite or enterprise platform.",
      },
      {
        productSlug: "hubspot",
        why: "CRM platform useful when inbound marketing and proposal pipelines share one system.",
        bestWhen:
          "Content and lead capture are part of growth — verify which hubs you need early.",
      },
      {
        productSlug: "capsule",
        why: "Simple contact and pipeline CRM for freelancers and boutique studios that want ownership without complexity.",
        bestWhen:
          "A lean team needs proposal stages and client history first.",
      },
      {
        productSlug: "apptivo",
        why: "All-in-one SMB suite CRM for studios consolidating sales admin with other business apps.",
        bestWhen:
          "You want suite breadth at small-business scale and will still keep design delivery elsewhere.",
      },
    ],
  }),

  "security-companies": pack(
    "security-companies",
    "security companies",
    {
      relatedIndustrySlugs: [
        "manufacturing",
        "construction",
        "legal-services",
        "financial-services",
      ],
      priorities: [
        {
          id: "pipeline",
          title: "Opportunity pipeline",
          description:
            "Bids and renewals have owners, stages, and next steps.",
          icon: "funnel",
          capabilitySlug: "pipeline-management",
        },
        {
          id: "accounts",
          title: "Site & account relationships",
          description:
            "Multi-site clients and decision-makers stay mapped across contracts.",
          icon: "building",
          capabilitySlug: "account-management",
        },
        {
          id: "complex",
          title: "Long-cycle pursuits",
          description:
            "Procurement, security, and operations stakeholders share one opportunity.",
          icon: "layers",
          capabilitySlug: "relationship-management",
        },
        {
          id: "forecast",
          title: "Renewal & award foresight",
          description:
            "Leaders see likely awards and renewals without verbal-only updates.",
          icon: "chart",
          capabilitySlug: "forecasting",
        },
        {
          id: "permissions",
          title: "Access & admin controls",
          description:
            "Sensitive client and site notes need clear permissions — verify with vendors.",
          icon: "shield",
          capabilitySlug: "security-administration",
        },
        {
          id: "boundary",
          title: "CRM vs operations / guard systems",
          description:
            "Scheduling and incident systems stay operational; CRM owns commercial relationships.",
          icon: "puzzle",
          capabilitySlug: "integrations",
        },
      ],
      useCases: [
        {
          id: "pipeline",
          title: "Bid and renewal pipeline",
          bestWhen: "Multiple pursuits compete for limited BD time.",
          icon: "funnel",
          useCaseSlug: "pipeline-management",
          href: "/use-cases/pipeline-management/",
        },
        {
          id: "complex",
          title: "Complex multi-stakeholder sales",
          bestWhen: "Procurement and site leaders share one deal.",
          icon: "layers",
          useCaseSlug: "complex-sales-processes",
          href: "/use-cases/complex-sales-processes/",
        },
        {
          id: "accounts",
          title: "Multi-site account management",
          bestWhen: "Clients span locations and renewals.",
          icon: "building",
          useCaseSlug: "account-management",
          href: "/use-cases/account-management/",
        },
        {
          id: "field",
          title: "Field relationship coverage",
          bestWhen: "BD and account managers meet on site.",
          icon: "map",
          useCaseSlug: "field-sales",
          href: "/use-cases/field-sales/",
        },
        {
          id: "forecast",
          title: "Award and renewal forecasting",
          bestWhen: "Staffing and margin planning need earlier signal.",
          icon: "chart",
          useCaseSlug: "sales-forecasting",
          href: "/use-cases/sales-forecasting/",
        },
      ],
      implementationConsiderations: [
        {
          id: "stages",
          title: "Stages that match bid and renewal gates",
          description:
            "Include RFP, site walk, proposal, and renewal checkpoints you already run.",
          icon: "git-branch",
        },
        {
          id: "permissions",
          title: "Sensitive site-note permissions",
          description:
            "Define who can see client security-sensitive notes before migration.",
          icon: "shield",
        },
        {
          id: "boundary",
          title: "CRM vs guard / ops platforms",
          description:
            "Keep scheduling and incidents in ops systems; CRM owns commercial follow-through.",
          icon: "layers",
        },
        {
          id: "handoff",
          title: "Won-to-ops handoff fields",
          description:
            "Require site contacts and scope notes when opportunities close-won.",
          icon: "form",
        },
      ],
      evaluationQuestions: [
        { question: "Can stages reflect bid, site walk, proposal, and renewal?" },
        { question: "How are multi-site accounts and contacts structured?" },
        { question: "What permission model fits sensitive client notes?" },
        { question: "What stays in CRM vs guard scheduling or incident systems?" },
        { question: "What fields are required when a contract is won?" },
        { question: "What forecast view helps staffing without false precision?" },
      ],
      buyingFramework: buyingSteps("security-companies", [
        {
          title: "Map bid-to-renewal",
          description: "From pursuit through award and renewal.",
          href: "/use-cases/pipeline-management/",
          cta: "Pipeline use case",
        },
        {
          title: "Define security & access needs",
          description: "Permissions and sensitive note handling.",
          href: "/guides/crm-evaluation-guide/",
          cta: "Evaluation guide",
        },
        {
          title: "Draw ops-tool boundaries",
          description: "CRM vs guard and incident platforms.",
          href: "/guides/crm-requirements-guide/",
          cta: "Requirements guide",
        },
        {
          title: "Estimate seats",
          description: "BD, account managers, and leaders.",
          href: "/tools/crm-cost-calculator/",
          cta: "CRM Cost Calculator",
        },
        {
          title: "Shortlist with Finder",
          description: "Filter for pipeline, accounts, and admin needs.",
          href: "/tools/crm-finder/",
          cta: "Start CRM Finder",
        },
      ]),
      productFitGuidance: [
        {
          productSlug: "salesforce",
          why: "Enterprise CRM platform for mid-market and larger security firms that need deep account structures, permissions, and integrations.",
          bestWhen:
            "Multi-site governance and admin capacity justify a configurable enterprise platform — not a lightweight solo CRM.",
        },
        {
          productSlug: "dynamics-365",
          why: "Microsoft sales CRM for pipeline and forecasting when the firm already lives in Microsoft 365.",
          bestWhen:
            "Microsoft stack fit and mid-market/enterprise sales process matter more than a niche vertical CRM.",
        },
        {
          productSlug: "hubspot",
          why: "CRM platform with marketing and sales hubs useful when inbound lead capture and nurture sit beside BD pipelines.",
          bestWhen:
            "Growing security firms need shared CRM plus marketing — verify hub scope for year one.",
        },
        {
          productSlug: "pipedrive",
          why: "Pipeline-first sales CRM for visual deal management and activity-based selling on growing BD teams.",
          bestWhen:
            "You need clear bid pipelines without enterprise platform weight — confirm multi-site account depth.",
        },
        {
          productSlug: "zoho-crm",
          why: "Configurable CRM suite option for teams that want broad CRM capability at SMB-to-mid-market scale.",
          bestWhen:
            "Budget-conscious firms need customization room and will still keep guard ops systems separate.",
        },
      ],
    },
  ),
};
