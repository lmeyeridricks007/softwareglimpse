"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type {
  CrmDemoChecklistDraft,
  CrmDemoChecklistSession,
  ScoringMethodology,
} from "@/domain";
import type { AnalyticsEventName } from "@/analytics";
import { track } from "@/analytics";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  applyScorecardHandoff,
  buildVendorComparison,
  computeRequirementsCoverage,
  countDemoTasks,
  downloadDemoMarkdown,
  estimateAgendaMinutes,
  includedScenarios,
  moveAgendaBlock,
  previewScorecardHandoff,
  rebuildAgendaFromDraft,
  resolveDemoDurationMinutes,
} from "@/services/demo-checklist-builder";
import type { DemoQualityReport } from "@/services/demo-checklist-builder/quality";
import { StepHeader, type DemoDraftPatch } from "./step-header";

type DraftProps = {
  draft: CrmDemoChecklistDraft;
  patch: DemoDraftPatch;
};

function trackDemo(
  name: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  track({ name: name as AnalyticsEventName, properties });
}

const READINESS_LABELS: Record<DemoQualityReport["status"], string> = {
  good: "Good",
  "needs-work": "Needs work",
  incomplete: "Incomplete",
};

export function DemoStepScoring({ draft, patch }: DraftProps) {
  const rules = draft.scoringRules;

  return (
    <div>
      <StepHeader
        stepLabel="Step 8"
        title="Scoring & evidence rules"
        description="Separate what was demonstrated from what the vendor stated. Must-have failures stay visible — do not downgrade silently."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Scoring methodology" htmlFor="demo-scoring-method">
          <Select
            id="demo-scoring-method"
            value={rules.methodology}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                scoringRules: {
                  ...d.scoringRules,
                  methodology: e.target.value as ScoringMethodology,
                },
              }))
            }
          >
            <option value="0-5">0–5 scale</option>
            <option value="pass-fail">Pass / fail</option>
            <option value="weighted">Weighted categories</option>
          </Select>
        </Field>
      </div>

      <div className="mt-4 space-y-3">
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={rules.requireEvidenceStatus}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                scoringRules: {
                  ...d.scoringRules,
                  requireEvidenceStatus: e.target.checked,
                },
              }))
            }
          />
          <span>
            Require evidence status for each item (verified in demo vs vendor
            stated vs follow-up)
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={rules.separateVendorStated}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                scoringRules: {
                  ...d.scoringRules,
                  separateVendorStated: e.target.checked,
                },
              }))
            }
          />
          <span>
            Flag vendor-stated claims separately from live demonstration
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={rules.mustHaveGatesEnabled}
            onChange={(e) =>
              patch((d) => ({
                ...d,
                scoringRules: {
                  ...d.scoringRules,
                  mustHaveGatesEnabled: e.target.checked,
                },
              }))
            }
          />
          <span>Enable must-have gates — failures block shortlist progression</span>
        </label>
      </div>

      <Field
        label="Evaluator notes"
        htmlFor="demo-scoring-notes"
        hint="Team rules, tie-breakers, or evidence standards"
      >
        <Textarea
          id="demo-scoring-notes"
          value={rules.notes}
          onChange={(e) =>
            patch((d) => ({
              ...d,
              scoringRules: { ...d.scoringRules, notes: e.target.value },
            }))
          }
          className="min-h-24"
        />
      </Field>
    </div>
  );
}

