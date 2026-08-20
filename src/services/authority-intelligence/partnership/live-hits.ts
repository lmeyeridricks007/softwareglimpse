/**
 * Live-verified partnership search hits (2026-08-15).
 * Genuine collaboration only — reject mass link exchange.
 * Do not invent organizations or misrepresent SG as an SI.
 */

import type { PartnershipLiveHit } from "./types";
import { LINK_EXCHANGE_REJECT_LABEL } from "./types";

export const PARTNERSHIP_LIVE_HITS_VERIFIED_AT = "2026-08-15T09:15:00.000Z";

const V = PARTNERSHIP_LIVE_HITS_VERIFIED_AT;

export const PARTNERSHIP_LIVE_QUERIES_RUN: string[] = [
  "RevOps consultancy partner resources CRM implementation checklist 2026",
  "HubSpot partner directory Pipedrive partner ecosystem Salesforce AppExchange",
  "small business association software partner SCORE chamber SaaS",
  "RevOps Co-op partner Revenue Operations Alliance partner",
  "Pipedrive Expert Marketplace partner Zoho partner program",
  "SCORE.org partner with us sponsors resources library contribute",
  "CRM implementation services partners New Breed SmartBug Fairview Empat",
  "reciprocal link exchange SEO partnership scheme",
];

