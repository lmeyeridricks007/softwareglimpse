/**
 * Lean Sales Intelligence use-case definitions for tools (Requirements Builder).
 * Smaller than the full CRM graph — enough to drive wizard derivation.
 */

export type SiUseCaseCapabilityDefinition = {
  capabilitySlug: string;
  name: string;
  description: string;
  importance: "critical" | "high" | "important" | "optional";
  weight: number;
};

export type SiUseCaseRequirementDefinition = {
  id: string;
  name: string;
  description: string;
  capabilitySlug: string;
  priority: "must-have" | "important" | "advanced";
  featureSlug?: string;
  requirementSlug?: string;
};

export type SiUseCaseDefinition = {
  slug: string;
  displayName: string;
  tagline: string;
  glance: {
    typicalObjective: string;
    teamTypes: string[];
    topPriorityLabels: string[];
  };
  /** Catalogue / onboarding use-case slugs when they match. */
  catalogueUseCaseSlugs: string[];
  finderUseCaseSlug?: string;
  capabilities: SiUseCaseCapabilityDefinition[];
  requirements: SiUseCaseRequirementDefinition[];
};

export const SI_USE_CASES: SiUseCaseDefinition[] = [
  {
    slug: "prospecting",
    displayName: "Prospecting",
    tagline:
      "Find and qualify new contacts and accounts to fill the top of the funnel.",
    glance: {
      typicalObjective: "Build a reliable pipeline of net-new prospects",
      teamTypes: ["SDR / BDR", "Outbound sales", "Growth"],
      topPriorityLabels: [
        "Contact coverage",
        "Filters",
        "Verified emails",
        "CRM sync",
      ],
    },
    catalogueUseCaseSlugs: ["prospecting"],
    finderUseCaseSlug: "prospecting",
    capabilities: [
      {
        capabilitySlug: "contact-data",
        name: "Contact data",
        description:
          "Searchable contact and company database with usable filters.",
        importance: "critical",
        weight: 100,
      },
      {
        capabilitySlug: "enrichment",
        name: "Data enrichment",
        description: "Fill missing emails, phones, and firmographics.",
        importance: "high",
        weight: 80,
      },
      {
        capabilitySlug: "crm-sync",
        name: "CRM sync",
        description: "Push prospects into the CRM without duplicate chaos.",
        importance: "high",
        weight: 70,
      },
      {
        capabilitySlug: "outreach-execution",
        name: "Outreach execution",
        description: "Optional sequences or dialer when prospecting in-tool.",
        importance: "optional",
        weight: 40,
      },
    ],
    requirements: [
      {
        id: "coverage-region",
        name: "Coverage for target regions",
        description: "Database coverage matches the geographies you sell into.",
        capabilitySlug: "contact-data",
        priority: "must-have",
        requirementSlug: "coverage-region",
        featureSlug: "contact-data",
      },
      {
        id: "verified-emails",
        name: "Verified email addresses",
        description: "Emails are verified or accuracy claims are testable.",
        capabilitySlug: "contact-data",
        priority: "must-have",
        requirementSlug: "verified-emails",
        featureSlug: "contact-data",
      },
      {
        id: "crm-two-way-sync",
        name: "CRM two-way sync",
        description: "Prospect records sync to and from the CRM cleanly.",
        capabilitySlug: "crm-sync",
        priority: "important",
        requirementSlug: "crm-two-way-sync",
        featureSlug: "crm-sync",
      },
    ],
  },
  {
    slug: "data-enrichment",
    displayName: "Data enrichment",
    tagline:
      "Enrich existing CRM or list records with accurate contact and company data.",
    glance: {
      typicalObjective: "Improve match rates and keep CRM fields current",
      teamTypes: ["RevOps", "Sales ops", "Marketing ops"],
      topPriorityLabels: [
        "Match rate",
        "API / bulk",
        "Field mapping",
        "Credits",
      ],
    },
    catalogueUseCaseSlugs: ["data-enrichment"],
    finderUseCaseSlug: "data-enrichment",
    capabilities: [
      {
        capabilitySlug: "enrichment",
        name: "Data enrichment",
        description: "Enrich people and companies from partial identifiers.",
        importance: "critical",
        weight: 100,
      },
      {
        capabilitySlug: "contact-data",
        name: "Contact data",
        description: "Underlying database quality for enrichment results.",
        importance: "critical",
        weight: 90,
      },
      {
        capabilitySlug: "crm-sync",
        name: "CRM sync",
        description: "Write enriched fields back without overwriting blindly.",
        importance: "high",
        weight: 75,
      },
    ],
    requirements: [
      {
        id: "verified-emails",
        name: "Verified email addresses",
        description: "Enriched emails are accurate enough to use in outreach.",
        capabilitySlug: "enrichment",
        priority: "must-have",
        requirementSlug: "verified-emails",
        featureSlug: "data-enrichment",
      },
      {
        id: "verified-phones",
        name: "Verified phone numbers",
        description: "Mobile/direct dials when phone outreach matters.",
        capabilitySlug: "enrichment",
        priority: "important",
        requirementSlug: "verified-phones",
        featureSlug: "data-enrichment",
      },
      {
        id: "credit-transparency",
        name: "Credit transparency",
        description: "Clear credit rules for lookups, exports, and enrichments.",
        capabilitySlug: "enrichment",
        priority: "must-have",
        requirementSlug: "credit-transparency",
        featureSlug: "data-enrichment",
      },
      {
        id: "crm-two-way-sync",
        name: "CRM two-way sync",
        description: "Enrichment results land in the right CRM fields.",
        capabilitySlug: "crm-sync",
        priority: "important",
        requirementSlug: "crm-two-way-sync",
        featureSlug: "crm-sync",
      },
    ],
  },
  {
    slug: "list-building",
    displayName: "List building",
    tagline:
      "Build targeted contact lists by persona, firmographics, and buying criteria.",
    glance: {
      typicalObjective: "Assemble exportable or syncable outreach lists",
      teamTypes: ["SDR / BDR", "Demand gen", "Agencies"],
      topPriorityLabels: [
        "Filters",
        "List size",
        "Export rights",
        "Credits",
      ],
    },
    catalogueUseCaseSlugs: ["list-building"],
    finderUseCaseSlug: "list-building",
    capabilities: [
      {
        capabilitySlug: "contact-data",
        name: "Contact data",
        description: "Breadth and filter depth for list construction.",
        importance: "critical",
        weight: 100,
      },
      {
        capabilitySlug: "enrichment",
        name: "Data enrichment",
        description: "Validate and complete list records before export.",
        importance: "high",
        weight: 70,
      },
      {
        capabilitySlug: "crm-sync",
        name: "CRM sync",
        description: "Push lists into CRM or engagement tools.",
        importance: "important",
        weight: 60,
      },
    ],
    requirements: [
      {
        id: "coverage-region",
        name: "Coverage for target regions",
        description: "Enough records in the markets and segments you target.",
        capabilitySlug: "contact-data",
        priority: "must-have",
        requirementSlug: "coverage-region",
        featureSlug: "list-building",
      },
      {
        id: "export-rights",
        name: "Export rights",
        description: "You can export or sync lists under transparent terms.",
        capabilitySlug: "contact-data",
        priority: "must-have",
        requirementSlug: "export-rights",
        featureSlug: "data-export",
      },
      {
        id: "credit-transparency",
        name: "Credit transparency",
        description: "List builds and exports do not surprise you on credits.",
        capabilitySlug: "contact-data",
        priority: "important",
        requirementSlug: "credit-transparency",
        featureSlug: "list-building",
      },
    ],
  },
  {
    slug: "email-outreach",
    displayName: "Email outreach / sales engagement",
    tagline:
      "Run outbound email sequences (and related multichannel touches) on prospect data.",
    glance: {
      typicalObjective: "Execute outbound from verified prospect lists",
      teamTypes: ["SDR / BDR", "Outbound AEs", "Sales engagement"],
      topPriorityLabels: [
        "Sequences",
        "Deliverability",
        "CRM logging",
        "Data quality",
      ],
    },
    catalogueUseCaseSlugs: ["email-outreach", "sales-engagement"],
    finderUseCaseSlug: "email-outreach",
    capabilities: [
      {
        capabilitySlug: "outreach-execution",
        name: "Outreach execution",
        description: "Sequences, sending, and engagement tracking.",
        importance: "critical",
        weight: 100,
      },
      {
        capabilitySlug: "contact-data",
        name: "Contact data",
        description: "Prospect database or import path feeding outreach.",
        importance: "high",
        weight: 80,
      },
      {
        capabilitySlug: "crm-sync",
        name: "CRM sync",
        description: "Activity and contact updates land in the CRM.",
        importance: "high",
        weight: 75,
      },
      {
        capabilitySlug: "intent-signals",
        name: "Intent / signals",
        description: "Optional buying signals to prioritize who to contact.",
        importance: "optional",
        weight: 35,
      },
    ],
    requirements: [
      {
        id: "verified-emails",
        name: "Verified email addresses",
        description: "Outreach starts from emails accurate enough to send.",
        capabilitySlug: "contact-data",
        priority: "must-have",
        requirementSlug: "verified-emails",
        featureSlug: "email-outreach",
      },
      {
        id: "crm-two-way-sync",
        name: "CRM two-way sync",
        description: "Outreach activity and replies sync to the CRM.",
        capabilitySlug: "crm-sync",
        priority: "important",
        requirementSlug: "crm-two-way-sync",
        featureSlug: "crm-sync",
      },
      {
        id: "gdpr-compliance-posture",
        name: "Compliance / GDPR posture",
        description:
          "Clear lawful-basis and suppression handling for outbound regions.",
        capabilitySlug: "outreach-execution",
        priority: "important",
        requirementSlug: "gdpr-compliance-posture",
        featureSlug: "email-outreach",
      },
    ],
  },
];

const BY_SLUG = new Map(SI_USE_CASES.map((item) => [item.slug, item]));

export function getSiUseCaseDefinition(
  slug: string,
): SiUseCaseDefinition | null {
  return BY_SLUG.get(slug) ?? null;
}
