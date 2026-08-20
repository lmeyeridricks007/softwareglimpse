import { track } from "./events";

export type AffiliateClickProperties = {
  software_id: string;
  vendor?: string;
  page_type?: string;
  page_path?: string;
  placement?: string;
  affiliate_program?: string | null;
  promotion_id?: string | null;
  destination_domain?: string | null;
  is_affiliate?: boolean;
  destination_type?: string | null;
};

function destinationDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Fire-and-forget affiliate click tracking.
 * Must never delay navigation — callers should not await this.
 */
export function trackAffiliateClick(
  properties: AffiliateClickProperties & { destination_url?: string | null },
): void {
  const domain =
    properties.destination_domain ??
    destinationDomain(properties.destination_url);

  track({
    name: "affiliate_clicked",
    properties: {
      software_id: properties.software_id,
      slug: properties.software_id,
      vendor: properties.vendor,
      page_type: properties.page_type,
      page_path: properties.page_path,
      placement: properties.placement,
      location: properties.placement,
      affiliate_program: properties.affiliate_program ?? null,
      promotion_id: properties.promotion_id ?? null,
      destination_domain: domain,
      isAffiliate: properties.is_affiliate ?? true,
      destinationType: properties.destination_type ?? null,
    },
  });

  // Optional beacon for future HTTP analytics endpoints (no-op when unset).
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function" &&
    typeof window !== "undefined"
  ) {
    const endpoint = (window as Window & { __SG_AFFILIATE_BEACON__?: string })
      .__SG_AFFILIATE_BEACON__;
    if (endpoint) {
      try {
        const body = JSON.stringify({
          name: "affiliate_clicked",
          ...properties,
          destination_domain: domain,
        });
        navigator.sendBeacon(endpoint, body);
      } catch {
        // Never block navigation.
      }
    }
  }
}
