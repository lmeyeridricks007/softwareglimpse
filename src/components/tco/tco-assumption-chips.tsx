"use client";

import { formatMoney } from "@/domain";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

export type AssumptionChip = {
  id: string;
  label: string;
  blurb?: string;
  /** Short amount preview shown on the chip. */
  preview?: string;
};

type Props = {
  title?: string;
  chips: AssumptionChip[];
  activeId?: string | null;
  onSelect: (id: string) => void;
  onLeaveUnknown?: () => void;
  className?: string;
};

/**
 * Opt-in planning templates for cost fields the user may not know.
 * Never presented as market averages.
 */
export function TcoAssumptionChips({
  title = "Need a starting point?",
  chips,
  activeId,
  onSelect,
  onLeaveUnknown,
  className,
}: Props) {
  if (chips.length === 0 && !onLeaveUnknown) return null;

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-warning)]/25 bg-[var(--sg-color-warning-soft)]/40 p-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-[var(--sg-color-text)]">
          {title}
        </p>
        <Badge variant="warning">Your estimate</Badge>
      </div>
      <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
        Planning templates based on your team size and selected complexity —
        not market averages or vendor quotes. Edit anytime, or leave
        unknown.
      </p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={title}>
        {chips.map((chip) => {
          const active = activeId === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onSelect(chip.id)}
              aria-pressed={active}
              className={cn(
                "min-w-[7.5rem] rounded-[var(--sg-radius-md)] border px-3 py-2 text-left transition",
                active
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] ring-2 ring-[var(--sg-color-primary)]/25"
                  : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] hover:border-[var(--sg-color-primary)]/40",
              )}
            >
              <span className="block text-sm font-semibold text-[var(--sg-color-text)]">
                {chip.label}
              </span>
              {chip.preview ? (
                <span className="mt-0.5 block text-xs tabular-nums text-[var(--sg-color-navy)]">
                  {chip.preview}
                </span>
              ) : null}
              {chip.blurb ? (
                <span className="mt-0.5 block text-[10px] leading-snug text-[var(--sg-color-text-muted)]">
                  {chip.blurb}
                </span>
              ) : null}
            </button>
          );
        })}
        {onLeaveUnknown ? (
          <button
            type="button"
            onClick={onLeaveUnknown}
            aria-pressed={activeId === "unknown"}
            className={cn(
              "min-w-[7.5rem] rounded-[var(--sg-radius-md)] border px-3 py-2 text-left text-sm",
              activeId === "unknown"
                ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                : "border-dashed border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)]",
            )}
          >
            <span className="font-semibold">Leave unknown</span>
            <span className="mt-0.5 block text-[10px]">
              Not counted as €0
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function formatAssumptionPreview(
  amountMajor: number,
  currency: string,
): string {
  return formatMoney({
    amountMinor: Math.round(amountMajor * 100),
    currency: currency as "EUR",
  });
}
