import { Section } from "@/components/layout/section";
import { ToolCard } from "@/components/tools/hub/tool-card";
import type { ToolsHubModel } from "@/services/tools-hub";

type Props = {
  model: ToolsHubModel;
};

export function FeaturedToolsSection({ model }: Props) {
  const featured = model.featuredTools;
  const comingSoon = model.comingSoonTools.filter((t) => !t.featured);
  const heading = model.activeCategory
    ? `${model.activeCategory.name} interactive tools`
    : "Interactive software tools";
  const subhead = model.activeCategory
    ? `Decision tools scoped to ${model.activeCategory.name.toLowerCase()} — finders, builders, scorecards and cost estimates.`
    : "Turn SoftwareGlimpse recommendations into decisions tailored to your business.";

  return (
    <Section id="interactive-tools" padding="md" background="surface" container="wide">
      <div className="max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          {heading}
        </h2>
        <p className="mt-2 text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
          {subhead}
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {featured.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            decisionPreview={model.decisionPreview}
            calculatorPreview={model.calculatorPreview}
            stackSlots={model.stackSlots}
            className={
              tool.type === "stack-builder" ? "lg:col-span-2" : undefined
            }
          />
        ))}
      </div>

      {comingSoon.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {comingSoon.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              decisionPreview={model.decisionPreview}
              calculatorPreview={model.calculatorPreview}
              stackSlots={model.stackSlots}
            />
          ))}
        </div>
      ) : null}
    </Section>
  );
}
