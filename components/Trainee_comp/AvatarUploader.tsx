import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile } from "@/Types/profiles";
import { useEffect, useState } from "react";

export default function AvatarUpload({
file,
profile,
handleFileChange,
isLoading,
}: {
file: File | null;
profile: Profile;
handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
isLoading: boolean;
}) {
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

useEffect(() => {
if (file) {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
} else {
    setPreviewUrl(profile.avatar_url ?? null);
}
}, [file, profile.avatar_url]);

return (
<div className="flex items-center gap-6">
        <Avatar className="w-20 h-20 cursor-pointer rounded-full">
        <AvatarImage src={previewUrl || ""} alt="User avatar" />
        <AvatarFallback>{profile.name?.[0] ?? "NA"}</AvatarFallback>
        </Avatar>
    <div>
    <Label htmlFor="avatarUpload">Change Avatar</Label>
    <Input
        id="avatarUpload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isLoading}
    />
    </div>
</div>
);
}
