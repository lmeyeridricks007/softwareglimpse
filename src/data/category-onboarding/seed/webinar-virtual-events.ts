import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Webinar & Virtual Events decision-domain definition v1.0.
 * Live webinars, virtual events, evergreen/simulive, and live production streams.
 */
export const webinarVirtualEventsDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-webinar-virtual-events-v1",
    slug: "webinar-virtual-events",
    name: "Webinar & Virtual Events",
    shortDescription:
      "Live webinars, virtual events, evergreen replays, and live-stream production for demand gen and customer education.",
    parentSlug: null,
    aliases: [
      "webinar software",
      "virtual event platform",
      "webinar hosting software",
      "live streaming software",
      "evergreen webinar software",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is hosting live or simulive webinars, running virtual events, registering audiences, and repurposing streams for marketing or education — not generic MAP platforms, meeting-first UCaaS, or social schedulers unless webinar execution is the stated buyer job.",
      includes: [
        { id: "inc-live-webinar", label: "Live webinar hosting & registration" },
        { id: "inc-evergreen", label: "Evergreen / simulive webinar automation" },
        { id: "inc-virtual-event", label: "Virtual event rooms & multi-session events" },
        { id: "inc-live-production", label: "Multi-camera live stream production" },
        { id: "inc-webinar-analytics", label: "Attendance, engagement, and conversion analytics" },
      ],
      excludes: [
        {
          id: "exc-map",
          label: "Primary marketing automation platforms",
          notes: "Marketo, Braze — prefer marketing unless webinar is the only job",
        },
        {
          id: "exc-lms",
          label: "Course LMS without live event core",
          notes: "LearnWorlds stays marketing/LMS adjacent",
        },
        {
          id: "exc-meetings-only",
          label: "Meetings-first UCaaS without webinar marketing depth",
          notes: "Zoom Meetings free tier is not a webinar platform purchase",
        },
        {
          id: "exc-social",
          label: "Social scheduling without webinar rooms",
          notes: "Prefer social-media-marketing",
        },
      ],
      adjacentCategorySlugs: [
        "marketing",
        "business-communications",
        "social-media-marketing",
      ],
      classificationNotes: [
        "WebinarJam/EverWebinar is live + evergreen webinar primary — Kartra family affiliate",
        "Livestorm is browser-based virtual events primary — not a meetings UCaaS peer",
        "Switcher Studio is live production / multistream primary — not a registration platform",
        "Zoom is meetings/phone primary with secondary webinar-virtual-events for Zoom Webinars landscape",
        "Never rank webinar hosts, event platforms, and production tools as one undifferentiated #1",
      ],
    },
    features: [
      feat(
        "webinars",
        "Webinar hosting",
        "Live rooms, registration pages, and attendee experiences.",
        "core",
        true,
        true,
      ),
      feat(
        "evergreen-webinars",
        "Evergreen / simulive webinars",
        "Automated replays that mimic live sessions with scheduled room openings.",
        "core",
        true,
        true,
      ),
      feat(
        "virtual-events",
        "Virtual events",
        "Multi-session events, stages, and attendee networking.",
        "important",
        true,
        true,
      ),
      feat(
        "webinar-registration",
        "Registration & reminders",
        "Signup forms, email reminders, and calendar integrations.",
        "core",
        true,
        true,
      ),
      feat(
        "live-streaming-production",
        "Live stream production",
        "Multi-camera switching, overlays, and multistream outputs.",
        "specialist",
        true,
        true,
      ),
      feat(
        "webinar-analytics",
        "Webinar analytics",
        "Attendance, engagement, polls, and conversion reporting.",
        "important",
        true,
        true,
      ),
      feat(
        "crm-integrations",
        "CRM / MAP integrations",
        "Sync registrants and attendees to CRM or marketing automation.",
        "important",
        true,
        true,
      ),
      feat(
        "video-meetings",
        "Video meetings",
        "Meetings rooms when bundled with webinar SKUs (landscape for Zoom).",
        "optional",
        true,
        false,
        "Meetings-first products stay BC-primary; score webinar depth only when claimed.",
      ),
    ],
    researchRequirements: [
      { domain: "identity", level: "required", featureSlugs: [] },
      {
        domain: "pricing",
        level: "required",
        featureSlugs: [],
        notes: "Per-presenter, per-attendee, and contact-tier models",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["webinars", "evergreen-webinars", "webinar-registration"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
      { domain: "free-trial", level: "recommended", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-webinar-virtual-events-v1",
      slug: "webinar-virtual-events-editorial",
      name: "Webinar & Virtual Events Editorial Methodology",
      version: "1.0.0",
      categorySlug: "webinar-virtual-events",
      description:
        "SoftwareGlimpse evaluates webinar and virtual event platforms on ease of use, webinar job fit (live, evergreen, events, or production), workflow depth, integrations, analytics, scalability, value, and automation. Products are ranked within job clusters only.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Learning curve for hosts and producers.", 12, 0, ["features:webinars"]),
        crit("webinar-job-fit", "Webinar job fit", "Fit to live, evergreen, virtual events, or production cluster.", 15, 1, ["features:webinars", "features:evergreen-webinars", "features:live-streaming-production"]),
        crit("workflow-depth", "Workflow depth", "Registration, reminders, polls, stages, and production workflows.", 12, 2, ["features:webinar-registration", "features:virtual-events"]),
        crit("integrations", "Integrations", "CRM, MAP, calendar, and streaming destination depth.", 10, 3, ["integrations"]),
        crit("analytics", "Analytics", "Attendance, engagement, and conversion reporting.", 10, 4, ["features:webinar-analytics"]),
        crit("audience-scale", "Audience scale", "Attendee caps, concurrent rooms, and reliability at volume.", 10, 5, ["limits", "pricing"]),
        crit("scalability", "Scalability", "Multi-event, multi-host, and enterprise governance.", 8, 6, ["limits"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs capabilities and plan gates.", 13, 7, ["pricing", "plans"]),
        crit("automation", "Automation", "Evergreen/simulive and follow-up automation depth.", 10, 8, ["features:evergreen-webinars"]),
      ],
      notes: "Weights sum to 100. Score within job clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("free-trial", "Free trial", "factual", 1, "medium"),
      cmp("live-webinars", "Live webinars", "editorial", 2, "high", "webinars"),
      cmp("evergreen", "Evergreen / simulive", "editorial", 3, "high", "evergreen-webinars"),
      cmp("virtual-events", "Virtual events", "editorial", 4, "medium", "virtual-events"),
      cmp("production", "Live production", "editorial", 5, "medium", "live-streaming-production"),
      cmp("integrations", "Integrations", "editorial", 6, "high"),
    ],
    pricingDimensions: [
      { id: "pd-wve-hosts", slug: "hosts", name: "Hosts / presenters", enginePrimitive: "per-seat", required: true },
      { id: "pd-wve-attendees", slug: "attendees", name: "Attendees", enginePrimitive: "usage", required: false },
      { id: "pd-wve-contacts", slug: "contacts", name: "Registrants / contacts", enginePrimitive: "usage", required: false },
      { id: "pd-wve-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Per-host and attendee-cap primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-wve-job", slug: "primary-job", name: "Primary job (live vs evergreen vs events vs production)" },
      { id: "rd-wve-audience", slug: "audience-size", name: "Expected audience size" },
      { id: "rd-wve-integrations", slug: "integrations", name: "CRM / MAP integrations needed" },
      { id: "rd-wve-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "DATA_MODEL_READY",
    finderNotes: [
      "Lightweight finder model: audience size, integrations, simulive vs live",
      "Pair with demo checklist tool per expansion brief",
    ],
    useCases: [
      { slug: "webinar-marketing", name: "Webinar marketing", pageEligibility: "content-candidate" },
      { slug: "webinars-events", name: "Webinars & events", pageEligibility: "content-candidate" },
      { slug: "virtual-events", name: "Virtual events", pageEligibility: "content-candidate" },
      { slug: "live-streaming", name: "Live streaming production", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["marketing", "small-business"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    businessTypeSlugs: ["saas", "agency", "startup"],
    seedProductSlugs: [
      "webinarjam-everwebinar",
      "livestorm",
      "switcher-studio",
      "zoom",
    ],
    queryAliases: [
      "webinar software",
      "virtual event platform",
      "webinar hosting",
      "live streaming software",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial", "ai-capabilities"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
    notes: [
      "WebinarJam Aug 2026 wedge — November hub launch consolidates cluster",
      "Zoom landscape anchor — BC-primary with secondary taxonomy here",
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
    id: `feat-wve-${slug}`,
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
    id: `crit-wve-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "webinar-virtual-events",
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
    id: `cmp-wve-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
