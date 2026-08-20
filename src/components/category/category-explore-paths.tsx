import Link from "next/link";
import {
  EXPLORE_TONE_CLASSES,
  resolveHubIcon,
  withSingleArrow,
} from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ExplorePathItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  tone?: string;
  icon?: string;
};

type Props = {
  title: string;
  items: ExplorePathItem[];
  className?: string;
};

export function CategoryExplorePaths({ title, items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="explore"
      aria-labelledby="explore-paths-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="explore-paths-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item) => {
          const Icon = resolveHubIcon(item.icon);
          const tone =
            EXPLORE_TONE_CLASSES[item.tone ?? "blue"] ??
            EXPLORE_TONE_CLASSES.blue;
          return (
            <li key={item.id} className="min-w-0">
              <Link href={item.href} className="group block h-full">
                <Card
                  variant="interactive"
                  className="flex h-full flex-col p-4"
                >
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] border",
                      tone,
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <p className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                    {item.title}
                  </p>
                  <p className="mt-1.5 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </p>
                  <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)]">
                    {withSingleArrow(item.ctaLabel)}
                  </span>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** @deprecated Prefer CategoryExplorePaths */
export { CategoryExplorePaths as CategoryExploreGrid };
