"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Lock } from "lucide-react";
import { track, type AnalyticsEventName } from "@/analytics";
import type {
  CrmDemoChecklistSession,
  DemoWizardStep,
} from "@/domain";
import {
  DEMO_STEP_HINTS,
  DEMO_STEP_LABELS,
  DEMO_WIZARD_STEPS,
  analyzeDemoQuality,
  computeRequirementsCoverage,
  createSeededCrmDemoChecklistSession,
  importRequirementsFromProfile,
  loadCrmDemoChecklistSession,
  resetCrmDemoChecklistSession,
  saveCrmDemoChecklistSession,
  touchCrmDemoChecklistSession,
} from "@/services/demo-checklist-builder";
import { addRequirementToDemoChecklistProfile } from "@/services/requirement-detail/demo-evaluation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  ResultsLoadingState,
  useDelayedResultsReveal,
} from "@/components/tools/results-loading";
import { DemoLiveSummary, DemoMobileSummaryBar } from "./live-summary";
import { DemoStepSetup } from "./steps-setup";
import { DemoStepPriorities } from "./steps-priorities";
import { DemoStepScenarios } from "./steps-scenarios";
import {
  DemoStepCommercial,
  DemoStepIntegrations,
  DemoStepQuestions,
  DemoStepReportingAdmin,
} from "./steps-mid";
import {
  DemoResults,
  DemoStepAgenda,
  DemoStepReview,
  DemoStepScoring,
} from "./steps-late";
import type { DemoDraftPatch } from "./step-header";

const WIZARD_STEPS = DEMO_WIZARD_STEPS;

function trackDemo(
  name: AnalyticsEventName,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  track({ name, properties });
}

type Props = {
  title?: string;
  description?: string;
  titleElement?: "h1" | "h2" | "none";
};

