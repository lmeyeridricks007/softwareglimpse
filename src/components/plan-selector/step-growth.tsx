"use client";

import { BillingPreferenceControl } from "@/components/pricing/billing-preference";
import type {
  CrmPlanSelectorAnswers,
  PlanBusinessMaturity,
  PlanImplementationComplexity,
  PlanPreference,
} from "@/domain";

type Props = {
  answers: CrmPlanSelectorAnswers;
  onChange: (patch: Partial<CrmPlanSelectorAnswers>) => void;
  hasSso: boolean;
  hasAuditLogs: boolean;
  hasAdvancedPermissions: boolean;
};

export function StepGrowth({
  answers,
  onChange,
  hasSso,
  hasAuditLogs,
  hasAdvancedPermissions,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          How much room do you need to grow?
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Preferences guide messaging. Hard gates (SSO, audit logs, advanced
          permissions) still force the minimum eligible plan.
        </p>
      </div>

      <BillingPreferenceControl
        value={answers.billingPreference}
        onChange={(billingPreference) => onChange({ billingPreference })}
      />

      <ChoiceGroup
        legend="Implementation complexity"
        name="impl"
        value={answers.implementationComplexity}
        options={[
          { value: "simple", label: "Simple" },
          { value: "moderate", label: "Moderate" },
          { value: "complex", label: "Complex" },
        ]}
        onChange={(implementationComplexity) =>
          onChange({
            implementationComplexity:
              implementationComplexity as PlanImplementationComplexity,
          })
        }
      />

      <ChoiceGroup
        legend="Business maturity"
        name="maturity"
        value={answers.businessMaturity}
        options={[
          { value: "starting", label: "Starting with CRM" },
          {
            value: "replacing-spreadsheets",
            label: "Replacing spreadsheets",
          },
          { value: "replacing-crm", label: "Replacing another CRM" },
          { value: "scaling", label: "Scaling an existing CRM" },
        ]}
        onChange={(businessMaturity) =>
          onChange({ businessMaturity: businessMaturity as PlanBusinessMaturity })
        }
      />

      <ChoiceGroup
        legend="Preference"
        name="pref"
        value={answers.preference}
        options={[
          { value: "lowest-cost", label: "Lowest possible cost" },
          { value: "balanced", label: "Balanced cost and capability" },
          { value: "growth", label: "More room to grow" },
          {
            value: "enterprise",
            label: "Maximum control / enterprise requirements",
          },
        ]}
        onChange={(preference) =>
          onChange({ preference: preference as PlanPreference })
        }
      />

      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-text)]">
          Hard enterprise gates (when researched for this CRM)
        </legend>
        <div className="mt-3 space-y-2">
          {hasSso ? (
            <Toggle
              label="SSO is required"
              checked={answers.requireSso}
              onChange={(requireSso) => onChange({ requireSso })}
            />
          ) : null}
          {hasAuditLogs ? (
            <Toggle
              label="Audit logging is required"
              checked={answers.requireAuditLogs}
              onChange={(requireAuditLogs) => onChange({ requireAuditLogs })}
            />
          ) : null}
          {hasAdvancedPermissions ? (
            <Toggle
              label="Advanced permissions are required"
              checked={answers.requireAdvancedPermissions}
              onChange={(requireAdvancedPermissions) =>
                onChange({ requireAdvancedPermissions })
              }
            />
          ) : null}
          <Toggle
            label="Sandbox / testing environment is required"
            checked={answers.requireSandbox}
            onChange={(requireSandbox) => onChange({ requireSandbox })}
          />
          {!hasSso && !hasAuditLogs && !hasAdvancedPermissions ? (
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              SSO / audit / advanced permission gates are not in this CRM&apos;s
              verified feature matrix yet. Sandbox is recorded as unknown unless
              research adds it.
            </p>
          ) : null}
        </div>
      </fieldset>
    </div>
  );
}

function ChoiceGroup({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value?: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-[var(--sg-color-text)]">
        {legend}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm has-[:checked]:border-[var(--sg-color-primary)] has-[:checked]:bg-[var(--sg-color-primary-soft)]"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-[var(--sg-color-primary)]"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[var(--sg-color-primary)]"
      />
      {label}
    </label>
  );
}
