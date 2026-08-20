import type { Software, SoftwareEntityType, SoftwareOnboardingRequest } from "@/domain";
import { SoftwareSchema } from "@/domain";
import { slugifyProductName } from "./identity";

export function buildCandidateSoftware(input: {
  request: SoftwareOnboardingRequest;
  slug: string;
  primaryCategorySlug: string;
  secondaryCategorySlugs?: string[];
  entityType: SoftwareEntityType;
  company?: string;
}): Software {
  const { request, slug, primaryCategorySlug, entityType } = input;
  const now = new Date().toISOString();

  return SoftwareSchema.parse({
    id: `soft-${slug}`,
    slug,
    name: request.name,
    aliases: request.aliases ?? [],
    formerlyKnownAs: [],
    entityType,
    productLifecycle: "candidate",
    company: input.company ?? request.name,
    website: request.website,
    shortDescription: undefined,
    primaryCategorySlug,
    secondaryCategorySlugs: input.secondaryCategorySlugs ?? [],
    subcategorySlugs: [],
    industrySlugs: [],
    businessSizeSlugs: [],
    businessTypeSlugs: [],
    teamTypeSlugs: [],
    useCaseSlugs: [],
    userPrioritySlugs: [],
    featureRatings: [],
    competitorSlugs: [],
    alternativeSlugs: [],
    comparableSlugs: [],
    affiliate: {
      enabled: false,
      network: "none",
      disclosureRequired: true,
    },
    sources: [],
    metadata: {
      status: "idea",
      researchStatus: "none",
      createdAt: now,
      updatedAt: now,
    },
    seo: {
      title: request.name,
      description: `${request.name} software profile (onboarding candidate — not published).`,
      indexable: false,
      canonicalPath: `/software/${slug}/`,
    },
  });
}

export function resolveSlug(request: SoftwareOnboardingRequest): string {
  return request.slug ?? slugifyProductName(request.name);
}
