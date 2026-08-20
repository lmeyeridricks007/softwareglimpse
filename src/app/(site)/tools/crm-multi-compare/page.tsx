import type { Metadata } from "next";
import { CrmMultiCompareApp } from "@/components/multi-compare/crm-multi-compare-app";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getComparisons, getSoftwareByCategory } from "@/data";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { canonicalizeComparisonSlug } from "@/domain";
import { isEntityIndexable } from "@/domain/quality-gates";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM Multi-product compare | SoftwareGlimpse";
const DESCRIPTION =
  "Select two to four published CRMs and open existing pairwise comparisons. No invented 3-way winner.";

const FAQ = [
  {
    question: "Why not a single ranked table of four products?",
    answer:
      "A four-product winner would invent a ranking. Pairwise pages already carry researched criteria. This tool only assembles those links.",
  },
  {
    question: "What if a pair has no comparison page?",
    answer:
      "Use the comparison builder on the Compare hub. We do not fabricate a verdict to fill the hole.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-multi-compare/",
  indexable: true,
});

export default function CrmMultiComparePage() {
  const products = getSoftwareByCategory("crm", { membership: "primary" }).map(
    (product) => ({
      slug: product.slug,
      name: product.name,
      href: `/software/${product.slug}/`,
      shortDescription: product.shortDescription,
      bestFor: product.bestFor[0],
      logo: product.logo ?? null,
    }),
  );
  const publishedPairHrefs: Record<string, string> = {};
  for (const comparison of getComparisons()) {
    if (!isEntityIndexable({ kind: "comparison", entity: comparison })) continue;
    if (comparison.productSlugs.length !== 2) continue;
    const key = canonicalizeComparisonSlug(comparison.productSlugs);
    publishedPairHrefs[key] = `/compare/${comparison.slug}/`;
  }

  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "CRM Multi-product compare", path: "/tools/crm-multi-compare/" },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/crm-multi-compare/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqPageJsonLd(FAQ) ? [faqPageJsonLd(FAQ)!] : []),
        ]}
      />
      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>
      <Section padding="md" background="tint" container="wide">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sg-color-primary)]">
          Compare
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold text-[var(--sg-color-navy)]">
          CRM multi-product compare
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--sg-color-text-muted)]">
          {DESCRIPTION} Weighted scoring still lives on the Vendor Scorecard.
        </p>
      </Section>
      <Section padding="lg" background="surface" container="wide">
        <CrmMultiCompareApp
          products={products}
          publishedPairHrefs={publishedPairHrefs}
        />
      </Section>
      <Section padding="md" background="tint" container="narrow">
        <h2 className="font-semibold text-[var(--sg-color-navy)]">FAQ</h2>
        <dl className="mt-4 space-y-4">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-[var(--sg-color-navy)]">
                {item.question}
              </dt>
              <dd className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
      {newsletterEnabled ? (
        <Section padding="md" background="surface" container="narrow">
          <NewsletterCard />
        </Section>
      ) : null}
    </>
  );
}
