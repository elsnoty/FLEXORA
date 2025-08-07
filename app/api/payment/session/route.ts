import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
    const { sessionId } = await req.json();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
    const supabase = await createClient();

    // Verify the session actually exists in the sessions table
    const { data: actualSession, error: sessionCheckError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

    if (sessionCheckError || !actualSession) {
        return NextResponse.json({ error: "Session not found in database" }, { status: 404 });
    }

    // Check if session is already paid
    if (actualSession.payment_status === 'paid') {
        return NextResponse.json({ 
            error: "This session has already been paid for. Please check your bookings.",
            code: "SESSION_ALREADY_PAID"
        }, { status: 400 });
    }

    const { data: session } = await supabase
        .from("trainee_bookings_view")
        .select('*')
        .eq("id", sessionId)
        .single();

    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
        trainee_id: session.trainee_id,
        session_id: sessionId,
        amount: session.total_amount,
        status: 'pending',
        method: 'paymob'
        })
        .select()
        .single();

    if (paymentError) throw paymentError;

    //4- billing info
    const { data: billing, error: billingError } = await supabase
    .from("billing_info")
    .select("first_name, last_name, email, phone_number, country, city")
    .eq("user_id", actualSession.trainee_id)
    .single();

    if (billingError || !billing) {
    return NextResponse.json(
        { error: "Billing information not found. Please complete your profile first." },
        { status: 400 }
    );
    }
    const paymobResponse = await fetch('https://accept.paymob.com/v1/intention/', {
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${process.env.PAYMOB_SECRET_KEY}`
        },
        body: JSON.stringify({
        amount: Math.round(session.total_amount * 100),
        currency: "EGP",
        payment_methods: [5047697],
        items: [{
            name: "Training Session",
            amount: Math.round(session.total_amount * 100),
            description: `Session with ${session.trainer_name}`,
            //apply this if you applied the commented area in the webhook
            // description: `Session with ${session.trainer_name} (Payment ID:${payment.id})`,
        }],
        billing_data: {
            first_name: billing.first_name,
            last_name: billing.last_name,
            phone_number: billing.phone_number || "+201000000000", 
            email: billing.email,
            country: billing.country || "EGY", 
            city: billing.city || "Cairo",   
        },
        merchant_order_id: payment.id,
        expiration: 3600,
        notification_url: `${BASE_URL}/api/webhook`,
        redirection_url: `${BASE_URL}/trainee/payment/processing?payment_id=${payment.id}`,
        })
    });

    if (!paymobResponse.ok) {
        const errorData = await paymobResponse.json();
        return NextResponse.json({ error: "PayMob API error", details: errorData }, { status: paymobResponse.status });
    }

    const { client_secret } = await paymobResponse.json();
    if (!client_secret) {
        return NextResponse.json({ error: "Missing client_secret" }, { status: 500 });
    }

    return NextResponse.json({
        redirect_url: `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`
    });

    } catch (error) {
    return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Payment initialization failed' },
        { status: 500 }
    );
    }
}