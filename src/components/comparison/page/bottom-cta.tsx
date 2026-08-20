import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { ComparisonPageModel } from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
  className?: string;
};

export function ComparisonBottomCta({ model, className }: Props) {
  return (
    <section
      className={
        className ??
        "rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-navy)] px-6 py-10 text-white shadow-[var(--sg-shadow-md)] sm:px-10"
      }
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_auto] lg:gap-12">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold">
            Still deciding between {model.productA.name} and{" "}
            {model.productB.name}?
          </h2>
          <p className="mt-3 max-w-xl text-base text-white/80">
            Use {model.finderLabel} for a shortlist matched to your priorities, or
            build another side-by-side comparison.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={model.finderHref} variant="onDark" size="lg">
              {model.finderLabel}
              <ArrowRight className="ml-1 size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink
              href="/compare/"
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
            >
              Compare another
            </ButtonLink>
          </div>
        </div>
        <ul className="space-y-3 text-sm text-white/90">
          {[
            "Independent criterion outcomes",
            "No invented scores or prices",
            "Affiliate links never change winners",
          ].map((label) => (
            <li key={label} className="flex items-center gap-2.5">
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-[var(--sg-color-success)]/90">
                <Check className="size-3" aria-hidden />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
