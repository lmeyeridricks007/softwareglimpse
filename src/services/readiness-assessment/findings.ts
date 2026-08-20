import type {
  CrmReadinessSession,
  ReadinessActionEffort,
  ReadinessActionPhase,
  ReadinessFindingSeverity,
  ReadinessFindingType,
} from "@/domain";
import { READINESS_DIMENSIONS, getQuestionById } from "./catalog";
import {
  CRM_READINESS_CATALOG,
  type ReadinessCatalogPack,
} from "./catalog-pack";
import {
  assessCrmReadiness,
  isCriticalAnswer,
  type AssessCrmReadinessResult,
  type DimensionScoreResult,
} from "./score";

export type ReadinessFinding = {
  id: string;
  type: ReadinessFindingType;
  severity: ReadinessFindingSeverity;
  dimensionId: string;
  title: string;
  explanation: string;
  recommendation: string;
  phase: ReadinessActionPhase;
  questionId?: string;
};

export type ReadinessAction = {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  phase: ReadinessActionPhase;
  effort: ReadinessActionEffort;
  title: string;
  reason: string;
  ownerHint: string;
  relatedTool?: ReadinessToolId;
  dimensionId?: string;
};

export type ReadinessToolId =
  | "requirements-builder"
  | "crm-finder"
  | "cost-calculator"
  | "roi-calculator"
  | "rfp-builder"
  | "demo-checklist"
  | "vendor-scorecard"
  | "decision-matrix"
  | "implementation-planner"
  | "migration-planner"
  | "best-crm"
  | "tco-calculator";

export type ToolRecommendation = {
  toolId: ReadinessToolId;
  title: string;
  href: string;
  reason: string;
  priority: number;
  locked?: boolean;
  lockReason?: string;
};

export type ReadinessRiskRow = {
  id: string;
  risk: string;
  severity: ReadinessFindingSeverity;
  phase: string;
  why: string;
  impact: string;
  mitigation: string;
  when: string;
};

export type VendorReadinessDecision = {
  status: "yes" | "yes-with-conditions" | "not-yet";
  label: string;
  summary: string;
  conditions: string[];
};

const TOOL_META: Record<
  ReadinessToolId,
  { title: string; href: string }
> = {
  "requirements-builder": {
    title: "Build CRM requirements",
    href: "/tools/crm-requirements-builder/",
  },
  "crm-finder": {
    title: "Explore CRM software",
    href: "/tools/crm-finder/",
  },
  "cost-calculator": {
    title: "Estimate CRM costs",
    href: "/tools/crm-cost-calculator/",
  },
  "roi-calculator": {
    title: "Calculate ROI",
    href: "/tools/crm-roi-calculator/",
  },
  "rfp-builder": {
    title: "Build vendor brief / RFP",
    href: "/tools/crm-rfp-builder/",
  },
  "demo-checklist": {
    title: "Build demo checklist",
    href: "/tools/crm-demo-checklist-builder/",
  },
  "vendor-scorecard": {
    title: "Vendor scorecard",
    href: "/tools/crm-vendor-scorecard/",
  },
  "decision-matrix": {
    title: "Decision matrix",
    href: "/resources/crm-comparison-worksheet/",
  },
  "implementation-planner": {
    title: "Implementation planner",
    href: "/tools/crm-implementation-planner/",
  },
  "migration-planner": {
    title: "Migration planner",
    href: "/tools/crm-migration-planner/",
  },
  "best-crm": {
    title: "Best CRM Software",
    href: "/best/crm-software/",
  },
  "tco-calculator": {
    title: "TCO calculator",
    href: "/tools/crm-tco-calculator/",
  },
};

/** SI tool destinations — same tool IDs, SI routes where twins exist. */
export const SI_TOOL_META: Record<
  ReadinessToolId,
  { title: string; href: string }
