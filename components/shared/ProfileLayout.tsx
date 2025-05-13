'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import dynamic from 'next/dynamic';
import { Profile } from "@/Types/profiles";
import { useProfileUpdate } from "@/hooks/use-profileUpdate";
import AvatarUpload from "./AvatarUploader";
import ProfileForm, { ProfileFormValues } from "./profileForm";
import ProfileHeader from "./profileHeader";
import ProfileDetails from "./profileDetails";

const CropModal = dynamic(() => import('@/components/shared/cropModal'), { ssr: false });

export default function ProfileLayout({ profile }: { profile: Profile }) {
  const [file, setFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const { handleSubmit, isLoading, error, isSheetOpen, setIsSheetOpen } = useProfileUpdate();

  const defaultValues: ProfileFormValues = {
    name: profile.name,
    bio: profile.bio || '',
    height: profile.height || null,
    weight: profile.weight || null,
    location: profile.location || '',
    phone_number: profile.phone_number || ''
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsCropModalOpen(true);
      setIsSheetOpen(true);
    }
  };

  const handleFormSubmit = async (data: ProfileFormValues): Promise<void> => {
    await handleSubmit(data, file);
    setIsSheetOpen(false);
  };

  return (
    <div className="w-full px-4 mt-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Here&apos;s your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileHeader profile={profile} />
          <ProfileDetails profile={profile} />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="mt-4">Update Profile</Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto max-h-screen w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Edit Profile</SheetTitle>
                <SheetDescription>
                  Make changes and save your profile information.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <AvatarUpload
                  file={file}
                  profile={profile}
                  handleFileChange={handleFileChange}
                  isLoading={isLoading}
                />
                <ProfileForm
                  defaultValues={defaultValues}
                  handleSubmit={handleFormSubmit}
                  isLoading={isLoading}
                  error={error}
                  file={file}
                />
              </div>
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>
      <CropModal
        file={file}
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onConfirm={(croppedFile: File) => setFile(croppedFile)}
      />
    </div>
  );
}