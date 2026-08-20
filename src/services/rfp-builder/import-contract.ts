/**
 * Vendor response import contract.
 *
 * Vendor completes the Excel response workbook → buyer imports →
 * SoftwareGlimpse maps rows by stable requirement ID → Vendor Scorecard
 * receives evidence/reference inputs → Decision Matrix compares later.
 *
 * Full SheetJS parse can be added incrementally; this contract is the
 * stable boundary. Do not invent scores here — scoring belongs in Scorecard.
 */

import { z } from "zod";
import { RfpDeliveryMethodSchema } from "@/domain";

export const VendorRequirementResponseSchema = z.object({
  requirementId: z.string().min(1),
  vendorResponse: z.string().default(""),
  deliveryMethod: RfpDeliveryMethodSchema.optional(),
  editionTier: z.string().default(""),
  additionalCost: z.string().default(""),
  evidenceUrl: z.string().default(""),
  implementationDependency: z.string().default(""),
  comments: z.string().default(""),
});
export type VendorRequirementResponse = z.infer<
  typeof VendorRequirementResponseSchema
>;

export const VendorPricingResponseSchema = z.object({
  currency: z.string().default(""),
  annualSoftware: z.string().default(""),
  addOnsAnnual: z.string().default(""),
  implementationTotal: z.string().default(""),
  recurringServicesAnnual: z.string().default(""),
  year1: z.string().default(""),
  year2: z.string().default(""),
  year3: z.string().default(""),
  threeYearTco: z.string().default(""),
  implementationDuration: z.string().default(""),
});
export type VendorPricingResponse = z.infer<typeof VendorPricingResponseSchema>;

export const VendorResponsePackageSchema = z.object({
  contractVersion: z.literal(1),
  rfpVersion: z.string().min(1),
  vendorName: z.string().min(1),
  submittedAt: z.string().optional(),
  requirements: z.array(VendorRequirementResponseSchema).default([]),
  pricing: VendorPricingResponseSchema.optional(),
  assumptions: z.string().default(""),
  exceptions: z.string().default(""),
});
export type VendorResponsePackage = z.infer<typeof VendorResponsePackageSchema>;

/** Scorecard handoff shape — evidence keyed by stable requirement ID. */
export type ScorecardEvidenceHandoff = {
  vendorName: string;
  rfpVersion: string;
  evidenceByRequirementId: Record<
    string,
    {
      deliveryMethod?: string;
      evidenceUrl?: string;
      comments?: string;
      vendorResponse?: string;
    }
  >;
};

export function toScorecardEvidenceHandoff(
  pkg: VendorResponsePackage,
): ScorecardEvidenceHandoff {
  const evidenceByRequirementId: ScorecardEvidenceHandoff["evidenceByRequirementId"] =
    {};
  for (const row of pkg.requirements) {
    evidenceByRequirementId[row.requirementId] = {
      deliveryMethod: row.deliveryMethod,
      evidenceUrl: row.evidenceUrl || undefined,
      comments: row.comments || undefined,
      vendorResponse: row.vendorResponse || undefined,
    };
  }
  return {
    vendorName: pkg.vendorName,
    rfpVersion: pkg.rfpVersion,
    evidenceByRequirementId,
  };
}

/**
 * Parse a minimal JSON vendor response package.
 * Excel → JSON conversion can feed this same contract later.
 */
export function parseVendorResponsePackage(
  raw: unknown,
): VendorResponsePackage | null {
  const parsed = VendorResponsePackageSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export const VENDOR_RESPONSE_IMPORT_NOTES = [
  "Map by stable requirement ID only — never by row index.",
  "Do not compute vendor scores in RFP Builder.",
  "Unsupported / roadmap / third-party flags become Scorecard evidence inputs.",
  "Pricing cells remain strings until Cost Calculator / Scorecard consume them.",
] as const;
