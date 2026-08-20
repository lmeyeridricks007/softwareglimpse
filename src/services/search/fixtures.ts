import type { SearchResultType } from "./types";

export type SearchRelevanceFixture = {
  name: string;
  query: string;
  expectType?: SearchResultType;
  expectTitleIncludes?: string;
  expectSlug?: string;
  expectZero?: boolean;
};

/**
 * Explicit ranking assertions for SearchQualityAgent + vitest.
 */
export const SEARCH_RELEVANCE_FIXTURES: SearchRelevanceFixture[] = [
  {
    name: "exact product entity",
    query: "pipedrive",
    expectType: "SOFTWARE",
    expectSlug: "pipedrive",
  },
  {
    name: "product casing",
    query: "Pipedrive",
    expectType: "SOFTWARE",
    expectSlug: "pipedrive",
  },
  {
    name: "product typo",
    query: "pipedrve",
    expectType: "SOFTWARE",
    expectSlug: "pipedrive",
  },
  {
    name: "hubspot entity",
    query: "hubspot",
    expectType: "SOFTWARE",
    expectTitleIncludes: "HubSpot",
  },
  {
    name: "hubspot pricing intent",
    query: "hubspot pricing",
    expectType: "SOFTWARE",
    expectTitleIncludes: "HubSpot",
  },
  {
    name: "comparison intent",
    query: "hubspot vs pipedrive",
    expectType: "COMPARISON",
    expectTitleIncludes: "HubSpot vs Pipedrive",
  },
  {
    name: "category crm",
    query: "crm",
    expectType: "CATEGORY",
    expectSlug: "crm",
  },
  {
    name: "best crm",
    query: "best crm",
    expectType: "BEST_PAGE",
    expectTitleIncludes: "Best CRM",
  },
  {
    name: "crm finder tool",
    query: "crm finder",
    expectType: "TOOL",
    expectSlug: "crm-finder",
  },
  {
    name: "crm cost calculator",
    query: "crm cost calculator",
    expectType: "TOOL",
    expectTitleIncludes: "Cost Calculator",
  },
  {
    name: "evaluation checklist resource",
    query: "crm evaluation checklist",
    expectType: "RESOURCE",
    expectSlug: "crm-evaluation-checklist",
  },
  {
    name: "workflow automation feature",
    query: "workflow automation",
    expectType: "FEATURE",
    expectSlug: "workflow-automation",
  },
  {
    name: "multiple pipelines feature",
    query: "multiple pipelines",
    expectType: "FEATURE",
    expectTitleIncludes: "Multiple Pipelines",
  },
  {
    name: "lead assignment requirement",
    query: "automatic lead assignment",
    expectType: "REQUIREMENT",
  },
  {
    name: "financial services industry",
    query: "financial services crm",
    expectType: "INDUSTRY",
    expectTitleIncludes: "Financial",
  },
  {
    name: "crm migration",
    query: "crm migration",
    expectType: "TOOL",
  },
  {
    name: "nonsense zero results",
    query: "nonsensequeryxyz",
    expectZero: true,
  },
];
