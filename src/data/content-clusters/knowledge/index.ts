import type { CategoryKnowledgeMap } from "@/domain";
import { crmKnowledgeMap } from "./crm";
import { emailMarketingKnowledgeMap } from "./email-marketing";
import { salesIntelligenceKnowledgeMap } from "./sales-intelligence";
import { businessCommunicationsKnowledgeMap } from "./business-communications";
import { hrKnowledgeMap } from "./hr";
import { projectManagementKnowledgeMap } from "./project-management";
import { marketingKnowledgeMap } from "./marketing";
import { customerServiceKnowledgeMap } from "./customer-service";
import { aiKnowledgeMap } from "./ai";
import { itDevelopmentKnowledgeMap } from "./it-development";
import { ecommerceKnowledgeMap } from "./ecommerce";

const MAPS: Record<string, CategoryKnowledgeMap> = {
  crm: crmKnowledgeMap,
  "email-marketing": emailMarketingKnowledgeMap,
  "sales-intelligence": salesIntelligenceKnowledgeMap,
  "business-communications": businessCommunicationsKnowledgeMap,
  hr: hrKnowledgeMap,
  "project-management": projectManagementKnowledgeMap,
  marketing: marketingKnowledgeMap,
  "customer-service": customerServiceKnowledgeMap,
  ai: aiKnowledgeMap,
  "it-development": itDevelopmentKnowledgeMap,
  ecommerce: ecommerceKnowledgeMap,
};

export function getCategoryKnowledgeMap(
  categorySlug: string,
): CategoryKnowledgeMap | undefined {
  return MAPS[categorySlug];
}

export function listCategoryKnowledgeMaps(): CategoryKnowledgeMap[] {
  return Object.values(MAPS);
}
