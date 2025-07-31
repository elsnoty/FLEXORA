//trainer/programs/[id]/page.tsx
import { notFound } from "next/navigation";
import ProgramDetails from "@/components/Programs/ProgramDetailsView";
import { createClient } from "@/utils/supabase/server";

export default async function ProgramPageDetails({ params }:  {params: Promise<{ id: string }>}) {
  const supabase = await createClient();
  const { id } = await params; 
  const { data: program, error } = await supabase
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
    .eq('id', id)
    .single();

  if (error || !program) notFound();
  return <ProgramDetails program={program} isTraineeView={false} />;
}