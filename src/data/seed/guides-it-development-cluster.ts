import type { GuidePage } from "@/domain";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { itDevelopmentEvaluationGuide } from "./guides-it-development-evaluation-guide";
import { itDevelopmentPricingGuide } from "./guides-it-development-pricing-guide";
import { itDevelopmentRequirementsGuide } from "./guides-it-development-requirements-guide";
import { howToChooseItDevelopmentSoftwareGuide } from "./guides-how-to-choose-it-development-software";
import { whatIsItDevelopmentSoftwareGuide } from "./guides-what-is-it-development-software";

/**
 * IT & development category educational guides (minimum supporting set).
 * Published and indexable (matches HR / PM / CS editorial gate).
 */
export const itDevelopmentCategoryGuides: GuidePage[] = [
  whatIsItDevelopmentSoftwareGuide,
  howToChooseItDevelopmentSoftwareGuide,
  itDevelopmentPricingGuide,
  itDevelopmentRequirementsGuide,
  itDevelopmentEvaluationGuide,
  ...teachingExpansionFor("it-development"),
];
