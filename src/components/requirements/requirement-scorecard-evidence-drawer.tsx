"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { Badge } from "@/components/ui/badge";
import type { RequirementCriterionCellEvidence } from "@/services/requirement-detail/scorecard-keys";
import {
  fitStatusLabel,
  type RequirementFeatureCellStatus,
} from "@/services/requirement-detail/labels";

function featureStatusLabel(status: RequirementFeatureCellStatus): string {
  switch (status) {
    case "supported":
      return "Supported";
    case "partially-supported":
      return "Partial";
    case "plan-dependent":
      return "Plan-dependent";
    case "limited":
      return "Limited";
    case "not-supported":
      return "Not supported";
    default:
      return "Not evidenced";
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
  cell: RequirementCriterionCellEvidence | null;
};

/**
 * Scorecard cell Why? drawer — criterion-scoped docs, screenshots, videos.
 * Videos only appear when mapped to this criterion (never unrelated product demos).
 */
export function RequirementScorecardEvidenceDrawer({
  open,
  onClose,
  cell,
}: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !cell) return null;

  const hasEvidence =
    cell.documentation.length > 0 ||
    cell.screenshots.length > 0 ||
    cell.videos.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30"
      role="presentation"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full max-w-lg flex-col bg-[var(--sg-color-surface)] shadow-xl sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[var(--sg-color-border)] px-5 py-4">
          <div className="min-w-0 pr-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              {cell.criterionName}
            </p>
            <h2
              id={titleId}
              className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold"
            >
              {cell.productName}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-[var(--sg-radius-md)] p-2 text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)]"
            aria-label="Close evidence drawer"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          <p className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] p-3 text-sm text-[var(--sg-color-text-muted)]">
            Evidence for this criterion cell only. Official videos illustrate
            visible behavior and do{" "}
            <span className="font-medium text-[var(--sg-color-text)]">
              not alone determine
            </span>{" "}
            the assessment.
          </p>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Assessment
            </p>
            <p className="mt-2 text-sm font-semibold">
              {fitStatusLabel(cell.assessment)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Evidence confidence
            </p>
            <p className="mt-2 text-sm">{cell.confidence}</p>
            <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
              {cell.counts.docs} docs · {cell.counts.screenshots} screenshots ·{" "}
              {cell.counts.videos} video
              {cell.counts.videos === 1 ? "" : "s"}
              <span className="block mt-0.5">
                Counts are informational only.
              </span>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Supporting features
            </p>
            <ul className="mt-2 space-y-2">
              {cell.supportingFeatures.map((f) => (
                <li
                  key={f.slug}
                  className="flex flex-wrap items-center justify-between gap-2 text-sm"
                >
                  {f.href ? (
                    <Link
                      href={f.href}
                      className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {f.name}
                    </Link>
                  ) : (
                    <span className="font-medium">{f.name}</span>
                  )}
                  <Badge variant="neutral">{featureStatusLabel(f.status)}</Badge>
                </li>
              ))}
              {cell.supportingFeatures.length === 0 ? (
                <li className="text-sm text-[var(--sg-color-text-muted)]">
                  No linked features for this criterion.
                </li>
              ) : null}
            </ul>
          </div>

          {cell.assessment === "insufficient-evidence" ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              Insufficient evidence for this criterion — unrelated product videos
              are not shown here.
            </p>
          ) : null}

          {!hasEvidence && cell.assessment !== "insufficient-evidence" ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              No linked documentation, screenshot, or official video is recorded
              for this criterion yet. Status comes from feature
              support.
            </p>
          ) : null}

          {cell.documentation.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Documentation
              </p>
              <ul className="mt-2 space-y-2">
                {cell.documentation.map((doc) => (
                  <li key={doc.id} className="text-sm">
                    <p className="font-medium">{doc.title}</p>
                    {doc.sourceUrl ? (
                      <ExternalLink
                        href={doc.sourceUrl}
                        type="documentation"
                        className="text-xs font-medium"
                      >
                        Open source ↗
                      </ExternalLink>
                    ) : (
                      <p className="text-xs text-[var(--sg-color-text-muted)]">
                        Via {doc.featureName} research sources
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {cell.screenshots.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Screenshots
              </p>
              <ul className="mt-2 space-y-3">
                {cell.screenshots.map((shot) => (
                  <li key={shot.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      className="aspect-video w-full rounded-[var(--sg-radius-md)] object-contain bg-[var(--sg-color-surface-muted)]"
                      loading="lazy"
                    />
                    {shot.caption ? (
                      <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                        {shot.caption}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {cell.videos.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Official videos
              </p>
              <ul className="mt-3 space-y-5">
                {cell.videos.map((video) => (
                  <li key={video.media.id} className="space-y-3">
                    <p className="text-sm font-semibold">{video.title}</p>
                    {video.sourceOrganization ? (
                      <p className="text-xs text-[var(--sg-color-text-muted)]">
                        Source: {video.sourceOrganization}
                      </p>
                    ) : null}
                    <OfficialProductVideo
                      media={video.media}
                      vendorName={cell.productName}
                      variant="compact"
                      priority="low"
                    />
                    {video.demonstrates.length > 0 ? (
                      <ul className="space-y-1">
                        {video.demonstrates.map((line) => (
                          <li key={line} className="flex gap-2 text-sm">
                            <Check
                              className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                              aria-hidden
                            />
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {video.doesNotEstablish.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                          Does not establish
                        </p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-[var(--sg-color-text-muted)]">
                          {video.doesNotEstablish.slice(0, 5).map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {video.media.sourceUrl ? (
                      <ExternalLink
                        href={video.media.sourceUrl}
                        type="evidence-source"
                        className="text-sm font-medium"
                      >
                        Open official source ↗
                      </ExternalLink>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
