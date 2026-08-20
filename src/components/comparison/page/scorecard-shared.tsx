import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type {
  ComparisonCriterionRow,
  QualitativeStrength,
} from "@/services/comparison-page/types";

export function strengthTone(
  strength: QualitativeStrength,
): "success" | "danger" | "neutral" | "warning" {
  if (strength === "stronger") return "success";
  if (strength === "weaker") return "danger";
  if (strength === "depends") return "warning";
  return "neutral";
}

export function strengthLabel(strength: QualitativeStrength): string {
  switch (strength) {
    case "stronger":
      return "Stronger";
    case "weaker":
      return "Weaker";
    case "tie":
      return "Tie";
    case "depends":
      return "Depends";
    default:
      return "Not evidenced";
  }
}

/** Qualitative bar — no fabricated numeric scores. */
export function QualitativeBar({
  strength,
  className,
}: {
  strength: QualitativeStrength;
  className?: string;
}) {
  const width =
    strength === "stronger"
      ? "100%"
      : strength === "tie"
        ? "70%"
        : strength === "depends"
          ? "55%"
          : strength === "weaker"
            ? "40%"
            : "15%";
  const color =
    strength === "stronger"
      ? "bg-[var(--sg-color-success)]"
      : strength === "weaker"
        ? "bg-[var(--sg-color-danger)]/70"
        : strength === "tie"
          ? "bg-[var(--sg-color-primary)]"
          : "bg-[var(--sg-color-border-strong)]";

  return (
    <div
      className={cn(
        "h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]",
        className,
      )}
    >
      <div className={cn("h-full rounded-full", color)} style={{ width }} />
    </div>
  );
}

export function NumericBar({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(10, score));
  return (
    <div
      className={cn(
        "h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-[var(--sg-color-primary)]"
        style={{ width: `${(clamped / 10) * 100}%` }}
      />
    </div>
  );
}

export function ScorecardPreview({
  criteria,
  nameA,
  nameB,
  limit = 5,
  className,
}: {
  criteria: ComparisonCriterionRow[];
  nameA: string;
  nameB: string;
  limit?: number;
  className?: string;
}) {
  const rows = criteria.slice(0, limit);
  if (rows.length === 0) return null;

  return (
    <Card
      className={cn(
        "overflow-hidden p-0 ring-1 ring-[var(--sg-color-primary)]/10",
        className,
      )}
    >
      <div className="border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)] px-5 py-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
          Scorecard preview
        </h3>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Criterion leaders based on verified research — open the Scorecard tab
          for evidence detail.
        </p>
      </div>
      <ul className="space-y-0 px-5 py-2">
        {rows.map((row) => (
          <li
            key={row.slug}
            className="border-b border-[var(--sg-color-border)] py-3.5 last:border-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-[var(--sg-color-text)]">
                {row.name}
              </span>
              {row.winnerName ? (
                <Badge
                  variant={
                    row.strengthA === "stronger"
                      ? "success"
                      : row.strengthB === "stronger"
                        ? "danger"
                        : row.strengthA === "tie"
                          ? "primary"
                          : "neutral"
                  }
                >
                  {row.winnerName}
                </Badge>
              ) : null}
            </div>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-[var(--sg-color-text-muted)]">
                  {nameA}
                </p>
                {row.scoreA != null && row.scoreB != null ? (
                  <NumericBar score={row.scoreA} className="mt-1.5" />
                ) : (
                  <QualitativeBar strength={row.strengthA} className="mt-1.5" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--sg-color-text-muted)]">
                  {nameB}
                </p>
                {row.scoreA != null && row.scoreB != null ? (
                  <NumericBar score={row.scoreB} className="mt-1.5" />
                ) : (
                  <QualitativeBar strength={row.strengthB} className="mt-1.5" />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
