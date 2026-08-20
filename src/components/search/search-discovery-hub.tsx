import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import type { DiscoveryHubModel } from "@/services/search/types";

type Props = {
  hub: DiscoveryHubModel;
};

export function SearchDiscoveryHub({ hub }: Props) {
  return (
    <div className="mt-8 space-y-10">
      <section>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          Discover SoftwareGlimpse
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Browse by content type when you are not searching for a specific term.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hub.browse.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 transition-shadow hover:border-[var(--sg-color-border-strong)] hover:shadow-[var(--sg-shadow-md)]"
            >
              <span className="font-semibold text-[var(--sg-color-text)]">
                {item.label}
              </span>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {hub.popularCategories.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Popular categories
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {hub.popularCategories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] px-3 py-1.5 text-sm hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {hub.popularTools.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Popular tools
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {hub.popularTools.map((tool) => (
              <Card key={tool.href} variant="interactive" className="p-4">
                <h3 className="font-semibold">{tool.name}</h3>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {tool.summary}
                </p>
                <ButtonLink href={tool.href} size="sm" className="mt-3">
                  Start tool →
                </ButtonLink>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {hub.featuredGuides.length > 0 ? (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Featured guides
            </h2>
            <ul className="mt-3 space-y-2">
              {hub.featuredGuides.map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href}
                    className="block rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2.5 hover:border-[var(--sg-color-primary)]"
                  >
                    <span className="font-medium">{g.title}</span>
                    {g.summary ? (
                      <p className="mt-0.5 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
                        {g.summary}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hub.featuredResources.length > 0 ? (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Featured resources
            </h2>
            <ul className="mt-3 space-y-2">
              {hub.featuredResources.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="block rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2.5 hover:border-[var(--sg-color-primary)]"
                  >
                    <span className="font-medium">{r.title}</span>
                    {r.summary ? (
                      <p className="mt-0.5 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
                        {r.summary}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <section className="border-t border-[var(--sg-color-border)] pt-8">
        <h2 className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Browse all
        </h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
          {[
            { href: "/software/", label: "Software" },
            { href: "/compare/", label: "Comparisons" },
            { href: "/guides/", label: "Guides" },
            { href: "/tools/", label: "Tools" },
            { href: "/resources/", label: "Resources" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1 text-[var(--sg-color-primary)]"
            >
              {item.label} <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
