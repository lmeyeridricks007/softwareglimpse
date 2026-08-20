/**
 * CRM Readiness Assessment catalog — dimensions, questions, weights.
 * Structured configuration (not hard-coded UI). Version: crm-readiness-v1.
 */

export type QuestionType =
  | "single"
  | "multi"
  | "yes-partly-no"
  | "maturity"
  | "confidence";

export type OrgComplexity = "small" | "mid" | "enterprise" | "all";

export type AnswerOption = {
  id: string;
  label: string;
  /** 0–100 points for this answer. */
  points: number;
  /** Marks answer as uncertainty (discovery gap), not confirmed weakness. */
  uncertain?: boolean;
};

export type QuestionCondition = {
  questionId: string;
  /** Answer must include / equal one of these (string or array membership). */
  equalsAny: string[];
};

export type ReadinessQuestionDef = {
  id: string;
  dimensionId: string;
  type: QuestionType;
  prompt: string;
  helpText?: string;
  options: AnswerOption[];
  /** Weight toward selection readiness (0–1+). */
  selectionWeight: number;
  /** Weight toward implementation readiness (0–1+). */
  implementationWeight: number;
  /** Show only when all conditions match (AND). */
  conditions?: QuestionCondition[];
  /** Hide for orgs below this complexity when set. */
  minComplexity?: OrgComplexity;
  /** Risk severity if low-scoring answer selected. */
  riskSeverity?: "critical" | "high" | "medium" | "low";
  /** Option ids that trigger a critical blocker finding. */
  criticalWhen?: string[];
};

export type ReadinessDimensionDef = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  /** Relative weight in the selection aggregate. */
  selectionWeight: number;
  /** Relative weight in the implementation aggregate. */
  implementationWeight: number;
  estimatedMinutes: number;
};

/** Dimension weights documented in docs/tools/crm-readiness-assessment.md */
export const READINESS_DIMENSIONS: ReadinessDimensionDef[] = [
  {
    id: "business-case",
    slug: "business-case",
    title: "Business case & objectives",
    shortTitle: "Business case",
    description:
      "Whether the organization understands why it is undertaking the CRM project.",
    selectionWeight: 1.2,
    implementationWeight: 0.7,
    estimatedMinutes: 1,
  },
  {
    id: "sales-process",
    slug: "sales-process",
    title: "Sales process",
    shortTitle: "Sales process",
    description:
      "Whether processes the CRM must support are understood and documented.",
    selectionWeight: 1.0,
    implementationWeight: 1.1,
    estimatedMinutes: 1,
  },
  {
    id: "requirements",
    slug: "requirements",
    title: "Requirements",
    shortTitle: "Requirements",
    description:
      "Whether business, workflow, reporting and integration needs are gathered.",
    selectionWeight: 1.4,
    implementationWeight: 0.9,
    estimatedMinutes: 1,
  },
  {
    id: "stakeholders",
    slug: "stakeholders",
    title: "Stakeholders & ownership",
    shortTitle: "Stakeholders",
    description: "Whether the project has real ownership and decision authority.",
    selectionWeight: 1.3,
    implementationWeight: 1.2,
    estimatedMinutes: 1,
  },
  {
    id: "data-readiness",
    slug: "data-readiness",
    title: "Data readiness",
    shortTitle: "Data",
    description:
      "Where customer data lives, quality, ownership and migration readiness.",
    selectionWeight: 0.8,
    implementationWeight: 1.5,
    estimatedMinutes: 1.5,
  },
  {
    id: "integrations",
    slug: "integrations",
    title: "Integration readiness",
    shortTitle: "Integrations",
    description:
      "Which systems must interact with CRM and how well scope is understood.",
    selectionWeight: 1.0,
    implementationWeight: 1.2,
    estimatedMinutes: 1,
  },
  {
    id: "technical",
    slug: "technical",
    title: "Technical readiness",
    shortTitle: "Technical",
    description:
      "Identity, environments, API needs and operational support expectations.",
    selectionWeight: 0.7,
    implementationWeight: 1.0,
    estimatedMinutes: 0.75,
  },
  {
    id: "security",
    slug: "security",
    title: "Security & compliance",
    shortTitle: "Security",
    description:
      "Whether privacy, access and compliance requirements are known — not legal advice.",
    selectionWeight: 0.9,
    implementationWeight: 1.0,
    estimatedMinutes: 0.75,
  },
  {
    id: "budget",
    slug: "budget",
    title: "Budget & commercial readiness",
    shortTitle: "Budget",
    description:
      "Whether software, implementation, migration and training budgets are planned.",
    selectionWeight: 1.1,
    implementationWeight: 1.0,
    estimatedMinutes: 0.75,
  },
  {
    id: "implementation-capacity",
    slug: "implementation-capacity",
    title: "Implementation capacity",
    shortTitle: "Implementation",
    description:
      "Whether people and time exist to implement — not just budget for software.",
    selectionWeight: 0.6,
    implementationWeight: 1.5,
    estimatedMinutes: 1,
  },
  {
    id: "change-management",
    slug: "change-management",
    title: "Change management",
    shortTitle: "Change mgmt",
    description:
      "How significant the change is and whether managers and champions are aligned.",
    selectionWeight: 0.5,
    implementationWeight: 1.4,
    estimatedMinutes: 0.75,
  },
  {
    id: "user-adoption",
    slug: "user-adoption",
    title: "User adoption",
    shortTitle: "Adoption",
    description: "Readiness for sustained usage after launch.",
    selectionWeight: 0.5,
    implementationWeight: 1.4,
    estimatedMinutes: 0.75,
  },
  {
    id: "reporting",
    slug: "reporting",
    title: "Reporting & measurement",
    shortTitle: "Reporting",
    description: "Whether KPIs, forecasts and success metrics are defined.",
    selectionWeight: 0.9,
    implementationWeight: 0.8,
    estimatedMinutes: 0.5,
  },
  {
    id: "governance",
    slug: "governance",
    title: "Governance & administration",
    shortTitle: "Governance",
    description: "Post-launch ownership of config, data quality and vendor relationship.",
    selectionWeight: 0.4,
    implementationWeight: 1.1,
    estimatedMinutes: 0.5,
  },
];

