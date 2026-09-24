/**
 * Pair-specific decision narrative for /compare/ pages.
 * Derives copy from product + criterion evidence — never fabricates ratings or empty filler.
 */

import { formatMoney, fromMajor, type CurrencyCode } from "@/domain";
import { softwareHubPath } from "@/services/software-review/hub-tabs";
import type {
  ComparisonCriterionRow,
  ComparisonFeatureRow,
  ComparisonPageModel,
  ComparisonPageProduct,
} from "./types";

export type CategoryWinnerRow = {
  slug: string;
  dimension: string;
  result: "a" | "b" | "tie";
  winnerName: string;
  explanation: string;
};

export type RealDifference = {
  id: string;
  title: string;
  analysis: string;
  winnerName?: string | null;
};

export type SeatScenarioRow = {
  seats: number;
  labelA?: string;
  labelB?: string;
  estimateNote: string;
};

export type IntegrationCompare = {
  shared: Array<{ slug: string; name: string }>;
  exclusiveA: Array<{ slug: string; name: string }>;
  exclusiveB: Array<{ slug: string; name: string }>;
  breadthNote?: string;
};

export type ComparisonDecisionNarrative = {
  h1: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  limitedData: boolean;
  quickVerdict: {
    chooseA: string[];
    chooseB: string[];
    overallRecommendation: string;
    keyTradeoff: string;
  } | null;
  categoryWinners: CategoryWinnerRow[];
  realDifferences: RealDifference[];
  bestForScenarios: Array<{
    id: string;
    label: string;
    winnerSlug: string;
    winnerName: string;
    explanation: string;
  }>;
  whoShouldNot: {
    dontChooseA: string[];
    dontChooseB: string[];
  } | null;
  implementation: {
    pointsA: string[];
    pointsB: string[];
  } | null;
  integrations: IntegrationCompare | null;
  seatScenarios: SeatScenarioRow[] | null;
  finalVerdict: {
    winsWhenA: string;
    winsWhenB: string;
    byScenario: Array<{ scenario: string; choice: string }>;
  } | null;
  relatedPaths: Array<{ href: string; label: string; kind: string }>;
};

const DIMENSION_LABELS: Record<string, string> = {
  "ease-of-use": "Ease of use",
  ease: "Ease of use",
  setup: "Setup",
  "time-to-value": "Setup",
  onboarding: "Setup",
  sales: "Sales",
  "sales-pipeline": "Sales",
  "pipeline-management": "Sales",
  marketing: "Marketing",
  automation: "Automation",
  "workflow-automation": "Automation",
  "sales-automation": "Automation",
  reporting: "Reporting",
  analytics: "Reporting",
  forecasting: "Reporting",
  integrations: "Integrations",
  "integrations-ecosystem": "Integrations",
  collaboration: "Collaboration",
  "docs-collaboration": "Collaboration",
  customization: "Customization",
  "custom-fields": "Customization",
  value: "Value",
  pricing: "Value",
  "value-for-money": "Value",
  enterprise: "Enterprise suitability",
  scalability: "Enterprise suitability",
  "enterprise-readiness": "Enterprise suitability",
  "small-team": "Small-team suitability",
  smb: "Small-team suitability",
  "smb-fit": "Small-team suitability",
};

const IMPLEMENTATION_SLUGS = new Set([
  "ease-of-use",
  "ease",
  "setup",
  "time-to-value",
  "onboarding",
  "administration",
  "admin",
  "learning-curve",
]);

const SEAT_SCENARIOS = [5, 10, 25, 50] as const;

function dimensionLabel(slug: string, fallbackName: string): string {
  return DIMENSION_LABELS[slug] ?? fallbackName;
}

function uniqueStrings(values: string[], limit = 4): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed.toLowerCase())) continue;
    seen.add(trimmed.toLowerCase());
    out.push(trimmed);
    if (out.length >= limit) break;
  }
  return out;
}

