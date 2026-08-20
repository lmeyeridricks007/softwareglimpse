import { cn } from "@/lib/cn";

type Props = {
  children?: React.ReactNode;
  className?: string;
  label?: string;
};

export function EmptyState({
  children,
  className,
  label = "Nothing here yet",
}: Props) {
  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-lg)] border border-dashed border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-6 py-10 text-center",
        className,
      )}
    >
      <p className="font-medium text-[var(--sg-color-text)]">{label}</p>
      {children ? (
        <div className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <hr
      className={cn("border-0 border-t border-[var(--sg-color-border)]", className)}
    />
  );
}
