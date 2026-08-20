import {
  Goal,
  Link2,
  Puzzle,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/home/section-header";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import type { BestHubApprovedBestFor } from "@/services/best-hub";
import { cn } from "@/lib/cn";

const FACTORS: Array<{ label: string; Icon: LucideIcon; tone: string }> = [
  { label: "Team size", Icon: Users, tone: GUIDE_ICON_TONE_CLASSES.blue },
  { label: "Budget", Icon: Wallet, tone: GUIDE_ICON_TONE_CLASSES.emerald },
  { label: "Features", Icon: Puzzle, tone: GUIDE_ICON_TONE_CLASSES.violet },
  { label: "Integrations", Icon: Link2, tone: GUIDE_ICON_TONE_CLASSES.orange },
  { label: "Goals", Icon: Goal, tone: GUIDE_ICON_TONE_CLASSES.fuchsia },
];

type Props = {
  approvedBestFor?: BestHubApprovedBestFor[];
  className?: string;
};

export function BestMeaningExplainer({
  approvedBestFor = [],
  className,
}: Props) {
  return (
    <Section padding="md" background="tint" container="wide" className={className}>
      <SectionHeader
        title="What “best” means"
        description="There isn’t one best tool for everyone — the right software depends on your constraints."
      />
      <Card className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          The best software depends on
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {FACTORS.map(({ label, Icon, tone }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] py-1.5 pl-1.5 pr-3.5 text-sm font-medium text-[var(--sg-color-text)]"
            >
              <span
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-full border",
                  tone,
                )}
              >
                <Icon className="size-3.5" aria-hidden />
              </span>
              {label}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-[var(--sg-color-text-muted)]">
          That&apos;s why our recommendations include &quot;Best for&quot;
          scenarios rather than simply declaring one universal winner.
        </p>
      </Card>

      {approvedBestFor.length > 0 ? (
        <div className="mt-8">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
            Example fit scenarios
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {approvedBestFor.map((item) => (
              <li key={item.product.slug}>
                <Card className={cn("flex h-full flex-col p-4")}>
                  <div className="flex items-center gap-3">
                    <ProductLogo
                      name={item.product.name}
                      logo={item.product.logo}
                      size="sm"
                    />
                    <p className="font-semibold text-[var(--sg-color-text)]">
                      {item.product.name}
                    </p>
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Best for
                  </p>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {item.bestFor}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
