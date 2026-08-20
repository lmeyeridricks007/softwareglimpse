import type { Software } from "@/domain";
import {
  descriptiveSourceAnchor,
  resolveProductOfficialLinks,
} from "@/services/outbound/resolve-product-links";
import { ExternalLink } from "./external-link";

type Props = {
  software: Software;
  className?: string;
};

const ENTRIES: {
  key: keyof ReturnType<typeof resolveProductOfficialLinks>;
  type:
    | "vendor-official"
    | "pricing-source"
    | "documentation"
    | "security-source";
  label: (name: string) => string;
}[] = [
  {
    key: "officialWebsite",
    type: "vendor-official",
    label: (name) => `Official ${name} website`,
  },
  {
    key: "pricing",
    type: "pricing-source",
    label: (name) => `${name} pricing documentation`,
  },
  {
    key: "documentation",
    type: "documentation",
    label: (name) => `${name} product documentation`,
  },
  {
    key: "helpCenter",
    type: "documentation",
    label: (name) => `${name} help center`,
  },
  {
    key: "security",
    type: "security-source",
    label: (name) => `${name} security documentation`,
  },
];

/**
 * Research/official destinations for a product — never affiliate URLs.
 */
export function ProductOfficialLinksList({ software, className }: Props) {
  const links = resolveProductOfficialLinks(software);
  const items = ENTRIES.filter((e) => links[e.key]);

  if (items.length === 0) return null;

  return (
    <ul className={className ?? "mt-3 space-y-2 text-sm"}>
      {items.map((entry) => (
        <li key={entry.key}>
          <ExternalLink href={links[entry.key]!} type={entry.type}>
            {entry.label(software.name)}
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}

/** @internal helper re-export for evidence tables */
export function evidenceAnchorLabel(
  software: Software,
  source: Software["sources"][number],
): string {
  return descriptiveSourceAnchor(source, software.name);
}
