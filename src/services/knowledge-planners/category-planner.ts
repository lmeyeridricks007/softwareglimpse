import {
  CategoryKnowledgePlanSchema,
  type CategoryDefinition,
  type CategoryKnowledgePlan,
  type SupportingTopicCandidate,
} from "@/domain";
import {
  getCategoryBySlug,
} from "@/data";
import {
  getGuidesByCategory,
} from "@/data/repositories/guides";
import { getCategoryKnowledgeMap } from "@/data/content-clusters/knowledge";
import { getCategoryDefinitionSeed } from "@/data/category-onboarding/seed";
import { loadActivatedCategory } from "@/data/category-onboarding/store";
import {
  buildSupportingTopicCandidates,
  resolveCategoryAnchors,
} from "@/services/content-clusters";
import {
  bestContentId,
  categoryContentId,
  toolContentId,
} from "@/services/publishing/ids";
import {
  deriveApplicableKnowledgeAreas,
  synthesizeCategoryTopicConcepts,
} from "./synthesize";

function resolveDefinition(
  categorySlug: string,
): CategoryDefinition | undefined {
  return (
    loadActivatedCategory(categorySlug)?.definition ??
    getCategoryDefinitionSeed(categorySlug)
  );
}

function journeyStatus(
  guideCount: number,
  candidateCount: number,
): "NONE" | "WEAK" | "PARTIAL" | "GOOD" | "STRONG" {
  const total = guideCount + candidateCount;
  if (guideCount >= 2) return "STRONG";
  if (guideCount === 1) return "GOOD";
  if (total >= 2) return "PARTIAL";
  if (total === 1) return "WEAK";
  return "NONE";
}

/**
 * CategoryKnowledgePlanner — structured plan, no guide execution.
 */
