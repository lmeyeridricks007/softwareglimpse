import { formatMoney, type ProductCostEstimate } from "@/domain";
import {
  deriveCostRangeSummary,
  positionInRangeLabel,
} from "@/services/pricing";
import { CostRange } from "./cost-range";
import { cn } from "@/lib/cn";

type Props = {
  estimates: ProductCostEstimate[];
  users: number;
  requiredCapabilityCount: number;
  className?: string;
};

/**
 * Live calculator preview for the hero — uses real estimate state, not demo numbers.
 */
export function CalculatorHeroPreview({
  estimates,
  users,
  requiredCapabilityCount,
  className,
}: Props) {
  const range = deriveCostRangeSummary(estimates);

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-md)]",
        className,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Live estimate preview
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-primary-soft)] px-2.5 py-1 font-medium text-[var(--sg-color-primary)]">
          {users} users
        </span>
        <span className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-surface-muted)] px-2.5 py-1 font-medium text-[var(--sg-color-text-muted)]">
          {requiredCapabilityCount} requirement
          {requiredCapabilityCount === 1 ? "" : "s"}
        </span>
      </div>

      {!range ? (
        <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
          Enter seats to preview verified list-price ranges. Values update as
          you change inputs.
        </p>
      ) : (
        <>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Estimated monthly range
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold tabular-nums text-[var(--sg-color-success)]">
                {formatMoney(range.lowest.monthlyEquivalent)}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Lowest
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold tabular-nums text-[var(--sg-color-primary)]">
                {formatMoney(range.midpoint.monthlyEquivalent)}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Mid-range
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold tabular-nums text-[var(--sg-color-navy)]">
                {formatMoney(range.highest.monthlyEquivalent)}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                High end
              </p>
            </div>
          </div>
          <CostRange
            className="mt-4"
            showMarkerValues={false}
            low={range.lowest.monthlyEquivalent}
            high={range.highest.monthlyEquivalent}
            current={range.lowest.monthlyEquivalent}
            markers={[
              {
                label: "Lowest",
                money: range.lowest.monthlyEquivalent,
                tone: "success",
              },
              {
                label: "Mid-range",
                money: range.midpoint.monthlyEquivalent,
                tone: "primary",
              },
              {
                label: "High end",
                money: range.highest.monthlyEquivalent,
                tone: "muted",
              },
            ]}
            caption={positionInRangeLabel(
              range.lowest.monthlyEquivalent.amountMinor,
              range,
            )}
          />
        </>
      )}
    </div>
  );
}
