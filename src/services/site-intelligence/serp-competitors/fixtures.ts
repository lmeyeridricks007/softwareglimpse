import type { SerpOrganicResult, SerpQueryResult } from "./types";
import { extractDomain } from "./classify-domain";

/**
 * Deterministic fixture SERPs for tests — synthetic domains, not live claims.
 */
export const SERP_COMPETITOR_FIXTURES: Record<string, SerpQueryResult> = {
  "best crm software": {
    query: "best crm software",
    searchedAt: "2026-08-15T00:00:00.000Z",
    provider: "fixture",
    results: [
      row(1, "https://www.g2.com/categories/crm", "Best CRM Software - G2"),
      row(2, "https://www.pcmag.com/picks/the-best-crm-software", "Best CRM - PCMag"),
      row(3, "https://www.forbes.com/advisor/business/software/best-crm-software/", "Best CRM - Forbes Advisor"),
      row(4, "https://zapier.com/blog/best-crm-app/", "Best CRM apps - Zapier"),
      row(5, "https://www.techradar.com/best/best-crm", "Best CRM - TechRadar"),
      row(6, "https://www.hubspot.com/products/crm", "HubSpot CRM"),
    ],
    serpFeatures: ["people-also-ask"],
  },
  "crm migration": {
    query: "crm migration",
    searchedAt: "2026-08-15T00:00:00.000Z",
    provider: "fixture",
    results: [
      row(1, "https://www.hubspot.com/products/crm/migration", "CRM Migration - HubSpot"),
      row(2, "https://www.salesforce.com/products/migration/", "Migrate to Salesforce"),
      row(3, "https://www.deloitte.com/crm-migration-checklist", "CRM migration checklist - Deloitte"),
      row(4, "https://blog.hubspot.com/sales/crm-migration", "How to migrate CRM - HubSpot Blog"),
      row(5, "https://www.reddit.com/r/CRM/comments/migration", "CRM migration tips - Reddit"),
    ],
  },
  "hubspot vs pipedrive": {
    query: "hubspot vs pipedrive",
    searchedAt: "2026-08-15T00:00:00.000Z",
    provider: "fixture",
    results: [
      row(1, "https://www.g2.com/compare/hubspot-vs-pipedrive", "HubSpot vs Pipedrive - G2"),
      row(2, "https://zapier.com/blog/hubspot-vs-pipedrive/", "HubSpot vs Pipedrive - Zapier"),
      row(3, "https://www.pcmag.com/comparisons/hubspot-vs-pipedrive", "HubSpot vs Pipedrive - PCMag"),
      row(4, "https://www.pipedrive.com/en/blog/hubspot-vs-pipedrive", "HubSpot vs Pipedrive - Pipedrive"),
    ],
  },
  "crm evaluation checklist": {
    query: "crm evaluation checklist",
    searchedAt: "2026-08-15T00:00:00.000Z",
    provider: "fixture",
    results: [
      row(1, "https://blog.hubspot.com/sales/crm-evaluation-checklist", "CRM evaluation checklist - HubSpot"),
      row(2, "https://www.selecthub.com/crm-software/crm-checklist/", "CRM checklist - SelectHub"),
      row(3, "https://www.gartner.com/crm-evaluation", "CRM evaluation - Gartner"),
    ],
  },
};

function row(rank: number, url: string, title: string): SerpOrganicResult {
  return {
    rank,
    domain: extractDomain(url),
    url,
    title,
    snippet: title,
    resultType: "organic",
  };
}
