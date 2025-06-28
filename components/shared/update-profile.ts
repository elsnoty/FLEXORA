'use server'
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ProfileSchema, TrainerProfileSchema } from "@/utils/validation/ProfileSchema";
import { CombinedFormValues } from "./profileForm";
import { updateTrainer } from "../Trainer_comp/update-trainer";
import { uploadAvatar } from "@/utils/uploadAvatar";

export async function updateProfile(
  rawFormData: CombinedFormValues,
  file: File | null,
  role: 'trainer' | 'trainee'
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const result = ProfileSchema.safeParse(rawFormData);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  const formData = result.data;

  let avatar_url = null;

  if (file) {
    try {
      // Use the uploadAvatar utility
      avatar_url = await uploadAvatar(user.id, file);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  const updates = {
    name: formData.name,
    bio: formData.bio || null,
    height: formData.height,
    weight: formData.weight,
    location: formData.location || null,
    phone_number: formData.phone_number || null,
    ...(avatar_url && { avatar_url }),
    updated_at: new Date().toISOString()
  };

  const { error: profileError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id);

  if (role === 'trainer') {
    // Validate trainer data first
    const resutTrainer = TrainerProfileSchema.safeParse(rawFormData)

    if (!resutTrainer.success) {
      throw new Error(resutTrainer.error.errors[0].message);
    }

    const trainerData = resutTrainer.data
    
    const { data: existingTrainer, error: fetchError } = await supabase
      .from('trainers')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (fetchError && !existingTrainer) {
      // If no record exists, create one
      const { error: insertError } = await supabase
        .from('trainers')
        .insert({
          user_id: user.id,
          ...trainerData
        });
      
      if (insertError) throw new Error(`Trainer creation failed: ${insertError.message}`);
    } else {
      await updateTrainer(trainerData);
    }
  }

  if (profileError) throw new Error(`Profile update failed: ${profileError.message}`);

  revalidatePath(`/dashboard/${role}/profile`);
}