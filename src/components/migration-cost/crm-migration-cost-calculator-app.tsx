/**
 * CRM Migration Cost Calculator interactive app.
 *
 * Persistence: localStorage `sg-crm-migration-cost-v1`
 * Cross-tool handoffs require explicit confirmation.
 */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Lock } from "lucide-react";
import { track } from "@/analytics";
import type { McInputs, McWizardStep } from "@/domain";
import {
  applyFieldMappingImport,
  buildBusinessCaseHandoffPayload,
  buildRoiHandoffPayload,
  buildTcoHandoffPayload,
  computeMigrationCost,
  createEmptyMigrationCostSession,
  detectRoiOverlap,
  loadMigrationCostSession,
  previewFieldMappingImport,
  previewReadinessWarnings,
  resetMigrationCostSession,
  saveBusinessCaseHandoff,
  saveMigrationCostSession,
  saveRoiHandoff,
  saveTcoHandoff,
} from "@/services/migration-cost";
import {
  CALCULATOR_VALUE_PROPS,
  FinderPageHero,
} from "@/components/finder/finder-page-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  ResultsLoadingState,
  useDelayedResultsReveal,
} from "@/components/tools/results-loading";
import {
  McStepCurrentSystem,
  McStepDataQuality,
  McStepDataScope,
  McStepMapping,
} from "./mc-steps-1-4";
import {
  McStepApproach,
  McStepIntegrations,
  McStepInternalEffort,
  McStepTestingCutover,
} from "./mc-steps-5-8";
import { McLiveSummary, McMobileSummaryBar } from "./mc-live-summary";
import { McResultsDashboard } from "./mc-results";

const STAGES: Array<{ id: McWizardStep; label: string }> = [
  { id: "current-system", label: "Current system" },
  { id: "data-scope", label: "Data scope" },
  { id: "data-quality", label: "Data quality" },
  { id: "mapping", label: "Mapping & transformation" },
  { id: "integrations", label: "Integrations & customization" },
  { id: "approach", label: "Migration approach" },
  { id: "internal-effort", label: "Internal effort" },
  { id: "testing-cutover", label: "Testing & cutover" },
  { id: "results", label: "Results" },
];

type Props = {
  resourceLinks?: Array<{ href: string; label: string }>;
  title?: string;
  description?: string;
  titleElement?: "h1" | "h2" | "none";
};

