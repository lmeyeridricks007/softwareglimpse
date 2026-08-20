import Link from "next/link";
import { Check } from "lucide-react";
import type { Software } from "@/domain";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { ProductLogo } from "@/components/software/product-logo";
import { Rating } from "@/components/ui/rating";
import { AffiliateAnchor } from "@/components/outbound/affiliate-anchor";
import { cn } from "@/lib/cn";

export type SoftwareCardModel = {
  software: Software;
  href?: string;
  rating?: number | null;
  ratingApproved?: boolean;
  pricingTeaser?: string | null;
  bestFor?: string | null;
  /** Human category label (e.g. "CRM") — never raw slug. */
  categoryLabel?: string | null;
  promotionLabel?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string;
  ctaIsAffiliate?: boolean;
};

function humanizeCategorySlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SoftwareCard({
  software,
  href,
  rating,
  ratingApproved,
  pricingTeaser,
  bestFor,
  categoryLabel,
  promotionLabel,
  ctaHref,
  ctaLabel = "Visit site",
  ctaIsAffiliate = true,
  className,
}: SoftwareCardModel & { className?: string }) {
  const reviewHref = href ?? `/software/${software.slug}/`;
  const category =
    categoryLabel?.trim() ||
    humanizeCategorySlug(software.primaryCategorySlug);

  return (
    <Card variant="interactive" as="article" className={cn("flex h-full flex-col", className)}>
      <div className="flex items-start gap-3">
        <ProductLogo name={software.name} logo={software.logo} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-[var(--sg-color-text)]">
              <Link href={reviewHref} className="hover:text-[var(--sg-color-primary)]">
                {software.name}
              </Link>
            </h3>
            {promotionLabel ? (
              <Badge variant="promotion">{promotionLabel}</Badge>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            {category}
          </p>
          {ratingApproved && rating != null ? (
            <Rating score={rating} className="mt-1" />
          ) : null}
        </div>
      </div>

      {bestFor ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text)]">
          <span className="font-semibold">Best for: </span>
          <span className="text-[var(--sg-color-text-muted)]">{bestFor}</span>
        </p>
      ) : software.shortDescription ? (
        <p className="mt-3 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
          {software.shortDescription}
        </p>
      ) : null}

      {pricingTeaser ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text)]">
          <span className="text-[var(--sg-color-text-muted)]">From </span>
          <span className="font-medium">{pricingTeaser}</span>
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <ButtonLink href={reviewHref} variant="outline" size="sm">
          Read review
        </ButtonLink>
        {ctaHref ? (
          ctaHref.startsWith("http") ? (
            <AffiliateAnchor
              href={ctaHref}
              isAffiliate={ctaIsAffiliate}
              softwareId={software.slug}
              vendor={software.name}
              placement="software-card"
              className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-3 text-sm font-medium text-white shadow-[var(--sg-shadow-sm)] transition-colors hover:bg-[var(--sg-color-primary-hover)]"
            >
              {ctaLabel}
            </AffiliateAnchor>
          ) : (
            <ButtonLink href={ctaHref} variant="primary" size="sm">
              {ctaLabel}
            </ButtonLink>
          )
        ) : null}
      </div>
    </Card>
  );
}

export function FeatureChecklist({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-[var(--sg-color-text)]">
          <Check
            className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
