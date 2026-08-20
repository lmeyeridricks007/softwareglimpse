import Image from "next/image";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { SoftwareCta } from "@/components/affiliate/software-cta";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import type { BestPageRecommendationModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  item: BestPageRecommendationModel;
  className?: string;
};

export function BestSoftwareProductSection({
  item,
  className,
}: Props) {
  const heading =
    item.rank != null
      ? `#${item.rank} ${item.product.name}`
      : item.product.name;

  const fitLabel = item.badge ?? item.positioningLabel ?? item.bestFor;

  return (
    <article
      id={`product-${item.product.slug}`}
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-7",
        className,
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        {item.rank != null ? (
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-navy)] text-sm font-semibold text-white">
            #{item.rank}
          </span>
        ) : null}
        <ProductLogo
          name={item.product.name}
          logo={item.product.logo}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
            {heading}
          </h3>
          {fitLabel ? (
            <p className="mt-1 text-sm font-medium text-[var(--sg-color-primary)]">
              {fitLabel}
            </p>
          ) : null}
          {item.scoreApproved && item.score != null ? (
            <div className="mt-2">
              <Rating score={item.score} showNumeric />
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "mt-6 grid gap-8",
          item.screenshot ? "lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]" : "",
        )}
      >
        <div>
          {(item.editorialSummary || item.summary) && (
            <div className="max-w-prose space-y-3 text-[length:var(--sg-text-body)] text-[var(--sg-color-text-muted)]">
              {(item.editorialSummary ?? item.summary)
                .split(/\n\n+/)
                .map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
            </div>
          )}

          {item.criterionScores.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[var(--sg-color-text)]">
                Why {item.product.name} scored highly
              </h4>
              <ul className="mt-3 space-y-2.5">
                {item.criterionScores.slice(0, 8).map((c) => (
                  <li key={c.slug}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-[var(--sg-color-text)]">{c.name}</span>
                      <span className="tabular-nums text-[var(--sg-color-text-muted)]">
                        {c.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--sg-color-primary)]"
                        style={{ width: `${Math.min(100, (c.score / 10) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : item.featureSnapshot.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[var(--sg-color-text)]">
                Capability snapshot
              </h4>
              <ul className="mt-3 space-y-2">
                {item.featureSnapshot.map((f) => (
                  <li
                    key={f.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span>{f.label}</span>
                    <span className="capitalize text-[var(--sg-color-text-muted)]">
                      {typeof f.score === "number"
                        ? `${f.score}/10`
                        : (f.level ?? "—")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {item.screenshot ? (
          <figure className="min-w-0">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]">
              <Image
                src={item.screenshot.src}
                alt={item.screenshot.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 22rem"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-2 text-xs leading-snug text-[var(--sg-color-text-muted)]">
              {item.screenshot.caption}
              {item.screenshot.source ? (
                <>
                  {" "}
                  <a
                    href={item.screenshot.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    Source
                  </a>
                </>
              ) : null}
            </figcaption>
          </figure>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {item.idealFor.length > 0 || item.strengths.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Best for
            </h4>
            <ul className="mt-2 space-y-1.5">
              {(item.idealFor.length > 0 ? item.idealFor : item.strengths)
                .slice(0, 4)
                .map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
                  >
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-[var(--sg-color-success)]"
                      aria-hidden
                    />
                    {s}
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
        {item.avoidIf.length > 0 || item.tradeOffs.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Not ideal for
            </h4>
            <ul className="mt-2 space-y-1.5">
              {(item.avoidIf.length > 0 ? item.avoidIf : item.tradeOffs)
                .slice(0, 4)
                .map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
                  >
                    <X
                      className="mt-0.5 size-3.5 shrink-0 text-[var(--sg-color-danger)]"
                      aria-hidden
                    />
                    {s}
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
      </div>

      {(item.pricingTeaser || item.keyDetails.length > 0) && (
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {item.pricingTeaser ? (
            <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-3 py-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Starting price
              </dt>
              <dd className="mt-0.5 text-sm font-medium">{item.pricingTeaser}</dd>
            </div>
          ) : null}
          {item.keyDetails.slice(0, 2).map((d) => (
            <div
              key={d.label}
              className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-3 py-2"
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                {d.label}
              </dt>
              <dd className="mt-0.5 text-sm font-medium">{d.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href={item.product.href}>
          View full {item.product.name} review
        </ButtonLink>
        {item.pricingHref ? (
          <ButtonLink href={item.pricingHref} variant="outline">
            See pricing
          </ButtonLink>
        ) : null}
        <ButtonLink
          href={`/compare/?products=${item.product.slug}`}
          variant="outline"
        >
          Compare {item.product.name}
        </ButtonLink>
        <SoftwareCta
          productId={item.product.slug}
          context="best-page"
          intent="VISIT"
          variant="button"
          label={`Visit ${item.product.name}`}
          showDisclosure={false}
        />
      </div>
    </article>
  );
}
