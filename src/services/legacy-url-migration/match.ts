import type {
  LegacyUrlMigrationRecord,
  NewUrlInventoryRow,
} from "./types";
import { classifyLegacyPath } from "./classify";
import { normalizeMigrationPath } from "./normalize";

/** Explicit high-confidence legacy → new path maps. */
export const LEGACY_PATH_ALIASES: Record<
  string,
  { target: string | null; note?: string }
> = {
  "/": { target: "/" },
  "/software/": { target: "/software/" },
  "/guides/": { target: "/guides/" },
  "/contact/": { target: "/company/contact/" },
  "/privacy-policy/": { target: "/legal/privacy/" },
  "/best-crms/": { target: "/best/crm-software/" },
  "/copper-crm-alternatives/": {
    target: "/software/copper/",
    note: "No /alternatives/copper/ yet — interim product merge",
  },
  "/category/crm/": { target: "/categories/crm/" },
  "/category/best-crms/": { target: "/best/crm-software/" },
  "/category/crm-guides/": { target: "/guides/" },
  "/category/crm-comparisons/": { target: "/compare/" },

  "/pipedrive-crm-review/": { target: "/software/pipedrive/" },
  "/hubspot-crm-review/": { target: "/software/hubspot/" },
  "/salesforce-crm-review/": { target: "/software/salesforce/" },
  "/zoho-crm-review/": { target: "/software/zoho-crm/" },
  "/freshsales-crm-review/": { target: "/software/freshsales/" },
  "/close-crm-review/": { target: "/software/close/" },
  "/folk-crm-review/": { target: "/software/folk/" },
  "/folk-app-review/": { target: "/software/folk/" },
  "/keap-crm-review/": { target: "/software/keap/" },
  "/keap-crm-review-2/": { target: "/software/keap/" },
  "/capsule-crm-review/": { target: "/software/capsule/" },
  "/capsule-crm-review-2/": { target: "/software/capsule/" },
  "/insightly-crm-review/": { target: "/software/insightly/" },
  "/activecampaign-crm-review/": { target: "/software/activecampaign/" },
  "/getresponse-review/": { target: "/software/getresponse/" },
  "/lusha-review/": { target: "/software/lusha/" },
  "/closely-review/": { target: "/software/closely/" },
  "/sugar-crm-review/": { target: "/software/sugarcrm/" },
  "/microsoft-dynamics-crm-review/": { target: "/software/dynamics-365/" },
  "/monday-crm-review/": { target: "/software/monday-sales-crm/" },
  "/monday-com-review/": { target: "/software/monday-sales-crm/" },
  "/infusionsoft-crm-review/": { target: "/software/keap/" },

  // Known no-catalogue CRM reviews (retirement / rewrite candidates)
  "/mailchimp-crm-review/": { target: null },
  "/mailchimp-crm-review-2/": { target: null },
  "/nimble-crm-review/": { target: null },
  "/podio-crm-review/": { target: null },
  "/agile-crm-review/": { target: null },
  "/apptivo-crm-review/": { target: null },
  "/affinity-crm-review/": { target: null },
  "/cloze-crm-review/": { target: null },
  "/netsuite-crm-review/": { target: null },
  "/pega-crm-review/": { target: null },
  "/pipelinepro-review/": { target: null },
  "/wealthbox-crm-review/": { target: null },
  "/zendesk-crm-review/": { target: null },

  // Prefixed comparison duplicates → canonical compare routes
  "/comparing-setup-pipedrive-vs-hubspot/": {
    target: "/compare/hubspot-vs-pipedrive/",
  },
  "/comparing-setup-salesforce-vs-pipedrive/": {
    target: "/compare/pipedrive-vs-salesforce/",
  },
  "/the-ultimate-guide-to-pipedrive-vs-hubspot/": {
    target: "/compare/hubspot-vs-pipedrive/",
  },
  "/the-ultimate-guide-to-salesforce-vs-pipedrive/": {
    target: "/compare/pipedrive-vs-salesforce/",
  },
  "/hubspot-vs-infusionsoft/": { target: "/compare/hubspot-vs-keap/" },
  "/hubspot-vs-monday-2/": { target: "/compare/hubspot-vs-monday-sales-crm/" },
  "/salesforce-vs-infusionsoft/": { target: "/compare/keap-vs-salesforce/" },

  // Vertical best-CRM → dedicated industry hubs
  "/best-crm-for-plumbers/": { target: "/industries/plumbing/" },
  "/best-crm-solar-businesses/": { target: "/industries/solar/" },
  "/best-crm-for-event-management/": {
    target: "/industries/event-management/",
  },
  "/best-private-equity-crm/": { target: "/industries/private-equity/" },
  "/best-crm-venture-capital/": { target: "/industries/venture-capital/" },
  "/best-crm-for-photographers/": { target: "/industries/photography/" },
  "/best-crm-for-coaches/": { target: "/industries/coaching/" },
  "/best-crm-for-investor-relations/": {
    target: "/industries/investor-relations/",
  },
  "/best-crm-engineering/": { target: "/industries/engineering/" },
  "/best-crm-for-musicians/": { target: "/industries/music/" },
  "/best-crm-for-web-designers/": { target: "/industries/web-design/" },
  "/crm-for-security-companies/": {
    target: "/industries/security-companies/",
  },
};

