import Link from "next/link";
import { createElement } from "react";
import { hubToneClassForSlug } from "@/components/category/hub-icons";
import { iconForUseCaseSlug } from "@/components/use-cases/use-case-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type FeatureHubItem = {
  slug: string;
  name: string;
  description: string;
  href?: string;
};

type Props = {
  title: string;
  items: FeatureHubItem[];
  className?: string;
};

export function CategoryFeatures({ title, items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="features-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = iconForUseCaseSlug(item.slug);
          const tone = hubToneClassForSlug(item.slug, index);
          const body = (
            <Card
              variant={item.href ? "interactive" : "default"}
              className="flex h-full flex-col p-4"
            >
              <span
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] border",
                  tone,
                )}
              >
                {createElement(Icon, {
                  className: "size-5",
                  "aria-hidden": true,
                })}
              </span>
              <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                {item.name}
              </p>
              <p className="mt-1.5 text-sm text-[var(--sg-color-text-muted)]">
                {item.description}
              </p>
            </Card>
          );
          return (
            <li key={item.slug}>
              {item.href ? (
                <Link href={item.href} className="block h-full">
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
