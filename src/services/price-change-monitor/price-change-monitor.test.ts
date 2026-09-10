import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { classifyPriceChangeConfidence } from "@/services/price-change-monitor/confidence";
import { buildEditorialCandidates } from "@/services/price-change-monitor/editorial";
import { formatWeeklyPriceChangesMarkdown } from "@/services/price-change-monitor/report";
import { applyGrowthSignalsToRefreshCandidates } from "@/services/price-change-monitor/growth-feed-apply";
import { resolvePriceChangeImpactPages } from "@/services/price-change-monitor/impact";
import { buildPriceMonitorQueue } from "@/services/price-change-monitor/queue";
import { orderPriceRefreshPages } from "@/services/price-change-monitor/refresh-order";
import { buildPricingVerificationTask } from "@/services/price-change-monitor/verification-task-build";
import {
  markPagesOutdatedPricing,
  isPathOutdatedPricing,
  clearOutdatedPricingForProduct,
} from "@/services/price-change-monitor/stale-marking";
import { assertPricingConsistency } from "@/services/price-change-monitor/consistency";
import { detectPriceChangesForProduct } from "@/services/price-change-monitor/detect";
import { buildContentId } from "@/domain";
import type { DetectedPriceChange } from "@/domain";

describe("price change monitor confidence", () => {
  it("never CONFIRMs verify-live or structural free-tier removal", () => {
    const live = classifyPriceChangeConfidence({
      kind: "plan_price_increase",
      percentageChange: 5,
      deterministicSource: true,
      verifyLiveFlag: true,
    });
    expect(live.confidence).toBe("REQUIRES_REVIEW");

    const free = classifyPriceChangeConfidence({
      kind: "free_plan_removed",
      deterministicSource: true,
    });
    expect(free.confidence).toBe("REQUIRES_REVIEW");
    expect(free.requiresHumanVerification).toBe(true);
  });

  it("CONFIRMs small deterministic numeric moves only", () => {
    const ok = classifyPriceChangeConfidence({
      kind: "plan_price_increase",
      percentageChange: 5,
      absoluteChange: 2,
      deterministicSource: true,
    });
    expect(ok.confidence).toBe("CONFIRMED");
    expect(ok.requiresHumanVerification).toBe(false);
  });

  it("marks large deterministic moves as REQUIRES_REVIEW", () => {
    const big = classifyPriceChangeConfidence({
      kind: "plan_price_increase",
      percentageChange: 25,
      absoluteChange: 20,
      deterministicSource: true,
    });
    expect(big.confidence).toBe("REQUIRES_REVIEW");
    expect(big.noteworthy).toBe(true);
  });
});

describe("price change monitor queue + impact", () => {
  it("builds a prioritized HIGH/MEDIUM/LOW queue", () => {
    const queue = buildPriceMonitorQueue(10);
    expect(queue.items.length).toBeGreaterThan(0);
    expect(queue.items.length).toBeLessThanOrEqual(10);
    for (const item of queue.items) {
      expect(["HIGH", "MEDIUM", "LOW"]).toContain(item.frequency);
      expect(item.rank).toBeGreaterThan(0);
    }
  });

  it("resolves impact pages including research", () => {
    const pages = resolvePriceChangeImpactPages("pipedrive");
    expect(pages.some((p) => p.path === "/software/pipedrive/")).toBe(true);
    expect(pages.some((p) => p.path.startsWith("/research"))).toBe(true);
  });

  it("orders refresh pages by dependency tier", () => {
    const ordered = orderPriceRefreshPages(
      resolvePriceChangeImpactPages("pipedrive"),
    );
    expect(ordered[0]?.pageType).toBe("pricing");
    const tiers = ordered.map((p) => p.refreshTier);
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i]!).toBeGreaterThanOrEqual(tiers[i - 1]!);
    }
  });
});