const PRODUCT_TOKEN_MAP: Record<string, string> = {
  "microsoft-dynamics": "dynamics-365",
  dynamics: "dynamics-365",
  monday: "monday-sales-crm",
  "monday-com": "monday-sales-crm",
  zoho: "zoho-crm",
  sugar: "sugarcrm",
  "folk-app": "folk",
  infusionsoft: "keap",
};

function indexBySlug(
  rows: NewUrlInventoryRow[],
  pageType: string,
): Map<string, NewUrlInventoryRow> {
  const map = new Map<string, NewUrlInventoryRow>();
  for (const row of rows) {
    if (row.pageType !== pageType) continue;
    const slug = row.path.replace(/^\/|\/$/g, "").split("/").pop();
    if (slug) map.set(slug, row);
  }
  return map;
}

function mapProductToken(token: string): string {
  const cleaned = token.replace(/-crm$/, "");
  return PRODUCT_TOKEN_MAP[cleaned] ?? cleaned;
}

function matchComparison(
  slug: string,
  comparisons: Map<string, NewUrlInventoryRow>,
  software: Set<string>,
): NewUrlInventoryRow | undefined {
  let working = slug;
  for (const pref of [
    "the-ultimate-guide-to-",
    "comparing-setup-",
    "a-guide-to-",
  ]) {
    if (working.startsWith(pref)) working = working.slice(pref.length);
  }
  working = working.replace(/-\d+$/, "");
  const m = /^(.+?)-vs-(.+)$/.exec(working);
  if (!m) return undefined;
  const a = mapProductToken(m[1]!);
  const b = mapProductToken(m[2]!);
  for (const [left, right] of [
    [a, b],
    [b, a],
  ] as const) {
    const key = `${left}-vs-${right}`;
    const hit = comparisons.get(key);
    if (hit) return hit;
  }
  // Both in catalogue but compare page missing → still useful signal via undefined
  if (software.has(a) && software.has(b)) return undefined;
  return undefined;
}

function matchReview(
  slug: string,
  software: Map<string, NewUrlInventoryRow>,
): NewUrlInventoryRow | undefined {
  const m = /^(.+?)(?:-crm)?-review(?:-\d+)?$/.exec(slug);
  if (!m) return undefined;
  const cand = mapProductToken(m[1]!);
  return software.get(cand) ?? software.get(`${cand}-crm`);
}

function applyNew(
  record: LegacyUrlMigrationRecord,
  row: NewUrlInventoryRow | undefined,
): void {
  if (!row) {
    record.newUrl = null;
    record.newPath = null;
    record.newTitle = null;
    record.newPageType = null;
    record.newIndexable = null;
    return;
  }
  record.newUrl = row.url;
  record.newPath = row.path;
  record.newTitle = row.title;
  record.newPageType = row.pageType;
  record.newIndexable = row.indexable;
}

/**
 * Produce a migration recommendation for one legacy URL against the new inventory.
 */
