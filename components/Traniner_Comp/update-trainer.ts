'use server'
import { createClient } from "@/utils/supabase/server";
import { TrainerProfileSchema } from "@/utils/validation/ProfileSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateTrainer(formData: z.infer<typeof TrainerProfileSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");
  const updateTrainer = {
      specialization: formData.specialization,
      hourly_rate: formData.hourly_rate,
      is_active: formData.is_active,
  }
  const { error } = await supabase
    .from("trainers")
    .update(updateTrainer)
    .eq("user_id", user.id)

  if (error) {
    console.error('Detailed error:', error); 
    throw new Error(`Trainer update failed: ${error.message}`);
  }

  revalidatePath("/dashboard/trainer/profile");
}