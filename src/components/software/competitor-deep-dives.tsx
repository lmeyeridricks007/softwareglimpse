import Link from "next/link";
import { GitCompare } from "lucide-react";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type CompetitorDeepDiveItem = {
  competitorSlug: string;
  competitorName: string;
  competitorLogo?: { src: string; alt: string } | null;
  headline: string;
  chooseCurrentIf: string[];
  chooseCompetitorIf: string[];
  keyDifference: string;
  summary?: string;
  comparisonHref?: string;
};

export type CompetitorDeepDiveCardsProps = {
  productName: string;
  productLogo?: { src: string; alt: string } | null;
  items: CompetitorDeepDiveItem[];
  className?: string;
};

export function CompetitorDeepDiveCards({
  productName,
  productLogo,
  items,
  className,
}: CompetitorDeepDiveCardsProps) {
  if (items.length === 0) return null;

  return (
    <section
      id="competitor-dives"
      aria-labelledby="competitor-dives-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="competitor-dives-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {productName} vs the competition
      </h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.competitorSlug}>
            <Card className="flex flex-col">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <ProductLogo
                  name={productName}
                  logo={productLogo}
                  size="md"
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  vs
                </span>
                <ProductLogo
                  name={item.competitorName}
                  logo={item.competitorLogo}
                  size="md"
                />
              </div>

              <h3 className="mt-4 text-center font-semibold text-[var(--sg-color-text)]">
                {item.headline}
              </h3>
              {item.summary ? (
                <p className="mt-2 text-center text-sm text-[var(--sg-color-text-muted)]">
                  {item.summary}
                </p>
              ) : null}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {item.chooseCurrentIf.length > 0 ? (
                  <div className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)]/35 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                      Choose {productName} if
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                      {item.chooseCurrentIf.map((point) => (
                        <li key={point}>· {point}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {item.chooseCompetitorIf.length > 0 ? (
                  <div className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                      Choose {item.competitorName} if
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                      {item.chooseCompetitorIf.map((point) => (
                        <li key={point}>· {point}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                <span className="font-semibold text-[var(--sg-color-text)]">
                  Key difference:
                </span>{" "}
                {item.keyDifference}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {item.comparisonHref ? (
                  <ButtonLink href={item.comparisonHref} size="sm">
                    <GitCompare className="size-4" aria-hidden />
                    Full comparison
                  </ButtonLink>
                ) : null}
                <Link
                  href={`/software/${item.competitorSlug}/`}
                  className="inline-flex items-center text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {withSingleArrow(`${item.competitorName} review`)}
                </Link>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
