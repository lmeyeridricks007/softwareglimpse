import type {
  PlanPhase,
  PlanPhaseId,
  ImplementationComplexityLevel,
  ImplementationType,
  MigrationComplexity,
  LaunchScope,
} from "@/domain";

export type PhaseGenerationContext = {
  migrationComplexity?: MigrationComplexity;
  integrationCount: number;
  automationRequired: boolean;
  reportingRequired: boolean;
  securityHeavy: boolean;
  users: number;
  complexity: ImplementationComplexityLevel;
  implementationType?: ImplementationType;
  launchScope: LaunchScope;
  hasMustHaveRequirements: boolean;
};

const PHASE_META: Record<
  PlanPhaseId,
  { name: string; baseWeeks: number; rationale: string }
> = {
  discovery: {
    name: "Discovery & Planning",
    baseWeeks: 1,
    rationale: "Confirm objectives, sponsors, scope and success metrics.",
  },
  "requirements-validation": {
    name: "Process & Requirements Validation",
    baseWeeks: 1,
    rationale: "Validate must-haves and phase-one vs later scope.",
  },
  "process-design": {
    name: "Process Design",
    baseWeeks: 1,
    rationale: "Document lifecycle, stages, ownership and handoffs.",
  },
  "data-model": {
    name: "CRM Architecture / Data Model",
    baseWeeks: 1,
    rationale: "Define record types, fields, stages and data-quality rules.",
  },
  configuration: {
    name: "Configuration",
    baseWeeks: 1.5,
    rationale: "Configure users, pipelines, fields, views and templates.",
  },
  "data-migration": {
    name: "Data Migration",
    baseWeeks: 2,
    rationale: "Inventory, clean, map, test-import and final migration.",
  },
  integrations: {
    name: "Integrations",
    baseWeeks: 1.5,
    rationale: "Confirm, configure and validate required integrations.",
  },
  "automation-reporting": {
    name: "Automation & Reporting",
    baseWeeks: 1,
    rationale: "Design, build and test workflows and dashboards.",
  },
  security: {
    name: "Security & Permissions",
    baseWeeks: 1,
    rationale: "Roles, access model, SSO/MFA where required, admin process.",
  },
  "testing-uat": {
    name: "Testing / UAT",
    baseWeeks: 1,
    rationale: "Requirement-based testing and user acceptance.",
  },
  "training-change": {
    name: "Training & Change",
    baseWeeks: 1,
    rationale: "Role-based training and adoption communications.",
  },
  "go-live": {
    name: "Go-Live",
    baseWeeks: 0.5,
    rationale: "Cutover checklist, activation and launch communications.",
  },
  stabilization: {
    name: "Stabilization & Adoption",
    baseWeeks: 2,
    rationale: "Hypercare, adoption tracking and phase-two prioritization.",
  },
};

/**
 * Hard finish-to-start predecessors. Phases that only share the same
 * predecessor (e.g. configuration + migration after data-model) run in parallel.
 */
const PHASE_PREDECESSORS: Record<PlanPhaseId, PlanPhaseId[]> = {
  discovery: [],
  "requirements-validation": ["discovery"],
  "process-design": ["requirements-validation", "discovery"],
  "data-model": ["process-design", "requirements-validation", "discovery"],
  configuration: ["data-model"],
  "data-migration": ["data-model"],
  integrations: ["data-model"],
  "automation-reporting": ["configuration"],
  security: ["configuration"],
  "testing-uat": [
    "configuration",
    "data-migration",
    "integrations",
    "automation-reporting",
    "security",
  ],
  "training-change": ["configuration"],
  "go-live": ["testing-uat", "training-change", "data-migration"],
  stabilization: ["go-live"],
};

function scaleWeeks(
  base: number,
  complexity: ImplementationComplexityLevel,
  launchScope: LaunchScope,
): number {
  let weeks = base;
  if (complexity === "high") weeks *= 1.25;
  if (complexity === "very-high") weeks *= 1.5;
  if (complexity === "low") weeks *= 0.85;
  if (launchScope === "core-only") weeks *= 0.85;
  if (launchScope === "full-target-state") weeks *= 1.15;
  return Math.max(0.5, Math.round(weeks * 4) / 4);
}

