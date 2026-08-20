/**
 * Category-agnostic Finder wizard (HR, PM, marketing, …).
 * Persistence: localStorage only (`sg-{category}-finder-v1`). No answer URLs.
 * Scoring: pure recommendForCategory on server-serialized snapshots.
 */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  Check,
  Factory,
  Store,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { track } from "@/analytics";
import type {
  BudgetBand,
  EasePreference,
  FinderCategorySlug,
  FinderRecommendationResult,
  CrmFinderAnswers,
} from "@/domain";
import { canonicalizeComparisonSlug } from "@/domain/comparison-slug";
import { finderConfigForCategory } from "@/data/config/recommendation/crm-finder-v1";
import {
  normalizeCategoryFinderAnswers,
  recommendForCategory,
  type ProductRecommendationSnapshot,
} from "@/services/recommendation";
import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import {
  BUDGET_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  CATEGORY_FINDER_STAGES,
  COMPANY_SIZE_OPTIONS,
  EASE_OPTIONS,
  buildCategoryFinderQuestions,
  categoryFirstQuestionIndexForStage,
  categoryStageIndexForQuestion,
  labelForOption,
  type FinderQuestion,
} from "./category-finder-questions";
import { FinderMultiSelect } from "./finder-multi-select";
import { FinderOption } from "./finder-option";
import { FinderProgressPanel } from "./finder-progress-panel";
import { FinderPrivacyNote, FinderStepper } from "./finder-stepper";
import { FinderStep } from "./finder-step";
import { RecommendationResultCard } from "./recommendation-result-card";
import { RestartFinder } from "./restart-finder";
import { Button } from "@/components/ui/button";
import {
  ResultsLoadingState,
  useDelayedResultsReveal,
} from "@/components/tools/results-loading";
import { cn } from "@/lib/cn";

const RESULTS_DEFAULT = 3;

const SIZE_ICONS: Record<string, LucideIcon> = {
  solo: User,
  micro: Users,
  "small-business": Store,
  "mid-market": Building2,
  enterprise: Factory,
};

const SEAT_PRESETS = [
  { label: "1–5", value: 3 },
  { label: "6–20", value: 12 },
  { label: "21–50", value: 30 },
  { label: "51–100", value: 75 },
  { label: "100+", value: 150 },
] as const;

type Phase = "questions" | "review" | "loading" | "results";

type DraftAnswers = {
  companySizeSlug?: string;
  crmUsers?: number;
  primaryUseCaseSlug?: string;
  requiredFeatureSlugs?: string[];
  preferredIntegrationSlugs?: string[];
  budgetBand?: BudgetBand;
  budgetMode?: "per-user-month";
  easePreference?: EasePreference;
  businessTypeSlug?: string;
};

type StoredFinderBlob = DraftAnswers & {
  resultOrder?: string[];
};

type Props = {
  kit: CategoryFinderClientKit;
  snapshots: ProductRecommendationSnapshot[];
  publishedComparisonSlugs: string[];
  logos?: Record<string, { src: string; alt: string } | undefined>;
  visitCtas?: Record<
    string,
    { href: string; isAffiliate: boolean; rel: string[]; label: string }
  >;
};

function defaultAnswers(): DraftAnswers {
  return {
    crmUsers: 5,
    budgetMode: "per-user-month",
    requiredFeatureSlugs: [],
    preferredIntegrationSlugs: [],
  };
}

function countMatchedRequired(
  result: FinderRecommendationResult,
  required: string[],
): number {
  if (required.length === 0) return 0;
  const positiveRequired = result.reasons.filter(
    (r) => r.positive && r.code.startsWith("required-feature"),
  ).length;
  return Math.min(required.length, positiveRequired);
}

