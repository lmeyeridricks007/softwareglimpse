import { describe, expect, it } from "vitest";
import {
  buildImplementationEstimateTemplates,
  buildMigrationEstimateTemplates,
  adminHoursWeekPresets,
  trainingHoursPerUserPresets,
} from "./estimate-helpers";

describe("buildMigrationEstimateTemplates", () => {
  it("returns no templates when migration is none or unknown", () => {
    expect(
      buildMigrationEstimateTemplates({ needed: "none", users: 25 }),
    ).toHaveLength(0);
    expect(
      buildMigrationEstimateTemplates({ needed: "unknown", users: 25 }),
    ).toHaveLength(0);
  });

  it("scales mid template with users and keeps lean < mid < heavy", () => {
    const templates = buildMigrationEstimateTemplates({
      needed: "basic",
      users: 25,
    });
    expect(templates).toHaveLength(3);
    const lean = templates.find((t) => t.id === "lean")!;
    const mid = templates.find((t) => t.id === "mid")!;
    const heavy = templates.find((t) => t.id === "heavy")!;
    expect(lean.externalMajor).toBeLessThan(mid.externalMajor);
    expect(mid.externalMajor).toBeLessThan(heavy.externalMajor);
    expect(mid.externalMajor).toBe(25 * 80);
    expect(mid.internalHours).toBe(50);
  });
});

describe("buildImplementationEstimateTemplates", () => {
  it("builds lean/mid/heavy for partner approach", () => {
    const templates = buildImplementationEstimateTemplates({
      approach: "partner",
      users: 25,
    });
    expect(templates.map((t) => t.id)).toEqual(["lean", "mid", "heavy"]);
    expect(templates[1]!.externalMajor).toBe(25 * 320);
  });
});

describe("admin and training presets", () => {
  it("scales admin hours with users", () => {
    const presets = adminHoursWeekPresets(25);
    expect(presets).toHaveLength(3);
    expect(presets[0]!.hoursPerWeek).toBeLessThan(presets[1]!.hoursPerWeek);
    expect(presets[1]!.hoursPerWeek).toBeLessThan(presets[2]!.hoursPerWeek);
  });

  it("offers training hour presets", () => {
    expect(trainingHoursPerUserPresets().map((p) => p.hoursPerUser)).toEqual([
      1, 3, 6,
    ]);
  });
});
