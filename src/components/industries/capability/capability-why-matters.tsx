import { AlertTriangle, Building2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  paragraphs: string[];
  risks?: string[];
  className?: string;
};

export function CapabilityWhyMatters({
  title,
  paragraphs,
  risks = [],
  className,
}: Props) {
  if (paragraphs.length === 0) return null;

  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
          <Building2 className="size-5" aria-hidden />
        </span>
        <h2
          id="why-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {title}
        </h2>
      </div>
      <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-[var(--sg-color-text-muted)] sm:text-base">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
      </div>
      {risks.length > 0 ? (
        <aside
          role="note"
          className="mt-6 flex gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/50 px-4 py-4"
        >
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-primary)]"
            aria-hidden
          />
          <div>
            <p className="text-sm font-semibold text-[var(--sg-color-text)]">
              A weak process can create:
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {risks.map((risk) => (
                <li
                  key={risk}
                  className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-surface)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-text-muted)]"
                >
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}
    </section>
  );
}
