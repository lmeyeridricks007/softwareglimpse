"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, Minus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { cn } from "@/lib/cn";
import type {
  WorkflowExperienceModel,
  WorkflowExperienceStep,
  WorkflowLink,
  WorkflowStepMediaCue,
  WorkflowSupportStatus,
} from "@/services/workflow-experience";

function padIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function supportLabel(status: WorkflowSupportStatus): string {
  if (status === "supported") return "Supported";
  if (status === "partial") return "Partial";
  if (status === "not-supported") return "Not supported";
  return "Unknown";
}

function SupportGlyph({ status }: { status: WorkflowSupportStatus }) {
  if (status === "supported") {
    return (
      <Check className="size-4 text-[var(--sg-color-success)]" aria-hidden />
    );
  }
  if (status === "partial") {
    return (
      <span
        className="text-sm font-semibold text-[var(--sg-color-warning)]"
        aria-hidden
      >
        △
      </span>
    );
  }
  if (status === "not-supported") {
    return (
      <Minus className="size-4 text-[var(--sg-color-text-muted)]" aria-hidden />
    );
  }
  return (
    <span className="text-xs text-[var(--sg-color-text-muted)]" aria-hidden>
      —
    </span>
  );
}

function LinkChip({ link }: { link: WorkflowLink }) {
  const chip = (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-2.5 py-1 text-xs font-medium">
      {link.priority === "must" ? (
        <Badge variant="success" className="px-1.5 py-0 text-[10px]">
          Must
        </Badge>
      ) : link.priority === "important" ? (
        <Badge variant="primary" className="px-1.5 py-0 text-[10px]">
          Important
        </Badge>
      ) : link.priority === "optional" ? (
        <Badge variant="neutral" className="px-1.5 py-0 text-[10px]">
          Optional
        </Badge>
      ) : null}
      {link.label}
    </span>
  );
  if (link.href) {
    return (
      <Link
        href={link.href}
        className="text-[var(--sg-color-primary)] hover:opacity-90"
      >
        {chip}
      </Link>
    );
  }
  return chip;
}

