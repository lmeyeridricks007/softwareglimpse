import Link from "next/link";
import { createElement } from "react";
import { hubToneClassForSlug, withSingleArrow } from "@/components/category/hub-icons";
import { iconForUseCaseSlug } from "@/components/use-cases/use-case-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type UseCaseCardItem = {
  slug: string;
  name: string;
  description?: string | null;
  href: string;
};

type Props = {
  productName: string;
  items: UseCaseCardItem[];
  notBestIf?: string[];
  className?: string;
};

export function SoftwareUseCaseCards({
  productName,
  items,
  notBestIf = [],
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="use-cases"
      aria-labelledby="use-cases-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-muted)] px-5 py-8 sm:px-8",
        className,
      )}
    >
      <h2
        id="use-cases-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Use cases for {productName}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = iconForUseCaseSlug(item.slug);
          return (
            <li key={item.slug}>
              <Link href={item.href} className="group block h-full">
                <Card variant="interactive" className="flex h-full flex-col p-4">
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] border",
                      hubToneClassForSlug(item.slug),
                    )}
                  >
                    {createElement(Icon, {
                      className: "size-5",
                      "aria-hidden": true,
                    })}
                  </span>
                  <p className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                    {item.name}
                  </p>
                  {item.description ? (
                    <p className="mt-1.5 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                      {item.description}
                    </p>
                  ) : null}
                  <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)]">
                    {withSingleArrow("Explore use case")}
                  </span>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>

      {notBestIf.length > 0 ? (
        <div className="mt-6 border-t border-[var(--sg-color-border)] pt-5">
          <p className="text-sm font-semibold text-[var(--sg-color-text)]">
            {productName} may not be the best fit if…
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
            {notBestIf.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
