import Link from "next/link";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import type { IndustryHubProductFitCard } from "@/services/industry-hub";
import { cn } from "@/lib/cn";

type Props = {
  industryLabel: string;
  items: IndustryHubProductFitCard[];
  className?: string;
};

/**
 * Curated catalogue CRM shortlist with evidence-based fit notes.
 * Does not invent scores — overallScore comes from approved editorial research only.
 */
export function IndustryProductFitSection({
  industryLabel,
  items,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="product-fit"
      aria-labelledby="product-fit-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div>
        <h2
          id="product-fit-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          CRM software that fits {industryLabel.toLowerCase()}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          Shortlist from our CRM catalogue with fit notes grounded in published
          positioning and editorial assessments — not invented rankings or prices.
        </p>
      </div>

      <ul className="mt-5 grid gap-3 lg:grid-cols-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Card className="flex h-full flex-col p-5 shadow-[var(--sg-shadow-sm)]">
              <div className="flex items-start gap-3">
                <ProductLogo name={item.name} logo={item.logo} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--sg-color-text)]">
                    {item.name}
                  </p>
                  {item.overallScore != null ? (
                    <Rating score={item.overallScore} className="mt-1" />
                  ) : (
                    <Badge variant="neutral" className="mt-1">
                      Catalogue CRM
                    </Badge>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm text-[var(--sg-color-text)]">
                <span className="font-medium">Why it fits: </span>
                {item.why}
              </p>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                <span className="font-medium text-[var(--sg-color-text)]">
                  Best when:{" "}
                </span>
                {item.bestWhen}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--sg-color-border)] pt-4">
                <ButtonLink href={item.reviewHref} variant="secondary" size="sm">
                  {withSingleArrow("Review")}
                </ButtonLink>
                <Link
                  href={item.compareHref}
                  className="inline-flex items-center text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Compare
                </Link>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
