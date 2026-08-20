import {
  brandNames,
  queryIntentRules,
} from "@/data/config/seo/query-patterns";
import {
  ClassifiedQuerySchema,
  type ClassifiedQuery,
  type QueryIntent,
} from "@/domain";
import { normalizeQuery } from "./normalize-query";
import { recognizeEntities } from "./recognize-entities";

function detectIntent(normalized: string): QueryIntent {
  if (brandNames.some((b) => normalized.includes(b))) {
    return "brand";
  }
  for (const rule of queryIntentRules) {
    if (rule.pattern.test(normalized)) {
      return rule.intent;
    }
  }
  return "unknown";
}

/**
 * Deterministic query classification + entity recognition.
 */
export function classifyQuery(raw: string): ClassifiedQuery {
  const normalized = normalizeQuery(raw);
  const entities = recognizeEntities(normalized);
  const intent = detectIntent(normalized);

  return ClassifiedQuerySchema.parse({
    raw,
    normalized,
    intent,
    productSlugs: entities.productSlugs,
    categorySlugs: entities.categorySlugs,
    audienceSlugs: entities.audienceSlugs,
    businessTypeSlugs: entities.businessTypeSlugs,
  });
}
