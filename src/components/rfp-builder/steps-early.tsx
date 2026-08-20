"use client";

import type { CrmRfpDraft, CrmRfpSession } from "@/domain";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { Button } from "@/components/ui/button";
import { newRfpId } from "@/services/rfp-builder";
import { useRfpPack } from "@/services/rfp-builder/pack-context";

export type DraftPatch = (updater: (prev: CrmRfpDraft) => CrmRfpDraft) => void;

export function StepHeader({
  stepLabel,
  title,
  description,
}: {
  stepLabel: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        {stepLabel}
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">{description}</p>
    </div>
  );
}

export function RfpStepProject({
  draft,
  patch,
  brief,
}: {
  draft: CrmRfpDraft;
  patch: DraftPatch;
  brief: boolean;
}) {
  const p = draft.project;
  const set = (key: keyof typeof p, value: string | number | undefined) =>
    patch((d) => ({ ...d, project: { ...d.project, [key]: value } }));

  return (
    <div>
      <StepHeader
        stepLabel="Step 1"
        title="Tell us about the CRM project"
        description={
          brief
            ? "Only essentials are required for a Vendor Brief. Extra fields stay optional."
            : "Capture project metadata vendors need on the cover page."
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project name" htmlFor="rfp-project-name" required>
          <Input
            id="rfp-project-name"
            value={p.projectName}
            onChange={(e) => set("projectName", e.target.value)}
          />
        </Field>
        <Field label="Company / organization" htmlFor="rfp-org">
          <Input
            id="rfp-org"
            value={p.organization}
            onChange={(e) => set("organization", e.target.value)}
          />
        </Field>
        <Field label="RFP / brief owner" htmlFor="rfp-owner">
          <Input
            id="rfp-owner"
            value={p.owner}
            onChange={(e) => set("owner", e.target.value)}
          />
        </Field>
        {!brief ? (
          <Field label="Executive sponsor (optional)" htmlFor="rfp-sponsor">
            <Input
              id="rfp-sponsor"
              value={p.executiveSponsor}
              onChange={(e) => set("executiveSponsor", e.target.value)}
            />
          </Field>
        ) : null}
        <Field label="Primary vendor contact" htmlFor="rfp-vendor-contact">
          <Input
            id="rfp-vendor-contact"
            value={p.primaryVendorContact}
            onChange={(e) => set("primaryVendorContact", e.target.value)}
          />
        </Field>
        <Field label="Number of vendors expected" htmlFor="rfp-vendors-n">
          <Input
            id="rfp-vendors-n"
            type="number"
            min={0}
            max={50}
            value={p.vendorsExpected ?? ""}
            onChange={(e) =>
              set(
                "vendorsExpected",
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
          />
        </Field>
        <Field label="Issue date" htmlFor="rfp-issue">
          <Input
            id="rfp-issue"
            type="date"
            value={p.issueDate}
            onChange={(e) => set("issueDate", e.target.value)}
          />
        </Field>
        <Field label="Vendor response deadline" htmlFor="rfp-deadline">
          <Input
            id="rfp-deadline"
            type="date"
            value={p.responseDeadline}
            onChange={(e) => set("responseDeadline", e.target.value)}
          />
        </Field>
        <Field label="Target decision date" htmlFor="rfp-decision">
          <Input
            id="rfp-decision"
            type="date"
            value={p.decisionDate}
            onChange={(e) => set("decisionDate", e.target.value)}
          />
        </Field>
        <Field label="Target go-live date" htmlFor="rfp-golive">
          <Input
            id="rfp-golive"
            type="date"
            value={p.goLiveDate}
            onChange={(e) => set("goLiveDate", e.target.value)}
          />
        </Field>
        <Field label="Current CRM" htmlFor="rfp-current-crm">
          <Input
            id="rfp-current-crm"
            value={p.currentCrm}
            onChange={(e) => set("currentCrm", e.target.value)}
            placeholder="e.g. Spreadsheets, HubSpot, Salesforce…"
          />
        </Field>
        <Field label="Target geography / regions" htmlFor="rfp-geo">
          <Input
            id="rfp-geo"
            value={p.geography}
            onChange={(e) => set("geography", e.target.value)}
          />
        </Field>
        <Field label="Preferred currency" htmlFor="rfp-currency">
          <Select
            id="rfp-currency"
            value={p.currency}
            onChange={(e) => set("currency", e.target.value)}
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </Select>
        </Field>
        <Field label="Procurement mode" htmlFor="rfp-procurement">
          <Select
            id="rfp-procurement"
            value={p.procurementMode ?? ""}
            onChange={(e) =>
              set(
                "procurementMode",
                e.target.value === ""
                  ? undefined
                  : (e.target.value as typeof p.procurementMode),
              )
            }
          >
            <option value="">Select…</option>
            <option value="informal-evaluation">Informal evaluation</option>
            <option value="structured-shortlist">Structured shortlist</option>
            <option value="formal-rfp">Formal RFP</option>
            <option value="existing-procurement">Existing procurement process</option>
          </Select>
        </Field>
      </div>
    </div>
  );
}

export function RfpStepBusinessContext({
  draft,
  patch,
  onImportProfile,
  hasProfile,
}: {
  draft: CrmRfpDraft;
  patch: DraftPatch;
  onImportProfile?: () => void;
  hasProfile?: boolean;
}) {
  const pack = useRfpPack();
  const b = draft.businessContext;

  return (
    <div>
      <StepHeader
        stepLabel="Step 2"
        title={`Why are you evaluating ${pack.productLabel} software?`}
        description="Describe your situation in your own words. Prompt chips are examples only — nothing is auto-selected as fact."
      />
      {hasProfile && onImportProfile ? (
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={onImportProfile}>
            Import context from Requirements Builder
          </Button>
        </div>
      ) : null}
      <div className="space-y-4">
        <Field
          label="Current situation"
          htmlFor="rfp-situation"
          hint="How are customers, leads and opportunities managed today?"
        >
          <Textarea
            id="rfp-situation"
            value={b.currentSituation}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                businessContext: {
                  ...d.businessContext,
                  currentSituation: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field
          label="Business problem"
          htmlFor="rfp-problem"
          hint="What is not working well enough?"
        >
          <Textarea
            id="rfp-problem"
            value={b.businessProblem}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                businessContext: {
                  ...d.businessContext,
                  businessProblem: e.target.value,
                },
              }))
            }
          />
        </Field>
        <fieldset>
          <legend className="text-sm font-medium text-[var(--sg-color-text)]">
            Trigger for change (optional prompts)
          </legend>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Select only prompts that apply — they are not auto-checked.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pack.changeTriggers.map((prompt) => {
              const selected = b.changeTriggers.includes(prompt);
              return (
                <button
                  key={prompt}
                  type="button"
                  className={
                    selected
                      ? "rounded-full border border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] px-3 py-1.5 text-xs font-medium text-[var(--sg-color-primary)]"
                      : "rounded-full border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1.5 text-xs text-[var(--sg-color-text-muted)]"
                  }
                  aria-pressed={selected}
                  onClick={() =>
                    patch((d) => {
                      const set = new Set(d.businessContext.changeTriggers);
                      if (set.has(prompt)) set.delete(prompt);
                      else set.add(prompt);
                      return {
                        ...d,
                        businessContext: {
                          ...d.businessContext,
                          changeTriggers: [...set],
                        },
                      };
                    })
                  }
                >
                  {prompt}
                </button>
              );
            })}
          </div>
        </fieldset>
        <Field label="Desired future state" htmlFor="rfp-future">
          <Textarea
            id="rfp-future"
            value={b.desiredFutureState}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                businessContext: {
                  ...d.businessContext,
                  desiredFutureState: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Success outcomes" htmlFor="rfp-success">
          <Textarea
            id="rfp-success"
            value={b.successOutcomes}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                businessContext: {
                  ...d.businessContext,
                  successOutcomes: e.target.value,
                },
              }))
            }
          />
        </Field>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Business objectives
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Structured outcomes vendors can map delivery against.
        </p>
        <div className="mt-3 space-y-3">
          {draft.objectives.map((obj) => (
            <div
              key={obj.id}
              className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
            >
              <p className="text-xs font-semibold text-[var(--sg-color-primary)]">
                {obj.id}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Input
                  aria-label={`${obj.id} objective`}
                  placeholder="Objective"
                  value={obj.objective}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      objectives: d.objectives.map((o) =>
                        o.id === obj.id
                          ? { ...o, objective: e.target.value }
                          : o,
                      ),
                    }))
                  }
                />
                <Select
                  aria-label={`${obj.id} priority`}
                  value={obj.priority}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      objectives: d.objectives.map((o) =>
                        o.id === obj.id
                          ? {
                              ...o,
                              priority: e.target.value as typeof o.priority,
                            }
                          : o,
                      ),
                    }))
                  }
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
                <Input
                  placeholder="Current baseline (optional)"
                  value={obj.currentBaseline}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      objectives: d.objectives.map((o) =>
                        o.id === obj.id
                          ? { ...o, currentBaseline: e.target.value }
                          : o,
                      ),
                    }))
                  }
                />
                <Input
                  placeholder="Desired outcome"
                  value={obj.desiredOutcome}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      objectives: d.objectives.map((o) =>
                        o.id === obj.id
                          ? { ...o, desiredOutcome: e.target.value }
                          : o,
                      ),
                    }))
                  }
                />
                <Input
                  placeholder="Measurement"
                  value={obj.measurement}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      objectives: d.objectives.map((o) =>
                        o.id === obj.id
                          ? { ...o, measurement: e.target.value }
                          : o,
                      ),
                    }))
                  }
                />
                <Input
                  placeholder="Owner"
                  value={obj.owner}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      objectives: d.objectives.map((o) =>
                        o.id === obj.id ? { ...o, owner: e.target.value } : o,
                      ),
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() =>
            patch((d) => ({
              ...d,
              objectives: [
                ...d.objectives,
                {
                  id: `OBJ-${String(d.objectives.length + 1).padStart(3, "0")}`,
                  objective: "",
                  currentBaseline: "",
                  desiredOutcome: "",
                  measurement: "",
                  priority: "medium",
                  owner: "",
                },
              ],
            }))
          }
        >
          Add objective
        </Button>
      </div>
    </div>
  );
}

