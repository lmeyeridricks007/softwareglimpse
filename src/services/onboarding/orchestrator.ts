import { __resetDataCaches, getMigrationRecords, getSoftwareBySlug } from "@/data";
import {
  findAffiliateCatalogueEntry,
} from "@/data/seed/affiliate-catalogue";
import { onboardingPolicy } from "@/data/config/onboarding/policy";
import {
  findLatestRunForSlug,
  loadOnboardingRun,
  saveCandidateSoftware,
  saveManifest,
  saveOnboardingRun,
  type OnboardingManifest,
} from "@/data/onboarding/store";
import {
  ONBOARDING_STAGE_ORDER,
  SoftwareOnboardingRequestSchema,
  SoftwareOnboardingRunSchema,
  onboardingRunId,
  type OnboardingIssue,
  type OnboardingStageId,
  type OnboardingStageResult,
  type Software,
  type SoftwareOnboardingRequest,
  type SoftwareOnboardingRun,
} from "@/domain";
import { assessSoftwareCompleteness } from "@/services/completeness/software-completeness";
import { runResearchPipeline } from "@/services/research/pipeline";
import { buildContentMap, assessEditorialReadiness } from "./content-map";
import { checkDuplicateProduct } from "./duplicates";
import { assessFinderReadiness } from "./finder-readiness";
import { buildInternalLinkPlan } from "./internal-links";
import { assessPricingReadiness } from "./pricing-readiness";
import { buildCandidateSoftware, resolveSlug } from "./product-factory";
import { buildResearchPlan } from "./research-plan";
import {
  discoverRelationshipCandidates,
  relationshipReviewSummary,
} from "./relationships";
import { buildScorecard } from "./scorecard";
import { buildAgentHandoffTasks } from "./tasks";
import { classifyTaxonomy } from "./taxonomy";

export type OnboardSoftwareOptions = {
  /** When resuming, pass run id or set request.options.resumeRunId */
  resumeRunId?: string;
};

function nowIso(): string {
  return new Date().toISOString();
}

function logEvent(event: string, payload: Record<string, unknown>): void {
  // Operational observability — not public analytics
  console.info(`[onboarding] ${event}`, JSON.stringify(payload));
}

function stageResult(
  stageId: OnboardingStageId,
  status: OnboardingStageResult["status"],
  summary?: string,
  data: Record<string, unknown> = {},
  issues: OnboardingIssue[] = [],
): OnboardingStageResult {
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
  run: SoftwareOnboardingRun,
  result: OnboardingStageResult,
): void {
  const idx = run.stages.findIndex((s) => s.stageId === result.stageId);
  if (idx >= 0) run.stages[idx] = result;
  else run.stages.push(result);
}

function stageDone(run: SoftwareOnboardingRun, stageId: OnboardingStageId): boolean {
  const s = run.stages.find((x) => x.stageId === stageId);
  return s?.status === "completed" || s?.status === "skipped";
}

function addIssue(run: SoftwareOnboardingRun, issue: OnboardingIssue): void {
  if (
    run.issues.some(
      (i) => i.code === issue.code && i.message === issue.message,
    )
  ) {
    return;
  }
  run.issues.push(issue);
}

function persist(run: SoftwareOnboardingRun, dryRun: boolean): void {
  run.updatedAt = nowIso();
  if (dryRun) return;
  saveOnboardingRun(SoftwareOnboardingRunSchema.parse(run));
}

/**
 * Programmatic entry point for software onboarding / reconcile.
 * Safe for bulk callers later — CLI is a thin wrapper.
 */
