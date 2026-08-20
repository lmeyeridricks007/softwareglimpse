/**
 * Import requirements / RFP context into the Demo Checklist Builder.
 * Generated demo tasks are editable drafts — never presented as verified facts.
 */

import type {
  CrmDecisionProfile,
  CrmDemoChecklistDraft,
  CrmDemoChecklistSession,
  DemoScenario,
  RfpRequirement,
} from "@/domain";
import { getCrmRequirementDefinition } from "@/data/crm-graph/requirements";
import { getSiRequirementDefinition } from "@/data/si-graph";
import {
  loadCrmDecisionProfile,
  loadSiDecisionProfile,
} from "@/services/decision-profile/persistence";
import { buildRequirementDemoTest } from "@/services/requirement-detail/demo-test";
import { loadCrmRfpSession } from "@/services/rfp-builder/persistence";
import { loadSiRfpSession } from "@/services/rfp-builder/si-persistence";
import { newDemoId } from "./constants";
import { touchCrmDemoChecklistSession } from "./persistence";

function profilePriorityToDemo(
  priority: CrmDecisionProfile["requirements"][number]["priority"],
): DemoScenario["priority"] {
  if (priority === "must-have") return "must-have";
  if (priority === "important") return "should-have";
  return "optional";
}

function rfpPriorityToDemo(
  priority: RfpRequirement["priority"],
): DemoScenario["priority"] {
  if (priority === "must-have") return "must-have";
  if (priority === "should-have") return "should-have";
  return "optional";
}

function resolveRequirementLabel(requirementId: string, fallback?: string): string {
  const crm = getCrmRequirementDefinition(requirementId);
  if (crm?.name) return crm.name;
  const si = getSiRequirementDefinition(requirementId);
  if (si?.name) return si.name;
  return fallback ?? requirementId.replace(/-/g, " ");
}

function scenarioFromRequirement(input: {
  requirementId: string;
  label: string;
  priority: DemoScenario["priority"];
  sortOrder: number;
}): DemoScenario {
  const def = getCrmRequirementDefinition(input.requirementId);
  const demoTest = buildRequirementDemoTest({
    slug: input.requirementId,
    name: input.label,
    buyerNeedDescription: def?.buyerNeedDescription ?? input.label,
    evaluationCriteria: (def?.evaluationCriteria ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      featureSlugs: c.featureSlugs,
      importance: c.importance,
    })),
    acceptanceNeeds: [],
    workflowSteps: [],
    vendorQuestions: def?.vendorQuestions ?? [],
  });

  const steps = demoTest.steps;
  const outcomes = demoTest.expectedOutcomes;
  const evidence = [
    "Screenshot of completed workflow",
    ...demoTest.failureSignals.slice(0, 2).map((s) => `Watch for: ${s}`),
  ];
  const questions = demoTest.questions;

  return {
    id: newDemoId("SCN"),
    name: input.label.slice(0, 120),
    businessContext: demoTest.objective,
    persona: "Evaluator",
    categoryId: def?.primaryCapabilitySlug ?? "imported",
    startingState: "Use the vendor's standard demo environment with sample data.",
    vendorTasks: steps,
    expectedOutcome: outcomes.join("; "),
    successCriteria: outcomes,
    evidenceRequired: evidence,
    requirementIds: [input.requirementId],
    priority: input.priority,
    estimatedMinutes: Math.min(15, Math.max(5, steps.length + 3)),
    moderatorScript: [
      `Please demonstrate the following requirement: ${input.label}`,
      "",
      "Ask the vendor to:",
      ...steps.map((s, i) => `${i + 1}. ${s}`),
      questions.length
        ? `\nFollow-up questions:\n${questions.map((q) => `- ${q}`).join("\n")}`
        : "",
      "",
      "If this cannot be demonstrated live, say so rather than substituting a different workflow.",
    ]
      .filter(Boolean)
      .join("\n"),
    notes:
      "Generated from imported requirements — edit before treating as final demo script.",
    templateId: undefined,
    sortOrder: input.sortOrder,
    included: true,
  };
}

export type ProfileImportResult = {
  session: CrmDemoChecklistSession;
  importedCount: number;
  skippedCount: number;
};

/**
 * Import prioritized requirements from CRMDecisionProfile.
 * Does not remove existing scenarios; appends coverage for new requirement IDs.
 */
