"use client";

import type { ReactNode } from "react";
import type {
  CrmDemoChecklistDraft,
  DemoIntegrationDelivery,
  DemoItemPriority,
} from "@/domain";
import { Input, Select, Textarea } from "@/components/ui/forms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DEMO_ITEM_PRIORITY_LABELS,
  newDemoId,
} from "@/services/demo-checklist-builder";
import { StepHeader, type DemoDraftPatch } from "./step-header";

type Props = {
  draft: CrmDemoChecklistDraft;
  patch: DemoDraftPatch;
};

const QUESTION_GROUPS = [
  { id: "functional" as const, title: "Functional" },
  { id: "administration" as const, title: "Administration" },
  { id: "data" as const, title: "Data" },
];

const DELIVERY_LABELS: Record<DemoIntegrationDelivery, string> = {
  native: "Native",
  marketplace: "Marketplace",
  api: "API",
  custom: "Custom",
  unknown: "Unknown",
};

const AI_DATA_USE_REMINDERS = [
  "Where is CRM data processed for AI features?",
  "Can AI outputs be audited or corrected?",
  "Which edition includes the demonstrated AI capability?",
  "Are there usage limits or additional charges?",
];

export function DemoStepQuestions({ draft, patch }: Props) {
  return (
    <div>
      <StepHeader
        stepLabel="Step 4"
        title="Questions & checks"
        description="Standard verification questions to ask during or after the demo. Toggle only what you need."
      />

      {QUESTION_GROUPS.map((group) => {
        const items = draft.questions.filter((q) => q.group === group.id);
        if (items.length === 0) return null;
        return (
          <section key={group.id} className="mb-8">
            <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
              {group.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {items.map((q) => (
                <li
                  key={q.id}
                  className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
                >
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={q.included}
                      onChange={(e) =>
                        patch((d) => ({
                          ...d,
                          questions: d.questions.map((x) =>
                            x.id === q.id
                              ? { ...x, included: e.target.checked }
                              : x,
                          ),
                        }))
                      }
                    />
                    <span>{q.question}</span>
                  </label>
                  {q.included ? (
                    <Textarea
                      className="mt-2 min-h-16 text-xs"
                      aria-label={`Notes for ${q.question}`}
                      placeholder="Evaluator notes"
                      value={q.notes}
                      onChange={(e) =>
                        patch((d) => ({
                          ...d,
                          questions: d.questions.map((x) =>
                            x.id === q.id ? { ...x, notes: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function DemoStepIntegrations({ draft, patch }: Props) {
  return (
    <div>
      <StepHeader
        stepLabel="Step 5"
        title="Integrations & data"
        description="Name systems that must connect. Required integrations should be marked for live demo or explicit limitation."
      />

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--sg-color-border)] text-xs uppercase text-[var(--sg-color-text-muted)]">
              <th className="py-2 pr-2">Integration</th>
              <th className="py-2 pr-2">Required</th>
              <th className="py-2 pr-2">Delivery</th>
              <th className="py-2 pr-2">Demo</th>
              <th className="py-2">Test task</th>
            </tr>
          </thead>
          <tbody>
            {draft.integrations.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[var(--sg-color-border)] align-top"
              >
                <td className="py-3 pr-2">
                  <Input
                    aria-label="Integration name"
                    value={row.integration}
                    onChange={(e) =>
                      patch((d) => ({
                        ...d,
                        integrations: d.integrations.map((x) =>
                          x.id === row.id
                            ? { ...x, integration: e.target.value }
                            : x,
                        ),
                      }))
                    }
                  />
                </td>
                <td className="py-3 pr-2">
                  <input
                    type="checkbox"
                    aria-label={`${row.integration} required`}
                    checked={row.required}
                    onChange={(e) =>
                      patch((d) => ({
                        ...d,
                        integrations: d.integrations.map((x) =>
                          x.id === row.id
                            ? { ...x, required: e.target.checked }
                            : x,
                        ),
                      }))
                    }
                  />
                </td>
                <td className="py-3 pr-2">
                  <Select
                    aria-label={`${row.integration} delivery`}
                    value={row.delivery}
                    onChange={(e) =>
                      patch((d) => ({
                        ...d,
                        integrations: d.integrations.map((x) =>
                          x.id === row.id
                            ? {
                                ...x,
                                delivery: e.target.value as DemoIntegrationDelivery,
                              }
                            : x,
                        ),
                      }))
                    }
                  >
                    {(Object.entries(DELIVERY_LABELS) as Array<[DemoIntegrationDelivery, string]>).map(
                      ([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ),
                    )}
                  </Select>
                </td>
                <td className="py-3 pr-2">
                  <input
                    type="checkbox"
                    aria-label={`Demo requested for ${row.integration}`}
                    checked={row.demoRequested}
                    onChange={(e) =>
                      patch((d) => ({
                        ...d,
                        integrations: d.integrations.map((x) =>
                          x.id === row.id
                            ? { ...x, demoRequested: e.target.checked }
                            : x,
                        ),
                      }))
                    }
                  />
                </td>
                <td className="py-3">
                  <Textarea
                    className="min-h-20 text-xs"
                    aria-label={`Test task for ${row.integration}`}
                    value={row.testTask}
                    onChange={(e) =>
                      patch((d) => ({
                        ...d,
                        integrations: d.integrations.map((x) =>
                          x.id === row.id
                            ? { ...x, testTask: e.target.value }
                            : x,
                        ),
                      }))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {draft.integrations.map((row) => (
          <div
            key={row.id}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
          >
            <Input
              aria-label="Integration name"
              value={row.integration}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  integrations: d.integrations.map((x) =>
                    x.id === row.id
                      ? { ...x, integration: e.target.value }
                      : x,
                  ),
                }))
              }
            />
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={row.required}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      integrations: d.integrations.map((x) =>
                        x.id === row.id
                          ? { ...x, required: e.target.checked }
                          : x,
                      ),
                    }))
                  }
                />
                Required
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={row.demoRequested}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      integrations: d.integrations.map((x) =>
                        x.id === row.id
                          ? { ...x, demoRequested: e.target.checked }
                          : x,
                      ),
                    }))
                  }
                />
                Demo requested
              </label>
            </div>
            <Select
              className="mt-2"
              aria-label={`${row.integration} delivery`}
              value={row.delivery}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  integrations: d.integrations.map((x) =>
                    x.id === row.id
                      ? {
                          ...x,
                          delivery: e.target.value as DemoIntegrationDelivery,
                        }
                      : x,
                  ),
                }))
              }
            >
              {(Object.entries(DELIVERY_LABELS) as Array<[DemoIntegrationDelivery, string]>).map(
                ([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ),
              )}
            </Select>
            <Textarea
              className="mt-2 min-h-20 text-xs"
              value={row.testTask}
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  integrations: d.integrations.map((x) =>
                    x.id === row.id
                      ? { ...x, testTask: e.target.value }
                      : x,
                  ),
                }))
              }
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() =>
          patch((d) => ({
            ...d,
            integrations: [
              ...d.integrations,
              {
                id: newDemoId("INT"),
                integration: "",
                required: false,
                delivery: "unknown",
                demoRequested: true,
                testTask: "",
                evidenceRequired: "",
                notes: "",
              },
            ],
          }))
        }
      >
        Add integration
      </Button>
    </div>
  );
}

export function DemoStepReportingAdmin({ draft, patch }: Props) {
  const reporting = draft.adminTasks.filter((t) => t.category === "reporting");
  const admin = draft.adminTasks.filter((t) => t.category === "administration");
  const ai = draft.adminTasks.filter((t) => t.category === "ai");

  const renderTasks = (
    title: string,
    tasks: typeof draft.adminTasks,
    extra?: ReactNode,
  ) => (
    <section className="mb-8">
      <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
        {title}
      </h3>
      {extra}
      <ul className="mt-3 space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={task.included}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      adminTasks: d.adminTasks.map((x) =>
                        x.id === task.id
                          ? { ...x, included: e.target.checked }
                          : x,
                      ),
                    }))
                  }
                />
                {task.label}
              </label>
              <Badge variant="neutral">
                {DEMO_ITEM_PRIORITY_LABELS[task.priority]}
              </Badge>
            </div>
            {task.included ? (
              <div className="mt-3 space-y-2">
                <Textarea
                  className="min-h-16 text-xs"
                  aria-label={`Vendor task for ${task.label}`}
                  value={task.vendorTask}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      adminTasks: d.adminTasks.map((x) =>
                        x.id === task.id
                          ? { ...x, vendorTask: e.target.value }
                          : x,
                      ),
                    }))
                  }
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Select
                    aria-label={`Priority for ${task.label}`}
                    value={task.priority}
                    onChange={(e) =>
                      patch((d) => ({
                        ...d,
                        adminTasks: d.adminTasks.map((x) =>
                          x.id === task.id
                            ? {
                                ...x,
                                priority: e.target.value as DemoItemPriority,
                              }
                            : x,
                        ),
                      }))
                    }
                  >
                    {(Object.entries(DEMO_ITEM_PRIORITY_LABELS) as Array<[DemoItemPriority, string]>).map(
                      ([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ),
                    )}
                  </Select>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    aria-label={`Minutes for ${task.label}`}
                    value={task.estimatedMinutes}
                    onChange={(e) =>
                      patch((d) => ({
                        ...d,
                        adminTasks: d.adminTasks.map((x) =>
                          x.id === task.id
                            ? {
                                ...x,
                                estimatedMinutes: Number(e.target.value) || 1,
                              }
                            : x,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div>
      <StepHeader
        stepLabel="Step 6"
        title="Reporting & admin"
        description="Tasks that prove reporting, configuration and AI behave as claimed — with evidence, not slides."
      />

      {renderTasks("Reporting", reporting)}
      {renderTasks("Administration", admin)}
      {renderTasks(
        "AI capabilities",
        ai,
        <div className="mt-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 px-3 py-2 text-xs text-[var(--sg-color-text-muted)]">
          <p className="font-medium text-[var(--sg-color-navy)]">
            Data-use reminder questions
          </p>
          <ul className="mt-1 list-inside list-disc">
            {AI_DATA_USE_REMINDERS.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>,
      )}
    </div>
  );
}

export function DemoStepCommercial({ draft, patch }: Props) {
  return (
    <div>
      <StepHeader
        stepLabel="Step 7"
        title="Commercial & implementation"
        description="Ask, don't demo — pricing, SLAs and contract terms belong in written follow-up unless you deliberately reserve time."
      />

      <ul className="space-y-3">
        {draft.commercialQuestions.map((q) => (
          <li
            key={q.id}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-3"
          >
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={q.included}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    commercialQuestions: d.commercialQuestions.map((x) =>
                      x.id === q.id ? { ...x, included: e.target.checked } : x,
                    ),
                  }))
                }
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[var(--sg-color-primary)]">
                  {q.topic}
                </p>
                <p className="mt-0.5 text-sm">{q.question}</p>
              </div>
            </label>
            {q.included ? (
              <Textarea
                className="mt-2 min-h-16 text-xs"
                placeholder="Vendor response / notes"
                value={q.notes}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    commercialQuestions: d.commercialQuestions.map((x) =>
                      x.id === q.id ? { ...x, notes: e.target.value } : x,
                    ),
                  }))
                }
              />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
