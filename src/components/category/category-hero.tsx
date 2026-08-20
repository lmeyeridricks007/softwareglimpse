import type { ReactNode } from "react";
import Link from "next/link";
import {
  CalendarClock,
  Package,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { CategoryDecisionSnapshot } from "@/components/category/category-decision-snapshot";
import { CategoryIcon } from "@/components/category/category-icon";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ButtonLink } from "@/components/ui/button";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

export type CategoryTrustStat = {
  label: string;
  href?: string;
  icon?: "products" | "updated" | "independent" | "methodology";
};

const ICONS = {
  products: Package,
  updated: CalendarClock,
  independent: ShieldCheck,
  methodology: Scale,
} as const;

type Props = {
  name: string;
  categoryId: string;
  tagline?: string;
  definition?: string;
  stats?: CategoryTrustStat[];
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  textLink?: { href: string; label: string };
  decisionSnapshot?: {
    categoryLabel: string;
    criteria: string[];
    popularNeeds: string[];
    chooseHref?: string;
    chooseLabel?: string;
  } | null;
  methodologyHref?: string;
  className?: string;
  icon?: ReactNode;
};

/**
 * Category hub hero — decision CTAs + snapshot (no decorative fake charts).
 */
export function CategoryHero({
  name,
  categoryId,
  tagline,
  definition,
  stats = [],
  primaryCta,
  secondaryCta,
  textLink,
  decisionSnapshot,
  methodologyHref = COMPANY_ROUTES.methodology,
  className,
  icon,
}: Props) {
  return (
    <header
      id="overview"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)] px-5 py-8 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
        <div>
          <div className="flex items-start gap-4">
            {icon ?? <CategoryIcon categoryId={categoryId} size="lg" />}
            <div className="min-w-0">
              <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-text)]">
                {name}
              </h1>
              {tagline ? (
                <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
                  {tagline}
                </p>
              ) : null}
            </div>
          </div>

          {definition ? (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--sg-color-text-muted)] sm:text-base">
              {definition}
            </p>
          ) : null}

          {(primaryCta || secondaryCta || textLink) && (
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
              {textLink ? (
                <Link
                  href={textLink.href}
                  className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {withSingleArrow(textLink.label)}
                </Link>
              ) : null}
            </div>
          )}

          {stats.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              {stats.map((stat) => {
                const Icon = stat.icon ? ICONS[stat.icon] : Package;
                const body = (
                  <span className="inline-flex items-center gap-2 text-sm text-[var(--sg-color-text-muted)]">
                    <Icon
                      className="size-4 text-[var(--sg-color-primary)]"
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
            <Link
              href={methodologyHref}
              className="underline underline-offset-2"
            >
              How we evaluate {name.replace(/ software$/i, "")}
            </Link>
          </p>
        </div>

        {decisionSnapshot ? (
          <CategoryDecisionSnapshot {...decisionSnapshot} />
        ) : null}
      </div>
    </header>
  );
}
