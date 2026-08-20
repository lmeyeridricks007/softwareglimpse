import { cn } from "@/lib/cn";

const sizeClass = {
  narrow: "max-w-[var(--sg-container-narrow)]",
  article: "max-w-[var(--sg-container-article)]",
  standard: "max-w-[var(--sg-container-standard)]",
  wide: "max-w-[var(--sg-container-wide)]",
  full: "max-w-none",
} as const;

type Props = {
  children: React.ReactNode;
  size?: keyof typeof sizeClass;
  className?: string;
  as?: "div" | "main" | "article" | "section";
};

export function PageContainer({
  children,
  size = "standard",
  className,
  as: Tag = "div",
}: Props) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        sizeClass[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
