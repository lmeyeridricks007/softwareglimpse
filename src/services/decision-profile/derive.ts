/**
 * Derive capabilities / requirements / features from the shared CRM graph.
 * Import graph modules directly (not the crm-graph barrel) so client bundles
 * never pull synthesize → catalogue store → node:fs.
 */

import {
  CRM_CAPABILITIES,
  getCrmCapabilityDefinition,
  type CrmCapabilityDefinition,
} from "@/data/crm-graph/capabilities";
import {
  CRM_FEATURES,
  getCrmFeatureDefinition,
} from "@/data/crm-graph/features";
import {
  CRM_REQUIREMENTS,
  getCrmRequirementDefinition,
} from "@/data/crm-graph/requirements";
import {
  CRM_USE_CASES,
  getCrmUseCaseDefinition,
  type CrmUseCaseDefinition,
} from "@/data/crm-graph/use-cases";
import type {
  CapabilitySelectionPriority,
  CrmDecisionProfile,
  FeaturePriority,
  ProfileCapability,
  ProfileFeature,
  ProfileRequirement,
  RequirementPriority,
} from "@/domain";

export type SelectableUseCase = {
  slug: string;
  name: string;
  tagline: string;
  teamTypes: string[];
  finderUseCaseSlug?: string;
};

export type SelectableCapability = {
  slug: string;
  name: string;
  icon: string;
  importanceLabel: string;
  coreObjective: string;
};

export type RequirementMeta = {
  slug: string;
  name: string;
  shortExplanation: string;
  capabilitySlug: string;
  capabilityName: string;
  featureCount: number;
  whyItMatters?: string;
  href: string | null;
  featureLinks: Array<{
    featureSlug: string;
    name: string;
    relationship:
      | "required"
      | "strongly-supporting"
      | "supporting"
      | "optional";
  }>;
};

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

/**
 * Hand-authored requirement pages that are intentionally absent from
 * CRM_REQUIREMENTS — keep lightweight client-safe mirrors of their links.
 */
const EXTRA_REQUIREMENT_META: Record<string, RequirementMeta> = {
  "separate-sales-processes": {
    slug: "separate-sales-processes",
    name: "Support Separate Sales Processes",
    shortExplanation:
      "Allow teams, products or workflows to follow distinct processes without forcing everything through one shared pipeline.",
    capabilitySlug: "pipeline-management",
    capabilityName: "Pipeline Management",
    featureCount: 5,
    href: "/requirements/separate-sales-processes/",
    featureLinks: [
      {
        featureSlug: "custom-pipelines",
        name: "Multiple Pipelines",
        relationship: "required",
      },
      {
        featureSlug: "pipeline-management",
        name: "Pipeline Management",
        relationship: "required",
      },
      {
        featureSlug: "custom-fields",
        name: "Custom Fields",
        relationship: "strongly-supporting",
      },
      {
        featureSlug: "workflow-automation",
        name: "Workflow Automation",
        relationship: "supporting",
      },
      {
        featureSlug: "reporting",
        name: "Pipeline Reporting",
        relationship: "supporting",
      },
    ],
  },
  "automate-lead-follow-up": {
    slug: "automate-lead-follow-up",
    name: "Automate Lead Follow-up",
    shortExplanation:
      "Create tasks, reminders, and sequenced follow-up automatically so leads do not stall after first contact.",
    capabilitySlug: "workflow-automation",
    capabilityName: "Workflow automation",
    featureCount: 4,
    href: "/requirements/automate-lead-follow-up/",
    featureLinks: [
      {
        featureSlug: "workflow-automation",
        name: "Workflow Automation",
        relationship: "required",
      },
      {
        featureSlug: "email-sequences",
        name: "Email Sequences",
        relationship: "strongly-supporting",
      },
      {
        featureSlug: "lead-management",
        name: "Lead Management",
        relationship: "supporting",
      },
      {
        featureSlug: "task-management",
        name: "Task Management",
        relationship: "supporting",
      },
    ],
  },
};

export function listSelectableCrmUseCases(): SelectableUseCase[] {
  return CRM_USE_CASES.map((uc) => ({
    slug: uc.slug,
    name: displayUseCaseName(uc),
    tagline: uc.tagline.replaceAll("{industry}", "your"),
    teamTypes: uc.glance.teamTypes,
    finderUseCaseSlug: uc.finderUseCaseSlug,
  }));
}

function displayUseCaseName(uc: CrmUseCaseDefinition): string {
  const map: Record<string, string> = {
    "relationship-management": "Relationship Management",
    "pipeline-led-sales": "Pipeline Management",
    "high-volume-lead-management": "Lead Management",
    "complex-sales-processes": "Complex Sales Processes",
    "growing-teams": "Growing Teams",
  };
  return map[uc.slug] ?? uc.displayName;
}

export function listSelectableCrmCapabilities(): SelectableCapability[] {
  return CRM_CAPABILITIES.map((cap) => ({
    slug: cap.slug,
    name: cap.name,
    icon: cap.icon,
    importanceLabel: cap.glance.importanceLabel,
    coreObjective: cap.glance.coreObjective,
  }));
}

