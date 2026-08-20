import type { GuidePage } from "@/domain";
import {
  getAllComparisonsUnfiltered,
  getAlternativesPageBySlug,
  getCapabilities,
  getCategoryBySlug,
  getIndustries,
  getResources,
  getSoftware,
  getUseCases,
} from "@/data";
import {
  getGuides,
} from "@/data/repositories/guides";
import { isEntityIndexable } from "@/domain/quality-gates";
import { getSoftwareLinkGroups } from "@/services/relationships/software-links";
import { pathForContent } from "@/services/publishing/ids";
import { factoryProductGuideKind } from "@/services/product-guides/kinds";
import { normalizePath } from "@/seo/canonical";
import { resolveCrmJourneyModules } from "./journey";
import { dedupePlanByHref, makeLink, selectLinks } from "./select";
import {
  EMPTY_LINK_PLAN,
  type ContextualLink,
  type LinkEntityType,
  type PageLinkPlan,
} from "./types";

const CRM_HUB = "/categories/crm/";

function guidePath(slug: string): string {
  return `/guides/${slug}/`;
}

function guideContentId(slug: string): string {
  return `content:guide:${slug}`;
}

/** Guides that list this guide (or its content id) as a support / related target. */
export function findSupportingGuides(pillar: GuidePage): GuidePage[] {
  if (factoryProductGuideKind(pillar)) return [];
  const pillarId = guideContentId(pillar.slug);
  return getGuides().filter((g) => {
    if (g.slug === pillar.slug) return false;
    if (factoryProductGuideKind(g)) return false;
    if (!isEntityIndexable({ kind: "guide", entity: g })) return false;
    if (g.relatedGuideSlugs.includes(pillar.slug)) return true;
    return g.supports.some(
      (s) => s.contentId === pillarId || s.contentId === `content:guide:${pillar.slug}`,
    );
  });
}

/** Pillar / parent guide for a supporting article. */
export function findPillarParent(guide: GuidePage): GuidePage | null {
  const primary = guide.supports.find((s) => s.primary && s.contentId.startsWith("content:guide:"));
  const edge =
    primary ??
    guide.supports.find((s) => s.contentId.startsWith("content:guide:"));
  if (edge) {
    const slug = edge.contentId.replace(/^content:guide:/, "");
    const parent = getGuides().find((g) => g.slug === slug);
    if (parent && isEntityIndexable({ kind: "guide", entity: parent })) {
      if (!factoryProductGuideKind(parent)) {
        return parent;
      }
    }
  }
  for (const slug of guide.relatedGuideSlugs) {
    const related = getGuides().find((g) => g.slug === slug);
    if (
      related &&
      isEntityIndexable({ kind: "guide", entity: related }) &&
      (related.topicType === "implementation" ||
        related.topicType === "buying-guide" ||
        related.topicType === "selection" ||
        related.knowledgeAreaSlug === guide.knowledgeAreaSlug)
    ) {
      // Prefer longer / more foundational titles as pillars when related
      if (related.slug !== guide.slug && !factoryProductGuideKind(related)) {
        return related;
      }
    }
  }
  return null;
}

function productPackComparisonLinks(productSlug: string): Array<ContextualLink | null> {
  const comparisons = getAllComparisonsUnfiltered().filter(
    (c) =>
      c.productSlugs.includes(productSlug) &&
      isEntityIndexable({ kind: "comparison", entity: c }),
  );
  const soft = getSoftware().find((s) => s.slug === productSlug);
  const peer = soft?.competitorSlugs.find((s) => s !== productSlug);
  const preferred = peer
    ? comparisons.filter((c) => c.productSlugs.includes(peer))
    : [];
  const rest = comparisons.filter(
    (c) => !preferred.some((p) => p.slug === c.slug),
  );
  return [...preferred, ...rest].slice(0, 2).map((c) =>
    makeLink({
      href: `/compare/${c.slug}/`,
      label: c.title,
      relationship: "compares",
      module: "relatedComparisons",
      entityType: "comparison",
      score: 84,
    }),
  );
}

