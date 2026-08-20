"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  Printer,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import type {
  CrmReadinessSession,
  ReadinessActionPhase,
  ReadinessActionStatus,
} from "@/domain";
import { track } from "@/analytics/events";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { READINESS_DIMENSIONS, type ReadinessDimensionDef } from "@/services/readiness-assessment/catalog";
import {
  downloadActionPlanPdf,
  downloadReadinessExcel,
  downloadReadinessJson,
  downloadReadinessPdf,
  downloadRiskRegisterPdf,
  type ReadinessExportOptions,
} from "@/services/readiness-assessment/export";
import type { runFullAssessment } from "@/services/readiness-assessment/findings";
import {
  DIMENSION_LEVEL_LABELS,
  READINESS_LEVEL_LABELS,
  scoreBandLabel,
} from "@/services/readiness-assessment/score";
import { saveCrmReadinessSession, touchCrmReadinessSession } from "@/services/readiness-assessment/persistence";
import { saveSiReadinessSession } from "@/services/readiness-assessment/si-persistence";
import { ReadinessRadar } from "./readiness-radar";
import { JourneyRoadmap } from "./journey-roadmap";

type Report = ReturnType<typeof runFullAssessment>;

type Props = {
  session: CrmReadinessSession;
  report: Report;
  onRetake: () => void;
  onRestart: () => void;
  dimensions?: ReadinessDimensionDef[];
  productNoun?: string;
  requirementsHref?: string;
  finderHref?: string;
  exportOptions?: ReadinessExportOptions;
  relatedLinks?: Array<{ href: string; label: string }>;
};

const PHASES: { id: ReadinessActionPhase; label: string }[] = [
  { id: "do-now", label: "Do now (0–4 weeks)" },
  { id: "before-demos", label: "Before vendor demos" },
  { id: "before-contract", label: "Before contract" },
  { id: "before-go-live", label: "Before go-live" },
];

