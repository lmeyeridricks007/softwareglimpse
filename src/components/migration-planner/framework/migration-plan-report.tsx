"use client";

import { ArrowRight, Check, CircleAlert, CircleDashed } from "lucide-react";
import type { CrmMigrationPlan } from "@/domain";
import {
  buildMigrationDashboard,
  complexityLevelLabel,
  fieldMappingProgress,
  migrationChecklistText,
  potentialDataLossWarnings,
} from "@/services/migration-planner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { FieldStatusChip, ProgressBar, SeverityChip } from "./status";

const CUTOVER_LABELS: Record<string, string> = {
  "t-minus-7": "T−7",
  "t-minus-5": "T−5",
  "t-minus-3": "T−3",
  "t-minus-1": "T−1",
  "t-0": "T0",
  "t-plus-1": "T+1",
  custom: "Custom",
};

type Props = {
  plan: CrmMigrationPlan;
  resultsReady?: boolean;
  onGenerateOutput?: () => void;
  onContinueExport?: () => void;
  onJump?: (sectionId: string) => void;
  onDownloadPlan?: () => void;
  onDownloadWorkbook?: () => void;
  className?: string;
};

function StackedBar({
  segments,
  label,
}: {
  label: string;
  segments: Array<{ key: string; count: number; className: string; label: string }>;
}) {
  const total = segments.reduce((s, x) => s + x.count, 0) || 1;
  return (
    <div>
      <p className="text-xs font-medium text-[var(--sg-color-text-muted)]">{label}</p>
      <div
        className="mt-2 flex h-3 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
        role="img"
        aria-label={`${label}: ${segments
          .filter((s) => s.count > 0)
          .map((s) => `${s.label} ${s.count}`)
          .join(", ")}`}
      >
        {segments.map((s) =>
          s.count > 0 ? (
            <div
              key={s.key}
              className={cn("h-full", s.className)}
              style={{ width: `${(s.count / total) * 100}%` }}
              title={`${s.label}: ${s.count}`}
            />
          ) : null,
        )}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--sg-color-text-muted)]">
        {segments
          .filter((s) => s.count > 0)
          .map((s) => (
            <li key={s.key} className="inline-flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", s.className)} aria-hidden />
              {s.label} ({s.count})
            </li>
          ))}
      </ul>
    </div>
  );
}

