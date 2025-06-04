import { createClient } from '@/utils/supabase/server';
import ProgramsList from '@/components/Programs/ProgramsList';

export default async function ProgramsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  // Fetch programs
  const { data: programs } = await supabase
    .from('training_programs')
    .select(`
      *,
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
      )
    `)
    .eq('trainer_id', user.id)
    .order('created_at', { ascending: false });

  return <ProgramsList programs={programs || []} />;
}