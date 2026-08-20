import Image from "next/image";
import Link from "next/link";
import { createElement } from "react";
import { Building2, Package, Scale, ShieldCheck } from "lucide-react";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

export type IndustryHeroStat = {
  label: string;
  href?: string;
  icon?: "products" | "industries" | "independent" | "methodology";
};

const ICONS = {
  products: Package,
  industries: Building2,
  independent: ShieldCheck,
  methodology: Scale,
} as const;

const HERO_IMAGE = {
  src: "/industries/crm-by-industry-hero-v2.png",
  alt: "CRM-by-industry research dashboard mapping vertical objects, pipelines, and must-have gates",
  width: 1536,
  height: 1024,
} as const;

type Props = {
  title: string;
  description?: string;
  stats?: IndustryHeroStat[];
  className?: string;
};

export function IndustryHubHero({
  title,
  description,
  stats = [],
  className,
}: Props) {
  return (
    <header
      className={cn(
        "grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {description}
          </p>
        ) : null}

        {stats.length > 0 ? (
          <ul className="mt-7 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon ? ICONS[stat.icon] : Building2;
              const body = (
                <span className="inline-flex items-start gap-2.5 text-sm text-[var(--sg-color-text-muted)]">
                  {createElement(Icon, {
                    className:
                      "mt-0.5 size-[1.125rem] shrink-0 text-[var(--sg-color-primary)]",
                    strokeWidth: 1.75,
                    "aria-hidden": true,
                  })}
                  <span className="leading-snug">{stat.label}</span>
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

        <p className="mt-6 text-xs leading-relaxed text-[var(--sg-color-text-muted)]">
          Affiliate relationships never set industry guidance.{" "}
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

      <IndustryHeroVisual />
    </header>
  );
}

function IndustryHeroVisual() {
  return (
    <div
      className="relative mx-auto w-full max-w-[34rem] lg:max-w-none"
      aria-hidden
    >
      <Image
        src={HERO_IMAGE.src}
        alt=""
        width={HERO_IMAGE.width}
        height={HERO_IMAGE.height}
        priority
        className="h-auto w-full select-none"
      />
      <span className="sr-only">{HERO_IMAGE.alt}</span>
    </div>
  );
}

export function IndustryDetailHero({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn(className)}>
      <Link
        href="/industries/"
        className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        All industries
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
          {description}
        </p>
      ) : null}
    </header>
  );
}
