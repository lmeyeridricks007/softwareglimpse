import {
  __resetDataCaches,
  getCategoryBySlug,
} from "@/data";
import {
  findCategoryDefinitionSeedByName,
  getCategoryDefinitionSeed,
} from "@/data/category-onboarding/seed";
import {
  activateCategoryDefinition,
  loadCategoryOnboardingRun,
  saveCategoryOnboardingRun,
} from "@/data/category-onboarding/store";
import {
  CATEGORY_ONBOARDING_STAGE_ORDER,
  CategoryOnboardingRequestSchema,
  CategoryOnboardingRunSchema,
  categoryOnboardingRunId,
  type CategoryDefinition,
  type CategoryIssue,
  type CategoryOnboardingRequest,
  type CategoryOnboardingRun,
  type CategoryOnboardingStageId,
  type CategoryStageResult,
} from "@/domain";
import { recordChangeEvent } from "@/services/publishing/change-events";
import {
  buildCategoryAgentContext,
  buildCategoryAgentTasks,
} from "./agent-context";
import { buildCategoryContentArchitecture, supportingKnowledgePlanForCategory } from "./content-architecture";
import { planCategoryKnowledge, saveCategoryKnowledgePlan } from "@/services/knowledge-planners";
import {
  checkDuplicateCategory,
  resolveCategorySlug,
} from "./duplicates";
import { classifyMemberships } from "./membership";
import { buildCategoryScorecard } from "./scorecard";
import { validateCategoryDefinition } from "./validate";

export type OnboardCategoryOptions = {
  resumeRunId?: string;
};

function nowIso(): string {
  return new Date().toISOString();
}

function logEvent(event: string, payload: Record<string, unknown>): void {
  console.info(`[category-onboarding] ${event}`, JSON.stringify(payload));
}

function stageResult(
  stageId: CategoryOnboardingStageId,
  status: CategoryStageResult["status"],
  summary?: string,
  data: Record<string, unknown> = {},
  issues: CategoryIssue[] = [],
): CategoryStageResult {
  const ts = nowIso();
  return {
    stageId,
    status,
    startedAt: ts,
    completedAt: status === "running" ? undefined : ts,
    summary,
    issues,
    data,
  };
}

function upsertStage(
  run: CategoryOnboardingRun,
  result: CategoryStageResult,
): void {
  const idx = run.stages.findIndex((s) => s.stageId === result.stageId);
  if (idx >= 0) run.stages[idx] = result;
  else run.stages.push(result);
}

function stageDone(
  run: CategoryOnboardingRun,
  stageId: CategoryOnboardingStageId,
): boolean {
  const s = run.stages.find((x) => x.stageId === stageId);
  return s?.status === "completed" || s?.status === "skipped";
}

function addIssue(run: CategoryOnboardingRun, issue: CategoryIssue): void {
  if (run.issues.some((i) => i.code === issue.code && i.message === issue.message))
    return;
  run.issues.push(issue);
}

function persist(run: CategoryOnboardingRun, dryRun: boolean): void {
  run.updatedAt = nowIso();
  if (dryRun) return;
  saveCategoryOnboardingRun(CategoryOnboardingRunSchema.parse(run));
}

/**
 * Programmatic category onboarding / reconcile.
 */
