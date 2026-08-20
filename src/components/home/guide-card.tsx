import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  Compass,
  Layers,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const TOPIC_ICONS: Record<string, LucideIcon> = {
  selection: Compass,
  "buying-guide": ClipboardList,
  pricing: Scale,
  implementation: Layers,
  fundamental: BookOpen,
  comparison: Scale,
};

const TOPIC_TONES: Record<string, string> = {
  selection: "bg-blue-50 text-blue-600",
  "buying-guide": "bg-violet-50 text-violet-600",
  pricing: "bg-amber-50 text-amber-700",
  implementation: "bg-teal-50 text-teal-600",
  fundamental: "bg-emerald-50 text-emerald-600",
  comparison: "bg-sky-50 text-sky-600",
};

export type GuideCardProps = {
  href: string;
  title: string;
  summary?: string;
  categoryLabel?: string;
  topicType?: string;
  readingMinutes?: number;
  updatedLabel?: string;
  className?: string;
};

export function GuideCard({
  href,
  title,
  summary,
  categoryLabel,
  topicType = "fundamental",
  readingMinutes,
  updatedLabel,
  className,
}: GuideCardProps) {
  const Icon = TOPIC_ICONS[topicType] ?? BookOpen;
  const tone = TOPIC_TONES[topicType] ?? TOPIC_TONES.fundamental!;

  return (
    <Link href={href} className={cn("group block h-full", className)}>
      <Card variant="interactive" className="flex h-full flex-col p-5">
        <span
          className={cn(
            "inline-flex size-12 items-center justify-center rounded-[var(--sg-radius-md)]",
            tone,
          )}
        >
          <Icon className="size-6" aria-hidden />
        </span>
        {categoryLabel ? (
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            {categoryLabel}
          </p>
        ) : null}
        <h3 className="mt-1 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
          {title}
        </h3>
        {summary ? (
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
            {summary}
          </p>
        ) : null}
        <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
          {[
            readingMinutes != null ? `${readingMinutes} min read` : null,
            updatedLabel ? `Updated ${updatedLabel}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </Card>
    </Link>
  );
}
