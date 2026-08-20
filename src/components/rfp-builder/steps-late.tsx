"use client";

import type { CrmRfpDraft, RfpMode } from "@/domain";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import {
  RFP_PRIORITY_LABELS,
  READINESS_LABELS,
  assessRfpReadiness,
  countByPriority,
  newRfpId,
} from "@/services/rfp-builder";
import { useRfpPack } from "@/services/rfp-builder/pack-context";
import { StepHeader, type DraftPatch } from "./steps-early";

export function RfpStepIntegrations({
  draft,
  patch,
  formal,
  onImportIntegrations,
}: {
  draft: CrmRfpDraft;
  patch: DraftPatch;
  formal: boolean;
  onImportIntegrations?: () => void;
}) {
  const pack = useRfpPack();
  return (
    <div>
      <StepHeader
        stepLabel="Step 5"
        title={`Which systems must the ${pack.productLabel} work with?`}
        description="Build an integration inventory. Do not invent systems or volumes."
      />
      {onImportIntegrations ? (
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={onImportIntegrations}
        >
          Import integrations from Requirements Builder
        </Button>
      ) : null}
      <div className="space-y-3">
        {draft.integrations.map((row) => (
          <div
            key={row.id}
            className="grid gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            <Input
              placeholder="System"
              value={row.system}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  integrations: d.integrations.map((i) =>
                    i.id === row.id ? { ...i, system: e.target.value } : i,
                  ),
                }))
              }
            />
            <Select
              value={row.category}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  integrations: d.integrations.map((i) =>
                    i.id === row.id ? { ...i, category: e.target.value } : i,
                  ),
                }))
              }
            >
              {pack.integrationCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select
              value={row.direction}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  integrations: d.integrations.map((i) =>
                    i.id === row.id
                      ? {
                          ...i,
                          direction: e.target.value as typeof i.direction,
                        }
                      : i,
                  ),
                }))
              }
            >
              <option value="unknown">Direction unknown</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
              <option value="bidirectional">Bidirectional</option>
            </Select>
            <Input
              placeholder="Data"
              value={row.data}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  integrations: d.integrations.map((i) =>
                    i.id === row.id ? { ...i, data: e.target.value } : i,
                  ),
                }))
              }
            />
            <Select
              value={row.criticality}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  integrations: d.integrations.map((i) =>
                    i.id === row.id
                      ? {
                          ...i,
                          criticality: e.target.value as typeof i.criticality,
                        }
                      : i,
                  ),
                }))
              }
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            <Input
              placeholder="Preferred method"
              value={row.preferredMethod}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  integrations: d.integrations.map((i) =>
                    i.id === row.id
                      ? { ...i, preferredMethod: e.target.value }
                      : i,
                  ),
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
            integrations: [
              ...d.integrations,
              {
                id: newRfpId("INT"),
                system: "",
                category: "Other",
                direction: "unknown",
                data: "",
                frequency: "",
                criticality: "medium",
                preferredMethod: "",
                owner: "",
                notes: "",
              },
            ],
          }))
        }
      >
        Add integration
      </Button>

      {formal ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Data & migration
          </h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Object prompts: {pack.migrationObjects.join(" · ")}. Do not
            invent record counts.
          </p>
          <div className="mt-3">
          <Field label="Who should perform migration?" htmlFor="rfp-mig-who">
            <Select
              id="rfp-mig-who"
              value={draft.migration.performer ?? ""}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  migration: {
                    ...d.migration,
                    performer:
                      e.target.value === ""
                        ? undefined
                        : (e.target.value as typeof d.migration.performer),
                  },
                }))
              }
            >
              <option value="">Select…</option>
              <option value="buyer">Buyer</option>
              <option value="vendor">Vendor</option>
              <option value="implementation-partner">Implementation partner</option>
              <option value="shared">Shared</option>
              <option value="tbd">TBD</option>
            </Select>
          </Field>
          </div>
          <Field label="Migration constraints" htmlFor="rfp-mig-constraints">
            <Textarea
              id="rfp-mig-constraints"
              value={draft.migration.constraints}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  migration: {
                    ...d.migration,
                    constraints: e.target.value,
                  },
                }))
              }
            />
          </Field>
          <p className="mt-2 text-xs">
            <Link
              className="text-[var(--sg-color-primary)] underline"
              href="/resources/crm-field-mapping-template/"
            >
              Link: CRM Field Mapping Template
            </Link>
          </p>
          <div className="mt-3 space-y-2">
            {draft.migration.objects.map((o) => (
              <div
                key={o.id}
                className="grid gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 sm:grid-cols-3"
              >
                <Input
                  placeholder="Object"
                  value={o.objectName}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      migration: {
                        ...d.migration,
                        objects: d.migration.objects.map((x) =>
                          x.id === o.id
                            ? { ...x, objectName: e.target.value }
                            : x,
                        ),
                      },
                    }))
                  }
                />
                <Input
                  placeholder="Source system"
                  value={o.sourceSystem}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      migration: {
                        ...d.migration,
                        objects: d.migration.objects.map((x) =>
                          x.id === o.id
                            ? { ...x, sourceSystem: e.target.value }
                            : x,
                        ),
                      },
                    }))
                  }
                />
                <Input
                  placeholder="Approx record count (buyer-entered)"
                  value={o.approxRecordCount}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      migration: {
                        ...d.migration,
                        objects: d.migration.objects.map((x) =>
                          x.id === o.id
                            ? { ...x, approxRecordCount: e.target.value }
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
                migration: {
                  ...d.migration,
                  objects: [
                    ...d.migration.objects,
                    {
                      id: newRfpId("MIG"),
                      objectName: "",
                      sourceSystem: "",
                      approxRecordCount: "",
                      historyRequired: false,
                      attachments: false,
                      customFields: false,
                      migrationOwner: "",
                      priority: "should-have",
                    },
                  ],
                },
              }))
            }
          >
            Add migration object
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function RfpStepImplementation({
  draft,
  patch,
  formal,
}: {
  draft: CrmRfpDraft;
  patch: DraftPatch;
  formal: boolean;
}) {
  return (
    <div>
      <StepHeader
        stepLabel="Step 6"
        title="What should vendors tell you about implementation?"
        description="Select the information you want vendors to provide. Do not prefill durations."
      />
      <div className="space-y-2">
        {draft.implementation.questions.map((q) => (
          <label
            key={q.id}
            className="flex items-start gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={q.requested}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  implementation: {
                    ...d.implementation,
                    questions: d.implementation.questions.map((x) =>
                      x.id === q.id
                        ? { ...x, requested: e.target.checked }
                        : x,
                    ),
                  },
                }))
              }
            />
            <span>{q.label}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Preferred go-live date" htmlFor="rfp-impl-golive">
          <Input
            id="rfp-impl-golive"
            type="date"
            value={draft.implementation.preferredGoLive}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                implementation: {
                  ...d.implementation,
                  preferredGoLive: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Implementation model" htmlFor="rfp-impl-model">
          <Select
            id="rfp-impl-model"
            value={draft.implementation.model ?? ""}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                implementation: {
                  ...d.implementation,
                  model:
                    e.target.value === ""
                      ? undefined
                      : (e.target.value as typeof d.implementation.model),
                },
              }))
            }
          >
            <option value="">Select…</option>
            <option value="vendor-led">Vendor-led</option>
            <option value="partner-led">Partner-led</option>
            <option value="customer-led">Customer-led</option>
            <option value="hybrid">Hybrid</option>
            <option value="open">Open to recommendation</option>
          </Select>
        </Field>
      </div>
      <Field label="Custom implementation requirements" htmlFor="rfp-impl-custom">
        <Textarea
          id="rfp-impl-custom"
          value={draft.implementation.customRequirements}
          onChange={(e) =>
            patch((d) => ({
              ...d,
              implementation: {
                ...d.implementation,
                customRequirements: e.target.value,
              },
            }))
          }
        />
      </Field>
      {formal ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Timeline estimate request
          </h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Vendors provide duration, dependencies and customer resources —
            fields stay blank for them.
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-[var(--sg-color-text-muted)]">
            {draft.implementation.timelinePhases.map((p) => (
              <li key={p.id}>{p.phase}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function RfpStepSecuritySupport({
  draft,
  patch,
}: {
  draft: CrmRfpDraft;
  patch: DraftPatch;
}) {
  return (
    <div>
      <StepHeader
        stepLabel="Step 7"
        title="Security, privacy & support"
        description="Mark only controls you need. Do not imply every buyer needs every control."
      />
      <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
        Security / privacy
      </h3>
      <div className="mt-2 space-y-2">
        {draft.securityQuestions.map((q) => (
          <div
            key={q.id}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-[var(--sg-color-primary)]">
                  {q.id} · {q.area}
                </p>
                <p className="text-sm">{q.question}</p>
              </div>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      securityQuestions: d.securityQuestions.map((x) =>
                        x.id === q.id
                          ? { ...x, required: e.target.checked }
                          : x,
                      ),
                    }))
                  }
                />
                Required
              </label>
            </div>
            <label className="mt-2 flex items-center gap-2 text-xs text-[var(--sg-color-text-muted)]">
              <input
                type="checkbox"
                checked={q.evidenceRequested}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    securityQuestions: d.securityQuestions.map((x) =>
                      x.id === q.id
                        ? { ...x, evidenceRequested: e.target.checked }
                        : x,
                    ),
                  }))
                }
              />
              Evidence requested
            </label>
          </div>
        ))}
      </div>
      <h3 className="mt-8 text-sm font-semibold text-[var(--sg-color-navy)]">
        Support / SLA (optional)
      </h3>
      <div className="mt-2 space-y-2">
        {draft.supportQuestions.map((q) => (
          <label
            key={q.id}
            className="flex items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              checked={q.requested}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  supportQuestions: d.supportQuestions.map((x) =>
                    x.id === q.id
                      ? { ...x, requested: e.target.checked }
                      : x,
                  ),
                }))
              }
            />
            {q.topic}
          </label>
        ))}
      </div>
    </div>
  );
}

