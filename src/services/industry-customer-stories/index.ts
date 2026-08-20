export type { IndustryCustomerStoryCard } from "./types";
export {
  VENDOR_CUSTOMER_STORY_LABEL,
  DEFAULT_CUSTOMER_STORY_LIMITATIONS,
  looksLikeVendorOutcomeClaim,
  sanitizeVendorCaseStudyClaim,
  isOfficialCustomerCaseStudyMedia,
} from "./types";
export {
  buildIndustryCustomerStoryCards,
  evaluateCustomerStoryPublicEligibility,
} from "./build-cards";
