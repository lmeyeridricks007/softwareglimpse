import type { GuidePage } from "@/domain";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { ecommercePricingGuide } from "./guides-ecommerce-pricing-guide";
import { howToChooseEcommerceSoftwareGuide } from "./guides-how-to-choose-ecommerce-software";
import { whatIsEcommerceSoftwareGuide } from "./guides-what-is-ecommerce-software";

/** Ecommerce category educational guides (Wave-1 minimum set). */
export const ecommerceCategoryGuides: GuidePage[] = [
  whatIsEcommerceSoftwareGuide,
  howToChooseEcommerceSoftwareGuide,
  ecommercePricingGuide,
  ...teachingExpansionFor("ecommerce"),
];
