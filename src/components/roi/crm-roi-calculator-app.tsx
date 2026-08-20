/**
 * CRM ROI Calculator interactive app.
 *
 * Persistence: localStorage `sg-crm-roi-v1`
 * Cost import: reads `sg-crm-cost-v1` with explicit confirmation
 * Business case handoff: `sg-crm-roi-business-case-v1` after user confirms
 */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Lock } from "lucide-react";
import { track } from "@/analytics";
import type { RoiInputs, RoiSession, RoiWizardStep } from "@/domain";
import {
  applyCostCalculatorHandoff,
  buildHandoffPayload,
  computeRoi,
  createEmptyRoiSession,
  currentHoursForRole,
  loadCrmRoiSession,
  resetCrmRoiSession,
  resolveHoursSaved,
  saveBusinessCaseHandoff,
  saveCrmRoiSession,
} from "@/services/roi";
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
  RoiStepAssumptions,
  RoiStepCostRevenue,
} from "./roi-steps-part2";
import {
  RoiStepCurrentState,
  RoiStepInvestment,
  RoiStepProductivity,
} from "./roi-steps-part1";
import { RoiLiveSummary, RoiMobileSummaryBar } from "./roi-live-summary";
import { RoiResultsDashboard } from "./roi-results";

const STAGES: Array<{ id: RoiWizardStep; label: string }> = [
  { id: "current-state", label: "Current State" },
  { id: "crm-investment", label: "CRM Investment" },
  { id: "productivity", label: "Productivity Benefits" },
  { id: "cost-revenue", label: "Revenue / Cost Benefits" },
  { id: "assumptions", label: "Assumptions" },
  { id: "results", label: "Results" },
];

const COST_STORAGE_KEY = "sg-crm-cost-v1";

type CostDraft = {
  crmUsers?: number;
  billingPreference?: string;
  estimatedAnnualMajor?: number;
  productName?: string;
  currency?: string;
};

type Props = {
  resourceLinks?: Array<{ href: string; label: string }>;
  title?: string;
  description?: string;
  titleElement?: "h1" | "h2" | "none";
};

function readCostDraft(): CostDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COST_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CostDraft;
  } catch {
    return null;
  }
}

