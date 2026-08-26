/**
 * CRM hub-page twin decisions (content strategy, Aug 2026).
 *
 * Use case = buyer job · capability = evaluation lens · feature = product evidence.
 * MERGE only when a feature URL duplicates a capability with no distinct evidence job.
 */

export type HubPageTwinPageType = "use-case" | "capability" | "feature";

export type HubPageTwinSibling = {
  pageType: HubPageTwinPageType;
  slug: string;
  href: string;
  label: string;
  /** One-line intent — shown on sibling cards so twins do not read as duplicates. */
  intent: string;
  decision: "keep" | "merge";
  /** When decision=merge, the surviving canonical href. */
  mergeInto?: string;
};

export type HubPageTwinTopic = {
  id: string;
  label: string;
  siblings: HubPageTwinSibling[];
};

/** Feature slugs that 301 to a canonical sibling (not indexable). */
export const HUB_PAGE_TWIN_FEATURE_MERGES: Record<string, string> = {
  "pipeline-management": "/capabilities/pipeline-management/",
};

export const HUB_PAGE_TWIN_TOPICS: HubPageTwinTopic[] = [
  {
    id: "pipeline",
    label: "Pipeline management",
    siblings: [
      {
        pageType: "use-case",
        slug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
        label: "Pipeline management use case",
        intent: "Buyer job — running deals and weekly reviews",
        decision: "keep",
      },
      {
        pageType: "capability",
        slug: "pipeline-management",
        href: "/capabilities/pipeline-management/",
        label: "Pipeline management capability",
        intent: "Evaluation lens — stage engine and deal records",
        decision: "keep",
      },
      {
        pageType: "feature",
        slug: "pipeline-management",
        href: "/features/pipeline-management/",
        label: "Pipeline management (feature)",
        intent: "Merged — use capability + pillar features below",
        decision: "merge",
        mergeInto: "/capabilities/pipeline-management/",
      },
      {
        pageType: "feature",
        slug: "multiple-pipelines",
        href: "/features/multiple-pipelines/",
        label: "Multiple pipelines",
        intent: "Feature evidence — separate stage models",
        decision: "keep",
      },
      {
        pageType: "feature",
        slug: "custom-pipeline-stages",
        href: "/features/custom-pipeline-stages/",
        label: "Custom pipeline stages",
        intent: "Feature evidence — checkpoints inside one pipeline",
        decision: "keep",
      },
    ],
  },
  {
    id: "forecast",
    label: "Sales forecasting",
    siblings: [
      {
        pageType: "use-case",
        slug: "sales-forecasting",
        href: "/use-cases/sales-forecasting/",
        label: "Sales forecasting use case",
        intent: "Buyer job — weekly forecast reviews from pipeline truth",
        decision: "keep",
      },
      {
        pageType: "capability",
        slug: "forecasting",
        href: "/capabilities/forecasting/",
        label: "Forecasting capability",
        intent: "Evaluation lens — projection method and roll-ups",
        decision: "keep",
      },
      {
        pageType: "feature",
        slug: "forecasting",
        href: "/features/forecasting/",
        label: "Forecasting feature",
        intent: "Feature evidence — commit categories and vendor support",
        decision: "keep",
      },
    ],
  },
  {
    id: "ai-assistance",
    label: "AI assistance",
    siblings: [
      {
        pageType: "capability",
        slug: "ai-assistance",
        href: "/capabilities/ai-assistance/",
        label: "AI assistance capability",
        intent: "Evaluation lens — governance, credits, and assist jobs",
        decision: "keep",
      },
      {
        pageType: "feature",
        slug: "ai-assistance",
        href: "/features/ai-assistance/",
        label: "AI assistance feature",
        intent: "Feature evidence — availability and plan gates across CRMs",
        decision: "keep",
      },
    ],
  },
];

const topicByHref = new Map<string, HubPageTwinTopic>();
const siblingByHref = new Map<string, HubPageTwinSibling>();

for (const topic of HUB_PAGE_TWIN_TOPICS) {
  for (const sibling of topic.siblings) {
    topicByHref.set(sibling.href, topic);
    siblingByHref.set(sibling.href, sibling);
  }
}

export function hubPageTwinTopicForPath(path: string): HubPageTwinTopic | null {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return topicByHref.get(normalized) ?? null;
}

export function hubPageTwinSiblingForPath(path: string): HubPageTwinSibling | null {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return siblingByHref.get(normalized) ?? null;
}

/** Sibling links for the current page (excludes self and merged URLs). */
export function hubPageTwinSiblingsForPath(path: string): HubPageTwinSibling[] {
  const topic = hubPageTwinTopicForPath(path);
  if (!topic) return [];
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return topic.siblings.filter(
    (s) => s.href !== normalized && s.decision === "keep",
  );
}

export function mergedFeatureHref(featureSlug: string): string | null {
  return HUB_PAGE_TWIN_FEATURE_MERGES[featureSlug] ?? null;
}

export function isMergedFeatureSlug(featureSlug: string): boolean {
  return featureSlug in HUB_PAGE_TWIN_FEATURE_MERGES;
}
