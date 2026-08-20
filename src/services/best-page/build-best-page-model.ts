import type { Software } from "@/domain";
import { bestPublicCopy } from "./public-gate";
import type {
  BestPageComparisonColumn,
  BestPageHeroModel,
  BestPageModel,
  BestPageProductRef,
  BestPageRecommendationModel,
  BuildBestPageDeps,
} from "./types";

function productRef(software: Software): BestPageProductRef {
  return {
    slug: software.slug,
    name: software.name,
    logo: software.logo,
    href: `/software/${software.slug}/`,
  };
}

function categoryLabel(deps: BuildBestPageDeps): string {
  return deps.category?.name ?? "software";
}

function shortCategory(deps: BuildBestPageDeps): string {
  return (
    deps.category?.shortName ??
    deps.category?.name?.replace(/\s+Software$/i, "") ??
    "Software"
  );
}

function groupGuides(
  guides: BuildBestPageDeps["guides"],
  short: string,
): BestPageModel["guideGroups"] {
  const buckets: Array<{
    id: string;
    title: string;
    match: (title: string, path: string) => boolean;
  }> = [
    {
      id: "getting-started",
      title: "Getting started",
      match: (t, p) =>
        /what is|do i need|examples|when to adopt|basics/i.test(t) ||
        /what-is|do-i-need|examples|when-to-adopt/i.test(p),
    },
    {
      id: "evaluation",
      title: "Evaluation",
      match: (t, p) =>
        /how to choose|evaluation|selection|requirements|checklist|vendor questions|trial/i.test(
          t,
        ) || /how-to-choose|evaluation|selection|requirements|checklist|trial/i.test(p),
    },
    {
      id: "implementation",
      title: "Implementation",
      match: (t, p) =>
        /implement|migrat|adopt|train|onboard|change/i.test(t) ||
        /implement|migrat|adopt|train|onboard/i.test(p),
    },
    {
      id: "cost",
      title: "Cost",
      match: (t, p) =>
        /pricing|cost|tco|total cost|budget/i.test(t) ||
        /pricing|cost|tco|budget/i.test(p),
    },
    {
      id: "architecture",
      title: "Architecture / comparison",
      match: (t, p) =>
        /\bvs\b|versus|spreadsheet|erp|marketing automation|customer service/i.test(
          t,
        ) || /vs-|versus|spreadsheet|erp|marketing-automation/i.test(p),
    },
  ];

  const used = new Set<string>();
  const groups: BestPageModel["guideGroups"] = [];

  for (const bucket of buckets) {
    const items = guides
      .filter((g) => !used.has(g.path) && bucket.match(g.title, g.path))
      .slice(0, 4)
      .map((g) => {
        used.add(g.path);
        return {
          href: g.path,
          title: g.title,
          description: bestPublicCopy(g.description) ?? undefined,
        };
      });
    if (items.length > 0) {
      groups.push({ id: bucket.id, title: bucket.title, items });
    }
  }

  const leftover = guides
    .filter((g) => !used.has(g.path))
    .slice(0, 4)
    .map((g) => ({
      href: g.path,
      title: g.title,
      description: bestPublicCopy(g.description) ?? undefined,
    }));
  if (leftover.length > 0 && groups.length === 0) {
    groups.push({
      id: "featured",
      title: `${short} buying guides`,
      items: leftover,
    });
  } else if (leftover.length > 0) {
    groups.push({ id: "more", title: "More resources", items: leftover });
  }

  return groups;
}

function buildBuyingFramework(input: {
  short: string;
  cat: string;
  buyingGuide: BestPageModel["buyingGuide"];
  finderHref?: string;
  calcHref?: string;
  page: BuildBestPageDeps["page"];
}): BestPageModel["buyingFramework"] {
  const toolMap: Array<{
    match: RegExp;
    toolHref?: string;
    toolLabel?: string;
    guideHref?: string;
    guideLabel?: string;
  }> = [
    {
      match: /process|map|workflow|stage/i,
      guideHref: input.page.buyingGuideHref,
      guideLabel: `How to choose ${input.short}`,
    },
    {
      match: /must-have|capabilities|requirement|feature|workflow belong/i,
      toolHref: "/tools/crm-requirements-builder/",
      toolLabel: "CRM Requirements Builder",
    },
    {
      match: /cost|price|budget|per-user/i,
      toolHref: input.calcHref,
      toolLabel: input.calcHref ? "CRM Cost Calculator" : undefined,
    },
    {
      match: /shortlist|compare|integrat/i,
      toolHref: "/compare/",
      toolLabel: `Compare ${input.short} software`,
      guideHref: input.finderHref,
      guideLabel: input.finderHref ? `Find My ${input.short}` : undefined,
    },
    {
      match: /test|trial|usability|implement|pilot/i,
      toolHref: "/tools/crm-vendor-scorecard/",
      toolLabel: "CRM Vendor Scorecard",
    },
  ];

  const sourceSteps =
    input.buyingGuide?.steps.slice(0, 5) ??
    [
      {
        step: 1,
        title: "Map your sales process",
        body: "Clarify stages, owners, and what must improve before comparing tools.",
      },
      {
        step: 2,
        title: "Define must-have capabilities",
        body: "Only include jobs your team will run in the CRM day to day.",
      },
      {
        step: 3,
        title: "Estimate total cost",
        body: "Model seats, plan tier, billing period, and add-ons — not sticker price alone.",
      },
      {
        step: 4,
        title: "Shortlist platforms",
        body: "Compare recommended options against your must-haves and constraints.",
      },
      {
        step: 5,
        title: "Test real workflows",
        body: "Run a trial on your pipeline with the people who will use the CRM daily.",
      },
    ];

  return {
    heading: `How to choose ${input.cat}`,
    steps: sourceSteps.map((s, i) => {
      const mapped = toolMap.find((t) => t.match.test(`${s.title} ${s.body}`));
      return {
        step: s.step || i + 1,
        title: s.title,
        body: s.body,
        toolHref: mapped?.toolHref,
        toolLabel: mapped?.toolLabel,
        guideHref: mapped?.guideHref,
        guideLabel: mapped?.guideLabel,
      };
    }),
  };
}

