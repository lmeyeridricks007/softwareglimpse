import type {
  CrmDecisionProfile,
  CrmImplementationPlan,
  PlanRisk,
  ReadinessGap,
  ProjectRoleAssignment,
  ProjectRoleId,
} from "@/domain";

const DEFAULT_ROLES: Array<{
  roleId: ProjectRoleId;
  responsibility: string;
}> = [
  {
    roleId: "executive-sponsor",
    responsibility: "Approves scope, budget and go-live decision",
  },
  {
    roleId: "project-manager",
    responsibility: "Owns timeline, dependencies and status",
  },
  {
    roleId: "crm-owner",
    responsibility: "Owns configuration and day-to-day CRM administration",
  },
  {
    roleId: "sales-operations",
    responsibility: "Owns process design, stages and ownership rules",
  },
  {
    roleId: "it-integrations",
    responsibility: "Owns integrations, SSO and technical connectivity",
  },
  {
    roleId: "data-owner",
    responsibility: "Owns source data quality and migration reconciliation",
  },
  {
    roleId: "security",
    responsibility: "Owns roles, permissions and access review",
  },
  {
    roleId: "business-representative",
    responsibility: "Represents end users in UAT and process validation",
  },
  {
    roleId: "trainer-change",
    responsibility: "Owns training, communications and adoption",
  },
  {
    roleId: "vendor-partner",
    responsibility: "Optional vendor or partner implementation support",
  },
];

export function defaultProjectRoles(
  existing?: ProjectRoleAssignment[],
): ProjectRoleAssignment[] {
  const byId = new Map(existing?.map((r) => [r.roleId, r]));
  return DEFAULT_ROLES.map((r) => ({
    roleId: r.roleId,
    responsibility: byId.get(r.roleId)?.responsibility ?? r.responsibility,
    label: byId.get(r.roleId)?.label,
    assigned: byId.get(r.roleId)?.assigned ?? false,
  }));
}

export function humanizeSlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function phaseIncluded(
  plan: CrmImplementationPlan,
  id: CrmImplementationPlan["phases"][number]["id"],
): boolean {
  return plan.phases.some((p) => p.id === id && p.included);
}

/**
 * Surface risks that are traceable to profile / plan state.
 * Prefer plan-derived signals (migration phase, integrations, roles) so
 * realistic scopes are never an empty risk register.
 */
