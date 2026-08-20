import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM glossary — terminology for buyers and operators.
 * Template: softwareglimpse-guide-template-v1
 */
const crmGlossaryBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM terminology describes the system of record: contacts and companies (who), leads (potential interest), deals/opportunities (money in motion), pipelines and stages (process), activities (what happened), and automation/reporting (how the system helps the team act). Decision rule: if you can map a real sales sentence onto those objects, vendor pitches stop sounding more different than they are.",
    bullets: [
      "Contact & company",
      "Lead vs deal",
      "Pipeline & stages",
      "Activity & task",
      "Owner & permission",
      "Workflow & report",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Objects are the language",
        body: "If you can explain contact, company, deal, and activity, most CRM UIs become navigable.",
      },
      {
        label: "Lead ≠ deal",
        body: "A lead is unqualified interest; a deal is a tracked opportunity with stages and (usually) value.",
      },
      {
        label: "Pipeline is process, not a report",
        body: "A pipeline is the ordered set of stages deals move through — reports summarize those deals.",
      },
      {
        label: "Vendors rename the same ideas",
        body: "Opportunity, deal, and prospect may map to the same underlying concept — ask for the object model.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "term-map",
    title: "Glossary map",
    steps: [
      { id: "who", label: "Who", short: "Contact / company" },
      { id: "interest", label: "Interest", short: "Lead" },
      { id: "money", label: "Opportunity", short: "Deal" },
      { id: "path", label: "Path", short: "Pipeline / stages" },
      { id: "history", label: "History", short: "Activities" },
      { id: "action", label: "Action", short: "Tasks / workflows" },
    ],
    ctaHref: "/guides/how-crm-works/",
    ctaLabel: "How CRM works →",
    figure: {
      src: "/guides/crm-glossary-term-map.png",
      alt: "Glossary map linking who, opportunity path, history, and action CRM terms.",
      caption: "Learn terms as a connected map — not an alphabetical dump.",
    },
  },
  {
    type: "figure",
    id: "entity-map",
    title: "How the core terms connect",
    src: "/guides/crm-glossary-entities.png",
    alt: "Entity relationship diagram for Contact, Company, Deal, Activity, and Lead in a CRM.",
    caption: "Learn relationships once — then vendor labels are easier to translate.",
  },
  {
    type: "step",
    id: "people-orgs",
    stepNumber: 1,
    heading: "People and organizations",
    body: "These terms describe who you sell to and how accounts are structured.\n\nExample: “Acme Corp’s CIO, Dana Chen, replied to our meeting invite” maps to Company = Acme Corp, Contact = Dana Chen, and (still) Lead or early Deal depending on whether you have opened a tracked opportunity yet.",
    tip: "Decide early whether your process is contact-led, company-led, or both — it affects reporting and ownership.",
    figure: {
      src: "/guides/crm-glossary-people-orgs.png",
      alt: "People and organization terms: contact, company/account, and lead with plain-English definitions.",
      caption: "Who-terms describe people and accounts before money is tracked as a deal.",
    },
    scenarios: [
      {
        title: "Contact",
        body: "A person record — name, email, role, and history of interactions.",
      },
      {
        title: "Company / account",
        body: "An organization record that can own multiple contacts and deals.",
      },
      {
        title: "Lead",
        body: "A potential interest that has not yet been fully qualified into a contact/deal workflow.",
      },
    ],
  },
  {
    type: "step",
    id: "pipeline-terms",
    stepNumber: 2,
    heading: "Pipeline and deal vocabulary",
    body: "Pipeline language is where product pitches get noisy. Keep definitions boring and precise.\n\nExample: “We’re sending Acme a proposal next Tuesday” maps to Deal = Acme opportunity, Stage = Proposal, Owner = the AE, and Task = send proposal by Tuesday — not three separate Slack threads.",
    figure: {
      src: "/guides/crm-glossary-pipeline-terms.png",
      alt: "Pipeline vocabulary diagram covering deal, stage, amount, close date, owner, and forecast.",
      caption: "Deal language should map to one opportunity record — not three Slack threads.",
    },
    scenarios: [
      {
        title: "Deal / opportunity",
        body: "A tracked sales opportunity with stage, owner, and usually expected value and close date.",
      },
      {
        title: "Pipeline",
        body: "An ordered set of stages that deals move through (you can have more than one pipeline).",
      },
      {
        title: "Stage",
        body: "A named step in the process (e.g. Qualified, Proposal). Exit criteria should be explicit.",
      },
      {
        title: "Forecast category",
        body: "How likely a deal is to close for planning — only trustworthy if stages and dates are maintained.",
      },
    ],
  },
  {
    type: "step",
    id: "activity-automation",
    stepNumber: 3,
    heading: "Activity, automation, and admin terms",
    body: "These terms describe how work gets logged and scaled across the team.\n\nExample: after Dana’s call, the AE logs an Activity (call note on the deal), creates a Task (send proposal Tuesday), and a Workflow may notify the manager when Stage changes to Proposal — without anyone hunting the inbox.",
    figure: {
      src: "/guides/crm-glossary-activity-admin.png",
      alt: "Three columns for activity, automation, and admin CRM vocabulary.",
      caption: "Activity logs work; automation scales it; admin keeps the model trustworthy.",
    },
    scenarios: [
      {
        title: "Activity",
        body: "A logged interaction or event — email, call, meeting, note — attached to a record.",
      },
      {
        title: "Task",
        body: "A future action with an owner and due date (call back, send proposal).",
      },
      {
        title: "Workflow / automation",
        body: "Rules that create tasks, change fields, or notify people when conditions are met.",
      },
      {
        title: "Permission / role",
        body: "What a user can see or edit — critical once more than one team shares the CRM.",
      },
      {
        title: "Custom field",
        body: "A data field your team adds beyond vendor defaults — powerful, easy to overdo.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "confused-pairs",
    title: "Often-confused term pairs",
    figure: {
      src: "/guides/crm-glossary-confused-pairs.png",
      alt: "Side-by-side confused CRM term pairs: lead vs contact, opportunity vs deal, pipeline vs forecast, workflow vs sequence.",
      caption: "Most buying confusion is vocabulary collision — not feature gaps.",
    },
    rows: [
      {
        feature: "Lead vs contact",
        mustHave: true,
        niceToHave: false,
        notes: "Interest vs known person record",
      },
      {
        feature: "Deal vs pipeline",
        mustHave: true,
        niceToHave: false,
        notes: "One opportunity vs the stage path",
      },
      {
        feature: "Activity vs task",
        mustHave: true,
        niceToHave: false,
        notes: "Past event vs future action",
      },
      {
        feature: "Report vs dashboard",
        mustHave: false,
        niceToHave: true,
        notes: "Query vs arranged views",
      },
      {
        feature: "Integration vs sync",
        mustHave: false,
        niceToHave: true,
        notes: "Connection vs ongoing data flow",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Glossary mistakes in buying conversations",
    items: [
      {
        title: "Assuming identical labels mean identical models",
        body: "Ask what object a feature writes to — deal, contact, or a custom object.",
      },
      {
        title: "Treating “AI” as a noun with no object",
        body: "Ask which fields or recommendations change, and who verifies them.",
      },
      {
        title: "Ignoring permissions vocabulary",
        body: "Roles, teams, and record sharing determine whether collaboration is safe.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What do the main CRM terms mean?",
        answer:
          "Contacts and companies are who you sell to; leads are early interest; deals are tracked opportunities; pipelines and stages are the process; activities and tasks are what happened or what is next. Map real sales talk onto those objects and vendor demos get clearer.",
      },
      {
        question: "What does CRM stand for?",
        answer:
          "Customer relationship management — software that helps teams manage contacts, deals, and interaction history in one system of record.",
      },
      {
        question: "What is a pipeline in CRM?",
        answer:
          "A pipeline is the ordered set of stages opportunities move through. Multiple pipelines can exist for different sales motions. Example: “We’re in proposal with Acme” means a deal sitting in the Proposal stage of your pipeline.",
      },
      {
        question: "What is the difference between a lead and a deal?",
        answer:
          "A lead is unqualified or early interest. A deal (opportunity) is a tracked sales process with stages, ownership, and usually value. Example: a webinar registrant may start as a lead; once sales accepts and opens an opportunity, it becomes a deal.",
      },
      {
        question: "What should I read next?",
        answer:
          "How CRM Works shows how these objects operate together; Types of CRM helps you pick a product shape.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "Beginner definition.",
      },
      {
        href: "/guides/how-crm-works/",
        label: "How CRM works",
        description: "Objects in motion.",
      },
      {
        href: "/guides/types-of-crm/",
        label: "Types of CRM",
        description: "Product shapes explained.",
      },
      {
        href: "/guides/crm-benefits/",
        label: "CRM benefits",
        description: "Why the vocabulary matters.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Readiness check before you shop.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Buying framework.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Write must vs nice in plain terms.",
      },
      {
        href: "/categories/crm/",
        label: "CRM category",
        description: "Browse the CRM catalogue.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Use the vocabulary in CRM Finder",
    body: "CRM Finder asks structured questions using this vocabulary — then maps answers to researched products without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmGlossaryGuide: GuidePage = {
  id: "guide-crm-glossary",
  slug: "crm-glossary",
  title: "CRM Glossary: Contacts, Deals, Pipelines & More",
  summary:
    "A plain-language CRM glossary covering contacts, companies, leads, deals, pipelines, stages, activities, workflows, permissions, and reporting terms buyers actually need.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/crm-glossary-hero.png",
    alt: "Illustrated CRM glossary with floating cards for contact, company, deal, pipeline, lead, activity, and workflow.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "what-is-crm",
    "how-crm-works",
    "types-of-crm",
    "crm-examples",
    "crm-benefits",
    "do-i-need-a-crm",
    "how-to-choose-crm",
  ],
  blocks: crmGlossaryBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "objects",
      label: "Know the core objects",
      description: "Contact, company, lead, deal, activity.",
      order: 0,
    },
    {
      id: "pipeline",
      label: "Define pipeline terms",
      description: "Pipeline, stage, forecast category.",
      order: 1,
    },
    {
      id: "admin",
      label: "Learn admin terms",
      description: "Roles, permissions, custom fields, workflows.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T08:00:00.000Z",
    publishedAt: "2026-08-14T08:00:00.000Z",
    reviewedAt: "2026-08-14T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM Glossary: Key Terms Explained | SoftwareGlimpse",
    description:
      "CRM glossary for buyers — contacts, companies, leads, deals, pipelines, stages, activities, workflows, and permissions in plain language.",
    canonicalPath: "/guides/crm-glossary/",
    indexable: true,
  },
};
