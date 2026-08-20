import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  decision: NonNullable<BestPageModel["decision"]>;
  className?: string;
};

export function BestSoftwareDecision({ decision, className }: Props) {
  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {decision.heading}
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        What matters most?
      </p>
      <ul className="mt-5 space-y-3">
        {decision.paths.map((path) => (
          <li
            key={`${path.priority}-${path.product.slug}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3"
          >
            <div>
              <p className="font-semibold text-[var(--sg-color-text)]">
                {path.priority}
              </p>
              {path.label ? (
                <p className="text-xs text-[var(--sg-color-text-muted)]">
                  {path.label}
                </p>
              ) : null}
            </div>
            <Link
              href={path.product.href}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--sg-color-primary)]"
            >
              <ProductLogo
                name={path.product.name}
                logo={path.product.logo}
                size="sm"
              />
              {path.product.name}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      {decision.finderHref && decision.finderLabel ? (
        <div className="mt-5">
          <ButtonLink href={decision.finderHref}>
            {decision.finderLabel}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
