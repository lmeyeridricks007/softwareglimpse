"use client";

import type { DemoAttendeeRole, DemoDurationOption, DemoType } from "@/domain";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import {
  DEMO_ATTENDEE_LABELS,
  DEMO_TYPE_LABELS,
} from "@/services/demo-checklist-builder";
import type { CrmDemoChecklistDraft } from "@/domain";
import { StepHeader, type DemoDraftPatch } from "./step-header";

const DURATION_OPTIONS: Array<{ value: DemoDurationOption; label: string }> = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
  { value: "120", label: "120 minutes" },
  { value: "custom", label: "Custom" },
];

const ATTENDEE_ROLES = Object.entries(DEMO_ATTENDEE_LABELS) as Array<
  [DemoAttendeeRole, string]
>;

type Props = {
  draft: CrmDemoChecklistDraft;
  patch: DemoDraftPatch;
};

export function DemoStepSetup({ draft, patch }: Props) {
  const setup = draft.setup;

  const setSetup = <K extends keyof typeof setup>(
    key: K,
    value: (typeof setup)[K],
  ) => {
    patch((d) => ({
      ...d,
      setup: { ...d.setup, [key]: value },
    }));
  };

  const toggleRole = (role: DemoAttendeeRole) => {
    patch((d) => {
      const roles = new Set(d.setup.attendeeRoles);
      if (roles.has(role)) roles.delete(role);
      else roles.add(role);
      return {
        ...d,
        setup: { ...d.setup, attendeeRoles: [...roles] },
      };
    });
  };

  return (
    <div>
      <StepHeader
        stepLabel="Step 1"
        title="Demo setup"
        description="Define the evaluation context. Use the same demo script for every vendor — only results differ per vendor."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project name" htmlFor="demo-project-name" required>
          <Input
            id="demo-project-name"
            value={setup.projectName}
            onChange={(e) => setSetup("projectName", e.target.value)}
            placeholder="e.g. CRM shortlist demo plan"
          />
        </Field>
        <Field label="Initiative / programme" htmlFor="demo-initiative">
          <Input
            id="demo-initiative"
            value={setup.initiative}
            onChange={(e) => setSetup("initiative", e.target.value)}
          />
        </Field>
        <Field label="Evaluation team" htmlFor="demo-team">
          <Input
            id="demo-team"
            value={setup.evaluationTeam}
            onChange={(e) => setSetup("evaluationTeam", e.target.value)}
            placeholder="Names or roles attending demos"
          />
        </Field>
        <Field label="Demo owner" htmlFor="demo-owner">
          <Input
            id="demo-owner"
            value={setup.demoOwner}
            onChange={(e) => setSetup("demoOwner", e.target.value)}
          />
        </Field>
        <Field
          label="Expected vendors"
          htmlFor="demo-vendors"
          hint="How many vendors will receive the same script?"
        >
          <Input
            id="demo-vendors"
            type="number"
            min={1}
            max={10}
            value={setup.expectedVendors ?? ""}
            onChange={(e) =>
              setSetup(
                "expectedVendors",
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
          />
        </Field>
        <Field label="Demo type" htmlFor="demo-type">
          <Select
            id="demo-type"
            value={setup.demoType}
            onChange={(e) => setSetup("demoType", e.target.value as DemoType)}
          >
            {(Object.entries(DEMO_TYPE_LABELS) as Array<[DemoType, string]>).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </Select>
        </Field>
        <Field label="Demo duration" htmlFor="demo-duration">
          <Select
            id="demo-duration"
            value={setup.durationOption}
            onChange={(e) =>
              setSetup("durationOption", e.target.value as DemoDurationOption)
            }
          >
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Field>
        {setup.durationOption === "custom" ? (
          <Field label="Custom duration (minutes)" htmlFor="demo-custom-duration">
            <Input
              id="demo-custom-duration"
              type="number"
              min={15}
              max={480}
              value={setup.customDurationMinutes ?? ""}
              onChange={(e) =>
                setSetup(
                  "customDurationMinutes",
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
            />
          </Field>
        ) : null}
        <Field label="Target decision date" htmlFor="demo-decision-date">
          <Input
            id="demo-decision-date"
            type="date"
            value={setup.targetDecisionDate}
            onChange={(e) => setSetup("targetDecisionDate", e.target.value)}
          />
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-[var(--sg-color-text)]">
          Attendee roles
        </legend>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Select who should observe or score the demo.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ATTENDEE_ROLES.map(([role, label]) => (
            <label
              key={role}
              className="flex cursor-pointer items-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={setup.attendeeRoles.includes(role)}
                onChange={() => toggleRole(role)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Field
          label="Notes for vendors"
          htmlFor="demo-setup-notes"
          hint="Optional context — not a substitute for the demo script."
        >
          <Textarea
            id="demo-setup-notes"
            value={setup.notes}
            onChange={(e) => setSetup("notes", e.target.value)}
            className="min-h-24"
          />
        </Field>
      </div>
    </div>
  );
}
