import {
  NormalizedCatalogueCandidateSchema,
  type AffiliateCatalogueEntry,
  type NormalizedCatalogueCandidate,
} from "@/domain";
import { slugifyProductName } from "@/services/onboarding/identity";

const CORPORATE_SUFFIXES =
  /\s+(communications\s+inc\.?|inc\.?|llc\.?|ltd\.?|corp\.?|corporation|co\.?)$/i;
const BY_VENDOR = /\s+by\s+.+$/i;
const PROGRAM_DASH = /\s*[-–—]\s*.+$/;
const TOP_RATED =
  /\s*[-–—]\s*top\s+user[- ]rated.+$/i;

/**
 * Deterministic, conservative name normalization.
 * Does not invent identity — identity resolver confirms canonical names.
 */
export function normalizeCatalogueEntry(
  entry: AffiliateCatalogueEntry,
): NormalizedCatalogueCandidate {
  const rawName = entry.rawName.trim().replace(/\s+/g, " ");
  let normalizedName = rawName;

  if (!entry.multiProductHint) {
    normalizedName = normalizedName
      .replace(TOP_RATED, "")
      .replace(BY_VENDOR, "")
      .replace(CORPORATE_SUFFIXES, "")
      .replace(PROGRAM_DASH, "")
      .trim();
    // If dash strip emptied or over-stripped short brands, fall back
    if (normalizedName.length < 2) normalizedName = rawName;
  }

  const suggestedSlug = entry.multiProductHint
    ? `multi-${slugifyProductName(rawName).slice(0, 40)}`
    : slugifyProductName(normalizedName);

  return NormalizedCatalogueCandidateSchema.parse({
    sourceId: entry.sourceId,
    rawName,
    normalizedName,
    suggestedSlug,
    website: entry.website,
    aliases: entry.aliases,
    categoryHint: entry.categoryHint,
    vendorFamily: entry.vendorFamily,
    multiProductHint: entry.multiProductHint,
    splitCandidates: entry.splitCandidates,
    entityTypeHint: entry.entityTypeHint,
    network: entry.network,
    affiliateStatus: entry.status,
    commercial: {
      clicks: entry.clicks ?? 0,
      conversions: entry.conversions ?? 0,
      revenueAmount: entry.revenue?.amountMinor ?? 0,
      pendingRevenueAmount: entry.pendingRevenue?.amountMinor ?? 0,
    },
    notes: entry.notes,
  });
}

export function normalizeCatalogueEntries(
  entries: AffiliateCatalogueEntry[],
): NormalizedCatalogueCandidate[] {
  return entries.map(normalizeCatalogueEntry);
}
