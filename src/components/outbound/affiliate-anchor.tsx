"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { trackAffiliateClick } from "@/analytics/affiliate-click";

export type AffiliateAnchorProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** When affiliate, includes sponsored. Official fallback omits sponsored. */
  isAffiliate?: boolean;
  rel?: string[];
  softwareId: string;
  vendor?: string;
  placement?: string;
  pageType?: string;
  affiliateProgram?: string | null;
  promotionId?: string | null;
  destinationType?: string | null;
  showExternalIcon?: boolean;
  onNavigate?: () => void;
};

/**
 * Client anchor for commercial destinations.
 * Opens in a new tab; tracks without delaying navigation.
 */
export function AffiliateAnchor({
  href,
  children,
  className,
  isAffiliate = true,
  rel,
  softwareId,
  vendor,
  placement = "other",
  pageType,
  affiliateProgram,
  promotionId,
  destinationType,
  showExternalIcon = false,
  onNavigate,
}: AffiliateAnchorProps) {
  const resolvedRel =
    rel ??
    (isAffiliate
      ? ["sponsored", "noopener", "noreferrer"]
      : ["noopener", "noreferrer"]);

  return (
    <a
      href={href}
      rel={resolvedRel.join(" ")}
      target="_blank"
      className={cn(className)}
      onClick={() => {
        trackAffiliateClick({
          software_id: softwareId,
          vendor,
          placement,
          page_type: pageType,
          page_path:
            typeof window !== "undefined" ? window.location.pathname : undefined,
          affiliate_program: affiliateProgram,
          promotion_id: promotionId,
          destination_url: href,
          is_affiliate: isAffiliate,
          destination_type: destinationType,
        });
        onNavigate?.();
      }}
    >
      {children}
      {showExternalIcon ? (
        <span className="ml-1 inline-block" aria-hidden>
          ↗
        </span>
      ) : null}
    </a>
  );
}
