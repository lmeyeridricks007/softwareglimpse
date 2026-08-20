import Link from "next/link";
import { createElement } from "react";
import { isPageDetailHref } from "@/components/industries/detail-href";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import { cn } from "@/lib/cn";

type Priority = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  href?: string;
};

type Props = {
  title: string;
  intro?: string;
  items: Priority[];
  className?: string;
};

function exploreLabel(href: string): string {
  if (href.includes("/capabilities/")) return "Explore capability";
  if (href.includes("/requirements/")) return "Explore requirement";
  if (href.includes("/features/")) return "Explore feature";
  if (href.includes("/use-cases/")) return "Explore use case";
  return "Explore";
}

export function IndustryWhatMatters({
  title,
  intro,
  items,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="what-matters"
      aria-labelledby="what-matters-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="what-matters-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      {intro ? (
        <p className="mt-3 max-w-3xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
          {intro}
        </p>
      ) : null}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          const href = isPageDetailHref(item.href) ? item.href : undefined;
          const content = (
            <>
              <span
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)]",
                  hubToneClass(index),
                )}
              >
                {createElement(Icon, {
                  className: "size-5",
                  "aria-hidden": true,
                })}
              </span>
              <h3
                className={cn(
                  "mt-3 font-semibold text-[var(--sg-color-text)]",
                  href && "group-hover:text-[var(--sg-color-primary)]",
                )}
              >
                {item.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.description}
              </p>
              {href ? (
                <span className="mt-4 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                  {withSingleArrow(exploreLabel(href))}
                </span>
              ) : null}
            </>
          );

          return (
            <li key={item.id}>
              {href ? (
                <Link href={href} className="group block h-full">
                  <Card
                    variant="interactive"
                    className="flex h-full flex-col p-5"
                  >
                    {content}
                  </Card>
                </Link>
              ) : (
                <Card className="flex h-full flex-col p-5">{content}</Card>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
