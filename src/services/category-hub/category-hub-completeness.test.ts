import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TIER_HUB_FIXTURES,
  TIER_HUB_MEDIA_DEFERRED_SLUGS,
} from "../../data/config/tier-hub-fixtures";
import { loadAssessment, loadReview } from "../../data/editorial/store";
import { loadEnrichment } from "../../data/research/store";
import {
  getCategoryBySlug,
  getSoftwareBySlug,
} from "../../data/repositories/catalog";
import { isVideoPublicEligible } from "../product-media";
import { buildPricingSnapshot } from "../pricing/build-snapshot";
import { buildCategoryHubModel } from "./index";

describe.each(Object.entries(TIER_HUB_FIXTURES))(
  "category hub completeness — %s",
  (categorySlug, fixture) => {
    const category = getCategoryBySlug(categorySlug, {
      includeUnpublished: true,
    });

    it("loads the category", () => {
      expect(category).toBeDefined();
    });

    it(
      "surfaces the full hub roster across grid, logos, and reviews",
      () => {
        const model = buildCategoryHubModel(category!);
        const cardSlugs = model.productCards.map((p) => p.slug);
        const logoSlugs = model.logoStrip.map((p) => p.slug);
        const reviewSlugs = model.reviews.map((r) =>
          r.href.replace("/software/", "").replace(/\/$/, ""),
        );

        expect(model.productCards.length).toBeGreaterThanOrEqual(
          fixture.minProducts,
        );
        for (const slug of fixture.products) {
          expect(cardSlugs, `${slug} missing from product grid`).toContain(slug);
          expect(logoSlugs, `${slug} missing from logo strip`).toContain(slug);
          expect(reviewSlugs, `${slug} missing from reviews rail`).toContain(
            slug,
          );
        }
      },
      15_000,
    );

    it("includes enough comparisons on the hub", () => {
      const model = buildCategoryHubModel(category!);
      expect(model.comparisons.length).toBeGreaterThanOrEqual(
        fixture.minComparisons,
      );
    });

    it("ships editorial assets for every expected product", () => {
      for (const slug of fixture.products) {
        expect(loadReview(slug), `${slug} review`).toBeDefined();
        expect(loadAssessment(slug), `${slug} assessment`).toBeDefined();
        expect(
          existsSync(join(process.cwd(), "public", "brands", `${slug}.png`)),
          `${slug} logo`,
        ).toBe(true);
      }
    });

    if (fixture.chooseGuideHref) {
      it("links to the category buying guide", () => {
        const model = buildCategoryHubModel(category!);
        expect(model.chooseGuideHref).toBe(fixture.chooseGuideHref);
        expect(model.guides.length).toBeGreaterThanOrEqual(8);
      });
    }

    it("surfaces enrichment-backed pricing teasers on hub cards when list pricing exists", () => {
      const model = buildCategoryHubModel(category!);
      for (const slug of fixture.products) {
        const software = getSoftwareBySlug(slug, { includeUnpublished: true });
        expect(software, slug).toBeDefined();
        const snapshot = buildPricingSnapshot({
          software: software!,
          enrichment: loadEnrichment(slug),
        });
        if (snapshot.pricing?.startingPriceMonthly == null) continue;
        const card = model.productCards.find((p) => p.slug === slug);
        expect(card?.pricingTeaser, `${slug} hub pricing teaser`).toBeTruthy();
        expect(card?.pricingVerifiedAt, `${slug} hub pricing verifiedAt`).toBeTruthy();
      }
    });

    it("ships major official media (vendor-ui screenshot or eligible video) for roster products", () => {
      for (const slug of fixture.products) {
        if (TIER_HUB_MEDIA_DEFERRED_SLUGS.has(slug)) continue;
        const enrichment = loadEnrichment(slug);
        const hasEligibleVideo = (enrichment?.media ?? []).some(
          (m) => isVideoPublicEligible(m).eligible,
        );
        const hasVendorUi = (enrichment?.screenshots ?? []).some((shot) => {
          if (shot.kind !== "vendor-ui") return false;
          const rel = shot.src.replace(/^\//, "");
          if (!rel.startsWith("software/") && !rel.startsWith("vendor-ui/")) {
            return false;
          }
          const disk = join(process.cwd(), "public", rel);
          if (!existsSync(disk)) return false;
          try {
            return statSync(disk).size >= 4_000;
          } catch {
            return false;
          }
        });
        expect(
          hasEligibleVideo || hasVendorUi,
          `${slug} missing vendor-ui screenshot and eligible official video`,
        ).toBe(true);
      }
    });
  },
);