function FlowNode({
  title,
  subtitle,
  tone = "neutral",
}: {
  title: string;
  subtitle?: string;
  tone?: "neutral" | "primary" | "success";
}) {
  return (
    <div
      className={cn(
        "min-w-0 flex-1 rounded-[var(--sg-radius-lg)] border px-3 py-3 text-center",
        tone === "primary" &&
          "border-[var(--sg-color-primary)]/40 bg-[var(--sg-color-primary-soft)]/40",
        tone === "success" &&
          "border-[var(--sg-color-success)]/30 bg-[var(--sg-color-success-soft)]/40",
        tone === "neutral" &&
          "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]",
      )}
    >
      <p className="truncate text-sm font-semibold text-[var(--sg-color-navy)]">
        {title}
      </p>
      {subtitle ? (
        <p className="mt-0.5 truncate text-xs text-[var(--sg-color-text-muted)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Visual final report for the migration plan — not an ETL execution view.
 */
export function MigrationPlanReport({
  plan,
  resultsReady = false,
  onGenerateOutput,
  onContinueExport,
  onJump,
  onDownloadPlan,
  onDownloadWorkbook,
  className,
}: Props) {
  const dashboard = buildMigrationDashboard(plan);
  const progress = fieldMappingProgress(plan);
  const warnings = potentialDataLossWarnings(plan);
  const checklist = migrationChecklistText(plan);

  const fieldSegments = [
    {
      key: "mapped",
      count: progress.mapped,
      label: "Mapped",
      className: "bg-[var(--sg-color-success)]",
    },
    {
      key: "review",
      count: progress.needsReview,
      label: "Needs review",
      className: "bg-[var(--sg-color-warning)]",
    },
    {
      key: "suggested",
      count: progress.suggested,
      label: "Suggested",
      className: "bg-[var(--sg-color-primary)]",
    },
    {
      key: "no-target",
      count: progress.noTarget,
      label: "No target",
      className: "bg-[var(--sg-color-danger)]",
    },
    {
      key: "excluded",
      count: progress.excluded,
      label: "Excluded",
      className: "bg-[var(--sg-color-text-muted)]",
    },
    {
      key: "other",
      count: Math.max(
        0,
        progress.total -
          progress.mapped -
          progress.needsReview -
          progress.suggested -
          progress.noTarget -
          progress.excluded,
      ),
      label: "Unknown / other",
      className: "bg-[var(--sg-color-border)]",
    },
  ];

  const riskBuckets = [
    {
      key: "blocker",
      count: plan.risks.filter((r) => r.severity === "blocker" && r.status !== "resolved").length,
      label: "Blocker",
      className: "bg-[var(--sg-color-danger)]",
    },
    {
      key: "high",
      count: plan.risks.filter((r) => r.severity === "high" && r.status !== "resolved").length,
      label: "High",
      className: "bg-[var(--sg-color-danger)]/70",
    },
    {
      key: "medium",
      count: plan.risks.filter((r) => r.severity === "medium" && r.status !== "resolved").length,
      label: "Medium",
      className: "bg-[var(--sg-color-warning)]",
    },
    {
      key: "low",
      count: plan.risks.filter((r) => r.severity === "low" && r.status !== "resolved").length,
      label: "Low",
      className: "bg-[var(--sg-color-text-muted)]",
    },
  ];

  const maxObjectRecords = Math.max(
    1,
    ...plan.objects.map((o) => o.recordCount ?? 0),
  );

  const readinessReady = plan.readinessGaps.filter((g) => g.state === "ready").length;
  const readinessWork = plan.readinessGaps.filter((g) => g.state === "needs-work").length;
  const readinessBlocked = plan.readinessGaps.filter((g) => g.state === "blocked").length;

  const sourceLabel =
    plan.sourceSystems.length === 0
      ? "No sources yet"
      : plan.sourceSystems.length === 1
        ? plan.sourceSystems[0]!.name
        : `${plan.sourceSystems.length} sources`;

  return (
    <div className={cn("space-y-6", className)}>
      <header className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/25 bg-[linear-gradient(135deg,rgb(37_99_235/0.10),transparent_55%)] p-5 sm:p-6">
        {resultsReady ? (
          <p className="inline-flex items-center gap-1.5 rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-success-soft)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
            <Check className="size-3.5" aria-hidden />
            Plan ready
          </p>
        ) : (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Your migration plan
          </p>
        )}
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)] sm:text-3xl">
          {resultsReady
            ? "Your CRM migration plan results"
            : dashboard.targetLabel === "Not selected" ||
                dashboard.targetLabel === "Vendor-neutral"
              ? "Vendor-neutral CRM migration plan"
              : `Migration plan → ${dashboard.targetLabel}`}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          {resultsReady
            ? "Review the visual summary below. This is a planning report — SoftwareGlimpse does not move CRM data."
            : "Planning summary only — SoftwareGlimpse does not move data. Review the flow, readiness and risks below, then export or hand off."}
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {[
            { label: "Sources", value: String(dashboard.sourceCount) },
            { label: "Objects", value: String(dashboard.objectCount) },
            {
              label: "Records",
              value:
                dashboard.recordEstimate == null
                  ? "—"
                  : `~${dashboard.recordEstimate.toLocaleString()}`,
            },
            {
              label: "Complexity",
              value: dashboard.complexityLabel ?? "—",
            },
            {
              label: "Fields mapped",
              value:
                progress.percentMapped == null
                  ? "—"
                  : `${progress.mapped}/${progress.total}`,
            },
            {
              label: "Go-live",
              value: plan.targetGoLive ?? "—",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)]/80 bg-[var(--sg-color-surface)]/80 px-3 py-2"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                {item.label}
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-[var(--sg-color-navy)]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Flow visualization */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Migration flow
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Conceptual path from sources to target — not an automated pipeline.
        </p>
        <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <FlowNode
            title={sourceLabel}
            subtitle={plan.sourceSystems.map((s) => s.type).join(", ") || "Add sources"}
            tone="neutral"
          />
          <ArrowRight
            className="mx-auto size-5 shrink-0 text-[var(--sg-color-primary)] sm:mx-0"
            aria-hidden
          />
          <FlowNode
            title={`${dashboard.objectCount} object(s)`}
            subtitle={
              progress.total > 0
                ? `${progress.total} fields in mapping`
                : "Inventory & mapping"
            }
            tone="primary"
          />
          <ArrowRight
            className="mx-auto size-5 shrink-0 text-[var(--sg-color-primary)] sm:mx-0"
            aria-hidden
          />
          <FlowNode
            title={dashboard.targetLabel}
            subtitle={
              plan.targetPlanLabel
                ? plan.targetPlanLabel
                : plan.migrationResearchStatus === "not-researched"
                  ? "Import support not covered"
                  : `Research: ${plan.migrationResearchStatus}`
            }
            tone="success"
          />
        </div>
        {plan.complexity?.drivers.length ? (
          <div className="mt-4 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)]/60 px-3 py-2">
            <p className="text-xs font-medium text-[var(--sg-color-text)]">
              Why complexity is{" "}
              {plan.complexity
                ? complexityLevelLabel(plan.complexity.level)
                : "—"}
            </p>
            <ul className="mt-1 flex flex-wrap gap-2">
              {plan.complexity.drivers.map((d) => (
                <li key={d.id}>
                  <Badge variant="neutral">{d.label}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Field mapping status
          </h3>
          <ProgressBar
            className="mt-3"
            label="Confirmed mapped"
            value={progress.percentMapped}
          />
          <div className="mt-4">
            <StackedBar label="Breakdown" segments={fieldSegments} />
          </div>
          {onJump ? (
            <Button
              className="mt-4"
              size="sm"
              variant="outline"
              onClick={() => onJump("field-mapping")}
            >
              Review field mapping
            </Button>
          ) : null}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Risk severity
          </h3>
          <div className="mt-4">
            <StackedBar label="Open / mitigating risks" segments={riskBuckets} />
          </div>
          <ul className="mt-4 space-y-2">
            {plan.risks
              .filter((r) => r.status === "open" || r.status === "mitigating")
              .slice(0, 4)
              .map((r) => (
                <li
                  key={r.id}
                  className="flex items-start justify-between gap-2 text-sm"
                >
                  <span className="text-[var(--sg-color-text)]">{r.title}</span>
                  <SeverityChip severity={r.severity} />
                </li>
              ))}
            {plan.risks.filter((r) => r.status === "open" || r.status === "mitigating")
              .length === 0 ? (
              <li className="text-sm text-[var(--sg-color-text-muted)]">
                No open risks generated yet.
              </li>
            ) : null}
          </ul>
        </Card>
      </div>

      {/* Object inventory bars */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Object inventory
        </h3>
        <ul className="mt-4 space-y-3">
          {plan.objects.length === 0 ? (
            <li className="text-sm text-[var(--sg-color-text-muted)]">
              No objects in inventory yet.
            </li>
          ) : (
            plan.objects.map((o) => {
              const width =
                o.recordCount != null
                  ? Math.max(8, (o.recordCount / maxObjectRecords) * 100)
                  : 12;
              return (
                <li key={o.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-[var(--sg-color-navy)]">
                      {o.sourceObjectLabel}
                      {o.targetObjectLabel ? (
                        <span className="font-normal text-[var(--sg-color-text-muted)]">
                          {" "}
                          → {o.targetObjectLabel}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-xs text-[var(--sg-color-text-muted)]">
                      {o.recordCount == null
                        ? "count unknown"
                        : o.recordCount.toLocaleString()}{" "}
                      · {o.priority.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-[var(--sg-color-surface-muted)]">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        o.priority === "must-migrate" &&
                          "bg-[var(--sg-color-primary)]",
                        o.priority === "should-migrate" &&
                          "bg-[var(--sg-color-primary)]/60",
                        o.priority === "archive-only" &&
                          "bg-[var(--sg-color-warning)]",
                        (o.priority === "do-not-migrate" ||
                          o.priority === "unknown") &&
                          "bg-[var(--sg-color-border)]",
                      )}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </Card>

      {/* Cutover timeline */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Cutover timeline
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Planning defaults — editable in the Cutover step. Not universal
          requirements.
        </p>
        <ol className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {plan.cutoverSteps.map((step, index) => {
            const done = step.status === "done";
            return (
              <li
                key={step.id}
                className="relative flex min-w-[7.5rem] flex-1 flex-col items-center"
              >
                {index < plan.cutoverSteps.length - 1 ? (
                  <span
                    className="absolute top-3 left-[calc(50%+0.75rem)] right-[calc(-50%+0.75rem)] h-0.5 bg-[var(--sg-color-border)]"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    "relative z-[1] inline-flex size-6 items-center justify-center rounded-full text-[10px] font-semibold",
                    done
                      ? "bg-[var(--sg-color-success)] text-white"
                      : "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]",
                  )}
                >
                  {done ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    CUTOVER_LABELS[step.relativeDay] ?? index + 1
                  )}
                </span>
                <p className="mt-2 text-center text-xs font-medium text-[var(--sg-color-text)]">
                  {step.title}
                </p>
              </li>
            );
          })}
        </ol>
        {plan.cutoverSteps.length === 0 ? (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Generate the plan to populate cutover defaults.
          </p>
        ) : null}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Readiness before test / cutover
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-success-soft)]/50 px-2 py-3">
              <p className="text-lg font-semibold text-[var(--sg-color-success)]">
                {readinessReady}
              </p>
              <p className="text-[10px] font-medium uppercase text-[var(--sg-color-text-muted)]">
                Ready
              </p>
            </div>
            <div className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-warning-soft)]/50 px-2 py-3">
              <p className="text-lg font-semibold text-[var(--sg-color-warning)]">
                {readinessWork}
              </p>
              <p className="text-[10px] font-medium uppercase text-[var(--sg-color-text-muted)]">
                Needs work
              </p>
            </div>
            <div className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-danger-soft)]/50 px-2 py-3">
              <p className="text-lg font-semibold text-[var(--sg-color-danger)]">
                {readinessBlocked}
              </p>
              <p className="text-[10px] font-medium uppercase text-[var(--sg-color-text-muted)]">
                Blocked
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {plan.readinessGaps.map((g) => (
              <li key={g.id} className="flex items-start gap-2 text-sm">
                {g.state === "ready" ? (
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                ) : g.state === "blocked" ? (
                  <CircleAlert
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-danger)]"
                    aria-hidden
                  />
                ) : (
                  <CircleDashed
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-warning)]"
                    aria-hidden
                  />
                )}
                <span>
                  <span className="font-medium text-[var(--sg-color-text)]">
                    {g.title}
                  </span>
                  <span className="block text-xs text-[var(--sg-color-text-muted)]">
                    {g.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Users, pipelines & quality
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Users mapped</dt>
              <dd className="font-medium">
                {dashboard.usersTotal > 0
                  ? `${dashboard.usersMapped} / ${dashboard.usersTotal}`
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Pipelines mapped</dt>
              <dd className="font-medium">
                {dashboard.pipelinesTotal > 0
                  ? `${dashboard.pipelinesMapped} / ${dashboard.pipelinesTotal}`
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Test migration</dt>
              <dd className="font-medium capitalize">
                {plan.testMigration.status.replace(/-/g, " ")}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Dedupe rule</dt>
              <dd className="font-medium">
                {plan.dedupe.primaryRule === "unknown"
                  ? "Not defined"
                  : plan.dedupe.primaryRule.replace(/-/g, " ")}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Source during cutover</dt>
              <dd className="font-medium capitalize">
                {plan.deltaMigration.sourceRemainsActive}
              </dd>
            </div>
          </dl>
          {warnings.length > 0 ? (
            <AlertList warnings={warnings} />
          ) : (
            <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
              No potential data-loss warnings surfaced.
            </p>
          )}
        </Card>
      </div>

      {/* Sample field mappings */}
      {plan.fieldMappings.length > 0 ? (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Field mapping snapshot
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--sg-color-border)] text-xs text-[var(--sg-color-text-muted)]">
                  <th className="py-2 pr-3 font-medium">Source</th>
                  <th className="py-2 pr-3 font-medium">Target</th>
                  <th className="py-2 pr-3 font-medium">Transform</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {plan.fieldMappings.slice(0, 8).map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-[var(--sg-color-border)]/70"
                  >
                    <td className="py-2 pr-3">
                      <span className="text-[var(--sg-color-text-muted)]">
                        {m.sourceObject}.
                      </span>
                      {m.sourceField}
                    </td>
                    <td className="py-2 pr-3">
                      {m.targetField
                        ? `${m.targetObject ? `${m.targetObject}.` : ""}${m.targetField}`
                        : "—"}
                    </td>
                    <td className="py-2 pr-3 capitalize text-[var(--sg-color-text-muted)]">
                      {m.transformation.replace(/-/g, " ")}
                    </td>
                    <td className="py-2">
                      <FieldStatusChip status={m.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plan.fieldMappings.length > 8 ? (
            <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
              Showing 8 of {plan.fieldMappings.length} fields.
            </p>
          ) : null}
        </Card>
      ) : null}

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Migration checklist preview
        </h3>
        <pre className="mt-3 max-h-48 overflow-auto rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)]/50 p-3 text-xs leading-relaxed text-[var(--sg-color-text)] whitespace-pre-wrap">
          {checklist}
        </pre>
      </Card>

      {onGenerateOutput || onContinueExport || onDownloadPlan ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/30 px-4 py-4">
          <p className="max-w-xl text-sm text-[var(--sg-color-text)]">
            {resultsReady
              ? "Need files or handoffs? Download the visual PDF or Excel workbook, or continue to Export."
              : "Ready for the deliverable? Generate the migration plan results screen."}
          </p>
          <div className="flex flex-wrap gap-2">
            {!resultsReady && onGenerateOutput ? (
              <Button onClick={onGenerateOutput}>Generate migration plan</Button>
            ) : null}
            {resultsReady && onGenerateOutput ? (
              <Button variant="outline" onClick={onGenerateOutput}>
                Regenerate results
              </Button>
            ) : null}
            {onDownloadPlan ? (
              <Button onClick={onDownloadPlan}>Download PDF</Button>
            ) : null}
            {onDownloadWorkbook ? (
              <Button variant="outline" onClick={onDownloadWorkbook}>
                Download Excel
              </Button>
            ) : null}
            {onContinueExport ? (
              <Button variant="outline" onClick={onContinueExport}>
                Continue to export
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AlertList({ warnings }: { warnings: string[] }) {
  return (
    <ul className="mt-4 space-y-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-warning)]/30 bg-[var(--sg-color-warning-soft)]/30 px-3 py-2">
      {warnings.map((w) => (
        <li key={w} className="flex gap-2 text-xs text-[var(--sg-color-text)]">
          <CircleAlert
            className="mt-0.5 size-3.5 shrink-0 text-[var(--sg-color-warning)]"
            aria-hidden
          />
          {w}
        </li>
      ))}
    </ul>
  );
}
