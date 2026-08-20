"use client";

import { formatMoney, type CurrencyCode, type RoiScenarioKey } from "@/domain";
import type { RoiComputeResult } from "@/services/roi";
import {
  formatPaybackMonths,
  formatRoiPercent,
} from "@/services/roi";
import {
  RoiBenefitBars,
  RoiCumulativeChart,
  RoiQualityStack,
} from "./roi-charts";
import { RoiConfidenceDot, RoiTypeBadge } from "./roi-badges";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/forms";
import { cn } from "@/lib/cn";

function Money({
  minor,
  currency,
  className,
}: {
  minor: number | null | undefined;
  currency: string;
  className?: string;
}) {
  if (minor == null) {
    return (
      <span className={cn("text-[var(--sg-color-text-muted)]", className)}>
        —
      </span>
    );
  }
  return (
    <span className={cn("tabular-nums", className)}>
      {formatMoney(
        { amountMinor: minor, currency: currency as CurrencyCode },
        { maximumFractionDigits: 0 },
      )}
    </span>
  );
}

type Props = {
  result: RoiComputeResult;
  activeScenario: RoiScenarioKey;
  onScenarioChange: (key: RoiScenarioKey) => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  onBusinessCase: () => void;
  onAdjustAssumptions: () => void;
  onEditInvestment?: () => void;
  onEditProductivity?: () => void;
  sensitivityRealization: number;
  sensitivityHours: number;
  onSensitivityRealization: (v: number) => void;
  onSensitivityHours: (v: number) => void;
  exporting?: boolean;
};

