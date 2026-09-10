#!/usr/bin/env npx tsx
/**
 * Improvement Wave 1 — hand-authored compare enrichment overlays.
 *
 *   npx tsx scripts/seo/wave1/write-compare-overlays.ts
 *
 * The deterministic enrichment pass produced interchangeable analysis on these
 * 20 URLs ("share buyer workflows; choose based on documented strengths"),
 * which scores ~1.0 semantic similarity against sibling comparisons. This
 * script replaces the templated prose with a genuine A-vs-B decision thesis per
 * pair, written from what is actually documented in research enrichment:
 * shortDescription, vendorPositioning, limitations, and the plan structure.
 *
 * Rules held here:
 * - Existing URLs only — no new slugs, no renamed comparisons.
 * - No invented hands-on testing, ratings, or scores.
 * - No dollar/euro amount that is not already a fact in research enrichment;
 *   pairs whose pricing pack is fixture-derived or vendor-blocked say so.
 * - Structured overlay data (capability rows, pricing envelope, alternatives)
 *   is reused from the prior overlay rather than re-derived or dropped.
 */
import {
  getAllComparisonsUnfiltered,
  getSoftware,
  getSoftwareBySlug,
} from "@/data";
import { categoryDecisionCostHref } from "@/data/config/tools/category-tool-meta";
import { loadEnrichment } from "@/data/research/store";
import type {
  Comparison,
  Pricing,
  ProductResearchEnrichment,
  Software,
} from "@/domain/schemas";
import { assessComparisonSemanticTemplateRisk } from "@/services/content-quality/gate/semantic-template";
import {
  buildCapabilityCompareRows,
  mergeComparisonWithOverlay,
  resolveComparisonEvidence,
  runCompareEnrichmentQa,
} from "@/services/seo/compare-enrichment";
import type { CompareEnrichmentOverlay } from "@/services/seo/compare-enrichment/overlay-merge";
import {
  listCompareEnrichmentOverlaySlugs,
  loadCompareEnrichmentOverlay,
  saveCompareEnrichmentOverlay,
} from "@/services/seo/compare-enrichment/overlay-store";
import type {
  ComparisonThesis,
  PricingDiffSummary,
  UniqueDecisionElement,
} from "@/services/seo/compare-enrichment/types";

const WAVE_NOTE = "improve-wave-1-2026-09-07";

/** Editorial target for sibling similarity after the rewrite. */
const PREFERRED_MAX_SIMILARITY = 0.72;

const BASE_UNIQUE: UniqueDecisionElement[] = [
  "quick_verdict",
  "choose_if_rules",
  "key_differences",
  "pricing_diff",
  "target_audience",
  "scenario_fit",
  "evidence_clarity",
  "final_recommendation",
];

type PairAnalysis = {
  slug: string;
  /** Must match the comparison's productSlugs (order-insensitive). */
  products: [string, string];
  thesis: ComparisonThesis;
  summary: string;
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
  scenarios: Array<{
    scenario: string;
    preferredSlug: string | null;
    rationale: string;
  }>;
  /**
   * Pair-specific rationale appended to existing criterion outcomes, keyed by
   * criterion slug. The recorded winner, confidence, score citation and
   * research status are preserved untouched — these notes explain the tradeoff
   * rather than re-judging it, so they cannot contradict the scoring pipeline.
   * Criterion slugs absent from a comparison are skipped.
   */
  criterionNotes?: Record<string, string>;
};

/**
 * One entry per URL. Every thesis, verdict, and scenario below is written from
 * that pair's own enrichment record — the point is that none of these
 * paragraphs would still make sense if you swapped the product names.
 */
