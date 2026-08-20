import Link from "next/link";
import { createElement } from "react";
import { iconForIndustrySlug } from "@/components/industries/industry-icons";
import { hubToneClassForSlug } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type IndustryItem = {
  slug: string;
  name: string;
  description: string | null;
  href: string;
};

type Props = {
  title?: string;
  items: IndustryItem[];
  className?: string;
};

export function IndustryRelatedSection({
  title = "Explore other industries",
  items,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="related-industries"
      aria-labelledby="related-industries-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="related-industries-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = iconForIndustrySlug(item.slug);
          return (
            <li key={item.slug}>
              <Link href={item.href} className="group block h-full">
                <Card
                  variant="interactive"
                  className="flex h-full items-start gap-3 p-4"
                >
                  <span
                    className={cn(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)]",
                      hubToneClassForSlug(item.slug),
                    )}
                  >
                    {createElement(Icon, {
                      className: "size-5",
                      "aria-hidden": true,
                    })}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                      {item.name}
                    </p>
                    {item.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
