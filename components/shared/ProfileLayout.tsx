// components/shared/ProfileLayout.tsx
'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Profile } from "@/Types/profiles";
import AvatarUpload from "./AvatarUploader";
import ProfileHeader from "./profileHeader";
import ProfileDetails from "./profileDetails";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import ProfileForm, { CombinedFormValues } from "./profileForm";
import { useState } from "react";
import dynamic from 'next/dynamic';
import { useProfileUpdate } from "@/hooks/use-profileUpdate";

const CropModal = dynamic(() => import('@/components/shared/cropModal'), { ssr: false });

export default function ProfileLayout({ 
  profile,
  isEditable = true 
}: { 
  profile: Profile;
  isEditable?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const { handleSubmit, isLoading, error, isSheetOpen, setIsSheetOpen } = useProfileUpdate();

  const defaultValues: CombinedFormValues = {
    name: profile.name,
    bio: profile.bio || '',
    height: profile.height || null,
    weight: profile.weight || null,
    location: profile.location || '',
    phone_number: profile.phone_number || '',
    specialization: profile.specialization,
    hourly_rate: profile.hourly_rate,
    is_active: profile.is_active
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsCropModalOpen(true);
      setIsSheetOpen(true);
    }
  };

  const handleFormSubmit = async (data: CombinedFormValues): Promise<void> => {
    await handleSubmit(data, file, profile.role);
    setIsSheetOpen(false);
  };

  return (
    <div className="w-full px-4 mt-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isEditable ? 'Your Profile' : 'Trainer Profile'}</CardTitle>
          <CardDescription>
            {isEditable ? "Here's your personal information" : "View trainer's information"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileHeader profile={profile} />
          <ProfileDetails profile={profile} />
          
          {isEditable && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button className="mt-4 ">Update Profile</Button>
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
                    role={profile.role}
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </CardContent>
      </Card>
      
      {isEditable && (
        <CropModal
          file={file}
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          onConfirm={(croppedFile: File) => setFile(croppedFile)}
        />
      )}
    </div>
  );
}