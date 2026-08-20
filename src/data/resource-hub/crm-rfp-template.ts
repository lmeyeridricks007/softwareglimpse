import type { ResourceHubProfile } from "@/domain";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

/**
 * CRM RFP Template — vendor-facing procurement brief (not a checklist).
 * Stable slug: crm-rfp-template
 * SAMPLE requirements use CRM-REQ-001…010 + REQ-* from crm-rfp-requirements.ts
 */
export const crmRfpTemplateDepth: Depth = {
  displayTitle: "CRM RFP Template",
  badgeLabel: "RFP",
  toolkitLabel: "CRM Evaluation Toolkit",
  tagline:
    "Issue a structured CRM request for proposal so every vendor answers the same requirements, pricing model, and implementation assumptions.",
  heroExplanation:
    "This is not a Pass / Fail checklist. It is a buyer-created document you send to CRM vendors: context, stable requirement IDs, delivery-method responses (Native / Config / Custom / Partner / Roadmap / Not supported), pricing, and a declaration — with an INTERNAL evaluation page you keep.",
  overview:
    "A CRM RFP collects comparable written proposals from shortlisted vendors. It packages signed requirements (with stable IDs shared with the Requirements pillar and Scorecard), explains how to respond, and normalises commercial and implementation answers. Use it when procurement, security, or multi-vendor formality requires parallel written responses — not for every small self-serve CRM buy. Score answers on the Vendor Scorecard; finalise with the Decision Matrix and Business Case.",
  whoThisIsFor:
    "Ops, IT, procurement, and selection leads who need written, comparable vendor answers before or alongside demos — typically with several finalists, material integrations, or formal security review.",
  whatMattersIntro:
    "Prioritize traceability to signed must-haves, a strict response format, delivery-method honesty, normalised pricing, and explicit exceptions. Long marketing briefs invite boilerplate. Do not invent requirements mid-RFP.",
  howToUse:
    "Complete requirements first. Customise Project Context, Objectives, Scope, and Users. Replace SAMPLE requirement rows with your signed set (keep stable IDs). Issue the Excel workbook as the response file (PDF as the readable brief). Score returned answers on the Vendor Scorecard. Keep the INTERNAL page off the vendor package.",
  workedExample:
    "Illustrative teaching scenario (not a SoftwareGlimpse case study): Three finalists receive the same RFP Excel. CRM-REQ-008 (email integration) is MUST HAVE. Vendor A answers Native on the quoted edition with a docs URL. Vendor B answers Roadmap — scored as not currently available. Vendor C answers Partner with a named connector and annual add-on line in Pricing. Completeness and must-have gaps are reviewed on the INTERNAL page before demos.",
  workedExampleStructured: {
    title: "Worked example (illustrative)",
    requirement:
      "Response row CRM-REQ-012: Export contacts, deals, and activities in a documented format.",
    vendors: [
      {
        name: "Vendor A",
        result: "PASS",
        note: "Delivery Native; cited export documentation; named which roles can run a full export.",
      },
      {
        name: "Vendor B",
        result: "PARTIAL",
        note: "Delivery Configuration; contacts only — activities need a support request; raised for demo.",
      },
      {
        name: "Vendor C",
        result: "FAIL",
        note: "Delivery Not supported on quoted edition — must-have gap on INTERNAL page.",
      },
    ],
    evidence:
      "Written RFP Excel responses and documentation URLs — EXAMPLE teaching only.",
    disclaimer:
      "Hypothetical vendor answers for teaching the artifact — not a SoftwareGlimpse case study.",
  },
  glance: {
    primaryGoal:
      "Comparable written CRM proposals with stable requirement IDs and normalised pricing",
    typicalTeam: "Ops, IT, procurement, RFP owner, executive sponsor",
    commonPriorities: [
      "Stable requirement IDs",
      "Delivery method honesty",
      "Normalised pricing / TCO",
      "Security evidence",
      "Exceptions & assumptions",
      "Scorecard handoff",
    ],
  },
  whatsInside: [
    {
      id: "instructions",
      title: "Instructions to vendors",
      description:
        "Response rules and Native / Config / Custom / Partner / Roadmap / Unsupported legend.",
      icon: "list",
    },
    {
      id: "context",
      title: "Buyer context & objectives",
      description:
        "Company, current environment, why you are evaluating, OBJ table, scope and phases.",
      icon: "file",
    },
    {
      id: "requirements",
      title: "Requirements response tables",
      description:
        "CRM-REQ-* and REQ-* IDs with vendor response, delivery method, edition, evidence.",
      icon: "check",
    },
    {
      id: "tech-sec",
      title: "Technical, migration & security",
      description:
        "Integrations matrix, migration scope, security/privacy response questions.",
      icon: "shield",
    },
    {
      id: "commercial",
      title: "Implementation & pricing",
      description:
        "Timeline, training, support/SLA asks, and blank 3-year TCO structure.",
      icon: "chart",
    },
    {
      id: "declaration",
      title: "Declaration + internal page",
      description:
        "Vendor sign-off; INTERNAL evaluation page not sent to vendors.",
      icon: "lock",
    },
  ],
  evidenceRules: {
    countsAs: [
      "Requirement IDs that match your signed requirements / scorecard criteria",
      "Delivery method stated per row with edition/tier named",
      "Documentation URL, demo reference, or written confirmation as evidence",
      "Explicit roadmap, partner, and exception callouts",
    ],
    doesNotCount: [
      "Marketing decks substituted for the response tables",
      "Removing or renumbering requirement IDs",
      "Treating roadmap items as currently available",
      "Invented list prices or TCO figures in the template",
    ],
  },
  challenges: [
    {
      id: "checklist-confusion",
      title: "Treating an RFP like an internal checklist",
      pain: "Vendors get Pass/Fail rows instead of a response format they can fill.",
      crmHelps:
        "Delivery-method columns and vendor-facing instructions replace checklist Result columns.",
    },
    {
      id: "incomparable-pricing",
      title: "Incomparable commercial proposals",
      pain: "Every vendor quotes a different package shape.",
      crmHelps:
        "Normalised software / add-on / implementation / 3-year TCO sheets.",
    },
    {
      id: "id-drift",
      title: "Requirement wording drifts across artifacts",
      pain: "Scorecard criteria no longer match what vendors answered.",
      crmHelps:
        "Stable CRM-REQ-* IDs shared with the Requirements pillar and Scorecard handoff.",
    },
  ],
  outcomes: [
    {
      id: "comparable-answers",
      title: "Collect comparable vendor answers",
      description: "Same IDs, same delivery legend, same pricing shape.",
    },
    {
      id: "expose-gaps",
      title: "Expose unsupported must-haves early",
      description: "Not supported and Roadmap are explicit before demos.",
    },
    {
      id: "feed-scorecard",
      title: "Feed the Vendor Scorecard",
      description: "Transfer responses by requirement ID into weighted scoring.",
    },
    {
      id: "know-when-not",
      title: "Know when an RFP is overkill",
      description:
        "Tiny self-serve buys can skip formal RFP and use checklist + scorecard.",
    },
  ],
  workflowSteps: [
    {
      id: "requirements",
      label: "Freeze requirements",
      detail: "Signed must-haves with stable IDs before issuing.",
    },
    {
      id: "customise",
      label: "Customise the RFP",
      detail: "Context, objectives, scope, users, SAMPLE rows replaced.",
    },
    {
      id: "issue",
      label: "Issue to vendors",
      detail: "Same Excel package to every invited finalist; omit INTERNAL page.",
    },
    {
      id: "clarify",
      label: "Clarify exceptions",
      detail: "Use INTERNAL page; request written clarifications.",
    },
    {
      id: "demo",
      label: "Demo / POC survivors",
      detail: "Buyer-led scripts against remaining gaps.",
    },
    {
      id: "score",
      label: "Score & decide",
      detail: "Vendor Scorecard → Decision Matrix → Business Case.",
    },
  ],
  artifactSections: [
    {
      id: "cover",
      title: "1. Cover & instructions",
      accent: "navy",
      intro: "Buyer fields, deadline, response rules, delivery legend.",
      items: [
        {
          id: "1.1",
          label: "Vendor response deadline",
          detail: "Same date for every invited vendor.",
        },
        {
          id: "1.2",
          label: "Delivery method legend",
          detail: "Native through Not supported — not Pass/Fail.",
        },
      ],
    },
    {
      id: "context",
      title: "2. Context, objectives & users",
      accent: "blue",
      intro: "Why the project exists and who will use the CRM.",
      items: [
        {
          id: "2.1",
          label: "Business objectives (OBJ-*)",
          detail: "Outcomes — not feature wishlists.",
        },
        {
          id: "2.2",
          label: "Scope and phases",
          detail: "What is in Phase 1 vs later.",
        },
      ],
    },
    {
      id: "requirements",
      title: "3. Requirements response",
      accent: "teal",
      intro: "Functional, technical, migration, and security tables.",
      items: [
        {
          id: "3.1",
          label: "Stable IDs (CRM-REQ-* / REQ-*)",
          detail: "Traceable into Scorecard evidence.",
        },
        {
          id: "3.2",
          label: "Vendor response + delivery + evidence",
          detail: "Edition/tier named per row.",
        },
      ],
    },
    {
      id: "commercial",
      title: "4. Implementation & pricing",
      accent: "indigo",
      intro: "Timeline, training, support, normalised commercial sheets.",
      items: [
        {
          id: "4.1",
          label: "3-year TCO structure",
          detail: "Blank until vendors quote — no invented prices.",
        },
      ],
    },
    {
      id: "close",
      title: "5. Declaration & internal review",
      accent: "green",
      intro: "Vendor sign-off; buyer-only next steps.",
      items: [
        {
          id: "5.1",
          label: "INTERNAL — do not send to vendor",
          detail: "Completeness, gaps, demo invite / scorecard.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "Do we need an RFP for every CRM buy?",
      answer:
        "No. A small team running one or two self-serve trials usually needs requirements, an evaluation checklist, and a scorecard. Use an RFP when procurement, security review, material integrations, or several vendors require written parallel answers.",
    },
    {
      question: "How is this different from the Evaluation Checklist?",
      answer:
        "The checklist is an internal buyer test script (Pass / Partial / Fail). The RFP is an external document vendors fill using delivery methods and evidence columns.",
    },
    {
      question: "How do answers reach the Vendor Scorecard?",
      answer:
        "Keep stable requirement IDs. Transfer each vendor’s delivery method, edition, and evidence notes onto matching scorecard criteria — then apply weights and gates.",
    },
    {
      question: "Why is Excel the primary download?",
      answer:
        "Vendors need editable response tables, dropdowns, and pricing rows. The PDF is the readable brief and print pack; omit the INTERNAL page when sending.",
    },
    {
      question: "Can roadmap features count as Must Have?",
      answer:
        "No. Mark Roadmap explicitly. Score only currently available capability on the quoted edition unless you consciously accept roadmap risk.",
    },
  ],
  journeySlugs: [
    "crm-requirements-template",
    "crm-evaluation-checklist",
    "crm-rfp-template",
    "crm-vendor-scorecard",
    "crm-comparison-worksheet",
    "crm-business-case-template",
  ],
  featuredGuideHrefs: [
    "/guides/crm-vendor-evaluation/",
    "/guides/crm-evaluation-guide/",
    "/guides/crm-vendor-questions/",
    "/guides/crm-selection-process/",
  ],
  relatedToolHrefs: [
    {
      href: "/tools/crm-requirements-builder/?start=1",
      label: "Requirements Builder",
    },
    {
      href: "/tools/crm-vendor-scorecard/",
      label: "Vendor Scorecard tool",
    },
    { href: "/tools/crm-finder/", label: "CRM Finder" },
    { href: "/tools/crm-cost-calculator/", label: "CRM Cost Calculator" },
  ],
  downloadFiles: [
    {
      href: "/resources/crm-rfp-template.xlsx",
      label: "Download RFP Excel",
      format: "xlsx",
    },
    {
      href: "/resources/crm-rfp-template.pdf",
      label: "Download RFP PDF",
      format: "pdf",
    },
    {
      href: "/resources/crm-rfp-template.md",
      label: "Markdown outline",
      format: "md",
    },
  ],
  primaryCta: {
    href: "/resources/crm-rfp-template.xlsx",
    label: "Download RFP Excel",
  },
  secondaryCta: {
    href: "/resources/crm-rfp-template.pdf",
    label: "Download RFP PDF",
  },
  previewHref: "#preview",
  useBefore: ["crm-requirements-template", "crm-evaluation-checklist"],
  useWith: ["crm-vendor-scorecard", "crm-demo-checklist"],
  useNext: ["crm-vendor-scorecard", "crm-comparison-worksheet"],
  relatedResourceSlugs: [
    "crm-requirements-template",
    "crm-evaluation-checklist",
    "crm-vendor-scorecard",
    "crm-comparison-worksheet",
    "crm-business-case-template",
    "crm-field-mapping-template",
    "crm-implementation-checklist",
    "crm-demo-checklist",
  ],
  heroVisual: {
    src: "/resources/crm-rfp-template-hero.png",
    alt: "CRM RFP cover: buyer brief, glance card, vendor deadline, selection workflow.",
  },
  needsVisual: {
    src: "/resources/crm-rfp-template-needs.png",
    alt: "RFP contents: instructions, requirements tables, pricing, declaration, internal review.",
  },
  workflowVisual: {
    src: "/resources/crm-rfp-template-workflow.png",
    alt: "Requirements to RFP to vendor responses to demo to scorecard to decision.",
  },
  lastReviewedAt: "2026-08-15",
};
