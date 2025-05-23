// app/api/trainer/programs/[programId]/content/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { contentSchema } from "@/utils/validation/Programschemas";

export async function POST(
  request: Request,
  { params }: { params: { programId: string } }
) {
  const supabase = await createClient();
  
  try {
    // Parse and validate request
    const body = await request.json();
    const validatedData = contentSchema.parse(body);

    // Insert content
    const { error } = await supabase
      .from("module_content")
      .insert(validatedData.moduleContents);

    if (error) {
      console.error("Content creation failed:", error);
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

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