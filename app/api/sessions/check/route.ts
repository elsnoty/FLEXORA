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
    // Get current time for comparison
    const currentTime = new Date().toISOString();
    
    const { data, error } = await supabase
        .from("sessions")
        .select("id, status, start_time")
        .eq("trainer_id", trainerId)
        .eq("trainee_id", user.id)
        .in("status", ["pending", "accepted"])
        .gte("start_time", currentTime) // Only future sessions
        .limit(1);

    if (error) throw error;

    // Check if there's any pending or accepted session that's still in the future
    const hasActiveBooking = data.length > 0;

    return NextResponse.json({ 
        hasBooked: hasActiveBooking,
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