import { getSoftwareBySlug } from "@/data";
import {
  listAffiliateDestinations,
  listAffiliateProgrammes,
  listPromotions,
  saveAffiliateDestinations,
  saveAffiliateProgrammes,
  savePromotions,
  upsertAffiliateDestination,
  upsertAffiliateProgramme,
  upsertPromotion,
} from "@/data/affiliates/store";
import type {
  AffiliateDestinationType,
  AffiliateNetwork,
  PromotionType,
} from "@/domain";
import { setAffiliateDestination, addPromotion } from "./manage";
import { validateAffiliateUrl } from "./url-validation";

export type AffiliateImportRow = {
  product: string;
  affiliate_url?: string;
  status?: string;
  programme?: string;
  network?: string;
  destination_type?: string;
  promotion?: string;
  promo_code?: string;
  starts_at?: string;
  ends_at?: string;
  no_expiry?: string;
};

export type AffiliateImportPlan = {
  matched: { product: string; action: string }[];
  unknownProducts: string[];
  invalidUrls: { product: string; url: string; reason: string }[];
  duplicateDefaults: string[];
  promotionsToCreate: { product: string; headline: string }[];
  programmeMappings: { product: string; programme: string }[];
};

function parseCsv(text: string): AffiliateImportRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]!).map((h) => h.toLowerCase());
  const rows: AffiliateImportRow[] = [];
  for (const line of lines.slice(1)) {
    const cols = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    rows.push(row as AffiliateImportRow);
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

export function planAffiliateImport(csvText: string): AffiliateImportPlan {
  const rows = parseCsv(csvText);
  const plan: AffiliateImportPlan = {
    matched: [],
    unknownProducts: [],
    invalidUrls: [],
    duplicateDefaults: [],
    promotionsToCreate: [],
    programmeMappings: [],
  };

  const defaultSeen = new Set<string>();

  for (const row of rows) {
    const slug = (row.product || "").trim().toLowerCase();
    if (!slug) continue;
    const product = getSoftwareBySlug(slug, { includeUnpublished: true });
    if (!product) {
      plan.unknownProducts.push(slug);
      continue;
    }

    if (row.affiliate_url) {
      const v = validateAffiliateUrl(row.affiliate_url);
      if (!v.ok) {
        plan.invalidUrls.push({
          product: slug,
          url: row.affiliate_url,
          reason: v.message,
        });
      } else {
        plan.matched.push({
          product: slug,
          action: `set ${row.destination_type || "homepage"} destination`,
        });
        if (defaultSeen.has(slug)) plan.duplicateDefaults.push(slug);
        defaultSeen.add(slug);
      }
    }

    if (row.programme) {
      plan.programmeMappings.push({ product: slug, programme: row.programme });
    }
    if (row.promotion) {
      plan.promotionsToCreate.push({ product: slug, headline: row.promotion });
    }
  }

  return plan;
}

export function applyAffiliateImport(
  csvText: string,
  options?: { dryRun?: boolean },
): { plan: AffiliateImportPlan; applied: number; errors: string[] } {
  const plan = planAffiliateImport(csvText);
  if (options?.dryRun) {
    return { plan, applied: 0, errors: [] };
  }

  let applied = 0;
  const errors: string[] = [];
  const rows = parseCsv(csvText);

  for (const row of rows) {
    const slug = (row.product || "").trim().toLowerCase();
    if (!slug || plan.unknownProducts.includes(slug)) continue;
    if (!row.affiliate_url) continue;
    if (plan.invalidUrls.some((u) => u.product === slug)) continue;

    const result = setAffiliateDestination({
      productSlug: slug,
      url: row.affiliate_url,
      destinationType: (row.destination_type ||
        "homepage") as AffiliateDestinationType,
      isDefault: true,
      programmeName: row.programme,
      network: (row.network || "other") as AffiliateNetwork,
    });
    if (!result.ok) {
      errors.push(`${slug}: ${result.message}`);
      continue;
    }
    applied += 1;

    if (row.promotion) {
      const promo = addPromotion({
        productSlug: slug,
        headline: row.promotion,
        promoCode: row.promo_code || undefined,
        startsAt: row.starts_at || undefined,
        endsAt: row.ends_at || undefined,
        noExpiry: row.no_expiry === "true" || (!row.ends_at && !row.starts_at),
        promotionType: "other" as PromotionType,
        source: "bulk-import",
      });
      if (!promo.ok) errors.push(`${slug} promo: ${promo.message}`);
      else applied += 1;
    }
  }

  return { plan, applied, errors };
}

export function exportAffiliateSnapshot(): {
  programmes: ReturnType<typeof listAffiliateProgrammes>;
  destinations: ReturnType<typeof listAffiliateDestinations>;
  promotions: ReturnType<typeof listPromotions>;
} {
  // Strip nothing secret — credentials must never be stored here.
  return {
    programmes: listAffiliateProgrammes().map((p) => ({
      ...p,
      notes: p.notes,
    })),
    destinations: listAffiliateDestinations(),
    promotions: listPromotions(),
  };
}

/** Idempotent empty save helper for tests. */
export function ensureAffiliateDataFiles(): void {
  saveAffiliateProgrammes(listAffiliateProgrammes());
  saveAffiliateDestinations(listAffiliateDestinations());
  savePromotions(listPromotions());
}

// silence unused in case of tree-shaking edge cases
void upsertAffiliateProgramme;
void upsertAffiliateDestination;
void upsertPromotion;
