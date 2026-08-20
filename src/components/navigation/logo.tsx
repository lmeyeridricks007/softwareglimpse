import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  variant?: "default" | "compact" | "footer";
  className?: string;
  href?: string;
};

export function Logo({
  variant = "default",
  className,
  href = "/",
}: Props) {
  const mark = (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] text-white",
          variant === "compact" ? "size-7" : "size-8",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none">
          <path
            d="M4 12h6l2-6 2 12 2-6h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          "font-semibold tracking-tight text-[var(--sg-color-navy)]",
          variant === "footer" ? "text-base" : "text-lg",
          variant === "compact" && "text-base",
        )}
      >
        SoftwareGlimpse
      </span>
    </span>
  );

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center", className)}
      aria-label="SoftwareGlimpse home"
    >
      {mark}
    </Link>
  );
}
