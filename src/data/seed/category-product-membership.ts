/**
 * Category membership patches — launch-doc recategorizations + density tags.
 * Merged in catalog loadSoftware(); one entry per product slug.
 */
import type { Software } from "@/domain";

export type CategoryMembershipPatch = {
  primaryCategorySlug?: string;
  addSecondaryCategorySlugs?: string[];
  addSubcategorySlugs?: string[];
};

export const categoryMembershipPatches: Record<string, CategoryMembershipPatch> =
  {
    // Tier 13 — social-media-marketing
    brand24: {
      primaryCategorySlug: "social-media-marketing",
      addSecondaryCategorySlugs: ["marketing", "analytics-bi"],
    },
    zypper: {
      primaryCategorySlug: "social-media-marketing",
      addSecondaryCategorySlugs: ["marketing"],
    },
    meltwater: {
      addSecondaryCategorySlugs: ["social-media-marketing", "analytics-bi"],
    },
    brandwatch: { addSecondaryCategorySlugs: ["social-media-marketing"] },
    "sprout-social": { addSecondaryCategorySlugs: ["social-media-marketing"] },

    // Tier 14 — webinar-virtual-events
    livestorm: {
      primaryCategorySlug: "webinar-virtual-events",
      addSecondaryCategorySlugs: ["marketing"],
    },
    "switcher-studio": {
      primaryCategorySlug: "webinar-virtual-events",
      addSecondaryCategorySlugs: ["marketing"],
    },
    zoom: { addSecondaryCategorySlugs: ["webinar-virtual-events"] },
    "microsoft-teams": { addSecondaryCategorySlugs: ["webinar-virtual-events"] },
    webex: { addSecondaryCategorySlugs: ["webinar-virtual-events"] },

    // Tier 15 — lms-course-creation
    learnworlds: {
      primaryCategorySlug: "lms-course-creation",
      addSecondaryCategorySlugs: ["marketing", "hr"],
    },
    trainual: {
      primaryCategorySlug: "lms-course-creation",
      addSecondaryCategorySlugs: ["hr"],
    },
    kartra: { addSecondaryCategorySlugs: ["lms-course-creation"] },
    clickfunnels: {
      addSecondaryCategorySlugs: [
        "lms-course-creation",
        "landing-pages-cro",
      ],
    },

    // Tier 17 — analytics-bi
    whatconverts: {
      primaryCategorySlug: "analytics-bi",
      addSecondaryCategorySlugs: ["marketing"],
    },

    // social-media-management
    later: { addSecondaryCategorySlugs: ["social-media-management"] },
    agorapulse: { addSecondaryCategorySlugs: ["social-media-management"] },

    // landing-pages-cro
    getresponse: { addSecondaryCategorySlugs: ["landing-pages-cro"] },

    // field-service-operations
    connecteam: { addSecondaryCategorySlugs: ["field-service-operations"] },
    jibble: { addSecondaryCategorySlugs: ["field-service-operations"] },

    // reputation-reviews (thin affiliate inventory — local-business adjacency)
    shore: { addSecondaryCategorySlugs: ["reputation-reviews"] },
    ueni: {
      addSecondaryCategorySlugs: [
        "ai-website-builder",
        "website-digital-presence",
        "reputation-reviews",
      ],
    },
    uniqode: {
      addSecondaryCategorySlugs: [
        "ppc-advertising",
        "analytics-bi",
        "reputation-reviews",
      ],
    },
    wati: { addSecondaryCategorySlugs: ["reputation-reviews"] },

    // ai-writing
    quillbot: {
      primaryCategorySlug: "ai-writing",
      addSecondaryCategorySlugs: ["ai"],
    },
    writesonic: {
      primaryCategorySlug: "ai-writing",
      addSecondaryCategorySlugs: ["ai"],
    },
    "rank-prompt": { addSecondaryCategorySlugs: ["ai-writing"] },
    "adcreative-ai": {
      addSecondaryCategorySlugs: ["ai-writing", "ppc-advertising"],
    },

    // ai-website-builder
    wegic: {
      primaryCategorySlug: "ai-website-builder",
      addSecondaryCategorySlugs: ["ai", "website-digital-presence"],
    },
    mindstudio: {
      primaryCategorySlug: "ai-website-builder",
      addSecondaryCategorySlugs: ["ai"],
    },
    gamma: { addSecondaryCategorySlugs: ["ai-website-builder", "ai-writing"] },
    shopify: {
      addSecondaryCategorySlugs: ["website-digital-presence"],
      addSubcategorySlugs: ["fulfillment-shipping"],
    },
    leadpages: { addSecondaryCategorySlugs: ["website-digital-presence"] },

    // itsm / web-hosting landscape
    servicenow: { addSecondaryCategorySlugs: ["itsm"] },
    "jira-service-management": { addSecondaryCategorySlugs: ["itsm"] },
    haloitsm: { addSecondaryCategorySlugs: ["itsm"] },
    "manageengine-servicedesk-plus": { addSecondaryCategorySlugs: ["itsm"] },
    sysaid: { addSecondaryCategorySlugs: ["itsm"] },
    cpanel: { addSecondaryCategorySlugs: ["web-hosting"] },
    directadmin: { addSecondaryCategorySlugs: ["web-hosting"] },
    siteground: { addSecondaryCategorySlugs: ["web-hosting"] },
    kinsta: { addSecondaryCategorySlugs: ["web-hosting"] },
    cloudways: { addSecondaryCategorySlugs: ["web-hosting"] },

    // ats-recruiting / time-attendance
    greenhouse: { addSecondaryCategorySlugs: ["ats-recruiting"] },
    workable: { addSecondaryCategorySlugs: ["ats-recruiting"] },
    ashby: { addSecondaryCategorySlugs: ["ats-recruiting"] },
    lever: { addSecondaryCategorySlugs: ["ats-recruiting"] },
    deputy: { addSecondaryCategorySlugs: ["time-attendance"] },
    "when-i-work": { addSecondaryCategorySlugs: ["time-attendance"] },
    homebase: { addSecondaryCategorySlugs: ["time-attendance"] },
    "7shifts": { addSecondaryCategorySlugs: ["time-attendance"] },

    // ppc-advertising
    evolve: { addSecondaryCategorySlugs: ["ppc-advertising"] },

    // accounting-finance
    hive: { addSecondaryCategorySlugs: ["accounting-finance"] },
    monday: { addSecondaryCategorySlugs: ["accounting-finance"] },

    // CRM subcategories
    folk: { addSubcategorySlugs: ["startup-crm", "simple-crm"] },
    salesflare: { addSubcategorySlugs: ["startup-crm"] },
    pipedrive: { addSubcategorySlugs: ["startup-crm", "simple-crm"] },
    hubspot: { addSubcategorySlugs: ["startup-crm", "ai-crm"] },
    salesforce: { addSubcategorySlugs: ["ai-crm"] },
    close: { addSubcategorySlugs: ["gmail-crm"] },
    keap: { addSubcategorySlugs: ["gmail-crm"] },
    capsule: { addSubcategorySlugs: ["gmail-crm"] },
    "zoho-crm": { addSubcategorySlugs: ["ai-crm"] },
    creatio: { addSubcategorySlugs: ["ai-crm"] },

    // sales-intelligence subcategories
    zoominfo: { addSubcategorySlugs: ["lead-generation"] },
    lusha: { addSubcategorySlugs: ["lead-generation"] },
    hunter: { addSubcategorySlugs: ["lead-generation", "email-outreach"] },
    lemlist: { addSubcategorySlugs: ["email-outreach", "sales-engagement"] },
    instantly: { addSubcategorySlugs: ["email-outreach"] },
    closely: { addSubcategorySlugs: ["sales-engagement"] },
    kixie: { addSubcategorySlugs: ["sales-engagement"] },
    cognism: { addSubcategorySlugs: ["data-enrichment"] },
    leadiq: { addSubcategorySlugs: ["data-enrichment"] },

    // ecommerce
    sellfy: { addSubcategorySlugs: ["dropshipping-pod"] },
    ecwid: { addSubcategorySlugs: ["dropshipping-pod"] },
    alidrop: { addSubcategorySlugs: ["fulfillment-shipping"] },

    // live-chat
    zendesk: { addSecondaryCategorySlugs: ["live-chat"] },
    gorgias: { addSecondaryCategorySlugs: ["live-chat"] },
  };

function mergeUnique(base: string[] | undefined, add: string[] | undefined): string[] {
  return [...new Set([...(base ?? []), ...(add ?? [])])];
}

export function applyCategoryMembershipPatches(products: Software[]): Software[] {
  return products.map((product) => {
    const patch = categoryMembershipPatches[product.slug];
    if (!patch) return product;
    return {
      ...product,
      primaryCategorySlug: patch.primaryCategorySlug ?? product.primaryCategorySlug,
      secondaryCategorySlugs: mergeUnique(
        product.secondaryCategorySlugs,
        patch.addSecondaryCategorySlugs,
      ),
      subcategorySlugs: mergeUnique(product.subcategorySlugs, patch.addSubcategorySlugs),
    };
  });
}
