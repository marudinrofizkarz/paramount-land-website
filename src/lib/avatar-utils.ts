// Utility functions for handling user avatars

interface UserAvatar {
  avatar_url?: string | null;
  name?: string;
  email?: string;
  username?: string;
}

/**
 * Get the avatar URL for a user with fallback options
 * Priority: database avatar_url > default avatar service > initials
 */
export function getAvatarUrl(user: UserAvatar, size: number = 32): string {
  // If user has a custom avatar in database, use it
  if (user.avatar_url) {
    return user.avatar_url;
  }

  // Fallback to Vercel's avatar service
  const identifier = user.username || user.email || user.name || "user";
  return `https://avatar.vercel.sh/${identifier}?size=${size}`;
}

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(user: UserAvatar): string {
  if (user.name) {
    return user.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  if (user.email) {
    return user.email.slice(0, 2).toUpperCase();
  }

  return "UN"; // Unknown user
}

/**
 * Check if user has a custom avatar
 */
export function hasCustomAvatar(user: UserAvatar): boolean {
  return Boolean(user.avatar_url);
}
