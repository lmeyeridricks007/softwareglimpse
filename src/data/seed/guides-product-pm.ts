import type { GuidePage } from "@/domain";
import { buildAllPmProductGuides } from "@/services/product-guides/build";

/**
 * Product-scoped project-management guides (setup, implementation, migration,
 * plans, worth-it) for primary work-management products. Adjacent specialists
 * (Foxit, Getscreen.me, WebCatalog, Office Timeline) stay on category guides.
 */
export const pmProductGuides: GuidePage[] = buildAllPmProductGuides();
