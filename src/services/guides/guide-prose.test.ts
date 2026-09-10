import { describe, expect, it } from "vitest";
import { getEducationalGuideBySlug } from "@/data/repositories/guides-educational";
import { __resetGuideCaches, getGuidesByProduct } from "@/data/repositories/guides";
import {
  GUIDE_MIN_READING_MINUTES,
  isGuideProseComplete,
  proseMinutesFromGuide,
} from "./guide-prose";

describe("guide prose completeness", () => {
  it("meets the 5-minute bar for AI pricing and Navan what-is guides", () => {
    __resetGuideCaches();
    const aiPricing = getEducationalGuideBySlug("ai-pricing-guide");
    expect(aiPricing).toBeTruthy();
    expect(proseMinutesFromGuide(aiPricing!)).toBeGreaterThanOrEqual(
      GUIDE_MIN_READING_MINUTES,
    );
    expect(isGuideProseComplete(aiPricing!)).toBe(true);

    const navanGuide = getEducationalGuideBySlug("what-is-navan");
    expect(navanGuide).toBeTruthy();
    expect(proseMinutesFromGuide(navanGuide!)).toBeGreaterThanOrEqual(
      GUIDE_MIN_READING_MINUTES,
    );
  });
});