export async function onboardCategory(
  rawRequest: CategoryOnboardingRequest,
  options: OnboardCategoryOptions = {},
): Promise<CategoryOnboardingRun> {
  const request = CategoryOnboardingRequestSchema.parse(rawRequest);
  const dryRun = request.options?.dryRun ?? false;
  const resumeId =
    options.resumeRunId ?? request.options?.resumeRunId ?? undefined;

  let run: CategoryOnboardingRun;
  if (resumeId) {
    const existing = loadCategoryOnboardingRun(resumeId);
    if (!existing) throw new Error(`Category onboarding run not found: ${resumeId}`);
    run = existing;
    run.request = {
      ...request,
      options: { ...request.options, dryRun },
    };
    logEvent("category_onboarding_resumed", { runId: run.id });
  } else {
    const slug = resolveCategorySlug(request.name, request.slug);
    run = CategoryOnboardingRunSchema.parse({
      id: categoryOnboardingRunId(slug),
      categorySlug: slug,
      request,
      mode: request.options?.reconcile ? "reconcile" : "new",
      status: "created",
      stages: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    logEvent("category_onboarding_started", {
      runId: run.id,
      name: request.name,
      source: request.source,
    });
  }

  try {
    await executeStages(run, dryRun);
  } catch (err) {
    run.status = "failed";
    const message = err instanceof Error ? err.message : String(err);
    addIssue(run, {
      code: "SCOPE_UNDEFINED",
      severity: "blocker",
      message,
    });
    upsertStage(run, stageResult("onboarding-summary", "failed", message));
    persist(run, dryRun);
    return run;
  }

  persist(run, dryRun);
  return run;
}

async function executeStages(
  run: CategoryOnboardingRun,
  dryRun: boolean,
): Promise<void> {
  const slug = run.categorySlug ?? resolveCategorySlug(run.request.name, run.request.slug);
  run.categorySlug = slug;

  // 1. intake
  if (!stageDone(run, "intake")) {
    run.status = "validating";
    upsertStage(
      run,
      stageResult(
        "intake",
        "completed",
        `Intake for ${run.request.name} (${run.request.source})`,
      ),
    );
    persist(run, dryRun);
  }

  // 2. identity + load definition
  let definition: CategoryDefinition | undefined =
    getCategoryDefinitionSeed(slug) ??
    findCategoryDefinitionSeedByName(run.request.name);

  if (!stageDone(run, "identity")) {
    if (!definition) {
      addIssue(run, {
        code: "SCOPE_UNDEFINED",
        severity: "blocker",
        message: `No category definition seed for ${slug}. Add a seed under src/data/category-onboarding/seed/ before onboarding arbitrary labels.`,
        stageId: "identity",
      });
      run.status = "blocked";
      upsertStage(
        run,
        stageResult("identity", "blocked", "No definition seed"),
      );
      persist(run, dryRun);
      return;
    }

    if (run.request.parentCategorySlug) {
      definition = {
        ...definition,
        parentSlug: run.request.parentCategorySlug,
      };
    }

    run.definition = definition;
    upsertStage(
      run,
      stageResult(
        "identity",
        "completed",
        `Identity: ${definition.name} / ${definition.slug} v${definition.configVersion}`,
      ),
    );
    logEvent("category_identity_resolved", { slug, version: definition.configVersion });
    persist(run, dryRun);
  } else {
    definition = run.definition ?? definition;
  }

  if (!definition) {
    run.status = "failed";
    persist(run, dryRun);
    return;
  }

  // 3. duplication
  if (!stageDone(run, "duplication-check")) {
    const dup = checkDuplicateCategory({
      name: definition.name,
      slug: definition.slug,
      parentSlug: definition.parentSlug,
      forceReconcile: run.request.options?.reconcile,
    });
    run.duplicateOutcome = dup.outcome;

    if (dup.outcome === "EXISTING" || run.request.options?.reconcile) {
      run.mode = "reconcile";
      upsertStage(
        run,
        stageResult(
          "duplication-check",
          "completed",
          `${dup.outcome}: reconcile mode — ${dup.reason}`,
        ),
      );
    } else if (
      dup.outcome === "POSSIBLE_DUPLICATE" ||
      dup.outcome === "ALIAS"
    ) {
      addIssue(run, {
        code: "CATEGORY_DUPLICATE",
        severity: "blocker",
        message: dup.reason,
        stageId: "duplication-check",
      });
      run.status = "blocked";
      upsertStage(
        run,
        stageResult("duplication-check", "blocked", dup.reason),
      );
      persist(run, dryRun);
      return;
    } else {
      upsertStage(
        run,
        stageResult("duplication-check", "completed", "NEW category definition"),
      );
    }
    persist(run, dryRun);
  }

  // 4. taxonomy / hierarchy
  if (!stageDone(run, "taxonomy")) {
    run.status = "defining";
    if (definition.parentSlug) {
      const parent = getCategoryBySlug(definition.parentSlug, {
        includeUnpublished: true,
      });
      if (!parent) {
        addIssue(run, {
          code: "PARENT_CATEGORY_MISSING",
          severity: "blocker",
          message: `Parent category missing: ${definition.parentSlug}`,
          stageId: "taxonomy",
        });
        run.status = "blocked";
        upsertStage(
          run,
          stageResult("taxonomy", "blocked", "Parent missing"),
        );
        persist(run, dryRun);
        return;
      }
    }
    const cat = getCategoryBySlug(definition.slug, { includeUnpublished: true });
    upsertStage(
      run,
      stageResult(
        "taxonomy",
        "completed",
        `Parent: ${definition.parentSlug ?? "(root)"}; catalogue entity ${cat ? "present" : "missing (seed/candidate)"}`,
        { parentSlug: definition.parentSlug },
      ),
    );
    persist(run, dryRun);
  }

  // 5. scope
  if (!stageDone(run, "scope-definition")) {
    if (!definition.scope.definition || definition.scope.includes.length === 0) {
      addIssue(run, {
        code: "SCOPE_UNDEFINED",
        severity: "blocker",
        message: "Category scope is incomplete",
        stageId: "scope-definition",
      });
      run.status = "blocked";
      upsertStage(
        run,
        stageResult("scope-definition", "blocked", "Scope incomplete"),
      );
      persist(run, dryRun);
      return;
    }
    upsertStage(
      run,
      stageResult(
        "scope-definition",
        "completed",
        `Includes ${definition.scope.includes.length}; excludes ${definition.scope.excludes.length}`,
      ),
    );
    persist(run, dryRun);
  }

  // 6. features
  if (!stageDone(run, "feature-model")) {
    if (definition.features.length === 0) {
      addIssue(run, {
        code: "NO_FEATURE_MODEL",
        severity: "blocker",
        message: "Feature model empty",
        stageId: "feature-model",
      });
      run.status = "blocked";
      upsertStage(
        run,
        stageResult("feature-model", "blocked", "No features"),
      );
      persist(run, dryRun);
      return;
    }
    upsertStage(
      run,
      stageResult(
        "feature-model",
        "completed",
        `${definition.features.length} canonical features`,
        {
          core: definition.features.filter((f) => f.importance === "core").length,
        },
      ),
    );
    persist(run, dryRun);
  }

  // 7. research model
  if (!stageDone(run, "research-model")) {
    const required = definition.researchRequirements.filter(
      (r) => r.level === "required",
    );
    if (required.length === 0) {
      addIssue(run, {
        code: "NO_RESEARCH_REQUIREMENTS",
        severity: "blocker",
        message: "No required research domains",
        stageId: "research-model",
      });
      run.status = "blocked";
      upsertStage(
        run,
        stageResult("research-model", "blocked", "No research requirements"),
      );
      persist(run, dryRun);
      return;
    }
    upsertStage(
      run,
      stageResult(
        "research-model",
        "completed",
        `${required.length} required research domains`,
      ),
    );
    persist(run, dryRun);
  }

  // 8. editorial methodology
  if (!stageDone(run, "editorial-methodology")) {
    if (definition.editorialMethodology.criteria.length === 0) {
      addIssue(run, {
        code: "NO_EDITORIAL_METHODOLOGY",
        severity: "blocker",
        message: "Editorial methodology missing criteria",
        stageId: "editorial-methodology",
      });
      run.status = "blocked";
      upsertStage(
        run,
        stageResult("editorial-methodology", "blocked", "No methodology"),
      );
      persist(run, dryRun);
      return;
    }
    upsertStage(
      run,
      stageResult(
        "editorial-methodology",
        "completed",
        `${definition.editorialMethodology.slug} v${definition.editorialMethodology.version} (${definition.editorialMethodology.criteria.length} criteria)`,
      ),
    );
    persist(run, dryRun);
  }

  // 9. comparison methodology
  if (!stageDone(run, "comparison-methodology")) {
    if (definition.comparisonCriteria.length === 0) {
      addIssue(run, {
        code: "NO_COMPARISON_METHODOLOGY",
        severity: "blocker",
        message: "Comparison methodology empty",
        stageId: "comparison-methodology",
      });
      run.status = "blocked";
      upsertStage(
        run,
        stageResult("comparison-methodology", "blocked", "No comparison criteria"),
      );
      persist(run, dryRun);
      return;
    }
    const factual = definition.comparisonCriteria.filter(
      (c) => c.kind === "factual",
    ).length;
    const editorial = definition.comparisonCriteria.filter(
      (c) => c.kind === "editorial",
    ).length;
    upsertStage(
      run,
      stageResult(
        "comparison-methodology",
        "completed",
        `${definition.comparisonCriteria.length} criteria (${factual} factual / ${editorial} editorial)`,
      ),
    );
    persist(run, dryRun);
  }

  // 10. pricing
  if (!stageDone(run, "pricing-model")) {
    if (definition.pricingCapability === "UNSUPPORTED") {
      addIssue(run, {
        code: "PRICING_MODEL_UNSUPPORTED",
        severity: "warning",
        message: definition.pricingCapabilityNotes.join("; ") || "Unsupported pricing",
        stageId: "pricing-model",
      });
    } else if (definition.pricingCapability === "PARTIAL") {
      addIssue(run, {
        code: "PRICING_MODEL_UNSUPPORTED",
        severity: "warning",
        message:
          definition.pricingCapabilityNotes.join("; ") ||
          "Partial pricing capability — platform gap recorded",
        stageId: "pricing-model",
      });
    }
    upsertStage(
      run,
      stageResult(
        "pricing-model",
        "completed",
        `Pricing capability: ${definition.pricingCapability}`,
        {
          dimensions: definition.pricingDimensions.map((d) => d.slug),
          notes: definition.pricingCapabilityNotes,
        },
      ),
    );
    persist(run, dryRun);
  }

  // 11. recommendation / finder
  if (!stageDone(run, "recommendation-model")) {
    upsertStage(
      run,
      stageResult(
        "recommendation-model",
        "completed",
        `Finder readiness: ${definition.finderReadiness}`,
        { dimensions: definition.recommendationDimensions.map((d) => d.slug) },
      ),
    );
    persist(run, dryRun);
  }

  // 12. content model
  if (!stageDone(run, "content-model")) {
    // membership needed first — classify early for content
    const memberships = classifyMemberships(
      definition,
      run.request.seedProductSlugs,
    );
    run.memberships = memberships;
    const content = buildCategoryContentArchitecture({
      definition,
      memberships,
    });
    run.contentCandidates = content;
    const knowledgePlan = supportingKnowledgePlanForCategory(definition.slug);
    if (knowledgePlan) {
      run.supportingKnowledgePlan = knowledgePlan;
    }
    // First-class CategoryKnowledgePlanner — plan only, do not execute guides
    try {
      const fullPlan = planCategoryKnowledge(definition.slug);
      if (!dryRun) saveCategoryKnowledgePlan(fullPlan);
      upsertStage(
        run,
        stageResult(
          "content-model",
          "completed",
          `${content.length} content candidates; knowledge plan CORE=${fullPlan.summary.coreCount} new-page=${fullPlan.summary.newPageCount} rejected=${fullPlan.summary.rejectedCount} (guides not executed)`,
          {
            supportingKnowledgePlan: knowledgePlan,
            categoryKnowledgePlanId: fullPlan.id,
            knowledgeSummary: fullPlan.summary,
          },
        ),
      );
    } catch (e) {
      upsertStage(
        run,
        stageResult(
          "content-model",
          "completed",
          `${content.length} content candidates` +
            (knowledgePlan
              ? `; supporting knowledge plan ${knowledgePlan.readyCount}/${knowledgePlan.candidateCount} ready (not executed)`
              : ""),
          knowledgePlan
            ? { supportingKnowledgePlan: knowledgePlan }
            : {},
          [
            {
              code: "KNOWLEDGE_PLAN_PARTIAL",
              severity: "warning",
              message: e instanceof Error ? e.message : String(e),
              stageId: "content-model",
            },
          ],
        ),
      );
    }
    persist(run, dryRun);
  }

  // 13. tool readiness
  if (!stageDone(run, "tool-readiness")) {
    if (definition.finderReadiness === "NOT_READY") {
      addIssue(run, {
        code: "NO_TOOL_SUPPORT",
        severity: "warning",
        message: "No finder/tool support yet — does not block category activation",
        stageId: "tool-readiness",
      });
    }
    upsertStage(
      run,
      stageResult(
        "tool-readiness",
        "completed",
        `Finder ${definition.finderReadiness}; pricing ${definition.pricingCapability}`,
      ),
    );
    persist(run, dryRun);
  }

  // 14. membership (if not filled)
  if (!stageDone(run, "membership")) {
    if (run.memberships.length === 0) {
      run.memberships = classifyMemberships(
        definition,
        run.request.seedProductSlugs,
      );
    }
    const uncertain = run.memberships.filter((m) => m.role === "uncertain");
    if (uncertain.length) {
      addIssue(run, {
        code: "LOW_PRODUCT_COVERAGE",
        severity: "warning",
        message: `Uncertain memberships: ${uncertain.map((m) => m.productSlug).join(", ")}`,
        stageId: "membership",
      });
    }
    const primaryInCat = run.memberships.filter(
      (m) => m.role === "primary" && m.existsInCatalogue,
    );
    if (
      primaryInCat.length < definition.coverageThresholds.hubMinProducts
    ) {
      addIssue(run, {
        code: "INSUFFICIENT_PRODUCT_COVERAGE",
        severity: "warning",
        message: `Only ${primaryInCat.length} primary catalogue products — hub/best publication gated`,
        stageId: "membership",
      });
    }
    upsertStage(
      run,
      stageResult(
        "membership",
        "completed",
        `Primary ${run.memberships.filter((m) => m.role === "primary").length}; secondary ${run.memberships.filter((m) => m.role === "secondary").length}; adjacent ${run.memberships.filter((m) => m.role === "adjacent").length}`,
      ),
    );
    persist(run, dryRun);
  }

  // Agent context + tasks
  const agentContext = buildCategoryAgentContext(definition);
  run.agentContext = agentContext;
  run.agentTasks = buildCategoryAgentTasks({
    definition,
    contentCandidates: run.contentCandidates,
    contextRef: agentContext.contextRef,
  });

  // 15. validation
  if (!stageDone(run, "validation")) {
    const defIssues = validateCategoryDefinition(definition);
    for (const issue of defIssues.filter((i) => i.severity === "error")) {
      addIssue(run, {
        code:
          issue.code === "invalid-weights"
            ? "INVALID_WEIGHTS"
            : issue.code === "taxonomy-cycle"
              ? "TAXONOMY_CYCLE"
              : "UNKNOWN_FEATURE_REFERENCE",
        severity: "blocker",
        message: issue.message,
        stageId: "validation",
      });
    }
    for (const issue of defIssues.filter((i) => i.severity === "warning")) {
      addIssue(run, {
        code: "UNKNOWN_FEATURE_REFERENCE",
        severity: "warning",
        message: issue.message,
        stageId: "validation",
      });
    }

    const blockers = run.issues.filter((i) => i.severity === "blocker");
    if (blockers.length) {
      run.status = "blocked";
      upsertStage(
        run,
        stageResult("validation", "blocked", `${blockers.length} blocker(s)`),
      );
      persist(run, dryRun);
      return;
    }
    upsertStage(run, stageResult("validation", "completed", "No blockers"));
    persist(run, dryRun);
  }

  // Activate → flips software onboarding categoryContentReady
  const shouldActivate = run.request.options?.activate !== false;
  if (shouldActivate && !dryRun) {
    activateCategoryDefinition(definition);
    run.activated = true;
    __resetDataCaches();
    try {
      recordChangeEvent({
        id: `chg-category-${definition.slug}-${Date.now()}`,
        entityType: "category",
        entityId: definition.slug,
        domain: "taxonomy",
        changeType: "category-activated",
        source: "category-onboarding",
        severity: "medium",
        details: {
          configVersion: definition.configVersion,
          summary: `Category ${definition.slug} activated v${definition.configVersion}`,
        },
      });
    } catch {
      // change event optional if publishing store unavailable
    }
    logEvent("category_activated", {
      slug: definition.slug,
      version: definition.configVersion,
    });
  } else if (shouldActivate && dryRun) {
    run.activated = false;
  }

  // 16. summary
  const hasBlockers = run.issues.some((i) => i.severity === "blocker");
  run.scorecard = buildCategoryScorecard({
    definition,
    memberships: run.memberships,
    mode: run.mode,
    hasBlockers,
    pricingCapability: definition.pricingCapability,
  });

  if (hasBlockers) run.status = "blocked";
  else if (
    run.scorecard.overall === "READY_WITH_PRICING_GAP" ||
    run.scorecard.overall === "READY_WITH_WARNINGS"
  )
    run.status = "ready-with-warnings";
  else run.status = "ready";

  run.completedAt = nowIso();
  run.definition = definition;
  upsertStage(
    run,
    stageResult(
      "onboarding-summary",
      "completed",
      run.scorecard.overall,
      { scorecard: run.scorecard, activated: run.activated },
    ),
  );
  logEvent("category_onboarding_ready", {
    runId: run.id,
    status: run.status,
    activated: run.activated,
  });
  persist(run, dryRun);
}

export function listCategoryOnboardingStages(): readonly CategoryOnboardingStageId[] {
  return CATEGORY_ONBOARDING_STAGE_ORDER;
}

/**
 * Resolve agent-safe category context for software onboarding / future agents.
 */
export function getCategoryAgentContext(
  categorySlug: string,
): ReturnType<typeof buildCategoryAgentContext> | null {
  const seed = getCategoryDefinitionSeed(categorySlug);
  if (!seed) return null;
  return buildCategoryAgentContext(seed);
}