export function importRequirementsFromProfile(
  session: CrmDemoChecklistSession,
  profile?: CrmDecisionProfile | null,
): ProfileImportResult {
  const source =
    profile ?? loadCrmDecisionProfile() ?? loadSiDecisionProfile();
  if (!source) {
    return { session, importedCount: 0, skippedCount: 0 };
  }

  const already = new Set(session.draft.importedRequirementIds);
  const covered = new Set(
    session.draft.scenarios.flatMap((s) => s.requirementIds),
  );

  const candidates = source.requirements.filter(
    (r) =>
      r.priority !== "not-needed" &&
      !already.has(r.id) &&
      !covered.has(r.id),
  );

  const newScenarios = candidates.map((req, index) =>
    scenarioFromRequirement({
      requirementId: req.id,
      label: resolveRequirementLabel(req.id),
      priority: profilePriorityToDemo(req.priority),
      sortOrder: session.draft.scenarios.length + index,
    }),
  );

  // Also map integrations marked required.
  const integrationIds = new Set(
    session.draft.integrations.map((i) => i.integration.toLowerCase()),
  );
  const integrations = [...session.draft.integrations];
  for (const integ of source.integrations) {
    if (integ.priority === "optional") continue;
    const label = integ.id.replace(/-/g, " ");
    if (integrationIds.has(label.toLowerCase()) || integrationIds.has(integ.id)) {
      continue;
    }
    integrations.push({
      id: newDemoId("INT"),
      integration: label,
      required: integ.priority === "required",
      delivery: "unknown",
      demoRequested: integ.priority === "required",
      testTask: `Demonstrate connection or sync behaviour for ${label}, including objects synced and failure handling.`,
      evidenceRequired: "Live connector demo or explicit API/limitation statement",
      notes: "Imported from Requirements Builder",
    });
  }

  const nextDraft: CrmDemoChecklistDraft = {
    ...session.draft,
    scenarios: [...session.draft.scenarios, ...newScenarios],
    integrations,
    importedRequirementIds: [
      ...session.draft.importedRequirementIds,
      ...candidates.map((c) => c.id),
    ],
    setup: {
      ...session.draft.setup,
      projectName:
        session.draft.setup.projectName ||
        "CRM evaluation demo plan",
      expectedVendors:
        session.draft.setup.expectedVendors ??
        (source.shortlistProductIds.length > 0
          ? Math.min(5, source.shortlistProductIds.length)
          : undefined),
    },
  };

  // Seed vendor evaluations from shortlist without inventing product claims.
  if (
    source.shortlistProductIds.length > 0 &&
    session.draft.vendorEvaluations.length === 0
  ) {
    nextDraft.vendorEvaluations = source.shortlistProductIds
      .slice(0, 5)
      .map((productId) => ({
        vendorId: productId,
        vendorLabel: productId,
        productId,
        demoDate: "",
        evaluator: "",
        results: [],
        overallNotes: "",
      }));
    nextDraft.activeVendorId = nextDraft.vendorEvaluations[0]?.vendorId;
  }

  return {
    session: touchCrmDemoChecklistSession(session, { draft: nextDraft }),
    importedCount: newScenarios.length,
    skippedCount: source.requirements.length - candidates.length,
  };
}

/**
 * Import RFP requirements when an RFP session exists locally.
 */
export function importRequirementsFromRfp(
  session: CrmDemoChecklistSession,
): ProfileImportResult {
  const rfp = loadCrmRfpSession() ?? loadSiRfpSession();
  if (!rfp) {
    return { session, importedCount: 0, skippedCount: 0 };
  }

  const already = new Set(session.draft.importedRequirementIds);
  const covered = new Set(
    session.draft.scenarios.flatMap((s) => s.requirementIds),
  );

  const candidates = rfp.draft.requirements.filter(
    (r) =>
      r.priority !== "out-of-scope" &&
      r.priority !== "future" &&
      !already.has(r.id) &&
      !covered.has(r.id),
  );

  const newScenarios = candidates.map((req, index) => {
    const base = scenarioFromRequirement({
      requirementId: req.id,
      label: req.requirement || req.id,
      priority: rfpPriorityToDemo(req.priority),
      sortOrder: session.draft.scenarios.length + index,
    });
    if (req.acceptanceCriterion.trim()) {
      base.successCriteria = [
        req.acceptanceCriterion,
        ...base.successCriteria,
      ];
    }
    if (req.evidenceRequested.trim()) {
      base.evidenceRequired = [
        req.evidenceRequested,
        ...base.evidenceRequired,
      ];
    }
    return base;
  });

  const next = touchCrmDemoChecklistSession(session, {
    draft: {
      ...session.draft,
      scenarios: [...session.draft.scenarios, ...newScenarios],
      importedRequirementIds: [
        ...session.draft.importedRequirementIds,
        ...candidates.map((c) => c.id),
      ],
      setup: {
        ...session.draft.setup,
        projectName:
          session.draft.setup.projectName ||
          rfp.draft.project.projectName ||
          "CRM evaluation demo plan",
        demoOwner:
          session.draft.setup.demoOwner || rfp.draft.project.owner || "",
        expectedVendors:
          session.draft.setup.expectedVendors ??
          rfp.draft.project.vendorsExpected,
        targetDecisionDate:
          session.draft.setup.targetDecisionDate ||
          rfp.draft.project.decisionDate ||
          "",
      },
    },
  });

  return {
    session: next,
    importedCount: newScenarios.length,
    skippedCount: rfp.draft.requirements.length - candidates.length,
  };
}

export function hasDecisionProfile(): boolean {
  return (
    loadCrmDecisionProfile() != null || loadSiDecisionProfile() != null
  );
}

export function hasRfpSession(): boolean {
  return loadCrmRfpSession() != null || loadSiRfpSession() != null;
}
