import Link from "next/link";
import Image from "next/image";
import { Check, Landmark } from "lucide-react";
import { createElement } from "react";
import { isPageDetailHref } from "@/components/industries/detail-href";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Priority = {
  id: string;
  title: string;
  icon?: string;
  href?: string;
};

type HeroVisual = {
  src: string;
  alt: string;
  caption?: string;
};

type Props = {
  badgeLabel: string;
  title: string;
  tagline: string;
  confidenceMessage?: string | null;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  textLink: { href: string; label: string };
  priorities: Priority[];
  prioritiesHref?: string;
  heroVisual?: HeroVisual | null;
  /** Scroll target when suitable industry media exists — never embeds video in hero. */
  seeWorkflowHref?: string;
  seeWorkflowLabel?: string;
  className?: string;
};

const TRUST = [
  "Independent recommendations",
  "Evidence-backed comparisons",
  "Affiliate relationships never affect rankings",
] as const;

export function IndustryHubHero({
  badgeLabel,
  title,
  tagline,
  confidenceMessage,
  primaryCta,
  secondaryCta,
  textLink,
  priorities,
  prioritiesHref,
  heroVisual,
  seeWorkflowHref,
  seeWorkflowLabel,
  className,
}: Props) {
  const shown = priorities.slice(0, 6);
  const footerHref = isPageDetailHref(prioritiesHref)
    ? prioritiesHref
    : undefined;

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
          <p className="inline-flex items-center gap-2 rounded-[var(--sg-radius-pill)] border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary-hover)] shadow-[var(--sg-shadow-sm)]">
            <Landmark className="size-3.5" aria-hidden />
            Industries / {badgeLabel}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {tagline}
          </p>

          {confidenceMessage ? (
            <p
              role="status"
              className="mt-4 max-w-xl rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5 text-sm text-[var(--sg-color-text-muted)]"
            >
              {confidenceMessage}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="outline" size="lg">
              {secondaryCta.label}
            </ButtonLink>
            <Link
              href={textLink.href}
              className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {withSingleArrow(textLink.label)}
            </Link>
          </div>

          {seeWorkflowHref ? (
            <p className="mt-4">
              <a
                href={seeWorkflowHref}
                className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                ▶ {seeWorkflowLabel ?? "See CRM workflows"}
              </a>
            </p>
          ) : null}

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--sg-color-text-muted)]"
              >
                <Check
                  className="size-4 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {heroVisual ? (
          <div className="self-center overflow-hidden rounded-[var(--sg-radius-xl)] border border-white/70 bg-[#e8f1fe] shadow-[0_12px_40px_rgb(15_23_42/0.08)]">
            <Image
              src={heroVisual.src}
              alt={heroVisual.alt}
              width={1280}
              height={853}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 22rem, 100vw"
              priority
              unoptimized
            />
          </div>
        ) : (
          <IndustryPrioritiesVisual
            priorities={shown}
            prioritiesHref={footerHref}
          />
        )}
      </div>
    </header>
  );
}

function IndustryPrioritiesVisual({
  priorities,
  prioritiesHref,
}: {
  priorities: Priority[];
  prioritiesHref?: string;
}) {
  return (
    <aside
      className="flex min-h-[20rem] flex-col rounded-[var(--sg-radius-xl)] border border-white bg-[var(--sg-color-surface)] p-5 shadow-[0_12px_40px_rgb(15_23_42/0.08)] sm:min-h-[22rem] sm:p-6"
      aria-label="Industry CRM priorities"
    >
      <ul className="flex flex-1 flex-col justify-center gap-3">
        {priorities.map((item) => {
          const Icon = resolveIndustryIcon(item.icon);
          const href = isPageDetailHref(item.href) ? item.href : undefined;
          const body = (
            <>
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                {createElement(Icon, {
                  className: "size-5",
                  strokeWidth: 1.75,
                  "aria-hidden": true,
                })}
              </span>
              <span
                className={cn(
                  "text-sm font-medium text-[var(--sg-color-text)]",
                  href && "group-hover:text-[var(--sg-color-primary)]",
                )}
              >
                {item.title}
              </span>
            </>
          );
          return (
            <li key={item.id}>
              {href ? (
                <Link
                  href={href}
                  className="group flex items-center gap-3 rounded-[var(--sg-radius-md)] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sg-color-primary)]"
                >
                  {body}
                </Link>
              ) : (
                <div className="flex items-center gap-3">{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      {prioritiesHref ? (
        <Link
          href={prioritiesHref}
          className="mt-5 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          {withSingleArrow("Use these priorities to compare CRM software")}
        </Link>
      ) : null}
    </aside>
  );
}