export function planCategoryKnowledge(
  categorySlug: string,
  options?: { seoSignals?: { query: string; impressions: number; clicks: number }[] },
): CategoryKnowledgePlan {
  const definition = resolveDefinition(categorySlug);
  const category = getCategoryBySlug(categorySlug, { includeUnpublished: true });
  if (!definition && !category) {
    throw new Error(
      `Category knowledge planner blocked: no definition/category for ${categorySlug}`,
    );
  }

  const map = getCategoryKnowledgeMap(categorySlug);
  const areas = definition
    ? deriveApplicableKnowledgeAreas(definition)
    : map?.areas.map((a) => ({
        slug: a.slug,
        label: a.label,
        applicable: true,
        reason: "From existing knowledge map",
        targetCoreCount: a.targetCoreCount,
      })) ?? [];

  // Prefer hand-authored map topics when present; else synthesize from definition
  const conceptSource = map
    ? map.topics
    : definition
      ? synthesizeCategoryTopicConcepts(definition)
      : [];

  const syntheticMap = {
    id: map?.id ?? `knowledge-${categorySlug}-planned`,
    categorySlug,
    version: map?.version ?? definition?.configVersion ?? "1.0.0",
    areas: areas
      .filter((a) => a.applicable)
      .map((a) => ({
        slug: a.slug,
        label: a.label,
        description: a.reason,
        targetCoreCount: a.targetCoreCount,
      })),
    topics: conceptSource,
    toolSupportTopicIds: map?.toolSupportTopicIds ?? {},
    bestSupportTopicIds: map?.bestSupportTopicIds ?? {},
    notes: map?.notes ?? ["Synthesized by category-knowledge-planner-agent:v1"],
  };

  const candidates = buildSupportingTopicCandidates(categorySlug, {
    seoSignals: options?.seoSignals,
    knowledgeMap: syntheticMap,
  });

  const guides = getGuidesByCategory(categorySlug, { includeUnpublished: true });
  const anchors = resolveCategoryAnchors(categorySlug);

  const coverage = syntheticMap.areas.map((area) => {
    const areaTopics = conceptSource.filter(
      (t) => t.knowledgeAreaSlug === area.slug,
    );
    const coreIds = areaTopics
      .filter((t) => t.priorityClass === "CORE")
      .map((t) => t.id);
    const existingCore = coreIds.filter((id) => {
      const topic = conceptSource.find((t) => t.id === id);
      return topic && guides.some((g) => g.slug === topic.suggestedSlug);
    });
    return {
      knowledgeAreaSlug: area.slug,
      label: area.label,
      targetCoreCount: area.targetCoreCount,
      existingCoreCount: existingCore.length,
      existingSecondaryCount: areaTopics.filter(
        (t) =>
          t.priorityClass === "SECONDARY" &&
          guides.some((g) => g.slug === t.suggestedSlug),
      ).length,
      missingCoreTopicIds: coreIds.filter((id) => !existingCore.includes(id)),
    };
  });

  const journeyStages = [
    "learn",
    "understand",
    "evaluate",
    "choose",
    "implement",
    "optimize",
    "switch",
  ] as const;
  const journeyAudit = journeyStages.map((stage) => {
    const guideCount = guides.filter((g) => g.journeyStage === stage).length;
    const candidateCount = candidates.filter(
      (c) => c.journeyStage === stage && c.readiness !== "exists",
    ).length;
    return {
      stage,
      status: journeyStatus(guideCount, candidateCount),
      guideCount,
      candidateCount,
    };
  });

  const gaps = [];
  for (const area of coverage) {
    for (const id of area.missingCoreTopicIds) {
      gaps.push({
        id: `gap:${id}`,
        kind: "missing-core-topic" as const,
        severity: "high" as const,
        message: `Missing CORE topic ${id} in ${area.label}`,
        relatedTopicIds: [id],
        relatedContentIds: [],
      });
    }
  }

  const anchorCoverage = buildAnchorCoverage(
    categorySlug,
    candidates,
    guides.map((g) => g.slug),
    map,
  );

  for (const a of anchorCoverage) {
    if (a.supportingGuideCount === 0 && a.missingCoreTopicIds.length > 0) {
      gaps.push({
        id: `gap-anchor:${a.contentId}`,
        kind: "anchor-unsupported" as const,
        severity: "medium" as const,
        message: `${a.title} has no supporting guides yet`,
        relatedTopicIds: a.missingCoreTopicIds,
        relatedContentIds: [a.contentId],
      });
    }
  }

  const seoEvidence =
    options?.seoSignals && options.seoSignals.length > 0
      ? options.seoSignals.some((s) => s.impressions >= 100)
        ? "AVAILABLE"
        : "PARTIAL"
      : "NONE";

  const coreCount = candidates.filter((c) => c.priorityClass === "CORE").length;
  const warnings: string[] = [];
  if (coreCount > 12) {
    warnings.push(
      `CORE topic count ${coreCount} exceeds conservative threshold (12) — review category knowledge config`,
    );
  }
  if (seoEvidence === "NONE") {
    warnings.push(
      "SEO evidence: NONE — foundational topics planned from category structure only",
    );
  }

  return CategoryKnowledgePlanSchema.parse({
    id: `cat-knowledge-plan:${categorySlug}:${Date.now()}`,
    categorySlug,
    plannerId: "category-knowledge-planner-agent",
    plannerVersion: "1.0.0",
    methodologyVersion:
      definition?.editorialMethodology.version ??
      definition?.configVersion ??
      "1.0.0",
    knowledgeAreas: areas,
    topicCandidates: candidates,
    anchors,
    anchorCoverage,
    coverage,
    journeyAudit,
    gaps,
    summary: {
      coreCount,
      secondaryCount: candidates.filter((c) => c.priorityClass === "SECONDARY")
        .length,
      optionalCount: candidates.filter((c) => c.priorityClass === "OPTIONAL")
        .length,
      existingCount: candidates.filter((c) => c.readiness === "exists").length,
      newPageCount: candidates.filter((c) => c.placement === "NEW_PAGE").length,
      expandCount: candidates.filter(
        (c) => c.placement === "EXPAND_EXISTING_PAGE",
      ).length,
      sectionCount: candidates.filter((c) => c.placement === "ADD_SECTION")
        .length,
      rejectedCount: candidates.filter(
        (c) =>
          c.placement === "NO_ACTION" ||
          c.placement === "REJECT" ||
          c.readiness === "not-recommended",
      ).length,
      seoEvidence,
    },
    warnings,
    generatedAt: new Date().toISOString(),
  });
}

