import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ContentQualityGateResult } from "@/services/content-quality/gate/types";
import {
  appendQualitySnapshot,
  computeWeeklyQualityVelocity,
  deltaBetween,
  detectQualityRegression,
  latestSnapshot,
  loadQualitySnapshotStore,
  previousSnapshot,
  recordQualitySnapshot,
  snapshotFromGateResult,
} from "@/services/content-quality/gate/snapshots";

function gateResult(
  overrides: Partial<ContentQualityGateResult> &
    Pick<ContentQualityGateResult, "path" | "qualityScore">,
): ContentQualityGateResult {
  return {
    version: "1.1.0",
    pageType: "guide",
    path: overrides.path,
    slug: overrides.slug ?? "demo",
    title: overrides.title ?? "Demo",
    qualityScore: overrides.qualityScore,
    dimensions: overrides.dimensions ?? [
      {
        id: "freshness",
        label: "Freshness",
        score: 80,
        weight: 1,
        explanation: "",
        evidence: [],
      },
      {
        id: "uniqueValue",
        label: "Unique",
        score: 70,
        weight: 1,
        explanation: "",
        evidence: [],
      },
    ],
    failures: overrides.failures ?? [],
    warnings: overrides.warnings ?? [],
    requiredImprovements: [],
    recommendedImprovements: [],
    lifecycleState: overrides.lifecycleState ?? "IMPROVE",
    indexEligible: overrides.indexEligible ?? false,
    evaluatedAt: overrides.evaluatedAt ?? "2026-09-06T12:00:00.000Z",
  };
}

