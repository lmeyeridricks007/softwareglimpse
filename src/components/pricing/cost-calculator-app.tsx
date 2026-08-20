/**
 * Cost Calculator interactive app (CRM + Sales Intelligence presets).
 *
 * Persistence:
 * - Draft: localStorage via config.storageKey
 * - Finder handoff: read config.finderStorageKey
 * - `?from=finder` is a UX hint only
 *
 * Scoring: pure `compareProductCosts` — never invents implementation/training fees
 * or credit dollar totals.
 */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { track } from "@/analytics";
import {
  crmRequirementsFromCalculatorInput,
  crmRequirementsFromDecisionProfile,
  type BillingPreference,
  type ProductCostEstimate,
} from "@/domain";
import {
  compareProductCosts,
  deriveCostRangeSummary,
  summarizeFeatureCoverage,
  type CompareSortMode,
  type PricingSnapshot,
} from "@/services/pricing";
import {
  FinderPageHero,
  calculatorValuePropsFor,
} from "@/components/finder/finder-page-hero";
import { FinderStepper } from "@/components/finder/finder-stepper";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  CalculatorEstimateCard,
  CalculatorGuidesCard,
  MobileEstimateBar,
} from "./calculator-sidebar";
import { BillingPreferenceControl } from "./billing-preference";
import { CalculatorHeroPreview } from "./calculator-hero-preview";
import { CapabilityValueMatrix } from "./capability-value-matrix";
import {
  CRM_COST_CALCULATOR_CONFIG,
  type CostCalculatorConfig,
} from "./cost-calculator-config";
import { CostComparisonChart } from "./cost-comparison-chart";
import { CostComparisonTable } from "./cost-comparison-table";
import { CostSummary } from "./cost-summary";
import { FeatureRequirementPicker } from "./feature-requirement-picker";
import { PricingInsightPanel } from "./pricing-insight";
import { ProductCostCard } from "./product-cost-card";
import { TeamSizeExplorer } from "./team-size-explorer";
import { UserCountInput } from "./user-count-input";
import {
  ResultsLoadingState,
  useDelayedResultsReveal,
} from "@/components/tools/results-loading";

const STAGES_BASE = [
  { id: "business", label: "Business Details" },
  { id: "requirements", label: "Requirements" },
  { id: "included", label: "What’s Included" },
  { id: "results", label: "Results" },
] as const;

type Phase = "business" | "requirements" | "included" | "loading" | "results";

type DraftState = {
  crmUsers: number;
  requiredFeatureSlugs: string[];
  billingPreference: BillingPreference;
  fromFinder?: boolean;
  finderOrderSlugs?: string[];
};

type FinderStored = {
  crmUsers?: number;
  requiredFeatureSlugs?: string[];
  resultOrder?: string[];
};

type Props = {
  snapshots: PricingSnapshot[];
  resourceLinks?: Array<{ href: string; label: string }>;
  title?: string;
  description?: string;
  /** Defaults to CRM calculator behaviour. */
  config?: CostCalculatorConfig;
};

