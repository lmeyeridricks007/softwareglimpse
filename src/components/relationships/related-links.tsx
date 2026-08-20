import Link from "next/link";
import type { RelatedLink } from "@/services/relationships/software-links";

type Props = {
  title: string;
  links: RelatedLink[];
  emptyMessage?: string;
};

export function RelatedLinks({ title, links, emptyMessage }: Props) {
  if (links.length === 0) {
    return emptyMessage ? (
      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-[var(--color-fg-muted)]">{emptyMessage}</p>
      </section>
    ) : null;
  }

  return (
    <section className="mt-10">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
        {title}
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((item) => (
          <li key={`${item.relationship}-${item.href}`}>
            <Link
              href={item.href}
              className="block rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm underline-offset-2 hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
