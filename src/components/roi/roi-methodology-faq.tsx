export const CRM_ROI_FAQ_ITEMS = [
  {
    question: "Does this calculator invent CRM ROI percentages?",
    answer:
      "No. Blank benefit inputs stay excluded. There are no hidden industry-average win-rate or productivity uplifts. Scenario benefits are labeled separately from verified and estimated value.",
  },
  {
    question: "Why isn’t realization set to 100%?",
    answer:
      "Saved time does not automatically become cash. The productivity realization factor lets you count only the share of time savings that reduces cost or creates capacity you will actually use.",
  },
  {
    question: "How is 3-year ROI calculated?",
    answer:
      "3-year ROI = (3-year benefits − 3-year costs) ÷ 3-year costs × 100. If material costs are unknown, ROI is marked incomplete unless you explicitly allow a provisional scenario.",
  },
  {
    question: "Can I use revenue instead of contribution?",
    answer:
      "Yes, but revenue impact is clearly labeled as not equivalent to profit. Gross profit / contribution is recommended for financial ROI.",
  },
];

export function CrmRoiMethodology() {
  return (
    <section
      id="how-crm-roi-is-calculated"
      className="scroll-mt-24 space-y-8"
      aria-labelledby="roi-method-heading"
    >
      <div>
        <h2
          id="roi-method-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
        >
          How CRM ROI is calculated
        </h2>
        <p className="mt-2 max-w-3xl text-[var(--sg-color-text-muted)]">
          The model compares your CRM investment (licences, implementation,
          migration, training, admin) with measurable benefits you enter —
          time savings, tool consolidation, cost avoidance, and optional
          revenue scenarios.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            CRM investment
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-[var(--sg-color-text)]">
            <li>Licences</li>
            <li>Implementation</li>
            <li>Migration</li>
            <li>Training</li>
            <li>Admin / support</li>
          </ul>
        </div>
        <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
            Measurable benefits
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-[var(--sg-color-text)]">
            <li>Time savings (with realization factor)</li>
            <li>Tool consolidation</li>
            <li>Cost avoidance</li>
            <li>Optional revenue scenarios</li>
          </ul>
        </div>
      </div>

      <p className="text-sm text-[var(--sg-color-text-muted)]">
        Then: <strong className="text-[var(--sg-color-text)]">net value</strong>,{" "}
        <strong className="text-[var(--sg-color-text)]">ROI</strong>, and{" "}
        <strong className="text-[var(--sg-color-text)]">payback</strong> — with
        assumption quality visible throughout. Formulas, confidence labels and
        limitations are documented in the tool methodology notes linked from
        this page.
      </p>

      <div>
        <h3 className="text-lg font-semibold text-[var(--sg-color-navy)]">
          What counts as a good CRM benefit?
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-success)]/30 bg-[var(--sg-color-success-soft)]/40 p-4 text-sm">
            <p className="font-semibold text-[var(--sg-color-success)]">
              Stronger evidence
            </p>
            <ul className="mt-2 space-y-1 text-[var(--sg-color-text)]">
              <li>✓ Eliminated software cost</li>
              <li>✓ Measured administrative time</li>
              <li>✓ Known headcount / time allocation</li>
              <li>✓ Observed process cycle time</li>
            </ul>
          </div>
          <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-warning)]/30 bg-[var(--sg-color-warning-soft)]/40 p-4 text-sm">
            <p className="font-semibold text-[var(--sg-color-warning)]">
              More uncertain
            </p>
            <ul className="mt-2 space-y-1 text-[var(--sg-color-text)]">
              <li>~ Expected adoption improvement</li>
              <li>~ Estimated productivity</li>
              <li>~ Forecast improvement</li>
            </ul>
          </div>
          <div className="rounded-[var(--sg-radius-lg)] border border-violet-200 bg-violet-50/50 p-4 text-sm">
            <p className="font-semibold text-violet-800">Scenario-only</p>
            <ul className="mt-2 space-y-1 text-[var(--sg-color-text)]">
              <li>? Win-rate uplift</li>
              <li>? Conversion improvement</li>
              <li>? Incremental revenue</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[var(--sg-color-navy)]">
          Common ROI mistakes
        </h3>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-[var(--sg-color-text-muted)]">
          <li>Counting all time saved as cash savings</li>
          <li>Ignoring implementation / internal effort</li>
          <li>Treating revenue as profit</li>
          <li>Assuming full adoption on day one</li>
          <li>Ignoring recurring admin / support</li>
          <li>Using vendor ROI claims as internal evidence</li>
          <li>Adding benefits that overlap / double-count</li>
          <li>Ignoring uncertainty</li>
        </ol>
      </div>
    </section>
  );
}

export function CrmRoiFaq() {
  return (
    <section aria-labelledby="roi-faq-heading" className="space-y-4">
      <h2
        id="roi-faq-heading"
        className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
      >
        ROI calculator FAQ
      </h2>
      <dl className="space-y-4">
        {CRM_ROI_FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] p-4"
          >
            <dt className="font-medium text-[var(--sg-color-text)]">
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
