import type { ResourceHubProfile } from "@/domain";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

/**
 * CRM Vendor Scorecard — weighted evaluation scoring workbook (not a checklist).
 * Stable slug: crm-vendor-scorecard
 * Complements the interactive tool at /tools/crm-vendor-scorecard/
 */
export const crmVendorScorecardDepth: Depth = {
  displayTitle: "CRM Vendor Scorecard",
  badgeLabel: "Scorecard",
  toolkitLabel: "CRM Evaluation Toolkit",
  tagline:
    "Score shortlisted CRMs against weighted requirements with evidence confidence and must-have gates.",
  heroExplanation:
    "This is not a Pass / Fail checklist. It is a scoring workbook: freeze weights, score every finalist 1–5 with confidence, apply must-have gates that cannot be averaged away, then archive totals for the committee — or mirror the same criteria in the interactive Vendor Scorecard tool.",
  overview:
    "A CRM Vendor Scorecard turns Evaluation Checklist evidence into comparable weighted scores across a frozen shortlist. Criteria come from signed requirements; weights freeze before the first session; scorers use one 1–5 legend; must-have failures disqualify regardless of total. It is not the Decision Matrix — that resource adds TCO, implementation risk, sensitivity, and the final selection recommendation after scoring is complete.",
  whoThisIsFor:
    "Buying committees, RevOps, Sales Operations, CRM project owners, and evaluators with two to four shortlisted CRMs and demo/trial evidence in hand.",
  whatMattersIntro:
    "Prioritize a dated weight freeze, a written 1–5 legend, the same scorers on every vendor, evidence confidence labels, and gates that stop a must-have failure from being averaged away. Do not invent scores or reweight after a favourite demo.",
  howToUse:
    "Download the Excel scoring engine first. Import criteria from requirements, set SAMPLE weights to your own (total 100%), freeze weights, score vendors the same day as each session with confidence and evidence refs, complete must-have gates, review Results, then write the decision. Use the PDF as the printable committee pack. Continue to the CRM Decision Matrix for TCO and final recommendation.",
  workedExample:
    "Illustrative teaching scenario (not a SoftwareGlimpse case study): Three finalists enter Setup. Weights freeze before demos. Email-sync is a must-have gate — Vendor B scores well on polish but fails the gate on the quoted edition, so the weighted total does not decide. Remaining vendors show blank or SAMPLE teaching scores only until your evidence exists. Hand off the leader to the Decision Matrix for cost and risk before contract.",
  workedExampleStructured: {
    title: "Worked example (illustrative)",
    requirement:
      "Must-have gate: email activity logs to the contact and deal on the quoted edition — weight high, gate overrides total.",
    vendors: [
      {
        name: "Vendor A",
        result: "PASS",
        note: "Scored from trial evidence with HIGH confidence; gate passes.",
      },
      {
        name: "Vendor B",
        result: "FAIL",
        note: "Strong usability impression, but capability sits on a higher edition than quoted — gate fails; total does not decide.",
      },
      {
        name: "Vendor C",
        result: "PARTIAL",
        note: "Score held as N/E until non-admin trial evidence is captured — confidence UNKNOWN.",
      },
    ],
    evidence:
      "Evaluation Checklist results plus written edition confirmation — EXAMPLE teaching only.",
    disclaimer:
      "Hypothetical Vendor A / B / C scenario for teaching the artifact — not a SoftwareGlimpse case study or ranking.",
  },
  glance: {
    primaryGoal:
      "Comparable weighted scores and gate results across a frozen shortlist",
    typicalTeam: "Buying committee, RevOps, scorers named before day one",
    commonPriorities: [
      "Weight freeze",
      "1–5 + N/E legend",
      "Evidence confidence",
      "Must-have gates",
      "Weighted totals",
      "Decision archive",
    ],
  },
  whatsInside: [
    {
      id: "weights",
      title: "Criteria & weight model",
      description:
        "SAMPLE weights to replace — categories summing to 100% before any demo.",
      icon: "chart",
    },
    {
      id: "scoring",
      title: "Vendor scoring matrix",
      description:
        "1–5 or N/E per criterion with confidence and weighted contribution.",
      icon: "list",
    },
    {
      id: "gates",
      title: "Must-have gates",
      description:
        "PASS / FAIL / UNKNOWN — failures disqualify regardless of total.",
      icon: "shield",
    },
    {
      id: "evidence",
      title: "Evidence register",
      description:
        "Link scores to checklist results, trials, demos, and written answers.",
      icon: "file",
    },
    {
      id: "results",
      title: "Results & decision",
      description:
        "Totals, residual risks, sign-off — then Decision Matrix for TCO.",
      icon: "check",
    },
    {
      id: "tool",
      title: "Interactive tool twin",
      description:
        "Mirror the same criteria in the live Vendor Scorecard tool when useful.",
      icon: "zap",
    },
  ],
  evidenceRules: {
    countsAs: [
      "A score traced to an Evaluation Checklist result or trial observation",
      "A written vendor answer for commercial and edition rows",
      "The same scorers applying the same 1–5 legend",
      "A weight freeze dated before the first session",
    ],
    doesNotCount: [
      "Scores written from memory days after the demo",
      "Reweighting criteria after a favourite demo",
      "A high total that hides a must-have failure",
      "A usability impression with no note or confidence label",
    ],
  },
  challenges: [
    {
      id: "averaging-gates",
      title: "Averages hide gate failures",
      pain: "A polished demo total masks a failed must-have on the quoted edition.",
      crmHelps:
        "Must-have gates sit beside weighted scores and can disqualify before totals decide.",
    },
    {
      id: "fake-precision",
      title: "Scores without confidence look precise",
      pain: "87 vs 81 debates when evidence is mostly vendor claims.",
      crmHelps:
        "HIGH / MEDIUM / LOW / UNKNOWN confidence and an evidence sheet keep weak proof visible.",
    },
    {
      id: "midstream-reweight",
      title: "Weights change after demos",
      pain: "Favourites get rescued by silent reweighting.",
      crmHelps:
        "Weight freeze date on Setup — changes after freeze must be documented.",
    },
  ],
  outcomes: [
    {
      id: "consistent-scores",
      title: "Score finalists consistently",
      description: "Same criteria, legend, and scorers on every vendor.",
    },
    {
      id: "gates-visible",
      title: "Keep must-have failures visible",
      description: "Gates cannot be averaged into a fake win.",
    },
    {
      id: "evidence-trail",
      title: "Trace scores to evidence",
      description: "Confidence and evidence refs survive committee review.",
    },
    {
      id: "handoff",
      title: "Hand off to Decision Matrix",
      description:
        "Scoring complete — add TCO, risk, and formal recommendation next.",
    },
  ],
  workflowSteps: [
    {
      id: "import",
      label: "Import criteria",
      detail: "From signed requirements — do not invent mid-demo.",
    },
    {
      id: "freeze",
      label: "Freeze weights",
      detail: "Replace SAMPLE weights; total 100%; date the freeze.",
    },
    {
      id: "score",
      label: "Score 1–5",
      detail: "Same day as each session; N/E when evidence is missing.",
    },
    {
      id: "gates",
      label: "Apply must-have gates",
      detail: "PASS / FAIL / UNKNOWN per vendor.",
    },
    {
      id: "totals",
      label: "Review totals",
      detail: "Weighted fit only for vendors that clear gates.",
    },
    {
      id: "decide",
      label: "Decide & archive",
      detail: "Then open the CRM Decision Matrix for cost and risk.",
    },
  ],
  artifactSections: [
    {
      id: "setup",
      title: "1. Setup & weight freeze",
      accent: "navy",
      intro: "Project, vendors, scorers, and dated weight freeze.",
      items: [
        {
          id: "1.1",
          label: "Vendor A–D named",
          detail: "Frozen shortlist only — two to four finalists.",
        },
        {
          id: "1.2",
          label: "Weight freeze dated",
          detail: "Before the first scored session.",
        },
      ],
    },
    {
      id: "weights",
      title: "2. Criteria & weights",
      accent: "blue",
      intro: "Categories and criteria totaling 100%.",
      items: [
        {
          id: "2.1",
          label: "SAMPLE weights replaced",
          detail: "Your committee’s priorities, not the template defaults.",
        },
        {
          id: "2.2",
          label: "Must-have flags set",
          detail: "Gates that can disqualify.",
        },
      ],
    },
    {
      id: "scoring",
      title: "3. Vendor scoring matrix",
      accent: "teal",
      intro: "1–5 × weight with confidence per cell.",
      items: [
        {
          id: "3.1",
          label: "Scores with evidence confidence",
          detail: "HIGH / MEDIUM / LOW / UNKNOWN — not silent zeros.",
        },
        {
          id: "3.2",
          label: "Weighted totals",
          detail: "Toward 100 when weights and scores exist.",
        },
      ],
    },
    {
      id: "gates",
      title: "4. Must-have gates",
      accent: "indigo",
      intro: "Binary qualification beside the weighted model.",
      items: [
        {
          id: "4.1",
          label: "PASS / FAIL / UNKNOWN per vendor",
          detail: "FAIL removes the vendor from contention.",
        },
      ],
    },
    {
      id: "decision",
      title: "5. Results & sign-off",
      accent: "green",
      intro: "Totals, residual risks, archive, Decision Matrix handoff.",
      items: [
        {
          id: "5.1",
          label: "Recommendation and residual risks",
          detail: "Then cost/risk on the Decision Matrix.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "How is this different from the Evaluation Checklist?",
      answer:
        "The checklist runs tests and records Pass / Partial / Fail / Not tested with evidence. The scorecard turns that evidence into weighted 1–5 scores and must-have gates. Checklist first, scorecard second.",
    },
    {
      question: "How is this different from the CRM Decision Matrix?",
      answer:
        "The scorecard answers how each finalist performed in evaluation. The Decision Matrix answers which option to select after adding TCO, implementation risk, sensitivity, and a formal recommendation.",
    },
    {
      question: "How is this different from the interactive Vendor Scorecard tool?",
      answer:
        "The tool is for live weighting and exploration. This downloadable pack is the durable offline workbook for committees, audits, and handoffs. Mirror the same criteria in both when useful.",
    },
    {
      question: "Why is Excel the primary download?",
      answer:
        "Weights, scores, gate counts, and weighted totals need formulas. The PDF is the printable committee summary.",
    },
    {
      question: "Can we change weights mid-evaluation?",
      answer:
        "Only with a documented change after the freeze date. Silent reweighting after a favourite demo invalidates comparability.",
    },
  ],
  journeySlugs: [
    "crm-requirements-template",
    "crm-evaluation-checklist",
    "crm-vendor-scorecard",
    "crm-comparison-worksheet",
    "crm-business-case-template",
  ],
  featuredGuideHrefs: [
    "/guides/crm-vendor-evaluation/",
    "/guides/crm-evaluation-guide/",
    "/guides/crm-demo-guide/",
    "/guides/crm-vendor-questions/",
  ],
  relatedToolHrefs: [
    {
      href: "/tools/crm-vendor-scorecard/",
      label: "Vendor Scorecard tool",
    },
    {
      href: "/tools/crm-requirements-builder/?start=1",
      label: "Requirements Builder",
    },
    { href: "/tools/crm-finder/", label: "CRM Finder" },
    { href: "/tools/crm-cost-calculator/", label: "CRM Cost Calculator" },
  ],
  downloadFiles: [
    {
      href: "/resources/crm-vendor-scorecard.xlsx",
      label: "Download Scorecard Excel",
      format: "xlsx",
    },
    {
      href: "/resources/crm-vendor-scorecard.pdf",
      label: "Download Scorecard PDF",
      format: "pdf",
    },
    {
      href: "/resources/crm-vendor-scorecard.md",
      label: "Markdown outline",
      format: "md",
    },
    {
      href: "/resources/crm-vendor-scorecard.csv",
      label: "CSV starter",
      format: "csv",
    },
  ],
  primaryCta: {
    href: "/resources/crm-vendor-scorecard.xlsx",
    label: "Download Scorecard Excel",
  },
  secondaryCta: {
    href: "/resources/crm-vendor-scorecard.pdf",
    label: "Download Scorecard PDF",
  },
  previewHref: "#preview",
  useBefore: ["crm-requirements-template", "crm-evaluation-checklist"],
  useWith: ["crm-evaluation-checklist", "crm-comparison-worksheet"],
  useNext: ["crm-comparison-worksheet", "crm-business-case-template"],
  relatedResourceSlugs: [
    "crm-evaluation-checklist",
    "crm-requirements-template",
    "crm-comparison-worksheet",
    "crm-demo-checklist",
    "crm-business-case-template",
    "crm-rfp-template",
  ],
  heroVisual: {
    src: "/resources/crm-vendor-scorecard-hero.png",
    alt: "CRM Vendor Scorecard: weighted criteria, vendor columns, must-have gates, and confidence.",
  },
  needsVisual: {
    src: "/resources/crm-vendor-scorecard-needs.png",
    alt: "Scorecard needs: weight freeze, 1–5 legend, gates, evidence confidence, totals.",
  },
  workflowVisual: {
    src: "/resources/crm-vendor-scorecard-workflow.png",
    alt: "Import criteria, freeze weights, score, apply gates, totals, decide, archive.",
  },
  lastReviewedAt: "2026-08-15",
};
