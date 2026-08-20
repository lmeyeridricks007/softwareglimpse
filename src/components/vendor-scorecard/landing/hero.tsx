import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/cn";

const TRUST = [
  "Your requirements",
  "Evidence-backed product research",
  "Your evaluation stays separate",
  "Affiliate-independent",
] as const;

export function CrmVendorScorecardHero({ className }: { className?: string }) {
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
            CRM vendor scorecard
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-display)] font-bold leading-[var(--sg-leading-tight)] tracking-tight text-[var(--sg-color-navy)]">
            Compare CRM vendors against what matters to you
          </h1>
          <p className="mt-4 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Evaluate shortlisted CRM products using your requirements,
            SoftwareGlimpse recommendations and your own demo or trial observations.
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
            <ButtonLink href="#scorecard-experience" size="lg">
              Create my scorecard
            </ButtonLink>
            <ButtonLink
              href="#scorecard-experience"
              variant="outline"
              size="lg"
            >
              Load requirements profile
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Your scorecard
          </p>
          <div className="mt-4">
            <p className="text-xs font-semibold text-[var(--sg-color-text-muted)]">
              Products
            </p>
            <ul className="mt-1 space-y-1 text-sm text-[var(--sg-color-text)]">
              <li>HubSpot</li>
              <li>Pipedrive</li>
              <li>Salesforce</li>
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-[var(--sg-color-text-muted)]">
              Criteria
            </p>
            <ul className="mt-1 flex flex-wrap gap-2 text-sm text-[var(--sg-color-text)]">
              {[
                "Pipeline",
                "Automation",
                "Reporting",
                "Integrations",
                "Security",
                "Cost",
              ].map((c) => (
                <li
                  key={c}
                  className="rounded-full bg-[var(--sg-color-surface-muted)] px-2.5 py-0.5 text-xs"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-5 text-sm font-medium text-[var(--sg-color-text-muted)]">
            Status: Not yet evaluated
          </p>
        </div>
      </div>
    </Section>
  );
}
