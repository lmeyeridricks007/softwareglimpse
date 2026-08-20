import Link from "next/link";
import {
  CalendarClock,
  Package,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

export type BestHeroStat = {
  label: string;
  href?: string;
  icon?: "products" | "updated" | "independent" | "methodology";
};

export type BestMethodologyCriterion = {
  slug: string;
  name: string;
};

type Props = {
  title: string;
  summary?: string;
  updatedLabel?: string;
  provisional?: boolean;
  stats?: BestHeroStat[];
  methodologyVersion?: string;
  criteria?: BestMethodologyCriterion[];
  /** Approved lead score only — never invent. */
  leadScore?: number | null;
  leadScoreApproved?: boolean;
  className?: string;
};

const ICONS = {
  products: Package,
  updated: CalendarClock,
  independent: ShieldCheck,
  methodology: Scale,
} as const;

export function BestHero({
  title,
  summary,
  updatedLabel,
  provisional = false,
  stats = [],
  methodologyVersion,
  criteria = [],
  leadScore,
  leadScoreApproved = false,
  className,
}: Props) {
  return (
    <header
      className={cn(
        "grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,22rem)]",
        className,
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {updatedLabel ? (
            <Badge variant="success">Updated {updatedLabel}</Badge>
          ) : null}
        </div>

        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
          {title}
        </h1>

        {summary ? (
          <p className="mt-3 max-w-2xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {summary}
          </p>
        ) : null}

        {stats.length > 0 ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon ? ICONS[stat.icon] : Package;
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
      </div>

      <BestMethodologyCard
        criteria={criteria}
        methodologyVersion={methodologyVersion}
        leadScore={leadScore}
        leadScoreApproved={leadScoreApproved}
        provisional={provisional}
      />
    </header>
  );
}

function BestMethodologyCard({
  criteria,
  methodologyVersion,
  leadScore,
  leadScoreApproved,
  provisional,
}: {
  criteria: BestMethodologyCriterion[];
  methodologyVersion?: string;
  leadScore?: number | null;
  leadScoreApproved?: boolean;
  provisional?: boolean;
}) {
  const shown = criteria.slice(0, 5);

  return (
    <Card
      className="h-fit shadow-[var(--sg-shadow-md)]"
      aria-labelledby="best-method-card-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="best-method-card-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            How we score
          </h2>
          {methodologyVersion ? (
            <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
              Methodology v{methodologyVersion}
            </p>
          ) : null}
        </div>
        {leadScoreApproved && leadScore != null ? (
          <Rating score={leadScore} />
        ) : (
          <Badge variant="warning">Scores pending</Badge>
        )}
      </div>

      {shown.length > 0 ? (
        <>
          <MethodologyRadar labels={shown.map((c) => c.name)} />
          <ul className="mt-4 space-y-2.5">
            {shown.map((c) => (
              <li key={c.slug}>
                <div className="flex items-baseline justify-between gap-2 text-xs text-[var(--sg-color-text-muted)]">
                  <span>{c.name}</span>
                  <span className="tabular-nums">
                    {provisional || !leadScoreApproved ? "—" : ""}
                  </span>
                </div>
                <div
                  className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
                  role="presentation"
                >
                  <div
                    className="h-full w-0 rounded-full bg-[var(--sg-color-primary)]"
                    aria-hidden
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Criterion scores publish when editorial assessments are approved.
        </p>
      )}

      <Link
        href={COMPANY_ROUTES.methodology}
        className="mt-4 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        View full methodology →
      </Link>
      <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
        Affiliate status never sets rankings.{" "}
        <Link
          href={LEGAL_ROUTES.editorialIndependence}
          className="underline underline-offset-2"
        >
          Independence
        </Link>
      </p>
    </Card>
  );
}

/** Decorative radar outline — labels only, no invented scores. */
function MethodologyRadar({ labels }: { labels: string[] }) {
  const n = Math.max(labels.length, 3);
  const points = Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const x = 50 + Math.cos(angle) * 36;
    const y = 50 + Math.sin(angle) * 36;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative mx-auto mt-4 aspect-square w-full max-w-[11rem]">
      <svg viewBox="0 0 100 100" className="size-full text-[var(--sg-color-primary)]" aria-hidden>
        <polygon
          points={points}
          fill="var(--sg-color-primary-soft)"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.85"
        />
        <circle cx="50" cy="50" r="2.5" fill="currentColor" />
      </svg>
      <ul className="pointer-events-none absolute inset-0">
        {labels.slice(0, n).map((label, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          const x = 50 + Math.cos(angle) * 48;
          const y = 50 + Math.sin(angle) * 48;
          return (
            <li
              key={label}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[9px] font-medium leading-tight text-[var(--sg-color-text-muted)]"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {label.split(" ")[0]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
