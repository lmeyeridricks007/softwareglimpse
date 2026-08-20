import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

export const LegalDocumentStatusSchema = z.enum([
  "draft",
  "legal-review-required",
  "approved",
  "published",
]);

export type LegalDocumentStatus = z.infer<typeof LegalDocumentStatusSchema>;

export const LegalBasisSchema = z.enum([
  "consent",
  "contract",
  "legal-obligation",
  "legitimate-interest",
  "other",
]);

export type LegalBasis = z.infer<typeof LegalBasisSchema>;

export const CookieCategorySchema = z.enum([
  "strictly-necessary",
  "preferences",
  "analytics",
  "marketing",
]);

export type CookieCategory = z.infer<typeof CookieCategorySchema>;

export const AuthorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: SlugSchema,
  role: z.string().optional(),
  shortBio: z.string().optional(),
  fullBio: z.string().optional(),
  photoPath: z.string().optional(),
  expertise: z.array(z.string()).default([]),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional(),
      youtube: z.string().url().optional(),
      other: z.string().url().optional(),
    })
    .default({}),
  disclosure: z.string().optional(),
});

export type Author = z.infer<typeof AuthorSchema>;

export const SiteIdentitySchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().min(1),
  /** Public brand name — may differ from legal controller name */
  brandName: z.string().min(1),
  /** Leave empty until configured — audit fails if required pages published without this */
  legalEntityName: z.string().optional(),
  registrationNumber: z.string().optional(),
  country: z.string().optional(),
  businessAddress: z.string().optional(),
  contactEmail: z.string().email().optional(),
  privacyEmail: z.string().email().optional(),
  supportEmail: z.string().email().optional(),
  founderAuthorId: z.string().optional(),
  socialProfiles: z
    .object({
      linkedin: z.string().url().optional(),
      youtube: z.string().url().optional(),
      x: z.string().url().optional(),
    })
    .default({}),
  configurationComplete: z.boolean().default(false),
  missingFields: z.array(z.string()).default([]),
});

export type SiteIdentity = z.infer<typeof SiteIdentitySchema>;

export const DataProcessorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  purpose: z.string().min(1),
  privacyPolicyUrl: z.string().url().optional(),
  dataLocation: z.string().optional(),
  transferMechanism: z.string().optional(),
  configured: z.boolean().default(false),
});

export type DataProcessor = z.infer<typeof DataProcessorSchema>;

export const ProcessingActivitySchema = z.object({
  id: z.string().min(1),
  purpose: z.string().min(1),
  dataCategories: z.array(z.string().min(1)).min(1),
  legalBasis: LegalBasisSchema,
  recipients: z.array(z.string()).default([]),
  retention: z.string().optional(),
  internationalTransfer: z
    .object({
      destination: z.string().optional(),
      mechanism: z.string().optional(),
    })
    .optional(),
  source: z.string().min(1),
  active: z.boolean().default(true),
});

export type ProcessingActivity = z.infer<typeof ProcessingActivitySchema>;

export const CookieDefinitionSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  purpose: z.string().min(1),
  category: CookieCategorySchema,
  duration: z.string().min(1),
  firstParty: z.boolean().default(true),
  storageType: z
    .enum(["cookie", "localStorage", "sessionStorage"])
    .default("cookie"),
});

export type CookieDefinition = z.infer<typeof CookieDefinitionSchema>;

export const ConsentPolicySchema = z.object({
  version: z.string().min(1),
  effectiveAt: z.string().min(1),
  /** Days before re-prompt if version unchanged */
  renewAfterDays: z.number().int().positive().default(365),
  categoriesInUse: z.array(CookieCategorySchema).default([
    "strictly-necessary",
    "preferences",
  ]),
  analyticsRequiresConsent: z.boolean().default(true),
  marketingRequiresConsent: z.boolean().default(true),
  bannerTitle: z.string().optional(),
  bannerBody: z.string().optional(),
  categoryDescriptions: z
    .object({
      strictlyNecessary: z.string().optional(),
      preferences: z.string().optional(),
      analytics: z.string().optional(),
      marketing: z.string().optional(),
    })
    .default({}),
});

export type ConsentPolicy = z.infer<typeof ConsentPolicySchema>;

