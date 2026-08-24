"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { ProductScreenshot } from "@/components/software/product-screenshot-gallery";
import type { ComparisonPageModel } from "@/services/comparison-page/types";
import { publicScreenshotCaption } from "@/services/product-media/public-screenshot-copy";
import { isVendorUiScreenshot } from "@/services/product-media/screenshot-kind";

type Props = {
  model: ComparisonPageModel;
};

type ShotWithSide = ProductScreenshot & { side: "a" | "b"; productName: string };

function categoryFromCaption(caption?: string): string {
  const label = caption?.trim();
  if (!label) return "General";
  const first = label.split(/[:|—–-]/)[0]?.trim();
  return first && first.length < 40 ? first : "General";
}

export function ComparisonScreenshotsTab({ model }: Props) {
  const all: ShotWithSide[] = useMemo(() => {
    return [
      ...model.productA.screenshots.filter(isVendorUiScreenshot).map((s) => ({
        ...s,
        side: "a" as const,
        productName: model.productA.name,
      })),
      ...model.productB.screenshots.filter(isVendorUiScreenshot).map((s) => ({
        ...s,
        side: "b" as const,
        productName: model.productB.name,
      })),
    ];
  }, [model.productA, model.productB]);

  const categories = useMemo(() => {
    const set = new Set(
      all.map((s) => categoryFromCaption(publicScreenshotCaption(s) ?? undefined)),
    );
    return ["All", ...Array.from(set)];
  }, [all]);

  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<ShotWithSide | null>(null);

  const filtered =
    filter === "All"
      ? all
      : all.filter(
          (s) =>
            categoryFromCaption(publicScreenshotCaption(s) ?? undefined) ===
            filter,
        );

  const shotsA = filtered.filter((s) => s.side === "a");
  const shotsB = filtered.filter((s) => s.side === "b");

  if (all.length === 0) {
    return (
      <Card className="p-6 text-sm text-[var(--sg-color-text-muted)]">
        Verified screenshots are not available for this comparison yet.
      </Card>
    );
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        Screenshots
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        Verified product UI captures from research — never stock imagery.
      </p>

      {categories.length > 2 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-[var(--sg-radius-pill)] px-3 py-1.5 text-sm",
                filter === cat
                  ? "bg-[var(--sg-color-primary)] text-white"
                  : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ShotColumn
          name={model.productA.name}
          shots={shotsA}
          onOpen={setLightbox}
        />
        <ShotColumn
          name={model.productB.name}
          shots={shotsB}
          onOpen={setLightbox}
        />
      </div>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setLightbox(null);
          }}
        >
          <div
            className="max-h-[90vh] max-w-5xl overflow-auto rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-md)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[70vh] w-full object-contain"
            />
            <div className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
              <p className="font-medium text-[var(--sg-color-text)]">
                {lightbox.productName}
                {publicScreenshotCaption(lightbox)
                  ? ` — ${publicScreenshotCaption(lightbox)}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              className="mt-4 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              onClick={() => setLightbox(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ShotColumn({
  name,
  shots,
  onOpen,
}: {
  name: string;
  shots: ShotWithSide[];
  onOpen: (shot: ShotWithSide) => void;
}) {
  return (
    <div>
      <h3 className="font-semibold text-[var(--sg-color-text)]">{name}</h3>
      {shots.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          No screenshots in this filter.
        </p>
      ) : (
        <ul className="mt-3 space-y-4">
          {shots.map((shot) => (
            <li key={shot.id}>
              <button
                type="button"
                className="w-full overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-left shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-border-strong)]"
                onClick={() => onOpen(shot)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  alt={shot.alt}
                  className="aspect-video w-full object-contain bg-[var(--sg-color-surface-muted)]"
                />
                <div className="px-3 py-2 text-xs text-[var(--sg-color-text-muted)]">
                  {publicScreenshotCaption(shot) ?? shot.alt}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
