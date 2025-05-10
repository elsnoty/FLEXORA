import { useState } from 'react';
import { useUpdateProfile } from '@/utils/ReactQuerySupa';
import { useToast } from '@/hooks/use-toast';
import type { ProfileFormValues } from '@/components/Trainee_comp/profileForm';

export function useProfileUpdate() {
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSubmit = async (data: ProfileFormValues, file: File | null, userId: string): Promise<boolean> => {
    try {
      await updateProfile.mutateAsync({
        data,
        file,
        userId
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
      
      // Close the sheet after successful update
      setIsSheetOpen(false);
      return true;
    } catch (error) {
      console.error(error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleSubmit,
    isLoading: updateProfile.isPending,
    error: updateProfile.error?.message || null,
    isSheetOpen,
    setIsSheetOpen
  };
}