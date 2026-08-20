import { ArrowRight, Check, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

type Props = {
  finderHref?: string;
  className?: string;
};

export function GuidesFinalDecisionCta({
  finderHref = "/tools/crm-finder/",
  className,
}: Props) {
  return (
    <Section
      padding="lg"
      background="navy"
      container="wide"
      className={className}
    >
      <div className="grid items-center gap-8 lg:grid-cols-[7.5rem_minmax(0,1fr)_minmax(14rem,18rem)] lg:gap-12">
        <div
          className="mx-auto flex size-24 items-center justify-center rounded-[1.5rem] bg-white/10 ring-1 ring-white/15 lg:mx-0 lg:size-28"
          aria-hidden
        >
          <div className="relative">
            <Search className="size-12 text-white/90" />
            <span className="absolute -bottom-1 -right-2 rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-semibold text-white">
              Guide
            </span>
          </div>
        </div>

        <div className="text-center lg:text-left">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.5vw,2rem)] font-semibold text-white">
            Still not sure which software to choose?
          </h2>
          <p className="mt-3 max-w-xl text-base text-white/80 lg:mx-0 mx-auto">
            Tell us what your business needs and use SoftwareGlimpse recommendations to
            narrow the options.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <ButtonLink href={finderHref} variant="onDark" size="lg">
              Find My Software
              <ArrowRight className="ml-1 size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink
              href="/software/"
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
            >
              Browse Software
            </ButtonLink>
          </div>
        </div>

        <ul className="mx-auto space-y-3 text-sm text-white/90 lg:mx-0">
          {[
            "Free to use",
            "No vendor determines your result",
            "Evidence-backed recommendations",
          ].map((label) => (
            <li key={label} className="flex items-center gap-2.5">
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-success)]/90 text-white">
                <Check className="size-3" aria-hidden />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
