import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Field Mapping Guide — source→target dictionary before import.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational only — no invented prices, rankings, or metrics.
 */
const crmFieldMappingBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Field mapping is the approved source→target dictionary that tells migration what lands where, what is required vs optional, and which transforms run before import. Decision rule: do not run a pilot import until one named owner freezes the mapping sheet — including sample rows — and every required target field has a source, a transform, or an explicit “leave blank + fill in CRM” rule.",
    bullets: [
      "One owner",
      "Source→target",
      "Required vs optional",
      "Transforms written",
      "Sample rows",
      "Then pilot import",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Mapping is a product artifact",
        body: "Treat the sheet like config: versioned, owned, and change-controlled.",
      },
      {
        label: "Required fields need a plan",
        body: "Source, transform, or deliberate blank-with-owner — never hope.",
      },
      {
        label: "Transforms belong in writing",
        body: "Trim, case, stage renames, and owner email lookups fail silently if undocumented.",
      },
      {
        label: "Sample rows catch lies early",
        body: "Five real rows beat a perfect header row with empty evidence.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "mapping-path",
    title: "Field mapping path",
    steps: [
      { id: "inventory", label: "Inventory", short: "Source fields" },
      { id: "classify", label: "Classify", short: "Required vs optional" },
      { id: "map", label: "Map", short: "Source→target" },
      { id: "transform", label: "Transform", short: "Rules written" },
      { id: "sample", label: "Sample", short: "Rows validated" },
      { id: "freeze", label: "Freeze", short: "Owner signs off" },
    ],
    ctaHref: "/guides/crm-data-migration/",
    ctaLabel: "Data migration guide →",
    figure: {
      src: "/guides/crm-field-mapping-path.png",
      alt: "Field mapping path: inventory, classify required vs optional, map source to target, transform rules, sample validation, freeze.",
      caption:
        "Freeze the dictionary before any pilot import — silent renames after freeze are drift.",
    },
  },
  {
    type: "figure",
    id: "dictionary-visual",
    title: "Source→target dictionary",
    src: "/guides/_shared/migration-cutover-field-map.png",
    alt: "SoftwareGlimpse shared CRM migration visual system highlighting field mapping inside inventory → map → pilot → cutover.",
    caption:
      "Field mapping is the Map stage of the shared migration kit — freeze the dictionary before any pilot import.",
  },
  {
    type: "checklist",
    id: "mapping-ready",
    title: "Mapping sheet readiness",
    copyable: true,
    items: [
      {
        id: "owner",
        label: "Mapping sheet owner named",
        description: "Ops or admin who can approve changes — one person.",
        order: 0,
      },
      {
        id: "objects",
        label: "Objects in scope listed",
        description: "Contacts, accounts/companies, deals/opportunities, and any extras.",
        order: 1,
      },
      {
        id: "required",
        label: "Required target fields flagged",
        description: "Every required field has source, transform, or blank rule.",
        order: 2,
      },
      {
        id: "transforms",
        label: "Transforms documented",
        description: "Email normalize, stage rename, owner lookup, date format.",
        order: 3,
      },
      {
        id: "samples",
        label: "Sample rows attached",
        description: "At least five real rows per object, reviewed by a seller.",
        order: 4,
      },
      {
        id: "clean-link",
        label: "Cleaning rules linked",
        description: "Duplicates and junk handled before or during map (see cleaning guide).",
        order: 5,
      },
      {
        id: "frozen",
        label: "Version frozen for pilot",
        description: "No silent column renames after pilot import starts.",
        order: 6,
      },
    ],
  },
  {
    type: "step",
    id: "own-the-sheet",
    stepNumber: 1,
    heading: "Name one owner and freeze the sheet format",
    body: "Pick a single mapping-sheet owner (usually ops/admin) who controls columns, versions, and approvals. Sellers and managers propose changes; the owner decides. Use one shared spreadsheet or doc with fixed columns: object, source field, source sample, target field, required/optional, transform, notes, status.\n\nExample: Northline B2B (12-person SaaS sales) assigns Mara in ops as mapping owner. AEs may request fields, but Mara rejects anything not on the 90-day outcomes list. Version NLB-MAP-v3 is the only sheet the migration contractor may use.",
    tip: "If two people can silently edit the map, you do not have a map — you have drift.",
    figure: {
      src: "/guides/crm-field-mapping-hero.png",
      alt: "CRM field mapping hero: source fields connected to target CRM fields with required badges and transform notes.",
      caption:
        "Source→target with required flags and transforms is the artifact that unlocks a safe pilot import.",
    },
    scenarios: [
      {
        title: "Ops-owned sheet",
        body: "Best default: ops owns; sales validates sample rows.",
      },
      {
        title: "Vendor-assisted map",
        body: "Vendor drafts; your owner still freezes and signs off.",
      },
      {
        title: "Multi-source map",
        body: "Legacy CRM + sheet tabs get separate source columns, same target.",
      },
    ],
  },
  {
    type: "step",
    id: "classify-fields",
    stepNumber: 2,
    heading: "Classify required vs optional before you map everything",
    body: "List target fields the CRM will enforce (owner, stage, next-step date, email, company name). Mark each required or optional for go-live. Optional historical fields can wait; required empty fields create import failures or dishonest blanks.\n\nExample: Northline marks Owner, Pipeline Stage, Contact Email, and Next Activity Date as required for open deals. “Lead source detail” and “competitor notes” stay optional for wave two. Mara deletes three custom targets that nobody could fill from the export.",
    tip: "A short required set with honest data beats a wide schema of empty columns.",
    figure: {
      src: "/guides/crm-field-mapping-classify.png",
      alt: "Classify CRM fields required vs optional before mapping: list targets, mark go-live musts, defer history, drop unfillable customs.",
      caption:
        "Required empty fields create import failures — keep the go-live set short and honest.",
    },
    scenarios: [
      {
        title: "Identity fields",
        body: "Email, company name, external ID — usually required for match/merge.",
      },
      {
        title: "Pipeline fields",
        body: "Stage, amount, close date, owner — required for open deals you will manage.",
      },
      {
        title: "Nice history",
        body: "Old tags and free-text dumps — optional or archive-only.",
      },
    ],
  },
  {
    type: "step",
    id: "write-transforms",
    stepNumber: 3,
    heading: "Write transforms as rules, not tribal knowledge",
    body: "For every mapped row, document the transform: trim whitespace, lowercase emails, map stage labels (Prospecting→Qualified), resolve owner by email to CRM user ID, convert date formats, and drop rows that fail a required rule. If the transform is “manual fill after import,” name who fills it and by when.\n\nExample: Northline’s stage map collapses five legacy labels into four CRM stages. Owner Email → CRM user uses a lookup table; unmatched owners fail the row into a quarantine tab. Emails run trim + lowercase. Mara attaches five sample deal rows showing before/after values so sellers can spot wrong stage collapses.",
    tip: "If you cannot explain the transform in one sentence on the sheet, do not automate it yet.",
    figure: {
      src: "/guides/crm-field-mapping-transforms.png",
      alt: "Write CRM field transforms as rules: normalize, stage rename table, owner lookup, date format, quarantine failures.",
      caption:
        "Document every transform on the sheet — tribal knowledge is not a mapping rule.",
    },
    scenarios: [
      {
        title: "Stage rename",
        body: "Explicit legacy→new table; never fuzzy string match in production.",
      },
      {
        title: "Owner lookup",
        body: "Email or employee ID → active CRM user; unmatched = quarantine.",
      },
      {
        title: "Blank required",
        body: "Written rule: set default stage or block import until filled.",
      },
    ],
  },
  {
    type: "step",
    id: "sample-and-link",
    stepNumber: 4,
    heading: "Validate sample rows, then link cleaning and migration",
    body: "Have a seller and the mapping owner walk five real rows per object: does the target look like something they would trust on Monday? Fix the map before cleaning at scale. Then hand the frozen sheet to data cleaning (duplicates, junk) and data migration (pilot import → cutover).\n\nExample: AE Jordan reviews five Northline deals. One “Verbal Yes” stage had been mapped to Closed Won — caught on the sample pass. Mara revises the map, cleaning removes duplicate contacts for those accounts, and only then does migration run the pilot import for Jordan’s book.",
    tip: "Sample-row review is cheaper than a full re-import after go-live storytelling collapses.",
    figure: {
      src: "/guides/crm-field-mapping-sample.png",
      alt: "Validate CRM sample rows then hand off: seller review, fix map, clean duplicates, pilot import on frozen sheet version.",
      caption:
        "Seller-trusted samples unlock cleaning and migration — not the other way around.",
    },
    scenarios: [
      {
        title: "Seller review",
        body: "One AE signs that samples look like real work.",
      },
      {
        title: "Cleaning handoff",
        body: "Duplicate and junk rules reference the same field names.",
      },
      {
        title: "Migration handoff",
        body: "Pilot import uses frozen sheet version only.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Field mapping mistakes",
    items: [
      {
        title: "Mapping in a chat thread",
        body: "Decisions disappear; imports follow the last loud voice.",
      },
      {
        title: "Header-only maps with no sample values",
        body: "Transforms look fine until real data breaks them.",
      },
      {
        title: "Treating every legacy column as required",
        body: "You import noise and teach the team the CRM is untrustworthy.",
      },
      {
        title: "Silent stage collapses",
        body: "Forecast and coaching break when labels are “close enough.”",
      },
      {
        title: "No owner for unmatched users",
        body: "Deals land without owners and die in the board.",
      },
      {
        title: "Changing the map mid-pilot without versioning",
        body: "You cannot tell whether the import or the sheet is wrong.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What belongs in a CRM field mapping sheet?",
        answer:
          "Object, source field, sample value, target field, required vs optional, transform rule, notes, and status. Plus a named owner and a version ID frozen for each import run.",
      },
      {
        question: "Who should own the mapping sheet?",
        answer:
          "One ops/admin owner who can say no. Sellers validate samples; vendors may draft; the owner freezes the version used for pilot and cutover.",
      },
      {
        question: "How do we handle required fields with no source?",
        answer:
          "Write an explicit rule: default value, post-import fill with owner and deadline, or block those rows. Do not leave required targets silently empty.",
      },
      {
        question: "When should we map historical custom fields?",
        answer:
          "Only if someone will maintain them after go-live. Otherwise archive the export and keep the CRM schema short for the core loop.",
      },
      {
        question: "How does field mapping relate to data cleaning?",
        answer:
          "Mapping defines field names and transforms; cleaning removes duplicates and junk using those same names. Clean after the map is stable enough that you are not renaming columns every day — see the Clean CRM Data guide.",
      },
      {
        question: "How many sample rows do we need?",
        answer:
          "At least five real rows per in-scope object, reviewed by someone who works those records. Edge cases (blank email, unmatched owner) deserve their own sample rows.",
      },
      {
        question: "What should I do next?",
        answer:
          "Freeze the sheet, run cleaning on the mapped export, then follow the CRM Data Migration Guide for pilot import. Use CRM Testing before go-live to prove mapped fields behave in the product.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related implementation resources",
    links: [
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "Pilot import and cutover after the map freezes.",
      },
      {
        href: "/guides/crm-data-cleaning/",
        label: "Clean CRM data",
        description: "Duplicates and junk on mapped fields.",
      },
      {
        href: "/guides/crm-testing/",
        label: "CRM testing guide",
        description: "Prove mapped fields in UAT scripts.",
      },
      {
        href: "/guides/crm-go-live/",
        label: "CRM go-live guide",
        description: "Cutover after mapping and tests pass.",
      },
      {
        href: "/guides/crm-training/",
        label: "CRM training guide",
        description: "Teach the fields people must fill.",
      },
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption guide",
        description: "Keep the schema honest after launch.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product choice is still open.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Outcomes that justify which fields exist.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Still choosing the CRM?",
    body: "If mapping is blocked because the target product is unclear, CRM Finder constrains the shortlist before you invest in a dictionary.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmFieldMappingGuide: GuidePage = {
  id: "guide-crm-field-mapping",
  slug: "crm-field-mapping",
  title: "CRM Field Mapping Guide: Source to Target Dictionary",
  summary:
    "Build and freeze a CRM field mapping sheet — required vs optional fields, transforms, sample rows, and a single owner — before pilot import.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "migration",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-field-mapping-hero.png",
    alt: "CRM field mapping hero: source fields connected to target CRM fields with required badges and transform notes.",
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
    {
      contentId: "content:tool:crm-requirements-builder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "crm-data-migration",
    "crm-data-cleaning",
    "crm-testing",
    "crm-go-live",
    "crm-training",
    "crm-adoption",
  ],
  blocks: crmFieldMappingBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "owner-sheet",
      label: "Name mapping owner and freeze sheet format",
      description: "One version ID for pilot import.",
      order: 0,
    },
    {
      id: "required-transforms",
      label: "Mark required fields and write transforms",
      description: "Including unmatched-owner quarantine.",
      order: 1,
    },
    {
      id: "sample-signoff",
      label: "Validate sample rows with a seller",
      description: "Then hand off to cleaning and migration.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T12:00:00.000Z",
    publishedAt: "2026-08-14T12:00:00.000Z",
    reviewedAt: "2026-08-14T12:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM Field Mapping Guide: Source to Target | SoftwareGlimpse",
    description:
      "Build a CRM field mapping dictionary: required vs optional fields, transforms, sample rows, and a named owner before pilot import.",
    canonicalPath: "/guides/crm-field-mapping/",
    indexable: true,
  },
};
