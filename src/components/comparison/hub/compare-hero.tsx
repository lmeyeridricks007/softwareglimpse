import Link from "next/link";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { ProductLogo } from "@/components/software/product-logo";
import type { CompareHubModel } from "@/services/compare-hub";
import { cn } from "@/lib/cn";

const TRUST = [
  "Recommendation-backed",
  "Same criteria",
  "Affiliate-independent",
] as const;

type Props = {
  preview: CompareHubModel["heroPreview"];
  className?: string;
};

export function CompareHero({ preview, className }: Props) {
  return (
    <Section
      padding="md"
      background="surface"
      container="wide"
      className={cn("relative", className)}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgb(37_99_235/0.10),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgb(59_130_246/0.07),transparent_45%)]"
        aria-hidden
      />
      <div className="relative grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Software comparisons
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-display)] font-bold leading-[var(--sg-leading-tight)] tracking-tight text-[var(--sg-color-navy)]">
            Compare software side by side.
          </h1>
          <p className="mt-4 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Compare features, pricing, strengths and trade-offs across catalogue
            software products — then decide which option fits your business best.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="#comparison-builder" size="lg">
              Compare software →
            </ButtonLink>
            <ButtonLink
              href="#published-comparisons"
              variant="outline"
              size="lg"
            >
              Browse comparisons
            </ButtonLink>
          </div>

          <ul className="mt-6 space-y-2">
            {TRUST.map((label) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-[var(--sg-color-text)]"
              >
                <Check
                  className="size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {preview ? <HeroPreviewCard preview={preview} /> : null}
      </div>
    </Section>
  );
}

function HeroPreviewCard({
  preview,
}: {
  preview: NonNullable<CompareHubModel["heroPreview"]>;
}) {
  const body = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        {preview.example ? "Example comparison" : "Featured comparison"}
      </p>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <span className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold">
          <ProductLogo
            name={preview.productA.name}
            logo={preview.productA.logo}
            size="sm"
            className="!size-7"
          />
          <span className="truncate">{preview.productA.name}</span>
        </span>
        <span className="text-xs font-bold uppercase text-[var(--sg-color-text-muted)]">
          vs
        </span>
        <span className="inline-flex min-w-0 items-center justify-end gap-2 text-sm font-semibold">
          <ProductLogo
            name={preview.productB.name}
            logo={preview.productB.logo}
            size="sm"
            className="!size-7"
          />
          <span className="truncate">{preview.productB.name}</span>
        </span>
      </div>
      <table className="mt-5 w-full table-fixed text-left text-sm">
        <tbody>
          {preview.rows.map((row) => (
            <tr
              key={row.label}
              className="border-t border-[var(--sg-color-border)]"
            >
              <th className="w-[32%] py-3 pr-3 align-top text-xs font-medium text-[var(--sg-color-text-muted)] sm:text-sm">
                {row.label}
              </th>
              <td className="w-[34%] py-3 pr-3 align-top text-[var(--sg-color-text)]">
                <span className="line-clamp-2 break-words">{row.left}</span>
              </td>
              <td className="w-[34%] py-3 align-top text-[var(--sg-color-text)]">
                <span className="line-clamp-2 break-words">{row.right}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {preview.href ? (
        <p className="mt-5 text-sm font-semibold text-[var(--sg-color-primary)]">
          View comparison →
        </p>
      ) : (
        <p className="mt-5 text-xs leading-relaxed text-[var(--sg-color-text-muted)]">
          Illustrative preview — build a live comparison below.
        </p>
      )}
    </>
  );

  const cardClass =
    "block w-full min-w-0 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-md)] sm:p-6";

  if (preview.href) {
    return (
      <Link
        href={preview.href}
        className={cn(
          cardClass,
          "transition hover:border-[var(--sg-color-primary)]/40",
        )}
      >
        {body}
      </Link>
    );
  }

  return <div className={cardClass}>{body}</div>;
}
