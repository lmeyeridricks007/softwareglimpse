"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CrmReadinessSession,
  ReadinessAnswerValue,
  ReadinessContext,
} from "@/domain";
import { track } from "@/analytics/events";
import { Button } from "@/components/ui/button";
import {
  ResultsLoadingState,
  useDelayedResultsReveal,
} from "@/components/tools/results-loading";
import { SI_READINESS_CATALOG } from "@/services/readiness-assessment/catalog-pack";
import {
  applyDecisionProfileHints,
} from "@/services/readiness-assessment/from-profile";
import {
  completeAssessment,
  loadSiReadinessSession,
  resetSiReadinessSession,
  saveSiReadinessSession,
  setSiAnswer,
  startSiReassessment,
  touchSiReadinessSession,
  createEmptySiReadinessSession,
} from "@/services/readiness-assessment/si-persistence";
import { runFullAssessment, SI_TOOL_META } from "@/services/readiness-assessment/findings";
import {
  assessCrmReadiness,
  estimateMinutesRemaining,
  getVisibleQuestions,
} from "@/services/readiness-assessment/score";
import { seedSiDecisionProfileFromReadiness } from "@/services/readiness-assessment/to-profile";
import {
  loadSiDecisionProfile,
  saveSiDecisionProfile,
} from "@/services/decision-profile/client";
import { ContextStep } from "./context-step";
import { DimensionStep } from "./dimension-step";
import { ResultsDashboard } from "./results-dashboard";
import { WorkspaceChrome } from "./workspace-chrome";

const READINESS_DIMENSIONS = SI_READINESS_CATALOG.dimensions;

function createEmptySessionLocal() {
  return createEmptySiReadinessSession();
}

export function SiReadinessAssessmentApp() {
  const [session, setSession] = useState<CrmReadinessSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [importedIds, setImportedIds] = useState<string[]>([]);
  const [importBanner, setImportBanner] = useState(false);
  const { status: revealStatus, isLoading, startReveal, resetReveal } =
    useDelayedResultsReveal(1600);

  useEffect(() => {
    let cancelled = false;
    const stored = loadSiReadinessSession();
    let next = stored ?? createEmptySessionLocal();
    const profile = loadSiDecisionProfile();
    let imported: string[] = [];
    if (profile && next.wizardStep === "landing") {
      const applied = applyDecisionProfileHints(next, profile);
      next = applied.session;
      imported = applied.importedQuestionIds;
    }
    // Defer setState to avoid cascading-render lint on hydrate-from-storage.
    const id = window.setTimeout(() => {
      if (cancelled) return;
      setSession(next);
      if (imported.length) {
        setImportedIds(imported);
        setImportBanner(true);
      }
      setHydrated(true);
      track({ name: "si_readiness_started" });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !session) return;
    saveSiReadinessSession(session);
  }, [session, hydrated]);

  const visibleByDimension = useMemo(() => {
    if (!session) return new Map<string, ReturnType<typeof getVisibleQuestions>>();
    const visible = getVisibleQuestions(session, SI_READINESS_CATALOG);
    const map = new Map<string, typeof visible>();
    for (const dim of READINESS_DIMENSIONS) {
      map.set(
        dim.id,
        visible.filter((q) => q.dimensionId === dim.id),
      );
    }
    return map;
  }, [session]);

  const provisional = useMemo(() => {
    if (!session) return null;
    const answered = Object.keys(session.answers).length;
    if (answered < 4) return null;
    return assessCrmReadiness(session, { catalog: SI_READINESS_CATALOG });
  }, [session]);

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
      touchSiReadinessSession(session, {
        wizardStep: "context",
        status: "in-progress",
      }),
    );
  };

  const saveContext = (context: ReadinessContext) => {
    update(
      touchSiReadinessSession(session, {
        context,
        wizardStep: "assessment",
        currentDimensionIndex: 0,
      }),
    );
  };

  const answerQuestion = (questionId: string, value: ReadinessAnswerValue) => {
    update(setSiAnswer(session, questionId, value, "user"));
  };

  const goDimension = (index: number) => {
    update(
      touchSiReadinessSession(session, {
        currentDimensionIndex: Math.max(
          0,
          Math.min(READINESS_DIMENSIONS.length - 1, index),
        ),
      }),
    );
  };

  const completeDimension = () => {
    const dim = READINESS_DIMENSIONS[session.currentDimensionIndex];
    if (dim) {
      track({
        name: "si_readiness_dimension_completed",
        properties: { dimension: dim.slug },
      });
    }
    if (session.currentDimensionIndex >= READINESS_DIMENSIONS.length - 1) {
      finishAssessment();
      return;
    }
    goDimension(session.currentDimensionIndex + 1);
  };

  const finishAssessment = () => {
    update(touchSiReadinessSession(session, { wizardStep: "computing" }));
    startReveal(() => {
    const report = runFullAssessment(session, {
      catalog: SI_READINESS_CATALOG,
      toolMeta: SI_TOOL_META,
    });
      const snapshot = {
        completedAt: new Date().toISOString(),
        assessmentVersion: "si-readiness-v1" as const,
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
      const profile = loadSiDecisionProfile();
      saveSiDecisionProfile(
        seedSiDecisionProfileFromReadiness(completed, profile),
      );
      setSession(completed);
      track({
        name: "si_readiness_completed",
        properties: {
          selection: report.assessment.selectionScore,
          implementation: report.assessment.implementationScore,
          level: report.assessment.overallLevel,
        },
      });
    });
  };

  const retake = () => {
    resetReveal();
    update(startSiReassessment(session));
  };

  const restart = () => {
    resetReveal();
    const empty = resetSiReadinessSession();
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
          Progress autosaves on this device. You can go back, skip ahead after
          answering, and retake later to compare scores.
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
                  touchSiReadinessSession(session, { wizardStep: "results" }),
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
          update(touchSiReadinessSession(session, { wizardStep: "landing" }))
        }
        onContinue={saveContext}
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
    const report = runFullAssessment(session, {
      catalog: SI_READINESS_CATALOG,
      toolMeta: SI_TOOL_META,
    });
    return (
      <ResultsDashboard
        session={session}
        report={report}
        onRetake={retake}
        onRestart={restart}
        dimensions={READINESS_DIMENSIONS}
      />
    );
  }

  // Assessment workspace
  const dimIndex = session.currentDimensionIndex;
  const dimension = READINESS_DIMENSIONS[dimIndex]!;
  const questions = visibleByDimension.get(dimension.id) ?? [];
  const minutes = estimateMinutesRemaining(session, SI_READINESS_CATALOG);
  const completedDims = READINESS_DIMENSIONS.map((d, i) => {
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
      dimensions={READINESS_DIMENSIONS}
    >
      <DimensionStep
        dimension={dimension}
        dimensionIndex={dimIndex}
        totalDimensions={READINESS_DIMENSIONS.length}
        questions={questions}
        answers={session.answers}
        importedIds={importedIds}
        onAnswer={answerQuestion}
        onBack={() => {
          if (dimIndex === 0) {
            update(
              touchSiReadinessSession(session, { wizardStep: "context" }),
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
