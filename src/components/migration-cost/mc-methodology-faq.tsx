export const CRM_MIGRATION_COST_FAQ_ITEMS = [
  {
    question: "What does CRM migration cost include?",
    answer:
      "A realistic migration budget usually spans discovery, data extraction and cleansing, field mapping and transformation, migration tooling, integrations or custom work, testing, cutover, hypercare, internal labour, and contingency. Software licences and ongoing CRM administration belong in cost/TCO models — not as a substitute for migration effort.",
  },
  {
    question: "Why isn’t this just records × a unit price?",
    answer:
      "Row count affects processing and tooling, but mapping complexity, data quality, historical activity, attachments and integrations often drive more project effort. This calculator models those drivers from your assumptions instead of inventing a per-record industry average.",
  },
  {
    question: "Does a vendor’s free migration cover everything?",
    answer:
      "Usually not. “Free migration” offers typically cover a narrow data move — not full cleansing, complex transformations, custom objects, integrations, UAT, cutover coverage or hypercare. Treat vendor migration assistance as one line item, not the full project.",
  },
  {
    question: "Are implementation, migration and integration the same?",
    answer:
      "No. Implementation configures the new CRM. Migration moves and validates data. Integrations reconnect systems around the CRM. Partners sometimes bundle them — this tool keeps the categories separate so you can compare quotes fairly.",
  },
  {
    question: "Where do the euro amounts come from?",
    answer:
      "Only from values you enter: fixed quotes, day rates × days, hours × loaded costs, tooling costs and optional contingency. Blank fields stay unknown. We do not insert hidden market rates.",
  },
  {
    question: "How should I use contingency?",
    answer:
      "Apply a percentage only when you want to model uncertainty. Prefer applying it to external services, internal effort and/or flexible tooling — and exclude fixed licence amounts if they are already locked.",
  },
];

export function CrmMigrationCostMethodology() {
  return (
    <section
      id="how-crm-migration-cost-is-calculated"
      className="scroll-mt-24 space-y-8"
      aria-labelledby="mc-method-heading"
    >
      <div>
        <h2
          id="mc-method-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
        >
          How this calculator works
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
          The model separates software/tooling, external services, internal
          labour, risk/contingency, optional scenario costs and unknowns. Complexity
          bands are deterministic rules for risk and prompting — they never mint a
          fake price.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="space-y-2">
          <h3 className="text-base font-semibold text-[var(--sg-color-navy)]">
            What does CRM migration cost include?
          </h3>
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Discovery, extraction, cleansing, deduplication, mapping,
            transformation, tooling, custom objects, historical activity,
            attachments, integrations, custom development, testing,
            reconciliation, project management, internal effort, training,
            cutover, hypercare and contingency.
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-base font-semibold text-[var(--sg-color-navy)]">
            What makes CRM migration expensive?
          </h3>
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Dirty data, deep history, attachments, custom objects, cross-object
            transforms, ERP/custom APIs, multiple source systems and weak test
            cycles. Volume alone is rarely the main driver.
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-base font-semibold text-[var(--sg-color-navy)]">
            Data volume vs complexity
          </h3>
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            High row counts matter for tooling and runtimes. Mapping, quality and
            integration complexity usually dominate people-time and partner days.
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-base font-semibold text-[var(--sg-color-navy)]">
            How much historical data should you migrate?
          </h3>
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Migrate history that sales, service or compliance actually need.
            Archiving older emails or attachments can cut cost without blocking
            go-live — model that with the scope-reduction toggles.
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-base font-semibold text-[var(--sg-color-navy)]">
            When do you need an implementation partner?
          </h3>
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            When integrations, transforms, custom objects or cutover risk exceed
            internal capacity. Compare partner quotes against your internal model —
            never treat the cheapest quote as automatically best.
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-base font-semibold text-[var(--sg-color-navy)]">
            How to reduce CRM migration cost
          </h3>
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Narrow history, archive attachments, retire unused integrations, clean
            data before partner engagement, phase custom objects, and fix field
            mapping before build.
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-base font-semibold text-[var(--sg-color-navy)]">
            Why field mapping matters
          </h3>
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Unmapped required fields and silent transform errors cause rework,
            failed tests and cutover delays. Use the Field Mapping Template early.
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-base font-semibold text-[var(--sg-color-navy)]">
            Why CRM migration projects fail
          </h3>
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Unclear ownership, underestimated cleansing, incomplete integration
            inventory, one test run only, and treating vendor “free migration” as
            a full project plan.
          </p>
        </article>
        <article className="space-y-2 md:col-span-2">
          <h3 className="text-base font-semibold text-[var(--sg-color-navy)]">
            How to budget for CRM migration
          </h3>
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Separate known quotes from unknowns, show coverage %, keep contingency
            explicit, and feed the modelled total into TCO / ROI / Business Case
            only after you confirm — avoiding double-counting across tools.
          </p>
        </article>
      </div>
    </section>
  );
}

export function CrmMigrationCostFaq() {
  return (
    <section
      id="crm-migration-cost-faq"
      className="scroll-mt-24"
      aria-labelledby="mc-faq-heading"
    >
      <h2
        id="mc-faq-heading"
        className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
      >
        FAQ
      </h2>
      <dl className="mt-6 space-y-4">
        {CRM_MIGRATION_COST_FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] px-5 py-4"
          >
            <dt className="font-semibold text-[var(--sg-color-navy)]">
              {item.question}
            </dt>
            <dd className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
