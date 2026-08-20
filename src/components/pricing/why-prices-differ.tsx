import {
  Layers,
  Puzzle,
  UserRound,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/cn";

const CARDS = [
  {
    icon: UserRound,
    title: "Per-seat pricing",
    body: "Cost increases as your team grows when vendors charge per user.",
  },
  {
    icon: Wallet,
    title: "Base platform fees",
    body: "Some vendors charge a platform fee before seats are added.",
  },
  {
    icon: Layers,
    title: "Feature tiers",
    body: "Automation, reporting, and advanced capabilities often require higher plans.",
  },
  {
    icon: Puzzle,
    title: "Add-ons",
    body: "Calling, AI, storage, credits, and marketing functionality may cost extra when published as add-ons.",
  },
] as const;

type Props = {
  className?: string;
  productNoun?: string;
};

/**
 * Educational section — no vendor-specific claims.
 */
export function WhyPricesDiffer({
  className,
  productNoun = "CRM",
}: Props) {
  return (
    <section
      className={cn(
        "rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)]/70 px-5 py-8 sm:px-8",
        className,
      )}
      aria-labelledby="why-prices-heading"
    >
      <h2
        id="why-prices-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)] sm:text-2xl"
      >
        Why do {productNoun} prices vary so much?
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        List prices differ because {productNoun} vendors combine seats, platform
        fees, plan tiers, and add-ons differently. We only show verified public
        components — never invented fees.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
              <Icon className="size-5" aria-hidden />
            </span>
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-navy)]">
              {title}
            </p>
            <p className="mt-1.5 text-sm text-[var(--sg-color-text-muted)]">
              {body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