export function CategoryFinderApp({
  kit,
  snapshots,
  publishedComparisonSlugs,
  logos = {},
  visitCtas = {},
}: Props) {
  const questions = useMemo(
    () => buildCategoryFinderQuestions(kit),
    [kit],
  );
  const finderConfig = useMemo(
    () => finderConfigForCategory(kit.categorySlug),
    [kit.categorySlug],
  );
  const [phase, setPhase] = useState<Phase>("questions");
  const [stepIndex, setStepIndex] = useState(0);
  const [maxStageIndex, setMaxStageIndex] = useState(0);
  const [answers, setAnswers] = useState<DraftAnswers>(defaultAnswers);
  const [hydrated, setHydrated] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [results, setResults] = useState<FinderRecommendationResult[]>([]);
  const [emptyReason, setEmptyReason] = useState<string | undefined>();
  const [methodologyVersion, setMethodologyVersion] = useState(finderConfig.version);
  const [started, setStarted] = useState(false);
  const { isLoading, startReveal, resetReveal } = useDelayedResultsReveal();

  const question = questions[stepIndex];
  const publishedSet = useMemo(
    () => new Set(publishedComparisonSlugs),
    [publishedComparisonSlugs],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(kit.storageKey);
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw) as StoredFinderBlob;
      const { resultOrder: _ignoredOrder, ...stored } = parsed;
      void _ignoredOrder;
      setAnswers({ ...defaultAnswers(), ...stored });
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [kit.storageKey]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(kit.storageKey, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers, hydrated, kit.storageKey]);

  function updateAnswer<K extends keyof DraftAnswers>(
    key: K,
    value: DraftAnswers[K],
  ) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function ensureStarted() {
    if (!started) {
      setStarted(true);
      track({
        name: "category_finder_started",
        properties: { category: kit.categorySlug },
      });
    }
  }

  function canAdvance(q: FinderQuestion): boolean {
    if (q.kind === "number") {
      const n = answers.crmUsers;
      return typeof n === "number" && n >= q.min && n <= q.max;
    }
    if (q.kind === "single") {
      if (q.optional) return true;
      const value = answers[q.field];
      return typeof value === "string" && value.length > 0;
    }
    return true;
  }

  function goNext() {
    if (!question) return;
    ensureStarted();
    track({
      name: "category_finder_step_completed",
      properties: {
        category: kit.categorySlug,
        step: question.id,
        index: stepIndex,
      },
    });
    if (stepIndex >= questions.length - 1) {
      setPhase("review");
      setMaxStageIndex(CATEGORY_FINDER_STAGES.length - 1);
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function skipOptional() {
    if (question?.kind === "single" && question.optional) {
      updateAnswer(question.field, undefined);
      goNext();
    }
  }

  function goBack() {
    track({
      name: "category_finder_back_clicked",
      properties: { category: kit.categorySlug, phase, step: question?.id ?? phase },
    });
    if (phase === "review") {
      setPhase("questions");
      setStepIndex(questions.length - 1);
      return;
    }
    if (phase === "results") {
      setPhase("review");
      return;
    }
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  function buildCompleteAnswers(): CrmFinderAnswers | null {
    if (
      !answers.companySizeSlug ||
      !answers.primaryUseCaseSlug ||
      typeof answers.crmUsers !== "number"
    ) {
      return null;
    }
    const integrations = (answers.preferredIntegrationSlugs ?? []).filter(
      (slug) => slug !== "none",
    );
    return {
      companySizeSlug: answers.companySizeSlug,
      crmUsers: answers.crmUsers,
      primaryUseCaseSlug: answers.primaryUseCaseSlug,
      requiredFeatureSlugs: answers.requiredFeatureSlugs ?? [],
      preferredIntegrationSlugs: integrations,
      budgetBand: answers.budgetBand,
      budgetMode: "per-user-month",
      easePreference: answers.easePreference,
      businessTypeSlug: answers.businessTypeSlug,
    };
  }

  function runRecommendations() {
    const complete = buildCompleteAnswers();
    if (!complete) return;
    const criteria = normalizeCategoryFinderAnswers(
      complete,
      finderConfig,
      kit.categorySlug as FinderCategorySlug,
    );
    const outcome = recommendForCategory(
      criteria,
      snapshots,
      finderConfig,
      kit.categorySlug,
    );
    setResults(outcome.results);
    setEmptyReason(outcome.emptyReason);
    setMethodologyVersion(outcome.methodologyVersion);
    setShowAll(false);
    setSelectedSlugs([]);
    setPhase("loading");
    startReveal(() => {
      setPhase("results");
      track({
        name: "category_finder_completed",
        properties: {
          category: kit.categorySlug,
          resultCount: outcome.results.length,
          emptyReason: outcome.emptyReason ?? null,
        },
      });
      for (const r of outcome.results.slice(0, RESULTS_DEFAULT)) {
        track({
          name: "category_finder_result_viewed",
          properties: { category: kit.categorySlug, slug: r.productSlug },
        });
      }
    });
  }

  function restart() {
    resetReveal();
    setAnswers(defaultAnswers());
    setResults([]);
    setEmptyReason(undefined);
    setSelectedSlugs([]);
    setShowAll(false);
    setStepIndex(0);
    setMaxStageIndex(0);
    setPhase("questions");
    setStarted(false);
    try {
      localStorage.removeItem(kit.storageKey);
    } catch {
      // ignore
    }
    track({
      name: "category_finder_restarted",
      properties: { category: kit.categorySlug },
    });
  }

  function toggleSelect(slug: string) {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  }

  function comparisonHref(): string | null {
    if (selectedSlugs.length !== 2) return null;
    const slug = canonicalizeComparisonSlug(selectedSlugs);
    return publishedSet.has(slug) ? `/compare/${slug}/` : null;
  }

  const stageIndex =
    phase === "results" || phase === "review" || phase === "loading"
      ? CATEGORY_FINDER_STAGES.length - 1
      : question
        ? categoryStageIndexForQuestion(question.id)
        : 0;

  useEffect(() => {
    setMaxStageIndex((prev) => Math.max(prev, stageIndex));
  }, [stageIndex]);

  function goToStage(stageId: string) {
    const targetIndex = CATEGORY_FINDER_STAGES.findIndex((s) => s.id === stageId);
    if (targetIndex < 0 || targetIndex > maxStageIndex) return;

    if (stageId === "results") {
      if (results.length > 0) {
        setPhase("results");
      } else {
        setPhase("review");
      }
      return;
    }

    const qIndex = categoryFirstQuestionIndexForStage(stageId, questions);
    if (qIndex < 0) return;
    resetReveal();
    setPhase("questions");
    setStepIndex(qIndex);
  }

  const wizardStepper = (
    <FinderStepper
      stages={CATEGORY_FINDER_STAGES.map((s) => ({
        id: s.id,
        label: s.label,
      }))}
      activeIndex={stageIndex}
      maxReachableIndex={maxStageIndex}
      onStageSelect={(id) => goToStage(id)}
    />
  );

  const stageStepNumber = stageIndex + 1;
  const stageStepTotal = CATEGORY_FINDER_STAGES.length;
  const stageLabel = CATEGORY_FINDER_STAGES[stageIndex]?.label ?? "Business";
  const progressPct =
    phase === "review" || phase === "results" || phase === "loading"
      ? 100
      : Math.round((stageIndex / Math.max(stageStepTotal - 1, 1)) * 100);

  const visibleResults = showAll ? results : results.slice(0, RESULTS_DEFAULT);
  const lowConfidence = results.some((r) => r.confidence === "low");
  const compareHref = comparisonHref();
  const requiredFeatures = answers.requiredFeatureSlugs ?? [];
  const requirementCount =
    1 +
    1 +
    (answers.budgetBand ? 1 : 0) +
    (answers.easePreference ? 1 : 0) +
    (answers.businessTypeSlug ? 1 : 0) +
    requiredFeatures.length +
    (answers.preferredIntegrationSlugs ?? []).filter((s) => s !== "none")
      .length;

  let main: ReactNode;

  if (phase === "questions" && question) {
    const useCards =
      question.id === "companySize" ||
      question.id === "businessType" ||
      question.id === "primaryGoal" ||
      question.id === "budget" ||
      question.id === "ease";

    main = (
      <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-md)] sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-primary)]">
            {kit.title}
          </p>
          <p className="text-xs font-medium text-[var(--sg-color-text-muted)]">
            Step {stageStepNumber} of {stageStepTotal}
          </p>
        </div>
        {wizardStepper}
        <FinderStep
          legend={question.title}
          description={question.description}
          actions={
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={stepIndex === 0}
              >
                Back
              </Button>
              <div className="flex flex-wrap gap-2">
                {question.kind === "single" && question.optional ? (
                  <Button type="button" variant="ghost" onClick={skipOptional}>
                    {question.skipLabel ?? "Skip"}
                  </Button>
                ) : null}
                {question.kind === "multi" &&
                question.exclusiveValue === "none" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      updateAnswer(question.field, [question.exclusiveValue!]);
                      goNext();
                    }}
                  >
                    Skip — integrations aren&apos;t important
                  </Button>
                ) : null}
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance(question)}
                >
                  {stepIndex === questions.length - 1
                    ? "Review answers →"
                    : "Continue →"}
                </Button>
              </div>
            </div>
          }
        >
          {question.kind === "single" ? (
            <div
              className={
                useCards
                  ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid gap-2"
              }
            >
              {question.options.map((option) => (
                <FinderOption
                  key={option.value}
                  name={question.field}
                  value={option.value}
                  label={option.label}
                  description={option.description}
                  checked={answers[question.field] === option.value}
                  variant={useCards ? "card" : "row"}
                  icon={
                    question.id === "companySize"
                      ? SIZE_ICONS[option.value]
                      : undefined
                  }
                  onChange={(value) => {
                    ensureStarted();
                    updateAnswer(
                      question.field,
                      value as DraftAnswers[typeof question.field],
                    );
                  }}
                />
              ))}
            </div>
          ) : null}

          {question.kind === "multi" ? (
            <FinderMultiSelect
              name={question.field}
              options={question.options}
              values={(answers[question.field] as string[] | undefined) ?? []}
              exclusiveValue={question.exclusiveValue}
              onChange={(values) => {
                ensureStarted();
                updateAnswer(question.field, values);
              }}
            />
          ) : null}

          {question.kind === "number" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {SEAT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      ensureStarted();
                      updateAnswer("crmUsers", preset.value);
                    }}
                    className={cn(
                      "min-h-11 rounded-[var(--sg-radius-md)] border px-4 text-sm font-medium transition-colors",
                      answers.crmUsers === preset.value
                        ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                        : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] hover:border-[var(--sg-color-primary)]/40",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div>
                <label
                  className="text-xs font-medium text-[var(--sg-color-text-muted)]"
                  htmlFor={`${kit.categorySlug}-users-input`}
                >
                  Or enter exact seat count
                </label>
                <input
                  id={`${kit.categorySlug}-users-input`}
                  type="number"
                  min={question.min}
                  max={question.max}
                  value={answers.crmUsers ?? question.defaultValue}
                  onChange={(e) => {
                    ensureStarted();
                    const n = Number(e.target.value);
                    updateAnswer(
                      "crmUsers",
                      Number.isFinite(n) ? Math.round(n) : undefined,
                    );
                  }}
                  className="mt-1.5 min-h-12 w-full max-w-xs rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 text-base"
                />
              </div>
            </div>
          ) : null}
        </FinderStep>
      </div>
    );
  } else if (phase === "review") {
    main = (
      <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-md)] sm:p-7">
        {wizardStepper}
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          Review your answers
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Confirm before we build your shortlist.
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <ReviewRow
            label="Company size"
            value={labelForOption(COMPANY_SIZE_OPTIONS, answers.companySizeSlug)}
          />
          <ReviewRow
            label="Business type"
            value={
              labelForOption(BUSINESS_TYPE_OPTIONS, answers.businessTypeSlug) ??
              "Skipped"
            }
          />
          <ReviewRow
            label="Seats / users"
            value={
              typeof answers.crmUsers === "number"
                ? String(answers.crmUsers)
                : undefined
            }
          />
          <ReviewRow
            label="Primary job"
            value={labelForOption(kit.useCaseOptions, answers.primaryUseCaseSlug)}
          />
          <ReviewRow
            label="Must-have capabilities"
            value={
              requiredFeatures.length > 0
                ? requiredFeatures
                    .map((slug) => labelForOption(kit.capabilityOptions, slug))
                    .join(", ")
                : "None selected"
            }
          />
          <ReviewRow
            label="Integrations"
            value={
              (answers.preferredIntegrationSlugs ?? []).length > 0
                ? (answers.preferredIntegrationSlugs ?? [])
                    .map((slug) =>
                      labelForOption(kit.integrationOptions, slug),
                    )
                    .join(", ")
                : "None selected"
            }
          />
          <ReviewRow
            label="Budget"
            value={labelForOption(BUDGET_OPTIONS, answers.budgetBand)}
          />
          <ReviewRow
            label="Setup preference"
            value={labelForOption(EASE_OPTIONS, answers.easePreference)}
          />
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={goBack}>
            Back
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setPhase("questions");
              setStepIndex(0);
            }}
          >
            Edit answers
          </Button>
          <Button type="button" size="lg" onClick={runRecommendations}>
            See my matches →
          </Button>
        </div>
        <FinderPrivacyNote />
      </div>
    );
  } else if (phase === "loading" || isLoading) {
    main = (
      <ResultsLoadingState
        title={`Building your ${kit.softwarePhrase} shortlist…`}
        description={`Matching your requirements against SoftwareGlimpse ${kit.shortName} research.`}
      />
    );
  } else {
    main = (
      <div
        id={`${kit.categorySlug}-finder-results`}
        className="scroll-mt-24 space-y-6 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-md)] sm:p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-primary)]">
              Your {kit.softwarePhrase} matches
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
              Your best matches
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
              Based on your team, priorities and {requirementCount} selected
              requirement{requirementCount === 1 ? "" : "s"}. Fit scores use
              methodology {methodologyVersion}. Affiliate relationships do not
              influence rankings.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPhase("review")}
            >
              Edit answers
            </Button>
            <RestartFinder onRestart={restart} />
          </div>
        </div>

        {wizardStepper}

        {lowConfidence ? (
          <p
            role="status"
            className="rounded-[var(--sg-radius-md)] border border-dashed border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]"
          >
            Some matches have limited evidence for your requirements. Use them
            as a shortlist, then read the reviews.
          </p>
        ) : null}

        {results.length === 0 ? (
          <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-5">
            <h3 className="font-semibold">No matching products</h3>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {emptyReason === "all-excluded"
                ? "Your must-haves excluded every candidate, or catalogue data was insufficient for those filters. Try fewer required features."
                : emptyReason === "insufficient-data"
                  ? "Candidates lacked enough structured data to score safely."
                  : `No ${kit.softwarePhrase} products were available to score.`}
            </p>
            <Button
              type="button"
              className="mt-4"
              variant="outline"
              onClick={() => setPhase("review")}
            >
              Edit requirements
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleResults.map((result, index) => (
              <RecommendationResultCard
                key={result.productSlug}
                result={result}
                rank={index + 1}
                selected={selectedSlugs.includes(result.productSlug)}
                onToggleSelect={toggleSelect}
                selectable
                logo={logos[result.productSlug]}
                visitCta={visitCtas[result.productSlug]}
                requiredCount={requiredFeatures.length}
                matchedRequiredCount={countMatchedRequired(
                  result,
                  requiredFeatures,
                )}
                onResultClick={(slug, action) => {
                  track({
                    name: "category_finder_result_clicked",
                    properties: { category: kit.categorySlug, slug, action },
                  });
                }}
              />
            ))}
          </div>
        )}

        {results.length > RESULTS_DEFAULT && !showAll ? (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="min-h-11 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Show more ({results.length - RESULTS_DEFAULT} more)
          </button>
        ) : null}

        {results.length >= 2 ? (
          <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-5">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
              Compare your top matches
            </h3>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Select two products with a published comparison page.
            </p>
            {selectedSlugs.length >= 2 ? (
              compareHref ? (
                <Link
                  href={compareHref}
                  onClick={() =>
                    track({
                      name: "category_finder_comparison_clicked",
                      properties: {
                        category: kit.categorySlug,
                        slugs: selectedSlugs.join(","),
                      },
                    })
                  }
                  className="mt-4 inline-flex min-h-11 items-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-4 py-2.5 text-sm font-medium text-[var(--sg-color-primary-fg)]"
                >
                  View full comparison →
                </Link>
              ) : (
                <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                  A published comparison for this pair isn&apos;t available yet.
                  Open each review to compare manually.
                </p>
              )
            ) : (
              <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                Select 2 products to compare.
              </p>
            )}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 border-t border-[var(--sg-color-border)] pt-6">
          <Link
            href={kit.bestHref}
            onClick={() =>
              track({
                name: "category_finder_guide_clicked",
                properties: { category: kit.categorySlug },
              })
            }
            className="inline-flex min-h-11 items-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-4 py-2.5 text-sm font-medium text-[var(--sg-color-primary-fg)]"
          >
            Browse best {kit.softwarePhrase} →
          </Link>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPhase("review")}
          >
            Edit answers
          </Button>
        </div>
      </div>
    );
  }

  const showProgressSidebar = phase === "questions" || phase === "review";

  return (
    <div
      id={`${kit.categorySlug}-finder`}
      className={cn(
        "scroll-mt-24",
        showProgressSidebar
          ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] lg:items-start"
          : "block",
      )}
    >
      <div className="min-w-0">{main}</div>
      {showProgressSidebar ? (
        <FinderProgressPanel
          className="lg:sticky lg:top-24"
          stepLabel={phase === "review" ? "Review" : stageLabel}
          stepCurrent={stageStepNumber}
          stepTotal={stageStepTotal}
          progressPct={progressPct}
          criteria={kit.matchCriteria}
        />
      ) : null}
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="grid gap-1 border-b border-[var(--sg-color-border)] pb-3 sm:grid-cols-[10rem_1fr]">
      <dt className="text-[var(--sg-color-text-muted)]">{label}</dt>
      <dd className="font-medium text-[var(--sg-color-text)]">{value ?? "—"}</dd>
    </div>
  );
}
