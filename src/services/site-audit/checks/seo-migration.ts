import {
  getAllSoftwareUnfiltered,
  getMigrationRecords,
} from "@/data";
import { buildContentRegistry } from "@/services/publishing/registry";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

export const seoMigrationChecks: AuditCheck[] = [
  {
    id: "canonical-path-alignment",
    level: "validity",
    description: "SEO canonical path matches content path",
    run(ctx) {
      const issues = [];
      for (const product of getAllSoftwareUnfiltered()) {
        if (ctx.productSlug && product.slug !== ctx.productSlug) continue;
        const expected = `/software/${product.slug}/`;
        if (
          product.seo.canonicalPath &&
          product.seo.canonicalPath !== expected
        ) {
          issues.push(
            issue(
              {
                type: "INVALID_CANONICAL",
                level: "validity",
                message: `${product.slug}: canonical ${product.seo.canonicalPath} ≠ ${expected}`,
                productSlug: product.slug,
                path: expected,
                contentId: `content:software:${product.slug}`,
              },
              ctx.now,
            ),
          );
        }
        if (product.seo.indexable && product.metadata.status !== "published") {
          issues.push(
            issue(
              {
                type: "SEO_METADATA_INVALID",
                level: "validity",
                message: `${product.slug}: indexable but not published`,
                productSlug: product.slug,
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
    id: "duplicate-intent-software-legacy",
    level: "quality",
    description: "Live software page vs legacy review URL same intent",
    run(ctx) {
      const issues = [];
      const fixture = ctx.fixtures?.duplicateIntent as
        | { livePath: string; legacyPath: string; productSlug: string }
        | undefined;

      if (fixture) {
        issues.push(
          issue(
            {
              type: "DUPLICATE_INTENT",
              level: "quality",
              severity: "high",
              message: `Duplicate intent: ${fixture.livePath} and ${fixture.legacyPath}`,
              productSlug: fixture.productSlug,
              path: fixture.livePath,
              evidence: `Recommend REDIRECT ${fixture.legacyPath} → ${fixture.livePath}`,
              contentId: `content:software:${fixture.productSlug}`,
            },
            ctx.now,
          ),
        );
      }

      // Migration ledger: KEEP/REWRITE pointing at software while another live path exists
      for (const record of getMigrationRecords()) {
        if (record.action !== "KEEP" && record.action !== "REWRITE") continue;
        const source = record.source.toLowerCase();
        if (!source.includes("review") && !source.includes("pipedrive")) continue;
        const slugMatch = getAllSoftwareUnfiltered().find((p) =>
          source.includes(p.slug),
        );
        if (!slugMatch) continue;
        if (ctx.productSlug && slugMatch.slug !== ctx.productSlug) continue;
        if (
          slugMatch.metadata.status === "published" &&
          slugMatch.seo.indexable
        ) {
          issues.push(
            issue(
              {
                type: "DUPLICATE_INTENT",
                level: "quality",
                message: `Legacy ${record.source} may duplicate /software/${slugMatch.slug}/`,
                productSlug: slugMatch.slug,
                path: `/software/${slugMatch.slug}/`,
                evidence: `migration action=${record.action}`,
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
    id: "migration-redirect-integrity",
    level: "validity",
    description: "Redirect records sanity",
    run(ctx) {
      const issues = [];
      const bySource = new Map<string, string>();
      for (const record of getMigrationRecords()) {
        if (record.action !== "REDIRECT") continue;
        if (!record.target) {
          issues.push(
            issue(
              {
                type: "INVALID_REDIRECT",
                level: "validity",
                message: `Redirect missing target: ${record.source}`,
                evidence: record.id,
              },
              ctx.now,
            ),
          );
          continue;
        }
        bySource.set(record.source, record.target);
        if (record.target === record.source) {
          issues.push(
            issue(
              {
                type: "INVALID_REDIRECT",
                level: "validity",
                message: `Redirect loop: ${record.source}`,
                evidence: record.id,
              },
              ctx.now,
            ),
          );
        }
      }
      for (const [source, target] of bySource) {
        if (bySource.has(target)) {
          issues.push(
            issue(
              {
                type: "REDIRECT_CHAIN",
                level: "validity",
                message: `Redirect chain: ${source} → ${target} → …`,
                evidence: source,
              },
              ctx.now,
            ),
          );
        }
      }

      const fixture = ctx.fixtures?.redirectIssue as
        | { source: string; target: string; kind: "loop" | "chain" }
        | undefined;
      if (fixture) {
        issues.push(
          issue(
            {
              type:
                fixture.kind === "loop" ? "INVALID_REDIRECT" : "REDIRECT_CHAIN",
              level: "validity",
              message: `Fixture redirect ${fixture.kind}: ${fixture.source} → ${fixture.target}`,
              evidence: fixture.source,
            },
            ctx.now,
          ),
        );
      }
      return issues;
    },
  },
  {
    id: "title-metadata",
    level: "quality",
    description: "Missing or duplicate titles among published pages",
    run(ctx) {
      const issues = [];
      const registry = buildContentRegistry().filter(
        (e) => e.metadata.status === "published",
      );
      const titles = new Map<string, string[]>();
      for (const e of registry) {
        if (ctx.productSlug && e.slug !== ctx.productSlug) continue;
        const title = e.title.trim().toLowerCase();
        const list = titles.get(title) ?? [];
        list.push(e.contentId);
        titles.set(title, list);
      }
      for (const [title, ids] of titles) {
        if (ids.length > 1) {
          issues.push(
            issue(
              {
                type: "TITLE_ISSUE",
                level: "quality",
                severity: "low",
                message: `Duplicate title "${title}" across ${ids.length} pages`,
                evidence: ids.join(", "),
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
    id: "commercial-ranking-informational-intent",
    level: "quality",
    description:
      "Commercial anchors ranking for informational queries may need supporting guides",
    run(ctx) {
      const fixture = ctx.fixtures?.informationalOnCommercial as
        | {
            path: string;
            query: string;
            contentId: string;
            suggestedGuideSlug?: string;
          }
        | undefined;
      if (!fixture) return [];
      return [
        issue(
          {
            type: "PAGE_PURPOSE_MISMATCH",
            level: "quality",
            severity: "medium",
            message: `${fixture.path} ranking for informational query "${fixture.query}" — consider supporting guide`,
            path: fixture.path,
            contentId: fixture.contentId,
            evidence: fixture.suggestedGuideSlug
              ? `Candidate guide: ${fixture.suggestedGuideSlug}`
              : "Map query to CategoryKnowledgeMap intentClusterKeys",
          },
          ctx.now,
        ),
      ];
    },
  },
];
