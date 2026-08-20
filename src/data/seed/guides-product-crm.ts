import type { GuidePage } from "@/domain";
import { buildAllCrmProductGuides } from "@/services/product-guides/build";

/**
 * Product-scoped CRM guides (implementation, migration, setup, plans, worth-it).
 * Published via factory from pricing snapshots + research/assessment context.
 */
export const crmProductGuides: GuidePage[] = buildAllCrmProductGuides();
