import type {
  Comparison,
  CompetitorDeepDive,
  CoverageState,
  DetailedReviewSection,
  FeatureAvailability,
  FinalVerdict,
  LimitationSection,
  Methodology,
  PlanRecommendation,
  Pricing,
  PricingPlan,
  ProductEditorialAssessment,
  ProductExperienceReview,
  ProductResearchEnrichment,
  ProductReview,
  ProductWorkflowStep,
  ReviewCoverage,
  ReviewVerdictLabel,
  Software,
} from "@/domain";
import { getAllComparisonsUnfiltered, getSoftwareBySlug } from "@/data";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import { CRITERION_FEATURE_MAP } from "@/services/editorial/scoring";
import {
  firstPublicCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";

const featureNameBySlug = new Map(
  canonicalFeaturesSeed.map((f) => [f.slug, f.name]),
);

export type DeepReviewLayer = {
  productExperience: ProductExperienceReview | null;
  detailedSections: DetailedReviewSection[];
  limitations: LimitationSection[];
  planRecommendations: PlanRecommendation[];
  competitorDeepDives: CompetitorDeepDive[];
  finalVerdict: FinalVerdict | null;
  whyWeLike: string[];
  keyTakeaway: string | null;
  whoShouldChoose: string | null;
  whoShouldSkip: string | null;
  coverage: ReviewCoverage;
  updateHistory: Array<{ date: string; label: string }>;
};

function availabilityRank(a: FeatureAvailability): number {
  switch (a) {
    case "supported":
      return 3;
    case "limited":
    case "add-on":
    case "higher-plan-only":
      return 2;
    case "not-supported":
      return 0;
    default:
      return 1;
  }
}

function verdictFromAvailability(
  availabilities: FeatureAvailability[],
): ReviewVerdictLabel | undefined {
  if (availabilities.length === 0) return undefined;
  const ranks = availabilities.map(availabilityRank);
  const avg = ranks.reduce((a, b) => a + b, 0) / ranks.length;
  if (avg >= 2.8) return "strong";
  if (avg >= 2.2) return "good";
  if (avg >= 1.5) return "mixed";
  return "limited";
}

function labelFromScore(score: number): ReviewVerdictLabel {
  if (score >= 9) return "excellent";
  if (score >= 8) return "strong";
  if (score >= 7) return "good";
  if (score >= 5) return "mixed";
  return "limited";
}

function coverageState(
  complete: boolean,
  partial: boolean,
  applicable = true,
): CoverageState {
  if (!applicable) return "not-applicable";
  if (complete) return "complete";
  if (partial) return "partial";
  return "missing";
}

/** Category-aware workflow templates — filtered by researched feature support. */
const WORKFLOW_BY_CATEGORY: Record<
  string,
  Array<Omit<ProductWorkflowStep, "id"> & { id: string }>
> = {
  crm: [
    {
      id: "add-lead",
      title: "Add a lead",
      description: "Capture inbound or outbound leads into the CRM.",
      icon: "target",
      featureSlug: "lead-management",
    },
    {
      id: "qualify",
      title: "Qualify",
      description: "Organize contacts and decide which leads become deals.",
      icon: "users",
      featureSlug: "contact-management",
    },
    {
      id: "create-deal",
      title: "Create a deal",
      description: "Open opportunities and track deal value through stages.",
      icon: "layers",
      featureSlug: "deal-management",
    },
    {
      id: "pipeline",
      title: "Move through the pipeline",
      description: "Advance deals visually across customizable stages.",
      icon: "funnel",
      featureSlug: "pipeline-management",
    },
    {
      id: "activities",
      title: "Schedule activities",
      description: "Keep follow-ups and activity cadence visible to the team.",
      icon: "handshake",
      featureSlug: "pipeline-management",
    },
    {
      id: "report",
      title: "Report",
      description: "Review pipeline health and outcomes in reporting views.",
      icon: "book",
      featureSlug: "reporting",
    },
  ],
};

function buildProductExperience(input: {
  software: Software;
  enrichment: ProductResearchEnrichment | null;
  stored?: ProductExperienceReview;
}): ProductExperienceReview | null {
  if (input.stored?.summary && publicCopy(input.stored.summary)) {
    return {
      ...input.stored,
      summary: publicCopy(input.stored.summary)!,
      workflowSteps: input.stored.workflowSteps.filter((s) =>
        Boolean(publicCopy(s.title) && publicCopy(s.description)),
      ),
      claimType: input.stored.claimType,
      evidenceNote: publicCopy(input.stored.evidenceNote) ?? undefined,
    };
  }

  const category = input.software.primaryCategorySlug;
  const template = WORKFLOW_BY_CATEGORY[category];
  if (!template) return null;

  const support = new Map(
    (input.enrichment?.featureSupport ?? []).map((f) => [
      f.featureSlug,
      f.availability,
    ]),
  );

  const steps = template.filter((step) => {
    if (!step.featureSlug) return true;
    const availability = support.get(step.featureSlug);
    return availability === "supported" || availability === "limited";
  });

  if (steps.length < 3) return null;

  const name = input.software.name;
  return {
    summary: `Based on documented ${name} capabilities, the typical sales workflow centers on capturing leads, managing deals in a visual pipeline, staying on top of activities, and reviewing outcomes in reporting.`,
    workflowSteps: steps,
    claimType: "research-inference",
    evidenceNote:
      "Workflow narrative is derived from researched product capabilities — not a hands-on product test.",
  };
}

function buildDetailedSections(input: {
  software: Software;
  methodology: Methodology | null;
  assessment: ProductEditorialAssessment | null;
  review: ProductReview | null;
  enrichment: ProductResearchEnrichment | null;
  scoresApproved: boolean;
  stored?: DetailedReviewSection[];
}): DetailedReviewSection[] {
  if (input.stored?.length) {
    return input.stored
      .map((section) => {
        const summary = publicCopy(section.summary);
        if (!summary) return null;
        return {
          ...section,
          summary,
          body: section.body.map((b) => publicCopy(b)).filter(Boolean) as string[],
          strengths: section.strengths
            .map((s) => publicCopy(s))
            .filter(Boolean) as string[],
          weaknesses: section.weaknesses
            .map((s) => publicCopy(s))
            .filter(Boolean) as string[],
          score: section.scoreApproved ? section.score : undefined,
          scoreApproved: Boolean(section.scoreApproved && input.scoresApproved),
        };
      })
      .filter(Boolean) as DetailedReviewSection[];
  }

  const criteria = input.methodology?.criteria
    ?.slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  if (!criteria?.length) return [];

  const assessmentBySlug = new Map(
    (
      input.review?.criterionAssessments?.length
        ? input.review.criterionAssessments
        : (input.assessment?.criterionAssessments ?? [])
    ).map((c) => [c.criterionSlug, c]),
  );

  const featureSupport = new Map(
    (input.enrichment?.featureSupport ?? []).map((f) => [
      f.featureSlug,
      f,
    ]),
  );

  const sections: DetailedReviewSection[] = [];

  for (const criterion of criteria) {
    const mappedFeatures = CRITERION_FEATURE_MAP[criterion.slug] ?? [];
    const related = mappedFeatures
      .map((slug) => featureSupport.get(slug))
      .filter(Boolean);

    const assessment = assessmentBySlug.get(criterion.slug);
    const publicRationale = publicCopy(assessment?.rationale);

    const availabilities = related.map((f) => f!.availability);
    const qualitative =
      input.scoresApproved && typeof assessment?.score === "number"
        ? labelFromScore(assessment.score)
        : verdictFromAvailability(availabilities);

    if (!related.length && !publicRationale && !assessment) {
      // No researched signal for this criterion — skip rather than filler.
      continue;
    }

    const featureLines = related.map((f) => {
      const name =
        featureNameBySlug.get(f!.featureSlug) ??
        f!.featureSlug.replace(/-/g, " ");
      const availability = f!.availability.replace(/-/g, " ");
      return `${name} is researched as ${availability}.`;
    });

    const summary =
      publicRationale ??
      (featureLines.length
        ? `Based on documented capabilities, ${input.software.name} shows researched support for ${criterion.name.toLowerCase()}.`
        : `Research coverage for ${criterion.name.toLowerCase()} is still limited.`);

    const body: string[] = [];
    if (criterion.description) {
      body.push(
        `We evaluate ${criterion.name.toLowerCase()} as: ${criterion.description}`,
      );
    }
    for (const line of featureLines) body.push(line);
    if (
      input.enrichment?.aiCapabilities?.length &&
      (criterion.slug.includes("automation") || criterion.slug === "reporting")
    ) {
      const ai = input.enrichment.aiCapabilities
        .filter((c) => c.availability !== "unknown")
        .slice(0, 3)
        .map(
          (c) =>
            `${c.capability.replace(/-/g, " ")} is researched as ${c.availability.replace(/-/g, " ")}.`,
        );
      body.push(...ai);
    }

    const evidenceLabels = related.map((f) => {
      const name =
        featureNameBySlug.get(f!.featureSlug) ??
        f!.featureSlug.replace(/-/g, " ");
      return `Product capability research · ${name}`;
    });

    sections.push({
      id: `criterion-${criterion.slug}`,
      criterionSlug: criterion.slug,
      title: criterion.name,
      summary,
      body,
      score:
        input.scoresApproved && typeof assessment?.score === "number"
          ? assessment.score
          : undefined,
      scoreApproved: input.scoresApproved && typeof assessment?.score === "number",
      verdictLabel: qualitative,
      strengths: [],
      weaknesses:
        availabilities.includes("limited") ||
        availabilities.includes("not-supported")
          ? [
              `Some ${criterion.name.toLowerCase()} capabilities are limited or not evidenced in current research.`,
            ]
          : [],
      claimType: publicRationale
        ? "editorial-assessment"
        : "research-inference",
      evidenceLabels,
      competitorsMentioned: [],
    });
  }

  return sections;
}

function buildLimitations(input: {
  software: Software;
  assessment: ProductEditorialAssessment | null;
  review: ProductReview | null;
  enrichment: ProductResearchEnrichment | null;
  stored?: LimitationSection[];
}): LimitationSection[] {
  if (input.stored?.length) {
    return input.stored
      .map((item) => {
        const explanation = publicCopy(item.explanation);
        const title = publicCopy(item.title);
        if (!explanation || !title) return null;
        return { ...item, title, explanation };
      })
      .filter(Boolean) as LimitationSection[];
  }

  const fromReview = (input.review?.limitations ?? [])
    .map((text, index) => {
      const explanation = publicCopy(text);
      if (!explanation) return null;
      return {
        id: `limitation-review-${index}`,
        title: explanation.split(/[.:—]/)[0]?.trim() || "Limitation",
        explanation,
        claimType: "editorial-assessment" as const,
      };
    })
    .filter(Boolean) as LimitationSection[];

  if (fromReview.length) return fromReview;

  const fromWeaknesses = (input.assessment?.weaknesses ?? [])
    .map((text, index) => {
      const explanation = publicCopy(text);
      if (!explanation) return null;
      const altMatch = explanation.match(/\((?:evaluate|consider)\s+([^)]+)\)/i);
      return {
        id: `limitation-weakness-${index}`,
        title: explanation.split(/[.:—]/)[0]?.trim() || "Trade-off",
        explanation,
        whoItAffects: undefined,
        alternativeName: altMatch?.[1]?.trim(),
        claimType: "editorial-assessment" as const,
      };
    })
    .filter(Boolean) as LimitationSection[];

  const fromEnrichment = (input.enrichment?.limitations ?? [])
    .map((item, index) => {
      const explanation = publicCopy(item.description);
      if (!explanation) return null;
      return {
        id: `limitation-enrichment-${index}`,
        title: item.kind.replace(/-/g, " "),
        explanation,
        claimType: "verified-fact" as const,
      };
    })
    .filter(Boolean) as LimitationSection[];

  const limitedFeatures = (input.enrichment?.featureSupport ?? [])
    .filter((f) => f.availability === "limited" || f.availability === "not-supported")
    .slice(0, 4)
    .map((f, index) => {
      const name =
        featureNameBySlug.get(f.featureSlug) ??
        f.featureSlug.replace(/-/g, " ");
      return {
        id: `limitation-feature-${index}`,
        title: `${name} is ${f.availability.replace(/-/g, " ")}`,
        explanation: `Researched product data marks ${name} as ${f.availability.replace(/-/g, " ")} for ${input.software.name}. Teams that rely on this capability should verify plan coverage and compare alternatives.`,
        claimType: "verified-fact" as const,
      };
    });

  return [...fromWeaknesses, ...fromEnrichment, ...limitedFeatures].slice(0, 6);
}

