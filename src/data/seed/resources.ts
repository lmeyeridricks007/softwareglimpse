import type { z } from "zod";
import { ResourceSchema } from "@/domain";

type ResourceInput = z.input<typeof ResourceSchema>;

function resource(
  input: Omit<ResourceInput, "metadata" | "seo"> &
    Partial<Pick<ResourceInput, "metadata" | "seo">>,
): ResourceInput {
  const description =
    input.description ??
    input.shortDescription ??
    `${input.name} CRM resource.`;
  return {
    ...input,
    metadata: {
      status: "published",
      researchStatus: "complete",
      seoStatus: "optimized",
      publishedAt: "2026-08-14T12:00:00.000Z",
      reviewedAt: "2026-08-15T12:00:00.000Z",
      ...input.metadata,
    },
    seo: {
      indexable: true,
      canonicalPath: `/resources/${input.slug}/`,
      title: `${input.name} | SoftwareGlimpse`,
      description,
      ...input.seo,
    },
  };
}

/** CRM downloadable resources — editorial gate approved (indexable). */
export const resourcesSeed: ResourceInput[] = [
  resource({
    id: "res-crm-evaluation-checklist",
    slug: "crm-evaluation-checklist",
    name: "CRM Evaluation Checklist",
    shortTitle: "Evaluation Checklist",
    kind: "checklist",
    stage: "choose",
    resourceType: "CHECKLIST",
    buyingStage: "EVALUATE",
    jobToBeDone:
      "Run the same evidence-based checks on every shortlisted CRM during demos and trials.",
    bestFor: ["CRM buying teams", "Ops leads", "Founders evaluating vendors"],
    timeToComplete: "30–60 min / vendor",
    difficulty: "moderate",
    sortOrder: 1,
    shortDescription:
      "Verify workflow, email sync, reporting, admin, and commercial fit with Pass/Partial/Fail evidence.",
    description:
      "A focused CRM evaluation checklist for demos and trials — same checks, evidence capture, and Pass/Partial/Fail results for every vendor. Pair with the Requirements Template and Vendor Scorecard.",
    categorySlugs: ["crm"],
    seo: {
      title: "CRM Evaluation Checklist (Excel + PDF) | SoftwareGlimpse",
      description:
        "Download a free CRM evaluation checklist. Run the same evidence-based checks in every demo or trial — workflow, email, reporting, admin, and commercial fit.",
    },
  }),
  resource({
    id: "res-crm-requirements-template",
    slug: "crm-requirements-template",
    name: "CRM Requirements Template",
    shortTitle: "Requirements Template",
    kind: "template",
    stage: "choose",
    resourceType: "TEMPLATE",
    buyingStage: "DEFINE",
    jobToBeDone:
      "Capture must-haves, constraints, and acceptance checks before shortlisting.",
    bestFor: ["Buying committees", "Ops leads"],
    timeToComplete: "1–3 hours",
    difficulty: "moderate",
    sortOrder: 2,
    shortDescription:
      "Capture must-haves, nice-to-haves, and constraints before vendor demos.",
    description:
      "A structured CRM requirements template for outcomes, must-have capabilities, integrations, roles, and constraints — the gate artifact before shortlisting.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-vendor-scorecard",
    slug: "crm-vendor-scorecard",
    name: "CRM Vendor Scorecard",
    shortTitle: "Vendor Scorecard",
    kind: "scorecard",
    stage: "choose",
    resourceType: "SCORECARD",
    buyingStage: "EVALUATE",
    jobToBeDone:
      "Score shortlisted CRMs on weighted criteria with evidence confidence and must-have gates.",
    bestFor: ["Buying committees", "RevOps", "Evaluation leads"],
    timeToComplete: "After demos / trials — half-day to multi-day",
    difficulty: "moderate",
    sortOrder: 3,
    shortDescription:
      "Weighted CRM vendor scorecard: 1–5 scores, confidence, must-have gates, and decision archive.",
    description:
      "A CRM vendor scorecard workbook for scoring shortlisted platforms against weighted requirements with evidence confidence and must-have gates — companion to the interactive Vendor Scorecard tool. Not a Pass/Fail checklist; hand off to the Decision Matrix for TCO and final selection.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-rfp-template",
    slug: "crm-rfp-template",
    name: "CRM RFP Template",
    shortTitle: "RFP Template",
    kind: "template",
    stage: "choose",
    resourceType: "RFP_TEMPLATE",
    buyingStage: "VALIDATE",
    jobToBeDone:
      "Issue a structured CRM RFP so vendors return comparable responses, pricing, and implementation assumptions.",
    bestFor: ["Procurement", "Ops", "IT", "Selection leads"],
    timeToComplete: "Half-day to customise; vendor response window separate",
    difficulty: "advanced",
    sortOrder: 4,
    shortDescription:
      "Vendor-facing CRM RFP with stable requirement IDs, delivery methods, and pricing sheets — not a Pass/Fail checklist.",
    description:
      "A CRM RFP workbook for comparable vendor responses: Native/Config/Custom/Partner/Roadmap delivery methods, normalised pricing, security evidence, and declaration. Feeds the Vendor Scorecard and Decision Matrix.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-demo-checklist",
    slug: "crm-demo-checklist",
    name: "CRM Demo Checklist",
    shortTitle: "Demo Checklist",
    kind: "checklist",
    stage: "choose",
    resourceType: "CHECKLIST",
    buyingStage: "EVALUATE",
    jobToBeDone:
      "Run buyer-led CRM demos with identical live scenarios and same-day scores.",
    bestFor: ["Demo facilitators", "Buying teams"],
    timeToComplete: "45–90 min / demo",
    difficulty: "moderate",
    sortOrder: 5,
    shortDescription:
      "Run buyer-led CRM demos with scripted scenarios and scoring prompts.",
    description:
      "A CRM demo checklist for agenda ownership, scenario scripts, scoring during the session, and follow-ups — so demos do not become vendor slide shows.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-implementation-checklist",
    slug: "crm-implementation-checklist",
    name: "CRM Implementation Checklist",
    shortTitle: "Implementation Checklist",
    kind: "checklist",
    stage: "implement",
    resourceType: "IMPLEMENTATION_TEMPLATE",
    buyingStage: "IMPLEMENT",
    jobToBeDone:
      "Deliver CRM rollout with object/stage/sync gates and pilot exit criteria.",
    bestFor: ["Implementation leads", "Ops"],
    timeToComplete: "Ongoing through rollout",
    difficulty: "advanced",
    sortOrder: 6,
    shortDescription:
      "Deliver CRM rollout with owners, phases, and exit gates — not hope.",
    description:
      "A CRM implementation checklist spanning planning artifacts, configuration, integrations, pilot readiness, training, and go-live gates.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-migration-checklist",
    slug: "crm-migration-checklist",
    name: "CRM Migration Checklist",
    shortTitle: "Migration Checklist",
    kind: "checklist",
    stage: "implement",
    resourceType: "MIGRATION_TEMPLATE",
    buyingStage: "IMPLEMENT",
    jobToBeDone:
      "Move CRM data safely with mapping, dry-run, cutover, and rollback gates.",
    bestFor: ["Data owners", "Ops"],
    timeToComplete: "Per migration wave",
    difficulty: "advanced",
    sortOrder: 7,
    shortDescription:
      "Move CRM data safely with cutover gates, validation, and rollback plans.",
    description:
      "A CRM migration checklist covering inventory, mapping, cleansing, dry runs, cutover, and post-migration validation.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-go-live-checklist",
    slug: "crm-go-live-checklist",
    name: "CRM Go-Live Checklist",
    shortTitle: "Go-Live Checklist",
    kind: "checklist",
    stage: "implement",
    resourceType: "CHECKLIST",
    buyingStage: "IMPLEMENT",
    jobToBeDone:
      "Launch CRM with sync heartbeat, seat roster, and day-one hygiene.",
    bestFor: ["Go-live owners"],
    timeToComplete: "1–2 days around cutover",
    difficulty: "moderate",
    sortOrder: 8,
    shortDescription:
      "Launch with support coverage, freeze windows, and day-one hygiene checks.",
    description:
      "A CRM go-live checklist for final freeze, access, communications, hypercare, and first-week operating cadence.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-training-plan",
    slug: "crm-training-plan",
    name: "CRM Training Plan",
    shortTitle: "Training Plan",
    kind: "planner",
    stage: "implement",
    resourceType: "PLANNING_PACK",
    buyingStage: "IMPLEMENT",
    jobToBeDone:
      "Plan role-based CRM training so adoption sticks after go-live.",
    bestFor: ["Enablement", "Ops"],
    timeToComplete: "2–6 hours to plan",
    difficulty: "moderate",
    sortOrder: 9,
    shortDescription:
      "Plan role-based CRM training so adoption sticks after go-live.",
    description:
      "A CRM training plan template for audiences, curricula, practice scenarios, owners, and reinforcement after launch.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-data-migration-template",
    slug: "crm-data-migration-template",
    name: "CRM Data Migration Template",
    shortTitle: "Data Migration Template",
    kind: "template",
    stage: "implement",
    resourceType: "MIGRATION_TEMPLATE",
    buyingStage: "IMPLEMENT",
    jobToBeDone:
      "Inventory CRM objects, volumes, owners, and load order.",
    bestFor: ["Migration leads"],
    timeToComplete: "2–8 hours",
    difficulty: "advanced",
    sortOrder: 10,
    shortDescription:
      "Inventory objects, volumes, owners, and load order for CRM data moves.",
    description:
      "A CRM data migration template for object inventory, volume estimates, ownership, dependencies, and load sequencing.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-field-mapping-template",
    slug: "crm-field-mapping-template",
    name: "CRM Field Mapping Template",
    shortTitle: "Field Mapping Template",
    kind: "template",
    stage: "implement",
    resourceType: "MIGRATION_TEMPLATE",
    buyingStage: "IMPLEMENT",
    jobToBeDone:
      "Map source→target CRM objects and fields with transforms, value maps, owners, and migration readiness.",
    bestFor: [
      "Migration leads",
      "CRM admins",
      "RevOps",
      "Implementation partners",
      "Data engineers",
    ],
    timeToComplete: "Per object set — workshop to multi-day",
    difficulty: "advanced",
    sortOrder: 11,
    shortDescription:
      "Source→target CRM field mapping workbook: objects, transforms, picklists, lookups, validation, readiness.",
    description:
      "A CRM field mapping workbook for migration and implementation — inventory source fields, map to target objects/fields, define transformations and picklist value maps, assign owners, validate samples, and determine mapping readiness. Not an evaluation checklist.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-security-checklist",
    slug: "crm-security-checklist",
    name: "CRM Security Checklist",
    shortTitle: "Security Checklist",
    kind: "checklist",
    stage: "security",
    resourceType: "AUDIT_TEMPLATE",
    buyingStage: "VALIDATE",
    jobToBeDone:
      "Review SSO, roles, exports, email-sync privacy, and access reviews.",
    bestFor: ["IT / security", "Ops"],
    timeToComplete: "2–6 hours",
    difficulty: "advanced",
    sortOrder: 12,
    shortDescription:
      "Review CRM access, SSO, exports, audit logs, and permission hygiene.",
    description:
      "A CRM security checklist for identity, roles, data export controls, auditability, and ongoing access reviews.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-comparison-worksheet",
    slug: "crm-comparison-worksheet",
    name: "CRM Decision Matrix",
    shortTitle: "Decision Matrix",
    kind: "worksheet",
    stage: "compare",
    resourceType: "MATRIX",
    buyingStage: "DECIDE",
    jobToBeDone:
      "Compare CRM finalists with must-have gates, weighted criteria, evidence, cost and risk — then recommend.",
    bestFor: [
      "Buying committees",
      "Selection leads",
      "Sponsors",
      "RevOps",
      "Finance",
    ],
    timeToComplete: "Half-day to multi-day",
    difficulty: "advanced",
    sortOrder: 13,
    shortDescription:
      "Multi-vendor CRM decision matrix: gates, weighted fit, evidence, TCO, risk, recommendation.",
    description:
      "A CRM decision matrix workbook for comparing shortlisted platforms using must-have gates, weighted criteria with evidence confidence, cost/TCO, risk, sensitivity, and a written recommendation — not a single-vendor checklist.",
    categorySlugs: ["crm"],
    seo: {
      title: "CRM Decision Matrix (Excel + PDF) | SoftwareGlimpse",
      description:
        "Download a free CRM decision matrix. Compare finalists with must-have gates, weighted scores, evidence confidence, TCO and risk — then document the recommendation.",
    },
  }),
  resource({
    id: "res-crm-business-case-template",
    slug: "crm-business-case-template",
    name: "CRM Business Case Template",
    shortTitle: "Business Case",
    kind: "template",
    stage: "choose",
    resourceType: "DECISION_TEMPLATE",
    buyingStage: "DECIDE",
    jobToBeDone:
      "Build an approval-ready CRM business case with current-state cost, options, TCO, benefits, risks, and the decision ask.",
    bestFor: [
      "Sales Ops",
      "RevOps",
      "Sponsors",
      "Finance",
      "IT",
      "Procurement",
    ],
    timeToComplete: "Half-day to multi-day",
    difficulty: "advanced",
    sortOrder: 14,
    shortDescription:
      "Approval-ready CRM case: current-state cost, options, TCO, benefits, ROI assumptions, risks, decision.",
    description:
      "A CRM business case workbook for problem, current-state cost, outcomes, options, total cost of ownership, benefits modelling with confidence labels, financial justification, risks, realisation plan, recommendation, and sponsor approval — not an evaluation checklist.",
    categorySlugs: ["crm"],
    seo: {
      title: "CRM Business Case Template (PDF + Excel) | SoftwareGlimpse",
      description:
        "Download a free CRM business case template. Build an approval-ready case with current-state costs, options, TCO, expected benefits, ROI assumptions, risks, and the decision request.",
    },
  }),
  resource({
    id: "res-crm-optimization-checklist",
    slug: "crm-optimization-checklist",
    name: "CRM Optimization Checklist",
    shortTitle: "Optimization Checklist",
    kind: "checklist",
    stage: "optimize",
    resourceType: "AUDIT_TEMPLATE",
    buyingStage: "OPTIMIZE",
    jobToBeDone:
      "Improve live CRM adoption, hygiene, reporting trust, and automation debt.",
    bestFor: ["CRM admins", "Ops"],
    timeToComplete: "Half-day review",
    difficulty: "moderate",
    sortOrder: 15,
    shortDescription:
      "Improve live CRM adoption, hygiene, reporting, and process fit.",
    description:
      "A CRM optimization checklist for adoption signals, process debt, reporting trust, and incremental improvements.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-cleanup-checklist",
    slug: "crm-cleanup-checklist",
    name: "CRM Cleanup Checklist",
    shortTitle: "Cleanup Checklist",
    kind: "checklist",
    stage: "optimize",
    resourceType: "AUDIT_TEMPLATE",
    buyingStage: "OPTIMIZE",
    jobToBeDone:
      "Clean duplicates, stale owners, unused fields, and orphan automations safely.",
    bestFor: ["CRM admins"],
    timeToComplete: "Ongoing sprints",
    difficulty: "moderate",
    sortOrder: 16,
    shortDescription:
      "Clean duplicates, stale owners, unused fields, and dead automation.",
    description:
      "A CRM cleanup checklist for data hygiene, field sprawl, inactive users, and automation debt — without breaking live reporting.",
    categorySlugs: ["crm"],
  }),
  resource({
    id: "res-crm-uat-test-script",
    slug: "crm-uat-test-script",
    name: "CRM UAT Test Script Worksheet",
    shortTitle: "UAT Test Script",
    kind: "worksheet",
    stage: "implement",
    resourceType: "WORKSHEET",
    buyingStage: "IMPLEMENT",
    jobToBeDone:
      "Run the same user-acceptance cases, with evidence, before CRM cutover.",
    bestFor: ["Implementation leads", "CRM admins", "UAT owners"],
    timeToComplete: "Half day to script; hours to run",
    difficulty: "moderate",
    sortOrder: 17,
    shortDescription:
      "Role-based UAT cases, expected results, and sign-off before go-live.",
    description:
      "A CRM UAT worksheet for persona, starting data, steps, expected state, evidence, and Pass/Partial/Fail — the same scripts on every dry run. Not a vendor scorecard.",
    categorySlugs: ["crm"],
    seo: {
      title: "CRM UAT Test Script Worksheet | SoftwareGlimpse",
      description:
        "Download a free CRM UAT worksheet. Script the same role-based cases, capture evidence, and sign only what you ran before cutover.",
    },
  }),
];
