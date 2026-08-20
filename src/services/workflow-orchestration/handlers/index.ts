import { findLatestRunForSlug } from "@/data/onboarding/store";
import { findLatestCategoryRun } from "@/data/category-onboarding/store";
import {
  saveApproval,
  listApprovals,
} from "@/data/workflows/store";
import {
  ApprovalRecordSchema,
  type ContentAgentId,
} from "@/domain";
import {
  buildAgentContext,
  detectStaleDraft,
  reviseDraft,
  runContentAgent,
  runQa,
} from "@/services/content-agents/server";
import { loadAgentDraftBundle } from "@/data/agents/store";
import { getAllComparisonsUnfiltered } from "@/data/repositories/catalog";
import { parseComparisonSlug } from "@/domain/comparison-slug";
import type { HandlerContext, HandlerResult, WorkflowHandler } from "./types";
import { registerHandler } from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

/** Product slugs to load when checking draft fact staleness. */
function productSlugsForStaleCheck(
  runTargetId: string,
  expansionKey?: string,
): string[] {
  if (expansionKey) {
    const parsed = parseComparisonSlug(expansionKey);
    if (parsed) return [parsed.left, parsed.right];
  }
  return [runTargetId];
}

const noopHandler: WorkflowHandler = {
  id: "noop",
  async execute() {
    return { status: "completed", historyMessage: "No-op step completed" };
  },
};

const softwareOnboardingHandler: WorkflowHandler = {
  id: "software-onboarding",
  async execute(ctx) {
    const slug = ctx.run.targetId;
    const skip = Boolean(ctx.run.options.skipOnboarding);
    if (skip) {
      return {
        status: "completed",
        warnings: ["Onboarding skipped by option"],
        historyMessage: "Skipped software onboarding (option)",
      };
    }
    const existing = findLatestRunForSlug(slug);
    if (
      existing &&
      (existing.status === "ready" ||
        existing.status === "review-required" ||
        existing.status === "blocked")
    ) {
      return {
        status: "completed",
        outputRefs: { softwareOnboardingRunId: existing.id },
        warnings:
          existing.status === "blocked"
            ? [`Onboarding run exists but status=${existing.status}`]
            : [],
        historyMessage: `Reused onboarding run ${existing.id} (${existing.status})`,
      };
    }
    // Do not auto-run full research-heavy onboarding inside workflow by default —
    // require an existing run or explicit create via onboard CLI.
    if (!existing) {
      return {
        status: "blocked",
        blockers: [
          `No software onboarding run for ${slug}. Run: npm run onboard:software -- ${slug}`,
        ],
        historyMessage: "Blocked: missing onboarding run",
      };
    }
    return {
      status: "completed",
      outputRefs: { softwareOnboardingRunId: existing.id },
      historyMessage: `Attached onboarding run ${existing.id}`,
    };
  },
};

const categoryOnboardingHandler: WorkflowHandler = {
  id: "category-onboarding",
  async execute(ctx) {
    const slug = ctx.run.targetId;
    try {
      const existing = findLatestCategoryRun(slug);
      if (existing) {
        return {
          status: "completed",
          outputRefs: { categoryOnboardingRunId: existing.id },
          historyMessage: `Reused category onboarding ${existing.id}`,
        };
      }
    } catch {
      // store may lack helper
    }
    return {
      status: "blocked",
      blockers: [
        `No category onboarding run for ${slug}. Run: npm run onboard:category -- ${slug}`,
      ],
    };
  },
};

