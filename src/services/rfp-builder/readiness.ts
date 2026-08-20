import type {
  CrmRfpDraft,
  RfpMode,
  RfpReadinessStatus,
} from "@/domain";
import { analyzeRequirementsQuality, countByPriority } from "./quality";

export type ReadinessSectionStatus =
  | "complete"
  | "gaps"
  | "incomplete"
  | "optional"
  | "optional-incomplete";

export type ReadinessSection = {
  id: string;
  label: string;
  status: ReadinessSectionStatus;
  gaps: string[];
};

export type RfpReadiness = {
  status: RfpReadinessStatus;
  sections: ReadinessSection[];
  warnings: string[];
  blockers: string[];
};

function nonEmpty(value: string | undefined | null): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function assessRfpReadiness(
  draft: CrmRfpDraft,
  mode: RfpMode | undefined,
): RfpReadiness {
  const sections: ReadinessSection[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];
  const formal = mode === "formal-rfp";

  // Project
  {
    const gaps: string[] = [];
    if (!nonEmpty(draft.project.projectName)) gaps.push("Project name missing");
    if (!nonEmpty(draft.project.responseDeadline)) {
      gaps.push("Vendor response deadline missing");
    }
    sections.push({
      id: "project",
      label: "Project",
      status: gaps.length === 0 ? "complete" : gaps.length <= 1 ? "gaps" : "incomplete",
      gaps,
    });
  }

  // Business context
  {
    const gaps: string[] = [];
    if (!nonEmpty(draft.businessContext.businessProblem)) {
      gaps.push("Business problem not described");
    }
    if (!nonEmpty(draft.businessContext.currentSituation)) {
      gaps.push("Current situation not described");
    }
    sections.push({
      id: "business-context",
      label: "Business context",
      status: gaps.length === 0 ? "complete" : "gaps",
      gaps,
    });
  }

  // Scope
  {
    const inScope = draft.scope.filter((s) => s.phase !== "out-of-scope");
    const gaps: string[] = [];
    if (inScope.length === 0) gaps.push("No in-scope capabilities selected");
    sections.push({
      id: "scope",
      label: "Scope",
      status: gaps.length === 0 ? "complete" : "incomplete",
      gaps,
    });
  }

  // Requirements
  {
    const counts = countByPriority(draft.requirements);
    const active = draft.requirements.filter(
      (r) => r.priority !== "out-of-scope",
    );
    const quality = analyzeRequirementsQuality(draft.requirements);
    const gaps: string[] = [];
    if (active.length === 0) {
      gaps.push("No requirements to send vendors");
      blockers.push("Add or import requirements before generating.");
    }
    if (counts.mustHave === 0 && active.length > 0) {
      gaps.push("No must-have requirements marked");
      warnings.push("Mark at least one Must Have so vendors know hard gates.");
    }
    const evidenceGaps = quality.filter((q) => q.kind === "missing-evidence");
    if (evidenceGaps.length > 0) {
      gaps.push(
        `${evidenceGaps.length} must-have requirement(s) lack evidence expectations`,
      );
    }
    const vague = quality.filter((q) => q.kind === "vague");
    if (vague.length > 0) {
      gaps.push(`${vague.length} requirement(s) may be too vague`);
      warnings.push(...vague.map((v) => v.message));
    }
    if (active.length >= 150) {
      warnings.push(
        `Your RFP contains ${active.length} requirements. Consider moving lower-priority items to demo validation or future-phase scope.`,
      );
    }
    sections.push({
      id: "requirements",
      label: "Requirements",
      status:
        active.length === 0
          ? "incomplete"
          : gaps.length === 0
            ? "complete"
            : "gaps",
      gaps,
    });
  }

  // Integrations
  {
    const gaps: string[] = [];
    for (const integ of draft.integrations) {
      if (
        integ.criticality === "critical" &&
        (integ.direction === "unknown" || !nonEmpty(integ.data))
      ) {
        gaps.push(
          `${integ.system || integ.id}: critical integration missing direction/data`,
        );
      }
    }
    if (gaps.length > 0) {
      warnings.push(
        `${gaps.length} critical integration(s) have no direction/data definition.`,
      );
    }
    sections.push({
      id: "integrations",
      label: "Integrations",
      status:
        draft.integrations.length === 0
          ? formal
            ? "gaps"
            : "optional"
          : gaps.length === 0
            ? "complete"
            : "gaps",
      gaps,
    });
  }

  // Security
  {
    const requested = draft.securityQuestions.filter((q) => q.required);
    if (!formal) {
      sections.push({
        id: "security",
        label: "Security",
        status:
          requested.length > 0 ? "complete" : "optional",
        gaps: [],
      });
    } else {
      const gaps: string[] = [];
      if (requested.length === 0) {
        gaps.push("No security questions marked required");
      }
      sections.push({
        id: "security",
        label: "Security",
        status:
          requested.length === 0
            ? "optional-incomplete"
            : "complete",
        gaps,
      });
    }
  }

  // Commercial assumptions
  {
    const gaps: string[] = [];
    const a = draft.pricingAssumptions;
    if (a.usersYear1 == null) gaps.push("Year 1 user count missing");
    if (a.usersYear2 == null) gaps.push("Year 2 user count missing");
    if (a.usersYear3 == null) gaps.push("Year 3 user count missing");
    if (gaps.length > 0) {
      warnings.push(
        "Pricing assumptions incomplete — vendors may return incomparable quotes.",
      );
    }
    if (
      a.usersYear1 != null &&
      a.usersYear2 != null &&
      a.usersYear1 === a.usersYear2 &&
      String(a.usersYear1).includes("-")
    ) {
      warnings.push(
        "Ambiguous user ranges can produce incomparable pricing. Set a single pricing assumption.",
      );
    }
    sections.push({
      id: "commercial",
      label: "Commercial assumptions",
      status: gaps.length === 0 ? "complete" : "gaps",
      gaps,
    });
  }

  // Date consistency
  if (
    nonEmpty(draft.project.goLiveDate) &&
    nonEmpty(draft.project.decisionDate) &&
    draft.project.goLiveDate < draft.project.decisionDate
  ) {
    warnings.push(
      "Target go-live is before planned vendor decision date.",
    );
  }

  const incomplete = sections.filter((s) => s.status === "incomplete");
  const gapSections = sections.filter(
    (s) => s.status === "gaps" || s.status === "optional-incomplete",
  );

  let status: RfpReadinessStatus = "ready";
  if (blockers.length > 0 || incomplete.length > 0) {
    status = "incomplete";
  } else if (gapSections.length > 0 || warnings.length > 0) {
    status = "ready-with-gaps";
  }

  return { status, sections, warnings, blockers };
}

export const READINESS_LABELS: Record<RfpReadinessStatus, string> = {
  ready: "Ready",
  "ready-with-gaps": "Ready with gaps",
  incomplete: "Incomplete",
};
