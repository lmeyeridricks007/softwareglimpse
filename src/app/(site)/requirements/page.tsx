import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Card } from "@/components/ui/card";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { listRequirementPillarProfiles } from "@/data/requirement-detail";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM Requirements";
const DESCRIPTION =
  "Buyer-need CRM requirements mapped to acceptance criteria, features, and product fit — with concrete examples, not generic SEO articles.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/requirements/",
  indexable: true,
});

export default function RequirementsIndexPage() {
  const profiles = listRequirementPillarProfiles();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Requirements", path: "/requirements/" },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/requirements/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <header className="mt-4 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          CRM buyer requirements
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold text-[var(--sg-color-navy)]">
          CRM requirements
        </h1>
        <p className="mt-3 text-[var(--sg-color-text-muted)]">
          Translate buyer needs into measurable software criteria — then compare
          product support. Each page covers when you need the
          requirement, what “good” looks like, and how to validate it in a trial.
        </p>
      </header>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <li key={profile.slug}>
            <Link
              href={`/requirements/${profile.slug}/`}
              className="group block h-full"
            >
              <Card
                variant="interactive"
                className="flex h-full flex-col overflow-hidden p-0"
              >
                {profile.heroVisual ? (
                  <div className="relative aspect-[16/9] border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]">
                    <Image
                      src={profile.heroVisual.src}
                      alt={profile.heroVisual.alt}
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 100vw"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                    {profile.requirementTypeLabel ?? "CRM requirement"}
                  </p>
                  <p className="mt-2 text-lg font-semibold group-hover:text-[var(--sg-color-primary)]">
                    {profile.name}
                  </p>
                  <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                    {profile.tagline ?? profile.buyerNeedDescription}
                  </p>
                  <span className="mt-4 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                    {withSingleArrow("Explore requirement")}
                  </span>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
