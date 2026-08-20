/**
 * Lean Sales Intelligence capability definitions for tools.
 */

export type SiCapabilityRequirementDefinition = {
  id: string;
  name: string;
  description: string;
  priority: "core" | "advanced" | "optional";
  featureSlug?: string;
  requirementSlug?: string;
};

export type SiCapabilityDefinition = {
  slug: string;
  name: string;
  icon: string;
  glance: {
    importanceLabel: string;
    coreObjective: string;
    importantRequirementLabels: string[];
  };
  requirements: SiCapabilityRequirementDefinition[];
};

export const SI_CAPABILITIES: SiCapabilityDefinition[] = [
  {
    slug: "contact-data",
    name: "Contact data",
    icon: "users",
    glance: {
      importanceLabel: "Critical",
      coreObjective:
        "Provide searchable, accurate people and company records for outbound",
      importantRequirementLabels: [
        "Regional coverage",
        "Verified emails",
        "Filters",
        "Export rights",
      ],
    },
    requirements: [
      {
        id: "coverage-region",
        name: "Coverage for target regions",
        description:
          "Enough contacts and companies in the geographies you sell into.",
        priority: "core",
        featureSlug: "contact-data",
        requirementSlug: "coverage-region",
      },
      {
        id: "verified-emails",
        name: "Verified email addresses",
        description: "Email accuracy is testable before you burn send volume.",
        priority: "core",
        featureSlug: "contact-data",
        requirementSlug: "verified-emails",
      },
      {
        id: "verified-phones",
        name: "Verified phone numbers",
        description: "Direct dials or mobiles when phone outreach matters.",
        priority: "advanced",
        featureSlug: "contact-data",
        requirementSlug: "verified-phones",
      },
      {
        id: "export-rights",
        name: "Export rights",
        description: "You can export or sync records under clear terms.",
        priority: "core",
        featureSlug: "data-export",
        requirementSlug: "export-rights",
      },
    ],
  },
  {
    slug: "enrichment",
    name: "Data enrichment",
    icon: "sparkles",
    glance: {
      importanceLabel: "High",
      coreObjective:
        "Complete and refresh CRM or list records from partial identifiers",
      importantRequirementLabels: [
        "Match rate",
        "Field depth",
        "Credits",
        "Bulk / API",
      ],
    },
    requirements: [
      {
        id: "verified-emails",
        name: "Verified email addresses",
        description: "Enriched emails are usable for outreach.",
        priority: "core",
        featureSlug: "data-enrichment",
        requirementSlug: "verified-emails",
      },
      {
        id: "verified-phones",
        name: "Verified phone numbers",
        description: "Phone enrichment when dialing is part of the motion.",
        priority: "advanced",
        featureSlug: "data-enrichment",
        requirementSlug: "verified-phones",
      },
      {
        id: "credit-transparency",
        name: "Credit transparency",
        description:
          "Credit consumption for enrich, reveal, and export is understandable.",
        priority: "core",
        featureSlug: "data-enrichment",
        requirementSlug: "credit-transparency",
      },
    ],
  },
  {
    slug: "intent-signals",
    name: "Intent / signals",
    icon: "activity",
    glance: {
      importanceLabel: "Optional",
      coreObjective:
        "Prioritize accounts or contacts using buying signals when available",
      importantRequirementLabels: [
        "Signal sources",
        "Account fit",
        "Freshness",
      ],
    },
    requirements: [
      {
        id: "intent-signal-access",
        name: "Access to buying signals",
        description:
          "Intent or engagement signals are available for your ICP segments.",
        priority: "optional",
        featureSlug: "lead-scoring",
        requirementSlug: "intent-signal-access",
      },
    ],
  },
  {
    slug: "crm-sync",
    name: "CRM sync",
    icon: "refresh-cw",
    glance: {
      importanceLabel: "High",
      coreObjective:
        "Keep prospect data and activity aligned with the system of record",
      importantRequirementLabels: [
        "Two-way sync",
        "Field mapping",
        "Deduping",
      ],
    },
    requirements: [
      {
        id: "crm-two-way-sync",
        name: "CRM two-way sync",
        description:
          "Contacts, companies, and activity sync without silent overwrite risk.",
        priority: "core",
        featureSlug: "crm-sync",
        requirementSlug: "crm-two-way-sync",
      },
    ],
  },
  {
    slug: "outreach-execution",
    name: "Outreach execution",
    icon: "mail",
    glance: {
      importanceLabel: "Context-dependent",
      coreObjective:
        "Run email (and related) outbound on prospect data inside or beside the tool",
      importantRequirementLabels: [
        "Sequences",
        "Deliverability",
        "Compliance",
        "CRM logging",
      ],
    },
    requirements: [
      {
        id: "gdpr-compliance-posture",
        name: "Compliance / GDPR posture",
        description:
          "Clear guidance for lawful outreach and suppression in regulated regions.",
        priority: "advanced",
        featureSlug: "email-outreach",
        requirementSlug: "gdpr-compliance-posture",
      },
      {
        id: "verified-emails",
        name: "Verified email addresses",
        description: "Sequences start from data quality you can defend.",
        priority: "core",
        featureSlug: "email-sequences",
        requirementSlug: "verified-emails",
      },
    ],
  },
];

const BY_SLUG = new Map(SI_CAPABILITIES.map((item) => [item.slug, item]));

export function getSiCapabilityDefinition(
  slug: string,
): SiCapabilityDefinition | null {
  return BY_SLUG.get(slug) ?? null;
}