function MediaDrawer({
  cue,
  open,
  onClose,
}: {
  cue: WorkflowStepMediaCue | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !cue) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="workflow-media-drawer-title"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-[var(--sg-color-surface)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--sg-color-border)] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Official demonstration · {cue.productName}
            </p>
            <h2
              id="workflow-media-drawer-title"
              className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold"
            >
              {cue.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--sg-radius-md)] p-2 text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)]"
            aria-label="Close media drawer"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-5 p-5">
          {cue.contextLabel ? (
            <p className="inline-flex rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-text)]">
              {cue.contextLabel}
            </p>
          ) : null}
          <OfficialProductVideo
            media={cue.media}
            vendorName={cue.productName}
            variant="compact"
            priority="low"
          />
          {cue.demonstrates.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Demonstrates
              </p>
              <ul className="mt-2 space-y-1.5">
                {cue.demonstrates.map((line) => (
                  <li key={line} className="flex gap-2 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                      aria-hidden
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {cue.doesNotEstablish.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Does not establish
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                {cue.doesNotEstablish.slice(0, 5).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Source: {cue.sourceOrganization}
          </p>
          <ExternalLink
            href={cue.sourceUrl}
            type="evidence-source"
            className="text-sm font-medium"
          >
            Open official source ↗
          </ExternalLink>
        </div>
      </div>
    </div>
  );
}

function StepExpandedBody({
  step,
  productsHref,
  evidenceHref,
  onOpenMedia,
}: {
  step: WorkflowExperienceStep;
  productsHref?: string | null;
  evidenceHref?: string | null;
  onOpenMedia: (cue: WorkflowStepMediaCue) => void;
}) {
  const must = step.requirements.filter((r) => r.priority === "must");
  const important = step.requirements.filter((r) => r.priority === "important");
  const optional = step.requirements.filter(
    (r) => !r.priority || r.priority === "optional",
  );

  return (
    <div className="mt-4 space-y-5 border-t border-[var(--sg-color-border)] pt-4">
      {step.goal ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Objective
          </p>
          <p className="mt-1 text-sm text-[var(--sg-color-text)]">
            {step.goal}
          </p>
        </div>
      ) : null}

      {step.activities.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            In this step
          </p>
          <ul className="mt-2 space-y-1.5">
            {step.activities.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-sm text-[var(--sg-color-text)]"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {step.useCases.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Use cases
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {step.useCases.map((link) => (
              <li key={link.id}>
                <LinkChip link={link} />
              </li>
            ))}
          </ul>
          {step.useCases.some((u) => u.href) ? (
            <p className="mt-2">
              <Link
                href={step.useCases.find((u) => u.href)!.href!}
                className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Explore use case →
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      {step.capabilities.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Capabilities
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {step.capabilities.map((link) => (
              <li key={link.id}>
                <LinkChip link={link} />
              </li>
            ))}
          </ul>
          {step.capabilities.some((c) => c.href) ? (
            <p className="mt-2">
              <Link
                href={step.capabilities.find((c) => c.href)!.href!}
                className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Explore capability →
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      {step.requirements.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Requirements
          </p>
          <div className="mt-2 space-y-3">
            {must.length > 0 ? (
              <div>
                <p className="text-xs font-medium text-[var(--sg-color-text-muted)]">
                  Must have
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-2">
                  {must.map((link) => (
                    <li key={link.id}>
                      <LinkChip link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {important.length > 0 ? (
              <div>
                <p className="text-xs font-medium text-[var(--sg-color-text-muted)]">
                  Important
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-2">
                  {important.map((link) => (
                    <li key={link.id}>
                      <LinkChip link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {optional.length > 0 ? (
              <div>
                <p className="text-xs font-medium text-[var(--sg-color-text-muted)]">
                  Optional
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-2">
                  {optional.map((link) => (
                    <li key={link.id}>
                      <LinkChip link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {step.features.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Features
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {step.features.map((link) => (
              <li key={link.id}>
                <LinkChip link={link} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {step.mediaCues.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            See product examples
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {step.mediaCues.map((cue) => (
              <li key={cue.mediaId}>
                <button
                  type="button"
                  onClick={() => onOpenMedia(cue)}
                  className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-1.5 text-sm font-medium text-[var(--sg-color-primary)] hover:border-[var(--sg-color-primary)]"
                >
                  ▶ {cue.ctaLabel}
                  {cue.contextLabel ? (
                    <span className="ml-2 text-[10px] font-normal text-[var(--sg-color-text-muted)]">
                      ({cue.contextLabel})
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {productsHref ? (
          <Link
            href={productsHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            See products →
          </Link>
        ) : null}
        {evidenceHref ? (
          <Link
            href={evidenceHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            See evidence →
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Category-agnostic expandable workflow experience.
 * Vertical stepper everywhere; optional horizontal overview on wide screens.
 * No category-specific terminology hardcoded.
 */
export function WorkflowExperience({
  model,
  sectionId = "workflow",
  className,
}: {
  model: WorkflowExperienceModel;
  sectionId?: string;
  className?: string;
}) {
  const baseId = useId();
  const [expandedId, setExpandedId] = useState<string | null>(
    model.steps[0]?.id ?? null,
  );
  const [overlayProduct, setOverlayProduct] = useState<string>("");
  const [compareA, setCompareA] = useState<string>("");
  const [compareB, setCompareB] = useState<string>("");
  const [activeCue, setActiveCue] = useState<WorkflowStepMediaCue | null>(null);

  const productOptions = model.products;
  const showOverlay = Boolean(overlayProduct);
  const comparing =
    Boolean(compareA) &&
    Boolean(compareB) &&
    compareA !== compareB &&
    productOptions.some((p) => p.slug === compareA) &&
    productOptions.some((p) => p.slug === compareB);

  const overlayName = useMemo(
    () => productOptions.find((p) => p.slug === overlayProduct)?.name ?? "",
    [overlayProduct, productOptions],
  );

  if (model.steps.length === 0 && !model.visual) return null;

  return (
    <section
      id={sectionId}
      aria-labelledby={`${sectionId}-heading`}
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id={`${sectionId}-heading`}
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {model.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        {model.supporting}
      </p>

      {model.visual ? (
        <figure className="mt-5 overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
          <Image
            src={model.visual.src}
            alt={model.visual.alt}
            width={1280}
            height={853}
            className="h-auto w-full object-contain"
            sizes="(min-width: 1024px) 48rem, 100vw"
            loading="lazy"
            // Teaching diagrams: skip AVIF/WebP re-encode when already compact WebP/PNG.
            unoptimized
          />
          {model.visual.caption ? (
            <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
              {model.visual.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {model.steps.length > 0 ? (
        <>
          <nav aria-label="Workflow overview" className="mt-6 hidden lg:block">
            <ol className="flex flex-wrap items-center gap-2">
              {model.steps.map((step, index) => (
                <li key={step.id} className="flex items-center gap-2">
                  {index > 0 ? <span className="sr-only">then</span> : null}
                  {index > 0 ? (
                    <span
                      aria-hidden
                      className="text-[var(--sg-color-text-muted)]"
                    >
                      →
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setExpandedId(step.id)}
                    className={cn(
                      "rounded-[var(--sg-radius-md)] border px-3 py-2 text-left text-sm transition-colors",
                      expandedId === step.id
                        ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                        : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] hover:border-[var(--sg-color-primary)]",
                    )}
                    aria-controls={`${baseId}-panel-${step.id}`}
                    aria-expanded={expandedId === step.id}
                  >
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                      {padIndex(index)}
                    </span>
                    <span className="font-semibold text-[var(--sg-color-text)]">
                      {step.label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {productOptions.length > 0 ? (
            <Card className="mt-5 space-y-4 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Show product implementation
                  </span>
                  <select
                    className="mt-1 block w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm"
                    value={overlayProduct}
                    onChange={(e) => setOverlayProduct(e.target.value)}
                  >
                    <option value="">None</option>
                    {productOptions.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-sm">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                      Compare A
                    </span>
                    <select
                      className="mt-1 block w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm"
                      value={compareA}
                      onChange={(e) => setCompareA(e.target.value)}
                    >
                      <option value="">—</option>
                      {productOptions.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                      Compare B
                    </span>
                    <select
                      className="mt-1 block w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm"
                      value={compareB}
                      onChange={(e) => setCompareB(e.target.value)}
                    >
                      <option value="">—</option>
                      {productOptions.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <p className="text-xs text-[var(--sg-color-text-muted)]">
                Support labels come from structured feature research — not from
                videos.
              </p>
            </Card>
          ) : null}

          <ol className="mt-6 space-y-3">
            {model.steps.map((step, index) => {
              const expanded = expandedId === step.id;
              const panelId = `${baseId}-panel-${step.id}`;
              const buttonId = `${baseId}-btn-${step.id}`;
              const overlayStatus = overlayProduct
                ? (step.productSupport[overlayProduct] ?? "unknown")
                : null;

              return (
                <li key={step.id}>
                  {index > 0 ? <p className="sr-only">Next step</p> : null}
                  <Card className="overflow-hidden p-0">
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setExpandedId(expanded ? null : step.id)}
                      className="flex w-full items-start gap-3 p-4 text-left hover:bg-[var(--sg-color-surface-muted)]/60"
                    >
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary-soft)] text-xs font-semibold text-[var(--sg-color-primary)]">
                        {padIndex(index)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--sg-color-text)]">
                            {step.label}
                          </h3>
                          {showOverlay && overlayStatus ? (
                            <span className="inline-flex items-center gap-1 text-xs text-[var(--sg-color-text-muted)]">
                              <SupportGlyph status={overlayStatus} />
                              <span>
                                {overlayName}: {supportLabel(overlayStatus)}
                              </span>
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                          {step.detail}
                        </p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "mt-1 size-5 shrink-0 text-[var(--sg-color-text-muted)] transition-transform",
                          expanded && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!expanded}
                      className={cn("px-4 pb-4", !expanded && "hidden")}
                    >
                      {expanded ? (
                        <StepExpandedBody
                          step={step}
                          productsHref={model.productsHref}
                          evidenceHref={model.evidenceHref}
                          onOpenMedia={setActiveCue}
                        />
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>

          {comparing ? (
            <div className="mt-8 overflow-x-auto">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
                Workflow step comparison
              </h3>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Structured research support by step — not demo production
                quality.
              </p>
              <table className="mt-4 w-full min-w-[28rem] border-collapse text-sm">
                <caption className="sr-only">
                  Product support by workflow step
                </caption>
                <thead>
                  <tr className="border-b border-[var(--sg-color-border)] text-left">
                    <th className="py-2 pr-3 font-semibold">Step</th>
                    <th className="py-2 px-3 font-semibold">
                      {productOptions.find((p) => p.slug === compareA)?.name}
                    </th>
                    <th className="py-2 pl-3 font-semibold">
                      {productOptions.find((p) => p.slug === compareB)?.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {model.steps.map((step) => {
                    const a = step.productSupport[compareA] ?? "unknown";
                    const b = step.productSupport[compareB] ?? "unknown";
                    return (
                      <tr
                        key={step.id}
                        className="border-b border-[var(--sg-color-border)]"
                      >
                        <th
                          scope="row"
                          className="py-2 pr-3 text-left font-medium"
                        >
                          {step.label}
                        </th>
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-2">
                            <SupportGlyph status={a} />
                            {supportLabel(a)}
                          </span>
                        </td>
                        <td className="py-2 pl-3">
                          <span className="inline-flex items-center gap-2">
                            <SupportGlyph status={b} />
                            {supportLabel(b)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}

          {model.productsHref ? (
            <p className="mt-6 text-sm">
              <Link
                href={model.productsHref}
                className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                See how products implement this workflow ↓
              </Link>
            </p>
          ) : null}
        </>
      ) : null}

      <MediaDrawer
        cue={activeCue}
        open={Boolean(activeCue)}
        onClose={() => setActiveCue(null)}
      />
    </section>
  );
}
