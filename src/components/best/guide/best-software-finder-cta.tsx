import { Check } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import type { BestPageModel, BestPageProductRef } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  cta: NonNullable<BestPageModel["finderCta"]>;
  /** Catalogue products for visual preview only — never fake scores. */
  previewProducts?: BestPageProductRef[];
  className?: string;
};

export function BestSoftwareFinderCta({
  cta,
  previewProducts = [],
  className,
}: Props) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-navy)] px-5 py-9 text-white sm:px-8 sm:py-11",
        className,
      )}
    >
      <div className="grid items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col justify-center">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold leading-tight">
            {cta.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            {cta.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={cta.href} size="lg" variant="onDark">
              {cta.ctaLabel} →
            </ButtonLink>
            {cta.secondaryHref && cta.secondaryLabel ? (
              <ButtonLink
                href={cta.secondaryHref}
                size="lg"
                variant="outline"
                className="border-white/35 bg-transparent text-white hover:bg-white/10"
              >
                {cta.secondaryLabel}
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <div className="rounded-[var(--sg-radius-lg)] border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
            Your requirements
          </p>
          <ul className="mt-4 space-y-3">
            {cta.requirements.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/90">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[var(--sg-radius-lg)] bg-white p-5 text-[var(--sg-color-text)] shadow-[0_20px_48px_rgb(0_0_0/0.25)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--sg-color-primary)]">
            Shortlist in the Finder
          </p>
          {previewProducts.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {previewProducts.slice(0, 3).map((p) => (
                <li
                  key={p.slug}
                  className="flex items-center gap-3 border-b border-[var(--sg-color-border)] pb-3 last:border-0 last:pb-0"
                >
                  <ProductLogo name={p.name} logo={p.logo} size="sm" />
                  <span className="text-sm font-semibold">{p.name}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-4 text-xs leading-relaxed text-[var(--sg-color-text-muted)]">
            {cta.previewNote ??
              "Answer live questions in the Finder — we do not invent match scores here."}
          </p>
        </div>
      </div>
    </section>
  );
}
