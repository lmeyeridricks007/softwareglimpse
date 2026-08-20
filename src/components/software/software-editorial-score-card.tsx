import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { scoreLabel } from "@/services/editorial/score-labels";

export type CriterionBar = {
  criterionSlug: string;
  name: string;
  score?: number;
};

const MAX_CRITERIA = 6;

type Props = {
  score?: number;
  criteria?: CriterionBar[];
  pendingCriteriaNames?: string[];
  approved: boolean;
  bestFor?: string;
  methodologyHref?: string;
  className?: string;
};

function CriterionBarRow({
  name,
  score,
  pending = false,
}: {
  name: string;
  score?: number;
  pending?: boolean;
}) {
  const pct =
    typeof score === "number"
      ? Math.max(0, Math.min(100, (score / 10) * 100))
      : 0;

  return (
    <li>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="truncate text-[var(--sg-color-text-muted)]">{name}</span>
        {typeof score === "number" && !pending ? (
          <span className="shrink-0 tabular-nums font-medium text-[var(--sg-color-text)]">
            {Math.round(score * 10) / 10}
          </span>
        ) : null}
      </div>
      <div
        className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
        role="presentation"
      >
        {pending ? (
          <div className="h-full w-full rounded-full border border-dashed border-[var(--sg-color-border-strong)] bg-transparent" />
        ) : (
          <div
            className="h-full rounded-full bg-[var(--sg-color-primary)]"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </li>
  );
}

/**
 * Hero score card with criterion bars. Renders a polished pending state when not approved.
 * Shows at most six criterion rows to keep the header aside compact.
 */
export function SoftwareEditorialScoreCard({
  score,
  criteria = [],
  pendingCriteriaNames = [],
  approved,
  bestFor,
  methodologyHref,
  className,
}: Props) {
  if (!approved) {
    const pendingRows = (
      pendingCriteriaNames.length > 0
        ? pendingCriteriaNames
        : criteria.map((c) => c.name)
    ).slice(0, MAX_CRITERIA);

    return (
      <Card
        className={cn("h-fit p-4", className)}
        variant="soft"
        aria-label="Editorial assessment in progress"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Editorial assessment
          </p>
          <Badge variant="warning">In progress</Badge>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          Scores publish after editorial approval. Criteria below are being
          evaluated.
        </p>
        {pendingRows.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {pendingRows.map((name) => (
              <CriterionBarRow key={name} name={name} pending />
            ))}
          </ul>
        ) : null}
        {methodologyHref ? (
          <Link
            href={methodologyHref}
            className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow("How we score")}
          </Link>
        ) : null}
      </Card>
    );
  }

  if (typeof score !== "number") return null;

  const display = Math.round(score * 10) / 10;
  const label = scoreLabel(score);
  const scoredCriteria = criteria
    .filter((item) => typeof item.score === "number")
    .slice(0, MAX_CRITERIA);

  return (
    <Card
      className={cn("h-fit p-4", className)}
      aria-label={`SoftwareGlimpse score: ${display} out of 10, ${label}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        SoftwareGlimpse review
      </p>
      <p className="mt-1.5 font-[family-name:var(--font-display)] text-4xl font-semibold tabular-nums leading-none text-[var(--sg-color-text)]">
        {display}
        <span className="text-lg font-normal text-[var(--sg-color-text-muted)]">
          /10
        </span>
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--sg-color-text)]">
        {label}
      </p>

      {scoredCriteria.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {scoredCriteria.map((item) => (
            <CriterionBarRow
              key={item.criterionSlug}
              name={item.name}
              score={item.score}
            />
          ))}
        </ul>
      ) : null}

      {bestFor ? (
        <div className="mt-3 border-t border-[var(--sg-color-border)] pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Best for
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-[var(--sg-color-text)]">
            {bestFor}
          </p>
        </div>
      ) : null}

      {methodologyHref ? (
        <Link
          href={methodologyHref}
          className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          {withSingleArrow("How we score")}
        </Link>
      ) : null}
    </Card>
  );
}
