import Link from "next/link";
import { Check, ClipboardCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/cn";

const TRUST = [
  "Free to use",
  "No signup required",
  "~10 minutes",
  "Selection + implementation scores",
  "Action plan & risk register",
] as const;

const DIMENSIONS_PREVIEW = [
  "Business case",
  "Process",
  "Requirements",
  "Data",
  "Integrations",
  "Ownership",
  "Budget",
  "Implementation",
  "Adoption",
] as const;

export const CRM_READINESS_FAQ_ITEMS = [
  {
    question: "What is CRM readiness?",
    answer:
      "CRM readiness is whether your organization has the foundations to choose and implement a CRM successfully — not merely whether you want one. It covers business case, process, requirements, data, ownership, budget, capacity and adoption.",
  },
  {
    question: "What is the difference between selection and implementation readiness?",
    answer:
      "Selection readiness asks whether you can evaluate and choose CRM software fairly. Implementation readiness asks whether you could successfully implement a CRM if you selected one tomorrow. A company can score high on one and low on the other.",
  },
  {
    question: "How long does the assessment take?",
    answer:
      "Most organizations complete it in about 8–12 minutes. Conditional questions keep it manageable — for example, detailed migration prompts appear only if you are replacing an existing CRM.",
  },
  {
    question: "How is scoring calculated?",
    answer:
      "Every answer maps to deterministic points and separate selection vs implementation weights. Dimension scores roll up into two aggregates. Critical blockers can lower your overall status even when averages look healthy. Scores are never random or LLM-generated.",
  },
  {
    question: "Does a high score guarantee implementation success?",
    answer:
      "No. A strong score means foundations look mature relative to SoftwareGlimpse thresholds. Projects still fail from execution, vendor fit, change resistance and unforeseen constraints.",
  },
  {
    question: "What should I do after the assessment?",
    answer:
      "Follow the prioritized action plan. Typical next steps are the CRM Requirements Builder, CRM Finder, Cost / ROI calculators, then RFP and demo tools — recommended based on your gaps, not shown equally.",
  },
] as const;

export function CrmReadinessAssessmentHero({
  className,
}: {
  className?: string;
}) {
  return (
    <header
      className={cn(
        "rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)] px-5 py-8 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            <ClipboardCheck className="size-4" aria-hidden />
            CRM diagnostic tool
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            CRM Readiness Assessment
          </h1>
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Are you actually ready to choose and implement a CRM?
          </p>
          <p className="mt-3 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            Assess business case, process, requirements, data, integrations,
            ownership, budget, implementation capacity and adoption — then get
            dual readiness scores, risks and a prioritized action plan.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {DIMENSIONS_PREVIEW.map((label) => (
              <li
                key={label}
                className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-surface)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-navy)] ring-1 ring-[var(--sg-color-border)]"
              >
                {label}
              </li>
            ))}
          </ul>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--sg-color-text-muted)]"
              >
                <Check
                  className="size-4 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="#readiness-workspace" size="lg">
              Start assessment
            </ButtonLink>
            <ButtonLink href="#how-scoring-works" size="lg" variant="outline">
              How readiness is scored
            </ButtonLink>
          </div>
        </div>

        <Card className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-surface)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            What you get
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--sg-color-text-muted)]">
            <li className="flex justify-between gap-2 border-b border-[var(--sg-color-border)] pb-2">
              <span>Selection readiness</span>
              <span className="font-medium text-[var(--sg-color-navy)]">
                Score / 100
              </span>
            </li>
            <li className="flex justify-between gap-2 border-b border-[var(--sg-color-border)] pb-2">
              <span>Implementation readiness</span>
              <span className="font-medium text-[var(--sg-color-navy)]">
                Score / 100
              </span>
            </li>
            <li className="flex justify-between gap-2 border-b border-[var(--sg-color-border)] pb-2">
              <span>Critical blockers</span>
              <span className="font-medium text-[var(--sg-color-navy)]">
                Flagged early
              </span>
            </li>
            <li className="flex justify-between gap-2 border-b border-[var(--sg-color-border)] pb-2">
              <span>Action plan</span>
              <span className="font-medium text-[var(--sg-color-navy)]">
                Phased next steps
              </span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Next tools</span>
              <span className="font-medium text-[var(--sg-color-navy)]">
                Personalized
              </span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
            Wanting a CRM urgently is not the same as being ready to select or
            implement one. This tool exposes that distinction.
          </p>
        </Card>
      </div>
    </header>
  );
}

