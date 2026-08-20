import Image from "next/image";
import { cn } from "@/lib/cn";

/** Unique per-guide cover when heroVisual exists; otherwise topic placeholder art. */
export function GuideCover({
  image,
  topicType,
  className,
}: {
  image?: { src: string; alt: string } | null;
  topicType: string;
  className?: string;
}) {
  if (image?.src) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]",
          className,
        )}
      >
        {/*
          Match GuideFigure framing: explicit width/height + contain.
          Avoid next/image `fill` here — with trailingSlash + large heroes it
          often falls back to a huge w=3840 src and leaves empty muted boxes.
        */}
        <Image
          src={image.src}
          alt={image.alt}
          width={960}
          height={640}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 280px"
          className="h-full w-full object-contain object-center"
          unoptimized
        />
      </div>
    );
  }
  return (
    <GuideIllustration
      variant={illustrationForTopic(topicType)}
      className={className}
    />
  );
}

/** Abstract editorial thumbnails — no stock photos. */
export function GuideIllustration({
  variant = "framework",
  className,
}: {
  variant?: "framework" | "basics" | "compare" | "pricing" | "stack" | "default";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[#eff6ff] via-white to-[#e0f2fe]",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgb(37_99_235/0.12),transparent_50%)]" />
      {variant === "framework" || variant === "default" ? (
        <FrameworkArt />
      ) : variant === "basics" ? (
        <BasicsArt />
      ) : variant === "compare" ? (
        <CompareArt />
      ) : variant === "pricing" ? (
        <PricingArt />
      ) : (
        <StackArt />
      )}
    </div>
  );
}

export function illustrationForTopic(topicType: string): Parameters<
  typeof GuideIllustration
>[0]["variant"] {
  if (topicType === "fundamental") return "basics";
  if (topicType === "comparison") return "compare";
  if (topicType === "pricing") return "pricing";
  if (topicType === "implementation") return "stack";
  if (topicType === "selection" || topicType === "buying-guide") return "framework";
  return "default";
}

function FrameworkArt() {
  return (
    <div className="relative flex h-full min-h-[7.5rem] flex-col justify-end gap-2 p-3 sm:min-h-[8.5rem]">
      {["Needs", "Features", "Cost"].map((label, i) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-md border border-white/80 bg-white/90 px-2 py-1.5 shadow-sm"
        >
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-[var(--sg-color-navy)] text-[10px] font-bold text-white">
            {i + 1}
          </span>
          <span className="text-[11px] font-medium text-[var(--sg-color-navy)]">
            {label}
          </span>
          <span className="ml-auto h-1.5 w-10 rounded-full bg-[var(--sg-color-primary-soft)]">
            <span
              className="block h-full rounded-full bg-[var(--sg-color-primary)]"
              style={{ width: `${70 - i * 15}%` }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

function BasicsArt() {
  return (
    <div className="relative flex h-full min-h-[7.5rem] items-center justify-center p-4 sm:min-h-[8.5rem]">
      <div className="grid w-full max-w-[9rem] grid-cols-2 gap-2">
        <div className="col-span-2 h-3 rounded bg-[var(--sg-color-primary)]/20" />
        <div className="h-10 rounded-md border border-[var(--sg-color-border)] bg-white shadow-sm" />
        <div className="h-10 rounded-md border border-[var(--sg-color-border)] bg-white shadow-sm" />
        <div className="col-span-2 h-8 rounded-md bg-[var(--sg-color-primary-soft)]" />
      </div>
    </div>
  );
}

function CompareArt() {
  return (
    <div className="relative flex h-full min-h-[7.5rem] flex-col justify-center gap-1.5 p-3 sm:min-h-[8.5rem]">
      <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-semibold text-[var(--sg-color-text-muted)]">
        <span />
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </div>
      {["Fit", "Price", "Ease"].map((row, ri) => (
        <div key={row} className="grid grid-cols-4 items-center gap-1">
          <span className="truncate text-[10px] text-[var(--sg-color-text-muted)]">
            {row}
          </span>
          {[0, 1, 2].map((ci) => (
            <span
              key={ci}
              className="mx-auto size-4 rounded-full border border-[var(--sg-color-border)] bg-white"
            >
              {(ri + ci) % 3 !== 2 ? (
                <span className="mx-auto mt-0.5 block size-2.5 rounded-full bg-[var(--sg-color-success)]" />
              ) : (
                <span className="mx-auto mt-1 block h-0.5 w-2.5 rounded bg-[var(--sg-color-border-strong)]" />
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function PricingArt() {
  return (
    <div className="relative flex h-full min-h-[7.5rem] flex-col justify-center gap-3 p-4 sm:min-h-[8.5rem]">
      <div className="h-2 rounded-full bg-[var(--sg-color-border)]">
        <div className="h-full w-2/3 rounded-full bg-[var(--sg-color-primary)]" />
      </div>
      <div className="rounded-md border border-[var(--sg-color-border)] bg-white px-3 py-2 shadow-sm">
        <p className="text-[10px] text-[var(--sg-color-text-muted)]">Estimate</p>
        <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Verified list prices
        </p>
      </div>
    </div>
  );
}

function StackArt() {
  return (
    <div className="relative flex h-full min-h-[7.5rem] flex-col justify-center gap-1.5 p-3 sm:min-h-[8.5rem]">
      {["CRM", "Email", "Support"].map((label) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-md border border-[var(--sg-color-border)] bg-white px-2.5 py-1.5 shadow-sm"
        >
          <span className="text-[11px] font-medium text-[var(--sg-color-text)]">
            {label}
          </span>
          <span className="text-[10px] font-semibold text-[var(--sg-color-primary)]">
            +
          </span>
        </div>
      ))}
    </div>
  );
}

/** Large featured-guide editorial diagram (comparison + steps). */
export function FeaturedGuideArt({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-white p-5 shadow-[var(--sg-shadow-md)] sm:p-6",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgb(37_99_235/0.14),transparent_55%)]" />
      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Decision snapshot
        </p>
        <div className="mt-3 overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
          <div className="grid grid-cols-4 bg-[var(--sg-color-surface-muted)] text-center text-[10px] font-semibold text-[var(--sg-color-text-muted)]">
            <span className="border-b border-[var(--sg-color-border)] px-2 py-2 text-left">
              Criterion
            </span>
            {["A", "B", "C"].map((n) => (
              <span
                key={n}
                className="border-b border-l border-[var(--sg-color-border)] px-1 py-2"
              >
                {n}
              </span>
            ))}
          </div>
          {[
            ["Pipeline", true, true, true],
            ["Automation", true, false, true],
            ["Ease of use", true, true, false],
          ].map(([label, a, b, c]) => (
            <div
              key={String(label)}
              className="grid grid-cols-4 border-t border-[var(--sg-color-border)] text-center text-[11px]"
            >
              <span className="px-2 py-2.5 text-left text-[var(--sg-color-text)]">
                {label as string}
              </span>
              {[a, b, c].map((ok, i) => (
                <span
                  key={i}
                  className="border-l border-[var(--sg-color-border)] px-1 py-2.5"
                >
                  {ok ? (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-[var(--sg-color-success-soft)] text-[var(--sg-color-success)]">
                      ✓
                    </span>
                  ) : (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]">
                      –
                    </span>
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Evaluate", "Compare", "Choose"].map((step, i) => (
            <span
              key={step}
              className="inline-flex items-center gap-1.5 rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-navy)]"
            >
              <span className="inline-flex size-4 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-[9px] font-bold text-white">
                {i + 1}
              </span>
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Start-here CRM-style dashboard preview. */
export function StartHereDashboardArt({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative hidden h-full min-h-[11rem] w-full overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white p-3 shadow-[var(--sg-shadow-sm)] lg:block",
        className,
      )}
      aria-hidden
    >
      <div className="mb-2 flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-red-300" />
        <span className="size-2 rounded-full bg-amber-300" />
        <span className="size-2 rounded-full bg-emerald-300" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-[var(--sg-color-primary-soft)] p-2">
          <p className="text-[9px] text-[var(--sg-color-text-muted)]">Pipeline</p>
          <p className="text-sm font-semibold text-[var(--sg-color-navy)]">12</p>
        </div>
        <div className="rounded-md bg-[var(--sg-color-surface-muted)] p-2">
          <p className="text-[9px] text-[var(--sg-color-text-muted)]">Tasks</p>
          <p className="text-sm font-semibold text-[var(--sg-color-navy)]">8</p>
        </div>
        <div className="col-span-2 space-y-1.5 rounded-md border border-[var(--sg-color-border)] p-2">
          <div className="h-1.5 w-full rounded-full bg-[var(--sg-color-primary)]/30">
            <div className="h-full w-3/5 rounded-full bg-[var(--sg-color-primary)]" />
          </div>
          <div className="h-1.5 w-4/5 rounded-full bg-[var(--sg-color-border)]" />
          <div className="h-1.5 w-2/3 rounded-full bg-[var(--sg-color-border)]" />
        </div>
      </div>
    </div>
  );
}
