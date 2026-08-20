"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  Link2,
  OctagonX,
  PauseCircle,
} from "lucide-react";
import type {
  CrmImplementationPlan,
  UatChecklistItem,
  UatTestStatus,
} from "@/domain";
import { ROLE_LABELS } from "@/services/implementation-planner/risks";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const STATUS_META: Record<
  UatTestStatus,
  {
    label: string;
    badge: "neutral" | "success" | "warning" | "danger" | "primary";
    card: string;
    accent: string;
    Icon: typeof CheckCircle2;
  }
> = {
  "not-tested": {
    label: "Not tested",
    badge: "neutral",
    card: "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]",
    accent: "bg-slate-400",
    Icon: CircleDashed,
  },
  passed: {
    label: "Passed",
    badge: "success",
    card: "border-emerald-200 bg-emerald-50/60",
    accent: "bg-emerald-500",
    Icon: CheckCircle2,
  },
  partial: {
    label: "Partial",
    badge: "warning",
    card: "border-amber-200 bg-amber-50/70",
    accent: "bg-amber-500",
    Icon: AlertTriangle,
  },
  failed: {
    label: "Failed",
    badge: "danger",
    card: "border-red-200 bg-red-50/70",
    accent: "bg-red-500",
    Icon: OctagonX,
  },
  blocked: {
    label: "Blocked",
    badge: "warning",
    card: "border-orange-200 bg-orange-50/70",
    accent: "bg-orange-500",
    Icon: PauseCircle,
  },
};

type Props = {
  plan: CrmImplementationPlan;
  setPlan: Dispatch<SetStateAction<CrmImplementationPlan>>;
};

export function UatChecklistPanel({ plan, setPlan }: Props) {
  const items = plan.uatItems;
  const counts = {
    total: items.length,
    passed: items.filter((i) => i.status === "passed").length,
    failed: items.filter((i) => i.status === "failed").length,
    blocked: items.filter((i) => i.status === "blocked").length,
    partial: items.filter((i) => i.status === "partial").length,
    notTested: items.filter((i) => i.status === "not-tested").length,
  };
  const tested = counts.total - counts.notTested;
  const progress =
    counts.total > 0 ? Math.round((counts.passed / counts.total) * 100) : 0;

  function setStatus(id: string, status: UatTestStatus) {
    setPlan((p) => ({
      ...p,
      uatItems: p.uatItems.map((u) => (u.id === id ? { ...u, status } : u)),
    }));
  }

  if (items.length === 0) {
    return (
      <section className="space-y-4" aria-labelledby="uat-heading">
        <Header />
        <div className="rounded-[var(--sg-radius-lg)] border border-dashed border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 px-5 py-10 text-center">
          <ClipboardCheck
            className="mx-auto size-8 text-[var(--sg-color-text-muted)]"
            aria-hidden
          />
          <p className="mt-3 font-medium text-[var(--sg-color-navy)]">
            No must-have UAT scenarios yet
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-[var(--sg-color-text-muted)]">
            Add must-have requirements in the Requirements Builder — each one
            becomes a testable acceptance scenario here.
          </p>
          <Link
            href="/tools/crm-requirements-builder/?from=implementation"
            className="mt-4 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Edit requirements
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5" aria-labelledby="uat-heading">
      <Header />

      <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-gradient-to-br from-[var(--sg-color-primary-soft)]/50 to-[var(--sg-color-surface)] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              UAT progress
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
              {counts.passed}/{counts.total}{" "}
              <span className="text-base font-medium text-[var(--sg-color-text-muted)]">
                passed
              </span>
            </p>
            <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
              {tested} of {counts.total} scenarios reviewed · {progress}% fully
              passed
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <StatChip label="Not tested" value={counts.notTested} tone="neutral" />
            <StatChip label="Passed" value={counts.passed} tone="success" />
            <StatChip label="Partial" value={counts.partial} tone="warning" />
            <StatChip label="Failed" value={counts.failed} tone="danger" />
            <StatChip label="Blocked" value={counts.blocked} tone="warning" />
          </div>
        </div>
        <div
          className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/80 ring-1 ring-[var(--sg-color-border)]"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="UAT pass rate"
        >
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <UatCard
            key={item.id}
            item={item}
            index={index + 1}
            onStatusChange={(status) => setStatus(item.id, status)}
          />
        ))}
      </ul>
    </section>
  );
}

