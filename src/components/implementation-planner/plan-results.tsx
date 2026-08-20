"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Check,
  Copy,
  Download,
  Plus,
  Printer,
  RotateCcw,
} from "lucide-react";
import { track } from "@/analytics";
import type { CrmImplementationPlan, PlanTaskStatus } from "@/domain";
import {
  addUserTask,
  planCompletionPercent,
  setTaskStatus,
  updateTask,
  ROLE_LABELS,
} from "@/services/implementation-planner";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { ImplementationTimeline } from "./timeline";
import { PhaseOverviewCards } from "./phase-overview-cards";
import { UatChecklistPanel } from "./uat-panel";

const RESULT_TABS = [
  { id: "overview", label: "Plan Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "tasks", label: "Tasks" },
  { id: "dependencies", label: "Dependencies" },
  { id: "risks", label: "Risks" },
  { id: "gaps", label: "Readiness Gaps" },
  { id: "golive", label: "Go-Live Checklist" },
  { id: "uat", label: "UAT" },
  { id: "export", label: "Export" },
] as const;

export type ResultTab = (typeof RESULT_TABS)[number]["id"];

export function PlanResults({
  plan,
  setPlan,
  resultTab,
  setResultTab,
  timelineView,
  setTimelineView,
  mobileTab,
  openRisks,
  newTaskTitle,
  setNewTaskTitle,
  onCopy,
  copyDone,
  onCsv,
  onPrint,
  onReset,
  onRegenerate,
  resourceLinks,
}: {
  plan: CrmImplementationPlan;
  setPlan: Dispatch<SetStateAction<CrmImplementationPlan>>;
  resultTab: ResultTab;
  setResultTab: (t: ResultTab) => void;
  timelineView: "gantt" | "list";
  setTimelineView: (v: "gantt" | "list") => void;
  mobileTab: "plan" | "tasks" | "risks";
  openRisks: number;
  newTaskTitle: string;
  setNewTaskTitle: (v: string) => void;
  onCopy: () => void;
  copyDone: boolean;
  onCsv: () => void;
  onPrint: () => void;
  onReset: () => void;
  onRegenerate: () => void;
  resourceLinks: Array<{ href: string; label: string }>;
}) {
  const completed = planCompletionPercent(plan);
  const phases = plan.phases.filter((p) => p.included);

  useEffect(() => {
    if (resultTab === "timeline" || resultTab === "overview") {
      track({
        name: "implementation_phase_viewed",
        properties: { tab: resultTab },
      });
    }
  }, [resultTab]);

  return (
    <div className="mt-4 space-y-6">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          CRM Implementation Plan
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
          {plan.productName ?? "Vendor-neutral implementation"}
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Based on the scope entered, this plan currently spans approximately{" "}
          {plan.planningDurationWeeks} weeks.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="primary">
            {plan.complexity?.level ?? "—"} complexity
          </Badge>
          <Badge variant="neutral">{phases.length} phases</Badge>
          <Badge variant="neutral">{plan.tasks.length} tasks</Badge>
          <Badge variant={openRisks > 0 ? "warning" : "success"}>
            {openRisks} open risks
          </Badge>
          <Badge variant="neutral">{completed}% complete</Badge>
        </div>
        {plan.complexity?.drivers.length ? (
          <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
            Main drivers:{" "}
            {plan.complexity.drivers.map((d) => d.label).join(" · ")}
          </p>
        ) : null}
      </header>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Selected CRM", plan.productName ?? "Vendor-neutral"],
          ["Users", plan.scope.users?.toString() ?? "—"],
          ["Migration", plan.scope.migrationSource],
          [
            "Integrations",
            String(
              new Set(plan.tasks.flatMap((t) => t.integrationIds)).size ||
                "—",
            ),
          ],
          ["Target", plan.targetGoLive ?? "No fixed date"],
          ["Complexity", plan.complexity?.level ?? "—"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2"
          >
            <p className="text-[11px] text-[var(--sg-color-text-muted)]">
              {label}
            </p>
            <p className="text-sm font-semibold capitalize text-[var(--sg-color-navy)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="flex flex-wrap gap-1 border-b border-[var(--sg-color-border)] pb-2"
        role="tablist"
        aria-label="Plan sections"
      >
        {RESULT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={resultTab === tab.id}
            onClick={() => setResultTab(tab.id)}
            className={cn(
              "rounded-[var(--sg-radius-md)] px-3 py-1.5 text-sm",
              resultTab === tab.id
                ? "bg-[var(--sg-color-primary)] text-white"
                : "text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)]",
              mobileTab === "tasks" &&
                tab.id !== "tasks" &&
                tab.id !== "overview" &&
                "lg:inline-flex",
            )}
          >
            {tab.label}
            {tab.id === "risks" ? ` (${openRisks})` : ""}
            {tab.id === "gaps"
              ? ` (${plan.readinessGaps.filter((g) => !g.resolved).length})`
              : ""}
          </button>
        ))}
      </div>

      {resultTab === "overview" || resultTab === "timeline" ? (
        <section aria-labelledby="timeline-heading">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3
              id="timeline-heading"
              className="font-semibold text-[var(--sg-color-navy)]"
            >
              Implementation timeline ({plan.planningDurationWeeks} weeks)
            </h3>
            <div className="flex gap-1">
              <button
                type="button"
                className={cn(
                  "rounded px-2 py-1 text-xs",
                  timelineView === "gantt"
                    ? "bg-[var(--sg-color-primary)] text-white"
                    : "bg-[var(--sg-color-surface-muted)]",
                )}
                onClick={() => setTimelineView("gantt")}
              >
                Gantt view
              </button>
              <button
                type="button"
                className={cn(
                  "rounded px-2 py-1 text-xs",
                  timelineView === "list"
                    ? "bg-[var(--sg-color-primary)] text-white"
                    : "bg-[var(--sg-color-surface-muted)]",
                )}
                onClick={() => setTimelineView("list")}
              >
                List view
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <ImplementationTimeline plan={plan} view={timelineView} />
          </div>
          <div className="md:hidden">
            <ImplementationTimeline plan={plan} view="list" />
          </div>

          <PhaseOverviewCards
            plan={plan}
            onSelectPhase={() => setResultTab("tasks")}
          />
        </section>
      ) : null}

      {resultTab === "tasks" ? (
        <TasksPanel
          plan={plan}
          setPlan={setPlan}
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
        />
      ) : null}

      {resultTab === "dependencies" ? (
        <section className="space-y-3" aria-labelledby="deps-heading">
          <h3 id="deps-heading" className="font-semibold text-[var(--sg-color-navy)]">
            Dependencies
          </h3>
          <ul className="space-y-2 text-sm">
            {plan.tasks
              .filter((t) => t.dependencyIds.length > 0)
              .slice(0, 40)
              .map((t) => (
                <li
                  key={t.id}
                  className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
                >
                  <p className="font-medium">
                    {t.title}
                    {t.criticalPath ? (
                      <Badge variant="warning" className="ml-2">
                        Critical dependency
                      </Badge>
                    ) : null}
                  </p>
                  <p className="mt-1 text-[var(--sg-color-text-muted)]">
                    Depends on:{" "}
                    {t.dependencyIds
                      .map(
                        (id) =>
                          plan.tasks.find((x) => x.id === id)?.title ?? id,
                      )
                      .join(" → ")}
                  </p>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {resultTab === "risks" ? (
        <section className="space-y-3" aria-labelledby="risks-heading">
          <h3 id="risks-heading" className="font-semibold text-[var(--sg-color-navy)]">
            Implementation risks
          </h3>
          {plan.risks.length === 0 ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              No automatic risks from the current profile and scope.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {plan.risks.map((risk) => (
                <li
                  key={risk.id}
                  className={cn(
                    "rounded-[var(--sg-radius-md)] border p-4 text-sm",
                    risk.severity === "high" || risk.severity === "blocker"
                      ? "border-red-200 bg-red-50"
                      : risk.severity === "medium"
                        ? "border-amber-200 bg-amber-50"
                        : "border-[var(--sg-color-border)]",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[var(--sg-color-navy)]">
                      {risk.title}
                    </p>
                    <Badge
                      variant={
                        risk.severity === "high" || risk.severity === "blocker"
                          ? "danger"
                          : risk.severity === "medium"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {risk.severity}
                    </Badge>
                    <span className="text-[11px] text-[var(--sg-color-text-muted)]">
                      {risk.status}
                    </span>
                  </div>
                  <p className="mt-2 text-[var(--sg-color-text-muted)]">
                    {risk.reason}
                  </p>
                  <p className="mt-2">
                    <strong>Action:</strong> {risk.recommendedAction}
                  </p>
                  {risk.status === "open" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => {
                        setPlan((p) => ({
                          ...p,
                          risks: p.risks.map((r) =>
                            r.id === risk.id
                              ? { ...r, status: "resolved" }
                              : r,
                          ),
                        }));
                        track({ name: "implementation_risk_resolved" });
                      }}
                    >
                      Mark resolved
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {plan.risks.some((r) => r.id.startsWith("risk-int-") || r.id.startsWith("risk-req-")) ? (
            <ButtonLink
              href="/tools/crm-vendor-scorecard/?from=implementation"
              variant="outline"
              size="sm"
            >
              Return to Vendor Scorecard
            </ButtonLink>
          ) : null}
        </section>
      ) : null}

      {resultTab === "gaps" ? (
        <section className="space-y-3" aria-labelledby="gaps-heading">
          <h3 id="gaps-heading" className="font-semibold text-[var(--sg-color-navy)]">
            Readiness gaps — before implementation starts
          </h3>
          <ul className="space-y-2">
            {plan.readinessGaps.map((gap) => (
              <li
                key={gap.id}
                className="flex items-start gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={gap.resolved}
                  aria-label={`Resolved: ${gap.title}`}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      readinessGaps: p.readinessGaps.map((g) =>
                        g.id === gap.id
                          ? { ...g, resolved: e.target.checked }
                          : g,
                      ),
                    }))
                  }
                />
                <div>
                  <p className="font-medium">
                    <Badge variant="neutral" className="mr-2">
                      {gap.kind}
                    </Badge>
                    {gap.title}
                  </p>
                  <p className="text-[var(--sg-color-text-muted)]">
                    {gap.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {resultTab === "golive" ? (
        <section className="space-y-4" aria-labelledby="golive-heading">
          <h3 id="golive-heading" className="font-semibold text-[var(--sg-color-navy)]">
            Go-live checklist
          </h3>
          <ul className="space-y-2">
            {plan.goLiveChecklist.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={item.status === "done"}
                  aria-label={item.label}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      goLiveChecklist: p.goLiveChecklist.map((g) =>
                        g.id === item.id
                          ? {
                              ...g,
                              status: e.target.checked ? "done" : "pending",
                            }
                          : g,
                      ),
                    }))
                  }
                />
                <span>{item.label}</span>
                <span className="text-[11px] text-[var(--sg-color-text-muted)]">
                  {item.category}
                </span>
              </li>
            ))}
          </ul>
          <div id="roles" className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-4">
            <h4 className="font-medium text-[var(--sg-color-navy)]">
              Who needs to be involved?
            </h4>
            <ul className="mt-3 space-y-2">
              {plan.roles.map((role) => (
                <li
                  key={role.roleId}
                  className="flex flex-wrap items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={role.assigned}
                    aria-label={`Assign ${ROLE_LABELS[role.roleId]}`}
                    onChange={(e) =>
                      setPlan((p) => ({
                        ...p,
                        roles: p.roles.map((r) =>
                          r.roleId === role.roleId
                            ? { ...r, assigned: e.target.checked }
                            : r,
                        ),
                      }))
                    }
                  />
                  <span className="font-medium">
                    {ROLE_LABELS[role.roleId]}
                  </span>
                  <input
                    type="text"
                    placeholder="Label (optional)"
                    className="rounded border border-[var(--sg-color-border)] px-2 py-1 text-xs"
                    value={role.label ?? ""}
                    onChange={(e) =>
                      setPlan((p) => ({
                        ...p,
                        roles: p.roles.map((r) =>
                          r.roleId === role.roleId
                            ? { ...r, label: e.target.value }
                            : r,
                        ),
                      }))
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-[var(--sg-color-navy)]">
              Post-go-live milestones
            </h4>
            <ul className="mt-2 list-inside list-disc text-sm text-[var(--sg-color-text-muted)]">
              {plan.milestones.map((m) => (
                <li key={m.id}>
                  {m.label}
                  {m.weekOffset != null ? ` (week ${m.weekOffset})` : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {resultTab === "uat" ? (
        <UatChecklistPanel plan={plan} setPlan={setPlan} />
      ) : null}

      {resultTab === "export" ? (
        <section className="space-y-4" aria-labelledby="export-heading">
          <h3 id="export-heading" className="font-semibold text-[var(--sg-color-navy)]">
            Export
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onCopy} variant="outline">
              {copyDone ? (
                <>
                  <Check className="size-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" /> Copy plan
                </>
              )}
            </Button>
            <Button onClick={onCsv} variant="outline">
              <Download className="size-4" /> Download CSV
            </Button>
            <Button onClick={onPrint} variant="outline">
              <Printer className="size-4" /> Print plan
            </Button>
          </div>
          <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 p-4 text-sm">
            <p className="font-medium text-[var(--sg-color-navy)]">
              Update my TCO assumptions
            </p>
            <p className="mt-1 text-[var(--sg-color-text-muted)]">
              Pass planning duration, users and integration count to TCO only
              after you confirm — nothing is overwritten automatically.
            </p>
            <ButtonLink
              href="/tools/crm-tco-calculator/?from=implementation"
              size="sm"
              className="mt-3"
              onClick={() => track({ name: "implementation_to_tco" })}
            >
              Open TCO calculator →
            </ButtonLink>
          </div>
          <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 p-4 text-sm">
            <p className="font-medium text-[var(--sg-color-navy)]">
              Build a detailed migration plan
            </p>
            <p className="mt-1 text-[var(--sg-color-text-muted)]">
              Deepen field mapping, cleaning, test imports and cutover in the
              CRM Migration Planner.
            </p>
            <ButtonLink
              href="/tools/crm-migration-planner/?from=implementation"
              size="sm"
              className="mt-3"
              onClick={() => track({ name: "implementation_to_migration" })}
            >
              Open Migration Planner →
            </ButtonLink>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" onClick={onRegenerate}>
              Regenerate from profile
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="size-4" /> Reset plan
            </Button>
          </div>
        </section>
      ) : null}

      {resultTab === "overview" && plan.risks.filter((r) => r.status === "open").length > 0 ? (
        <section aria-labelledby="top-risks">
          <h3 id="top-risks" className="font-semibold text-[var(--sg-color-navy)]">
            Top risks
          </h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {plan.risks
              .filter((r) => r.status === "open")
              .slice(0, 4)
              .map((r) => (
                <li
                  key={r.id}
                  className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm"
                >
                  <Badge
                    variant={
                      r.severity === "high" || r.severity === "blocker"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {r.severity}
                  </Badge>{" "}
                  {r.title}
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {resourceLinks.length > 0 ? (
        <section aria-labelledby="related-guides">
          <h3
            id="related-guides"
            className="text-sm font-semibold text-[var(--sg-color-navy)]"
          >
            Related guides & tools
          </h3>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {resourceLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function TasksPanel({
  plan,
  setPlan,
  newTaskTitle,
  setNewTaskTitle,
}: {
  plan: CrmImplementationPlan;
  setPlan: Dispatch<SetStateAction<CrmImplementationPlan>>;
  newTaskTitle: string;
  setNewTaskTitle: (v: string) => void;
}) {
  const phases = plan.phases.filter((p) => p.included);
  const [activePhase, setActivePhase] = useState(phases[0]?.id);

  return (
    <section className="space-y-4" aria-labelledby="tasks-heading">
      <h3 id="tasks-heading" className="font-semibold text-[var(--sg-color-navy)]">
        Tasks
      </h3>
      <div className="flex flex-wrap gap-1">
        {phases.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActivePhase(p.id)}
            className={cn(
              "rounded-[var(--sg-radius-md)] px-2 py-1 text-xs",
              activePhase === p.id
                ? "bg-[var(--sg-color-primary)] text-white"
                : "bg-[var(--sg-color-surface-muted)]",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {plan.tasks
          .filter((t) => t.phaseId === activePhase)
          .map((task) => (
            <li
              key={task.id}
              className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm"
            >
              <div className="flex flex-wrap items-start gap-2">
                <select
                  className="rounded border border-[var(--sg-color-border)] px-1 py-0.5 text-xs"
                  value={task.status}
                  aria-label={`Status for ${task.title}`}
                  onChange={(e) => {
                    const status = e.target.value as PlanTaskStatus;
                    setPlan((p) => setTaskStatus(p, task.id, status));
                    if (status === "complete") {
                      track({ name: "implementation_task_completed" });
                    }
                  }}
                >
                  <option value="not-started">Not started</option>
                  <option value="in-progress">In progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="complete">Complete</option>
                  <option value="not-applicable">N/A</option>
                </select>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{task.title}</p>
                  {task.reason ? (
                    <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                      Why: {task.reason}
                    </p>
                  ) : null}
                  <p className="mt-0.5 text-[11px] text-[var(--sg-color-text-muted)]">
                    {task.sourceType}
                    {task.ownerRole
                      ? ` · ${ROLE_LABELS[task.ownerRole]}`
                      : ""}
                    {task.criticalPath ? " · Critical path" : ""}
                  </p>
                  <label className="mt-1 block text-xs">
                    Notes
                    <input
                      type="text"
                      className="mt-0.5 w-full rounded border border-[var(--sg-color-border)] px-2 py-1"
                      value={task.notes ?? ""}
                      onChange={(e) =>
                        setPlan((p) =>
                          updateTask(p, task.id, { notes: e.target.value }),
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </li>
          ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Add a custom task"
          className="min-w-[200px] flex-1 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          aria-label="New task title"
        />
        <Button
          size="sm"
          disabled={!newTaskTitle.trim() || !activePhase}
          onClick={() => {
            if (!activePhase || !newTaskTitle.trim()) return;
            setPlan((p) =>
              addUserTask(p, {
                phaseId: activePhase,
                title: newTaskTitle.trim(),
              }),
            );
            setNewTaskTitle("");
            track({ name: "implementation_task_added" });
          }}
        >
          <Plus className="size-4" /> Add task
        </Button>
      </div>
    </section>
  );
}
