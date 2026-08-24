import { CategorySchema, type Category } from "@/domain";
import {
  filterByPublicationVisibility,
  type PublicationListOptions,
} from "@/domain/publication-context";
import { categoriesSeed } from "../seed/categories";

type ListOptions = PublicationListOptions;

/**
 * Category lookups for site chrome. Isolated so the header/footer do not
 * import software, comparisons, or best-page seeds.
 */

let cache: Category[] | null = null;

function parseAll(items: unknown[]): Category[] {
  const parsed: Category[] = [];
  for (const [index, item] of items.entries()) {
    const result = CategorySchema.safeParse(item);
    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Invalid category at index ${index}: ${details}`);
    }
    parsed.push(result.data);
  }
  return parsed;
}

function loadCategories(): Category[] {
  if (!cache) {
    cache = parseAll(categoriesSeed);
    const seen = new Set<string>();
    for (const item of cache) {
      if (seen.has(item.slug)) {
        throw new Error(`Duplicate category slug detected: ${item.slug}`);
      }
      seen.add(item.slug);
    }
  }
  return cache;
}

function filterPublic(items: Category[], options: ListOptions = {}): Category[] {
  return filterByPublicationVisibility(items, options);
}

export function getCategories(options?: ListOptions): Category[] {
  return filterPublic(loadCategories(), options).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

export function getTopLevelCategories(options?: ListOptions): Category[] {
  return getCategories(options).filter((c) => c.parentSlug === null);
}
