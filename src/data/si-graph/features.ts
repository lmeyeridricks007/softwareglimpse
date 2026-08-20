/**
 * Lean Sales Intelligence feature definitions mapped to catalogue seed slugs.
 */

export type SiFeatureDefinition = {
  /** Catalogue / seed feature slug. */
  slug: string;
  name: string;
  definition: string;
  primaryCapabilitySlug: string;
  primaryCapabilityName: string;
};

/** Seed-aligned SI feature map for Requirements Builder. */
export const SI_FEATURES: SiFeatureDefinition[] = [
  {
    slug: "contact-data",
    name: "Contact data",
    definition:
      "Searchable people and company records used for prospecting and enrichment.",
    primaryCapabilitySlug: "contact-data",
    primaryCapabilityName: "Contact data",
  },
  {
    slug: "prospecting",
    name: "Prospecting",
    definition:
      "Workflows and filters for finding and qualifying net-new contacts and accounts.",
    primaryCapabilitySlug: "contact-data",
    primaryCapabilityName: "Contact data",
  },
  {
    slug: "data-enrichment",
    name: "Data enrichment",
    definition:
      "Completing or refreshing emails, phones, and firmographics from partial identifiers.",
    primaryCapabilitySlug: "enrichment",
    primaryCapabilityName: "Data enrichment",
  },
  {
    slug: "list-building",
    name: "List building",
    definition:
      "Building targeted contact lists by persona, firmographics, and other filters.",
    primaryCapabilitySlug: "contact-data",
    primaryCapabilityName: "Contact data",
  },
  {
    slug: "crm-sync",
    name: "CRM sync",
    definition:
      "Syncing contacts, companies, and activity with a CRM system of record.",
    primaryCapabilitySlug: "crm-sync",
    primaryCapabilityName: "CRM sync",
  },
  {
    slug: "email-outreach",
    name: "Email outreach",
    definition:
      "Sending outbound email to prospects, often with tracking and templates.",
    primaryCapabilitySlug: "outreach-execution",
    primaryCapabilityName: "Outreach execution",
  },
  {
    slug: "email-sequences",
    name: "Email sequences",
    definition:
      "Multi-step automated email (and sometimes multichannel) outreach cadences.",
    primaryCapabilitySlug: "outreach-execution",
    primaryCapabilityName: "Outreach execution",
  },
  {
    slug: "data-export",
    name: "Data export",
    definition:
      "Exporting contacts, companies, or enrichment results out of the platform.",
    primaryCapabilitySlug: "contact-data",
    primaryCapabilityName: "Contact data",
  },
  {
    slug: "lead-scoring",
    name: "Lead scoring",
    definition:
      "Prioritizing contacts or accounts using fit, engagement, or intent signals.",
    primaryCapabilitySlug: "intent-signals",
    primaryCapabilityName: "Intent / signals",
  },
  {
    slug: "ai-assistance",
    name: "AI assistance",
    definition:
      "AI features that help research, personalize, or prioritize prospecting work.",
    primaryCapabilitySlug: "outreach-execution",
    primaryCapabilityName: "Outreach execution",
  },
  {
    slug: "reporting",
    name: "Reporting",
    definition:
      "Usage, activity, and performance reporting for data and outreach workflows.",
    primaryCapabilitySlug: "outreach-execution",
    primaryCapabilityName: "Outreach execution",
  },
  {
    slug: "integrations",
    name: "Integrations",
    definition:
      "Connections to CRM, mailbox, dialer, and other tools in the sales stack.",
    primaryCapabilitySlug: "crm-sync",
    primaryCapabilityName: "CRM sync",
  },
];

const BY_SLUG = new Map(SI_FEATURES.map((item) => [item.slug, item]));

export function getSiFeatureDefinition(
  slug: string,
): SiFeatureDefinition | null {
  return BY_SLUG.get(slug) ?? null;
}
