import {
  getAlternativesPageBySlug,
  getComparisonsForProduct,
  getBestPages,
  getMigrationRecords,
  getSoftwareBySlug,
} from "@/data";
import { loadCategoryGaps } from "@/data/catalogue/store";
import { loadEnrichment } from "@/data/research/store";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";
import { cataloguePriorityWeights } from "@/data/config/catalogue/priority-weights";
import type { CatalogueWorkItem } from "./planner";
import {
  assessCategoryMaturity,
  clusterCompletionScore,
  listCategoryMaturities,
} from "./maturity";
import { recommendNextBatch } from "./planner";

export function catalogueStatusReport(items: CatalogueWorkItem[]): string {
  const total = items.length;
  const byBucket = countBy(items, (i) => i.classification.bucket);
  const software = items.filter((i) => i.classification.bucket === "SOFTWARE");
  const fully = software.filter(
    (i) =>
      i.maturityTier === "TIER_4_DECISION_ECOSYSTEM" ||
      i.maturityTier === "TIER_5_FULLY_INTEGRATED",
  ).length;
  const partial = software.filter(
    (i) =>
      i.maturityTier === "TIER_2_RESEARCH" ||
      i.maturityTier === "TIER_3_CORE_PAGE" ||
      i.maturityTier === "TIER_1_IDENTITY_TAXONOMY",
  ).length;
  const notOnboarded = software.filter(
    (i) => i.maturityTier === "TIER_0_CATALOGUE_ONLY",
  ).length;

  return [
    `TOTAL ENTRIES       ${total}`,
    "",
    `SOFTWARE            ${byBucket.SOFTWARE ?? 0}`,
    `SOFTWARE_LIKE       ${byBucket.SOFTWARE_LIKE_PLATFORM ?? 0}`,
    `SERVICE             ${byBucket.SERVICE ?? 0}`,
    `MARKETPLACE         ${byBucket.MARKETPLACE ?? 0}`,
    `LOGISTICS           ${byBucket.LOGISTICS ?? 0}`,
    `MULTI-PRODUCT       ${byBucket.MULTI_PRODUCT_PROGRAM ?? 0}`,
    `REVIEW REQUIRED     ${byBucket.REVIEW_REQUIRED ?? 0}`,
    `OTHER               ${byBucket.OTHER ?? 0}`,
    "",
    "SOFTWARE STATUS",
    "",
    `Fully onboarded       ${fully}`,
    `Partial               ${partial}`,
    `Not onboarded         ${notOnboarded}`,
  ].join("\n");
}

export function catalogueStatusByCategory(
  items: CatalogueWorkItem[],
  category: string,
): string {
  const filtered = items.filter(
    (i) =>
      i.mapping.categorySlug === category ||
      i.candidate.categoryHint === category,
  );
  const lines = [
    category.toUpperCase().replace(/-/g, " "),
    "",
    ...filtered.map((i) => {
      const state =
        i.maturityTier === "TIER_0_CATALOGUE_ONLY"
          ? "NOT ONBOARDED"
          : i.maturityTier === "TIER_4_DECISION_ECOSYSTEM" ||
              i.maturityTier === "TIER_5_FULLY_INTEGRATED"
            ? "COMPLETE"
            : "PARTIAL";
      return `${i.candidate.normalizedName.padEnd(20)} ${state}`;
    }),
  ];
  return lines.join("\n");
}

export function commercialReport(items: CatalogueWorkItem[]): string {
  const sorted = [...items]
    .filter((i) => i.classification.bucket === "SOFTWARE")
    .sort((a, b) => b.priority.score - a.priority.score);
  const lines = [
    "PRODUCT             COMMERCIAL PRIORITY   ONBOARDING STATE   ACTION",
    ...sorted.slice(0, 25).map((i) => {
      const state = i.maturityTier.replace("TIER_", "T").split("_")[0] ?? "?";
      return `${i.candidate.normalizedName.padEnd(20)} ${String(i.priority.label).padEnd(12)} ${state.padEnd(8)} ${i.priority.actionHint}`;
    }),
    "",
    "(Commission amounts omitted — planning scores only)",
  ];
  return lines.join("\n");
}

