"use client";

import Link from "next/link";
import { trackSearchEvent } from "@/services/search/analytics";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  query: string;
  resultType: string;
  position: number;
  className?: string;
  children: React.ReactNode;
};

export function SearchResultClick({
  href,
  query,
  resultType,
  position,
  className,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className={cn("hover:text-[var(--sg-color-primary)]", className)}
      onClick={() =>
        trackSearchEvent("search_result_clicked", {
          query,
          result_type: resultType,
          position,
          target: href,
        })
      }
    >
      {children}
    </Link>
  );
}
