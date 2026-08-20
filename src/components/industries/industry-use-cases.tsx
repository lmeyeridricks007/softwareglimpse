import Link from "next/link";
import { createElement } from "react";
import {
  isPageDetailHref,
} from "@/components/industries/detail-href";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import { cn } from "@/lib/cn";

type UseCase = {
  id: string;
  title: string;
  bestWhen: string;
  icon?: string;
  href?: string;
};

type Props = {
  title?: string;
  items: UseCase[];
  /** Jump to industry media section — do not embed players in cards. */
  seeWorkflowHref?: string;
  className?: string;
};

export function IndustryUseCases({
  title = "Start with your use case",
  items,
  seeWorkflowHref,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="use-cases"
      aria-labelledby="use-cases-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="use-cases-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        These are buyer scenarios — not product recommendations. Start from how
        your team works, then compare capabilities.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          const href = isPageDetailHref(item.href) ? item.href : undefined;
          const content = (
            <>
              <span
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)]",
                  hubToneClass(index + 2),
                )}
              >
                {createElement(Icon, {
                  className: "size-4",
                  "aria-hidden": true,
                })}
              </span>
              <h3
                className={cn(
                  "mt-3 text-sm font-semibold text-[var(--sg-color-text)]",
                  href && "group-hover:text-[var(--sg-color-primary)]",
                )}
              >
                {item.title}
              </h3>
              <p className="mt-1.5 flex-1 text-xs text-[var(--sg-color-text-muted)]">
                <span className="font-medium text-[var(--sg-color-text)]">
                  Best when{" "}
                </span>
                {item.bestWhen}
              </p>
              {href ? (
                <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                  {withSingleArrow("Explore use case")}
                </span>
              ) : (
                <span className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
                  Detail page coming soon
                </span>
              )}
            </>
          );

          return (
            <li key={item.id}>
              {href ? (
                <Link href={href} className="group block h-full">
                  <Card
                    variant="interactive"
                    className="flex h-full flex-col p-4"
                  >
                    {content}
                  </Card>
                </Link>
              ) : (
                <Card className="flex h-full flex-col p-4">{content}</Card>
              )}
            </li>
          );
        })}
      </ul>
      {seeWorkflowHref ? (
        <p className="mt-4 text-sm">
          <a
            href={seeWorkflowHref}
            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            ▶ See workflow example
          </a>
        </p>
      ) : null}
    </section>
  );
}
