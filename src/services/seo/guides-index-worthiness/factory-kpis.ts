import type { ContentLifecycleState } from "@/services/seo/content-lifecycle";
import type { FactoryRemediationKpis } from "./types";

type FactoryKpiInput = {
  metrics: {
    factoryPackKind: string | null;
    qualityGateOk: boolean;
  };
  reasons: string[];
  lifecycle: ContentLifecycleState | string;
};

/**
 * Factory-origin pages are the five product-pack families
 * (implementation / migration / setup / plans / worth-it) identified by
 * slug-class (`factoryPackKind`). That inventory MUST NOT be treated as a
 * quality KPI — excellent pages remain factory-origin.
 */
export function isFactoryOrigin(e: FactoryKpiInput): boolean {
  return Boolean(e.metrics.factoryPackKind);
}

export function computeFactoryRemediationKpis(
  evaluations: readonly FactoryKpiInput[],
): FactoryRemediationKpis {
  const factory = evaluations.filter(isFactoryOrigin);
  const originTotal = factory.length;
  const highRisk = factory.filter((e) =>
    e.reasons.includes("high-near-duplicate-risk"),
  ).length;
  const limitedUnique = factory.filter((e) =>
    e.reasons.includes("limited-unique-analysis-signals"),
  ).length;
  const qualityPass = factory.filter((e) => e.metrics.qualityGateOk).length;
  const indexable = factory.filter((e) => e.lifecycle === "INDEXABLE").length;
  const improve = factory.filter(
    (e) => e.lifecycle === "IMPROVE" || e.lifecycle === "IMPROVING",
  ).length;
  const promoted = indexable;

  return {
    originTotal,
    highRisk,
    limitedUnique,
    qualityPass,
    indexable,
    improve,
    promoted,
  };
}
