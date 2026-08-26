import type { z } from "zod";
import { AlternativesPageSchema } from "@/domain";
import { buildAlternativesFromResearch } from "@/services/alternatives-research";
import { buildMissingAlternativesPages } from "./ecosystem-shells";
import { softwareSeed } from "./software";

type AltInput = z.input<typeof AlternativesPageSchema>;

/**
 * Hand-authored alternatives. Thin shells were removed so research materialize can approve them.
 * Products with fewer than two honest substitutes are not invented.
 */
const alternativesSeedAuthored: AltInput[] = [
  {
    id: "alt-pipedrive",
    slug: "pipedrive",
    title: "Pipedrive alternatives",
    sourceSlug: "pipedrive",
    summary:
      "Approved alternatives to Pipedrive for teams comparing pipeline CRM options with engagement suites, calling-first CRMs, and lighter relationship tools. Reasons come from approved editorial assessments — not a ranked best-of list.",
    editorialRecommendation:
      "Stay on Pipedrive when visual pipeline hygiene and Marketplace breadth are the job. Choose Freshsales when native calling and AI lead scoring matter more; Close when communication-centric outbound is daily work; Salesflare when smaller teams want automated relationship capture over pipeline ops.",
    editorialStatus: "approved",
    alternatives: [
      {
        targetSlug: "freshsales",
        reason:
          "Freshsales fits when you want pipeline CRM plus stronger built-in engagement (phone, lead scoring) in one Freshworks suite — not Pipedrive’s pipeline-first packaging alone.",
        betterWhen: [
          "Native calling and lead scoring matter in the same product",
          "You are evaluating Freshworks ecosystem fit",
        ],
        worseWhen: [
          "Visual pipeline discipline and Marketplace depth are the primary buy drivers",
          "You prefer a narrower sales CRM over a broader engagement suite",
        ],
        keyTradeoff:
          "Native engagement suite vs Pipedrive’s pipeline-first focus.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "close",
        reason:
          "Close fits communication-heavy outbound teams that want CRM workflows tightly coupled to calling and SMS — rather than board-first pipeline operations.",
        betterWhen: [
          "Calling and communication cadence are central to the sales process",
          "You want a CRM oriented around conversation workflows",
        ],
        worseWhen: [
          "You primarily need visual multi-pipeline CRM with extensive marketplace depth",
          "Your team is not communication/outbound-centric",
        ],
        keyTradeoff:
          "Communication-centric CRM workflows vs classic pipeline CRM orientation.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "salesflare",
        reason:
          "Salesflare fits smaller teams that want automated relationship capture and lighter admin — rather than Pipedrive-style pipeline stage discipline.",
        betterWhen: [
          "Smaller teams prioritize automatic relationship tracking",
          "You want less pipeline admin overhead",
        ],
        worseWhen: [
          "You need deeper pipeline customization and deal-stage discipline",
          "You are scaling a larger sales org with complex pipeline ops",
        ],
        keyTradeoff:
          "Automated relationship CRM simplicity vs pipeline operations depth.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
    ],
    metadata: {
      status: "published",
      publishedAt: "2026-08-13T00:00:00.000Z",
      updatedAt: "2026-08-26T12:00:00.000Z",
      researchStatus: "complete",
    },
    seo: {
      title: "Pipedrive Alternatives (2026)",
      description:
        "Compare Pipedrive with Freshsales, Close, and Salesflare — approved CRM alternatives for pipeline-focused sales teams.",
      indexable: true,
      canonicalPath: "/alternatives/pipedrive/",
    },
  },
  {
    id: "alt-bookyourdata",
    slug: "bookyourdata",
    title: "BookYourData alternatives",
    sourceSlug: "bookyourdata",
    summary:
      "Approved alternatives to BookYourData for teams comparing pay-as-you-go B2B contact data with broader sales-intelligence suites. Reasons come from approved relationship edges and first-party research — not a ranked best-of list.",
    editorialRecommendation:
      "Stay on BookYourData when verified contacts on never-expiring credits are the job. Move to Apollo when you want data plus sequencing in one seat; Lusha when CRM enrichment/signals matter more than one-shot list buys; RocketReach when published individual pricing cards matter; Amplemarket when AI outbound execution is the priority.",
    editorialStatus: "approved",
    alternatives: [
      {
        targetSlug: "apollo",
        reason:
          "Apollo bundles contact data with sequencing — better when you want one subscription for lists and outreach instead of pay-as-you-go credits alone.",
        betterWhen: [
          "You need sequences and engagement in the same product as the database",
          "A free tier helps you evaluate before committing",
        ],
        worseWhen: [
          "You only need verified lists and already own a sequencer",
          "You prefer never-expiring credits over seat+credit subscriptions",
        ],
        keyTradeoff:
          "Data-plus-engagement consolidation vs pay-as-you-go contact packs.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "lusha",
        reason:
          "Lusha is a stronger fit when you need ongoing CRM enrichment and buying signals rather than one-shot verified list buys.",
        betterWhen: [
          "Keeping an existing CRM database fresh is the main job",
          "Intent/signals matter alongside contact reveal",
        ],
        worseWhen: [
          "You want pay-as-you-go credits that never expire",
          "You only need filtered list exports without continuous enrichment",
        ],
        keyTradeoff:
          "Continuous enrichment workflows vs on-demand credit packs.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "rocketreach",
        reason:
          "RocketReach publishes individual credit-plan cards — better when transparent seat/credit pricing matters more than pay-as-you-go packs.",
        betterWhen: [
          "You need published Essentials/Pro/Ultimate pricing before shortlisting",
          "Individual lookup workflows fit better than bulk credit packs",
        ],
        worseWhen: [
          "You want a deliverability guarantee tied to credit refunds",
          "You prefer no-subscription, never-expiring credits",
        ],
        keyTradeoff:
          "Published individual pricing cards vs opaque/pack-based usage pricing.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "amplemarket",
        reason:
          "Amplemarket is the better substitute when AI outbound execution matters more than buying verified contact packs.",
        betterWhen: [
          "Autonomous outbound / AI SDR workflows are the primary need",
          "You want engagement automation more than a data-only buy",
        ],
        worseWhen: [
          "You only need verified emails and phones for an existing sequencer",
          "Quote-gated AI suites are a non-starter",
        ],
        keyTradeoff:
          "AI outbound suite vs contact-data-only purchasing.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
    ],
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T07:05:00.000Z",
      updatedAt: "2026-08-17T07:05:00.000Z",
    },
    seo: {
      title: "BookYourData Alternatives (2026)",
      description:
        "Compare BookYourData with Apollo, Lusha, RocketReach, and Amplemarket — approved alternatives with researched tradeoffs for B2B contact data buyers.",
      indexable: true,
      canonicalPath: "/alternatives/bookyourdata/",
    },
  },
  {
    id: "alt-reply",
    slug: "reply",
    title: "Reply.io alternatives",
    sourceSlug: "reply",
    summary:
      "Approved alternatives to Reply.io for teams comparing multichannel sales engagement suites with built-in data. Reasons come from approved relationship edges and first-party research.",
    editorialRecommendation:
      "Keep Reply when multichannel sequences plus Reply Data in one seat is the job. Choose Apollo for similar consolidation with a free tier; Amplemarket for AI-first outbound peers; Closely for LinkedIn+email automation with clearer mid-market pricing; Lusha when you mainly need data/enrichment without sequencing.",
    editorialStatus: "approved",
    alternatives: [
      {
        targetSlug: "apollo",
        reason:
          "Apollo offers similar data-plus-engagement consolidation with a free tier — better when you want to evaluate without a paid trial clock.",
        betterWhen: [
          "Free-plan evaluation matters before committing seats",
          "You want prospecting data depth alongside sequences",
        ],
        worseWhen: [
          "Reply's multichannel breadth (LinkedIn/SMS/WhatsApp) is decisive",
          "Jason AI SDR / agency packaging is the reason you shortlisted Reply",
        ],
        keyTradeoff:
          "Free-tier evaluation path vs Reply's published Email Volume / Multichannel ladder.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "amplemarket",
        reason:
          "Amplemarket is a closer AI-first outbound peer when autonomous SDR workflows matter more than Reply's published Email Volume ladder.",
        betterWhen: [
          "AI SDR autonomy is the primary evaluation criterion",
          "You want an AI-outbound specialist rather than a classic sequencer with AI assists",
        ],
        worseWhen: [
          "Published $49/$89 starting prices matter for budgeting",
          "You need clear Email Volume vs Multichannel packaging",
        ],
        keyTradeoff:
          "AI-first outbound positioning vs published entry pricing transparency.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "closely",
        reason:
          "Closely is a strong LinkedIn+email automation alternative with clearer mid-market list pricing for agency/white-label outbound.",
        betterWhen: [
          "LinkedIn automation and white-label agency needs dominate",
          "Transparent Starter/Growth/Essential pricing matters",
        ],
        worseWhen: [
          "You need WhatsApp/SMS/calls in the same sequencer as email",
          "Built-in Reply Data coverage is part of the buy",
        ],
        keyTradeoff:
          "LinkedIn+email focus with clear pricing vs broader multichannel + bundled data.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "lusha",
        reason:
          "Lusha is the better swap when you mainly need contact data and enrichment, not multichannel sequencing.",
        betterWhen: [
          "Data quality and CRM enrichment are the bottleneck",
          "You already own a sequencer elsewhere",
        ],
        worseWhen: [
          "Multichannel campaigns are the reason you evaluated Reply",
          "You want AI sequence generation and reply handling in one tool",
        ],
        keyTradeoff:
          "Contact data / enrichment vs full sales engagement suite.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
    ],
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T07:05:00.000Z",
      updatedAt: "2026-08-17T07:05:00.000Z",
    },
    seo: {
      title: "Reply.io Alternatives (2026)",
      description:
        "Compare Reply.io with Apollo, Amplemarket, Closely, and Lusha — approved alternatives for multichannel sales engagement buyers.",
      indexable: true,
      canonicalPath: "/alternatives/reply/",
    },
  },
  {
    id: "alt-kixie",
    slug: "kixie",
    title: "Kixie alternatives",
    sourceSlug: "kixie",
    summary:
      "Approved alternatives to Kixie for teams comparing CRM-connected power dialers with broader outbound or CRM+calling products. Reasons come from approved relationship edges and first-party research.",
    editorialRecommendation:
      "Keep Kixie when high-volume power dialing and SMS with CRM write-back is the job. Choose Close when you want dialer plus pipeline CRM in one product; Amplemarket when multichannel AI outbound matters more than calling; Apollo when prospecting data and email sequences are the primary jobs.",
    editorialStatus: "approved",
    alternatives: [
      {
        targetSlug: "close",
        reason:
          "Close combines calling with a pipeline CRM — better when you want dialer and deal tracking in one product.",
        betterWhen: [
          "You need conversation CRM and calling without a separate system of record",
          "Published CRM+dialer packaging simplifies the stack",
        ],
        worseWhen: [
          "You already have HubSpot/Salesforce and only need a dialer layer",
          "Multi-line power dialing and contact-center features are decisive",
        ],
        keyTradeoff:
          "CRM+calling all-in-one vs dialer layer beside an existing CRM.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "amplemarket",
        reason:
          "Amplemarket is stronger when multichannel AI outbound (email/LinkedIn) matters more than power dialing and SMS.",
        betterWhen: [
          "Email and LinkedIn sequences are the primary outbound motion",
          "AI outbound agents matter more than phone connect rates",
        ],
        worseWhen: [
          "High-volume calling is how the team actually sells",
          "You need business phone, SMS templates, and live coaching",
        ],
        keyTradeoff:
          "AI multichannel outbound vs calling-first communications.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "apollo",
        reason:
          "Apollo is the better alternative when prospecting data and email sequences are the primary jobs rather than high-volume calling.",
        betterWhen: [
          "Contact data plus email sequencing is the bottleneck",
          "You want a free tier to evaluate sales intelligence tooling",
        ],
        worseWhen: [
          "Power dialing and unlimited US/Canada minutes are the buy reason",
          "Bi-directional CRM phone activity is the integration that matters",
        ],
        keyTradeoff:
          "Sales intelligence + email engagement vs dialer/SMS communications.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
    ],
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T07:05:00.000Z",
      updatedAt: "2026-08-17T07:05:00.000Z",
    },
    seo: {
      title: "Kixie Alternatives (2026)",
      description:
        "Compare Kixie with Close, Amplemarket, and Apollo — approved alternatives for sales dialer and outbound calling buyers.",
      indexable: true,
      canonicalPath: "/alternatives/kixie/",
    },
  },
  {
    id: "alt-hubspot",
    slug: "hubspot",
    title: "HubSpot alternatives",
    sourceSlug: "hubspot",
    summary:
      "Approved alternatives to HubSpot for teams comparing freemium customer platforms with sales-focused or enterprise CRMs. Reasons come from approved relationship edges and first-party research — not a ranked best-of list.",
    editorialRecommendation:
      "Stay on HubSpot when free CRM plus a path into Sales/Marketing/Service hubs is the job. Choose Salesforce when enterprise customization and ecosystem depth dominate; Pipedrive when you want a simpler sales-only pipeline CRM; Freshsales when native phone/email engagement and lead scoring matter more than hub packaging; Dynamics 365 when Microsoft 365 / Copilot alignment is decisive.",
    editorialStatus: "approved",
    alternatives: [
      {
        targetSlug: "salesforce",
        reason:
          "Salesforce is the stronger system of record when deep customization, forecasting/reporting, and AppExchange-scale ecosystem matter more than HubSpot’s freemium hub expansion path.",
        betterWhen: [
          "Enterprise customization, governance, and multi-cloud stack fit are primary",
          "Complex pipeline forecasting and admin depth outweigh ease of entry",
        ],
        worseWhen: [
          "You want free forever CRM with a clear SMB hub upgrade path",
          "Admin/partner overhead of an enterprise platform is a non-starter",
        ],
        keyTradeoff:
          "Enterprise platform ceiling vs freemium customer-platform breadth.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "pipedrive",
        reason:
          "Pipedrive fits better when buyers want a focused visual pipeline CRM without HubSpot’s multi-hub seat packaging complexity.",
        betterWhen: [
          "Pipeline hygiene and activity-based selling are the primary buying criteria",
          "You prefer a sales-only CRM surface over marketing/service hubs",
        ],
        worseWhen: [
          "Free CRM plus marketing/service suite alignment is why you shortlisted HubSpot",
          "Marketplace-centric GTM platform breadth is decisive",
        ],
        keyTradeoff:
          "Pipeline-first simplicity vs freemium suite expansion.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "freshsales",
        reason:
          "Freshsales is a closer fit when native phone/email/chat engagement and Freddy lead scoring matter more than HubSpot hub packaging.",
        betterWhen: [
          "Built-in calling and engagement in the same CRM are central",
          "AI lead scoring and Freshworks ecosystem fit matter",
        ],
        worseWhen: [
          "True free forever CRM with hub expansion is the buy reason",
          "You need Marketing + Service hubs on one customer platform",
        ],
        keyTradeoff:
          "Native engagement suite vs freemium multi-hub platform.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "dynamics-365",
        reason:
          "Dynamics 365 Sales is the better substitute when Microsoft 365 / Copilot-native CRM workflows matter more than HubSpot’s freemium Customer Platform.",
        betterWhen: [
          "Teams already standardize on Microsoft 365 and Azure identity",
          "Enterprise Microsoft stack alignment outweighs HubSpot Marketplace fit",
        ],
        worseWhen: [
          "You need free forever CRM without Microsoft licensing context",
          "Marketing Hub–style freemium GTM packaging is the primary need",
        ],
        keyTradeoff:
          "Microsoft 365–native enterprise CRM vs freemium multi-hub platform.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
    ],
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T16:20:00.000Z",
      updatedAt: "2026-08-17T16:20:00.000Z",
    },
    seo: {
      title: "HubSpot Alternatives (2026)",
      description:
        "Compare HubSpot with Salesforce, Pipedrive, Freshsales, and Dynamics 365 — approved alternatives with researched tradeoffs for CRM buyers.",
      indexable: true,
      canonicalPath: "/alternatives/hubspot/",
    },
  },
  {
    id: "alt-attio",
    slug: "attio",
    title: "Attio alternatives",
    sourceSlug: "attio",
    summary:
      "Approved alternatives to Attio for teams comparing modern startup CRMs with suite platforms, classic pipeline tools, and lighter relationship CRMs. Reasons come from approved relationship edges and first-party research.",
    editorialRecommendation:
      "Keep Attio when flexible data modeling and a modern startup/GTM workspace are the job. Choose HubSpot for freemium CRM plus marketing hubs; Pipedrive for classic visual pipeline CRM; folk for simpler relationship-led LinkedIn/email selling; Salesforce when enterprise customization and ecosystem breadth dominate.",
    editorialStatus: "approved",
    alternatives: [
      {
        targetSlug: "hubspot",
        reason:
          "HubSpot is stronger when free CRM plus a path into Sales/Marketing/Service hubs matters more than Attio’s data-model-first startup CRM.",
        betterWhen: [
          "Marketing + sales + service on one freemium platform is the goal",
          "Marketplace integrations and hub expansion outweigh modern data-model UX",
        ],
        worseWhen: [
          "Flexible objects/attributes and startup-native UX are decisive",
          "You want a lighter CRM without multi-hub packaging",
        ],
        keyTradeoff:
          "Freemium suite breadth vs modern flexible data model.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "pipedrive",
        reason:
          "Pipedrive is the better swap when classic visual pipeline and activity-based selling matter more than Attio’s flexible CRM data model.",
        betterWhen: [
          "Deal-stage pipeline hygiene is the primary buying criterion",
          "You prefer a mature sales-CRM marketplace over a younger ecosystem",
        ],
        worseWhen: [
          "Custom objects/attributes and modern GTM workspace fit are why you chose Attio",
          "Startup-native data modeling is non-negotiable",
        ],
        keyTradeoff:
          "Pipeline-first CRM clarity vs flexible startup data model.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "folk",
        reason:
          "folk fits better when relationship-led LinkedIn/email selling with AI assistants matters more than Attio’s deeper CRM data modeling.",
        betterWhen: [
          "Founders/SMB teams sell from LinkedIn and email relationships",
          "You want a simpler collaborative CRM with folkX-style capture",
        ],
        worseWhen: [
          "Flexible CRM objects and deal workflows are the core need",
          "You need a fuller system-of-record CRM for scaling GTM ops",
        ],
        keyTradeoff:
          "Lightweight relationship CRM vs data-model-first CRM depth.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "salesforce",
        reason:
          "Salesforce is the enterprise alternative when AppExchange-scale ecosystem and deep customization outweigh Attio’s modern startup CRM focus.",
        betterWhen: [
          "Enterprise governance, forecasting, and platform depth are primary",
          "You can budget admin/implementation for a heavy CRM platform",
        ],
        worseWhen: [
          "You want a modern startup CRM without enterprise admin weight",
          "EUR Free/Plus/Pro clarity and flexible objects are the buy reason",
        ],
        keyTradeoff:
          "Enterprise platform ceiling vs modern startup CRM flexibility.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
    ],
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T16:20:00.000Z",
      updatedAt: "2026-08-17T16:20:00.000Z",
    },
    seo: {
      title: "Attio Alternatives (2026)",
      description:
        "Compare Attio with HubSpot, Pipedrive, folk, and Salesforce — approved alternatives for modern startup CRM buyers.",
      indexable: true,
      canonicalPath: "/alternatives/attio/",
    },
  },
  {
    id: "alt-zoho-crm",
    slug: "zoho-crm",
    title: "Zoho CRM alternatives",
    sourceSlug: "zoho-crm",
    summary:
      "Approved alternatives to Zoho CRM for teams comparing affordable multi-edition sales CRMs with freemium platforms, pipeline specialists, and engagement suites. Reasons come from approved relationship edges and first-party research.",
    editorialRecommendation:
      "Stay on Zoho CRM when Free-to-Ultimate value, Blueprint automation, and Zoho suite fit are the job. Choose HubSpot for freemium Customer Platform + hubs; Pipedrive for pipeline-first simplicity; Freshsales for native phone/email engagement; Salesforce when enterprise customization ceiling matters more than list-price value.",
    editorialStatus: "approved",
    alternatives: [
      {
        targetSlug: "hubspot",
        reason:
          "HubSpot is stronger when freemium CRM plus Marketing/Sales/Service hub expansion matters more than Zoho’s multi-edition price ladder.",
        betterWhen: [
          "Customer Platform freemium growth path is the primary need",
          "Marketing + sales alignment on one vendor outweighs Zoho edition value",
        ],
        worseWhen: [
          "Aggressive Free/Standard pricing and Blueprint automation are decisive",
          "You are already standardized on the Zoho suite",
        ],
        keyTradeoff:
          "Freemium multi-hub platform vs affordable multi-edition CRM value.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "pipedrive",
        reason:
          "Pipedrive fits better when a focused visual pipeline CRM matters more than Zoho’s broader edition ladder and suite packaging.",
        betterWhen: [
          "Pipeline visibility and activity discipline are the main jobs",
          "You want a sales-only CRM without multi-app Zoho packaging",
        ],
        worseWhen: [
          "Free edition plus Blueprint process control is why you chose Zoho",
          "Zia AI and multi-edition depth on a budget matter",
        ],
        keyTradeoff:
          "Pipeline-first simplicity vs affordable full-featured CRM ladder.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "freshsales",
        reason:
          "Freshsales is a closer peer when native phone/email/chat engagement and Freddy scoring matter more than Zoho’s edition/value story.",
        betterWhen: [
          "Built-in calling and engagement suite features are central",
          "Freshworks ecosystem fit outweighs Zoho suite alignment",
        ],
        worseWhen: [
          "Published Free edition and aggressive Standard entry pricing are decisive",
          "Blueprint process automation across Zoho apps is the buy reason",
        ],
        keyTradeoff:
          "Native engagement CRM vs affordable multi-edition Zoho CRM.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
      {
        targetSlug: "salesforce",
        reason:
          "Salesforce is the better substitute when enterprise customization and ecosystem breadth outweigh Zoho’s price-to-capability positioning.",
        betterWhen: [
          "Complex org governance, forecasting, and AppExchange depth dominate",
          "You can budget beyond SMB CRM list pricing for platform TCO",
        ],
        worseWhen: [
          "Cost-conscious Free-to-Ultimate ladder is the primary buying criterion",
          "You want lower admin overhead than Salesforce-class CRM",
        ],
        keyTradeoff:
          "Enterprise platform ceiling vs affordable multi-edition CRM value.",
        relativePricing: "unknown",
        researchStatus: "complete",
      },
    ],
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T16:20:00.000Z",
      updatedAt: "2026-08-17T16:20:00.000Z",
    },
    seo: {
      title: "Zoho CRM Alternatives (2026)",
      description:
        "Compare Zoho CRM with HubSpot, Pipedrive, Freshsales, and Salesforce — approved alternatives for affordable CRM buyers.",
      indexable: true,
      canonicalPath: "/alternatives/zoho-crm/",
    },
  },
];

const alternativesFromResearch = buildAlternativesFromResearch(
  softwareSeed,
  alternativesSeedAuthored,
);

export const alternativesSeed: AltInput[] = [
  ...alternativesSeedAuthored,
  ...alternativesFromResearch,
  ...buildMissingAlternativesPages(softwareSeed, [
    ...alternativesSeedAuthored,
    ...alternativesFromResearch,
  ]),
];
