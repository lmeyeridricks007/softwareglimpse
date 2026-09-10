import { describe, expect, it } from "vitest";
import {
  classifyPositionBand,
  selectLaneAGscImprovePages,
} from "@/services/seo/lane-a-gsc-improve/select";

describe("lane-a-gsc-improve select", () => {
  it("classifies hard position bands", () => {
    expect(classifyPositionBand(12, 40, "software")).toBe("8-20");
    expect(classifyPositionBand(25, 40, "software")).toBe("21-30");
    expect(classifyPositionBand(40, 60, "software")).toBe("31-50");
    expect(classifyPositionBand(40, 20, "software")).toBe("excluded");
    expect(classifyPositionBand(70, 200, "software")).toBe("50+-commercial");
    expect(classifyPositionBand(70, 200, "guide")).toBe("excluded");
    expect(classifyPositionBand(5, 100, "software")).toBe("excluded");
  });

  it("selects up to 30 Lane A pages from real GSC without inventing demand", () => {
    const { selected, bandCounts, gscProvenance } = selectLaneAGscImprovePages(30);
    if (!gscProvenance) {
      expect(selected.length).toBe(0);
      return;
    }
    expect(selected.length).toBeGreaterThan(0);
    expect(selected.length).toBeLessThanOrEqual(30);
    expect(selected.every((s) => s.lane === "A")).toBe(true);
    expect(selected.every((s) => s.impressions >= 10 || s.clicks > 0)).toBe(
      true,
    );
    const sum = Object.values(bandCounts).reduce((a, b) => a + b, 0);
    expect(sum).toBe(selected.length);
  });
});
