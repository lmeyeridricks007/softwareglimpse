import {
  getAllSoftwareUnfiltered,
  getSoftwareBySlug,
} from "@/data";
import { loadEnrichment } from "@/data/research/store";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";
import { buildProductMediaHealthReport } from "@/services/product-media/media-health-report";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

export const researchFreshnessChecks: AuditCheck[] = [
  {
    id: "research-domain-coverage",
    level: "readiness",
    description: "Category required research domains vs enrichment",
    run(ctx) {
      const products = ctx.productSlug
        ? [getSoftwareBySlug(ctx.productSlug, { includeUnpublished: true })].filter(
            Boolean,
          )
        : getAllSoftwareUnfiltered().filter((p) =>
            ctx.categorySlug
              ? p.primaryCategorySlug === ctx.categorySlug ||
                p.secondaryCategorySlugs.includes(ctx.categorySlug)
              : true,
          );

      const issues = [];
      for (const product of products) {
        if (!product) continue;
        const override = getCategoryOnboardingOverride(product.primaryCategorySlug);
        const enrichment = loadEnrichment(product.slug);
        if (!enrichment) {
          if (
            product.metadata.status === "published" ||
            product.metadata.researchStatus === "complete"
          ) {
            issues.push(
              issue(
                {
                  type: "RESEARCH_GAP",
                  level: "readiness",
                  message: `${product.name}: missing research enrichment`,
                  productSlug: product.slug,
                  categorySlug: product.primaryCategorySlug,
                  contentId: `content:software:${product.slug}`,
                  path: `/software/${product.slug}/`,
                },
                ctx.now,
              ),
            );
          }
          continue;
        }

        if (product.metadata.researchStatus === "stale") {
          issues.push(
            issue(
              {
                type: "STALE_CRITICAL_FACT",
                level: "readiness",
                message: `${product.name}: researchStatus=stale`,
                productSlug: product.slug,
                categorySlug: product.primaryCategorySlug,
                evidence: "research freshness domain",
              },
              ctx.now,
            ),
          );
        }

        // Pricing domain signal
        const hasPricing =
          Boolean(
            (enrichment as { pricing?: unknown }).pricing ??
              (enrichment as { domains?: string[] }).domains?.includes?.("pricing"),
          ) || override.requiredResearchDomains.includes("pricing");
        if (
          override.requiredResearchDomains.includes("pricing") &&
          product.metadata.status === "published" &&
          !hasPricing &&
          !loadEnrichment(product.slug)
        ) {
          issues.push(
            issue(
              {
                type: "PRICING_GAP",
                level: "readiness",
                message: `${product.name}: pricing research required for category`,
                productSlug: product.slug,
                categorySlug: product.primaryCategorySlug,
              },
              ctx.now,
            ),
          );
        }
      }
      return issues;
    },
  },
  {
    id: "official-media-health",
    level: "readiness",
    description:
      "Official vendor media freshness / availability (internal Product Media Health)",
    run(ctx) {
      const report = buildProductMediaHealthReport({
        productSlug: ctx.productSlug,
        now: new Date(ctx.now),
      });
      const issues = [];
      for (const row of report.products) {
        if (ctx.categorySlug) {
          const product = getSoftwareBySlug(row.productSlug, {
            includeUnpublished: true,
          });
          if (
            product &&
            product.primaryCategorySlug !== ctx.categorySlug &&
            !product.secondaryCategorySlugs.includes(ctx.categorySlug)
          ) {
            continue;
          }
        }

        for (const result of row.mediaResults) {
          if (result.flags.includes("source-unavailable")) {
            const archivedWithReplacement =
              result.publicVisibility === "hidden" && row.activeVideos > 0;
            if (archivedWithReplacement) continue;
            issues.push(
              issue(
                {
                  type: "STALE_CRITICAL_FACT",
                  level: "readiness",
                  message: `${row.productName}: official media unavailable (${result.mediaId}) — hide public display + research refresh`,
                  productSlug: row.productSlug,
                  evidence: "official-media source-unavailable",
                  path: `/software/${row.productSlug}/evidence/`,
                },
                ctx.now,
              ),
            );
          } else if (result.needsResearchRefresh) {
            issues.push(
              issue(
                {
                  type: "STALE_CRITICAL_FACT",
                  level: "readiness",
                  message: `${row.productName}: official media needs refresh (${result.mediaId}: ${result.flags.join(", ")})`,
                  productSlug: row.productSlug,
                  evidence: "official-media freshness",
                  path: `/software/${row.productSlug}/evidence/`,
                },
                ctx.now,
              ),
            );
          }
        }

        if (row.missingMajorMediaCoverage) {
          issues.push(
            issue(
              {
                type: "RESEARCH_GAP",
                level: "readiness",
                message: `${row.productName}: missing major official media coverage`,
                productSlug: row.productSlug,
                evidence: "Product Media Health",
                path: `/software/${row.productSlug}/`,
              },
              ctx.now,
            ),
          );
        }
      }
      return issues;
    },
  },
];
