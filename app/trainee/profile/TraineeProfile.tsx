'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import AvatarUpload from "@/components/Trainee_comp/AvatarUploader";
import ProfileForm from "@/components/Trainee_comp/profileForm";
import ProfileHeader from "@/components/Trainee_comp/profileHeader";
import ProfileDetails from "@/components/Trainee_comp/profileDetails";
import dynamic from 'next/dynamic';
import { Profile } from "@/Types/profiles";
import type { ProfileFormValues } from "@/components/Trainee_comp/profileForm";
import { useUpdateProfile } from "@/utils/ReactQuerySupa";
import { useProfileUpdate } from "@/hooks/use-profileUpdate";

const CropModal = dynamic(() => import('@/components/Trainee_comp/cropModal'), { ssr: false });

export default function TraineeProfile({ profile }: { profile: Profile }) {
  const [file, setFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const { handleSubmit, isLoading, error, isSheetOpen, setIsSheetOpen } = useProfileUpdate();
  const updateProfile = useUpdateProfile();

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
    }
  };

  const handleFormSubmit = async (data: ProfileFormValues): Promise<void> => {
    await handleSubmit(data, file, profile.user_id);
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
                  isLoading={updateProfile.isPending}
                />
                <ProfileForm
                  defaultValues={defaultValues}
                  handleSubmit={handleFormSubmit}
                  isLoading={updateProfile.isPending}
                  error={updateProfile.error?.message || null}
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