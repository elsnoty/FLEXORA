import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id") || url.searchParams.get("id");
    const success = url.searchParams.get("success");
    const transactionId = url.searchParams.get("id");

    console.log("Payment success callback:");
    console.log("- Session ID:", sessionId);
    console.log("- Success:", success);
    console.log("- Transaction ID:", transactionId);
    console.log("- Full URL:", req.url);

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Missing session_id or id parameter",
          received_params: Object.fromEntries(url.searchParams.entries()),
        },
        { status: 400 }
      );
    }

    if (success !== "true") {
      return NextResponse.redirect(`https://supa-base-test-xi.vercel.app/trainee/payment/failed?session_id=${sessionId}`);
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("sessions")
      .update({
        payment_status: "paid",
        payment_id: transactionId,
      })
      .eq("id", sessionId);

    if (error) {
      console.error("Database update error:", error);
    }

    return NextResponse.redirect("https://f410e7b2d3c6.ngrok-free.app/trainee/payment/processing?session_id=" + sessionId);
  } catch (error) {
    console.error("Payment success handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}