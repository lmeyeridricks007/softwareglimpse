import Link from "next/link";
import { LEGAL_ROUTES } from "@/services/site-foundation/config";

type AffiliateProps = {
  required?: boolean;
};

export function AffiliateDisclosure({ required = true }: AffiliateProps) {
  if (!required) return null;
  return (
    <p className="text-xs text-[var(--color-fg-muted)]">
      Affiliate disclosure: some links may be affiliate links. We may earn a
      commission at no extra cost to you. Rankings and scores are never based on
      commission.{" "}
      <Link
        href={LEGAL_ROUTES.affiliateDisclosure}
        className="underline underline-offset-2"
      >
        Full disclosure
      </Link>
    </p>
  );
}

type MethodologyProps = {
  version?: string;
};

export function MethodologyDisclosure({ version }: MethodologyProps) {
  return (
    <p className="text-xs text-[var(--color-fg-muted)]">
      Methodology disclosure: scores and recommendations follow SoftwareGlimpse
      evaluation criteria
      {version ? ` (version ${version})` : ""}. Affiliate relationships do not
      determine rankings.
    </p>
  );
}

type ResearchProps = {
  fixtureBased?: boolean;
};

export function ResearchTransparency({ fixtureBased = false }: ResearchProps) {
  return (
    <p className="text-xs text-[var(--color-fg-muted)]">
      How we recommend: product claims are tied to recorded research where
      available.
      {fixtureBased
        ? " Some details on this page are still being verified against primary sources."
        : ""}
    </p>
  );
}

type AiProps = {
  used?: boolean;
};

export function AiAssistedDisclosure({ used = true }: AiProps) {
  if (!used) return null;
  return (
    <p className="text-xs text-[var(--color-fg-muted)]">
      AI-assisted disclosure: drafts may be AI-assisted from approved facts and
      assessments. Humans approve publishable editorial judgments. AI does not
      invent live prices or claim hands-on testing.
    </p>
  );
}

type BundleProps = {
  showAffiliate?: boolean;
  showMethodology?: boolean;
  methodologyVersion?: string;
  showResearch?: boolean;
  fixtureBased?: boolean;
  showAi?: boolean;
  aiUsed?: boolean;
};

/**
 * Centralized disclosure block — keep wording consistent; avoid hero clutter.
 */
export function EditorialDisclosures({
  showAffiliate = true,
  showMethodology = true,
  methodologyVersion,
  showResearch = true,
  fixtureBased = false,
  showAi = true,
  aiUsed = true,
}: BundleProps) {
  return (
    <footer className="mt-10 space-y-2 border-t border-[var(--color-border)] pt-6">
      <AffiliateDisclosure required={showAffiliate} />
      {showMethodology ? (
        <MethodologyDisclosure version={methodologyVersion} />
      ) : null}
      {showResearch ? (
        <ResearchTransparency fixtureBased={fixtureBased} />
      ) : null}
      <AiAssistedDisclosure used={showAi && aiUsed} />
    </footer>
  );
}
