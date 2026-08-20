import type {
  AuditIssue,
  AuditMetrics,
  AuditScope,
  HealthComponent,
  HealthScore,
} from "@/domain";
import {
  assessCategoryMaturity,
  assessProductMaturity,
  clusterCompletionScore,
} from "@/services/catalogue-onboarding/maturity";

/**
 * Internal health score only — formula transparent, never public.
 */
export function computeHealthScore(input: {
  scope: AuditScope;
  issues: AuditIssue[];
  metrics: AuditMetrics;
}): HealthScore {
  const open = input.issues.filter(
    (i) => i.state !== "dismissed" && i.state !== "resolved",
  );
  const criticalPenalty = Math.min(40, open.filter((i) => i.severity === "critical").length * 12);
  const highPenalty = Math.min(30, open.filter((i) => i.severity === "high").length * 4);
  const medPenalty = Math.min(15, open.filter((i) => i.severity === "medium").length * 1);

  const validityScore = Math.max(0, 100 - criticalPenalty - highPenalty);
  const readinessScore = Math.max(
    0,
    100 -
      input.metrics.researchStale * 5 -
      input.metrics.pricingStale * 5 -
      input.metrics.blockersPublication * 8,
  );
  const qualityScore = Math.max(
    0,
    100 - medPenalty - input.metrics.orphanPages * 3 - input.metrics.duplicateIntentWarnings * 4,
  );

  const components: HealthComponent[] = [
    {
      id: "validity",
      label: "Validity",
      score: validityScore,
      weight: 0.4,
      notes: [`critical=${input.metrics.criticalIssues}`],
    },
    {
      id: "readiness",
      label: "Publication readiness",
      score: readinessScore,
      weight: 0.35,
      notes: [
        `researchStale=${input.metrics.researchStale}`,
        `pricingStale=${input.metrics.pricingStale}`,
      ],
    },
    {
      id: "quality",
      label: "Editorial quality",
      score: qualityScore,
      weight: 0.25,
      notes: [`orphans=${input.metrics.orphanPages}`],
    },
  ];

  if (input.scope.kind === "category" && input.scope.id) {
    const maturity = assessCategoryMaturity(input.scope.id);
    const cluster = clusterCompletionScore(input.scope.id);
    components.push({
      id: "category-maturity",
      label: `Category maturity (${maturity})`,
      score: cluster,
      weight: 0,
      notes: ["informational — not in weighted total"],
    });
  }

  if (input.scope.kind === "product" && input.scope.id) {
    const tier = assessProductMaturity(input.scope.id);
    const tierScore =
      {
        TIER_0_CATALOGUE_ONLY: 10,
        TIER_1_IDENTITY_TAXONOMY: 30,
        TIER_2_RESEARCH: 50,
        TIER_3_CORE_PAGE: 70,
        TIER_4_DECISION_ECOSYSTEM: 85,
        TIER_5_FULLY_INTEGRATED: 95,
      }[tier] ?? 0;
    components.push({
      id: "product-maturity",
      label: `Product maturity (${tier})`,
      score: tierScore,
      weight: 0,
      notes: ["Quality-aware: stale/unpublishable pages reduce readiness component"],
    });
  }

  const weighted = components
    .filter((c) => c.weight > 0)
    .reduce((sum, c) => sum + c.score * c.weight, 0);

  return {
    score: Math.round(weighted),
    components,
    formula:
      "0.4*validity + 0.35*readiness + 0.25*quality (penalties from open issues); maturity components informational",
  };
}
