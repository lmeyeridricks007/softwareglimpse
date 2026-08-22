import type { UserJourneyStage } from "@/domain";
import {
  categoryDecisionCostHref,
  categoryDecisionFinderHref,
  categorySharedToolHref,
  categoryShortName,
  categorySoftwarePhrase,
  hasDedicatedCategoryTools,
} from "@/data/config/tools/category-tool-meta";
import type { ContextualLink, LinkEntityType } from "./types";
import { makeLink, selectLinks } from "./select";

/**
 * Buyer-journey next steps by category.
 * Prefer indexable destinations; skip soft software-finder / stack-builder.
 */

const COMPARE_HUB = "/compare/";
const REQUIREMENTS_HUB = "/requirements/";

/** CRM-only tools (not in shared category packs). */
const CRM_ONLY = {
  tco: "/tools/crm-tco-calculator/",
  implPlanner: "/tools/crm-implementation-planner/",
  migrationPlanner: "/tools/crm-migration-planner/",
  migrationCost: "/tools/crm-migration-cost-calculator/",
  adoption: "/tools/crm-adoption-health-assessment/",
  multiCompare: "/tools/crm-multi-compare/",
  roi: "/tools/crm-roi-calculator/",
  requirementsGuide: "/guides/crm-requirements-guide/",
  chooseGuide: "/guides/how-to-choose-crm/",
  migrationGuide: "/guides/crm-data-migration/",
} as const;

export type JourneyNextStepInput = {
  sourceType: LinkEntityType;
  sourcePath: string;
  /** Primary category for tool + copy resolution. Defaults to crm. */
  categorySlug?: string;
  journeyStage?: UserJourneyStage;
  topicType?: string;
  /** Prefer product review when researching a shortlist. */
  preferredProductSlug?: string;
};

type CategoryToolkit = {
  slug: string;
  shortName: string;
  phrase: string;
  hub: string;
  finder: string | null;
  cost: string | null;
  requirements: string | null;
  scorecard: string | null;
  planSelector: string | null;
  readiness: string | null;
  rfp: string | null;
  demoChecklist: string | null;
};

function toolkitFor(categorySlug: string): CategoryToolkit {
  const slug = hasDedicatedCategoryTools(categorySlug)
    ? categorySlug
    : "crm";
  const shortName = categoryShortName(slug);
  return {
    slug,
    shortName,
    phrase: categorySoftwarePhrase(slug),
    hub: `/categories/${slug}/`,
    finder: categoryDecisionFinderHref(slug),
    cost: categoryDecisionCostHref(slug),
    requirements: categorySharedToolHref(slug, "requirements-builder"),
    scorecard: categorySharedToolHref(slug, "vendor-scorecard"),
    planSelector: categorySharedToolHref(slug, "plan-selector"),
    readiness: categorySharedToolHref(slug, "readiness-assessment"),
    rfp: categorySharedToolHref(slug, "rfp-builder"),
    demoChecklist: categorySharedToolHref(slug, "demo-checklist-builder"),
  };
}

