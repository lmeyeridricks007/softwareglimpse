"use client";

import { useMemo, useState } from "react";
import {
  REQUIREMENT_GROUPS,
  type PlanRequirementDef,
  type RequirementGroupId,
} from "@/data/config/plan-selector/requirements";
import type {
  CrmPlanSelectorAnswers,
  PlanRequirementPriority,
} from "@/domain";
import { cn } from "@/lib/cn";
import { track } from "@/analytics";

type Props = {
  requirements: PlanRequirementDef[];
  answers: CrmPlanSelectorAnswers;
  onChange: (patch: Partial<CrmPlanSelectorAnswers>) => void;
};

const PRIORITIES: Array<{
  value: PlanRequirementPriority;
  label: string;
}> = [
  { value: "must", label: "Must have" },
  { value: "nice", label: "Nice to have" },
  { value: "dont-need", label: "Don't need" },
];

export function StepRequirements({ requirements, answers, onChange }: Props) {
  const groupsPresent = useMemo(() => {
    const ids = new Set(requirements.map((r) => r.group));
    return REQUIREMENT_GROUPS.filter((g) => ids.has(g.id));
  }, [requirements]);

  const [activeGroup, setActiveGroup] = useState<RequirementGroupId>(
    groupsPresent[0]?.id ?? "sales-pipeline",
  );
  const [showAll, setShowAll] = useState(false);

  const inGroup = requirements.filter((r) => r.group === activeGroup);
  const visible = showAll ? inGroup : inGroup.slice(0, 8);

  function setPriority(featureSlug: string, priority: PlanRequirementPriority) {
    track({
      name: "crm_plan_requirement_selected",
      properties: { feature: featureSlug, priority },
    });
    onChange({
      requirementPriorities: {
        ...answers.requirementPriorities,
        [featureSlug]: priority,
      },
    });
  }

  if (requirements.length === 0) {
    return (
      <p className="text-sm text-[var(--sg-color-text-muted)]">
        No verified plan-level requirements are available for this CRM yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          What does your team actually need?
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Mark each capability as must-have, nice-to-have, or don&apos;t need.
          Only must-haves force plan upgrades.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Requirement groups"
        className="flex flex-wrap gap-2"
      >
        {groupsPresent.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={activeGroup === g.id}
            onClick={() => {
              setActiveGroup(g.id);
              setShowAll(false);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]",
              activeGroup === g.id
                ? "bg-[var(--sg-color-primary)] text-white"
                : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-navy)]",
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)]">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <caption className="sr-only">
            Requirements and importance for {activeGroup}
          </caption>
          <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Requirement
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Importance
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Why we ask
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((req) => {
              const priority =
                answers.requirementPriorities[req.featureSlug] ?? "dont-need";
              return (
                <tr
                  key={req.featureSlug}
                  className="border-t border-[var(--sg-color-border)]"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-[var(--sg-color-navy)]"
                  >
                    {req.label}
                  </th>
                  <td className="px-4 py-3">
                    <div
                      role="radiogroup"
                      aria-label={`${req.label} importance`}
                      className="flex flex-wrap gap-2"
                    >
                      {PRIORITIES.map((p) => (
                        <label
                          key={p.value}
                          className={cn(
                            "inline-flex cursor-pointer items-center gap-1.5 rounded-[var(--sg-radius-md)] border px-2 py-1 text-xs",
                            priority === p.value
                              ? p.value === "must"
                                ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                                : "border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface-muted)]"
                              : "border-[var(--sg-color-border)]",
                          )}
                        >
                          <input
                            type="radio"
                            name={`req-${req.featureSlug}`}
                            value={p.value}
                            checked={priority === p.value}
                            onChange={() =>
                              setPriority(req.featureSlug, p.value)
                            }
                            className="accent-[var(--sg-color-primary)]"
                          />
                          {p.label}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--sg-color-text-muted)]">
                    {req.whyWeAsk}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {inGroup.length > 8 ? (
        <button
          type="button"
          className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Show fewer requirements" : "Show more requirements"}
        </button>
      ) : null}
    </div>
  );
}
