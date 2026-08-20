import { z } from "zod";
import {
  AlternativesPageSchema,
  AudiencePageSchema,
  BestPageSchema,
  BusinessSizeSchema,
  BusinessTypeSchema,
  CategorySchema,
  ComparisonCriterionConfigSchema,
  ComparisonSchema,
  CapabilitySchema,
  IndustrySchema,
  MigrationRecordSchema,
  ResourceSchema,
  ScoringCriterionSchema,
  SoftwareRelationshipSchema,
  SoftwareSchema,
  TeamTypeSchema,
  UseCaseSchema,
  UserPrioritySchema,
  canonicalizeComparisonSlug,
  isSymmetricRelationship,
  type AlternativesPage,
  type AudiencePage,
  type BestPage,
  type BusinessSize,
  type BusinessType,
  type Capability,
  type Category,
  type Comparison,
  type ComparisonCriterionConfig,
  type Industry,
  type MigrationRecord,
  type Resource,
  type ScoringCriterion,
  type Software,
  type SoftwareRelationship,
  type TeamType,
  type UseCase,
  type UserPriority,
} from "@/domain";
import { isPubliclyAvailable } from "@/domain/publishing";
import { alternativesSeed } from "../seed/alternatives";
import { bestPagesSeed } from "../seed/best";
import { categoriesSeed } from "../seed/categories";
import { comparisonCriteriaSeed } from "../seed/comparison-criteria";
import { scoringCriteriaSeed } from "../seed/comparison-criteria";
import { comparisonsSeed } from "../seed/comparisons";
import {
  audiencesSeed,
  businessSizesSeed,
  businessTypesSeed,
  capabilitiesSeed,
  teamTypesSeed,
  useCasesSeed,
  userPrioritiesSeed,
} from "../seed/dimensions";
import { industriesSeed } from "../seed/industries";
import { migrationSeed } from "../seed/migration";
import { relationshipsSeed } from "../seed/relationships";
import { resourcesSeed } from "../seed/resources";
import { listCandidateSoftware } from "../onboarding/store";
import { softwareSeed } from "../seed/software";

export type ListOptions = {
  includeUnpublished?: boolean;
  now?: Date;
};

type Cache = {
  software: Software[] | null;
  categories: Category[] | null;
  industries: Industry[] | null;
  migrations: MigrationRecord[] | null;
  relationships: SoftwareRelationship[] | null;
  comparisons: Comparison[] | null;
  alternatives: AlternativesPage[] | null;
  best: BestPage[] | null;
  businessSizes: BusinessSize[] | null;
  teamTypes: TeamType[] | null;
  businessTypes: BusinessType[] | null;
  useCases: UseCase[] | null;
  capabilities: Capability[] | null;
  resources: Resource[] | null;
  userPriorities: UserPriority[] | null;
  audiences: AudiencePage[] | null;
  scoringCriteria: ScoringCriterion[] | null;
  comparisonCriteria: ComparisonCriterionConfig[] | null;
};

const cache: Cache = {
  software: null,
  categories: null,
  industries: null,
  migrations: null,
  relationships: null,
  comparisons: null,
  alternatives: null,
  best: null,
  businessSizes: null,
  teamTypes: null,
  businessTypes: null,
  useCases: null,
  capabilities: null,
  resources: null,
  userPriorities: null,
  audiences: null,
  scoringCriteria: null,
  comparisonCriteria: null,
};

export function __resetDataCaches(): void {
  for (const key of Object.keys(cache) as (keyof Cache)[]) {
    cache[key] = null;
  }
}

