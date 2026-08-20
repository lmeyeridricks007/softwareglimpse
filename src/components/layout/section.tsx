import { cn } from "@/lib/cn";
import { PageContainer } from "@/components/layout/page-container";

const padY = {
  none: "",
  sm: "py-8",
  md: "py-12 md:py-14",
  lg: "py-14 md:py-20",
} as const;

const tone = {
  default: "",
  muted: "bg-[var(--sg-color-surface-muted)]",
  surface: "bg-[var(--sg-color-surface)]",
  tint: "bg-[var(--sg-color-surface-tint)]",
  primary: "bg-[var(--sg-color-primary)] text-[var(--sg-color-primary-fg)]",
  navy: "bg-[var(--sg-color-navy)] text-[var(--sg-color-text-inverse)]",
} as const;

type Props = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  padding?: keyof typeof padY;
  background?: keyof typeof tone;
  container?: "narrow" | "article" | "standard" | "wide" | "full" | false;
  bordered?: boolean;
};

export function Section({
  children,
  id,
  className,
  padding = "md",
  background = "default",
  container = "standard",
  bordered = false,
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        padY[padding],
        tone[background],
        bordered && "border-y border-[var(--sg-color-border)]",
        className,
      )}
    >
      {container === false ? (
        children
      ) : (
        <PageContainer size={container}>{children}</PageContainer>
      )}
    </section>
  );
}
