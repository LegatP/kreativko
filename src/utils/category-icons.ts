import {
  BalloonIcon,
  TextAaIcon,
  HeartIcon,
  ConfettiIcon,
  SunIcon,
  UsersThreeIcon,
  SquaresFourIcon,
  Icon,
} from "@phosphor-icons/react";

// Map of category slugs to their icons
// Icons cannot be stored in Firestore, so we map them by slug
const CATEGORY_ICONS: Record<string, Icon> = {
  "majice-za-rojstni-dan": BalloonIcon,
  "motivi-z-napisi": TextAaIcon,
  "za-pare": HeartIcon,
  "smešni-motivi": ConfettiIcon,
  "za-vsak-dan": SunIcon,
  "družinski": UsersThreeIcon,
};

/**
 * Get the icon component for a category by slug.
 * Returns SquaresFourIcon as fallback if the slug is not found in the mapping.
 */
export function getCategoryIcon(slug: string): Icon {
  return CATEGORY_ICONS[slug] || SquaresFourIcon;
}