function buildPlanRecommendations(input: {
  pricing: Pricing | null;
  stored?: PlanRecommendation[];
}): PlanRecommendation[] {
  if (input.stored?.length) return input.stored;
  const plans = input.pricing?.plans ?? [];
  if (plans.length === 0) return [];

  return plans.map((plan: PricingPlan, index: number) => {
    const next = plans[index + 1];
    const lower = plan.name.toLowerCase();
    const chooseIf: string[] = [];
    const bestFor: string[] = [];
    const upgradeWhen: string[] = [];

    if (plan.isFree) {
      bestFor.push("Evaluating the product with no paid seats");
      chooseIf.push("You only need a lightweight trial of core workflows");
    } else if (lower.includes("essential") || lower.includes("starter") || index === 0) {
      bestFor.push("Small teams starting with core workflows");
      chooseIf.push("You need foundational pipeline/deal tools without advanced add-ons");
    } else if (lower.includes("advanced") || lower.includes("growth")) {
      bestFor.push("Growing teams that need richer daily workflows");
      chooseIf.push("You need more automation or communication tooling than the entry plan");
    } else if (lower.includes("professional") || lower.includes("business")) {
      bestFor.push("Teams that need deeper reporting and process controls");
      chooseIf.push("Reporting, forecasting, or admin controls are becoming requirements");
    } else if (lower.includes("power") || lower.includes("premium")) {
      bestFor.push("Teams with advanced workflow and scale needs");
      chooseIf.push("You have outgrown mid-tier reporting or automation limits");
    } else if (plan.contactSales || lower.includes("enterprise")) {
      bestFor.push("Organizations needing custom commercial terms");
      chooseIf.push("You need enterprise procurement, security review, or custom packaging");
    } else {
      bestFor.push(`${plan.name} buyers`);
      chooseIf.push(`Your requirements align with the ${plan.name} tier`);
    }

    if (next) {
      upgradeWhen.push(`Requirements exceed what ${plan.name} is designed to cover`);
      upgradeWhen.push(`You need capabilities associated with ${next.name}`);
    }

    return {
      planSlug: plan.slug,
      planName: plan.name,
      bestFor,
      chooseIf,
      skipIf: plan.contactSales
        ? ["You only need a self-serve starter plan"]
        : [],
      upgradeWhen,
    };
  });
}

