/**
 * Derive capabilities / requirements / features from the lean SI graph.
 * Parallel to CRM derive — keeps CRM client bundles free of SI graph weight
 * when CRM tools import CRM-only paths.
 */

import {
  SI_CAPABILITIES,
  getSiCapabilityDefinition,
  type SiCapabilityDefinition,
} from "@/data/si-graph/capabilities";
import {
  SI_FEATURES,
  getSiFeatureDefinition,
} from "@/data/si-graph/features";
import {
  SI_REQUIREMENTS,
  getSiRequirementDefinition,
} from "@/data/si-graph/requirements";
import {
  SI_USE_CASES,
  getSiUseCaseDefinition,
} from "@/data/si-graph/use-cases";
import type {
  CapabilitySelectionPriority,
  FeaturePriority,
  ProfileCapability,
  ProfileFeature,
  ProfileRequirement,
  RequirementPriority,
  SiDecisionProfile,
} from "@/domain";
import type {
  RequirementMeta,
  SelectableCapability,
  SelectableUseCase,
} from "./derive";

const CAPABILITY_PRIORITY_RANK: Record<CapabilitySelectionPriority, number> = {
  critical: 4,
  high: 3,
  important: 2,
  optional: 1,
};

const DEFAULT_REQ_PRIORITY: Record<string, RequirementPriority> = {
  core: "must-have",
  advanced: "important",
  optional: "nice-to-have",
  "must-have": "must-have",
  important: "important",
};

const SI_CATALOGUE_FEATURE_SLUGS = new Set(SI_FEATURES.map((f) => f.slug));

export function listSelectableSiUseCases(): SelectableUseCase[] {
  return SI_USE_CASES.map((uc) => ({
    slug: uc.slug,
    name: uc.displayName,
    tagline: uc.tagline,
    teamTypes: uc.glance.teamTypes,
    finderUseCaseSlug: uc.finderUseCaseSlug,
  }));
}

export function listSelectableSiCapabilities(): SelectableCapability[] {
  return SI_CAPABILITIES.map((cap) => ({
    slug: cap.slug,
    name: cap.name,
    icon: cap.icon,
    importanceLabel: cap.glance.importanceLabel,
    coreObjective: cap.glance.coreObjective,
  }));
}

export function listOptionalSiDirectFeatures(): Array<{
  slug: string;
  name: string;
}> {
  const preferred = [
    "contact-data",
    "prospecting",
    "data-enrichment",
    "list-building",
    "crm-sync",
    "email-outreach",
    "email-sequences",
    "data-export",
    "lead-scoring",
    "ai-assistance",
    "reporting",
    "integrations",
  ];
  return preferred.map((slug) => {
    const def = getSiFeatureDefinition(slug);
    return def ? { slug: def.slug, name: def.name } : { slug, name: slug };
  });
}

export function mapSiUseCaseToFinderSlug(
  useCaseSlug: string,
): string | undefined {
  return getSiUseCaseDefinition(useCaseSlug)?.finderUseCaseSlug;
}

export function primarySiFinderUseCaseFromProfile(
  profile: SiDecisionProfile,
): { primary?: string; secondary: string[] } {
  const ranked = [...profile.useCases].sort((a, b) => {
    const order = { primary: 0, important: 1, relevant: 2 } as const;
    return order[a.priority] - order[b.priority];
  });
  const finderSlugs = ranked
    .map((u) => mapSiUseCaseToFinderSlug(u.id))
    .filter((s): s is string => Boolean(s));
  const unique = [...new Set(finderSlugs)];
  return {
    primary: unique[0],
    secondary: unique.slice(1),
  };
}

export function deriveSiCapabilitiesFromUseCases(
  useCaseSlugs: string[],
  existing: ProfileCapability[] = [],
): {
  recommended: ProfileCapability[];
  other: SelectableCapability[];
} {
  const bySlug = new Map<string, ProfileCapability>();

  for (const item of existing) {
    bySlug.set(item.id, item);
  }

  for (const slug of useCaseSlugs) {
    const def = getSiUseCaseDefinition(slug);
    if (!def) continue;
    for (const cap of def.capabilities) {
      const nextPriority = cap.importance as CapabilitySelectionPriority;
      const prev = bySlug.get(cap.capabilitySlug);
      if (!prev) {
        bySlug.set(cap.capabilitySlug, {
          id: cap.capabilitySlug,
          priority: nextPriority,
          source: "inferred-from-use-case",
        });
        continue;
      }
      if (
        prev.source === "user-selected" ||
        CAPABILITY_PRIORITY_RANK[prev.priority] >=
          CAPABILITY_PRIORITY_RANK[nextPriority]
      ) {
        continue;
      }
      bySlug.set(cap.capabilitySlug, {
        id: cap.capabilitySlug,
        priority: nextPriority,
        source: "inferred-from-use-case",
      });
    }
  }

  const recommended = [...bySlug.values()];
  const recommendedIds = new Set(recommended.map((c) => c.id));
  const other = listSelectableSiCapabilities().filter(
    (c) => !recommendedIds.has(c.slug),
  );

  return { recommended, other };
}