function finderPath(page: BuildBestPageDeps["page"]): string | undefined {
  return page.relatedToolPaths.find((p) => p.includes("finder"));
}

function calculatorPath(page: BuildBestPageDeps["page"]): string | undefined {
  return page.relatedToolPaths.find(
    (p) => p.includes("calculator") || p.includes("cost"),
  );
}

function resolveProduct(
  deps: BuildBestPageDeps,
  slug: string,
): Software | undefined {
  return deps.softwareBySlug(slug);
}

/** First approved cluster award per product — never a cross-cluster #1 rank. */
function approvedClusterAwards(
  page: BuildBestPageDeps["page"],
): Map<string, { label: string; rationale: string | null }> {
  const map = new Map<string, { label: string; rationale: string | null }>();
  for (const rec of page.useCaseRecommendations) {
    if (!rec.approved || map.has(rec.productSlug)) continue;
    const label = bestPublicCopy(rec.label);
    if (!label) continue;
    map.set(rec.productSlug, {
      label,
      rationale: bestPublicCopy(rec.rationale),
    });
  }
  return map;
}

function buildRecommendation(
  deps: BuildBestPageDeps,
  rec: BuildBestPageDeps["page"]["recommendations"][number],
  index: number,
): BestPageRecommendationModel | null {
  const software = resolveProduct(deps, rec.productSlug);
  if (!software) return null;

  const rankingsApproved = deps.page.editorialStatus === "approved";
  const score = deps.approvedScore(software);

  const summary =
    bestPublicCopy(rec.rationale) ??
    bestPublicCopy(software.shortDescription) ??
    bestPublicCopy(software.description) ??
    `${software.name} is included in this ${shortCategory(deps)} shortlist.`;

  const badge = rec.approved
    ? bestPublicCopy(rec.badge) ?? bestPublicCopy(rec.recommendationLabel)
    : null;

  const positioningLabel = !rec.approved
    ? bestPublicCopy(rec.recommendationLabel)
    : null;

  const bestFor = rec.approved
    ? bestPublicCopy(rec.scenarios[0]) ??
      bestPublicCopy(software.bestFor?.[0]) ??
      null
    : null;

  const strengths = rec.strengths
    .map((s) => bestPublicCopy(s))
    .filter(Boolean) as string[];

  const tradeOffs = rec.tradeOffs
    .map((s) => bestPublicCopy(s))
    .filter(Boolean) as string[];

  const alternatives = rec.alternatives
    .map((alt) => {
      const p = resolveProduct(deps, alt.productSlug);
      const when = bestPublicCopy(alt.when);
      if (!p || !when) return null;
      return { product: productRef(p), when };
    })
    .filter(Boolean) as BestPageRecommendationModel["alternatives"];

  const featureSnapshot = rec.featureSnapshot
    .map((f) => {
      const label = bestPublicCopy(f.label);
      if (!label) return null;
      if (typeof f.score === "number" && !rec.approved) {
        return { label, level: f.level ?? "unknown" };
      }
      return {
        label,
        level: f.level,
        score: rec.approved ? f.score : undefined,
      };
    })
    .filter(Boolean) as BestPageRecommendationModel["featureSnapshot"];

  const keyDetails = rec.keyDetails
    .map((d) => {
      const label = bestPublicCopy(d.label);
      const value = bestPublicCopy(d.value);
      if (!label || !value) return null;
      return { label, value };
    })
    .filter(Boolean) as BestPageRecommendationModel["keyDetails"];

  const criterionScores = (deps.criterionScores?.(software) ?? []).map((c) => {
    const methodologyName = deps.methodology?.criteria.find(
      (m) => m.slug === c.slug,
    )?.name;
    return {
      slug: c.slug,
      name: methodologyName ?? c.name,
      score: c.score,
    };
  });

  const screenshot = deps.productScreenshot?.(software) ?? null;

  return {
    product: productRef(software),
    rank:
      rankingsApproved && rec.approved
        ? (rec.rank ?? index + 1)
        : undefined,
    badge,
    positioningLabel,
    summary,
    bestFor,
    keyStrength: strengths[0] ?? null,
    keyLimitation: tradeOffs[0] ?? null,
    pricingTeaser: deps.pricingTeaser(software),
    strengths,
    tradeOffs,
    editorialSummary: bestPublicCopy(rec.editorialSummary),
    whyPicked: rec.approved ? bestPublicCopy(rec.whyPicked) : null,
    idealFor: rec.idealFor
      .map((s) => bestPublicCopy(s))
      .filter(Boolean) as string[],
    avoidIf: rec.avoidIf
      .map((s) => bestPublicCopy(s))
      .filter(Boolean) as string[],
    alternatives,
    featureSnapshot,
    criterionScores,
    keyDetails,
    score: score.score,
    scoreApproved: score.approved,
    screenshot,
    pricingHref: `/software/${software.slug}/pricing/`,
    featuresHref: `/software/${software.slug}/features/`,
  };
}

