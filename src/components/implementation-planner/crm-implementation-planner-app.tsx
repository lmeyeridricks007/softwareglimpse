/**
 * CRM Implementation Planner — deterministic plan from CRMDecisionProfile scope.
 * Persistence: localStorage `sg-crm-implementation-plan-v1`
 * Affiliate status never influences phases, tasks or risks.
 */
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ClipboardList,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { track } from "@/analytics";
import type {
  CrmDecisionProfile,
  CrmImplementationPlan,
  ImplementationType,
  LaunchScope,
  TrainingApproach,
  MigrationSource,
} from "@/domain";
import { createEmptyCrmImplementationPlan } from "@/domain";
import { loadCrmDecisionProfile } from "@/services/decision-profile/client";
import {
  detectProfileChanges,
  downloadTextFile,
  generateImplementationPlan,
  generateReadinessGaps,
  generateRisks,
  generateUatItems,
  loadCrmImplementationPlan,
  mergeGeneratedRisks,
  mergeUatItems,
  openRiskCount,
  planToChecklistCsv,
  planToPlainText,
  prefillFromProfile,
  resetCrmImplementationPlan,
  saveCrmImplementationPlan,
} from "@/services/implementation-planner";
import { FinderPageHero } from "@/components/finder/finder-page-hero";
import { FinderShell } from "@/components/finder/finder-shell";
import { FinderStepper } from "@/components/finder/finder-stepper";
import { ProductLogo } from "@/components/software/product-logo";
import {
  ResultsLoadingState,
  useDelayedResultsReveal,
} from "@/components/tools/results-loading";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { ImplementationHeroPreview } from "./hero-preview";
import {
  ImplementationMobileBar,
  ImplementationSidebar,
} from "./sidebar";
import { PlanResults, type ResultTab } from "./plan-results";

const STAGES = [
  { id: "profile", label: "Profile" },
  { id: "product", label: "CRM" },
  { id: "scope", label: "Scope" },
  { id: "migration", label: "Migration" },
  { id: "training", label: "Training" },
  { id: "plan", label: "Plan" },
] as const;

type StepId = (typeof STAGES)[number]["id"];

type ProductOption = {
  slug: string;
  name: string;
  logo: { src: string; alt: string } | null;
};

type Props = {
  productOptions: ProductOption[];
  resourceLinks?: Array<{ href: string; label: string }>;
  title?: string;
  description?: string;
  titleElement?: "h1" | "h2" | "none";
};

const VALUE_PROPS = [
  {
    icon: ClipboardList,
    title: "Based on your requirements",
    body: "Phases and tasks follow your CRM profile.",
  },
  {
    icon: Eye,
    title: "Editable planning assumptions",
    body: "Durations and owners stay under your control.",
  },
  {
    icon: ShieldCheck,
    title: "Product coverage where available",
    body: "No invented vendor implementation claims.",
  },
  {
    icon: ShieldCheck,
    title: "No affiliate influence",
    body: "Affiliate status never shapes the plan.",
  },
];

const IMPLEMENTATION_TYPES: Array<{
  value: ImplementationType;
  label: string;
}> = [
  { value: "new-from-scratch", label: "New CRM from scratch" },
  { value: "replace-existing", label: "Replace existing CRM" },
  { value: "consolidate-multiple", label: "Consolidate multiple CRMs" },
  {
    value: "from-spreadsheets",
    label: "Move from spreadsheets / manual process",
  },
  {
    value: "major-reconfiguration",
    label: "Major reconfiguration of existing CRM",
  },
  {
    value: "expansion",
    label: "Expansion to another team / business unit",
  },
];

const LAUNCH_SCOPES: Array<{ value: LaunchScope; label: string }> = [
  { value: "core-only", label: "Core only" },
  { value: "most-requirements", label: "Most requirements" },
  { value: "full-target-state", label: "Full target state" },
];

