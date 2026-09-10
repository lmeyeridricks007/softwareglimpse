import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DynamicSiCreditTcoCalculatorApp } from "@/components/tools/dynamic-tool-apps";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "Sales Intelligence Credit TCO Calculator";
const DESCRIPTION =
  "Model monthly and annual sales intelligence TCO from seats, credits, overage, and mobile credits using your quote inputs. We never invent ZoomInfo or other unpublished list prices.";

const FAQ_ITEMS = [
  {
    question: "What does this calculator include?",
    answer:
      "Four cost lines: seats, standard credits, overage credits, and mobile credits. Enter volumes plus unit prices from your quote or a published seat ladder. Missing prices stay unknown and are excluded from known TCO — not treated as $0.",
  },
  {
    question: "Why are ZoomInfo prices blank by default?",
    answer:
      "ZoomInfo Sales packages are custom-quote on the vendor site. SoftwareGlimpse does not invent ZoomInfo list seat or credit prices. Paste figures from your quote when you have them.",
  },
  {
    question: "How is this different from the SI Cost Calculator?",
    answer:
      "The Sales Intelligence Cost Calculator totals verified public seat and subscription list prices and keeps credits unknown by design. This Credit TCO tool is for modeling credit burn, overage, and mobile credits from your own quote assumptions.",
  },
  {
    question: "Can I use Apollo’s published seat prices here?",
    answer:
      "Yes — if they match the plan you are evaluating, type the published per-seat monthly amount into the seat price field and keep credit unit prices as quote inputs. Treat every dollar field as your scenario, not a SoftwareGlimpse market average.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/sales-intelligence-credit-tco/",
  indexable: true,
});

export default function SalesIntelligenceCreditTcoPage() {
  const resourceLinks = [
    ...listPublishedLearningGuides("sales-intelligence")
      .filter((g) =>
        /credit|pricing|cost|tco|choose/i.test(`${g.title} ${g.path}`),
      )
      .slice(0, 5)
      .map((g) => ({
        href: g.path,
        label: g.title,
      })),
    {
      href: "/tools/sales-intelligence-cost-calculator/",
      label: "SI Cost Calculator (seat list prices)",
    },
    {
      href: "/best/sales-intelligence-software/",
      label: "Best sales intelligence software",
    },
    {
      href: "/software/apollo/",
      label: "Apollo review",
    },
    {
      href: "/software/zoominfo/",
      label: "ZoomInfo review",
    },
    {
      href: "/software/cognism/",
      label: "Cognism review",
    },
  ];

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "SI Credit TCO Calculator",
      path: "/tools/sales-intelligence-credit-tco/",
    },
  ];

  const faqLd = faqPageJsonLd(
    FAQ_ITEMS.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  return (
    <PageContainer size="wide" className="py-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/sales-intelligence-credit-tco/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <Suspense
        fallback={
          <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
            Loading credit TCO calculator…
          </p>
        }
      >
        <DynamicSiCreditTcoCalculatorApp
          resourceLinks={resourceLinks}
          title={TITLE}
          description={DESCRIPTION}
          titleElement="h1"
        />
      </Suspense>

      <div className="mt-14 space-y-12">
        <section
          id="how-si-credit-tco-is-calculated"
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-6 py-8 sm:px-8"
          aria-labelledby="si-credit-tco-method"
        >
          <h2
            id="si-credit-tco-method"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            How SI credit TCO is calculated
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
            <li>
              <strong className="font-medium text-[var(--sg-color-text)]">
                Seats
              </strong>{" "}
              = seats × seat price / month (your quote or published ladder).
            </li>
            <li>
              <strong className="font-medium text-[var(--sg-color-text)]">
                Standard credits
              </strong>{" "}
              = credits / month × credit unit price.
            </li>
            <li>
              <strong className="font-medium text-[var(--sg-color-text)]">
                Overage
              </strong>{" "}
              = overage credits × overage unit price.
            </li>
            <li>
              <strong className="font-medium text-[var(--sg-color-text)]">
                Mobile credits
              </strong>{" "}
              = mobile credits × mobile unit price.
            </li>
            <li>
              <strong className="font-medium text-[var(--sg-color-text)]">
                Monthly known TCO
              </strong>{" "}
              = sum of lines with prices. Annual = monthly × 12, then optional
              annual-commit discount.
            </li>
          </ol>
          <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
            Affiliate relationships never change the math. Unknown lines stay
            unknown.
          </p>
        </section>

        <section
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-6 py-8 sm:px-8"
          aria-labelledby="si-credit-tco-faq"
        >
          <h2
            id="si-credit-tco-faq"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            FAQ
          </h2>
          <dl className="mt-4 space-y-5">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <dt className="font-medium text-[var(--sg-color-text)]">
                  {item.question}
                </dt>
                <dd className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 px-6 py-10 text-center sm:px-10"
          aria-labelledby="si-credit-tco-next"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Next step
          </p>
          <h2
            id="si-credit-tco-next"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
          >
            Shortlist tools after you model credits
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            Pair this TCO with the Sales Intelligence Finder and product reviews
            for Apollo, ZoomInfo, and Cognism.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/tools/sales-intelligence-finder/" size="lg">
              Find My Tool
            </ButtonLink>
            <ButtonLink
              href="/best/sales-intelligence-software/"
              variant="outline"
              size="lg"
            >
              Best SI software
            </ButtonLink>
          </div>
        </section>

        <TrustStrip />
        <NewsletterCard />

        <section aria-labelledby="si-credit-tco-related">
          <h2
            id="si-credit-tco-related"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            Related
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[var(--sg-color-primary)] hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageContainer>
  );
}
