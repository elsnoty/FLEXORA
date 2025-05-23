// app/api/trainer/programs/[programId]/modules/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { moduleSchema } from "@/utils/validation/Programschemas";

export async function POST(
  request: Request,
  { params }: { params: { programId: string } }
) {
  const supabase = await createClient();
  
  try {
    // Parse and validate
    const body = await request.json();
    const validatedData = moduleSchema.parse(body);

    // Prepare modules with program_id
    const modulesToInsert = validatedData.modules.map(module => ({
      ...module,
      program_id: params.programId
    }));

    // Insert modules
    const { data, error } = await supabase
      .from("program_modules")
      .insert(modulesToInsert)
      .select("id");

    if (error) {
      console.error("Module creation failed:", error);
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      moduleIds: data.map(module => module.id)
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
