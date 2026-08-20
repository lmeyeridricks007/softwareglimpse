import type { ReactNode } from "react";
import Link from "next/link";
import { ComparisonTabLink } from "@/components/comparison/page/comparison-page-client";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/cn";
import type {
  ComparisonPageModel,
  ComparisonPageProduct,
} from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
  visitCtaA?: ReactNode;
  visitCtaB?: ReactNode;
  className?: string;
};

function ProductSide({
  product,
  visitCta,
  crowned,
  accent,
}: {
  product: ComparisonPageProduct;
  visitCta?: ReactNode;
  crowned: boolean;
  accent: "a" | "b";
}) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col",
        accent === "a" && "ring-1 ring-[var(--sg-color-primary-soft)]",
        accent === "b" && "ring-1 ring-[var(--sg-color-border)]",
        crowned && "ring-2 ring-[var(--sg-color-primary)]",
      )}
    >
      {crowned ? (
        <Badge variant="editorial-choice" className="mb-3 w-fit uppercase">
          Stronger overall fit
        </Badge>
      ) : null}

      <div className="flex items-center gap-3">
        <ProductLogo name={product.name} logo={product.logo} size="lg" />
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-[var(--sg-color-text)]">
            {product.name}
          </h2>
          {product.scoreApproved && product.score != null ? (
            <Rating score={product.score} className="mt-1" />
          ) : (
            <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
              Score pending approval
            </p>
          )}
        </div>
      </div>

      {product.positioning ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          {product.positioning}
        </p>
      ) : null}

      {product.bestFor.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Best for
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
            {product.bestFor.slice(0, 3).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-4 space-y-1 text-sm">
        {product.startingPriceLabel ? (
          <p className="font-semibold text-[var(--sg-color-text)]">
            Starting from {product.startingPriceLabel}
          </p>
        ) : null}
        {product.freePlanLabel ? (
          <p className="text-[var(--sg-color-text-muted)]">
            {product.freePlanLabel}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {visitCta}
        <Link
          href={product.href}
          className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Read review
        </Link>
      </div>
    </Card>
  );
}

export function ComparisonVerdictHero({
  model,
  visitCtaA,
  visitCtaB,
  className,
}: Props) {
  const crownA = model.overallWinnerKind === "product-a";
  const crownB = model.overallWinnerKind === "product-b";

  return (
    <section
      aria-label="Comparison verdict"
      className={cn(
        "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)_minmax(0,1fr)] lg:items-stretch",
        className,
      )}
    >
      <ProductSide
        product={model.productA}
        visitCta={visitCtaA}
        crowned={crownA}
        accent="a"
      />

      <div className="relative flex flex-col">
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:flex"
          aria-hidden
        >
          <span className="flex size-10 items-center justify-center rounded-full border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-xs font-bold tracking-wide text-[var(--sg-color-text-muted)] shadow-[var(--sg-shadow-sm)]">
            VS
          </span>
        </div>
        <p className="mb-2 text-center text-xs font-bold tracking-wide text-[var(--sg-color-text-muted)] lg:hidden">
          VS
        </p>
        <Card
          variant="highlighted"
          className="flex h-full flex-col"
          aria-labelledby="comparison-verdict-heading"
        >
          <Badge variant="editorial-choice" className="w-fit uppercase">
            Our verdict
          </Badge>
          <h2 id="comparison-verdict-heading" className="sr-only">
            Our verdict
          </h2>

          <div className="mt-4 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--sg-color-text)]">
            {model.overallLabel}
          </div>

          {model.verdict ? (
            <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
              {model.verdict}
            </p>
          ) : null}

          <div className="mt-4 flex-1 space-y-3 border-t border-[var(--sg-color-border)] pt-4 text-sm">
            {model.winsA.length > 0 ? (
              <div>
                <p className="font-medium text-[var(--sg-color-success)]">
                  {model.productA.name} is better for
                </p>
                <ul className="mt-1.5 space-y-1 text-[var(--sg-color-text-muted)]">
                  {model.winsA.slice(0, 4).map((c) => (
                    <li key={c.slug}>✓ {c.name}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {model.winsB.length > 0 ? (
              <div>
                <p className="font-medium text-[var(--sg-color-danger)]">
                  {model.productB.name} is better for
                </p>
                <ul className="mt-1.5 space-y-1 text-[var(--sg-color-text-muted)]">
                  {model.winsB.slice(0, 4).map((c) => (
                    <li key={c.slug}>✓ {c.name}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {model.ties.length > 0 ? (
              <div>
                <p className="font-medium text-[var(--sg-color-text)]">Tie</p>
                <ul className="mt-1.5 space-y-1 text-[var(--sg-color-text-muted)]">
                  {model.ties.slice(0, 3).map((c) => (
                    <li key={c.slug}>• {c.name}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            {model.productA.bestFor[0] ? (
              <p className="text-[var(--sg-color-text-muted)]">
                <span className="font-medium text-[var(--sg-color-text)]">
                  Choose {model.productA.name} if:
                </span>{" "}
                {model.productA.bestFor[0]}
              </p>
            ) : null}
            {model.productB.bestFor[0] ? (
              <p className="text-[var(--sg-color-text-muted)]">
                <span className="font-medium text-[var(--sg-color-text)]">
                  Choose {model.productB.name} if:
                </span>{" "}
                {model.productB.bestFor[0]}
              </p>
            ) : null}
          </div>

          <ComparisonTabLink
            tab="scorecard"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-4 text-sm font-medium text-white hover:bg-[var(--sg-color-primary-hover)]"
          >
            See detailed comparison ↓
          </ComparisonTabLink>
        </Card>
      </div>

      <ProductSide
        product={model.productB}
        visitCta={visitCtaB}
        crowned={crownB}
        accent="b"
      />
    </section>
  );
}
