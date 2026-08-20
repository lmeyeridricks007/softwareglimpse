/**
 * CRM TCO Calculator — ownership costs on top of canonical pricing engine.
 * Persistence: localStorage `sg-crm-tco-v1`
 * Licence math: compareProductCosts / calculateProductCost only.
 */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Calculator,
  Check,
  Copy,
  Download,
  Eye,
  Plus,
  Printer,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { track } from "@/analytics";
import {
  formatMoney,
  type BillingPreference,
  type CrmDecisionProfile,
  type ImplementationApproach,
  type MigrationNeeded,
  type SeatGrowthMode,
  type TCOHorizonYears,
  type TCOScenario,
  type TCOSession,
  type TrainingMethod,
} from "@/domain";
import { loadCrmDecisionProfile } from "@/services/decision-profile/client";
import {
  saveCrmDecisionProfile,
  touchCrmDecisionProfile,
} from "@/services/decision-profile/persistence";
import {
  isCalculablePlan,
  type PricingSnapshot,
} from "@/services/pricing";
import {
  applyCostCalculatorHandoff,
  buildSensitivityAnalysis,
  computeTco,
  createEmptyTcoSession,
  deleteScenario,
  deriveCostDrivers,
  duplicateScenario,
  getActiveScenario,
  loadCrmTcoSession,
  majorToMinor,
  minorToMajor,
  requiredFeaturesFromProfile,
  resetCrmTcoSession,
  saveCrmTcoSession,
  sessionFromDecisionProfile,
  summarizeProfile,
  tcoToCsv,
  tcoToPlainText,
  updateActiveScenario,
} from "@/services/tco";
import {
  buildImplementationEstimateTemplates,
  buildMigrationEstimateTemplates,
  adminHoursWeekPresets,
  INTERNAL_HOURLY_PRESETS,
  trainingHoursPerUserPresets,
  supportMonthlyPresets,
} from "@/services/tco/estimate-helpers";
import { FinderPageHero } from "@/components/finder/finder-page-hero";
import { FinderShell } from "@/components/finder/finder-shell";
import { FinderStepper } from "@/components/finder/finder-stepper";
import { ProductLogo } from "@/components/software/product-logo";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCountInput } from "@/components/pricing/user-count-input";
import { BillingPreferenceControl } from "@/components/pricing/billing-preference";
import {
  formatAssumptionPreview,
  TcoAssumptionChips,
} from "./tco-assumption-chips";
import {
  TcoChoicePills,
  TcoFieldCard,
  TcoLiveCalcBanner,
  TcoNumberField,
  TcoQuickValueChips,
  TcoStepHeader,
} from "./tco-form";
import { TcoCompositionChart } from "./tco-composition-chart";
import { TcoHeroPreview } from "./tco-hero-preview";
import { TcoMoneyInput } from "./tco-money-input";
import {
  TcoAssumptionsPanel,
  TcoCostDriversPanel,
  TcoLicenceGapPanel,
  TcoProductSummaryCards,
  TcoSensitivityPanel,
} from "./tco-results-panels";
import { TcoMobileBar, TcoSidebar } from "./tco-sidebar";
import { TcoSourceBadge } from "./tco-source-badge";
import { TcoYearlyTable } from "./tco-yearly-table";
import { cn } from "@/lib/cn";

const STAGES = [
  { id: "products", label: "Products" },
  { id: "horizon", label: "Horizon & users" },
  { id: "software", label: "Software" },
  { id: "implementation", label: "Implementation" },
  { id: "migration", label: "Migration" },
  { id: "integrations", label: "Integrations" },
  { id: "training", label: "Training" },
  { id: "admin", label: "Admin & support" },
  { id: "results", label: "Results" },
] as const;

type StepId = (typeof STAGES)[number]["id"];

type ProductOption = {
  slug: string;
  name: string;
  logo: { src: string; alt: string } | null;
};

type Props = {
  snapshots: PricingSnapshot[];
  productOptions: ProductOption[];
  resourceLinks?: Array<{ href: string; label: string }>;
  title?: string;
  description?: string;
  /** When the page already rendered an SSR H1, demote the in-app hero heading. */
  titleElement?: "h1" | "h2" | "none";
};

const TCO_VALUE_PROPS = [
  {
    icon: ShieldCheck,
    title: "Verified software pricing",
    body: "Where public list prices are available.",
  },
  {
    icon: Eye,
    title: "Assumptions labelled",
    body: "Your estimates stay clearly marked.",
  },
  {
    icon: Calculator,
    title: "No affiliate influence",
    body: "Affiliate status never changes totals.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent calculation",
    body: "Known vs unknown costs stay separate.",
  },
];

const COST_STORAGE_KEY = "sg-crm-cost-v1";

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

