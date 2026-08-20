import type { z } from "zod";
import {
  AlternativesPageSchema,
  ComparisonSchema,
  canonicalizeComparisonSlug,
} from "@/domain";
import { comparisonCriteriaSeed } from "./comparison-criteria";

type AltInput = z.input<typeof AlternativesPageSchema>;
type ComparisonInput = z.input<typeof ComparisonSchema>;

export type EcosystemProduct = {
  slug: string;
  name?: string;
  primaryCategorySlug?: string;
  alternativeSlugs?: string[];
  competitorSlugs?: string[];
  comparableSlugs?: string[];
  useCaseSlugs?: string[];
  metadata?: { status?: string };
};

const MAX_SHELL_TARGETS = 8;

/** Too broad to treat overlapping peers as substitutes (e.g. Fastmail ↛ Slack). */
const BROAD_USE_CASES = new Set(["team-communication"]);

function displayName(product: EcosystemProduct): string {
  const name = product.name?.trim();
  return name && name.length > 0 ? name : product.slug;
}

function uniqueExisting(
  slugs: string[] | undefined,
  known: Set<string>,
  self: string,
): string[] {
  return mergeExisting([slugs], known, self);
}

function mergeExisting(
  groups: Array<string[] | undefined>,
  known: Set<string>,
  self: string,
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    for (const slug of group ?? []) {
      if (!known.has(slug) || slug === self || seen.has(slug)) continue;
      seen.add(slug);
      out.push(slug);
    }
  }
  return out;
}

function distinctiveUseCases(product: EcosystemProduct): string[] {
  return (product.useCaseSlugs ?? []).filter(
    (slug) => !BROAD_USE_CASES.has(slug),
  );
}

function specificUseCasePeers(
  product: EcosystemProduct,
  products: EcosystemProduct[],
  known: Set<string>,
): string[] {
  const required = distinctiveUseCases(product);
  if (required.length === 0 || !product.primaryCategorySlug) return [];
  return products
    .filter(
      (peer) =>
        peer.slug !== product.slug &&
        known.has(peer.slug) &&
        peer.primaryCategorySlug === product.primaryCategorySlug &&
        (peer.useCaseSlugs ?? []).some((slug) => required.includes(slug)),
    )
    .map((peer) => peer.slug)
    .sort();
}

/**
 * Existing-catalogue substitutes only: authored relationships first, then
 * same-category peers that share a distinctive use case. Never invents slugs.
 */
export function catalogueSubstituteSlugs(
  product: EcosystemProduct,
  products: EcosystemProduct[],
): string[] {
  const known = new Set(products.map((item) => item.slug));
  const related = mergeExisting(
    [
      product.alternativeSlugs,
      product.competitorSlugs,
      product.comparableSlugs,
    ],
    known,
    product.slug,
  );
  if (related.length >= 2) return related.slice(0, MAX_SHELL_TARGETS);
  const peers = specificUseCasePeers(product, products, known);
  return mergeExisting([related, peers], known, product.slug).slice(
    0,
    MAX_SHELL_TARGETS,
  );
}

function isPublished(product: EcosystemProduct): boolean {
  return product.metadata?.status === "published";
}

function criteriaForCategory(categorySlug: string): string[] {
  return comparisonCriteriaSeed
    .filter((criterion) =>
      (criterion.applicableCategorySlugs ?? []).includes(categorySlug),
    )
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((criterion) => criterion.slug);
}

export function alternativesShellPage(
  source: EcosystemProduct,
  targets: string[],
): AltInput {
  const name = displayName(source);
  const title = `${name} alternatives`;
  const listed = targets.slice(0, MAX_SHELL_TARGETS);
  return {
    id: `alt-${source.slug}`,
    slug: source.slug,
    title,
    sourceSlug: source.slug,
    summary: `Catalogue substitutes to ${name} from existing SoftwareGlimpse products. This is a list of substitutes, not an editorial ranking.`,
    alternatives: listed.map((targetSlug) => ({
      targetSlug,
      relativePricing: "unknown" as const,
      researchStatus: "none" as const,
    })),
    editorialStatus: "not-assessed",
    metadata: {
      status: "researching",
      researchStatus: "none",
    },
    seo: {
      title,
      description: `See catalogue alternatives to ${name}. Not a ranked shortlist — reasons are added after editorial research.`,
      indexable: false,
      canonicalPath: `/alternatives/${source.slug}/`,
    },
  };
}