function buildAnchorCoverage(
  categorySlug: string,
  candidates: SupportingTopicCandidate[],
  existingGuideSlugs: string[],
  map: ReturnType<typeof getCategoryKnowledgeMap>,
) {
  const rows = [
    {
      contentId: categoryContentId(categorySlug),
      title: `${categorySlug} category hub`,
      path: `/categories/${categorySlug}/`,
      topicIds: candidates
        .filter((c) =>
          c.supports.some(
            (s) => s.contentId === categoryContentId(categorySlug),
          ),
        )
        .map((c) => c.id.replace(/^candidate:/, "")),
    },
  ];

  const bestSlug =
    categorySlug === "email-marketing"
      ? "email-marketing-software"
      : categorySlug === "crm"
        ? "crm-software"
        : `${categorySlug}-software`;
  const bestTopicIds =
    map?.bestSupportTopicIds[bestSlug] ??
    candidates
      .filter((c) =>
        c.supports.some((s) => s.contentId === bestContentId(bestSlug)),
      )
      .map((c) => c.id.replace(/^candidate:/, ""));
  rows.push({
    contentId: bestContentId(bestSlug),
    title: `Best ${categorySlug}`,
    path: `/best/${bestSlug}/`,
    topicIds: bestTopicIds,
  });

  for (const [toolSlug, topicIds] of Object.entries(
    map?.toolSupportTopicIds ?? {
      [`${categorySlug}-finder`]: [],
      [`${categorySlug}-cost-calculator`]: [],
    },
  )) {
    rows.push({
      contentId: toolContentId(toolSlug),
      title: toolSlug,
      path: `/tools/${toolSlug}/`,
      topicIds:
        topicIds.length > 0
          ? topicIds
          : candidates
              .filter((c) =>
                c.supports.some(
                  (s) => s.contentId === toolContentId(toolSlug),
                ),
              )
              .map((c) => c.id.replace(/^candidate:/, "")),
    });
  }

  return rows.map((row) => {
    const supporting = candidates.filter(
      (c) =>
        c.readiness === "exists" &&
        c.supports.some((s) => s.contentId === row.contentId),
    );
    const missingCore = row.topicIds.filter((id) => {
      const c = candidates.find((x) => x.id === `candidate:${id}`);
      return (
        c &&
        c.priorityClass === "CORE" &&
        c.readiness !== "exists" &&
        !existingGuideSlugs.includes(c.suggestedSlug)
      );
    });
    return {
      contentId: row.contentId,
      title: row.title,
      path: row.path,
      supportingGuideCount: supporting.length,
      supportingGuideSlugs: supporting.map((s) => s.suggestedSlug),
      missingCoreTopicIds: missingCore,
    };
  });
}

export function categoryKnowledgePlannerReadiness(categorySlug: string): {
  status: "READY" | "BLOCKED" | "REVIEW_REQUIRED";
  reasons: { code: string; message: string; critical: boolean }[];
  missingDependencies: string[];
} {
  const definition = resolveDefinition(categorySlug);
  const category = getCategoryBySlug(categorySlug, { includeUnpublished: true });
  if (!definition && !category) {
    return {
      status: "BLOCKED",
      reasons: [
        {
          code: "CATEGORY_REQUIRED",
          message: `No category definition for ${categorySlug}`,
          critical: true,
        },
      ],
      missingDependencies: [`category-def:${categorySlug}`],
    };
  }
  if (!definition) {
    return {
      status: "REVIEW_REQUIRED",
      reasons: [
        {
          code: "DEFINITION_MISSING",
          message:
            "Category entity exists but CategoryDefinition missing — plan will be thin",
          critical: false,
        },
      ],
      missingDependencies: [],
    };
  }
  return { status: "READY", reasons: [], missingDependencies: [] };
}
