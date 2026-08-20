import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-[var(--sg-color-primary)] text-white hover:bg-[var(--sg-color-primary-hover)] shadow-[var(--sg-shadow-sm)]",
  secondary:
    "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text)] hover:bg-[var(--sg-color-border)]",
  outline:
    "border border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]",
  ghost:
    "text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)] hover:text-[var(--sg-color-text)]",
  danger:
    "bg-[var(--sg-color-danger)] text-white hover:opacity-90",
  /** White CTA on navy/dark surfaces — do not layer text-white overrides via className. */
  onDark:
    "bg-white text-[var(--sg-color-navy)] hover:bg-[var(--sg-color-primary-soft)] shadow-[var(--sg-shadow-sm)]",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--sg-radius-md)] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="sr-only">Loading</span> : null}
      {children}
    </button>
  );
}

type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  href: string;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--sg-radius-md)] font-medium transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
