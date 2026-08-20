"use client";

import type { MigrationRisk } from "@/domain";
import type { MigrationDashboardSummary } from "@/services/migration-planner";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/cn";
import { ProgressBar, SeverityChip } from "./status";

type Props = {
  dashboard: MigrationDashboardSummary;
  risks: MigrationRisk[];
  warnings: string[];
  children?: React.ReactNode;
  className?: string;
};

function formatRecords(n: number | null): string {
  if (n === null) return "—";
  return n.toLocaleString();
}

export function MigrationSummaryPanel({
  dashboard,
  risks,
  warnings,
  children,
  className,
}: Props) {
  const topRisks = risks
    .filter((r) => r.status === "open" || r.status === "mitigating")
    .slice(0, 4);

  return (
    <aside
      className={cn(
        "space-y-3 lg:sticky lg:top-24 lg:self-start",
        className,
      )}
      aria-label="Migration summary"
    >
      <div className="overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]">
        <div className="border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Migration summary
          </p>
        </div>
        <dl className="divide-y divide-[var(--sg-color-border)] px-4">
          <SummaryRow label="Sources" value={String(dashboard.sourceCount)} />
          <SummaryRow label="Target" value={dashboard.targetLabel} />
          <SummaryRow label="Objects" value={String(dashboard.objectCount)} />
          <SummaryRow
            label="Est. records"
            value={formatRecords(dashboard.recordEstimate)}
          />
          <SummaryRow
            label="Complexity"
            value={dashboard.complexityLabel ?? "—"}
          />
          <SummaryRow
            label="Users"
            value={
              dashboard.usersTotal > 0
                ? `${dashboard.usersMapped}/${dashboard.usersTotal}`
                : "—"
            }
          />
          <SummaryRow
            label="Pipelines"
            value={
              dashboard.pipelinesTotal > 0
                ? `${dashboard.pipelinesMapped}/${dashboard.pipelinesTotal}`
                : "—"
            }
          />
          <SummaryRow
            label="Open risks"
            value={String(dashboard.openRisks)}
          />
        </dl>
        <div className="border-t border-[var(--sg-color-border)] px-4 py-3">
          <ProgressBar
            label="Fields mapped"
            value={
              dashboard.fieldTotal > 0 ? dashboard.fieldMappedPercent : null
            }
          />
          {dashboard.fieldTotal > 0 ? (
            <p className="mt-1 text-[11px] text-[var(--sg-color-text-muted)]">
              {dashboard.fieldMappedPercent ?? 0}% of {dashboard.fieldTotal}{" "}
              fields confirmed
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-[var(--sg-color-text-muted)]">
              No fields in mapping yet
            </p>
          )}
        </div>
      </div>

      {warnings.length > 0 ? (
        <Alert variant="warning" className="!p-3">
          <p className="text-xs font-semibold text-[var(--sg-color-navy)]">
            Potential data loss
          </p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[11px] text-[var(--sg-color-text-muted)]">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Alert>
      ) : null}

      {topRisks.length > 0 ? (
        <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]">
          <h3 className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Top risks
          </h3>
          <ul className="mt-3 space-y-3">
            {topRisks.map((risk) => (
              <li key={risk.id}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-medium leading-snug text-[var(--sg-color-text)]">
                    {risk.title}
                  </p>
                  <SeverityChip severity={risk.severity} />
                </div>
                <p className="mt-1 text-[11px] leading-snug text-[var(--sg-color-text-muted)]">
                  {risk.reason}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {children ? (
        <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]">
          <h3 className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Next steps
          </h3>
          <div className="mt-2 text-[13px]">{children}</div>
        </div>
      ) : null}
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5 text-[13px]">
      <dt className="shrink-0 text-[var(--sg-color-text-muted)]">{label}</dt>
      <dd
        className="truncate text-right font-semibold text-[var(--sg-color-navy)]"
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
