"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";
import {
  buildPairAnalysis,
  type UseCaseWorkflowProductCompareModel,
  type WorkflowCompareMedia,
  type WorkflowCompareProduct,
} from "@/services/use-case-workflow-comparison/pair-client";
import type { WorkflowSupportStatus } from "@/services/workflow-experience/types";

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

function MediaPanel({
  product,
  media,
}: {
  product: WorkflowCompareProduct;
  media: WorkflowCompareMedia | null;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <ProductLogo name={product.name} logo={product.logo} size="sm" />
          <p className="font-semibold text-[var(--sg-color-text)]">
            {product.name}
          </p>
        </div>

        {media?.kind === "official-video" ? (
          <OfficialProductVideo
            media={media.media}
            vendorName={product.name}
            variant="compact"
            showDetails={false}
            priority="low"
          />
        ) : media?.kind === "screenshot" ? (
          <div>
            <Badge variant="neutral" className="mb-2">
              Screenshot evidence
            </Badge>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.src}
              alt={media.alt}
              className="aspect-video w-full rounded-[var(--sg-radius-md)] object-contain bg-[var(--sg-color-surface-muted)]"
              loading="lazy"
            />
            <p className="mt-2 text-sm font-medium">{media.title}</p>
          </div>
        ) : (
          <div className="rounded-[var(--sg-radius-md)] border border-dashed border-[var(--sg-color-border)] px-4 py-8 text-center text-sm text-[var(--sg-color-text-muted)]">
            No qualifying demo or screenshot for this workflow yet. Support
            status below still comes from structured recommendations.
          </div>
        )}

        {media ? (
          <>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                What to notice
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                {media.whatToNotice.slice(0, 4).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            {media.notShown.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Not shown in this demo
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                  {media.notShown.slice(0, 4).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {media.sourceUrl ? (
              <ExternalLink
                href={media.sourceUrl}
                type="evidence-source"
                className="text-sm font-medium"
              >
                Open official source
              </ExternalLink>
            ) : null}
          </>
        ) : null}
      </div>
    </Card>
  );
}

/**
 * Interactive “Compare how products handle this workflow” for Use Case Detail.
 * Support matrix and diffs come from structured recommendations — never video inference.
 */
export function UseCaseWorkflowProductCompare({
  model,
  className,
}: {
  model: UseCaseWorkflowProductCompareModel;
  className?: string;
}) {
  const [leftSlug, setLeftSlug] = useState(
    model.defaultLeftSlug ?? model.products[0]?.slug ?? "",
  );
  const [rightSlug, setRightSlug] = useState(
    model.defaultRightSlug ?? model.products[1]?.slug ?? "",
  );

  const analysis = useMemo(() => {
    if (!leftSlug || !rightSlug || leftSlug === rightSlug) return null;
    return buildPairAnalysis(model, leftSlug, rightSlug);
  }, [model, leftSlug, rightSlug]);

  if (model.products.length < 2) return null;

  return (
    <section
      id="compare-workflow"
      aria-labelledby="uc-compare-workflow-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="uc-compare-workflow-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {model.heading}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        {model.supporting}
      </p>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <label className="block text-sm">
          <span className="sr-only">Left product</span>
          <select
            className="min-w-[10rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm font-semibold"
            value={leftSlug}
            onChange={(e) => setLeftSlug(e.target.value)}
            aria-label="First product"
          >
            {model.products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <span className="pb-2 text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          vs
        </span>
        <label className="block text-sm">
          <span className="sr-only">Right product</span>
          <select
            className="min-w-[10rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm font-semibold"
            value={rightSlug}
            onChange={(e) => setRightSlug(e.target.value)}
            aria-label="Second product"
          >
            {model.products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!analysis ? (
        <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
          Select two different products to compare.
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <MediaPanel product={analysis.left} media={analysis.left.media} />
            <MediaPanel product={analysis.right} media={analysis.right.media} />
          </div>

          <div className="mt-8 overflow-x-auto">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Workflow matrix
            </h3>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Canonical feature assessments for this workflow — not inferred from
              demos.
            </p>
            <table className="mt-4 w-full min-w-[28rem] border-collapse text-sm">
              <caption className="sr-only">
                {analysis.left.name} vs {analysis.right.name} workflow support
              </caption>
              <thead>
                <tr className="border-b border-[var(--sg-color-border)] text-left">
                  <th className="py-2 pr-3 font-semibold">Step</th>
                  <th className="py-2 px-3 font-semibold">
                    {analysis.left.name}
                  </th>
                  <th className="py-2 pl-3 font-semibold">
                    {analysis.right.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {analysis.matrix.map((row) => (
                  <tr
                    key={row.stepId}
                    className="border-b border-[var(--sg-color-border)]"
                  >
                    <th scope="row" className="py-2 pr-3 text-left font-medium">
                      {row.label}
                    </th>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-2">
                        <SupportGlyph status={row.left} />
                        {supportLabel(row.left)}
                      </span>
                    </td>
                    <td className="py-2 pl-3">
                      <span className="inline-flex items-center gap-2">
                        <SupportGlyph status={row.right} />
                        {supportLabel(row.right)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(analysis.whereLeftDiffers.length > 0 ||
            analysis.whereRightDiffers.length > 0) && (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-base font-semibold">
                  Where {analysis.left.name} differs
                </h3>
                {analysis.whereLeftDiffers.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                    {analysis.whereLeftDiffers.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    No material workflow-step differences from structured
                    research for this pair.
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-base font-semibold">
                  Where {analysis.right.name} differs
                </h3>
                {analysis.whereRightDiffers.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                    {analysis.whereRightDiffers.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    No material workflow-step differences from structured
                    research for this pair.
                  </p>
                )}
              </div>
            </div>
          )}

          {analysis.requirementDiffs.length > 0 ? (
            <div className="mt-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                Requirement differences
              </h3>
              <ul className="mt-4 space-y-4">
                {analysis.requirementDiffs.map((diff) => (
                  <li
                    key={diff.id}
                    className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-4"
                  >
                    <p className="font-medium text-[var(--sg-color-text)]">
                      {diff.label}
                    </p>
                    <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-[var(--sg-color-text-muted)]">
                          {analysis.left.name}
                        </dt>
                        <dd className="mt-0.5 text-[var(--sg-color-text)]">
                          {diff.leftDetail}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[var(--sg-color-text-muted)]">
                          {analysis.right.name}
                        </dt>
                        <dd className="mt-0.5 text-[var(--sg-color-text)]">
                          {diff.rightDetail}
                        </dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {analysis.planDiffs.length > 0 ? (
            <div className="mt-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                Plan differences
              </h3>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                From verified featureSupport plan packaging — not demo claims.
              </p>
              <ul className="mt-4 space-y-3">
                {analysis.planDiffs.map((diff) => (
                  <li
                    key={diff.id}
                    className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-4 text-sm"
                  >
                    <p className="font-medium">{diff.label}</p>
                    <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-[var(--sg-color-text-muted)]">
                          {analysis.left.name}
                        </dt>
                        <dd>{diff.left ?? "Not evidenced"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[var(--sg-color-text-muted)]">
                          {analysis.right.name}
                        </dt>
                        <dd>{diff.right ?? "Not evidenced"}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-8">
            <Link
              href={analysis.compareHref}
              className="inline-flex rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Compare {analysis.left.name} vs {analysis.right.name}
            </Link>
          </p>
        </>
      )}
    </section>
  );
}
