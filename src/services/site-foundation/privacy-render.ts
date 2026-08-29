import type { SiteFoundationConfig } from "@/domain";
import {
  getSiteFoundationConfig,
  isLegalConfigurationComplete,
  legalConfigurationMissingFields,
} from "./config";

export type PrivacySection = {
  id: string;
  heading: string;
  body: string;
};

function buildControllerSection(
  config: SiteFoundationConfig,
): PrivacySection {
  const identity = config.identity;

  if (!isLegalConfigurationComplete() || !identity.legalEntityName) {
    return {
      id: "controller-incomplete",
      heading: "Data controller",
      body: `LEGAL_CONFIGURATION_INCOMPLETE / LEGAL_REVIEW_REQUIRED: the data controller’s legal identity is not fully configured yet. Missing fields include: ${legalConfigurationMissingFields().join(", ")}. Until those values are supplied and this policy is approved, treat this page as a transparent draft — not a finished GDPR notice with a verified controller name.`,
    };
  }

  return {
    id: "controller",
    heading: "Data controller",
    body: `The data controller is ${identity.legalEntityName}${identity.businessAddress ? `, ${identity.businessAddress}` : ""}${identity.country ? ` (${identity.country})` : ""}. Privacy contact: ${identity.privacyEmail ?? identity.contactEmail ?? "configure privacy email"}.`,
  };
}

function buildPrivacyContactSection(
  config: SiteFoundationConfig,
  topic: "privacy" | "cookies",
): PrivacySection {
  const identity = config.identity;
  const heading =
    topic === "cookies"
      ? "How to contact us about cookies"
      : "How to contact us about privacy";

  return {
    id: "contact-route",
    heading,
    body: identity.privacyEmail
      ? `Email ${identity.privacyEmail}, use the Contact page (reason: Privacy), or /privacy-request/. We do not ask you to send unnecessary sensitive information.`
      : "Use the Contact page (reason: Privacy) or /privacy-request/. A dedicated privacy email will be listed here once configured. We do not ask you to send unnecessary sensitive information.",
  };
}

function buildOperatorSection(
  config: SiteFoundationConfig,
): PrivacySection {
  const identity = config.identity;

  if (!isLegalConfigurationComplete() || !identity.legalEntityName) {
    return {
      id: "operator-incomplete",
      heading: "Operator",
      body: `LEGAL_CONFIGURATION_INCOMPLETE: operator identity is not fully configured. Missing fields include: ${legalConfigurationMissingFields().join(", ")}.`,
    };
  }

  return {
    id: "operator",
    heading: "Operator",
    body: `These Terms of Use are between you and ${identity.legalEntityName}${identity.businessAddress ? `, ${identity.businessAddress}` : ""}${identity.country ? ` (${identity.country})` : ""}. Registration: ${identity.registrationNumber ?? "not stated"}. General contact: ${identity.contactEmail ?? "configure contact email"}. Privacy requests: ${identity.privacyEmail ?? identity.contactEmail ?? "configure privacy email"}.`,
  };
}

/**
 * Build privacy policy sections from actual configuration.
 * Never invents controller identity — surfaces LEGAL_CONFIGURATION_INCOMPLETE.
 */
