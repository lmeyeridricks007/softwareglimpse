/**
 * SoftwareGlimpse content knowledge graph — semantic entity relationships.
 * Complements `internal-linking` plans; does not delete pages.
 */

export type KnowledgeEntityKind =
  | "category"
  | "product"
  | "capability"
  | "feature"
  | "industry"
  | "use_case"
  | "guide"
  | "comparison"
  | "alternatives"
  | "best"
  | "pricing"
  | "research"
  | "tool"
  | "hub";

export type KnowledgeRelation =
  | "belongs_to"
  | "has_product"
  | "explains"
  | "reviews"
  | "compares"
  | "alternative_to"
  | "best_for_category"
  | "pricing_for"
  | "research_for"
  | "tool_for"
  | "supports_capability"
  | "supports_feature"
  | "relevant_to_industry"
  | "relevant_to_use_case"
  | "next_in_journey"
  | "hub_of"
  /** Navigational link from rendered link plans (overlays + injections). */
  | "contextual_related";

export type KnowledgeNode = {
  id: string;
  kind: KnowledgeEntityKind;
  slug: string;
  path: string;
  title: string;
  categorySlug: string | null;
  indexable: boolean;
  /** IMPROVE / temporary noindex — still UX-linkable when useful. */
  improveLifecycle: boolean;
};

export type KnowledgeEdge = {
  from: string;
  to: string;
  relation: KnowledgeRelation;
  weight: number;
  reason: string;
};

export type KnowledgeGraph = {
  generatedAt: string;
  version: string;
  nodeCount: number;
  edgeCount: number;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
};

export type JourneyStep = {
  role: string;
  path: string | null;
  label: string;
  optional?: boolean;
};

export type JourneyTemplate = {
  id: string;
  name: string;
  description: string;
  steps: JourneyStep[];
};

export type HubSectionId =
  | "start_here"
  | "most_useful_guides"
  | "popular_software"
  | "comparisons"
  | "pricing"
  | "use_cases"
  | "industry_guidance"
  | "tools"
  | "research";

export type HubSectionLink = {
  href: string;
  label: string;
  description?: string;
  authorityScore: number;
  indexable: boolean;
};

export type HubSection = {
  id: HubSectionId;
  title: string;
  links: HubSectionLink[];
};

export type ImproveInboundCandidate = {
  fromPath: string;
  fromTitle: string;
  relation: KnowledgeRelation;
  reason: string;
  alreadyLinked: boolean;
  authorityScore: number;
};

export type ImproveInboundReport = {
  path: string;
  title: string;
  inboundCount: number;
  contentInboundCount: number;
  hubDepth: number | null;
  orphanStatus: "orphan" | "chrome-only" | "weak" | "ok";
  candidates: ImproveInboundCandidate[];
  suggestedAdditions: ImproveInboundCandidate[];
};

export type KnowledgeGraphQaIssue = {
  code:
    | "ORPHAN"
    | "IRRELEVANT_LINK"
    | "REDIRECT_LINK"
    | "BROKEN_LINK"
    | "DUPLICATE_NAV"
    | "EXCESSIVE_LINK_BLOCK"
    | "HUB_DEPTH_TOO_DEEP"
    | "BREADCRUMB_GAP";
  severity: "error" | "warning";
  path?: string;
  relatedPath?: string;
  message: string;
};

export const KNOWLEDGE_GRAPH_VERSION = "1.0.0";
