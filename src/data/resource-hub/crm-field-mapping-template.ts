import type { ResourceHubProfile } from "@/domain";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

/**
 * CRM Field Mapping Template — source→target mapping workbook (not a checklist).
 * Stable slug: crm-field-mapping-template
 */
export const crmFieldMappingTemplateDepth: Depth = {
  displayTitle: "CRM Field Mapping Template",
  badgeLabel: "Mapping workbook",
  toolkitLabel: "CRM Migration Toolkit",
  tagline:
    "Plan exactly how fields, values and relationships move from your existing CRM into the new system.",
  heroExplanation:
    "This is not a CRM evaluation checklist. It is a working data-mapping artifact used to specify exactly how source CRM data becomes target CRM data — objects, fields, transforms, picklists, lookups, ownership, validation, and migration readiness.",
  overview:
    "A CRM Field Mapping Template is the source→target dictionary for CRM migration, implementation, consolidation, re-platforming, and data cleanup. Teams inventory source objects and fields, map them to the target CRM, define transformations and value maps, assign owners, track validation, and decide whether the map is ready for test or production load. Object inventory and load order live in the Data Migration Template; cutover gates live on the Migration Checklist. This workbook is field-level configuration — versioned, owned, and testable.",
  whoThisIsFor:
    "CRM administrators, RevOps, Sales Operations, data migration leads, implementation partners, business analysts, data engineers, and IT / application owners preparing a CRM data move.",
  whatMattersIntro:
    "Required target fields need an approved mapping or an explicit remediation decision before bulk testing. Picklist and lookup gaps break loads more often than missing optional columns. EXAMPLE rows in the downloads are illustrative (e.g. Pipedrive → HubSpot teaching) — replace them with your schema.",
  howToUse:
    "Download the Excel workbook first. Complete Project and Object Map, then Field Map as the primary sheet. Add Value Maps, Transformations, and Lookups for non-direct rows. Log validation tests and issues. Use the Dashboard readiness formula before pilot import. Print the PDF as the workshop / sign-off guide — Excel remains the working system of record.",
  workedExample:
    "Illustrative teaching scenario (not a SoftwareGlimpse case study): Pipedrive → HubSpot. Person → Contact, Organization → Company, Deal → Deal, Activity → Activity; Legacy Note excluded. Example field rows show Direct (email), Rename (company_name → name), Transform (revenue text → currency), Value mapping (stage), Lookup (owner email → user), and Do not migrate (legacy_campaign_code). Replace every EXAMPLE row with your real export and target schema before freeze.",
  workedExampleStructured: {
    title: "Worked example (illustrative)",
    requirement:
      "Show how source objects and a mix of mapping types become a freeze-ready field map — teaching only, not product research.",
    vendors: [
      {
        name: "Person → Contact (email Direct; owner Lookup)",
        result: "PASS",
        note: "Illustrative Pipedrive → HubSpot teaching row — email Direct; owner email Lookup with fallback queue.",
      },
      {
        name: "Organization → Company (Rename / Transform)",
        result: "PARTIAL",
        note: "company_name → name ready; annual_revenue_text parse still needs sample validation.",
      },
      {
        name: "Deal stage Value mapping",
        result: "PARTIAL",
        note: "“Contract Sent” mapped; remaining source stages still need approval.",
      },
      {
        name: "Legacy Note excluded",
        result: "PASS",
        note: "Explicit Do not migrate so tribal notes are not imported by accident.",
      },
    ],
    evidence:
      "EXAMPLE rows in Excel/PDF labelled ILLUSTRATIVE — replace with fields copied from a real export and the configured target CRM.",
    disclaimer:
      "Hypothetical Pipedrive → HubSpot teaching scenario — not a SoftwareGlimpse vendor endorsement or migration case study.",
  },
  glance: {
    primaryGoal:
      "A freeze-ready source→target field map with transforms, value maps, and validation",
    typicalTeam:
      "Migration lead, CRM admin, RevOps, data owner, implementation partner",
    commonPriorities: [
      "Object mapping",
      "Field matrix",
      "Picklist / value maps",
      "Transforms & lookups",
      "Validation & readiness",
    ],
  },
  whatsInside: [
    {
      id: "objects",
      title: "Object mapping",
      description:
        "Source→target objects, migrate yes/no, volumes, owners, and status.",
      icon: "list",
    },
    {
      id: "field-matrix",
      title: "Field mapping matrix",
      description:
        "Source and target fields, types, mapping type, transforms, owners, status.",
      icon: "chart",
    },
    {
      id: "value-maps",
      title: "Picklist & value maps",
      description:
        "Source value → target value with approval and unknown-value handling.",
      icon: "check",
    },
    {
      id: "transforms",
      title: "Transformations & lookups",
      description:
        "Rule IDs, examples, expected outputs, and reference resolution.",
      icon: "zap",
    },
    {
      id: "validation",
      title: "Validation & readiness",
      description:
        "Test log plus dashboard counts — BLOCKED through PRODUCTION READY.",
      icon: "shield",
    },
    {
      id: "signoff",
      title: "Decisions & sign-off",
      description:
        "Issues, exceptions, and formal approval for test or production load.",
      icon: "file",
    },
  ],
  evidenceRules: {
    countsAs: [
      "Field names copied from a real source export or API schema",
      "Target field confirmed in the configured CRM org / portal",
      "Sample source value with expected output for non-trivial transforms",
      "Named business and technical owners on required rows",
    ],
    doesNotCount: [
      "Field names recalled from memory or a sales deck",
      "“The importer will figure it out”",
      "Transforms described only in chat",
      "Silent defaults added only to silence load errors",
    ],
  },
  challenges: [
    {
      id: "checklist-confusion",
      title: "Treating mapping as a Pass/Fail checklist",
      pain: "Teams mark rows Complete without defining the actual transform.",
      crmHelps:
        "The matrix forces source, target, mapping type, and validation columns.",
    },
    {
      id: "picklist-gaps",
      title: "Unmapped picklist values",
      pain: "Loads fail or dump records into wrong stages mid-cutover.",
      crmHelps:
        "Dedicated value-map sheet plus unknown-value handling before pilot.",
    },
    {
      id: "required-blind-spot",
      title: "Required target fields left blank",
      pain: "Bulk testing starts while mandatory fields have no rule.",
      crmHelps:
        "Dashboard BLOCKED when required targets are unmapped or excluded.",
    },
  ],
  outcomes: [
    {
      id: "inventory",
      title: "Inventory source fields",
      description: "Know what exists before deciding what moves.",
    },
    {
      id: "map-objects-fields",
      title: "Map objects and fields",
      description: "Explicit source→target with mapping type on every included row.",
    },
    {
      id: "transforms-values",
      title: "Define transforms and value maps",
      description: "Testable rules with examples — not tribal knowledge.",
    },
    {
      id: "ownership",
      title: "Assign ownership",
      description: "Business and technical owners for required and complex rows.",
    },
    {
      id: "gaps-risks",
      title: "Surface unmapped fields and risks",
      description: "Excluded, blocked, and open issues stay visible.",
    },
    {
      id: "readiness",
      title: "Decide migration readiness",
      description:
        "Deterministic readiness from workbook state — not a decorative score.",
    },
  ],
  workflowSteps: [
    {
      id: "inventory",
      label: "Inventory source objects",
      detail: "Export real schema and volumes — do not invent headers.",
    },
    {
      id: "object-map",
      label: "Map target objects",
      detail: "Decide Full / Reference / None per object with an owner.",
    },
    {
      id: "field-map",
      label: "Map fields",
      detail: "Fill the field matrix — required targets first.",
    },
    {
      id: "transforms",
      label: "Define transformations",
      detail: "Value maps, lookups, parses, concatenations, defaults.",
    },
    {
      id: "validate",
      label: "Validate sample records",
      detail: "Run sample tests; log pass/fail and issues.",
    },
    {
      id: "signoff",
      label: "Sign off mapping",
      detail: "Freeze for test or production only when readiness allows.",
    },
  ],
  artifactSections: [
    {
      id: "project-setup",
      title: "1. Project setup",
      accent: "navy",
      intro: "Source and target CRM, owners, and migration date.",
      items: [
        {
          id: "1.1",
          label: "Source CRM / Target CRM named",
          detail: "Edition and environment matter for field availability.",
        },
        {
          id: "1.2",
          label: "Migration and business owners named",
          detail: "Who freezes the map and who accepts exceptions.",
        },
      ],
    },
    {
      id: "object-mapping",
      title: "2. Object mapping",
      accent: "blue",
      intro: "Which objects move, which are reference-only, which are excluded.",
      items: [
        {
          id: "2.1",
          label: "Source object → target object",
          detail: "Keep names identical to the Data Migration Template.",
        },
        {
          id: "2.2",
          label: "Migration scope and status",
          detail: "Full / Reference / None — Blocked needs a decision.",
        },
      ],
    },
    {
      id: "field-matrix",
      title: "3. Field mapping matrix",
      accent: "teal",
      intro: "The core artifact — one row per field mapping decision.",
      items: [
        {
          id: "3.1",
          label: "Source and target field + types",
          detail: "Copied from schema, not recalled from memory.",
        },
        {
          id: "3.2",
          label: "Mapping type and transformation",
          detail: "Direct, Rename, Transform, Value mapping, Lookup, Do not migrate…",
        },
      ],
    },
    {
      id: "values-transforms",
      title: "4. Value maps & transforms",
      accent: "indigo",
      intro: "Picklists, rule IDs, and lookup keys that break loads when skipped.",
      items: [
        {
          id: "4.1",
          label: "Picklist / value mapping sheet",
          detail: "Including unknown-value handling.",
        },
        {
          id: "4.2",
          label: "Transformation and lookup sheets",
          detail: "Example input → expected output before pilot.",
        },
      ],
    },
    {
      id: "validation-signoff",
      title: "5. Validation & sign-off",
      accent: "green",
      intro: "Tests, issues, readiness, and formal approval.",
      items: [
        {
          id: "5.1",
          label: "Dashboard readiness",
          detail: "BLOCKED → NOT READY → TEST READY → PRODUCTION READY.",
        },
        {
          id: "5.2",
          label: "Sign-off and remaining blockers",
          detail: "Then hand off to Migration Checklist / cutover.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "Is this a CRM evaluation checklist?",
      answer:
        "No. Pass / Partial / Fail belongs on evaluation and migration gate checklists. This workbook specifies how source data becomes target data.",
    },
    {
      question: "Why is Excel the primary download?",
      answer:
        "Field mapping is interactive: hundreds of rows, filters, formulas, and readiness counts. The PDF is the workshop guide and sign-off record.",
    },
    {
      question: "Do we map every source column?",
      answer:
        "No. Map what the team will operate and report on. Explicitly mark Do not migrate / Archive for the rest so legacy noise is not imported by accident.",
    },
    {
      question: "What if a required target field has no source?",
      answer:
        "Record the decision on the row: derive it, use an approved default, leave blank with a named post-load owner, or remediate before load. Do not leave it to the importer.",
    },
    {
      question: "How does this relate to the Data Migration Template?",
      answer:
        "That template inventories objects, volumes, owners, and load order. This one defines field-level transforms inside those objects. Keep object names identical across both.",
    },
    {
      question: "When is the map PRODUCTION READY?",
      answer:
        "Only when required target mappings are approved, required validation tests pass, and blocker issues are closed — per the Excel Dashboard formula. Decorative percentage scores are not used.",
    },
  ],
  journeySlugs: [
    "crm-implementation-checklist",
    "crm-data-migration-template",
    "crm-field-mapping-template",
    "crm-migration-checklist",
    "crm-go-live-checklist",
  ],
  featuredGuideHrefs: [
    "/guides/crm-field-mapping/",
    "/guides/crm-data-migration/",
    "/guides/crm-implementation/",
    "/guides/crm-vendor-migration/",
  ],
  relatedToolHrefs: [
    {
      href: "/tools/crm-migration-planner/",
      label: "CRM Migration Planner",
    },
    {
      href: "/tools/crm-implementation-planner/",
      label: "CRM Implementation Planner",
    },
    {
      href: "/tools/crm-requirements-builder/",
      label: "CRM Requirements Builder",
    },
  ],
  downloadFiles: [
    {
      href: "/resources/crm-field-mapping-template.xlsx",
      label: "Download Excel Template",
      format: "xlsx",
    },
    {
      href: "/resources/crm-field-mapping-template.pdf",
      label: "View PDF Guide",
      format: "pdf",
    },
    {
      href: "/resources/crm-field-mapping-template.md",
      label: "Markdown outline",
      format: "md",
    },
    {
      href: "/resources/crm-field-mapping-template.csv",
      label: "CSV starter columns",
      format: "csv",
    },
  ],
  primaryCta: {
    href: "/resources/crm-field-mapping-template.xlsx",
    label: "Download Excel Template",
  },
  secondaryCta: {
    href: "/resources/crm-field-mapping-template.pdf",
    label: "View PDF Guide",
  },
  previewHref: "#preview",
  useBefore: ["crm-data-migration-template", "crm-requirements-template"],
  useWith: ["crm-migration-checklist", "crm-data-migration-template"],
  useNext: ["crm-migration-checklist", "crm-go-live-checklist"],
  relatedResourceSlugs: [
    "crm-data-migration-template",
    "crm-migration-checklist",
    "crm-implementation-checklist",
    "crm-security-checklist",
    "crm-go-live-checklist",
    "crm-comparison-worksheet",
    "crm-business-case-template",
  ],
  heroVisual: {
    src: "/resources/crm-field-mapping-template-hero.png",
    alt: "CRM field mapping flow: source CRM to object mapping to field mapping to transform to validation to target CRM.",
  },
  needsVisual: {
    src: "/resources/crm-field-mapping-template-needs.png",
    alt: "Diagram of field mapping needs: objects, fields, transforms, value maps, validation, and readiness.",
  },
  workflowVisual: {
    src: "/resources/crm-field-mapping-template-workflow.png",
    alt: "Six-step field mapping workflow: inventory, object map, field map, transforms, validate, sign off.",
  },
  lastReviewedAt: "2026-08-15",
};
