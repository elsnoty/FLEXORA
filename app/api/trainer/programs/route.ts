import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { programSchema } from "@/utils/validation/Programschemas";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the trainer profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "trainer") {
      return NextResponse.json(
        { error: "Unauthorized - Must be a trainer" },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const validatedData = programSchema.parse(body);
    console.log(validatedData)

    // Create the program
    const { data: program, error: programError } = await supabase
      .from("training_programs")
      .insert({
        trainer_id: user.id,
        ...validatedData,
      })
      .select()
      .single();

    if (programError) {
      console.error("Error creating program:", programError);
      return NextResponse.json(
        { error: "Failed to create program" },
        { status: 500 }
      );
    }

    return NextResponse.json(program);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error in program creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the trainer's programs
    const { data: programs, error: programsError } = await supabase
      .from("training_programs")
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
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false });

    if (programsError) {
      console.error("Error fetching programs:", programsError);
      return NextResponse.json(
        { error: "Failed to fetch programs" },
        { status: 500 }
      );
    }

    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error in fetching programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 