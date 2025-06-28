import { createClient } from "@/utils/supabase/server";
  export async function getProgramsForCurrentTrainer(trainerId: string) {
    const supabase = await createClient();

    const { data: programsPreview, error } = await supabase
    .from('training_programs')
    .select(
      `*,
        program_modules_v2 (
        id,
        title,
        description,
        order_index,
        content_type,
        content_url,
        content_title,
        content_description,
        duration_minutes
      )`
    )
    .eq('trainer_id', trainerId)
    .eq('is_public', true) 
    .order('created_at', { ascending: false });

    if (error) throw error;
    return programsPreview || [];
  }
  
