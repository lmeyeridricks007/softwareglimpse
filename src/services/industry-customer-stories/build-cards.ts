import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
} from "@/services/product-media";
import { isMediaActivePublicDisplay } from "@/services/product-media/governance";
import { mediaLimitations, mediaWhatThisShows, type ProductMedia } from "@/domain";
import {
  DEFAULT_CUSTOMER_STORY_LIMITATIONS,
  VENDOR_CUSTOMER_STORY_LABEL,
  isOfficialCustomerCaseStudyMedia,
  sanitizeVendorCaseStudyClaim,
  type IndustryCustomerStoryCard,
} from "./types";

function isPublicOfficialStory(media: ProductMedia): {
  ok: boolean;
  reason?: string;
} {
  const m = enrichMediaFromSourceUrl(media);
  if (!isOfficialCustomerCaseStudyMedia(m)) {
    return { ok: false, reason: "not-customer-case-study" };
  }
  if (!m.officialSource) {
    return { ok: false, reason: "unofficial-source" };
  }
  if (m.type === "softwareglimpse-video") {
    return { ok: false, reason: "not-vendor-media" };
  }
  if (m.status === "unavailable" || m.status === "rejected") {
    return { ok: false, reason: "unavailable-or-rejected" };
  }
  if (m.sourceHealth === "unavailable") {
    return { ok: false, reason: "source-unavailable" };
  }
  if (m.industryRelevance === "weak") {
    return { ok: false, reason: "weak-relevance" };
  }
  if (!isMediaActivePublicDisplay(m)) {
    return { ok: false, reason: "not-active-public" };
  }
  const eligibility = isVideoPublicEligible(m);
  if (!eligibility.eligible) {
    return { ok: false, reason: eligibility.reasons[0] ?? "not-eligible" };
  }
  return { ok: true };
}

/**
 * Build industry-page customer story cards.
 * Excludes unofficial uploads and unavailable/deleted sources.
 */
export function buildIndustryCustomerStoryCards(input: {
  mediaPool: ProductMedia[];
  industrySlug: string;
  industryLabel: string;
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  limit?: number;
}): IndustryCustomerStoryCard[] {
  const limit = input.limit ?? 4;
  const productName = new Map(input.products.map((p) => [p.slug, p.name]));
  const productLogo = new Map(input.products.map((p) => [p.slug, p.logo]));

  const candidates = input.mediaPool
    .map((raw) => enrichMediaFromSourceUrl(raw))
    .filter((m) => {
      const check = isPublicOfficialStory(m);
      if (!check.ok) return false;
      // Prefer industry-tagged stories; allow untagged only when product is on page
      if (
        m.industryIds.length > 0 &&
        !m.industryIds.includes(input.industrySlug)
      ) {
        return false;
      }
      return productName.has(m.productSlug);
    })
    .sort((a, b) => {
      const aExact = a.industryIds.includes(input.industrySlug) ? 1 : 0;
      const bExact = b.industryIds.includes(input.industrySlug) ? 1 : 0;
      return bExact - aExact || a.id.localeCompare(b.id);
    });

  const cards: IndustryCustomerStoryCard[] = [];
  const seen = new Set<string>();

  for (const media of candidates) {
    if (cards.length >= limit) break;
    if (seen.has(media.id)) continue;
    seen.add(media.id);

    const name = productName.get(media.productSlug) ?? media.productSlug;
    const rawShows = [
      ...mediaWhatThisShows(media),
      ...(media.reportedOutcomes ?? []).map(
        (outcome) =>
          // Ensure vendor-reported outcomes are attributed before display.
          outcome.trim().startsWith("The vendor") ||
          outcome.trim().startsWith("The ")
            ? outcome
            : `Vendor-reported outcome: ${outcome}`,
      ),
    ];
    const illustrates = rawShows.map((line) =>
      sanitizeVendorCaseStudyClaim(line, { vendorName: name }),
    );

    const limitations = [
      ...new Set([
        ...mediaLimitations(media),
        ...DEFAULT_CUSTOMER_STORY_LIMITATIONS,
      ]),
    ];

    cards.push({
      id: media.id,
      productSlug: media.productSlug,
      productName: name,
      logo: productLogo.get(media.productSlug) ?? null,
      label: VENDOR_CUSTOMER_STORY_LABEL,
      companyName: media.customerOrganization?.trim() || null,
      industryLabel: input.industryLabel,
      media,
      title: media.title,
      whatThisStoryIllustrates: illustrates,
      whatItDoesNotEstablish: limitations,
      sourceOrganization:
        media.sourceOrganization?.trim() ||
        media.channelName?.trim() ||
        `Official ${name}`,
      sourceUrl: media.sourceUrl,
      verifiedAt: media.verifiedAt?.slice(0, 10) ?? null,
    });
  }

  return cards;
}

export function evaluateCustomerStoryPublicEligibility(media: ProductMedia) {
  return isPublicOfficialStory(media);
}
