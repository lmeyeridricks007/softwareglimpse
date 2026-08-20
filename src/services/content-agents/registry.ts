import {
  softwareReviewAgent,
  pricingPageAgent,
  comparisonAgent,
  alternativesAgent,
  bestSoftwareAgent,
  categoryHubAgent,
  useCasePageAgent,
  guideAgent,
  internalLinkAgent,
  refreshAgent,
  qaAgentStub,
  categoryKnowledgePlannerAgent,
  productKnowledgePlannerAgent,
  supportingContentPlannerAgent,
} from "./agents";
import type { ContentAgent } from "./types";
import type { ContentAgentId } from "@/domain";

const AGENTS: ContentAgent[] = [
  softwareReviewAgent,
  pricingPageAgent,
  comparisonAgent,
  alternativesAgent,
  bestSoftwareAgent,
  categoryHubAgent,
  useCasePageAgent,
  guideAgent,
  internalLinkAgent,
  refreshAgent,
  qaAgentStub,
  categoryKnowledgePlannerAgent,
  productKnowledgePlannerAgent,
  supportingContentPlannerAgent,
];

const BY_ID = new Map(AGENTS.map((a) => [a.id, a]));

export function listContentAgents(): ContentAgent[] {
  return [...AGENTS];
}

export function getContentAgent(id: ContentAgentId | string): ContentAgent {
  const agent = BY_ID.get(id as ContentAgentId);
  if (!agent) {
    throw new Error(`Unknown content agent: ${id}`);
  }
  return agent;
}

export function agentRegistryStatus(): {
  id: ContentAgentId;
  version: string;
  status: "READY";
}[] {
  return listContentAgents().map((a) => ({
    id: a.id,
    version: a.version,
    status: "READY" as const,
  }));
}

/** CLI aliases → registry IDs */
export function resolveAgentAlias(input: string): ContentAgentId {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/^sg\s+/, "")
    .replace(/\s+/g, "-");
  const aliases: Record<string, ContentAgentId> = {
    "software-review": "software-review-agent",
    "software-review-agent": "software-review-agent",
    review: "software-review-agent",
    "pricing-page": "pricing-page-agent",
    "pricing-page-agent": "pricing-page-agent",
    pricing: "pricing-page-agent",
    comparison: "comparison-agent",
    "comparison-agent": "comparison-agent",
    alternatives: "alternatives-agent",
    "alternatives-agent": "alternatives-agent",
    "best-software": "best-software-agent",
    "best-software-agent": "best-software-agent",
    best: "best-software-agent",
    "best-page-agent": "best-software-agent",
    "category-hub": "category-hub-agent",
    "category-hub-agent": "category-hub-agent",
    "use-case": "use-case-page-agent",
    "use-case-page": "use-case-page-agent",
    "use-case-page-agent": "use-case-page-agent",
    "use-case-agent": "use-case-page-agent",
    guide: "guide-agent",
    "guide-agent": "guide-agent",
    "internal-link": "internal-link-agent",
    "internal-link-agent": "internal-link-agent",
    refresh: "refresh-agent",
    "refresh-agent": "refresh-agent",
    qa: "qa-agent",
    "qa-agent": "qa-agent",
    "category-knowledge-planner": "category-knowledge-planner-agent",
    "category-knowledge-planner-agent": "category-knowledge-planner-agent",
    "product-knowledge-planner": "product-knowledge-planner-agent",
    "product-knowledge-planner-agent": "product-knowledge-planner-agent",
    "supporting-content-planner": "supporting-content-planner-agent",
    "supporting-content-planner-agent": "supporting-content-planner-agent",
  };
  const id = aliases[normalized] ?? aliases[`${normalized}-agent`];
  if (!id) {
    throw new Error(`Unknown agent alias: ${input}`);
  }
  return id;
}
