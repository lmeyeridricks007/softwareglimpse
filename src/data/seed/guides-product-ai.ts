import type { GuidePage } from "@/domain";
import { buildAllAiProductGuides } from "@/services/product-guides/build";

/**
 * Product-scoped AI guides (implementation, migration, setup, plans, worth-it)
 * for primary products. Niche catalogue (Wegic, AdCreative.ai, MindStudio)
 * stays on category guides.
 */
export const aiProductGuides: GuidePage[] = buildAllAiProductGuides();
