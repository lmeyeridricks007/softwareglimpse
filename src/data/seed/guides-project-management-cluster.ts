import type { GuidePage } from "@/domain";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { projectManagementEvaluationGuide } from "./guides-project-management-evaluation-guide";
import { projectManagementPricingGuide } from "./guides-project-management-pricing-guide";
import { projectManagementRequirementsGuide } from "./guides-project-management-requirements-guide";
import { howToChooseProjectManagementSoftwareGuide } from "./guides-how-to-choose-project-management-software";
import { whatIsProjectManagementSoftwareGuide } from "./guides-what-is-project-management-software";

/**
 * Project management category educational guides (minimum supporting set).
 * Published and indexable (matches BC editorial gate cleared).
 */
export const projectManagementCategoryGuides: GuidePage[] = [
  whatIsProjectManagementSoftwareGuide,
  howToChooseProjectManagementSoftwareGuide,
  projectManagementPricingGuide,
  projectManagementRequirementsGuide,
  projectManagementEvaluationGuide,
  ...teachingExpansionFor("project-management"),
];
