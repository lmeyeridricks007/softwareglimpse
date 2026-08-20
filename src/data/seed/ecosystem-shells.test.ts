import { describe, expect, it } from "vitest";
import { alternativesSeed } from "./alternatives";
import { comparisonsSeed } from "./comparisons";
import {
  buildMissingAlternativesPages,
  buildMissingComparisonShells,
  catalogueSubstituteSlugs,
} from "./ecosystem-shells";
import { softwareSeed } from "./software";

describe("ecosystem shells", () => {
  it("creates a non-indexable alternatives page for every product with 2+ catalogue substitutes", () => {
    const bySource = new Set(
      alternativesSeed.flatMap((page) => [page.sourceSlug, page.slug]),
    );
    const missing: string[] = [];
    for (const product of softwareSeed) {
      const targets = catalogueSubstituteSlugs(product, softwareSeed);
      if (targets.length < 2) continue;
      if (!bySource.has(product.slug)) missing.push(product.slug);
    }
    expect(missing).toEqual([]);
  });

  it("does not treat broad team-communication peers as Fastmail substitutes", () => {
    const fastmail = softwareSeed.find((item) => item.slug === "fastmail");
    expect(fastmail).toBeDefined();
    const targets = catalogueSubstituteSlugs(fastmail!, softwareSeed);
    expect(targets).not.toContain("slack");
    expect(targets).not.toContain("zoom");
    expect(targets).not.toContain("microsoft-teams");
  });

  it("fills thin relationship lists from existing same-use-case peers", () => {
    const spocket = softwareSeed.find((item) => item.slug === "spocket");
    const cpanel = softwareSeed.find((item) => item.slug === "cpanel");
    expect(spocket).toBeDefined();
    expect(cpanel).toBeDefined();
    expect(catalogueSubstituteSlugs(spocket!, softwareSeed)).toEqual(
      expect.arrayContaining(["alidrop", "printful", "printify"]),
    );
    expect(catalogueSubstituteSlugs(cpanel!, softwareSeed)).toEqual(
      expect.arrayContaining(["plesk", "directadmin"]),
    );
  });

  it("creates a comparison shell for every published product with 2+ competitors", () => {
    const covered = new Set<string>();
    for (const comparison of comparisonsSeed) {
      for (const slug of comparison.productSlugs ?? []) covered.add(slug);
    }
    const missing: string[] = [];
    for (const product of softwareSeed) {
      if (product.metadata?.status !== "published") continue;
      const competitors = (product.competitorSlugs ?? []).filter(
        (slug) => slug !== product.slug,
      );
      if (competitors.length < 2) continue;
      if (!covered.has(product.slug)) missing.push(product.slug);
    }
    expect(missing).toEqual([]);
  });

  it("does not invent indexable rankings or unknown slugs", () => {
    const known = new Set(softwareSeed.map((product) => product.slug));
    const generatedAlts = buildMissingAlternativesPages(
      softwareSeed,
      alternativesSeed.filter((page) => page.metadata?.researchStatus === "complete"),
    );
    for (const page of generatedAlts) {
      expect(page.seo?.indexable).toBe(false);
      expect(page.editorialStatus).toBe("not-assessed");
      expect(page.metadata?.status).toBe("researching");
      expect(page.summary).toMatch(/not an editorial ranking/i);
      expect(known.has(page.sourceSlug ?? "")).toBe(true);
      for (const entry of page.alternatives ?? []) {
        expect(known.has(entry.targetSlug)).toBe(true);
        expect(entry.reason).toBeUndefined();
      }
    }
    const generatedComps = buildMissingComparisonShells(softwareSeed, []);
    for (const comparison of generatedComps) {
      expect(comparison.seo?.indexable).toBe(false);
      expect(comparison.outcomes).toEqual([]);
      expect(comparison.editorialStatus).toBe("not-assessed");
      for (const slug of comparison.productSlugs ?? []) {
        expect(known.has(slug)).toBe(true);
      }
    }
  });

  it("does not raise MISSING_ALT_CONTEXT or PRODUCT_ECOSYSTEM_GAP once shells exist", async () => {
    const { ecosystemChecks } = await import(
      "@/services/site-audit/checks/ecosystem"
    );
    const check = ecosystemChecks.find((item) => item.id === "product-ecosystem");
    expect(check).toBeDefined();
    const issues = await check!.run({ now: new Date().toISOString() });
    expect(
      issues.filter((issue) => issue.type === "MISSING_ALT_CONTEXT"),
    ).toEqual([]);
    expect(
      issues.filter((issue) => issue.type === "PRODUCT_ECOSYSTEM_GAP"),
    ).toEqual([]);
  });
});