/** Optional direct feature picks — catalogue/finder-aligned only. */
export function listOptionalDirectFeatures(): Array<{
  slug: string;
  name: string;
}> {
  const preferred: Array<{ slug: string; name: string }> = [
    { slug: "lead-scoring", name: "Lead scoring" },
    { slug: "email-sync", name: "Email sync" },
    { slug: "email-sequences", name: "Email sequences" },
    { slug: "call-functionality", name: "Calling" },
    { slug: "custom-fields", name: "Custom fields" },
    { slug: "forecasting", name: "Forecasting" },
    { slug: "mobile-app", name: "Mobile app" },
    { slug: "ai-assistance", name: "AI assistance" },
    { slug: "workflow-automation", name: "Workflow automation" },
    { slug: "reporting", name: "Reporting" },
    { slug: "custom-pipelines", name: "Multiple pipelines" },
  ];
  return preferred.map((item) => {
    const def = getCrmFeatureDefinition(item.slug);
    return def ? { slug: def.slug, name: def.name } : item;
  });
}

export function mapUseCaseToFinderSlug(useCaseSlug: string): string | undefined {
  return getCrmUseCaseDefinition(useCaseSlug)?.finderUseCaseSlug;
}

export function primaryFinderUseCaseFromProfile(
  profile: CrmDecisionProfile,
): { primary?: string; secondary: string[] } {
  const ranked = [...profile.useCases].sort((a, b) => {
    const order = { primary: 0, important: 1, relevant: 2 } as const;
    return order[a.priority] - order[b.priority];
  });
  const finderSlugs = ranked
    .map((u) => mapUseCaseToFinderSlug(u.id))
    .filter((s): s is string => Boolean(s));
  const unique = [...new Set(finderSlugs)];
  return {
    primary: unique[0],
    secondary: unique.slice(1),
  };
}

export function deriveCapabilitiesFromUseCases(
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
    const def = getCrmUseCaseDefinition(slug);
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
  const other = listSelectableCrmCapabilities().filter(
    (c) => !recommendedIds.has(c.slug),
  );

  return { recommended, other };
}

export function resolveRequirementMeta(
  requirementSlug: string,
): RequirementMeta | null {
  const extra = EXTRA_REQUIREMENT_META[requirementSlug];
  if (extra) return extra;

  const def = getCrmRequirementDefinition(requirementSlug);
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
    href: `/requirements/${def.slug}/`,
    featureLinks: def.featureLinks.map((link) => ({
      featureSlug: link.featureSlug,
      name: link.name,
      relationship: link.relationship,
    })),
  };
}

export function deriveRequirementsFromCapabilities(
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
    if (!resolveRequirementMeta(requirementSlug)) return;
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
    const cap = getCrmCapabilityDefinition(capSlug);
    if (!cap) continue;
    for (const req of cap.requirements) {
      consider(req.requirementSlug, req.priority, "inferred-from-capability");
    }
  }

  for (const ucSlug of useCaseSlugs) {
    const uc = getCrmUseCaseDefinition(ucSlug);
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

export function deriveFeaturesFromRequirements(
  requirements: ProfileRequirement[],
  existing: ProfileFeature[] = [],
): ProfileFeature[] {
  const bySlug = new Map<string, ProfileFeature>();

  for (const item of existing) {
    bySlug.set(item.id, item);
  }

  for (const req of requirements) {
    if (req.priority === "not-needed") continue;
    const meta = resolveRequirementMeta(req.id);
    if (!meta) continue;

    for (const link of meta.featureLinks) {
      const featurePriority = featurePriorityFromLink(
        link.relationship,
        req.priority,
      );
      if (!featurePriority) continue;

      const known =
        getCrmFeatureDefinition(link.featureSlug) != null ||
        CRM_FEATURES.some((f) => f.slug === link.featureSlug) ||
        isCatalogueFeatureSlug(link.featureSlug);
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

const CATALOGUE_FEATURE_SLUGS = new Set([
  "contact-management",
  "lead-management",
  "pipeline-management",
  "deal-management",
  "email-sync",
  "email-sequences",
  "workflow-automation",
  "lead-scoring",
  "reporting",
  "forecasting",
  "custom-fields",
  "custom-pipelines",
  "mobile-app",
  "ai-assistance",
  "call-functionality",
  "meeting-scheduling",
  "role-permissions",
  "sso",
  "audit-logs",
  "integrations",
  "email-tracking",
  "analytics",
  "sales-automation",
  "task-management",
]);

function isCatalogueFeatureSlug(slug: string): boolean {
  return CATALOGUE_FEATURE_SLUGS.has(slug);
}

export function getCapabilityDefinition(
  slug: string,
): CrmCapabilityDefinition | undefined {
  return getCrmCapabilityDefinition(slug) ?? undefined;
}

/** Known requirement slugs available to the builder (graph + extras). */
export function listKnownRequirementSlugs(): string[] {
  return [
    ...Object.keys(EXTRA_REQUIREMENT_META),
    ...CRM_REQUIREMENTS.map((r) => r.slug),
  ];
}
