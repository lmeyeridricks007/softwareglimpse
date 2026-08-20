import Link from "next/link";
import { CheckCircle2, ChevronRight, FileText, Lightbulb, Settings2 } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

export type IndustrySidebarGuide = {
  href: string;
  label: string;
};

export type IndustrySidebarComparison = {
  href: string;
  title: string;
  products: Array<{ name: string; logo?: { src: string; alt: string } | null }>;
};

type Props = {
  guides?: IndustrySidebarGuide[];
  comparisons?: IndustrySidebarComparison[];
  finderHref?: string;
  className?: string;
};

export function IndustrySidebar({
  guides = [],
  comparisons = [],
  finderHref = "/tools/crm-finder/",
  className,
}: Props) {
  return (
    <aside className={cn("space-y-5", className)}>
      {guides.length > 0 ? (
        <Card aria-labelledby="industry-guides-heading">
          <h2
            id="industry-guides-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Popular industry guides
          </h2>
          <ul className="mt-3 space-y-2">
            {guides.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-start gap-2 text-sm text-[var(--sg-color-text-muted)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
                >
                  <FileText
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                    aria-hidden
                  />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/guides/"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all guides
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Card>
      ) : null}

      {comparisons.length > 0 ? (
        <Card aria-labelledby="industry-compare-heading">
          <h2
            id="industry-compare-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Top industry comparisons
          </h2>
          <ul className="mt-3 space-y-3">
            {comparisons.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group block">
                  <span className="flex items-center gap-1">
                    {item.products.slice(0, 2).map((p) => (
                      <ProductLogo
                        key={p.name}
                        name={p.name}
                        logo={p.logo}
                        size="sm"
                      />
                    ))}
                  </span>
                  <span className="mt-1.5 block text-sm font-medium text-[var(--sg-color-text)] underline-offset-2 group-hover:underline">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/compare/"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all comparisons
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Card>
      ) : null}

      <Card
        className="border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/60"
        aria-labelledby="industry-finder-heading"
      >
        <h2
          id="industry-finder-heading"
          className="text-sm font-semibold text-[var(--sg-color-text)]"
        >
          Not sure which CRM fits?
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Answer structured questions for a deterministic shortlist.
        </p>
        <ButtonLink href={finderHref} className="mt-4 w-full justify-center">
          Try CRM Finder
        </ButtonLink>
        <p className="mt-2 text-center text-xs text-[var(--sg-color-text-muted)]">
          Takes a few minutes · no signup required
        </p>
      </Card>

      <NewsletterCard source="article-inline" />
    </aside>
  );
}

export function IndustryResearchCallout({
  className,
}: {
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex gap-3">
        <Lightbulb
          className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-primary)]"
          aria-hidden
        />
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          <span className="font-medium text-[var(--sg-color-text)]">
            Every industry has unique needs.
          </span>{" "}
          We only claim industry fit when research supports it. Until then,
          compare using broader CRM research.
        </p>
      </div>
      <Link
        href={COMPANY_ROUTES.howWeReview}
        className="shrink-0 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        How we recommend industries →
      </Link>
    </aside>
  );
}

export function IndustryMissingBanner({
  className,
}: {
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex gap-3">
        <Settings2
          className="mt-0.5 size-6 shrink-0 text-[var(--sg-color-success)]"
          aria-hidden
        />
        <div>
          <p className="font-semibold text-[var(--sg-color-text)]">
            Don’t see your industry?
          </p>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Tell us which vertical you need — we expand hubs when there is
            enough catalogue and research coverage.
          </p>
        </div>
      </div>
      <ButtonLink
        href={`${COMPANY_ROUTES.contact}?reason=general`}
        className="shrink-0 bg-[var(--sg-color-success)] hover:opacity-90"
      >
        Contact us →
      </ButtonLink>
    </aside>
  );
}

const BENEFITS = [
  {
    title: "Built for your workflows",
    body: "Prioritize tools that match how your industry actually sells and serves.",
  },
  {
    title: "Industry best practices",
    body: "Use shared criteria — not vendor marketing — when you compare options.",
  },
  {
    title: "Compliance awareness",
    body: "We only claim compliance fit when verified evidence exists.",
  },
  {
    title: "Clearer shortlists",
    body: "Start from industry context, then refine with Finder and comparisons.",
  },
] as const;

export function IndustryBenefits({ className }: { className?: string }) {
  return (
    <section
      className={cn(className)}
      aria-labelledby="industry-benefits-heading"
    >
      <h2
        id="industry-benefits-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Benefits of industry-specific CRM solutions
      </h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((item) => (
          <li key={item.title} className="flex gap-2">
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-success)]"
              aria-hidden
            />
            <div>
              <p className="font-semibold text-[var(--sg-color-text)]">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
