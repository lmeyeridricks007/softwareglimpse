import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BestPageNavItem } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  nav: BestPageNavItem[];
  finderHref?: string;
  finderLabel?: string;
  className?: string;
};

export function BestGuideSidebar({
  nav,
  finderHref,
  finderLabel,
  className,
}: Props) {
  return (
    <aside className={cn("space-y-4", className)}>
      {nav.length > 0 ? (
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            In this guide
          </p>
          <nav aria-label="Guide sections" className="mt-3">
            <ul className="space-y-2">
              {nav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`#${item.id}`}
                    className="text-sm text-[var(--sg-color-text)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Card>
      ) : null}

      {finderHref && finderLabel ? (
        <Card className="border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/40 p-4">
          <p className="text-sm font-semibold text-[var(--sg-color-text)]">
            Need help choosing?
          </p>
          <ButtonLink href={finderHref} className="mt-3 w-full justify-center">
            {finderLabel}
          </ButtonLink>
        </Card>
      ) : null}
    </aside>
  );
}
