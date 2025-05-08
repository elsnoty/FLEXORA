import { updateProfile } from "@/components/Trainee_comp/actions/update-profile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "./use-toast";

export const useProfileUpdate = () => {
const router = useRouter();
const { toast } = useToast();
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent, name: string, file: File | null) => {
e.preventDefault();
setIsLoading(true);
setError(null);

try {
    await updateProfile(name, file);
    router.refresh();
    toast({
    title: "Success",
    description: "Profile updated successfully!",
    });
} catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
    setError(errorMessage);
    toast({
    variant: "destructive",
    title: "Error",
    description: errorMessage,
    });
} finally {
    setIsLoading(false);
}
};

return { handleSubmit, isLoading, error };
};