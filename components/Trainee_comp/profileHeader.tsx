import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Profile } from "@/Types/profiles";
import {
Dialog,
DialogTrigger,
DialogContent,
DialogTitle,
} from "@/components/ui/dialog"; 
import Image from "next/image";

export default function ProfileHeader({ profile }: { profile: Profile }) {
return (
<div className="flex items-center gap-4">
    <Dialog>
    <DialogTrigger asChild>
        <Avatar className="w-20 h-20 cursor-pointer hover:opacity-80 rounded-full">
        <AvatarImage src={profile.avatar_url || ""} alt="User avatar" />
        <AvatarFallback>{profile.name?.[0] ?? "NA"}</AvatarFallback>
        </Avatar>
    </DialogTrigger>
    <DialogContent className="max-w-sm space-y-4">
        <DialogTitle>Preview</DialogTitle>

        <div className="w-full aspect-square relative rounded-full overflow-hidden">
        {profile.avatar_url ? (
            <Image
            src={profile.avatar_url}
            alt="User avatar preview"
            fill
            className="object-cover"
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

    <div>
    <p className="text-lg font-semibold">{profile.name}</p>
    <p className="text-sm text-muted-foreground text-wrap">{profile.email}</p>
    </div>
</div>
);
}
