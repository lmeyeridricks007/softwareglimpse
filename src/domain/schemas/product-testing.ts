import { z } from "zod";
import { EvidenceLevelSchema } from "./editorial-trust";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Product testing system — human-first.
 *
 * AI / content pipelines must NEVER set hands-on claims from these models
 * unless a completed ProductTestSession exists with a real human tester.
 */

export const TestTaskStatusSchema = z.enum([
  "NOT_STARTED",
  "PASS",
  "PARTIAL",
  "FAIL",
  "NOT_AVAILABLE",
  "NOT_APPLICABLE",
  /** External blocker (paywall, outage, missing seat) — not a product FAIL */
  "BLOCKED",
]);

export type TestTaskStatus = z.infer<typeof TestTaskStatusSchema>;

export const TestEvidenceKindSchema = z.enum([
  "SCREENSHOT",
  "OBSERVATION",
  "TIMING",
  "PRICING",
  "FEATURE_TEST",
  "INTEGRATION_TEST",
  "LIMITATION",
  "SUPPORT_TEST",
]);

export type TestEvidenceKind = z.infer<typeof TestEvidenceKindSchema>;

export const ProductTestSessionStatusSchema = z.enum([
  /** Pre-START — queue / draft only */
  "draft",
  "in_progress",
  /** Session paused on an external blocker; resume with Start */
  "blocked",
  "completed",
  "abandoned",
]);

export type ProductTestSessionStatus = z.infer<
  typeof ProductTestSessionStatusSchema
>;

export const TestTaskResultSchema = z.object({
  taskId: z.string().min(1),
  status: TestTaskStatusSchema.default("NOT_STARTED"),
  notes: z.string().optional(),
  /** Internal-only notes — never render on public pages */
  internalNotes: z.string().optional(),
  timeSpentMinutes: z.number().nonnegative().optional(),
  evidenceIds: z.array(z.string().min(1)).default([]),
  screenshotPaths: z.array(z.string().min(1)).default([]),
  completedAt: IsoDateTimeSchema.optional(),
});

export type TestTaskResult = z.infer<typeof TestTaskResultSchema>;

export const TestProtocolTaskSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  displayOrder: z.number().int().nonnegative(),
  required: z.boolean().default(true),
  evidenceHints: z.array(z.string().min(1)).default([]),
});

export type TestProtocolTask = z.infer<typeof TestProtocolTaskSchema>;

export const CategoryTestProtocolSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  categorySlug: SlugSchema,
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  tasks: z.array(TestProtocolTaskSchema).min(1),
});

export type CategoryTestProtocol = z.infer<typeof CategoryTestProtocolSchema>;

/**
 * Structured evidence record from a human test session.
 * Must reference product + session + date + tester.
 */
export const ProductTestEvidenceSchema = z.object({
  id: z.string().min(1),
  kind: TestEvidenceKindSchema,
  productSlug: SlugSchema,
  /** soft-* catalogue id when known */
  productId: z.string().min(1).optional(),
  sessionId: z.string().min(1),
  taskId: z.string().min(1).optional(),
  testerId: z.string().min(1),
  recordedAt: IsoDateTimeSchema,
  title: z.string().min(1),
  summary: z.string().optional(),
  /** Public-safe caption; omit internal details */
  publicCaption: z.string().optional(),
  /** Local public path or absolute URL for screenshots */
  assetPath: z.string().optional(),
  minutes: z.number().nonnegative().optional(),
  pricingAmount: z.number().optional(),
  pricingCurrency: z.string().optional(),
  pricingPlanLabel: z.string().optional(),
  /** false = keep off public pages even when session is completed */
  public: z.boolean().default(false),
});

export type ProductTestEvidence = z.infer<typeof ProductTestEvidenceSchema>;

export const ProductTestFinalAssessmentSchema = z.object({
  strengths: z.array(z.string().min(1)).default([]),
  weaknesses: z.array(z.string().min(1)).default([]),
  unexpectedFindings: z.array(z.string().min(1)).default([]),
  setupFrictionSummary: z.string().optional(),
  overallNotes: z.string().optional(),
  /** Internal-only — never auto-publish */
  internalNotes: z.string().optional(),
  recommendHandsOnClaim: z.boolean().default(true),
  /**
   * Explicit human confirmation that this tester personally completed the session.
   * Required before HANDS_ON_TESTED — AI/automation must never set this.
   */
  humanConfirmedCompletion: z.boolean().default(false),
});

export type ProductTestFinalAssessment = z.infer<
  typeof ProductTestFinalAssessmentSchema
>;

/**
 * A human product test session.
 * Incomplete sessions must never appear on public review/comparison pages.
 */
export const ProductTestSessionSchema = z.object({
  id: z.string().min(1),
  productSlug: SlugSchema,
  productId: z.string().min(1).optional(),
  protocolSlug: SlugSchema,
  protocolVersion: z.string().min(1),
  testerId: z.string().min(1),
  status: ProductTestSessionStatusSchema.default("draft"),
  startedAt: IsoDateTimeSchema.optional(),
  completedAt: IsoDateTimeSchema.optional(),
  productVersion: z.string().optional(),
  planTested: z.string().optional(),
  testEnvironment: z.string().optional(),
  testScenario: z.string().optional(),
  /** Resolved only when session is completed with recommendHandsOnClaim */
  evidenceLevel: EvidenceLevelSchema.default("researched"),
  notes: z.string().optional(),
  /** Internal-only workspace notes */
  internalNotes: z.string().optional(),
  screenshotPaths: z.array(z.string().min(1)).default([]),
  tasks: z.array(TestTaskResultSchema).default([]),
  observations: z.array(z.string().min(1)).default([]),
  issues: z.array(z.string().min(1)).default([]),
  setupMinutes: z.number().nonnegative().optional(),
  pricingObserved: z.string().optional(),
  pricingVerifiedAt: IsoDateTimeSchema.optional(),
  evidenceIds: z.array(z.string().min(1)).default([]),
  finalAssessment: ProductTestFinalAssessmentSchema.optional(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export type ProductTestSession = z.infer<typeof ProductTestSessionSchema>;

/**
 * Public-safe summary derived from a completed session.
 * Never includes internalNotes or incomplete sessions.
 */
export const PublicHandsOnTestSummarySchema = z.object({
  sessionId: z.string().min(1),
  productSlug: SlugSchema,
  testerId: z.string().min(1),
  testerName: z.string().min(1).optional(),
  testedAt: IsoDateTimeSchema,
  planTested: z.string().optional(),
  testScenario: z.string().optional(),
  testEnvironment: z.string().optional(),
  productVersion: z.string().optional(),
  setupMinutes: z.number().nonnegative().optional(),
  pricingObserved: z.string().optional(),
  pricingVerifiedAt: IsoDateTimeSchema.optional(),
  strengths: z.array(z.string().min(1)).default([]),
  weaknesses: z.array(z.string().min(1)).default([]),
  publicEvidence: z.array(ProductTestEvidenceSchema).default([]),
  taskSummary: z
    .object({
      total: z.number().int().nonnegative(),
      pass: z.number().int().nonnegative(),
      partial: z.number().int().nonnegative(),
      fail: z.number().int().nonnegative(),
      notAvailable: z.number().int().nonnegative(),
      notApplicable: z.number().int().nonnegative(),
      blocked: z.number().int().nonnegative(),
    })
    .optional(),
});

export type PublicHandsOnTestSummary = z.infer<
  typeof PublicHandsOnTestSummarySchema
>;