export function buildGuideLinkPlan(guide: GuidePage): PageLinkPlan {
  const sourcePath = normalizePath(
    guide.seo.canonicalPath || guidePath(guide.slug),
  );
  const plan = EMPTY_LINK_PLAN(sourcePath, "guide");
  const exclude = [sourcePath];
  const packKind = factoryProductGuideKind(guide);
  const productSlug = packKind ? guide.productSlugs[0] : undefined;

  const parentLinks: Array<ContextualLink | null> = [];

  if (!packKind) {
    parentLinks.push(
      makeLink({
        href: "/guides/",
        label: "Software buying guides",
        relationship: "parent",
        module: "parentHub",
        entityType: "hub",
        score: 100,
      }),
    );
  }

  for (const catSlug of guide.categorySlugs.slice(0, 1)) {
    const cat = getCategoryBySlug(catSlug);
    if (!cat || !isEntityIndexable({ kind: "category", entity: cat })) continue;
    parentLinks.push(
      makeLink({
        href: cat.seo.canonicalPath || `/categories/${catSlug}/`,
        label: `${cat.name} hub`,
        relationship: "parent",
        module: "parentHub",
        entityType: "category",
        score: 95,
      }),
    );
  }

  if (!packKind) {
    const pillar = findPillarParent(guide);
    if (pillar) {
      parentLinks.push(
        makeLink({
          href: guidePath(pillar.slug),
          label: pillar.title,
          relationship: "parent",
          module: "parentHub",
          entityType: "guide",
          score: 98,
          description: "Parent guide in this topic cluster",
        }),
      );
    }
  }

  for (const slug of guide.productSlugs.slice(0, 2)) {
    const soft = getSoftware().find((s) => s.slug === slug);
    if (!soft) continue;
    parentLinks.push(
      makeLink({
        href: `/software/${slug}/`,
        label: `${soft.name} review`,
        relationship: "supports",
        module: "parentHub",
        entityType: "software",
        score: packKind ? 97 : 86,
      }),
    );
  }

  if (parentLinks.filter(Boolean).length === 0) {
    parentLinks.push(
      makeLink({
        href: "/guides/",
        label: "Software buying guides",
        relationship: "parent",
        module: "parentHub",
        entityType: "hub",
        score: 100,
      }),
    );
  }

  plan.parentHub = selectLinks(parentLinks, {
    module: "parentHub",
    excludeHrefs: exclude,
  });

  const relatedGuideLinks: Array<ContextualLink | null> = [];

  // Explicit related
  for (const slug of guide.relatedGuideSlugs) {
    const g = getGuides().find((x) => x.slug === slug);
    if (!g || !isEntityIndexable({ kind: "guide", entity: g })) continue;
    relatedGuideLinks.push(
      makeLink({
        href: guidePath(slug),
        label: g.title,
        relationship: "related",
        module: "relatedGuides",
        entityType: "guide",
        score: 90,
        description: g.summary,
      }),
    );
  }

  // Supporting articles under this pillar — not factory product packs
  if (!packKind) {
    for (const support of findSupportingGuides(guide)) {
      relatedGuideLinks.push(
        makeLink({
          href: guidePath(support.slug),
          label: support.title,
          relationship: "supportedBy",
          module: "relatedGuides",
          entityType: "guide",
          score: 88,
          description: support.summary,
        }),
      );
    }
  }

  // Same knowledge area — skip when the page already has a directed related list
  if (guide.knowledgeAreaSlug && guide.relatedGuideSlugs.length === 0 && !packKind) {
    for (const g of getGuides()) {
      if (g.slug === guide.slug) continue;
      if (factoryProductGuideKind(g)) continue;
      if (g.knowledgeAreaSlug !== guide.knowledgeAreaSlug) continue;
      if (!guide.categorySlugs.some((c) => g.categorySlugs.includes(c))) continue;
      if (!isEntityIndexable({ kind: "guide", entity: g })) continue;
      relatedGuideLinks.push(
        makeLink({
          href: guidePath(g.slug),
          label: g.title,
          relationship: "related",
          module: "relatedGuides",
          entityType: "guide",
          score: 70,
          description: g.summary,
        }),
      );
    }
  }

  plan.relatedGuides = selectLinks(relatedGuideLinks, {
    module: "relatedGuides",
    excludeHrefs: exclude,
  });

  const productLinks: Array<ContextualLink | null> = guide.productSlugs.map(
    (slug) => {
      const soft = getSoftware().find((s) => s.slug === slug);
      if (!soft) return null;
      return makeLink({
        href: `/software/${slug}/`,
        label: `${soft.name} review`,
        relationship: "related",
        module: "relatedProducts",
        entityType: "software",
        score: 80,
      });
    },
  );

  if (productSlug) {
    const alts = getAlternativesPageBySlug(productSlug);
    if (alts && isEntityIndexable({ kind: "alternatives", entity: alts })) {
      productLinks.push(
        makeLink({
          href: alts.seo.canonicalPath || `/alternatives/${productSlug}/`,
          label: alts.title,
          relationship: "alternativeTo",
          module: "relatedProducts",
          entityType: "alternatives",
          score: 78,
        }),
      );
    }
    const soft = getSoftware().find((s) => s.slug === productSlug);
    const peer = soft?.competitorSlugs.find((s) => s !== productSlug);
    if (peer) {
      const peerSoft = getSoftware().find((s) => s.slug === peer);
      if (peerSoft && isEntityIndexable({ kind: "software", entity: peerSoft })) {
        productLinks.push(
          makeLink({
            href: `/software/${peer}/`,
            label: `${peerSoft.name} review`,
            relationship: "compares",
            module: "relatedProducts",
            entityType: "software",
            score: 72,
          }),
        );
      }
    }
  }

  plan.relatedProducts = selectLinks(productLinks, {
    module: "relatedProducts",
    excludeHrefs: exclude,
  });

  if (productSlug) {
    const comparisonLinks = productPackComparisonLinks(productSlug);
    plan.relatedComparisons = selectLinks(comparisonLinks, {
      module: "relatedComparisons",
      excludeHrefs: exclude,
    });
  }

  const resourceCategory = guide.categorySlugs[0] ?? "crm";
  plan.relatedResources = selectLinks(
    getResources()
      .filter((r) => r.categorySlugs.includes(resourceCategory))
      .filter((r) => r.seo.indexable === true)
      .slice(0, 8)
      .map((r) =>
        makeLink({
          href: r.seo.canonicalPath || `/resources/${r.slug}/`,
          label: r.name,
          relationship: "resourceFor",
          module: "relatedResources",
          entityType: "resource",
          score: 60,
        }),
      ),
    { module: "relatedResources", excludeHrefs: exclude, limit: 3 },
  );

  const isCrm = guide.categorySlugs.includes("crm");
  if (isCrm) {
    const journey = resolveCrmJourneyModules({
      sourceType: "guide",
      sourcePath,
      journeyStage: guide.journeyStage,
      topicType: guide.topicType,
      preferredProductSlug: guide.productSlugs[0],
    });
    plan.tryDecisionTool = journey.tryDecisionTool;
    plan.recommendedNextStep = packKind ? [] : journey.recommendedNextStep;
  }

  // Honour explicit nextAction when eligible
  if (guide.nextAction) {
    const parts = guide.nextAction.contentId.split(":");
    if (parts[0] === "content" && parts[1] && parts[2]) {
      const type = parts[1] as Parameters<typeof pathForContent>[0];
      const slug = parts.slice(2).join(":");
      try {
        const href = pathForContent(type, slug);
        const explicit = makeLink({
          href,
          label: guide.nextAction.label,
          relationship: "nextStep",
          module: "recommendedNextStep",
          entityType: (type === "use-case" ? "use-case" : type) as LinkEntityType,
          score: 99,
        });
        if (explicit) {
          plan.recommendedNextStep = selectLinks(
            [explicit, ...plan.recommendedNextStep],
            { module: "recommendedNextStep", excludeHrefs: exclude },
          );
        }
      } catch {
        // ignore bad content ids
      }
    }
  }

  return dedupePlanByHref(plan);
}

