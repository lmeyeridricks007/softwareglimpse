import {
  parseContentId,
  type ChangeEvent,
  type ContentId,
} from "@/domain";

/**
 * Pure revalidation tag resolver.
 *
 * Next.js usage (app router):
 *   import { revalidateTag } from "next/cache";
 *   for (const tag of resolveRevalidationTags(contentId)) {
 *     revalidateTag(tag);
 *   }
 *
 * Tag conventions:
 * - software:{slug}
 * - pricing:{slug}
 * - compare:{slug}
 * - best:{slug}
 * - alternatives:{slug}
 * - category:{slug}
 * - tool:{slug}
 * - content:{full-content-id-with-dashes}
 */

export function resolveRevalidationTags(
  input: ContentId | string | ChangeEvent,
): string[] {
  if (typeof input === "object" && input !== null && "entityId" in input) {
    const event = input as ChangeEvent;
    const tags = new Set<string>([
      `${event.entityType}:${event.entityId}`,
      `domain:${event.domain}`,
      "search-index",
    ]);
    if (event.entityType === "software" || event.domain === "pricing") {
      tags.add(`software:${event.entityId}`);
      tags.add(`pricing:${event.entityId}`);
    }
    if (event.domain === "affiliate") {
      const productSlug =
        typeof event.details?.productSlug === "string"
          ? event.details.productSlug
          : event.entityId;
      tags.add(`affiliate:${productSlug}`);
      tags.add(`software:${productSlug}`);
      tags.add(`pricing:${productSlug}`);
      tags.add(`tool:crm-finder`);
      tags.add(`tool:crm-cost-calculator`);
    }
    return [...tags];
  }

  const { type, slug, contentId } = parseContentId(String(input));
  const segment =
    type === "comparison" ? "compare" : type;
  return [
    `${segment}:${slug}`,
    `content:${String(contentId).replace(/:/g, "-")}`,
    "search-index",
  ];
}

/**
 * Adapter stub — no-op outside Next.js request context.
 * In Next.js route handlers / server actions, replace with revalidateTag.
 */
export function requestRevalidation(tags: string[]): void {
  if (process.env.NODE_ENV !== "production" && process.env.SG_LOG_REVALIDATE) {
    console.info("[publishing] requestRevalidation", tags);
  }
}