> = {
  ...TOOL_META,
  "requirements-builder": {
    title: "Build SI requirements",
    href: "/tools/sales-intelligence-requirements-builder/",
  },
  "crm-finder": {
    title: "Explore sales intelligence tools",
    href: "/tools/sales-intelligence-finder/",
  },
  "rfp-builder": {
    title: "Build SI vendor brief / RFP",
    href: "/tools/sales-intelligence-rfp-builder/",
  },
  "demo-checklist": {
    title: "Build SI demo checklist",
    href: "/tools/sales-intelligence-demo-checklist-builder/",
  },
  "vendor-scorecard": {
    title: "SI vendor scorecard",
    href: "/tools/sales-intelligence-vendor-scorecard/",
  },
  "best-crm": {
    title: "Best sales intelligence software",
    href: "/best/sales-intelligence-software/",
  },
  "cost-calculator": {
    title: "Estimate SI costs",
    href: "/tools/sales-intelligence-cost-calculator/",
  },
};

function dimScore(
  assessment: AssessCrmReadinessResult,
  id: string,
): DimensionScoreResult | undefined {
  return assessment.dimensions.find((d) => d.dimensionId === id);
}

function answerValue(
  session: CrmReadinessSession,
  questionId: string,
): unknown {
  return session.answers[questionId]?.value;
}

