/**
 * Below-fold Evidence Explorer — code-split so filter/hydration JS
 * is not in the critical path with hero/LCP content.
 */
"use client";

import dynamic from "next/dynamic";

function EvidenceLoading() {
  return (
    <div
      className="min-h-[12rem] rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 p-6"
      role="status"
    >
      <p className="text-sm text-[var(--sg-color-text-muted)]">
        Loading evidence explorer…
      </p>
    </div>
  );
}

export const DynamicEvidenceExplorer = dynamic(
  () =>
    import("@/components/evidence/evidence-explorer").then(
      (m) => m.EvidenceExplorer,
    ),
  {
    loading: () => <EvidenceLoading />,
  },
);
