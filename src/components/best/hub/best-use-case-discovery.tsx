import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/stack";
import { SectionHeader } from "@/components/home/section-header";
import { Card } from "@/components/ui/card";
import type { BestHubModel } from "@/services/best-hub";

type Props = {
  useCases: BestHubModel["useCases"];
  className?: string;
};

/** Links to published use-case pages — not invented “Best for X” URLs. */
export function BestUseCaseDiscovery({ useCases, className }: Props) {
  if (useCases.length === 0) return null;

  return (
    <Section padding="md" background="default" container="wide" className={className}>
      <SectionHeader
        title="Best software for specific needs"
        description="Explore use cases — match software to the workflow you need to run."
        action={
          <Link
            href="/use-cases/"
            className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            All use cases
          </Link>
        }
      />
      <Grid cols={3} gap={3}>
        {useCases.map((uc) => (
          <Link key={uc.slug} href={uc.href} className="group block h-full">
            <Card variant="interactive" className="flex h-full flex-col p-4">
              <div className="flex items-start gap-3">
                <CategoryIcon categoryId={uc.categorySlug} size="sm" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                    {uc.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
                    {uc.description}
                  </p>
                  {uc.categoryNames.length > 0 ? (
                    <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
                      {uc.categoryNames.join(" · ")}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                Explore
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </p>
            </Card>
          </Link>
        ))}
      </Grid>
    </Section>
  );
}
