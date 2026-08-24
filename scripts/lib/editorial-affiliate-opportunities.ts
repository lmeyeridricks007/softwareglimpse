/**
 * Curated affiliate programme hints for editorial-only catalogue rows.
 * Ops research — rates change; confirm in vendor dashboard after approval.
 * Never invent PartnerStack slugs; use only official apply URLs.
 */

export type AffiliateOpportunityTier =
  | "apply-first"
  | "pending-dashboard-url"
  | "apply-check"
  | "reuse-live-programme"
  | "partner-only"
  | "no-public-programme"
  | "declined";

export type AffiliateOpportunityHint = {
  tier: AffiliateOpportunityTier;
  applyUrl?: string;
  network?: string;
  pays?: string;
  notes?: string;
};

/** Shared programme — one apply covers multiple slugs */
export const PROGRAMME_FAMILIES: Record<
  string,
  Omit<AffiliateOpportunityHint, "tier"> & { slugs: string[] }
> = {
  freshworks: {
    slugs: [
      "freshsales",
      "freshdesk",
      "freshservice",
      "freshchat",
      "freshcaller",
      "freshmarketer",
      "freshteam",
    ],
    applyUrl:
      "https://www.freshworks.com/partners/affiliate-partner-individual/",
    network: "PartnerStack / Impact",
    pays: "20% first-year recurring default; volume tiers to 25%+",
    notes:
      "One application unlocks all Freshworks SKUs. Paste each product homepage link from PartnerStack after approval (freshsales URL is wired — copy pattern per SKU).",
  },
  zoho: {
    slugs: ["zoho-crm", "zoho-desk"],
    applyUrl: "https://www.zoho.com/affiliate/",
    network: "Zoho in-house",
    pays: "15–20% of revenue for 12 months (tiered); 90-day cookie",
    notes:
      "Cannot also be a Zoho consulting/reseller partner. Commission on first Zoho product in account only.",
  },
};

