import type { GuidePage } from "@/domain";
import { commonCrmMistakesGuide } from "./guides-common-crm-mistakes";
import { crmBenefitsGuide } from "./guides-crm-benefits";
import { crmAdoptionGuide } from "./guides-crm-adoption";
import { crmAuditGuide } from "./guides-crm-audit";
import { crmAutomationBestPracticesGuide } from "./guides-crm-automation-best-practices";
import { crmBusinessCaseGuide } from "./guides-crm-business-case";
import { crmChangeManagementGuide } from "./guides-crm-change-management";
import { crmDataCleaningGuide } from "./guides-crm-data-cleaning";
import { crmDataHygieneGuide } from "./guides-crm-data-hygiene";
import { crmDataMigrationGuide } from "./guides-crm-data-migration";
import { crmDataQualityGuide } from "./guides-crm-data-quality";
import { crmDemoGuide } from "./guides-crm-demo-guide";
import { crmEvaluationGuide } from "./guides-crm-evaluation-guide";
import { crmExamplesGuide } from "./guides-crm-examples";
import { crmFieldMappingGuide } from "./guides-crm-field-mapping";
import { crmGlossaryGuide } from "./guides-crm-glossary";
import { crmGoLiveGuide } from "./guides-crm-go-live";
import { crmGovernanceGuide } from "./guides-crm-governance";
import { crmGovernanceOperationsGuide } from "./guides-crm-governance-operations";
import { crmHealthCheckGuide } from "./guides-crm-health-check";
import { crmImplementationCostGuide } from "./guides-crm-implementation-cost";
import { crmImplementationGuide } from "./guides-crm-implementation";
import { crmImplementationKpisGuide } from "./guides-crm-implementation-kpis";
import { crmImplementationMistakesGuide } from "./guides-crm-implementation-mistakes";
import { crmImplementationPlanningGuide } from "./guides-crm-implementation-planning";
import { crmImplementationRolesGuide } from "./guides-crm-implementation-roles";
import { crmImplementationTimelineGuide } from "./guides-crm-implementation-timeline";
import { crmPricingGuide } from "./guides-crm-pricing-guide";
import { crmReportingBestPracticesGuide } from "./guides-crm-reporting-best-practices";
import { crmRequirementsGuide } from "./guides-crm-requirements-guide";
import { crmRfpGuide } from "./guides-crm-rfp-guide";
import { crmRoiGuide } from "./guides-crm-roi-guide";
import { crmSelectionMistakesGuide } from "./guides-crm-selection-mistakes";
import { crmSelectionProcessGuide } from "./guides-crm-selection-process";
import { crmTestingGuide } from "./guides-crm-testing";
import { crmTotalCostGuide } from "./guides-crm-total-cost-guide";
import { crmTrainingGuide } from "./guides-crm-training";
import { crmTrialEvaluationGuide } from "./guides-crm-trial-evaluation";
import { crmVendorEvaluationGuide } from "./guides-crm-vendor-evaluation";
import { crmVendorMigrationGuide } from "./guides-crm-vendor-migration";
import { crmVendorQuestionsGuide } from "./guides-crm-vendor-questions";
import { crmVsCdpGuide } from "./guides-crm-vs-cdp";
import { crmVsCustomerServiceGuide } from "./guides-crm-vs-customer-service";
import { crmVsErpGuide } from "./guides-crm-vs-erp";
import { crmVsMarketingAutomationGuide } from "./guides-crm-vs-marketing-automation";
import { crmVsSpreadsheetGuide } from "./guides-crm-vs-spreadsheet";
import { doINeedACrmGuide } from "./guides-do-i-need-a-crm";
import { financialServicesCrmGuide } from "./guides-financial-services-crm";
import { financialServicesCrmChecklistGuide } from "./guides-financial-services-crm-checklist";
import { financialServicesCrmFeaturesGuide } from "./guides-financial-services-crm-features";
import { financialServicesCrmImplementationGuide } from "./guides-financial-services-crm-implementation";
import { financialServicesCrmMigrationGuide } from "./guides-financial-services-crm-migration";
import { financialServicesCrmRequirementsGuide } from "./guides-financial-services-crm-requirements";
import { financialServicesCrmSecurityGuide } from "./guides-financial-services-crm-security";
import { howCrmWorksGuide } from "./guides-how-crm-works";
import { howToChooseCrmGuide } from "./guides-how-to-choose-crm";
import { improveCrmAdoptionGuide } from "./guides-improve-crm-adoption";
import { typesOfCrmGuide } from "./guides-types-of-crm";
import { whatIsCrmGuide } from "./guides-what-is-crm";
import { whenToAdoptCrmGuide } from "./guides-when-to-adopt-crm";
import { whenToReplaceCrmGuide } from "./guides-when-to-replace-crm";
import { businessCommunicationsCategoryGuides } from "./guides-business-communications-cluster";
import { emailMarketingCategoryGuides } from "./guides-email-marketing-cluster";
import { salesIntelligenceCategoryGuides } from "./guides-sales-intelligence-cluster";
import { projectManagementCategoryGuides } from "./guides-project-management-cluster";
import { hrCategoryGuides } from "./guides-hr-cluster";
import { ecommerceCategoryGuides } from "./guides-ecommerce-cluster";
import { csCategoryGuides } from "./guides-cs-cluster";
import { csProductGuides } from "./guides-product-cs";
import { aiCategoryGuides } from "./guides-ai-cluster";
import { itDevelopmentCategoryGuides } from "./guides-it-development-cluster";
import { marketingCategoryGuides } from "./guides-marketing-cluster";