export function DemoStepAgenda({ draft, patch }: DraftProps) {
  const available = resolveDemoDurationMinutes(draft.setup);
  const agenda = [...draft.agenda]
    .filter((b) => b.included)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const total = agenda.reduce((s, b) => s + b.minutes, 0);
  const overTime = total > available;

  const moveBlock = (index: number, direction: -1 | 1) => {
    const sorted = [...draft.agenda].sort((a, b) => a.sortOrder - b.sortOrder);
    const to = index + direction;
    patch((d) => ({
      ...d,
      agenda: moveAgendaBlock(sorted, index, to),
    }));
  };

  return (
    <div>
      <StepHeader
        stepLabel="Step 9"
        title="Agenda & time"
        description="Build the demo flow vendors must follow. Rebuild from your scenarios or reorder blocks manually."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            patch((d) => ({
              ...d,
              agenda: rebuildAgendaFromDraft(d),
            }))
          }
        >
          Rebuild from draft
        </Button>
      </div>

      <div
        className={cn(
          "mb-4 rounded-[var(--sg-radius-md)] px-4 py-3 text-sm",
          overTime
            ? "border border-[var(--sg-color-warning)]/50 bg-[var(--sg-color-warning-soft)]/50"
            : "border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/30",
        )}
      >
        <p className="font-semibold text-[var(--sg-color-navy)]">
          Running total: {total} / {available} minutes
        </p>
        {overTime ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--sg-color-warning)]">
            <AlertTriangle className="size-3.5" aria-hidden />
            Agenda exceeds available demo time — trim optional blocks or extend duration.
          </p>
        ) : null}
      </div>

      {agenda.length === 0 ? (
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          No agenda blocks yet. Click &quot;Rebuild from draft&quot; to generate
          from scenarios and admin tasks.
        </p>
      ) : (
        <ul className="space-y-2">
          {agenda.map((block, index) => (
            <li
              key={block.id}
              className="flex flex-wrap items-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2"
            >
              <span className="min-w-0 flex-1 text-sm font-medium text-[var(--sg-color-navy)]">
                {block.label}
              </span>
              <Badge variant="neutral">{block.kind}</Badge>
              <Input
                type="number"
                min={0}
                max={240}
                className="w-20"
                aria-label={`Minutes for ${block.label}`}
                value={block.minutes}
                onChange={(e) =>
                  patch((d) => ({
                    ...d,
                    agenda: d.agenda.map((b) =>
                      b.id === block.id
                        ? { ...b, minutes: Number(e.target.value) || 0 }
                        : b,
                    ),
                  }))
                }
              />
              <span className="text-xs text-[var(--sg-color-text-muted)]">min</span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={index === 0}
                  aria-label={`Move ${block.label} up`}
                  onClick={() => moveBlock(index, -1)}
                >
                  <ChevronUp className="size-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={index === agenda.length - 1}
                  aria-label={`Move ${block.label} down`}
                  onClick={() => moveBlock(index, 1)}
                >
                  <ChevronDown className="size-4" aria-hidden />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DemoStepReview({
  draft,
  quality,
}: {
  draft: CrmDemoChecklistDraft;
  quality: DemoQualityReport;
}) {
  const coverage = useMemo(() => computeRequirementsCoverage(draft), [draft]);
  const scenarios = includedScenarios(draft).length;

  return (
    <div>
      <StepHeader
        stepLabel="Step 10"
        title="Review & generate"
        description="Confirm the same checklist goes to every vendor before exporting or recording results."
      />

      <div
        className={cn(
          "rounded-[var(--sg-radius-md)] px-4 py-3",
          quality.status === "good"
            ? "border border-green-200 bg-green-50"
            : quality.status === "needs-work"
              ? "border border-amber-200 bg-amber-50"
              : "border border-red-200 bg-red-50",
        )}
      >
        <p className="font-semibold text-[var(--sg-color-navy)]">
          Readiness: {READINESS_LABELS[quality.status]}
        </p>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          {scenarios} scenarios · {countDemoTasks(draft)} tasks ·{" "}
          {coverage.overallPct}% requirements · {quality.mustHaveCoveragePct}%
          must-haves · {estimateAgendaMinutes(draft)} min estimated
        </p>
      </div>

      {quality.issues.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Quality issues ({quality.issues.length})
          </h3>
          <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto text-sm">
            {quality.issues.map((issue) => (
              <li
                key={issue.id}
                className={cn(
                  "rounded-[var(--sg-radius-md)] border px-3 py-2",
                  issue.severity === "error"
                    ? "border-red-200 bg-red-50/50"
                    : issue.severity === "warning"
                      ? "border-amber-200 bg-amber-50/50"
                      : "border-[var(--sg-color-border)]",
                )}
              >
                <p>{issue.message}</p>
                {issue.suggestion ? (
                  <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                    {issue.suggestion}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--sg-color-success)]">
          No blocking issues detected. You can generate exports.
        </p>
      )}

      <Field
        label="Demo guidelines (sent to vendors)"
        htmlFor="demo-guidelines"
        hint="Editable vendor instructions"
      >
        <Textarea
          id="demo-guidelines"
          readOnly
          value={draft.demoGuidelines}
          className="min-h-32 font-mono text-xs"
        />
      </Field>
    </div>
  );
}

export function DemoResults({
  session,
  onSessionUpdate,
  onEdit,
  scorecardCategorySlug = "crm",
}: {
  session: CrmDemoChecklistSession;
  onSessionUpdate: (session: CrmDemoChecklistSession) => void;
  onEdit: () => void;
  scorecardCategorySlug?: string;
}) {
  const draft = session.draft;
  const [busy, setBusy] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState(
    draft.activeVendorId ?? draft.vendorEvaluations[0]?.vendorId ?? "",
  );
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [overwrite, setOverwrite] = useState(false);

  const activeVendor =
    draft.vendorEvaluations.find((v) => v.vendorId === vendorId) ??
    draft.vendorEvaluations[0];

  const comparison = useMemo(() => buildVendorComparison(session), [session]);
  const handoffPreview = useMemo(
    () =>
      previewScorecardHandoff(session, {
        vendorId: activeVendor?.vendorId,
        overwriteExisting: false,
        categorySlug: scorecardCategorySlug,
      }),
    [session, activeVendor?.vendorId, scorecardCategorySlug],
  );

  const run = async (key: string, fn: () => Promise<void> | void) => {
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };

  const vendorName = activeVendor?.vendorLabel || activeVendor?.vendorId;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
          Ready
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
          Your demo checklist is ready
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Export the same script for every vendor, then record per-vendor results.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">
            Checklist PDF
          </h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Full evaluation workbook
          </p>
          <Button
            className="mt-3 w-full"
            size="sm"
            loading={busy === "pdf"}
            onClick={() =>
              run("pdf", async () => {
                const { downloadDemoChecklistPdf } = await import(
                  "@/services/demo-checklist-builder/export-pdf"
                );
                await downloadDemoChecklistPdf(session, {
                  vendorName,
                });
                trackDemo("demo_checklist_exported", { format: "pdf" });
              })
            }
          >
            Download PDF
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">Agenda PDF</h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Timed run-of-show with clock, blocks and demo rules
          </p>
          <Button
            className="mt-3 w-full"
            size="sm"
            variant="secondary"
            loading={busy === "agenda-pdf"}
            onClick={() =>
              run("agenda-pdf", async () => {
                const { downloadDemoAgendaPdf } = await import(
                  "@/services/demo-checklist-builder/export-pdf"
                );
                await downloadDemoAgendaPdf(session);
                trackDemo("demo_checklist_exported", { format: "agenda-pdf" });
              })
            }
          >
            Download agenda
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">
            Vendor brief PDF
          </h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Prep pack for vendors: scenarios, steps and success criteria
          </p>
          <Button
            className="mt-3 w-full"
            size="sm"
            variant="secondary"
            loading={busy === "brief-pdf"}
            onClick={() =>
              run("brief-pdf", async () => {
                const { downloadDemoVendorBriefPdf } = await import(
                  "@/services/demo-checklist-builder/export-pdf"
                );
                await downloadDemoVendorBriefPdf(session, {
                  vendorName: activeVendor?.vendorLabel,
                });
                trackDemo("demo_checklist_exported", {
                  format: "vendor-brief-pdf",
                });
              })
            }
          >
            Download brief
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">Excel</h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Scoring workbook per vendor
          </p>
          <Button
            className="mt-3 w-full"
            size="sm"
            loading={busy === "xlsx"}
            onClick={() =>
              run("xlsx", async () => {
                const { downloadDemoChecklistExcel } = await import(
                  "@/services/demo-checklist-builder/export-xlsx"
                );
                await downloadDemoChecklistExcel(session, {
                  vendorId: activeVendor?.vendorId,
                });
                trackDemo("demo_checklist_exported", { format: "xlsx" });
              })
            }
          >
            Download Excel
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">Markdown</h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Editable collaborative format
          </p>
          <Button
            className="mt-3 w-full"
            size="sm"
            variant="secondary"
            loading={busy === "md"}
            onClick={() =>
              run("md", () => {
                downloadDemoMarkdown(session, { vendorName });
                trackDemo("demo_checklist_exported", { format: "markdown" });
              })
            }
          >
            Download Markdown
          </Button>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--sg-color-navy)]">Print</h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Browser print dialog
          </p>
          <Button
            className="mt-3 w-full"
            size="sm"
            variant="ghost"
            onClick={() => window.print()}
          >
            Print checklist
          </Button>
        </Card>
      </div>

      {draft.vendorEvaluations.length > 0 ? (
        <Field label="Active vendor" htmlFor="demo-vendor-select">
          <Select
            id="demo-vendor-select"
            value={vendorId}
            onChange={(e) => {
              setVendorId(e.target.value);
              onSessionUpdate({
                ...session,
                draft: { ...draft, activeVendorId: e.target.value },
              });
            }}
          >
            {draft.vendorEvaluations.map((v) => (
              <option key={v.vendorId} value={v.vendorId}>
                {v.vendorLabel || v.vendorId}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      {comparison.vendors.length > 1 ? (
        <div>
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Vendor comparison
          </h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--sg-color-border)]">
                  <th className="py-2 pr-2">Category</th>
                  {comparison.vendors.map((v) => (
                    <th key={v.id} className="py-2 pr-2">
                      {v.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr
                    key={row.category}
                    className="border-b border-[var(--sg-color-border)]"
                  >
                    <td className="py-2 pr-2 capitalize">{row.category}</td>
                    {comparison.vendors.map((v) => (
                      <td key={v.id} className="py-2 pr-2 tabular-nums">
                        {row.scores[v.id] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b border-[var(--sg-color-border)]">
                  <td className="py-2 pr-2 font-medium">Must-have fails</td>
                  {comparison.vendors.map((v) => (
                    <td key={v.id} className="py-2 pr-2 tabular-nums text-[var(--sg-color-danger)]">
                      {comparison.mustHaveFails[v.id] ?? 0}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-medium">Not verified</td>
                  {comparison.vendors.map((v) => (
                    <td key={v.id} className="py-2 pr-2 tabular-nums">
                      {comparison.notVerified[v.id] ?? 0}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <Card className="p-4">
        <h3 className="font-semibold text-[var(--sg-color-navy)]">
          Vendor Scorecard handoff
        </h3>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Import demo results into your CRM Vendor Scorecard. Existing scores are
          never overwritten without confirmation.
        </p>
        <Button
          type="button"
          className="mt-3"
          size="sm"
          variant="outline"
          onClick={() => setHandoffOpen((o) => !o)}
        >
          {handoffOpen ? "Hide preview" : "Preview handoff"}
        </Button>

        {handoffOpen ? (
          <div className="mt-4 space-y-3">
            {handoffPreview.length === 0 ? (
              <p className="text-sm text-[var(--sg-color-text-muted)]">
                No mappable requirement results yet. Record demo outcomes first.
              </p>
            ) : (
              <ul className="max-h-48 space-y-1 overflow-y-auto text-xs">
                {handoffPreview.map((item) => (
                  <li
                    key={item.requirementId}
                    className={cn(
                      "rounded px-2 py-1",
                      item.willOverwrite && "bg-[var(--sg-color-warning-soft)]",
                    )}
                  >
                    <span className="font-medium">{item.requirementId}</span>
                    {" → "}
                    {item.proposedResult}
                    {item.willOverwrite ? (
                      <span className="text-[var(--sg-color-warning)]">
                        {" "}
                        (overwrites {item.existingResult})
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            {handoffPreview.some((i) => i.willOverwrite) ? (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={overwrite}
                  onChange={(e) => setOverwrite(e.target.checked)}
                />
                Confirm overwrite of existing scorecard entries
              </label>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={
                  handoffPreview.length === 0 ||
                  (handoffPreview.some((i) => i.willOverwrite) && !overwrite)
                }
                onClick={() => {
                  const { applied, skipped } = applyScorecardHandoff(session, {
                    vendorId: activeVendor?.vendorId,
                    overwriteExisting: overwrite,
                    categorySlug: scorecardCategorySlug,
                  });
                  trackDemo("demo_scorecard_handoff", { applied, skipped });
                  window.alert(
                    `Imported ${applied} result(s)${skipped ? `, skipped ${skipped}` : ""}.`,
                  );
                }}
              >
                Import to Scorecard
              </Button>
              <ButtonLink href="/tools/crm-vendor-scorecard/" size="sm">
                Open Scorecard
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={onEdit}>
          Edit checklist
        </Button>
        <Link
          href="/resources/crm-comparison-worksheet/"
          className="inline-flex items-center text-sm font-medium text-[var(--sg-color-primary)] underline"
        >
          CRM comparison worksheet
        </Link>
      </div>
    </div>
  );
}
