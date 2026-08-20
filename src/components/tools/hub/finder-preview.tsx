import { Check, HelpCircle } from "lucide-react";
import type { ToolsHubDecisionPreview } from "@/services/tools-hub";
import { cn } from "@/lib/cn";

type Props = {
  preview: ToolsHubDecisionPreview;
  className?: string;
};

/** Compact questionnaire + results mock for featured finder cards. */
export function FinderPreview({ preview, className }: Props) {
  const questions = [
    "Team size",
    "Primary goal",
    "Budget",
    "Must-have features",
  ];
  const top = preview.matches.slice(0, 2);

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-3",
        className,
      )}
      aria-hidden
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sg-color-text-muted)]">
        Questionnaire
      </p>
      <ul className="mt-2 space-y-1.5">
        {questions.map((q, i) => (
          <li
            key={q}
            className="flex items-center gap-2 rounded-[var(--sg-radius-sm)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2.5 py-1.5 text-xs text-[var(--sg-color-text)]"
          >
            {i < 2 ? (
              <Check className="size-3.5 text-[var(--sg-color-success)]" />
            ) : (
              <HelpCircle className="size-3.5 text-[var(--sg-color-text-muted)]" />
            )}
            {q}
          </li>
        ))}
      </ul>
      {top.length > 0 ? (
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sg-color-text-muted)]">
            Shortlist
          </p>
          {top.map((m) => (
            <div
              key={m.slug}
              className="flex items-center justify-between rounded-[var(--sg-radius-sm)] bg-[var(--sg-color-surface)] px-2.5 py-1.5 text-xs"
            >
              <span className="font-medium text-[var(--sg-color-text)]">
                {m.name}
              </span>
              <span className="font-semibold text-[var(--sg-color-success)]">
                {m.matchScore}%
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
