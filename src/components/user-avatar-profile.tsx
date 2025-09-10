import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl, getUserInitials } from "@/lib/avatar-utils";

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: {
    imageUrl?: string;
    fullName?: string | null;
    emailAddresses?: Array<{ emailAddress: string }>;
    name?: string;
    email?: string;
    avatar_url?: string;
  } | null;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
}: UserAvatarProfileProps) {
  const avatarUrl = getAvatarUrl(
    {
      avatar_url: user?.avatar_url || user?.imageUrl,
      name: user?.fullName || user?.name,
      email: user?.emailAddresses?.[0]?.emailAddress || user?.email,
    },
    32
  );

  const initials = getUserInitials({
    name: user?.fullName || user?.name,
    email: user?.emailAddresses?.[0]?.emailAddress || user?.email,
  });

  return (
    <div className="flex items-center gap-2">
      <Avatar className={className}>
        <AvatarImage src={avatarUrl} alt={user?.fullName || user?.name || ""} />
        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            {user?.fullName || user?.name || ""}
          </span>
          <span className="truncate text-xs">
            {user?.emailAddresses?.[0]?.emailAddress || user?.email || ""}
          </span>
        </div>
      )}
    </div>
  );
}
