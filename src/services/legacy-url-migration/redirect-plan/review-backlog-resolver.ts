import fs from "node:fs";
import path from "node:path";
import type { UrlMappingRow } from "../mapping-agent/types";
import { normalizeMigrationPath } from "../normalize";
import { buildNewUrlInventory } from "../inventory-new";
import { softwareSeed } from "@/data/seed/software";
import { comparisonsSeed } from "@/data/seed/comparisons";
import { canonicalizeComparisonSlug } from "@/domain";

export type ReviewBacklogResolution =
  | { source: string; destination: string; reason: string; action: "301" }
  | { source: string; reason: string; action: "410" };

export type ReviewBacklogFile = {
  version: 1;
  generatedAt: string;
  redirects: Array<{ source: string; destination: string; reason: string }>;
  retirements: Array<{ source: string; action: "410"; reason: string }>;
};

/** Editorial overrides — explicit launch decisions for ambiguous legacy URLs. */
const MANUAL_REDIRECTS: Record<string, { destination: string; reason: string }> =
  {
    "/ai-software-reviews/": {
      destination: "/categories/ai/",
      reason: "Legacy AI reviews hub → AI category index",
    },
    "/agile-crm-review/": {
      destination: "/software/agile-crm/",
      reason: "Legacy Agile CRM review → catalogue product page",
    },
    "/benefits-of-pictory-ai-for-businesses/": {
      destination: "/categories/ai/",
      reason: "Legacy Pictory benefits → AI category (product not onboarded)",
    },
    "/best-crm-software-in-dubai/": {
      destination: "/categories/crm/",
      reason: "Legacy regional best-CRM list → CRM category index",
    },
    "/comparing-microsoft-dynamics-crm/": {
      destination: "/software/dynamics-365/",
      reason: "Legacy Dynamics comparison article → Dynamics 365 product page",
    },
    "/best-crm-with-text-messaging/": {
      destination: "/capabilities/sms-messaging/",
      reason: "Legacy SMS CRM list → SMS capability hub",
    },
    "/common-security-risks-in-crm-systems/": {
      destination: "/guides/crm-implementation/",
      reason: "Legacy CRM security article → CRM implementation guide",
    },
    "/crm-data-management-best-practices/": {
      destination: "/guides/crm-data-migration/",
      reason: "Legacy data-management article → CRM data migration guide",
    },
    "/how-to-zoho-thrive-zoho-crm-integration/": {
      destination: "/guides/zoho-crm-setup/",
      reason: "Legacy Zoho integration article → Zoho CRM setup guide",
    },
    "/introduction-to-agile/": {
      destination: "/software/agile-crm/",
      reason: "Legacy Agile intro → Agile CRM product page",
    },
    "/laxis-review/": {
      destination: "/categories/ai/",
      reason: "Off-catalogue AI review → AI category index",
    },
    "/shortstack-review/": {
      destination: "/categories/marketing/",
      reason: "Off-catalogue marketing review → marketing category index",
    },
    "/success-ai-review/": {
      destination: "/categories/ai/",
      reason: "Off-catalogue AI review → AI category index",
    },
    "/webydo-review/": {
      destination: "/categories/ecommerce/",
      reason: "Off-catalogue builder review → ecommerce category index",
    },
    "/whitespark-review/": {
      destination: "/categories/marketing/",
      reason: "Off-catalogue local-SEO review → marketing category index",
    },
    "/whitespark-vs-brightlocal/": {
      destination: "/categories/marketing/",
      reason: "Off-catalogue local-SEO comparison → marketing category index",
    },
    "/faqs-about-infusionsoft-crm/": {
      destination: "/software/keap/",
      reason: "Legacy Infusionsoft FAQ → Keap product page (rebrand)",
    },
    "/features-of-infusionsoft-crm/": {
      destination: "/software/keap/",
      reason: "Legacy Infusionsoft features → Keap product page (rebrand)",
    },
    "/pricing-of-infusionsoft-crm/": {
      destination: "/software/keap/",
      reason: "Legacy Infusionsoft pricing → Keap product page (rebrand)",
    },
    "/faqs-about-insightly-crm/": {
      destination: "/software/insightly/",
      reason: "Legacy Insightly FAQ → product page",
    },
    "/features-of-insightly-crm/": {
      destination: "/software/insightly/",
      reason: "Legacy Insightly features → product page",
    },
    "/pricing-of-insightly-crm/": {
      destination: "/software/insightly/",
      reason: "Legacy Insightly pricing → product page",
    },
    "/faqs-about-keap-crm/": {
      destination: "/software/keap/",
      reason: "Legacy Keap FAQ → product page",
    },
    "/features-of-keap-crm/": {
      destination: "/software/keap/",
      reason: "Legacy Keap features → product page",
    },
    "/pricing-of-keap-crm/": {
      destination: "/software/keap/",
      reason: "Legacy Keap pricing → product page",
    },
    "/faqs-about-mailchimp-crm/": {
      destination: "/software/mailchimp/",
      reason: "Legacy Mailchimp FAQ → product page",
    },
    "/features-of-mailchimp-crm/": {
      destination: "/software/mailchimp/",
      reason: "Legacy Mailchimp features → product page",
    },
    "/pricing-of-mailchimp-crm/": {
      destination: "/software/mailchimp/",
      reason: "Legacy Mailchimp pricing → product page",
    },
    "/faqs-about-monday-crm/": {
      destination: "/software/monday/",
      reason: "Legacy Monday CRM FAQ → product page",
    },
    "/features-of-monday-crm/": {
      destination: "/software/monday/",
      reason: "Legacy Monday CRM features → product page",
    },
    "/pricing-of-monday-crm/": {
      destination: "/software/monday/",
      reason: "Legacy Monday CRM pricing → product page",
    },
    "/faqs-about-nimble-crm/": {
      destination: "/software/nimble/",
      reason: "Legacy Nimble FAQ → product page",
    },
    "/features-of-nimble-crm/": {
      destination: "/software/nimble/",
      reason: "Legacy Nimble features → product page",
    },
    "/pricing-of-nimble-crm/": {
      destination: "/software/nimble/",
      reason: "Legacy Nimble pricing → product page",
    },
    "/pricing-packages-of-crm-for-hotels/": {
      destination: "/industries/hospitality/",
      reason: "Legacy hotel CRM pricing → hospitality industry hub",
    },
    "/notion-ai-vs-chatgpt/": {
      destination: "/compare/notion-vs-chatgpt/",
      reason: "Legacy Notion AI vs ChatGPT → materialized compare page",
    },
    "/quillbot-vs-prowritingaid/": {
      destination: "/categories/ai/",
      reason: "Off-catalogue AI comparison → AI category index",
    },
    "/salesforce-vs-sugarcrm-vs-microsoft-dynamics/": {
      destination: "/compare/salesforce-vs-sugarcrm/",
      reason: "Legacy three-way comparison → primary pair compare page",
    },
  };