export function CrmReadinessAssessmentEducation() {
  return (
    <>
      <Section
        id="how-scoring-works"
        padding="md"
        background="surface"
        container="wide"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            How readiness is scored
          </h2>
          <p className="mt-3 text-[var(--sg-color-text-muted)]">
            Answers map to deterministic points. Each question contributes
            separately to <strong>selection readiness</strong> and{" "}
            <strong>implementation readiness</strong> using documented weights.
            For example, requirements weigh heavily for selection; data and
            change management weigh heavily for implementation. Critical answers
            (no project owner, undefined problem, no implementation capacity)
            create blockers that can lower overall status even when averages look
            healthy.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <h3 className="font-semibold text-[var(--sg-color-navy)]">
                Selection readiness
              </h3>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                Can you evaluate and choose CRM software with clear requirements,
                ownership and commercial boundaries?
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-[var(--sg-color-navy)]">
                Implementation readiness
              </h3>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                Could you successfully implement a CRM — data, capacity, change
                and adoption — if you selected one now?
              </p>
            </Card>
          </div>
        </div>
      </Section>

      <Section padding="md" background="muted" container="wide">
        <div className="mx-auto max-w-3xl prose-sg">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            What should happen before selecting a CRM?
          </h2>
          <p className="mt-3 text-[var(--sg-color-text-muted)]">
            Before serious vendor evaluation, organizations typically need a
            documented problem, named owners, prioritized requirements, a rough
            data inventory, integration scope and a realistic view of capacity.
            Skipping these steps produces demos that feel productive and
            implementations that stall.
          </p>

          <h3 className="mt-8 font-semibold text-[var(--sg-color-navy)]">
            Common CRM readiness gaps
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--sg-color-text-muted)]">
            <li>Everyone involved, nobody accountable for the decision</li>
            <li>Requirements still an informal wish list</li>
            <li>Customer data spread across systems with no owner</li>
            <li>Budget for seats but not implementation or training</li>
            <li>No plan to retire spreadsheets after go-live</li>
          </ul>

          <h3 className="mt-8 font-semibold text-[var(--sg-color-navy)]">
            What happens after the assessment?
          </h3>
          <p className="mt-3 text-[var(--sg-color-text-muted)]">
            Use the action plan and recommended SoftwareGlimpse tools. Typical
            path:{" "}
            <Link href="/tools/crm-requirements-builder/">Requirements Builder</Link>{" "}
            → <Link href="/tools/crm-finder/">CRM Finder</Link> /{" "}
            <Link href="/best/crm-software/">Best CRM</Link> →{" "}
            <Link href="/tools/crm-cost-calculator/">Cost</Link> +{" "}
            <Link href="/tools/crm-roi-calculator/">ROI</Link> →{" "}
            <Link href="/tools/crm-rfp-builder/">RFP Builder</Link> →{" "}
            <Link href="/tools/crm-demo-checklist-builder/">Demo Checklist</Link> →
            scorecard and decision. Only pursue the steps your gaps require.
          </p>
        </div>
      </Section>
    </>
  );
}

export function CrmReadinessAssessmentFaq() {
  return (
    <Section id="faq" padding="md" background="surface" container="wide">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
          FAQ
        </h2>
        <dl className="mt-6 space-y-5">
          {CRM_READINESS_FAQ_ITEMS.map((item) => (
            <div key={item.question}>
              <dt className="font-semibold text-[var(--sg-color-navy)]">
                {item.question}
              </dt>
              <dd className="mt-1.5 text-sm text-[var(--sg-color-text-muted)]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
