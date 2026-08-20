"use client";

import type { PlanRequirementDef } from "@/data/config/plan-selector/requirements";
import type { CrmPlanSelectorAnswers } from "@/domain";
import type { PricingSnapshot } from "@/services/pricing";

type Props = {
  snapshot: PricingSnapshot;
  requirements: PlanRequirementDef[];
  answers: CrmPlanSelectorAnswers;
  onChange: (patch: Partial<CrmPlanSelectorAnswers>) => void;
};

/**
 * Conditional usage questions — only when must-have + published numeric limits
 * or a usageHint exists. Never invents limits.
 */
export function StepUsage({
  snapshot,
  requirements,
  answers,
  onChange,
}: Props) {
  const mustHints = requirements.filter((r) => {
    const p = answers.requirementPriorities[r.featureSlug];
    return p === "must" && r.usageHint;
  });

  const plansWithNumericLimits = (snapshot.pricing?.plans ?? []).filter(
    (p) =>
      p.limits &&
      Object.values(p.limits).some((v) => typeof v === "number"),
  );

  const maxSeatCaps = (snapshot.pricing?.plans ?? [])
    .map((p) => p.limits?.maxSeats)
    .filter((v): v is number => typeof v === "number");

  const questions: Array<{
    id: string;
    label: string;
    description: string;
    min: number;
    max: number;
  }> = [];

  if (mustHints.some((r) => r.usageHint === "pipelines")) {
    questions.push({
      id: "pipelines",
      label: "Approximate number of pipelines",
      description:
        "Asked because multiple/custom pipelines is a must-have. We only fail a plan when a published pipeline limit exists.",
      min: 1,
      max: 100,
    });
  }
  if (mustHints.some((r) => r.usageHint === "workflows")) {
    questions.push({
      id: "workflows",
      label: "Approximate active automation workflows",
      description:
        "Asked because workflow automation is a must-have. Compared only against published workflow caps.",
      min: 0,
      max: 500,
    });
  }
  if (mustHints.some((r) => r.usageHint === "sequences")) {
    questions.push({
      id: "sequences",
      label: "Approximate email sequences in use",
      description:
        "Asked because email sequences is a must-have. Compared only when sequence limits are published.",
      min: 0,
      max: 200,
    });
  }
  if (mustHints.some((r) => r.usageHint === "custom-fields")) {
    questions.push({
      id: "customFields",
      label: "Approximate custom fields needed",
      description:
        "Asked because custom fields is a must-have. Compared only when field caps are published.",
      min: 0,
      max: 1000,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          How heavily will you use the CRM?
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Features can exist on a plan while limits make it unsuitable. We only
          enforce limits that appear in verified research.
        </p>
      </div>

      {maxSeatCaps.length > 0 ? (
        <p className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]">
          This CRM publishes seat caps on some plans (e.g. max{" "}
          {Math.max(...maxSeatCaps)} on at least one tier). Your team size from
          the previous step is already checked against those caps.
        </p>
      ) : null}

      {questions.length === 0 ? (
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          {plansWithNumericLimits.length === 0
            ? "No additional usage questions for this CRM — published numeric usage caps beyond seats are limited in our research. Continue to growth context."
            : "No usage follow-ups apply based on your must-haves. Continue to growth context."}
        </p>
      ) : (
        <div className="space-y-5">
          {questions.map((q) => (
            <label key={q.id} className="block text-sm">
              <span className="font-medium text-[var(--sg-color-navy)]">
                {q.label}
              </span>
              <span className="mt-1 block text-xs text-[var(--sg-color-text-muted)]">
                {q.description}
              </span>
              <input
                type="number"
                min={q.min}
                max={q.max}
                value={answers.usageAssumptions[q.id] ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  const next = { ...answers.usageAssumptions };
                  if (raw === "") {
                    delete next[q.id];
                  } else {
                    const n = Number(raw);
                    if (Number.isFinite(n)) {
                      next[q.id] = Math.min(q.max, Math.max(q.min, Math.floor(n)));
                    }
                  }
                  onChange({ usageAssumptions: next });
                }}
                className="mt-2 h-10 w-full max-w-xs rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
