import type { VendorOfficialSourceRegistryEntry } from "@/domain/schemas/asset-discovery";
import { VendorOfficialSourceRegistryEntrySchema } from "@/domain/schemas/asset-discovery";
import { COVERAGE_GAP_VENDOR_REGISTRY } from "./vendor-registry-coverage-gap";

/**
 * Canonical vendor official-source registry for Asset Discovery.
 * Prefer this over hardcoding domains in page-specific agents.
 * Domains are derived from known vendor properties + research sources —
 * never invent channels or URLs for products not listed.
 */

const RAW_REGISTRY: VendorOfficialSourceRegistryEntry[] = [
  {
    productSlug: "hubspot",
    productName: "HubSpot",
    organizationName: "HubSpot",
    officialDomains: [
      "hubspot.com",
      "legal.hubspot.com",
      "www.hubspot.com",
    ],
    documentationDomains: ["developers.hubspot.com"],
    helpCenterDomains: ["knowledge.hubspot.com"],
    academyDomains: ["academy.hubspot.com"],
    trustCenterDomains: ["trust.hubspot.com"],
    brandCenterUrls: ["https://www.hubspot.com/brand-kit"],
    pricingPaths: ["/pricing", "/products/get-started"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "HubSpot",
        channelUrl: "https://www.youtube.com/@HubSpot",
        verified: true,
        notes:
          "Primary HubSpot YouTube channel — confirm channel identity before officialSource=true",
      },
      {
        provider: "youtube",
        channelName: "HubSpot Academy",
        channelUrl: "https://www.youtube.com/@HubSpotAcademy",
        verified: true,
        notes: "Training / Academy content",
      },
    ],
    notes: [
      "Prefer knowledge.hubspot.com and academy.hubspot.com for tutorials",
      "Affiliate / partner landing pages are not official evidence URLs",
    ],
  },
  {
    productSlug: "pipedrive",
    productName: "Pipedrive",
    organizationName: "Pipedrive",
    officialDomains: ["pipedrive.com", "www.pipedrive.com"],
    documentationDomains: ["developers.pipedrive.com"],
    helpCenterDomains: ["support.pipedrive.com", "help.pipedrive.com"],
    academyDomains: ["academy.pipedrive.com"],
    trustCenterDomains: ["www.pipedrive.com"],
    brandCenterUrls: [],
    pricingPaths: ["/en/pricing", "/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Pipedrive",
        channelUrl: "https://www.youtube.com/@pipedrive",
        verified: true,
        notes:
          "Primary Pipedrive YouTube channel — confirm channel identity before officialSource=true",
      },
    ],
    notes: [
      "Prefer support.pipedrive.com for help-center screenshots and setup docs",
      "Do not treat aff.trypipedrive.com as an evidence or media source",
    ],
  },
  {
    productSlug: "salesforce",
    productName: "Salesforce",
    organizationName: "Salesforce",
    officialDomains: ["salesforce.com", "www.salesforce.com"],
    documentationDomains: ["help.salesforce.com", "developer.salesforce.com"],
    helpCenterDomains: ["help.salesforce.com"],
    academyDomains: ["trailhead.salesforce.com"],
    trustCenterDomains: ["trust.salesforce.com"],
    brandCenterUrls: ["https://www.salesforce.com/company/brand/"],
    pricingPaths: ["/editions-pricing", "/crm/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Salesforce",
        channelUrl: "https://www.youtube.com/@salesforce",
        verified: true,
      },
    ],
    notes: [],
  },
  {
    productSlug: "freshsales",
    productName: "Freshsales",
    organizationName: "Freshworks",
    officialDomains: [
      "freshworks.com",
      "www.freshworks.com",
      "freshsales.io",
    ],
    documentationDomains: ["developers.freshworks.com"],
    helpCenterDomains: ["support.freshdesk.com", "crmsupport.freshworks.com"],
    academyDomains: ["academy.freshworks.com"],
    trustCenterDomains: ["www.freshworks.com"],
    brandCenterUrls: [],
    pricingPaths: ["/crm/pricing", "/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Freshworks",
        channelUrl: "https://www.youtube.com/@FreshworksInc",
        verified: true,
      },
    ],
    notes: ["Freshsales is a Freshworks CRM product — prefer Freshworks hosts"],
  },
  // Migration-gap CRM products (official domains from research sources;
  // YouTube channels verified via oEmbed author_name 2026-08-16)
  {
    productSlug: "affinity",
    productName: "Affinity",
    organizationName: "Affinity",
    officialDomains: ["affinity.co", "www.affinity.co"],
    helpCenterDomains: ["support.affinity.co"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Affinity",
        channelUrl: "https://www.youtube.com/@affinity_co",
        verified: true,
      },
    ],
  },
  {
    productSlug: "agile-crm",
    productName: "Agile CRM",
    organizationName: "Agile CRM",
    officialDomains: ["agilecrm.com", "www.agilecrm.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Agile CRM",
        channelUrl: "https://www.youtube.com/user/AgileCRM",
        verified: true,
      },
    ],
  },
  {
    productSlug: "apptivo",
    productName: "Apptivo",
    organizationName: "Apptivo",
    officialDomains: ["apptivo.com", "www.apptivo.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Apptivo Inc.",
        channelUrl: "https://www.youtube.com/user/apptivo",
        verified: true,
      },
    ],
  },
  {
    productSlug: "cloze",
    productName: "Cloze",
    organizationName: "Cloze",
    officialDomains: ["cloze.com", "www.cloze.com", "help.cloze.com", "learn.cloze.com"],
    helpCenterDomains: ["help.cloze.com"],
    academyDomains: ["learn.cloze.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Cloze",
        channelUrl: "https://www.youtube.com/@Cloze",
        verified: true,
      },
    ],
  },
  {
    productSlug: "mailchimp",
    productName: "Mailchimp",
    organizationName: "Mailchimp",
    officialDomains: ["mailchimp.com", "www.mailchimp.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Intuit Mailchimp",
        channelUrl: "https://www.youtube.com/@Mailchimp",
        verified: true,
      },
    ],
  },
  {
    productSlug: "netsuite",
    productName: "Oracle NetSuite CRM",
    organizationName: "Oracle NetSuite",
    officialDomains: ["netsuite.com", "www.netsuite.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "NetSuite",
        channelUrl: "https://www.youtube.com/user/NetSuite",
        verified: true,
      },
    ],
  },
  {
    productSlug: "nimble",
    productName: "Nimble",
    organizationName: "Nimble",
    officialDomains: ["nimble.com", "www.nimble.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Nimble CRM",
        channelUrl: "https://www.youtube.com/@NimbleCRM",
        verified: true,
      },
    ],
  },
  {
    productSlug: "pega",
    productName: "Pega CRM",
    organizationName: "Pegasystems",
    officialDomains: ["pega.com", "www.pega.com", "academy.pega.com"],
    academyDomains: ["academy.pega.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Pegasystems",
        channelUrl: "https://www.youtube.com/@Pegasystems",
        verified: true,
      },
    ],
  },
  {
    productSlug: "pipelinepro",
    productName: "Pipeline CRM",
    organizationName: "Pipeline CRM",
    officialDomains: ["pipelinecrm.com", "www.pipelinecrm.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Pipeline CRM",
        channelUrl: "https://www.youtube.com/user/pipelinedeals",
        verified: true,
      },
    ],
  },
  {
    productSlug: "podio",
    productName: "Podio",
    organizationName: "Citrix Podio",
    officialDomains: ["podio.com", "www.podio.com"],
    helpCenterDomains: ["help.podio.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Progress Podio",
        channelUrl: "https://www.youtube.com/@podio",
        verified: true,
      },
    ],
  },
  {
    productSlug: "wealthbox",
    productName: "Wealthbox",
    organizationName: "Wealthbox",
    officialDomains: ["wealthbox.com", "www.wealthbox.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Wealthbox",
        channelUrl: "https://www.youtube.com/user/Wealthbox",
        verified: true,
      },
    ],
  },
  {
    productSlug: "zendesk",
    productName: "Zendesk Sell",
    organizationName: "Zendesk",
    officialDomains: ["zendesk.com", "www.zendesk.com"],
    academyDomains: ["academy.zendesk.com", "training.zendesk.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Zendesk",
        channelUrl: "https://www.youtube.com/@Zendesk",
        verified: true,
      },
    ],
  },
  {
    productSlug: "marketo",
    productName: "Adobe Marketo Engage",
    organizationName: "Adobe",
    officialDomains: [
      "business.adobe.com",
      "adobe.com",
      "www.adobe.com",
      "experienceleague.adobe.com",
    ],
    documentationDomains: ["experienceleague.adobe.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Adobe for Business",
        channelUrl: "https://www.youtube.com/@AdobeforBusiness",
        verified: true,
      },
    ],
  },
  {
    productSlug: "pardot",
    productName: "Salesforce Account Engagement",
    organizationName: "Salesforce",
    officialDomains: ["salesforce.com", "www.salesforce.com"],
    helpCenterDomains: ["help.salesforce.com"],
    academyDomains: ["trailhead.salesforce.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Salesforce",
        channelUrl: "https://www.youtube.com/@salesforce",
        verified: true,
      },
      {
        provider: "youtube",
        channelName: "Salesforce Product Center",
        channelUrl: "https://www.youtube.com/@SalesforceProductCenter",
        verified: true,
      },
    ],
  },
  {
    productSlug: "act",
    productName: "ACT!",
    organizationName: "ACT!",
    officialDomains: ["act.com", "www.act.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Act! CRM",
        channelUrl: "https://www.youtube.com/@act_crm",
        verified: true,
      },
    ],
  },
  {
    productSlug: "sap",
    productName: "SAP Customer Experience",
    organizationName: "SAP",
    officialDomains: ["sap.com", "www.sap.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "SAP",
        channelUrl: "https://www.youtube.com/@SAP",
        verified: true,
      },
      {
        provider: "youtube",
        channelName: "SAP Customer Experience",
        channelUrl: "https://www.youtube.com/@SAPcx",
        verified: true,
      },
      {
        provider: "youtube",
        channelName: "SAP Help and Learning",
        channelUrl: "https://www.youtube.com/@SAPHelpandLearning",
        verified: true,
      },
    ],
  },
  {
    productSlug: "siebel",
    productName: "Oracle Siebel CRM",
    organizationName: "Oracle",
    officialDomains: ["oracle.com", "www.oracle.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Oracle",
        channelUrl: "https://www.youtube.com/@Oracle",
        verified: true,
      },
      {
        provider: "youtube",
        channelName: "Oracle Developers",
        channelUrl: "https://www.youtube.com/@OracleDevelopers",
        verified: true,
      },
      {
        provider: "youtube",
        channelName: "Oracle Integration",
        channelUrl: "https://www.youtube.com/@OracleIntegration",
        verified: true,
      },
    ],
  },
  {
    productSlug: "tidio",
    productName: "Tidio",
    organizationName: "Tidio",
    officialDomains: ["tidio.com", "www.tidio.com"],
    helpCenterDomains: ["help.tidio.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Tidio",
        channelUrl: "https://www.youtube.com/@tidio",
        verified: true,
      },
    ],
  },
  {
    productSlug: "bookyourdata",
    productName: "BookYourData",
    organizationName: "BookYourData",
    officialDomains: ["bookyourdata.com", "www.bookyourdata.com"],
    helpCenterDomains: ["intercom.help"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "BookYourData",
        channelUrl: "https://www.youtube.com/@bookyourdata",
        verified: true,
        notes:
          "Getting Started demo embedded from BookYourData Help Center (Caiysb-2C0w)",
      },
    ],
    notes: [
      "Prefer intercom.help/bookyourdata for product documentation",
      "Marketing pricing page may be bot-protected — confirm live prices carefully",
    ],
  },
  {
    productSlug: "reply",
    productName: "Reply.io",
    organizationName: "Reply",
    officialDomains: ["reply.io", "www.reply.io"],
    helpCenterDomains: ["support.reply.io"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Reply",
        channelUrl: "https://www.youtube.com/channel/UCOtU18DT8csQVqHPT1wtYzw",
        verified: true,
        notes: "Primary Reply.io YouTube channel",
      },
    ],
    notes: [
      "Prefer reply.io first-party pages and the Reply YouTube channel",
      "Do not treat get.reply.io affiliate landers as evidence sources",
    ],
  },
  {
    productSlug: "kixie",
    productName: "Kixie",
    organizationName: "Kixie",
    officialDomains: ["kixie.com", "www.kixie.com"],
    helpCenterDomains: ["help.kixie.com", "support.kixie.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Kixie",
        channelUrl: "https://www.youtube.com/c/Kixie-Sales-Engagement",
        verified: true,
        notes: "Primary Kixie YouTube channel (Kixie Sales Engagement)",
      },
    ],
    notes: [
      "Prefer kixie.com feature and pricing pages for evidence",
      "Do not treat get.kixie.com affiliate landers as evidence sources",
    ],
  },
  {
    productSlug: "cognism",
    productName: "Cognism",
    organizationName: "Cognism",
    officialDomains: ["cognism.com", "www.cognism.com"],
    helpCenterDomains: ["help.cognism.com"],
    pricingPaths: ["/pricing", "/enrich"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Cognism",
        channelUrl: "https://www.youtube.com/@Cognism",
        verified: true,
        notes: "Primary Cognism YouTube channel",
      },
    ],
    notes: [
      "Prefer cognism.com product and pricing pages for evidence",
      "EMEA / GDPR positioning is first-party marketing — verify claims carefully",
    ],
  },
  {
    productSlug: "zoominfo",
    productName: "ZoomInfo",
    organizationName: "ZoomInfo",
    officialDomains: ["zoominfo.com", "www.zoominfo.com"],
    helpCenterDomains: ["help.zoominfo.com", "support.zoominfo.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "ZoomInfo",
        channelUrl: "https://www.youtube.com/@ZoomInformation",
        verified: true,
        notes: "Primary ZoomInfo YouTube channel (@ZoomInformation)",
      },
    ],
    notes: [
      "Prefer zoominfo.com first-party product demos and docs",
      "Enterprise pricing is typically talk-to-sales — do not invent list prices",
    ],
  },
  {
    productSlug: "linkedin-sales-navigator",
    productName: "LinkedIn Sales Navigator",
    organizationName: "LinkedIn",
    officialDomains: [
      "business.linkedin.com",
      "www.linkedin.com",
      "linkedin.com",
    ],
    helpCenterDomains: ["www.linkedin.com"],
    pricingPaths: ["/sales/sales-navigator"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "LinkedIn for Sales",
        channelUrl: "https://www.youtube.com/@LinkedInforSales",
        verified: true,
        notes: "Official LinkedIn for Sales YouTube channel",
      },
    ],
    notes: [
      "Prefer LinkedIn for Sales channel and business.linkedin.com Sales Navigator pages",
      "Do not treat third-party Sales Navigator tutorials as official product evidence",
    ],
  },
  {
    productSlug: "sixsense",
    productName: "6sense",
    organizationName: "6sense",
    officialDomains: ["6sense.com", "www.6sense.com"],
    helpCenterDomains: ["support.6sense.com"],
    pricingPaths: ["/platform/sales/pricing", "/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "6sense",
        channelUrl: "https://www.youtube.com/@6sense",
        verified: true,
        notes: "Primary 6sense YouTube channel",
      },
    ],
    notes: [
      "Prefer 6sense.com product and sales intelligence pages",
      "Enterprise packaging is typically talk-to-sales — do not invent list prices",
    ],
  },
  {
    productSlug: "demandbase",
    productName: "Demandbase",
    organizationName: "Demandbase",
    officialDomains: ["demandbase.com", "www.demandbase.com"],
    helpCenterDomains: ["support.demandbase.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Demandbase",
        channelUrl: "https://www.youtube.com/@Demandbase",
        verified: true,
        notes: "Primary Demandbase YouTube channel",
      },
    ],
    notes: [
      "Prefer demandbase.com Demandbase One product pages",
      "Enterprise ABM packaging is typically talk-to-sales",
    ],
  },
  {
    productSlug: "seamless-ai",
    productName: "Seamless.AI",
    organizationName: "Seamless Contacts",
    officialDomains: ["seamless.ai", "www.seamless.ai"],
    helpCenterDomains: ["support.seamless.ai", "help.seamless.ai"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Seamless",
        channelUrl: "https://www.youtube.com/@SeamlessAI",
        verified: true,
        notes: "Primary Seamless.AI YouTube channel (channel name: Seamless)",
      },
    ],
    notes: [
      "Prefer seamless.ai product, pricing, and Chrome extension tutorials from the Seamless channel",
    ],
  },
  {
    productSlug: "clay",
    productName: "Clay",
    organizationName: "Clay",
    officialDomains: ["clay.com", "www.clay.com"],
    helpCenterDomains: ["university.clay.com", "www.clay.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Clay",
        channelUrl: "https://www.youtube.com/@clay-hq",
        verified: true,
        notes: "Primary Clay YouTube channel",
      },
    ],
    notes: [
      "Prefer clay.com and Clay University / Clay 101 official tutorials",
    ],
  },
  {
    productSlug: "clearbit",
    productName: "Clearbit",
    organizationName: "HubSpot",
    officialDomains: [
      "clearbit.com",
      "www.clearbit.com",
      "hubspot.com",
      "www.hubspot.com",
    ],
    helpCenterDomains: ["knowledge.hubspot.com"],
    academyDomains: ["academy.hubspot.com"],
    pricingPaths: ["/products/clearbit", "/products/crm"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "HubSpot",
        channelUrl: "https://www.youtube.com/@HubSpot",
        verified: true,
        notes:
          "Clearbit is HubSpot-owned (Breeze Intelligence) — HubSpot channel is primary for current product demos",
      },
      {
        provider: "youtube",
        channelName: "HubSpot Academy",
        channelUrl: "https://www.youtube.com/@HubSpotAcademy",
        verified: true,
        notes: "HubSpot Academy training for Breeze / enrichment",
      },
      {
        provider: "youtube",
        channelName: "Clearbit",
        channelUrl: "https://www.youtube.com/@Clearbit",
        verified: true,
        notes: "Legacy Clearbit channel — still useful for enrichment demos",
      },
    ],
    notes: [
      "Prefer HubSpot Breeze Intelligence demos for current packaging; Clearbit channel for enrichment concepts",
      "Do not invent credit prices — HubSpot credit monetization is first-party commercial",
    ],
  },
  {
    productSlug: "bombora",
    productName: "Bombora",
    organizationName: "Bombora",
    officialDomains: ["bombora.com", "www.bombora.com"],
    helpCenterDomains: ["support.bombora.com"],
    pricingPaths: ["/speak-to-an-expert"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Bombora",
        channelUrl: "https://www.youtube.com/@Bombora",
        verified: true,
        notes: "Primary Bombora YouTube channel",
      },
    ],
    notes: [
      "Bombora is an intent-data specialist (Company Surge) — not a contact database",
      "Prefer Bombora channel demos of Company Surge",
    ],
  },
  {
    productSlug: "uplead",
    productName: "UpLead",
    organizationName: "UpLead",
    officialDomains: ["uplead.com", "www.uplead.com"],
    helpCenterDomains: ["help.uplead.com", "support.uplead.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "UpLead",
        channelUrl: "https://www.youtube.com/@UpLeadB2Bprospecting",
        verified: true,
        notes: "Primary UpLead YouTube channel (oEmbed author_name: UpLead)",
      },
    ],
    notes: [
      "Prefer uplead.com product/pricing pages and UpLead channel demos",
    ],
  },
  {
    productSlug: "leadiq",
    productName: "LeadIQ",
    organizationName: "LeadIQ",
    officialDomains: ["leadiq.com", "www.leadiq.com"],
    helpCenterDomains: ["support.leadiq.com", "help.leadiq.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "LeadIQ",
        channelUrl: "https://www.youtube.com/@leadiq",
        verified: true,
        notes: "Primary LeadIQ YouTube channel",
      },
    ],
    notes: [
      "Prefer leadiq.com product pages and LeadIQ Identify / prospecting demos",
    ],
  },
  {
    productSlug: "hunter",
    productName: "Hunter",
    organizationName: "Hunter",
    officialDomains: ["hunter.io", "www.hunter.io"],
    helpCenterDomains: ["help.hunter.io", "support.hunter.io"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Hunter",
        channelUrl: "https://www.youtube.com/@Hunter-io",
        verified: true,
        notes: "Primary Hunter YouTube channel (oEmbed author_name: Hunter)",
      },
    ],
    notes: [
      "Prefer hunter.io Domain Search / Bulk Domain Search demos from the Hunter channel",
    ],
  },
  {
    productSlug: "snov",
    productName: "Snov.io",
    organizationName: "Snov.io",
    officialDomains: ["snov.io", "www.snov.io"],
    helpCenterDomains: ["help.snov.io", "support.snov.io"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Snovio",
        channelUrl: "https://www.youtube.com/@Snovio",
        verified: true,
        notes: "Primary Snov.io YouTube channel (channel name: Snovio)",
      },
    ],
    notes: [
      "Prefer snov.io product demos of email finder, phone finder, and sequences",
    ],
  },
  {
    productSlug: "kaspr",
    productName: "Kaspr",
    organizationName: "Kaspr",
    officialDomains: ["kaspr.io", "www.kaspr.io"],
    helpCenterDomains: ["help.kaspr.io", "support.kaspr.io"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Kaspr",
        channelUrl: "https://www.youtube.com/@kaspr_io",
        verified: true,
        notes: "Primary Kaspr YouTube channel",
      },
    ],
    notes: [
      "Prefer Kaspr Chrome extension / LinkedIn lead export tutorials",
    ],
  },
  {
    productSlug: "getresponse",
    productName: "GetResponse",
    organizationName: "GetResponse",
    officialDomains: ["getresponse.com", "www.getresponse.com"],
    helpCenterDomains: ["www.getresponse.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "GetResponse",
        channelUrl: "https://www.youtube.com/@GetResponse",
        verified: true,
        notes: "Primary GetResponse YouTube channel",
      },
    ],
  },
  {
    productSlug: "aweber",
    productName: "AWeber",
    organizationName: "AWeber Systems, Inc.",
    officialDomains: ["aweber.com", "www.aweber.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "AWeber",
        channelUrl: "https://www.youtube.com/@AWeber",
        verified: true,
      },
    ],
  },
  {
    productSlug: "campaign-monitor",
    productName: "Campaign Monitor",
    organizationName: "Marigold",
    officialDomains: ["campaignmonitor.com", "www.campaignmonitor.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Campaign Monitor",
        channelUrl: "https://www.youtube.com/@TryCampaignMonitor",
        verified: true,
      },
    ],
  },
  {
    productSlug: "activecampaign",
    productName: "ActiveCampaign",
    organizationName: "ActiveCampaign",
    officialDomains: ["activecampaign.com", "www.activecampaign.com"],
    helpCenterDomains: ["help.activecampaign.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "ActiveCampaign",
        channelUrl: "https://www.youtube.com/@ActiveCampaign",
        verified: true,
      },
    ],
  },
  {
    productSlug: "bouncer",
    productName: "Bouncer",
    organizationName: "Bouncer",
    officialDomains: ["usebouncer.com", "www.usebouncer.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Bouncer",
        channelUrl: "https://www.youtube.com/@usebouncer",
        verified: true,
      },
    ],
  },
  {
    productSlug: "inboxally",
    productName: "InboxAlly",
    organizationName: "InboxAlly",
    officialDomains: ["inboxally.com", "www.inboxally.com", "get.inboxally.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "InboxAlly: Mastering Email Deliverability",
        channelUrl: "https://www.youtube.com/@inboxally",
        verified: true,
      },
    ],
  },
  {
    productSlug: "kartra",
    productName: "Kartra",
    organizationName: "Kartra",
    officialDomains: ["kartra.com", "home.kartra.com", "www.kartra.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Kartra",
        channelUrl: "https://www.youtube.com/@Kartra",
        verified: true,
      },
    ],
  },
  {
    productSlug: "socialbee",
    productName: "SocialBee",
    organizationName: "SocialBee",
    officialDomains: ["socialbee.com", "www.socialbee.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "SocialBee | Social Media Planner",
        channelUrl: "https://www.youtube.com/@SocialBeeHQ",
        verified: true,
      },
    ],
  },
  {
    productSlug: "brand24",
    productName: "Brand24",
    organizationName: "Brand24",
    officialDomains: ["brand24.com", "www.brand24.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Brand24",
        channelUrl: "https://www.youtube.com/@Brand24",
        verified: true,
      },
    ],
  },
  {
    productSlug: "freshmarketer",
    productName: "Freshmarketer",
    organizationName: "Freshworks",
    officialDomains: [
      "freshworks.com",
      "www.freshworks.com",
      "freshmarketer.com",
      "www.freshmarketer.com",
    ],
    helpCenterDomains: ["support.freshmarketer.com"],
    pricingPaths: ["/crm/marketing/", "/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Freshmarketer",
        channelUrl: "https://www.youtube.com/@freshmarketer1930",
        verified: true,
        notes: "Official Freshmarketer product channel",
      },
    ],
  },
  {
    productSlug: "learnworlds",
    productName: "LearnWorlds",
    organizationName: "LearnWorlds",
    officialDomains: ["learnworlds.com", "www.learnworlds.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "LearnWorlds",
        channelUrl: "https://www.youtube.com/@LearnWorlds",
        verified: true,
      },
    ],
  },
  {
    productSlug: "livestorm",
    productName: "Livestorm",
    organizationName: "Livestorm",
    officialDomains: ["livestorm.co", "www.livestorm.co"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Livestorm",
        channelUrl: "https://www.youtube.com/@Livestormapp",
        verified: true,
      },
    ],
  },
  {
    productSlug: "ocean",
    productName: "Ocean",
    organizationName: "Ocean.io",
    officialDomains: ["ocean.io", "www.ocean.io"],
    helpCenterDomains: ["help.ocean.io", "support.ocean.io"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Ocean",
        channelUrl: "https://www.youtube.com/@oceanio",
        verified: true,
        notes: "Primary Ocean.io YouTube channel (channel name: Ocean)",
      },
    ],
    notes: [
      "Prefer Ocean.io lookalike / company+people prospecting demos",
    ],
  },
  // --- Business Communications + Buffer (media sourcing 2026-08-17) ---
  {
    productSlug: "aircall",
    productName: "Aircall",
    organizationName: "Aircall",
    officialDomains: ["aircall.io", "www.aircall.io"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Aircall",
        channelUrl: "https://www.youtube.com/@aircallhq",
        verified: true,
      },
    ],
  },
  {
    productSlug: "callhippo",
    productName: "CallHippo",
    organizationName: "CallHippo",
    officialDomains: ["callhippo.com", "www.callhippo.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "CallHippo",
        channelUrl: "https://www.youtube.com/@CallHippo",
        verified: true,
      },
    ],
  },
  {
    productSlug: "krispcall",
    productName: "KrispCall",
    organizationName: "KrispCall",
    officialDomains: ["krispcall.com", "www.krispcall.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "KrispCall",
        channelUrl: "https://www.youtube.com/@KrispCall",
        verified: true,
      },
    ],
  },
  {
    productSlug: "freshcaller",
    productName: "Freshcaller",
    organizationName: "Freshworks",
    officialDomains: [
      "freshworks.com",
      "www.freshworks.com",
      "freshcaller.com",
      "www.freshcaller.com",
    ],
    pricingPaths: ["/freshcaller-cloud-pbx/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Freshdesk Contact Center",
        channelUrl: "https://www.youtube.com/@FreshdeskContactCenter",
        verified: true,
        notes: "Freshcaller / Freshdesk Contact Center official training channel",
      },
      {
        provider: "youtube",
        channelName: "Freshworks",
        channelUrl: "https://www.youtube.com/@FreshworksInc",
        verified: true,
      },
    ],
  },
  {
    productSlug: "wati",
    productName: "Wati",
    organizationName: "Wati",
    officialDomains: ["wati.io", "www.wati.io"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Wati",
        channelUrl: "https://www.youtube.com/@Watiio",
        verified: true,
      },
    ],
  },
  {
    productSlug: "zenzap",
    productName: "Zenzap",
    organizationName: "Zenzap",
    officialDomains: ["zenzap.co", "www.zenzap.co"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Zenzap",
        channelUrl: "https://www.youtube.com/@Zenzap",
        verified: true,
      },
    ],
  },
  {
    productSlug: "fastmail",
    productName: "Fastmail",
    organizationName: "Fastmail",
    officialDomains: ["fastmail.com", "www.fastmail.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Fastmail",
        channelUrl: "https://www.youtube.com/@Fastmail",
        verified: true,
      },
    ],
  },
  {
    productSlug: "sanebox",
    productName: "SaneBox",
    organizationName: "SaneBox",
    officialDomains: ["sanebox.com", "www.sanebox.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "SaneBox",
        channelUrl: "https://www.youtube.com/@SaneBox",
        verified: true,
      },
    ],
  },
  {
    productSlug: "ringcentral",
    productName: "RingCentral",
    organizationName: "RingCentral",
    officialDomains: ["ringcentral.com", "www.ringcentral.com"],
    pricingPaths: ["/office/plansandpricing.html"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "RingCentral",
        channelUrl: "https://www.youtube.com/@RingCentral",
        verified: true,
      },
    ],
  },
  {
    productSlug: "dialpad",
    productName: "Dialpad",
    organizationName: "Dialpad",
    officialDomains: ["dialpad.com", "www.dialpad.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Dialpad",
        channelUrl: "https://www.youtube.com/@DialpadHQ",
        verified: true,
      },
    ],
  },
  {
    productSlug: "zoom",
    productName: "Zoom",
    organizationName: "Zoom",
    officialDomains: ["zoom.com", "www.zoom.com", "zoom.us", "www.zoom.us"],
    pricingPaths: ["/en/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Zoom",
        channelUrl: "https://www.youtube.com/@Zoom",
        verified: true,
      },
    ],
  },
  {
    productSlug: "nextiva",
    productName: "Nextiva",
    organizationName: "Nextiva",
    officialDomains: ["nextiva.com", "www.nextiva.com"],
    pricingPaths: ["/nextiva-pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Nextiva",
        channelUrl: "https://www.youtube.com/@Nextiva",
        verified: true,
      },
    ],
  },
  {
    productSlug: "microsoft-teams",
    productName: "Microsoft Teams",
    organizationName: "Microsoft",
    officialDomains: ["microsoft.com", "www.microsoft.com"],
    pricingPaths: ["/en-us/microsoft-teams/compare-microsoft-teams-options"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Microsoft Teams",
        channelUrl: "https://www.youtube.com/@MicrosoftTeams",
        verified: true,
      },
      {
        provider: "youtube",
        channelName: "Microsoft 365",
        channelUrl: "https://www.youtube.com/@Microsoft365",
        verified: true,
      },
    ],
  },
  {
    productSlug: "slack",
    productName: "Slack",
    organizationName: "Slack",
    officialDomains: ["slack.com", "www.slack.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Slack",
        channelUrl: "https://www.youtube.com/@Slackhq",
        verified: true,
      },
    ],
  },
  {
    productSlug: "openphone",
    productName: "OpenPhone",
    organizationName: "OpenPhone / Quo",
    officialDomains: [
      "openphone.com",
      "www.openphone.com",
      "quo.com",
      "www.quo.com",
    ],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Grow with Quo",
        channelUrl: "https://www.youtube.com/@GrowwithQuo",
        verified: true,
        notes: "Official Quo (formerly OpenPhone) YouTube channel",
      },
    ],
  },
  {
    productSlug: "eightx8",
    productName: "8x8",
    organizationName: "8x8",
    officialDomains: ["8x8.com", "www.8x8.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "8x8",
        channelUrl: "https://www.youtube.com/@8x8Inc",
        verified: true,
      },
      {
        provider: "youtube",
        channelName: "8x8 University",
        channelUrl: "https://www.youtube.com/@8x8University",
        verified: true,
        notes: "Vendor training channel",
      },
    ],
  },
  {
    productSlug: "goto-connect",
    productName: "GoTo Connect",
    organizationName: "GoTo",
    officialDomains: ["goto.com", "www.goto.com"],
    pricingPaths: ["/connect/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "GoTo",
        channelUrl: "https://www.youtube.com/@GoTo",
        verified: true,
      },
    ],
  },
  {
    productSlug: "grasshopper",
    productName: "Grasshopper",
    organizationName: "GoTo",
    officialDomains: ["grasshopper.com", "www.grasshopper.com", "goto.com", "www.goto.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "GoTo",
        channelUrl: "https://www.youtube.com/@GoTo",
        verified: true,
        notes: "Grasshopper is a GoTo product — prefer GoTo official channel",
      },
    ],
  },
  {
    productSlug: "respond-io",
    productName: "respond.io",
    organizationName: "respond.io",
    officialDomains: ["respond.io", "www.respond.io"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Respond.io",
        channelUrl: "https://www.youtube.com/@respondio",
        verified: true,
      },
    ],
  },
  {
    productSlug: "buffer",
    productName: "Buffer",
    organizationName: "Buffer",
    officialDomains: ["buffer.com", "www.buffer.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Buffer",
        channelUrl: "https://www.youtube.com/@Buffer",
        verified: true,
      },
    ],
  },
  // --- BC Priority-3 gaps (media sourcing 2026-08-17) ---
  {
    productSlug: "webex",
    productName: "Webex",
    organizationName: "Cisco Webex",
    officialDomains: ["webex.com", "www.webex.com", "cisco.com", "www.cisco.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Webex",
        channelUrl: "https://www.youtube.com/@webex",
        verified: true,
      },
    ],
  },
  {
    productSlug: "vonage",
    productName: "Vonage",
    organizationName: "Vonage",
    officialDomains: ["vonage.com", "www.vonage.com"],
    pricingPaths: ["/unified-communications/pricing/", "/pricing/"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Vonage",
        channelUrl: "https://www.youtube.com/@Vonage",
        verified: true,
      },
    ],
  },
  {
    productSlug: "ooma",
    productName: "Ooma",
    organizationName: "Ooma",
    officialDomains: ["ooma.com", "www.ooma.com"],
    pricingPaths: ["/office/pricing/", "/pricing/"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Ooma",
        channelUrl: "https://www.youtube.com/@oomainc",
        verified: true,
        notes: "Official Ooma Inc YouTube channel (Ooma Office / Business)",
      },
    ],
  },
  {
    productSlug: "talkdesk",
    productName: "Talkdesk",
    organizationName: "Talkdesk",
    officialDomains: ["talkdesk.com", "www.talkdesk.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Talkdesk",
        channelUrl: "https://www.youtube.com/@Talkdesk",
        verified: true,
      },
    ],
  },
  {
    productSlug: "genesys",
    productName: "Genesys",
    organizationName: "Genesys",
    officialDomains: ["genesys.com", "www.genesys.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Genesys",
        channelUrl: "https://www.youtube.com/@Genesys",
        verified: true,
      },
    ],
  },
  {
    productSlug: "five9",
    productName: "Five9",
    organizationName: "Five9",
    officialDomains: ["five9.com", "www.five9.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Five9",
        channelUrl: "https://www.youtube.com/@Five9",
        verified: true,
      },
    ],
  },
  // --- Project Management Wave-1 (2026-08-17) ---
  {
    productSlug: "monday",
    productName: "monday.com",
    organizationName: "monday.com",
    officialDomains: ["monday.com", "www.monday.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "monday.com",
        channelUrl: "https://www.youtube.com/@mondaydotcom",
        verified: true,
        notes: "Official monday.com YouTube channel — Work OS / Work Management",
      },
    ],
  },
  {
    productSlug: "hive",
    productName: "Hive",
    organizationName: "Hive",
    officialDomains: ["hive.com", "www.hive.com", "app.hive.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Hive",
        channelUrl: "https://www.youtube.com/c/HiveForTeams",
        verified: true,
        notes: "Official Hive For Teams YouTube channel",
      },
    ],
  },
  {
    productSlug: "office-timeline",
    productName: "Office Timeline",
    organizationName: "Lucen Software",
    officialDomains: [
      "officetimeline.com",
      "www.officetimeline.com",
      "lucensoftware.io",
      "www.lucensoftware.io",
    ],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [],
  },
  {
    productSlug: "foxit",
    productName: "Foxit",
    organizationName: "Foxit",
    officialDomains: ["foxit.com", "www.foxit.com"],
    pricingPaths: ["/pdf-editor/pricing", "/pricing"],
    officialVideoChannels: [],
  },
  {
    productSlug: "getscreen-me",
    productName: "Getscreen.me",
    organizationName: "Getscreen.me",
    officialDomains: ["getscreen.me", "www.getscreen.me"],
    pricingPaths: ["/en/plan/", "/en/pricing/"],
    officialVideoChannels: [],
  },
  {
    productSlug: "webcatalog",
    productName: "WebCatalog",
    organizationName: "WebCatalog",
    officialDomains: ["webcatalog.io", "www.webcatalog.io"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [],
  },
  {
    productSlug: "freshdesk",
    productName: "Freshdesk",
    organizationName: "Freshworks Inc.",
    officialDomains: [
      "freshdesk.com",
      "www.freshdesk.com",
      "freshworks.com",
      "www.freshworks.com",
    ],
    helpCenterDomains: ["support.freshdesk.com"],
    academyDomains: ["academy.freshworks.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Freshworks",
        channelUrl: "https://www.youtube.com/@FreshworksInc",
        verified: true,
        notes: "Official Freshworks channel — Freshdesk product videos",
      },
    ],
    notes: [
      "Freshdesk is customer helpdesk — distinct from Freshservice (ITSM) and Freshchat (live chat)",
    ],
  },
  {
    productSlug: "freshservice",
    productName: "Freshservice",
    organizationName: "Freshworks Inc.",
    officialDomains: ["freshworks.com", "www.freshworks.com"],
    pricingPaths: ["/freshservice/pricing/", "/freshservice/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Freshservice",
        verified: true,
        notes: "Official Freshservice YouTube channel — ITSM product videos",
      },
      {
        provider: "youtube",
        channelName: "Freshworks",
        channelUrl: "https://www.youtube.com/@FreshworksInc",
        verified: true,
      },
    ],
    notes: [
      "Freshservice is ITSM — distinct from Freshdesk (customer helpdesk)",
    ],
  },
  {
    productSlug: "zendesk-suite",
    productName: "Zendesk Suite",
    organizationName: "Zendesk",
    officialDomains: ["zendesk.com", "www.zendesk.com"],
    academyDomains: ["academy.zendesk.com", "training.zendesk.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Zendesk",
        channelUrl: "https://www.youtube.com/@Zendesk",
        verified: true,
        notes:
          "Same Zendesk org channel as Zendesk Sell — CS product is zendesk-suite, not zendesk",
      },
    ],
    notes: [
      "zendesk-suite is customer service; productSlug zendesk is Zendesk Sell (CRM)",
    ],
  },
  {
    productSlug: "help-scout",
    productName: "Help Scout",
    organizationName: "Help Scout",
    officialDomains: ["helpscout.com", "www.helpscout.com"],
    pricingPaths: ["/pricing"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Help Scout",
        verified: true,
        notes: "Official Help Scout YouTube channel — Beacon and Docs videos",
      },
    ],
  },
  {
    productSlug: "bamboohr",
    productName: "BambooHR",
    organizationName: "Bamboo HR LLC",
    officialDomains: ["bamboohr.com", "www.bamboohr.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "BambooHR",
        channelUrl: "https://www.youtube.com/@bamboohr",
        verified: true,
      },
    ],
  },
  {
    productSlug: "gusto",
    productName: "Gusto",
    organizationName: "Gusto, Inc.",
    officialDomains: ["gusto.com", "www.gusto.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Gusto",
        channelUrl: "https://www.youtube.com/@Gusto",
        verified: true,
      },
    ],
  },
  {
    productSlug: "workday",
    productName: "Workday",
    organizationName: "Workday, Inc.",
    officialDomains: ["workday.com", "www.workday.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Workday",
        channelUrl: "https://www.youtube.com/@workday",
        verified: true,
      },
    ],
  },
  {
    productSlug: "greenhouse",
    productName: "Greenhouse",
    organizationName: "Greenhouse Software, Inc.",
    officialDomains: ["greenhouse.com", "www.greenhouse.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Greenhouse Software",
        channelUrl: "https://www.youtube.com/@greenhousesoftware",
        verified: true,
      },
    ],
  },
  {
    productSlug: "7shifts",
    productName: "7shifts",
    organizationName: "7shifts Inc.",
    officialDomains: ["7shifts.com", "www.7shifts.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "7shifts",
        channelUrl: "https://www.youtube.com/@7shiftsinc",
        verified: true,
      },
    ],
  },
  {
    productSlug: "personio",
    productName: "Personio",
    organizationName: "Personio SE",
    officialDomains: ["personio.com", "www.personio.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Personio",
        channelUrl: "https://www.youtube.com/@PersonioHR",
        verified: true,
      },
    ],
  },
  {
    productSlug: "rippling",
    productName: "Rippling",
    organizationName: "People Center, Inc.",
    officialDomains: ["rippling.com", "www.rippling.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Rippling",
        channelUrl: "https://www.youtube.com/@RipplingHQ",
        verified: true,
      },
    ],
  },
  {
    productSlug: "klaviyo",
    productName: "Klaviyo",
    organizationName: "Klaviyo, Inc.",
    officialDomains: ["klaviyo.com", "www.klaviyo.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Klaviyo",
        channelUrl: "https://www.youtube.com/@Klaviyo",
        verified: true,
      },
    ],
  },
  {
    productSlug: "brevo",
    productName: "Brevo",
    organizationName: "Brevo",
    officialDomains: ["brevo.com", "www.brevo.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Brevo",
        channelUrl: "https://www.youtube.com/@brevo_official",
        verified: true,
      },
    ],
  },
  {
    productSlug: "mailerlite",
    productName: "MailerLite",
    organizationName: "MailerLite",
    officialDomains: ["mailerlite.com", "www.mailerlite.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "MailerLite",
        channelUrl: "https://www.youtube.com/@MailerLiteOfficial",
        verified: true,
      },
    ],
  },
  {
    productSlug: "hootsuite",
    productName: "Hootsuite",
    organizationName: "Hootsuite",
    officialDomains: ["hootsuite.com", "www.hootsuite.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Hootsuite",
        channelUrl: "https://www.youtube.com/@Hootsuite",
        verified: true,
      },
    ],
  },
  {
    productSlug: "gong",
    productName: "Gong",
    organizationName: "Gong",
    officialDomains: ["gong.io", "www.gong.io"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Gong.io",
        channelUrl: "https://www.youtube.com/@Gongio",
        verified: true,
      },
    ],
  },
  {
    productSlug: "intercom",
    productName: "Intercom",
    organizationName: "Intercom, Inc.",
    officialDomains: ["intercom.com", "www.intercom.com"],
    officialVideoChannels: [
      {
        provider: "youtube",
        channelName: "Fin",
        channelUrl: "https://www.youtube.com/@Fin-Customer-Agent",
        verified: true,
        notes: "Intercom Fin product channel — official Intercom property",
      },
    ],
  },
  ...COVERAGE_GAP_VENDOR_REGISTRY,
];

