import type { Software } from "@/domain/schemas";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import { loadEnrichment } from "@/data/research/store";
import type {
  FieldStatus,
  SoftwareFieldAudit,
  SoftwareFieldAuditItem,
  SoftwareFieldId,
} from "./types";

function item(
  field: SoftwareFieldId,
  status: FieldStatus,
  detail: string,
  source: SoftwareFieldAuditItem["source"],
): SoftwareFieldAuditItem {
  return { field, status, detail, source };
}

/**
 * Verify core entity fields. MISSING ≠ invent. UNKNOWN when data absent
 * and cannot be inferred from enrichment/assessment/review.
 */
export function auditSoftwareFields(software: Software): SoftwareFieldAudit {
  const enrichment = loadEnrichment(software.slug);
  const assessment = loadAssessment(software.slug);
  const review = loadReview(software.slug);
  const items: SoftwareFieldAuditItem[] = [];

  items.push(
    item(
      "name",
      software.name?.trim() ? "PASS" : "MISSING",
      software.name?.trim() ? `Name: ${software.name}` : "Name missing",
      software.name?.trim() ? "seed" : "none",
    ),
  );

  const lifecycle = software.productLifecycle ?? null;
  items.push(
    item(
      "product_status",
      lifecycle ? "PASS" : "UNKNOWN",
      lifecycle
        ? `productLifecycle=${lifecycle}`
        : "productLifecycle not set on entity",
      lifecycle ? "seed" : "none",
    ),
  );

  const vendor = software.company?.trim() ? software.company.trim() : null;
  items.push(
    item(
      "canonical_vendor",
      vendor ? "PASS" : "UNKNOWN",
      vendor ? `Vendor: ${vendor}` : "Company/vendor not documented",
      vendor ? "seed" : "none",
    ),
  );

  items.push(
    item(
      "category",
      software.primaryCategorySlug ? "PASS" : "MISSING",
      software.primaryCategorySlug
        ? `primaryCategorySlug=${software.primaryCategorySlug}`
        : "primaryCategorySlug missing",
      software.primaryCategorySlug ? "seed" : "none",
    ),
  );

  const desc =
    software.shortDescription?.trim() ||
    enrichment?.shortDescription?.trim() ||
    null;
  items.push(
    item(
      "description",
      desc ? "PASS" : "MISSING",
      desc ? `Description present (${desc.slice(0, 80)}…)` : "No short description",
      software.shortDescription?.trim()
        ? "seed"
        : enrichment?.shortDescription
          ? "enrichment"
          : "none",
    ),
  );

  const audience =
    (software.businessSizeSlugs?.length ?? 0) > 0 ||
    (software.teamTypeSlugs?.length ?? 0) > 0 ||
    (assessment?.bestFor?.length ?? 0) > 0;
  items.push(
    item(
      "target_audience",
      audience ? "PASS" : "PARTIAL",
      audience
        ? `Sizes=${(software.businessSizeSlugs ?? []).length}, teams=${(software.teamTypeSlugs ?? []).length}, assessment bestFor=${assessment?.bestFor?.length ?? 0}`
        : "No audience / best-for signals",
      assessment?.bestFor?.length
        ? "assessment"
        : software.businessSizeSlugs?.length
          ? "seed"
          : "none",
    ),
  );

  items.push(
    item(
      "use_cases",
      (software.useCaseSlugs?.length ?? 0) > 0 ? "PASS" : "MISSING",
      (software.useCaseSlugs?.length ?? 0) > 0
        ? `useCaseSlugs=${software.useCaseSlugs.length}`
        : "No useCaseSlugs",
      (software.useCaseSlugs?.length ?? 0) > 0 ? "seed" : "none",
    ),
  );

  const caps =
    (software.featureRatings?.length ?? 0) > 0 ||
    (enrichment?.featureSupport?.length ?? 0) > 0;
  items.push(
    item(
      "capabilities",
      caps ? "PASS" : "MISSING",
      caps
        ? `featureRatings=${software.featureRatings?.length ?? 0}, enrichment features=${enrichment?.featureSupport?.length ?? 0}`
        : "No feature ratings or enrichment feature support",
      software.featureRatings?.length
        ? "seed"
        : enrichment?.featureSupport?.length
          ? "enrichment"
          : "none",
    ),
  );

  const pricing = software.pricing || enrichment?.pricing || null;
  items.push(
    item(
      "pricing",
      pricing ? "PASS" : "MISSING",
      pricing
        ? "Pricing envelope present"
        : "No pricing on seed or enrichment",
      software.pricing ? "seed" : enrichment?.pricing ? "enrichment" : "none",
    ),
  );

  const pricingEnvelope = enrichment?.pricing as
    | { plans?: unknown[] }
    | undefined;
  const plans =
    pricingEnvelope?.plans?.length ?? software.pricing?.plans?.length ?? 0;
  items.push(
    item(
      "plans",
      plans > 0 ? "PASS" : "MISSING",
      plans > 0 ? `plans=${plans}` : "No plan matrix",
      pricingEnvelope?.plans?.length
        ? "enrichment"
        : software.pricing?.plans?.length
          ? "seed"
          : "none",
    ),
  );

  const freePlan =
    (
      enrichment?.pricing as
        | { plans?: Array<{ isFree?: boolean }> }
        | undefined
    )?.plans?.some((p) => p.isFree) ||
    software.pricing?.plans?.some((p) => p.isFree);
  const freeKnown =
    plans > 0 ||
    enrichment?.pricing != null ||
    software.pricing != null;
  items.push(
    item(
      "free_plan",
      !freeKnown ? "UNKNOWN" : "PASS",
      !freeKnown
        ? "Cannot determine free plan — pricing missing"
        : freePlan
          ? "Free plan documented"
          : "No free plan in documented plans (explicit absence)",
      freeKnown
        ? enrichment?.pricing
          ? "enrichment"
          : "seed"
        : "none",
    ),
  );

  const trial = (
    enrichment?.pricing as
      | {
          plans?: Array<{ hasFreeTrial?: boolean; trialDays?: number | null }>;
        }
      | undefined
  )?.plans?.some(
    (p) => p.hasFreeTrial || (p.trialDays != null && p.trialDays > 0),
  );
  items.push(
    item(
      "trial",
      trial === true ? "PASS" : freeKnown ? "UNKNOWN" : "UNKNOWN",
      trial === true
        ? "Trial documented on plans/pricing"
        : "Trial not explicitly documented — do not assume none",
      trial === true ? "enrichment" : "none",
    ),
  );

  const integrations =
    (software.integrationSlugs?.length ?? 0) > 0 ||
    (enrichment?.integrationSupport?.length ?? 0) > 0;
  items.push(
    item(
      "integrations",
      integrations ? "PASS" : "PARTIAL",
      integrations
        ? `integrationSlugs=${software.integrationSlugs?.length ?? 0}, enrichment=${enrichment?.integrationSupport?.length ?? 0}`
        : "No integrations listed",
      software.integrationSlugs?.length
        ? "seed"
        : enrichment?.integrationSupport?.length
          ? "enrichment"
          : "none",
    ),
  );

  items.push(
    item(
      "alternatives",
      (software.alternativeSlugs?.length ?? 0) > 0 ? "PASS" : "PARTIAL",
      (software.alternativeSlugs?.length ?? 0) > 0
        ? `alternativeSlugs=${software.alternativeSlugs.length}`
        : "No alternativeSlugs on entity",
      (software.alternativeSlugs?.length ?? 0) > 0 ? "seed" : "none",
    ),
  );

  items.push(
    item(
      "competitors",
      (software.competitorSlugs?.length ?? 0) > 0 ? "PASS" : "PARTIAL",
      (software.competitorSlugs?.length ?? 0) > 0
        ? `competitorSlugs=${software.competitorSlugs.length}`
        : "No competitorSlugs on entity",
      (software.competitorSlugs?.length ?? 0) > 0 ? "seed" : "none",
    ),
  );

  const aff = software.affiliate;
  items.push(
    item(
      "affiliate",
      aff?.enabled && aff.trackingUrl
        ? "PASS"
        : aff?.enabled
          ? "PARTIAL"
          : "PASS",
      aff?.enabled && aff.trackingUrl
        ? "Affiliate enabled with tracking URL"
        : aff?.enabled
          ? "Affiliate enabled but tracking URL missing"
          : "No affiliate relationship (explicit)",
      "seed",
    ),
  );

  const sources =
    (software.sources?.length ?? 0) > 0 ||
    (enrichment?.sourceIds?.length ?? 0) > 0;
  items.push(
    item(
      "source_provenance",
      sources ? "PASS" : "MISSING",
      sources
        ? `seed sources=${software.sources?.length ?? 0}, enrichment sourceIds=${enrichment?.sourceIds?.length ?? 0}`
        : "No sources / sourceIds",
      software.sources?.length
        ? "seed"
        : enrichment?.sourceIds?.length
          ? "enrichment"
          : "none",
    ),
  );

  const verified =
    software.lastVerifiedAt ||
    software.pricingVerifiedAt ||
    software.lastResearchedAt ||
    enrichment?.domainCheckedAt?.pricing ||
    enrichment?.domainCheckedAt?.features ||
    enrichment?.updatedAt ||
    null;
  items.push(
    item(
      "verification_date",
      verified ? "PASS" : "MISSING",
      verified
        ? `Latest verification/research signal: ${verified}`
        : "No lastVerifiedAt / domainCheckedAt / researched date",
      software.lastVerifiedAt || software.pricingVerifiedAt
        ? "seed"
        : verified
          ? "enrichment"
          : "none",
    ),
  );

  // Silence unused if review unused for now — keep for future editorial checks
  void review;

  const passCount = items.filter((i) => i.status === "PASS").length;
  const partialCount = items.filter((i) => i.status === "PARTIAL").length;
  const missingCount = items.filter((i) => i.status === "MISSING").length;
  const unknownCount = items.filter((i) => i.status === "UNKNOWN").length;
  const score = Math.round(
    ((passCount + partialCount * 0.5) / items.length) * 100,
  );

  return {
    slug: software.slug,
    checkedAt: new Date().toISOString(),
    items,
    passCount,
    partialCount,
    missingCount,
    unknownCount,
    score,
  };
}
