'use client';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleTheme } from "@/utils/toggle-theme";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ProfileAvatarH } from "@/Types/userAavatar";

interface HeaderTraineeProps {
  ownProfile: ProfileAvatarH | null;
}

export default function HeaderTrainee({ ownProfile }: HeaderTraineeProps) {
  return (
    <header className="fixed top-0 z-30 w-full h-[72px] border-b bg-background px-4 flex items-center justify-end">
      <div className="flex items-center space-x-4">
        {/* Search now on the right */}
        <div className="relative hidden md:flex items-center w-64">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search trainers..."
            className="pl-9 w-full"
          />
        </div>
        <ToggleTheme />
        {ownProfile && (
          <Link href="/trainee/profile">
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
        )}
      </div>
    </header>
  );
}