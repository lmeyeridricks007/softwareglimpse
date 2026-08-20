import Link from "next/link";
import { ArrowRight, RefreshCw, Scale, ShieldCheck } from "lucide-react";
import { BestDecisionPreview } from "@/components/best/hub/best-decision-preview";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import type { BestHubModel } from "@/services/best-hub";
import { cn } from "@/lib/cn";

type Props = {
  model: BestHubModel;
  className?: string;
};

const TRUST = [
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
] as const;

export function BestSoftwareHero({ model, className }: Props) {
  const { featured, finder, pages, filterCategories } = model;

  const previewOrder = [
    "crm",
    "project-management",
    "marketing",
    "customer-service",
    "sales-intelligence",
    "hr",
  ];
  const bySlug = new Map(filterCategories.map((c) => [c.slug, c]));
  const previewCategories = previewOrder
    .map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .slice(0, 4) as typeof filterCategories;

  const decisionPaths = [
    ...pages.map((p) => ({ title: p.title, href: p.href })),
    ...previewCategories
      .filter((c) => !pages.some((p) => p.categorySlug === c.slug))
      .slice(0, 3)
      .map((c) => {
        const shortName = c.name.split("&")[0]!.trim();
        return {
          title: `Best ${shortName} Software`,
          href: c.hasBestPage
            ? (pages.find((p) => p.categorySlug === c.slug)?.href ?? c.href)
            : c.href,
        };
      }),
  ].slice(0, 4);

  return (
    <Section
      padding="md"
      background="surface"
      container="wide"
      className={cn("relative", className)}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgb(37_99_235/0.10),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgb(59_130_246/0.07),transparent_45%)]"
        aria-hidden
      />
      <div className="relative grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Software buying guides
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-display)] font-bold leading-[var(--sg-leading-tight)] tracking-tight text-[var(--sg-color-navy)]">
            Find the best software for your business
          </h1>
          <p className="mt-4 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Research-backed recommendations for different teams, needs and
            budgets. We evaluate and compare so you can choose with confidence.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="#browse-best" size="lg">
              Browse all categories
            </ButtonLink>
            {finder.exists ? (
              <ButtonLink href={finder.href} variant="outline" size="lg">
                {finder.label}
              </ButtonLink>
            ) : null}
          </div>

          <ul className="mt-6 grid gap-2 sm:grid-cols-3">
            {TRUST.map(({ label, Icon, tone }) => (
              <li
                key={label}
                className="flex items-start gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3.5 py-3 shadow-[var(--sg-shadow-sm)]"
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

          <Link
            href={COMPANY_ROUTES.methodology}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            How we rank software
            <ArrowRight className="size-4" aria-hidden />
          </Link>

          <p className="mt-4 max-w-xl text-xs text-[var(--sg-color-text-muted)]">
            Our recommendations are editorially independent. We may earn a
            commission from some links.{" "}
            <Link
              href={LEGAL_ROUTES.affiliateDisclosure}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              How we make money
            </Link>
          </p>
        </div>

        <BestDecisionPreview
          featured={featured}
          previewCategories={previewCategories}
          decisionPaths={decisionPaths}
          finderHref={finder.exists ? finder.href : null}
          finderLabel={finder.label}
        />
      </div>
    </Section>
  );
}
