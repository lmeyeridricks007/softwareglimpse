import {
  AgentExecutionResultSchema,
  AgentRunTaskSchema,
  contentAgentIdFromHandoff,
  type AgentExecutionResult,
  type AgentHandoffTask,
  type AgentRunTask,
  type ContentAgentId,
} from "@/domain";
import {
  saveAgentDraftBundle,
  saveAgentExecution,
} from "@/data/agents/store";
import { listCategoryKnowledgeMaps } from "@/data/content-clusters/knowledge";
import { resolveProviderProfile } from "@/data/config/agents/provider-profiles";
import {
  assertNoAffiliateEconomics,
  buildAgentContext,
} from "./context-builder";
import { emitAgentEvent } from "./events";
import { getContentAgent, resolveAgentAlias } from "./registry";
import { runQa } from "./qa";
import type { DryRunPreview } from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

export function handoffToRunTask(task: AgentHandoffTask): AgentRunTask | null {
  const agentId = contentAgentIdFromHandoff(task.agentType);
  if (!agentId) return null;
  return AgentRunTaskSchema.parse({
    id: task.id,
    agentId,
    targetContentId: task.contentId,
    productIds: task.productIds,
    categoryIds: task.categoryIds,
    targetSlug:
      typeof task.briefInput.canonicalPath === "string"
        ? undefined
        : task.productIds[0],
    dependencies: task.dependencies,
    status: task.status,
    statusReason: task.statusReason,
    priority: "normal",
    createdBy: "onboarding",
    mode: "CREATE",
    briefInput: task.briefInput,
  });
}

export type RunAgentOptions = {
  dryRun?: boolean;
  json?: boolean;
  persist?: boolean;
  allowNormalizedFacts?: boolean;
  skipQa?: boolean;
  providerProfileId?: string;
  changeEvents?: Parameters<typeof buildAgentContext>[0]["changeEvents"];
  mode?: AgentRunTask["mode"];
};

export type RunAgentResult = {
  execution: AgentExecutionResult;
  readiness: ReturnType<ReturnType<typeof getContentAgent>["canRun"]>;
  dryRunPreview?: DryRunPreview;
  bundle?: Awaited<ReturnType<ReturnType<typeof getContentAgent>["execute"]>>;
};

function parseTarget(
  agentId: ContentAgentId,
  target: string,
): { productSlugs: string[]; categorySlugs: string[]; targetSlug: string } {
  if (agentId === "comparison-agent" && target.includes("-vs-")) {
    const parts = target.split("-vs-");
    return {
      productSlugs: parts,
      categorySlugs: ["crm"],
      targetSlug: target,
    };
  }
  if (
    agentId === "best-software-agent" ||
    agentId === "category-hub-agent" ||
    agentId === "use-case-page-agent"
  ) {
    return {
      productSlugs: [],
      categorySlugs: [target.replace(/-software$/, "")],
      targetSlug: target,
    };
  }
  if (agentId === "guide-agent") {
    // Infer category from knowledge-map topic slug when possible
    const maps = listCategoryKnowledgeMaps();
    let categorySlugs: string[] = [];
    let productSlugs: string[] = [];
    for (const map of maps) {
      const topic = map.topics.find(
        (t) => t.suggestedSlug === target || t.id === target,
      );
      if (topic) {
        categorySlugs = [map.categorySlug];
        productSlugs = topic.productSlugs;
        break;
      }
    }
    return {
      productSlugs,
      categorySlugs,
      targetSlug: target,
    };
  }
  if (agentId === "category-knowledge-planner-agent") {
    return {
      productSlugs: [],
      categorySlugs: [target],
      targetSlug: target,
    };
  }
  if (agentId === "product-knowledge-planner-agent") {
    return {
      productSlugs: [target],
      categorySlugs: [],
      targetSlug: target,
    };
  }
  if (agentId === "supporting-content-planner-agent") {
    return {
      productSlugs: [],
      categorySlugs: [target],
      targetSlug: target,
    };
  }
  return {
    productSlugs: [target],
    categorySlugs: [],
    targetSlug: target,
  };
}

