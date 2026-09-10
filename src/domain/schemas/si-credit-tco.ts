/**
 * Sales Intelligence credit TCO — user-quote inputs only.
 * Never seed unpublished ZoomInfo (or other quote-only) list prices.
 */

export type SiCreditTcoInputs = {
  /** Seat count for the buying pod. */
  seats: number;
  /** Seat list / quote price per seat per month (USD major). Null = unknown. */
  seatPricePerMonth: number | null;
  /** Included / planned standard credits unlocked per month. */
  creditsPerMonth: number;
  /** Unit price for a standard credit (USD major). Null = unknown. */
  creditUnitPrice: number | null;
  /** Credits expected to burn above the included allowance. */
  overageCredits: number;
  /** Per-credit overage / top-up price (USD major). Null = unknown. */
  overageUnitPrice: number | null;
  /** Mobile / phone credits planned for the month (separate pool or premium reveals). */
  mobileCredits: number;
  /** Unit price for a mobile credit (USD major). Null = unknown. */
  mobileUnitPrice: number | null;
  /** Optional annual-commit savings percent applied to annual TCO (0–100). */
  annualDiscountPercent: number;
};

export type SiCreditTcoLineId =
  | "seats"
  | "credits"
  | "overage"
  | "mobile";

export type SiCreditTcoLine = {
  id: SiCreditTcoLineId;
  label: string;
  /** Volume used in the line (seats or credits). */
  quantity: number;
  /** Unit price in USD major when known. */
  unitPrice: number | null;
  /** Monthly line total in USD minor when computable. */
  monthlyMinor: number | null;
  known: boolean;
  note?: string;
};

export type SiCreditTcoResult = {
  currency: "USD";
  lines: SiCreditTcoLine[];
  /** Sum of known monthly lines (minor). */
  knownMonthlyMinor: number;
  /** knownMonthly × 12, then annual discount if set. */
  knownAnnualMinor: number;
  unknownLineIds: SiCreditTcoLineId[];
  allLinesKnown: boolean;
  annualDiscountPercent: number;
};
