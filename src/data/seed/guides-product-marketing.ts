import type { GuidePage } from "@/domain";
import { buildAllMarketingProductGuides } from "@/services/product-guides/build";

/**
 * Product-scoped marketing & growth guides (implementation, migration, setup,
 * plans, worth-it) for published marketing products.
 */
export const marketingProductGuides: GuidePage[] =
  buildAllMarketingProductGuides();
