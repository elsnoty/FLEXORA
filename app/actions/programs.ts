'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { ProgramFormValues, ModuleFormValues } from '@/utils/validation/Programschemas';
import { Program } from '@/Types/programsType';

export async function createProgram(data: ProgramFormValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: program, error } = await supabase
    .from('training_programs')
    .insert({ ...data, trainer_id: user.id })
    .select()
    .single();

  if (error) throw error;
  revalidatePath('/trainer/programs');
  return program;
}

export async function createModules(programId: string, data: ModuleFormValues) {
  const supabase = await createClient();
  
  const modulesToInsert = data.modules.map(({id,...module}) => ({
    ...module,
    program_id: programId
  }));

  const { data: modules, error } = await supabase
    .from('program_modules_v2')
    .insert(modulesToInsert)
    .select('*');

  if (error) throw error;
  return { modules };
}

export async function deleteProgram(programId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('training_programs')
    .delete()
    .eq('id', programId)
    .eq('trainer_id', user.id);

  if (error) throw error;
  revalidatePath('/trainer/programs');
}

export async function updateProgram(programId: string, updates: Partial<Program>) {
  const supabase = await createClient();
  
  const { error: updateError } = await supabase
    .from("training_programs")
    .update(updates)
    .eq("id", programId);

  if (updateError) throw updateError;

  const { data, error: fetchError } = await supabase
    .from("training_programs")
    .select(`
      *,
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
      )
    `)
    .eq("id", programId)
    .single();

  if (fetchError) throw fetchError;
  revalidatePath('/trainer/programs');
  return data;
}

export async function updateModules(programId: string, data: ModuleFormValues) {
  const supabase = await createClient();
  
  // First delete all existing modules for this program
  await supabase
    .from('program_modules_v2')
    .delete()
    .eq('program_id', programId);

  // Insert the updated modules
  const modulesToInsert = data.modules.map(module => ({
    ...module,
    program_id: programId
  }));

  const { data: insertedModules, error: insertError } = await supabase
    .from('program_modules_v2')
    .insert(modulesToInsert)
    .select('*');

  if (insertError) throw insertError;

  // Fetch the complete program data after update
  const { data: updatedProgram, error: fetchError } = await supabase
    .from("training_programs")
    .select(`
      *,
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
      )
    `)
    .eq("id", programId)
    .single();

  if (fetchError) throw fetchError;
  revalidatePath('/trainer/programs');
  return updatedProgram;
}