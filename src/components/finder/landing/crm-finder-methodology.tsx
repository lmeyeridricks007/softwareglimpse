import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Section } from "@/components/layout/section";
import type { CrmFinderLandingModel } from "@/services/crm-finder-landing/build-landing-model";

type Props = {
  model: CrmFinderLandingModel;
};

export function CrmFinderMethodology({ model }: Props) {
  const flow = [
    "Your answers",
    "Matching model",
    "SoftwareGlimpse recommendations",
    "Fit score",
    "Shortlist",
  ];

  return (
    <Section
      id="how-matching-works"
      padding="md"
      background="tint"
      container="wide"
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
        How CRM matching works
      </h2>
      <p className="mt-3 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Finder scoring uses structured factors such as use-case fit, required
        capabilities, business and team size, integrations, setup preference,
        and budget where reliable public pricing exists. Unknown capabilities
        reduce confidence — they are never treated as supported.
      </p>

      <ol className="mt-8 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        {flow.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span className="inline-flex min-h-11 items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 text-sm font-semibold text-[var(--sg-color-text)] shadow-[var(--sg-shadow-sm)]">
              {label}
            </span>
            {i < flow.length - 1 ? (
              <ArrowDown
                className="size-4 shrink-0 text-[var(--sg-color-primary)] sm:-rotate-90"
                aria-hidden
              />
            ) : null}
          </li>
        ))}
      </ol>

      <p className="mt-6 text-sm font-medium text-[var(--sg-color-text)]">
        Affiliate relationships do not influence Finder rankings.
      </p>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <li>
          <Link
            href={model.methodologyHref}
            className="font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View full Finder methodology →
          </Link>
        </li>
        <li>
          <Link
            href={model.affiliateDisclosureHref}
            className="font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Affiliate disclosure →
          </Link>
        </li>
      </ul>
    </Section>
  );
}
