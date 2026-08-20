import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  LayoutGrid,
  Megaphone,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/stack";
import { SectionHeader } from "@/components/home/section-header";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import type { BestHubNeedCard } from "@/services/best-hub";
import { cn } from "@/lib/cn";

const NEED_ICONS: Record<string, LucideIcon> = {
  "grow-sales": TrendingUp,
  "manage-leads": UsersRound,
  "manage-projects": LayoutGrid,
  "support-customers": Headphones,
  "automate-marketing": Megaphone,
  "manage-employees": Users,
  communicate: MessageSquare,
  "improve-productivity": Target,
};

const NEED_TONES: Record<string, string> = {
  "grow-sales": GUIDE_ICON_TONE_CLASSES.emerald,
  "manage-leads": GUIDE_ICON_TONE_CLASSES.sky,
  "manage-projects": GUIDE_ICON_TONE_CLASSES.violet,
  "support-customers": GUIDE_ICON_TONE_CLASSES.blue,
  "automate-marketing": GUIDE_ICON_TONE_CLASSES.fuchsia,
  "manage-employees": GUIDE_ICON_TONE_CLASSES.amber,
  communicate: GUIDE_ICON_TONE_CLASSES.orange,
  "improve-productivity": GUIDE_ICON_TONE_CLASSES.teal,
};

type Props = {
  needs: BestHubNeedCard[];
  className?: string;
};

export function BestByNeed({ needs, className }: Props) {
  if (needs.length === 0) return null;

  return (
    <Section padding="md" background="surface" container="wide" className={className}>
      <SectionHeader
        title="Find software by what you need to do"
        description="Not sure which category fits? Start from the job you need software to do."
        action={
          <Link
            href="/use-cases/"
            className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            All use cases
          </Link>
        }
      />
      <Grid cols={4} gap={4}>
        {needs.map((need) => {
          const Icon = NEED_ICONS[need.id] ?? Target;
          const tone =
            NEED_TONES[need.id] ?? GUIDE_ICON_TONE_CLASSES.blue;
          return (
            <Link key={need.id} href={need.href} className="group block h-full">
              <Card variant="interactive" className="flex h-full flex-col p-5">
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-[var(--sg-radius-md)] border",
                    tone,
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                  {need.title}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {need.description}
                </p>
                {need.categoryNames.length > 0 ? (
                  <p className="mt-3 text-xs font-medium text-[var(--sg-color-text-muted)]">
                    {need.categoryNames.join(" · ")}
                  </p>
                ) : null}
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                  {need.cta.replace(/→\s*$/, "").trim()}
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </p>
              </Card>
            </Link>
          );
        })}
      </Grid>
    </Section>
  );
}
