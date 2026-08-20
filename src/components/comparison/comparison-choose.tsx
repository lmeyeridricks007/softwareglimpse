import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type ChooseSide = {
  productName: string;
  scenarios: string[];
};

type Props = {
  chooseA?: ChooseSide;
  chooseB?: ChooseSide;
  className?: string;
};

export function ComparisonChooseSection({
  chooseA,
  chooseB,
  className,
}: Props) {
  if (!chooseA && !chooseB) return null;

  return (
    <section
      id="choose"
      aria-labelledby="choose-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="choose-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Which one should you choose?
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {chooseA ? (
          <Card className="border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/40">
            <h3 className="font-semibold text-[var(--sg-color-text)]">
              Choose {chooseA.productName} if:
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {chooseA.scenarios.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ) : null}
        {chooseB ? (
          <Card className="border-[var(--sg-color-danger)]/20 bg-[var(--sg-color-danger-soft)]/35">
            <h3 className="font-semibold text-[var(--sg-color-text)]">
              Choose {chooseB.productName} if:
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {chooseB.scenarios.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