describe("verification + stale + consistency", () => {
  const sampleChange: DetectedPriceChange = {
    productId: "pipedrive",
    productName: "Pipedrive",
    kind: "plan_price_increase",
    confidence: "REQUIRES_REVIEW",
    summary: "Pipedrive: plan price increase (14 → 20 USD)",
    previousPrice: 14,
    newPrice: 20,
    absoluteChange: 6,
    percentageChange: 42.8,
    planId: null,
    planName: "Lite",
    requiresHumanVerification: true,
    validationNotes: ["large move"],
    noteworthy: true,
  };

  it("builds a human verification task with required fields", () => {
    const task = buildPricingVerificationTask(sampleChange);
    expect(task).not.toBeNull();
    expect(task!.publishBlocked).toBe(true);
    expect(task!.status).toBe("pending");
    expect(task!.source.label.length).toBeGreaterThan(0);
    expect(task!.difference.summary).toContain("Pipedrive");
    expect(task!.affectedPlans.length).toBeGreaterThan(0);
    expect(task!.affectedPages.length).toBeGreaterThan(0);
    expect(task!.affectedPages[0]!.refreshTier).toBeLessThanOrEqual(
      task!.affectedPages.at(-1)!.refreshTier,
    );
  });

  it("marks OUTDATED_PRICING without auto-clear", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "sg-outdated-"));
    try {
      const pages = resolvePriceChangeImpactPages("pipedrive").slice(0, 3);
      markPagesOutdatedPricing(pages, {
        productId: "pipedrive",
        reason: "test outdated",
        confidence: "REQUIRES_REVIEW",
        cwd,
      });
      const mark = isPathOutdatedPricing(pages[0]!.path, { cwd });
      expect(mark?.code).toBe("OUTDATED_PRICING");
      expect(mark?.visibleFreshnessRequired).toBe(true);
      expect(mark?.clearedAt).toBeNull();
      clearOutdatedPricingForProduct("pipedrive", { cwd });
      expect(isPathOutdatedPricing(pages[0]!.path, { cwd })).toBeNull();
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("keeps plan prices consistent across software/pricing/comparison/calculator", () => {
    for (const productId of ["pipedrive", "hubspot", "monday-sales-crm"]) {
      const report = assertPricingConsistency(productId);
      const catalogueDivergences = report.divergences.filter((d) => {
        const amounts = d.amounts.filter((a) => a.surface !== "research");
        const uniq = new Set(
          amounts.map((a) => (a.amount == null ? "null" : String(a.amount))),
        );
        return uniq.size > 1;
      });
      expect(catalogueDivergences).toEqual([]);
    }
  });

  it("detects monday-sales-crm Ultimate as REQUIRES_REVIEW and not CONFIRMED", () => {
    const changes = detectPriceChangesForProduct("monday-sales-crm");
    const ultimate = changes.find(
      (c) =>
        c.kind === "new_plan" &&
        (c.planName?.toLowerCase().includes("ultimate") ||
          c.summary.toLowerCase().includes("ultimate")),
    );
    if (ultimate) {
      expect(ultimate.confidence).toBe("REQUIRES_REVIEW");
      expect(ultimate.requiresHumanVerification).toBe(true);
      const task = buildPricingVerificationTask(ultimate);
      expect(task?.publishBlocked).toBe(true);
      expect(
        task?.detectedPricing.plans.some((p) =>
          p.planName.toLowerCase().includes("ultimate"),
        ),
      ).toBe(true);
    }
  });
});

describe("editorial + growth + report", () => {
  const sampleChange: DetectedPriceChange = {
    productId: "pipedrive",
    productName: "Pipedrive",
    kind: "plan_price_increase",
    confidence: "REQUIRES_REVIEW",
    summary: "Pipedrive: plan price increase (14 → 20 USD)",
    previousPrice: 14,
    newPrice: 20,
    absoluteChange: 6,
    percentageChange: 42.8,
    planId: null,
    planName: "Lite",
    requiresHumanVerification: true,
    validationNotes: ["large move"],
    noteworthy: true,
  };

  it("creates editorial candidates without publishing", () => {
    const candidates = buildEditorialCandidates([sampleChange]);
    expect(candidates.length).toBe(1);
    expect(candidates[0]!.publishStatus).toBe("candidate");
    expect(candidates[0]!.title).toContain("changed pricing");
  });

  it("boosts refresh candidates from growth signals", () => {
    const contentId = buildContentId("software", "pipedrive");
    const boosted = applyGrowthSignalsToRefreshCandidates(
      [
        {
          contentId,
          priority: "low",
          refreshStatus: "current",
          reasons: ["baseline"],
          changeEventIds: [],
          affectedDomains: ["editorial"],
        },
      ],
      [
        {
          path: "/software/pipedrive/",
          productId: "pipedrive",
          refreshPriorityBoost: "high",
          reason: "Outdated pricing risk",
          confidence: "CONFIRMED",
          outdatedPricing: true,
          staleCode: "OUTDATED_PRICING",
        },
      ],
    );
    expect(boosted[0]!.priority).toBe("high");
    expect(boosted[0]!.reasons.some((r) => r.includes("price-monitor"))).toBe(
      true,
    );
  });

  it("formats weekly markdown with required sections", () => {
    const md = formatWeeklyPriceChangesMarkdown({
      generatedAt: "2026-09-06T00:00:00.000Z",
      weekLabel: "2026-09-06",
      queueSample: [],
      changes: [sampleChange],
      affectedPages: [
        {
          path: "/software/pipedrive/",
          pageType: "software-review",
          slug: "pipedrive",
          productId: "pipedrive",
        },
      ],
      confirmedApplications: [],
      editorialCandidates: buildEditorialCandidates([sampleChange]),
      researchSignals: ["Starting-price series movement"],
    });
    expect(md).toContain("## Confirmed changes");
    expect(md).toContain("## Needs verification");
    expect(md).toContain("## Affected pages");
    expect(md).toContain("## Major changes");
    expect(md).toContain("## Research signals");
    expect(md).toContain("## Editorial candidates");
  });
});
