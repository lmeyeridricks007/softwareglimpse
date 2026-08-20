/**
 * Software Stack Builder wizard.
 *
 * Persistence: localStorage key `sg-stack-builder-v1` stores draft answers only.
 * Multi-product stack recommendations are not invented — results route users to
 * live CRM tools until stack scoring ships.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@/analytics";
import { FinderOption } from "@/components/finder/finder-option";
import { FinderMultiSelect } from "@/components/finder/finder-multi-select";
import { FinderShell } from "@/components/finder/finder-shell";
import {
  FinderPrivacyNote,
  FinderStepper,
} from "@/components/finder/finder-stepper";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import {
  ResultsLoadingState,
  useDelayedResultsReveal,
} from "@/components/tools/results-loading";
import {
  BUDGET_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  EASE_OPTIONS,
  GOAL_OPTIONS,
  REQUIREMENT_OPTIONS,
  STACK_BUILDER_STAGES,
  labelForStackOption,
  type StackStageId,
} from "./stack-builder-questions";
import {
  StackBuilderCostCard,
  StackBuilderFinderCard,
  StackBuilderSummaryCard,
  StackBuilderToolsCard,
} from "./stack-builder-sidebar";
import { StackPreviewPanel } from "./stack-preview";

const STORAGE_KEY = "sg-stack-builder-v1";

type Draft = {
  companySize?: string;
  businessType?: string;
  primaryGoal?: string;
  requirements?: string[];
  budget?: string;
  ease?: string;
  stageId?: StackStageId;
};

function defaultDraft(): Draft {
  return { requirements: [], stageId: "business" };
}

function readDraft(): Draft {
  if (typeof window === "undefined") return defaultDraft();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDraft();
    return { ...defaultDraft(), ...(JSON.parse(raw) as Draft) };
  } catch {
    return defaultDraft();
  }
}

function writeDraft(draft: Draft) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // ignore quota / private mode
  }
}

function stageIndex(id: StackStageId): number {
  return STACK_BUILDER_STAGES.findIndex((s) => s.id === id);
}

export function StackBuilderApp() {
  const [draft, setDraft] = useState<Draft>(defaultDraft);
  const [hydrated, setHydrated] = useState(false);
  const [maxStageIndex, setMaxStageIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { isLoading, startReveal, resetReveal } = useDelayedResultsReveal();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional localStorage hydration
    const stored = readDraft();
    setDraft(stored);
    const idx = Math.max(0, stageIndex((stored.stageId ?? "business") as StackStageId));
    setMaxStageIndex(idx);
    setHydrated(true);
    track({ name: "stack_builder_started" });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeDraft(draft);
  }, [draft, hydrated]);

  const activeId = (draft.stageId ?? "business") as StackStageId;
  const activeIndex = Math.max(0, stageIndex(activeId));

  const completedSteps = useMemo(() => {
    let n = 0;
    if (draft.companySize && draft.businessType) n += 1;
    if (draft.primaryGoal) n += 1;
    if ((draft.requirements?.length ?? 0) > 0) n += 1;
    if (draft.budget && draft.ease) n += 1;
    if (activeId === "results") n += 1;
    return n;
  }, [draft, activeId]);

  function goTo(id: StackStageId) {
    const idx = stageIndex(id);
    setDraft((d) => ({ ...d, stageId: id }));
    if (idx >= 0) {
      setMaxStageIndex((prev) => Math.max(prev, idx));
    }
  }

  function next() {
    const nextStage = STACK_BUILDER_STAGES[activeIndex + 1];
    if (!nextStage) return;
    if (nextStage.id === "results") {
      startReveal(() => {
        track({ name: "stack_builder_completed" });
        goTo("results");
      });
      return;
    }
    goTo(nextStage.id);
  }

  function back() {
    if (isLoading) {
      resetReveal();
      return;
    }
    const prev = STACK_BUILDER_STAGES[activeIndex - 1];
    if (prev) goTo(prev.id);
  }

  function restart() {
    resetReveal();
    const fresh = defaultDraft();
    setDraft(fresh);
    writeDraft(fresh);
    setMaxStageIndex(0);
    track({ name: "stack_builder_restarted" });
  }

  const canContinue =
    activeId === "business"
      ? Boolean(draft.companySize && draft.businessType)
      : activeId === "goals"
        ? Boolean(draft.primaryGoal)
        : activeId === "requirements"
          ? (draft.requirements?.length ?? 0) > 0
          : activeId === "preferences"
            ? Boolean(draft.budget && draft.ease)
            : true;

  const summaryRows = [
    {
      id: "business",
      label: "Business",
      value: [
        labelForStackOption(COMPANY_SIZE_OPTIONS, draft.companySize),
        labelForStackOption(BUSINESS_TYPE_OPTIONS, draft.businessType),
      ]
        .filter(Boolean)
        .join(" · "),
      onEdit: () => goTo("business"),
    },
    {
      id: "goals",
      label: "Goals",
      value: labelForStackOption(GOAL_OPTIONS, draft.primaryGoal),
      onEdit: () => goTo("goals"),
    },
    {
      id: "requirements",
      label: "Requirements",
      value:
        (draft.requirements?.length ?? 0) > 0
          ? draft.requirements!
              .map((id) => labelForStackOption(REQUIREMENT_OPTIONS, id) ?? id)
              .join(", ")
          : undefined,
      onEdit: () => goTo("requirements"),
    },
    {
      id: "preferences",
      label: "Preferences",
      value: [
        labelForStackOption(BUDGET_OPTIONS, draft.budget),
        labelForStackOption(EASE_OPTIONS, draft.ease),
      ]
        .filter(Boolean)
        .join(" · "),
      onEdit: () => goTo("preferences"),
    },
    {
      id: "budget",
      label: "Budget posture",
      value: labelForStackOption(BUDGET_OPTIONS, draft.budget),
      onEdit: () => goTo("preferences"),
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,19rem)] lg:items-start">
      <div className="min-w-0">
        {isLoading ? (
          <ResultsLoadingState
            title="Building your stack plan…"
            description="Saving your profile and preparing next steps from your answers."
          />
        ) : (
        <FinderShell>
          <FinderStepper
            stages={[...STACK_BUILDER_STAGES]}
            activeIndex={activeIndex}
            maxReachableIndex={maxStageIndex}
            onStageSelect={(id) => {
              if (!STACK_BUILDER_STAGES.some((s) => s.id === id)) return;
              if (id === "results") {
                if (activeId === "results") return;
                if (maxStageIndex >= stageIndex("results")) {
                  goTo("results");
                  return;
                }
                startReveal(() => {
                  track({ name: "stack_builder_completed" });
                  goTo("results");
                });
                return;
              }
              resetReveal();
              goTo(id as StackStageId);
            }}
          />

          {activeId === "business" ? (
            <BusinessStep
              companySize={draft.companySize}
              businessType={draft.businessType}
              onCompanySize={(companySize) =>
                setDraft((d) => ({ ...d, companySize }))
              }
              onBusinessType={(businessType) =>
                setDraft((d) => ({ ...d, businessType }))
              }
            />
          ) : null}

          {activeId === "goals" ? (
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
                What is your primary goal?
              </h2>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Pick the outcome that matters most right now.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {GOAL_OPTIONS.map((opt) => (
                  <FinderOption
                    key={opt.value}
                    name="stack-goal"
                    value={opt.value}
                    label={opt.label}
                    description={opt.description}
                    checked={draft.primaryGoal === opt.value}
                    onChange={(primaryGoal) =>
                      setDraft((d) => ({ ...d, primaryGoal }))
                    }
                    icon={opt.icon}
                    variant="card"
                  />
                ))}
              </div>
            </div>
          ) : null}

          {activeId === "requirements" ? (
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
                Which categories belong in your stack?
              </h2>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Select every category you expect to need. CRM and sales
                intelligence recommendations are available today; others unlock
                as catalogue coverage grows.
              </p>
              <div className="mt-5">
                <FinderMultiSelect
                  name="stack-requirements"
                  options={REQUIREMENT_OPTIONS}
                  values={draft.requirements ?? []}
                  onChange={(requirements) =>
                    setDraft((d) => ({ ...d, requirements }))
                  }
                />
              </div>
            </div>
          ) : null}

          {activeId === "preferences" ? (
            <div className="space-y-8">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
                  Budget posture
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {BUDGET_OPTIONS.map((opt) => (
                    <FinderOption
                      key={opt.value}
                      name="stack-budget"
                      value={opt.value}
                      label={opt.label}
                      description={opt.description}
                      checked={draft.budget === opt.value}
                      onChange={(budget) =>
                        setDraft((d) => ({ ...d, budget }))
                      }
                      icon={opt.icon}
                      variant="card"
                    />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
                  Complexity preference
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {EASE_OPTIONS.map((opt) => (
                    <FinderOption
                      key={opt.value}
                      name="stack-ease"
                      value={opt.value}
                      label={opt.label}
                      description={opt.description}
                      checked={draft.ease === opt.value}
                      onChange={(ease) => setDraft((d) => ({ ...d, ease }))}
                      variant="card"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeId === "results" ? (
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
                Profile saved — next steps
              </h2>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                CRM and sales intelligence are available in your stack plan now.
                More software categories are being added. Your answers stay on
                this device — continue with a live finder or the Cost
                Calculator.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href="/tools/crm-finder/" size="lg">
                  Open CRM Finder →
                </ButtonLink>
                {(draft.requirements ?? []).includes("sales-intelligence") ? (
                  <ButtonLink
                    href="/tools/sales-intelligence-finder/"
                    size="lg"
                  >
                    Open Sales Intelligence Finder →
                  </ButtonLink>
                ) : null}
                <ButtonLink
                  href="/tools/crm-cost-calculator/"
                  variant="outline"
                  size="lg"
                >
                  CRM Cost Calculator
                </ButtonLink>
                <Button type="button" variant="ghost" onClick={restart}>
                  Restart builder
                </Button>
              </div>
            </div>
          ) : null}

          {activeId !== "results" ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              {activeIndex > 0 ? (
                <Button type="button" variant="ghost" onClick={back}>
                  ← Back
                </Button>
              ) : (
                <span />
              )}
              <Button
                type="button"
                size="lg"
                disabled={!canContinue}
                onClick={next}
              >
                {activeId === "preferences"
                  ? "See results →"
                  : "Next step →"}
              </Button>
            </div>
          ) : null}

          <FinderPrivacyNote />
        </FinderShell>
        )}

        <StackPreviewPanel
          filter={categoryFilter}
          onFilterChange={setCategoryFilter}
          selectedRequirementIds={draft.requirements ?? []}
          complete={activeId === "results"}
          onContinue={() => {
            if (activeId === "results" || isLoading) return;
            if (canContinue) next();
            else {
              // jump to first incomplete stage
              if (!draft.companySize || !draft.businessType) goTo("business");
              else if (!draft.primaryGoal) goTo("goals");
              else if (!(draft.requirements?.length)) goTo("requirements");
              else goTo("preferences");
            }
          }}
        />
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24">
        <StackBuilderSummaryCard
          rows={summaryRows}
          completedSteps={completedSteps}
          totalSteps={5}
        />
        <StackBuilderCostCard />
        <StackBuilderFinderCard />
        <StackBuilderToolsCard
          items={[
            { href: "/tools/crm-finder/", label: "CRM Software Finder" },
            {
              href: "/tools/sales-intelligence-finder/",
              label: "Sales Intelligence Finder",
            },
            {
              href: "/tools/crm-cost-calculator/",
              label: "CRM Cost Calculator",
            },
            { href: "/tools/software-finder/", label: "Software Finder" },
            { href: "/best/crm-software/", label: "Best CRM Software" },
          ]}
        />
      </aside>
    </div>
  );
}

function BusinessStep({
  companySize,
  businessType,
  onCompanySize,
  onBusinessType,
}: {
  companySize?: string;
  businessType?: string;
  onCompanySize: (v: string) => void;
  onBusinessType: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
        Which best describes your business?
      </h2>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Start with company size, then pick the closest business type.
      </p>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        Company size
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {COMPANY_SIZE_OPTIONS.map((opt) => (
          <FinderOption
            key={opt.value}
            name="stack-size"
            value={opt.value}
            label={opt.label}
            description={opt.description}
            checked={companySize === opt.value}
            onChange={onCompanySize}
            icon={opt.icon}
            variant="card"
          />
        ))}
      </div>

      <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        Business type
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BUSINESS_TYPE_OPTIONS.map((opt) => (
          <FinderOption
            key={opt.value}
            name="stack-type"
            value={opt.value}
            label={opt.label}
            description={opt.description}
            checked={businessType === opt.value}
            onChange={onBusinessType}
            icon={opt.icon}
            variant="card"
          />
        ))}
      </div>
    </div>
  );
}
