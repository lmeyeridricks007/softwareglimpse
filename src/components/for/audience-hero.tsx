import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Check,
  HeartHandshake,
  Laptop,
  Rocket,
  Store,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AudienceHeroVisual } from "@/components/for/audience-visuals";
import type { AudienceVisualKind } from "@/components/for/audience-visuals";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const TRUST = [
  "Independent recommendations",
  "Affiliate relationships never set recommendations",
  "Starting shortlists — not ranked best-of lists",
] as const;

const HERO_IMAGES: Partial<
  Record<AudienceVisualKind, { src: string; alt: string }>
> = {
  "small-business": {
    src: "/for/for-small-business-hero.png",
    alt: "Educational diagram: small-business team moving from sticky notes and spreadsheets to a shared CRM pipeline with light admin.",
  },
  startups: {
    src: "/for/for-startups-hero.png",
    alt: "Educational diagram: startup CRM flow from inbound demos to founder pipeline to later scale steps.",
  },
  enterprise: {
    src: "/for/for-enterprise-hero.png",
    alt: "Educational diagram: enterprise CRM buying group and scorecard gates for SSO, audit, and integrations.",
  },
  freelancers: {
    src: "/for/for-freelancers-hero.png",
    alt: "Educational diagram: freelancer CRM focused on client history and follow-ups without a complex sales board.",
  },
  agencies: {
    src: "/for/for-agencies-hero.png",
    alt: "Educational diagram: agency pitch pipeline handing off to delivery with stakeholders and scope notes intact.",
  },
  nonprofits: {
    src: "/for/for-nonprofits-hero.png",
    alt: "Educational diagram: nonprofit CRM covering donors, volunteers, and partner grant stages with clear owners.",
  },
  "growing-teams": {
    src: "/for/for-growing-teams-hero.png",
    alt: "Educational diagram: growing team leaving spreadsheet chaos for light CRM stages, then forecast and automation later.",
  },
  "sales-teams": {
    src: "/for/for-sales-teams-hero.png",
    alt: "Educational diagram: remote sales team sharing pipeline truth and async coaching without hallway updates.",
  },
};

type Props = {
  badgeLabel: string;
  title: string;
  tagline: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  textLink?: { href: string; label: string };
  visualKind?: AudienceVisualKind;
  className?: string;
};

export function AudienceDetailHero({
  badgeLabel,
  title,
  tagline,
  primaryCta,
  secondaryCta,
  textLink,
  visualKind = "default",
  className,
}: Props) {
  const heroImage = HERO_IMAGES[visualKind];

  return (
    <header
      id="overview"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[linear-gradient(160deg,#dbeafe_0%,#e8f1fe_42%,#f4f8ff_100%)] px-5 py-8 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,1.1fr)] lg:gap-10">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-[var(--sg-radius-pill)] border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary-hover)] shadow-[var(--sg-shadow-sm)]">
            <Users className="size-3.5" aria-hidden />
            Business type / {badgeLabel}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {tagline}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="outline" size="lg">
              {secondaryCta.label}
            </ButtonLink>
            {textLink ? (
              <Link
                href={textLink.href}
                className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {textLink.label}
              </Link>
            ) : null}
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--sg-color-text-muted)] sm:text-sm"
              >
                <Check
                  className="size-3.5 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {heroImage ? (
          <figure className="relative hidden overflow-hidden rounded-[var(--sg-radius-xl)] border border-white/80 bg-white/70 shadow-[var(--sg-shadow-md)] lg:block">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={960}
              height={540}
              className="h-auto w-full object-contain"
              sizes="(min-width: 1024px) 34rem, 100vw"
              priority
              unoptimized
          />
          </figure>
        ) : (
          <AudienceHeroVisual kind={visualKind} className="min-h-[14rem]" />
        )}
      </div>
    </header>
  );
}

type HubHeroProps = {
  title: string;
  description: string;
  stats?: Array<{ label: string; href?: string }>;
  className?: string;
};

export function AudienceHubHero({
  title,
  description,
  stats = [],
  className,
}: HubHeroProps) {
  return (
    <header
      className={cn(
        "grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]",
        className,
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Business type
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
          {description}
        </p>
        {stats.length > 0 ? (
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {stats.map((stat) => (
              <li
                key={stat.label}
                className="text-sm text-[var(--sg-color-text-muted)]"
              >
                {stat.href ? (
                  <Link
                    href={stat.href}
                    className="underline-offset-2 hover:text-[var(--sg-color-text)] hover:underline"
                  >
                    {stat.label}
                  </Link>
                ) : (
                  stat.label
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <figure className="relative hidden overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-md)] lg:block">
        <Image
          src="/for/for-small-business-hero.png"
          alt="Educational diagram showing how business-type CRM fit moves teams from scattered follow-ups to a shared pipeline."
          width={960}
          height={540}
          className="h-auto w-full object-contain"
          sizes="(min-width: 1024px) 34rem, 100vw"
          priority
          unoptimized
        />
      </figure>
    </header>
  );
}

export const AUDIENCE_ICONS: Record<string, LucideIcon> = {
  "small-business": Store,
  startups: Rocket,
  enterprise: Building2,
  freelancers: Laptop,
  agencies: Building2,
  nonprofits: HeartHandshake,
  "growing-teams": TrendingUp,
  "sales-teams": Users,
};

export function iconForAudienceSlug(slug: string): LucideIcon {
  return AUDIENCE_ICONS[slug] ?? Users;
}
