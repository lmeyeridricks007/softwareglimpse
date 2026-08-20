import { Section } from "@/components/layout/section";

const STEPS = [
  "Price software from seats, billing preference, and optional plan selection",
  "Calculate subscription cost over the ownership period (with seat growth)",
  "Add verified published costs where available",
  "Add user-supplied implementation assumptions",
  "Add migration, integration and training costs you provide",
  "Add recurring administration and support",
  "Separate known costs from unknown costs",
  "Compare scenarios you create",
] as const;

export function CrmTcoMethodology() {
  return (
    <Section
      id="how-crm-tco-is-calculated"
      padding="md"
      background="muted"
      container="wide"
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        How CRM TCO is calculated
      </h2>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 text-sm"
          >
            <span className="text-xs font-semibold text-[var(--sg-color-primary)]">
              {i + 1}
            </span>
            <p className="mt-1 font-medium text-[var(--sg-color-text)]">{step}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 max-w-3xl space-y-3 text-sm text-[var(--sg-color-text-muted)]">
        <p>
          <strong className="text-[var(--sg-color-text)]">
            SoftwareGlimpse does not invent unpublished implementation costs.
          </strong>{" "}
          Licence pricing comes from the same verified pricing engine as the
          CRM Cost Calculator. Implementation, migration, consultancy and
          training stay unknown until you supply an estimate.
        </p>
        <p>
          <strong className="text-[var(--sg-color-text)]">
            Known TCO ≠ Total TCO.
          </strong>{" "}
          When categories remain unknown, we show Known TCO so you are not given
          false certainty.
        </p>
        <p>
          <strong className="text-[var(--sg-color-text)]">
            Affiliate relationships do not influence calculations or ordering.
          </strong>
        </p>
        <p>Amounts are shown before tax unless vendor list pricing includes tax.</p>
      </div>
    </Section>
  );
}

export const CRM_TCO_FAQ_ITEMS = [
  {
    question: "What is CRM total cost of ownership?",
    answer:
      "CRM TCO is the full cost of owning and operating a CRM over a defined period — software subscriptions plus implementation, migration, integrations, training, administration and support.",
  },
  {
    question: "What costs should be included in CRM TCO?",
    answer:
      "Include software licences, verified add-ons, implementation, data migration, integrations, training, ongoing administration, support retainers, and any other one-time or recurring costs that matter to your organisation.",
  },
  {
    question: "How is TCO different from CRM licence cost?",
    answer:
      "Licence cost is the plan/subscription price. TCO adds ownership costs such as implementation and internal admin time. The CRM Cost Calculator focuses on licence pricing; this tool estimates ownership cost.",
  },
  {
    question: "Does implementation count toward TCO?",
    answer:
      "Yes, when you provide an estimate. SoftwareGlimpse does not invent implementation fees from unpublished market averages.",
  },
  {
    question: "Should internal employee time be included?",
    answer:
      "Often yes — internal implementation, training and administration can dominate TCO. This tool lets you optionally convert hours into cost using your own hourly assumptions.",
  },
  {
    question: "How should I estimate CRM migration cost?",
    answer:
      "Base it on data volume and complexity (contacts, history, custom fields, multiple systems). The calculator offers Lean / Mid / Heavy planning templates scaled to your user count — these are optional assumptions you opt into, not market averages. Leave migration unknown if you do not yet have a quote — do not treat unknown as €0.",
  },
  {
    question: "What if a vendor doesn't publish pricing?",
    answer:
      "The product is marked as custom quote. Software cost stays unknown for known TCO until you have a quote — it is never treated as free.",
  },
  {
    question: "Does SoftwareGlimpse estimate negotiated discounts?",
    answer:
      "No. You may optionally enter an assumed negotiated discount, clearly labelled as your assumption — never as vendor pricing.",
  },
  {
    question: "Can I compare multiple CRM vendors?",
    answer:
      "Yes — select up to five products and compare known TCO side by side. Lowest known cost is not automatically the best product.",
  },
  {
    question: "Can I export my TCO analysis?",
    answer:
      "Yes. Copy a plain-text summary, download CSV, or use print view. Exports include assumptions, source types and unknown categories.",
  },
  {
    question: "Does affiliate status affect calculations?",
    answer:
      "No. Affiliate relationships never change amounts, rankings or which costs are included.",
  },
] as const;

export function CrmTcoFaq() {
  return (
    <Section id="faq" padding="md" background="surface" container="wide">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        CRM TCO Calculator FAQ
      </h2>
      <dl className="mt-6 max-w-3xl space-y-5">
        {CRM_TCO_FAQ_ITEMS.map((item) => (
          <div key={item.question}>
            <dt className="font-semibold text-[var(--sg-color-text)]">
              {item.question}
            </dt>
            <dd className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
