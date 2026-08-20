import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CalculatorPreview } from "@/components/tools/hub/calculator-preview";
import {
  ComingSoonCostPreview,
  ComingSoonFinderPreview,
} from "@/components/tools/hub/coming-soon-previews";
import { FinderPreview } from "@/components/tools/hub/finder-preview";
import { StackBuilderPreview } from "@/components/tools/hub/stack-builder-preview";
import {
  ImplementationPlannerPreview,
  MigrationPlannerPreview,
  RequirementsBuilderPreview,
  ScorecardPreview,
} from "@/components/tools/hub/tool-type-previews";
import { ToolIcon } from "@/components/tools/hub/tool-icon";
import { ToolsTrackedButtonLink } from "@/components/tools/hub/tools-tracked-button-link";
import type {
  ToolsHubCalculatorPreview,
  ToolsHubDecisionPreview,
  ToolsHubStackSlot,
  ToolsHubToolCard,
} from "@/services/tools-hub";
import { cn } from "@/lib/cn";
import { siteFoundationConfig } from "@/data/config/site/foundation";

type Props = {
  tool: ToolsHubToolCard;
  decisionPreview: ToolsHubDecisionPreview;
  calculatorPreview: ToolsHubCalculatorPreview;
  stackSlots: ToolsHubStackSlot[];
  className?: string;
};

function toneForTool(
  tool: ToolsHubToolCard,
): "blue" | "emerald" | "violet" | "orange" | "sky" | "fuchsia" {
  if (tool.status === "coming-soon") {
    return tool.type === "calculator" ? "orange" : "violet";
  }
  if (tool.type === "calculator") return "emerald";
  if (tool.type === "stack-builder") return "violet";
  if (tool.type === "scorecard" || tool.type === "builder") return "sky";
  if (tool.slug === "crm-migration-planner") return "fuchsia";
  if (tool.type === "planner") return "sky";
  return "blue";
}

export function ToolCard({
  tool,
  decisionPreview,
  calculatorPreview,
  stackSlots,
  className,
}: Props) {
  const tone = toneForTool(tool);
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;
  const notifyHref = newsletterEnabled ? "#newsletter" : null;

  const preview =
    tool.previewKind === "finder" ? (
      <FinderPreview preview={decisionPreview} />
    ) : tool.previewKind === "calculator" ? (
      <CalculatorPreview preview={calculatorPreview} />
    ) : tool.previewKind === "stack" ? (
      <StackBuilderPreview slots={stackSlots} />
    ) : tool.previewKind === "builder" ? (
      <RequirementsBuilderPreview />
    ) : tool.previewKind === "scorecard" ? (
      <ScorecardPreview />
    ) : tool.previewKind === "implementation" ? (
      <ImplementationPlannerPreview />
    ) : tool.previewKind === "migration" ? (
      <MigrationPlannerPreview />
    ) : tool.type === "calculator" ? (
      <ComingSoonCostPreview />
    ) : (
      <ComingSoonFinderPreview />
    );

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]",
        tool.status === "coming-soon" && "opacity-[0.96]",
        className,
      )}
    >
      <div className="grid flex-1 gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_minmax(11rem,13rem)]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ToolIcon icon={tool.icon} tone={tone} />
            {tool.popular ? (
              <Badge variant="primary">Most popular</Badge>
            ) : null}
            {tool.status === "coming-soon" ? (
              <Badge variant="warning">Coming soon</Badge>
            ) : null}
            {(tool.categoryLabels.length > 0
              ? tool.categoryLabels
              : tool.categoryLabel
                ? [tool.categoryLabel]
                : []
            ).map((label) => (
              <Badge key={label} variant="neutral">
                {label}
              </Badge>
            ))}
          </div>

          <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
            {tool.name}
          </h3>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            {tool.longDescription}
          </p>

          <ul className="mt-4 space-y-1.5">
            {tool.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {feature}
              </li>
            ))}
          </ul>

          {tool.availabilityNote ? (
            <p className="mt-3 text-xs font-medium text-[var(--sg-color-text-muted)]">
              {tool.availabilityNote}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {tool.isInteractive && tool.href ? (
              <>
                <ToolsTrackedButtonLink
                  href={tool.href}
                  size="md"
                  toolId={tool.id}
                  toolType={tool.type}
                  category={tool.categorySlugs[0]}
                  sourceSection="featured_tools"
                  event="tool_start"
                  className={cn(
                    tone === "emerald" &&
                      "bg-emerald-600 hover:bg-emerald-700",
                    tone === "violet" && "bg-violet-600 hover:bg-violet-700",
                  )}
                >
                  {tool.primaryCta}
                </ToolsTrackedButtonLink>
                {tool.secondaryCta && tool.secondaryHref ? (
                  <ButtonLink href={tool.secondaryHref} variant="ghost" size="md">
                    {tool.secondaryCta}
                  </ButtonLink>
                ) : null}
              </>
            ) : notifyHref ? (
              <ButtonLink href={notifyHref} variant="outline" size="md">
                {tool.primaryCta}
              </ButtonLink>
            ) : (
              <span className="inline-flex h-10 cursor-not-allowed items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 text-sm font-medium text-[var(--sg-color-text-muted)]">
                {tool.primaryCta}
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 self-start">{preview}</div>
      </div>
    </article>
  );
}