function buildCompetitorDeepDives(input: {
  software: Software;
  stored?: CompetitorDeepDive[];
}): CompetitorDeepDive[] {
  if (input.stored?.length) {
    return input.stored
      .map((item) => {
        const headline = publicCopy(item.headline);
        const keyDifference = publicCopy(item.keyDifference);
        if (!headline || !keyDifference) return null;
        return {
          ...item,
          headline,
          keyDifference,
          summary: publicCopy(item.summary) ?? undefined,
          chooseCurrentIf: item.chooseCurrentIf
            .map((s) => publicCopy(s))
            .filter(Boolean) as string[],
          chooseCompetitorIf: item.chooseCompetitorIf
            .map((s) => publicCopy(s))
            .filter(Boolean) as string[],
        };
      })
      .filter(Boolean) as CompetitorDeepDive[];
  }

  const comparisons = getAllComparisonsUnfiltered().filter(
    (c: Comparison) =>
      c.productSlugs.includes(input.software.slug) &&
      (c.outcomes?.length ?? 0) > 0,
  );

  const dives: CompetitorDeepDive[] = [];

  for (const comparison of comparisons.slice(0, 3)) {
    const competitorSlug = comparison.productSlugs.find(
      (slug) => slug !== input.software.slug,
    );
    if (!competitorSlug) continue;
    const competitor = getSoftwareBySlug(competitorSlug);
    if (!competitor) continue;

    const forCurrent =
      comparison.bestFor.find((b) => b.productSlug === input.software.slug)
        ?.scenarios ?? [];
    const forCompetitor =
      comparison.bestFor.find((b) => b.productSlug === competitorSlug)
        ?.scenarios ?? [];

    const headline = firstPublicCopy([
      comparison.title,
      `${input.software.name} vs ${competitor.name}`,
    ]);
    const publicScenariosCurrent = forCurrent
      .map((s) => publicCopy(s))
      .filter(Boolean) as string[];
    const publicScenariosCompetitor = forCompetitor
      .map((s) => publicCopy(s))
      .filter(Boolean) as string[];
    if (
      publicScenariosCurrent.length === 0 &&
      publicScenariosCompetitor.length === 0
    ) {
      continue;
    }
    const keyDifference =
      firstPublicCopy([comparison.summary, comparison.verdict]) ??
      (publicScenariosCurrent[0] && publicScenariosCompetitor[0]
        ? `${input.software.name} fits ${publicScenariosCurrent[0].toLowerCase()}; ${competitor.name} fits ${publicScenariosCompetitor[0].toLowerCase()}.`
        : publicScenariosCurrent[0]
          ? `${input.software.name} is a stronger fit when ${publicScenariosCurrent[0].toLowerCase()}.`
          : null);
    if (!headline || !keyDifference) continue;

    dives.push({
      competitorSlug,
      competitorName: competitor.name,
      competitorLogo: competitor.logo,
      headline,
      chooseCurrentIf: publicScenariosCurrent,
      chooseCompetitorIf: publicScenariosCompetitor,
      keyDifference,
      summary: publicCopy(comparison.summary) ?? undefined,
      comparisonHref: `/compare/${comparison.slug}/`,
    });
  }

  return dives;
}

