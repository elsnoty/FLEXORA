//trainee/programs/[id]/page.tsx
import { notFound } from "next/navigation";
import ProgramDetailsView from "@/components/Programs/ProgramDetailsView";
import { createClient } from "@/utils/supabase/server";

export default async function TraineeProgramPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
  const supabase =await createClient();
    const {id} = await params  
  const { data: program, error } = await supabase
    .from('training_programs')
    .select(`
      *,
      program_modules (
        *,
        module_content (
          *
        )
      ),
      profiles!inner(*)
    `)
    .eq('id', id)
    .single();

  if (error || !program) notFound();

  return <ProgramDetailsView program={program} isTraineeView={true} />;
}