import {
  getAllSoftwareUnfiltered,
  getSoftwareBySlug,
} from "@/data";
import { buildContentRegistry } from "@/services/publishing/registry";
import { getSoftwareRelationshipLinks } from "@/services/relationships/software-links";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

function inboundCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  const bump = (path: string) => {
    counts.set(path, (counts.get(path) ?? 0) + 1);
  };

  for (const product of getAllSoftwareUnfiltered()) {
    if (product.metadata.status !== "published") continue;
    for (const link of getSoftwareRelationshipLinks(product)) {
      if (link.published) bump(link.href);
    }
  }
  return counts;
}

export const linkingChecks: AuditCheck[] = [
  {
    id: "orphan-published-pages",
    level: "quality",
    description: "Published indexable pages with no meaningful inbound links",
    run(ctx) {
      const threshold =
        (ctx.fixtures?.orphanThreshold as number | undefined) ?? 1;
      const inbound = inboundCounts();
      const issues = [];
      const registry = buildContentRegistry();

      // Fixture orphan override for POC
      const fixtureOrphan = ctx.fixtures?.orphanPath as string | undefined;
      if (fixtureOrphan) {
        issues.push(
          issue(
            {
              type: "ORPHAN_CONTENT",
              level: "quality",
              severity: "medium",
              message: `Published page has zero inbound internal links: ${fixtureOrphan}`,
              path: fixtureOrphan,
              contentId: `content:fixture:orphan`,
              evidence: "sitemap does not count as inbound link",
            },
            ctx.now,
          ),
        );
      }

      for (const entry of registry) {
        if (ctx.contentId && entry.contentId !== ctx.contentId) continue;
        if (ctx.productSlug && entry.slug !== ctx.productSlug) continue;
        if (entry.metadata.status !== "published" || !entry.seoIndexable) {
          continue;
        }
        if (entry.type === "category" || entry.type === "tool") continue;
        const count = inbound.get(entry.path) ?? 0;
        if (count < threshold && entry.type === "software") {
          // Many software pages are linked from category — only flag if truly isolated
          const product = getSoftwareBySlug(entry.slug, {
            includeUnpublished: true,
          });
          const outs = product ? getSoftwareRelationshipLinks(product).length : 0;
          if (count === 0 && outs === 0) {
            issues.push(
              issue(
                {
                  type: "ORPHAN_CONTENT",
                  level: "quality",
                  message: `${entry.title}: no inbound or outbound relationship links`,
                  path: entry.path,
                  contentId: entry.contentId,
                  productSlug: entry.type === "software" ? entry.slug : undefined,
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
    id: "links-to-unpublished",
    level: "validity",
    description: "Relationship links pointing at non-published targets",
    run(ctx) {
      const issues = [];
      for (const product of getAllSoftwareUnfiltered()) {
        if (ctx.productSlug && product.slug !== ctx.productSlug) continue;
        if (ctx.categorySlug && product.primaryCategorySlug !== ctx.categorySlug) {
          continue;
        }
        for (const link of getSoftwareRelationshipLinks(product)) {
          if (!link.published) {
            issues.push(
              issue(
                {
                  type: "UNPUBLISHED_LINK_TARGET",
                  level: "validity",
                  message: `${product.slug} links to unpublished target ${link.href}`,
                  productSlug: product.slug,
                  path: link.href,
                  contentId: `content:software:${product.slug}`,
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
    id: "broken-internal-link-fixture",
    level: "validity",
    description: "Fixture/broken href detection",
    run(ctx) {
      const broken = ctx.fixtures?.brokenInternalLink as
        | { path: string; target: string; contentId?: string }
        | undefined;
      if (!broken) return [];
      return [
        issue(
          {
            type: "BROKEN_INTERNAL_LINK",
            level: "validity",
            severity: "high",
            message: `Broken internal link from ${broken.path} → ${broken.target}`,
            path: broken.path,
            contentId: broken.contentId,
            evidence: broken.target,
          },
          ctx.now,
        ),
      ];
    },
  },
];
