import { describe, expect, it } from "vitest";
import { computeFactoryRemediationKpis } from "./factory-kpis";

describe("factory remediation KPIs", () => {
  it("treats origin total as inventory — quality pass does not shrink it", () => {
    const rows = [
      {
        metrics: { factoryPackKind: "setup", qualityGateOk: false },
        reasons: ["high-near-duplicate-risk", "limited-unique-analysis-signals"],
        lifecycle: "IMPROVE",
      },
      {
        metrics: { factoryPackKind: "setup", qualityGateOk: true },
        reasons: [],
        lifecycle: "INDEXABLE",
      },
      {
        metrics: { factoryPackKind: null, qualityGateOk: true },
        reasons: ["high-near-duplicate-risk"],
        lifecycle: "INDEXABLE",
      },
    ];
    const before = computeFactoryRemediationKpis(rows);
    expect(before.originTotal).toBe(2);
    expect(before.highRisk).toBe(1);
    expect(before.limitedUnique).toBe(1);
    expect(before.qualityPass).toBe(1);
    expect(before.indexable).toBe(1);
    expect(before.improve).toBe(1);
    expect(before.promoted).toBe(1);

    const afterExcellent = computeFactoryRemediationKpis(
      rows.map((r) =>
        r.metrics.factoryPackKind
          ? {
              ...r,
              metrics: { ...r.metrics, qualityGateOk: true },
              reasons: [],
              lifecycle: "INDEXABLE",
            }
          : r,
      ),
    );
    expect(afterExcellent.originTotal).toBe(2);
    expect(afterExcellent.highRisk).toBe(0);
    expect(afterExcellent.limitedUnique).toBe(0);
    expect(afterExcellent.qualityPass).toBe(2);
    expect(afterExcellent.indexable).toBe(2);
    expect(afterExcellent.improve).toBe(0);
    expect(afterExcellent.promoted).toBe(2);
  });
});
