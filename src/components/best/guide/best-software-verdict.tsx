import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  verdict: NonNullable<BestPageModel["verdict"]>;
  className?: string;
};

export function BestSoftwareVerdict({ verdict, className }: Props) {
  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {verdict.heading}
      </h2>
      <p className="mt-3 max-w-3xl text-[length:var(--sg-text-body)] text-[var(--sg-color-text-muted)]">
        {verdict.body}
      </p>
      {verdict.paths.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {verdict.paths.map((path) => (
            <li
              key={path.product.slug}
              className="flex flex-wrap items-center gap-3 text-sm"
            >
              <ProductLogo
                name={path.product.name}
                logo={path.product.logo}
                size="sm"
              />
              <span>
                Choose{" "}
                <Link
                  href={path.product.href}
                  className="font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {path.product.name}
                </Link>{" "}
                if {path.when}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {verdict.finderHref && verdict.finderLabel ? (
        <div className="mt-6">
          <p className="text-sm font-medium text-[var(--sg-color-text)]">
            Still unsure?
          </p>
          <ButtonLink href={verdict.finderHref} className="mt-2">
            {verdict.finderLabel}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
