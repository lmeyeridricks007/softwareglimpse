import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence CRM Sync Explained — direction, mapping, overwrite, ownership.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceCrmSyncExplainedGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM sync for sales intelligence is the agreed flow of people/account fields between your SI tool and system of record — direction, match keys, overwrite rules, and ownership — not a logo on an integrations page. Decision rule: do not enable production sync until you have written field mapping, decided what wins on conflict, named who owns duplicates, and proven a two-way (or intentionally one-way) path with a non-admin push of sample records.",
    bullets: [
      "Direction",
      "Match keys",
      "Field mapping",
      "Overwrite rules",
      "Ownership",
      "Dedupe",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "One-way push creates duplicates",
        body: "Without match keys, every export becomes a new contact pile.",
      },
      {
        label: "Overwrite rules are product decisions",
        body: "“Newest wins” can erase AE notes or trusted CRM phones.",
      },
      {
        label: "CRM remains system of record",
        body: "SI enriches and prospects; CRM owns pipeline truth.",
      },
      {
        label: "Prove sync in trial",
        body: "Demo slides are not field-level evidence.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "sync-path",
    title: "CRM sync setup path",
    steps: [
      { id: "direction", label: "Direction", short: "1-way / 2-way" },
      { id: "keys", label: "Keys", short: "Match rules" },
      { id: "map", label: "Map", short: "Field sheet" },
      { id: "overwrite", label: "Overwrite", short: "Who wins" },
      { id: "prove", label: "Prove", short: "Trial sample" },
    ],
    ctaHref: "/guides/sales-intelligence-data-quality/",
    ctaLabel: "Data quality →",
    figure: {
      src: "/guides/sales-intelligence-crm-sync-explained-map.png",
      alt: "CRM sync path for sales intelligence: choose direction, set match keys, map fields, define overwrite winners, prove with trial sample.",
      caption:
        "Agree the rules before 10,000 rows land — sync is configuration, not magic.",
    },
  },
  {
    type: "figure",
    id: "sync-flow",
    title: "Sync flow teaching diagram",
    src: "/guides/sales-intelligence-crm-sync-explained-map.png",
    alt: "Two-panel diagram: sales intelligence tool and CRM with arrows for push/pull, match on email/domain, field mapping table, and overwrite policy callouts.",
    caption:
      "Direction + keys + mapping + overwrite — four decisions that decide data quality.",
  },
  {
    type: "step",
    id: "direction-and-keys",
    stepNumber: 1,
    heading: "Choose direction and match keys first",
    body: "Decide whether SI → CRM only, CRM → SI enrichment only, or two-way. Then freeze match keys (work email, CRM ID, domain + name). Document what happens when a key is missing.\n\nExample: Northwind RevOps sets two-way for contacts on email match, SI → CRM only for net-new leads, and never overwrites CRM “mobile preferred” when SI returns a different number without AE confirmation.",
    tip: "If match keys are “we’ll figure it out later,” you already planned a dedupe project.",
    figure: {
      src: "/guides/sales-intelligence-crm-sync-explained-hero.png",
      alt: "Sales intelligence CRM sync hero: split UI of SI contact panel and CRM record with sync arrows, mapping chips, and overwrite rule badges.",
      caption:
        "Sync is visible field behavior — not an integrations logo.",
    },
    scenarios: [
      {
        title: "Enrichment-led",
        body: "CRM → SI match, write-back selected fields only.",
      },
      {
        title: "List-build-led",
        body: "SI → CRM create with strict required fields.",
      },
      {
        title: "Engagement-led",
        body: "Activity/sequence outcomes must land on the CRM contact.",
      },
    ],
  },
  {
    type: "step",
    id: "mapping-overwrite",
    stepNumber: 2,
    heading: "Write mapping and overwrite on one sheet",
    body: "For each field: source of truth, sync direction, blank-vs-value behavior, and who may change the rule. Include owner, lifecycle stage, and custom ICP fields you care about. Ban silent admin edits in production without a change note.\n\nExample: Harborline’s sheet says title/seniority may update from SI weekly; deal amount and next step never sync from SI; LinkedIn URL writes only if CRM blank.",
    tip: "Fewer mapped fields with clear winners beat mapping everything “just in case.”",
    scenarios: [
      {
        title: "Blank fill",
        body: "SI writes only when CRM field empty.",
      },
      {
        title: "SI wins",
        body: "Firmographics refresh on a schedule — AEs notified.",
      },
      {
        title: "CRM wins",
        body: "Owner, stage, and notes never overwritten by SI.",
      },
    ],
  },
  {
    type: "checklist",
    id: "sync-checklist",
    title: "Pre-production sync checklist",
    copyable: true,
    items: [
      {
        id: "direction",
        label: "Sync direction documented per object",
        description: "Contact, company, activity as applicable.",
        order: 0,
      },
      {
        id: "keys",
        label: "Match keys + missing-key behavior written",
        description: "Create vs skip vs queue.",
        order: 1,
      },
      {
        id: "map",
        label: "Field mapping sheet signed by RevOps + sales lead",
        description: "Including overwrite winners.",
        order: 2,
      },
      {
        id: "dedupe",
        label: "Duplicate owner named",
        description: "Queue + merge authority.",
        order: 3,
      },
      {
        id: "trial",
        label: "Sample push/pull proven in trial",
        description: "Non-admin create + enrich path.",
        order: 4,
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "CRM sync mistakes",
    items: [
      {
        title: "Enabling sync from the happy-path demo",
        body: "Demo orgs hide permission and duplicate edge cases.",
      },
      {
        title: "Mapping every field",
        body: "Noise fields create conflicts and AE distrust.",
      },
      {
        title: "No overwrite policy",
        body: "Last write wins becomes random data loss.",
      },
      {
        title: "SI as second CRM",
        body: "Pipeline stages living only in the engagement tool.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is sales intelligence CRM sync?",
        answer:
          "The configured exchange of contact/account (and sometimes activity) data between your SI product and CRM, governed by direction, match keys, mapping, and overwrite rules.",
      },
      {
        question: "Is native sync required?",
        answer:
          "Not always — CSV/API may suffice for enrichment-only teams. Decision rule: if SDRs live in SI daily, prove a reliable create/update path into CRM before scale.",
      },
      {
        question: "How do we prevent duplicates?",
        answer:
          "Freeze match keys, require email on create where possible, and give merge authority to a named owner — see Data Quality.",
      },
      {
        question: "What should I do next?",
        answer:
          "Complete the checklist, add sync probes to Trial Evaluation and Vendor Questions, then set ongoing hygiene SLAs.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-data-quality/",
        label: "Data quality",
        description: "Hygiene after sync is live.",
      },
      {
        href: "/guides/sales-intelligence-trial-evaluation/",
        label: "Trial evaluation",
        description: "Prove sync hands-on.",
      },
      {
        href: "/guides/sales-intelligence-vendor-questions/",
        label: "Vendor questions",
        description: "Ask identical sync probes.",
      },
      {
        href: "/guides/crm-field-mapping/",
        label: "CRM field mapping",
        description: "CRM-side mapping discipline.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Sync as a selection criterion.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Shortlist context.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Treat sync as a must-have gate",
    body: "Shortlist by primary job, then refuse production credits until mapping and overwrite rules are written and trial-proven.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceCrmSyncExplainedGuide: GuidePage = {
  id: "guide-sales-intelligence-crm-sync-explained",
  slug: "sales-intelligence-crm-sync-explained",
  title: "Sales Intelligence CRM Sync Explained",
  summary:
    "Set SI ↔ CRM sync with clear direction, match keys, field mapping, overwrite rules, and ownership — proven in trial before production scale.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "integration",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/sales-intelligence-crm-sync-explained-hero.png",
    alt: "Sales intelligence CRM sync hero: SI and CRM panels linked by sync arrows with mapping and overwrite callouts.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best Sales Intelligence",
  },
  relatedGuideSlugs: [
    "sales-intelligence-data-quality",
    "sales-intelligence-trial-evaluation",
    "sales-intelligence-vendor-questions",
    "how-to-choose-sales-intelligence",
    "crm-field-mapping",
  ],
  blocks: salesIntelligenceCrmSyncExplainedGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "direction-keys",
      label: "Document direction + match keys",
      description: "Per object.",
      order: 0,
    },
    {
      id: "mapping",
      label: "Sign field mapping + overwrite sheet",
      description: "RevOps + sales lead.",
      order: 1,
    },
    {
      id: "prove",
      label: "Prove sample sync in trial",
      description: "Before production enablement.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-17T08:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence CRM Sync Explained | SoftwareGlimpse",
    description:
      "SI CRM sync: direction, match keys, field mapping, overwrite rules, and ownership — prove in trial before scale.",
    canonicalPath: "/guides/sales-intelligence-crm-sync-explained/",
    indexable: true,
  },
};
