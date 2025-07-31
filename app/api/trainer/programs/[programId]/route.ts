// trainer/programs/[programId]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ProgramModule } from "@/Types/programsType";
import { TrainingProgram } from "@/Types/TraineeSearch";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ programId: string }> }
) {
  const supabase = await createClient();
  
  try {
    const { programId } = await params;
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
      .eq('id', programId)
      .single();

    if (error) throw error;
    if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });

    // Sort modules by order_index
    const sortedProgram = {
      ...program,
      program_modules_v2: (program.program_modules_v2 as ProgramModule[])
      .sort((a, b)=> (a.order_index - b.order_index))
    };

    return NextResponse.json(sortedProgram as TrainingProgram);
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}