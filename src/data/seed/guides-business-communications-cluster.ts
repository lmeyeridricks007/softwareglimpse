import type { GuidePage } from "@/domain";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { businessCommunicationsEvaluationGuide } from "./guides-business-communications-evaluation-guide";
import { businessCommunicationsPricingGuide } from "./guides-business-communications-pricing-guide";
import { businessCommunicationsRequirementsGuide } from "./guides-business-communications-requirements-guide";
import { howToChooseBusinessCommunicationsSoftwareGuide } from "./guides-how-to-choose-business-communications-software";
import { whatIsBusinessCommunicationsSoftwareGuide } from "./guides-what-is-business-communications-software";

/**
 * Business communications category educational guides (minimum supporting set).
 * Published and indexable (editorial gate cleared).
 */
export const businessCommunicationsCategoryGuides: GuidePage[] = [
  whatIsBusinessCommunicationsSoftwareGuide,
  howToChooseBusinessCommunicationsSoftwareGuide,
  businessCommunicationsPricingGuide,
  businessCommunicationsRequirementsGuide,
  businessCommunicationsEvaluationGuide,
  ...teachingExpansionFor("business-communications"),
];
