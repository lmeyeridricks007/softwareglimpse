import { describe, expect, it } from "vitest";
import { whatIsHrSoftwareGuide } from "@/data/seed/guides-what-is-hr-software";
import { withTeachingDepth } from "./teaching-depth";
import { teachingExpansionFor } from "@/data/seed/guides-category-teaching-expansion";

describe("withTeachingDepth", () => {
  it("adds next-step, example sections, and related reading without inventing scores", () => {
    const enriched = withTeachingDepth(whatIsHrSoftwareGuide);
    expect(enriched.nextAction?.contentId).toMatch(/^content:/);
    expect(enriched.sections.some((section) => /example/i.test(section.body))).toBe(
      true,
    );
    expect(enriched.blocks.some((block) => block.type === "related-content")).toBe(
      true,
    );
  });
});

describe("teaching expansion", () => {
  it("builds how-it-works, types, and vs pages from existing catalogue jobs", () => {
    const hr = teachingExpansionFor("hr");
    expect(hr.map((guide) => guide.slug)).toEqual(
      expect.arrayContaining([
        "how-hr-software-works",
        "types-of-hr-software",
        "hr-software-vs-crm",
      ]),
    );
    for (const guide of hr) {
      expect(guide.seo.indexable).toBe(true);
      expect(guide.metadata.status).toBe("published");
      expect(guide.heroVisual?.src).toMatch(/^\/guides\/.+\.png$/);
      expect(guide.verdict).toBeUndefined();
    }
  });

  it("does not duplicate the existing CRM vs customer-service teaching page", () => {
    const slugs = teachingExpansionFor("customer-service").map((guide) => guide.slug);
    expect(slugs).not.toContain("customer-service-vs-crm");
    expect(slugs).toContain("how-customer-service-software-works");
  });
});
