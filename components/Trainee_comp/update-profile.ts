'use server'
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { ProfileSchema, TrainerProfileSchema } from "@/utils/validation/ProfileSchema";
import { CombinedFormValues, ProfileFormValues } from "../shared/profileForm";
import { updateTrainer } from "../Trainer_comp/update-trainer";

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
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 700 * 1024; 

    if (!validTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, or WebP images allowed');
    }
    if (file.size > maxSize) {
      throw new Error('Image must be smaller than 700KB');
    }

    const { data: oldFiles } = await supabase.storage
      .from('avatar')
      .list(`${user.id}/`);

    if (oldFiles?.length) {
      await supabase.storage
        .from('avatar')
        .remove(oldFiles.map(f => `${user.id}/${f.name}`));
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatar")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: { publicUrl } } = supabase.storage
      .from("avatar")
      .getPublicUrl(fileName);

    avatar_url = publicUrl;
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

  revalidatePath("/dashboard/trainee/profile");
}