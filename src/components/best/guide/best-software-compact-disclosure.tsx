import Link from "next/link";
import { LEGAL_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  className?: string;
};

/** Single compact affiliate disclosure near first commercial CTA. */
export function BestSoftwareCompactDisclosure({ text, className }: Props) {
  return (
    <p className={cn("text-xs text-[var(--sg-color-text-muted)]", className)}>
      {text}{" "}
      <Link
        href={LEGAL_ROUTES.affiliateDisclosure}
        className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        How we make money
      </Link>
    </p>
  );
}
