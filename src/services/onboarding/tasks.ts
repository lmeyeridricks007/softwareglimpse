import type {
  AgentHandoffTask,
  PageCandidate,
  RelationshipCandidate,
  ResearchPlan,
  Software,
} from "@/domain";

/**
 * Convert content/research plan into agent handoff tasks.
 * Does not implement agents — establishes the contract only.
 */
export function buildAgentHandoffTasks(input: {
  product: Software;
  researchPlan?: ResearchPlan;
  pageCandidates: PageCandidate[];
  relationshipCandidates: RelationshipCandidate[];
  researchPercent: number;
  skipResearch?: boolean;
}): AgentHandoffTask[] {
  const tasks: AgentHandoffTask[] = [];
  const slug = input.product.slug;

  if (!input.skipResearch && input.researchPlan) {
    tasks.push({
      id: `task:research:${slug}`,
      agentType: "research-agent",
      productIds: [slug],
      categoryIds: [input.product.primaryCategorySlug],
      dependencies: [],
      status: input.researchPercent >= 60 ? "COMPLETE" : "READY",
      statusReason:
        input.researchPercent >= 60
          ? "Research completeness above threshold"
          : "Execute research plan via research pipeline",
      briefInput: {
        domains: input.researchPlan.requiredDomains,
        optionalDomains: input.researchPlan.optionalDomains,
      },
      effort: "medium",
    });
  }

  const needsRelReview = input.relationshipCandidates.some(
    (c) => c.status === "candidate" && c.confidence !== "high",
  );
  if (needsRelReview) {
    tasks.push({
      id: `task:qa:relationships:${slug}`,
      agentType: "qa-agent",
      productIds: [slug],
      categoryIds: [input.product.primaryCategorySlug],
      dependencies: [`task:research:${slug}`],
      status: "READY",
      statusReason: "Review inferred competitor/alternative candidates",
      briefInput: {
        candidates: input.relationshipCandidates.map((c) => ({
          type: c.type,
          target: c.targetSlug,
          confidence: c.confidence,
        })),
      },
      effort: "small",
    });
  }

  for (const page of input.pageCandidates) {
    if (
      page.status === "not-recommended" ||
      page.status === "duplicate" ||
      page.status === "blocked"
    ) {
      continue;
    }

    const agentType = agentTypeForPage(page.pageType);
    if (!agentType) continue;

    const deps = [
      `task:research:${slug}`,
      ...page.dependencies.filter((d) => d.startsWith("research:") || d.startsWith("relationship:")),
    ];

    let status: AgentHandoffTask["status"] = "READY";
    let statusReason = "Ready for specialized agent after research";
    if (page.status === "research-required") {
      status = "BLOCKED";
      statusReason = "Research incomplete";
    } else if (page.status === "category-blocked") {
      status = "BLOCKED";
      statusReason = "Category methodology not ready";
    } else if (page.status === "relationship-review-required") {
      status = "WAITING";
      statusReason = "Awaiting relationship review";
      deps.push(`task:qa:relationships:${slug}`);
    }

    tasks.push({
      id: `task:${page.pageType}:${page.id}`,
      agentType,
      contentId: undefined,
      productIds: page.productSlugs,
      categoryIds: page.categorySlug ? [page.categorySlug] : [],
      dependencies: deps,
      status,
      statusReason,
      briefInput: {
        pageType: page.pageType,
        canonicalPath: page.canonicalPath,
        reason: page.reason,
        readiness: page.readiness,
      },
      effort:
        page.pageType === "software-review" || page.pageType === "comparison"
          ? "medium"
          : page.pageType === "best-inclusion"
            ? "small"
            : "medium",
    });
  }

  tasks.push({
    id: `task:internal-link:${slug}`,
    agentType: "internal-link-agent",
    productIds: [slug],
    categoryIds: [input.product.primaryCategorySlug],
    dependencies: [`task:research:${slug}`],
    status: "WAITING",
    statusReason: "Apply after pages are drafted/published",
    briefInput: {},
    effort: "small",
  });

  return detectDependencyCycles(tasks);
}

function agentTypeForPage(
  pageType: PageCandidate["pageType"],
): AgentHandoffTask["agentType"] | null {
  switch (pageType) {
    case "software-review":
      return "software-review-agent";
    case "pricing":
      return "pricing-page-agent";
    case "comparison":
      return "comparison-agent";
    case "alternatives":
      return "alternatives-agent";
    case "best-inclusion":
      return "best-software-agent";
    case "category-hub":
      return "category-hub-agent";
    default:
      return null;
  }
}

/** Mark cyclic deps as BLOCKED rather than silently looping. */
function detectDependencyCycles(
  tasks: AgentHandoffTask[],
): AgentHandoffTask[] {
  const ids = new Set(tasks.map((t) => t.id));
  return tasks.map((task) => {
    const visiting = new Set<string>();
    const stack = [...task.dependencies];
    while (stack.length) {
      const dep = stack.pop()!;
      if (!ids.has(dep)) continue;
      if (dep === task.id || visiting.has(dep)) {
        return {
          ...task,
          status: "BLOCKED" as const,
          statusReason: `TASK_DEPENDENCY_CYCLE involving ${dep}`,
        };
      }
      visiting.add(dep);
      const other = tasks.find((t) => t.id === dep);
      if (other) stack.push(...other.dependencies);
    }
    return task;
  });
}