export function buildSoftwareLinkPlan(slug: string): PageLinkPlan | null {
  const soft = getSoftware().find((s) => s.slug === slug);
  if (!soft) return null;
  const sourcePath = `/software/${slug}/`;
  const plan = EMPTY_LINK_PLAN(sourcePath, "software");
  const groups = getSoftwareLinkGroups(soft);

  plan.parentHub = selectLinks(
    [
      makeLink({
        href: "/software/",
        label: "Software reviews",
        relationship: "parent",
        module: "parentHub",
        entityType: "hub",
        score: 92,
      }),
      soft.primaryCategorySlug === "crm"
        ? makeLink({
            href: CRM_HUB,
            label: "CRM Software hub",
            relationship: "parent",
            module: "parentHub",
            entityType: "category",
            score: 100,
          })
        : null,
      ...groups.categories.map((l) =>
        makeLink({
          href: l.href,
          label: l.label,
          relationship: "parent",
          module: "parentHub",
          entityType: "category",
          score: l.priority,
        }),
      ),
    ],
    { module: "parentHub", excludeHrefs: [sourcePath] },
  );

  plan.relatedProducts = selectLinks(
    groups.software.map((l) =>
      makeLink({
        href: l.href,
        label: l.label,
        relationship:
          l.relationship === "competesWith" ? "compares" : "alternativeTo",
        module: "relatedProducts",
        entityType: "software",
        score: l.priority,
      }),
    ),
    { module: "relatedProducts", excludeHrefs: [sourcePath] },
  );

  plan.relatedComparisons = selectLinks(
    groups.comparisons.map((l) =>
      makeLink({
        href: l.href,
        label: l.label,
        relationship: "compares",
        module: "relatedComparisons",
        entityType: "comparison",
        score: l.priority,
      }),
    ),
    { module: "relatedComparisons", excludeHrefs: [sourcePath] },
  );

  plan.relatedGuides = selectLinks(
    groups.guides.map((l) =>
      makeLink({
        href: l.href,
        label: l.label,
        relationship: "supportedBy",
        module: "relatedGuides",
        entityType: "guide",
        score: l.priority,
      }),
    ),
    { module: "relatedGuides", excludeHrefs: [sourcePath] },
  );

  const journey = resolveCrmJourneyModules({
    sourceType: "software",
    sourcePath,
    preferredProductSlug: slug,
  });
  plan.recommendedNextStep = journey.recommendedNextStep;
  plan.tryDecisionTool = journey.tryDecisionTool;

  return dedupePlanByHref(plan);
}

