export { withUtm, channelUtm, utmCampaignSlug } from "./utm";
export { campaignFromCrmPricingResearch } from "./sources/crm-pricing";
export { campaignsFromConfirmedPriceChanges } from "./sources/price-changes";
export { campaignsFromProductTesting } from "./sources/product-testing";
export { generateChannelDrafts, buildVisualSpecs } from "./drafts";
export {
  assembleSoftwareGlimpseWeekly,
  formatNewsletterMarkdown,
} from "./newsletter";
export {
  buildDistributionPack,
  type DistributionPack,
} from "./campaign";
export { runDistributionWorkflow } from "./run";
export type { RunDistributionOptions } from "./run";
export {
  loadDistributionTracking,
  upsertDistributionTracking,
  recordCampaignDraftTracking,
  attachMeasurement,
  getDistributionTrackingPath,
} from "./tracking";
