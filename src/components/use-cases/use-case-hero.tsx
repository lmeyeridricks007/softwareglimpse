import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Package,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

export type UseCaseHeroStat = {
  label: string;
  href?: string;
  icon?: "products" | "use-cases" | "independent" | "methodology";
};

const ICONS = {
  products: Package,
  "use-cases": BookOpen,
  independent: ShieldCheck,
  methodology: Scale,
} as const;

type Props = {
  title: string;
  description?: string;
  stats?: UseCaseHeroStat[];
  className?: string;
};

export function UseCaseHubHero({
  title,
  description,
  stats = [],
  className,
}: Props) {
  return (
    <header
      className={cn(
        "grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
        className,
      )}
    >
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {description}
          </p>
        ) : null}

        {stats.length > 0 ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon ? ICONS[stat.icon] : BookOpen;
              const body = (
                <span className="inline-flex items-start gap-2 text-sm text-[var(--sg-color-text-muted)]">
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                    aria-hidden
                  />
                  {stat.label}
                </span>
              );
              return (
                <li key={stat.label}>
                  {stat.href ? (
                    <Link
                      href={stat.href}
                      className="underline-offset-2 hover:text-[var(--sg-color-text)] hover:underline"
                    >
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}

        <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
          Affiliate relationships never set use-case guidance.{" "}
          <Link
            href={LEGAL_ROUTES.editorialIndependence}
            className="underline underline-offset-2"
          >
            Independence
          </Link>
          {" · "}
          <Link
            href={COMPANY_ROUTES.methodology}
            className="underline underline-offset-2"
          >
            Methodology
          </Link>
        </p>
      </div>

      <UseCaseHeroVisual />
    </header>
  );
}

function UseCaseHeroVisual() {
  return (
    <div
      className="relative hidden overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-surface)] via-[var(--sg-color-surface-tint)] to-[var(--sg-color-primary-soft)] p-5 shadow-[var(--sg-shadow-md)] lg:block"
      aria-hidden
    >
      <div className="flex gap-3">
        <div className="w-12 shrink-0 space-y-2 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface)]/90 p-2">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="block size-6 rounded bg-[var(--sg-color-primary-soft)]"
            />
          ))}
        </div>
        <div className="min-w-0 flex-1 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3">
          <div className="h-2 w-24 rounded bg-[var(--sg-color-border)]" />
          <div className="mt-4 flex h-20 items-end gap-1.5">
            {[30, 48, 40, 70, 55, 80, 60].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t bg-[var(--sg-color-primary)]/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-success)]/30 bg-[var(--sg-color-success-soft)]/70 px-3 py-2">
            <p className="text-xs font-semibold text-[var(--sg-color-text)]">
              Workflow fit
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--sg-color-text-muted)]">
              Matched to use cases — not invented metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UseCaseDetailHero({
  title,
  description,
  categoryLabel,
  categoryHref,
  primaryCta,
  secondaryCta,
  seeWorkflowHref,
  heroVisual,
  children,
  className,
}: {
  title: string;
  description?: string;
  categoryLabel?: string;
  categoryHref?: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  /** Scroll target for workflow demos — never an active iframe. */
  seeWorkflowHref?: string | null;
  heroVisual?: { src: string; alt: string; caption?: string } | null;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      id="overview"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[linear-gradient(160deg,#dbeafe_0%,#e8f1fe_42%,#f4f8ff_100%)] px-5 py-8 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,22rem)] lg:gap-10">
        <div className="min-w-0">
          {categoryLabel && categoryHref ? (
            <Link
              href={categoryHref}
              className="inline-flex items-center gap-2 rounded-[var(--sg-radius-pill)] border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary-hover)] shadow-[var(--sg-shadow-sm)]"
            >
              {categoryLabel}
            </Link>
          ) : null}
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
              {description}
            </p>
          ) : null}
          {primaryCta || secondaryCta ? (
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
              {seeWorkflowHref ? (
                <a
                  href={seeWorkflowHref}
                  className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  ▶ See workflow demonstrations
                </a>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>

        {heroVisual ? (
          <figure className="overflow-hidden rounded-[var(--sg-radius-xl)] border border-white bg-[var(--sg-color-surface)] shadow-[0_12px_40px_rgb(15_23_42/0.08)]">
            <Image
              src={heroVisual.src}
              alt={heroVisual.alt}
              width={720}
              height={540}
              className="h-auto w-full object-contain"
              sizes="(min-width: 1024px) 22rem, 100vw"
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
          <UseCaseHeroVisual />
        )}
      </div>
    </header>
  );
}
