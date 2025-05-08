'use server'
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function updateProfile(name: string, file: File | null) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let avatar_url = null;

  if (file) {
    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024;
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, or WebP images allowed');
    }
    if (file.size > maxSize) {
      throw new Error('Image must be smaller than 2MB');
    }

    // Cleanup old avatar
    const { data: oldFiles } = await supabase.storage
      .from('avatar')
      .list(`${user.id}/`);
    
    if (oldFiles?.length) {
      await supabase.storage
        .from('avatar')
        .remove(oldFiles.map(f => `${user.id}/${f.name}`));
    }

    // Upload new avatar
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

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatar")
      .getPublicUrl(fileName);
    
    avatar_url = publicUrl;
  }

  // Update profile
  const { error } = await supabase
    .from("profiles")
    .update({ 
      name, 
      ...(avatar_url && { avatar_url }),
      updated_at: new Date().toISOString()
    })
    .eq("user_id", user.id);

  if (error) throw new Error(`Profile update failed: ${error.message}`);

  revalidatePath("/dashboard/trainee/profile");
}