export function CrmTcoCalculatorApp({
  snapshots,
  productOptions,
  resourceLinks = [],
  title = "CRM TCO Calculator",
  description = "Compare CRM licence costs together with implementation, migration, integrations, training and ongoing administration over the period that matters to your business.",
  titleElement = "h1",
}: Props) {
  const searchParams = useSearchParams();
  const fromHint = searchParams.get("from");

  const [session, setSession] = useState<TCOSession>(() =>
    createEmptyTcoSession(),
  );
  const [profile, setProfile] = useState<CrmDecisionProfile | null>(null);
  const [step, setStep] = useState<StepId>("products");
  /** Furthest wizard index unlocked — allows jumping back/forward within visited steps. */
  const [maxStepIndex, setMaxStepIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [started, setStarted] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [customCostName, setCustomCostName] = useState("");
  const [customCostAmount, setCustomCostAmount] = useState("");

  const scenario = getActiveScenario(session);
  const featureSlugs = useMemo(
    () => requiredFeaturesFromProfile(profile),
    [profile],
  );

  const result = useMemo(
    () =>
      computeTco({
        scenario,
        snapshots,
        requiredFeatureSlugs: featureSlugs,
      }),
    [scenario, snapshots, featureSlugs],
  );

  const focusId =
    session.focusProductId &&
    scenario.productIds.includes(session.focusProductId)
      ? session.focusProductId
      : scenario.productIds[0];
  const focusProduct =
    result.products.find((p) => p.productId === focusId) ??
    result.products[0] ??
    null;

  const logos = useMemo(() => {
    const map: Record<string, { src: string; alt: string } | undefined> = {};
    for (const s of snapshots) {
      if (s.logo) map[s.productSlug] = s.logo;
    }
    for (const o of productOptions) {
      if (o.logo) map[o.slug] = o.logo;
    }
    return map;
  }, [snapshots, productOptions]);

  useEffect(() => {
    let next = loadCrmTcoSession() ?? createEmptyTcoSession();
    const decision = loadCrmDecisionProfile();
    setProfile(decision);

    if (decision && (fromHint === "requirements" || fromHint === "scorecard")) {
      next = sessionFromDecisionProfile(decision, next);
    } else if (decision && next.scenarios[0]?.productIds.length === 0) {
      next = sessionFromDecisionProfile(decision, next);
    }

    if (fromHint === "cost") {
      const costDraft = readJson<{
        crmUsers?: number;
        billingPreference?: BillingPreference;
        finderOrderSlugs?: string[];
      }>(COST_STORAGE_KEY);
      if (costDraft) {
        next = applyCostCalculatorHandoff(next, {
          crmUsers: costDraft.crmUsers,
          billingPreference: costDraft.billingPreference,
          productSlugs: costDraft.finderOrderSlugs,
        });
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration
    setSession(next);
    if (next.wizardStepId && STAGES.some((s) => s.id === next.wizardStepId)) {
      const restored = next.wizardStepId as StepId;
      const restoredIndex = STAGES.findIndex((s) => s.id === restored);
      setStep(restored);
      setMaxStepIndex(Math.max(0, restoredIndex));
    }
    setHydrated(true);
  }, [fromHint]);

  useEffect(() => {
    if (!hydrated) return;
    saveCrmTcoSession({ ...session, wizardStepId: step });
  }, [session, step, hydrated]);

  function patchScenario(patch: Partial<TCOScenario>) {
    setSession((prev) => updateActiveScenario(prev, patch));
  }

  function setProductIds(productIds: string[]) {
    patchScenario({ productIds });
    track({
      name: "tco_product_added",
      properties: { count: productIds.length },
    });
    if (productIds[0]) {
      setSession((prev) => ({
        ...prev,
        focusProductId: productIds[0],
      }));
    }
    const decision = loadCrmDecisionProfile();
    if (decision) {
      const next = touchCrmDecisionProfile(decision, {
        shortlistProductIds: productIds,
      });
      saveCrmDecisionProfile(next);
      setProfile(next);
    }
  }

  function startCalculator() {
    setStarted(true);
    track({ name: "crm_tco_started" });
    document
      .getElementById("tco-workspace")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function loadProfile() {
    const decision = loadCrmDecisionProfile();
    if (!decision) return;
    setProfile(decision);
    setSession((prev) => sessionFromDecisionProfile(decision, prev));
    setStarted(true);
    track({ name: "crm_tco_started", properties: { from: "profile" } });
  }

  function goStep(next: StepId) {
    const nextIndex = STAGES.findIndex((s) => s.id === next);
    setStep(next);
    if (nextIndex >= 0) {
      setMaxStepIndex((prev) => Math.max(prev, nextIndex));
    }
    if (next === "results") {
      track({ name: "tco_completed" });
    }
  }

  const activeIndex = STAGES.findIndex((s) => s.id === step);
  const profileSummary = profile ? summarizeProfile(profile) : null;

  const sensitivity = useMemo(() => {
    if (!focusProduct) return [];
    return buildSensitivityAnalysis({
      scenario,
      productId: focusProduct.productId,
      snapshots,
      requiredFeatureSlugs: featureSlugs,
    });
  }, [focusProduct, scenario, snapshots, featureSlugs]);

  async function copySummary() {
    const text = tcoToPlainText(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
      track({ name: "tco_exported", properties: { format: "clipboard" } });
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function downloadCsv() {
    const csv = tcoToCsv(result);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crm-tco-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    track({ name: "tco_exported", properties: { format: "csv" } });
  }

  if (!hydrated) {
    return (
      <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
        Loading TCO calculator…
      </p>
    );
  }

  return (
    <div className="pb-24 lg:pb-8">
      <FinderPageHero
        title={title}
        description={description}
        badge="BETA"
        valueProps={TCO_VALUE_PROPS}
        visualSlot={<TcoHeroPreview />}
        titleElement={titleElement}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="lg" onClick={startCalculator}>
          Calculate CRM TCO
        </Button>
        <Button size="lg" variant="outline" onClick={loadProfile}>
          Load my CRM profile
        </Button>
      </div>

      <div id="tco-workspace" className="mt-10 scroll-mt-24">
        {profileSummary ? (
          <Card className="mb-6 border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/30">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                  Using your CRM requirements profile
                </p>
                <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                  {profileSummary.industry ? (
                    <div>
                      <dt className="inline text-[var(--sg-color-text-muted)]">
                        Industry:{" "}
                      </dt>
                      <dd className="inline font-medium capitalize">
                        {profileSummary.industry.replace(/-/g, " ")}
                      </dd>
                    </div>
                  ) : null}
                  {profileSummary.companySize ? (
                    <div>
                      <dt className="inline text-[var(--sg-color-text-muted)]">
                        Company size:{" "}
                      </dt>
                      <dd className="inline font-medium">
                        {profileSummary.companySize.replace(/-/g, "–")}
                      </dd>
                    </div>
                  ) : null}
                  {profileSummary.crmUsers != null ? (
                    <div>
                      <dt className="inline text-[var(--sg-color-text-muted)]">
                        CRM users:{" "}
                      </dt>
                      <dd className="inline font-medium">
                        {profileSummary.crmUsers}
                      </dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="inline text-[var(--sg-color-text-muted)]">
                      Must-haves:{" "}
                    </dt>
                    <dd className="inline font-medium">
                      {profileSummary.mustHaveCount}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-[var(--sg-color-text-muted)]">
                      Shortlist:{" "}
                    </dt>
                    <dd className="inline font-medium">
                      {profileSummary.shortlistCount} products
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={loadProfile}>
                  Use profile
                </Button>
                <ButtonLink
                  href="/tools/crm-requirements-builder/"
                  size="sm"
                  variant="ghost"
                >
                  Edit
                </ButtonLink>
              </div>
            </div>
          </Card>
        ) : null}

        {(started || scenario.productIds.length > 0 || step !== "products") && (
          <>
            <FinderStepper
              stages={[...STAGES]}
              activeIndex={activeIndex}
              maxReachableIndex={maxStepIndex}
              onStageSelect={(id) => {
                if (STAGES.some((s) => s.id === id)) {
                  goStep(id as StepId);
                }
              }}
            />

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="min-w-0">
                <FinderShell>
                {step === "products" ? (
                  <ProductsStep
                    scenario={scenario}
                    productOptions={productOptions}
                    snapshots={snapshots}
                    featureSlugs={featureSlugs}
                    logos={logos}
                    onChange={setProductIds}
                    onNext={() => goStep("horizon")}
                  />
                ) : null}

                {step === "horizon" ? (
                  <HorizonStep
                    scenario={scenario}
                    onChange={patchScenario}
                    onBack={() => goStep("products")}
                    onNext={() => {
                      track({
                        name: "tco_horizon_changed",
                        properties: { years: scenario.horizonYears },
                      });
                      goStep("software");
                    }}
                  />
                ) : null}

                {step === "software" ? (
                  <SoftwareStep
                    result={result}
                    logos={logos}
                    snapshots={snapshots}
                    onFocus={(id) =>
                      setSession((prev) => ({ ...prev, focusProductId: id }))
                    }
                    scenario={scenario}
                    onChange={patchScenario}
                    onBack={() => goStep("horizon")}
                    onNext={() => goStep("implementation")}
                  />
                ) : null}

                {step === "implementation" ? (
                  <ImplementationStep
                    scenario={scenario}
                    onChange={patchScenario}
                    onBack={() => goStep("software")}
                    onNext={() => goStep("migration")}
                  />
                ) : null}

                {step === "migration" ? (
                  <MigrationStep
                    scenario={scenario}
                    onChange={patchScenario}
                    onBack={() => goStep("implementation")}
                    onNext={() => goStep("integrations")}
                  />
                ) : null}

                {step === "integrations" ? (
                  <IntegrationsStep
                    scenario={scenario}
                    onChange={patchScenario}
                    customCostName={customCostName}
                    customCostAmount={customCostAmount}
                    setCustomCostName={setCustomCostName}
                    setCustomCostAmount={setCustomCostAmount}
                    onBack={() => goStep("migration")}
                    onNext={() => goStep("training")}
                  />
                ) : null}

                {step === "training" ? (
                  <TrainingStep
                    scenario={scenario}
                    onChange={patchScenario}
                    onBack={() => goStep("integrations")}
                    onNext={() => goStep("admin")}
                  />
                ) : null}

                {step === "admin" ? (
                  <AdminStep
                    scenario={scenario}
                    onChange={patchScenario}
                    onBack={() => goStep("training")}
                    onNext={() => goStep("results")}
                  />
                ) : null}

                {step === "results" ? (
                  <ResultsStep
                    result={result}
                    scenario={scenario}
                    session={session}
                    focusProduct={focusProduct}
                    logos={logos}
                    sensitivity={sensitivity}
                    resourceLinks={resourceLinks}
                    copyDone={copyDone}
                    onCopy={copySummary}
                    onCsv={downloadCsv}
                    onPrint={() => window.print()}
                    onFocus={(id) =>
                      setSession((prev) => ({ ...prev, focusProductId: id }))
                    }
                    onDuplicate={() => {
                      setSession((prev) => duplicateScenario(prev));
                      track({ name: "tco_scenario_created" });
                    }}
                    onDeleteScenario={(id) =>
                      setSession((prev) => deleteScenario(prev, id))
                    }
                    onSelectScenario={(id) =>
                      setSession((prev) => ({
                        ...prev,
                        activeScenarioId: id,
                      }))
                    }
                    onRenameScenario={(name) => patchScenario({ name })}
                    onReset={() => {
                      setSession(resetCrmTcoSession());
                      setStep("products");
                      setMaxStepIndex(0);
                    }}
                    onEditAssumptions={() => goStep("horizon")}
                    onScorecard={() =>
                      track({ name: "tco_to_scorecard" })
                    }
                  />
                ) : null}
                </FinderShell>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-4">
                  {result.products.length > 1 ? (
                    <label className="block text-xs font-medium text-[var(--sg-color-text-muted)]">
                      Focus product
                      <select
                        className="mt-1 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2 py-2 text-sm"
                        value={focusProduct?.productId ?? ""}
                        onChange={(e) =>
                          setSession((prev) => ({
                            ...prev,
                            focusProductId: e.target.value,
                          }))
                        }
                      >
                        {result.products.map((p) => (
                          <option key={p.productId} value={p.productId}>
                            {p.productName}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                  <TcoSidebar
                    product={focusProduct}
                    horizonYears={scenario.horizonYears}
                    logo={
                      focusProduct
                        ? logos[focusProduct.productId]
                        : undefined
                    }
                    onViewResults={
                      step !== "results"
                        ? () => goStep("results")
                        : undefined
                    }
                  />
                  <Card className="text-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                      Need help estimating costs?
                    </p>
                    <ul className="mt-2 space-y-1">
                      {resourceLinks.slice(0, 3).map((l) => (
                        <li key={l.href}>
                          <a
                            href={l.href}
                            className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                          >
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>

      {focusProduct && step !== "results" ? (
        <TcoMobileBar
          knownTcoMinor={focusProduct.knownTcoMinor}
          currency={focusProduct.currency}
          horizonYears={scenario.horizonYears}
          unknownCount={focusProduct.unknownItems.length}
          onViewBreakdown={() => goStep("results")}
        />
      ) : null}
    </div>
  );
}

/* ——— Steps ——— */

function ProductsStep({
  scenario,
  productOptions,
  snapshots,
  featureSlugs,
  logos,
  onChange,
  onNext,
}: {
  scenario: TCOScenario;
  productOptions: ProductOption[];
  snapshots: PricingSnapshot[];
  featureSlugs: string[];
  logos: Record<string, { src: string; alt: string } | undefined>;
  onChange: (ids: string[]) => void;
  onNext: () => void;
}) {
  const selected = new Set(scenario.productIds);
  const options =
    productOptions.length > 0
      ? productOptions
      : snapshots.map((s) => ({
          slug: s.productSlug,
          name: s.name,
          logo: s.logo ?? null,
        }));

  function toggle(slug: string) {
    if (selected.has(slug)) {
      onChange(scenario.productIds.filter((id) => id !== slug));
      return;
    }
    if (scenario.productIds.length >= 5) return;
    onChange([...scenario.productIds, slug]);
  }

  return (
    <section aria-labelledby="products-heading">
      <h2
        id="products-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        Select CRM products
      </h2>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Choose 1–5 products. Products are not ranked here — TCO comparison comes
        later.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const isOn = selected.has(opt.slug);
          const snap = snapshots.find((s) => s.productSlug === opt.slug);
          const preview = snap
            ? computeTco({
                scenario: {
                  ...scenario,
                  productIds: [opt.slug],
                  migration: { needed: "none", scopes: [] },
                },
                snapshots,
                requiredFeatureSlugs: featureSlugs,
              }).products[0]
            : null;
          return (
            <li key={opt.slug}>
              <button
                type="button"
                onClick={() => toggle(opt.slug)}
                aria-pressed={isOn}
                className={cn(
                  "flex w-full items-start gap-3 rounded-[var(--sg-radius-lg)] border p-4 text-left transition",
                  isOn
                    ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]/40 ring-2 ring-[var(--sg-color-primary)]/30"
                    : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] hover:border-[var(--sg-color-primary)]/40",
                )}
              >
                <ProductLogo
                  name={opt.name}
                  logo={logos[opt.slug] ?? opt.logo ?? undefined}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--sg-color-text)]">
                    {opt.name}
                  </p>
                  {preview?.qualifyingPlanName ? (
                    <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                      Min. plan: {preview.qualifyingPlanName}
                    </p>
                  ) : preview?.status === "custom-quote" ? (
                    <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                      Custom quote
                    </p>
                  ) : (
                    <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                      Based on seats when available
                    </p>
                  )}
                  {preview ? (
                    <div className="mt-2">
                      <Badge
                        variant={
                          preview.status === "calculated"
                            ? "success"
                            : preview.status === "custom-quote"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {preview.status === "calculated"
                          ? "Pricing confidence: verified"
                          : preview.status}
                      </Badge>
                    </div>
                  ) : null}
                </div>
                {isOn ? (
                  <Check
                    className="size-5 shrink-0 text-[var(--sg-color-primary)]"
                    aria-hidden
                  />
                ) : (
                  <Plus
                    className="size-5 shrink-0 text-[var(--sg-color-text-muted)]"
                    aria-hidden
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex justify-end">
        <Button
          disabled={scenario.productIds.length < 1}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </section>
  );
}

function HorizonStep({
  scenario,
  onChange,
  onBack,
  onNext,
}: {
  scenario: TCOScenario;
  onChange: (p: Partial<TCOScenario>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section aria-labelledby="horizon-heading" className="space-y-6">
      <div>
        <h2
          id="horizon-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
        >
          Time horizon & users
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Seat growth is optional — we do not assume headcount growth.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Ownership period</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {([1, 2, 3, 4, 5] as TCOHorizonYears[]).map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => onChange({ horizonYears: y })}
              className={cn(
                "rounded-[var(--sg-radius-md)] border px-3 py-2 text-sm font-medium",
                scenario.horizonYears === y
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                  : "border-[var(--sg-color-border)]",
              )}
            >
              {y} year{y === 1 ? "" : "s"}
              {y === 3 ? " (recommended)" : ""}
            </button>
          ))}
        </div>
      </fieldset>

      <UserCountInput
        value={scenario.startingUsers}
        onChange={(startingUsers) => onChange({ startingUsers })}
        label="Current CRM users"
      />

      <BillingPreferenceControl
        value={
          scenario.billingPreference === "either"
            ? "annual"
            : scenario.billingPreference
        }
        onChange={(billingPreference) => onChange({ billingPreference })}
      />

      <fieldset>
        <legend className="text-sm font-medium">Expected annual growth</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["flat", "0%"],
              ["percent:5", "5%"],
              ["percent:10", "10%"],
              ["percent:20", "20%"],
              ["custom", "Custom"],
            ] as const
          ).map(([key, label]) => {
            const active =
              key === "custom"
                ? scenario.growthMode === "custom"
                : key === "flat"
                  ? scenario.growthMode === "flat"
                  : scenario.growthMode === "percent" &&
                    scenario.annualGrowthPercent === Number(key.split(":")[1]);
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (key === "flat") {
                    onChange({ growthMode: "flat", annualGrowthPercent: 0 });
                  } else if (key === "custom") {
                    onChange({
                      growthMode: "custom",
                      customSeats: Array.from(
                        { length: scenario.horizonYears },
                        (_, i) =>
                          scenario.customSeats?.[i] ?? scenario.startingUsers,
                      ),
                    });
                  } else {
                    onChange({
                      growthMode: "percent" as SeatGrowthMode,
                      annualGrowthPercent: Number(key.split(":")[1]),
                    });
                  }
                }}
                className={cn(
                  "rounded-[var(--sg-radius-md)] border px-3 py-2 text-sm",
                  active
                    ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                    : "border-[var(--sg-color-border)]",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {scenario.growthMode === "custom" ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: scenario.horizonYears }, (_, i) => (
            <label key={i} className="text-sm">
              Year {i + 1} seats
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
                value={
                  scenario.customSeats?.[i] ?? scenario.startingUsers
                }
                onChange={(e) => {
                  const seats = Array.from(
                    { length: scenario.horizonYears },
                    (_, j) =>
                      scenario.customSeats?.[j] ?? scenario.startingUsers,
                  );
                  seats[i] = Math.max(1, Number(e.target.value) || 1);
                  onChange({ customSeats: seats, growthMode: "custom" });
                }}
              />
            </label>
          ))}
        </div>
      ) : null}

      <label className="block text-sm">
        Negotiated discount (your assumption)
        <input
          type="number"
          min={0}
          max={90}
          className="mt-1 w-28 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
          value={scenario.negotiatedDiscountPercent}
          onChange={(e) =>
            onChange({
              negotiatedDiscountPercent: Math.min(
                90,
                Math.max(0, Number(e.target.value) || 0),
              ),
            })
          }
        />
        <span className="ml-2 text-xs text-[var(--sg-color-text-muted)]">
          % — never shown as vendor pricing
        </span>
      </label>

      <NavButtons onBack={onBack} onNext={onNext} />
    </section>
  );
}

function SoftwareStep({
  result,
  logos,
  snapshots,
  onFocus,
  scenario,
  onChange,
  onBack,
  onNext,
}: {
  result: ReturnType<typeof computeTco>;
  logos: Record<string, { src: string; alt: string } | undefined>;
  snapshots: PricingSnapshot[];
  onFocus: (id: string) => void;
  scenario: TCOScenario;
  onChange: (p: Partial<TCOScenario>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const snapById = useMemo(() => {
    const map = new Map<string, PricingSnapshot>();
    for (const s of snapshots) map.set(s.productSlug, s);
    return map;
  }, [snapshots]);

  const setPlanSelection = (productId: string, planSlug: string) => {
    const next = { ...scenario.planSelections };
    if (!planSlug) {
      delete next[productId];
    } else {
      next[productId] = planSlug;
    }
    onChange({ planSelections: next });
  };

  return (
    <section aria-labelledby="software-heading" className="space-y-4">
      <div>
        <h2
          id="software-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
        >
          Software subscription costs
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Priced from published plans for your seat count and billing
          preference — not a free-tier default. Pick a plan per product, or
          leave Auto for the lowest qualifying paid plan that fits your seats.
        </p>
      </div>
      {result.currencyWarning ? (
        <Alert variant="warning">{result.currencyWarning}</Alert>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase text-[var(--sg-color-text-muted)]">
              <th className="py-2 pr-2">Product</th>
              <th className="px-2 py-2">Plan</th>
              {result.seatPlan.map((y) => (
                <th key={y.year} className="px-2 py-2">
                  Year {y.year}
                </th>
              ))}
              <th className="px-2 py-2">Software total</th>
            </tr>
          </thead>
          <tbody>
            {result.products.map((p) => {
              const software =
                p.categoryTotals.find((c) => c.category === "software")
                  ?.amountMinor ?? 0;
              const snap = snapById.get(p.productId);
              const plans = (snap?.pricing?.plans ?? []).filter(
                isCalculablePlan,
              );
              const selected =
                scenario.planSelections[p.productId] ?? "";
              return (
                <tr
                  key={p.productId}
                  className="border-b border-[var(--sg-color-border)]/60"
                >
                  <th scope="row" className="py-3 pr-2">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-left font-semibold"
                      onClick={() => onFocus(p.productId)}
                    >
                      <ProductLogo
                        name={p.productName}
                        logo={logos[p.productId]}
                        size="sm"
                      />
                      {p.productName}
                    </button>
                    {p.qualifyingPlanName ? (
                      <p className="mt-0.5 text-xs font-normal text-[var(--sg-color-text-muted)]">
                        Using {p.qualifyingPlanName}
                      </p>
                    ) : null}
                    <div className="mt-1">
                      <TcoSourceBadge
                        sourceType={
                          p.status === "calculated" || p.status === "partial"
                            ? scenario.negotiatedDiscountPercent > 0 ||
                              Boolean(scenario.planSelections[p.productId])
                              ? "calculated"
                              : "verified"
                            : "unknown"
                        }
                      />
                    </div>
                  </th>
                  <td className="px-2 py-3">
                    <label className="sr-only" htmlFor={`plan-${p.productId}`}>
                      Plan for {p.productName}
                    </label>
                    <select
                      id={`plan-${p.productId}`}
                      className="max-w-[11rem] rounded-md border border-[var(--sg-color-border)] bg-white px-2 py-1.5 text-xs"
                      value={selected}
                      onChange={(e) =>
                        setPlanSelection(p.productId, e.target.value)
                      }
                    >
                      <option value="">
                        Auto
                        {p.qualifyingPlanName
                          ? ` (${p.qualifyingPlanName})`
                          : ""}
                      </option>
                      {plans.map((plan) => (
                        <option key={plan.slug} value={plan.slug}>
                          {plan.name}
                          {plan.isFree ? " (Free)" : ""}
                        </option>
                      ))}
                    </select>
                  </td>
                  {p.yearly.map((y) => {
                    const yearSoftware = y.byCategory.software;
                    return (
                      <td key={y.year} className="px-2 py-3 tabular-nums">
                        {yearSoftware != null
                          ? formatMoney({
                              amountMinor: yearSoftware,
                              currency: p.currency as "EUR",
                            })
                          : "—"}
                      </td>
                    );
                  })}
                  <td className="px-2 py-3 font-semibold tabular-nums">
                    {p.unknownItems.some((u) => u.category === "software") &&
                    software <= 0
                      ? "Unknown"
                      : formatMoney({
                          amountMinor: software,
                          currency: p.currency as "EUR",
                        })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--sg-color-text-muted)]">
        <ButtonLink
          href="/tools/crm-cost-calculator/?from=tco"
          variant="ghost"
          size="sm"
        >
          View software-only pricing →
        </ButtonLink>
      </p>
      <NavButtons onBack={onBack} onNext={onNext} />
    </section>
  );
}

function ImplementationStep({
  scenario,
  onChange,
  onBack,
  onNext,
}: {
  scenario: TCOScenario;
  onChange: (p: Partial<TCOScenario>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [templateId, setTemplateId] = useState<string | null>(null);
  const approaches: { value: ImplementationApproach; label: string }[] = [
    { value: "self-service", label: "Self-service" },
    { value: "internal", label: "Internal team" },
    { value: "vendor", label: "Vendor implementation" },
    { value: "partner", label: "Partner / consultancy" },
    { value: "mixed", label: "Mixed" },
    { value: "unsure", label: "Unsure" },
  ];

  const templates = useMemo(
    () =>
      buildImplementationEstimateTemplates({
        approach: scenario.implementation.approach,
        users: scenario.startingUsers,
      }),
    [scenario.implementation.approach, scenario.startingUsers],
  );

  const defaultHourly =
    scenario.implementation.internalHourlyCostMinor ??
    scenario.administration.hourlyCostMinor ??
    majorToMinor(50);

  return (
    <section aria-labelledby="impl-heading" className="space-y-6">
      <TcoStepHeader
        id="impl-heading"
        eyebrow="Step · Implementation"
        title="Implementation cost"
        description="One-time cost. Use a planning template if you do not have a quote yet — or leave unknown. We do not invent market averages."
      />

      <TcoFieldCard
        title="Delivery approach"
        description="Who will configure and roll out the CRM?"
      >
        <TcoChoicePills
          legend="How will implementation be handled?"
          options={approaches}
          value={scenario.implementation.approach}
          onChange={(approach) => {
            setTemplateId(null);
            onChange({
              implementation: {
                ...scenario.implementation,
                approach,
              },
            });
          }}
        />
      </TcoFieldCard>

      <TcoAssumptionChips
        title="Estimate helpers"
        activeId={templateId}
        chips={templates.map((t) => ({
          id: t.id,
          label: t.label,
          blurb: t.blurb,
          preview: formatAssumptionPreview(t.externalMajor, scenario.currency),
        }))}
        onSelect={(id) => {
          const t = templates.find((x) => x.id === id);
          if (!t) return;
          setTemplateId(id);
          onChange({
            implementation: {
              ...scenario.implementation,
              externalCostMinor: majorToMinor(t.externalMajor),
              internalHours: t.internalHours,
              internalHourlyCostMinor: defaultHourly,
            },
          });
          track({
            name: "tco_cost_assumption_added",
            properties: { category: "implementation", template: id },
          });
        }}
        onLeaveUnknown={() => {
          setTemplateId("unknown");
          onChange({
            implementation: {
              ...scenario.implementation,
              externalCostMinor: null,
              internalHours: undefined,
            },
          });
        }}
      />

      <TcoFieldCard
        title="Cost details"
        description="External fees and optional internal effort."
      >
        <div className="space-y-5">
          <TcoMoneyInput
            id="impl-external"
            label="External implementation estimate"
            currency={scenario.currency}
            valueMajor={
              scenario.implementation.externalCostMinor == null
                ? scenario.implementation.externalCostMinor
                : minorToMajor(scenario.implementation.externalCostMinor)
            }
            onChange={(major) => {
              setTemplateId(null);
              onChange({
                implementation: {
                  ...scenario.implementation,
                  externalCostMinor:
                    major === null
                      ? null
                      : major === undefined
                        ? undefined
                        : majorToMinor(major),
                },
              });
              if (major != null) {
                track({
                  name: "tco_cost_assumption_added",
                  properties: { category: "implementation" },
                });
              }
            }}
            hint="Your estimate · one-time"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TcoNumberField
              id="impl-hours"
              label="Internal implementation hours"
              value={scenario.implementation.internalHours}
              suffix="hours"
              placeholder="optional"
              onChange={(internalHours) => {
                setTemplateId(null);
                onChange({
                  implementation: {
                    ...scenario.implementation,
                    internalHours,
                  },
                });
              }}
            />
            <TcoNumberField
              id="impl-rate"
              label="Average internal cost / hour"
              value={
                scenario.implementation.internalHourlyCostMinor != null
                  ? minorToMajor(
                      scenario.implementation.internalHourlyCostMinor,
                    )
                  : undefined
              }
              prefix={scenario.currency === "EUR" ? "€" : scenario.currency}
              suffix="/ hour"
              onChange={(hourlyMajor) => {
                onChange({
                  implementation: {
                    ...scenario.implementation,
                    internalHourlyCostMinor:
                      hourlyMajor == null
                        ? undefined
                        : majorToMinor(hourlyMajor),
                  },
                });
              }}
            />
          </div>
        </div>
      </TcoFieldCard>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Continue" />
    </section>
  );
}

function MigrationStep({
  scenario,
  onChange,
  onBack,
  onNext,
}: {
  scenario: TCOScenario;
  onChange: (p: Partial<TCOScenario>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [templateId, setTemplateId] = useState<string | null>(null);
  const options: { value: MigrationNeeded; label: string }[] = [
    { value: "none", label: "None" },
    { value: "basic", label: "Basic" },
    { value: "moderate", label: "Moderate" },
    { value: "complex", label: "Complex" },
    { value: "unknown", label: "Unknown" },
  ];

  const templates = useMemo(
    () =>
      buildMigrationEstimateTemplates({
        needed: scenario.migration.needed,
        users: scenario.startingUsers,
      }),
    [scenario.migration.needed, scenario.startingUsers],
  );

  const defaultHourly =
    scenario.migration.internalHourlyCostMinor ??
    scenario.implementation.internalHourlyCostMinor ??
    scenario.administration.hourlyCostMinor ??
    majorToMinor(50);

  return (
    <section aria-labelledby="mig-heading" className="space-y-6">
      <TcoStepHeader
        id="mig-heading"
        eyebrow="Step · Migration"
        title="Migration cost"
        description="Prepared for a future Migration Planner — costs stay user-supplied. Helpers below are optional planning templates, not vendor quotes."
      />

      <TcoFieldCard title="Migration complexity">
        <TcoChoicePills
          legend="Migration needed?"
          options={options}
          value={scenario.migration.needed}
          onChange={(needed) => {
            setTemplateId(null);
            onChange({
              migration: { ...scenario.migration, needed },
            });
          }}
        />
        {scenario.migration.scopes.length > 0 ? (
          <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
            Scope hints from profile: {scenario.migration.scopes.join(", ")}
          </p>
        ) : null}
      </TcoFieldCard>

      {scenario.migration.needed !== "none" ? (
        <>
          {templates.length > 0 ? (
            <TcoAssumptionChips
              title="Estimate helpers"
              activeId={templateId}
              chips={templates.map((t) => ({
                id: t.id,
                label: t.label,
                blurb: t.blurb,
                preview: `${formatAssumptionPreview(t.externalMajor, scenario.currency)} external`,
              }))}
              onSelect={(id) => {
                const t = templates.find((x) => x.id === id);
                if (!t) return;
                setTemplateId(id);
                onChange({
                  migration: {
                    ...scenario.migration,
                    externalCostMinor: majorToMinor(t.externalMajor),
                    dataCleaningCostMinor: majorToMinor(t.cleaningMajor),
                    internalHours: t.internalHours,
                    internalHourlyCostMinor: defaultHourly,
                  },
                });
                track({
                  name: "tco_cost_assumption_added",
                  properties: { category: "migration", template: id },
                });
              }}
              onLeaveUnknown={() => {
                setTemplateId("unknown");
                onChange({
                  migration: {
                    ...scenario.migration,
                    externalCostMinor: null,
                    dataCleaningCostMinor: null,
                    internalHours: undefined,
                  },
                });
              }}
            />
          ) : scenario.migration.needed === "unknown" ? (
            <TcoAssumptionChips
              title="Not sure yet?"
              activeId={templateId}
              chips={[]}
              onSelect={() => undefined}
              onLeaveUnknown={() => {
                setTemplateId("unknown");
                onChange({
                  migration: {
                    ...scenario.migration,
                    externalCostMinor: null,
                    dataCleaningCostMinor: null,
                  },
                });
              }}
            />
          ) : null}

          <TcoFieldCard
            title="Cost details"
            description="External partner fees, data cleaning, and internal hours."
          >
            <div className="space-y-5">
              <TcoMoneyInput
                id="mig-external"
                label="External migration cost"
                currency={scenario.currency}
                valueMajor={
                  scenario.migration.externalCostMinor == null
                    ? scenario.migration.externalCostMinor
                    : minorToMajor(scenario.migration.externalCostMinor)
                }
                onChange={(major) => {
                  setTemplateId(null);
                  onChange({
                    migration: {
                      ...scenario.migration,
                      externalCostMinor:
                        major === null
                          ? null
                          : major === undefined
                            ? undefined
                            : majorToMinor(major),
                    },
                  });
                }}
              />
              <TcoMoneyInput
                id="mig-clean"
                label="Data-cleaning cost"
                currency={scenario.currency}
                valueMajor={
                  scenario.migration.dataCleaningCostMinor == null
                    ? scenario.migration.dataCleaningCostMinor
                    : minorToMajor(scenario.migration.dataCleaningCostMinor)
                }
                onChange={(major) => {
                  setTemplateId(null);
                  onChange({
                    migration: {
                      ...scenario.migration,
                      dataCleaningCostMinor:
                        major === null
                          ? null
                          : major === undefined
                            ? undefined
                            : majorToMinor(major),
                    },
                  });
                }}
              />
              <TcoNumberField
                id="mig-hours"
                label="Internal migration hours"
                value={scenario.migration.internalHours}
                suffix="hours"
                placeholder="optional"
                onChange={(internalHours) => {
                  setTemplateId(null);
                  onChange({
                    migration: {
                      ...scenario.migration,
                      internalHours,
                      internalHourlyCostMinor: defaultHourly,
                    },
                  });
                }}
              />
              {templateId && templateId !== "unknown" ? (
                <p className="text-xs text-[var(--sg-color-text-muted)]">
                  Applied template fills external + cleaning + internal hours.
                  Values stay labelled as your estimate — edit any field to
                  customise.
                </p>
              ) : null}
            </div>
          </TcoFieldCard>
        </>
      ) : null}
      <NavButtons onBack={onBack} onNext={onNext} />
    </section>
  );
}

function IntegrationsStep({
  scenario,
  onChange,
  customCostName,
  customCostAmount,
  setCustomCostName,
  setCustomCostAmount,
  onBack,
  onNext,
}: {
  scenario: TCOScenario;
  onChange: (p: Partial<TCOScenario>) => void;
  customCostName: string;
  customCostAmount: string;
  setCustomCostName: (v: string) => void;
  setCustomCostAmount: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section aria-labelledby="int-heading" className="space-y-5">
      <div>
        <h2
          id="int-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
        >
          Integrations & custom costs
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Prefill comes from required integrations in your profile. Status and
          amounts are yours — we do not invent integration fees.
        </p>
      </div>
      {scenario.integrations.length === 0 ? (
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          No integrations listed. Add custom cost items below if needed.
        </p>
      ) : (
        <ul className="space-y-4">
          {scenario.integrations.map((line, idx) => (
            <li
              key={line.id}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] p-4"
            >
              <p className="font-medium">{line.name}</p>
              <label className="mt-2 block text-xs text-[var(--sg-color-text-muted)]">
                Status
                <select
                  className="mt-1 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-2 py-2 text-sm"
                  value={line.status}
                  onChange={(e) => {
                    const integrations = [...scenario.integrations];
                    integrations[idx] = {
                      ...line,
                      status: e.target.value as typeof line.status,
                    };
                    onChange({ integrations });
                  }}
                >
                  <option value="native">Native / included</option>
                  <option value="paid-addon">Paid add-on</option>
                  <option value="external">External integration</option>
                  <option value="custom">Custom integration</option>
                  <option value="unknown">Unknown</option>
                </select>
              </label>
              {line.status !== "native" ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <TcoMoneyInput
                    id={`int-setup-${line.id}`}
                    label="One-time setup"
                    currency={scenario.currency}
                    valueMajor={
                      line.setupCostMinor == null
                        ? line.setupCostMinor
                        : minorToMajor(line.setupCostMinor)
                    }
                    onChange={(major) => {
                      const integrations = [...scenario.integrations];
                      integrations[idx] = {
                        ...line,
                        setupCostMinor:
                          major === null
                            ? null
                            : major === undefined
                              ? undefined
                              : majorToMinor(major),
                      };
                      onChange({ integrations });
                    }}
                  />
                  <TcoMoneyInput
                    id={`int-rec-${line.id}`}
                    label="Recurring monthly"
                    currency={scenario.currency}
                    valueMajor={
                      line.recurringMonthlyMinor == null
                        ? line.recurringMonthlyMinor
                        : minorToMajor(line.recurringMonthlyMinor)
                    }
                    onChange={(major) => {
                      const integrations = [...scenario.integrations];
                      integrations[idx] = {
                        ...line,
                        recurringMonthlyMinor:
                          major === null
                            ? null
                            : major === undefined
                              ? undefined
                              : majorToMinor(major),
                      };
                      onChange({ integrations });
                    }}
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-[var(--sg-radius-lg)] border border-dashed border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 p-4">
        <p className="text-sm font-medium">Add custom cost item</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            Name
            <input
              className="mt-1 block w-48 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2"
              value={customCostName}
              onChange={(e) => setCustomCostName(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Amount ({scenario.currency})
            <input
              type="number"
              min={0}
              className="mt-1 block w-32 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2"
              value={customCostAmount}
              onChange={(e) => setCustomCostAmount(e.target.value)}
            />
          </label>
          <Button
            type="button"
            size="sm"
            disabled={!customCostName.trim() || !customCostAmount}
            onClick={() => {
              const amount = Number(customCostAmount);
              if (!customCostName.trim() || !Number.isFinite(amount)) return;
              onChange({
                customCosts: [
                  ...scenario.customCosts,
                  {
                    id: `c-${Date.now()}`,
                    name: customCostName.trim(),
                    frequency: "one-time",
                    amountMinor: majorToMinor(amount),
                    startYear: 1,
                    endYear: 1,
                  },
                ],
              });
              setCustomCostName("");
              setCustomCostAmount("");
              track({
                name: "tco_cost_assumption_added",
                properties: { category: "custom" },
              });
            }}
          >
            Add
          </Button>
        </div>
        {scenario.customCosts.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm">
            {scenario.customCosts.map((c) => (
              <li key={c.id} className="flex justify-between gap-2">
                <span>
                  {c.name}{" "}
                  <TcoSourceBadge sourceType="user-input" />
                </span>
                <span className="tabular-nums">
                  {formatMoney({
                    amountMinor: c.amountMinor,
                    currency: scenario.currency,
                  })}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </section>
  );
}

function TrainingStep({
  scenario,
  onChange,
  onBack,
  onNext,
}: {
  scenario: TCOScenario;
  onChange: (p: Partial<TCOScenario>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const methods: { value: TrainingMethod; label: string }[] = [
    { value: "internal", label: "Internal" },
    { value: "vendor", label: "Vendor" },
    { value: "partner", label: "Partner" },
    { value: "self-service", label: "Self-service" },
    { value: "mixed", label: "Mixed" },
  ];

  const hourPresets = trainingHoursPerUserPresets();
  const derived =
    scenario.training.hoursPerUser != null &&
    scenario.training.hourlyCostMinor != null
      ? scenario.startingUsers *
        scenario.training.hoursPerUser *
        minorToMajor(scenario.training.hourlyCostMinor)
      : null;

  const currencySymbol = scenario.currency === "EUR" ? "€" : scenario.currency;

  return (
    <section aria-labelledby="train-heading" className="space-y-6">
      <TcoStepHeader
        id="train-heading"
        eyebrow="Step · Training"
        title="Training cost"
        description="Internal productivity cost is a user-derived assumption. Use quick picks if you do not have a quote yet — values stay labelled as your estimate."
      />

      <TcoFieldCard
        title="Training approach"
        description="How will people learn the new CRM?"
      >
        <TcoChoicePills
          legend="Training method"
          options={methods}
          value={scenario.training.method}
          onChange={(method) =>
            onChange({ training: { ...scenario.training, method } })
          }
        />
      </TcoFieldCard>

      <TcoFieldCard
        title="External training"
        description="Vendor or partner training fees (one-time)."
      >
        <TcoMoneyInput
          id="train-ext"
          label="External training cost"
          currency={scenario.currency}
          valueMajor={
            scenario.training.externalCostMinor == null
              ? scenario.training.externalCostMinor
              : minorToMajor(scenario.training.externalCostMinor)
          }
          onChange={(major) =>
            onChange({
              training: {
                ...scenario.training,
                externalCostMinor:
                  major === null
                    ? null
                    : major === undefined
                      ? undefined
                      : majorToMinor(major),
              },
            })
          }
          hint="Leave blank if unknown"
        />
      </TcoFieldCard>

      <TcoFieldCard
        title="Internal training effort"
        description={`${scenario.startingUsers} users × hours per user × internal rate.`}
      >
        <div className="space-y-5">
          <div>
            <TcoQuickValueChips
              label="Hours per user"
              chips={hourPresets.map((p) => ({
                id: p.id,
                label: p.label,
                value: p.hoursPerUser,
              }))}
              activeValue={scenario.training.hoursPerUser}
              onSelect={(hoursPerUser) => {
                onChange({
                  training: {
                    ...scenario.training,
                    hoursPerUser,
                    hourlyCostMinor:
                      scenario.training.hourlyCostMinor ??
                      scenario.administration.hourlyCostMinor ??
                      majorToMinor(50),
                  },
                });
                track({
                  name: "tco_cost_assumption_added",
                  properties: { category: "training" },
                });
              }}
            />
            <TcoNumberField
              className="mt-3"
              id="train-hours"
              label="Internal training hours per user"
              value={scenario.training.hoursPerUser}
              step={0.5}
              suffix="hrs / user"
              placeholder="e.g. 3"
              onChange={(hoursPerUser) => {
                onChange({
                  training: { ...scenario.training, hoursPerUser },
                });
              }}
            />
          </div>

          <div>
            <TcoQuickValueChips
              label="Internal hourly cost"
              chips={INTERNAL_HOURLY_PRESETS.map((p) => ({
                id: p.id,
                label: p.label,
                value: p.hourlyMajor,
              }))}
              activeValue={
                scenario.training.hourlyCostMinor != null
                  ? minorToMajor(scenario.training.hourlyCostMinor)
                  : undefined
              }
              formatValue={(v) => `${currencySymbol}${v}`}
              onSelect={(hourlyMajor) => {
                onChange({
                  training: {
                    ...scenario.training,
                    hourlyCostMinor: majorToMinor(hourlyMajor),
                  },
                });
              }}
            />
            <TcoNumberField
              className="mt-3"
              id="train-rate"
              label="Average employee cost / hour"
              value={
                scenario.training.hourlyCostMinor != null
                  ? minorToMajor(scenario.training.hourlyCostMinor)
                  : undefined
              }
              prefix={currencySymbol}
              suffix="/ hour"
              placeholder="e.g. 50"
              onChange={(hourlyMajor) => {
                onChange({
                  training: {
                    ...scenario.training,
                    hourlyCostMinor:
                      hourlyMajor == null
                        ? undefined
                        : majorToMinor(hourlyMajor),
                  },
                });
              }}
            />
          </div>

          {derived != null ? (
            <TcoLiveCalcBanner>
              Calculated: {scenario.startingUsers} users ×{" "}
              {scenario.training.hoursPerUser} hrs ×{" "}
              {formatMoney({
                amountMinor: scenario.training.hourlyCostMinor!,
                currency: scenario.currency,
              })}{" "}
              ={" "}
              <strong>
                {formatMoney({
                  amountMinor: majorToMinor(derived),
                  currency: scenario.currency,
                })}
              </strong>{" "}
              <TcoSourceBadge sourceType="calculated" />
            </TcoLiveCalcBanner>
          ) : (
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              Set hours and hourly cost to see the calculated training total.
            </p>
          )}
        </div>
      </TcoFieldCard>

      <NavButtons onBack={onBack} onNext={onNext} />
    </section>
  );
}

function AdminStep({
  scenario,
  onChange,
  onBack,
  onNext,
}: {
  scenario: TCOScenario;
  onChange: (p: Partial<TCOScenario>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const hoursPresets = adminHoursWeekPresets(scenario.startingUsers);
  const supportPresets = supportMonthlyPresets(scenario.startingUsers);
  const currencySymbol = scenario.currency === "EUR" ? "€" : scenario.currency;

  const annualAdmin =
    scenario.administration.hoursPerWeek != null &&
    scenario.administration.hourlyCostMinor != null
      ? scenario.administration.hoursPerWeek *
        52 *
        minorToMajor(scenario.administration.hourlyCostMinor)
      : null;

  const supportAnnual =
    scenario.support.externalMonthlyMinor != null &&
    scenario.support.externalMonthlyMinor > 0
      ? minorToMajor(scenario.support.externalMonthlyMinor) * 12
      : null;

  return (
    <section aria-labelledby="admin-heading" className="space-y-6">
      <TcoStepHeader
        id="admin-heading"
        eyebrow="Step · Operations"
        title="Ongoing administration & support"
        description="Admin effort is often the largest difference vs licence price. We do not infer product-specific admin burden — pick a planning starter or enter your own figures."
      />

      <TcoFieldCard
        title="CRM administration"
        description="Weekly internal effort to keep the CRM healthy (users, workflows, hygiene)."
      >
        <div className="space-y-5">
          <div>
            <TcoQuickValueChips
              label="Admin hours / week"
              chips={hoursPresets.map((p) => ({
                id: p.id,
                label: p.label,
                value: p.hoursPerWeek,
              }))}
              activeValue={scenario.administration.hoursPerWeek}
              formatValue={(v) => `${v} hrs`}
              onSelect={(hoursPerWeek) => {
                onChange({
                  administration: {
                    ...scenario.administration,
                    hoursPerWeek,
                    hourlyCostMinor:
                      scenario.administration.hourlyCostMinor ??
                      majorToMinor(50),
                  },
                });
                track({
                  name: "tco_cost_assumption_added",
                  properties: { category: "administration" },
                });
              }}
            />
            <TcoNumberField
              className="mt-3"
              id="admin-hours"
              label="Admin hours / week"
              value={scenario.administration.hoursPerWeek}
              step={0.5}
              suffix="hrs / week"
              placeholder="e.g. 8"
              hint={`Suggestions scale with ${scenario.startingUsers} users — edit anytime.`}
              onChange={(hoursPerWeek) =>
                onChange({
                  administration: {
                    ...scenario.administration,
                    hoursPerWeek,
                  },
                })
              }
            />
          </div>

          <div>
            <TcoQuickValueChips
              label="Internal hourly cost"
              chips={INTERNAL_HOURLY_PRESETS.map((p) => ({
                id: p.id,
                label: p.label,
                value: p.hourlyMajor,
              }))}
              activeValue={
                scenario.administration.hourlyCostMinor != null
                  ? minorToMajor(scenario.administration.hourlyCostMinor)
                  : undefined
              }
              formatValue={(v) => `${currencySymbol}${v}`}
              onSelect={(hourlyMajor) => {
                onChange({
                  administration: {
                    ...scenario.administration,
                    hourlyCostMinor: majorToMinor(hourlyMajor),
                  },
                });
              }}
            />
            <TcoNumberField
              className="mt-3"
              id="admin-rate"
              label="Internal hourly cost"
              value={
                scenario.administration.hourlyCostMinor != null
                  ? minorToMajor(scenario.administration.hourlyCostMinor)
                  : undefined
              }
              prefix={currencySymbol}
              suffix="/ hour"
              placeholder="e.g. 50"
              onChange={(hourlyMajor) =>
                onChange({
                  administration: {
                    ...scenario.administration,
                    hourlyCostMinor:
                      hourlyMajor == null
                        ? undefined
                        : majorToMinor(hourlyMajor),
                  },
                })
              }
            />
          </div>

          {annualAdmin != null ? (
            <TcoLiveCalcBanner>
              Annual internal admin (your estimate):{" "}
              <strong>
                {formatMoney({
                  amountMinor: majorToMinor(annualAdmin),
                  currency: scenario.currency,
                })}
              </strong>{" "}
              <span className="text-[var(--sg-color-text-muted)]">
                ({scenario.administration.hoursPerWeek} hrs/week × 52 × rate)
              </span>{" "}
              <TcoSourceBadge sourceType="calculated" />
            </TcoLiveCalcBanner>
          ) : (
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              Set hours and hourly cost to preview annual administration cost.
            </p>
          )}
        </div>
      </TcoFieldCard>

      <TcoFieldCard
        title="External / premium support"
        description="Partner retainers or paid premium support beyond included vendor support."
      >
        <TcoQuickValueChips
          label="Monthly support starter"
          chips={supportPresets.map((p) => ({
            id: p.id,
            label: p.label,
            value: p.monthlyMajor,
          }))}
          activeValue={
            scenario.support.externalMonthlyMinor != null
              ? minorToMajor(scenario.support.externalMonthlyMinor)
              : undefined
          }
          formatValue={(v) =>
            v === 0
              ? `${currencySymbol}0`
              : formatAssumptionPreview(v, scenario.currency)
          }
          onSelect={(monthlyMajor) => {
            onChange({
              support: {
                ...scenario.support,
                externalMonthlyMinor:
                  monthlyMajor === 0 ? null : majorToMinor(monthlyMajor),
              },
            });
            if (monthlyMajor > 0) {
              track({
                name: "tco_cost_assumption_added",
                properties: { category: "support" },
              });
            }
          }}
        />
        <TcoMoneyInput
          className="mt-4"
          id="support-ext"
          label="External / premium support (monthly)"
          currency={scenario.currency}
          valueMajor={
            scenario.support.externalMonthlyMinor == null
              ? scenario.support.externalMonthlyMinor
              : minorToMajor(scenario.support.externalMonthlyMinor)
          }
          onChange={(major) =>
            onChange({
              support: {
                ...scenario.support,
                externalMonthlyMinor:
                  major === null
                    ? null
                    : major === undefined
                      ? undefined
                      : majorToMinor(major),
              },
            })
          }
          hint="Leave blank if unknown — included vendor support is not invented"
        />
        {supportAnnual != null ? (
          <TcoLiveCalcBanner className="mt-4">
            Annual external support:{" "}
            <strong>
              {formatMoney({
                amountMinor: majorToMinor(supportAnnual),
                currency: scenario.currency,
              })}
            </strong>{" "}
            <TcoSourceBadge sourceType="user-input" />
          </TcoLiveCalcBanner>
        ) : null}
      </TcoFieldCard>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="View results" />
    </section>
  );
}

function ResultsStep({
  result,
  scenario,
  session,
  focusProduct,
  logos,
  sensitivity,
  resourceLinks,
  copyDone,
  onCopy,
  onCsv,
  onPrint,
  onFocus,
  onDuplicate,
  onDeleteScenario,
  onSelectScenario,
  onRenameScenario,
  onReset,
  onEditAssumptions,
  onScorecard,
}: {
  result: ReturnType<typeof computeTco>;
  scenario: TCOScenario;
  session: TCOSession;
  focusProduct: ReturnType<typeof computeTco>["products"][0] | null;
  logos: Record<string, { src: string; alt: string } | undefined>;
  sensitivity: ReturnType<typeof buildSensitivityAnalysis>;
  resourceLinks: Array<{ href: string; label: string }>;
  copyDone: boolean;
  onCopy: () => void;
  onCsv: () => void;
  onPrint: () => void;
  onFocus: (id: string) => void;
  onDuplicate: () => void;
  onDeleteScenario: (id: string) => void;
  onSelectScenario: (id: string) => void;
  onRenameScenario: (name: string) => void;
  onReset: () => void;
  onEditAssumptions: () => void;
  onScorecard: () => void;
}) {
  return (
    <div className="space-y-10">
      <header className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-surface-tint)]/80 to-[var(--sg-color-surface)] px-5 py-6 shadow-[var(--sg-shadow-sm)] sm:px-7">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Results
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)] sm:text-3xl">
          Your CRM Total Cost of Ownership
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          Known costs only. Unknown categories are listed separately — never
          silently treated as $0.
        </p>
      </header>

      {/* Scenario controls */}
      <Card className="border-[var(--sg-color-border)] shadow-[var(--sg-shadow-sm)]">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-[var(--sg-color-text)]">
            Scenario
            <select
              className="ml-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2.5 py-1.5 text-sm"
              value={session.activeScenarioId}
              onChange={(e) => onSelectScenario(e.target.value)}
            >
              {session.scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <input
            aria-label="Scenario name"
            className="min-w-[10rem] flex-1 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2.5 py-1.5 text-sm"
            value={scenario.name}
            onChange={(e) => onRenameScenario(e.target.value)}
          />
          <Button size="sm" variant="outline" onClick={onDuplicate}>
            Duplicate scenario
          </Button>
          {session.scenarios.length > 1 ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteScenario(scenario.id)}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </Card>

      {result.currencyWarning ? (
        <Alert variant="warning">{result.currencyWarning}</Alert>
      ) : null}

      {/* Product summaries */}
      <TcoProductSummaryCards
        products={result.products}
        focusProductId={focusProduct?.productId}
        horizonYears={scenario.horizonYears}
        logos={logos}
        onFocus={onFocus}
      />

      {/* Composition */}
      <section aria-labelledby="composition-heading" className="space-y-4">
        <div>
          <h3
            id="composition-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            Cost composition
          </h3>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            How known ownership costs split across categories for each product.
          </p>
        </div>
        <TcoCompositionChart
          products={result.products}
          focusProductId={focusProduct?.productId}
          logos={logos}
        />
      </section>

      {/* Year by year */}
      {focusProduct ? (
        <section aria-labelledby="yearly-heading" className="space-y-4">
          <div>
            <h3
              id="yearly-heading"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
            >
              TCO over time — {focusProduct.productName}
            </h3>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Known costs by year, including seat growth where you set it.
            </p>
          </div>
          <TcoYearlyTable product={focusProduct} />
        </section>
      ) : null}

      {/* Comparison */}
      {result.comparison.length > 1 ? (
        <section
          aria-labelledby="compare-heading"
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6"
        >
          <h3
            id="compare-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            Compare {scenario.horizonYears}-year known TCO
          </h3>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Cost comparison only — lowest known TCO is not necessarily the best
            product.
          </p>
          <ul className="mt-5 space-y-4">
            {result.comparison.map((c) => {
              const max = result.comparison[result.comparison.length - 1]
                ?.knownTcoMinor;
              const width =
                max && max > 0 ? (c.knownTcoMinor / max) * 100 : 0;
              const isLowest = c.deltaVsLowestMinor === 0;
              return (
                <li key={c.productId}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                    <span className="font-semibold text-[var(--sg-color-navy)]">
                      {c.productName}
                    </span>
                    <span className="tabular-nums font-medium">
                      {formatMoney({
                        amountMinor: c.knownTcoMinor,
                        currency: result.currency as "EUR",
                      })}
                      {isLowest ? (
                        <span className="ml-2 text-[var(--sg-color-success)]">
                          lowest
                        </span>
                      ) : (
                        <span className="ml-2 text-[var(--sg-color-text-muted)]">
                          (+
                          {formatMoney({
                            amountMinor: c.deltaVsLowestMinor,
                            currency: result.currency as "EUR",
                          })}
                          )
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isLowest
                          ? "bg-[var(--sg-color-success)]"
                          : "bg-[var(--sg-color-primary)]",
                      )}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <ButtonLink
            className="mt-5"
            href="/tools/crm-vendor-scorecard/?from=tco"
            onClick={onScorecard}
          >
            Open Vendor Scorecard →
          </ButtonLink>
        </section>
      ) : null}

      {/* Licence vs true cost */}
      {focusProduct ? <TcoLicenceGapPanel product={focusProduct} /> : null}

      {/* Drivers */}
      {focusProduct ? (
        <TcoCostDriversPanel
          drivers={deriveCostDrivers(focusProduct)}
          currency={focusProduct.currency as "EUR"}
          productName={focusProduct.productName}
        />
      ) : null}

      {/* Sensitivity */}
      <TcoSensitivityPanel
        items={sensitivity}
        horizonYears={scenario.horizonYears}
        currency={result.currency as "EUR"}
      />

      {/* Unknowns */}
      {focusProduct && focusProduct.unknownItems.length > 0 ? (
        <section
          aria-labelledby="unknown-heading"
          className="rounded-[var(--sg-radius-xl)] border border-dashed border-amber-400/50 bg-amber-50/40 p-5 sm:p-6"
        >
          <h3
            id="unknown-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            Costs not included yet
          </h3>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            These stay out of known TCO until you add an estimate — never treated
            as $0.
          </p>
          <ul className="mt-4 space-y-2">
            {focusProduct.unknownItems.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm"
              >
                <span className="font-medium">{u.label}</span>
                <TcoSourceBadge sourceType="unknown" />
              </li>
            ))}
          </ul>
          <Button
            className="mt-4"
            size="sm"
            variant="outline"
            onClick={onEditAssumptions}
          >
            Add estimate
          </Button>
        </section>
      ) : null}

      {/* Assumptions */}
      <TcoAssumptionsPanel
        assumptions={result.assumptions}
        onEdit={onEditAssumptions}
      />

      {/* Export */}
      <div className="flex flex-wrap items-center gap-2 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 shadow-[var(--sg-shadow-sm)]">
        <p className="mr-auto text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          Export
        </p>
        <Button variant="outline" size="sm" onClick={onCopy}>
          <Copy className="size-4" aria-hidden />
          {copyDone ? "Copied" : "Copy summary"}
        </Button>
        <Button variant="outline" size="sm" onClick={onCsv}>
          <Download className="size-4" aria-hidden />
          Download CSV
        </Button>
        <Button variant="outline" size="sm" onClick={onPrint}>
          <Printer className="size-4" aria-hidden />
          Print
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden />
          Reset
        </Button>
      </div>

      {/* Next steps */}
      <section
        aria-labelledby="next-heading"
        className="grid gap-4 sm:grid-cols-3"
      >
        <h3 id="next-heading" className="sr-only">
          What&apos;s next?
        </h3>
        <Card>
          <p className="text-sm font-semibold">Compare vendors in detail</p>
          <ButtonLink
            className="mt-3"
            href="/tools/crm-vendor-scorecard/?from=tco"
            size="sm"
            onClick={onScorecard}
          >
            Vendor Scorecard
          </ButtonLink>
        </Card>
        <Card>
          <p className="text-sm font-semibold">Software-only pricing</p>
          <ButtonLink
            className="mt-3"
            href="/tools/crm-cost-calculator/?from=tco"
            size="sm"
          >
            Cost Calculator
          </ButtonLink>
        </Card>
        <Card>
          <p className="text-sm font-semibold">
            Want to know whether the investment pays back?
          </p>
          <Badge className="mt-2" variant="neutral">
            Coming next
          </Badge>
          <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
            CRM ROI Calculator — not available yet.
          </p>
        </Card>
      </section>

      {resourceLinks.length > 0 ? (
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {resourceLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
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

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sg-color-border)] pt-5">
      <Button variant="outline" size="lg" onClick={onBack}>
        Back
      </Button>
      <Button size="lg" onClick={onNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
