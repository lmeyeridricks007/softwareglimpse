import type { Metadata } from "next";
import {
  FoundationPageShell,
  LegalStatusBanner,
  SectionBlock,
} from "@/components/site/foundation-page";
import { buildPageMetadata } from "@/seo/metadata";
import {
  buildCookiePolicySections,
  buildPrivacySections,
  buildTermsSections,
  buildAccessibilitySections,
  getLegalDocument,
  isLegalConfigurationComplete,
  legalConfigurationMissingFields,
} from "@/services/site-foundation";

function LegalDocPage({
  id,
  extraSections,
}: {
  id: string;
  extraSections?: { id: string; heading: string; body: string }[];
}) {
  const doc = getLegalDocument(id);
  if (!doc) {
    return (
      <FoundationPageShell title="Document missing">
        <p>Legal document configuration not found: {id}</p>
      </FoundationPageShell>
    );
  }
  const sections = [...(extraSections ?? []), ...doc.sections];
  return (
    <FoundationPageShell title={doc.title} summary={doc.summary}>
      <LegalStatusBanner
        status={doc.status}
        version={doc.version}
        lastUpdatedAt={doc.lastUpdatedAt}
      />
      {!isLegalConfigurationComplete() &&
      (id === "privacy" || id === "terms") ? (
        <p className="mb-4 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 text-sm text-[var(--color-danger)]">
          LEGAL_CONFIGURATION_INCOMPLETE:{" "}
          {legalConfigurationMissingFields().join(", ")}
        </p>
      ) : null}
      {sections.map((section) => (
        <SectionBlock key={section.id} heading={section.heading}>
          <p>{section.body}</p>
        </SectionBlock>
      ))}
    </FoundationPageShell>
  );
}

export function legalMetadata(
  id: string,
  fallbackTitle: string,
  fallbackDescription: string,
  path: string,
  indexable: boolean,
): Metadata {
  const doc = getLegalDocument(id);
  return buildPageMetadata({
    title: doc?.title ?? fallbackTitle,
    description: doc?.summary ?? fallbackDescription,
    path,
    indexable,
  });
}

export function PrivacyLegalPage() {
  return (
    <LegalDocPage id="privacy" extraSections={buildPrivacySections()} />
  );
}

export function CookiesLegalPage() {
  return (
    <LegalDocPage id="cookies" extraSections={buildCookiePolicySections()} />
  );
}

export function TermsLegalPage() {
  return <LegalDocPage id="terms" extraSections={buildTermsSections()} />;
}

export function AccessibilityLegalPage() {
  return (
    <LegalDocPage id="accessibility" extraSections={buildAccessibilitySections()} />
  );
}

export function StaticLegalPage({ id }: { id: string }) {
  return <LegalDocPage id={id} />;
}
