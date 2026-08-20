import type { CommercialCtaContext } from "@/domain";
import { resolveCommercialCta } from "@/services/affiliate/resolve-cta";
import { AffiliateAnchor } from "@/components/outbound/affiliate-anchor";
import { ExternalLink } from "@/components/outbound/external-link";

type Props = {
  productId: string;
  context?: CommercialCtaContext;
  className?: string;
};

/**
 * Live promotion callout — renders nothing when no active verified promotion.
 * Prefer this over baking promo claims into static prose.
 * CTA uses the direct affiliate destination; terms stay editorial (not sponsored).
 */
export function SoftwarePromotionBanner({
  productId,
  context = "other",
  className,
}: Props) {
  const resolved = resolveCommercialCta({
    productSlug: productId,
    context,
    intent: "GET_DEAL",
    location: "promotion-banner",
  });

  if (!resolved.promotion || !resolved.externalUrl) {
    return null;
  }

  const promo = resolved.promotion;

  return (
    <aside
      className={
        className ??
        "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-accent-soft)] p-4"
      }
      aria-label="Current promotion"
    >
      <p className="text-sm font-semibold text-[var(--color-fg)]">
        {promo.headline}
      </p>
      {promo.subtext ? (
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{promo.subtext}</p>
      ) : null}
      {promo.promoCode ? (
        <p className="mt-2 text-sm">
          Code: <span className="font-mono font-medium">{promo.promoCode}</span>
          {promo.codeRequired ? " (required)" : null}
        </p>
      ) : null}
      {promo.expiresAt ? (
        <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
          Ends {promo.expiresAt.slice(0, 10)}
        </p>
      ) : null}
      {promo.terms.length > 0 ? (
        <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
          {promo.terms.join(" · ")}
        </p>
      ) : null}
      <AffiliateAnchor
        href={resolved.externalUrl}
        isAffiliate={resolved.affiliate}
        rel={resolved.rel}
        softwareId={productId}
        vendor={resolved.productName}
        placement="promotion-banner"
        pageType={context}
        affiliateProgram={resolved.programme.id}
        promotionId={promo.id}
        destinationType={resolved.destination.type}
        className="mt-3 inline-flex rounded-[var(--radius-md)] bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-[var(--color-accent-fg)]"
      >
        {resolved.label}
      </AffiliateAnchor>
    </aside>
  );
}

/** @deprecated Prefer SoftwarePromotionBanner */
export const SoftwarePromotion = SoftwarePromotionBanner;

/** Optional editorial terms link helper (not sponsored). */
export function PromotionTermsLink({
  href,
  label = "View offer terms",
}: {
  href: string;
  label?: string;
}) {
  return (
    <ExternalLink href={href} type="editorial-reference" className="text-xs">
      {label}
    </ExternalLink>
  );
}
