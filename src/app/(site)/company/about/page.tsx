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
  getSiteIdentity,
} from "@/services/site-foundation";

export const metadata: Metadata = buildPageMetadata({
  title: "About SoftwareGlimpse",
  description:
    "What SoftwareGlimpse is, who it helps, how recommendations work, and how the site earns money.",
  path: COMPANY_ROUTES.about,
  indexable: true,
});

export default function AboutPage() {
  const identity = getSiteIdentity();
  const founder = getFounderAuthor();

  return (
    <FoundationPageShell
      title={`About ${identity.brandName}`}
      summary="A software decision platform — not another keyword-stuffed review mill."
      related={[
        { href: COMPANY_ROUTES.myStory, label: "My Story" },
        { href: COMPANY_ROUTES.methodology, label: "Editorial methodology" },
        { href: COMPANY_ROUTES.howWeReview, label: "How we review software" },
        { href: COMPANY_ROUTES.contact, label: "Contact" },
        {
          href: LEGAL_ROUTES.affiliateDisclosure,
          label: "Affiliate disclosure",
        },
      ]}
    >
      <SectionBlock heading="What SoftwareGlimpse does">
        <p>
          {identity.brandName} helps people answer a practical question:{" "}
          <em>which software should I choose?</em> We publish structured product
          pages, category context, comparisons, alternatives, pricing pages,
          guides, and decision tools — starting with CRM and sales software, with
          architecture that can grow into other categories.
        </p>
      </SectionBlock>

      <SectionBlock heading="Who it is for">
        <p>
          Buyers and operators who need a shortlist they can defend: founders,
          sales leaders, marketers, and teams comparing tools under real
          constraints (budget, team size, features, integrations). If you want
          hype rankings that quietly track commissions, this is not that site.
        </p>
      </SectionBlock>

      <SectionBlock heading="How it helps you choose">
        <p>
          Discover products in a knowledge graph, compare them on shared
          criteria, estimate cost with calculators, and use finders for
          fit-based recommendations. Editorial pages explain trade-offs; tools
          help you apply your own requirements.
        </p>
      </SectionBlock>

      <SectionBlock heading="Research approach">
        <p>
          Product claims are meant to map to research records with source
          hierarchy — preferring official vendor materials, then reputable
          secondary sources. Factual research is stored separately from editorial
          judgment. We refresh when facts age or readers report issues. Details:{" "}
          <Link href={COMPANY_ROUTES.methodology}>Editorial methodology</Link>.
        </p>
      </SectionBlock>

      <SectionBlock heading="Reviews, comparisons, pricing, and tools">
        <p>
          Canonical product reviews live on software pages — not a parallel thin
          “reviews” URL. Comparisons and alternatives reuse shared evidence.
          Pricing pages and the CRM cost calculator surface estimates from
          structured data. The CRM Finder ranks fit deterministically from your
          answers — without reading affiliate metadata.
        </p>
      </SectionBlock>

      <SectionBlock heading="Editorial independence">
        <p>
          Affiliate availability is not a ranking input. Promotions can change
          labeled CTAs; they do not rewrite scores or Finder order. Commercial
          priorities may influence what we research first — not what we conclude.
          See{" "}
          <Link href={LEGAL_ROUTES.editorialIndependence}>
            Editorial independence
          </Link>
          .
        </p>
      </SectionBlock>

      <SectionBlock heading="How the site earns money">
        <p>
          {identity.brandName} may earn affiliate commissions when you use certain
          links and later buy or sign up. Price is normally unchanged. Not every
          link is affiliate. Full detail:{" "}
          <Link href={LEGAL_ROUTES.affiliateDisclosure}>
            Affiliate disclosure
          </Link>
          .
        </p>
      </SectionBlock>

      <SectionBlock heading="Founder">
        {founder ? (
          <>
            <p>
              {identity.brandName} is built by{" "}
              <Link href={COMPANY_ROUTES.myStory}>{founder.name}</Link>
              {founder.role ? `, ${founder.role}` : ""}.
            </p>
            {founder.shortBio ? <p>{founder.shortBio}</p> : null}
            <p>
              <Link href={COMPANY_ROUTES.myStory}>Read the full story</Link>.
            </p>
          </>
        ) : (
          <p>Founder profile is not configured.</p>
        )}
      </SectionBlock>
    </FoundationPageShell>
  );
}
