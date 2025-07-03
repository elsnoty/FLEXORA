// /app/api/sessions/book/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { trainerId, date, durationHours = 1 } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { error } = await supabase.from("sessions").insert({
        trainer_id: trainerId,
        trainee_id: user.id,
        start_time: date,
        end_time: new Date(new Date(date).getTime() + durationHours * 60 * 60 * 1000),
        status: "pending",
        duration_hours: durationHours,
        payment_status: "unpaid",
    });

    if (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to book" }, { status: 500 });
    }

    return NextResponse.json({ message: "Booked" }, { status: 200 });
}
