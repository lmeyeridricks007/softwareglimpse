import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";

type LogoItem = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
};

type Props = {
  title: string;
  items: LogoItem[];
  className?: string;
};

/** Non-ranked visual identity strip of category products. */
export function CategoryLogoStrip({ title, items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="logo-strip-heading"
      className={cn(className)}
    >
      <h2
        id="logo-strip-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h3)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/software/${item.slug}/`}
              className="inline-flex items-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
            >
              <ProductLogo name={item.name} logo={item.logo} size="sm" />
              <span className="hidden sm:inline">{item.name}</span>
              <span className="sr-only sm:hidden">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { CategoryLogoStrip as ProductLogoStrip };