const PRODUCT_ALIASES: Record<string, string> = {
  infusionsoft: "keap",
  "zendesk-crm": "zendesk",
  "mailchimp-crm": "mailchimp",
  "nimble-crm": "nimble",
  "netsuite-crm": "netsuite",
  "wealthbox-crm": "wealthbox",
  "cloze-crm": "cloze",
  "pega-crm": "pega",
  "affinity-crm": "affinity",
  "apptivo-crm": "apptivo",
  "podio-crm": "podio",
  "freshsales-crm": "freshsales",
  "zoho-crm": "zoho-crm",
  "agile-crm": "agile-crm",
  "monday-crm": "monday",
};

const INDUSTRY_KEYWORDS: Record<string, string> = {
  "financial-advisors": "financial-services",
  "financial-advisor": "financial-services",
  "real-estate": "real-estate",
  photographers: "photography",
  photographer: "photography",
  coaches: "coaching",
  coach: "coaching",
  hotels: "hospitality",
  hotel: "hospitality",
  solar: "solar",
  plumbers: "plumbing",
  plumber: "plumbing",
  nonprofits: "nonprofit",
  nonprofit: "nonprofit",
  "venture-capital": "venture-capital",
  "private-equity": "private-equity",
  "web-designers": "web-design",
  "web-designer": "web-design",
  engineering: "engineering",
  "engineering-firms": "engineering",
  "event-management": "event-management",
  "security-companies": "security-companies",
  "investor-relations": "investor-relations",
  musicians: "music",
  music: "music",
};

function productSlugFromReviewPath(slug: string): string | null {
  const patterns = [
    /^(.+)-crm-review(?:-\d+)?$/,
    /^(.+)-review(?:-\d+)?$/,
  ];
  for (const pattern of patterns) {
    const m = slug.match(pattern);
    if (!m) continue;
    const raw = m[1];
    const candidates = [raw, `${raw}-crm`, PRODUCT_ALIASES[raw], PRODUCT_ALIASES[`${raw}-crm`]].filter(
      Boolean,
    ) as string[];
    for (const c of candidates) {
      if (productSlugs.has(c)) return c;
    }
  }
  return null;
}

