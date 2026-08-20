import type { ReactNode } from "react";
import type {
  CommercialCtaContext,
  CommercialCtaIntent,
} from "@/domain";
import { resolveCommercialCta } from "@/services/affiliate/resolve-cta";
import { AffiliateAnchor } from "./affiliate-anchor";

type Props = {
  softwareId: string;
  children?: ReactNode;
  context?: CommercialCtaContext;
  intent?: CommercialCtaIntent;
  placement?: string;
  className?: string;
  /** Override resolved CTA label when children omitted. */
  label?: string;
  showExternalIcon?: boolean;
};

/**
 * Semantic commercial link — resolves from the affiliate registry to a
 * direct external destination (not /go/). Prefer over hard-coded affiliate URLs.
 */
export function AffiliateLink({
  softwareId,
  children,
  context = "other",
  intent,
  placement = "other",
  className,
  label,
  showExternalIcon = false,
}: Props) {
  const resolved = resolveCommercialCta({
    productSlug: softwareId,
    context,
    intent,
    location: placement as "other",
  });

  if (!resolved.available || !resolved.externalUrl) {
    return null;
  }

  return (
    <AffiliateAnchor
      href={resolved.externalUrl}
      isAffiliate={resolved.affiliate}
      rel={resolved.rel}
      softwareId={softwareId}
      vendor={resolved.productName}
      placement={placement}
      pageType={context}
      affiliateProgram={resolved.programme.id}
      promotionId={resolved.promotion?.id ?? null}
      destinationType={resolved.destination.type}
      className={className}
      showExternalIcon={showExternalIcon}
    >
      {children ?? label ?? resolved.label}
    </AffiliateAnchor>
  );
}
