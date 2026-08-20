import type { ContactReason } from "@/domain";

/**
 * Single source of truth for contact reasons.
 * Drives intent cards, select options, form variants, query params, and analytics.
 * Client-safe (no Node APIs).
 */

export type ContactIconKey =
  | "check"
  | "message"
  | "building"
  | "link"
  | "megaphone"
  | "shield"
  | "wrench";

export type ContactIconTone =
  | "emerald"
  | "blue"
  | "violet"
  | "amber"
  | "orange"
  | "teal"
  | "rose";

export type ContactReasonDefinition = {
  id: ContactReason;
  /** Select / analytics label */
  label: string;
  /** Intent card + route panel title */
  title: string;
  /** Intent card body */
  description: string;
  /** Hero routes panel one-liner */
  routeBlurb: string;
  /** Form section heading */
  formHeading: string;
  /** Banner / helper above fields */
  helperText: string;
  /** Intent card CTA */
  ctaLabel: string;
  /** Query string value (?reason=) — same as id for forward compat */
  queryValue: ContactReason;
  iconKey: ContactIconKey;
  tone: ContactIconTone;
  /** Show in the primary intent-card grid */
  showInIntentGrid: boolean;
  /** Sidebar tips when this reason is active */
  sidebarTitle: string;
  sidebarTips: string[];
  sidebarNote?: string;
  /** Which optional / contextual fields to surface */
  fields: {
    relatedUrl: { show: boolean; required: boolean; label: string; hint?: string };
    company: { show: boolean; required: boolean; label: string };
    product: { show: boolean; label: string };
    website: { show: boolean; label: string };
    subject: { show: boolean; label: string };
    /** Correction-specific structured message parts */
    whatWrong: { show: boolean; label: string };
    whatCorrect: { show: boolean; label: string };
    sourceUrl: { show: boolean; label: string; hint?: string };
    browser: { show: boolean; label: string; hint?: string };
    message: { label: string; hint?: string };
  };
};

