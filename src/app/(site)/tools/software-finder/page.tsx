import type { Metadata } from "next";
import Link from "next/link";
import { Binoculars, Sparkles, Users } from "lucide-react";
import { FinderPageHero } from "@/components/finder/finder-page-hero";
import {
  FinderResourcesCard,
  FinderWhyCard,
} from "@/components/finder/finder-sidebar";
import { FinderPrivacyNote } from "@/components/finder/finder-stepper";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import {
  CATEGORY_TOOL_META,
  NEW_TOOL_CATEGORY_SLUGS,
  categoryToolHref,
} from "@/data/config/tools/category-tool-meta";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { buildPageMetadata } from "@/seo/metadata";

const TITLE = "Software Finder";
const DESCRIPTION =
  "Choose a category finder. Each finder uses SoftwareGlimpse research, with no affiliate ranking bias.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/software-finder/",
  indexable: true,
});

const CATEGORY_FINDERS = [
  {
    id: "crm",
    href: "/tools/crm-finder/",
    title: "CRM Software Finder",
    description:
      "Match CRM tools to your team size, use case, and budget with deterministic fit scoring.",
    cta: "Open CRM Software Finder →",
    icon: Users,
  },
  {
    id: "sales-intelligence",
    href: "/tools/sales-intelligence-finder/",
    title: "Sales Intelligence Finder",
    description:
      "Find contact data, enrichment, and outbound prospecting tools that fit how you sell.",
    cta: "Open Sales Intelligence Finder →",
    icon: Binoculars,
  },
  ...NEW_TOOL_CATEGORY_SLUGS.map((slug) => {
    const meta = CATEGORY_TOOL_META[slug];
    return {
      id: slug,
      href: categoryToolHref(slug, "finder"),
      title: `${meta.shortName} Finder`,
      description: `Match ${meta.softwarePhrase} to ${meta.jobSummary}, team size, and budget.`,
      cta: `Open ${meta.shortName} Finder →`,
      icon: Sparkles,
    };
  }),
];

export default function SoftwareFinderPage() {
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  return (
    <PageContainer size="wide" className="py-2">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/" },
          { name: "Software Finder", path: "/tools/software-finder/" },
        ]}
      />

      <FinderPageHero
        title="Software Finder"
        description="Not sure where to start? Pick a category finder below. Each one uses the same editorial research standards, with no affiliate ranking bias."
        className="mt-2"
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,19rem)] lg:items-start">
        <div className="min-w-0 space-y-6">
          <ul className="grid gap-4 sm:grid-cols-2">
            {CATEGORY_FINDERS.map((finder) => {
              const Icon = finder.icon;
              return (
                <li key={finder.id}>
                  <Card variant="interactive" as="article" className="h-full">
                    <Icon
                      className="size-6 text-[var(--sg-color-primary)]"
                      aria-hidden
                    />
                    <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
                      {finder.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                      {finder.description}
                    </p>
                    <ButtonLink href={finder.href} className="mt-5" size="lg">
                      {finder.cta}
                    </ButtonLink>
                  </Card>
                </li>
              );
            })}
          </ul>

          <Card className="p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-text)]">
              How Finder scoring works
            </h2>
            <p className="mt-3 text-[var(--sg-color-text-muted)]">
              Each category finder shortlists products from SoftwareGlimpse
              research for that category only. Affiliate relationships never
              change rankings.
            </p>
            <FinderPrivacyNote />
          </Card>
        </div>

        <aside className="space-y-5">
          <FinderWhyCard />
          <FinderResourcesCard
            items={[
              { href: "/tools/crm-finder/", label: "CRM Software Finder" },
              {
                href: "/tools/sales-intelligence-finder/",
                label: "Sales Intelligence Finder",
              },
              {
                href: "/tools/crm-cost-calculator/",
                label: "CRM Cost Calculator",
              },
              { href: "/categories/crm/", label: "CRM category hub" },
              {
                href: "/categories/sales-intelligence/",
                label: "Sales intelligence hub",
              },
            ]}
          />
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Looking for something else?{" "}
            <Link
              href="/tools/"
              className="font-medium underline-offset-2 hover:underline"
            >
              Browse all tools
            </Link>
          </p>
        </aside>
      </div>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        {newsletterEnabled ? (
          <NewsletterCard source="article-end" hideWhenDisabled />
        ) : null}
        <TrustStrip />
      </section>
    </PageContainer>
  );
}