export function ResultsDashboard({
  session,
  report,
  onRetake,
  onRestart,
  dimensions = READINESS_DIMENSIONS,
  productNoun = "CRM",
  requirementsHref = "/tools/crm-requirements-builder/",
  finderHref = "/tools/crm-finder/",
  exportOptions,
  relatedLinks,
}: Props) {
  const [phase, setPhase] = useState<ReadinessActionPhase>("do-now");
  const [exportOpen, setExportOpen] = useState(false);
  const [actionStatuses, setActionStatuses] = useState(session.actionStatuses);
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  const actionsForPhase = report.actions.filter((a) => a.phase === phase);

  const levelVariant =
    report.assessment.overallLevel === "strongly-prepared" ||
    report.assessment.overallLevel === "ready-for-selection"
      ? "success"
      : report.assessment.overallLevel === "ready-for-structured-discovery"
        ? "success"
        : report.assessment.overallLevel === "preparation-required"
          ? "warning"
          : "danger";

  const updateActionStatus = (actionId: string, status: ReadinessActionStatus) => {
    const next = {
      ...actionStatuses,
      [actionId]: {
        actionId,
        status,
        owner: actionStatuses[actionId]?.owner ?? "",
        updatedAt: new Date().toISOString(),
      },
    };
    setActionStatuses(next);
    const touched = touchCrmReadinessSession(session, { actionStatuses: next });
    if (session.assessmentVersion === "si-readiness-v1") {
      saveSiReadinessSession(touched);
    } else {
      saveCrmReadinessSession(touched);
    }
  };

  const delta = useMemo(() => {
    if (!session.previousResult) return null;
    return {
      selection:
        report.assessment.selectionScore - session.previousResult.selectionScore,
      implementation:
        report.assessment.implementationScore -
        session.previousResult.implementationScore,
    };
  }, [session.previousResult, report]);

  const exportReport = async (kind: string) => {
    setExportOpen(false);
    if (kind === "pdf") await downloadReadinessPdf(session, exportOptions);
    else if (kind === "excel") await downloadReadinessExcel(session, exportOptions);
    else if (kind === "json") downloadReadinessJson(session, exportOptions);
    else if (kind === "actions") await downloadActionPlanPdf(session, exportOptions);
    else if (kind === "risks") await downloadRiskRegisterPdf(session, exportOptions);
    track({
      name: "crm_readiness_report_downloaded",
      properties: { format: kind },
    });
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 shadow-[var(--sg-shadow-sm)]">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
            Your {productNoun} readiness results
          </h2>
          <a
            href="#how-scoring-works"
            className="text-xs text-[var(--sg-color-primary)]"
          >
            How scoring works
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportOpen((o) => !o)}
              aria-expanded={exportOpen}
            >
              <Download className="size-4" aria-hidden />
              Download report
              <ChevronDown className="size-3.5" aria-hidden />
            </Button>
            {exportOpen ? (
              <ul className="absolute right-0 z-20 mt-1 min-w-[12rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] py-1 shadow-[var(--sg-shadow-md)]">
                {[
                  ["pdf", "Full PDF report"],
                  ["excel", "Excel workbook"],
                  ["actions", "Action plan PDF"],
                  ["risks", "Risk register PDF"],
                  ["json", "Export data (JSON)"],
                ].map(([id, label]) => (
                  <li key={id}>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-[var(--sg-color-surface-muted)]"
                      onClick={() => void exportReport(id)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer className="size-4" aria-hidden />
            Print
          </Button>
          <Button size="sm" onClick={onRetake}>
            <RefreshCw className="size-4" aria-hidden />
            Retake assessment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          {/* Dual scores */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreCard
              title="Selection readiness"
              score={report.assessment.selectionScore}
              hint={`You are ready to begin evaluating ${productNoun === "CRM" ? "CRM" : productNoun} options.`}
              tone="primary"
            />
            <ScoreCard
              title="Implementation readiness"
              score={report.assessment.implementationScore}
              hint="Address key gaps to ensure a successful implementation."
              tone="warning"
            />
          </div>

          {delta ? (
            <p className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-3 py-2 text-sm text-[var(--sg-color-navy)]">
              Since previous assessment: selection{" "}
              <strong>
                {delta.selection >= 0 ? "+" : ""}
                {delta.selection}
              </strong>
              , implementation{" "}
              <strong>
                {delta.implementation >= 0 ? "+" : ""}
                {delta.implementation}
              </strong>
              .
            </p>
          ) : null}

          <p className="text-sm text-[var(--sg-color-text-muted)]">
            {report.executiveSummary}
          </p>

          {/* Profile */}
          <section className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 sm:p-5">
            <h3 className="font-semibold text-[var(--sg-color-navy)]">
              Readiness profile by dimension
            </h3>
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <ReadinessRadar dimensions={report.assessment.dimensions} catalogDimensions={dimensions} />
              <ul className="space-y-2">
                {report.assessment.dimensions.map((d) => {
                  const def = dimensions.find(
                    (x) => x.id === d.dimensionId,
                  );
                  const bar =
                    d.level === "strong"
                      ? "bg-[var(--sg-color-success)]"
                      : d.level === "good"
                        ? "bg-emerald-400"
                        : d.level === "needs-work"
                          ? "bg-[var(--sg-color-warning)]"
                          : "bg-[var(--sg-color-danger)]";
                  return (
                    <li key={d.dimensionId}>
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() =>
                          setExpandedDim(
                            expandedDim === d.dimensionId
                              ? null
                              : d.dimensionId,
                          )
                        }
                      >
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="font-medium text-[var(--sg-color-navy)]">
                            {def?.shortTitle ?? d.dimensionId}
                          </span>
                          <span className="text-[var(--sg-color-text-muted)]">
                            {d.score} · {DIMENSION_LEVEL_LABELS[d.level]}
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
                          <div
                            className={cn("h-full rounded-full", bar)}
                            style={{ width: `${d.score}%` }}
                          />
                        </div>
                      </button>
                      {expandedDim === d.dimensionId ? (
                        <ul className="mt-2 space-y-1 border-l-2 border-[var(--sg-color-border)] pl-3 text-xs text-[var(--sg-color-text-muted)]">
                          <li className="font-medium text-[var(--sg-color-navy)]">
                            Why this score?
                          </li>
                          {d.drivers.slice(0, 6).map((dr) => (
                            <li key={dr.questionId}>
                              {dr.kind === "positive"
                                ? "✓"
                                : dr.kind === "uncertain"
                                  ? "?"
                                  : dr.kind === "partial"
                                    ? "△"
                                    : "✕"}{" "}
                              {dr.label} ({dr.points})
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Vendor decision */}
          <section className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 sm:p-5">
            <h3 className="font-semibold text-[var(--sg-color-navy)]">
              Are you ready to talk to {productNoun} vendors?
            </h3>
            <p className="mt-2 text-sm font-medium text-[var(--sg-color-navy)]">
              {report.vendorDecision.label}
            </p>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {report.vendorDecision.summary}
            </p>
            {report.vendorDecision.conditions.length > 0 ? (
              <ul className="mt-3 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
                {report.vendorDecision.conditions.map((c) => (
                  <li key={c} className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                      aria-hidden
                    />
                    {c}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink href={requirementsHref} size="sm">
                Build requirements
              </ButtonLink>
              <ButtonLink
                href={finderHref}
                size="sm"
                variant="outline"
              >
                Explore {productNoun} software
              </ButtonLink>
            </div>
          </section>

          {/* Action plan */}
          <section className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="font-semibold text-[var(--sg-color-navy)]">
                Recommended action plan
              </h3>
              <p className="text-xs text-[var(--sg-color-text-muted)]">
                {report.actions.length} actions
              </p>
            </div>
            <div
              className="mt-3 flex flex-wrap gap-1 border-b border-[var(--sg-color-border)] pb-2"
              role="tablist"
              aria-label="Action plan phases"
            >
              {PHASES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={phase === p.id}
                  className={cn(
                    "rounded-[var(--sg-radius-md)] px-2.5 py-1.5 text-xs font-medium",
                    phase === p.id
                      ? "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-navy)]"
                      : "text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)]",
                  )}
                  onClick={() => setPhase(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--sg-color-border)] text-xs text-[var(--sg-color-text-muted)]">
                    <th className="py-2 pr-2 font-medium">Priority</th>
                    <th className="py-2 pr-2 font-medium">Action</th>
                    <th className="py-2 pr-2 font-medium">Why it matters</th>
                    <th className="py-2 pr-2 font-medium">Effort</th>
                    <th className="py-2 pr-2 font-medium">Owner</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {actionsForPhase.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-[var(--sg-color-text-muted)]"
                      >
                        No actions in this phase.
                      </td>
                    </tr>
                  ) : (
                    actionsForPhase.map((a) => {
                      const status =
                        actionStatuses[a.id]?.status ?? "not-started";
                      return (
                        <tr
                          key={a.id}
                          className="border-b border-[var(--sg-color-border)]/70 align-top"
                        >
                          <td className="py-2.5 pr-2">
                            <Badge
                              variant={
                                a.priority === "critical"
                                  ? "danger"
                                  : a.priority === "high"
                                    ? "warning"
                                    : "neutral"
                              }
                            >
                              {a.priority}
                            </Badge>
                          </td>
                          <td className="py-2.5 pr-2 font-medium text-[var(--sg-color-navy)]">
                            {a.title}
                            {a.relatedTool ? (
                              <div className="mt-1">
                                <ToolMiniLink toolId={a.relatedTool} />
                              </div>
                            ) : null}
                          </td>
                          <td className="py-2.5 pr-2 text-[var(--sg-color-text-muted)]">
                            {a.reason}
                          </td>
                          <td className="py-2.5 pr-2 capitalize text-[var(--sg-color-text-muted)]">
                            {a.effort}
                          </td>
                          <td className="py-2.5 pr-2 text-[var(--sg-color-text-muted)]">
                            {a.ownerHint}
                          </td>
                          <td className="py-2.5">
                            <select
                              className="rounded border border-[var(--sg-color-border)] bg-transparent px-1.5 py-1 text-xs"
                              value={status}
                              onChange={(e) =>
                                updateActionStatus(
                                  a.id,
                                  e.target.value as ReadinessActionStatus,
                                )
                              }
                              aria-label={`Status for ${a.title}`}
                            >
                              <option value="not-started">Not started</option>
                              <option value="in-progress">In progress</option>
                              <option value="done">Done</option>
                              <option value="not-applicable">N/A</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Risk register */}
          <section className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 sm:p-5">
            <h3 className="font-semibold text-[var(--sg-color-navy)]">
              Risk register
            </h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--sg-color-border)] text-xs text-[var(--sg-color-text-muted)]">
                    <th className="py-2 pr-2 font-medium">Risk</th>
                    <th className="py-2 pr-2 font-medium">Severity</th>
                    <th className="py-2 pr-2 font-medium">Phase</th>
                    <th className="py-2 font-medium">Mitigation</th>
                  </tr>
                </thead>
                <tbody>
                  {report.risks.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[var(--sg-color-border)]/70 align-top"
                    >
                      <td className="py-2 pr-2 font-medium text-[var(--sg-color-navy)]">
                        {r.risk}
                      </td>
                      <td className="py-2 pr-2 capitalize">{r.severity}</td>
                      <td className="py-2 pr-2 text-[var(--sg-color-text-muted)]">
                        {r.phase}
                      </td>
                      <td className="py-2 text-[var(--sg-color-text-muted)]">
                        {r.mitigation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <JourneyRoadmap
            assessment={report.assessment}
            productNoun={productNoun}
          />
        </div>

        {/* Right rail */}
        <aside className="space-y-4">
          <div
            className={cn(
              "rounded-[var(--sg-radius-xl)] border p-4",
              levelVariant === "success"
                ? "border-[var(--sg-color-success)]/30 bg-[var(--sg-color-success-soft)]"
                : levelVariant === "warning"
                  ? "border-[var(--sg-color-warning)]/30 bg-[var(--sg-color-warning-soft)]"
                  : "border-[var(--sg-color-danger)]/30 bg-[var(--sg-color-danger-soft)]",
            )}
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="font-semibold text-[var(--sg-color-navy)]">
                  {READINESS_LEVEL_LABELS[report.assessment.overallLevel]}
                </p>
                <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                  {report.strengthCount} strengths · {report.gapCount} gaps ·{" "}
                  {report.criticalBlockerCount} critical
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4">
            <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
              Assessment details
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Detail
                label="Project"
                value={session.context.projectName || "—"}
              />
              <Detail
                label="Assessed by"
                value={session.context.assessedBy || "—"}
              />
              <Detail
                label="Date"
                value={
                  session.completedAt?.slice(0, 10) ||
                  new Date().toISOString().slice(0, 10)
                }
              />
              <Detail
                label="Company size"
                value={session.context.companySize || "—"}
              />
              <Detail
                label="Industry"
                value={session.context.industry || "—"}
              />
            </dl>
          </div>

          <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4">
            <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
              Top issues to resolve
            </h3>
            <ol className="mt-3 space-y-3">
              {report.findings
                .filter(
                  (f) =>
                    f.type === "blocker" ||
                    f.type === "risk" ||
                    (f.type === "gap" && f.severity === "high"),
                )
                .slice(0, 5)
                .map((f) => (
                  <li key={f.id} className="flex gap-2 text-sm">
                    {f.severity === "critical" ? (
                      <XCircle
                        className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-danger)]"
                        aria-hidden
                      />
                    ) : (
                      <AlertTriangle
                        className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-warning)]"
                        aria-hidden
                      />
                    )}
                    <div>
                      <p className="font-medium text-[var(--sg-color-navy)]">
                        {f.title}
                      </p>
                      <p className="text-xs capitalize text-[var(--sg-color-text-muted)]">
                        {f.severity}
                      </p>
                    </div>
                  </li>
                ))}
            </ol>
          </div>

          <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4">
            <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
              What should you do next?
            </h3>
            <ul className="mt-3 space-y-3">
              {report.tools.map((t) => (
                <li
                  key={t.toolId}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--sg-color-navy)]">
                      {t.title}
                    </p>
                    <p className="text-xs text-[var(--sg-color-text-muted)]">
                      {t.locked ? t.lockReason : t.reason}
                    </p>
                  </div>
                  {t.locked ? (
                    <Badge variant="neutral">Later</Badge>
                  ) : (
                    <ButtonLink
                      href={t.href}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        track({
                          name: "crm_readiness_action_clicked",
                          properties: { tool: t.toolId },
                        })
                      }
                    >
                      Open
                      <ExternalLink className="size-3.5" aria-hidden />
                    </ButtonLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <Button variant="ghost" size="sm" className="w-full" onClick={onRestart}>
            Clear and restart
          </Button>
        </aside>
      </div>

      {/* Footer stats — qualitative value props, not fake benchmarks */}
      <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-5 py-6">
        <p className="text-center text-sm font-medium text-[var(--sg-color-navy)]">
          A strong start leads to better {productNoun} outcomes
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-[var(--sg-color-text-muted)]">
          Organizations that clarify ownership, requirements and data before
          vendor selection typically reduce rework, surprise costs and adoption
          friction. Figures below are illustrative planning heuristics — not
          SoftwareGlimpse survey benchmarks.
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-4">
          {[
            ["Clarity", "Fewer failed evaluations"],
            ["Ownership", "Faster decisions"],
            ["Data prep", "Smoother migration"],
            ["Adoption plan", "Higher sustained use"],
          ].map(([k, v]) => (
            <li key={k} className="text-center">
              <p className="font-semibold text-[var(--sg-color-navy)]">{k}</p>
              <p className="text-xs text-[var(--sg-color-text-muted)]">{v}</p>
            </li>
          ))}
        </ul>
        {relatedLinks && relatedLinks.length > 0 ? (
          <p className="mt-4 text-center text-xs text-[var(--sg-color-text-muted)]">
            Related:{" "}
            {relatedLinks.map((link, index) => (
              <span key={link.href}>
                {index > 0 ? " · " : null}
                <Link
                  href={link.href}
                  className="text-[var(--sg-color-primary)]"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </p>
        ) : (
          <p className="mt-4 text-center text-xs text-[var(--sg-color-text-muted)]">
            Related:{" "}
            <Link href="/guides/how-to-choose-crm/" className="text-[var(--sg-color-primary)]">
              How to choose CRM
            </Link>
            {" · "}
            <Link href="/guides/crm-implementation-guide/" className="text-[var(--sg-color-primary)]">
              Implementation guide
            </Link>
            {" · "}
            <Link href="/resources/" className="text-[var(--sg-color-primary)]">
              CRM resources
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

function ScoreCard({
  title,
  score,
  hint,
  tone,
}: {
  title: string;
  score: number;
  hint: string;
  tone: "primary" | "warning";
}) {
  return (
    <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]">
      <p className="text-sm font-medium text-[var(--sg-color-text-muted)]">
        {title}
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--sg-color-navy)]">
        {score}
        <span className="text-lg font-normal text-[var(--sg-color-text-muted)]">
          {" "}
          / 100
        </span>
      </p>
      <Badge
        className="mt-2"
        variant={score >= 65 ? (tone === "warning" && score < 75 ? "warning" : "success") : "warning"}
      >
        {scoreBandLabel(score)}
      </Badge>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "primary"
              ? "bg-[var(--sg-color-primary)]"
              : "bg-[var(--sg-color-warning)]",
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">{hint}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-[var(--sg-color-text-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--sg-color-navy)]">
        {value}
      </dd>
    </div>
  );
}

function ToolMiniLink({ toolId }: { toolId: string }) {
  const hrefMap: Record<string, string> = {
    "requirements-builder": "/tools/crm-requirements-builder/",
    "crm-finder": "/tools/crm-finder/",
    "cost-calculator": "/tools/crm-cost-calculator/",
    "roi-calculator": "/tools/crm-roi-calculator/",
    "rfp-builder": "/tools/crm-rfp-builder/",
    "demo-checklist": "/tools/crm-demo-checklist-builder/",
    "migration-planner": "/tools/crm-migration-planner/",
    "implementation-planner": "/tools/crm-implementation-planner/",
  };
  const href = hrefMap[toolId];
  if (!href) return null;
  return (
    <Link
      href={href}
      className="text-xs font-medium text-[var(--sg-color-primary)]"
      onClick={() =>
        track({
          name: "crm_readiness_action_clicked",
          properties: { tool: toolId },
        })
      }
    >
      Open related tool →
    </Link>
  );
}
