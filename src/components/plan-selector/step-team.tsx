"use client";

import { UserCountInput } from "@/components/pricing/user-count-input";
import type {
  CrmPlanSelectorAnswers,
  FullAccessNeed,
} from "@/domain";

type Props = {
  answers: CrmPlanSelectorAnswers;
  onChange: (patch: Partial<CrmPlanSelectorAnswers>) => void;
};

const ACCESS_OPTIONS: Array<{ value: FullAccessNeed; label: string }> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" },
];

export function StepTeam({ answers, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          Who will use the CRM?
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Seat count drives plan eligibility and cost estimates. We only model
          distinct seat types when a vendor publishes them.
        </p>
      </div>

      <UserCountInput
        id="plan-crm-users"
        value={answers.crmUsers}
        onChange={(crmUsers) => onChange({ crmUsers })}
        label="Number of CRM users"
        description="People who need a CRM login today."
      />

      <UserCountInput
        id="plan-crm-users-12m"
        value={answers.usersIn12Months ?? answers.crmUsers}
        onChange={(usersIn12Months) => onChange({ usersIn12Months })}
        label="Expected users in 12 months"
        description="Used to spot cost cliffs and seat-cap issues."
      />

      <fieldset>
        <legend className="text-sm font-medium text-[var(--sg-color-text)]">
          Do all users need full CRM access?
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ACCESS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm has-[:checked]:border-[var(--sg-color-primary)] has-[:checked]:bg-[var(--sg-color-primary-soft)]"
            >
              <input
                type="radio"
                name="full-access"
                value={opt.value}
                checked={answers.fullAccessNeed === opt.value}
                onChange={() => onChange({ fullAccessNeed: opt.value })}
                className="accent-[var(--sg-color-primary)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {answers.fullAccessNeed === "no" ? (
          <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
            Light / read-only seats are not modelled for this CRM yet — confirm
            cheaper seat types with the vendor. Estimates use full seats.
          </p>
        ) : null}
      </fieldset>

      <RoleBreakdown answers={answers} onChange={onChange} />
    </div>
  );
}

function RoleBreakdown({ answers, onChange }: Props) {
  const roles = answers.roleBreakdown ?? {};
  const fields: Array<{
    key: keyof NonNullable<CrmPlanSelectorAnswers["roleBreakdown"]>;
    label: string;
  }> = [
    { key: "salesReps", label: "Sales reps" },
    { key: "salesManagers", label: "Sales managers" },
    { key: "administrators", label: "Administrators" },
    { key: "marketing", label: "Marketing users" },
    { key: "customerService", label: "Customer service" },
    { key: "operations", label: "Operations" },
    { key: "other", label: "Other" },
  ];

  return (
    <fieldset>
      <legend className="text-sm font-medium text-[var(--sg-color-text)]">
        Role breakdown (optional)
      </legend>
      <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
        Helps frame the recommendation — does not invent seat pricing.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="text-sm">
            <span className="text-[var(--sg-color-text-muted)]">{f.label}</span>
            <input
              type="number"
              min={0}
              max={10_000}
              value={roles[f.key] ?? ""}
              onChange={(e) => {
                const n = e.target.value === "" ? undefined : Number(e.target.value);
                onChange({
                  roleBreakdown: {
                    ...roles,
                    [f.key]:
                      n != null && Number.isFinite(n)
                        ? Math.max(0, Math.floor(n))
                        : undefined,
                  },
                });
              }}
              className="mt-1 h-10 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
