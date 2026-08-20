"use client";

import { WorkflowExperience } from "@/components/workflow/workflow-experience";
import type { WorkflowExperienceModel } from "@/services/workflow-experience";
import type { IndustryHubModel } from "@/services/industry-hub";
import { cn } from "@/lib/cn";

type Props = {
  /** Prefer the enriched workflow experience model from the hub builder. */
  model?: WorkflowExperienceModel | null;
  /** Legacy fallback — simple step list without media (avoid when model exists). */
  steps?: IndustryHubModel["workflowSteps"];
  workflowVisual?: IndustryHubModel["workflowVisual"];
  industryLabel?: string;
  className?: string;
};

/**
 * Industry page workflow experience.
 *
 * Leads with the industry content-model workflow, then optional product
 * examples via media drawer. No industry-specific terms hardcoded here —
 * all labels/steps come from the model.
 *
 * Reuses shared <WorkflowExperience /> (same pattern as Use Case hubs).
 */
export function IndustryWorkflow({
  model,
  steps,
  workflowVisual,
  industryLabel = "this industry",
  className,
}: Props) {
  if (model && (model.steps.length > 0 || model.visual)) {
    // Industry hubs already render official demos in #see-in-industry.
    // Strip media cues here so we do not serialize/hydrate duplicate players.
    const hasMediaCues = model.steps.some((s) => s.mediaCues.length > 0);
    const workflowOnly = hasMediaCues
      ? {
          ...model,
          steps: model.steps.map((step) => ({ ...step, mediaCues: [] })),
        }
      : model;
    return (
      <div className={cn(className)}>
        <WorkflowExperience model={workflowOnly} sectionId="workflow" />
        {hasMediaCues ? (
          <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
            <a
              href="#see-in-industry"
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              See how vendors support these workflows ↓
            </a>
          </p>
        ) : null}
      </div>
    );
  }

  // Legacy / zero-enrichment fallback — still content-model driven
  if ((!steps || steps.length === 0) && !workflowVisual) return null;

  return (
    <WorkflowExperience
      className={className}
      sectionId="workflow"
      model={{
        title: `How CRM is used in ${industryLabel.toLowerCase()}`,
        supporting:
          "Understand this industry’s operating loop before comparing product implementations.",
        steps: (steps ?? []).map((step) => ({
          id: step.id,
          label: step.label,
          detail: step.detail,
          goal: step.goal ?? step.detail,
          useCases: [],
          capabilities: [],
          requirements: [],
          features: [],
          mediaCues: [],
          productSupport: {},
        })),
        products: [],
        visual: workflowVisual ?? null,
      }}
    />
  );
}