export function buildFeatureLinkPlan(input: {
  featureSlug: string;
  featureName: string;
  capabilityHref: string | null;
  capabilityName: string | null;
  relatedFeatures: Array<{ slug: string; name: string; href: string }>;
  relatedCapabilities: Array<{ slug: string; name: string; href: string }>;
  relatedRequirementSlugs?: string[];
  useCaseSlugs?: string[];
  comparisons?: Array<{ href: string; title: string }>;
  productSlugs?: string[];
}): PageLinkPlan {
  const sourcePath = `/features/${input.featureSlug}/`;
  const plan = EMPTY_LINK_PLAN(sourcePath, "feature");
  const exclude = [sourcePath];

  plan.parentHub = selectLinks(
    [
      makeLink({
        href: "/features/",
        label: "CRM features",
        relationship: "parent",
        module: "parentHub",
        entityType: "hub",
        score: 100,
      }),
      input.capabilityHref
        ? makeLink({
            href: input.capabilityHref,
            label: input.capabilityName
              ? `${input.capabilityName} capability`
              : "Related capability",
            relationship: "parent",
            module: "parentHub",
            entityType: "capability",
            score: 95,
          })
        : null,
      makeLink({
        href: CRM_HUB,
        label: "CRM Software hub",
        relationship: "parent",
        module: "parentHub",
        entityType: "category",
        score: 80,
      }),
    ],
    { module: "parentHub", excludeHrefs: exclude },
  );

  plan.relatedFeatures = selectLinks(
    input.relatedFeatures.map((f) =>
      makeLink({
        href: f.href,
        label: f.name,
        relationship: "related",
        module: "relatedFeatures",
        entityType: "feature",
        score: 80,
      }),
    ),
    { module: "relatedFeatures", excludeHrefs: exclude },
  );

  plan.relatedCapabilities = selectLinks(
    input.relatedCapabilities.map((c) =>
      makeLink({
        href: c.href,
        label: c.name,
        relationship: "related",
        module: "relatedCapabilities",
        entityType: "capability",
        score: 85,
      }),
    ),
    { module: "relatedCapabilities", excludeHrefs: exclude },
  );

  plan.relatedRequirements = selectLinks(
    (input.relatedRequirementSlugs ?? []).map((slug) =>
      makeLink({
        href: `/requirements/${slug}/`,
        label: `CRM requirement: ${slug.replace(/-/g, " ")}`,
        relationship: "satisfies",
        module: "relatedRequirements",
        entityType: "requirement",
        score: 88,
      }),
    ),
    { module: "relatedRequirements", excludeHrefs: exclude },
  );

  plan.relatedUseCases = selectLinks(
    (input.useCaseSlugs ?? []).map((slug) => {
      const uc = getUseCases().find((u) => u.slug === slug);
      return makeLink({
        href: `/use-cases/${slug}/`,
        label: uc?.name ?? slug.replace(/-/g, " "),
        relationship: "relevantToUseCase",
        module: "relatedUseCases",
        entityType: "use-case",
        score: 82,
      });
    }),
    { module: "relatedUseCases", excludeHrefs: exclude },
  );

  plan.relatedComparisons = selectLinks(
    (input.comparisons ?? []).map((c) =>
      makeLink({
        href: c.href,
        label: c.title,
        relationship: "compares",
        module: "relatedComparisons",
        entityType: "comparison",
        score: 75,
      }),
    ),
    { module: "relatedComparisons", excludeHrefs: exclude },
  );

  plan.relatedProducts = selectLinks(
    (input.productSlugs ?? []).map((slug) => {
      const soft = getSoftware().find((s) => s.slug === slug);
      return makeLink({
        href: `/software/${slug}/`,
        label: soft ? `${soft.name} review` : slug,
        relationship: "related",
        module: "relatedProducts",
        entityType: "software",
        score: 78,
      });
    }),
    { module: "relatedProducts", excludeHrefs: exclude },
  );

  const journey = resolveCrmJourneyModules({
    sourceType: "feature",
    sourcePath,
  });
  plan.recommendedNextStep = journey.recommendedNextStep;
  plan.tryDecisionTool = journey.tryDecisionTool;

  return dedupePlanByHref(plan);
}

