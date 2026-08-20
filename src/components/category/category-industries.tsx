import Link from "next/link";
import { hubToneClassForSlug } from "@/components/category/hub-icons";
import { iconForIndustrySlug } from "@/components/industries/industry-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type IndustryHubItem = {
  slug: string;
  name: string;
  description: string | null;
  href: string;
};

type Props = {
  title: string;
  items: IndustryHubItem[];
  className?: string;
};

export function CategoryIndustries({ title, items, className }: Props) {
  return (
    <section
      id="industries"
      aria-labelledby="industries-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="industries-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-5 max-w-2xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
          Industry pages for this category are still being added. Browse{" "}
          <Link
            href="/industries/"
            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            all industries
          </Link>{" "}
          or start with Finder above.
        </p>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconForIndustrySlug(item.slug);
            const tone = hubToneClassForSlug(item.slug, index);
            return (
              <li key={item.slug}>
                <Link href={item.href} className="group block h-full">
                  <Card
                    variant="interactive"
                    className="flex h-full gap-3 p-4"
                  >
                    <span
                      className={cn(
                        "inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] border",
                        tone,
                      )}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                        {item.name}
                      </p>
                      {item.description ? (
                        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
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
      )}
      <p className="mt-4">
        <Link
          href="/industries/"
          className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          View all industries →
        </Link>
      </p>
    </section>
  );
}
