import { getAllSoftwareUnfiltered } from "@/data";
import {
  listAffiliateDestinations,
  listAffiliateProgrammes,
} from "@/data/affiliates/store";
import { resolveCommercialCta } from "@/services/affiliate/resolve-cta";
import { validateAffiliateUrl } from "@/services/affiliate/url-validation";
import { resolveProductOfficialLinks } from "@/services/outbound/resolve-product-links";
import { isPubliclyAvailable } from "@/domain/publishing";

export type OutboundLinkHealthReport = {
  generatedAt: string;
  affiliate: {
    destinations: number;
    programmesActive: number;
    resolvedDirect: number;
    missingDestination: number;
    malformedUrl: number;
    missingTrackingParams: number;
  };
  evidence: {
    productsWithOfficialWebsite: number;
    productsWithPricingSource: number;
    productsWithDocumentation: number;
    productsWithSecuritySource: number;
    productsMissingPricingSource: string[];
    unavailableSources: number;
    unverifiedSources: number;
    affiliateNetworkAsEvidence: number;
  };
  seo: {
    goRouteRetainedForCompat: true;
    newMarkupUsesDirectExternalUrl: true;
    sponsoredRequiredOnAffiliate: true;
  };
};

/**
 * Internal outbound link health summary for editorial/ops dashboards.
 */
export function buildOutboundLinkHealthReport(
  now: Date = new Date(),
): OutboundLinkHealthReport {
  const destinations = listAffiliateDestinations();
  const programmes = listAffiliateProgrammes().filter(
    (p) => p.status === "active",
  );
  const products = getAllSoftwareUnfiltered().filter((p) =>
    isPubliclyAvailable(p.metadata),
  );

  let resolvedDirect = 0;
  let missingDestination = 0;
  let malformedUrl = 0;
  let missingTrackingParams = 0;

  for (const product of products) {
    const cta = resolveCommercialCta({
      productSlug: product.slug,
      context: "software-review",
    });
    if (!cta.available || !cta.externalUrl) {
      if (product.affiliate?.enabled) missingDestination += 1;
      continue;
    }
    resolvedDirect += 1;
    const validated = validateAffiliateUrl(cta.externalUrl);
    if (!validated.ok) {
      malformedUrl += 1;
      continue;
    }
    if (cta.affiliate) {
      const hasTracking =
        /[?&](ref|affiliate|partner|utm_|subid|clickref|campaign|sid)=/i.test(
          cta.externalUrl,
        ) || cta.externalUrl.includes("partnerlinks");
      if (!hasTracking) missingTrackingParams += 1;
    }
  }

  let productsWithOfficialWebsite = 0;
  let productsWithPricingSource = 0;
  let productsWithDocumentation = 0;
  let productsWithSecuritySource = 0;
  const productsMissingPricingSource: string[] = [];
  let unavailableSources = 0;
  let unverifiedSources = 0;
  let affiliateNetworkAsEvidence = 0;

  for (const product of products) {
    const links = resolveProductOfficialLinks(product);
    if (links.officialWebsite) productsWithOfficialWebsite += 1;
    if (links.pricing) productsWithPricingSource += 1;
    else productsMissingPricingSource.push(product.slug);
    if (links.documentation || links.helpCenter) {
      productsWithDocumentation += 1;
    }
    if (links.security) productsWithSecuritySource += 1;

    for (const source of product.sources ?? []) {
      if (source.sourceHealth === "unavailable") unavailableSources += 1;
      if (source.url && !source.verifiedAt && !source.retrievedAt) {
        unverifiedSources += 1;
      }
      if (source.sourceType === "affiliate-network" && source.url) {
        affiliateNetworkAsEvidence += 1;
      }
    }
  }

  return {
    generatedAt: now.toISOString(),
    affiliate: {
      destinations: destinations.length,
      programmesActive: programmes.length,
      resolvedDirect,
      missingDestination,
      malformedUrl,
      missingTrackingParams,
    },
    evidence: {
      productsWithOfficialWebsite,
      productsWithPricingSource,
      productsWithDocumentation,
      productsWithSecuritySource,
      productsMissingPricingSource: productsMissingPricingSource.slice(0, 50),
      unavailableSources,
      unverifiedSources,
      affiliateNetworkAsEvidence,
    },
    seo: {
      goRouteRetainedForCompat: true,
      newMarkupUsesDirectExternalUrl: true,
      sponsoredRequiredOnAffiliate: true,
    },
  };
}
