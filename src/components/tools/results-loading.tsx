"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

/** Shared delay before revealing tool results (1–2s range). */
export const RESULTS_REVEAL_DELAY_MS = 1500;

type RevealStatus = "idle" | "loading" | "ready";

/**
 * Delays revealing computed results so every decision tool feels consistent.
 * Computation can run immediately; UI stays on the loading state until the delay elapses.
 */
export function useDelayedResultsReveal(delayMs = RESULTS_REVEAL_DELAY_MS) {
  const [status, setStatus] = useState<RevealStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const resetReveal = useCallback(() => {
    clearTimer();
    setStatus("idle");
  }, [clearTimer]);

  const startReveal = useCallback(
    (onReady: () => void) => {
      clearTimer();
      setStatus("loading");
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setStatus("ready");
        onReady();
      }, delayMs);
    },
    [clearTimer, delayMs],
  );

  return {
    status,
    isLoading: status === "loading",
    startReveal,
    resetReveal,
  };
}

type ResultsLoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

/** Full-panel loading state shown before tool results. */
export function ResultsLoadingState({
  title = "Building your results…",
  description = "Matching your answers against SoftwareGlimpse recommendations.",
  className,
}: ResultsLoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[22rem] flex-col items-center justify-center rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-6 py-16 text-center shadow-[var(--sg-shadow-md)]",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2
        className="size-10 animate-spin text-[var(--sg-color-primary)]"
        aria-hidden
      />
      <p className="mt-5 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
        {title}
      </p>
      <p className="mt-2 max-w-sm text-sm text-[var(--sg-color-text-muted)]">
        {description}
      </p>
      <span className="sr-only">Loading results, please wait.</span>
    </div>
  );
}
