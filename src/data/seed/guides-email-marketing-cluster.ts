import type { GuidePage } from "@/domain";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { emailMarketingEvaluationGuide } from "./guides-email-marketing-evaluation-guide";
import { emailMarketingPricingGuide } from "./guides-email-marketing-pricing-guide";
import { emailMarketingRequirementsGuide } from "./guides-email-marketing-requirements-guide";
import { howToChooseEmailMarketingGuide } from "./guides-how-to-choose-email-marketing";
import { whatIsEmailMarketingGuide } from "./guides-what-is-email-marketing";

/**
 * Email marketing category educational guides (minimum supporting set).
 * Published and indexable (editorial gate cleared).
 */
export const emailMarketingCategoryGuides: GuidePage[] = [
  whatIsEmailMarketingGuide,
  howToChooseEmailMarketingGuide,
  emailMarketingPricingGuide,
  emailMarketingRequirementsGuide,
  emailMarketingEvaluationGuide,
  ...teachingExpansionFor("email-marketing"),
];