/**
 * Educational guides (supporting articles). Published and indexable.
 *
 * Product-scoped packs are loaded on demand from the guides repository — do not
 * import `guides-product-*` here or every guide page regenerates all product packs.
 *
 * All guides use `softwareglimpse-guide-template-v1` blocks + GuideBlocksRenderer.
 */
export const guidesSeed: GuidePage[] = [
  whatIsCrmGuide,
  howCrmWorksGuide,
  typesOfCrmGuide,
  crmBenefitsGuide,
  crmGlossaryGuide,
  crmExamplesGuide,
  crmVsSpreadsheetGuide,
  crmVsErpGuide,
  crmVsMarketingAutomationGuide,
  crmVsCustomerServiceGuide,
  crmVsCdpGuide,
  doINeedACrmGuide,
  whenToAdoptCrmGuide,
  commonCrmMistakesGuide,
  howToChooseCrmGuide,
  crmRequirementsGuide,
  crmEvaluationGuide,
  crmSelectionProcessGuide,
  crmVendorEvaluationGuide,
  crmRfpGuide,
  crmDemoGuide,
  crmTrialEvaluationGuide,
  crmPricingGuide,
  crmTotalCostGuide,
  crmRoiGuide,
  crmBusinessCaseGuide,
  crmVendorQuestionsGuide,
  crmSelectionMistakesGuide,
  crmImplementationGuide,
  crmImplementationPlanningGuide,
  crmImplementationTimelineGuide,
  crmImplementationCostGuide,
  crmImplementationRolesGuide,
  crmImplementationMistakesGuide,
  crmDataMigrationGuide,
  crmDataCleaningGuide,
  crmFieldMappingGuide,
  crmTestingGuide,
  crmGoLiveGuide,
  crmTrainingGuide,
  crmAdoptionGuide,
  crmGovernanceGuide,
  crmDataQualityGuide,
  crmChangeManagementGuide,
  crmImplementationKpisGuide,
  improveCrmAdoptionGuide,
  crmDataHygieneGuide,
  crmReportingBestPracticesGuide,
  crmAutomationBestPracticesGuide,
  crmGovernanceOperationsGuide,
  crmAuditGuide,
  crmHealthCheckGuide,
  whenToReplaceCrmGuide,
  crmVendorMigrationGuide,
  financialServicesCrmGuide,
  financialServicesCrmRequirementsGuide,
  financialServicesCrmFeaturesGuide,
  financialServicesCrmImplementationGuide,
  financialServicesCrmSecurityGuide,
  financialServicesCrmMigrationGuide,
  financialServicesCrmChecklistGuide,
  ...salesIntelligenceCategoryGuides,
  ...emailMarketingCategoryGuides,
  ...businessCommunicationsCategoryGuides,
  ...projectManagementCategoryGuides,
  ...hrCategoryGuides,
  ...ecommerceCategoryGuides,
  ...csCategoryGuides,
  ...csProductGuides,
  ...aiCategoryGuides,
  ...itDevelopmentCategoryGuides,
  ...marketingCategoryGuides,
];
