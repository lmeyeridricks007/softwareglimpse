"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";
import type {
  CapabilityRequirementEvidenceModel,
  CapabilityRequirementEvidenceRow,
  RequirementEvidenceMediaItem,
  RequirementProductEvidence,
} from "@/services/capability-requirement-evidence";

function supportVariant(
  label: RequirementProductEvidence["supportLabel"],
): "success" | "primary" | "warning" | "neutral" {
  if (label === "Supported" || label === "Strong") return "success";
  if (label === "Partial" || label === "Good") return "primary";
  if (label === "Limited" || label === "Not evidenced") return "warning";
  return "neutral";
}

function EvidenceItemBlock({
  item,
  productName,
}: {
  item: RequirementEvidenceMediaItem;
  productName: string;
}) {
  return (
    <div className="space-y-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={item.kind === "official-video" ? "success" : "neutral"}>
          {item.kind === "official-video"
            ? "Official video"
            : item.kind === "screenshot"
              ? "Screenshot"
              : "Documentation"}
        </Badge>
        <p className="text-xs text-[var(--sg-color-text-muted)]">
          via {item.linkedVia.join(" · ")}
        </p>
      </div>
      <p className="font-medium text-[var(--sg-color-text)]">{item.title}</p>

      {item.kind === "official-video" && item.media ? (
        <OfficialProductVideo
          media={item.media}
          vendorName={productName}
          variant="compact"
          showDetails={false}
          priority="low"
        />
      ) : null}

      {item.kind === "screenshot" && item.screenshotSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.screenshotSrc}
          alt={item.screenshotAlt ?? item.title}
          className="aspect-video w-full rounded-[var(--sg-radius-md)] object-contain bg-[var(--sg-color-surface-muted)]"
          loading="lazy"
        />
      ) : null}

      {item.demonstrates.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Demonstrates
          </p>
          <ul className="mt-2 space-y-1.5">
            {item.demonstrates.map((line) => (
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

      {item.doesNotEstablish.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Does not establish
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
            {item.doesNotEstablish.slice(0, 5).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {item.sourceUrl ? (
        <ExternalLink
          href={item.sourceUrl}
          type="evidence-source"
          className="text-sm font-medium"
        >
          Open source ↗
        </ExternalLink>
      ) : null}
    </div>
  );
}

function RequirementEvidenceDrawer({
  open,
  onClose,
  capabilityName,
  row,
  product,
}: {
  open: boolean;
  onClose: () => void;
  capabilityName: string;
  row: CapabilityRequirementEvidenceRow;
  product: RequirementProductEvidence;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="req-evidence-drawer-title"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-[var(--sg-color-surface)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--sg-color-border)] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {capabilityName} · Requirement evidence
            </p>
            <h2
              id="req-evidence-drawer-title"
              className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold"
            >
              {row.requirementName}
            </h2>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {product.productName} · {product.supportLabel}
            </p>
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

        <div className="space-y-5 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Traceability
            </p>
            <p className="mt-1 text-sm text-[var(--sg-color-text)]">
              {capabilityName}
              {" → "}
              {row.requirementName}
              {row.featureSlug ? ` → ${row.featureSlug}` : ""}
              {" → "}
              {product.productName}
              {" → Evidence"}
            </p>
          </div>

          <ul className="space-y-1 text-sm text-[var(--sg-color-text-muted)]">
            <li>Documentation: {product.documentationCount}</li>
            <li>Screenshots: {product.screenshotCount}</li>
            <li>Official videos: {product.officialVideoCount}</li>
          </ul>
          <p className="text-xs text-[var(--sg-color-text-muted)]">
            One ResearchMedia record is counted once even when it maps to
            multiple features or requirements. Media quantity does not change
            support labels.
          </p>

          {product.items.length === 0 ? (
            <Card className="p-4 text-sm text-[var(--sg-color-text-muted)]">
              No official video or tagged screenshot evidence is linked to this
              requirement yet. Support labels still come from feature
              assessments.
            </Card>
          ) : (
            <ul className="space-y-4">
              {product.items.map((item) => (
                <li key={item.id}>
                  <EvidenceItemBlock
                    item={item}
                    productName={product.productName}
                  />
                </li>
              ))}
            </ul>
          )}

          <Link
            href={product.reviewHref}
            className="inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Read {product.productName} review →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductRequirementEvidenceCard({
  capabilityName,
  row,
  product,
}: {
  capabilityName: string;
  row: CapabilityRequirementEvidenceRow;
  product: RequirementProductEvidence;
}) {
  const [open, setOpen] = useState(false);
  const hasVisual =
    product.officialVideoCount > 0 ||
    product.screenshotCount > 0 ||
    product.documentationCount > 0;

  return (
    <Card className="flex h-full flex-col p-4">
      <div className="flex items-center gap-2">
        <ProductLogo
          name={product.productName}
          logo={product.logo}
          size="sm"
        />
        <p className="font-semibold">{product.productName}</p>
      </div>
      <Badge variant={supportVariant(product.supportLabel)} className="mt-3 w-fit">
        {product.supportLabel === "Supported" ||
        product.supportLabel === "Strong" ||
        product.supportLabel === "Good" ||
        product.supportLabel === "Partial" ||
        product.supportLabel === "Limited"
          ? `${product.supportLabel === "Supported" ? "Strong" : product.supportLabel} support`
          : product.supportLabel}
      </Badge>
      <div className="mt-3 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
        <p>Evidence:</p>
        <ul className="list-disc pl-5">
          <li>Documentation {product.documentationCount}</li>
          <li>{product.screenshotCount} screenshots</li>
          <li>{product.officialVideoCount} official video{product.officialVideoCount === 1 ? "" : "s"}</li>
        </ul>
      </div>
      <div className="mt-auto pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasVisual && product.items.length === 0}
          onClick={() => setOpen(true)}
        >
          View evidence
        </Button>
      </div>
      <RequirementEvidenceDrawer
        open={open}
        onClose={() => setOpen(false)}
        capabilityName={capabilityName}
        row={row}
        product={product}
      />
    </Card>
  );
}

/**
 * Requirement-level evidence on Capability Detail pages.
 * Connects Capability → Requirement → Feature → Product → ResearchMedia.
 */
export function CapabilityRequirementEvidenceSection({
  model,
  className,
  /** Limit products shown per requirement (default 3). */
  productLimit = 3,
}: {
  model: CapabilityRequirementEvidenceModel;
  className?: string;
  productLimit?: number;
}) {
  if (model.rows.length === 0) return null;

  // Prefer requirements that have at least some linked media somewhere,
  // but still show core requirements for assessment context.
  const rows = model.rows.filter(
    (r) =>
      r.priority === "core" ||
      r.products.some(
        (p) =>
          p.officialVideoCount > 0 ||
          p.screenshotCount > 0 ||
          p.documentationCount > 0,
      ),
  );
  if (rows.length === 0) return null;

  return (
    <section
      id="requirement-evidence"
      aria-labelledby="requirement-evidence-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="requirement-evidence-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Requirement evidence for {model.capabilityName.toLowerCase()}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        See which official demonstrations and screenshots support each
        requirement. Support labels come from feature assessments —
        not from media counts.
      </p>

      <ul className="mt-8 space-y-10">
        {rows.map((row) => {
          const products = row.products
            .filter(
              (p) =>
                p.supportCell !== "unknown" ||
                p.officialVideoCount > 0 ||
                p.screenshotCount > 0 ||
                p.documentationCount > 0,
            )
            .slice(0, productLimit);

          if (products.length === 0) return null;

          return (
            <li key={row.requirementId}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Requirement
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
                    {row.requirementName}
                  </h3>
                  {row.description ? (
                    <p className="mt-1 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
                      {row.description}
                    </p>
                  ) : null}
                  {row.href ? (
                    <Link
                      href={row.href}
                      className="mt-2 inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      Explore requirement →
                    </Link>
                  ) : null}
                </div>
                <Badge variant={row.priority === "core" ? "primary" : "neutral"}>
                  {row.priority === "core" ? "Core" : "Advanced"}
                </Badge>
              </div>

              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <li key={`${row.requirementId}:${product.productSlug}`}>
                    <ProductRequirementEvidenceCard
                      capabilityName={model.capabilityName}
                      row={row}
                      product={product}
                    />
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