function durationForPhase(
  id: PlanPhaseId,
  ctx: PhaseGenerationContext,
): number {
  const meta = PHASE_META[id];
  let duration = scaleWeeks(meta.baseWeeks, ctx.complexity, ctx.launchScope);

  if (id === "data-migration") {
    if (ctx.migrationComplexity === "high") {
      duration = scaleWeeks(3, ctx.complexity, ctx.launchScope);
    } else if (ctx.migrationComplexity === "low") {
      duration = scaleWeeks(1, ctx.complexity, ctx.launchScope);
    }
  }
  if (id === "integrations") {
    duration = scaleWeeks(
      Math.min(3, 0.75 + ctx.integrationCount * 0.35),
      ctx.complexity,
      ctx.launchScope,
    );
  }
  if (id === "training-change" && ctx.users >= 50) {
    duration = scaleWeeks(1.5, ctx.complexity, ctx.launchScope);
  }
  return duration;
}

function resolvePredecessors(
  id: PlanPhaseId,
  included: Set<PlanPhaseId>,
): PlanPhaseId[] {
  const raw = PHASE_PREDECESSORS[id] ?? [];
  const present = raw.filter((p) => included.has(p));
  if (present.length > 0) return present;

  // Fall back through the chain when optional phases are omitted
  if (id === "process-design") {
    return resolvePredecessors("requirements-validation", included);
  }
  if (id === "data-model") {
    if (included.has("process-design")) return ["process-design"];
    if (included.has("requirements-validation")) {
      return ["requirements-validation"];
    }
    return included.has("discovery") ? ["discovery"] : [];
  }
  if (id === "testing-uat") {
    const build = (
      [
        "configuration",
        "data-migration",
        "integrations",
        "automation-reporting",
        "security",
      ] as PlanPhaseId[]
    ).filter((p) => included.has(p));
    return build.length > 0
      ? build
      : included.has("data-model")
        ? ["data-model"]
        : [];
  }
  if (id === "training-change") {
    if (included.has("configuration")) return ["configuration"];
    if (included.has("data-model")) return ["data-model"];
    return [];
  }
  if (id === "go-live") {
    const gates = (
      ["testing-uat", "training-change", "data-migration"] as PlanPhaseId[]
    ).filter((p) => included.has(p));
    return gates.length > 0 ? gates : included.has("configuration")
      ? ["configuration"]
      : [];
  }
  return [];
}

/**
 * Assign start/end weeks with parallelism:
 * - config / migration / integrations run together after data-model
 * - automation + security overlap configuration
 * - training overlaps late testing where possible
 */
