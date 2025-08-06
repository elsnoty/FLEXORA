'use client';
import { ToggleTheme } from "@/utils/toggle-theme";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ProfileAvatarH } from "@/Types/userAavatar";

interface HeaderTraineeProps {
  ownProfile: ProfileAvatarH | null;
}

export default function HeaderTrainee({ ownProfile }: HeaderTraineeProps) {
  return (
    <header className="fixed top-0 z-30 w-full h-[72px] px-4 flex items-center justify-end bg-background">
      <div className="flex items-center space-x-4">
        <ToggleTheme />
        {ownProfile && (
          <div>
          <Link href={`/${ownProfile.role}/profile/${ownProfile.id}`}>
            <Avatar className="w-10 h-10 rounded-full overflow-hidden">
              {ownProfile.avatar_url ? (
                <AvatarImage
                  src={ownProfile.avatar_url}
                  alt="User avatar"
                  className="object-cover w-10 h-10 rounded-full"
                />
              ) : (
                <AvatarFallback className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                  CN
                </AvatarFallback>
              )}
            </Avatar>
          </Link>
          </div>
        )}
      </div>
    </header>
  );
}