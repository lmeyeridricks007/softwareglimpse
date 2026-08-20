import type { GuidePage } from "@/domain";
import { buildAllEmProductGuides } from "@/services/product-guides/build";

/**
 * Product-scoped email-marketing guides (implementation, migration, setup,
 * plans, worth-it) for primary ESPs.
 */
export const emProductGuides: GuidePage[] = buildAllEmProductGuides();
