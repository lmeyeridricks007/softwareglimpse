import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { iconForUseCaseSlug, toneForUseCaseSlug } from "./use-case-icons";

export type UseCaseCardItem = {
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
  neutral:
    "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
} as const;

type GridProps = {
  title?: string;
  items: UseCaseCardItem[];
  className?: string;
};

export function UseCaseExploreGrid({
  title = "Explore use cases",
  items,
  className,
}: GridProps) {
  if (items.length === 0) return null;

  return (
    <section
      className={cn(className)}
      aria-labelledby="use-case-explore-heading"
    >
      <h2
        id="use-case-explore-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon ?? iconForUseCaseSlug(item.slug);
          const tone = toneForUseCaseSlug(item.slug);
          return (
            <li key={item.slug}>
              <Card className="h-full">
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-full",
                    TONE_BG[tone],
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                  {item.title}
                </p>
                {item.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </p>
                ) : null}
                <Link
                  href={item.href}
                  className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  View use case →
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export type AudienceChip = {
  slug: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  available?: boolean;
};

export function UseCaseAudienceRow({
  title = "Use cases by audience",
  items,
  className,
}: {
  title?: string;
  items: AudienceChip[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section
      className={cn(className)}
      aria-labelledby="use-case-audience-heading"
    >
      <h2
        id="use-case-audience-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon ?? Sparkles;
          return (
            <li key={item.slug}>
              <Link
                href={item.href}
                className="group flex flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)] transition-colors hover:border-[var(--sg-color-primary)]/40"
              >
                <Icon
                  className="size-6 text-[var(--sg-color-primary)]"
                  aria-hidden
                />
                <span className="mt-3 font-semibold text-[var(--sg-color-text)]">
                  {item.label}
                </span>
                <span className="mt-1 text-sm text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                  {item.available === false
                    ? "Planned hub →"
                    : "View use cases →"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
