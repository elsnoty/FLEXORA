// app/actions/programs.ts
'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { 
  ProgramFormValues,
  ModuleFormValues,
  ContentFormValues
} from '@/utils/validation/Programschemas';

// Create Program
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

// Create Modules
export async function createModules(programId: string, data: ModuleFormValues) {
  const supabase = await createClient();
  
  const modulesToInsert = data.modules.map(module => ({
    ...module,
    program_id: programId
  }));

  const { data: modules, error } = await supabase
    .from('program_modules')
    .insert(modulesToInsert)
    .select('id');

  if (error) throw error;
  return { moduleIds: modules.map(m => m.id) };
}

// Create Content
export async function createContent(data: ContentFormValues) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('module_content')
    .insert(data.moduleContents);

  if (error) throw error;
  revalidatePath('/trainer/programs');
  return { success: true };
}

// Delete Program 
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