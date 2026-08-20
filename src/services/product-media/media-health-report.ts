import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { getAllSoftwareUnfiltered } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import type { ProductMedia } from "@/domain";
import { isOfficialVendorMedia } from "@/domain";
import { isPubliclyAvailable } from "@/domain/publishing";
import {
  evaluateMediaGovernance,
  type MediaGovernanceResult,
} from "@/services/product-media/governance";
import { enrichMediaFromSourceUrl } from "@/services/product-media";

export type ProductMediaHealthRow = {
  productSlug: string;
  productName: string;
  activeVideos: number;
  needsReview: number;
  unavailable: number;
  oldestVerification: string | null;
  missingMajorMediaCoverage: boolean;
  mediaResults: MediaGovernanceResult[];
};

export type ProductMediaHealthReport = {
  /** Internal ops report — do not expose on public product pages. */
  title: "Product Media Health";
  generatedAt: string;
  products: ProductMediaHealthRow[];
  totals: {
    products: number;
    activeVideos: number;
    needsReview: number;
    unavailable: number;
    missingMajorMediaCoverage: number;
  };
};

/** Publicly active / link-only — excludes research pipeline stages. */
const ACTIVE_STATUSES = new Set([
  "published",
  "active",
  "embedding-disabled",
]);

function oldestVerification(media: ProductMedia[]): string | null {
  const dates = media
    .map((m) => m.verifiedAt)
    .filter((d): d is string => Boolean(d))
    .sort();
  return dates[0]?.slice(0, 10) ?? null;
}

function vendorUiScreenshotOnDisk(
  enrichment: ReturnType<typeof loadEnrichment>,
): boolean {
  return (enrichment?.screenshots ?? []).some((shot) => {
    if (shot.kind !== "vendor-ui") return false;
    const rel = shot.src.replace(/^\//, "");
    if (!rel.startsWith("software/") && !rel.startsWith("vendor-ui/")) {
      return false;
    }
    const disk = join(process.cwd(), "public", rel);
    if (!existsSync(disk)) return false;
    try {
      // Official OG/wordmark PNGs can be small; skip empty/favicon-sized files.
      return statSync(disk).size >= 4_000;
    } catch {
      return false;
    }
  });
}

/**
 * Whether a researched product lacks major official media coverage.
 * Honest bar: at least one active official video/webinar/tutorial, or a
 * first-party vendor-ui screenshot on disk. Teaching diagrams do not count.
 */
function missingMajorCoverage(input: {
  hasEnrichment: boolean;
  media: ProductMedia[];
  hasOfficialScreenshot: boolean;
}): boolean {
  if (!input.hasEnrichment) return false;
  if (input.hasOfficialScreenshot) return false;
  const activeOfficial = input.media.filter((m) => {
    const enriched = enrichMediaFromSourceUrl(m);
    if (!isOfficialVendorMedia(enriched)) return false;
    if (!ACTIVE_STATUSES.has(enriched.status)) return false;
    if (enriched.status === "unavailable" || enriched.status === "rejected") {
      return false;
    }
    return true;
  });
  return activeOfficial.length === 0;
}

/**
 * Internal Product Media Health report for editorial / ops.
 * Not for public product UI.
 */
export function buildProductMediaHealthReport(options?: {
  productSlug?: string;
  now?: Date;
}): ProductMediaHealthReport {
  const now = options?.now ?? new Date();
  const products = getAllSoftwareUnfiltered().filter((p) => {
    if (options?.productSlug) return p.slug === options.productSlug;
    return isPubliclyAvailable(p.metadata);
  });

  const rows: ProductMediaHealthRow[] = [];

  for (const product of products) {
    const enrichment = loadEnrichment(product.slug);
    const media = (enrichment?.media ?? []) as ProductMedia[];
    const results = media.map((m) =>
      evaluateMediaGovernance({ media: m, now }),
    );

    let activeVideos = 0;
    let needsReview = 0;
    let unavailable = 0;

    const hasActiveOfficial = results.some((result, idx) => {
      const item = media[idx];
      if (!item) return false;
      const enriched = enrichMediaFromSourceUrl(item);
      if (!isOfficialVendorMedia(enriched)) return false;
      return (
        result.publicVisibility === "active" ||
        result.publicVisibility === "link-only"
      );
    });

    for (const result of results) {
      if (result.publicVisibility === "hidden") {
        // Hidden dead URLs with a live official replacement are archived, not an open gap.
        if (!hasActiveOfficial) unavailable += 1;
      } else if (
        result.flags.includes("beyond-review-threshold") ||
        result.flags.includes("product-materially-changed") ||
        result.flags.includes("linked-feature-changed") ||
        result.flags.includes("source-no-longer-official") ||
        result.recommendedStatus === "needs-review"
      ) {
        needsReview += 1;
        if (
          result.publicVisibility === "active" ||
          result.publicVisibility === "link-only"
        ) {
          activeVideos += 1;
        }
      } else if (
        result.publicVisibility === "active" ||
        result.publicVisibility === "link-only"
      ) {
        activeVideos += 1;
      }
    }

    const missing = missingMajorCoverage({
      hasEnrichment: Boolean(enrichment),
      media,
      hasOfficialScreenshot: vendorUiScreenshotOnDisk(enrichment),
    });

    rows.push({
      productSlug: product.slug,
      productName: product.name,
      activeVideos,
      needsReview,
      unavailable,
      oldestVerification: oldestVerification(media),
      missingMajorMediaCoverage: missing,
      mediaResults: results,
    });
  }

  rows.sort((a, b) => a.productName.localeCompare(b.productName));

  return {
    title: "Product Media Health",
    generatedAt: now.toISOString(),
    products: rows,
    totals: {
      products: rows.length,
      activeVideos: rows.reduce((n, r) => n + r.activeVideos, 0),
      needsReview: rows.reduce((n, r) => n + r.needsReview, 0),
      unavailable: rows.reduce((n, r) => n + r.unavailable, 0),
      missingMajorMediaCoverage: rows.filter((r) => r.missingMajorMediaCoverage)
        .length,
    },
  };
}

export function formatProductMediaHealthReportText(
  report: ProductMediaHealthReport,
): string {
  const lines: string[] = [
    "PRODUCT MEDIA HEALTH (internal)",
    `Generated ${report.generatedAt}`,
    "",
    `Products                 ${report.totals.products}`,
    `Active videos            ${report.totals.activeVideos}`,
    `Needs review             ${report.totals.needsReview}`,
    `Unavailable              ${report.totals.unavailable}`,
    `Missing major coverage   ${report.totals.missingMajorMediaCoverage}`,
    "",
    "Product | Active | Needs review | Unavailable | Oldest verification | Missing coverage",
    "-".repeat(96),
  ];

  for (const row of report.products) {
    if (
      row.activeVideos === 0 &&
      row.needsReview === 0 &&
      row.unavailable === 0 &&
      !row.missingMajorMediaCoverage
    ) {
      continue;
    }
    lines.push(
      [
        row.productName,
        row.activeVideos,
        row.needsReview,
        row.unavailable,
        row.oldestVerification ?? "—",
        row.missingMajorMediaCoverage ? "yes" : "no",
      ].join(" | "),
    );
  }

  return lines.join("\n");
}
