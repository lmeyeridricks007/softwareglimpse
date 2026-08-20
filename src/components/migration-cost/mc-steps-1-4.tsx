"use client";

import type {
  McDataObjectRow,
  McDataQualityIssue,
  McInputs,
  McMigrationType,
  McSourceType,
} from "@/domain";
import {
  DATA_QUALITY_ISSUES,
  createDefaultDataObjects,
  createDefaultDataQualityIssues,
} from "@/domain";
import { historicalActivityImpact, mappingComplexityBand } from "@/services/migration-cost";
import { TcoMoneyInput } from "@/components/tco/tco-money-input";
import { RoiNumberInput } from "@/components/roi/roi-number-input";
import { Input, Select } from "@/components/ui/forms";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  McChoiceGrid,
  McFieldLabel,
  McSection,
  fromMajorOrNull,
  toMajorOrNull,
} from "./mc-helpers";

type Patch = (updater: (prev: McInputs) => McInputs) => void;

const CRM_PLATFORMS = [
  "HubSpot",
  "Salesforce",
  "Pipedrive",
  "Zoho CRM",
  "Dynamics 365",
  "Freshsales",
  "Other",
];

export function McStepCurrentSystem({
  inputs,
  patch,
}: {
  inputs: McInputs;
  patch: Patch;
}) {
  const cs = inputs.currentSystem;
  return (
    <McSection
      title="What are you migrating from?"
      description="Capture the source, target and migration style. Migration type only guides defaults — it is never used as the sole cost driver."
    >
      <McChoiceGrid<McSourceType>
        legend="Current system"
        value={cs.sourceType}
        onChange={(sourceType) =>
          patch((p) => ({
            ...p,
            currentSystem: { ...p.currentSystem, sourceType },
          }))
        }
        options={[
          { value: "existing-crm", label: "Existing CRM" },
          { value: "spreadsheets", label: "Spreadsheets" },
          { value: "multiple-systems", label: "Multiple systems" },
          { value: "legacy-database", label: "Legacy database" },
          { value: "combination", label: "Combination" },
          { value: "other", label: "Other" },
        ]}
      />

      {cs.sourceType === "existing-crm" || cs.sourceType === "combination" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <McFieldLabel htmlFor="current-platform">Current platform</McFieldLabel>
            <Select
              id="current-platform"
              className="mt-1.5"
              value={cs.currentPlatform ?? ""}
              onChange={(e) =>
                patch((p) => ({
                  ...p,
                  currentSystem: {
                    ...p.currentSystem,
                    currentPlatform: e.target.value || undefined,
                  },
                }))
              }
            >
              <option value="">Select if known</option>
              {CRM_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>
          {cs.currentPlatform === "Other" ? (
            <div>
              <McFieldLabel htmlFor="current-other">Other platform</McFieldLabel>
              <Input
                id="current-other"
                className="mt-1.5"
                value={cs.currentPlatformOther ?? ""}
                onChange={(e) =>
                  patch((p) => ({
                    ...p,
                    currentSystem: {
                      ...p.currentSystem,
                      currentPlatformOther: e.target.value,
                    },
                  }))
                }
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <McFieldLabel htmlFor="target-crm">Target CRM (optional)</McFieldLabel>
          <Select
            id="target-crm"
            className="mt-1.5"
            value={cs.targetCrm ?? ""}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                currentSystem: {
                  ...p.currentSystem,
                  targetCrm: e.target.value || undefined,
                },
              }))
            }
          >
            <option value="">Select if known</option>
            {CRM_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <McFieldLabel htmlFor="project-name">Project name</McFieldLabel>
          <Input
            id="project-name"
            className="mt-1.5"
            value={cs.projectName}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                currentSystem: {
                  ...p.currentSystem,
                  projectName: e.target.value || "CRM Migration Estimate",
                },
              }))
            }
          />
        </div>
        <div>
          <McFieldLabel htmlFor="project-owner">Project owner</McFieldLabel>
          <Input
            id="project-owner"
            className="mt-1.5"
            value={cs.projectOwner ?? ""}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                currentSystem: {
                  ...p.currentSystem,
                  projectOwner: e.target.value || undefined,
                },
              }))
            }
          />
        </div>
        <div>
          <McFieldLabel htmlFor="currency">Currency</McFieldLabel>
          <Select
            id="currency"
            className="mt-1.5"
            value={inputs.currency}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                currency: e.target.value as McInputs["currency"],
              }))
            }
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </Select>
        </div>
        <div>
          <McFieldLabel htmlFor="current-users">Current users</McFieldLabel>
          <RoiNumberInput
            id="current-users"
            className="mt-1.5"
            value={cs.currentUsers}
            allowEmpty
            onChange={(v) =>
              patch((p) => ({
                ...p,
                currentSystem: { ...p.currentSystem, currentUsers: v },
              }))
            }
          />
        </div>
        <div>
          <McFieldLabel htmlFor="target-users">Target users</McFieldLabel>
          <RoiNumberInput
            id="target-users"
            className="mt-1.5"
            value={cs.targetUsers}
            allowEmpty
            onChange={(v) =>
              patch((p) => ({
                ...p,
                currentSystem: { ...p.currentSystem, targetUsers: v },
              }))
            }
          />
        </div>
        <div>
          <McFieldLabel htmlFor="deadline">Migration deadline</McFieldLabel>
          <Input
            id="deadline"
            className="mt-1.5"
            placeholder="e.g. Q4 2026"
            value={cs.migrationDeadline ?? ""}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                currentSystem: {
                  ...p.currentSystem,
                  migrationDeadline: e.target.value || undefined,
                },
              }))
            }
          />
        </div>
      </div>

      <McChoiceGrid
        legend="Migration approach"
        value={cs.cutoverApproach}
        onChange={(cutoverApproach) =>
          patch((p) => ({
            ...p,
            currentSystem: { ...p.currentSystem, cutoverApproach },
          }))
        }
        options={[
          { value: "one-time", label: "One-time cutover" },
          { value: "phased", label: "Phased migration" },
          { value: "parallel", label: "Parallel run" },
          { value: "not-sure", label: "Not sure" },
        ]}
      />

      <McChoiceGrid<McMigrationType>
        legend="What kind of migration is this?"
        columns={2}
        value={cs.migrationType}
        onChange={(migrationType) =>
          patch((p) => ({
            ...p,
            currentSystem: { ...p.currentSystem, migrationType },
          }))
        }
        options={[
          {
            value: "simple",
            label: "Simple",
            hint: "Basic contacts, companies and deals with little customization.",
          },
          {
            value: "moderate",
            label: "Moderate",
            hint: "Multiple objects, custom fields, activity history and several integrations.",
          },
          {
            value: "complex",
            label: "Complex",
            hint: "Custom objects, significant history, multiple systems, advanced transforms.",
          },
          {
            value: "custom",
            label: "Custom / Not sure",
            hint: "Guides questions only — never invents a price.",
          },
        ]}
      />
    </McSection>
  );
}