export function RfpStepCommercials({
  draft,
  patch,
}: {
  draft: CrmRfpDraft;
  patch: DraftPatch;
}) {
  const a = draft.pricingAssumptions;
  return (
    <div>
      <StepHeader
        stepLabel="Step 8"
        title="How should vendors structure pricing?"
        description="Set pricing assumptions so quotes are comparable. Leave blank rather than inventing figures."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Users Year 1" htmlFor="rfp-u1">
          <Input
            id="rfp-u1"
            type="number"
            min={0}
            value={a.usersYear1 ?? ""}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                pricingAssumptions: {
                  ...d.pricingAssumptions,
                  usersYear1:
                    e.target.value === ""
                      ? undefined
                      : Number(e.target.value),
                },
              }))
            }
          />
        </Field>
        <Field label="Users Year 2" htmlFor="rfp-u2">
          <Input
            id="rfp-u2"
            type="number"
            min={0}
            value={a.usersYear2 ?? ""}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                pricingAssumptions: {
                  ...d.pricingAssumptions,
                  usersYear2:
                    e.target.value === ""
                      ? undefined
                      : Number(e.target.value),
                },
              }))
            }
          />
        </Field>
        <Field label="Users Year 3" htmlFor="rfp-u3">
          <Input
            id="rfp-u3"
            type="number"
            min={0}
            value={a.usersYear3 ?? ""}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                pricingAssumptions: {
                  ...d.pricingAssumptions,
                  usersYear3:
                    e.target.value === ""
                      ? undefined
                      : Number(e.target.value),
                },
              }))
            }
          />
        </Field>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Required add-ons" htmlFor="rfp-addons">
          <Input
            id="rfp-addons"
            value={a.requiredAddOns}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                pricingAssumptions: {
                  ...d.pricingAssumptions,
                  requiredAddOns: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Regions" htmlFor="rfp-regions">
          <Input
            id="rfp-regions"
            value={a.regions}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                pricingAssumptions: {
                  ...d.pricingAssumptions,
                  regions: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Support tier" htmlFor="rfp-support-tier">
          <Input
            id="rfp-support-tier"
            value={a.supportTier}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                pricingAssumptions: {
                  ...d.pricingAssumptions,
                  supportTier: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Implementation scope" htmlFor="rfp-impl-scope">
          <Input
            id="rfp-impl-scope"
            value={a.implementationScope}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                pricingAssumptions: {
                  ...d.pricingAssumptions,
                  implementationScope: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Currency" htmlFor="rfp-price-currency">
          <Select
            id="rfp-price-currency"
            value={a.currency}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                pricingAssumptions: {
                  ...d.pricingAssumptions,
                  currency: e.target.value as typeof a.currency,
                },
              }))
            }
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </Select>
        </Field>
        <Field label="Tax treatment" htmlFor="rfp-tax">
          <Select
            id="rfp-tax"
            value={a.taxTreatment}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                pricingAssumptions: {
                  ...d.pricingAssumptions,
                  taxTreatment: e.target
                    .value as typeof a.taxTreatment,
                },
              }))
            }
          >
            <option value="exclude">Exclude tax unless needed</option>
            <option value="include-if-required">Include if required</option>
            <option value="specify">Vendor must specify</option>
          </Select>
        </Field>
      </div>
      <Alert className="mt-4">
        Vendors complete software, add-ons, implementation, recurring services
        and 3-year TCO in the Excel workbook. No sample figures are treated as
        requirements.
      </Alert>
    </div>
  );
}

