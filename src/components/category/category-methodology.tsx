import Link from "next/link";
import { Scale } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  description?: string;
  criteria: string[];
  href?: string;
  className?: string;
};

export function CategoryMethodology({
  title,
  description,
  criteria,
  href = COMPANY_ROUTES.methodology,
  className,
}: Props) {
  if (criteria.length === 0) return null;

  return (
    <section
      id="methodology"
      aria-labelledby="methodology-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-navy)] px-5 py-8 text-[var(--sg-color-text-inverse)] sm:px-8",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] bg-white/10">
          <Scale className="size-5 text-white" aria-hidden />
        </span>
        <div>
          <h2
            id="methodology-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-white"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-white/75">{description}</p>
          ) : null}
        </div>
      </div>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {criteria.map((c) => (
          <li
            key={c}
            className="rounded-[var(--sg-radius-md)] bg-white/10 px-3 py-2.5 text-sm text-white/90"
          >
            {c}
          </li>
        ))}
      </ul>
      {href ? (
        <div className="mt-6">
          <ButtonLink href={href} variant="onDark">
            Read our methodology
          </ButtonLink>
        </div>
      ) : (
        <p className="mt-4 text-sm text-white/70">
          <Link href={COMPANY_ROUTES.methodology} className="underline">
            Editorial methodology
          </Link>
        </p>
      )}
    </section>
  );
}
