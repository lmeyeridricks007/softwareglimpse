import {
  CategoryKnowledgeMapSchema,
  type CategoryKnowledgeMap,
} from "@/domain";

const SIGNALS5 = {
  multipleSubquestions: true,
  distinctSearchIntent: true,
  decisionImportance: true,
  internalLinkUsefulness: true,
  meaningfulDepth: true,
} as const;

export type MinimumCategoryMapInput = {
  categorySlug: string;
  bestSlug: string;
  prefix: string;
  whatIs: { slug: string; title: string };
  howToChoose: { slug: string; title: string };
  pricing: { slug: string; title: string };
  requirements?: { slug: string; title: string };
  evaluation?: { slug: string; title: string };
};

/**
 * Compact CORE map for categories that already ship a teaching cluster
 * (what-is / how-to-choose / pricing, plus optional requirements + evaluation).
 * Planning config — not a generation quota.
 */
export function minimumCategoryKnowledgeMap(
  input: MinimumCategoryMapInput,
): CategoryKnowledgeMap {
  const categoryId = `content:category:${input.categorySlug}`;
  const bestId = `content:best:${input.bestSlug}`;
  const stem = input.whatIs.slug.replace(/^what-is-/, "");
  const howItWorksSlug = `how-${stem}-works`;
  const typesSlug = `types-of-${stem}`;
  const coreIds = [
    `${input.prefix}-what-is`,
    `${input.prefix}-how-it-works`,
    `${input.prefix}-types`,
    `${input.prefix}-how-to-choose`,
    `${input.prefix}-pricing`,
  ];
  if (input.requirements) coreIds.push(`${input.prefix}-requirements`);
  if (input.evaluation) coreIds.push(`${input.prefix}-evaluation`);

  const selectionTarget = input.requirements || input.evaluation ? 2 : 1;

  return CategoryKnowledgeMapSchema.parse({
    id: `knowledge-${input.categorySlug}-v1`,
    categorySlug: input.categorySlug,
    version: "1.0.0",
    areas: [
      {
        slug: "fundamentals",
        label: "Fundamentals",
        description: "Category definition and job-cluster boundaries",
        targetCoreCount: 3,
      },
      {
        slug: "selection",
        label: "Selection",
        description: "Buying and evaluation education",
        targetCoreCount: selectionTarget,
      },
      {
        slug: "pricing",
        label: "Pricing education",
        description: "Cost models that support a like-for-like quote",
        targetCoreCount: 1,
      },
    ],
    topics: [
      {
        id: `${input.prefix}-what-is`,
        titleConcept: input.whatIs.title,
        suggestedSlug: input.whatIs.slug,
        topicType: "fundamental",
        journeyStage: "learn",
        knowledgeAreaSlug: "fundamentals",
        priorityClass: "CORE",
        supportsContentIds: [categoryId, bestId],
        nextActionContentId: `content:guide:${input.howToChoose.slug}`,
        nextActionLabel: input.howToChoose.title,
        intentClusterKeys: [input.whatIs.title.toLowerCase()],
        standaloneSignals: SIGNALS5,
      },
      {
        id: `${input.prefix}-how-it-works`,
        titleConcept: `How ${input.whatIs.title.replace(/^What is /i, "").replace(/\?$/, "")} works`,
        suggestedSlug: howItWorksSlug,
        topicType: "how-it-works",
        journeyStage: "understand",
        knowledgeAreaSlug: "fundamentals",
        priorityClass: "CORE",
        supportsContentIds: [categoryId, bestId],
        nextActionContentId: `content:guide:${input.howToChoose.slug}`,
        nextActionLabel: input.howToChoose.title,
        intentClusterKeys: [`how ${input.categorySlug.replace(/-/g, " ")} works`],
        standaloneSignals: SIGNALS5,
      },
      {
        id: `${input.prefix}-types`,
        titleConcept: `Types of ${input.whatIs.title.replace(/^What is /i, "").replace(/\?$/, "")}`,
        suggestedSlug: typesSlug,
        topicType: "fundamental",
        journeyStage: "learn",
        knowledgeAreaSlug: "fundamentals",
        priorityClass: "CORE",
        supportsContentIds: [categoryId, bestId],
        nextActionContentId: `content:guide:${input.howToChoose.slug}`,
        nextActionLabel: input.howToChoose.title,
        intentClusterKeys: [`types of ${input.categorySlug.replace(/-/g, " ")}`],
        standaloneSignals: SIGNALS5,
      },
      {
        id: `${input.prefix}-how-to-choose`,
        titleConcept: input.howToChoose.title,
        suggestedSlug: input.howToChoose.slug,
        topicType: "selection",
        journeyStage: "evaluate",
        knowledgeAreaSlug: "selection",
        priorityClass: "CORE",
        supportsContentIds: [categoryId, bestId],
        nextActionContentId: bestId,
        nextActionLabel: `Best ${input.categorySlug.replace(/-/g, " ")} software`,
        intentClusterKeys: [input.howToChoose.title.toLowerCase()],
        standaloneSignals: SIGNALS5,
      },
      {
        id: `${input.prefix}-pricing`,
        titleConcept: input.pricing.title,
        suggestedSlug: input.pricing.slug,
        topicType: "pricing-education",
        journeyStage: "evaluate",
        knowledgeAreaSlug: "pricing",
        priorityClass: "CORE",
        supportsContentIds: [categoryId, bestId],
        nextActionContentId: `content:guide:${input.howToChoose.slug}`,
        nextActionLabel: input.howToChoose.title,
        intentClusterKeys: [input.pricing.title.toLowerCase()],
        standaloneSignals: SIGNALS5,
      },
      ...(input.requirements
        ? [
            {
              id: `${input.prefix}-requirements`,
              titleConcept: input.requirements.title,
              suggestedSlug: input.requirements.slug,
              topicType: "checklist" as const,
              journeyStage: "evaluate" as const,
              knowledgeAreaSlug: "selection" as const,
              priorityClass: "CORE" as const,
              supportsContentIds: [categoryId, bestId],
              intentClusterKeys: [input.requirements.title.toLowerCase()],
              standaloneSignals: SIGNALS5,
            },
          ]
        : []),
      ...(input.evaluation
        ? [
            {
              id: `${input.prefix}-evaluation`,
              titleConcept: input.evaluation.title,
              suggestedSlug: input.evaluation.slug,
              topicType: "selection" as const,
              journeyStage: "evaluate" as const,
              knowledgeAreaSlug: "selection" as const,
              priorityClass: "CORE" as const,
              supportsContentIds: [categoryId, bestId],
              intentClusterKeys: [input.evaluation.title.toLowerCase()],
              standaloneSignals: SIGNALS5,
            },
          ]
        : []),
    ],
    toolSupportTopicIds: {},
    bestSupportTopicIds: {
      [input.bestSlug]: coreIds.slice(0, 3),
    },
    notes: [
      "CORE slugs match published category teaching guides",
      "Do not mass-generate product-template pages to satisfy this map",
      "Affiliate commission must not influence topic selection",
    ],
  });
}
