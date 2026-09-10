import { cn } from "@/lib/cn";

type Stat = {
  label: string;
  value: string;
  hint?: string;
  sampleSize?: number;
};

type Props = {
  stats: Stat[];
  className?: string;
};

export function ResearchStatGrid({ stats, className }: Props) {
  if (stats.length === 0) return null;
  return (
    <dl
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-4"
        >
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            {stat.label}
          </dt>
          <dd className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[var(--sg-color-text)]">
            {stat.value}
          </dd>
          {stat.hint || stat.sampleSize != null ? (
            <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
              {stat.hint}
              {stat.sampleSize != null
                ? `${stat.hint ? " · " : ""}n=${stat.sampleSize}`
                : null}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
