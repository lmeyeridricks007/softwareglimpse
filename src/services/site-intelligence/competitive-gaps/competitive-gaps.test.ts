import { describe, expect, it } from "vitest";
import {
  analyzeCompetitiveGaps,
  loadCompetitiveGapInputs,
  runCompetitiveGapAgent,
} from "@/services/site-intelligence/competitive-gaps";

describe("CompetitiveGapAgent", () => {
  it("flags both advantages and weaknesses (not competitor-only)", () => {
    const inputs = loadCompetitiveGapInputs({ fixture: true });
    const report = analyzeCompetitiveGaps(inputs, "2026-08-15T15:00:00.000Z");
    expect(report.advantages.length).toBeGreaterThan(0);
    expect(report.queryGaps.length).toBeGreaterThan(0);
    expect(report.topActions.length).toBeGreaterThan(0);
    expect(report.topActions.length).toBeLessThanOrEqual(50);
  });

  it("rejects feature-copy list-volume recommendations for best queries", () => {
    const inputs = loadCompetitiveGapInputs({ fixture: true });
    const report = analyzeCompetitiveGaps(inputs, "2026-08-15T15:00:00.000Z");
    const rejected = [
      ...report.competitorStronger,
      ...report.differentiation,
      ...report.topActions,
    ].filter(
      (x) =>
        ("rejectedFeatureCopy" in x && x.rejectedFeatureCopy) ||
        ("notRecommended" in x &&
          typeof x.notRecommended === "string" &&
          /Top 50|marketplace/i.test(x.notRecommended)),
    );
    expect(rejected.length).toBeGreaterThan(0);
  });

  it("emits query actions including improve/create/no-action vocabulary", async () => {
    const result = await runCompetitiveGapAgent({
      fixture: true,
      write: false,
      archive: false,
      generatedAt: "2026-08-15T15:00:00.000Z",
    });
    expect(result.markdown).toMatch(/Where SoftwareGlimpse is stronger/);
    expect(result.markdown).toMatch(/Where competitors are stronger/);
    expect(result.markdown).toMatch(/Top 50 actions/);
    expect(result.markdown).toMatch(/Missing tools/);
    const actions = new Set(result.report.queryGaps.map((q) => q.action));
    expect(
      [...actions].some((a) =>
        ["improve-existing", "create-new", "no-action", "merge"].includes(a),
      ),
    ).toBe(true);
  });
});
