"use client";

import { useEffect, useId, useRef } from "react";
import { Check, X } from "lucide-react";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { Badge } from "@/components/ui/badge";
import type {
  FeatureDimensionCell,
  FeatureSupportStatus,
} from "@/services/feature-detail/types";
import { mediaWhatThisShows } from "@/domain";

function assessmentLabel(
  status: FeatureDimensionCell["status"],
  display: string,
): string {
  if (status === "text") return display;
  switch (status as FeatureSupportStatus) {
    case "supported":
      return "Supported";
    case "partially-supported":
      return "Partially supported";
    case "plan-dependent":
      return "Plan dependent";
    case "limited":
      return "Limited";
    case "not-supported":
      return "Not supported";
    default:
      return display || "Not verified";
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
  featureName: string;
  dimensionName: string;
  productName: string;
  cell: FeatureDimensionCell;
};

/**
 * Matrix cell evidence drawer — docs, screenshots, official videos.
 * Players live here only (never inside the comparison matrix table).
 */
export function FeatureMatrixEvidenceDrawer({
  open,
  onClose,
  featureName,
  dimensionName,
  productName,
  cell,
}: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const evidence = cell.evidence;

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

  if (!open) return null;

  const docs = evidence?.documentation ?? [];
  const shots = evidence?.screenshots ?? [];
  const videos = evidence?.videos ?? [];
  const hasAny =
    docs.length > 0 ||
    shots.length > 0 ||
    videos.length > 0 ||
    Boolean(cell.evidenceNote);

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
              {dimensionName}
            </p>
            <h2
              id={titleId}
              className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]"
            >
              {productName}
            </h2>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {featureName} · Assessment:{" "}
              <span className="font-medium text-[var(--sg-color-text)]">
                {assessmentLabel(cell.status, cell.display)}
              </span>
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-[var(--sg-radius-md)] p-2 text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]"
            aria-label="Close evidence drawer"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          <p className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] p-3 text-sm text-[var(--sg-color-text-muted)]">
            Evidence below supports this matrix cell. Official videos illustrate
            implementation and do{" "}
            <span className="font-medium text-[var(--sg-color-text)]">
              not alone determine
            </span>{" "}
            the SoftwareGlimpse assessment.
          </p>

          {!hasAny ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              No linked documentation, screenshot, or official video is recorded
              for this dimension yet. Status comes from feature
              support.
            </p>
          ) : null}

          {cell.evidenceNote ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Coverage note
              </p>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {cell.evidenceNote}
              </p>
            </div>
          ) : null}

          {docs.length > 0 ? (
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Official documentation
                </p>
                <Badge variant="neutral">{docs.length}</Badge>
              </div>
              <ul className="mt-3 space-y-2">
                {docs.map((d) => (
                  <li
                    key={d.url}
                    className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
                  >
                    <p className="text-sm font-medium">{d.title}</p>
                    {d.kindLabel ? (
                      <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                        {d.kindLabel}
                      </p>
                    ) : null}
                    <ExternalLink
                      href={d.url}
                      type="documentation"
                      className="mt-2 inline-flex text-sm font-medium"
                    >
                      Open documentation ↗
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {shots.length > 0 ? (
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Screenshots
                </p>
                <Badge variant="neutral">{shots.length}</Badge>
              </div>
              <ul className="mt-3 space-y-3">
                {shots.map((s) => (
                  <li
                    key={s.id}
                    className="overflow-hidden rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.src}
                      alt={s.alt}
                      className="aspect-video w-full object-contain bg-[var(--sg-color-surface-muted)]"
                      loading="lazy"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium">
                        {s.caption || s.alt}
                      </p>
                      {s.source ? (
                        <ExternalLink
                          href={s.source}
                          type="evidence-source"
                          className="mt-2 inline-flex text-sm font-medium"
                        >
                          Open source ↗
                        </ExternalLink>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {videos.length > 0 ? (
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Official videos
                </p>
                <Badge variant="neutral">{videos.length}</Badge>
              </div>
              <ul className="mt-3 space-y-4">
                {videos.map((v) => {
                  const shows = mediaWhatThisShows(v);
                  return (
                    <li
                      key={v.id}
                      className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
                    >
                      <p className="text-sm font-medium text-[var(--sg-color-text)]">
                        ▶ {v.title}
                      </p>
                      {shows.length > 0 ? (
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                            What the video demonstrates
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {shows.map((line) => (
                              <li
                                key={line}
                                className="flex items-start gap-2 text-sm"
                              >
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
                      <div className="mt-3">
                        <OfficialProductVideo
                          media={v}
                          vendorName={productName}
                          variant="compact"
                          priority="low"
                        />
                      </div>
                      <ExternalLink
                        href={v.sourceUrl}
                        type="evidence-source"
                        className="mt-3 inline-flex text-sm font-medium"
                      >
                        Open official source ↗
                      </ExternalLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
