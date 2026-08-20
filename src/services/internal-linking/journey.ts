import type { UserJourneyStage } from "@/domain";
import type { ContextualLink, LinkEntityType } from "./types";
import { makeLink, selectLinks } from "./select";

/**
 * Buyer-journey next steps for CRM (docs/content-ecosystem/03-crm-linking-architecture.md §2).
 * Prefer indexable destinations; skip noindex commercial anchors until published.
 */

const CRM_FINDER = "/tools/crm-finder/";
const CRM_REQUIREMENTS_BUILDER = "/tools/crm-requirements-builder/";
const CRM_COST = "/tools/crm-cost-calculator/";
const CRM_TCO = "/tools/crm-tco-calculator/";
const CRM_SCORECARD = "/tools/crm-vendor-scorecard/";
const CRM_IMPL_PLANNER = "/tools/crm-implementation-planner/";
const CRM_MIGRATION_PLANNER = "/tools/crm-migration-planner/";
const CRM_PLAN_SELECTOR = "/tools/crm-plan-selector/";
const CRM_ROI = "/tools/crm-roi-calculator/";
const CRM_READINESS = "/tools/crm-readiness-assessment/";
const CRM_RFP = "/tools/crm-rfp-builder/";
const CRM_DEMO_CHECKLIST = "/tools/crm-demo-checklist-builder/";
const CRM_MIGRATION_COST = "/tools/crm-migration-cost-calculator/";
const CRM_ADOPTION = "/tools/crm-adoption-health-assessment/";
const CRM_MULTI_COMPARE = "/tools/crm-multi-compare/";
const CRM_HUB = "/categories/crm/";
const COMPARE_HUB = "/compare/";
const REQUIREMENTS_HUB = "/requirements/";

export type JourneyNextStepInput = {
  sourceType: LinkEntityType;
  sourcePath: string;
  journeyStage?: UserJourneyStage;
  topicType?: string;
  /** Prefer product review when researching a shortlist. */
  preferredProductSlug?: string;
};

function tool(
  href: string,
  label: string,
  score: number,
  description?: string,
): ContextualLink | null {
  return makeLink({
    href,
    label,
    relationship: "toolFor",
    module: "tryDecisionTool",
    entityType: "tool",
    score,
    description,
  });
}

function next(
  href: string,
  label: string,
  entityType: LinkEntityType,
  score: number,
  relationship: ContextualLink["relationship"] = "nextStep",
  description?: string,
): ContextualLink | null {
  return makeLink({
    href,
    label,
    relationship,
    module: "recommendedNextStep",
    entityType,
    score,
    description,
  });
}