export const CONTACT_REASON_DEFINITIONS: readonly ContactReasonDefinition[] = [
  {
    id: "correction",
    label: "Correction / factual issue",
    title: "Correction / factual issue",
    description:
      "Found outdated pricing, product information, a broken link or misleading context?",
    routeBlurb: "Pricing, features, broken links or outdated information",
    formHeading: "Report a correction",
    helperText:
      "Tell us what appears outdated or incorrect. Include the page URL and the specific information we should review. Your message is routed to the editorial team — it will not subscribe you to marketing.",
    ctaLabel: "Report an issue",
    queryValue: "correction",
    iconKey: "check",
    tone: "emerald",
    showInIntentGrid: true,
    sidebarTitle: "Sending a correction?",
    sidebarTips: [
      "Page URL",
      "What information looks wrong",
      "What you believe the correct information is",
      "A source if available",
    ],
    sidebarNote:
      "Research corrections help us keep SoftwareGlimpse current.",
    fields: {
      relatedUrl: {
        show: true,
        required: true,
        label: "Page URL",
        hint: "The SoftwareGlimpse page that needs review",
      },
      company: { show: false, required: false, label: "Company" },
      product: { show: false, label: "Product" },
      website: { show: false, label: "Website" },
      subject: { show: false, label: "Subject" },
      whatWrong: { show: true, label: "What looks wrong?" },
      whatCorrect: {
        show: true,
        label: "What is the correct information?",
      },
      sourceUrl: {
        show: true,
        label: "Source / supporting URL (optional)",
        hint: "Official docs, changelog, or pricing page if you have one",
      },
      browser: { show: false, label: "Browser / device" },
      message: {
        label: "Additional context (optional)",
        hint: "Anything else that helps us verify the correction",
      },
    },
  },
  {
    id: "general",
    label: "General question",
    title: "General question",
    description:
      "Have a question about SoftwareGlimpse, our research or how the site works?",
    routeBlurb: "Questions about SoftwareGlimpse",
    formHeading: "Send us a question",
    helperText:
      "Ask about SoftwareGlimpse, our research approach, or how the site works. We route messages appropriately and do not use this form for marketing signup.",
    ctaLabel: "Ask a question",
    queryValue: "general",
    iconKey: "message",
    tone: "blue",
    showInIntentGrid: true,
    sidebarTitle: "General questions",
    sidebarTips: [
      "What you are trying to find or understand",
      "Any relevant page URL",
      "Enough context for a useful reply",
    ],
    fields: {
      relatedUrl: {
        show: true,
        required: false,
        label: "Related page URL (optional)",
      },
      company: { show: false, required: false, label: "Company" },
      product: { show: false, label: "Product" },
      website: { show: false, label: "Website" },
      subject: { show: true, label: "Subject" },
      whatWrong: { show: false, label: "What looks wrong?" },
      whatCorrect: { show: false, label: "What is the correct information?" },
      sourceUrl: { show: false, label: "Source URL" },
      browser: { show: false, label: "Browser / device" },
      message: { label: "Message", hint: "Share as much useful detail as you can" },
    },
  },
  {
    id: "vendor",
    label: "Software / vendor enquiry",
    title: "Software / vendor enquiry",
    description:
      "Are you a software company with product updates, corrections or research information?",
    routeBlurb: "Product updates or corrections from software companies",
    formHeading: "Software / vendor enquiry",
    helperText:
      "Share factual product updates, pricing changes, or source material. Providing information does not guarantee inclusion, ranking, or a favorable editorial assessment.",
    ctaLabel: "Contact editorial",
    queryValue: "vendor",
    iconKey: "building",
    tone: "violet",
    showInIntentGrid: true,
    sidebarTitle: "Vendor information",
    sidebarTips: [
      "Company and product name",
      "What changed (pricing, features, docs)",
      "Relevant SoftwareGlimpse page URL",
      "Official source URLs when available",
    ],
    sidebarNote:
      "Factual updates are welcome. They do not guarantee inclusion or ranking changes.",
    fields: {
      relatedUrl: {
        show: true,
        required: false,
        label: "Relevant page URL (optional)",
      },
      company: { show: true, required: false, label: "Company" },
      product: { show: true, label: "Product" },
      website: { show: false, label: "Website" },
      subject: { show: false, label: "Subject" },
      whatWrong: { show: false, label: "What looks wrong?" },
      whatCorrect: { show: false, label: "What is the correct information?" },
      sourceUrl: {
        show: true,
        label: "Official source URL (optional)",
        hint: "Docs, pricing, or changelog we can verify",
      },
      browser: { show: false, label: "Browser / device" },
      message: {
        label: "Message",
        hint: "Describe the update or correction clearly",
      },
    },
  },
  {
    id: "affiliate",
    label: "Affiliate / partnership",
    title: "Affiliate / partnership",
    description:
      "Interested in discussing an affiliate relationship or commercial partnership?",
    routeBlurb: "Commercial and affiliate discussions",
    formHeading: "Affiliate / partnership enquiry",
    helperText:
      "Affiliate status does not determine rankings, Finder results, or editorial conclusions. We currently do not offer sponsored rankings or paid editorial placement.",
    ctaLabel: "Partnership enquiry",
    queryValue: "affiliate",
    iconKey: "link",
    tone: "amber",
    showInIntentGrid: true,
    sidebarTitle: "Partnerships",
    sidebarTips: [
      "Company name and website",
      "What kind of partnership you have in mind",
      "Relevant product or category context",
    ],
    sidebarNote:
      "Commercial relationships never rewrite editorial rankings.",
    fields: {
      relatedUrl: { show: false, required: false, label: "Related URL" },
      company: { show: true, required: false, label: "Company" },
      product: { show: false, label: "Product" },
      website: { show: true, label: "Website" },
      subject: { show: false, label: "Subject" },
      whatWrong: { show: false, label: "What looks wrong?" },
      whatCorrect: { show: false, label: "What is the correct information?" },
      sourceUrl: { show: false, label: "Source URL" },
      browser: { show: false, label: "Browser / device" },
      message: { label: "Message" },
    },
  },
  {
    id: "advertising",
    label: "Advertising / sponsorship",
    title: "Advertising / sponsorship",
    description:
      "We currently do not offer sponsored rankings or paid editorial placement.",
    routeBlurb: "Sponsorship enquiries (programmes not currently offered)",
    formHeading: "Advertising / sponsorship enquiry",
    helperText:
      "We currently do not offer sponsored rankings or paid editorial placement. You can still send a message if you have a commercial question — affiliate status never affects rankings.",
    ctaLabel: "Commercial enquiry",
    queryValue: "advertising",
    iconKey: "megaphone",
    tone: "orange",
    showInIntentGrid: false,
    sidebarTitle: "Advertising",
    sidebarTips: [
      "Company and contact details",
      "What you are proposing",
    ],
    sidebarNote:
      "Sponsored rankings and paid editorial placement are not offered.",
    fields: {
      relatedUrl: { show: false, required: false, label: "Related URL" },
      company: { show: true, required: false, label: "Company" },
      product: { show: false, label: "Product" },
      website: { show: true, label: "Website" },
      subject: { show: false, label: "Subject" },
      whatWrong: { show: false, label: "What looks wrong?" },
      whatCorrect: { show: false, label: "What is the correct information?" },
      sourceUrl: { show: false, label: "Source URL" },
      browser: { show: false, label: "Browser / device" },
      message: { label: "Message" },
    },
  },
  {
    id: "privacy",
    label: "Privacy",
    title: "Privacy request",
    description:
      "Request access, correction, deletion, unsubscribe handling or another privacy action.",
    routeBlurb: "Access, deletion or correction requests",
    formHeading: "Privacy request",
    helperText:
      "Tell us whether you need access, deletion, correction, unsubscribe, or another privacy action. Share only what is needed to process the request — avoid unnecessary sensitive data.",
    ctaLabel: "Privacy request",
    queryValue: "privacy",
    iconKey: "shield",
    tone: "teal",
    showInIntentGrid: true,
    sidebarTitle: "Privacy requests",
    sidebarTips: [
      "The type of request (access, deletion, correction, unsubscribe, other)",
      "The email address the request relates to",
      "Only the details needed to act on your request",
    ],
    sidebarNote:
      "Contact submissions are not used to subscribe you to marketing.",
    fields: {
      relatedUrl: { show: false, required: false, label: "Related URL" },
      company: { show: false, required: false, label: "Company" },
      product: { show: false, label: "Product" },
      website: { show: false, label: "Website" },
      subject: { show: false, label: "Subject" },
      whatWrong: { show: false, label: "What looks wrong?" },
      whatCorrect: { show: false, label: "What is the correct information?" },
      sourceUrl: { show: false, label: "Source URL" },
      browser: { show: false, label: "Browser / device" },
      message: {
        label: "Request details",
        hint: "State the privacy action you need and any necessary identifiers",
      },
    },
  },
  {
    id: "technical",
    label: "Technical problem",
    title: "Technical / accessibility issue",
    description:
      "Report a site problem, broken experience or accessibility barrier.",
    routeBlurb: "Accessibility or site problems",
    formHeading: "Report a technical problem",
    helperText:
      "Describe what happened, which page or interaction was affected, and any steps to reproduce. Accessibility barriers are welcome reports.",
    ctaLabel: "Report technical issue",
    queryValue: "technical",
    iconKey: "wrench",
    tone: "rose",
    showInIntentGrid: true,
    sidebarTitle: "Technical reports",
    sidebarTips: [
      "Page URL if relevant",
      "What you expected vs what happened",
      "Browser or device details if useful",
    ],
    fields: {
      relatedUrl: {
        show: true,
        required: false,
        label: "Page URL (optional)",
      },
      company: { show: false, required: false, label: "Company" },
      product: { show: false, label: "Product" },
      website: { show: false, label: "Website" },
      subject: { show: false, label: "Subject" },
      whatWrong: { show: false, label: "What looks wrong?" },
      whatCorrect: { show: false, label: "What is the correct information?" },
      sourceUrl: { show: false, label: "Source URL" },
      browser: {
        show: true,
        label: "Browser / device (optional)",
        hint: "e.g. Safari on iPhone, Chrome on Windows",
      },
      message: {
        label: "What happened?",
        hint: "Include steps to reproduce if you can",
      },
    },
  },
] as const;

