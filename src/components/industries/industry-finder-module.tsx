import Link from "next/link";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { ButtonLink } from "@/components/ui/button";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

type Props = {
  title?: string;
  description?: string;
  finderHref?: string;
  industryLabel?: string;
  className?: string;
};

const STEPS = [
  { n: 1, label: "Team size" },
  { n: 2, label: "Primary workflow" },
  { n: 3, label: "Required capabilities" },
  { n: 4, label: "Budget" },
] as const;

export function IndustryFinderModule({
  title,
  description = "Answer a few questions about your team, requirements, integrations and budget to create a personalized shortlist.",
  finderHref = "/tools/crm-finder/",
  industryLabel,
  className,
}: Props) {
  const heading =
    title ??
    (industryLabel
      ? `Which CRM fits your ${industryLabel.toLowerCase()} team?`
      : "Which CRM fits your team?");

  return (
    <section
      id="finder"
      aria-labelledby="finder-heading"
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-primary-soft)] px-5 py-8 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2
            id="finder-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            {heading}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
            {description}
          </p>
          <ol className="mt-5 flex flex-wrap gap-2">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="inline-flex items-center gap-2 rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1.5 text-sm"
              >
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-[10px] font-bold text-white">
                  {step.n}
                </span>
                {step.label}
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <ButtonLink href={finderHref} size="lg">
              {withSingleArrow("Start CRM Finder")}
            </ButtonLink>
            <Link
              href={COMPANY_ROUTES.howWeReview}
              className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              How recommendations work
            </Link>
          </div>
        </div>

        <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Personalized shortlist
          </p>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Finder uses structured answers and CRM evidence — not
            affiliate incentives — to build your shortlist.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--sg-color-text)]">
            <li className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-3 py-2">
              Match on team size & workflow
            </li>
            <li className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-3 py-2">
              Filter by required capabilities
            </li>
            <li className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-3 py-2">
              Respect budget bands when provided
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
