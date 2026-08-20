"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { IndustryCapabilityScreenshot } from "@/services/industry-capability";
import { cn } from "@/lib/cn";

type Props = {
  title?: string;
  capabilityName: string;
  items: IndustryCapabilityScreenshot[];
  className?: string;
};

export function CapabilityScreenshots({
  title,
  capabilityName,
  items,
  className,
}: Props) {
  const [active, setActive] = useState<IndustryCapabilityScreenshot | null>(
    null,
  );

  if (items.length === 0) return null;

  return (
    <section
      id="screenshots"
      aria-labelledby="screenshots-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="screenshots-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title ?? `${capabilityName} in action`}
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        Verified product captures only — never stock imagery or mockups.
      </p>
      <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={`${item.productSlug}-${item.id}`}>
            <button
              type="button"
              onClick={() => setActive(item)}
              className="group w-full overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-left shadow-[var(--sg-shadow-sm)]"
            >
              <div className="relative aspect-[16/10] bg-[var(--sg-color-surface-muted)]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover object-top transition-transform group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-[var(--sg-color-text)]">
                  {item.productName}
                </p>
                <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                  {item.caption ?? item.alt}
                </p>
                {item.checkedAt ? (
                  <p className="mt-1 text-[10px] text-[var(--sg-color-text-muted)]">
                    Verified {item.checkedAt.slice(0, 10)}
                  </p>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface)] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 rounded-full bg-[var(--sg-color-surface-muted)] p-2"
              onClick={() => setActive(null)}
              aria-label="Close screenshot"
            >
              <X className="size-4" />
            </button>
            <div className="relative mt-6 aspect-[16/10] w-full">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            <p className="mt-3 text-sm font-semibold">{active.productName}</p>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {active.caption ?? active.alt}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
