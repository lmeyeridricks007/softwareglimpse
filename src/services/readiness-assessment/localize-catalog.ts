/**
 * Relabel the CRM readiness questionnaire for other published categories.
 * Scoring, weights, question IDs, and option IDs stay identical.
 */

import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import {
  CRM_READINESS_CATALOG,
  type ReadinessCatalogPack,
} from "./catalog-pack";
import type { ReadinessQuestionDef } from "./catalog";
import {
  runFullAssessment,
  type ReadinessAction,
  type ReadinessFinding,
  type ReadinessRiskRow,
  type ToolRecommendation,
  type VendorReadinessDecision,
} from "./findings";
import type { CrmReadinessSession } from "@/domain";

export type ReadinessNounCopy = {
  shortName: string;
  productNoun: string;
  softwarePhrase: string;
};

export type ReadinessContextCopy = {
  usersLabel: string;
  teamSizeLabel: string;
  modelLabel: string;
  complexityLabel: string;
  replacingLabel: string;
  currentToolLabel: string;
};

export const CRM_READINESS_CONTEXT_COPY: ReadinessContextCopy = {
  usersLabel: "Expected CRM users",
  teamSizeLabel: "Sales team size",
  modelLabel: "Sales model",
  complexityLabel: "Sales complexity",
  replacingLabel: "Replacing an existing CRM?",
  currentToolLabel: "Current CRM",
};

export function categoryReadinessContextCopy(): ReadinessContextCopy {
  return {
    usersLabel: "Expected users / seats",
    teamSizeLabel: "Team size",
    modelLabel: "Business model",
    complexityLabel: "Process complexity",
    replacingLabel: "Replacing an existing tool?",
    currentToolLabel: "Current tool",
  };
}

export function readinessNounCopyFromKit(
  kit: CategoryFinderClientKit,
): ReadinessNounCopy {
  return {
    shortName: kit.shortName,
    productNoun: kit.productNoun,
    softwarePhrase: kit.softwarePhrase,
  };
}

function article(noun: string): { a: string; A: string } {
  const a = /^[aeiou]/i.test(noun) ? "an" : "a";
  return { a, A: a.charAt(0).toUpperCase() + a.slice(1) };
}

export function rewriteCrmReadinessLanguage(
  text: string,
  copy: ReadinessNounCopy,
): string {
  const { a, A } = article(copy.productNoun);
  return text
    .replaceAll("Expected CRM users", "Expected users / seats")
    .replaceAll("Replace an existing CRM", "Replace an existing tool")
    .replaceAll("Current CRM", "Current tool")
    .replaceAll(
      "CRM Requirements Builder",
      `${copy.shortName} Requirements Builder`,
    )
    .replaceAll("CRM Finder", `${copy.shortName} Finder`)
    .replaceAll("Best CRM Software", `Best ${copy.softwarePhrase}`)
    .replaceAll("Best CRM", `Best ${copy.softwarePhrase}`)
    .replaceAll("CRM buying journey", `${copy.shortName} buying journey`)
    .replaceAll("CRM readiness", `${copy.shortName} readiness`)
    .replaceAll("CRM Readiness", `${copy.shortName} Readiness`)
    .replaceAll("CRM project owner", `${copy.shortName} project owner`)
    .replaceAll("CRM project team", `${copy.shortName} project team`)
    .replaceAll("CRM project", `${copy.shortName} project`)
    .replaceAll("CRM initiative", `${copy.shortName} initiative`)
    .replaceAll("CRM configuration", "configuration")
    .replaceAll("CRM admin / RevOps", "admin / operations")
    .replaceAll("CRM admin", "platform admin")
    .replaceAll("CRM vendors", `${copy.shortName} vendors`)
    .replaceAll("CRM vendor", `${copy.shortName} vendor`)
    .replaceAll("CRM software", copy.softwarePhrase)
    .replaceAll("CRM customer data", "customer data")
    .replaceAll("CRM data", "operational data")
    .replaceAll("CRM launch", "go-live")
    .replaceAll("CRM usage", "usage")
    .replaceAll(
      "CRM as the system of record",
      "the new system as the system of record",
    )
    .replaceAll("post-implementation CRM owner", "post-implementation owner")
    .replaceAll("CRM drivers", `${copy.shortName} drivers`)
    .replaceAll("CRM foundations", `${copy.shortName} foundations`)
    .replaceAll("CRM benefits", `${copy.shortName} benefits`)
    .replaceAll("CRM governance", "governance")
    .replaceAll("CRM evaluation", `${copy.shortName} evaluation`)
    .replaceAll("CRM selection", `${copy.shortName} selection`)
    .replaceAll("CRM options", `${copy.softwarePhrase} options`)
    .replaceAll("CRM requirements", `${copy.shortName} requirements`)
    .replaceAll("prioritized CRM", `prioritized ${copy.shortName}`)
    .replaceAll("Automate sales processes", "Automate operating processes")
    .replaceAll("sales processes", "operating processes")
    .replaceAll("Sales process", "Operating process")
    .replaceAll("sales process", "operating process")
    .replaceAll("Sales team", "Team")
    .replaceAll("pipeline stages", "workflow stages")
    .replaceAll("a CRM", `${a} ${copy.productNoun} platform`)
    .replaceAll("A CRM", `${A} ${copy.productNoun} platform`)
    .replaceAll("the CRM", `the ${copy.productNoun} platform`)
    .replaceAll("The CRM", `The ${copy.productNoun} platform`)
    .replaceAll("CRMs ", `${copy.softwarePhrase} `)
    .replaceAll(" CRM", ` ${copy.shortName}`)
    .replaceAll("CRM ", `${copy.shortName} `)
    .replaceAll("CRM", copy.shortName);
}

