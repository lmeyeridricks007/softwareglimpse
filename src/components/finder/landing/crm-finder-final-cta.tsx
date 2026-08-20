import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

type Props = {
  finderHref?: string;
  compareHref?: string;
  calculatorHref: string;
};

export function CrmFinderFinalCta({
  finderHref = "#crm-finder",
  calculatorHref,
}: Props) {
  return (
    <Section padding="md" background="navy" container="wide">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
            Ready to find your CRM?
          </h2>
          <p className="mt-2 text-sm text-white/75">
            Answer a few questions and get a shortlist matched to your business.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
            {["Free", "No signup", "Independent matching"].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-emerald-300" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <ButtonLink href={finderHref} variant="onDark" size="lg">
            Start CRM Finder →
          </ButtonLink>
          <ButtonLink
            href={calculatorHref}
            variant="outline"
            size="lg"
            className="border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
          >
            Calculate CRM costs
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