export function generateFindings(
  session: CrmReadinessSession,
  assessment: AssessCrmReadinessResult,
  catalog: ReadinessCatalogPack = CRM_READINESS_CATALOG,
): ReadinessFinding[] {
  const findings: ReadinessFinding[] = [];
  const org = assessment.orgComplexity;

  // Critical blockers from explicit answer rules
  for (const qId of assessment.answeredQuestionIds) {
    const answer = session.answers[qId];
    if (!answer || !isCriticalAnswer(qId, answer.value, catalog)) continue;
    const q = catalog.getQuestionById(qId) ?? getQuestionById(qId);
    if (!q) continue;

    const map: Record<
      string,
      Omit<ReadinessFinding, "id" | "type" | "severity" | "dimensionId" | "questionId">
    > = {
      "bc-problem-clarity": {
        title: "Business problem not defined",
        explanation:
          "The organization has not documented why it is buying a CRM. Vendor conversations will lack a shared problem statement.",
        recommendation:
          "Document and agree the business problem and outcomes before formal vendor evaluation.",
        phase: "do-now",
      },
      "bc-sponsor": {
        title: "No executive sponsor",
        explanation:
          "Without executive sponsorship, decisions stall and adoption signals stay weak.",
        recommendation:
          "Secure a named executive sponsor before entering vendor demos.",
        phase: "do-now",
      },
      "st-project-owner": {
        title: "No project owner",
        explanation:
          "Selection and implementation both need a single accountable owner.",
        recommendation: "Assign a CRM project owner with decision-day authority.",
        phase: "do-now",
      },
      "st-decision-authority": {
        title: "Decision ownership is unclear",
        explanation:
          "Everyone may be involved, but nobody can close a vendor decision.",
        recommendation:
          "Name the decision owner and approval path before shortlisting vendors.",
        phase: "do-now",
      },
      "st-post-owner": {
        title: "No post-implementation CRM owner",
        explanation:
          "Vendor selection can succeed while day-2 operations have no owner.",
        recommendation:
          "Assign who owns the CRM after go-live (admin + business owner).",
        phase: "before-contract",
      },
      "ic-impl-owner": {
        title: "No implementation owner",
        explanation:
          "Nobody is currently accountable for CRM configuration and implementation after vendor selection.",
        recommendation:
          "Assign an implementation owner before entering final vendor negotiations.",
        phase: "do-now",
      },
      "dt-data-owner": {
        title: "No data / migration owner",
        explanation:
          "Data work is one of the most common implementation derailers.",
        recommendation:
          "Assign a data migration owner before committing to a go-live date.",
        phase: "before-demos",
      },
      "ic-timeline": {
        title: "Unrealistic go-live timeline",
        explanation:
          "An aggressive timeline with unresolved foundations creates delivery and adoption risk.",
        recommendation:
          "Re-baseline the timeline after requirements, data and capacity are clearer.",
        phase: "do-now",
      },
      "rq-gathered": {
        title: "Requirements not started",
        explanation:
          "Evaluating vendors without requirements produces feature tours instead of comparable evidence.",
        recommendation:
          "Build prioritized CRM requirements before formal demos.",
        phase: "do-now",
      },
      "sc-owner": {
        title: "Security / privacy approver missing",
        explanation:
          "Relevant compliance topics were selected, but no owner will approve privacy requirements.",
        recommendation:
          "Include your privacy/security owner before vendor evaluation.",
        phase: "before-demos",
      },
      "bc-drivers": {
        title: "CRM drivers unclear",
        explanation:
          "The initiative drivers are not defined, so selection criteria will drift.",
        recommendation:
          "Agree the primary business drivers and success outcomes first.",
        phase: "do-now",
      },
    };

    const tpl = map[qId];
    if (tpl) {
      findings.push({
        id: `blocker-${qId}`,
        type: "blocker",
        severity: "critical",
        dimensionId: q.dimensionId,
        questionId: qId,
        ...tpl,
      });
    }
  }

  // Dimension-based gaps
  for (const dim of assessment.dimensions) {
    if (dim.answeredCount === 0) continue;
    const def =
      catalog.dimensions.find((d) => d.id === dim.dimensionId) ??
      READINESS_DIMENSIONS.find((d) => d.id === dim.dimensionId);
    if (!def) continue;

    if (dim.level === "strong" || dim.level === "good") {
      const top = dim.drivers.filter((d) => d.kind === "positive").slice(-1)[0];
      findings.push({
        id: `strength-${dim.dimensionId}`,
        type: "strength",
        severity: "info",
        dimensionId: dim.dimensionId,
        title: def.shortTitle,
        explanation:
          top?.label ??
          `${def.title} scored ${dim.score}/100 — foundations look solid.`,
        recommendation: "Maintain this strength through selection and rollout.",
        phase: "do-now",
      });
    }

    if (dim.level === "at-risk" || dim.level === "needs-work") {
      const weak = dim.drivers.find(
        (d) => d.kind === "negative" || d.kind === "uncertain",
      );
      findings.push({
        id: `gap-${dim.dimensionId}`,
        type: dim.level === "at-risk" ? "gap" : "gap",
        severity: dim.level === "at-risk" ? "high" : "medium",
        dimensionId: dim.dimensionId,
        title: `${def.shortTitle} needs attention`,
        explanation:
          weak?.label ??
          `${def.title} scored ${dim.score}/100 and may slow selection or implementation.`,
        recommendation: recommendationForDimension(dim.dimensionId, org),
        phase: phaseForDimension(dim.dimensionId),
      });
    }
  }

  // Uncertainty discovery gaps
  if (assessment.uncertainQuestionIds.length >= 4) {
    const dims = new Set(
      assessment.uncertainQuestionIds.map(
        (id) =>
          catalog.getQuestionById(id)?.dimensionId ??
          getQuestionById(id)?.dimensionId ??
          "unknown",
      ),
    );
    const labels = [...dims]
      .map(
        (id) =>
          catalog.dimensions.find((d) => d.id === id)?.shortTitle ??
          READINESS_DIMENSIONS.find((d) => d.id === id)?.shortTitle ??
          id,
      )
      .slice(0, 4)
      .join(", ");
    findings.push({
      id: "discovery-uncertainty",
      type: "discovery",
      severity: "medium",
      dimensionId: catalog.dimensions[0]?.id ?? "technical",
      title: "High answer uncertainty",
      explanation: `You answered "Not sure" on ${assessment.uncertainQuestionIds.length} questions. Most uncertainty relates to: ${labels}.`,
      recommendation:
        "Run targeted discovery (data, security, integrations) before final vendor evaluation.",
      phase: "before-demos",
    });
  }

  // Spreadsheet retirement risk
  const retire = answerValue(session, "cm-retire");
  if (retire === "no" || retire === "partly") {
    findings.push({
      id: "risk-spreadsheet-parallel",
      type: "risk",
      severity: "high",
      dimensionId: "change-management",
      title: "High adoption risk — parallel systems",
      explanation:
        "Users may continue using spreadsheets after CRM launch if retirement is not planned.",
      recommendation:
        "Define the system-of-record policy and spreadsheet retirement plan before go-live.",
      phase: "before-go-live",
    });
  }

  // Budget software without implementation
  const soft = answerValue(session, "bd-software");
  const impl = answerValue(session, "bd-implementation");
  if ((soft === "yes" || soft === "partly") && impl === "no") {
    findings.push({
      id: "risk-budget-services",
      type: "risk",
      severity: "medium",
      dimensionId: "budget",
      title: "Budget excludes implementation services",
      explanation:
        "Software budget exists but implementation / services are not included — a common cost surprise.",
      recommendation:
        "Estimate implementation, migration and training with the Cost / TCO calculators.",
      phase: "before-demos",
    });
  }

  // Small org: soften enterprise governance findings (already filtered by catalog)
  if (org === "small") {
    return findings.filter((f) => {
      if (
        f.dimensionId === "governance" &&
        f.type !== "blocker" &&
        f.severity !== "critical"
      ) {
        return false;
      }
      return true;
    });
  }

  return findings;
}

