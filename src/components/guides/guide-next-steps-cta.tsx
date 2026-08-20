import { Calculator, Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  variant?: "finder" | "generic";
  className?: string;
};

export function GuideNextStepsCta({
  title,
  body,
  href,
  ctaLabel,
  variant = "generic",
  className,
}: Props) {
  const Icon = variant === "finder" ? Compass : Calculator;

  return (
    <aside
      className={cn(
        "flex flex-col gap-4 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="flex gap-3">
        <Icon
          className="mt-0.5 size-6 shrink-0 text-[var(--sg-color-success)]"
          aria-hidden
        />
        <div>
          <p className="font-semibold text-[var(--sg-color-text)]">{title}</p>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {body}
          </p>
        </div>
      </div>
      <ButtonLink
        href={href}
        className="shrink-0 bg-[var(--sg-color-success)] hover:opacity-90 sm:self-center"
      >
        {ctaLabel}
      </ButtonLink>
    </aside>
  );
}
