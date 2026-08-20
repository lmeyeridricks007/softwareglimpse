import type { GuidePage } from "@/domain";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { marketingSoftwareEvaluationGuide } from "./guides-marketing-software-evaluation-guide";
import { marketingSoftwarePricingGuide } from "./guides-marketing-software-pricing-guide";
import { marketingSoftwareRequirementsGuide } from "./guides-marketing-software-requirements-guide";
import { howToChooseMarketingSoftwareGuide } from "./guides-how-to-choose-marketing-software";
import { whatIsMarketingSoftwareGuide } from "./guides-what-is-marketing-software";

/**
 * Marketing category educational guides (minimum supporting set).
 * Published and indexable (matches HR / PM / EM editorial gate).
 */
export const marketingCategoryGuides: GuidePage[] = [
  whatIsMarketingSoftwareGuide,
  howToChooseMarketingSoftwareGuide,
  marketingSoftwarePricingGuide,
  marketingSoftwareRequirementsGuide,
  marketingSoftwareEvaluationGuide,
  ...teachingExpansionFor("marketing"),
];
