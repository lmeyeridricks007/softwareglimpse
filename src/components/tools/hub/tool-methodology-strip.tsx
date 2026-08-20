import {
  BookOpen,
  RefreshCw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";
import type { ToolsHubModel } from "@/services/tools-hub";
import { cn } from "@/lib/cn";

const PILLARS = [
  {
    title: "Evidence",
    body: "Structured software recommendations",
    Icon: BookOpen,
    tone: GUIDE_ICON_TONE_CLASSES.blue,
  },
  {
    title: "Methodology",
    body: "Consistent evaluation criteria",
    Icon: Scale,
    tone: GUIDE_ICON_TONE_CLASSES.violet,
  },
  {
    title: "Independence",
    body: "Affiliate status doesn't determine recommendations",
    Icon: ShieldCheck,
    tone: GUIDE_ICON_TONE_CLASSES.emerald,
  },
  {
    title: "Freshness",
    body: "Product information reviewed and refreshed",
    Icon: RefreshCw,
    tone: GUIDE_ICON_TONE_CLASSES.sky,
  },
] as const;

type Props = {
  links: ToolsHubModel["trustLinks"];
};

export function ToolMethodologyStrip({ links }: Props) {
  return (
    <Section padding="md" background="surface" container="wide">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
        Built on SoftwareGlimpse recommendations
      </h2>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((pillar) => (
          <li
            key={pillar.title}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]"
          >
            <span
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] border",
                pillar.tone,
              )}
            >
              <pillar.Icon className="size-4" aria-hidden />
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-text-muted)]">
              {pillar.title}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--sg-color-text)]">
              {pillar.body}
            </p>
          </li>
        ))}
      </ul>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
