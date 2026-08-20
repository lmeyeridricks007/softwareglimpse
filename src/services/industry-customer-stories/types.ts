import type { ProductMedia } from "@/domain";

export const VENDOR_CUSTOMER_STORY_LABEL =
  "VENDOR-PUBLISHED CUSTOMER STORY" as const;

export type IndustryCustomerStoryCard = {
  id: string;
  productSlug: string;
  productName: string;
  logo?: { src: string; alt: string } | null;
  /** Always vendor-published labeling — never "Independent case study". */
  label: typeof VENDOR_CUSTOMER_STORY_LABEL;
  companyName: string | null;
  industryLabel: string;
  media: ProductMedia;
  title: string;
  /** Sanitized illustrations — vendor claims attributed, not restated as SG facts. */
  whatThisStoryIllustrates: string[];
  whatItDoesNotEstablish: string[];
  sourceOrganization: string;
  sourceUrl: string;
  verifiedAt: string | null;
};

export const DEFAULT_CUSTOMER_STORY_LIMITATIONS = [
  "typical ROI or average outcomes for your organization",
  "guaranteed results",
  "comparative superiority versus other products",
  "that the featured customer’s results will transfer to your team",
  "regulatory compliance or security suitability",
] as const;

/**
 * Detect strong marketing / outcome claims that must not become SG facts.
 */
export function looksLikeVendorOutcomeClaim(text: string): boolean {
  const t = text.toLowerCase();
  return (
    /\b\d+(\.\d+)?%\b/.test(t) ||
    /\b(roi|return on investment)\b/.test(t) ||
    /\b(increased|improved|boosted|grew|reduced|cut|saved|generated)\b/.test(
      t,
    ) ||
    /\b(x\s*times|\d+x)\b/.test(t) ||
    /\b(double|triple|quadruple)\b/.test(t) ||
    /\b(guaranteed|proven to|#1|best in class|market leader)\b/.test(t)
  );
}

/**
 * Attribute vendor testimonial outcomes — never restate as SoftwareGlimpse facts.
 *
 * Vendor: "Product increased conversion by 40%"
 * SG:     "The vendor case study reports a 40% improvement."
 */
export function sanitizeVendorCaseStudyClaim(
  text: string,
  options?: { vendorName?: string },
): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;

  const alreadyAttributed =
    /^(the vendor( case study)?|this (vendor )?case study|according to the vendor)\b/i.test(
      trimmed,
    );
  if (alreadyAttributed) return trimmed;

  if (!looksLikeVendorOutcomeClaim(trimmed)) {
    return trimmed;
  }

  const vendor = options?.vendorName?.trim();
  const prefix = vendor
    ? `The ${vendor} case study reports`
    : "The vendor case study reports";

  const pct = trimmed.match(/(\d+(?:\.\d+)?%)/);
  if (pct) {
    const topicMatch = trimmed.match(
      /\b(conversion|pipeline|revenue|leads|sales|productivity|retention|efficiency)\b/i,
    );
    const topicBit = topicMatch
      ? ` in ${topicMatch[1].toLowerCase()}`
      : "";
    return `${prefix} a ${pct[1]} improvement${topicBit}.`;
  }

  return `${prefix}: ${trimmed.replace(/\.$/, "")}.`;
}

export function isOfficialCustomerCaseStudyMedia(media: ProductMedia): boolean {
  if (media.type === "official-customer-case-study") return true;
  if (media.mediaContext === "customer-case-study") return true;
  return false;
}
