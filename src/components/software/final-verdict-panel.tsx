import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type FinalVerdictPanelProps = {
  productName: string;
  chooseIf: string[];
  considerOtherIf: string[];
  body: string[];
  primaryCta?: React.ReactNode;
  secondaryCta?: React.ReactNode;
  tertiaryCta?: React.ReactNode;
  className?: string;
};

export function FinalVerdictPanel({
  productName,
  chooseIf,
  considerOtherIf,
  body,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  className,
}: FinalVerdictPanelProps) {
  const hasChoose = chooseIf.length > 0;
  const hasConsider = considerOtherIf.length > 0;
  const hasBody = body.length > 0;
  const hasCtas = Boolean(primaryCta || secondaryCta || tertiaryCta);

  if (!hasChoose && !hasConsider && !hasBody && !hasCtas) {
    return null;
  }

  return (
    <section
      id="final-verdict"
      aria-labelledby="final-verdict-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="final-verdict-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Final verdict: should you choose {productName}?
      </h2>

      {(hasChoose || hasConsider) && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {hasChoose ? (
            <Card
              variant="soft"
              className="bg-[var(--sg-color-success-soft)]/30"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
                Choose {productName} if
              </h3>
              <ul className="mt-3 space-y-2.5">
                {chooseIf.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm text-[var(--sg-color-text-muted)]"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
          {hasConsider ? (
            <Card
              variant="soft"
              className="bg-[var(--sg-color-danger-soft)]/25"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-danger)]">
                Consider another tool if
              </h3>
              <ul className="mt-3 space-y-2.5">
                {considerOtherIf.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm text-[var(--sg-color-text-muted)]"
                  >
                    <X
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-danger)]"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      )}

      {hasBody ? (
        <div className="mt-6 max-w-3xl space-y-4">
          {body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="text-sm leading-relaxed text-[var(--sg-color-text-muted)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {hasCtas ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {primaryCta}
          {secondaryCta}
          {tertiaryCta}
        </div>
      ) : null}
    </section>
  );
}
