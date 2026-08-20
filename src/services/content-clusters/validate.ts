import { CategoryKnowledgeMapSchema, ContentClusterSchema } from "@/domain";
import { listCategoryKnowledgeMaps } from "@/data/content-clusters/knowledge";
import { buildContentCluster } from "./engine";

export function validateContentClusters(): {
  ok: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const map of listCategoryKnowledgeMaps()) {
    const parsed = CategoryKnowledgeMapSchema.safeParse(map);
    if (!parsed.success) {
      errors.push(
        `Invalid knowledge map ${map.id}: ${parsed.error.issues
          .map((i) => i.message)
          .join("; ")}`,
      );
      continue;
    }

    const coreCount = map.topics.filter((t) => t.priorityClass === "CORE").length;
    if (coreCount === 0) {
      warnings.push(`${map.categorySlug}: no CORE topics declared`);
    }
    if (coreCount > 12) {
      warnings.push(
        `${map.categorySlug}: ${coreCount} CORE topics — prefer a small CORE set`,
      );
    }

    for (const topic of map.topics) {
      if (
        topic.priorityClass === "CORE" &&
        topic.supportsContentIds.length === 0
      ) {
        errors.push(
          `${map.categorySlug}/${topic.id}: CORE topic must support at least one anchor`,
        );
      }
      const signals = [
        topic.standaloneSignals.multipleSubquestions,
        topic.standaloneSignals.distinctSearchIntent,
        topic.standaloneSignals.decisionImportance,
        topic.standaloneSignals.internalLinkUsefulness,
        topic.standaloneSignals.meaningfulDepth,
      ].filter(Boolean).length;
      if (
        topic.priorityClass === "CORE" &&
        signals < 3 &&
        topic.productSlugs.length === 0
      ) {
        warnings.push(
          `${map.categorySlug}/${topic.id}: CORE with weak standalone signals (${signals}/5)`,
        );
      }
    }

    const cluster = buildContentCluster(map.categorySlug);
    if (!cluster) {
      errors.push(`Failed to build cluster for ${map.categorySlug}`);
      continue;
    }
    const clusterParsed = ContentClusterSchema.safeParse(cluster);
    if (!clusterParsed.success) {
      errors.push(
        `Invalid cluster ${map.categorySlug}: ${clusterParsed.error.issues
          .map((i) => i.message)
          .join("; ")}`,
      );
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}
