/**
 * High-priority SoftwareGlimpse pages ↔ known competing URLs for link-gap analysis.
 * Competitor URLs are curated seeds — not scraped rankings.
 * Backlink presence is measured only from imported exports.
 */
import type { CompetitorPagePair } from "@/services/seo/link-opportunity/types";

export const DIGITAL_PR_COMPETITOR_PAIRS: CompetitorPagePair[] = [
  {
    softwareGlimpsePath: "/research/crm-pricing/",
    softwareGlimpseTitle: "CRM Pricing Statistics & Benchmarks 2026",
    theme: "crm-pricing-statistics",
    competitorUrls: [
      "https://www.g2.com/categories/crm",
      "https://www.capterra.com/customer-relationship-management-software/",
      "https://www.forbes.com/advisor/business/software/best-crm-software/",
    ],
  },
  {
    softwareGlimpsePath: "/research/crm-pricing-history/",
    softwareGlimpseTitle: "CRM starting price history",
    theme: "crm-price-history",
    competitorUrls: [
      "https://www.g2.com/categories/crm",
      "https://www.saasworthy.com/list/crm-software",
    ],
  },
  {
    softwareGlimpsePath: "/tools/crm-finder/",
    softwareGlimpseTitle: "CRM Finder",
    theme: "crm-software-finder",
    competitorUrls: [
      "https://www.g2.com/categories/crm",
      "https://www.capterra.com/customer-relationship-management-software/",
      "https://www.softwareadvice.com/crm/",
    ],
  },
  {
    softwareGlimpsePath: "/tools/software-finder/",
    softwareGlimpseTitle: "Software Finder",
    theme: "software-finder",
    competitorUrls: [
      "https://www.g2.com/",
      "https://www.capterra.com/",
    ],
  },
  {
    softwareGlimpsePath: "/tools/crm-cost-calculator/",
    softwareGlimpseTitle: "CRM Cost Calculator",
    theme: "crm-cost-calculator",
    competitorUrls: [
      "https://www.hubspot.com/crm/calculator",
      "https://www.g2.com/categories/crm",
    ],
  },
  {
    softwareGlimpsePath: "/best/crm-software/",
    softwareGlimpseTitle: "Best CRM software",
    theme: "best-crm",
    competitorUrls: [
      "https://www.forbes.com/advisor/business/software/best-crm-software/",
      "https://www.pcmag.com/picks/the-best-crm-software",
      "https://www.g2.com/best-software-companies/crm",
    ],
  },
  {
    softwareGlimpsePath: "/company/editorial-methodology/",
    softwareGlimpseTitle: "Editorial methodology",
    theme: "review-methodology",
    competitorUrls: [
      "https://www.g2.com/methodology",
      "https://www.capterra.com/methodology/",
    ],
  },
  {
    softwareGlimpsePath: "/categories/crm/",
    softwareGlimpseTitle: "CRM software category",
    theme: "crm-category-hub",
    competitorUrls: [
      "https://www.g2.com/categories/crm",
      "https://www.capterra.com/customer-relationship-management-software/",
    ],
  },
  {
    softwareGlimpsePath: "/guides/how-to-choose-crm/",
    softwareGlimpseTitle: "How to choose a CRM",
    theme: "crm-decision-guide",
    competitorUrls: [
      "https://www.forbes.com/advisor/business/software/best-crm-software/",
      "https://www.pcmag.com/picks/the-best-crm-software",
    ],
  },
  {
    softwareGlimpsePath: "/guides/what-is-crm/",
    softwareGlimpseTitle: "What is CRM?",
    theme: "crm-category-definition",
    competitorUrls: [
      "https://www.salesforce.com/crm/what-is-crm/",
      "https://www.hubspot.com/products/crm",
    ],
  },
  {
    softwareGlimpsePath: "/guides/how-to-choose-sales-intelligence/",
    softwareGlimpseTitle: "How to choose sales intelligence",
    theme: "si-decision-guide",
    competitorUrls: [
      "https://www.g2.com/categories/sales-intelligence",
      "https://www.capterra.com/sales-intelligence-software/",
    ],
  },
  {
    softwareGlimpsePath: "/best/email-marketing-software/",
    softwareGlimpseTitle: "Best email marketing software",
    theme: "best-email-marketing",
    competitorUrls: [
      "https://www.forbes.com/advisor/business/software/best-email-marketing-software/",
      "https://www.g2.com/categories/email-marketing",
    ],
  },
];
