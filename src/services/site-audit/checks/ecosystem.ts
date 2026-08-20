import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getCategoryBySlug,
  getSoftwareByCategory,
  getSoftwareBySlug,
} from "@/data";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";
import { catalogueSubstituteSlugs } from "@/data/seed/ecosystem-shells";
import { loadEnrichment } from "@/data/research/store";
import {
  assessCategoryMaturity,
  assessProductMaturity,
  clusterCompletionScore,
} from "@/services/catalogue-onboarding/maturity";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

export const ecosystemChecks: AuditCheck[] = [
  {
    id: "category-coverage-gaps",
    level: "readiness",
    description: "Category research/review/comparison/best coverage",
    run(ctx) {
      const issues = [];
      const slug = ctx.categorySlug;
      if (!slug) return [];
      const cat = getCategoryBySlug(slug, { includeUnpublished: true });
      if (!cat) {
        return [
          issue(
            {
              type: "CATEGORY_GAP",
              level: "readiness",
              message: `Category not found: ${slug}`,
              categorySlug: slug,
            },
            ctx.now,
          ),
        ];
      }
      const products = getSoftwareByCategory(slug, { includeUnpublished: true });
      const researched = products.filter((p) => loadEnrichment(p.slug));
      const published = products.filter((p) => p.metadata.status === "published");
      const alts = getAllAlternativesUnfiltered().filter((a) =>
        products.some((p) => p.slug === a.sourceSlug || p.slug === a.slug),
      );
      const comps = getAllComparisonsUnfiltered().filter((c) =>
        c.productSlugs.some((ps) => products.some((p) => p.slug === ps)),
      );
      const best = getAllBestPagesUnfiltered().filter(
        (b) => b.categorySlug === slug || b.slug.includes(slug),
      );
      const override = getCategoryOnboardingOverride(slug);
      const maturity = assessCategoryMaturity(slug);
      const cluster = clusterCompletionScore(slug);

      if (!override.categoryContentReady) {
        issues.push(
          issue(
            {
              type: "CATEGORY_GAP",
              level: "readiness",
              message: `${slug}: category methodology/content not ready`,
              categorySlug: slug,
              evidence: `maturity=${maturity} cluster=${cluster}`,
            },
            ctx.now,
          ),
        );
      }

      if (products.length >= 3 && researched.length < Math.ceil(products.length * 0.5)) {
        issues.push(
          issue(
            {
              type: "RESEARCH_GAP",
              level: "readiness",
              message: `${slug}: research coverage ${researched.length}/${products.length}`,
              categorySlug: slug,
            },
            ctx.now,
          ),
        );
      }

      if (published.length >= 3 && alts.length === 0) {
        issues.push(
          issue(
            {
              type: "PRODUCT_ECOSYSTEM_GAP",
              level: "readiness",
              message: `${slug}: ${published.length} published products but 0 alternatives pages`,
              categorySlug: slug,
            },
            ctx.now,
          ),
        );
      }

      if (published.length >= 3 && comps.length === 0) {
        issues.push(
          issue(
            {
              type: "PRODUCT_ECOSYSTEM_GAP",
              level: "readiness",
              message: `${slug}: missing comparison ecosystem`,
              categorySlug: slug,
            },
            ctx.now,
          ),
        );
      }

      if (override.categoryContentReady && best.length === 0 && published.length >= 4) {
        issues.push(
          issue(
            {
              type: "BEST_PAGE_COVERAGE_GAP",
              level: "readiness",
              message: `${slug}: best page missing despite publishable pool`,
              categorySlug: slug,
            },
            ctx.now,
          ),
        );
      }

      for (const b of best) {
        const eligible = b.eligibleProductSlugs;
        // Job-cluster best pages often leave recommendations[] empty on purpose
        // (no cross-cluster ranked list). Count editor’s picks, decision paths,
        // and landscape groups as evaluated coverage.
        const evaluated = new Set<string>([
          ...b.recommendations.map((r) => r.productSlug),
          ...b.useCaseRecommendations.map((r) => r.productSlug),
          ...b.decisionPaths.map((r) => r.productSlug),
          ...b.landscape.flatMap((g) => g.productSlugs),
        ]);
        for (const e of eligible) {
          if (!evaluated.has(e) && published.some((p) => p.slug === e)) {
            issues.push(
              issue(
                {
                  type: "EVALUATION_GAP",
                  level: "quality",
                  message: `${b.slug}: eligible product ${e} not evaluated (not a ranking error)`,
                  categorySlug: slug,
                  productSlug: e,
                  contentId: `content:best:${b.slug}`,
                },
                ctx.now,
              ),
            );
          }
        }
      }

      return issues;
    },
  },
  {
    id: "product-ecosystem",
    level: "readiness",
    description: "Per-product content ecosystem completeness",
    run(ctx) {
      const issues = [];
      const products = ctx.productSlug
        ? [getSoftwareBySlug(ctx.productSlug, { includeUnpublished: true })].filter(
            Boolean,
          )
        : ctx.categorySlug
          ? getSoftwareByCategory(ctx.categorySlug, { includeUnpublished: true })
          : getAllSoftwareUnfiltered();
      const allSoftware = getAllSoftwareUnfiltered();
      const knownSlugs = new Set(allSoftware.map((item) => item.slug));

      for (const product of products) {
        if (!product) continue;
        const tier = assessProductMaturity(product.slug);
        const enrichment = loadEnrichment(product.slug);
        const alts = getAllAlternativesUnfiltered().find(
          (a) => a.sourceSlug === product.slug || a.slug === product.slug,
        );
        const comps = getAllComparisonsUnfiltered().filter((c) =>
          c.productSlugs.includes(product.slug),
        );
        const bestEligible = getAllBestPagesUnfiltered().some(
          (b) =>
            b.eligibleProductSlugs.includes(product.slug) ||
            b.recommendations.some((r) => r.productSlug === product.slug),
        );

        if (product.metadata.status === "published" && !enrichment) {
          issues.push(
            issue(
              {
                type: "RESEARCH_GAP",
                level: "readiness",
                message: `${product.name}: published without enrichment`,
                productSlug: product.slug,
                categorySlug: product.primaryCategorySlug,
                evidence: `maturity=${tier}`,
              },
              ctx.now,
            ),
          );
        }

        if (
          (tier === "TIER_3_CORE_PAGE" ||
            tier === "TIER_4_DECISION_ECOSYSTEM" ||
            tier === "TIER_5_FULLY_INTEGRATED") &&
          !alts &&
          catalogueSubstituteSlugs(product, allSoftware).length >= 2
        ) {
          issues.push(
            issue(
              {
                type: "MISSING_ALT_CONTEXT",
                level: "readiness",
                message: `${product.name}: catalogue substitutes exist but no alternatives page`,
                productSlug: product.slug,
              },
              ctx.now,
            ),
          );
        }

        if (
          product.competitorSlugs.filter(
            (slug) => knownSlugs.has(slug) && slug !== product.slug,
          ).length >= 2 &&
          comps.length === 0 &&
          product.metadata.status === "published"
        ) {
          issues.push(
            issue(
              {
                type: "PRODUCT_ECOSYSTEM_GAP",
                level: "readiness",
                message: `${product.name}: competitors listed but no comparison pages`,
                productSlug: product.slug,
                evidence: product.competitorSlugs.slice(0, 3).join(", "),
              },
              ctx.now,
            ),
          );
        }

        if (bestEligible === false && product.primaryCategorySlug === "crm") {
          // informational only when CRM pool
        }

        void bestEligible;
      }
      return issues;
    },
  },
];
