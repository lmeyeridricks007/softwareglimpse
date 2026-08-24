import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * VoIP / Business Phone subcategory definition v1.0 — under parent business-communications.
 * Cloud phone, sales dialers, and contact-center voice for affiliate cluster.
 */
export const voipBusinessPhoneDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-voip-business-phone-v1",
    slug: "voip-business-phone",
    name: "VoIP & Business Phone",
    shortDescription:
      "Cloud phone, sales dialers, and contact-center voice — distinct from team chat and customer messaging.",
    parentSlug: "business-communications",
    aliases: [
      "VoIP software",
      "business phone system",
      "cloud phone",
      "sales dialer",
      "business VoIP",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is business voice — cloud VoIP, PSTN calling, IVR and queues, power dialers, and CRM-connected phone systems — not team messaging, WhatsApp inboxes, or sales-intelligence databases without a phone core.",
      includes: [
        { id: "inc-cloud-voip", label: "Cloud business phone / VoIP" },
        { id: "inc-sales-dialer", label: "Sales power dialers with phone core" },
        { id: "inc-inbound-cc", label: "Inbound contact-center voice / cloud PBX" },
        { id: "inc-crm-cti", label: "CRM click-to-dial and call logging" },
      ],
      excludes: [
        {
          id: "exc-team-chat",
          label: "Internal team messaging without customer phone core",
          notes: "Slack/Teams — parent BC team-chat cluster",
        },
        {
          id: "exc-whatsapp",
          label: "WhatsApp / customer messaging without PSTN phone core",
          notes: "Wati/respond.io — parent BC messaging cluster",
        },
        {
          id: "exc-si-db",
          label: "Contact databases without telephony product",
          notes: "Apollo/Lusha — sales-intelligence primary",
        },
        {
          id: "exc-enterprise-ucaas",
          label: "Full enterprise UCaaS suites when phone is one module",
          notes: "RingCentral/8x8 stay parent BC primary unless affiliate VoIP cluster",
        },
      ],
      adjacentCategorySlugs: [
        "business-communications",
        "customer-service",
        "sales-intelligence",
        "crm",
      ],
      classificationNotes: [
        "KrispCall and CallHippo are SMB VoIP value — not mid-market CTI peers against Aircall",
        "Aircall is CRM CTI depth — not a sales-dialer-only peer against Kixie",
        "Freshcaller is inbound contact-center voice — not outbound dialer depth",
        "Kixie is sales dialer primary — recategorized from sales-intelligence",
        "Use parent BC finder with voice-vs-chat primary job — no dedicated subcategory finder",
        "Never rank SMB VoIP, CRM CTI, inbound CC, and sales dialers as one undifferentiated #1",
      ],
    },
    features: [
      feat(
        "cloud-phone",
        "Cloud phone / VoIP",
        "Business numbers, softphones, and PSTN calling.",
        "core",
        true,
        true,
      ),
      feat(
        "call-routing",
        "Call routing & IVR",
        "IVR menus, queues, and business-hours rules.",
        "core",
        true,
        true,
      ),
      feat(
        "power-dialer",
        "Power dialer",
        "Outbound dialing with dispositions and local presence.",
        "core",
        true,
        true,
      ),
      feat(
        "crm-cti",
        "CRM / CTI integrations",
        "Click-to-dial, screen pop, and call logging.",
        "core",
        true,
        true,
      ),
      feat(
        "call-recording",
        "Call recording",
        "Recording, playback, and QA workflows.",
        "important",
        true,
        true,
      ),
      feat(
        "sms-messaging",
        "SMS messaging",
        "Business SMS alongside voice.",
        "important",
        true,
        true,
      ),
      feat(
        "contact-center-queues",
        "Contact center queues",
        "Agent queues, overflow, and inbound CC depth.",
        "important",
        true,
        true,
      ),
    ],
    researchRequirements: [
      { domain: "identity", level: "required", featureSlugs: [] },
      {
        domain: "pricing",
        level: "required",
        featureSlugs: [],
        notes: "Per-seat floors, minute bundles, and licence minimums",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["cloud-phone", "call-routing"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-voip-business-phone-v1",
      slug: "voip-business-phone-editorial",
      name: "VoIP & Business Phone Editorial Methodology",
      version: "1.0.0",
      categorySlug: "voip-business-phone",
      description:
        "SoftwareGlimpse evaluates VoIP and business phone platforms on ease of use, voice job fit, routing depth, CRM CTI, outbound dialer, analytics, integrations, scalability, and value. Products are ranked within voice job clusters only.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Admin setup and rep daily workflow.", 12, 0, ["features:cloud-phone"]),
        crit("voice-job-fit", "Voice job fit", "Fit to SMB VoIP vs CTI vs dialer vs inbound CC.", 14, 1, ["features:cloud-phone", "features:power-dialer"]),
        crit("routing-ivr", "Routing & IVR", "IVR, queues, and business-hours depth.", 12, 2, ["features:call-routing"]),
        crit("crm-cti", "CRM / CTI", "Native CRM/helpdesk click-to-dial and logging.", 12, 3, ["features:crm-cti"]),
        crit("outbound-dialer", "Outbound dialer", "Power dialer and disposition workflows.", 11, 4, ["features:power-dialer"]),
        crit("analytics", "Analytics & QA", "Call reporting, recording, and coaching.", 10, 5, ["features:call-recording"]),
        crit("integrations", "Integrations", "CRM, helpdesk, and workflow connectors.", 10, 6, ["integrations"]),
        crit("scalability", "Scalability", "Seat minimums, multi-site, and governance.", 8, 7, ["limits"]),
        crit("value-for-money", "Value for money", "Seat floors vs feature gates.", 11, 8, ["pricing", "plans"]),
      ],
      notes: "Weights sum to 100. Score within voice clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("seat-minimum", "Seat / licence minimum", "factual", 1, "high"),
      cmp("cloud-phone", "Cloud phone / VoIP", "editorial", 2, "high", "cloud-phone"),
      cmp("routing", "Routing & IVR", "editorial", 3, "high", "call-routing"),
      cmp("crm-cti", "CRM / CTI", "editorial", 4, "high", "crm-cti"),
      cmp("power-dialer", "Power dialer", "editorial", 5, "high", "power-dialer"),
      cmp("integrations", "Integrations", "editorial", 6, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-vbp-seats", slug: "seats", name: "Users / licences", enginePrimitive: "per-seat", required: true },
      { id: "pd-vbp-minutes", slug: "minutes", name: "Minutes / usage", enginePrimitive: "usage", required: true },
      { id: "pd-vbp-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Per-seat and usage-minute primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-vbp-job", slug: "primary-job", name: "Primary job (VoIP vs dialer vs inbound CC)" },
      { id: "rd-vbp-team", slug: "team-size", name: "Team size and seat minimums" },
      { id: "rd-vbp-crm", slug: "crm-stack", name: "CRM / helpdesk stack" },
      { id: "rd-vbp-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Use parent business-communications-finder with voice-vs-chat primary job — no dedicated subcategory finder UI",
      "Voice job routing through parent BC finder dimensions",
    ],
    useCases: [
      { slug: "business-phone", name: "Business phone", pageEligibility: "content-candidate" },
      { slug: "sales-calling", name: "Sales calling & dialing", pageEligibility: "content-candidate" },
      { slug: "contact-center", name: "Contact center & queues", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["sales", "operations"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    businessTypeSlugs: ["agency", "saas", "startup"],
    seedProductSlugs: ["krispcall", "callhippo", "kixie", "freshcaller", "aircall"],
    queryAliases: [
      "VoIP software",
      "business phone system",
      "cloud phone",
      "sales dialer",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "credits", "hybrid"],
    notes: [
      "Tier 1 BC subcategory — June 2027 indexable sub-hub launch",
      "Largest BC affiliate cluster in expansion audit",
      "Do not invent product scores; do not auto-publish pages",
    ],
    supportingKnowledgeAreas: ["fundamentals", "selection", "pricing", "features"],
  });

function feat(
  slug: string,
  name: string,
  description: string,
  importance: "core" | "important" | "optional" | "specialist",
  comparisonRelevant: boolean,
  finderRelevant: boolean,
  researchGuidance?: string,
) {
  return {
    id: `feat-vbp-${slug}`,
    slug,
    name,
    description,
    importance,
    comparisonRelevant,
    finderRelevant,
    researchGuidance,
    aliases: [],
  };
}

function crit(
  slug: string,
  name: string,
  description: string,
  weight: number,
  displayOrder: number,
  evidenceRequirements: string[],
) {
  return {
    id: `crit-vbp-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "voip-business-phone",
    displayOrder,
  };
}

function cmp(
  slug: string,
  name: string,
  kind: "factual" | "editorial",
  displayOrder: number,
  decisionImportance: "high" | "medium" | "low",
  featureSlug?: string,
) {
  return {
    id: `cmp-vbp-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
