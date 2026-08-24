/**
 * Lightweight chrome index for the site header/footer.
 *
 * Layout must not import best.ts / comparisons.ts — those seeds pull the full
 * catalogue and CRM comparison research. Keep this map in sync when adding a
 * published Best page or a new comparison category.
 *
 * Include every top-level category that has a Best page, plus nested
 * email-marketing (shown under Marketing in the Best Software menu).
 */
export const navBestSlugByCategory: Record<string, string> = {
  crm: "crm-software",
  "sales-intelligence": "sales-intelligence-software",
  "business-communications": "business-communications-software",
  "customer-service": "customer-service-software",
  marketing: "marketing-software",
  "email-marketing": "email-marketing-software",
  "project-management": "project-management-software",
  hr: "hr-software",
  ai: "ai-software",
  "it-development": "it-development-software",
  ecommerce: "ecommerce-software",
  "accounting-finance": "accounting-finance-software",
  "social-media-marketing": "social-media-marketing-software",
  "webinar-virtual-events": "webinar-virtual-events-software",
  "lms-course-creation": "lms-course-creation-software",
  "website-digital-presence": "website-digital-presence-software",
  "analytics-bi": "analytics-bi-software",
  "field-service-operations": "field-service-operations-software",
  "reputation-reviews": "reputation-reviews-software",
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
  "accounting-finance",
  "social-media-marketing",
  "webinar-virtual-events",
  "lms-course-creation",
  "website-digital-presence",
  "analytics-bi",
  "field-service-operations",
  "reputation-reviews",
]);
