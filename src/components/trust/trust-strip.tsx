import Link from "next/link";
import {
  BookOpenCheck,
  Scale,
  ShieldCheck,
  MessageSquareWarning,
} from "lucide-react";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

const items = [
  {
    title: "How we review",
    description: "Evaluation, verification, and refresh — no fake testing claims.",
    href: COMPANY_ROUTES.howWeReview,
    Icon: BookOpenCheck,
  },
  {
    title: "Editorial methodology",
    description: "Category criteria and scores grounded in evidence.",
    href: COMPANY_ROUTES.methodology,
    Icon: Scale,
  },
  {
    title: "Editorial independence",
    description: "Affiliate status does not set rankings or Finder order.",
    href: LEGAL_ROUTES.editorialIndependence,
    Icon: ShieldCheck,
  },
  {
    title: "Corrections",
    description: "Spot something outdated? Tell us.",
    href: `${COMPANY_ROUTES.contact}?reason=correction`,
    Icon: MessageSquareWarning,
  },
] as const;

export function TrustStrip({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map(({ title, description, href, Icon }) => (
        <li key={href}>
          <Link href={href} className="group block">
            <Icon
              className="size-6 text-[var(--sg-color-primary)]"
              aria-hidden
            />
            <p className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
              {title}
            </p>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function TrustIndicators({ className }: { className?: string }) {
  const chips = [
    { label: "Affiliate-independent rankings", href: LEGAL_ROUTES.editorialIndependence },
    { label: "Evidence-backed methodology", href: COMPANY_ROUTES.methodology },
    { label: "Regularly updated research", href: COMPANY_ROUTES.howWeReview },
    { label: "Corrections welcome", href: `${COMPANY_ROUTES.contact}?reason=correction` },
  ];
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
      {chips.map((c) => (
        <li key={c.href + c.label}>
          <Link
            href={c.href}
            className="inline-flex items-center gap-2 text-sm text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]"
          >
            <ShieldCheck className="size-4 text-[var(--sg-color-primary)]" aria-hidden />
            {c.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
