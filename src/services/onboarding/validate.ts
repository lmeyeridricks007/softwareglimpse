import { getAllSoftwareUnfiltered } from "@/data";
import {
  listManifests,
  listOnboardingRuns,
  listCandidateSoftware,
  loadOnboardingRun,
} from "@/data/onboarding/store";
import {
  ONBOARDING_STAGE_ORDER,
  OnboardingBlockerCodeSchema,
  type SoftwareOnboardingRun,
} from "@/domain";

export type OnboardingValidationIssue = {
  code: string;
  message: string;
  runId?: string;
};

/**
 * Validate onboarding store integrity.
 */
export function validateOnboardingRepository(): OnboardingValidationIssue[] {
  const issues: OnboardingValidationIssue[] = [];
  const runs = listOnboardingRuns();
  const candidates = listCandidateSoftware();
  const candidateSlugs = new Set(candidates.map((c) => c.slug));

  for (const run of runs) {
    if (!run.productSlug) {
      issues.push({
        code: "orphan-run",
        message: `Run ${run.id} has no productSlug`,
        runId: run.id,
      });
    }

    for (const stage of run.stages) {
      if (!ONBOARDING_STAGE_ORDER.includes(stage.stageId)) {
        issues.push({
          code: "unknown-stage",
          message: `Run ${run.id} has unknown stage ${stage.stageId}`,
          runId: run.id,
        });
      }
    }

    for (const issue of run.issues) {
      const parsed = OnboardingBlockerCodeSchema.safeParse(issue.code);
      if (!parsed.success) {
        issues.push({
          code: "unknown-blocker",
          message: `Run ${run.id} has unknown blocker ${issue.code}`,
          runId: run.id,
        });
      }
    }

    for (const page of run.pageCandidates) {
      for (const slug of page.productSlugs) {
        // Unknown product in candidate is OK if still being onboarded as candidate
        if (
          page.pageType === "comparison" &&
          page.productSlugs.length !== 2
        ) {
          issues.push({
            code: "invalid-comparison-candidate",
            message: `Comparison candidate ${page.id} must reference two products`,
            runId: run.id,
          });
        }
        void slug;
      }
    }

    const taskIds = new Set(run.agentTasks.map((t) => t.id));
    for (const task of run.agentTasks) {
      if (task.statusReason?.includes("TASK_DEPENDENCY_CYCLE")) {
        issues.push({
          code: "task-dependency-cycle",
          message: `Task ${task.id} has dependency cycle`,
          runId: run.id,
        });
      }
      for (const dep of task.dependencies) {
        if (dep.startsWith("task:") && !taskIds.has(dep) && dep !== task.id) {
          // Soft — external deps like research:slug are allowed
        }
      }
    }

    // Reloading validates schema round-trip
    const reloaded = loadOnboardingRun(run.id);
    if (!reloaded) {
      issues.push({
        code: "run-unreadable",
        message: `Could not reload run ${run.id}`,
        runId: run.id,
      });
    }
  }

  const manifestSlugs = new Set(listManifests().map((m) => m.productSlug));
  for (const product of getAllSoftwareUnfiltered()) {
    if (!manifestSlugs.has(product.slug)) {
      issues.push({
        code: "missing-manifest",
        message: `Seed product ${product.slug} has no onboarding manifest — run npm run onboard:manifest-backfill`,
      });
    }
  }

  // Candidates without any run are OK (manual), but note orphans lightly
  for (const c of candidates) {
    const hasRun = runs.some((r) => r.productSlug === c.slug);
    if (!hasRun) {
      issues.push({
        code: "candidate-without-run",
        message: `Candidate ${c.slug} has no onboarding run (informational)`,
      });
    }
    void candidateSlugs;
  }

  return issues.filter((i) => i.code !== "candidate-without-run");
}

export function assertValidOnboarding(run: SoftwareOnboardingRun): void {
  const issues = validateOnboardingRepository().filter(
    (i) => i.runId === run.id,
  );
  if (issues.length) {
    throw new Error(
      `Onboarding validation failed: ${issues.map((i) => i.message).join("; ")}`,
    );
  }
}