export function localizeCrmReadinessCatalog(
  copy: ReadinessNounCopy,
): ReadinessCatalogPack {
  const rewrite = (value: string) => rewriteCrmReadinessLanguage(value, copy);
  const dimensions = CRM_READINESS_CATALOG.dimensions.map((dimension) => {
    if (dimension.id === "sales-process") {
      return {
        ...dimension,
        title: "Operating process",
        shortTitle: "Process",
        description: rewrite(dimension.description),
      };
    }
    return {
      ...dimension,
      title: rewrite(dimension.title),
      shortTitle: rewrite(dimension.shortTitle),
      description: rewrite(dimension.description),
    };
  });
  const questions: ReadinessQuestionDef[] = CRM_READINESS_CATALOG.questions.map(
    (question) => ({
      ...question,
      prompt: rewrite(question.prompt),
      helpText: question.helpText ? rewrite(question.helpText) : undefined,
      options: question.options.map((option) => ({
        ...option,
        label: rewrite(option.label),
      })),
    }),
  );
  const byId = new Map(questions.map((question) => [question.id, question]));
  return {
    assessmentVersion: CRM_READINESS_CATALOG.assessmentVersion,
    dimensions,
    questions,
    getQuestionById: (id) => byId.get(id),
  };
}

type ReadinessReport = ReturnType<typeof runFullAssessment>;

export type ReadinessExportOptions = {
  catalog?: ReadinessCatalogPack;
  nounCopy?: ReadinessNounCopy;
};

export function prepareReadinessExportReport(
  session: CrmReadinessSession,
  options: ReadinessExportOptions = {},
): ReadinessReport {
  const report = runFullAssessment(session, { catalog: options.catalog });
  return options.nounCopy
    ? localizeReadinessReportCopy(report, options.nounCopy)
    : report;
}

function localizeFinding(
  finding: ReadinessFinding,
  copy: ReadinessNounCopy,
): ReadinessFinding {
  return {
    ...finding,
    title: rewriteCrmReadinessLanguage(finding.title, copy),
    explanation: rewriteCrmReadinessLanguage(finding.explanation, copy),
    recommendation: rewriteCrmReadinessLanguage(finding.recommendation, copy),
  };
}

function localizeAction(
  action: ReadinessAction,
  copy: ReadinessNounCopy,
): ReadinessAction {
  return {
    ...action,
    title: rewriteCrmReadinessLanguage(action.title, copy),
    reason: rewriteCrmReadinessLanguage(action.reason, copy),
    ownerHint: rewriteCrmReadinessLanguage(action.ownerHint, copy),
  };
}

function localizeRisk(
  risk: ReadinessRiskRow,
  copy: ReadinessNounCopy,
): ReadinessRiskRow {
  return {
    ...risk,
    risk: rewriteCrmReadinessLanguage(risk.risk, copy),
    why: rewriteCrmReadinessLanguage(risk.why, copy),
    impact: rewriteCrmReadinessLanguage(risk.impact, copy),
    mitigation: rewriteCrmReadinessLanguage(risk.mitigation, copy),
  };
}

function localizeTool(
  tool: ToolRecommendation,
  copy: ReadinessNounCopy,
): ToolRecommendation {
  return {
    ...tool,
    title: rewriteCrmReadinessLanguage(tool.title, copy),
    reason: rewriteCrmReadinessLanguage(tool.reason, copy),
    lockReason: tool.lockReason
      ? rewriteCrmReadinessLanguage(tool.lockReason, copy)
      : tool.lockReason,
  };
}

function localizeVendorDecision(
  decision: VendorReadinessDecision,
  copy: ReadinessNounCopy,
): VendorReadinessDecision {
  return {
    ...decision,
    label: rewriteCrmReadinessLanguage(decision.label, copy),
    summary: rewriteCrmReadinessLanguage(decision.summary, copy),
    conditions: decision.conditions.map((condition) =>
      rewriteCrmReadinessLanguage(condition, copy),
    ),
  };
}

export function localizeReadinessReportCopy(
  report: ReadinessReport,
  copy: ReadinessNounCopy,
): ReadinessReport {
  return {
    ...report,
    findings: report.findings.map((finding) => localizeFinding(finding, copy)),
    actions: report.actions.map((action) => localizeAction(action, copy)),
    tools: report.tools.map((tool) => localizeTool(tool, copy)),
    risks: report.risks.map((risk) => localizeRisk(risk, copy)),
    vendorDecision: localizeVendorDecision(report.vendorDecision, copy),
    executiveSummary: rewriteCrmReadinessLanguage(
      report.executiveSummary,
      copy,
    ),
  };
}