function buildComparison(
  deps: BuildBestPageDeps,
  products: BestPageRecommendationModel[],
): BestPageModel["comparison"] {
  if (products.length === 0) return null;

  const rows = products.map((p) => {
    const software = resolveProduct(deps, p.product.slug)!;
    const detail = deps.pricingDetail?.(software) ?? null;
    const fitLabel =
      p.bestFor ??
      p.badge ??
      p.positioningLabel ??
      p.keyDetails.find((d) => /best for/i.test(d.label))?.value ??
      null;
    return {
      product: p.product,
      bestFor: fitLabel,
      focus: p.summary,
      startingPrice: detail?.startingPrice ?? p.pricingTeaser ?? null,
      freePlan: detail?.freePlan ?? null,
      keyStrength: p.keyStrength,
      keyLimitation: p.keyLimitation,
      rating: p.scoreApproved ? p.score : null,
      reviewHref: p.product.href,
      compareHref: `/compare/?products=${p.product.slug}`,
    };
  });

  const columns: BestPageComparisonColumn[] = ["product"];
  if (rows.some((r) => r.rating != null)) columns.push("rating");
  if (rows.some((r) => r.bestFor)) columns.push("bestFor");
  else if (rows.some((r) => r.focus)) columns.push("focus");
  if (rows.some((r) => r.startingPrice)) columns.push("startingPrice");
  if (rows.some((r) => r.freePlan)) columns.push("freePlan");
  if (rows.some((r) => r.keyStrength)) columns.push("keyStrength");
  if (rows.some((r) => r.keyLimitation)) columns.push("keyLimitation");
  columns.push("review");
  columns.push("compare");

  return {
    heading: `Best ${categoryLabel(deps)} at a glance`,
    columns,
    rows,
  };
}

function buildNav(modelParts: {
  hasQuick: boolean;
  hasComparison: boolean;
  hasTopPicks: boolean;
  hasProducts: boolean;
  hasFeatures: boolean;
  hasPricing: boolean;
  hasDecision: boolean;
  hasUseCases: boolean;
  hasLandscape: boolean;
  hasMethodology: boolean;
  hasBuying: boolean;
  hasComparisons: boolean;
  hasAlternatives: boolean;
  hasGuides: boolean;
  hasFaq: boolean;
  hasVerdict: boolean;
}): BestPageModel["nav"] {
  const nav: BestPageModel["nav"] = [];
  if (modelParts.hasQuick) {
    nav.push({ id: "at-a-glance", label: "At a glance", icon: "overview" });
  }
  if (modelParts.hasTopPicks) {
    nav.push({ id: "top-picks", label: "Top picks", icon: "star" });
  }
  if (modelParts.hasComparison) {
    nav.push({ id: "compare", label: "Compare", icon: "comparisons" });
  }
  if (modelParts.hasProducts) {
    nav.push({ id: "recommendations", label: "Recommendations", icon: "star" });
  }
  if (modelParts.hasFeatures) {
    nav.push({ id: "features", label: "Features", icon: "features" });
  }
  if (modelParts.hasPricing) {
    nav.push({ id: "pricing", label: "Pricing", icon: "pricing" });
  }
  if (modelParts.hasDecision) {
    nav.push({ id: "which", label: "Which to choose", icon: "choose" });
  }
  if (modelParts.hasUseCases) {
    nav.push({ id: "use-cases", label: "Use cases", icon: "use-cases" });
  }
  if (modelParts.hasLandscape) {
    nav.push({ id: "landscape", label: "Landscape", icon: "overview" });
  }
  if (modelParts.hasMethodology) {
    nav.push({ id: "methodology", label: "How we evaluate", icon: "methodology" });
  }
  if (modelParts.hasBuying) {
    nav.push({ id: "how-to-choose", label: "How to choose", icon: "choose" });
  }
  if (modelParts.hasComparisons) {
    nav.push({ id: "comparisons", label: "Comparisons", icon: "comparisons" });
  }
  if (modelParts.hasAlternatives) {
    nav.push({ id: "alternatives", label: "Alternatives", icon: "alternatives" });
  }
  if (modelParts.hasGuides) {
    nav.push({ id: "guides", label: "Guides", icon: "overview" });
  }
  if (modelParts.hasFaq) {
    nav.push({ id: "faq", label: "FAQ", icon: "faq" });
  }
  if (modelParts.hasVerdict) {
    nav.push({ id: "bottom-line", label: "Bottom line", icon: "star" });
  }
  return nav;
}

