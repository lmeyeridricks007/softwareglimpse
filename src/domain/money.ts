import type { CurrencyCode } from "@/domain/schemas/primitives";

/**
 * Integer minor units (cents for USD/EUR) avoid float drift in cost math.
 * Use fromMajor/toMajor at UI boundaries; keep engine math in amountMinor.
 */
export type Money = {
  amountMinor: number;
  currency: CurrencyCode;
};

export function fromMajor(amountMajor: number, currency: CurrencyCode): Money {
  if (!Number.isFinite(amountMajor)) {
    throw new Error(`Invalid major amount: ${amountMajor}`);
  }
  return {
    amountMinor: Math.round(amountMajor * 100),
    currency,
  };
}

export function toMajor(money: Money): number {
  return money.amountMinor / 100;
}

export function add(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency };
}

export function multiply(money: Money, factor: number): Money {
  if (!Number.isFinite(factor)) {
    throw new Error(`Invalid multiply factor: ${factor}`);
  }
  return {
    amountMinor: Math.round(money.amountMinor * factor),
    currency: money.currency,
  };
}

export function zeroMoney(currency: CurrencyCode): Money {
  return { amountMinor: 0, currency };
}

export function formatMoney(
  money: Money,
  opts?: { locale?: string; maximumFractionDigits?: number },
): string {
  const locale = opts?.locale ?? "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
    maximumFractionDigits: opts?.maximumFractionDigits ?? 2,
  }).format(toMajor(money));
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new Error(
      `Currency mismatch: ${a.currency} vs ${b.currency} — do not treat amounts as comparable across currencies`,
    );
  }
}
