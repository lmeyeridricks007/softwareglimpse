import Link from "next/link";
import { EvidenceMark } from "@/components/industries/evidence-mark";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { AffiliateAnchor } from "@/components/outbound/affiliate-anchor";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import type { IndustryHubProductCard } from "@/services/industry-hub";
import { cn } from "@/lib/cn";

type Props = {
  title?: string;
  subtitle?: string;
  items: IndustryHubProductCard[];
  viewAllHref?: string;
  className?: string;
};

export function IndustryProductExplorer({
  title = "CRM software to evaluate",
  subtitle = "Explore catalogue CRM products and compare their capabilities against your requirements.",
  items,
  viewAllHref = "/categories/crm/",
  className,
}: Props) {
  return (
    <section
      id="software"
      aria-labelledby="software-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="software-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            {subtitle}
          </p>
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow("View all CRM software")}
          </Link>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-[var(--sg-color-text-muted)]">
          Catalogue CRM products will appear here as catalogue coverage grows.
        </p>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Card className="flex h-full flex-col p-4 shadow-[var(--sg-shadow-sm)]">
                <div className="flex items-start gap-3">
                  <ProductLogo name={item.name} logo={item.logo} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[var(--sg-color-text)]">
                      {item.name}
                    </p>
                    {item.overallScore != null ? (
                      <Rating score={item.overallScore} className="mt-1" />
                    ) : item.positioning ? (
                      <span
                        className="mt-1 inline-flex w-fit max-w-full items-center truncate rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] px-2 py-0.5 text-[11px] font-medium tracking-wide text-[var(--sg-color-primary-hover)]"
                        title={item.positioning}
                      >
                        {item.positioning}
                      </span>
                    ) : null}
                  </div>
                </div>

                {item.bestFor ? (
                  <p className="mt-3 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
                    {item.bestFor}
                  </p>
                ) : null}

                {item.pricingTeaser ? (
                  <p className="mt-3 text-sm font-medium text-[var(--sg-color-text)]">
                    {item.pricingTeaser}
                  </p>
                ) : null}

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.hasFreePlan === true ? (
                    <Badge variant="success">Free plan</Badge>
                  ) : null}
                  {item.hasFreeTrial === true ? (
                    <Badge variant="neutral">Free trial</Badge>
                  ) : null}
                  {item.hasOfficialIndustryDemo ? (
                    <Badge variant="success">Official industry demo</Badge>
                  ) : item.hasOfficialIndustryMedia ? (
                    <Badge variant="neutral">Industry media available</Badge>
                  ) : null}
                </div>

                {item.capabilitySnapshot.length > 0 ? (
                  <ul className="mt-3 space-y-1.5 border-t border-[var(--sg-color-border)] pt-3">
                    {item.capabilitySnapshot.map((cap) => (
                      <li
                        key={cap.featureSlug}
                        className="flex items-center gap-2 text-xs text-[var(--sg-color-text-muted)]"
                      >
                        <EvidenceMark cell={cap.cell} />
                        {cap.href ? (
                          <Link
                            href={cap.href}
                            className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                          >
                            {cap.featureName}
                          </Link>
                        ) : (
                          cap.featureName
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <ButtonLink href={item.reviewHref} variant="outline" size="sm">
                    View review
                  </ButtonLink>
                  {item.hasOfficialIndustryMedia ? (
                    <ButtonLink href="#see-in-industry" variant="ghost" size="sm">
                      See industry workflow
                    </ButtonLink>
                  ) : null}
                  <ButtonLink href={item.compareHref} variant="ghost" size="sm">
                    Compare
                  </ButtonLink>
                  {item.visitHref.startsWith("http") ? (
                    <AffiliateAnchor
                      href={item.visitHref}
                      softwareId={item.slug}
                      vendor={item.name}
                      placement="industry-explorer"
                      pageType="industry-hub"
                      className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-3 text-sm font-medium text-white shadow-[var(--sg-shadow-sm)] transition-colors hover:bg-[var(--sg-color-primary-hover)]"
                    >
                      Visit product
                    </AffiliateAnchor>
                  ) : (
                    <ButtonLink href={item.visitHref} size="sm">
                      Visit product
                    </ButtonLink>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
