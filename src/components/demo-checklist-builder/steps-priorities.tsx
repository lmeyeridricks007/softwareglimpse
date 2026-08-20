"use client";

import { Plus } from "lucide-react";
import type { CrmDemoChecklistDraft, DemoPriorityLevel } from "@/domain";
import { Field, Input, Select } from "@/components/ui/forms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DEMO_PRIORITY_LABELS,
  newDemoId,
} from "@/services/demo-checklist-builder";
import { StepHeader, type DemoDraftPatch } from "./step-header";

type Props = {
  draft: CrmDemoChecklistDraft;
  patch: DemoDraftPatch;
};

function countByPriority(areas: CrmDemoChecklistDraft["evaluationAreas"]) {
  const counts: Record<DemoPriorityLevel, number> = {
    "must-test": 0,
    "should-test": 0,
    optional: 0,
    "not-relevant": 0,
  };
  for (const area of areas) {
    counts[area.priority] += 1;
  }
  return counts;
}

export function DemoStepPriorities({ draft, patch }: Props) {
  const counts = countByPriority(draft.evaluationAreas);

  return (
    <div>
      <StepHeader
        stepLabel="Step 2"
        title="Evaluation priorities"
        description="Mark what must be tested live vs what can wait. Must-have failures stay visible in your scorecard — do not hide gaps."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.entries(DEMO_PRIORITY_LABELS) as Array<[DemoPriorityLevel, string]>).map(
          ([key, label]) => (
            <Badge key={key} variant={key === "must-test" ? "primary" : "neutral"}>
              {label}: {counts[key]}
            </Badge>
          ),
        )}
      </div>

      <div className="space-y-2">
        {draft.evaluationAreas.map((area) => (
          <div
            key={area.id}
            className="flex flex-col gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              {area.custom ? (
                <Input
                  aria-label="Custom evaluation area"
                  value={area.label}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      evaluationAreas: d.evaluationAreas.map((a) =>
                        a.id === area.id ? { ...a, label: e.target.value } : a,
                      ),
                    }))
                  }
                />
              ) : (
                <span className="text-sm font-medium text-[var(--sg-color-navy)]">
                  {area.label}
                </span>
              )}
            </div>
            <Select
              className="sm:w-44"
              aria-label={`Priority for ${area.label}`}
              value={area.priority}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  evaluationAreas: d.evaluationAreas.map((a) =>
                    a.id === area.id
                      ? {
                          ...a,
                          priority: e.target.value as DemoPriorityLevel,
                        }
                      : a,
                  ),
                }))
              }
            >
              {(Object.entries(DEMO_PRIORITY_LABELS) as Array<[DemoPriorityLevel, string]>).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </Select>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <Field label="Add custom area" htmlFor="demo-custom-area" hint="Optional capability to track">
          <Input
            id="demo-custom-area"
            placeholder="e.g. Partner portal"
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              const value = (e.target as HTMLInputElement).value.trim();
              if (!value) return;
              patch((d) => ({
                ...d,
                evaluationAreas: [
                  ...d.evaluationAreas,
                  {
                    id: newDemoId("AREA"),
                    label: value,
                    priority: "should-test",
                    custom: true,
                  },
                ],
              }));
              (e.target as HTMLInputElement).value = "";
            }}
          />
        </Field>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.getElementById(
              "demo-custom-area",
            ) as HTMLInputElement | null;
            const value = input?.value.trim();
            if (!value) return;
            patch((d) => ({
              ...d,
              evaluationAreas: [
                ...d.evaluationAreas,
                {
                  id: newDemoId("AREA"),
                  label: value,
                  priority: "should-test",
                  custom: true,
                },
              ],
            }));
            if (input) input.value = "";
          }}
        >
          <Plus className="size-4" aria-hidden />
          Add area
        </Button>
      </div>
    </div>
  );
}
