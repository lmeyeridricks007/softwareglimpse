import Link from "next/link";
import { Check, Funnel } from "lucide-react";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  title: string;
  tagline: string;
  capabilityName: string;
  evaluationDimensions: string[];
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  textLink: { href: string; label: string };
  researchCoverage?: {
    productCount: number;
    evidenceItemCount: number;
    lastUpdated: string | null;
  };
  /** Jump to see-in-action when media exists — no hero iframe. */
  seeInActionHref?: string | null;
  className?: string;
};

const TRUST = [
  "Evidence-backed",
  "Same criteria across products",
  "Affiliate-independent evaluation",
] as const;

export function CapabilityHero({
  eyebrow,
  title,
  tagline,
  capabilityName,
  evaluationDimensions,
  primaryCta,
  secondaryCta,
  textLink,
  researchCoverage,
  seeInActionHref,
  className,
}: Props) {
  return (
    <header
      id="overview"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)] px-5 py-8 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
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
            {seeInActionHref ? (
              <a
                href={seeInActionHref}
                className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                ▶ See product workflows
              </a>
            ) : null}
            <Link
              href={textLink.href}
              className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {withSingleArrow(textLink.label)}
            </Link>
          </div>

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

        <Card className="relative overflow-hidden border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/50 p-5 sm:p-6">
          <Funnel
            className="pointer-events-none absolute -right-3 -bottom-3 size-28 text-[var(--sg-color-primary)]/10"
            aria-hidden
          />
          <p className="relative text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-primary-hover)]">
            {capabilityName}
          </p>
          <p className="relative mt-1 text-xs font-medium text-[var(--sg-color-text-muted)]">
            What we evaluate
          </p>
          <ul className="relative mt-4 space-y-2">
            {evaluationDimensions.slice(0, 7).map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-[var(--sg-color-text)]"
              >
                <Check
                  className="size-4 shrink-0 text-[var(--sg-color-primary)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
          {researchCoverage ? (
            <dl className="relative mt-5 grid grid-cols-2 gap-2 border-t border-[var(--sg-color-border)] pt-4 text-xs text-[var(--sg-color-text-muted)]">
              <div>
                <dt className="font-semibold text-[var(--sg-color-text)]">
                  Products
                </dt>
                <dd>{researchCoverage.productCount}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--sg-color-text)]">
                  Evidence items
                </dt>
                <dd>{researchCoverage.evidenceItemCount}</dd>
              </div>
              {researchCoverage.lastUpdated ? (
                <div className="col-span-2">
                  <dt className="font-semibold text-[var(--sg-color-text)]">
                    Updated
                  </dt>
                  <dd>{researchCoverage.lastUpdated.slice(0, 10)}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
          <Link
            href="#requirements"
            className="relative mt-4 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow("Use these requirements to compare CRM software")}
          </Link>
        </Card>
      </div>
    </header>
  );
}
