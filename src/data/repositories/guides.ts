import { GuidePageSchema, type GuidePage } from "@/domain";
import {
  filterByPublicationVisibility,
  type PublicationListOptions,
} from "@/domain/publication-context";
import {
  loadEducationalGuidesUnfiltered,
  __resetEducationalGuideCaches,
} from "./guides-educational";
import {
  buildAllBcProductGuides,
  buildAllCrmProductGuides,
  buildAllEmProductGuides,
  buildAllHrProductGuides,
  buildAllEcommerceProductGuides,
  buildAllMarketingProductGuides,
  buildAllPmProductGuides,
  buildAllAiProductGuides,
  buildAllItProductGuides,
  buildAllSiProductGuides,
  buildProductGuidePackForSlug,
} from "@/services/product-guides/build";

type ListOptions = PublicationListOptions;

let fullCache: GuidePage[] | null = null;

export function __resetGuideCaches(): void {
  __resetEducationalGuideCaches();
  fullCache = null;
}

function parseGuides(items: unknown[], label: string): GuidePage[] {
  return items.map((g, index) => {
    const parsed = GuidePageSchema.safeParse(g);
    if (!parsed.success) {
      throw new Error(
        `Invalid ${label} at index ${index}: ${parsed.error.issues
          .map((i) => i.message)
          .join("; ")}`,
      );
    }
    return parsed.data;
  });
}

function assertUniqueSlugs(items: GuidePage[]): void {
  const seen = new Set<string>();
  for (const g of items) {
    if (seen.has(g.slug)) throw new Error(`Duplicate guide slug: ${g.slug}`);
    seen.add(g.slug);
  }
}

function loadProductGuidePacks(): GuidePage[] {
  return [
    ...buildAllCrmProductGuides(),
    ...buildAllSiProductGuides(),
    ...buildAllEmProductGuides(),
    ...buildAllMarketingProductGuides(),
    ...buildAllBcProductGuides(),
    ...buildAllPmProductGuides(),
    ...buildAllHrProductGuides(),
    ...buildAllEcommerceProductGuides(),
    ...buildAllAiProductGuides(),
    ...buildAllItProductGuides(),
  ];
}

function loadGuides(): GuidePage[] {
  if (fullCache) return fullCache;
  const all = [
    ...loadEducationalGuidesUnfiltered(),
    ...loadProductGuidePacks(),
  ];
  assertUniqueSlugs(all);
  fullCache = all;
  return fullCache;
}

function publishFilter(
  guides: GuidePage[],
  options: ListOptions = {},
): GuidePage[] {
  return filterByPublicationVisibility(guides, options);
}

const PRODUCT_GUIDE_KIND_SUFFIXES = [
  "implementation",
  "migration",
  "setup",
  "plans",
] as const;

/** Parse product-guide slugs: `is-{product}-worth-it` or `{product}-{kind}`. */
function productSlugFromGuideSlug(slug: string): string | null {
  if (slug.startsWith("is-") && slug.endsWith("-worth-it")) {
    const product = slug.slice(3, -"-worth-it".length);
    return product.length > 0 ? product : null;
  }
  for (const kind of PRODUCT_GUIDE_KIND_SUFFIXES) {
    const suffix = `-${kind}`;
    if (slug.endsWith(suffix)) {
      const product = slug.slice(0, -suffix.length);
      return product.length > 0 ? product : null;
    }
  }
  return null;
}

export function getAllGuidesUnfiltered(): GuidePage[] {
  return loadGuides();
}

export function getGuides(options?: ListOptions): GuidePage[] {
  return publishFilter(loadGuides(), options);
}

export function getGuideBySlug(
  slug: string,
  options?: ListOptions,
): GuidePage | undefined {
  if (fullCache) {
    return publishFilter(fullCache, options).find((g) => g.slug === slug);
  }

  const educational = publishFilter(
    loadEducationalGuidesUnfiltered(),
    options,
  ).find((g) => g.slug === slug);
  if (educational) return educational;

  const productSlug = productSlugFromGuideSlug(slug);
  if (productSlug) {
    const pack = parseGuides(
      buildProductGuidePackForSlug(productSlug),
      `product guide ${productSlug}`,
    );
    return publishFilter(pack, options).find((g) => g.slug === slug);
  }

  return undefined;
}

export function getGuidesByCategory(
  categorySlug: string,
  options?: ListOptions,
): GuidePage[] {
  return getGuides(options).filter((g) =>
    g.categorySlugs.includes(categorySlug),
  );
}

export function getGuidesByProduct(
  productSlug: string,
  options?: ListOptions,
): GuidePage[] {
  if (fullCache) {
    return publishFilter(
      fullCache.filter((g) => g.productSlugs.includes(productSlug)),
      options,
    );
  }

  const pack = parseGuides(
    buildProductGuidePackForSlug(productSlug),
    `product guide ${productSlug}`,
  );
  return publishFilter(pack, options);
}

export function getGuidesSupportingContentId(
  contentId: string,
  options?: ListOptions,
): GuidePage[] {
  return getGuides(options).filter((g) =>
    g.supports.some((s) => s.contentId === contentId),
  );
}

export {
  getEducationalGuides,
  getEducationalGuideBySlug,
} from "./guides-educational";
