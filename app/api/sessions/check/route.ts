import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const trainerId = searchParams.get("trainerId");

  // Validate inputs
    if (!trainerId) {
    return NextResponse.json(
        { error: "Trainer ID is required" },
        { status: 400 }
    );
    }

    const { data: { user }} = await supabase.auth.getUser();

    if (!user) {
    return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
    );
    }

    try {
    const { data, error } = await supabase
        .from("sessions")
        .select("id, status")
        .eq("trainer_id", trainerId)
        .eq("trainee_id", user.id)
        .in("status", ["pending", "accepted"])
        .limit(1);

    if (error) throw error;

    return NextResponse.json({ 
        hasBooked: data.length > 0,
        currentStatus: data[0]?.status || null 
    });
    
    } catch (error) {
    console.error("Check booking error:", error);
    return NextResponse.json(
        { error: "Failed to check booking status" },
        { status: 500 }
    );
}
}