import {
  crmFinderAnswersFromDecisionProfile,
  crmRequirementsFromDecisionProfile,
  type CrmDecisionProfile,
  type CrmFinderAnswers,
  type DecisionProfile,
  type FeaturePriority,
  type RequirementPriority,
} from "@/domain";
import {
  crmFinderDefinition,
  siFinderDefinition,
} from "@/components/finder/framework";
import {
  primaryFinderUseCaseFromProfile,
  resolveRequirementMeta,
} from "./derive";
import {
  primarySiFinderUseCaseFromProfile,
  resolveSiRequirementMeta,
} from "./si-derive";
import {
  saveDecisionProfile,
  touchCrmDecisionProfile,
  touchDecisionProfile,
} from "./persistence";

const CRM_COST_STORAGE_KEY = "sg-crm-cost-v1";
const SI_COST_STORAGE_KEY = "sg-si-cost-v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/** Write Finder-compatible blob so category Finder can skip re-asking. */
export function syncDecisionProfileToFinderStorage(
  profile: DecisionProfile,
): boolean {
  if (!canUseStorage()) return false;
  const category = profile.categorySlug;
  const mapped =
    category === "sales-intelligence"
      ? primarySiFinderUseCaseFromProfile(profile)
      : category === "crm"
        ? primaryFinderUseCaseFromProfile(profile)
        : {
            primary: profile.useCases[0]?.id ?? null,
            secondary: profile.useCases.slice(1).map((uc) => uc.id),
          };
  if (!mapped.primary) return false;

  const answers = crmFinderAnswersFromDecisionProfile(profile, {
    primaryUseCaseSlug: mapped.primary,
    secondaryUseCaseSlugs: mapped.secondary,
  });
  if (!answers) return false;

  const storageKey =
    category === "crm"
      ? crmFinderDefinition.storageKey
      : category === "sales-intelligence"
        ? siFinderDefinition.storageKey
        : `sg-${category}-finder-v1`;

  try {
    const existingRaw = localStorage.getItem(storageKey);
    let resultOrder: string[] | undefined;
    if (existingRaw) {
      const existing = JSON.parse(existingRaw) as { resultOrder?: string[] };
      resultOrder = existing.resultOrder;
    }
    localStorage.setItem(
      storageKey,
      JSON.stringify({ ...answers, resultOrder }),
    );
    return true;
  } catch {
    return false;
  }
}

