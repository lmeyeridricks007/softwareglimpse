import type { CommercialCtaContext, CommercialCtaIntent } from "@/domain";
import { resolveCommercialCta } from "@/services/affiliate/resolve-cta";
import { AffiliateCta } from "./affiliate-cta";
import { SoftwarePromotionBanner } from "./software-promotion";
import { AffiliateAnchor } from "@/components/outbound/affiliate-anchor";

type Variant =
  | "inline"
  | "button"
  | "card"
  | "promotion-banner"
  | "comparison-table"
  | "tool-result";

type Props = {
  productId: string;
  context?: CommercialCtaContext;
  intent?: CommercialCtaIntent;
  variant?: Variant;
  /** Show promotion callout above the CTA when active. */
  showPromotion?: boolean;
  /** Forwarded to AffiliateCta — set false when a page-level disclosure is shown. */
  showDisclosure?: boolean;
  className?: string;
  /** Override default resolved label. */
  label?: string;
};

/**
 * Semantic commercial CTA — never accepts a raw affiliate URL.
 * Links directly to the registry destination (not /go/).
 */
export function SoftwareCta({
  productId,
  context = "other",
  intent,
  variant = "button",
  showPromotion = false,
  showDisclosure = true,
  className,
  label,
}: Props) {
  const resolved = resolveCommercialCta({
    productSlug: productId,
    context,
    intent,
    location:
      variant === "tool-result"
        ? "tool-result"
        : variant === "comparison-table"
          ? "comparison"
          : variant === "promotion-banner"
            ? "promotion-banner"
            : "hero",
  });

  if (!resolved.available || !resolved.externalUrl) {
    return null;
  }

  if (variant === "promotion-banner") {
    return (
      <SoftwarePromotionBanner
        productId={productId}
        context={context}
        className={className}
      />
    );
  }

  const placement =
    variant === "tool-result"
      ? "tool-result"
      : variant === "comparison-table"
        ? "comparison"
        : "hero";

  const link = {
    href: resolved.externalUrl,
    isAffiliate: resolved.affiliate,
    rel: resolved.rel,
    disclosureRequired: resolved.disclosureRequired,
    network: (resolved.programme.network ?? "none") as
      | "none"
      | "other"
      | "impact"
      | "partnerstack"
      | "shareasale"
      | "cj"
      | "awin"
      | "direct",
    location: "hero" as const,
    commercial: resolved,
  };

  if (variant === "inline") {
    return (
      <AffiliateAnchor
        href={resolved.externalUrl}
        isAffiliate={resolved.affiliate}
        rel={resolved.rel}
        softwareId={productId}
        vendor={resolved.productName}
        placement={placement}
        pageType={context}
        affiliateProgram={resolved.programme.id}
        promotionId={resolved.promotion?.id ?? null}
        destinationType={resolved.destination.type}
        className={
          className ??
          "font-medium text-[var(--color-accent)] underline-offset-2 hover:underline"
        }
      >
        {label ?? resolved.label}
      </AffiliateAnchor>
    );
  }

  if (variant === "card" || variant === "tool-result") {
    return (
      <div
        className={
          className ??
          "rounded-[var(--radius-md)] border border-[var(--color-border)] p-4"
        }
      >
        {showPromotion && resolved.promotion ? (
          <p className="mb-2 text-sm text-[var(--color-fg-muted)]">
            Current offer: {resolved.promotion.headline}
          </p>
        ) : null}
        <AffiliateCta
          label={label ?? resolved.label}
          link={link}
          showDisclosure={showDisclosure}
          placement={placement}
        />
      </div>
    );
  }

  // button / comparison-table
  return (
    <div className={className}>
      {showPromotion && resolved.promotion ? (
        <p className="mb-2 text-sm text-[var(--color-fg-muted)]">
          Current offer: {resolved.promotion.headline}
        </p>
      ) : null}
      <AffiliateCta
        label={label ?? resolved.label}
        link={link}
        showDisclosure={showDisclosure}
        placement={placement}
        className={
          variant === "button"
            ? "h-11 px-5 text-base"
            : undefined
        }
      />
    </div>
  );
}
