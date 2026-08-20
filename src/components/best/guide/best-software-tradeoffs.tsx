import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  items: BestPageModel["tradeOffs"];
  className?: string;
};

export function BestSoftwareTradeoffs({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        The trade-offs that matter
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Every CRM choice involves trade-offs. These strengths and limitations
        come from product assessments — not marketing copy.
      </p>
      <ul className="mt-6 grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.product.slug}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5"
          >
            <div className="flex items-center gap-3">
              <ProductLogo
                name={item.product.name}
                logo={item.product.logo}
                size="md"
              />
              <Link
                href={item.product.href}
                className="font-[family-name:var(--font-display)] text-lg font-semibold underline-offset-2 hover:underline"
              >
                {item.product.name}
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ul className="space-y-2">
                {item.strengths.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
                  >
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-[var(--sg-color-success)]"
                      aria-hidden
                    />
                    {s}
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {item.limitations.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
                  >
                    <Minus
                      className="mt-0.5 size-3.5 shrink-0 text-amber-600"
                      aria-hidden
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
