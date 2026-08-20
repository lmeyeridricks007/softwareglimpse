import { z } from "zod";
import { SlugSchema } from "./primitives";

const FEATURE_AVAILABILITY = [
  "supported",
  "limited",
  "add-on",
  "higher-plan-only",
  "not-supported",
  "unknown",
] as const;

export type FeatureAvailability = (typeof FEATURE_AVAILABILITY)[number];

const FEATURE_AVAILABILITY_ALIASES: Record<string, FeatureAvailability> = {
  supported: "supported",
  yes: "supported",
  true: "supported",
  limited: "limited",
  partial: "limited",
  "add-on": "add-on",
  addon: "add-on",
  "higher-plan-only": "higher-plan-only",
  "not-supported": "not-supported",
  unsupported: "not-supported",
  "not supported": "not-supported",
  none: "not-supported",
  unavailable: "not-supported",
  no: "not-supported",
  false: "not-supported",
  unknown: "unknown",
};

/** Vendor wording → canonical availability. Unknown tokens become `unknown`. */
export function coerceFeatureAvailability(value: unknown): FeatureAvailability {
  if (value === undefined || value === null || value === "") return "unknown";
  if (typeof value !== "string") return "unknown";
  const key = value.trim().toLowerCase().replace(/_/g, "-");
  return FEATURE_AVAILABILITY_ALIASES[key] ?? "unknown";
}

export const FeatureAvailabilitySchema = z
  .union([z.enum(FEATURE_AVAILABILITY), z.string()])
  .optional()
  .nullable()
  .transform((value) => coerceFeatureAvailability(value));

export const FeatureSupportSchema = z.object({
  featureSlug: SlugSchema,
  availability: FeatureAvailabilitySchema,
  planSlugs: z.array(SlugSchema).default([]),
  sourceIds: z.array(z.string().min(1)).default([]),
  notes: z.string().optional(),
});

export type FeatureSupport = z.infer<typeof FeatureSupportSchema>;

export const CanonicalFeatureSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  categorySlugs: z.array(SlugSchema).default([]),
});

export type CanonicalFeature = z.infer<typeof CanonicalFeatureSchema>;

const INTEGRATION_KIND = [
  "native",
  "official-connector",
  "third-party",
  "zapier-style",
  "api-only",
  "unknown",
] as const;

export type IntegrationKind = (typeof INTEGRATION_KIND)[number];

const INTEGRATION_KIND_ALIASES: Record<string, IntegrationKind> = {
  native: "native",
  "official-connector": "official-connector",
  official: "official-connector",
  connector: "official-connector",
  "third-party": "third-party",
  thirdparty: "third-party",
  "zapier-style": "zapier-style",
  zapier: "zapier-style",
  "api-only": "api-only",
  api: "api-only",
  unknown: "unknown",
  // Availability language sometimes leaked into `kind` during extraction.
  limited: "unknown",
};

/** Vendor wording → canonical integration kind. */
export function coerceIntegrationKind(value: unknown): IntegrationKind {
  if (value === undefined || value === null || value === "") return "unknown";
  if (typeof value !== "string") return "unknown";
  const key = value.trim().toLowerCase().replace(/_/g, "-");
  return INTEGRATION_KIND_ALIASES[key] ?? "unknown";
}

export const IntegrationKindSchema = z
  .union([z.enum(INTEGRATION_KIND), z.string()])
  .optional()
  .nullable()
  .transform((value) => coerceIntegrationKind(value));

export const IntegrationSupportSchema = z.object({
  integrationSlug: SlugSchema,
  kind: IntegrationKindSchema,
  sourceIds: z.array(z.string().min(1)).default([]),
  notes: z.string().optional(),
});

export type IntegrationSupport = z.infer<typeof IntegrationSupportSchema>;

const AI_CAPABILITY_KIND = [
  "email-generation",
  "lead-scoring",
  "summaries",
  "assistant",
  "forecasting",
  "automation",
  "recommendations",
  "transcription",
  "other",
] as const;

export type AiCapabilityKind = (typeof AI_CAPABILITY_KIND)[number];

const AI_CAPABILITY_ALIASES: Record<string, AiCapabilityKind> = {
  "email-generation": "email-generation",
  "lead-scoring": "lead-scoring",
  summaries: "summaries",
  summary: "summaries",
  assistant: "assistant",
  agent: "assistant",
  copilot: "assistant",
  "itsm ai copilot": "assistant",
  "developer ai copilot": "assistant",
  chatbot: "assistant",
  forecasting: "forecasting",
  automation: "automation",
  deflection: "automation",
  recommendations: "recommendations",
  transcription: "transcription",
  other: "other",
};

/** Vendor labels → canonical AI capability kind. Unknown tokens become `other`. */
export function coerceAiCapabilityKind(value: unknown): AiCapabilityKind {
  if (value === undefined || value === null || value === "") return "other";
  if (typeof value !== "string") return "other";
  const key = value.trim().toLowerCase().replace(/_/g, "-");
  return AI_CAPABILITY_ALIASES[key] ?? "other";
}

export const AiCapabilityKindSchema = z
  .union([z.enum(AI_CAPABILITY_KIND), z.string()])
  .optional()
  .nullable()
  .transform((value) => coerceAiCapabilityKind(value));

export const AiCapabilitySupportSchema = z.object({
  capability: AiCapabilityKindSchema,
  availability: FeatureAvailabilitySchema,
  sourceIds: z.array(z.string().min(1)).default([]),
  notes: z.string().optional(),
});

export type AiCapabilitySupport = z.infer<typeof AiCapabilitySupportSchema>;

export const VendorPositioningSchema = z.object({
  claim: z.string().min(1),
  audienceHints: z.array(z.string()).default([]),
  sourceIds: z.array(z.string().min(1)).default([]),
});

export type VendorPositioning = z.infer<typeof VendorPositioningSchema>;

export const EditorialFitSchema = z.object({
  businessSizeSlug: SlugSchema.optional(),
  teamTypeSlug: SlugSchema.optional(),
  strength: z.enum(["strong", "moderate", "weak", "unknown"]).default("unknown"),
  rationale: z.string().optional(),
  isEditorial: z.literal(true).default(true),
});

export type EditorialFit = z.infer<typeof EditorialFitSchema>;

export const ProductLimitationSchema = z.object({
  kind: z.enum([
    "feature-unavailable",
    "high-cost-at-scale",
    "limited-customization",
    "requires-add-on",
    "usage-cap",
    "region-restriction",
    "plan-restriction",
    "other",
  ]),
  description: z.string().min(1),
  sourceIds: z.array(z.string().min(1)).default([]),
  isEditorial: z.boolean().default(false),
});

export type ProductLimitation = z.infer<typeof ProductLimitationSchema>;
