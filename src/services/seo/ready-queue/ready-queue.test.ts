import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  selectReadyQueue,
  reviewReadyPage,
} from "@/services/seo/ready-queue";
import { resetContentLifecycleCache } from "@/services/seo/content-lifecycle";

describe("ready-queue", () => {
  beforeEach(() => {
    resetContentLifecycleCache();
  });
  afterEach(() => {
    resetContentLifecycleCache();
  });

  it("selects INDEXABLE_READY pages with ranking scores", () => {
    const queue = selectReadyQueue({ kinds: ["guide"], limit: 10 });
    expect(queue.length).toBeGreaterThan(0);
    expect(queue.length).toBeLessThanOrEqual(10);
    for (const c of queue) {
      expect(c.kind).toBe("guide");
      expect(c.rankingScore).toBeGreaterThanOrEqual(0);
      expect(c.path).toMatch(/^\/guides\//);
    }
    // Sorted descending
    for (let i = 1; i < queue.length; i++) {
      expect(queue[i - 1]!.rankingScore).toBeGreaterThanOrEqual(
        queue[i]!.rankingScore,
      );
    }
  }, 120_000);

  it("reviews a candidate without promoting on dry-run", () => {
    const queue = selectReadyQueue({ kinds: ["guide"], limit: 1 });
    expect(queue[0]).toBeTruthy();
    const result = reviewReadyPage(queue[0]!, { apply: false });
    expect([
      "PROMOTED",
      "REMAIN_READY",
      "BACK_TO_IMPROVE",
      "MANUAL_REVIEW",
      "SKIPPED",
    ]).toContain(result.outcome);
    // Dry-run PROMOTED means would-promote, not persisted
    if (result.outcome === "PROMOTED") {
      expect(result.reason).toMatch(/dry-run|Would promote/i);
    }
  }, 120_000);
});
