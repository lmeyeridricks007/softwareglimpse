import { cn } from "@/lib/cn";

type Props = {
  reportName: string;
  year: number | string;
  url?: string;
  className?: string;
};

/**
 * Subtle citation block — no backlink requirement.
 */
export function ResearchCitationBlock({
  reportName,
  year,
  url,
  className,
}: Props) {
  const attribution = `Source: SoftwareGlimpse, ${reportName}, ${year}`;
  return (
    <aside
      className={cn(
        "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-4 text-sm text-[var(--sg-color-text-muted)]",
        className,
      )}
      aria-label="Citing this research"
    >
      <p className="font-medium text-[var(--sg-color-text)]">
        Citing this research
      </p>
      <p className="mt-2">
        Suggested attribution (no backlink required):
      </p>
      <p className="mt-2 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface)] px-3 py-2 font-mono text-xs text-[var(--sg-color-text)]">
        {attribution}
        {url ? ` — ${url}` : null}
      </p>
    </aside>
  );
}
