import { Check } from "lucide-react";
import { ToolDecisionPreview } from "@/components/tools/hub/tool-decision-preview";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import type { ToolsHubModel } from "@/services/tools-hub";
import { cn } from "@/lib/cn";

const TRUST = [
  "Evidence-backed recommendations",
  "Affiliate-independent results",
  "Based on the same data as our reviews",
] as const;

type Props = {
  model: ToolsHubModel;
  className?: string;
};

export function ToolsHero({ model, className }: Props) {
  const { hero } = model;

  return (
    <Section
      padding="md"
      background="surface"
      container="wide"
      className={cn("relative", className)}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgb(37_99_235/0.10),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgb(16_185_129/0.06),transparent_45%)]"
        aria-hidden
      />
      <div className="relative grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            {hero.eyebrow}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-display)] font-bold leading-[var(--sg-leading-tight)] tracking-tight text-[var(--sg-color-navy)]">
            {hero.titleLead}{" "}
            <span className="text-[var(--sg-color-primary)]">
              {hero.titleAccent}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {hero.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {model.primaryFinder.exists ? (
              <ButtonLink href={model.primaryFinder.href} size="lg">
                {model.primaryFinder.label}
              </ButtonLink>
            ) : null}
            <ButtonLink href="#explore-tools" variant="outline" size="lg">
              {hero.exploreLabel}
            </ButtonLink>
          </div>

          <ul className="mt-6 space-y-2">
            {TRUST.map((label) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-[var(--sg-color-text)]"
              >
                <Check
                  className="size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <ToolDecisionPreview preview={model.decisionPreview} />
      </div>
    </Section>
  );
}
