import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/home/section-header";
import type { BestHubModel } from "@/services/best-hub";
import { cn } from "@/lib/cn";

type Props = {
  journey: NonNullable<BestHubModel["decisionJourney"]>;
  className?: string;
};

const STEPS = [
  { key: "browse", label: "Browse" },
  { key: "shortlist", label: "Shortlist" },
  { key: "personalize", label: "Personalize" },
  { key: "compare", label: "Compare" },
  { key: "decide", label: "Decide" },
] as const;

export function BestDecisionJourney({ journey, className }: Props) {
  return (
    <Section padding="md" background="muted" container="wide" className={className}>
      <SectionHeader
        title="From Best guide to a confident decision"
        description="Best guides give you the shortlist. Finder helps personalize it."
      />
      <ol className="grid gap-3 md:grid-cols-5">
        {STEPS.map((step, index) => (
          <li key={step.key} className="relative">
            <div
              className={cn(
                "flex h-full flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                {step.label}
              </p>
              {step.key === "browse" ? (
                <Link
                  href={journey.bestHref}
                  className="mt-2 text-sm font-semibold text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                >
                  {journey.bestTitle}
                </Link>
              ) : null}
              {step.key === "shortlist" ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {journey.shortlist.map((p) => (
                    <li key={p.slug} title={p.name}>
                      <ProductLogo name={p.name} logo={p.logo} size="sm" />
                    </li>
                  ))}
                </ul>
              ) : null}
              {step.key === "personalize" ? (
                <Link
                  href={journey.finderHref}
                  className="mt-2 text-sm font-semibold text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                >
                  CRM Finder
                </Link>
              ) : null}
              {step.key === "compare" ? (
                <Link
                  href={journey.compareHref}
                  className="mt-2 text-sm font-semibold text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                >
                  Product vs product
                </Link>
              ) : null}
              {step.key === "decide" ? (
                <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                  Review · vendor visit
                </p>
              ) : null}
            </div>
            {index < STEPS.length - 1 ? (
              <ArrowDown
                className="mx-auto my-1 size-4 text-[var(--sg-color-primary)] md:hidden"
                aria-hidden
              />
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
