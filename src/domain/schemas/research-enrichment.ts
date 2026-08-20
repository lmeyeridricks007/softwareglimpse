import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";
import {
  AiCapabilitySupportSchema,
  EditorialFitSchema,
  FeatureSupportSchema,
  IntegrationSupportSchema,
  ProductLimitationSchema,
  VendorPositioningSchema,
} from "./feature-support";
import { ProductMediaSchema } from "./product-media";
import { ResearchDomainSchema } from "./research-source";

/**
 * Research enrichment overlay applied onto canonical software after approval.
 */
export const ProductScreenshotSchema = z.object({
  id: z.string().min(1),
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
  source: z.string().optional(),
  checkedAt: IsoDateTimeSchema.optional(),
  annotation: z.string().optional(),
  /**
   * vendor-ui = verified product UI / marketing capture.
   * original-diagram = SoftwareGlimpse teaching diagram (never pretend this is vendor UI).
   */
  kind: z.enum(["vendor-ui", "original-diagram"]).optional(),
  /** Feature slugs this asset illustrates (used by Features tab + asset audits). */
  featureIds: z.array(z.string().min(1)).default([]),
  useCaseIds: z.array(z.string().min(1)).default([]),
});

export type ProductScreenshot = z.infer<typeof ProductScreenshotSchema>;

export const ProductResearchEnrichmentSchema = z.object({
  productSlug: SlugSchema,
  shortDescription: z.string().optional(),
  featureSupport: z.array(FeatureSupportSchema).default([]),
  integrationSupport: z.array(IntegrationSupportSchema).default([]),
  aiCapabilities: z.array(AiCapabilitySupportSchema).default([]),
  vendorPositioning: z.array(VendorPositioningSchema).default([]),
  editorialFit: z.array(EditorialFitSchema).default([]),
  limitations: z.array(ProductLimitationSchema).default([]),
  /**
   * Visual evidence for product pages: verified vendor UI captures and/or
   * SoftwareGlimpse original teaching diagrams (kind: original-diagram).
   * Never fabricate vendor screenshots.
   */
  screenshots: z.array(ProductScreenshotSchema).default([]),
  /**
   * Official vendor videos (YouTube / Vimeo / vendor-hosted).
   * Supplements screenshots — never replaces SoftwareGlimpse analysis.
   * Do not auto-publish every discovered video.
   */
  media: z.array(ProductMediaSchema).default([]),
  pricing: z.unknown().optional(),
  domainCheckedAt: z.record(z.string(), IsoDateTimeSchema).default({}),
  sourceIds: z.array(z.string()).default([]),
  updatedAt: IsoDateTimeSchema.optional(),
  notes: z.string().optional(),
});

export type ProductResearchEnrichment = z.infer<
  typeof ProductResearchEnrichmentSchema
>;

void ResearchDomainSchema;
