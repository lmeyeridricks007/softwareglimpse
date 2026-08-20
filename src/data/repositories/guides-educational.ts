import { GuidePageSchema, type GuidePage } from "@/domain";
import { isPubliclyAvailable } from "@/domain/publishing";
import { withTeachingDepth } from "@/services/guides/teaching-depth";
import { guidesSeed } from "../seed/guides";

type ListOptions = {
  includeUnpublished?: boolean;
  now?: Date;
};

let educationalCache: GuidePage[] | null = null;

export function __resetEducationalGuideCaches(): void {
  educationalCache = null;
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

function publishFilter(
  guides: GuidePage[],
  options: ListOptions = {},
): GuidePage[] {
  const now = options.now ?? new Date();
  return options.includeUnpublished
    ? guides
    : guides.filter((g) => isPubliclyAvailable(g.metadata, now));
}

function loadEducationalGuides(): GuidePage[] {
  if (educationalCache) return educationalCache;
  educationalCache = parseGuides(guidesSeed, "guide").map(withTeachingDepth);
  assertUniqueSlugs(educationalCache);
  return educationalCache;
}

/** Educational guides only — does not import product-guide builders. */
export function getEducationalGuides(options?: ListOptions): GuidePage[] {
  return publishFilter(loadEducationalGuides(), options);
}

export function getEducationalGuideBySlug(
  slug: string,
  options?: ListOptions,
): GuidePage | undefined {
  return getEducationalGuides(options).find((g) => g.slug === slug);
}

/** Unfiltered educational seed (for merging into the full guide registry). */
export function loadEducationalGuidesUnfiltered(): GuidePage[] {
  return loadEducationalGuides();
}