const EXPLICIT: Record<string, AffiliateOpportunityHint> = {
  hubspot: {
    tier: "apply-first",
    applyUrl: "https://www.hubspot.com/partners/affiliates",
    network: "Impact",
    pays: "30% recurring up to 12 months; 180-day cookie",
    notes: "Content sites OK; coupon/cashback often rejected.",
  },
  "apollo-io": {
    tier: "apply-first",
    applyUrl: "https://www.apollo.io/partners/affiliates",
    network: "PartnerStack",
    pays: "15% monthly / 20% annual × 12 months",
  },
  apollo: {
    tier: "apply-first",
    applyUrl: "https://www.apollo.io/partners/affiliates",
    network: "PartnerStack",
    pays: "15% monthly / 20% annual × 12 months",
  },
  activecampaign: {
    tier: "apply-first",
    applyUrl: "https://www.activecampaign.com/partners/affiliate",
    network: "PartnerStack",
    pays: "30% recurring × 12 months",
  },
  shopify: {
    tier: "apply-first",
    applyUrl: "https://www.shopify.com/affiliates",
    network: "Impact",
    pays: "Up to $150 one-time per qualified plan signup (geo-based)",
  },
  "zendesk-suite": {
    tier: "apply-first",
    applyUrl: "https://www.zendesk.com/programs/affiliate-program/",
    network: "PartnerStack",
    pays: "15% of first-year sales",
  },
  zendesk: {
    tier: "apply-first",
    applyUrl: "https://www.zendesk.com/programs/affiliate-program/",
    network: "PartnerStack",
    pays: "15% of first-year sales",
  },
  webflow: {
    tier: "apply-first",
    applyUrl: "https://webflow.com/solutions/affiliates",
    network: "PartnerStack",
    pays: "First-subscription commission up to 12 months (rate in dashboard)",
  },
  beehiiv: {
    tier: "apply-first",
    applyUrl: "https://www.beehiiv.com/partners",
    pays: "50% referred revenue × 12 months (up to 60% at Gold)",
  },
  mailerlite: {
    tier: "apply-first",
    applyUrl: "https://www.mailerlite.com/affiliate",
    pays: "30% recurring for customer lifetime",
  },
  hunter: {
    tier: "apply-first",
    applyUrl: "https://hunter.io/affiliate-program",
    pays: "30% recurring × 12 months",
  },
  "snov-io": {
    tier: "apply-first",
    applyUrl:
      "https://snov.io/knowledgebase/how-snov-io-affiliate-program-works/",
    pays: "40% on premium plan purchases",
  },
  snov: {
    tier: "apply-first",
    applyUrl:
      "https://snov.io/knowledgebase/how-snov-io-affiliate-program-works/",
    pays: "40% on premium plan purchases",
  },
  clickup: {
    tier: "apply-first",
    applyUrl: "https://clickup.com/partners/affiliates",
    network: "PartnerStack",
    pays: "Up to $25 CPA per new free workspace (geo-based)",
  },
  printful: {
    tier: "apply-first",
    applyUrl: "https://www.printful.com/affiliates",
    pays: "10% of orders × 12 months",
  },
  printify: {
    tier: "apply-first",
    applyUrl: "https://printify.com/affiliate",
    pays: "5% catalog product price × 12 months",
  },
  lemlist: {
    tier: "apply-first",
    applyUrl: "https://www.lemlist.com/service-partners",
    network: "PartnerStack",
    pays: "25% of plan within 30-day click window",
    notes: "Choose Affiliate track, not agency service partner.",
  },
  omnisend: {
    tier: "apply-check",
    applyUrl: "https://www.omnisend.com/partners/",
    pays: "~20% recurring up to 24 months (confirm on Impact)",
  },
  bitrix24: {
    tier: "apply-check",
    applyUrl: "https://www.bitrix24.com/partners/",
    notes: "Often has in-house affiliate — confirm current % on apply",
  },
  mailchimp: {
    tier: "apply-check",
    applyUrl: "https://mailchimp.com/help/earn-commission/",
    pays: "25% new connected paid referrals (Mailchimp & Co agency model)",
    notes: "Agency connected-accounts track, not classic review-site CPA.",
  },
  gorgias: {
    tier: "apply-check",
    applyUrl: "https://www.gorgias.com/partners",
    notes: "Ecommerce helpdesk — confirm affiliate vs agency track",
  },
  "help-scout": {
    tier: "apply-check",
    applyUrl: "https://www.helpscout.com/partners/",
  },
  livechat: {
    tier: "apply-check",
    applyUrl: "https://www.livechat.com/affiliates/",
    notes: "Text/LiveChat — confirm PartnerStack or in-house",
  },
  manychat: {
    tier: "apply-check",
    applyUrl: "https://manychat.com/affiliate",
  },
  openphone: {
    tier: "apply-check",
    applyUrl: "https://www.openphone.com/affiliates",
  },
  "respond-io": {
    tier: "apply-check",
    applyUrl: "https://respond.io/partners",
  },
  wix: {
    tier: "apply-check",
    applyUrl: "https://www.wix.com/affiliates",
    network: "Impact (historically)",
  },
  squarespace: {
    tier: "apply-check",
    applyUrl: "https://www.squarespace.com/affiliates",
  },
  woocommerce: {
    tier: "apply-check",
    applyUrl: "https://woocommerce.com/affiliates/",
    notes: "Automattic affiliate — confirm current terms",
  },
  ecwid: {
    tier: "apply-check",
    applyUrl: "https://www.ecwid.com/affiliates",
  },
  bigcommerce: {
    tier: "apply-check",
    applyUrl: "https://www.bigcommerce.com/partners/",
  },
  brevo: {
    tier: "apply-check",
    applyUrl: "https://www.brevo.com/partners/",
  },
  "constant-contact": {
    tier: "apply-check",
    applyUrl: "https://www.constantcontact.com/affiliates",
  },
  drip: {
    tier: "apply-check",
    applyUrl: "https://www.drip.com/partners",
  },
  moosend: {
    tier: "apply-check",
    applyUrl: "https://moosend.com/affiliates/",
  },
  smartlead: {
    tier: "apply-check",
    applyUrl: "https://www.smartlead.ai/affiliate",
  },
  kaspr: {
    tier: "apply-check",
    applyUrl: "https://www.kaspr.io/affiliate",
  },
  uplead: {
    tier: "apply-check",
    applyUrl: "https://www.uplead.com/affiliates/",
  },
  "adapt-io": {
    tier: "apply-check",
    applyUrl: "https://www.adapt.io/affiliate-program",
  },
  zapier: {
    tier: "apply-check",
    applyUrl: "https://zapier.com/l/partner-program",
    notes: "Confirm publisher vs solution partner track",
  },
  fireflies: {
    tier: "apply-check",
    applyUrl: "https://fireflies.ai/affiliate",
  },
  synthesia: {
    tier: "apply-check",
    applyUrl: "https://www.synthesia.io/affiliate-program",
  },
  n8n: {
    tier: "apply-check",
    applyUrl: "https://n8n.io/affiliate/",
    notes: "Cloud affiliate; OSS has no classic CPA",
  },
  "otter-ai": {
    tier: "apply-check",
    applyUrl: "https://otter.ai/affiliate",
  },
  kinsta: {
    tier: "apply-check",
    applyUrl: "https://kinsta.com/affiliates/",
  },
  cloudways: {
    tier: "apply-check",
    applyUrl: "https://www.cloudways.com/en/affiliate.php",
  },
  siteground: {
    tier: "apply-check",
    applyUrl: "https://www.siteground.com/affiliates",
  },
  "wp-engine": {
    tier: "apply-check",
    applyUrl: "https://wpengine.com/partners/",
  },
  sentry: {
    tier: "apply-check",
    applyUrl: "https://sentry.io/for/partners/",
  },
  buffer: {
    tier: "apply-check",
    applyUrl: "https://buffer.com/affiliates",
  },
  agorapulse: {
    tier: "apply-check",
    applyUrl: "https://www.agorapulse.com/affiliates/",
  },
  later: {
    tier: "apply-check",
    applyUrl: "https://later.com/affiliate-program/",
  },
  clickfunnels: {
    tier: "apply-check",
    applyUrl: "https://www.clickfunnels.com/affiliates",
    pays: "~30–40% recurring (confirm on apply)",
  },
  asana: {
    tier: "apply-check",
    applyUrl: "https://asana.com/partners/affiliates",
  },
  todoist: {
    tier: "apply-check",
    applyUrl: "https://todoist.com/affiliates",
  },
  wrike: {
    tier: "apply-check",
    applyUrl: "https://www.wrike.com/affiliates/",
  },
  airtable: {
    tier: "apply-check",
    applyUrl: "https://airtable.com/affiliates",
  },
  workable: {
    tier: "apply-check",
    applyUrl: "https://www.workable.com/affiliates",
  },
  homebase: {
    tier: "apply-check",
    applyUrl: "https://joinhomebase.com/affiliates/",
  },
  "when-i-work": {
    tier: "apply-check",
    applyUrl: "https://wheniwork.com/affiliates/",
  },
  deputy: {
    tier: "apply-check",
    applyUrl: "https://www.deputy.com/partners/affiliate",
  },
  "7shifts": {
    tier: "apply-check",
    applyUrl: "https://www.7shifts.com/affiliates/",
  },
  gusto: {
    tier: "apply-check",
    applyUrl: "https://gusto.com/partners",
    notes: "Often partner/reseller — confirm publisher track",
  },
  // Pending dashboard URL (in partner-links.ts)
  freshdesk: { tier: "pending-dashboard-url", network: "Impact / Freshworks" },
  freshservice: { tier: "pending-dashboard-url", network: "Impact / Freshworks" },
  freshchat: { tier: "pending-dashboard-url", network: "Impact / Freshworks" },
  freshcaller: { tier: "pending-dashboard-url", network: "Impact / Freshworks" },
  freshmarketer: { tier: "pending-dashboard-url", network: "Impact / Freshworks" },
  freshteam: { tier: "pending-dashboard-url", network: "Impact / Freshworks" },
  livestorm: {
    tier: "pending-dashboard-url",
    applyUrl: "https://livestorm.co/partners",
    notes: "Active inventory — paste PartnerStack homepage link after login",
  },
  uniqode: {
    tier: "pending-dashboard-url",
    applyUrl: "https://www.uniqode.com/partners",
    notes: "Active inventory — paste PartnerStack link after login",
  },
  motion: {
    tier: "pending-dashboard-url",
    network: "PartnerStack",
    notes: "Programme pending in programmes.json — paste URL via affiliate:set",
  },
  rocketreach: {
    tier: "pending-dashboard-url",
    applyUrl: "https://rocketreach.co/partners",
    notes: "Active inventory — confirm affiliate vs partner track",
  },
  instantly: {
    tier: "declined",
    applyUrl: "https://instantly.ai/affiliate",
    notes: "Application declined Aug 2026 — official site CTA only unless re-approved",
  },
  "monday-sales-crm": {
    tier: "reuse-live-programme",
    notes: "Do not re-apply. Add slug to existing monday.com programme in programmes.json",
  },
  salesforce: {
    tier: "partner-only",
    applyUrl: "https://www.salesforce.com/partners/become-a-partner/",
    notes: "No public content-affiliate % — consulting/ISV/reseller only",
  },
  pardot: {
    tier: "partner-only",
    applyUrl: "https://www.salesforce.com/partners/become-a-partner/",
    notes: "Account Engagement — same Salesforce partner path",
  },
  "dynamics-365": {
    tier: "partner-only",
    applyUrl: "https://partner.microsoft.com/",
    notes: "Microsoft Solutions Partner — not a review-site CPA",
  },
  "oracle-cx": {
    tier: "partner-only",
    applyUrl: "https://www.oracle.com/partners/",
  },
  netsuite: {
    tier: "partner-only",
    applyUrl: "https://www.oracle.com/partners/",
  },
  siebel: {
    tier: "partner-only",
    applyUrl: "https://www.oracle.com/partners/",
  },
  pega: {
    tier: "partner-only",
    applyUrl: "https://www.pega.com/partners",
  },
  sap: {
    tier: "partner-only",
    applyUrl: "https://www.sap.com/partners.html",
  },
  servicenow: {
    tier: "partner-only",
    applyUrl: "https://www.servicenow.com/partners.html",
  },
  workday: {
    tier: "partner-only",
    applyUrl: "https://www.workday.com/en-us/company/partners.html",
  },
  "oracle-hcm": {
    tier: "partner-only",
    applyUrl: "https://www.oracle.com/partners/",
  },
  datadog: {
    tier: "partner-only",
    applyUrl: "https://www.datadoghq.com/partner/network/",
  },
  chatgpt: {
    tier: "no-public-programme",
    notes: "OpenAI — no publisher affiliate for ChatGPT consumer",
  },
  claude: {
    tier: "no-public-programme",
    notes: "Anthropic — no public review-site affiliate",
  },
  gemini: {
    tier: "no-public-programme",
    notes: "Google — ads/partner tracks only",
  },
  "microsoft-copilot": {
    tier: "partner-only",
    applyUrl: "https://partner.microsoft.com/",
  },
  "github-copilot": {
    tier: "no-public-programme",
    notes: "Microsoft/GitHub — no classic publisher CPA",
  },
  cursor: {
    tier: "no-public-programme",
    notes: "No public affiliate programme located",
  },
  "adobe-firefly": {
    tier: "partner-only",
    applyUrl: "https://partners.adobe.com/",
  },
  midjourney: {
    tier: "no-public-programme",
  },
  perplexity: {
    tier: "no-public-programme",
  },
  runway: {
    tier: "no-public-programme",
  },
  slack: {
    tier: "partner-only",
    applyUrl: "https://slack.com/partners",
  },
  "microsoft-teams": {
    tier: "partner-only",
    applyUrl: "https://partner.microsoft.com/",
  },
  zoom: {
    tier: "partner-only",
    applyUrl: "https://partner.zoom.us/",
  },
  intercom: {
    tier: "partner-only",
    applyUrl: "https://www.intercom.com/partners",
    notes: "No open content-affiliate page located",
  },
};

