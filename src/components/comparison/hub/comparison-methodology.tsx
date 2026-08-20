import Link from "next/link";
import {
  ArrowRight,
  FileSearch,
  GitCompareArrows,
  ListChecks,
  Scale,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    title: "Collect",
    body: "Gather structured product, pricing and feature evidence.",
    Icon: FileSearch,
  },
  {
    title: "Normalize",
    body: "Map products to the same category-specific criteria.",
    Icon: ListChecks,
  },
  {
    title: "Compare",
    body: "Evaluate trade-offs side by side.",
    Icon: Scale,
  },
  {
    title: "Explain",
    body: "Show who each product fits and why.",
    Icon: GitCompareArrows,
  },
] as const;

type Props = {
  methodologyHref: string;
  howWeReviewHref: string;
  /** Compact process strip without the large trust footer cards. */
  compact?: boolean;
  className?: string;
};

export function ComparisonMethodology({
  methodologyHref,
  howWeReviewHref,
  compact = false,
  className,
}: Props) {
  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        How we compare software
      </h2>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Same criteria. Same evidence standard.
      </p>

      <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ title, body, Icon }, i) => (
          <li key={title} className="relative">
            <div className="flex h-full flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="font-semibold text-[var(--sg-color-text)]">
                  {title}
                </p>
              </div>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {body}
              </p>
              <Icon
                className="mt-3 size-4 text-[var(--sg-color-primary)]/70"
                aria-hidden
              />
            </div>
            {i < STEPS.length - 1 ? (
              <ArrowRight
                className="absolute -right-2.5 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-[var(--sg-color-primary)] lg:block"
                aria-hidden
              />
            ) : null}
          </li>
        ))}
      </ol>

      {!compact ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <ButtonLink href={methodologyHref} size="sm">
            How we compare software →
          </ButtonLink>
          <Link
            href={howWeReviewHref}
            className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            How we review software →
          </Link>
        </div>
      ) : (
        <Link
          href={methodologyHref}
          className="mt-4 inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          How we compare software →
        </Link>
      )}
    </div>
  );
}
