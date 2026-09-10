import type { Metadata } from "next";
import Link from "next/link";
import {
  FoundationPageShell,
  SectionBlock,
} from "@/components/site/foundation-page";
import { buildPageMetadata } from "@/seo/metadata";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = buildPageMetadata({
  title: "How We Review Software",
  description:
    "How SoftwareGlimpse selects products, researches facts, verifies pricing, scores software, and discloses when hands-on testing has or has not occurred.",
  path: COMPANY_ROUTES.howWeReview,
  indexable: true,
});

const steps = [
  {
    title: "1. How products are selected",
    body: "We prioritise categories and products buyers actually compare: demand signals, catalogue coverage gaps, and research readiness. Commercial urgency may influence what we research first — never what we conclude. Non-affiliate products can still be covered and recommended when evidence supports it.",
  },
  {
    title: "2. How product information is researched",
    body: "Vendor and trusted sources are collected into research snapshots. We prefer official pricing pages and product documentation, then other first-party materials, then reputable secondary sources. Typed facts keep provenance. AI must not invent unverified facts into the product record.",
  },
  {
    title: "3. How pricing is verified",
    body: "List pricing is normalised into structured plans. When pricing is checked against first-party sources, we record a pricing-verified timestamp. Stale or conflicting prices are flagged rather than silently smoothed. Always confirm final quotes with the vendor before purchasing.",
  },
  {
    title: "4. When first-hand testing occurs",
    body: "Hands-on testing is recorded only when editorial metadata includes a hands-on flag and a test date (and usually testing notes or environment). That state surfaces as Hands-on tested — never as a marketing flourish.",
  },
  {
    title: "5. What happens when first-hand testing has NOT occurred",
    body: "Most coverage is research- and methodology-based. Pages should say so. We do not imply we used the product daily, ran a lab evaluation, or “tested” it merely because an AI or content pipeline processed the product.",
  },
  {
    title: "6. How comparisons are generated",
    body: "Comparisons and alternatives reuse shared criteria, research facts, and editorial assessments on canonical URLs. Conclusions follow evidence and category methodology — not commission rates or partner pressure.",
  },
  {
    title: "7. How scores are calculated",
    body: "Category methodologies define criteria, relative weights, and evidence expectations. Criterion scores include rationales. Overall scores, when shown, are weighted from those criteria and only appear when editorial assessment is approved. We do not invent historical scores or vanity ratings for schema markup.",
  },
  {
    title: "8. How recommendations are made",
    body: "Recommendations combine methodology fit, structured constraints (budget, team size, features), and transparent trade-offs. Finder tools rank deterministically from your answers and do not read affiliate metadata. Editorial “best for” language must match the evidence level on the page.",
  },
  {
    title: "9. How affiliate relationships work",
    body: "Some outbound links may earn SoftwareGlimpse a commission. Affiliate availability does not rank lists, set scores, or change Finder order. See the Affiliate Disclosure and Editorial Independence pages.",
  },
  {
    title: "10. How updates and corrections work",
    body: "Research freshness, site audit, publishing gates, and reader reports drive refreshes. Spot something wrong? Use Contact → Correction. See the Corrections Policy for how we handle fixes.",
  },
] as const;

export default function HowWeReviewPage() {
  return (
    <FoundationPageShell
      title="How we review software"
      summary="A concrete walkthrough of the SoftwareGlimpse workflow — with a hard line between researched, data-verified, and hands-on-tested coverage."
      related={[
        { href: COMPANY_ROUTES.methodology, label: "Full methodology" },
        { href: LEGAL_ROUTES.editorialPolicy, label: "Editorial policy" },
        {
          href: LEGAL_ROUTES.correctionsPolicy,
          label: "Corrections policy",
        },
        {
          href: LEGAL_ROUTES.affiliateDisclosure,
          label: "Affiliate disclosure",
        },
        {
          href: `${COMPANY_ROUTES.contact}?reason=correction`,
          label: "Report a correction",
        },
      ]}
    >
      <SectionBlock heading="Evidence levels (do not conflate)">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Researched</strong> — structured research and category
            methodology support the page. This is the default when we have not
            recorded hands-on testing or a verification timestamp that elevates
            the claim.
          </li>
          <li>
            <strong>Data verified</strong> — key facts (especially pricing) have
            a verification timestamp in product or review metadata. Verification
            is not the same as hands-on testing.
          </li>
          <li>
            <strong>Hands-on tested</strong> — only when hands-on testing is
            explicitly recorded with a test date. Pipeline or AI processing alone
            never qualifies.
          </li>
        </ul>
      </SectionBlock>

      <ol className="space-y-6">
        {steps.map((step) => (
          <li key={step.title}>
            <SectionBlock heading={step.title}>
              <p>{step.body}</p>
            </SectionBlock>
          </li>
        ))}
      </ol>

      <SectionBlock heading="AI-assisted content">
        <p>
          AI may help draft from approved facts and assessments. Humans approve
          publishable judgments. AI must not invent live prices, fake testing
          experience, fabricated credentials, or unsupported review scores in
          structured data.
        </p>
      </SectionBlock>

      <SectionBlock heading="Related standards">
        <p>
          Deeper criteria and live category methodologies:{" "}
          <Link href={COMPANY_ROUTES.methodology}>Editorial methodology</Link>.
          Independence rules:{" "}
          <Link href={LEGAL_ROUTES.editorialIndependence}>
            Editorial independence
          </Link>
          . Standards handbook:{" "}
          <Link href={LEGAL_ROUTES.editorialPolicy}>Editorial policy</Link>.
        </p>
      </SectionBlock>
    </FoundationPageShell>
  );
}
