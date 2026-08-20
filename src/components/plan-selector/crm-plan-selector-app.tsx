/**
 * CRM Plan Selector interactive app.
 * Persistence: localStorage `sg-crm-plan-selector-v1`
 * Prefill: `?vendor=` or `?product=`
 */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { track } from "@/analytics";
import { FinderStepper } from "@/components/finder/finder-stepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ResultsLoadingState,
  useDelayedResultsReveal,
} from "@/components/tools/results-loading";
import type { CrmPlanSelectorAnswers } from "@/domain";
import { CrmPlanSelectorAnswersSchema } from "@/domain";
import {
  analyzePlanSelection,
  availableRequirementsForVendor,
  classifyVendorSupport,
  downloadPlanSelectorPdf,
  previewPlanSelection,
  type PlanSelectorAnalysis,
  type VendorPlanSupport,
} from "@/services/plan-selector";
import type { PricingSnapshot } from "@/services/pricing";
import { PlanSelectorLiveSummary } from "./live-summary";
import { PlanSelectorResults } from "./results";
import { StepChooseCrm } from "./step-choose-crm";
import { StepGrowth } from "./step-growth";
import { StepRequirements } from "./step-requirements";
import { StepTeam } from "./step-team";
import { StepUsage } from "./step-usage";

const STORAGE_KEY = "sg-crm-plan-selector-v1";

const STAGES = [
  { id: "crm", label: "CRM" },
  { id: "team", label: "Team" },
  { id: "requirements", label: "Requirements" },
  { id: "usage", label: "Usage" },
  { id: "growth", label: "Growth" },
  { id: "results", label: "Results" },
] as const;

type Phase = (typeof STAGES)[number]["id"] | "loading";

type Props = {
  snapshots: PricingSnapshot[];
};

function defaultAnswers(): CrmPlanSelectorAnswers {
  return CrmPlanSelectorAnswersSchema.parse({});
}

