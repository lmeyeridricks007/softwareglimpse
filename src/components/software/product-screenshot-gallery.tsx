"use client";

import { Monitor } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  isOriginalProductDiagram,
  isVendorUiScreenshot,
} from "@/services/product-media/screenshot-kind";
import { publicScreenshotCaption } from "@/services/product-media/public-screenshot-copy";

export type ProductScreenshot = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  checkedAt?: string;
  annotation?: string;
  /** vendor-ui = product capture; original-diagram = SG teaching asset */
  kind?: "vendor-ui" | "original-diagram";
};

type GalleryProps = {
  productName: string;
  screenshots: ProductScreenshot[];
  className?: string;
};

type DiagramProps = {
  productName: string;
  diagrams: ProductScreenshot[];
  className?: string;
};

function ShotMeta({
  selected,
}: {
  selected: ProductScreenshot;
}) {
  const label = publicScreenshotCaption(selected);
  if (!label) return null;

  return (
    <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">{label}</p>
  );
}

function ShotViewer({
  shots,
  thumbLabel,
}: {
  shots: ProductScreenshot[];
  thumbLabel: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = shots[selectedIndex] ?? shots[0]!;

  return (
    <>
      <div className="mt-5 overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selected.src}
          alt={selected.alt}
          width={1280}
          height={720}
          className="aspect-video w-full object-contain bg-[var(--sg-color-surface-muted)]"
        />
      </div>

      {shots.length > 1 ? (
        <ul
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label={thumbLabel}
        >
          {shots.map((shot, index) => (
            <li key={shot.id} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={shot.alt}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "block shrink-0 overflow-hidden rounded-[var(--sg-radius-md)] border-2 transition-colors",
                  index === selectedIndex
                    ? "border-[var(--sg-color-primary)]"
                    : "border-transparent opacity-80 hover:opacity-100",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  alt=""
                  width={80}
                  height={80}
                  className="size-16 object-cover sm:size-20"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <ShotMeta selected={selected} />
    </>
  );
}

/**
 * Verified vendor UI captures only. Original teaching diagrams must use
 * {@link ProductTeachingDiagramGallery} — never label them as product screenshots.
 */
export function ProductScreenshotGallery({
  productName,
  screenshots,
  className,
}: GalleryProps) {
  const vendorUi = useMemo(
    () => screenshots.filter(isVendorUiScreenshot),
    [screenshots],
  );

  if (vendorUi.length === 0) {
    return (
      <section
        aria-labelledby="screenshots-heading"
        className={cn("scroll-mt-28", className)}
      >
        <h2
          id="screenshots-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          Product screenshots
        </h2>
        <Card
          variant="soft"
          className="mt-5 flex flex-col items-center px-6 py-10 text-center"
        >
          <span className="inline-flex size-14 items-center justify-center rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-surface)] text-[var(--sg-color-primary)] shadow-[var(--sg-shadow-sm)]">
            <Monitor className="size-7" aria-hidden />
          </span>
          <p className="mt-4 font-semibold text-[var(--sg-color-text)]">
            Product screenshots coming soon
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
            We only publish verified captures from {productName}&apos;s product
            interface — never stock images, mockups, or teaching diagrams.
            Screenshots appear here once editorial review confirms them.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="screenshots-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="screenshots-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Product screenshots
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        Verified captures from {productName}&apos;s product interface.
      </p>
      <ShotViewer
        shots={vendorUi}
        thumbLabel={`${productName} screenshot thumbnails`}
      />
    </section>
  );
}

/**
 * SoftwareGlimpse original teaching diagrams — explicitly not vendor UI.
 */
export function ProductTeachingDiagramGallery({
  productName,
  diagrams,
  className,
}: DiagramProps) {
  const originals = useMemo(
    () => diagrams.filter(isOriginalProductDiagram),
    [diagrams],
  );

  if (originals.length === 0) return null;

  return (
    <section
      aria-labelledby="teaching-diagrams-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="teaching-diagrams-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How {productName} works
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        SoftwareGlimpse teaching diagrams grounded in product concepts — not
        vendor UI screenshots.
      </p>
      <ShotViewer
        shots={originals}
        thumbLabel={`${productName} teaching diagram thumbnails`}
      />
    </section>
  );
}
