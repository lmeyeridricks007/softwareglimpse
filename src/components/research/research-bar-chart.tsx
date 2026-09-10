import { cn } from "@/lib/cn";

export type ResearchBarDatum = {
  id: string;
  label: string;
  value: number;
  displayValue?: string;
};

type Props = {
  title: string;
  description?: string;
  data: ResearchBarDatum[];
  source: string;
  sampleSize: number;
  observationDate: string;
  valueSuffix?: string;
  className?: string;
};

/**
 * Accessible horizontal bar chart for research reports.
 * Values come from pre-calculated structured metrics — never invents numbers.
 */
export function ResearchBarChart({
  title,
  description,
  data,
  source,
  sampleSize,
  observationDate,
  valueSuffix = "",
  className,
}: Props) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <figure
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 sm:p-6",
        className,
      )}
    >
      <figcaption>
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {description}
          </p>
        ) : null}
      </figcaption>

      <ul className="mt-5 space-y-3" role="list">
        {data.map((datum) => {
          const width = Math.max(4, Math.round((datum.value / max) * 100));
          return (
            <li key={datum.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-[var(--sg-color-text)]">
                  {datum.label}
                </span>
                <span className="tabular-nums text-[var(--sg-color-text-muted)]">
                  {datum.displayValue ?? `${datum.value}${valueSuffix}`}
                </span>
              </div>
              <div
                className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
                role="img"
                aria-label={`${datum.label}: ${datum.displayValue ?? datum.value}${valueSuffix}`}
              >
                <div
                  className="h-full rounded-full bg-[var(--sg-color-primary)]"
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
        Source: {source}. Sample size: {sampleSize}. Observation date:{" "}
        {observationDate}.
      </p>
    </figure>
  );
}
