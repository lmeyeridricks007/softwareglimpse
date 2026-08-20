import { describe, expect, it } from "vitest";
import {
  AUTHORITY_VISIBILITY_ORCHESTRATOR,
  runAuthorityVisibilityIntelligenceOrchestrator,
} from "./orchestrator";

describe("AuthorityVisibilityIntelligenceOrchestrator", () => {
  it("runs specialized agents and produces master markdown", () => {
    const result = runAuthorityVisibilityIntelligenceOrchestrator({
      write: false,
      mode: "FAST",
      generatedAt: "2026-08-15T10:00:00.000Z",
    });
    expect(result.agent.label).toBe(
      AUTHORITY_VISIBILITY_ORCHESTRATOR.label,
    );
    expect(result.agent.sendsOutreach).toBe(false);
    expect(result.agent.purchasesPlacements).toBe(false);
    expect(result.markdown).toContain(
      "SoftwareGlimpse Authority & Visibility Intelligence",
    );
    expect(result.markdown).toContain("Executive scorecard");
    expect(result.markdown).toContain("Recommended 30-day plan");
    expect(result.markdown).toContain("Recommended 90-day plan");
    expect(result.markdown).toContain("six-month");
    expect(result.summary.earnedTop).toBeGreaterThan(0);
    expect(result.scorecard.currentExternalAuthority).toMatch(/UNKNOWN|PARTIAL/);
  });
});