export const CONTACT_REASON_BY_ID: Record<
  ContactReason,
  ContactReasonDefinition
> = Object.fromEntries(
  CONTACT_REASON_DEFINITIONS.map((def) => [def.id, def]),
) as Record<ContactReason, ContactReasonDefinition>;

export const CONTACT_REASON_LABELS: Record<ContactReason, string> =
  Object.fromEntries(
    CONTACT_REASON_DEFINITIONS.map((def) => [def.id, def.label]),
  ) as Record<ContactReason, string>;

export const CONTACT_INTENT_REASONS = CONTACT_REASON_DEFINITIONS.filter(
  (def) => def.showInIntentGrid,
);

export const CONTACT_QUERY_ALIASES: Record<string, ContactReason> = {
  correction: "correction",
  general: "general",
  vendor: "vendor",
  affiliate: "affiliate",
  advertising: "advertising",
  sponsorship: "advertising",
  privacy: "privacy",
  technical: "technical",
  accessibility: "technical",
};

export function parseContactReasonParam(
  value: string | null | undefined,
  allowed?: readonly ContactReason[],
): ContactReason {
  const key = (value ?? "").trim().toLowerCase();
  const mapped = CONTACT_QUERY_ALIASES[key];
  const allow = allowed ?? CONTACT_REASON_DEFINITIONS.map((d) => d.id);
  if (mapped && allow.includes(mapped)) return mapped;
  return "general";
}

