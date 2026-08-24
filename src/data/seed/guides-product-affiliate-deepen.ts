import { buildAllAffiliateDeepenWhatIsGuides } from "@/services/product-guides/affiliate-deepen";

/**
 * Tier 2 affiliate deepen — educational what-is guides for affiliate products
 * that already have 5-kind packs (worth-it lives in the pack).
 * AI-category deferrals: guides-product-ai-affiliate-deepen.ts (Tier 5, Nov 2026).
 * CRM deferrals (`keap`, `hubspot`): guides-product-crm-affiliate-deepen.ts (Tier 6, Dec 2026).
 * Ecommerce deferrals: guides-product-ecommerce-affiliate-deepen.ts (Tier 8, Dec 2026).
 * HR/ops deferrals: guides-product-hr-affiliate-deepen.ts (Tier 9, 15–30 Dec 2026).
 * IT/dev deferrals: guides-product-it-affiliate-deepen.ts (Tier 10, 1–10 Jan 2027).
 * Marketing deferrals: guides-product-marketing-affiliate-deepen.ts (Tier 11, 11–26 Jan 2027).
 * PM deferrals: guides-product-pm-affiliate-deepen.ts (Tier 12, 1–13 Feb 2027).
 */
export const affiliateDeepenProductGuides = buildAllAffiliateDeepenWhatIsGuides();
