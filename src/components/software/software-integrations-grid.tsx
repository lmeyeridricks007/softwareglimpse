import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";

export type IntegrationItem = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
};

type Props = {
  productName: string;
  integrations: IntegrationItem[];
  className?: string;
};

export function SoftwareIntegrationsGrid({
  productName,
  integrations,
  className,
}: Props) {
  if (integrations.length === 0) return null;

  return (
    <section
      aria-labelledby="integrations-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="integrations-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Integrations
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        Tools and platforms {productName} connects with, based on
        product data.
      </p>
      <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {integrations.map((item) => (
          <li
            key={item.slug}
            className="flex flex-col items-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-4 text-center shadow-[var(--sg-shadow-sm)]"
          >
            <ProductLogo name={item.name} logo={item.logo} size="sm" />
            <span className="line-clamp-2 text-xs font-medium text-[var(--sg-color-text)]">
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
