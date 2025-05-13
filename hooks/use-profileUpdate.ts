import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "./use-toast";
import { updateProfile } from "@/components/Trainee_comp/update-profile";
import { ProfileFormValues } from "@/components/shared/profileForm";

export const useProfileUpdate = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSubmit = async (
    formData: ProfileFormValues,
    file: File | null
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateProfile(formData, file);
      router.refresh();
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setIsSheetOpen(false);
      return true; 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      setIsSheetOpen(false);
      return false; 
    } finally {
      setIsLoading(false); 
    }
  };

  return { handleSubmit, isLoading, error, isSheetOpen, setIsSheetOpen };
};