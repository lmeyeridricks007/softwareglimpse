import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  body: string;
  methodologyHref?: string;
  className?: string;
};

export function BestMethodologyBanner({
  title,
  body,
  methodologyHref = COMPANY_ROUTES.methodology,
  className,
}: Props) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex gap-3">
        <ShieldCheck
          className="mt-0.5 size-6 shrink-0 text-[var(--sg-color-primary)]"
          aria-hidden
        />
        <div>
          <h2 className="font-semibold text-[var(--sg-color-text)]">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            {body}{" "}
            <Link
              href={COMPANY_ROUTES.howWeReview}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              How we review
            </Link>
          </p>
        </div>
      </div>
      <ButtonLink
        href={methodologyHref}
        variant="secondary"
        className="shrink-0 bg-[var(--sg-color-surface)]"
      >
        View our full methodology →
      </ButtonLink>
    </aside>
  );
}
