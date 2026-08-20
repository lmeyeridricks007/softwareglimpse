import { createElement } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { iconForIndustrySlug, toneForIndustrySlug } from "./industry-icons";

export type IndustryCardItem = {
  slug: string;
  title: string;
  description?: string;
  href: string;
  icon?: LucideIcon;
};

const TONE_BG = {
  success: "bg-[var(--sg-color-success-soft)] text-[var(--sg-color-success)]",
  primary: "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]",
  warning: "bg-[var(--sg-color-warning-soft)] text-[var(--sg-color-warning)]",
  danger: "bg-[var(--sg-color-danger-soft)] text-[var(--sg-color-danger)]",
  neutral:
    "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
} as const;

type Props = {
  title?: string;
  items: IndustryCardItem[];
  viewAllHref?: string;
  className?: string;
};

export function IndustryExploreGrid({
  title = "Explore software by industry",
  items,
  viewAllHref,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      className={cn(className)}
      aria-labelledby="industry-explore-heading"
    >
      <h2
        id="industry-explore-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon ?? iconForIndustrySlug(item.slug);
          const tone = toneForIndustrySlug(item.slug);
          return (
            <li key={item.slug}>
              <Card className="flex h-full flex-col items-start text-left">
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-full",
                    TONE_BG[tone],
                  )}
                >
                  {createElement(Icon, {
                    className: "size-5",
                    "aria-hidden": true,
                  })}
                </span>
                <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                  {item.title}
                </p>
                {item.description ? (
                  <p className="mt-1 line-clamp-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </p>
                ) : null}
                <Link
                  href={item.href}
                  className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  View solutions →
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>
      {viewAllHref ? (
        <div className="mt-6 text-center">
          <ButtonLink href={viewAllHref} variant="outline">
            View all industries →
          </ButtonLink>
        </div>
      ) : null}
    </section>
  );
}