export async function runContentAgent(
  agentInput: string,
  target: string,
  options: RunAgentOptions = {},
): Promise<RunAgentResult> {
  const agentId = resolveAgentAlias(agentInput);
  const agent = getContentAgent(agentId);
  const parsed = parseTarget(agentId, target);
  const startedAt = nowIso();
  const executionId = `exec-${agentId}-${target}-${Date.now()}`;

  emitAgentEvent("agent_task_started", {
    executionId,
    agentId,
    target,
  });

  const context = buildAgentContext({
    agentId,
    productSlugs: parsed.productSlugs,
    categorySlugs: parsed.categorySlugs,
    targetSlug: parsed.targetSlug,
    mode: options.mode ?? "CREATE",
    allowNormalizedFacts: options.allowNormalizedFacts,
    changeEvents: options.changeEvents,
  });

  const leaks = assertNoAffiliateEconomics(context);
  if (leaks.length) {
    const execution = AgentExecutionResultSchema.parse({
      id: executionId,
      agentId,
      agentVersion: agent.version,
      status: "failed",
      mode: context.mode,
      targetSlug: parsed.targetSlug,
      errors: [`affiliate-economics-leak:${leaks.join(",")}`],
      startedAt,
      completedAt: nowIso(),
      dryRun: Boolean(options.dryRun),
    });
    if (options.persist !== false) saveAgentExecution(execution);
    emitAgentEvent("agent_task_failed", { executionId, errors: execution.errors });
    return { execution, readiness: agent.canRun(context) };
  }

  const readiness = agent.canRun(context);

  if (options.dryRun) {
    const brief = readiness.status === "READY" || readiness.status === "REVIEW_REQUIRED"
      ? agent.buildBrief(context)
      : undefined;
    const preview: DryRunPreview = {
      agentId,
      agentVersion: agent.version,
      targetSlug: parsed.targetSlug,
      readiness,
      mode: context.mode,
      primaryIntent: agent.primaryIntent,
      contextInputs: {
        factCount: context.facts.length,
        assessmentCount: context.editorialAssessments.length,
        relationshipCount: context.relationships.length,
        rankingCount: context.approvedRanking.length,
        methodology: context.methodology
          ? `${context.methodology.slug}@${context.methodology.version}`
          : undefined,
        pricingVerified: context.pricingSummary?.verified,
      },
      expectedOutputType: `${agent.pageType}-draft`,
      promptTemplateId: brief?.promptTemplateId,
    };
    const execution = AgentExecutionResultSchema.parse({
      id: executionId,
      agentId,
      agentVersion: agent.version,
      status: readiness.status === "BLOCKED" ? "blocked" : "completed",
      mode: context.mode,
      targetSlug: parsed.targetSlug,
      errors:
        readiness.status === "BLOCKED"
          ? readiness.reasons.map((r) => `${r.code}: ${r.message}`)
          : [],
      contextSnapshot: context.snapshot,
      dryRun: true,
      startedAt,
      completedAt: nowIso(),
    });
    return { execution, readiness, dryRunPreview: preview };
  }

  if (readiness.status === "BLOCKED") {
    const execution = AgentExecutionResultSchema.parse({
      id: executionId,
      agentId,
      agentVersion: agent.version,
      status: "blocked",
      mode: context.mode,
      targetSlug: parsed.targetSlug,
      errors: readiness.reasons.map((r) => `${r.code}: ${r.message}`),
      contextSnapshot: context.snapshot,
      dryRun: false,
      startedAt,
      completedAt: nowIso(),
    });
    if (options.persist !== false) saveAgentExecution(execution);
    emitAgentEvent("agent_task_blocked", {
      executionId,
      reasons: readiness.reasons,
    });
    return { execution, readiness };
  }

  if (agentId === "qa-agent") {
    const execution = AgentExecutionResultSchema.parse({
      id: executionId,
      agentId,
      agentVersion: agent.version,
      status: "failed",
      mode: context.mode,
      targetSlug: parsed.targetSlug,
      errors: ["Use agent:qa -- <draft-id> instead of agent:run qa"],
      startedAt,
      completedAt: nowIso(),
    });
    return { execution, readiness };
  }

  const profile = resolveProviderProfile(
    agentId,
    options.providerProfileId as never,
  );
  void profile;

  try {
    const brief = agent.buildBrief(context);
    const bundle = await agent.execute(brief, context);
    const validation = agent.validate(bundle, context);
    const qa = options.skipQa
      ? undefined
      : runQa(bundle, context, {
          briefRequiredSections: brief.requiredSections,
        });

    if (options.persist !== false) {
      saveAgentDraftBundle(bundle);
    }

    emitAgentEvent("agent_draft_created", {
      draftId: bundle.draft.id,
      agentId,
      agentVersion: agent.version,
    });

    const status =
      qa?.status === "fail"
        ? "qa-failed"
        : validation.ok
          ? "completed"
          : "failed";

    const execution = AgentExecutionResultSchema.parse({
      id: executionId,
      agentId,
      agentVersion: agent.version,
      status,
      mode: context.mode,
      targetSlug: parsed.targetSlug,
      draftId: bundle.draft.id,
      briefId: brief.id,
      validation,
      qa,
      errors: validation.ok ? [] : validation.errors,
      cost: {
        provider: bundle.extension.generationProvider,
        model: profile.modelKey,
        inputTokens: 0,
        outputTokens: 0,
        estimatedCostUsd: 0,
      },
      contextSnapshot: context.snapshot,
      dryRun: false,
      startedAt,
      completedAt: nowIso(),
    });

    if (options.persist !== false) saveAgentExecution(execution);
    emitAgentEvent(
      status === "completed" ? "agent_task_completed" : "agent_task_failed",
      { executionId, status, draftId: bundle.draft.id },
    );
    return { execution, readiness, bundle };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const execution = AgentExecutionResultSchema.parse({
      id: executionId,
      agentId,
      agentVersion: agent.version,
      status: "failed",
      mode: context.mode,
      targetSlug: parsed.targetSlug,
      errors: [message],
      startedAt,
      completedAt: nowIso(),
    });
    if (options.persist !== false) saveAgentExecution(execution);
    emitAgentEvent("agent_task_failed", { executionId, message });
    return { execution, readiness };
  }
}