export const NewsletterConfigSchema = z.object({
  enabled: z.boolean().default(false),
  name: z.string().min(1),
  description: z.string().min(1),
  frequencyExpectation: z.string().min(1),
  senderLabel: z.string().optional(),
  providerId: z.string().optional(),
  doubleOptIn: z.boolean().default(true),
  consentCopy: z.string().min(1),
  footerTeaser: z.string().optional(),
  inlineTeaser: z.string().optional(),
  popupHeadline: z.string().optional(),
  popupBody: z.string().optional(),
  confirmIntro: z.string().optional(),
  thanksBody: z.string().optional(),
  preferencesIntro: z.string().optional(),
  popupEnabled: z.boolean().default(false),
  popupTrigger: z
    .enum(["manual", "scroll", "second-page", "exit-intent"])
    .default("manual"),
  popupMinSeconds: z.number().int().nonnegative().default(45),
});

export type NewsletterConfig = z.infer<typeof NewsletterConfigSchema>;

export const ContactReasonSchema = z.enum([
  "general",
  "correction",
  "vendor",
  "affiliate",
  "advertising",
  "privacy",
  "technical",
]);

export type ContactReason = z.infer<typeof ContactReasonSchema>;

export const ContactConfigSchema = z.object({
  enabled: z.boolean().default(true),
  reasons: z.array(ContactReasonSchema).default([
    "general",
    "correction",
    "vendor",
    "affiliate",
    "advertising",
    "privacy",
    "technical",
  ]),
  introCopy: z.string().optional(),
  correctionPrompt: z.string().optional(),
  privacyAcknowledgementCopy: z.string().min(1),
  rateLimitPerHour: z.number().int().positive().default(10),
  maxMessageLength: z.number().int().positive().default(5000),
});

export type ContactConfig = z.infer<typeof ContactConfigSchema>;

export const LegalDocumentSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  path: z.string().startsWith("/"),
  title: z.string().min(1),
  summary: z.string().optional(),
  status: LegalDocumentStatusSchema.default("draft"),
  version: z.string().min(1).default("0.1.0"),
  effectiveAt: z.string().optional(),
  lastUpdatedAt: z.string().optional(),
  approvedAt: z.string().optional(),
  indexable: z.boolean().default(false),
  sections: z
    .array(
      z.object({
        id: z.string().min(1),
        heading: z.string().min(1),
        body: z.string().min(1),
      }),
    )
    .default([]),
  dependsOn: z.array(z.string()).default([]),
});

export type LegalDocument = z.infer<typeof LegalDocumentSchema>;

export const SiteFoundationConfigSchema = z.object({
  identity: SiteIdentitySchema,
  authors: z.array(AuthorSchema).default([]),
  processors: z.array(DataProcessorSchema).default([]),
  processingActivities: z.array(ProcessingActivitySchema).default([]),
  cookies: z.array(CookieDefinitionSchema).default([]),
  consent: ConsentPolicySchema,
  newsletter: NewsletterConfigSchema,
  contact: ContactConfigSchema,
  legalDocuments: z.array(LegalDocumentSchema).default([]),
  retention: z
    .object({
      contactSubmissions: z.string().optional(),
      newsletterMetadata: z.string().optional(),
      consentRecords: z.string().optional(),
      analytics: z.string().optional(),
      serverLogs: z.string().optional(),
    })
    .default({}),
  terms: z
    .object({
      governingLaw: z.string().optional(),
    })
    .default({}),
});

export type SiteFoundationConfig = z.infer<typeof SiteFoundationConfigSchema>;

export const ConsentRecordSchema = z.object({
  version: z.string().min(1),
  decidedAt: IsoDateTimeSchema,
  categories: z.object({
    strictlyNecessary: z.boolean().default(true),
    preferences: z.boolean().default(false),
    analytics: z.boolean().default(false),
    marketing: z.boolean().default(false),
  }),
});

export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;

export const NewsletterSubscriptionStatusSchema = z.enum([
  "submitted",
  "pending-confirmation",
  "subscribed",
  "unsubscribed",
]);

export type NewsletterSubscriptionStatus = z.infer<
  typeof NewsletterSubscriptionStatusSchema
>;
