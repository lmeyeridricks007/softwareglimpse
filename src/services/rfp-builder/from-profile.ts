import {
  RFP_PILLAR_REQUIREMENTS,
  RFP_SAMPLE_EXTRA_REQUIREMENTS,
} from "@/data/resource-hub/crm-rfp-requirements";
import { getCrmRequirementDefinition } from "@/data/crm-graph/requirements";
import type {
  CrmDecisionProfile,
  RequirementPriority,
  RfpRequirement,
  RfpRequirementPriority,
  RfpIntegration,
  CrmRfpDraft,
} from "@/domain";
import { RFP_SCOPE_CATALOG, newRfpId } from "./constants";

const PROFILE_TO_MOSCOW: Record<
  RequirementPriority,
  RfpRequirementPriority | null
> = {
  "must-have": "must-have",
  important: "should-have",
  "nice-to-have": "could-have",
  "not-needed": "out-of-scope",
};

const SLUG_TO_RFP_ID = new Map(
  RFP_PILLAR_REQUIREMENTS.filter((r) => r.slug).map((r) => [
    r.slug as string,
    r,
  ]),
);

const INTEGRATION_LABELS: Record<string, { system: string; category: string }> =
  {
    gmail: { system: "Gmail", category: "Email/calendar" },
    "google-workspace": {
      system: "Google Workspace",
      category: "Email/calendar",
    },
    "microsoft-365": { system: "Microsoft 365", category: "Email/calendar" },
    outlook: { system: "Outlook", category: "Email/calendar" },
    slack: { system: "Slack", category: "Other" },
    teams: { system: "Microsoft Teams", category: "Other" },
    zapier: { system: "Zapier", category: "Other" },
    quickbooks: { system: "QuickBooks", category: "Finance" },
    xero: { system: "Xero", category: "Finance" },
    mailchimp: { system: "Mailchimp", category: "Marketing automation" },
  };

function moscowPriority(
  priority: RequirementPriority,
): RfpRequirementPriority | null {
  return PROFILE_TO_MOSCOW[priority];
}

function rfpIdForSlug(slug: string, index: number): string {
  const pillar = SLUG_TO_RFP_ID.get(slug);
  if (pillar) return pillar.id;
  return `REQ-${String(index + 1).padStart(3, "0")}`;
}

function requirementTextForSlug(slug: string): {
  requirement: string;
  category: string;
} {
  const pillar = SLUG_TO_RFP_ID.get(slug);
  if (pillar) {
    return { requirement: pillar.requirement, category: pillar.category };
  }
  const def = getCrmRequirementDefinition(slug);
  if (def) {
    return {
      requirement: def.buyerNeedDescription || def.shortAnswer || def.name,
      category: def.primaryCapabilityName || "Core CRM",
    };
  }
  return {
    requirement: slug.replace(/-/g, " "),
    category: "Core CRM",
  };
}

/** Map decision-profile priorities into MoSCoW RFP rows. Skips not-needed. */
export function requirementsFromProfile(
  profile: CrmDecisionProfile,
): RfpRequirement[] {
  const rows: RfpRequirement[] = [];
  let index = 0;
  for (const req of profile.requirements) {
    const priority = moscowPriority(req.priority);
    if (!priority || priority === "out-of-scope") continue;
    const text = requirementTextForSlug(req.id);
    rows.push({
      id: rfpIdForSlug(req.id, index),
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

export function integrationsFromProfile(
  profile: CrmDecisionProfile,
): RfpIntegration[] {
  return profile.integrations
    .filter((i) => i.id !== "none")
    .map((i) => {
      const meta = INTEGRATION_LABELS[i.id] ?? {
        system: i.id.replace(/-/g, " "),
        category: "Other",
      };
      return {
        id: newRfpId("INT"),
        system: meta.system,
        category: meta.category,
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
      };
    });
}

export function applyProfileToDraft(
  draft: CrmRfpDraft,
  profile: CrmDecisionProfile,
  options: { replaceRequirements?: boolean; replaceIntegrations?: boolean } = {},
): CrmRfpDraft {
  const {
    replaceRequirements = true,
    replaceIntegrations = true,
  } = options;

  const users = profile.businessContext.crmUserCount;
  const next: CrmRfpDraft = {
    ...draft,
    project: {
      ...draft.project,
      currency: profile.budget.currency ?? draft.project.currency,
      currentCrm:
        draft.project.currentCrm ||
        (profile.businessContext.currentState === "existing-crm"
          ? "Existing CRM"
          : profile.businessContext.currentState === "spreadsheet"
            ? "Spreadsheets"
            : profile.businessContext.currentState === "multiple-tools"
              ? "Multiple tools"
              : draft.project.currentCrm),
    },
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
    next.requirements = requirementsFromProfile(profile);
  }
  if (replaceIntegrations) {
    const imported = integrationsFromProfile(profile);
    next.integrations =
      imported.length > 0 ? imported : draft.integrations;
  }

  // Seed scope from selected capabilities when empty.
  if (next.scope.length === 0 && profile.capabilities.length > 0) {
    const selected = new Set(profile.capabilities.map((c) => c.id));
    next.scope = RFP_SCOPE_CATALOG.filter(
      (item) => item.capabilitySlug && selected.has(item.capabilitySlug),
    ).map((item) => ({
      id: item.id,
      label: item.label,
      capabilitySlug: item.capabilitySlug,
      phase: "phase-1" as const,
    }));
  }

  return next;
}

/** Library rows from static RFP sample + pillar — labelled as library/template. */
export function requirementsFromLibrary(): RfpRequirement[] {
  const all = [...RFP_PILLAR_REQUIREMENTS, ...RFP_SAMPLE_EXTRA_REQUIREMENTS];
  return all.map((row, index) => ({
    id: row.id,
    category: row.category,
    requirement: row.requirement,
    priority:
      row.priority === "MUST HAVE"
        ? ("must-have" as const)
        : row.priority === "SHOULD HAVE"
          ? ("should-have" as const)
          : ("could-have" as const),
    rationale: "",
    acceptanceCriterion: "",
    evidenceRequested: "",
    mandatory: row.priority === "MUST HAVE",
    owner: "",
    sourceSlug: row.slug,
    source: "library" as const,
    sortOrder: index,
  }));
}
