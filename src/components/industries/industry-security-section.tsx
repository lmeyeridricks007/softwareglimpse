import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { isPageDetailHref } from "@/components/industries/detail-href";
import { cn } from "@/lib/cn";

type Dimension = {
  id: string;
  title: string;
  description: string;
  href?: string;
};

type Props = {
  title?: string;
  dimensions: Dimension[];
  disclaimer: string;
  className?: string;
};

export function IndustrySecuritySection({
  title = "Security, compliance and governance considerations",
  dimensions,
  disclaimer,
  className,
}: Props) {
  if (dimensions.length === 0) return null;

  return (
    <section
      id="security"
      aria-labelledby="security-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="security-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Use these dimensions when evaluating vendors. We do not claim specific
        regulatory compliance unless verified evidence exists.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {dimensions.map((item) => {
          const href = isPageDetailHref(item.href) ? item.href : undefined;
          const card = (
            <Card
              className={cn(
                "h-full p-4",
                href && "transition-colors group-hover:border-[var(--sg-color-primary)]/40",
              )}
            >
              <p
                className={cn(
                  "text-sm font-semibold text-[var(--sg-color-text)]",
                  href && "group-hover:text-[var(--sg-color-primary)]",
                )}
              >
                {item.title}
              </p>
              <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                {item.description}
              </p>
              {href ? (
                <p className="mt-3 text-xs font-medium text-[var(--sg-color-primary)]">
                  Explore requirement →
                </p>
              ) : null}
            </Card>
          );
          return (
            <li key={item.id}>
              {href ? (
                <Link href={href} className="group block h-full">
                  {card}
                </Link>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
      <aside
        role="note"
        className="mt-5 flex gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-warning)]/30 bg-[var(--sg-color-warning-soft)]/50 px-4 py-3"
      >
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-warning)]"
          aria-hidden
        />
        <p className="text-sm text-[var(--sg-color-text-muted)]">{disclaimer}</p>
      </aside>
    </section>
  );
}
