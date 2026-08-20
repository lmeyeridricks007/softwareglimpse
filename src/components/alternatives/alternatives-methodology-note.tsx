import Link from "next/link";
import { Info } from "lucide-react";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

type Props = {
  criterionCount?: number;
  className?: string;
};

export function AlternativesMethodologyNote({
  criterionCount,
  className,
}: Props) {
  return (
    <aside
      className={cn(
        "flex gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/60 px-4 py-3 text-sm text-[var(--sg-color-text-muted)]",
        className,
      )}
    >
      <Info
        className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-primary)]"
        aria-hidden
      />
      <p>
        <span className="font-medium text-[var(--sg-color-text)]">
          How we evaluate alternatives:{" "}
        </span>
        We compare products using the same editorial methodology
        {criterionCount ? ` across ${criterionCount} criteria` : ""} — affiliate
        relationships never set the order.{" "}
        <Link
          href={COMPANY_ROUTES.methodology}
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          View our full methodology →
        </Link>
      </p>
    </aside>
  );
}
