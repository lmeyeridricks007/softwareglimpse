import { describe, expect, it } from "vitest";
import { getGuides } from "@/data/repositories/guides";
import { isEntityIndexable } from "@/domain/quality-gates";
import { getSitemapEntries } from "@/seo/sitemap";
import { canonicalUrl } from "@/seo/canonical";
import {
  isFactoryProductPackGuide,
  isGuideSearchIndexWorthy,
  isProductExplainerGuide,
  mayCreateIndexableProductPackGuide,
  runGuidesIndexAudit,
} from "@/services/seo/guides-index-worthiness";

describe("guides index-worthiness", () => {
  it("noindexes factory packs; explainers index only with independent unique value", () => {
    const guides = getGuides();
    const factory = guides.find((g) => isFactoryProductPackGuide(g));
    expect(factory).toBeTruthy();
    expect(isGuideSearchIndexWorthy(factory!)).toBe(false);
    expect(
      isEntityIndexable({ kind: "guide", entity: factory! }),
    ).toBe(false);

    const explainers = guides.filter((g) => isProductExplainerGuide(g));
    expect(explainers.length).toBeGreaterThan(0);
    // Policy: never permanently block the type — only thin/unenriched stay out.
    for (const g of explainers.slice(0, 40)) {
      if (!isGuideSearchIndexWorthy(g)) {
        // Thin / failing promotion gates is expected for weak pages
        continue;
      }
      // Index-worthy explainers must show product-specific analysis signals
      expect(g.blocks?.length ?? 0).toBeGreaterThanOrEqual(3);
      expect(g.supports?.length ?? 0).toBeGreaterThan(0);
    }
  }, 120_000);

  it("keeps strong educational category guides indexable", () => {
    const guide = getGuides().find((g) => g.slug === "what-is-crm");
    expect(guide).toBeTruthy();
    expect(isGuideSearchIndexWorthy(guide!)).toBe(true);
    expect(isEntityIndexable({ kind: "guide", entity: guide! })).toBe(true);
  });

  it("blocks new factory packs from being created as indexable", () => {
    expect(
      mayCreateIndexableProductPackGuide({
        productSlug: "pipedrive",
        kind: "migration",
      }),
    ).toBe(false);
  });

  it("excludes noindex guides from the sitemap", () => {
    const factory = getGuides().find((g) => isFactoryProductPackGuide(g));
    expect(factory).toBeTruthy();
    const entries = getSitemapEntries();
    const urls = new Set(entries.map((e) => e.url));
    expect(urls.has(canonicalUrl(`/guides/${factory!.slug}/`))).toBe(false);
    expect(urls.has(canonicalUrl("/guides/what-is-crm/"))).toBe(true);
  });

  it("keeps seed indexable true for due scheduled guides but blocks sitemap without hero (FR-007)", () => {
    // Tier-3 accounting launch: first guides scheduled 2026-09-03 / 2026-09-05
    // (past relative to project "today"). Publication gate opens and seed
    // seo.indexable stays true — but editorial_completeness (hero) is hard.
    // Missing hero → not search-index worthy → not sitemap-eligible until remediated.
    const due = getGuides({ includeUnpublished: true }).find(
      (g) => g.slug === "what-is-accounting-finance-software",
    );
    expect(due).toBeTruthy();
    expect(due!.metadata.status).toBe("scheduled");
    expect(due!.seo.indexable).toBe(true);
    expect(due!.heroVisual?.src).toBeFalsy();
    expect(isGuideSearchIndexWorthy(due!)).toBe(false);
    expect(isEntityIndexable({ kind: "guide", entity: due! })).toBe(false);

    const asOf = new Date("2026-09-12T12:00:00.000Z");
    const entries = getSitemapEntries(asOf);
    const urls = new Set(entries.map((e) => e.url));
    expect(
      urls.has(canonicalUrl("/guides/what-is-accounting-finance-software/")),
    ).toBe(false);

    const future = getGuides({ includeUnpublished: true }).find(
      (g) => g.slug === "accounting-finance-vs-hr-software",
    );
    expect(future).toBeTruthy();
    expect(future!.seo.indexable).toBe(true);
    // Scheduled 2026-09-13 — still unpublished on 2026-09-12.
    expect(isEntityIndexable({ kind: "guide", entity: future! }, asOf)).toBe(false);
    expect(
      urls.has(canonicalUrl("/guides/accounting-finance-vs-hr-software/")),
    ).toBe(false);
  });

  it("produces an audit with INDEXABLE far below total crawl surface", () => {
    const report = runGuidesIndexAudit();
    expect(report.summary.total).toBeGreaterThan(1000);
    expect(report.summary.improvementQueueCount).toBeGreaterThan(1000);
    expect(report.summary.searchIndexableCount).toBeLessThan(
      report.summary.total / 2,
    );
    expect(report.summary.byLifecycle.INDEXABLE).toBeGreaterThan(50);
    expect(report.summary.factoryKpis.originTotal).toBe(
      report.summary.factoryPackCount,
    );
    expect(report.summary.factoryKpis.originTotal).toBeGreaterThan(1000);
    expect(report.summary.factoryKpis.highRisk).toBeLessThanOrEqual(
      report.summary.factoryKpis.originTotal,
    );
    expect(report.summary.potentialIndexableAfterRemediation).toBeGreaterThan(
      1000,
    );
    expect(report.duplicateClusters.length).toBeGreaterThan(0);
  }, 240_000);
});