export async function onboardSoftware(
  rawRequest: SoftwareOnboardingRequest,
  options: OnboardSoftwareOptions = {},
): Promise<SoftwareOnboardingRun> {
  const request = SoftwareOnboardingRequestSchema.parse(rawRequest);
  const dryRun = request.options?.dryRun ?? false;
  const resumeId =
    options.resumeRunId ?? request.options?.resumeRunId ?? undefined;

  let run: SoftwareOnboardingRun;
  if (resumeId) {
    const existing = loadOnboardingRun(resumeId);
    if (!existing) {
      throw new Error(`Onboarding run not found: ${resumeId}`);
    }
    run = existing;
    run.request = {
      ...request,
      options: {
        ...request.options,
        // Preserve resume semantics
        dryRun: request.options?.dryRun ?? existing.request.options?.dryRun,
      },
    };
    logEvent("onboarding_resumed", { runId: run.id, slug: run.productSlug });
  } else {
    const slug = resolveSlug(request);
    run = SoftwareOnboardingRunSchema.parse({
      id: onboardingRunId(slug),
      productSlug: slug,
      request,
      mode: "new",
      status: "created",
      stages: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    logEvent("onboarding_started", {
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
      code: "INVALID_STAGE_TRANSITION",
      severity: "blocker",
      message,
    });
    upsertStage(
      run,
      stageResult("onboarding-summary", "failed", message),
    );
    persist(run, dryRun);
    logEvent("onboarding_failed", { runId: run.id, message });
    return run;
  }

  persist(run, dryRun);
  if (!dryRun && run.productSlug) {
    updateManifest(run);
  }
  return run;
}

async function executeStages(
  run: SoftwareOnboardingRun,
  dryRun: boolean,
): Promise<void> {
  // 1. intake
  if (!stageDone(run, "intake")) {
    run.status = "validating";
    let name = run.request.name;
    let website = run.request.website;
    let affiliateStatus: SoftwareOnboardingRun["affiliateStatus"] = "NONE";

    if (run.request.source === "affiliate-catalogue") {
      const entry =
        findAffiliateCatalogueEntry(run.productSlug ?? run.request.name) ??
        findAffiliateCatalogueEntry(run.request.name);
      if (entry) {
        name = entry.productName;
        website = website ?? entry.website;
        run.request = {
          ...run.request,
          name,
          website,
          aliases: [
            ...new Set([
              ...(run.request.aliases ?? []),
              ...(entry.aliases ?? []),
            ]),
          ],
          suggestedCategoryIds:
            run.request.suggestedCategoryIds.length > 0
              ? run.request.suggestedCategoryIds
              : entry.categoryHint
                ? [entry.categoryHint]
                : [],
          entityTypeHint: run.request.entityTypeHint ?? entry.entityTypeHint,
          affiliateProgramId:
            run.request.affiliateProgramId ?? entry.id,
        };
        affiliateStatus = "CATALOGUE_HINT";
      }
    }

    // Affiliate missing is warning only
    if (
      !run.request.affiliateProgramId &&
      onboardingPolicy.affiliateRequired === false
    ) {
      // no-op — warning recorded later if useful
    }

    run.affiliateStatus = affiliateStatus;
    run.productSlug = resolveSlug(run.request);
    upsertStage(
      run,
      stageResult(
        "intake",
        "completed",
        `Intake for ${name} (${run.request.source})`,
        { affiliateStatus },
      ),
    );
    persist(run, dryRun);
  }

  // 2. identity
  let workingProduct: Software | undefined;
  if (!stageDone(run, "identity")) {
    const slug = run.productSlug!;
    const existing = getSoftwareBySlug(slug, { includeUnpublished: true });
    const entityType =
      run.request.entityTypeHint ??
      findAffiliateCatalogueEntry(slug)?.entityTypeHint ??
      "software";

    if (!run.request.name) {
      addIssue(run, {
        code: "UNKNOWN_IDENTITY",
        severity: "blocker",
        message: "Product name is required",
        stageId: "identity",
      });
      run.status = "blocked";
      upsertStage(
        run,
        stageResult("identity", "blocked", "Missing product name", {}, [
          {
            code: "UNKNOWN_IDENTITY",
            severity: "blocker",
            message: "Product name is required",
            stageId: "identity",
          },
        ]),
      );
      persist(run, dryRun);
      return;
    }

    if (
      entityType === "service" ||
      entityType === "marketplace"
    ) {
      run.entityType = entityType;
      addIssue(run, {
        code: "NOT_STANDARD_SOFTWARE",
        severity: "blocker",
        message: `Entity type ${entityType} should not auto-create /software/ pages`,
        stageId: "identity",
      });
      run.status = "blocked";
      upsertStage(
        run,
        stageResult(
          "identity",
          "blocked",
          `NOT_STANDARD_SOFTWARE (${entityType})`,
        ),
      );
      persist(run, dryRun);
      logEvent("identity_resolved", {
        runId: run.id,
        entityType,
        blocked: true,
      });
      return;
    }

    run.entityType = entityType;
    run.productLifecycle = existing?.productLifecycle ?? "candidate";

    if (existing) {
      workingProduct = existing;
      run.mode = "reconcile";
      run.productId = existing.id;
    } else {
      // Skeleton — taxonomy filled in next stages; use marketing/crm placeholder if needed
      const primaryGuess =
        run.request.suggestedCategoryIds[0] ??
        findAffiliateCatalogueEntry(slug)?.categoryHint ??
        "marketing";
      workingProduct = buildCandidateSoftware({
        request: run.request,
        slug,
        primaryCategorySlug: primaryGuess,
        entityType,
      });
      run.productId = workingProduct.id;
      run.mode = "new";
    }

    upsertStage(
      run,
      stageResult(
        "identity",
        "completed",
        `Identity: ${workingProduct.name} / ${workingProduct.slug} (${entityType})`,
        {
          website: workingProduct.website,
          mode: run.mode,
        },
      ),
    );
    logEvent("identity_resolved", {
      runId: run.id,
      slug,
      mode: run.mode,
    });
    persist(run, dryRun);
  } else {
    workingProduct =
      getSoftwareBySlug(run.productSlug!, { includeUnpublished: true }) ??
      undefined;
  }

  // 3. duplication check
  if (!stageDone(run, "duplication-check")) {
    const dup = checkDuplicateProduct({
      name: run.request.name,
      slug: run.productSlug!,
      website: run.request.website,
      aliases: run.request.aliases,
    });
    run.duplicateOutcome = dup.outcome;

    if (dup.outcome === "EXISTING" || dup.outcome === "RENAMED_PRODUCT") {
      run.mode = "reconcile";
      workingProduct = dup.matched ?? workingProduct;
      run.productId = workingProduct?.id;
      upsertStage(
        run,
        stageResult(
          "duplication-check",
          "completed",
          `${dup.outcome}: ${dup.reason} — reconcile mode`,
          { matchedSlug: dup.matched?.slug },
        ),
      );
    } else if (dup.outcome === "POSSIBLE_DUPLICATE") {
      addIssue(run, {
        code: "POSSIBLE_DUPLICATE",
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
        stageResult("duplication-check", "completed", "NEW product"),
      );
    }
    persist(run, dryRun);
  }

  if (!workingProduct) {
    workingProduct = getSoftwareBySlug(run.productSlug!, {
      includeUnpublished: true,
    });
  }
  if (!workingProduct) {
    run.status = "failed";
    addIssue(run, {
      code: "UNKNOWN_IDENTITY",
      severity: "blocker",
      message: "Could not resolve working product after identity stages",
    });
    persist(run, dryRun);
    return;
  }

  // Migration check notes
  const migrations = getMigrationRecords().filter((m) => {
    const hay = `${m.source ?? ""} ${m.notes ?? ""} ${m.target ?? ""}`.toLowerCase();
    return hay.includes(workingProduct!.slug);
  });
  if (migrations.length) {
    run.migrationNotes = migrations.map(
      (m) => `${m.action}: ${m.source ?? m.id}`,
    );
    addIssue(run, {
      code: "MIGRATION_CONFLICT",
      severity: "warning",
      message: `${migrations.length} migration record(s) mention this product — review KEEP/REWRITE/REDIRECT`,
      stageId: "identity",
    });
  }

  if (workingProduct.productLifecycle === "discontinued") {
    addIssue(run, {
      code: "DISCONTINUED_PRODUCT",
      severity: "blocker",
      message: "Product marked discontinued — stop normal onboarding",
      stageId: "identity",
    });
    run.status = "blocked";
    persist(run, dryRun);
    return;
  }

  // 4. taxonomy
  if (!stageDone(run, "taxonomy")) {
    run.status = "classifying";
    const tax = classifyTaxonomy({
      productSlug: workingProduct.slug,
      productName: workingProduct.name,
      suggestedCategorySlugs: run.request.suggestedCategoryIds,
      source: run.request.source,
    });
    run.taxonomy = tax.assignments;
    run.categoryGaps = tax.categoryGaps;

    if (tax.categoryGaps.length && !tax.primaryCategorySlug) {
      addIssue(run, {
        code: "CATEGORY_GAP",
        severity: "blocker",
        message: tax.categoryGaps[0]!.reason,
        stageId: "taxonomy",
      });
      run.status = "blocked";
      upsertStage(
        run,
        stageResult("taxonomy", "blocked", "CATEGORY_GAP", {
          gaps: tax.categoryGaps,
        }),
      );
      persist(run, dryRun);
      return;
    }

    if (tax.primaryCategorySlug) {
      workingProduct = {
        ...workingProduct,
        primaryCategorySlug: tax.primaryCategorySlug,
        secondaryCategorySlugs: tax.assignments
          .filter((a) => a.role === "secondary")
          .map((a) => a.slug),
        subcategorySlugs: tax.assignments
          .filter((a) => a.role === "subcategory")
          .map((a) => a.slug),
      };
    }

    if (!tax.categoryContentReady) {
      addIssue(run, {
        code: "CATEGORY_NOT_READY",
        severity: "warning",
        message:
          "Category methodology not fully ready — research may continue; content generation may be category-blocked",
        stageId: "taxonomy",
      });
    }

    if (tax.lowConfidenceRequiresReview) {
      addIssue(run, {
        code: "CATEGORY_NOT_READY",
        severity: "warning",
        message: "Low-confidence taxonomy assignment requires review",
        stageId: "taxonomy",
      });
    }

    upsertStage(
      run,
      stageResult(
        "taxonomy",
        "completed",
        `Primary: ${tax.primaryCategorySlug ?? "none"}`,
        {
          assignments: tax.assignments,
          categoryContentReady: tax.categoryContentReady,
        },
      ),
    );
    logEvent("taxonomy_classified", {
      runId: run.id,
      primary: tax.primaryCategorySlug,
    });
    persist(run, dryRun);
  }

  const categoryContentReady =
    (run.stages.find((s) => s.stageId === "taxonomy")?.data
      ?.categoryContentReady as boolean | undefined) ?? false;

  // Persist candidate entity (new only) after taxonomy
  if (run.mode === "new" && !dryRun) {
    saveCandidateSoftware(workingProduct);
    __resetDataCaches();
    workingProduct =
      getSoftwareBySlug(workingProduct.slug, { includeUnpublished: true }) ??
      workingProduct;
  }

  // 5. research planning
  if (!stageDone(run, "research-planning")) {
    const plan = buildResearchPlan({
      productSlug: workingProduct.slug,
      primaryCategorySlug: workingProduct.primaryCategorySlug,
    });
    run.researchPlan = plan;
    upsertStage(
      run,
      stageResult(
        "research-planning",
        "completed",
        `Required domains: ${plan.requiredDomains.join(", ")}`,
        { plan },
      ),
    );
    persist(run, dryRun);
  }

  // 6. research
  if (!stageDone(run, "research")) {
    const skip = run.request.options?.runResearch === false;
    if (skip) {
      upsertStage(
        run,
        stageResult("research", "skipped", "Research skipped by request"),
      );
    } else {
      run.status = "researching";
      logEvent("research_started", {
        runId: run.id,
        slug: workingProduct.slug,
      });
      try {
        const domains = run.researchPlan?.requiredDomains;
        const result = await runResearchPipeline(workingProduct.slug, {
          domains,
          dryRun,
          allowFixtures: run.request.options?.allowFixtures ?? true,
          autoApprove: run.request.options?.autoApproveResearch ?? false,
          merge: run.request.options?.mergeResearch ?? false,
        });
        const completeness = assessSoftwareCompleteness(
          getSoftwareBySlug(workingProduct.slug, { includeUnpublished: true }) ??
            workingProduct,
        );
        run.researchCompletenessPercent = completeness.completenessPercent;
        upsertStage(
          run,
          stageResult(
            "research",
            "completed",
            `Research job ${result.job.status}; completeness ${completeness.completenessPercent}%`,
            {
              jobId: result.job.id,
              factCount: result.factCount,
              completeness,
            },
          ),
        );
        logEvent("research_completed", {
          runId: run.id,
          percent: completeness.completenessPercent,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        addIssue(run, {
          code: "RESEARCH_PROVIDER_UNAVAILABLE",
          severity: "blocker",
          message,
          stageId: "research",
        });
        run.status = "blocked";
        upsertStage(
          run,
          stageResult(
            "research",
            "blocked",
            `Research blocked: ${message}. Resume after provider/fixtures configured.`,
          ),
        );
        persist(run, dryRun);
        logEvent("onboarding_blocked", { runId: run.id, stage: "research" });
        return;
      }
    }
    persist(run, dryRun);
  }

  // Refresh completeness
  const completeness = assessSoftwareCompleteness(
    getSoftwareBySlug(workingProduct.slug, { includeUnpublished: true }) ??
      workingProduct,
  );
  run.researchCompletenessPercent = completeness.completenessPercent;
  workingProduct =
    getSoftwareBySlug(workingProduct.slug, { includeUnpublished: true }) ??
    workingProduct;

  // 7. enrichment (approval policy — do not write unverified into seed)
  if (!stageDone(run, "enrichment")) {
    run.status = "enriching";
    upsertStage(
      run,
      stageResult(
        "enrichment",
        "completed",
        "Enrichment uses research approve/merge pipeline — onboarding does not write unverified facts into seed",
        {
          completenessPercent: completeness.completenessPercent,
          merged: run.request.options?.mergeResearch ?? false,
        },
      ),
    );
    persist(run, dryRun);
  }

  // 8. relationships
  if (!stageDone(run, "relationship-resolution")) {
    run.status = "relationships";
    const candidates = discoverRelationshipCandidates(workingProduct);
    run.relationshipCandidates = candidates;
    const summary = relationshipReviewSummary(candidates);
    if (summary.needsReview.length > 0) {
      addIssue(run, {
        code: "RELATIONSHIP_REVIEW",
        severity: "warning",
        message: `Relationship review required for: ${summary.needsReview.slice(0, 8).join(", ")}`,
        stageId: "relationship-resolution",
      });
    }
    upsertStage(
      run,
      stageResult(
        "relationship-resolution",
        "completed",
        `${candidates.length} candidates; competitors=${summary.competitors.length}`,
        { summary },
      ),
    );
    logEvent("relationships_generated", {
      runId: run.id,
      count: candidates.length,
    });
    persist(run, dryRun);
  }

  // 9–10 editorial + pricing readiness
  const pricing = assessPricingReadiness(workingProduct);
  run.pricingReadiness = pricing.status;
  if (pricing.status === "UNSUPPORTED_MODEL") {
    addIssue(run, {
      code: "PRICING_UNSUPPORTED",
      severity: "warning",
      message: pricing.notes.join("; "),
      stageId: "pricing-readiness",
    });
  }

  if (!stageDone(run, "editorial-readiness")) {
    const editorial = assessEditorialReadiness({
      product: workingProduct,
      researchPercent: completeness.completenessPercent,
      categoryContentReady,
      pricingStatus: pricing.status,
      relationshipCandidates: run.relationshipCandidates,
    });
    upsertStage(
      run,
      stageResult(
        "editorial-readiness",
        "completed",
        `Review=${editorial.review}; Pricing=${editorial.pricing}; Alts=${editorial.alternatives}`,
        { editorial },
      ),
    );
    persist(run, dryRun);
  }

  if (!stageDone(run, "pricing-readiness")) {
    const finder = assessFinderReadiness(workingProduct);
    run.finderReadiness = {
      crmFinder: finder.crmFinder,
      generalFinder: finder.generalFinder,
      notes: finder.notes,
    };
    upsertStage(
      run,
      stageResult(
        "pricing-readiness",
        "completed",
        `Pricing ${pricing.status}; CRM Finder ${finder.crmFinder}`,
        { pricing, finder },
      ),
    );
    persist(run, dryRun);
  }

  // 11. content mapping
  if (!stageDone(run, "content-mapping")) {
    run.status = "planning-content";
    if (run.request.options?.createContentPlan === false) {
      upsertStage(
        run,
        stageResult("content-mapping", "skipped", "Content plan skipped"),
      );
    } else {
      const pages = buildContentMap({
        product: workingProduct,
        categoryContentReady,
        researchPercent: completeness.completenessPercent,
        pricingStatus: pricing.status,
        relationshipCandidates: run.relationshipCandidates,
      });
      run.pageCandidates = pages;
      run.agentTasks = buildAgentHandoffTasks({
        product: workingProduct,
        researchPlan: run.researchPlan,
        pageCandidates: pages,
        relationshipCandidates: run.relationshipCandidates,
        researchPercent: completeness.completenessPercent,
        skipResearch: run.request.options?.runResearch === false,
      });
      upsertStage(
        run,
        stageResult(
          "content-mapping",
          "completed",
          `${pages.length} page candidates; ${run.agentTasks.length} agent tasks`,
          {},
        ),
      );
      logEvent("content_plan_created", {
        runId: run.id,
        pages: pages.length,
      });
    }
    persist(run, dryRun);
  }

  // 12. internal links
  if (!stageDone(run, "internal-link-planning")) {
    run.internalLinkCandidates = buildInternalLinkPlan({
      product: workingProduct,
      pageCandidates: run.pageCandidates,
    });
    upsertStage(
      run,
      stageResult(
        "internal-link-planning",
        "completed",
        `${run.internalLinkCandidates.length} link candidates`,
      ),
    );
    persist(run, dryRun);
  }

  // 13. validation
  if (!stageDone(run, "validation")) {
    const blockers = run.issues.filter((i) => i.severity === "blocker");
    if (blockers.length) {
      upsertStage(
        run,
        stageResult(
          "validation",
          "blocked",
          `${blockers.length} blocker(s)`,
          { blockers },
        ),
      );
      run.status = "blocked";
      persist(run, dryRun);
      return;
    }
    upsertStage(
      run,
      stageResult("validation", "completed", "No blockers"),
    );
    persist(run, dryRun);
  }

  // 14. summary
  const hasReviewWarnings = run.issues.some((i) => i.severity === "warning");
  const hasBlockers = run.issues.some((i) => i.severity === "blocker");
  run.scorecard = buildScorecard({
    product: workingProduct,
    taxonomy: run.taxonomy,
    researchPercent: completeness.completenessPercent,
    pricingStatus: pricing.status,
    relationshipCandidates: run.relationshipCandidates,
    pageCandidates: run.pageCandidates,
    mode: run.mode,
    hasBlockers,
    hasReviewWarnings,
  });

  if (hasBlockers) run.status = "blocked";
  else if (hasReviewWarnings || run.scorecard.overall === "READY_WITH_REVIEW")
    run.status = "review-required";
  else run.status = "ready";

  run.completedAt = nowIso();
  upsertStage(
    run,
    stageResult(
      "onboarding-summary",
      "completed",
      run.scorecard.overall,
      { scorecard: run.scorecard },
    ),
  );
  logEvent(
    run.status === "ready" ? "onboarding_ready" : "onboarding_blocked",
    { runId: run.id, status: run.status },
  );
  persist(run, dryRun);
}

function updateManifest(run: SoftwareOnboardingRun): void {
  if (!run.productSlug) return;
  const prev = findLatestRunForSlug(run.productSlug);
  const manifest: OnboardingManifest = {
    productSlug: run.productSlug,
    latestRunId: run.id,
    status: run.status,
    firstOnboardedAt:
      run.mode === "new" ? run.createdAt : prev?.createdAt ?? run.createdAt,
    lastReconciledAt: run.mode === "reconcile" ? run.updatedAt : undefined,
    lastResearchRunAt: run.stages.some((s) => s.stageId === "research")
      ? run.updatedAt
      : undefined,
    contentTasksCreated: run.agentTasks.length,
    notes: run.issues.map((i) => `${i.severity}:${i.code}`),
  };
  saveManifest(manifest);
}

/** List stage order for docs/CLI. */
export function listOnboardingStages(): readonly OnboardingStageId[] {
  return ONBOARDING_STAGE_ORDER;
}
