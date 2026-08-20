"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const LOADING_BEATS = [
  "Compiling source inventory…",
  "Resolving field and ownership maps…",
  "Scoring complexity and risks…",
  "Building cutover and validation plan…",
  "Preparing your visual migration plan…",
] as const;

type Props = {
  className?: string;
};

/**
 * Intentional ~2.5s generation pause so the results screen feels deliberate.
 * Does not imply ETL execution.
 */
export function MigrationPlanGenerating({ className }: Props) {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setBeat((b) => (b + 1) % LOADING_BEATS.length);
    }, 480);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "flex min-h-[28rem] flex-col items-center justify-center rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[linear-gradient(165deg,rgb(37_99_235/0.08),transparent_50%,rgb(14_165_233/0.05))] px-6 py-16 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative mb-6">
        <div
          className="size-16 animate-pulse rounded-full bg-[var(--sg-color-primary-soft)]"
          aria-hidden
        />
        <Loader2
          className="absolute inset-0 m-auto size-8 animate-spin text-[var(--sg-color-primary)]"
          aria-hidden
        />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Generating output
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
        Building your migration plan
      </h2>
      <p className="mt-3 max-w-md text-sm text-[var(--sg-color-text-muted)]">
        {LOADING_BEATS[beat]}
      </p>
      <ul className="mt-8 w-full max-w-sm space-y-2 text-left text-sm">
        {LOADING_BEATS.map((label, i) => {
          const done = i < beat;
          const current = i === beat;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-[var(--sg-radius-md)] px-3 py-2",
                current && "bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]",
                done && "text-[var(--sg-color-text-muted)]",
                !done && !current && "text-[var(--sg-color-text-muted)]/50",
              )}
            >
              {done ? (
                <Check
                  className="size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
              ) : current ? (
                <Loader2
                  className="size-4 shrink-0 animate-spin text-[var(--sg-color-primary)]"
                  aria-hidden
                />
              ) : (
                <span
                  className="size-4 shrink-0 rounded-full border border-[var(--sg-color-border)]"
                  aria-hidden
                />
              )}
              <span className={cn(current && "font-medium text-[var(--sg-color-text)]")}>
                {label.replace("…", "")}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-xs text-[var(--sg-color-text-muted)]">
        This prepares a planning report — it does not migrate your CRM data.
      </p>
    </div>
  );
}
