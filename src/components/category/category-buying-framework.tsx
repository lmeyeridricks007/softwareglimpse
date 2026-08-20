import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type BuyingStep = {
  step: number;
  title: string;
  description?: string;
};

type Props = {
  title: string;
  steps: BuyingStep[];
  guideHref?: string;
  guideLabel?: string;
  className?: string;
};

export function CategoryBuyingFramework({
  title,
  steps,
  guideHref,
  guideLabel,
  className,
}: Props) {
  if (steps.length === 0) return null;

  return (
    <section
      id="how-to-choose"
      aria-labelledby="buying-framework-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="buying-framework-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {steps.map((step) => (
          <li
            key={step.step}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
          >
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
          </li>
        ))}
      </ol>
      {guideHref ? (
        <div className="mt-6">
          <ButtonLink href={guideHref}>
            {withSingleArrow(guideLabel ?? "Read the complete buying guide")}
          </ButtonLink>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
          <Link href="/guides/" className="text-[var(--sg-color-primary)]">
            {withSingleArrow("Browse guides")}
          </Link>
        </p>
      )}
    </section>
  );
}
