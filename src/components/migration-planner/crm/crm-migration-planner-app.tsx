/**
 * CRM Migration Planner — plan, map, validate readiness.
 * Persistence: localStorage `sg-crm-migration-plan-v1`
 * Does not execute ETL or invent product import capabilities.
 */
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Check,
  Copy,
  Download,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { track } from "@/analytics";
import type {
  CrmDecisionProfile,
  CrmMigrationPlan,
  EvidenceSupportStatus,
  FieldMapping,
  FieldMappingStatus,
  MigrationObjectKey,
  MigrationPriority,
  TransformationKind,
  TriStateKnown,
  UatTestStatus,
} from "@/domain";
import {
  DEFAULT_CRM_OBJECT_CATALOGUE,
  createEmptyCrmMigrationPlan,
} from "@/domain";
import { loadCrmDecisionProfile } from "@/services/decision-profile/client";
import {
  loadCrmImplementationPlan,
  saveCrmImplementationPlan,
} from "@/services/implementation-planner";
import {
  applyFieldSuggestions,
  applyImplementationHandoff,
  applyTcoHandoff,
  buildMigrationDashboard,
  bulkUpdateFieldMappings,
  complexityLevelLabel,
  downloadMigrationPlanExcel,
  downloadMigrationPlanPdf,
  downloadTextFile,
  fieldMappingProgress,
  fieldMappingToCsv,
  generateMigrationPlan,
  loadCrmMigrationPlan,
  migrationChecklistText,
  migrationPlanToPlainText,
  potentialDataLossWarnings,
  prefillMigrationFromContext,
  previewImplementationHandoff,
  previewTcoHandoff,
  resetCrmMigrationPlan,
  saveCrmMigrationPlan,
  seedPlanFromContext,
  setFieldMappingStatus,
  totalRecordEstimate,
} from "@/services/migration-planner";
import {
  createEmptyTcoSession,
  loadCrmTcoSession,
  saveCrmTcoSession,
} from "@/services/tco";
import { ProductLogo } from "@/components/software/product-logo";
import { FinderStepper } from "@/components/finder/finder-stepper";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { MigrationPlanGenerating } from "../framework/migration-plan-generating";
import { MigrationPlanReport } from "../framework/migration-plan-report";
import { MigrationSummaryPanel } from "../framework/migration-summary";
import { MigrationWizardFooter } from "../framework/migration-wizard-footer";
import { FieldStatusChip, SeverityChip } from "../framework/status";

/** Guided wizard stages — order is the user journey. */
const WIZARD_STAGES = [
  { id: "setup", label: "Setup" },
  { id: "sources", label: "Sources" },
  { id: "inventory", label: "Inventory" },
  { id: "field-mapping", label: "Fields" },
  { id: "users", label: "Users" },
  { id: "pipelines", label: "Pipelines" },
  { id: "cleaning", label: "Cleaning" },
  { id: "test", label: "Test" },
  { id: "validation", label: "Validate" },
  { id: "cutover", label: "Cutover" },
  { id: "risks", label: "Risks" },
  { id: "results", label: "Results" },
  { id: "export", label: "Export" },
] as const;

type SectionId = (typeof WIZARD_STAGES)[number]["id"];

function normalizeSectionId(raw: string | undefined): SectionId {
  if (!raw) return "setup";
  if (raw === "overview" || raw === "checklist" || raw === "report") {
    return "results";
  }
  if (WIZARD_STAGES.some((s) => s.id === raw)) return raw as SectionId;
  return "setup";
}

type ProductOption = {
  slug: string;
  name: string;
  logo: { src: string; alt: string } | null;
};

type Props = {
  productOptions: ProductOption[];
  resourceLinks?: Array<{ href: string; label: string }>;
  /** When the page shell already emits an SSR H1, pass `"none"`. */
  titleElement?: "h1" | "h2" | "none";
};

const PANEL =
  "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6";
const INPUT =
  "w-full min-h-10 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm text-[var(--sg-color-text)] transition-colors placeholder:text-[var(--sg-color-text-muted)] focus-visible:border-[var(--sg-color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-color-primary)]/20";
const SELECT = INPUT;
const FIELD = "flex min-w-0 flex-col gap-1.5 [&_label]:mb-0";
const FIELD_GRID =
  "grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 xl:grid-cols-3";
const WORKSPACE_CARD =
  "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 sm:p-5";


const TRUST_ITEMS = [
  "Inventory source systems and objects",
  "Map fields with explicit unknowns",
  "Validate before cutover",
  "Export specs — no auto-migration",
];

const EXAMPLE_ROWS = [
  { label: "From", value: "Pipedrive" },
  { label: "To", value: "HubSpot" },
  { label: "Records", value: "~12,400" },
  { label: "Complexity", value: "Moderate" },
  { label: "Fields mapped", value: "68%" },
  { label: "Go-live", value: "Q4 2026" },
] as const;

const EXAMPLE_CONTACT_FIELDS: Array<{
  sourceField: string;
  sourceType: string;
  exampleValue: string;
}> = [
  { sourceField: "FirstName", sourceType: "text", exampleValue: "Jane" },
  { sourceField: "LastName", sourceType: "text", exampleValue: "Smith" },
  { sourceField: "Email", sourceType: "email", exampleValue: "jane@example.com" },
  { sourceField: "Phone", sourceType: "phone", exampleValue: "+1 555 0100" },
  { sourceField: "Organization", sourceType: "text", exampleValue: "Acme Ltd" },
];

const SOURCE_TYPES = [
  { value: "existing-crm", label: "Existing CRM" },
  { value: "spreadsheet", label: "Spreadsheet" },
  { value: "database", label: "Database" },
  { value: "marketing-platform", label: "Marketing platform" },
  { value: "customer-service", label: "Customer service" },
  { value: "erp", label: "ERP" },
  { value: "custom-application", label: "Custom application" },
  { value: "other", label: "Other" },
] as const;

const RESEARCH_OPTIONS: Array<{ value: EvidenceSupportStatus; label: string }> = [
  { value: "verified", label: "Verified" },
  { value: "partial", label: "Partial" },
  { value: "not-researched", label: "Not covered" },
  { value: "unknown", label: "Unknown" },
];

const PRIORITY_OPTIONS: Array<{ value: MigrationPriority; label: string }> = [
  { value: "must-migrate", label: "Must migrate" },
  { value: "should-migrate", label: "Should migrate" },
  { value: "archive-only", label: "Archive only" },
  { value: "do-not-migrate", label: "Do not migrate" },
  { value: "unknown", label: "Unknown" },
];

const FIELD_STATUS_OPTIONS: Array<{ value: FieldMappingStatus; label: string }> = [
  { value: "mapped", label: "Mapped" },
  { value: "needs-review", label: "Needs review" },
  { value: "no-target-field", label: "No target field" },
  { value: "transformation-needed", label: "Transformation needed" },
  { value: "do-not-migrate", label: "Do not migrate" },
  { value: "suggested", label: "Suggested" },
  { value: "unknown", label: "Unknown" },
];

const TRANSFORM_OPTIONS: Array<{ value: TransformationKind; label: string }> = [
  { value: "none", label: "None" },
  { value: "format", label: "Format" },
  { value: "value-mapping", label: "Value mapping" },
  { value: "user-mapping", label: "User mapping" },
  { value: "truncate", label: "Truncate" },
  { value: "format-conversion", label: "Format conversion" },
  { value: "boolean-conversion", label: "Boolean conversion" },
  { value: "concatenate", label: "Concatenate" },
  { value: "split", label: "Split" },
  { value: "country-normalization", label: "Country normalization" },
  { value: "currency-normalization", label: "Currency normalization" },
  { value: "id-mapping", label: "ID mapping" },
  { value: "other", label: "Other" },
];

const TRI_STATE: Array<{ value: TriStateKnown; label: string }> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unknown", label: "Unknown" },
];

const UAT_STATUS: Array<{ value: UatTestStatus; label: string }> = [
  { value: "not-tested", label: "Not tested" },
  { value: "passed", label: "Passed" },
  { value: "partial", label: "Partial" },
  { value: "failed", label: "Failed" },
  { value: "blocked", label: "Blocked" },
];

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function SectionHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-[var(--sg-color-border)] pb-4">
      <div className="min-w-0 max-w-xl">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--sg-color-navy)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}

function Label({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
    >
      {children}
    </label>
  );
}

