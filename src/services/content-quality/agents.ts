import type { ContentQualityPageType } from "@/domain/schemas/content-quality";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { evaluatePageQuality } from "./evaluate";
import type { ContentQualityAssessment } from "@/domain/schemas/content-quality";

/**
 * Generic ContentQualityAgent with page-type strategy labels.
 * Strategies specialize expectations via QualityProfiles + loader signals;
 * scoring stays in the shared evaluator (no duplicated score logic).
 */
export const QUALITY_AGENT_BY_PAGE_TYPE: Record<
  ContentQualityPageType,
  { id: string; label: string }
> = {
  article: { id: "article-quality-agent", label: "ArticleQualityAgent" },
  guide: { id: "guide-quality-agent", label: "GuideQualityAgent" },
  "product-review": {
    id: "product-review-quality-agent",
    label: "ProductReviewQualityAgent",
  },
  comparison: {
    id: "comparison-quality-agent",
    label: "ComparisonQualityAgent",
  },
  best: { id: "best-page-quality-agent", label: "BestPageQualityAgent" },
  "product-guide": {
    id: "guide-quality-agent",
    label: "GuideQualityAgent",
  },
  industry: { id: "industry-quality-agent", label: "IndustryQualityAgent" },
  "use-case": { id: "use-case-quality-agent", label: "UseCaseQualityAgent" },
  capability: {
    id: "capability-quality-agent",
    label: "CapabilityQualityAgent",
  },
  requirement: {
    id: "requirement-quality-agent",
    label: "RequirementQualityAgent",
  },
  feature: { id: "feature-quality-agent", label: "FeatureQualityAgent" },
  "implementation-guide": {
    id: "guide-quality-agent",
    label: "GuideQualityAgent",
  },
  resource: { id: "resource-quality-agent", label: "ResourceQualityAgent" },
  "tool-landing": {
    id: "content-quality-agent",
    label: "ContentQualityAgent",
  },
};

export function resolveQualityAgent(pageType: ContentQualityPageType): {
  id: string;
  label: string;
} {
  return QUALITY_AGENT_BY_PAGE_TYPE[pageType];
}

/**
 * Run the appropriate quality agent strategy against a snapshot.
 * Does not rewrite content.
 */
export function runContentQualityAgent(
  snapshot: PageQualitySnapshot,
  opts?: { evaluatedAt?: string },
): {
  agentId: string;
  agentLabel: string;
  assessment: ContentQualityAssessment;
} {
  const agent = resolveQualityAgent(snapshot.pageType);
  const assessment = evaluatePageQuality(snapshot, {
    evaluatedAt: opts?.evaluatedAt,
  });
  return {
    agentId: agent.id,
    agentLabel: agent.label,
    assessment: {
      ...assessment,
      notes: [
        ...assessment.notes,
        `qualityAgent=${agent.label}`,
        `qualityAgentId=${agent.id}`,
      ],
    },
  };
}
