"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Props = {
  stepIndex: number;
  totalSteps: number;
  stepLabel: string;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  className?: string;
};

export function MigrationWizardFooter({
  stepIndex,
  totalSteps,
  stepLabel,
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  className,
}: Props) {
  const pct = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div
      className={cn(
        "mt-8 border-t border-[var(--sg-color-border)] pt-5",
        className,
      )}
    >
      <div
        className="mb-4 h-1 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
        role="progressbar"
        aria-valuenow={stepIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label="Wizard progress"
      >
        <div
          className="h-full rounded-full bg-[var(--sg-color-primary)] transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={!onBack}
          aria-label={backLabel}
        >
          <ChevronLeft className="size-4" aria-hidden />
          {backLabel}
        </Button>
        <p
          className="order-first w-full text-center text-xs text-[var(--sg-color-text-muted)] sm:order-none sm:w-auto"
          aria-live="polite"
        >
          <span className="font-semibold text-[var(--sg-color-text)]">
            {stepIndex + 1}/{totalSteps}
          </span>
          <span className="mx-1.5 text-[var(--sg-color-border)]">·</span>
          {stepLabel}
        </p>
        <Button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          aria-label={nextLabel}
        >
          {nextLabel}
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
