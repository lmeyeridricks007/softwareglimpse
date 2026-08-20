import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  categoryShortName: string;
  useCases: BestPageModel["useCases"];
  comparisons: BestPageModel["comparisons"];
  buyingSteps: Array<{ title: string }>;
  calculatorHref?: string;
  calculatorLabel?: string;
  className?: string;
};

/** Mockup 4-quadrant decision-support strip. */
export function BestSoftwareResourceGrid({
  categoryShortName,
  useCases,
  comparisons,
  buyingSteps,
  calculatorHref,
  calculatorLabel,
  className,
}: Props) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-4", className)}>
      <Card className="p-5">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          Best {categoryShortName} by use case
        </h3>
        <ul className="mt-4 space-y-2.5">
          {useCases.slice(0, 5).map((uc) => (
            <li key={uc.slug}>
              <Link
                href={uc.href}
                className="inline-flex items-center gap-2 text-sm text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                <ArrowRight className="size-3.5 shrink-0" aria-hidden />
                {uc.title}
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          Popular comparisons
        </h3>
        <ul className="mt-4 space-y-3">
          {comparisons.slice(0, 4).map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="group block">
                <span className="flex items-center gap-1.5">
                  {c.products.slice(0, 2).map((p) => (
                    <ProductLogo
                      key={p.slug}
                      name={p.name}
                      logo={p.logo}
                      size="sm"
                    />
                  ))}
                </span>
                <span className="mt-1.5 block text-sm font-medium text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                  {c.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          {categoryShortName} pricing guide
        </h3>
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Pricing is usually per seat and plan tier. Model real cost before you
          commit.
        </p>
        <div className="mt-4 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] px-3 py-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-primary)]">
            Typical range
          </p>
          <p className="mt-1 font-semibold text-[var(--sg-color-navy)]">
            Use the cost calculator
          </p>
        </div>
        {calculatorHref ? (
          <ButtonLink href={calculatorHref} className="mt-4 w-full justify-center" size="sm">
            {calculatorLabel ?? "Open cost calculator"}
          </ButtonLink>
        ) : null}
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          What to look for in {categoryShortName}
        </h3>
        <ul className="mt-4 space-y-2">
          {buyingSteps.slice(0, 5).map((step) => (
            <li
              key={step.title}
              className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
            >
              <Check
                className="mt-0.5 size-3.5 shrink-0 text-[var(--sg-color-success)]"
                aria-hidden
              />
              {step.title}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
