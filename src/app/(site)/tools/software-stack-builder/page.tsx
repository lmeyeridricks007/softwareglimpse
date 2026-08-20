import type { Metadata } from "next";
import {
  FinderPageHero,
  STACK_VALUE_PROPS,
} from "@/components/finder/finder-page-hero";
import { StackBuilderApp } from "@/components/stack-builder/stack-builder-app";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { PageContainer } from "@/components/layout/page-container";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "Software Stack Builder";
const DESCRIPTION =
  "Answer a few questions to shape the software stack your business needs. CRM planning is available now — more categories are being added.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/software-stack-builder/",
  indexable: false,
});

export default function SoftwareStackBuilderPage() {
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "Stack Builder", path: "/tools/software-stack-builder/" },
  ];

  return (
    <PageContainer size="wide" className="py-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/software-stack-builder/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <FinderPageHero
        className="mt-2"
        badge="NEW"
        title={
          <>
            Build Your Perfect{" "}
            <span className="text-[var(--sg-color-primary)]">
              Software Stack
            </span>
          </>
        }
        description={DESCRIPTION}
        valueProps={STACK_VALUE_PROPS}
        visual="stack"
      />

      <div className="mt-10">
        <StackBuilderApp />
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