function recommendationForDimension(
  dimensionId: string,
  org: AssessCrmReadinessResult["orgComplexity"],
): string {
  const map: Record<string, string> = {
    "business-case":
      "Document the problem, outcomes and sponsor before vendor outreach.",
    "sales-process":
      "Document pipeline stages and ownership rules before configuring a CRM.",
    requirements:
      "Build prioritized CRM requirements before evaluating vendors.",
    stakeholders: "Name project, decision and post-go-live owners.",
    "data-readiness":
      "Create a data inventory and assign a migration owner before implementation planning.",
    integrations:
      "Define integration scope, data direction and system owners before demos.",
    technical: "Capture SSO, environment and operational support needs.",
    security:
      "Identify relevant compliance topics and who will approve them — not legal advice.",
    budget: "Include implementation, migration and training in commercial planning.",
    "implementation-capacity":
      org === "small"
        ? "Assign one person responsible for CRM configuration and data quality."
        : "Confirm PM, configuration owner and SME capacity before contracting.",
    "change-management":
      "Align managers and plan retirement of parallel processes.",
    "user-adoption": "Plan role-based training and post-launch user support.",
    reporting: "Define KPIs and dashboard audiences before build.",
    governance:
      org === "small"
        ? "Assign one person for configuration and data quality."
        : "Define who owns config changes, admin and vendor relationship.",
  };
  return map[dimensionId] ?? "Address this gap before the next buying stage.";
}

function phaseForDimension(dimensionId: string): ReadinessActionPhase {
  const map: Record<string, ReadinessActionPhase> = {
    "business-case": "do-now",
    "sales-process": "do-now",
    requirements: "do-now",
    stakeholders: "do-now",
    "data-readiness": "before-demos",
    integrations: "before-demos",
    technical: "before-demos",
    security: "before-contract",
    budget: "before-demos",
    "implementation-capacity": "do-now",
    "change-management": "before-go-live",
    "user-adoption": "before-go-live",
    reporting: "before-demos",
    governance: "before-contract",
  };
  return map[dimensionId] ?? "do-now";
}