export function RfpStepResponseRules({
  draft,
  patch,
}: {
  draft: CrmRfpDraft;
  patch: DraftPatch;
}) {
  const r = draft.responseRules;
  return (
    <div>
      <StepHeader
        stepLabel="Step 9"
        title="How should vendors respond?"
        description="Editable instructions issued with the package. Do not invent contact emails."
      />
      <div className="space-y-2">
        {r.rules.map((rule, idx) => (
          <div key={idx} className="flex gap-2">
            <Input
              value={rule}
              onChange={(e) =>
                patch((d) => {
                  const rules = [...d.responseRules.rules];
                  rules[idx] = e.target.value;
                  return {
                    ...d,
                    responseRules: { ...d.responseRules, rules },
                  };
                })
              }
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                patch((d) => ({
                  ...d,
                  responseRules: {
                    ...d.responseRules,
                    rules: d.responseRules.rules.filter((_, i) => i !== idx),
                  },
                }))
              }
            >
              Remove
            </Button>
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
            responseRules: {
              ...d.responseRules,
              rules: [...d.responseRules.rules, ""],
            },
          }))
        }
      >
        Add rule
      </Button>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Response deadline" htmlFor="rfp-rr-deadline">
          <Input
            id="rfp-rr-deadline"
            type="date"
            value={r.responseDeadline}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                responseRules: {
                  ...d.responseRules,
                  responseDeadline: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Questions deadline" htmlFor="rfp-rr-q">
          <Input
            id="rfp-rr-q"
            type="date"
            value={r.questionsDeadline}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                responseRules: {
                  ...d.responseRules,
                  questionsDeadline: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Contact person" htmlFor="rfp-rr-person">
          <Input
            id="rfp-rr-person"
            value={r.contactPerson}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                responseRules: {
                  ...d.responseRules,
                  contactPerson: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Contact email" htmlFor="rfp-rr-email">
          <Input
            id="rfp-rr-email"
            type="email"
            value={r.contactEmail}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                responseRules: {
                  ...d.responseRules,
                  contactEmail: e.target.value,
                },
              }))
            }
            placeholder="Only if you choose to provide one"
          />
        </Field>
        <Field label="Submission method" htmlFor="rfp-rr-submit">
          <Input
            id="rfp-rr-submit"
            value={r.submissionMethod}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                responseRules: {
                  ...d.responseRules,
                  submissionMethod: e.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Clarification call window (optional)" htmlFor="rfp-rr-calls">
          <Input
            id="rfp-rr-calls"
            value={r.clarificationCallWindow}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                responseRules: {
                  ...d.responseRules,
                  clarificationCallWindow: e.target.value,
                },
              }))
            }
          />
        </Field>
      </div>
    </div>
  );
}

