/**
 * Affiliate catalogue seed facade.
 * Canonical inventory lives in catalogue/source; this preserves onboarding helpers.
 * Public pages must never expose payouts. Never affect editorial scores.
 */
import {
  loadAffiliateCatalogue,
  AFFILIATE_INVENTORY_COUNT,
} from "@/data/catalogue/source";
import type { AffiliateCatalogueEntry as DomainEntry } from "@/domain";
import { slugifyProductName } from "@/services/onboarding/identity";
import { affiliateInventoryRows } from "@/data/catalogue/source/affiliate-inventory";

/** Legacy shape consumed by software/category onboarding. */
export type AffiliateCatalogueEntry = {
  id: string;
  productName: string;
  suggestedSlug: string;
  website?: string;
  network:
    | "impact"
    | "partnerstack"
    | "shareasale"
    | "cj"
    | "awin"
    | "direct"
    | "other"
    | "none";
  categoryHint?: string;
  aliases?: string[];
  entityTypeHint?: "software" | "service" | "marketplace" | "platform" | "hybrid";
  notes?: string;
};

function toLegacy(entry: DomainEntry): AffiliateCatalogueEntry {
  return {
    id: entry.sourceId,
    productName: entry.rawName,
    suggestedSlug: slugifyProductName(
      entry.multiProductHint
        ? entry.splitCandidates[0] ?? entry.rawName
        : entry.rawName
            .replace(/\s+by\s+.+$/i, "")
            .replace(/\s+Communications Inc\.?$/i, "")
            .replace(/\s*[-–—].+$/, ""),
    ),
    website: entry.website,
    network: entry.network,
    categoryHint: entry.categoryHint,
    aliases: entry.aliases,
    entityTypeHint: entry.entityTypeHint,
    notes: entry.notes,
  };
}

/** Sync view of inventory for callers that cannot await. */
export const affiliateCatalogueSeed: AffiliateCatalogueEntry[] =
  affiliateInventoryRows.map((row) =>
    toLegacy({
      sourceId: row.sourceId,
      rawName: row.rawName,
      status: row.status,
      clicks: row.clicks,
      conversions: row.conversions,
      website: row.website,
      network: row.network ?? "other",
      categoryHint: row.categoryHint,
      aliases: row.aliases ?? [],
      entityTypeHint: row.entityTypeHint,
      vendorFamily: row.vendorFamily,
      multiProductHint: row.multiProductHint ?? false,
      splitCandidates: row.splitCandidates ?? [],
      notes: row.notes,
      sourceMetadata: {},
      importedAt: "2026-08-13T12:00:00.000Z",
    }),
  );

export function findAffiliateCatalogueEntry(
  nameOrSlug: string,
): AffiliateCatalogueEntry | undefined {
  const key = nameOrSlug.trim().toLowerCase().replace(/\s+/g, "");
  return affiliateCatalogueSeed.find((entry) => {
    const slug = entry.suggestedSlug.toLowerCase();
    const name = entry.productName.toLowerCase().replace(/\s+/g, "");
    const aliases = (entry.aliases ?? []).map((a) =>
      a.toLowerCase().replace(/\s+/g, ""),
    );
    return (
      slug === nameOrSlug.toLowerCase() ||
      name === key ||
      aliases.includes(key) ||
      entry.id === nameOrSlug
    );
  });
}

export async function loadLegacyAffiliateCatalogue(): Promise<
  AffiliateCatalogueEntry[]
> {
  const entries = await loadAffiliateCatalogue();
  return entries.map(toLegacy);
}

export { AFFILIATE_INVENTORY_COUNT };
