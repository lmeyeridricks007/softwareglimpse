import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

type Props = { className?: string };

export function CompareFinalCta({ className }: Props) {
  return (
    <Section padding="lg" background="navy" container="wide" className={className}>
      <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_auto] lg:gap-12">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.5vw,2rem)] font-semibold text-white">
            Ready to compare software?
          </h2>
          <p className="mt-3 max-w-xl text-base text-white/80">
            Pick two products and compare them on the same criteria — or browse
            published comparisons as research is completed.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="#comparison-builder" variant="onDark" size="lg">
              Compare software
              <ArrowRight className="ml-1 size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink
              href="/software/"
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
            >
              Browse software
            </ButtonLink>
          </div>
        </div>
        <ul className="space-y-3 text-sm text-white/90">
          {[
            "Free to use",
            "No signup required",
            "Affiliate-independent conclusions",
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
    </Section>
  );
}