export function generateRisks(
  plan: CrmImplementationPlan,
  profile: CrmDecisionProfile | null,
  options?: {
    unresolvedMustHaveIds?: string[];
  },
): PlanRisk[] {
  const risks: PlanRisk[] = [];
  const mustHaves =
    profile?.requirements.filter((r) => r.priority === "must-have") ?? [];
  const unresolved = options?.unresolvedMustHaveIds ?? [];
  const users = plan.scope.users ?? profile?.businessContext.crmUserCount ?? 0;
  const teamCount =
    plan.scope.teamCount ??
    Math.max(1, plan.scope.teamLabels.length || profile?.businessContext.teamIds.length || 1);
  const migComplexity = profile?.implementation.migrationComplexity;
  const hasMigrationPhase = phaseIncluded(plan, "data-migration");
  const migrationSource = plan.scope.migrationSource;

  for (const id of unresolved) {
    risks.push({
      id: `risk-req-${id}`,
      title: `Unresolved must-have: ${humanizeSlug(id)}`,
      severity: "high",
      reason: `Requirement "${humanizeSlug(id)}" remains unverified against the selected CRM.`,
      recommendedAction:
        "Return to Vendor Scorecard or request vendor evidence before treating this as ready.",
      ownerRole: "project-manager",
      status: "open",
      sourceRefs: [`requirement:${id}`],
    });
  }

  // --- Migration (plan phase OR source OR profile complexity) ---
  if (migComplexity === "high" || migrationSource === "multiple-systems") {
    risks.push({
      id: "risk-migration-high",
      title: "High data migration complexity",
      severity: "high",
      reason:
        migComplexity === "high"
          ? "Migration complexity is marked high on the CRM profile."
          : "Multiple source systems increase mapping, cleanup and cutover risk.",
      recommendedAction:
        "Allocate cleanup time, run multiple test imports, and plan a cutover window in the Migration Planner.",
      ownerRole: "data-owner",
      status: "open",
      sourceRefs: ["migration:high"],
    });
  } else if (
    hasMigrationPhase ||
    migrationSource === "spreadsheet" ||
    migrationSource === "existing-crm" ||
    migComplexity === "medium" ||
    migComplexity === "low"
  ) {
    const fromSpreadsheet = migrationSource === "spreadsheet";
    risks.push({
      id: "risk-migration-data-quality",
      title: fromSpreadsheet
        ? "Spreadsheet data quality may block a clean import"
        : "Data quality during migration",
      severity:
        migComplexity === "medium" || migrationSource === "existing-crm"
          ? "medium"
          : "medium",
      reason: fromSpreadsheet
        ? "Spreadsheet sources commonly contain duplicates, inconsistent fields and missing owners."
        : migComplexity === "medium"
          ? "Medium migration complexity often surfaces duplicates and inconsistent fields."
          : "A migration phase is in scope — cleanup and reconciliation still need explicit ownership.",
      recommendedAction:
        "Inventory source columns, clean duplicates before test import, and reconcile counts after final load.",
      ownerRole: "data-owner",
      status: "open",
      sourceRefs: [
        `migration:${migrationSource || migComplexity || "in-scope"}`,
      ],
    });
  }

  // --- Integrations: required + preferred ---
  const integrations =
    profile?.integrations.filter(
      (i) => i.priority === "required" || i.priority === "preferred",
    ) ?? [];
  for (const integ of integrations) {
    const required = integ.priority === "required";
    risks.push({
      id: `risk-int-${integ.id}`,
      title: required
        ? `Required integration unverified: ${humanizeSlug(integ.id)}`
        : `Preferred integration needs confirmation: ${humanizeSlug(integ.id)}`,
      severity: required ? "high" : "medium",
      reason: required
        ? `Required integration "${humanizeSlug(integ.id)}" is not yet verified for implementation.`
        : `Preferred integration "${humanizeSlug(integ.id)}" is in scope but support/method is not confirmed.`,
      recommendedAction:
        "Confirm native/API/plan support, authentication path and an implementation owner before build.",
      ownerRole: "it-integrations",
      status: "open",
      sourceRefs: [`integration:${integ.id}`],
    });
  }

  // Fallback when tasks reference integrations but profile list is empty
  if (integrations.length === 0) {
    const fromTasks = new Set(
      plan.tasks.flatMap((t) => t.integrationIds),
    );
    if (fromTasks.size > 0 || phaseIncluded(plan, "integrations")) {
      risks.push({
        id: "risk-integrations-unscoped",
        title: "Integration work is in the plan but not fully scoped",
        severity: "medium",
        reason:
          "An integrations phase or integration tasks exist without a clear verified support list.",
        recommendedAction:
          "List each connection, priority and owner — or remove the integrations phase if none are needed.",
        ownerRole: "it-integrations",
        status: "open",
        sourceRefs: ["integrations:phase"],
      });
    }
  }

  // --- Timeline ---
  if (plan.targetGoLive && plan.planningDurationWeeks) {
    const target = new Date(plan.targetGoLive);
    if (!Number.isNaN(target.getTime())) {
      const now = new Date();
      const weeksAvailable = Math.floor(
        (target.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000),
      );
      if (weeksAvailable >= 0 && weeksAvailable < plan.planningDurationWeeks) {
        risks.push({
          id: "risk-timeline-buffer",
          title: "Timeline buffer is low",
          severity:
            weeksAvailable < plan.planningDurationWeeks - 2 ? "high" : "medium",
          reason: `Target go-live leaves about ${weeksAvailable} week(s); the planning model currently spans approximately ${plan.planningDurationWeeks} weeks.`,
          recommendedAction:
            "Reduce launch scope, move the target date, or accept schedule risk explicitly.",
          ownerRole: "project-manager",
          status: "open",
          sourceRefs: ["timeline:buffer"],
        });
      }
    }
  } else if ((plan.planningDurationWeeks ?? 0) >= 8 && !plan.targetGoLive) {
    risks.push({
      id: "risk-no-target-date",
      title: "No fixed go-live date for a multi-week plan",
      severity: "low",
      reason: `The planning model spans about ${plan.planningDurationWeeks} weeks without a target go-live date — scope can drift.`,
      recommendedAction:
        "Set a target date or an explicit planning window so dependencies and training can lock.",
      ownerRole: "project-manager",
      status: "open",
      sourceRefs: ["timeline:no-target"],
    });
  }

  // --- Training / change ---
  if (
    plan.scope.trainingApproach === "undecided" &&
    (users >= 5 || phaseIncluded(plan, "training-change"))
  ) {
    risks.push({
      id: "risk-training",
      title: "Training approach not decided",
      severity: users >= 25 ? "medium" : "low",
      reason:
        users > 0
          ? `About ${users} user(s) are in scope without a confirmed training approach.`
          : "Training is in the plan but the delivery approach is still undecided.",
      recommendedAction:
        "Choose self-service, internal, vendor, partner or mixed training before go-live.",
      ownerRole: "trainer-change",
      status: "open",
      sourceRefs: ["training:undecided"],
    });
  }

  if (users >= 15 && phaseIncluded(plan, "training-change")) {
    risks.push({
      id: "risk-adoption",
      title: "Adoption may stall after go-live",
      severity: "medium",
      reason: `With ${users} users, process change and usage habits often matter more than configuration.`,
      recommendedAction:
        "Name champions, set usage expectations and track adoption metrics in the first 30 days.",
      ownerRole: "trainer-change",
      status: "open",
      sourceRefs: ["adoption:users"],
    });
  }

  // --- Security ---
  if (mustHaves.some((r) => r.id === "support-sso")) {
    risks.push({
      id: "risk-sso",
      title: "SSO required — verify plan and configuration path",
      severity: "medium",
      reason: "SSO is a must-have security requirement.",
      recommendedAction:
        "Confirm SSO support on the selected plan and assign IT ownership.",
      ownerRole: "it-integrations",
      status: "open",
      sourceRefs: ["requirement:support-sso"],
    });
  }

  if (
    phaseIncluded(plan, "security") &&
    !plan.roles.find((r) => r.roleId === "security")?.assigned
  ) {
    risks.push({
      id: "risk-security-owner",
      title: "Security / permissions owner not assigned",
      severity: "medium",
      reason:
        "A security phase is included but no security role is marked assigned.",
      recommendedAction:
        "Assign someone for roles, access reviews and permission testing before UAT.",
      ownerRole: "security",
      status: "open",
      sourceRefs: ["roles:security"],
    });
  }

  // --- Ownership ---
  if (!plan.roles.find((r) => r.roleId === "crm-owner")?.assigned) {
    risks.push({
      id: "risk-crm-owner",
      title: "CRM owner not assigned",
      severity: "medium",
      reason:
        "Without a CRM owner, configuration decisions and go-live support often stall.",
      recommendedAction:
        "Assign a CRM owner (or interim admin) before configuration starts.",
      ownerRole: "project-manager",
      status: "open",
      sourceRefs: ["roles:crm-owner"],
    });
  }

  if (
    hasMigrationPhase &&
    !plan.roles.find((r) => r.roleId === "data-owner")?.assigned
  ) {
    risks.push({
      id: "risk-data-owner",
      title: "Data owner not assigned for migration",
      severity: "medium",
      reason:
        "Migration is in scope without a data owner for cleanup and reconciliation.",
      recommendedAction:
        "Assign a data owner before export and field mapping begin.",
      ownerRole: "data-owner",
      status: "open",
      sourceRefs: ["roles:data-owner"],
    });
  }

  // --- Product / requirements ---
  if (!plan.productId) {
    risks.push({
      id: "risk-no-product",
      title: plan.vendorNeutral
        ? "Vendor-neutral plan — product-specific risks still unknown"
        : "No CRM product confirmed",
      severity: "medium",
      reason: plan.vendorNeutral
        ? "Until a product is selected, plan-specific limits (imports, permissions, integrations) stay unverified."
        : "Planning continues without a confirmed CRM product.",
      recommendedAction:
        "Select a CRM from your shortlist when ready, then regenerate to refresh product-linked risks.",
      ownerRole: "project-manager",
      status: "open",
      sourceRefs: ["product:none"],
    });
  }

  if (mustHaves.length > 0 && plan.uatItems.every((u) => u.status === "not-tested")) {
    risks.push({
      id: "risk-uat-pending",
      title: "Must-have requirements are not yet UAT-tested",
      severity: "medium",
      reason: `${mustHaves.length} must-have requirement(s) have UAT scenarios that are still "not tested".`,
      recommendedAction:
        "Run requirement-based UAT before go-live and block launch on any failed must-haves.",
      ownerRole: "business-representative",
      status: "open",
      sourceRefs: ["uat:pending"],
    });
  }

  // --- Scope / coordination ---
  if (teamCount >= 2) {
    risks.push({
      id: "risk-multi-team",
      title: "Multiple teams need aligned processes",
      severity: "medium",
      reason: `${teamCount} teams are in scope — stage definitions, ownership and reporting often diverge.`,
      recommendedAction:
        "Agree shared vs team-specific pipelines and handoff rules in process design.",
      ownerRole: "sales-operations",
      status: "open",
      sourceRefs: ["scope:multi-team"],
    });
  }

  if (
    phaseIncluded(plan, "configuration") &&
    (phaseIncluded(plan, "data-migration") ||
      phaseIncluded(plan, "integrations"))
  ) {
    risks.push({
      id: "risk-parallel-streams",
      title: "Parallel build streams need coordination",
      severity: "low",
      reason:
        "Configuration, migration and/or integrations are planned to overlap — sequencing mistakes cause rework.",
      recommendedAction:
        "Keep a single weekly sync on dependencies (data model sign-off before final migration and critical integrations).",
      ownerRole: "project-manager",
      status: "open",
      sourceRefs: ["timeline:parallel"],
    });
  }

  if (
    plan.complexity?.level === "high" ||
    plan.complexity?.level === "very-high"
  ) {
    risks.push({
      id: "risk-complexity",
      title: `${plan.complexity.level === "very-high" ? "Very high" : "High"} implementation complexity`,
      severity: plan.complexity.level === "very-high" ? "high" : "medium",
      reason: `Complexity drivers include: ${plan.complexity.drivers
        .map((d) => d.label)
        .slice(0, 4)
        .join("; ") || "scope breadth"}.`,
      recommendedAction:
        "Protect a phased launch (core-only first) if the calendar or team capacity is tight.",
      ownerRole: "executive-sponsor",
      status: "open",
      sourceRefs: [`complexity:${plan.complexity.level}`],
    });
  }

  return risks;
}

