/**
 * Apply SI DecisionProfile → RFP draft using SI scope catalog + si-graph labels.
 */

import { getSiRequirementDefinition } from "@/data/si-graph";
import type {
  DecisionProfile,
  RequirementPriority,
  RfpRequirement,
  RfpRequirementPriority,
  RfpIntegration,
  CrmRfpDraft,
} from "@/domain";
import { newRfpId } from "./constants";
import { SI_RFP_SCOPE_CATALOG } from "./si-constants";

const PROFILE_TO_MOSCOW: Record<
  RequirementPriority,
  RfpRequirementPriority | null
> = {
  "must-have": "must-have",
  important: "should-have",
  "nice-to-have": "could-have",
  "not-needed": "out-of-scope",
};

function moscowPriority(
  priority: RequirementPriority,
): RfpRequirementPriority | null {
  return PROFILE_TO_MOSCOW[priority] ?? null;
}

function requirementTextForSlug(slug: string): {
  requirement: string;
  category: string;
} {
  const def = getSiRequirementDefinition(slug);
  if (def) {
    return {
      requirement: def.buyerNeedDescription || def.shortAnswer || def.name,
      category: def.primaryCapabilityName || "Sales Intelligence",
    };
  }
  return {
    requirement: slug.replace(/-/g, " "),
    category: "Sales Intelligence",
  };
}

export function siRequirementsFromProfile(
  profile: DecisionProfile,
): RfpRequirement[] {
  const rows: RfpRequirement[] = [];
  let index = 0;
  for (const req of profile.requirements) {
    const priority = moscowPriority(req.priority);
    if (!priority || priority === "out-of-scope") continue;
    const text = requirementTextForSlug(req.id);
    rows.push({
      id: `SI-REQ-${String(index + 1).padStart(3, "0")}`,
      category: text.category,
      requirement: text.requirement,
      priority,
      rationale: "",
      acceptanceCriterion: "",
      evidenceRequested: "",
      mandatory: priority === "must-have",
      owner: "",
      sourceSlug: req.id,
      source: "profile",
      sortOrder: index,
    });
    index += 1;
  }
  return rows;
}

export function siIntegrationsFromProfile(
  profile: DecisionProfile,
): RfpIntegration[] {
  return profile.integrations
    .filter((i) => i.id !== "none")
    .map((i) => ({
      id: newRfpId("INT"),
      system: i.id.replace(/-/g, " "),
      category: i.id.toLowerCase().includes("crm") ? "CRM" : "Other",
      direction: "unknown" as const,
      data: "",
      frequency: "",
      criticality:
        i.priority === "required"
          ? ("critical" as const)
          : i.priority === "preferred"
            ? ("high" as const)
            : ("medium" as const),
      preferredMethod: "",
      owner: "",
      notes: "",
      sourceId: i.id,
    }));
}

export function applySiProfileToDraft(
  draft: CrmRfpDraft,
  profile: DecisionProfile,
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
    next.requirements = siRequirementsFromProfile(profile);
  }
  if (replaceIntegrations) {
    const imported = siIntegrationsFromProfile(profile);
    next.integrations = imported.length > 0 ? imported : draft.integrations;
  }

  if (next.scope.length === 0) {
    if (profile.capabilities.length > 0) {
      const selected = new Set(profile.capabilities.map((c) => c.id));
      next.scope = SI_RFP_SCOPE_CATALOG.filter(
        (item) => item.capabilitySlug && selected.has(item.capabilitySlug),
      ).map((item) => ({
        id: item.id,
        label: item.label,
        capabilitySlug: item.capabilitySlug,
        phase: "phase-1" as const,
      }));
    }
    if (next.scope.length === 0) {
      next.scope = SI_RFP_SCOPE_CATALOG.filter(
        (i) =>
          i.id !== "other" &&
          i.id !== "intent-signals" &&
          i.id !== "outreach-engagement",
      ).map((item) => ({
        id: item.id,
        label: item.label,
        capabilitySlug: item.capabilitySlug,
        phase: "phase-1" as const,
      }));
    }
  }

  return next;
}
