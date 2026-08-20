import type { SoftwareFinderDefinition } from "./types";

/** Sales Intelligence Finder product definition — scoring stays in recommendSalesIntelligence. */
export const siFinderDefinition: SoftwareFinderDefinition = {
  id: "sales-intelligence-finder",
  categorySlug: "sales-intelligence",
  storageKey: "sg-si-finder-v1",
  title: "Sales Intelligence Finder",
  productNoun: "sales intelligence tool",
  estimatedMinutes: "2–3 minutes",
  methodologyHref: "/company/editorial-methodology/",
  calculatorHref: "/best/sales-intelligence-software/",
  stages: [
    {
      id: "business",
      label: "Business",
      shortLabel: "Business",
      questionIds: ["companySize", "businessType"],
    },
    {
      id: "team",
      label: "Team",
      shortLabel: "Team",
      questionIds: ["crmUsers"],
    },
    {
      id: "goals",
      label: "Goals",
      shortLabel: "Goals",
      questionIds: ["primaryGoal"],
    },
    {
      id: "features",
      label: "Features",
      shortLabel: "Features",
      questionIds: ["capabilities"],
    },
    {
      id: "integrations",
      label: "Integrations",
      shortLabel: "Integrations",
      questionIds: ["integrations"],
    },
    {
      id: "budget",
      label: "Budget",
      shortLabel: "Budget",
      questionIds: ["budget", "ease"],
    },
    {
      id: "results",
      label: "Results",
      shortLabel: "Results",
      questionIds: [],
    },
  ],
  matchCriteria: [
    { id: "business", label: "Business size" },
    { id: "team", label: "Team size" },
    { id: "goals", label: "Primary job" },
    { id: "features", label: "Capabilities" },
    { id: "integrations", label: "Integrations" },
    { id: "budget", label: "Budget" },
    { id: "setup", label: "Setup preference" },
  ],
};