const WAVE1_PAIRS: PairAnalysis[] = [
  {
    slug: "salesforce-vs-siebel",
    products: ["salesforce", "siebel"],
    criterionNotes: {
      customization:
        "Both bend to unusual process; what differs is who does the bending — a large open admin market on one side, Siebel specialists in shrinking supply on the other.",
      administration:
        "Administration is the crux of this pair: documented configuration overhead on a modern platform against ongoing maintenance of long-lived customisations nobody wants to touch.",
      integrations:
        "New integrations arrive as marketplace installs on one side; on the other they extend integration work built during earlier programme phases.",
      scalability:
        "Scale is proven on both sides — the real difference is whether new capability arrives as a release you adopt or a project you fund.",
      "value-for-money":
        "Value turns on the estate, not the feature list: published editions can be modelled today, while a Siebel renewal only beats replacement until specialist rates say otherwise.",
    },
    thesis: {
      kind: "same_category_different_strengths",
      label: "Current Sales Cloud editions vs an installed Siebel estate",
      rationale:
        "Salesforce publishes a Free Suite through Unlimited edition ladder and is shipping agent tooling; Oracle Siebel is licensed by custom quote as a legacy platform that Oracle itself steers greenfield buyers away from towards Fusion/CX.",
      supportedBy: ["same_category", "declared_competitor"],
    },
    summary:
      "This is not a feature bake-off — it is an estate question. If Siebel is already running mission-critical processes, the comparison is really about the switching cost of re-implementing them; if you are buying CRM fresh, Siebel is not a live option because Oracle points new evaluations at Fusion/CX and quotes Siebel only on request. Salesforce answers the same brief with published editions, a 2-seat Free Suite, and 30-day trials, at the price of administration and configuration overhead the vendor documents openly.",
    verdict:
      "Choose Sales Cloud when the CRM is being bought rather than inherited: editions are published, trials are self-serve, and admin talent is easy to hire. Siebel is worth keeping only if Siebel-specific processes are load-bearing today and a cutover would mean re-implementing custom workflows, re-mapping decades of data, and re-training the people who run them — that switching cost, not capability, is Siebel's remaining argument. Poor fit for Salesforce: teams that expect a lightweight tool, because the platform's own research notes call out administration and configuration overhead as the tradeoff. Poor fit for Siebel: any greenfield buyer, since there is no published entry price, no trial, and the specialist skills market is shrinking.",
    pricingNotes:
      "Salesforce publishes a per-user ladder — Free Suite at $0 for 2 seats, Starter Suite from $25, then Pro Suite $100, Enterprise $175, and Unlimited $350 per user/month on annual terms, with Agentforce for Sales and Revenue Intelligence sold as separate add-ons. Siebel is custom-quote only with no free plan and no trial, so a like-for-like budget needs a licence quote plus implementation and support estimates before you can compare anything.",
    bestFor: [
      {
        productSlug: "salesforce",
        scenarios: [
          "Buying CRM for a sales org with no legacy platform to protect",
          "Wanting published seat pricing and a self-serve trial before committing",
          "Planning AI agent workflows inside the CRM rather than alongside it",
        ],
      },
      {
        productSlug: "siebel",
        scenarios: [
          "Operating mission-critical Siebel processes that would need full re-implementation",
          "Deferring a replatform while an Oracle CX migration is planned separately",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "New sales organisation, no existing CRM estate",
        preferredSlug: "salesforce",
        rationale:
          "Published editions plus a 2-seat Free Suite let you start without a quote cycle, whereas Siebel cannot be evaluated at all without engaging Oracle licensing.",
      },
      {
        scenario:
          "Siebel already runs custom order and service processes in production",
        preferredSlug: "siebel",
        rationale:
          "The documented risk here is cutover, not capability: data mapping and re-training against long-lived customisations usually costs more than another year of licence maintenance.",
      },
      {
        scenario: "Modernisation programme with a 2–3 year horizon",
        preferredSlug: null,
        rationale:
          "Neither answer is clean — most estates run Sales Cloud for new business while Siebel is decommissioned process by process, so budget for both licences during the overlap.",
      },
    ],
  },
  {
    slug: "pipedrive-vs-salesforce",
    products: ["pipedrive", "salesforce"],
    criterionNotes: {
      "ease-of-use":
        "Activity-based defaults ship usable with no configuration backlog, while the platform side names administration and configuration overhead as its own documented tradeoff versus lighter pipeline tools.",
      "sales-automation":
        "Automation is a plan question here: the cheapest pipeline rung lacks workflow automation and full email sync, and deeper platform orchestration sits on annually billed editions.",
      customization:
        "Custom objects, approval chains and territory logic are the platform's purpose; the pipeline tool reintroduces explicit caps on custom fields, teams and reports at its top rung.",
      administration:
        "One side assumes nobody owns a configuration backlog, the other assumes an admin or partner does — the largest hidden cost difference in this pair.",
      "value-for-money":
        "Cost diverges at the seat line rather than the feature line: campaign and web-visitor add-ons on one side, an edition ladder plus agent and revenue add-ons on the other.",
    },
    thesis: {
      kind: "enterprise_vs_smb",
      label: "Activity-based pipeline tool vs enterprise CRM platform",
      rationale:
        "Pipedrive is documented as pipeline-first with activity-based selling; Salesforce's own research record states it is not a lightweight SMB CRM and names administration overhead as the tradeoff versus Pipedrive-style tools.",
      supportedBy: ["same_category", "declared_competitor", "same_audience"],
    },
    summary:
      "The honest split is who administers the thing. Pipedrive gives a small sales team a visual pipeline and a clear next activity on every deal, and it expects nobody to own a configuration backlog. Salesforce gives you custom objects, governance, sandboxes and an ecosystem, and expects somebody — internal admin or partner — to look after them. Buy Pipedrive if you want reps selling next week; buy Salesforce if the requirement is a platform that other departments will also build on.",
    verdict:
      "Pipedrive wins when the job is deal-stage hygiene for a team that measures itself in calls and meetings: setup requires no specialist, and the pipeline view is the product rather than a report you configure. Salesforce wins when you need custom objects, territory and approval logic, or a sandbox before changes hit production — capability Pipedrive does not attempt. The pricing threshold matters as much as features: Pipedrive's Lite plan cannot cover an active team because it lacks full email sync and workflow automation, so realistic quotes start at Growth, while Salesforce's published ladder jumps to $100 per user/month at Pro Suite and $175 at Enterprise on annual terms. Avoid Salesforce if no one will own administration; avoid Pipedrive if you need native telephony and AI scoring bundled, because deeper calling relies on Marketplace apps and Campaigns and Web Visitors stay paid add-ons on every plan.",
    pricingNotes:
      "Pipedrive is per-seat subscription with a documented starting point of $14 per user/month and four rungs (Lite, Growth, Premium, Ultimate) plus a 14-day trial; Campaigns and Web Visitors are add-ons throughout, and Ultimate introduces explicit caps on custom fields, teams and reports. Salesforce starts at $25 per user/month on Starter Suite with a $0 two-seat Free Suite, then $100 Pro Suite, $175 Enterprise, $350 Unlimited billed annually. Model the add-on line, not just the seat line, before comparing totals.",
    bestFor: [
      {
        productSlug: "pipedrive",
        scenarios: [
          "Sales teams of roughly 3–20 reps with no dedicated CRM admin",
          "Managers who want stalled deals visible without building reports",
          "Teams replacing spreadsheets who need a pipeline live in days",
        ],
      },
      {
        productSlug: "salesforce",
        scenarios: [
          "Multi-region sales orgs needing territory, approval and audit control",
          "Companies extending CRM data to service, finance or partner apps",
          "Buyers who need a sandbox and release process around CRM changes",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Five-rep team that needs a working pipeline this month",
        preferredSlug: "pipedrive",
        rationale:
          "Activity-based defaults ship usable out of the box; the same rollout on Salesforce needs object and layout decisions before reps log a single call.",
      },
      {
        scenario: "Sales ops standardising process across several business units",
        preferredSlug: "salesforce",
        rationale:
          "Custom objects, governance and sandbox testing are the reason the platform exists, and Pipedrive's caps on custom fields and teams on Ultimate become a hard ceiling.",
      },
      {
        scenario: "Outbound team that wants dialler and email sequences included",
        preferredSlug: null,
        rationale:
          "Neither is a clean answer: Pipedrive leans on Marketplace calling apps while Salesforce puts sales engagement behind separate paid add-ons, so price the engagement layer as its own line item.",
      },
    ],
  },
  {
    slug: "pega-vs-salesforce",
    products: ["pega", "salesforce"],
    criterionNotes: {
      "pipeline-management":
        "Pipeline is a first-class object on one side and one shape of case on the other, so this criterion really asks whether your unit of work is a deal or a case.",
      "sales-automation":
        "Rules-driven case routing and stage-based sales automation relieve different bottlenecks; choosing the wrong shape means modelling your process twice.",
      customization:
        "Both are highly configurable, but decisioning-platform configuration expects a delivery team while CRM configuration expects an admin.",
      administration:
        "Documented overhead on both sides — quote-only enterprise implementation against published editions that accumulate configuration debt.",
      "value-for-money":
        "With no published entry price on the decisioning side, value can only be judged against a scoped quote plus implementation, never per seat.",
    },
    thesis: {
      kind: "general_purpose_vs_specialist",
      label: "Case-and-decisioning platform vs sales CRM of record",
      rationale:
        "Pega is documented as an enterprise case management and decisioning platform quoted only on request, while Salesforce publishes sales-cycle editions — the two answer different questions about the same customer.",
      supportedBy: ["same_category", "same_buyer_problem"],
    },
    summary:
      "Pega and Sales Cloud get shortlisted together by enterprises writing one 'customer platform' requirement, and that requirement usually contains two different jobs. Pega's shape is the case: long-running, rules-driven work that has to be adjudicated consistently across channels. Salesforce's shape is the opportunity: stages, forecast, quota, close date. Deciding which shape your actual bottleneck has is the whole comparison — everything else follows from it.",
    verdict:
      "Pega earns the budget when the hard problem is decisioning and case handling — claims, onboarding, disputes, eligibility — where routing rules and audit trails matter more than pipeline reports; its own record notes it is overkill for simple pipeline CRM needs. Salesforce earns it when the hard problem is selling, and when you want published editions and a trial instead of a quote cycle. Implementation effort separates them further: Pega needs platform specialists and a documented admin overhead, while Salesforce needs an admin but not a case-modelling practice. Poor fit for Pega: any team whose real requirement is pipeline hygiene and forecasting, because you will pay for a decisioning engine to run a deal board. Poor fit for Salesforce: regulated case work where the process, not the deal, is the unit of work.",
    pricingNotes:
      "Pega is custom enterprise quote only in our research pack — no published entry price, no free plan and no trial — so total cost depends entirely on scoped licences plus implementation. Salesforce publishes Free Suite ($0, 2 seats), Starter Suite from $25, Pro Suite $100, Enterprise $175 and Unlimited $350 per user/month on annual billing, with agent and revenue add-ons priced separately. Compare a scoped Pega quote against a Salesforce edition plus add-ons and implementation, never against seat price alone.",
    bestFor: [
      {
        productSlug: "pega",
        scenarios: [
          "Regulated case workflows needing rules-based adjudication and audit trails",
          "Enterprises with an in-house platform team to model and maintain cases",
          "Cross-channel decisioning where next-best-action drives the interaction",
        ],
      },
      {
        productSlug: "salesforce",
        scenarios: [
          "Sales organisations whose core requirement is pipeline, quota and forecast",
          "Buyers who need published pricing and a trial to get started",
          "Teams that want a large admin and consultancy talent pool",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Insurance claims or eligibility workflows across channels",
        preferredSlug: "pega",
        rationale:
          "Case modelling and decisioning are the product; recreating that in a sales object model means building and maintaining the rules layer yourself.",
      },
      {
        scenario: "Sales team needs quotes, forecast accuracy and stage discipline",
        preferredSlug: "salesforce",
        rationale:
          "The documented tradeoff is explicit — Pega is overkill for simple pipeline CRM needs, and its setup requires specialists you would hire only for case work.",
      },
      {
        scenario: "No in-house platform engineering capacity",
        preferredSlug: "salesforce",
        rationale:
          "Both carry admin overhead, but only one can be started on a published edition with a trial while you decide; Pega's implementation effort assumes a delivery team.",
      },
    ],
  },
  {
    slug: "hubspot-vs-pipedrive",
    products: ["hubspot", "pipedrive"],
    criterionNotes: {
      "email-capabilities":
        "Email is where packaging shows: campaign tooling sits inside the platform on one side and stays a paid add-on on the other, at every tier.",
      "sales-automation":
        "Automation is gated by hub tier on one side and plan rung on the other, and the cheapest pipeline rung ships without workflow automation or full email sync.",
      reporting:
        "Shared-record reporting across marketing and sales against pipeline reporting built on stages and activities — the same word, two different outputs.",
      administration:
        "Seat and hub hygiene is the recurring admin job on one side; watching add-on creep is the equivalent on the other.",
      "value-for-money":
        "A $0 CRM tier changes the entry maths, and required onboarding on the Professional hub rung changes the year-one maths back.",
    },
    thesis: {
      kind: "similar_product_different_pricing_model",
      label: "Free-CRM-plus-hubs ladder vs single per-seat pipeline licence",
      rationale:
        "HubSpot's documented packaging mixes a free CRM, Smart CRM seats and hub seats on separate ladders; Pipedrive sells one per-seat plan family with Campaigns and Web Visitors as add-ons.",
      supportedBy: ["same_category", "declared_competitor", "similar_pricing_tier"],
    },
    summary:
      "Both run a deal board, so the decision is about what happens around it. HubSpot lets you start at zero cost and then buy capability by hub and by seat type, which is generous at entry and complicated at renewal. Pipedrive has no free tier and one per-seat ladder, which is simpler to forecast but assumes marketing lives somewhere else. Pick on which kind of complexity you would rather manage: packaging complexity or tool sprawl.",
    verdict:
      "Pipedrive is the better answer for a sales team that wants pipeline and automation without a platform project — one licence line, activity-based defaults, and no hub taxonomy to learn. HubSpot is the better answer when contacts, forms and campaign history need to sit on the same record as deals, and its free CRM makes it the default for anyone who cannot sign a subscription yet. The trade-off you accept with HubSpot is packaging: Smart CRM seats and Sales Hub seats are separate ladders, Sales Hub Professional lists at $100 per seat/month ($90 billed annually) and requires $1,500 of onboarding, so the bill jumps in steps rather than sliding. The trade-off with Pipedrive is scope: Lite cannot run an active team because it lacks full email sync and workflow automation, and Campaigns stays a paid add-on however far you climb. Avoid HubSpot if nobody will own seat and hub hygiene; avoid Pipedrive if you need marketing and sales reporting from one system.",
    pricingNotes:
      "HubSpot documents a $0 Free CRM plus Starter, Professional and Enterprise Smart CRM tiers from $15 per month, with Sales Hub priced on its own seat ladder — Professional at $100 per seat/month, $90 on annual billing, plus required $1,500 Professional onboarding. Pipedrive has no free plan; the documented ladder starts at $14 per user/month across Lite, Growth, Premium and Ultimate with a 14-day trial, and Campaigns and Web Visitors remain add-ons on every tier. Count seat type, hub and add-on lines on the HubSpot side before comparing with a Pipedrive seat total.",
    bestFor: [
      {
        productSlug: "hubspot",
        scenarios: [
          "Founders who need a CRM of record today at no cost",
          "Marketing-led teams keeping campaigns and deals on one contact record",
          "Companies expecting to add service or marketing tooling to the same stack",
        ],
      },
      {
        productSlug: "pipedrive",
        scenarios: [
          "Sales-led teams that want one predictable per-seat line",
          "Managers running activity-based coaching rather than campaign reporting",
          "Teams that already own an email marketing platform they like",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Solo founder or two-person team with no CRM budget",
        preferredSlug: "hubspot",
        rationale:
          "Free CRM covers contacts and deals at $0, while Pipedrive has no free plan and its Lite rung is missing email sync and automation anyway.",
      },
      {
        scenario: "Eight reps who need pipeline automation and nothing else",
        preferredSlug: "pipedrive",
        rationale:
          "One per-seat plan buys the workflow advantage directly; the equivalent on HubSpot means Sales Hub seats at $100 per seat/month plus onboarding before automation depth arrives.",
      },
      {
        scenario: "Sales and marketing must report from the same contact record",
        preferredSlug: "hubspot",
        rationale:
          "Campaign history on the CRM record is the platform's reason to exist, whereas Pipedrive keeps Campaigns as an add-on and expects marketing tooling elsewhere.",
      },
    ],
  },
  {
    slug: "insightly-vs-salesforce",
    products: ["insightly", "salesforce"],
    criterionNotes: {
      "pipeline-management":
        "Pipeline is where these two overlap most; the decision sits on what happens to the record after closed-won.",
      reporting:
        "Utilisation and delivery reporting on one side, forecast and governance reporting on the other — different questions asked of the same deals.",
      customization:
        "Enterprise object modelling against SMB-scale custom fields: the ceiling arrives far earlier on the CRM-plus-projects side.",
      administration:
        "One expects no dedicated admin; the other assumes one — and our pricing evidence for the SMB side is medium confidence pending live re-verification.",
      scalability:
        "Scaling into hundreds of seats is a documented strength on one side and an untested assumption on the other.",
    },
    thesis: {
      kind: "general_purpose_vs_specialist",
      label: "CRM with project delivery attached vs enterprise sales platform",
      rationale:
        "Insightly is documented as CRM plus project management for service-oriented SMBs; Salesforce documents editions, customisation depth and administration overhead for enterprise sales operations.",
      supportedBy: ["same_category", "overlapping_use_cases"],
    },
    summary:
      "The interesting difference is what happens after the deal closes. Insightly carries the won opportunity into projects, so the same record covers sold work and delivered work — the reason service businesses shortlist it. Salesforce treats delivery as somebody else's system and invests instead in how the deal was structured, governed and forecast. If your pain is handover, that is the whole decision; if your pain is governance, it decides itself the other way.",
    verdict:
      "Insightly is the right pick for agencies, consultancies and implementers whose closed-won moment triggers delivery work, because pipeline and projects share one record instead of an integration. Salesforce is the right pick when sales process depth, customisation and audit control are the constraint and delivery already lives in a PSA or ticketing tool. One caveat you should not skip: our pricing record for Insightly is medium confidence because the vendor page was blocked during research, so re-verify plan contents on the live checkout before you commit — that is a limitation of the evidence, not a judgement about the product. Poor fit for Insightly: enterprise teams needing sandboxes, territory logic and formal release process. Poor fit for Salesforce: a 15-person service firm that would be paying for platform depth to solve a handover problem.",
    pricingNotes:
      "Insightly has no free plan and runs Plus, Professional and Enterprise with a 14-day trial; our pack records $29, $49 and $99 per user/month billed annually at medium confidence because the official pricing page was Cloudflare-blocked during research, so treat those rungs as needing confirmation. Salesforce publishes Free Suite ($0, 2 seats), Starter Suite $25, Pro Suite $100, Enterprise $175 and Unlimited $350 per user/month on annual terms. Automation and AI features sit on Insightly's higher plans, so compare the tier you would actually buy rather than the entry rung.",
    bestFor: [
      {
        productSlug: "insightly",
        scenarios: [
          "Service firms that hand won deals to a delivery team",
          "SMBs wanting CRM and project tracking without a second subscription",
          "Teams whose reporting question is utilisation as much as pipeline",
        ],
      },
      {
        productSlug: "salesforce",
        scenarios: [
          "Enterprise sales operations needing customisation and audit control",
          "Companies whose delivery work already lives in a dedicated PSA tool",
          "Buyers who need published pricing and a large admin talent pool",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Agency where every closed deal becomes a delivery project",
        preferredSlug: "insightly",
        rationale:
          "Projects attached to the CRM record remove the handover integration entirely; on Salesforce that workflow means buying or building a delivery layer.",
      },
      {
        scenario: "Sales org needing territory rules, sandbox and audit trails",
        preferredSlug: "salesforce",
        rationale:
          "That governance depth is what the edition ladder is for, and it is not something a CRM-plus-projects SMB tool sets out to provide.",
      },
      {
        scenario: "Buyer who needs firm numbers before a purchase decision",
        preferredSlug: "salesforce",
        rationale:
          "Salesforce's ladder is published and verifiable today; our Insightly rungs are medium confidence pending live re-verification, which is a real procurement risk rather than a product flaw.",
      },
    ],
  },
  {
    slug: "salesforce-vs-sugarcrm",
    products: ["salesforce", "sugarcrm"],
    criterionNotes: {
      customization:
        "Both support deep configuration; the practical difference is whether an unusual requirement becomes a marketplace install or a services engagement.",
      integrations:
        "Marketplace breadth against a narrower catalogue is the most consequential gap in this pair — price it as integration effort, not as a feature tick.",
      "sales-automation":
        "AI-assisted selling is packaged inside the edition on one side and sold as a separate agent add-on on the other.",
      administration:
        "Admin and consultant supply differs sharply, which shows up as contractor day rates rather than as a line on the licence quote.",
      "value-for-money":
        "Three published editions model more cleanly than an edition plus a shopping list of support, agent and revenue-intelligence add-ons.",
    },
    thesis: {
      kind: "same_category_different_strengths",
      label: "Ecosystem-and-add-ons breadth vs three fixed CX editions",
      rationale:
        "Salesforce documents an edition ladder plus separately priced Agentforce, Revenue Intelligence and support add-ons; SugarCRM documents Sugar Sell in three editions with Sugar Intelligence AI included in the packaging story.",
      supportedBy: ["same_category", "declared_competitor"],
    },
    summary:
      "Both sell a customer-experience CRM to mid-market and enterprise sales teams, and both will demo well. The difference buyers actually feel is packaging shape: Salesforce is an edition plus a shopping list, where agents, revenue intelligence and premier support arrive as separate purchases; Sugar Sell is three editions where the AI story is part of the edition. That changes how predictable your year-two invoice is more than it changes what reps see on screen.",
    verdict:
      "Salesforce is the safer answer when you need the app ecosystem, a deep hiring pool of admins, or vertical extensions you would otherwise build — and when you can absorb an add-on ladder where Premier Support, Agentforce for Sales and Revenue Cloud are priced apart from the seat. Sugar Sell is the sharper answer when you want CX-oriented sales capability in a three-rung structure and are tired of pricing conversations that end in 'contact us': Standard, Advanced and Premier are published per user/month, with Sugar Intelligence positioned inside the product rather than beside it. The limitation to respect on the Sugar side is thinner marketplace depth, so unusual integrations become services work instead of an install. Poor fit for Salesforce: teams whose budget cannot survive add-on creep. Poor fit for SugarCRM: teams that need a specific ISV app or plentiful contractor supply on day one.",
    pricingNotes:
      "SugarCRM publishes Sugar Sell Standard at $59, Advanced at $85 and Premier at $135 per user/month billed annually, with a trial and no free plan, and our record flags that packaging can change so the live checkout should be confirmed. Salesforce runs Free Suite ($0, 2 seats), Starter Suite $25, Pro Suite $100, Enterprise $175 and Unlimited $350 per user/month annually, with Agentforce for Sales, Revenue Intelligence and Premier Support quoted separately. The comparison only makes sense once Salesforce add-ons are added to the seat line.",
    bestFor: [
      {
        productSlug: "salesforce",
        scenarios: [
          "Teams that depend on marketplace apps or vertical ISV extensions",
          "Companies hiring admins and consultants from a deep talent market",
          "Buyers wanting agent tooling from the same vendor as the CRM",
        ],
      },
      {
        productSlug: "sugarcrm",
        scenarios: [
          "Mid-market CX teams wanting a three-edition ladder they can budget",
          "Buyers avoiding an add-on shopping list for AI and support",
          "Sales orgs replacing an ageing CRM without a platform programme",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Requirement list includes two niche industry integrations",
        preferredSlug: "salesforce",
        rationale:
          "Marketplace breadth turns those into installs, whereas the same requirement on Sugar usually becomes a services engagement.",
      },
      {
        scenario: "Finance wants a predictable three-year CRM cost",
        preferredSlug: "sugarcrm",
        rationale:
          "Three published editions with AI inside the packaging model more cleanly than an edition price whose add-ons — support, agents, revenue intelligence — are quoted separately.",
      },
      {
        scenario: "AI assistance is a must-have this year",
        preferredSlug: null,
        rationale:
          "Both document AI, but the buying shapes differ: Sugar Intelligence sits in the edition story while Agentforce for Sales is an add-on from $125 per user/month, so price the AI line explicitly on both quotes.",
      },
    ],
  },
  {
    slug: "hubspot-vs-insightly",
    products: ["hubspot", "insightly"],
    criterionNotes: {
      "pipeline-management":
        "Both handle pipeline competently for SMB teams; the decision lands either side of the closed-won moment.",
      "email-capabilities":
        "Campaign tooling on the contact record is native on one side, while the other expects an email platform to live elsewhere.",
      reporting:
        "Demand-generation reporting against delivery and utilisation reporting — buy for the half of the revenue cycle you currently cannot see.",
      scalability:
        "One scales by adding seats and hubs, the other by climbing plan rungs that hold automation and AI on higher tiers.",
      "value-for-money":
        "Zero-cost entry against a paid entry rung recorded at medium confidence — verify the live checkout before calling either one cheaper.",
    },
    thesis: {
      kind: "general_purpose_vs_specialist",
      label: "Front-office customer platform vs CRM plus delivery projects",
      rationale:
        "HubSpot documents a free CRM extended by marketing, sales and service hubs; Insightly documents CRM combined with project management for service-oriented SMBs.",
      supportedBy: ["same_category", "overlapping_use_cases"],
    },
    summary:
      "Both are SMB-friendly CRMs, but they extend in opposite directions. HubSpot grows forward into demand generation — forms, campaigns, sequences, service tickets — on one contact record. Insightly grows backward into delivery, carrying the closed-won deal into projects and tasks. Ask which half of your revenue cycle is currently unmanaged, because that is the half you are actually buying software for.",
    verdict:
      "HubSpot is the better fit when pipeline is fine and lead generation is the gap: campaign history, forms and sequences on the same record are worth more than any project module, and the free CRM lets you start before budget exists. Insightly is the better fit when winning work is not the problem but delivering it is — the handover from opportunity to project is native rather than an integration you maintain. Watch two different limits: on HubSpot, packaging complexity rises sharply once Smart CRM seats and hub seats mix, and Sales Hub Professional lists at $100 per seat/month with $1,500 onboarding; on Insightly, automation and AI live on higher plans and our pricing confidence is medium pending live re-verification. Poor fit for HubSpot: service firms who would still buy a separate delivery tool anyway. Poor fit for Insightly: marketing-led teams whose next hire is a demand-gen manager.",
    pricingNotes:
      "HubSpot documents a $0 Free CRM plus Starter, Professional and Enterprise Smart CRM tiers from $15 per month, with Sales Hub seats on a separate ladder (Professional $100 per seat/month, $90 annually, plus required $1,500 onboarding). Insightly has no free plan and offers Plus, Professional and Enterprise with a 14-day trial, recorded at $29, $49 and $99 per user/month annually at medium confidence because the vendor page was blocked during research. Entry cost favours HubSpot; the comparison changes once you price the plan that actually holds the features you need.",
    bestFor: [
      {
        productSlug: "hubspot",
        scenarios: [
          "Teams whose bottleneck is lead generation rather than delivery",
          "Businesses that need a CRM of record at zero cost first",
          "Companies planning to consolidate marketing and service tooling later",
        ],
      },
      {
        productSlug: "insightly",
        scenarios: [
          "Consultancies and agencies tracking projects against won deals",
          "SMBs replacing a CRM plus a separate project tracker",
          "Operations leads who report on delivery as well as pipeline",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Professional services firm juggling CRM and a project tracker",
        preferredSlug: "insightly",
        rationale:
          "One record for the sold and the delivered work removes the sync problem; HubSpot would leave the project side unmanaged or in a third tool.",
      },
      {
        scenario: "Team that needs forms, email campaigns and deal tracking together",
        preferredSlug: "hubspot",
        rationale:
          "Demand generation on the CRM record is the platform's core use case, and the free tier means you can prove the workflow before paying.",
      },
      {
        scenario: "Buyer with a hard $0 starting budget",
        preferredSlug: "hubspot",
        rationale:
          "Free CRM is documented at $0 while Insightly's entry rung is a paid $29 per user/month plan after a 14-day trial.",
      },
    ],
  },
  {
    slug: "salesforce-vs-sap",
    products: ["salesforce", "sap"],
    criterionNotes: {
      integrations:
        "Integration is the entire argument: staying inside the ERP landscape removes master-data mapping that a best-of-breed CRM has to maintain permanently.",
      reporting:
        "Order and revenue reporting is easier where the ERP already holds the data; sales-cycle reporting is easier where the CRM was designed around it.",
      customization:
        "Both are heavyweight to configure, but only one can be trialled on a published edition while requirements are still moving.",
      administration:
        "Documented high implementation overhead on the ERP-aligned side against documented configuration overhead on the CRM side — neither is light.",
      "value-for-money":
        "Quote-only pricing rules out per-seat comparison; weigh a scoped licence plus integration against an edition plus add-ons.",
    },
    thesis: {
      kind: "same_category_different_strengths",
      label: "Best-of-breed CRM vs CRM aligned to an SAP landscape",
      rationale:
        "SAP Customer Experience is documented as quote-only and best fit inside SAP landscapes; Salesforce publishes editions and is bought as an independent CRM platform.",
      supportedBy: ["same_category", "declared_competitor"],
    },
    summary:
      "This pairing is usually decided by the ERP, not the CRM. If order-to-cash, pricing and fulfilment already live in SAP, then keeping the customer layer inside the same landscape removes integration and master-data work that would otherwise be permanent. If they do not, SAP CX is an unusual first CRM, and Salesforce's published editions and ecosystem are the default for a reason. Judge this one on where your data of record already sits.",
    verdict:
      "SAP Customer Experience makes sense when SAP is the system of record for products, prices and orders: the data mapping between CRM and ERP is the expensive part of any CRM programme, and staying in the landscape shrinks it. Salesforce makes sense whenever the CRM is meant to be independent of the ERP, when you want published seat pricing and a trial rather than a quote cycle, or when you need marketplace apps and an easy admin hiring market. Both carry real implementation effort — SAP's own record notes high implementation overhead and quote-only pricing, and Salesforce documents administration and configuration cost as its tradeoff — so neither is a light lift. Poor fit for SAP CX: companies with no SAP footprint, who inherit enterprise implementation weight for no integration benefit. Poor fit for Salesforce: SAP-centric organisations that would spend the savings on ERP integration and duplicated master data.",
    pricingNotes:
      "SAP Customer Experience is custom quote only in our record — no published entry price, no free plan, no trial — so cost is a function of scoped licences plus integration and implementation. Salesforce publishes Free Suite ($0, 2 seats), Starter Suite $25, Pro Suite $100, Enterprise $175 and Unlimited $350 per user/month billed annually, with agent and revenue add-ons separate. When comparing, add the ERP integration line to the Salesforce quote and the implementation line to the SAP quote; seat price alone will mislead in both directions.",
    bestFor: [
      {
        productSlug: "salesforce",
        scenarios: [
          "CRM programmes that must stay independent of the ERP roadmap",
          "Buyers needing published pricing, trials and marketplace apps",
          "Sales orgs hiring admins from a broad talent market",
        ],
      },
      {
        productSlug: "sap",
        scenarios: [
          "SAP-centric organisations where ERP holds pricing and order data",
          "Programmes where CRM-to-ERP master data alignment is the main risk",
          "Enterprises standardising on one vendor landscape by policy",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "SAP ERP already owns order-to-cash and product master data",
        preferredSlug: "sap",
        rationale:
          "Keeping the customer layer in the landscape removes the data mapping and reconciliation work that dominates cross-vendor CRM projects.",
      },
      {
        scenario: "No SAP footprint and a sales team that needs CRM this quarter",
        preferredSlug: "salesforce",
        rationale:
          "Published editions and a self-serve trial start immediately, while SAP CX cannot be evaluated without a quote and an implementation plan.",
      },
      {
        scenario: "Board mandate to reduce vendor count",
        preferredSlug: null,
        rationale:
          "Consolidation favours SAP inside an SAP estate, but the switching cost of moving an existing sales team off a working CRM often outweighs the vendor-count saving — price the re-training as part of the decision.",
      },
    ],
  },
  {
    slug: "monday-sales-crm-vs-salesforce",
    products: ["monday-sales-crm", "salesforce"],
    criterionNotes: {
      "ease-of-use":
        "Boards sit close to the spreadsheet habits teams already have, which is why adoption differs between these two more than capability does.",
      "pipeline-management":
        "A pipeline board reflects process; a purpose-built CRM enforces it — that distinction decides most of this pair.",
      customization:
        "Board columns and automations cover a lot before custom objects are needed, but the ceiling is real and arrives as a migration rather than a setting.",
      administration:
        "Workspace admin against CRM admin: one keeps boards tidy, the other manages releases, and only the second needs a sandbox.",
      "value-for-money":
        "Currencies and packaging differ across our records and there is no permanent free CRM rung on the Work OS side, so re-check both quotes before comparing.",
    },
    thesis: {
      kind: "enterprise_vs_smb",
      label: "Work OS boards adapted to sales vs purpose-built sales platform",
      rationale:
        "monday sales CRM is documented as monday.com's Work OS boards applied to pipelines and collaboration; Salesforce documents purpose-built sales editions with customisation and administration depth.",
      supportedBy: ["same_category", "same_audience"],
    },
    summary:
      "monday sales CRM wins arguments inside companies that already run on monday.com boards, because the pipeline becomes another board the whole company can read and automate. Salesforce wins arguments in sales organisations that need the CRM to enforce process rather than reflect it. The real question is whether your pipeline is a collaboration artefact shared with marketing and delivery, or a controlled system of record with governance around changes.",
    verdict:
      "Choose monday sales CRM when the sales team is small enough to work in boards and cross-functional visibility is the point — the workflow advantage is that deals, onboarding tasks and campaign work sit in one workspace people already open daily. Choose Salesforce when you need custom objects, territory and approval logic, sandboxes, and reporting that survives an audit; a board-based CRM does not attempt that. Note two documented cautions: monday's plan structure (Basic, Standard, Pro, Ultimate) can change and should be confirmed on live checkout, and there is no permanent free CRM plan in our research pack — so the 'we already pay for monday' assumption needs checking against CRM seat pricing. Poor fit for monday sales CRM: regulated sales processes needing controlled change management. Poor fit for Salesforce: a ten-person team whose real requirement is shared visibility, where administration overhead buys nothing.",
    pricingNotes:
      "monday sales CRM is per-seat with no free CRM plan documented and a trial available; our pack records CRM-classic pricing in euros — Basic €12 per seat/month annual (€18 monthly), Standard €17 (€25), Pro €28 (€41), with Ultimate listed and to be confirmed live. Salesforce publishes Free Suite ($0, 2 seats), Starter Suite $25, Pro Suite $100, Enterprise $175 and Unlimited $350 per user/month annually. Currencies differ between these records, so convert before comparing, and confirm monday's current CRM packaging on checkout.",
    bestFor: [
      {
        productSlug: "monday-sales-crm",
        scenarios: [
          "Companies already standardised on monday.com boards",
          "Small sales teams that need marketing and delivery to see the pipeline",
          "Teams automating handoffs between sales, onboarding and projects",
        ],
      },
      {
        productSlug: "salesforce",
        scenarios: [
          "Sales orgs needing enforced process, approvals and territory rules",
          "Companies requiring sandbox testing before CRM changes ship",
          "Reporting obligations that need audit-grade CRM history",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Cross-functional team that already runs projects in monday.com",
        preferredSlug: "monday-sales-crm",
        rationale:
          "Adding a pipeline board avoids a second tool and a second login; the same visibility on Salesforce means integration work and licences for non-sales viewers.",
      },
      {
        scenario: "Sales operations needs approvals, territories and audit history",
        preferredSlug: "salesforce",
        rationale:
          "Governance is the platform's purpose, and board-based automation is not a substitute when changes must be controlled and traceable.",
      },
      {
        scenario: "Migrating from spreadsheets with no CRM habits yet",
        preferredSlug: "monday-sales-crm",
        rationale:
          "Boards are closer to the spreadsheet mental model, so you re-train people less; the tradeoff is that pipeline discipline stays a convention rather than a constraint.",
      },
    ],
  },
  {
    slug: "hubspot-vs-tidio",
    products: ["hubspot", "tidio"],
    criterionNotes: {
      "live-chat":
        "Chat is one bundled channel on the platform side and the whole product on the other, so widget depth and deflection quality are not comparable line items.",
      "ticketing-depth":
        "Documented as thin ticketing versus a full helpdesk on the chat side — SLA-driven support teams should read this as a hard limit, not a scoring gap.",
      "ai-features":
        "AI means an answering agent trained on your own content on one side, and assistive features spread across a customer platform on the other.",
      "agent-minimum":
        "The billing units differ — seats and hubs against billable conversations — so website traffic, not headcount, drives one of these bills.",
      omnichannel:
        "Omnichannel depth is documented below the large service suites on the chat side, and reached only by buying more hubs on the platform side.",
    },
    thesis: {
      kind: "overlapping_use_case_tradeoff",
      label: "CRM system of record vs website chat and AI deflection",
      rationale:
        "Tidio's research record explicitly re-homes it to live chat and customer service and states it is not a sales pipeline CRM replacement; HubSpot documents a free CRM plus hubs — so the pair splits by job, not by tier.",
      supportedBy: ["overlapping_use_cases", "same_buyer_problem"],
    },
    summary:
      "These two are not substitutes, and pretending otherwise is the fastest way to buy the wrong thing. Tidio's job is the conversation on your website: live chat, the Lyro AI agent, and flows that answer visitors before a ticket exists. HubSpot's job is the record that outlives the conversation: contacts, deals, campaign history. Teams that shortlist both usually end up running one of each — so the useful decision is which job is unmet right now, and what the second tool will need to sync.",
    verdict:
      "Buy Tidio when unanswered website conversations are the leak — high-intent visitors bouncing, repetitive pre-sales questions, an inbox nobody owns — and you want AI deflection handling volume before humans see it. Buy HubSpot when the leak is memory: nobody knows which deals are open, what marketing sent, or who owns follow-up. The limitation that decides most cases is that Tidio cannot serve as a pipeline CRM of record and is not a full helpdesk either, with omnichannel depth documented as below the big service suites; HubSpot's chat, meanwhile, comes attached to a platform whose packaging complexity grows once hubs and seat types mix. Pricing shapes differ too: Tidio bills against conversation caps, so traffic spikes push you up tiers, while HubSpot bills per seat and per hub. Poor fit for Tidio: teams needing ticketing depth, SLAs or a system of record. Poor fit for HubSpot: a store that only wants a chat widget and an AI answerer this week.",
    pricingNotes:
      "Tidio documents a free plan plus Starter at $24.17 per month on annual billing for 100 billable conversations and Growth from $49.17 per month annual, with Lyro AI and flows for deflection — conversation-cap pricing means high-traffic sites move up tiers on volume rather than headcount. HubSpot documents a $0 Free CRM plus Smart CRM tiers from $15 per month and hub seats priced separately. Because the billing units differ — conversations against seats and hubs — a per-month comparison is only meaningful once you estimate monthly chat volume.",
    bestFor: [
      {
        productSlug: "hubspot",
        scenarios: [
          "Teams that need a contact and deal system of record",
          "Marketing-led businesses tying campaign history to pipeline",
          "Companies planning to consolidate sales and service tooling",
        ],
      },
      {
        productSlug: "tidio",
        scenarios: [
          "Ecommerce and lead-gen sites with high pre-sales chat volume",
          "Small teams deflecting repetitive questions with an AI agent",
          "Businesses wanting a chat widget live in a day without a CRM project",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Store losing high-intent visitors to unanswered questions",
        preferredSlug: "tidio",
        rationale:
          "Live chat plus Lyro AI answers the visitor in the moment; a CRM records the contact afterwards but does not resolve the conversation.",
      },
      {
        scenario: "Nobody can say which deals are open or who owns follow-up",
        preferredSlug: "hubspot",
        rationale:
          "That is a system-of-record problem, and Tidio's own documentation rules it out as a sales pipeline replacement.",
      },
      {
        scenario: "Support team needs SLAs, queues and ticket depth",
        preferredSlug: null,
        rationale:
          "Neither wins: Tidio is documented as thin on ticketing versus full helpdesks, and HubSpot's service depth means buying another hub — evaluate dedicated helpdesk tools instead.",
      },
    ],
  },
  {
    slug: "hubspot-vs-salesforce",
    products: ["hubspot", "salesforce"],
    criterionNotes: {
      customization:
        "Custom objects and governance are one platform's centre of gravity; the other optimises for a contact record that marketing and sales both trust.",
      "email-capabilities":
        "Marketing continuity on the record against sales engagement sold as an add-on — the same requirement, priced in a different place.",
      administration:
        "One assumes self-serve adoption, the other assumes an admin, and unmaintained configuration is how CRM reporting quietly loses credibility.",
      integrations:
        "Both lead their category here, so connector counts rarely decide this pair — packaging and seat types do.",
      "value-for-money":
        "Both publish a free entry point; value diverges at the seat mix, required onboarding and agent add-ons rather than at headline list price.",
    },
    thesis: {
      kind: "similar_product_different_pricing_model",
      label: "Seat-and-hub ladder with a free tier vs edition ladder with add-ons",
      rationale:
        "HubSpot documents free CRM, Smart CRM seats and hub seats as separate ladders; Salesforce documents Free Suite through Unlimited editions with Agentforce, Revenue Intelligence and support sold separately.",
      supportedBy: ["same_category", "declared_competitor", "same_buyer_problem"],
    },
    summary:
      "Both can run a large sales organisation, and both now have a free entry point, so the decision has moved from capability to packaging and centre of gravity. HubSpot's centre of gravity is the contact and the campaign, and its cost grows by seat type and hub. Salesforce's centre of gravity is the object model and the admin who shapes it, and its cost grows by edition and add-on. The right question is whether your CRM should be optimised for marketing continuity or for configurability.",
    verdict:
      "HubSpot is the stronger choice for marketing-led companies: one record carries forms, campaign history, sequences and deals, and adoption rarely needs a consultant. Salesforce is the stronger choice when the CRM must bend to an unusual process — custom objects, approval chains, territory logic, sandbox-then-release — and when you want a marketplace and a deep admin hiring pool. Cost behaves differently rather than being higher or lower: HubSpot's Sales Hub Professional lists at $100 per seat/month ($90 annually) plus required $1,500 onboarding, and mixing Smart CRM seats with hub seats is where bills surprise people; Salesforce's ladder steps from $25 Starter Suite to $100 Pro Suite to $175 Enterprise per user/month annually, with agent tooling from $125 per user/month on top. Poor fit for HubSpot: teams whose process needs deep custom objects and governance. Poor fit for Salesforce: teams with no admin capacity, where configuration debt accumulates until reports stop being trusted.",
    pricingNotes:
      "Both document a free entry: HubSpot's $0 Free CRM and Salesforce's $0 Free Suite for 2 seats. Paid ladders diverge in shape — HubSpot Smart CRM tiers from $15 per month with Sales Hub Professional at $100 per seat/month ($90 annual) and $1,500 required Professional onboarding; Salesforce Starter Suite $25, Pro Suite $100, Enterprise $175, Unlimited $350 per user/month on annual billing with Agentforce for Sales from $125 per user/month as an add-on. Total cost depends on which seat types and add-ons you actually need, so quote the full basket on both sides.",
    bestFor: [
      {
        productSlug: "hubspot",
        scenarios: [
          "Marketing-led revenue teams keeping campaigns and deals on one record",
          "Companies without dedicated CRM administrators",
          "Buyers who want to start free and grow into paid hubs",
        ],
      },
      {
        productSlug: "salesforce",
        scenarios: [
          "Sales processes needing custom objects, approvals and territories",
          "Enterprises requiring sandboxes and controlled release of CRM changes",
          "Companies relying on marketplace apps or vertical extensions",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Inbound-led business where marketing owns most pipeline",
        preferredSlug: "hubspot",
        rationale:
          "Campaign attribution on the same record as the deal is native, while achieving it on Salesforce means additional clouds or integration work.",
      },
      {
        scenario: "Complex quoting, approval and territory rules",
        preferredSlug: "salesforce",
        rationale:
          "Configurability is the product; HubSpot's packaging pushes you into higher hub tiers before it delivers comparable process control.",
      },
      {
        scenario: "No admin capacity and a team that must self-serve",
        preferredSlug: "hubspot",
        rationale:
          "Salesforce's own record names administration and configuration overhead as its tradeoff, and unmaintained configuration is how CRM reporting loses credibility.",
      },
    ],
  },
  {
    slug: "capsule-vs-pipedrive",
    products: ["capsule", "pipedrive"],
    criterionNotes: {
      "ease-of-use":
        "Simplicity is a design goal on one side rather than missing depth — which is exactly why its caps are published per tier.",
      "sales-automation":
        "Automation switches on at the middle rung on both sides, so entry plans are the wrong place to judge this comparison.",
      reporting:
        "Advanced reporting is tier-gated on the simple CRM and central to the pipeline tool's activity coaching model.",
      scalability:
        "Contact, pipeline and custom-field caps are documented per tier on one side; the other reintroduces caps only at its top rung.",
      "value-for-money":
        "Only one side has a free plan, which usually settles the decision for very small teams before any feature comparison begins.",
    },
    thesis: {
      kind: "automation_first_vs_simplicity_first",
      label: "Deliberately simple contact CRM vs pipeline automation depth",
      rationale:
        "Capsule documents simplicity for small businesses with strict per-tier caps and automations starting on Growth; Pipedrive documents activity-based selling with workflow automation as the core of its paid ladder.",
      supportedBy: ["same_category", "declared_competitor", "same_audience"],
    },
    summary:
      "Both are small-business CRMs that respect your time, so the split is how much machinery you want behind the pipeline. Capsule optimises for clarity: contacts, tasks, a simple pipeline, and a free tier to start on. Pipedrive optimises for momentum: stages, activities and automation that keep deals moving without a manager chasing. If a person is the bottleneck, Capsule is enough; if the process is the bottleneck, Pipedrive is the one that fixes it.",
    verdict:
      "Capsule is the right call for very small teams and solo operators who want relationship clarity without paying for automation they will not configure — and it is the only side of this pair with a free plan. Pipedrive is the right call once deals are lost to follow-up gaps rather than to competitors, because workflow automation and activity discipline are what its paid tiers exist to provide. Plan caps decide more of this than features: Capsule limits contacts, pipelines and custom fields strictly by tier, keeps automations off until Growth and enrichment until Advanced, and cannot act as a marketing automation suite; Pipedrive's Lite rung lacks full email sync and workflow automation, and Ultimate reintroduces caps on custom fields, teams and reports. Avoid Capsule if you need multi-step sequences or forecasting. Avoid Pipedrive if a lightweight contact CRM at $0 would genuinely do, because you would be paying for a process you do not run.",
    pricingNotes:
      "Capsule is freemium: a free plan plus Starter, Growth, Advanced and a contact-sales Ultimate rung, documented from $18 per user/month with a 14-day trial, and automations begin on Growth with enrichment on Advanced. Pipedrive has no free plan and starts at $14 per user/month across Lite, Growth, Premium and Ultimate with a 14-day trial, plus Campaigns and Web Visitors as paid add-ons. The like-for-like comparison is Capsule Growth against Pipedrive Growth, since that is where automation actually turns on for both.",
    bestFor: [
      {
        productSlug: "capsule",
        scenarios: [
          "Solo consultants and two-person teams starting on a free plan",
          "Businesses whose CRM job is relationship and task clarity",
          "Teams that would never configure a workflow builder",
        ],
      },
      {
        productSlug: "pipedrive",
        scenarios: [
          "Sales teams losing deals to inconsistent follow-up",
          "Managers who need activity-based coaching and pipeline reporting",
          "Teams growing past strict contact and custom-field caps",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Two-person consultancy tracking a few dozen relationships",
        preferredSlug: "capsule",
        rationale:
          "The free tier covers the job and nothing needs configuring, while Pipedrive has no free plan and its cheapest rung is missing email sync anyway.",
      },
      {
        scenario: "Team of eight where follow-up discipline is the problem",
        preferredSlug: "pipedrive",
        rationale:
          "Activity-based selling plus workflow automation is the documented strength; on Capsule you would be waiting for the Growth tier to unlock automations that are still lighter.",
      },
      {
        scenario: "Growing past a few thousand contacts with custom data needs",
        preferredSlug: "pipedrive",
        rationale:
          "Capsule's caps on contacts, pipelines and custom fields are explicit per tier, so the ceiling arrives as a plan jump rather than a gradual cost.",
      },
    ],
  },
  {
    slug: "close-vs-pipedrive",
    products: ["close", "pipedrive"],
    criterionNotes: {
      "email-capabilities":
        "Email, SMS and calling share one workspace on the calling-first side; the pipeline tool keeps campaigns as an add-on and calling in the marketplace.",
      "sales-automation":
        "One product's automation works leads on the phone; the other's moves deals between stages — same word, different job.",
      integrations:
        "Marketplace calling apps are how the pipeline tool reaches parity, which adds a vendor relationship rather than a feature.",
      reporting:
        "Connect rates and call coaching against stage conversion and forecasting — pick the metric your managers actually run on.",
      "value-for-money":
        "Per-user pricing is documented as high versus pipeline-only CRMs, and usage-based calling with non-rolling AI credits makes monthly spend variable by design.",
    },
    thesis: {
      kind: "same_category_different_strengths",
      label: "Calling-first CRM vs pipeline-first CRM",
      rationale:
        "Close documents calling, email, SMS and Chloe AI automation as the core product for high-velocity inside sales; Pipedrive's record notes native telephony and AI calling are limited and deeper calling relies on Marketplace apps.",
      supportedBy: ["same_category", "declared_competitor", "shared_capabilities"],
    },
    summary:
      "Ask what a rep's day looks like. If it is dials, voicemails, texts and follow-ups measured in hours, Close is built around that loop and Pipedrive is a board you update afterwards. If it is a smaller number of considered deals moved through stages over weeks, Pipedrive's activity model fits and Close's calling machinery is capacity you pay for and do not use. The comparison is about call volume, not about which CRM is more modern.",
    verdict:
      "Close is worth its premium only if reps genuinely live on the phone: the dialler, SMS and Chloe AI automation sit inside the CRM, so nobody stitches a phone tool to a deal record. Pipedrive is the better value when calling is occasional and the real work is stage hygiene, reporting and integrations, since it does that with one predictable seat line. Two cost behaviours to plan for on Close: per-user pricing is documented as high versus pipeline-only CRMs, with Growth at $99 and Scale at $139 per user/month on annual terms, and calling is usage-based while AI credits are pooled monthly with plan caps and no rollover — so a busy month costs more than a quiet one. On Pipedrive, the tradeoff is that serious calling means Marketplace apps and another vendor relationship. Avoid Close if the team makes a handful of calls a week; avoid Pipedrive if outbound calling is the business model.",
    pricingNotes:
      "Close has no free plan and runs Solo, Essentials, Growth and Scale with a 14-day trial, documented from $9 per user/month at entry, with Growth at $99 and Scale at $139 per user/month annually where the advanced Chloe automation and predictive dialling depth sit; calling is usage-based and AI credits do not roll over. Pipedrive also has no free plan, starts at $14 per user/month across Lite, Growth, Premium and Ultimate with a 14-day trial, and keeps Campaigns and Web Visitors as add-ons. Include expected call minutes on the Close side and third-party dialler subscriptions on the Pipedrive side, or the totals are not comparable.",
    bestFor: [
      {
        productSlug: "close",
        scenarios: [
          "Inside sales teams whose day is measured in dials and connects",
          "Outbound teams wanting dialler, SMS and CRM in one seat",
          "Managers coaching from call recordings and sequence activity",
        ],
      },
      {
        productSlug: "pipedrive",
        scenarios: [
          "Teams where deals progress through meetings rather than call volume",
          "Buyers who want one predictable per-seat cost with no usage line",
          "Sales orgs that already own a telephony provider they keep",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "SDR team making high-volume outbound calls daily",
        preferredSlug: "close",
        rationale:
          "Dialling, texting and AI follow-up happen where the record lives; the same workflow on Pipedrive requires Marketplace calling apps because native telephony is documented as limited.",
      },
      {
        scenario: "Consultative sales cycle with a few calls per deal",
        preferredSlug: "pipedrive",
        rationale:
          "You would be paying Close's higher per-user rate for dialler capacity nobody uses, when the actual need is stage discipline and reporting.",
      },
      {
        scenario: "Finance wants a fixed monthly software cost",
        preferredSlug: "pipedrive",
        rationale:
          "Close's usage-based calling and non-rolling AI credit pool make monthly spend variable by design, while Pipedrive's cost moves only when seats or add-ons change.",
      },
    ],
  },
  {
    slug: "freshsales-vs-hubspot",
    products: ["freshsales", "hubspot"],
    criterionNotes: {
      "sales-automation":
        "Sequences and contact scoring start at the middle rung on one side, while the other reaches comparable depth through a hub seat plus required onboarding.",
      "email-capabilities":
        "Multi-channel engagement is built into the CRM on one side; on the other, marketing email is a separate hub with its own ladder.",
      reporting:
        "Forecasting insights are Enterprise-only on one side and hub-tier dependent on the other, so mid-tier reporting parity is the thing to test in the trial.",
      integrations:
        "Suite gravity matters more than connector counts: whichever vendor already runs your support or marketing stack wins this criterion in practice.",
      "value-for-money":
        "A low documented entry price is offset by tier gating and named add-ons; a free tier is offset by required onboarding at the Professional rung.",
    },
    thesis: {
      kind: "similar_product_different_pricing_model",
      label: "Feature-gated sales CRM ladder vs free CRM with hub seats",
      rationale:
        "Freshsales documents Growth, Pro and Enterprise with sequences, scoring and forecasting gated by tier plus named paid add-ons; HubSpot documents a free CRM with Smart CRM and hub seat ladders on top.",
      supportedBy: ["same_category", "declared_competitor", "similar_pricing_tier"],
    },
    summary:
      "Both bring AI-assisted selling to mid-sized teams, and both look inexpensive at the entry rung. The difference is where the money appears later. Freshsales gates the features a real sales team needs — sequences, contact scoring, territories — onto Pro and above, with a couple of named add-ons. HubSpot gives the CRM away and charges for seats and hubs, with onboarding attached to Professional. Read both ladders at the tier you would actually run, not the one in the headline.",
    verdict:
      "Freshsales is the better answer for a sales-led team on a tight budget that wants multi-channel engagement and Freddy AI insights inside a CRM, provided you accept that sequences, contact scoring and territory management start on Pro, while forecasting insights, custom modules, sandbox and audit logs are Enterprise-only. HubSpot is the better answer when marketing and sales must share one record, or when you need a CRM today at $0 — but Sales Hub Professional lists at $100 per seat/month ($90 annually) with a required $1,500 onboarding fee, and mixing Smart CRM seats with hub seats is where the invoice becomes hard to predict. One caution specific to Freshsales: marketing copy references a free plan, but the live plan cards researched in August 2026 list Growth, Pro and Enterprise only from $9 per user/month, so do not build a rollout on a free tier we cannot verify. Avoid Freshsales if you need marketing automation depth in the same tool; avoid HubSpot if a sales-only team would be paying platform prices for a pipeline.",
    pricingNotes:
      "Freshsales has no verified free plan: documented rungs are Growth, Pro and Enterprise from $9 per user/month with a 21-day trial, plus named add-ons — branded documents at $19 per user/month and Freddy AI Agent at $49 per 100 sessions. HubSpot documents a $0 Free CRM, Smart CRM tiers from $15 per month, and Sales Hub Professional at $100 per seat/month ($90 annual) with $1,500 required onboarding. The entry comparison flatters both; compare Freshsales Pro against the HubSpot seat mix you would really buy.",
    bestFor: [
      {
        productSlug: "freshsales",
        scenarios: [
          "Sales-led teams wanting AI lead insights on a low entry price",
          "Teams needing built-in phone and multi-channel engagement",
          "Buyers comfortable moving to Pro for sequences and scoring",
        ],
      },
      {
        productSlug: "hubspot",
        scenarios: [
          "Companies where marketing and sales must share one contact record",
          "Teams that need a CRM of record at zero cost immediately",
          "Businesses planning to add service or marketing hubs later",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Ten-rep sales team with a hard software budget",
        preferredSlug: "freshsales",
        rationale:
          "The documented ladder from $9 per user/month reaches sequences and scoring at Pro for less than Sales Hub Professional's $100 per seat/month plus onboarding.",
      },
      {
        scenario: "Marketing owns lead generation and needs shared reporting",
        preferredSlug: "hubspot",
        rationale:
          "Campaign history on the CRM record is native, whereas Freshsales would need a separate marketing platform and an integration to match it.",
      },
      {
        scenario: "Need forecasting insights and audit logs",
        preferredSlug: null,
        rationale:
          "Both push this to the top: Freshsales puts forecasting, custom modules, sandbox and audit logs on Enterprise, and HubSpot puts comparable governance on Enterprise hub tiers — so price the top rung, not the middle.",
      },
    ],
  },
  {
    slug: "copper-vs-hubspot",
    products: ["copper", "hubspot"],
    criterionNotes: {
      "ease-of-use":
        "Working inside Gmail removes the context switch that kills CRM adoption — a workflow advantage no feature matrix captures.",
      integrations:
        "Workspace-native depth against breadth across marketing and service tooling; the right answer depends on where your team already spends the day.",
      "email-capabilities":
        "Inbox-side relationship history against campaign tooling on the CRM record — only one of those is demand generation.",
      reporting:
        "Pipeline and relationship reporting against platform reporting that spans campaigns, deals and service tickets.",
      "value-for-money":
        "There is no free rung on the Workspace-native side, and its documented discount only appears on annual billing.",
    },
    thesis: {
      kind: "general_purpose_vs_specialist",
      label: "Google Workspace-native CRM vs standalone customer platform",
      rationale:
        "Copper is documented as a Google Workspace-native CRM for pipeline and relationship management inside Gmail and Google apps; HubSpot documents a full platform with its own free CRM and hub ladders.",
      supportedBy: ["same_category", "overlapping_use_cases"],
    },
    summary:
      "Copper's entire argument is that reps never leave Gmail: the CRM lives inside Workspace, so relationship and pipeline updates happen where the conversation already is. HubSpot's argument is that the CRM should be the place everything else plugs into, Gmail included. If your team's day is email and Google Docs and adoption has failed before, Copper's workflow advantage is real and hard to replicate; if you need forms, campaigns and reporting to live with the deals, that is not what Copper is for.",
    verdict:
      "Choose Copper when adoption is the risk and Workspace is the workplace — a CRM that appears inside Gmail collects data that a separate tab does not. Choose HubSpot when the requirement extends past pipeline into marketing, service or reporting depth, or when you need a free CRM of record right now, since Copper has no free plan and starts on a paid Basic tier after its trial. The limitation to weigh on Copper is scope: it is a relationship-and-pipeline CRM rather than a demand-generation platform, and our record notes packaging can change, so confirm current plan contents on the live checkout. On HubSpot, the tradeoff is that platform depth arrives with packaging complexity across Smart CRM and hub seats plus $1,500 onboarding on Sales Hub Professional. Poor fit for Copper: teams running on Microsoft 365, where the native-inside-Gmail premise disappears. Poor fit for HubSpot: small Workspace-native teams who would use a fraction of the platform.",
    pricingNotes:
      "Copper has no free plan and runs Basic, Professional and Business with a trial, documented at $29 monthly / $23 annual, $69 / $59 and $134 / $99 per seat per month respectively from the vendor's August 2026 pricing page. HubSpot documents a $0 Free CRM plus Smart CRM tiers from $15 per month, with Sales Hub Professional at $100 per seat/month ($90 annual) and $1,500 required onboarding. Copper's annual discount is the meaningful lever on its side; HubSpot's is the free tier at the bottom of the ladder.",
    bestFor: [
      {
        productSlug: "copper",
        scenarios: [
          "Agencies and services firms running entirely on Google Workspace",
          "Teams whose CRM adoption has failed because reps stay in Gmail",
          "Relationship-led sales where email history is the pipeline record",
        ],
      },
      {
        productSlug: "hubspot",
        scenarios: [
          "Teams needing forms, campaigns and reporting alongside deals",
          "Businesses that want a CRM of record at no cost first",
          "Companies on Microsoft 365 or mixed email environments",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Workspace-only agency whose reps refuse to leave Gmail",
        preferredSlug: "copper",
        rationale:
          "Working inside Gmail is the documented advantage, and it is the difference between a CRM that gets updated and one that does not.",
      },
      {
        scenario: "Team needs lead capture forms and email campaigns too",
        preferredSlug: "hubspot",
        rationale:
          "Demand generation on the CRM record is native; Copper is scoped to pipeline and relationships, so you would add a second platform.",
      },
      {
        scenario: "Zero budget until the CRM proves itself",
        preferredSlug: "hubspot",
        rationale:
          "Free CRM is documented at $0 while Copper's cheapest rung is a paid Basic seat after the trial ends.",
      },
    ],
  },
  {
    slug: "bookyourdata-vs-reply",
    products: ["bookyourdata", "reply"],
    criterionNotes: {
      "contact-data":
        "Real-time verification with a deliverability guarantee against data bundled inside an engagement platform — data is the product on one side and an input on the other.",
      "email-outreach":
        "Sending is absent by design on the data side, so this is a capability gap rather than a quality difference.",
      prospecting:
        "Filter depth and bespoke list building against sequence orchestration across email, LinkedIn, calls and messaging.",
      integrations:
        "A data source integrates by export or API; a platform integrates to keep sequence state and CRM records aligned.",
      "value-for-money":
        "Credits consumed against a recurring plan: cadence decides value, and the platform side's recorded figures are fixture-derived pending vendor confirmation.",
    },
    thesis: {
      kind: "general_purpose_vs_specialist",
      label: "Verified list source vs multichannel engagement platform",
      rationale:
        "BookYourData is documented as a real-time B2B contact database sold as pay-as-you-go credits; Reply.io is documented as an AI sales engagement platform running email, LinkedIn, calls, SMS and WhatsApp sequences with data included.",
      supportedBy: ["same_category", "overlapping_use_cases"],
    },
    summary:
      "One of these hands you contacts; the other contacts them. BookYourData is a data purchase — real-time verified records, 100+ filters, a 97% deliverability guarantee, and BeSpoke list building when the filters are not enough. Reply is the machinery that sends: multichannel sequences, personalisation and deliverability tooling, with B2B data built in. Buyers who compare them are usually deciding whether they need a list or a sending motion, and the answer is often 'both, from different vendors'.",
    verdict:
      "BookYourData is the right buy when you already own a sequencer and the gap is clean, verified records you can pull without adding a subscription — credits are consumed when you use them, which suits sporadic list building and one-off campaigns. Reply is the right buy when the gap is execution: sequences across email, LinkedIn, calls, SMS and WhatsApp, plus deliverability management and AI SDR workflows that a raw list cannot provide. The trade-off is straightforward — with credits you gain flexibility and lose orchestration; with a platform you gain the sending motion and commit to a recurring plan across its Email Volume, Multichannel, Jason AI SDR and Agency packages. Poor fit for BookYourData: teams with no outreach tooling at all, because a verified list does not send itself. Poor fit for Reply: teams that need a few hundred records this quarter and nothing else, where a platform subscription is mostly idle capacity.",
    pricingNotes:
      "BookYourData is usage-priced: credit packs and BeSpoke list building are quoted rather than listed, with no free plan and a trial available, so cost scales with records pulled rather than per seat per month. Reply.io is a subscription across Email Volume, Multichannel, Jason AI SDR and Agency plans with a trial and no free plan; our research pack flags its recorded amounts as fixture-derived, so verify the live vendor pricing page before treating any figure as final. Compare cost per usable contact on the data side against monthly platform plus seat cost on the engagement side.",
    bestFor: [
      {
        productSlug: "bookyourdata",
        scenarios: [
          "Teams that own a sequencer and only need verified records",
          "Occasional list pulls where a monthly subscription would sit idle",
          "Niche targeting that needs deep filters or a bespoke list build",
        ],
      },
      {
        productSlug: "reply",
        scenarios: [
          "Outbound teams running multichannel sequences continuously",
          "Agencies managing outreach for several clients from one platform",
          "Teams wanting AI-assisted SDR workflows rather than manual sending",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "One-off campaign into a tightly defined vertical",
        preferredSlug: "bookyourdata",
        rationale:
          "Pay-as-you-go credits and deep filters fit a single list pull, while a sequencing subscription would keep charging after the campaign ends.",
      },
      {
        scenario: "Continuous outbound across email, LinkedIn and calls",
        preferredSlug: "reply",
        rationale:
          "Multichannel orchestration and deliverability tooling are the product, and no amount of verified data substitutes for the sending workflow.",
      },
      {
        scenario: "Building an outbound function from nothing",
        preferredSlug: null,
        rationale:
          "The realistic answer is a data source plus a sequencer; if you must start with one, start with the sending platform and add list purchases as targeting narrows.",
      },
    ],
  },
  {
    slug: "bookyourdata-vs-snov",
    products: ["bookyourdata", "snov"],
    criterionNotes: {
      "contact-data":
        "Both sell verified records; one guarantees deliverability at the point of purchase, the other folds verification into a monthly workflow.",
      "email-outreach":
        "Only one side sends, which makes this the criterion that decides whether you are buying a list or a loop.",
      prospecting:
        "Deep filters and bespoke builds against a repeating find-verify-send cadence, with database depth documented as lighter than enterprise providers on the subscription side.",
      "ease-of-use":
        "Buying records is simpler than running campaigns — the easier tool here is also the one doing less of the job.",
      "value-for-money":
        "Compare a year of expected credit spend against twelve months of a subscription rung: intermittent and weekly prospecting invert the answer.",
    },
    thesis: {
      kind: "similar_product_different_pricing_model",
      label: "Consumption credits vs monthly subscription rungs",
      rationale:
        "BookYourData documents a usage model of credit packs and BeSpoke builds; Snov.io documents subscription rungs (Starter, Pro, with Custom and Ultra on contact sales) and a trial-led entry with no forever-free plan.",
      supportedBy: ["same_category", "declared_competitor", "overlapping_use_cases"],
    },
    summary:
      "Both put verified B2B contacts in front of you, so the deciding factor is cadence, not capability. BookYourData charges for what you pull, which suits campaigns that arrive a few times a year. Snov charges monthly and includes the find-verify-send loop, which suits teams prospecting every week. Match the billing shape to how often you actually prospect and the rest of this comparison is detail.",
    verdict:
      "BookYourData wins for intermittent list building: credits sit until you need them, real-time verification and a 97% deliverability guarantee protect the send, and BeSpoke covers targeting the filters cannot reach. Snov wins for continuous prospecting on an SMB budget, because finding, verifying and sequencing happen in one subscription instead of a data purchase plus a separate sender. Know Snov's documented limits before committing: there is no forever-free plan so evaluation is trial-led, contact database depth is lighter than ZoomInfo or Apollo-class claims, lead scoring is limited versus enterprise sales intelligence platforms, reporting is lighter than ABM analytics suites, and higher volume moves you to contact-sales Custom or Ultra packaging. Poor fit for BookYourData: teams that need sequences and campaign reporting, since it is a data source rather than an outreach tool. Poor fit for Snov: buyers who prospect twice a year, where monthly subscription cost accrues between campaigns.",
    pricingNotes:
      "BookYourData is usage-based — credit packs and BeSpoke list building quoted rather than published, no free plan, trial available — so spend tracks records pulled. Snov.io is subscription with a documented start at $39 per month across Starter and Pro, with Custom and Ultra on contact sales and no forever-free plan. The comparison worth doing is annual: total credit spend across your expected campaigns against twelve months of the Snov rung that covers your sending volume.",
    bestFor: [
      {
        productSlug: "bookyourdata",
        scenarios: [
          "Campaign-driven teams pulling lists a few times a year",
          "Buyers who want deliverability guarantees on purchased records",
          "Targeting so specific it needs a bespoke list build",
        ],
      },
      {
        productSlug: "snov",
        scenarios: [
          "SMB teams prospecting and sending every week",
          "Buyers who want finding, verifying and sequencing in one bill",
          "Small teams testing cold email without enterprise data contracts",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Quarterly campaign into a new market segment",
        preferredSlug: "bookyourdata",
        rationale:
          "Credits align with the campaign calendar, whereas a monthly subscription bills through the quiet months in between.",
      },
      {
        scenario: "Weekly outbound cadence on a small budget",
        preferredSlug: "snov",
        rationale:
          "The find-verify-send loop in one subscription is the documented strength, and buying records separately every week adds a second workflow.",
      },
      {
        scenario: "Needs enterprise-grade coverage and scoring",
        preferredSlug: null,
        rationale:
          "Neither fits: Snov's own record notes lighter database depth and limited lead scoring, and BookYourData is a list source without scoring — evaluate enterprise sales intelligence platforms instead.",
      },
    ],
  },
  {
    slug: "campaign-monitor-vs-kit",
    products: ["campaign-monitor", "kit"],
    criterionNotes: {
      "starting-pricing":
        "Contact bands against subscriber counts: the billing unit differs, so the cheaper option changes with list shape rather than list size alone.",
      "email-limits":
        "Monthly send caps on the entry rung push frequent senders up a tier regardless of list size — the binding constraint is cadence, not contacts.",
      automation:
        "Automations are restricted on the free creator rung and sold up the ladder on both sides, so test the tier you would actually run.",
      templates:
        "Template governance across multiple client accounts against creator layouts built around a single voice.",
      "landing-pages":
        "Landing pages and forms are bundled where monetising an audience is the point, rather than treated as a marketing add-on.",
      "value-for-money":
        "A steep step between mid and premium tiers at the same contact band on one side; steadily subscriber-driven cost growth on the other.",
    },
    thesis: {
      kind: "same_category_different_strengths",
      label: "Contact-tiered brand and agency email vs creator subscriber platform",
      rationale:
        "Campaign Monitor documents design-led email with contact-tiered Lite, Essentials and Premier plans plus agency multi-account features; Kit documents a creator-first platform with a free Newsletter tier and subscriber-tiered Creator and Pro plans for monetisation.",
      supportedBy: ["same_category", "overlapping_use_cases"],
    },
    summary:
      "Both send newsletters beautifully; they are built for different businesses. Campaign Monitor is for brands and agencies that care about template control, client accounts and on-brand output. Kit is for creators who monetise an audience — paid newsletters, digital products, and automations built around subscriber growth. The billing units reflect that: contact bands on one side, subscriber counts on the other. Buy the one whose unit matches how your list actually grows.",
    verdict:
      "Campaign Monitor is the better platform when brand consistency and client work are the requirement: drag-and-drop design, template governance, and multi-account handling for agencies running several senders. Kit is the better platform when the list is the business — the free Newsletter tier lets you start at zero, and Creator and Pro add the visual automations, landing pages and product selling that monetisation needs. Cost behaviour differs sharply: Campaign Monitor has no forever-free plan and is trial-only, its Lite plan caps monthly sends so frequent senders upgrade on cadence rather than list size, the Premier jump is large at the same contact band, and past roughly 50,000 contacts you are usually talking to sales; Kit's paid tiers start from $33 per month for Creator and $66 for Pro at 1,000 subscribers and climb with subscribers. Two documented limits: Kit's free Newsletter plan restricts automations, and its ecommerce catalogue depth trails Klaviyo and Omnisend. Poor fit for Campaign Monitor: a solo creator who needs a free start. Poor fit for Kit: an agency needing client account separation and strict template control.",
    pricingNotes:
      "Campaign Monitor has no forever-free plan — trial only — with Lite, Essentials and Premier priced by contact band from $13 per month and a custom Enterprise tier; Lite carries monthly send caps, the Essentials-to-Premier step is steep at the same contact band, and 50,001+ contacts typically requires sales. Kit is freemium: a free Newsletter plan with limited automations, then Creator from $33 per month and Pro from $66 per month at 1,000 subscribers on monthly billing, with annual discounts published and pricing rising as subscribers grow. Model your own send frequency against contact bands on one side and subscriber count on the other.",
    bestFor: [
      {
        productSlug: "campaign-monitor",
        scenarios: [
          "Agencies managing email for multiple client accounts",
          "Brands needing template control and design consistency",
          "Marketing teams whose list grows faster than send frequency",
        ],
      },
      {
        productSlug: "kit",
        scenarios: [
          "Creators monetising a newsletter with paid subscriptions or products",
          "Writers who need a free tier to start and grow into automations",
          "Solo operators wanting landing pages and forms in the same tool",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Agency sending on behalf of eight client brands",
        preferredSlug: "campaign-monitor",
        rationale:
          "Multi-account and agency features plus template governance are the documented strength; Kit is built around one creator's audience, not client separation.",
      },
      {
        scenario: "Creator launching a paid newsletter with no budget yet",
        preferredSlug: "kit",
        rationale:
          "The free Newsletter tier starts at zero and monetisation tooling is native, whereas Campaign Monitor is trial-only with no forever-free plan.",
      },
      {
        scenario: "Sending several campaigns a week to a modest list",
        preferredSlug: null,
        rationale:
          "Watch the caps on both sides: Campaign Monitor's Lite send limits push frequent senders up a tier regardless of list size, and Kit's free plan limits the automations that make frequent sending manageable.",
      },
    ],
  },
  {
    slug: "aircall-vs-kixie",
    products: ["aircall", "kixie"],
    thesis: {
      kind: "general_purpose_vs_specialist",
      label: "Team phone system with routing vs CRM-connected sales dialler",
      rationale:
        "Aircall documents IVR and call routing, recording, SMS/MMS, 250+ integrations including a Salesforce CTI, and a licence minimum; Kixie documents power dialling, SMS and coaching aimed at CRM-connected outbound revenue teams.",
      supportedBy: ["same_category", "declared_competitor", "shared_capabilities"],
    },
    summary:
      "Aircall is a phone system that sales teams can use; Kixie is a sales dialler that happens to be a phone. That distinction decides the shortlist: if inbound calls need to reach the right person through an IVR and a routing tree, that is Aircall's job. If the metric is connects per rep per hour, that is Kixie's. Buying the wrong shape here means either paying for routing nobody uses or bolting a dialler onto a phone system later.",
    verdict:
      "Aircall is the better fit for organisations where support and sales share telephony: IVR, smart routing, queue callback and a Salesforce CTI are documented capabilities, though the ones that matter most — Power Dialer, Voicemail Drop, the Salesforce CTI, smart routing and queue callback — are Professional-only. Kixie is the better fit for outbound-first teams, with single-line and multi-line PowerDialer packages and coaching built for call volume. Two Aircall constraints decide many small-team cases outright: there is a 3-licence minimum on Essentials and Professional (25 on Custom), so one- and two-person teams overpay, and analytics history is capped at six months unless you buy Analytics+; AI Assist, AI Voice Agents, Analytics+ and WhatsApp are all separately priced add-ons, and there is no native team chat or video because Aircall is a voice-and-messaging layer rather than a workspace suite. On the Kixie side, our pricing record is fixture-derived, so plan contents and rates must be confirmed with the vendor. Avoid Aircall for a solo operator; avoid Kixie if inbound routing and IVR depth are the actual requirement.",
    pricingNotes:
      "Aircall has no free plan and runs Essentials, Professional and a quote-based Custom tier with a trial, documented from $30 per licence/month, with a 3-licence minimum on Essentials and Professional and 25 on Custom; AI Assist, AI Voice Agents, Analytics+ and WhatsApp are priced add-ons, analytics history is capped at six months without Analytics+, and domestic SMS/MMS rates in major markets are quote-based rather than published. Kixie has no free plan either, with Professional, Single-Line PowerDialer and Multi-Line PowerDialer packages on contact-sales and a trial available — our pack marks its figures as fixture-derived pipeline data, so treat vendor confirmation as a required step rather than a formality.",
    bestFor: [
      {
        productSlug: "aircall",
        scenarios: [
          "Teams needing IVR, routing and queue handling for inbound calls",
          "Organisations of three or more licences sharing sales and support voice",
          "Salesforce users who want a supported CTI rather than a workaround",
        ],
      },
      {
        productSlug: "kixie",
        scenarios: [
          "Outbound teams optimising connects per hour",
          "Small teams below Aircall's 3-licence minimum",
          "Sales managers coaching from call activity and recordings",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Two-person team that needs a dialler now",
        preferredSlug: "kixie",
        rationale:
          "Aircall's documented 3-licence minimum means paying for a seat you do not have, and its Power Dialer is Professional-only anyway.",
      },
      {
        scenario: "Inbound support and sales sharing one phone number tree",
        preferredSlug: "aircall",
        rationale:
          "IVR, smart routing and queue callback are the documented capability set, and a sales dialler does not attempt inbound call distribution at that depth.",
      },
      {
        scenario: "Reporting needs more than six months of call history",
        preferredSlug: null,
        rationale:
          "Aircall caps analytics history at six months unless you buy Analytics+, and Kixie's plan detail is fixture-derived in our pack — confirm retention in writing with either vendor before signing.",
      },
    ],
  },
  {
    slug: "lusha-vs-snov",
    products: ["lusha", "snov"],
    criterionNotes: {
      "contact-data":
        "Enrichment and buying signals against find-and-verify for outbound lists — both are contact data, aimed at different moments in the cycle.",
      prospecting:
        "Signal-led prospecting into records you already hold against list-led prospecting into records you do not.",
      "email-outreach":
        "Sequencing exists on both sides, but it is the core of one product and a companion feature of the other.",
      "ease-of-use":
        "A free tier makes data quality testable before purchase on one side; the other is trial-led with no forever-free plan.",
      "value-for-money":
        "Credit consumption — phone reveals costing more than emails, no annual rollover — against monthly sending capacity; model your own mix rather than the list price.",
    },
    thesis: {
      kind: "same_category_different_strengths",
      label: "CRM enrichment and buying signals vs cold email execution",
      rationale:
        "Lusha documents verified contact and company data, enrichment, buying signals and Engage sequences on a credit model; Snov.io documents finding and verifying emails then running cold email campaigns as an affordable SMB stack.",
      supportedBy: ["same_category", "declared_competitor", "overlapping_use_cases"],
    },
    summary:
      "Both will get you email addresses, but they are pointed at different revenue problems. Lusha's centre of gravity is data quality on records you already care about: enrichment, accuracy in the CRM, and signals telling you when to act. Snov's centre of gravity is the outbound campaign: find, verify, send, follow up, on a budget an SMB can carry. Decide whether you are fixing your database or filling your calendar.",
    verdict:
      "Lusha is the stronger choice when CRM hygiene and timing matter — keeping records accurate, enriching inbound leads, and acting on buying signals — and it is the only side of this pair with a documented free plan to start on. Snov is the stronger choice when the job is running cold email at volume for less money, since finding, verifying and sequencing sit in one subscription. Cost mechanics differ in ways that bite later: Lusha is credit-based, phone reveals cost more credits than emails so high-volume phone prospecting burns budget quickly, unused annual credits do not roll over, and API access and some connectors are plan-gated on Pro and above; Snov has no forever-free plan so evaluation is trial-led, and higher volume moves you onto contact-sales Custom or Ultra packaging. Poor fit for Lusha: teams whose main need is campaign sending, because it is explicitly not a CRM or a full outbound suite. Poor fit for Snov: teams needing enterprise-grade coverage or scoring, given its documented lighter database depth, limited lead scoring and lighter reporting.",
    pricingNotes:
      "Lusha is freemium and credit-based: a free plan plus Starter, Pro, Premium and Scale, all marked contact-sales in our pack because public list prices could not be verified from the vendor pricing page during research — so ask for credit allocations per tier, not just the seat price, and confirm that unused annual credits expire. Snov.io has no forever-free plan and starts at $39 per month across Starter and Pro with Custom and Ultra on contact sales, plus a trial. Compare credits consumed per enriched or revealed record on one side against monthly sending capacity on the other.",
    bestFor: [
      {
        productSlug: "lusha",
        scenarios: [
          "Revenue teams keeping CRM records accurate and enriched",
          "Sellers who act on buying signals rather than static lists",
          "Buyers who want a free tier to test data quality first",
        ],
      },
      {
        productSlug: "snov",
        scenarios: [
          "SMB teams running cold email campaigns on a small budget",
          "Buyers wanting find, verify and send in one subscription",
          "Small outbound teams that do not need phone numbers at volume",
        ],
      },
    ],
    scenarios: [
      {
        scenario: "Inbound leads arrive with missing firmographic data",
        preferredSlug: "lusha",
        rationale:
          "Enrichment and signals are the documented product; a cold email platform fills lists but does not keep existing records accurate.",
      },
      {
        scenario: "Two-person team running weekly cold email sequences",
        preferredSlug: "snov",
        rationale:
          "One affordable subscription covers the whole loop, whereas Lusha's credit consumption is designed around reveals and enrichment rather than sending volume.",
      },
      {
        scenario: "Outbound plan depends on direct phone numbers",
        preferredSlug: "lusha",
        rationale:
          "Phone data is part of the offer, but budget carefully: phone reveals cost more credits than emails and unused annual credits do not roll over.",
      },
    ],
  },
];

type PricingEnvelope = Partial<Pricing> | null;

function pricingEnvelope(
  software: Software,
  enrichment: ProductResearchEnrichment | null,
): PricingEnvelope {
  const fromEnrichment = (enrichment?.pricing ?? null) as PricingEnvelope;
  if (fromEnrichment && Object.keys(fromEnrichment).length > 0) {
    return fromEnrichment;
  }
  return (software.pricing as PricingEnvelope) ?? null;
}

function planStructureNote(
  name: string,
  pricing: PricingEnvelope,
): string | null {
  const plans = pricing?.plans ?? [];
  if (plans.length === 0) return null;
  const named = plans.map((p) => p.name).join(", ");
  const quoteOnly = plans.filter((p) => p.contactSales).length;
  const suffix =
    quoteOnly === plans.length
      ? " (all quote-based)"
      : quoteOnly > 0
        ? ` (${quoteOnly} quote-based)`
        : "";
  return `${name} plans: ${named}${suffix}`;
}

/**
 * Pricing envelope for the overlay — enrichment facts only.
 * Missing amounts stay null; nothing here is estimated.
 */
function pricingDiffFromEnrichment(
  a: Software,
  b: Software,
  ea: ProductResearchEnrichment | null,
  eb: ProductResearchEnrichment | null,
  categorySlug: string | null,
): PricingDiffSummary {
  const pa = pricingEnvelope(a, ea);
  const pb = pricingEnvelope(b, eb);
  const notes: string[] = [];

  for (const [name, pricing] of [
    [a.name, pa],
    [b.name, pb],
  ] as Array<[string, PricingEnvelope]>) {
    const note = planStructureNote(name, pricing);
    if (note) notes.push(note);
    if (pricing?.notes) notes.push(`${name}: ${pricing.notes}`);
    if (pricing?.verifiedAt) {
      notes.push(`${name} pricing verified ${pricing.verifiedAt.slice(0, 10)}`);
    }
  }

  const freeOf = (p: PricingEnvelope): boolean | null =>
    p?.hasFreePlan ?? (p?.plans?.some((plan) => plan.isFree) ? true : null);
  const trialOf = (p: PricingEnvelope): boolean | null =>
    p?.hasFreeTrial ?? (p?.plans?.some((plan) => plan.hasFreeTrial) ? true : null);
  const modelOf = (p: PricingEnvelope): string | null =>
    p?.model && p.model !== "unknown" ? p.model : null;

  return {
    startingPriceA: pa?.startingPriceMonthly ?? null,
    startingPriceB: pb?.startingPriceMonthly ?? null,
    billingA: modelOf(pa),
    billingB: modelOf(pb),
    freeTier: { a: freeOf(pa), b: freeOf(pb) },
    trials: { a: trialOf(pa), b: trialOf(pb) },
    modelA: modelOf(pa),
    modelB: modelOf(pb),
    complexityNote:
      [pa?.plans?.length ?? 0, pb?.plans?.length ?? 0].some((n) => n >= 4)
        ? "One or both sides publish four or more rungs — compare the tier you would actually buy, not the entry rung"
        : null,
    costCalculatorHref: categorySlug
      ? categoryDecisionCostHref(categorySlug)
      : null,
    notes,
  };
}

/**
 * Append pair-specific rationale to criterion outcomes that already exist.
 * Winner, confidence, score citation and research status are carried through
 * untouched — only the explanation grows.
 */
function outcomePatch(
  comparison: Comparison,
  spec: PairAnalysis,
): Comparison["outcomes"] {
  const notes = spec.criterionNotes ?? {};
  const patched: Comparison["outcomes"] = [];
  for (const outcome of comparison.outcomes) {
    const note = notes[outcome.criterionSlug];
    if (!note) continue;
    const existing = outcome.reason?.trim();
    if (existing?.includes(note)) {
      patched.push(outcome);
      continue;
    }
    patched.push({
      ...outcome,
      reason: existing ? `${existing} ${note}` : note,
    });
  }
  return patched;
}

function sameProducts(comparison: Comparison, spec: PairAnalysis): boolean {
  const declared = [...spec.products].sort().join("|");
  const actual = [...comparison.productSlugs].sort().join("|");
  return declared === actual;
}

/**
 * Write one hand-authored overlay per Wave 1 comparison.
 * Returns the overlay paths written.
 */
export function writeWave1CompareOverlays(): string[] {
  const bySlug = new Map(
    getAllComparisonsUnfiltered().map((c) => [c.slug, c] as const),
  );
  const written: string[] = [];

  for (const spec of WAVE1_PAIRS) {
    const comparison = bySlug.get(spec.slug);
    if (!comparison) {
      console.error(`[wave1] Skipped ${spec.slug} — comparison not in estate`);
      continue;
    }
    if (!sameProducts(comparison, spec)) {
      console.error(
        `[wave1] Skipped ${spec.slug} — analysis is written for ${spec.products.join(" + ")}, estate has ${comparison.productSlugs.join(" + ")}`,
      );
      continue;
    }

    const [slugA, slugB] = comparison.productSlugs as [string, string];
    const a = getSoftwareBySlug(slugA);
    const b = getSoftwareBySlug(slugB);
    if (!a || !b) {
      console.error(
        `[wave1] Skipped ${spec.slug} — missing catalogue product (${slugA}/${slugB})`,
      );
      continue;
    }

    const ea = loadEnrichment(slugA);
    const eb = loadEnrichment(slugB);
    const prior = loadCompareEnrichmentOverlay(spec.slug);

    const evidence = resolveComparisonEvidence(a, b);
    const derivedRows = buildCapabilityCompareRows(a, b);
    const capabilityRows =
      derivedRows.length > 0 ? derivedRows : (prior?.capabilityRows ?? []);
    const pricing = pricingDiffFromEnrichment(
      a,
      b,
      ea,
      eb,
      comparison.categorySlug ?? a.primaryCategorySlug ?? null,
    );

    // Prior overlays carried deterministic alternatives — keep them rather than
    // regress the page while replacing the templated prose.
    const relatedAlternativeSlugs = prior?.patch.relatedAlternativeSlugs ?? [];

    const noHandsOn = !evidence.handsOnA && !evidence.handsOnB;
    const summary = noHandsOn
      ? `${spec.summary}\n\n${evidence.disclaimer}`
      : spec.summary;

    const uniqueValueAdded: UniqueDecisionElement[] = [...BASE_UNIQUE];
    if (capabilityRows.length > 0) uniqueValueAdded.push("capability_table");
    if (relatedAlternativeSlugs.length > 0) uniqueValueAdded.push("alternatives");

    const overlay: CompareEnrichmentOverlay = {
      slug: spec.slug,
      updatedAt: new Date().toISOString(),
      uniqueValueAdded,
      thesis: spec.thesis,
      capabilityRows,
      pricing,
      evidence,
      patch: {
        summary,
        verdict: spec.verdict,
        pricingNotes: spec.pricingNotes,
        bestFor: spec.bestFor,
        scenarioRecommendations: spec.scenarios,
        relatedAlternativeSlugs,
        outcomes: outcomePatch(comparison, spec),
        // No universal winner is claimed on any of these pairs.
        overallWinnerKind: "depends",
      },
      notes: [WAVE_NOTE],
    };

    written.push(saveCompareEnrichmentOverlay(overlay));
  }

  return written;
}

function overlayMergedEstate(): Comparison[] {
  const overlaySlugs = new Set(listCompareEnrichmentOverlaySlugs());
  return getAllComparisonsUnfiltered().map((c) =>
    overlaySlugs.has(c.slug)
      ? mergeComparisonWithOverlay(c, loadCompareEnrichmentOverlay(c.slug))
      : c,
  );
}

function main(): void {
  const paths = writeWave1CompareOverlays();
  console.log(
    `Wrote ${paths.length}/${WAVE1_PAIRS.length} Wave 1 compare overlays (${WAVE_NOTE})`,
  );

  const estate = overlayMergedEstate();
  const bySlug = new Map(estate.map((c) => [c.slug, c] as const));
  const soft = new Map(getSoftware().map((s) => [s.slug, s] as const));

  let elevated = 0;
  let blocked = 0;
  const qaBlocks: string[] = [];

  console.log("");
  console.log("slug                                sim    risk      block  signals");
  for (const spec of WAVE1_PAIRS) {
    const comparison = bySlug.get(spec.slug);
    if (!comparison) continue;
    const assessment = assessComparisonSemanticTemplateRisk(comparison, estate);
    const unique = assessment.uniqueAnalysisSignals.filter((s) =>
      s.startsWith("specific_"),
    );
    if (assessment.maxSemanticSimilarity >= PREFERRED_MAX_SIMILARITY) elevated += 1;
    if (assessment.blocksAutoPromotion) blocked += 1;
    console.log(
      [
        spec.slug.padEnd(35),
        assessment.maxSemanticSimilarity.toFixed(3).padEnd(6),
        assessment.riskLevel.padEnd(9),
        (assessment.blocksAutoPromotion ? "BLOCK" : "ok").padEnd(6),
        `${unique.length} (${unique.join(", ") || "none"})`,
      ].join(" "),
    );
    for (const reason of assessment.reasons) console.log(`    ↳ ${reason}`);

    const overlay = loadCompareEnrichmentOverlay(spec.slug);
    const qa = runCompareEnrichmentQa(comparison, soft, estate, {
      capabilityRows: overlay?.capabilityRows ?? [],
      evidence: overlay?.evidence ?? undefined,
    });
    for (const finding of qa.findings) {
      console.log(`    ! ${finding.severity}/${finding.code}: ${finding.detail}`);
      if (finding.severity === "block") qaBlocks.push(spec.slug);
    }
  }

  console.log("");
  console.log(
    `Similarity target < ${PREFERRED_MAX_SIMILARITY}: ${WAVE1_PAIRS.length - elevated}/${WAVE1_PAIRS.length} pages under target, ${blocked} still blocking auto-promotion`,
  );
  if (blocked > 0) {
    console.log(
      "Remaining blocks are sibling-cluster effects from un-rewritten estate pages — these URLs stay in IMPROVE / MANUAL_REVIEW until their neighbours are rewritten.",
    );
  }
  if (qaBlocks.length > 0) {
    console.log(
      `Compare QA still blocks ${[...new Set(qaBlocks)].join(", ")} — relationship-level findings (e.g. cross-category pairings) that better copy cannot clear on its own.`,
    );
  }
}

if (process.argv[1]?.includes("write-compare-overlays")) {
  main();
}
