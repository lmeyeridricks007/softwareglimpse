"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { ResearchAssessmentCell } from "./research-cell";
import type { CriterionCellResult } from "@/services/vendor-scorecard";
import { RESEARCH_LABEL_DISPLAY } from "@/services/vendor-scorecard";

export function EvidenceWhyDrawer({
  open,
  onClose,
  productName,
  cell,
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
  cell: CriterionCellResult | null;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!open) return;

    scrollYRef.current = window.scrollY;
    closeRef.current?.focus({ preventScroll: true });

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    // Some browsers still jump on dialog focus; pin scroll while open.
    const pinScroll = () => {
      if (window.scrollY !== scrollYRef.current) {
        window.scrollTo(0, scrollYRef.current);
      }
    };
    pinScroll();
    window.addEventListener("scroll", pinScroll, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", pinScroll);
      body.style.overflow = previousOverflow;
      window.scrollTo(0, scrollYRef.current);
    };
  }, [open, onClose]);

  if (!open || !cell) return null;

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
              SoftwareGlimpse recommendations
            </p>
            <h2
              id={titleId}
              className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
            >
              {cell.label}
            </h2>
            <p className="text-sm text-[var(--sg-color-text-muted)]">{productName}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)] text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)]"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Assessment
            </p>
            <div className="mt-2">
              <ResearchAssessmentCell
                qualitative={cell.qualitative}
                numericScore={cell.numericScore}
              />
            </div>
          </div>
          {cell.rationale ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Why
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text)]">
                {cell.rationale}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              No approved rationale is available for this criterion yet. This is
              treated as unknown — not as unsupported.
            </p>
          )}
          {cell.confidence ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Evidence confidence
              </p>
              <p className="mt-1 text-sm capitalize text-[var(--sg-color-text)]">
                {cell.confidence}
              </p>
            </div>
          ) : null}
          {cell.supportingFactIds.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Evidence
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text)]">
                {cell.supportingFactIds.length} supporting fact
                {cell.supportingFactIds.length === 1 ? "" : "s"} referenced
              </p>
            </div>
          ) : null}
          <p className="text-xs text-[var(--sg-color-text-muted)]">
            Label shown: {RESEARCH_LABEL_DISPLAY[cell.qualitative]}. Affiliate
            relationships never influence this assessment.
          </p>
        </div>
      </aside>
    </div>
  );
}
