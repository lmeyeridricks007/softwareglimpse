import { cn } from "@/lib/cn";

type StackProps = {
  children: React.ReactNode;
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  className?: string;
};

const gapMap = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-6",
  6: "gap-8",
  7: "gap-12",
  8: "gap-16",
} as const;

export function Stack({ children, gap = 4, className }: StackProps) {
  return (
    <div className={cn("flex flex-col", gapMap[gap], className)}>{children}</div>
  );
}

export function Inline({ children, gap = 2, className }: StackProps) {
  return (
    <div className={cn("flex flex-wrap items-center", gapMap[gap], className)}>
      {children}
    </div>
  );
}

type GridProps = {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};

const colsMap = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function Grid({ children, cols = 3, gap = 4, className }: GridProps) {
  return (
    <div
      className={cn("grid grid-cols-1", colsMap[cols], gapMap[gap], className)}
    >
      {children}
    </div>
  );
}
