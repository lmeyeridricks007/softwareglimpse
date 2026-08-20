import { ButtonLink } from "@/components/ui/button";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  buyingGuide: NonNullable<BestPageModel["buyingGuide"]>;
  className?: string;
};

export function BestSoftwareBuyingGuide({ buyingGuide, className }: Props) {
  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {buyingGuide.heading}
      </h2>
      <ol className="mt-5 space-y-4">
        {buyingGuide.steps.map((step) => (
          <li
            key={step.step}
            className="flex gap-4 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-sm font-semibold text-white">
              {step.step}
            </span>
            <div>
              <p className="font-semibold text-[var(--sg-color-text)]">
                {step.title}
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
      {buyingGuide.guideHref ? (
        <div className="mt-6">
          <ButtonLink href={buyingGuide.guideHref}>
            {buyingGuide.guideLabel ?? "Read the full buying guide"}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