export function buildRequirementLinkPlan(input: {
  requirementSlug: string;
  requirementName: string;
  capabilitySlugs?: string[];
  featureSlugs?: string[];
  useCaseSlugs?: string[];
  productSlugs?: string[];
}): PageLinkPlan {
  const sourcePath = `/requirements/${input.requirementSlug}/`;
  const plan = EMPTY_LINK_PLAN(sourcePath, "requirement");
  const exclude = [sourcePath];

  plan.parentHub = selectLinks(
    [
      makeLink({
        href: "/requirements/",
        label: "CRM requirements",
        relationship: "parent",
        module: "parentHub",
        entityType: "hub",
        score: 100,
      }),
      ...(input.capabilitySlugs ?? []).slice(0, 2).map((slug) => {
        const cap = getCapabilities().find((c) => c.slug === slug);
        return makeLink({
          href: `/capabilities/${slug}/`,
          label: cap?.name ?? slug,
          relationship: "parent",
          module: "parentHub",
          entityType: "capability",
          score: 92,
        });
      }),
      makeLink({
        href: CRM_HUB,
        label: "CRM Software hub",
        relationship: "parent",
        module: "parentHub",
        entityType: "category",
        score: 80,
      }),
    ],
    { module: "parentHub", excludeHrefs: exclude },
  );

  plan.relatedCapabilities = selectLinks(
    (input.capabilitySlugs ?? []).map((slug) => {
      const cap = getCapabilities().find((c) => c.slug === slug);
      return makeLink({
        href: `/capabilities/${slug}/`,
        label: cap?.name ?? slug,
        relationship: "requires",
        module: "relatedCapabilities",
        entityType: "capability",
        score: 90,
      });
    }),
    { module: "relatedCapabilities", excludeHrefs: exclude },
  );

  plan.relatedFeatures = selectLinks(
    (input.featureSlugs ?? []).map((slug) =>
      makeLink({
        href: `/features/${slug}/`,
        label: slug.replace(/-/g, " "),
        relationship: "satisfies",
        module: "relatedFeatures",
        entityType: "feature",
        score: 88,
      }),
    ),
    { module: "relatedFeatures", excludeHrefs: exclude },
  );

  plan.relatedUseCases = selectLinks(
    (input.useCaseSlugs ?? []).map((slug) => {
      const uc = getUseCases().find((u) => u.slug === slug);
      return makeLink({
        href: `/use-cases/${slug}/`,
        label: uc?.name ?? slug,
        relationship: "relevantToUseCase",
        module: "relatedUseCases",
        entityType: "use-case",
        score: 85,
      });
    }),
    { module: "relatedUseCases", excludeHrefs: exclude },
  );

  plan.relatedProducts = selectLinks(
    (input.productSlugs ?? []).map((slug) => {
      const soft = getSoftware().find((s) => s.slug === slug);
      return makeLink({
        href: `/software/${slug}/`,
        label: soft ? `${soft.name} review` : slug,
        relationship: "related",
        module: "relatedProducts",
        entityType: "software",
        score: 80,
      });
    }),
    { module: "relatedProducts", excludeHrefs: exclude },
  );

  const journey = resolveCrmJourneyModules({
    sourceType: "requirement",
    sourcePath,
  });
  plan.recommendedNextStep = journey.recommendedNextStep;
  plan.tryDecisionTool = journey.tryDecisionTool;

  return dedupePlanByHref(plan);
}

