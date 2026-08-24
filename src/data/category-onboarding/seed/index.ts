import type { CategoryDefinition } from "@/domain";
import { aiDefinition } from "./ai";
import { businessCommunicationsDefinition } from "./business-communications";
import { buildCrmCategoryDefinition } from "./crm";
import { customerServiceDefinition } from "./customer-service";
import { ecommerceDefinition } from "./ecommerce";
import { accountingFinanceDefinition } from "./accounting-finance";
import { socialMediaMarketingDefinition } from "./social-media-marketing";
import { webinarVirtualEventsDefinition } from "./webinar-virtual-events";
import { lmsCourseCreationDefinition } from "./lms-course-creation";
import { websiteDigitalPresenceDefinition } from "./website-digital-presence";
import { analyticsBiDefinition } from "./analytics-bi";
import { fieldServiceOperationsDefinition } from "./field-service-operations";
import { reputationReviewsDefinition } from "./reputation-reviews";
import { aiWritingDefinition } from "./ai-writing";
import { aiWebsiteBuilderDefinition } from "./ai-website-builder";
import { voipBusinessPhoneDefinition } from "./voip-business-phone";
import { liveChatDefinition } from "./live-chat";
import { helpdeskTicketingDefinition } from "./helpdesk-ticketing";
import { dropshippingPodDefinition } from "./dropshipping-pod";
import { fulfillmentShippingDefinition } from "./fulfillment-shipping";
import { atsRecruitingDefinition } from "./ats-recruiting";
import { timeAttendanceDefinition } from "./time-attendance";
import { webHostingDefinition } from "./web-hosting";
import { itsmDefinition } from "./itsm";
import { socialMediaManagementDefinition } from "./social-media-management";
import { landingPagesCroDefinition } from "./landing-pages-cro";
import { ppcAdvertisingDefinition } from "./ppc-advertising";
import { emailMarketingDefinition } from "./email-marketing";
import { hrDefinition } from "./hr";
import { itDevelopmentDefinition } from "./it-development";
import { marketingDefinition } from "./marketing";
import { projectManagementDefinition } from "./project-management";
import { buildSalesIntelligenceCategoryDefinition } from "./sales-intelligence";

const DEFINITIONS: Record<string, CategoryDefinition> = {
  crm: buildCrmCategoryDefinition(),
  marketing: marketingDefinition,
  "email-marketing": emailMarketingDefinition,
  "sales-intelligence": buildSalesIntelligenceCategoryDefinition(),
  "business-communications": businessCommunicationsDefinition,
  "voip-business-phone": voipBusinessPhoneDefinition,
  "live-chat": liveChatDefinition,
  "helpdesk-ticketing": helpdeskTicketingDefinition,
  "dropshipping-pod": dropshippingPodDefinition,
  "fulfillment-shipping": fulfillmentShippingDefinition,
  "ats-recruiting": atsRecruitingDefinition,
  "time-attendance": timeAttendanceDefinition,
  "web-hosting": webHostingDefinition,
  itsm: itsmDefinition,
  "social-media-management": socialMediaManagementDefinition,
  "landing-pages-cro": landingPagesCroDefinition,
  "ppc-advertising": ppcAdvertisingDefinition,
  "customer-service": customerServiceDefinition,
  "project-management": projectManagementDefinition,
  hr: hrDefinition,
  ecommerce: ecommerceDefinition,
  "accounting-finance": accountingFinanceDefinition,
  "social-media-marketing": socialMediaMarketingDefinition,
  "webinar-virtual-events": webinarVirtualEventsDefinition,
  "lms-course-creation": lmsCourseCreationDefinition,
  "website-digital-presence": websiteDigitalPresenceDefinition,
  "analytics-bi": analyticsBiDefinition,
  "field-service-operations": fieldServiceOperationsDefinition,
  "reputation-reviews": reputationReviewsDefinition,
  ai: aiDefinition,
  "ai-writing": aiWritingDefinition,
  "ai-website-builder": aiWebsiteBuilderDefinition,
  "it-development": itDevelopmentDefinition,
};

export function listCategoryDefinitionSeeds(): CategoryDefinition[] {
  return Object.values(DEFINITIONS);
}

export function getCategoryDefinitionSeed(
  slug: string,
): CategoryDefinition | undefined {
  return DEFINITIONS[slug];
}

export function findCategoryDefinitionSeedByName(
  name: string,
): CategoryDefinition | undefined {
  const key = name.trim().toLowerCase();
  return listCategoryDefinitionSeeds().find(
    (d) =>
      d.slug === key ||
      d.name.toLowerCase() === key ||
      d.aliases.some((a) => a.toLowerCase() === key) ||
      d.slug.replace(/-/g, " ") === key,
  );
}
