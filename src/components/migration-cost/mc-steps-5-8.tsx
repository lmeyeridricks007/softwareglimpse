"use client";

import type {
  McCustomizationRow,
  McEffortCategoryRow,
  McInputs,
  McIntegrationRow,
  McInternalRoleRow,
} from "@/domain";
import {
  CUSTOMIZATION_ITEMS,
  EFFORT_CATEGORIES,
  createDefaultCustomizations,
  createDefaultEffortCategories,
  createDefaultIntegrations,
  createDefaultInternalRoles,
} from "@/domain";
import { TcoMoneyInput } from "@/components/tco/tco-money-input";
import { RoiNumberInput } from "@/components/roi/roi-number-input";
import { Input, Select } from "@/components/ui/forms";
import { Button } from "@/components/ui/button";
import {
  McChoiceGrid,
  McFieldLabel,
  McSection,
  fromMajorOrNull,
  toMajorOrNull,
} from "./mc-helpers";

type Patch = (updater: (prev: McInputs) => McInputs) => void;

export function McStepIntegrations({
  inputs,
  patch,
}: {
  inputs: McInputs;
  patch: Patch;
}) {
  const rows: McIntegrationRow[] =
    inputs.integrations.rows.length > 0
      ? inputs.integrations.rows
      : createDefaultIntegrations();

  const customs: McCustomizationRow[] =
    inputs.integrations.customizations.length > 0
      ? inputs.integrations.customizations
      : createDefaultCustomizations();

  return (
    <McSection
      title="Which integrations need to be rebuilt or validated?"
      description="Enter cost or hours only when known. Blank stays unknown — we never insert default rates."
    >
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div
            key={row.id}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
                {row.label}
              </p>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={row.include}
                  onChange={(e) =>
                    patch((p) => {
                      const next = [...p.integrations.rows];
                      next[idx] = { ...next[idx]!, include: e.target.checked };
                      return {
                        ...p,
                        integrations: { ...p.integrations, rows: next },
                      };
                    })
                  }
                />
                Include
              </label>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {(
                [
                  [
                    "existing",
                    "Existing?",
                    [
                      ["unknown", "Unknown"],
                      ["yes", "Yes"],
                      ["no", "No"],
                    ],
                  ],
                  [
                    "disposition",
                    "Action",
                    [
                      ["unknown", "Unknown"],
                      ["rebuild", "Rebuild"],
                      ["replace", "Replace"],
                      ["retire", "Retire"],
                      ["validate", "Validate"],
                    ],
                  ],
                  [
                    "integrationType",
                    "Type",
                    [
                      ["unknown", "Unknown"],
                      ["native", "Native"],
                      ["marketplace", "Marketplace"],
                      ["ipaas", "iPaaS"],
                      ["custom-api", "Custom API"],
                      ["batch-file", "Batch / file"],
                    ],
                  ],
                  [
                    "complexity",
                    "Complexity",
                    [
                      ["unknown", "Unknown"],
                      ["simple", "Simple"],
                      ["moderate", "Moderate"],
                      ["complex", "Complex"],
                    ],
                  ],
                  [
                    "who",
                    "Who",
                    [
                      ["unknown", "Unknown"],
                      ["internal", "Internal"],
                      ["crm-vendor", "CRM vendor"],
                      ["partner", "Partner"],
                      ["other-vendor", "Other vendor"],
                    ],
                  ],
                ] as const
              ).map(([key, label, opts]) => (
                <div key={key}>
                  <McFieldLabel>{label}</McFieldLabel>
                  <Select
                    className="mt-1"
                    value={row[key]}
                    onChange={(e) =>
                      patch((p) => {
                        const next = [...p.integrations.rows];
                        next[idx] = {
                          ...next[idx]!,
                          [key]: e.target.value,
                        };
                        return {
                          ...p,
                          integrations: { ...p.integrations, rows: next },
                        };
                      })
                    }
                  >
                    {opts.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
              <TcoMoneyInput
                id={`int-cost-${row.id}`}
                label="External cost"
                currency={inputs.currency}
                valueMajor={toMajorOrNull(row.externalCostMinor)}
                onChange={(major) =>
                  patch((p) => {
                    const next = [...p.integrations.rows];
                    next[idx] = {
                      ...next[idx]!,
                      externalCostMinor: fromMajorOrNull(major),
                    };
                    return {
                      ...p,
                      integrations: { ...p.integrations, rows: next },
                    };
                  })
                }
              />
            </div>
            <div className="mt-2 max-w-xs">
              <McFieldLabel htmlFor={`int-h-${row.id}`}>
                Internal hours
              </McFieldLabel>
              <RoiNumberInput
                id={`int-h-${row.id}`}
                className="mt-1"
                value={row.internalHours}
                allowEmpty
                onChange={(v) =>
                  patch((p) => {
                    const next = [...p.integrations.rows];
                    next[idx] = { ...next[idx]!, internalHours: v };
                    return {
                      ...p,
                      integrations: { ...p.integrations, rows: next },
                    };
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          patch((p) => ({
            ...p,
            integrations: {
              ...p.integrations,
              rows: [
                ...p.integrations.rows,
                {
                  id: `other-${Date.now()}`,
                  label: "Other integration",
                  existing: "unknown",
                  disposition: "unknown",
                  integrationType: "unknown",
                  complexity: "unknown",
                  who: "unknown",
                  include: true,
                  isCustom: true,
                },
              ],
            },
          }))
        }
      >
        Add integration
      </Button>

      <h3 className="pt-2 text-sm font-semibold text-[var(--sg-color-navy)]">
        Customization / development
      </h3>
      <div className="space-y-2">
        {customs.map((c, idx) => {
          const meta = CUSTOMIZATION_ITEMS.find((x) => x.id === c.id);
          return (
            <div
              key={c.id}
              className="grid gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 sm:grid-cols-4"
            >
              <p className="text-sm font-medium sm:col-span-4">
                {meta?.label ?? c.id}
              </p>
              <div>
                <McFieldLabel>Required?</McFieldLabel>
                <Select
                  className="mt-1"
                  value={c.required}
                  onChange={(e) =>
                    patch((p) => {
                      const next = [...p.integrations.customizations];
                      next[idx] = {
                        ...next[idx]!,
                        required: e.target.value as typeof c.required,
                      };
                      return {
                        ...p,
                        integrations: {
                          ...p.integrations,
                          customizations: next,
                        },
                      };
                    })
                  }
                >
                  <option value="unknown">Unknown</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
              </div>
              <div>
                <McFieldLabel>Owner</McFieldLabel>
                <Select
                  className="mt-1"
                  value={c.owner}
                  onChange={(e) =>
                    patch((p) => {
                      const next = [...p.integrations.customizations];
                      next[idx] = {
                        ...next[idx]!,
                        owner: e.target.value as typeof c.owner,
                      };
                      return {
                        ...p,
                        integrations: {
                          ...p.integrations,
                          customizations: next,
                        },
                      };
                    })
                  }
                >
                  <option value="not-sure">Not sure</option>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </Select>
              </div>
              <div>
                <McFieldLabel htmlFor={`cust-h-${c.id}`}>Hours</McFieldLabel>
                <RoiNumberInput
                  id={`cust-h-${c.id}`}
                  className="mt-1"
                  value={c.estimatedHours}
                  allowEmpty
                  onChange={(v) =>
                    patch((p) => {
                      const next = [...p.integrations.customizations];
                      next[idx] = { ...next[idx]!, estimatedHours: v };
                      return {
                        ...p,
                        integrations: {
                          ...p.integrations,
                          customizations: next,
                        },
                      };
                    })
                  }
                />
              </div>
              <TcoMoneyInput
                id={`cust-c-${c.id}`}
                label="Cost if known"
                currency={inputs.currency}
                valueMajor={toMajorOrNull(c.costMinor)}
                onChange={(major) =>
                  patch((p) => {
                    const next = [...p.integrations.customizations];
                    next[idx] = {
                      ...next[idx]!,
                      costMinor: fromMajorOrNull(major),
                    };
                    return {
                      ...p,
                      integrations: {
                        ...p.integrations,
                        customizations: next,
                      },
                    };
                  })
                }
              />
            </div>
          );
        })}
      </div>
    </McSection>
  );
}

export function McStepApproach({
  inputs,
  patch,
}: {
  inputs: McInputs;
  patch: Patch;
}) {
  const a = inputs.approach;
  return (
    <McSection
      title="Who will perform the migration?"
      description="Support fixed quotes and rate × effort. Do not invent partner rates — leave blank when unknown."
    >
      <McChoiceGrid
        legend="Performer"
        value={a.performer}
        onChange={(performer) =>
          patch((p) => ({
            ...p,
            approach: { ...p.approach, performer },
          }))
        }
        options={[
          { value: "internal", label: "Internal team" },
          { value: "crm-vendor", label: "CRM vendor" },
          { value: "implementation-partner", label: "Implementation partner" },
          { value: "data-specialist", label: "Data migration specialist" },
          { value: "hybrid", label: "Hybrid" },
          { value: "not-sure", label: "Not sure" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TcoMoneyInput
          id="impl-quote"
          label="External implementation quote"
          hint="May overlap with migration-specific quote — review scope carefully."
          currency={inputs.currency}
          valueMajor={toMajorOrNull(a.externalImplementationQuoteMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              approach: {
                ...p.approach,
                externalImplementationQuoteMinor: fromMajorOrNull(major),
              },
            }))
          }
        />
        <TcoMoneyInput
          id="mig-quote"
          label="Migration-specific quote"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(a.migrationSpecificQuoteMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              approach: {
                ...p.approach,
                migrationSpecificQuoteMinor: fromMajorOrNull(major),
              },
            }))
          }
        />
        <TcoMoneyInput
          id="day-rate"
          label="Partner day rate"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(a.partnerDayRateMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              approach: {
                ...p.approach,
                partnerDayRateMinor: fromMajorOrNull(major),
              },
            }))
          }
        />
        <div>
          <McFieldLabel htmlFor="est-days">Estimated days</McFieldLabel>
          <RoiNumberInput
            id="est-days"
            className="mt-1.5"
            value={a.estimatedDays}
            allowEmpty
            onChange={(v) =>
              patch((p) => ({
                ...p,
                approach: { ...p.approach, estimatedDays: v },
              }))
            }
          />
        </div>
        <TcoMoneyInput
          id="discovery"
          label="Discovery & planning (external)"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(a.discoveryPlanningMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              approach: {
                ...p.approach,
                discoveryPlanningMinor: fromMajorOrNull(major),
              },
            }))
          }
        />
        <TcoMoneyInput
          id="tooling-license"
          label="Tooling / license cost"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(a.toolingLicenseCostMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              approach: {
                ...p.approach,
                toolingLicenseCostMinor: fromMajorOrNull(major),
              },
            }))
          }
        />
      </div>

      <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
        Optional migration tooling
      </h3>
      <p className="text-xs text-[var(--sg-color-text-muted)]">
        ETL / iPaaS, migration utility, data quality tool, temporary storage —
        no product recommendations unless you name them.
      </p>
      <div className="space-y-2">
        {a.tooling.map((tool, idx) => (
          <div
            key={tool.id}
            className="grid gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 sm:grid-cols-4"
          >
            <div>
              <McFieldLabel htmlFor={`tool-n-${tool.id}`}>Tool</McFieldLabel>
              <Input
                id={`tool-n-${tool.id}`}
                className="mt-1"
                value={tool.tool}
                onChange={(e) =>
                  patch((p) => {
                    const next = [...p.approach.tooling];
                    next[idx] = { ...next[idx]!, tool: e.target.value };
                    return { ...p, approach: { ...p.approach, tooling: next } };
                  })
                }
              />
            </div>
            <TcoMoneyInput
              id={`tool-c-${tool.id}`}
              label="Cost"
              currency={inputs.currency}
              valueMajor={toMajorOrNull(tool.costMinor)}
              onChange={(major) =>
                patch((p) => {
                  const next = [...p.approach.tooling];
                  next[idx] = {
                    ...next[idx]!,
                    costMinor: fromMajorOrNull(major),
                  };
                  return { ...p, approach: { ...p.approach, tooling: next } };
                })
              }
            />
            <div>
              <McFieldLabel>Billing</McFieldLabel>
              <Select
                className="mt-1"
                value={tool.billing}
                onChange={(e) =>
                  patch((p) => {
                    const next = [...p.approach.tooling];
                    next[idx] = {
                      ...next[idx]!,
                      billing: e.target.value as typeof tool.billing,
                    };
                    return { ...p, approach: { ...p.approach, tooling: next } };
                  })
                }
              >
                <option value="one-time">One-time</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="unknown">Unknown</option>
              </Select>
            </div>
            <div>
              <McFieldLabel htmlFor={`tool-d-${tool.id}`}>
                Duration (months)
              </McFieldLabel>
              <RoiNumberInput
                id={`tool-d-${tool.id}`}
                className="mt-1"
                value={tool.durationMonths}
                allowEmpty
                onChange={(v) =>
                  patch((p) => {
                    const next = [...p.approach.tooling];
                    next[idx] = { ...next[idx]!, durationMonths: v };
                    return { ...p, approach: { ...p.approach, tooling: next } };
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          patch((p) => ({
            ...p,
            approach: {
              ...p.approach,
              tooling: [
                ...p.approach.tooling,
                {
                  id: `tool-${Date.now()}`,
                  tool: "Migration tool",
                  billing: "one-time",
                  include: true,
                },
              ],
            },
          }))
        }
      >
        Add tooling row
      </Button>

      <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
        Partner quote comparison (up to 3)
      </h3>
      <p className="text-xs text-[var(--sg-color-text-muted)]">
        We never declare the cheapest quote best — compare coverage differences.
      </p>
      <div className="space-y-3">
        {a.quotes.map((q, idx) => (
          <div
            key={q.id}
            className="space-y-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Input
                aria-label="Provider"
                placeholder="Provider"
                value={q.provider}
                onChange={(e) =>
                  patch((p) => {
                    const next = [...p.approach.quotes];
                    next[idx] = { ...next[idx]!, provider: e.target.value };
                    return { ...p, approach: { ...p.approach, quotes: next } };
                  })
                }
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={q.selected}
                  onChange={(e) =>
                    patch((p) => {
                      const next = p.approach.quotes.map((row, i) => ({
                        ...row,
                        selected: i === idx ? e.target.checked : false,
                      }));
                      return { ...p, approach: { ...p.approach, quotes: next } };
                    })
                  }
                />
                Use in estimate
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <TcoMoneyInput
                id={`q-fixed-${q.id}`}
                label="Fixed cost"
                currency={inputs.currency}
                valueMajor={toMajorOrNull(q.fixedCostMinor)}
                onChange={(major) =>
                  patch((p) => {
                    const next = [...p.approach.quotes];
                    next[idx] = {
                      ...next[idx]!,
                      fixedCostMinor: fromMajorOrNull(major),
                    };
                    return { ...p, approach: { ...p.approach, quotes: next } };
                  })
                }
              />
              <TcoMoneyInput
                id={`q-rate-${q.id}`}
                label="Day rate"
                currency={inputs.currency}
                valueMajor={toMajorOrNull(q.dayRateMinor)}
                onChange={(major) =>
                  patch((p) => {
                    const next = [...p.approach.quotes];
                    next[idx] = {
                      ...next[idx]!,
                      dayRateMinor: fromMajorOrNull(major),
                    };
                    return { ...p, approach: { ...p.approach, quotes: next } };
                  })
                }
              />
              <div>
                <McFieldLabel htmlFor={`q-days-${q.id}`}>Days</McFieldLabel>
                <RoiNumberInput
                  id={`q-days-${q.id}`}
                  className="mt-1"
                  value={q.estimatedDays}
                  allowEmpty
                  onChange={(v) =>
                    patch((p) => {
                      const next = [...p.approach.quotes];
                      next[idx] = { ...next[idx]!, estimatedDays: v };
                      return {
                        ...p,
                        approach: { ...p.approach, quotes: next },
                      };
                    })
                  }
                />
              </div>
            </div>
            <Input
              placeholder="Included scope"
              value={q.includedScope ?? ""}
              onChange={(e) =>
                patch((p) => {
                  const next = [...p.approach.quotes];
                  next[idx] = {
                    ...next[idx]!,
                    includedScope: e.target.value || undefined,
                  };
                  return { ...p, approach: { ...p.approach, quotes: next } };
                })
              }
            />
            <Input
              placeholder="Excluded scope"
              value={q.excludedScope ?? ""}
              onChange={(e) =>
                patch((p) => {
                  const next = [...p.approach.quotes];
                  next[idx] = {
                    ...next[idx]!,
                    excludedScope: e.target.value || undefined,
                  };
                  return { ...p, approach: { ...p.approach, quotes: next } };
                })
              }
            />
          </div>
        ))}
      </div>
      {a.quotes.length < 3 ? (
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            patch((p) => ({
              ...p,
              approach: {
                ...p.approach,
                quotes: [
                  ...p.approach.quotes,
                  {
                    id: `quote-${Date.now()}`,
                    provider: "",
                    selected: false,
                  },
                ],
              },
            }))
          }
        >
          Add partner quote
        </Button>
      ) : null}
    </McSection>
  );
}

export function McStepInternalEffort({
  inputs,
  patch,
}: {
  inputs: McInputs;
  patch: Patch;
}) {
  const roles: McInternalRoleRow[] =
    inputs.internalEffort.roles.length > 0
      ? inputs.internalEffort.roles
      : createDefaultInternalRoles();

  const categories: McEffortCategoryRow[] =
    inputs.internalEffort.categories.length > 0
      ? inputs.internalEffort.categories
      : createDefaultEffortCategories();

  return (
    <McSection
      title="How much internal effort will the migration require?"
      description="Enter loaded hourly cost or a total estimate. We never insert salaries automatically."
    >
      <div className="overflow-x-auto rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--sg-color-surface-muted)]/60 text-xs uppercase text-[var(--sg-color-text-muted)]">
            <tr>
              <th className="px-3 py-2">Include</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">People</th>
              <th className="px-3 py-2">Hours / person</th>
              <th className="px-3 py-2">Hourly cost</th>
              <th className="px-3 py-2">Or total cost</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, idx) => (
              <tr
                key={role.id}
                className="border-t border-[var(--sg-color-border)]"
              >
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={role.include}
                    aria-label={`Include ${role.label}`}
                    onChange={(e) =>
                      patch((p) => {
                        const next = [...p.internalEffort.roles];
                        next[idx] = {
                          ...next[idx]!,
                          include: e.target.checked,
                        };
                        return {
                          ...p,
                          internalEffort: { ...p.internalEffort, roles: next },
                        };
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2 font-medium">{role.label}</td>
                <td className="px-3 py-2">
                  <RoiNumberInput
                    id={`people-${role.id}`}
                    value={role.people || undefined}
                    allowEmpty
                    onChange={(v) =>
                      patch((p) => {
                        const next = [...p.internalEffort.roles];
                        next[idx] = { ...next[idx]!, people: v ?? 0 };
                        return {
                          ...p,
                          internalEffort: { ...p.internalEffort, roles: next },
                        };
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <RoiNumberInput
                    id={`hpp-${role.id}`}
                    value={role.hoursPerPerson || undefined}
                    allowEmpty
                    onChange={(v) =>
                      patch((p) => {
                        const next = [...p.internalEffort.roles];
                        next[idx] = {
                          ...next[idx]!,
                          hoursPerPerson: v ?? 0,
                        };
                        return {
                          ...p,
                          internalEffort: { ...p.internalEffort, roles: next },
                        };
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <TcoMoneyInput
                    id={`rate-${role.id}`}
                    label=""
                    currency={inputs.currency}
                    valueMajor={toMajorOrNull(role.hourlyCostMinor)}
                    onChange={(major) =>
                      patch((p) => {
                        const next = [...p.internalEffort.roles];
                        const val = fromMajorOrNull(major);
                        next[idx] = {
                          ...next[idx]!,
                          hourlyCostMinor:
                            val === null || val === undefined
                              ? undefined
                              : val,
                        };
                        return {
                          ...p,
                          internalEffort: { ...p.internalEffort, roles: next },
                        };
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <TcoMoneyInput
                    id={`tot-${role.id}`}
                    label=""
                    currency={inputs.currency}
                    valueMajor={toMajorOrNull(role.totalCostMinor)}
                    onChange={(major) =>
                      patch((p) => {
                        const next = [...p.internalEffort.roles];
                        next[idx] = {
                          ...next[idx]!,
                          totalCostMinor: fromMajorOrNull(major),
                        };
                        return {
                          ...p,
                          internalEffort: { ...p.internalEffort, roles: next },
                        };
                      })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
        Effort by category (optional hours)
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {categories.map((cat, idx) => {
          const meta = EFFORT_CATEGORIES.find((c) => c.id === cat.id);
          return (
            <div key={cat.id}>
              <McFieldLabel htmlFor={`cat-${cat.id}`}>
                {meta?.label ?? cat.id}
              </McFieldLabel>
              <RoiNumberInput
                id={`cat-${cat.id}`}
                className="mt-1"
                value={cat.hours}
                allowEmpty
                onChange={(v) =>
                  patch((p) => {
                    const next = [...p.internalEffort.categories];
                    next[idx] = { ...next[idx]!, hours: v };
                    return {
                      ...p,
                      internalEffort: {
                        ...p.internalEffort,
                        categories: next,
                      },
                    };
                  })
                }
              />
            </div>
          );
        })}
      </div>
    </McSection>
  );
}

export function McStepTestingCutover({
  inputs,
  patch,
}: {
  inputs: McInputs;
  patch: Patch;
}) {
  const t = inputs.testingCutover;
  return (
    <McSection
      title="How thoroughly will the migration be tested?"
      description="Serious migrations often need multiple test cycles. Contingency is optional — we never silently default to a large percentage."
    >
      <McChoiceGrid
        legend="Number of test migrations"
        value={t.testing.testMigrationCount}
        onChange={(testMigrationCount) =>
          patch((p) => ({
            ...p,
            testingCutover: {
              ...p.testingCutover,
              testing: { ...p.testingCutover.testing, testMigrationCount },
            },
          }))
        }
        options={[
          { value: "0", label: "0" },
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3-plus", label: "3+" },
        ]}
      />

      <div className="flex flex-wrap gap-4 text-sm">
        {(
          [
            ["fullReconciliation", "Full reconciliation"],
            ["sampleValidationOnly", "Sample validation only"],
            ["businessUat", "Business UAT"],
            ["technicalValidation", "Technical validation"],
            ["securityValidation", "Security validation"],
            ["integrationRegression", "Integration regression"],
            ["reportingValidation", "Reporting validation"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={t.testing[key]}
              onChange={(e) =>
                patch((p) => ({
                  ...p,
                  testingCutover: {
                    ...p.testingCutover,
                    testing: {
                      ...p.testingCutover.testing,
                      [key]: e.target.checked,
                    },
                  },
                }))
              }
            />
            {label}
          </label>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
        Test cycle costs
      </h3>
      <div className="space-y-2">
        {t.testing.cycles.map((cycle, idx) => (
          <div
            key={cycle.id}
            className="grid gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 sm:grid-cols-4"
          >
            <p className="text-sm font-medium sm:col-span-4">{cycle.label}</p>
            <div>
              <McFieldLabel htmlFor={`tc-h-${cycle.id}`}>Hours</McFieldLabel>
              <RoiNumberInput
                id={`tc-h-${cycle.id}`}
                className="mt-1"
                value={cycle.hours}
                allowEmpty
                onChange={(v) =>
                  patch((p) => {
                    const next = [...p.testingCutover.testing.cycles];
                    next[idx] = { ...next[idx]!, hours: v };
                    return {
                      ...p,
                      testingCutover: {
                        ...p.testingCutover,
                        testing: {
                          ...p.testingCutover.testing,
                          cycles: next,
                        },
                      },
                    };
                  })
                }
              />
            </div>
            <TcoMoneyInput
              id={`tc-p-${cycle.id}`}
              label="Partner cost"
              currency={inputs.currency}
              valueMajor={toMajorOrNull(cycle.partnerCostMinor)}
              onChange={(major) =>
                patch((p) => {
                  const next = [...p.testingCutover.testing.cycles];
                  next[idx] = {
                    ...next[idx]!,
                    partnerCostMinor: fromMajorOrNull(major),
                  };
                  return {
                    ...p,
                    testingCutover: {
                      ...p.testingCutover,
                      testing: {
                        ...p.testingCutover.testing,
                        cycles: next,
                      },
                    },
                  };
                })
              }
            />
            <TcoMoneyInput
              id={`tc-t-${cycle.id}`}
              label="Tool cost"
              currency={inputs.currency}
              valueMajor={toMajorOrNull(cycle.toolCostMinor)}
              onChange={(major) =>
                patch((p) => {
                  const next = [...p.testingCutover.testing.cycles];
                  next[idx] = {
                    ...next[idx]!,
                    toolCostMinor: fromMajorOrNull(major),
                  };
                  return {
                    ...p,
                    testingCutover: {
                      ...p.testingCutover,
                      testing: {
                        ...p.testingCutover.testing,
                        cycles: next,
                      },
                    },
                  };
                })
              }
            />
          </div>
        ))}
      </div>

      <McChoiceGrid
        legend="Cutover model"
        value={t.cutover.model}
        onChange={(model) =>
          patch((p) => ({
            ...p,
            testingCutover: {
              ...p.testingCutover,
              cutover: { ...p.testingCutover.cutover, model },
            },
          }))
        }
        options={[
          { value: "weekend", label: "Weekend" },
          { value: "business-hours", label: "Business hours" },
          { value: "phased", label: "Phased" },
          { value: "parallel", label: "Parallel" },
          { value: "unknown", label: "Unknown" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <TcoMoneyInput
          id="cut-ot"
          label="Overtime"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(t.cutover.overtimeCostMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              testingCutover: {
                ...p.testingCutover,
                cutover: {
                  ...p.testingCutover.cutover,
                  overtimeCostMinor: fromMajorOrNull(major),
                },
              },
            }))
          }
        />
        <TcoMoneyInput
          id="cut-partner"
          label="Partner coverage"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(t.cutover.partnerCoverageMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              testingCutover: {
                ...p.testingCutover,
                cutover: {
                  ...p.testingCutover.cutover,
                  partnerCoverageMinor: fromMajorOrNull(major),
                },
              },
            }))
          }
        />
        <TcoMoneyInput
          id="cut-support"
          label="Additional support"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(t.cutover.additionalSupportMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              testingCutover: {
                ...p.testingCutover,
                cutover: {
                  ...p.testingCutover.cutover,
                  additionalSupportMinor: fromMajorOrNull(major),
                },
              },
            }))
          }
        />
      </div>

      <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
        Hypercare
      </h3>
      <McChoiceGrid
        legend="Post-go-live support period"
        value={t.hypercare.period}
        onChange={(period) =>
          patch((p) => ({
            ...p,
            testingCutover: {
              ...p.testingCutover,
              hypercare: { ...p.testingCutover.hypercare, period },
            },
          }))
        }
        options={[
          { value: "none", label: "None" },
          { value: "1-week", label: "1 week" },
          { value: "2-weeks", label: "2 weeks" },
          { value: "4-weeks", label: "4 weeks" },
          { value: "custom", label: "Custom" },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TcoMoneyInput
          id="hc-ext"
          label="External hypercare cost"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(t.hypercare.externalSupportCostMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              testingCutover: {
                ...p.testingCutover,
                hypercare: {
                  ...p.testingCutover.hypercare,
                  externalSupportCostMinor: fromMajorOrNull(major),
                },
              },
            }))
          }
        />
        <TcoMoneyInput
          id="hc-rem"
          label="Data remediation allowance"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(t.hypercare.remediationAllowanceMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              testingCutover: {
                ...p.testingCutover,
                hypercare: {
                  ...p.testingCutover.hypercare,
                  remediationAllowanceMinor: fromMajorOrNull(major),
                },
              },
            }))
          }
        />
        <div>
          <McFieldLabel htmlFor="hc-hours">Internal support hours</McFieldLabel>
          <RoiNumberInput
            id="hc-hours"
            className="mt-1.5"
            value={t.hypercare.internalSupportHours}
            allowEmpty
            onChange={(v) =>
              patch((p) => ({
                ...p,
                testingCutover: {
                  ...p.testingCutover,
                  hypercare: {
                    ...p.testingCutover.hypercare,
                    internalSupportHours: v,
                  },
                },
              }))
            }
          />
        </div>
        <TcoMoneyInput
          id="hc-rate"
          label="Internal hourly cost"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(t.hypercare.internalHourlyCostMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              testingCutover: {
                ...p.testingCutover,
                hypercare: {
                  ...p.testingCutover.hypercare,
                  internalHourlyCostMinor:
                    fromMajorOrNull(major) === null ||
                    fromMajorOrNull(major) === undefined
                      ? undefined
                      : (fromMajorOrNull(major) as number),
                },
              },
            }))
          }
        />
      </div>

      <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
        Training
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <McFieldLabel htmlFor="train-users">Users to train</McFieldLabel>
          <RoiNumberInput
            id="train-users"
            className="mt-1.5"
            value={t.training.usersToTrain}
            allowEmpty
            onChange={(v) =>
              patch((p) => ({
                ...p,
                testingCutover: {
                  ...p.testingCutover,
                  training: {
                    ...p.testingCutover.training,
                    usersToTrain: v,
                  },
                },
              }))
            }
          />
        </div>
        <div>
          <McFieldLabel>Classify training cost as</McFieldLabel>
          <Select
            className="mt-1.5"
            value={t.training.classification}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                testingCutover: {
                  ...p.testingCutover,
                  training: {
                    ...p.testingCutover.training,
                    classification: e.target
                      .value as typeof t.training.classification,
                  },
                },
              }))
            }
          >
            <option value="migration">Include in migration cost</option>
            <option value="implementation">
              Implementation cost (exclude here)
            </option>
          </Select>
        </div>
        <TcoMoneyInput
          id="train-cost"
          label="Training cost"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(t.training.trainingCostMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              testingCutover: {
                ...p.testingCutover,
                training: {
                  ...p.testingCutover.training,
                  trainingCostMinor: fromMajorOrNull(major),
                },
              },
            }))
          }
        />
        <div>
          <McFieldLabel htmlFor="train-hours">Internal hours</McFieldLabel>
          <RoiNumberInput
            id="train-hours"
            className="mt-1.5"
            value={t.training.internalHours}
            allowEmpty
            onChange={(v) =>
              patch((p) => ({
                ...p,
                testingCutover: {
                  ...p.testingCutover,
                  training: {
                    ...p.testingCutover.training,
                    internalHours: v,
                  },
                },
              }))
            }
          />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
        Contingency
      </h3>
      <p className="text-xs text-[var(--sg-color-text-muted)]">
        Migration projects often uncover hidden data or integration issues. A
        contingency helps model uncertainty rather than pretending the base
        estimate is exact.
      </p>
      <McChoiceGrid
        legend="Contingency %"
        value={String(t.contingency.percent) as "0" | "5" | "10" | "15" | "20"}
        onChange={(v) =>
          patch((p) => ({
            ...p,
            testingCutover: {
              ...p.testingCutover,
              contingency: {
                ...p.testingCutover.contingency,
                percent: Number(v) as 0 | 5 | 10 | 15 | 20,
                customPercent: undefined,
              },
            },
          }))
        }
        options={[
          { value: "0", label: "0%" },
          { value: "5", label: "5%" },
          { value: "10", label: "10%" },
          { value: "15", label: "15%" },
          { value: "20", label: "20%" },
        ]}
      />
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={t.contingency.applyToExternal}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                testingCutover: {
                  ...p.testingCutover,
                  contingency: {
                    ...p.testingCutover.contingency,
                    applyToExternal: e.target.checked,
                  },
                },
              }))
            }
          />
          Apply to external services
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={t.contingency.applyToInternal}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                testingCutover: {
                  ...p.testingCutover,
                  contingency: {
                    ...p.testingCutover.contingency,
                    applyToInternal: e.target.checked,
                  },
                },
              }))
            }
          />
          Apply to internal effort
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={t.contingency.applyToTooling}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                testingCutover: {
                  ...p.testingCutover,
                  contingency: {
                    ...p.testingCutover.contingency,
                    applyToTooling: e.target.checked,
                  },
                },
              }))
            }
          />
          Apply to tooling
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={t.contingency.excludeFixedLicenses}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                testingCutover: {
                  ...p.testingCutover,
                  contingency: {
                    ...p.testingCutover.contingency,
                    excludeFixedLicenses: e.target.checked,
                  },
                },
              }))
            }
          />
          Exclude fixed license amounts
        </label>
      </div>

      <div className="rounded-[var(--sg-radius-md)] border border-dashed border-[var(--sg-color-border)] p-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={t.downtime.include}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                testingCutover: {
                  ...p.testingCutover,
                  downtime: {
                    ...p.testingCutover.downtime,
                    include: e.target.checked,
                  },
                },
              }))
            }
          />
          Optional: model business interruption (scenario — not in base total)
        </label>
        {t.downtime.include ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <McFieldLabel htmlFor="dt-hours">Hours</McFieldLabel>
              <RoiNumberInput
                id="dt-hours"
                className="mt-1"
                value={t.downtime.hours}
                allowEmpty
                onChange={(v) =>
                  patch((p) => ({
                    ...p,
                    testingCutover: {
                      ...p.testingCutover,
                      downtime: {
                        ...p.testingCutover.downtime,
                        hours: v,
                      },
                    },
                  }))
                }
              />
            </div>
            <div>
              <McFieldLabel htmlFor="dt-users">Affected users</McFieldLabel>
              <RoiNumberInput
                id="dt-users"
                className="mt-1"
                value={t.downtime.affectedUsers}
                allowEmpty
                onChange={(v) =>
                  patch((p) => ({
                    ...p,
                    testingCutover: {
                      ...p.testingCutover,
                      downtime: {
                        ...p.testingCutover.downtime,
                        affectedUsers: v,
                      },
                    },
                  }))
                }
              />
            </div>
            <TcoMoneyInput
              id="dt-impact"
              label="Hourly business impact / user"
              currency={inputs.currency}
              valueMajor={toMajorOrNull(t.downtime.hourlyBusinessImpactMinor)}
              onChange={(major) =>
                patch((p) => ({
                  ...p,
                  testingCutover: {
                    ...p.testingCutover,
                    downtime: {
                      ...p.testingCutover.downtime,
                      hourlyBusinessImpactMinor: fromMajorOrNull(major),
                    },
                  },
                }))
              }
            />
          </div>
        ) : null}
      </div>
    </McSection>
  );
}