export function researchBacklogReport(items: CatalogueWorkItem[]): string {
  const lines: string[] = [];
  for (const i of items) {
    if (i.classification.bucket !== "SOFTWARE") continue;
    const slug = i.mapping.canonicalProductSlug ?? i.candidate.suggestedSlug;
    const enrichment = loadEnrichment(slug);
    const product = getSoftwareBySlug(slug, { includeUnpublished: true });
    if (!product && i.maturityTier === "TIER_0_CATALOGUE_ONLY") {
      lines.push(`${i.candidate.normalizedName}`);
      lines.push(`Missing: all product research`);
      lines.push("");
      continue;
    }
    if (!enrichment) {
      lines.push(`${i.candidate.normalizedName}`);
      lines.push(`Missing: research enrichment`);
      lines.push("");
    }
  }
  return lines.join("\n") || "No research backlog for software candidates.";
}

export function categoryBacklogReport(): string {
  const gaps = loadCategoryGaps();
  if (!gaps.length) return "No category gaps recorded. Run catalogue import.";
  return gaps
    .map(
      (g) =>
        `${g.categorySlug}\n${g.catalogueProductCount} catalogue products\n${g.status}\n`,
    )
    .join("\n");
}

export function agentBacklogReport(items: CatalogueWorkItem[]): string {
  const ready: string[] = [];
  const blocked: string[] = [];
  for (const i of items) {
    if (i.classification.bucket !== "SOFTWARE") continue;
    const slug = i.mapping.canonicalProductSlug ?? i.candidate.suggestedSlug;
    const enrichment = loadEnrichment(slug);
    const catReady =
      i.mapping.categoryReadiness === "CATEGORY_READY" ||
      i.mapping.categoryReadiness === "CATEGORY_PARTIAL";
    if (enrichment && catReady) {
      ready.push(`Review Agent\n${i.candidate.normalizedName}\n`);
      ready.push(`Pricing Agent\n${i.candidate.normalizedName}\n`);
    } else {
      blocked.push(
        `Review Agent\n${i.candidate.normalizedName}\nReason: ${
          !enrichment ? "research incomplete" : "category not ready"
        }\n`,
      );
    }
  }
  return ["READY", "", ...ready, "BLOCKED", "", ...blocked].join("\n");
}

export function legacyContentReport(items: CatalogueWorkItem[]): string {
  const migrations = getMigrationRecords();
  const lines: string[] = [];
  for (const i of items) {
    const slug = i.mapping.canonicalProductSlug ?? i.candidate.suggestedSlug;
    const hits = migrations.filter((m) =>
      `${m.source ?? ""} ${m.target ?? ""} ${m.notes ?? ""}`
        .toLowerCase()
        .includes(slug),
    );
    if (!hits.length) continue;
    lines.push(i.candidate.normalizedName);
    for (const h of hits) {
      lines.push(`Legacy: ${h.source ?? h.id}`);
      lines.push(`Migration action: ${h.action ?? "REVIEW"}`);
    }
    lines.push("");
  }
  return (
    lines.join("\n") ||
    "No migration ledger matches for catalogue products (ledger may be empty)."
  );
}

export function contentCoverageMatrix(items: CatalogueWorkItem[]): string {
  const lines = [
    "PRODUCT        REVIEW   PRICING   ALT   COMP   BEST ELIGIBLE",
  ];
  for (const i of items.filter((x) => x.classification.bucket === "SOFTWARE")) {
    const slug = i.mapping.canonicalProductSlug ?? i.candidate.suggestedSlug;
    const product = getSoftwareBySlug(slug, { includeUnpublished: true });
    const review = product?.metadata.status === "published" ? "✓" : product ? "?" : "-";
    const enrichment = loadEnrichment(slug);
    const pricing = enrichment ? "?" : "-";
    const alt = getAlternativesPageBySlug(slug, { includeUnpublished: true })
      ? "✓"
      : "-";
    const comps = getComparisonsForProduct(slug, { includeUnpublished: true });
    const best = getBestPages({ includeUnpublished: true }).some(
      (b) =>
        b.eligibleProductSlugs.includes(slug) ||
        b.recommendations.some((r) => r.productSlug === slug),
    )
      ? "✓"
      : "-";
    lines.push(
      `${i.candidate.normalizedName.slice(0, 14).padEnd(14)} ${review.padEnd(8)} ${pricing.padEnd(9)} ${alt.padEnd(5)} ${String(comps.length).padEnd(6)} ${best}`,
    );
  }
  return lines.join("\n");
}

export function categoryCoverageMatrix(): string {
  const mats = listCategoryMaturities();
  const lines = [
    "CATEGORY           PRODUCTS   RESEARCHED   REVIEWS   BEST   TOOL",
  ];
  for (const m of mats) {
    const override = getCategoryOnboardingOverride(m.categorySlug);
    const best = getBestPages({ includeUnpublished: true }).some(
      (b) =>
        b.categorySlug === m.categorySlug ||
        b.slug.includes(m.categorySlug),
    );
    lines.push(
      `${m.categorySlug.padEnd(18)} ${String(m.productCount).padEnd(10)} ${String(m.clusterScore).padEnd(12)} ${m.maturity.padEnd(9)} ${best ? "✓" : "-".padEnd(6)} ${override.finder}`,
    );
  }
  return lines.join("\n");
}

