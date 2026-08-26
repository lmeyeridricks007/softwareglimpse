import { ProductLogo } from "@/components/software/product-logo";
import { FeatureChecklist } from "@/components/software/software-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AffiliateAnchor } from "@/components/outbound/affiliate-anchor";
import { cn } from "@/lib/cn";

export type DecisionPanelProduct = {
  slug: string;
  name: string;
  categoryLabel: string;
  bestFor: string;
  strengths: string[];
  logo?: { src: string; alt: string } | null;
  reviewHref: string;
  alternativesHref?: string | null;
  promotionLabel?: string | null;
  /** Direct affiliate/official visit URL when available. */
  visitHref?: string | null;
  visitIsAffiliate?: boolean;
};

type Props = {
  product: DecisionPanelProduct;
  className?: string;
};

/** Featured software decision card for the homepage hero. */
export function HomepageDecisionPanel({ product, className }: Props) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_70%_40%,rgb(37_99_235/0.14),transparent_65%)]"
        aria-hidden
      />

      <Card
        variant="highlighted"
        className="relative z-10 overflow-hidden p-0 shadow-[0_20px_48px_rgb(15_23_42/0.10)]"
      >
        <div className="border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)]/60 px-5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Discover · Compare · Decide
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <ProductLogo name={product.name} logo={product.logo} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-[var(--sg-color-text)]">
                  {product.name}
                </h3>
                {product.promotionLabel ? (
                  <Badge variant="promotion">{product.promotionLabel}</Badge>
                ) : (
                  <Badge variant="editorial-choice">Top pick</Badge>
                )}
              </div>
              <p className="mt-0.5 text-sm font-medium text-[var(--sg-color-text-muted)]">
                {product.categoryLabel}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-[var(--sg-color-text)]">
            <span className="font-semibold">Best for: </span>
            <span className="text-[var(--sg-color-text-muted)]">
              {product.bestFor}
            </span>
          </p>

          <FeatureChecklist
            items={product.strengths.slice(0, 3)}
            className="mt-4"
          />

          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href={product.reviewHref} size="md">
              Read review
            </ButtonLink>
            {product.alternativesHref ? (
              <ButtonLink href={product.alternativesHref} variant="outline" size="md">
                View alternatives
              </ButtonLink>
            ) : null}
            {product.visitHref ? (
              <AffiliateAnchor
                href={product.visitHref}
                isAffiliate={product.visitIsAffiliate ?? true}
                softwareId={product.slug}
                vendor={product.name}
                placement="homepage-decision"
                pageType="homepage"
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)] px-4 text-sm font-medium text-[var(--sg-color-primary)] transition-colors hover:bg-[var(--sg-color-primary-soft)]"
                showExternalIcon
              >
                Visit {product.name}
              </AffiliateAnchor>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
