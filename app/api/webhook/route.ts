import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { VerifyPaymobHmac } from "@/utils/VerifyPaymobHmac";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    const url = new URL(req.url);
    const receivedHmac = url.searchParams.get('hmac');

    if (!receivedHmac || !VerifyPaymobHmac(payload, receivedHmac, process.env.PAYMOB_HMAC_SECRET!)) {
      return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
    }

    if (!payload?.obj?.success) {
      return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
    }

    let paymentId = payload.obj.merchant_order_id;
    
    if (!paymentId && payload.obj.payment_key_claims?.redirection_url) {
      const urlParams = new URLSearchParams(payload.obj.payment_key_claims.redirection_url.split('?')[1]);
      paymentId = urlParams.get('payment_id');
    }

    //this if he couldn't acces the merchant_order_id then apply this niggro
    // if (!paymentId) {
    //   const description = payload.obj.order?.items?.[0]?.description;
    //   if (description) {
    //     const match = description.match(/Payment ID:([a-f0-9-]+)/);
    //     if (match) paymentId = match[1];
    //   }
    // }

    if (!paymentId) {
      return NextResponse.json({ error: "Missing payment reference" }, { status: 400 });
    }

    const { data: existingPayment, error: paymentCheckError } = await supabase
      .from('payments')
      .select('*, session_id')
      .eq('id', paymentId)
      .single();

    if (paymentCheckError || !existingPayment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (existingPayment.status === 'success') {
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update({ 
        status: 'success',
        paymob_id: payload.obj.id.toString(),
        paymob_order_id: payload.obj.order?.id?.toString(),
        paid_at: new Date().toISOString()
      })
      .eq('id', paymentId);

    if (updateError) {
      return NextResponse.json({ error: "Payment update failed" }, { status: 500 });
    }

        // Handle program-specific logic
    if (existingPayment.program_id) {
      // 1. Grant program access
      const { error: accessError } = await supabase
        .from('program_access')
        .upsert({
          trainee_id: existingPayment.trainee_id,
          program_id: existingPayment.program_id,
          payment_id: paymentId,
          expires_at: null // Set expiry if subscription-based
        });

      if (accessError) {
        console.error("Failed to grant program access:", accessError);
      }
    } 
    else if (existingPayment.session_id) {
      // Existing session logic (unchanged)
      await supabase
        .from('sessions')
        .update({ payment_status: 'paid' })
        .eq('id', existingPayment.session_id);
    }

    if (existingPayment.session_id) {
      const { error: sessionUpdateError } = await supabase
        .from('sessions')
        .update({ 
          payment_status: 'paid',
          payment_id: paymentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPayment.session_id);

      if (sessionUpdateError) {
        return NextResponse.json({ error: "Session update failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment processing failed' },
      { status: 500 }
    );
  }
}