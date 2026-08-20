import { cn } from "@/lib/cn";

const variants = {
  default:
    "border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]",
  interactive:
    "border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)] transition-shadow hover:shadow-[var(--sg-shadow-md)] hover:border-[var(--sg-color-border-strong)]",
  highlighted:
    "border border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-md)] ring-1 ring-[var(--sg-color-primary-soft)]",
  soft: "border border-transparent bg-[var(--sg-color-surface-muted)]",
} as const;

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  as?: "div" | "article" | "section" | "li";
};

export function Card({
  children,
  className,
  variant = "default",
  as: Tag = "div",
}: Props) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--sg-radius-lg)] p-5",
        variants[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
