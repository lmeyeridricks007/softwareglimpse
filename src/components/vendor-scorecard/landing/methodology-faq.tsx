import { Section } from "@/components/layout/section";

const STEPS = [
  "Start with your requirements",
  "Choose vendors",
  "Prioritize decision criteria",
  "Apply SoftwareGlimpse evidence",
  "Add your own evaluation",
  "Review trade-offs",
  "Make your decision",
] as const;

export function CrmVendorScorecardMethodology() {
  return (
    <Section
      id="how-the-scorecard-works"
      padding="md"
      background="muted"
      container="wide"
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        How the scorecard works
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
            SoftwareGlimpse recommendations ≠ your evaluation.
          </strong>{" "}
          Recommendation assessments come from approved editorial criterion scores and
          verified feature support. Your demo and trial ratings stay separate
          unless you explicitly enable a combined view.
        </p>
        <p>
          <strong className="text-[var(--sg-color-text)]">
            Affiliate relationships do not influence scores.
          </strong>{" "}
          Vendor order and fit labels never use affiliate status.
        </p>
        <p>
          Must-have failures only apply when evidence explicitly shows a
          requirement is not supported. Unknown evidence is labeled unknown — it
          is never treated as unsupported.
        </p>
      </div>
    </Section>
  );
}

export const CRM_SCORECARD_FAQ_ITEMS = [
  {
    question: "What is a CRM vendor scorecard?",
    answer:
      "A structured evaluation workspace that compares 2–5 shortlisted CRM products against your requirements using SoftwareGlimpse recommendations, your priorities, and optional demo or trial observations.",
  },
  {
    question: "How should CRM vendors be evaluated?",
    answer:
      "Start from your must-have requirements, weight decision criteria by importance, review evidence-backed research per criterion, then add your own demo or trial scores separately before deciding.",
  },
  {
    question: "How are criteria weighted?",
    answer:
      "You set categorical importance (Critical, High, Medium, Low, or Ignore). Weights normalize automatically for display — you do not need percentages to sum to 100.",
  },
  {
    question: "What happens if a CRM fails a must-have?",
    answer:
      "If research explicitly confirms a must-have is not supported, the product is marked as failing that must-have and overall fit becomes Poor fit. Unknown evidence does not cause a failure.",
  },
  {
    question: "How are SoftwareGlimpse scores calculated?",
    answer:
      "The scorecard consumes approved ProductEditorialAssessment criterion scores and FeatureSupport availability from existing research. It does not invent numeric scores or create a second scoring system.",
  },
  {
    question: "Can I add my own criteria?",
    answer:
      "Yes — the Your evaluation section includes demo and trial criteria you rate 1–5. Those ratings stay separate from SoftwareGlimpse recommendations.",
  },
  {
    question: "Can I use the scorecard during vendor demos?",
    answer:
      "Yes. The demo checklist lets you mark each must-have as fully, partially, or not demonstrated, with per-vendor notes.",
  },
  {
    question: "Does affiliate status affect scoring?",
    answer:
      "No. Affiliate relationships never influence vendor order, criterion assessments, or overall fit labels.",
  },
  {
    question: "Can I export my scorecard?",
    answer:
      "Yes. You can copy a plain-text summary, download CSV, or print. Notes are included only when you explicitly opt in.",
  },
  {
    question: "What happens if product research changes?",
    answer:
      "The scorecard resolves current assessments on load. If research updated since your last session, you see a notice — your notes and ratings are not silently rewritten.",
  },
] as const;

export function CrmVendorScorecardFaq() {
  return (
    <Section id="faq" padding="md" background="surface" container="wide">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        FAQ
      </h2>
      <dl className="mt-6 max-w-3xl space-y-5">
        {CRM_SCORECARD_FAQ_ITEMS.map((item) => (
          <div key={item.question}>
            <dt className="font-semibold text-[var(--sg-color-navy)]">
              {item.question}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
