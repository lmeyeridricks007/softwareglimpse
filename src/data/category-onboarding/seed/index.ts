import type { CategoryDefinition } from "@/domain";
import { aiDefinition } from "./ai";
import { businessCommunicationsDefinition } from "./business-communications";
import { buildCrmCategoryDefinition } from "./crm";
import { customerServiceDefinition } from "./customer-service";
import { ecommerceDefinition } from "./ecommerce";
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
  "customer-service": customerServiceDefinition,
  "project-management": projectManagementDefinition,
  hr: hrDefinition,
  ecommerce: ecommerceDefinition,
  ai: aiDefinition,
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
