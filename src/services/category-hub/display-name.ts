import type { Category } from "@/domain";
import { getCategoryHubProfile } from "@/data/category-hub";

/** Short label for CTAs and nav — may clip long category names at & / comma. */
export function shortCategoryLabel(
  category: Category,
  profileShortName?: string,
): string {
  if (profileShortName) return profileShortName;
  const clipped = category.name.split(/\s*[&,/]\s*/)[0]?.trim();
  if (clipped && clipped.length >= 2 && clipped.length < category.name.length) {
    return clipped;
  }
  return category.name;
}

/**
 * Public H1 / metadata title for category hub pages.
 * Avoids "AI Software Software" and keeps title aligned with on-page H1.
 */
export function getCategoryHubDisplayName(category: Category): string {
  const profile = getCategoryHubProfile(category.slug);
  if (profile?.displayName) return profile.displayName;
  const name = category.name.trim();
  if (/\bsoftware$/i.test(name)) return name;
  return `${name} Software`;
}
