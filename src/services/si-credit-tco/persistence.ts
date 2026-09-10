import type { SiCreditTcoInputs } from "@/domain/schemas/si-credit-tco";
import { SI_CREDIT_TCO_DEFAULTS } from "./compute";

export const SI_CREDIT_TCO_STORAGE_KEY = "sg-si-credit-tco-v1";

function isFiniteOrNull(v: unknown): v is number | null {
  return v === null || (typeof v === "number" && Number.isFinite(v));
}

export function createEmptySiCreditTcoInputs(): SiCreditTcoInputs {
  return { ...SI_CREDIT_TCO_DEFAULTS };
}

export function loadSiCreditTcoInputs(): SiCreditTcoInputs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SI_CREDIT_TCO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SiCreditTcoInputs>;
    return {
      seats:
        typeof parsed.seats === "number" && Number.isFinite(parsed.seats)
          ? parsed.seats
          : SI_CREDIT_TCO_DEFAULTS.seats,
      seatPricePerMonth: isFiniteOrNull(parsed.seatPricePerMonth)
        ? parsed.seatPricePerMonth
        : null,
      creditsPerMonth:
        typeof parsed.creditsPerMonth === "number" &&
        Number.isFinite(parsed.creditsPerMonth)
          ? parsed.creditsPerMonth
          : SI_CREDIT_TCO_DEFAULTS.creditsPerMonth,
      creditUnitPrice: isFiniteOrNull(parsed.creditUnitPrice)
        ? parsed.creditUnitPrice
        : null,
      overageCredits:
        typeof parsed.overageCredits === "number" &&
        Number.isFinite(parsed.overageCredits)
          ? parsed.overageCredits
          : SI_CREDIT_TCO_DEFAULTS.overageCredits,
      overageUnitPrice: isFiniteOrNull(parsed.overageUnitPrice)
        ? parsed.overageUnitPrice
        : null,
      mobileCredits:
        typeof parsed.mobileCredits === "number" &&
        Number.isFinite(parsed.mobileCredits)
          ? parsed.mobileCredits
          : SI_CREDIT_TCO_DEFAULTS.mobileCredits,
      mobileUnitPrice: isFiniteOrNull(parsed.mobileUnitPrice)
        ? parsed.mobileUnitPrice
        : null,
      annualDiscountPercent:
        typeof parsed.annualDiscountPercent === "number" &&
        Number.isFinite(parsed.annualDiscountPercent)
          ? parsed.annualDiscountPercent
          : 0,
    };
  } catch {
    return null;
  }
}

export function saveSiCreditTcoInputs(inputs: SiCreditTcoInputs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SI_CREDIT_TCO_STORAGE_KEY,
      JSON.stringify(inputs),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function resetSiCreditTcoInputs(): SiCreditTcoInputs {
  const empty = createEmptySiCreditTcoInputs();
  saveSiCreditTcoInputs(empty);
  return empty;
}
