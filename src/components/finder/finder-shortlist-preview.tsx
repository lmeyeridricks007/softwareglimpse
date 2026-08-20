/**
 * Hero shortlist preview — real CRM products + scores from a sample recommendCrm run.
 * Labeled as example results so it never looks like the visitor's personal shortlist.
 */
import Link from "next/link";
import type { CrmFinderSamplePreview } from "@/services/crm-finder-landing/sample-preview";
import { cn } from "@/lib/cn";

type Props = {
  preview: CrmFinderSamplePreview;
  className?: string;
};

export function FinderShortlistPreview({ preview, className }: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-md)]",
        className,
      )}
      aria-label={preview.caption}
    >
      <div className="flex items-center justify-between border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-text)]">
          Your CRM shortlist
        </p>
        <span className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-warning-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-warning)]">
          Example results
        </span>
      </div>

      <p className="px-4 pt-3 text-xs text-[var(--sg-color-text-muted)]">
        {preview.requirementSummary}
      </p>

      <ul className="space-y-2.5 p-4">
        {preview.matches.length > 0 ? (
          preview.matches.map((item) => (
            <li
              key={item.slug}
              className="flex gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2.5"
            >
              <div
                className="relative flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--sg-color-primary)]/30"
                aria-hidden
              >
                <span className="text-xs font-bold tabular-nums text-[var(--sg-color-primary)]">
                  {item.matchScore}%
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-[var(--sg-radius-sm)] border border-[var(--sg-color-border)] bg-white text-[10px] font-bold text-[var(--sg-color-text-muted)]">
                    {item.logoSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.logoSrc}
                        alt=""
                        width={28}
                        height={28}
                        className="size-full object-contain p-0.5"
                      />
                    ) : (
                      item.name.slice(0, 2).toUpperCase()
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--sg-color-text)]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[var(--sg-color-success)]">
                      {item.label}
                    </p>
                  </div>
                </div>
                {item.reasons.length > 0 ? (
                  <ul className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5">
                    {item.reasons.map((r) => (
                      <li
                        key={r}
                        className="text-[11px] text-[var(--sg-color-text-muted)]"
                      >
                        ✓ {r}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))
        ) : (
          <li className="rounded-[var(--sg-radius-md)] border border-dashed border-[var(--sg-color-border)] px-3 py-4 text-center text-sm text-[var(--sg-color-text-muted)]">
            Complete the finder to see CRM matches from our recommendations.
          </li>
        )}
      </ul>

      <div className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-center">
        <Link
          href="#crm-finder"
          className="text-xs font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Complete the finder for your real shortlist →
        </Link>
        {preview.isLiveSample ? (
          <p className="mt-1 text-[10px] text-[var(--sg-color-text-muted)]">
            Scores from the live matching engine for sample requirements
          </p>
        ) : null}
      </div>
    </div>
  );
}
