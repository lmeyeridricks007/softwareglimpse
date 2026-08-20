import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  className?: string;
};

export function BestSoftwareCostCalculatorCta({
  title,
  description,
  href,
  ctaLabel,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-7 sm:px-8",
        className,
      )}
    >
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)] sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        {description}
      </p>
      <ButtonLink href={href} className="mt-5" size="lg">
        {ctaLabel} →
      </ButtonLink>
    </div>
  );
}