/**
 * Assemble a public Best-page view model from canonical entities.
 * Omits empty sections; never surfaces editorial workflow state.
 */
export function buildBestPageModel(deps: BuildBestPageDeps): BestPageModel {
  const { page } = deps;
  const rankingsApproved = page.editorialStatus === "approved";
  const hasApprovedRanks = page.recommendations.some((r) => r.approved);
  const listMode =
    rankingsApproved && hasApprovedRanks ? "ranked" : "shortlist";
  const cat = categoryLabel(deps);
  const short = shortCategory(deps);
  const path = page.seo.canonicalPath || `/best/${page.slug}/`;
  const gaps: string[] = [];
  const clusterAwards = approvedClusterAwards(page);

  const recommendations = page.recommendations
    .map((rec, i) => buildRecommendation(deps, rec, i))
    .filter(Boolean) as BestPageRecommendationModel[];

  // Include eligible products not already in recommendations (compact shortlist).
  // Cluster-award pages have an empty ranked set — surface award winners first,
  // with job labels instead of fabricated #1 / #2 ranks.
  const seen = new Set(recommendations.map((r) => r.product.slug));
  const fillSlugs =
    page.recommendations.length === 0 && clusterAwards.size > 0
      ? [
          ...clusterAwards.keys(),
          ...page.eligibleProductSlugs.filter((slug) => !clusterAwards.has(slug)),
        ]
      : page.eligibleProductSlugs;
  for (const slug of fillSlugs) {
    if (seen.has(slug)) continue;
    const software = resolveProduct(deps, slug);
    if (!software) continue;
    const score = deps.approvedScore(software);
    const award = clusterAwards.get(slug);
    recommendations.push({
      product: productRef(software),
      summary:
        award?.rationale ??
        bestPublicCopy(software.shortDescription) ??
        `${software.name} is in the ${short} catalogue.`,
      badge: award?.label ?? null,
      positioningLabel: null,
      bestFor: null,
      keyStrength: null,
      keyLimitation: null,
      pricingTeaser: deps.pricingTeaser(software),
      strengths: [],
      tradeOffs: [],
      idealFor: [],
      avoidIf: [],
      alternatives: [],
      featureSnapshot: [],
      criterionScores: deps.criterionScores?.(software) ?? [],
      keyDetails: [],
      score: score.score,
      scoreApproved: score.approved,
      screenshot: deps.productScreenshot?.(software) ?? null,
      pricingHref: `/software/${software.slug}/pricing/`,
      featuresHref: `/software/${software.slug}/features/`,
    });
    seen.add(slug);
  }

  if (recommendations.length === 0) {
    gaps.push("No catalogue products available for shortlist.");
  }

  const featured = recommendations.slice(0, 3);
  const compact = recommendations.slice(3, 8);

  const updatedLabel = (
    page.metadata.updatedAt ||
    page.metadata.publishedAt ||
    ""
  ).slice(0, 10);

  const finderHref = finderPath(page);
  const calcHref = calculatorPath(page);

  const subtitle =
    bestPublicCopy(page.heroSubtitle) ??
    bestPublicCopy(page.summary) ??
    `Compare ${cat} platforms for workflows, automation, reporting, and fit.`;

  const heroShortlist = recommendations.slice(0, 3).map((r) => ({
    product: r.product,
    bestFor: r.badge ?? r.positioningLabel ?? r.bestFor,
    summary: r.summary,
    score: r.scoreApproved ? r.score : null,
    scoreApproved: r.scoreApproved,
    pricingTeaser: r.pricingTeaser,
    rank: listMode === "ranked" ? r.rank : undefined,
  }));

  const fitHighlights = recommendations
    .slice(0, 6)
    .map((r) => {
      const label =
        bestPublicCopy(r.badge) ??
        bestPublicCopy(r.positioningLabel) ??
        bestPublicCopy(
          r.keyDetails.find((d) => /best for/i.test(d.label))?.value,
        );
      const reason =
        bestPublicCopy(r.summary) ??
        bestPublicCopy(r.keyStrength) ??
        null;
      if (!label || !reason) return null;
      return { label, product: r.product, reason };
    })
    .filter(Boolean)
    .slice(0, 3) as BestPageHeroModel["fitHighlights"];

  const stats = [
    {
      label: `${page.eligibleProductSlugs.length || recommendations.length} ${short} platforms evaluated`,
      icon: "products",
    },
    ...(updatedLabel
      ? [{ label: `Updated ${updatedLabel}`, icon: "updated" }]
      : []),
    {
      label: "Independent methodology",
      icon: "independent",
      href: deps.methodologyHref,
    },
    {
      label: "Evidence-backed recommendations",
      icon: "methodology",
    },
  ];

  const hasAnyPricing = recommendations.some((r) => r.pricingTeaser);
  if (!hasAnyPricing) {
    gaps.push("Verified starting prices not yet available for comparison columns.");
  }

  const comparison = buildComparison(deps, recommendations.slice(0, 5));

  // Feature matrix — verified cells only; unknowns render as incomplete (never as "No").
  let featureMatrix: BestPageModel["featureMatrix"] = null;
  const matrixSlugs = page.featureMatrixSlugs;
  const matrixProducts = recommendations.slice(0, 5);
  if (matrixSlugs.length > 0 && deps.featureCell && matrixProducts.length >= 2) {
    const products = matrixProducts.map((f) => f.product);
    const rows = matrixSlugs
      .map((featureSlug) => {
        const cells = products.map((p) => {
          const software = resolveProduct(deps, p.slug)!;
          return deps.featureCell!(software, featureSlug);
        });
        if (cells.every((c) => c === "unknown")) return null;
        return {
          featureSlug,
          featureName: deps.featureName?.(featureSlug) ?? featureSlug,
          featureHref: `/features/${featureSlug}/`,
          cells,
        };
      })
      .filter(Boolean) as NonNullable<BestPageModel["featureMatrix"]>["rows"];

    if (rows.length > 0) {
      featureMatrix = {
        heading: `How the top ${short} platforms compare`,
        products,
        rows,
      };
    } else {
      gaps.push("Feature matrix omitted — verified feature support not yet available.");
    }
  } else if (matrixSlugs.length > 0) {
    gaps.push("Feature matrix omitted — verified feature support not yet available.");
  }

  // Pricing section
  let pricing: BestPageModel["pricing"] = null;
  if (deps.pricingDetail) {
    const rows = recommendations.slice(0, 6).map((r) => {
      const software = resolveProduct(deps, r.product.slug)!;
      const detail = deps.pricingDetail!(software);
      return {
        product: r.product,
        startingPrice: detail?.startingPrice ?? r.pricingTeaser ?? null,
        model: detail?.model ?? null,
        freeTrial: detail?.freeTrial ?? null,
        freePlan: detail?.freePlan ?? null,
        lastChecked: detail?.lastChecked ?? null,
      };
    });
    const anyPrice = rows.some((r) => r.startingPrice || r.freePlan || r.freeTrial);
    if (anyPrice) {
      pricing = {
        heading: `${short} pricing compared`,
        intro: `${short} pricing is often per user and plan tier. Figures below use verified list prices when available — not invented market averages.`,
        lastChecked: rows.find((r) => r.lastChecked)?.lastChecked ?? null,
        rows: rows.map(({ lastChecked, ...rest }) => {
          void lastChecked;
          return rest;
        }),
        calculatorHref: calcHref,
        interactiveProductSlugs: rows.map((r) => r.product.slug),
      };
    } else {
      gaps.push("Pricing comparison omitted — no verified pricing snapshots.");
    }
  } else {
    gaps.push("Pricing comparison omitted — no verified pricing snapshots.");
  }

  const topPicks = page.useCaseRecommendations
    .filter((u) => u.approved)
    .map((u) => {
      const software = resolveProduct(deps, u.productSlug);
      const label = bestPublicCopy(u.label);
      const rationale = bestPublicCopy(u.rationale);
      if (!software || !label) return null;
      return {
        category: label,
        product: productRef(software),
        summary: rationale,
      };
    })
    .filter(Boolean) as BestPageModel["topPicks"];

  if (page.useCaseRecommendations.length > 0 && topPicks.length === 0) {
    gaps.push("Top-pick award cards hidden until use-case recommendations are approved.");
  }

  const decisionPaths = page.decisionPaths
    .filter((d) => d.approved)
    .map((d) => {
      const software = resolveProduct(deps, d.productSlug);
      const priority = bestPublicCopy(d.priority);
      if (!software || !priority) return null;
      return {
        priority,
        product: productRef(software),
        label: bestPublicCopy(d.label) ?? undefined,
      };
    })
    .filter(Boolean) as NonNullable<BestPageModel["decision"]>["paths"];

  const decision =
    decisionPaths.length > 0
      ? {
          heading: `Which ${short} is right for you?`,
          paths: decisionPaths,
          finderHref,
          finderLabel: finderHref
            ? `Find My ${short}`
            : undefined,
        }
      : null;

  if (page.decisionPaths.length > 0 && !decision) {
    gaps.push("Decision tree hidden until approved recommendation mappings exist.");
  }

  const decisionExplorePaths = page.decisionPaths
    .map((d) => {
      const software = resolveProduct(deps, d.productSlug);
      const priority = bestPublicCopy(d.priority);
      if (!software || !priority) return null;
      return {
        priority,
        product: productRef(software),
        label: bestPublicCopy(d.label) ?? undefined,
      };
    })
    .filter(Boolean) as NonNullable<BestPageModel["decisionExplore"]>["paths"];

  const decisionExplore =
    !decision && decisionExplorePaths.length > 0
      ? {
          heading: `Which ${short} should I choose?`,
          intro: `Start from what matters most in your sales process. These researched fit starting points connect to the ${short} Finder for a personalized shortlist — we do not invent match scores here.`,
          paths: decisionExplorePaths,
          finderHref,
          finderLabel: finderHref ? `Get a detailed recommendation` : undefined,
        }
      : null;

  const useCases = (() => {
    const fromRecs = page.useCaseRecommendations
      .map((rec) => {
        const uc = deps.useCases.find((u) => u.slug === rec.useCaseSlug);
        const software = resolveProduct(deps, rec.productSlug);
        const title = uc?.name ?? bestPublicCopy(rec.label);
        const description = rec.approved
          ? bestPublicCopy(rec.rationale) ??
            bestPublicCopy(uc?.shortDescription)
          : bestPublicCopy(uc?.shortDescription) ??
            `Explore ${short} options for ${uc?.name ?? rec.useCaseSlug}.`;
        if (!title || !description) return null;
        return {
          slug: rec.useCaseSlug,
          title,
          description,
          href: `/use-cases/${rec.useCaseSlug}/`,
          product: rec.approved && software ? productRef(software) : null,
        };
      })
      .filter(Boolean) as BestPageModel["useCases"];

    if (fromRecs.length > 0) return fromRecs;

    return page.useCaseSlugs
      .map((slug) => {
        const uc = deps.useCases.find((u) => u.slug === slug);
        if (!uc) return null;
        const description = bestPublicCopy(uc.shortDescription);
        if (!description) return null;
        return {
          slug,
          title: uc.name,
          description,
          href: `/use-cases/${slug}/`,
          product: null,
        };
      })
      .filter(Boolean) as BestPageModel["useCases"];
  })();

  const byNeedFromUseCases = page.useCaseRecommendations
    .map((rec) => {
      const uc = deps.useCases.find((u) => u.slug === rec.useCaseSlug);
      const software = resolveProduct(deps, rec.productSlug);
      const title = uc?.name ?? bestPublicCopy(rec.label);
      const why = bestPublicCopy(rec.rationale);
      const description =
        bestPublicCopy(uc?.shortDescription) ??
        why ??
        `Explore ${short} options for ${title}.`;
      if (!title || !description || !software) return null;
      return {
        id: rec.useCaseSlug,
        title: `Fit for ${title.toLowerCase()}`,
        description,
        href: `/use-cases/${rec.useCaseSlug}/`,
        product: productRef(software),
        why,
      };
    })
    .filter(Boolean) as BestPageModel["byNeed"];

  const byNeedFromLandscape = page.landscape
    .map((g) => {
      const label = bestPublicCopy(g.label);
      const description = bestPublicCopy(g.description);
      const firstSlug = g.productSlugs[0];
      const software = firstSlug ? resolveProduct(deps, firstSlug) : undefined;
      if (!label || !description || !software) return null;
      return {
        id: g.id,
        title: label,
        description,
        href: `/use-cases/`,
        product: productRef(software),
        why: `${software.name} appears in researched ${label.toLowerCase()} options.`,
      };
    })
    .filter(Boolean) as BestPageModel["byNeed"];

  const byNeedFromCompany = page.companySizes
    .map((c) => {
      const title = bestPublicCopy(c.title);
      const description = bestPublicCopy(c.description);
      if (!title || !description) return null;
      // Prefer a shortlist product whose scenarios/labels mention this size.
      const match = recommendations.find((r) => {
        const blob = `${r.positioningLabel ?? ""} ${r.summary} ${r.idealFor.join(" ")}`.toLowerCase();
        if (/enterprise/i.test(title)) return /enterprise|mid-market|complex/.test(blob);
        if (/small|smb|solo|freelancer/i.test(title))
          return /smb|small|freemium|simple|pipeline/.test(blob);
        if (/mid/i.test(title)) return /mid|growing|platform|hub/.test(blob);
        return false;
      });
      return {
        id: c.id,
        title,
        description,
        href: c.href,
        product: match?.product ?? null,
        why: match
          ? bestPublicCopy(match.positioningLabel) ?? match.summary
          : null,
      };
    })
    .filter(Boolean) as BestPageModel["byNeed"];

  const byNeed = [
    ...byNeedFromUseCases,
    ...byNeedFromLandscape,
    ...byNeedFromCompany,
  ].slice(0, 9);

  const tradeOffs = recommendations
    .filter((r) => r.strengths.length > 0 || r.tradeOffs.length > 0)
    .slice(0, 6)
    .map((r) => ({
      product: r.product,
      strengths: r.strengths.slice(0, 3),
      limitations: r.tradeOffs.slice(0, 3),
    }));

  const productDeepDives = recommendations
    .filter(
      (r) =>
        Boolean(r.editorialSummary) ||
        r.strengths.length > 0 ||
        r.criterionScores.length > 0,
    )
    .slice(0, 8);

  const researchTransparency: BestPageModel["researchTransparency"] =
    deps.researchTransparency
      ? {
          ...deps.researchTransparency,
          methodologyVersion: bestPublicCopy(page.methodologyVersion),
        }
      : null;

  const guideGroups = groupGuides(deps.guides, short);

  const productHubs = recommendations.slice(0, 6).map((r) => {
    const guides = (deps.productGuides ?? []).filter(
      (g) => g.productSlug === r.product.slug,
    );
    const hasAlt = (deps.alternatives ?? []).some(
      (a) => a.sourceSlug === r.product.slug || a.slug === r.product.slug,
    );
    const links: Array<{ href: string; label: string }> = [
      { href: r.product.href, label: "Review" },
      { href: r.pricingHref ?? `/software/${r.product.slug}/pricing/`, label: "Pricing" },
      {
        href: r.featuresHref ?? `/software/${r.product.slug}/features/`,
        label: "Features",
      },
    ];
    if (hasAlt) {
      links.push({
        href: `/alternatives/${r.product.slug}/`,
        label: "Alternatives",
      });
    }
    for (const g of guides.slice(0, 2)) {
      links.push({ href: g.href, label: g.title });
    }
    return { product: r.product, links };
  });

  const landscape = page.landscape
    .map((g) => {
      const label = bestPublicCopy(g.label);
      if (!label) return null;
      const products = g.productSlugs
        .map((slug) => {
          const s = resolveProduct(deps, slug);
          return s ? productRef(s) : null;
        })
        .filter(Boolean) as BestPageProductRef[];
      if (products.length === 0) return null;
      return {
        id: g.id,
        label,
        description: bestPublicCopy(g.description) ?? undefined,
        products,
      };
    })
    .filter(Boolean) as BestPageModel["landscape"];

  const companySizes = page.companySizes
    .map((c) => {
      const title = bestPublicCopy(c.title);
      const description = bestPublicCopy(c.description);
      if (!title || !description) return null;
      return {
        id: c.id,
        title,
        description,
        href: c.href,
      };
    })
    .filter(Boolean) as BestPageModel["companySizes"];

  const softwareTypes = page.softwareTypes
    .map((t) => {
      const name = bestPublicCopy(t.name);
      const description = bestPublicCopy(t.description);
      if (!name || !description) return null;
      return { id: t.id, name, description, href: t.href };
    })
    .filter(Boolean) as BestPageModel["softwareTypes"];

  const methodologyCriteria = (deps.methodology?.criteria ?? [])
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      description: bestPublicCopy(c.description) ?? undefined,
    }));

  const weightSum = (deps.methodology?.criteria ?? []).reduce(
    (acc, c) => acc + (c.weight || 0),
    0,
  );
  const weightsApproved =
    rankingsApproved &&
    weightSum > 0 &&
    (deps.methodology?.criteria ?? []).every((c) => c.weight > 0);

  const methodologyIntro =
    bestPublicCopy(page.methodologyIntro) ??
    bestPublicCopy(page.methodology) ??
    bestPublicCopy(deps.methodology?.description) ??
    `We evaluate ${cat} with category-specific criteria. Affiliate relationships never determine ranking.`;

  const methodology =
    methodologyCriteria.length > 0 || methodologyIntro
      ? {
          heading: `How we evaluate ${cat}`,
          intro: methodologyIntro!,
          criteria: methodologyCriteria.map((c) => {
            const raw = deps.methodology?.criteria.find((x) => x.slug === c.slug);
            const weightPercent =
              weightsApproved && raw && weightSum > 0
                ? Math.round((raw.weight / weightSum) * 100)
                : undefined;
            return { ...c, weightPercent };
          }),
          href: deps.methodologyHref,
        }
      : null;

  const buyingSteps = page.buyingGuideSteps
    .map((s) => {
      const title = bestPublicCopy(s.title);
      const body = bestPublicCopy(s.body);
      if (!title || !body) return null;
      return { step: s.step, title, body };
    })
    .filter(Boolean) as NonNullable<BestPageModel["buyingGuide"]>["steps"];

  const buyingGuide =
    buyingSteps.length > 0
      ? {
          heading: `How to choose ${cat}`,
          steps: buyingSteps,
          guideHref: page.buyingGuideHref,
          guideLabel: page.buyingGuideHref
            ? `Read full guide: How to Choose ${short}`
            : undefined,
        }
      : null;

  const buyingFramework = buildBuyingFramework({
    short,
    cat,
    buyingGuide,
    finderHref,
    calcHref,
    page,
  });

  const comparisons = deps.comparisons
    .filter((c) => page.relatedComparisonSlugs.includes(c.slug))
    .map((c) => {
      const products = c.productSlugs
        .map((slug) => {
          const s = resolveProduct(deps, slug);
          return s ? productRef(s) : null;
        })
        .filter(Boolean) as BestPageProductRef[];
      return {
        href: `/compare/${c.slug}/`,
        title: c.title,
        summary: bestPublicCopy(c.summary),
        products,
      };
    });

  const alternatives = deps.alternatives
    .filter(
      (a) =>
        page.relatedAlternativeSlugs.includes(a.slug) ||
        page.eligibleProductSlugs.includes(a.sourceSlug),
    )
    .slice(0, 6)
    .map((a) => {
      const software = resolveProduct(deps, a.sourceSlug);
      if (!software) return null;
      return {
        href: `/alternatives/${a.slug}/`,
        label: `${software.name} alternatives`,
        product: productRef(software),
      };
    })
    .filter(Boolean) as BestPageModel["alternatives"];

  const faq = page.faq
    .map((f) => {
      const question = bestPublicCopy(f.question);
      const answer = bestPublicCopy(f.answer);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter(Boolean) as BestPageModel["faq"];

  let verdict: BestPageModel["verdict"] = null;
  if (page.verdict) {
    const body = bestPublicCopy(page.verdict.body);
    if (body) {
      const paths = page.verdict.paths
        .filter((p) => p.approved)
        .map((p) => {
          const software = resolveProduct(deps, p.productSlug);
          const when = bestPublicCopy(p.when);
          if (!software || !when) return null;
          return { product: productRef(software), when };
        })
        .filter(Boolean) as NonNullable<BestPageModel["verdict"]>["paths"];

      verdict = {
        heading: bestPublicCopy(page.verdict.heading) ?? "The bottom line",
        body,
        paths,
        finderHref,
        finderLabel: finderHref ? `Find My ${short}` : undefined,
      };
    }
  }

  const quickAnswerIntro =
    bestPublicCopy(page.quickAnswerIntro) ??
    `The best ${cat.toLowerCase()} depends on team size, workflow, budget, and the capabilities you need day to day.`;

  const quickAnswer =
    recommendations.length > 0
      ? {
          heading: `The best ${cat} at a glance`,
          intro: quickAnswerIntro,
          featured,
          compact,
        }
      : null;

  const finderCta = finderHref
    ? {
        title: `Find the ${short} that fits your business`,
        description: `Answer questions about team size, sales process, budget, must-have capabilities, and integrations for a shortlist.`,
        href: finderHref,
        ctaLabel: `Find My ${short}`,
        secondaryHref: calcHref,
        secondaryLabel: calcHref ? `Compare ${short} costs` : undefined,
        requirements: [
          "Team size",
          "Sales process",
          "Budget",
          "Must-have capabilities",
          "Integration requirements",
        ],
        previewNote:
          "Open the Finder for a live shortlist — we do not invent match percentages here.",
      }
    : null;

  const costCalculatorCta = calcHref
    ? {
        title: `What will ${short} actually cost your team?`,
        description: `Estimate subscription cost across researched ${short} plans by seats and billing period.`,
        href: calcHref,
        ctaLabel: `Calculate ${short} costs`,
      }
    : null;

  const nav = buildNav({
    hasQuick: Boolean(quickAnswer),
    hasComparison: Boolean(comparison),
    hasTopPicks: topPicks.length > 0 || byNeed.length > 0,
    hasProducts: productDeepDives.length > 0,
    hasFeatures: Boolean(featureMatrix),
    hasPricing: Boolean(pricing) || Boolean(costCalculatorCta),
    hasDecision: Boolean(decision) || Boolean(decisionExplore),
    hasUseCases: useCases.length > 0,
    hasLandscape: landscape.length > 0 || softwareTypes.length > 0,
    hasMethodology: Boolean(methodology),
    hasBuying: Boolean(buyingFramework) || Boolean(buyingGuide),
    hasComparisons: comparisons.length > 0,
    hasAlternatives: alternatives.length > 0,
    hasGuides: deps.guides.length > 0 || guideGroups.length > 0,
    hasFaq: faq.length > 0,
    hasVerdict: Boolean(verdict),
  });

  return {
    slug: page.slug,
    title: page.title,
    path,
    categoryName: cat,
    categoryShortName: short,
    rankingsApproved,
    listMode,
    hero: {
      eyebrow:
        bestPublicCopy(page.heroEyebrow) ??
        `${short.toUpperCase()} SOFTWARE BUYING GUIDE`,
      title: page.title,
      subtitle,
      stats,
      primaryCta: {
        href: "#compare",
        label: `Compare ${short} software`,
      },
      secondaryCta: finderHref
        ? { href: finderHref, label: `Find My ${short}` }
        : undefined,
      tertiaryCta: {
        href: "#methodology",
        label: `How we evaluate ${short} →`,
      },
      fitHighlights,
      shortlistTitle:
        listMode === "ranked"
          ? `Our top ${short} picks`
          : `Editor’s ${short} picks`,
      shortlist: heroShortlist,
      compareHref: "#recommendations",
      compareLabel:
        listMode === "ranked" ? "View full rankings" : "View picks by job",
      compactDisclosure:
        "SoftwareGlimpse may earn a commission when you buy through some links. This does not affect our recommendations.",
    },
    quickAnswer,
    topPicks,
    comparison,
    products: recommendations,
    featureMatrix,
    pricing,
    costCalculatorCta,
    decision,
    decisionExplore,
    finderCta,
    useCases,
    byNeed,
    tradeOffs,
    researchTransparency,
    productDeepDives,
    guideGroups,
    productHubs,
    buyingFramework,
    companySizes,
    landscape,
    softwareTypes,
    methodology,
    buyingGuide,
    comparisons,
    alternatives,
    guides: deps.guides.map((g) => ({
      href: g.path,
      title: g.title,
      description: bestPublicCopy(g.description) ?? undefined,
      featured: g.featured,
    })),
    faq,
    verdict,
    nav,
    trust: {
      heading: "Why trust SoftwareGlimpse?",
      principles: [
        {
          title: "Research-backed",
          description:
            "Recommendations use category-specific criteria and product evidence.",
          href: deps.howWeReviewHref,
        },
        {
          title: "Transparent methodology",
          description: "Evaluation criteria are published and applied consistently.",
          href: deps.methodologyHref,
        },
        {
          title: "Editorial independence",
          description:
            "Affiliate relationships never determine rankings or Finder order.",
          href: deps.editorialIndependenceHref,
        },
        {
          title: "Corrections welcome",
          description: "Spot something outdated? Tell us and we will review it.",
          href: deps.contactCorrectionHref,
        },
      ],
    },
    gaps,
  };
}
