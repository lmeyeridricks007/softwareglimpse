import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "@/components/outbound/external-link";
import type { ComparisonPageModel } from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
};

const STEPS = [
  "Collect first-party product and pricing evidence",
  "Map both products to the same category criteria",
  "Record criterion outcomes with confidence and sources",
  "Publish only when editorial gates allow indexing",
];

export function ComparisonEvidenceTab({ model }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Evidence & transparency
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Sources and research process behind this comparison.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Sources
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--sg-color-text)]">
            {model.evidenceSourceCount}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Criteria
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--sg-color-text)]">
            {model.criteria.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Screenshots
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--sg-color-text)]">
            {model.screenshotCount}
          </p>
        </Card>
      </div>

      {model.sources.length > 0 ? (
        <section>
          <h3 className="font-semibold text-[var(--sg-color-text)]">
            Sources consulted
          </h3>
          <div className="mt-3 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody>
                {model.sources.map((source) => (
                  <tr
                    key={`${source.productSlug}-${source.id}`}
                    className="border-t border-[var(--sg-color-border)]"
                  >
                    <td className="px-4 py-3">
                      {source.url ? (
                        <ExternalLink href={source.url} type="evidence-source">
                          {source.title}
                        </ExternalLink>
                      ) : (
                        <span className="font-medium text-[var(--sg-color-text)]">
                          {source.title}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                      {source.productSlug === model.productA.slug
                        ? model.productA.name
                        : source.productSlug === model.productB.slug
                          ? model.productB.name
                          : source.productSlug}
                    </td>
                    <td className="px-4 py-3">
                      {source.type ? (
                        <Badge variant="neutral">{source.type}</Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <Card className="text-sm text-[var(--sg-color-text-muted)]">
          Source list is still being assembled for this comparison.
        </Card>
      )}

      <section>
        <h3 className="font-semibold text-[var(--sg-color-text)]">
          Methodology steps
        </h3>
        <ol className="mt-4 space-y-3">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span className="text-[var(--sg-color-text-muted)]">{step}</span>
            </li>
          ))}
        </ol>
        {model.methodologyVersion ? (
          <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
            Methodology version {model.methodologyVersion}.
          </p>
        ) : null}
      </section>

      <Card className="border-[var(--sg-color-success)]/20 bg-[var(--sg-color-success-soft)]/40">
        <Badge variant="success">Independent</Badge>
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Affiliate relationships never change comparison outcomes. We evaluate
          both products on the same criteria and allow ties when evidence does
          not support a universal winner.
        </p>
        <Link
          href={model.methodologyHref}
          className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Read full methodology →
        </Link>
      </Card>
    </div>
  );
}
