import { cn } from "@/lib/cn";

type Tone = "white" | "muted" | "soft-blue" | "navy" | "trust";

const TONE: Record<Tone, string> = {
  white: "bg-[var(--sg-color-surface)]",
  muted: "bg-[var(--sg-color-surface-muted)]",
  "soft-blue": "bg-[var(--sg-color-primary-soft)]/40",
  navy: "bg-[var(--sg-color-navy)] text-[var(--sg-color-text-inverse)]",
  trust: "bg-[var(--sg-color-surface-tint)]",
};

type Props = {
  id?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  as?: "section" | "div";
};

/** Visual rhythm wrapper for Best buying-guide sections. */
export function BestSoftwareSection({
  id,
  tone = "white",
  className,
  children,
  as: Tag = "section",
}: Props) {
  return (
    <Tag
      id={id}
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] px-4 py-8 sm:px-6 sm:py-10",
        TONE[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
