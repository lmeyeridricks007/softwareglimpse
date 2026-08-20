"use client";

import type { McInputs } from "@/domain";
import type { McComputeResult } from "@/services/migration-cost";
import { applyScopeReductions } from "@/services/migration-cost";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TcoMoneyInput } from "@/components/tco/tco-money-input";
import { Input } from "@/components/ui/forms";
import { RoiNumberInput } from "@/components/roi/roi-number-input";
import {
  McComplexityBadge,
  McConfidenceBadge,
  McMoney,
  fromMajorOrNull,
  toMajorOrNull,
} from "./mc-helpers";

type Patch = (updater: (prev: McInputs) => McInputs) => void;

type Props = {
  inputs: McInputs;
  result: McComputeResult;
  patch: Patch;
  exporting: boolean;
  onExportPdf: () => void;
  onExportExcel: () => void;
  onExportMarkdown: () => void;
  onHandoffTco: () => void;
  onHandoffRoi: () => void;
  onHandoffBusinessCase: () => void;
  onHandoffCost: () => void;
};

export function McResultsDashboard({
  inputs,
  result,
  patch,
  exporting,
  onExportPdf,
  onExportExcel,
  onExportMarkdown,
  onHandoffTco,
  onHandoffRoi,
  onHandoffBusinessCase,
  onHandoffCost,
}: Props) {
  const reduced = applyScopeReductions(
    result.expectedTotalMinor,
    result.scopeReductions,
  );
  const maxCat = Math.max(
    1,
    ...result.categories
      .filter((c) => c.expectedMinor != null)
      .map((c) => c.expectedMinor ?? 0),
  );

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          CRM Migration Estimate
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
          <McMoney
            minor={result.expectedTotalMinor}
            currency={result.currency}
            fallback="Incomplete"
          />
        </h2>
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          Expected modelled cost
          {result.coveragePercent != null
            ? ` · Known/estimated coverage ${result.coveragePercent}%`
            : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <McConfidenceBadge confidence={result.confidence} />
          <McComplexityBadge band={result.complexity.overall} />
          <Badge variant="neutral">{result.status}</Badge>
        </div>
        {result.statusReason ? (
          <p className="mt-2 text-sm text-[var(--sg-color-warning)]">
            {result.statusReason}
          </p>
        ) : null}
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ["External services", result.externalMinor],
            ["Internal effort", result.internalLabourMinor],
            ["Tooling", result.toolingMinor],
            ["Contingency", result.contingencyMinor],
          ] as const
        ).map(([label, minor]) => (
          <Card key={label} className="px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {label}
            </p>
            <p className="mt-1 text-xl font-semibold text-[var(--sg-color-navy)]">
              <McMoney minor={minor} currency={result.currency} />
            </p>
          </Card>
        ))}
      </div>

      {result.hasUserRange ? (
        <Card className="px-4 py-4">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Expected range
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-[var(--sg-color-text-muted)]">Low</p>
              <p className="text-lg font-semibold">
                <McMoney minor={result.lowTotalMinor} currency={result.currency} />
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--sg-color-text-muted)]">Expected</p>
              <p className="text-lg font-semibold">
                <McMoney
                  minor={result.expectedTotalMinor}
                  currency={result.currency}
                />
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--sg-color-text-muted)]">High</p>
              <p className="text-lg font-semibold">
                <McMoney
                  minor={result.highTotalMinor}
                  currency={result.currency}
                />
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="px-4 py-4">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Timeline
          </h3>
          <p className="mt-2 text-2xl font-semibold text-[var(--sg-color-navy)]">
            {result.timelineWeeks != null
              ? `${result.timelineWeeks} weeks`
              : "—"}
          </p>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            {result.timelineWeeks != null
              ? result.timelineApproximate
                ? "Approximate from your stage durations"
                : "From your stage durations"
              : "Enter stage durations in scenarios to calculate elapsed time"}
          </p>
        </Card>
        <Card className="px-4 py-4">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Material unknowns
          </h3>
          {result.unknowns.filter((u) => u.material).length === 0 ? (
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              No material unknowns flagged.
            </p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {result.unknowns
                .filter((u) => u.material)
                .slice(0, 3)
                .map((u) => (
                  <li key={u.id}>? {u.label}</li>
                ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="px-4 py-4">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Cost breakdown
        </h3>
        <ul className="mt-4 space-y-2" aria-label="Cost breakdown chart">
          {result.categories
            .filter((c) => c.expectedMinor != null && c.expectedMinor > 0)
            .map((c) => (
              <li key={c.id}>
                <div className="flex justify-between gap-3 text-sm">
                  <span>{c.label}</span>
                  <span className="font-medium tabular-nums">
                    <McMoney
                      minor={c.expectedMinor}
                      currency={result.currency}
                    />
                  </span>
                </div>
                <div
                  className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
                  role="presentation"
                >
                  <div
                    className="h-full rounded-full bg-[var(--sg-color-primary)]"
                    style={{
                      width: `${Math.round(((c.expectedMinor ?? 0) / maxCat) * 100)}%`,
                    }}
                  />
                </div>
              </li>
            ))}
        </ul>
        <p className="sr-only">
          Total expected modelled cost{" "}
          {result.expectedTotalMinor != null
            ? `${result.expectedTotalMinor / 100} ${result.currency}`
            : "unknown"}
        </p>
      </Card>

      <Card className="px-4 py-4">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          What is driving your migration cost?
        </h3>
        {result.drivers.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Add cost inputs to see drivers.
          </p>
        ) : (
          <ol className="mt-3 space-y-2">
            {result.drivers.map((d, i) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span>
                  {i + 1}. {d.label}
                </span>
                <Badge variant="neutral">{d.sharePercent}%</Badge>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <Card className="px-4 py-4">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Complexity profile
        </h3>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {result.complexity.dimensions.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 text-sm"
            >
              <dt>{d.label}</dt>
              <dd>
                <McComplexityBadge band={d.band} />
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      {(result.workSplit.internalLabels.length > 0 ||
        result.workSplit.externalLabels.length > 0) && (
        <Card className="px-4 py-4">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            What can we do internally?
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--sg-color-text-muted)]">
                Internal
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {result.workSplit.internalLabels.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm font-medium">
                <McMoney
                  minor={result.workSplit.internalMinor}
                  currency={result.currency}
                />
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--sg-color-text-muted)]">
                External
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {result.workSplit.externalLabels.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm font-medium">
                <McMoney
                  minor={result.workSplit.externalMinor}
                  currency={result.currency}
                />
              </p>
            </div>
          </div>
        </Card>
      )}

      {result.partnerQuoteComparison.length > 0 ? (
        <Card className="px-4 py-4">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Partner quote comparison
          </h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Cheapest is not automatically best — check included vs excluded
            scope.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-[var(--sg-color-text-muted)]">
                <tr>
                  <th className="py-2 pr-4">Provider</th>
                  <th className="py-2 pr-4">Modelled</th>
                  <th className="py-2 pr-4">Included</th>
                  <th className="py-2">Excluded</th>
                </tr>
              </thead>
              <tbody>
                {result.partnerQuoteComparison.map((q) => (
                  <tr
                    key={q.id}
                    className="border-t border-[var(--sg-color-border)]"
                  >
                    <td className="py-2 pr-4 font-medium">
                      {q.provider}
                      {q.selected ? (
                        <Badge variant="primary" className="ml-2">
                          Selected
                        </Badge>
                      ) : null}
                    </td>
                    <td className="py-2 pr-4">
                      <McMoney
                        minor={q.modeledMinor}
                        currency={result.currency}
                      />
                    </td>
                    <td className="py-2 pr-4 text-[var(--sg-color-text-muted)]">
                      {q.includedScope || "—"}
                    </td>
                    <td className="py-2 text-[var(--sg-color-text-muted)]">
                      {q.excludedScope || "—"}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-[var(--sg-color-border)]">
                  <td className="py-2 pr-4 font-medium">Internal model</td>
                  <td className="py-2 pr-4">
                    <McMoney
                      minor={result.expectedTotalMinor}
                      currency={result.currency}
                    />
                  </td>
                  <td className="py-2" colSpan={2}>
                    Your calculator assumptions
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      <Card className="px-4 py-4">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          How could you reduce migration cost?
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Financial impact only appears where you enter a reduction amount.
        </p>
        <ul className="mt-3 space-y-3">
          {inputs.scenarios.scopeToggles.map((toggle, idx) => (
            <li
              key={toggle.id}
              className="flex flex-col gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 sm:flex-row sm:items-center"
            >
              <label className="flex flex-1 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={toggle.enabled}
                  onChange={(e) =>
                    patch((p) => {
                      const next = [...p.scenarios.scopeToggles];
                      next[idx] = {
                        ...next[idx]!,
                        enabled: e.target.checked,
                      };
                      return {
                        ...p,
                        scenarios: { ...p.scenarios, scopeToggles: next },
                      };
                    })
                  }
                />
                {toggle.label}
              </label>
              <div className="sm:w-40">
                <TcoMoneyInput
                  id={`red-${toggle.id}`}
                  label="Potential reduction"
                  currency={inputs.currency}
                  valueMajor={toMajorOrNull(toggle.reductionMinor)}
                  onChange={(major) =>
                    patch((p) => {
                      const next = [...p.scenarios.scopeToggles];
                      next[idx] = {
                        ...next[idx]!,
                        reductionMinor: fromMajorOrNull(major),
                      };
                      return {
                        ...p,
                        scenarios: { ...p.scenarios, scopeToggles: next },
                      };
                    })
                  }
                />
              </div>
            </li>
          ))}
        </ul>
        {reduced != null &&
        reduced !== result.expectedTotalMinor &&
        result.scopeReductions.some(
          (s) => s.enabled && s.reductionMinor != null,
        ) ? (
          <p className="mt-3 text-sm font-medium text-[var(--sg-color-navy)]">
            After enabled reductions:{" "}
            <McMoney minor={reduced} currency={result.currency} />
          </p>
        ) : null}
      </Card>

      <Card className="px-4 py-4">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Phased migration
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Allocate costs to phases when modelling a staged cutover.
        </p>
        <div className="mt-3 space-y-2">
          {inputs.scenarios.phases.map((phase, idx) => (
            <div
              key={phase.id}
              className="grid gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 sm:grid-cols-2"
            >
              <Input
                value={phase.label}
                aria-label="Phase label"
                onChange={(e) =>
                  patch((p) => {
                    const next = [...p.scenarios.phases];
                    next[idx] = { ...next[idx]!, label: e.target.value };
                    return {
                      ...p,
                      scenarios: { ...p.scenarios, phases: next },
                    };
                  })
                }
              />
              <TcoMoneyInput
                id={`phase-${phase.id}`}
                label="Allocated cost"
                currency={inputs.currency}
                valueMajor={toMajorOrNull(phase.allocatedCostMinor)}
                onChange={(major) =>
                  patch((p) => {
                    const next = [...p.scenarios.phases];
                    next[idx] = {
                      ...next[idx]!,
                      allocatedCostMinor: fromMajorOrNull(major),
                    };
                    return {
                      ...p,
                      scenarios: { ...p.scenarios, phases: next },
                    };
                  })
                }
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          className="mt-3"
          onClick={() =>
            patch((p) => ({
              ...p,
              scenarios: {
                ...p.scenarios,
                phases: [
                  ...p.scenarios.phases,
                  {
                    id: `phase-${Date.now()}`,
                    label: `Phase ${p.scenarios.phases.length + 1}`,
                    objectIds: [],
                    integrationIds: [],
                    includeHistorical: false,
                    includeCustomObjects: false,
                  },
                ],
              },
            }))
          }
        >
          Add phase
        </Button>
      </Card>

      <Card className="px-4 py-4">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Optional timeline stages
        </h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {inputs.scenarios.timelineStages.map((stage, idx) => (
            <div key={stage.id}>
              <label
                htmlFor={`tl-${stage.id}`}
                className="text-xs font-medium text-[var(--sg-color-text-muted)]"
              >
                {stage.label} (weeks)
              </label>
              <RoiNumberInput
                id={`tl-${stage.id}`}
                className="mt-1"
                value={stage.durationWeeks}
                allowEmpty
                onChange={(v) =>
                  patch((p) => {
                    const next = [...p.scenarios.timelineStages];
                    next[idx] = { ...next[idx]!, durationWeeks: v };
                    return {
                      ...p,
                      scenarios: { ...p.scenarios, timelineStages: next },
                    };
                  })
                }
              />
            </div>
          ))}
        </div>
      </Card>

      {result.readinessWarnings.length > 0 ? (
        <Card className="border-[var(--sg-color-warning)]/40 px-4 py-4">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Migration readiness warnings
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {result.readinessWarnings.map((w) => (
              <li key={w}>⚠ {w}</li>
            ))}
          </ul>
          <ButtonLink
            href="/tools/crm-readiness-assessment/"
            variant="secondary"
            className="mt-3"
          >
            Review CRM readiness
          </ButtonLink>
        </Card>
      ) : null}

      <Card className="px-4 py-4">
        <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Export
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={exporting}
            onClick={onExportPdf}
          >
            Download PDF report
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={exporting}
            onClick={onExportExcel}
          >
            Export Excel model
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={exporting}
            onClick={onExportMarkdown}
          >
            Markdown summary
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => window.print()}
          >
            Printable summary
          </Button>
        </div>
      </Card>

      <section aria-labelledby="mc-whats-next">
        <h3
          id="mc-whats-next"
          className="text-sm font-semibold text-[var(--sg-color-navy)]"
        >
          What&apos;s next?
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            className="h-auto justify-start px-4 py-3 text-left"
            onClick={onHandoffCost}
          >
            <span>
              <span className="block font-semibold">
                Include in CRM Cost Calculator
              </span>
              <span className="mt-0.5 block text-xs font-normal text-[var(--sg-color-text-muted)]">
                Add migration cost to TCO model
              </span>
            </span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-auto justify-start px-4 py-3 text-left"
            onClick={onHandoffTco}
          >
            <span>
              <span className="block font-semibold">Open CRM TCO Calculator</span>
              <span className="mt-0.5 block text-xs font-normal text-[var(--sg-color-text-muted)]">
                Import after confirmation
              </span>
            </span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-auto justify-start px-4 py-3 text-left"
            onClick={onHandoffRoi}
          >
            <span>
              <span className="block font-semibold">
                Add to CRM ROI Calculator
              </span>
              <span className="mt-0.5 block text-xs font-normal text-[var(--sg-color-text-muted)]">
                See impact on first-year ROI
              </span>
            </span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-auto justify-start px-4 py-3 text-left"
            onClick={onHandoffBusinessCase}
          >
            <span>
              <span className="block font-semibold">Add to Business Case</span>
              <span className="mt-0.5 block text-xs font-normal text-[var(--sg-color-text-muted)]">
                Build full business case
              </span>
            </span>
          </Button>
        </div>
      </section>
    </div>
  );
}
