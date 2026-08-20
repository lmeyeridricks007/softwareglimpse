import { describe, expect, it } from "vitest";
import {
  CWV_TARGETS,
  PERFORMANCE_BUDGETS,
  REPRESENTATIVE_ROUTES,
} from "@/performance/budgets";

describe("performance budgets", () => {
  it("defines CWV targets matching product goals", () => {
    expect(CWV_TARGETS.lcpMs).toBeLessThanOrEqual(2500);
    expect(CWV_TARGETS.inpMs).toBeLessThanOrEqual(200);
    expect(CWV_TARGETS.cls).toBeLessThanOrEqual(0.1);
  });

  it("keeps tool budgets higher than content budgets", () => {
    expect(PERFORMANCE_BUDGETS.tool.jsKbMax).toBeGreaterThan(
      PERFORMANCE_BUDGETS.content.jsKbMax,
    );
  });

  it("covers required representative page families", () => {
    const labels = new Set(REPRESENTATIVE_ROUTES.map((r) => r.label));
    for (const required of [
      "Homepage",
      "CRM hub",
      "Product",
      "Comparison",
      "Guide",
      "Finder",
      "TCO",
      "Migration Planner",
    ]) {
      expect(labels.has(required)).toBe(true);
    }
  });
});