export function getContactReasonDefinition(
  id: ContactReason,
): ContactReasonDefinition {
  return CONTACT_REASON_BY_ID[id];
}

/** Compose API `message` from contextual UI fields without changing the wire schema. */
export function composeContactMessage(input: {
  reason: ContactReason;
  message: string;
  subject?: string;
  product?: string;
  website?: string;
  whatWrong?: string;
  whatCorrect?: string;
  sourceUrl?: string;
  browser?: string;
}): string {
  const parts: string[] = [];
  const def = getContactReasonDefinition(input.reason);

  if (def.fields.subject.show && input.subject?.trim()) {
    parts.push(`Subject: ${input.subject.trim()}`);
  }
  if (def.fields.product.show && input.product?.trim()) {
    parts.push(`Product: ${input.product.trim()}`);
  }
  if (def.fields.website.show && input.website?.trim()) {
    parts.push(`Website: ${input.website.trim()}`);
  }
  if (def.fields.whatWrong.show && input.whatWrong?.trim()) {
    parts.push(`What looks wrong:\n${input.whatWrong.trim()}`);
  }
  if (def.fields.whatCorrect.show && input.whatCorrect?.trim()) {
    parts.push(`Correct information:\n${input.whatCorrect.trim()}`);
  }
  if (def.fields.sourceUrl.show && input.sourceUrl?.trim()) {
    parts.push(`Source / supporting URL: ${input.sourceUrl.trim()}`);
  }
  if (def.fields.browser.show && input.browser?.trim()) {
    parts.push(`Browser / device: ${input.browser.trim()}`);
  }
  if (input.message.trim()) {
    if (def.fields.whatWrong.show) {
      parts.push(`Additional context:\n${input.message.trim()}`);
    } else {
      parts.push(input.message.trim());
    }
  }

  return parts.join("\n\n").trim();
}