export function operatingReport(items: CatalogueWorkItem[]): string {
  const tiers = countBy(items, (i) => i.maturityTier);
  const buckets = countBy(items, (i) => i.classification.bucket);
  const next = recommendNextBatch(items);
  return [
    "SOFTWAREGLIMPSE CATALOGUE",
    "",
    `${items.length} affiliate entries`,
    "",
    `Canonical software entities     ${buckets.SOFTWARE ?? 0}`,
    `Services / marketplaces         ${(buckets.SERVICE ?? 0) + (buckets.MARKETPLACE ?? 0) + (buckets.LOGISTICS ?? 0)}`,
    `Review required                 ${(buckets.REVIEW_REQUIRED ?? 0) + (buckets.MULTI_PRODUCT_PROGRAM ?? 0)}`,
    "",
    "PRODUCT MATURITY",
    "",
    ...Object.entries(tiers).map(([k, v]) => `${k.padEnd(32)} ${v}`),
    "",
    "TOP NEXT CATEGORY",
    next.batch.categoryIds[0] ?? "(none)",
    "",
    "TOP NEXT PRODUCTS",
    ...next.items.map((i) => i.candidate.normalizedName),
    "",
    "WHY",
    ...next.explanation,
  ].join("\n");
}

export function crmReconciliationReport(items: CatalogueWorkItem[]): string {
  const crm = items.filter(
    (i) =>
      i.mapping.categorySlug === "crm" ||
      i.mapping.categorySlug === "sales-intelligence" ||
      i.candidate.categoryHint === "crm" ||
      i.candidate.categoryHint === "sales-intelligence",
  );
  const lines = ["CRM / SALES RECONCILIATION", ""];
  for (const i of crm.sort((a, b) => b.priority.score - a.priority.score)) {
    const slug = i.mapping.canonicalProductSlug ?? i.candidate.suggestedSlug;
    const product = getSoftwareBySlug(slug, { includeUnpublished: true });
    const enrichment = loadEnrichment(slug);
    const comps = getComparisonsForProduct(slug, { includeUnpublished: true });
    const alts = getAlternativesPageBySlug(slug, { includeUnpublished: true });
    const finderEligible =
      product &&
      getCategoryOnboardingOverride(product.primaryCategorySlug).finder ===
        "crm";
    lines.push(i.candidate.normalizedName);
    lines.push(
      `  identity: ${i.classification.identityOutcome} | maturity: ${i.maturityTier}`,
    );
    lines.push(
      `  exists: ${product ? "yes" : "no"} | research: ${enrichment ? "yes" : "missing"} | alts: ${alts ? "yes" : "no"} | comps: ${comps.length} | finder: ${finderEligible ? "eligible" : "n/a"}`,
    );
    lines.push(`  action: ${i.priority.actionHint}`);
    lines.push("");
  }
  return lines.join("\n");
}

export function exportCatalogueJson(items: CatalogueWorkItem[]): unknown {
  return {
    generatedAt: new Date().toISOString(),
    scope: "existing-only",
    priorityWeights: cataloguePriorityWeights,
    entries: items.map((i) => ({
      sourceId: i.candidate.sourceId,
      rawName: i.candidate.rawName,
      normalizedName: i.candidate.normalizedName,
      canonicalProduct: i.mapping.canonicalProductSlug ?? null,
      entityType: i.classification.bucket,
      category: i.mapping.categorySlug ?? null,
      affiliateStatus: i.candidate.affiliateStatus,
      commercialPriority: i.priority.label,
      commercialPriorityScore: i.priority.score,
      onboardingState: i.processing.state,
      contentMaturity: i.maturityTier,
      blockers: i.processing.blockers,
      actionHint: i.priority.actionHint,
      // intentionally omit revenue/commission amounts
    })),
  };
}

export function explainPriority(item: CatalogueWorkItem): string {
  return [
    item.candidate.normalizedName,
    "",
    ...item.priority.reasons,
    "",
    `Score: ${item.priority.score} (${item.priority.label})`,
    `Action: ${item.priority.actionHint}`,
  ].join("\n");
}

function countBy<T>(
  items: T[],
  keyFn: (i: T) => string,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const i of items) {
    const k = keyFn(i);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export { assessCategoryMaturity, clusterCompletionScore };
