import type { ResourceHubProfile } from "@/domain";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

/**
 * CRM Business Case Template — approval-ready workbook (not a checklist).
 * No Pass/Fail/Must-have as the interaction model; confidence badges for assumptions.
 */
export const crmBusinessCaseTemplateDepth: Depth = {
  displayTitle: "CRM Business Case Template",
  badgeLabel: "Business Case",
  toolkitLabel: "CRM Decision Toolkit",
  tagline:
    "Build an approval-ready case for CRM investment — current-state costs, options, TCO, benefits, ROI assumptions, risks, and the decision request.",
  heroExplanation:
    "Turn an identified CRM problem into a financially and operationally credible proposal sponsors, finance, and procurement can review — without invented ROI or vendor uplift claims.",
  overview:
    "This template helps Sales Ops, RevOps, sales leadership, IT, finance, and transformation teams prepare a CRM business case after problem definition and basic requirements discovery, and before purchase approval or contract signature. It covers current-state cost, desired outcomes, options considered (including do nothing), full TCO, benefits modelling with confidence labels, financial justification, risks, realisation plan, recommendation, and formal decision. Update it after vendor evaluation with shortlisted costs. It is not an evaluation checklist — Pass / Fail / Must-have belong on the Evaluation Checklist and Vendor Scorecard.",
  whoThisIsFor:
    "Sales Operations, Revenue Operations, sales leadership, CRM/project owners, IT, Finance, Procurement, founders / SME leadership, and transformation teams who need leadership approval to select, purchase, replace, or expand CRM software.",
  whatMattersIntro:
    "A credible business case separates verified costs, internal estimates, scenario assumptions, and unknowns. Cost the status quo. Compare options. Model TCO beyond licences. Label every financial assumption. Ask for a decision sized to the diligence you actually completed.",
  howToUse:
    "Capture the problem and current-state costs first. Define outcomes. Compare options A–D. Build Year 1 and recurring costs in the Excel model. Model benefits with confidence badges. Review the financial case with finance. Name risks and realisation checkpoints. Write the recommendation and decision ask last. Attach evaluation evidence as appendices — do not turn the business case into a scorecard.",
  workedExample:
    "Example structure (hypothetical teaching scenario — not a SoftwareGlimpse case study): A mid-market sales team documents siloed spreadsheets and weekly pipeline rebuild hours as the current-state cost (Estimated). Options compared: do nothing, harden the sheet process, implement a CRM, or buy a lighter sales engagement tool. After shortlisting, Year 1 investment and recurring licences are entered as Verified where quotes exist and Estimated where partner work is pending. Productivity hours saved are labelled Scenario. The ask is approval to proceed to contract on the recommended option, with a 90-day adoption review — not a fabricated ROI percentage.",
  glance: {
    primaryGoal:
      "An approval-ready CRM business case: problem, cost, options, TCO, benefits, risks, decision",
    typicalTeam:
      "Business owner, executive sponsor, finance partner, ops / CRM owner",
    commonPriorities: [
      "Current-state cost",
      "Options including do nothing",
      "Full TCO",
      "Benefits with confidence",
      "Clear decision ask",
    ],
  },
  whatsInside: [
    {
      id: "exec-summary",
      title: "Cover & executive summary",
      description:
        "Decision ask, current problem, recommended option, investment, benefit, payback, and decision date.",
      icon: "file",
    },
    {
      id: "current-state",
      title: "Current state & baseline cost",
      description:
        "Problem, process, systems, pain points, and measurable current annual cost with confidence.",
      icon: "chart",
    },
    {
      id: "outcomes-options",
      title: "Outcomes & options",
      description:
        "Success targets plus Options A–D so the case is not “we want Vendor X.”",
      icon: "list",
    },
    {
      id: "tco-benefits",
      title: "TCO & benefits model",
      description:
        "Year 1 and recurring costs, productivity / revenue scenarios / cost avoidance — labelled assumptions.",
      icon: "tag",
    },
    {
      id: "financial-case",
      title: "Financial case & risks",
      description:
        "KPI cards, 3-year cash flows, payback/ROI when inputs exist, risks, and dependencies.",
      icon: "shield",
    },
    {
      id: "decision",
      title: "Recommendation & approval",
      description:
        "Recommendation narrative, assumptions register, and formal sponsor / finance decision block.",
      icon: "check",
    },
  ],
  evidenceRules: {
    countsAs: [
      "Licence or quote figures marked Verified with a named source",
      "Internal time or cost estimates marked Estimated with an owner",
      "Scenario assumptions clearly labelled as modelling inputs",
      "Blank or Unknown fields where validation is still required",
    ],
    doesNotCount: [
      "Invented ROI or productivity uplift percentages",
      "Vendor marketing ROI applied without your own model",
      "Pass / Fail checklist scoring as a substitute for financial justification",
      "Cost totals with no stated assumptions or confidence",
    ],
  },
  challenges: [
    {
      id: "fake-precision",
      title: "Fake precision kills trust",
      pain: "Sponsors reject cases that present guesses as facts.",
      crmHelps:
        "Confidence badges (Verified / Estimated / Scenario / Unknown) keep uncertainty visible.",
    },
    {
      id: "vendor-as-case",
      title: "Product name is not a business case",
      pain: "“We want HubSpot/Salesforce/Pipedrive” without options or cost of doing nothing.",
      crmHelps:
        "Options A–D force do-nothing, improve-existing, CRM, and alternative tooling into one comparison.",
    },
    {
      id: "licence-only-cost",
      title: "Licence price ≠ TCO",
      pain: "Implementation, migration, admin, and training appear after signature.",
      crmHelps:
        "Year 1 and recurring worksheets surface the real commitment before approval.",
    },
  ],
  outcomes: [
    {
      id: "approval-ready",
      title: "An ask leadership can decide",
      description:
        "Problem, options, costs, benefits, risks, and decision appear in one coherent pack.",
    },
    {
      id: "honest-finance",
      title: "Finance can stress-test the model",
      description:
        "Excel formulas expose drivers; confidence labels show what still needs validation.",
    },
    {
      id: "post-approval-use",
      title: "Useful after the signature",
      description:
        "Roadmap and 30/90/6/12-month checkpoints turn the case into a realisation plan.",
    },
  ],
  priorities: [
    {
      id: "roi-guide",
      title: "How to calculate CRM ROI",
      description:
        "Use scenario assumptions — never invent uplift. Pair with the Excel benefits sheet.",
      href: "/guides/crm-roi-guide/",
    },
    {
      id: "tco-guide",
      title: "How to model CRM TCO",
      description:
        "Licence, implementation, admin, and change costs beyond the quote.",
      href: "/guides/crm-total-cost-guide/",
    },
    {
      id: "business-case-guide",
      title: "How to build a CRM business case",
      description: "Narrative structure and common mistakes for sponsor memos.",
      href: "/guides/crm-business-case/",
    },
  ],
  workflowSteps: [
    {
      id: "problem-cost",
      label: "Document problem & current cost",
      detail:
        "Baselines, systems, pain points, and estimated current annual cost with confidence.",
    },
    {
      id: "outcomes",
      label: "Define success outcomes",
      detail: "Targets, measurement, owners, and non-financial strategic value.",
    },
    {
      id: "options",
      label: "Compare options A–D",
      detail: "Do nothing, improve existing, implement CRM, alternative — then recommend.",
    },
    {
      id: "tco-benefits",
      label: "Model TCO and benefits",
      detail: "Excel sheets for Year 1, recurring, productivity, scenarios, avoidance.",
    },
    {
      id: "financial-risks",
      label: "Review financial case & risks",
      detail: "Payback/ROI only when inputs exist; register assumptions and mitigations.",
    },
    {
      id: "decide",
      label: "Recommend and request decision",
      detail: "Write the ask, realisation plan, and approval block for sponsor / finance.",
    },
  ],
  artifactSections: [
    {
      id: "cover",
      title: "1. Cover & executive summary",
      accent: "navy",
      intro: "What an executive reads first.",
      items: [
        {
          id: "1.1",
          label: "Decision request (“We are requesting approval to…”)",
          detail: "One clear ask sized to completed diligence.",
        },
        {
          id: "1.2",
          label: "Current problem / recommended option / investment / benefit / payback",
          detail: "Compact executive summary fields — blank until evidenced.",
        },
      ],
    },
    {
      id: "why-change",
      title: "2. Why change? (current state)",
      accent: "blue",
      intro: "Problem, process, systems, and pain points.",
      items: [
        {
          id: "2.1",
          label: "Business problem and current process narrative",
          detail: "2–4 sentences + how work runs today.",
        },
        {
          id: "2.2",
          label: "Systems and pain-point tables",
          detail: "Replace / integrate / retain; evidence/source columns.",
        },
      ],
    },
    {
      id: "baseline",
      title: "3. Current-state cost (baseline)",
      accent: "teal",
      intro: "Measured vs estimated vs unquantified.",
      items: [
        {
          id: "3.1",
          label: "Baseline metrics with confidence",
          detail: "Verified / Estimated / Scenario / Unknown on every row.",
        },
        {
          id: "3.2",
          label: "Current annual cost estimate + total",
          detail: "Admin, reporting, software, productivity, other.",
        },
      ],
    },
    {
      id: "success",
      title: "4. Desired outcomes",
      accent: "green",
      intro: "What success looks like.",
      items: [
        {
          id: "4.1",
          label: "Outcome / baseline / target / measurement / owner / date",
          detail: "Operational targets you can re-measure.",
        },
        {
          id: "4.2",
          label: "Non-financial benefits with strategic value H/M/L",
          detail: "CX, visibility, data quality, compliance, scalability, etc.",
        },
      ],
    },
    {
      id: "options",
      title: "5. Options considered",
      accent: "indigo",
      intro: "Prevent brand preference as the whole case.",
      items: [
        {
          id: "5.1",
          label: "Options A–D comparison (cost, benefit, risk, fit)",
          detail: "Do nothing · Improve · CRM · Alternative.",
        },
        {
          id: "5.2",
          label: "Why the recommended option",
          detail: "Narrative tied to the comparison — not vendor marketing.",
        },
      ],
    },
    {
      id: "tco",
      title: "6. Investment / TCO",
      accent: "cyan",
      intro: "More than licence price.",
      items: [
        {
          id: "6.1",
          label: "Year 1 line items + Year 2+ recurring",
          detail: "Partner, migration, training, contingency, admin, support.",
        },
        {
          id: "6.2",
          label: "Year 1 investment, annual recurring, 3-year TCO",
          detail: "Calculated in Excel from your inputs.",
        },
      ],
    },
    {
      id: "benefits",
      title: "7. Benefits & financial case",
      accent: "amber",
      intro: "Value creation without fake ROI.",
      items: [
        {
          id: "7.1",
          label: "Productivity, revenue scenarios, cost avoidance",
          detail: "Scenario assumptions labelled; CRM does not auto-create revenue.",
        },
        {
          id: "7.2",
          label: "KPI cards, 3-year cash flow, payback / ROI when populated",
          detail: "Never manufacture numbers.",
        },
      ],
    },
    {
      id: "risks-realise",
      title: "8. Risks, realisation, recommendation, decision",
      accent: "rose",
      intro: "What could block value — and how you approve.",
      items: [
        {
          id: "8.1",
          label: "Risks, dependencies, roadmap, 30/90/6/12-month measures",
          detail: "Keeps the case useful after approval.",
        },
        {
          id: "8.2",
          label: "Recommendation, assumptions register, approval signatures",
          detail: "Approved / with conditions / more info / not approved.",
        },
      ],
    },
  ],
  downloadFiles: [
    {
      href: "/resources/crm-business-case-template.md",
      label: "Download Markdown",
      format: "md",
    },
  ],
  faq: [
    {
      question: "What questions does this template help me answer?",
      answer:
        "What problem we are solving, what happens today and what it costs, what success looks like, which options we considered, what the CRM will really cost, what benefits we expect, whether the investment is financially justified, what risks remain, what we recommend, and what decision is required.",
    },
    {
      question: "When should I use the business case?",
      answer:
        "After initial problem definition and basic requirements discovery, and before final purchase approval or contract signature. Update it after vendor evaluation with real shortlisted costs. It sits near the approval stage — after evaluation, before implementation.",
    },
    {
      question: "Do I need an ROI percentage?",
      answer:
        "Only if your model has enough inputs to calculate one. Inventing ROI weakens the case. Prefer Verified costs, Estimated internals, and clearly labelled Scenario benefits. Leave Unknown blank.",
    },
    {
      question: "How is this different from the Evaluation Checklist?",
      answer:
        "The checklist tests whether a product meets requirements (Pass / Partial / Fail / Not tested). The business case justifies the investment and requests approval. Keep Pass/Fail on evaluation artifacts; use confidence badges here.",
    },
    {
      question: "PDF vs Excel — which should I use?",
      answer:
        "Use the PDF as the narrative workbook for sponsors. Use Excel as the calculation engine (TCO, benefits, cash flows, payback, ROI). Fill numbers in Excel first, then transfer summary figures into the PDF.",
    },
    {
      question: "How do I model CRM TCO?",
      answer:
        "Include Year 1 licences, add-ons, partner and internal effort, migration, integrations, training, change, security work, and contingency — then Year 2+ recurring licences, admin, support, and platform costs. The Excel 05_TCO sheet sums these into Year 1 investment, annual recurring, and 3-year TCO.",
    },
    {
      question: "What are common mistakes?",
      answer:
        "Treating a vendor name as the case; ignoring do-nothing cost; quoting licence price as TCO; presenting scenario hours-saved as verified fact; inventing ROI; and asking for full purchase while must-have diligence is still open.",
    },
    {
      question: "Which tools should I use before this?",
      answer:
        "Requirements Builder / template, CRM Finder, Evaluation Checklist, Vendor Scorecard, and Cost / TCO calculators. After approval, move to Implementation Checklist or Planner and measure outcomes against this case.",
    },
  ],
  heroVisual: {
    src: "/resources/crm-business-case-template-hero-v2.png",
    alt: "CRM Business Case cover with executive summary and flow from current state to approval.",
    caption:
      "Current state → Investment → Benefits → ROI → Recommendation → Approval.",
  },
  needsVisual: {
    src: "/resources/crm-business-case-template-needs-v2.png",
    alt: "What’s inside the CRM Business Case Template: executive summary, baseline cost, options, TCO, benefits, financial case, risks, and decision.",
    caption: "A working business case workbook — not a compliance checklist.",
  },
  workflowVisual: {
    src: "/resources/crm-business-case-template-workflow-v2.png",
    alt: "Six steps to build a CRM business case: problem and cost, outcomes, options, TCO and benefits, financial case and risks, recommendation and decision.",
    caption: "Build the financial model in Excel; present the narrative in the PDF.",
  },
  useBefore: [
    "crm-requirements-template",
    "crm-evaluation-checklist",
    "crm-vendor-scorecard",
    "crm-comparison-worksheet",
  ],
  useWith: ["crm-comparison-worksheet"],
  useNext: ["crm-implementation-checklist"],
  journeySlugs: [
    "crm-requirements-template",
    "crm-evaluation-checklist",
    "crm-vendor-scorecard",
    "crm-comparison-worksheet",
    "crm-business-case-template",
    "crm-implementation-checklist",
  ],
  relatedResourceSlugs: [
    "crm-requirements-template",
    "crm-evaluation-checklist",
    "crm-vendor-scorecard",
    "crm-comparison-worksheet",
    "crm-implementation-checklist",
  ],
  featuredGuideHrefs: [
    "/guides/crm-business-case/",
    "/guides/crm-roi-guide/",
    "/guides/crm-total-cost-guide/",
    "/guides/crm-pricing-guide/",
  ],
  relatedToolHrefs: [
    { href: "/tools/crm-cost-calculator/", label: "CRM Cost Calculator" },
    { href: "/tools/crm-tco-calculator/", label: "CRM TCO Calculator" },
    { href: "/tools/crm-finder/", label: "CRM Finder" },
    { href: "/tools/crm-vendor-scorecard/", label: "CRM Vendor Scorecard" },
    {
      href: "/tools/crm-requirements-builder/",
      label: "CRM Requirements Builder",
    },
  ],
  primaryCta: {
    href: "/resources/crm-business-case-template.pdf",
    label: "Download Business Case PDF",
  },
  secondaryCta: {
    href: "/resources/crm-business-case-template.xlsx",
    label: "Build the Financial Model in Excel",
  },
  categorySlug: "crm",
  lastReviewedAt: "2026-08-15",
};
