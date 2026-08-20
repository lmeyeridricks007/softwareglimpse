import type { SoftwareFinderDefinition } from "./types";

/** CRM Finder product definition — scoring stays in recommendCrm. */
export const crmFinderDefinition: SoftwareFinderDefinition = {
  id: "crm-finder",
  categorySlug: "crm",
  storageKey: "sg-crm-finder-v1",
  title: "CRM Finder",
  productNoun: "CRM",
  estimatedMinutes: "2–3 minutes",
  methodologyHref: "/company/editorial-methodology/",
  calculatorHref: "/tools/crm-cost-calculator/?from=finder",
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
    { id: "goals", label: "Goals" },
    { id: "features", label: "Features" },
    { id: "integrations", label: "Integrations" },
    { id: "budget", label: "Budget" },
    { id: "setup", label: "Setup preference" },
  ],
};
