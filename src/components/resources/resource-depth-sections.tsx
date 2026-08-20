import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  FileText,
  XCircle,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ResourceHubModel } from "@/services/resource-hub";
import { cn } from "@/lib/cn";

export function ResourceMetaStrip({
  model,
  className,
}: {
  model: ResourceHubModel;
  className?: string;
}) {
  const cells = [
    model.glance.bestFor[0]
      ? { label: "Best for", value: model.glance.bestFor[0] }
      : null,
    model.glance.stageLabel
      ? { label: "Stage", value: model.glance.stageLabel }
      : null,
    model.glance.timeToComplete
      ? { label: "Time", value: model.glance.timeToComplete }
      : null,
    model.glance.formatsLabel
      ? { label: "Format", value: model.glance.formatsLabel }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  if (cells.length === 0) return null;

  return (
    <dl
      className={cn(
        "grid gap-3 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {cells.map((cell) => (
        <div key={cell.label} className="min-w-0">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            {cell.label}
          </dt>
          <dd className="mt-1 text-sm font-medium leading-snug text-[var(--sg-color-text)]">
            {cell.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ResourceValueBar({
  model,
  className,
}: {
  model: ResourceHubModel;
  className?: string;
}) {
  const sections = model.artifactSections.length;
  const items = model.artifactSections.reduce(
    (n, s) => n + s.items.length,
    0,
  );
  if (items === 0) return null;

  const kind = model.resource.kind;
  const buying = model.resource.buyingStage;
  const isBusinessCase = model.resource.slug === "crm-business-case-template";
  const isDecisionMatrix = model.resource.slug === "crm-comparison-worksheet";
  const isFieldMapping = model.resource.slug === "crm-field-mapping-template";
  const isVendorScorecard = model.resource.slug === "crm-vendor-scorecard";
  const isRfp = model.resource.slug === "crm-rfp-template";
  const isVendorEval =
    !isBusinessCase &&
    !isDecisionMatrix &&
    !isFieldMapping &&
    !isVendorScorecard &&
    !isRfp &&
    (buying === "EVALUATE" ||
      buying === "VALIDATE" ||
      buying === "DECIDE" ||
      kind === "scorecard" ||
      model.resource.slug.includes("evaluation") ||
      model.resource.slug.includes("demo") ||
      model.resource.slug.includes("rfp") ||
      model.resource.slug.includes("scorecard"));

  const itemLabel = isBusinessCase
    ? "workbook sections"
    : isDecisionMatrix
      ? "decision modules"
      : isFieldMapping
        ? "mapping modules"
        : isVendorScorecard
          ? "scoring modules"
          : isRfp
            ? "RFP sections"
        : kind === "scorecard"
      ? "scoring criteria"
      : kind === "planner"
        ? "plan rows"
        : kind === "worksheet"
          ? "matrix rows"
          : kind === "template"
            ? "template sections"
            : "checklist items";
  const sectionLabel = isBusinessCase
    ? "pages covered"
    : isDecisionMatrix
      ? "decision stages"
      : isFieldMapping
        ? "mapping stages"
        : isVendorScorecard
          ? "scorecard stages"
          : isRfp
            ? "procurement stages"
        : kind === "scorecard"
      ? "criteria groups"
      : kind === "planner"
        ? "plan sections"
        : "categories";

  const cells = isBusinessCase
    ? [
        { value: "12", label: "PDF workbook pages" },
        { value: "12", label: "Excel model sheets" },
        { value: "TCO + ROI", label: "financial engine" },
        {
          value: "Confidence",
          label: "Verified · Estimated · Scenario · Unknown",
        },
      ]
    : isDecisionMatrix
      ? [
          { value: "10", label: "PDF decision pages" },
          { value: "11", label: "Excel engine sheets" },
          { value: "Gates + weights", label: "qualification then fit" },
          {
            value: "1–5 · N/E",
            label: "scores with HIGH · MEDIUM · LOW · UNKNOWN",
          },
        ]
      : isFieldMapping
        ? [
            { value: "8", label: "PDF guide pages" },
            { value: "10", label: "Excel workbook sheets" },
            { value: "Field matrix", label: "primary working artifact" },
            {
              value: "Readiness",
              label: "BLOCKED · NOT READY · TEST · PRODUCTION",
            },
          ]
      : isVendorScorecard
        ? [
            { value: "8", label: "PDF scorecard pages" },
            { value: "8", label: "Excel scoring sheets" },
            { value: "1–5 · N/E", label: "weighted fit toward 100" },
            {
              value: "Gates",
              label: "must-haves override totals",
            },
          ]
      : isRfp
        ? [
            { value: "14", label: "PDF RFP pages" },
            { value: "18", label: "Excel response sheets" },
            { value: "CRM-REQ-*", label: "stable requirement IDs" },
            {
              value: "Delivery",
              label: "Native · Config · Custom · Roadmap…",
            },
          ]
      : isVendorEval
      ? [
          { value: String(items), label: itemLabel },
          { value: String(sections || "—"), label: sectionLabel },
          { value: "1", label: "consistent process across vendors" },
          {
            value: "Better decisions",
            label: "with less risk and more proof",
          },
        ]
      : [
          { value: String(items), label: itemLabel },
          { value: String(sections || "—"), label: sectionLabel },
          {
            value: model.glance.stageLabel || "Ready",
            label: "buying stage",
          },
          {
            value: model.glance.formatsLabel || "Excel + PDF",
            label: "download formats",
          },
        ];

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-xl)] bg-[#eff6ff] px-4 py-5 sm:px-6",
        className,
      )}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cells.map((cell) => (
          <li key={`${cell.value}-${cell.label}`} className="min-w-0">
            <p className="text-lg font-semibold text-[var(--sg-color-navy)]">
              {cell.value}
            </p>
            <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
              {cell.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResourceHelpsYouDo({
  outcomes,
  className,
}: {
  outcomes: ResourceHubModel["outcomes"];
  className?: string;
}) {
  if (!outcomes?.length) return null;
  return (
    <section
      id="helps-you-do"
      aria-labelledby="helps-you-do-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="helps-you-do-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        What this tool helps you do
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {outcomes.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white p-4"
          >
            <span
              className="mt-0.5 text-[var(--sg-color-primary)]"
              aria-hidden
            >
              →
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
                {item.title}
              </p>
              {item.description ? (
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ResourceWhatsInside({
  cards,
  visual,
  className,
}: {
  cards: ResourceHubModel["whatsInside"];
  visual?: ResourceHubModel["needsVisual"];
  className?: string;
}) {
  if (cards.length === 0 && !visual) return null;
  return (
    <section
      id="whats-inside"
      aria-labelledby="whats-inside-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="whats-inside-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        What&apos;s inside
      </h2>
      {visual ? (
        <figure className="mt-5 overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visual.src}
            alt={visual.alt}
            className="h-auto w-full object-contain"
          />
          {visual.caption ? (
            <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2 text-xs text-[var(--sg-color-text-muted)]">
              {visual.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
      {cards.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <li
              key={card.id}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white p-4"
            >
              <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
                {card.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                {card.description}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function ResourceHowToTimeline({
  steps,
  artifactLabel = "resource",
  visual,
  className,
}: {
  steps: ResourceHubModel["workflowSteps"];
  artifactLabel?: string;
  visual?: ResourceHubModel["workflowVisual"];
  className?: string;
}) {
  if (steps.length === 0 && !visual) return null;
  return (
    <section
      id="how-to-use"
      aria-labelledby="how-to-use-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="how-to-use-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How to use this {artifactLabel}
      </h2>
      {visual ? (
        <figure className="mt-5 overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visual.src}
            alt={visual.alt}
            className="h-auto w-full object-contain"
          />
          {visual.caption ? (
            <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2 text-xs text-[var(--sg-color-text-muted)]">
              {visual.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
      {steps.length > 0 ? (
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="relative rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--sg-color-navy)]">
                    {step.label}
                  </p>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {step.detail}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

export function ResourceArtifactPreview({
  sections,
  downloadHref,
  artifactLabel = "resource",
  className,
  variant = "checklist",
}: {
  sections: ResourceHubModel["artifactSections"];
  downloadHref?: string;
  artifactLabel?: string;
  className?: string;
  /** Checklist Pass/Fail preview vs structured workbook previews. */
  variant?:
    | "checklist"
    | "business-case"
    | "decision-matrix"
    | "field-mapping"
    | "scorecard"
    | "rfp";
}) {
  if (sections.length === 0) return null;
  const structured =
    variant === "business-case" ||
    variant === "decision-matrix" ||
    variant === "field-mapping" ||
    variant === "scorecard" ||
    variant === "rfp";
  const previewSections = sections.slice(0, structured ? 5 : 2);
  const previewRows = previewSections.flatMap((section) =>
    section.items.slice(0, structured ? 2 : 4).map((item) => ({
      section,
      item,
    })),
  );

  const isBusinessCase = variant === "business-case";
  const isDecisionMatrix = variant === "decision-matrix";
  const isFieldMapping = variant === "field-mapping";
  const isScorecard = variant === "scorecard";
  const isRfp = variant === "rfp";

  return (
    <section
      id="preview"
      aria-labelledby="preview-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="preview-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {isBusinessCase
            ? "Example business case structure"
            : isDecisionMatrix
              ? "Example decision matrix structure"
              : isFieldMapping
                ? "Example field mapping structure"
                : isScorecard
                  ? "Example scorecard structure"
                  : isRfp
                    ? "Example RFP structure"
                : `Preview the ${artifactLabel}`}
        </h2>
        {downloadHref ? (
          <ButtonLink href={downloadHref} size="sm">
            {isBusinessCase ? "Download PDF" : "Download Excel"}
          </ButtonLink>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        {isBusinessCase
          ? "Representative sections from the PDF workbook and Excel model. Full pack includes TCO, benefits, financial case, risks, assumptions register, and approval."
          : isDecisionMatrix
            ? "Representative modules from the Excel decision engine and PDF summary. Full pack includes gates, weights, scoring, evidence, TCO, sensitivity, and recommendation."
            : isFieldMapping
              ? "Representative modules from the Excel mapping workbook and PDF guide. Full pack includes object map, field matrix, value maps, transforms, lookups, validation, and readiness."
            : isScorecard
              ? "Representative modules from the Excel scoring engine and PDF pack. Full pack includes weights, 1–5 scores, confidence, must-have gates, evidence, and decision archive."
            : isRfp
              ? "Representative sections from the vendor-facing RFP. Full pack includes instructions, requirements with stable IDs, pricing sheets, declaration, and an INTERNAL evaluation page."
            : "Representative rows from the downloadable artifact. Full workbook includes Test / Scenario, Evidence, and Result columns."}
      </p>

      {structured ? (
        <ol className="mt-5 space-y-3">
          {previewSections.map((section, index) => (
            <li
              key={section.id}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white p-4 shadow-[var(--sg-shadow-sm)]"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                Step {index + 1}
              </p>
              <p className="mt-1 font-semibold text-[var(--sg-color-navy)]">
                {section.title}
              </p>
              {section.intro ? (
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {section.intro}
                </p>
              ) : null}
              <ul className="mt-3 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                {section.items.slice(0, 2).map((item) => (
                  <li key={item.id} className="flex gap-2">
                    <span className="text-[var(--sg-color-primary)]" aria-hidden>
                      →
                    </span>
                    <span>
                      <span className="font-medium text-[var(--sg-color-text)]">
                        {item.label}
                      </span>
                      {item.detail ? ` — ${item.detail}` : null}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li className="rounded-[var(--sg-radius-lg)] border border-dashed border-[var(--sg-color-border)] bg-[#eff6ff] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]">
            {isBusinessCase
              ? "Flow: Current state → Investment → Benefits → ROI → Recommendation → Approval"
              : isFieldMapping
                ? "Flow: Source CRM → Object mapping → Field mapping → Transform → Validation → Target CRM"
                : isScorecard
                  ? "Flow: Import criteria → Freeze weights → Score 1–5 → Apply gates → Totals → Decide"
                  : isRfp
                    ? "Flow: Requirements → RFP → Vendor responses → Demo → Scorecard → Decision"
                : "Flow: Qualify → Score → Compare cost → Assess risk → Recommend"}
          </li>
        </ol>
      ) : (
      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-white shadow-[var(--sg-shadow-sm)]">
        <table className="min-w-[48rem] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-navy)] text-white">
              <th className="px-3 py-2.5 font-semibold">#</th>
              <th className="px-3 py-2.5 font-semibold">Check item</th>
              <th className="px-3 py-2.5 font-semibold">Why it matters</th>
              <th className="px-3 py-2.5 font-semibold">Required?</th>
              <th className="px-3 py-2.5 font-semibold">Evidence</th>
              <th className="px-3 py-2.5 font-semibold">Result</th>
            </tr>
          </thead>
          <tbody>
            {previewRows.map(({ section, item }, idx) => {
              const showSection =
                idx === 0 ||
                previewRows[idx - 1]?.section.id !== section.id;
              return (
                <Fragment key={item.id}>
                  {showSection ? (
                    <tr className="bg-[#ecfdf5]">
                      <td
                        colSpan={6}
                        className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-emerald-900"
                      >
                        {section.title}
                      </td>
                    </tr>
                  ) : null}
                  <tr className="border-t border-[var(--sg-color-border)]">
                    <td className="px-3 py-2.5 text-[var(--sg-color-text-muted)]">
                      {item.id}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-[var(--sg-color-text)]">
                      {item.label}
                    </td>
                    <td className="px-3 py-2.5 text-[var(--sg-color-text-muted)]">
                      {item.whyItMatters ?? item.detail ?? "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      {item.required === true
                        ? "Must-have"
                        : item.required === false
                          ? "Nice-to-have"
                          : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-[var(--sg-color-text-muted)]">
                      —
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        <CircleDashed className="size-3" aria-hidden />
                        Not tested
                      </span>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </section>
  );
}

export function ResourceWorkedExampleBlock({
  structured,
  fallback,
  className,
}: {
  structured: ResourceHubModel["workedExampleStructured"];
  fallback?: string | null;
  className?: string;
}) {
  if (!structured && !fallback) return null;

  if (structured) {
    const resultStyle = {
      PASS: "bg-emerald-100 text-emerald-800",
      PARTIAL: "bg-amber-100 text-amber-900",
      FAIL: "bg-rose-100 text-rose-800",
      NOT_TESTED: "bg-slate-100 text-slate-700",
    } as const;

    return (
      <section
        id="worked-example"
        aria-labelledby="worked-example-heading"
        className={cn("scroll-mt-28", className)}
      >
        <h2
          id="worked-example-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {structured.title}
        </h2>
        <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
          {structured.disclaimer}
        </p>
        <Card className="mt-4 space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Requirement
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--sg-color-text)]">
              {structured.requirement}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {structured.vendors.map((v) => (
              <li
                key={v.name}
                className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-[var(--sg-color-navy)]">
                    {v.name}
                  </p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      resultStyle[v.result],
                    )}
                  >
                    {v.result.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                  {v.note}
                </p>
              </li>
            ))}
          </ul>
          {structured.evidence ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              <span className="font-semibold text-[var(--sg-color-text)]">
                Evidence:{" "}
              </span>
              {structured.evidence}
            </p>
          ) : null}
        </Card>
      </section>
    );
  }

  return (
    <section
      id="worked-example"
      aria-labelledby="worked-example-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="worked-example-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Example scenario
      </h2>
      <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
        Hypothetical teaching scenario — not a SoftwareGlimpse case study.
      </p>
      <Card className="mt-4 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
        {fallback}
      </Card>
    </section>
  );
}

export function ResourceEvidenceRules({
  rules,
  className,
}: {
  rules: ResourceHubModel["evidenceRules"];
  className?: string;
}) {
  if (!rules) return null;
  return (
    <section
      id="evidence"
      aria-labelledby="evidence-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="evidence-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        What counts as evidence?
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--sg-radius-lg)] border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <CheckCircle2 className="size-4" aria-hidden />
            Counts
          </p>
          <ul className="mt-3 space-y-2 text-sm text-emerald-950/80">
            {rules.countsAs.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[var(--sg-radius-lg)] border border-rose-200 bg-rose-50/60 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-rose-900">
            <XCircle className="size-4" aria-hidden />
            Does not count
          </p>
          <ul className="mt-3 space-y-2 text-sm text-rose-950/80">
            {rules.doesNotCount.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function ResourceRelationships({
  useBefore,
  useWith,
  useNext,
  className,
}: {
  useBefore: ResourceHubModel["useBefore"];
  useWith: ResourceHubModel["useWith"];
  useNext: ResourceHubModel["useNext"];
  className?: string;
}) {
  const groups = [
    { title: "Use before", items: useBefore },
    { title: "Use with", items: useWith },
    { title: "Use next", items: useNext },
  ].filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section
      id="relationships"
      aria-labelledby="relationships-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="relationships-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Related resource journey
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.title}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {group.title}
            </p>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    {item.name}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ResourceFaq({
  items,
  className,
}: {
  items: ResourceHubModel["faq"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="faq-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        FAQ
      </h2>
      <div className="mt-4 divide-y divide-[var(--sg-color-border)] rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-white">
        {items.map((item) => (
          <details key={item.question} className="group px-4 py-3">
            <summary className="cursor-pointer list-none font-medium text-[var(--sg-color-text)] marker:content-none">
              {item.question}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ResourceFinalCta({
  model,
  className,
}: {
  model: ResourceHubModel;
  className?: string;
}) {
  const isBusinessCase = model.resource.slug === "crm-business-case-template";
  const isDecisionMatrix = model.resource.slug === "crm-comparison-worksheet";
  const isFieldMapping = model.resource.slug === "crm-field-mapping-template";
  const isVendorScorecard = model.resource.slug === "crm-vendor-scorecard";
  const isRfp = model.resource.slug === "crm-rfp-template";
  const isEvaluate =
    !isBusinessCase &&
    !isDecisionMatrix &&
    !isFieldMapping &&
    !isVendorScorecard &&
    !isRfp &&
    (model.resource.buyingStage === "EVALUATE" ||
      model.resource.slug.includes("evaluation") ||
      model.resource.slug.includes("demo") ||
      model.resource.slug.includes("scorecard"));

  const title = isBusinessCase
    ? "Ready to build your CRM business case?"
    : isDecisionMatrix
      ? "Ready to decide between CRM finalists?"
      : isFieldMapping
        ? "Ready to map source fields to your target CRM?"
      : isVendorScorecard
        ? "Ready to score your CRM shortlist?"
      : isRfp
        ? "Ready to issue a CRM RFP to vendors?"
      : isEvaluate
        ? "Ready to evaluate your shortlist?"
        : `Ready to use the ${model.displayTitle}?`;
  const description = isBusinessCase
    ? "Download the PDF workbook for sponsors, then populate the Excel financial model — without inventing ROI."
    : isDecisionMatrix
      ? "Download the Excel decision engine first, then share the PDF summary with your committee — without inventing scores or prices."
      : isFieldMapping
        ? "Download the Excel mapping workbook first, then use the PDF as the workshop and sign-off guide — replace EXAMPLE rows with your schema."
      : isVendorScorecard
        ? "Download the Excel scoring engine first, then share the PDF with your committee — freeze weights before demos; do not invent scores."
      : isRfp
        ? "Download the Excel response workbook for vendors, use the PDF as the readable brief, and keep the INTERNAL page off the vendor package."
      : isEvaluate
        ? "Download the checklist, then build or refine your shortlist in CRM Finder."
        : "Download the artifact, or continue with a related tool or guide.";

  return (
    <section
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[linear-gradient(160deg,#eff6ff_0%,#f8fafc_100%)] px-6 py-8",
        className,
      )}
    >
      <div className="flex flex-wrap items-start gap-3">
        <FileText
          className="mt-1 size-6 text-[var(--sg-color-primary)]"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            {description}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={model.primaryCta.href} size="lg">
              {model.primaryCta.label}
            </ButtonLink>
            {model.secondaryCta ? (
              <ButtonLink
                href={model.secondaryCta.href}
                variant="outline"
                size="lg"
              >
                {model.secondaryCta.label}
              </ButtonLink>
            ) : (
              <ButtonLink href={model.finderHref} variant="outline" size="lg">
                {isEvaluate ? "Build your shortlist" : "Open CRM Finder"}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** @deprecated Legacy export — prefer ResourceMetaStrip */
export function ResourceGlanceStrip(props: {
  model: ResourceHubModel;
  className?: string;
}) {
  return <ResourceMetaStrip {...props} />;
}

export function ResourceQuickNav({
  items,
  className,
}: {
  items: ResourceHubModel["navItems"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label="On this page"
      className={cn(
        "flex flex-wrap gap-2 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3",
        className,
      )}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)] px-3 py-1 text-xs font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

/** Lightweight overview for resources without whatsInside cards. */
export function ResourceOverviewLite({
  overview,
  whoThisIsFor,
  className,
}: {
  overview: string;
  whoThisIsFor?: string | null;
  className?: string;
}) {
  return (
    <section className={cn("scroll-mt-28 space-y-3", className)}>
      <p className="text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
        {overview}
      </p>
      {whoThisIsFor ? (
        <p className="text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          <span className="font-semibold text-[var(--sg-color-text)]">
            Best for:{" "}
          </span>
          {whoThisIsFor}
        </p>
      ) : null}
    </section>
  );
}
