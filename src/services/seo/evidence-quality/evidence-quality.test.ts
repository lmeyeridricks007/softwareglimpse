import { describe, expect, it } from "vitest";
import {
  matchPlanNamesInHtml,
  pickPricingSource,
  pickPricingSources,
  buildProductEvidencePack,
  BANNED_HANDS_ON_LANGUAGE,
} from "./index";

describe("evidence-quality", () => {
  it("matches plan names with parenthetical suffixes", () => {
    const html =
      "<h2>Starter</h2><h2>Professional</h2><h2>Enterprise</h2><p>Free CRM</p>";
    const { found, ratio } = matchPlanNamesInHtml(html, [
      "Free CRM",
      "Starter (Smart CRM / Customer Platform)",
      "Professional (Smart CRM / Customer Platform)",
      "Enterprise (Smart CRM / Customer Platform)",
    ]);
    expect(found.length).toBe(4);
    expect(ratio).toBe(1);
  });

  it("picks a pricing URL for capsule", () => {
    const source = pickPricingSource("capsule");
    expect(source?.url).toMatch(/pricing/i);
  });

  it("ranks pricing pages above generic official homepages", () => {
    const ranked = pickPricingSources("asana", 4);
    expect(ranked[0]?.url).toMatch(/pricing/i);
    expect(ranked.every((s) => !/^https:\/\/asana\.com\/?$/i.test(s.url))).toBe(
      true,
    );
  });

  it("does not re-queue blocked vendor hosts after a failed live check", () => {
    const ranked = pickPricingSources("chatgpt", 4);
    expect(
      ranked.every(
        (s) => !/chatgpt\.com/i.test(s.url) && !/openai\.com/i.test(s.url),
      ),
    ).toBe(true);
  });

  it("builds a normalized pack from existing research only", () => {
    const pack = buildProductEvidencePack("capsule");
    expect(pack).not.toBeNull();
    expect(pack!.sources.length).toBeGreaterThan(0);
    expect(pack!.plans.length).toBeGreaterThan(0);
    expect(pack!.pricingSourceCount).toBeGreaterThan(0);
    expect(pack!.pricingVerification.stampApplied).toBe(false);
  });

  it("defines banned hands-on language patterns", () => {
    const labels = BANNED_HANDS_ON_LANGUAGE.map((p) => p.label);
    expect(labels).toContain("We tested");
    expect(labels).toContain("Our experience");
    expect(labels).toContain("During testing");
    expect(labels).toContain("our testing found");
    expect(labels).toContain("we used the product");
  });
});