const TRAINING_OPTIONS: Array<{ value: TrainingApproach; label: string }> = [
  { value: "self-service", label: "Self-service" },
  { value: "internal-trainer", label: "Internal trainer" },
  { value: "vendor", label: "Vendor" },
  { value: "partner", label: "Partner" },
  { value: "mixed", label: "Mixed" },
  { value: "undecided", label: "Not decided yet" },
];

const MIGRATION_SOURCES: Array<{ value: MigrationSource; label: string }> = [
  { value: "none", label: "No migration" },
  { value: "spreadsheet", label: "Spreadsheet" },
  { value: "existing-crm", label: "Existing CRM" },
  { value: "multiple-systems", label: "Multiple systems" },
  { value: "other", label: "Other" },
  { value: "unknown", label: "Not sure yet" },
];

export function CrmImplementationPlannerApp({
  productOptions,
  resourceLinks = [],
  title = "Build your CRM implementation plan",
  description = "Turn your CRM requirements, migration scope, integrations and target go-live into a structured implementation plan with phases, tasks, responsibilities and dependencies.",
  titleElement = "h1",
}: Props) {
  const searchParams = useSearchParams();
  const fromHint = searchParams.get("from");

  const [plan, setPlan] = useState<CrmImplementationPlan>(() =>
    createEmptyCrmImplementationPlan(),
  );
  const [profile, setProfile] = useState<CrmDecisionProfile | null>(null);
  const [step, setStep] = useState<StepId>("profile");
  const [maxStepIndex, setMaxStepIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [started, setStarted] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [resultTab, setResultTab] = useState<ResultTab>("overview");
  const [timelineView, setTimelineView] = useState<"gantt" | "list">("gantt");
  const [mobileTab, setMobileTab] = useState<"plan" | "tasks" | "risks">("plan");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [profileBanner, setProfileBanner] = useState<string | null>(null);
  const { isLoading, startReveal, resetReveal } = useDelayedResultsReveal();

  const productBySlug = useMemo(() => {
    const map = new Map(productOptions.map((p) => [p.slug, p]));
    return map;
  }, [productOptions]);

  useEffect(() => {
    const loadedProfile = loadCrmDecisionProfile();
    const existing = loadCrmImplementationPlan();
    const prefill = prefillFromProfile(loadedProfile);
    setProfile(loadedProfile);

    if (existing?.planGeneratedAt) {
      // Refresh risks/gaps from current rules without wiping user risk statuses.
      const refreshedRisks = mergeGeneratedRisks(
        generateRisks(existing, loadedProfile),
        existing.risks,
      );
      const refreshedGaps = generateReadinessGaps(existing, loadedProfile).map(
        (gap) => {
          const prev = existing.readinessGaps.find((g) => g.id === gap.id);
          return prev ? { ...gap, resolved: prev.resolved } : gap;
        },
      );
      const refreshedUat = mergeUatItems(
        generateUatItems(loadedProfile),
        existing.uatItems,
      );
      setPlan({
        ...existing,
        risks: refreshedRisks,
        readinessGaps: refreshedGaps,
        uatItems: refreshedUat.length ? refreshedUat : existing.uatItems,
      });
      setStarted(true);
      setStep("plan");
      setMaxStepIndex(STAGES.length - 1);
      const drift = detectProfileChanges(existing, loadedProfile);
      if (drift.changed) setProfileBanner(drift.message);
    } else if (loadedProfile) {
      setPlan((prev) => ({
        ...prev,
        productId: prefill.productId ?? prev.productId,
        productName: prefill.productId
          ? productBySlug.get(prefill.productId)?.name
          : prev.productName,
        scope: {
          ...prev.scope,
          users: prefill.users ?? prev.scope.users,
          teamLabels: prefill.teamLabels.length
            ? prefill.teamLabels
            : prev.scope.teamLabels,
          teamCount: Math.max(
            1,
            prefill.teamLabels.length || prev.scope.teamCount || 1,
          ),
          trainingApproach:
            prefill.trainingApproach ?? prev.scope.trainingApproach,
        },
        decisionProfileUpdatedAt: loadedProfile.updatedAt,
      }));
    }

    if (fromHint) {
      track({
        name: "crm_implementation_started",
        properties: { from: fromHint },
      });
    }
    setHydrated(true);
  }, [fromHint, productBySlug]);

  useEffect(() => {
    if (!hydrated || !started) return;
    saveCrmImplementationPlan(plan);
  }, [plan, hydrated, started]);

  function goToStep(id: StepId) {
    const idx = STAGES.findIndex((s) => s.id === id);
    if (idx <= maxStepIndex) setStep(id);
  }

  function advance(next: StepId) {
    const idx = STAGES.findIndex((s) => s.id === next);
    setMaxStepIndex((m) => Math.max(m, idx));
    setStep(next);
  }

  function startFresh() {
    track({ name: "crm_implementation_started", properties: { mode: "manual" } });
    setStarted(true);
    setStep("profile");
    setMaxStepIndex(0);
  }

  function useProfile() {
    if (!profile) {
      startFresh();
      return;
    }
    track({ name: "implementation_profile_loaded" });
    const prefill = prefillFromProfile(profile);
    setPlan((prev) => ({
      ...prev,
      productId: prefill.productId ?? prev.productId,
      productName: prefill.productId
        ? productBySlug.get(prefill.productId)?.name
        : prev.productName,
      scope: {
        ...prev.scope,
        users: prefill.users ?? prev.scope.users,
        teamLabels: prefill.teamLabels.length
          ? prefill.teamLabels
          : prev.scope.teamLabels,
        teamCount: Math.max(1, prefill.teamLabels.length || 1),
        trainingApproach:
          prefill.trainingApproach ?? prev.scope.trainingApproach,
      },
      decisionProfileUpdatedAt: profile.updatedAt,
    }));
    setStarted(true);
    advance("product");
  }

  function generatePlan() {
    const product = plan.productId
      ? productBySlug.get(plan.productId)
      : undefined;
    const next = generateImplementationPlan({
      profile,
      existing: plan,
      productId: plan.productId,
      productName: product?.name ?? plan.productName,
      vendorNeutral: !plan.productId,
      implementationType: plan.implementationType,
      targetGoLive: plan.targetGoLive,
      trainingApproach: plan.scope.trainingApproach,
      migrationSource: plan.scope.migrationSource,
      preserveUserEdits: true,
    });
    // Compute immediately; delay reveal so the planner matches other CRM tools.
    setPlan(next);
    setProfileBanner(null);
    setResultTab("overview");
    advance("plan");
    startReveal(() => {
      track({
        name: "implementation_plan_generated",
        properties: {
          phases: next.phases.length,
          tasks: next.tasks.length,
          vendor_neutral: next.vendorNeutral,
        },
      });
      document
        .getElementById("impl-workspace")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  }

  async function copyPlan() {
    const text = planToPlainText(plan);
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
      track({
        name: "implementation_exported",
        properties: { format: "clipboard" },
      });
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      // ignore
    }
  }

  function downloadCsv() {
    downloadTextFile(
      "crm-implementation-plan.csv",
      planToChecklistCsv(plan),
      "text/csv;charset=utf-8",
    );
    track({ name: "implementation_exported", properties: { format: "csv" } });
  }

  function printPlan() {
    track({ name: "implementation_exported", properties: { format: "print" } });
    window.print();
  }

  function resetAll() {
    resetReveal();
    const empty = resetCrmImplementationPlan();
    setPlan(empty);
    setStarted(false);
    setStep("profile");
    setMaxStepIndex(0);
    setProfileBanner(null);
  }

  if (!hydrated) {
    return (
      <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
        Loading implementation planner…
      </p>
    );
  }

  const hasPlan = Boolean(plan.planGeneratedAt) && !isLoading;
  const openRisks = openRiskCount(plan);
  const activeIndex = Math.max(0, STAGES.findIndex((s) => s.id === step));
  const showPlanResults = step === "plan" && hasPlan && !isLoading;

  return (
    <div className="pb-20 lg:pb-8">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        CRM Implementation Planner
      </p>
      <FinderPageHero
        title={title}
        description={description}
        valueProps={VALUE_PROPS}
        visualSlot={<ImplementationHeroPreview />}
        titleElement={titleElement}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          size="lg"
          onClick={() => {
            if (!started) startFresh();
            document
              .getElementById("impl-workspace")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Build implementation plan
        </Button>
        <Button size="lg" variant="outline" onClick={useProfile}>
          Load my CRM profile
        </Button>
      </div>

      {profile && !started ? (
        <Card className="mt-6 border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/30">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Using your existing CRM profile
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-[var(--sg-color-text-muted)]">
            {prefillFromProfile(profile).profileSummary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={useProfile}>
              Use profile
            </Button>
            <ButtonLink
              href="/tools/crm-requirements-builder/?from=implementation"
              variant="outline"
              size="sm"
            >
              Edit
            </ButtonLink>
          </div>
        </Card>
      ) : null}

      <div id="impl-workspace" className="mt-10 scroll-mt-24">
        {profileBanner ? (
          <Alert className="mb-4" variant="warning">
            <p className="font-medium">{profileBanner}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" onClick={generatePlan}>
                Review changes
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setProfileBanner(null)}
              >
                Dismiss
              </Button>
            </div>
          </Alert>
        ) : null}

        {started ? (
          isLoading ? (
            <ResultsLoadingState
              className="mt-6"
              title="Building your implementation plan…"
              description="Generating phases, tasks, dependencies and risks from your scope and CRM profile."
            />
          ) : (
          <>
            {!(step === "plan" && hasPlan) ? (
              <FinderStepper
                stages={[...STAGES]}
                activeIndex={activeIndex}
                maxReachableIndex={maxStepIndex}
                onStageSelect={(id) => {
                  if (STAGES.some((s) => s.id === id)) goToStep(id as StepId);
                }}
              />
            ) : null}

            <div
              className={cn(
                "mt-6 grid gap-8",
                hasPlan
                  ? "lg:grid-cols-[minmax(0,1fr)_20rem]"
                  : "lg:grid-cols-[16rem_minmax(0,1fr)]",
              )}
            >
              {!hasPlan ? (
                <div className="hidden lg:block">
                  <SetupProgress
                    stages={STAGES}
                    step={step}
                    maxStepIndex={maxStepIndex}
                    onSelect={goToStep}
                  />
                </div>
              ) : null}

              <FinderShell>
                {step === "profile" ? (
                  <ProfileStep
                    profile={profile}
                    onUseProfile={useProfile}
                    onContinue={() => advance("product")}
                  />
                ) : null}

                {step === "product" ? (
                  <ProductStep
                    plan={plan}
                    setPlan={setPlan}
                    profile={profile}
                    productBySlug={productBySlug}
                    productOptions={productOptions}
                    onBack={() => setStep("profile")}
                    onNext={() => advance("scope")}
                  />
                ) : null}

                {step === "scope" ? (
                  <ScopeStep
                    plan={plan}
                    setPlan={setPlan}
                    profile={profile}
                    onBack={() => setStep("product")}
                    onNext={() => advance("migration")}
                  />
                ) : null}

                {step === "migration" ? (
                  <MigrationStep
                    plan={plan}
                    setPlan={setPlan}
                    profile={profile}
                    onBack={() => setStep("scope")}
                    onNext={() => advance("training")}
                  />
                ) : null}

                {step === "training" ? (
                  <section className="space-y-4" aria-labelledby="step-training">
                    <h2
                      id="step-training"
                      className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
                    >
                      Training & change approach
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {TRAINING_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setPlan((p) => ({
                              ...p,
                              scope: {
                                ...p.scope,
                                trainingApproach: opt.value,
                              },
                            }))
                          }
                          className={cn(
                            "rounded-[var(--sg-radius-pill)] border px-3 py-1.5 text-sm",
                            plan.scope.trainingApproach === opt.value
                              ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary)] text-white"
                              : "border-[var(--sg-color-border)]",
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep("migration")}
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                      <Button onClick={generatePlan} disabled={isLoading}>
                        Generate project plan
                      </Button>
                    </div>
                  </section>
                ) : null}

                {showPlanResults ? (
                  <PlanResults
                    plan={plan}
                    setPlan={setPlan}
                    resultTab={resultTab}
                    setResultTab={setResultTab}
                    timelineView={timelineView}
                    setTimelineView={setTimelineView}
                    mobileTab={mobileTab}
                    openRisks={openRisks}
                    newTaskTitle={newTaskTitle}
                    setNewTaskTitle={setNewTaskTitle}
                    onCopy={copyPlan}
                    copyDone={copyDone}
                    onCsv={downloadCsv}
                    onPrint={printPlan}
                    onReset={resetAll}
                    onRegenerate={generatePlan}
                    resourceLinks={resourceLinks}
                  />
                ) : null}
              </FinderShell>

              {hasPlan ? (
                <ImplementationSidebar
                  plan={plan}
                  className="hidden lg:block"
                  onViewPlan={() => {
                    setResultTab("overview");
                    setStep("plan");
                  }}
                />
              ) : null}
            </div>
          </>
          )
        ) : null}
      </div>

      {hasPlan ? (
        <ImplementationMobileBar
          plan={plan}
          active={mobileTab}
          onChange={(id) => {
            setMobileTab(id);
            if (id === "tasks") setResultTab("tasks");
            if (id === "risks") setResultTab("risks");
            if (id === "plan") setResultTab("overview");
          }}
        />
      ) : null}
    </div>
  );
}

function SetupProgress({
  stages,
  step,
  maxStepIndex,
  onSelect,
}: {
  stages: typeof STAGES;
  step: StepId;
  maxStepIndex: number;
  onSelect: (id: StepId) => void;
}) {
  const current = Math.max(0, stages.findIndex((s) => s.id === step));
  return (
    <nav
      className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
      aria-label="Implementation steps"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Implementation steps
      </p>
      <ol className="mt-3 space-y-2">
        {stages.map((s, i) => {
          const done = i < current;
          const active = s.id === step;
          const locked = i > maxStepIndex;
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={locked}
                onClick={() => onSelect(s.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-[var(--sg-radius-md)] px-2 py-1.5 text-left text-sm",
                  active && "bg-[var(--sg-color-primary-soft)]/60 font-medium",
                  locked && "opacity-40",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-5 items-center justify-center rounded-full text-[10px]",
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                        ? "bg-[var(--sg-color-primary)] text-white"
                        : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
                  )}
                >
                  {done ? <Check className="size-3" aria-hidden /> : i + 1}
                </span>
                {s.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ProfileStep({
  profile,
  onUseProfile,
  onContinue,
}: {
  profile: CrmDecisionProfile | null;
  onUseProfile: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="space-y-4" aria-labelledby="step-profile">
      <h2
        id="step-profile"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        Load existing context
      </h2>
      {profile ? (
        <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-primary-soft)]/40 p-4">
          <p className="font-medium text-[var(--sg-color-navy)]">
            Using your existing CRM profile
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-[var(--sg-color-text-muted)]">
            {prefillFromProfile(profile).profileSummary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={onUseProfile}>
              Use profile
            </Button>
            <ButtonLink
              href="/tools/crm-requirements-builder/?from=implementation"
              variant="outline"
              size="sm"
            >
              Edit profile
            </ButtonLink>
          </div>
        </div>
      ) : (
        <Alert variant="info">
          No CRMDecisionProfile found on this device. Continue manually, or{" "}
          <Link
            href="/tools/crm-requirements-builder/?from=implementation"
            className="underline"
          >
            build requirements first
          </Link>
          .
        </Alert>
      )}
      <div className="flex justify-end">
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </section>
  );
}

function ProductStep({
  plan,
  setPlan,
  profile,
  productBySlug,
  productOptions,
  onBack,
  onNext,
}: {
  plan: CrmImplementationPlan;
  setPlan: React.Dispatch<React.SetStateAction<CrmImplementationPlan>>;
  profile: CrmDecisionProfile | null;
  productBySlug: Map<string, ProductOption>;
  productOptions: ProductOption[];
  onBack: () => void;
  onNext: () => void;
}) {
  const slugs = profile?.shortlistProductIds.length
    ? profile.shortlistProductIds
    : productOptions.slice(0, 8).map((p) => p.slug);

  return (
    <section className="space-y-4" aria-labelledby="step-product">
      <h2
        id="step-product"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        Select / confirm CRM
      </h2>
      <p className="text-sm text-[var(--sg-color-text-muted)]">
        Focus on one active plan at a time. You can keep a vendor-neutral plan
        if you have not selected yet.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() =>
            setPlan((p) => ({
              ...p,
              productId: undefined,
              productName: undefined,
              vendorNeutral: true,
            }))
          }
          className={cn(
            "rounded-[var(--sg-radius-md)] border px-4 py-3 text-left text-sm",
            plan.vendorNeutral || !plan.productId
              ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]/50"
              : "border-[var(--sg-color-border)]",
          )}
        >
          <span className="font-medium">Vendor-neutral plan</span>
          <span className="mt-1 block text-[var(--sg-color-text-muted)]">
            Generic CRM implementation framework
          </span>
        </button>
        {slugs.map((slug) => {
          const opt = productBySlug.get(slug);
          if (!opt) return null;
          const selected = plan.productId === slug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() =>
                setPlan((p) => ({
                  ...p,
                  productId: slug,
                  productName: opt.name,
                  vendorNeutral: false,
                }))
              }
              className={cn(
                "flex items-center gap-3 rounded-[var(--sg-radius-md)] border px-4 py-3 text-left text-sm",
                selected
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]/50"
                  : "border-[var(--sg-color-border)]",
              )}
            >
              <ProductLogo name={opt.name} logo={opt.logo} size="sm" />
              <span className="font-medium">{opt.name}</span>
              {selected ? (
                <Badge variant="success" className="ml-auto">
                  Active
                </Badge>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Continue</Button>
      </div>
    </section>
  );
}

function ScopeStep({
  plan,
  setPlan,
  profile,
  onBack,
  onNext,
}: {
  plan: CrmImplementationPlan;
  setPlan: React.Dispatch<React.SetStateAction<CrmImplementationPlan>>;
  profile: CrmDecisionProfile | null;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="space-y-6" aria-labelledby="step-scope">
      <h2
        id="step-scope"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        Define implementation scope
      </h2>
      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-navy)]">
          What are you implementing?
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {IMPLEMENTATION_TYPES.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-start gap-2 rounded-[var(--sg-radius-md)] border px-3 py-2 text-sm",
                plan.implementationType === opt.value
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]/40"
                  : "border-[var(--sg-color-border)]",
              )}
            >
              <input
                type="radio"
                name="impl-type"
                className="mt-1"
                checked={plan.implementationType === opt.value}
                onChange={() =>
                  setPlan((p) => ({ ...p, implementationType: opt.value }))
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-[var(--sg-color-navy)]">
            CRM users
          </span>
          <input
            type="number"
            min={1}
            max={10000}
            className="mt-1 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
            value={plan.scope.users ?? ""}
            onChange={(e) =>
              setPlan((p) => ({
                ...p,
                scope: {
                  ...p.scope,
                  users: e.target.value ? Number(e.target.value) : undefined,
                },
              }))
            }
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-[var(--sg-color-navy)]">
            Teams in scope
          </span>
          <input
            type="number"
            min={1}
            max={50}
            className="mt-1 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
            value={plan.scope.teamCount ?? 1}
            onChange={(e) =>
              setPlan((p) => ({
                ...p,
                scope: {
                  ...p.scope,
                  teamCount: Number(e.target.value) || 1,
                },
              }))
            }
          />
        </label>
      </div>
      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-navy)]">
          Launch scope
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {LAUNCH_SCOPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setPlan((p) => ({
                  ...p,
                  scope: { ...p.scope, launchScope: opt.value },
                }))
              }
              className={cn(
                "rounded-[var(--sg-radius-pill)] border px-3 py-1.5 text-sm",
                plan.scope.launchScope === opt.value
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary)] text-white"
                  : "border-[var(--sg-color-border)]",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm">
        <span className="font-medium text-[var(--sg-color-navy)]">
          Target go-live date (optional)
        </span>
        <input
          type="date"
          className="mt-1 w-full max-w-xs rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
          value={plan.targetGoLive?.slice(0, 10) ?? ""}
          onChange={(e) =>
            setPlan((p) => ({
              ...p,
              targetGoLive: e.target.value || undefined,
            }))
          }
        />
        <span className="mt-1 block text-xs text-[var(--sg-color-text-muted)]">
          Leave blank for a forward schedule from scope rules. Dates drive a
          planning model — not a guaranteed delivery promise.
        </span>
      </label>
      {(profile?.capabilities.length ?? 0) > 0 ? (
        <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-4 text-sm">
          <p className="font-medium text-[var(--sg-color-navy)]">
            Capabilities from your profile
          </p>
          <ul className="mt-2 space-y-1 text-[var(--sg-color-text-muted)]">
            {profile!.capabilities.slice(0, 8).map((c) => (
              <li key={c.id}>
                {c.priority === "optional" ? "○" : "✓"} {c.id.replace(/-/g, " ")}{" "}
                <span className="text-[11px]">({c.priority})</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Continue</Button>
      </div>
    </section>
  );
}

function MigrationStep({
  plan,
  setPlan,
  profile,
  onBack,
  onNext,
}: {
  plan: CrmImplementationPlan;
  setPlan: React.Dispatch<React.SetStateAction<CrmImplementationPlan>>;
  profile: CrmDecisionProfile | null;
  onBack: () => void;
  onNext: () => void;
}) {
  const integrations =
    profile?.integrations.filter(
      (i) => i.priority === "required" || i.priority === "preferred",
    ) ?? [];

  return (
    <section className="space-y-4" aria-labelledby="step-migration">
      <h2
        id="step-migration"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        Assess data migration
      </h2>
      <p className="text-sm text-[var(--sg-color-text-muted)]">
        Profile migration complexity:{" "}
        <strong className="text-[var(--sg-color-text)]">
          {profile?.implementation.migrationComplexity ?? "not set"}
        </strong>
      </p>
      <fieldset>
        <legend className="text-sm font-medium">Current source</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {MIGRATION_SOURCES.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer gap-2 rounded-[var(--sg-radius-md)] border px-3 py-2 text-sm",
                plan.scope.migrationSource === opt.value
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]/40"
                  : "border-[var(--sg-color-border)]",
              )}
            >
              <input
                type="radio"
                name="mig-source"
                checked={plan.scope.migrationSource === opt.value}
                onChange={() =>
                  setPlan((p) => ({
                    ...p,
                    scope: { ...p.scope, migrationSource: opt.value },
                  }))
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
      <Alert variant="info">
        Need deeper field mapping, cleaning and cutover detail? Continue in the{" "}
        <Link
          href="/tools/crm-migration-planner/?from=implementation"
          className="font-medium text-[var(--sg-color-primary)] underline underline-offset-2"
        >
          CRM Migration Planner
        </Link>
        . This step still prepares migration phases and dependencies in your
        implementation plan.
      </Alert>
      {integrations.length > 0 ? (
        <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-4 text-sm">
          <p className="font-medium text-[var(--sg-color-navy)]">
            Integrations from profile
          </p>
          <ul className="mt-2 list-inside list-disc text-[var(--sg-color-text-muted)]">
            {integrations.map((i) => (
              <li key={i.id}>
                {i.id.replace(/-/g, " ")} ({i.priority})
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Continue</Button>
      </div>
    </section>
  );
}
