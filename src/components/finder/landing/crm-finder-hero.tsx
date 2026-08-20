import { Check, Clock } from "lucide-react";
import { FinderShortlistPreview } from "@/components/finder/finder-shortlist-preview";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { crmFinderDefinition } from "@/components/finder/framework";
import type { CrmFinderSamplePreview } from "@/services/crm-finder-landing/sample-preview";
import { cn } from "@/lib/cn";

const TRUST = [
  "Free to use",
  "No signup required",
  "Affiliate-independent matching",
] as const;

type Props = {
  samplePreview: CrmFinderSamplePreview;
  className?: string;
};

export function CrmFinderHero({ samplePreview, className }: Props) {
  return (
    <Section
      padding="md"
      background="surface"
      container="wide"
      className={cn("relative", className)}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgb(37_99_235/0.10),transparent_55%),radial-gradient(ellipse_at_90%_20%,rgb(14_165_233/0.06),transparent_45%)]"
        aria-hidden
      />
      <div className="relative grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            CRM software finder
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-display)] font-bold leading-[var(--sg-leading-tight)] tracking-tight text-[var(--sg-color-navy)]">
            Find the right CRM for your business
          </h1>
          <p className="mt-4 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Answer a few questions about your team, requirements and budget.
            SoftwareGlimpse will compare your needs against our structured CRM
            research and build a personalized shortlist.
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
            {TRUST.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--sg-color-text)]"
              >
                <Check
                  className="size-4 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="#crm-finder" size="lg">
              Start finding my CRM →
            </ButtonLink>
            <ButtonLink href="#how-matching-works" variant="outline" size="lg">
              See how matching works
            </ButtonLink>
          </div>

          <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--sg-color-text-muted)]">
            <Clock className="size-3.5" aria-hidden />
            Takes about {crmFinderDefinition.estimatedMinutes}
          </p>
        </div>

        <FinderShortlistPreview preview={samplePreview} />
      </div>
    </Section>
  );
}