/** Recommended next-step + companion tools for a CRM page. */
export function resolveCrmJourneyModules(input: JourneyNextStepInput): {
  recommendedNextStep: ContextualLink[];
  tryDecisionTool: ContextualLink[];
} {
  const exclude = [input.sourcePath];
  const stage = input.journeyStage;
  const topic = input.topicType;
  const productHref = input.preferredProductSlug
    ? `/software/${input.preferredProductSlug}/`
    : null;

  const nextCandidates: Array<ContextualLink | null> = [];
  const toolCandidates: Array<ContextualLink | null> = [];

  const type = input.sourceType;

  if (type === "guide") {
    if (topic === "implementation" || stage === "implement") {
      nextCandidates.push(
        next(
          CRM_IMPL_PLANNER,
          "CRM Implementation Planner",
          "tool",
          95,
          "nextStep",
          "Turn scope into phases, owners, and go-live tasks.",
        ),
        next(
          CRM_MIGRATION_PLANNER,
          "CRM Migration Planner",
          "tool",
          88,
          "nextStep",
          "Plan data move risks before cutover.",
        ),
        next(
          "/guides/crm-data-migration/",
          "CRM data migration guide",
          "guide",
          80,
        ),
      );
      toolCandidates.push(
        tool(CRM_IMPL_PLANNER, "CRM Implementation Planner", 90),
        tool(CRM_TCO, "CRM TCO Calculator", 70),
      );
    } else if (topic === "migration" || stage === "switch") {
      nextCandidates.push(
        next(CRM_MIGRATION_PLANNER, "CRM Migration Planner", "tool", 95),
        next(CRM_IMPL_PLANNER, "CRM Implementation Planner", "tool", 85),
        next(CRM_SCORECARD, "CRM Vendor Scorecard", "tool", 75),
      );
      toolCandidates.push(
        tool(CRM_MIGRATION_PLANNER, "CRM Migration Planner", 90),
        tool(CRM_MIGRATION_COST, "CRM Migration Cost Calculator", 86),
      );
    } else if (
      topic === "pricing-education" ||
      topic === "selection" ||
      topic === "buying-guide" ||
      stage === "choose" ||
      stage === "evaluate"
    ) {
      nextCandidates.push(
        next(
          CRM_REQUIREMENTS_BUILDER,
          "CRM Requirements Builder",
          "tool",
          92,
          "nextStep",
          "Capture must-haves before you shortlist vendors.",
        ),
        next(CRM_FINDER, "CRM Software Finder", "tool", 90),
        next(CRM_COST, "CRM Cost Calculator", "tool", 78),
      );
      toolCandidates.push(
        tool(CRM_FINDER, "CRM Software Finder", 95),
        tool(CRM_REQUIREMENTS_BUILDER, "CRM Requirements Builder", 88),
        tool(CRM_PLAN_SELECTOR, "CRM Plan Selector", 82),
        tool(CRM_COST, "CRM Cost Calculator", 80),
        tool(CRM_READINESS, "CRM Readiness Assessment", 78),
      );
    } else if (stage === "optimize") {
      nextCandidates.push(
        next(CRM_ADOPTION, "CRM Adoption / Health Assessment", "tool", 92),
        next(CRM_SCORECARD, "CRM Vendor Scorecard", "tool", 80),
      );
      toolCandidates.push(
        tool(CRM_ADOPTION, "CRM Adoption / Health Assessment", 90),
        tool(CRM_SCORECARD, "CRM Vendor Scorecard", 78),
      );
    } else {
      // learn / understand
      nextCandidates.push(
        next(
          "/guides/crm-requirements-guide/",
          "CRM requirements guide",
          "guide",
          90,
        ),
        next(CRM_REQUIREMENTS_BUILDER, "CRM Requirements Builder", "tool", 88),
        next(CRM_FINDER, "CRM Software Finder", "tool", 82),
      );
      toolCandidates.push(
        tool(CRM_REQUIREMENTS_BUILDER, "CRM Requirements Builder", 90),
        tool(CRM_FINDER, "CRM Software Finder", 85),
      );
    }
  } else if (type === "requirement") {
    nextCandidates.push(
      next(CRM_FINDER, "CRM Software Finder", "tool", 95),
      next(CRM_REQUIREMENTS_BUILDER, "CRM Requirements Builder", "tool", 88),
      next(COMPARE_HUB, "Compare CRM software", "hub", 70),
    );
    toolCandidates.push(
      tool(CRM_FINDER, "CRM Software Finder", 95),
      tool(CRM_REQUIREMENTS_BUILDER, "CRM Requirements Builder", 85),
    );
  } else if (type === "feature" || type === "capability") {
    nextCandidates.push(
      next(REQUIREMENTS_HUB, "CRM requirements", "hub", 88),
      next(CRM_FINDER, "CRM Software Finder", "tool", 90),
      next(COMPARE_HUB, "Compare CRM software", "hub", 72),
    );
    toolCandidates.push(tool(CRM_FINDER, "CRM Software Finder", 90));
  } else if (type === "use-case" || type === "industry" || type === "audience") {
    nextCandidates.push(
      next(CRM_REQUIREMENTS_BUILDER, "CRM Requirements Builder", "tool", 92),
      next(CRM_FINDER, "CRM Software Finder", "tool", 90),
      next(CRM_HUB, "CRM Software hub", "category", 70),
    );
    toolCandidates.push(
      tool(CRM_FINDER, "CRM Software Finder", 95),
      tool(CRM_REQUIREMENTS_BUILDER, "CRM Requirements Builder", 88),
    );
  } else if (type === "software") {
    nextCandidates.push(
      next(COMPARE_HUB, "Compare CRM software", "hub", 92),
      next(CRM_COST, "CRM Cost Calculator", "tool", 88),
      next(CRM_SCORECARD, "CRM Vendor Scorecard", "tool", 80),
    );
    toolCandidates.push(
      tool(CRM_FINDER, "CRM Software Finder", 85),
      tool(CRM_COST, "CRM Cost Calculator", 90),
      tool(CRM_PLAN_SELECTOR, "CRM Plan Selector", 84),
      tool(CRM_TCO, "CRM TCO Calculator", 78),
      tool(CRM_ROI, "CRM ROI Calculator", 76),
    );
  } else if (type === "comparison") {
    nextCandidates.push(
      next(CRM_COST, "CRM Cost Calculator", "tool", 95),
      next(CRM_SCORECARD, "CRM Vendor Scorecard", "tool", 88),
      productHref
        ? next(productHref, "Read product review", "software", 75)
        : next(CRM_FINDER, "CRM Software Finder", "tool", 75),
    );
    toolCandidates.push(
      tool(CRM_COST, "CRM Cost Calculator", 95),
      tool(CRM_MULTI_COMPARE, "CRM Multi-product compare", 90),
      tool(CRM_PLAN_SELECTOR, "CRM Plan Selector", 88),
      tool(CRM_TCO, "CRM TCO Calculator", 80),
      tool(CRM_RFP, "CRM RFP Builder", 74),
      tool(CRM_DEMO_CHECKLIST, "CRM Demo Checklist Builder", 72),
    );
  } else if (type === "tool") {
    if (input.sourcePath.includes("crm-finder")) {
      nextCandidates.push(
        next(COMPARE_HUB, "Compare shortlisted CRMs", "hub", 90),
        next(CRM_COST, "CRM Cost Calculator", "tool", 85),
        next(CRM_SCORECARD, "CRM Vendor Scorecard", "tool", 80),
      );
    } else if (
      input.sourcePath.includes("cost") ||
      input.sourcePath.includes("tco")
    ) {
      nextCandidates.push(
        next(CRM_SCORECARD, "CRM Vendor Scorecard", "tool", 92),
        next(CRM_IMPL_PLANNER, "CRM Implementation Planner", "tool", 85),
      );
    } else if (input.sourcePath.includes("scorecard")) {
      nextCandidates.push(
        next(CRM_IMPL_PLANNER, "CRM Implementation Planner", "tool", 92),
        next(CRM_MIGRATION_PLANNER, "CRM Migration Planner", "tool", 80),
      );
    } else if (input.sourcePath.includes("implementation")) {
      nextCandidates.push(
        next(CRM_MIGRATION_PLANNER, "CRM Migration Planner", "tool", 95),
        next(CRM_TCO, "CRM TCO Calculator", "tool", 75),
      );
    } else if (input.sourcePath.includes("migration")) {
      nextCandidates.push(
        next(CRM_IMPL_PLANNER, "CRM Implementation Planner", "tool", 88),
        next(CRM_SCORECARD, "CRM Vendor Scorecard", "tool", 75),
      );
    } else if (input.sourcePath.includes("requirements-builder")) {
      nextCandidates.push(
        next(CRM_FINDER, "CRM Software Finder", "tool", 95),
        next(CRM_SCORECARD, "CRM Vendor Scorecard", "tool", 80),
      );
    } else {
      nextCandidates.push(next(CRM_FINDER, "CRM Software Finder", "tool", 80));
    }
    toolCandidates.push(
      tool(CRM_FINDER, "CRM Software Finder", 70),
      tool(CRM_COST, "CRM Cost Calculator", 65),
    );
  } else if (type === "resource") {
    nextCandidates.push(
      next(CRM_REQUIREMENTS_BUILDER, "CRM Requirements Builder", "tool", 90),
      next(CRM_FINDER, "CRM Software Finder", "tool", 85),
    );
    toolCandidates.push(
      tool(CRM_FINDER, "CRM Software Finder", 85),
      tool(CRM_REQUIREMENTS_BUILDER, "CRM Requirements Builder", 90),
    );
  } else if (type === "category" || type === "hub") {
    nextCandidates.push(
      next(CRM_FINDER, "CRM Software Finder", "tool", 95),
      next("/guides/how-to-choose-crm/", "How to choose a CRM", "guide", 88),
      next(CRM_COST, "CRM Cost Calculator", "tool", 80),
    );
    toolCandidates.push(
      tool(CRM_FINDER, "CRM Software Finder", 95),
      tool(CRM_COST, "CRM Cost Calculator", 88),
      tool(CRM_READINESS, "CRM Readiness Assessment", 84),
      tool(CRM_REQUIREMENTS_BUILDER, "CRM Requirements Builder", 82),
    );
  } else {
    nextCandidates.push(next(CRM_FINDER, "CRM Software Finder", "tool", 80));
    toolCandidates.push(tool(CRM_FINDER, "CRM Software Finder", 80));
  }

  return {
    recommendedNextStep: selectLinks(nextCandidates, {
      module: "recommendedNextStep",
      excludeHrefs: exclude,
    }),
    tryDecisionTool: selectLinks(toolCandidates, {
      module: "tryDecisionTool",
      excludeHrefs: exclude,
    }),
  };
}