export function generateActions(
  session: CrmReadinessSession,
  assessment: AssessCrmReadinessResult,
  findings: ReadinessFinding[],
): ReadinessAction[] {
  const actions: ReadinessAction[] = [];
  const seen = new Set<string>();

  const push = (action: ReadinessAction) => {
    if (seen.has(action.id)) return;
    seen.add(action.id);
    actions.push(action);
  };

  for (const f of findings.filter((x) => x.type === "blocker")) {
    push({
      id: `action-${f.id}`,
      priority: "critical",
      phase: f.phase,
      effort: "low",
      title: f.recommendation.replace(/\.$/, ""),
      reason: f.explanation,
      ownerHint: ownerForDimension(f.dimensionId),
      dimensionId: f.dimensionId,
      relatedTool: toolForDimension(f.dimensionId),
    });
  }

  const req = dimScore(assessment, "requirements");
  if (req && req.score < 70) {
    push({
      id: "action-build-requirements",
      priority: req.score < 50 ? "high" : "medium",
      phase: "do-now",
      effort: "medium",
      title: "Build and prioritize CRM requirements",
      reason: `Requirements readiness is ${req.score}/100.`,
      ownerHint: "Sales Ops / RevOps",
      relatedTool: "requirements-builder",
      dimensionId: "requirements",
    });
  }

  const data = dimScore(assessment, "data-readiness");
  if (data && data.score < 70) {
    push({
      id: "action-data-inventory",
      priority: data.score < 50 ? "high" : "medium",
      phase: "before-demos",
      effort: "medium",
      title: "Inventory customer data sources and owners",
      reason: `Data readiness is ${data.score}/100.`,
      ownerHint: "RevOps / IT",
      relatedTool: "migration-planner",
      dimensionId: "data-readiness",
    });
  }

  const ig = dimScore(assessment, "integrations");
  if (ig && ig.score < 70 && answerValue(session, "ig-needed") === "yes") {
    push({
      id: "action-integration-scope",
      priority: "high",
      phase: "before-demos",
      effort: "medium",
      title: "Define integration requirements and data ownership",
      reason: "Integration scope is unclear or incomplete.",
      ownerHint: "IT / RevOps",
      relatedTool: "requirements-builder",
      dimensionId: "integrations",
    });
  }

  const budget = dimScore(assessment, "budget");
  if (budget && budget.score < 75) {
    push({
      id: "action-cost-model",
      priority: "medium",
      phase: "before-demos",
      effort: "low",
      title: "Confirm software and implementation budget",
      reason: "Commercial planning still has gaps.",
      ownerHint: "Finance",
      relatedTool: "cost-calculator",
      dimensionId: "budget",
    });
  }

  const bc = dimScore(assessment, "business-case");
  if (bc && bc.score < 70) {
    push({
      id: "action-roi",
      priority: "medium",
      phase: "do-now",
      effort: "medium",
      title: "Quantify expected CRM benefits",
      reason: "Business case / objectives need strengthening.",
      ownerHint: "Sponsor / Sales leadership",
      relatedTool: "roi-calculator",
      dimensionId: "business-case",
    });
  }

  if (
    assessment.selectionScore >= 60 &&
    findings.filter((f) => f.type === "blocker").length <= 1
  ) {
    push({
      id: "action-demo-criteria",
      priority: "medium",
      phase: "before-demos",
      effort: "medium",
      title: "Establish demo success criteria",
      reason: "You can begin structured discovery; demos need a shared script.",
      ownerHint: "Project owner",
      relatedTool: "demo-checklist",
    });
  }

  if (assessment.selectionScore >= 70 && (req?.score ?? 0) >= 60) {
    push({
      id: "action-rfp",
      priority: "medium",
      phase: "before-contract",
      effort: "medium",
      title: "Prepare vendor brief or RFP",
      reason: "Requirements are mature enough for a structured vendor package.",
      ownerHint: "Procurement / Project owner",
      relatedTool: "rfp-builder",
    });
  }

  const adopt = dimScore(assessment, "user-adoption");
  const change = dimScore(assessment, "change-management");
  if ((adopt && adopt.score < 65) || (change && change.score < 65)) {
    push({
      id: "action-adoption-plan",
      priority: "medium",
      phase: "before-go-live",
      effort: "medium",
      title: "Complete adoption and training plan",
      reason: "Adoption foundations need work before go-live.",
      ownerHint: "Sales leadership",
      relatedTool: "implementation-planner",
      dimensionId: "user-adoption",
    });
  }

  const gov = dimScore(assessment, "governance");
  if (gov && gov.score < 60 && assessment.orgComplexity !== "small") {
    push({
      id: "action-governance",
      priority: "medium",
      phase: "before-go-live",
      effort: "low",
      title: "Agree CRM governance and admin ownership",
      reason: "Post-launch configuration ownership is unclear.",
      ownerHint: "CRM admin / RevOps",
      dimensionId: "governance",
    });
  }

  // Priority sort within phases
  const priorityRank = { critical: 0, high: 1, medium: 2, low: 3 };
  return actions.sort(
    (a, b) => priorityRank[a.priority] - priorityRank[b.priority],
  );
}