function buildSummary(input: {
  nameA: string;
  nameB: string;
  subtitle?: string;
  winsA: ComparisonCriterionRow[];
  winsB: ComparisonCriterionRow[];
  productA: ComparisonPageProduct;
  productB: ComparisonPageProduct;
  overallLabel: string;
}): string {
  const { nameA, nameB, subtitle, winsA, winsB, productA, productB } = input;
  if (subtitle && subtitle.length >= 40 && !/compare .+ and .+/i.test(subtitle)) {
    return subtitle;
  }

  const leadA = productA.bestFor[0];
  const leadB = productB.bestFor[0];
  if (leadA && leadB) {
    return `${nameA} fits ${leadA.toLowerCase().replace(/\.$/, "")}; ${nameB} fits ${leadB.toLowerCase().replace(/\.$/, "")}.`;
  }

  const winA = winsA.slice(0, 2).map((c) => c.name.toLowerCase());
  const winB = winsB.slice(0, 2).map((c) => c.name.toLowerCase());
  if (winA.length && winB.length) {
    return `${nameA} leads on ${winA.join(" and ")}; ${nameB} leads on ${winB.join(" and ")}. Pick by which strengths match your team.`;
  }
  if (winA.length) {
    return `${nameA} has the clearer researched edge on ${winA.join(" and ")} versus ${nameB}.`;
  }
  if (winB.length) {
    return `${nameB} has the clearer researched edge on ${winB.join(" and ")} versus ${nameA}.`;
  }
  return `${nameA} and ${nameB} are close on current evidence — choose by workflow fit, pricing, and must-have capabilities.`;
}

function buildKeyTradeoff(
  nameA: string,
  nameB: string,
  winsA: ComparisonCriterionRow[],
  winsB: ComparisonCriterionRow[],
): string {
  const a = winsA[0]?.name.toLowerCase();
  const b = winsB[0]?.name.toLowerCase();
  if (a && b) {
    return `${nameA} trades toward ${a}; ${nameB} trades toward ${b}.`;
  }
  if (a) return `${nameA}'s clearest edge is ${a}.`;
  if (b) return `${nameB}'s clearest edge is ${b}.`;
  return `Neither product dominates every criterion — prioritize the jobs that matter most.`;
}

function buildCategoryWinners(
  criteria: ComparisonCriterionRow[],
  nameA: string,
  nameB: string,
): CategoryWinnerRow[] {
  const rows: CategoryWinnerRow[] = [];
  const seenDimensions = new Set<string>();

  for (const criterion of criteria) {
    if (criterion.strengthA === "unknown" && criterion.strengthB === "unknown") {
      continue;
    }
    if (
      criterion.strengthA === "depends" ||
      criterion.strengthB === "depends"
    ) {
      // Skip depends-only noise unless we have a clear tie explanation.
      if (criterion.strengthA !== "tie" && criterion.strengthB !== "tie") {
        continue;
      }
    }

    const dimension = dimensionLabel(criterion.slug, criterion.name);
    if (seenDimensions.has(dimension.toLowerCase())) continue;
    seenDimensions.add(dimension.toLowerCase());

    let result: "a" | "b" | "tie" = "tie";
    if (criterion.strengthA === "stronger") result = "a";
    else if (criterion.strengthB === "stronger") result = "b";
    else if (criterion.winnerKind === "product-a") result = "a";
    else if (criterion.winnerKind === "product-b") result = "b";

    const winnerName =
      result === "a" ? nameA : result === "b" ? nameB : "Tie";

    const explanation =
      criterion.evidenceSummary?.trim() ||
      criterion.label?.trim() ||
      (result === "tie"
        ? `${nameA} and ${nameB} are comparable on ${dimension.toLowerCase()}.`
        : `${winnerName} leads on ${dimension.toLowerCase()}.`);

    rows.push({
      slug: criterion.slug,
      dimension,
      result,
      winnerName,
      explanation,
    });
  }

  return rows.slice(0, 12);
}

function featureDeltaSentence(
  nameA: string,
  nameB: string,
  rows: ComparisonFeatureRow[],
): string | null {
  const diverging = rows.filter(
    (r) =>
      r.availabilityA !== r.availabilityB &&
      r.labelA !== "Not evidenced" &&
      r.labelB !== "Not evidenced",
  );
  if (diverging.length === 0) return null;
  const bits = diverging.slice(0, 3).map((r) => {
    return `${r.name} (${nameA}: ${r.labelA}; ${nameB}: ${r.labelB})`;
  });
  return `Feature evidence also diverges on ${bits.join("; ")}.`;
}

