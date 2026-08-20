/**
 * Lightweight chrome index for the site header/footer.
 *
 * Layout must not import best.ts / comparisons.ts — those seeds pull the full
 * catalogue and CRM comparison research. Keep this map in sync when adding a
 * published Best page or a new comparison category.
 */
export const navBestSlugByCategory: Record<string, string> = {
  crm: "crm-software",
  "sales-intelligence": "sales-intelligence-software",
  "email-marketing": "email-marketing-software",
  marketing: "marketing-software",
  "business-communications": "business-communications-software",
  "customer-service": "customer-service-software",
  "project-management": "project-management-software",
  hr: "hr-software",
  ai: "ai-software",
  "it-development": "it-development-software",
  ecommerce: "ecommerce-software",
};

export const navComparisonCategorySlugs = new Set([
  "crm",
  "sales-intelligence",
  "email-marketing",
  "marketing",
  "business-communications",
  "customer-service",
  "project-management",
  "hr",
  "ai",
  "it-development",
  "ecommerce",
]);
