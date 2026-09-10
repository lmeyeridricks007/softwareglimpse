import type { ResearchSource } from "@/domain";
import { loadEnrichment, loadManualSources } from "@/data/research/store";
import { loadReview } from "@/data/editorial/store";
import { getSoftwareBySlug } from "@/data";
import { resolveEvidenceLevel } from "@/services/editorial/evidence-level";
import { resolvePricingVerifiedAtForEvidence } from "@/services/editorial/pricing-verified-at";
import { listSoftwareDependents } from "@/services/seo/software-enrichment/dependents";
import type {
  NormalizedEvidenceSource,
  PlanEvidenceRow,
  ProductEvidencePack,
  EvidenceSourceKind,
} from "./types";
import { EVIDENCE_QUALITY_VERSION } from "./types";

function classifySource(source: ResearchSource): EvidenceSourceKind {
  const type = (source.sourceType ?? "").toLowerCase();
  const domains = source.domains ?? [];
  if (
    type.includes("pricing") ||
    domains.includes("pricing") ||
    /\/pricing/i.test(source.url ?? "")
  ) {
    return "vendor_pricing";
  }
  if (
    type.includes("help") ||
    type.includes("documentation") ||
    type.includes("docs") ||
    domains.includes("limits")
  ) {
    return "vendor_docs";
  }
  if (
    type.includes("integration") ||
    domains.includes("integrations")
  ) {
    return "integration";
  }
  if (
    type.includes("feature") ||
    domains.includes("features") ||
    domains.includes("product-positioning")
  ) {
    return "feature";
  }
  if (
    type.includes("product") ||
    source.authority === "first-party"
  ) {
    return "vendor_product";
  }
  return "other";
}

function normalizeSource(source: ResearchSource): NormalizedEvidenceSource {
  return {
    id: source.id,
    kind: classifySource(source),
    url: source.url ?? null,
    title: source.title ?? null,
    sourceType: source.sourceType ?? null,
    authority: source.authority ?? null,
    domains: source.domains ?? [],
    retrievedAt: source.retrievedAt ?? null,
    verifiedAt: source.verifiedAt ?? null,
    lastCheckedAt: source.lastCheckedAt ?? null,
    confidence: source.confidence ?? null,
    status: source.status ?? null,
  };
}

function planRows(pricing: unknown): PlanEvidenceRow[] {
  if (!pricing || typeof pricing !== "object") return [];
  const plans = (pricing as { plans?: unknown }).plans;
  if (!Array.isArray(plans)) return [];
  return plans
    .map((raw) => {
      if (!raw || typeof raw !== "object") return null;
      const p = raw as Record<string, unknown>;
      const name = typeof p.name === "string" ? p.name : null;
      if (!name) return null;
      return {
        id: typeof p.id === "string" ? p.id : name,
        slug: typeof p.slug === "string" ? p.slug : name.toLowerCase(),
        name,
        isFree: p.isFree === true,
        contactSales: p.contactSales === true,
        hasFreeTrial: p.hasFreeTrial === true,
      } satisfies PlanEvidenceRow;
    })
    .filter((p): p is PlanEvidenceRow => Boolean(p));
}

function currentEvidenceLevel(slug: string): ProductEvidencePack["evidenceLevelBefore"] {
  const software = getSoftwareBySlug(slug);
  const review = loadReview(slug);
  const pricingVerifiedAt = resolvePricingVerifiedAtForEvidence(
    software,
    review?.pricingVerifiedAt,
  );
  return resolveEvidenceLevel({
    handsOnTesting: Boolean(review?.handsOnTesting),
    testedAt: review?.testedAt,
    pricingVerifiedAt,
  });
}

/**
 * Normalize existing legitimate research sources into an evidence pack.
 * Does not invent sources, prices, or hands-on claims.
 */
export function buildProductEvidencePack(slug: string): ProductEvidencePack | null {
  const software = getSoftwareBySlug(slug);
  if (!software) return null;

  const enrichment = loadEnrichment(slug);
  const review = loadReview(slug);
  const sources = loadManualSources(slug)
    .filter((s) => s.status !== "rejected")
    .map(normalizeSource);

  const plans = planRows(enrichment?.pricing);
  const pricing = enrichment?.pricing as
    | { verifiedAt?: string; sourceIds?: string[] }
    | undefined;

  const level = currentEvidenceLevel(slug);
  const dependents = listSoftwareDependents(slug).map((d) => ({
    kind: d.kind,
    slug: d.slug,
    path: d.path,
  }));

  const notes: string[] = [];
  if (sources.length === 0) notes.push("No research sources on disk");
  if (plans.length === 0) notes.push("No enrichment plans");
  if (!pricing?.sourceIds?.length) {
    notes.push("Enrichment pricing lacks sourceIds");
  }

  return {
    slug,
    name: software.name,
    categorySlug: software.primaryCategorySlug ?? null,
    generatedAt: new Date().toISOString(),
    version: EVIDENCE_QUALITY_VERSION,
    evidenceLevelBefore: level,
    evidenceLevelAfter: level,
    promotedToDataVerified: false,
    sources,
    vendorSourceCount: sources.filter(
      (s) =>
        s.kind === "vendor_product" ||
        s.kind === "vendor_pricing" ||
        s.authority === "first-party",
    ).length,
    pricingSourceCount: sources.filter((s) => s.kind === "vendor_pricing").length,
    docsSourceCount: sources.filter((s) => s.kind === "vendor_docs").length,
    featureEvidenceCount:
      enrichment?.featureSupport?.length ??
      sources.filter((s) => s.kind === "feature").length,
    integrationEvidenceCount: enrichment?.integrationSupport?.length ?? 0,
    plans,
    researchTimestamps: {
      enrichmentUpdatedAt: enrichment?.updatedAt ?? null,
      domainCheckedAt: { ...(enrichment?.domainCheckedAt ?? {}) },
      enrichmentPricingVerifiedAt: pricing?.verifiedAt ?? null,
      enrichmentPricingSourceIds: pricing?.sourceIds ?? [],
      softwarePricingVerifiedAt: software.pricingVerifiedAt ?? null,
      researchDate: review?.researchDate ?? software.lastResearchedAt ?? null,
    },
    pricingVerification: {
      attempted: false,
      verified: false,
      httpStatus: null,
      sourceId: null,
      sourceUrl: null,
      planNamesChecked: [],
      planNamesFound: [],
      planHitRatio: 0,
      rejectReason: null,
      verifiedAt: null,
      stampApplied: false,
    },
    dependentPages: dependents,
    notes,
  };
}