function readDraft(): CrmPlanSelectorAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return CrmPlanSelectorAnswersSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function CrmPlanSelectorApp({ snapshots }: Props) {
  const searchParams = useSearchParams();
  const vendorParam =
    searchParams.get("vendor") ?? searchParams.get("product") ?? undefined;

  const [phase, setPhase] = useState<Phase>("crm");
  const [maxPhaseIndex, setMaxPhaseIndex] = useState(0);
  const [answers, setAnswers] = useState<CrmPlanSelectorAnswers>(defaultAnswers);
  const [hydrated, setHydrated] = useState(false);
  const [analysis, setAnalysis] = useState<PlanSelectorAnalysis | null>(null);
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);
  const { isLoading, startReveal, resetReveal } = useDelayedResultsReveal();

  const vendors: VendorPlanSupport[] = useMemo(() => {
    const priority = [
      "hubspot",
      "pipedrive",
      "zoho-crm",
      "freshsales",
      "monday-sales-crm",
      "close",
      "copper",
      "salesforce",
      "attio",
    ];
    const classified = snapshots.map(classifyVendorSupport);
    classified.sort((a, b) => {
      const rank = (s: VendorPlanSupport) =>
        s.status === "supported" ? 0 : s.status === "partial" ? 1 : 2;
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;
      const pa = priority.indexOf(a.productSlug);
      const pb = priority.indexOf(b.productSlug);
      if (pa >= 0 || pb >= 0) {
        return (pa < 0 ? 999 : pa) - (pb < 0 ? 999 : pb);
      }
      return a.name.localeCompare(b.name);
    });
    return classified;
  }, [snapshots]);

  const snapshot = useMemo(
    () => snapshots.find((s) => s.productSlug === answers.productSlug) ?? null,
    [snapshots, answers.productSlug],
  );

  const livePreview = useMemo(
    () => previewPlanSelection(snapshot, answers),
    [snapshot, answers],
  );

  const requirements = useMemo(
    () => (snapshot ? availableRequirementsForVendor(snapshot) : []),
    [snapshot],
  );

  const mustHaveCount = Object.values(answers.requirementPriorities).filter(
    (p) => p === "must",
  ).length;

  useEffect(() => {
    const draft = readDraft();
    let next = draft ?? defaultAnswers();
    if (vendorParam) {
      const match = snapshots.find((s) => s.productSlug === vendorParam);
      if (match) {
        next = { ...next, productSlug: match.productSlug };
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage + ?vendor= hydration
    setAnswers(next);
    setHydrated(true);
    track({ name: "crm_plan_selector_started" });
  }, [vendorParam, snapshots]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore quota
    }
  }, [answers, hydrated]);

  function phaseIndex(p: Phase): number {
    if (p === "loading" || p === "results") return 5;
    return STAGES.findIndex((s) => s.id === p);
  }

  function goToPhase(next: Phase) {
    if (next !== "loading" && next !== "results") {
      resetReveal();
    }
    setPhase(next);
    const idx = phaseIndex(next);
    if (idx >= 0) {
      setMaxPhaseIndex((prev) => Math.max(prev, idx));
    }
    if (next !== "loading" && next !== "results") {
      track({
        name: "crm_plan_step_completed",
        properties: { step: next },
      });
    }
  }

  function patchAnswers(patch: Partial<CrmPlanSelectorAnswers>) {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }

  function selectVendor(slug: string) {
    patchAnswers({ productSlug: slug });
    track({
      name: "crm_plan_vendor_selected",
      properties: { vendor: slug },
    });
  }

  function generateResults() {
    if (!snapshot) return;
    const result = analyzePlanSelection(snapshot, {
      ...answers,
      productSlug: snapshot.productSlug,
    });
    setAnalysis(result);
    goToPhase("loading");
    startReveal(() => {
      goToPhase("results");
      track({
        name: "crm_plan_recommendation_generated",
        properties: {
          vendor: result.productSlug,
          plan: result.recommendedPlan?.slug ?? result.kind,
          confidence: result.confidence,
        },
      });
      for (const entry of result.planLadder) {
        if (entry.status === "failed") {
          track({
            name: "crm_plan_lower_plan_failed",
            properties: { plan: entry.plan.slug },
          });
        }
      }
    });
  }

  async function downloadReport() {
    if (!analysis) return;
    await downloadPlanSelectorPdf(analysis, answers);
  }

  function restart() {
    setAnswers(defaultAnswers());
    setAnalysis(null);
    setMaxPhaseIndex(0);
    goToPhase("crm");
  }

  const activeIndex = phaseIndex(phase);
  const canNextCrm = Boolean(answers.productSlug) && snapshot != null;
  const vendorSupport = vendors.find(
    (v) => v.productSlug === answers.productSlug,
  );
  const canUseVendor =
    vendorSupport?.status === "supported" ||
    vendorSupport?.status === "partial";

  const featureSlugs = new Set(
    snapshot?.featureSupport.map((f) => f.featureSlug) ?? [],
  );

  return (
    <div className="pb-28 lg:pb-8">
      <FinderStepper
        stages={[...STAGES]}
        activeIndex={activeIndex}
        maxReachableIndex={maxPhaseIndex}
        onStageSelect={(id) => {
          if (id === "results" && analysis) goToPhase("results");
          else if (id !== "results") goToPhase(id as Phase);
        }}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.9fr)]">
        <div className="min-w-0">
          <Card className="p-5 sm:p-6">
            {phase === "crm" ? (
              <StepChooseCrm
                vendors={vendors}
                selectedSlug={answers.productSlug}
                onSelect={selectVendor}
              />
            ) : null}
            {phase === "team" ? (
              <StepTeam answers={answers} onChange={patchAnswers} />
            ) : null}
            {phase === "requirements" && snapshot ? (
              <StepRequirements
                requirements={requirements}
                answers={answers}
                onChange={patchAnswers}
              />
            ) : null}
            {phase === "usage" && snapshot ? (
              <StepUsage
                snapshot={snapshot}
                requirements={requirements}
                answers={answers}
                onChange={patchAnswers}
              />
            ) : null}
            {phase === "growth" ? (
              <StepGrowth
                answers={answers}
                onChange={patchAnswers}
                hasSso={featureSlugs.has("sso")}
                hasAuditLogs={featureSlugs.has("audit-logs")}
                hasAdvancedPermissions={featureSlugs.has("role-permissions")}
              />
            ) : null}
            {phase === "loading" || isLoading ? (
              <ResultsLoadingState
                title="Finding your best plan…"
                description="Checking must-haves, seat limits, and published plan matrices."
              />
            ) : null}
            {phase === "results" && analysis && !isLoading ? (
              <PlanSelectorResults
                analysis={analysis}
                onDownload={downloadReport}
                onRestart={restart}
              />
            ) : null}

            {phase !== "loading" && phase !== "results" ? (
              <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-[var(--sg-color-border)] pt-5">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={activeIndex === 0}
                  onClick={() => {
                    const prev = STAGES[activeIndex - 1];
                    if (prev) goToPhase(prev.id);
                  }}
                >
                  Back
                </Button>
                {phase === "growth" ? (
                  <Button
                    type="button"
                    size="lg"
                    disabled={!canUseVendor || !snapshot}
                    onClick={generateResults}
                  >
                    See my plan recommendation
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    disabled={
                      (phase === "crm" && (!canNextCrm || !canUseVendor)) ||
                      false
                    }
                    onClick={() => {
                      const next = STAGES[activeIndex + 1];
                      if (next && next.id !== "results") goToPhase(next.id);
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
            ) : null}
          </Card>

          {phase === "crm" &&
          answers.productSlug &&
          vendorSupport &&
          !canUseVendor ? (
            <p className="mt-4 text-sm text-[var(--sg-color-warning)]" role="status">
              Plan comparison is not yet available for this CRM. Try{" "}
              <a
                href="/tools/crm-finder/"
                className="underline underline-offset-2"
              >
                CRM Finder
              </a>{" "}
              or the{" "}
              <a
                href={`/software/${answers.productSlug}/`}
                className="underline underline-offset-2"
              >
                product review
              </a>
              .
            </p>
          ) : null}
        </div>

        <aside className="min-w-0">
          <PlanSelectorLiveSummary
            analysis={
              phase === "results" && analysis ? analysis : livePreview
            }
            productName={snapshot?.name}
            mustHaveCount={
              (livePreview ?? analysis)?.mustHaveSlugs.length ?? mustHaveCount
            }
            collapsed={summaryCollapsed}
            onToggleCollapsed={() => setSummaryCollapsed((v) => !v)}
            className="lg:block"
          />
          <nav
            className="mt-4 hidden text-sm text-[var(--sg-color-text-muted)] lg:block"
            aria-label="Helpful links"
          >
            <p className="font-semibold text-[var(--sg-color-navy)]">
              How it works
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#how-it-works" className="hover:underline">
                  Methodology
                </a>
              </li>
              <li>
                <a href="/tools/crm-finder/" className="hover:underline">
                  Need help choosing a CRM?
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
