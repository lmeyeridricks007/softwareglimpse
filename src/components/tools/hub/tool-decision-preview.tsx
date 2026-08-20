import { ArrowDown } from "lucide-react";
import type { ToolsHubDecisionPreview } from "@/services/tools-hub";
import { cn } from "@/lib/cn";

type Props = {
  preview: ToolsHubDecisionPreview;
  className?: string;
};

export function ToolDecisionPreview({ preview, className }: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-md)]",
        className,
      )}
      aria-label={preview.caption}
    >
      <div className="border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 sm:px-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sg-color-text-muted)]">
          Your requirements
        </p>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
          {preview.requirements.map((row) => (
            <div key={row.label} className="min-w-0">
              <dt className="text-[11px] text-[var(--sg-color-text-muted)]">
                {row.label}
              </dt>
              <dd className="truncate text-sm font-semibold text-[var(--sg-color-text)]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--sg-color-primary)]">
        <ArrowDown className="size-3" aria-hidden />
        Matching
      </div>

      <ul className="space-y-2.5 px-4 pb-4 sm:px-5">
        {preview.matches.length > 0 ? (
          preview.matches.map((match) => (
            <li
              key={match.slug}
              className="flex items-center gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[var(--sg-radius-sm)] border border-[var(--sg-color-border)] bg-white text-[10px] font-bold text-[var(--sg-color-text-muted)]">
                {match.logoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={match.logoSrc}
                    alt=""
                    width={32}
                    height={32}
                    className="size-full object-contain p-0.5"
                  />
                ) : (
                  match.name.slice(0, 2).toUpperCase()
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-[var(--sg-color-text)]">
                    {match.name}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-[var(--sg-color-success)]">
                    {match.matchScore}% fit
                  </span>
                </div>
                <div
                  className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
                  role="presentation"
                >
                  <div
                    className="h-full rounded-full bg-[var(--sg-color-success)]"
                    style={{
                      width: `${Math.min(100, Math.max(0, match.matchScore))}%`,
                    }}
                  />
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="rounded-[var(--sg-radius-md)] border border-dashed border-[var(--sg-color-border)] px-3 py-4 text-center text-sm text-[var(--sg-color-text-muted)]">
            Answer a few questions to see your shortlist.
          </li>
        )}
      </ul>

      <p className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-[11px] text-[var(--sg-color-text-muted)] sm:px-5">
        {preview.caption}
        {preview.isLiveSample
          ? " — scored with the same engine as CRM Finder."
          : " — illustrative layout only."}
      </p>
    </div>
  );
}
