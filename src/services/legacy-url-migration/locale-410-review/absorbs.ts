import type { TopicAbsorb } from "./types";

/**
 * Hand-verified EN topics whose modern English page can legitimately absorb
 * the legacy locale URL (hreflang sibling). Used for cutover 301 repairs.
 *
 * Do NOT add soft hub dumps or off-strategy SEO/AI tooling here.
 */
export const CURATED_TOPIC_ABSORBS: Record<string, TopicAbsorb> = {
  "/my-story/": {
    destination: "/company/my-story/",
    reason: "Legacy founder story → company my-story page",
  },
  "/terms-and-conditions/": {
    destination: "/legal/terms/",
    reason: "Legacy terms & conditions → legal terms",
  },
  "/introduction-to-pipedrive/": {
    destination: "/software/pipedrive/",
    reason: "Product introduction article → Pipedrive catalogue page",
  },
  "/introduction-to-salesforce/": {
    destination: "/software/salesforce/",
    reason: "Product introduction article → Salesforce catalogue page",
  },
  "/introduction-to-freshsales/": {
    destination: "/software/freshsales/",
    reason: "Product introduction article → Freshsales catalogue page",
  },
  "/introduction-to-zoho/": {
    destination: "/software/zoho-crm/",
    reason: "Product introduction article → Zoho CRM catalogue page",
  },
  "/zoho-one-operating-system/": {
    destination: "/software/zoho-crm/",
    reason: "Zoho One suite article → Zoho CRM catalogue page (in-suite primary)",
  },
  /** Gap recovery 2026-09-06 — MioCommerce onboarded */
  "/miocommerce-review/": {
    destination: "/software/miocommerce/",
    reason: "Legacy MioCommerce review → catalogue software page",
  },
  /** Gap recovery — Live Chat resolved as LiveChat brand */
  "/tidio-vs-live-chat/": {
    destination: "/compare/livechat-vs-tidio/",
    reason: "Legacy Tidio vs Live Chat → livechat-vs-tidio compare",
  },
  /** Gap recovery — Crisp onboarded + CS pair */
  "/tidio-vs-crisp/": {
    destination: "/compare/crisp-vs-tidio/",
    reason: "Legacy Tidio vs Crisp → crisp-vs-tidio compare",
  },
};

/**
 * Hand-verified retires: remain Proxy 410 (no English page, no homepage dump).
 * Used to close EXISTING_ESTATE_GAP_REVIEW without fabricating destinations.
 */
export const CURATED_TOPIC_RETIRES: Record<string, { reason: string }> = {
  "/content-at-scale-review/": {
    reason:
      "Content at Scale rebranded/absorbed into BrandWell; off catalogue strategy; 0 GSC — keep 410",
  },
};

/**
 * Closed gap-review decisions (archive). Open queue must stay empty once applied.
 * Regenerating reports should preserve this history — not wipe it.
 */
export const RESOLVED_GAP_DECISIONS: Array<{
  enPath: string;
  decision: "RECOVERED" | "TRUE_OBSOLETE";
  canonical: string | null;
  entity: string;
  quality: string;
  redirects: string;
  indexability: string;
  reason: string;
}> = [
  {
    enPath: "/content-at-scale-review/",
    decision: "TRUE_OBSOLETE",
    canonical: null,
    entity: "BrandWell rebrand; no catalogue fit",
    quality: "n/a",
    redirects: "remain 410",
    indexability: "n/a",
    reason:
      "0 GSC; do not create a page solely for URL recovery",
  },
  {
    enPath: "/miocommerce-review/",
    decision: "RECOVERED",
    canonical: "/software/miocommerce/",
    entity: "MioCommerce (field-service-operations)",
    quality: "INDEXABLE",
    redirects: "EN + 7 locales 301",
    indexability: "INDEXABLE",
    reason: "Active SaaS; modern /software/ canonical",
  },
  {
    enPath: "/tidio-vs-live-chat/",
    decision: "RECOVERED",
    canonical: "/compare/livechat-vs-tidio/",
    entity: "tidio + livechat",
    quality: "INDEXABLE",
    redirects: "EN + 7 locales 301",
    indexability: "INDEXABLE",
    reason: "Existing CS pair; Live Chat ≠ generic",
  },
  {
    enPath: "/tidio-vs-crisp/",
    decision: "RECOVERED",
    canonical: "/compare/crisp-vs-tidio/",
    entity: "crisp + tidio",
    quality: "INDEXABLE",
    redirects: "EN + 7 locales 301",
    indexability: "INDEXABLE",
    reason: "Crisp onboarded; overlapping live-chat thesis",
  },
];

/** Strategy-retired SEO / writing / chat tooling — keep 410. */
export const STRATEGY_RETIRE_SLUG_RE =
  /(seo|semrush|ahrefs|moz|spyfu|rankmath|surfer|seopress|whitespark|brightlocal|diy-seo|chatgpt|grammarly|jasper|quillbot|pictory|tweet|script-writing|bard|llama|copilot|writesonic|hemingway|spinbot|writefull|languagetool|whitesmoke|outwrite|ginger|turnitin|chatsonic|caktus|lamda|stockfish|muse|clearscope|prowriting|ai-tweet|ai-seo|adriel|content-at-scale|brandwell)/i;

/** Taxonomic / infrastructure intent kinds. */
export const TAXONOMY_INTENT_KINDS = new Set([
  "tag",
  "author",
  "category",
  "home",
  "feed",
  "pagination",
  "attachment",
  "query",
]);
