import { describe, expect, it } from "vitest";
import {
  LINK_EXCHANGE_REJECT_LABEL,
  PARTNERSHIP_AGENT,
  PARTNERSHIP_LIVE_HITS,
  assertPartnershipLiveHitsPresent,
  qualifyPartnershipHit,
  runPartnershipOpportunityAgent,
} from "./index";

describe("PartnershipOpportunityAgent", () => {
  it("requires live hits", () => {
    expect(() => assertPartnershipLiveHitsPresent([])).toThrow(/live/i);
    expect(() =>
      assertPartnershipLiveHitsPresent(PARTNERSHIP_LIVE_HITS),
    ).not.toThrow();
  });

  it("rejects mass link exchange", () => {
    const hit = PARTNERSHIP_LIVE_HITS.find(
      (h) => h.rejectReason === LINK_EXCHANGE_REJECT_LABEL,
    );
    expect(hit).toBeTruthy();
    const result = qualifyPartnershipHit(hit!);
    expect(result.decision).toBe("reject");
    if (result.decision === "reject") {
      expect(result.rejected.reason).toBe(LINK_EXCHANGE_REJECT_LABEL);
    }
  });

  it("rejects false SI / implementation partner enrollment", () => {
    const hit = PARTNERSHIP_LIVE_HITS.find(
      (h) =>
        h.claimsImplementationPartnerStatus === true &&
        h.provisionalDecision === "reject",
    );
    expect(hit).toBeTruthy();
    const result = qualifyPartnershipHit(hit!);
    expect(result.decision).toBe("reject");
  });

  it("produces mutual-value partnerships without contacting anyone", () => {
    const result = runPartnershipOpportunityAgent({
      write: false,
      generatedAt: "2026-08-15T10:00:00.000Z",
    });
    expect(result.agent.contactsPartners).toBe(false);
    expect(result.agent.misrepresentsAsImplementationPartner).toBe(false);
    expect(result.report.accepted.length).toBeGreaterThanOrEqual(10);
    expect(
      result.report.accepted.every(
        (o) => o.whatWeOffer.length > 0 && o.whatTheyOffer.length > 0,
      ),
    ).toBe(true);
    expect(result.markdown).toContain("Partnership Opportunities");
    expect(result.markdown).toContain(LINK_EXCHANGE_REJECT_LABEL);
    expect(
      result.report.accepted.some((o) =>
        /RevOps Co-op/i.test(o.organization),
      ),
    ).toBe(true);
  });
});
