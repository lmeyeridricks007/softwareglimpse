import {
  AffiliateCatalogueEntrySchema,
  type AffiliateCatalogueEntry,
} from "@/domain";
import {
  AFFILIATE_INVENTORY_COUNT,
  CATALOGUE_IMPORTED_AT,
  affiliateInventoryRows,
  type InventoryRow,
} from "@/data/catalogue/source/affiliate-inventory";

/**
 * Catalogue source adapter — decouples bulk onboarding from file format.
 */
export interface CatalogueSource {
  id: string;
  load(): Promise<AffiliateCatalogueEntry[]>;
}

function rowToEntry(row: InventoryRow): AffiliateCatalogueEntry {
  return AffiliateCatalogueEntrySchema.parse({
    sourceId: row.sourceId,
    rawName: row.rawName,
    status: row.status,
    clicks: row.clicks,
    conversions: row.conversions,
    revenue:
      row.revenueAmountMinor != null
        ? { amountMinor: row.revenueAmountMinor, currency: "USD" }
        : undefined,
    pendingRevenue:
      row.pendingRevenueAmountMinor != null
        ? { amountMinor: row.pendingRevenueAmountMinor, currency: "USD" }
        : undefined,
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
    importedAt: CATALOGUE_IMPORTED_AT,
  });
}

export class SeedCatalogueSource implements CatalogueSource {
  readonly id = "seed-affiliate-inventory";

  async load(): Promise<AffiliateCatalogueEntry[]> {
    return affiliateInventoryRows.map(rowToEntry);
  }
}

export class JsonCatalogueSource implements CatalogueSource {
  readonly id: string;
  constructor(
    private readonly rows: InventoryRow[],
    id = "json-affiliate-inventory",
  ) {
    this.id = id;
  }

  async load(): Promise<AffiliateCatalogueEntry[]> {
    return this.rows.map(rowToEntry);
  }
}

let activeSource: CatalogueSource = new SeedCatalogueSource();

export function setCatalogueSource(source: CatalogueSource): void {
  activeSource = source;
}

export function getCatalogueSource(): CatalogueSource {
  return activeSource;
}

export async function loadAffiliateCatalogue(): Promise<
  AffiliateCatalogueEntry[]
> {
  return activeSource.load();
}

export { AFFILIATE_INVENTORY_COUNT, CATALOGUE_IMPORTED_AT };
