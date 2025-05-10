import { createClient } from "@/utils/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Profile } from "@/Types/profiles";
import type { ProfileFormValues } from "@/components/Trainee_comp/profileForm";

// Create a client
const supabase = createClient();

// Fetch user profile
export const useUserProfile = (userId: string | undefined) => {
return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
    if (!userId) throw new Error("User ID is required");
    
    const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, name, avatar_url, bio, height, weight, location, phone_number, gender")
        .eq("user_id", userId)
        .single();
        
    if (error) throw error;
    return data as Profile;
    },
    enabled: !!userId, 
    staleTime: 1000 * 60 * 5,
    
});
};

// Fetch current user
export const useCurrentUser = () => {
return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
    },
});
};

// Update profile mutation
export const useUpdateProfile = () => {
const queryClient = useQueryClient();

return useMutation({
    mutationFn: async ({ 
    data,
    file,
    userId
    }: { 
    data: ProfileFormValues; 
    file: File | null;
    userId: string;
    }) => {
    // Process data before sending
    const formattedData = {
        ...data,
        height: data.height ? Number(data.height) : null,
        weight: data.weight ? Number(data.weight) : null,
    };
    
    // Upload file if exists
    let avatar_url = undefined;
    
    if (file) {
        try {
        // First check if user already has avatar files
        const { data: existingFiles, error: listError } = await supabase.storage
            .from('avatar') // Verify this bucket name exists in your Supabase project
            .list(`${userId}/`);
            
        if (listError) {
            console.error("Error checking existing files:", listError);
            throw new Error(`Failed to check existing files: ${listError.message}`);
        }
        
        // Delete existing avatar files
        if (existingFiles && existingFiles.length > 0) {
            const filesToRemove = existingFiles.map(f => `${userId}/${f.name}`);
            const { error: removeError } = await supabase.storage
            .from('avatar')
            .remove(filesToRemove);
            
            if (removeError) {
            console.error("Error removing existing files:", removeError);
            }
        }

        // Upload new file
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
            .from('avatar')
            .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
            });
            
        if (uploadError) {
            console.error("Upload error:", uploadError);
            throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: publicUrl } = supabase.storage
            .from('avatar')
            .getPublicUrl(filePath);
            
        avatar_url = publicUrl.publicUrl;
        } catch (error) {
        console.error("File processing error:", error);
        throw new Error("Failed to process avatar image");
        }
    }
    
    // Update profile
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
        ...formattedData,
        ...(avatar_url ? { avatar_url } : {})
        })
        .eq('user_id', userId);
        
    if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
    }
    
    return { success: true };
    },
    onSuccess: (_, variables) => {
    // Invalidate and refetch profile query
    queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
    },
});
};