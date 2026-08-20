"use client";

import type {
  CurrencyCode,
  RoiInputs,
  RoiInternalLabourRow,
  RoiWizardStep,
} from "@/domain";
import { fromMajor, toMajor } from "@/domain";
import {
  currentHoursForRole,
  resolveHoursSaved,
} from "@/services/roi";
import { TcoMoneyInput } from "@/components/tco/tco-money-input";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/forms";
import { Badge } from "@/components/ui/badge";
import { RoiNumberInput } from "./roi-number-input";

type Patch = (updater: (prev: RoiInputs) => RoiInputs) => void;

function majorOf(minor: number | null | undefined): number | null | undefined {
  if (minor === null) return null;
  if (minor === undefined) return undefined;
  return toMajor({ amountMinor: minor, currency: "EUR" });
}

function toMinor(
  major: number | null | undefined,
  currency: CurrencyCode,
): number | null | undefined {
  if (major === null) return null;
  if (major === undefined) return undefined;
  return fromMajor(major, currency).amountMinor;
}

const REALIZATION_PRESETS = [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1 },
] as const;

export function RoiStepCurrentState({
  inputs,
  patch,
}: {
  inputs: RoiInputs;
  patch: Patch;
}) {
  const cs = inputs.currentState;
  const currency = inputs.currency;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          Tell us about your current sales operation
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Headcount and process time feed productivity estimates. Leave hourly
          costs blank if you prefer to estimate later — we never invent salaries.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["crmUsers", "Number of CRM users", cs.crmUsers],
            ["salesReps", "Number of sales reps", cs.salesReps],
            ["managers", "Number of managers", cs.managers],
            ["opsAdminUsers", "CRM / admin / ops users", cs.opsAdminUsers],
          ] as const
        ).map(([key, label, value]) => (
          <Field key={key} label={label} htmlFor={`roi-${key}`}>
            <RoiNumberInput
              id={`roi-${key}`}
              min={0}
              step={1}
              value={value}
              onChange={(n) =>
                patch((p) => ({
                  ...p,
                  currentState: {
                    ...p.currentState,
                    [key]: n,
                  },
                }))
              }
            />
          </Field>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Average loaded hourly cost
        </h3>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={cs.hourlyCosts.deferHourlyCosts}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                currentState: {
                  ...p.currentState,
                  hourlyCosts: {
                    ...p.currentState.hourlyCosts,
                    deferHourlyCosts: e.target.checked,
                  },
                },
              }))
            }
          />
          Use my own estimate later
        </label>
        {!cs.hourlyCosts.deferHourlyCosts ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {(
              [
                ["salesRepMinor", "Sales rep"],
                ["managerMinor", "Manager"],
                ["opsAdminMinor", "Operations / admin"],
              ] as const
            ).map(([key, label]) => (
              <TcoMoneyInput
                key={key}
                id={`hourly-${key}`}
                label={label}
                currency={currency}
                allowUnknown={false}
                valueMajor={majorOf(cs.hourlyCosts[key])}
                onChange={(v) =>
                  patch((p) => ({
                    ...p,
                    currentState: {
                      ...p.currentState,
                      hourlyCosts: {
                        ...p.currentState.hourlyCosts,
                        [key]: toMinor(v, currency) ?? undefined,
                      },
                    },
                  }))
                }
              />
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Current process costs
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Only include time you genuinely believe could be reduced by a better
          CRM or process. Do not count all admin time automatically. Zero is
          allowed.
        </p>

        <div className="mt-4 space-y-6">
          <ProcessGroup
            title="Hours per sales rep per week"
            fields={[
              ["dataEntry", "Manual CRM / data entry", cs.processHours.salesRep.dataEntry],
              ["searching", "Searching for customer information", cs.processHours.salesRep.searching],
              ["reporting", "Preparing reports", cs.processHours.salesRep.reporting],
              ["duplicateAdmin", "Duplicate admin work", cs.processHours.salesRep.duplicateAdmin],
            ]}
            onChange={(key, value) =>
              patch((p) => ({
                ...p,
                currentState: {
                  ...p.currentState,
                  processHours: {
                    ...p.currentState.processHours,
                    salesRep: {
                      ...p.currentState.processHours.salesRep,
                      [key]: value,
                    },
                  },
                },
              }))
            }
          />
          <ProcessGroup
            title="Hours per manager per week"
            fields={[
              ["pipelineReporting", "Pipeline reporting", cs.processHours.manager.pipelineReporting],
              ["forecasting", "Forecasting", cs.processHours.manager.forecasting],
              ["reconciliation", "Manual data reconciliation", cs.processHours.manager.reconciliation],
            ]}
            onChange={(key, value) =>
              patch((p) => ({
                ...p,
                currentState: {
                  ...p.currentState,
                  processHours: {
                    ...p.currentState.processHours,
                    manager: {
                      ...p.currentState.processHours.manager,
                      [key]: value,
                    },
                  },
                },
              }))
            }
          />
          <ProcessGroup
            title="Hours per ops / admin user per week"
            fields={[
              ["administration", "CRM administration", cs.processHours.opsAdmin.administration],
              ["reporting", "Reporting", cs.processHours.opsAdmin.reporting],
              ["dataCleanup", "Data cleanup", cs.processHours.opsAdmin.dataCleanup],
              ["leadRouting", "Manual lead routing / assignment", cs.processHours.opsAdmin.leadRouting],
            ]}
            onChange={(key, value) =>
              patch((p) => ({
                ...p,
                currentState: {
                  ...p.currentState,
                  processHours: {
                    ...p.currentState.processHours,
                    opsAdmin: {
                      ...p.currentState.processHours.opsAdmin,
                      [key]: value,
                    },
                  },
                },
              }))
            }
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Current annual software costs (optional)
        </h3>
        <div className="mt-3 space-y-3">
          {cs.softwareCosts.map((row) => (
            <div
              key={row.id}
              className="grid gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] p-3 sm:grid-cols-[1fr_auto_8rem_8rem]"
            >
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={row.include}
                  onChange={(e) =>
                    patch((p) => ({
                      ...p,
                      currentState: {
                        ...p.currentState,
                        softwareCosts: p.currentState.softwareCosts.map((r) =>
                          r.id === row.id
                            ? { ...r, include: e.target.checked }
                            : r,
                        ),
                      },
                    }))
                  }
                />
                {row.label}
              </label>
              <Select
                value={row.billing}
                aria-label={`${row.label} billing`}
                onChange={(e) =>
                  patch((p) => ({
                    ...p,
                    currentState: {
                      ...p.currentState,
                      softwareCosts: p.currentState.softwareCosts.map((r) =>
                        r.id === row.id
                          ? {
                              ...r,
                              billing: e.target.value as "annual" | "monthly",
                            }
                          : r,
                      ),
                    },
                  }))
                }
              >
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
              </Select>
              <TcoMoneyInput
                id={`sw-${row.id}`}
                label={row.billing === "monthly" ? "Monthly cost" : "Annual cost"}
                currency={currency}
                allowUnknown
                valueMajor={
                  row.billing === "monthly"
                    ? majorOf(row.monthlyMinor)
                    : majorOf(row.annualMinor)
                }
                onChange={(v) =>
                  patch((p) => ({
                    ...p,
                    currentState: {
                      ...p.currentState,
                      softwareCosts: p.currentState.softwareCosts.map((r) =>
                        r.id === row.id
                          ? row.billing === "monthly"
                            ? { ...r, monthlyMinor: toMinor(v, currency) }
                            : { ...r, annualMinor: toMinor(v, currency) }
                          : r,
                      ),
                    },
                  }))
                }
              />
              <p className="text-xs text-[var(--sg-color-text-muted)] sm:self-end">
                Leave unchecked to exclude
              </p>
            </div>
          ))}
        </div>
      </div>

      <Field label="Working weeks per year" htmlFor="working-weeks" hint="Used in productivity annualization">
        <RoiNumberInput
          id="working-weeks"
          min={1}
          max={52}
          step={1}
          value={cs.workingWeeksPerYear}
          onChange={(n) =>
            patch((p) => ({
              ...p,
              currentState: {
                ...p.currentState,
                workingWeeksPerYear: n,
              },
            }))
          }
        />
      </Field>
    </div>
  );
}

function ProcessGroup({
  title,
  fields,
  onChange,
}: {
  title: string;
  fields: Array<[string, string, number]>;
  onChange: (key: string, value: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-[var(--sg-color-text)]">
        {title}
      </legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {fields.map(([key, label, value]) => (
          <Field key={key} label={label} htmlFor={`ph-${title}-${key}`}>
            <RoiNumberInput
              id={`ph-${title}-${key}`}
              min={0}
              step={0.25}
              placeholder="0"
              value={value}
              onChange={(n) => onChange(key, n)}
            />
          </Field>
        ))}
      </div>
    </fieldset>
  );
}

export function RoiStepInvestment({
  inputs,
  patch,
  costDraftAvailable,
  onImportCost,
}: {
  inputs: RoiInputs;
  patch: Patch;
  costDraftAvailable: boolean;
  onImportCost: () => void;
}) {
  const inv = inputs.investment;
  const currency = inputs.currency;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          What will the new CRM cost?
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Leave blank for unknown — unknowns are never treated as zero. Import
          from the Cost Calculator only with confirmation.
        </p>
      </div>

      {costDraftAvailable ? (
        <Alert variant="info" title="CRM Cost Calculator draft found">
          <div className="flex flex-wrap items-center gap-3">
            <span>Import licence context from your saved cost estimate.</span>
            <Button type="button" size="sm" onClick={onImportCost}>
              Use my CRM Cost Calculator estimate
            </Button>
          </div>
        </Alert>
      ) : null}

      {inv.importedProductName ? (
        <p className="text-xs text-[var(--sg-color-text-muted)]">
          Last import: {inv.importedProductName} (
          {inv.source})
        </p>
      ) : null}

      <section>
        <h3 className="text-sm font-semibold">Software</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["licencesMinor", "Licences (annual)"],
              ["addOnsMinor", "Add-ons (annual)"],
              ["otherRecurringSoftwareMinor", "Other recurring software"],
            ] as const
          ).map(([key, label]) => (
            <TcoMoneyInput
              key={key}
              id={key}
              label={label}
              currency={currency}
              valueMajor={majorOf(inv[key])}
              onChange={(v) =>
                patch((p) => ({
                  ...p,
                  investment: {
                    ...p.investment,
                    [key]: toMinor(v, currency),
                  },
                }))
              }
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold">Implementation (one-time)</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["implementationPartnerMinor", "Implementation partner"],
              ["migrationMinor", "Migration"],
              ["integrationsMinor", "Integrations"],
              ["trainingMinor", "Training"],
              ["changeManagementMinor", "Change management"],
              ["customizationMinor", "Customization"],
              ["otherOneTimeMinor", "Other one-time"],
            ] as const
          ).map(([key, label]) => (
            <TcoMoneyInput
              key={key}
              id={key}
              label={label}
              currency={currency}
              valueMajor={majorOf(inv[key])}
              onChange={(v) =>
                patch((p) => ({
                  ...p,
                  investment: {
                    ...p.investment,
                    [key]: toMinor(v, currency),
                  },
                }))
              }
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold">Recurring ownership</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["crmAdministrationMinor", "CRM administration (annual)"],
              ["premiumSupportMinor", "Premium support (annual)"],
              ["integrationPlatformMinor", "Integration / platform (annual)"],
              ["ongoingTrainingMinor", "Ongoing training (annual)"],
            ] as const
          ).map(([key, label]) => (
            <TcoMoneyInput
              key={key}
              id={key}
              label={label}
              currency={currency}
              valueMajor={majorOf(inv[key])}
              onChange={(v) =>
                patch((p) => ({
                  ...p,
                  investment: {
                    ...p.investment,
                    [key]: toMinor(v, currency),
                  },
                }))
              }
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">
            Internal implementation labour{" "}
            <Badge variant="warning">Internal cost estimate</Badge>
          </h3>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              patch((p) => ({
                ...p,
                investment: {
                  ...p.investment,
                  internalLabour: [
                    ...p.investment.internalLabour,
                    {
                      id: `lab-${Math.random().toString(36).slice(2, 8)}`,
                      role: "RevOps",
                      people: 1,
                      hours: 0,
                    } satisfies RoiInternalLabourRow,
                  ],
                },
              }))
            }
          >
            Add role
          </Button>
        </div>
        <div className="mt-3 space-y-3">
          {inv.internalLabour.map((row) => (
            <div
              key={row.id}
              className="grid gap-2 rounded border border-[var(--sg-color-border)] p-3 sm:grid-cols-4"
            >
              <Field label="Role" htmlFor={`role-${row.id}`}>
                <Input
                  id={`role-${row.id}`}
                  value={row.role}
                  onChange={(e) =>
                    patch((p) => ({
                      ...p,
                      investment: {
                        ...p.investment,
                        internalLabour: p.investment.internalLabour.map((r) =>
                          r.id === row.id ? { ...r, role: e.target.value } : r,
                        ),
                      },
                    }))
                  }
                />
              </Field>
              <Field label="People" htmlFor={`people-${row.id}`}>
                <RoiNumberInput
                  id={`people-${row.id}`}
                  min={0}
                  step={1}
                  value={row.people}
                  onChange={(n) =>
                    patch((p) => ({
                      ...p,
                      investment: {
                        ...p.investment,
                        internalLabour: p.investment.internalLabour.map((r) =>
                          r.id === row.id
                            ? { ...r, people: n ?? 0 }
                            : r,
                        ),
                      },
                    }))
                  }
                />
              </Field>
              <Field label="Hours" htmlFor={`hours-${row.id}`}>
                <RoiNumberInput
                  id={`hours-${row.id}`}
                  min={0}
                  step={1}
                  value={row.hours}
                  onChange={(n) =>
                    patch((p) => ({
                      ...p,
                      investment: {
                        ...p.investment,
                        internalLabour: p.investment.internalLabour.map((r) =>
                          r.id === row.id
                            ? { ...r, hours: n ?? 0 }
                            : r,
                        ),
                      },
                    }))
                  }
                />
              </Field>
              <TcoMoneyInput
                id={`lab-rate-${row.id}`}
                label="Loaded hourly cost"
                currency={currency}
                allowUnknown={false}
                valueMajor={majorOf(row.hourlyCostMinor)}
                onChange={(v) =>
                  patch((p) => ({
                    ...p,
                    investment: {
                      ...p.investment,
                      internalLabour: p.investment.internalLabour.map((r) =>
                        r.id === row.id
                          ? {
                              ...r,
                              hourlyCostMinor:
                                toMinor(v, currency) ?? undefined,
                            }
                          : r,
                      ),
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function RoiStepProductivity({
  inputs,
  patch,
}: {
  inputs: RoiInputs;
  patch: Patch;
}) {
  const prod = inputs.productivity;
  const cs = inputs.currentState;
  const currency = inputs.currency;
  const weeks = cs.workingWeeksPerYear;

  const roles = [
    {
      key: "salesReps" as const,
      label: "Sales reps",
      users: cs.salesReps,
      hourly: cs.hourlyCosts.salesRepMinor,
    },
    {
      key: "managers" as const,
      label: "Managers",
      users: cs.managers,
      hourly: cs.hourlyCosts.managerMinor,
    },
    {
      key: "opsAdmin" as const,
      label: "Ops / admin",
      users: cs.opsAdminUsers,
      hourly: cs.hourlyCosts.opsAdminMinor,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          Estimate time the CRM could realistically save
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Formula: users × hours saved/week × working weeks × loaded hourly cost
          × realization factor. This is usually the strongest measurable
          category.
        </p>
      </div>

      {roles.map((role) => {
        const cfg = prod[role.key];
        const current = currentHoursForRole(inputs, role.key);
        const saved = resolveHoursSaved(cfg, current, inputs.activeScenario);
        const gross =
          role.users * saved * weeks * (role.hourly ?? 0);
        const realized = Math.round(gross * prod.realizationFactor);

        return (
          <div
            key={role.key}
            className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-[var(--sg-color-navy)]">
                {role.label}
              </h3>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={cfg.included}
                  onChange={(e) =>
                    patch((p) => ({
                      ...p,
                      productivity: {
                        ...p.productivity,
                        [role.key]: {
                          ...p.productivity[role.key],
                          included: e.target.checked,
                        },
                      },
                    }))
                  }
                />
                Include in ROI
              </label>
            </div>
            <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
              Current CRM/admin work: {current} hours/week · Users: {role.users}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={
                  cfg.inputMode === "reduction-percent" ? "primary" : "secondary"
                }
                onClick={() =>
                  patch((p) => ({
                    ...p,
                    productivity: {
                      ...p.productivity,
                      [role.key]: {
                        ...p.productivity[role.key],
                        inputMode: "reduction-percent",
                      },
                    },
                  }))
                }
              >
                Reduction %
              </Button>
              <Button
                type="button"
                size="sm"
                variant={
                  cfg.inputMode === "hours-saved" ? "primary" : "secondary"
                }
                onClick={() =>
                  patch((p) => ({
                    ...p,
                    productivity: {
                      ...p.productivity,
                      [role.key]: {
                        ...p.productivity[role.key],
                        inputMode: "hours-saved",
                      },
                    },
                  }))
                }
              >
                Hours saved / week
              </Button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {cfg.inputMode === "reduction-percent" ? (
                <Field label="Expected reduction %" htmlFor={`${role.key}-pct`}>
                  <RoiNumberInput
                    id={`${role.key}-pct`}
                    min={0}
                    max={100}
                    step={1}
                    allowEmpty
                    placeholder="e.g. 25"
                    value={cfg.reductionPercent}
                    onChange={(n) =>
                      patch((p) => ({
                        ...p,
                        productivity: {
                          ...p.productivity,
                          [role.key]: {
                            ...p.productivity[role.key],
                            reductionPercent: n,
                          },
                        },
                      }))
                    }
                  />
                </Field>
              ) : (
                <Field
                  label="Hours saved / week"
                  htmlFor={`${role.key}-hrs`}
                >
                  <RoiNumberInput
                    id={`${role.key}-hrs`}
                    min={0}
                    step={0.1}
                    allowEmpty
                    placeholder="e.g. 1"
                    value={cfg.hoursSavedPerWeek}
                    onChange={(n) =>
                      patch((p) => ({
                        ...p,
                        productivity: {
                          ...p.productivity,
                          [role.key]: {
                            ...p.productivity[role.key],
                            hoursSavedPerWeek: n,
                          },
                        },
                      }))
                    }
                  />
                </Field>
              )}
              <Field label="Conservative hrs" htmlFor={`${role.key}-c`}>
                <RoiNumberInput
                  id={`${role.key}-c`}
                  min={0}
                  step={0.1}
                  allowEmpty
                  placeholder="Optional"
                  value={cfg.scenarioHours?.conservative}
                  onChange={(n) =>
                    patch((p) => {
                      const prev = {
                        ...p.productivity[role.key].scenarioHours,
                      };
                      if (n == null) {
                        delete prev.conservative;
                      } else {
                        prev.conservative = n;
                      }
                      const hasAny = Object.keys(prev).length > 0;
                      return {
                        ...p,
                        productivity: {
                          ...p.productivity,
                          [role.key]: {
                            ...p.productivity[role.key],
                            scenarioHours: hasAny ? prev : undefined,
                          },
                        },
                      };
                    })
                  }
                />
              </Field>
              <Field label="Upside hrs" htmlFor={`${role.key}-u`}>
                <RoiNumberInput
                  id={`${role.key}-u`}
                  min={0}
                  step={0.1}
                  allowEmpty
                  placeholder="Optional"
                  value={cfg.scenarioHours?.upside}
                  onChange={(n) =>
                    patch((p) => {
                      const prev = {
                        ...p.productivity[role.key].scenarioHours,
                      };
                      if (n == null) {
                        delete prev.upside;
                      } else {
                        prev.upside = n;
                      }
                      const hasAny = Object.keys(prev).length > 0;
                      return {
                        ...p,
                        productivity: {
                          ...p.productivity,
                          [role.key]: {
                            ...p.productivity[role.key],
                            scenarioHours: hasAny ? prev : undefined,
                          },
                        },
                      };
                    })
                  }
                />
              </Field>
            </div>

            <p className="mt-3 text-sm">
              Hours saved: <strong>{saved}</strong>/week · Annual productivity
              value (realized):{" "}
              <strong>
                {toMajor({
                  amountMinor: realized,
                  currency: currency as CurrencyCode,
                }).toLocaleString(undefined, {
                  style: "currency",
                  currency,
                  maximumFractionDigits: 0,
                })}
              </strong>
            </p>
          </div>
        );
      })}

      <div className="rounded-[var(--sg-radius-xl)] border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          Productivity realization factor
        </h3>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Saved time does not automatically equal financial benefit. If one hour
          saved does not reduce headcount or directly create revenue, count only
          part of it as realizable value. Default is 50% — not 100%.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {REALIZATION_PRESETS.map((p) => (
            <Button
              key={p.value}
              type="button"
              size="sm"
              variant={
                prod.realizationFactor === p.value ? "primary" : "secondary"
              }
              onClick={() =>
                patch((prev) => ({
                  ...prev,
                  productivity: {
                    ...prev.productivity,
                    realizationFactor: p.value,
                    realizationCustom: false,
                  },
                }))
              }
            >
              {p.label}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant={prod.realizationCustom ? "primary" : "secondary"}
            onClick={() =>
              patch((prev) => ({
                ...prev,
                productivity: {
                  ...prev.productivity,
                  realizationCustom: true,
                },
              }))
            }
          >
            Custom
          </Button>
        </div>
        {prod.realizationCustom ? (
          <div className="mt-3 max-w-xs">
            <Field label="Custom realization %" htmlFor="realization-custom">
              <RoiNumberInput
                id="realization-custom"
                min={0}
                max={100}
                step={1}
                placeholder="50"
                value={Math.round(prod.realizationFactor * 100)}
                onChange={(n) =>
                  patch((prev) => ({
                    ...prev,
                    productivity: {
                      ...prev.productivity,
                      realizationFactor: (n ?? 0) / 100,
                    },
                  }))
                }
              />
            </Field>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type { RoiWizardStep };
