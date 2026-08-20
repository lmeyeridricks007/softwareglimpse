import { describe, expect, it } from "vitest";
import {
  LINK_SCHEME_AVOID_LABEL,
  PAID_LIVE_HITS,
  PAID_PROMOTION_AGENT,
  assertPaidLiveHitsPresent,
  qualifyPaidHit,
  runPaidPromotionOpportunityAgent,
} from "./index";
import { PaidLiveHitSchema } from "./types";

describe("PaidPromotionOpportunityAgent", () => {
  it("requires live hits", () => {
    expect(() => assertPaidLiveHitsPresent([])).toThrow(/live/i);
    expect(() => assertPaidLiveHitsPresent(PAID_LIVE_HITS)).not.toThrow();
  });

  it("validates catalog and has accepts + avoids", () => {
    for (const hit of PAID_LIVE_HITS.slice(0, 3)) {
      expect(() => PaidLiveHitSchema.parse(hit)).not.toThrow();
    }
    const accepts = PAID_LIVE_HITS.filter((h) => h.provisionalDecision === "accept");
    const avoids = PAID_LIVE_HITS.filter((h) => h.provisionalDecision === "avoid");
    expect(accepts.length).toBeGreaterThanOrEqual(20);
    expect(avoids.length).toBeGreaterThanOrEqual(5);
  });

  it("avoids dofollow / link-scheme pitches", () => {
    const scheme = PAID_LIVE_HITS.find(
      (h) =>
        h.provisionalDecision === "avoid" &&
        (h.avoidReason === LINK_SCHEME_AVOID_LABEL ||
          h.pageSummary.toLowerCase().includes("dofollow")),
    );
    expect(scheme).toBeTruthy();
    const result = qualifyPaidHit(scheme!);
    expect(result.decision).toBe("avoid");
    if (result.decision === "avoid") {
      expect(result.avoided.reason).toBe(LINK_SCHEME_AVOID_LABEL);
    }
  });

  it("never recommends EDITORIAL treatment for paid accepts", () => {
    const result = runPaidPromotionOpportunityAgent({
      write: false,
      generatedAt: "2026-08-15T10:00:00.000Z",
    });
    expect(result.agent.purchasesPlacements).toBe(false);
    expect(
      result.report.accepted.every(
        (o) =>
          o.expectedLinkTreatment === "SPONSORED" ||
          o.expectedLinkTreatment === "NOFOLLOW" ||
          o.expectedLinkTreatment === "UNKNOWN",
      ),
    ).toBe(true);
    expect(
      result.report.accepted.every(
        (o) =>
          o.seoLinkValue === "none" ||
          o.seoLinkValue === "low" ||
          o.seoLinkValue === "unknown",
      ),
    ).toBe(true);
    expect(result.report.experiments.some((e) => e.id === "A0")).toBe(true);
    expect(result.markdown).toContain("Best paid experiments");
    expect(result.markdown).toContain(LINK_SCHEME_AVOID_LABEL);
  });
});
