import type {
  CategoryDefinition,
  KnowledgeAreaSlug,
  SupportingTopicConcept,
} from "@/domain";
import {
  bestContentId,
  categoryContentId,
  toolContentId,
} from "@/services/publishing/ids";

const AREA_LABELS: Record<KnowledgeAreaSlug, string> = {
  fundamentals: "Fundamentals",
  selection: "Selection",
  pricing: "Pricing education",
  features: "Features",
  implementation: "Implementation",
  migration: "Migration / switching",
  usage: "Usage",
  troubleshooting: "Troubleshooting",
  strategy: "Strategy",
  integrations: "Integrations",
};

/**
 * Derive which knowledge areas apply — not every category needs all areas.
 */
export function deriveApplicableKnowledgeAreas(
  definition: CategoryDefinition,
): {
  slug: KnowledgeAreaSlug;
  label: string;
  applicable: boolean;
  reason: string;
  targetCoreCount: number;
}[] {
  const declared = definition.supportingKnowledgeAreas;
  const hasPricing =
    definition.pricingCapability === "SUPPORTED" ||
    definition.pricingCapability === "PARTIAL";
  const coreFeatures = definition.features.filter(
    (f) => f.importance === "core" || f.importance === "important",
  );
  const hasUseCases = definition.useCases.length > 0;

  const candidates: {
    slug: KnowledgeAreaSlug;
    applicable: boolean;
    reason: string;
    targetCoreCount: number;
  }[] = [
    {
      slug: "fundamentals",
      applicable: true,
      reason: "Every category needs definitional education",
      targetCoreCount: 2,
    },
    {
      slug: "selection",
      applicable: true,
      reason: "Buyer evaluation education supports Best / Finder",
      targetCoreCount: 2,
    },
    {
      slug: "pricing",
      applicable: hasPricing || declared.includes("pricing"),
      reason: hasPricing
        ? "Pricing capability present — educate before calculator/pricing pages"
        : "Pricing education not applicable (capability unsupported)",
      targetCoreCount: 1,
    },
    {
      slug: "features",
      applicable: coreFeatures.length > 0 || declared.includes("features"),
      reason:
        coreFeatures.length > 0
          ? `${coreFeatures.length} important features — selective explainers only`
          : "No important features declared",
      targetCoreCount: 1,
    },
    {
      slug: "implementation",
      applicable:
        declared.includes("implementation") ||
        definition.lifecycle === "active",
      reason: "Implementation education for post-purchase journey",
      targetCoreCount: 1,
    },
    {
      slug: "migration",
      applicable: declared.includes("migration") || declared.length === 0,
      reason: "Switching/migration supports alternatives pages",
      targetCoreCount: 1,
    },
    {
      slug: "strategy",
      applicable: declared.includes("strategy") || hasUseCases,
      reason: hasUseCases
        ? "Use cases suggest strategy/education topics"
        : "Strategy optional unless declared",
      targetCoreCount: 0,
    },
    {
      slug: "troubleshooting",
      applicable: declared.includes("troubleshooting"),
      reason: "Only when category config requests troubleshooting area",
      targetCoreCount: 0,
    },
    {
      slug: "usage",
      applicable: declared.includes("usage"),
      reason: "Only when category config requests usage area",
      targetCoreCount: 0,
    },
    {
      slug: "integrations",
      applicable: declared.includes("integrations"),
      reason: "Only when category config requests integrations area",
      targetCoreCount: 0,
    },
  ];

  // If areas explicitly declared, prefer those as applicable set (still keep fundamentals+selection)
  if (declared.length > 0) {
    for (const c of candidates) {
      if (c.slug === "fundamentals" || c.slug === "selection") continue;
      c.applicable = declared.includes(c.slug);
      if (!c.applicable) {
        c.reason = `Not in supportingKnowledgeAreas for ${definition.slug}`;
        c.targetCoreCount = 0;
      }
    }
  }

  return candidates.map((c) => ({
    ...c,
    label: AREA_LABELS[c.slug],
  }));
}

