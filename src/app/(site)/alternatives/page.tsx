import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import {
  getAlternativesPages,
  getSoftwareBySlug,
} from "@/data";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PageHero } from "@/components/ui/page-hero";
import { ResearchStatusBanner } from "@/components/ui/research-status-banner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { TrustStrip } from "@/components/trust/trust-strip";
import { isEntityIndexable } from "@/domain/quality-gates";
import { isPubliclyAvailable } from "@/domain/publishing";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Software alternatives",
  description: "Alternatives pages for software products.",
  path: "/alternatives/",
  indexable: getAlternativesPages().some((item) =>
    isEntityIndexable({ kind: "alternatives", entity: item }),
  ),
});

export default function AlternativesIndexPage() {
  const pages = getAlternativesPages()
    .filter((item) => item.alternatives.length >= 2)
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));
  const ranked = pages.filter(
    (item) =>
      isPubliclyAvailable(item.metadata) &&
      isEntityIndexable({ kind: "alternatives", entity: item }),
  );
  const catalogueOnly = pages.length - ranked.length;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Alternatives", path: "/alternatives/" },
        ]}
      />
      <PageHero
        title="Alternatives"
        description="One alternatives page per catalogue product that already has two or more existing substitutes. Ranked reasons appear only after editorial approval — affiliate relationships never set the order."
      />
      {catalogueOnly > 0 ? (
        <ResearchStatusBanner
          message={`${catalogueOnly} pages list catalogue substitutes without an editorial ranking yet. They stay noindex until research is approved.`}
        />
      ) : null}
      {pages.length === 0 ? (
        <ResearchStatusBanner message="No alternatives pages are in the catalogue yet." />
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {pages.map((page) => {
            const source = getSoftwareBySlug(page.sourceSlug);
            const rankedPage = isEntityIndexable({
              kind: "alternatives",
              entity: page,
            });
            return (
              <li key={page.id}>
                <Card variant="interactive" as="article" className="h-full">
                  <div className="flex flex-wrap items-center gap-2">
                    {rankedPage ? (
                      <Badge variant="success">Approved</Badge>
                    ) : page.editorialStatus === "approved" ? (
                      <Badge variant="success">Approved</Badge>
                    ) : (
                      <Badge variant="warning">Catalogue list</Badge>
                    )}
                    <span className="text-xs text-[var(--sg-color-text-muted)]">
                      {page.alternatives.length} alternatives
                    </span>
                  </div>
                  <Link
                    href={`/alternatives/${page.slug}/`}
                    className="mt-3 flex items-start gap-2"
                  >
                    <ArrowLeftRight
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                      aria-hidden
                    />
                    <span>
                      <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)] underline-offset-2 hover:underline">
                        {page.title}
                      </span>
                      <span className="mt-1 block text-sm text-[var(--sg-color-text-muted)]">
                        {page.summary ||
                          (source
                            ? `Catalogue alternatives to ${source.name}.`
                            : "Alternatives guide")}
                      </span>
                    </span>
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" />
        <TrustStrip />
      </section>
    </>
  );
}