export function resolveSiRequirementMeta(
  requirementSlug: string,
): RequirementMeta | null {
  const def = getSiRequirementDefinition(requirementSlug);
  if (!def) return null;

  return {
    slug: def.slug,
    name: def.name,
    shortExplanation:
      def.buyerNeedDescription || def.shortAnswer || def.tagline || def.name,
    capabilitySlug: def.primaryCapabilitySlug,
    capabilityName: def.primaryCapabilityName,
    featureCount: def.featureLinks.length,
    whyItMatters: def.whyItMatters[0]?.description,
    href: null,
    featureLinks: def.featureLinks.map((link) => ({
      featureSlug: link.featureSlug,
      name: link.name,
      relationship: link.relationship,
    })),
  };
}

export function deriveSiRequirementsFromCapabilities(
  capabilitySlugs: string[],
  useCaseSlugs: string[] = [],
  existing: ProfileRequirement[] = [],
): ProfileRequirement[] {
  const bySlug = new Map<string, ProfileRequirement>();

  for (const item of existing) {
    bySlug.set(item.id, item);
  }

  const consider = (
    requirementSlug: string | undefined,
    graphPriority: string,
    source: ProfileRequirement["source"],
  ) => {
    if (!requirementSlug) return;
    if (!resolveSiRequirementMeta(requirementSlug)) return;
    const priority =
      DEFAULT_REQ_PRIORITY[graphPriority] ?? ("important" as RequirementPriority);
    const prev = bySlug.get(requirementSlug);
    if (prev?.source === "user-selected") return;
    if (prev && priorityRank(prev.priority) >= priorityRank(priority)) return;
    bySlug.set(requirementSlug, {
      id: requirementSlug,
      priority,
      source,
    });
  };

  for (const capSlug of capabilitySlugs) {
    const cap = getSiCapabilityDefinition(capSlug);
    if (!cap) continue;
    for (const req of cap.requirements) {
      consider(req.requirementSlug, req.priority, "inferred-from-capability");
    }
  }

  for (const ucSlug of useCaseSlugs) {
    const uc = getSiUseCaseDefinition(ucSlug);
    if (!uc) continue;
    for (const req of uc.requirements) {
      consider(req.requirementSlug, req.priority, "inferred-from-use-case");
    }
  }

  return [...bySlug.values()];
}

function priorityRank(p: RequirementPriority): number {
  switch (p) {
    case "must-have":
      return 4;
    case "important":
      return 3;
    case "nice-to-have":
      return 2;
    case "not-needed":
      return 1;
    default:
      return 0;
  }
}

export function deriveSiFeaturesFromRequirements(
  requirements: ProfileRequirement[],
  existing: ProfileFeature[] = [],
): ProfileFeature[] {
  const bySlug = new Map<string, ProfileFeature>();

  for (const item of existing) {
    bySlug.set(item.id, item);
  }

  for (const req of requirements) {
    if (req.priority === "not-needed") continue;
    const meta = resolveSiRequirementMeta(req.id);
    if (!meta) continue;

    for (const link of meta.featureLinks) {
      const featurePriority = featurePriorityFromLink(
        link.relationship,
        req.priority,
      );
      if (!featurePriority) continue;

      const known =
        getSiFeatureDefinition(link.featureSlug) != null ||
        SI_CATALOGUE_FEATURE_SLUGS.has(link.featureSlug);
      if (!known) continue;

      const prev = bySlug.get(link.featureSlug);
      if (prev?.source === "user-selected") continue;
      if (
        prev &&
        featurePriorityRank(prev.priority) >= featurePriorityRank(featurePriority)
      ) {
        continue;
      }
      bySlug.set(link.featureSlug, {
        id: link.featureSlug,
        priority: featurePriority,
        source: "inferred-from-requirement",
      });
    }
  }

  return [...bySlug.values()];
}

function featurePriorityFromLink(
  relationship: RequirementMeta["featureLinks"][number]["relationship"],
  reqPriority: RequirementPriority,
): FeaturePriority | null {
  if (reqPriority === "not-needed") return null;
  if (relationship === "required") {
    return reqPriority === "nice-to-have" ? "nice-to-have" : "must-have";
  }
  if (relationship === "strongly-supporting") {
    return reqPriority === "must-have" ? "important" : "nice-to-have";
  }
  if (relationship === "supporting") {
    return "nice-to-have";
  }
  return null;
}

function featurePriorityRank(p: FeaturePriority): number {
  switch (p) {
    case "must-have":
      return 3;
    case "important":
      return 2;
    case "nice-to-have":
      return 1;
    default:
      return 0;
  }
}

export function getSiCapabilityDefinitionForBuilder(
  slug: string,
): SiCapabilityDefinition | undefined {
  return getSiCapabilityDefinition(slug) ?? undefined;
}

export function listKnownSiRequirementSlugs(): string[] {
  return SI_REQUIREMENTS.map((r) => r.slug);
}
