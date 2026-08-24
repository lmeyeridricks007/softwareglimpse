#!/usr/bin/env npx tsx
/**
 * Category-scoped content opportunity audit.
 *
 * Usage: npx tsx scripts/generate-content-opportunity-audit.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  getAllSoftwareUnfiltered,
  getBestPages,
  getComparisonsForProduct,
  getTopLevelCategories,
} from "@/data";
import { getGuidesByProduct } from "@/data/repositories/guides";
import { getEducationalGuides } from "@/data/repositories/guides-educational";
import { affiliateInventoryRows } from "@/data/catalogue/source/affiliate-inventory";
import { partnerLinks } from "@/data/affiliates/source/partner-links";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import { loadEnrichment } from "@/data/research/store";
import { buildProductGuidePackForSlug } from "@/services/product-guides/build";
import {
  assessCategoryMaturity,
  assessProductMaturity,
  clusterCompletionScore,
} from "@/services/catalogue-onboarding/maturity";
import { isEntityIndexable } from "@/domain/quality-gates";

const OUT = join(
  process.cwd(),
  "docs/catalogue/CONTENT-OPPORTUNITY-AUDIT-LATEST.md",
);

const PACK_BUILDER_CATEGORIES = new Set([
  "crm",
  "sales-intelligence",
  "email-marketing",
  "marketing",
  "business-communications",
  "hr",
  "ecommerce",
  "project-management",
  "ai",
  "it-development",
]);

type ProductSnapshot = {
  slug: string;
  name: string;
  category: string;
  status: string;
  affiliate: boolean;
  reviewOk: boolean;
  enrichment: boolean;
  packGuides: number;
  csShortGuides: number;
  eduGuides: number;
  productGuides: number;
  bestEligible: boolean;
  bestOnShortlist: boolean;
  indexable: boolean;
  comps: number;
  maturity: string;
  revenueMinor: number;
};

function countCsShortGuides(
  slug: string,
  educational: ReturnType<typeof getEducationalGuides>,
): number {
  const expected = new Set([`what-is-${slug}`, `is-${slug}-worth-it`]);
  return educational.filter((g) => expected.has(g.slug)).length;
}

function inventoryRevenueBySlug(): Map<string, number> {
  const partnerToSource = new Map(
    partnerLinks
      .filter((p) => p.catalogueSourceId)
      .map((p) => [p.productSlug, p.catalogueSourceId!]),
  );
  const revenueBySource = new Map(
    affiliateInventoryRows.map((r) => [r.sourceId, r.revenueAmountMinor ?? 0]),
  );
  const map = new Map<string, number>();
  for (const [slug, sourceId] of partnerToSource) {
    map.set(slug, revenueBySource.get(sourceId) ?? 0);
  }
  return map;
}

function tableRow(cols: string[]): string {
  return `| ${cols.join(" | ")} |`;
}

function slugList(slugs: string[], perLine = 6): string {
  if (!slugs.length) return "_None._\n";
  const lines: string[] = [];
  for (let i = 0; i < slugs.length; i += perLine) {
    lines.push(slugs.slice(i, i + perLine).map((s) => `\`${s}\``).join(", "));
  }
  return lines.join("\n") + "\n";
}

function bestPageForCategory(
  categorySlug: string,
  bestPages: ReturnType<typeof getBestPages>,
) {
  return bestPages.find((b) => b.categorySlug === categorySlug);
}

function hasProductWhatIsGuide(
  slug: string,
  educational: ReturnType<typeof getEducationalGuides>,
): boolean {
  return educational.some((g) => g.slug === `what-is-${slug}`);
}

function isOnBestShortlist(
  slug: string,
  bestPages: ReturnType<typeof getBestPages>,
): boolean {
  return bestPages.some(
    (b) =>
      b.recommendations.some((r) => r.productSlug === slug) ||
      (b.useCaseRecommendations ?? []).some((r) => r.productSlug === slug) ||
      (b.decisionPaths ?? []).some((r) => r.productSlug === slug) ||
      (b.landscape ?? []).some((g) => g.productSlugs.includes(slug)),
  );
}

function snapshotProduct(
  s: (ReturnType<typeof getAllSoftwareUnfiltered>)[number],
  educational: ReturnType<typeof getEducationalGuides>,
  bestPages: ReturnType<typeof getBestPages>,
  affiliateSlugs: Set<string>,
  revenueBySlug: Map<string, number>,
): ProductSnapshot {
  const assessment = loadAssessment(s.slug);
  const review = loadReview(s.slug);
  const reviewOk =
    assessment?.status === "approved" &&
    review?.editorialStatus === "approved";
  const packGuides = buildProductGuidePackForSlug(s.slug).length;
  const productGuides = getGuidesByProduct(s.slug, {
    includeUnpublished: true,
  }).length;
  const eduGuides = educational.filter((g) =>
    g.productSlugs.includes(s.slug),
  ).length;
  const csShortGuides = countCsShortGuides(s.slug, educational);

  return {
    slug: s.slug,
    name: s.name,
    category: s.primaryCategorySlug,
    status: s.metadata.status,
    affiliate: affiliateSlugs.has(s.slug),
    reviewOk,
    enrichment: Boolean(loadEnrichment(s.slug)),
    packGuides,
    csShortGuides,
    eduGuides,
    productGuides,
    bestEligible: bestPages.some(
      (b) =>
        b.eligibleProductSlugs.includes(s.slug) ||
        b.recommendations.some((r) => r.productSlug === s.slug),
    ),
    bestOnShortlist: isOnBestShortlist(s.slug, bestPages),
    indexable: isEntityIndexable({ kind: "software", entity: s }),
    comps: getComparisonsForProduct(s.slug, { includeUnpublished: true })
      .length,
    maturity: assessProductMaturity(s.slug),
    revenueMinor: revenueBySlug.get(s.slug) ?? 0,
  };
}

function gapScore(p: ProductSnapshot): { score: number; gaps: string[] } {
  const gaps: string[] = [];
  let score = 0;
  if (!p.reviewOk) {
    gaps.push("review");
    score += 50;
  }
  if (!p.enrichment) {
    gaps.push("research");
    score += 20;
  }
  if (p.packGuides === 0 && PACK_BUILDER_CATEGORIES.has(p.category)) {
    gaps.push("5-kind-pack");
    score += 25;
  }
  if (p.packGuides === 0 && p.category === "customer-service" && p.csShortGuides < 2) {
    gaps.push("cs-short-guides");
    score += 22;
  }
  if (p.eduGuides === 0 && p.productGuides === 0) {
    gaps.push("guide-mentions");
    score += 15;
  }
  if (p.affiliate && !p.indexable) {
    gaps.push("indexability");
    score += 18;
  }
  if (
    p.bestEligible &&
    p.packGuides === 0 &&
    !(p.category === "customer-service" && p.csShortGuides >= 2)
  ) {
    gaps.push("best-shortlist-no-pack");
    score += 20;
  }
  if (p.affiliate) score += 15;
  if (p.bestEligible) score += 12;
  if (p.revenueMinor > 1_000_000) score += 25;
  else if (p.revenueMinor > 300_000) score += 15;
  else if (p.revenueMinor > 0) score += 8;
  if (p.status === "scheduled") {
    gaps.push("scheduled-launch");
    score += 5;
  }
  return { score, gaps };
}

function opportunityScore(p: ProductSnapshot): number {
  let score = 0;
  if (p.affiliate) score += 20;
  if (p.revenueMinor > 1_000_000) score += 30;
  else if (p.revenueMinor > 300_000) score += 18;
  if (p.bestEligible) score += 15;
  if (p.eduGuides === 0 && p.reviewOk) score += 25;
  if (p.packGuides >= 5 && p.eduGuides === 0) score += 12;
  if (!p.bestEligible && p.affiliate && p.reviewOk) score += 10;
  if (p.comps < 10 && p.reviewOk) score += 8;
  if (p.maturity.startsWith("TIER_3")) score += 6;
  return score;
}

function main() {
  const software = getAllSoftwareUnfiltered();
  const published = software.filter((s) => s.metadata.status === "published");
  const educational = getEducationalGuides({ includeUnpublished: true });
  const bestPages = getBestPages({ includeUnpublished: true });
  const revenueBySlug = inventoryRevenueBySlug();
  const affiliateSlugs = new Set(
    partnerLinks.filter((p) => p.affiliateUrl).map((p) => p.productSlug),
  );
  const categories = getTopLevelCategories({ includeUnpublished: true }).sort(
    (a, b) => a.slug.localeCompare(b.slug),
  );

  const snapshots = software.map((s) =>
    snapshotProduct(s, educational, bestPages, affiliateSlugs, revenueBySlug),
  );

  const hardGaps = snapshots
    .map((p) => {
      const { score, gaps } = gapScore(p);
      return { ...p, priority: score, gaps };
    })
    .filter((p) => p.gaps.length > 0)
    .sort((a, b) => b.priority - a.priority);

  const deepenOpportunities = published
    .map((s) => snapshots.find((x) => x.slug === s.slug)!)
    .filter((p) => p.reviewOk && p.affiliate && p.eduGuides === 0)
    .sort(
      (a, b) =>
        opportunityScore(b) - opportunityScore(a) || b.revenueMinor - a.revenueMinor,
    );

  const bestExpansion = published
    .map((s) => snapshots.find((x) => x.slug === s.slug)!)
    .filter((p) => p.affiliate && p.reviewOk && !p.bestOnShortlist)
    .sort((a, b) => b.revenueMinor - a.revenueMinor);

  const editorialAnchors = published
    .map((s) => snapshots.find((x) => x.slug === s.slug)!)
    .filter(
      (p) =>
        !p.affiliate &&
        p.reviewOk &&
        p.bestEligible &&
        ["crm", "sales-intelligence", "customer-service", "email-marketing"].includes(
          p.category,
        ) &&
        !hasProductWhatIsGuide(p.slug, educational),
    )
    .sort((a, b) => b.comps - a.comps);

  const lines: string[] = [
    "# Content opportunity audit (by category)",
    "",
    `_Generated ${new Date().toISOString().slice(0, 10)}. Regenerate: \`npm run catalogue:opportunities\`_`,
    "",
    "Strategic view of where SoftwareGlimpse should add or deepen **reviews**, **product guide packs**, **educational guides**, and **best-page** coverage — by category.",
    "",
    "> **Related:** [PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md](./PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md) (inventory gaps) · [Tier 1](../publishing/launches/tier-1-content-2026-08-26.md) · [Tier 2](../publishing/launches/tier-2-deepen-2026-09-01.md) · [Tier 4](../publishing/launches/tier-4-editorial-anchors-2026-10-01.md) · [Tier 5](../publishing/launches/tier-5-ai-affiliate-deepen-2026-11-01.md) · [Tier 6](../publishing/launches/tier-6-crm-affiliate-deepen-2026-12-01.md) · [Tier 7](../publishing/launches/tier-7-cs-short-guides-2026-11-01.md) · [Tier 8](../publishing/launches/tier-8-ecommerce-affiliate-deepen-2026-12-01.md) · [Tier 9](../publishing/launches/tier-9-hr-affiliate-deepen-2026-12-15.md) · [Tier 10](../publishing/launches/tier-10-it-affiliate-deepen-2027-01-01.md) · [Tier 11](../publishing/launches/tier-11-marketing-affiliate-launch-2027-01-11.md) · [Tier 12](../publishing/launches/tier-12-pm-affiliate-deepen-2027-02-01.md)",
    "",
    "## Executive summary",
    "",
    tableRow(["Signal", "Count"]),
    tableRow(["---", "---:"]),
    tableRow(["Published products", String(published.length)]),
    tableRow(["Live affiliate products", String(affiliateSlugs.size)]),
    tableRow(["Hard content gaps (blocking)", String(hardGaps.length)]),
    tableRow([
      "Affiliate + review OK but **no educational guide**",
      String(deepenOpportunities.length),
    ]),
    tableRow([
      "Affiliate + review OK but **not on best page**",
      String(bestExpansion.length),
    ]),
    tableRow([
      "Editorial anchors (no affiliate, on best page)",
      String(editorialAnchors.length),
    ]),
    "",
    "### Category maturity",
    "",
    tableRow(["Category", "Products", "Maturity", "Cluster %", "Guide system"]),
    tableRow(["---", "---:", "---", "---:", "---"]),
  ];

  for (const cat of categories) {
    const count = software.filter((s) => s.primaryCategorySlug === cat.slug)
      .length;
    lines.push(
      tableRow([
        cat.slug,
        String(count),
        assessCategoryMaturity(cat.slug),
        String(clusterCompletionScore(cat.slug)),
        PACK_BUILDER_CATEGORIES.has(cat.slug)
          ? "5-kind pack"
          : cat.slug === "customer-service"
            ? "CS short guides only"
            : "—",
      ]),
    );
  }

  lines.push(
    "",
    "---",
    "",
    "## Tier 1 — Fix now (hard gaps)",
    "",
    "Blocking or launch-critical issues: missing reviews, missing CS guides, scheduled launches awaiting indexability.",
    "",
  );

  if (!hardGaps.length) {
    lines.push("_No hard gaps._", "");
  } else {
    lines.push(
      tableRow(["Priority", "Product", "Category", "Affiliate", "Gaps"]),
      tableRow(["---:", "---", "---", "---", "---"]),
    );
    for (const r of hardGaps.slice(0, 20)) {
      lines.push(
        tableRow([
          String(r.priority),
          `\`${r.slug}\``,
          r.category,
          r.affiliate ? "yes" : "no",
          r.gaps.join(", "),
        ]),
      );
    }
    lines.push(
      "**Launch schedule:** `sellfy` + `ai-intelekt` → [Tier 1](../publishing/launches/tier-1-content-2026-08-26.md) (Aug 2026); `webinarjam-everwebinar` → [Tier 11](../publishing/launches/tier-11-marketing-affiliate-launch-2027-01-11.md) (11–26 Jan 2027).",
      "",
    );
  }

  lines.push(
    "## Tier 2 — Deepen (affiliate + review, no educational guide)",
    "",
    deepenOpportunities.length
      ? `**${deepenOpportunities.length} published affiliate products** have approved reviews and 5-kind packs but **zero** educational guides linking to them. Run \`guide-agent\` for what-is / worth-it / comparison-adjacent clusters.`
      : "**Scheduled:** 5 educational what-is guides in [Tier 2](../publishing/launches/tier-2-deepen-2026-09-01.md) (Sep 2026), plus deferred batches in Tiers [5](../publishing/launches/tier-5-ai-affiliate-deepen-2026-11-01.md)–[12](../publishing/launches/tier-12-pm-affiliate-deepen-2027-02-01.md). Worth-it guides already live in each product's 5-kind pack (`is-{slug}-worth-it`).",
    "",
    "### Top 25 by commercial + best-page weight",
    "",
    slugList(deepenOpportunities.slice(0, 25).map((p) => p.slug)),
    "",
    "### By category",
    "",
  );

  for (const cat of categories) {
    const slugs = deepenOpportunities
      .filter((p) => p.category === cat.slug)
      .map((p) => p.slug);
    if (!slugs.length) continue;
    lines.push(`**${cat.slug}** (${slugs.length}): `, "");
    lines.push(slugList(slugs));
  }

  lines.push(
    "## Tier 3 — Best-page expansion candidates",
    "",
    bestExpansion.length
      ? `Affiliate products with approved reviews but **not** on any \`/best/\` shortlist surface (cluster awards, decision paths, ranked recommendations, or landscape groups) — evaluate for cluster awards or keep catalogue-only.`
      : "**Clear:** All affiliate products with approved reviews appear on at least one best-page shortlist surface (landscape, decision path, or cluster award).",
    "",
    slugList(bestExpansion.map((p) => p.slug)),
    "",
    "## Tier 4 — Editorial anchors (depth, not net-new reviews)",
    "",
    editorialAnchors.length
      ? "High-traffic category leaders without affiliate — already have reviews. **October 2026:** product what-is guides scheduled for the top 20 CRM anchors ([Tier 4 launch](../publishing/launches/tier-4-editorial-anchors-2026-10-01.md)). Remaining anchors below still need guide-cluster depth."
      : "**Clear:** All editorial anchors have product what-is guides scheduled or published.",
    "",
    slugList(editorialAnchors.slice(0, 20).map((p) => p.slug)),
    "",
    "## Commercial catalogue — reconcile queue",
    "",
    "From `npm run catalogue:commercial` — high-priority affiliate products in **RECONCILE/MAINTAIN** state (refresh, not greenfield onboarding):",
    "",
    "```text",
    "Pipedrive, Apollo.io, Freshsales, GetResponse, Close, Keap, Lusha,",
    "RocketReach, QuillBot, Streak, Salesflare, folk, Amplemarket, Bookyourdata,",
    "Campaign Monitor, AWeber, Tidio, Closely, InboxAlly, Reply.io, Bouncer,",
    "Freshdesk, Navan, Brand24, LearnWorlds",
    "```",
    "",
    "**Suggested agent runs:** `refresh-agent` on stale pricing; `guide-agent` for any new Tier 2 slugs; `comparison-agent` where relationships unapproved.",
    "",
    "## By category (detail)",
    "",
  );

  for (const cat of categories) {
    const catProducts = snapshots.filter((p) => p.category === cat.slug);
    const best = bestPageForCategory(cat.slug, bestPages);
    const catGaps = hardGaps.filter((p) => p.category === cat.slug);
    const catDeepen = deepenOpportunities.filter((p) => p.category === cat.slug);

    lines.push(`### ${cat.name} (\`${cat.slug}\`)`, "");
    lines.push(
      `**${catProducts.length}** products · **${assessCategoryMaturity(cat.slug)}** · cluster **${clusterCompletionScore(cat.slug)}%**` +
        (best ? ` · [\`/best/${best.slug}/\`](${best.seo.canonicalPath ?? `/best/${best.slug}/`})` : ""),
      "",
    );

    if (cat.slug === "customer-service") {
      const withCsShort = catProducts.filter((p) => p.csShortGuides >= 2).length;
      lines.push(
        "**CS short guides:** `guides-product-cs.ts` covers all 11 primaries (what-is + is-worth-it). Five published Aug 2026 (`freshdesk`, `zendesk-suite`, `help-scout`, `gorgias`, `tidio`); six deferred in [Tier 7](../publishing/launches/tier-7-cs-short-guides-2026-11-01.md) (Nov 2026).",
        "",
        `**Optional later:** Add \`customer-service\` to \`PRODUCT_GUIDE_BUILDERS\` for 5-kind packs — **${withCsShort}/${catProducts.length}** primaries already have short guides.`,
        "",
      );
    }

    const affiliateCount = catProducts.filter((p) => p.affiliate).length;
    const withReview = catProducts.filter((p) => p.reviewOk).length;
    const withPack = catProducts.filter((p) => p.packGuides > 0).length;
    const withEdu = catProducts.filter((p) => p.eduGuides > 0).length;

    lines.push(
      "| Coverage | Count |",
      "| --- | ---: |",
      `| Approved review | ${withReview}/${catProducts.length} |`,
      `| 5-kind guide pack | ${withPack}/${catProducts.length} |`,
      `| Educational guide mention | ${withEdu}/${catProducts.length} |`,
      `| Affiliate | ${affiliateCount} |`,
      "",
    );

    if (catGaps.length) {
      lines.push("**Hard gaps:**", "");
      lines.push(slugList(catGaps.map((p) => p.slug)));
    }
    if (catDeepen.length) {
      lines.push(
        `**Deepen (affiliate, no edu guide):** ${catDeepen.length} products —`,
        "",
      );
      lines.push(slugList(catDeepen.map((p) => p.slug)));
    }
    if (!catGaps.length && !catDeepen.length) {
      lines.push(
        "_Category at baseline coverage — focus on refresh, comparison approval, and hub depth._",
        "",
      );
    }

    const flagships = catProducts
      .filter((p) => p.bestEligible || p.revenueMinor > 500_000)
      .slice(0, 8);
    if (flagships.length) {
      lines.push("<details><summary>Flagship products in category</summary>", "");
      lines.push(
        tableRow(["Product", "Aff", "Review", "Pack", "Edu", "Best", "Comps"]),
        tableRow(["---", "---", "---", "---:", "---:", "---", "---:"]),
      );
      for (const p of flagships) {
        lines.push(
          tableRow([
            `\`${p.slug}\``,
            p.affiliate ? "✓" : "—",
            p.reviewOk ? "✓" : "✗",
            String(p.packGuides),
            String(p.eduGuides),
            p.bestEligible ? "✓" : "—",
            String(p.comps),
          ]),
        );
      }
      lines.push("", "</details>", "");
    }
    lines.push("");
  }

  lines.push(
    "## Recommended workflows",
    "",
    "| Goal | Command / agent |",
    "| --- | --- |",
    "| Regenerate this report | `npm run catalogue:opportunities` |",
    "| Affiliate inventory gaps | `npx tsx scripts/generate-product-gap-audit.ts` |",
    "| Commercial priority | `npm run catalogue:commercial` |",
    "| Category backlog | `npm run catalogue:category-backlog -- --category <slug>` |",
    "| Educational guides (Tier 2) | `guide-agent` via content agents CLI |",
    "| Product 5-kind packs | `buildProductGuidePackForSlug` / onboarding workflow |",
    "| Full quality scan | `npm run content:intelligence` |",
    "| Onboard one product | `npm run onboard:software -- <slug> --category <cat>` |",
    "",
    "## Discovery agent",
    "",
    "This audit is produced by **`catalogue-content-opportunity-agent`** (script: `scripts/generate-content-opportunity-audit.ts`). It is read-only — no content mutation. Wire into CI or weekly ops alongside `content:intelligence`.",
    "",
  );

  mkdirSync(join(process.cwd(), "docs/catalogue"), { recursive: true });
  writeFileSync(OUT, lines.join("\n"), "utf8");
  console.log(`Wrote ${OUT}`);
  console.log(
    `  hard gaps: ${hardGaps.length}, deepen: ${deepenOpportunities.length}, best expansion: ${bestExpansion.length}`,
  );
}

main();
