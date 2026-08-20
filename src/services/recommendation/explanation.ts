import type { CrmFinderCriteria } from "@/domain";
import type { BudgetFitLabel, FinderReason, FinderTradeoff } from "@/domain";
import type { ScoredCandidate } from "./types";

export type Explanation = {
  reasons: FinderReason[];
  tradeoffs: FinderTradeoff[];
  unknowns: string[];
};

/**
 * Deterministic reason/tradeoff templates from breakdown evidence.
 * No LLM.
 */
export function explainRecommendation(
  scored: ScoredCandidate,
  criteria: CrmFinderCriteria,
  budgetFit: BudgetFitLabel,
): Explanation {
  const reasons: FinderReason[] = [];
  const tradeoffs: FinderTradeoff[] = [];
  const unknowns: string[] = [...scored.dimensionScores.unknownDimensions];
  const { snapshot, dimensionScores } = scored;
  const name = snapshot.name;

  // Use case
  const primaryFit =
    snapshot.fit.useCaseFits[criteria.primaryUseCaseSlug] ??
    (snapshot.useCaseSlugs.includes(criteria.primaryUseCaseSlug)
      ? "good"
      : undefined);

  if (primaryFit === "strong") {
    reasons.push({
      code: "strong-primary-use-case",
      text: `${name} is a strong fit for ${criteria.primaryUseCaseSlug}.`,
      positive: true,
    });
  } else if (primaryFit === "good") {
    reasons.push({
      code: "good-primary-use-case",
      text: `${name} fits ${criteria.primaryUseCaseSlug} well.`,
      positive: true,
    });
  } else if (primaryFit === "moderate") {
    reasons.push({
      code: "moderate-primary-use-case",
      text: `${name} is a moderate fit for ${criteria.primaryUseCaseSlug}.`,
      positive: true,
    });
  } else if (primaryFit === "weak" || primaryFit === "not-suitable") {
    reasons.push({
      code: "weak-primary-use-case",
      text: `${name} is a weak fit for ${criteria.primaryUseCaseSlug}.`,
      positive: false,
    });
    tradeoffs.push({
      code: "weak-primary-use-case",
      text: `Primary use case ${criteria.primaryUseCaseSlug} is not a strength of ${name}.`,
    });
  }

  const secondaryHits = criteria.secondaryUseCaseSlugs.filter(
    (s) =>
      snapshot.fit.useCaseFits[s] != null ||
      snapshot.useCaseSlugs.includes(s),
  );
  if (secondaryHits.length > 0) {
    reasons.push({
      code: "secondary-use-case-fit",
      text: `Also covers secondary use cases: ${secondaryHits.join(", ")}.`,
      positive: true,
    });
  }

  // Required features
  for (const slug of criteria.requiredFeatureSlugs) {
    const support = snapshot.featureSupport.find((f) => f.slug === slug);
    const availability = support?.availability ?? "unknown";
    if (availability === "supported") {
      reasons.push({
        code: "required-feature-supported",
        text: `Supports required feature ${slug}.`,
        positive: true,
      });
    } else if (availability === "limited") {
      reasons.push({
        code: "required-feature-limited",
        text: `Required feature ${slug} is available with limitations.`,
        positive: false,
      });
      tradeoffs.push({
        code: "required-feature-limited",
        text: `${slug} support is limited.`,
      });
    } else if (availability === "add-on") {
      reasons.push({
        code: "required-feature-add-on",
        text: `Required feature ${slug} may need an add-on.`,
        positive: false,
      });
      tradeoffs.push({
        code: "required-feature-add-on",
        text: `${slug} may require an add-on.`,
      });
    } else if (availability === "higher-plan-only") {
      reasons.push({
        code: "required-feature-higher-plan",
        text: `Required feature ${slug} is on higher plans only.`,
        positive: false,
      });
      tradeoffs.push({
        code: "required-feature-higher-plan",
        text: `${slug} requires a higher plan.`,
      });
    } else if (availability === "unknown") {
      reasons.push({
        code: "required-feature-unknown",
        text: `Support for required feature ${slug} is not yet verified.`,
        positive: false,
      });
      unknowns.push(`feature:${slug}`);
    }
  }

  // Preferred features
  for (const slug of criteria.preferredFeatureSlugs) {
    const support = snapshot.featureSupport.find((f) => f.slug === slug);
    if (!support || support.availability === "unknown") continue;
    if (support.availability === "supported") {
      reasons.push({
        code: "preferred-feature-supported",
        text: `Includes preferred feature ${slug}.`,
        positive: true,
      });
    } else if (
      support.availability === "limited" ||
      support.availability === "add-on" ||
      support.availability === "higher-plan-only"
    ) {
      reasons.push({
        code: "preferred-feature-partial",
        text: `Preferred feature ${slug} is only partially available.`,
        positive: false,
      });
      tradeoffs.push({
        code: "preferred-feature-weak",
        text: `${slug} is not fully supported.`,
      });
    } else if (support.availability === "not-supported") {
      tradeoffs.push({
        code: "preferred-feature-weak",
        text: `Preferred feature ${slug} is not supported.`,
      });
    }
  }

  // Business size
  const sizeFit = snapshot.fit.businessSizeFits[criteria.companySizeSlug];
  if (sizeFit === "strong") {
    reasons.push({
      code: "business-size-strong",
      text: `Strong fit for ${criteria.companySizeSlug} teams.`,
      positive: true,
    });
  } else if (sizeFit === "good") {
    reasons.push({
      code: "business-size-good",
      text: `Good fit for ${criteria.companySizeSlug} teams.`,
      positive: true,
    });
  } else if (sizeFit === "moderate") {
    reasons.push({
      code: "business-size-moderate",
      text: `Moderate fit for ${criteria.companySizeSlug} teams.`,
      positive: true,
    });
  } else if (sizeFit === "unknown" || sizeFit == null) {
    if (dimensionScores.businessSizeFit == null) {
      reasons.push({
        code: "business-size-unknown",
        text: `Business-size fit for ${criteria.companySizeSlug} is not yet assessed.`,
        positive: false,
      });
      tradeoffs.push({
        code: "business-size-uncertain",
        text: `Size fit for ${criteria.companySizeSlug} is uncertain.`,
      });
      unknowns.push(`business-size:${criteria.companySizeSlug}`);
    }
  }

  // Integrations
  if (criteria.preferredIntegrationSlugs.length > 0) {
    if (dimensionScores.integrations == null) {
      reasons.push({
        code: "integration-unknown",
        text: "Preferred integrations are not yet verified for this product.",
        positive: false,
      });
      unknowns.push("integrations");
    } else if (dimensionScores.integrations >= 0.8) {
      reasons.push({
        code: "integration-strong",
        text: "Strong match for preferred integrations.",
        positive: true,
      });
    } else if (dimensionScores.integrations >= 0.4) {
      reasons.push({
        code: "integration-partial",
        text: "Partial match for preferred integrations.",
        positive: false,
      });
    } else {
      tradeoffs.push({
        code: "integration-weak",
        text: "Weak match for preferred integrations.",
      });
    }
  }

  // Priorities
  if (dimensionScores.priorities != null) {
    const ease = snapshot.fit.priorityFits["ease-of-use"];
    const setup = snapshot.fit.priorityFits["fast-setup"];
    const custom = snapshot.fit.priorityFits.customization;
    const admin = snapshot.fit.priorityFits["minimal-admin"];
    if (ease === "strong" && criteria.priorities["ease-of-use"] >= 0.5) {
      reasons.push({
        code: "priority-ease-fit",
        text: `${name} scores well on ease of use.`,
        positive: true,
      });
    }
    if (setup === "strong" && criteria.priorities["fast-setup"] >= 0.5) {
      reasons.push({
        code: "priority-setup-fit",
        text: `${name} is suited to fast setup.`,
        positive: true,
      });
    }
    if (custom === "strong" || custom === "good") {
      if (criteria.priorities.customization >= 0.5) {
        reasons.push({
          code: "priority-customization-fit",
          text: `${name} offers meaningful customization.`,
          positive: true,
        });
      }
    }
    if (
      (custom === "weak" || custom === "not-suitable") &&
      criteria.priorities.customization >= 0.6
    ) {
      tradeoffs.push({
        code: "customization-limited",
        text: `${name} offers limited customization.`,
      });
      tradeoffs.push({
        code: "priority-mismatch",
        text: "Customization priority may not be well met.",
      });
    }
    if (admin === "strong" && criteria.priorities["minimal-admin"] >= 0.5) {
      reasons.push({
        code: "priority-admin-fit",
        text: `${name} tends toward lower admin overhead.`,
        positive: true,
      });
    }
  }

  // Budget
  if (budgetFit === "good") {
    reasons.push({
      code: "budget-good",
      text: "Starting price fits within the selected budget band.",
      positive: true,
    });
  } else if (budgetFit === "tight") {
    reasons.push({
      code: "budget-tight",
      text: "Starting price is near the top of the selected budget band.",
      positive: false,
    });
  } else if (budgetFit === "over") {
    tradeoffs.push({
      code: "budget-over",
      text: "Starting price appears above the selected budget band.",
    });
  } else if (criteria.budgetPerUserMax !== undefined) {
    reasons.push({
      code: "budget-unknown",
      text: "Starting price is not verified — budget fit is unknown.",
      positive: false,
    });
    tradeoffs.push({
      code: "budget-unknown",
      text: "Pricing is not yet verified.",
    });
    unknowns.push("pricing");
  }

  // Business type
  if (criteria.businessTypeSlug) {
    if (dimensionScores.businessTypeFit == null) {
      reasons.push({
        code: "business-type-unknown",
        text: `Business-type fit for ${criteria.businessTypeSlug} is not assessed.`,
        positive: false,
      });
      unknowns.push(`business-type:${criteria.businessTypeSlug}`);
    } else {
      reasons.push({
        code: "business-type-fit",
        text: `Fits ${criteria.businessTypeSlug} profiles.`,
        positive: true,
      });
    }
  }

  if (snapshot.hasFixtureResearch) {
    reasons.push({
      code: "fixture-research",
      text: "Some product data comes from research fixtures and should be verified.",
      positive: false,
    });
  }

  if (snapshot.researchCompleteness < 0.35) {
    reasons.push({
      code: "research-limited",
      text: "Research coverage for this product is still limited.",
      positive: false,
    });
    tradeoffs.push({
      code: "research-incomplete",
      text: "Limited research completeness reduces recommendation confidence.",
    });
  }

  return {
    reasons: dedupeReasons(reasons),
    tradeoffs: dedupeTradeoffs(tradeoffs),
    unknowns: [...new Set(unknowns)],
  };
}

function dedupeReasons(reasons: FinderReason[]): FinderReason[] {
  const seen = new Set<string>();
  return reasons.filter((r) => {
    const key = `${r.code}:${r.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeTradeoffs(tradeoffs: FinderTradeoff[]): FinderTradeoff[] {
  const seen = new Set<string>();
  return tradeoffs.filter((t) => {
    const key = `${t.code}:${t.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
