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

const TITLE = "Software Cost Calculator";
const DESCRIPTION =
  "Choose a category cost calculator. Compare verified list pricing — affiliate relationships never change the numbers. Cross-stack totals come later.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/software-cost-calculator/",
  indexable: true,
});

const CATEGORY_CALCULATORS = [
  {
    id: "crm",
    href: "/tools/crm-cost-calculator/",
    title: "CRM Cost Calculator",
    description:
      "Estimate verified CRM plan costs for your team size, billing preference, and must-have capabilities.",
    cta: "Open CRM Cost Calculator →",
    icon: Users,
  },
  {
    id: "sales-intelligence",
    href: "/tools/sales-intelligence-cost-calculator/",
    title: "Sales Intelligence Cost Calculator",
    description:
      "Estimate seat-based SI costs where published. Credit packs and custom quotes stay unknown — we never invent totals.",
    cta: "Open SI Cost Calculator →",
    icon: Binoculars,
  },
  ...NEW_TOOL_CATEGORY_SLUGS.map((slug) => {
    const meta = CATEGORY_TOOL_META[slug];
    return {
      id: slug,
      href: categoryToolHref(slug, "cost-calculator"),
      title: `${meta.shortName} Cost Calculator`,
      description: `Estimate ${meta.softwarePhrase} costs from verified public pricing. Unknown and custom quotes stay unknown.`,
      cta: `Open ${meta.shortName} Cost Calculator →`,
      icon: Sparkles,
    };
  }),
];

export default function SoftwareCostCalculatorPage() {
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  return (
    <PageContainer size="wide" className="py-2">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/" },
          {
            name: "Software Cost Calculator",
            path: "/tools/software-cost-calculator/",
          },
        ]}
      />

      <FinderPageHero
        title="Software Cost Calculator"
        description="Pick a category calculator below. Verified list prices only — unknown, usage-based and custom quotes stay quote-required. Cross-stack totals are still on the roadmap."
        className="mt-2"
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,19rem)] lg:items-start">
        <div className="min-w-0 space-y-6">
          <ul className="grid gap-4 sm:grid-cols-2">
            {CATEGORY_CALCULATORS.map((calc) => {
              const Icon = calc.icon;
              return (
                <li key={calc.id}>
                  <Card variant="interactive" as="article" className="h-full">
                    <Icon
                      className="size-6 text-[var(--sg-color-primary)]"
                      aria-hidden
                    />
                    <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
                      {calc.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                      {calc.description}
                    </p>
                    <ButtonLink href={calc.href} className="mt-5" size="lg">
                      {calc.cta}
                    </ButtonLink>
                  </Card>
                </li>
              );
            })}
          </ul>

          <Card className="p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-text)]">
              Cross-stack totals later
            </h2>
            <p className="mt-3 text-[var(--sg-color-text-muted)]">
              A multi-category calculator that sums an entire stack is still on
              the roadmap. Category calculators only total verified list
              pricing — unknown and custom quotes stay quote-required.
            </p>
            <FinderPrivacyNote />
          </Card>
        </div>

        <aside className="space-y-5">
          <FinderWhyCard />
          <FinderResourcesCard
            items={[
              {
                href: "/tools/crm-cost-calculator/",
                label: "CRM Cost Calculator",
              },
              {
                href: "/tools/sales-intelligence-cost-calculator/",
                label: "SI Cost Calculator",
              },
              {
                href: "/tools/software-finder/",
                label: "Software Finder",
              },
              { href: "/pricing/", label: "Pricing guides" },
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
