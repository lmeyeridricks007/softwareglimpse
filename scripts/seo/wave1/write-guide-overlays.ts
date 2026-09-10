#!/usr/bin/env npx tsx
/**
 * Improvement Wave 1 — unique guide enrichment overlays.
 *
 *   npx tsx scripts/seo/wave1/write-guide-overlays.ts
 *
 * The prior estate batch failed semantic QA because the factory `product-*-plans`
 * and `is-*-worth-it` guides ship identical templated `step` blocks. Every overlay
 * here therefore supplies replacement `type: "step"` blocks so that
 * `mergeGuideWithOverlay` drops ALL templated step blocks for the slug, plus a
 * replacement `checklist` block (the factory checklist block also feeds the
 * decision-thesis similarity bucket).
 *
 * Editorial rules honoured here:
 * - No invented prices, ratings, testing claims, or statistics. Every number and
 *   plan name is interpolated from `loadEnrichment(productSlug)`.
 * - Each page gets its own editorial skeleton — different headings, different
 *   decision rule, different scenarios. Not product-name substitution.
 */
import { getSoftwareBySlug } from "@/data";
import { getGuides } from "@/data/repositories/guides";
import { loadEnrichment } from "@/data/research/store";
import type { GuideContentBlock, GuidePage } from "@/domain/schemas";
import type { PricingPlan } from "@/domain/schemas/pricing";
import { assessGuideSemanticTemplateRisk } from "@/services/content-quality/gate/semantic-template";
import type { GuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import { mergeGuideWithOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import {
  listGuideEnrichmentOverlaySlugs,
  loadGuideEnrichmentOverlay,
  saveGuideEnrichmentOverlay,
} from "@/services/seo/guide-enrichment/overlay-store";
import type {
  EnrichmentGuideType,
  UniqueValueElement,
} from "@/services/seo/guide-enrichment/types";

const WAVE_NOTE = "improve-wave-1-2026-09-07";

/** Semantic-similarity ceiling that hard-blocks promotion (SEMANTIC_SIMILARITY_HIGH). */
const FAIL_SIMILARITY = 0.72;

const SEO_TITLE_MAX = 70;
const SEO_DESCRIPTION_MAX = 320;

/** Slug → product slug in the research store. Null = category-level page. */
const SLUG_PRODUCT: Record<string, string | null> = {
  "zoho-crm-setup": "zoho-crm",
  "how-to-choose-crm": null,
  "what-is-crm": null,
  "hubspot-plans": "hubspot",
  "is-hubspot-worth-it": "hubspot",
  "activecampaign-plans": "activecampaign",
  "is-activecampaign-worth-it": "activecampaign",
  "insightly-plans": "insightly",
  "is-insightly-worth-it": "insightly",
  "getresponse-plans": "getresponse",
  "keap-plans": "keap",
  "is-keap-worth-it": "keap",
  "capsule-plans": "capsule",
  "is-capsule-worth-it": "capsule",
  "closely-plans": "closely",
  "is-closely-worth-it": "closely",
  "lusha-plans": "lusha",
  "is-lusha-worth-it": "lusha",
  "pipedrive-plans": "pipedrive",
  "is-pipedrive-worth-it": "pipedrive",
};

/* ------------------------------------------------------------------ *
 * Facts — everything quotable comes from research enrichment.
 * ------------------------------------------------------------------ */

type ProductFacts = {
  slug: string;
  name: string;
  shortDescription: string;
  planNames: string[];
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  limitations: string[];
  /** Published ladder rendered from enrichment pricing rules. */
  ladder: string;
  /** Rendered list price for a plan name, or null when not published. */
  price: (planName: string) => string | null;
  /** First limitation matching a keyword — used to cite constraints verbatim. */
  limitation: (keyword: RegExp) => string | null;
};

function renderPlanAmount(plan: PricingPlan): string | null {
  const rules = plan.rules ?? [];
  for (const rule of rules) {
    if (rule.kind === "per-seat") {
      const billed = rule.interval === "year" ? " billed annually" : "";
      return `$${rule.amountPerSeat}/seat/mo${billed}`;
    }
    if (rule.kind === "flat" || rule.kind === "minimum") {
      const billed = rule.interval === "year" ? " billed annually" : "";
      return `$${rule.amount}/mo${billed}`;
    }
    if (rule.kind === "per-unit" || rule.kind === "usage") {
      return `$${rule.amountPerUnit} per ${rule.unit}`;
    }
  }
  if (plan.isFree) return "$0";
  if (plan.contactSales) return "quote only";
  return null;
}

function loadFacts(productSlug: string): ProductFacts {
  const enrichment = loadEnrichment(productSlug);
  if (!enrichment) {
    throw new Error(`Missing research enrichment for ${productSlug}`);
  }
  const software = getSoftwareBySlug(productSlug);
  const plans = enrichment.pricing?.plans ?? [];
  const limitations = (enrichment.limitations ?? [])
    .map((l) => l.description)
    .filter((d): d is string => Boolean(d));

  const priceByName = new Map<string, string>();
  for (const plan of plans) {
    const rendered = renderPlanAmount(plan);
    if (rendered) priceByName.set(plan.name.toLowerCase(), rendered);
  }

  return {
    slug: productSlug,
    name: software?.name ?? productSlug,
    shortDescription:
      enrichment.shortDescription ?? software?.shortDescription ?? "",
    planNames: plans.map((p) => p.name),
    hasFreePlan: enrichment.pricing?.hasFreePlan === true,
    hasFreeTrial: enrichment.pricing?.hasFreeTrial === true,
    limitations,
    ladder: plans
      .map((p) => {
        const amount = renderPlanAmount(p);
        return amount ? `${p.name} (${amount})` : p.name;
      })
      .join(" · "),
    price: (planName) => priceByName.get(planName.toLowerCase()) ?? null,
    limitation: (keyword) => limitations.find((l) => keyword.test(l)) ?? null,
  };
}

/* ------------------------------------------------------------------ *
 * Page content model.
 * ------------------------------------------------------------------ */

type SectionSpec = { id: string; heading: string; body: string; tip?: string };

type PageContent = {
  enrichmentType: EnrichmentGuideType;
  uniqueValueAdded: UniqueValueElement[];
  /** Short editorial lens recorded in overlay notes. */
  lens: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  /** Exactly three unique sections — first one seeds the intro bucket. */
  sections: [SectionSpec, SectionSpec, SectionSpec];
  directAnswer: { body: string; bullets: string[] };
  framework: {
    title: string;
    steps: Array<{ id: string; label: string; short?: string }>;
  };
  mistakes: { title: string; items: Array<{ title: string; body: string }> };
  /** Three replacement step blocks — these evict the templated factory steps. */
  steps: Array<{ heading: string; body: string; tip?: string }>;
  /** Three unique checklist items — replaces both the block and guide checklist. */
  checklist: Array<{ label: string; description: string }>;
};

type PageBuilder = (facts: ProductFacts | null) => PageContent;

/** Enrichment limitations are not consistently punctuated — inlining them is. */
function sentence(text: string): string {
  const trimmed = text.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/** Drop a terminal full stop so a quoted string can carry on into a dash. */
function trimPeriod(text: string): string {
  return text.trim().replace(/\.$/, "");
}

/**
 * Turn a quoted limitation into a mid-sentence clause. Only a plain
 * capitalised first word is lowered, so acronyms (SMS, AI, CRM) survive.
 */
function inlineClause(text: string): string {
  const trimmed = text.trim().replace(/\.$/, "");
  const [first, ...rest] = trimmed.split(" ");
  if (!first) return trimmed;
  const lowered = /^[A-Z][a-z]+$/.test(first) ? first.toLowerCase() : first;
  return [lowered, ...rest].join(" ");
}

function fallbackLimitation(
  facts: ProductFacts,
  keyword: RegExp,
  fallbackIndex = 0,
): string {
  return sentence(
    facts.limitation(keyword) ??
      facts.limitations[fallbackIndex] ??
      "Verify current packaging on the vendor's live pricing page before you buy.",
  );
}

function requireFacts(facts: ProductFacts | null, slug: string): ProductFacts {
  if (!facts) throw new Error(`${slug} requires product enrichment facts`);
  return facts;
}

/* ================================================================== *
 * 1. zoho-crm-setup — implementation order-of-operations
 * ================================================================== */

const zohoCrmSetup: PageBuilder = (f0) => {
  const f = requireFacts(f0, "zoho-crm-setup");
  const seatCeiling = fallbackLimitation(f, /free edition|users/i, 1);
  const aiDepth = fallbackLimitation(f, /Zia|automation depth/i, 0);
  return {
    enrichmentType: "IMPLEMENTATION_GUIDE",
    uniqueValueAdded: [
      "implementation_workflow",
      "decision_framework",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "edition fork before first import; Blueprint gates before Zia",
    summary:
      `${f.name} setup is decided before the first import, by two counts: how many people will hold a login, and how much enforced process you actually need in month one. ` +
      `Documented ceiling: ${seatCeiling} A fourth daily login therefore changes the configuration job, not just the invoice. ` +
      `Published editions: ${f.ladder}. Implementation complexity rises where ${aiDepth.replace(/\.$/, "")} — so setup takes longer than the trial window if you design stage gates after loading data instead of before.`,
    seoTitle: "Zoho CRM Setup: Edition Fork, Blueprint Gates, Import Order",
    seoDescription:
      `Configure ${f.name} in the order that survives month two: edition from login count, stage list on paper, then import. ${seatCeiling}`,
    sections: [
      {
        id: "zoho-setup-edition-fork",
        heading: "The edition fork comes before the first record",
        body:
          `Do not open the import wizard until the edition is settled, because the field model and automation you can enforce differ by edition. ` +
          `The hard limit is explicit: ${seatCeiling} If a fourth person needs to update records daily, you are configuring a paid edition and the plan jumps to a different setup job — more custom fields to govern, more automation to keep honest. ` +
          `Best for a fast day-one build: teams that can name the three people who will touch records every morning. ` +
          `Weak fit: an org that wants "everyone in the CRM" but has nobody to maintain the picklists those logins will create.`,
      },
      {
        id: "zoho-setup-blueprint-before-zia",
        heading: "Blueprint stage gates first, Zia AI much later",
        body:
          `Blueprint is a process-enforcement tool — it refuses to advance a deal until the exit condition of the current stage is satisfied. That is the workflow advantage worth configuring in week one, because it fixes stage hygiene while the pipeline is still small enough to correct. ` +
          `Zia is a different purchase: ${aiDepth} Buying up the ladder for AI before stage discipline exists gives you scoring on top of unreliable stage data. ` +
          `Setup takes an owner: someone has to define each stage's exit rule and then defend it when a rep wants to skip it.`,
      },
      {
        id: "zoho-setup-week-two-risk",
        heading: "Where week two breaks: mapping and ownership, not features",
        body:
          `The failures that show up after go-live are data mapping failures. Legacy "status" columns get mapped onto stages that mean something slightly different, and the migration risk lands on the reports you built in week one. ` +
          `Rehearse the cutover with a small real extract, not a clean sample file, so you see the messy values. ` +
          `Avoid if nobody owns the record: without a named admin, custom fields multiply, and you will re-train the team on a schema you did not intend to design.`,
        tip: "Rehearse the import with twenty real records — the ugly ones, not the tidy ones.",
      },
    ],
    directAnswer: {
      body: `Set the ${f.name} edition from your real daily login count and required process enforcement, write the stage list on paper, and import last — reversing that order is what forces a rebuild in month two.`,
      bullets: [
        "Built for teams that can name their three daily record-owners on day one",
        `Documented ceiling: ${seatCeiling}`,
        "Blueprint stage gates first; Zia AI is a later, higher-edition decision",
      ],
    },
    framework: {
      title: "Setup order of operations",
      steps: [
        {
          id: "zoho-setup-of-1",
          label: "Count real daily logins against the published free-edition user ceiling",
        },
        {
          id: "zoho-setup-of-2",
          label: "Write each pipeline stage with the one condition that lets a deal leave it",
        },
        {
          id: "zoho-setup-of-3",
          label: "Decide whether enforced process or AI depth is the month-one requirement",
        },
        {
          id: "zoho-setup-of-4",
          label: "Rehearse the import on real records before the cutover date",
        },
      ],
    },
    mistakes: {
      title: "Setup mistakes that cost a rebuild",
      items: [
        {
          title: "Importing before stages exist",
          body: "Stage names invented during an import become permanent. Write them first, with exit conditions.",
        },
        {
          title: "Buying up the ladder for AI in week one",
          body: `AI scoring on unenforced stage data is noise. ${aiDepth}`,
        },
        {
          title: "No named record owner",
          body: "Without one admin who governs fields and picklists, the schema drifts within a quarter and reporting follows it.",
        },
      ],
    },
    steps: [
      {
        heading: "Freeze the stage list on paper before you touch the app",
        body:
          `Write every pipeline stage in a single column, then write the one condition that lets a deal leave that stage. If you cannot state the exit condition, the stage is a feeling, not a stage. ` +
          `This is the artefact your Blueprint configuration will encode, and it is the thing you will compare against when a rep asks for a new stage in month three.`,
        tip: "A stage without an exit condition is a label — delete it.",
      },
      {
        heading: "Import twenty real records and read what broke",
        body:
          `Take twenty genuinely messy records out of the current system — duplicated companies, blank owners, half-finished notes — and run the mapping on those. ` +
          `You are looking for the fields where legacy values do not map cleanly, because that is where the cutover will lose history. Fix the mapping, then scale the import; a clean sample file teaches you nothing about your own data.`,
      },
      {
        heading: "Switch on one Blueprint gate, then stop",
        body:
          `Enforce exactly one transition — usually the gate into your first committed stage — and leave the rest open for two weeks. ` +
          `One gate is enough to reveal whether the team will actually record the required field, and it keeps the re-train conversation to a single behaviour instead of a new process manual.`,
      },
    ],
    checklist: [
      {
        label: "Edition chosen from counted daily logins, not from feature envy",
        description: "Compare the count against the published free-edition user ceiling before quoting anything.",
      },
      {
        label: "Stage list written with one exit condition per stage",
        description: "This document is the input to Blueprint configuration and to every later stage request.",
      },
      {
        label: "Import rehearsed on real, messy records",
        description: "Mapping errors found here are cheap; found after cutover they are reporting errors.",
      },
    ],
  };
};

/* ================================================================== *
 * 2. how-to-choose-crm — category selection, job-fit thesis
 * ================================================================== */

const howToChooseCrm: PageBuilder = () => ({
  enrichmentType: "DECISION_GUIDE",
  uniqueValueAdded: [
    "decision_framework",
    "category_criteria",
    "scenario_analysis",
    "buyer_checklist",
  ],
  lens: "job-fit thesis — one sentence job, an owner, and a metric",
  summary:
    "Most CRM shortlists fail because they start from a feature grid instead of a job. Write the one job the CRM has to do this quarter, name the person accountable for it, and name the number that proves it worked — then let that sentence eliminate categories of tool. " +
    "Three different jobs (pipeline speed, service delivery, lifecycle marketing) pull toward genuinely different products, and the honest fourth answer is that some teams are not ready to buy a CRM at all.",
  seoTitle: "How to Choose a CRM: Start From the Job, Not the Feature Grid",
  seoDescription:
    "A CRM choice framework built on one sentence: the job, its owner, and the metric. Includes the three jobs that pull toward different tools and when the answer is not a CRM yet.",
  sections: [
    {
      id: "crm-choice-job-sentence",
      heading: "Write the job sentence before you open a single pricing page",
      body:
        "The sentence has three parts: the job, the owner, the metric. \"Our two closers stop losing follow-ups, owned by the sales lead, measured by deals with a scheduled next step.\" " +
        "That sentence is a filter. It tells you which demos to refuse, and it tells you the smallest plan that could possibly be enough. " +
        "Teams who skip it end up comparing feature counts, which is why they buy a tier above what the job needed and then measure adoption instead of outcome.",
    },
    {
      id: "crm-choice-three-pulls",
      heading: "Three jobs that pull toward different tools",
      body:
        "Pipeline speed wants a deal board a rep can update between calls; the workflow advantage here is that the CRM lives in the rep's day rather than in a weekly hygiene ritual. " +
        "Service delivery wants the record to survive the handoff after the deal closes, which is a projects-and-tasks shape, not a faster board. " +
        "Lifecycle marketing wants segmentation and journeys, and is priced by contacts rather than seats — so the same budget buys a completely different capability. " +
        "Compared with a pipeline tool, a lifecycle platform will feel slow to a closer, while a pipeline tool will feel blind to a marketer — because they are answering different questions, not because one is better.",
    },
    {
      id: "crm-choice-not-yet",
      heading: "When the honest answer is \"not a CRM yet\"",
      body:
        "If nobody can name the owner in the job sentence, a CRM purchase will convert into a data-entry argument. That is a poor fit for any product on any shortlist. " +
        "The same is true where the real problem is a broken handoff between two people who sit next to each other, or where the pipeline is four deals long. " +
        "Switching cost is the other reason to wait: every CRM you adopt now becomes a data mapping exercise later, so buying early to \"grow into it\" reliably converts a cheap decision into an expensive migration.",
      tip: "If the metric in your job sentence is \"better visibility\", it is not a metric yet.",
    },
  ],
  directAnswer: {
    body: "Choose a CRM by writing the one job it must do this quarter with a named owner and a measurable outcome, then buy the smallest plan that does that job — feature grids cannot rank tools that answer different questions.",
    bullets: [
      "Best for buyers who can state the job, the owner, and the metric in one sentence",
      "Pipeline speed, service delivery, and lifecycle marketing pull toward different tools",
      "Not a fit when no one owns the record — fix ownership before you buy",
    ],
  },
  framework: {
    title: "The job-fit filter",
    steps: [
      { id: "crm-choice-1", label: "Write the job, the owner, and the metric as one sentence" },
      { id: "crm-choice-2", label: "Classify the job: pipeline speed, delivery handoff, or lifecycle marketing" },
      { id: "crm-choice-3", label: "Shortlist only tools whose centre of gravity matches that job" },
      { id: "crm-choice-4", label: "Buy the cheapest plan that clears the job, and set a review date" },
    ],
  },
  mistakes: {
    title: "How CRM choices go wrong",
    items: [
      {
        title: "Comparing feature counts across different tool shapes",
        body: "A longer feature list from a lifecycle platform does not beat a faster deal board when the job is follow-up discipline.",
      },
      {
        title: "Buying for the org you plan to become",
        body: "The tier you will need in two years is a migration decision then, not a purchase decision now.",
      },
      {
        title: "Choosing before naming the owner",
        body: "Unowned records decay at the same rate in every CRM, which makes the tool choice irrelevant to the outcome.",
      },
    ],
  },
  steps: [
    {
      heading: "Draft the job sentence and read it out loud to the owner",
      body:
        "Say it to the person you just made accountable. If they cannot repeat the metric back, rewrite it. " +
        "This takes ten minutes and removes about half of a typical shortlist, because most candidates are optimised for a different job than the one you just described.",
    },
    {
      heading: "Run the job through two deliberately different tools",
      body:
        "Pick one tool from a different shape than your instinct — a delivery-oriented CRM if you assumed a deal board, or a lifecycle platform if you assumed a pipeline. " +
        "Recreate one real deal from last month end to end in each. The use-case comparison is only meaningful on your own data; a scripted demo will make both look correct.",
    },
    {
      heading: "Buy small and put a review date in the calendar",
      body:
        "Take the lowest plan that clears the job sentence and diary a review ninety days out against the metric you wrote. " +
        "Upgrading later on evidence is cheap. Downgrading after you have configured a tier you did not need is a data mapping project nobody volunteers for.",
      tip: "Book the ninety-day review before the trial ends, or it will not happen.",
    },
  ],
  checklist: [
    {
      label: "Job sentence written: job, owner, metric",
      description: "One sentence. If it needs two, you have two jobs and probably two decisions.",
    },
    {
      label: "Job classified against tool shape",
      description: "Pipeline speed, delivery handoff, or lifecycle marketing — the shortlist follows from this.",
    },
    {
      label: "One real historical deal rebuilt in each finalist",
      description: "Your messy data, not the vendor's demo data.",
    },
  ],
});

/* ================================================================== *
 * 3. what-is-crm — definition by replacement + failure modes
 * ================================================================== */

const whatIsCrm: PageBuilder = () => ({
  enrichmentType: "CATEGORY_EDUCATION",
  uniqueValueAdded: [
    "category_criteria",
    "scenario_analysis",
    "decision_framework",
    "buyer_checklist",
  ],
  lens: "definition by what it replaces; adoption failure modes",
  summary:
    "A CRM is the shared record of who you owe an answer to, and what you promised them. That is the whole definition — the pipelines, tasks, and dashboards exist to keep that record trustworthy enough to act on. " +
    "The clearest way to understand one is to look at the four things it replaces: the mental list, the personal inbox thread, the shared spreadsheet, and the weekly meeting where people reconstruct what happened. " +
    "It is also worth knowing where CRMs fail, because they fail for the same reason nearly every time, and it is not a missing feature.",
  seoTitle: "What Is a CRM? The Shared Answer Record — and When It Fails",
  seoDescription:
    "A CRM is the shared record of who you owe an answer to. Learn the four things it replaces, how the record stays trustworthy, and the adoption failure that no feature fixes.",
  sections: [
    {
      id: "crm-definition-answer-record",
      heading: "The definition: a shared record of outstanding answers",
      body:
        "Every commercial relationship carries an open loop — a question you have not answered, a quote you have not sent, a renewal nobody has raised. " +
        "A CRM stores those loops where more than one person can see them, with enough history attached that whoever picks one up knows what was already said. " +
        "Contacts, companies, deals, and activities are just the shapes that record takes. If a tool holds those loops reliably and more than one person trusts it, it is functioning as a CRM, regardless of what the vendor calls it.",
    },
    {
      id: "crm-definition-four-replacements",
      heading: "The four things a CRM replaces",
      body:
        "First, the mental list: the reason a strong salesperson leaving takes revenue with them. " +
        "Second, the personal inbox: correspondence that exists but is unreachable by anyone else, which is why \"just cc me\" never scales. " +
        "Third, the shared spreadsheet, which works surprisingly well until two people edit it and neither notices. " +
        "Fourth, the reconstruction meeting — the weekly hour spent rebuilding last week from memory. " +
        "A CRM earns its cost by removing that fourth one; if the meeting still happens the same way, the record is not being trusted.",
    },
    {
      id: "crm-definition-failure-modes",
      heading: "When a CRM fails: the record stops being true",
      body:
        "CRM projects rarely fail on missing capability. They fail when the record stops matching reality, and then everyone quietly reverts to the spreadsheet they can trust. " +
        "That happens for three practical reasons: updating it costs more than the rep gains, nobody is accountable for the fields that reports depend on, or the pipeline stages describe an idealised process nobody follows. " +
        "It is a poor fit to buy software as the fix for the third one — stage definitions are a management decision, and no tool will hold a process the team has not agreed to. " +
        "The second attempt is more expensive than the first, too: replacing an abandoned CRM means a data mapping exercise across two systems and a re-train for people who have already learned one, which is why the cheapest possible first implementation is usually the right one.",
      tip: "If your forecast comes from a spreadsheet, the CRM is decoration.",
    },
  ],
  directAnswer: {
    body: "A CRM is the shared, trusted record of who you owe an answer to and what you promised — everything else in the product exists to keep that record accurate enough that a second person can act on it.",
    bullets: [
      "Replaces the mental list, the private inbox, the shared sheet, and the reconstruction meeting",
      "Best for teams where more than one person needs the same history",
      "Fails when updating the record costs the updater more than it returns",
    ],
  },
  framework: {
    title: "Is the record actually working?",
    steps: [
      { id: "crm-def-1", label: "List the questions you cannot answer today without asking a colleague" },
      { id: "crm-def-2", label: "Trace one real relationship end to end and find where history disappears" },
      { id: "crm-def-3", label: "Name the person accountable for the fields your reports read" },
      { id: "crm-def-4", label: "Check whether your forecast comes from the record or from a spreadsheet" },
    ],
  },
  mistakes: {
    title: "Misunderstandings that survive the first year",
    items: [
      {
        title: "Treating a CRM as a reporting tool",
        body: "Reports are a by-product. The record's job is to make the next action obvious to whoever opens it.",
      },
      {
        title: "Expecting software to define your sales process",
        body: "Stages you have not agreed on will not become real because a dropdown contains them.",
      },
      {
        title: "Measuring adoption as logins",
        body: "The useful measure is whether a second person can pick up a relationship without asking the first one.",
      },
    ],
  },
  steps: [
    {
      heading: "Write down the questions you currently cannot answer",
      body:
        "\"Who last spoke to this account?\" \"What did we quote them?\" \"What did we promise in March?\" " +
        "The list is your specification. A CRM that answers those five questions for two different people is doing the job; one that answers thirty questions nobody asked is a configuration project.",
    },
    {
      heading: "Trace one relationship end to end and find the gap",
      body:
        "Pick a customer from last quarter and follow the whole thread: first contact, quote, objection, close, delivery, renewal conversation. " +
        "Mark the exact point where the history stops being retrievable by anyone but one person. That gap — usually the handoff after the sale — is what the record has to close first.",
    },
    {
      heading: "Name who owns each field a report depends on",
      body:
        "Pick your three most-used numbers and trace each back to the field that produces it, then write a name beside that field. " +
        "Unowned fields degrade quietly, and the first symptom is a leader who stops quoting the dashboard in meetings.",
      tip: "Three owned fields beat thirty optional ones.",
    },
  ],
  checklist: [
    {
      label: "The five questions the record must answer are written down",
      description: "Specification first — it is also your demo script.",
    },
    {
      label: "One relationship traced end to end, with the history gap marked",
      description: "The gap is usually the post-sale handoff, not the sales process.",
    },
    {
      label: "Every reported field has a named owner",
      description: "Unowned fields are how a trusted record becomes decoration.",
    },
  ],
});

/* ================================================================== *
 * 4. hubspot-plans — two ladders, one invoice
 * ================================================================== */

const hubspotPlans: PageBuilder = (f0) => {
  const f = requireFacts(f0, "hubspot-plans");
  const ladderSplit = fallbackLimitation(f, /separate ladders/i, 0);
  const hubStack = fallbackLimitation(f, /additional hubs|GTM stack/i, 2);
  const adminLoad = fallbackLimitation(f, /Administration|complexity/i, 3);
  return {
    enrichmentType: "COST_GUIDE",
    uniqueValueAdded: [
      "pricing_comparison",
      "decision_framework",
      "limitations_evidence",
      "scenario_analysis",
      "buyer_checklist",
    ],
    lens: "two seat ladders, one invoice; hub gates set the real price",
    summary:
      `Nobody buys "${f.name}" — you buy a combination, and the quote is the sum of two independent seat ladders plus whichever hubs you switch on. ` +
      `Documented: ${ladderSplit} That is why the published platform ladder (${f.ladder}) understates a real invoice: ${hubStack} ` +
      `The practical consequence is that your cost ceiling is set by the hub you cannot live without, not by the tier name you picked.`,
    seoTitle: "HubSpot Plans: Seat Ladders, Hub Gates, When Free Is Enough",
    seoDescription:
      `Price ${f.name} by counting two seat ladders separately and naming the hub that forces an upgrade. ${ladderSplit}`,
    sections: [
      {
        id: "hubspot-plans-two-ladders",
        heading: "Count two ladders separately, then add them",
        body:
          `The single most expensive mistake here is arithmetic, not judgement. ${ladderSplit} ` +
          `So build the quote as two columns — platform seats in one, hub seats in the other — and only then look at a total. ` +
          `Free-versus-paid is not one decision either: a large share of any team can sit on the free tier holding contact history, while only the people who need sequences and reporting occupy a paid rung. Collapsing everyone into one seat count is what turns a modest bill into a surprising one.`,
      },
      {
        id: "hubspot-plans-hub-gate",
        heading: "The hub gate, not the tier name, sets your cost ceiling",
        body:
          `Write down the single workflow that the cheaper rung cannot run. If you can name it — a lifecycle email programme, a ticketing SLA, a reporting object — that is your gate, and the plan jumps to whatever rung clears it. ` +
          `If you cannot name it, you are not at a pricing threshold; you are shopping. ${hubStack} ` +
          `You gain genuine breadth at this gate and you sacrifice the option of a small, boring bill — that is the trade-off worth stating out loud before the renewal, because unwinding a hub later is harder than adding one.`,
      },
      {
        id: "hubspot-plans-admin-drag",
        heading: "The cost that never appears on the quote: administration",
        body:
          `${adminLoad} That is an implementation complexity cost, and it needs a named owner or it becomes everyone's part-time job. ` +
          `Compared with a single-pipeline CRM, the difference is not feature depth but governance surface: more objects and seat types mean more decisions per quarter, whereas a pipeline-only tool has almost none. ` +
          `Poor fit: a team of three who wanted a deal board and now owns a platform. Strong fit: an org where marketing, sales, and support genuinely need to read the same contact timeline.`,
        tip: "Name the hub administrator before you sign, not after onboarding.",
      },
    ],
    directAnswer: {
      body: `Quote ${f.name} as two separate seat ladders plus the specific hub that gates the workflow you cannot run today — if no workflow gates you, stay on the free tier and revisit next quarter.`,
      bullets: [
        "Best for orgs where marketing, sales, and support read one shared timeline",
        `Documented: ${ladderSplit}`,
        "Weak fit when a single pipeline board would already clear this quarter's number",
      ],
    },
    framework: {
      title: "Build the quote in three columns",
      steps: [
        { id: "hubspot-plans-1", label: "Column one: people who only need contact history (free tier)" },
        { id: "hubspot-plans-2", label: "Column two: platform seats for people who need paid platform capability" },
        { id: "hubspot-plans-3", label: "Column three: hub seats, named per hub, with the gating workflow beside each" },
        { id: "hubspot-plans-4", label: "Only now total it, and compare against a pipeline-only alternative" },
      ],
    },
    mistakes: {
      title: "Quoting mistakes on this ladder",
      items: [
        {
          title: "Treating every user as the same seat",
          body: ladderSplit,
        },
        {
          title: "Upgrading before a workflow gates you",
          body: "A tier bought \"for completeness\" has no exit criteria, so it never gets reviewed downward.",
        },
        {
          title: "Ignoring the administration owner",
          body: adminLoad,
        },
      ],
    },
    steps: [
      {
        heading: "Split your headcount into history-readers and workflow-users",
        body:
          `Go through the actual list of names. Beside each one write either "reads history" or "runs a workflow". The first group frequently sits on the free tier indefinitely; the second group is the only group you are actually buying for. ` +
          `Teams that skip this step quote for their entire company and then discover a third of those seats never logged a second session.`,
      },
      {
        heading: "Name the gating workflow in one sentence, or do not upgrade",
        body:
          `The sentence must be specific enough to test: "we need automated lifecycle emails triggered by deal stage, which the current rung cannot do." ` +
          `A specific gate gives you an upgrade you can justify and, more usefully, a downgrade condition. Vague gates ("better reporting") produce permanent tiers.`,
        tip: "If the gate sentence has no verb, it is not a gate.",
      },
      {
        heading: "Price the honest alternative before you sign",
        body:
          `Put a pipeline-first CRM quote next to yours for the same headcount. The comparison is not about which is better — it is about whether shared marketing and support context is worth the difference this year. ` +
          `Where the answer is no, the cheaper tool wins on the only metric that matters this quarter; where the answer is yes, you now have a written reason that survives the renewal conversation.`,
      },
    ],
    checklist: [
      {
        label: "Headcount split into history-readers and workflow-users",
        description: "Two columns before any total. The free tier usually absorbs the first column.",
      },
      {
        label: "Gating workflow written as one testable sentence",
        description: "No sentence means no upgrade this quarter.",
      },
      {
        label: "Hub administration owner named",
        description: "Governance surface grows with every hub and seat type you add.",
      },
    ],
  };
};

/* ================================================================== *
 * 5. is-hubspot-worth-it — the free-tier baseline test
 * ================================================================== */

const isHubspotWorthIt: PageBuilder = (f0) => {
  const f = requireFacts(f0, "is-hubspot-worth-it");
  const ladderSplit = fallbackLimitation(f, /separate ladders/i, 0);
  const hubStack = fallbackLimitation(f, /additional hubs|GTM stack/i, 2);
  return {
    enrichmentType: "DECISION_GUIDE",
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "free-tier baseline test — pay only for what free cannot do",
    summary:
      `${f.name} is unusual in that it hands you a serious free baseline, which makes the worth-it question sharper than usual: not "is this good software" but "what does the paid rung do that the free tier already does not?" ` +
      `Run the free tier first for a month, write down what actually blocked you, and price only that. It is worth it when your blocker is shared context across marketing, sales, and support; it is not worth it when the blocker was never a software blocker at all. ` +
      `Constraint to keep in view while comparing: ${ladderSplit}`,
    seoTitle: "Is HubSpot Worth It? The Free CRM Baseline Test",
    seoDescription:
      `Answer the ${f.name} question by running the free tier for a month first, then pricing only the blocker it exposed. Includes where the paid rungs are a weak fit.`,
    sections: [
      {
        id: "hubspot-worth-baseline-test",
        heading: "Start from the free baseline, not from the demo",
        body:
          `Because the free tier is genuinely usable, you can run the evaluation as an experiment rather than an opinion. Use it for four weeks with real deals, and keep a running note titled "what stopped me". ` +
          `At the end, most teams have between zero and three entries. Zero entries means paying now buys reassurance, not capability. Three entries that all point at one hub means you have a clean, defensible upgrade. ` +
          `This is the rare evaluation where you can get evidence before spending, and skipping it is the main reason buyers over-purchase here.`,
      },
      {
        id: "hubspot-worth-shared-context",
        heading: "Worth it when three teams need one timeline",
        body:
          `The specific advantage worth paying for is that a support reply, a marketing email, and a deal note sit on one contact timeline — so nobody has to ask a colleague what happened. ` +
          `That is a use-case recommendation, not a general endorsement: choose it when support and marketing genuinely act on sales context weekly. ` +
          `Where marketing sends a monthly newsletter and support runs on a separate inbox, you are paying for an integration nobody consumes. ${hubStack}`,
      },
      {
        id: "hubspot-worth-weak-fit",
        heading: "Weak fit, and the cost of finding out late",
        body:
          `It is a poor fit for a small closing team whose only real problem is follow-up discipline; a cheaper pipeline tool answers that faster and with less to administer. ` +
          `It is also a weak fit where the pipeline exists mostly in one person's head — no platform fixes an unwritten process. ` +
          `Note the switching cost in both directions: once contacts, forms, and workflows live here, leaving is a data mapping and re-train project, which is exactly why the four-week baseline test is worth doing before the commitment rather than after.`,
        tip: "Keep the \"what stopped me\" note in the CRM itself — it becomes your renewal evidence.",
      },
    ],
    directAnswer: {
      body: `${f.name} is worth it when a named blocker on the free tier points at one specific hub, and it is not worth it when your month on the free tier produced no blockers — buy the blocker, never the brand.`,
      bullets: [
        "Ideal for orgs where marketing, sales, and support act on the same timeline weekly",
        "Weak fit for a small closing team that only needs follow-up discipline",
        "Run four weeks on the free tier before pricing anything",
      ],
    },
    framework: {
      title: "The four-week baseline test",
      steps: [
        { id: "hubspot-worth-1", label: "Run real deals on the free tier for four weeks" },
        { id: "hubspot-worth-2", label: "Keep a \"what stopped me\" note with dates and specifics" },
        { id: "hubspot-worth-3", label: "Group the blockers by hub; discard the ones that were process, not software" },
        { id: "hubspot-worth-4", label: "Price only the hub that owns the surviving blockers" },
      ],
    },
    mistakes: {
      title: "Where the worth-it judgement goes wrong",
      items: [
        {
          title: "Evaluating on a demo instead of the free tier",
          body: "A demo shows capability. The free tier shows which capability you personally miss.",
        },
        {
          title: "Counting process problems as software blockers",
          body: "\"Reps don't update deals\" is not resolved by a higher rung; it is resolved by an owner and an exit condition per stage.",
        },
        {
          title: "Buying the platform, then finding the hub you needed is separate",
          body: ladderSplit,
        },
      ],
    },
    steps: [
      {
        heading: "Run four weeks of real deals on the free tier",
        body:
          `Not a sandbox — your actual live deals, with the team that will use it. Sandboxes never surface the friction that decides this question, because nobody is under pressure inside one. ` +
          `Set the end date now so the trial does not quietly become the permanent state by default.`,
      },
      {
        heading: "Write the blocker log, then delete the process complaints",
        body:
          `Each entry gets a date, what you were trying to do, and what stopped you. At the end, strike out every entry that is really about behaviour or an undefined stage. ` +
          `What remains is short and specific, and it maps to one hub far more often than to three. That mapping is your quote.`,
        tip: "A blocker with no date probably did not happen.",
      },
      {
        heading: "Price the surviving blocker against a cheaper single-purpose tool",
        body:
          `Take the one surviving blocker to two quotes: the paid rung that fixes it here, and a dedicated tool that fixes only that. ` +
          `Sometimes the dedicated tool wins outright. When the shared timeline is the actual requirement, the platform wins and you now know exactly why — which is the sentence you will need at renewal.`,
      },
    ],
    checklist: [
      {
        label: "Four weeks of real usage on the free tier completed",
        description: "Live deals and the real team, with an end date set in advance.",
      },
      {
        label: "Blocker log written, process complaints struck out",
        description: "What survives is your upgrade justification, and its scope.",
      },
      {
        label: "Surviving blocker priced against a single-purpose alternative",
        description: "If the cheaper tool clears it, the platform is not the answer this year.",
      },
    ],
  };
};

/* ================================================================== *
 * 6. activecampaign-plans — contact bands and the automation wall
 * ================================================================== */

const activecampaignPlans: PageBuilder = (f0) => {
  const f = requireFacts(f0, "activecampaign-plans");
  const packaging = fallbackLimitation(f, /checkout|packaging/i, 0);
  return {
    enrichmentType: "COST_GUIDE",
    uniqueValueAdded: [
      "pricing_comparison",
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "billed by contacts, gated by automation depth",
    summary:
      `${f.name} does not bill you for people who log in — it bills you for people on your list, which reverses the usual budgeting exercise. ` +
      `${f.shortDescription} Published entry-band floors: ${f.ladder} — each of those figures is a floor at a small list size, not a seat price. ` +
      `So the two questions that set your invoice are how many contacts you are willing to keep, and whether your automation ambitions clear the tier where multi-step journeys and pipelines actually get useful. ${packaging}`,
    seoTitle: "ActiveCampaign Plans: Contact Bands and the Plus CRM Wall",
    seoDescription:
      `Budget ${f.name} by contact count, not seats, and check whether your journeys need the tier where CRM pipelines get serious. ${packaging}`,
    sections: [
      {
        id: "activecampaign-plans-contact-band",
        heading: "Your list size is the price, so prune before you quote",
        body:
          `Contact-band billing has an unusual property: list hygiene is a direct cost lever. Deleting or suppressing unengaged contacts moves you down a band, and it improves deliverability at the same time. ` +
          `Do that pruning before you get a quote, because a band chosen against an inflated list becomes the floor you renew on. ` +
          `Where a per-seat CRM rewards you for limiting logins, this model rewards you for limiting your list — a genuinely different budgeting instinct, and the one most buyers get wrong in month one.`,
      },
      {
        id: "activecampaign-plans-automation-wall",
        heading: "The automation wall: where journeys and pipelines get serious",
        body:
          `${f.shortDescription} The practical reading of that is a wall rather than a slope: the entry tier sends good email, but multi-step branching journeys and sales pipeline work are the reason to climb. ` +
          `So the pricing threshold is behavioural — count the journeys you will actually build and maintain. Two journeys nobody has drafted do not justify a tier. ` +
          `The workflow advantage on the higher rung is that a single automation can move a contact between marketing and sales states without a person noticing, which is what removes weekly list-shuffling work.`,
      },
      {
        id: "activecampaign-plans-no-free-tier",
        heading: "No free tier changes how you evaluate",
        body:
          `Because there is no free forever plan here, the trial is the entire evaluation window and it needs a plan of its own. Build one real journey in it, not five sketches. ` +
          `Poor fit: a team that wants a free CRM with occasional email — the centre of gravity is lifecycle automation, and you would be paying an email platform to be a mediocre deal board. ` +
          `Migration risk is worth pricing too: moving an established list means re-establishing sending reputation and re-mapping custom fields, so switching later costs more than the price difference suggests.`,
        tip: "Prune the list before the trial, not after the invoice.",
      },
    ],
    directAnswer: {
      body: `Price ${f.name} from a pruned contact count and the number of multi-step journeys you will genuinely maintain — the tier where CRM pipelines get useful is a deliberate step up, not an incidental extra.`,
      bullets: [
        "Built for teams whose growth engine is lifecycle email and automation",
        "Contact-band billing means list hygiene is a direct cost lever",
        "Weak fit if you wanted a free deal board with light email attached",
      ],
    },
    framework: {
      title: "Contact-band budgeting",
      steps: [
        { id: "activecampaign-plans-1", label: "Prune and suppress unengaged contacts before requesting a quote" },
        { id: "activecampaign-plans-2", label: "Count the journeys you will build in the first ninety days" },
        { id: "activecampaign-plans-3", label: "Decide whether sales pipeline work belongs here or in a dedicated CRM" },
        { id: "activecampaign-plans-4", label: "Verify the live contact-band price for your pruned number" },
      ],
    },
    mistakes: {
      title: "Budgeting mistakes on contact-based pricing",
      items: [
        {
          title: "Quoting against an unpruned list",
          body: "The band you enter on becomes the band you renew on, and unengaged contacts cost twice — in price and in deliverability.",
        },
        {
          title: "Buying automation depth for journeys nobody has drafted",
          body: "Count drafted journeys, not intended ones. Intentions do not survive a busy quarter.",
        },
        {
          title: "Treating the trial as a look-around",
          body: "With no free tier, the trial is your only pre-purchase evidence. Build one real journey end to end.",
        },
      ],
    },
    steps: [
      {
        heading: "Prune the list, then count what is left",
        body:
          `Segment by last engagement and be honest about the tail. Contacts who have not opened anything in a year are costing you band space and sender reputation simultaneously. ` +
          `Export the pruned count — that number, not your CRM's total contact count, is the one to price against.`,
      },
      {
        heading: "Draft your journeys on one page before the trial",
        body:
          `Sketch each journey as trigger, branches, and exit. Three drafted journeys is a real automation requirement; a vague plan to "do more nurture" is not. ` +
          `This page also tells you whether you need the pipeline-capable tier, because journeys that change deal state are exactly what pulls you up the ladder.`,
        tip: "A journey without a written exit condition will run forever and annoy people.",
      },
      {
        heading: "Decide where the deal record lives — here or elsewhere",
        body:
          `If pipelines will live here, commit to it and use the tier that supports them properly. If your deals already live in a dedicated CRM, keep them there and buy this purely as the lifecycle engine. ` +
          `The expensive outcome is the halfway house, where deals exist in both places and neither is trusted; that is a data mapping problem you inflict on yourself.`,
      },
    ],
    checklist: [
      {
        label: "Contact list pruned and the surviving count exported",
        description: "Price the band against the pruned number, not the historical total.",
      },
      {
        label: "Journeys drafted on one page with triggers and exits",
        description: "Drafted journeys justify automation depth; intentions do not.",
      },
      {
        label: "Decision recorded on where the deal record lives",
        description: "One system of record. The halfway house is the expensive option.",
      },
    ],
  };
};

/* ================================================================== *
 * 7. is-activecampaign-worth-it — count the journeys
 * ================================================================== */

const isActivecampaignWorthIt: PageBuilder = (f0) => {
  const f = requireFacts(f0, "is-activecampaign-worth-it");
  const packaging = fallbackLimitation(f, /checkout|packaging/i, 0);
  return {
    enrichmentType: "DECISION_GUIDE",
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "journey count test — three drafted journeys or stay put",
    summary:
      `The honest test for ${f.name} is arithmetic on your own roadmap: can you name three multi-step journeys, with triggers and exit conditions, that you will maintain for the next two quarters? ` +
      `Three means the automation depth pays for itself in work you stop doing manually. One means your current sending tool is probably fine. ` +
      `${trimPeriod(f.shortDescription)} — so the judgement turns on automation ambition, not on email quality, which almost every credible tool now handles.`,
    seoTitle: "Is ActiveCampaign Worth It? Count Your Journeys First",
    seoDescription:
      `Decide on ${f.name} with a journey count test: three maintained multi-step journeys justify the automation depth, one does not. Includes weak-fit cases. ${packaging}`,
    sections: [
      {
        id: "activecampaign-worth-journey-count",
        heading: "The journey count test",
        body:
          `Write out every automation you intend to run: trigger, branch logic, exit. Then cross off any you have not already been doing by hand, because those are aspirations rather than requirements. ` +
          `What remains is the number that decides this. At three or more, you are buying back recurring manual work every single week, and the workflow advantage compounds — a contact moves between lifecycle states without anyone shuffling a list. ` +
          `At one, you are buying capability you will admire and not use.`,
      },
      {
        id: "activecampaign-worth-crm-boundary",
        heading: "Worth it as a lifecycle engine, not as your deal board",
        body:
          `It is worth it when the growth constraint is lifecycle communication: onboarding sequences, re-engagement, behaviour-triggered follow-up. ` +
          `It is a weak fit when what you actually wanted was a fast deal board for two closers — a pipeline-first CRM answers that with less to configure, whereas here the pipeline is a companion to the automation rather than the centre of the product. ` +
          `That is a difference in centre of gravity, not a defect, and treating it as a defect is how teams end up disappointed by a perfectly good tool.`,
      },
      {
        id: "activecampaign-worth-commitment-risk",
        heading: "What you commit to, and what leaving costs",
        body:
          `There is no free forever tier, so the trial is your only evidence — plan it as an experiment with one real journey rather than a tour. ` +
          `Also price the exit before entering. Once your list, custom fields, and journeys live here, migration means re-mapping fields and rebuilding warm sending reputation elsewhere; that switching cost is usually larger than a tier difference. ` +
          `${packaging} Confirm current packaging yourself rather than trusting any summary, including this one.`,
        tip: "Draft the journeys before the trial starts — the clock is short.",
      },
    ],
    directAnswer: {
      body: `${f.name} is worth it if you can name three multi-step journeys you will maintain for two quarters; if you can only name one, keep your current sender and revisit when the roadmap is real.`,
      bullets: [
        "Best for teams whose constraint is lifecycle automation, not deal-board speed",
        "Three maintained journeys is the threshold that pays back the automation depth",
        "Poor fit as a primary deal board for a small closing team",
      ],
    },
    framework: {
      title: "The three-journey threshold",
      steps: [
        { id: "activecampaign-worth-1", label: "List every intended automation with trigger, branches, and exit" },
        { id: "activecampaign-worth-2", label: "Cross off any you are not already doing manually today" },
        { id: "activecampaign-worth-3", label: "Count what survives — three or more is a yes" },
        { id: "activecampaign-worth-4", label: "Decide separately whether deals stay in your existing CRM" },
      ],
    },
    mistakes: {
      title: "Reasons buyers regret this one",
      items: [
        {
          title: "Buying automation for journeys that were never drafted",
          body: "Manual work you are already doing is evidence. A roadmap slide is not.",
        },
        {
          title: "Expecting it to replace a pipeline-first CRM",
          body: "Pipelines are a companion capability here; a closer who lives in a deal board will feel the difference immediately.",
        },
        {
          title: "Not pricing the exit",
          body: "List migration means field re-mapping and rebuilding sender reputation — larger than any tier difference.",
        },
      ],
    },
    steps: [
      {
        heading: "Write the journeys out and mark which you already do by hand",
        body:
          `A journey you already run manually — the onboarding emails someone sends every Monday — is proven demand. Mark those. ` +
          `They are the ones that will actually be built, and they are the ones that justify the spend, because the payback is the Monday you get back.`,
      },
      {
        heading: "Run one real journey inside the trial, end to end",
        body:
          `Pick the manual one you most resent. Build it fully: trigger, branches, exit, and a real segment of contacts flowing through it. ` +
          `A trial spent clicking through features tells you nothing; one completed journey tells you whether the builder fits how you think.`,
        tip: "Choose the journey you resent most — motivation is part of the test.",
      },
      {
        heading: "Settle the deal-record boundary before you subscribe",
        body:
          `Decide explicitly: deals live here, or deals live in your CRM and this drives lifecycle. Write the decision down and tell the team. ` +
          `Left implicit, both systems accumulate half a pipeline, and within a quarter your forecast lives in a spreadsheet again.`,
      },
    ],
    checklist: [
      {
        label: "Journeys listed with the manually-run ones marked",
        description: "Proven manual work is the only reliable evidence of demand.",
      },
      {
        label: "One real journey built end to end inside the trial",
        description: "The trial is the whole evaluation — there is no free forever tier to fall back on.",
      },
      {
        label: "Deal-record boundary decided and communicated",
        description: "One system of record, stated explicitly before you subscribe.",
      },
    ],
  };
};

/* ================================================================== *
 * 8. insightly-plans — the delivery seat
 * ================================================================== */

const insightlyPlans: PageBuilder = (f0) => {
  const f = requireFacts(f0, "insightly-plans");
  const confidence = fallbackLimitation(f, /confidence|re-verify/i, 0);
  const packaging = fallbackLimitation(f, /checkout|packaging/i, 1);
  return {
    enrichmentType: "COST_GUIDE",
    uniqueValueAdded: [
      "pricing_comparison",
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "every seat pays for both halves — CRM and delivery",
    summary:
      `${f.shortDescription} That combination is the whole pricing story: every seat you buy pays for both halves, whether or not the person occupying it uses both. ` +
      `Published ladder: ${f.ladder}. So the useful exercise is not comparing tier features — it is counting how many of your people genuinely work on both sides of the sale, because those are the seats that return the money. ` +
      `Verification note: ${confidence}`,
    seoTitle: "Insightly Plans: What the CRM-Plus-Projects Seat Buys",
    seoDescription:
      `Work out ${f.name} cost by counting people who work both sides of the sale — every seat pays for CRM and delivery together. ${confidence}`,
    sections: [
      {
        id: "insightly-plans-dual-seat",
        heading: "Count dual-use people, not headcount",
        body:
          `Split your list three ways: sells only, delivers only, does both. The people in the third group are why this pricing works — one seat replaces a CRM licence plus a project-tool licence for them. ` +
          `For the first two groups the arithmetic is less kind, because you pay for the half they never open. ` +
          `Where a pipeline-only CRM is cheapest for a pure sales team, this becomes the cheaper option once the both-column outnumbers the others, whereas below that point you are subsidising unused capability.`,
      },
      {
        id: "insightly-plans-automation-rungs",
        heading: "What actually moves you up a rung",
        body:
          `${f.shortDescription} Read that as: the lower rung buys the shared record; the higher rungs buy automation and AI depth on top of it. ` +
          `So the pricing threshold is not contact volume — it is whether you need the system to move work between the sales and delivery halves without a person doing it. If handoffs are currently done by a human who is reliable, you gain less by climbing. ` +
          `You gain automated routing at the cost of a per-seat rate applied to your entire licence count, which is the trade-off to check against the both-column number before you upgrade everyone.`,
      },
      {
        id: "insightly-plans-verify-risk",
        heading: "Verify the quote — and the migration you are actually signing up for",
        body:
          `${confidence} ${packaging} Treat any figure, including the ladder above, as a starting point for a live check rather than a commitment. ` +
          `The larger risk is the migration itself: you are consolidating two systems into one, which means data mapping from a CRM and from whatever currently tracks delivery work. Projects carry attachments, task dependencies, and dates that rarely map cleanly. ` +
          `Avoid if only one of those two systems is genuinely broken — consolidating a working tool into a new one adds cutover risk without adding capability.`,
        tip: "Map project tasks before contacts — task dependencies are what break in a cutover.",
      },
    ],
    directAnswer: {
      body: `Price ${f.name} by counting the people who work both sides of the sale; when that group is the majority, one seat replacing two licences is the saving, and when it is a minority you are paying for half a product per seat.`,
      bullets: [
        "Built for service-oriented teams where the same people sell and then deliver",
        "Higher rungs buy automation and AI depth, not more contact capacity",
        `Verify before quoting: ${confidence}`,
      ],
    },
    framework: {
      title: "The dual-use seat count",
      steps: [
        { id: "insightly-plans-1", label: "Split names into sells-only, delivers-only, and does-both" },
        { id: "insightly-plans-2", label: "Compare the does-both count against the other two combined" },
        { id: "insightly-plans-3", label: "Decide whether automated sales-to-delivery routing is needed this year" },
        { id: "insightly-plans-4", label: "Re-verify the live per-seat rate before committing" },
      ],
    },
    mistakes: {
      title: "Where this quote goes wrong",
      items: [
        {
          title: "Buying seats for people who only use one half",
          body: "A delivers-only person on a CRM-priced seat is the most common source of quiet overspend here.",
        },
        {
          title: "Upgrading everyone for automation two people need",
          body: "Per-seat rungs apply to the whole licence count, so check the both-column before you climb.",
        },
        {
          title: "Consolidating a system that was not broken",
          body: "Two migrations for one benefit. Move the broken half first and keep the working one until it earns replacement.",
        },
      ],
    },
    steps: [
      {
        heading: "Write the three-column list of names",
        body:
          `Sells only, delivers only, does both. Use real names, not roles, because roles hide the reality that your best account manager does both and your two junior closers do not. ` +
          `The both-column length is the number that decides whether this pricing model is working for you or against you.`,
      },
      {
        heading: "Time one handoff by hand before buying automation",
        body:
          `Take a deal that closed last month and time how long the sold-to-delivered handoff actually took, including the chasing. ` +
          `If it is minutes and reliable, automated routing is a convenience. If it is days and things get dropped, you have found the specific reason to climb a rung — and a number to review it against later.`,
        tip: "Measure the handoff before you automate it, or you will never know if it improved.",
      },
      {
        heading: "Re-verify the live rate, then map the delivery data first",
        body:
          `Check the current per-seat price on the vendor's own page before you sign anything — published research on this one is explicitly medium confidence. ` +
          `Then, when planning the cutover, start the mapping with project tasks and dependencies rather than contacts. Contacts import predictably; delivery work does not, and discovering that late turns a weekend cutover into a fortnight.`,
      },
    ],
    checklist: [
      {
        label: "Three-column name list completed",
        description: "Sells only, delivers only, does both — the third column is the business case.",
      },
      {
        label: "One real handoff timed end to end",
        description: "Evidence for or against paying for automated routing.",
      },
      {
        label: "Live per-seat rate re-verified on the vendor page",
        description: "Published pricing confidence for this product is medium, not high.",
      },
    ],
  };
};

/* ================================================================== *
 * 9. is-insightly-worth-it — the handoff test
 * ================================================================== */

const isInsightlyWorthIt: PageBuilder = (f0) => {
  const f = requireFacts(f0, "is-insightly-worth-it");
  const confidence = fallbackLimitation(f, /confidence|re-verify/i, 0);
  return {
    enrichmentType: "DECISION_GUIDE",
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "the sold-to-delivered handoff is the whole question",
    summary:
      `There is one question that settles ${f.name}: is your worst moment the sale, or the week after the sale? ` +
      `${trimPeriod(f.shortDescription)} — which means it is built to remove the gap where a signed deal becomes someone else's project and the history stops travelling with it. ` +
      `If your pipeline is healthy but delivery starts with a "what did we promise?" conversation, this is worth it. If your problem is closing rate, you would be buying a delivery system to fix a sales problem.`,
    seoTitle: "Is Insightly Worth It? The Sold-to-Delivered Handoff Test",
    seoDescription:
      `Decide on ${f.name} by locating your worst moment: the sale or the week after it. A delivery-side failure makes this worth it; a closing-rate problem does not.`,
    sections: [
      {
        id: "insightly-worth-handoff-test",
        heading: "Find your worst moment first",
        body:
          `Take the last five deals you closed and mark where the friction actually was. Chasing the decision? That is a pipeline problem. Reconstructing the promise for whoever now delivers it? That is a handoff problem. ` +
          `This product is aimed squarely at the second, and it is worth it when four of five deals show the same post-sale gap. ` +
          `The distinction matters because the two problems have almost no overlap in solution: faster follow-up does nothing for a lost scope note, and a shared project record does nothing for a stalled negotiation.`,
      },
      {
        id: "insightly-worth-scenario-fit",
        heading: "Two scenarios where the answer flips",
        body:
          `Scenario one: an eight-person agency where the person who sells also runs the first two weeks of delivery. Here the recommendation is straightforward — one record covering both halves removes the re-explaining that eats those two weeks. ` +
          `Scenario two: a four-person team selling a self-serve product with no delivery phase at all. There is no handoff to fix, so you would be paying for the delivery half of every seat forever. ` +
          `Unlike a pipeline-first CRM, which is judged on how fast a rep can update a board, this one should be judged on how little gets re-explained after signature — because that is the work it is designed to remove.`,
      },
      {
        id: "insightly-worth-caveats",
        heading: "Caveats worth knowing before you commit",
        body:
          `Higher plans hold the automation and AI depth, so buying at the entry rung and expecting automated routing is a mismatch you will notice in month two. ` +
          `${confidence} Check the current rate and packaging yourself; a worth-it judgement built on a stale figure is not a judgement. ` +
          `And be realistic about the cutover: consolidating two systems means mapping delivery work as well as contacts, so plan the re-train around task and dependency structures, which is where teams stumble.`,
        tip: "Score your last five closed deals before you book a demo.",
      },
    ],
    directAnswer: {
      body: `${f.name} is worth it when the week after signature is your weakest moment — a shared record across sale and delivery removes the re-explaining — and it is not worth it if your real constraint is closing rate.`,
      bullets: [
        "Ideal for service teams where selling and delivering are the same people",
        "Not a fit where there is no delivery phase to hand off to",
        "Automation and AI depth sit on higher plans, not the entry rung",
      ],
    },
    framework: {
      title: "The five-deal handoff audit",
      steps: [
        { id: "insightly-worth-1", label: "Take your last five closed deals" },
        { id: "insightly-worth-2", label: "Mark whether friction sat before or after signature" },
        { id: "insightly-worth-3", label: "Count how many show the same post-sale gap" },
        { id: "insightly-worth-4", label: "Four or five means the handoff is the problem worth buying for" },
      ],
    },
    mistakes: {
      title: "Ways this decision misfires",
      items: [
        {
          title: "Buying a delivery system to fix a sales problem",
          body: "A shared post-sale record does not shorten a negotiation. Diagnose the moment first.",
        },
        {
          title: "Expecting automation at the entry rung",
          body: "Automation and AI depth live on the higher plans; entry buys the shared record.",
        },
        {
          title: "Judging it against pipeline-board speed",
          body: "The measure that matters here is how little gets re-explained after signature.",
        },
      ],
    },
    steps: [
      {
        heading: "Audit five closed deals for where the friction sat",
        body:
          `Write each deal on one line with a single word: "pipeline" or "handoff". Be strict — most teams assume pipeline because that is where attention lives, and then find four handoffs. ` +
          `Five lines takes twenty minutes and is more reliable than any demo.`,
      },
      {
        heading: "Rebuild one handoff manually and count the questions",
        body:
          `Take the messiest of those deals and reconstruct what delivery needed to know: scope, promises, dates, contacts, the caveat mentioned on a call. Count how many questions you had to ask someone to complete it. ` +
          `That count is your baseline, and it is the number you should be able to reduce within a quarter if this is the right purchase.`,
        tip: "Any answer that required asking a person is a gap the record should have held.",
      },
      {
        heading: "Confirm current pricing and plan the delivery-side migration",
        body:
          `Re-verify the live per-seat rate before you commit, because the published research is medium confidence. ` +
          `Then plan the migration around delivery artefacts — tasks, dependencies, attachments — and accept that this half needs more mapping attention and more re-training than the contact import will.`,
      },
    ],
    checklist: [
      {
        label: "Five closed deals labelled pipeline or handoff",
        description: "Four or more handoffs means this is aimed at your actual problem.",
      },
      {
        label: "Question count recorded for one manual handoff rebuild",
        description: "Your baseline for judging whether the purchase worked.",
      },
      {
        label: "Live rate re-verified and delivery migration scoped",
        description: "Medium published pricing confidence; delivery data needs the most mapping.",
      },
    ],
  };
};

/* ================================================================== *
 * 10. getresponse-plans — bands, the one-workflow wall, tier-locked tools
 * ================================================================== */

const getresponsePlans: PageBuilder = (f0) => {
  const f = requireFacts(f0, "getresponse-plans");
  const starterWall = fallbackLimitation(f, /Starter limited/i, 0);
  const freeLimits = fallbackLimitation(f, /Free plan/i, 1);
  const enterpriseOnly = fallbackLimitation(f, /SMS|dedicated IP/i, 2);
  const notCrm = fallbackLimitation(f, /Not a full sales CRM/i, 4);
  return {
    enrichmentType: "COST_GUIDE",
    uniqueValueAdded: [
      "pricing_comparison",
      "decision_framework",
      "limitations_evidence",
      "scenario_analysis",
      "buyer_checklist",
    ],
    lens: "one-workflow wall on Starter; band ladder; tier-locked tools",
    summary:
      `Two numbers set your ${f.name} invoice, and only one of them is on the pricing page: your contact band, and the number of automation workflows you need. ` +
      `The second is the wall most buyers hit first — ${inlineClause(starterWall)}. Published tiers, at their entry-band floors: ${f.ladder}. ` +
      `Free exists but is deliberately narrow: ${freeLimits} And several tools people assume are included are not: ${enterpriseOnly}`,
    seoTitle: "GetResponse Plans: List-Size Bands and the Starter Wall",
    seoDescription:
      `Price ${f.name} on two axes: contact band and workflow count. ${starterWall} Higher tiers unlock webinars, SMS, and dedicated sending.`,
    sections: [
      {
        id: "getresponse-plans-workflow-wall",
        heading: "The workflow count is the real wall, not the contact band",
        body:
          `Contact bands move gradually — you grow into the next one. The workflow limit does not: ${starterWall} ` +
          `So the question that decides your tier is a small one you can answer today: do you need a second automation? An abandoned-cart flow plus a welcome sequence is already two, which means the plan jumps before your list does. ` +
          `Teams who budget only for band growth get surprised in week three by a limit that has nothing to do with list size.`,
      },
      {
        id: "getresponse-plans-tier-locked-tools",
        heading: "Which tools are locked behind which tier",
        body:
          `Webinars and course tooling sit on the creator-oriented rung, so if teaching is your acquisition channel your tier is chosen for you. ` +
          `Meanwhile ${inlineClause(enterpriseOnly)} — which matters because dedicated sending infrastructure is exactly what high-volume senders assume comes with a paid plan. ` +
          `The workflow advantage of the higher rungs is that acquisition, delivery, and follow-up run in the same place: a webinar registration can trigger a nurture path without an integration in between, whereas splitting those across tools means someone maintains the join.`,
      },
      {
        id: "getresponse-plans-free-and-boundary",
        heading: "What free actually gives you, and where this stops",
        body:
          `Read the free tier honestly: ${freeLimits} It is a genuine starting point for a small list, not a long-term plan, and the branding and page limits arrive precisely when you start to care. ` +
          `Then the category boundary: ${notCrm} That is a poor fit warning, not a criticism — if you need deal stages and forecast, keep a CRM and let this drive lifecycle communication. ` +
          `Migration risk sits mostly in list reputation and field mapping; moving an engaged list is never just an export and an import.`,
        tip: "Count your workflows before you compare contact bands.",
      },
    ],
    directAnswer: {
      body: `Choose a ${f.name} tier by counting automation workflows first and contact band second — one workflow is the entry limit, and webinars, SMS, and dedicated sending each sit on specific higher rungs.`,
      bullets: [
        "Best for teams whose acquisition runs on email, landing pages, and webinars",
        `Entry-tier constraint: ${starterWall}`,
        notCrm,
      ],
    },
    framework: {
      title: "Two-axis tier selection",
      steps: [
        { id: "getresponse-plans-1", label: "Count the automation workflows you need running simultaneously" },
        { id: "getresponse-plans-2", label: "List any tool you assume is included: webinars, SMS, dedicated sending" },
        { id: "getresponse-plans-3", label: "Only then pick your contact band from a pruned list count" },
        { id: "getresponse-plans-4", label: "Confirm the band price for your exact list size on the live selector" },
      ],
    },
    mistakes: {
      title: "Tier-selection mistakes",
      items: [
        {
          title: "Budgeting for list growth but not workflow count",
          body: starterWall,
        },
        {
          title: "Assuming SMS or dedicated sending is included",
          body: enterpriseOnly,
        },
        {
          title: "Planning to run your pipeline here",
          body: notCrm,
        },
      ],
    },
    steps: [
      {
        heading: "Write the workflow list and count it",
        body:
          `Welcome sequence, abandoned cart, re-engagement, post-purchase upsell — each one is a workflow that has to run at the same time as the others. ` +
          `Write the list, count it, and compare against the entry-tier limit. This single count decides more of your invoice than your list size will for the first year.`,
      },
      {
        heading: "Circle the tools you assumed were included",
        body:
          `Go through your plan for the year and circle anything that needs webinars, SMS, or dedicated sending infrastructure. Each circle points at a specific rung. ` +
          `Discovering one of these after purchase is the classic mid-year upgrade nobody budgeted for.`,
        tip: "If webinars are your acquisition channel, your tier is already chosen.",
      },
      {
        heading: "Price the band from a pruned list, on the live selector",
        body:
          `Published headline figures are floors at a small list size; your real number comes from the plan selector at your actual pruned contact count. ` +
          `Prune first — unengaged contacts cost you band space and deliverability together — then read the price for the number that is left, not the number you started with.`,
      },
    ],
    checklist: [
      {
        label: "Simultaneous workflow count written down",
        description: "The entry tier caps custom workflows; this count usually sets the tier.",
      },
      {
        label: "Tier-locked tools circled for the year ahead",
        description: "Webinars, SMS, and dedicated sending each sit on specific rungs.",
      },
      {
        label: "Band price read from the live selector at pruned list size",
        description: "Headline figures are entry floors, not your price.",
      },
    ],
  };
};

/* ================================================================== *
 * 11. keap-plans — the floor is the decision
 * ================================================================== */

const keapPlans: PageBuilder = (f0) => {
  const f = requireFacts(f0, "keap-plans");
  const floor = fallbackLimitation(f, /Base plans start/i, 0);
  const capacity = fallbackLimitation(f, /Contact capacity|allotments/i, 1);
  const term = fallbackLimitation(f, /early-termination|Annual contracts/i, 2);
  const positioning = fallbackLimitation(f, /lightweight pipeline-only/i, 3);
  return {
    enrichmentType: "COST_GUIDE",
    uniqueValueAdded: [
      "pricing_comparison",
      "decision_framework",
      "limitations_evidence",
      "buyer_checklist",
      "scenario_analysis",
    ],
    lens: "the entry floor plus the term commitment is the decision",
    summary:
      `${f.name} pricing is decided almost entirely at the bottom of the ladder, because the entry point is a floor rather than a starter rate: ${floor} ` +
      `Published tiers: ${f.ladder}. Two more things belong in the same calculation: ${capacity} And the commitment is real: ${term} ` +
      `So this is less a tier comparison than a single question about whether the floor is justified in your first year.`,
    seoTitle: "Keap Plans: The Two-License Floor and Term Commitment",
    seoDescription:
      `${f.name} pricing starts at a floor that includes two licences, with per-user additions and usage allotments on top. ${term}`,
    sections: [
      {
        id: "keap-plans-entry-floor",
        heading: "The entry point is a floor, and it includes two licences",
        body:
          `Read the base carefully: ${floor} That structure has a consequence people miss — a solo operator pays for a second licence they will not use, while a three-person team is only paying one increment above the floor. ` +
          `The cost ceiling question therefore inverts the usual one. Instead of asking how expensive this gets at scale, ask whether your smallest realistic team can absorb the floor at all. ` +
          `Below roughly the floor's worth of monthly value, no tier comparison saves you, because the tiers all sit above it.`,
      },
      {
        id: "keap-plans-usage-allotments",
        heading: "Usage allotments sit beside the licence count",
        body:
          `${capacity} That gives you two independent growth axes to watch: people, and messages sent. ` +
          `A four-person team running heavy SMS campaigns can climb the ladder for reasons that have nothing to do with adding staff, which is the opposite of a per-seat CRM where headcount is the only lever. ` +
          `Estimate your monthly message volume before choosing a tier, because overage on a communication channel you depend on is the least pleasant kind of surprise.`,
      },
      {
        id: "keap-plans-term-and-fit",
        heading: "Commitment terms and who this is genuinely for",
        body:
          `${term} That converts the decision into an annual one, so the question is not "can we afford this month" but "will this still be right in month ten". ` +
          `On fit: ${positioning} That is the clearest statement of who should not be here. Unlike a lightweight pipeline tool, which you can abandon in a week for nothing, this asks for a term commitment because it expects to replace several tools at once. ` +
          `Implementation complexity follows from that: consolidating email, payments, and pipeline means a real setup effort in the first fortnight, not a signup.`,
        tip: "Ask about the early-termination term in writing before you sign the annual.",
      },
    ],
    directAnswer: {
      body: `${f.name} pricing is a floor decision: the base includes two licences with additional users charged on top, usage allotments that scale separately, and an annual commitment — so justify the floor before comparing tiers.`,
      bullets: [
        floor,
        "Watch two growth axes: licences and message volume",
        positioning,
      ],
    },
    framework: {
      title: "Justify the floor, then pick a tier",
      steps: [
        { id: "keap-plans-1", label: "Check whether your team can absorb the entry floor at all" },
        { id: "keap-plans-2", label: "Count licences beyond the two included in the base" },
        { id: "keap-plans-3", label: "Estimate monthly SMS and voice volume against tier allotments" },
        { id: "keap-plans-4", label: "Confirm the annual term and early-termination conditions in writing" },
      ],
    },
    mistakes: {
      title: "Costly assumptions on this ladder",
      items: [
        {
          title: "Treating the base as a per-user starter rate",
          body: floor,
        },
        {
          title: "Ignoring message allotments",
          body: capacity,
        },
        {
          title: "Signing the annual without reading the exit terms",
          body: term,
        },
      ],
    },
    steps: [
      {
        heading: "Test the floor against your smallest realistic month",
        body:
          `Take your quietest month from last year and ask whether the base would have been comfortable in it. If the answer is no, the ladder above is irrelevant. ` +
          `This is the one product in a CRM shortlist where the entry point, not the growth curve, is the decision — so spend your analysis there.`,
      },
      {
        heading: "Count licences above the two included, and message volume beside them",
        body:
          `Write the licence count as "base two plus N", then write your monthly SMS and voice estimate underneath. Those two numbers together produce a realistic annual figure. ` +
          `Most surprised invoices here come from the second number, because message volume grows with campaign ambition rather than headcount.`,
        tip: "Estimate message volume from last quarter's actual sends, not from the campaign plan.",
      },
      {
        heading: "Get the term and exit conditions in writing before signing",
        body:
          `Ask explicitly what happens if you cancel mid-term, and keep the answer. A documented early-termination condition is not a reason to walk away, but it is a reason to set a genuine internal review at month three rather than month eleven. ` +
          `Plan the consolidation work in that same fortnight — email, payments, and pipeline moving at once is the effort that earns the floor back.`,
      },
    ],
    checklist: [
      {
        label: "Entry floor tested against your quietest month",
        description: "If the floor fails there, the tier comparison never matters.",
      },
      {
        label: "Licence count written as base-plus-N with message volume beside it",
        description: "Two growth axes, both of which move your annual figure.",
      },
      {
        label: "Annual term and exit conditions confirmed in writing",
        description: "Then set a real internal review at month three.",
      },
    ],
  };
};

/* ================================================================== *
 * 12. is-keap-worth-it — consolidation math
 * ================================================================== */

const isKeapWorthIt: PageBuilder = (f0) => {
  const f = requireFacts(f0, "is-keap-worth-it");
  const floor = fallbackLimitation(f, /Base plans start/i, 0);
  const term = fallbackLimitation(f, /early-termination|Annual contracts/i, 2);
  const positioning = fallbackLimitation(f, /lightweight pipeline-only/i, 3);
  return {
    enrichmentType: "DECISION_GUIDE",
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "consolidation math — name the subscriptions you will cancel",
    summary:
      `${f.name} is only worth it if it replaces things. ${trimPeriod(f.shortDescription)} — email, payments, pipeline, and campaign automation in one place — so the test is a subtraction, not an addition: list the subscriptions you will actually cancel within sixty days of switching. ` +
      `${floor} Against that floor, two cancelled tools usually make the case and none never does. ` +
      `Positioning to be honest about: ${positioning}`,
    seoTitle: "Is Keap Worth It? Do the Consolidation Math First",
    seoDescription:
      `${f.name} earns its floor by replacing tools. Name the subscriptions you will cancel in sixty days, total them, and compare — includes the weak-fit cases.`,
    sections: [
      {
        id: "keap-worth-consolidation-math",
        heading: "List what you will cancel, with dates",
        body:
          `Write your current stack with monthly costs: email platform, payment links, scheduling, whatever automation you bolted on. Beside each one write a cancellation date, or write "keeping". ` +
          `Now total only the ones with dates. That total is what you are comparing against, and it is the only comparison that matters, because the floor here is priced as a replacement for several tools rather than as one more subscription. ` +
          `Teams who cannot fill in two cancellation dates are, in practice, adding cost and calling it consolidation.`,
      },
      {
        id: "keap-worth-single-operator",
        heading: "Where it is worth it, and where the floor beats you",
        body:
          `Worth it when one small team runs marketing and sales together and is currently paying separately for email, payments, and follow-up automation — the advantage is that a purchase, an invoice, and a follow-up sequence sit in the same place, so nobody maintains integrations between three tools. ` +
          `Weak fit for a solo operator who only needs a pipeline: the base includes licences and capability well beyond that need, and a lightweight CRM will do the job for a fraction. ${positioning} ` +
          `It is also a poor fit where the existing stack genuinely works — replacing working tools to reach tidiness is an expensive aesthetic.`,
      },
      {
        id: "keap-worth-commitment",
        heading: "The commitment changes the risk calculation",
        body:
          `${term} A term commitment means the wrong answer costs you more than a month, so the diligence bar is higher than for a tool you can cancel on a whim. ` +
          `There is also real implementation complexity in the consolidation itself: migrating payment flows and live campaigns is a data mapping exercise with customer-visible failure modes, and it needs a fortnight of someone's attention rather than an evening. ` +
          `Do that work before the term starts, not after, so the review at month three is about outcomes rather than half-finished setup.`,
        tip: "Two cancellation dates on paper, or the answer is no.",
      },
    ],
    directAnswer: {
      body: `${f.name} is worth it when you can name at least two subscriptions you will cancel within sixty days and their combined cost approaches the entry floor — it is not worth it as an addition to a working stack.`,
      bullets: [
        "Best for small teams running marketing, payments, and sales follow-up together",
        "Weak fit for a solo operator who needs a pipeline and nothing else",
        term,
      ],
    },
    framework: {
      title: "The subtraction test",
      steps: [
        { id: "keap-worth-1", label: "List every current tool with its monthly cost" },
        { id: "keap-worth-2", label: "Write a cancellation date beside each, or write \"keeping\"" },
        { id: "keap-worth-3", label: "Total only the tools with real cancellation dates" },
        { id: "keap-worth-4", label: "Compare that total against the entry floor, then decide" },
      ],
    },
    mistakes: {
      title: "How this decision goes wrong",
      items: [
        {
          title: "Calling an addition a consolidation",
          body: "Without cancellation dates, the new floor sits on top of your existing spend rather than replacing it.",
        },
        {
          title: "Buying it as a lightweight pipeline CRM",
          body: positioning,
        },
        {
          title: "Starting the term before doing the migration work",
          body: "Payment flows and live campaigns are customer-visible. Migrate first, then start counting the term.",
        },
      ],
    },
    steps: [
      {
        heading: "Build the cancellation list with real dates",
        body:
          `A date makes it accountable. "Probably the email tool eventually" is not a saving; "email platform, cancelled 30 November" is. ` +
          `Two dated cancellations is the practical threshold where consolidation stops being a story and starts being arithmetic.`,
      },
      {
        heading: "Rebuild your most important customer flow in the trial",
        body:
          `Pick the flow that touches money — a purchase that triggers a receipt and a follow-up sequence — and build it end to end before committing. ` +
          `This is the flow that will hurt if it breaks during migration, so it is also the one whose fit you most need to prove in advance.`,
        tip: "Test the money flow first; everything else can be rebuilt calmly.",
      },
      {
        heading: "Schedule the consolidation fortnight before the term begins",
        body:
          `Block the time and name the owner. Moving email, payments, and follow-up together is a genuine project with a customer-visible edge, and the teams who regret this purchase are usually the ones who started the annual term with the migration half-done. ` +
          `Then diary the month-three review against the cancelled-subscription list you wrote at the start.`,
      },
    ],
    checklist: [
      {
        label: "At least two dated cancellations on the list",
        description: "Dated cancellations are the difference between consolidation and addition.",
      },
      {
        label: "Money-touching flow rebuilt in the trial",
        description: "Prove the flow that has customer-visible failure modes before committing.",
      },
      {
        label: "Consolidation fortnight scheduled with a named owner",
        description: "Finish the migration before the term starts, then review at month three.",
      },
    ],
  };
};

/* ================================================================== *
 * 13. capsule-plans — read the four quotas
 * ================================================================== */

const capsulePlans: PageBuilder = (f0) => {
  const f = requireFacts(f0, "capsule-plans");
  const quotas = fallbackLimitation(f, /limits scale strictly/i, 0);
  const gating = fallbackLimitation(f, /Workflow automations/i, 1);
  const boundary = fallbackLimitation(f, /marketing automation|sales-engagement/i, 2);
  return {
    enrichmentType: "COST_GUIDE",
    uniqueValueAdded: [
      "pricing_comparison",
      "decision_framework",
      "limitations_evidence",
      "buyer_checklist",
      "scenario_analysis",
    ],
    lens: "quota ladder — four numbers decide the tier",
    summary:
      `${f.name} tiers are a quota ladder rather than a feature narrative. ${quotas} ` +
      `Published rungs: ${f.ladder}. Which means you can pick your tier arithmetically: check contacts, pipelines, custom fields, and users against each rung, and stop at the first one that holds all four. ` +
      `Only one capability question sits on top of that: ${gating}`,
    seoTitle: "Capsule Plans: A Quota Ladder, Not a Feature Story",
    seoDescription:
      `Pick a ${f.name} tier by checking four quotas — contacts, pipelines, custom fields, users — then one capability question. ${gating}`,
    sections: [
      {
        id: "capsule-plans-four-quotas",
        heading: "Four numbers, checked in order",
        body:
          `${quotas} So write your four numbers down before you look at any rung: how many contacts you will actually keep, how many pipelines you genuinely run, how many custom fields your reports depend on, and how many people need a login. ` +
          `Then walk up the ladder and stop at the first rung that holds all four. This takes five minutes and is more reliable than comparing feature bullets, because the constraint that will bite you is almost always a quota rather than a missing feature. ` +
          `The free rung is a real starting point for a very small team, but its user and contact caps are tight enough that most teams pass it inside a year.`,
      },
      {
        id: "capsule-plans-capability-rungs",
        heading: "The one capability step that is worth planning for",
        body:
          `${gating} That is the single place where the ladder stops being about volume and starts being about what the software does for you. ` +
          `The pricing threshold to watch, then, is the point where you want the system to do something on a schedule instead of a person doing it on a Tuesday — a task created automatically when a deal changes stage, for instance. ` +
          `You gain that automation at the cost of a higher per-seat rate across your whole team, so it is worth naming the specific repeated action first; a vague desire for automation does not survive that arithmetic.`,
      },
      {
        id: "capsule-plans-scope-boundary",
        heading: "What this deliberately is not",
        body:
          `${boundary} That boundary is the reason the tiers stay legible: you are buying a well-kept contact and pipeline record, not a campaign platform wearing a CRM badge. ` +
          `Weak fit if your plan for next quarter is behavioural email journeys — you would be pairing this with a dedicated sending tool anyway, so budget for both rather than expecting one to become the other. ` +
          `Migration in is usually simple because the data model is small; migration out later is likewise cheap, which is a genuine and underrated advantage when you are not yet sure what you will need.`,
        tip: "Count custom fields honestly — the reports you already rely on define that number.",
      },
    ],
    directAnswer: {
      body: `Choose a ${f.name} rung by checking contacts, pipelines, custom fields, and users against each tier and stopping at the first that holds all four — then check whether you need the rung where workflow automation begins.`,
      bullets: [
        "Best for small teams who want a well-kept pipeline without administration overhead",
        quotas,
        boundary,
      ],
    },
    framework: {
      title: "Walk the quota ladder",
      steps: [
        { id: "capsule-plans-1", label: "Write your four numbers: contacts, pipelines, custom fields, users" },
        { id: "capsule-plans-2", label: "Stop at the first rung that holds all four" },
        { id: "capsule-plans-3", label: "Name the one repeated action you want automated, if any" },
        { id: "capsule-plans-4", label: "Budget separately for email campaigns if that is in the plan" },
      ],
    },
    mistakes: {
      title: "Where the quota ladder trips buyers",
      items: [
        {
          title: "Choosing on features and getting caught by a quota",
          body: quotas,
        },
        {
          title: "Upgrading everyone for automation nobody has specified",
          body: "Name the repeated action first. Per-seat rates apply across the whole team.",
        },
        {
          title: "Expecting campaign tooling",
          body: boundary,
        },
      ],
    },
    steps: [
      {
        heading: "Write the four numbers before you open the pricing page",
        body:
          `Contacts you will keep, pipelines you run, custom fields your reports read, people who need logins. Four numbers on one line. ` +
          `Doing this first stops you from being sold a rung by a feature list, because the ladder is genuinely built around these quotas and nothing else moves as reliably.`,
      },
      {
        heading: "Name the repeated action you want the system to take",
        body:
          `"Create a follow-up task whenever a deal enters negotiation" is a specification. "Better automation" is not. ` +
          `One named action justifies the rung where workflow automation begins; zero named actions means stay lower and revisit in a quarter with evidence.`,
        tip: "Write the automation as a sentence with a trigger and an action, or skip it.",
      },
      {
        heading: "Decide where campaign email will live, and budget for it",
        body:
          `Because this is deliberately not a campaign platform, your email programme needs a home. Choose the sending tool now and add its cost to the comparison. ` +
          `Buyers who skip this step compare a CRM-only price against an all-in-one price and reach a conclusion the numbers do not support.`,
      },
    ],
    checklist: [
      {
        label: "Four quota numbers written on one line",
        description: "Contacts, pipelines, custom fields, users — the ladder is built on these.",
      },
      {
        label: "Automation named as a trigger-and-action sentence",
        description: "One named action, or stay on the lower rung.",
      },
      {
        label: "Campaign email tool chosen and costed separately",
        description: "This is a pipeline record, not a sending platform. Compare like with like.",
      },
    ],
  };
};

/* ================================================================== *
 * 14. is-capsule-worth-it — the deliberate ceiling
 * ================================================================== */

const isCapsuleWorthIt: PageBuilder = (f0) => {
  const f = requireFacts(f0, "is-capsule-worth-it");
  const quotas = fallbackLimitation(f, /limits scale strictly/i, 0);
  const boundary = fallbackLimitation(f, /marketing automation|sales-engagement/i, 2);
  return {
    enrichmentType: "DECISION_GUIDE",
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "a deliberate ceiling is a feature when nobody administers software",
    summary:
      `The interesting thing about ${f.name} is that its ceiling is deliberate, and for some teams that is the reason to choose it. ` +
      `${trimPeriod(f.shortDescription)} — the promise is that nobody has to become an administrator. So the worth-it question is really a question about your team: is your risk under-adoption of something complicated, or outgrowing something simple? ` +
      `If it is the former, a legible tool used daily beats a powerful one used weekly. If it is the latter, note the documented boundary: ${boundary}`,
    seoTitle: "Is Capsule Worth It? When a Deliberate Ceiling Helps",
    seoDescription:
      `${f.name} trades depth for legibility. Worth it when your risk is under-adoption; weak fit when you need campaigns or heavy automation this year.`,
    sections: [
      {
        id: "capsule-worth-adoption-risk",
        heading: "Which failure are you more likely to have?",
        body:
          `Two failure modes, and they pull in opposite directions. The first is buying something capable that the team quietly stops updating, so your forecast returns to a spreadsheet within a quarter. The second is buying something simple and hitting its ceiling in month eight. ` +
          `Small teams with nobody in an admin role overwhelmingly hit the first. This product is worth it precisely when that is your risk, because the whole design removes reasons not to update a record. ` +
          `Judge it on daily updates by real people, then — not on a feature comparison it will lose.`,
      },
      {
        id: "capsule-worth-scenarios",
        heading: "Two teams, two answers",
        body:
          `A four-person consultancy where the founders sell between delivery work: worth it. The advantage is that a pipeline they can update from a phone between meetings actually stays current, and nothing in it needs configuring first. ` +
          `A ten-person team running outbound sequences and behavioural email: weak fit. ${boundary} You would be adding a sequencing tool and a sending platform, and at that point a CRM with those capabilities native is the more honest comparison. ` +
          `The dividing line is not company size, it is whether anyone owns software configuration as part of their job.`,
      },
      {
        id: "capsule-worth-ceiling-check",
        heading: "Check the ceiling before you commit, not after",
        body:
          `${quotas} That is a limitation you can plan around when you know your numbers, and one that surprises you if you do not. Check contacts, pipelines, and custom fields against the rung you intend to buy. ` +
          `The consolation is that leaving is genuinely cheap: a small data model means low switching cost and a straightforward data mapping exercise if you outgrow it, which is the opposite of the platform lock-in you accept elsewhere. ` +
          `That asymmetry is worth pricing into the decision — choosing this is a reversible choice, and reversible choices deserve less deliberation.`,
        tip: "Reversible decisions deserve less analysis. Spend the time you save on adoption.",
      },
    ],
    directAnswer: {
      body: `${f.name} is worth it when your real risk is a CRM nobody updates — legibility beats depth in that situation — and it is a weak fit when campaigns, sequences, or heavy automation are on this year's plan.`,
      bullets: [
        "Ideal for small teams with nobody in a software-administration role",
        "Judge it on daily record updates, not on feature-count comparisons",
        boundary,
      ],
    },
    framework: {
      title: "Adoption risk versus ceiling risk",
      steps: [
        { id: "capsule-worth-1", label: "Decide which failure is likelier: under-adoption or outgrowing" },
        { id: "capsule-worth-2", label: "Check whether anyone owns software configuration as part of their job" },
        { id: "capsule-worth-3", label: "Check your contact, pipeline, and custom-field numbers against the rung" },
        { id: "capsule-worth-4", label: "Confirm nothing on this year's plan needs campaign or sequencing tooling" },
      ],
    },
    mistakes: {
      title: "Misjudgements about simple CRMs",
      items: [
        {
          title: "Comparing it on feature count",
          body: "It will lose that comparison and still be the better purchase for a team with no administrator.",
        },
        {
          title: "Expecting it to run campaigns",
          body: boundary,
        },
        {
          title: "Ignoring the quota you are closest to",
          body: quotas,
        },
      ],
    },
    steps: [
      {
        heading: "Answer the failure-mode question out loud",
        body:
          `Ask the team: in twelve months, is it more likely that we stopped updating the CRM, or that we hit its limits? Their answer is usually immediate and usually honest. ` +
          `Everything else in this decision follows from it, and no demo will change it.`,
      },
      {
        heading: "Check the two quotas you are nearest",
        body:
          `You are rarely close to all four at once. Find the two you are nearest — commonly contacts and custom fields — and check them against the rung you plan to buy. ` +
          `Now you know your headroom in months rather than in vague reassurance, which is what makes the ceiling a plan rather than a surprise.`,
        tip: "Headroom measured in months beats headroom described as \"plenty\".",
      },
      {
        heading: "Confirm the year ahead does not need campaign tooling",
        body:
          `Read your own plan for the next four quarters and look for behavioural email, outbound sequences, or lead scoring. If any of those appear, price the extra tool now or reconsider the shortlist. ` +
          `The mistake is not choosing a simple CRM; it is choosing one while planning work it was never built to do.`,
      },
    ],
    checklist: [
      {
        label: "Failure-mode question answered by the team",
        description: "Under-adoption or outgrowing — this single answer drives the decision.",
      },
      {
        label: "Nearest two quotas checked against the intended rung",
        description: "Headroom expressed in months, not in reassurance.",
      },
      {
        label: "Year-ahead plan checked for campaign or sequencing work",
        description: "If it appears, cost the additional tool before comparing.",
      },
    ],
  };
};

/* ================================================================== *
 * 15. closely-plans — sender seats × credit bundles
 * ================================================================== */

const closelyPlans: PageBuilder = (f0) => {
  const f = requireFacts(f0, "closely-plans");
  const notCrm = fallbackLimitation(f, /not a CRM|CRM deal-pipeline/i, 0);
  const gating = fallbackLimitation(f, /gated by LinkedIn sender seats/i, 1);
  const bonusCredits = fallbackLimitation(f, /Bonus enrichment/i, 2);
  const policyRisk = fallbackLimitation(f, /platform-policy|compliance risk/i, 3);
  return {
    enrichmentType: "COST_GUIDE",
    uniqueValueAdded: [
      "pricing_comparison",
      "decision_framework",
      "limitations_evidence",
      "buyer_checklist",
      "scenario_analysis",
    ],
    lens: "sender seats multiplied by credit bundles; not a CRM",
    summary:
      `Start with what you are not buying: ${notCrm} ${f.name} sits beside your CRM as an outbound engine, and it must not become the place your deals live. ` +
      `What you are buying is two things multiplied together: ${gating} Published rungs: ${f.ladder}. ` +
      `So your tier is decided by how many LinkedIn senders you will genuinely warm and operate — not by team size, and not by contact volume.`,
    seoTitle: "Closely Plans: Sender Seats and Credit Bundles",
    seoDescription:
      `${f.name} tiers are gated by LinkedIn sender seats and credit bundles. ${notCrm} Price the senders you can actually operate.`,
    sections: [
      {
        id: "closely-plans-sender-math",
        heading: "Count senders you can operate, not senders you could buy",
        body:
          `${gating} A sender seat is not a licence you park — it is a LinkedIn account someone has to warm, monitor, and reply from. ` +
          `So the honest count is the number of accounts your team will actually run conversations out of this quarter. Buying three senders and operating one leaves you paying for capacity while your reply rate stays flat. ` +
          `This is the opposite instinct to seat-based CRM pricing, where an extra seat is harmless. Here an unused sender is both wasted spend and a dormant account.`,
      },
      {
        id: "closely-plans-credit-bundles",
        heading: "The credit bundle is the second half of the price",
        body:
          `${bonusCredits} Credits are consumed by enrichment and AI features, which means your monthly cost has a usage component that scales with prospecting volume rather than headcount. ` +
          `The trade-off between rungs is therefore not "more features" but "more senders plus more included credits" — and you should decide which of the two you are actually short of. ` +
          `A team with one sender and heavy enrichment needs has a different upgrade path from a team with three senders and modest data needs, and the ladder does not separate them for you.`,
      },
      {
        id: "closely-plans-risk-and-boundary",
        heading: "The two constraints to price in before you commit",
        body:
          `First, the category risk: ${policyRisk} That is an operational cost — account warm-up discipline, conservative volumes, a plan for a restricted account — and it belongs in the budget as attention rather than as a line item. ` +
          `Second, the boundary: ${notCrm} Keep your pipeline in the CRM and let this own the conversation-starting. Teams who let deals accumulate in an outbound tool end up with a data mapping problem and a forecast nobody trusts. ` +
          `Unlike a CRM, which you buy for years, this is a channel tool whose value depends on the channel staying viable — so review it quarterly rather than annually.`,
        tip: "One warm sender beats three cold ones. Buy the seats you can operate.",
      },
    ],
    directAnswer: {
      body: `Price ${f.name} by the number of LinkedIn senders you will genuinely warm and operate, then by the credit bundle your enrichment volume needs — and keep your pipeline in a CRM, because this is not a system of record.`,
      bullets: [
        "Built for outbound teams running LinkedIn and email sequences together",
        gating,
        notCrm,
      ],
    },
    framework: {
      title: "Senders × credits",
      steps: [
        { id: "closely-plans-1", label: "Count the LinkedIn accounts you will actually operate this quarter" },
        { id: "closely-plans-2", label: "Estimate monthly enrichment and AI credit consumption" },
        { id: "closely-plans-3", label: "Decide which you are short of: senders or credits" },
        { id: "closely-plans-4", label: "Confirm the CRM of record stays outside this tool" },
      ],
    },
    mistakes: {
      title: "Outbound tooling mistakes",
      items: [
        {
          title: "Buying sender seats nobody will warm",
          body: "A dormant sender costs money and produces no replies. Operate one well before adding a second.",
        },
        {
          title: "Ignoring credit consumption",
          body: bonusCredits,
        },
        {
          title: "Letting deals live here",
          body: notCrm,
        },
      ],
    },
    steps: [
      {
        heading: "Name the humans behind each sender account",
        body:
          `Every sender needs a name beside it — the person who will read and answer the replies. If a sender has no name, it is not a sender, it is a subscription. ` +
          `This exercise usually reduces the intended plan by one rung, which is the cheapest optimisation available in outbound tooling.`,
      },
      {
        heading: "Estimate credit burn from last quarter's prospecting",
        body:
          `Take the number of prospects you actually enriched and contacted last quarter and use that as your monthly baseline rather than the target in your plan. ` +
          `Credit consumption tracks activity, and activity is more honest in hindsight than in a forecast.`,
        tip: "Budget credits from last quarter's real activity, not this quarter's ambition.",
      },
      {
        heading: "Write down where the pipeline lives, and enforce it",
        body:
          `One line, shared with the team: deals live in the CRM; this tool starts conversations and hands them over. ` +
          `Also write the channel-risk plan in the same place — warm-up pace, daily caps, what happens if an account gets restricted — because that plan is the difference between a channel and an incident.`,
      },
    ],
    checklist: [
      {
        label: "Every sender seat has a named human who reads replies",
        description: "Unnamed senders are subscriptions, not senders.",
      },
      {
        label: "Credit baseline taken from last quarter's real activity",
        description: "Usage-based cost needs a usage-based estimate.",
      },
      {
        label: "System of record stated in writing: the CRM, not this tool",
        description: "Plus a written warm-up and restricted-account plan.",
      },
    ],
  };
};

/* ================================================================== *
 * 16. is-closely-worth-it — price the channel risk
 * ================================================================== */

const isCloselyWorthIt: PageBuilder = (f0) => {
  const f = requireFacts(f0, "is-closely-worth-it");
  const notCrm = fallbackLimitation(f, /not a CRM|CRM deal-pipeline/i, 0);
  const policyRisk = fallbackLimitation(f, /platform-policy|compliance risk/i, 3);
  return {
    enrichmentType: "DECISION_GUIDE",
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "channel viability first, tooling second",
    summary:
      `This decision is about a channel before it is about software. ${policyRisk} ` +
      `So ${f.name} is worth it only if two things are already true: LinkedIn is a channel where your buyers genuinely answer, and you have somewhere else for deals to live, because this is explicitly ${inlineClause(notCrm)}. ` +
      `Where both hold, an outbound engine that runs LinkedIn and email in one sequence removes real coordination work. Where either fails, no plan on the ladder helps.`,
    seoTitle: "Is Closely Worth It? Price the Channel Risk First",
    seoDescription:
      `${f.name} is worth it when LinkedIn genuinely converts for your buyers and your CRM stays the system of record. Includes the compliance and weak-fit cases.`,
    sections: [
      {
        id: "closely-worth-channel-evidence",
        heading: "Prove the channel by hand before you automate it",
        body:
          `Send thirty manual LinkedIn messages to your actual target buyers this week and count the replies. That number, not a vendor case study, tells you whether automation is worth buying. ` +
          `Automation multiplies whatever your manual reply rate is; multiplying zero produces zero at scale, plus a restricted account. ` +
          `It is worth it when the manual test shows real conversations happening, because then the tool is buying you volume on something that already works rather than hope on something that does not.`,
      },
      {
        id: "closely-worth-risk-budget",
        heading: "The risk you are accepting, stated plainly",
        body:
          `${policyRisk} An agency running client accounts carries that risk on someone else's behalf, which raises the bar further. ` +
          `Treat it as a budget: conservative daily volumes, a warm-up period per sender, and a written answer to "what do we do if an account is restricted mid-campaign". ` +
          `Unlike an email-only sequencer, where a bounced domain is recoverable with effort, a restricted social account can remove a channel from a specific person for a while, so the mitigation belongs in the decision rather than in the retrospective.`,
      },
      {
        id: "closely-worth-record-boundary",
        heading: "Weak fit cases, and the boundary that keeps it useful",
        body:
          `Poor fit: a team without a CRM. ${notCrm} Buying an outbound engine before you have a system of record means conversations start and then evaporate, which is worse than not starting them. ` +
          `Also a weak fit where your buyers are not reachable on LinkedIn at all — trades, local services, some public-sector buying. The tool is excellent at a channel that is simply not yours. ` +
          `Where it fits, the use-case recommendation is narrow and useful: choose it for outbound teams that need multi-channel sequencing with enrichment attached, and keep pipeline, forecast, and history in the CRM.`,
        tip: "Thirty manual messages this week is a cheaper experiment than a quarter's subscription.",
      },
    ],
    directAnswer: {
      body: `${f.name} is worth it when a manual test shows your buyers actually reply on LinkedIn and your CRM remains the system of record — it is not worth it as a first sales tool or where the channel is unproven.`,
      bullets: [
        "Best for outbound teams already getting replies from manual LinkedIn outreach",
        notCrm,
        "Accept and plan for platform-policy risk before you scale volume",
      ],
    },
    framework: {
      title: "Channel test, then tooling",
      steps: [
        { id: "closely-worth-1", label: "Send thirty manual messages to real target buyers and count replies" },
        { id: "closely-worth-2", label: "Confirm a CRM already holds your pipeline and history" },
        { id: "closely-worth-3", label: "Write the warm-up pace and restricted-account contingency" },
        { id: "closely-worth-4", label: "Only then choose a rung based on senders you can operate" },
      ],
    },
    mistakes: {
      title: "Why teams regret outbound automation",
      items: [
        {
          title: "Automating an unproven channel",
          body: "Automation multiplies your manual reply rate. Test the rate first, cheaply, by hand.",
        },
        {
          title: "Buying it before a CRM exists",
          body: notCrm,
        },
        {
          title: "No contingency for a restricted account",
          body: policyRisk,
        },
      ],
    },
    steps: [
      {
        heading: "Run the thirty-message manual test",
        body:
          `Same buyers, same message you would automate, sent by hand over a week. Count replies and count how many became conversations. ` +
          `This is the whole evidence base for the decision and it costs you an hour. Teams who skip it are buying volume for a message that has never worked.`,
      },
      {
        heading: "Confirm the record boundary is already solved",
        body:
          `Point at the system where a reply becomes a tracked opportunity. If you cannot point at one, fix that first — a CRM before an outbound engine, in that order. ` +
          `Conversations you cannot follow up systematically are not pipeline; they are noise with a good open rate.`,
        tip: "A reply with nowhere to go is a wasted reply.",
      },
      {
        heading: "Write the risk plan on one page before scaling",
        body:
          `Warm-up pace per sender, daily connection and message caps, who notices a restriction, and what campaign pauses when one happens. ` +
          `One page, agreed in advance. This is the difference between a channel you operate and an incident you explain, and it is the part of this decision that is genuinely yours rather than the vendor's.`,
      },
    ],
    checklist: [
      {
        label: "Thirty-message manual test completed with replies counted",
        description: "Automation multiplies your manual rate — measure it first.",
      },
      {
        label: "CRM confirmed as the system of record",
        description: "This tool starts conversations; it does not hold your pipeline.",
      },
      {
        label: "One-page risk plan written before scaling volume",
        description: "Warm-up pace, daily caps, and a restricted-account contingency.",
      },
    ],
  };
};

/* ================================================================== *
 * 17. lusha-plans — a credit budget, not a seat budget
 * ================================================================== */

const lushaPlans: PageBuilder = (f0) => {
  const f = requireFacts(f0, "lusha-plans");
  const notCrm = fallbackLimitation(f, /Not a full CRM/i, 0);
  const creditModel = fallbackLimitation(f, /Credit-based|roll over/i, 1);
  const apiGating = fallbackLimitation(f, /API access/i, 2);
  const phoneCost = fallbackLimitation(f, /Phone reveals/i, 3);
  return {
    enrichmentType: "COST_GUIDE",
    uniqueValueAdded: [
      "pricing_comparison",
      "decision_framework",
      "limitations_evidence",
      "buyer_checklist",
      "scenario_analysis",
    ],
    lens: "credit budget, expiry risk, and quote-only paid tiers",
    summary:
      `${f.name} is budgeted in credits, not seats, and that changes every part of the exercise. ${creditModel} ` +
      `Published tiers: ${f.ladder} — note how many are quote-only, which means your real comparison happens in a sales conversation rather than on a pricing page. ` +
      `Two consumption facts belong in the plan before that conversation: ${phoneCost} And the boundary: ${notCrm}`,
    seoTitle: "Lusha Plans: Budget Credits, Not Seats",
    seoDescription:
      `${f.name} is priced on credit consumption with quote-only paid tiers. ${creditModel} Phone reveals cost more than emails — plan the mix.`,
    sections: [
      {
        id: "lusha-plans-credit-budget",
        heading: "Build a consumption forecast, not a seat count",
        body:
          `Seat-based tools let you estimate cost from headcount. This one does not: ${creditModel} The expiry detail matters more than it looks, because it turns over-buying into a genuine loss rather than a harmless buffer. ` +
          `So forecast conservatively from real activity: how many contacts did your team actually reveal last quarter? Use that, then add a modest margin. ` +
          `The cost ceiling here is set by your prospecting volume, and unlike a seat licence it moves month to month — which is why a quarterly review beats an annual assumption.`,
      },
      {
        id: "lusha-plans-reveal-mix",
        heading: "The reveal mix quietly decides your bill",
        body:
          `${phoneCost} That single fact is the most actionable thing in this decision. A team that dials heavily has a completely different consumption profile from one that sends email, at identical headcount. ` +
          `So write your intended mix down — what proportion of prospects need a phone number rather than an email — before you size a bundle. ` +
          `The workflow advantage of budgeting this way is that reps stop revealing phone numbers reflexively; they reveal them for accounts where a call is the plan, which is both cheaper and better practice.`,
      },
      {
        id: "lusha-plans-gating-and-boundary",
        heading: "Plan gating and the system-of-record boundary",
        body:
          `${apiGating} If your intention is to enrich records automatically inside your CRM rather than manually in a browser, that intention selects your tier — check it before comparing, because it is not a feature you can add cheaply later. ` +
          `And keep the boundary clear: ${notCrm} This is a data layer. It improves the records in your CRM; it does not replace the CRM, and treating it as one leaves you with enriched contacts and no pipeline. ` +
          `Because paid tiers are quote-only, go into the conversation with your consumption forecast, your reveal mix, and your integration requirement already written — that is what turns a quote into a comparison.`,
        tip: "Bring your consumption forecast to the sales call — quote-only pricing rewards prepared buyers.",
      },
    ],
    directAnswer: {
      body: `Budget ${f.name} from a credit consumption forecast based on last quarter's real reveals, with your phone-versus-email mix written down — paid tiers are quote-only, so arrive with numbers.`,
      bullets: [
        "Built as a data layer beside your CRM, not as a CRM",
        creditModel,
        phoneCost,
      ],
    },
    framework: {
      title: "Consumption-first budgeting",
      steps: [
        { id: "lusha-plans-1", label: "Count contacts actually revealed last quarter" },
        { id: "lusha-plans-2", label: "Write your intended phone-versus-email reveal mix" },
        { id: "lusha-plans-3", label: "Decide whether automated CRM enrichment via API is required" },
        { id: "lusha-plans-4", label: "Take all three numbers into the quote conversation" },
      ],
    },
    mistakes: {
      title: "Credit-model mistakes",
      items: [
        {
          title: "Over-buying credits as a buffer",
          body: creditModel,
        },
        {
          title: "Ignoring the phone-versus-email mix",
          body: phoneCost,
        },
        {
          title: "Assuming API access comes with any paid tier",
          body: apiGating,
        },
      ],
    },
    steps: [
      {
        heading: "Pull last quarter's real reveal count",
        body:
          `Not the target, the actual. Most teams reveal considerably fewer contacts than their prospecting plan implies, and the gap is where over-bought credits go to expire. ` +
          `Start from the real number and add a deliberate, small margin you can name.`,
      },
      {
        heading: "Write the phone-versus-email split as a percentage",
        body:
          `"Seventy per cent email, thirty per cent phone" is a budget input. It also becomes a working rule for the team, which is the point: phone numbers get revealed for accounts you intend to call, not reflexively. ` +
          `Two teams of the same size with different splits should not buy the same bundle.`,
        tip: "Reveal a phone number when a call is the plan — not as a habit.",
      },
      {
        heading: "Settle the integration requirement before the quote call",
        body:
          `Decide now whether enrichment happens automatically against your CRM or manually by a rep in a browser, because automated enrichment is plan-gated and that changes which tiers are even candidates. ` +
          `Arrive at the quote conversation with the reveal count, the mix, and the integration answer. Quote-only pricing favours the side with the numbers, so bring them.`,
      },
    ],
    checklist: [
      {
        label: "Last quarter's actual reveal count recorded",
        description: "Unused annual credits do not roll over — forecast from reality.",
      },
      {
        label: "Phone-versus-email reveal mix written as percentages",
        description: "Phone reveals consume more credits; the mix sizes the bundle.",
      },
      {
        label: "Integration requirement decided before the quote call",
        description: "Automated CRM enrichment is plan-gated, not universal.",
      },
    ],
  };
};

/* ================================================================== *
 * 18. is-lusha-worth-it — cost per connected conversation
 * ================================================================== */

const isLushaWorthIt: PageBuilder = (f0) => {
  const f = requireFacts(f0, "is-lusha-worth-it");
  const notCrm = fallbackLimitation(f, /Not a full CRM/i, 0);
  const creditModel = fallbackLimitation(f, /Credit-based|roll over/i, 1);
  const phoneCost = fallbackLimitation(f, /Phone reveals/i, 3);
  return {
    enrichmentType: "DECISION_GUIDE",
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "one metric: cost per connected conversation",
    summary:
      `There is one honest metric for a contact-data purchase, and it is not accuracy rate: it is cost per connected conversation. ` +
      `Take the credits a conversation consumes end to end — the reveals that went nowhere included — and compare that against what a conversation is worth to you. ${f.name} is worth it when that ratio is comfortable and getting better as reps learn restraint. ` +
      `It is not worth it when contact data was never the bottleneck, and it is not a substitute for a pipeline: ${notCrm}`,
    seoTitle: "Is Lusha Worth It? Cost Per Connected Conversation",
    seoDescription:
      `Judge ${f.name} on cost per connected conversation rather than accuracy claims. Includes the case where data was never your bottleneck.`,
    sections: [
      {
        id: "lusha-worth-unit-metric",
        heading: "Compute the only number that settles this",
        body:
          `Run a bounded pilot: a fixed credit allowance, one rep, two weeks, one target segment. Count the conversations that actually happened — a human replying or answering, not a delivered email. ` +
          `Divide credits consumed by conversations achieved. That is your unit cost, including the reveals that led nowhere, which is exactly why it is more useful than any published accuracy figure. ` +
          `Worth it when that unit cost is comfortably below the value of a conversation in your pipeline. Not worth it when it is not, regardless of how good the data quality looks in isolation.`,
      },
      {
        id: "lusha-worth-bottleneck-check",
        heading: "Was contact data ever your bottleneck?",
        body:
          `Look at last quarter honestly. If your reps had lists they never finished working, data was not the constraint — capacity or message quality was, and better contact data will simply produce a longer unworked list. ` +
          `It is a poor fit in exactly that situation, and the symptom afterwards is credits expiring unused. ${creditModel} ` +
          `Where reps genuinely stalled because they could not reach the right person, the recommendation flips: this is precisely the constraint the product removes, and the unit-cost pilot will show it clearly within two weeks.`,
      },
      {
        id: "lusha-worth-discipline",
        heading: "The habit that decides whether it stays worth it",
        body:
          `${phoneCost} So the same subscription can be good value or poor value depending entirely on team behaviour — reveal a number because a call is planned, not because the button is there. ` +
          `Unlike a seat licence, which costs the same however it is used, this is a consumption purchase, so the cost curve is a management question rather than a procurement one. ` +
          `And keep the boundary firm: ${notCrm} Enriched contacts with no pipeline behind them is the most common way this spend produces nothing measurable.`,
        tip: "Re-run the unit-cost calculation at ninety days — it should be improving.",
      },
    ],
    directAnswer: {
      body: `${f.name} is worth it when a bounded pilot shows a cost per connected conversation you would happily pay again — it is not worth it if your reps already have lists they never finish working.`,
      bullets: [
        "Ideal when reps stall because they cannot reach the right person",
        "Weak fit when capacity or messaging, not data, is the constraint",
        notCrm,
      ],
    },
    framework: {
      title: "The bounded pilot",
      steps: [
        { id: "lusha-worth-1", label: "Fix a credit allowance, one rep, two weeks, one segment" },
        { id: "lusha-worth-2", label: "Count real conversations, not sends or deliveries" },
        { id: "lusha-worth-3", label: "Divide credits consumed by conversations achieved" },
        { id: "lusha-worth-4", label: "Compare that unit cost against the value of a conversation" },
      ],
    },
    mistakes: {
      title: "How data-tool purchases disappoint",
      items: [
        {
          title: "Judging on accuracy claims instead of unit cost",
          body: "Accuracy is an input. Cost per connected conversation is the outcome you are actually buying.",
        },
        {
          title: "Buying data when capacity was the constraint",
          body: "A longer list does not help a rep who could not finish the last one.",
        },
        {
          title: "Letting reveal habits run unmanaged",
          body: phoneCost,
        },
      ],
    },
    steps: [
      {
        heading: "Run the two-week bounded pilot",
        body:
          `One rep, one segment, a fixed allowance, and a hard stop. Bounded pilots produce a number; open-ended trials produce opinions. ` +
          `Write the allowance down before starting so nobody is tempted to top it up mid-pilot and quietly ruin the measurement.`,
      },
      {
        heading: "Count conversations, and be strict about the definition",
        body:
          `A conversation is a human responding. Not a delivered email, not a connection accepted, not a voicemail. Strictness here is what makes the unit cost trustworthy. ` +
          `Then divide, and write the number somewhere you will find it again in ninety days.`,
        tip: "A voicemail is not a conversation, however satisfying the dial felt.",
      },
      {
        heading: "Set the reveal rule and re-measure at ninety days",
        body:
          `Agree the rule with the team: phone reveals happen when a call is scheduled, email reveals for sequences. Then recompute unit cost at ninety days. ` +
          `If the number is improving, the purchase is working as intended and reps are learning restraint. If it is flat and the pipeline has not moved, you have a clean, evidence-based reason to stop.`,
      },
    ],
    checklist: [
      {
        label: "Bounded pilot run with a fixed credit allowance",
        description: "One rep, one segment, two weeks, hard stop.",
      },
      {
        label: "Cost per connected conversation computed and recorded",
        description: "Human replies only — the strict definition is what makes it useful.",
      },
      {
        label: "Reveal rule agreed and a ninety-day re-measure diarised",
        description: "Consumption pricing makes this a management metric, not a procurement one.",
      },
    ],
  };
};

/* ================================================================== *
 * 19. pipedrive-plans — the activity floor and the add-on column
 * ================================================================== */

const pipedrivePlans: PageBuilder = (f0) => {
  const f = requireFacts(f0, "pipedrive-plans");
  const liteGap = fallbackLimitation(f, /Lite lacks/i, 0);
  const addOns = fallbackLimitation(f, /add-ons/i, 1);
  const topCaps = fallbackLimitation(f, /explicit caps/i, 2);
  const telephony = fallbackLimitation(f, /telephony/i, 3);
  return {
    enrichmentType: "COST_GUIDE",
    uniqueValueAdded: [
      "pricing_comparison",
      "decision_framework",
      "limitations_evidence",
      "buyer_checklist",
      "scenario_analysis",
    ],
    lens: "the entry rung is a demo tier; add-ons are a second column",
    summary:
      `Two structural facts decide a ${f.name} quote, and neither is a tier name. First, the entry rung is closer to a demonstration tier than a working one: ${liteGap} ` +
      `Second, several capabilities people assume are bundled are priced separately: ${addOns} Published ladder: ${f.ladder}. ` +
      `So build the quote as seats plus an add-on column, and expect your working baseline to sit a rung above the headline.`,
    seoTitle: "Pipedrive Plans: The Growth Activity Floor and Add-Ons",
    seoDescription:
      `${f.name} quotes need two columns: seats and add-ons. ${liteGap} Campaigns and Web Visitors are priced separately on every plan.`,
    sections: [
      {
        id: "pipedrive-plans-activity-floor",
        heading: "The working floor sits above the entry rung",
        body:
          `${liteGap} Read that as a floor rather than a limitation: an active sales team needs email sync and automation to run activity-based selling at all, so the entry rung mostly serves evaluation and very light use. ` +
          `Budget from the working rung and treat the cheaper one as a trial artefact. Teams who plan against the headline figure and then upgrade in month two have effectively mis-stated their own budget rather than been surprised by a price. ` +
          `The pricing threshold is therefore behavioural: the moment two reps are working the pipeline daily, you are at the working rung.`,
      },
      {
        id: "pipedrive-plans-addon-column",
        heading: "Add-ons are a second column, not a footnote",
        body:
          `${addOns} These are the capabilities buyers most often assume are included, because in bundled platforms they usually are. ` +
          `So write your quote as two columns — per-seat cost and add-ons — and total them separately, because they scale differently: seats scale with headcount and add-ons scale with ambition. ` +
          `You gain a genuinely focused pipeline tool at the cost of assembling the surrounding pieces yourself, which is the trade-off to state explicitly when comparing against an all-in-one suite whose single price includes things you may not want.`,
      },
      {
        id: "pipedrive-plans-top-and-telephony",
        heading: "What changes at the top, and what stays outside",
        body:
          `${topCaps} Worth knowing if you were assuming the highest rung means "no limits" — read the specific caps rather than the tier name. ` +
          `On capability boundaries: ${telephony} Unlike an all-in-one CRM that bundles dialling and scoring, the approach here is a focused pipeline core with marketplace apps around it, which is a weak fit if a native dialler is a hard requirement for your team. ` +
          `Where pipeline discipline is the requirement and calling is occasional, that same focus is the reason to choose it.`,
        tip: "Total seats and add-ons in separate columns — they scale on different drivers.",
      },
    ],
    directAnswer: {
      body: `Quote ${f.name} from the rung that includes email sync and automation, then add a separate column for add-ons like Campaigns and Web Visitors — the headline entry price is an evaluation tier, not a working one.`,
      bullets: [
        "Best for teams buying pipeline discipline and activity-based selling",
        liteGap,
        addOns,
      ],
    },
    framework: {
      title: "Two-column quoting",
      steps: [
        { id: "pipedrive-plans-1", label: "Start from the rung that includes email sync and workflow automation" },
        { id: "pipedrive-plans-2", label: "List required add-ons separately with their own total" },
        { id: "pipedrive-plans-3", label: "Read the explicit caps on the top rung rather than assuming none" },
        { id: "pipedrive-plans-4", label: "Check whether native dialling is a hard requirement before comparing" },
      ],
    },
    mistakes: {
      title: "Quoting mistakes to avoid",
      items: [
        {
          title: "Budgeting from the entry rung",
          body: liteGap,
        },
        {
          title: "Assuming Campaigns or Web Visitors are included",
          body: addOns,
        },
        {
          title: "Reading the top rung as unlimited",
          body: topCaps,
        },
      ],
    },
    steps: [
      {
        heading: "Start the quote at the working rung",
        body:
          `Write the per-seat figure for the rung that includes email sync and automation, times your real rep count. That is your baseline, and it is the number to compare against alternatives. ` +
          `Using the entry rung for comparison shopping produces a conclusion you will revise within a month.`,
      },
      {
        heading: "List the add-ons you will actually switch on",
        body:
          `Go through Campaigns, Web Visitors, lead-capture and document tooling and mark each as needed or not this year. Total the needed ones in their own column. ` +
          `Two columns keeps the comparison honest against bundled suites, where the same capabilities are inside one price and you may be paying for some you do not want.`,
        tip: "Mark add-ons \"this year\" or \"not this year\" — no maybes.",
      },
      {
        heading: "Test the dialling requirement before you commit",
        body:
          `If your team lives on the phone, run a week of real calling through the intended setup, including whichever marketplace app you would rely on. ` +
          `This is the one area where a focused pipeline tool asks you to assemble something, so prove the assembly works for your volume before it becomes the thing your reps do all day.`,
      },
    ],
    checklist: [
      {
        label: "Quote built from the rung with email sync and automation",
        description: "The entry rung is an evaluation tier for an active team.",
      },
      {
        label: "Add-ons listed and totalled in a separate column",
        description: "Seats scale with headcount; add-ons scale with ambition.",
      },
      {
        label: "Dialling requirement tested end to end if calling is central",
        description: "Native calling depth is limited compared with all-in-one suites.",
      },
    ],
  };
};

/* ================================================================== *
 * 20. is-pipedrive-worth-it — the discipline you are buying
 * ================================================================== */

const isPipedriveWorthIt: PageBuilder = (f0) => {
  const f = requireFacts(f0, "is-pipedrive-worth-it");
  const liteGap = fallbackLimitation(f, /Lite lacks/i, 0);
  const addOns = fallbackLimitation(f, /add-ons/i, 1);
  const telephony = fallbackLimitation(f, /telephony/i, 3);
  return {
    enrichmentType: "DECISION_GUIDE",
    uniqueValueAdded: [
      "decision_framework",
      "scenario_analysis",
      "limitations_evidence",
      "buyer_checklist",
    ],
    lens: "you are buying a discipline; only worth it if you adopt it",
    summary:
      `What you are actually buying here is a discipline, not a database. ${trimPeriod(f.shortDescription)} — the product is opinionated about activity-based selling, and it is worth it exactly to the degree that your team accepts that opinion. ` +
      `A team that agrees every deal must carry a scheduled next step gets compounding value. A team that wants a flexible database to model their own process will fight the opinion and lose the benefit. ` +
      `Practical caveat before comparing: ${liteGap}`,
    seoTitle: "Is Pipedrive Worth It? The Discipline You Are Buying",
    seoDescription:
      `${f.name} sells an opinion about activity-based selling. Worth it when your team adopts the next-step discipline; weak fit when you need a flexible database or native dialling.`,
    sections: [
      {
        id: "pipedrive-worth-discipline",
        heading: "The opinion, and whether your team will accept it",
        body:
          `The core idea is simple and slightly uncomfortable: a deal without a scheduled next activity is a deal that is quietly dying, and the interface will keep telling you so. ` +
          `That is the workflow advantage — the tool nags in the right direction, so pipeline hygiene happens continuously instead of in a Friday clean-up. ` +
          `It is worth it when your sales lead genuinely wants that discipline enforced. It is a weak fit when the team's real complaint is that they want fewer prompts and more flexibility, because then you have bought a coach nobody hired.`,
      },
      {
        id: "pipedrive-worth-two-teams",
        heading: "Two teams, opposite verdicts",
        body:
          `Three closers doing consultative deals with long cycles: strong fit. Every deal carries a next step, the board tells the lead what has gone quiet, and nobody has to build a report to find out. ` +
          `A team whose selling is mostly inbound phone volume with call outcomes driving everything: less comfortable. ${telephony} Unlike a suite that bundles dialling and scoring natively, this asks you to assemble that part, so choose accordingly. ` +
          `The dividing question is not company size but whether the unit of work is a scheduled activity or a completed call.`,
      },
      {
        id: "pipedrive-worth-real-cost",
        heading: "Judge it at the real price, including what sits outside",
        body:
          `Two adjustments before the comparison is fair. ${liteGap} — so evaluate at the working rung, since the entry rung will not show you the product a real team uses. ` +
          `And ${addOns} — if lead capture or campaigns are part of your plan, include them, because a per-seat-only comparison against a bundled suite understates your total. ` +
          `Then the migration question: moving in is straightforward, but the data mapping worth attention is activity history, which is precisely the data the discipline depends on. Import deals without their activity trail and the coaching value arrives late.`,
        tip: "Evaluate at the working rung with add-ons included, or the comparison is not real.",
      },
    ],
    directAnswer: {
      body: `${f.name} is worth it when your team will accept its opinion that every deal needs a scheduled next step — evaluate at the rung with email sync and automation, add-ons included, and skip it if you need a flexible database or native dialling.`,
      bullets: [
        "Ideal for small closing teams committing to activity-based selling",
        "Weak fit for inbound phone-led teams needing native dialling depth",
        "Evaluate at the working rung, not the entry rung",
      ],
    },
    framework: {
      title: "Will the discipline stick?",
      steps: [
        { id: "pipedrive-worth-1", label: "Ask whether every deal can carry a scheduled next step" },
        { id: "pipedrive-worth-2", label: "Check whether the sales lead wants that enforced or resented" },
        { id: "pipedrive-worth-3", label: "Decide if your unit of work is an activity or a completed call" },
        { id: "pipedrive-worth-4", label: "Evaluate at the working rung with required add-ons included" },
      ],
    },
    mistakes: {
      title: "Where this verdict goes wrong",
      items: [
        {
          title: "Buying the discipline without agreeing to it",
          body: "The prompts become noise, reps mute them, and you have paid for a coach nobody hired.",
        },
        {
          title: "Evaluating on the entry rung",
          body: liteGap,
        },
        {
          title: "Comparing per-seat cost against a bundled suite",
          body: addOns,
        },
      ],
    },
    steps: [
      {
        heading: "Ask the sales lead the next-step question directly",
        body:
          `"Are you willing to enforce that every open deal has a scheduled next activity?" A yes makes this a strong candidate. A hesitant answer predicts exactly how the trial will go. ` +
          `This is a management commitment more than a software preference, and it is better tested in a conversation than in a trial.`,
      },
      {
        heading: "Run two weeks with the discipline actually enforced",
        body:
          `Import a real slice of pipeline with its activity history and require the next-step rule for a fortnight. Watch whether the board goes green because work happened or because reps scheduled placeholder tasks. ` +
          `Placeholder tasks are the tell that the discipline has not been accepted, and no configuration fixes that.`,
        tip: "Placeholder next steps mean the discipline was declined, politely.",
      },
      {
        heading: "Recompute the price at the working rung with add-ons",
        body:
          `Add the working-rung seat cost and any add-ons you marked as needed this year, then compare that total against your alternatives. ` +
          `Comparisons made against the entry rung flatter this product; comparisons that include the add-on column are the ones you can defend at renewal.`,
      },
    ],
    checklist: [
      {
        label: "Sales lead has committed to the next-step rule",
        description: "A management commitment, tested in conversation before the trial.",
      },
      {
        label: "Two weeks run with real pipeline and activity history imported",
        description: "Watch for placeholder tasks — they signal a declined discipline.",
      },
      {
        label: "Price recomputed at the working rung with add-ons included",
        description: "Otherwise the comparison against bundled suites is not honest.",
      },
    ],
  };
};

/* ================================================================== *
 * Registry
 * ================================================================== */

const PAGE_BUILDERS: Record<string, PageBuilder> = {
  "zoho-crm-setup": zohoCrmSetup,
  "how-to-choose-crm": howToChooseCrm,
  "what-is-crm": whatIsCrm,
  "hubspot-plans": hubspotPlans,
  "is-hubspot-worth-it": isHubspotWorthIt,
  "activecampaign-plans": activecampaignPlans,
  "is-activecampaign-worth-it": isActivecampaignWorthIt,
  "insightly-plans": insightlyPlans,
  "is-insightly-worth-it": isInsightlyWorthIt,
  "getresponse-plans": getresponsePlans,
  "keap-plans": keapPlans,
  "is-keap-worth-it": isKeapWorthIt,
  "capsule-plans": capsulePlans,
  "is-capsule-worth-it": isCapsuleWorthIt,
  "closely-plans": closelyPlans,
  "is-closely-worth-it": isCloselyWorthIt,
  "lusha-plans": lushaPlans,
  "is-lusha-worth-it": isLushaWorthIt,
  "pipedrive-plans": pipedrivePlans,
  "is-pipedrive-worth-it": isPipedriveWorthIt,
};

export const WAVE1_GUIDE_SLUGS: string[] = Object.keys(PAGE_BUILDERS);

/* ------------------------------------------------------------------ *
 * Overlay assembly.
 * ------------------------------------------------------------------ */

function clamp(text: string, max: number): string {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= max) return collapsed;
  return `${collapsed.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Replacement blocks. Every type listed here evicts the factory blocks of the
 * same type for this slug — which is the point: the templated `step` and
 * `checklist` blocks are what made the prior batch interchangeable.
 */
function buildBlocks(slug: string, content: PageContent): GuideContentBlock[] {
  const blocks: GuideContentBlock[] = [
    {
      id: `w1-${slug}-direct-answer`,
      type: "direct-answer",
      body: content.directAnswer.body,
      bullets: content.directAnswer.bullets,
    },
    {
      id: `w1-${slug}-framework`,
      type: "decision-framework",
      title: content.framework.title,
      steps: content.framework.steps,
    },
    {
      id: `w1-${slug}-mistakes`,
      type: "mistakes",
      title: content.mistakes.title,
      items: content.mistakes.items,
    },
    {
      id: `w1-${slug}-checklist`,
      type: "checklist",
      title: "Before you decide",
      copyable: true,
      items: content.checklist.map((item, index) => ({
        id: `w1-${slug}-cl-${index + 1}`,
        label: item.label,
        description: item.description,
        order: index,
      })),
    },
  ];

  content.steps.forEach((step, index) => {
    blocks.push({
      id: `w1-${slug}-step-${index + 1}`,
      type: "step",
      stepNumber: index + 1,
      heading: step.heading,
      body: step.body,
      ...(step.tip ? { tip: step.tip } : {}),
      scenarios: [],
    });
  });

  return blocks;
}

function buildOverlay(slug: string, content: PageContent): GuideEnrichmentOverlay {
  const seoTitle = content.seoTitle.trim();
  if (seoTitle.length > SEO_TITLE_MAX) {
    throw new Error(
      `${slug}: seo.title is ${seoTitle.length} chars (max ${SEO_TITLE_MAX})`,
    );
  }

  const prior = loadGuideEnrichmentOverlay(slug);

  const patch: GuideEnrichmentOverlay["patch"] = {
    summary: content.summary.replace(/\s+/g, " ").trim(),
    // Partial by design — mergeGuideWithOverlay spreads this over guide.seo,
    // so indexability is never flipped from here.
    seo: {
      title: seoTitle,
      description: clamp(content.seoDescription, SEO_DESCRIPTION_MAX),
    } as GuideEnrichmentOverlay["patch"]["seo"],
    sections: content.sections.map((section) => ({
      id: section.id,
      heading: section.heading,
      body: section.body.replace(/\s+/g, " ").trim(),
      ...(section.tip ? { tip: section.tip } : {}),
    })),
    blocks: buildBlocks(slug, content),
    checklist: content.checklist.map((item, index) => ({
      id: `w1-${slug}-guide-cl-${index + 1}`,
      label: item.label,
      description: item.description,
      order: index,
    })),
  };

  // Preserve internal-linking and support edges earned by earlier batches.
  if (prior?.patch.relatedGuideSlugs) {
    patch.relatedGuideSlugs = prior.patch.relatedGuideSlugs;
  }
  if (prior?.patch.nextAction) patch.nextAction = prior.patch.nextAction;
  if (prior?.patch.supports) patch.supports = prior.patch.supports;
  if (prior?.patch.faq) patch.faq = prior.patch.faq;

  const priorNotes = (prior?.notes ?? []).filter(
    (note) => !note.startsWith(WAVE_NOTE),
  );

  return {
    slug,
    enrichmentType: content.enrichmentType,
    updatedAt: new Date().toISOString(),
    uniqueValueAdded: content.uniqueValueAdded,
    patch,
    notes: [...priorNotes, `${WAVE_NOTE}: ${content.lens}`],
  };
}

/**
 * Write every Wave 1 overlay. Returns the slugs written.
 */
export function writeWave1GuideOverlays(): string[] {
  const written: string[] = [];
  for (const slug of WAVE1_GUIDE_SLUGS) {
    const productSlug = SLUG_PRODUCT[slug] ?? null;
    const facts = productSlug ? loadFacts(productSlug) : null;
    const content = PAGE_BUILDERS[slug]!(facts);
    const overlay = buildOverlay(slug, content);
    const path = saveGuideEnrichmentOverlay(overlay);
    written.push(slug);
    console.log(
      `wrote ${slug} → ${path} (${overlay.patch.blocks?.length ?? 0} blocks, ` +
        `${overlay.patch.sections?.length ?? 0} sections)`,
    );
  }
  return written;
}

/* ------------------------------------------------------------------ *
 * Verification — merge, then re-assess against overlay-merged peers.
 * ------------------------------------------------------------------ */

function mergedGuideEstate(): GuidePage[] {
  const overlaySlugs = new Set(listGuideEnrichmentOverlaySlugs());
  return getGuides({ includeUnpublished: true }).map((guide) =>
    overlaySlugs.has(guide.slug)
      ? mergeGuideWithOverlay(guide, loadGuideEnrichmentOverlay(guide.slug))
      : guide,
  );
}

function isFactoryPackSlug(slug: string): boolean {
  return slug.endsWith("-plans") || /^is-.+-worth-it$/.test(slug);
}

type VerifyRow = {
  slug: string;
  similarity: number;
  blocksAutoPromotion: boolean;
  riskLevel: string;
  signals: number;
  siblings: number;
  nearest: string | null;
};

function verifyWave1(slugs: string[]): { rows: VerifyRow[]; failed: string[] } {
  const estate = mergedGuideEstate();
  const bySlug = new Map(estate.map((g) => [g.slug, g]));
  const rows: VerifyRow[] = [];
  const failed: string[] = [];

  for (const slug of slugs) {
    const guide = bySlug.get(slug);
    if (!guide) {
      console.error(`MISSING guide for overlay slug ${slug}`);
      failed.push(slug);
      continue;
    }
    const assessment = assessGuideSemanticTemplateRisk(guide, estate);
    const nearest =
      assessment.sectionSimilarities
        .slice()
        .sort((a, b) => b.maxSimilarity - a.maxSimilarity)[0] ?? null;

    const row: VerifyRow = {
      slug,
      similarity: assessment.maxSemanticSimilarity,
      blocksAutoPromotion: assessment.blocksAutoPromotion,
      riskLevel: assessment.riskLevel,
      signals: assessment.uniqueAnalysisSignals.filter((s) =>
        s.startsWith("specific_"),
      ).length,
      siblings: assessment.siblingCluster.size,
      nearest: nearest?.nearestSiblingSlug ?? null,
    };
    rows.push(row);

    console.log(
      `${slug.padEnd(28)} sim=${row.similarity.toFixed(4)} ` +
        `blocksAutoPromotion=${row.blocksAutoPromotion} ` +
        `risk=${row.riskLevel} uniqueSignals=${row.signals} ` +
        `siblings=${row.siblings} nearest=${row.nearest ?? "—"}`,
    );
    for (const reason of assessment.reasons) console.log(`    ${reason}`);

    if (
      isFactoryPackSlug(slug) &&
      row.blocksAutoPromotion &&
      row.similarity >= FAIL_SIMILARITY
    ) {
      failed.push(slug);
    }
  }

  return { rows, failed };
}

function main(): void {
  const written = writeWave1GuideOverlays();
  console.log(`\n${written.length} overlays written\n`);

  console.log("=== semantic template re-assessment (overlay-merged) ===");
  const { rows, failed } = verifyWave1(written);

  const blocked = rows.filter((r) => r.blocksAutoPromotion);
  const worst = rows.reduce(
    (max, r) => (r.similarity > max ? r.similarity : max),
    0,
  );
  console.log(
    `\nmax similarity across wave=${worst.toFixed(4)} · ` +
      `blocksAutoPromotion=${blocked.length}/${rows.length}`,
  );

  if (failed.length > 0) {
    console.error(
      `\nFAIL — still template-risk blocked at sim>=${FAIL_SIMILARITY}: ${failed.join(", ")}`,
    );
    process.exit(1);
  }
  console.log(
    `\nOK — no plans/worth-it page blocked with similarity >= ${FAIL_SIMILARITY}`,
  );
}

if (process.argv[1] && /write-guide-overlays\.ts$/.test(process.argv[1])) {
  main();
}
