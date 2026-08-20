/**
 * Optional site-wide announcement bar.
 * Do not use for individual affiliate promotions.
 */
export type SiteAnnouncement = {
  id: string;
  message: string;
  href?: string;
  enabled: boolean;
};

export const siteAnnouncement: SiteAnnouncement = {
  id: "none",
  message: "",
  enabled: false,
};

export function SiteAnnouncementBar() {
  if (!siteAnnouncement.enabled || !siteAnnouncement.message) return null;
  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="border-b border-[var(--color-border)] bg-[var(--color-accent-soft)] py-2 text-center text-sm text-[var(--color-fg)]"
    >
      {siteAnnouncement.href ? (
        <a href={siteAnnouncement.href} className="underline-offset-2 hover:underline">
          {siteAnnouncement.message}
        </a>
      ) : (
        siteAnnouncement.message
      )}
    </div>
  );
}