function buildFinalVerdict(input: {
  software: Software;
  bestFor: string[];
  notIdealFor: string[];
  recommendation: string | null;
  stored?: FinalVerdict;
}): FinalVerdict | null {
  if (input.stored?.body?.length) {
    const body = input.stored.body
      .map((p) => publicCopy(p))
      .filter(Boolean) as string[];
    if (!body.length) return null;
    return {
      chooseIf: input.stored.chooseIf
        .map((s) => publicCopy(s))
        .filter(Boolean) as string[],
      considerOtherIf: input.stored.considerOtherIf
        .map((s) => publicCopy(s))
        .filter(Boolean) as string[],
      body,
    };
  }

  if (
    input.bestFor.length === 0 &&
    input.notIdealFor.length === 0 &&
    !input.recommendation
  ) {
    return null;
  }

  const body: string[] = [];
  if (input.recommendation) body.push(input.recommendation);
  body.push(
    `${input.software.name} is strongest when your buying criteria match the fit notes above — not as a universal default for every team.`,
  );
  if (input.notIdealFor[0]) {
    body.push(
      `If ${input.notIdealFor[0].toLowerCase()}, compare alternatives before committing.`,
    );
  }

  return {
    chooseIf: input.bestFor.slice(0, 4),
    considerOtherIf: input.notIdealFor.slice(0, 4),
    body,
  };
}

