import Link from "next/link";
import {
  BookOpenCheck,
  MessageSquareWarning,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

const ICONS = [BookOpenCheck, Scale, ShieldCheck, MessageSquareWarning];

type Props = {
  trust: BestPageModel["trust"];
  className?: string;
  /** When true, render the dark navy mockup panel. */
  dark?: boolean;
};

export function BestSoftwareTrust({ trust, className, dark = false }: Props) {
  if (dark) {
    return (
      <div
        className={cn(
          "rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-navy)] px-5 py-7 text-white sm:px-7 sm:py-8",
          className,
        )}
      >
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold sm:text-2xl">
          {trust.heading}
        </h2>
        <ul className="mt-6 space-y-5">
          {trust.principles.map((p, i) => {
            const Icon = ICONS[i % ICONS.length]!;
            return (
              <li key={p.href}>
                <Link href={p.href} className="group flex items-start gap-3">
                  <Icon
                    className="mt-0.5 size-5 shrink-0 text-white/80"
                    aria-hidden
                  />
                  <span>
                    <span className="block font-semibold group-hover:underline">
                      {p.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-white/70">
                      {p.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {trust.heading}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trust.principles.map((p, i) => {
          const Icon = ICONS[i % ICONS.length]!;
          return (
            <li key={p.href}>
              <Link href={p.href} className="group block">
                <Icon
                  className="size-6 text-[var(--sg-color-primary)]"
                  aria-hidden
                />
                <p className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                  {p.title}
                </p>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {p.description}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
