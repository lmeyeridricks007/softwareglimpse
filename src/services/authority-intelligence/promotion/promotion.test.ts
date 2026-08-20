import { describe, expect, it } from "vitest";
import {
  COMMUNITY_UNSAFE_REJECT,
  CONTENT_PROMOTION_AGENT,
  PROMOTION_CHANNELS,
  runContentPromotionOpportunityAgent,
} from "./index";

describe("ContentPromotionOpportunityAgent", () => {
  it("does not post or generate assets", () => {
    expect(CONTENT_PROMOTION_AGENT.postsToChannels).toBe(false);
    expect(CONTENT_PROMOTION_AGENT.generatesAssets).toBe(false);
  });

  it("catalogues channels with weak consumer social for CRM assets", () => {
    expect(PROMOTION_CHANNELS.length).toBeGreaterThanOrEqual(10);
    const weak = PROMOTION_CHANNELS.find((c) => c.id === "consumer-social");
    expect(weak?.defaultFit).toBe("weak");
  });

  it("builds promotion plans with good angles and safety rejects", () => {
    const result = runContentPromotionOpportunityAgent({
      write: false,
      generatedAt: "2026-08-15T10:00:00.000Z",
    });
    expect(result.report.plans.length).toBeGreaterThanOrEqual(8);
    const checklist = result.report.plans.find((p) =>
      p.assetPath.includes("crm-evaluation-checklist"),
    );
    expect(checklist).toBeTruthy();
    expect(checklist!.promotionAngle.toLowerCase()).not.toContain(
      "check out our",
    );
    expect(checklist!.weakChannels).toContain("consumer-social");
    expect(checklist!.primaryChannels).toContain("revops-coop");
    expect(result.report.launchPlans.length).toBeGreaterThanOrEqual(5);
    expect(
      result.report.rejectedTactics.every(
        (r) => r.reason === COMMUNITY_UNSAFE_REJECT,
      ),
    ).toBe(true);
    expect(result.markdown).toContain("Content Promotion Opportunities");
    expect(result.markdown).toContain("Consumed inputs");
  });
});
