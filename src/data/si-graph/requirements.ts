/**
 * Lean Sales Intelligence buyer-requirement definitions for tools.
 * Affiliate status must never appear here or in scoring.
 */

export type SiRequirementFeatureLink = {
  featureSlug: string;
  name: string;
  relationship: "required" | "strongly-supporting" | "supporting" | "optional";
  rationale: string;
};

export type SiRequirementDefinition = {
  slug: string;
  name: string;
  tagline: string;
  shortAnswer: string;
  buyerNeedDescription: string;
  primaryCapabilitySlug: string;
  primaryCapabilityName: string;
  featureLinks: SiRequirementFeatureLink[];
  whyItMatters: Array<{ id: string; title: string; description: string }>;
};

export const SI_REQUIREMENTS: SiRequirementDefinition[] = [
  {
    slug: "coverage-region",
    name: "Coverage for target regions",
    tagline:
      "Confirm the database covers the countries and segments you actually sell into.",
    shortAnswer:
      "Ask for coverage samples in your ICP geographies before committing. Breadth claims mean little if your regions are thin.",
    buyerNeedDescription:
      "Have enough contacts and companies in the regions and segments your team sells into.",
    primaryCapabilitySlug: "contact-data",
    primaryCapabilityName: "Contact data",
    featureLinks: [
      {
        featureSlug: "contact-data",
        name: "Contact data",
        relationship: "required",
        rationale: "Coverage is a property of the contact/company database.",
      },
      {
        featureSlug: "prospecting",
        name: "Prospecting",
        relationship: "strongly-supporting",
        rationale: "Prospecting workflows depend on searchable coverage.",
      },
      {
        featureSlug: "list-building",
        name: "List building",
        relationship: "supporting",
        rationale: "List size is limited by regional coverage.",
      },
    ],
    whyItMatters: [
      {
        id: "pipeline",
        title: "Pipeline quality",
        description:
          "Thin coverage forces SDRs into low-fit accounts or stale lists.",
      },
    ],
  },
  {
    slug: "verified-emails",
    name: "Verified email addresses",
    tagline: "Require testable email accuracy before you scale outbound.",
    shortAnswer:
      "Run a small verification sample on your ICP. Treat bounce rate as a must-have gate, not a marketing claim.",
    buyerNeedDescription:
      "Obtain email addresses that are accurate enough to use for outreach without burning domain reputation.",
    primaryCapabilitySlug: "contact-data",
    primaryCapabilityName: "Contact data",
    featureLinks: [
      {
        featureSlug: "contact-data",
        name: "Contact data",
        relationship: "required",
        rationale: "Email quality is core contact-data value.",
      },
      {
        featureSlug: "data-enrichment",
        name: "Data enrichment",
        relationship: "strongly-supporting",
        rationale: "Enrichment often supplies or refreshes emails.",
      },
      {
        featureSlug: "email-outreach",
        name: "Email outreach",
        relationship: "supporting",
        rationale: "Outreach quality collapses without verified emails.",
      },
    ],
    whyItMatters: [
      {
        id: "deliverability",
        title: "Deliverability",
        description: "Bad emails burn sending domains and waste sequences.",
      },
    ],
  },
  {
    slug: "verified-phones",
    name: "Verified phone numbers",
    tagline: "Require usable direct dials or mobiles when calling is part of the motion.",
    shortAnswer:
      "If phone is a primary channel, sample dials in your ICP. Mobile vs landline mix matters as much as ‘has phone’ flags.",
    buyerNeedDescription:
      "Get phone numbers that are accurate enough for outbound calling or dialer workflows.",
    primaryCapabilitySlug: "contact-data",
    primaryCapabilityName: "Contact data",
    featureLinks: [
      {
        featureSlug: "contact-data",
        name: "Contact data",
        relationship: "required",
        rationale: "Phone coverage lives in the contact database.",
      },
      {
        featureSlug: "data-enrichment",
        name: "Data enrichment",
        relationship: "strongly-supporting",
        rationale: "Enrichment often reveals or refreshes phones.",
      },
      {
        featureSlug: "prospecting",
        name: "Prospecting",
        relationship: "supporting",
        rationale: "Prospecting workflows may prioritize phone-ready contacts.",
      },
    ],
    whyItMatters: [
      {
        id: "connect-rate",
        title: "Connect rate",
        description: "Wrong numbers destroy dialer productivity.",
      },
    ],
  },
  {
    slug: "crm-two-way-sync",
    name: "CRM two-way sync",
    tagline:
      "Prospect data and activity must land in the CRM without silent overwrite risk.",
    shortAnswer:
      "Confirm field mapping, ownership rules, and whether sync is one-way or two-way on your CRM and plan.",
    buyerNeedDescription:
      "Keep contacts, companies, and outreach activity aligned with the CRM system of record.",
    primaryCapabilitySlug: "crm-sync",
    primaryCapabilityName: "CRM sync",
    featureLinks: [
      {
        featureSlug: "crm-sync",
        name: "CRM sync",
        relationship: "required",
        rationale: "Two-way sync is the primary CRM integration capability.",
      },
      {
        featureSlug: "integrations",
        name: "Integrations",
        relationship: "strongly-supporting",
        rationale: "CRM connectors are often packaged as integrations.",
      },
      {
        featureSlug: "data-export",
        name: "Data export",
        relationship: "supporting",
        rationale: "Export is a fallback when sync depth is limited.",
      },
    ],
    whyItMatters: [
      {
        id: "single-source",
        title: "Single source of truth",
        description:
          "Without sync, SI tools become a second CRM that drifts.",
      },
    ],
  },
  {
    slug: "credit-transparency",
    name: "Credit transparency",
    tagline:
      "Understand what consumes credits before you commit to a plan.",
    shortAnswer:
      "Ask for a written credit matrix: reveal, enrich, export, AI, and refresh. Opaque credits are a buying risk.",
    buyerNeedDescription:
      "Know how credits are consumed for lookups, enrichment, exports, and other billable actions.",
    primaryCapabilitySlug: "enrichment",
    primaryCapabilityName: "Data enrichment",
    featureLinks: [
      {
        featureSlug: "data-enrichment",
        name: "Data enrichment",
        relationship: "required",
        rationale: "Enrichment is a common credit consumer.",
      },
      {
        featureSlug: "contact-data",
        name: "Contact data",
        relationship: "strongly-supporting",
        rationale: "Contact reveals often burn credits.",
      },
      {
        featureSlug: "data-export",
        name: "Data export",
        relationship: "supporting",
        rationale: "Exports may consume credits or have separate limits.",
      },
      {
        featureSlug: "reporting",
        name: "Reporting",
        relationship: "optional",
        rationale: "Usage reporting helps audit credit burn.",
      },
    ],
    whyItMatters: [
      {
        id: "cost-control",
        title: "Cost control",
        description: "Surprise credit burn breaks ROI after onboarding.",
      },
    ],
  },
  {
    slug: "gdpr-compliance-posture",
    name: "Compliance / GDPR posture",
    tagline:
      "Require clear lawful-basis and suppression handling for regulated regions.",
    shortAnswer:
      "Ask how data is sourced, how opt-outs are honored, and what documentation you get for EMEA outreach. This tool does not certify compliance.",
    buyerNeedDescription:
      "Operate outbound with a documented data-source and suppression posture appropriate for your regions.",
    primaryCapabilitySlug: "outreach-execution",
    primaryCapabilityName: "Outreach execution",
    featureLinks: [
      {
        featureSlug: "email-outreach",
        name: "Email outreach",
        relationship: "required",
        rationale: "Outbound email is where compliance risk concentrates.",
      },
      {
        featureSlug: "contact-data",
        name: "Contact data",
        relationship: "strongly-supporting",
        rationale: "Data provenance starts with how contacts were sourced.",
      },
      {
        featureSlug: "data-export",
        name: "Data export",
        relationship: "supporting",
        rationale: "Export controls affect how data leaves the platform.",
      },
    ],
    whyItMatters: [
      {
        id: "risk",
        title: "Legal and brand risk",
        description:
          "Unclear posture creates legal and deliverability risk in regulated markets.",
      },
    ],
  },
  {
    slug: "export-rights",
    name: "Export rights",
    tagline: "Confirm you can take your lists with you under clear terms.",
    shortAnswer:
      "Check export formats, rate limits, and whether exported data remains usable after cancellation.",
    buyerNeedDescription:
      "Export or sync contact lists and enrichment results without locking data inside the vendor.",
    primaryCapabilitySlug: "contact-data",
    primaryCapabilityName: "Contact data",
    featureLinks: [
      {
        featureSlug: "data-export",
        name: "Data export",
        relationship: "required",
        rationale: "Export is the direct product capability for this need.",
      },
      {
        featureSlug: "list-building",
        name: "List building",
        relationship: "strongly-supporting",
        rationale: "List building is only useful if lists can leave the tool.",
      },
      {
        featureSlug: "crm-sync",
        name: "CRM sync",
        relationship: "supporting",
        rationale: "CRM sync is an alternative path to ownership.",
      },
    ],
    whyItMatters: [
      {
        id: "portability",
        title: "Portability",
        description: "Without export rights, switching vendors is painful.",
      },
    ],
  },
  {
    slug: "intent-signal-access",
    name: "Access to buying signals",
    tagline:
      "Optional: prioritize accounts using intent or engagement signals when available.",
    shortAnswer:
      "Only make this a must-have if signal-led prioritization is already part of your process. Otherwise keep it optional.",
    buyerNeedDescription:
      "Use buying signals or intent data to prioritize which accounts or contacts to pursue.",
    primaryCapabilitySlug: "intent-signals",
    primaryCapabilityName: "Intent / signals",
    featureLinks: [
      {
        featureSlug: "lead-scoring",
        name: "Lead scoring",
        relationship: "required",
        rationale: "Signals often surface through prioritization / scoring.",
      },
      {
        featureSlug: "ai-assistance",
        name: "AI assistance",
        relationship: "supporting",
        rationale: "Some products package signal prioritization as AI.",
      },
      {
        featureSlug: "reporting",
        name: "Reporting",
        relationship: "optional",
        rationale: "Reporting helps validate signal usefulness.",
      },
    ],
    whyItMatters: [
      {
        id: "prioritization",
        title: "Prioritization",
        description:
          "Signals help focus outreach when coverage is broad and time is limited.",
      },
    ],
  },
];

const BY_SLUG = new Map(SI_REQUIREMENTS.map((item) => [item.slug, item]));

export function getSiRequirementDefinition(
  slug: string,
): SiRequirementDefinition | null {
  return BY_SLUG.get(slug) ?? null;
}