/** Prefill cost calculator draft from the shared profile. */
export function syncDecisionProfileToCostStorage(
  profile: DecisionProfile,
): boolean {
  if (!canUseStorage()) return false;
  const reqs = crmRequirementsFromDecisionProfile(profile);
  if (!reqs) return false;

  const costKey =
    profile.categorySlug === "crm"
      ? CRM_COST_STORAGE_KEY
      : profile.categorySlug === "sales-intelligence"
        ? SI_COST_STORAGE_KEY
        : `sg-${profile.categorySlug}-cost-v1`;

  try {
    const existingRaw = localStorage.getItem(costKey);
    let finderOrderSlugs: string[] | undefined;
    if (existingRaw) {
      const existing = JSON.parse(existingRaw) as {
        finderOrderSlugs?: string[];
      };
      finderOrderSlugs = existing.finderOrderSlugs;
    }
    localStorage.setItem(
      costKey,
      JSON.stringify({
        crmUsers: reqs.crmUsers,
        requiredFeatureSlugs: reqs.requiredFeatureSlugs,
        billingPreference: reqs.billingPreference,
        fromFinder: false,
        fromRequirementsBuilder: true,
        finderOrderSlugs,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

/** Merge legacy Finder answers into a decision profile (one-way upgrade). */
export function mergeFinderAnswersIntoProfile(
  profile: CrmDecisionProfile,
  answers: Partial<CrmFinderAnswers>,
): CrmDecisionProfile {
  const now = new Date().toISOString();
  const useCases = [...profile.useCases];
  if (
    answers.primaryUseCaseSlug &&
    !useCases.some((u) => u.id === answers.primaryUseCaseSlug)
  ) {
    // Store finder catalogue slug as-is when graph mapping is unavailable
    useCases.push({
      id: answers.primaryUseCaseSlug,
      priority: "primary",
    });
  }

  const features = [...profile.features];
  for (const slug of answers.requiredFeatureSlugs ?? []) {
    if (!features.some((f) => f.id === slug)) {
      features.push({
        id: slug,
        priority: "must-have",
        source: "user-selected",
      });
    }
  }
  for (const slug of answers.preferredFeatureSlugs ?? []) {
    if (!features.some((f) => f.id === slug)) {
      features.push({
        id: slug,
        priority: "important",
        source: "user-selected",
      });
    }
  }

  const integrations = [...profile.integrations];
  for (const slug of answers.preferredIntegrationSlugs ?? []) {
    if (slug === "none") continue;
    if (!integrations.some((i) => i.id === slug)) {
      integrations.push({ id: slug, priority: "preferred" });
    }
  }

  return touchCrmDecisionProfile(profile, {
    businessContext: {
      ...profile.businessContext,
      companySizeSlug:
        answers.companySizeSlug ?? profile.businessContext.companySizeSlug,
      crmUserCount:
        answers.crmUsers ?? profile.businessContext.crmUserCount,
      businessTypeSlug:
        answers.businessTypeSlug ?? profile.businessContext.businessTypeSlug,
    },
    useCases,
    features,
    integrations,
    budget: {
      ...profile.budget,
      band: answers.budgetBand ?? profile.budget.band,
    },
    implementation: {
      ...profile.implementation,
      complexity:
        answers.easePreference ?? profile.implementation.complexity,
    },
    updatedAt: now,
  });
}

export function applyRequirementToProfile(
  profile: DecisionProfile,
  requirementSlug: string,
  priority: RequirementPriority,
): DecisionProfile {
  const meta =
    profile.categorySlug === "sales-intelligence"
      ? resolveSiRequirementMeta(requirementSlug)
      : resolveRequirementMeta(requirementSlug);
  const requirements = profile.requirements.filter(
    (r) => r.id !== requirementSlug,
  );
  requirements.push({
    id: requirementSlug,
    priority,
    source: "user-selected",
  });

  const capabilities = [...profile.capabilities];
  if (
    meta?.capabilitySlug &&
    !capabilities.some((c) => c.id === meta.capabilitySlug)
  ) {
    capabilities.push({
      id: meta.capabilitySlug,
      priority: "important",
      source: "inferred-from-capability",
    });
  }

  const next = touchDecisionProfile(profile, {
    requirements,
    capabilities,
  });
  saveDecisionProfile(next);
  return next;
}

export function applyFeatureToProfile(
  profile: DecisionProfile,
  featureSlug: string,
  priority: FeaturePriority,
): DecisionProfile {
  const features = profile.features.filter((f) => f.id !== featureSlug);
  features.push({
    id: featureSlug,
    priority,
    source: "user-selected",
  });
  const next = touchDecisionProfile(profile, { features });
  saveDecisionProfile(next);
  return next;
}

/** Prefill from industry / use-case page query params. */
export function seedProfileFromQuery(
  profile: DecisionProfile,
  params: {
    industry?: string | null;
    useCase?: string | null;
    requirement?: string | null;
    feature?: string | null;
  },
): DecisionProfile {
  let next = profile;
  if (params.industry) {
    next = touchDecisionProfile(next, {
      businessContext: {
        ...next.businessContext,
        industrySlug: params.industry,
      },
    });
  }
  if (params.useCase) {
    const useCases = next.useCases.filter((u) => u.id !== params.useCase);
    useCases.unshift({ id: params.useCase, priority: "primary" });
    next = touchDecisionProfile(next, { useCases });
  }
  if (params.requirement) {
    next = applyRequirementToProfile(next, params.requirement, "must-have");
  }
  if (params.feature) {
    next = applyFeatureToProfile(next, params.feature, "must-have");
  }
  return next;
}