function buildWhyWeLike(input: {
  software: Software;
  strengths: string[];
  positioning: string | null;
  stored?: string[];
  keyTakeawayStored?: string;
}): { paragraphs: string[]; keyTakeaway: string | null } {
  if (input.stored?.length) {
    const paragraphs = input.stored
      .map((p) => publicCopy(p))
      .filter(Boolean) as string[];
    return {
      paragraphs,
      keyTakeaway: publicCopy(input.keyTakeawayStored),
    };
  }

  const paragraphs: string[] = [];
  if (input.positioning) {
    paragraphs.push(
      `${input.software.name} is positioned around ${input.positioning.replace(/\.$/, "")}. That focus is useful when buyers want a clear primary job rather than an everything-platform.`,
    );
  }
  for (const strength of input.strengths.slice(0, 3)) {
    paragraphs.push(strength);
  }
  if (paragraphs.length === 0) {
    return { paragraphs: [], keyTakeaway: null };
  }

  return {
    paragraphs,
    keyTakeaway: input.strengths[0] ?? input.positioning,
  };
}

export function buildDeepReviewLayer(input: {
  software: Software;
  enrichment: ProductResearchEnrichment | null;
  assessment: ProductEditorialAssessment | null;
  review: ProductReview | null;
  methodology: Methodology | null;
  pricing: Pricing | null;
  scoresApproved: boolean;
  bestFor: string[];
  notIdealFor: string[];
  pros: string[];
}): DeepReviewLayer {
  const stored = input.review?.deepReview;

  const productExperience = buildProductExperience({
    software: input.software,
    enrichment: input.enrichment,
    stored: stored?.productExperience,
  });

  const detailedSections = buildDetailedSections({
    software: input.software,
    methodology: input.methodology,
    assessment: input.assessment,
    review: input.review,
    enrichment: input.enrichment,
    scoresApproved: input.scoresApproved,
    stored: stored?.detailedSections,
  });

  const limitations = buildLimitations({
    software: input.software,
    assessment: input.assessment,
    review: input.review,
    enrichment: input.enrichment,
    stored: stored?.limitations,
  });

  const planRecommendations = buildPlanRecommendations({
    pricing: input.pricing,
    stored: stored?.planRecommendations,
  });

  const competitorDeepDives = buildCompetitorDeepDives({
    software: input.software,
    stored: stored?.competitorDeepDives,
  });

  const recommendation = firstPublicCopy([
    input.review?.verdict,
    input.assessment?.recommendation,
  ]);

  const finalVerdict = buildFinalVerdict({
    software: input.software,
    bestFor: input.bestFor,
    notIdealFor: input.notIdealFor,
    recommendation,
    stored: stored?.finalVerdict,
  });

  const why = buildWhyWeLike({
    software: input.software,
    strengths: input.pros,
    positioning: firstPublicCopy([
      input.enrichment?.vendorPositioning?.[0]?.claim,
      input.enrichment?.shortDescription,
      input.software.shortDescription,
    ]),
    stored: stored?.whyWeLike,
    keyTakeawayStored: stored?.keyTakeaway,
  });

  const criteriaCount = input.methodology?.criteria.length ?? 0;
  const coverage: ReviewCoverage = {
    productOverview: coverageState(
      Boolean(input.enrichment?.shortDescription || input.software.shortDescription),
      false,
    ),
    editorialVerdict: coverageState(
      Boolean(finalVerdict && input.scoresApproved),
      Boolean(finalVerdict),
    ),
    majorCriteria: coverageState(
      criteriaCount > 0 && detailedSections.length >= Math.ceil(criteriaCount * 0.7),
      detailedSections.length > 0,
      criteriaCount > 0,
    ),
    pricing: coverageState(Boolean(input.pricing?.plans?.length), Boolean(input.pricing)),
    planSelection: coverageState(
      planRecommendations.length >= 2,
      planRecommendations.length > 0,
    ),
    alternatives: coverageState(
      input.software.alternativeSlugs.length >= 3,
      input.software.alternativeSlugs.length > 0,
    ),
    competitorContext: coverageState(
      competitorDeepDives.length >= 1,
      competitorDeepDives.length > 0 || input.software.competitorSlugs.length > 0,
    ),
    limitations: coverageState(limitations.length >= 2, limitations.length > 0),
    researchTransparency: coverageState(
      Boolean(input.enrichment || input.assessment),
      Boolean(input.enrichment || input.assessment),
    ),
    productExperience: coverageState(
      Boolean(productExperience && productExperience.workflowSteps.length >= 4),
      Boolean(productExperience),
      Boolean(WORKFLOW_BY_CATEGORY[input.software.primaryCategorySlug]),
    ),
  };

  const updateHistory: Array<{ date: string; label: string }> = [];
  const pricingChecked = input.enrichment?.domainCheckedAt?.pricing;
  const featuresChecked = input.enrichment?.domainCheckedAt?.features;
  if (pricingChecked) {
    updateHistory.push({
      date: pricingChecked.slice(0, 10),
      label: "Pricing research refreshed",
    });
  }
  if (featuresChecked) {
    updateHistory.push({
      date: featuresChecked.slice(0, 10),
      label: "Feature research refreshed",
    });
  }
  if (input.assessment?.updatedAt) {
    updateHistory.push({
      date: input.assessment.updatedAt.slice(0, 10),
      label: "Editorial assessment updated",
    });
  }

  return {
    productExperience,
    detailedSections,
    limitations,
    planRecommendations,
    competitorDeepDives,
    finalVerdict,
    whyWeLike: why.paragraphs,
    keyTakeaway: why.keyTakeaway,
    whoShouldChoose: publicCopy(input.review?.whoShouldChoose),
    whoShouldSkip: publicCopy(input.review?.whoShouldConsiderAlternatives),
    coverage,
    updateHistory,
  };
}