export const VENDOR_OFFICIAL_SOURCE_REGISTRY: VendorOfficialSourceRegistryEntry[] =
  RAW_REGISTRY.map((e) => VendorOfficialSourceRegistryEntrySchema.parse(e));

export function getVendorOfficialSourceEntry(
  productSlug: string,
): VendorOfficialSourceRegistryEntry | undefined {
  return VENDOR_OFFICIAL_SOURCE_REGISTRY.find(
    (e) => e.productSlug === productSlug,
  );
}

export function listRegisteredVendorSlugs(): string[] {
  return VENDOR_OFFICIAL_SOURCE_REGISTRY.map((e) => e.productSlug);
}

/** All domains (site + docs + help + academy + trust) for a product. */
export function allOfficialDomainsForProduct(
  productSlug: string,
): string[] {
  const entry = getVendorOfficialSourceEntry(productSlug);
  if (!entry) return [];
  return [
    ...entry.officialDomains,
    ...entry.documentationDomains,
    ...entry.helpCenterDomains,
    ...entry.academyDomains,
    ...entry.trustCenterDomains,
  ].map(normalizeDomain);
}

export function normalizeDomain(hostOrDomain: string): string {
  return hostOrDomain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "");
}

export function domainMatchesOfficial(
  urlOrHost: string,
  productSlug: string,
): { matched: boolean; domain?: string; kind?: string } {
  let host: string;
  try {
    host = urlOrHost.includes("://")
      ? new URL(urlOrHost).hostname
      : urlOrHost;
  } catch {
    return { matched: false };
  }
  const normalized = normalizeDomain(host);
  const entry = getVendorOfficialSourceEntry(productSlug);
  if (!entry) return { matched: false };

  const checks: Array<{ domains: string[]; kind: string }> = [
    { domains: entry.officialDomains, kind: "vendor-official-site" },
    { domains: entry.documentationDomains, kind: "vendor-documentation" },
    { domains: entry.helpCenterDomains, kind: "vendor-help-center" },
    { domains: entry.academyDomains, kind: "vendor-academy" },
    { domains: entry.trustCenterDomains, kind: "vendor-trust-center" },
  ];

  for (const { domains, kind } of checks) {
    for (const d of domains) {
      const nd = normalizeDomain(d);
      if (
        normalized === nd ||
        normalized.endsWith(`.${nd}`) ||
        nd.endsWith(`.${normalized}`)
      ) {
        return { matched: true, domain: nd, kind };
      }
    }
  }
  return { matched: false };
}
