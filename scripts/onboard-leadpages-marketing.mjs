#!/usr/bin/env node
/**
 * One-off Leadpages marketing research + editorial pack.
 * Uses shared marketing onboarding runtime (same path as Priority-1 batch).
 */
import { expandMktProduct } from "./lib/mkt-compact-expand.mjs";
import { writeProduct } from "./lib/mkt-onboard-runtime.mjs";

const compact = {
  slug: "leadpages",
  name: "Leadpages",
  company: "Leadpages",
  website: "https://www.leadpages.com",
  domain: "leadpages.com",
  pricingUrl: "https://www.leadpages.com/pricing",
  softShortDescription:
    "AI landing-page and CRO platform with A/B testing, Smart Traffic, heatmaps, and lead enrichment — plus HTML Pub publishing plans from $10/mo.",
  shortDescription:
    "Leadpages is a conversion-focused landing page, website, and blog platform with AI page creation, A/B testing, Smart Traffic, heatmaps, and lead enrichment. Leadpages Grow/Optimize/Scale start at $99/$199/$399 per month (monthly; ~20% off annual); HTML Pub publishing plans start at $10/mo. 7-day free trial; unlimited traffic on Leadpages plans. Confirm live promotions.",
  vendorPositioning:
    "AI landing page builder that keeps optimizing — A/B testing, Smart Traffic, and heatmaps so pages get smarter with every visitor.",
  pricingModel: "subscription",
  hasFreePlan: false,
  hasFreeTrial: true,
  trialDays: 7,
  startingPriceMonthly: 99,
  pricingNotes:
    "Verified 2026-08-17 from leadpages.com/pricing. HTML Pub: Starter $10, Pro $29, Business $49/mo. Leadpages: Grow $99, Optimize $199, Scale $399/mo (monthly); annual ~20% off marketed. 7-day free trial; card required. A/B testing from Grow; Smart Traffic + heatmaps from Optimize. Unlimited traffic on Leadpages plans. Confirm live promo pricing.",
  pricingSummary:
    "No forever-free plan. HTML Pub from $10/mo; Leadpages Grow from $99/mo, Optimize $199/mo, Scale $399/mo. 7-day trial. Unlimited traffic on Leadpages plans. Confirm live.",
  plans: [
    {
      kind: "flat",
      slug: "htmlpub-starter",
      name: "HTML Pub Starter",
      amount: 10,
      description: "HTML Pub Starter from $10/mo — 5 pages, 1 custom domain, AI credits.",
    },
    {
      kind: "flat",
      slug: "htmlpub-pro",
      name: "HTML Pub Pro",
      amount: 29,
      description: "HTML Pub Pro from $29/mo — 25 pages, AI editor, custom domain + SSL.",
    },
    {
      kind: "flat",
      slug: "htmlpub-business",
      name: "HTML Pub Business",
      amount: 49,
      description: "HTML Pub Business from $49/mo — 50 pages, 2 domains, higher AI credits.",
    },
    {
      kind: "flat",
      slug: "grow",
      name: "Grow",
      amount: 99,
      highlighted: true,
      description:
        "Leadpages Grow from $99/mo — unlimited pages/traffic, manual A/B testing, dynamic text, lead enrichment.",
    },
    {
      kind: "flat",
      slug: "optimize",
      name: "Optimize",
      amount: 199,
      description:
        "Leadpages Optimize from $199/mo — Smart Traffic, heatmaps, auto-personalization, more integrations.",
    },
    {
      kind: "flat",
      slug: "scale",
      name: "Scale",
      amount: 399,
      description:
        "Leadpages Scale from $399/mo — full auto-optimization, team seats/workspaces, dedicated CSM.",
    },
  ],
  featureOverrides: {
    "social-scheduling": "unsupported",
    "content-calendar": "limited",
    "social-listening": "unsupported",
    "funnel-builder": "limited",
    "landing-pages": "supported",
    "marketing-automation": "limited",
    "forms-lead-capture": "supported",
    analytics: "supported",
    "ads-management": "limited",
    "reputation-reviews": "unsupported",
    webinars: "unsupported",
    "email-sms-channels": "limited",
    "team-collaboration": "supported",
    "ai-content-generation": "supported",
  },
  aiLines: [
    "email-generation: supported",
    "assistant: supported",
    "automation: supported",
    "recommendations: supported",
  ],
  integrations: [
    { integrationSlug: "hubspot", kind: "native" },
    { integrationSlug: "salesforce", kind: "native" },
    { integrationSlug: "mailchimp", kind: "native" },
    { integrationSlug: "stripe", kind: "native" },
    { integrationSlug: "shopify", kind: "native" },
    { integrationSlug: "zapier", kind: "zapier-style" },
  ],
  limitations: [
    "No forever-free plan — paid publishing from HTML Pub Starter",
    "A/B testing starts on Leadpages Grow, not HTML Pub tiers",
    "Smart Traffic and heatmaps gated to Optimize+",
    "Not a full creator all-in-one (courses/memberships) like Kartra",
    "Not an enterprise B2B MAP like Marketo",
  ],
  scores: {
    "ease-of-use": 8,
    "campaign-content": 8,
    "marketing-automation": 5,
    "funnel-conversion": 9,
    "analytics-attribution": 8,
    "brand-monitoring": 2,
    integrations: 8,
    scalability: 7,
    "value-for-money": 7,
    "ai-capabilities": 8,
  },
  bestFor: [
    "Marketers whose primary job is landing-page CRO with A/B testing and heatmaps",
    "Teams that want unlimited traffic without Unbounce-style visitor caps",
    "Buyers comparing ClickFunnels when conversion pages matter more than course/checkout stacks",
  ],
  notIdealFor: [
    "Buyers who only need social scheduling or brand listening",
    "Creators needing courses, memberships, and checkouts in one suite",
    "Enterprise B2B MAP / Adobe Experience Cloud stacks",
  ],
  pros: [
    "Landing-page + CRO center of gravity (A/B, Smart Traffic, heatmaps)",
    "Unlimited traffic on Leadpages plans",
    "AI page creation and published Grow/Optimize/Scale ladder",
    "Strong CRM/ESP integrations (HubSpot, Salesforce, Mailchimp)",
    "7-day trial reduces buy risk",
  ],
  cons: [
    "HTML Pub vs Leadpages ladder can confuse buyers",
    "CRO features gated above publishing-only tiers",
    "Weak on social listening / scheduling",
    "Not Kartra-class all-in-one creator suite",
    "Not Marketo-class enterprise MAP",
  ],
  keyFeatures: [
    "AI landing page creation",
    "A/B testing and Smart Traffic",
    "Click and scroll heatmaps",
    "Lead capture forms and enrichment",
    "Websites, blogs, and custom domains",
  ],
  whoShouldChoose:
    "Choose Leadpages when landing-page conversion optimization — A/B testing, Smart Traffic, heatmaps, and lead capture — is the primary job.",
  whoShouldConsiderAlternatives:
    "Compare ClickFunnels or Kartra for funnel/all-in-one creator stacks; Marketo for enterprise B2B MAP; a dedicated ESP if you only need email.",
  competitorSlugs: [
    "clickfunnels",
    "kartra",
    "freshmarketer",
    "getresponse",
    "marketo",
  ],
  alternativeSlugs: ["clickfunnels", "kartra", "freshmarketer"],
  comparableSlugs: ["clickfunnels", "kartra"],
  useCaseSlugs: ["lead-generation", "marketing-automation"],
  teamTypeSlugs: ["marketing"],
  businessSizeSlugs: ["small-business", "mid-market"],
};

const product = expandMktProduct(compact);
writeProduct(product);
console.log("Leadpages research + assessment + review written.");
