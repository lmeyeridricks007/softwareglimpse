import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { ComparisonPageModel } from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
};

function Side({
  name,
  logo,
  pros,
  cons,
  accent,
  bestFor,
}: {
  name: string;
  logo?: { src: string; alt: string } | null;
  pros: string[];
  cons: string[];
  accent: "a" | "b";
  bestFor?: string;
}) {
  if (pros.length === 0 && cons.length === 0) return null;
  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden p-0",
        accent === "a"
          ? "ring-1 ring-[var(--sg-color-success)]/25"
          : "ring-1 ring-[var(--sg-color-danger)]/20",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b border-[var(--sg-color-border)] px-5 py-4",
          accent === "a"
            ? "bg-[var(--sg-color-success-soft)]/60"
            : "bg-[var(--sg-color-danger-soft)]/45",
        )}
      >
        <ProductLogo name={name} logo={logo} size="md" />
        <div>
          <h3 className="font-semibold text-[var(--sg-color-text)]">{name}</h3>
          <Badge
            variant={accent === "a" ? "success" : "danger"}
            className="mt-1"
          >
            {accent === "a" ? "Strengths in green" : "Trade-offs in red"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-5 py-4">
        {pros.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
              Pros
            </p>
            <ul className="mt-2 space-y-2">
              {pros.map((p) => (
                <li
                  key={p}
                  className="flex gap-2 text-sm text-[var(--sg-color-text-muted)]"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {cons.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-danger)]">
              Cons
            </p>
            <ul className="mt-2 space-y-2">
              {cons.map((c) => (
                <li
                  key={c}
                  className="flex gap-2 text-sm text-[var(--sg-color-text-muted)]"
                >
                  <Minus
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-danger)]"
                    aria-hidden
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {bestFor ? (
        <div
          className={cn(
            "mt-auto border-t border-[var(--sg-color-border)] px-5 py-3 text-sm",
            accent === "a"
              ? "bg-[var(--sg-color-success-soft)]/40"
              : "bg-[var(--sg-color-danger-soft)]/30",
          )}
        >
          <p className="font-medium text-[var(--sg-color-text)]">Best for</p>
          <p className="mt-1 text-[var(--sg-color-text-muted)]">{bestFor}</p>
        </div>
      ) : null}
    </Card>
  );
}

export function ComparisonProsConsTab({ model }: Props) {
  const hasChoose =
    model.productA.bestFor.length > 0 || model.productB.bestFor.length > 0;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Pros & cons
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          A balanced look at where each product shines — and where it falls
          short.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Side
            name={model.productA.name}
            logo={model.productA.logo}
            pros={model.productA.pros}
            cons={model.productA.cons}
            accent="a"
            bestFor={model.productA.bestFor[0]}
          />
          <Side
            name={model.productB.name}
            logo={model.productB.logo}
            pros={model.productB.pros}
            cons={model.productB.cons}
            accent="b"
            bestFor={model.productB.bestFor[0]}
          />
        </div>
      </div>

      {hasChoose ? (
        <section>
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
            Choose if…
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {model.productA.bestFor.length > 0 ? (
              <Card className="border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/40">
                <h4 className="font-semibold">
                  Choose {model.productA.name} if
                </h4>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                  {model.productA.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            ) : null}
            {model.productB.bestFor.length > 0 ? (
              <Card className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/30">
                <h4 className="font-semibold">
                  Choose {model.productB.name} if
                </h4>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                  {model.productB.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>
        </section>
      ) : null}

      <Card className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/25">
        <h3 className="font-semibold text-[var(--sg-color-text)]">
          Still unsure which fits?
        </h3>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Answer a few buyer questions and get a shortlist matched to your
          priorities.
        </p>
        <ButtonLink href={model.finderHref} className="mt-4">
          {model.finderLabel}
        </ButtonLink>
        <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
          Or{" "}
          <Link
            href="/compare/"
            className="font-medium underline-offset-2 hover:underline"
          >
            compare another pair
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}
