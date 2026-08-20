import {
  categoryAgentContextRef,
  type CategoryAgentContext,
  type CategoryAgentHandoffTask,
  type CategoryContentCandidate,
  type CategoryDefinition,
} from "@/domain";
import { buildSupportingKnowledgePlan } from "@/services/content-clusters";
import { planCategoryKnowledge } from "@/services/knowledge-planners";

export function buildCategoryAgentContext(
  definition: CategoryDefinition,
): CategoryAgentContext {
  const supportingKnowledgePlan = buildSupportingKnowledgePlan(definition.slug);
  let knowledgeCoverage: CategoryAgentContext["knowledgeCoverage"];
  try {
    const plan = planCategoryKnowledge(definition.slug);
    knowledgeCoverage = {
      coreCount: plan.summary.coreCount,
      existingCount: plan.summary.existingCount,
      newPageCount: plan.summary.newPageCount,
    };
  } catch {
    knowledgeCoverage = undefined;
  }
  return {
    contextRef: categoryAgentContextRef(
      definition.slug,
      definition.configVersion,
    ),
    category: {
      slug: definition.slug,
      name: definition.name,
      parentSlug: definition.parentSlug,
      shortDescription: definition.shortDescription,
      configVersion: definition.configVersion,
      lifecycle: definition.lifecycle,
    },
    featureDefinitions: definition.features,
    researchRequirements: definition.researchRequirements,
    editorialMethodology: definition.editorialMethodology,
    comparisonMethodology: definition.comparisonCriteria,
    pricingDimensions: definition.pricingDimensions,
    pricingCapability: definition.pricingCapability,
    useCases: definition.useCases,
    finderReadiness: definition.finderReadiness,
    supportingKnowledgePlan: supportingKnowledgePlan ?? undefined,
    knowledgeCoverage,
  };
}

export function buildCategoryAgentTasks(input: {
  definition: CategoryDefinition;
  contentCandidates: CategoryContentCandidate[];
  contextRef: string;
}): CategoryAgentHandoffTask[] {
  const { definition, contentCandidates, contextRef } = input;
  const tasks: CategoryAgentHandoffTask[] = [];

  const hub = contentCandidates.find((c) => c.pageType === "category-hub");
  tasks.push({
    id: `task:category-hub:${definition.slug}`,
    agentType: "category-hub-agent",
    categoryId: definition.slug,
    status: hub?.status === "ready-to-create" ? "READY" : "BLOCKED",
    statusReason: hub?.reason,
    dependencies: [],
    contextRef,
    briefInput: {
      canonicalPath: hub?.canonicalPath,
      requiredSections: [
        "category-definition",
        "decision-guidance",
        "browse-by-need",
        "related-tools",
      ],
    },
  });

  const best = contentCandidates.find((c) => c.pageType === "best");
  tasks.push({
    id: `task:best:${definition.slug}`,
    agentType: "best-page-agent",
    categoryId: definition.slug,
    status: "BLOCKED",
    statusReason:
      best?.reason ??
      "Requires minimum assessed products — never invent rankings",
    dependencies: [`task:research-coverage:${definition.slug}`],
    contextRef,
    briefInput: {
      methodologySlug: definition.editorialMethodology.slug,
      prohibited: ["auto-rank", "affiliate-driven winners"],
    },
  });

  for (const page of contentCandidates.filter(
    (c) => c.pageType === "software-review",
  )) {
    const slug = page.canonicalPath.split("/").filter(Boolean).pop()!;
    tasks.push({
      id: `task:research:${slug}`,
      agentType: "research-agent",
      categoryId: definition.slug,
      status: "READY",
      statusReason: "Research against category requirements",
      dependencies: [],
      contextRef,
      briefInput: {
        productSlug: slug,
        domains: definition.requiredResearchDomains,
      },
    });
  }

  tasks.push({
    id: `task:qa:membership:${definition.slug}`,
    agentType: "qa-agent",
    categoryId: definition.slug,
    status: "READY",
    statusReason: "Review uncertain/secondary memberships",
    dependencies: [],
    contextRef,
    briefInput: {},
  });

  // Guide tasks are planned, not auto-executed during category onboarding
  for (const guide of contentCandidates.filter(
    (c) => c.pageType === "guide" && c.status === "ready-to-create",
  )) {
    const slug = guide.canonicalPath.split("/").filter(Boolean).pop()!;
    tasks.push({
      id: `task:guide:${slug}`,
      agentType: "guide-agent",
      categoryId: definition.slug,
      status: "BLOCKED",
      statusReason:
        "Supporting guide planned — accept via content:plan then single-content workflow (not auto-run)",
      dependencies: [`knowledge-map:${definition.slug}`],
      contextRef,
      briefInput: {
        targetSlug: slug,
        canonicalPath: guide.canonicalPath,
        prohibited: ["mass-generate", "affiliate-stuffed-cta"],
      },
    });
  }

  return tasks;
}
