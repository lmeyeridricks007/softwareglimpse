import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

type Props = {
  calculatorHref: string;
};

export function CrmFinderCalculatorCta({ calculatorHref }: Props) {
  return (
    <Section padding="md" background="tint" container="wide">
      <div className="grid items-center gap-6 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-6 shadow-[var(--sg-shadow-sm)] lg:grid-cols-[1.2fr_1fr_auto] lg:p-8">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)] sm:text-2xl">
            Know your shortlist? Calculate what it will actually cost.
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Use public pricing to estimate monthly CRM costs for your
            team size.
          </p>
        </div>

        <div
          className="grid gap-3 rounded-[var(--sg-radius-md)] border border-emerald-200/80 bg-emerald-50/50 p-4 sm:grid-cols-2"
          aria-hidden
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800/70">
              Team size
            </p>
            <p className="mt-1 rounded-[var(--sg-radius-sm)] border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold">
              25
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800/70">
              Estimated monthly
            </p>
            <p className="mt-1 rounded-[var(--sg-radius-sm)] border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700">
              Open calculator
            </p>
          </div>
        </div>

        <ButtonLink href={calculatorHref} size="lg" className="justify-self-start lg:justify-self-end">
          Compare CRM costs →
        </ButtonLink>
      </div>
    </Section>
  );
}
