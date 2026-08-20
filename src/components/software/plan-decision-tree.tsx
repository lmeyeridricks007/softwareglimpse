import { ArrowUpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type PlanDecisionItem = {
  planSlug: string;
  planName: string;
  bestFor: string[];
  chooseIf: string[];
  skipIf?: string[];
  upgradeWhen?: string[];
};

export type PlanDecisionTreeProps = {
  productName: string;
  plans: PlanDecisionItem[];
  className?: string;
};

export function PlanDecisionTree({
  productName,
  plans,
  className,
}: PlanDecisionTreeProps) {
  if (plans.length < 1) return null;

  const upgradeItems = plans.flatMap((plan) =>
    (plan.upgradeWhen ?? []).map((trigger) => ({
      planName: plan.planName,
      trigger,
    })),
  );

  return (
    <section
      id="plan-choice"
      aria-labelledby="plan-choice-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="plan-choice-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Which {productName} plan should you choose?
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
        Plan guidance is based on plan tiers and documented limits.
        Verify current features and pricing on the vendor site before you buy.
      </p>

      <ul className="mt-5 space-y-4">
        {plans.map((plan) => (
          <li key={plan.planSlug}>
            <Card>
              <h3 className="font-semibold text-[var(--sg-color-text)]">
                {plan.planName}
              </h3>
              {plan.bestFor.length > 0 ? (
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  Best for: {plan.bestFor.join(", ")}
                </p>
              ) : null}

              {plan.chooseIf.length > 0 ? (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[var(--sg-color-text)]">
                    Choose {plan.planName} if
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                    {plan.chooseIf.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--sg-color-primary)]"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {plan.skipIf && plan.skipIf.length > 0 ? (
                <div className="mt-4 border-t border-[var(--sg-color-border)] pt-4">
                  <p className="text-sm font-semibold text-[var(--sg-color-text)]">
                    Skip {plan.planName} if
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                    {plan.skipIf.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--sg-color-border-strong)]"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>

      {upgradeItems.length > 0 ? (
        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text)]">
            <ArrowUpCircle
              className="size-4 text-[var(--sg-color-primary)]"
              aria-hidden
            />
            When to move up
          </h3>
          <ul className="mt-3 space-y-2">
            {upgradeItems.map((item) => (
              <li
                key={`${item.planName}-${item.trigger}`}
                className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]"
              >
                <span className="font-medium text-[var(--sg-color-text)]">
                  {item.planName}:
                </span>{" "}
                {item.trigger}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
