"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Download,
  ExternalLink,
  Plus,
  Printer,
  RotateCcw,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  DEFAULT_USER_EVALUATION_CRITERIA,
  mustHaveFeatureSlugs,
  normalizeCriterionWeights,
  type CriterionImportance,
  type DecisionProfile,
  type SiDecisionProfile,
  type DemoChecklistResult,
  type VendorEvaluationStatus,
  type VendorScorecardState,
  crmRequirementsFromDecisionProfile,
} from "@/domain";
import {
  loadDecisionProfile,
  loadSiDecisionProfile,
  saveDecisionProfile,
  saveSiDecisionProfile,
  touchDecisionProfile,
  touchSiDecisionProfile,
} from "@/services/decision-profile/persistence";
import { generateCategoryCriteriaFromProfile } from "@/services/vendor-scorecard/category-criteria";
import {
  applyImportance,
  buildFeatureRequirementMatrix,
  buildLeaderRationale,
  buildOpenQuestions,
  buildPairwiseSummaries,
  buildTradeoffCards,
  evaluateScorecard,
  generateSiCriteriaFromProfile,
  loadVendorScorecard,
  OVERALL_FIT_DISPLAY,
  rankScorecardResults,
  resetUserEvaluationOnly,
  resetVendorScorecard,
  saveVendorScorecard,
  scorecardToCsv,
  scorecardToPlainText,
  touchVendorScorecard,
  createEmptyVendorScorecard,
  type CriterionCellResult,
  type ScorecardResearchCatalog,
} from "@/services/vendor-scorecard";
import { compareProductCosts } from "@/services/pricing/compare";
import type { PricingSnapshot } from "@/services/pricing/types";
import { formatMoney } from "@/domain";
import { track } from "@/analytics/events";
import { EvidenceWhyDrawer } from "../framework/evidence-drawer";
import { ImportanceControl } from "../framework/importance-control";
import {
  FeatureSupportMark,
  MustHaveResultBadge,
} from "../framework/research-cell";
import { ScorecardResultsSummary } from "../framework/results-summary";
import {
  ScorecardMatrix,
  ScorecardMatrixMobile,
} from "../framework/scorecard-matrix";

const SETUP_STEPS = [
  { id: "profile", label: "Requirements profile" },
  { id: "vendors", label: "Shortlisted vendors" },
  { id: "criteria", label: "Evaluation criteria" },
  { id: "research", label: "Recommendation assessment" },
  { id: "evaluation", label: "Your evaluation" },
  { id: "results", label: "Results & summary" },
] as const;

const USER_STATUS_OPTIONS: { value: VendorEvaluationStatus; label: string }[] =
  [
    { value: "researching", label: "Reviewing" },
    { value: "demo-scheduled", label: "Demo scheduled" },
    { value: "trialing", label: "Trialing" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "finalist", label: "Finalist" },
    { value: "rejected", label: "Rejected" },
    { value: "selected", label: "Selected" },
  ];

const DEMO_RESULTS: { value: DemoChecklistResult; label: string }[] = [
  { value: "fully-demonstrated", label: "Fully demonstrated" },
  { value: "partially-demonstrated", label: "Partially demonstrated" },
  { value: "not-demonstrated", label: "Not demonstrated" },
  { value: "needs-follow-up", label: "Needs follow-up" },
  { value: "not-tested", label: "Not tested" },
];

/** Matches SI Finder / Cost Calculator workspace panels on tint backgrounds. */
const PANEL =
  "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6";
const INNER_CARD =
  "rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4";
const INNER_MUTED =
  "rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-3 sm:p-4";

type ProductOption = {
  slug: string;
  name: string;
  logo: { src: string; alt: string } | null;
  startingPriceLabel: string | null;
  reviewScore: number | null;
  reviewApproved: boolean;
};

type TabId =
  | "scorecard"
  | "requirements"
  | "features"
  | "evaluation"
  | "notes";

type Props = {
  research: ScorecardResearchCatalog;
  productOptions: ProductOption[];
  pricingSnapshots: PricingSnapshot[];
  publishedComparisonSlugs: string[];
  runtime?: {
    categorySlug: string;
    requirementsHref: string;
    costHref: string;
    finderHref: string;
    methodologyCriteria?: Array<{
      slug: string;
      label: string;
      defaultImportance: "critical" | "high" | "medium" | "low";
    }>;
  };
};

const SI_RUNTIME = {
  categorySlug: "sales-intelligence",
  requirementsHref: "/tools/sales-intelligence-requirements-builder/",
  costHref: "/tools/sales-intelligence-cost-calculator/?from=scorecard",
  finderHref: "/tools/sales-intelligence-finder/",
} as const;