describe("quality observation snapshots", () => {
  let tempDir: string | undefined;

  afterEach(() => {
    if (tempDir) rmSync(tempDir, { recursive: true, force: true });
    tempDir = undefined;
  });

  it("appends snapshots without rewriting prior observations", () => {
    tempDir = mkdtempSync(path.join(tmpdir(), "sg-qsnap-"));
    const a = snapshotFromGateResult(
      gateResult({
        path: "/guides/a/",
        qualityScore: 60,
        evaluatedAt: "2026-09-01T10:00:00.000Z",
      }),
      { sourceEvent: "first_analyzed" },
    );
    const b = snapshotFromGateResult(
      gateResult({
        path: "/guides/a/",
        qualityScore: 80,
        evaluatedAt: "2026-09-06T10:00:00.000Z",
        indexEligible: true,
        lifecycleState: "INDEXABLE",
      }),
      { sourceEvent: "enriched" },
    );

    appendQualitySnapshot(a, { cwd: tempDir, persist: true });
    appendQualitySnapshot(b, { cwd: tempDir, persist: true });
    appendQualitySnapshot(a, { cwd: tempDir, persist: true });

    const store = loadQualitySnapshotStore(tempDir);
    expect(store.snapshots).toHaveLength(2);
    expect(store.snapshots[0]?.qualityScore).toBe(60);
    expect(store.snapshots[1]?.qualityScore).toBe(80);

    const raw = JSON.parse(
      readFileSync(
        path.join(tempDir, "data/seo/content-quality-gate-history.json"),
        "utf8",
      ),
    ) as { snapshots: unknown[] };
    expect(raw.snapshots).toHaveLength(2);
  });

  it("computes before/after helpers and weekly velocity", () => {
    tempDir = mkdtempSync(path.join(tmpdir(), "sg-qsnap-"));
    recordQualitySnapshot({
      result: gateResult({
        path: "/guides/b/",
        qualityScore: 55,
        evaluatedAt: "2026-09-01T08:00:00.000Z",
      }),
      sourceEvent: "first_analyzed",
      cwd: tempDir,
      persist: true,
      detectRegression: false,
    });
    recordQualitySnapshot({
      result: gateResult({
        path: "/guides/b/",
        qualityScore: 88,
        evaluatedAt: "2026-09-06T08:00:00.000Z",
        indexEligible: true,
        lifecycleState: "INDEXABLE",
      }),
      sourceEvent: "enriched",
      cwd: tempDir,
      persist: true,
      detectRegression: false,
    });
    recordQualitySnapshot({
      result: gateResult({
        path: "/guides/b/",
        qualityScore: 90,
        evaluatedAt: "2026-09-06T09:00:00.000Z",
        indexEligible: true,
        lifecycleState: "INDEXABLE",
      }),
      sourceEvent: "promoted",
      cwd: tempDir,
      persist: true,
      detectRegression: false,
    });

    expect(latestSnapshot("/guides/b/", tempDir)?.qualityScore).toBe(90);
    expect(previousSnapshot("/guides/b/", tempDir)?.qualityScore).toBe(88);
    const d = deltaBetween(
      previousSnapshot("/guides/b/", tempDir)!,
      latestSnapshot("/guides/b/", tempDir)!,
    );
    expect(d.scoreDelta).toBe(2);

    const weekly = computeWeeklyQualityVelocity({
      cwd: tempDir,
      now: Date.parse("2026-09-06T12:00:00.000Z"),
      windowMs: 7 * 24 * 60 * 60 * 1000,
    });
    expect(weekly.pagesImproved).toBeGreaterThanOrEqual(1);
    expect(weekly.pagesPromoted).toBe(1);
    expect(weekly.averageQualityDelta).not.toBeNull();
    expect(weekly.largestImprovements[0]?.url).toBe("/guides/b/");
    expect(weekly.promotionConversionRate).toBeGreaterThan(0);
  });

  it("flags QUALITY_REGRESSION without auto-deindex", () => {
    tempDir = mkdtempSync(path.join(tmpdir(), "sg-qsnap-"));
    const strong = snapshotFromGateResult(
      gateResult({
        path: "/guides/c/",
        qualityScore: 92,
        indexEligible: true,
        lifecycleState: "INDEXABLE",
        evaluatedAt: "2026-09-01T00:00:00.000Z",
        dimensions: [
          {
            id: "freshness",
            label: "Freshness",
            score: 90,
            weight: 1,
            explanation: "",
            evidence: [],
          },
        ],
      }),
      { sourceEvent: "promoted" },
    );
    appendQualitySnapshot(strong, { cwd: tempDir, persist: true });

    const weak = snapshotFromGateResult(
      gateResult({
        path: "/guides/c/",
        qualityScore: 55,
        indexEligible: false,
        lifecycleState: "IMPROVE",
        evaluatedAt: "2026-09-06T00:00:00.000Z",
        dimensions: [
          {
            id: "freshness",
            label: "Freshness",
            score: 40,
            weight: 1,
            explanation: "",
            evidence: [],
          },
        ],
      }),
      { sourceEvent: "analyzed" },
    );
    const flag = detectQualityRegression(weak, strong, {
      cwd: tempDir,
      persist: true,
    });
    expect(flag?.code).toBe("QUALITY_REGRESSION");
    expect(flag?.autoDeindex).toBe(false);
    expect(loadQualitySnapshotStore(tempDir).regressions).toHaveLength(1);
  });

  it("backfills snapshots from legacy records once", () => {
    tempDir = mkdtempSync(path.join(tmpdir(), "sg-qsnap-"));
    const histDir = path.join(tempDir, "data/seo");
    mkdirSync(histDir, { recursive: true });
    writeFileSync(
      path.join(histDir, "content-quality-gate-history.json"),
      JSON.stringify(
        {
          version: "1.1.0",
          updatedAt: "2026-09-06T00:00:00.000Z",
          records: [
            {
              path: "/guides/legacy/",
              pageType: "guide",
              slug: "legacy",
              phase: "analyze",
              recordedAt: "2026-09-05T00:00:00.000Z",
              result: gateResult({
                path: "/guides/legacy/",
                slug: "legacy",
                qualityScore: 71,
                evaluatedAt: "2026-09-05T00:00:00.000Z",
              }),
            },
          ],
        },
        null,
        2,
      ),
      "utf8",
    );

    const store = loadQualitySnapshotStore(tempDir);
    expect(store.snapshots.length).toBeGreaterThanOrEqual(1);
    expect(store.snapshots[0]?.url).toBe("/guides/legacy/");
    expect(store.snapshots[0]?.sourceEvent).toBe("analyzed");

    // Second load must not rewrite / duplicate
    const again = loadQualitySnapshotStore(tempDir);
    expect(again.snapshots).toHaveLength(store.snapshots.length);
  });
});
