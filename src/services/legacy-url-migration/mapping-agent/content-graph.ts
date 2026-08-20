import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAudiences,
  getCapabilities,
  getCategories,
  getIndustries,
  getMigrationRecords,
  getResources,
  getSoftware,
  getUseCases,
} from "@/data";
import {
  getGuides,
} from "@/data/repositories/guides";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { listFeatureDetailParams } from "@/data/feature-detail";
import { listRequirementDetailParams } from "@/data/requirement-detail";
import {
  COMPANY_ROUTES,
  LEGAL_ROUTES,
} from "@/services/site-foundation/config";
import { canonicalizeComparisonSlug } from "@/domain/comparison-slug";
import { softwareHubPath } from "@/services/software-review/hub-tabs";
import { LEGACY_PATH_ALIASES } from "../match";
import { normalizeMigrationPath } from "../normalize";
import { buildNewUrlInventory } from "../inventory-new";
import type { NewUrlInventoryRow } from "../types";

export type GraphNode = {
  path: string;
  url: string;
  title: string;
  pageType: string;
  entityId?: string;
  tokens: Set<string>;
  productSlugs?: string[];
  indexable: boolean;
};

export type ContentGraph = {
  nodesByPath: Map<string, GraphNode>;
  softwareBySlug: Map<string, GraphNode>;
  /** alias token → product slug */
  productAliasToSlug: Map<string, string>;
  comparisonsByCanonical: Map<string, GraphNode>;
  alternativesBySlug: Map<string, GraphNode>;
  bestBySlug: Map<string, GraphNode>;
  guides: GraphNode[];
  industries: GraphNode[];
  audiences: GraphNode[];
  useCases: GraphNode[];
  features: GraphNode[];
  capabilities: GraphNode[];
  requirements: GraphNode[];
  resources: GraphNode[];
  categories: GraphNode[];
  tools: GraphNode[];
  /** Explicit historical maps: legacy path → target path */
  explicitHistorical: Map<
    string,
    { target: string | null; reason: string; source: string }
  >;
  inventory: NewUrlInventoryRow[];
};

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "for",
  "to",
  "in",
  "on",
  "with",
  "vs",
  "versus",
  "crm",
  "software",
  "review",
  "guide",
  "best",
  "top",
  "how",
  "what",
  "is",
  "are",
  "your",
  "you",
  "from",
  "into",
  "using",
  "use",
  "system",
  "systems",
  "tool",
  "tools",
  "page",
  "complete",
  "ultimate",
  "beginners",
  "beginner",
]);

