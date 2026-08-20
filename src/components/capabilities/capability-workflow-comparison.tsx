"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";
import type {
  CapabilityWorkflowComparisonModel,
  WorkflowComparisonMedia,
  WorkflowStepEvidenceStatus,
} from "@/services/capability-workflow-comparison";

function statusLabel(status: WorkflowStepEvidenceStatus): string {
  switch (status) {
    case "visible":
      return "Visible";
    case "partial":
      return "Partial";
    case "screenshot":
      return "Screenshot";
    default:
      return "Not shown";
  }
}

function MediaCell({
  media,
  productName,
}: {
  media: WorkflowComparisonMedia;
  productName: string;
}) {
  const [playOpen, setPlayOpen] = useState(false);

  if (media.kind === "none") {
    return (
      <p className="text-xs text-[var(--sg-color-text-muted)]">No visual evidence</p>
    );
  }

  if (media.kind === "screenshot") {
    return (
      <div className="space-y-2">
        <Badge variant="neutral">Screenshot</Badge>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt={media.alt}
          className="aspect-video w-full rounded-[var(--sg-radius-md)] object-contain bg-[var(--sg-color-surface-muted)]"
          loading="lazy"
        />
        {media.caption ? (
          <p className="text-xs text-[var(--sg-color-text-muted)]">{media.caption}</p>
        ) : null}
        {media.sourceUrl ? (
          <ExternalLink
            href={media.sourceUrl}
            type="evidence-source"
            className="text-xs font-medium"
          >
            Source
          </ExternalLink>
        ) : null}
      </div>
    );
  }

  // video
  return (
    <div className="space-y-2">
      <Badge variant="success">Official video</Badge>
      {playOpen ? (
        <OfficialProductVideo
          media={media.media}
          vendorName={productName}
          variant="compact"
          showDetails={false}
          priority="low"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlayOpen(true)}
          className="relative block w-full overflow-hidden rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sg-color-primary)]"
          aria-label={`Play ${media.title}`}
        >
          {media.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.thumbnailUrl}
              alt=""
              className="aspect-video w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="aspect-video w-full bg-[var(--sg-color-surface-muted)]" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-sm font-semibold text-white">
            ▶ Play
          </span>
        </button>
      )}
      <p className="text-xs font-medium text-[var(--sg-color-text)]">{media.title}</p>
      <ExternalLink
        href={media.sourceUrl}
        type="evidence-source"
        className="text-xs font-medium"
      >
        Open source ↗
      </ExternalLink>
    </div>
  );
}

/**
 * Comparative workflow demonstration matrix for Capability Detail pages.
 * Evidence-backed decision support — not a video entertainment module.
 */
export function CapabilityWorkflowComparison({
  model,
  className,
}: {
  model: CapabilityWorkflowComparisonModel;
  className?: string;
}) {
  if (model.products.length === 0) return null;

  const colCount = model.products.length;

  return (
    <section
      id="approach-differences"
      aria-labelledby="cap-workflow-comparison-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="cap-workflow-comparison-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {model.heading}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        {model.supporting}
      </p>

      {/* Desktop / tablet matrix */}
      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--sg-color-border)]">
              <th className="px-3 py-3 text-left font-semibold text-[var(--sg-color-text-muted)]">
                Workflow
              </th>
              {model.products.map((p) => (
                <th key={p.productSlug} className="px-3 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <ProductLogo name={p.productName} logo={p.logo} size="sm" />
                    <div>
                      <p className="font-semibold">{p.productName}</p>
                      {p.fitLabel ? (
                        <p className="text-xs text-[var(--sg-color-text-muted)]">
                          Assessment: {p.fitLabel}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--sg-color-border)] align-top">
              <td className="px-3 py-4 font-medium text-[var(--sg-color-text-muted)]">
                Pipeline UI / demo
              </td>
              {model.products.map((p) => (
                <td key={`media-${p.productSlug}`} className="px-3 py-4">
                  <MediaCell media={p.media} productName={p.productName} />
                </td>
              ))}
            </tr>
            {model.steps.map((step) => (
              <tr
                key={step.id}
                className="border-b border-[var(--sg-color-border)] align-top"
              >
                <td className="px-3 py-3">
                  <p className="font-medium">{step.label}</p>
                  {step.detail ? (
                    <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                      {step.detail}
                    </p>
                  ) : null}
                </td>
                {model.products.map((p) => {
                  const cell = p.stepCells.find((c) => c.stepId === step.id);
                  return (
                    <td key={`${step.id}-${p.productSlug}`} className="px-3 py-3">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          cell?.status === "visible" &&
                            "text-[var(--sg-color-success)]",
                          cell?.status === "not-shown" &&
                            "text-[var(--sg-color-text-muted)]",
                        )}
                      >
                        {statusLabel(cell?.status ?? "not-shown")}
                      </span>
                      {cell?.note ? (
                        <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                          {cell.note}
                        </p>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked product cards */}
      <ul className="mt-6 grid gap-5 md:hidden">
        {model.products.map((p) => (
          <li key={`m-${p.productSlug}`}>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <ProductLogo name={p.productName} logo={p.logo} size="sm" />
                <p className="font-semibold">{p.productName}</p>
              </div>
              <div className="mt-4">
                <MediaCell media={p.media} productName={p.productName} />
              </div>
              <ul className="mt-4 space-y-2">
                {model.steps.map((step) => {
                  const cell = p.stepCells.find((c) => c.stepId === step.id);
                  return (
                    <li
                      key={step.id}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <span className="text-[var(--sg-color-text-muted)]">
                        {step.label}
                      </span>
                      <span className="font-medium">
                        {statusLabel(cell?.status ?? "not-shown")}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {p.emphasizes.length > 0 ? (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    {p.productName} emphasizes
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text)]">
                    {p.emphasizes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>

      {/* Emphases (desktop) */}
      {colCount >= 1 ? (
        <div
          className={cn(
            "mt-6 hidden gap-4 md:grid",
            colCount >= 2 ? "md:grid-cols-2" : "md:grid-cols-1",
          )}
        >
          {model.products.map((p) =>
            p.emphasizes.length > 0 ? (
              <Card key={`emph-${p.productSlug}`} className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  {p.productName} emphasizes
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {p.emphasizes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </Card>
            ) : null,
          )}
        </div>
      ) : null}

      {model.interpretation ? (
        <Card className="mt-5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            SoftwareGlimpse take
          </p>
          <p className="mt-2 text-sm text-[var(--sg-color-text)]">
            {model.interpretation}
          </p>
        </Card>
      ) : null}

      {model.deepLinks.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {model.deepLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={model.evidenceHref}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              View all capability evidence →
            </a>
          </li>
        </ul>
      ) : (
        <p className="mt-5 text-sm">
          <a
            href={model.evidenceHref}
            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all capability evidence →
          </a>
        </p>
      )}
    </section>
  );
}
