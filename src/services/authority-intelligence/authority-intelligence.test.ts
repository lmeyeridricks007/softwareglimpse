import { describe, expect, it } from "vitest";
import {
  evaluateLinkSpamCompliance,
  LINK_SPAM_AVOID_LABEL,
} from "./compliance";
import { runDiscoverAgent } from "./discover";
import { runDraftAnglesAgent } from "./draft-angles";
import { inventoryLinkableAssets } from "./linkable-assets";
import { runAuthorityIntelligenceOrchestrator } from "./orchestrator";
import { runQualifyAgent } from "./qualify";
import { runRecommendAgent } from "./recommend";
import { scoreOpportunity } from "./scoring";
import { toAuthorityLimitations } from "./authority-limitations-bridge";
import { runVerifyAgent } from "./verify";
import { AUTHORITY_INTELLIGENCE_ORCHESTRATOR } from "./orchestrator";

describe("Authority Intelligence — compliance", () => {
  it("rejects pay-for-dofollow / link-equity purchases", () => {
    const verdict = evaluateLinkSpamCompliance({
      opportunityDescription: "Buy dofollow backlink package for CRM sites",
      reasonWhyTheyMightLink: "Guaranteed dofollow",
      acquisitionType: "PAID",
      type: "PAID_DIRECTORY",
      primaryValueProposition: "link-equity-purchase",
      expectedLinkTreatment: "EDITORIAL",
    });
    expect(verdict.reject).toBe(true);
    expect(verdict.label).toBe(LINK_SPAM_AVOID_LABEL);
    expect(verdict.spamRisk).toBe("link-spam-avoid");
  });

  it("allows paid exposure with sponsored treatment", () => {
    const verdict = evaluateLinkSpamCompliance({
      opportunityDescription: "Newsletter sponsorship for tool launch",
      reasonWhyTheyMightLink: "Audience overlap with CRM buyers",
      acquisitionType: "PAID",
      type: "PAID_NEWSLETTER",
      primaryValueProposition: "paid-exposure",
      expectedLinkTreatment: "SPONSORED",
    });
    expect(verdict.reject).toBe(false);
    expect(verdict.flags).toContain("paid-exposure-allowed");
  });

  it("does not reject warnings that mention dofollow negatively", () => {
    const verdict = evaluateLinkSpamCompliance({
      opportunityDescription:
        "Owned profile presence — not a place to buy dofollow links.",
      reasonWhyTheyMightLink: "Referral and brand discoverability only.",
      acquisitionType: "OWNED_PROFILE",
      type: "SOFTWARE_DIRECTORY",
      primaryValueProposition: "directory-discoverability",
      expectedLinkTreatment: "NOFOLLOW",
    });
    expect(verdict.reject).toBe(false);
  });

  it("rejects bulk guest-post network signals", () => {
    const verdict = evaluateLinkSpamCompliance({
      opportunityDescription: "Bulk guest posts CRM package",
      reasonWhyTheyMightLink: "guest posting network",
      acquisitionType: "PAID",
      type: "GUEST_CONTRIBUTION",
      expectedLinkTreatment: "EDITORIAL",
    });
    expect(verdict.reject).toBe(true);
  });
});

describe("Authority Intelligence — scoring", () => {
  it("forces AVOID when spam risk is link-spam-avoid", () => {
    const scored = scoreOpportunity({
      relevance: "excellent",
      editorialLegitimacy: "excellent",
      audienceOverlap: "excellent",
      referralValue: "excellent",
      seoValue: "excellent",
      targetPageFit: "excellent",
      likelihood: "high",
      effort: "trivial",
      spamRisk: "link-spam-avoid",
    });
    expect(scored.band).toBe("AVOID");
    expect(scored.normalized).toBe(0);
  });

  it("scores a strong free tool-citation opportunity above LOW", () => {
    const scored = scoreOpportunity({
      relevance: "strong",
      editorialLegitimacy: "excellent",
      audienceOverlap: "strong",
      referralValue: "strong",
      seoValue: "strong",
      targetPageFit: "strong",
      likelihood: "medium",
      effort: "medium",
      costBurden: "none",
      spamRisk: "none",
    });
    expect(["EXCELLENT", "STRONG", "GOOD"]).toContain(scored.band);
  });
});

describe("Authority Intelligence — linkable assets", () => {
  it("inventories tools and resources and deprioritizes homepage", () => {
    const assets = inventoryLinkableAssets();
    expect(assets.some((a) => a.kind === "tool")).toBe(true);
    expect(assets.some((a) => a.path.includes("/resources/"))).toBe(true);
    const home = assets.find((a) => a.kind === "homepage");
    expect(home?.linkability).toBe("low");
  });
});

describe("Authority Intelligence — agent pipeline", () => {
  it("discover → verify → qualify → recommend → draft without outreach flags", () => {
    const discovered = runDiscoverAgent({
      generatedAt: "2026-08-15T10:00:00.000Z",
    });
    expect(discovered.agent.sendsOutreach).toBe(false);
    expect(discovered.opportunities.length).toBeGreaterThan(5);

    const verified = runVerifyAgent(discovered.opportunities, {
      generatedAt: "2026-08-15T10:00:00.000Z",
    });
    expect(verified.opportunities.every((o) => o.verifiedAt)).toBe(true);

    const qualified = runQualifyAgent(verified.opportunities, {
      generatedAt: "2026-08-15T10:00:00.000Z",
    });
    expect(qualified.opportunities.some((o) => o.scoreBand === "AVOID")).toBe(
      true,
    );

    const recommended = runRecommendAgent(
      qualified.opportunities,
      qualified.linkableAssets,
    );
    expect(recommended.avoid.length).toBeGreaterThan(0);
    expect(recommended.freeFirst.length).toBeGreaterThan(0);
    expect(recommended.contentGapsForLinks.length).toBeGreaterThan(0);

    const angles = runDraftAnglesAgent(recommended.opportunities);
    expect(angles.agent.sendsOutreach).toBe(false);
    expect(angles.angles.every((a) => a.requiresHumanAction)).toBe(true);
  });
});

describe("AuthorityIntelligenceOrchestrator", () => {
  it("runs end-to-end without writing when write=false", () => {
    const result = runAuthorityIntelligenceOrchestrator({
      write: false,
      mode: "FAST",
      scope: "crm",
      generatedAt: "2026-08-15T10:00:00.000Z",
    });
    expect(result.agent.label).toBe(
      AUTHORITY_INTELLIGENCE_ORCHESTRATOR.label,
    );
    expect(result.agent.mutatesProduction).toBe(false);
    expect(result.agent.sendsOutreach).toBe(false);
    expect(result.summary.avoid).toBeGreaterThan(0);
    expect(result.summary.total).toBeGreaterThan(0);
    expect(result.markdown).toContain("AuthorityIntelligenceOrchestrator");
    expect(result.markdown).toContain(LINK_SPAM_AVOID_LABEL);
    expect(result.paths.intelligenceLatest).toBeUndefined();

    const limitations = toAuthorityLimitations(result.opportunities);
    expect(limitations.status).toBe("available");
    expect(limitations.knownGaps.length).toBeGreaterThan(0);
  });
});