function slugifyTopic(prefix: string, concept: string): string {
  return `${prefix}-${concept}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/**
 * Synthesize topic concepts from category definition — not a hardcoded CRM list.
 * When a hand-authored knowledge map exists, the planner prefers that map.
 */
export function synthesizeCategoryTopicConcepts(
  definition: CategoryDefinition,
): SupportingTopicConcept[] {
  const slug = definition.slug;
  const name = definition.name;
  const catId = categoryContentId(slug);
  const bestSlug =
    slug === "email-marketing"
      ? "email-marketing-software"
      : slug === "crm"
        ? "crm-software"
        : `${slug}-software`;
  const bestId = bestContentId(bestSlug);
  const finderSlug = `${slug}-finder`;
  const calcSlug = `${slug}-cost-calculator`;

  const areas = deriveApplicableKnowledgeAreas(definition).filter(
    (a) => a.applicable,
  );
  const topics: SupportingTopicConcept[] = [];

  if (areas.some((a) => a.slug === "fundamentals")) {
    topics.push({
      id: `${slug}-what-is`,
      titleConcept: `What is ${name} software?`,
      suggestedSlug: slugifyTopic("what-is", slug),
      topicType: "fundamental",
      journeyStage: "learn",
      knowledgeAreaSlug: "fundamentals",
      priorityClass: "CORE",
      productSlugs: [],
      supportsContentIds: [catId, bestId],
      supportRelationType: "supports-anchor",
      nextActionContentId: catId,
      nextActionLabel: `Explore ${name}`,
      intentClusterKeys: [
        `what is ${name}`.toLowerCase(),
        `${slug} meaning`,
        `${slug} definition`,
      ],
      standaloneSignals: {
        multipleSubquestions: true,
        distinctSearchIntent: true,
        decisionImportance: true,
        internalLinkUsefulness: true,
        meaningfulDepth: true,
      },
      notes: [],
    });
    topics.push({
      id: `${slug}-how-works`,
      titleConcept: `How does ${name} software work?`,
      suggestedSlug: slugifyTopic("how", `${slug}-works`),
      topicType: "how-it-works",
      journeyStage: "understand",
      knowledgeAreaSlug: "fundamentals",
      priorityClass: "CORE",
      productSlugs: [],
      supportsContentIds: [catId, bestId],
      supportRelationType: "supports-anchor",
      nextActionContentId: catId,
      nextActionLabel: `Browse ${name} tools`,
      intentClusterKeys: [`how ${slug} works`, `${slug} how it works`],
      standaloneSignals: {
        multipleSubquestions: true,
        distinctSearchIntent: true,
        decisionImportance: true,
        internalLinkUsefulness: true,
        meaningfulDepth: true,
      },
      notes: ["May merge into what-is guide if depth is thin"],
    });
  }

  if (areas.some((a) => a.slug === "selection")) {
    const finderSupports =
      definition.finderReadiness === "UI_READY" ||
      definition.finderReadiness === "ENGINE_READY" ||
      definition.finderReadiness === "DATA_MODEL_READY"
        ? [toolContentId(finderSlug)]
        : [];
    topics.push({
      id: `${slug}-how-to-choose`,
      titleConcept: `How to choose ${name} software`,
      suggestedSlug: slugifyTopic("how-to-choose", slug),
      topicType: "selection",
      journeyStage: "evaluate",
      knowledgeAreaSlug: "selection",
      priorityClass: "CORE",
      productSlugs: [],
      supportsContentIds: [catId, bestId, ...finderSupports],
      supportRelationType: "supports-anchor",
      nextActionContentId: finderSupports[0] ?? bestId,
      nextActionLabel: finderSupports.length
        ? `Find your ${name}`
        : `See best ${name}`,
      intentClusterKeys: [
        `how to choose ${slug}`,
        `${slug} buying guide`,
        `select ${slug} software`,
      ],
      standaloneSignals: {
        multipleSubquestions: true,
        distinctSearchIntent: true,
        decisionImportance: true,
        internalLinkUsefulness: true,
        meaningfulDepth: true,
      },
      notes: [],
    });
    topics.push({
      id: `${slug}-feature-checklist`,
      titleConcept: `${name} feature checklist`,
      suggestedSlug: slugifyTopic(`${slug}-feature`, "checklist"),
      topicType: "checklist",
      journeyStage: "evaluate",
      knowledgeAreaSlug: "selection",
      priorityClass: "CORE",
      productSlugs: [],
      supportsContentIds: [bestId, catId, ...finderSupports],
      supportRelationType: "supports-anchor",
      nextActionContentId: finderSupports[0] ?? bestId,
      nextActionLabel: "Use the checklist to evaluate tools",
      intentClusterKeys: [`${slug} features checklist`, `${slug} requirements`],
      standaloneSignals: {
        multipleSubquestions: true,
        distinctSearchIntent: true,
        decisionImportance: true,
        internalLinkUsefulness: true,
        meaningfulDepth: true,
      },
      notes: [],
    });
  }

  if (areas.some((a) => a.slug === "pricing")) {
    const calcSupports =
      definition.pricingCapability === "SUPPORTED"
        ? [toolContentId(calcSlug)]
        : [];
    topics.push({
      id: `${slug}-pricing-explained`,
      titleConcept: `${name} pricing explained`,
      suggestedSlug: slugifyTopic(`${slug}-pricing`, "explained"),
      topicType: "pricing-education",
      journeyStage: "evaluate",
      knowledgeAreaSlug: "pricing",
      priorityClass: "CORE",
      productSlugs: [],
      supportsContentIds: [...calcSupports, catId, bestId],
      supportRelationType: "explains-pricing",
      nextActionContentId: calcSupports[0] ?? catId,
      nextActionLabel: calcSupports.length
        ? `Calculate ${name} cost`
        : `Explore ${name}`,
      intentClusterKeys: [
        `how much does ${slug} cost`,
        `${slug} pricing`,
        `${slug} software cost`,
      ],
      standaloneSignals: {
        multipleSubquestions: true,
        distinctSearchIntent: true,
        decisionImportance: true,
        internalLinkUsefulness: true,
        meaningfulDepth: true,
      },
      notes: [],
    });
  }

  if (areas.some((a) => a.slug === "implementation")) {
    topics.push({
      id: `${slug}-implementation-guide`,
      titleConcept: `${name} implementation guide`,
      suggestedSlug: slugifyTopic(`${slug}-implementation`, "guide"),
      topicType: "implementation",
      journeyStage: "implement",
      knowledgeAreaSlug: "implementation",
      priorityClass: "CORE",
      productSlugs: [],
      supportsContentIds: [catId, bestId],
      supportRelationType: "supports-anchor",
      nextActionContentId: catId,
      nextActionLabel: `Pick a ${name} tool to implement`,
      intentClusterKeys: [
        `${slug} implementation`,
        `${slug} implementation time`,
      ],
      standaloneSignals: {
        multipleSubquestions: true,
        distinctSearchIntent: true,
        decisionImportance: true,
        internalLinkUsefulness: true,
        meaningfulDepth: true,
      },
      notes: [],
    });
  }

  if (areas.some((a) => a.slug === "migration")) {
    topics.push({
      id: `${slug}-migration-guide`,
      titleConcept: `How to migrate ${name} platforms`,
      suggestedSlug: slugifyTopic(`${slug}-migration`, "guide"),
      topicType: "migration",
      journeyStage: "switch",
      knowledgeAreaSlug: "migration",
      priorityClass: "CORE",
      productSlugs: [],
      supportsContentIds: [catId],
      supportRelationType: "migration-for",
      nextActionContentId: catId,
      nextActionLabel: `Browse ${name} alternatives`,
      intentClusterKeys: [
        `${slug} migration`,
        `switch ${slug}`,
        `migrate ${slug} data`,
      ],
      standaloneSignals: {
        multipleSubquestions: true,
        distinctSearchIntent: true,
        decisionImportance: true,
        internalLinkUsefulness: true,
        meaningfulDepth: true,
      },
      notes: [],
    });
  }

  // Selective feature explainers — only first important feature as SECONDARY example
  if (areas.some((a) => a.slug === "features")) {
    const feature = definition.features.find(
      (f) => f.importance === "core" || f.importance === "important",
    );
    if (feature) {
      topics.push({
        id: `${slug}-feature-${feature.slug}`,
        titleConcept: `${name} ${feature.name.toLowerCase()} explained`,
        suggestedSlug: slugifyTopic(slug, `${feature.slug}-explained`),
        topicType: "feature-explainer",
        journeyStage: "understand",
        knowledgeAreaSlug: "features",
        priorityClass: "SECONDARY",
        productSlugs: [],
        supportsContentIds: [catId, bestId],
        supportRelationType: "explains-feature",
        intentClusterKeys: [`${slug} ${feature.name}`.toLowerCase()],
        standaloneSignals: {
          multipleSubquestions: true,
          distinctSearchIntent: true,
          decisionImportance: true,
          internalLinkUsefulness: true,
          meaningfulDepth: true,
        },
        notes: [
          "One selective feature explainer — do not create one guide per feature",
        ],
      });
    }
  }

  // Micro-topic fixture for planner rejection demos (not recommended)
  topics.push({
    id: `${slug}-micro-definition`,
    titleConcept: `What is a ${name} custom field?`,
    suggestedSlug: slugifyTopic(slug, "custom-field-meaning"),
    topicType: "feature-explainer",
    journeyStage: "learn",
    knowledgeAreaSlug: "features",
    priorityClass: "NOT_RECOMMENDED",
    productSlugs: [],
    supportsContentIds: [catId],
    supportRelationType: "supports-anchor",
    intentClusterKeys: [`${slug} custom field`],
    standaloneSignals: {
      multipleSubquestions: false,
      distinctSearchIntent: false,
      decisionImportance: false,
      internalLinkUsefulness: false,
      meaningfulDepth: false,
    },
    notes: ["Micro-topic — reject standalone page"],
  });

  return topics;
}
