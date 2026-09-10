import { describe, expect, it } from "vitest";
import {
  DATA_VERIFIED_EVIDENCE_ON_TRACK,
  HANDS_ON_SCOPE,
  HANDS_ON_SCOPE_LABEL,
} from "./hands-on-scope";
import { resolveEvidenceLevel } from "./evidence-level";

describe("HANDS_ON scope", () => {
  it("reports 0 / NOT_CURRENT_SCOPE without treating absence as a data-verified block", () => {
    expect(HANDS_ON_SCOPE).toBe("NOT_CURRENT_SCOPE");
    expect(HANDS_ON_SCOPE_LABEL).toBe("0 / NOT_CURRENT_SCOPE");
    expect(
      resolveEvidenceLevel({
        handsOnTesting: false,
        testedAt: null,
        pricingVerifiedAt: "2026-09-10T08:00:00.000Z",
      }),
    ).toBe("data_verified");
    expect(DATA_VERIFIED_EVIDENCE_ON_TRACK).toBeGreaterThan(0);
  });
});
