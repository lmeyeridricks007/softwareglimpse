#!/usr/bin/env npx tsx
/**
 * Generates docs/catalogue/PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md
 *
 * Usage: npx tsx scripts/generate-product-gap-audit.ts
 */
import { writeFileSync, readdirSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  getAllSoftwareUnfiltered,
  getAlternativesPageBySlug,
  getBestPages,
  getComparisonsForProduct,
} from "@/data";
import { getGuidesByProduct } from "@/data/repositories/guides";
import { partnerLinks, isUnresolvedPartnerUrl } from "@/data/affiliates/source/partner-links";
import {
  AFFILIATE_INVENTORY_COUNT,
  affiliateInventoryRows,
} from "@/data/catalogue/source/affiliate-inventory";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import { loadEnrichment } from "@/data/research/store";
import { buildProductGuidePackForSlug } from "@/services/product-guides/build";
import { getEducationalGuides } from "@/data/repositories/guides-educational";

const OUT = join(
  process.cwd(),
  "docs/catalogue/PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md",
);

type Manifest = {
  productSlug: string;
  status: string;
  notes?: string[];
};

function loadManifests(): Map<string, Manifest> {
  const dir = join(process.cwd(), "src/data/onboarding/manifests");
  const map = new Map<string, Manifest>();
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const raw = JSON.parse(
      readFileSync(join(dir, file), "utf8"),
    ) as Manifest;
    map.set(raw.productSlug, raw);
  }
  return map;
}

function partnerBySlug() {
  return new Map(partnerLinks.map((p) => [p.productSlug, p]));
}

function inventorySourceIds(): Set<string> {
  return new Set(affiliateInventoryRows.map((r) => r.sourceId));
}

function slugList(slugs: string[], perLine = 8): string {
  if (!slugs.length) return "_None._\n";
  const lines: string[] = [];
  for (let i = 0; i < slugs.length; i += perLine) {
    lines.push(slugs.slice(i, i + perLine).map((s) => `\`${s}\``).join(", "));
  }
  return lines.join("\n") + "\n";
}

function tableRow(cols: string[]): string {
  return `| ${cols.join(" | ")} |`;
}