export function comparisonShell(input: {
  a: EcosystemProduct;
  b: EcosystemProduct;
}): ComparisonInput | null {
  if (input.a.slug === input.b.slug) return null;
  const productSlugs = [input.a.slug, input.b.slug] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);
  const title = `${displayName(input.a)} vs ${displayName(input.b)}`;
  const categorySlug =
    input.a.primaryCategorySlug &&
    input.a.primaryCategorySlug === input.b.primaryCategorySlug
      ? input.a.primaryCategorySlug
      : input.a.primaryCategorySlug;
  return {
    id: `cmp-${slug}`,
    slug,
    title,
    productSlugs,
    categorySlug,
    criterionSlugs: categorySlug ? criteriaForCategory(categorySlug) : [],
    outcomes: [],
    editorialStatus: "not-assessed",
    metadata: {
      status: "researching",
      researchStatus: "none",
    },
    seo: {
      title,
      description: `${title} comparison on SoftwareGlimpse.`,
      indexable: false,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

function existingAltKeys(pages: AltInput[]): Set<string> {
  const keys = new Set<string>();
  for (const page of pages) {
    if (page.sourceSlug) keys.add(page.sourceSlug);
    if (page.slug) keys.add(page.slug);
  }
  return keys;
}

/**
 * Non-indexable alternatives shells from existing catalogue substitutes.
 * Does not invent reasons, rankings, unknown products, or editorial recommendations.
 */
export function buildMissingAlternativesPages(
  products: EcosystemProduct[],
  authored: AltInput[],
): AltInput[] {
  const covered = existingAltKeys(authored);
  const generated: AltInput[] = [];

  for (const product of products) {
    if (covered.has(product.slug)) continue;
    const targets = catalogueSubstituteSlugs(product, products);
    if (targets.length < 2) continue;
    generated.push(alternativesShellPage(product, targets));
    covered.add(product.slug);
  }

  return generated;
}

function existingComparisonKeys(items: ComparisonInput[]): Set<string> {
  const keys = new Set<string>();
  for (const item of items) {
    const slugs = item.productSlugs;
    if (Array.isArray(slugs) && slugs.length >= 2) {
      keys.add(canonicalizeComparisonSlug(slugs));
    } else if (item.slug) {
      keys.add(item.slug);
    }
  }
  return keys;
}

/**
 * Non-indexable comparison shells from approved competitor slugs.
 * Empty outcomes — not researched verdicts or rankings.
 */
export function buildMissingComparisonShells(
  products: EcosystemProduct[],
  authored: ComparisonInput[],
): ComparisonInput[] {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const known = new Set(bySlug.keys());
  const covered = existingComparisonKeys(authored);
  const productsWithComps = new Set<string>();
  for (const item of authored) {
    for (const slug of item.productSlugs ?? []) productsWithComps.add(slug);
  }
  const generated: ComparisonInput[] = [];

  const addPair = (left: EcosystemProduct, right: EcosystemProduct) => {
    // Never emit empty shells for draft / unpublished catalogue rows.
    if (!isPublished(left) || !isPublished(right)) return;
    const canonical = canonicalizeComparisonSlug([left.slug, right.slug]);
    if (covered.has(canonical)) return;
    const shell = comparisonShell({ a: left, b: right });
    if (!shell) return;
    generated.push(shell);
    covered.add(canonical);
    productsWithComps.add(left.slug);
    productsWithComps.add(right.slug);
  };

  for (const product of products) {
    const competitors = uniqueExisting(
      product.competitorSlugs,
      known,
      product.slug,
    );
    for (const competitorSlug of competitors.slice(0, MAX_SHELL_TARGETS)) {
      const other = bySlug.get(competitorSlug);
      if (!other) continue;
      addPair(product, other);
    }
  }

  const publishedByCategory = new Map<string, EcosystemProduct[]>();
  for (const product of products) {
    if (!isPublished(product) || !product.primaryCategorySlug) continue;
    const list = publishedByCategory.get(product.primaryCategorySlug) ?? [];
    list.push(product);
    publishedByCategory.set(product.primaryCategorySlug, list);
  }

  for (const members of publishedByCategory.values()) {
    if (members.length < 3) continue;
    if (members.some((product) => productsWithComps.has(product.slug))) continue;
    for (let i = 0; i < members.length - 1; i += 1) {
      addPair(members[i], members[i + 1]);
    }
  }

  return generated;
}