function schedulePhases(
  drafts: Array<{ id: PlanPhaseId; durationWeeks: number; order: number }>,
): PlanPhase[] {
  const included = new Set(drafts.map((d) => d.id));
  const byId = new Map(drafts.map((d) => [d.id, d]));
  const scheduled = new Map<PlanPhaseId, { start: number; end: number }>();

  // Stable topological-ish order from candidate list
  for (const draft of drafts) {
    const preds = resolvePredecessors(draft.id, included);
    let start = 1;

    if (preds.length > 0) {
      const predEnds = preds.map((p) => {
        const s = scheduled.get(p);
        return s ? s.end : 0;
      });
      start = Math.max(...predEnds) + 1;
    }

    // Training may begin one week before testing finishes (overlap).
    if (draft.id === "training-change" && included.has("testing-uat")) {
      const testing = scheduled.get("testing-uat");
      const configEnd = scheduled.get("configuration")?.end ?? 0;
      if (testing) {
        start = Math.max(configEnd + 1, testing.start);
      }
    }

    // Integrations can start as soon as data-model ends (parallel with config).
    // Automation waits for configuration to have started — allow 0 lag after config start.
    if (draft.id === "automation-reporting") {
      const config = scheduled.get("configuration");
      if (config) {
        // Start mid-configuration when config spans 2+ weeks
        start =
          config.end > config.start
            ? config.start + 1
            : config.end + 1;
      }
    }

    if (draft.id === "security") {
      const config = scheduled.get("configuration");
      if (config) {
        start = config.start; // permissions work alongside configuration
      }
    }

    const span = Math.max(1, Math.ceil(draft.durationWeeks));
    const end = start + span - 1;
    scheduled.set(draft.id, { start, end });
  }

  // Second pass: training should not finish after go-live would need it —
  // ensure go-live waits for training end (already via predecessors).
  // If training was scheduled before testing existed, re-sync go-live.
  const goLive = byId.get("go-live");
  if (goLive) {
    const gates = (
      ["testing-uat", "training-change", "data-migration"] as PlanPhaseId[]
    )
      .map((id) => scheduled.get(id)?.end ?? 0)
      .filter((n) => n > 0);
    if (gates.length > 0) {
      const start = Math.max(...gates) + 1;
      const span = Math.max(1, Math.ceil(goLive.durationWeeks));
      scheduled.set("go-live", { start, end: start + span - 1 });
    }
  }

  const stab = byId.get("stabilization");
  if (stab) {
    const live = scheduled.get("go-live");
    if (live) {
      const start = live.end + 1;
      const span = Math.max(1, Math.ceil(stab.durationWeeks));
      scheduled.set("stabilization", { start, end: start + span - 1 });
    }
  }

  return drafts.map((draft) => {
    const slot = scheduled.get(draft.id) ?? { start: 1, end: 1 };
    return {
      id: draft.id,
      name: PHASE_META[draft.id].name,
      order: draft.order,
      durationWeeks: draft.durationWeeks,
      startWeek: slot.start,
      endWeek: slot.end,
      status: "not-started" as const,
      included: true,
      rationale: PHASE_META[draft.id].rationale,
    };
  });
}

/**
 * Deterministic phase inclusion + parallel-aware duration schedule.
 * Omits migration / integrations when not in scope.
 */
export function generatePhases(ctx: PhaseGenerationContext): PlanPhase[] {
  const includeMigration =
    (ctx.migrationComplexity ?? "none") !== "none" ||
    ctx.implementationType === "replace-existing" ||
    ctx.implementationType === "consolidate-multiple" ||
    ctx.implementationType === "from-spreadsheets";

  const includeIntegrations = ctx.integrationCount > 0;
  const includeAutomation =
    ctx.automationRequired || ctx.reportingRequired;
  const includeSecurity = ctx.securityHeavy || ctx.users >= 25;
  const includeProcess = ctx.hasMustHaveRequirements || ctx.users >= 10;

  const candidates: Array<{ id: PlanPhaseId; include: boolean }> = [
    { id: "discovery", include: true },
    { id: "requirements-validation", include: ctx.hasMustHaveRequirements },
    { id: "process-design", include: includeProcess },
    { id: "data-model", include: true },
    { id: "configuration", include: true },
    { id: "data-migration", include: includeMigration },
    { id: "integrations", include: includeIntegrations },
    { id: "automation-reporting", include: includeAutomation },
    { id: "security", include: includeSecurity },
    { id: "testing-uat", include: true },
    { id: "training-change", include: ctx.users >= 5 },
    { id: "go-live", include: true },
    {
      id: "stabilization",
      include: ctx.users >= 10 || ctx.complexity !== "low",
    },
  ];

  const included = candidates.filter((c) => c.include);
  const drafts = included.map(({ id }, order) => ({
    id,
    order,
    durationWeeks: durationForPhase(id, ctx),
  }));

  return schedulePhases(drafts);
}

export function totalPlanningWeeks(phases: PlanPhase[]): number {
  const included = phases.filter((p) => p.included);
  if (included.length === 0) return 1;
  const maxEnd = Math.max(...included.map((p) => p.endWeek ?? 1));
  return Math.max(1, maxEnd);
}

/** True when two included phases share any overlapping week. */
export function phasesOverlap(
  a: PlanPhase,
  b: PlanPhase,
): boolean {
  if (!a.included || !b.included) return false;
  const aStart = a.startWeek ?? 0;
  const aEnd = a.endWeek ?? aStart;
  const bStart = b.startWeek ?? 0;
  const bEnd = b.endWeek ?? bStart;
  return aStart <= bEnd && bStart <= aEnd;
}

export { PHASE_META, PHASE_PREDECESSORS };
