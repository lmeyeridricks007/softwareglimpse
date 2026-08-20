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
    "A step-by-step look at how SoftwareGlimpse recommendationses, verifies, evaluates, publishes, and refreshes software coverage.",
  path: COMPANY_ROUTES.howWeReview,
  indexable: true,
});

const steps = [
  {
    title: "1. Understand the category",
    body: "Define what the category includes, which use cases matter, and which methodology criteria apply (for example CRM ease of use, pipeline, automation, reporting, integrations, administration, scalability, and value).",
  },
  {
    title: "2. Research the product",
    body: "Collect vendor and trusted sources into research snapshots. Prefer official pricing and product documentation.",
  },
  {
    title: "3. Verify factual claims",
    body: "Extract typed facts with evidence. Resolve or flag conflicts. Do not let AI invent unverified facts into the product record.",
  },
  {
    title: "4. Normalize pricing and features",
    body: "Turn vendor language into structured plans, feature support, and related enrichment so pages and tools can reuse the same data.",
  },
  {
    title: "5. Evaluate using category methodology",
    body: "Produce an editorial assessment: scores with rationales against methodology criteria. Affiliate status is not an input.",
  },
  {
    title: "6. Compare with alternatives",
    body: "Build comparisons and alternatives from shared criteria and evidence — not from commission rates.",
  },
  {
    title: "7. Editorial review",
    body: "Drafts (often AI-assisted from approved inputs) go through validation and human approval before publishable editorial status.",
  },
  {
    title: "8. Publish",
    body: "Canonical software pages, comparisons, Best pages, pricing, and guides become public only through the publishing gates — not by dumping drafts live.",
  },
  {
    title: "9. Monitor and refresh",
    body: "Site audit, research freshness, and reader corrections drive updates. Spot something wrong? Tell us.",
  },
] as const;

export default function HowWeReviewPage() {
  return (
    <FoundationPageShell
      title="How we review software"
      summary="A concrete walkthrough of the SoftwareGlimpse workflow — without claiming hands-on testing we have not recorded."
      related={[
        { href: COMPANY_ROUTES.methodology, label: "Full methodology" },
        {
          href: `${COMPANY_ROUTES.contact}?reason=correction`,
          label: "Report a correction",
        },
        {
          href: LEGAL_ROUTES.affiliateDisclosure,
          label: "Affiliate disclosure",
        },
      ]}
    >
      <ol className="space-y-6">
        {steps.map((step) => (
          <li key={step.title}>
            <SectionBlock heading={step.title}>
              <p>{step.body}</p>
            </SectionBlock>
          </li>
        ))}
      </ol>

      <SectionBlock heading="Hands-on testing">
        <p>
          We only describe hands-on testing when testing metadata supports it. If
          a page does not say we tested a product, treat the evaluation as
          research- and methodology-based.
        </p>
      </SectionBlock>

      <SectionBlock heading="AI-assisted content">
        <p>
          AI may help draft from approved facts and assessments. Humans approve
          publishable judgments. AI must not invent live prices or fake testing
          experience.
        </p>
      </SectionBlock>

      <SectionBlock heading="Corrections">
        <p>
          Spot something outdated or incorrect?{" "}
          <Link href={`${COMPANY_ROUTES.contact}?reason=correction`}>
            Tell us
          </Link>
          . Include the URL and what looks wrong.
        </p>
      </SectionBlock>
    </FoundationPageShell>
  );
}