function averageRatings(
  ratings: Array<{ criterionId: string; rating: number }>,
): number | null {
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

function canonicalizeCompareSlug(a: string, b: string): string {
  return [a, b].sort().join("-vs-");
}

export function SiVendorScorecardApp({
  research,
  productOptions,
  pricingSnapshots,
  publishedComparisonSlugs,
  runtime = SI_RUNTIME,
}: Props) {
  const categorySlug = runtime.categorySlug;
  const requirementsHref = runtime.requirementsHref;
  const costHref = runtime.costHref;
  const finderHref = runtime.finderHref;
  const isSi = categorySlug === "sales-intelligence";

  function loadProfile() {
    return isSi
      ? loadSiDecisionProfile()
      : loadDecisionProfile(categorySlug as DecisionProfile["categorySlug"]);
  }
  function saveProfile(next: DecisionProfile) {
    if (isSi) saveSiDecisionProfile(next);
    else saveDecisionProfile(next);
  }
  function touchProfile(
    current: DecisionProfile,
    patch: Partial<DecisionProfile>,
  ) {
    return isSi
      ? touchSiDecisionProfile(current, patch)
      : touchDecisionProfile(current, patch);
  }
  function generateCriteria(current: DecisionProfile | null) {
    return isSi
      ? generateSiCriteriaFromProfile(current as SiDecisionProfile | null)
      : generateCategoryCriteriaFromProfile(
          current,
          runtime.methodologyCriteria ?? [],
        );
  }
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<DecisionProfile | null>(null);
  const [state, setState] = useState<VendorScorecardState>(() =>
    createEmptyVendorScorecard(categorySlug),
  );
  const [tab, setTab] = useState<TabId>("scorecard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [why, setWhy] = useState<{
    productSlug: string;
    cell: CriterionCellResult;
  } | null>(null);
  const [combineEnabled, setCombineEnabled] = useState(false);
  const [researchPct, setResearchPct] = useState(70);
  const [includeNotesInExport, setIncludeNotesInExport] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Hydrate from localStorage
  useEffect(() => {
    const loadedProfile = loadProfile();
    setProfile(loadedProfile);
    const loaded = loadVendorScorecard(categorySlug);
    if (loaded && loaded.productIds.length > 0) {
      setState(loaded);
      setCombineEnabled(Boolean(loaded.combinationSettings?.enabled));
      setResearchPct(loaded.combinationSettings?.researchPercent ?? 70);
    } else if (loadedProfile) {
      const criteria = generateCriteria(loadedProfile);
      const productIds = loadedProfile.shortlistProductIds.slice(0, 5);
      const next = touchVendorScorecard(createEmptyVendorScorecard(categorySlug), {
        productIds,
        criteria,
        profileVersionAt: loadedProfile.updatedAt,
        researchAcknowledgedAt: research.generatedAt,
        productAssessments: productIds.map((id) => ({
          productId: id,
          userRatings: [],
          demoChecklist: [],
        })),
      });
      setState(next);
      saveVendorScorecard(next);
    } else {
      setState(
        touchVendorScorecard(createEmptyVendorScorecard(categorySlug), {
          criteria: generateCriteria(null),
          researchAcknowledgedAt: research.generatedAt,
        }),
      );
    }
    setHydrated(true);
    track({ name: "crm_scorecard_started" });
  }, [research.generatedAt]);

  const persist = useCallback((next: VendorScorecardState) => {
    const saved = touchVendorScorecard(next, {});
    setState(saved);
    saveVendorScorecard(saved);
  }, []);

  const syncShortlistToProfile = useCallback(
    (productIds: string[]) => {
      const current = loadProfile();
      if (!current) return;
      const next = touchProfile(current, {
        shortlistProductIds: productIds,
      });
      saveProfile(next);
      setProfile(next);
    },
    [],
  );

  const mustHaveSlugs = useMemo(
    () => (profile ? mustHaveFeatureSlugs(profile) : []),
    [profile],
  );

  const results = useMemo(() => {
    const userAverages: Record<string, number | null> = {};
    for (const id of state.productIds) {
      const assessment = state.productAssessments.find(
        (a) => a.productId === id,
      );
      userAverages[id] = averageRatings(assessment?.userRatings ?? []);
    }
    const evaluated = evaluateScorecard({
      criteria: normalizeCriterionWeights(state.criteria),
      productIds: state.productIds,
      research,
      mustHaveFeatureSlugs: mustHaveSlugs,
      userAverages,
      combination: combineEnabled
        ? {
            enabled: true,
            researchPercent: researchPct,
            userPercent: 100 - researchPct,
          }
        : { enabled: false, researchPercent: 70, userPercent: 30 },
    });
    return rankScorecardResults(evaluated);
  }, [
    state.criteria,
    state.productIds,
    state.productAssessments,
    research,
    mustHaveSlugs,
    combineEnabled,
    researchPct,
  ]);

  const tradeoffs = useMemo(
    () => buildTradeoffCards(results, research.products),
    [results, research.products],
  );
  const pairwise = useMemo(() => buildPairwiseSummaries(results), [results]);
  const openQuestions = useMemo(() => buildOpenQuestions(results), [results]);
  const leader = results[0] ?? null;
  const runnerUp = results[1] ?? null;
  const leaderRationale = useMemo(() => {
    if (!leader) return null;
    const strengths =
      research.products.find((p) => p.slug === leader.productSlug)?.strengths ??
      [];
    return buildLeaderRationale(leader, runnerUp, strengths);
  }, [leader, runnerUp, research.products]);

  const costEstimates = useMemo(() => {
    if (!profile) return [];
    const requirements = crmRequirementsFromDecisionProfile(profile);
    if (!requirements || state.productIds.length === 0) return [];
    const snaps = pricingSnapshots.filter((s) =>
      state.productIds.includes(s.productSlug),
    );
    if (snaps.length === 0) return [];
    return compareProductCosts(snaps, requirements, {
      sortMode: "input-order",
    }).results;
  }, [profile, pricingSnapshots, state.productIds]);

  const leaderCostLabel = useMemo(() => {
    if (!leader) return null;
    const est = costEstimates.find((e) => e.productSlug === leader.productSlug);
    if (!est) return null;
    if (est.monthlyEquivalent) {
      return `${formatMoney(est.monthlyEquivalent)}/mo`;
    }
    return "Custom / incomplete pricing";
  }, [leader, costEstimates]);

  const featureMatrix = useMemo(() => {
    const slugs =
      mustHaveSlugs.length > 0
        ? mustHaveSlugs
        : profile?.features.slice(0, 12).map((f) => f.id) ?? [];
    return buildFeatureRequirementMatrix(state.productIds, slugs, research);
  }, [mustHaveSlugs, profile, state.productIds, research]);

  const researchUpdated =
    hydrated &&
    state.researchAcknowledgedAt != null &&
    state.researchAcknowledgedAt !== research.generatedAt;

  const productCols = state.productIds.map((slug) => {
    const p = research.products.find((x) => x.slug === slug);
    return {
      slug,
      name: p?.name ?? slug,
      logo: p?.logo ?? null,
    };
  });

  function addProduct(slug: string) {
    if (state.productIds.includes(slug)) return;
    if (state.productIds.length >= 5) return;
    const productIds = [...state.productIds, slug];
    persist({
      ...state,
      productIds,
      productAssessments: [
        ...state.productAssessments.filter((a) =>
          productIds.includes(a.productId),
        ),
        {
          productId: slug,
          userRatings: [],
          demoChecklist: [],
        },
      ],
    });
    syncShortlistToProfile(productIds);
    track({ name: "scorecard_product_added", properties: { slug } });
    setShowAddProduct(false);
  }

  function removeProduct(slug: string) {
    const productIds = state.productIds.filter((id) => id !== slug);
    persist({
      ...state,
      productIds,
      productAssessments: state.productAssessments.filter(
        (a) => a.productId !== slug,
      ),
    });
    syncShortlistToProfile(productIds);
    track({ name: "scorecard_product_removed", properties: { slug } });
  }

  function setImportance(criterionId: string, importance: CriterionImportance) {
    persist({
      ...state,
      criteria: applyImportance(state.criteria, criterionId, importance),
    });
    track({
      name: "scorecard_criterion_changed",
      properties: { criterionId, importance },
    });
  }

  function setUserRating(
    productId: string,
    criterionId: string,
    rating: number,
  ) {
    const assessments = [...state.productAssessments];
    let row = assessments.find((a) => a.productId === productId);
    if (!row) {
      row = { productId, userRatings: [], demoChecklist: [] };
      assessments.push(row);
    }
    const ratings = row.userRatings.filter((r) => r.criterionId !== criterionId);
    ratings.push({ criterionId, rating });
    persist({
      ...state,
      productAssessments: assessments.map((a) =>
        a.productId === productId ? { ...a, userRatings: ratings } : a,
      ),
    });
    track({
      name: "scorecard_user_rating_added",
      properties: { productId, criterionId },
    });
  }

  function setNotes(productId: string, notes: string) {
    const assessments = [...state.productAssessments];
    const idx = assessments.findIndex((a) => a.productId === productId);
    if (idx < 0) {
      assessments.push({
        productId,
        userRatings: [],
        demoChecklist: [],
        notes,
      });
    } else {
      assessments[idx] = { ...assessments[idx]!, notes };
    }
    persist({ ...state, productAssessments: assessments });
  }

  function setVendorStatus(
    productId: string,
    status: VendorEvaluationStatus | "",
  ) {
    const assessments = [...state.productAssessments];
    const idx = assessments.findIndex((a) => a.productId === productId);
    const nextStatus = status || undefined;
    if (idx < 0) {
      assessments.push({
        productId,
        userRatings: [],
        demoChecklist: [],
        status: nextStatus,
      });
    } else {
      assessments[idx] = { ...assessments[idx]!, status: nextStatus };
    }
    persist({ ...state, productAssessments: assessments });
    if (status === "selected" && profile) {
      const next = touchProfile(profile, {
        selectedProductId: productId,
      });
      saveProfile(next);
      setProfile(next);
      track({
        name: "scorecard_product_selected",
        properties: { slug: productId },
      });
    }
  }

  function setDemoResult(
    productId: string,
    requirementId: string,
    result: DemoChecklistResult,
  ) {
    const assessments = [...state.productAssessments];
    let row = assessments.find((a) => a.productId === productId);
    if (!row) {
      row = { productId, userRatings: [], demoChecklist: [] };
      assessments.push(row);
    }
    const checklist = row.demoChecklist.filter(
      (d) => d.requirementId !== requirementId,
    );
    checklist.push({ requirementId, result });
    persist({
      ...state,
      productAssessments: assessments.map((a) =>
        a.productId === productId ? { ...a, demoChecklist: checklist } : a,
      ),
    });
  }

  function useProfile() {
    const loaded = loadProfile();
    if (!loaded) return;
    setProfile(loaded);
    const criteria = generateCriteria(loaded);
    const productIds =
      loaded.shortlistProductIds.length >= 2
        ? loaded.shortlistProductIds.slice(0, 5)
        : state.productIds;
    persist({
      ...state,
      criteria,
      productIds,
      profileVersionAt: loaded.updatedAt,
      productAssessments: productIds.map((id) => {
        const existing = state.productAssessments.find(
          (a) => a.productId === id,
        );
        return (
          existing ?? { productId: id, userRatings: [], demoChecklist: [] }
        );
      }),
    });
    setActiveStep(1);
  }

  function startManual() {
    persist({
      ...createEmptyVendorScorecard(categorySlug),
      criteria: generateCriteria(null),
      researchAcknowledgedAt: research.generatedAt,
    });
    setActiveStep(1);
  }

  async function copySummary() {
    const text = scorecardToPlainText({
      profile,
      state,
      results,
      includeNotes: includeNotesInExport,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Summary copied");
      track({ name: "scorecard_completed", properties: { action: "copy" } });
    } catch {
      setCopyStatus("Could not copy");
    }
    setTimeout(() => setCopyStatus(null), 2500);
  }

  function downloadCsv() {
    const csv = scorecardToCsv({ results });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "si-vendor-scorecard.csv";
    a.click();
    URL.revokeObjectURL(url);
    track({ name: "scorecard_completed", properties: { action: "csv" } });
  }

  function comparisonHref(): string | null {
    if (state.productIds.length < 2) return null;
    const slug = canonicalizeCompareSlug(
      state.productIds[0]!,
      state.productIds[1]!,
    );
    if (!publishedComparisonSlugs.includes(slug)) {
      return `/compare/build/?a=${state.productIds[0]}&b=${state.productIds[1]}`;
    }
    return `/compare/${slug}/`;
  }

  if (!hydrated) {
    return (
      <p className="text-sm text-[var(--sg-color-text-muted)]">
        Loading scorecard…
      </p>
    );
  }

  const profileMust = profile?.features.filter((f) => f.priority === "must-have")
    .length;
  const profileImportant = profile?.features.filter(
    (f) => f.priority === "important",
  ).length;
  const profileNice = profile?.features.filter(
    (f) => f.priority === "nice-to-have",
  ).length;

  const cmpHref = comparisonHref();

  return (
    <div id="scorecard-experience" className="relative">
      {researchUpdated ? (
        <div
          role="status"
          className="mb-4 rounded-[var(--sg-radius-md)] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          Recommendations updated since your last session. Your notes and ratings were
          not changed.
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-3"
            onClick={() =>
              persist({
                ...state,
                researchAcknowledgedAt: research.generatedAt,
              })
            }
          >
            Review changes
          </Button>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 space-y-8">
          {/* Setup sidebar inline on mobile; steps */}
          <section aria-labelledby="setup-heading" className={PANEL}>
            <h2
              id="setup-heading"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
            >
              Scorecard setup
            </h2>
            <ol className="mt-4 space-y-2">
              {SETUP_STEPS.map((step, i) => {
                const done =
                  (i === 0 && profile != null) ||
                  (i === 1 && state.productIds.length >= 2) ||
                  (i === 2 && state.criteria.length > 0) ||
                  (i === 3 && results.some((r) => r.cells.length > 0)) ||
                  (i === 4 &&
                    state.productAssessments.some(
                      (a) => a.userRatings.length > 0,
                    )) ||
                  (i === 5 && leader != null && state.productIds.length >= 2);
                return (
                  <li key={step.id} className="flex items-start gap-2 text-sm">
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        done
                          ? "bg-[var(--sg-color-success)] text-white"
                          : i === activeStep
                            ? "bg-[var(--sg-color-primary)] text-white"
                            : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
                      )}
                    >
                      {done ? <Check className="size-3" /> : i + 1}
                    </span>
                    <button
                      type="button"
                      className="text-left font-medium text-[var(--sg-color-text)] hover:text-[var(--sg-color-primary)]"
                      onClick={() => setActiveStep(i)}
                    >
                      {step.label}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className={cn("mt-5", INNER_MUTED)}>
              {profile ? (
                <>
                  <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
                    Using your SI requirements profile
                  </p>
                  <dl className="mt-2 grid grid-cols-2 gap-2 text-xs text-[var(--sg-color-text-muted)]">
                    <div>
                      <dt>Industry</dt>
                      <dd className="font-medium text-[var(--sg-color-text)]">
                        {profile.businessContext.industrySlug ?? "—"}
                      </dd>
                    </div>
                    <div>
                      <dt>Users</dt>
                      <dd className="font-medium text-[var(--sg-color-text)]">
                        {profile.businessContext.crmUserCount ?? "—"}
                      </dd>
                    </div>
                    <div>
                      <dt>Must-have</dt>
                      <dd className="font-medium text-[var(--sg-color-text)]">
                        {profileMust ?? 0}
                      </dd>
                    </div>
                    <div>
                      <dt>Important / Nice</dt>
                      <dd className="font-medium text-[var(--sg-color-text)]">
                        {profileImportant ?? 0} / {profileNice ?? 0}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" size="sm" onClick={useProfile}>
                      Use this profile
                    </Button>
                    <ButtonLink
                      href={requirementsHref}
                      variant="outline"
                      size="sm"
                    >
                      Edit requirements
                    </ButtonLink>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
                    No requirements profile found
                  </p>
                  <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                    Build requirements first, or create a scorecard manually
                    with default sales intelligence criteria.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ButtonLink
                      href={requirementsHref}
                      size="sm"
                    >
                      Build requirements first
                    </ButtonLink>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={startManual}
                    >
                      Create scorecard manually
                    </Button>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Shortlist */}
          <section aria-labelledby="shortlist-heading" className={PANEL}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="shortlist-heading"
                  className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
                >
                  Shortlisted vendors
                </h2>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  Select 2–5 sales intelligence products. Order is not a ranking.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={state.productIds.length >= 5}
                onClick={() => setShowAddProduct((v) => !v)}
              >
                <Plus className="size-4" />
                Add product
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {state.productIds.map((slug) => {
                const opt =
                  productOptions.find((p) => p.slug === slug) ??
                  research.products.find((p) => p.slug === slug);
                return (
                  <div
                    key={slug}
                    className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-surface-muted)] p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {opt?.logo ? (
                          <Image
                            src={opt.logo.src}
                            alt=""
                            width={28}
                            height={28}
                            className="rounded object-contain"
                          />
                        ) : null}
                        <div>
                          <p className="font-semibold text-[var(--sg-color-navy)]">
                            {opt?.name ?? slug}
                          </p>
                          <p className="text-xs text-[var(--sg-color-success)]">
                            Selected
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-xs text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-danger)]"
                        onClick={() => removeProduct(slug)}
                      >
                        Remove
                      </button>
                    </div>
                    {opt && "reviewApproved" in opt && opt.reviewApproved && opt.reviewScore != null ? (
                      <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
                        Review score {opt.reviewScore}/10
                      </p>
                    ) : null}
                    {opt?.startingPriceLabel ? (
                      <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                        {opt.startingPriceLabel}
                      </p>
                    ) : null}
                    <Link
                      href={`/software/${slug}/`}
                      className="mt-2 inline-block text-xs font-medium text-[var(--sg-color-primary)]"
                    >
                      View profile
                    </Link>
                  </div>
                );
              })}
            </div>
            {showAddProduct ? (
              <div className="mt-3 max-h-56 overflow-y-auto rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-2">
                {productOptions
                  .filter((p) => !state.productIds.includes(p.slug))
                  .map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-[var(--sg-color-surface-muted)]"
                      onClick={() => addProduct(p.slug)}
                    >
                      {p.logo ? (
                        <Image
                          src={p.logo.src}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded object-contain"
                        />
                      ) : null}
                      {p.name}
                    </button>
                  ))}
              </div>
            ) : null}
          </section>

          {/* Criteria weights */}
          <section
            id="criteria-weights"
            aria-labelledby="criteria-heading"
            className={PANEL}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2
                id="criteria-heading"
                className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
              >
                What matters most?
              </h2>
              <p className="text-xs text-[var(--sg-color-text-muted)]">
                Criteria ({state.criteria.filter((c) => c.importance !== "ignore").length})
              </p>
            </div>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Choose importance — weights normalize automatically. You do not
              need to make percentages sum to 100.
            </p>
            <div className="mt-4">
              {normalizeCriterionWeights(state.criteria).map((c) => (
                <ImportanceControl
                  key={c.id}
                  id={`imp-${c.id}`}
                  label={c.label}
                  importance={c.importance}
                  normalizedWeight={c.normalizedWeight}
                  onChange={(importance) => setImportance(c.id, importance)}
                />
              ))}
            </div>
          </section>

          {/* Must-haves */}
          {mustHaveSlugs.length > 0 ? (
            <section aria-labelledby="musthave-heading" className={PANEL}>
              <h2
                id="musthave-heading"
                className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
              >
                Must-have requirements
              </h2>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                A product fails a must-have only when research explicitly
                confirms it is not supported. Unknown stays unknown.
              </p>
              <div className="mt-4 space-y-3">
                {results.map((r) => (
                  <div key={r.productSlug} className={INNER_MUTED}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-[var(--sg-color-navy)]">
                        {r.productName}
                      </p>
                      {r.failsMustHave ? (
                        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-danger)]">
                          Fails must-have
                        </span>
                      ) : null}
                    </div>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {r.mustHaves.map((m) => (
                        <li
                          key={m.featureSlug}
                          className="flex items-center justify-between gap-2 text-sm"
                        >
                          <span>{m.label}</span>
                          <MustHaveResultBadge status={m.status} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Tabs + matrix */}
          <section aria-labelledby="matrix-heading" className={PANEL}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                id="matrix-heading"
                className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
              >
                Live scorecard
              </h2>
              <div className="flex flex-wrap gap-1" role="tablist">
                {(
                  [
                    ["scorecard", "Scorecard"],
                    ["requirements", "Requirements"],
                    ["features", "Features"],
                    ["evaluation", "Your evaluation"],
                    ["notes", "Notes"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={tab === id}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium",
                      tab === id
                        ? "bg-[var(--sg-color-primary)] text-white"
                        : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
                    )}
                    onClick={() => setTab(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {tab === "scorecard" ? (
              <div className="mt-4 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 p-4">
                <div className="hidden lg:block">
                  <ScorecardMatrix
                    products={productCols}
                    results={results}
                    onWhy={(productSlug, cell) => setWhy({ productSlug, cell })}
                  />
                </div>
                <ScorecardMatrixMobile
                  products={productCols}
                  results={results}
                  onWhy={(productSlug, cell) => setWhy({ productSlug, cell })}
                />
              </div>
            ) : null}

            {tab === "requirements" || tab === "features" ? (
              <div className="mt-4 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 p-4">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--sg-color-border)]">
                      <th className="px-2 py-2">Requirement</th>
                      {productCols.map((p) => (
                        <th key={p.slug} className="px-2 py-2">
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {featureMatrix.map((row) => (
                      <tr
                        key={row.featureSlug}
                        className="border-b border-[var(--sg-color-border)]"
                      >
                        <td className="px-2 py-2 font-medium">{row.label}</td>
                        {productCols.map((p) => (
                          <td key={p.slug} className="px-2 py-2 text-center text-lg">
                            <FeatureSupportMark
                              availability={row.cells[p.slug] ?? "unknown"}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
                  ✓ Verified · ◐ Partial / plan dependent · — Not verified · ×
                  Explicitly unsupported
                </p>
              </div>
            ) : null}

            {tab === "evaluation" ? (
              <div className="mt-4 space-y-6">
                <p className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm">
                  Your evaluation stays visually and mathematically separate
                  from SoftwareGlimpse recommendations unless you explicitly enable a
                  combined view below.
                </p>
                {state.productIds.map((slug) => {
                  const name =
                    research.products.find((p) => p.slug === slug)?.name ??
                    slug;
                  const assessment = state.productAssessments.find(
                    (a) => a.productId === slug,
                  );
                  const researchResult = results.find(
                    (r) => r.productSlug === slug,
                  );
                  return (
                    <div
                      key={slug}
                      className={cn(INNER_CARD, "shadow-[var(--sg-shadow-sm)]")}
                    >
                      <h3 className="font-semibold text-[var(--sg-color-navy)]">
                        {name}
                      </h3>
                      <div className="mt-3 grid gap-4 md:grid-cols-2">
                        <div className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                            SoftwareGlimpse
                          </p>
                          <p className="mt-1 text-sm">
                            Recommendation assessment:{" "}
                            <strong>
                              {researchResult
                                ? OVERALL_FIT_DISPLAY[researchResult.overallFit]
                                : "—"}
                            </strong>
                          </p>
                        </div>
                        <div className="rounded-[var(--sg-radius-md)] border border-dashed border-[var(--sg-color-primary)]/40 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                            Your evaluation
                          </p>
                          <p className="mt-1 text-sm">
                            Average:{" "}
                            <strong>
                              {averageRatings(assessment?.userRatings ?? [])?.toFixed(1) ??
                                "—"}
                              /5
                            </strong>
                          </p>
                        </div>
                      </div>
                      <ul className="mt-4 space-y-3">
                        {DEFAULT_USER_EVALUATION_CRITERIA.map((uc) => {
                          const current = assessment?.userRatings.find(
                            (r) => r.criterionId === uc.id,
                          )?.rating;
                          return (
                            <li
                              key={uc.id}
                              className="flex flex-wrap items-center justify-between gap-2"
                            >
                              <label
                                htmlFor={`${slug}-${uc.id}`}
                                className="text-sm"
                              >
                                {uc.label}
                              </label>
                              <select
                                id={`${slug}-${uc.id}`}
                                value={current ?? ""}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  if (v >= 1 && v <= 5) {
                                    setUserRating(slug, uc.id, v);
                                  }
                                }}
                                className="h-9 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] px-2 text-sm"
                              >
                                <option value="">Not rated</option>
                                <option value="1">1 — Poor</option>
                                <option value="2">2 — Fair</option>
                                <option value="3">3 — Good</option>
                                <option value="4">4 — Very good</option>
                                <option value="5">5 — Excellent</option>
                              </select>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Demo checklist */}
                      {mustHaveSlugs.length > 0 ? (
                        <div className="mt-6 border-t border-[var(--sg-color-border)] pt-4">
                          <h4 className="text-sm font-semibold text-[var(--sg-color-navy)]">
                            Demo / trial checklist
                          </h4>
                          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                            Ask the vendor to demonstrate each must-have.
                          </p>
                          <ul className="mt-3 space-y-3">
                            {mustHaveSlugs.map((reqId) => {
                              const label =
                                research.featureLabels[reqId] ?? reqId;
                              const current =
                                assessment?.demoChecklist.find(
                                  (d) => d.requirementId === reqId,
                                )?.result ?? "not-tested";
                              return (
                                <li key={reqId} className="text-sm">
                                  <p className="font-medium">{label}</p>
                                  <p className="text-xs text-[var(--sg-color-text-muted)]">
                                    Demo task: verify {label.toLowerCase()} in a
                                    live session.
                                  </p>
                                  <fieldset className="mt-2">
                                    <legend className="sr-only">
                                      Demo result for {label}
                                    </legend>
                                    <div className="flex flex-wrap gap-3">
                                      {DEMO_RESULTS.map((opt) => (
                                        <label
                                          key={opt.value}
                                          className="inline-flex items-center gap-1.5 text-xs"
                                        >
                                          <input
                                            type="radio"
                                            name={`demo-${slug}-${reqId}`}
                                            checked={current === opt.value}
                                            onChange={() =>
                                              setDemoResult(
                                                slug,
                                                reqId,
                                                opt.value,
                                              )
                                            }
                                          />
                                          {opt.label}
                                        </label>
                                      ))}
                                    </div>
                                  </fieldset>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                <div className={INNER_MUTED}>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={combineEnabled}
                      onChange={(e) => setCombineEnabled(e.target.checked)}
                    />
                    Calculate combined score (optional)
                  </label>
                  {combineEnabled ? (
                    <div className="mt-3">
                      <label
                        htmlFor="research-pct"
                        className="text-xs text-[var(--sg-color-text-muted)]"
                      >
                        SoftwareGlimpse recommendations {researchPct}% · Your
                        evaluation {100 - researchPct}%
                      </label>
                      <input
                        id="research-pct"
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={researchPct}
                        onChange={(e) =>
                          setResearchPct(Number(e.target.value))
                        }
                        className="mt-2 w-full max-w-md"
                      />
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
                      Side-by-side view is the default. There is no universal
                      correct mixing ratio.
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            {tab === "notes" ? (
              <div className="mt-4 space-y-4 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 p-4">
                {state.productIds.map((slug) => {
                  const name =
                    research.products.find((p) => p.slug === slug)?.name ??
                    slug;
                  const assessment = state.productAssessments.find(
                    (a) => a.productId === slug,
                  );
                  return (
                    <div key={slug}>
                      <label
                        htmlFor={`notes-${slug}`}
                        className="text-sm font-semibold text-[var(--sg-color-navy)]"
                      >
                        {name} notes
                      </label>
                      <textarea
                        id={`notes-${slug}`}
                        rows={4}
                        value={assessment?.notes ?? ""}
                        onChange={(e) => setNotes(slug, e.target.value)}
                        className="mt-2 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] p-3 text-sm"
                        placeholder="Demo notes, questions, pricing clarifications…"
                      />
                      <label
                        htmlFor={`status-${slug}`}
                        className="mt-2 block text-xs text-[var(--sg-color-text-muted)]"
                      >
                        Decision status
                      </label>
                      <select
                        id={`status-${slug}`}
                        value={assessment?.status ?? ""}
                        onChange={(e) =>
                          setVendorStatus(
                            slug,
                            e.target.value as VendorEvaluationStatus | "",
                          )
                        }
                        className="mt-1 h-9 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] px-2 text-sm"
                      >
                        <option value="">Not set</option>
                        {USER_STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
                <p className="text-xs text-[var(--sg-color-text-muted)]">
                  Notes stay on this device and are never sent to analytics.
                </p>
              </div>
            ) : null}
          </section>

          {/* Cost */}
          <section aria-labelledby="cost-heading" className={PANEL}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                id="cost-heading"
                className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
              >
                Cost for your configuration
              </h2>
              <ButtonLink
                href={costHref}
                variant="outline"
                size="sm"
                onClick={() =>
                  track({ name: "scorecard_to_cost" })
                }
              >
                Open SI Cost Calculator
              </ButtonLink>
              <ButtonLink
                href={`${requirementsHref}?from=scorecard`}
                variant="outline"
                size="sm"
              >
                Open SI Requirements Builder
              </ButtonLink>
            </div>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Cost importance is controlled in criteria weights — cheapest does
              not automatically win.
            </p>
            {costEstimates.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {costEstimates.map((est) => (
                  <li
                    key={est.productSlug}
                    className={INNER_MUTED + " text-sm"}
                  >
                    <p className="font-semibold text-[var(--sg-color-navy)]">
                      {est.productName}
                    </p>
                    <p className="mt-1 text-[var(--sg-color-text-muted)]">
                      {est.recommendedPlan?.name
                        ? `Plan: ${est.recommendedPlan.name}`
                        : "Plan: —"}
                    </p>
                    <p className="mt-1 font-medium">
                      {est.monthlyEquivalent
                        ? formatMoney(est.monthlyEquivalent)
                        : est.status === "custom-quote"
                          ? "Custom / incomplete pricing"
                          : "Custom / incomplete pricing"}
                      {est.monthlyEquivalent ? "/mo" : null}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                Add a requirements profile with user count to estimate
                qualifying-plan costs from verified pricing.
              </p>
            )}
          </section>

          {/* Results */}
          <section id="results" aria-labelledby="results-heading" className={PANEL}>
            <h2
              id="results-heading"
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
            >
              Your SI scorecard
            </h2>
            {leader && leaderRationale && state.productIds.length >= 2 ? (
              <ScorecardResultsSummary
                leader={leader}
                runnerUp={runnerUp}
                rationale={leaderRationale}
                leaderLogo={
                  research.products.find((p) => p.slug === leader.productSlug)
                    ?.logo
                }
                runnerUpLogo={
                  runnerUp
                    ? research.products.find(
                        (p) => p.slug === runnerUp.productSlug,
                      )?.logo
                    : null
                }
                userAverage={leader.userAverage}
                estimatedCostLabel={leaderCostLabel}
              />
            ) : (
              <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                Select at least two vendors to see a scorecard summary.
              </p>
            )}
          </section>

          {/* Trade-offs */}
          <section aria-labelledby="tradeoff-heading" className={PANEL}>
            <h2
              id="tradeoff-heading"
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
            >
              What you&apos;re trading off
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tradeoffs.map((card) => (
                <div key={card.productSlug} className={INNER_MUTED}>
                  <h3 className="font-semibold text-[var(--sg-color-navy)]">
                    {card.productName}
                  </h3>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
                    You gain
                  </p>
                  <ul className="mt-1 space-y-1 text-sm">
                    {card.gains.map((g) => (
                      <li key={g}>✓ {g}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    You trade
                  </p>
                  <ul className="mt-1 space-y-1 text-sm">
                    {card.trades.map((t) => (
                      <li key={t}>△ {t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Pairwise */}
          {pairwise.length > 0 ? (
            <section aria-labelledby="pairwise-heading" className={PANEL}>
              <h2
                id="pairwise-heading"
                className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
              >
                Why product A over product B?
              </h2>
              <div className="mt-4 space-y-3">
                {pairwise.map((p) => (
                  <div
                    key={`${p.productASlug}-${p.productBSlug}`}
                    className={cn(INNER_MUTED, "text-sm")}
                  >
                    <p className="font-semibold uppercase tracking-wide text-[var(--sg-color-navy)]">
                      {p.productASlug} vs {p.productBSlug}
                    </p>
                    <p className="mt-2">{p.chooseAIf}</p>
                    <p className="mt-1">{p.chooseBIf}</p>
                    {p.unknowns.length > 0 ? (
                      <p className="mt-2 text-[var(--sg-color-text-muted)]">
                        Unknowns: {p.unknowns.join("; ")}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Open questions */}
          <section aria-labelledby="risks-heading" className={PANEL}>
            <h2
              id="risks-heading"
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
            >
              Open questions before you decide
            </h2>
            {openQuestions.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {openQuestions.map((q, i) => (
                  <li
                    key={`${q.productSlug}-${i}`}
                    className="flex gap-2 text-sm"
                  >
                    <span className="text-amber-600" aria-hidden>
                      ⚠
                    </span>
                    <span>
                      <strong>{q.productName}</strong> — {q.message}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                No open verification issues from the current evidence set.
              </p>
            )}
          </section>

          {/* Export */}
          <section aria-labelledby="export-heading" className={PANEL}>
            <h2
              id="export-heading"
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
            >
              Export
            </h2>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeNotesInExport}
                onChange={(e) => setIncludeNotesInExport(e.target.checked)}
              />
              Include vendor notes in export
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={copySummary}>
                Copy summary
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={downloadCsv}>
                <Download className="size-4" />
                CSV
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="size-4" />
                Print scorecard
              </Button>
            </div>
            {copyStatus ? (
              <p className="mt-2 text-xs text-[var(--sg-color-success)]" role="status">
                {copyStatus}
              </p>
            ) : null}
          </section>

          {/* Next steps */}
          <section aria-labelledby="next-heading" className={PANEL}>
            <h2
              id="next-heading"
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
            >
              Next steps
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {cmpHref ? (
                <ButtonLink
                  href={cmpHref}
                  variant="outline"
                  onClick={() =>
                    track({ name: "scorecard_to_comparison" })
                  }
                >
                  Open detailed comparison
                  <ExternalLink className="size-4" />
                </ButtonLink>
              ) : null}
              <ButtonLink
                href={costHref}
                variant="outline"
                onClick={() => track({ name: "scorecard_to_cost" })}
              >
                Calculate cost
              </ButtonLink>
              <ButtonLink
                href={`${requirementsHref}?from=scorecard`}
                variant="outline"
              >
                Build implementation plan
              </ButtonLink>
              <ButtonLink href={finderHref} variant="outline">
                SI Finder
              </ButtonLink>
              <ButtonLink
                href={requirementsHref}
                variant="outline"
              >
                Edit requirements
              </ButtonLink>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const empty = resetVendorScorecard(categorySlug);
                  persist({
                    ...empty,
                    criteria: generateCriteria(profile),
                    researchAcknowledgedAt: research.generatedAt,
                  });
                }}
              >
                <RotateCcw className="size-4" />
                Reset scorecard
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => persist(resetUserEvaluationOnly(state))}
              >
                Reset only my evaluation
              </Button>
            </div>
          </section>
        </div>

        {/* Sticky summary */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              My evaluation
            </p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--sg-color-text-muted)]">Products</dt>
                <dd className="font-semibold">{state.productIds.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--sg-color-text-muted)]">Must-haves</dt>
                <dd className="font-semibold">{mustHaveSlugs.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--sg-color-text-muted)]">
                  Open questions
                </dt>
                <dd className="font-semibold">{openQuestions.length}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--sg-color-text-muted)]">
                  Current leader
                </dt>
                <dd className="text-right font-semibold text-[var(--sg-color-navy)]">
                  {leader?.productName ?? "—"}
                </dd>
              </div>
            </dl>
            {results.map((r) => (
              <div
                key={r.productSlug}
                className="border-t border-[var(--sg-color-border)] pt-3 text-sm"
              >
                <p className="font-semibold">{r.productName}</p>
                <p className="text-xs text-[var(--sg-color-text-muted)]">
                  {OVERALL_FIT_DISPLAY[r.overallFit]}
                  {r.weightedResearchScore != null
                    ? ` · ${r.weightedResearchScore}/10`
                    : ""}
                </p>
                {r.failsMustHave ? (
                  <p className="text-xs font-semibold text-[var(--sg-color-danger)]">
                    Fails must-have
                  </p>
                ) : null}
              </div>
            ))}
            <ButtonLink href="#results" size="sm" className="w-full">
              View summary
            </ButtonLink>
            <div className="flex flex-col gap-2 border-t border-[var(--sg-color-border)] pt-3">
              <ButtonLink
                href={requirementsHref}
                variant="ghost"
                size="sm"
              >
                Edit requirements
              </ButtonLink>
              <ButtonLink href={finderHref} variant="ghost" size="sm">
                SI Finder
              </ButtonLink>
              <ButtonLink
                href={costHref}
                variant="ghost"
                size="sm"
              >
                Cost Calculator
              </ButtonLink>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3 shadow-[var(--sg-shadow-md)] lg:hidden">
        <ButtonLink href="#results" className="w-full">
          View results
          {leader ? ` · ${leader.productName}` : ""}
        </ButtonLink>
      </div>

      <EvidenceWhyDrawer
        open={why != null}
        onClose={() => setWhy(null)}
        productName={
          research.products.find((p) => p.slug === why?.productSlug)?.name ??
          why?.productSlug ??
          ""
        }
        cell={why?.cell ?? null}
      />
    </div>
  );
}