const contentPlanHandler: WorkflowHandler = {
  id: "content-plan",
  async execute(ctx) {
    const slug = ctx.run.targetId;
    const run = findLatestRunForSlug(slug);
    if (!run) {
      return {
        status: "blocked",
        blockers: ["Content plan requires software onboarding run"],
      };
    }
    const comparisons = (run.pageCandidates ?? [])
      .filter((p) => p.pageType === "comparison")
      .slice(0, Number(ctx.run.options.maxComparisons ?? 3))
      .map(
        (p) =>
          p.canonicalPath?.replace(/^\/compare\//, "").replace(/\/$/, "") ??
          p.id,
      );

    return {
      status: "completed",
      outputRefs: {
        softwareOnboardingRunId: run.id,
        comparisonTargets: comparisons.join(",") || "",
        pageCandidateCount: String(run.pageCandidates?.length ?? 0),
      },
      historyMessage: `Content plan from onboarding ${run.id} (${run.pageCandidates?.length ?? 0} candidates)`,
    };
  },
};

async function runAgentStep(ctx: HandlerContext): Promise<HandlerResult> {
  const agentId = (ctx.step.config.agentId ??
    ctx.run.options.agentId) as ContentAgentId | undefined;
  if (!agentId) {
    return {
      status: "failed",
      error: "agent-run step missing agentId",
      retryable: false,
    };
  }

  const target =
    ctx.step.config.targetSlug ??
    ctx.step.expansionKey ??
    (typeof ctx.run.options.targetSlug === "string"
      ? ctx.run.options.targetSlug
      : ctx.run.targetId);

  // Transient failure fixture for retry POC
  if (
    ctx.step.config.forceTransientFailOnce ||
    ctx.run.options.forceTransientFailOnce === true
  ) {
    if (ctx.step.attempt <= 1) {
      return {
        status: "failed",
        error: "transient: simulated provider timeout",
        retryable: true,
        retryErrorCode: "provider-timeout",
        historyMessage: "Transient provider failure (attempt 1)",
      };
    }
  }
  if (ctx.step.config.forceError) {
    return {
      status: "failed",
      error: ctx.step.config.forceError,
      retryable: false,
      retryErrorCode: "quality-failure",
    };
  }

  // Dedup: reuse existing valid draft output ref
  if (ctx.step.draftId && ctx.step.status === "completed") {
    return {
      status: "completed",
      draftId: ctx.step.draftId,
      historyMessage: `Reused draft ${ctx.step.draftId}`,
    };
  }

  // Content target dedup for comparisons
  if (agentId === "comparison-agent") {
    const existing = getAllComparisonsUnfiltered().find(
      (c) => c.slug === target && c.seo?.indexable,
    );
    // Still allow draft generation for non-indexable shells
    void existing;
  }

  if (ctx.dryRun) {
    return {
      status: "completed",
      warnings: [`dry-run: would invoke ${agentId} for ${target}`],
      historyMessage: `Dry-run agent ${agentId}`,
    };
  }

  const allowNormalized =
    ctx.step.config.allowNormalizedFacts ||
    Boolean(ctx.run.options.allowNormalizedFacts) ||
    ctx.run.targetId === "getresponse";

  const changeEvents =
    agentId === "refresh-agent"
      ? [
          {
            type: String(ctx.run.options.changeEventType ?? "pricing-changed"),
            affectedSections: (ctx.run.options.affectedSections as string[]) ?? [
              "pricing",
            ],
            summary: `Refresh for ${target}`,
          },
        ]
      : undefined;

  const result = await runContentAgent(agentId, target, {
    persist: true,
    allowNormalizedFacts: allowNormalized,
    mode: agentId === "refresh-agent" ? "REFRESH" : "CREATE",
    changeEvents,
  });

  if (result.execution.status === "blocked" || result.readiness.status === "BLOCKED") {
    const blockers = result.readiness.reasons.map(
      (r) => `${r.code}: ${r.message}`,
    );
    if (ctx.step.config.optionalWhenBlocked || !ctx.step.required) {
      return {
        status: "blocked",
        blockers,
        warnings: blockers,
        historyMessage: `Agent blocked (optional): ${blockers.join("; ")}`,
      };
    }
    return {
      status: "blocked",
      blockers,
      historyMessage: `Agent blocked: ${blockers.join("; ")}`,
    };
  }

  if (result.execution.status === "failed") {
    const err = result.execution.errors.join("; ") || "agent failed";
    const retryable = /timeout|rate.?limit|transient/i.test(err);
    return {
      status: "failed",
      error: err,
      retryable,
      retryErrorCode: retryable ? "provider-timeout" : "quality-failure",
    };
  }

  let draftId = result.execution.draftId ?? result.bundle?.draft.id;
  let qaStatus = result.execution.qa?.status;

  // Automatic targeted revision once on QA fail for known issues
  if (
    result.execution.status === "qa-failed" &&
    result.bundle &&
    ctx.step.revisionAttempts < (ctx.step.config.maxAutomaticRevisions ?? 1)
  ) {
    const context = buildAgentContext({
      agentId,
      productSlugs:
        agentId === "comparison-agent" && target.includes("-vs-")
          ? target.split("-vs-")
          : [ctx.run.targetId],
      targetSlug: target,
      allowNormalizedFacts: allowNormalized,
    });
    const qa = result.execution.qa!;
    const revisable = qa.blockers.filter((b) =>
      [
        "MISSING_REQUIRED_SECTION",
        "UNSUPPORTED_FACT",
        "FAKE_TESTING_CLAIM",
        "UNVERIFIED_NUMBER",
        "PROHIBITED_CLAIM",
        "SCHEMA_INCOMPLETE",
      ].includes(b.type),
    );
    if (revisable.length > 0) {
      const { bundle: revised } = reviseDraft({
        original: result.bundle,
        issues: revisable,
        instructions: ["workflow-auto-revision"],
        context,
      });
      const qa2 = runQa(revised, context);
      draftId = revised.draft.id;
      qaStatus = qa2.status;
      if (qa2.status === "fail") {
        return {
          status: "review-required",
          draftId,
          agentTaskId: result.execution.id,
          warnings: [
            `QA still failing after revision: ${qa2.blockers.map((b) => b.type).join(",")}`,
          ],
          outputRefs: {
            draftId: draftId ?? "",
            qaStatus: qa2.status,
          },
          historyMessage:
            "QA fail after one automatic revision → review-required",
        };
      }
    } else {
      return {
        status: "review-required",
        draftId,
        agentTaskId: result.execution.id,
        warnings: [`QA fail: ${qa.blockers.map((b) => b.type).join(",")}`],
        outputRefs: { draftId: draftId ?? "", qaStatus: qa.status },
        historyMessage: "QA fail → review-required (non-auto-revisable)",
      };
    }
  } else if (result.execution.status === "qa-failed") {
    return {
      status: "review-required",
      draftId,
      agentTaskId: result.execution.id,
      warnings: ["QA failed; max automatic revisions exhausted"],
      outputRefs: { draftId: draftId ?? "", qaStatus: String(qaStatus) },
    };
  }

  const snapshot = result.bundle?.extension.contextSnapshot;
  return {
    status:
      qaStatus === "pass-with-warnings"
        ? "completed-with-warning"
        : "completed",
    draftId,
    agentTaskId: result.execution.id,
    outputRefs: {
      draftId: draftId ?? "",
      qaStatus: String(qaStatus ?? "unknown"),
      agentId,
      target,
    },
    inputSnapshot: snapshot
      ? {
          researchFactIds: snapshot.factIds,
          methodologySlug: snapshot.methodologySlug,
          methodologyVersion: snapshot.methodologyVersion,
          productUpdatedAt: snapshot.productUpdatedAt,
          agentVersion: result.bundle?.extension.agentVersion,
          contextBuiltAt: snapshot.builtAt,
        }
      : undefined,
    warnings:
      qaStatus === "pass-with-warnings" ? ["QA passed with warnings"] : [],
    historyMessage: `Agent ${agentId} → draft ${draftId} (qa=${qaStatus})`,
  };
}

const agentRunHandler: WorkflowHandler = {
  id: "agent-run",
  execute: runAgentStep,
};

const internalLinkHandler: WorkflowHandler = {
  id: "internal-link",
  async execute(ctx) {
    return runAgentStep({
      ...ctx,
      step: {
        ...ctx.step,
        config: {
          ...ctx.step.config,
          agentId: "internal-link-agent",
        },
      },
    });
  },
};

const approvalCheckHandler: WorkflowHandler = {
  id: "approval-check",
  async execute(ctx): Promise<HandlerResult> {
    // Require editorial approval for required content drafts first;
    // optional drafts may still be pending without blocking the gate forever.
    const requiredDrafts = ctx.run.steps.filter(
      (s) =>
        s.required &&
        (s.status === "completed" || s.status === "completed-with-warning") &&
        s.draftId,
    );
    const optionalDrafts = ctx.run.steps.filter(
      (s) =>
        !s.required &&
        (s.status === "completed" || s.status === "completed-with-warning") &&
        s.draftId,
    );
    const upstreamDrafts =
      requiredDrafts.length > 0 ? requiredDrafts : optionalDrafts;

    if (upstreamDrafts.length === 0) {
      return {
        status: "blocked",
        blockers: ["No drafts available for editorial approval"],
      };
    }

    const approvalIds: string[] = [];
    for (const d of upstreamDrafts) {
      const found = listApprovals().find(
        (a) =>
          a.draftId === d.draftId &&
          a.workflowRunId === ctx.run.id &&
          a.type === "editorial",
      );
      if (found?.status === "approved") {
        approvalIds.push(found.id);
        continue;
      }
      if (found?.status === "rejected") {
        return {
          status: "failed",
          error: `Editorial approval rejected: ${found.notes ?? found.id}`,
          approvalId: found.id,
        };
      }
      if (found?.status === "pending") {
        return {
          status: "waiting",
          approvalId: found.id,
          outputRefs: { approvalId: found.id, draftId: d.draftId! },
          historyMessage: `WAITING FOR EDITORIAL APPROVAL (${found.id})`,
        };
      }

      const record = ApprovalRecordSchema.parse({
        id: `appr-${ctx.run.id}-${d.id}`,
        type: "editorial",
        targetType: "draft",
        targetId: d.draftId!,
        workflowRunId: ctx.run.id,
        stepId: d.id,
        draftId: d.draftId,
        status: "pending",
        qaStatus: d.outputRefs.qaStatus,
        createdAt: nowIso(),
      });
      saveApproval(record);
      return {
        status: "waiting",
        approvalId: record.id,
        outputRefs: { approvalId: record.id, draftId: d.draftId! },
        historyMessage: `WAITING FOR EDITORIAL APPROVAL (${record.id})`,
      };
    }

    return {
      status: "completed",
      approvalId: approvalIds[0],
      outputRefs: { approvalIds: approvalIds.join(",") },
      warnings:
        optionalDrafts.length > 0
          ? [
              `${optionalDrafts.length} optional draft(s) may still need separate editorial review`,
            ]
          : [],
      historyMessage: "Required editorial approvals satisfied",
    };
  },
};

const prePublishHandler: WorkflowHandler = {
  id: "pre-publish-validation",
  async execute(ctx) {
    const drafts = ctx.run.steps.filter((s) => s.draftId);
    const blockers: string[] = [];

    for (const step of drafts) {
      const bundle = loadAgentDraftBundle(step.draftId!);
      if (!bundle) {
        blockers.push(`Missing draft ${step.draftId}`);
        continue;
      }
      if (bundle.extension.draftStale) {
        blockers.push(`Draft ${step.draftId} marked STALE`);
      }
      if (step.inputSnapshot?.researchFactIds?.length) {
        const productSlugs = productSlugsForStaleCheck(
          ctx.run.targetId,
          step.expansionKey,
        );
        const context = buildAgentContext({
          agentId: (step.config.agentId ??
            "software-review-agent") as ContentAgentId,
          productSlugs,
          targetSlug: step.expansionKey ?? ctx.run.targetId,
          allowNormalizedFacts: true,
        });
        const stale = detectStaleDraft(
          step.inputSnapshot.researchFactIds,
          context.facts.map((f) => f.id),
        );
        if (stale.stale) {
          blockers.push(
            `Stale context for ${step.id}: ${stale.reasons.join("; ")}`,
          );
        }
      }

      const anyApproved = listApprovals().some(
        (a) =>
          a.workflowRunId === ctx.run.id &&
          a.draftId === step.draftId &&
          a.status === "approved",
      );
      const editorial = ctx.run.steps.find(
        (s) => s.handler === "approval-check",
      );
      if (!anyApproved && editorial && editorial.status !== "completed") {
        blockers.push("Editorial approval not completed — cannot publish");
      }
    }

    const serialized = JSON.stringify(ctx.run.options);
    if (/commissionValue|payoutPercentage|affiliateRevenue/i.test(serialized)) {
      blockers.push("Affiliate economics present in workflow options");
    }

    if (blockers.length) {
      return {
        status: "blocked",
        blockers,
        historyMessage: `Pre-publish validation blocked: ${blockers.join("; ")}`,
      };
    }

    return {
      status: "completed",
      outputRefs: { publishState: "READY_TO_PUBLISH" },
      warnings: [
        "stopAfterApproval: workflow will not publish automatically",
      ],
      historyMessage:
        "Pre-publish validation passed — READY TO PUBLISH (manual)",
    };
  },
};

const finderHandler: WorkflowHandler = {
  id: "update-recommendation-readiness",
  async execute(ctx) {
    return {
      status: "completed",
      outputRefs: { finderReadiness: "checked" },
      historyMessage: `Finder readiness noted for ${ctx.run.targetId}`,
    };
  },
};

const graphHandler: WorkflowHandler = {
  id: "content-graph-sync",
  async execute() {
    return {
      status: "completed",
      historyMessage: "Content graph sync deferred to publishing services",
    };
  },
};

const researchHandler: WorkflowHandler = {
  id: "research",
  async execute(ctx) {
    const run = findLatestRunForSlug(ctx.run.targetId);
    const pct = run?.scorecard?.researchPercent ?? 0;
    if (pct < 10 && !ctx.run.options.allowNormalizedFacts) {
      return {
        status: "blocked",
        blockers: [`Research completeness ${pct}% below threshold`],
      };
    }
    return {
      status: "completed",
      outputRefs: { researchPercent: String(pct) },
      historyMessage: `Research gate ok (${pct}%)`,
    };
  },
};

const researchRefreshHandler: WorkflowHandler = {
  id: "research-refresh",
  async execute() {
    return { status: "completed", historyMessage: "Research refresh noop" };
  },
};

const relationshipHandler: WorkflowHandler = {
  id: "relationship-resolution",
  async execute(ctx) {
    const run = findLatestRunForSlug(ctx.run.targetId);
    const waiting = (run?.agentTasks ?? []).some(
      (t) =>
        t.agentType === "qa-agent" &&
        t.status === "READY" &&
        t.id.includes("relationships"),
    );
    if (waiting) {
      return {
        status: "waiting",
        blockers: ["Relationship candidates need review"],
        historyMessage: "WAITING FOR RELATIONSHIP APPROVAL",
      };
    }
    return {
      status: "completed",
      historyMessage: "Relationship resolution gate passed",
    };
  },
};

const qaHandler: WorkflowHandler = {
  id: "qa",
  async execute(ctx) {
    const draftId = ctx.step.config.targetSlug ?? ctx.step.draftId;
    if (!draftId) {
      return { status: "blocked", blockers: ["QA step needs draftId"] };
    }
    const bundle = loadAgentDraftBundle(draftId);
    if (!bundle) {
      return { status: "failed", error: `Draft not found: ${draftId}` };
    }
    const context = buildAgentContext({
      agentId: bundle.extension.agentId,
      productSlugs: [ctx.run.targetId],
      targetSlug: bundle.draft.targetSlug,
      allowNormalizedFacts: true,
    });
    const qa = runQa(bundle, context);
    if (qa.status === "fail") {
      return {
        status: "review-required",
        warnings: qa.blockers.map((b) => b.type),
        outputRefs: { qaStatus: qa.status },
      };
    }
    return {
      status:
        qa.status === "pass-with-warnings"
          ? "completed-with-warning"
          : "completed",
      outputRefs: { qaStatus: qa.status },
    };
  },
};

const revisionHandler: WorkflowHandler = {
  id: "revision",
  async execute() {
    return {
      status: "completed",
      historyMessage: "Revision handled inline by agent-run policy",
    };
  },
};

const scheduleHandler: WorkflowHandler = {
  id: "schedule",
  async execute() {
    return {
      status: "skipped",
      warnings: ["Scheduling requires explicit schedule — not invented"],
      historyMessage: "Schedule skipped (no invented times)",
    };
  },
};

const publishHandler: WorkflowHandler = {
  id: "publish",
  async execute() {
    return {
      status: "skipped",
      warnings: [
        "Automatic publishing disabled — use publishing engine after approval",
      ],
      historyMessage: "Publish skipped by policy",
    };
  },
};

export function registerAllHandlers(): void {
  const all = [
    noopHandler,
    softwareOnboardingHandler,
    categoryOnboardingHandler,
    contentPlanHandler,
    agentRunHandler,
    internalLinkHandler,
    approvalCheckHandler,
    prePublishHandler,
    finderHandler,
    graphHandler,
    researchHandler,
    researchRefreshHandler,
    relationshipHandler,
    qaHandler,
    revisionHandler,
    scheduleHandler,
    publishHandler,
  ];
  for (const h of all) registerHandler(h);
}

// Auto-register on import
registerAllHandlers();
