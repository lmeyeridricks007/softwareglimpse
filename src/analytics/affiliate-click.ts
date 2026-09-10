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

  // First-party aggregate beacon (path/host only). Override via __SG_AFFILIATE_BEACON__.
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function" &&
    typeof window !== "undefined"
  ) {
    const endpoint =
      (window as Window & { __SG_AFFILIATE_BEACON__?: string })
        .__SG_AFFILIATE_BEACON__ ?? "/api/analytics/affiliate-click";
    try {
      const body = JSON.stringify({
        name: "affiliate_clicked",
        software_id: properties.software_id,
        vendor: properties.vendor,
        page_path:
          properties.page_path ??
          (typeof window !== "undefined" ? window.location.pathname : "/"),
        placement: properties.placement,
        affiliate_program: properties.affiliate_program ?? null,
        promotion_id: properties.promotion_id ?? null,
        destination_domain: domain,
        destination_type: properties.destination_type ?? null,
        is_affiliate: properties.is_affiliate ?? true,
        referrer_host: (() => {
          try {
            return document.referrer
              ? new URL(document.referrer).hostname.replace(/^www\./, "")
              : null;
          } catch {
            return null;
          }
        })(),
      });
      navigator.sendBeacon(
        endpoint,
        new Blob([body], { type: "application/json" }),
      );
    } catch {
      // Never block navigation.
    }
  }
}
