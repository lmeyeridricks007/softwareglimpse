import type { GuidePage } from "@/domain/schemas";
import { getSoftwareBySlug } from "@/data/repositories/catalog";
import { loadEnrichment } from "@/data/research/store";
import { resolveEvidenceLevel } from "@/services/editorial/evidence-level";
import { resolvePricingVerifiedAt } from "@/services/editorial/pricing-verified-at";
import { getFounderAuthor, resolveAuthor } from "@/services/site-foundation";
import type { CredibilitySignals } from "./types";

/**
 * Surface credibility signals only when structured data exists.
 * Never invent research dates, evidence levels, or sources.
 * Never treat enrichment.updatedAt as data verification.
 */
export function resolveCredibilitySignals(guide: GuidePage): CredibilitySignals {
  const productSlug = guide.productSlugs[0];
  const software = productSlug ? getSoftwareBySlug(productSlug) : null;
  const enrichment = productSlug ? loadEnrichment(productSlug) : null;

  const lastResearched =
    software?.lastResearchedAt ||
    enrichment?.updatedAt ||
    software?.metadata?.updatedAt ||
    guide.metadata.updatedAt ||
    null;

  const pricingChecked = resolvePricingVerifiedAt(software);

  let evidenceLevel: string | null = null;
  if (software || enrichment) {
    evidenceLevel = resolveEvidenceLevel({
      pricingVerifiedAt: pricingChecked,
      lastVerifiedAt: software?.lastVerifiedAt,
      lastResearchedAt: software?.lastResearchedAt,
      hasResearchSources: (enrichment?.sourceIds?.length ?? 0) > 0,
    });
  }

  const hasSources = (enrichment?.sourceIds?.length ?? 0) > 0;
  const author =
    resolveAuthor(guide.metadata.author) || getFounderAuthor();

  return {
    lastResearched: lastResearched ?? null,
    pricingChecked: pricingChecked ?? null,
    evidenceLevel,
    hasSources,
    methodologyHref: "/company/editorial-methodology/",
    authorName: author?.name ?? null,
    lastSubstantiveUpdate:
      guide.metadata.updatedAt ||
      software?.lastResearchedAt ||
      enrichment?.updatedAt ||
      null,
  };
}
