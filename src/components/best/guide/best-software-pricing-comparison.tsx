import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  pricing: NonNullable<BestPageModel["pricing"]>;
  className?: string;
};

export function BestSoftwarePricingComparison({ pricing, className }: Props) {
  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {pricing.heading}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        {pricing.intro}
      </p>
      {pricing.lastChecked ? (
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Last pricing check: {pricing.lastChecked}
        </p>
      ) : null}

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pricing.rows.map((row) => (
          <li key={row.product.slug}>
            <Card className="h-full p-4">
              <div className="flex items-center gap-2">
                <ProductLogo
                  name={row.product.name}
                  logo={row.product.logo}
                  size="sm"
                />
                <Link
                  href={row.product.href}
                  className="font-semibold underline-offset-2 hover:underline"
                >
                  {row.product.name}
                </Link>
              </div>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--sg-color-text-muted)]">
                    Starting price
                  </dt>
                  <dd>{row.startingPrice ?? "See pricing"}</dd>
                </div>
                {row.model ? (
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--sg-color-text-muted)]">Model</dt>
                    <dd>{row.model}</dd>
                  </div>
                ) : null}
                {row.freeTrial ? (
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--sg-color-text-muted)]">
                      Free trial
                    </dt>
                    <dd>{row.freeTrial}</dd>
                  </div>
                ) : null}
                {row.freePlan ? (
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--sg-color-text-muted)]">
                      Free plan
                    </dt>
                    <dd>{row.freePlan}</dd>
                  </div>
                ) : null}
              </dl>
            </Card>
          </li>
        ))}
      </ul>

      {pricing.calculatorHref ? (
        <div className="mt-5">
          <ButtonLink href={pricing.calculatorHref}>
            Open cost calculator
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
