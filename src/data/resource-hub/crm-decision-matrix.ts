import type { ResourceHubProfile } from "@/domain";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

/**
 * CRM Decision Matrix — multi-vendor weighted decision model (not a checklist).
 * Stable slug: crm-comparison-worksheet
 */
export const crmDecisionMatrixDepth: Depth = {
  displayTitle: "CRM Decision Matrix",
  badgeLabel: "Decision Matrix",
  toolkitLabel: "CRM Decision Toolkit",
  tagline:
    "Compare shortlisted CRM platforms using must-have gates, weighted criteria, evidence, cost and risk — then document why one option wins.",
  heroExplanation:
    "Bring finalists onto one decision model: binary gates that can disqualify, weighted fit that ranks survivors, evidence confidence, TCO, and risk — so the recommendation survives sponsor and finance review.",
  overview:
    "A CRM Decision Matrix is a multi-vendor decision tool used after requirements discovery and initial evaluation, when a shortlist exists and the team must choose. It separates must-have gates (PASS / FAIL / UNKNOWN) from weighted preferences (1–5 × importance), then layers commercial TCO, implementation risk, and evidence confidence before a written recommendation. It is not an evaluation checklist and not a per-vendor scorecard — the Evaluation Checklist and Vendor Scorecard feed this matrix; the Business Case Template carries the winner into approval.",
  whoThisIsFor:
    "CRM project owners, RevOps, Sales Operations, sales leadership, IT, Finance, Procurement, selection committees, and founders / SME leadership closing a shortlist decision.",
  whatMattersIntro:
    "Hard gates and weighted preferences are not the same thing. A failed mandatory requirement cannot be averaged away. Unknown evidence is not failure, and unknown cost is not zero. Small score gaps mean little when confidence differs.",
  howToUse:
    "Name finalists (and status quo if replace-vs-keep is live) in Excel. Complete must-have gates first. Set weights that total 100%. Score only with evidence and confidence labels. Enter costs where known. Review risk and sensitivity. Write the recommendation last. Print the PDF as the executive decision record — Excel remains the calculation engine.",
  workedExample:
    "Example structure (hypothetical teaching scenario — not a SoftwareGlimpse case study): Four finalists plus status quo enter Setup. A mandatory data-export gate fails one vendor → DISQUALIFIED before weights apply. Remaining vendors are scored 1–5 on SAMPLE weights the team replaces with their own. Year 1 and recurring costs stay blank until quotes arrive (Unknown ≠ €0). Sensitivity notes whether a cost-heavy reweight would change the leader. The recommendation names the winner, the trade-off, and open conditions before contract — then hands off to the Business Case Template.",
  workedExampleStructured: {
    title: "Worked example (illustrative)",
    requirement:
      "Must-have gate: native data export on the quoted edition — FAIL disqualifies before weighted fit is compared.",
    vendors: [
      {
        name: "Vendor A",
        result: "PASS",
        note: "Gate passes; SAMPLE weighted fit leads until your evidence and quotes replace teaching scores.",
      },
      {
        name: "Vendor B",
        result: "FAIL",
        note: "Mandatory export missing on the quoted edition — DISQUALIFIED; a high usability score does not decide.",
      },
      {
        name: "Vendor C",
        result: "PARTIAL",
        note: "Gate UNKNOWN until written edition confirmation; TCO lines stay blank (Unknown ≠ €0).",
      },
    ],
    evidence:
      "Evaluation Checklist results plus written edition confirmation — EXAMPLE teaching only, not a SoftwareGlimpse ranking.",
    disclaimer:
      "Hypothetical Vendor A / B / C scenario for teaching the matrix — not a SoftwareGlimpse case study or product ranking.",
  },
  glance: {
    primaryGoal:
      "Choose a CRM finalist with gates, weighted fit, evidence, TCO, and a written recommendation",
    typicalTeam:
      "Selection lead, sponsor, RevOps, IT, finance / procurement",
    commonPriorities: [
      "Must-have gates",
      "Weighted criteria",
      "Evidence confidence",
      "3-year TCO",
      "Sensitivity & recommendation",
    ],
  },
  whatsInside: [
    {
      id: "gates",
      title: "Must-have gates",
      description:
        "PASS / FAIL / UNKNOWN qualification — failed mandates disqualify before scoring.",
      icon: "shield",
    },
    {
      id: "weights",
      title: "Weighted criteria",
      description:
        "SAMPLE weights to replace: pipeline, automation, usability, platform, commercial.",
      icon: "chart",
    },
    {
      id: "scoring",
      title: "Vendor scoring matrix",
      description:
        "1–5 and N/E scores with confidence; weighted fit totals toward 100.",
      icon: "list",
    },
    {
      id: "evidence",
      title: "Evidence register",
      description:
        "Hands-on, demo, docs, pricing, and references with dates and evaluators.",
      icon: "file",
    },
    {
      id: "cost-risk",
      title: "Cost, risk & sensitivity",
      description:
        "Year 1 / 3-year TCO, risks, and weight scenarios that test ranking robustness.",
      icon: "zap",
    },
    {
      id: "recommend",
      title: "Recommendation pack",
      description:
        "Ranked summary, trade-offs, open conditions, and signatures — PDF for the committee.",
      icon: "check",
    },
  ],
  evidenceRules: {
    countsAs: [
      "Hands-on trial or structured demo observation with date and evaluator",
      "Official documentation or written vendor confirmation for the quoted edition",
      "Pricing documentation used for TCO inputs marked Verified where quoted",
      "N/E or Unknown when evidence is incomplete — visible, not silent zero",
    ],
    doesNotCount: [
      "Sales slides or marketplace logos as proof of capability",
      "Invented scores, prices, or TCO figures",
      "Averaging away a failed must-have gate",
      "Treating vendor claims as HIGH confidence without validation",
    ],
  },
  challenges: [
    {
      id: "averaging-gates",
      title: "Averages hide disqualifiers",
      pain: "A strong feature score masks a failed mandatory requirement.",
      crmHelps:
        "Gates are binary and separate from weighted fit — FAIL removes the vendor from contention.",
    },
    {
      id: "fake-precision",
      title: "Score without evidence looks precise",
      pain: "87 vs 84 debates when most cells are vendor claims.",
      crmHelps:
        "Confidence labels and the evidence register keep weak proof visible.",
    },
    {
      id: "zero-cost",
      title: "Blank cost becomes €0",
      pain: "Unknown implementation cost disappears from TCO.",
      crmHelps:
        "Leave unknowns blank; never treat missing cost as zero in the narrative.",
    },
  ],
  outcomes: [
    {
      id: "compare-finalists",
      title: "Compare finalists consistently",
      description:
        "Same gates, weights, and score scale across every shortlisted CRM.",
    },
    {
      id: "gates-not-averaged",
      title: "Keep must-have failures out of averages",
      description:
        "Binary gates disqualify before weighted fit is compared.",
    },
    {
      id: "weight-what-matters",
      title: "Weight what matters to your team",
      description:
        "Replace SAMPLE weights so the ranking reflects your priorities.",
    },
    {
      id: "evidence-trail",
      title: "Track evidence behind scores",
      description:
        "Confidence labels and an evidence register keep claims auditable.",
    },
    {
      id: "cost-vs-fit",
      title: "Compare cost against fit",
      description:
        "Year 1 and 3-year TCO sit beside weighted fit — unknowns stay blank.",
    },
    {
      id: "open-questions",
      title: "Surface unresolved questions",
      description:
        "UNKNOWN gates, N/E scores, and open risks stay visible before approval.",
    },
    {
      id: "sensitivity",
      title: "Test whether the result survives reweighting",
      description:
        "Sensitivity scenarios show if the leader is robust or fragile.",
    },
    {
      id: "decision-record",
      title: "Document the final recommendation",
      description:
        "Winner, trade-offs, open conditions, and signatures for later audit.",
    },
  ],
  workflowSteps: [
    {
      id: "setup",
      label: "Name finalists",
      detail:
        "Vendor A–D plus status quo when replace-vs-keep is still open.",
    },
    {
      id: "gates",
      label: "Run must-have gates",
      detail: "PASS / FAIL / UNKNOWN — resolve unknowns before approval.",
    },
    {
      id: "weights",
      label: "Set weights to 100%",
      detail: "Replace SAMPLE weights with your committee’s priorities.",
    },
    {
      id: "score",
      label: "Score with evidence",
      detail: "1–5 or N/E plus confidence; link sources in the evidence sheet.",
    },
    {
      id: "cost-risk",
      label: "Add cost & risk",
      detail: "TCO where known; risks with likelihood, impact, mitigation.",
    },
    {
      id: "recommend",
      label: "Recommend & hand off",
      detail:
        "Write why / trade-off / open conditions — then build the Business Case.",
    },
  ],
  artifactSections: [
    {
      id: "dm-overview",
      title: "1. Decision overview & framework",
      accent: "navy",
      intro:
        "Project framing, shortlist, decision rules, and the qualify → score → cost → risk → recommend flow.",
      items: [
        {
          id: "1.1",
          label: "Finalists and status quo named",
          detail: "Setup sheet — rename Vendor A–D to real products.",
        },
        {
          id: "1.2",
          label: "Decision rules agreed",
          detail: "Failed gates, unknowns, weight changes, evidence standard.",
        },
      ],
    },
    {
      id: "dm-gates",
      title: "2. Must-have gates",
      accent: "green",
      intro: "Binary qualification — never averaged into weighted fit.",
      items: [
        {
          id: "2.1",
          label: "Mandatory requirements listed",
          detail: "Import from Requirements Builder / Evaluation Checklist.",
        },
        {
          id: "2.2",
          label: "PASS / FAIL / UNKNOWN per vendor",
          detail: "Qualification status calculated in Excel.",
        },
      ],
    },
    {
      id: "dm-weights-score",
      title: "3. Weights & scoring",
      accent: "blue",
      intro: "SAMPLE weights sum to 100% — replace before trusting totals.",
      items: [
        {
          id: "3.1",
          label: "Criteria weights total 100%",
          detail: "Workbook flags when the sum is wrong.",
        },
        {
          id: "3.2",
          label: "Scores 1–5 or N/E with confidence",
          detail: "Weighted contribution = score/5 × weight.",
        },
      ],
    },
    {
      id: "dm-commercial",
      title: "4. Cost, risk & sensitivity",
      accent: "amber",
      intro: "Commercial and robustness context beside fit.",
      items: [
        {
          id: "4.1",
          label: "Year 1 and 3-year TCO inputs",
          detail: "Leave unknown lines blank.",
        },
        {
          id: "4.2",
          label: "Sensitivity scenarios noted",
          detail: "BASE / COST-HEAVY / USABILITY-HEAVY robustness check.",
        },
      ],
    },
    {
      id: "dm-recommend",
      title: "5. Recommendation",
      accent: "indigo",
      intro: "Human judgment with an auditable trail.",
      items: [
        {
          id: "5.1",
          label: "Recommendation and trade-offs written",
          detail: "Why this vendor — and why not the runner-up.",
        },
        {
          id: "5.2",
          label: "Open conditions before contract",
          detail: "Then hand off to the CRM Business Case Template.",
        },
      ],
    },
    {
      id: "dm-vendor-questions",
      title: "6. Vendor questions before you score",
      accent: "navy",
      intro:
        "Ask the same questions of every finalist so scores stay comparable. Use answers as evidence — not as scores.",
      items: [
        {
          id: "6.1",
          label: "Quoted edition includes the must-have gates",
          detail:
            "Get written confirmation that export, SSO, and the pipeline model you require sit on the edition in the quote — not a higher SKU.",
          whyItMatters:
            "A demo on a higher edition inflates fit scores that will not match what you buy.",
          testScenario:
            "Ask: which edition is this demo, and which of these gates are extra cost or unavailable?",
          owner: "Selection lead",
          doneWhen: "Written edition confirmation is linked in the evidence register.",
        },
        {
          id: "6.2",
          label: "Seat, storage, and automation limits for your volume",
          detail:
            "Map your user count, record volume, and automation volume to published limits before scoring value.",
          whyItMatters:
            "Value-for-money scores collapse if overage or a forced upgrade appears after signature.",
          testScenario:
            "Ask: what happens when we exceed X users / Y records / Z automations on this edition?",
          owner: "RevOps / finance",
          doneWhen:
            "Limits and overage terms are noted on the cost sheet (or marked Unknown).",
        },
        {
          id: "6.3",
          label: "Implementation, admin, and exit cost",
          detail:
            "Capture implementation, admin time, and data-exit terms separately from licence list price.",
          whyItMatters: "Year-1 TCO is not the licence card. Blank cost is not €0.",
          testScenario:
            "Ask: typical implementation path, named admin roles, and how we export if we leave.",
          owner: "IT / procurement",
          doneWhen: "Year 1 / 3-year lines are filled or explicitly Unknown.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "How is this different from the Vendor Scorecard?",
      answer:
        "The Scorecard captures how well one vendor performed in evaluation. The Decision Matrix compares finalists side by side — gates, weights, cost, risk — and records the selection.",
    },
    {
      question: "Why isn’t this a Pass / Fail checklist?",
      answer:
        "Pass / Fail belongs on must-have gates and evaluation checklists. Weighted criteria use a 1–5 scale with N/E so preferences are not forced into binary results.",
    },
    {
      question: "Why is Excel the primary download?",
      answer:
        "The matrix is interactive: weights, scores, TCO, and sensitivity need formulas. The PDF is the printable executive decision record.",
    },
    {
      question: "Can we use the SAMPLE weights as-is?",
      answer:
        "Only as a starting template. Replace them with your committee’s priorities so the total stays 100% and the ranking reflects your organisation.",
    },
  ],
  journeySlugs: [
    "crm-requirements-template",
    "crm-evaluation-checklist",
    "crm-vendor-scorecard",
    "crm-comparison-worksheet",
    "crm-business-case-template",
  ],
  relatedToolHrefs: [
    {
      href: "/tools/crm-requirements-builder/?start=1",
      label: "CRM Requirements Builder",
    },
    { href: "/tools/crm-finder/", label: "CRM Finder" },
    { href: "/tools/crm-vendor-scorecard/", label: "CRM Vendor Scorecard" },
    { href: "/tools/crm-cost-calculator/", label: "CRM Cost Calculator" },
    { href: "/tools/crm-tco-calculator/", label: "CRM TCO Calculator" },
  ],
  finderHref: "/tools/crm-finder/",
  calculatorHref: "/tools/crm-tco-calculator/",
  compareHref: "/compare/",
  downloadFiles: [
    {
      href: "/resources/crm-comparison-worksheet.xlsx",
      label: "Download Decision Matrix Excel",
      format: "xlsx",
    },
    {
      href: "/resources/crm-comparison-worksheet.pdf",
      label: "Download Decision Summary PDF",
      format: "pdf",
    },
    {
      href: "/resources/crm-comparison-worksheet.md",
      label: "Markdown outline",
      format: "md",
    },
  ],
  primaryCta: {
    href: "/resources/crm-comparison-worksheet.xlsx",
    label: "Download Decision Matrix Excel",
  },
  secondaryCta: {
    href: "/resources/crm-comparison-worksheet.pdf",
    label: "Download Decision Summary PDF",
  },
  previewHref: "#preview",
  useBefore: ["crm-evaluation-checklist", "crm-vendor-scorecard"],
  useWith: ["crm-vendor-scorecard", "crm-requirements-template"],
  useNext: ["crm-business-case-template"],
  relatedResourceSlugs: [
    "crm-evaluation-checklist",
    "crm-vendor-scorecard",
    "crm-requirements-template",
    "crm-business-case-template",
  ],
  featuredGuideHrefs: [
    "/guides/how-to-choose-crm/",
    "/guides/crm-evaluation-guide/",
    "/guides/crm-selection-process/",
  ],
  heroVisual: {
    src: "/resources/crm-comparison-worksheet-hero.png",
    alt: "CRM Decision Matrix flow: requirements to must-have gates to weighted evaluation to cost and risk to recommendation.",
  },
  needsVisual: {
    src: "/resources/crm-comparison-worksheet-needs.png",
    alt: "Diagram of decision needs: gates, weights, evidence, TCO, and recommendation.",
  },
  workflowVisual: {
    src: "/resources/crm-comparison-worksheet-workflow.png",
    alt: "Qualify, score, compare cost, assess risk, recommend — CRM decision workflow.",
  },
  lastReviewedAt: "2026-08-18",
};