export function CrmMigrationCostCalculatorApp({
  resourceLinks = [],
  title = "CRM Migration Cost Calculator",
  description = "Estimate what it may cost to move your CRM data, workflows and integrations — including internal effort, external services and migration risk.",
  titleElement = "none",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState(() => createEmptyMigrationCostSession());
  const [hydrated, setHydrated] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [readinessExtra, setReadinessExtra] = useState<string[]>([]);
  const startedRef = useRef(false);
  const resultTrackedRef = useRef(false);
  const { isLoading, startReveal, resetReveal } = useDelayedResultsReveal();

  useEffect(() => {
    const stored = loadMigrationCostSession() ?? createEmptyMigrationCostSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration from localStorage
    setSession(stored);
    const readiness = previewReadinessWarnings();
    if (readiness.available && readiness.warnings.length > 0) {
      setReadinessExtra(readiness.warnings);
    }
    setHydrated(true);
    if (!startedRef.current) {
      startedRef.current = true;
      track({
        name: "crm_migration_cost_started",
        properties: { from: searchParams.get("from") ?? "direct" },
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!hydrated) return;
    saveMigrationCostSession(session);
  }, [session, hydrated]);

  const stepIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.id === session.wizardStepId),
  );

  const result = useMemo(
    () => computeMigrationCost(session.inputs),
    [session.inputs],
  );

  useEffect(() => {
    if (
      session.wizardStepId === "results" &&
      !isLoading &&
      !resultTrackedRef.current
    ) {
      resultTrackedRef.current = true;
      track({
        name: "migration_result_viewed",
        properties: { status: result.status },
      });
      track({
        name: "migration_complexity_calculated",
        properties: { band: result.complexity.overall },
      });
    }
  }, [session.wizardStepId, result.status, result.complexity.overall, isLoading]);

  const patchInputs = (updater: (prev: McInputs) => McInputs) => {
    setSession((prev) => ({
      ...prev,
      inputs: updater(prev.inputs),
      updatedAt: new Date().toISOString(),
    }));
  };

  const goToStep = (id: McWizardStep, index: number) => {
    if (id !== "results") resetReveal();
    setSession((prev) => ({
      ...prev,
      wizardStepId: id,
      maxReachableStepIndex: Math.max(prev.maxReachableStepIndex, index),
      updatedAt: new Date().toISOString(),
    }));
  };

  const revealResults = (opts?: { force?: boolean }) => {
    if (isLoading) return;
    if (session.wizardStepId === "results" && !opts?.force) return;
    setSession((prev) => ({
      ...prev,
      wizardStepId: "results",
      maxReachableStepIndex: Math.max(prev.maxReachableStepIndex, 8),
      updatedAt: new Date().toISOString(),
    }));
    startReveal(() => {});
  };

  const completeStep = () => {
    const step = session.wizardStepId;
    if (step === "current-system") {
      track({
        name: "migration_source_selected",
        properties: { selected: Boolean(session.inputs.currentSystem.sourceType) },
      });
    }
    if (step === "data-scope") {
      track({ name: "migration_data_scope_completed" });
    }
    if (stepIndex === STAGES.length - 2) {
      revealResults({ force: true });
      return;
    }
    const nextIndex = Math.min(STAGES.length - 1, stepIndex + 1);
    goToStep(STAGES[nextIndex]!.id, nextIndex);
  };

  const selectStage = (stage: (typeof STAGES)[number], index: number) => {
    if (stage.id === "results") {
      if (session.wizardStepId === "results" && !isLoading) return;
      revealResults({ force: true });
      return;
    }
    goToStep(stage.id, index);
  };

  const handleImportMapping = () => {
    const preview = previewFieldMappingImport();
    if (!preview.available) {
      window.alert(preview.message);
      return;
    }
    const confirmed = window.confirm(preview.message);
    if (!confirmed) return;
    patchInputs((prev) => applyFieldMappingImport(prev, preview));
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const { downloadMigrationCostPdf } = await import(
        "@/services/migration-cost/export"
      );
      await downloadMigrationCostPdf(session.inputs, result);
      track({ name: "migration_exported", properties: { format: "pdf" } });
    } finally {
      setExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const { downloadMigrationCostExcel } = await import(
        "@/services/migration-cost/export"
      );
      await downloadMigrationCostExcel(session.inputs, result);
      track({ name: "migration_exported", properties: { format: "xlsx" } });
    } finally {
      setExporting(false);
    }
  };

  const handleExportMarkdown = async () => {
    setExporting(true);
    try {
      const { downloadMigrationCostMarkdown } = await import(
        "@/services/migration-cost/export"
      );
      await downloadMigrationCostMarkdown(session.inputs, result);
      track({ name: "migration_exported", properties: { format: "md" } });
    } finally {
      setExporting(false);
    }
  };

  const handleHandoffTco = () => {
    const confirmed = window.confirm(
      "Save this migration estimate for the CRM TCO Calculator on this device? Nothing is overwritten until you confirm import there.",
    );
    if (!confirmed) return;
    const payload = buildTcoHandoffPayload(session.inputs, result);
    saveTcoHandoff(payload);
    setSession((prev) => ({
      ...prev,
      tcoHandoffConfirmedAt: new Date().toISOString(),
    }));
    track({ name: "migration_cost_imported_to_tco" });
    router.push("/tools/crm-tco-calculator/?from=migration-cost");
  };

  const handleHandoffCost = () => {
    const confirmed = window.confirm(
      "Save this migration estimate so the CRM Cost / TCO tools can import it after you confirm?",
    );
    if (!confirmed) return;
    saveTcoHandoff(buildTcoHandoffPayload(session.inputs, result));
    track({ name: "migration_cost_imported_to_tco" });
    router.push("/tools/crm-cost-calculator/?from=migration-cost");
  };

  const handleHandoffRoi = () => {
    const overlap = detectRoiOverlap();
    const warn = overlap.overlap ? `\n\n${overlap.message}` : "";
    const confirmed = window.confirm(
      `Save this migration estimate for the CRM ROI Calculator? It can populate Year 1 migration investment after you confirm.${warn}`,
    );
    if (!confirmed) return;
    saveRoiHandoff(buildRoiHandoffPayload(session.inputs, result));
    setSession((prev) => ({
      ...prev,
      roiHandoffConfirmedAt: new Date().toISOString(),
    }));
    track({ name: "migration_cost_imported_to_roi" });
    router.push("/tools/crm-roi-calculator/?from=migration-cost");
  };

  const handleHandoffBusinessCase = () => {
    const confirmed = window.confirm(
      "Save this migration estimate for your CRM Business Case template on this device?",
    );
    if (!confirmed) return;
    saveBusinessCaseHandoff(
      buildBusinessCaseHandoffPayload(session.inputs, result),
    );
    setSession((prev) => ({
      ...prev,
      businessCaseHandoffConfirmedAt: new Date().toISOString(),
    }));
    router.push("/resources/crm-business-case-template/?from=migration-cost");
  };

  const valueProps = [
    {
      ...CALCULATOR_VALUE_PROPS[0],
      title: "Uses your migration scope",
      body: "Objects, history, integrations and quotes you provide.",
    },
    {
      ...CALCULATOR_VALUE_PROPS[1],
      title: "Internal + external cost model",
      body: "Labour, partners, tooling and contingency stay separate.",
    },
    {
      ...CALCULATOR_VALUE_PROPS[2],
      title: "No invented vendor pricing",
      body: "Blank rates stay unknown — never industry averages.",
    },
  ];

  if (!hydrated) {
    return (
      <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]" role="status">
        Loading migration cost calculator…
      </p>
    );
  }

  const nextLabel =
    stepIndex < STAGES.length - 2
      ? `Next: ${STAGES[stepIndex + 1]!.label}`
      : "View results";

  return (
    <div className="mt-6 pb-24 lg:pb-10">
      <FinderPageHero
        title={title}
        description={description}
        valueProps={valueProps}
        visual="calculator"
        badge="Free · No signup"
        titleElement={titleElement}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={() => goToStep("current-system", 0)}>
          Estimate migration cost
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            router.push("/resources/crm-field-mapping-template/")
          }
        >
          Plan my field mapping
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            if (
              window.confirm(
                "Start over and clear saved migration cost inputs?",
              )
            ) {
              resetReveal();
              setSession(resetMigrationCostSession());
              resultTrackedRef.current = false;
            }
          }}
        >
          Start over
        </Button>
      </div>

      {readinessExtra.length > 0 ? (
        <div
          className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-warning)]/30 bg-[var(--sg-color-warning-soft)]/40 px-4 py-3 text-sm"
          role="status"
        >
          <p className="font-medium text-[var(--sg-color-navy)]">
            From your CRM Readiness Assessment
          </p>
          <ul className="mt-1 list-disc pl-5 text-[var(--sg-color-text-muted)]">
            {readinessExtra.slice(0, 3).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)_18rem]">
        <nav
          aria-label="Migration cost calculator progress"
          className="hidden lg:block"
        >
          <Card className="sticky top-4 px-3 py-4">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Project summary
            </p>
            <dl className="mt-2 space-y-1 border-b border-[var(--sg-color-border)] px-2 pb-3 text-[11px] text-[var(--sg-color-text-muted)]">
              <div className="flex justify-between gap-2">
                <dt>Project</dt>
                <dd className="truncate font-medium text-[var(--sg-color-text)]">
                  {session.inputs.currentSystem.projectName}
                </dd>
              </div>
              {session.inputs.currentSystem.projectOwner ? (
                <div className="flex justify-between gap-2">
                  <dt>Owner</dt>
                  <dd className="truncate">
                    {session.inputs.currentSystem.projectOwner}
                  </dd>
                </div>
              ) : null}
              {session.inputs.currentSystem.targetCrm ? (
                <div className="flex justify-between gap-2">
                  <dt>Target CRM</dt>
                  <dd>{session.inputs.currentSystem.targetCrm}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-2">
                <dt>Currency</dt>
                <dd>{session.inputs.currency}</dd>
              </div>
            </dl>

            <ol className="mt-4 space-y-1">
              {STAGES.map((stage, index) => {
                const done = index < stepIndex;
                const current = index === stepIndex;
                const reachable = index <= session.maxReachableStepIndex;
                return (
                  <li key={stage.id}>
                    <button
                      type="button"
                      disabled={!reachable || isLoading}
                      onClick={() =>
                        reachable && !isLoading && selectStage(stage, index)
                      }
                      className={cn(
                        "flex w-full items-center gap-2 rounded-[var(--sg-radius-md)] px-2 py-2 text-left text-sm transition",
                        current &&
                          "bg-[var(--sg-color-primary-soft)] font-semibold text-[var(--sg-color-primary)]",
                        done && !current && "text-[var(--sg-color-text)]",
                        (!reachable || isLoading) &&
                          "cursor-not-allowed opacity-50",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          done && "bg-[var(--sg-color-success)] text-white",
                          current && "bg-[var(--sg-color-primary)] text-white",
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
                      {stage.label}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 px-3 py-2 text-[11px] text-[var(--sg-color-text-muted)]">
              <p className="font-semibold text-[var(--sg-color-navy)]">
                How this works
              </p>
              <p className="mt-1">
                Models external costs and internal effort across phases. Unknown
                values stay unknown.
              </p>
            </div>
            <a
              href="#how-crm-migration-cost-is-calculated"
              className="mt-3 block px-2 text-xs font-medium text-[var(--sg-color-primary)] underline"
            >
              Methodology →
            </a>
          </Card>
        </nav>

        <Card className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="mb-6 lg:hidden">
            <p className="text-xs font-medium text-[var(--sg-color-text-muted)]">
              Step {stepIndex + 1} of {STAGES.length}: {STAGES[stepIndex]?.label}
            </p>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
              role="progressbar"
              aria-valuenow={stepIndex + 1}
              aria-valuemin={1}
              aria-valuemax={STAGES.length}
            >
              <div
                className="h-full bg-[var(--sg-color-primary)]"
                style={{
                  width: `${((stepIndex + 1) / STAGES.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {session.wizardStepId === "results" && isLoading ? (
            <ResultsLoadingState
              title="Building your migration estimate…"
              description="Aggregating known costs, complexity and unknowns from your inputs."
            />
          ) : null}

          {session.wizardStepId === "results" && !isLoading ? (
            <McResultsDashboard
              inputs={session.inputs}
              result={result}
              patch={patchInputs}
              exporting={exporting}
              onExportPdf={handleExportPdf}
              onExportExcel={handleExportExcel}
              onExportMarkdown={handleExportMarkdown}
              onHandoffTco={handleHandoffTco}
              onHandoffRoi={handleHandoffRoi}
              onHandoffBusinessCase={handleHandoffBusinessCase}
              onHandoffCost={handleHandoffCost}
            />
          ) : null}

          {session.wizardStepId === "current-system" ? (
            <McStepCurrentSystem inputs={session.inputs} patch={patchInputs} />
          ) : null}
          {session.wizardStepId === "data-scope" ? (
            <McStepDataScope inputs={session.inputs} patch={patchInputs} />
          ) : null}
          {session.wizardStepId === "data-quality" ? (
            <McStepDataQuality inputs={session.inputs} patch={patchInputs} />
          ) : null}
          {session.wizardStepId === "mapping" ? (
            <McStepMapping
              inputs={session.inputs}
              patch={patchInputs}
              onImportMapping={handleImportMapping}
            />
          ) : null}
          {session.wizardStepId === "integrations" ? (
            <McStepIntegrations inputs={session.inputs} patch={patchInputs} />
          ) : null}
          {session.wizardStepId === "approach" ? (
            <McStepApproach inputs={session.inputs} patch={patchInputs} />
          ) : null}
          {session.wizardStepId === "internal-effort" ? (
            <McStepInternalEffort inputs={session.inputs} patch={patchInputs} />
          ) : null}
          {session.wizardStepId === "testing-cutover" ? (
            <McStepTestingCutover inputs={session.inputs} patch={patchInputs} />
          ) : null}

          {session.wizardStepId !== "results" ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sg-color-border)] pt-4">
              <Button
                type="button"
                variant="ghost"
                disabled={stepIndex === 0}
                onClick={() => {
                  const prev = Math.max(0, stepIndex - 1);
                  goToStep(STAGES[prev]!.id, prev);
                }}
              >
                Back
              </Button>
              <Button type="button" onClick={completeStep}>
                {nextLabel}
              </Button>
            </div>
          ) : null}

          {resourceLinks.length > 0 && session.wizardStepId === "results" ? (
            <nav
              className="mt-8 border-t border-[var(--sg-color-border)] pt-4"
              aria-label="Related resources"
            >
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {resourceLinks.slice(0, 6).map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-[var(--sg-color-primary)] underline"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </Card>

        <div className="hidden lg:block">
          <McLiveSummary
            result={result}
            projectName={session.inputs.currentSystem.projectName}
            onJumpToResults={() => revealResults({ force: true })}
          />
        </div>
      </div>

      {mobileSummaryOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 lg:hidden">
          <div className="mx-auto max-h-[90vh] max-w-md overflow-y-auto">
            <McLiveSummary
              result={result}
              projectName={session.inputs.currentSystem.projectName}
              onJumpToResults={() => {
                setMobileSummaryOpen(false);
                revealResults({ force: true });
              }}
              onToggleCollapsed={() => setMobileSummaryOpen(false)}
            />
          </div>
        </div>
      ) : (
        <McMobileSummaryBar
          result={result}
          onOpen={() => setMobileSummaryOpen(true)}
        />
      )}
    </div>
  );
}
