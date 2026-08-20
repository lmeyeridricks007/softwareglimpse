"use client";

import type { CrmDemoChecklistDraft } from "@/domain";

export type DemoDraftPatch = (
  updater: (prev: CrmDemoChecklistDraft) => CrmDemoChecklistDraft,
) => void;

export function StepHeader({
  stepLabel,
  title,
  description,
}: {
  stepLabel: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        {stepLabel}
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        {description}
      </p>
    </div>
  );
}