export async function runAgentTask(
  task: AgentRunTask,
  options: RunAgentOptions = {},
): Promise<RunAgentResult> {
  if (task.status === "BLOCKED" || task.status === "WAITING") {
    const startedAt = nowIso();
    const execution = AgentExecutionResultSchema.parse({
      id: `exec-task-${task.id}-${Date.now()}`,
      taskId: task.id,
      agentId: task.agentId,
      agentVersion: getContentAgent(task.agentId).version,
      status: "blocked",
      mode: task.mode,
      targetSlug: task.targetSlug ?? task.productIds[0] ?? "unknown",
      errors: [task.statusReason ?? `Task status ${task.status}`],
      startedAt,
      completedAt: nowIso(),
      dryRun: Boolean(options.dryRun),
    });
    return {
      execution,
      readiness: {
        status: "BLOCKED",
        reasons: [
          {
            code: "TASK_NOT_READY",
            message: task.statusReason ?? task.status,
            critical: true,
          },
        ],
        missingDependencies: task.dependencies,
      },
    };
  }

  const target =
    task.targetSlug ??
    (task.agentId === "comparison-agent" && task.productIds.length >= 2
      ? [...task.productIds].sort().join("-vs-")
      : task.productIds[0] ?? task.categoryIds[0] ?? "unknown");

  const result = await runContentAgent(task.agentId, target, {
    ...options,
    mode: task.mode,
  });
  result.execution = {
    ...result.execution,
    taskId: task.id,
  };
  if (options.persist !== false) saveAgentExecution(result.execution);
  return result;
}

/**
 * Mark draft stale when critical snapshot inputs changed.
 */
export function detectStaleDraft(
  snapshotFactIds: string[],
  currentFactIds: string[],
): { stale: boolean; reasons: string[] } {
  const prev = new Set(snapshotFactIds);
  const curr = new Set(currentFactIds);
  const reasons: string[] = [];
  for (const id of curr) {
    if (!prev.has(id) && /pricing|plans/i.test(id)) {
      reasons.push(`new-critical-fact:${id}`);
    }
  }
  for (const id of prev) {
    if (!curr.has(id) && /pricing|plans/i.test(id)) {
      reasons.push(`removed-critical-fact:${id}`);
    }
  }
  return { stale: reasons.length > 0, reasons };
}
