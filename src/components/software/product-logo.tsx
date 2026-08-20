import { cn } from "@/lib/cn";

type Props = {
  name: string;
  logo?: { src: string; alt: string } | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl sm:size-24 sm:text-2xl",
} as const;

const pxBySize = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 96,
} as const;

export function ProductLogo({ name, logo, size = "md", className }: Props) {
  const box = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]",
    sizes[size],
    className,
  );

  if (logo?.src) {
    const px = pxBySize[size];
    return (
      <span className={box}>
        {/* Vendor logos may be remote; keep lightweight until asset pipeline hosts them. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.src}
          alt={logo.alt || `${name} logo`}
          width={px}
          height={px}
          className="size-full object-contain p-0.5"
          loading="lazy"
          decoding="async"
        />
      </span>
    );
  }

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      className={cn(box, "font-semibold text-[var(--sg-color-primary)]")}
      aria-hidden
    >
      {initials || "SG"}
    </span>
  );
}