function SummaryCards({ plan }: { plan: CrmMigrationPlan }) {
  const from =
    plan.sourceSystems.map((s) => s.name).join(", ") || "Not specified";
  const to =
    plan.targetProductName ??
    (plan.vendorNeutral ? "Vendor-neutral" : "Not selected");
  const records = totalRecordEstimate(plan);
  const complexity = plan.complexity
    ? complexityLevelLabel(plan.complexity.level)
    : "—";

  const cards = [
    { label: "From", value: from },
    { label: "To", value: to },
    {
      label: "Est. records",
      value: records !== null ? `~${records.toLocaleString()}` : "—",
    },
    { label: "Complexity", value: complexity },
    { label: "Go-live", value: plan.targetGoLive ?? "Not set" },
  ];

  return (
    <div className="mb-5 overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]">
      <dl className="grid grid-cols-2 divide-x divide-y divide-[var(--sg-color-border)] sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
        {cards.map((c) => (
          <div key={c.label} className="min-w-0 px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {c.label}
            </dt>
            <dd
              className="mt-1 truncate text-sm font-semibold text-[var(--sg-color-navy)]"
              title={c.value}
            >
              {c.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function MigrationHeroExample() {
  return (
    <aside
      className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-md)]"
      aria-label="Example migration summary"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Your migration
        </p>
        <Badge variant="neutral">Example</Badge>
      </div>
      <p className="mt-1 text-[11px] text-[var(--sg-color-text-muted)]">
        Illustrative only — sample Pipedrive-style values, not your data.
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {EXAMPLE_ROWS.map((row) => (
          <div key={row.label}>
            <dt className="text-[11px] text-[var(--sg-color-text-muted)]">
              {row.label}
            </dt>
            <dd className="font-semibold text-[var(--sg-color-navy)]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export function CrmMigrationPlannerApp({
  productOptions,
  resourceLinks = [],
  titleElement = "h1",
}: Props) {
  const searchParams = useSearchParams();
  const fromHint = searchParams.get("from");

  const [plan, setPlan] = useState<CrmMigrationPlan>(() =>
    createEmptyCrmMigrationPlan(),
  );
  const [profile, setProfile] = useState<CrmDecisionProfile | null>(null);
  const [step, setStep] = useState<SectionId>("setup");
  const [maxStepIndex, setMaxStepIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [started, setStarted] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");
  const [fieldStatusFilter, setFieldStatusFilter] = useState<
    "all" | "mapped" | "needs-review" | "unmapped"
  >("all");
  const [fieldObjectFilter, setFieldObjectFilter] = useState("all");
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [handoffMsg, setHandoffMsg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const productBySlug = useMemo(
    () => new Map(productOptions.map((p) => [p.slug, p])),
    [productOptions],
  );

  const dashboard = useMemo(() => buildMigrationDashboard(plan), [plan]);
  const warnings = useMemo(() => potentialDataLossWarnings(plan), [plan]);
  const fieldProgress = useMemo(() => fieldMappingProgress(plan), [plan]);
  const implHandoffPreview = useMemo(
    () => previewImplementationHandoff(plan),
    [plan],
  );
  const tcoHandoffPreview = useMemo(() => previewTcoHandoff(plan), [plan]);

  const patchPlan = useCallback(
    (updater: (prev: CrmMigrationPlan) => CrmMigrationPlan) => {
      setPlan((prev) => updater(prev));
    },
    [],
  );

  useEffect(() => {
    const loadedProfile = loadCrmDecisionProfile();
    const impl = loadCrmImplementationPlan();
    const tco = loadCrmTcoSession();
    const prefill = prefillMigrationFromContext(loadedProfile, impl, tco);
    const existing = loadCrmMigrationPlan();

    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
    setProfile(loadedProfile);

    if (existing?.planGeneratedAt) {
      setPlan(existing);
      setStarted(true);
      setHasResults(true);
      const restored = normalizeSectionId(existing.wizardStepId);
      const restoredIndex = WIZARD_STAGES.findIndex((s) => s.id === restored);
      setStep(restored);
      setMaxStepIndex(Math.max(0, restoredIndex));
    } else if (existing) {
      setPlan(seedPlanFromContext(prefill, existing));
      setStarted(true);
      setHasResults(Boolean(existing.planGeneratedAt));
    }

    if (fromHint) {
      track({
        name: "crm_migration_started",
        properties: { from: fromHint },
      });
    }
    setHydrated(true);
  }, [fromHint]);

  useEffect(() => {
    if (!hydrated || !started) return;
    saveCrmMigrationPlan({ ...plan, wizardStepId: step });
  }, [plan, hydrated, started, step]);

  function goStep(next: SectionId) {
    const nextIndex = WIZARD_STAGES.findIndex((s) => s.id === next);
    setStep(next);
    if (nextIndex >= 0) {
      setMaxStepIndex((prev) => Math.max(prev, nextIndex));
    }
    document
      .getElementById("migration-workspace")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goNext() {
    const idx = WIZARD_STAGES.findIndex((s) => s.id === step);
    const next = WIZARD_STAGES[idx + 1];
    if (next) goStep(next.id);
  }

  function goBack() {
    const idx = WIZARD_STAGES.findIndex((s) => s.id === step);
    const prev = WIZARD_STAGES[idx - 1];
    if (prev) goStep(prev.id);
  }

  function regenerate() {
    patchPlan((prev) => generateMigrationPlan(prev));
    track({ name: "migration_plan_completed" });
  }

  /**
   * Show loading for ~2.5s, then land on the visual Results page.
   * Downloads are optional from Results / Export — not the primary output.
   */
  async function generatePlannerOutput() {
    if (isGenerating) return;
    setIsGenerating(true);
    setHandoffMsg(null);
    setStep("results");
    const resultsIndex = WIZARD_STAGES.findIndex((s) => s.id === "results");
    setMaxStepIndex((prev) => Math.max(prev, resultsIndex));

    const next = generateMigrationPlan(plan);
    setPlan(next);
    saveCrmMigrationPlan(next);

    await new Promise((resolve) => window.setTimeout(resolve, 2600));

    setHasResults(true);
    setIsGenerating(false);
    track({ name: "migration_plan_completed" });
    document
      .getElementById("migration-workspace")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startMigration() {
    const impl = loadCrmImplementationPlan();
    const tco = loadCrmTcoSession();
    const prefill = prefillMigrationFromContext(profile, impl, tco);
    const existing = loadCrmMigrationPlan();
    const seeded = seedPlanFromContext(prefill, existing);
    const generated = generateMigrationPlan(seeded);
    setPlan(generated);
    setStarted(true);
    setStep("setup");
    setMaxStepIndex(0);
    track({ name: "crm_migration_started", properties: { mode: "build" } });
  }

  function loadFromImplementation() {
    const impl = loadCrmImplementationPlan();
    if (!impl) {
      setHandoffMsg("No implementation plan found in this browser.");
      return;
    }
    const tco = loadCrmTcoSession();
    const prefill = prefillMigrationFromContext(profile, impl, tco);
    const seeded = seedPlanFromContext(prefill, plan);
    setPlan(generateMigrationPlan(seeded));
    setStarted(true);
    setStep("setup");
    setMaxStepIndex(0);
    track({ name: "crm_migration_started", properties: { mode: "implementation" } });
  }

  function applyProfileScope() {
    if (!profile) return;
    const impl = loadCrmImplementationPlan();
    const tco = loadCrmTcoSession();
    const prefill = prefillMigrationFromContext(profile, impl, tco);
    patchPlan((prev) =>
      generateMigrationPlan(seedPlanFromContext(prefill, prev)),
    );
    goStep("setup");
  }

  function resetAll() {
    setPlan(resetCrmMigrationPlan());
    setStarted(false);
    setStep("setup");
    setMaxStepIndex(0);
    setSelectedFields(new Set());
    setHasResults(false);
    setIsGenerating(false);
    setHandoffMsg(null);
  }

  function addExampleContactFields() {
    const sourceId = plan.sourceSystems[0]?.id;
    if (!sourceId) return;
    const existing = new Set(
      plan.fieldMappings.map((m) => `${m.sourceField}:${m.sourceObject}`),
    );
    const additions: FieldMapping[] = EXAMPLE_CONTACT_FIELDS.filter(
      (f) => !existing.has(`${f.sourceField}:contacts`),
    ).map((f) => ({
      id: uid("fm"),
      sourceSystemId: sourceId,
      sourceObject: "contacts",
      sourceField: f.sourceField,
      sourceType: f.sourceType,
      exampleValue: f.exampleValue,
      transformation: "none" as const,
      required: f.sourceField === "Email",
      status: "unknown" as const,
      suggestionPending: false,
    }));
    if (!additions.length) return;
    patchPlan((prev) => ({
      ...prev,
      fieldMappings: [...prev.fieldMappings, ...additions],
    }));
  }

  const filteredMappings = useMemo(() => {
    return plan.fieldMappings.filter((m) => {
      if (fieldSearch) {
        const q = fieldSearch.toLowerCase();
        const hay = `${m.sourceField} ${m.targetField ?? ""} ${m.sourceObject}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (fieldObjectFilter !== "all" && m.sourceObject !== fieldObjectFilter) {
        return false;
      }
      if (fieldStatusFilter === "mapped" && m.status !== "mapped") return false;
      if (
        fieldStatusFilter === "needs-review" &&
        m.status !== "needs-review" &&
        m.status !== "transformation-needed" &&
        m.status !== "suggested"
      ) {
        return false;
      }
      if (
        fieldStatusFilter === "unmapped" &&
        m.status !== "unknown" &&
        m.status !== "no-target-field"
      ) {
        return false;
      }
      return true;
    });
  }, [plan.fieldMappings, fieldSearch, fieldObjectFilter, fieldStatusFilter]);

  const objectLabels = useMemo(() => {
    const keys = new Set(plan.fieldMappings.map((m) => m.sourceObject));
    return [...keys];
  }, [plan.fieldMappings]);

  function addSource() {
    const id = uid("src");
    patchPlan((prev) => ({
      ...prev,
      sourceSystems: [
        ...prev.sourceSystems,
        {
          id,
          name: "Source system",
          type: "existing-crm",
          exportAvailable: "unknown",
          apiAvailable: "unknown",
          formatKnown: "unknown",
        },
      ],
    }));
    track({ name: "migration_source_added" });
  }

  function addObject() {
    const sourceId = plan.sourceSystems[0]?.id ?? uid("src");
    const key: MigrationObjectKey = "contacts";
    const label =
      DEFAULT_CRM_OBJECT_CATALOGUE.find((o) => o.key === key)?.label ?? key;
    patchPlan((prev) => ({
      ...prev,
      sourceSystems:
        prev.sourceSystems.length > 0
          ? prev.sourceSystems
          : [
              {
                id: sourceId,
                name: "Source system",
                type: "existing-crm" as const,
                exportAvailable: "unknown" as const,
                apiAvailable: "unknown" as const,
                formatKnown: "unknown" as const,
              },
            ],
      objects: [
        ...prev.objects,
        {
          id: uid("obj"),
          sourceSystemId: prev.sourceSystems[0]?.id ?? sourceId,
          objectKey: key,
          sourceObjectLabel: label,
          priority: "unknown",
          historyDepth: "unknown",
          status: "not-started",
          required: true,
        },
      ],
    }));
    track({ name: "migration_object_added" });
  }

  function runFieldSuggestions() {
    patchPlan((prev) => {
      const { mappings } = applyFieldSuggestions(prev.fieldMappings);
      return { ...prev, fieldMappings: mappings };
    });
  }

  function confirmMapping(id: string) {
    patchPlan((prev) => setFieldMappingStatus(prev, id, "mapped"));
    track({ name: "migration_mapping_confirmed" });
  }

  function bulkDoNotMigrate() {
    if (selectedFields.size === 0) return;
    if (
      !window.confirm(
        `Mark ${selectedFields.size} selected field(s) as do not migrate?`,
      )
    ) {
      return;
    }
    patchPlan((prev) =>
      bulkUpdateFieldMappings(prev, [...selectedFields], {
        status: "do-not-migrate",
        suggestionPending: false,
      }),
    );
    setSelectedFields(new Set());
  }

  function markTestStarted() {
    patchPlan((prev) => ({
      ...prev,
      testMigration: { ...prev.testMigration, status: "in-progress" },
    }));
    track({ name: "migration_test_started" });
  }

  function markValidationComplete() {
    track({ name: "migration_validation_completed" });
  }

  async function copyText(text: string, format: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
      track({ name: "migration_exported", properties: { format } });
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      // ignore
    }
  }

  function applyImplHandoff() {
    const impl = loadCrmImplementationPlan();
    if (!impl) {
      setHandoffMsg("No implementation plan found.");
      return;
    }
    if (
      !window.confirm(
        `${implHandoffPreview.message}\n\nProceed with ${implHandoffPreview.taskCount} task(s)?`,
      )
    ) {
      return;
    }
    saveCrmImplementationPlan(applyImplementationHandoff(impl, plan));
    track({ name: "migration_to_implementation" });
    setHandoffMsg("Implementation plan updated.");
  }

  function applyTco() {
    const session = loadCrmTcoSession() ?? createEmptyTcoSession();
    if (
      !window.confirm(`${tcoHandoffPreview.message}\n\nApply to TCO session?`)
    ) {
      return;
    }
    saveCrmTcoSession(applyTcoHandoff(session, plan));
    track({ name: "migration_to_tco" });
    setHandoffMsg("TCO session updated.");
  }

  if (!hydrated) {
    return (
      <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
        Loading migration planner…
      </p>
    );
  }

  if (!started) {
    const TitleTag = titleElement === "h2" ? "h2" : "h1";
    return (
      <div className="mt-6">
        <header className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              CRM Migration Planner
            </p>
            {titleElement !== "none" ? (
              <TitleTag className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold text-[var(--sg-color-navy)]">
                Plan your CRM data migration
              </TitleTag>
            ) : null}
            <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
              Inventory source systems, map fields, validate readiness and export
              migration specs. SoftwareGlimpse plans the move — it does not
              execute data transfer or assume vendor import capabilities.
            </p>
            <ul className="mt-5 space-y-2">
              {TRUST_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={startMigration}>Build migration plan</Button>
              <Button variant="outline" onClick={loadFromImplementation}>
                Load implementation plan
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <MigrationHeroExample />
          </div>
        </header>
        {profile ? (
          <Alert className="mt-6" variant="info">
            <p className="font-medium text-[var(--sg-color-navy)]">
              Using your existing implementation profile
            </p>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Target CRM, users and migration scope can be reused from your
              requirements profile.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={startMigration}>
                Use profile
              </Button>
              <ButtonLink
                href="/tools/crm-requirements-builder/?from=migration"
                variant="outline"
                size="sm"
              >
                Edit migration scope
              </ButtonLink>
            </div>
          </Alert>
        ) : null}
        {handoffMsg ? (
          <Alert className="mt-4" variant="warning">
            {handoffMsg}
          </Alert>
        ) : null}
      </div>
    );
  }

  const targetProduct = plan.targetProductId
    ? productBySlug.get(plan.targetProductId)
    : undefined;

  const nextSteps = (
    <ul className="list-disc space-y-1 pl-4 text-[var(--sg-color-text-muted)]">
      {plan.sourceSystems.length === 0 ? (
        <li>
          <button
            type="button"
            className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            onClick={() => goStep("sources")}
          >
            Add source systems
          </button>
        </li>
      ) : null}
      {fieldProgress.total === 0 ? (
        <li>
          <button
            type="button"
            className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            onClick={() => goStep("inventory")}
          >
            Build object inventory
          </button>
        </li>
      ) : null}
      {fieldProgress.percentMapped !== null && fieldProgress.percentMapped < 80 ? (
        <li>
          <button
            type="button"
            className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            onClick={() => goStep("field-mapping")}
          >
            Complete field mapping
          </button>
        </li>
      ) : null}
      {plan.testMigration.status === "not-started" ? (
        <li>
          <button
            type="button"
            className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            onClick={() => goStep("test")}
          >
            Plan test migration
          </button>
        </li>
      ) : null}
      <li>
        <button
          type="button"
          className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          onClick={() => goStep("results")}
        >
          View migration results
        </button>
      </li>
    </ul>
  );

  const activeIndex = WIZARD_STAGES.findIndex((s) => s.id === step);
  const isLastStep = activeIndex >= WIZARD_STAGES.length - 1;
  const isFirstStep = activeIndex <= 0;

  return (
    <div className="mt-6 pb-28 lg:pb-8">
      {profile && plan.decisionProfileUpdatedAt ? (
        <Alert className="mb-4" variant="info">
          <p className="font-medium text-[var(--sg-color-navy)]">
            Using your existing implementation profile
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" onClick={applyProfileScope}>
              Use profile
            </Button>
            <ButtonLink
              href="/tools/crm-requirements-builder/?from=migration"
              variant="outline"
              size="sm"
            >
              Edit migration scope
            </ButtonLink>
          </div>
        </Alert>
      ) : null}

      <SummaryCards plan={plan} />

      {!isGenerating ? (
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <FinderStepper
          className="mb-0 min-w-0 flex-1"
          stages={[...WIZARD_STAGES]}
          activeIndex={Math.max(0, activeIndex)}
          maxReachableIndex={maxStepIndex}
          onStageSelect={(id) => goStep(id as SectionId)}
        />
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={resetAll}
        >
          <RotateCcw className="size-3.5" aria-hidden /> Reset
        </Button>
      </div>
      ) : null}

      <div
        className={cn(
          "grid gap-5 lg:items-start",
          step === "field-mapping" ||
          step === "results" ||
          isGenerating
            ? "lg:grid-cols-1"
            : "lg:grid-cols-[minmax(0,1fr)_16.5rem] xl:grid-cols-[minmax(0,1fr)_17.5rem]",
        )}
      >
        <main className={PANEL} id="migration-workspace">
          {isGenerating ? <MigrationPlanGenerating /> : null}

          {!isGenerating ? (
            <>
          {step === "setup" && (
            <>
              <SectionHeader
                title="Setup"
                description="Confirm the target CRM and go-live date. Product-specific import support stays unknown until covered."
              >
                <Button size="sm" variant="outline" onClick={regenerate}>
                  Refresh derived plan
                </Button>
              </SectionHeader>
              <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className={FIELD}>
                  <Label htmlFor="target-product">Target CRM</Label>
                  <select
                    id="target-product"
                    className={SELECT}
                    value={plan.vendorNeutral ? "" : (plan.targetProductId ?? "")}
                    onChange={(e) => {
                      const slug = e.target.value;
                      if (!slug) {
                        patchPlan((p) => ({
                          ...p,
                          targetProductId: undefined,
                          targetProductName: undefined,
                          vendorNeutral: true,
                        }));
                        return;
                      }
                      const prod = productBySlug.get(slug);
                      patchPlan((p) => ({
                        ...p,
                        targetProductId: slug,
                        targetProductName: prod?.name,
                        vendorNeutral: false,
                      }));
                    }}
                  >
                    <option value="">Vendor-neutral</option>
                    {productOptions.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {targetProduct ? (
                    <div className="flex items-center gap-2 pt-1">
                      <ProductLogo
                        name={targetProduct.name}
                        logo={targetProduct.logo}
                        size="sm"
                      />
                      <span className="text-sm text-[var(--sg-color-text)]">
                        {targetProduct.name}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className={FIELD}>
                  <Label htmlFor="target-plan">Target plan label</Label>
                  <input
                    id="target-plan"
                    className={INPUT}
                    value={plan.targetPlanLabel ?? ""}
                    onChange={(e) =>
                      patchPlan((p) => ({
                        ...p,
                        targetPlanLabel: e.target.value || undefined,
                      }))
                    }
                    placeholder="e.g. Professional"
                  />
                </div>
                <div className={FIELD}>
                  <Label htmlFor="research-status">Migration coverage status</Label>
                  <select
                    id="research-status"
                    className={SELECT}
                    value={plan.migrationResearchStatus}
                    onChange={(e) =>
                      patchPlan((p) => ({
                        ...p,
                        migrationResearchStatus: e.target
                          .value as EvidenceSupportStatus,
                      }))
                    }
                  >
                    {RESEARCH_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={FIELD}>
                  <Label htmlFor="go-live">Target go-live</Label>
                  <input
                    id="go-live"
                    type="date"
                    className={INPUT}
                    value={plan.targetGoLive?.slice(0, 10) ?? ""}
                    onChange={(e) =>
                      patchPlan((p) => ({
                        ...p,
                        targetGoLive: e.target.value || undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}

          {step === "sources" && (
            <>
              <SectionHeader
                title="Source systems"
                description="One or more systems can feed the migration. Export/API support stays unknown unless you know it."
              >
                <Button size="sm" onClick={addSource}>
                  <Plus className="size-4" aria-hidden /> Add source
                </Button>
              </SectionHeader>
              <div className="space-y-3">
                {plan.sourceSystems.map((src, idx) => (
                  <article key={src.id} className={WORKSPACE_CARD}>
                    <div className="mb-4 flex items-center justify-between gap-2 border-b border-[var(--sg-color-border)] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-[var(--sg-color-surface-muted)] text-[11px] font-semibold text-[var(--sg-color-text-muted)]">
                          {idx + 1}
                        </span>
                        <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
                          {src.name || "Untitled source"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          patchPlan((p) => ({
                            ...p,
                            sourceSystems: p.sourceSystems.filter(
                              (s) => s.id !== src.id,
                            ),
                          }))
                        }
                      >
                        <Trash2 className="size-3.5" aria-hidden /> Remove
                      </Button>
                    </div>
                    <div className={FIELD_GRID}>
                      <div className={FIELD}>
                        <Label>Name</Label>
                        <input
                          className={INPUT}
                          value={src.name}
                          onChange={(e) =>
                            patchPlan((p) => ({
                              ...p,
                              sourceSystems: p.sourceSystems.map((s) =>
                                s.id === src.id
                                  ? { ...s, name: e.target.value }
                                  : s,
                              ),
                            }))
                          }
                        />
                      </div>
                      <div className={FIELD}>
                        <Label>Type</Label>
                        <select
                          className={SELECT}
                          value={src.type}
                          onChange={(e) =>
                            patchPlan((p) => ({
                              ...p,
                              sourceSystems: p.sourceSystems.map((s) =>
                                s.id === src.id
                                  ? {
                                      ...s,
                                      type: e.target.value as typeof s.type,
                                    }
                                  : s,
                              ),
                            }))
                          }
                        >
                          {SOURCE_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={FIELD}>
                        <Label>Data owner</Label>
                        <input
                          className={INPUT}
                          value={src.dataOwner ?? ""}
                          onChange={(e) =>
                            patchPlan((p) => ({
                              ...p,
                              sourceSystems: p.sourceSystems.map((s) =>
                                s.id === src.id
                                  ? {
                                      ...s,
                                      dataOwner: e.target.value || undefined,
                                    }
                                  : s,
                              ),
                            }))
                          }
                        />
                      </div>
                      {(
                        [
                          ["exportAvailable", "Export available"],
                          ["apiAvailable", "API available"],
                          ["formatKnown", "Format known"],
                        ] as const
                      ).map(([key, label]) => (
                        <div key={key} className={FIELD}>
                          <Label>{label}</Label>
                          <select
                            className={SELECT}
                            value={src[key]}
                            onChange={(e) =>
                              patchPlan((p) => ({
                                ...p,
                                sourceSystems: p.sourceSystems.map((s) =>
                                  s.id === src.id
                                    ? {
                                        ...s,
                                        [key]: e.target.value as TriStateKnown,
                                      }
                                    : s,
                                ),
                              }))
                            }
                          >
                            {TRI_STATE.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                      <div className={cn(FIELD, "sm:col-span-2 xl:col-span-3")}>
                        <Label>Notes</Label>
                        <textarea
                          className={cn(INPUT, "min-h-[4rem]")}
                          value={src.notes ?? ""}
                          onChange={(e) =>
                            patchPlan((p) => ({
                              ...p,
                              sourceSystems: p.sourceSystems.map((s) =>
                                s.id === src.id
                                  ? { ...s, notes: e.target.value || undefined }
                                  : s,
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </article>
                ))}
                {plan.sourceSystems.length === 0 ? (
                  <p className="rounded-[var(--sg-radius-lg)] border border-dashed border-[var(--sg-color-border)] px-4 py-8 text-center text-sm text-[var(--sg-color-text-muted)]">
                    No source systems yet. Add at least one source to continue.
                  </p>
                ) : null}
              </div>
            </>
          )}

          {step === "inventory" && (
            <>
              <SectionHeader
                title="Object inventory"
                description="Decide which objects move, how much history matters, and what they map to in the target CRM."
              >
                <Button size="sm" variant="outline" onClick={addExampleContactFields}>
                  Add example fields
                </Button>
                <Button size="sm" onClick={addObject}>
                  <Plus className="size-4" aria-hidden /> Add object
                </Button>
              </SectionHeader>
              <CustomFieldsPanelEditor
                plan={plan}
                onChange={(customFields) =>
                  patchPlan((p) => ({ ...p, customFields }))
                }
              />
              <div className="mt-5 space-y-3">
                {plan.objects.map((obj, idx) => (
                  <article key={obj.id} className={WORKSPACE_CARD}>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--sg-color-border)] pb-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary-soft)] text-[11px] font-semibold text-[var(--sg-color-primary)]">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--sg-color-navy)]">
                            {obj.sourceObjectLabel}
                          </p>
                          <p className="truncate text-xs text-[var(--sg-color-text-muted)]">
                            {plan.sourceSystems.find((s) => s.id === obj.sourceSystemId)
                              ?.name ?? "Source"}
                            {obj.targetObjectLabel
                              ? ` → ${obj.targetObjectLabel}`
                              : " → target TBD"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            obj.priority === "must-migrate"
                              ? "primary"
                              : obj.priority === "do-not-migrate"
                                ? "neutral"
                                : "warning"
                          }
                        >
                          {obj.priority.replace(/-/g, " ")}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            patchPlan((p) => ({
                              ...p,
                              objects: p.objects.filter((o) => o.id !== obj.id),
                            }))
                          }
                        >
                          <Trash2 className="size-3.5" aria-hidden /> Remove
                        </Button>
                      </div>
                    </div>
                    <div className={FIELD_GRID}>
                      <div className={FIELD}>
                        <Label>Source system</Label>
                        <select
                          className={SELECT}
                          value={obj.sourceSystemId}
                          onChange={(e) =>
                            patchPlan((p) => ({
                              ...p,
                              objects: p.objects.map((o) =>
                                o.id === obj.id
                                  ? { ...o, sourceSystemId: e.target.value }
                                  : o,
                              ),
                            }))
                          }
                        >
                          {plan.sourceSystems.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={FIELD}>
                        <Label>Object</Label>
                        <select
                          className={SELECT}
                          value={obj.objectKey}
                          onChange={(e) => {
                            const key = e.target.value as MigrationObjectKey;
                            const label =
                              DEFAULT_CRM_OBJECT_CATALOGUE.find(
                                (c) => c.key === key,
                              )?.label ?? key;
                            patchPlan((p) => ({
                              ...p,
                              objects: p.objects.map((o) =>
                                o.id === obj.id
                                  ? { ...o, objectKey: key, sourceObjectLabel: label }
                                  : o,
                              ),
                            }));
                          }}
                        >
                          {DEFAULT_CRM_OBJECT_CATALOGUE.map((c) => (
                            <option key={c.key} value={c.key}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={FIELD}>
                        <Label>Record count</Label>
                        <input
                          type="number"
                          min={0}
                          className={INPUT}
                          placeholder="Unknown"
                          value={obj.recordCount ?? ""}
                          onChange={(e) =>
                            patchPlan((p) => ({
                              ...p,
                              objects: p.objects.map((o) =>
                                o.id === obj.id
                                  ? {
                                      ...o,
                                      recordCount: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                    }
                                  : o,
                              ),
                            }))
                          }
                        />
                      </div>
                      <div className={FIELD}>
                        <Label>Priority</Label>
                        <select
                          className={SELECT}
                          value={obj.priority}
                          onChange={(e) =>
                            patchPlan((p) => ({
                              ...p,
                              objects: p.objects.map((o) =>
                                o.id === obj.id
                                  ? {
                                      ...o,
                                      priority: e.target.value as MigrationPriority,
                                    }
                                  : o,
                              ),
                            }))
                          }
                        >
                          {PRIORITY_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={FIELD}>
                        <Label>Target object</Label>
                        <input
                          className={INPUT}
                          placeholder="e.g. Person"
                          value={obj.targetObjectLabel ?? ""}
                          onChange={(e) =>
                            patchPlan((p) => ({
                              ...p,
                              objects: p.objects.map((o) =>
                                o.id === obj.id
                                  ? {
                                      ...o,
                                      targetObjectLabel:
                                        e.target.value || undefined,
                                    }
                                  : o,
                              ),
                            }))
                          }
                        />
                      </div>
                      <div className={FIELD}>
                        <Label>Status</Label>
                        <select
                          className={SELECT}
                          value={obj.status}
                          onChange={(e) =>
                            patchPlan((p) => ({
                              ...p,
                              objects: p.objects.map((o) =>
                                o.id === obj.id
                                  ? {
                                      ...o,
                                      status: e.target.value as typeof o.status,
                                    }
                                  : o,
                              ),
                            }))
                          }
                        >
                          {[
                            "not-started",
                            "in-progress",
                            "ready",
                            "blocked",
                            "excluded",
                          ].map((s) => (
                            <option key={s} value={s}>
                              {s.replace(/-/g, " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </article>
                ))}
                {plan.objects.length === 0 ? (
                  <p className="rounded-[var(--sg-radius-lg)] border border-dashed border-[var(--sg-color-border)] px-4 py-8 text-center text-sm text-[var(--sg-color-text-muted)]">
                    No objects yet. Add an object to start your inventory.
                  </p>
                ) : null}
              </div>
            </>
          )}

          {/* Remaining sections rendered via MigrationSectionsRest */}
          <MigrationSectionsRest
            step={step}
            plan={plan}
            patchPlan={patchPlan}
            fieldSearch={fieldSearch}
            setFieldSearch={setFieldSearch}
            fieldStatusFilter={fieldStatusFilter}
            setFieldStatusFilter={setFieldStatusFilter}
            fieldObjectFilter={fieldObjectFilter}
            setFieldObjectFilter={setFieldObjectFilter}
            selectedFields={selectedFields}
            setSelectedFields={setSelectedFields}
            filteredMappings={filteredMappings}
            objectLabels={objectLabels}
            runFieldSuggestions={runFieldSuggestions}
            confirmMapping={confirmMapping}
            bulkDoNotMigrate={bulkDoNotMigrate}
            markTestStarted={markTestStarted}
            markValidationComplete={markValidationComplete}
            copyText={copyText}
            copyDone={copyDone}
            implHandoffPreview={implHandoffPreview}
            tcoHandoffPreview={tcoHandoffPreview}
            applyImplHandoff={applyImplHandoff}
            applyTco={applyTco}
            handoffMsg={handoffMsg}
            resourceLinks={resourceLinks}
            regenerate={regenerate}
            generatePlannerOutput={generatePlannerOutput}
            hasResults={hasResults}
            goStep={goStep}
          />
            </>
          ) : null}

          {!isGenerating ? (
          <MigrationWizardFooter
            className="hidden lg:flex"
            stepIndex={Math.max(0, activeIndex)}
            totalSteps={WIZARD_STAGES.length}
            stepLabel={WIZARD_STAGES[activeIndex]?.label ?? ""}
            onBack={isFirstStep ? undefined : goBack}
            onNext={
              isLastStep
                ? undefined
                : (step === "risks" || step === "results") && !hasResults
                  ? () => {
                      void generatePlannerOutput();
                    }
                  : goNext
            }
            nextLabel={
              (step === "risks" || step === "results") && !hasResults
                ? "Generate results"
                : step === "results"
                  ? "Continue to export"
                  : "Next"
            }
          />
          ) : null}
        </main>

        {step !== "field-mapping" &&
        step !== "results" &&
        !isGenerating ? (
          <MigrationSummaryPanel
            className="hidden lg:block"
            dashboard={dashboard}
            risks={plan.risks}
            warnings={warnings}
          >
            {nextSteps}
          </MigrationSummaryPanel>
        ) : null}
      </div>

      {!isGenerating ? (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]/95 p-3 backdrop-blur lg:hidden">
        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant="outline"
            onClick={goBack}
            disabled={isFirstStep}
          >
            Back
          </Button>
          <Button
            className="flex-[1.4]"
            onClick={
              (step === "risks" || step === "results") && !hasResults
                ? () => {
                    void generatePlannerOutput();
                  }
                : goNext
            }
            disabled={
              isLastStep &&
              !((step === "risks" || step === "results") && !hasResults)
            }
          >
            {(step === "risks" || step === "results") && !hasResults
              ? "Generate results"
              : step === "results"
                ? "Continue to export"
                : "Next"}
          </Button>
        </div>
      </div>
      ) : null}
    </div>
  );
}

function CustomFieldsPanelEditor({
  plan,
  onChange,
}: {
  plan: CrmMigrationPlan;
  onChange: (cf: CrmMigrationPlan["customFields"]) => void;
}) {
  const fields = [
    ["sourceCount", "Source"],
    ["mappedCount", "Mapped"],
    ["newFieldsRequired", "New required"],
    ["transformationRequired", "Transform"],
    ["notMigrating", "Not migrating"],
    ["unknownCount", "Unknown"],
  ] as const;

  return (
    <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Custom fields
          </h3>
          <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
            Planning counts only — not product limits.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {fields.map(([key, label]) => (
          <div
            key={key}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2.5 py-2"
          >
            <Label>{label}</Label>
            <input
              type="number"
              min={0}
              className={cn(INPUT, "mt-1.5 min-h-9 px-2 py-1.5 text-center font-semibold tabular-nums")}
              value={plan.customFields[key] ?? ""}
              placeholder="—"
              onChange={(e) =>
                onChange({
                  ...plan.customFields,
                  [key]: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type SectionsRestProps = {
  step: SectionId;
  plan: CrmMigrationPlan;
  patchPlan: (fn: (p: CrmMigrationPlan) => CrmMigrationPlan) => void;
  fieldSearch: string;
  setFieldSearch: (v: string) => void;
  fieldStatusFilter: "all" | "mapped" | "needs-review" | "unmapped";
  setFieldStatusFilter: (v: "all" | "mapped" | "needs-review" | "unmapped") => void;
  fieldObjectFilter: string;
  setFieldObjectFilter: (v: string) => void;
  selectedFields: Set<string>;
  setSelectedFields: (v: Set<string>) => void;
  filteredMappings: FieldMapping[];
  objectLabels: string[];
  runFieldSuggestions: () => void;
  confirmMapping: (id: string) => void;
  bulkDoNotMigrate: () => void;
  markTestStarted: () => void;
  markValidationComplete: () => void;
  copyText: (text: string, format: string) => Promise<void>;
  copyDone: boolean;
  implHandoffPreview: ReturnType<typeof previewImplementationHandoff>;
  tcoHandoffPreview: ReturnType<typeof previewTcoHandoff>;
  applyImplHandoff: () => void;
  applyTco: () => void;
  handoffMsg: string | null;
  resourceLinks: Array<{ href: string; label: string }>;
  regenerate: () => void;
  generatePlannerOutput: () => void;
  hasResults: boolean;
  goStep: (id: SectionId) => void;
};

function MigrationSectionsRest(props: SectionsRestProps) {
  const {
    step,
    plan,
    patchPlan,
    fieldSearch,
    setFieldSearch,
    fieldStatusFilter,
    setFieldStatusFilter,
    fieldObjectFilter,
    setFieldObjectFilter,
    selectedFields,
    setSelectedFields,
    filteredMappings,
    objectLabels,
    runFieldSuggestions,
    confirmMapping,
    bulkDoNotMigrate,
    markTestStarted,
    markValidationComplete,
    copyText,
    copyDone,
    implHandoffPreview,
    tcoHandoffPreview,
    applyImplHandoff,
    applyTco,
    handoffMsg,
    resourceLinks,
    generatePlannerOutput,
    hasResults,
    goStep,
  } = props;

  function toggleField(id: string) {
    const next = new Set(selectedFields);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedFields(next);
  }

  if (step === "field-mapping") {
    return (
      <>
        <SectionHeader title="Field mapping">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={runFieldSuggestions}>
              Suggest mappings
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={bulkDoNotMigrate}
              disabled={selectedFields.size === 0}
            >
              Mark selected do-not-migrate
            </Button>
          </div>
        </SectionHeader>
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="min-w-[12rem] flex-1">
            <Label htmlFor="field-search">Search fields</Label>
            <input
              id="field-search"
              className={INPUT}
              value={fieldSearch}
              onChange={(e) => setFieldSearch(e.target.value)}
              placeholder="Source or target field"
            />
          </div>
          <div>
            <Label htmlFor="field-obj-filter">Object</Label>
            <select
              id="field-obj-filter"
              className={SELECT}
              value={fieldObjectFilter}
              onChange={(e) => setFieldObjectFilter(e.target.value)}
            >
              <option value="all">All objects</option>
              {objectLabels.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className="mb-4 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by mapping status"
        >
          {(
            [
              ["all", "All"],
              ["mapped", "Mapped"],
              ["needs-review", "Needs review"],
              ["unmapped", "Unmapped"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFieldStatusFilter(id)}
              className={cn(
                "rounded-[var(--sg-radius-pill)] px-3 py-1 text-xs font-medium",
                fieldStatusFilter === id
                  ? "bg-[var(--sg-color-primary)] text-white"
                  : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
              )}
              aria-pressed={fieldStatusFilter === id}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[56rem] border-collapse text-sm">
            <thead className="sticky top-0 bg-[var(--sg-color-surface)]">
              <tr className="border-b border-[var(--sg-color-border)] text-left text-xs text-[var(--sg-color-text-muted)]">
                <th className="p-2"><span className="sr-only">Select</span></th>
                <th className="p-2">Source field</th>
                <th className="p-2">Type</th>
                <th className="p-2">Example</th>
                <th className="p-2" aria-hidden>→</th>
                <th className="p-2">Target field</th>
                <th className="p-2">Target type</th>
                <th className="p-2">Transformation</th>
                <th className="p-2">Status</th>
                <th className="p-2">Req.</th>
                <th className="p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredMappings.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-[var(--sg-color-border)] align-top"
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedFields.has(m.id)}
                      onChange={() => toggleField(m.id)}
                      aria-label={`Select ${m.sourceField}`}
                    />
                  </td>
                  <td className="p-2 font-medium">{m.sourceField}</td>
                  <td className="p-2 text-[var(--sg-color-text-muted)]">
                    {m.sourceType ?? "—"}
                  </td>
                  <td className="p-2 text-xs">{m.exampleValue ?? "—"}</td>
                  <td className="p-2" aria-hidden>→</td>
                  <td className="p-2">
                    <input
                      className={INPUT}
                      value={m.targetField ?? ""}
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          fieldMappings: p.fieldMappings.map((fm) =>
                            fm.id === m.id
                              ? { ...fm, targetField: e.target.value || undefined }
                              : fm,
                          ),
                        }))
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className={INPUT}
                      value={m.targetType ?? ""}
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          fieldMappings: p.fieldMappings.map((fm) =>
                            fm.id === m.id
                              ? { ...fm, targetType: e.target.value || undefined }
                              : fm,
                          ),
                        }))
                      }
                    />
                  </td>
                  <td className="p-2">
                    <select
                      className={SELECT}
                      value={m.transformation}
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          fieldMappings: p.fieldMappings.map((fm) =>
                            fm.id === m.id
                              ? {
                                  ...fm,
                                  transformation: e.target
                                    .value as TransformationKind,
                                }
                              : fm,
                          ),
                        }))
                      }
                    >
                      {TRANSFORM_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      className={SELECT}
                      value={m.status}
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          fieldMappings: p.fieldMappings.map((fm) =>
                            fm.id === m.id
                              ? {
                                  ...fm,
                                  status: e.target.value as FieldMappingStatus,
                                  suggestionPending:
                                    e.target.value === "suggested",
                                }
                              : fm,
                          ),
                        }))
                      }
                      aria-label={`Status for ${m.sourceField}`}
                    >
                      {FIELD_STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {m.status === "suggested" ? (
                      <Button
                        size="sm"
                        className="mt-1"
                        onClick={() => confirmMapping(m.id)}
                      >
                        Confirm
                      </Button>
                    ) : (
                      <FieldStatusChip status={m.status} />
                    )}
                  </td>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={m.required}
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          fieldMappings: p.fieldMappings.map((fm) =>
                            fm.id === m.id
                              ? { ...fm, required: e.target.checked }
                              : fm,
                          ),
                        }))
                      }
                      aria-label={`Required ${m.sourceField}`}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className={INPUT}
                      value={m.notes ?? ""}
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          fieldMappings: p.fieldMappings.map((fm) =>
                            fm.id === m.id
                              ? { ...fm, notes: e.target.value || undefined }
                              : fm,
                          ),
                        }))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {filteredMappings.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-[var(--sg-color-text-muted)]">
                    Source
                  </p>
                  <p className="font-medium">{m.sourceField}</p>
                  <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
                    Target
                  </p>
                  <input
                    className={cn(INPUT, "mt-1")}
                    value={m.targetField ?? ""}
                    onChange={(e) =>
                      patchPlan((p) => ({
                        ...p,
                        fieldMappings: p.fieldMappings.map((fm) =>
                          fm.id === m.id
                            ? { ...fm, targetField: e.target.value || undefined }
                            : fm,
                        ),
                      }))
                    }
                  />
                </div>
                <FieldStatusChip status={m.status} />
              </div>
              <select
                className={cn(SELECT, "mt-3")}
                value={m.transformation}
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    fieldMappings: p.fieldMappings.map((fm) =>
                      fm.id === m.id
                        ? {
                            ...fm,
                            transformation: e.target.value as TransformationKind,
                          }
                        : fm,
                    ),
                  }))
                }
              >
                {TRANSFORM_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {m.status === "suggested" ? (
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => confirmMapping(m.id)}
                >
                  Confirm mapping
                </Button>
              ) : null}
            </Card>
          ))}
        </div>
        {filteredMappings.length === 0 ? (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            No field mappings match filters.
          </p>
        ) : null}
      </>
    );
  }

  if (step === "users") {
    return (
      <>
        <SectionHeader title="User mappings">
          <Button
            size="sm"
            onClick={() =>
              patchPlan((p) => ({
                ...p,
                userMappings: [
                  ...p.userMappings,
                  {
                    id: uid("usr"),
                    sourceUser: "Source user",
                    status: "unknown",
                    active: "unknown",
                  },
                ],
              }))
            }
          >
            <Plus className="size-4" aria-hidden /> Add user
          </Button>
        </SectionHeader>
        <div className="mb-4">
          <Label>Inactive owner strategy</Label>
          <select
            className={SELECT}
            value={plan.inactiveOwnerStrategy}
            onChange={(e) =>
              patchPlan((p) => ({
                ...p,
                inactiveOwnerStrategy: e.target.value as typeof p.inactiveOwnerStrategy,
              }))
            }
          >
            {[
              "reassign-manager",
              "reassign-selected",
              "keep-historical-if-supported",
              "leave-unassigned-if-supported",
              "manual-decision",
              "unknown",
            ].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          {plan.userMappings.map((u) => (
            <Card key={u.id} className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <input
                className={INPUT}
                value={u.sourceUser}
                placeholder="Source user"
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    userMappings: p.userMappings.map((um) =>
                      um.id === u.id ? { ...um, sourceUser: e.target.value } : um,
                    ),
                  }))
                }
              />
              <input
                className={INPUT}
                value={u.targetUser ?? ""}
                placeholder="Target user"
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    userMappings: p.userMappings.map((um) =>
                      um.id === u.id
                        ? { ...um, targetUser: e.target.value || undefined }
                        : um,
                    ),
                  }))
                }
              />
              <select
                className={SELECT}
                value={u.status}
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    userMappings: p.userMappings.map((um) =>
                      um.id === u.id
                        ? { ...um, status: e.target.value as typeof um.status }
                        : um,
                    ),
                  }))
                }
              >
                {["mapped", "needs-decision", "unassigned", "excluded", "unknown"].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ),
                )}
              </select>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  patchPlan((p) => ({
                    ...p,
                    userMappings: p.userMappings.filter((um) => um.id !== u.id),
                  }))
                }
              >
                Remove
              </Button>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (step === "pipelines") {
    return (
      <>
        <SectionHeader title="Pipeline mapping">
          <Button
            size="sm"
            onClick={() =>
              patchPlan((p) => ({
                ...p,
                pipelineMappings: [
                  ...p.pipelineMappings,
                  {
                    id: uid("pipe"),
                    sourcePipelineName: "Sales pipeline",
                    stageMaps: [],
                    targetSupportStatus: "unknown",
                  },
                ],
              }))
            }
          >
            Add pipeline
          </Button>
        </SectionHeader>
        <div className="space-y-4">
          {plan.pipelineMappings.map((pipe) => (
            <Card key={pipe.id} className="p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className={INPUT}
                  value={pipe.sourcePipelineName}
                  onChange={(e) =>
                    patchPlan((p) => ({
                      ...p,
                      pipelineMappings: p.pipelineMappings.map((pm) =>
                        pm.id === pipe.id
                          ? { ...pm, sourcePipelineName: e.target.value }
                          : pm,
                      ),
                    }))
                  }
                />
                <input
                  className={INPUT}
                  value={pipe.targetPipelineName ?? ""}
                  placeholder="Target pipeline"
                  onChange={(e) =>
                    patchPlan((p) => ({
                      ...p,
                      pipelineMappings: p.pipelineMappings.map((pm) =>
                        pm.id === pipe.id
                          ? {
                              ...pm,
                              targetPipelineName: e.target.value || undefined,
                            }
                          : pm,
                      ),
                    }))
                  }
                />
                <select
                  className={cn(SELECT, "sm:col-span-2")}
                  value={pipe.targetSupportStatus}
                  onChange={(e) =>
                    patchPlan((p) => ({
                      ...p,
                      pipelineMappings: p.pipelineMappings.map((pm) =>
                        pm.id === pipe.id
                          ? {
                              ...pm,
                              targetSupportStatus: e.target
                                .value as EvidenceSupportStatus,
                            }
                          : pm,
                      ),
                    }))
                  }
                >
                  {RESEARCH_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      Target support: {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 space-y-2">
                {pipe.stageMaps.map((stage, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-2">
                    <input
                      className={cn(INPUT, "max-w-[10rem]")}
                      value={stage.sourceStage}
                      placeholder="Source stage"
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          pipelineMappings: p.pipelineMappings.map((pm) =>
                            pm.id === pipe.id
                              ? {
                                  ...pm,
                                  stageMaps: pm.stageMaps.map((s, i) =>
                                    i === idx
                                      ? { ...s, sourceStage: e.target.value }
                                      : s,
                                  ),
                                }
                              : pm,
                          ),
                        }))
                      }
                    />
                    <span aria-hidden>→</span>
                    <input
                      className={cn(INPUT, "max-w-[10rem]")}
                      value={stage.targetStage ?? ""}
                      placeholder="Target stage"
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          pipelineMappings: p.pipelineMappings.map((pm) =>
                            pm.id === pipe.id
                              ? {
                                  ...pm,
                                  stageMaps: pm.stageMaps.map((s, i) =>
                                    i === idx
                                      ? {
                                          ...s,
                                          targetStage: e.target.value || undefined,
                                        }
                                      : s,
                                  ),
                                }
                              : pm,
                          ),
                        }))
                      }
                    />
                    {stage.warnings.length > 0 ? (
                      <Badge variant="warning">
                        {stage.warnings.join(", ")}
                      </Badge>
                    ) : null}
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    patchPlan((p) => ({
                      ...p,
                      pipelineMappings: p.pipelineMappings.map((pm) =>
                        pm.id === pipe.id
                          ? {
                              ...pm,
                              stageMaps: [
                                ...pm.stageMaps,
                                { sourceStage: "Stage", warnings: [] },
                              ],
                            }
                          : pm,
                      ),
                    }))
                  }
                >
                  Add stage
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (step === "cleaning") {
    return (
      <>
        <SectionHeader title="Data cleaning" />
        <ul className="space-y-2">
          {plan.cleaningTasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3"
            >
              <span className="text-sm">{task.label}</span>
              <select
                className={SELECT}
                value={task.status}
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    cleaningTasks: p.cleaningTasks.map((t) =>
                      t.id === task.id
                        ? { ...t, status: e.target.value as typeof t.status }
                        : t,
                    ),
                  }))
                }
              >
                {["pending", "done", "not-applicable"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
        <Card className="mt-6 p-4">
          <h3 className="text-sm font-semibold">Dedupe strategy</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Match methods</Label>
              <select
                multiple
                className={cn(SELECT, "min-h-[6rem]")}
                value={plan.dedupe.matchMethods}
                onChange={(e) => {
                  const selected = [...e.target.selectedOptions].map(
                    (o) => o.value,
                  );
                  patchPlan((p) => ({
                    ...p,
                    dedupe: { ...p.dedupe, matchMethods: selected as typeof p.dedupe.matchMethods },
                  }));
                }}
              >
                {[
                  "email",
                  "phone",
                  "company-plus-name",
                  "external-id",
                  "manual",
                  "target-crm-dedupe",
                  "unknown",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Primary rule</Label>
              <select
                className={SELECT}
                value={plan.dedupe.primaryRule}
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    dedupe: {
                      ...p.dedupe,
                      primaryRule: e.target.value as typeof p.dedupe.primaryRule,
                    },
                  }))
                }
              >
                {[
                  "most-recently-updated",
                  "prefer-with-email",
                  "manual-merge",
                  "custom",
                  "unknown",
                ].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
        <Card className="mt-4 p-4">
          <h3 className="text-sm font-semibold">Attachments & activities</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["attachments.needed", "Attachments needed", plan.attachments.needed],
                ["activities.includeEmails", "Include emails", plan.activities.includeEmails],
                ["activities.includeCalls", "Include calls", plan.activities.includeCalls],
              ] as const
            ).map(([path, label, val]) => (
              <div key={path}>
                <Label>{label}</Label>
                <select
                  className={SELECT}
                  value={val}
                  onChange={(e) => {
                    const v = e.target.value as TriStateKnown;
                    patchPlan((p) => {
                      if (path.startsWith("attachments")) {
                        return { ...p, attachments: { ...p.attachments, needed: v } };
                      }
                      const key = path.split(".")[1] as keyof typeof p.activities;
                      return {
                        ...p,
                        activities: { ...p.activities, [key]: v },
                      };
                    });
                  }}
                >
                  {TRI_STATE.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  if (step === "test") {
    return (
      <>
        <SectionHeader title="Test migration">
          {plan.testMigration.status === "not-started" ? (
            <Button size="sm" onClick={markTestStarted}>
              Mark test started
            </Button>
          ) : (
            <Badge variant="primary">{plan.testMigration.status}</Badge>
          )}
        </SectionHeader>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Sandbox availability</Label>
            <select
              className={SELECT}
              value={plan.testMigration.sandboxAvailability}
              onChange={(e) =>
                patchPlan((p) => ({
                  ...p,
                  testMigration: {
                    ...p.testMigration,
                    sandboxAvailability: e.target.value as EvidenceSupportStatus,
                  },
                }))
              }
            >
              {RESEARCH_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label>Sample notes</Label>
            <textarea
              className={cn(INPUT, "min-h-[4rem]")}
              value={plan.testMigration.sampleNotes ?? ""}
              onChange={(e) =>
                patchPlan((p) => ({
                  ...p,
                  testMigration: {
                    ...p.testMigration,
                    sampleNotes: e.target.value || undefined,
                  },
                }))
              }
            />
          </div>
        </div>
        <ul className="space-y-2">
          {plan.testMigration.steps.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-3 text-sm"
            >
              {s.label}
              <select
                className={SELECT}
                value={s.status}
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    testMigration: {
                      ...p.testMigration,
                      steps: p.testMigration.steps.map((st) =>
                        st.id === s.id
                          ? { ...st, status: e.target.value as typeof st.status }
                          : st,
                      ),
                    },
                  }))
                }
              >
                {["pending", "done", "not-applicable"].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </>
    );
  }

  if (step === "validation") {
    const tested = plan.validationChecks.filter(
      (c) => c.status !== "not-tested",
    ).length;
    return (
      <>
        <SectionHeader title="Validation">
          <Button
            size="sm"
            variant="outline"
            onClick={markValidationComplete}
            disabled={tested === 0}
          >
            Mark validation recorded
          </Button>
        </SectionHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-[var(--sg-color-text-muted)]">
                <th className="p-2">Check</th>
                <th className="p-2">Source count</th>
                <th className="p-2">Imported</th>
                <th className="p-2">Sample</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {plan.validationChecks.map((c) => (
                <tr key={c.id} className="border-b align-top">
                  <td className="p-2">{c.objectLabel}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      className={INPUT}
                      value={c.sourceCount ?? ""}
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          validationChecks: p.validationChecks.map((vc) =>
                            vc.id === c.id
                              ? {
                                  ...vc,
                                  sourceCount: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                }
                              : vc,
                          ),
                        }))
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className={INPUT}
                      value={c.importedCount ?? ""}
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          validationChecks: p.validationChecks.map((vc) =>
                            vc.id === c.id
                              ? {
                                  ...vc,
                                  importedCount: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                }
                              : vc,
                          ),
                        }))
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className={INPUT}
                      value={c.validatedSampleCount ?? ""}
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          validationChecks: p.validationChecks.map((vc) =>
                            vc.id === c.id
                              ? {
                                  ...vc,
                                  validatedSampleCount: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                }
                              : vc,
                          ),
                        }))
                      }
                    />
                  </td>
                  <td className="p-2">
                    <select
                      className={SELECT}
                      value={c.status}
                      onChange={(e) =>
                        patchPlan((p) => ({
                          ...p,
                          validationChecks: p.validationChecks.map((vc) =>
                            vc.id === c.id
                              ? {
                                  ...vc,
                                  status: e.target.value as UatTestStatus,
                                }
                              : vc,
                          ),
                        }))
                      }
                    >
                      {UAT_STATUS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (step === "cutover") {
    return (
      <>
        <SectionHeader title="Cutover plan" />
        <ul className="space-y-3">
          {plan.cutoverSteps.map((s) => (
            <li key={s.id} className="rounded-[var(--sg-radius-md)] border p-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="neutral">{s.relativeDay}</Badge>
                <input
                  className={cn(INPUT, "flex-1")}
                  value={s.title}
                  onChange={(e) =>
                    patchPlan((p) => ({
                      ...p,
                      cutoverSteps: p.cutoverSteps.map((cs) =>
                        cs.id === s.id ? { ...cs, title: e.target.value } : cs,
                      ),
                    }))
                  }
                />
              </div>
            </li>
          ))}
        </ul>
        <Card className="mt-6 p-4">
          <h3 className="text-sm font-semibold">Delta & rollback</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Source remains active</Label>
              <select
                className={SELECT}
                value={plan.deltaMigration.sourceRemainsActive}
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    deltaMigration: {
                      ...p.deltaMigration,
                      sourceRemainsActive: e.target.value as TriStateKnown,
                    },
                  }))
                }
              >
                {TRI_STATE.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Archive strategy</Label>
              <select
                className={SELECT}
                value={plan.archiveStrategy}
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    archiveStrategy: e.target.value as typeof p.archiveStrategy,
                  }))
                }
              >
                {[
                  "keep-source-read-only",
                  "export-archive",
                  "store-externally",
                  "delete-per-policy",
                  "unknown",
                ].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Delta notes</Label>
              <textarea
                className={cn(INPUT, "min-h-[3rem]")}
                value={plan.deltaMigration.notes ?? ""}
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    deltaMigration: {
                      ...p.deltaMigration,
                      notes: e.target.value || undefined,
                    },
                  }))
                }
              />
            </div>
          </div>
          <fieldset className="mt-4 space-y-2">
            <legend className="text-xs font-medium text-[var(--sg-color-text-muted)]">
              Rollback safeguards
            </legend>
            {(
              [
                ["retainSourceAccess", "Retain source access"],
                ["preserveOriginalExport", "Preserve original export"],
                ["doNotDeleteSourceData", "Do not delete source data"],
                ["decisionPointDocumented", "Decision point documented"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={plan.rollback[key]}
                  onChange={(e) =>
                    patchPlan((p) => ({
                      ...p,
                      rollback: { ...p.rollback, [key]: e.target.checked },
                    }))
                  }
                />
                {label}
              </label>
            ))}
          </fieldset>
        </Card>
      </>
    );
  }

  if (step === "risks") {
    return (
      <>
        <SectionHeader title="Risks & readiness" />
        <div className="space-y-3">
          {plan.risks.map((risk) => (
            <Card key={risk.id} className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium">{risk.title}</h3>
                <SeverityChip severity={risk.severity} />
                <Badge variant="neutral">{risk.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {risk.reason}
              </p>
              <p className="mt-1 text-xs">{risk.recommendedAction}</p>
            </Card>
          ))}
        </div>
        <h3 className="mb-3 mt-6 text-sm font-semibold">Readiness gaps</h3>
        <ul className="space-y-2">
          {plan.readinessGaps.map((g) => (
            <li
              key={g.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--sg-radius-md)] border p-3 text-sm"
            >
              <span>{g.title}</span>
              <select
                className={SELECT}
                value={g.state}
                onChange={(e) =>
                  patchPlan((p) => ({
                    ...p,
                    readinessGaps: p.readinessGaps.map((rg) =>
                      rg.id === g.id
                        ? { ...rg, state: e.target.value as typeof rg.state }
                        : rg,
                    ),
                  }))
                }
              >
                {["ready", "needs-work", "blocked"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </>
    );
  }

  if (step === "results") {
    if (!hasResults) {
      return (
        <div className="mx-auto max-w-2xl py-10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Results
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
            Generate your migration plan
          </h2>
          <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
            We&apos;ll assemble your inventory, mappings, risks and cutover into a
            visual plan you can review — this does not migrate data.
          </p>
          <Button
            className="mt-6"
            size="lg"
            onClick={() => {
              void generatePlannerOutput();
            }}
          >
            Generate migration plan
          </Button>
        </div>
      );
    }

    return (
      <MigrationPlanReport
        plan={plan}
        resultsReady
        onGenerateOutput={() => {
          void generatePlannerOutput();
        }}
        onContinueExport={() => goStep("export")}
        onJump={(id) => goStep(normalizeSectionId(id))}
        onDownloadPlan={() => {
          void downloadMigrationPlanPdf(plan).then(() => {
            track({
              name: "migration_exported",
              properties: { format: "pdf" },
            });
          });
        }}
        onDownloadWorkbook={() => {
          void downloadMigrationPlanExcel(plan).then(() => {
            track({
              name: "migration_exported",
              properties: { format: "xlsx" },
            });
          });
        }}
      />
    );
  }

  if (step === "export") {
    return (
      <>
        <SectionHeader
          title="Export & handoff"
          description="Optional downloads and tool handoffs. Your visual results stay on the Results step."
        />
        {handoffMsg ? (
          <Alert className="mb-4" variant="success">
            {handoffMsg}
          </Alert>
        ) : null}

        {!hasResults ? (
          <div className="mb-6 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-primary-soft)]/35 p-5 sm:p-6">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
              Generate migration plan first
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
              Create the visual results page, then come back here for downloads
              and Implementation / TCO handoff.
            </p>
            <Button
              className="mt-4"
              size="lg"
              onClick={() => {
                void generatePlannerOutput();
              }}
            >
              Generate migration plan
            </Button>
          </div>
        ) : (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/30 px-4 py-3">
            <p className="text-sm text-[var(--sg-color-text)]">
              Visual results are ready.
            </p>
            <Button size="sm" variant="outline" onClick={() => goStep("results")}>
              Open results
            </Button>
          </div>
        )}

        <h3 className="mb-3 text-sm font-semibold text-[var(--sg-color-navy)]">
          Downloads
        </h3>
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <Button
            size="lg"
            onClick={() => {
              void downloadMigrationPlanPdf(plan).then(() => {
                track({
                  name: "migration_exported",
                  properties: { format: "pdf" },
                });
              });
            }}
          >
            <Download className="size-4" aria-hidden /> Download PDF
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              void downloadMigrationPlanExcel(plan).then(() => {
                track({
                  name: "migration_exported",
                  properties: { format: "xlsx" },
                });
              });
            }}
          >
            <Download className="size-4" aria-hidden /> Download Excel
          </Button>
        </div>
        <p className="mb-3 text-xs text-[var(--sg-color-text-muted)]">
          Visual PDF summary and multi-sheet Excel workbook (.xlsx). Additional
          formats below if you need them.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Button
            variant="outline"
            onClick={() => {
              downloadTextFile(
                "crm-migration-plan.txt",
                migrationPlanToPlainText(plan),
              );
              track({ name: "migration_exported", properties: { format: "txt" } });
            }}
          >
            Plan text
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              downloadTextFile(
                "crm-migration-checklist.txt",
                migrationChecklistText(plan),
              );
              track({
                name: "migration_exported",
                properties: { format: "checklist" },
              });
            }}
          >
            Checklist
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              downloadTextFile(
                "field-mapping.csv",
                fieldMappingToCsv(plan),
                "text/csv",
              );
              track({
                name: "migration_exported",
                properties: { format: "csv-fields" },
              });
            }}
          >
            Field CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const w = window.open("", "_blank");
              if (w) {
                w.document.write(
                  `<pre>${migrationPlanToPlainText(plan).replace(/</g, "&lt;")}</pre>`,
                );
                w.print();
              }
              track({ name: "migration_exported", properties: { format: "print" } });
            }}
          >
            <Printer className="size-4" aria-hidden /> Print
          </Button>
          <Button
            variant="outline"
            onClick={() => copyText(migrationPlanToPlainText(plan), "clipboard")}
          >
            <Copy className="size-4" aria-hidden />{" "}
            {copyDone ? "Copied" : "Copy plan"}
          </Button>
        </div>
        <Card className="mt-6 p-4">
          <h3 className="text-sm font-semibold">Implementation handoff</h3>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {implHandoffPreview.message}
          </p>
          <p className="mt-2 text-sm">
            {implHandoffPreview.taskCount} task(s) · mapping{" "}
            {implHandoffPreview.mappingPercent ?? "—"}%
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={applyImplHandoff}>
              Apply to implementation plan
            </Button>
            <ButtonLink
              href="/tools/crm-implementation-planner/?from=migration"
              variant="outline"
              size="sm"
            >
              Open implementation planner
            </ButtonLink>
          </div>
        </Card>
        <Card className="mt-4 p-4">
          <h3 className="text-sm font-semibold">TCO handoff</h3>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {tcoHandoffPreview.message}
          </p>
          <p className="mt-2 text-sm">
            Migration needed: {tcoHandoffPreview.needed} ·{" "}
            {tcoHandoffPreview.scopes.length} scope(s)
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={applyTco}>
              Apply to TCO session
            </Button>
            <ButtonLink
              href="/tools/crm-tco-calculator/?from=migration"
              variant="outline"
              size="sm"
            >
              Open TCO calculator
            </ButtonLink>
          </div>
        </Card>
        {resourceLinks.length > 0 ? (
          <ul className="mt-4 space-y-1 text-sm">
            {resourceLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </>
    );
  }

  return null;
}

