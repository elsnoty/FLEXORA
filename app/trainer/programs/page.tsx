import { createClient } from '@/utils/supabase/server';
import ProgramsList from '@/components/Programs/ProgramsList';

export default async function ProgramsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: programs } = await supabase
    .from('training_programs')
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
    .eq('trainer_id', user.id)
    .order('created_at', { ascending: false });

  return <ProgramsList programs={programs || []} />;
}