export function RfpStepScopeUsers({
  draft,
  patch,
}: {
  draft: CrmRfpDraft;
  patch: DraftPatch;
}) {
  const pack = useRfpPack();
  const selected = new Map(draft.scope.map((s) => [s.id, s]));

  return (
    <div>
      <StepHeader
        stepLabel="Step 3"
        title="What is in scope?"
        description={pack.scopeStepDescription}
      />
      <div className="space-y-2">
        {pack.scopeCatalog.map((item) => {
          const row = selected.get(item.id);
          const active = Boolean(row);
          return (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) =>
                    patch((d) => {
                      if (e.target.checked) {
                        return {
                          ...d,
                          scope: [
                            ...d.scope.filter((s) => s.id !== item.id),
                            {
                              id: item.id,
                              label: item.label,
                              capabilitySlug: item.capabilitySlug,
                              phase: "phase-1",
                            },
                          ],
                        };
                      }
                      return {
                        ...d,
                        scope: d.scope.filter((s) => s.id !== item.id),
                      };
                    })
                  }
                />
                {item.label}
              </label>
              {active ? (
                <Select
                  className="sm:w-40"
                  aria-label={`${item.label} phase`}
                  value={row?.phase ?? "phase-1"}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      scope: d.scope.map((s) =>
                        s.id === item.id
                          ? {
                              ...s,
                              phase: e.target.value as typeof s.phase,
                            }
                          : s,
                      ),
                    }))
                  }
                >
                  <option value="phase-1">Phase 1</option>
                  <option value="phase-2">Phase 2</option>
                  <option value="future">Future</option>
                  <option value="out-of-scope">Out of scope</option>
                </Select>
              ) : null}
            </div>
          );
        })}
      </div>

      <h3 className="mt-8 text-sm font-semibold text-[var(--sg-color-navy)]">
        User groups
      </h3>
      <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
        Example labels only — fields start empty.
      </p>
      <p className="mt-2 text-[10px] text-[var(--sg-color-text-muted)]">
        Prompts: {pack.userGroups.join(" · ")}
      </p>
      <div className="mt-3 space-y-3">
        {draft.users.groups.map((g) => (
          <div
            key={g.id}
            className="grid gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 sm:grid-cols-2"
          >
            <Input
              placeholder="Group"
              value={g.group}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  users: {
                    ...d.users,
                    groups: d.users.groups.map((x) =>
                      x.id === g.id ? { ...x, group: e.target.value } : x,
                    ),
                  },
                }))
              }
            />
            <Input
              type="number"
              min={0}
              placeholder="Users"
              value={g.users ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  users: {
                    ...d.users,
                    groups: d.users.groups.map((x) =>
                      x.id === g.id
                        ? {
                            ...x,
                            users:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          }
                        : x,
                    ),
                  },
                }))
              }
            />
            <Input
              placeholder="Primary job"
              value={g.primaryJob}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  users: {
                    ...d.users,
                    groups: d.users.groups.map((x) =>
                      x.id === g.id
                        ? { ...x, primaryJob: e.target.value }
                        : x,
                    ),
                  },
                }))
              }
            />
            <Input
              placeholder="Access type"
              value={g.accessType}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  users: {
                    ...d.users,
                    groups: d.users.groups.map((x) =>
                      x.id === g.id
                        ? { ...x, accessType: e.target.value }
                        : x,
                    ),
                  },
                }))
              }
            />
            <Input
              className="sm:col-span-2"
              placeholder="Key workflows"
              value={g.keyWorkflows}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  users: {
                    ...d.users,
                    groups: d.users.groups.map((x) =>
                      x.id === g.id
                        ? { ...x, keyWorkflows: e.target.value }
                        : x,
                    ),
                  },
                }))
              }
            />
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={() =>
          patch((d) => ({
            ...d,
            users: {
              ...d.users,
              groups: [
                ...d.users.groups,
                {
                  id: newRfpId("UG"),
                  group: "",
                  primaryJob: "",
                  accessType: "",
                  keyWorkflows: "",
                },
              ],
            },
          }))
        }
      >
        Add user group
      </Button>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Field label="Current users" htmlFor="rfp-users-now">
          <Input
            id="rfp-users-now"
            type="number"
            min={0}
            value={draft.users.currentUsers ?? ""}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                users: {
                  ...d.users,
                  currentUsers:
                    e.target.value === ""
                      ? undefined
                      : Number(e.target.value),
                },
              }))
            }
          />
        </Field>
        <Field label="12-month expected users" htmlFor="rfp-users-12">
          <Input
            id="rfp-users-12"
            type="number"
            min={0}
            value={draft.users.users12Month ?? ""}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                users: {
                  ...d.users,
                  users12Month:
                    e.target.value === ""
                      ? undefined
                      : Number(e.target.value),
                },
              }))
            }
          />
        </Field>
        <Field label="36-month expected users" htmlFor="rfp-users-36">
          <Input
            id="rfp-users-36"
            type="number"
            min={0}
            value={draft.users.users36Month ?? ""}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                users: {
                  ...d.users,
                  users36Month:
                    e.target.value === ""
                      ? undefined
                      : Number(e.target.value),
                },
              }))
            }
          />
        </Field>
      </div>
    </div>
  );
}

// silence unused session type import if tree-shaken oddly
export type { CrmRfpSession };
