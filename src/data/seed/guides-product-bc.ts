import type { GuidePage } from "@/domain";
import { buildAllBcProductGuides } from "@/services/product-guides/build";

/**
 * Product-scoped business-communications guides (implementation, migration,
 * setup, plans, worth-it) for primary phone / messaging / UCaaS products.
 * Published and indexable (editorial gate cleared).
 */
export const bcProductGuides: GuidePage[] = buildAllBcProductGuides();
