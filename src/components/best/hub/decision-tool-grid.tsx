import Link from "next/link";
import {
  Calculator,
  GitCompareArrows,
  Search,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/stack";
import { SectionHeader } from "@/components/home/section-header";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import type { BestHubTool } from "@/services/best-hub";
import { cn } from "@/lib/cn";

const TOOL_ICONS: Record<string, LucideIcon> = {
  "crm-finder": Search,
  "crm-cost": Calculator,
  compare: GitCompareArrows,
};

const TOOL_TONES: Record<string, string> = {
  "crm-finder": GUIDE_ICON_TONE_CLASSES.emerald,
  "crm-cost": GUIDE_ICON_TONE_CLASSES.amber,
  compare: GUIDE_ICON_TONE_CLASSES.violet,
};

type Props = {
  tools: BestHubTool[];
  className?: string;
};

export function DecisionToolGrid({ tools, className }: Props) {
  if (tools.length === 0) return null;

  return (
    <Section padding="md" background="surface" container="wide" className={className}>
      <SectionHeader
        title="Tools to help you choose"
        description="Interactive tools share the same research model as our Best Software guides."
        action={
          <Link
            href="/tools/"
            className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            All tools
          </Link>
        }
      />
      <Grid cols={3} gap={4}>
        {tools.map((tool) => {
          const Icon = TOOL_ICONS[tool.id] ?? Search;
          const tone = TOOL_TONES[tool.id] ?? "bg-slate-50 text-slate-600";
          return (
            <Link key={tool.id} href={tool.href} className="group block h-full">
              <Card variant="interactive" className="flex h-full flex-col p-5">
                <span
                  className={cn(
                    "inline-flex size-12 items-center justify-center rounded-[var(--sg-radius-md)] border",
                    tone,
                  )}
                >
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                  {tool.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {tool.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-[var(--sg-color-primary)]">
                  Open tool →
                </p>
              </Card>
            </Link>
          );
        })}
      </Grid>
    </Section>
  );
}
