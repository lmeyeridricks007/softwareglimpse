import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function ResourceHubHero({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
          {description}
        </p>
      ) : null}
    </header>
  );
}

export function ResourceDetailHero({
  title,
  tagline,
  explanation,
  badgeLabel,
  toolkitLabel,
  categoryLabel,
  categoryHref,
  primaryCta,
  secondaryCta,
  previewHref,
  metaLine,
  heroVisual,
  children,
  className,
}: {
  title: string;
  tagline?: string;
  explanation?: string | null;
  badgeLabel?: string;
  toolkitLabel?: string | null;
  categoryLabel?: string;
  categoryHref?: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  previewHref?: string | null;
  metaLine?: string | null;
  heroVisual?: { src: string; alt: string; caption?: string } | null;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      id="overview"
      className={cn("scroll-mt-28", className)}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,24rem)] lg:gap-10">
        <div className="min-w-0">
          {categoryLabel && categoryHref ? (
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              <Link
                href={categoryHref}
                className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {categoryLabel}
              </Link>
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {badgeLabel ? (
              <span className="inline-flex items-center rounded-[var(--sg-radius-sm)] bg-[var(--sg-color-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                {badgeLabel}
              </span>
            ) : null}
            {toolkitLabel ? (
              <span className="inline-flex items-center rounded-[var(--sg-radius-sm)] bg-[#dbeafe] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--sg-color-primary-hover)]">
                {toolkitLabel}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            {title}
          </h1>
          {tagline ? (
            <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] font-medium text-[var(--sg-color-text)]">
              {tagline}
            </p>
          ) : null}
          {explanation ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
              {explanation}
            </p>
          ) : null}

          {primaryCta || secondaryCta || previewHref ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {primaryCta ? (
                <ButtonLink href={primaryCta.href} size="lg">
                  {primaryCta.label}
                </ButtonLink>
              ) : null}
              {secondaryCta ? (
                <ButtonLink href={secondaryCta.href} variant="outline" size="lg">
                  {secondaryCta.label}
                </ButtonLink>
              ) : null}
              {previewHref ? (
                <a
                  href={previewHref}
                  className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Preview checklist
                </a>
              ) : null}
            </div>
          ) : null}

          {metaLine ? (
            <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
              {metaLine}
            </p>
          ) : null}
          {children}
        </div>

        {heroVisual ? (
          <figure className="overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-white shadow-[0_12px_40px_rgb(15_23_42/0.08)]">
            <Image
              src={heroVisual.src}
              alt={heroVisual.alt}
              width={720}
              height={540}
              className="h-auto w-full object-contain"
              sizes="(min-width: 1024px) 24rem, 100vw"
              priority
              unoptimized
          />
            {heroVisual.caption ? (
              <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
                {heroVisual.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : (
          <div
            className="hidden overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-white p-4 shadow-[var(--sg-shadow-sm)] lg:block"
            aria-hidden
          >
            <p className="mb-3 text-xs font-semibold text-[var(--sg-color-navy)]">
              Artifact preview
            </p>
            <div className="space-y-2">
              <div className="grid grid-cols-6 gap-1 rounded bg-[var(--sg-color-navy)] px-2 py-1.5 text-[8px] font-semibold uppercase text-white">
                <span>#</span>
                <span className="col-span-2">Check item</span>
                <span>Req</span>
                <span>Result</span>
                <span>Notes</span>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-1 rounded border border-[var(--sg-color-border)] px-2 py-2"
                >
                  <span className="h-2 w-4 rounded bg-[var(--sg-color-border)]" />
                  <span className="col-span-2 h-2 rounded bg-[var(--sg-color-border)]" />
                  <span className="h-2 w-3 rounded bg-[var(--sg-color-border)]" />
                  <span
                    className={cn(
                      "h-2 w-10 rounded",
                      i % 2 === 0 ? "bg-emerald-300" : "bg-amber-300",
                    )}
                  />
                  <span className="h-2 rounded bg-[var(--sg-color-border)]" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
