import Link from "next/link";
import { hubToneClassForSlug, withSingleArrow } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type CategoryDecisionToolItem = {
  slug: string;
  name: string;
  description: string;
  href: string;
};

type Props = {
  title: string;
  items: CategoryDecisionToolItem[];
  className?: string;
};

export function CategoryDecisionTools({ title, items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="decision-tools"
      aria-labelledby="category-decision-tools-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="category-decision-tools-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mt-1.5 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Finders, calculators, and planners for this category — same research as
        the reviews, no affiliate ranking bias.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={item.href} className="group block h-full">
              <Card variant="interactive" className="flex h-full flex-col p-4">
                <span
                  className={cn(
                    "inline-flex w-fit rounded-[var(--sg-radius-md)] border px-2 py-0.5 text-xs font-medium",
                    hubToneClassForSlug(item.slug),
                  )}
                >
                  Tool
                </span>
                <p className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                  {item.name}
                </p>
                <p className="mt-1.5 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
                <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)]">
                  {withSingleArrow("Open tool")}
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
