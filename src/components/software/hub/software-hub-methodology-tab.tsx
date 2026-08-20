import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import type { SoftwareReviewModel } from "@/services/software-review";
import { softwareHubPath } from "@/services/software-review/hub-tabs";

type Props = {
  model: SoftwareReviewModel;
};

const PROCESS_STEPS = [
  {
    title: "Collect",
    body: "Collect first-party pricing, product, and documentation sources into structured facts.",
  },
  {
    title: "Score",
    body: "Score category methodology criteria against product evidence — never affiliate economics.",
  },
  {
    title: "Editorial review",
    body: "Write strengths, limitations, buyer fit, and plan guidance in plain language.",
  },
  {
    title: "Fact-check",
    body: "Strip unsupported claims and keep public copy free of internal jargon.",
  },
  {
    title: "Final review",
    body: "Approve scores only when assessment and review both clear editorial gates.",
  },
  {
    title: "Publish & monitor",
    body: "Ship the product hub and refresh when pricing or capabilities change.",
  },
] as const;

const SCORE_BANDS = [
  { range: "9.0 – 10", label: "Excellent" },
  { range: "8.0 – 8.9", label: "Strong" },
  { range: "7.0 – 7.9", label: "Good" },
  { range: "5.0 – 6.9", label: "Mixed" },
  { range: "0 – 4.9", label: "Limited" },
] as const;

export function SoftwareHubMethodologyTab({ model }: Props) {
  const software = model.software;
  const criteria = model.methodology?.criteria ?? [];
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight ?? 1), 0) || 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
      <div className="min-w-0 space-y-10">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Our 6-step review process
          </h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.title}>
                <Card className="h-full p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 font-semibold text-[var(--sg-color-text)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    {step.body}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
              Evaluation criteria
            </h2>
            {model.methodology ? (
              <Badge variant="neutral">
                {model.methodology.name} v{model.methodology.version}
              </Badge>
            ) : null}
          </div>
          <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
            {model.methodology?.description ??
              `Criteria used to evaluate ${software.name} in its primary category.`}
          </p>
          {criteria.length === 0 ? (
            <Card className="mt-4 p-6 text-sm text-[var(--sg-color-text-muted)]">
              No methodology criteria are attached for this product yet.
            </Card>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {criteria
                .slice()
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((criterion) => {
                  const weightPct = Math.round(
                    ((criterion.weight ?? 1) / totalWeight) * 100,
                  );
                  const scored = model.criteria.find(
                    (c) => c.criterionSlug === criterion.slug,
                  );
                  return (
                    <Card key={criterion.slug} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[var(--sg-color-text)]">
                          {criterion.name}
                        </h3>
                        <Badge variant="primary">{weightPct}%</Badge>
                      </div>
                      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                        {criterion.description}
                      </p>
                      {model.scoresApproved && scored?.score != null ? (
                        <p className="mt-3 text-sm font-medium text-[var(--sg-color-text)]">
                          {software.name} score: {scored.score}/10
                        </p>
                      ) : null}
                    </Card>
                  );
                })}
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="text-base font-semibold text-[var(--sg-color-text)]">
              10-point scoring scale
            </h2>
            <table className="mt-4 w-full text-sm">
              <tbody>
                {SCORE_BANDS.map((band) => (
                  <tr
                    key={band.range}
                    className="border-t border-[var(--sg-color-border)]"
                  >
                    <td className="py-2 font-medium tabular-nums text-[var(--sg-color-text)]">
                      {band.range}
                    </td>
                    <td className="py-2 text-[var(--sg-color-text-muted)]">
                      {band.label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card className="p-5">
            <h2 className="text-base font-semibold text-[var(--sg-color-text)]">
              Overall score calculation
            </h2>
            <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
              Criterion scores are weighted by the category methodology, then
              averaged into an overall score. Scores only appear on the public
              page when both the assessment and product review are approved.
            </p>
            {model.scoresApproved && model.overallScore != null ? (
              <p className="mt-4 text-sm font-medium text-[var(--sg-color-text)]">
                Current {software.name} overall: {model.overallScore}/10
                {model.scoreLabelText ? ` (${model.scoreLabelText})` : ""}
              </p>
            ) : (
              <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
                Numeric scores for {software.name} are not public yet.
              </p>
            )}
            <Link
              href={COMPANY_ROUTES.howWeReview}
              className="mt-4 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              View scoring example →
            </Link>
          </Card>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Continuous updates
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Source freshness",
                body: "Domain checked-at timestamps track when pricing and features were last verified.",
              },
              {
                title: "Change monitoring",
                body: "Plan renames, packaging changes, and new limits trigger editorial refresh.",
              },
              {
                title: "Independence checks",
                body: "Affiliate state is excluded from ranking and scoring inputs.",
              },
              {
                title: "Version tracking",
                body: "Methodology version is recorded on each assessment and review.",
              },
            ].map((item) => (
              <Card key={item.title} className="p-4">
                <p className="font-medium text-[var(--sg-color-text)]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                  {item.body}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Methodology at a glance
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Criteria</dt>
              <dd className="font-medium tabular-nums">{criteria.length}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Process steps</dt>
              <dd className="font-medium tabular-nums">6</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Sources used</dt>
              <dd className="font-medium tabular-nums">{model.sources.length}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Hands-on testing</dt>
              <dd className="font-medium">
                {model.research.handsOnTesting ? "Yes" : "No"}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Data sources we use
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
            {model.sources.slice(0, 6).map((source) => (
              <li key={source.id} className="flex justify-between gap-2">
                <span className="truncate">{source.title}</span>
                <span className="shrink-0 text-xs">
                  {source.kindLabel ?? "source"}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Independence & trust
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
            <li className="flex gap-2">
              <span className="text-[var(--sg-color-success)]">✓</span>
              Editorial independence from affiliates
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--sg-color-success)]">✓</span>
              No paid placements in scores
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--sg-color-success)]">✓</span>
              Affiliate links disclosed when present
            </li>
          </ul>
          <Link
            href={LEGAL_ROUTES.editorialIndependence}
            className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Read our independence policy →
          </Link>
        </Card>

        <Card className="bg-[var(--sg-color-primary-soft)]/40 p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Questions about our process?
          </h2>
          <ButtonLink href={COMPANY_ROUTES.contact} className="mt-4 w-full">
            Contact our team →
          </ButtonLink>
        </Card>

        <ButtonLink
          href={softwareHubPath(software.slug, "evidence")}
          variant="outline"
          className="w-full"
        >
          View reviews & evidence
        </ButtonLink>
      </aside>
    </div>
  );
}
