import { Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type SeatExample = {
  label: string;
  seats: number;
  note?: string;
};

type StartingPrice = {
  name: string;
  teaser: string;
  verifiedAt: string | null;
};

type Props = {
  title: string;
  summary: string;
  seatExamples?: SeatExample[];
  startingPrices?: StartingPrice[];
  calculatorHref?: string;
  guideHref?: string;
  className?: string;
};

export function CategoryPricingPreview({
  title,
  summary,
  seatExamples = [],
  startingPrices = [],
  calculatorHref,
  guideHref,
  className,
}: Props) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)] px-5 py-8 sm:px-8",
        className,
      )}
    >
      <h2
        id="pricing-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
        {summary}
      </p>

      {seatExamples.length > 0 ? (
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {seatExamples.map((ex) => (
            <li key={ex.label}>
              <Card className="p-4">
                <span className="inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                  <Users className="size-4" aria-hidden />
                </span>
                <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                  {ex.label}
                </p>
                <p className="mt-1 text-2xl font-semibold text-[var(--sg-color-primary)]">
                  {ex.seats} users
                </p>
                {ex.note ? (
                  <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                    {ex.note}
                  </p>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      ) : null}

      {startingPrices.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Verified starting prices
          </h3>
          <ul className="mt-3 divide-y divide-[var(--sg-color-border)] rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
            {startingPrices.map((p) => (
              <li
                key={p.name}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
              >
                <span className="font-medium">{p.name}</span>
                <span>
                  {p.teaser}
                  {p.verifiedAt ? (
                    <span className="ml-2 text-xs text-[var(--sg-color-text-muted)]">
                      verified {p.verifiedAt.slice(0, 10)}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {calculatorHref ? (
          <ButtonLink href={calculatorHref}>Use cost calculator</ButtonLink>
        ) : null}
        {guideHref ? (
          <ButtonLink href={guideHref} variant="outline">
            Read pricing guidance
          </ButtonLink>
        ) : null}
      </div>
    </section>
  );
}
