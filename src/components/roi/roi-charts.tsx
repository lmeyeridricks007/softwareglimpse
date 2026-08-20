"use client";

import { formatMoney, type CurrencyCode } from "@/domain";
import type { RoiCashFlowYear, RoiComputeResult } from "@/services/roi";
import { cn } from "@/lib/cn";

function fmt(minor: number, currency: string) {
  return formatMoney(
    { amountMinor: minor, currency: currency as CurrencyCode },
    { maximumFractionDigits: 0 },
  );
}

/** CSS cumulative net-value chart with break-even marker. */
export function RoiCumulativeChart({
  cashFlow,
  currency,
  breakEvenMonth,
  className,
}: {
  cashFlow: RoiCashFlowYear[];
  currency: string;
  breakEvenMonth: number | null;
  className?: string;
}) {
  if (cashFlow.length === 0) return null;
  const values = cashFlow.map((r) => r.cumulativeMinor);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = Math.max(1, max - min);
  const w = 560;
  const h = 200;
  const pad = 24;

  const points = cashFlow.map((row, i) => {
    const x = pad + (i / Math.max(1, cashFlow.length - 1)) * (w - pad * 2);
    const y = pad + ((max - row.cumulativeMinor) / span) * (h - pad * 2);
    return { x, y, row };
  });

  const zeroY = pad + ((max - 0) / span) * (h - pad * 2);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const summary = cashFlow
    .map(
      (r) =>
        `${r.label}: cumulative ${fmt(r.cumulativeMinor, currency)}`,
    )
    .join(". ");

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Cumulative net value chart. ${summary}${
          breakEvenMonth != null
            ? ` Break-even around month ${breakEvenMonth}.`
            : ""
        }`}
      >
        <line
          x1={pad}
          x2={w - pad}
          y1={zeroY}
          y2={zeroY}
          stroke="var(--sg-color-border)"
          strokeDasharray="4 4"
        />
        <path
          d={path}
          fill="none"
          stroke="var(--sg-color-primary)"
          strokeWidth={2.5}
        />
        {points.map((p) => (
          <g key={p.row.label}>
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill={
                p.row.cumulativeMinor >= 0
                  ? "var(--sg-color-success)"
                  : "var(--sg-color-danger)"
              }
            />
            <text
              x={p.x}
              y={h - 4}
              textAnchor="middle"
              className="fill-[var(--sg-color-text-muted)]"
              fontSize={10}
            >
              {p.row.year === 0 ? "Y0" : `Y${p.row.year}`}
            </text>
          </g>
        ))}
        {breakEvenMonth != null ? (
          <text
            x={w / 2}
            y={16}
            textAnchor="middle"
            fontSize={11}
            className="fill-[var(--sg-color-success)]"
          >
            Break-even ≈ {breakEvenMonth} months
          </text>
        ) : null}
      </svg>
      <p className="sr-only">{summary}</p>
    </div>
  );
}

export function RoiBenefitBars({
  result,
  className,
}: {
  result: RoiComputeResult;
  className?: string;
}) {
  const rows = result.benefitByCategory.filter((c) => c.annualMinor > 0);
  const max = Math.max(...rows.map((r) => r.annualMinor), 1);
  const labels: Record<string, string> = {
    productivity: "Productivity savings",
    "cost-avoidance": "Cost avoidance",
    "revenue-scenario": "Revenue scenario",
    other: "Other benefits",
  };

  return (
    <ul className={cn("space-y-3", className)} aria-label="Benefit breakdown">
      {rows.map((row) => (
        <li key={row.category}>
          <div className="mb-1 flex justify-between gap-2 text-sm">
            <span className="text-[var(--sg-color-text)]">
              {labels[row.category] ?? row.category}
              {row.category === "revenue-scenario" ? (
                <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                  Scenario
                </span>
              ) : null}
            </span>
            <span className="tabular-nums font-medium">
              {fmt(row.annualMinor, result.currency)} · {row.sharePercent}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
            <div
              className={cn(
                "h-full rounded-full",
                row.category === "revenue-scenario"
                  ? "bg-violet-500"
                  : row.category === "productivity"
                    ? "bg-[var(--sg-color-success)]"
                    : "bg-[var(--sg-color-primary)]",
              )}
              style={{ width: `${(row.annualMinor / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function RoiQualityStack({
  result,
  className,
}: {
  result: RoiComputeResult;
  className?: string;
}) {
  const rows = result.benefitByType.filter((t) => t.annualMinor > 0);
  return (
    <div className={className}>
      <p className="text-sm font-medium text-[var(--sg-color-text)]">
        How much of this ROI is well-supported?
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.assumptionType} className="flex justify-between gap-2">
            <span className="capitalize text-[var(--sg-color-text-muted)]">
              {r.assumptionType} benefits
            </span>
            <span className="tabular-nums font-medium">
              {fmt(r.annualMinor, result.currency)} ({r.sharePercent}%)
            </span>
          </li>
        ))}
      </ul>
      <div
        className="mt-3 flex h-3 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
        role="img"
        aria-label={rows
          .map((r) => `${r.assumptionType} ${r.sharePercent}%`)
          .join(", ")}
      >
        {rows.map((r) => {
          const color =
            r.assumptionType === "verified"
              ? "bg-[var(--sg-color-success)]"
              : r.assumptionType === "estimated"
                ? "bg-[var(--sg-color-primary)]"
                : r.assumptionType === "scenario"
                  ? "bg-violet-500"
                  : "bg-[var(--sg-color-border)]";
          return (
            <span
              key={r.assumptionType}
              className={color}
              style={{ width: `${r.sharePercent}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}
