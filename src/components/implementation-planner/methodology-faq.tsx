import { Section } from "@/components/layout/section";

const STEPS = [
  "Start with your CRM scope",
  "Load your requirements",
  "Identify migration and integrations",
  "Generate required implementation phases",
  "Create dependencies and tasks",
  "Build a timeline from planning assumptions",
  "Surface risks and unresolved decisions",
  "Customize the plan",
  "Prepare for go-live",
] as const;

export function CrmImplementationMethodology() {
  return (
    <Section
      id="how-the-implementation-planner-works"
      padding="md"
      background="muted"
      container="wide"
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        How the implementation planner works
      </h2>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            The planner generates a planning framework based on the information
            you provide.
          </strong>{" "}
          It is not a vendor-certified implementation estimate. Durations come
          from your scope and planning assumptions — not claims like “this CRM
          takes 8 weeks.”
        </p>
        <p>
          Product-specific setup steps appear only when backed by product
          research or official sources. Otherwise, guidance stays clearly
          generic.
        </p>
        <p>
          <strong className="text-[var(--sg-color-text)]">
            Affiliate relationships do not influence phases, tasks or
            recommendations.
          </strong>
        </p>
      </div>
    </Section>
  );
}

export const CRM_IMPLEMENTATION_FAQ_ITEMS = [
  {
    question: "What is a CRM implementation plan?",
    answer:
      "A CRM implementation plan is a structured rollout of phases, tasks, owners, dependencies and checkpoints needed to configure, migrate, integrate, test, train and go live with a CRM — based on your scope, not a generic vendor brochure.",
  },
  {
    question: "How long does CRM implementation take?",
    answer:
      "It depends on users, migration complexity, integrations, security needs and launch scope. This planner estimates a planning duration from the inputs you enter. Treat that figure as a planning model, not a promise that a specific CRM always takes a fixed number of weeks.",
  },
  {
    question: "What steps are involved in CRM implementation?",
    answer:
      "Typical phases include discovery, requirements validation, process and data model design, configuration, migration (when needed), integrations, automation and reporting, security, testing/UAT, training, go-live and post-go-live adoption. Phases are included or omitted based on your scope.",
  },
  {
    question: "Who should be involved?",
    answer:
      "Common roles include an executive sponsor, project manager, CRM owner, sales operations, IT/integrations, data owner, security, business representatives, and a trainer or change lead. Assign roles as labels — personal details are optional.",
  },
  {
    question: "How should CRM data migration be planned?",
    answer:
      "Inventory source data, clean duplicates, map fields/users/stages, run a test import, fix issues, then perform final migration and reconcile counts before go-live. Use the CRM Migration Planner for detailed field mapping and cutover.",
  },
  {
    question: "When should CRM users be trained?",
    answer:
      "Train before go-live, ideally after core configuration and UAT scenarios are stable. Role-based training for sales, managers and admins usually works better than one generic session.",
  },
  {
    question: "What should be tested before go-live?",
    answer:
      "Configuration, permissions, integrations, workflows, reporting, migrated data samples and must-have requirement scenarios (UAT). Do not treat go-live as complete until critical checklist items are explicitly signed off.",
  },
  {
    question: "Can I use this plan for HubSpot / Pipedrive / Salesforce?",
    answer:
      "Yes. Select a product when you have one, or generate a vendor-neutral plan first. Product-specific resources are linked only when official or material exists — the planner does not invent vendor procedures.",
  },
  {
    question:
      "Does SoftwareGlimpse provide product-specific implementation instructions?",
    answer:
      "Only when evidence-backed. Most tasks are generic CRM implementation guidance. Where official product documentation is available, we surface it as a resource — not as copied vendor documentation inside the plan.",
  },
  {
    question: "Can I export the plan?",
    answer:
      "Yes. Copy a plain-text plan, download a CSV task/risk/checklist register, or use print view. Exports are personalized from your plan state.",
  },
  {
    question: "Does affiliate status affect the implementation plan?",
    answer:
      "No. Affiliate relationships never change phases, tasks, risks, timelines or recommendations.",
  },
] as const;

export function CrmImplementationFaq() {
  return (
    <Section id="faq" padding="md" container="wide">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Frequently asked questions
      </h2>
      <dl className="mt-6 space-y-4">
        {CRM_IMPLEMENTATION_FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
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
    </Section>
  );
}