export function buildPrivacySections(
  config: SiteFoundationConfig = getSiteFoundationConfig(),
): PrivacySection[] {
  const sections: PrivacySection[] = [];

  sections.push(buildControllerSection(config));
  sections.push(buildPrivacyContactSection(config, "privacy"));

  sections.push({
    id: "what-we-collect",
    heading: "What we collect and why",
    body: "The processing activities below reflect the SoftwareGlimpse configuration. Inactive activities (for example newsletter or analytics before a provider is configured) are marked inactive and are not treated as live processing.",
  });

  for (const activity of config.processingActivities) {
    const retention =
      activity.retention ??
      "Retention period not yet configured (LEGAL_REVIEW_REQUIRED).";
    const recipients =
      activity.recipients.length > 0
        ? activity.recipients
            .map((id) => {
              const p = config.processors.find((x) => x.id === id);
              return p
                ? `${p.name}${p.configured ? "" : " (not configured)"}`
                : id;
            })
            .join("; ")
        : "None listed (typically stays on your device or is not shared)";
    const transfer = activity.internationalTransfer
      ? ` International transfers: ${activity.internationalTransfer.destination ?? "destination TBD"}; mechanism: ${activity.internationalTransfer.mechanism ?? "TBD"}.`
      : "";
    sections.push({
      id: `activity-${activity.id}`,
      heading: `${activity.active ? "" : "[Inactive] "}${activity.purpose}`,
      body: `Data categories: ${activity.dataCategories.join("; ")}. Legal basis: ${activity.legalBasis}. Source: ${activity.source}. Recipients / processors: ${recipients}. Retention: ${retention}.${transfer}`,
    });
  }

  sections.push({
    id: "cookies",
    heading: "Cookies and browser storage",
    body: "See the Cookie Policy for the inventory of cookies, localStorage, and sessionStorage in use. Optional analytics technologies only run after consent when required. We distinguish HTTP cookies from local/session storage.",
  });

  sections.push({
    id: "affiliate",
    heading: "Affiliate click data",
    body: "When you use a commercial outbound link, SoftwareGlimpse may send you directly to a stored vendor or partner destination (or, for older shared links, via a first-party /go/ redirect). We may process destination identifiers and click context for routing, analytics, and operations. Partner/vendor sites may process the visit under their own policies for attribution. Affiliate analytics events in our first-party event bus respect analytics consent when a sink is registered; navigation itself is not delayed for analytics.",
  });

  sections.push({
    id: "legal-bases",
    heading: "Legal bases (summary)",
    body: "Consent — cookie preferences and any future newsletter/analytics that require consent. Legitimate interests — responding to contact/privacy requests you submit, operating necessary tool state on your device, and performing first-party commercial redirects you initiate. Other bases will be documented if additional processing is configured.",
  });

  const processorsConfigured = config.processors.filter((p) => p.configured);
  const processorsPending = config.processors.filter((p) => !p.configured);
  sections.push({
    id: "processors",
    heading: "Recipients and processors",
    body: `Configured: ${processorsConfigured.map((p) => `${p.name}${p.dataLocation ? ` (${p.dataLocation})` : ""}`).join("; ") || "none"}. Not yet configured (do not assume live processing): ${processorsPending.map((p) => p.name).join("; ") || "none"}. Where a processor is outside the EEA, we rely on appropriate safeguards documented in our Privacy Policy.`,
  });

  sections.push({
    id: "retention",
    heading: "Retention",
    body: `Consent records: ${config.retention.consentRecords ?? "see consent activity"}. Contact submissions: ${config.retention.contactSubmissions ?? "LEGAL_REVIEW_REQUIRED — not yet configured"}. Newsletter metadata: ${config.retention.newsletterMetadata ?? "N/A until newsletter is enabled"}. Analytics: ${config.retention.analytics ?? "N/A until analytics provider is configured"}. Server logs: ${config.retention.serverLogs ?? "LEGAL_REVIEW_REQUIRED — not yet configured"}.`,
  });

  sections.push({
    id: "rights",
    heading: "Your rights",
    body: "Depending on applicable law (including GDPR where it applies), you may have rights to access, rectify, erase, restrict, or object to certain processing, and to data portability where applicable. Where processing is based on consent, you may withdraw consent (for example via Cookie settings for optional cookies, or unsubscribe for email once a newsletter is live). You may lodge a complaint with a supervisory authority. Use Contact → Privacy to exercise rights — we do not automate legal decisions in the form itself.",
  });

  sections.push({
    id: "changes",
    heading: "Policy updates",
    body: "When processors, cookies, or processing purposes change, Privacy and Cookie policies are flagged for review. Version and last-updated dates change when meaningful updates are made.",
  });

  return sections;
}