function productSlugFromLegacySlug(slug: string): string | null {
  const faq = slug.match(/^faqs-about-(.+)$/);
  if (faq) {
    const base = faq[1].replace(/-crm$/, "");
    const candidates = [faq[1], base, `${base}-crm`, PRODUCT_ALIASES[faq[1]], PRODUCT_ALIASES[base]];
    for (const c of candidates.filter(Boolean) as string[]) {
      if (productSlugs.has(c)) return c;
    }
  }
  const features = slug.match(/^features-of-(.+)$/);
  if (features) {
    const base = features[1].replace(/-crm$/, "");
    const candidates = [features[1], base, `${base}-crm`, PRODUCT_ALIASES[features[1]], PRODUCT_ALIASES[base]];
    for (const c of candidates.filter(Boolean) as string[]) {
      if (productSlugs.has(c)) return c;
    }
  }
  const pricing = slug.match(/^pricing-of-(.+)$/);
  if (pricing) {
    const base = pricing[1].replace(/-crm$/, "");
    const candidates = [pricing[1], base, `${base}-crm`, PRODUCT_ALIASES[pricing[1]], PRODUCT_ALIASES[base]];
    for (const c of candidates.filter(Boolean) as string[]) {
      if (productSlugs.has(c)) return c;
    }
  }
  const comparing = slug.match(/^comparing-(.+)$/);
  if (comparing) {
    const raw = comparing[1].replace(/-crm$/, "");
    const candidates = [comparing[1], raw, `${raw}-crm`, PRODUCT_ALIASES[raw]];
    for (const c of candidates.filter(Boolean) as string[]) {
      if (productSlugs.has(c)) return c;
    }
  }
  const benefits = slug.match(/^benefits-of-(.+)$/);
  if (benefits) {
    const raw = benefits[1].replace(/-crm$/, "");
    const candidates = [benefits[1], raw, `${raw}-crm`, PRODUCT_ALIASES[raw]];
    for (const c of candidates.filter(Boolean) as string[]) {
      if (productSlugs.has(c)) return c;
    }
  }
  return null;
}

let productSlugs: Set<string>;
let compareSlugs: Set<string>;
let invPaths: Set<string>;

function initCatalogue(now: Date = new Date()) {
  productSlugs = new Set(softwareSeed.map((s) => s.slug));
  compareSlugs = new Set(comparisonsSeed.map((c) => c.slug).filter(Boolean) as string[]);
  invPaths = new Set(buildNewUrlInventory(now).map((r) => r.path));
}

function industryDest(slug: string): string | null {
  for (const [key, ind] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (slug.includes(key)) {
      const dest = `/industries/${ind}/`;
      if (invPaths.has(dest)) return dest;
    }
  }
  return null;
}

