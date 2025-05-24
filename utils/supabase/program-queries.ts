// lib/supabase/program-queries.ts
import { createClient } from "@/utils/supabase/server";
  
export async function getFullProgramPreview(programId: string) {
  const supabase = await createClient();
  
  const { data: program, error } = await supabase
    .from('training_programs')
    .select(`
      *,
      program_modules(
        *,
        module_content(*)
      )
    `)
    .eq('id', programId)
    .single();

  if (error) throw error;
  
  return {
    ...program,
    program_modules: program.program_modules?.sort((a: any, b: any) => a.order_index - b.order_index) || []
  };
}

  export async function getProgramsForCurrentTrainer(trainerId: string) {
    const supabase = await createClient();

    const { data: programsPreview, error } = await supabase
    .from('training_programs')
    .select(
      `*,
        program_modules (
          id,
          title,
          description,
          order_index,
          module_content (
            id,
            content_type,
            content_url,
            title,
            description,
            duration_minutes
          )
        )`
    )
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false });

    if (error) throw error;
    return programsPreview || [];
  }
  

  export async function getCurrentUserPrograms() {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return [];
    }
  
    const { data, error } = await supabase
    .from('training_programs')
    .select(
      `*`
    )
    .eq('trainer_id', user.id)
    .order('created_at', { ascending: false });
  
    if (error) throw error;
    return data || [];
  }