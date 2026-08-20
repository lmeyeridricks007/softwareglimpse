import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  categoryShortName: string;
  types: BestPageModel["softwareTypes"];
  className?: string;
};

export function BestSoftwareTypes({
  categoryShortName,
  types,
  className,
}: Props) {
  if (types.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {categoryShortName} types explained
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {types.map((t) => (
          <li key={t.id}>
            <Card className="h-full p-4">
              <p className="font-semibold text-[var(--sg-color-text)]">{t.name}</p>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {t.description}
              </p>
              {t.href ? (
                <Link
                  href={t.href}
                  className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Learn more →
                </Link>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
