export type NewContentOpportunityType =
  | "SUPPORTING ARTICLE"
  | "PILLAR PAGE"
  | "PRODUCT GUIDE"
  | "PRODUCT HOW-TO"
  | "PRODUCT × INDUSTRY"
  | "PRODUCT × USE CASE"
  | "INDUSTRY GUIDE"
  | "USE-CASE GUIDE"
  | "CAPABILITY GUIDE"
  | "REQUIREMENT GUIDE"
  | "FEATURE GUIDE"
  | "IMPLEMENTATION ARTICLE"
  | "MIGRATION ARTICLE"
  | "CHECKLIST"
  | "TEMPLATE"
  | "WORKSHEET"
  | "SCORECARD"
  | "TOOL"
  | "RESEARCH PAGE";

export type EligibilityDecision =
  | "CREATE"
  | "RESEARCH FIRST"
  | "MERGE INTO EXISTING"
  | "KEEP AS SECTION"
  | "DO NOT CREATE"
  | "FUTURE";

export type GapPriority = "P0" | "P1" | "P2" | "P3";

export type Effort = "small" | "medium" | "large";

export type EligibilityScores = {
  userNeed: number;
  distinctIntent: number;
  overlapRisk: number; // higher = more overlap (bad)
  evidenceAvailability: number;
  originalAnalysisPotential: number;
  pillarSupportValue: number;
  journeyValue: number;
  toolResourceConnection: number;
  researchReadiness: number;
};

export type ContentSupportNetwork = {
  primaryParent: string;
  primaryPillar: string;
  linksToIt: string[];
  linksFromIt: string[];
  buyerStage: string;
  nextStep: string;
  tool?: string;
  resource?: string;
  entities: string[];
};

export type ProposedContentBrief = {
  title: string;
  route: string;
  contentType: NewContentOpportunityType;
  searchIntent: string;
  primaryQuestion: string;
  whyDeservesPage: string;
  differentiation: string;
  requiredSections: string[];
  originalValue: string[];
  evidenceNeeded: string[];
  visualsNeeded: string[];
  toolsResources: string[];
  internalLinksIn: string[];
  internalLinksOut: string[];
  canonicalParent: string;
  publicationRequirements: string[];
};

export type NewContentOpportunity = {
  id: string;
  title: string;
  suggestedRoute: string;
  type: NewContentOpportunityType;
  decision: EligibilityDecision;
  priority: GapPriority;
  mapNodeId?: string;
  mapCluster?: string;
  parent: string;
  supports: string[];
  whyNeeded: string;
  researchStatus: string;
  effort: Effort;
  linkingImpact: "high" | "medium" | "low";
  scores: EligibilityScores;
  network: ContentSupportNetwork;
  brief?: ProposedContentBrief;
  programmaticRisk?: boolean;
  relatedExisting?: string[];
  notes?: string[];
};

export type PillarSupportAnalysis = {
  pillar: string;
  existing: Array<{ title: string; route: string; mapId?: string }>;
  missingOrThin: Array<{
    title: string;
    suggestedRoute?: string;
    status: string;
    decision: EligibilityDecision;
  }>;
  resources: Array<{ title: string; route: string; status: string }>;
};

export type DuplicateCannibalizationFinding = {
  id: string;
  routes: string[];
  issue: string;
  recommendation: EligibilityDecision;
  canonical?: string;
  rationale: string;
};

export type ProductClusterGap = {
  productSlug: string;
  flagship: boolean;
  existing: string[];
  candidates: Array<{
    title: string;
    type: NewContentOpportunityType;
    decision: EligibilityDecision;
    reason: string;
  }>;
};

export type IndustryClusterGap = {
  industrySlug: string;
  mapPriority: GapPriority;
  hubRoute: string;
  hubDecision: EligibilityDecision;
  supportingGuides: Array<{ title: string; decision: EligibilityDecision; reason: string }>;
  resources: Array<{ title: string; decision: EligibilityDecision; reason: string }>;
};
