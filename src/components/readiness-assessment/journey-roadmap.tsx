"use client";

import { cn } from "@/lib/cn";
import type { AssessCrmReadinessResult } from "@/services/readiness-assessment/score";

const STAGES = [
  {
    id: "foundation",
    title: "Foundation",
    items: ["Business case", "Process", "Ownership"],
    dims: ["business-case", "sales-process", "stakeholders"],
  },
  {
    id: "discovery",
    title: "Discovery",
    items: ["Requirements", "Data", "Integrations"],
    dims: ["requirements", "data-readiness", "integrations"],
  },
  {
    id: "selection",
    title: "Selection",
    items: ["Shortlist", "RFP", "Demo", "Score"],
    dims: ["requirements", "budget"],
  },
  {
    id: "decision",
    title: "Decision",
    items: ["Cost", "ROI", "Security", "Contract"],
    dims: ["budget", "security"],
  },
  {
    id: "implementation",
    title: "Implementation",
    items: ["Migration", "Configuration", "Testing"],
    dims: ["data-readiness", "implementation-capacity", "technical"],
  },
  {
    id: "adoption",
    title: "Adoption",
    items: ["Training", "Governance", "Measurement"],
    dims: ["user-adoption", "change-management", "governance", "reporting"],
  },
] as const;

export function JourneyRoadmap({
  assessment,
  productNoun = "CRM",
}: {
  assessment: AssessCrmReadinessResult;
  productNoun?: string;
}) {
  const scoreFor = (dimIds: readonly string[]) => {
    const rows = assessment.dimensions.filter((d) =>
      dimIds.includes(d.dimensionId),
    );
    if (!rows.length) return 0;
    return Math.round(
      rows.reduce((s, d) => s + d.score, 0) / rows.length,
    );
  };

  // Highlight the earliest stage still below 65
  let currentId = STAGES[STAGES.length - 1]!.id;
  for (const stage of STAGES) {
    if (scoreFor(stage.dims) < 65) {
      currentId = stage.id;
      break;
    }
  }

  return (
    <section className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 sm:p-5">
      <h3 className="font-semibold text-[var(--sg-color-navy)]">
        {productNoun === "CRM" ? "CRM" : productNoun} buying journey
      </h3>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Where your readiness suggests you should focus next.
      </p>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STAGES.map((stage) => {
          const score = scoreFor(stage.dims);
          const current = stage.id === currentId;
          return (
            <li
              key={stage.id}
              className={cn(
                "rounded-[var(--sg-radius-lg)] border p-3",
                current
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                  : "border-[var(--sg-color-border)]",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                {stage.title}
                {current ? " · You are here" : ""}
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--sg-color-navy)]">
                {score}
              </p>
              <ul className="mt-2 space-y-0.5 text-xs text-[var(--sg-color-text-muted)]">
                {stage.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
