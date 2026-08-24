import {
  getAllSoftwareUnfiltered,
  getMigrationRecords,
} from "@/data";
import {
  findAffiliateCatalogueEntry,
} from "@/data/seed/affiliate-catalogue";
import type { DuplicateOutcome, Software } from "@/domain";
import {
  normalizeIdentityKey,
  normalizeWebsiteHost,
} from "./identity";

export type DuplicateCheckResult = {
  outcome: DuplicateOutcome;
  matched?: Software;
  reason: string;
};

/**
 * Detect NEW / EXISTING / POSSIBLE_DUPLICATE / RENAMED_PRODUCT
 * before creating another canonical entity.
 */
export function checkDuplicateProduct(input: {
  name: string;
  slug: string;
  website?: string;
  aliases?: string[];
}): DuplicateCheckResult {
  const all = getAllSoftwareUnfiltered();
  const nameKey = normalizeIdentityKey(input.name);
  const slugKey = input.slug.toLowerCase();
  const aliasKeys = new Set(
    (input.aliases ?? []).map(normalizeIdentityKey).concat([nameKey]),
  );
  const host = input.website ? normalizeWebsiteHost(input.website) : null;

  // Reconcile path: slug already in seed — vendor-family website overlap is expected.
  const existingBySlug = all.find((product) => product.slug === slugKey);
  if (existingBySlug) {
    return {
      outcome: "EXISTING",
      matched: existingBySlug,
      reason: `Slug already exists: ${existingBySlug.slug}`,
    };
  }

  for (const product of all) {

    const productKeys = new Set(
      [
        product.name,
        product.slug,
        ...(product.aliases ?? []),
        ...(product.formerlyKnownAs ?? []),
      ].map(normalizeIdentityKey),
    );

    for (const key of aliasKeys) {
      if (productKeys.has(key) && product.slug !== slugKey) {
        const renamed =
          product.formerlyKnownAs?.some(
            (f) => normalizeIdentityKey(f) === nameKey,
          ) ||
          product.aliases?.some((a) => normalizeIdentityKey(a) === nameKey);
        return {
          outcome: renamed ? "RENAMED_PRODUCT" : "POSSIBLE_DUPLICATE",
          matched: product,
          reason: `Name/alias overlaps existing product ${product.slug}`,
        };
      }
    }

    if (host && product.website) {
      const existingHost = normalizeWebsiteHost(product.website);
      if (existingHost && existingHost === host) {
        return {
          outcome: "POSSIBLE_DUPLICATE",
          matched: product,
          reason: `Website host matches existing product ${product.slug}`,
        };
      }
    }
  }

  const migrations = getMigrationRecords();
  for (const record of migrations) {
    const hay = `${record.source ?? ""} ${record.notes ?? ""} ${record.target ?? ""}`.toLowerCase();
    if (hay.includes(slugKey) || hay.includes(nameKey)) {
      return {
        outcome: "POSSIBLE_DUPLICATE",
        reason: `Migration ledger mentions ${input.slug} — review before create`,
      };
    }
  }

  const affiliate = findAffiliateCatalogueEntry(input.slug) ??
    findAffiliateCatalogueEntry(input.name);
  if (affiliate && affiliate.suggestedSlug !== slugKey) {
    // Catalogue hint only — not a duplicate by itself
  }

  return {
    outcome: "NEW",
    reason: "No matching slug, alias, or website host found",
  };
}
