"use client";

import { useState } from "react";
import type { ReadinessContext } from "@/domain";
import { Button } from "@/components/ui/button";
import {
  CRM_READINESS_CONTEXT_COPY,
  type ReadinessContextCopy,
} from "@/services/readiness-assessment/localize-catalog";

type Props = {
  context: ReadinessContext;
  onBack: () => void;
  onContinue: (context: ReadinessContext) => void;
  copy?: ReadinessContextCopy;
};

const inputClass =
  "w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm text-[var(--sg-color-navy)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-color-primary)]";

export function ContextStep({
  context,
  onBack,
  onContinue,
  copy = CRM_READINESS_CONTEXT_COPY,
}: Props) {
  const [draft, setDraft] = useState<ReadinessContext>(context);

  return (
    <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-8">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
        Organization context
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        Used to calibrate questions — not to invent benchmark percentiles.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Project name">
          <input
            className={inputClass}
            value={draft.projectName}
            onChange={(e) =>
              setDraft({ ...draft, projectName: e.target.value })
            }
          />
        </Field>
        <Field label="Assessed by">
          <input
            className={inputClass}
            value={draft.assessedBy}
            onChange={(e) =>
              setDraft({ ...draft, assessedBy: e.target.value })
            }
          />
        </Field>
        <Field label="Organization">
          <input
            className={inputClass}
            value={draft.organization}
            onChange={(e) =>
              setDraft({ ...draft, organization: e.target.value })
            }
          />
        </Field>
        <Field label="Industry">
          <input
            className={inputClass}
            value={draft.industry}
            onChange={(e) => setDraft({ ...draft, industry: e.target.value })}
          />
        </Field>
        <Field label="Company size">
          <select
            className={inputClass}
            value={draft.companySize ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                companySize: (e.target.value ||
                  undefined) as ReadinessContext["companySize"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="1-10">1–10</option>
            <option value="11-50">11–50</option>
            <option value="51-200">51–200</option>
            <option value="201-1000">201–1000</option>
            <option value="1000+">1000+</option>
          </select>
        </Field>
        <Field label={copy.usersLabel}>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={draft.crmUsers ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                crmUsers: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </Field>
        <Field label={copy.teamSizeLabel}>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={draft.salesTeamSize ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                salesTeamSize: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
          />
        </Field>
        <Field label={copy.modelLabel}>
          <select
            className={inputClass}
            value={draft.salesModel ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                salesModel: (e.target.value ||
                  undefined) as ReadinessContext["salesModel"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="b2b">B2B</option>
            <option value="b2c">B2C</option>
            <option value="both">Both</option>
          </select>
        </Field>
        <Field label={copy.complexityLabel}>
          <select
            className={inputClass}
            value={draft.salesComplexity ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                salesComplexity: (e.target.value ||
                  undefined) as ReadinessContext["salesComplexity"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="simple">Simple</option>
            <option value="moderate">Moderate</option>
            <option value="complex">Complex</option>
          </select>
        </Field>
        <Field label="Expected integrations (count)">
          <input
            type="number"
            min={0}
            className={inputClass}
            value={draft.expectedIntegrations ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                expectedIntegrations: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
          />
        </Field>
        <Field label={copy.replacingLabel}>
          <select
            className={inputClass}
            value={
              draft.replacingCrm === true
                ? "yes"
                : draft.replacingCrm === false
                  ? "no"
                  : ""
            }
            onChange={(e) =>
              setDraft({
                ...draft,
                replacingCrm:
                  e.target.value === "yes"
                    ? true
                    : e.target.value === "no"
                      ? false
                      : undefined,
              })
            }
          >
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
        {draft.replacingCrm ? (
          <Field label={copy.currentToolLabel}>
            <input
              className={inputClass}
              value={draft.currentCrm}
              onChange={(e) =>
                setDraft({ ...draft, currentCrm: e.target.value })
              }
            />
          </Field>
        ) : null}
        <Field label="Implementation approach">
          <select
            className={inputClass}
            value={draft.implementationApproach ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                implementationApproach: (e.target.value ||
                  undefined) as ReadinessContext["implementationApproach"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="internal">Internal</option>
            <option value="partner">Partner</option>
            <option value="hybrid">Hybrid</option>
            <option value="not-sure">Not sure</option>
          </select>
        </Field>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={() => onContinue(draft)}>Continue to assessment</Button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-[var(--sg-color-navy)]">
        {label}
      </span>
      {children}
    </label>
  );
}
