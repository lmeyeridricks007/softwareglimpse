import type { Metadata } from "next";
import Link from "next/link";
import {
  FoundationPageShell,
  SectionBlock,
} from "@/components/site/foundation-page";
import { buildPageMetadata } from "@/seo/metadata";
import {
  COMPANY_ROUTES,
  LEGAL_ROUTES,
  getFounderAuthor,
} from "@/services/site-foundation";

export const metadata: Metadata = buildPageMetadata({
  title: "My Story",
  description:
    "Why Lee Meyeridricks is rebuilding SoftwareGlimpse as a software decision platform.",
  path: COMPANY_ROUTES.myStory,
  indexable: true,
});

export default function MyStoryPage() {
  const founder = getFounderAuthor();

  if (!founder) {
    return (
      <FoundationPageShell title="My Story">
        <p>Founder profile is not configured.</p>
      </FoundationPageShell>
    );
  }

  return (
    <FoundationPageShell
      title="My Story"
      summary={`${founder.name} — why SoftwareGlimpse exists and how it’s being rebuilt.`}
      related={[
        { href: COMPANY_ROUTES.about, label: "About" },
        { href: COMPANY_ROUTES.methodology, label: "Methodology" },
        { href: COMPANY_ROUTES.howWeReview, label: "How we review" },
        { href: COMPANY_ROUTES.contact, label: "Contact" },
      ]}
    >
      <SectionBlock heading="Who’s behind SoftwareGlimpse">
        <p>
          {founder.role ? `${founder.role}. ` : ""}
          {founder.fullBio ?? founder.shortBio}
        </p>
        {founder.disclosure ? (
          <p className="text-sm italic text-[var(--color-fg-muted)]">
            {founder.disclosure}
          </p>
        ) : null}
      </SectionBlock>

      <SectionBlock heading="Why the site exists">
        <p>
          Choosing software is expensive to reverse. Too much of the web still
          follows a thin pattern: SEO article → review → affiliate link →
          commission. That model pushed page-centric content instead of
          decision-centric help. SoftwareGlimpse exists to answer “which software
          should I choose?” with structured facts, explainable comparisons, and
          tools — not ranking theater.
        </p>
      </SectionBlock>

      <SectionBlock heading="Why it’s being rebuilt">
        <p>
          The original SoftwareGlimpse site lived in that older publishing shape.
          This rebuild on softwareglimpse.com treats software as entities in a
          knowledge graph: research records, category methodologies, editorial
          assessments, comparisons, pricing, finders, and disclosures that stay
          consistent across page types. Affiliate monetization remains, but
          rankings and recommendations are fit-based.
        </p>
      </SectionBlock>

      <SectionBlock heading="Research and transparency philosophy">
        <p>
          Prefer primary vendor sources. Keep facts separate from judgment. Show
          methodology. Disclose affiliates. Do not claim hands-on testing unless
          testing metadata supports it. Use AI as a drafting aid from approved
          inputs — not as a license to invent live prices or fake experience.
        </p>
        <p>
          Read the{" "}
          <Link href={COMPANY_ROUTES.methodology}>editorial methodology</Link>{" "}
          and{" "}
          <Link href={COMPANY_ROUTES.howWeReview}>how we review software</Link>.
          Independence rules:{" "}
          <Link href={LEGAL_ROUTES.editorialIndependence}>
            editorial independence
          </Link>
          .
        </p>
      </SectionBlock>

      {founder.expertise.length > 0 ? (
        <SectionBlock heading="Focus areas on this platform">
          <ul className="list-disc space-y-1 pl-5">
            {founder.expertise.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionBlock>
      ) : null}
    </FoundationPageShell>
  );
}