export function buildCookiePolicySections(
  config: SiteFoundationConfig = getSiteFoundationConfig(),
): PrivacySection[] {
  const byCategory = new Map<string, typeof config.cookies>();
  for (const cookie of config.cookies) {
    const list = byCategory.get(cookie.category) ?? [];
    list.push(cookie);
    byCategory.set(cookie.category, list);
  }

  const sections: PrivacySection[] = [
    buildControllerSection(config),
    buildPrivacyContactSection(config, "cookies"),
    {
      id: "intro",
      heading: "About this policy",
      body: `This Cookie Policy describes cookies and similar browser storage used on SoftwareGlimpse (${config.identity.siteName}). It lists only technologies actually configured in our inventory — we do not invent cookie names. localStorage and sessionStorage are disclosed separately from HTTP cookies. For broader personal-data processing, see our Privacy Policy. Consent preferences use policy version ${config.consent.version} (effective ${config.consent.effectiveAt}).`,
    },
    {
      id: "what",
      heading: "What cookies and storage are",
      body: "Browsers can store small pieces of data to remember preferences, keep tools working, or (when allowed) measure usage and load official product video embeds. SoftwareGlimpse uses first-party localStorage for consent and tool drafts. YouTube/Vimeo cookies are only set after marketing consent and an explicit play action.",
    },
    {
      id: "legal-bases",
      heading: "Legal bases",
      body: "Strictly necessary storage runs on legitimate interests / necessity to deliver the site and tools you request. Optional categories (preferences, analytics, marketing) rely on your consent via Cookie settings. You can withdraw consent at any time.",
    },
  ];

  for (const category of config.consent.categoriesInUse) {
    const items = byCategory.get(category) ?? [];
    const descKey =
      category === "strictly-necessary"
        ? "strictlyNecessary"
        : (category as "preferences" | "analytics" | "marketing");
    const description =
      config.consent.categoryDescriptions[descKey] ?? "";
    sections.push({
      id: `cat-${category}`,
      heading: category.replace(/-/g, " "),
      body:
        (description ? `${description}\n\n` : "") +
        (items.length === 0
          ? `No ${category} storage entries are currently inventoried${category === "analytics" ? " (analytics category reserved for consent gating)." : "."}`
          : items
              .map(
                (c) =>
                  `${c.name} (${c.storageType}, ${c.provider}): ${c.purpose}. Duration: ${c.duration}. ${c.firstParty ? "First-party" : "Third-party"}.`,
              )
              .join("\n\n")),
    });
  }

  // Categories used in inventory but not in categoriesInUse
  for (const [category, items] of byCategory) {
    if (config.consent.categoriesInUse.includes(category as never)) continue;
    sections.push({
      id: `cat-extra-${category}`,
      heading: `${category.replace(/-/g, " ")} (inventory)`,
      body: items
        .map(
          (c) =>
            `${c.name} (${c.storageType}): ${c.purpose}. Duration: ${c.duration}.`,
        )
        .join("\n\n"),
    });
  }

  sections.push({
    id: "manage",
    heading: "How to change settings",
    body: "Use Cookie settings in the site footer to accept, reject non-essential, or manage preferences. Strictly necessary storage remains active for core function. You can also clear site data in your browser.",
  });

  const hosting = config.processors.find((p) => p.id === "hosting");
  const analyticsProcessors = config.processors.filter(
    (p) =>
      p.configured &&
      (p.id === "analytics" || p.id.startsWith("analytics-")),
  );
  const newsletterProcessor = config.processors.find(
    (p) => p.id === "newsletter",
  );
  const thirdPartyCookieProcessors = config.processors.filter(
    (p) =>
      p.configured &&
      p.id !== "consent-storage" &&
      p.id !== "contact" &&
      p.id !== "analytics" &&
      !p.id.startsWith("analytics-") &&
      p.id !== "newsletter",
  );
  const analyticsCopy =
    analyticsProcessors.length > 0
      ? `Analytics (${analyticsProcessors.map((p) => p.name).join("; ")}) loads only after analytics consent. Vercel Web Analytics is designed to avoid persistent analytics cookies; Google Analytics may set cookies such as _ga / _gid when allowed.`
      : "Analytics provider is not configured — no analytics vendor script is loaded today.";
  const newsletterCopy = newsletterProcessor?.configured
    ? `Newsletter (${newsletterProcessor.name}) may set cookies only when that feature is enabled.`
    : "Newsletter provider is not configured — no newsletter cookies are loaded today.";
  sections.push({
    id: "processors",
    heading: "Third-party services that may set cookies",
    body: `Hosting (${hosting?.name ?? "configured provider"}) delivers the site; it may process technical connection data in server logs. Optional embed providers (YouTube, Vimeo) set cookies only after marketing consent and play. Other configured services: ${thirdPartyCookieProcessors.map((p) => p.name).join("; ") || "none beyond hosting"}. ${analyticsCopy} ${newsletterCopy}`,
  });

  sections.push({
    id: "retention",
    heading: "Retention",
    body: `Consent records: ${config.retention.consentRecords ?? "see consent activity"}. Consent choices renew after ${config.consent.renewAfterDays} days or when the consent policy version changes. Tool-state storage on your device lasts until you clear it.`,
  });

  sections.push({
    id: "rights",
    heading: "Your rights",
    body: `Where GDPR or similar law applies, you may withdraw cookie consent via Cookie settings, request access or erasure of personal data linked to cookies, or lodge a complaint with a supervisory authority. Use Contact → Privacy${config.identity.privacyEmail ? ` or ${config.identity.privacyEmail}` : ""} for requests.`,
  });

  sections.push({
    id: "related",
    heading: "Related policies",
    body: "See the Privacy Policy for full processing activities, retention, and your rights. Affiliate and commercial outbound links are covered there.",
  });

  sections.push({
    id: "changes",
    heading: "Policy updates",
    body: "When we add cookies, storage, or consent categories, this policy is updated and flagged for review. Version and last-updated dates change when meaningful updates are made.",
  });

  return sections;
}

