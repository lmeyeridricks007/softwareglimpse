import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type FeatureGridItem = {
  slug: string;
  name: string;
  description?: string | null;
  availabilityLabel?: string;
  planLabel?: string | null;
  availability?: string;
};

type Props = {
  features: FeatureGridItem[];
  className?: string;
  limit?: number;
  viewAllHref?: string;
};

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SoftwareFeaturesGrid({
  features,
  className,
  limit = 6,
  viewAllHref,
}: Props) {
  if (features.length === 0) return null;

  const shown = features.slice(0, limit);

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="features-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          Key features
        </h2>
        {viewAllHref && features.length > limit ? (
          <a
            href={viewAllHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all features
          </a>
        ) : null}
      </div>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((feature) => {
          const meta = [
            feature.availabilityLabel ??
              (feature.availability
                ? feature.availability.replace(/-/g, " ")
                : null),
            feature.planLabel,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <li key={feature.slug}>
              <Card className="flex h-full flex-col">
                <span className="inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
                  <Sparkles className="size-5" aria-hidden />
                </span>
                <h3 className="mt-3 font-semibold text-[var(--sg-color-text)]">
                  {feature.name || humanizeSlug(feature.slug)}
                </h3>
                {feature.description ? (
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                    {feature.description}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}
                {meta ? (
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    {meta}
                  </p>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