export function buildUseCaseLinkPlan(input: {
  useCaseSlug: string;
  useCaseName: string;
  capabilityHrefs?: Array<{ href: string; label: string }>;
  relatedUseCases?: Array<{ slug: string; name: string; href: string }>;
  productSlugs?: string[];
  comparisonHrefs?: Array<{ href: string; title: string }>;
  industrySlugs?: string[];
}): PageLinkPlan {
  const sourcePath = `/use-cases/${input.useCaseSlug}/`;
  const plan = EMPTY_LINK_PLAN(sourcePath, "use-case");
  const exclude = [sourcePath];

  plan.parentHub = selectLinks(
    [
      makeLink({
        href: "/use-cases/",
        label: "CRM use cases",
        relationship: "parent",
        module: "parentHub",
        entityType: "hub",
        score: 100,
      }),
      makeLink({
        href: CRM_HUB,
        label: "CRM Software hub",
        relationship: "parent",
        module: "parentHub",
        entityType: "category",
        score: 95,
      }),
    ],
    { module: "parentHub", excludeHrefs: exclude },
  );

  plan.relatedCapabilities = selectLinks(
    (input.capabilityHrefs ?? []).map((c) =>
      makeLink({
        href: c.href,
        label: c.label,
        relationship: "requires",
        module: "relatedCapabilities",
        entityType: "capability",
        score: 90,
      }),
    ),
    { module: "relatedCapabilities", excludeHrefs: exclude },
  );

  plan.relatedUseCases = selectLinks(
    (input.relatedUseCases ?? []).map((uc) =>
      makeLink({
        href: uc.href,
        label: uc.name,
        relationship: "related",
        module: "relatedUseCases",
        entityType: "use-case",
        score: 80,
      }),
    ),
    { module: "relatedUseCases", excludeHrefs: exclude },
  );

  plan.relatedProducts = selectLinks(
    (input.productSlugs ?? []).map((slug) => {
      const soft = getSoftware().find((s) => s.slug === slug);
      return makeLink({
        href: `/software/${slug}/`,
        label: soft ? `${soft.name} review` : slug,
        relationship: "related",
        module: "relatedProducts",
        entityType: "software",
        score: 85,
      });
    }),
    { module: "relatedProducts", excludeHrefs: exclude },
  );

  plan.relatedComparisons = selectLinks(
    (input.comparisonHrefs ?? []).map((c) =>
      makeLink({
        href: c.href,
        label: c.title,
        relationship: "compares",
        module: "relatedComparisons",
        entityType: "comparison",
        score: 75,
      }),
    ),
    { module: "relatedComparisons", excludeHrefs: exclude },
  );

  plan.relatedIndustries = selectLinks(
    (input.industrySlugs ?? []).map((slug) => {
      const ind = getIndustries().find((i) => i.slug === slug);
      return makeLink({
        href: `/industries/${slug}/`,
        label: ind?.name ?? slug,
        relationship: "relevantToIndustry",
        module: "relatedIndustries",
        entityType: "industry",
        score: 70,
      });
    }),
    { module: "relatedIndustries", excludeHrefs: exclude },
  );

  const journey = resolveCrmJourneyModules({
    sourceType: "use-case",
    sourcePath,
  });
  plan.recommendedNextStep = journey.recommendedNextStep;
  plan.tryDecisionTool = journey.tryDecisionTool;

  return dedupePlanByHref(plan);
}