/**
 * Build terms preamble sections from configured operator identity.
 */
export function buildTermsSections(
  config: SiteFoundationConfig = getSiteFoundationConfig(),
): PrivacySection[] {
  const identity = config.identity;
  const governingLaw = config.terms.governingLaw ?? "the Netherlands";

  return [
    buildOperatorSection(config),
    {
      id: "intro",
      heading: "About these terms",
      body: `These Terms of Use govern your access to ${identity.siteName}. By using the site you agree to them, together with the Privacy Policy and Cookie Policy. Disputes are governed by the laws of ${governingLaw}, as stated below.`,
    },
  ];
}

/**
 * Build accessibility statement preamble from configured operator identity.
 */
export function buildAccessibilitySections(
  config: SiteFoundationConfig = getSiteFoundationConfig(),
): PrivacySection[] {
  const identity = config.identity;

  if (!isLegalConfigurationComplete() || !identity.legalEntityName) {
    return [
      {
        id: "operator-incomplete",
        heading: "Operator",
        body: `LEGAL_CONFIGURATION_INCOMPLETE: operator identity is not fully configured. Missing fields include: ${legalConfigurationMissingFields().join(", ")}.`,
      },
      {
        id: "intro",
        heading: "About this statement",
        body: `${identity.siteName} aims to be usable by as many people as possible. This statement will be completed once operator details are configured.`,
      },
    ];
  }

  return [
    {
      id: "operator",
      heading: "Operator",
      body: `This Accessibility Statement applies to ${identity.siteName}, operated by ${identity.legalEntityName}${identity.country ? ` (${identity.country})` : ""}.`,
    },
    {
      id: "intro",
      heading: "About this statement",
      body: `We want ${identity.siteName} to be perceivable, operable, and understandable for as many visitors as possible. This page describes our approach, current conformance status, measures in place, and how to report accessibility barriers. We do not claim WCAG conformance until a formal audit is complete.`,
    },
  ];
}
