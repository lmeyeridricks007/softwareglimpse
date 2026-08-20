import Link from "next/link";
import { getTopLevelCategories } from "@/data/repositories/categories";
import { Input } from "@/components/ui/forms";
import { PageContainer } from "@/components/layout/page-container";

export default function NotFound() {
  const categories = getTopLevelCategories().slice(0, 6);

  return (
    <PageContainer size="article" className="py-16 text-center">
      <h1 className="text-[length:var(--sg-text-h1)] font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-3 text-[var(--sg-color-text-muted)]">
        That URL does not match a published SoftwareGlimpse page.
      </p>
      <form
        action="/search/"
        method="get"
        className="mx-auto mt-8 flex max-w-md gap-2"
      >
        <Input name="q" type="search" placeholder="Search software and guides" />
        <button
          type="submit"
          className="inline-flex h-10 items-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-4 text-sm font-medium text-white"
        >
          Search
        </button>
      </form>
      <div className="mt-10 text-left">
        <h2 className="text-sm font-semibold">Browse categories</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/categories/${c.path.join("/")}/`}
                className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-1.5 text-sm"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-8 space-y-2 text-sm">
          <li>
            <Link href="/tools/crm-finder/">CRM Finder</Link>
          </li>
          <li>
            <Link href="/">Home</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