function defaultDraft(): DraftState {
  return {
    crmUsers: 10,
    requiredFeatureSlugs: [],
    billingPreference: "monthly",
  };
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function billingLabel(pref: BillingPreference) {
  if (pref === "either") return "Either";
  return pref;
}

export function CostCalculatorApp({
  snapshots,
  resourceLinks = [],
  title,
  description,
  config = CRM_COST_CALCULATOR_CONFIG,
}: Props) {
  const resolvedTitle = title ?? config.defaultTitle;
  const resolvedDescription = description ?? config.defaultDescription;
  const stages = [
    STAGES_BASE[0],
    {
      id: "requirements" as const,
      label: config.requirementsHeading,
    },
    STAGES_BASE[2],
    STAGES_BASE[3],
  ];

  const searchParams = useSearchParams();
  const fromFinderHint = searchParams.get("from") === "finder";
  const fromRequirementsHint = searchParams.get("from") === "requirements";

  const [phase, setPhase] = useState<Phase>("business");
  const [maxPhaseIndex, setMaxPhaseIndex] = useState(0);
  const [draft, setDraft] = useState<DraftState>(defaultDraft);
  const [finderBanner, setFinderBanner] = useState(false);
  const [sortMode, setSortMode] = useState<CompareSortMode>("lowest-cost");
  const [estimates, setEstimates] = useState<ProductCostEstimate[]>([]);
  const [comparisonNotes, setComparisonNotes] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { isLoading, startReveal, resetReveal } = useDelayedResultsReveal();

  function phaseToIndex(p: Phase): number {
    if (p === "loading" || p === "results") return 3;
    return stages.findIndex((s) => s.id === p);
  }

  function goToPhase(next: Phase) {
    if (next !== "loading" && next !== "results") {
      resetReveal();
    }
    setPhase(next);
    const idx = phaseToIndex(next);
    if (idx >= 0) {
      setMaxPhaseIndex((prev) => Math.max(prev, idx));
    }
  }

  function selectStage(stageId: string) {
    if (stageId === "results") {
      if (estimates.length > 0 && (phase === "results" || maxPhaseIndex >= 3)) {
        goToPhase("results");
        return;
      }
      runEstimate();
      return;
    }
    if (
      stageId === "business" ||
      stageId === "requirements" ||
      stageId === "included"
    ) {
      goToPhase(stageId);
    }
  }

  const wizardStepper = (
    <FinderStepper
      stages={[...stages]}
      activeIndex={Math.max(0, phaseToIndex(phase))}
      maxReachableIndex={maxPhaseIndex}
      onStageSelect={(id) => selectStage(id)}
      className="mb-6"
    />
  );

  useEffect(() => {
    const costDraft = readJson<Partial<DraftState>>(config.storageKey);
    const finder = readJson<FinderStored>(config.finderStorageKey);
    const decision = config.loadDecisionProfile();

    let next = defaultDraft();
    if (costDraft) {
      next = {
        ...next,
        ...costDraft,
        requiredFeatureSlugs: costDraft.requiredFeatureSlugs ?? [],
      };
    }

    if (decision && fromRequirementsHint) {
      const reqs = crmRequirementsFromDecisionProfile(decision);
      if (reqs) {
        next = {
          ...next,
          crmUsers: reqs.crmUsers,
          requiredFeatureSlugs: reqs.requiredFeatureSlugs,
          billingPreference: reqs.billingPreference,
          fromFinder: false,
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional localStorage hydration
        setFinderBanner(true);
        setDraft(next);
        setHydrated(true);
        return;
      }
    }

    const hasFinderRequirements =
      finder &&
      typeof finder.crmUsers === "number" &&
      Array.isArray(finder.requiredFeatureSlugs);

    if (hasFinderRequirements || fromFinderHint) {
      if (hasFinderRequirements && finder) {
        next = {
          ...next,
          crmUsers: finder.crmUsers!,
          requiredFeatureSlugs: finder.requiredFeatureSlugs ?? [],
          fromFinder: true,
          finderOrderSlugs: finder.resultOrder,
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional localStorage hydration
        setFinderBanner(true);
      } else if (fromFinderHint) {
        setFinderBanner(true);
      }
    }

    setDraft(next);
    setHydrated(true);
  }, [fromFinderHint, fromRequirementsHint, config]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(config.storageKey, JSON.stringify(draft));
    } catch {
      // private mode / quota
    }
  }, [draft, hydrated, config.storageKey]);

  const fixtureBySlug = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const snap of snapshots) {
      map.set(snap.productSlug, snap.hasFixtureResearch);
    }
    return map;
  }, [snapshots]);

  const logoBySlug = useMemo(() => {
    const map: Record<string, { src: string; alt: string } | undefined> = {};
    for (const snap of snapshots) {
      map[snap.productSlug] = snap.logo;
    }
    return map;
  }, [snapshots]);

  const liveEstimates = useMemo(() => {
    const requirements = crmRequirementsFromCalculatorInput({
      crmUsers: draft.crmUsers,
      requiredFeatureSlugs: draft.requiredFeatureSlugs,
      billingPreference: draft.billingPreference,
    });
    return compareProductCosts(snapshots, requirements, {
      sortMode: "lowest-cost",
      finderOrderSlugs: draft.finderOrderSlugs,
    }).results;
  }, [draft, snapshots]);

  const displayEstimates =
    phase === "results" || phase === "loading" ? estimates : liveEstimates;

  const availableSortModes = useMemo(() => {
    const modes: { value: CompareSortMode; label: string }[] = [
      { value: "lowest-cost", label: "Lowest cost" },
      { value: "input-order", label: "Catalogue order" },
    ];
    if (draft.finderOrderSlugs && draft.finderOrderSlugs.length > 0) {
      modes.push({ value: "finder-order", label: "Finder order" });
    }
    return modes;
  }, [draft.finderOrderSlugs]);

  function clearFinderHandoff() {
    setFinderBanner(false);
    setDraft((prev) => ({
      ...prev,
      fromFinder: false,
      finderOrderSlugs: undefined,
    }));
  }

  function runEstimate() {
    const requirements = crmRequirementsFromCalculatorInput({
      crmUsers: draft.crmUsers,
      requiredFeatureSlugs: draft.requiredFeatureSlugs,
      billingPreference: draft.billingPreference,
    });

    const comparison = compareProductCosts(snapshots, requirements, {
      sortMode,
      finderOrderSlugs: draft.finderOrderSlugs,
    });

    setEstimates(comparison.results);
    setComparisonNotes(comparison.notes ?? []);
    goToPhase("loading");
    startReveal(() => {
      goToPhase("results");
      track({
        name: config.analytics.completed,
        properties: {
          users: draft.crmUsers,
          features: draft.requiredFeatureSlugs.length,
          billing: draft.billingPreference,
          results: comparison.results.length,
          fromFinder: Boolean(draft.fromFinder),
        },
      });

      for (const result of comparison.results.slice(0, 5)) {
        track({
          name: config.analytics.resultViewed,
          properties: {
            slug: result.productSlug,
            status: result.status,
          },
        });
      }
    });
  }

  function changeSort(next: CompareSortMode) {
    setSortMode(next);
    track({ name: config.analytics.sortChanged, properties: { sort: next } });
    if (phase === "results") {
      const requirements = crmRequirementsFromCalculatorInput({
        crmUsers: draft.crmUsers,
        requiredFeatureSlugs: draft.requiredFeatureSlugs,
        billingPreference: draft.billingPreference,
      });
      const comparison = compareProductCosts(snapshots, requirements, {
        sortMode: next,
        finderOrderSlugs: draft.finderOrderSlugs,
      });
      setEstimates(comparison.results);
      setComparisonNotes(comparison.notes ?? []);
    }
  }

  useEffect(() => {
    track({ name: config.analytics.started });
  }, [config.analytics.started]);

  const range = deriveCostRangeSummary(displayEstimates);
  const lowestSlug = range?.lowest.productSlug;
  const preferredExplorerSlugs = range?.sorted
    .slice(0, 4)
    .map((r) => r.productSlug);

  const sidebar = (
    <aside className="hidden space-y-5 lg:sticky lg:top-24 lg:block">
      <CalculatorEstimateCard
        estimates={displayEstimates}
        users={draft.crmUsers}
        requiredCapabilityCount={draft.requiredFeatureSlugs.length}
        billingLabel={billingLabel(draft.billingPreference)}
        logos={logoBySlug}
        compareHref={`/compare/?category=${encodeURIComponent(config.categorySlug)}#published-comparisons`}
        compareLabel={`Compare matching ${config.productNounPlural}`}
        onViewResults={
          phase !== "results" && phase !== "loading"
            ? () => {
                runEstimate();
              }
            : undefined
        }
      />
      <CalculatorGuidesCard items={resourceLinks} />
    </aside>
  );

  let main: ReactNode;

  if (phase === "business") {
    main = (
      <Card className="p-5 sm:p-7">
        {wizardStepper}
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          Tell us about your business
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          These details help us calculate the most accurate list-price costs.
        </p>

        {finderBanner ? (
          <div
            role="status"
            className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-primary-soft)] px-4 py-3 text-sm"
          >
            <p>Using requirements from {config.productNoun} Finder</p>
            <button
              type="button"
              onClick={clearFinderHandoff}
              className="font-medium underline-offset-2 hover:underline"
            >
              Clear finder inputs
            </button>
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <UserCountInput
            value={draft.crmUsers}
            onChange={(crmUsers) => setDraft((prev) => ({ ...prev, crmUsers }))}
            description={config.seatsDescription}
          />
          <BillingPreferenceControl
            variant="select"
            value={draft.billingPreference}
            onChange={(billingPreference) =>
              setDraft((prev) => ({ ...prev, billingPreference }))
            }
          />
        </div>

        <Alert variant="info" className="mt-6" title="How estimates work">
          We’ll calculate verified list-price costs across{" "}
          <strong className="font-medium text-[var(--sg-color-text)]">
            {snapshots.length} {config.estimateAlertSuffix}
          </strong>{" "}
          in our catalogue
          {config.categorySlug !== "crm"
            ? ". Usage-based packs and custom quotes stay unknown — we never invent those dollar totals"
            : ""}
          . Affiliate relationships never change amounts.
        </Alert>

        <div className="mt-6">
          <Button
            type="button"
            size="lg"
            onClick={() => goToPhase("requirements")}
          >
            Next step →
          </Button>
        </div>
      </Card>
    );
  } else if (phase === "requirements") {
    main = (
      <Card className="p-5 sm:p-7">
        {wizardStepper}
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          {config.requirementsHeading}
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Select must-have capabilities. We only estimate plans when research
          supports coverage — we never invent features.
        </p>
        <div className="mt-6">
          <FeatureRequirementPicker
            values={draft.requiredFeatureSlugs}
            onChange={(requiredFeatureSlugs) =>
              setDraft((prev) => ({ ...prev, requiredFeatureSlugs }))
            }
            options={config.capabilityOptions}
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => goToPhase("business")}
          >
            Back
          </Button>
          <Button type="button" onClick={() => goToPhase("included")}>
            Next step →
          </Button>
        </div>
      </Card>
    );
  } else if (phase === "included") {
    main = (
      <Card className="p-5 sm:p-7">
        {wizardStepper}
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          What’s included in these estimates?
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          We only price verified public plan rules. We do not invent
          implementation, training, or migration fees.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {config.includedItems.map((item) => (
            <li
              key={item.title}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-4"
            >
              <p className="text-sm font-semibold text-[var(--sg-color-text)]">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => goToPhase("requirements")}
          >
            Back
          </Button>
          <Button type="button" size="lg" onClick={runEstimate}>
            See cost results →
          </Button>
        </div>
      </Card>
    );
  } else if (phase === "loading" || isLoading) {
    main = (
      <ResultsLoadingState
        title={config.loadingTitle}
        description={config.loadingDescription}
      />
    );
  } else {
    main = (
      <div id={`${config.categorySlug}-cost-results`} className="scroll-mt-24 space-y-8">
        <Card className="p-5 sm:p-7">
          {wizardStepper}
          <fieldset>
            <legend className="sr-only">Sort results</legend>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Sort results"
            >
              {availableSortModes.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => changeSort(mode.value)}
                  aria-pressed={sortMode === mode.value}
                  className={`min-h-10 rounded-[var(--sg-radius-md)] border px-3 py-2 text-sm font-medium ${
                    sortMode === mode.value
                      ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                      : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </fieldset>
          {comparisonNotes.length > 0 ? (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {comparisonNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
        </Card>

        <CostSummary
          estimates={estimates}
          users={draft.crmUsers}
          requiredCapabilityCount={draft.requiredFeatureSlugs.length}
          productNoun={config.productNoun}
          productNounPlural={config.productNounPlural}
        />

        <CostComparisonChart
          estimates={estimates}
          logos={logoBySlug}
          highlightSlug={lowestSlug}
          productNoun={config.productNoun}
        />

        <CapabilityValueMatrix
          estimates={estimates}
          snapshots={snapshots}
          requiredFeatureSlugs={draft.requiredFeatureSlugs}
        />

        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
            {config.resultsHeading}
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Compact cards for each catalogue product in your result set.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {estimates.map((estimate) => {
              const snap = snapshots.find(
                (s) => s.productSlug === estimate.productSlug,
              );
              const coverage = summarizeFeatureCoverage(
                snap?.featureSupport ?? [],
                draft.requiredFeatureSlugs,
              );
              return (
                <ProductCostCard
                  key={estimate.productSlug}
                  estimate={estimate}
                  fixture={fixtureBySlug.get(estimate.productSlug)}
                  logo={snap?.logo}
                  coverage={coverage}
                  isLowestCost={estimate.productSlug === lowestSlug}
                  hasFreePlan={snap?.pricing?.hasFreePlan}
                  hasFreeTrial={
                    snap?.pricing?.hasFreeTrial ||
                    snap?.pricing?.plans?.some((p) => p.hasFreeTrial)
                  }
                />
              );
            })}
          </div>
        </div>

        <TeamSizeExplorer
          snapshots={snapshots}
          requiredFeatureSlugs={draft.requiredFeatureSlugs}
          billingPreference={draft.billingPreference}
          preferredSlugs={preferredExplorerSlugs}
          currentUsers={draft.crmUsers}
          productNoun={config.productNoun}
        />

        <div className="rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)]/60 p-5 sm:p-8">
          <CostComparisonTable
            estimates={estimates}
            snapshots={snapshots}
            requiredFeatureSlugs={draft.requiredFeatureSlugs}
            users={draft.crmUsers}
            productNoun={config.productNoun}
          />
        </div>

        <PricingInsightPanel estimates={estimates} />

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => goToPhase("business")}
          >
            Calculate differently
          </Button>
          {config.secondaryToolHref && config.secondaryToolLabel ? (
            <ButtonLink href={config.secondaryToolHref}>
              {config.secondaryToolLabel}
            </ButtonLink>
          ) : null}
          <ButtonLink href={config.finderHref} variant="outline">
            {config.finderLabel}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div id={`${config.categorySlug}-cost-calculator`} className="scroll-mt-8">
      <FinderPageHero
        title={resolvedTitle}
        description={resolvedDescription}
        valueProps={calculatorValuePropsFor(config.productNounPlural)}
        className="mt-2"
        visualSlot={
          <CalculatorHeroPreview
            estimates={liveEstimates}
            users={draft.crmUsers}
            requiredCapabilityCount={draft.requiredFeatureSlugs.length}
          />
        }
      />

      {/* Mobile live preview */}
      <div className="mt-6 lg:hidden">
        <CalculatorHeroPreview
          estimates={liveEstimates}
          users={draft.crmUsers}
          requiredCapabilityCount={draft.requiredFeatureSlugs.length}
        />
      </div>

      <div className="mt-8 grid gap-8 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,19rem)] lg:items-start lg:pb-0">
        <div className="min-w-0">{main}</div>
        {sidebar}
      </div>

      {phase !== "results" && phase !== "loading" ? (
        <MobileEstimateBar
          estimates={liveEstimates}
          onViewResults={runEstimate}
          resultsHref={`#${config.categorySlug}-cost-results`}
        />
      ) : phase === "results" ? (
        <MobileEstimateBar
          estimates={estimates}
          resultsHref={`#${config.categorySlug}-cost-results`}
        />
      ) : null}
    </div>
  );
}