export function RoiResultsDashboard({
  result,
  activeScenario,
  onScenarioChange,
  onExportPdf,
  onExportExcel,
  onBusinessCase,
  onAdjustAssumptions,
  onEditInvestment,
  onEditProductivity,
  sensitivityRealization,
  sensitivityHours,
  onSensitivityRealization,
  onSensitivityHours,
  exporting,
}: Props) {
  const c = result.currency;
  const noCosts = result.year1InvestmentMinor == null && result.annualRecurringMinor == null;
  const noBenefits = result.annualBenefitMinor <= 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
            Your ROI Summary
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Base figures update with the selected scenario. Scenario benefits stay
            labeled separately from verified and estimated value.
          </p>
        </div>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--sg-color-text-muted)]">
          Scenario
          <Select
            value={activeScenario}
            onChange={(e) =>
              onScenarioChange(e.target.value as RoiScenarioKey)
            }
            aria-label="Active ROI scenario"
            className="min-w-[10rem]"
          >
            <option value="conservative">Conservative</option>
            <option value="base">Base</option>
            <option value="upside">Upside</option>
          </Select>
        </label>
      </div>

      {noCosts || noBenefits ? (
        <Alert variant="warning" title="Results need more inputs">
          <div className="space-y-2">
            <p>
              {noCosts
                ? "No CRM investment costs are entered yet, so Year 1 investment, TCO, ROI and payback stay blank."
                : null}
              {noCosts && noBenefits ? " " : null}
              {noBenefits
                ? "Annual measurable benefit is €0 — add productivity hours saved (and loaded hourly costs), cost avoidance, or an optional revenue scenario."
                : null}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {onEditInvestment ? (
                <Button type="button" size="sm" onClick={onEditInvestment}>
                  Add CRM investment costs
                </Button>
              ) : null}
              {onEditProductivity ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={onEditProductivity}
                >
                  Edit productivity benefits
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onAdjustAssumptions}
              >
                Review assumptions
              </Button>
            </div>
          </div>
        </Alert>
      ) : null}
      {result.status === "incomplete" && !noCosts ? (
        <Alert variant="warning" title="ROI incomplete">
          {result.statusReason}{" "}
          <button
            type="button"
            className="font-semibold underline"
            onClick={onAdjustAssumptions}
          >
            Review cost inputs
          </button>{" "}
          or enable a provisional scenario on the Assumptions step.
        </Alert>
      ) : null}

      {result.status === "negative" ? (
        <Alert variant="danger" title="Modeled business case is negative">
          {result.statusReason} Consider reviewing assumptions, reducing scope or
          cost, comparing another CRM, extending the time horizon, or identifying
          stronger measurable benefits.
        </Alert>
      ) : null}

      {result.status === "provisional" ? (
        <Alert variant="warning" title="Provisional scenario">
          {result.statusReason}
        </Alert>
      ) : null}

      {result.overlapWarnings.map((w) => (
        <Alert key={w} variant="warning" title="Possible double-count">
          {w}
        </Alert>
      ))}

      {/* Hero KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "3-year net value",
            value: (
              <Money
                minor={result.netThreeYearValueMinor}
                currency={c}
                className="text-2xl font-semibold"
              />
            ),
          },
          {
            label: "3-year ROI",
            value: (
              <span className="text-2xl font-semibold tabular-nums">
                {formatRoiPercent(result.roiPercent)}
              </span>
            ),
          },
          {
            label: "Payback",
            value: (
              <span className="text-2xl font-semibold tabular-nums">
                {formatPaybackMonths(
                  result.paybackMonths,
                  result.paybackApproximate,
                )}
              </span>
            ),
          },
          {
            label: "Benefit confidence",
            value: (
              <span className="text-2xl font-semibold capitalize">
                {result.assessment.benefitConfidence}
              </span>
            ),
          },
        ].map((kpi) => (
          <Card key={kpi.label} className="px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {kpi.label}
            </p>
            <div className="mt-2 text-[var(--sg-color-navy)]">{kpi.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[
          {
            label: "Year 1 investment",
            minor: result.year1InvestmentMinor,
            hint: "One-time + Y1 software",
          },
          {
            label: "Annual recurring",
            minor: result.annualRecurringMinor,
            hint: "Starting year 2",
          },
          {
            label: "Annual benefit",
            minor: result.annualBenefitMinor,
            hint: "Measurable value",
          },
          {
            label: "Net annual benefit",
            minor: result.netAnnualBenefitMinor,
            hint: "After recurring cost",
          },
          {
            label: `${result.horizonYears}-year TCO`,
            minor: result.threeYearTcoMinor,
            hint: "Known costs only",
          },
        ].map((card) => (
          <Card key={card.label} className="px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {card.label}
            </p>
            <p className="mt-1 text-lg font-semibold text-[var(--sg-color-navy)]">
              <Money minor={card.minor} currency={c} />
            </p>
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              {card.hint}
            </p>
          </Card>
        ))}
      </div>

      <Card className="px-4 py-5 sm:px-6">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Cumulative net value
        </h3>
        <RoiCumulativeChart
          className="mt-4"
          cashFlow={result.cashFlow}
          currency={c}
          breakEvenMonth={result.breakEvenMonth}
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">Cash flow by year</caption>
            <thead>
              <tr className="border-b border-[var(--sg-color-border)] text-[var(--sg-color-text-muted)]">
                <th className="py-2 pr-3 font-medium">Year</th>
                <th className="py-2 pr-3 font-medium">Costs</th>
                <th className="py-2 pr-3 font-medium">Benefits</th>
                <th className="py-2 pr-3 font-medium">Net</th>
                <th className="py-2 font-medium">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {result.cashFlow.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-[var(--sg-color-border)]/60"
                >
                  <td className="py-2 pr-3">{row.label}</td>
                  <td className="py-2 pr-3 tabular-nums">
                    <Money minor={row.costsMinor} currency={c} />
                  </td>
                  <td className="py-2 pr-3 tabular-nums">
                    <Money minor={row.benefitsMinor} currency={c} />
                  </td>
                  <td className="py-2 pr-3 tabular-nums">
                    <Money minor={row.netMinor} currency={c} />
                  </td>
                  <td className="py-2 tabular-nums font-medium">
                    <Money minor={row.cumulativeMinor} currency={c} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="px-4 py-5 sm:px-6">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Benefit breakdown
          </h3>
          <RoiBenefitBars className="mt-4" result={result} />
        </Card>
        <Card className="px-4 py-5 sm:px-6">
          <RoiQualityStack result={result} />
          <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
            {result.assessment.interpretation}
          </p>
        </Card>
      </div>

      <Card className="px-4 py-5 sm:px-6">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Scenario comparison
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Values use your scenario-specific productivity and win-rate inputs —
          not arbitrary multipliers.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {result.scenarios.map((s) => (
            <div
              key={s.key}
              className={cn(
                "rounded-[var(--sg-radius-lg)] border px-4 py-4",
                s.key === activeScenario
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]/30"
                  : "border-[var(--sg-color-border)]",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                {s.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
                {formatRoiPercent(s.roiPercent)}
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {formatPaybackMonths(s.paybackMonths)} payback
              </p>
              <p className="mt-1 text-sm font-medium">
                <Money minor={s.netThreeYearValueMinor} currency={c} /> net
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="px-4 py-5 sm:px-6">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            What drives the result?
          </h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Adjust 1–2 assumptions to see ROI sensitivity. Numeric fields mirror
            the sliders for accessibility.
          </p>
          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="font-medium">
                Realization factor ({Math.round(sensitivityRealization * 100)}%)
              </span>
              <input
                type="range"
                min={0.25}
                max={1}
                step={0.05}
                value={sensitivityRealization}
                onChange={(e) =>
                  onSensitivityRealization(Number(e.target.value))
                }
                className="mt-2 w-full"
                aria-valuetext={`${Math.round(sensitivityRealization * 100)} percent`}
              />
              <input
                type="number"
                min={25}
                max={100}
                step={5}
                value={Math.round(sensitivityRealization * 100)}
                onChange={(e) =>
                  onSensitivityRealization(Number(e.target.value) / 100)
                }
                className="mt-2 w-24 rounded border border-[var(--sg-color-border)] px-2 py-1 text-sm"
                aria-label="Realization factor percent"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">
                Rep hours saved / week ({sensitivityHours})
              </span>
              <input
                type="range"
                min={0}
                max={8}
                step={0.1}
                value={sensitivityHours}
                onChange={(e) => onSensitivityHours(Number(e.target.value))}
                className="mt-2 w-full"
              />
              <input
                type="number"
                min={0}
                max={40}
                step={0.1}
                value={sensitivityHours}
                onChange={(e) => onSensitivityHours(Number(e.target.value))}
                className="mt-2 w-24 rounded border border-[var(--sg-color-border)] px-2 py-1 text-sm"
                aria-label="Rep hours saved per week"
              />
            </label>
          </div>
          {result.sensitivity[0] ? (
            <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
              ROI is most sensitive to{" "}
              <strong className="text-[var(--sg-color-text)]">
                {result.sensitivity[0].label.toLowerCase()}
              </strong>
              .
            </p>
          ) : null}
        </Card>

        <Card className="px-4 py-5 sm:px-6">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            What needs to be true to break even?
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text)]">
            {result.breakEven.hoursSavedPerUserWeek != null ? (
              <li>
                About{" "}
                <strong>
                  {result.breakEven.hoursSavedPerUserWeek} hours saved per paid
                  user per week
                </strong>{" "}
                (at current realization), or
              </li>
            ) : null}
            {result.breakEven.annualMeasurableBenefitMinor != null ? (
              <li>
                Approximately{" "}
                <strong>
                  <Money
                    minor={result.breakEven.annualMeasurableBenefitMinor}
                    currency={c}
                  />{" "}
                  annual measurable benefit
                </strong>
                .
              </li>
            ) : (
              <li>Break-even needs a known Year 1 investment.</li>
            )}
          </ul>
        </Card>
      </div>

      <Card className="px-4 py-5 sm:px-6">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Is this a strong business case?
        </h3>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Payback", result.assessment.paybackBand],
            ["Benefit confidence", result.assessment.benefitConfidence],
            ["Revenue dependence", result.assessment.revenueDependence],
            ["Cost completeness", result.assessment.costCompleteness],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                {label}
              </dt>
              <dd className="mt-1 capitalize">
                <Badge variant="neutral">{value}</Badge>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
          {result.assessment.interpretation}
        </p>
      </Card>

      <Card className="px-4 py-5 sm:px-6">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Assumptions & confidence
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Assumption register</caption>
            <thead>
              <tr className="border-b border-[var(--sg-color-border)] text-[var(--sg-color-text-muted)]">
                <th className="py-2 pr-3 font-medium">Assumption</th>
                <th className="py-2 pr-3 font-medium">Value</th>
                <th className="py-2 pr-3 font-medium">Type</th>
                <th className="py-2 pr-3 font-medium">Confidence</th>
                <th className="py-2 font-medium">In ROI?</th>
              </tr>
            </thead>
            <tbody>
              {result.assumptions.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-[var(--sg-color-border)]/60"
                >
                  <td className="py-2.5 pr-3">{a.label}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{a.valueLabel}</td>
                  <td className="py-2.5 pr-3">
                    <RoiTypeBadge type={a.assumptionType} />
                  </td>
                  <td className="py-2.5 pr-3">
                    <RoiConfidenceDot confidence={a.confidence} />
                  </td>
                  <td className="py-2.5">{a.included ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          onClick={onAdjustAssumptions}
        >
          Edit assumptions
        </Button>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={onExportPdf} disabled={exporting}>
          Export ROI Analysis (PDF)
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onExportExcel}
          disabled={exporting}
        >
          Export Excel model
        </Button>
        <Button type="button" variant="secondary" onClick={onBusinessCase}>
          Build Business Case
        </Button>
        <ButtonLink href="/tools/crm-cost-calculator/" variant="ghost">
          Compare CRM Costs
        </ButtonLink>
        <ButtonLink href="/tools/crm-finder/" variant="ghost">
          Find CRM
        </ButtonLink>
      </div>

      <p className="text-xs text-[var(--sg-color-text-muted)]">
        Methodology: 3-year ROI = (3-year benefits − 3-year costs) / 3-year costs
        × 100. Unknown costs are never treated as €0. See{" "}
        <a
          href="#how-crm-roi-is-calculated"
          className="font-medium text-[var(--sg-color-primary)] underline"
        >
          How this calculator works
        </a>
        .
      </p>
    </div>
  );
}