function ownerForDimension(dimensionId: string): string {
  const map: Record<string, string> = {
    "business-case": "Sponsor",
    "sales-process": "Sales Ops",
    requirements: "RevOps",
    stakeholders: "Sponsor",
    "data-readiness": "RevOps / IT",
    integrations: "IT",
    technical: "IT",
    security: "Security",
    budget: "Finance",
    "implementation-capacity": "Project owner",
    "change-management": "Sales leadership",
    "user-adoption": "Sales Ops",
    reporting: "RevOps",
    governance: "CRM admin",
  };
  return map[dimensionId] ?? "TBD";
}

function toolForDimension(dimensionId: string): ReadinessToolId | undefined {
  const map: Partial<Record<string, ReadinessToolId>> = {
    requirements: "requirements-builder",
    "data-readiness": "migration-planner",
    budget: "cost-calculator",
    "business-case": "roi-calculator",
    "implementation-capacity": "implementation-planner",
    "user-adoption": "implementation-planner",
    // SI dimensions
    "icp-clarity": "requirements-builder",
    "crm-sor-readiness": "requirements-builder",
    "data-ownership": "requirements-builder",
    "compliance-owner": "rfp-builder",
    "volume-credit-planning": "cost-calculator",
    "enrichment-vs-list": "crm-finder",
    "outbound-maturity": "demo-checklist",
    "success-metrics": "vendor-scorecard",
  };
  return map[dimensionId];
}

export function recommendTools(
  assessment: AssessCrmReadinessResult,
  findings: ReadinessFinding[],
  actions: ReadinessAction[],
  toolMeta: Record<ReadinessToolId, { title: string; href: string }> = TOOL_META,
): ToolRecommendation[] {
  const scored = new Map<ReadinessToolId, { priority: number; reason: string }>();

  const bump = (id: ReadinessToolId, priority: number, reason: string) => {
    const prev = scored.get(id);
    if (!prev || priority < prev.priority) {
      scored.set(id, { priority, reason });
    }
  };

  const req =
    dimScore(assessment, "requirements") ??
    dimScore(assessment, "icp-clarity");
  if (req && req.score < 75) {
    bump(
      "requirements-builder",
      1,
      `Requirements readiness is ${req.score}/100. Prioritize must-haves before vendor evaluation.`,
    );
  }

  if (assessment.selectionScore >= 55) {
    bump(
      "crm-finder",
      assessment.selectionScore >= 70 ? 2 : 3,
      "Explore fit-based options once core gaps are in progress.",
    );
    bump("best-crm", 4, "Research shortlists and evaluation criteria.");
  }

  const budget = dimScore(assessment, "budget");
  if (budget && budget.score < 80) {
    bump("cost-calculator", 2, "Confirm seat counts and subscription assumptions.");
    bump("tco-calculator", 5, "Include implementation and hidden costs.");
  }

  const bc = dimScore(assessment, "business-case");
  if (bc && bc.score < 75) {
    bump("roi-calculator", 3, "Strengthen the business case with measurable outcomes.");
  }

  if ((req?.score ?? 0) >= 55 && assessment.selectionScore >= 60) {
    bump(
      "demo-checklist",
      3,
      "Prepare comparable demo criteria before vendor presentations.",
    );
  }

  if ((req?.score ?? 0) >= 65 && findings.filter((f) => f.type === "blocker").length === 0) {
    bump("rfp-builder", 4, "Package requirements for vendors when ready.");
  } else if ((req?.score ?? 0) < 65) {
    bump(
      "rfp-builder",
      8,
      "Complete requirements before a formal vendor brief.",
    );
  }

  const data = dimScore(assessment, "data-readiness");
  if (data && data.score < 70) {
    bump("migration-planner", 3, "Plan data inventory and migration scope.");
  }

  if (assessment.implementationScore < 70) {
    bump(
      "implementation-planner",
      4,
      "Turn remaining gaps into an implementation plan.",
    );
  }

  if (assessment.selectionScore >= 75) {
    bump("vendor-scorecard", 5, "Score finalists on shared criteria.");
    bump("decision-matrix", 6, "Document the final comparison.");
  }

  for (const a of actions) {
    if (a.relatedTool) {
      bump(a.relatedTool, a.priority === "critical" ? 1 : 2, a.reason);
    }
  }

  const blockers = findings.filter((f) => f.type === "blocker").length;
  const list: ToolRecommendation[] = [...scored.entries()]
    .sort((a, b) => a[1].priority - b[1].priority)
    .slice(0, 6)
    .map(([toolId, meta]) => {
      const info = toolMeta[toolId];
      const locked =
        toolId === "rfp-builder" &&
        ((req?.score ?? 0) < 60 || blockers > 1);
      return {
        toolId,
        title: info.title,
        href: info.href,
        reason: meta.reason,
        priority: meta.priority,
        locked,
        lockReason: locked
          ? "Strengthen requirements and clear critical blockers first"
          : undefined,
      };
    });

  return list;
}