export function tokenize(text: string): Set<string> {
  const parts = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
  return new Set(parts);
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function node(
  path: string,
  title: string,
  pageType: string,
  opts: Partial<GraphNode> = {},
): GraphNode {
  const normalized = normalizeMigrationPath(path);
  return {
    path: normalized,
    url: `https://www.softwareglimpse.com${normalized}`,
    title,
    pageType,
    tokens: tokenize(`${title} ${normalized}`),
    indexable: opts.indexable ?? true,
    entityId: opts.entityId,
    productSlugs: opts.productSlugs,
  };
}

/** Known legacy product name aliases → catalogue slug. */
const BUILTIN_PRODUCT_ALIASES: Record<string, string> = {
  "microsoft-dynamics": "dynamics-365",
  dynamics: "dynamics-365",
  "dynamics-365": "dynamics-365",
  monday: "monday-sales-crm",
  "monday-com": "monday-sales-crm",
  "monday-crm": "monday-sales-crm",
  zoho: "zoho-crm",
  "zoho-crm": "zoho-crm",
  sugar: "sugarcrm",
  "sugar-crm": "sugarcrm",
  sugarcrm: "sugarcrm",
  infusionsoft: "keap",
  "folk-app": "folk",
  "apollo-io": "apollo",
  apollo: "apollo",
  oracle: "oracle-cx",
  "oracle-cx": "oracle-cx",
  "salesforce-crm": "salesforce",
  "hubspot-crm": "hubspot",
  "pipedrive-crm": "pipedrive",
  "freshsales-crm": "freshsales",
  "close-crm": "close",
  "activecampaign-crm": "activecampaign",
  "getresponse-crm": "getresponse",
  "insightly-crm": "insightly",
  "capsule-crm": "capsule",
  "keap-crm": "keap",
  "lusha-crm": "lusha",
  "copper-crm": "copper",
};

function registerAlias(
  map: Map<string, string>,
  alias: string,
  slug: string,
): void {
  const key = alias
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (key) map.set(key, slug);
}

export function buildContentGraph(): ContentGraph {
  const inventory = buildNewUrlInventory();
  const nodesByPath = new Map<string, GraphNode>();
  const push = (n: GraphNode) => {
    if (!nodesByPath.has(n.path)) nodesByPath.set(n.path, n);
  };

  for (const row of inventory) {
    push(
      node(row.path, row.title, row.pageType, {
        entityId: row.entityId,
        indexable: row.indexable,
      }),
    );
  }

  const productAliasToSlug = new Map<string, string>();
  for (const [alias, slug] of Object.entries(BUILTIN_PRODUCT_ALIASES)) {
    registerAlias(productAliasToSlug, alias, slug);
  }

  const softwareBySlug = new Map<string, GraphNode>();
  for (const s of getSoftware({ includeUnpublished: true })) {
    const n = node(`/software/${s.slug}/`, s.name, "software", {
      entityId: s.id,
      productSlugs: [s.slug],
      indexable: s.metadata.status === "published",
    });
    softwareBySlug.set(s.slug, n);
    push(n);
    registerAlias(productAliasToSlug, s.slug, s.slug);
    registerAlias(productAliasToSlug, s.name, s.slug);
    for (const alias of s.aliases ?? []) {
      registerAlias(productAliasToSlug, alias, s.slug);
    }
    for (const former of s.formerlyKnownAs ?? []) {
      registerAlias(productAliasToSlug, former, s.slug);
    }
    // Pricing tab as first-class destination for moved subcontent
    const pricingPath = softwareHubPath(s.slug, "pricing");
    push(
      node(pricingPath, `${s.name} Pricing`, "product_pricing", {
        entityId: s.id,
        productSlugs: [s.slug],
        indexable: false,
      }),
    );
  }

  const comparisonsByCanonical = new Map<string, GraphNode>();
  for (const c of getAllComparisonsUnfiltered()) {
    const parsed = c.slug.includes("-vs-") ? c.slug : null;
    const parts = parsed?.split("-vs-");
    let productSlugs: string[] | undefined;
    let canonical = c.slug;
    if (parts && parts.length === 2) {
      try {
        canonical = canonicalizeComparisonSlug(parts);
        productSlugs = [...parts].sort() as string[];
      } catch {
        productSlugs = parts;
      }
    }
    const n = node(`/compare/${c.slug}/`, c.title || c.slug, "comparison", {
      entityId: c.id,
      productSlugs,
      indexable: c.metadata.status === "published",
    });
    comparisonsByCanonical.set(canonical, n);
    push(n);
  }

  const alternativesBySlug = new Map<string, GraphNode>();
  for (const a of getAllAlternativesUnfiltered()) {
    const n = node(
      `/alternatives/${a.slug}/`,
      a.title || `${a.slug} alternatives`,
      "alternatives",
      { entityId: a.id, productSlugs: [a.slug] },
    );
    alternativesBySlug.set(a.slug, n);
    push(n);
  }

  const bestBySlug = new Map<string, GraphNode>();
  for (const b of getAllBestPagesUnfiltered()) {
    const n = node(`/best/${b.slug}/`, b.title || b.slug, "best", {
      entityId: b.id,
    });
    bestBySlug.set(b.slug, n);
    push(n);
  }

  const guides = getGuides({ includeUnpublished: true }).map((g) => {
    const path = g.seo.canonicalPath || `/guides/${g.slug}/`;
    const n = node(path, g.title || g.slug, "guide", { entityId: g.id });
    push(n);
    return n;
  });

  const industries = getIndustries({ includeUnpublished: true }).map((i) => {
    const path = i.seo.canonicalPath || `/industries/${i.slug}/`;
    const n = node(path, i.name || i.slug, "industry", { entityId: i.id });
    push(n);
    return n;
  });

  const audiences = getAudiences().map((a) => {
    const path = a.seo.canonicalPath || `/for/${a.slug}/`;
    const n = node(path, a.name || a.slug, "audience", { entityId: a.id });
    push(n);
    return n;
  });

  const useCases = getUseCases().map((u) => {
    const path = u.seo.canonicalPath || `/use-cases/${u.slug}/`;
    const n = node(path, u.name || u.slug, "use_case", { entityId: u.id });
    push(n);
    return n;
  });

  const features = listFeatureDetailParams().map(({ slug }) => {
    const n = node(`/features/${slug}/`, slug, "feature", { entityId: slug });
    push(n);
    return n;
  });

  const capabilities = getCapabilities().map((c) => {
    const path = c.seo.canonicalPath || `/capabilities/${c.slug}/`;
    const n = node(path, c.name || c.slug, "capability", { entityId: c.id });
    push(n);
    return n;
  });

  const requirements = listRequirementDetailParams().map(({ slug }) => {
    const n = node(`/requirements/${slug}/`, slug, "requirement", {
      entityId: slug,
    });
    push(n);
    return n;
  });

  const resources = getResources({ includeUnpublished: true }).map((r) => {
    const path = r.seo.canonicalPath || `/resources/${r.slug}/`;
    const n = node(path, r.title || r.slug, "resource", { entityId: r.id });
    push(n);
    return n;
  });

  const categories = getCategories().map((c) => {
    const path = `/categories/${c.path.join("/")}/`;
    const n = node(path, c.name, "category", { entityId: c.id });
    push(n);
    return n;
  });

  const tools = TOOLS_REGISTRY.filter((t) => t.href).map((t) => {
    const n = node(t.href!, t.name, "tool", { entityId: t.slug });
    push(n);
    return n;
  });

  // Ensure company/legal hubs present
  for (const route of Object.values(COMPANY_ROUTES)) {
    push(node(route, route, "company"));
  }
  for (const route of Object.values(LEGAL_ROUTES)) {
    push(node(route, route, "legal"));
  }

  const explicitHistorical = new Map<
    string,
    { target: string | null; reason: string; source: string }
  >();

  for (const [legacy, alias] of Object.entries(LEGACY_PATH_ALIASES)) {
    explicitHistorical.set(normalizeMigrationPath(legacy), {
      target: alias.target ? normalizeMigrationPath(alias.target) : null,
      reason: alias.note ?? "LEGACY_PATH_ALIASES explicit map",
      source: "LEGACY_PATH_ALIASES",
    });
  }

  for (const rec of getMigrationRecords()) {
    const source = normalizeMigrationPath(rec.source);
    const target = rec.target ? normalizeMigrationPath(rec.target) : null;
    // Seed ledger wins when both exist (hand-curated CRM batch)
    explicitHistorical.set(source, {
      target,
      reason: rec.reason ?? `MigrationRecord ${rec.action}`,
      source: `migrationSeed:${rec.id}`,
    });
  }

  return {
    nodesByPath,
    softwareBySlug,
    productAliasToSlug,
    comparisonsByCanonical,
    alternativesBySlug,
    bestBySlug,
    guides,
    industries,
    audiences,
    useCases,
    features,
    capabilities,
    requirements,
    resources,
    categories,
    tools,
    explicitHistorical,
    inventory,
  };
}

export function resolveProductSlug(
  graph: ContentGraph,
  raw: string,
): string | undefined {
  const key = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!key) return undefined;
  if (graph.softwareBySlug.has(key)) return key;
  if (graph.productAliasToSlug.has(key)) return graph.productAliasToSlug.get(key);
  // strip trailing -crm
  const stripped = key.replace(/-crm$/, "");
  if (graph.softwareBySlug.has(stripped)) return stripped;
  if (graph.productAliasToSlug.has(stripped)) {
    return graph.productAliasToSlug.get(stripped);
  }
  return undefined;
}
