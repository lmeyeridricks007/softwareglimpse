import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";

type Props = {
  href?: string;
  exampleProduct?: {
    name: string;
    logo?: { src: string; alt: string } | null;
    reasons: string[];
  } | null;
  className?: string;
};

export function FinderCtaSection({
  href = "/tools/crm-finder/",
  exampleProduct,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "grid items-center gap-8 lg:grid-cols-[1.2fr_0.9fr]",
        className,
      )}
    >
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-white">
          Not sure which CRM is right for you?
        </h2>
        <p className="mt-3 max-w-xl text-base text-white/80">
          Answer a few questions and get fit-based recommendations. Affiliate
          status never changes the order.
        </p>
        <ul className="mt-5 space-y-2.5">
          {[
            "Based on your requirements",
            "Affiliate status does not affect ranking",
            "Takes about 2 minutes",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-white/90">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <ButtonLink href={href} size="lg" variant="onDark" className="mt-7">
          Find My CRM →
        </ButtonLink>
      </div>

      <Card className="border-white/10 bg-white p-5 text-[var(--sg-color-text)] shadow-[0_20px_48px_rgb(0_0_0/0.25)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Example recommendation
        </p>
        {exampleProduct ? (
          <>
            <div className="mt-3 flex items-center gap-3">
              <ProductLogo
                name={exampleProduct.name}
                logo={exampleProduct.logo}
                size="lg"
              />
              <div>
                <p className="text-lg font-semibold">{exampleProduct.name}</p>
                <p className="text-sm text-[var(--sg-color-text-muted)]">
                  Sample CRM Finder result
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-[var(--sg-color-text)]">
              Best match for:
            </p>
            <ul className="mt-2 space-y-1.5">
              {exampleProduct.reasons.map((r) => (
                <li
                  key={r}
                  className="flex gap-2 text-sm text-[var(--sg-color-text-muted)]"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  {r}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
            Tell us your team size, goals, and must-have features — we shortlist
            CRM options that fit.
          </p>
        )}
        <ButtonLink href={href} variant="outline" className="mt-5 w-full">
          Try the CRM Finder
        </ButtonLink>
      </Card>
    </div>
  );
}
