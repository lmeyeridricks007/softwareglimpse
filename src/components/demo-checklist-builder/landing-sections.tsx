import Link from "next/link";
import { Card } from "@/components/ui/card";

export const DEMO_CHECKLIST_FAQ = [
  {
    question: "What is a CRM demo checklist?",
    answer:
      "A CRM demo checklist is a buyer-authored agenda plus evaluation workbook. It lists the workflows, admin tasks, integrations and questions every shortlisted vendor must cover in the same live session — so you compare apples to apples instead of accepting different feature tours.",
  },
  {
    question: "Why use a scripted demo instead of a vendor-led tour?",
    answer:
      "Vendor-led demos optimize for what the rep wants to show, not what you need to verify. A scripted checklist forces observable tasks, success criteria and evidence rules. If something cannot be demonstrated, the vendor should say so — vendor stated is not the same as demonstrated.",
  },
  {
    question: "Do I send the same checklist to every vendor?",
    answer:
      "Yes. The demo plan and script should be identical for every vendor on your shortlist. Only scoring and evidence capture differ per vendor. That keeps comparisons fair and surfaces must-have failures instead of hiding them.",
  },
  {
    question: "Can I import requirements from the Requirements Builder or RFP?",
    answer:
      "Yes. Imported items become editable draft scenarios — refine tasks and success criteria before issuing the script. Generated content is a starting point, not verified vendor capability.",
  },
  {
    question: "What can I export?",
    answer:
      "PDF checklist and agenda, vendor brief PDF, Excel scoring workbook, and Markdown. After demos you can hand results to the Vendor Scorecard without silent overwrite of existing scores.",
  },
  {
    question: "How does this connect to the Vendor Scorecard?",
    answer:
      "Record per-vendor demo outcomes in the checklist workbook, then preview what will import into the CRM Vendor Scorecard. Existing scorecard entries are only replaced when you explicitly confirm.",
  },
] as const;

const STEPS = [
  {
    title: "Set up the evaluation",
    body: "Project name, demo owner, duration, attendee roles and expected vendor count.",
  },
  {
    title: "Prioritize areas to test",
    body: "Mark capabilities as must test, should test, optional or not relevant.",
  },
  {
    title: "Build scenarios",
    body: "Structured workflows with personas, vendor tasks, success criteria and moderator scripts.",
  },
  {
    title: "Add checks & agenda",
    body: "Questions, integrations, reporting/admin tasks, commercial ask-don't-demo items, scoring rules and timed agenda blocks.",
  },
  {
    title: "Export & score",
    body: "Issue the same pack to every vendor, run demos, export results and optionally import into Vendor Scorecard.",
  },
] as const;

export function DemoChecklistLandingSections() {
  return (
    <div className="mt-16 space-y-12 border-t border-[var(--sg-color-border)] pt-12">
      <section aria-labelledby="demo-checklist-what">
        <h2
          id="demo-checklist-what"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
        >
          What is a CRM demo checklist?
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          A demo checklist turns CRM evaluation from passive product tours into
          structured verification. You define scenarios every vendor must run,
          the evidence you expect, and how failures — especially must-haves —
          stay visible in your scorecard. The same script goes to Salesforce,
          HubSpot, Pipedrive or any other finalist; only results differ.
        </p>
      </section>

      <section aria-labelledby="demo-checklist-why">
        <h2
          id="demo-checklist-why"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
        >
          Why scripted demos beat vendor-led tours
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Forces observable tasks instead of vague \"show us reporting\" requests",
            "Separates live demonstration from vendor-stated claims",
            "Maps demo coverage back to your requirements profile",
            "Keeps commercial pricing and SLAs in written follow-up when appropriate",
          ].map((item) => (
            <li
              key={item}
              className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="demo-checklist-how">
        <h2
          id="demo-checklist-how"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
        >
          How it works
        </h2>
        <ol className="mt-4 space-y-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary-soft)] text-sm font-semibold text-[var(--sg-color-primary)]">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-[var(--sg-color-navy)]">
                  {step.title}
                </p>
                <p className="mt-0.5 text-sm text-[var(--sg-color-text-muted)]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="demo-checklist-faq">
        <h2
          id="demo-checklist-faq"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
        >
          Frequently asked questions
        </h2>
        <dl className="mt-4 space-y-4">
          {DEMO_CHECKLIST_FAQ.map((item) => (
            <Card key={item.question} className="p-4">
              <dt className="font-medium text-[var(--sg-color-navy)]">
                {item.question}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                {item.answer}
              </dd>
            </Card>
          ))}
        </dl>
      </section>

      <section aria-labelledby="demo-checklist-related">
        <h2
          id="demo-checklist-related"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
        >
          Related CRM selection tools
        </h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            className="text-[var(--sg-color-primary)] underline"
            href="/tools/crm-requirements-builder/"
          >
            Requirements Builder
          </Link>
          <Link
            className="text-[var(--sg-color-primary)] underline"
            href="/tools/crm-rfp-builder/"
          >
            RFP / Vendor Brief Builder
          </Link>
          <Link
            className="text-[var(--sg-color-primary)] underline"
            href="/tools/crm-vendor-scorecard/"
          >
            Vendor Scorecard
          </Link>
          <Link
            className="text-[var(--sg-color-primary)] underline"
            href="/resources/crm-comparison-worksheet/"
          >
            Decision Matrix worksheet
          </Link>
          <Link
            className="text-[var(--sg-color-primary)] underline"
            href="/tools/crm-finder/"
          >
            CRM Finder
          </Link>
        </div>
      </section>
    </div>
  );
}
