import type { GuidePage } from "@/domain";
import { buildAllHrProductGuides } from "@/services/product-guides/build";

/**
 * Product-scoped HR guides (implementation, migration, setup, plans, worth-it)
 * for Wave-1 primary products: Breezy HR, Connecteam, Jibble, Trainual.
 * Published and indexable (editorial gate cleared with category guides).
 */
export const hrProductGuides: GuidePage[] = buildAllHrProductGuides();
