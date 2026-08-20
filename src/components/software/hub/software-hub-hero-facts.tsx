import {
  CircleDollarSign,
  Clock3,
  Monitor,
  Network,
  Server,
  Users,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { ReviewQuickFact } from "@/services/software-review";

type Props = {
  facts: ReviewQuickFact[];
  /** Prefer the primary summary facts for the header (price/trial/fit). */
  limit?: number;
  className?: string;
};

function FactIcon({ icon }: { icon?: ReviewQuickFact["icon"] }) {
  const common = {
    className: "size-5 shrink-0 text-[var(--sg-color-primary)]",
    "aria-hidden": true as const,
    strokeWidth: 1.75,
  };

  switch (icon) {
    case "price":
      return <CircleDollarSign {...common} />;
    case "free":
      return <Monitor {...common} />;
    case "trial":
      return <Clock3 {...common} />;
    case "best":
      return <Network {...common} />;
    case "deploy":
      return <Server {...common} />;
    case "size":
      return <Users {...common} />;
    case "company":
      return <Building2 {...common} />;
    default:
      return <CircleDollarSign {...common} />;
  }
}

/**
 * Iconized quick-fact row for the product hub header.
 * Left edge aligns with surrounding copy (title / tagline / meta).
 */
export function SoftwareHubHeroFacts({ facts, limit = 4, className }: Props) {
  const items = facts.slice(0, limit);
  if (items.length === 0) return null;

  return (
    <ul
      className={cn(
        "flex flex-wrap items-start gap-x-6 gap-y-4",
        className,
      )}
    >
      {items.map((fact) => (
        <li
          key={fact.label}
          className={cn(
            "flex min-w-0 items-start gap-2.5",
            fact.icon === "best" ? "max-w-[16rem] sm:max-w-[18rem]" : "max-w-[11rem]",
          )}
        >
          <FactIcon icon={fact.icon} />
          <div className="min-w-0">
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              {fact.label}
            </p>
            <p
              className={cn(
                "mt-0.5 text-sm font-semibold leading-snug",
                fact.icon === "price"
                  ? "text-[var(--sg-color-success)]"
                  : "text-[var(--sg-color-text)]",
              )}
            >
              {fact.value}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