function Header() {
  return (
    <div>
      <h3
        id="uat-heading"
        className="font-semibold text-[var(--sg-color-navy)]"
      >
        Requirement-based UAT
      </h3>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Each must-have requirement gets a test scenario. Mark results before
        go-live — failed or blocked items should stop launch.
      </p>
    </div>
  );
}

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--sg-radius-pill)] px-2.5 py-1 text-[11px] font-medium",
        tone === "success" && "bg-emerald-100 text-emerald-800",
        tone === "warning" && "bg-amber-100 text-amber-900",
        tone === "danger" && "bg-red-100 text-red-800",
        tone === "neutral" &&
          "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
      )}
    >
      <span className="tabular-nums font-semibold">{value}</span>
      {label}
    </span>
  );
}

function UatCard({
  item,
  index,
  onStatusChange,
}: {
  item: UatChecklistItem;
  index: number;
  onStatusChange: (status: UatTestStatus) => void;
}) {
  const meta = STATUS_META[item.status];
  const Icon = meta.Icon;
  const owner = item.ownerRole ? ROLE_LABELS[item.ownerRole] : null;

  return (
    <li
      className={cn(
        "relative overflow-hidden rounded-[var(--sg-radius-lg)] border p-4 shadow-[var(--sg-shadow-sm)] transition",
        meta.card,
      )}
    >
      <div
        className={cn("absolute inset-y-0 left-0 w-1", meta.accent)}
        aria-hidden
      />

      <div className="flex flex-wrap items-start justify-between gap-3 pl-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-[var(--sg-color-navy)] text-[10px] font-bold text-white">
              {index}
            </span>
            <h4 className="font-semibold text-[var(--sg-color-navy)]">
              {item.requirementLabel}
            </h4>
            <Badge variant={meta.badge} className="gap-1">
              <Icon className="size-3" aria-hidden />
              {meta.label}
            </Badge>
          </div>

          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-[var(--sg-radius-md)] border border-white/60 bg-white/70 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Test scenario
              </p>
              <p className="mt-0.5 text-[var(--sg-color-text)]">{item.scenario}</p>
            </div>
            <div className="rounded-[var(--sg-radius-md)] border border-white/60 bg-white/70 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Expected result
              </p>
              <p className="mt-0.5 text-[var(--sg-color-text)]">
                {item.expectedResult}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--sg-color-text-muted)]">
            {owner ? <span>Owner: {owner}</span> : null}
            <span className="inline-flex items-center gap-1">
              <Link2 className="size-3" aria-hidden />
              Must-have · {item.requirementId}
            </span>
          </div>
        </div>

        <label className="flex w-full flex-col gap-1 sm:w-auto sm:min-w-[10rem]">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Status
          </span>
          <select
            className={cn(
              "rounded-[var(--sg-radius-md)] border px-3 py-2 text-sm font-medium shadow-sm",
              item.status === "passed" &&
                "border-emerald-300 bg-emerald-50 text-emerald-900",
              item.status === "failed" &&
                "border-red-300 bg-red-50 text-red-900",
              item.status === "partial" &&
                "border-amber-300 bg-amber-50 text-amber-950",
              item.status === "blocked" &&
                "border-orange-300 bg-orange-50 text-orange-950",
              item.status === "not-tested" &&
                "border-[var(--sg-color-border)] bg-white text-[var(--sg-color-text)]",
            )}
            value={item.status}
            aria-label={`UAT status for ${item.requirementLabel}`}
            onChange={(e) =>
              onStatusChange(e.target.value as UatTestStatus)
            }
          >
            <option value="not-tested">Not tested</option>
            <option value="passed">Passed</option>
            <option value="partial">Partial</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
          </select>
        </label>
      </div>
    </li>
  );
}