export function resolveReviewBacklogRow(
  legacyPath: string,
  row: Pick<UrlMappingRow, "legacyIntent" | "legacyPageType">,
): ReviewBacklogResolution {
  const source = normalizeMigrationPath(legacyPath);
  const manual = MANUAL_REDIRECTS[source];
  if (manual && invPaths.has(normalizeMigrationPath(manual.destination))) {
    return {
      source,
      destination: normalizeMigrationPath(manual.destination),
      reason: manual.reason,
      action: "301",
    };
  }

  const slug = source.replace(/^\/|\/$/g, "");

  if (row.legacyPageType === "wp_category" || slug.startsWith("category/")) {
    return { source, reason: "WP category archive — intentional retirement", action: "410" };
  }

  const reviewProduct = productSlugFromReviewPath(slug);
  if (reviewProduct) {
    return {
      source,
      destination: `/software/${reviewProduct}/`,
      reason: "Product review → catalogue product page",
      action: "301",
    };
  }

  const legacyProduct = productSlugFromLegacySlug(slug);
  if (legacyProduct) {
    return {
      source,
      destination: `/software/${legacyProduct}/`,
      reason: "Legacy product article → catalogue product page",
      action: "301",
    };
  }

  if (slug.includes("-vs-") && !slug.startsWith("crm-for-")) {
    const parts = slug.split("-vs-");
    if (parts.length === 2) {
      const cmp = canonicalizeComparisonSlug([parts[0]!, parts[1]!]);
      if (compareSlugs.has(cmp)) {
        return {
          source,
          destination: `/compare/${cmp}/`,
          reason: "Comparison pair → canonical compare page",
          action: "301",
        };
      }
    }
  }

  if (slug.includes("case-study")) {
    for (const ps of productSlugs) {
      const stem = ps.replace(/-crm$/, "");
      if (slug.includes(stem) && stem.length > 3) {
        return {
          source,
          destination: `/software/${ps}/`,
          reason: "Case study → matching product page",
          action: "301",
        };
      }
    }
  }

  const industry = industryDest(slug);
  if (industry) {
    return { source, reason: "Industry topical → industry hub", action: "301", destination: industry };
  }

  if (slug === "crm-by-industry" || slug.endsWith("-crm-reviews") || slug === "crm-reviews") {
    return {
      source,
      destination: "/categories/crm/",
      reason: "CRM hub → category index",
      action: "301",
    };
  }
  if (slug.includes("comparisons") && !slug.includes("-vs-")) {
    return { source, destination: "/compare/", reason: "Comparison hub → compare index", action: "301" };
  }
  if (slug.includes("crm-guide") || slug === "crm-guides") {
    return {
      source,
      destination: "/guides/what-is-crm/",
      reason: "CRM guide hub → what-is-crm guide",
      action: "301",
    };
  }

  if (row.legacyIntent === "best" || slug.startsWith("best-")) {
    if (slug.includes("ai")) {
      return { source, destination: "/categories/ai/", reason: "Best AI list → AI category", action: "301" };
    }
    if (slug.includes("crm")) {
      return { source, destination: "/categories/crm/", reason: "Best CRM list → CRM category", action: "301" };
    }
  }

  if (row.legacyIntent === "guide" || row.legacyPageType === "guide_like") {
    if (slug.includes("integration")) {
      return {
        source,
        destination: "/features/integrations/",
        reason: "Integration guide → integrations feature hub",
        action: "301",
      };
    }
    return {
      source,
      destination: "/guides/what-is-crm/",
      reason: "Guide-like article → CRM pillar guide",
      action: "301",
    };
  }

  if (slug.includes("ai") && !slug.includes("crm")) {
    return {
      source,
      destination: "/categories/ai/",
      reason: "AI topical → AI category index",
      action: "301",
    };
  }

  if (slug.includes("crm")) {
    return { source, destination: "/categories/crm/", reason: "CRM topical → category index", action: "301" };
  }

  if (slug.includes("marketing")) {
    return {
      source,
      destination: "/categories/marketing/",
      reason: "Marketing topical → marketing category",
      action: "301",
    };
  }

  return { source, reason: "Off-strategy legacy URL — intentional retirement", action: "410" };
}

export function resolveAllReviewBacklog(opts?: {
  mappingRows?: UrlMappingRow[];
  now?: Date;
  /** When true, skip rows already covered by implemented redirects. */
  excludeExistingRedirects?: boolean;
  existingRedirectSources?: Set<string>;
}): {
  resolutions: ReviewBacklogResolution[];
  unresolved: string[];
} {
  initCatalogue(opts?.now ?? new Date());
  const mappingPath = path.join(
    process.cwd(),
    "docs/migration/data/url-mapping-plan.json",
  );
  const rows =
    opts?.mappingRows ??
    (JSON.parse(fs.readFileSync(mappingPath, "utf8")) as UrlMappingRow[]);
  const existing = opts?.existingRedirectSources ?? new Set<string>();
  const excludeExisting = opts?.excludeExistingRedirects ?? false;

  const resolutions: ReviewBacklogResolution[] = [];
  const unresolved: string[] = [];

  for (const row of rows) {
    if (row.recommendedAction !== "REVIEW" || row.newPath) continue;
    const source = normalizeMigrationPath(row.legacyPath);
    if (excludeExisting && existing.has(source)) continue;

    const resolution = resolveReviewBacklogRow(row.legacyPath, row);
    if (resolution.action === "301") {
      if (!invPaths.has(resolution.destination)) {
        unresolved.push(`${source} → ${resolution.destination} (missing destination)`);
        continue;
      }
    }
    resolutions.push(resolution);
  }

  return { resolutions, unresolved };
}

export function toReviewBacklogFile(
  resolutions: ReviewBacklogResolution[],
  generatedAt: string = new Date().toISOString(),
): ReviewBacklogFile {
  const redirects = resolutions
    .filter((r): r is Extract<ReviewBacklogResolution, { action: "301" }> => r.action === "301")
    .map(({ source, destination, reason }) => ({ source, destination, reason }));
  const retirements = resolutions
    .filter((r): r is Extract<ReviewBacklogResolution, { action: "410" }> => r.action === "410")
    .map(({ source, reason }) => ({ source, action: "410" as const, reason }));
  return { version: 1, generatedAt, redirects, retirements };
}

export function reviewBacklogConfigPath(): string {
  return path.join(process.cwd(), "config/review-backlog-redirects.json");
}

export function loadReviewBacklogFile(
  filePath: string = reviewBacklogConfigPath(),
): ReviewBacklogFile | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as ReviewBacklogFile;
}
