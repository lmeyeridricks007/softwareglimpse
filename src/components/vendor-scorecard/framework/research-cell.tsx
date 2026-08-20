"use client";

import { cn } from "@/lib/cn";
import type { ResearchQualitativeLabel } from "@/services/vendor-scorecard";
import { RESEARCH_LABEL_DISPLAY } from "@/services/vendor-scorecard";

const TONE: Record<
  ResearchQualitativeLabel,
  { dot: string; text: string }
> = {
  strong: {
    dot: "bg-[var(--sg-color-success)]",
    text: "text-[var(--sg-color-success)]",
  },
  good: {
    dot: "bg-emerald-400",
    text: "text-emerald-700",
  },
  partial: {
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  unknown: {
    dot: "bg-[var(--sg-color-border-strong)]",
    text: "text-[var(--sg-color-text-muted)]",
  },
  "does-not-meet": {
    dot: "bg-[var(--sg-color-danger)]",
    text: "text-[var(--sg-color-danger)]",
  },
};

export function ResearchAssessmentCell({
  qualitative,
  numericScore,
  onWhy,
  className,
}: {
  qualitative: ResearchQualitativeLabel;
  numericScore?: number | null;
  onWhy?: () => void;
  className?: string;
}) {
  const tone = TONE[qualitative];
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", tone.text)}>
        <span
          className={cn("size-2 shrink-0 rounded-full", tone.dot)}
          aria-hidden
        />
        <span>{RESEARCH_LABEL_DISPLAY[qualitative]}</span>
        {numericScore != null ? (
          <span className="text-[var(--sg-color-text-muted)] font-normal">
            ({numericScore})
          </span>
        ) : null}
      </span>
      {onWhy ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWhy();
          }}
          className="w-fit text-xs font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Why?
        </button>
      ) : null}
    </div>
  );
}

export function MustHaveResultBadge({
  status,
}: {
  status: "satisfied" | "partial" | "failed" | "unknown";
}) {
  const map = {
    satisfied: {
      label: "Satisfied",
      className: "text-[var(--sg-color-success)]",
      icon: "✓",
    },
    partial: {
      label: "Partial",
      className: "text-amber-700",
      icon: "◐",
    },
    failed: {
      label: "Fails must-have",
      className: "text-[var(--sg-color-danger)]",
      icon: "×",
    },
    unknown: {
      label: "Unknown / verify",
      className: "text-[var(--sg-color-text-muted)]",
      icon: "—",
    },
  } as const;
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", m.className)}>
      <span aria-hidden>{m.icon}</span>
      {m.label}
    </span>
  );
}

export function FeatureSupportMark({
  availability,
}: {
  availability: string;
}) {
  switch (availability) {
    case "supported":
      return <span title="Verified support" className="text-[var(--sg-color-success)]">✓</span>;
    case "limited":
    case "add-on":
    case "higher-plan-only":
      return <span title="Partial / plan dependent" className="text-amber-600">◐</span>;
    case "not-supported":
      return <span title="Explicitly unsupported" className="text-[var(--sg-color-danger)]">×</span>;
    default:
      return <span title="Not verified" className="text-[var(--sg-color-text-muted)]">—</span>;
  }
}
