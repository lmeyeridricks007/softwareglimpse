import type { GuidePage } from "@/domain";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { aiEvaluationGuide } from "./guides-ai-evaluation-guide";
import { aiPricingGuide } from "./guides-ai-pricing-guide";
import { aiRequirementsGuide } from "./guides-ai-requirements-guide";
import { howToChooseAiSoftwareGuide } from "./guides-how-to-choose-ai-software";
import { whatIsAiSoftwareGuide } from "./guides-what-is-ai-software";

/**
 * AI category educational guides (minimum supporting set).
 * Published and indexable (matches HR / PM / CS editorial gate).
 */
export const aiCategoryGuides: GuidePage[] = [
  whatIsAiSoftwareGuide,
  howToChooseAiSoftwareGuide,
  aiPricingGuide,
  aiRequirementsGuide,
  aiEvaluationGuide,
  ...teachingExpansionFor("ai"),
];
