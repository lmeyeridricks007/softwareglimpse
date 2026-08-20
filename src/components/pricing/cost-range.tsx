import { formatMoney, type Money } from "@/domain";
import { cn } from "@/lib/cn";

type Marker = {
  label: string;
  money: Money;
  tone?: "success" | "primary" | "muted";
};

type Props = {
  low: Money;
  high: Money;
  markers: Marker[];
  /** Current estimate marker — included in the accessible label. */
  current?: Money;
  caption?: string;
  className?: string;
  /**
   * When false, omit the value legend under the track (use when prices are
   * already shown above, e.g. hero KPI row).
   */
  showMarkerValues?: boolean;
};

function pct(value: number, low: number, high: number) {
  const span = Math.max(high - low, 1);
  return Math.max(0, Math.min(100, ((value - low) / span) * 100));
}

function toneDot(tone: Marker["tone"]) {
  if (tone === "success") {
    return "bg-[var(--sg-color-success)] ring-[var(--sg-color-success-soft)]";
  }
  if (tone === "muted") {
    return "bg-[var(--sg-color-text-muted)] ring-[var(--sg-color-surface-muted)]";
  }
  return "bg-[var(--sg-color-primary)] ring-[var(--sg-color-primary-soft)]";
}

function toneText(tone: Marker["tone"]) {
  if (tone === "success") return "text-[var(--sg-color-success)]";
  if (tone === "muted") return "text-[var(--sg-color-navy)]";
  return "text-[var(--sg-color-primary)]";
}

/**
 * Single horizontal cost distribution — track + dots, values in a legend below.
 */
export function CostRange({
  low,
  high,
  markers,
  current,
  caption,
  className,
  showMarkerValues = true,
}: Props) {
  const lowMinor = low.amountMinor;
  const highMinor = high.amountMinor;

  // Keep edge dots fully visible inside the track.
  const markerLeft = (minor: number) => {
    const raw = pct(minor, lowMinor, highMinor);
    return Math.max(2, Math.min(98, raw));
  };

  return (
    <div className={cn(className)}>
      <div
        className="relative h-3"
        role="img"
        aria-label={`Cost range from ${formatMoney(low)} to ${formatMoney(high)}${
          current ? `, current estimate ${formatMoney(current)}` : ""
        }. ${markers
          .map((m) => `${m.label}: ${formatMoney(m.money)}`)
          .join("; ")}`}
      >
        <div
          className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[var(--sg-color-success)] via-[var(--sg-color-primary)] to-[var(--sg-color-warning)]"
          aria-hidden
        />
        {markers.map((marker) => (
          <span
            key={`${marker.label}-${marker.money.amountMinor}`}
            className={cn(
              "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4",
              toneDot(marker.tone),
            )}
            style={{ left: `${markerLeft(marker.money.amountMinor)}%` }}
            title={`${marker.label}: ${formatMoney(marker.money)}`}
            aria-hidden
          />
        ))}
      </div>

      {showMarkerValues ? (
        <ul className="mt-3 grid grid-cols-3 gap-2 text-center">
          {markers.map((marker) => (
            <li key={`legend-${marker.label}-${marker.money.amountMinor}`}>
              <p
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]",
                )}
              >
                {marker.label}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-xs font-semibold tabular-nums",
                  toneText(marker.tone),
                )}
              >
                {formatMoney(marker.money)}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {caption ? (
        <p className="mt-3 text-xs leading-snug text-[var(--sg-color-text-muted)]">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