export function McStepDataScope({
  inputs,
  patch,
}: {
  inputs: McInputs;
  patch: Patch;
}) {
  const impact = historicalActivityImpact(inputs);
  const objects: McDataObjectRow[] =
    inputs.dataScope.objects.length > 0
      ? inputs.dataScope.objects
      : createDefaultDataObjects();

  return (
    <McSection
      title="What data needs to move?"
      description="Record volume affects tooling and processing, but mapping and data complexity often drive more project effort than raw row count."
    >
      <div className="overflow-x-auto rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--sg-color-surface-muted)]/60 text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            <tr>
              <th className="px-3 py-2">Migrate?</th>
              <th className="px-3 py-2">Object</th>
              <th className="px-3 py-2">Volume</th>
              <th className="px-3 py-2">Exact count</th>
              <th className="px-3 py-2">History</th>
              <th className="px-3 py-2">Custom fields</th>
            </tr>
          </thead>
          <tbody>
            {objects.map((obj, idx) => (
              <tr
                key={obj.id}
                className="border-t border-[var(--sg-color-border)]"
              >
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={obj.migrate}
                    aria-label={`Migrate ${obj.label}`}
                    onChange={(e) =>
                      patch((p) => {
                        const next = [...p.dataScope.objects];
                        next[idx] = { ...next[idx]!, migrate: e.target.checked };
                        return {
                          ...p,
                          dataScope: { ...p.dataScope, objects: next },
                        };
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2 font-medium">{obj.label}</td>
                <td className="px-3 py-2">
                  <Select
                    aria-label={`${obj.label} volume`}
                    value={obj.recordVolumeBand}
                    onChange={(e) =>
                      patch((p) => {
                        const next = [...p.dataScope.objects];
                        next[idx] = {
                          ...next[idx]!,
                          recordVolumeBand: e.target
                            .value as typeof obj.recordVolumeBand,
                        };
                        return {
                          ...p,
                          dataScope: { ...p.dataScope, objects: next },
                        };
                      })
                    }
                  >
                    <option value="unknown">Unknown</option>
                    <option value="under-10k">&lt;10k</option>
                    <option value="10k-50k">10k–50k</option>
                    <option value="50k-250k">50k–250k</option>
                    <option value="250k-1m">250k–1m</option>
                    <option value="1m-plus">1m+</option>
                  </Select>
                </td>
                <td className="px-3 py-2">
                  <RoiNumberInput
                    id={`count-${obj.id}`}
                    aria-label={`${obj.label} exact count`}
                    value={obj.recordCountExact}
                    allowEmpty
                    onChange={(v) =>
                      patch((p) => {
                        const next = [...p.dataScope.objects];
                        next[idx] = { ...next[idx]!, recordCountExact: v };
                        return {
                          ...p,
                          dataScope: { ...p.dataScope, objects: next },
                        };
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <Select
                    aria-label={`${obj.label} history`}
                    value={obj.historyDepth}
                    onChange={(e) =>
                      patch((p) => {
                        const next = [...p.dataScope.objects];
                        next[idx] = {
                          ...next[idx]!,
                          historyDepth: e.target.value as typeof obj.historyDepth,
                        };
                        return {
                          ...p,
                          dataScope: { ...p.dataScope, objects: next },
                        };
                      })
                    }
                  >
                    <option value="unknown">Unknown</option>
                    <option value="current-only">Current only</option>
                    <option value="1-year">1 year</option>
                    <option value="3-years">3 years</option>
                    <option value="5-plus-years">5+ years</option>
                    <option value="all-history">All history</option>
                  </Select>
                </td>
                <td className="px-3 py-2">
                  <RoiNumberInput
                    id={`cf-${obj.id}`}
                    aria-label={`${obj.label} custom fields`}
                    value={obj.customFieldsApprox}
                    allowEmpty
                    onChange={(v) =>
                      patch((p) => {
                        const next = [...p.dataScope.objects];
                        next[idx] = { ...next[idx]!, customFieldsApprox: v };
                        return {
                          ...p,
                          dataScope: { ...p.dataScope, objects: next },
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

      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          patch((p) => ({
            ...p,
            dataScope: {
              ...p.dataScope,
              objects: [
                ...p.dataScope.objects,
                {
                  id: `custom-${Date.now()}`,
                  label: "Custom object",
                  migrate: true,
                  recordVolumeBand: "unknown",
                  historyDepth: "unknown",
                  hasAttachments: "unknown",
                  importantRelationships: "unknown",
                  isCustom: true,
                },
              ],
            },
          }))
        }
      >
        Add custom object
      </Button>

      <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Historical activities
          </h3>
          <Badge
            variant={
              impact === "high"
                ? "warning"
                : impact === "moderate"
                  ? "primary"
                  : "success"
            }
          >
            Impact: {impact}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Migrating history can be much harder than current-state records.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {(
            [
              ["emails", "Emails"],
              ["calls", "Calls"],
              ["meetings", "Meetings"],
              ["tasks", "Tasks"],
              ["notes", "Notes"],
              ["stageHistory", "Stage history"],
              ["ownerHistory", "Owner history"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={inputs.dataScope.historicalActivity[key]}
                onChange={(e) =>
                  patch((p) => ({
                    ...p,
                    dataScope: {
                      ...p.dataScope,
                      historicalActivity: {
                        ...p.dataScope.historicalActivity,
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <McChoiceGrid
          legend="Do attachments / files need to migrate?"
          value={inputs.dataScope.attachments.scope}
          onChange={(scope) =>
            patch((p) => ({
              ...p,
              dataScope: {
                ...p.dataScope,
                attachments: { ...p.dataScope.attachments, scope },
              },
            }))
          }
          options={[
            { value: "no", label: "No" },
            { value: "some", label: "Some" },
            { value: "most-all", label: "Most / all" },
            { value: "not-sure", label: "Not sure" },
          ]}
        />
        <div>
          <McFieldLabel htmlFor="storage-band">Approx storage</McFieldLabel>
          <Select
            id="storage-band"
            className="mt-1.5"
            value={inputs.dataScope.attachments.storageBand}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                dataScope: {
                  ...p.dataScope,
                  attachments: {
                    ...p.dataScope.attachments,
                    storageBand: e.target
                      .value as typeof p.dataScope.attachments.storageBand,
                  },
                },
              }))
            }
          >
            <option value="unknown">Unknown</option>
            <option value="under-5gb">&lt;5 GB</option>
            <option value="5-25gb">5–25 GB</option>
            <option value="25-100gb">25–100 GB</option>
            <option value="100gb-plus">100+ GB</option>
          </Select>
          <div className="mt-3">
            <TcoMoneyInput
              id="storage-cost"
              label="Storage migration cost (optional)"
              hint="Only enter if you have a provider rate — we do not invent storage pricing."
              currency={inputs.currency}
              valueMajor={toMajorOrNull(
                inputs.dataScope.attachments.storageMigrationCostMinor,
              )}
              onChange={(major) =>
                patch((p) => ({
                  ...p,
                  dataScope: {
                    ...p.dataScope,
                    attachments: {
                      ...p.dataScope.attachments,
                      storageMigrationCostMinor: fromMajorOrNull(major),
                    },
                  },
                }))
              }
            />
          </div>
        </div>
      </div>
    </McSection>
  );
}

export function McStepDataQuality({
  inputs,
  patch,
}: {
  inputs: McInputs;
  patch: Patch;
}) {
  const issues: McDataQualityIssue[] =
    inputs.dataQuality.issues.length > 0
      ? inputs.dataQuality.issues
      : createDefaultDataQualityIssues();

  return (
    <McSection
      title="How clean is the data?"
      description="Do not hide uncertainty — Unknown is a valid answer. Effort and quotes you enter drive cost; we never invent rates."
    >
      <div className="space-y-3">
        {issues.map((issue, idx) => {
          const meta = DATA_QUALITY_ISSUES.find((i) => i.id === issue.id);
          return (
            <div
              key={issue.id}
              className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
            >
              <p className="text-sm font-medium text-[var(--sg-color-navy)]">
                {meta?.label ?? issue.id}
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-4">
                <div>
                  <McFieldLabel>Severity</McFieldLabel>
                  <Select
                    className="mt-1"
                    value={issue.severity}
                    onChange={(e) =>
                      patch((p) => {
                        const next = [...p.dataQuality.issues];
                        next[idx] = {
                          ...next[idx]!,
                          severity: e.target.value as typeof issue.severity,
                        };
                        return {
                          ...p,
                          dataQuality: { ...p.dataQuality, issues: next },
                        };
                      })
                    }
                  >
                    <option value="unknown">Unknown</option>
                    <option value="low">Low issue</option>
                    <option value="some">Some issues</option>
                    <option value="significant">Significant issue</option>
                  </Select>
                </div>
                <div>
                  <McFieldLabel>Approach</McFieldLabel>
                  <Select
                    className="mt-1"
                    value={issue.owner}
                    onChange={(e) =>
                      patch((p) => {
                        const next = [...p.dataQuality.issues];
                        next[idx] = {
                          ...next[idx]!,
                          owner: e.target.value as typeof issue.owner,
                        };
                        return {
                          ...p,
                          dataQuality: { ...p.dataQuality, issues: next },
                        };
                      })
                    }
                  >
                    <option value="not-sure">Not sure</option>
                    <option value="internal">Handled internally</option>
                    <option value="external">External help</option>
                  </Select>
                </div>
                <div>
                  <McFieldLabel htmlFor={`dq-h-${issue.id}`}>Hours</McFieldLabel>
                  <RoiNumberInput
                    id={`dq-h-${issue.id}`}
                    className="mt-1"
                    value={issue.estimatedHours}
                    allowEmpty
                    onChange={(v) =>
                      patch((p) => {
                        const next = [...p.dataQuality.issues];
                        next[idx] = { ...next[idx]!, estimatedHours: v };
                        return {
                          ...p,
                          dataQuality: { ...p.dataQuality, issues: next },
                        };
                      })
                    }
                  />
                </div>
                <TcoMoneyInput
                  id={`dq-c-${issue.id}`}
                  label="External quote"
                  currency={inputs.currency}
                  valueMajor={toMajorOrNull(issue.externalQuoteMinor)}
                  onChange={(major) =>
                    patch((p) => {
                      const next = [...p.dataQuality.issues];
                      next[idx] = {
                        ...next[idx]!,
                        externalQuoteMinor: fromMajorOrNull(major),
                      };
                      return {
                        ...p,
                        dataQuality: { ...p.dataQuality, issues: next },
                      };
                    })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <TcoMoneyInput
        id="dq-overall"
        label="Overall cleansing quote (optional)"
        hint="Use when you have a single partner quote instead of per-issue amounts."
        currency={inputs.currency}
        valueMajor={toMajorOrNull(inputs.dataQuality.overallExternalQuoteMinor)}
        onChange={(major) =>
          patch((p) => ({
            ...p,
            dataQuality: {
              ...p.dataQuality,
              overallExternalQuoteMinor: fromMajorOrNull(major),
            },
          }))
        }
      />
    </McSection>
  );
}

export function McStepMapping({
  inputs,
  patch,
  onImportMapping,
}: {
  inputs: McInputs;
  patch: Patch;
  onImportMapping: () => void;
}) {
  const band = mappingComplexityBand(inputs);
  const m = inputs.fieldMapping;

  return (
    <McSection
      title="How complex is the field mapping?"
      description="Import a mapping summary from the CRM Field Mapping / Migration Planner when available, or enter approximate counts. Complexity guides effort — never fake pricing."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" onClick={onImportMapping}>
          Import mapping summary
        </Button>
        <ButtonLink
          href="/resources/crm-field-mapping-template/"
          variant="ghost"
        >
          Open Field Mapping Template
        </ButtonLink>
        {m.importedFromFieldMapping ? (
          <Badge variant="success">Imported</Badge>
        ) : null}
        <Badge
          variant={
            band === "high" || band === "very-high" ? "warning" : "primary"
          }
        >
          Mapping complexity: {band}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {(
          [
            ["sourceFieldsApprox", "Approx source fields"],
            ["targetFieldsApprox", "Approx target fields"],
            ["directMappings", "Direct mappings"],
            ["renamedFields", "Renamed fields"],
            ["transformationRules", "Transformation rules"],
            ["valueMappings", "Picklist / value mappings"],
            ["lookupMappings", "Lookup / reference mappings"],
            ["customObjects", "Custom objects"],
            ["fieldsNeedingReview", "Fields needing review"],
            ["unmappedRequired", "Unmapped required fields"],
            ["openIssues", "Open mapping issues"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <McFieldLabel htmlFor={`map-${key}`}>{label}</McFieldLabel>
            <RoiNumberInput
              id={`map-${key}`}
              className="mt-1.5"
              value={m[key]}
              allowEmpty
              onChange={(v) =>
                patch((p) => ({
                  ...p,
                  fieldMapping: { ...p.fieldMapping, [key]: v },
                }))
              }
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TcoMoneyInput
          id="map-external"
          label="External mapping / transform quote"
          currency={inputs.currency}
          valueMajor={toMajorOrNull(m.externalQuoteMinor)}
          onChange={(major) =>
            patch((p) => ({
              ...p,
              fieldMapping: {
                ...p.fieldMapping,
                externalQuoteMinor: fromMajorOrNull(major),
              },
            }))
          }
        />
        <div>
          <McFieldLabel htmlFor="map-hours">Internal mapping hours</McFieldLabel>
          <RoiNumberInput
            id="map-hours"
            className="mt-1.5"
            value={m.internalHours}
            allowEmpty
            onChange={(v) =>
              patch((p) => ({
                ...p,
                fieldMapping: { ...p.fieldMapping, internalHours: v },
              }))
            }
          />
        </div>
      </div>

      <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-4">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Optional cost range (only if you have bounds)
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          We never invent ±20%. Leave blank unless you have low / high estimates.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <TcoMoneyInput
            id="map-low"
            label="Low"
            currency={inputs.currency}
            valueMajor={toMajorOrNull(m.range?.lowMinor)}
            onChange={(major) =>
              patch((p) => ({
                ...p,
                fieldMapping: {
                  ...p.fieldMapping,
                  range: {
                    ...p.fieldMapping.range,
                    lowMinor: fromMajorOrNull(major),
                  },
                },
              }))
            }
          />
          <TcoMoneyInput
            id="map-exp"
            label="Expected"
            currency={inputs.currency}
            valueMajor={toMajorOrNull(m.range?.expectedMinor)}
            onChange={(major) =>
              patch((p) => ({
                ...p,
                fieldMapping: {
                  ...p.fieldMapping,
                  range: {
                    ...p.fieldMapping.range,
                    expectedMinor: fromMajorOrNull(major),
                  },
                },
              }))
            }
          />
          <TcoMoneyInput
            id="map-high"
            label="High"
            currency={inputs.currency}
            valueMajor={toMajorOrNull(m.range?.highMinor)}
            onChange={(major) =>
              patch((p) => ({
                ...p,
                fieldMapping: {
                  ...p.fieldMapping,
                  range: {
                    ...p.fieldMapping.range,
                    highMinor: fromMajorOrNull(major),
                  },
                },
              }))
            }
          />
        </div>
      </div>

      <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
        <li>Date format conversions</li>
        <li>Picklist value standardization</li>
        <li>Owner / user mapping</li>
        <li>Cross-object lookups</li>
      </ul>
    </McSection>
  );
}
