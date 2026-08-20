"use client";

import type { CurrencyCode, RoiInputs } from "@/domain";
import { fromMajor, toMajor } from "@/domain";
import { TcoMoneyInput } from "@/components/tco/tco-money-input";
import { Alert } from "@/components/ui/alert";
import { Field, Input, Select } from "@/components/ui/forms";
import { RoiConfidenceDot, RoiTypeBadge } from "./roi-badges";
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

export function RoiStepCostRevenue({
  inputs,
  patch,
}: {
  inputs: RoiInputs;
  patch: Patch;
}) {
  const cr = inputs.costRevenue;
  const currency = inputs.currency;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          What costs could the CRM eliminate or reduce?
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Label each saving as verified, estimated, or scenario. Tool
          consolidation is usually stronger evidence than revenue uplift.
        </p>
      </div>

      <div className="space-y-3">
        {cr.costAvoidance.map((row) => (
          <div
            key={row.id}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={row.included}
                  onChange={(e) =>
                    patch((p) => ({
                      ...p,
                      costRevenue: {
                        ...p.costRevenue,
                        costAvoidance: p.costRevenue.costAvoidance.map((r) =>
                          r.id === row.id
                            ? { ...r, included: e.target.checked }
                            : r,
                        ),
                      },
                    }))
                  }
                />
                {row.label}
              </label>
              <div className="flex items-center gap-2">
                <RoiTypeBadge type={row.assumptionType} />
                <RoiConfidenceDot confidence={row.confidence} />
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <TcoMoneyInput
                id={`avoid-${row.id}`}
                label="Current annual cost"
                currency={currency}
                valueMajor={majorOf(row.currentAnnualMinor)}
                onChange={(v) =>
                  patch((p) => ({
                    ...p,
                    costRevenue: {
                      ...p.costRevenue,
                      costAvoidance: p.costRevenue.costAvoidance.map((r) =>
                        r.id === row.id
                          ? { ...r, currentAnnualMinor: toMinor(v, currency) }
                          : r,
                      ),
                    },
                  }))
                }
              />
              <Field label="Expected elimination %" htmlFor={`elim-${row.id}`}>
                <RoiNumberInput
                  id={`elim-${row.id}`}
                  min={0}
                  max={100}
                  step={1}
                  value={row.eliminationPercent}
                  onChange={(n) =>
                    patch((p) => ({
                      ...p,
                      costRevenue: {
                        ...p.costRevenue,
                        costAvoidance: p.costRevenue.costAvoidance.map((r) =>
                          r.id === row.id
                            ? { ...r, eliminationPercent: n ?? 0 }
                            : r,
                        ),
                      },
                    }))
                  }
                />
              </Field>
              <Field label="Type" htmlFor={`type-${row.id}`}>
                <Select
                  id={`type-${row.id}`}
                  value={row.assumptionType}
                  onChange={(e) =>
                    patch((p) => ({
                      ...p,
                      costRevenue: {
                        ...p.costRevenue,
                        costAvoidance: p.costRevenue.costAvoidance.map((r) =>
                          r.id === row.id
                            ? {
                                ...r,
                                assumptionType: e.target
                                  .value as typeof row.assumptionType,
                              }
                            : r,
                        ),
                      },
                    }))
                  }
                >
                  <option value="verified">Verified</option>
                  <option value="estimated">Estimated</option>
                  <option value="scenario">Scenario</option>
                </Select>
              </Field>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[var(--sg-radius-xl)] border border-violet-200 bg-violet-50/40 p-4 sm:p-5">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          Model potential revenue impact (optional)
        </h3>
        <Alert variant="warning" title="CRM does not automatically increase revenue" className="mt-3">
          Use this section only if you have a defensible business assumption.
          Prefer contribution / gross profit over revenue for financial ROI.
          Defaults stay blank — we never invent uplift percentages.
        </Alert>

        <label className="mt-4 flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={cr.winRate.enabled}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                costRevenue: {
                  ...p.costRevenue,
                  winRate: {
                    ...p.costRevenue.winRate,
                    enabled: e.target.checked,
                    included: e.target.checked,
                  },
                },
              }))
            }
          />
          Win-rate scenario
        </label>
        {cr.winRate.enabled ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Annual qualified opportunities" htmlFor="wr-opps">
              <RoiNumberInput
                id="wr-opps"
                min={0}
                step={1}
                allowEmpty
                value={cr.winRate.annualQualifiedOpportunities}
                onChange={(n) =>
                  patch((p) => ({
                    ...p,
                    costRevenue: {
                      ...p.costRevenue,
                      winRate: {
                        ...p.costRevenue.winRate,
                        annualQualifiedOpportunities: n,
                      },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Current win rate %" htmlFor="wr-cur">
              <RoiNumberInput
                id="wr-cur"
                min={0}
                max={100}
                step={1}
                allowEmpty
                value={cr.winRate.currentWinRatePercent}
                onChange={(n) =>
                  patch((p) => ({
                    ...p,
                    costRevenue: {
                      ...p.costRevenue,
                      winRate: {
                        ...p.costRevenue.winRate,
                        currentWinRatePercent: n,
                      },
                    },
                  }))
                }
              />
            </Field>
            <Field
              label="Scenario win rate %"
              htmlFor="wr-sc"
              hint="Change is measured in percentage points, not relative %"
            >
              <RoiNumberInput
                id="wr-sc"
                min={0}
                max={100}
                step={1}
                allowEmpty
                value={cr.winRate.scenarioWinRatePercent}
                onChange={(n) =>
                  patch((p) => ({
                    ...p,
                    costRevenue: {
                      ...p.costRevenue,
                      winRate: {
                        ...p.costRevenue.winRate,
                        scenarioWinRatePercent: n,
                      },
                    },
                  }))
                }
              />
            </Field>
            <TcoMoneyInput
              id="wr-contrib"
              label="Contribution / profit per won deal"
              currency={currency}
              allowUnknown={false}
              valueMajor={majorOf(cr.winRate.contributionPerWinMinor)}
              onChange={(v) =>
                patch((p) => ({
                  ...p,
                  costRevenue: {
                    ...p.costRevenue,
                    winRate: {
                      ...p.costRevenue.winRate,
                      contributionPerWinMinor:
                        toMinor(v, currency) ?? undefined,
                    },
                  },
                }))
              }
            />
            <Field label="Value basis" htmlFor="wr-basis">
              <Select
                id="wr-basis"
                value={cr.winRate.valueBasis}
                onChange={(e) =>
                  patch((p) => ({
                    ...p,
                    costRevenue: {
                      ...p.costRevenue,
                      winRate: {
                        ...p.costRevenue.winRate,
                        valueBasis: e.target
                          .value as typeof cr.winRate.valueBasis,
                      },
                    },
                  }))
                }
              >
                <option value="contribution">Gross profit / contribution (recommended)</option>
                <option value="revenue">Revenue (not equivalent to profit)</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            {cr.winRate.valueBasis === "revenue" ? (
              <Alert variant="warning" title="Revenue impact">
                Revenue impact is not equivalent to profit. Prefer contribution
                where available.
              </Alert>
            ) : null}
          </div>
        ) : null}

        <label className="mt-5 flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={cr.conversion.enabled}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                costRevenue: {
                  ...p.costRevenue,
                  conversion: {
                    ...p.costRevenue.conversion,
                    enabled: e.target.checked,
                    included: e.target.checked,
                  },
                },
              }))
            }
          />
          Lead conversion scenario
        </label>
        {cr.conversion.enabled ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Leads / year" htmlFor="cv-leads">
              <RoiNumberInput
                id="cv-leads"
                min={0}
                step={1}
                allowEmpty
                value={cr.conversion.leadsPerYear}
                onChange={(n) =>
                  patch((p) => ({
                    ...p,
                    costRevenue: {
                      ...p.costRevenue,
                      conversion: {
                        ...p.costRevenue.conversion,
                        leadsPerYear: n,
                      },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Current conversion %" htmlFor="cv-cur">
              <RoiNumberInput
                id="cv-cur"
                min={0}
                max={100}
                step={1}
                allowEmpty
                value={cr.conversion.currentConversionPercent}
                onChange={(n) =>
                  patch((p) => ({
                    ...p,
                    costRevenue: {
                      ...p.costRevenue,
                      conversion: {
                        ...p.costRevenue.conversion,
                        currentConversionPercent: n,
                      },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Scenario conversion %" htmlFor="cv-sc">
              <RoiNumberInput
                id="cv-sc"
                min={0}
                max={100}
                step={1}
                allowEmpty
                value={cr.conversion.scenarioConversionPercent}
                onChange={(n) =>
                  patch((p) => ({
                    ...p,
                    costRevenue: {
                      ...p.costRevenue,
                      conversion: {
                        ...p.costRevenue.conversion,
                        scenarioConversionPercent: n,
                      },
                    },
                  }))
                }
              />
            </Field>
            <TcoMoneyInput
              id="cv-contrib"
              label="Contribution per resulting deal"
              currency={currency}
              allowUnknown={false}
              valueMajor={majorOf(cr.conversion.contributionPerDealMinor)}
              onChange={(v) =>
                patch((p) => ({
                  ...p,
                  costRevenue: {
                    ...p.costRevenue,
                    conversion: {
                      ...p.costRevenue.conversion,
                      contributionPerDealMinor:
                        toMinor(v, currency) ?? undefined,
                    },
                  },
                }))
              }
            />
          </div>
        ) : null}

        <label className="mt-5 flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={cr.recovered.enabled}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                costRevenue: {
                  ...p.costRevenue,
                  recovered: {
                    ...p.costRevenue.recovered,
                    enabled: e.target.checked,
                    included: e.target.checked,
                  },
                },
              }))
            }
          />
          Recovered opportunities (scenario)
        </label>
        {cr.recovered.enabled ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Field label="Opportunities recovered" htmlFor="rec-n">
              <RoiNumberInput
                id="rec-n"
                min={0}
                step={1}
                allowEmpty
                value={cr.recovered.opportunitiesRecovered}
                onChange={(n) =>
                  patch((p) => ({
                    ...p,
                    costRevenue: {
                      ...p.costRevenue,
                      recovered: {
                        ...p.costRevenue.recovered,
                        opportunitiesRecovered: n,
                      },
                    },
                  }))
                }
              />
            </Field>
            <TcoMoneyInput
              id="rec-v"
              label="Contribution per opportunity"
              currency={currency}
              allowUnknown={false}
              valueMajor={majorOf(cr.recovered.contributionPerOpportunityMinor)}
              onChange={(v) =>
                patch((p) => ({
                  ...p,
                  costRevenue: {
                    ...p.costRevenue,
                    recovered: {
                      ...p.costRevenue.recovered,
                      contributionPerOpportunityMinor:
                        toMinor(v, currency) ?? undefined,
                    },
                  },
                }))
              }
            />
            <Field label="Win probability %" htmlFor="rec-p">
              <RoiNumberInput
                id="rec-p"
                min={0}
                max={100}
                step={1}
                allowEmpty
                value={cr.recovered.winProbabilityPercent}
                onChange={(n) =>
                  patch((p) => ({
                    ...p,
                    costRevenue: {
                      ...p.costRevenue,
                      recovered: {
                        ...p.costRevenue.recovered,
                        winProbabilityPercent: n,
                      },
                    },
                  }))
                }
              />
            </Field>
          </div>
        ) : null}

        <label className="mt-5 flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={cr.capacity.enabled}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                costRevenue: {
                  ...p.costRevenue,
                  capacity: {
                    ...p.costRevenue.capacity,
                    enabled: e.target.checked,
                    included: e.target.checked,
                  },
                },
              }))
            }
          />
          Capacity / faster cash (explicit assumption required)
        </label>
        {cr.capacity.enabled ? (
          <div className="mt-3 space-y-3">
            <Alert variant="info" title="Do not auto-convert cycle time to revenue">
              Enter only an explicit additional annual contribution you can
              defend. Shorter cycle alone is not counted as benefit.
            </Alert>
            <TcoMoneyInput
              id="cap-v"
              label="Additional annual contribution"
              currency={currency}
              allowUnknown={false}
              valueMajor={majorOf(cr.capacity.additionalAnnualContributionMinor)}
              onChange={(v) =>
                patch((p) => ({
                  ...p,
                  costRevenue: {
                    ...p.costRevenue,
                    capacity: {
                      ...p.costRevenue.capacity,
                      additionalAnnualContributionMinor:
                        toMinor(v, currency) ?? undefined,
                    },
                  },
                }))
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function RoiStepAssumptions({
  inputs,
  patch,
  assumptionRows,
}: {
  inputs: RoiInputs;
  patch: Patch;
  assumptionRows: Array<{
    id: string;
    label: string;
    valueLabel: string;
    assumptionType: "verified" | "estimated" | "scenario" | "unknown";
    confidence: "high" | "medium" | "low";
    included: boolean;
  }>;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          Review assumptions before results
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Make uncertainty visible. Toggle inclusion, type, and confidence —
          this is not a fake statistical probability score.
        </p>
      </div>

      <div className="overflow-x-auto rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)]">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 text-[var(--sg-color-text-muted)]">
              <th className="px-3 py-2 font-medium">Assumption</th>
              <th className="px-3 py-2 font-medium">Value</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Confidence</th>
              <th className="px-3 py-2 font-medium">In ROI?</th>
            </tr>
          </thead>
          <tbody>
            {assumptionRows.map((a) => (
              <tr
                key={a.id}
                className="border-b border-[var(--sg-color-border)]/60"
              >
                <td className="px-3 py-2.5">{a.label}</td>
                <td className="px-3 py-2.5 tabular-nums">{a.valueLabel}</td>
                <td className="px-3 py-2.5">
                  <Select
                    aria-label={`${a.label} type`}
                    value={
                      inputs.assumptionOverrides.find((o) => o.id === a.id)
                        ?.assumptionType ?? a.assumptionType
                    }
                    onChange={(e) =>
                      patch((p) => {
                        const rest = p.assumptionOverrides.filter(
                          (o) => o.id !== a.id,
                        );
                        return {
                          ...p,
                          assumptionOverrides: [
                            ...rest,
                            {
                              id: a.id,
                              assumptionType: e.target
                                .value as typeof a.assumptionType,
                              included:
                                inputs.assumptionOverrides.find(
                                  (o) => o.id === a.id,
                                )?.included ?? a.included,
                              confidence:
                                inputs.assumptionOverrides.find(
                                  (o) => o.id === a.id,
                                )?.confidence ?? a.confidence,
                            },
                          ],
                        };
                      })
                    }
                  >
                    <option value="verified">Verified</option>
                    <option value="estimated">Estimated</option>
                    <option value="scenario">Scenario</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                </td>
                <td className="px-3 py-2.5">
                  <Select
                    aria-label={`${a.label} confidence`}
                    value={
                      inputs.assumptionOverrides.find((o) => o.id === a.id)
                        ?.confidence ?? a.confidence
                    }
                    onChange={(e) =>
                      patch((p) => {
                        const rest = p.assumptionOverrides.filter(
                          (o) => o.id !== a.id,
                        );
                        const prev = p.assumptionOverrides.find(
                          (o) => o.id === a.id,
                        );
                        return {
                          ...p,
                          assumptionOverrides: [
                            ...rest,
                            {
                              id: a.id,
                              confidence: e.target
                                .value as typeof a.confidence,
                              assumptionType:
                                prev?.assumptionType ?? a.assumptionType,
                              included: prev?.included ?? a.included,
                            },
                          ],
                        };
                      })
                    }
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </td>
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    aria-label={`Include ${a.label}`}
                    checked={
                      inputs.assumptionOverrides.find((o) => o.id === a.id)
                        ?.included ?? a.included
                    }
                    onChange={(e) =>
                      patch((p) => {
                        const rest = p.assumptionOverrides.filter(
                          (o) => o.id !== a.id,
                        );
                        const prev = p.assumptionOverrides.find(
                          (o) => o.id === a.id,
                        );
                        return {
                          ...p,
                          assumptionOverrides: [
                            ...rest,
                            {
                              id: a.id,
                              included: e.target.checked,
                              assumptionType:
                                prev?.assumptionType ?? a.assumptionType,
                              confidence: prev?.confidence ?? a.confidence,
                            },
                          ],
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

      <div className="space-y-4 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] p-4">
        <h3 className="text-sm font-semibold">Adoption / realization ramp (optional)</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inputs.adoption.enabled}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                adoption: { ...p.adoption, enabled: e.target.checked },
              }))
            }
          />
          Scale benefits by year (do not assume day-one full realization)
        </label>
        {inputs.adoption.enabled ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                ["year1Percent", "Year 1 %"],
                ["year2Percent", "Year 2 %"],
                ["year3Percent", "Year 3 %"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label} htmlFor={key}>
                <RoiNumberInput
                  id={key}
                  min={0}
                  max={100}
                  step={1}
                  value={inputs.adoption[key]}
                  onChange={(n) =>
                    patch((p) => ({
                      ...p,
                      adoption: {
                        ...p.adoption,
                        [key]: n ?? 0,
                      },
                    }))
                  }
                />
              </Field>
            ))}
          </div>
        ) : null}
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={inputs.allowProvisional}
          onChange={(e) =>
            patch((p) => ({ ...p, allowProvisional: e.target.checked }))
          }
        />
        <span>
          Allow provisional ROI when material costs remain unknown (results will
          be clearly labeled provisional).
        </span>
      </label>

      <Field label="Analysis name" htmlFor="analysis-name">
        <Input
          id="analysis-name"
          value={inputs.analysisName}
          onChange={(e) =>
            patch((p) => ({ ...p, analysisName: e.target.value || "My CRM ROI" }))
          }
        />
      </Field>

      <Field label="Currency" htmlFor="currency" hint="No live FX conversion — keep one currency">
        <Select
          id="currency"
          value={inputs.currency}
          onChange={(e) =>
            patch((p) => ({
              ...p,
              currency: e.target.value as RoiInputs["currency"],
            }))
          }
        >
          <option value="EUR">EUR (€)</option>
          <option value="USD">USD ($)</option>
          <option value="GBP">GBP (£)</option>
        </Select>
      </Field>
    </div>
  );
}