export function matchLegacyToNew(
  legacyUrlOrPath: string,
  newInventory: NewUrlInventoryRow[],
  extras: {
    sitemap?: string;
    lastmod?: string | null;
    legacyStatus?: number | null;
    legacyTitle?: string | null;
    legacyCanonical?: string | null;
  } = {},
): LegacyUrlMigrationRecord {
  const legacyPath = normalizeMigrationPath(legacyUrlOrPath);
  const legacyPageType = classifyLegacyPath(legacyPath);
  const byPath = new Map(newInventory.map((r) => [r.path, r]));
  const software = indexBySlug(newInventory, "software");
  const comparisons = indexBySlug(newInventory, "comparison");
  const best = indexBySlug(newInventory, "best");
  const alternatives = indexBySlug(newInventory, "alternatives");
  const guides = indexBySlug(newInventory, "guide");
  const softwareSlugs = new Set(software.keys());

  const segs = legacyPath.split("/").filter(Boolean);
  const slug = segs[0] ?? "";

  const record: LegacyUrlMigrationRecord = {
    legacyUrl: `https://www.softwareglimpse.com${legacyPath}`,
    legacyPath,
    legacyStatus: extras.legacyStatus ?? null,
    legacyTitle: extras.legacyTitle ?? null,
    legacyCanonical: extras.legacyCanonical ?? null,
    legacyIndexable: !["wp_tag", "wp_author", "kadence_element"].includes(
      legacyPageType,
    ),
    legacyPageType,
    sitemap: extras.sitemap,
    lastmod: extras.lastmod ?? null,
    relationship: "UNKNOWN",
    recommendedAction: "REVIEW",
    confidence: "LOW",
    reason: "No automatic equivalent; editorial decision required",
    seoRisk: "medium",
    notes: [],
  };

  if (byPath.has(legacyPath)) {
    applyNew(record, byPath.get(legacyPath));
    record.relationship = "EXACT";
    record.recommendedAction = "KEEP";
    record.confidence = "HIGH";
    record.reason = "Identical path exists in new app";
    record.seoRisk = "low";
    return record;
  }

  const alias = LEGACY_PATH_ALIASES[legacyPath];
  if (alias) {
    if (alias.target === null) {
      record.relationship = "NO_EQUIVALENT";
      record.recommendedAction = "REVIEW";
      record.confidence = "MEDIUM";
      record.reason =
        "Mapped as no catalogue equivalent; decide retire vs keep/rewrite content";
      record.seoRisk = "high";
      if (alias.note) record.notes?.push(alias.note);
      return record;
    }
    const dest = byPath.get(alias.target);
    applyNew(record, dest);
    if (!dest) {
      record.relationship = "NO_EQUIVALENT";
      record.recommendedAction = "REVIEW";
      record.confidence = "MEDIUM";
      record.reason = `Alias target ${alias.target} missing from new inventory`;
      record.seoRisk = "high";
      return record;
    }
    const isDup = /-\d+\/$/.test(legacyPath);
    const isMerge =
      legacyPath.includes("ultimate-guide") ||
      legacyPath.includes("comparing-setup") ||
      legacyPageType === "best_list" ||
      alias.note?.includes("interim");
    record.relationship = isDup
      ? "DUPLICATE"
      : isMerge
        ? "MERGED_INTO"
        : "EQUIVALENT";
    record.recommendedAction = isMerge ? "MERGE_AND_301" : "301_REDIRECT";
    record.confidence = "HIGH";
    record.reason = alias.note ?? `Explicit alias → ${alias.target}`;
    record.seoRisk =
      legacyPageType === "product_review" ||
      legacyPageType === "best_list" ||
      legacyPageType === "comparison"
        ? "high"
        : "medium";
    return record;
  }

  if (legacyPageType === "product_review") {
    const hit = matchReview(slug, software);
    if (hit) {
      applyNew(record, hit);
      record.relationship = /-\d+\/$/.test(legacyPath)
        ? "DUPLICATE"
        : "EQUIVALENT";
      record.recommendedAction = "301_REDIRECT";
      record.confidence = "HIGH";
      record.reason = `Review slug maps to ${hit.path}`;
      record.seoRisk = "high";
      return record;
    }
    record.relationship = "NO_EQUIVALENT";
    record.recommendedAction = "REVIEW";
    record.confidence = "MEDIUM";
    record.reason = "Product review with no matching software entity";
    record.seoRisk = "high";
    return record;
  }

  if (legacyPageType === "comparison") {
    const hit = matchComparison(slug, comparisons, softwareSlugs);
    if (hit) {
      applyNew(record, hit);
      record.relationship = /-\d+\/$/.test(legacyPath)
        ? "DUPLICATE"
        : "EQUIVALENT";
      record.recommendedAction = "301_REDIRECT";
      record.confidence = "MEDIUM";
      record.reason = `Comparison slug maps to ${hit.path}`;
      record.seoRisk = "high";
      return record;
    }
    record.relationship = "NO_EQUIVALENT";
    record.recommendedAction = "REVIEW";
    record.confidence = "MEDIUM";
    record.reason =
      "Comparison with no matching new compare page (often non-CRM)";
    record.seoRisk = "medium";
    return record;
  }

  if (legacyPageType === "best_list") {
    if (
      slug === "best-crms" ||
      slug === "best-crm" ||
      slug === "best-crm-software"
    ) {
      const hit = best.get("crm-software");
      applyNew(record, hit);
      record.relationship = "MERGED_INTO";
      record.recommendedAction = "MERGE_AND_301";
      record.confidence = "HIGH";
      record.reason = "Legacy best CRM list → /best/crm-software/";
      record.seoRisk = "high";
      return record;
    }
    record.relationship = "NO_EQUIVALENT";
    record.recommendedAction = "REVIEW";
    record.confidence = "LOW";
    record.reason =
      "Vertical/best list — map to /best/, /industries/, or /for/ after editorial review";
    record.seoRisk = "high";
    record.notes?.push("SEO-sensitive listicle; do not 404 without replacement");
    return record;
  }

  if (legacyPageType === "alternatives") {
    const m = /^(.+?)(?:-crm)?-alternatives$/.exec(slug);
    const cand = m ? mapProductToken(m[1]!) : "";
    const hit = cand ? alternatives.get(cand) : undefined;
    if (hit) {
      applyNew(record, hit);
      record.relationship = "EQUIVALENT";
      record.recommendedAction = "301_REDIRECT";
      record.confidence = "HIGH";
      record.reason = `Alternatives → ${hit.path}`;
      record.seoRisk = "high";
      return record;
    }
    const soft = cand ? software.get(cand) : undefined;
    if (soft) {
      applyNew(record, soft);
      record.relationship = "MERGED_INTO";
      record.recommendedAction = "MERGE_AND_301";
      record.confidence = "MEDIUM";
      record.reason = `No alternatives page; interim merge to ${soft.path}`;
      record.seoRisk = "high";
      return record;
    }
    record.relationship = "NO_EQUIVALENT";
    record.recommendedAction = "REVIEW";
    record.confidence = "MEDIUM";
    record.reason = "Alternatives page without matching entity";
    record.seoRisk = "high";
    return record;
  }

  if (legacyPageType === "guide_like" || legacyPageType === "other_article") {
    const hit =
      guides.get(slug) ??
      [...guides.entries()].find(
        ([g]) => slug.endsWith(g) || g.endsWith(slug),
      )?.[1];
    if (hit) {
      applyNew(record, hit);
      record.relationship = "EQUIVALENT";
      record.recommendedAction = "301_REDIRECT";
      record.confidence = "LOW";
      record.reason = `Fuzzy guide match → ${hit.path}`;
      record.seoRisk = "medium";
      return record;
    }
    record.relationship = "NO_EQUIVALENT";
    record.recommendedAction = "REVIEW";
    record.confidence = "LOW";
    record.reason = "Article/guide without clear new equivalent";
    record.seoRisk = "medium";
    return record;
  }

  if (legacyPageType === "wp_category") {
    applyNew(record, byPath.get("/categories/"));
    record.relationship = "MERGED_INTO";
    record.recommendedAction = "REVIEW";
    record.confidence = "LOW";
    record.reason =
      "WP category archive — map to topical hub or retire after editorial review";
    record.seoRisk = "low";
    record.notes?.push(
      "Do not mass-301 all WP categories to /categories/ without topical mapping",
    );
    return record;
  }

  if (legacyPageType === "wp_tag") {
    record.relationship = "DUPLICATE";
    record.recommendedAction = "410";
    record.confidence = "MEDIUM";
    record.reason =
      "WP tag archive — typically retire (410) or redirect to related software/category";
    record.seoRisk = "low";
    record.legacyIndexable = false;
    return record;
  }

  if (legacyPageType === "wp_author") {
    record.relationship = "NO_EQUIVALENT";
    record.recommendedAction = "404";
    record.confidence = "MEDIUM";
    record.reason = "Author archive not part of new IA";
    record.seoRisk = "low";
    return record;
  }

  return record;
}

export function matchAllLegacyUrls(
  legacyPaths: Array<{
    path: string;
    sitemap?: string;
    lastmod?: string | null;
  }>,
  newInventory: NewUrlInventoryRow[],
): LegacyUrlMigrationRecord[] {
  return legacyPaths.map((row) =>
    matchLegacyToNew(row.path, newInventory, {
      sitemap: row.sitemap,
      lastmod: row.lastmod,
    }),
  );
}
