import type { EvidenceLevel, EditorialTrustMetadata, Software } from "@/domain";
import { EditorialTrustMetadataSchema } from "@/domain";
import { buildEditorialTrustMetadata } from "./evidence-level";

const EVIDENCE_RANK: Record<EvidenceLevel, number> = {
  researched: 0,
  data_verified: 1,
  hands_on_tested: 2,
};

function weakerEvidence(a: EvidenceLevel, b: EvidenceLevel): EvidenceLevel {
  return EVIDENCE_RANK[a] <= EVIDENCE_RANK[b] ? a : b;
}

/** Coerce date / datetime strings into schema-safe ISO datetime; drop junk. */
function normalizeIsoDateTime(
  value?: string | null,
): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00:00.000Z`;
  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString();
}

function earlierIso(a?: string | null, b?: string | null): string | undefined {
  const aa = normalizeIsoDateTime(a);
  const bb = normalizeIsoDateTime(b);
  if (!aa) return bb;
  if (!bb) return aa;
  return aa <= bb ? aa : bb;
}

function laterIso(a?: string | null, b?: string | null): string | undefined {
  const aa = normalizeIsoDateTime(a);
  const bb = normalizeIsoDateTime(b);
  if (!aa) return bb;
  if (!bb) return aa;
  return aa >= bb ? aa : bb;
}

/**
 * Comparison-level trust: conservative merge of both products.
 * Never claims hands-on or pricing verification unless both sides support it.
 */
export function buildComparisonTrustMetadata(input: {
  productA?: Software | null;
  productB?: Software | null;
  lastUpdated?: string | null;
  methodologyVersion?: string | null;
  methodologySlug?: string | null;
}): EditorialTrustMetadata {
  const trustA = buildEditorialTrustMetadata({ software: input.productA });
  const trustB = buildEditorialTrustMetadata({ software: input.productB });

  const bothHandsOn =
    trustA.handsOnTesting === true &&
    trustB.handsOnTesting === true &&
    Boolean(trustA.testedAt) &&
    Boolean(trustB.testedAt);

  const bothPricing =
    Boolean(trustA.pricingVerifiedAt) && Boolean(trustB.pricingVerifiedAt);

  const evidenceLevel = bothHandsOn
    ? ("hands_on_tested" as const)
    : weakerEvidence(trustA.evidenceLevel, trustB.evidenceLevel);

  return EditorialTrustMetadataSchema.parse({
    evidenceLevel,
    lastUpdated: laterIso(
      input.lastUpdated,
      laterIso(trustA.lastUpdated, trustB.lastUpdated),
    ),
    pricingVerifiedAt: bothPricing
      ? earlierIso(trustA.pricingVerifiedAt, trustB.pricingVerifiedAt)
      : undefined,
    testedAt: bothHandsOn
      ? earlierIso(trustA.testedAt, trustB.testedAt)
      : undefined,
    handsOnTesting: bothHandsOn,
    methodologyVersion: input.methodologyVersion || undefined,
    methodologySlug: input.methodologySlug || undefined,
    sourceIds: [
      ...new Set([...(trustA.sourceIds ?? []), ...(trustB.sourceIds ?? [])]),
    ],
    researchDate: earlierIso(trustA.researchDate, trustB.researchDate),
  });
}
