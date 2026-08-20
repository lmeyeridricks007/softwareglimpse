import Link from "next/link";
import {
  CalendarClock,
  Package,
  RefreshCw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { BestSoftwareCompactDisclosure } from "./best-software-compact-disclosure";
import { BestSoftwareQuickSummary } from "./best-software-quick-summary";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ProductLogo } from "@/components/software/product-logo";
import type { BestPageHeroModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

const ICONS = {
  products: Package,
  updated: CalendarClock,
  independent: ShieldCheck,
  methodology: Scale,
} as const;

type Props = {
  hero: BestPageHeroModel;
  className?: string;
};

export function BestSoftwareHero({ hero, className }: Props) {
  return (
    <header className={cn("pt-1", className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        <div className="flex min-w-0 flex-1 flex-col">
          <Badge variant="primary" className="w-fit uppercase tracking-[0.1em]">
            Buying guide
          </Badge>

          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-tight text-[var(--sg-color-navy)]">
            {hero.title}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-[var(--sg-color-text-muted)]">
            {hero.subtitle}
          </p>

          {hero.stats.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
              {hero.stats.map((stat) => {
                const Icon =
                  ICONS[(stat.icon as keyof typeof ICONS) || "products"] ??
                  Package;
                const body = (
                  <span className="inline-flex items-center gap-1.5 text-sm text-[var(--sg-color-text-muted)]">
                    <Icon
                      className="size-3.5 shrink-0 text-[var(--sg-color-primary)]"
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

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </ButtonLink>
            {hero.secondaryCta ? (
              <ButtonLink
                href={hero.secondaryCta.href}
                variant="outline"
                size="lg"
              >
                {hero.secondaryCta.label}
              </ButtonLink>
            ) : null}
            {hero.tertiaryCta ? (
              <Link
                href={hero.tertiaryCta.href}
                className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {hero.tertiaryCta.label}
              </Link>
            ) : null}
          </div>

          <BestSoftwareCompactDisclosure
            className="mt-3"
            text={hero.compactDisclosure}
          />

          {hero.fitHighlights.length > 0 ? (
            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {hero.fitHighlights.map((item) => (
                <li
                  key={`${item.label}-${item.product.slug}`}
                  className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-3 shadow-[var(--sg-shadow-sm)]"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--sg-color-text-muted)]">
                    {item.label}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <ProductLogo
                      name={item.product.name}
                      logo={item.product.logo}
                      size="sm"
                    />
                    <Link
                      href={item.product.href}
                      className="text-sm font-semibold underline-offset-2 hover:underline"
                    >
                      {item.product.name}
                    </Link>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-[var(--sg-color-text-muted)]">
                    {item.reason}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {[
                {
                  label: "Independent methodology",
                  Icon: Scale,
                  tone: GUIDE_ICON_TONE_CLASSES.blue,
                },
                {
                  label: "Affiliate relationships don't influence rankings",
                  Icon: ShieldCheck,
                  tone: GUIDE_ICON_TONE_CLASSES.emerald,
                },
                {
                  label: "Recommendations refreshed over time",
                  Icon: RefreshCw,
                  tone: GUIDE_ICON_TONE_CLASSES.violet,
                },
              ].map(({ label, Icon, tone }) => (
                <li
                  key={label}
                  className="flex items-start gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-3 shadow-[var(--sg-shadow-sm)]"
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] border",
                      tone,
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-xs font-medium leading-snug text-[var(--sg-color-text)]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <BestSoftwareQuickSummary
          className="w-full shrink-0 lg:w-[28rem]"
          title={hero.shortlistTitle}
          items={hero.shortlist.slice(0, 3)}
          compareHref={hero.compareHref}
          compareLabel={hero.compareLabel}
        />
      </div>
    </header>
  );
}