export const PARTNERSHIP_LIVE_HITS: PartnershipLiveHit[] = [
  // ── ACCEPT ───────────────────────────────────────────────────────────────
  {
    url: "https://www.revopscoop.com/who-we-are/become-a-revops-co-op-partner",
    domain: "revopscoop.com",
    organization: "RevOps Co-op",
    partnerType: "TECHNOLOGY_COMMUNITY",
    whyRelevant:
      "Large RevOps practitioner community with an explicit partner program for content collaboration, workshops, and digital events — audience buys and configures CRM stacks.",
    collaborationIdea:
      "Content collaboration: co-produce a CRM evaluation / implementation-readiness resource for members; optional workshop featuring SG Finder + Evaluation Checklist.",
    collaborationModels: [
      "CONTENT_COLLABORATION",
      "WORKSHOP_HOSTING",
      "TOOL_RESOURCE_SHARING",
      "JOINT_WEBINAR",
    ],
    whatWeOffer:
      "Buyer-side CRM Evaluation Checklist, Vendor Scorecard, Cost Calculator, and neutral comparison research members can use before or during implementation.",
    whatTheyOffer:
      "Access to RevOps practitioners, content collaboration with their RevOps writers, in-person/digital event hosting, community distribution.",
    mutualValue:
      "Members get practical selection/readiness tools; RevOps Co-op partners get trusted educational assets without building them from scratch; SG gets qualified visibility — not a link swap.",
    potentialLink:
      "Natural citation from co-produced member resource or workshop landing page to SG tools/checklists.",
    visibilityValue: "excellent",
    difficulty: "medium",
    contactPath: "Become a Partner page → Book a time with RevOps Co-op team",
    targetSgAssets: [
      "/resources/crm-evaluation-checklist/",
      "/tools/crm-finder/",
      "/resources/crm-implementation-checklist/",
    ],
    discoveryQuery: "RevOps Co-op partner Revenue Operations Alliance partner",
    verifiedAt: V,
    pageSummary:
      "Public partner page lists in-person events, digital events, content collaboration, keyword monitoring; CTA to book time.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
    evidenceNotes: [
      "Partner benefits include content collaboration and workshops",
    ],
  },
  {
    url: "https://www.revenueoperationsalliance.com/partner-with-us/",
    domain: "revenueoperationsalliance.com",
    organization: "Revenue Operations Alliance",
    partnerType: "INDUSTRY_ALLIANCE",
    whyRelevant:
      "Alliance of RevOps professionals with public partner/sponsor paths including webinars, podcasts, whitepapers, and Slack community exposure.",
    collaborationIdea:
      "Co-authored industry guide or webinar: CRM selection frameworks + RevOps stack readiness using SG checklists and ROA practitioner commentary.",
    collaborationModels: [
      "JOINT_WEBINAR",
      "INDUSTRY_GUIDE_CONTRIBUTION",
      "PODCAST_APPEARANCE",
      "RESEARCH_CONTRIBUTION",
    ],
    whatWeOffer:
      "Neutral CRM research assets, downloadable checklists, interactive tools for evaluation and cost modeling.",
    whatTheyOffer:
      "Community reach, webinar/podcast platforms, whitepaper distribution, warm intros in Slack (per partner page).",
    mutualValue:
      "Practitioners get usable buyer utilities; ROA gets partner content depth; SG gets brand among RevOps decision-makers.",
    potentialLink:
      "Attribution links from co-hosted webinar/whitepaper pages to SG landing assets.",
    visibilityValue: "excellent",
    difficulty: "medium",
    contactPath:
      "Partner page → media kit → reach out to Stav (stav@revopsalliance.com per page)",
    targetSgAssets: [
      "/resources/crm-evaluation-checklist/",
      "/tools/crm-cost-calculator/",
      "/resources/crm-vendor-scorecard/",
    ],
    discoveryQuery: "RevOps Co-op partner Revenue Operations Alliance partner",
    verifiedAt: V,
    pageSummary:
      "Partner/sponsor page offers tailored packages, webinars, podcasts, whitepapers; contact Stav listed.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://getfairview.com/blog/revops-implementation-checklist",
    domain: "getfairview.com",
    organization: "Fairview",
    partnerType: "REVOPS_CONSULTANCY",
    whyRelevant:
      "Publishes a detailed RevOps 90-day implementation checklist — complementary to SG’s CRM evaluation and implementation checklists (selection vs. build phases).",
    collaborationIdea:
      "Co-produced “CRM Implementation Readiness Benchmark”: SG covers pre-vendor selection + requirements; Fairview contributes 90-day RevOps build/optimize expertise.",
    collaborationModels: [
      "CO_AUTHORED_GUIDE",
      "IMPLEMENTATION_CHECKLIST_COLLAB",
      "BENCHMARK_CONTRIBUTION",
      "EXPERT_INTERVIEW",
    ],
    whatWeOffer:
      "CRM Evaluation Checklist, Requirements Builder, Migration/Implementation Planner tools, vendor-neutral research.",
    whatTheyOffer:
      "Hands-on RevOps implementation methodology (audit → build → scale), practitioner credibility, distribution to their audience.",
    mutualValue:
      "Buyers get a full funnel from choose → implement; both brands cited for distinct expertise without competing as SIs of the same type.",
    potentialLink:
      "Cross-references between readiness guide sections (evaluation ↔ 90-day plan).",
    visibilityValue: "strong",
    difficulty: "medium",
    contactPath:
      "Site contact / strategy CTA on Fairview content; propose co-authored readiness piece referencing both checklists",
    targetSgAssets: [
      "/resources/crm-implementation-checklist/",
      "/resources/crm-evaluation-checklist/",
      "/tools/crm-implementation-planner/",
    ],
    discoveryQuery:
      "RevOps consultancy partner resources CRM implementation checklist 2026",
    verifiedAt: V,
    pageSummary:
      "Public 90-day RevOps implementation checklist (audit/align, build/integrate, optimize/scale).",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://www.empat.tech/blog/crm-implementation-guide-2026",
    domain: "empat.tech",
    organization: "Empat",
    partnerType: "CRM_IMPLEMENTATION_PARTNER",
    whyRelevant:
      "Publishes a 2026 CRM implementation guide with phases, timelines, and governance — natural complement to SG buyer evaluation assets.",
    collaborationIdea:
      "Joint guide: “From CRM shortlist to go-live” — SG evaluation/scorecard/cost tools + Empat discovery→rollout expertise; expert interview series.",
    collaborationModels: [
      "CO_AUTHORED_GUIDE",
      "EXPERT_INTERVIEW",
      "IMPLEMENTATION_CHECKLIST_COLLAB",
      "TOOL_RESOURCE_SHARING",
    ],
    whatWeOffer:
      "Vendor-neutral shortlist tools, RFP/demo checklists, cost modeling before SI engagement.",
    whatTheyOffer:
      "Implementation delivery expertise, migration/integration depth, strategy-call audience, technical credibility.",
    mutualValue:
      "Prospects arrive better prepared (faster discovery); Empat differentiates with educated buyers; SG stays upstream of SI work.",
    potentialLink:
      "Guide and resource pages mutually reference evaluation checklist ↔ implementation guide.",
    visibilityValue: "strong",
    difficulty: "medium",
    contactPath:
      "Empat strategy-call CTA on implementation guide; propose co-authored readiness path",
    targetSgAssets: [
      "/resources/crm-evaluation-checklist/",
      "/resources/crm-rfp-template/",
      "/resources/crm-demo-checklist/",
      "/tools/crm-migration-planner/",
    ],
    discoveryQuery:
      "CRM implementation services partners New Breed SmartBug Fairview Empat",
    verifiedAt: V,
    pageSummary:
      "CRM Implementation Guide 2026 with phased timeline table and free strategy-call CTA.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://www.score.org/partner",
    domain: "score.org",
    organization: "SCORE",
    partnerType: "SMB_ASSOCIATION",
    whyRelevant:
      "SBA resource partner with national SMB mentoring reach; explicit partnership form includes “Add your content to the SCORE.org website” and sponsor options. Nutshell (CRM) already appears among SCORE sponsors — category precedent.",
    collaborationIdea:
      "Resource inclusion / content contribution: CRM evaluation checklist and how-to-choose educational content for SCORE mentors and clients (not pretending to be a mentor network).",
    collaborationModels: [
      "DIRECTORY_RESOURCE_INCLUSION",
      "INDUSTRY_GUIDE_CONTRIBUTION",
      "TOOL_RESOURCE_SHARING",
    ],
    whatWeOffer:
      "Free educational CRM buyer tools and checklists appropriate for small-business mentoring contexts.",
    whatTheyOffer:
      "National mentor network distribution, SCORE.org resource library reach, sponsor/partner brand association.",
    mutualValue:
      "Mentors get practical CRM selection aids; SCORE expands tech-education resources; SG reaches SMB founders legitimately.",
    potentialLink:
      "SCORE resource library or partner content page linking to SG educational assets.",
    visibilityValue: "excellent",
    difficulty: "high",
    contactPath:
      "https://www.score.org/partner — form options include add content / sponsor / alliance partner",
    targetSgAssets: [
      "/resources/crm-evaluation-checklist/",
      "/guides/how-to-choose-crm/",
      "/tools/crm-cost-calculator/",
    ],
    discoveryQuery: "SCORE.org partner with us sponsors resources library contribute",
    verifiedAt: V,
    pageSummary:
      "Partner form: become sponsor, make SCORE available to customers, add content to SCORE.org, link to SCORE content, alliance partner.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://aheadchoice.com/crm-implementation-services",
    domain: "aheadchoice.com",
    organization: "Ahead Choice",
    partnerType: "SAAS_CONSULTANT",
    whyRelevant:
      "Publishes CRM implementation partner selection guidance and curated lists across Salesforce/HubSpot/Dynamics/Zoho — aligns with SG evaluation worksheets.",
    collaborationIdea:
      "Tool/resource sharing: embed or cite SG Vendor Scorecard + RFP template inside “how to pick an implementation partner” content; expert quote exchange on selection criteria.",
    collaborationModels: [
      "TOOL_RESOURCE_SHARING",
      "EXPERT_QUOTE",
      "INDUSTRY_GUIDE_CONTRIBUTION",
    ],
    whatWeOffer:
      "Structured vendor/partner evaluation worksheets, demo checklists, requirements templates.",
    whatTheyOffer:
      "Editorial reach on SI selection, curated partner landscape knowledge, practitioner audience.",
    mutualValue:
      "Readers get actionable evaluation artifacts; Ahead Choice deepens guide utility; SG cited as buyer utility — not an SI listing.",
    potentialLink:
      "Guide outbound to SG scorecard/RFP resources; SG may cite Ahead Choice as SI-selection reading (editorial).",
    visibilityValue: "good",
    difficulty: "medium",
    contactPath: "Site contact / content collaboration outreach via Ahead Choice",
    targetSgAssets: [
      "/resources/crm-vendor-scorecard/",
      "/resources/crm-rfp-template/",
      "/tools/crm-vendor-scorecard/",
    ],
    discoveryQuery:
      "CRM implementation services partners New Breed SmartBug Fairview Empat",
    verifiedAt: V,
    pageSummary:
      "CRM Implementation Services 2026 guide listing Partner Finder directories and evaluation criteria.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://www.teraquint.com/insights/salesforce-implementation-partner-pre-flight-checklist",
    domain: "teraquint.com",
    organization: "Teraquint",
    partnerType: "CRM_IMPLEMENTATION_PARTNER",
    whyRelevant:
      "Salesforce-focused pre-flight implementation checklist — pairs with SG’s vendor-neutral evaluation and migration templates for Salesforce-bound buyers.",
    collaborationIdea:
      "Checklist collaboration: SG “before you hire an SI” pack + Teraquint Salesforce pre-flight list as a combined readiness kit.",
    collaborationModels: [
      "IMPLEMENTATION_CHECKLIST_COLLAB",
      "CO_AUTHORED_GUIDE",
      "EXPERT_INTERVIEW",
    ],
    whatWeOffer:
      "Neutral evaluation, requirements, field-mapping, and migration templates usable before Salesforce SI engagement.",
    whatTheyOffer:
      "Salesforce-specific pre-flight expertise, SI delivery credibility, insight audience.",
    mutualValue:
      "Clients better prepared for Salesforce projects; clearer handoff between selection and SI discovery.",
    potentialLink:
      "Mutual references between readiness kits (neutral ↔ Salesforce-specific).",
    visibilityValue: "good",
    difficulty: "medium",
    contactPath: "Teraquint insights/contact; propose combined pre-SI readiness kit",
    targetSgAssets: [
      "/resources/crm-implementation-checklist/",
      "/resources/crm-field-mapping-template/",
      "/resources/crm-data-migration-template/",
    ],
    discoveryQuery:
      "RevOps consultancy partner resources CRM implementation checklist 2026",
    verifiedAt: V,
    pageSummary:
      "Salesforce Implementation Partner Checklist 2026 — routing, objects, stages, integrations, definition of done.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://elefanterevops.com/blog/top-revops-agencies",
    domain: "elefanterevops.com",
    organization: "Elefante RevOps",
    partnerType: "REVOPS_CONSULTANCY",
    whyRelevant:
      "RevOps agency publishing agency-selection education and methodology covering CRM/MAP architecture — candidate for expert interview + resource sharing.",
    collaborationIdea:
      "Expert interview + tool sharing: RevOps stack evaluation using SG Finder/Cost Calculator alongside Elefante methodology commentary.",
    collaborationModels: [
      "EXPERT_INTERVIEW",
      "TOOL_RESOURCE_SHARING",
      "JOINT_WEBINAR",
    ],
    whatWeOffer:
      "Interactive CRM comparison and cost tools for prospects entering RevOps engagements.",
    whatTheyOffer:
      "RevOps delivery expertise, agency POV content, client education channels.",
    mutualValue:
      "Educated inbound for Elefante; credible expert voice for SG content; shared educational outcomes.",
    potentialLink:
      "Interview/webinar pages cite tools; agency resource hubs may list SG utilities.",
    visibilityValue: "good",
    difficulty: "medium",
    contactPath: "Elefante site contact; propose expert interview / webinar",
    targetSgAssets: ["/tools/crm-finder/", "/tools/crm-cost-calculator/"],
    discoveryQuery:
      "CRM implementation services partners New Breed SmartBug Fairview Empat",
    verifiedAt: V,
    pageSummary:
      "RevOps Agencies guide describing methodologies including Elefante, Avidly, RevPartners stack work.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://ecosystem.hubspot.com/marketplace",
    domain: "ecosystem.hubspot.com",
    organization: "HubSpot Marketplace / Solutions ecosystem",
    partnerType: "SOFTWARE_VENDOR",
    whyRelevant:
      "HubSpot maintains Solutions Directory and Marketplace for accredited implementation/onboarding partners and apps — useful ecosystem map for finding consultancy partners and understanding content adjacency.",
    collaborationIdea:
      "Explore HubSpot Solutions Partners (e.g. Diamond/accredited firms) for co-authored HubSpot-selection education using SG tools — NOT apply as a HubSpot Solutions Partner / SI. Optional: educational content citing HubSpot Academy/resources alongside SG evaluation assets.",
    collaborationModels: [
      "VENDOR_ECOSYSTEM_CONTENT",
      "CONTENT_COLLABORATION",
      "TOOL_RESOURCE_SHARING",
    ],
    whatWeOffer:
      "Vendor-neutral evaluation utilities that help buyers prepare before hiring a HubSpot Solutions Partner.",
    whatTheyOffer:
      "Partner directory of real SIs to collaborate with; marketplace distribution for apps (only if SG ships a HubSpot app — it does not today).",
    mutualValue:
      "SG partners with HubSpot SIs for education; HubSpot SIs get better-prepared clients; HubSpot ecosystem stays implementation-credentialed — SG does not claim SI status.",
    potentialLink:
      "Co-marketing with Solutions Partners; not a false Solutions Directory SI listing.",
    visibilityValue: "strong",
    difficulty: "high",
    contactPath:
      "Use Solutions Directory to shortlist accredited partners for collaboration; HubSpot partner FAQs for program rules — do not misrepresent SG as SI",
    targetSgAssets: [
      "/resources/crm-evaluation-checklist/",
      "/software/hubspot/",
    ],
    discoveryQuery:
      "HubSpot partner directory Pipedrive partner ecosystem Salesforce AppExchange",
    verifiedAt: V,
    pageSummary:
      "HubSpot Marketplace lists accredited partners for CRM implementation, onboarding, data migration, custom integration, etc.",
    vendorEcosystemNotes:
      "Solutions Directory is for service providers with Inbound Certification / partner tiers. SoftwareGlimpse is not an implementation partner — collaborate with partners or contribute educational content only.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
    evidenceNotes: [
      "Do not apply claiming CRM implementation delivery capabilities SG does not offer",
    ],
  },
  {
    url: "https://www.pipedrive.com/en/partner",
    domain: "pipedrive.com",
    organization: "Pipedrive Partner Program / Marketplace",
    partnerType: "SOFTWARE_VENDOR",
    whyRelevant:
      "Pipedrive offers Solution Provider, Technology, and Affiliate tracks plus marketplace of experts — map for finding SMB CRM consultancies to collaborate with.",
    collaborationIdea:
      "Partner with Pipedrive Solution Providers (consultancies) on SMB CRM evaluation packs using SG checklists — do NOT enroll as Solution Provider unless SG resells/implements Pipedrive. Technology partner only if building a real integration.",
    collaborationModels: [
      "VENDOR_ECOSYSTEM_CONTENT",
      "CONTENT_COLLABORATION",
      "TOOL_RESOURCE_SHARING",
    ],
    whatWeOffer:
      "SMB-friendly evaluation and cost tools that complement Pipedrive implementers’ onboarding.",
    whatTheyOffer:
      "Marketplace of certified experts to co-market with; co-selling only for true partners.",
    mutualValue:
      "Solution providers get educated SMB leads; SG stays upstream evaluator; Pipedrive ecosystem integrity preserved.",
    potentialLink:
      "Joint SMB guides with solution providers; marketplace listings only for genuine partners.",
    visibilityValue: "strong",
    difficulty: "high",
    contactPath:
      "pipedrive.com/en/partner — use to identify solution providers for collab; technology track only with real integration",
    targetSgAssets: [
      "/software/pipedrive/",
      "/resources/crm-evaluation-checklist/",
      "/tools/crm-cost-calculator/",
    ],
    discoveryQuery: "Pipedrive Expert Marketplace partner Zoho partner program",
    verifiedAt: V,
    pageSummary:
      "Partner page: solution provider (resell/implement), technology (integrate), affiliate; marketplace for finding providers.",
    vendorEcosystemNotes:
      "Solution Provider requires consulting/onboarding/implementation services — not SG’s model. Prefer collaborating with existing providers.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://www.zoho.com/partners/crmplus-partnership-program.html",
    domain: "zoho.com",
    organization: "Zoho CRM Plus Partner Program",
    partnerType: "SOFTWARE_VENDOR",
    whyRelevant:
      "Zoho’s consulting partner program targets firms delivering implementation/training — use as map to find Zoho-focused consultancies for content collab, not to claim Zoho partner status falsely.",
    collaborationIdea:
      "Identify Zoho consulting partners for co-authored “when Zoho fits” evaluation content using SG research + partner delivery stories.",
    collaborationModels: [
      "VENDOR_ECOSYSTEM_CONTENT",
      "EXPERT_INTERVIEW",
      "CO_AUTHORED_GUIDE",
    ],
    whatWeOffer:
      "Comparative CRM research and evaluation worksheets including Zoho in the researched set.",
    whatTheyOffer:
      "Zoho implementation expertise, partner marketing channels, customer stories.",
    mutualValue:
      "Clear buyer education; partners get qualified interest; SG does not pose as Zoho SI.",
    potentialLink:
      "Co-authored comparison/implementation readiness pages with partner attribution.",
    visibilityValue: "good",
    difficulty: "high",
    contactPath:
      "Zoho partners portal / application form — for true consulting partners; SG should contact existing partners for collab instead of false enrollment",
    targetSgAssets: ["/software/zoho-crm/", "/tools/crm-finder/"],
    discoveryQuery: "Pipedrive Expert Marketplace partner Zoho partner program",
    verifiedAt: V,
    pageSummary:
      "Zoho CRM Plus Partner Program for companies with sales + technical experts and CRM implementation experience.",
    vendorEcosystemNotes:
      "Eligibility expects CRM implementation experience and certification investment — misrepresentation risk if SG applies as SI.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://www.sba.gov/counseling/local-assistance/resource-partners/",
    domain: "sba.gov",
    organization: "SBA Resource Partners (SCORE / SBDC / WBC network)",
    partnerType: "SMB_ASSOCIATION",
    whyRelevant:
      "Official SBA counseling network pointing to SCORE, SBDCs, WBC/VBOC — pathway for educational resource partnerships via those orgs (not direct federal endorsement claims).",
    collaborationIdea:
      "Route SMB CRM education through SCORE/SBDC resource inclusion (see SCORE partner form) rather than claiming SBA endorsement.",
    collaborationModels: [
      "DIRECTORY_RESOURCE_INCLUSION",
      "INDUSTRY_GUIDE_CONTRIBUTION",
    ],
    whatWeOffer:
      "Plain-language CRM buyer education suitable for counseling contexts.",
    whatTheyOffer:
      "Counseling networks and local assistance discovery for small businesses.",
    mutualValue:
      "Counselors gain practical tech-selection aids; SG reaches SMB via legitimate nonprofit channels.",
    potentialLink:
      "Indirect via SCORE/SBDC resource pages — never claim official SBA product endorsement.",
    visibilityValue: "strong",
    difficulty: "high",
    contactPath:
      "Work through SCORE partner form or local SBDC resource partnerships — not cold “SBA endorsement” claims",
    targetSgAssets: [
      "/resources/crm-evaluation-checklist/",
      "/guides/how-to-choose-crm/",
    ],
    discoveryQuery:
      "small business association software partner SCORE chamber SaaS",
    verifiedAt: V,
    pageSummary:
      "SBA Resource Partners page describes SCORE mentoring, SBDC counseling, WBC/VBOC networks.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://knowledge.hubspot.com/marketplace/use-the-hubspot-solutions-directory",
    domain: "knowledge.hubspot.com",
    organization: "HubSpot Solutions Directory (partner discovery)",
    partnerType: "CRM_IMPLEMENTATION_PARTNER",
    whyRelevant:
      "Canonical instructions for finding HubSpot Solutions Partners — operational map to shortlist Diamond/accredited agencies (New Breed, SmartBug, Aptitude 8, etc. appear in industry roundups) for consultancy value exchange.",
    collaborationIdea:
      "Shortlist 2–3 HubSpot Solutions Partners for co-webinars: “Prepare your CRM shortlist before onboarding” using SG Evaluation Checklist + partner implementation playbooks.",
    collaborationModels: [
      "JOINT_WEBINAR",
      "IMPLEMENTATION_CHECKLIST_COLLAB",
      "TOOL_RESOURCE_SHARING",
    ],
    whatWeOffer:
      "Pre-engagement evaluation assets that reduce discovery churn for partners.",
    whatTheyOffer:
      "HubSpot-accredited delivery, case studies, customer audiences, co-webinar platforms.",
    mutualValue:
      "Classic consultancy value exchange: SG = selection utilities; partner = implementation expertise.",
    potentialLink:
      "Webinar and resource pages with reciprocal educational citations.",
    visibilityValue: "excellent",
    difficulty: "medium",
    contactPath:
      "Browse Solutions Directory → contact partner businesses → propose co-webinar (do not create fake SG SI profile)",
    targetSgAssets: [
      "/resources/crm-evaluation-checklist/",
      "/resources/crm-demo-checklist/",
      "/software/hubspot/",
    ],
    discoveryQuery:
      "HubSpot partner directory Pipedrive partner ecosystem Salesforce AppExchange",
    verifiedAt: V,
    pageSummary:
      "KB: customers search Solutions Directory by service/industry/country; contact business from partner profile.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://grooveconsulting.io/revops-automations-with-zapier-the-2026-guide-every-revenue-team-needs/",
    domain: "grooveconsulting.io",
    organization: "Groove Consulting",
    partnerType: "INTEGRATION_PROVIDER",
    whyRelevant:
      "RevOps consultancy publishing Zapier automation guides for CRM stacks — fits integration + RevOps education partnerships.",
    collaborationIdea:
      "Co-authored guide: CRM selection constraints that make automation easy/hard + Zapier patterns; share SG requirements/field-mapping templates.",
    collaborationModels: [
      "CO_AUTHORED_GUIDE",
      "TOOL_RESOURCE_SHARING",
      "EXPERT_INTERVIEW",
    ],
    whatWeOffer:
      "Requirements, field-mapping, and evaluation frameworks that precede automation design.",
    whatTheyOffer:
      "Automation/integration expertise, Zapier-CRM patterns, practitioner audience.",
    mutualValue:
      "End-to-end story from choose CRM → automate RevOps; both cited for complementary skills.",
    potentialLink:
      "Guide sections linking evaluation templates ↔ automation patterns.",
    visibilityValue: "good",
    difficulty: "medium",
    contactPath: "Groove Consulting site contact; propose co-authored CRM+automation guide",
    targetSgAssets: [
      "/resources/crm-requirements-template/",
      "/resources/crm-field-mapping-template/",
      "/tools/crm-requirements-builder/",
    ],
    discoveryQuery: "RevOps Co-op partner Revenue Operations Alliance partner",
    verifiedAt: V,
    pageSummary:
      "2026 guide to RevOps automations with Zapier across CRM and revenue stack.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },
  {
    url: "https://www.score.org/resources/",
    domain: "score.org",
    organization: "SCORE Resource Library",
    partnerType: "TRAINING_PROVIDER",
    whyRelevant:
      "SCORE hosts articles, templates, and tools for small businesses — adjacent to SG checklist/resource model; content contribution path via partner form.",
    collaborationIdea:
      "Submit CRM selection templates for SCORE resource library / mentor toolkit (via Partner with SCORE content option).",
    collaborationModels: [
      "DIRECTORY_RESOURCE_INCLUSION",
      "TOOL_RESOURCE_SHARING",
    ],
    whatWeOffer:
      "Mentor-ready CRM evaluation and cost-education materials.",
    whatTheyOffer:
      "Library distribution to SCORE clients and mentors nationwide.",
    mutualValue:
      "Practical tech-selection aids in mentoring workflows; SG educational reach.",
    potentialLink: "SCORE resources page entries linking to SG educational assets.",
    visibilityValue: "strong",
    difficulty: "high",
    contactPath: "Partner form “Add your content to the SCORE.org website”",
    targetSgAssets: [
      "/resources/crm-evaluation-checklist/",
      "/resources/crm-business-case-template/",
    ],
    discoveryQuery: "SCORE.org partner with us sponsors resources library contribute",
    verifiedAt: V,
    pageSummary:
      "SCORE Resources hub for articles, templates, tools; partner CTAs present.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "accept",
  },

  // ── REJECT ───────────────────────────────────────────────────────────────
  {
    url: "https://www.stork.ai/blog/reciprocal-links-seo",
    domain: "stork.ai",
    organization: "Mass reciprocal link-exchange schemes (policy reject class)",
    partnerType: "SAAS_CONSULTANT",
    whyRelevant:
      "Live coverage of Google spam policy language on excessive link exchanges ('Link to me and I'll link to you') and partner pages exclusively for cross-linking.",
    collaborationIdea:
      "You link to me and I'll link to you — reciprocal SEO partner page",
    collaborationModels: ["NEWSLETTER_EXCHANGE"],
    whatWeOffer: "Homepage/footer reciprocal links for SEO",
    whatTheyOffer: "Homepage/footer reciprocal links for SEO",
    mutualValue: "None beyond manufactured link equity — not a product collaboration",
    potentialLink: "Partner-page reciprocal links",
    visibilityValue: "none",
    difficulty: "low",
    contactPath: "N/A — rejected model",
    discoveryQuery: "reciprocal link exchange SEO partnership scheme",
    verifiedAt: V,
    pageSummary:
      "Documents that Google bans excessive link exchanges and partner pages exclusively for cross-linking; natural editorial mutual citations differ.",
    claimsImplementationPartnerStatus: false,
    provisionalDecision: "reject",
    rejectReason: LINK_EXCHANGE_REJECT_LABEL,
    rejectNotes:
      "Mass “you link to me / I link to you” is not a partnership. Natural citations from real co-created work remain allowed.",
    evidenceNotes: [
      "Policy: no mass link exchange as primary relationship model",
      "Source cites Google spam policy phrasing on excessive exchanges",
    ],
  },
  {
    url: "https://www.hubspot.com/partners/faqs",
    domain: "hubspot.com",
    organization: "HubSpot Solutions Partner Program (false SI enrollment)",
    partnerType: "CRM_IMPLEMENTATION_PARTNER",
    whyRelevant:
      "Program is for agencies delivering HubSpot services — listing SG here would misrepresent capabilities.",
    collaborationIdea:
      "Enroll SoftwareGlimpse as HubSpot Solutions Partner / SI for directory listing links",
    collaborationModels: ["DIRECTORY_RESOURCE_INCLUSION"],
    whatWeOffer: "Would falsely claim implementation/onboarding services",
    whatTheyOffer: "Solutions Directory visibility for real service providers",
    mutualValue: "Broken — buyers would expect SI services SG does not provide",
    potentialLink: "Solutions Directory profile (inappropriate)",
    visibilityValue: "none",
    difficulty: "high",
    contactPath: "Partner program application",
    discoveryQuery:
      "HubSpot partner directory Pipedrive partner ecosystem Salesforce AppExchange",
    verifiedAt: V,
    pageSummary:
      "FAQs: Solutions Partner Program for agencies/resellers delivering HubSpot services; directory listing for service providers.",
    claimsImplementationPartnerStatus: true,
    provisionalDecision: "reject",
    rejectReason: "Misrepresentation risk (SI/partner claim)",
    rejectNotes:
      "Do not enroll as Solutions Partner. Collaborate with existing partners instead (see HubSpot Marketplace accept hit).",
  },
  {
    url: "https://www.zoho.com/partners/crmplus-partnership-program.html",
    domain: "zoho.com",
    organization: "Zoho CRM Plus Partner (false consulting enrollment)",
    partnerType: "CRM_IMPLEMENTATION_PARTNER",
    whyRelevant: "Program expects CRM implementation experience and technical delivery teams.",
    collaborationIdea: "Apply as Zoho consulting partner solely for backlink/directory SEO",
    collaborationModels: ["DIRECTORY_RESOURCE_INCLUSION"],
    whatWeOffer: "Would misstate implementation capacity",
    whatTheyOffer: "Partner portal and SI positioning",
    mutualValue: "None if SG cannot deliver Zoho implementations",
    potentialLink: "Partner directory listing",
    visibilityValue: "none",
    difficulty: "high",
    contactPath: "Zoho partner application form",
    discoveryQuery: "Pipedrive Expert Marketplace partner Zoho partner program",
    verifiedAt: V,
    pageSummary:
      "Looking for partners with sales team, technical experts, CRM implementation experience.",
    claimsImplementationPartnerStatus: true,
    provisionalDecision: "reject",
    rejectReason: "Misrepresentation risk (SI/partner claim)",
    rejectNotes:
      "Reject false enrollment; partner with existing Zoho consultancies for content instead.",
  },
];

export function assertPartnershipLiveHitsPresent(
  hits: PartnershipLiveHit[],
): void {
  if (!hits.length) {
    throw new Error(
      "PartnershipOpportunityAgent requires live search hits — run a live search pass.",
    );
  }
  const accepts = hits.filter((h) => h.provisionalDecision === "accept");
  if (accepts.length < 8) {
    throw new Error(
      "PartnershipOpportunityAgent requires sufficient accept hits from live search.",
    );
  }
}