function main() {
  const software = getAllSoftwareUnfiltered().slice().sort((a, b) => {
    const c = a.primaryCategorySlug.localeCompare(b.primaryCategorySlug);
    return c !== 0 ? c : a.name.localeCompare(b.name);
  });
  const manifests = loadManifests();
  const partners = partnerBySlug();
  const inventoryIds = inventorySourceIds();
  const bestPages = getBestPages({ includeUnpublished: true });
  const educational = getEducationalGuides({ includeUnpublished: true });

  const withAffiliate: typeof software = [];
  const withoutAffiliate: typeof software = [];
  const missingReview: typeof software = [];
  const missingGuides5Kind: typeof software = [];
  const zeroGuideMentions: typeof software = [];
  const noManifest: typeof software = [];
  const manifestBlocked: { product: (typeof software)[0]; manifest: Manifest }[] =
    [];
  const manifestReviewRequired: {
    product: (typeof software)[0];
    manifest: Manifest;
  }[] = [];
  const partnerNoUrl: string[] = [];
  const partnerUrlPending: string[] = [];
  const partnerUrlDeclined: string[] = [];
  const affiliateIncomplete: typeof software = [];
  const notBestEligible: typeof software = [];

  for (const s of software) {
    const hasLiveAffiliate = Boolean(
      s.affiliate?.enabled && s.affiliate.trackingUrl,
    );
    if (hasLiveAffiliate) withAffiliate.push(s);
    else withoutAffiliate.push(s);

    const assessment = loadAssessment(s.slug);
    const review = loadReview(s.slug);
    const reviewOk =
      assessment?.status === "approved" &&
      review?.editorialStatus === "approved";
    if (!reviewOk) missingReview.push(s);

    const productGuides = getGuidesByProduct(s.slug, {
      includeUnpublished: true,
    });
    const pack = buildProductGuidePackForSlug(s.slug);
    const eduMentions = educational.filter((g) =>
      g.productSlugs.includes(s.slug),
    );
    const guideCount = productGuides.length + pack.length + eduMentions.length;
    if (pack.length === 0 && productGuides.length === 0) {
      missingGuides5Kind.push(s);
    }
    if (guideCount === 0) zeroGuideMentions.push(s);

    const manifest = manifests.get(s.slug);
    if (!manifest) noManifest.push(s);
    else if (manifest.status === "blocked")
      manifestBlocked.push({ product: s, manifest });
    else if (manifest.status === "review-required")
      manifestReviewRequired.push({ product: s, manifest });

    const partner = partners.get(s.slug);
    if (partner && !partner.affiliateUrl) {
      if (partner.affiliateUrlState === "declined") {
        partnerUrlDeclined.push(s.slug);
      } else if (partner.affiliateUrlState === "pending") {
        partnerUrlPending.push(s.slug);
      } else if (isUnresolvedPartnerUrl(partner)) {
        partnerNoUrl.push(s.slug);
      }
    }

    const enrichment = loadEnrichment(s.slug);
    if (hasLiveAffiliate && (!reviewOk || !enrichment)) {
      affiliateIncomplete.push(s);
    }

    const bestEligible = bestPages.some(
      (b) =>
        b.eligibleProductSlugs.includes(s.slug) ||
        b.recommendations.some((r) => r.productSlug === s.slug),
    );
    if (!bestEligible) notBestEligible.push(s);
  }

  const partnerSlugs = new Set(partnerLinks.map((p) => p.productSlug));
  const inPartnerNotSeed = [...partnerSlugs].filter(
    (slug) => !software.some((s) => s.slug === slug),
  );

  const scheduled = software.filter((s) => s.metadata.status === "scheduled");
  const published = software.filter((s) => s.metadata.status === "published");

  const byCategory = new Map<string, number>();
  for (const s of software) {
    byCategory.set(
      s.primaryCategorySlug,
      (byCategory.get(s.primaryCategorySlug) ?? 0) + 1,
    );
  }

  const lines: string[] = [
    "# Product & affiliate gap audit",
    "",
    `_Generated ${new Date().toISOString().slice(0, 10)} from live catalogue loaders. Regenerate: \`npx tsx scripts/generate-product-gap-audit.ts\`_`,
    "",
    "## Executive summary",
    "",
    tableRow(["Metric", "Count"]),
    tableRow(["---", "---:"]),
    tableRow(["Software products in seed", String(software.length)]),
    tableRow(["Affiliate inventory rows", String(AFFILIATE_INVENTORY_COUNT)]),
    tableRow(["Partner link records", String(partnerLinks.length)]),
    tableRow(["Live affiliate (enabled + tracking URL)", String(withAffiliate.length)]),
    tableRow(["No live affiliate", String(withoutAffiliate.length)]),
    tableRow(["Missing approved review/assessment", String(missingReview.length)]),
    tableRow(["No 5-kind product guide pack", String(missingGuides5Kind.length)]),
    tableRow(["Zero guide mentions (any kind)", String(zeroGuideMentions.length)]),
    tableRow(["Onboarding manifests on disk", String(manifests.size)]),
    tableRow(["Products without manifest", String(noManifest.length)]),
    tableRow(["Manifest: blocked", String(manifestBlocked.length)]),
    tableRow(["Manifest: review-required", String(manifestReviewRequired.length)]),
    tableRow(["Manifest: ready", String([...manifests.values()].filter((m) => m.status === "ready").length)]),
    tableRow(["Not on any best-page shortlist", String(notBestEligible.length)]),
    tableRow([
      "metadata.status",
      `${published.length} published, ${scheduled.length} scheduled`,
    ]),
    "",
    "### Products by category",
    "",
    tableRow(["Category", "Count"]),
    tableRow(["---", "---:"]),
    ...[...byCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([cat, n]) => tableRow([cat, String(n)])),
    "",
    "---",
    "",
    "## Priority gaps (affiliate + incomplete editorial)",
    "",
    "Products with a **live affiliate link** but missing approved review/assessment and/or research enrichment:",
    "",
  ];

  if (!affiliateIncomplete.length) {
    lines.push("_None — all affiliate products have reviews._\n");
  } else {
    lines.push(
      tableRow(["Slug", "Name", "Category", "Assessment", "Review", "Enrichment"]),
      tableRow(["---", "---", "---", "---", "---", "---"]),
    );
    for (const s of affiliateIncomplete.sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const a = loadAssessment(s.slug);
      const r = loadReview(s.slug);
      const e = loadEnrichment(s.slug);
      lines.push(
        tableRow([
          `\`${s.slug}\``,
          s.name,
          s.primaryCategorySlug,
          a ? a.status : "missing",
          r ? r.editorialStatus : "missing",
          e ? "yes" : "missing",
        ]),
      );
    }
    lines.push("");
  }

  lines.push(
    "## Missing reviews (assessment + review not both approved)",
    "",
  );
  if (!missingReview.length) {
    lines.push("_None._\n");
  } else {
    lines.push(
      tableRow(["Slug", "Name", "Category", "Affiliate"]),
      tableRow(["---", "---", "---", "---"]),
    );
    for (const s of missingReview) {
      const aff = s.affiliate?.enabled ? "yes" : "no";
      lines.push(tableRow([`\`${s.slug}\``, s.name, s.primaryCategorySlug, aff]));
    }
    lines.push("");
  }

  lines.push(
    "## Partner links without configured URL",
    "",
    "In `partner-links.ts` but `affiliateUrl: null` and not marked pending/declined:",
    "",
    slugList(partnerNoUrl),
    "",
    "## Partner links pending dashboard URL",
    "",
    "Registry rows awaiting a real PartnerStack/Impact link (`affiliateUrlState: pending`). Wire via `npm run affiliate:set -- <slug> --url <https://...> --default` then set `affiliateUrl` in partner-links.",
    "",
    slugList(partnerUrlPending),
    "",
    "## Partner links declined / inactive",
    "",
    slugList(partnerUrlDeclined),
    "",
    "## Onboarding manifest: blocked",
    "",
  );

  if (!manifestBlocked.length) {
    lines.push("_None._\n");
  } else {
    lines.push(
      tableRow(["Slug", "Name", "Notes"]),
      tableRow(["---", "---", "---"]),
    );
    for (const { product: s, manifest } of manifestBlocked.sort((a, b) =>
      a.product.name.localeCompare(b.product.name),
    )) {
      lines.push(
        tableRow([
          `\`${s.slug}\``,
          s.name,
          (manifest.notes ?? []).join("; ") || manifest.status,
        ]),
      );
    }
    lines.push("");
  }

  lines.push("## Onboarding manifest: review-required", "");
  lines.push(
    `${manifestReviewRequired.length} products. Full list:`,
    "",
    slugList(manifestReviewRequired.map((x) => x.product.slug)),
    "",
    `## Products with live affiliate (${withAffiliate.length})`,
    "",
    slugList(withAffiliate.map((s) => s.slug)),
    "",
    "## Partner link slugs without software seed",
    "",
  );
  if (!inPartnerNotSeed.length) {
    lines.push("_None — all partner slugs map to seed._\n");
  } else {
    lines.push(slugList(inPartnerNotSeed));
  }

  void inventoryIds;

  lines.push(
    "",
    "## Missing 5-kind product guide pack",
    "",
    "No output from `buildProductGuidePackForSlug` and no product-specific guides in registry. Customer-service category has no pack builder yet.",
    "",
    slugList(missingGuides5Kind.map((s) => s.slug)),
    "",
    "## Zero guide mentions (product guides + educational)",
    "",
    slugList(zeroGuideMentions.map((s) => s.slug)),
    "",
    "## Not best-page eligible",
    "",
    notBestEligible.length
      ? "Not on any `best.ts` eligible or recommendation list:"
      : "_All seed products appear on a category best-page landscape or recommendation list._",
    "",
    slugList(notBestEligible.map((s) => s.slug)),
    "",
    "## No onboarding manifest",
    "",
    noManifest.length
      ? `${noManifest.length} seed products have no file in \`src/data/onboarding/manifests/\`. Run \`npm run onboard:manifest-backfill\`, then \`npm run onboard:manifest-reconcile\`.`
      : "_All seed products have an onboarding manifest._",
    "",
  );

  if (noManifest.length) {
    lines.push(
      "### Products without manifest",
      "",
      slugList(noManifest.map((s) => s.slug)),
      "",
    );
  }

  lines.push(
    "## Products without live affiliate",
    "",
    `${withoutAffiliate.length} products — editorial catalogue only, no partner tracking URL:`,
    "",
    slugList(withoutAffiliate.map((s) => s.slug)),
    "",
    "## Coverage matrix (affiliate inventory SOFTWARE bucket)",
    "",
    "Run `npm run catalogue:coverage` for the live table. Snapshot:",
    "",
    tableRow(["Dimension", "Affiliate SOFTWARE (94)", "All seed (308)"]),
    tableRow(["---", "---:", "---:"]),
    tableRow(["Alternatives page", "✓", "308/308"]),
    tableRow(["Comparisons", "✓", "308/308"]),
    tableRow(["Pricing snapshot", "✓", "308/308"]),
    tableRow(["Approved review", "2 gaps", `${software.length - missingReview.length}/${software.length}`]),
    tableRow(["5-kind guide pack", "partial", `${software.length - missingGuides5Kind.length}/${software.length}`]),
    "",
    "## Recommended next actions",
    "",
    "1. **Editorial**: Run review workflow for products still missing assessment/review JSON (if any remain after scheduled launches).",
    "2. **Partner URLs**: See [EDITORIAL-AFFILIATE-PROGRAM-GUIDE-LATEST.md](./EDITORIAL-AFFILIATE-PROGRAM-GUIDE-LATEST.md) for where to apply. Paste PartnerStack/Impact links for pending registry rows (`affiliate:set` + partner-links import). Instantly is declined.",
    "3. **Onboarding**: Run `npm run onboard:manifest-reconcile` after research/editorial catch-up; `npm run onboard:manifest-backfill` for new seed rows without manifests.",
    "4. **Guides**: CS short guides for `livechat`, `zoho-desk`, `nicejob`, `shore` are in `guides-product-cs.ts` (scheduled 25 Aug 2026). Remaining CS gap: 5-kind pack builder or extend guides for other CS primaries.",
    "5. **Catalogue CLI**: Fix catalogue alias map if `npm run catalogue:status` errors; use `npm run catalogue:commercial` and `catalogue:research-backlog` for batch planning.",
    "",
    "## Related commands",
    "",
    "| Command | Purpose |",
    "| --- | --- |",
    "| `npm run catalogue:coverage` | Per-affiliate-product review/pricing/alt/comp/best matrix |",
    "| `npm run catalogue:commercial` | Commercial onboarding priority |",
    "| `npm run catalogue:research-backlog` | Research enrichment gaps |",
    "| `npm run audit:product -- <slug>` | Single-product editorial QA |",
    "| `npm run audit:site` | Site-wide audit |",
    "| `npm run catalogue:affiliate-guide` | Where to apply for editorial-only products (219) |",
    "| `npx tsx scripts/generate-product-gap-audit.ts` | Regenerate this document |",
    "",
  );

  mkdirSync(join(process.cwd(), "docs/catalogue"), { recursive: true });
  writeFileSync(OUT, lines.join("\n"), "utf8");
  console.log(`Wrote ${OUT}`);
}

main();
