import type {
  DecisionProfile,
  RequirementPriority,
  RfpIntegration,
  RfpRequirement,
  RfpRequirementPriority,
  CrmRfpDraft,
} from "@/domain";
import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import type { RfpContentPack } from "./pack-context";
import { newRfpId } from "./constants";

const PROFILE_TO_MOSCOW: Record<
  RequirementPriority,
  RfpRequirementPriority | null
> = {
  "must-have": "must-have",
  important: "should-have",
  "nice-to-have": "could-have",
  "not-needed": "out-of-scope",
};

function humanize(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function labelFor(
  slug: string,
  kit: CategoryFinderClientKit,
): string {
  return (
    kit.capabilityOptions.find((option) => option.value === slug)?.label ??
    kit.useCaseOptions.find((option) => option.value === slug)?.label ??
    humanize(slug)
  );
}

export function categoryRequirementsFromProfile(
  profile: DecisionProfile,
  kit: CategoryFinderClientKit,
): RfpRequirement[] {
  const rows: RfpRequirement[] = [];
  let index = 0;

  const featureRows = profile.features.map((feature) => ({
    id: feature.id,
    priority: feature.priority as RequirementPriority,
  }));
  const requirementRows =
    featureRows.length > 0
      ? featureRows
      : profile.requirements.map((req) => ({
          id: req.id,
          priority: req.priority,
        }));

  for (const row of requirementRows) {
    const priority = PROFILE_TO_MOSCOW[row.priority];
    if (!priority || priority === "out-of-scope") continue;
    rows.push({
      id: `REQ-${String(index + 1).padStart(3, "0")}`,
      category: kit.shortName,
      requirement: labelFor(row.id, kit),
      priority,
      rationale: "",
      acceptanceCriterion: "",
      evidenceRequested: "",
      mandatory: priority === "must-have",
      owner: "",
      sourceSlug: row.id,
      source: "profile",
      sortOrder: index,
    });
    index += 1;
  }
  return rows;
}

export function categoryIntegrationsFromProfile(
  profile: DecisionProfile,
  kit: CategoryFinderClientKit,
): RfpIntegration[] {
  return profile.integrations
    .filter((item) => item.id !== "none")
    .map((item) => ({
      id: newRfpId("INT"),
      system:
        kit.integrationOptions.find((option) => option.value === item.id)
          ?.label ?? humanize(item.id),
      category: "Other",
      direction: "unknown" as const,
      data: "",
      frequency: "",
      criticality:
        item.priority === "required"
          ? ("critical" as const)
          : item.priority === "preferred"
            ? ("high" as const)
            : ("medium" as const),
      preferredMethod: "",
      owner: "",
      notes: "",
      sourceId: item.id,
    }));
}

export function applyCategoryProfileToDraft(
  draft: CrmRfpDraft,
  profile: DecisionProfile,
  kit: CategoryFinderClientKit,
  pack: RfpContentPack,
  options: {
    replaceRequirements?: boolean;
    replaceIntegrations?: boolean;
  } = {},
): CrmRfpDraft {
  const replaceRequirements = options.replaceRequirements ?? true;
  const replaceIntegrations = options.replaceIntegrations ?? true;
  const users = profile.businessContext.crmUserCount;

  const next: CrmRfpDraft = {
    ...draft,
    users: {
      ...draft.users,
      currentUsers: draft.users.currentUsers ?? users,
    },
    pricingAssumptions: {
      ...draft.pricingAssumptions,
      usersYear1: draft.pricingAssumptions.usersYear1 ?? users,
      currency: profile.budget.currency ?? draft.pricingAssumptions.currency,
    },
  };

  if (replaceRequirements) {
    next.requirements = categoryRequirementsFromProfile(profile, kit);
  }
  if (replaceIntegrations) {
    const imported = categoryIntegrationsFromProfile(profile, kit);
    next.integrations = imported.length > 0 ? imported : draft.integrations;
  }

  if (next.scope.length === 0) {
    const selected = new Set([
      ...profile.features.map((feature) => feature.id),
      ...profile.capabilities.map((capability) => capability.id),
      ...profile.useCases.map((useCase) => useCase.id),
    ]);
    const matched = pack.scopeCatalog.filter(
      (item) =>
        selected.has(item.id) ||
        (item.capabilitySlug != null && selected.has(item.capabilitySlug)),
    );
    next.scope = (matched.length > 0 ? matched : pack.scopeCatalog.slice(0, 8)).map(
      (item) => ({
        id: item.id,
        label: item.label,
        capabilitySlug: item.capabilitySlug,
        phase: "phase-1" as const,
      }),
    );
  }

  return next;
}

export function requirementsFromCategoryKit(
  kit: CategoryFinderClientKit,
  pack?: RfpContentPack,
): RfpRequirement[] {
  const library =
    pack?.scopeCatalog.filter((item) => item.id !== "security-dpa" && item.id !== "trial-success-criteria") ??
    kit.capabilityOptions.map((option) => ({
      id: option.value,
      label: option.label,
      capabilitySlug: option.value,
    }));
  return library.slice(0, 14).map((item, index) => ({
    id: `REQ-${String(index + 1).padStart(3, "0")}`,
    category: kit.shortName,
    requirement: item.label,
    priority: index < 4 ? ("must-have" as const) : ("should-have" as const),
    rationale: "",
    acceptanceCriterion: "",
    evidenceRequested: "",
    mandatory: index < 4,
    owner: "",
    sourceSlug: item.capabilitySlug ?? item.id,
    source: "library",
    sortOrder: index,
  }));
}
