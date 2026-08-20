import type { GuidePage } from "@/domain";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { customerServiceEvaluationGuide } from "./guides-customer-service-evaluation-guide";
import { customerServicePricingGuide } from "./guides-customer-service-pricing-guide";
import { customerServiceRequirementsGuide } from "./guides-customer-service-requirements-guide";
import { howToChooseCustomerServiceSoftwareGuide } from "./guides-how-to-choose-customer-service-software";
import { whatIsCustomerServiceSoftwareGuide } from "./guides-what-is-customer-service-software";

/**
 * Customer-service category educational guides (minimum supporting set).
 * Published and indexable (matches HR / PM editorial gate).
 */
export const csCategoryGuides: GuidePage[] = [
  whatIsCustomerServiceSoftwareGuide,
  howToChooseCustomerServiceSoftwareGuide,
  customerServicePricingGuide,
  customerServiceRequirementsGuide,
  customerServiceEvaluationGuide,
  ...teachingExpansionFor("customer-service"),
];
