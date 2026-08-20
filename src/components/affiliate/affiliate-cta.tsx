"use client";

import type { ResolvedAffiliateLink } from "@/services/affiliate/resolve-affiliate-link";
import { cn } from "@/lib/cn";
import { AffiliateAnchor } from "@/components/outbound/affiliate-anchor";

type Props = {
  label: string;
  link: ResolvedAffiliateLink;
  className?: string;
  /** When false, omit the inline affiliate sentence (page-level disclosure may cover it). */
  showDisclosure?: boolean;
  placement?: string;
};

export function AffiliateCta({
  label,
  link,
  className,
  showDisclosure = true,
  placement,
}: Props) {
  const softwareId = link.commercial?.productSlug ?? "unknown";

  return (
    <div className="flex flex-col gap-2">
      <AffiliateAnchor
        href={link.href}
        isAffiliate={link.isAffiliate}
        rel={link.rel}
        softwareId={softwareId}
        vendor={link.commercial?.productName}
        placement={placement ?? link.location}
        affiliateProgram={link.commercial?.programme.id ?? null}
        promotionId={link.commercial?.promotion?.id ?? null}
        destinationType={link.commercial?.destination.type ?? null}
        className={cn(
          "inline-flex h-10 w-fit items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-4 text-sm font-medium text-[var(--sg-color-primary-fg)] transition-colors hover:bg-[var(--sg-color-primary-hover)]",
          className,
        )}
      >
        {label}
      </AffiliateAnchor>
      {showDisclosure && link.disclosureRequired ? (
        <p className="text-xs text-[var(--sg-color-text-muted)]">
          Affiliate link — we may earn a commission at no extra cost to you.
        </p>
      ) : null}
    </div>
  );
}
