import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import type { CrmFinderLandingModel } from "@/services/crm-finder-landing/build-landing-model";

type Props = {
  model: CrmFinderLandingModel;
};

export function CrmFinderResearchSections({ model }: Props) {
  return (
    <>
      {model.products.length > 0 ? (
        <Section padding="md" background="surface" container="wide">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
                Recommend CRM software
              </h2>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                Explore CRM products from the SoftwareGlimpse catalogue.
              </p>
            </div>
            <Link
              href={model.categoryHref}
              className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Browse CRM category →
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {model.products.map((product) => (
              <li
                key={product.slug}
                className="flex flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center overflow-hidden rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-white text-xs font-bold text-[var(--sg-color-text-muted)]">
                    {product.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.logo.src}
                        alt=""
                        width={40}
                        height={40}
                        className="size-full object-contain p-1"
                      />
                    ) : (
                      product.name.slice(0, 2).toUpperCase()
                    )}
                  </span>
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    {product.name}
                  </h3>
                </div>
                {product.tagline ? (
                  <p className="mt-3 line-clamp-3 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                    {product.tagline}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}
                <Link
                  href={product.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]"
                >
                  Review
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {model.comparisons.length > 0 ? (
        <Section padding="md" background="muted" container="wide">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
            Compare CRM software
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {model.comparisons.map((c) => (
              <li
                key={c.slug}
                className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{c.leftName}</span>
                  <span className="text-xs font-bold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    vs
                  </span>
                  <span className="text-sm font-semibold">{c.rightName}</span>
                </div>
                <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                  {c.title}
                </p>
                <Link
                  href={c.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]"
                >
                  Compare
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section padding="md" background="surface" container="wide">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          Not ready to choose yet?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          Learn what CRM software does, what features matter and how to evaluate
          your options.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {model.guides.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="flex h-full items-center justify-between gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-4 text-sm font-semibold text-[var(--sg-color-text)] shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)]"
              >
                {g.title}
                <ArrowRight
                  className="size-4 shrink-0 text-[var(--sg-color-primary)]"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
