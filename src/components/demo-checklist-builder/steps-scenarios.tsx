"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Copy,
  Pencil,
  Plus,
} from "lucide-react";
import type {
  CrmDemoChecklistDraft,
  CrmDemoChecklistSession,
  DemoItemPriority,
  DemoScenario,
} from "@/domain";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  DEFAULT_EVALUATION_AREAS,
  DEMO_ITEM_PRIORITY_LABELS,
  computeRequirementsCoverage,
  countDemoTasks,
  countMustHaveChecks,
  estimateAgendaMinutes,
  hasDecisionProfile,
  hasRfpSession,
  importRequirementsFromProfile,
  importRequirementsFromRfp,
  includedScenarios,
  newDemoId,
} from "@/services/demo-checklist-builder";
import { StepHeader, type DemoDraftPatch } from "./step-header";

type Props = {
  draft: CrmDemoChecklistDraft;
  patch: DemoDraftPatch;
  session: CrmDemoChecklistSession;
  onSessionImport: (session: CrmDemoChecklistSession) => void;
  onTrackImport: (source: "profile" | "rfp", count: number) => void;
};

const CATEGORY_LABELS = new Map(
  DEFAULT_EVALUATION_AREAS.map((a) => [a.id, a.label]),
);

function categoryLabel(id: string): string {
  return CATEGORY_LABELS.get(id) ?? id.replace(/-/g, " ");
}

function priorityBadgeVariant(
  priority: DemoItemPriority,
): "danger" | "primary" | "neutral" {
  if (priority === "must-have") return "danger";
  if (priority === "should-have") return "primary";
  return "neutral";
}

function CoverageRing({ pct }: { pct: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div
      className="relative inline-flex size-12 items-center justify-center"
      role="img"
      aria-label={`${pct}% requirements coverage`}
    >
      <svg className="size-12 -rotate-90" viewBox="0 0 44 44" aria-hidden>
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="var(--sg-color-surface-muted)"
          strokeWidth="4"
        />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="var(--sg-color-primary)"
          strokeWidth="4"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-semibold tabular-nums text-[var(--sg-color-navy)]">
        {pct}%
      </span>
    </div>
  );
}

function emptyScenario(sortOrder: number): DemoScenario {
  return {
    id: newDemoId("SCN"),
    name: "",
    businessContext: "",
    persona: "",
    categoryId: "lead-management",
    startingState: "",
    vendorTasks: [""],
    expectedOutcome: "",
    successCriteria: [""],
    evidenceRequired: [""],
    requirementIds: [],
    priority: "should-have",
    estimatedMinutes: 10,
    moderatorScript: "",
    notes: "",
    sortOrder,
    included: true,
  };
}

