import {
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getSoftwareBySlug,
} from "@/data";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

/**
 * Cross-page editorial consistency — flag for review, don't assume which is wrong.
 */
export const editorialConsistencyChecks: AuditCheck[] = [
  {
    id: "score-consistency",
    level: "quality",
    description: "Detect conflicting scores across product/best surfaces",
    run(ctx) {
      const issues = [];
      const bestPages = getAllBestPagesUnfiltered();
      for (const best of bestPages) {
        if (ctx.categorySlug && best.categorySlug !== ctx.categorySlug) continue;
        for (const rec of best.recommendations) {
          if (ctx.productSlug && rec.productSlug !== ctx.productSlug) continue;
          const product = getSoftwareBySlug(rec.productSlug, {
            includeUnpublished: true,
          });
          if (!product) continue;
          const productScore = (
            product as { editorialScore?: number; score?: number }
          ).editorialScore;
          if (
            typeof productScore === "number" &&
            typeof rec.score === "number" &&
            Math.abs(productScore - rec.score) >= 0.4
          ) {
            issues.push(
              issue(
                {
                  type: "INCONSISTENT_EDITORIAL_POSITION",
                  level: "quality",
                  message: `${product.name}: product score ${productScore} vs best-page score ${rec.score} without methodology note`,
                  productSlug: product.slug,
                  contentId: `content:best:${best.slug}`,
                  path: `/best/${best.slug}/`,
                  evidence: `delta=${Math.abs(productScore - rec.score).toFixed(1)}`,
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
    id: "comparison-best-rationale-conflict",
    level: "quality",
    description: "Flag fixture/injected conflicting editorial conclusions",
    run(ctx) {
      const fixture = ctx.fixtures?.editorialConflict as
        | {
            productSlug: string;
            comparisonClaim: string;
            bestClaim: string;
          }
        | undefined;
      if (!fixture) return [];
      return [
        issue(
          {
            type: "INCONSISTENT_EDITORIAL_POSITION",
            level: "quality",
            severity: "high",
            message: `${fixture.productSlug}: comparison vs best-page editorial conflict`,
            productSlug: fixture.productSlug,
            evidence: `comparison: ${fixture.comparisonClaim} | best: ${fixture.bestClaim}`,
          },
          ctx.now,
        ),
      ];
    },
  },
  {
    id: "best-ranking-integrity-signals",
    level: "quality",
    description: "Suspicious ranking correlations (warn only)",
    run(ctx) {
      const issues = [];
      for (const best of getAllBestPagesUnfiltered()) {
        if (ctx.categorySlug && best.categorySlug !== ctx.categorySlug) continue;
        const recs = best.recommendations.filter((r) => r.approved);
        if (recs.length < 2) continue;
        const slugs = recs
          .slice()
          .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
          .map((r) => r.productSlug);
        const alpha = [...slugs].sort((a, b) => a.localeCompare(b));
        if (slugs.every((s, i) => s === alpha[i])) {
          issues.push(
            issue(
              {
                type: "RANKING_INTEGRITY",
                level: "quality",
                severity: "medium",
                message: `Best page ${best.slug}: ranking matches alphabetical order — review for integrity`,
                contentId: `content:best:${best.slug}`,
                path: `/best/${best.slug}/`,
                categorySlug: best.categorySlug,
                evidence: "correlation only — not proof of bias",
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
    id: "thin-review-signals",
    level: "quality",
    description: "Published software lacking decision signals",
    run(ctx) {
      const issues = [];
      const products = ctx.productSlug
        ? [getSoftwareBySlug(ctx.productSlug, { includeUnpublished: true })].filter(
            Boolean,
          )
        : getAllSoftwareUnfiltered();
      for (const product of products) {
        if (!product) continue;
        if (ctx.categorySlug && product.primaryCategorySlug !== ctx.categorySlug) {
          continue;
        }
        if (product.metadata.status !== "published") continue;
        const hasDecision =
          (product.alternativeSlugs?.length ?? 0) > 0 ||
          (product.competitorSlugs?.length ?? 0) > 0;
        const shortDesc =
          !product.shortDescription || product.shortDescription.length < 40;
        if (!hasDecision && shortDesc) {
          issues.push(
            issue(
              {
                type: "THIN_CONTENT",
                level: "quality",
                message: `${product.name}: thin decision value (no alternatives/competitors + weak description)`,
                productSlug: product.slug,
                path: `/software/${product.slug}/`,
                contentId: `content:software:${product.slug}`,
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
    id: "comparison-evidence-parity",
    level: "quality",
    description: "Comparisons with asymmetric product presence",
    run(ctx) {
      const issues = [];
      for (const cmp of getAllComparisonsUnfiltered()) {
        if (ctx.productSlug && !cmp.productSlugs.includes(ctx.productSlug)) {
          continue;
        }
        const [a, b] = cmp.productSlugs;
        const pa = getSoftwareBySlug(a, { includeUnpublished: true });
        const pb = getSoftwareBySlug(b, { includeUnpublished: true });
        if (!pa || !pb) {
          issues.push(
            issue(
              {
                type: "COMPARISON_EVIDENCE_IMBALANCE",
                level: "quality",
                message: `Comparison ${cmp.slug}: missing product entity for evidence parity`,
                contentId: `content:compare:${cmp.slug}`,
                path: `/compare/${cmp.slug}/`,
              },
              ctx.now,
            ),
          );
        }
        const outcomes = cmp.outcomes ?? [];
        if (
          cmp.seo?.indexable &&
          cmp.metadata?.status === "published" &&
          (!cmp.verdict?.trim() ||
            outcomes.filter(
              (o) =>
                Boolean(o.reason?.trim()) &&
                o.researchStatus !== "in-progress" &&
                o.researchStatus !== "none",
            ).length < 3)
        ) {
          issues.push(
            issue(
              {
                type: "COMPARISON_EVIDENCE_IMBALANCE",
                level: "quality",
                message: `Comparison ${cmp.slug}: indexable page is structurally incomplete (missing verdict or researched criteria)`,
                contentId: `content:compare:${cmp.slug}`,
                path: `/compare/${cmp.slug}/`,
              },
              ctx.now,
            ),
          );
        }
        for (const o of outcomes) {
          if (!o.reason && o.winnerSlug) {
            issues.push(
              issue(
                {
                  type: "COMPARISON_EVIDENCE_IMBALANCE",
                  level: "quality",
                  message: `Comparison ${cmp.slug}: criterion ${o.criterionSlug} has winner without reason`,
                  contentId: `content:compare:${cmp.slug}`,
                  section: o.criterionSlug,
                },
                ctx.now,
              ),
            );
          }
          if (
            (o.supportingFactIds?.length ?? 0) === 0 &&
            (o.winnerKind === "product-a" || o.winnerKind === "product-b")
          ) {
            issues.push(
              issue(
                {
                  type: "COMPARISON_EVIDENCE_IMBALANCE",
                  level: "quality",
                  message: `Comparison ${cmp.slug}: ${o.criterionSlug} lacks supporting facts`,
                  contentId: `content:compare:${cmp.slug}`,
                  section: o.criterionSlug,
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
];
