import { z } from "zod";

export const ImprovementTypeSchema = z.enum([
  "EXPAND CONTENT",
  "RESTRUCTURE",
  "ADD ORIGINAL ANALYSIS",
  "ADD EVIDENCE",
  "REFRESH RESEARCH",
  "ADD COMPARISON",
  "ADD TABLE",
  "ADD VISUAL",
  "ADD SCREENSHOT",
  "ADD VIDEO",
  "ADD TOOL CTA",
  "ADD RESOURCE",
  "ADD CHECKLIST",
  "ADD INTERNAL LINKS",
  "IMPROVE NEXT STEP",
  "MERGE CONTENT",
  "SPLIT CONTENT",
  "REMOVE / REDIRECT",
  "RESEARCH REQUIRED",
]);

export type ImprovementType = z.infer<typeof ImprovementTypeSchema>;

export const FixClassSchema = z.enum([
  "TEMPLATE FIX",
  "PAGE CONTENT FIX",
  "DATA/RESEARCH FIX",
  "LINK GRAPH FIX",
]);

export type FixClass = z.infer<typeof FixClassSchema>;

export const EffortSchema = z.enum(["small", "medium", "large"]);

export type Effort = z.infer<typeof EffortSchema>;

export const ImprovementOpportunitySchema = z.object({
  id: z.string().min(1),
  route: z.string().min(1),
  pageType: z.string().min(1),
  currentScore: z.number().int().min(0).max(100),
  targetScore: z.number().int().min(0).max(100),
  priority: z.enum(["CQ-P0", "CQ-P1", "CQ-P2", "CQ-P3"]),
  mapPriority: z.enum(["P0", "P1", "P2", "P3"]).optional(),
  mapNodeId: z.string().optional(),
  mapCluster: z.string().optional(),
  types: z.array(ImprovementTypeSchema).min(1),
  fixClass: FixClassSchema,
  problem: z.string().min(1),
  whyItMatters: z.string().min(1),
  recommendedChange: z.string().min(1),
  sectionsAffected: z.array(z.string()).default([]),
  evidenceNeeded: z.array(z.string()).default([]),
  visualMediaNeeded: z.array(z.string()).default([]),
  toolIntegration: z.array(z.string()).default([]),
  resourceIntegration: z.array(z.string()).default([]),
  internalLinkChanges: z.array(z.string()).default([]),
  relatedMapNodes: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  researchRequired: z.boolean().default(false),
  effort: EffortSchema,
  expectedOutcome: z.string().min(1),
  quickWin: z.boolean().default(false),
  majorProject: z.boolean().default(false),
  systemic: z.boolean().default(false),
  rankScore: z.number(),
  seoSignals: z.array(z.string()).default([]),
});

export type ImprovementOpportunity = z.infer<
  typeof ImprovementOpportunitySchema
>;

export type SystemicPattern = {
  id: string;
  label: string;
  count: number;
  pageTypes: string[];
  sampleRoutes: string[];
  suggestedFixClass: FixClass;
  recommendation: string;
};

export type ContentMapNode = {
  id: string;
  priority: "P0" | "P1" | "P2" | "P3";
  cluster: string;
  subcluster: string;
  title: string;
  route: string;
  researchState: string;
  tool: string;
  resource: string;
  nextStep: string;
  status: string;
};