function buildRealDifferences(input: {
  nameA: string;
  nameB: string;
  keyDifferences: ComparisonPageModel["keyDifferences"];
  featureGroups: ComparisonPageModel["featureGroups"];
  winsA: ComparisonCriterionRow[];
  winsB: ComparisonCriterionRow[];
}): RealDifference[] {
  const { nameA, nameB, keyDifferences, featureGroups, winsA, winsB } = input;
  const allFeatureRows = featureGroups.flatMap((g) => g.rows);
  const featureNote = featureDeltaSentence(nameA, nameB, allFeatureRows);

  const fromKeys = keyDifferences.map((diff, index) => {
    const left = diff.leftBody.trim();
    const right = diff.rightBody.trim();
    let analysis: string;
    if (
      diff.winnerName &&
      diff.winnerName !== "Tie" &&
      diff.winnerName !== "Depends"
    ) {
      analysis = `On ${diff.title.toLowerCase()}, ${diff.winnerName} is ahead. ${nameA}: ${left}. ${nameB}: ${right}.`;
    } else if (diff.winnerName === "Tie") {
      analysis = `${nameA} and ${nameB} are close on ${diff.title.toLowerCase()}. ${left}`;
    } else {
      analysis = `${diff.title}: ${nameA} — ${left}. ${nameB} — ${right}.`;
    }
    if (index === 0 && featureNote) {
      analysis = `${analysis} ${featureNote}`;
    }
    return {
      id: diff.id,
      title: diff.title,
      analysis,
      winnerName: diff.winnerName,
    };
  });

  if (fromKeys.length > 0) return fromKeys.slice(0, 6);

  // Fallback: synthesize from win lists only when keyDifferences empty.
  const synthesized: RealDifference[] = [];
  for (const win of winsA.slice(0, 2)) {
    synthesized.push({
      id: `diff-a-${win.slug}`,
      title: win.name,
      analysis: `${nameA} leads on ${win.name.toLowerCase()}. ${win.evidenceSummary ?? win.label}`,
      winnerName: nameA,
    });
  }
  for (const win of winsB.slice(0, 2)) {
    synthesized.push({
      id: `diff-b-${win.slug}`,
      title: win.name,
      analysis: `${nameB} leads on ${win.name.toLowerCase()}. ${win.evidenceSummary ?? win.label}`,
      winnerName: nameB,
    });
  }
  return synthesized.slice(0, 4);
}

function buildWhoShouldNot(
  nameA: string,
  nameB: string,
  productA: ComparisonPageProduct,
  productB: ComparisonPageProduct,
  winsA: ComparisonCriterionRow[],
  winsB: ComparisonCriterionRow[],
): ComparisonDecisionNarrative["whoShouldNot"] {
  const dontChooseA = uniqueStrings([
    ...productA.notIdealFor,
    ...winsB.slice(0, 3).map(
      (c) =>
        `You need ${nameB}'s stronger ${c.name.toLowerCase()} more than ${nameA}'s strengths`,
    ),
    ...productB.bestFor.slice(0, 2).map(
      (s) => `Your primary fit looks closer to: ${s}`,
    ),
  ]);
  const dontChooseB = uniqueStrings([
    ...productB.notIdealFor,
    ...winsA.slice(0, 3).map(
      (c) =>
        `You need ${nameA}'s stronger ${c.name.toLowerCase()} more than ${nameB}'s strengths`,
    ),
    ...productA.bestFor.slice(0, 2).map(
      (s) => `Your primary fit looks closer to: ${s}`,
    ),
  ]);

  if (dontChooseA.length === 0 && dontChooseB.length === 0) return null;
  return {
    dontChooseA: dontChooseA.slice(0, 4),
    dontChooseB: dontChooseB.slice(0, 4),
  };
}

function buildImplementation(
  nameA: string,
  nameB: string,
  criteria: ComparisonCriterionRow[],
): ComparisonDecisionNarrative["implementation"] {
  const relevant = criteria.filter((c) => IMPLEMENTATION_SLUGS.has(c.slug));
  if (relevant.length === 0) return null;

  const pointsA: string[] = [];
  const pointsB: string[] = [];

  for (const row of relevant) {
    const dim = dimensionLabel(row.slug, row.name).toLowerCase();
    if (row.strengthA === "stronger") {
      pointsA.push(`Stronger on ${dim}: ${row.evidenceSummary ?? row.label}`);
      pointsB.push(`Trails on ${dim} relative to ${nameA}`);
    } else if (row.strengthB === "stronger") {
      pointsB.push(`Stronger on ${dim}: ${row.evidenceSummary ?? row.label}`);
      pointsA.push(`Trails on ${dim} relative to ${nameB}`);
    } else if (row.strengthA === "tie" || row.strengthB === "tie") {
      pointsA.push(`Comparable ${dim} to ${nameB}`);
      pointsB.push(`Comparable ${dim} to ${nameA}`);
    }
  }

  const uniqA = uniqueStrings(pointsA, 4);
  const uniqB = uniqueStrings(pointsB, 4);
  if (uniqA.length === 0 && uniqB.length === 0) return null;
  return { pointsA: uniqA, pointsB: uniqB };
}

