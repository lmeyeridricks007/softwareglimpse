import Link from "next/link";
import { Check } from "lucide-react";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type DecisionSnapshotProps = {
  categoryLabel: string;
  criteria: string[];
  popularNeeds: string[];
  chooseHref?: string;
  chooseLabel?: string;
  className?: string;
};

/**
 * Decision-oriented hero panel — replaces decorative fake dashboards.
 */
export function CategoryDecisionSnapshot({
  categoryLabel,
  criteria,
  popularNeeds,
  chooseHref,
  chooseLabel,
  className,
}: DecisionSnapshotProps) {
  if (criteria.length === 0 && popularNeeds.length === 0) return null;

  return (
    <Card
      className={cn(
        "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-md)] sm:p-6",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Choosing a {categoryLabel}
      </p>

      {criteria.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-[var(--sg-color-text)]">
            What matters most?
          </p>
          <ul className="mt-2.5 space-y-2">
            {criteria.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-[var(--sg-color-text-muted)]"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {popularNeeds.length > 0 ? (
        <div className="mt-5 border-t border-[var(--sg-color-border)] pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Popular needs
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {popularNeeds.map((need) => (
              <li
                key={need}
                className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-primary-hover)]"
              >
                {need}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {chooseHref ? (
        <div className="mt-5">
          <ButtonLink href={chooseHref} variant="ghost" size="sm" className="px-0">
            {withSingleArrow(
              chooseLabel ?? `See how to choose ${categoryLabel}`,
            )}
          </ButtonLink>
        </div>
      ) : null}

      {!chooseHref && chooseLabel ? (
        <p className="mt-5 text-sm text-[var(--sg-color-text-muted)]">
          <Link
            href="/guides/"
            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow(chooseLabel)}
          </Link>
        </p>
      ) : null}
    </Card>
  );
}
