import { describe, expect, it } from "vitest";
import { getEducationalGuideBySlug } from "@/data/repositories/guides-educational";
import { __resetGuideCaches, getGuidesByProduct } from "@/data/repositories/guides";
import {
  GUIDE_MIN_READING_MINUTES,
  isGuideProseComplete,
  proseMinutesFromGuide,
} from "./guide-prose";

describe("guide prose completeness", () => {
  it("meets the 5-minute bar for AI pricing and Navan setup guides", () => {
    __resetGuideCaches();
    const aiPricing = getEducationalGuideBySlug("ai-pricing-guide");
    expect(aiPricing).toBeTruthy();
    expect(proseMinutesFromGuide(aiPricing!)).toBeGreaterThanOrEqual(
      GUIDE_MIN_READING_MINUTES,
    );
    expect(isGuideProseComplete(aiPricing!)).toBe(true);

    const navanSetup = getGuidesByProduct("navan").find((g) =>
      g.slug.endsWith("-setup"),
    );
    expect(navanSetup).toBeTruthy();
    expect(proseMinutesFromGuide(navanSetup!)).toBeGreaterThanOrEqual(
      GUIDE_MIN_READING_MINUTES,
    );
  });
});