function humanizeSlug(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function buildIntegrationCompare(input: {
  nameA: string;
  nameB: string;
  slugsA: string[];
  slugsB: string[];
  nameBySlug?: Map<string, string>;
  featureIntegrations?: ComparisonFeatureRow | null;
}): IntegrationCompare | null {
  const { slugsA, slugsB, nameBySlug, featureIntegrations, nameA, nameB } =
    input;
  const setA = new Set(slugsA);
  const setB = new Set(slugsB);
  const shared = [...setA].filter((s) => setB.has(s));
  const exclusiveA = [...setA].filter((s) => !setB.has(s));
  const exclusiveB = [...setB].filter((s) => !setA.has(s));

  const toItem = (slug: string) => ({
    slug,
    name: nameBySlug?.get(slug) ?? humanizeSlug(slug),
  });

  if (shared.length + exclusiveA.length + exclusiveB.length === 0) {
    if (
      featureIntegrations &&
      featureIntegrations.labelA !== "Not evidenced" &&
      featureIntegrations.labelB !== "Not evidenced"
    ) {
      return {
        shared: [],
        exclusiveA: [],
        exclusiveB: [],
        breadthNote: `${nameA}: ${featureIntegrations.labelA}. ${nameB}: ${featureIntegrations.labelB}.`,
      };
    }
    return null;
  }

  return {
    shared: shared.slice(0, 8).map(toItem),
    exclusiveA: exclusiveA.slice(0, 6).map(toItem),
    exclusiveB: exclusiveB.slice(0, 6).map(toItem),
    breadthNote:
      setA.size > 0 || setB.size > 0
        ? `${nameA} lists ${setA.size} key integration${setA.size === 1 ? "" : "s"}; ${nameB} lists ${setB.size}.`
        : undefined,
  };
}

function estimateSeats(
  unit:
    | { perUserMonthly: number; currency: CurrencyCode; planName?: string }
    | undefined,
  seats: number,
): string | undefined {
  if (!unit || !(unit.perUserMonthly > 0)) return undefined;
  const total = unit.perUserMonthly * seats;
  const money = formatMoney(fromMajor(total, unit.currency));
  return unit.planName
    ? `~${money}/mo (${unit.planName} × ${seats})`
    : `~${money}/mo (${seats} × starting seat)`;
}

export function buildSeatScenarios(input: {
  unitA?: ComparisonPageModel["pricing"]["unitA"];
  unitB?: ComparisonPageModel["pricing"]["unitB"];
}): SeatScenarioRow[] | null {
  const { unitA, unitB } = input;
  if (!unitA && !unitB) return null;

  const rows: SeatScenarioRow[] = [];
  for (const seats of SEAT_SCENARIOS) {
    const labelA = estimateSeats(unitA, seats);
    const labelB = estimateSeats(unitB, seats);
    if (!labelA && !labelB) continue;
    rows.push({
      seats,
      labelA,
      labelB,
      estimateNote:
        "Estimate from verified starting per-seat pricing — actual total depends on plan, annual discounts, and add-ons.",
    });
  }
  return rows.length > 0 ? rows : null;
}

/** Bare pair / “which is better” titles — not a buyer differentiator. */
export function isGenericComparisonSeoTitle(title?: string): boolean {
  if (!title) return true;
  const t = title.trim();
  if (t.length < 12) return true;
  if (/^compare\s+/i.test(t)) return true;
  if (/^[\w .+'&/-]+ vs [\w .+'&/-]+$/i.test(t)) return true;
  if (/\bvs\b.+:\s*which is better\??$/i.test(t)) return true;
  if (/\bvs\b.+:\s*(crm\s+)?compared$/i.test(t)) return true;
  return false;
}

export function isGenericComparisonSeoDescription(description?: string): boolean {
  if (!description) return true;
  const d = description.trim();
  if (d.length < 40) return true;
  if (/^compare .+ on SoftwareGlimpse/i.test(d)) return true;
  if (/^compare .+ on features, pricing/i.test(d)) return true;
  if (/using SoftwareGlimpse researched criteria/i.test(d)) return true;
  if (/research-grounded editorial assessments/i.test(d)) return true;
  if (/no universal winner/i.test(d) && /choose by job/i.test(d)) return true;
  return false;
}

function clipSeo(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const sliced = t.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace >= 40 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

function buildSeo(input: {
  nameA: string;
  nameB: string;
  existingTitle?: string;
  existingDescription?: string;
  summary: string;
  winsA: ComparisonCriterionRow[];
  winsB: ComparisonCriterionRow[];
  categoryLabel?: string;
}): { title: string; description: string; h1: string } {
  const { nameA, nameB, existingTitle, existingDescription, summary, winsA, winsB, categoryLabel } =
    input;
  const h1 = `${nameA} vs ${nameB}`;

  const genericTitle = isGenericComparisonSeoTitle(existingTitle);
  const winBits = [
    ...winsA.slice(0, 2).map((c) => c.name),
    ...winsB.slice(0, 2).map((c) => c.name),
  ]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 3);
  const title = genericTitle
    ? `${nameA} vs ${nameB}: ${winBits.length ? winBits.join(", ") : "features, pricing & fit"}`
    : existingTitle!;

  const genericDesc = isGenericComparisonSeoDescription(existingDescription);
  const noun = categoryLabel ? `${categoryLabel} ` : "";
  const description = genericDesc
    ? clipSeo(
        summary.trim().length >= 40
          ? summary
          : `${summary.trim()} See ${noun}features, pricing estimates, and who each product fits.`,
        160,
      )
    : existingDescription!;

  return {
    title: clipSeo(title, 70),
    description: clipSeo(description, 160),
    h1,
  };
}

function buildRelatedPaths(
  model: Omit<ComparisonPageModel, "decision">,
): ComparisonDecisionNarrative["relatedPaths"] {
  const paths: ComparisonDecisionNarrative["relatedPaths"] = [
    {
      href: model.productA.href,
      label: `${model.productA.name} review`,
      kind: "review",
    },
    {
      href: model.productB.href,
      label: `${model.productB.name} review`,
      kind: "review",
    },
  ];

  if (model.productA.startingPriceLabel || model.pricing.cardA.plans.length) {
    paths.push({
      href: softwareHubPath(model.productA.slug, "pricing"),
      label: `${model.productA.name} pricing`,
      kind: "pricing",
    });
  }
  if (model.productB.startingPriceLabel || model.pricing.cardB.plans.length) {
    paths.push({
      href: softwareHubPath(model.productB.slug, "pricing"),
      label: `${model.productB.name} pricing`,
      kind: "pricing",
    });
  }

  for (const alt of model.alternatives.slice(0, 3)) {
    paths.push({
      href: alt.href,
      label: `${alt.name} alternative`,
      kind: "alternative",
    });
  }

  for (const guide of model.guides.slice(0, 3)) {
    paths.push({ href: guide.href, label: guide.title, kind: "guide" });
  }

  if (model.categorySlug) {
    paths.push({
      href: `/categories/${model.categorySlug}/`,
      label: `${model.categoryLabel ?? "Category"} hub`,
      kind: "category",
    });
  }

  if (model.finderHref) {
    paths.push({
      href: model.finderHref,
      label: model.finderLabel || "Find software",
      kind: "finder",
    });
  }

  if (model.costCalculatorHref) {
    paths.push({
      href: model.costCalculatorHref,
      label: "Cost calculator",
      kind: "calculator",
    });
  }

  // Dedupe by href
  const seen = new Set<string>();
  return paths.filter((p) => {
    if (seen.has(p.href)) return false;
    seen.add(p.href);
    return true;
  });
}

export type DecisionNarrativeInput = {
  nameA: string;
  nameB: string;
  existingSeoTitle?: string;
  existingSeoDescription?: string;
  model: Omit<ComparisonPageModel, "decision">;
  integrationSlugsA?: string[];
  integrationSlugsB?: string[];
  integrationNames?: Map<string, string>;
};

/**
 * Build pair-specific decision narrative. Safe to call for sparse pairs —
 * returns null sections when evidence is missing.
 */
export function buildDecisionNarrative(
  input: DecisionNarrativeInput,
): ComparisonDecisionNarrative {
  const {
    nameA,
    nameB,
    model,
    existingSeoTitle,
    existingSeoDescription,
    integrationSlugsA = [],
    integrationSlugsB = [],
    integrationNames,
  } = input;

  const limitedData =
    model.criteria.length === 0 &&
    model.featureCount === 0 &&
    !model.productA.startingPriceLabel &&
    !model.productB.startingPriceLabel;

  const summary = buildSummary({
    nameA,
    nameB,
    subtitle: model.subtitle,
    winsA: model.winsA,
    winsB: model.winsB,
    productA: model.productA,
    productB: model.productB,
    overallLabel: model.overallLabel,
  });

  const chooseA = uniqueStrings(
    [
      ...model.productA.bestFor,
      ...model.winsA.slice(0, 3).map(
        (c) => `You prioritize ${c.name.toLowerCase()}`,
      ),
    ],
    4,
  );
  const chooseB = uniqueStrings(
    [
      ...model.productB.bestFor,
      ...model.winsB.slice(0, 3).map(
        (c) => `You prioritize ${c.name.toLowerCase()}`,
      ),
    ],
    4,
  );

  const quickVerdict =
    chooseA.length > 0 || chooseB.length > 0 || Boolean(model.verdict)
      ? {
          chooseA,
          chooseB,
          overallRecommendation:
            model.verdict?.trim() ||
            `${model.overallLabel}. Match the product to the criteria that matter for your team.`,
          keyTradeoff: buildKeyTradeoff(
            nameA,
            nameB,
            model.winsA,
            model.winsB,
          ),
        }
      : null;

  const categoryWinners = buildCategoryWinners(
    model.criteria,
    nameA,
    nameB,
  );

  const realDifferences = buildRealDifferences({
    nameA,
    nameB,
    keyDifferences: model.keyDifferences,
    featureGroups: model.featureGroups,
    winsA: model.winsA,
    winsB: model.winsB,
  });

  const bestForScenarios = model.decisionCards.slice(0, 6).map((card) => ({
    id: card.id,
    label: card.title,
    winnerSlug: card.winnerSlug,
    winnerName: card.winnerName,
    explanation: card.explanation,
  }));

  const whoShouldNot = buildWhoShouldNot(
    nameA,
    nameB,
    model.productA,
    model.productB,
    model.winsA,
    model.winsB,
  );

  const implementation = buildImplementation(
    nameA,
    nameB,
    model.criteria,
  );

  const featureIntegrations =
    model.featureGroups
      .flatMap((g) => g.rows)
      .find(
        (r) =>
          r.featureSlug === "integrations" ||
          r.featureSlug === "integrations-ecosystem",
      ) ?? null;

  const integrations = buildIntegrationCompare({
    nameA,
    nameB,
    slugsA: integrationSlugsA,
    slugsB: integrationSlugsB,
    nameBySlug: integrationNames,
    featureIntegrations,
  });

  const seatScenarios = buildSeatScenarios({
    unitA: model.pricing.unitA,
    unitB: model.pricing.unitB,
  });

  const finalVerdict =
    chooseA.length > 0 ||
    chooseB.length > 0 ||
    bestForScenarios.length > 0
      ? {
          winsWhenA:
            chooseA[0] ??
            (model.winsA[0]
              ? `You need stronger ${model.winsA[0].name.toLowerCase()}`
              : `${nameA} matches your priorities better`),
          winsWhenB:
            chooseB[0] ??
            (model.winsB[0]
              ? `You need stronger ${model.winsB[0].name.toLowerCase()}`
              : `${nameB} matches your priorities better`),
          byScenario: bestForScenarios.slice(0, 4).map((s) => ({
            scenario: s.label,
            choice: s.winnerName,
          })),
        }
      : null;

  const seo = buildSeo({
    nameA,
    nameB,
    existingTitle: existingSeoTitle,
    existingDescription: existingSeoDescription,
    summary,
    winsA: model.winsA,
    winsB: model.winsB,
    categoryLabel: model.categoryLabel,
  });

  return {
    h1: seo.h1,
    summary,
    seoTitle: seo.title,
    seoDescription: seo.description,
    limitedData,
    quickVerdict,
    categoryWinners,
    realDifferences,
    bestForScenarios,
    whoShouldNot,
    implementation,
    integrations,
    seatScenarios,
    finalVerdict,
    relatedPaths: buildRelatedPaths(model),
  };
}
