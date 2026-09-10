/**
 * KEEP_INDEX guides vs sitemap-guides.xml reconciliation.
 *
 *   npx tsx scripts/seo/reconcile-guides-sitemap.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getGuides } from "@/data/repositories/guides";
import {
  evaluateGuideQuality,
  isEntityIndexable,
} from "@/domain/quality-gates";
import {
  getSitemapPublicationContext,
  isContentVisible,
} from "@/domain/publication-context";
import { getSitemapEntries } from "@/seo/sitemap";
import {
  isFactoryProductPackGuide,
  isGuideSearchIndexWorthy,
  isProductExplainerGuide,
  runGuidesIndexAudit,
} from "@/services/seo/guides-index-worthiness";
import { estimateGuideUniqueContentRatio } from "@/services/seo/guides-index-worthiness/uniqueness";

function guideSlugFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/^\/guides\/([^/]+)\/?$/);
    return m?.[1] ?? null;
  } catch {
    const m = url.match(/\/guides\/([^/]+)\/?$/);
    return m?.[1] ?? null;
  }
}

type ExclusionRow = {
  slug: string;
  url: string;
  guideType: string;
  categorySlug: string | null;
  seoIndexable: boolean | null;
  status: string | null;
  scheduledAt: string | null;
  canonicalPath: string | null;
  publicationVisible: boolean | null;
  exclusionReasons: string[];
};

function exclusionReasonsFor(
  slug: string,
  now: Date,
): Omit<ExclusionRow, "slug" | "url" | "guideType" | "categorySlug"> & {
  found: boolean;
} {
  const g = getGuides({ includeUnpublished: true }).find((x) => x.slug === slug);
  if (!g) {
    return {
      found: false,
      seoIndexable: null,
      status: null,
      scheduledAt: null,
      canonicalPath: null,
      publicationVisible: null,
      exclusionReasons: ["not_returned_by_getGuides_includeUnpublished"],
    };
  }

  const ctx = getSitemapPublicationContext(now);
  const publicationVisible = isContentVisible(
    {
      status: g.metadata.status,
      publishedAt: g.metadata.publishedAt,
      scheduledAt: g.metadata.scheduledAt,
    },
    ctx,
    now,
  );

  const reasons: string[] = [];

  if (!publicationVisible) {
    if (g.metadata.status === "scheduled") {
      const future =
        g.metadata.scheduledAt != null &&
        Date.parse(g.metadata.scheduledAt) > now.getTime();
      reasons.push(
        future
          ? `publication_gate:scheduled_in_future(scheduledAt=${g.metadata.scheduledAt})`
          : `publication_gate:scheduled_not_visible(status=scheduled;scheduledAt=${g.metadata.scheduledAt ?? "null"})`,
      );
    } else {
      reasons.push(
        `publication_gate:not_visible(status=${g.metadata.status})`,
      );
    }
  }

  if (g.seo?.indexable !== true) {
    reasons.push(
      publicationVisible
        ? "seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)"
        : "seo.indexable=false",
    );
  }

  if (!isGuideSearchIndexWorthy(g)) {
    const detail: string[] = [];
    if (isFactoryProductPackGuide(g)) detail.push("factory_product_pack");
    if (isProductExplainerGuide(g)) detail.push("product_explainer");
    if (!g.title?.trim()) detail.push("missing_title");
    const hasBlocks = (g.blocks?.length ?? 0) >= 3;
    const hasSections = (g.sections?.length ?? 0) >= 2;
    if (!hasBlocks && !hasSections) detail.push("thin_blocks_and_sections");
    if (!(g.supports?.length > 0)) detail.push("missing_supports");
    const uniq = estimateGuideUniqueContentRatio(g);
    if (uniq.ratio < 0.35) detail.push(`unique_ratio=${uniq.ratio.toFixed(3)}<0.35`);
    if (uniq.boilerplateShare >= 0.55) {
      detail.push(`boilerplateShare=${uniq.boilerplateShare.toFixed(3)}>=0.55`);
    }
    reasons.push(
      `fails_isGuideSearchIndexWorthy(${detail.join("|") || "unspecified"})`,
    );
  }

  const q = evaluateGuideQuality(g);
  if (!q.ok) {
    reasons.push(`evaluateGuideQuality:${q.failures.join(",")}`);
  }

  const canon = g.seo.canonicalPath;
  if (canon && !canon.startsWith("/guides/")) {
    reasons.push(`canonicalPath_outside_guides_partition=${canon}`);
  }

  // Only mark entity-indexable failure if still unexplained after above
  if (
    reasons.length === 0 &&
    !isEntityIndexable({ kind: "guide", entity: g }, now, ctx)
  ) {
    reasons.push("fails_isEntityIndexable_unspecified");
  }

  if (reasons.length === 0) {
    reasons.push("unknown_absent_from_sitemap");
  }

  return {
    found: true,
    seoIndexable: g.seo.indexable ?? null,
    status: g.metadata.status ?? null,
    scheduledAt: g.metadata.scheduledAt ?? null,
    canonicalPath: g.seo.canonicalPath ?? null,
    publicationVisible,
    exclusionReasons: reasons,
  };
}

function main() {
  const now = new Date();
  const audit = runGuidesIndexAudit();
  const keep = audit.evaluations.filter((e) => e.classification === "KEEP_INDEX");

  const sitemapGuideSlugs = new Set<string>();
  for (const entry of getSitemapEntries(now)) {
    if (entry.contentType !== "guides") continue;
    const slug = guideSlugFromUrl(entry.url);
    if (slug) sitemapGuideSlugs.add(slug);
  }

  const rows: ExclusionRow[] = [];
  for (const e of keep) {
    if (sitemapGuideSlugs.has(e.slug)) continue;
    const detail = exclusionReasonsFor(e.slug, now);
    rows.push({
      slug: e.slug,
      url: e.url,
      guideType: e.guideType,
      categorySlug: e.categorySlug,
      seoIndexable: detail.seoIndexable,
      status: detail.status,
      scheduledAt: detail.scheduledAt,
      canonicalPath: detail.canonicalPath,
      publicationVisible: detail.publicationVisible,
      exclusionReasons: detail.exclusionReasons,
    });
  }

  const byReason = new Map<string, number>();
  for (const row of rows) {
    const key = row.exclusionReasons.join(" + ");
    byReason.set(key, (byReason.get(key) ?? 0) + 1);
  }

  const incorrect = rows.filter((r) =>
    r.exclusionReasons.some((x) => x.includes("incorrect")),
  );

  const byReasonFamily = new Map<string, number>();
  for (const row of rows) {
    for (const reason of row.exclusionReasons) {
      const family = reason.startsWith("publication_gate:scheduled_in_future")
        ? "publication_gate:scheduled_in_future"
        : reason;
      byReasonFamily.set(family, (byReasonFamily.get(family) ?? 0) + 1);
    }
  }

  const summary = {
    generatedAt: now.toISOString(),
    keepIndexCount: keep.length,
    sitemapGuideEntityCount: sitemapGuideSlugs.size,
    keepIndexInSitemap: keep.length - rows.length,
    excludedKeepIndexCount: rows.length,
    incorrectExclusions: incorrect.length,
    byReasonFamily: Object.fromEntries(
      [...byReasonFamily.entries()].sort((a, b) => b[1] - a[1]),
    ),
    byReason: Object.fromEntries(
      [...byReason.entries()].sort((a, b) => b[1] - a[1]),
    ),
  };

  console.log(JSON.stringify(summary, null, 2));

  const outDir = path.join(process.cwd(), "docs/seo");
  mkdirSync(outDir, { recursive: true });
  const mdPath = path.join(outDir, "GUIDES-SITEMAP-RECONCILIATION.md");

  const lines: string[] = [
    "# Guides sitemap reconciliation",
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| KEEP_INDEX (audit) | ${summary.keepIndexCount} |`,
    `| sitemap-guides entity URLs | ${summary.sitemapGuideEntityCount} |`,
    `| KEEP_INDEX present in sitemap | ${summary.keepIndexInSitemap} |`,
    `| KEEP_INDEX excluded from sitemap | ${summary.excludedKeepIndexCount} |`,
    `| Incorrect exclusions (should be fixed) | ${summary.incorrectExclusions} |`,
    "",
    "## Why the gap exists",
    "",
    "Sitemap inclusion uses `isEntityIndexable()` which requires **both**:",
    "",
    "1. `seo.indexable === true`",
    "2. Publication visibility (`status` / `scheduledAt` via `isContentVisible` for SITEMAP context)",
    "3. Guide quality + `isGuideSearchIndexWorthy` (KEEP_INDEX hard gates)",
    "",
    "The guides index-worthiness audit classifies educational substance as **KEEP_INDEX** without applying the publication schedule gate. Future-scheduled KEEP_INDEX guides are therefore correctly absent from `sitemap-guides.xml` until `scheduledAt`.",
    "",
    "Incorrect pattern (fixed): coupling schedule wrappers to `seo.indexable: false`, which never flipped when the schedule fired.",
    "",
    "## Exclusion reason summary",
    "",
    "| Count | Reason family |",
    "| ---: | --- |",
  ];

  for (const [reason, count] of Object.entries(summary.byReasonFamily)) {
    lines.push(`| ${count} | \`${reason}\` |`);
  }

  lines.push(
    "",
    "### Exact reason strings (including scheduledAt)",
    "",
    "| Count | Reason |",
    "| ---: | --- |",
  );

  for (const [reason, count] of Object.entries(summary.byReason)) {
    lines.push(`| ${count} | \`${reason}\` |`);
  }

  lines.push(
    "",
    "## Every KEEP_INDEX guide excluded from sitemap-guides",
    "",
    "| Slug | Type | Category | Status | scheduledAt | seo.indexable | Pub visible | Exclusion reason |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
  );

  for (const row of rows.sort((a, b) => a.slug.localeCompare(b.slug))) {
    lines.push(
      `| \`${row.slug}\` | ${row.guideType} | ${row.categorySlug ?? "—"} | ${row.status ?? "—"} | ${row.scheduledAt ?? "—"} | ${row.seoIndexable} | ${row.publicationVisible} | ${row.exclusionReasons.map((r) => `\`${r}\``).join("<br>")} |`,
    );
  }
  lines.push("");

  writeFileSync(mdPath, `${lines.join("\n")}\n`, "utf8");
  mkdirSync(path.join(process.cwd(), "data/seo"), { recursive: true });
  writeFileSync(
    path.join(process.cwd(), "data/seo/guides-sitemap-reconciliation.json"),
    `${JSON.stringify({ summary, rows }, null, 2)}\n`,
    "utf8",
  );
  console.log(`Wrote ${mdPath}`);
}

main();