const YPN = [
  { id: "yes", label: "Yes", points: 100 },
  { id: "partly", label: "Partly", points: 55 },
  { id: "no", label: "No", points: 15 },
  { id: "not-sure", label: "Not sure", points: 40, uncertain: true },
] as const;

export const READINESS_QUESTIONS: ReadinessQuestionDef[] = [
  // ── 1. Business case ──────────────────────────────────────────────
  {
    id: "bc-drivers",
    dimensionId: "business-case",
    type: "multi",
    prompt: "What is driving this CRM initiative?",
    helpText: "Select all that apply. Multiple drivers are common.",
    selectionWeight: 0.8,
    implementationWeight: 0.5,
    options: [
      { id: "replace-crm", label: "Replace an existing CRM", points: 80 },
      {
        id: "replace-spreadsheets",
        label: "Replace spreadsheets / manual processes",
        points: 85,
      },
      { id: "visibility", label: "Improve sales visibility", points: 90 },
      { id: "forecasting", label: "Improve forecasting", points: 90 },
      { id: "productivity", label: "Improve sales productivity", points: 90 },
      { id: "growth", label: "Support growth", points: 85 },
      {
        id: "consolidate",
        label: "Consolidate multiple systems",
        points: 75,
      },
      { id: "customer-data", label: "Improve customer data", points: 85 },
      { id: "automate", label: "Automate sales processes", points: 80 },
      { id: "other", label: "Other", points: 70 },
      { id: "unclear", label: "Not clearly defined yet", points: 10 },
    ],
    criticalWhen: ["unclear"],
  },
  {
    id: "bc-problem-clarity",
    dimensionId: "business-case",
    type: "maturity",
    prompt: "How clearly is the business problem documented?",
    helpText:
      "CRM projects stall when the problem is only informal tribal knowledge.",
    selectionWeight: 1.2,
    implementationWeight: 0.8,
    riskSeverity: "critical",
    criticalWhen: ["not-defined"],
    options: [
      { id: "not-defined", label: "Not defined", points: 0 },
      { id: "informal", label: "Informally understood", points: 35 },
      { id: "documented", label: "Documented", points: 65 },
      { id: "agreed", label: "Documented and agreed", points: 85 },
      {
        id: "measured",
        label: "Documented, agreed and measured",
        points: 100,
      },
    ],
  },
  {
    id: "bc-objectives",
    dimensionId: "business-case",
    type: "yes-partly-no",
    prompt: "Are measurable objectives defined for the CRM project?",
    selectionWeight: 1.0,
    implementationWeight: 0.7,
    options: [...YPN],
  },
  {
    id: "bc-sponsor",
    dimensionId: "business-case",
    type: "yes-partly-no",
    prompt: "Is there executive sponsorship for this initiative?",
    selectionWeight: 1.1,
    implementationWeight: 1.0,
    riskSeverity: "critical",
    criticalWhen: ["no"],
    options: [...YPN],
  },
  {
    id: "bc-crm-appropriate",
    dimensionId: "business-case",
    type: "yes-partly-no",
    prompt: "Has the team confirmed CRM is the right solution (vs. process-only change)?",
    helpText:
      "Sometimes the gap is process discipline, not software. Flagging uncertainty is useful.",
    selectionWeight: 0.9,
    implementationWeight: 0.4,
    options: [...YPN],
  },

  // ── 2. Sales process ──────────────────────────────────────────────
  {
    id: "sp-maturity",
    dimensionId: "sales-process",
    type: "maturity",
    prompt: "How standardized is your opportunity / pipeline process?",
    helpText:
      "CRM configuration is much easier when the sales process is defined before software selection.",
    selectionWeight: 1.0,
    implementationWeight: 1.2,
    options: [
      {
        id: "level-1",
        label: "Every salesperson works differently",
        points: 15,
      },
      {
        id: "level-2",
        label: "We have a broadly shared process (undocumented)",
        points: 40,
      },
      {
        id: "level-3",
        label: "Pipeline stages are documented",
        points: 65,
      },
      {
        id: "level-4",
        label: "Stages, ownership and entry/exit rules are documented",
        points: 85,
      },
      {
        id: "level-5",
        label: "Process is documented, measured and governed",
        points: 100,
      },
    ],
  },
  {
    id: "sp-qualification",
    dimensionId: "sales-process",
    type: "yes-partly-no",
    prompt: "Are lead qualification rules defined?",
    selectionWeight: 0.8,
    implementationWeight: 0.9,
    options: [...YPN],
  },
  {
    id: "sp-handoffs",
    dimensionId: "sales-process",
    type: "yes-partly-no",
    prompt: "Are handoffs between teams (marketing, sales, CS) understood?",
    selectionWeight: 0.7,
    implementationWeight: 1.0,
    options: [...YPN],
  },
  {
    id: "sp-motions",
    dimensionId: "sales-process",
    type: "yes-partly-no",
    prompt: "Have different sales motions (e.g. inbound vs outbound) been identified?",
    selectionWeight: 0.6,
    implementationWeight: 0.7,
    minComplexity: "mid",
    options: [...YPN],
  },

  // ── 3. Requirements ───────────────────────────────────────────────
  {
    id: "rq-gathered",
    dimensionId: "requirements",
    type: "maturity",
    prompt: "Have business requirements been gathered?",
    helpText:
      "If readiness here is low, build requirements before evaluating vendors.",
    selectionWeight: 1.4,
    implementationWeight: 0.9,
    riskSeverity: "high",
    criticalWhen: ["none"],
    options: [
      { id: "none", label: "Not started", points: 5 },
      { id: "informal", label: "Informal wish list only", points: 30 },
      {
        id: "draft",
        label: "Draft requirements exist",
        points: 55,
      },
      {
        id: "prioritized",
        label: "Prioritized (must-have vs preference)",
        points: 80,
      },
      {
        id: "linked",
        label: "Prioritized and linked to business outcomes",
        points: 100,
      },
    ],
  },
  {
    id: "rq-personas",
    dimensionId: "requirements",
    type: "yes-partly-no",
    prompt: "Are user groups / personas identified?",
    selectionWeight: 0.9,
    implementationWeight: 1.0,
    options: [...YPN],
  },
  {
    id: "rq-reporting",
    dimensionId: "requirements",
    type: "yes-partly-no",
    prompt: "Are reporting requirements known?",
    selectionWeight: 1.0,
    implementationWeight: 0.7,
    options: [...YPN],
  },
  {
    id: "rq-integrations-doc",
    dimensionId: "requirements",
    type: "yes-partly-no",
    prompt: "Are integration requirements documented?",
    selectionWeight: 1.1,
    implementationWeight: 1.0,
    options: [...YPN],
  },

  // ── 4. Stakeholders ───────────────────────────────────────────────
  {
    id: "st-project-owner",
    dimensionId: "stakeholders",
    type: "yes-partly-no",
    prompt: "Is there a named project owner?",
    selectionWeight: 1.3,
    implementationWeight: 1.3,
    riskSeverity: "critical",
    criticalWhen: ["no"],
    options: [...YPN],
  },
  {
    id: "st-decision-authority",
    dimensionId: "stakeholders",
    type: "yes-partly-no",
    prompt: "Does someone have clear decision authority for vendor selection?",
    selectionWeight: 1.4,
    implementationWeight: 0.8,
    riskSeverity: "critical",
    criticalWhen: ["no"],
    options: [...YPN],
  },
  {
    id: "st-post-owner",
    dimensionId: "stakeholders",
    type: "yes-partly-no",
    prompt: "Who will own the CRM after implementation is agreed?",
    helpText: "If everyone is involved but nobody owns it, that is high risk.",
    selectionWeight: 0.7,
    implementationWeight: 1.4,
    riskSeverity: "critical",
    criticalWhen: ["no"],
    options: [...YPN],
  },
  {
    id: "st-represented",
    dimensionId: "stakeholders",
    type: "multi",
    prompt: "Which groups are represented in the project?",
    selectionWeight: 0.8,
    implementationWeight: 0.9,
    options: [
      { id: "sales", label: "Sales users", points: 90 },
      { id: "sales-ops", label: "Sales operations", points: 95 },
      { id: "it", label: "IT", points: 85 },
      { id: "marketing", label: "Marketing", points: 80 },
      { id: "cs", label: "Customer service / success", points: 80 },
      { id: "security", label: "Security / privacy", points: 85 },
      { id: "procurement", label: "Procurement", points: 75 },
      { id: "finance", label: "Finance", points: 70 },
      { id: "none", label: "None formally yet", points: 10 },
    ],
  },

  // ── 5. Data readiness ─────────────────────────────────────────────
  {
    id: "dt-sources",
    dimensionId: "data-readiness",
    type: "multi",
    prompt: "Where does customer data currently exist?",
    helpText: "Select all sources. Multiple systems without an owner is a common risk.",
    selectionWeight: 0.7,
    implementationWeight: 1.2,
    options: [
      { id: "current-crm", label: "Current CRM", points: 85 },
      { id: "spreadsheets", label: "Spreadsheets", points: 50 },
      { id: "erp", label: "ERP", points: 70 },
      { id: "marketing", label: "Marketing platform", points: 65 },
      { id: "email", label: "Email / inbox", points: 40 },
      { id: "support", label: "Customer support system", points: 70 },
      { id: "warehouse", label: "Data warehouse", points: 75 },
      { id: "files", label: "Individual files", points: 25 },
      { id: "other", label: "Other", points: 50 },
      { id: "not-sure", label: "Not sure", points: 30, uncertain: true },
    ],
  },
  {
    id: "dt-quality",
    dimensionId: "data-readiness",
    type: "maturity",
    prompt: "How would you describe current customer data quality?",
    selectionWeight: 0.6,
    implementationWeight: 1.3,
    riskSeverity: "high",
    options: [
      {
        id: "poor",
        label: "Known duplicates, missing fields, unclear ownership",
        points: 15,
      },
      {
        id: "uneven",
        label: "Uneven — some clean areas, some messy",
        points: 45,
      },
      {
        id: "adequate",
        label: "Adequate for day-to-day work",
        points: 70,
      },
      {
        id: "good",
        label: "Generally clean with known exceptions",
        points: 85,
      },
      {
        id: "governed",
        label: "Governed with clear definitions and owners",
        points: 100,
      },
      {
        id: "not-sure",
        label: "Not sure — we have not audited quality",
        points: 35,
        uncertain: true,
      },
    ],
  },
  {
    id: "dt-authoritative",
    dimensionId: "data-readiness",
    type: "yes-partly-no",
    prompt: "Is there an agreed authoritative source for customer records?",
    selectionWeight: 0.7,
    implementationWeight: 1.4,
    riskSeverity: "high",
    options: [...YPN],
  },
  {
    id: "dt-migration-scope",
    dimensionId: "data-readiness",
    type: "yes-partly-no",
    prompt: "Is data migration scope understood (what to move vs archive)?",
    selectionWeight: 0.5,
    implementationWeight: 1.3,
    options: [...YPN],
  },
  {
    id: "dt-export",
    dimensionId: "data-readiness",
    type: "yes-partly-no",
    prompt: "Can you export core customer records from current systems?",
    selectionWeight: 0.4,
    implementationWeight: 1.1,
    conditions: [{ questionId: "bc-drivers", equalsAny: ["replace-crm"] }],
    options: [...YPN],
  },
  {
    id: "dt-data-owner",
    dimensionId: "data-readiness",
    type: "yes-partly-no",
    prompt: "Is a data owner / migration owner assigned?",
    selectionWeight: 0.5,
    implementationWeight: 1.4,
    riskSeverity: "critical",
    criticalWhen: ["no"],
    options: [...YPN],
  },

  // ── 6. Integrations ───────────────────────────────────────────────
  {
    id: "ig-needed",
    dimensionId: "integrations",
    type: "single",
    prompt: "Will the CRM need to integrate with other systems?",
    selectionWeight: 1.0,
    implementationWeight: 1.0,
    options: [
      { id: "yes", label: "Yes", points: 70 },
      { id: "no", label: "No / unlikely", points: 90 },
      { id: "not-sure", label: "Not sure", points: 40, uncertain: true },
    ],
  },
  {
    id: "ig-systems",
    dimensionId: "integrations",
    type: "multi",
    prompt: "Which systems should interact with the CRM?",
    conditions: [{ questionId: "ig-needed", equalsAny: ["yes"] }],
    selectionWeight: 0.9,
    implementationWeight: 1.1,
    options: [
      { id: "email", label: "Email", points: 85 },
      { id: "calendar", label: "Calendar", points: 85 },
      { id: "marketing", label: "Marketing automation", points: 70 },
      { id: "erp", label: "ERP", points: 55 },
      { id: "support", label: "Customer support", points: 70 },
      { id: "ecommerce", label: "E-commerce", points: 60 },
      { id: "website", label: "Website / forms", points: 75 },
      { id: "telephony", label: "Telephony", points: 65 },
      { id: "bi", label: "BI / data warehouse", points: 60 },
      { id: "idp", label: "Identity provider (SSO)", points: 80 },
      { id: "billing", label: "Billing", points: 55 },
      { id: "cpq", label: "CPQ", points: 50 },
      { id: "other", label: "Other", points: 50 },
    ],
  },
  {
    id: "ig-scope-clarity",
    dimensionId: "integrations",
    type: "yes-partly-no",
    prompt: "For required integrations, is data direction and system ownership known?",
    helpText: '"Not sure" is valid — it usually means discovery work is required.',
    conditions: [{ questionId: "ig-needed", equalsAny: ["yes"] }],
    selectionWeight: 1.0,
    implementationWeight: 1.2,
    riskSeverity: "high",
    options: [...YPN],
  },
  {
    id: "ig-realtime",
    dimensionId: "integrations",
    type: "yes-partly-no",
    prompt: "Do you know which integrations need near real-time sync vs batch?",
    conditions: [{ questionId: "ig-needed", equalsAny: ["yes"] }],
    selectionWeight: 0.7,
    implementationWeight: 0.9,
    minComplexity: "mid",
    options: [...YPN],
  },

  // ── 7. Technical ──────────────────────────────────────────────────
  {
    id: "tc-sso",
    dimensionId: "technical",
    type: "yes-partly-no",
    prompt: "Are identity / SSO requirements known?",
    selectionWeight: 0.8,
    implementationWeight: 0.9,
    options: [...YPN],
  },
  {
    id: "tc-environments",
    dimensionId: "technical",
    type: "yes-partly-no",
    prompt: "Do you need a sandbox / non-production environment?",
    selectionWeight: 0.5,
    implementationWeight: 0.8,
    minComplexity: "mid",
    options: [...YPN],
  },
  {
    id: "tc-constraints",
    dimensionId: "technical",
    type: "yes-partly-no",
    prompt: "Are existing technical constraints (data residency, custom code expectations) documented?",
    selectionWeight: 0.7,
    implementationWeight: 0.9,
    options: [...YPN],
  },
  {
    id: "tc-support",
    dimensionId: "technical",
    type: "yes-partly-no",
    prompt: "Is operational / admin support capacity available after go-live?",
    selectionWeight: 0.4,
    implementationWeight: 1.1,
    options: [...YPN],
  },

  // ── 8. Security ───────────────────────────────────────────────────
  {
    id: "sc-relevant",
    dimensionId: "security",
    type: "multi",
    prompt: "Which security / compliance topics are relevant?",
    helpText:
      "This identifies discovery gaps — SoftwareGlimpse does not provide legal advice.",
    selectionWeight: 0.9,
    implementationWeight: 0.9,
    options: [
      { id: "gdpr", label: "GDPR / privacy", points: 70 },
      { id: "residency", label: "Data residency", points: 70 },
      { id: "sso", label: "SSO", points: 80 },
      { id: "mfa", label: "MFA", points: 85 },
      { id: "rbac", label: "Role-based access", points: 85 },
      { id: "audit", label: "Audit logging", points: 75 },
      { id: "retention", label: "Retention / deletion", points: 70 },
      { id: "dpa", label: "DPA / subprocessors", points: 65 },
      { id: "industry", label: "Industry-specific obligations", points: 60 },
      { id: "none-known", label: "None identified yet", points: 25 },
      { id: "not-sure", label: "Not sure", points: 35, uncertain: true },
    ],
  },
  {
    id: "sc-owner",
    dimensionId: "security",
    type: "yes-partly-no",
    prompt: "Is a privacy / security owner identified to approve requirements?",
    selectionWeight: 1.0,
    implementationWeight: 0.9,
    riskSeverity: "high",
    criticalWhen: ["no"],
    conditions: [
      {
        questionId: "sc-relevant",
        equalsAny: [
          "gdpr",
          "residency",
          "dpa",
          "industry",
          "audit",
          "retention",
        ],
      },
    ],
    options: [...YPN],
  },
  {
    id: "sc-vendor-risk",
    dimensionId: "security",
    type: "yes-partly-no",
    prompt: "Will vendor security / risk assessment be required before contract?",
    selectionWeight: 0.8,
    implementationWeight: 0.6,
    minComplexity: "mid",
    options: [...YPN],
  },

  // ── 9. Budget ─────────────────────────────────────────────────────
  {
    id: "bd-software",
    dimensionId: "budget",
    type: "yes-partly-no",
    prompt: "Is software (subscription) budget estimated or approved?",
    selectionWeight: 1.2,
    implementationWeight: 0.8,
    options: [...YPN],
  },
  {
    id: "bd-implementation",
    dimensionId: "budget",
    type: "yes-partly-no",
    prompt: "Does the budget include implementation / services?",
    selectionWeight: 0.9,
    implementationWeight: 1.2,
    riskSeverity: "high",
    options: [...YPN],
  },
  {
    id: "bd-migration-training",
    dimensionId: "budget",
    type: "multi",
    prompt: "Which cost areas are included in planning?",
    selectionWeight: 0.8,
    implementationWeight: 1.0,
    options: [
      { id: "migration", label: "Data migration", points: 90 },
      { id: "integrations", label: "Integrations", points: 85 },
      { id: "training", label: "Training", points: 90 },
      { id: "support", label: "Premium support", points: 75 },
      { id: "modules", label: "Additional modules", points: 70 },
      { id: "ai", label: "AI usage / add-ons", points: 65 },
      { id: "none", label: "Software seats only so far", points: 20 },
      { id: "not-sure", label: "Not sure", points: 35, uncertain: true },
    ],
  },
  {
    id: "bd-users",
    dimensionId: "budget",
    type: "yes-partly-no",
    prompt: "Is expected user count (and growth) known?",
    selectionWeight: 1.0,
    implementationWeight: 0.7,
    options: [...YPN],
  },
  {
    id: "bd-procurement",
    dimensionId: "budget",
    type: "yes-partly-no",
    prompt: "Is contract / procurement ownership known?",
    selectionWeight: 0.9,
    implementationWeight: 0.5,
    riskSeverity: "medium",
    options: [...YPN],
  },

  // ── 10. Implementation capacity ───────────────────────────────────
  {
    id: "ic-pm",
    dimensionId: "implementation-capacity",
    type: "yes-partly-no",
    prompt: "Is there a project manager (or equivalent) for implementation?",
    selectionWeight: 0.5,
    implementationWeight: 1.3,
    riskSeverity: "high",
    options: [...YPN],
  },
  {
    id: "ic-impl-owner",
    dimensionId: "implementation-capacity",
    type: "yes-partly-no",
    prompt: "Is an implementation / configuration owner assigned?",
    selectionWeight: 0.5,
    implementationWeight: 1.5,
    riskSeverity: "critical",
    criticalWhen: ["no"],
    options: [...YPN],
  },
  {
    id: "ic-sme-time",
    dimensionId: "implementation-capacity",
    type: "yes-partly-no",
    prompt: "Can sales / SME users participate in workshops and testing?",
    selectionWeight: 0.4,
    implementationWeight: 1.2,
    options: [...YPN],
  },
  {
    id: "ic-timeline",
    dimensionId: "implementation-capacity",
    type: "maturity",
    prompt: "How realistic is the target go-live timeline?",
    selectionWeight: 0.6,
    implementationWeight: 1.2,
    riskSeverity: "critical",
    criticalWhen: ["unrealistic"],
    options: [
      {
        id: "unrealistic",
        label: "Aggressive / likely unrealistic",
        points: 10,
      },
      {
        id: "tight",
        label: "Tight but possible with focus",
        points: 50,
      },
      {
        id: "reasonable",
        label: "Reasonable given scope",
        points: 80,
      },
      {
        id: "flexible",
        label: "Flexible — quality over date",
        points: 95,
      },
      {
        id: "not-set",
        label: "No target date yet",
        points: 60,
      },
      {
        id: "not-sure",
        label: "Not sure",
        points: 40,
        uncertain: true,
      },
    ],
  },
  {
    id: "ic-approach",
    dimensionId: "implementation-capacity",
    type: "single",
    prompt: "Will implementation be internal, partner-led, or hybrid?",
    selectionWeight: 0.4,
    implementationWeight: 0.8,
    options: [
      { id: "internal", label: "Internal", points: 75 },
      { id: "partner", label: "Partner-led", points: 80 },
      { id: "hybrid", label: "Hybrid", points: 85 },
      { id: "not-sure", label: "Not sure", points: 40, uncertain: true },
    ],
  },

  // ── 11. Change management ─────────────────────────────────────────
  {
    id: "cm-change-size",
    dimensionId: "change-management",
    type: "maturity",
    prompt: "How significant is the process / tool change for users?",
    selectionWeight: 0.4,
    implementationWeight: 1.0,
    options: [
      { id: "minor", label: "Minor — similar to today", points: 90 },
      { id: "moderate", label: "Moderate — new habits required", points: 70 },
      {
        id: "major",
        label: "Major — new process and system of record",
        points: 45,
      },
      { id: "not-sure", label: "Not sure", points: 40, uncertain: true },
    ],
  },
  {
    id: "cm-managers",
    dimensionId: "change-management",
    type: "yes-partly-no",
    prompt: "Are managers aligned on using CRM as the system of record?",
    selectionWeight: 0.5,
    implementationWeight: 1.3,
    riskSeverity: "high",
    options: [...YPN],
  },
  {
    id: "cm-retire",
    dimensionId: "change-management",
    type: "yes-partly-no",
    prompt: "Is there a plan to retire old spreadsheets / parallel systems?",
    helpText:
      "High adoption risk if users can keep the spreadsheet after CRM launch.",
    selectionWeight: 0.3,
    implementationWeight: 1.4,
    riskSeverity: "high",
    options: [...YPN],
  },
  {
    id: "cm-champions",
    dimensionId: "change-management",
    type: "yes-partly-no",
    prompt: "Have champions / early adopters been identified?",
    selectionWeight: 0.4,
    implementationWeight: 1.0,
    options: [...YPN],
  },

  // ── 12. User adoption ─────────────────────────────────────────────
  {
    id: "ua-training",
    dimensionId: "user-adoption",
    type: "yes-partly-no",
    prompt: "Is role-specific training planned?",
    selectionWeight: 0.4,
    implementationWeight: 1.2,
    options: [...YPN],
  },
  {
    id: "ua-measured",
    dimensionId: "user-adoption",
    type: "yes-partly-no",
    prompt: "Will CRM usage / adoption be measured after launch?",
    selectionWeight: 0.4,
    implementationWeight: 1.1,
    options: [...YPN],
  },
  {
    id: "ua-support",
    dimensionId: "user-adoption",
    type: "yes-partly-no",
    prompt: "Who will support users after go-live is agreed?",
    selectionWeight: 0.3,
    implementationWeight: 1.3,
    riskSeverity: "medium",
    options: [...YPN],
  },
  {
    id: "ua-managers-data",
    dimensionId: "user-adoption",
    type: "yes-partly-no",
    prompt: "Will managers be expected to run the business from CRM data?",
    selectionWeight: 0.5,
    implementationWeight: 1.2,
    options: [...YPN],
  },

  // ── 13. Reporting ─────────────────────────────────────────────────
  {
    id: "rp-kpis",
    dimensionId: "reporting",
    type: "yes-partly-no",
    prompt: "Are required KPIs / success metrics known?",
    selectionWeight: 1.0,
    implementationWeight: 0.8,
    options: [...YPN],
  },
  {
    id: "rp-forecast",
    dimensionId: "reporting",
    type: "yes-partly-no",
    prompt: "Is forecast methodology understood and consistent?",
    selectionWeight: 0.8,
    implementationWeight: 0.7,
    options: [...YPN],
  },
  {
    id: "rp-audiences",
    dimensionId: "reporting",
    type: "yes-partly-no",
    prompt: "Are dashboard audiences (reps, managers, execs) identified?",
    selectionWeight: 0.7,
    implementationWeight: 0.7,
    options: [...YPN],
  },

  // ── 14. Governance ────────────────────────────────────────────────
  {
    id: "gv-config-owner",
    dimensionId: "governance",
    type: "yes-partly-no",
    prompt: "Who will own configuration changes after go-live?",
    selectionWeight: 0.3,
    implementationWeight: 1.2,
    riskSeverity: "medium",
    minComplexity: "mid",
    options: [...YPN],
  },
  {
    id: "gv-change-control",
    dimensionId: "governance",
    type: "yes-partly-no",
    prompt: "Is there a simple rule for who can add fields / workflows?",
    helpText:
      "Without governance, CRMs accumulate duplicate fields and broken reports.",
    selectionWeight: 0.3,
    implementationWeight: 1.1,
    minComplexity: "mid",
    options: [...YPN],
  },
  {
    id: "gv-admin",
    dimensionId: "governance",
    type: "yes-partly-no",
    prompt: "Is day-to-day CRM administration ownership assigned?",
    selectionWeight: 0.4,
    implementationWeight: 1.3,
    options: [...YPN],
  },
  {
    id: "gv-vendor",
    dimensionId: "governance",
    type: "yes-partly-no",
    prompt: "Who will own the vendor relationship and renewals?",
    selectionWeight: 0.5,
    implementationWeight: 0.7,
    options: [...YPN],
  },
];

export function getDimensionById(
  id: string,
): ReadinessDimensionDef | undefined {
  return READINESS_DIMENSIONS.find((d) => d.id === id);
}

export function getQuestionsForDimension(
  dimensionId: string,
): ReadinessQuestionDef[] {
  return READINESS_QUESTIONS.filter((q) => q.dimensionId === dimensionId);
}

export function getQuestionById(
  id: string,
): ReadinessQuestionDef | undefined {
  return READINESS_QUESTIONS.find((q) => q.id === id);
}
