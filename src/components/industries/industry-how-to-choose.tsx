import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { isPageDetailHref } from "@/components/industries/detail-href";
import { cn } from "@/lib/cn";
import Link from "next/link";

type Step = {
  step: number;
  title: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
};

type Props = {
  title: string;
  steps: Step[];
  guideHref?: string | null;
  className?: string;
};

export function IndustryHowToChoose({
  title,
  steps,
  guideHref,
  className,
}: Props) {
  if (steps.length === 0) return null;

  return (
    <section
      id="how-to-choose"
      aria-labelledby="how-to-choose-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="how-to-choose-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ol className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => (
          <li
            key={step.step}
            className="relative rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
          >
            {index < steps.length - 1 ? (
              <span
                className="absolute top-8 -right-2 hidden h-px w-4 bg-[var(--sg-color-border)] lg:block"
                aria-hidden
              />
            ) : null}
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-sm font-semibold text-white">
              {step.step}
            </span>
            <p className="mt-3 text-sm font-semibold text-[var(--sg-color-text)]">
              {step.title}
            </p>
            {step.description ? (
              <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                {step.description}
              </p>
            ) : null}
            {step.href && isPageDetailHref(step.href) ? (
              <Link
                href={step.href}
                className="mt-3 inline-block text-xs font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {withSingleArrow(step.ctaLabel ?? "Learn more")}
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
      {guideHref ? (
        <p className="mt-5 text-sm">
          <Link
            href={guideHref}
            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow("Read the full buying guide")}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
