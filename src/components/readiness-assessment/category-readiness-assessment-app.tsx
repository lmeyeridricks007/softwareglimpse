/**
 * Category readiness assessment — CRM selection vs implementation catalog,
 * stored under sg-{category}-readiness-assessment-v1.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CrmReadinessSession,
  DecisionCategorySlug,
  ReadinessAnswerValue,
  ReadinessContext,
} from "@/domain";
import { track } from "@/analytics/events";
import { Button } from "@/components/ui/button";
import {
  ResultsLoadingState,
  useDelayedResultsReveal,
} from "@/components/tools/results-loading";
import { applyDecisionProfileHints } from "@/services/readiness-assessment/from-profile";
import {
  categoryReadinessContextCopy,
  localizeCrmReadinessCatalog,
  localizeReadinessReportCopy,
  readinessNounCopyFromKit,
} from "@/services/readiness-assessment/localize-catalog";
import {
  completeAssessment,
  loadCategoryReadinessSession,
  resetCategoryReadinessSession,
  saveCategoryReadinessSession,
  setAnswer,
  startReassessment,
  touchCategoryReadinessSession,
} from "@/services/readiness-assessment/category-persistence";
import { createEmptyReadinessSession } from "@/domain";
import { runFullAssessment, type ReadinessToolId } from "@/services/readiness-assessment/findings";
import {
  assessCrmReadiness,
  estimateMinutesRemaining,
  getVisibleQuestions,
} from "@/services/readiness-assessment/score";
import { seedDecisionProfileFromReadinessForCategory } from "@/services/readiness-assessment/to-profile";
import {
  loadDecisionProfile,
  saveDecisionProfile,
} from "@/services/decision-profile/client";
import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import { ContextStep } from "./context-step";
import { DimensionStep } from "./dimension-step";
import { ResultsDashboard } from "./results-dashboard";
import { WorkspaceChrome } from "./workspace-chrome";

function toolMetaForKit(
  kit: CategoryFinderClientKit,
): Record<ReadinessToolId, { title: string; href: string }> {
  return {
    "requirements-builder": {
      title: `Build ${kit.shortName} requirements`,
      href: kit.requirementsHref,
    },
    "crm-finder": {
      title: `Explore ${kit.softwarePhrase}`,
      href: kit.finderHref,
    },
    "cost-calculator": {
      title: `Estimate ${kit.shortName} costs`,
      href: kit.costHref,
    },
    "roi-calculator": {
      title: `Estimate ${kit.shortName} costs`,
      href: kit.costHref,
    },
    "rfp-builder": {
      title: "Build vendor brief / RFP",
      href: kit.rfpHref,
    },
    "demo-checklist": {
      title: "Build demo checklist",
      href: kit.demoHref,
    },
    "vendor-scorecard": {
      title: "Vendor scorecard",
      href: kit.scorecardHref,
    },
    "decision-matrix": {
      title: `Best ${kit.softwarePhrase}`,
      href: kit.bestHref,
    },
    "implementation-planner": {
      title: `Find ${kit.shortName}`,
      href: kit.finderHref,
    },
    "migration-planner": {
      title: "Build demo checklist",
      href: kit.demoHref,
    },
    "best-crm": {
      title: `Best ${kit.softwarePhrase}`,
      href: kit.bestHref,
    },
    "tco-calculator": {
      title: `Estimate ${kit.shortName} costs`,
      href: kit.costHref,
    },
  };
}

type Props = {
  kit: CategoryFinderClientKit;
};

export function CategoryReadinessAssessmentApp({ kit }: Props) {
  const categorySlug = kit.categorySlug as DecisionCategorySlug;
  const nounCopy = useMemo(() => readinessNounCopyFromKit(kit), [kit]);
  const catalog = useMemo(
    () => localizeCrmReadinessCatalog(nounCopy),
    [nounCopy],
  );
  const dimensions = catalog.dimensions;
  const [session, setSession] = useState<CrmReadinessSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [importedIds, setImportedIds] = useState<string[]>([]);
  const [importBanner, setImportBanner] = useState(false);
  const { status: revealStatus, isLoading, startReveal, resetReveal } =
    useDelayedResultsReveal(1600);

  useEffect(() => {
    let cancelled = false;
    const stored = loadCategoryReadinessSession(kit.categorySlug);
    let next = stored ?? createEmptyReadinessSession(kit.categorySlug);
    const profile = loadDecisionProfile(categorySlug);
    let imported: string[] = [];
    if (profile && next.wizardStep === "landing") {
      const applied = applyDecisionProfileHints(next, profile);
      next = applied.session;
      imported = applied.importedQuestionIds;
    }
    const id = window.setTimeout(() => {
      if (cancelled) return;
      setSession(next);
      if (imported.length) {
        setImportedIds(imported);
        setImportBanner(true);
      }
      setHydrated(true);
      track({
        name: "crm_readiness_started",
        properties: { category: kit.categorySlug },
      });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [categorySlug, kit.categorySlug]);

  useEffect(() => {
    if (!hydrated || !session) return;
    saveCategoryReadinessSession(kit.categorySlug, session);
  }, [session, hydrated, kit.categorySlug]);

  const visibleByDimension = useMemo(() => {
    if (!session) return new Map<string, ReturnType<typeof getVisibleQuestions>>();
    const visible = getVisibleQuestions(session, catalog);
    const map = new Map<string, typeof visible>();
    for (const dim of dimensions) {
      map.set(
        dim.id,
        visible.filter((q) => q.dimensionId === dim.id),
      );
    }
    return map;
  }, [session, catalog, dimensions]);

  const provisional = useMemo(() => {
    if (!session) return null;
    const answered = Object.keys(session.answers).length;
    if (answered < 4) return null;
    return assessCrmReadiness(session, { catalog });
  }, [session, catalog]);

  if (!hydrated || !session) {
    return (
      <p className="text-sm text-[var(--sg-color-text-muted)]" role="status">
        Loading assessment…
      </p>
    );
  }

  const update = (next: CrmReadinessSession) => setSession(next);

  const startAssessment = () => {
    update(
      touchCategoryReadinessSession(session, {
        wizardStep: "context",
        status: "in-progress",
      }),
    );
  };

  const saveContext = (context: ReadinessContext) => {
    update(
      touchCategoryReadinessSession(session, {
        context,
        wizardStep: "assessment",
        currentDimensionIndex: 0,
      }),
    );
  };

  const answerQuestion = (questionId: string, value: ReadinessAnswerValue) => {
    update(setAnswer(session, questionId, value, "user"));
  };

  const goDimension = (index: number) => {
    update(
      touchCategoryReadinessSession(session, {
        currentDimensionIndex: Math.max(
          0,
          Math.min(dimensions.length - 1, index),
        ),
      }),
    );
  };

  const completeDimension = () => {
    const dim = dimensions[session.currentDimensionIndex];
    if (dim) {
      track({
        name: "crm_readiness_dimension_completed",
        properties: { dimension: dim.slug, category: kit.categorySlug },
      });
    }
    if (session.currentDimensionIndex >= dimensions.length - 1) {
      finishAssessment();
      return;
    }
    goDimension(session.currentDimensionIndex + 1);
  };

  const finishAssessment = () => {
    update(touchCategoryReadinessSession(session, { wizardStep: "computing" }));
    startReveal(() => {
      const report = localizeReadinessReportCopy(
        runFullAssessment(session, {
          catalog,
          toolMeta: toolMetaForKit(kit),
        }),
        nounCopy,
      );
      const snapshot = {
        completedAt: new Date().toISOString(),
        assessmentVersion: "crm-readiness-v1" as const,
        selectionScore: report.assessment.selectionScore,
        implementationScore: report.assessment.implementationScore,
        overallLevel: report.assessment.overallLevel,
        criticalBlockerCount: report.criticalBlockerCount,
        significantGapCount: report.gapCount,
        dimensionScores: Object.fromEntries(
          report.assessment.dimensions.map((d) => [d.dimensionId, d.score]),
        ),
      };
      const completed = completeAssessment(session, snapshot);
      const profile = loadDecisionProfile(categorySlug);
      saveDecisionProfile(
        seedDecisionProfileFromReadinessForCategory(
          completed,
          profile,
          categorySlug,
        ),
      );
      setSession(completed);
      track({
        name: "crm_readiness_completed",
        properties: {
          selection: report.assessment.selectionScore,
          implementation: report.assessment.implementationScore,
          level: report.assessment.overallLevel,
          category: kit.categorySlug,
        },
      });
    });
  };

  const retake = () => {
    resetReveal();
    update(startReassessment(session));
  };

  const restart = () => {
    resetReveal();
    const empty = resetCategoryReadinessSession(kit.categorySlug);
    setImportedIds([]);
    setImportBanner(false);
    setSession(empty);
  };

  if (session.wizardStep === "landing") {
    return (
      <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-6 shadow-[var(--sg-shadow-sm)] sm:p-8">
        {importBanner ? (
          <p
            className="mb-4 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] px-3 py-2 text-sm text-[var(--sg-color-navy)]"
            role="status"
          >
            Imported hints from Requirements Builder (
            {importedIds.length} field
            {importedIds.length === 1 ? "" : "s"}). Review and correct anything
            outdated.
          </p>
        ) : null}
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          Ready when you are
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          Diagnose selection vs implementation readiness before you buy{" "}
          {kit.softwarePhrase}. Progress autosaves on this device.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" onClick={startAssessment}>
            {session.status === "completed" || session.lastResult
              ? "Continue / review context"
              : "Start assessment"}
          </Button>
          {session.lastResult ? (
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                update(
                  touchCategoryReadinessSession(session, {
                    wizardStep: "results",
                  }),
                )
              }
            >
              View last results
            </Button>
          ) : null}
          {Object.keys(session.answers).length > 0 ? (
            <Button size="lg" variant="ghost" onClick={restart}>
              Restart assessment
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  if (session.wizardStep === "context") {
    return (
      <ContextStep
        context={session.context}
        onBack={() =>
          update(
            touchCategoryReadinessSession(session, { wizardStep: "landing" }),
          )
        }
        onContinue={saveContext}
        copy={categoryReadinessContextCopy()}
      />
    );
  }

  if (session.wizardStep === "computing" || isLoading) {
    return (
      <ResultsLoadingState
        title="Building your readiness report…"
        description="Scoring selection vs implementation readiness, gaps and recommended actions."
      />
    );
  }

  if (session.wizardStep === "results" || revealStatus === "ready") {
    const report = localizeReadinessReportCopy(
      runFullAssessment(session, {
        catalog,
        toolMeta: toolMetaForKit(kit),
      }),
      nounCopy,
    );
    return (
      <ResultsDashboard
        session={session}
        report={report}
        onRetake={retake}
        onRestart={restart}
        dimensions={dimensions}
        productNoun={kit.shortName}
        requirementsHref={kit.requirementsHref}
        finderHref={kit.finderHref}
        exportOptions={{ catalog, nounCopy }}
        relatedLinks={[
          { href: kit.bestHref, label: `Best ${kit.softwarePhrase}` },
          { href: kit.finderHref, label: kit.title },
          {
            href: kit.requirementsHref,
            label: `${kit.shortName} Requirements Builder`,
          },
        ]}
      />
    );
  }

  const dimIndex = session.currentDimensionIndex;
  const dimension = dimensions[dimIndex]!;
  const questions = visibleByDimension.get(dimension.id) ?? [];
  const minutes = estimateMinutesRemaining(session, catalog);
  const completedDims = dimensions.map((d, i) => {
    const qs = visibleByDimension.get(d.id) ?? [];
    if (qs.length === 0) return i < dimIndex;
    return qs.every((q) => {
      const a = session.answers[q.id];
      if (a == null || a.value == null) return false;
      if (Array.isArray(a.value) && a.value.length === 0) return false;
      return true;
    });
  });

  return (
    <WorkspaceChrome
      session={session}
      dimensionIndex={dimIndex}
      completedDims={completedDims}
      minutesRemaining={minutes}
      provisional={provisional}
      onSelectDimension={goDimension}
      onRestart={restart}
      dimensions={dimensions}
      productNoun={kit.shortName}
    >
      <DimensionStep
        dimension={dimension}
        dimensionIndex={dimIndex}
        totalDimensions={dimensions.length}
        questions={questions}
        answers={session.answers}
        importedIds={importedIds}
        onAnswer={answerQuestion}
        onBack={() => {
          if (dimIndex === 0) {
            update(
              touchCategoryReadinessSession(session, { wizardStep: "context" }),
            );
          } else {
            goDimension(dimIndex - 1);
          }
        }}
        onNext={completeDimension}
      />
    </WorkspaceChrome>
  );
}