function tool(
  href: string | null | undefined,
  label: string,
  score: number,
  description?: string,
): ContextualLink | null {
  if (!href) return null;
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
  href: string | null | undefined,
  label: string,
  entityType: LinkEntityType,
  score: number,
  relationship: ContextualLink["relationship"] = "nextStep",
  description?: string,
): ContextualLink | null {
  if (!href) return null;
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

function label(tk: CategoryToolkit, suffix: string): string {
  return `${tk.shortName} ${suffix}`;
}

/** Recommended next-step + companion tools for a category page. */
export function resolveCategoryJourneyModules(input: JourneyNextStepInput): {
  recommendedNextStep: ContextualLink[];
  tryDecisionTool: ContextualLink[];
} {
  const exclude = [input.sourcePath];
  const stage = input.journeyStage;
  const topic = input.topicType;
  const tk = toolkitFor(input.categorySlug ?? "crm");
  const isCrm = tk.slug === "crm";
  const productHref = input.preferredProductSlug
    ? `/software/${input.preferredProductSlug}/`
    : null;

  const nextCandidates: Array<ContextualLink | null> = [];
  const toolCandidates: Array<ContextualLink | null> = [];

  const type = input.sourceType;

  if (type === "guide") {
    if (topic === "implementation" || stage === "implement") {
      if (isCrm) {
        nextCandidates.push(
          next(
            CRM_ONLY.implPlanner,
            "CRM Implementation Planner",
            "tool",
            95,
            "nextStep",
            "Turn scope into phases, owners, and go-live tasks.",
          ),
          next(
            CRM_ONLY.migrationPlanner,
            "CRM Migration Planner",
            "tool",
            88,
            "nextStep",
            "Plan data move risks before cutover.",
          ),
          next(
            CRM_ONLY.migrationGuide,
            "CRM data migration guide",
            "guide",
            80,
          ),
        );
        toolCandidates.push(
          tool(CRM_ONLY.implPlanner, "CRM Implementation Planner", 90),
          tool(CRM_ONLY.tco, "CRM TCO Calculator", 70),
        );
      } else {
        nextCandidates.push(
          next(
            tk.readiness,
            label(tk, "Readiness Assessment"),
            "tool",
            92,
            "nextStep",
            "Confirm selection vs implementation readiness before rollout.",
          ),
          next(tk.finder, label(tk, "Software Finder"), "tool", 85),
          next(tk.hub, `${tk.shortName} Software hub`, "category", 70),
        );
        toolCandidates.push(
          tool(tk.readiness, label(tk, "Readiness Assessment"), 90),
          tool(tk.requirements, label(tk, "Requirements Builder"), 80),
        );
      }
    } else if (topic === "migration" || stage === "switch") {
      if (isCrm) {
        nextCandidates.push(
          next(CRM_ONLY.migrationPlanner, "CRM Migration Planner", "tool", 95),
          next(CRM_ONLY.implPlanner, "CRM Implementation Planner", "tool", 85),
          next(tk.scorecard, "CRM Vendor Scorecard", "tool", 75),
        );
        toolCandidates.push(
          tool(CRM_ONLY.migrationPlanner, "CRM Migration Planner", 90),
          tool(CRM_ONLY.migrationCost, "CRM Migration Cost Calculator", 86),
        );
      } else {
        nextCandidates.push(
          next(tk.scorecard, label(tk, "Vendor Scorecard"), "tool", 92),
          next(tk.finder, label(tk, "Software Finder"), "tool", 85),
          next(tk.cost, label(tk, "Cost Calculator"), "tool", 78),
        );
        toolCandidates.push(
          tool(tk.scorecard, label(tk, "Vendor Scorecard"), 90),
          tool(tk.cost, label(tk, "Cost Calculator"), 80),
        );
      }
    } else if (
      topic === "pricing-education" ||
      topic === "selection" ||
      topic === "buying-guide" ||
      stage === "choose" ||
      stage === "evaluate"
    ) {
      nextCandidates.push(
        next(
          tk.requirements,
          label(tk, "Requirements Builder"),
          "tool",
          92,
          "nextStep",
          "Capture must-haves before you shortlist vendors.",
        ),
        next(tk.finder, label(tk, "Software Finder"), "tool", 90),
        next(tk.cost, label(tk, "Cost Calculator"), "tool", 78),
      );
      toolCandidates.push(
        tool(tk.finder, label(tk, "Software Finder"), 95),
        tool(tk.requirements, label(tk, "Requirements Builder"), 88),
        tool(tk.planSelector, label(tk, "Plan Selector"), 82),
        tool(tk.cost, label(tk, "Cost Calculator"), 80),
        tool(tk.readiness, label(tk, "Readiness Assessment"), 78),
      );
    } else if (stage === "optimize") {
      if (isCrm) {
        nextCandidates.push(
          next(CRM_ONLY.adoption, "CRM Adoption / Health Assessment", "tool", 92),
          next(tk.scorecard, "CRM Vendor Scorecard", "tool", 80),
        );
        toolCandidates.push(
          tool(CRM_ONLY.adoption, "CRM Adoption / Health Assessment", 90),
          tool(tk.scorecard, "CRM Vendor Scorecard", 78),
        );
      } else {
        nextCandidates.push(
          next(tk.scorecard, label(tk, "Vendor Scorecard"), "tool", 92),
          next(tk.readiness, label(tk, "Readiness Assessment"), "tool", 80),
        );
        toolCandidates.push(
          tool(tk.scorecard, label(tk, "Vendor Scorecard"), 90),
          tool(tk.readiness, label(tk, "Readiness Assessment"), 78),
        );
      }
    } else {
      // learn / understand
      nextCandidates.push(
        isCrm
          ? next(
              CRM_ONLY.requirementsGuide,
              "CRM requirements guide",
              "guide",
              90,
            )
          : next(
              tk.requirements,
              label(tk, "Requirements Builder"),
              "tool",
              90,
            ),
        next(tk.requirements, label(tk, "Requirements Builder"), "tool", 88),
        next(tk.finder, label(tk, "Software Finder"), "tool", 82),
      );
      toolCandidates.push(
        tool(tk.requirements, label(tk, "Requirements Builder"), 90),
        tool(tk.finder, label(tk, "Software Finder"), 85),
      );
    }
  } else if (type === "requirement") {
    nextCandidates.push(
      next(tk.finder, label(tk, "Software Finder"), "tool", 95),
      next(tk.requirements, label(tk, "Requirements Builder"), "tool", 88),
      next(COMPARE_HUB, `Compare ${tk.phrase}`, "hub", 70),
    );
    toolCandidates.push(
      tool(tk.finder, label(tk, "Software Finder"), 95),
      tool(tk.requirements, label(tk, "Requirements Builder"), 85),
    );
  } else if (type === "feature" || type === "capability") {
    nextCandidates.push(
      next(REQUIREMENTS_HUB, `${tk.shortName} requirements`, "hub", 88),
      next(tk.finder, label(tk, "Software Finder"), "tool", 90),
      next(COMPARE_HUB, `Compare ${tk.phrase}`, "hub", 72),
    );
    toolCandidates.push(tool(tk.finder, label(tk, "Software Finder"), 90));
  } else if (type === "use-case" || type === "industry" || type === "audience") {
    nextCandidates.push(
      next(tk.requirements, label(tk, "Requirements Builder"), "tool", 92),
      next(tk.finder, label(tk, "Software Finder"), "tool", 90),
      next(tk.hub, `${tk.shortName} Software hub`, "category", 70),
    );
    toolCandidates.push(
      tool(tk.finder, label(tk, "Software Finder"), 95),
      tool(tk.requirements, label(tk, "Requirements Builder"), 88),
    );
  } else if (type === "software") {
    nextCandidates.push(
      next(COMPARE_HUB, `Compare ${tk.phrase}`, "hub", 92),
      next(tk.cost, label(tk, "Cost Calculator"), "tool", 88),
      next(tk.scorecard, label(tk, "Vendor Scorecard"), "tool", 80),
    );
    toolCandidates.push(
      tool(tk.finder, label(tk, "Software Finder"), 85),
      tool(tk.cost, label(tk, "Cost Calculator"), 90),
      tool(tk.planSelector, label(tk, "Plan Selector"), 84),
    );
    if (isCrm) {
      toolCandidates.push(
        tool(CRM_ONLY.tco, "CRM TCO Calculator", 78),
        tool(CRM_ONLY.roi, "CRM ROI Calculator", 76),
      );
    }
  } else if (type === "comparison" || type === "best" || type === "alternatives") {
    nextCandidates.push(
      next(tk.cost, label(tk, "Cost Calculator"), "tool", 95),
      next(tk.scorecard, label(tk, "Vendor Scorecard"), "tool", 88),
      productHref
        ? next(productHref, "Read product review", "software", 75)
        : next(tk.finder, label(tk, "Software Finder"), "tool", 75),
    );
    toolCandidates.push(
      tool(tk.cost, label(tk, "Cost Calculator"), 95),
      tool(tk.planSelector, label(tk, "Plan Selector"), 88),
      tool(tk.rfp, label(tk, "RFP Builder"), 74),
      tool(tk.demoChecklist, label(tk, "Demo Checklist Builder"), 72),
    );
    if (isCrm) {
      toolCandidates.push(
        tool(CRM_ONLY.multiCompare, "CRM Multi-product compare", 90),
        tool(CRM_ONLY.tco, "CRM TCO Calculator", 80),
      );
    }
  } else if (type === "tool") {
    if (input.sourcePath.includes("finder")) {
      nextCandidates.push(
        next(COMPARE_HUB, `Compare shortlisted ${tk.shortName}`, "hub", 90),
        next(tk.cost, label(tk, "Cost Calculator"), "tool", 85),
        next(tk.scorecard, label(tk, "Vendor Scorecard"), "tool", 80),
      );
    } else if (
      input.sourcePath.includes("cost") ||
      input.sourcePath.includes("tco")
    ) {
      nextCandidates.push(
        next(tk.scorecard, label(tk, "Vendor Scorecard"), "tool", 92),
        isCrm
          ? next(CRM_ONLY.implPlanner, "CRM Implementation Planner", "tool", 85)
          : next(tk.readiness, label(tk, "Readiness Assessment"), "tool", 85),
      );
    } else if (input.sourcePath.includes("scorecard")) {
      nextCandidates.push(
        isCrm
          ? next(CRM_ONLY.implPlanner, "CRM Implementation Planner", "tool", 92)
          : next(tk.readiness, label(tk, "Readiness Assessment"), "tool", 92),
        isCrm
          ? next(CRM_ONLY.migrationPlanner, "CRM Migration Planner", "tool", 80)
          : next(tk.finder, label(tk, "Software Finder"), "tool", 80),
      );
    } else if (input.sourcePath.includes("implementation")) {
      nextCandidates.push(
        next(CRM_ONLY.migrationPlanner, "CRM Migration Planner", "tool", 95),
        next(CRM_ONLY.tco, "CRM TCO Calculator", "tool", 75),
      );
    } else if (input.sourcePath.includes("migration")) {
      nextCandidates.push(
        next(CRM_ONLY.implPlanner, "CRM Implementation Planner", "tool", 88),
        next(tk.scorecard, label(tk, "Vendor Scorecard"), "tool", 75),
      );
    } else if (input.sourcePath.includes("requirements-builder")) {
      nextCandidates.push(
        next(tk.finder, label(tk, "Software Finder"), "tool", 95),
        next(tk.scorecard, label(tk, "Vendor Scorecard"), "tool", 80),
      );
    } else {
      nextCandidates.push(next(tk.finder, label(tk, "Software Finder"), "tool", 80));
    }
    toolCandidates.push(
      tool(tk.finder, label(tk, "Software Finder"), 70),
      tool(tk.cost, label(tk, "Cost Calculator"), 65),
    );
  } else if (type === "resource") {
    nextCandidates.push(
      next(tk.requirements, label(tk, "Requirements Builder"), "tool", 90),
      next(tk.finder, label(tk, "Software Finder"), "tool", 85),
    );
    toolCandidates.push(
      tool(tk.finder, label(tk, "Software Finder"), 85),
      tool(tk.requirements, label(tk, "Requirements Builder"), 90),
    );
  } else if (type === "category" || type === "hub") {
    nextCandidates.push(
      next(tk.finder, label(tk, "Software Finder"), "tool", 95),
      isCrm
        ? next(CRM_ONLY.chooseGuide, "How to choose a CRM", "guide", 88)
        : next(tk.requirements, label(tk, "Requirements Builder"), "tool", 88),
      next(tk.cost, label(tk, "Cost Calculator"), "tool", 80),
    );
    toolCandidates.push(
      tool(tk.finder, label(tk, "Software Finder"), 95),
      tool(tk.cost, label(tk, "Cost Calculator"), 88),
      tool(tk.readiness, label(tk, "Readiness Assessment"), 84),
      tool(tk.requirements, label(tk, "Requirements Builder"), 82),
    );
  } else {
    nextCandidates.push(next(tk.finder, label(tk, "Software Finder"), "tool", 80));
    toolCandidates.push(tool(tk.finder, label(tk, "Software Finder"), 80));
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

/** @deprecated Prefer resolveCategoryJourneyModules with categorySlug. */
export function resolveCrmJourneyModules(input: JourneyNextStepInput): {
  recommendedNextStep: ContextualLink[];
  tryDecisionTool: ContextualLink[];
} {
  return resolveCategoryJourneyModules({
    ...input,
    categorySlug: input.categorySlug ?? "crm",
  });
}


