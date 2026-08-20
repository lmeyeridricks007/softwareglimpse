import { Check } from "lucide-react";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Match = {
  name: string;
  logo?: { src: string; alt: string } | null;
  label?: string;
};

type Props = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  requirements?: string[];
  matches?: Match[];
  disclaimer?: string;
  className?: string;
};

export function CategoryFinderCTA({
  title,
  description,
  href,
  ctaLabel,
  requirements = [],
  matches = [],
  disclaimer,
  className,
}: Props) {
  return (
    <section
      id="tools"
      aria-labelledby="finder-cta-heading"
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-navy)] px-5 py-8 text-[var(--sg-color-text-inverse)] sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2
            id="finder-cta-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-white"
          >
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-base text-white/80">{description}</p>
          {requirements.length > 0 ? (
            <ul className="mt-5 space-y-2">
              {requirements.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-white/90"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-emerald-300"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <ButtonLink href={href} size="lg" variant="onDark" className="mt-7">
            {withSingleArrow(ctaLabel)}
          </ButtonLink>
        </div>

        <Card className="border-white/10 bg-white p-5 text-[var(--sg-color-text)] shadow-[0_20px_48px_rgb(0_0_0/0.25)]">
          {requirements.length > 0 ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                Your requirements
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {requirements.map((r) => (
                  <li
                    key={r}
                    className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-2.5 py-1 text-xs font-medium"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {matches.length > 0 ? (
            <div className={requirements.length ? "mt-5" : undefined}>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Example matches
              </p>
              <ul className="mt-3 space-y-3">
                {matches.map((m, i) => (
                  <li key={m.name} className="flex items-center gap-3">
                    <ProductLogo name={m.name} logo={m.logo} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{m.name}</p>
                      {m.label || i === 0 ? (
                        <p className="text-xs text-[var(--sg-color-text-muted)]">
                          {m.label ?? (i === 0 ? "Best match (example)" : "Also fits")}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {disclaimer ? (
            <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
              {disclaimer}
            </p>
          ) : null}

          <ButtonLink href={href} variant="outline" className="mt-5 w-full">
            {withSingleArrow(ctaLabel)}
          </ButtonLink>
        </Card>
      </div>
    </section>
  );
}
