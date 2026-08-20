"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  RFP_CHANGE_TRIGGER_PROMPTS,
  RFP_INTEGRATION_CATEGORIES,
  RFP_MIGRATION_OBJECT_PROMPTS,
  RFP_SCOPE_CATALOG,
  RFP_USER_GROUP_PROMPTS,
} from "./constants";
import {
  SI_RFP_CHANGE_TRIGGER_PROMPTS,
  SI_RFP_INTEGRATION_CATEGORIES,
  SI_RFP_MIGRATION_OBJECT_PROMPTS,
  SI_RFP_SCOPE_CATALOG,
  SI_RFP_USER_GROUP_PROMPTS,
} from "./si-constants";

export type RfpPackId = string;

export type RfpContentPack = {
  id: RfpPackId;
  productLabel: string;
  scopeCatalog: Array<{ id: string; label: string; capabilitySlug?: string }>;
  changeTriggers: readonly string[];
  userGroups: readonly string[];
  integrationCategories: readonly string[];
  migrationObjects: readonly string[];
  requirementsBuilderHref: string;
  requirementsBuilderLabel: string;
  scopeStepDescription: string;
};

export const CRM_RFP_PACK: RfpContentPack = {
  id: "crm",
  productLabel: "CRM",
  scopeCatalog: RFP_SCOPE_CATALOG,
  changeTriggers: RFP_CHANGE_TRIGGER_PROMPTS,
  userGroups: RFP_USER_GROUP_PROMPTS,
  integrationCategories: RFP_INTEGRATION_CATEGORIES,
  migrationObjects: RFP_MIGRATION_OBJECT_PROMPTS,
  requirementsBuilderHref: "/tools/crm-requirements-builder/",
  requirementsBuilderLabel: "CRM Requirements Builder",
  scopeStepDescription:
    "Use the canonical CRM capability checklist. Mark phase — do not invent volumes or user counts.",
};

export const SI_RFP_PACK: RfpContentPack = {
  id: "sales-intelligence",
  productLabel: "Sales Intelligence",
  scopeCatalog: SI_RFP_SCOPE_CATALOG,
  changeTriggers: SI_RFP_CHANGE_TRIGGER_PROMPTS,
  userGroups: SI_RFP_USER_GROUP_PROMPTS,
  integrationCategories: SI_RFP_INTEGRATION_CATEGORIES,
  migrationObjects: SI_RFP_MIGRATION_OBJECT_PROMPTS,
  requirementsBuilderHref: "/tools/sales-intelligence-requirements-builder/",
  requirementsBuilderLabel: "SI Requirements Builder",
  scopeStepDescription:
    "Use the sales-intelligence scope checklist (coverage, enrichment, CRM sync, credits, compliance). Mark phase — do not invent vendor facts.",
};

const RfpPackContext = createContext<RfpContentPack>(CRM_RFP_PACK);

export function RfpPackProvider({
  pack,
  children,
}: {
  pack: RfpContentPack;
  children: ReactNode;
}) {
  return (
    <RfpPackContext.Provider value={pack}>{children}</RfpPackContext.Provider>
  );
}

export function useRfpPack(): RfpContentPack {
  return useContext(RfpPackContext);
}
