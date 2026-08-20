import { describe, expect, it } from "vitest";
import {
  composeContactMessage,
  parseContactReasonParam,
  CONTACT_INTENT_REASONS,
  CONTACT_REASON_BY_ID,
  getContactReasonDefinition,
} from "@/services/contact/reasons";
import { validateContactSubmission } from "@/services/contact";

describe("contact reasons", () => {
  it("exposes six primary intent routes", () => {
    expect(CONTACT_INTENT_REASONS.map((r) => r.id)).toEqual([
      "correction",
      "general",
      "vendor",
      "affiliate",
      "privacy",
      "technical",
    ]);
  });

  it("parses query aliases with backward compatibility", () => {
    expect(parseContactReasonParam("correction")).toBe("correction");
    expect(parseContactReasonParam("accessibility")).toBe("technical");
    expect(parseContactReasonParam("sponsorship")).toBe("advertising");
    expect(parseContactReasonParam("nope")).toBe("general");
  });

  it("keeps a definition for every reason id", () => {
    for (const id of Object.keys(CONTACT_REASON_BY_ID)) {
      expect(getContactReasonDefinition(id as keyof typeof CONTACT_REASON_BY_ID).id).toBe(
        id,
      );
    }
  });

  it("composes correction messages without PII field names beyond content", () => {
    const message = composeContactMessage({
      reason: "correction",
      message: "Extra note",
      whatWrong: "Price says $10",
      whatCorrect: "Price is $12",
      sourceUrl: "https://example.com/pricing",
    });
    expect(message).toContain("What looks wrong");
    expect(message).toContain("Correct information");
    expect(message).toContain("https://example.com/pricing");
  });
});

describe("contact validation", () => {
  it("requires page URL for corrections", () => {
    const result = validateContactSubmission({
      reason: "correction",
      name: "Alex",
      email: "alex@example.com",
      message: "Pricing looks outdated on this product page",
      privacyAcknowledged: true,
      relatedUrl: "",
    });
    expect(result.ok).toBe(false);
  });

  it("accepts correction with page URL", () => {
    const result = validateContactSubmission({
      reason: "correction",
      name: "Alex",
      email: "alex@example.com",
      message: "Pricing looks outdated on this product page",
      privacyAcknowledged: true,
      relatedUrl: "https://www.softwareglimpse.com/software/hubspot/",
    });
    expect(result.ok).toBe(true);
  });
});
