"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import type { IndustryCapabilityProductRow } from "@/services/industry-capability";
import { cn } from "@/lib/cn";

function fitBadgeVariant(
  label: IndustryCapabilityProductRow["fitLabel"],
): "success" | "primary" | "warning" | "neutral" {
  if (label === "Strong") return "success";
  if (label === "Good") return "primary";
  if (label === "Limited") return "warning";
  return "neutral";
}

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  capabilityName: string;
  row: IndustryCapabilityProductRow;
  requirementLabels: string[];
  featureLabels: string[];
  /** Optional requirement-level evidence for this product. */
  requirementEvidenceRows?: Array<{
    requirementName: string;
    documentationCount: number;
    screenshotCount: number;
    officialVideoCount: number;
    videoTitles: string[];
  }>;
};

export function CapabilityAssessmentDrawer({
  open,
  onClose,
  capabilityName,
  row,
  requirementLabels,
  featureLabels,
  requirementEvidenceRows = [],
}: DrawerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cap-assessment-drawer-title"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-[var(--sg-color-surface)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--sg-color-border)] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Capability assessment
            </p>
            <h2
              id="cap-assessment-drawer-title"
              className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold"
            >
              Why is {row.name} rated {row.fitLabel} for {capabilityName}?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--sg-radius-md)] p-2 text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)]"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div className="flex items-center gap-3">
            <ProductLogo name={row.name} logo={row.logo} size="md" />
            <Badge variant={fitBadgeVariant(row.fitLabel)}>
              {row.fitLabel}
              {row.fitScore != null ? ` · ${row.fitScore}/10` : ""}
            </Badge>
          </div>

          {row.fitRationale ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              {row.fitRationale}
            </p>
          ) : null}

          {requirementLabels.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Requirements
              </p>
              <ul className="mt-2 space-y-1.5">
                {requirementLabels.map((label) => (
                  <li key={label} className="flex gap-2 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                      aria-hidden
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {featureLabels.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Features
              </p>
              <ul className="mt-2 space-y-1.5">
                {featureLabels.map((label) => (
                  <li key={label} className="flex gap-2 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                      aria-hidden
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Evidence
            </p>
            <ul className="mt-2 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
              <li>Documentation / feature research: {row.evidenceCount}</li>
              <li>Screenshots: {row.screenshotCount}</li>
              <li>Official videos: {row.officialVideoCount}</li>
            </ul>
            <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
              Media quantity does not change the capability assessment score.
            </p>
          </div>

          {requirementEvidenceRows.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Evidence by requirement
              </p>
              <ul className="mt-3 space-y-3">
                {requirementEvidenceRows.map((req) => (
                  <li
                    key={req.requirementName}
                    className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 text-sm"
                  >
                    <p className="font-medium">{req.requirementName}</p>
                    <p className="mt-1 text-[var(--sg-color-text-muted)]">
                      Documentation {req.documentationCount} ·{" "}
                      {req.screenshotCount} screenshots ·{" "}
                      {req.officialVideoCount} official video
                      {req.officialVideoCount === 1 ? "" : "s"}
                    </p>
                    {req.videoTitles[0] ? (
                      <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                        ▶ {req.videoTitles[0]}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
              <a
                href="#requirement-evidence"
                className="mt-3 inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                View requirement evidence →
              </a>
            </div>
          ) : null}

          {row.deepDiveVideo ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Official video
              </p>
              <p className="mt-1 text-sm font-medium">{row.deepDiveVideo.title}</p>
              <div className="mt-3">
                <OfficialProductVideo
                  media={row.deepDiveVideo}
                  vendorName={row.name}
                  variant="compact"
                  priority="low"
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <ButtonLink href={row.reviewHref} size="sm">
              Read review
            </ButtonLink>
            <ButtonLink href="#capability-evidence" variant="outline" size="sm">
              View evidence
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CapabilityDeepDives({
  capabilityName,
  items,
  className,
}: {
  capabilityName: string;
  items: IndustryCapabilityProductRow[];
  className?: string;
}) {
  const withVideo = items.filter((i) => i.deepDiveVideo);
  if (withVideo.length === 0) return null;

  return (
    <section
      id="deep-dives"
      aria-labelledby="cap-deep-dives-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="cap-deep-dives-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How products handle {capabilityName.toLowerCase()}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        One best official workflow demonstration per product when available —
        not a gallery of every video.
      </p>
      <ul className="mt-6 grid gap-5">
        {withVideo.slice(0, 3).map((item) => (
          <li key={item.slug}>
            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ProductLogo name={item.name} logo={item.logo} size="md" />
                  <div>
                    <h3 className="font-semibold">
                      How {item.name} handles {capabilityName.toLowerCase()}
                    </h3>
                    <Badge
                      variant={fitBadgeVariant(item.fitLabel)}
                      className="mt-2"
                    >
                      {item.fitLabel}
                    </Badge>
                  </div>
                </div>
                <Link
                  href={item.reviewHref}
                  className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Read review →
                </Link>
              </div>
              {item.fitRationale ? (
                <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                  {item.fitRationale}
                </p>
              ) : null}
              {item.strengths.length > 0 ? (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Key strengths
                  </p>
                  <ul className="mt-2 space-y-1">
                    {item.strengths.map((s) => (
                      <li key={s} className="flex gap-2 text-sm">
                        <Check
                          className="mt-0.5 size-4 text-[var(--sg-color-success)]"
                          aria-hidden
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {item.limitations.length > 0 ? (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Limitations
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                    {item.limitations.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {item.deepDiveVideo ? (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    See it in action
                  </p>
                  <div className="mt-3">
                    <OfficialProductVideo
                      media={item.deepDiveVideo}
                      vendorName={item.name}
                      variant="compact"
                      priority="low"
                    />
                  </div>
                </div>
              ) : null}
              <div className="mt-4">
                <ButtonLink
                  href="#capability-evidence"
                  variant="outline"
                  size="sm"
                >
                  View evidence
                </ButtonLink>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CapabilityFitWhyButton({
  capabilityName,
  row,
  requirementLabels,
  featureLabels,
  requirementEvidenceRows,
}: {
  capabilityName: string;
  row: IndustryCapabilityProductRow;
  requirementLabels: string[];
  featureLabels: string[];
  requirementEvidenceRows?: DrawerProps["requirementEvidenceRows"];
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Why?
      </Button>
      <CapabilityAssessmentDrawer
        open={open}
        onClose={() => setOpen(false)}
        capabilityName={capabilityName}
        row={row}
        requirementLabels={requirementLabels}
        featureLabels={featureLabels}
        requirementEvidenceRows={requirementEvidenceRows}
      />
    </>
  );
}
