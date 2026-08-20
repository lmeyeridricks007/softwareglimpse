import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthorshipByline } from "@/components/site/authorship-byline";
import { ProductOfficialLinksList } from "@/components/outbound/product-official-links";
import { SoftwareHubEvidenceCenter } from "@/components/software/hub/software-hub-evidence-center";
import { getFounderAuthor } from "@/services/site-foundation";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import type { SoftwareReviewModel } from "@/services/software-review";
import { softwareHubPath } from "@/services/software-review/hub-tabs";

type Props = {
  model: SoftwareReviewModel;
};

export function SoftwareHubEvidenceTab({ model }: Props) {
  const software = model.software;
  const author = getFounderAuthor();
  const published =
    model.scoresApproved && model.review?.editorialStatus === "approved";
  const audit = model.assessment?.scoreAudit ?? [];

  return (
    <div
      id="reviews-evidence"
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start"
    >
      <div className="min-w-0 space-y-10">
        <SoftwareHubEvidenceCenter
          model={model.evidenceCenter}
          vendorName={software.name}
        />

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Official product destinations
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Vendor destinations used for research — separate from affiliate
            visit CTAs.
          </p>
          <div className="mt-4">
            <ProductOfficialLinksList software={software} />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
              How we verify information
            </h2>
            <Link
              href={COMPANY_ROUTES.methodology}
              className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Learn about our methodology
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Multiple source verification",
                body: "Prefer first-party pricing and product pages over secondary summaries.",
              },
              {
                title: "Regular monitoring",
                body: "Domain checked-at timestamps drive freshness and refresh flags.",
              },
              {
                title: "Expert analysis",
                body: "Category methodology criteria structure editorial judgment.",
              },
              {
                title: "Editorial independence",
                body: "Affiliate links never change scores or ranking decisions.",
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
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Lead reviewer
          </p>
          <div className="mt-3">
            <AuthorshipByline author={author} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant={published ? "success" : "warning"}>
              {published ? "Published" : "In progress"}
            </Badge>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Review summary
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Overall score</dt>
              <dd className="font-medium">
                {model.scoresApproved && model.overallScore != null
                  ? `${model.overallScore}/10`
                  : "Pending"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">
                Criteria evaluated
              </dt>
              <dd className="font-medium tabular-nums">{model.criteria.length}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">
                Evidence items
              </dt>
              <dd className="font-medium tabular-nums">
                {model.evidenceCenter.items.length}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Hands-on</dt>
              <dd className="font-medium">
                {model.research.handsOnTesting ? "Recorded" : "Not recorded"}
              </dd>
            </div>
          </dl>
        </Card>

        {audit.length > 0 ? (
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Recent updates
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              {audit
                .slice()
                .reverse()
                .slice(0, 5)
                .map((entry) => (
                  <li key={`${entry.at}-${entry.change.slice(0, 24)}`}>
                    <p className="text-xs text-[var(--sg-color-text-muted)]">
                      {entry.at.slice(0, 10)}
                    </p>
                    <p className="text-[var(--sg-color-text)]">{entry.change}</p>
                  </li>
                ))}
            </ul>
          </Card>
        ) : null}

        <Card className="bg-[var(--sg-color-primary-soft)]/40 p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Questions about our review?
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Ask about methodology, sources, or how we scored {software.name}.
          </p>
          <ButtonLink href={COMPANY_ROUTES.contact} className="mt-4 w-full">
            Contact our team
          </ButtonLink>
        </Card>

        <ButtonLink
          href={softwareHubPath(software.slug, "methodology")}
          variant="outline"
          className="w-full"
        >
          Open methodology tab
        </ButtonLink>
      </aside>
    </div>
  );
}
