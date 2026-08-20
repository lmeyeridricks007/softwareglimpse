import Link from "next/link";
import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  CrmSelectionFrameworkVisual,
  GuideHeroIllustration,
} from "@/components/guides/guide-visuals";
import { GUIDE_LAYOUT } from "@/components/guides/guide-template";
import { cn } from "@/lib/cn";

type CategoryChip = {
  name: string;
  href: string;
};

type AuthorMeta = {
  name: string;
  href?: string;
  role?: string;
  initials?: string;
};

type FrameworkStep = { id: string; label: string };

type HeroVisual = {
  src: string;
  alt: string;
};

type Props = {
  title: string;
  summary?: string;
  category?: CategoryChip;
  readingMinutes: number;
  author?: AuthorMeta | null;
  updatedLabel?: string;
  factChecked?: boolean;
  /** Prefer guide-specific artwork. Falls back to framework/default only if unset. */
  heroVisual?: HeroVisual | null;
  visual?: "default" | "framework";
  frameworkSteps?: FrameworkStep[];
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  /** Fills leftover height under CTAs (e.g. Quick Answer beside the hero visual). */
  belowCta?: ReactNode;
  className?: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/u).filter(Boolean);
  if (parts.length === 0) return "SG";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function GuideHero({
  title,
  summary,
  category,
  readingMinutes,
  author,
  updatedLabel,
  factChecked = false,
  heroVisual,
  visual = "default",
  frameworkSteps,
  primaryCta,
  secondaryCta,
  belowCta,
  className,
}: Props) {
  const initials =
    author?.initials ||
    (author?.name ? initialsFromName(author.name) : "SG");

  return (
    <header className={cn(GUIDE_LAYOUT.hero, className)}>
      <div className="flex min-h-0 flex-col">
        {category ? (
          <Link href={category.href}>
            <Badge
              variant="primary"
              className="rounded-full bg-[var(--sg-color-primary-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]"
            >
              {category.name}
            </Badge>
          </Link>
        ) : null}

        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
          {title}
        </h1>

        {summary ? (
          <p className="mt-2 max-w-2xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {summary}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--sg-color-text-muted)]">
          {author ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-flex size-7 items-center justify-center rounded-full bg-[var(--sg-color-primary-soft)] text-[10px] font-semibold text-[var(--sg-color-primary)]"
                aria-hidden
              >
                {initials}
              </span>
              <span>
                By{" "}
                {author.href ? (
                  <Link
                    href={author.href}
                    className="font-medium text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                  >
                    {author.name}
                  </Link>
                ) : (
                  <span className="font-medium text-[var(--sg-color-text)]">
                    {author.name}
                  </span>
                )}
              </span>
            </span>
          ) : null}
          {updatedLabel ? <span>Updated {updatedLabel}</span> : null}
          <span>{readingMinutes} min read</span>
          {factChecked ? (
            <span className="inline-flex items-center gap-1 rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-success-soft)] px-2 py-0.5 text-[var(--sg-color-success)]">
              <BadgeCheck className="size-3.5" aria-hidden />
              Fact-checked
            </span>
          ) : null}
        </div>

        {(primaryCta || secondaryCta) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {primaryCta ? (
              <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
            ) : null}
            {secondaryCta ? (
              <ButtonLink
                href={secondaryCta.href}
                variant="outline"
                className="border-[var(--sg-color-primary)] text-[var(--sg-color-primary)] hover:bg-[var(--sg-color-primary-soft)]"
              >
                {secondaryCta.label}
              </ButtonLink>
            ) : null}
          </div>
        )}

        {belowCta ? (
          <div className="mt-6 flex min-h-0 flex-1 flex-col justify-end lg:mt-8">
            {belowCta}
          </div>
        ) : null}
      </div>

      {heroVisual ? (
        <GuideHeroIllustration src={heroVisual.src} alt={heroVisual.alt} />
      ) : visual === "framework" ? (
        <CrmSelectionFrameworkVisual steps={frameworkSteps} />
      ) : (
        <GuideHeroFallback />
      )}
    </header>
  );
}

function GuideHeroFallback() {
  return (
    <div
      className="sg-guide-card relative mx-auto hidden aspect-[5/4] w-full max-w-md overflow-hidden bg-gradient-to-br from-[var(--sg-color-primary-soft)] via-[var(--sg-color-surface)] to-[var(--sg-color-surface-tint)] p-6 lg:block"
      aria-hidden
    >
      <div className="sg-guide-card relative mx-auto mt-4 max-w-xs p-4 shadow-[var(--sg-shadow-sm)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-sm font-semibold text-white">
            SG
          </span>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-2.5 w-24 rounded bg-[var(--sg-color-border)]" />
            <div className="h-2 w-16 rounded bg-[var(--sg-color-surface-muted)]" />
          </div>
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--sg-color-success-soft)] text-[var(--sg-color-success)]">
            <BadgeCheck className="size-4" />
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="h-12 rounded-[var(--sg-radius-md)] bg-blue-50" />
          <div className="h-12 rounded-[var(--sg-radius-md)] bg-teal-50" />
          <div className="h-12 rounded-[var(--sg-radius-md)] bg-violet-50" />
        </div>
      </div>
    </div>
  );
}