export function buildCapabilityLinkPlan(input: {
  capabilitySlug: string;
  capabilityName: string;
  useCaseSlugs?: string[];
  featureSlugs?: string[];
  requirementSlugs?: string[];
  productSlugs?: string[];
}): PageLinkPlan {
  const sourcePath = `/capabilities/${input.capabilitySlug}/`;
  const plan = EMPTY_LINK_PLAN(sourcePath, "capability");
  const exclude = [sourcePath];

  plan.parentHub = selectLinks(
    [
      makeLink({
        href: "/capabilities/",
        label: "CRM capabilities",
        relationship: "parent",
        module: "parentHub",
        entityType: "hub",
        score: 100,
      }),
      makeLink({
        href: CRM_HUB,
        label: "CRM Software hub",
        relationship: "parent",
        module: "parentHub",
        entityType: "category",
        score: 90,
      }),
    ],
    { module: "parentHub", excludeHrefs: exclude },
  );

  plan.relatedUseCases = selectLinks(
    (input.useCaseSlugs ?? []).map((slug) => {
      const uc = getUseCases().find((u) => u.slug === slug);
      return makeLink({
        href: `/use-cases/${slug}/`,
        label: uc?.name ?? slug,
        relationship: "relevantToUseCase",
        module: "relatedUseCases",
        entityType: "use-case",
        score: 88,
      });
    }),
    { module: "relatedUseCases", excludeHrefs: exclude },
  );

  plan.relatedFeatures = selectLinks(
    (input.featureSlugs ?? []).map((slug) =>
      makeLink({
        href: `/features/${slug}/`,
        label: slug.replace(/-/g, " "),
        relationship: "child",
        module: "relatedFeatures",
        entityType: "feature",
        score: 86,
      }),
    ),
    { module: "relatedFeatures", excludeHrefs: exclude },
  );

  plan.relatedRequirements = selectLinks(
    (input.requirementSlugs ?? []).map((slug) =>
      makeLink({
        href: `/requirements/${slug}/`,
        label: slug.replace(/-/g, " "),
        relationship: "requires",
        module: "relatedRequirements",
        entityType: "requirement",
        score: 90,
      }),
    ),
    { module: "relatedRequirements", excludeHrefs: exclude },
  );

  plan.relatedProducts = selectLinks(
    (input.productSlugs ?? []).map((slug) => {
      const soft = getSoftware().find((s) => s.slug === slug);
      return makeLink({
        href: `/software/${slug}/`,
        label: soft ? `${soft.name} review` : slug,
        relationship: "related",
        module: "relatedProducts",
        entityType: "software",
        score: 75,
      });
    }),
    { module: "relatedProducts", excludeHrefs: exclude },
  );

  const journey = resolveCrmJourneyModules({
    sourceType: "capability",
    sourcePath,
  });
  plan.recommendedNextStep = journey.recommendedNextStep;
  plan.tryDecisionTool = journey.tryDecisionTool;

  return dedupePlanByHref(plan);
}

export function buildResourceLinkPlan(input: {
  resourceSlug: string;
  resourceName: string;
  relatedGuideSlugs?: string[];
}): PageLinkPlan {
  const sourcePath = `/resources/${input.resourceSlug}/`;
  const plan = EMPTY_LINK_PLAN(sourcePath, "resource");
  const exclude = [sourcePath];

  plan.parentHub = selectLinks(
    [
      makeLink({
        href: "/resources/",
        label: "CRM resources",
        relationship: "parent",
        module: "parentHub",
        entityType: "hub",
        score: 100,
      }),
      makeLink({
        href: CRM_HUB,
        label: "CRM Software hub",
        relationship: "parent",
        module: "parentHub",
        entityType: "category",
        score: 85,
      }),
    ],
    { module: "parentHub", excludeHrefs: exclude },
  );

  plan.relatedGuides = selectLinks(
    (input.relatedGuideSlugs ?? []).map((slug) => {
      const g = getGuides().find((x) => x.slug === slug);
      return makeLink({
        href: guidePath(slug),
        label: g?.title ?? slug,
        relationship: "supports",
        module: "relatedGuides",
        entityType: "guide",
        score: 90,
      });
    }),
    { module: "relatedGuides", excludeHrefs: exclude },
  );

  const journey = resolveCrmJourneyModules({
    sourceType: "resource",
    sourcePath,
  });
  plan.recommendedNextStep = journey.recommendedNextStep;
  plan.tryDecisionTool = journey.tryDecisionTool;

  return dedupePlanByHref(plan);
}

/** Lightweight comparison edges for product clusters (indexable only). */
export function listIndexableComparisonsForProduct(slug: string, limit = 4) {
  return getAllComparisonsUnfiltered()
    .filter((c) => c.productSlugs.includes(slug))
    .filter((c) => isEntityIndexable({ kind: "comparison", entity: c }))
    .slice(0, limit)
    .map((c) => ({
      href: `/compare/${c.slug}/`,
      title: c.title,
    }));
}