export function buildRiskRegister(
  findings: ReadinessFinding[],
): ReadinessRiskRow[] {
  return findings
    .filter((f) => f.type === "blocker" || f.type === "risk" || f.type === "gap")
    .filter((f) => f.severity === "critical" || f.severity === "high" || f.severity === "medium")
    .slice(0, 12)
    .map((f) => ({
      id: f.id,
      risk: f.title,
      severity: f.severity,
      phase: phaseLabel(f.phase),
      why: f.explanation,
      impact:
        f.type === "blocker"
          ? "May block successful selection or implementation"
          : "May delay timeline, raise cost or weaken adoption",
      mitigation: f.recommendation,
      when: phaseLabel(f.phase),
    }));
}

function phaseLabel(phase: ReadinessActionPhase): string {
  const map: Record<ReadinessActionPhase, string> = {
    "do-now": "Foundation / now",
    "before-demos": "Selection",
    "before-contract": "Decision",
    "before-go-live": "Implementation / adoption",
  };
  return map[phase];
}

export function vendorReadinessDecision(
  assessment: AssessCrmReadinessResult,
  findings: ReadinessFinding[],
): VendorReadinessDecision {
  const blockers = findings.filter((f) => f.type === "blocker");
  const conditions: string[] = [];

  const req = dimScore(assessment, "requirements");
  if (req && req.score < 70) {
    conditions.push("Define must-have requirements");
  }
  const ig = dimScore(assessment, "integrations");
  if (ig && ig.score < 65) {
    conditions.push("Document integration scope");
  }
  const data = dimScore(assessment, "data-readiness");
  if (data && data.score < 60) {
    conditions.push("Assign data migration owner");
  }
  if (blockers.some((b) => b.id.includes("impl-owner") || b.id.includes("project-owner"))) {
    conditions.push("Assign project / implementation ownership");
  }

  if (blockers.length >= 2 || assessment.selectionScore < 45) {
    return {
      status: "not-yet",
      label: "Not yet — prepare first",
      summary:
        "Resolve critical foundations before formal vendor conversations. Early research is fine; demos are premature.",
      conditions,
    };
  }

  if (
    blockers.length > 0 ||
    conditions.length > 0 ||
    assessment.selectionScore < 75
  ) {
    return {
      status: "yes-with-conditions",
      label: "Yes — but with conditions",
      summary:
        "You can begin early vendor research. Complete the conditions below before formal demos.",
      conditions:
        conditions.length > 0
          ? conditions
          : ["Close remaining readiness gaps listed in your action plan"],
    };
  }

  return {
    status: "yes",
    label: "Yes — ready for structured vendor engagement",
    summary:
      "Selection foundations look solid. Keep resolving implementation gaps in parallel.",
    conditions: [],
  };
}

