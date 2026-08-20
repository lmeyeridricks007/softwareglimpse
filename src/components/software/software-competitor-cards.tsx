import Link from "next/link";
import { GitCompare } from "lucide-react";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type CompetitorCardItem = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  shortDescription?: string | null;
  compareHref?: string | null;
  reviewHref: string;
};

type Props = {
  productName: string;
  productLogo?: { src: string; alt: string } | null;
  competitors: CompetitorCardItem[];
  className?: string;
};

export function SoftwareCompetitorCards({
  productName,
  productLogo,
  competitors,
  className,
}: Props) {
  if (competitors.length === 0) return null;

  return (
    <section
      id="alternatives"
      aria-labelledby="alternatives-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="alternatives-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {productName} alternatives
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {competitors.map((item) => (
          <li key={item.slug}>
            <Card className="flex h-full flex-col">
              <div className="flex items-center justify-center gap-3">
                <ProductLogo
                  name={productName}
                  logo={productLogo}
                  size="md"
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  vs
                </span>
                <ProductLogo name={item.name} logo={item.logo} size="md" />
              </div>
              <h3 className="mt-4 text-center font-semibold text-[var(--sg-color-text)]">
                {item.name}
              </h3>
              {item.shortDescription ? (
                <p className="mt-2 flex-1 text-center text-sm text-[var(--sg-color-text-muted)]">
                  {item.shortDescription}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {item.compareHref ? (
                  <ButtonLink href={item.compareHref} size="sm">
                    <GitCompare className="size-4" aria-hidden />
                    Compare
                  </ButtonLink>
                ) : (
                  <ButtonLink href={item.reviewHref} variant="outline" size="sm">
                    Read review
                  </ButtonLink>
                )}
              </div>
              {item.compareHref ? (
                <Link
                  href={item.reviewHref}
                  className="mt-3 text-center text-xs font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {withSingleArrow(`${item.name} review`)}
                </Link>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
