import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Props = {
  title?: string;
  description?: string;
  finderHref?: string;
  compareHref?: string;
  /** Prefills industry in CRM Requirements Builder when provided. */
  requirementsHref?: string;
  className?: string;
};

export function IndustryFinalCta({
  title = "Ready to find the right CRM?",
  description = "Compare catalogue CRM products based on your team size, requirements, integrations and budget.",
  finderHref = "/tools/crm-finder/",
  compareHref = "/compare/",
  requirementsHref = "/tools/crm-requirements-builder/?start=1",
  className,
}: Props) {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-primary-soft)] px-5 py-8 text-center sm:px-8 sm:py-10",
        className,
      )}
    >
      <h2
        id="final-cta-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href={finderHref} size="lg">
          Find My CRM
        </ButtonLink>
        <ButtonLink href={compareHref} variant="outline" size="lg">
          Compare CRM Software
        </ButtonLink>
        <ButtonLink href={requirementsHref} variant="outline" size="lg">
          Build my requirements
        </ButtonLink>
      </div>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-[var(--sg-color-text-muted)]">
        {[
          "Free to use",
          "No signup required",
          "Independent recommendation model",
        ].map((label) => (
          <li key={label} className="inline-flex items-center gap-1.5">
            <Check
              className="size-4 text-[var(--sg-color-success)]"
              aria-hidden
            />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
