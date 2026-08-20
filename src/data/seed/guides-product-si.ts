import type { GuidePage } from "@/domain";
import { buildAllSiProductGuides } from "@/services/product-guides/build";

/**
 * Product-scoped sales-intelligence guides (implementation, migration, setup,
 * plans, worth-it). Published and indexable.
 */
export const siProductGuides: GuidePage[] = buildAllSiProductGuides();
