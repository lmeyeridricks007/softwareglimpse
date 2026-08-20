import type { IndustryHubProfile } from "@/domain";
import {
  resolveIndustryMediaContext,
  industryMediaContextLabel,
  type IndustrySeeInActionCard,
} from "@/services/product-media/industry-page-media";
import {
  buildWorkflowExperienceModel,
  requirementHrefOrFallback,
  type WorkflowExperienceModel,
  type WorkflowLink,
  type WorkflowProductOption,
} from "@/services/workflow-experience";
import { resolveFeatureDetailHref } from "@/data/feature-detail";
import { canonicalFeaturesSeed } from "@/data/seed/features";

function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function featureLabel(slug: string): string {
  return (
    canonicalFeaturesSeed.find((f) => f.slug === slug)?.name ??
    titleCaseSlug(slug)
  );
}

/**
 * Resolve industry workflow steps into WorkflowExperience links.
 * Uses content-model enrichment on each step; never hardcodes industry terms.
 */
export function resolveIndustryWorkflowStepLinks(input: {
  industrySlug: string;
  step: IndustryHubProfile["workflowSteps"][number];
  profileUseCases: IndustryHubProfile["useCases"];
  profilePriorities: IndustryHubProfile["priorities"];
}): {
  useCases: WorkflowLink[];
  capabilities: WorkflowLink[];
  requirements: WorkflowLink[];
  features: WorkflowLink[];
} {
  const { industrySlug, step, profileUseCases, profilePriorities } = input;

  const useCases: WorkflowLink[] = (step.useCaseSlugs ?? [])
    .map((slug) => {
      const match = profileUseCases.find(
        (u) => u.useCaseSlug === slug || u.id === slug,
      );
      return {
        id: slug,
        label: match?.title ?? titleCaseSlug(slug),
        href: `/industries/${industrySlug}/use-cases/${slug}/`,
      };
    })
    .filter((u) => Boolean(u.id));

  const capabilities: WorkflowLink[] = (step.capabilitySlugs ?? []).map(
    (slug) => {
      const match = profilePriorities.find((p) => p.capabilitySlug === slug);
      return {
        id: slug,
        label: match?.title ?? titleCaseSlug(slug),
        href: `/industries/${industrySlug}/capabilities/${slug}/`,
      };
    },
  );

  const requirements: WorkflowLink[] = (step.requirementSlugs ?? []).map(
    (slug) => ({
      id: slug,
      label: titleCaseSlug(slug),
      href: requirementHrefOrFallback(slug),
      priority: "important" as const,
    }),
  );

  const features: WorkflowLink[] = (step.featureSlugs ?? []).map((slug) => ({
    id: slug,
    label: featureLabel(slug),
    href: resolveFeatureDetailHref(slug),
  }));

  return { useCases, capabilities, requirements, features };
}

/**
 * Build Industry hub WorkflowExperience from profile workflowSteps + media.
 * Workflow content always leads; demos are optional cues opened in a drawer.
 */
export function buildIndustryWorkflowExperience(input: {
  industrySlug: string;
  industryLabel: string;
  profile: IndustryHubProfile | null;
  products: WorkflowProductOption[];
  seeInIndustryCards: IndustrySeeInActionCard[];
}): WorkflowExperienceModel | null {
  const steps = input.profile?.workflowSteps ?? [];
  if (steps.length === 0 && !input.profile?.workflowVisual) return null;

  const mediaPool = input.seeInIndustryCards.map((c) => c.media);
  const mediaContextById: Record<
    string,
    {
      contextLabel: string;
      contextKind: NonNullable<ReturnType<typeof resolveIndustryMediaContext>>;
    }
  > = {};
  for (const card of input.seeInIndustryCards) {
    const kind = card.contextKind ?? resolveIndustryMediaContext(card.media);
    mediaContextById[card.media.id] = {
      contextKind: kind,
      contextLabel:
        kind === "general-workflow"
          ? "General CRM workflow relevant here"
          : industryMediaContextLabel(kind),
    };
  }

  return buildWorkflowExperienceModel({
    title: `How CRM is used in ${input.industryLabel.toLowerCase()}`,
    supporting:
      "Understand this industry’s operating loop first. Product demonstrations are optional examples for each step — they do not change product rankings.",
    steps: steps.map((step) => {
      const links = resolveIndustryWorkflowStepLinks({
        industrySlug: input.industrySlug,
        step,
        profileUseCases: input.profile?.useCases ?? [],
        profilePriorities: input.profile?.priorities ?? [],
      });
      return {
        id: step.id,
        label: step.label,
        detail: step.detail,
        goal: step.goal ?? step.detail,
        activities: step.activities ?? [],
        ...links,
      };
    }),
    products: input.products,
    mediaPool,
    mediaContextById,
    productsHref: "#software",
    evidenceHref:
      input.seeInIndustryCards.length > 0 ? "#see-in-industry" : "#software",
    visual: input.profile?.workflowVisual ?? null,
  });
}
