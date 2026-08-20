"use client";

import { useEffect, useId, useRef } from "react";

type Props = {
  legend: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  autoFocusLegend?: boolean;
};

/** Accessible fieldset step with focus management on step change. */
export function FinderStep({
  legend,
  description,
  children,
  actions,
  autoFocusLegend = true,
}: Props) {
  const legendId = useId();
  const legendRef = useRef<HTMLLegendElement>(null);

  useEffect(() => {
    if (!autoFocusLegend) return;
    legendRef.current?.focus();
  }, [legend, autoFocusLegend]);

  return (
    <fieldset
      className="min-w-0 border-0 p-0"
      aria-describedby={description ? `${legendId}-desc` : undefined}
    >
      <legend
        ref={legendRef}
        id={legendId}
        tabIndex={-1}
        className="font-[family-name:var(--font-display)] text-xl font-semibold outline-none"
      >
        {legend}
      </legend>
      {description ? (
        <p
          id={`${legendId}-desc`}
          className="mt-2 text-sm text-[var(--color-fg-muted)]"
        >
          {description}
        </p>
      ) : null}
      <div className="mt-5">{children}</div>
      {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
    </fieldset>
  );
}
