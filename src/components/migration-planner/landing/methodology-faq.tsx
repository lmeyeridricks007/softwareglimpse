import { Check } from "lucide-react";

export const CRM_MIGRATION_FAQ_ITEMS = [
  {
    question: "What data should I migrate to a new CRM?",
    answer:
      "Migrate what your teams need to sell and support customers day one — typically contacts, companies, open deals and recent activity. Archive or leave behind obsolete fields, test records and deep history that does not change decisions. Mark each object Must migrate, Should migrate, Archive only, or Do not migrate.",
  },
  {
    question: "How do I map CRM fields?",
    answer:
      "List each source field, choose a target field (or explicitly exclude it), note transformations, and set status to Mapped only after you confirm. SoftwareGlimpse can suggest exact name matches; suggestions stay labelled Suggested until you approve them.",
  },
  {
    question: "Should I migrate all historical data?",
    answer:
      "Not always. Full history increases complexity, cleaning effort and risk. Prefer current/open records plus a defined historical window when older data is rarely used. Capture history depth per object — All history is not the default assumption.",
  },
  {
    question: "How should CRM duplicates be handled?",
    answer:
      "Decide how duplicates are identified (email, phone, company + name, external ID, or manual) and which record wins. Do not assume the target CRM’s dedupe tools exist unless you have verified that in product documentation.",
  },
  {
    question: "What happens to records owned by former employees?",
    answer:
      "Ownership often breaks migrations. Map inactive users explicitly — reassign to a manager or selected user, leave unassigned where supported, or keep historical owner only if the target supports it. Do not assume target behaviour.",
  },
  {
    question: "How should CRM pipeline stages be mapped?",
    answer:
      "Map each source stage to a target stage per pipeline. Watch for many-to-one collapses, missing targets, unused target stages and closed-won/lost mismatches. If multiple-pipeline support is unverified, say Target support not verified — not Cannot migrate.",
  },
  {
    question: "Why should I run a test migration?",
    answer:
      "A representative sample import surfaces mapping defects, ownership issues, stage mismatches and data loss before cutover. Sample selection should be structural (teams, stages, custom fields, inactive owners, attachments, edge cases) — not a universal fixed record count.",
  },
  {
    question: "How do I validate a CRM migration?",
    answer:
      "Reconcile source vs imported counts, required fields, relationships, ownership, pipeline stages, dates, activity, attachments, duplicates and permissions. Record each check as Not tested, Passed, Partial, Failed or Blocked.",
  },
  {
    question: "What is a CRM cutover plan?",
    answer:
      "An editable sequence around go-live — freeze schema changes, final cleanup, final export, import, validation, user activation and hypercare. Defaults are planning aids, not universal requirements. Include rollback considerations that retain source access and original exports.",
  },
  {
    question: "Can SoftwareGlimpse migrate my data automatically?",
    answer:
      "No. This tool plans, maps, tracks readiness and exports specifications. Actual movement of data is handled by vendor import tools, partners or your own integration tooling.",
  },
  {
    question: "Can I download the migration plan?",
    answer:
      "Yes. Download a visual PDF report of the plan, or a real Excel workbook (.xlsx) with sheets for summary, sources, objects, field mapping, users, pipelines, cleaning, validation, risks and cutover. Plain-text, checklist and field CSV remain available as extras.",
  },
  {
    question: "Does affiliate status affect migration guidance?",
    answer:
      "No. Affiliate relationships never change migration complexity, suggested mappings, risks or handoff content.",
  },
] as const;

export function CrmMigrationMethodology() {
  return (
    <section
      id="how-the-migration-planner-works"
      aria-labelledby="migration-method-heading"
      className="scroll-mt-24"
    >
      <h2
        id="migration-method-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        How the CRM Migration Planner works
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--sg-color-text)]">
        <li>Inventory source systems</li>
        <li>Define what data should move</li>
        <li>Map source and target objects</li>
        <li>Map fields and values</li>
        <li>Resolve users and ownership</li>
        <li>Clean source data</li>
        <li>Test migration</li>
        <li>Reconcile results</li>
        <li>Plan cutover</li>
        <li>Generate and review your visual migration plan results</li>
        <li>Feed migration tasks into the implementation plan</li>
      </ol>
      <p className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 px-4 py-3 text-sm text-[var(--sg-color-text-muted)]">
        SoftwareGlimpse helps plan the migration but does not execute the
        migration itself. Product-specific import capabilities appear only where
        covered; unknowns stay explicit.
      </p>
    </section>
  );
}

export function CrmMigrationFaq() {
  return (
    <section aria-labelledby="migration-faq-heading">
      <h2
        id="migration-faq-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        FAQ
      </h2>
      <div className="mt-4 space-y-3">
        {CRM_MIGRATION_FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="group rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3"
          >
            <summary className="cursor-pointer list-none font-medium text-[var(--sg-color-text)] marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                {item.question}
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)] opacity-0 group-open:opacity-100"
                  aria-hidden
                />
              </span>
            </summary>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