const PARTNER_ONLY_CATEGORIES = new Set([
  "it-development", // default for observability/ITSM — override with explicit check rows
]);

const PARTNER_ONLY_SLUG_PATTERNS = [
  /^(ringcentral|twilio|vonage|dialpad|five9|genesys|talkdesk|8x8|eightx8|nextiva|ooma|goto-connect|webex)$/,
];

export function hintForSlug(
  slug: string,
  category: string,
): AffiliateOpportunityHint {
  if (EXPLICIT[slug]) return EXPLICIT[slug]!;

  for (const family of Object.values(PROGRAMME_FAMILIES)) {
    if (family.slugs.includes(slug)) {
      return {
        tier: family.slugs.includes(slug) && slug !== "freshsales"
          ? "pending-dashboard-url"
          : "apply-first",
        applyUrl: family.applyUrl,
        network: family.network,
        pays: family.pays,
        notes: family.notes,
      };
    }
  }

  if (PARTNER_ONLY_SLUG_PATTERNS.some((re) => re.test(slug))) {
    return {
      tier: "partner-only",
      notes: "CCaaS/CPaaS — agency or reseller partner, not review-site CPA",
    };
  }

  if (
    category === "sales-intelligence" &&
    !["hunter", "lemlist", "smartlead"].includes(slug)
  ) {
    return {
      tier: "partner-only",
      notes:
        "Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA",
    };
  }

  if (category === "hr" && !EXPLICIT[slug]) {
    return {
      tier: "partner-only",
      notes:
        "Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying",
    };
  }

  if (PARTNER_ONLY_CATEGORIES.has(category) && !EXPLICIT[slug]) {
    return {
      tier: "apply-check",
      notes: `Search official site for “${slug} affiliate” or PartnerStack — hosting/proxy vendors sometimes pay`,
    };
  }

  return {
    tier: "apply-check",
    notes: "Search vendor site for partners/affiliate — confirm before inventing URLs",
  };
}

export const TIER_LABELS: Record<AffiliateOpportunityTier, string> = {
  "apply-first": "Apply first — public programme confirmed",
  "pending-dashboard-url": "Approved/pending — paste dashboard URL",
  "apply-check": "Check & apply — programme may exist",
  "reuse-live-programme": "Reuse existing live programme",
  "partner-only": "Partner/reseller only — no review-site CPA",
  "no-public-programme": "No public publisher programme",
  declined: "Declined or inactive",
};
