import { describe, expect, it } from "vitest";
import {
  EARNED_BACKLINK_AGENT,
  EARNED_LIVE_HITS,
  assertLiveHitsPresent,
  runEarnedBacklinkOpportunityAgent,
} from "./index";
import { qualifyLiveHit } from "./qualify";
import { LiveSearchHitSchema } from "./types";

describe("EarnedBacklinkOpportunityAgent", () => {
  it("requires non-empty live hits", () => {
    expect(() => assertLiveHitsPresent([])).toThrow(/live/i);
    expect(() => assertLiveHitsPresent(EARNED_LIVE_HITS)).not.toThrow();
  });

  it("validates live hit catalog against schema", () => {
    for (const hit of EARNED_LIVE_HITS.slice(0, 5)) {
      expect(() => LiveSearchHitSchema.parse(hit)).not.toThrow();
    }
    const accepts = EARNED_LIVE_HITS.filter(
      (h) => h.provisionalDecision === "accept",
    );
    const rejects = EARNED_LIVE_HITS.filter(
      (h) => h.provisionalDecision === "reject",
    );
    expect(accepts.length).toBeGreaterThanOrEqual(50);
    expect(rejects.length).toBeGreaterThanOrEqual(10);
  });

  it("rejects link-begging whyTheyMightLink", () => {
    const hit = {
      ...EARNED_LIVE_HITS.find((h) => h.provisionalDecision === "accept")!,
      whyTheyMightLink: "Because a backlink would help us rank.",
      provisionalDecision: "accept" as const,
    };
    const result = qualifyLiveHit(hit);
    expect(result.decision).toBe("reject");
  });

  it("runs end-to-end without write and produces Top 50", () => {
    const result = runEarnedBacklinkOpportunityAgent({
      write: false,
      generatedAt: "2026-08-15T10:00:00.000Z",
    });
    expect(result.agent.label).toBe(EARNED_BACKLINK_AGENT.label);
    expect(result.agent.sendsOutreach).toBe(false);
    expect(result.agent.requiresLiveWebSearch).toBe(true);
    expect(result.report.top50.length).toBe(50);
    expect(result.report.rejected.length).toBeGreaterThan(0);
    expect(result.markdown).toContain("TOP 50");
    expect(result.report.top50.every((o) => o.priority != null)).toBe(true);
    // No invented homepage-only cold pitches without why
    expect(
      result.report.top50.every((o) => o.whyTheyMightLink.length >= 40),
    ).toBe(true);
    expect(
      result.report.top50.every(
        (o) =>
          Boolean(o.targetPageUrl?.startsWith("https://www.softwareglimpse.com")) &&
          Boolean(o.submitOrContactUrl?.startsWith("http")) &&
          Boolean(o.suggestedAsk && o.suggestedAsk.length > 40) &&
          Boolean(o.howToSubmitOrRequest && o.howToSubmitOrRequest.length > 40),
      ),
    ).toBe(true);
    expect(result.markdown).toContain("Link this SG page");
    expect(result.markdown).toContain("Suggested ask");
  });
});
