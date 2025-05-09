import { updateProfile } from "@/components/Trainee_comp/actions/update-profile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "./use-toast";
import { ProfileFormValues } from "@/components/Trainee_comp/profileForm";

export const useProfileUpdate = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      return true; // Indicate success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, error };
};