import { Profile } from "@/Types/profiles";
import AvatarDialog from "@/components/shared/AvatarDialog"; 

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-center gap-4">
      <AvatarDialog profile={profile} />
      <div>
        <p className="text-lg font-semibold">{profile.name}</p>
        <p className="text-sm text-muted-foreground text-wrap">{profile.email}</p>
      </div>
    </div>
  );
}