export function RfpStepReview({
  draft,
  mode,
  onEditStep,
  onGenerate,
  canGenerate,
}: {
  draft: CrmRfpDraft;
  mode: RfpMode;
  onEditStep: (step: string) => void;
  onGenerate: () => void;
  canGenerate: boolean;
}) {
  const readiness = assessRfpReadiness(draft, mode);
  const counts = countByPriority(draft.requirements);

  const sections: Array<{ id: string; label: string; step: string; summary: string }> = [
    {
      id: "project",
      label: "Project",
      step: "project",
      summary: draft.project.projectName || "Untitled project",
    },
    {
      id: "business",
      label: "Business context",
      step: "business-context",
      summary: draft.businessContext.businessProblem
        ? "Problem described"
        : "Incomplete",
    },
    {
      id: "objectives",
      label: "Objectives",
      step: "business-context",
      summary: `${draft.objectives.length} objective(s)`,
    },
    {
      id: "scope",
      label: "Scope",
      step: "scope-users",
      summary: `${draft.scope.length} item(s)`,
    },
    {
      id: "users",
      label: "Users",
      step: "scope-users",
      summary:
        draft.users.currentUsers != null
          ? `${draft.users.currentUsers} current`
          : "Not set",
    },
    {
      id: "requirements",
      label: "Requirements",
      step: "requirements",
      summary: `${counts.total} (${counts.mustHave} must-have)`,
    },
    {
      id: "integrations",
      label: "Integrations",
      step: "integrations",
      summary: `${draft.integrations.length}`,
    },
    {
      id: "migration",
      label: "Migration",
      step: "integrations",
      summary: `${draft.migration.objects.length} object(s)`,
    },
    {
      id: "implementation",
      label: "Implementation",
      step: "implementation",
      summary: `${draft.implementation.questions.filter((q) => q.requested).length} questions`,
    },
    {
      id: "security",
      label: "Security",
      step: "security-support",
      summary: `${draft.securityQuestions.filter((q) => q.required).length} required`,
    },
    {
      id: "commercial",
      label: "Commercial",
      step: "commercials",
      summary:
        draft.pricingAssumptions.usersYear1 != null
          ? `Y1 users ${draft.pricingAssumptions.usersYear1}`
          : "Assumptions incomplete",
    },
    {
      id: "rules",
      label: "Response instructions",
      step: "response-rules",
      summary: `${draft.responseRules.rules.length} rules`,
    },
  ];

  return (
    <div>
      <StepHeader
        stepLabel="Step 10"
        title="Review & generate"
        description="Check readiness before issuing the same pack to every vendor."
      />
      <div
        className={
          readiness.status === "ready"
            ? "rounded-[var(--sg-radius-md)] border border-green-200 bg-green-50 px-4 py-3"
            : readiness.status === "ready-with-gaps"
              ? "rounded-[var(--sg-radius-md)] border border-amber-200 bg-amber-50 px-4 py-3"
              : "rounded-[var(--sg-radius-md)] border border-red-200 bg-red-50 px-4 py-3"
        }
      >
        <p className="font-semibold text-[var(--sg-color-navy)]">
          Readiness: {READINESS_LABELS[readiness.status]}
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          {readiness.sections.map((s) => (
            <li key={s.id}>
              <span className="font-medium">{s.label}</span> — {s.status}
              {s.gaps.length ? ` (${s.gaps.join("; ")})` : ""}
            </li>
          ))}
        </ul>
      </div>
      {readiness.warnings.length > 0 ? (
        <Alert className="mt-4">
          <ul className="list-disc pl-5">
            {readiness.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Alert>
      ) : null}
      {readiness.blockers.length > 0 ? (
        <Alert variant="danger" className="mt-4">
          <ul className="list-disc pl-5">
            {readiness.blockers.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Alert>
      ) : null}

      <div className="mt-6 space-y-2">
        {sections.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-[var(--sg-color-navy)]">
                {s.label}
              </p>
              <p className="text-xs text-[var(--sg-color-text-muted)]">
                {s.summary}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(s.step)}
            >
              Edit
            </Button>
          </div>
        ))}
      </div>

      <Button
        className="mt-6"
        disabled={!canGenerate}
        onClick={onGenerate}
      >
        Generate {mode === "formal-rfp" ? "Formal RFP" : "Vendor Brief"}
      </Button>
      {!canGenerate ? (
        <p className="mt-2 text-sm text-[var(--sg-color-danger)]">
          Add at least one in-scope requirement before generating.
        </p>
      ) : null}
    </div>
  );
}

// silence unused export
void RFP_PRIORITY_LABELS;