export function CrmRoiCalculatorApp({
  resourceLinks = [],
  title = "CRM ROI Calculator",
  description = "Estimate CRM ROI using your own costs, productivity assumptions and expected business outcomes — without pretending uncertain benefits are guaranteed.",
  titleElement = "none",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<RoiSession>(() =>
    createEmptyRoiSession(),
  );
  const [hydrated, setHydrated] = useState(false);
  const [costDraft, setCostDraft] = useState<CostDraft | null>(null);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sensitivityRealization, setSensitivityRealization] = useState<
    number | null
  >(null);
  const [sensitivityHours, setSensitivityHours] = useState<number | null>(null);
  const startedRef = useRef(false);
  const resultTrackedRef = useRef(false);
  const { isLoading, startReveal, resetReveal } = useDelayedResultsReveal();

  useEffect(() => {
    const stored = loadCrmRoiSession() ?? createEmptyRoiSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration from localStorage
    setSession(stored);
    setCostDraft(readCostDraft());
    setHydrated(true);
    if (!startedRef.current) {
      startedRef.current = true;
      track({
        name: "roi_started",
        properties: {
          from: searchParams.get("from") ?? "direct",
        },
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!hydrated) return;
    saveCrmRoiSession(session);
  }, [session, hydrated]);

  const stepIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.id === session.wizardStepId),
  );

  const displayInputs = useMemo(() => {
    let inputs = session.inputs;
    if (sensitivityRealization != null || sensitivityHours != null) {
      inputs = {
        ...inputs,
        productivity: {
          ...inputs.productivity,
          realizationFactor:
            sensitivityRealization ?? inputs.productivity.realizationFactor,
          salesReps:
            sensitivityHours != null
              ? {
                  ...inputs.productivity.salesReps,
                  inputMode: "hours-saved",
                  hoursSavedPerWeek: sensitivityHours,
                }
              : inputs.productivity.salesReps,
        },
      };
    }
    return inputs;
  }, [session.inputs, sensitivityRealization, sensitivityHours]);

  const result = useMemo(
    () => computeRoi(displayInputs),
    [displayInputs],
  );

  useEffect(() => {
    if (
      session.wizardStepId === "results" &&
      !isLoading &&
      !resultTrackedRef.current
    ) {
      resultTrackedRef.current = true;
      track({
        name: "roi_result_viewed",
        properties: { status: result.status },
      });
    }
  }, [session.wizardStepId, result.status, isLoading]);

  const patchInputs = (updater: (prev: RoiInputs) => RoiInputs) => {
    setSession((prev) => ({
      ...prev,
      inputs: updater(prev.inputs),
      updatedAt: new Date().toISOString(),
    }));
  };

  const goToStep = (id: RoiWizardStep, index: number) => {
    if (id !== "results") {
      resetReveal();
    }
    setSession((prev) => ({
      ...prev,
      wizardStepId: id,
      maxReachableStepIndex: Math.max(prev.maxReachableStepIndex, index),
      updatedAt: new Date().toISOString(),
    }));
  };

  /** Navigate to results with the shared loading reveal used by other tools. */
  const revealResults = (opts?: { force?: boolean }) => {
    if (isLoading) return;
    const alreadyOnResults =
      session.wizardStepId === "results" && !opts?.force;
    if (alreadyOnResults) {
      return;
    }
    // Keep stepper on Results while loading (index 5).
    setSession((prev) => ({
      ...prev,
      wizardStepId: "results",
      maxReachableStepIndex: Math.max(prev.maxReachableStepIndex, 5),
      updatedAt: new Date().toISOString(),
    }));
    startReveal(() => {
      // status flips to ready; results panel renders when !isLoading
    });
  };

  const completeStep = () => {
    track({
      name: "roi_step_completed",
      properties: { step: session.wizardStepId },
    });
    if (stepIndex === STAGES.length - 2) {
      revealResults({ force: true });
      return;
    }
    const nextIndex = Math.min(STAGES.length - 1, stepIndex + 1);
    const next = STAGES[nextIndex];
    goToStep(next.id, nextIndex);
  };

  const selectStage = (stage: (typeof STAGES)[number], index: number) => {
    if (stage.id === "results") {
      if (session.wizardStepId === "results" && !isLoading) {
        return;
      }
      revealResults({ force: true });
      return;
    }
    goToStep(stage.id, index);
  };

  const handleImportCost = () => {
    const draft = costDraft ?? readCostDraft();
    if (!draft) return;
    const confirmed = window.confirm(
      "Import Cost Calculator estimates into CRM investment? This will overwrite licence fields if an annual estimate is present.",
    );
    if (!confirmed) return;
    setSession((prev) =>
      applyCostCalculatorHandoff(prev, draft, { overwriteInvestment: true }),
    );
    track({ name: "roi_cost_calculator_imported" });
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const { downloadRoiPdf } = await import("@/services/roi/export");
      await downloadRoiPdf(displayInputs, result);
      track({ name: "roi_exported", properties: { format: "pdf" } });
    } finally {
      setExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const { downloadRoiExcel } = await import("@/services/roi/export");
      await downloadRoiExcel(displayInputs, result);
      track({ name: "roi_exported", properties: { format: "xlsx" } });
    } finally {
      setExporting(false);
    }
  };

  const handleBusinessCase = () => {
    const confirmed = window.confirm(
      "Save these ROI results for your CRM Business Case template on this device?",
    );
    if (!confirmed) return;
    const payload = buildHandoffPayload(displayInputs, result);
    saveBusinessCaseHandoff(payload);
    setSession((prev) => ({
      ...prev,
      businessCaseHandoffConfirmedAt: new Date().toISOString(),
    }));
    track({ name: "roi_business_case_clicked" });
    router.push("/resources/crm-business-case-template/");
  };

  const baseHours = resolveHoursSaved(
    session.inputs.productivity.salesReps,
    currentHoursForRole(session.inputs, "salesReps"),
    session.inputs.activeScenario,
  );

  const roiValueProps = [
    CALCULATOR_VALUE_PROPS[0],
    {
      ...CALCULATOR_VALUE_PROPS[1],
      title: "Your assumptions stay explicit",
      body: "Verified, estimated, and scenario inputs stay labeled.",
    },
    {
      ...CALCULATOR_VALUE_PROPS[2],
      title: "No invented vendor ROI claims",
      body: "Blank uplifts stay excluded — never industry averages.",
    },
  ];

  if (!hydrated) {
    return (
      <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]" role="status">
        Loading ROI calculator…
      </p>
    );
  }

  return (
    <div className="mt-6 pb-24 lg:pb-10">
      <FinderPageHero
        title={title}
        description={description}
        valueProps={roiValueProps}
        visual="calculator"
        badge="Free · No signup"
        titleElement={titleElement}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={() => goToStep("current-state", 0)}>
          Calculate CRM ROI
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            router.push("/tools/crm-cost-calculator/");
          }}
        >
          Estimate CRM Costs
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            if (window.confirm("Start over and clear saved ROI inputs?")) {
              resetReveal();
              setSession(resetCrmRoiSession());
              setSensitivityHours(null);
              setSensitivityRealization(null);
              resultTrackedRef.current = false;
            }
          }}
        >
          Start Over
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)_18rem]">
        {/* Left stepper */}
        <nav
          aria-label="ROI calculator progress"
          className="hidden lg:block"
        >
          <Card className="sticky top-4 px-3 py-4">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              SoftwareGlimpse CRM ROI
            </p>
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
                          done &&
                            "bg-[var(--sg-color-success)] text-white",
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
                      {stage.label}
                    </button>
                  </li>
                );
              })}
            </ol>
            <a
              href="#how-crm-roi-is-calculated"
              className="mt-4 block px-2 text-xs font-medium text-[var(--sg-color-primary)] underline"
            >
              How this calculator works →
            </a>
            <dl className="mt-4 space-y-1 border-t border-[var(--sg-color-border)] px-2 pt-3 text-[11px] text-[var(--sg-color-text-muted)]">
              <div className="flex justify-between gap-2">
                <dt>Analysis</dt>
                <dd className="truncate font-medium text-[var(--sg-color-text)]">
                  {session.inputs.analysisName}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Currency</dt>
                <dd>{session.inputs.currency}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Horizon</dt>
                <dd>{session.inputs.horizonYears} years</dd>
              </div>
            </dl>
          </Card>
        </nav>

        {/* Center */}
        <Card className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="mb-6 lg:hidden">
            <p className="text-xs font-medium text-[var(--sg-color-text-muted)]">
              Step {stepIndex + 1} of {STAGES.length}: {STAGES[stepIndex].label}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
              <div
                className="h-full bg-[var(--sg-color-primary)]"
                style={{
                  width: `${((stepIndex + 1) / STAGES.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {session.wizardStepId === "current-state" ? (
            <RoiStepCurrentState inputs={session.inputs} patch={patchInputs} />
          ) : null}
          {session.wizardStepId === "crm-investment" ? (
            <RoiStepInvestment
              inputs={session.inputs}
              patch={patchInputs}
              costDraftAvailable={Boolean(costDraft)}
              onImportCost={handleImportCost}
            />
          ) : null}
          {session.wizardStepId === "productivity" ? (
            <RoiStepProductivity
              inputs={session.inputs}
              patch={patchInputs}
            />
          ) : null}
          {session.wizardStepId === "cost-revenue" ? (
            <RoiStepCostRevenue inputs={session.inputs} patch={patchInputs} />
          ) : null}
          {session.wizardStepId === "assumptions" ? (
            <RoiStepAssumptions
              inputs={session.inputs}
              patch={patchInputs}
              assumptionRows={result.assumptions}
            />
          ) : null}
          {session.wizardStepId === "results" && isLoading ? (
            <ResultsLoadingState
              title="Calculating CRM ROI…"
              description="Building your financial summary from the costs, productivity assumptions and scenarios you entered."
            />
          ) : null}
          {session.wizardStepId === "results" && !isLoading ? (
            <RoiResultsDashboard
              result={result}
              activeScenario={session.inputs.activeScenario}
              onScenarioChange={(key) => {
                patchInputs((p) => ({ ...p, activeScenario: key }));
                track({
                  name: "roi_scenario_changed",
                  properties: { scenario: key },
                });
              }}
              onExportPdf={handleExportPdf}
              onExportExcel={handleExportExcel}
              onBusinessCase={handleBusinessCase}
              onAdjustAssumptions={() => goToStep("assumptions", 4)}
              onEditInvestment={() => goToStep("crm-investment", 1)}
              onEditProductivity={() => goToStep("productivity", 2)}
              sensitivityRealization={
                sensitivityRealization ??
                session.inputs.productivity.realizationFactor
              }
              sensitivityHours={sensitivityHours ?? baseHours}
              onSensitivityRealization={setSensitivityRealization}
              onSensitivityHours={setSensitivityHours}
              exporting={exporting}
            />
          ) : null}

          {session.wizardStepId !== "results" && !isLoading ? (
            <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-[var(--sg-color-border)] pt-5">
              <Button
                type="button"
                variant="secondary"
                disabled={stepIndex === 0}
                onClick={() =>
                  goToStep(STAGES[stepIndex - 1].id, stepIndex - 1)
                }
              >
                Back
              </Button>
              <Button type="button" onClick={completeStep}>
                {stepIndex === STAGES.length - 2
                  ? "See ROI results"
                  : "Continue"}
              </Button>
            </div>
          ) : null}
        </Card>

        {/* Right live summary */}
        <div className="hidden lg:block">
          <RoiLiveSummary
            result={result}
            analysisName={session.inputs.analysisName}
            onJumpToResults={() => revealResults({ force: true })}
          />
        </div>
      </div>

      {mobileSummaryOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 lg:hidden">
          <div className="mx-auto max-h-[90vh] max-w-md overflow-y-auto">
            <RoiLiveSummary
              result={result}
              analysisName={session.inputs.analysisName}
              onJumpToResults={() => {
                setMobileSummaryOpen(false);
                revealResults({ force: true });
              }}
              onToggleCollapsed={() => setMobileSummaryOpen(false)}
            />
          </div>
        </div>
      ) : (
        <RoiMobileSummaryBar
          result={result}
          onOpen={() => setMobileSummaryOpen(true)}
        />
      )}

      {resourceLinks.length > 0 ? (
        <ul className="mt-10 flex flex-wrap gap-3 text-sm">
          {resourceLinks.map((l) => (
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
      ) : null}
    </div>
  );
}
