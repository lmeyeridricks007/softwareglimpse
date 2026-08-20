export { resolveAffiliateLink } from "./resolve-affiliate-link";
export type { ResolvedAffiliateLink } from "./resolve-affiliate-link";
export {
  resolveCommercialCta,
  affiliateAffectedTags,
} from "./resolve-cta";
export type {
  ResolvedCommercialCta,
  ResolvedPromotionPresentation,
} from "./resolve-cta";
export {
  setAffiliateDestination,
  disableAffiliateDestination,
  addPromotion,
  disablePromotion,
  getProductAffiliateStatus,
  listAffiliateProductStatuses,
} from "./manage";
export {
  buildAffiliateCoverageReport,
  buildPromotionReport,
  buildCommercialOpportunityLines,
} from "./coverage";
export {
  planAffiliateImport,
  applyAffiliateImport,
  exportAffiliateSnapshot,
} from "./import-export";
export {
  validateAffiliateRepository,
  validatePromotionRepository,
} from "./validate";
export {
  derivePromotionEffectiveStatus,
  isPromotionPubliclyActive,
  selectPrimaryPromotion,
} from "./promotions";
export { validateAffiliateUrl, findRawAffiliateUrls } from "./url-validation";
export {
  resolveVisitCta,
  buildVisitCtaMap,
} from "./resolve-visit-cta";
export type { VisitCtaModel } from "./resolve-visit-cta";
export {
  CTA_FALLBACK_ORDER,
  CONTEXT_DESTINATION_PREFERENCE,
  INTENT_DESTINATION_MAP,
} from "./policy";
