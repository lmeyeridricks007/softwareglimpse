import type { FinderOption } from "@/components/finder/crm-finder-questions";
import { CAPABILITY_OPTIONS } from "@/components/finder/crm-finder-questions";
import { SI_CAPABILITY_OPTIONS } from "@/components/finder/si-finder-questions";
import type { AnalyticsEventName } from "@/analytics/events";
import {
  loadCrmDecisionProfile,
  loadSiDecisionProfile,
} from "@/services/decision-profile/client";
import type { DecisionProfile } from "@/domain";

export type CostCalculatorConfig = {
  categorySlug: string;
  storageKey: string;
  finderStorageKey: string;
  productNoun: string;
  productNounPlural: string;
  defaultTitle: string;
  defaultDescription: string;
  requirementsHeading: string;
  seatsDescription: string;
  loadingTitle: string;
  loadingDescription: string;
  resultsHeading: string;
  capabilityOptions: FinderOption[];
  loadDecisionProfile: () => DecisionProfile | null;
  finderHref: string;
  finderLabel: string;
  secondaryToolHref?: string;
  secondaryToolLabel?: string;
  analytics: {
    started: AnalyticsEventName;
    completed: AnalyticsEventName;
    resultViewed: AnalyticsEventName;
    sortChanged: AnalyticsEventName;
  };
  includedItems: Array<{ title: string; body: string }>;
  estimateAlertSuffix: string;
};

export const CRM_COST_CALCULATOR_CONFIG: CostCalculatorConfig = {
  categorySlug: "crm",
  storageKey: "sg-crm-cost-v1",
  finderStorageKey: "sg-crm-finder-v1",
  productNoun: "CRM",
  productNounPlural: "CRM products",
  defaultTitle: "CRM Cost Calculator",
  defaultDescription:
    "Calculate the total cost of CRM software for your business. Compare verified plan pricing across tools — affiliate relationships never change the numbers.",
  requirementsHeading: "CRM requirements",
  seatsDescription: "How many people will need a paid seat.",
  loadingTitle: "Calculating CRM costs…",
  loadingDescription:
    "Comparing verified plan pricing for your team size and requirements.",
  resultsHeading: "CRM cost details",
  capabilityOptions: CAPABILITY_OPTIONS,
  loadDecisionProfile: loadCrmDecisionProfile,
  finderHref: "/tools/crm-finder/",
  finderLabel: "Find My CRM",
  secondaryToolHref: "/tools/crm-tco-calculator/?from=cost",
  secondaryToolLabel: "Calculate total ownership cost →",
  analytics: {
    started: "crm_cost_calculator_started",
    completed: "crm_cost_calculator_completed",
    resultViewed: "crm_cost_result_viewed",
    sortChanged: "crm_cost_sort_changed",
  },
  includedItems: [
    {
      title: "CRM plan costs",
      body: "Base / per-seat list pricing for your user count and billing preference.",
    },
    {
      title: "Verified add-ons",
      body: "Only when an add-on rule is published in our pricing coverage for a plan.",
    },
    {
      title: "Not invented",
      body: "Setup, training, data migration, and support retainers are omitted unless published.",
    },
    {
      title: "Before tax",
      body: "Figures exclude tax and negotiated discounts. Invoices may differ.",
    },
  ],
  estimateAlertSuffix: "CRM products",
};

export const SI_COST_CALCULATOR_CONFIG: CostCalculatorConfig = {
  categorySlug: "sales-intelligence",
  storageKey: "sg-si-cost-v1",
  finderStorageKey: "sg-si-finder-v1",
  productNoun: "sales intelligence",
  productNounPlural: "sales intelligence products",
  defaultTitle: "Sales Intelligence Cost Calculator",
  defaultDescription:
    "Estimate seat-based sales intelligence costs from verified public pricing. Credit packs and custom quotes stay unknown until a vendor quotes them — we never invent credit dollar totals. Affiliate relationships never change the numbers.",
  requirementsHeading: "Sales intelligence requirements",
  seatsDescription:
    "How many people need paid seats. Credit / contact packs are not converted into dollar totals here.",
  loadingTitle: "Calculating sales intelligence costs…",
  loadingDescription:
    "Comparing verified seat pricing where published. Credit packs and quote-only tools stay unknown.",
  resultsHeading: "Sales intelligence cost details",
  capabilityOptions: SI_CAPABILITY_OPTIONS,
  loadDecisionProfile: loadSiDecisionProfile,
  finderHref: "/tools/sales-intelligence-finder/",
  finderLabel: "Find My Tool",
  secondaryToolHref: "/tools/sales-intelligence-plan-selector/",
  secondaryToolLabel: "Open plan selector →",
  analytics: {
    started: "si_cost_calculator_started",
    completed: "si_cost_calculator_completed",
    resultViewed: "si_cost_result_viewed",
    sortChanged: "si_cost_sort_changed",
  },
  includedItems: [
    {
      title: "Verified seat / subscription costs",
      body: "Per-seat or flat list pricing when research publishes calculable plan rules.",
    },
    {
      title: "Credits stay unknown",
      body: "Credit packs, contact credits, and usage overages are marked quote-required — we do not invent dollar totals.",
    },
    {
      title: "Custom quotes",
      body: "Contact-sales tiers are never treated as $0. Ask the vendor for a real quote.",
    },
    {
      title: "Before tax",
      body: "Figures exclude tax and negotiated discounts. Invoices may differ.",
    },
  ],
  estimateAlertSuffix: "sales intelligence products",
};
