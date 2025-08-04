import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const supabase = await createClient();

    if (!sessionId) {
        return NextResponse.json(
            { error: "Session ID required" },
            { status: 400 }
        );
    }

    // Direct database check bypassing any caching
    const { data, error } = await supabase
        .from("sessions")
        .select("payment_status")
        .eq("id", sessionId)
        .maybeSingle();

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({
        paid: data?.payment_status?.toLowerCase() === "paid"
    });
}