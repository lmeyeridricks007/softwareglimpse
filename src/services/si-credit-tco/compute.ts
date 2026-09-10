import type {
  SiCreditTcoInputs,
  SiCreditTcoLine,
  SiCreditTcoResult,
} from "@/domain/schemas/si-credit-tco";

export const SI_CREDIT_TCO_DEFAULTS: SiCreditTcoInputs = {
  seats: 5,
  seatPricePerMonth: null,
  creditsPerMonth: 2_000,
  creditUnitPrice: null,
  overageCredits: 0,
  overageUnitPrice: null,
  mobileCredits: 0,
  mobileUnitPrice: null,
  annualDiscountPercent: 0,
};

function clampNonNeg(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function majorToMinor(major: number): number {
  return Math.round(major * 100);
}

function lineMonthlyMinor(
  quantity: number,
  unitPrice: number | null,
): number | null {
  if (unitPrice === null || !Number.isFinite(unitPrice) || unitPrice < 0) {
    return null;
  }
  return Math.round(quantity * majorToMinor(unitPrice));
}

/**
 * Pure credit + seat TCO from buyer assumptions / quote inputs.
 * Missing unit prices stay unknown — never treated as $0.
 */
export function computeSiCreditTco(
  raw: SiCreditTcoInputs,
): SiCreditTcoResult {
  const seats = Math.floor(clampNonNeg(raw.seats));
  const creditsPerMonth = Math.floor(clampNonNeg(raw.creditsPerMonth));
  const overageCredits = Math.floor(clampNonNeg(raw.overageCredits));
  const mobileCredits = Math.floor(clampNonNeg(raw.mobileCredits));
  const annualDiscountPercent = Math.min(
    100,
    Math.max(0, clampNonNeg(raw.annualDiscountPercent)),
  );

  const lines: SiCreditTcoLine[] = [
    {
      id: "seats",
      label: "Seats",
      quantity: seats,
      unitPrice: raw.seatPricePerMonth,
      monthlyMinor: lineMonthlyMinor(seats, raw.seatPricePerMonth),
      known: raw.seatPricePerMonth !== null && seats >= 0,
      note:
        raw.seatPricePerMonth === null
          ? "Enter your quote or published seat price — ZoomInfo and many SI packages are quote-only."
          : undefined,
    },
    {
      id: "credits",
      label: "Standard credits",
      quantity: creditsPerMonth,
      unitPrice: raw.creditUnitPrice,
      monthlyMinor: lineMonthlyMinor(creditsPerMonth, raw.creditUnitPrice),
      known: raw.creditUnitPrice !== null,
      note:
        raw.creditUnitPrice === null
          ? "Credit unit prices are almost always quote- or pack-specific — paste yours."
          : undefined,
    },
    {
      id: "overage",
      label: "Overage credits",
      quantity: overageCredits,
      unitPrice: raw.overageUnitPrice,
      monthlyMinor: lineMonthlyMinor(overageCredits, raw.overageUnitPrice),
      known:
        overageCredits === 0 ||
        (raw.overageUnitPrice !== null && overageCredits > 0),
      note:
        overageCredits > 0 && raw.overageUnitPrice === null
          ? "Overage / top-up rate missing — excluded from known TCO."
          : overageCredits === 0
            ? "No overage volume modeled."
            : undefined,
    },
    {
      id: "mobile",
      label: "Mobile credits",
      quantity: mobileCredits,
      unitPrice: raw.mobileUnitPrice,
      monthlyMinor: lineMonthlyMinor(mobileCredits, raw.mobileUnitPrice),
      known:
        mobileCredits === 0 ||
        (raw.mobileUnitPrice !== null && mobileCredits > 0),
      note:
        mobileCredits > 0 && raw.mobileUnitPrice === null
          ? "Mobile / phone credit unit price missing — excluded from known TCO."
          : mobileCredits === 0
            ? "No mobile credit volume modeled."
            : undefined,
    },
  ];

  // Zero-volume lines with null prices are "known" as $0 contribution.
  for (const line of lines) {
    if (line.quantity === 0 && line.monthlyMinor === null) {
      line.monthlyMinor = 0;
      line.known = true;
    }
  }

  const knownMonthlyMinor = lines.reduce(
    (sum, line) => sum + (line.known && line.monthlyMinor !== null ? line.monthlyMinor : 0),
    0,
  );

  const annualBeforeDiscount = knownMonthlyMinor * 12;
  const knownAnnualMinor = Math.round(
    annualBeforeDiscount * (1 - annualDiscountPercent / 100),
  );

  const unknownLineIds = lines
    .filter((line) => !line.known)
    .map((line) => line.id);

  return {
    currency: "USD",
    lines,
    knownMonthlyMinor,
    knownAnnualMinor,
    unknownLineIds,
    allLinesKnown: unknownLineIds.length === 0,
    annualDiscountPercent,
  };
}
