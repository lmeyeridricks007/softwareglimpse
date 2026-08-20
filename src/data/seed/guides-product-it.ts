import type { GuidePage } from "@/domain";
import { buildAllItProductGuides } from "@/services/product-guides/build";

/**
 * Product-scoped IT & development guides (implementation, migration, setup,
 * plans, worth-it) for primary ITSM, observability, source-control, hosting,
 * and web-data products.
 */
export const itProductGuides: GuidePage[] = buildAllItProductGuides();
