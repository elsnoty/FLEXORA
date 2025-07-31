import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const payload = await req.json();

  // Verify the webhook (optional: validate Paymob HMAC signature)
  if (payload.obj.success === true) {
    const { error } = await supabase
      .from("sessions")
      .update({ 
        payment_status: "paid",
        payment_id: payload.obj.order.id 
      })
      .eq("id", payload.obj.order.merchant_order_id); 

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

return new Response("OK", { status: 200 });
}