import { describe, expect, it } from "vitest";
import { ComparisonSchema, canonicalizeComparisonSlug } from "@/domain";
import { softwareSeed } from "@/data/seed/software";
import {
  COMPETITOR_PAIR_CATEGORIES,
  buildCompetitorPairComparisonsFromResearch,
  clustersAreSubstitutes,
  listEligibleCompetitorPairs,
} from "./materialize-competitor-pairs";

describe("clustersAreSubstitutes", () => {
  it("skips adjacent specialists against primary work-os peers", () => {
    expect(
      clustersAreSubstitutes(
        "project-management",
        "document-pdf",
        "work-os",
        "adjacent",
        "primary",
        "foxit",
        "monday",
      ),
    ).toBe(false);
  });

  it("keeps Beehiiv/Customer.io competitor pairs and skips deliverability tools", () => {
    expect(
      clustersAreSubstitutes(
        "email-marketing",
        undefined,
        undefined,
        "adjacent",
        "primary",
        "beehiiv",
        "kit",
      ),
    ).toBe(true);
    expect(
      clustersAreSubstitutes(
        "email-marketing",
        undefined,
        undefined,
        "adjacent",
        "primary",
        "bouncer",
        "klaviyo",
      ),
    ).toBe(false);
  });

  it("keeps same-cluster phone peers and HCM shortlists", () => {
    expect(
      clustersAreSubstitutes(
        "business-communications",
        "cloud-phone",
        "cloud-phone",
        "primary",
        "primary",
      ),
    ).toBe(true);
    expect(
      clustersAreSubstitutes(
        "hr",
        "hris-core",
        "payroll-benefits",
        "primary",
        "primary",
      ),
    ).toBe(true);
  });

  it("skips phone vs WhatsApp/CCaaS/CPaaS and ATS vs HRIS", () => {
    expect(
      clustersAreSubstitutes(
        "business-communications",
        "cloud-phone",
        "customer-messaging",
        "primary",
        "primary",
      ),
    ).toBe(false);
    expect(
      clustersAreSubstitutes(
        "hr",
        "ats-recruiting",
        "hris-core",
        "primary",
        "primary",
      ),
    ).toBe(false);
  });
});

describe("buildCompetitorPairComparisonsFromResearch", () => {
  const pairs = listEligibleCompetitorPairs();
  const comparisons = buildCompetitorPairComparisonsFromResearch();
  const bySlug = new Map(comparisons.map((item) => [item.slug, item]));

  it(
    "materializes every published in-category pair, including non-peer jobs",
    () => {
      expect(pairs.some((pair) => pair.canonicalSlug === "foxit-vs-monday")).toBe(
        true,
      );
      expect(bySlug.has("foxit-vs-monday")).toBe(true);
      expect(comparisons.length).toBe(pairs.length);
      expect(comparisons.length).toBeGreaterThan(1500);
      const foxit = bySlug.get("foxit-vs-monday");
      expect(foxit?.overallWinnerKind).toBe("depends");
      expect(foxit?.verdict.toLowerCase()).toMatch(/not peer substitutes/);
    },
    180_000,
  );

  it(
    "covers 100% of n(n-1)/2 published primary pairs per category",
    () => {
      for (const category of COMPETITOR_PAIR_CATEGORIES) {
        const n = softwareSeed.filter(
          (item) =>
            item.metadata?.status === "published" &&
            item.primaryCategorySlug === category,
        ).length;
        const expected = n < 2 ? 0 : (n * (n - 1)) / 2;
        const got = listEligibleCompetitorPairs(category).length;
        expect(got, category).toBe(expected);
      }
    },
    180_000,
  );

  it(
    "covers every published competitorSlug pair that can use a category builder",
    () => {
      const published = softwareSeed.filter(
        (item) => item.metadata?.status === "published",
      );
      const bySlug = new Map(published.map((item) => [item.slug, item]));
      const covered = new Set(pairs.map((pair) => pair.canonicalSlug));
      const categorySet = new Set<string>(COMPETITOR_PAIR_CATEGORIES);
      const missing: string[] = [];
      for (const product of published) {
        for (const competitorSlug of product.competitorSlugs ?? []) {
          const other = bySlug.get(competitorSlug);
          if (!other) continue;
          const listingCat = product.primaryCategorySlug;
          const otherCat = other.primaryCategorySlug;
          if (
            !categorySet.has(listingCat ?? "") &&
            !categorySet.has(otherCat ?? "")
          ) {
            continue;
          }
          const slug = canonicalizeComparisonSlug([product.slug, other.slug]);
          if (!covered.has(slug)) missing.push(slug);
        }
      }
      expect(missing).toEqual([]);
    },
    180_000,
  );

  it(
    "publishes researched no-universal-winner pages with evidence-safe outcomes",
    () => {
    const sample =
      comparisons.find((item) => item.seo?.indexable) ??
      bySlug.get("aircall-vs-openphone") ??
      bySlug.get("asana-vs-clickup") ??
      comparisons[0];
    expect(sample).toBeDefined();
    const parsed = ComparisonSchema.parse(sample);
    expect(parsed.editorialStatus).toBe("approved");
    expect(parsed.seo.indexable).toBe(true);
    expect(parsed.overallWinnerKind).toBe("depends");
    expect(parsed.overallWinnerSlug).toBeNull();
    expect(parsed.verdict.toLowerCase()).toContain("no universal winner");
    expect(parsed.outcomes.length).toBeGreaterThanOrEqual(3);
    expect(parsed.seo.title?.length ?? 0).toBeLessThanOrEqual(70);
    expect(
      parsed.outcomes.every((outcome) => Boolean(outcome.reason)),
    ).toBe(true);
    expect(
      parsed.outcomes.some(
        (outcome) =>
          outcome.winnerKind === "product-a" &&
          (outcome.supportingFactIds?.length ?? 0) === 0,
      ),
    ).toBe(false);
    expect(
      parsed.outcomes.some((outcome) =>
        /comparable support/i.test(outcome.reason ?? ""),
      ),
    ).toBe(false);
    },
    180_000,
  );
});
