// trainer/programs/[programId]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// app/api/trainer/programs/[programId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { programId: string } }
) {
  const supabase = await createClient();
  
  try {
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
      .eq('id', params.programId)
      .single();

    if (error) throw error;
    if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });

    // Sort modules by order_index
    const sortedProgram = {
      ...program,
      program_modules_v2: program.program_modules_v2?.sort((a: any, b: any) => a.order_index - b.order_index) || []
    };

    return NextResponse.json(sortedProgram);
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}