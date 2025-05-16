'use client';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Profile } from "@/Types/profiles";
import Image from "next/image";

export default function AvatarDialog({ profile }: { profile: Profile }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className="w-20 h-20 cursor-pointer hover:opacity-80 rounded-full">
          <AvatarImage src={profile.avatar_url || ""} alt="User avatar" />
          <AvatarFallback>{profile.name?.[0] ?? "NA"}</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="max-w-sm space-y-4">
        <DialogTitle>Preview</DialogTitle>
        <DialogDescription>
          Adjust the image to fit your avatar.
        </DialogDescription>
        <div className="w-full aspect-square relative rounded-full overflow-hidden">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="User avatar preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Avatar className="w-full h-full">
              <AvatarFallback className="text-4xl">
                {profile.name?.[0] ?? "NA"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}