function ScenarioEditor({
  scenario,
  onChange,
  onClose,
}: {
  scenario: DemoScenario;
  onChange: (next: DemoScenario) => void;
  onClose: () => void;
}) {
  const updateList = (
    field: "vendorTasks" | "successCriteria" | "evidenceRequired",
    index: number,
    value: string,
  ) => {
    const list = [...scenario[field]];
    list[index] = value;
    onChange({ ...scenario, [field]: list });
  };

  return (
    <div className="mt-3 space-y-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-primary-soft)]/20 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Scenario name" htmlFor={`scn-name-${scenario.id}`}>
          <Input
            id={`scn-name-${scenario.id}`}
            value={scenario.name}
            onChange={(e) => onChange({ ...scenario, name: e.target.value })}
          />
        </Field>
        <Field label="Persona" htmlFor={`scn-persona-${scenario.id}`}>
          <Input
            id={`scn-persona-${scenario.id}`}
            value={scenario.persona}
            onChange={(e) => onChange({ ...scenario, persona: e.target.value })}
          />
        </Field>
        <Field label="Category" htmlFor={`scn-cat-${scenario.id}`}>
          <Select
            id={`scn-cat-${scenario.id}`}
            value={scenario.categoryId}
            onChange={(e) =>
              onChange({ ...scenario, categoryId: e.target.value })
            }
          >
            {DEFAULT_EVALUATION_AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Priority" htmlFor={`scn-pri-${scenario.id}`}>
          <Select
            id={`scn-pri-${scenario.id}`}
            value={scenario.priority}
            onChange={(e) =>
              onChange({
                ...scenario,
                priority: e.target.value as DemoItemPriority,
              })
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
        </Field>
        <Field label="Estimated minutes" htmlFor={`scn-min-${scenario.id}`}>
          <Input
            id={`scn-min-${scenario.id}`}
            type="number"
            min={1}
            max={120}
            value={scenario.estimatedMinutes}
            onChange={(e) =>
              onChange({
                ...scenario,
                estimatedMinutes: Number(e.target.value) || 1,
              })
            }
          />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            checked={scenario.included}
            onChange={(e) =>
              onChange({ ...scenario, included: e.target.checked })
            }
          />
          Include in demo
        </label>
      </div>

      <Field label="Business context" htmlFor={`scn-ctx-${scenario.id}`}>
        <Textarea
          id={`scn-ctx-${scenario.id}`}
          value={scenario.businessContext}
          onChange={(e) =>
            onChange({ ...scenario, businessContext: e.target.value })
          }
          className="min-h-20"
        />
      </Field>
      <Field label="Starting state" htmlFor={`scn-start-${scenario.id}`}>
        <Textarea
          id={`scn-start-${scenario.id}`}
          value={scenario.startingState}
          onChange={(e) =>
            onChange({ ...scenario, startingState: e.target.value })
          }
          className="min-h-16"
        />
      </Field>

      <div>
        <p className="text-sm font-medium text-[var(--sg-color-text)]">
          Vendor tasks
        </p>
        <ul className="mt-2 space-y-2">
          {scenario.vendorTasks.map((task, i) => (
            <li key={i} className="flex gap-2">
              <Input
                aria-label={`Vendor task ${i + 1}`}
                value={task}
                onChange={(e) => updateList("vendorTasks", i, e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remove task ${i + 1}`}
                onClick={() => {
                  const next = scenario.vendorTasks.filter((_, j) => j !== i);
                  onChange({
                    ...scenario,
                    vendorTasks: next.length ? next : [""],
                  });
                }}
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() =>
            onChange({
              ...scenario,
              vendorTasks: [...scenario.vendorTasks, ""],
            })
          }
        >
          Add task
        </Button>
      </div>

      <Field label="Expected outcome" htmlFor={`scn-out-${scenario.id}`}>
        <Textarea
          id={`scn-out-${scenario.id}`}
          value={scenario.expectedOutcome}
          onChange={(e) =>
            onChange({ ...scenario, expectedOutcome: e.target.value })
          }
          className="min-h-16"
        />
      </Field>

      <div>
        <p className="text-sm font-medium text-[var(--sg-color-text)]">
          Success criteria
        </p>
        <ul className="mt-2 space-y-2">
          {scenario.successCriteria.map((c, i) => (
            <li key={i}>
              <Input
                aria-label={`Success criterion ${i + 1}`}
                value={c}
                onChange={(e) => updateList("successCriteria", i, e.target.value)}
              />
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() =>
            onChange({
              ...scenario,
              successCriteria: [...scenario.successCriteria, ""],
            })
          }
        >
          Add criterion
        </Button>
      </div>

      <div>
        <p className="text-sm font-medium text-[var(--sg-color-text)]">
          Evidence required
        </p>
        <ul className="mt-2 space-y-2">
          {scenario.evidenceRequired.map((e, i) => (
            <li key={i}>
              <Input
                aria-label={`Evidence ${i + 1}`}
                value={e}
                onChange={(ev) =>
                  updateList("evidenceRequired", i, ev.target.value)
                }
              />
            </li>
          ))}
        </ul>
      </div>

      <Field label="Moderator script" htmlFor={`scn-script-${scenario.id}`}>
        <Textarea
          id={`scn-script-${scenario.id}`}
          value={scenario.moderatorScript}
          onChange={(e) =>
            onChange({ ...scenario, moderatorScript: e.target.value })
          }
          className="min-h-32 font-mono text-xs"
        />
      </Field>
      <Field label="Notes" htmlFor={`scn-notes-${scenario.id}`}>
        <Textarea
          id={`scn-notes-${scenario.id}`}
          value={scenario.notes}
          onChange={(e) => onChange({ ...scenario, notes: e.target.value })}
          className="min-h-16"
        />
      </Field>

      <Button type="button" variant="secondary" size="sm" onClick={onClose}>
        Done editing
      </Button>
    </div>
  );
}

export function DemoStepScenarios({
  draft,
  patch,
  session,
  onSessionImport,
  onTrackImport,
}: Props) {
  const [tab, setTab] = useState<"list" | "script">("list");
  const [search, setSearch] = useState("");
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const coverage = useMemo(
    () => computeRequirementsCoverage(draft),
    [draft],
  );
  const scenarios = useMemo(
    () =>
      [...draft.scenarios].sort((a, b) => a.sortOrder - b.sortOrder),
    [draft.scenarios],
  );
  const included = includedScenarios(draft);
  const filtered = scenarios.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.persona.toLowerCase().includes(q) ||
      categoryLabel(s.categoryId).toLowerCase().includes(q)
    );
  });

  const grouped = useMemo(() => {
    if (!groupByCategory) return { All: filtered };
    const map = new Map<string, DemoScenario[]>();
    for (const s of filtered) {
      const key = categoryLabel(s.categoryId);
      const list = map.get(key) ?? [];
      list.push(s);
      map.set(key, list);
    }
    return Object.fromEntries(map);
  }, [filtered, groupByCategory]);

  const handleImportProfile = () => {
    const result = importRequirementsFromProfile(session);
    onSessionImport(result.session);
    onTrackImport("profile", result.importedCount);
  };

  const handleImportRfp = () => {
    const result = importRequirementsFromRfp(session);
    onSessionImport(result.session);
    onTrackImport("rfp", result.importedCount);
  };

  const updateScenario = (id: string, next: DemoScenario) => {
    patch((d) => ({
      ...d,
      scenarios: d.scenarios.map((s) => (s.id === id ? next : s)),
    }));
  };

  const duplicateScenario = (source: DemoScenario) => {
    patch((d) => ({
      ...d,
      scenarios: [
        ...d.scenarios,
        {
          ...source,
          id: newDemoId("SCN"),
          name: source.name ? `${source.name} (copy)` : "",
          sortOrder: d.scenarios.length,
          templateId: undefined,
          requirementIds: [],
          notes: "Duplicated scenario — review before demo.",
        },
      ],
    }));
  };

  return (
    <div>
      <StepHeader
        stepLabel="Step 3"
        title="Demo scenarios"
        description="Build observable workflows every vendor must run. Generated tasks from import are editable drafts — refine before sending."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {hasDecisionProfile() ? (
          <Button type="button" variant="outline" size="sm" onClick={handleImportProfile}>
            Import from Requirements
          </Button>
        ) : null}
        {hasRfpSession() ? (
          <Button type="button" variant="outline" size="sm" onClick={handleImportRfp}>
            Import from RFP
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          onClick={() =>
            patch((d) => ({
              ...d,
              scenarios: [...d.scenarios, emptyScenario(d.scenarios.length)],
            }))
          }
        >
          <Plus className="size-4" aria-hidden />
          Add scenario
        </Button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="p-3">
          <p className="text-[10px] font-semibold uppercase text-[var(--sg-color-text-muted)]">
            Scenarios
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
            {included.length}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-[10px] font-semibold uppercase text-[var(--sg-color-text-muted)]">
            Demo tasks
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
            {countDemoTasks(draft)}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-[10px] font-semibold uppercase text-[var(--sg-color-text-muted)]">
            Must-haves
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
            {countMustHaveChecks(draft)}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-[10px] font-semibold uppercase text-[var(--sg-color-text-muted)]">
            Est. time
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
            {estimateAgendaMinutes(draft)}m
          </p>
        </Card>
        <Card className="flex items-center gap-3 p-3">
          <CoverageRing pct={coverage.overallPct} />
          <div>
            <p className="text-[10px] font-semibold uppercase text-[var(--sg-color-text-muted)]">
              Coverage
            </p>
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              Requirements mapped
            </p>
          </div>
        </Card>
      </div>

      <div
        className="mb-4 flex gap-1 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-1"
        role="tablist"
        aria-label="Scenario views"
      >
        {(["list", "script"] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={cn(
              "flex-1 rounded-[var(--sg-radius-sm)] px-3 py-2 text-sm font-medium transition",
              tab === id
                ? "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                : "text-[var(--sg-color-text-muted)]",
            )}
            onClick={() => setTab(id)}
          >
            {id === "list" ? "Scenario list" : "Script view"}
          </button>
        ))}
      </div>

      {tab === "list" ? (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Field label="Search" htmlFor="demo-scn-search" hint="">
              <Input
                id="demo-scn-search"
                type="search"
                placeholder="Search scenarios…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sm:min-w-[14rem]"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-[var(--sg-color-text-muted)]">
              <input
                type="checkbox"
                checked={groupByCategory}
                onChange={(e) => setGroupByCategory(e.target.checked)}
              />
              Group by category
            </label>
          </div>

          <div className="space-y-6">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                {groupByCategory ? (
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    {group}
                  </h3>
                ) : null}
                <ul className="space-y-2">
                  {items.map((scenario) => {
                    const expanded = expandedId === scenario.id;
                    return (
                      <li
                        key={scenario.id}
                        className={cn(
                          "rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-3",
                          !scenario.included && "opacity-60",
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-[var(--sg-color-navy)]">
                              {scenario.name || "Untitled scenario"}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              {scenario.persona ? (
                                <span className="text-xs text-[var(--sg-color-text-muted)]">
                                  {scenario.persona}
                                </span>
                              ) : null}
                              <Badge variant="neutral">
                                {categoryLabel(scenario.categoryId)}
                              </Badge>
                              <Badge variant={priorityBadgeVariant(scenario.priority)}>
                                {DEMO_ITEM_PRIORITY_LABELS[scenario.priority]}
                              </Badge>
                              <span className="text-xs tabular-nums text-[var(--sg-color-text-muted)]">
                                {scenario.estimatedMinutes} min
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              aria-label={`Edit ${scenario.name || "scenario"}`}
                              onClick={() =>
                                setExpandedId(expanded ? null : scenario.id)
                              }
                            >
                              <Pencil className="size-4" aria-hidden />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              aria-label={`Duplicate ${scenario.name || "scenario"}`}
                              onClick={() => duplicateScenario(scenario)}
                            >
                              <Copy className="size-4" aria-hidden />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              aria-expanded={expanded}
                              aria-label={expanded ? "Collapse" : "Expand"}
                              onClick={() =>
                                setExpandedId(expanded ? null : scenario.id)
                              }
                            >
                              <ChevronDown
                                className={cn(
                                  "size-4 transition",
                                  expanded && "rotate-180",
                                )}
                                aria-hidden
                              />
                            </Button>
                          </div>
                        </div>
                        {expanded ? (
                          <ScenarioEditor
                            scenario={scenario}
                            onChange={(next) => updateScenario(scenario.id, next)}
                            onClose={() => setExpandedId(null)}
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {included.map((scenario, index) => (
            <Card key={scenario.id} className="p-4">
              <p className="text-xs font-semibold text-[var(--sg-color-primary)]">
                Scenario {index + 1} · {scenario.estimatedMinutes} min
              </p>
              <h3 className="mt-1 font-semibold text-[var(--sg-color-navy)]">
                {scenario.name || "Untitled"}
              </h3>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-[var(--sg-color-text)]">
                {scenario.moderatorScript ||
                  [
                    scenario.businessContext,
                    "",
                    "Ask vendor to:",
                    ...scenario.vendorTasks.map((t, i) => `${i + 1}. ${t}`),
                  ].join("\n")}
              </pre>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-warning)]/40 bg-[var(--sg-color-warning-soft)]/40 px-4 py-3 text-sm text-[var(--sg-color-text)]">
        <AlertTriangle
          className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-warning)]"
          aria-hidden
        />
        <p>
          Use the same script for every vendor. If a capability cannot be
          demonstrated, the vendor should say so — vendor stated ≠ demonstrated.
        </p>
      </div>
    </div>
  );
}
