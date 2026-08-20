import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ProductLimitationItem = {
  id: string;
  title: string;
  explanation: string;
  whoItAffects?: string;
  alternativeSlug?: string;
  alternativeName?: string;
};

export type ProductLimitationsPanelProps = {
  productName: string;
  items: ProductLimitationItem[];
  className?: string;
};

export function ProductLimitationsPanel({
  productName,
  items,
  className,
}: ProductLimitationsPanelProps) {
  if (items.length === 0) return null;

  return (
    <section
      id="limitations"
      aria-labelledby="limitations-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="limitations-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Where {productName} falls short
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <Card className="flex h-full flex-col">
              <h3 className="font-semibold text-[var(--sg-color-text)]">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                {item.explanation}
              </p>
              {item.whoItAffects ? (
                <>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Who it affects
                  </p>
                  <p className="mt-1 text-sm text-[var(--sg-color-text)]">
                    {item.whoItAffects}
                  </p>
                </>
              ) : null}
              {item.alternativeSlug && item.alternativeName ? (
                <Link
                  href={`/software/${item.alternativeSlug}/`}
                  className="mt-4 inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {withSingleArrow(`Consider ${item.alternativeName}`)}
                </Link>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