export function buildExecutiveSummary(
  assessment: AssessCrmReadinessResult,
  findings: ReadinessFinding[],
): string {
  const blockers = findings.filter((f) => f.type === "blocker");
  const gaps = findings.filter(
    (f) => f.type === "gap" || f.type === "risk",
  );
  const level = assessment.overallLevel;

  const openers: Record<typeof level, string> = {
    "foundations-not-ready":
      "Your organization still needs fundamental CRM foundations before serious vendor evaluation.",
    "preparation-required":
      "You can begin discovery, but significant gaps should be addressed before selection.",
    "ready-for-structured-discovery":
      "Your organization is prepared to start structured CRM selection, but key gaps should be resolved before committing to a vendor.",
    "ready-for-selection":
      "Your organization has most foundations required for structured CRM evaluation.",
    "strongly-prepared":
      "Your selection and implementation foundations are unusually mature — still validate remaining risks before contract.",
  };

  const sel = assessment.selectionScore;
  const impl = assessment.implementationScore;
  let contrast = "";
  if (sel - impl >= 15) {
    contrast =
      " Selection readiness is ahead of implementation readiness — you may be able to evaluate vendors while still weak on delivery foundations.";
  } else if (impl - sel >= 15) {
    contrast =
      " Implementation capacity looks stronger than selection preparation — strengthen requirements and decision ownership before demos.";
  }

  const blockerBit =
    blockers.length > 0
      ? ` ${blockers.length} critical blocker${blockers.length === 1 ? "" : "s"} must be cleared.`
      : "";
  const gapBit =
    gaps.length > 0
      ? ` ${Math.min(gaps.length, 8)} significant gap${gaps.length === 1 ? "" : "s"} remain.`
      : "";

  return `${openers[level]}${contrast}${blockerBit}${gapBit}`;
}

export function runFullAssessment(
  session: CrmReadinessSession,
  options: {
    catalog?: ReadinessCatalogPack;
    toolMeta?: Record<ReadinessToolId, { title: string; href: string }>;
  } = {},
) {
  const catalog = options.catalog ?? CRM_READINESS_CATALOG;
  const toolMeta = options.toolMeta ?? TOOL_META;
  const preliminary = assessCrmReadiness(session, { catalog });
  const findings = generateFindings(session, preliminary, catalog);
  const criticalBlockerCount = findings.filter(
    (f) => f.type === "blocker",
  ).length;
  const assessment = assessCrmReadiness(session, {
    criticalBlockerCount,
    catalog,
  });
  // Re-level with blocker count (findings still valid)
  const finalFindings = generateFindings(session, assessment, catalog);
  const actions = generateActions(session, assessment, finalFindings);
  const tools = recommendTools(assessment, finalFindings, actions, toolMeta);
  const risks = buildRiskRegister(finalFindings);
  const vendorDecision = vendorReadinessDecision(assessment, finalFindings);
  const executiveSummary = buildExecutiveSummary(assessment, finalFindings);

  return {
    assessment,
    findings: finalFindings,
    actions,
    tools,
    risks,
    vendorDecision,
    executiveSummary,
    strengthCount: finalFindings.filter((f) => f.type === "strength").length,
    gapCount: finalFindings.filter(
      (f) => f.type === "gap" || f.type === "risk",
    ).length,
    criticalBlockerCount: finalFindings.filter((f) => f.type === "blocker")
      .length,
  };
}

export { TOOL_META };
