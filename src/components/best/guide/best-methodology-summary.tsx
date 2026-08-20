import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  methodology: NonNullable<BestPageModel["methodology"]>;
  className?: string;
};

export function BestMethodologySummary({ methodology, className }: Props) {
  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {methodology.heading}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        {methodology.intro}
      </p>

      {methodology.criteria.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {methodology.criteria.map((c) => (
            <li key={c.slug}>
              <Card className="h-full p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text)]">
                    {c.name}
                  </p>
                  {typeof c.weightPercent === "number" ? (
                    <span className="text-xs font-medium tabular-nums text-[var(--sg-color-primary)]">
                      {c.weightPercent}%
                    </span>
                  ) : null}
                </div>
                {c.description ? (
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    {c.description}
                  </p>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6">
        <ButtonLink href={methodology.href} variant="outline">
          Read our complete evaluation methodology
        </ButtonLink>
      </div>
      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
        Research-backed recommendations using category-specific criteria.{" "}
        <Link
          href={methodology.href}
          className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Read methodology
        </Link>
      </p>
    </div>
  );
}
