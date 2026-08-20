import type { GuidePage } from "@/domain";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { hrEvaluationGuide } from "./guides-hr-evaluation-guide";
import { hrPricingGuide } from "./guides-hr-pricing-guide";
import { hrRequirementsGuide } from "./guides-hr-requirements-guide";
import { howToChooseHrSoftwareGuide } from "./guides-how-to-choose-hr-software";
import { whatIsHrSoftwareGuide } from "./guides-what-is-hr-software";

/**
 * HR category educational guides (minimum supporting set).
 * Published and indexable (matches PM / BC editorial gate).
 */
export const hrCategoryGuides: GuidePage[] = [
  whatIsHrSoftwareGuide,
  howToChooseHrSoftwareGuide,
  hrPricingGuide,
  hrRequirementsGuide,
  hrEvaluationGuide,
  ...teachingExpansionFor("hr"),
];