export function CrmDemoChecklistBuilderApp({
  title = "CRM Demo Checklist Builder",
  description = "Build a reusable demo agenda and evaluation workbook — same script for every vendor, with per-vendor scoring.",
  titleElement = "none",
}: Props) {
  const [session, setSession] = useState<CrmDemoChecklistSession>(() =>
    createSeededCrmDemoChecklistSession(),
  );
  const [hydrated, setHydrated] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const startedRef = useRef(false);
  const generatedRef = useRef(false);
  const requirementSeededRef = useRef(false);
  /** ~1.5–2s reveal so Generate matches other CRM decision tools. */
  const { isLoading, startReveal, resetReveal } = useDelayedResultsReveal(1800);

  useEffect(() => {
    try {
      let next =
        loadCrmDemoChecklistSession() ?? createSeededCrmDemoChecklistSession();
      // Read query in an effect (not useSearchParams) so the route never sticks
      // on a Suspense fallback while the client bundle hydrates.
      const requirement = new URLSearchParams(window.location.search).get(
        "requirement",
      );
      if (requirement && !requirementSeededRef.current) {
        requirementSeededRef.current = true;
        addRequirementToDemoChecklistProfile(requirement, "must-have");
        const imported = importRequirementsFromProfile(next);
        next = imported.session;
        if (imported.importedCount > 0) {
          track({
            name: "requirements_imported",
            properties: { count: imported.importedCount, source: "query" },
          });
        }
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
      setSession(next);
      if (!startedRef.current) {
        startedRef.current = true;
        trackDemo("crm_demo_checklist_started");
        trackDemo("demo_builder_started");
        track({
          name: "tool_start",
          properties: { tool: "crm-demo-checklist-builder" },
        });
      }
    } catch (err) {
      console.error("[crm-demo-checklist-builder] hydrate failed", err);
      setSession(createSeededCrmDemoChecklistSession());
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCrmDemoChecklistSession(session);
  }, [session, hydrated]);

  const patchDraft: DemoDraftPatch = useCallback((updater) => {
    setSession((prev) =>
      touchCrmDemoChecklistSession(prev, {
        draft: updater(prev.draft),
      }),
    );
  }, []);

  const draft = session.draft;
  const quality = useMemo(() => analyzeDemoQuality(draft), [draft]);
  const coverage = useMemo(() => computeRequirementsCoverage(draft), [draft]);

  const stepId = session.wizardStepId;
  const onResults = stepId === "results";
  const stepIndex = onResults
    ? WIZARD_STEPS.length
    : Math.max(0, WIZARD_STEPS.indexOf(stepId as (typeof WIZARD_STEPS)[number]));

  const goToStep = (id: DemoWizardStep, index: number) => {
    if (id !== "results") {
      resetReveal();
    }
    setSession((prev) =>
      touchCrmDemoChecklistSession(prev, {
        wizardStepId: id,
        maxReachableStepIndex: Math.max(prev.maxReachableStepIndex, index),
      }),
    );
  };

  const generateChecklist = (opts?: { force?: boolean }) => {
    if (isLoading) return;
    const alreadyOnResults = onResults && !opts?.force;
    if (alreadyOnResults) return;

    setSession((prev) =>
      touchCrmDemoChecklistSession(prev, {
        wizardStepId: "results",
        maxReachableStepIndex: WIZARD_STEPS.length,
        generatedAt: new Date().toISOString(),
      }),
    );
    startReveal(() => {
      if (!generatedRef.current) {
        generatedRef.current = true;
        trackDemo("demo_checklist_generated", {
          status: quality.status,
          scenarios: draft.scenarios.filter((s) => s.included).length,
        });
        trackDemo("demo_plan_completed", {
          status: quality.status,
        });
      }
    });
  };

  const completeStep = () => {
    if (isLoading) return;
    trackDemo("demo_checklist_step_completed", { step: stepId });
    if (stepIndex >= WIZARD_STEPS.length - 1) {
      generateChecklist({ force: true });
      return;
    }
    const nextIndex = stepIndex + 1;
    goToStep(WIZARD_STEPS[nextIndex]!, nextIndex);
  };

  const goBack = () => {
    if (isLoading) return;
    if (onResults) {
      goToStep("review", WIZARD_STEPS.length - 1);
      return;
    }
    if (stepIndex > 0) {
      goToStep(WIZARD_STEPS[stepIndex - 1]!, stepIndex - 1);
    }
  };

  const selectStep = (index: number) => {
    if (isLoading) return;
    if (index >= WIZARD_STEPS.length) {
      generateChecklist({ force: true });
      return;
    }
    if (index <= session.maxReachableStepIndex) {
      goToStep(WIZARD_STEPS[index]!, index);
    }
  };

  const handleSave = () => {
    saveCrmDemoChecklistSession(session);
    setSaveFlash(true);
    trackDemo("demo_checklist_saved");
    window.setTimeout(() => setSaveFlash(false), 1500);
  };

  const handleSessionImport = (next: CrmDemoChecklistSession) => {
    setSession(next);
  };

  const handleExport = async (
    kind: "pdf" | "agenda" | "brief" | "xlsx" | "md",
  ) => {
    setExporting(true);
    setExportOpen(false);
    try {
      if (kind === "pdf") {
        const { downloadDemoChecklistPdf } = await import(
          "@/services/demo-checklist-builder/export-pdf"
        );
        await downloadDemoChecklistPdf(session);
        trackDemo("demo_checklist_exported", { format: "pdf" });
      } else if (kind === "agenda") {
        const { downloadDemoAgendaPdf } = await import(
          "@/services/demo-checklist-builder/export-pdf"
        );
        await downloadDemoAgendaPdf(session);
        trackDemo("demo_checklist_exported", { format: "agenda-pdf" });
      } else if (kind === "brief") {
        const { downloadDemoVendorBriefPdf } = await import(
          "@/services/demo-checklist-builder/export-pdf"
        );
        await downloadDemoVendorBriefPdf(session);
        trackDemo("demo_checklist_exported", { format: "vendor-brief-pdf" });
      } else if (kind === "xlsx") {
        const { downloadDemoChecklistExcel } = await import(
          "@/services/demo-checklist-builder/export-xlsx"
        );
        await downloadDemoChecklistExcel(session);
        trackDemo("demo_checklist_exported", { format: "xlsx" });
      } else {
        const { downloadDemoMarkdown } = await import(
          "@/services/demo-checklist-builder/export-md"
        );
        downloadDemoMarkdown(session);
        trackDemo("demo_checklist_exported", { format: "markdown" });
      }
    } finally {
      setExporting(false);
    }
  };

  const TitleTag = titleElement === "none" ? "p" : titleElement;

  // Render the wizard immediately (seeded session). localStorage hydration
  // runs in an effect; gating on `hydrated` left a permanent SSR "Loading…"
  // shell whenever the client bundle failed to take over.
  return (
    <div className="pb-24 lg:pb-10">
      <header className="mb-6 border-b border-[var(--sg-color-border)] pb-4">
        {titleElement !== "none" ? (
          <TitleTag className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)] sm:text-2xl">
            {title}
          </TitleTag>
        ) : (
          <p className="text-lg font-semibold text-[var(--sg-color-navy)]">
            {title}
          </p>
        )}
        <p className="mt-1 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          {description}
        </p>
        <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
          Same script for every vendor · Vendor stated ≠ demonstrated · Must-have
          failures stay visible
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={handleSave}>
          {saveFlash ? "Saved" : "Save"}
        </Button>
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            loading={exporting}
            onClick={() => setExportOpen((o) => !o)}
            aria-expanded={exportOpen}
            aria-haspopup="menu"
          >
            Export
            <ChevronDown className="ml-1 size-4" aria-hidden />
          </Button>
          {exportOpen ? (
            <ul
              role="menu"
              className="absolute left-0 z-20 mt-1 min-w-[12rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] py-1 shadow-lg"
            >
              {(
                [
                  ["pdf", "Checklist PDF"],
                  ["agenda", "Agenda PDF"],
                  ["brief", "Vendor brief PDF"],
                  ["xlsx", "Excel workbook"],
                  ["md", "Markdown"],
                ] as const
              ).map(([key, label]) => (
                <li key={key} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-[var(--sg-color-surface-muted)]"
                    onClick={() => handleExport(key)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Button
          type="button"
          size="sm"
          disabled={isLoading}
          onClick={() => generateChecklist({ force: true })}
        >
          Generate checklist
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            if (
              window.confirm("Start over and clear your saved demo checklist?")
            ) {
              resetReveal();
              generatedRef.current = false;
              setSession(resetCrmDemoChecklistSession());
            }
          }}
        >
          Start over
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)_18rem]">
        <nav
          aria-label="Demo checklist progress"
          className="hidden lg:block"
        >
          <Card className="sticky top-4 px-3 py-4">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Demo checklist
            </p>
            <ol className="mt-4 space-y-1">
              {WIZARD_STEPS.map((id, index) => {
                const done = index < stepIndex;
                const current = index === stepIndex && !onResults;
                const reachable = index <= session.maxReachableStepIndex;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      disabled={!reachable}
                      onClick={() => reachable && selectStep(index)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-[var(--sg-radius-md)] px-2 py-2 text-left text-sm transition",
                        current &&
                          "bg-[var(--sg-color-primary-soft)] font-semibold text-[var(--sg-color-primary)]",
                        done && !current && "text-[var(--sg-color-text)]",
                        !reachable && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          done && "bg-[var(--sg-color-success)] text-white",
                          current &&
                            "bg-[var(--sg-color-primary)] text-white",
                          !done &&
                            !current &&
                            "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
                        )}
                      >
                        {done ? (
                          <Check className="size-3.5" aria-hidden />
                        ) : reachable ? (
                          index + 1
                        ) : (
                          <Lock className="size-3" aria-hidden />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate">
                          {DEMO_STEP_LABELS[id]}
                        </span>
                        <span className="block truncate text-[10px] font-normal text-[var(--sg-color-text-muted)]">
                          {DEMO_STEP_HINTS[id]}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => generateChecklist({ force: true })}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-[var(--sg-radius-md)] px-2 py-2 text-left text-sm transition",
                    onResults &&
                      "bg-[var(--sg-color-primary-soft)] font-semibold text-[var(--sg-color-primary)]",
                    isLoading && "cursor-not-allowed opacity-70",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      onResults
                        ? "bg-[var(--sg-color-primary)] text-white"
                        : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
                    )}
                  >
                    {onResults ? (
                      <Check className="size-3.5" aria-hidden />
                    ) : (
                      WIZARD_STEPS.length + 1
                    )}
                  </span>
                  Results
                </button>
              </li>
            </ol>
          </Card>
        </nav>

        <Card className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="mb-6 lg:hidden">
            <p className="text-xs font-medium text-[var(--sg-color-text-muted)]">
              Step {Math.min(stepIndex + 1, WIZARD_STEPS.length + 1)} of{" "}
              {WIZARD_STEPS.length + 1}:{" "}
              {onResults
                ? "Results"
                : DEMO_STEP_LABELS[stepId as (typeof WIZARD_STEPS)[number]]}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
              <div
                className="h-full bg-[var(--sg-color-primary)] transition-all"
                style={{
                  width: `${((stepIndex + (onResults ? 1 : 0) + 1) / (WIZARD_STEPS.length + 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {stepId === "setup" ? (
            <DemoStepSetup draft={draft} patch={patchDraft} />
          ) : null}
          {stepId === "priorities" ? (
            <DemoStepPriorities draft={draft} patch={patchDraft} />
          ) : null}
          {stepId === "scenarios" ? (
            <DemoStepScenarios
              draft={draft}
              patch={patchDraft}
              session={session}
              onSessionImport={handleSessionImport}
              onTrackImport={(source, count) =>
                trackDemo("demo_requirements_imported", { source, count })
              }
            />
          ) : null}
          {stepId === "questions" ? (
            <DemoStepQuestions draft={draft} patch={patchDraft} />
          ) : null}
          {stepId === "integrations" ? (
            <DemoStepIntegrations draft={draft} patch={patchDraft} />
          ) : null}
          {stepId === "reporting-admin" ? (
            <DemoStepReportingAdmin draft={draft} patch={patchDraft} />
          ) : null}
          {stepId === "commercial" ? (
            <DemoStepCommercial draft={draft} patch={patchDraft} />
          ) : null}
          {stepId === "scoring" ? (
            <DemoStepScoring draft={draft} patch={patchDraft} />
          ) : null}
          {stepId === "agenda" ? (
            <DemoStepAgenda draft={draft} patch={patchDraft} />
          ) : null}
          {stepId === "review" ? (
            <DemoStepReview draft={draft} quality={quality} />
          ) : null}
          {onResults && isLoading ? (
            <ResultsLoadingState
              title="Building your demo checklist…"
              description="Assembling scenarios, agenda, coverage checks and export-ready evaluation workbook."
            />
          ) : null}
          {onResults && !isLoading ? (
            <DemoResults
              session={session}
              onSessionUpdate={setSession}
              onEdit={() => goToStep("scenarios", 2)}
            />
          ) : null}

          {!onResults ? (
            <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-[var(--sg-color-border)] pt-5">
              <Button
                type="button"
                variant="secondary"
                disabled={stepIndex === 0 || isLoading}
                onClick={goBack}
              >
                Back
              </Button>
              <Button type="button" disabled={isLoading} onClick={completeStep}>
                {stepIndex === WIZARD_STEPS.length - 1
                  ? "Generate checklist"
                  : "Continue"}
              </Button>
            </div>
          ) : null}
        </Card>

        <div className="hidden lg:block">
          <DemoLiveSummary
            draft={draft}
            quality={quality}
            coverage={coverage}
            onReview={() => goToStep("review", WIZARD_STEPS.length - 1)}
          />
        </div>
      </div>

      {mobileSummaryOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 lg:hidden">
          <div className="mx-auto max-h-[90vh] max-w-md overflow-y-auto">
            <DemoLiveSummary
              draft={draft}
              quality={quality}
              coverage={coverage}
              onReview={() => {
                setMobileSummaryOpen(false);
                goToStep("review", WIZARD_STEPS.length - 1);
              }}
              onToggleCollapsed={() => setMobileSummaryOpen(false)}
            />
          </div>
        </div>
      ) : (
        <DemoMobileSummaryBar
          draft={draft}
          quality={quality}
          onOpen={() => setMobileSummaryOpen(true)}
        />
      )}
    </div>
  );
}

export type { DemoDraftPatch };
