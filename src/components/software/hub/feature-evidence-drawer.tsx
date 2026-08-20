"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import type { ProductMedia, ProductScreenshot } from "@/domain";
import { ExternalLink } from "@/components/outbound/external-link";
import { providerWatchLabel } from "@/services/product-media";

export type FeatureEvidenceItem = {
  kind: "documentation" | "video" | "screenshot";
  title: string;
  href?: string;
  detail?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  featureName: string;
  productName: string;
  assessmentLabel: string;
  videos: ProductMedia[];
  screenshots: ProductScreenshot[];
  docSources: Array<{ title: string; url: string; kindLabel?: string | null }>;
};

/**
 * Feature evidence drawer — documentation, official video, screenshots.
 * Video alone does not determine the assessment.
 */
export function FeatureEvidenceDrawer({
  open,
  onClose,
  featureName,
  productName,
  assessmentLabel,
  videos,
  screenshots,
  docSources,
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

  if (!open) return null;

  const items: FeatureEvidenceItem[] = [
    ...docSources.map((d) => ({
      kind: "documentation" as const,
      title: d.title,
      href: d.url,
      detail: d.kindLabel ?? "Official documentation",
    })),
    ...videos.map((v) => ({
      kind: "video" as const,
      title: v.title,
      href: v.sourceUrl,
      detail: `Official video · ${providerWatchLabel(v.provider)}`,
    })),
    ...screenshots.map((s) => ({
      kind: "screenshot" as const,
      title: s.caption || s.alt,
      href: s.source,
      detail: "Verified product UI capture",
    })),
  ];

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
        className="flex h-full w-full max-w-md flex-col bg-[var(--sg-color-surface)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[var(--sg-color-border)] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              Feature evidence
            </p>
            <h2
              id={titleId}
              className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]"
            >
              {featureName}
            </h2>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {productName} · SoftwareGlimpse assessment: {assessmentLabel}
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

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <p className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] p-3 text-sm text-[var(--sg-color-text-muted)]">
            Official videos and screenshots help illustrate how {productName}{" "}
            presents this capability. They do{" "}
            <span className="font-medium text-[var(--sg-color-text)]">
              not alone determine
            </span>{" "}
            the SoftwareGlimpse assessment.
          </p>

          {items.length === 0 ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              No linked documentation, video, or screenshot evidence is recorded
              for this feature yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={`${item.kind}-${item.title}`}
                  className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    {item.kind === "documentation"
                      ? "Official documentation"
                      : item.kind === "video"
                        ? "Official video"
                        : "Screenshot"}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--sg-color-text)]">
                    {item.title}
                  </p>
                  {item.detail ? (
                    <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                      {item.detail}
                    </p>
                  ) : null}
                  {item.href ? (
                    <ExternalLink
                      href={item.href}
                      type={
                        item.kind === "documentation"
                          ? "documentation"
                          : "vendor-official"
                      }
                      className="mt-2 inline-flex text-sm font-medium text-[var(--sg-color-primary)]"
                    >
                      Open source ↗
                    </ExternalLink>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
