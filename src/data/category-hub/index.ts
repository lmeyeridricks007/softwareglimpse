import type { CategoryHubProfile } from "@/domain";
import { buildCrmCategoryHubProfile } from "./crm";
import { buildCustomerServiceCategoryHubProfile } from "./customer-service";
import { buildAccountingFinanceCategoryHubProfile } from "./accounting-finance";
import { buildSocialMediaMarketingCategoryHubProfile } from "./social-media-marketing";
import { buildWebinarVirtualEventsCategoryHubProfile } from "./webinar-virtual-events";
import { buildLmsCourseCreationCategoryHubProfile } from "./lms-course-creation";
import { buildWebsiteDigitalPresenceCategoryHubProfile } from "./website-digital-presence";
import { buildAnalyticsBiCategoryHubProfile } from "./analytics-bi";
import { buildFieldServiceOperationsCategoryHubProfile } from "./field-service-operations";
import { buildReputationReviewsCategoryHubProfile } from "./reputation-reviews";
import { buildAiWritingCategoryHubProfile } from "./ai-writing";
import { buildAiWebsiteBuilderCategoryHubProfile } from "./ai-website-builder";
import { buildVoipBusinessPhoneCategoryHubProfile } from "./voip-business-phone";
import { buildLiveChatCategoryHubProfile } from "./live-chat";
import { buildHelpdeskTicketingCategoryHubProfile } from "./helpdesk-ticketing";
import { buildDropshippingPodCategoryHubProfile } from "./dropshipping-pod";
import { buildFulfillmentShippingCategoryHubProfile } from "./fulfillment-shipping";
import { buildAtsRecruitingCategoryHubProfile } from "./ats-recruiting";
import { buildTimeAttendanceCategoryHubProfile } from "./time-attendance";
import { buildWebHostingCategoryHubProfile } from "./web-hosting";
import { buildItsmCategoryHubProfile } from "./itsm";
import { buildSocialMediaManagementCategoryHubProfile } from "./social-media-management";
import { buildLandingPagesCroCategoryHubProfile } from "./landing-pages-cro";
import { buildPpcAdvertisingCategoryHubProfile } from "./ppc-advertising";
import { buildEcommerceCategoryHubProfile } from "./ecommerce";
import { buildHrCategoryHubProfile } from "./hr";

const PROFILES: Record<string, () => CategoryHubProfile> = {
  crm: buildCrmCategoryHubProfile,
  hr: buildHrCategoryHubProfile,
  ecommerce: buildEcommerceCategoryHubProfile,
  "customer-service": buildCustomerServiceCategoryHubProfile,
  "accounting-finance": buildAccountingFinanceCategoryHubProfile,
  "social-media-marketing": buildSocialMediaMarketingCategoryHubProfile,
  "webinar-virtual-events": buildWebinarVirtualEventsCategoryHubProfile,
  "lms-course-creation": buildLmsCourseCreationCategoryHubProfile,
  "website-digital-presence": buildWebsiteDigitalPresenceCategoryHubProfile,
  "analytics-bi": buildAnalyticsBiCategoryHubProfile,
  "field-service-operations": buildFieldServiceOperationsCategoryHubProfile,
  "reputation-reviews": buildReputationReviewsCategoryHubProfile,
  "ai-writing": buildAiWritingCategoryHubProfile,
  "ai-website-builder": buildAiWebsiteBuilderCategoryHubProfile,
  "voip-business-phone": buildVoipBusinessPhoneCategoryHubProfile,
  "live-chat": buildLiveChatCategoryHubProfile,
  "helpdesk-ticketing": buildHelpdeskTicketingCategoryHubProfile,
  "dropshipping-pod": buildDropshippingPodCategoryHubProfile,
  "fulfillment-shipping": buildFulfillmentShippingCategoryHubProfile,
  "ats-recruiting": buildAtsRecruitingCategoryHubProfile,
  "time-attendance": buildTimeAttendanceCategoryHubProfile,
  "web-hosting": buildWebHostingCategoryHubProfile,
  itsm: buildItsmCategoryHubProfile,
  "social-media-management": buildSocialMediaManagementCategoryHubProfile,
  "landing-pages-cro": buildLandingPagesCroCategoryHubProfile,
  "ppc-advertising": buildPpcAdvertisingCategoryHubProfile,
};

export function getCategoryHubProfile(
  categorySlug: string,
): CategoryHubProfile | null {
  const build = PROFILES[categorySlug];
  return build ? build() : null;
}

export function listCategoryHubProfiles(): CategoryHubProfile[] {
  return Object.keys(PROFILES).map((slug) => PROFILES[slug]!());
}

export {
  buildCrmCategoryHubProfile,
  buildHrCategoryHubProfile,
  buildEcommerceCategoryHubProfile,
  buildCustomerServiceCategoryHubProfile,
  buildAccountingFinanceCategoryHubProfile,
  buildSocialMediaMarketingCategoryHubProfile,
  buildWebinarVirtualEventsCategoryHubProfile,
  buildLmsCourseCreationCategoryHubProfile,
  buildWebsiteDigitalPresenceCategoryHubProfile,
  buildAnalyticsBiCategoryHubProfile,
  buildFieldServiceOperationsCategoryHubProfile,
  buildReputationReviewsCategoryHubProfile,
  buildAiWritingCategoryHubProfile,
  buildAiWebsiteBuilderCategoryHubProfile,
  buildVoipBusinessPhoneCategoryHubProfile,
  buildLiveChatCategoryHubProfile,
  buildHelpdeskTicketingCategoryHubProfile,
  buildDropshippingPodCategoryHubProfile,
  buildFulfillmentShippingCategoryHubProfile,
  buildAtsRecruitingCategoryHubProfile,
  buildTimeAttendanceCategoryHubProfile,
  buildWebHostingCategoryHubProfile,
  buildItsmCategoryHubProfile,
  buildSocialMediaManagementCategoryHubProfile,
  buildLandingPagesCroCategoryHubProfile,
  buildPpcAdvertisingCategoryHubProfile,
};
