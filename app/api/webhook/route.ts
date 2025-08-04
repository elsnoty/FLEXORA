// api/webhook/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";
type PaymobPayload = {
    obj: {
      amount_cents?: number;
      created_at?: string;
      currency?: string;
      error_occured?: boolean;
      has_parent_transaction?: boolean;
      id?: number;
      integration_id?: number;
      is_3d_secure?: boolean;
      is_auth?: boolean;
      is_capture?: boolean;
      is_refunded?: boolean;
      is_standalone_payment?: boolean;
      is_voided?: boolean;
      order?: { id?: number };
      owner?: number;
      pending?: boolean;
      source_data?: {
        pan?: string;
        sub_type?: string;
        type?: string;
      };
      success?: boolean;
    };
  };
  
export async function POST(req: Request) {
    const supabase = await createClient();
    const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET!;
    
    try {
        // 1. Parse and verify the incoming request
        const rawBody = await req.text();
        const payload = JSON.parse(rawBody);
        const url = new URL(req.url);
        const receivedHmac = url.searchParams.get('hmac');

        console.log("Webhook payload received:", JSON.stringify(payload, null, 2));

        // 2. Verify HMAC for security
        if (!receivedHmac || !verifyPaymobHmac(payload, receivedHmac, PAYMOB_HMAC_SECRET)) {
            console.error("HMAC verification failed");
            return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
        }

        // 3. Check if payment was successful
        if (!payload?.obj?.success) {
            console.error("Payment not successful:", payload?.obj);
            return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
        }

        // 4. Extract payment ID using multiple fallback methods
        let paymentId = payload.obj.merchant_order_id;
        
        // Method 1: From redirection_url
        if (!paymentId && payload.obj.payment_key_claims?.redirection_url) {
            const redirectUrl = payload.obj.payment_key_claims.redirection_url;
            const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
            paymentId = urlParams.get('payment_id');
        }

        // Method 2: From transaction description
        if (!paymentId) {
            const description = payload.obj.order?.items?.[0]?.description;
            if (description) {
                const match = description.match(/Payment ID:([a-f0-9-]+)/);
                if (match) paymentId = match[1];
            }
        }

        // Method 3: Search by transaction amount and time
        if (!paymentId) {
            const amountCents = payload.obj.amount_cents;
            const transactionTime = payload.obj.created_at;
            
            const { data: payments } = await supabase
                .from('payments')
                .select('id, amount, created_at')
                .eq('status', 'pending')
                .eq('amount', amountCents / 100)
                .gte('created_at', new Date(new Date(transactionTime).getTime() - 10 * 60 * 1000).toISOString())
                .limit(1);

            if (payments && payments.length > 0) {
                paymentId = payments[0].id;
                console.log("Found payment by amount and time:", paymentId);
            }
        }

        if (!paymentId) {
            console.error("Could not find payment reference");
            return NextResponse.json({ error: "Missing payment reference" }, { status: 400 });
        }

        console.log("Processing payment ID:", paymentId);

        // 5. Check if payment exists
        const { data: existingPayment, error: paymentCheckError } = await supabase
            .from('payments')
            .select('*, session_id')
            .eq('id', paymentId)
            .single();

        if (paymentCheckError || !existingPayment) {
            console.error("Payment not found:", paymentCheckError);
            return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        if (existingPayment.status === 'success') {
            console.log("Payment already processed");
            return NextResponse.json({ success: true, message: "Already processed" });
        }

        // 6. Update payment status
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
            console.error("Payment update failed:", updateError);
            return NextResponse.json({ error: "Payment update failed" }, { status: 500 });
        }

        // 7. Update associated session if exists
        if (existingPayment.session_id) {
            const { error: sessionUpdateError } = await supabase
                .from('sessions')
                .update({ 
                    payment_status: 'paid',
                    payment_id: paymentId, // Link the session to this payment
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingPayment.session_id);

            if (sessionUpdateError) {
                console.error("Session update failed:", sessionUpdateError);
                return NextResponse.json({ error: "Session update failed" }, { status: 500 });
            }
            console.log("Session updated successfully");
        }

        console.log("Payment webhook processed successfully");
        return NextResponse.json({ success: true });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Webhook error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

function verifyPaymobHmac(payload: PaymobPayload, receivedHmac: string, secret: string): boolean {
    try {
        const obj = payload.obj;
        
        const stringToHash = [
            String(obj.amount_cents ?? ''),
            String(obj.created_at ?? ''),
            String(obj.currency ?? ''),
            String(obj.error_occured ?? ''),
            String(obj.has_parent_transaction ?? ''),
            String(obj.id ?? ''),
            String(obj.integration_id ?? ''),
            String(obj.is_3d_secure ?? ''),
            String(obj.is_auth ?? ''),
            String(obj.is_capture ?? ''),
            String(obj.is_refunded ?? ''),
            String(obj.is_standalone_payment ?? ''),
            String(obj.is_voided ?? ''),
            String(obj.order?.id ?? ''),
            String(obj.owner ?? ''),
            String(obj.pending ?? ''),
            String(obj.source_data?.pan ?? ''),
            String(obj.source_data?.sub_type ?? ''),
            String(obj.source_data?.type ?? ''),
            String(obj.success ?? '')
        ].join('');

        const calculatedHmac = crypto
            .createHmac('sha512', secret)
            .update(stringToHash)
            .digest('hex');

        return calculatedHmac === receivedHmac;
    } catch (error: unknown) {
        console.error("HMAC calculation error:", error);
        return false;
    }
}