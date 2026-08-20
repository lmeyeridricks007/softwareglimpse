import type { Metadata } from "next";
import Link from "next/link";
import {
  listMethodologies,
} from "@/data/editorial/store";
import {
  FoundationPageShell,
  SectionBlock,
} from "@/components/site/foundation-page";
import { buildPageMetadata } from "@/seo/metadata";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";

export const metadata: Metadata = buildPageMetadata({
  title: "Editorial Methodology",
  description:
    "How SoftwareGlimpse recommendationses software, scores products, runs comparisons and Best pages, and keeps affiliates out of rankings.",
  path: COMPANY_ROUTES.methodology,
  indexable: true,
});

export default function EditorialMethodologyPage() {
  const methodologies = listMethodologies();

  return (
    <FoundationPageShell
      title="Editorial methodology"
      summary="How research, scoring, comparisons, tools, freshness, AI assistance, and affiliate independence work on SoftwareGlimpse — aligned with the live platform."
      related={[
        {
          href: COMPANY_ROUTES.howWeReview,
          label: "How we review (plain language)",
        },
        {
          href: LEGAL_ROUTES.editorialIndependence,
          label: "Editorial independence",
        },
        {
          href: LEGAL_ROUTES.affiliateDisclosure,
          label: "Affiliate disclosure",
        },
        { href: COMPANY_ROUTES.contact, label: "Report a correction" },
      ]}
    >
      <SectionBlock heading="Research">
        <p>
          Product research follows a source → snapshot → fact → normalization →
          approval pipeline. Facts keep provenance (sources, evidence excerpts,
          timestamps). AI must not write unverified facts straight into product
          JSON.
        </p>
      </SectionBlock>

      <SectionBlock heading="Verification and sources">
        <p>
          Source hierarchy prefers official pricing and product documentation,
          then other official materials, then trusted third parties. First-party
          current pricing outranks stale secondary summaries. Conflicts are
          flagged rather than silently smoothed over. Fixture data is labeled and
          must not silently win over real research.
        </p>
      </SectionBlock>

      <SectionBlock heading="Editorial assessment and scores">
        <p>
          Category methodologies define criteria, relative weights, and evidence
          expectations. Editorial assessments score products against those
          criteria with rationales. Affiliate status is ignored by scoring.
          Value-for-money judgments must not invent live prices.
        </p>
      </SectionBlock>

      <SectionBlock heading="Comparisons, Best pages, and alternatives">
        <p>
          Comparisons reuse shared criteria and evidence on canonical
          lexicographic URLs. Best pages rank within a defined scope using
          methodology — not commission rates. Alternatives pages explain
          substitutes with the same integrity rules.
        </p>
      </SectionBlock>

      <SectionBlock heading="Pricing">
        <p>
          Pricing is treated as freshness-sensitive. Structured plans and rules
          feed pricing pages and calculators. Readers should still confirm final
          vendor pricing before purchase.
        </p>
      </SectionBlock>

      <SectionBlock heading="Finder / recommendation methodology">
        <p>
          The CRM Finder maps your answers to deterministic fit scores
          (eligibility, feature fit, taxonomy, budget, integrations, and related
          dimensions). Ranking is explainable. Affiliate and promotion metadata
          are stripped from scoring snapshots and never alter sort order.
        </p>
      </SectionBlock>

      <SectionBlock heading="Freshness and corrections">
        <p>
          Critical facts are monitored for staleness through research and site
          audit workflows. Spot something outdated or incorrect?{" "}
          <Link href={`${COMPANY_ROUTES.contact}?reason=correction`}>
            Tell us via Contact → Correction
          </Link>
          . We prioritise pricing errors, outdated features, broken commercial
          links, and misleading recommendation context. Disclaimers are not a
          substitute for fixing known errors.
        </p>
      </SectionBlock>

      <SectionBlock heading="Affiliate independence">
        <p>
          Affiliate programmes affect outbound destinations and disclosure — not
          editorial scores, Best-page order, or Finder ranking. Details:{" "}
          <Link href={LEGAL_ROUTES.editorialIndependence}>
            Editorial independence
          </Link>{" "}
          and{" "}
          <Link href={LEGAL_ROUTES.affiliateDisclosure}>
            Affiliate disclosure
          </Link>
          .
        </p>
      </SectionBlock>

      <SectionBlock heading="AI assistance">
        <p>
          Drafts may be AI-assisted from approved facts and assessments. Humans
          approve publishable editorial judgments. AI must not invent live prices
          or invent hands-on testing claims.
        </p>
      </SectionBlock>

      <SectionBlock heading="Hands-on testing policy">
        <p>
          We do not imply SoftwareGlimpse personally tests every product.
          Hands-on testing language appears only when testing metadata supports
          it. Absence of a testing claim means evaluation was research- and
          methodology-based.
        </p>
      </SectionBlock>

      <SectionBlock heading="Active category methodologies">
        {methodologies.length === 0 ? (
          <p>No methodologies loaded.</p>
        ) : (
          <ul className="list-disc space-y-3 pl-5">
            {methodologies.map((m) => (
              <li key={m.id}>
                <strong>{m.name}</strong> (v{m.version} · {m.categorySlug}) —{" "}
                {m.description}
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {m.criteria.map((c) => (
                    <li key={c.id}>
                      <strong>{c.name}</strong>: {c.description}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </SectionBlock>
    </FoundationPageShell>
  );
}