/**
 * Preserve user risk status/notes when regenerating the same risk ids.
 */
export function mergeGeneratedRisks(
  generated: PlanRisk[],
  previous: PlanRisk[],
): PlanRisk[] {
  const prevById = new Map(previous.map((r) => [r.id, r]));
  return generated.map((risk) => {
    const prev = prevById.get(risk.id);
    if (!prev) return risk;
    if (prev.status !== "open") {
      return { ...risk, status: prev.status, ownerRole: prev.ownerRole ?? risk.ownerRole };
    }
    return risk;
  });
}

export function generateReadinessGaps(
  plan: CrmImplementationPlan,
  profile: CrmDecisionProfile | null,
): ReadinessGap[] {
  const gaps: ReadinessGap[] = [];

  if (!plan.implementationType) {
    gaps.push({
      id: "gap-impl-type",
      kind: "decision",
      title: "Implementation type not confirmed",
      detail:
        "Choose whether this is new, replacement, consolidation, or expansion.",
      resolved: false,
    });
  }

  if (
    phaseIncluded(plan, "data-migration") &&
    (plan.scope.migrationSource === "unknown" ||
      plan.scope.migrationSource === "none")
  ) {
    gaps.push({
      id: "gap-migration-source",
      kind: "decision",
      title: "Migration source not confirmed",
      detail:
        "Confirm spreadsheet, existing CRM, or multiple systems as the source.",
      resolved: false,
    });
  }

  const crmOwner = plan.roles.find((r) => r.roleId === "crm-owner");
  if (!crmOwner?.assigned) {
    gaps.push({
      id: "gap-crm-owner",
      kind: "owner",
      title: "CRM administration owner not assigned",
      detail: "Assign a CRM owner before configuration and go-live.",
      resolved: false,
    });
  }

  const dataOwner = plan.roles.find((r) => r.roleId === "data-owner");
  if (phaseIncluded(plan, "data-migration") && !dataOwner?.assigned) {
    gaps.push({
      id: "gap-data-owner",
      kind: "owner",
      title: "Data owner not assigned",
      detail:
        "Migration needs a named data owner for cleanup and reconciliation.",
      resolved: false,
    });
  }

  const integrations =
    profile?.integrations.filter(
      (i) => i.priority === "required" || i.priority === "preferred",
    ) ?? [];
  for (const integ of integrations) {
    gaps.push({
      id: `gap-int-${integ.id}`,
      kind: "verification",
      title: `Verify ${humanizeSlug(integ.id)} integration`,
      detail: "Confirm availability, method and owner before configuration.",
      resolved: false,
    });
  }

  if (
    (plan.scope.users ?? 0) >= 5 &&
    plan.scope.trainingApproach === "undecided"
  ) {
    gaps.push({
      id: "gap-training",
      kind: "definition",
      title: "Training approach incomplete",
      detail: "Decide how users will be trained before go-live.",
      resolved: false,
    });
  }

  if (!plan.targetGoLive && (plan.planningDurationWeeks ?? 0) >= 6) {
    gaps.push({
      id: "gap-target-date",
      kind: "decision",
      title: "Target go-live not set",
      detail:
        "A planning window without a date makes training and cutover harder to lock.",
      resolved: false,
    });
  }

  return gaps;
}

export const ROLE_LABELS: Record<ProjectRoleId, string> = {
  "executive-sponsor": "Executive sponsor",
  "project-manager": "Project manager",
  "crm-owner": "CRM owner",
  "sales-operations": "Sales operations",
  "it-integrations": "IT / integrations",
  "data-owner": "Data owner",
  security: "Security",
  "business-representative": "Business representative",
  "trainer-change": "Trainer / change lead",
  "vendor-partner": "Vendor / partner",
};
