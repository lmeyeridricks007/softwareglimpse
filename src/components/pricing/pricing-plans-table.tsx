import type { CurrencyCode, PricingPlan } from "@/domain";
import { formatMoney, fromMajor } from "@/domain";

type Props = {
  plans: PricingPlan[];
  currency?: string;
  /** Optional precomputed example monthly-equivalent by plan slug. */
  exampleMonthlyByPlanSlug?: Record<string, number>;
  exampleUsers?: number;
};

/**
 * Accessible plans table for product pricing pages.
 * Does not invent prices — contact-sales and empty rules are labeled explicitly.
 */
export function PricingPlansTable({
  plans,
  currency,
  exampleMonthlyByPlanSlug,
  exampleUsers,
}: Props) {
  const displayCurrency = (currency ?? "USD") as CurrencyCode;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">Published pricing plans</caption>
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th scope="col" className="py-2 pr-3 font-medium">
              Plan
            </th>
            <th scope="col" className="py-2 pr-3 font-medium">
              List pricing
            </th>
            <th scope="col" className="py-2 pr-3 font-medium">
              Billing
            </th>
            {exampleMonthlyByPlanSlug ? (
              <th scope="col" className="py-2 font-medium">
                Example ({exampleUsers ?? "n"} users / mo eq.)
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => {
            const seatRule = plan.rules.find((r) => r.kind === "per-seat");
            const isContact =
              Boolean(plan.contactSales) || plan.rules.length === 0;
            const example = exampleMonthlyByPlanSlug?.[plan.slug];

            return (
              <tr
                key={plan.id}
                className="border-b border-[var(--color-border)] align-top"
              >
                <th scope="row" className="py-3 pr-3 font-medium">
                  {plan.name}
                  {plan.isFree ? (
                    <span className="ml-2 text-xs font-normal text-[var(--color-fg-muted)]">
                      Free
                    </span>
                  ) : null}
                </th>
                <td className="py-3 pr-3">
                  {isContact ? (
                    <span>Contact sales</span>
                  ) : plan.isFree ? (
                    <span>{formatMoney(fromMajor(0, displayCurrency))}</span>
                  ) : seatRule && seatRule.kind === "per-seat" ? (
                    <span className="tabular-nums">
                      {formatMoney(
                        fromMajor(seatRule.amountPerSeat, seatRule.currency),
                      )}{" "}
                      / seat
                      {seatRule.amountPeriod === "month" ||
                      seatRule.amountPeriod == null
                        ? " (monthly rate)"
                        : " (annual rate)"}
                    </span>
                  ) : (
                    <span>See plan rules</span>
                  )}
                </td>
                <td className="py-3 pr-3 text-[var(--color-fg-muted)]">
                  {isContact
                    ? "Custom"
                    : seatRule && seatRule.kind === "per-seat"
                      ? seatRule.interval === "year"
                        ? "Typically billed annually"
                        : seatRule.interval === "month"
                          ? "Monthly billing"
                          : seatRule.interval
                      : "—"}
                </td>
                {exampleMonthlyByPlanSlug ? (
                  <td className="py-3 tabular-nums">
                    {isContact
                      ? "Contact sales"
                      : typeof example === "number"
                        ? formatMoney(fromMajor(example, displayCurrency))
                        : "—"}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
