import { getAllSoftwareUnfiltered, getSoftwareByCategory } from "@/data";
import {
  listAffiliateDestinations,
  listAffiliateProgrammes,
  listPromotions,
} from "@/data/affiliates/store";
import {
  derivePromotionEffectiveStatus,
  isPromotionPubliclyActive,
  isPromotionExpiringSoon,
  isPromotionStale,
} from "./promotions";
import { getProductAffiliateStatus } from "./manage";
import { resolveCommercialCta } from "./resolve-cta";

export type AffiliateCoverageReport = {
  totalSoftware: number;
  withActiveProgramme: number;
  pending: number;
  withoutAffiliate: number;
  withActivePromotion: number;
  missingDestination: number;
  byCategory?: {
    categorySlug: string;
    total: number;
    withActiveProgramme: number;
    withActivePromotion: number;
    missingDestination: number;
  };
  monetization?: {
    publishedWithAffiliateCta: number;
    publishedWithOfficialCta: number;
    publishedMissingCta: number;
  };
};

export function buildAffiliateCoverageReport(options?: {
  categorySlug?: string;
  now?: Date;
}): AffiliateCoverageReport {
  const now = options?.now ?? new Date();
  const products = options?.categorySlug
    ? getSoftwareByCategory(options.categorySlug, { includeUnpublished: true })
    : getAllSoftwareUnfiltered();

  let withActiveProgramme = 0;
  let pending = 0;
  let withoutAffiliate = 0;
  let withActivePromotion = 0;
  let missingDestination = 0;
  let publishedWithAffiliateCta = 0;
  let publishedWithOfficialCta = 0;
  let publishedMissingCta = 0;

  for (const product of products) {
    const status = getProductAffiliateStatus(product.slug, now);
    if (!status || status.status === "NONE") withoutAffiliate += 1;
    else if (status.status === "ACTIVE") withActiveProgramme += 1;
    else if (status.status === "PENDING") pending += 1;
    else withoutAffiliate += 1;

    if (status?.activePromotion) withActivePromotion += 1;

    const hasProgramme = status?.programme?.status === "active";
    const hasDest =
      status?.destinations.some((d) => d.status === "active") ?? false;
    if (hasProgramme && !hasDest) missingDestination += 1;

    if (product.metadata.status === "published") {
      const cta = resolveCommercialCta(
        { productSlug: product.slug, context: "software-review" },
        product,
      );
      if (!cta.available) publishedMissingCta += 1;
      else if (cta.affiliate) publishedWithAffiliateCta += 1;
      else publishedWithOfficialCta += 1;
    }
  }

  const report: AffiliateCoverageReport = {
    totalSoftware: products.length,
    withActiveProgramme,
    pending,
    withoutAffiliate,
    withActivePromotion,
    missingDestination,
    monetization: {
      publishedWithAffiliateCta,
      publishedWithOfficialCta,
      publishedMissingCta,
    },
  };

  if (options?.categorySlug) {
    report.byCategory = {
      categorySlug: options.categorySlug,
      total: products.length,
      withActiveProgramme,
      withActivePromotion,
      missingDestination,
    };
  }

  return report;
}

export type PromotionReportBucket =
  | "ACTIVE_NOW"
  | "STARTING_SOON"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "STALE_UNVERIFIED"
  | "DISABLED";

export function buildPromotionReport(now: Date = new Date()): Record<
  PromotionReportBucket,
  { id: string; productSlug: string; headline: string }[]
> {
  const buckets: Record<
    PromotionReportBucket,
    { id: string; productSlug: string; headline: string }[]
  > = {
    ACTIVE_NOW: [],
    STARTING_SOON: [],
    EXPIRING_SOON: [],
    EXPIRED: [],
    STALE_UNVERIFIED: [],
    DISABLED: [],
  };

  for (const p of listPromotions()) {
    const row = {
      id: p.id,
      productSlug: p.productSlug,
      headline: p.headline,
    };
    const effective = derivePromotionEffectiveStatus(p, now);
    if (effective === "disabled") {
      buckets.DISABLED.push(row);
      continue;
    }
    if (effective === "expired") {
      buckets.EXPIRED.push(row);
      continue;
    }
    if (effective === "scheduled") {
      buckets.STARTING_SOON.push(row);
      continue;
    }
    if (isPromotionPubliclyActive(p, now)) {
      buckets.ACTIVE_NOW.push(row);
      if (isPromotionExpiringSoon(p, now)) buckets.EXPIRING_SOON.push(row);
      if (isPromotionStale(p, now) || !p.verifiedAt) {
        buckets.STALE_UNVERIFIED.push(row);
      }
    }
  }

  return buckets;
}

export function buildCommercialOpportunityLines(limit = 20): string[] {
  const lines: string[] = [];
  for (const product of getAllSoftwareUnfiltered()) {
    if (product.metadata.status !== "published") continue;
    const status = getProductAffiliateStatus(product.slug);
    const cta = resolveCommercialCta({
      productSlug: product.slug,
      context: "software-review",
    });
    if (status?.status === "ACTIVE" && cta.available && cta.affiliate) {
      lines.push(
        `${product.name}: affiliate active · CTA healthy${status.activePromotion ? ` · promo: ${status.activePromotion.headline}` : ""}`,
      );
    } else if (status?.status === "ACTIVE" && !cta.affiliate) {
      lines.push(
        `${product.name}: affiliate mapped but CTA falling back to official`,
      );
    } else if (
      listAffiliateProgrammes().some((p) =>
        p.productSlugs.includes(product.slug),
      ) &&
      !listAffiliateDestinations().some(
        (d) => d.productSlug === product.slug && d.status === "active",
      )
    ) {
      lines.push(`${product.name}: programme present · destination missing`);
    }
    if (lines.length >= limit) break;
  }
  return lines;
}