function parseAll<T>(
  schema: z.ZodType<T>,
  items: unknown[],
  label: string,
): T[] {
  const parsed: T[] = [];
  for (const [index, item] of items.entries()) {
    const result = schema.safeParse(item);
    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Invalid ${label} at index ${index}: ${details}`);
    }
    parsed.push(result.data);
  }
  return parsed;
}

function assertUniqueSlugs(items: { slug: string }[], label: string): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.slug)) {
      throw new Error(`Duplicate ${label} slug detected: ${item.slug}`);
    }
    seen.add(item.slug);
  }
}

function filterPublic<T extends { metadata: { status: Software["metadata"]["status"]; publishedAt?: string; scheduledAt?: string } }>(
  items: T[],
  options: ListOptions = {},
): T[] {
  if (options.includeUnpublished) return items;
  return items.filter((item) =>
    isPubliclyAvailable(
      {
        status: item.metadata.status,
        publishedAt: item.metadata.publishedAt,
        scheduledAt: item.metadata.scheduledAt,
      },
      options.now,
    ),
  );
}

function loadSoftware(): Software[] {
  if (!cache.software) {
    const fromSeed = parseAll(SoftwareSchema, softwareSeed, "software");
    const seedSlugs = new Set(fromSeed.map((s) => s.slug));
    // Onboarding candidates overlay — seed wins on slug collision.
    let candidates: Software[] = [];
    try {
      candidates = listCandidateSoftware().filter((c) => !seedSlugs.has(c.slug));
    } catch {
      candidates = [];
    }
    cache.software = [...fromSeed, ...candidates];
    assertUniqueSlugs(cache.software, "software");
  }
  return cache.software;
}

function loadCategories(): Category[] {
  if (!cache.categories) {
    cache.categories = parseAll(CategorySchema, categoriesSeed, "category");
    assertUniqueSlugs(cache.categories, "category");
  }
  return cache.categories;
}

function loadRelationships(): SoftwareRelationship[] {
  if (!cache.relationships) {
    cache.relationships = parseAll(
      SoftwareRelationshipSchema,
      relationshipsSeed,
      "relationship",
    );
    assertUniqueRelationshipKeys(cache.relationships);
  }
  return cache.relationships;
}

function assertUniqueRelationshipKeys(items: SoftwareRelationship[]): void {
  const seen = new Set<string>();
  for (const item of items) {
    const key = `${item.type}:${item.source}:${item.target}`;
    const reverse = `${item.type}:${item.target}:${item.source}`;
    if (seen.has(key)) {
      throw new Error(`Duplicate relationship: ${key}`);
    }
    if (isSymmetricRelationship(item.type) && seen.has(reverse)) {
      throw new Error(
        `Duplicate symmetric relationship (inverse already present): ${key}`,
      );
    }
    seen.add(key);
  }
}

function loadComparisons(): Comparison[] {
  if (!cache.comparisons) {
    cache.comparisons = parseAll(ComparisonSchema, comparisonsSeed, "comparison");
    assertUniqueSlugs(cache.comparisons, "comparison");
    for (const comparison of cache.comparisons) {
      const canonical = canonicalizeComparisonSlug(comparison.productSlugs);
      if (comparison.slug !== canonical) {
        throw new Error(
          `Comparison slug ${comparison.slug} must be canonical ${canonical}`,
        );
      }
    }
  }
  return cache.comparisons;
}

function loadAlternatives(): AlternativesPage[] {
  if (!cache.alternatives) {
    cache.alternatives = parseAll(
      AlternativesPageSchema,
      alternativesSeed,
      "alternatives",
    );
    assertUniqueSlugs(cache.alternatives, "alternatives");
  }
  return cache.alternatives;
}

function loadBest(): BestPage[] {
  if (!cache.best) {
    cache.best = parseAll(BestPageSchema, bestPagesSeed, "best");
    assertUniqueSlugs(cache.best, "best");
  }
  return cache.best;
}

function loadIndustries(): Industry[] {
  if (!cache.industries) {
    cache.industries = parseAll(IndustrySchema, industriesSeed, "industry");
    assertUniqueSlugs(cache.industries, "industry");
  }
  return cache.industries;
}

function loadMigrations(): MigrationRecord[] {
  if (!cache.migrations) {
    cache.migrations = parseAll(
      MigrationRecordSchema,
      migrationSeed,
      "migration",
    );
  }
  return cache.migrations;
}

function loadBusinessSizes(): BusinessSize[] {
  if (!cache.businessSizes) {
    cache.businessSizes = parseAll(
      BusinessSizeSchema,
      businessSizesSeed,
      "business-size",
    );
    assertUniqueSlugs(cache.businessSizes, "business-size");
  }
  return cache.businessSizes;
}

function loadTeamTypes(): TeamType[] {
  if (!cache.teamTypes) {
    cache.teamTypes = parseAll(TeamTypeSchema, teamTypesSeed, "team-type");
    assertUniqueSlugs(cache.teamTypes, "team-type");
  }
  return cache.teamTypes;
}

function loadBusinessTypes(): BusinessType[] {
  if (!cache.businessTypes) {
    cache.businessTypes = parseAll(
      BusinessTypeSchema,
      businessTypesSeed,
      "business-type",
    );
    assertUniqueSlugs(cache.businessTypes, "business-type");
  }
  return cache.businessTypes;
}

function loadUseCases(): UseCase[] {
  if (!cache.useCases) {
    cache.useCases = parseAll(UseCaseSchema, useCasesSeed, "use-case");
    assertUniqueSlugs(cache.useCases, "use-case");
  }
  return cache.useCases;
}

function loadCapabilities(): Capability[] {
  if (!cache.capabilities) {
    cache.capabilities = parseAll(
      CapabilitySchema,
      capabilitiesSeed,
      "capability",
    );
    assertUniqueSlugs(cache.capabilities, "capability");
  }
  return cache.capabilities;
}

function loadResources(): Resource[] {
  if (!cache.resources) {
    cache.resources = parseAll(ResourceSchema, resourcesSeed, "resource");
    assertUniqueSlugs(cache.resources, "resource");
  }
  return cache.resources;
}

function loadUserPriorities(): UserPriority[] {
  if (!cache.userPriorities) {
    cache.userPriorities = parseAll(
      UserPrioritySchema,
      userPrioritiesSeed,
      "user-priority",
    );
    assertUniqueSlugs(cache.userPriorities, "user-priority");
  }
  return cache.userPriorities;
}

function loadAudiences(): AudiencePage[] {
  if (!cache.audiences) {
    cache.audiences = parseAll(AudiencePageSchema, audiencesSeed, "audience");
    assertUniqueSlugs(cache.audiences, "audience");
  }
  return cache.audiences;
}

function loadScoringCriteria(): ScoringCriterion[] {
  if (!cache.scoringCriteria) {
    cache.scoringCriteria = parseAll(
      ScoringCriterionSchema,
      scoringCriteriaSeed,
      "scoring-criterion",
    );
  }
  return cache.scoringCriteria;
}

function loadComparisonCriteria(): ComparisonCriterionConfig[] {
  if (!cache.comparisonCriteria) {
    cache.comparisonCriteria = parseAll(
      ComparisonCriterionConfigSchema,
      comparisonCriteriaSeed,
      "comparison-criterion",
    );
  }
  return cache.comparisonCriteria;
}

export function getSoftware(options?: ListOptions): Software[] {
  return filterPublic(loadSoftware(), options);
}

export function getSoftwareBySlug(
  slug: string,
  options?: ListOptions,
): Software | undefined {
  return getSoftware(options).find((item) => item.slug === slug);
}

export function getAllSoftwareUnfiltered(): Software[] {
  return loadSoftware();
}

export function getCategories(options?: ListOptions): Category[] {
  return filterPublic(loadCategories(), options).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

export function getAllCategoriesUnfiltered(): Category[] {
  return loadCategories();
}

export function getCategoryBySlug(
  slug: string,
  options?: ListOptions,
): Category | undefined {
  return getCategories(options).find((item) => item.slug === slug);
}

export function getCategoryByPath(
  path: string[],
  options?: ListOptions,
): Category | undefined {
  const key = path.join("/");
  return getCategories(options).find((item) => item.path.join("/") === key);
}

export function getChildCategories(
  parentSlug: string,
  options?: ListOptions,
): Category[] {
  return getCategories(options)
    .filter((c) => c.parentSlug === parentSlug)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Includes supported (unpublished) children for hub "browse by need" labels. */
export function getChildCategoriesIncludingSupported(
  parentSlug: string,
): Category[] {
  return loadCategories()
    .filter((c) => c.parentSlug === parentSlug)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getTopLevelCategories(options?: ListOptions): Category[] {
  return getCategories(options).filter((c) => c.parentSlug === null);
}

export type CategoryMembershipStrength = "primary" | "secondary" | "adjacent";

/**
 * Category membership for hubs:
 * - primary: product.primaryCategorySlug === category
 * - secondary: listed in secondaryCategorySlugs
 * - adjacent: only via subcategory under this parent (not primary/secondary)
 */
export function getCategoryMembershipStrength(
  software: Software,
  categorySlug: string,
): CategoryMembershipStrength | null {
  if (software.primaryCategorySlug === categorySlug) return "primary";
  if (software.secondaryCategorySlugs.includes(categorySlug)) return "secondary";
  if (software.subcategorySlugs.includes(categorySlug)) return "adjacent";
  return null;
}

export function getSoftwareByCategory(
  categorySlug: string,
  options?: ListOptions & {
    /** Default: primary + secondary + subcategory (legacy browse). */
    membership?: CategoryMembershipStrength | "core" | "all";
  },
): Software[] {
  const membership = options?.membership ?? "all";
  return getSoftware(options).filter((item) => {
    const strength = getCategoryMembershipStrength(item, categorySlug);
    if (!strength) return false;
    if (membership === "all") return true;
    if (membership === "core") {
      return strength === "primary" || strength === "secondary";
    }
    return strength === membership;
  });
}

/** Primary-category products for Best lists and hub product grids. */
export function getPrimarySoftwareByCategory(
  categorySlug: string,
  options?: ListOptions,
): Software[] {
  return getSoftwareByCategory(categorySlug, {
    ...options,
    membership: "primary",
  });
}

export function getRelationships(): SoftwareRelationship[] {
  return loadRelationships();
}

export function getComparisons(options?: ListOptions): Comparison[] {
  return filterPublic(loadComparisons(), options);
}

export function getAllComparisonsUnfiltered(): Comparison[] {
  return loadComparisons();
}

export function getComparisonBySlug(
  slug: string,
  options?: ListOptions,
): Comparison | undefined {
  return getComparisons(options).find((item) => item.slug === slug);
}

export function getComparisonsForProduct(
  productSlug: string,
  options?: ListOptions,
): Comparison[] {
  return getComparisons(options).filter((c) =>
    c.productSlugs.includes(productSlug),
  );
}

export function getAlternativesPages(
  options?: ListOptions,
): AlternativesPage[] {
  return filterPublic(loadAlternatives(), options);
}

export function getAllAlternativesUnfiltered(): AlternativesPage[] {
  return loadAlternatives();
}

export function getAlternativesPageBySlug(
  slug: string,
  options?: ListOptions,
): AlternativesPage | undefined {
  return getAlternativesPages(options).find((item) => item.slug === slug);
}

export function getBestPages(options?: ListOptions): BestPage[] {
  return filterPublic(loadBest(), options);
}

export function getAllBestPagesUnfiltered(): BestPage[] {
  return loadBest();
}

export function getBestPageBySlug(
  slug: string,
  options?: ListOptions,
): BestPage | undefined {
  return getBestPages(options).find((item) => item.slug === slug);
}

export function getIndustries(options?: ListOptions): Industry[] {
  return filterPublic(loadIndustries(), options);
}

export function getAllIndustriesUnfiltered(): Industry[] {
  return loadIndustries();
}

export function getIndustryBySlug(
  slug: string,
  options?: ListOptions,
): Industry | undefined {
  return getIndustries(options).find((item) => item.slug === slug);
}

export function getMigrationRecords(): MigrationRecord[] {
  return loadMigrations();
}

export function getBusinessSizes(): BusinessSize[] {
  return loadBusinessSizes().sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getTeamTypes(): TeamType[] {
  return loadTeamTypes().sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getBusinessTypes(): BusinessType[] {
  return loadBusinessTypes().sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getUseCases(): UseCase[] {
  return loadUseCases();
}

export function getCapabilities(): Capability[] {
  return loadCapabilities();
}

export function getCapabilityBySlug(slug: string): Capability | undefined {
  return loadCapabilities().find((c) => c.slug === slug);
}

export function getResources(options?: ListOptions): Resource[] {
  return filterPublic(loadResources(), options).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

export function getAllResourcesUnfiltered(): Resource[] {
  return loadResources().sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getResourceBySlug(
  slug: string,
  options?: ListOptions,
): Resource | undefined {
  return getResources(options).find((item) => item.slug === slug);
}

export function getUserPriorities(): UserPriority[] {
  return loadUserPriorities().sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAudiences(options?: ListOptions): AudiencePage[] {
  return filterPublic(loadAudiences(), options);
}

export function getAllAudiencesUnfiltered(): AudiencePage[] {
  return loadAudiences();
}

export function getAudienceBySlug(
  slug: string,
  options?: ListOptions,
): AudiencePage | undefined {
  return getAudiences({ ...options, includeUnpublished: true }).find(
    (a) => a.slug === slug,
  );
}

export function getScoringCriteria(categorySlug?: string): ScoringCriterion[] {
  const all = loadScoringCriteria();
  return categorySlug
    ? all.filter((c) => c.categorySlug === categorySlug)
    : all;
}

export function getComparisonCriteria(
  categorySlug?: string,
): ComparisonCriterionConfig[] {
  const all = loadComparisonCriteria();
  return categorySlug
    ? all.filter((c) => c.applicableCategorySlugs.includes(categorySlug))
    : all;
}

export function parseSoftware(data: unknown): Software {
  return SoftwareSchema.parse(data);
}

export function safeParseSoftware(data: unknown) {
  return SoftwareSchema.safeParse(data);
}

export function safeParseRelationship(data: unknown) {
  return SoftwareRelationshipSchema.safeParse(data);
}

export function safeParseAlternativesPage(data: unknown) {
  return AlternativesPageSchema.safeParse(data);
}

export function safeParseComparison(data: unknown) {
  return ComparisonSchema.safeParse(data);
}
