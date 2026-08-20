import type { AffiliateResolveInput, Software } from "@/domain";
import {
  resolveCommercialCta,
  type ResolvedCommercialCta,
} from "./resolve-cta";

export type ResolvedAffiliateLink = {
  /** Direct external destination (affiliate or official). Prefer over goPath. */
  href: string;
  isAffiliate: boolean;
  rel: string[];
  disclosureRequired: boolean;
  network: Software["affiliate"]["network"];
  location: AffiliateResolveInput["location"];
  /** Extended commercial resolution (promotions, go path for backward-compat). */
  commercial?: ResolvedCommercialCta;
};

/**
 * Backward-compatible affiliate URL resolver.
 * Pages should use `href` (direct external URL). Keep `commercial.goPath`
 * only for legacy shared links / server redirects.
 */
export function resolveAffiliateLink(
  software: Software,
  input: Pick<AffiliateResolveInput, "location" | "campaign" | "subId"> = {
    location: "other",
  },
): ResolvedAffiliateLink | null {
  const context =
    input.location === "pricing"
      ? "pricing-page"
      : input.location === "recommendation"
        ? "finder"
        : input.location === "comparison"
          ? "comparison"
          : "software-review";

  const resolved = resolveCommercialCta(
    {
      productSlug: software.slug,
      context,
      location: input.location,
      campaign: input.campaign,
      subId: input.subId,
    },
    software,
  );

  if (!resolved.available || !resolved.externalUrl) {
    return null;
  }

  return {
    href: resolved.externalUrl,
    isAffiliate: resolved.affiliate,
    rel: resolved.rel,
    disclosureRequired: resolved.disclosureRequired,
    network:
      (resolved.programme.network as Software["affiliate"]["network"]) ??
      software.affiliate.network,
    location: input.location,
    commercial: resolved,
  };
}

export { resolveCommercialCta } from "./resolve-cta";
export type { ResolvedCommercialCta } from "./resolve-cta";
